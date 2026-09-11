param(
  [string]$DeployBranch = "deploy",
  [string]$RemoteName = "origin",
  [string]$DeployRepoPath = ".deploy-repo",
  [switch]$SkipBuild,
  [switch]$SkipPush
)

$ErrorActionPreference = "Stop"

$ScriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDirectory

Set-Location $ProjectRoot

function Require-Command {
  param([string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name"
  }
}

function Remove-DeployRepo {
  param([string]$Path)

  if (Test-Path $Path) {
    Remove-Item $Path -Recurse -Force
  }
}

Require-Command git
Require-Command pnpm

#
# Resolve current source commit.
#

$SourceCommit = (& git rev-parse HEAD)

if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($SourceCommit)) {
  throw "Unable to resolve current Git commit."
}

$SourceCommit = $SourceCommit.Trim()

#
# Resolve deploy remote from this project's Git config.
#

$RemoteUrl = (& git remote get-url $RemoteName 2>$null)

if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($RemoteUrl)) {
  throw "Git remote '$RemoteName' is not configured."
}

$RemoteUrl = $RemoteUrl.Trim()

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Anomali SE26 Deployment" -ForegroundColor Cyan
Write-Host "Remote : $RemoteUrl" -ForegroundColor Cyan
Write-Host "Branch : $DeployBranch" -ForegroundColor Cyan
Write-Host "Commit : $SourceCommit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

#
# Build production artifact.
#

if (-not $SkipBuild) {
  Write-Host "Installing dependencies..." -ForegroundColor Yellow

  & pnpm install --frozen-lockfile

  if ($LASTEXITCODE -ne 0) {
    throw "pnpm install failed."
  }

  Write-Host "Generating Prisma Client..." -ForegroundColor Yellow

  & pnpm exec prisma generate

  if ($LASTEXITCODE -ne 0) {
    throw "prisma generate failed."
  }

  Write-Host "Building production artifact..." -ForegroundColor Yellow
  Write-Host "Target: Linux cPanel / Nitro node-server" -ForegroundColor DarkGray

  $PreviousNitroPreset = $env:NITRO_PRESET
  $env:NITRO_PRESET = "node-server"

  try {
    & pnpm run build

    if ($LASTEXITCODE -ne 0) {
      throw "pnpm run build failed."
    }
  }
  finally {
    if ($null -eq $PreviousNitroPreset) {
      Remove-Item Env:\NITRO_PRESET -ErrorAction SilentlyContinue
    }
    else {
      $env:NITRO_PRESET = $PreviousNitroPreset
    }
  }
}

#
# Validate production artifact.
#

$RequiredPaths = @(
  ".output/server/index.mjs",
  ".output/server/package.json",
  ".output/server/node_modules",
  "app.cjs",
  "package.json"
)

foreach ($RequiredPath in $RequiredPaths) {
  if (-not (Test-Path $RequiredPath)) {
    throw "Missing required deploy artifact: $RequiredPath"
  }
}

Write-Host "Production artifact validated." -ForegroundColor Green

#
# Always create a completely fresh temporary Git repository.
#
# The deploy branch intentionally contains only one snapshot commit.
#

Remove-DeployRepo -Path $DeployRepoPath

New-Item `
  -ItemType Directory `
  -Path $DeployRepoPath |
  Out-Null

Push-Location $DeployRepoPath

try {
  & git init --initial-branch=$DeployBranch

  if ($LASTEXITCODE -ne 0) {
    throw "Failed to initialize temporary deploy repository."
  }

  & git remote add origin $RemoteUrl

  if ($LASTEXITCODE -ne 0) {
    throw "Failed to configure deploy remote."
  }

  #
  # Reuse Git identity from the main repository when available.
  #

  $GitUserName = (& git -C $ProjectRoot config user.name 2>$null)
  $GitUserEmail = (& git -C $ProjectRoot config user.email 2>$null)

  if (-not [string]::IsNullOrWhiteSpace($GitUserName)) {
    & git config user.name $GitUserName.Trim()
  }

  if (-not [string]::IsNullOrWhiteSpace($GitUserEmail)) {
    & git config user.email $GitUserEmail.Trim()
  }
}
finally {
  Pop-Location
}

#
# Copy only files required by production.
#

Write-Host "Preparing deploy snapshot..." -ForegroundColor Yellow

Copy-Item `
  ".output" `
  -Destination (Join-Path $DeployRepoPath ".output") `
  -Recurse `
  -Force

#
# Remove source maps from production snapshot.
#

Get-ChildItem `
  (Join-Path $DeployRepoPath ".output") `
  -Recurse `
  -Filter "*.map" |
  Remove-Item -Force

Copy-Item `
  "app.cjs" `
  -Destination (Join-Path $DeployRepoPath "app.cjs") `
  -Force

Copy-Item `
  "package.json" `
  -Destination (Join-Path $DeployRepoPath "package.json") `
  -Force

Set-Content `
  -Path (Join-Path $DeployRepoPath "DEPLOY_COMMIT") `
  -Value $SourceCommit `
  -NoNewline

#
# Commit the single deployment snapshot.
#

Push-Location $DeployRepoPath

try {
  & git add -A

  if ($LASTEXITCODE -ne 0) {
    throw "Failed to stage deploy artifact."
  }

  & git commit -m "Deploy $SourceCommit"

  if ($LASTEXITCODE -ne 0) {
    throw "Failed to commit deploy artifact."
  }

  if ($SkipPush) {
    Write-Host ""
    Write-Host "Deploy snapshot prepared locally." -ForegroundColor Yellow
    Write-Host "Location: $DeployRepoPath" -ForegroundColor Yellow
    return
  }

  #
  # Intentional force push.
  #
  # Every deployment replaces origin/deploy with a fresh,
  # unrelated single root commit.
  #

  Write-Host "Pushing deploy snapshot..." -ForegroundColor Yellow

  & git push `
    --force `
    --set-upstream `
    origin `
    $DeployBranch

  if ($LASTEXITCODE -ne 0) {
    throw "Failed to push deploy snapshot."
  }

  Write-Host ""
  Write-Host "========================================" -ForegroundColor Green
  Write-Host "Deploy snapshot pushed successfully." -ForegroundColor Green
  Write-Host "Remote : $RemoteUrl" -ForegroundColor Green
  Write-Host "Branch : $DeployBranch" -ForegroundColor Green
  Write-Host "Source : $SourceCommit" -ForegroundColor Green
  Write-Host "History: single snapshot commit" -ForegroundColor Green
  Write-Host "========================================" -ForegroundColor Green
}
finally {
  Pop-Location
}

#
# Remove temporary deploy repository after successful push.
#

if (-not $SkipPush) {
  Remove-DeployRepo -Path $DeployRepoPath
}
