const moment = require('moment')

const BetweenTwoDays = {
    differentDays(first_day, last_day) {
        timeDifference = Math.abs(last_day.getTime() - first_day.getTime())
        differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24))
        return differentDays
    },
    // moment.utc(moment(firstDate, "DD/MM/YYYY HH:mm:ss")
    //     .diff(moment(secondDate, "DD/MM/YYYY HH:mm:ss")))
    //     .format("HH:mm:ss")
    nextDays(day, distance) {
        timeDifference = Math.abs(day + ((1000 * 3600 * 24) * distance))
        return new Date(timeDifference)
    }
}

module.exports = BetweenTwoDays