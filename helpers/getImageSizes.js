module.exports = (app) => {
  const baseFieldsCfg = app.config.storage.fields
  const imageSize = (field, size) => {
    const imgCfg = baseFieldsCfg.filter(f => f.name == field)[0].sizes
    return size => imgCfg.filter(cfg => cfg.type == size)[0]
  }

  return imageSize
}
