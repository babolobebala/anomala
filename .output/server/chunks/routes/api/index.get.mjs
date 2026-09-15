import { c as defineEventHandler, f as getQuery } from '../../_/nitro.mjs';
import { p as parseAnomalyListFilters, b as buildAssignmentCountQuery, c as buildAssignmentIdsQuery, d as buildAssignmentAnomalyWhere, s as summarizeAnomalySubset } from '../../_/anomali-query.mjs';
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
  var _a, _b, _c, _d, _e, _f, _g;
  const filters = parseAnomalyListFilters(getQuery(event));
  const [countRow] = await prisma.$queryRaw(
    buildAssignmentCountQuery(filters)
  );
  const totalAssignments = Math.max(0, toNumber((_a = countRow == null ? void 0 : countRow.total) != null ? _a : 0));
  const totalPages = Math.ceil(totalAssignments / filters.pageSize);
  const page = totalPages === 0 ? 1 : Math.min(filters.page, totalPages);
  const assignments = await prisma.$queryRaw(
    buildAssignmentIdsQuery(filters, page)
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
    prisma.anomali.findMany({
      where: buildAssignmentAnomalyWhere(assignmentIds, filters),
      select: {
        id: true,
        anomalyKey: true,
        assignmentId: true,
        namaAssignment: true,
        nomorBangunan: true,
        idsbr: true,
        linkFasihEdit: true,
        kodeAnomali: true,
        data: true,
        catatan: true,
        statusAlias: true,
        isActive: true,
        isHandled: true,
        handledAt: true,
        handlingNote: true,
        isSesuaiLapangan: true,
        sesuaiLapanganAt: true,
        masterSls: {
          select: {
            idSubsls: true,
            kecamatan: true,
            desa: true,
            namaSls: true,
            ppl: true,
            pml: true
          }
        },
        masterAnomali: {
          select: { deskripsi: true }
        }
      },
      orderBy: [{ assignmentId: "asc" }, { kodeAnomali: "asc" }, { id: "asc" }]
    }),
    prisma.assignmentHandling.findMany({
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
  const groupsByAssignment = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const group = (_c = groupsByAssignment.get(row.assignmentId)) != null ? _c : {
      assignmentId: row.assignmentId,
      namaAssignment: row.namaAssignment,
      nomorBangunan: row.nomorBangunan,
      idsbr: row.idsbr,
      linkFasihEdit: row.linkFasihEdit,
      statusAlias: row.statusAlias,
      executor: (_b = executorsByAssignment.get(row.assignmentId)) != null ? _b : null,
      wilayah: row.masterSls,
      summary: {
        total: 0,
        handled: 0,
        unhandled: 0,
        active: 0,
        inactive: 0
      },
      anomalies: []
    };
    const anomaly = {
      id: row.id,
      anomalyKey: row.anomalyKey,
      kodeAnomali: row.kodeAnomali,
      deskripsi: row.masterAnomali.deskripsi,
      data: row.data,
      catatan: row.catatan,
      statusAlias: row.statusAlias,
      isActive: row.isActive,
      isHandled: row.isHandled,
      handledAt: (_e = (_d = row.handledAt) == null ? void 0 : _d.toISOString()) != null ? _e : null,
      handlingNote: row.handlingNote,
      isSesuaiLapangan: row.isSesuaiLapangan,
      sesuaiLapanganAt: (_g = (_f = row.sesuaiLapanganAt) == null ? void 0 : _f.toISOString()) != null ? _g : null
    };
    group.anomalies.push(anomaly);
    Object.assign(group.summary, summarizeAnomalySubset(group.anomalies));
    groupsByAssignment.set(row.assignmentId, group);
  }
  return {
    page,
    pageSize: filters.pageSize,
    totalAssignments,
    totalPages,
    groups: assignmentIds.map((assignmentId) => groupsByAssignment.get(assignmentId)).filter((group) => Boolean(group))
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
