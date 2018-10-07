import React from 'react';
import PropTypes from 'prop-types';
import reactStringReplace from 'react-string-replace';
import { Bar } from 'react-chartjs-2';
import './Team.css';

const Team = ({ team, sortOption, search, selected, selectTeam }) => (
  <li className="Team">
    <div>
      <h3>
        {search ? (
          reactStringReplace(team.name, search, (match, i) => (
            <span key={i} className="hl">
              {match}
            </span>
          ))
        ) : (
          <span>{team.name}</span>
        )}
      </h3>
    </div>
    <div className={sortOption === 'azRank' ? 'active' : 'weekend'}>
      {sortOption === 'azRank' ? null : 'Blue Alliance Rank: '} <span className="number">{team.baRank}</span>
    </div>
    <div className={sortOption === 'azRank' ? 'active' : 'daily'}>
      {sortOption === 'azRank' ? null : 'AZTECH Rank: '} <span className="number">{team.azRank}</span>
    </div>
    <div style={{ marginTop: 20 }}>
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
            'Switch',
            'Scale',
            'Exchange',
            'Climbing',
          ],
          datasets: [
            {
              label: 'Score',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [
                team.switch,
                team.scale,
                team.exchange,
                team.climbing,
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
