const common = require('@root/config/common')

const PORT = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  ...common,
  PORT,
  MONGODB_URI,
}
