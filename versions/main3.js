// Working get all teams and sort them by team number

'use strict';
var events = [];
var teams = [];
var request = require('request');
var fs = require('fs');

const team_number = 2771;

var url = "http://thebluealliance.com/api/v3/team/frc"+team_number+"/events/2019"

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
                    // add team data
                    // teams.push({team: e.team_number})
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
                            // console.log(teamEvents)
                        }
                        var evt = [{team: e.team_number}]
                        for(let i = 0; i <= teamEvents.length; i++){
                            if(typeof teamEvents[i] !== "undefined"){
                                var event = "event"+i.toString()
                                Object.assign(evt, {[event]: teamEvents[i]})
                            }
                        }
                        console.log(evt)
                        teams.push(evt)
                        console.log("Teams", teams)
                        var json = JSON.stringify(teams)
                        fs.writeFile('teams.json', json, 'utf8', function cb(err){
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("Success!")
                            }
                        })
                    })
                    // End Generate event list
                })
                // console.log("teams:", teams)
            }
            // teams = removeDuplicates(uniq(teams)).sort((a, b) => a - b)
        })
    })
    var json = JSON.stringify(teams)
    fs.writeFile('teams.json', json, 'utf8', function cb(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Success!")
        }
    })
})


function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}
