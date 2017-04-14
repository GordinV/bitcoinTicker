'use strict';
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
            fs.stat(FEEDPATH, (err, stats) => {
                if (err || !stats.isDirectory()) reject(err);
            });

            // read feeds
            fs.readdir(FEEDPATH, (err, files) => {
                if (err) reject(err);

                resolve(files);
            });
        });
    };

    const requestData = (feeds, test) => {
        // get data from sources, if test then read from local resource
        const sourcePath = path.join(__dirname, './../feeds'),
            testPath = path.join(__dirname, './../');

        return new Promise((resolve, reject) =>
        {
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
                            reject(xhr.statusText);
                        } else {
                            // we got data
                            //convert them and return
                            let data = module.convertData(xhr.responseText)
                            resolve(data);
                        }
                    })
                }
            });

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
        let btcPrice = _.find(sourceData,{type:'bitcoin'}).data['USD'],
            rates = _.filter(sourceData, {type:'currency'}).map(data => {
                return {rate: data.data['USD'], source: data.source};
            });

        return {btc: btcPrice, rates: rates}
    }

    loadFeeds(isTest, callback)
        .then(feeds => {
            requestData(feeds, isTest)
                .then(results => {
                    let preparedData = prepaireData(results);
                    callback(null,preparedData);
            })
        });

}



