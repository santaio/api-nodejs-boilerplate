module.exports = app => function () {
  const _this = this
  const args = Array.prototype.slice.call(arguments, 0)

  let cb
  if (typeof args[args.length - 1] === 'function') {
    cb = args.pop()
  }

  const query = this.find.apply(this, args)
  const orgExec = query.exec

  query.exec = function (cb) {
    cb || (cb = function () {})

    let count
    let documents

    const finish = function (err) {
      if (!cb) {
        return
      }
      if (err) {
        cb(err)
        return cb = null
      }
      if (count === undefined || documents === undefined) {
        return
      }
      cb(null, documents, count)
      cb = null
    }

    orgExec.call(query, (err, _documents) => {
      if (err) {
        return finish(err)
      }
      documents = _documents
      finish(null)
    })

    _this.count(query.getQuery(), (err, _count) => {
      if (err) {
        return finish(err)
      }
      count = _count
      finish(null)
    })
  }

  if (cb) {
    return query.exec(cb)
  }
  return query
}
