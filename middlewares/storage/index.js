// /////////////////////////////////////////////////////////////////////////////
//                                                                           //
// STORAGE INTERFACE                                                         //
//                                                                           //
// /////////////////////////////////////////////////////////////////////////////

// === STORAGE PROCESS ========================================================
// Step 1 - Request  : upload files to local disk storage.
// Step 2 - Response : Extract metadata from files.
// Step 3 - Resize   : Resize images based on specified sizes and metadata.
// Step 4 - Cleanup  : Remove non-resized and other stuffs not necessary.
// Step 5 - Upload   : Send files to GCS and retrieve public url from each file.
// Step 6 - Prepare  : Create object with custom metadata and set to req.images
// ============================================================================

const request = require('./request')
const response = require('./response')
const resize = require('./resize')
const cleanup = require('./cleanup')
const upload = require('./upload')
const prepare = require('./prepare')

module.exports = {
  request,
  response,
  resize,
  cleanup,
  upload,
  prepare
}
