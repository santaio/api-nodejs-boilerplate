const sharp = require('sharp')
const shortid = require('shortid')

module.exports = () => {

  const resize = (req, res, next) => {
    if (!req.upload_images) {
      return next()
    }
  // SETUP
    const images = req.upload_images

    const resizeAll = () => {
      const promises = []
      images.forEach((img) => {
        img.resized = []
        const hash = shortid.generate()

        img.sizes.forEach((size) => {
        // const name   = `${img.name.substr(0, img.name.lastIndexOf('.'))}`;
          const ext = `${img.ext.replace('image/', '')}`
          const input = `${img.path}/${img.name}`
          const output = `${img.path}/${hash}-${size.type}.${ext}`

          try {
            if (size.options.func) {
              const image = sharp(input)
              return promises.push(
              image
                .metadata()
                .then((metadata) => {
                  const modifiedSize = size.options.func(metadata, size.options.max)
                  return image
                    .resize(modifiedSize.width, modifiedSize.height)
                    .max()
                    .toFile(output)
                })
                .then((result) => {
                  img.resized.push({
                    type : size.type,
                    name : `${hash}-${size.type}.${ext}`,
                    path : output
                  })
                })
            )
            }
          } catch (e) {}

          promises.push(
          // Resize in action!
          sharp(input)
            .resize(size.width, size.height)
            .max()
            .toFile(output)
            .then((result) => {
              img.resized.push({
                type : size.type,
                name : `${hash}-${size.type}.${ext}`,
                path : output
              })
            })
        )
        })
      })
      return promises
    }

  // .all() is only fulfilled when all its promises are fulfilled. If any of those is
  // rejected .all() is immediately rejected and discards all results from any other
  // promises. Thus, the resizing only works if all images are resized properly
    return Promise.all(resizeAll()).then((results) => {
      console.log('RESIZED FILES:', images)
      req.upload_images = images
      next()
    }).catch((error) => {
      console.log('IMAGE RESIZE FAILED >> ', error)
      next(error)
    })
  }

  return resize
}

