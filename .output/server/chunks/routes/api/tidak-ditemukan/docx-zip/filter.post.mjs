import { c as defineEventHandler, r as readBody, e as createError, i as setHeader } from '../../../../_/nitro.mjs';
import { M as MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS, g as generateTidakDitemukanDocxZip } from '../../../../_/tidak-ditemukan-docx-zip.mjs';
import { p as parseTidakDitemukanListFilters, b as buildTidakDitemukanSlsCountQuery, a as buildTidakDitemukanAllSlsIdsQuery } from '../../../../_/tidak-ditemukan-query.mjs';
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
import 'jszip';
import '../../../../_/tidak-ditemukan-docx-filename.mjs';
import 'docx-templates';
import '../../../../_/prismaNamespace.mjs';
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

const filter_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: "Filter ZIP harus berupa objek." });
  }
  const request = body;
  const filters = parseTidakDitemukanListFilters({
    page: "1",
    pageSize: "1",
    search: request.search,
    kecamatan: request.kecamatan,
    desa: request.desa,
    namaSls: request.sls,
    ppl: request.ppl,
    pml: request.pml,
    completionStatus: request.status
  });
  const [countRow] = await prisma.$queryRaw(buildTidakDitemukanSlsCountQuery(filters));
  const totalSls = Math.max(0, Number((_a = countRow == null ? void 0 : countRow.total) != null ? _a : 0));
  if (totalSls === 0) {
    throw createError({ statusCode: 400, statusMessage: "Tidak ada SLS yang cocok dengan filter." });
  }
  if (totalSls > MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS) {
    throw createError({
      statusCode: 422,
      statusMessage: `Hasil filter berisi ${totalSls} SLS. Persempit filter hingga maksimal ${MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS} SLS untuk download ZIP.`
    });
  }
  const idSubslsValues = (await prisma.$queryRaw(
    buildTidakDitemukanAllSlsIdsQuery(filters)
  )).map((row) => row.idSubsls);
  const archive = await generateTidakDitemukanDocxZip(idSubslsValues);
  setHeader(event, "content-type", "application/zip");
  setHeader(event, "content-disposition", `attachment; filename="Tidak Ditemukan - ${idSubslsValues.length} SLS.zip"`);
  return archive;
});

export { filter_post as default };
//# sourceMappingURL=filter.post.mjs.map
