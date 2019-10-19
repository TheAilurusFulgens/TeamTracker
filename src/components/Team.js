import React from 'react';
import PropTypes from 'prop-types';
import reactStringReplace from 'react-string-replace';
import { Bar } from 'react-chartjs-2';
import './Team.css';
import ball from './Ball.png';
//import { set, get } from "./localStorage";

const Team = ({ team, sortOption, search, selected, selectTeam, childUpdated }) => (
  <li className="Team">
    <div>
      <h3>
        {search ? (
          //reactStringReplace(team.name, search, (match, i) => (
            <span><a href='team' onClick= {e => {e.preventDefault(); childUpdated(team)}}>{team.name}</a></span>
            // <span key={i} className="hl ">
            //   {match}
            // </span>
          
        ) : (
          <span><a href='team' onClick= {e => {e.preventDefault(); childUpdated(team)}}>{team.name}</a></span>
        )}
      </h3>
    </div>
    <div className={sortOption === 'baRankFilter' ? 'active' : 'weekend'}>
      {sortOption === 'baRankFilter' ? null : 'Blue Alliance Rank: '} <span className="number">{team.baRank}</span>
    </div>
    <div className={sortOption === 'opRank' ? 'active' : 'daily'}>
      {sortOption === 'opRank' ? null : 'Offensive Power Rank: '} <span className="number">{team.opRank}</span>
    </div>
    <div className={sortOption === 'dpRankFilter' ? 'active' : 'score'}>
      {sortOption === 'dpRankFilter' ? null : 'Defensive Power Rank: '} <span className="number">{team.dpRank}</span>
    </div>
    {/* <div className={sortOption === 'HAB_climb' ? 'active' : 'score'}>
      {sortOption === 'HAB_climb' ? null : 'Atleast Lvl 1 Climb: '} <span className="number">100%</span>
    </div>
    <div className={sortOption === 'HAB_climb' ? 'active' : 'score'}>
      {sortOption === 'HAB_climb' ? null : 'Atleast Lvl 2 Climb: '} <span className="number">100%</span>
    </div>
    <div className={sortOption === 'HAB_climb' ? 'active' : 'score'}>
      {sortOption === 'HAB_climb' ? null : 'Atleast Lvl 3 Climb: '} <span className="number">100%</span>
    </div> */}
    <div style={{ marginTop: 20}}>
      <Bar
        options={{
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  max: 8,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  autoSkip: false,
                },
              },
            ],
          },
        }}
        data={{
          labels: [
            'Cargo Ship Ball',
            'Cargo Ship Hatch',
            'Rocket Cargo',
            'Rocket Hatches',
            'HAB Climb'
          ],
          datasets: [
            {
              label: 'Score',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [
                team.cargoship_cargo,
                team.cargoship_hatch,
                team.rocket_cargo,
                team.rocket_hatch,
                team.HAB_climb
              ],
            },
          ],
        }}
      />
    </div>


    <div className="compare">
      <button onClick={e => selectTeam(e, team)} className={selected ? 'selected' : null}>
        {selected ? 'Selected' : 'Compare'}
      </button>
    </div>
  </li>
);

Team.propTypes = {
  team: PropTypes.object.isRequired,
  sortOption: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  selectTeam: PropTypes.func.isRequired,
};

export default Team;
