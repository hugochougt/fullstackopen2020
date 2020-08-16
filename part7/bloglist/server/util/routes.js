const Router = require('express')
const messages = require('@controllers/messagesController')
const users = require('@controllers/usersController')
const tokens = require('@controllers/tokensController')

const router = Router()

router.get('/messages', messages.getAll)
router.post('/messages', messages.create)
router.delete('/messages/:id', messages.destroy)

router.get('/users', users.getAll)
router.post('/users', users.create)
router.get('/users/:id', users.show)

router.post('/tokens', tokens.create)

module.exports = router
