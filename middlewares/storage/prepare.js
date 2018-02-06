const fs = require('fs')
const config = require('../../config')

const fieldsConfig = config.storage.fields.map(field => field.name)

module.exports = () => {

  const prepare = (req, res, next) => {
    if (!req.upload_images) {
      return next()
    }

    const images = req.upload_images

    const removeResizedImgs = () => {
      const promises = []

      images.forEach((img) => {
        img.resized.forEach((resizedImg) => {
          const imgPath = resizedImg.path

          promises.push(new Promise((resolve, reject) => {
            fs.unlink(imgPath, (err) => {
              if (err) {
                return reject(err)
              }
              console.log('DELETED >> ', imgPath)
              resolve(imgPath)
            })
          }))
        })

      // don't need these fields stored in the db
        delete img.resized
        delete img.path
        delete img.ext
        delete img.name
      })

      return promises
    }

    return Promise.all(removeResizedImgs()).then((results) => {
      console.log('UPLOAD IS DONE!!!')
      const upload_result = {}
      images.forEach((img) => {
        const imgConfig = config.storage.fields.filter(field => field.name == img.field)[0]

        const field = img.field.split('_')[0]
        delete img.field
        delete img.sizes
        if (imgConfig.maxCount == 1) {
          upload_result[field] = img
        } else {
          upload_result[field] = upload_result[field] || []
          upload_result[field].push(img)
        }
      })
      req.upload_images = upload_result
      next()
    }).catch((err) => {
      console.log('ERROR WHEN PREPARING...')
      console.log(err)
      next(err)
    })
  }

  return prepare

}
