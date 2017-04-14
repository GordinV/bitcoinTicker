'user strict';

describe('test for bitcoin realtime ticker', () => {

    it('load available feeds', (done) => {
        let loadFeeds = require('./../modules/loadFeeds');
        let data = loadFeeds(true, (err, data) => {
            console.log('files', data);
            expect(data).toBeDefined();
            done();

        })
    })
});
