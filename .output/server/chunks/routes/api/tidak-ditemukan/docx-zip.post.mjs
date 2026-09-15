import { c as defineEventHandler, r as readBody, e as createError, i as setHeader } from '../../../_/nitro.mjs';
import { p as parseTidakDitemukanDocxZipIds, T as TidakDitemukanDocxZipRequestError, g as generateTidakDitemukanDocxZip } from '../../../_/tidak-ditemukan-docx-zip.mjs';
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
import 'jszip';
import '../../../_/tidak-ditemukan-docx-filename.mjs';
import 'docx-templates';
import '../../../_/prisma.mjs';
import '@prisma/adapter-mariadb';
import '@prisma/client-runtime-utils';
import 'node:async_hooks';
import 'node:os';

const docxZip_post = defineEventHandler(async (event) => {
  let idSubslsValues;
  try {
    idSubslsValues = parseTidakDitemukanDocxZipIds(await readBody(event));
  } catch (error) {
    if (error instanceof TidakDitemukanDocxZipRequestError) {
      throw createError({ statusCode: 400, statusMessage: error.message });
    }
    throw error;
  }
  const archive = await generateTidakDitemukanDocxZip(idSubslsValues);
  setHeader(event, "content-type", "application/zip");
  setHeader(event, "content-disposition", `attachment; filename="Tidak Ditemukan - ${idSubslsValues.length} SLS.zip"`);
  return archive;
});

export { docxZip_post as default };
//# sourceMappingURL=docx-zip.post.mjs.map
