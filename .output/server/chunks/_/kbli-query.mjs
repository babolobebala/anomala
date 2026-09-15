import { s as sql, e as empty, j as join } from './prismaNamespace.mjs';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
function queryString(value) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = candidate == null ? void 0 : candidate.trim();
  return normalized || void 0;
}
function positiveInteger(value, fallback, maximum) {
  var _a;
  const parsed = Number.parseInt((_a = queryString(value)) != null ? _a : "", 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(parsed, maximum);
}
function completionStatusValue(value) {
  const normalized = queryString(value);
  if (normalized === "unhandled" || normalized === "handled") {
    return normalized;
  }
}
function parseKbliListFilters(query) {
  return {
    page: positiveInteger(query.page, 1, Number.MAX_SAFE_INTEGER),
    pageSize: positiveInteger(query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    search: queryString(query.search),
    kecamatan: queryString(query.kecamatan),
    desa: queryString(query.desa),
    namaSls: queryString(query.namaSls),
    ppl: queryString(query.ppl),
    pml: queryString(query.pml),
    kategori: queryString(query.kategori),
    completionStatus: completionStatusValue(query.completionStatus)
  };
}
function buildVisibleKbliWhere(assignmentIds, filters) {
  return {
    assignmentId: { in: assignmentIds },
    ...filters.kategori ? { kategori: filters.kategori } : {}
  };
}
function kbliMasterSlsWhere(filters) {
  return {
    ...filters.kecamatan ? { kecamatan: filters.kecamatan } : {},
    ...filters.desa ? { desa: filters.desa } : {},
    ...filters.namaSls ? { namaSls: filters.namaSls } : {}
  };
}
function contextualConditions(filters) {
  const conditions = [];
  if (filters.kecamatan) {
    conditions.push(sql`sls.kecamatan = ${filters.kecamatan}`);
  }
  if (filters.desa) {
    conditions.push(sql`sls.desa = ${filters.desa}`);
  }
  if (filters.namaSls) {
    conditions.push(sql`sls.namaSls = ${filters.namaSls}`);
  }
  if (filters.ppl) {
    conditions.push(sql`sls.ppl = ${filters.ppl}`);
  }
  if (filters.pml) {
    conditions.push(sql`sls.pml = ${filters.pml}`);
  }
  if (filters.kategori) {
    conditions.push(sql`k.kategori = ${filters.kategori}`);
  }
  if (filters.search) {
    conditions.push(sql`(
      LOWER(k.assignmentId) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(k.namaAssignment, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(k.nomorBangunan, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(k.idsbr, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(k.idSubsls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.namaSls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.kecamatan) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.desa) LIKE CONCAT('%', LOWER(${filters.search}), '%')
    )`);
  }
  return conditions;
}
function addCompletionStatusCondition(conditions, filters, completionStatus) {
  const completionKategoriCondition = filters.kategori ? sql`AND completion.kategori = ${filters.kategori}` : empty;
  if (completionStatus === "unhandled") {
    conditions.push(sql`EXISTS (
      SELECT 1
      FROM kbli AS completion
      WHERE completion.assignmentId = k.assignmentId
        ${completionKategoriCondition}
        AND completion.isHandled = false
    )`);
  }
  if (completionStatus === "handled") {
    conditions.push(sql`NOT EXISTS (
      SELECT 1
      FROM kbli AS completion
      WHERE completion.assignmentId = k.assignmentId
        ${completionKategoriCondition}
        AND completion.isHandled = false
    )`);
  }
}
function whereClause(conditions) {
  return conditions.length > 0 ? sql`WHERE ${join(conditions, " AND ")}` : empty;
}
function buildKbliAssignmentCountQuery(filters) {
  const conditions = contextualConditions(filters);
  addCompletionStatusCondition(conditions, filters, filters.completionStatus);
  return sql`
    SELECT COUNT(DISTINCT k.assignmentId) AS total
    FROM kbli AS k
    INNER JOIN master_sls AS sls ON sls.idSubsls = k.idSubsls
    ${whereClause(conditions)}
  `;
}
function buildKbliFindingCountQuery(filters, handlingStatus) {
  const conditions = contextualConditions(filters);
  if (handlingStatus === "unhandled") {
    conditions.push(sql`k.isHandled = false`);
  }
  if (handlingStatus === "handled") {
    conditions.push(sql`k.isHandled = true`);
  }
  return sql`
    SELECT COUNT(*) AS total
    FROM kbli AS k
    INNER JOIN master_sls AS sls ON sls.idSubsls = k.idSubsls
    ${whereClause(conditions)}
  `;
}
function buildKbliAssignmentIdsQuery(filters, page) {
  const conditions = contextualConditions(filters);
  addCompletionStatusCondition(conditions, filters, filters.completionStatus);
  const offset = (page - 1) * filters.pageSize;
  return sql`
    SELECT k.assignmentId
    FROM kbli AS k
    INNER JOIN master_sls AS sls ON sls.idSubsls = k.idSubsls
    ${whereClause(conditions)}
    GROUP BY k.assignmentId
    ORDER BY k.assignmentId ASC
    LIMIT ${filters.pageSize} OFFSET ${offset}
  `;
}
function buildKbliStatisticsQueries(filters) {
  const contextualFilters = {
    ...filters,
    completionStatus: void 0
  };
  return {
    totalAssignments: buildKbliAssignmentCountQuery(contextualFilters),
    unhandled: buildKbliAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: "unhandled"
    }),
    handled: buildKbliAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: "handled"
    }),
    totalFindings: buildKbliFindingCountQuery(contextualFilters),
    unhandledFindings: buildKbliFindingCountQuery(contextualFilters, "unhandled"),
    handledFindings: buildKbliFindingCountQuery(contextualFilters, "handled")
  };
}
function buildKbliRecapQuery() {
  return sql`
    SELECT
      m.kode AS kategori,
      m.deskripsi,
      COALESCE(recap.totalAssignments, 0) AS totalAssignments,
      COALESCE(recap.totalFindings, 0) AS totalFindings,
      COALESCE(recap.unhandledAssignments, 0) AS unhandledAssignments,
      COALESCE(recap.unhandledFindings, 0) AS unhandledFindings,
      COALESCE(recap.handledAssignments, 0) AS handledAssignments,
      COALESCE(recap.handledFindings, 0) AS handledFindings
    FROM master_kbli_temuan AS m
    LEFT JOIN (
      SELECT
        per_assignment.kategori,
        COUNT(*) AS totalAssignments,
        SUM(CASE WHEN per_assignment.unhandledFindings > 0 THEN 1 ELSE 0 END) AS unhandledAssignments,
        SUM(CASE WHEN per_assignment.unhandledFindings = 0 THEN 1 ELSE 0 END) AS handledAssignments,
        SUM(per_assignment.totalFindings) AS totalFindings,
        SUM(per_assignment.unhandledFindings) AS unhandledFindings,
        SUM(per_assignment.handledFindings) AS handledFindings
      FROM (
        SELECT
          k.kategori,
          k.assignmentId,
          COUNT(*) AS totalFindings,
          SUM(CASE WHEN k.isHandled = false THEN 1 ELSE 0 END) AS unhandledFindings,
          SUM(CASE WHEN k.isHandled = true THEN 1 ELSE 0 END) AS handledFindings
        FROM kbli AS k
        GROUP BY k.kategori, k.assignmentId
      ) AS per_assignment
      GROUP BY per_assignment.kategori
    ) AS recap ON recap.kategori = m.kode
    ORDER BY m.kode ASC
  `;
}
function summarizeKbliSubset(findings) {
  const unhandled = findings.filter((finding) => !finding.isHandled).length;
  return {
    total: findings.length,
    handled: findings.length - unhandled,
    unhandled
  };
}
function groupKbliRows(assignmentIds, rows, executorsByAssignment = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const groupsByAssignment = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const group = (_b = groupsByAssignment.get(row.assignmentId)) != null ? _b : {
      assignmentId: row.assignmentId,
      namaAssignment: row.namaAssignment,
      nomorBangunan: row.nomorBangunan,
      idsbr: row.idsbr,
      linkFasihEdit: row.linkFasihEdit,
      statusAlias: row.statusAlias,
      executor: (_a = executorsByAssignment.get(row.assignmentId)) != null ? _a : null,
      wilayah: row.masterSls,
      summary: { total: 0, handled: 0, unhandled: 0 },
      kbli: []
    };
    group.kbli.push({
      id: row.id,
      kbliKey: row.kbliKey,
      kategori: row.kategori,
      data: row.data,
      catatan: row.catatan,
      statusAlias: row.statusAlias,
      isHandled: row.isHandled,
      handledAt: row.handledAt ? row.handledAt.toISOString() : null
    });
    Object.assign(group.summary, summarizeKbliSubset(group.kbli));
    groupsByAssignment.set(row.assignmentId, group);
  }
  return assignmentIds.map((assignmentId) => groupsByAssignment.get(assignmentId)).filter((group) => Boolean(group));
}
function buildKbliHandlingUpdate(isHandled, now) {
  return {
    isHandled,
    handledAt: isHandled ? now : null
  };
}
function buildKbliHandlingUpsert(assignmentId, eksekutorId) {
  return {
    where: { assignmentId },
    create: { assignmentId, eksekutorId },
    update: { eksekutorId }
  };
}

export { buildKbliHandlingUpsert as a, buildKbliHandlingUpdate as b, buildKbliAssignmentCountQuery as c, buildKbliAssignmentIdsQuery as d, buildVisibleKbliWhere as e, buildKbliRecapQuery as f, groupKbliRows as g, buildKbliStatisticsQueries as h, kbliMasterSlsWhere as k, parseKbliListFilters as p };
//# sourceMappingURL=kbli-query.mjs.map
