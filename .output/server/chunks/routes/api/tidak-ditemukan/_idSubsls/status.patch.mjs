import { c as defineEventHandler, g as getRouterParam, r as readBody, e as createError } from '../../../../_/nitro.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
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

function buildTidakDitemukanSelesaiData(now) {
  return { isSelesai: true, selesaiAt: now };
}
function shouldDeleteTidakDitemukanStatus(isSelesai) {
  return !isSelesai;
}

const status_patch = defineEventHandler(async (event) => {
  var _a, _b;
  const idSubsls = getRouterParam(event, "idSubsls");
  const body = await readBody(event);
  if (!idSubsls || typeof (body == null ? void 0 : body.isSelesai) !== "boolean") {
    throw createError({ statusCode: 400, statusMessage: "idSubsls and isSelesai are required." });
  }
  const activeAssignment = await prisma.tidakDitemukanAssignment.findFirst({
    where: { idSubsls },
    select: { id: true }
  });
  if (!activeAssignment) {
    throw createError({ statusCode: 404, statusMessage: "Tidak Ditemukan SLS not found." });
  }
  if (shouldDeleteTidakDitemukanStatus(body.isSelesai)) {
    await prisma.tidakDitemukanSlsStatus.deleteMany({ where: { idSubsls } });
    return { idSubsls, isSelesai: false, selesaiAt: null };
  }
  const status = await prisma.tidakDitemukanSlsStatus.upsert({
    where: { idSubsls },
    create: { idSubsls, ...buildTidakDitemukanSelesaiData(/* @__PURE__ */ new Date()) },
    update: buildTidakDitemukanSelesaiData(/* @__PURE__ */ new Date()),
    select: { idSubsls: true, isSelesai: true, selesaiAt: true }
  });
  return { ...status, selesaiAt: (_b = (_a = status.selesaiAt) == null ? void 0 : _a.toISOString()) != null ? _b : null };
});

export { status_patch as default };
//# sourceMappingURL=status.patch.mjs.map
