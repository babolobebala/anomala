import { j as join, s as sql, e as empty } from './prismaNamespace.mjs';

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
function booleanValue(value) {
  var _a;
  const normalized = (_a = queryString(value)) == null ? void 0 : _a.toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
}
function completionStatusValue(value) {
  const normalized = queryString(value);
  if (normalized === "unhandled" || normalized === "handled" || normalized === "disappeared") {
    return normalized;
  }
}
function parseAnomalyListFilters(query) {
  return {
    page: positiveInteger(query.page, 1, Number.MAX_SAFE_INTEGER),
    pageSize: positiveInteger(query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    search: queryString(query.search),
    kecamatan: queryString(query.kecamatan),
    desa: queryString(query.desa),
    namaSls: queryString(query.namaSls),
    ppl: queryString(query.ppl),
    pml: queryString(query.pml),
    kodeAnomali: queryString(query.kodeAnomali),
    isActive: booleanValue(query.isActive),
    completionStatus: completionStatusValue(query.completionStatus)
  };
}
function buildAssignmentAnomalyWhere(assignmentIds, filters) {
  return {
    assignmentId: { in: assignmentIds },
    ...filters.kodeAnomali ? { kodeAnomali: filters.kodeAnomali } : {}
  };
}
function isOperationallyResolved(anomaly) {
  return anomaly.isHandled || anomaly.isSesuaiLapangan;
}
function isUnresolvedActiveAnomaly(anomaly) {
  return anomaly.isActive && !isOperationallyResolved(anomaly);
}
function summarizeAnomalySubset(anomalies) {
  const active = anomalies.filter((anomaly) => anomaly.isActive);
  const unhandled = active.filter(isUnresolvedActiveAnomaly).length;
  return {
    total: anomalies.length,
    handled: anomalies.length - unhandled,
    unhandled,
    active: active.length,
    inactive: anomalies.length - active.length
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
  if (filters.kodeAnomali) {
    conditions.push(sql`a.kodeAnomali = ${filters.kodeAnomali}`);
  }
  if (filters.isActive !== void 0) {
    conditions.push(sql`a.isActive = ${filters.isActive}`);
  }
  if (filters.search) {
    conditions.push(sql`(
      LOWER(a.assignmentId) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(a.namaAssignment, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(a.nomorBangunan, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(a.idsbr, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(a.data) LIKE CONCAT('%', LOWER(${filters.search}), '%')
    )`);
  }
  return conditions;
}
function addCompletionStatusCondition(conditions, filters, completionStatus) {
  const completionCodeCondition = filters.kodeAnomali ? sql`AND completion.kodeAnomali = ${filters.kodeAnomali}` : empty;
  if (completionStatus === "unhandled") {
    conditions.push(sql`EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        ${completionCodeCondition}
        AND completion.isActive = true
        AND completion.isHandled = false
        AND completion.isSesuaiLapangan = false
    )`);
  }
  if (completionStatus === "handled") {
    conditions.push(sql`EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        ${completionCodeCondition}
        AND completion.isActive = true
    ) AND NOT EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        ${completionCodeCondition}
        AND completion.isActive = true
        AND completion.isHandled = false
        AND completion.isSesuaiLapangan = false
    )`);
  }
  if (completionStatus === "disappeared") {
    conditions.push(sql`NOT EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        ${completionCodeCondition}
        AND completion.isActive = true
    )`);
  }
}
function buildAssignmentCountQuery(filters) {
  const conditions = contextualConditions(filters);
  addCompletionStatusCondition(conditions, filters, filters.completionStatus);
  const whereClause = conditions.length > 0 ? sql`WHERE ${join(conditions, " AND ")}` : empty;
  return sql`
    SELECT COUNT(DISTINCT a.assignmentId) AS total
    FROM anomali AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    ${whereClause}
  `;
}
function anomalyMetricCondition(status) {
  if (status === "unhandled") {
    return sql`a.isActive = true AND a.isHandled = false AND a.isSesuaiLapangan = false`;
  }
  if (status === "handled") {
    return sql`a.isActive = true AND (a.isHandled = true OR a.isSesuaiLapangan = true)`;
  }
  return sql`a.isActive = false AND a.isHandled = true`;
}
function addAnomalyMetricCondition(conditions, anomalyStatus) {
  if (anomalyStatus) {
    conditions.push(anomalyMetricCondition(anomalyStatus));
  }
}
function buildAnomalyCountQuery(filters, anomalyStatus) {
  const conditions = contextualConditions(filters);
  addAnomalyMetricCondition(conditions, anomalyStatus);
  const whereClause = conditions.length > 0 ? sql`WHERE ${join(conditions, " AND ")}` : empty;
  return sql`
    SELECT COUNT(*) AS total
    FROM anomali AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    ${whereClause}
  `;
}
function buildAssignmentStatisticsQueries(filters) {
  const contextualFilters = {
    ...filters,
    completionStatus: void 0
  };
  return {
    totalAssignments: buildAssignmentCountQuery(contextualFilters),
    unhandled: buildAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: "unhandled"
    }),
    handled: buildAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: "handled"
    }),
    disappeared: buildAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: "disappeared"
    }),
    totalAnomalies: buildAnomalyCountQuery(contextualFilters),
    unhandledAnomalies: buildAnomalyCountQuery(contextualFilters, "unhandled"),
    handledAnomalies: buildAnomalyCountQuery(contextualFilters, "handled"),
    disappearedAnomalies: buildAnomalyCountQuery(contextualFilters, "disappeared")
  };
}
function buildAnomalyRecapQuery() {
  const unhandledCondition = anomalyMetricCondition("unhandled");
  const handledCondition = anomalyMetricCondition("handled");
  const disappearedCondition = anomalyMetricCondition("disappeared");
  return sql`
    SELECT
      m.kodeAnomali,
      m.deskripsi,
      COALESCE(recap.totalAssignments, 0) AS totalAssignments,
      COALESCE(recap.totalAnomalies, 0) AS totalAnomalies,
      COALESCE(recap.unhandledAssignments, 0) AS unhandledAssignments,
      COALESCE(recap.unhandledAnomalies, 0) AS unhandledAnomalies,
      COALESCE(recap.handledAssignments, 0) AS handledAssignments,
      COALESCE(recap.handledAnomalies, 0) AS handledAnomalies,
      COALESCE(recap.disappearedAssignments, 0) AS disappearedAssignments,
      COALESCE(recap.disappearedAnomalies, 0) AS disappearedAnomalies
    FROM master_anomali AS m
    LEFT JOIN (
      SELECT
        per_assignment.kodeAnomali,
        COUNT(*) AS totalAssignments,
        SUM(CASE WHEN per_assignment.hasUnhandled = 1 THEN 1 ELSE 0 END) AS unhandledAssignments,
        SUM(CASE
          WHEN per_assignment.hasActive = 1
            AND per_assignment.hasUnhandled = 0
          THEN 1
          ELSE 0
        END) AS handledAssignments,
        SUM(CASE WHEN per_assignment.hasActive = 0 THEN 1 ELSE 0 END) AS disappearedAssignments,
        SUM(per_assignment.totalAnomalies) AS totalAnomalies,
        SUM(per_assignment.unhandledAnomalies) AS unhandledAnomalies,
        SUM(per_assignment.handledAnomalies) AS handledAnomalies,
        SUM(per_assignment.disappearedAnomalies) AS disappearedAnomalies
      FROM (
        SELECT
          a.kodeAnomali,
          a.assignmentId,
          COUNT(*) AS totalAnomalies,
          SUM(CASE WHEN ${unhandledCondition} THEN 1 ELSE 0 END) AS unhandledAnomalies,
          SUM(CASE WHEN ${handledCondition} THEN 1 ELSE 0 END) AS handledAnomalies,
          SUM(CASE WHEN ${disappearedCondition} THEN 1 ELSE 0 END) AS disappearedAnomalies,
          MAX(CASE WHEN a.isActive = true THEN 1 ELSE 0 END) AS hasActive,
          MAX(CASE WHEN ${unhandledCondition} THEN 1 ELSE 0 END) AS hasUnhandled
        FROM anomali AS a
        GROUP BY a.kodeAnomali, a.assignmentId
      ) AS per_assignment
      GROUP BY per_assignment.kodeAnomali
    ) AS recap ON recap.kodeAnomali = m.kodeAnomali
    ORDER BY m.kodeAnomali ASC
  `;
}
function buildAssignmentIdsQuery(filters, page) {
  const conditions = contextualConditions(filters);
  addCompletionStatusCondition(conditions, filters, filters.completionStatus);
  const whereClause = conditions.length > 0 ? sql`WHERE ${join(conditions, " AND ")}` : empty;
  const offset = (page - 1) * filters.pageSize;
  return sql`
    SELECT a.assignmentId
    FROM anomali AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    ${whereClause}
    GROUP BY a.assignmentId
    ORDER BY a.assignmentId ASC
    LIMIT ${filters.pageSize} OFFSET ${offset}
  `;
}
function masterSlsWhere(filters) {
  return {
    ...filters.kecamatan ? { kecamatan: filters.kecamatan } : {},
    ...filters.desa ? { desa: filters.desa } : {},
    ...filters.namaSls ? { namaSls: filters.namaSls } : {}
  };
}
function activeAssignmentHandlingWhere(assignmentId) {
  return {
    assignmentId,
    isActive: true,
    isHandled: false,
    isSesuaiLapangan: false
  };
}

export { activeAssignmentHandlingWhere as a, buildAssignmentCountQuery as b, buildAssignmentIdsQuery as c, buildAssignmentAnomalyWhere as d, buildAnomalyRecapQuery as e, buildAssignmentStatisticsQueries as f, masterSlsWhere as m, parseAnomalyListFilters as p, summarizeAnomalySubset as s };
//# sourceMappingURL=anomali-query.mjs.map
