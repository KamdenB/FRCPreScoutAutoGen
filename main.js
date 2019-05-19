// FINSIHED AND WORKING!!!!
'use strict';

var request = require('request');
var d = require('./const.js')
var fs = require('fs');
var sprintf = require('sprintf-js').sprintf

var events = [];
var teams = [];

var url = "http://thebluealliance.com/api/v3/team/frc"+d.team+"/events/2019"

// Get inital list of events defined team is competing at
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
            // Add teams
            events.push(element.key)
        })
    }
    console.log(events)
    // From the list of events, make a list of teams that will be there
    events.forEach((e) => {
        let u = "https://www.thebluealliance.com/api/v3/event/" + e + "/teams"
        request.get({
            url: u,
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
                // With the array of 
                data.forEach((e) => {
                    // Generate event list
                    var data = "http://thebluealliance.com/api/v3/team/frc"+e.team_number+"/events/2019"
                    var teamEvents = [];
                    request.get({
                        url: data,
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
                                // Add teams
                                teamEvents.push(element.short_name)
                            })
                        }
                        // If configured for google sheets, use google sheet format for hyperlink
                        if(d.forGsheet){
                            // var str = `=HYPERLINK('https://www.thebluealliance.com/team/${e.team_number}', ${e.team_number})`
                            var str = sprintf('=HYPERLINK("https://www.thebluealliance.com/team/%s/", %s)', e.team_number, e.team_number)
                            str = str.replace("/\/", '');
                            var evt = {team: str}
                        } else {
                            var evt = {team: e.team_number}
                        }
                        for(let i = 0; i <= teamEvents.length; i++){
                            if(typeof teamEvents[i] !== "undefined"){
                                var event = "event"+i.toString()
                                Object.assign(evt, {[event]: teamEvents[i]})
                            }
                        }
                        console.log(evt)
                        teams.push(evt)
                        // Object.assign(teams, evt)
                        teams = removeDuplicates(uniq(teams)).sort((a, b) => a - b)
                        console.log("Teams", teams)
                        var json = JSON.stringify(teams)
                        fs.writeFile('teams.json', json, 'utf8', function cb(err){
                            if(err) {
                                console.log(err);
                            }
                        })
                    })
                    // End Generate event list --- 
                })
            }
        })
    })
})


function uniq(a) { // return the unique items from the array (I think)
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

function removeDuplicates(arr){ // probably removes duplicates from the array
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}