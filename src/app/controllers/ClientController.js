const path = require('path')
const { URL_SRC } = require('../../init')

const ClientController = {
    // [GET] domain/
    index(req, res) {
        res.sendFile(path.join(URL_SRC, 'resources/views', 'index.html'));
    }
}

module.exports = ClientController