import { c as defineEventHandler, g as getRouterParam, e as createError, r as readBody } from '../../../../../_/nitro.mjs';
import { a as activeAssignmentHandlingWhere } from '../../../../../_/anomali-query.mjs';
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
import '../../../../../_/prismaNamespace.mjs';
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

const handling_patch = defineEventHandler(async (event) => {
  var _a;
  const assignmentId = getRouterParam(event, "assignmentId");
  if (!assignmentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Assignment id is required."
    });
  }
  const body = await readBody(event);
  if (typeof (body == null ? void 0 : body.isHandled) !== "boolean") {
    throw createError({
      statusCode: 400,
      statusMessage: "isHandled must be a boolean."
    });
  }
  const handledAt = body.isHandled ? /* @__PURE__ */ new Date() : null;
  const result = await prisma.anomali.updateMany({
    where: body.isHandled ? activeAssignmentHandlingWhere(assignmentId) : {
      assignmentId,
      isActive: true,
      isHandled: true,
      isSesuaiLapangan: false
    },
    data: {
      isHandled: body.isHandled,
      handledAt
    }
  });
  if (result.count === 0) {
    const assignment = await prisma.anomali.findFirst({
      where: { assignmentId },
      select: { id: true }
    });
    if (!assignment) {
      throw createError({
        statusCode: 404,
        statusMessage: "Assignment not found."
      });
    }
  }
  return {
    assignmentId,
    isHandled: body.isHandled,
    handledAt: (_a = handledAt == null ? void 0 : handledAt.toISOString()) != null ? _a : null,
    updatedCount: result.count
  };
});

export { handling_patch as default };
//# sourceMappingURL=handling.patch.mjs.map
