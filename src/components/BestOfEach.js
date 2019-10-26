import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BestOfEach.css';

class BestOfEach extends Component {
  findBest = key => {
    console.log("------------------------------------------------")
    //console.log(process.env.HOME)
    const keys = this.props.selectedTeams.map(teamObject => teamObject[key]);
    const maxValue = Math.max(...keys);
    console.log("Values")
    console.log(keys)
    console.log("key")
    console.log(key)
    console.log("Selected Teams")
    console.log(this.props.selectedTeams)
    console.log("Max value")
    console.log(maxValue)
    const team = this.props.selectedTeams.find(teamObject => {
      console.log("IN FIND: " + teamObject + " Key: " +  teamObject[key] + " Max Value: " + maxValue)
      console.log(teamObject[key] === maxValue)
      return teamObject[key] === maxValue});

      console.log(team)
    return team.name;
  };
  render() {
    if (this.props.selectedTeams.length) {
      return (
        <div className="best-card">
          <h3>Best of each category</h3>
          <p>
           Team Rank: <span style={{ fontWeight: 600 }}>{this.findBest('baRankFilter')}</span>
          </p>
          <p>
            Offensive Power Rank: <span style={{ fontWeight: 600 }}>{this.findBest('opRank')}</span>
          </p>
          <p>
            Defensive Power Rank: <span style={{ fontWeight: 600 }}>{this.findBest('dpRankFilter')}</span>
          </p>
          <p>
            HAB Start Level: <span style={{ fontWeight: 600 }}>{this.findBest('HAB_start_level')}</span>
          </p>
          <p>
            Cargo Ship Cargo: <span style={{ fontWeight: 600 }}>{this.findBest('cargoship_cargo')}</span>
          </p>
          <p>
            Cargo Ship Hatches: <span style={{ fontWeight: 600 }}>{this.findBest('cargoship_hatch')}</span>
          </p>
          <p>
            Rocket Cargo: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_cargo')}</span>
          </p>
          <p>
            Rocket Hatches: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_hatch')}</span>
          </p>
          <p>
            Rocket Cargo Level 1: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_cargo_lvl1')}</span>
          </p>
          <p>
            Rocket Cargo Level 2: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_cargo_lvl2')}</span>
          </p>
          <p>
            Rocket Cargo Level 3: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_cargo_lvl3')}</span>
          </p>
          <p>
            Rocket Hatches Level 1: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_hatch_lvl1')}</span>
          </p>
          <p>
            Rocket Hatches Level 2: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_hatch_lvl2')}</span>
          </p>
          <p>
            Rocket Hatches Level 3: <span style={{ fontWeight: 600 }}>{this.findBest('rocket_hatch_lvl3')}</span>
          </p>
          <p>
            HAB Climb Level: <span style={{ fontWeight: 600 }}>{this.findBest('HAB_climb')}</span>
          </p>
        </div>
      );
    }
  }
}

BestOfEach.propTypes = {
  selectedteams: PropTypes.array.isRequired,
};

export default BestOfEach;
