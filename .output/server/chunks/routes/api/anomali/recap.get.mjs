import { c as defineEventHandler } from '../../../_/nitro.mjs';
import { e as buildAnomalyRecapQuery } from '../../../_/anomali-query.mjs';
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
  return Math.max(0, Number(value != null ? value : 0));
}
const recap_get = defineEventHandler(async () => {
  const rows = await prisma.$queryRaw(buildAnomalyRecapQuery());
  return rows.map((row) => ({
    kodeAnomali: row.kodeAnomali,
    deskripsi: row.deskripsi,
    statistics: {
      total: {
        assignments: toNumber(row.totalAssignments),
        anomalies: toNumber(row.totalAnomalies)
      },
      unhandled: {
        assignments: toNumber(row.unhandledAssignments),
        anomalies: toNumber(row.unhandledAnomalies)
      },
      handled: {
        assignments: toNumber(row.handledAssignments),
        anomalies: toNumber(row.handledAnomalies)
      },
      disappeared: {
        assignments: toNumber(row.disappearedAssignments),
        anomalies: toNumber(row.disappearedAnomalies)
      }
    }
  }));
});

export { recap_get as default };
//# sourceMappingURL=recap.get.mjs.map
