const getTokenFrom = request => {
  const auth_schema = 'bearer '
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith(auth_schema)) {
    return authorization.substring(auth_schema.length)
  }

  return null
}

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  request.token = token

  next()
}

module.exports = {
  tokenExtractor
}
