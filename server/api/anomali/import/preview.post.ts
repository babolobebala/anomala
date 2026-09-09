import { importUploadedAnomaliWorkbook } from '../../../utils/anomali-import-upload'

export default defineEventHandler(event => importUploadedAnomaliWorkbook(event, false))
