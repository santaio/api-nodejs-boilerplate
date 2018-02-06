const Multer = require('multer')

module.exports = () => {
  
  const uploadDist = Multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })

  const multer = Multer({
    storage : uploadDist,
    limits  : {
      fileSize: 5 * 1024 * 1024 // no larger than 5MB
    }
  })

  return multer
}

