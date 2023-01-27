
const Admin = require('../models/Admin')
const path = require('path');
const fs = require("fs");
const Photos = require('../models/Photos')


class SiteController {

    // [GET] /
    index(req, res, next) {
        Admin.findOne({
            name: 'admin'
        })
            .then(result => {
                const { name, messages } = result
                res.status(200).json({ name, messages })
            })
            .catch(next)
    }

    // [POST] /store
    async store(req, res) {
        const admin = await new Admin({
            name: 'admin',
            messages: 'Why did you get lost here? Why?',
        })

        const result = await admin.save()
        res.json(result)
    }

    // [GET] /admin/:id
    admin(req, res, next) {
        Admin.findOne({ name: req.params.name })
            .then(rs => res.json(rs))
            .catch(next)
    }

    // views/photos/:slug
    photos(req, res) {
        try {
            const img = fs.readFileSync('src/public/uploads/' + req.params.slug);
            const encode_img = img.toString('base64');
            const final_img = {
                contentType: req.params.slug.split('.')[1],
                image: new Buffer(encode_img, 'base64')
            };
            res.contentType(final_img.contentType);
            return res.send(final_img.image)
        } catch (err) {
            return res.status(500).json({
                code: 0,
                status: false,
                msg: 'image is not exist!',
                err: err
            })
        }
    }

    // views/photos/:slug
    photosMongodb(req, res) {
        Photos.findOne({
            title: req.params.slug,
        })
            .then(photos => {
                res.contentType(photos.typeof);
                return res.send(photos.img)
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'image is not exist!',
                    err: err
                })
            })
    }
}

module.exports = new SiteController