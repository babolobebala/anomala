import { c as defineEventHandler } from '../../../../_/nitro.mjs';
import { i as importUploadedAnomaliWorkbook } from '../../../../_/anomali-import-upload.mjs';
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
import 'xlsx/xlsx.mjs';
import '../../../../_/prisma.mjs';
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

const apply_post = defineEventHandler((event) => importUploadedAnomaliWorkbook(event, true));

export { apply_post as default };
//# sourceMappingURL=apply.post.mjs.map
