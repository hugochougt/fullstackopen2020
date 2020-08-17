const getTokenFrom = (request) => {
  const authSchema = 'bearer '
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith(authSchema)) {
    return authorization.substring(authSchema.length)
  }

  return null
}

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  request.token = token

  next()
}

module.exports = tokenExtractor
