import { c as defineEventHandler, f as getQuery } from '../../_/nitro.mjs';
import { p as parseTidakDitemukanListFilters, b as buildTidakDitemukanSlsCountQuery, c as buildTidakDitemukanSlsIdsQuery, g as groupTidakDitemukanRows } from '../../_/tidak-ditemukan-query.mjs';
import { p as prisma } from '../../_/prisma.mjs';
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
import '../../_/prismaNamespace.mjs';
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

const index_get = defineEventHandler(async (event) => {
  var _a;
  const filters = parseTidakDitemukanListFilters(getQuery(event));
  const [countRow] = await prisma.$queryRaw(
    buildTidakDitemukanSlsCountQuery(filters)
  );
  const totalSls = Math.max(0, Number((_a = countRow == null ? void 0 : countRow.total) != null ? _a : 0));
  const totalPages = Math.ceil(totalSls / filters.pageSize);
  const page = totalPages === 0 ? 1 : Math.min(filters.page, totalPages);
  const idSubslsValues = (await prisma.$queryRaw(
    buildTidakDitemukanSlsIdsQuery(filters, page)
  )).map((row) => row.idSubsls);
  if (idSubslsValues.length === 0) {
    return { page, pageSize: filters.pageSize, totalSls, totalPages, groups: [] };
  }
  const [rows, statuses] = await Promise.all([
    prisma.tidakDitemukanAssignment.findMany({
      where: { idSubsls: { in: idSubslsValues } },
      select: {
        id: true,
        idSubsls: true,
        namaAssignment: true,
        sumber: true,
        masterSls: {
          select: { idSubsls: true, kecamatan: true, desa: true, namaSls: true, ppl: true, pml: true }
        }
      },
      orderBy: [{ idSubsls: "asc" }, { namaAssignment: "asc" }, { id: "asc" }]
    }),
    prisma.tidakDitemukanSlsStatus.findMany({
      where: { idSubsls: { in: idSubslsValues } },
      select: { idSubsls: true, isSelesai: true, selesaiAt: true }
    })
  ]);
  return {
    page,
    pageSize: filters.pageSize,
    totalSls,
    totalPages,
    groups: groupTidakDitemukanRows(
      idSubslsValues,
      rows,
      new Map(statuses.map((status) => [status.idSubsls, status]))
    )
  };
});

export { index_get as default };
//# sourceMappingURL=index3.get.mjs.map
