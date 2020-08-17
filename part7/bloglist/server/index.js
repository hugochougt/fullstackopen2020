const express = require('express')
const routes = require('@util/routes')
const errorMiddleware = require('@middleware/errorMiddleware')
const tokenExtractor = require('@middleware/tokenExtractor')

const app = express()

app.use(express.json())
app.use(tokenExtractor)
app.use(routes)
app.use(errorMiddleware)

module.exports = app
