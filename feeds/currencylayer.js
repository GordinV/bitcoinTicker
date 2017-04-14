module.exports = {
    source : "http://www.apilayer.net/api/live?access_key=4dfe627225b0702c099f922824c58c58",
    testSource: '/test/fixture/currencylayer.json',
    convertData: (sourceData)=> {
        let data = {
            success: true,
            type: 'currency',
            source: 'apilayer',
            timestamp: new Date,
            data: []
        }

        let quotes = JSON.parse(sourceData).quotes;
        structuredObject = {};
        for (obj in quotes) {
            let currencyCode = obj.substr(3),
                rate = 1 / quotes[obj];

            if (currencyCode == 'EUR') {
                currencyCode = 'USD';
            }
            structuredObject = Object.assign({}, structuredObject, {[currencyCode]: rate});
        }

        data['data'] = structuredObject;
        return data;
    }

}
