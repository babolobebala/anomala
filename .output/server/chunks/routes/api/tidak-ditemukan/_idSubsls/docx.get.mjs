import { c as defineEventHandler, g as getRouterParam, e as createError, i as setHeader } from '../../../../_/nitro.mjs';
import { h as hasTidakDitemukanDocxSource, g as generateTidakDitemukanDocx, b as buildTidakDitemukanDocxFilename } from '../../../../_/tidak-ditemukan-docx-filename.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'docx-templates';
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

const docx_get = defineEventHandler(async (event) => {
  const idSubsls = getRouterParam(event, "idSubsls");
  if (!idSubsls) {
    throw createError({ statusCode: 400, statusMessage: "idSubsls is required." });
  }
  const [assignments, masterSls] = await Promise.all([
    prisma.tidakDitemukanAssignment.findMany({
      where: { idSubsls },
      select: { namaAssignment: true, sumber: true },
      orderBy: [{ namaAssignment: "asc" }, { id: "asc" }]
    }),
    prisma.masterSls.findUnique({
      where: { idSubsls },
      select: { namaSls: true, desa: true, kecamatan: true, ppl: true, pml: true }
    })
  ]);
  if (!masterSls || !hasTidakDitemukanDocxSource(masterSls, assignments)) {
    throw createError({ statusCode: 404, statusMessage: "Tidak Ditemukan SLS not found in the active snapshot." });
  }
  const report = await generateTidakDitemukanDocx({ wilayah: masterSls, assignments });
  setHeader(event, "content-type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  setHeader(event, "content-disposition", `attachment; filename="${buildTidakDitemukanDocxFilename({ idSubsls, ...masterSls })}"`);
  return report;
});

export { docx_get as default };
//# sourceMappingURL=docx.get.mjs.map
