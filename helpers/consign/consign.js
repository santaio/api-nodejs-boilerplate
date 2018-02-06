/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

// Module dependencies.

const fs = require('fs'), path = require('path')


/**
 * Consign constructor.
 *
 * @param options
 * @returns
 */

function Consign(options) {
  options = options || {}

  this._options = {
    cwd         : process.cwd(),
    locale      : 'en-us',
    logger      : console,
    verbose     : true,
    extensions  : [],
    loggingType : 'info'
  }

  this._files = []
  this._object = {}
  this._extensions = this._options.extensions.concat([ '.js', '.json', '.node' ])
  this._lastOperation = 'include'

  if (options.extensions) {
    this._extensions.concat(options.extensions)
  }

  for (const o in options) {
    this._options[o] = options[o]
  }

  this._ = require(path.join(__dirname, 'locale', this._options.locale))

  return this
}

/**
 * Set locations.
 *
 * @param parent
 * @param entity
 * @param push
 */

Consign.prototype._setLocations = function (parent, entity, push, regex) {
  if (!entity) {
    this._log([ '! Entity name not provided or doesn\'t exist', location ], 'error')
    return this
  }

  const parts = entity.split(/\s?,\s?/g)

  if (parts.length > 1) {
    for (const p in parts) {
      this._setLocations(parent, parts[p], true, regex)
    }
    return this
  }

  var location = path.resolve(path.join(parent, entity))

  if (!fs.existsSync(location)) {
    this._log([ '!', this._['Entity not found'], location ], 'error')
    return this
  }

  if (fs.statSync(location).isDirectory()) {
    const dir = fs.readdirSync(location)

    for (const e in dir) {
      if (dir[e].charAt(0) === '.') {
        this._log([
          '!', this._['Ignoring hidden entity'], path.join(location, dir[e])
        ], 'warn')
      } else {
        this._setLocations(location, dir[e], push, regex)
      }
    }

    return this
  }

  if (regex && !regex.test(location.match(/([^\/]*)\/*$/)[1])) {
    return this
  }

  var regex = new RegExp(this._options.extensions.join('$|'), 'gi'),
    extension = path.extname(location)


  if (!regex.test(extension)) {
    this._log([ '!', this._['Ignoring extension'], ':', extension ])
    return this
  }

  if (push && this._files.indexOf(location) === -1) {
    this._files.push(location)
    this._log([ '+', this._getRelativeTo(location) ], 'log')
  } else if (!push) {
    this._files.splice(this._files.indexOf(location), 1)
    this._log([ '-', this._getRelativeTo(location) ], 'log')
  }

  return this
}

/**
 * Get relative to location.
 *
 * @param location
 * @returns
 */

Consign.prototype._getRelativeTo = function (location) {
  return `.${location.split(this._options.cwd).pop()}`
}

/**
 * Create namespace.
 *
 * @param parent
 * @param parts
 * @returns
 */

Consign.prototype._createNamespace = function (parent, parts, mod) {
  const part = parts.shift()

  if (!parent[part]) {
    parent[this._getKeyName(part)] = parts.length ? {} : mod
  }

  if (parts.length) {
    parent = this._createNamespace(parent[part], parts, mod)
  }

  return parent
}

/**
 * Get key name.
 *
 * @param name
 * @returns
 */

Consign.prototype._getKeyName = function (name) {
  return path.basename(name, path.extname(name))
}

/**
 * Log handler.
 *
 * @param message
 * @param type
 * @returns
 */

Consign.prototype._log = function (message, type) {
  if (this._options.verbose) {
    this._options.logger[type || this._options.loggingType](message.join(' '))
  }

  return this
}

/**
 * Include method.
 *
 * @param entity
 * @returns
 */

Consign.prototype.include = function (entity, regex) {
  this._lastOperation = 'include'
  return this._setLocations(this._options.cwd, entity, true, regex)
}

/**
 * Exclude method.
 *
 * @param entity
 * @returns
 */

Consign.prototype.exclude = function (entity, regex) {
  this._lastOperation = 'exclude'
  return this._setLocations(this._options.cwd, entity, false, regex)
}

/**
 * Then method.
 *
 * @param entity
 * @returns
 */

Consign.prototype.then = function (entity, regex) {
  this[this._lastOperation].call(this, entity, regex)
  return this
}

/**
 * Into method.
 *
 * @param object
 * @returns
 */

Consign.prototype.into = function (object) {
  for (const f in this._files) {
    delete require.cache[this._files[f]]

    let script = this._files[f],
      parts = this._getRelativeTo(script).split(path.sep).slice(1),
      args = []
    

    try {
      var mod = require(script)
    } catch (err) {
      throw (`Failed to require: ${script}, because: ${err.message}`)
    }

    for (const a in arguments) {
      args.push(arguments[a])
    }

    if (typeof mod === 'function') {
      mod = mod.apply(mod, args)
    }

    const ns = this._createNamespace(object, parts, mod)
  }


  return this
}

/**
 * Export Consign instance.
 *
 * @param options
 * @returns
 */

module.exports = function (options) {
  return new Consign(options)
}
