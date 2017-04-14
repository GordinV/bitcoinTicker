module.exports = {
    source: "http://api.coindesk.com/v1/bpi/currentprice/EUR.json",
    testSource: "/test/fixture/bitcoin.json",
    convertData: (sourceData) => {
        let data = {
            success: true,
            type: 'bitcoin',
            source: 'coindesc',
            timestamp: new Date,
            data: {} // format curr: rate
        }

        let bpi = JSON.parse(sourceData).bpi;
        structuredObject = {};
        for (obj in bpi) {
            structuredObject = Object.assign({}, structuredObject, {[bpi[obj].code]: bpi[obj].rate_float});
        }

        data['data'] = structuredObject;

        return data;
    }

}


