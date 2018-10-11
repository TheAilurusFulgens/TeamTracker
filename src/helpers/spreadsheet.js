// import { orderBy } from "lodash";
// import { hash } from "./utils";
// import { get } from "./localStorage";

import config from "../config";
import axios from 'axios';
//import { map, reduce, somethingElse } from 'underscore'
/**
 * Load the teams from the spreadsheet
 * Get the right values from it and assign.
 */
export function load(callback) {
  var rankLookup = {}
  var rankMax = 0
  var teamName = {}
  var opRank = {}
  var dpRank = {}
  var dprMax = 0
  var oprMax = 0
  var blueAllianceConfig = {
    headers: {'Accept': 'application/json', 'X-TBA-Auth-Key':'NTzpTFdnASplharZXjaUdE2yCTRw0LXD9cVSz9Ox2ulKRuJXfpvNyThzSudidh2X'}
  };
  axios.all([
    axios.get('https://www.thebluealliance.com/api/v3/event/2018azpx/rankings', blueAllianceConfig),
    axios.get('https://www.thebluealliance.com/api/v3/event/2018azpx/teams/simple', blueAllianceConfig),
    axios.get('https://www.thebluealliance.com/api/v3/event/2018azpx/oprs', blueAllianceConfig)
  ])
  .then(axios.spread(function(rank,team, oprank){
    //console.log(team.data); // ex.: { user: 'Your User'}
    //console.log(team.status); // ex.: 200
    rank.data.rankings.forEach((d) => rankLookup[d.team_key] = d.rank)
    let rankArr = Object.values(rankLookup);
    rankMax = Math.round(Math.max(...rankArr))
    team.data.forEach((d) => teamName[d.team_number] = d.nickname)
    opRank = oprank.data.oprs
    let oprArr = Object.values(opRank);
    oprMax = Math.round(Math.max(...oprArr))
    dpRank = oprank.data.dprs
    dprMax = Math.round(Math.max(...Object.values(dpRank)))
  }));  

  
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: config.spreadsheetId,
        range: "Form Responses 1",
        valueRenderOption: "UNFORMATTED_VALUE"
      })
      .then(
        response => {
          const data = response.result.values;
          
          let records = data.map((row) => ({
            team_num: row[1],
            match_num: row[2],
            autonomous: row[3],
            switch: row[4],
            scale: row[5],
            exchange: row[6],
            climbing: row[7],
            comments: row[8]
          }))

          var switch_sums = {}, scale_sums = {}, exchange_sums = {}, climbing_sums ={}, counts = {}, results = [], name;
          for (var i = 1; i < records.length; i++) {
              name = records[i].team_num;
              if (!(name in switch_sums)) {
                scale_sums[name] = 0;
                exchange_sums[name] = 0;
                switch_sums[name] = 0;
                climbing_sums[name] = 0;
                counts[name] = 0;
              }
              switch_sums[name] += records[i].switch;
              scale_sums[name] += records[i].scale;
              exchange_sums[name] += records[i].exchange;
              if(records[i].climbing ==="Yes"){
                climbing_sums[name] += 2
              }
              if(records[i].climbing ==="Attempted"){
                climbing_sums[name] += 1
              }
              if(records[i].climbing ==="No"){
                climbing_sums[name] += 0
              }
              counts[name]++;
          }

          for(name in switch_sums) {
              results.push({ team_num: name, switch: switch_sums[name] / counts[name],
              scale: scale_sums[name] / counts[name],  exchange: exchange_sums[name] / counts[name],   
              climbing: climbing_sums[name] / counts[name]});
          }

          let teams =
            results.map(team => {
              return ({
              number: team['team_num'],
              name: "Team "+ team['team_num'] + " - " + teamName[team['team_num']],
              switch: team["switch"],
              scale: team["scale"],
              exchange: team["exchange"],
              climbing: team["climbing"],
              opRank: Math.round(opRank["frc"+team['team_num']]),
              dpRank: Math.round(dpRank["frc"+team['team_num']]),
              dpRankFilter: (dprMax - Math.round(dpRank["frc"+team['team_num']])+1),
              baRank: rankLookup["frc"+team['team_num']],
              baRankFilter: (rankMax- rankLookup["frc"+team['team_num']]+1)

            })}) || [];
            // var scaleMax = Math.round(Math.max(...Object.values(teams.scale)))
            // console.log(scaleMax)
            // console.log("hi")
          callback({
            teams,
            maxes: {"opRank": oprMax, "dpRank":dprMax, "baRank": rankMax, "scale": 10, "switch": 10, "exchange":10, "climbing":10}
          });
        },
        response => {
          callback(false, response.result.error);
        }
      );
  });
}
