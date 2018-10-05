// import { orderBy } from "lodash";
// import { hash } from "./utils";
// import { get } from "./localStorage";

import config from "../config";

/**
 * Load the teams from the spreadsheet
 * Get the right values from it and assign.
 */
export function load(callback) {
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
              if(records[i].climbing ==="Maybe"){
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

          let cars =
            results.map(car => ({
              name: car['team_num'],
              wStyling: car["switch"],
              wAccel: car["scale"],
              wHandling: car["exchange"],
              wFun: car["climbing"],
              wTotal: 0,
              dTotal: 0,
              baRank: 2
            })) || [];

          callback({
            cars
          });
        },
        response => {
          callback(false, response.result.error);
        }
      );
  });
}
