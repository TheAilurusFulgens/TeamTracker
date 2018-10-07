import React from 'react';
import PropTypes from 'prop-types';
import reactStringReplace from 'react-string-replace';
import { Bar } from 'react-chartjs-2';
import './Team.css';

const Car = ({ car, sortOption, search, selected, selectCar }) => (
  <li className="Team">
    <div>
      <h3>
        {search ? (
          reactStringReplace(car.name, search, (match, i) => (
            <span key={i} className="hl">
              {match}
            </span>
          ))
        ) : (
          <span>{car.name}</span>
        )}
      </h3>
    </div>
    <div className={sortOption === 'wTotal' ? 'active' : 'weekend'}>
      {sortOption === 'wTotal' ? null : 'Blue Alliance Rank: '} <span className="number">{car.baRank}</span>
    </div>
    <div className={sortOption === 'dTotal' ? 'active' : 'daily'}>
      {sortOption === 'dTotal' ? null : 'AZTECH Rank: '} <span className="number">{car.dTotal}</span>
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
                car.wStyling,
                car.wAccel,
                car.wHandling,
                car.wFun,
              ],
            },
          ],
        }}
      />
    </div>
    <div className="compare">
      <button onClick={e => selectCar(e, car)} className={selected ? 'selected' : null}>
        {selected ? 'Selected' : 'Compare'}
      </button>
    </div>
  </li>
);

Car.propTypes = {
  car: PropTypes.object.isRequired,
  sortOption: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  selectCar: PropTypes.func.isRequired,
};

export default Car;
