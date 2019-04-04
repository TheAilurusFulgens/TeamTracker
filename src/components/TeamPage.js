import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import logo from './favicon.png';
import react from './logo.svg';
import './TeamPage.css';
import TeamList from './TeamList';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class TeamPage extends Component {
  render() {
    return (
      <div>
        <TeamList></TeamList>
      </div>
    );
  }
}

export default TeamPage;
