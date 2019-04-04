import React, { Component } from 'react';
import './Stopwatch.css'

const leftPad = (width, n) => {
    if ((n + '').length > width) {
        return n;
    }
    const padding = new Array(width).join('0');
    return (padding + n).slice(-width);
  };
  
  class Stopwatch extends React.Component {
    constructor(props) {
      super(props);
      
      ["update", "reset", "toggle"].forEach((method) => {
          this[method] = this[method].bind(this);
      });
  
      this.state = this.initialState = {
        isRunning: false,
        timeElapsed: 0,
      };
    }
    toggle() {
      this.setState({isRunning: !this.state.isRunning}, () => {
        this.state.isRunning ? this.startTimer() : clearInterval(this.timer)
      });
    }
    reset() {
      clearInterval(this.timer);
      this.setState(this.initialState);
    }
    startTimer() {
      this.startTime = Date.now();
      this.timer = setInterval(this.update, 10);
    }
    update() {
      const delta = Date.now() - this.startTime;
      this.setState({timeElapsed: this.state.timeElapsed + delta});
      this.startTime = Date.now();
    }
    render() {
      const {isRunning, lapTimes, timeElapsed} = this.state;
      return (
              <div>
                <TimeElapsed id="timer" timeElapsed=     {this.state.timeElapsed} />
                <button onClick={this.toggle}>
                  {this.state.isRunning ? 'Stop' : 'Start'}
                </button>
                <button
                  onClick= {this.reset}
                  disabled={this.state.isRunning && this.state.timeElapsed || (this.state.timeElapsed === 0)}
                >
                  Reset
                </button>
              </div>
      );
    }
  }
  
  class TimeElapsed extends React.Component {
    getUnits() {
      const seconds = this.props.timeElapsed / 1000;
      return {
        min: Math.floor(seconds / 60).toString(),
        sec: Math.floor(seconds % 60).toString(),
        msec: (seconds % 1).toFixed(3).substring(2)
      };
    }
    render() {
      const units = this.getUnits();
      return (
        <div id={this.props.id}>
          <span>{leftPad(2, units.min)}:</span>
          <span>{leftPad(2, units.sec)}.</span>
          <span>{units.msec}</span>
        </div>
      );
    }
  }
  
  export default Stopwatch;