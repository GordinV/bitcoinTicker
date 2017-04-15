'use strict';
const INTERVAL = 10000,
    MAXRETRACTS = 3; // NULL -> unlimited

let loadDataFromFeeds = require('./modules/loadFeeds'),
    isTest = false, // false -> call web feeds
    count = 0;

const final = ((err, data) => {

    if (err) {
        console.error('Error', err);
        return err;
    }

    let rates = data.rates,
        btcs = data.btcs;

    btcs.forEach((btc, index) => {
        rates.forEach((rate, idx) => {
            // preparing output line
            let replyText = `BTC/USD: ${btc.rate} EUR/USD ${rate.rate} BTC/EUR ${btc.rate / rate.rate } Active sources: BTC/USD ${index + 1} of ${btcs.length} EUR/USD ${idx + 1} of ${rates.length} `;
            // return output line
            console.log(replyText);
        })
    });

});

const intervalID = setInterval(() => {
    //call for data each {INTERVAL}
    loadDataFromFeeds(isTest, final);
    count++;
    if (MAXRETRACTS && count == MAXRETRACTS) {
        // stop if neccessory
        clearInterval(intervalID);
    }

}, INTERVAL);




