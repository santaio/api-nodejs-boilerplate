const config = require('../../config')

const fieldsConfig = config.storage.fields.map(f => f.name)

module.exports = () => {
  const response = (req, res, next) => {
    console.log('FILES: ', req.files)

    if (!req.files) {
      return next()
    }

    const checkFileExists = (files) => {
      let exists = false
      Object.entries(req.files).forEach(([ key, value ]) => {
        if (fieldsConfig.indexOf(key) > -1) {
          exists = true
        }
      })
      return exists
    }

    console.log(`FILES EXISTS: ${checkFileExists(req.files)}`)

    if (!checkFileExists(req.files)) {
      return next()
    }

    let input = []

    Object.entries(req.files).forEach(([ key, value ]) => {
      input = [ ...req.files[key], ...input ]
    })

    const output = input.filter(Boolean)
    console.log('FINAL ITEMS:', output)

    const keys = Object.keys(output)

  // FILTER KEYS
    const medias = keys.map((key) => {
      const sizes = config.storage.fields.filter(f => f.name == output[key].fieldname)[0].sizes || config.storage.default_sizes

      return {
        field : output[key].fieldname,
        name  : output[key].filename,
        path  : output[key].destination,
        ext   : output[key].mimetype,
        sizes
      }
    })

  // RETURN
    console.log('PREPARED DATA: ', medias)
    req.upload_images = medias
    return next()
  }

  return response

}
