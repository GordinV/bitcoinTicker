'use strict';
const moment = require('moment'),
    EXPIRATION_DATE= 1; //days


    module.exports = {
    source: "http://api.coindesk.com/v1/bpi/currentprice/EUR.json",
    testSource: "/test/fixture/bitcoin.json",
    convertData: (sourceData) => {
        let data = {
            success: sourceData ? true : false,
            type: ['bitcoin'],
            source: 'coindesc',
            isExpired: false,
            data: {} // format curr: rate
        }

        if (sourceData) {
            try {
                let bpi = JSON.parse(sourceData).bpi,
                    structuredObject = {};
                for (let obj in bpi) {
                    if (bpi[obj].code == 'USD') {
                        structuredObject = Object.assign({}, structuredObject, {BTC: bpi[obj].rate_float});
                    }
                }
                data['data'] = structuredObject;
                // calculate expiration date;
                let updateDate = JSON.parse(sourceData).time['updatedISO'],
                    expirationDate = moment(updateDate).add(EXPIRATION_DATE, 'days'),
                    today = new Date();

                data.isExpired = expirationDate < today;

            }
            catch (e) {
                //something is wrong
                console.error(e);
                data.success = false;
            }
        }
        return data;
    }

}


