import { c as defineEventHandler, f as getQuery } from '../../../_/nitro.mjs';
import { p as parseKbliListFilters, h as buildKbliStatisticsQueries } from '../../../_/kbli-query.mjs';
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

function toNumber(value) {
  return Math.max(0, Number(value));
}
const statistics_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const filters = parseKbliListFilters(getQuery(event));
  const queries = buildKbliStatisticsQueries(filters);
  const [
    totalAssignmentRow,
    unhandledAssignmentRow,
    handledAssignmentRow,
    totalFindingRow,
    unhandledFindingRow,
    handledFindingRow
  ] = await Promise.all([
    prisma.$queryRaw(queries.totalAssignments),
    prisma.$queryRaw(queries.unhandled),
    prisma.$queryRaw(queries.handled),
    prisma.$queryRaw(queries.totalFindings),
    prisma.$queryRaw(queries.unhandledFindings),
    prisma.$queryRaw(queries.handledFindings)
  ]);
  return {
    total: {
      assignments: toNumber((_b = (_a = totalAssignmentRow[0]) == null ? void 0 : _a.total) != null ? _b : 0),
      findings: toNumber((_d = (_c = totalFindingRow[0]) == null ? void 0 : _c.total) != null ? _d : 0)
    },
    unhandled: {
      assignments: toNumber((_f = (_e = unhandledAssignmentRow[0]) == null ? void 0 : _e.total) != null ? _f : 0),
      findings: toNumber((_h = (_g = unhandledFindingRow[0]) == null ? void 0 : _g.total) != null ? _h : 0)
    },
    handled: {
      assignments: toNumber((_j = (_i = handledAssignmentRow[0]) == null ? void 0 : _i.total) != null ? _j : 0),
      findings: toNumber((_l = (_k = handledFindingRow[0]) == null ? void 0 : _k.total) != null ? _l : 0)
    }
  };
});

export { statistics_get as default };
//# sourceMappingURL=statistics.get.mjs.map
