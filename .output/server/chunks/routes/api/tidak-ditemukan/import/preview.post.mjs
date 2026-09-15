import { c as defineEventHandler } from '../../../../_/nitro.mjs';
import { i as importUploadedTidakDitemukanWorkbook } from '../../../../_/tidak-ditemukan-import-upload.mjs';
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

const preview_post = defineEventHandler((event) => importUploadedTidakDitemukanWorkbook(event, false));

export { preview_post as default };
//# sourceMappingURL=preview.post.mjs.map
