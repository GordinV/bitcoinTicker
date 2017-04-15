'use strict';
const NodeCache = require( "node-cache" ),
     cache = new NodeCache();

module.exports = (isTest, callback) => {

    const fs = require('fs'),
        _ = require('lodash'),
        XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
        xhr = new XMLHttpRequest(),
        path = require('path'),
        FEEDPATH = './feeds';

    const loadFeeds = () => {
        // read files from feed catalog
        return new Promise((resolve, reject) => {
            // check if folder exists
            fs.stat(FEEDPATH, (err, stats) => {
                if (err || !stats.isDirectory()) {
                    console.error(err);
                    resolve(null)
                }; // otherwise promise.all will stop with reject
            });

            // read feeds
            fs.readdir(FEEDPATH, (err, files) => {
                if (err) {
                    console.error(err);
                    resolve(null)
                };

                //return back found feeds
                resolve(files);
            });
        });
    };

    const requestData = (feeds, test) => {
        // get data from sources, if test then read from local resource
        const sourcePath = path.join(__dirname, './../feeds'), // feed source
            testPath = path.join(__dirname, './../'); // only for test

        return new Promise((resolve, reject) => {
            let promises = feeds.map(moduleName => {
                let moduleUrl = path.join(sourcePath, moduleName),
                    module = require(moduleUrl),
                    source = test ? 'file://' + path.join(testPath, module.testSource) : module.source;

                if (source) {
                    return new Promise((resolve, reject) => {
                        xhr.open('GET', source, false);
                        xhr.send();
                        if (xhr.status != 200) {
                            console.error(xhr.status + ': ' + xhr.statusText);
                            let data = module.convertData(null);
                            resolve(data);
                        } else {
                            // we got data
                            //convert them and return
                            let data = module.convertData(xhr.responseText)
                            resolve(data);
                        }
                    })
                }
            });

            //parallel call
            Promise.all(promises)
                .then(results => {
                        resolve(results);
                    },
                    error => {
                        console.error
                        reject(error)
                    });

        })

    }

    const prepaireData = (sourceData) => {
        // will prepaire data from source
        let btcs = _.filter(sourceData, {isExpired: false, success: true, type: ['bitcoin']}).map(data => {
                return {type: 'btc', rate: data.data['BTC'], source: data.source, isNew: true}
            }),
            rates = _.filter(sourceData, {isExpired: false, success: true, type: ['currency']}).map(data => {
                return {type:'currency', rate: data.data['USD'], source: data.source, isNew: true};
            });

        return {btcs: btcs, rates: rates}
    }

    const executeCacheTask = (row) => {
        let prefix = row.type;
        let key = prefix + '_'+ row.source,
            value;

        try {
            value = cache.get(key, true);
        } catch (err) {

        }

        // if key found, then comparing prices
        row.isNew = value ? !_.isEqual(value, row): true;

        // save new data
        let isSuccess = cache.set(key, row);
        return row;
    }

    const cacheData = (prepairedData => {
        let btcs = _.map(prepairedData.btcs,executeCacheTask),
            rates = _.map(prepairedData.rates,executeCacheTask);

        return {btcs: btcs, rates: rates}

    });


    loadFeeds(isTest, callback)
        .then(feeds => {
            requestData(feeds, isTest)
                .then(results => {
                    // cache data and get isNew value

                    let finalData = cacheData(prepaireData(results));
                    //will returned data back
                    callback(null, finalData);
                })
        });

}



