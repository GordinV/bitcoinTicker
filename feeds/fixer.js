'use strict';
const moment = require('moment'),
    EXPIRATION_DATE = 5; //days

module.exports = {
    source: "http://api.fixer.io/latest",
    testSource: '/test/fixture/fixer.json',
    expirationTime: 24, //hours
    convertData: (sourceData)=> {
        let data = {
            success: sourceData ? true: false,
            type: ['currency'],
            source: 'fixer',
            isExpired: false,
            data: {}
        }

        if (sourceData) {
            try {
                data.data = JSON.parse(sourceData).rates
                // calculate expiration date;
                let updateDate = JSON.parse(sourceData).date,
                    expirationDate = moment(updateDate).add(EXPIRATION_DATE, 'days'),
                    today = new Date();

                data.isExpired = expirationDate < today;
                data.expire = moment().add(1, 'day');

            } catch (e) {
                //something is wrong
                console.error(e);
                data.success = false;
            }
        }
        return data;
    }
}