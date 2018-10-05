import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BestOfEach.css';

class BestOfEach extends Component {
  findBest = key => {
    // console.log("key")
    // console.log(key)
    // console.log("this.props.selectedCars")
    // console.log(this.props.selectedCars)
    // console.log("keys")
    console.log(process.env.HOME)
    const keys = this.props.selectedCars.map(carObject => carObject[key]);
    // console.log(keys)
    const maxValue = Math.max(...keys);
    // console.log("maxValues")
    // console.log(maxValue)
    const car = this.props.selectedCars.find(carObject => carObject[key] === maxValue);
    // console.log(car.name)
    return car.name;
  };
  render() {
    if (this.props.selectedCars.length) {
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
            AZTech Rank: <span style={{ fontWeight: 600 }}>{this.findBest('dTotal')}</span>
          </p>
          <p>
            Switch: <span style={{ fontWeight: 600 }}>{this.findBest('wStyling')}</span>
          </p>
          <p>
            Scale: <span style={{ fontWeight: 600 }}>{this.findBest('wAccel')}</span>
          </p>
          <p>
            Exchange: <span style={{ fontWeight: 600 }}>{this.findBest('wHandling')}</span>
          </p>
          <p>
            Climbing: <span style={{ fontWeight: 600 }}>{this.findBest('wFun')}</span>
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
  selectedCars: PropTypes.array.isRequired,
};

export default BestOfEach;
