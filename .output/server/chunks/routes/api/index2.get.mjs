import { c as defineEventHandler, f as getQuery } from '../../_/nitro.mjs';
import { p as parseKbliListFilters, c as buildKbliAssignmentCountQuery, d as buildKbliAssignmentIdsQuery, e as buildVisibleKbliWhere, g as groupKbliRows } from '../../_/kbli-query.mjs';
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

function toNumber(value) {
  return typeof value === "bigint" ? Number(value) : Number(value);
}
const index_get = defineEventHandler(async (event) => {
  var _a;
  const filters = parseKbliListFilters(getQuery(event));
  const [countRow] = await prisma.$queryRaw(
    buildKbliAssignmentCountQuery(filters)
  );
  const totalAssignments = Math.max(0, toNumber((_a = countRow == null ? void 0 : countRow.total) != null ? _a : 0));
  const totalPages = Math.ceil(totalAssignments / filters.pageSize);
  const page = totalPages === 0 ? 1 : Math.min(filters.page, totalPages);
  const assignments = await prisma.$queryRaw(
    buildKbliAssignmentIdsQuery(filters, page)
  );
  const assignmentIds = assignments.map((assignment) => assignment.assignmentId);
  if (assignmentIds.length === 0) {
    return {
      page,
      pageSize: filters.pageSize,
      totalAssignments,
      totalPages,
      groups: []
    };
  }
  const [rows, assignmentHandlings] = await Promise.all([
    prisma.kbli.findMany({
      where: buildVisibleKbliWhere(assignmentIds, filters),
      select: {
        id: true,
        kbliKey: true,
        assignmentId: true,
        kategori: true,
        statusAlias: true,
        namaAssignment: true,
        nomorBangunan: true,
        idsbr: true,
        linkFasihEdit: true,
        data: true,
        catatan: true,
        isHandled: true,
        handledAt: true,
        masterSls: {
          select: {
            idSubsls: true,
            kecamatan: true,
            desa: true,
            namaSls: true,
            ppl: true,
            pml: true
          }
        }
      },
      orderBy: [{ assignmentId: "asc" }, { kategori: "asc" }, { id: "asc" }]
    }),
    prisma.kbliHandling.findMany({
      where: { assignmentId: { in: assignmentIds } },
      select: {
        assignmentId: true,
        eksekutor: {
          select: { id: true, nama: true }
        }
      }
    })
  ]);
  const executorsByAssignment = new Map(
    assignmentHandlings.map((handling) => [handling.assignmentId, handling.eksekutor])
  );
  return {
    page,
    pageSize: filters.pageSize,
    totalAssignments,
    totalPages,
    groups: groupKbliRows(
      assignmentIds,
      rows,
      executorsByAssignment
    )
  };
});

export { index_get as default };
//# sourceMappingURL=index2.get.mjs.map
