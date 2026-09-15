import { c as defineEventHandler } from '../../../_/nitro.mjs';
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
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

function serializeTidakDitemukanSnapshot(snapshot) {
  return snapshot && { ...snapshot, importedAt: snapshot.importedAt.toISOString() };
}

const snapshot_get = defineEventHandler(async () => {
  const snapshot = await prisma.tidakDitemukanWaktuImport.findFirst({
    select: { importedAt: true, namaFile: true, jumlahAssignment: true, jumlahSls: true },
    orderBy: { importedAt: "desc" }
  });
  return serializeTidakDitemukanSnapshot(snapshot);
});

export { snapshot_get as default };
//# sourceMappingURL=snapshot.get.mjs.map
