import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import './TeamFilters.css';
import '../../node_modules/react-input-range/lib/css/index.css';

class TeamFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: { min: 2, max: 10 },
    };
  }
  render() {
    return (
      <div className={`TeamFilters ${this.props.open ? 'open' : `closed`}`}>
        <div className="filter-card">
          <h3>Filters</h3>
          {this.props.filterOptions.map(filterOption => (
            <div className="filter-item" key={filterOption.label}>
              <p>{filterOption.label}</p>
              <InputRange
                maxValue={10}
                minValue={0}
                step={1}
                value={filterOption.value}
                onChange={value => this.props.filter(filterOption.option, value)}
              />
              <hr />
            </div>
          ))}
          <button className="filter-button" onClick={() => this.props.clearFilters()}>
            Clear Filters
          </button>
        </div>
      </div>
    );
  }
}
TeamFilters.propTypes = {
  open: PropTypes.bool.isRequired,
  filterOptions: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default TeamFilters;
