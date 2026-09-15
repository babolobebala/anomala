import { c as defineEventHandler, f as getQuery } from '../../../_/nitro.mjs';
import { p as parseTidakDitemukanListFilters, t as tidakDitemukanMasterSlsWhere } from '../../../_/tidak-ditemukan-query.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
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
import '../../../_/prismaNamespace.mjs';
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

function selectedWhere(filters, omit) {
  return tidakDitemukanMasterSlsWhere({
    ...filters,
    ...omit === "ppl" ? { ppl: void 0 } : {},
    ...omit === "pml" ? { pml: void 0 } : {}
  });
}
const filterOptions_get = defineEventHandler(async (event) => {
  const filters = parseTidakDitemukanListFilters(getQuery(event));
  const noRows = { idSubsls: { in: [] } };
  const [kecamatan, desa, namaSls, ppl, pml] = await prisma.$transaction([
    prisma.masterSls.findMany({
      where: { tidakDitemukanAssignments: { some: {} } },
      distinct: ["kecamatan"],
      select: { kecamatan: true },
      orderBy: { kecamatan: "asc" }
    }),
    filters.kecamatan ? prisma.masterSls.findMany({ where: { tidakDitemukanAssignments: { some: {} }, kecamatan: filters.kecamatan }, distinct: ["desa"], select: { desa: true }, orderBy: { desa: "asc" } }) : prisma.masterSls.findMany({ where: noRows, distinct: ["desa"], select: { desa: true }, orderBy: { desa: "asc" } }),
    filters.kecamatan && filters.desa ? prisma.masterSls.findMany({ where: { tidakDitemukanAssignments: { some: {} }, kecamatan: filters.kecamatan, desa: filters.desa }, distinct: ["namaSls"], select: { namaSls: true }, orderBy: { namaSls: "asc" } }) : prisma.masterSls.findMany({ where: noRows, distinct: ["namaSls"], select: { namaSls: true }, orderBy: { namaSls: "asc" } }),
    prisma.masterSls.findMany({ where: selectedWhere(filters, "ppl"), distinct: ["ppl"], select: { ppl: true }, orderBy: { ppl: "asc" } }),
    prisma.masterSls.findMany({ where: selectedWhere(filters, "pml"), distinct: ["pml"], select: { pml: true }, orderBy: { pml: "asc" } })
  ]);
  return {
    kecamatan: kecamatan.map((row) => row.kecamatan),
    desa: desa.map((row) => row.desa),
    namaSls: namaSls.map((row) => row.namaSls),
    ppl: ppl.map((row) => row.ppl),
    pml: pml.map((row) => row.pml)
  };
});

export { filterOptions_get as default };
//# sourceMappingURL=filter-options.get.mjs.map
