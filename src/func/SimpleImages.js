

const SimpleImages = (req, array) => {
    if (!array || array.lenght == 0) return null
    const url = req.protocol + '://' + req.get('host') + '/api/v1/views/show/photos/'
    let photos = []
    array.map(title => {
        photos.push(url + title)
    })
    return photos
}

const SimpleArrayPhotos = (req, result) => {

    result.map(obj => {
        const { images } = obj
        obj.images = SimpleImages(req, images)
    })
}

const SimpleProfileInPosts = (req, result) => {
    result.map(obj => {
        const { profile } = obj
        profile.map(pr => {
            const { images } = pr
            pr.images = SimpleImages(req, images)
        })
    })
}

module.exports = { SimpleImages, SimpleArrayPhotos, SimpleProfileInPosts }