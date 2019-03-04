// Generate event list
'use strict';

var request = require('request');

var url = "http://thebluealliance.com/api/v3/team/frc2771/events/2019"

request.get({
    url: url,
    json: true,
    headers: {
        'User-Agent': 'request',
        'X-TBA-Auth-Key': 'K0lrHjn8eZ4XUwLZQlRMDun8NmvnFogbv1w1ZRQFpDvy4iu27pgYiIif5wMbXyYX'
    }
}, (err, res, data) => {
    if(err){
        console.log('Error:', err)
    } else if(res.statusCode !== 200){
        console.log('Status:', res.statusCode)
    } else {
        data.forEach((element) => {
            console.log(element.short_name)
        })
    }
}
)