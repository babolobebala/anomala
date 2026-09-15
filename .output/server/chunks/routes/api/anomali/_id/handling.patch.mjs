import { c as defineEventHandler, g as getRouterParam, e as createError, r as readBody } from '../../../../_/nitro.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import { P as PrismaClientKnownRequestError } from '../../../../_/prismaNamespace.mjs';
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

const handling_patch = defineEventHandler(async (event) => {
  var _a, _b;
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Anomaly id is required." });
  }
  const body = await readBody(event);
  if (typeof (body == null ? void 0 : body.isHandled) !== "boolean") {
    throw createError({ statusCode: 400, statusMessage: "isHandled must be a boolean." });
  }
  try {
    const anomaly = await prisma.anomali.update({
      where: { id },
      data: {
        isHandled: body.isHandled,
        handledAt: body.isHandled ? /* @__PURE__ */ new Date() : null
      },
      select: {
        id: true,
        isHandled: true,
        handledAt: true
      }
    });
    return {
      id: anomaly.id,
      isHandled: anomaly.isHandled,
      handledAt: (_b = (_a = anomaly.handledAt) == null ? void 0 : _a.toISOString()) != null ? _b : null
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      throw createError({ statusCode: 404, statusMessage: "Anomaly not found." });
    }
    throw error;
  }
});

export { handling_patch as default };
//# sourceMappingURL=handling.patch.mjs.map
