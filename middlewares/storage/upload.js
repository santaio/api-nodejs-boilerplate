// ==========================================
// GOOGLE CLOUD STORAGE
// ==========================================

// Config
const config = require('../../config')
const knox = require('knox')

const ENV = process.env.NODE_ENV || 'development'

const S3 = knox.createClient({
  key    : config.storage.accessKeyId,
  secret : config.storage.secretAccessKey,
  region : config.storage.region,
  bucket : config.storage[ENV].bucket
})

module.exports = () => {
  
  const upload = (req, res, next) => {
    if (!req.upload_images) {
      return next()
    }

    const images = req.upload_images
    const urlsplit = req.baseUrl.split('/')
    const remotePath = urlsplit[urlsplit.length - 1] // resource's name (stores|products|...)

    console.info(`Uploading ${images.length * 3} files to ${config.storage[ENV].bucket} bucket`)

    const uploadToS3 = function (file) {
      const image_extension = file.path.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)[1]

      const fileOptions = {
        'Content-Type' : `image/${image_extension}`,
        'x-amz-acl'    : 'public-read'
      }

      return new Promise((resolve, reject) => {
        S3.putFile(file.path, `${remotePath}/${file.name}`, fileOptions, (err, res) => {
          if (err) {
            return reject(`S3 error: ${err}`, null)
          } else if (res.statusCode === 200 || res.statusCode === 307) {
            resolve(null, (res.req ? res.req.url : res.url))
          } else {
            return reject(`S3 error: status code = ${res.statusCode}`, null)
          }
        })
      })
    }


    const uploadImgs = () => {
      const promises = []

      images.forEach((img) => {
        img.resized.forEach((file, i) => {
          promises.push(uploadToS3(file).then((result) => {
            // { thumb|medium|large: resource/image.ext }
            img[file.type] = `${remotePath}/${file.name}`
            return result
          })
        )
        })
      })
      return promises
    }

    return Promise.all(uploadImgs()).then((results) => {
      console.log('UPLOAD TO AWS DONE', results)
      req.upload_images = images
      next()
    }).catch((err) => {
      console.log('FAILED TO UPLOAD IMAGES TO AWS')
      console.log(err)
      next(err)
    })
  }

  return upload

}
