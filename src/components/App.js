import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import logo from "./favicon.png";
import react from "./logo.svg";
import "./App.css";
import TeamList from "./TeamList";
import TeamPage from "./TeamPage";
import FormPage from "./FormPage";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

class App extends Component {
  render() {
    return (
      <div className="App">
      <header className="App-header">
      {/*<img src={logo} className="TeamPage-logo" alt="logo" />*/}
        <h1 className="App-title">TeamTracker</h1>
        <p>
          Team Scouting App created by the AZTECH
        </p>
      </header>
      <div className="sideNav">
      <BrowserRouter>
        <Route
          render={({ location, history }) => (
            <React.Fragment>
              <div className="sidenav">
              <SideNav
                onSelect={selected => {
                  const to = "/" + selected;
                  if (location.pathname !== to) {
                    history.push(to);
                  }
                }}
              >
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="">
                  <NavItem eventKey="">
                    <NavIcon>
                    </NavIcon>
                    <NavText>Team Page</NavText>
                  </NavItem>
                  <NavItem eventKey="form">
                    <NavIcon>
                    </NavIcon>
                    <NavText>Form</NavText>
                  </NavItem>
                </SideNav.Nav>
              </SideNav>
              </div>
              <main>
                <Route path="/" exact component={props => <TeamPage />} />
                <Route path="/form" component={props => <FormPage />} />
              </main>
            </React.Fragment>
          )}
        />
      </BrowserRouter>
      </div>
      <footer className="App-footer">
          <p>
            Made by{' '}
            <a href="https://sites.google.com/view/cdsrobotics">AZTECH 6479</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
