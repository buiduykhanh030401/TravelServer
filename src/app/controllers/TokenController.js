const Token = require('../models/Token')

const TokenController = {
    async store(token) {
        const newToken = await new Token({
            token: token
        })
        try {
            await newToken.save()
            return true
        } catch (error) {
            return false
        }
    },
    async delete(token) {
        await Token.findOneAndDelete({
            token: token
        })
            .then(() => {
                return true
            })
            .catch(() => {
                return false
            })
    },
    async find(token) {
        await Token.findOne({
            token: token
        })
            .then(() => {
                return true
            })
            .catch(() => {
                return false
            })
    }
}

module.exports = TokenController