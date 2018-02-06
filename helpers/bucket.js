const ENV = process.env.NODE_ENV || 'development'
const knox = require('knox')
const config = require('../config')

const S3 = knox.createClient({
  key    : config.storage.accessKeyId,
  secret : config.storage.secretAccessKey,
  region : config.storage.region,
  bucket : config.storage[ENV].bucket
})

/**
 * Delete from bucket all listed files
 *
 * @param {Array} listFiles List of filenames
 * @returns
 */

function deleteFiles(listFiles) {
  const promises = listFiles.map(filename => S3.deleteFile(filename, (err, res) => {
    if (err) return `S3 error: ${err}`
  }))
  return Promise.all(promises).then(result => result)
}

/**
 * Get the list of images to delete by comparing the data from the form with the one from db
 *
 * @param {any} req
 * @param {any} res
 * @param {any} dbDoc document from db
 * @param {any} form resource from request
 * @returns list of images to delete
 */

function getImgsToDelete(req, res, dbDoc, form) {
  // if there's no image, make it an empty object
  if (!form.image) form.image = {}

  const formMedium = form.image.medium
  const dbMedium = dbDoc.image && dbDoc.image.medium
  const deleteImg = dbMedium && !formMedium
  const filesToDelete = []

  if (deleteImg) {
    filesToDelete.push(dbDoc.image.thumb)
    filesToDelete.push(dbDoc.image.medium)
    filesToDelete.push(dbDoc.image.large)
  }

  if (form.gallery && typeof form.gallery === 'object') {
    // TODO workaround, not efficient, needs improvement
    form.gallery = dbDoc.gallery.filter((dbImg) => {
      let keepIt = false
      form.gallery.forEach((formImg) => {
        if (dbImg.medium === formImg.medium) {
          keepIt = true
        }
      })
      if (!keepIt) {
        filesToDelete.push(dbImg.thumb)
        filesToDelete.push(dbImg.medium)
        filesToDelete.push(dbImg.large)
      }
      return keepIt
    })
  }

  return filesToDelete
}

module.exports = {
  deleteFiles,
  getImgsToDelete
}
