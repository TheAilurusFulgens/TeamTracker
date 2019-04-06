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
  var Pitdata = {}
  var blueAllianceConfig = {
    headers: {'Accept': 'application/json', 'X-TBA-Auth-Key':'NTzpTFdnASplharZXjaUdE2yCTRw0LXD9cVSz9Ox2ulKRuJXfpvNyThzSudidh2X'}
  };
  axios.all([
    axios.get('https://www.thebluealliance.com/api/v3/event/2019azpx/rankings', blueAllianceConfig),
    axios.get('https://www.thebluealliance.com/api/v3/event/2019azpx/teams/simple', blueAllianceConfig),
    axios.get('https://www.thebluealliance.com/api/v3/event/2019azpx/oprs', blueAllianceConfig), // after 30 matches
    // axios.get('https://www.thebluealliance.com/api/v3/event/2018azpx/oprs', blueAllianceConfig),
    // axios.get('https://www.thebluealliance.com/api/v3/event/2018azfl/oprs', blueAllianceConfig)
  ])
  .then(axios.spread(function(rank,team, oprank){
    //console.log(team.data); // ex.: { user: 'Your User'}
    //console.log(team.status); // ex.: 200
    rank.data.rankings.forEach((d) => rankLookup[d.team_key] = d.rank)
    rankMax = Math.round(Math.max(...Object.values(rankLookup)))
    team.data.forEach((d) => teamName[d.team_number] = d.nickname)

    opRank = oprank.data.oprs
    oprMax = Math.round(Math.max(...Object.values(opRank)))
    dpRank = oprank.data.dprs
    dprMax = Math.round(Math.max(...Object.values(dpRank)))
  }));  

  // window.gapi.client.load("sheets", "v4", () => {
  //   window.gapi.client.sheets.spreadsheets.values
  //     .get({
  //       spreadsheetId: '1_5FidK4H7Ewlp0RVw2CZ2sDCwKcvLsqXOb_5SaAo8Qk',
  //       range: "Form Responses 1",
  //       valueRenderOption: "UNFORMATTED_VALUE"
  //     })
  //     .then(
  //       Pitresponse => {
  //         const data = Pitresponse.result.values
  //         Pitdata = data.map((row) => ({
  //           team_num: row[1],
  //           capable: row[2],
  //           strengths: row[3],
  //           climb: row[4],
  //           comments: row[5]
  //         }))
  //         //console.log(records)
  //       })
  //     })
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
            // team_num: row[1],
            // match_num: row[2],
            // autonomous: row[3],
            // switch: row[4],
            // scale: row[5],
            // exchange: row[6],
            // climbing: row[7],
            // comments: row[8],
            team_num: row[1],
            match_num: row[2],
            starting_HAB_Level: row[3],
            line_pass: row[4],
            auto_cargoship_hatch: row[5] == "" ? 0 : parseInt(row[5]),
            auto_cargoship_cargo: row[6] == "" ? 0 : parseInt(row[6]),
            auto_rocket_cargo_lvl1: row[7] == "" ? 0 : parseInt(row[7]),
            auto_rocket_cargo_lvl2: row[8] == "" ? 0 : parseInt(row[8]),
            auto_rocket_cargo_lvl3: row[9] == "" ? 0 : parseInt(row[9]),
            auto_rocket_hatch_lvl1: row[10] == "" ? 0 : parseInt(row[10]),
            auto_rocket_hatch_lvl2: row[11] == "" ? 0 : parseInt(row[11]),
            auto_rocket_hatch_lvl3: row[12] == "" ? 0 : parseInt(row[12]),
            teleop_cargoship_cargo: row[13] == "" ? 0 : parseInt(row[13]),
            teleop_cargoship_hatch: row[14] == "" ? 0 : parseInt(row[14]),
            teleop_rocket_cargo_lvl1: row[15] == "" ? 0 : parseInt(row[15]),
            teleop_rocket_cargo_lvl2: row[16] == "" ? 0 : parseInt(row[16]),
            teleop_rocket_cargo_lvl3: row[17] == "" ? 0 : parseInt(row[17]),
            teleop_rocket_hatch_lvl1: row[18] == "" ? 0 : parseInt(row[18]),
            teleop_rocket_hatch_lvl2: row[19] == "" ? 0 : parseInt(row[19]),
            teleop_rocket_hatch_lvl3: row[20] == "" ? 0 : parseInt(row[20]),
            HAB_climb: row[21],
            comments: row[22],
            immobilized: row[23],
            scout_name: row[24],
          }))
          //const keys = Object.keys(records)
          

          var cargoship_cargo_sums = {}, cargoship_hatch_sums = {}, rocket_cargo_sums = {}, rocket_hatch_sums = {}, 
          rocket_cargo_lvl1_sums = {}, rocket_cargo_lvl2_sums = {}, rocket_cargo_lvl3_sums = {}, 
          rocket_hatch_lvl1_sums = {}, rocket_hatch_lvl2_sums = {}, rocket_hatch_lvl3_sums = {}, 
          HAB_start_level_sum = {}, HAB_climb_sum = {}, line_pass_sum = {}, immobilized_sum = {}, counts = {}, results = [], name;

          for (var i = 1; i < records.length; i++) {
              name = records[i].team_num;
              //console.log(records)
              if (!(name in cargoship_cargo_sums)) {
                //console.log(records[i].auto_cargoship_hatch)
                cargoship_cargo_sums[name] = 0;
                cargoship_hatch_sums[name] = 0;

                rocket_cargo_sums[name] = 0;
                rocket_hatch_sums[name] = 0;

                rocket_cargo_lvl1_sums[name] = 0;
                rocket_cargo_lvl2_sums[name] = 0;
                rocket_cargo_lvl3_sums[name] = 0;

                rocket_hatch_lvl1_sums[name] = 0;
                rocket_hatch_lvl2_sums[name] = 0;
                rocket_hatch_lvl3_sums[name] = 0;

                HAB_start_level_sum[name] = 0;
                HAB_climb_sum[name] = 0;

                line_pass_sum[name] = 0;
                immobilized_sum[name] = 0;

                counts[name] = 0;
              }
              cargoship_cargo_sums[name] += (records[i].auto_cargoship_cargo + records[i].teleop_cargoship_cargo);
              cargoship_hatch_sums[name] += (records[i].auto_cargoship_hatch + records[i].teleop_cargoship_hatch);
              //console.log(cargoship_cargo_sums)

              rocket_cargo_lvl1_sums[name] += (records[i].auto_rocket_cargo_lvl1 + records[i].teleop_rocket_cargo_lvl1);
              rocket_cargo_lvl2_sums[name] += (records[i].auto_rocket_cargo_lvl2 + records[i].teleop_rocket_cargo_lvl2);
              rocket_cargo_lvl3_sums[name] += (records[i].auto_rocket_cargo_lvl3 + records[i].teleop_rocket_cargo_lvl3);

              rocket_hatch_lvl1_sums[name] += (records[i].auto_rocket_hatch_lvl1 + records[i].teleop_rocket_hatch_lvl1);
              rocket_hatch_lvl2_sums[name] += (records[i].auto_rocket_hatch_lvl2 + records[i].teleop_rocket_hatch_lvl2);
              rocket_hatch_lvl3_sums[name] += (records[i].auto_rocket_hatch_lvl3 + records[i].teleop_rocket_hatch_lvl3);

              rocket_cargo_sums[name] = rocket_cargo_lvl1_sums[name] + rocket_cargo_lvl2_sums[name] + rocket_cargo_lvl3_sums[name];
              rocket_hatch_sums[name] = rocket_hatch_lvl1_sums[name] + rocket_hatch_lvl2_sums[name] + rocket_hatch_lvl3_sums[name];

              if(records[i].starting_HAB_Level ==="level 1"){
                HAB_start_level_sum[name] += 1
              }
              if(records[i].climbing ==="level 2"){
                HAB_start_level_sum[name] += 2
              }

              if(records[i].HAB_climb === "level 1"){
                HAB_climb_sum[name] += 1
              }
              if(records[i].HAB_climb === "level 2"){
                HAB_climb_sum[name] += 2
              }
              if(records[i].HAB_climb === "level 3"){
                HAB_climb_sum[name] += 3
              }
              if(records[i].HAB_climb === "helped other robot to level 2"){
                HAB_climb_sum[name] += 2
              }
              if(records[i].HAB_climb === "helped other robot to level 3"){
                HAB_climb_sum[name] += 3
              }
              if(records[i].HAB_climb === "did not climb"){
                HAB_climb_sum[name] += 0
              }

              if(records[i].line_pass === "yes"){
                line_pass_sum[name] += 1
              }
              if(records[i].line_pass === "no"){
                line_pass_sum[name] += 0
              }

              if(records[i].immobilized === "no"){
                immobilized_sum[name] += 1
              }
              if(records[i].immobilized === "yes"){
                immobilized_sum[name] += 0
              }

              counts[name]++;
          }

          for(name in cargoship_cargo_sums) {
              results.push({ team_num: name, 
                cargoship_cargo: cargoship_cargo_sums[name] / 3,
                cargoship_hatch: cargoship_hatch_sums[name] / counts[name],

                rocket_cargo: rocket_cargo_sums[name] / counts[name],
                rocket_hatch: rocket_hatch_sums[name] / counts[name],  

                rocket_cargo_lvl1: rocket_cargo_lvl1_sums[name] / counts[name],
                rocket_cargo_lvl2: rocket_cargo_lvl2_sums[name] / counts[name],
                rocket_cargo_lvl3: rocket_cargo_lvl3_sums[name] / counts[name],

                rocket_hatch_lvl1: rocket_hatch_lvl1_sums[name] / counts[name],
                rocket_hatch_lvl2: rocket_hatch_lvl2_sums[name] / counts[name],
                rocket_hatch_lvl3: rocket_hatch_lvl3_sums[name] / counts[name],

                HAB_start_level: HAB_start_level_sum[name] / counts[name],
                HAB_climb: HAB_climb_sum[name] / counts[name],

                line_pass: line_pass_sum[name] / counts[name],
                immobilized: immobilized_sum[name] / counts[name]
              });
            }
            //console.log(records)
          let teams =
            results.map(team => {
              return ({
              number: team['team_num'],
              name: "Team "+ team['team_num'] + " - " + teamName[team['team_num']],
              cargoship_cargo: team['cargoship_cargo'],
              cargoship_hatch: team['cargoship_hatch'],
              rocket_cargo: team['rocket_cargo'],
              rocket_hatch: team['rocket_hatch'],
              rocket_cargo_lvl1: team['rocket_cargo_lvl1'],
              rocket_cargo_lvl2: team['rocket_cargo_lvl2'],
              rocket_cargo_lvl3: team['rocket_cargo_lvl3'],
              rocket_hatch_lvl1: team['rocket_hatch_lvl1'],
              rocket_hatch_lvl2: team['rocket_hatch_lvl2'],
              rocket_hatch_lvl3: team['rocket_hatch_lvl3'],
              HAB_start_level: team['HAB_start_level'],
              HAB_climb: team['HAB_climb'],
              line_pass: team['line_pass'],
              immobilized: team['immobilized'],
              opRank: Math.round(opRank["frc"+team['team_num']]),
              dpRank: Math.round(dpRank["frc"+team['team_num']]),
              dpRankFilter: (dprMax - Math.round(dpRank["frc"+team['team_num']])+1),
              baRank: rankLookup["frc"+team['team_num']],
              baRankFilter: (rankMax- rankLookup["frc"+team['team_num']]+1),
              matches: records.filter(rec => rec.team_num == team.team_num),
              //pit: Pitdata.filter(rec => rec.team_num == team.team_num)
            })}) || [];
            // var scaleMax = Math.round(Math.max(...Object.values(teams.scale)))
            // console.log(scaleMax)
            console.log(results)
          callback({
            teams,
            maxes: {"opRank": oprMax, "dpRank":dprMax, "baRank": rankMax, 
            "cargoship_cargo": 10, "cargoship_hatch": 10, "rocket_cargo":10, "rocket_hatch":10,
            "rocket_cargo_lvl1": 10, "rocket_cargo_lvl2":10, "rocket_cargo_lvl3":10, 
            "rocket_hatch_lvl1":10, "rocket_hatch_lvl2":10, "rocket_hatch_lvl3":10,
            "HAB_start_level": 3, "HAB_climb": 3,
          }
          });
        },
        response => {
          callback(false, response.result.error);
        }
      );
  });
}
