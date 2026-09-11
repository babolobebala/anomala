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

const executors_get = defineEventHandler(async () => {
  return prisma.masterEksekutor.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" }
  });
});

export { executors_get as default };
//# sourceMappingURL=executors.get.mjs.map
