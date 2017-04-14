"use strict";

module.exports = {
    source: "http://api.fixer.io/latest",
    testSource: '/test/fixture/fixer.json',
    convertData: (sourceData)=> {
        let data = {
            success: true,
            type: 'currency',
            source: 'fixer',
            timestamp: new Date,
            data: JSON.parse(sourceData).rates // curr: rate
        }

        return data;
    }
}