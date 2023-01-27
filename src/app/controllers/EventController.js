const Event = require('../models/Event')
const fetch = require('node-fetch')
const slug = require('slug')

const EventController = {
    // [GET] /
    index(req, res) {
        res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to go on!'
        })
    },

    // [GET] /show/all/limit/skip
    all(req, res) {
        Event.find().limit(req.params.limit).skip(req.params.skip)
            .then(event => {
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Get all event successfully!',
                    data: event
                })
            })
            .catch(err => {
                res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'Get all event failed!',
                    err: err
                })
            })
    },

    // [GET] /show/details/:slug
    details(req, res) {
        Event.findOne({
            slug: req.params.slug
        })
            .then(event => {
                if (!event) {
                    return res.status(500).json({
                        code: 0,
                        status: false,
                        msg: 'Get details event failed!',
                        data: event
                    })
                }

                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Get details event successfully!',
                    data: event
                })
            })
            .catch(err => {
                res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'Get details event failed!',
                    err: err
                })
            })
    },

    // [POST] /update
    async update(req, res) {
        // update
        const url = 'https://api.predicthq.com/v1/events/?country=VN&limit=20&offset=0';
        const insert = async (url) => {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer fqUP1ZrNg9KPPJQWWIquuxVUWcZNjpmYTGSfHRUi',
                    Accept: 'application/json',
                }
            })
            const data = await response.json()
            const list = []
            data.results.forEach(async e => {
                const body = {
                    title: e.title,
                    description: e.description,
                    category: e.category,
                    rank: e.rank,
                    time_start: e.start,
                    time_end: e.end,
                    longitude: e.location[0],
                    latitude: e.location[1],
                    slug: slug(e.title),
                }
                try {
                    list.push(body)
                } catch (error) {
                    console.log(error);
                }
            });

            try {
                await Event.insertMany(list)
            } catch (error) {
                console.log(error);
            }
            data.next && insert(data.next)
        }
        insert(url)
        res.status(200).json({
            code: 0,
            status: true,
            msg: 'Update all data event successfully!',
        })
    },

    // [GET] /show/all/location?diameter=50&longitude=?&latitude=?
    getEventLocationRadius(req, res) {
        Event.find({
            $and: [
                {
                    longitude: {
                        $gte: req.location.longitude_min,
                    },
                },
                {
                    longitude: {
                        $lte: req.location.longitude_max,
                    }
                },
                {
                    latitude: {
                        $gte: req.location.latitude_min,
                    }
                },
                {
                    latitude: {
                        $lte: req.location.latitude_max,
                    }
                },
            ]
        }).limit(req.location.limit).skip(req.location.skip)
            .then(event => {
                if (event.length == 0) {
                    return res.status(404).json({
                        code: 0,
                        status: false,
                        msg: 'Value query exits!',
                        data: event
                    })
                }

                // so sanh < 50KM
                event.filter(e => EventController.calcCrow(req.location.longitude, req.location.latitude, e.longitude, e.latitude) < req.location.diameter)

                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Get all event successfully!',
                    data: event
                })
            })
            .catch(err => {
                return res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'Get all event failed!',
                    err: err
                })
            })
    },

    delete(req, res) {
        Event.deleteMany()
            .then(res.status(200).json({
                code: 0,
                status: true,
                msg: 'Delete all data event successfully!',
            }))
            .catch(res.status(404).json({
                code: 0,
                status: false,
                msg: 'Delete all data event failed!',
            }))
    },

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    calcCrow(lon1, lat1, lon2, lat2) {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;

        // Converts numeric degrees to radians
        function toRad(Value) {
            return Value * Math.PI / 180;
        }
    }
}

module.exports = EventController