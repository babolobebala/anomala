import { c as defineEventHandler, g as getRouterParam, e as createError, r as readBody } from '../../../../../_/nitro.mjs';
import { p as prisma } from '../../../../../_/prisma.mjs';
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

const executor_patch = defineEventHandler(async (event) => {
  const assignmentId = getRouterParam(event, "assignmentId");
  if (!assignmentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Assignment id is required."
    });
  }
  const body = await readBody(event);
  const eksekutorId = typeof (body == null ? void 0 : body.eksekutorId) === "string" ? body.eksekutorId.trim() || null : (body == null ? void 0 : body.eksekutorId) === null ? null : void 0;
  if (eksekutorId === void 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "eksekutorId must be a string or null."
    });
  }
  const assignment = await prisma.anomali.findFirst({
    where: { assignmentId },
    select: { id: true }
  });
  if (!assignment) {
    throw createError({ statusCode: 404, statusMessage: "Assignment not found." });
  }
  if (eksekutorId) {
    const eksekutor = await prisma.masterEksekutor.findUnique({
      where: { id: eksekutorId },
      select: { id: true }
    });
    if (!eksekutor) {
      throw createError({ statusCode: 400, statusMessage: "Executor not found." });
    }
  }
  const handling = await prisma.assignmentHandling.upsert({
    where: { assignmentId },
    create: { assignmentId, eksekutorId },
    update: { eksekutorId },
    select: {
      assignmentId: true,
      eksekutor: {
        select: { id: true, nama: true }
      }
    }
  });
  return handling;
});

export { executor_patch as default };
//# sourceMappingURL=executor.patch.mjs.map
