import { e as createError } from './nitro.mjs';
import JSZip from 'jszip';
import { h as hasTidakDitemukanDocxSource, g as generateTidakDitemukanDocx, b as buildTidakDitemukanDocxFilename } from './tidak-ditemukan-docx-filename.mjs';
import { p as prisma } from './prisma.mjs';

async function generateTidakDitemukanDocxZip(idSubslsValues) {
  var _a;
  const [assignments, masterSlsValues] = await Promise.all([
    prisma.tidakDitemukanAssignment.findMany({
      where: { idSubsls: { in: [...idSubslsValues] } },
      select: { idSubsls: true, namaAssignment: true, sumber: true },
      orderBy: [{ idSubsls: "asc" }, { namaAssignment: "asc" }, { id: "asc" }]
    }),
    prisma.masterSls.findMany({
      where: { idSubsls: { in: [...idSubslsValues] } },
      select: { idSubsls: true, namaSls: true, desa: true, kecamatan: true, ppl: true, pml: true }
    })
  ]);
  const assignmentsBySls = /* @__PURE__ */ new Map();
  for (const assignment of assignments) {
    assignmentsBySls.set(assignment.idSubsls, [
      ...(_a = assignmentsBySls.get(assignment.idSubsls)) != null ? _a : [],
      { namaAssignment: assignment.namaAssignment, sumber: assignment.sumber }
    ]);
  }
  const masterSlsById = new Map(masterSlsValues.map((masterSls) => [masterSls.idSubsls, masterSls]));
  const sources = idSubslsValues.map((idSubsls) => {
    var _a2;
    const masterSls = masterSlsById.get(idSubsls);
    const slsAssignments = (_a2 = assignmentsBySls.get(idSubsls)) != null ? _a2 : [];
    if (!hasTidakDitemukanDocxSource(masterSls != null ? masterSls : null, slsAssignments)) {
      throw createError({
        statusCode: 404,
        statusMessage: `Tidak Ditemukan SLS ${idSubsls} not found in the active snapshot.`
      });
    }
    return { idSubsls, masterSls, assignments: slsAssignments };
  });
  const zip = new JSZip();
  for (const source of sources) {
    const report = await generateTidakDitemukanDocx({
      wilayah: source.masterSls,
      assignments: source.assignments
    });
    zip.file(buildTidakDitemukanDocxFilename(source.masterSls), report);
  }
  return zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

const MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS = 100;
class TidakDitemukanDocxZipRequestError extends Error {
}
function parseTidakDitemukanDocxZipIds(body) {
  if (!body || typeof body !== "object" || !Array.isArray(body.idSubsls)) {
    throw new TidakDitemukanDocxZipRequestError("idSubsls must be an array.");
  }
  const suppliedIds = body.idSubsls;
  if (suppliedIds.length === 0) {
    throw new TidakDitemukanDocxZipRequestError("At least one idSubsls is required.");
  }
  if (suppliedIds.length > MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS) {
    throw new TidakDitemukanDocxZipRequestError(
      `A ZIP download can contain at most ${MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS} SLS.`
    );
  }
  const ids = [];
  const seen = /* @__PURE__ */ new Set();
  for (const value of suppliedIds) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new TidakDitemukanDocxZipRequestError("Each idSubsls must be a non-empty string.");
    }
    const idSubsls = value.trim();
    if (!seen.has(idSubsls)) {
      seen.add(idSubsls);
      ids.push(idSubsls);
    }
  }
  return ids;
}

export { MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS as M, TidakDitemukanDocxZipRequestError as T, generateTidakDitemukanDocxZip as g, parseTidakDitemukanDocxZipIds as p };
//# sourceMappingURL=tidak-ditemukan-docx-zip.mjs.map
