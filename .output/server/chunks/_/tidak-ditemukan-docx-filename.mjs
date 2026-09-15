import { j as useStorage } from './nitro.mjs';
import { createReport } from 'docx-templates';

const TIDAK_DITEMUKAN_TEMPLATE_KEY = "tidak-ditemukan-sls-ppl.docx";
function hasTidakDitemukanDocxSource(masterSls, assignments) {
  return Boolean(masterSls) && assignments.length > 0;
}
function buildTidakDitemukanTemplateData(input) {
  return {
    nama_ppl: input.wilayah.ppl,
    nama_sls: input.wilayah.namaSls,
    desa: input.wilayah.desa,
    kecamatan: input.wilayah.kecamatan,
    // No canonical kabupaten field exists in MasterSls; the template keeps it blank.
    kabupaten: "",
    nama_pml: input.wilayah.pml,
    assignments: input.assignments.map((assignment, index) => {
      var _a;
      return {
        no: index + 1,
        namaAssignment: assignment.namaAssignment,
        sumber: ((_a = assignment.sumber) == null ? void 0 : _a.trim()) || "-"
      };
    })
  };
}
async function loadTidakDitemukanTemplate() {
  const template = await useStorage("assets:templates").getItemRaw(
    TIDAK_DITEMUKAN_TEMPLATE_KEY
  );
  if (!template) {
    throw new Error("Tidak Ditemukan DOCX template is not available in server assets.");
  }
  return Buffer.from(template);
}
async function generateTidakDitemukanDocx(input, template) {
  const report = await createReport({
    template: await loadTidakDitemukanTemplate(),
    data: buildTidakDitemukanTemplateData(input),
    cmdDelimiter: ["{", "}"]
  });
  return Buffer.from(report);
}

function filenamePart(value) {
  return (value == null ? void 0 : value.trim().replace(/[\\/:*?"<>|\u0000-\u001F]/g, "-").replace(/\s+/g, " ")) || "-";
}
function buildTidakDitemukanDocxFilename(source) {
  return [source.kecamatan, source.desa, source.idSubsls, source.ppl, source.pml].map(filenamePart).join(" - ").concat(".docx");
}

export { buildTidakDitemukanDocxFilename as b, generateTidakDitemukanDocx as g, hasTidakDitemukanDocxSource as h };
//# sourceMappingURL=tidak-ditemukan-docx-filename.mjs.map
