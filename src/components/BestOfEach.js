import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BestOfEach.css';

class BestOfEach extends Component {
  findBest = key => {
    console.log(process.env.HOME)
    const keys = this.props.selectedTeams.map(teamObject => teamObject[key]);
    const maxValue = Math.max(...keys);
    const team = this.props.selectedTeams.find(teamObject => teamObject[key] === maxValue);
    return team.name;
  };
  render() {
    if (this.props.selectedteams.length) {
      return (
        <div className="best-card">
          <h3>Best of each category</h3>
          <p>
            {/* <span role="img" aria-label="Checkmark">
              ✅
            </span>{' '} */}
           Team Rank: <span style={{ fontWeight: 600 }}>{this.findBest('baRank')}</span>
          </p>
          <p>
            AZTech Rank: <span style={{ fontWeight: 600 }}>{this.findBest('azRank')}</span>
          </p>
          <p>
            Switch: <span style={{ fontWeight: 600 }}>{this.findBest('switch')}</span>
          </p>
          <p>
            Scale: <span style={{ fontWeight: 600 }}>{this.findBest('scale')}</span>
          </p>
          <p>
            Exchange: <span style={{ fontWeight: 600 }}>{this.findBest('exchange')}</span>
          </p>
          <p>
            Climbing: <span style={{ fontWeight: 600 }}>{this.findBest('climbing')}</span>
          </p>
          {/* <p>
            Cool Factor: <span style={{ fontWeight: 600 }}>{this.findBest('wCool')}</span>
          </p> */}
        </div>
      );
    }
  }
}

BestOfEach.propTypes = {
  selectedteams: PropTypes.array.isRequired,
};

export default BestOfEach;
