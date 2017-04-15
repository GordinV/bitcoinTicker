'use strict';

const moment = require('moment'),
    EXPIRATION_DATE= 7; //days

module.exports = {
    source: "http://www.apilayer.net/api/live?access_key=4dfe627225b0702c099f922824c58c58",
    testSource: '/test/fixture/currencylayer.json',
    expirationTime: 24, //hours
    convertData: (sourceData) => {
        let data = {
            success: sourceData ? true : false,
            type: ['currency', 'bitcoin'],
            source: 'apilayer',
            isExpired: false,
            data: [],
            expire: null
        }

        if (sourceData) {
            try {
                let quotes = JSON.parse(sourceData).quotes,
                structuredObject = {};
                for (let obj in quotes) {
                    let currencyCode = obj.substr(3),
                        rate = 1 / quotes[obj];

                    if (currencyCode == 'EUR') {
                        currencyCode = 'USD';
                    }
                    structuredObject = Object.assign({}, structuredObject, {[currencyCode]: rate});
                }

                data['data'] = structuredObject;
                // calculate expiration date;

                let updateDate = new Date(JSON.parse(sourceData).timestamp * 1000),
                    expirationDate = moment(updateDate).add(EXPIRATION_DATE, 'days'),
                    today = new Date();

                data.isExpired = expirationDate < today;
            } catch (e) {
                //something is wrong
                console.error(e);
                data.success = false;
            }
        }
        return data;
    }

}
