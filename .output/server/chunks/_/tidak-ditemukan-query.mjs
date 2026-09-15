import { s as sql, e as empty, j as join } from './prismaNamespace.mjs';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
function queryString(value) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = typeof candidate === "string" ? candidate.trim() : void 0;
  return normalized || void 0;
}
function positiveInteger(value, fallback, maximum) {
  var _a;
  const parsed = Number.parseInt((_a = queryString(value)) != null ? _a : "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
}
function completionStatusValue(value) {
  const normalized = queryString(value);
  return normalized === "unresolved" || normalized === "completed" ? normalized : void 0;
}
function parseTidakDitemukanListFilters(query) {
  return {
    page: positiveInteger(query.page, 1, Number.MAX_SAFE_INTEGER),
    pageSize: positiveInteger(query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    search: queryString(query.search),
    kecamatan: queryString(query.kecamatan),
    desa: queryString(query.desa),
    namaSls: queryString(query.namaSls),
    ppl: queryString(query.ppl),
    pml: queryString(query.pml),
    completionStatus: completionStatusValue(query.completionStatus)
  };
}
function contextualConditions(filters) {
  const conditions = [];
  if (filters.kecamatan) conditions.push(sql`sls.kecamatan = ${filters.kecamatan}`);
  if (filters.desa) conditions.push(sql`sls.desa = ${filters.desa}`);
  if (filters.namaSls) conditions.push(sql`sls.namaSls = ${filters.namaSls}`);
  if (filters.ppl) conditions.push(sql`sls.ppl = ${filters.ppl}`);
  if (filters.pml) conditions.push(sql`sls.pml = ${filters.pml}`);
  if (filters.search) {
    conditions.push(sql`(
      LOWER(a.idSubsls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(a.namaAssignment) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.namaSls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.kecamatan) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.desa) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.ppl) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.pml) LIKE CONCAT('%', LOWER(${filters.search}), '%')
    )`);
  }
  if (filters.completionStatus === "unresolved") {
    conditions.push(sql`(status.idSubsls IS NULL OR status.isSelesai = false)`);
  }
  if (filters.completionStatus === "completed") {
    conditions.push(sql`status.isSelesai = true`);
  }
  return conditions;
}
function whereClause(conditions) {
  return conditions.length > 0 ? sql`WHERE ${join(conditions, " AND ")}` : empty;
}
function buildTidakDitemukanSlsCountQuery(filters) {
  return sql`
    SELECT COUNT(DISTINCT a.idSubsls) AS total
    FROM tidak_ditemukan_assignment AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    LEFT JOIN tidak_ditemukan_slsstatus AS status ON status.idSubsls = a.idSubsls
    ${whereClause(contextualConditions(filters))}
  `;
}
function buildTidakDitemukanSlsIdsQuery(filters, page) {
  const offset = (page - 1) * filters.pageSize;
  return sql`
    SELECT a.idSubsls
    FROM tidak_ditemukan_assignment AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    LEFT JOIN tidak_ditemukan_slsstatus AS status ON status.idSubsls = a.idSubsls
    ${whereClause(contextualConditions(filters))}
    GROUP BY a.idSubsls
    ORDER BY sls.kecamatan ASC, sls.desa ASC, sls.namaSls ASC, a.idSubsls ASC
    LIMIT ${filters.pageSize} OFFSET ${offset}
  `;
}
function buildTidakDitemukanAllSlsIdsQuery(filters) {
  return sql`
    SELECT a.idSubsls
    FROM tidak_ditemukan_assignment AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    LEFT JOIN tidak_ditemukan_slsstatus AS status ON status.idSubsls = a.idSubsls
    ${whereClause(contextualConditions(filters))}
    GROUP BY a.idSubsls
    ORDER BY sls.kecamatan ASC, sls.desa ASC, sls.namaSls ASC, a.idSubsls ASC
  `;
}
function groupTidakDitemukanRows(idSubslsValues, rows, statusesBySls) {
  var _a, _b, _c;
  const groups = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const status = statusesBySls.get(row.idSubsls);
    const group = (_c = groups.get(row.idSubsls)) != null ? _c : {
      idSubsls: row.idSubsls,
      wilayah: row.masterSls,
      isSelesai: (status == null ? void 0 : status.isSelesai) === true,
      selesaiAt: (status == null ? void 0 : status.isSelesai) ? (_b = (_a = status.selesaiAt) == null ? void 0 : _a.toISOString()) != null ? _b : null : null,
      assignments: []
    };
    group.assignments.push({ id: row.id, namaAssignment: row.namaAssignment, sumber: row.sumber });
    groups.set(row.idSubsls, group);
  }
  return idSubslsValues.map((idSubsls) => groups.get(idSubsls)).filter((group) => Boolean(group));
}
function tidakDitemukanMasterSlsWhere(filters) {
  return {
    tidakDitemukanAssignments: { some: {} },
    ...filters.kecamatan ? { kecamatan: filters.kecamatan } : {},
    ...filters.desa ? { desa: filters.desa } : {},
    ...filters.namaSls ? { namaSls: filters.namaSls } : {},
    ...filters.ppl ? { ppl: filters.ppl } : {},
    ...filters.pml ? { pml: filters.pml } : {}
  };
}

export { buildTidakDitemukanAllSlsIdsQuery as a, buildTidakDitemukanSlsCountQuery as b, buildTidakDitemukanSlsIdsQuery as c, groupTidakDitemukanRows as g, parseTidakDitemukanListFilters as p, tidakDitemukanMasterSlsWhere as t };
//# sourceMappingURL=tidak-ditemukan-query.mjs.map
