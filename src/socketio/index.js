const Tour = require('../app/models/Tour')
const Cart = require('../app/models/Cart')


const connect = (io) => {
    const count = io.engine.clientsCount;
    console.log('count:', count);

    io.on('connection', (socket) => {
        console.log("New client connected: " + socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id);
        });
    });

    Tour.watch().on('change', (data) => {
        io.emit('on-change', data)
    })
    Cart.watch().on('change', () => {
        io.emit('on-change', 'cart')
    })
}

module.exports = { connect }