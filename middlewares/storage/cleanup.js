const fs = require('fs')


module.exports = () => {

  const clean = (req, res, next) => {
    if (!req.upload_images) {
      return next()
    }

    const images = req.upload_images
    console.log('CLEAN', images)

    const removeOriginalImgs = () => {
      const promises = []

      images.forEach((img) => {
        const imgPath = `${img.path}/${img.name}`

        promises.push(
        new Promise((resolve, reject) => {
          fs.unlink(imgPath, (err) => {
            if (err) {
              return reject(err)
            }
            console.log('DELETED >> ', imgPath)
            resolve(imgPath)
          })
        })
      )
      })
      return promises
    }

    return Promise.all(removeOriginalImgs()).then((results) => {
      console.log('DELETED SOURCE IMAGES >> ', results)
      req.upload_images = images
      next()
    }).catch((error) => {
      console.log('FAILED TO DELETE SOURCE IMAGES')
      console.log(error)
      next(error)
    })
  }

  return clean

}
