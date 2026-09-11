import { c as defineEventHandler, f as getQuery } from '../../../_/nitro.mjs';
import { p as parseAnomalyListFilters, f as buildAssignmentStatisticsQueries } from '../../../_/anomali-query.mjs';
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
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const filters = parseAnomalyListFilters(getQuery(event));
  const queries = buildAssignmentStatisticsQueries(filters);
  const [
    totalAssignmentRow,
    unhandledAssignmentRow,
    handledAssignmentRow,
    disappearedAssignmentRow,
    totalAnomalyRow,
    unhandledAnomalyRow,
    handledAnomalyRow,
    disappearedAnomalyRow
  ] = await Promise.all([
    prisma.$queryRaw(queries.totalAssignments),
    prisma.$queryRaw(queries.unhandled),
    prisma.$queryRaw(queries.handled),
    prisma.$queryRaw(queries.disappeared),
    prisma.$queryRaw(queries.totalAnomalies),
    prisma.$queryRaw(queries.unhandledAnomalies),
    prisma.$queryRaw(queries.handledAnomalies),
    prisma.$queryRaw(queries.disappearedAnomalies)
  ]);
  return {
    total: {
      assignments: toNumber((_b = (_a = totalAssignmentRow[0]) == null ? void 0 : _a.total) != null ? _b : 0),
      anomalies: toNumber((_d = (_c = totalAnomalyRow[0]) == null ? void 0 : _c.total) != null ? _d : 0)
    },
    unhandled: {
      assignments: toNumber((_f = (_e = unhandledAssignmentRow[0]) == null ? void 0 : _e.total) != null ? _f : 0),
      anomalies: toNumber((_h = (_g = unhandledAnomalyRow[0]) == null ? void 0 : _g.total) != null ? _h : 0)
    },
    handled: {
      assignments: toNumber((_j = (_i = handledAssignmentRow[0]) == null ? void 0 : _i.total) != null ? _j : 0),
      anomalies: toNumber((_l = (_k = handledAnomalyRow[0]) == null ? void 0 : _k.total) != null ? _l : 0)
    },
    disappeared: {
      assignments: toNumber((_n = (_m = disappearedAssignmentRow[0]) == null ? void 0 : _m.total) != null ? _n : 0),
      anomalies: toNumber((_p = (_o = disappearedAnomalyRow[0]) == null ? void 0 : _o.total) != null ? _p : 0)
    }
  };
});

export { statistics_get as default };
//# sourceMappingURL=statistics.get.mjs.map
