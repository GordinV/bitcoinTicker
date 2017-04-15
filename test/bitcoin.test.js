'user strict';

describe('test for bitcoin realtime ticker', () => {

    it('load available feeds', (done) => {
        let loadFeeds = require('./../modules/loadFeeds');
        let data = loadFeeds(true, (err, data) => {
            console.log('result:', err, data);
            expect(data).toBeDefined();
            expect(data.btcs.length).toBe(2); // only 2 source for btc
            expect(data.rates.length).toBe(2); // only 2 source for rates
            done();
        })
    })
});
