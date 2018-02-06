module.exports = (app) => {
  const express = require('express')
  const StorageRoutes = express.Router()
  const processStorage = app.middlewares.storage.process
  const IndexCtrl = app.resources.index.controller

  const upload = (req, res, next) => {
    if (!req.files) {
      next()
    }
    res.json({
      success : true,
      status  : 'Done!',
      data    : req.upload_images
    })
    next()
  }

    // Uploads
  StorageRoutes.post('/uploads', processStorage, upload)
  StorageRoutes.get('/', IndexCtrl.storage)

  return StorageRoutes
}
