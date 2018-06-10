const express = require('express');
const app = express();
const rp = require('request-promise-native');
const _ = require('lodash');
const baseUrl = 'http://www.dssclub.com.ua/fifa18/';
let GROUPS = {};

setInterval(() => {
    GROUPS = {};
}, 30 * 60 * 1000);

app.get('/groups', async (req, res) => {
    if (!_.isEmpty(GROUPS)) {
        return res.send(GROUPS);
    }
    const countriesAray = await rp(`${baseUrl}groupup.php`, {json: true});
    const modifiedArray = countriesAray.map(country => {
        return {
            ...country,
            logolink: baseUrl + country.logolink
        }
    });
    const groupedObj = _.groupBy(modifiedArray, country => country.gr);
    GROUPS = {...groupedObj};
    return res.send(groupedObj);
});

const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}`));