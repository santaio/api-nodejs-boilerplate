module.exports = () => {

  const create = async (req, res, next) => {

    req.checkBody({
      'phone.ddd': {
        notEmpty : { errorMessage: 'required' },
        phoneDDD : { errorMessage: 'Must contain 2 digits' }
      },
      'phone.number': {
        notEmpty    : { errorMessage: 'required' },
        phoneNumber : { errorMessage: 'Must contain between 8 and 9 digits' }
      },
      product_id : { optional: true, checkId: true, errorMessage: 'Malformed ObjectId' },
      message    : { notEmpty: true, errorMessage: 'Cannot be empty' }
    })

    const validationResults = await req.getValidationResult()
    const validationErrors = validationResults.array()

    const result = {
      success    : !validationErrors.length,
      request_at : req.timestamp,
      type       : 'messages',
      href       : req.location,
      errors     : validationErrors.length ? validationErrors : undefined
    }

    if (validationErrors.length) {
      return res.status(400).json(result)
    }

    req.result = result

    return next()

  }

  return {
    create
  }

}
