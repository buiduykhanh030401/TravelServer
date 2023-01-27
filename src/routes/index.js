const site = require('./site')
const auth = require('./auth')
const area = require('./area')
const event = require('./event')
const permission = require('./permission')
const rating = require('./rating')
const tour = require('./tour')
const views = require('./views')
const profile = require('./profile')
const verify = require('./verify')
const service = require('./service')
const client = require('./client')
const posts = require('./posts')
const comment = require('./comment')
const cart = require('./cart')
const order = require('./order')

function route(app) {
    app.use('/api/v1/order', order)
    app.use('/api/v1/cart', cart)
    app.use('/api/v1/comment', comment)
    app.use('/api/v1/posts', posts)
    app.use('/api/v1/service', service)
    app.use('/api/v1/verify', verify)
    app.use('/api/v1/profile', profile)
    app.use('/api/v1/views', views)
    app.use('/api/v1/tour', tour)
    app.use('/api/v1/rating', rating)
    app.use('/api/v1/permission', permission)
    app.use('/api/v1/event', event)
    app.use('/api/v1/area', area)
    app.use('/api/v1/auth', auth)

    // default
    app.use('/api/v1/', site)
    app.use('/', client)
}

module.exports = route