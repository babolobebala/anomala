import { h as readMultipartFormData, e as createError } from './nitro.mjs';
import { resolve, basename, extname } from 'node:path';
import { readFileSync } from 'node:fs';
import * as xlsxEsm from 'xlsx/xlsx.mjs';
import { createHash } from 'node:crypto';
import { p as prisma } from './prisma.mjs';

function normalizeImportData(value) {
  return String(value != null ? value : "").replace(/\r\n?/g, "\n").split("\n").map((line) => line.replace(/[ \t]+$/g, "")).join("\n").trim();
}
function lengthPrefixed(value) {
  return `${Buffer.byteLength(value, "utf8")}:${value}`;
}
function createDeterministicImportKey(fields) {
  const payload = fields.map(lengthPrefixed).join("|");
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
function normalizeAnomalyData(value) {
  return normalizeImportData(value);
}
function createAnomalyKey(assignmentId, kodeAnomali, data) {
  const normalizedData = normalizeAnomalyData(data);
  return createDeterministicImportKey([assignmentId, kodeAnomali, normalizedData]);
}

const XLSX = xlsxEsm;
const SOURCE_COLUMNS = {
  assignment_id: "assignmentId",
  id_subsls: "idSubsls",
  anomali: "kodeAnomali",
  status_alias: "statusAlias",
  nama_assignment: "namaAssignment",
  nomor_bangunan: "nomorBangunan",
  idsbr: "idsbr",
  link_fasih_edit: "linkFasihEdit",
  data: "data",
  catatan: "catatan"
};
const READ_BATCH_SIZE = 1e3;
const CREATE_BATCH_SIZE = 500;
const UPDATE_BATCH_SIZE = 100;
const DEACTIVATE_BATCH_SIZE = 1e3;
const APPLY_TRANSACTION_OPTIONS = {
  maxWait: 1e4,
  timeout: 9e5
};
class AnomaliImportFileError extends Error {
  constructor(message) {
    super(message);
    this.name = "AnomaliImportFileError";
  }
}
function emptyCounts() {
  return {
    sourceRows: 0,
    uniqueRows: 0,
    duplicateRows: 0,
    new: 0,
    existing: 0,
    reappeared: 0,
    disappeared: 0,
    invalidMasterSls: 0,
    invalidMasterAnomali: 0,
    conflictingDuplicates: 0
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
function optionalValue(value) {
  const normalized = stringValue(value).trim();
  return normalized === "" ? null : normalized;
}
function requiredValue(value) {
  return stringValue(value).trim();
}
function sourceRecordsEqual(left, right) {
  return left.assignmentId === right.assignmentId && left.idSubsls === right.idSubsls && left.kodeAnomali === right.kodeAnomali && left.statusAlias === right.statusAlias && left.namaAssignment === right.namaAssignment && left.nomorBangunan === right.nomorBangunan && left.idsbr === right.idsbr && left.linkFasihEdit === right.linkFasihEdit && left.data === right.data && left.catatan === right.catatan;
}
function toSourceRecord(values, rowNumber) {
  const assignmentId = requiredValue(values.assignment_id);
  const idSubsls = requiredValue(values.id_subsls);
  const kodeAnomali = requiredValue(values.anomali);
  if (!assignmentId || !idSubsls || !kodeAnomali) {
    return null;
  }
  const data = normalizeAnomalyData(values.data);
  return {
    assignmentId,
    idSubsls,
    kodeAnomali,
    statusAlias: optionalValue(values.status_alias),
    namaAssignment: optionalValue(values.nama_assignment),
    nomorBangunan: optionalValue(values.nomor_bangunan),
    idsbr: optionalValue(values.idsbr),
    linkFasihEdit: optionalValue(values.link_fasih_edit),
    data,
    catatan: optionalValue(values.catatan),
    anomalyKey: createAnomalyKey(assignmentId, kodeAnomali, data),
    rowNumber
  };
}
function isBlankSourceRow(values) {
  return Object.values(values).every((value) => stringValue(value).trim() === "");
}
function readWorkbook(fileBuffer, fileName, counts, issues) {
  if (extname(fileName).toLowerCase() !== ".xlsx") {
    throw new AnomaliImportFileError("Anomaly import only accepts .xlsx files.");
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
    throw new AnomaliImportFileError(message);
  }
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new AnomaliImportFileError("Workbook does not contain a worksheet.");
  }
  const sheet = workbook.Sheets[sheetName];
  const reference = sheet == null ? void 0 : sheet["!ref"];
  if (!sheet || !reference) {
    throw new AnomaliImportFileError("The first worksheet is empty.");
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
    if (Object.keys(SOURCE_COLUMNS).some((column) => rowHeaders.has(column))) {
      headerRow = row;
      rowHeaders.forEach((column, header) => headers.set(header, column));
      break;
    }
  }
  if (headerRow === -1) {
    throw new AnomaliImportFileError("Could not find an anomaly-feed header row.");
  }
  const missingColumns = Object.keys(SOURCE_COLUMNS).filter((column) => !headers.has(column));
  if (missingColumns.length > 0) {
    throw new AnomaliImportFileError(`Missing required columns: ${missingColumns.join(", ")}`);
  }
  const deduplicated = /* @__PURE__ */ new Map();
  const assignmentSls = /* @__PURE__ */ new Map();
  const assignmentConflicts = /* @__PURE__ */ new Set();
  for (let row = headerRow + 1; row <= range.e.r; row++) {
    const values = {};
    for (const sourceColumn of Object.keys(SOURCE_COLUMNS)) {
      values[sourceColumn] = cellValue(sheet, row, headers.get(sourceColumn));
    }
    if (isBlankSourceRow(values)) {
      continue;
    }
    counts.sourceRows++;
    const rowNumber = row + 1;
    const record = toSourceRecord(values, rowNumber);
    if (!record) {
      issues.push({
        code: "missing-identity-field",
        message: "assignment_id, id_subsls, and anomali are required.",
        rowNumbers: [rowNumber]
      });
      continue;
    }
    const assignedSls = assignmentSls.get(record.assignmentId);
    if (assignedSls && assignedSls !== record.idSubsls) {
      const conflictKey = `${record.assignmentId}\0${assignedSls}\0${record.idSubsls}`;
      if (!assignmentConflicts.has(conflictKey)) {
        assignmentConflicts.add(conflictKey);
        issues.push({
          code: "conflicting-assignment-sls",
          message: `assignment_id ${record.assignmentId} resolves to multiple id_subsls values.`,
          rowNumbers: [rowNumber],
          values: [assignedSls, record.idSubsls]
        });
      }
    } else {
      assignmentSls.set(record.assignmentId, record.idSubsls);
    }
    const existing = deduplicated.get(record.anomalyKey);
    if (!existing) {
      deduplicated.set(record.anomalyKey, record);
      continue;
    }
    counts.duplicateRows++;
    if (!sourceRecordsEqual(existing, record)) {
      counts.conflictingDuplicates++;
      issues.push({
        code: "conflicting-duplicate",
        message: `Rows ${existing.rowNumber} and ${record.rowNumber} share an anomalyKey but differ in persisted source fields.`,
        rowNumbers: [existing.rowNumber, record.rowNumber]
      });
    }
  }
  return [...deduplicated.values()];
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
async function findMissingMasterAnomali(database, kodeAnomaliValues) {
  const found = /* @__PURE__ */ new Set();
  for (const values of chunk(kodeAnomaliValues, READ_BATCH_SIZE)) {
    const rows = await database.masterAnomali.findMany({
      where: { kodeAnomali: { in: values } },
      select: { kodeAnomali: true }
    });
    rows.forEach((row) => found.add(row.kodeAnomali));
  }
  return new Set(kodeAnomaliValues.filter((value) => !found.has(value)));
}
async function findExistingAnomali(database, anomalyKeys) {
  const existing = /* @__PURE__ */ new Map();
  for (const keys of chunk(anomalyKeys, READ_BATCH_SIZE)) {
    const rows = await database.anomali.findMany({
      where: { anomalyKey: { in: keys } },
      select: {
        anomalyKey: true,
        isActive: true,
        isHandled: true,
        handledAt: true,
        isSesuaiLapangan: true,
        sesuaiLapanganAt: true
      }
    });
    rows.forEach((row) => existing.set(row.anomalyKey, row));
  }
  return existing;
}
function addMasterIssues(records, missingSls, missingAnomali, counts, issues) {
  counts.invalidMasterSls = records.filter((record) => missingSls.has(record.idSubsls)).length;
  counts.invalidMasterAnomali = records.filter((record) => missingAnomali.has(record.kodeAnomali)).length;
  if (missingSls.size > 0) {
    issues.push({
      code: "missing-master-sls",
      message: `${counts.invalidMasterSls} unique anomaly row(s) reference missing master_sls values.`,
      values: [...missingSls].slice(0, 20)
    });
  }
  if (missingAnomali.size > 0) {
    issues.push({
      code: "missing-master-anomali",
      message: `${counts.invalidMasterAnomali} unique anomaly row(s) reference missing master_anomali values.`,
      values: [...missingAnomali].slice(0, 20)
    });
  }
}
function createData(record, timestamp) {
  return {
    assignmentId: record.assignmentId,
    idSubsls: record.idSubsls,
    kodeAnomali: record.kodeAnomali,
    statusAlias: record.statusAlias,
    namaAssignment: record.namaAssignment,
    nomorBangunan: record.nomorBangunan,
    idsbr: record.idsbr,
    linkFasihEdit: record.linkFasihEdit,
    data: record.data,
    catatan: record.catatan,
    anomalyKey: record.anomalyKey,
    isActive: true,
    isHandled: false,
    isSesuaiLapangan: false,
    sesuaiLapanganAt: null,
    firstSeenAt: timestamp,
    lastSeenAt: timestamp
  };
}
function updateData(record, existing, timestamp) {
  return {
    assignmentId: record.assignmentId,
    idSubsls: record.idSubsls,
    kodeAnomali: record.kodeAnomali,
    statusAlias: record.statusAlias,
    namaAssignment: record.namaAssignment,
    nomorBangunan: record.nomorBangunan,
    idsbr: record.idsbr,
    linkFasihEdit: record.linkFasihEdit,
    data: record.data,
    catatan: record.catatan,
    isActive: true,
    lastSeenAt: timestamp,
    ...!existing.isActive ? {
      isHandled: false,
      handledAt: null
    } : {}
  };
}
async function applyReconciliation(database, records, existingByKey, disappearedUnhandledIds, disappearedHandledIds, timestamp) {
  const newRecords = records.filter((record) => !existingByKey.has(record.anomalyKey));
  const existingRecords = records.filter((record) => existingByKey.has(record.anomalyKey));
  await database.$transaction(async (transaction) => {
    for (const recordsBatch of chunk(newRecords, CREATE_BATCH_SIZE)) {
      await transaction.anomali.createMany({
        data: recordsBatch.map((record) => createData(record, timestamp))
      });
    }
    for (const recordsBatch of chunk(existingRecords, UPDATE_BATCH_SIZE)) {
      await Promise.all(recordsBatch.map((record) => transaction.anomali.update({
        where: { anomalyKey: record.anomalyKey },
        data: updateData(record, existingByKey.get(record.anomalyKey), timestamp)
      })));
    }
    for (const ids of chunk(disappearedUnhandledIds, DEACTIVATE_BATCH_SIZE)) {
      await transaction.anomali.updateMany({
        where: { id: { in: ids } },
        data: {
          isActive: false,
          isHandled: true,
          handledAt: timestamp
        }
      });
    }
    for (const ids of chunk(disappearedHandledIds, DEACTIVATE_BATCH_SIZE)) {
      await transaction.anomali.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false }
      });
    }
  }, APPLY_TRANSACTION_OPTIONS);
}
async function importAnomaliWorkbook(options) {
  var _a, _b, _c;
  if (options.filePath && options.fileBuffer) {
    throw new AnomaliImportFileError("Provide either a workbook path or buffer, not both.");
  }
  if (!options.filePath && !options.fileBuffer) {
    throw new AnomaliImportFileError("A workbook path or buffer is required.");
  }
  const filePath = options.filePath ? resolve(options.filePath) : void 0;
  const fileName = (_a = options.fileName) != null ? _a : filePath ? basename(filePath) : "upload.xlsx";
  const counts = emptyCounts();
  const issues = [];
  const timestamp = (_b = options.now) != null ? _b : /* @__PURE__ */ new Date();
  let fileBuffer;
  try {
    fileBuffer = (_c = options.fileBuffer) != null ? _c : readFileSync(filePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read workbook.";
    throw new AnomaliImportFileError(message);
  }
  const records = readWorkbook(fileBuffer, fileName, counts, issues);
  counts.uniqueRows = records.length;
  const missingSls = await findMissingMasterSls(
    options.database,
    [...new Set(records.map((record) => record.idSubsls))]
  );
  const missingAnomali = await findMissingMasterAnomali(
    options.database,
    [...new Set(records.map((record) => record.kodeAnomali))]
  );
  addMasterIssues(records, missingSls, missingAnomali, counts, issues);
  if (issues.length > 0) {
    return {
      fileName,
      importTimestamp: timestamp,
      applied: false,
      valid: false,
      counts,
      issues
    };
  }
  const sourceKeys = records.map((record) => record.anomalyKey);
  const sourceKeySet = new Set(sourceKeys);
  const existingByKey = await findExistingAnomali(options.database, sourceKeys);
  const activeRows = await options.database.anomali.findMany({
    where: { isActive: true },
    select: {
      id: true,
      anomalyKey: true,
      isActive: true,
      isHandled: true,
      handledAt: true,
      isSesuaiLapangan: true,
      sesuaiLapanganAt: true
    }
  });
  const disappearedRows = activeRows.filter((row) => !sourceKeySet.has(row.anomalyKey));
  const disappearedUnhandledIds = disappearedRows.filter((row) => !row.isHandled).map((row) => row.id).filter((id) => Boolean(id));
  const disappearedHandledIds = disappearedRows.filter((row) => row.isHandled).map((row) => row.id).filter((id) => Boolean(id));
  records.forEach((record) => {
    const existing = existingByKey.get(record.anomalyKey);
    if (!existing) {
      counts.new++;
    } else if (existing.isActive) {
      counts.existing++;
    } else {
      counts.reappeared++;
    }
  });
  counts.disappeared = disappearedRows.length;
  if (options.apply) {
    await applyReconciliation(
      options.database,
      records,
      existingByKey,
      disappearedUnhandledIds,
      disappearedHandledIds,
      timestamp
    );
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

const IMPORT_PASSWORD = "password";
function isXlsxFileName(fileName) {
  return extname(fileName).toLowerCase() === ".xlsx";
}
function toApiResult(result) {
  return {
    applied: result.applied,
    valid: result.valid,
    counts: result.counts,
    issues: result.issues.map(({ code, message }) => ({ code, message }))
  };
}
async function importUploadedAnomaliWorkbook(event, apply) {
  var _a, _b, _c;
  const parts = await readMultipartFormData(event);
  const passwordParts = (_a = parts == null ? void 0 : parts.filter((part) => part.name === "password")) != null ? _a : [];
  const password = passwordParts.length === 1 ? (_b = passwordParts[0]) == null ? void 0 : _b.data.toString("utf8") : void 0;
  if (password !== IMPORT_PASSWORD) {
    throw createError({
      statusCode: 401,
      statusMessage: "Password import tidak valid."
    });
  }
  const fileParts = (_c = parts == null ? void 0 : parts.filter((part) => part.name === "file")) != null ? _c : [];
  const file = fileParts.length === 1 ? fileParts[0] : void 0;
  if (!(file == null ? void 0 : file.filename) || !isXlsxFileName(file.filename) || file.data.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Pilih satu file XLSX yang tidak kosong."
    });
  }
  try {
    return toApiResult(await importAnomaliWorkbook({
      database: prisma,
      fileBuffer: file.data,
      fileName: file.filename,
      apply
    }));
  } catch (error) {
    if (error instanceof AnomaliImportFileError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      });
    }
    throw error;
  }
}

export { importUploadedAnomaliWorkbook as i };
//# sourceMappingURL=anomali-import-upload.mjs.map
