import React, { Component } from 'react';
import logo from './favicon.png';
import react from './logo.svg';
import './App.css';
import TeamList from './TeamList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">TeamTracker</h1>
          <p>
            Team Scouting App created by the AZTECH
          </p>
        </header>
        <TeamList />
        <footer className="App-footer">
          <p>
            Made by{' '}
            <a href="https://twitter.com/cdsrobotics">AZTECH 6479</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
