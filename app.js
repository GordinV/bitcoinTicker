'use strict';
const INTERVAL = 1000,
    MAXRETRACTS = 2; // NULL -> unlimited

let loadDataFromFeeds = require('./modules/loadFeeds'),
    count = 0; //limit, null -> unlimited

const final = ((err, data) => {
  console.log('final data arrived:', err, data);
  let rates = data.rates;
});

const intervalID = setInterval(()=> {
    loadDataFromFeeds(true, final);
    count++;
    if (MAXRETRACTS && count == MAXRETRACTS) {
        clearInterval(intervalID);
    }

}, INTERVAL);




