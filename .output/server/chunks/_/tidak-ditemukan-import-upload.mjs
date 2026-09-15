import { h as readMultipartFormData, e as createError } from './nitro.mjs';
import { resolve, basename, extname } from 'node:path';
import { readFileSync } from 'node:fs';
import * as xlsxEsm from 'xlsx/xlsx.mjs';

const XLSX = xlsxEsm;
const REQUIRED_SOURCE_COLUMNS = {
  id_subsls: "idSubsls",
  nama_assignment: "namaAssignment"
};
const READ_BATCH_SIZE = 1e3;
const CREATE_BATCH_SIZE = 500;
const APPLY_TRANSACTION_OPTIONS = {
  maxWait: 1e4,
  timeout: 9e5
};
class TidakDitemukanImportFileError extends Error {
  constructor(message) {
    super(message);
    this.name = "TidakDitemukanImportFileError";
  }
}
function emptyCounts() {
  return {
    sourceRows: 0,
    jumlahAssignment: 0,
    jumlahSls: 0,
    invalidRows: 0,
    invalidMasterSls: 0
  };
}
function chunk(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}
function cellValue(sheet, row, column) {
  var _a, _b;
  const denseSheet = sheet;
  const sparseSheet = sheet;
  const cell = (_b = (_a = denseSheet[row]) == null ? void 0 : _a[column]) != null ? _b : sparseSheet[XLSX.utils.encode_cell({ r: row, c: column })];
  if (!cell) {
    return "";
  }
  return typeof cell.w === "string" ? cell.w : cell.v;
}
function stringValue(value) {
  return String(value != null ? value : "");
}
function requiredValue(value) {
  return stringValue(value).trim();
}
function optionalValue(value) {
  const normalized = requiredValue(value);
  return normalized || null;
}
function readWorkbook(fileBuffer, fileName, counts, issues) {
  if (extname(fileName).toLowerCase() !== ".xlsx") {
    throw new TidakDitemukanImportFileError("Tidak Ditemukan import only accepts .xlsx files.");
  }
  let workbook;
  try {
    workbook = XLSX.read(fileBuffer, {
      cellDates: false,
      cellFormula: false,
      cellHTML: false,
      cellNF: false,
      cellStyles: false,
      cellText: true,
      dense: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read workbook.";
    throw new TidakDitemukanImportFileError(message);
  }
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new TidakDitemukanImportFileError("Workbook does not contain a worksheet.");
  }
  const sheet = workbook.Sheets[sheetName];
  const reference = sheet == null ? void 0 : sheet["!ref"];
  if (!sheet || !reference) {
    throw new TidakDitemukanImportFileError("The first worksheet is empty.");
  }
  const range = XLSX.utils.decode_range(reference);
  let headerRow = -1;
  const headers = /* @__PURE__ */ new Map();
  for (let row = range.s.r; row <= range.e.r; row++) {
    const rowHeaders = /* @__PURE__ */ new Map();
    for (let column = range.s.c; column <= range.e.c; column++) {
      const header = stringValue(cellValue(sheet, row, column)).trim().toLowerCase();
      if (header) {
        rowHeaders.set(header, column);
      }
    }
    if (Object.keys(REQUIRED_SOURCE_COLUMNS).some((column) => rowHeaders.has(column))) {
      headerRow = row;
      rowHeaders.forEach((column, header) => headers.set(header, column));
      break;
    }
  }
  if (headerRow === -1) {
    throw new TidakDitemukanImportFileError("Could not find a Tidak Ditemukan header row.");
  }
  const missingColumns = Object.keys(REQUIRED_SOURCE_COLUMNS).filter((column) => !headers.has(column));
  if (missingColumns.length > 0) {
    throw new TidakDitemukanImportFileError(`Missing required columns: ${missingColumns.join(", ")}`);
  }
  const records = [];
  for (let row = headerRow + 1; row <= range.e.r; row++) {
    const idSubsls = requiredValue(cellValue(sheet, row, headers.get("id_subsls")));
    const namaAssignment = requiredValue(cellValue(sheet, row, headers.get("nama_assignment")));
    const sumberColumn = headers.get("sumber");
    const sumber = sumberColumn === void 0 ? null : optionalValue(cellValue(sheet, row, sumberColumn));
    if (!idSubsls && !namaAssignment) {
      continue;
    }
    counts.sourceRows++;
    const rowNumber = row + 1;
    if (!idSubsls) {
      counts.invalidRows++;
      issues.push({
        code: "missing-sls-value",
        message: "id_subsls is required.",
        rowNumbers: [rowNumber]
      });
      continue;
    }
    if (!namaAssignment) {
      counts.invalidRows++;
      issues.push({
        code: "missing-assignment-name",
        message: "nama_assignment is required.",
        rowNumbers: [rowNumber]
      });
      continue;
    }
    records.push({ idSubsls, namaAssignment, sumber, rowNumber });
  }
  return records;
}
async function findMissingMasterSls(database, idSubslsValues) {
  const found = /* @__PURE__ */ new Set();
  for (const values of chunk(idSubslsValues, READ_BATCH_SIZE)) {
    const rows = await database.masterSls.findMany({
      where: { idSubsls: { in: values } },
      select: { idSubsls: true }
    });
    rows.forEach((row) => found.add(row.idSubsls));
  }
  return new Set(idSubslsValues.filter((value) => !found.has(value)));
}
async function applyFreshImport(database, records, fileName, timestamp, counts) {
  await database.$transaction(async (transaction) => {
    await transaction.tidakDitemukanSlsStatus.deleteMany();
    await transaction.tidakDitemukanAssignment.deleteMany();
    await transaction.tidakDitemukanWaktuImport.deleteMany();
    for (const recordsBatch of chunk(records, CREATE_BATCH_SIZE)) {
      await transaction.tidakDitemukanAssignment.createMany({
        data: recordsBatch.map(({ idSubsls, namaAssignment, sumber }) => ({ idSubsls, namaAssignment, sumber }))
      });
    }
    await transaction.tidakDitemukanWaktuImport.create({
      data: {
        importedAt: timestamp,
        namaFile: fileName,
        jumlahAssignment: counts.jumlahAssignment,
        jumlahSls: counts.jumlahSls
      }
    });
  }, APPLY_TRANSACTION_OPTIONS);
}
async function importTidakDitemukanWorkbook(options) {
  var _a, _b, _c;
  if (options.filePath && options.fileBuffer) {
    throw new TidakDitemukanImportFileError("Provide either a workbook path or buffer, not both.");
  }
  if (!options.filePath && !options.fileBuffer) {
    throw new TidakDitemukanImportFileError("A workbook path or buffer is required.");
  }
  const filePath = options.filePath ? resolve(options.filePath) : void 0;
  const fileName = (_a = options.fileName) != null ? _a : filePath ? basename(filePath) : "upload.xlsx";
  const timestamp = (_b = options.now) != null ? _b : /* @__PURE__ */ new Date();
  const counts = emptyCounts();
  const issues = [];
  let fileBuffer;
  try {
    fileBuffer = (_c = options.fileBuffer) != null ? _c : readFileSync(filePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read workbook.";
    throw new TidakDitemukanImportFileError(message);
  }
  const records = readWorkbook(fileBuffer, fileName, counts, issues);
  counts.jumlahAssignment = records.length;
  counts.jumlahSls = new Set(records.map((record) => record.idSubsls)).size;
  const missingSls = await findMissingMasterSls(
    options.database,
    [...new Set(records.map((record) => record.idSubsls))]
  );
  counts.invalidMasterSls = records.filter((record) => missingSls.has(record.idSubsls)).length;
  if (missingSls.size > 0) {
    issues.push({
      code: "missing-master-sls",
      message: `${counts.invalidMasterSls} Tidak Ditemukan row(s) reference missing master_sls values.`,
      values: [...missingSls].slice(0, 20)
    });
  }
  if (issues.length > 0) {
    return { fileName, importTimestamp: timestamp, applied: false, valid: false, counts, issues };
  }
  if (options.apply) {
    await applyFreshImport(options.database, records, fileName, timestamp, counts);
  }
  return {
    fileName,
    importTimestamp: timestamp,
    applied: options.apply === true,
    valid: true,
    counts,
    issues
  };
}

class TidakDitemukanImportUploadError extends Error {
}
class TidakDitemukanImportPasswordError extends Error {
}
function expectedImportPassword() {
  return process.env.TIDAK_DITEMUKAN_IMPORT_PASSWORD || "password";
}
function assertApplyPassword(password) {
  if (password !== expectedImportPassword()) {
    throw new TidakDitemukanImportPasswordError("Password import tidak valid.");
  }
}
function isXlsxFileName(fileName) {
  return extname(fileName).toLowerCase() === ".xlsx";
}
function toApiResult(result) {
  return {
    fileName: result.fileName,
    importTimestamp: result.importTimestamp,
    applied: result.applied,
    valid: result.valid,
    counts: result.counts,
    issues: result.issues
  };
}
async function importTidakDitemukanUploadedFile(file, apply, database, password) {
  if (apply) {
    assertApplyPassword(password);
  }
  if (!(file == null ? void 0 : file.filename) || !isXlsxFileName(file.filename) || file.data.length === 0) {
    throw new TidakDitemukanImportUploadError("Pilih satu file XLSX yang tidak kosong.");
  }
  return toApiResult(await importTidakDitemukanWorkbook({
    database: await defaultImportDatabase(),
    fileBuffer: file.data,
    fileName: file.filename,
    apply
  }));
}
async function defaultImportDatabase() {
  const { prisma } = await import('./prisma.mjs').then(function (n) { return n.a; });
  return prisma;
}
async function importUploadedTidakDitemukanWorkbook(event, apply) {
  var _a, _b, _c;
  const parts = await readMultipartFormData(event);
  const fileParts = (_a = parts == null ? void 0 : parts.filter((part) => part.name === "file")) != null ? _a : [];
  const file = fileParts.length === 1 ? fileParts[0] : void 0;
  const passwordParts = (_b = parts == null ? void 0 : parts.filter((part) => part.name === "password")) != null ? _b : [];
  const password = passwordParts.length === 1 ? (_c = passwordParts[0]) == null ? void 0 : _c.data.toString("utf8") : void 0;
  try {
    return await importTidakDitemukanUploadedFile(file, apply, void 0, password);
  } catch (error) {
    if (error instanceof TidakDitemukanImportPasswordError) {
      throw createError({ statusCode: 401, statusMessage: error.message });
    }
    if (error instanceof TidakDitemukanImportFileError || error instanceof TidakDitemukanImportUploadError) {
      throw createError({ statusCode: 400, statusMessage: error.message });
    }
    throw error;
  }
}

export { importUploadedTidakDitemukanWorkbook as i };
//# sourceMappingURL=tidak-ditemukan-import-upload.mjs.map
