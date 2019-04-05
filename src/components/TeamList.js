import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { PacmanLoader } from 'react-spinners';
import { load } from '../helpers/spreadsheet';
import Team from './Team';
import TeamFilters from './TeamFilters';
import BestOfEach from './BestOfEach';
import './TeamList.css';
import { render } from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from "lodash";

import NotFound from './not-found.gif';

const PAGE_LIMIT = 20;

const SORT_OPTIONS = [
  { value: 'baRankFilter', label: 'Team Rank' },
  { value: 'opRank', label: 'Offensive Power Rank' },
  { value: 'dpRankFilter', label: 'Defensive Power Rank' },
  { value: 'cargoship_cargo', label: 'Cargo Ship Cargo' },
  { value: 'cargoship_hatch', label: 'Cargo Ship Hatch' },
  { value: 'rocket_cargo', label: 'Rocket Cargo' },
  { value: 'rocket_hatch', label: 'Rocket Hatch' },
  { value: 'rocket_cargo_lvl1', label: 'Rocket Cargo Level 1' },
  { value: 'rocket_cargo_lvl2', label: 'Rocket Cargo Level 2' },
  { value: 'rocket_cargo_lvl3', label: 'Rocket Cargo Level 3' },
  { value: 'rocket_hatch_lvl1', label: 'Rocket Hatch Level 1' },
  { value: 'rocket_hatch_lvl2', label: 'Rocket Hatch Level 2' },
  { value: 'rocket_hatch_lvl3', label: 'Rocket Hatch Level 3' },
  { value: 'HAB_start_level', label: 'HAB Start Level' },
  { value: 'HAB_climb', label: 'HAB Climb Level' },
];

const FILTER_OPTIONS = [
  { value: {min: 0, max: 10}, max: 10, option: 'baRank', label: 'Team Rank' },
  { value: {min: 0, max: 10}, max: 10, option: 'opRank', label: 'Offensive Power Rank' },
  { value: {min: -20, max: 10}, max: 10, option: 'dpRank', label: 'Defensive Power Rank' },
  { value: {min: 0, max: 10}, max: 10, option: 'cargoship_cargo', label: 'Cargo Ship Cargo' },
  { value: {min: 0, max: 10}, max: 10, option: 'cargoship_hatch', label: 'Cargo Ship Hatch' },
  { value: {min: 0, max: 10}, max: 10, option: 'rocket_cargo', label: 'Rocket Cargo' },
  { value: {min: 0, max: 10}, max: 10, option: 'rocket_hatch', label: 'Rocket Hatch' },
  { value: {min: 0, max: 10}, max: 10, option: 'rocket_cargo_lvl1', label: 'Rocket Cargo Level 1' },
  { value: {min: 0, max: 10}, max: 10, option: 'rocket_cargo_lvl2', label: 'Rocket Cargo Level 2' },
  { value: {min: 0, max: 10}, max: 10, option: 'rocket_cargo_lvl3', label: 'Rocket Cargo Level 3' },
  { value: {min: 0, max: 10}, max: 10, option: 'HAB_start_level', label: 'HAB Start Level' },
  { value: {min: 0, max: 10}, max: 10, option: 'HAB_climb', label: 'HAB Climb Level' },
];

class TeamList extends Component {
  state = {
    loading: true,
    error: null,
    teams: [],
    page: 0,
    pageCount: 0,
    search: '',
    results: 0,
    sort: SORT_OPTIONS[0],
    selectedTeams: [],
    comparing: false,
    open: false,
    filterOptions: FILTER_OPTIONS,
    drillDownSpecificTeam: null

  };

  componentDidMount() {
    //Load the JavaScript client library.
    window.gapi.load('client', this.start);
  }

  onLoad = (data, error) => {
    if (data) {
      const { page } = this.state;
      this.setState({
        teams: data.teams,
        results: data.teams.length,
        currentResults: data.teams.slice(page, PAGE_LIMIT),
        pageCount: data.teams.length / PAGE_LIMIT,
        loading: false,
      });
      for(let i= 0; i <= FILTER_OPTIONS.length; i++){
        FILTER_OPTIONS[i]["max"] = data.maxes[FILTER_OPTIONS[i].option]
        FILTER_OPTIONS[i]["value"]["max"] = data.maxes[FILTER_OPTIONS[i].option]
      }
    } else {
      this.setState({ error, loading: false });
    }
  };

  start = () => {
    //Initialize the JavaScript client library.
    window.gapi.client
      .init({
        apiKey: process.env.REACT_APP_APIKEY,
        // Your API key will be automatically added to the Discovery Document URLs.
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest'],
      })
      .then(() => {
        //Initialize and make the API request.
        load(this.onLoad);
      });
  };

  selectTeam = (e, team) => {
    const { selectedTeams } = this.state;
    if (selectedTeams.indexOf(team) === -1) {
      selectedTeams.push(team);
    } else {
      selectedTeams.splice(selectedTeams.indexOf(team), 1);
      if (!selectedTeams.length) {
        this.setState({ comparing: false });
      }
    }
    this.setState({ selectedTeams });
  };

  handlePageClick = data => {
    const { selected } = data;
    const searchValue = this.state.search;
    const filteredTeams = this.state.teams.sort((a, b) => b[this.state.sort.value] - a[this.state.sort.value]);
    const searchResults = this.findMatches(searchValue, filteredTeams);
    const filters = this.state.filterOptions;
    const filteredArray = searchResults.filter(
      team =>
        team.cargoship_cargo <= filters.find(option => option.option === 'Cargo Ship Cargo').value.max &&
        team.cargoship_hatch <= filters.find(option => option.option === 'Cargo Ship Hatches').value.max &&
        team.rocket_cargo <= filters.find(option => option.option === 'Rocket Cargo').value.max &&
        team.rocket_hatch <= filters.find(option => option.option === 'Rocket Hatches').value.max &&
        team.rocket_cargo_lvl1 <= filters.find(option => option.option === 'Rocket Cargo Level 1').value.max &&
        team.rocket_cargo_lvl2 <= filters.find(option => option.option === 'Rocket Cargo Level 2').value.max &&
        team.rocket_cargo_lvl3 <= filters.find(option => option.option === 'Rocket Cargo Level 3').value.max &&
        team.rocket_hatch_lvl1 <= filters.find(option => option.option === 'Rocket Hatch Level 1').value.max &&
        team.rocket_hatch_lvl2 <= filters.find(option => option.option === 'Rocket Hatch Level 2').value.max &&
        team.rocket_hatch_lvl3 <= filters.find(option => option.option === 'Rocket Hatch Level 3').value.max &&
        team.HAB_start_level <= filters.find(option => option.option === 'HAB Start Level').value.max &&
        team.HAB_climb <= filters.find(option => option.option === 'HAB Climb').value.max &&

        team.cargoship_cargo >= filters.find(option => option.option === 'Cargo Ship Cargo').value.min &&
        team.cargoship_hatch >= filters.find(option => option.option === 'Cargo Ship Hatches').value.min &&
        team.rocket_cargo >= filters.find(option => option.option === 'Rocket Cargo').value.min &&
        team.rocket_hatch >= filters.find(option => option.option === 'Rocket Hatches').value.min &&
        team.rocket_cargo_lvl1 >= filters.find(option => option.option === 'Rocket Cargo Level 1').value.min &&
        team.rocket_cargo_lvl2 >= filters.find(option => option.option === 'Rocket Cargo Level 2').value.min &&
        team.rocket_cargo_lvl3 >= filters.find(option => option.option === 'Rocket Cargo Level 3').value.min &&
        team.rocket_hatch_lvl1 >= filters.find(option => option.option === 'Rocket Hatch Level 1').value.min &&
        team.rocket_hatch_lvl2 >= filters.find(option => option.option === 'Rocket Hatch Level 2').value.min &&
        team.rocket_hatch_lvl3 >= filters.find(option => option.option === 'Rocket Hatch Level 3').value.min &&
        team.HAB_start_level >= filters.find(option => option.option === 'HAB Start Level').value.min &&
        team.HAB_climb >= filters.find(option => option.option === 'HAB Climb').value.min 

    );
    this.setState({
      currentResults: filteredArray.slice(selected * PAGE_LIMIT, selected * PAGE_LIMIT + PAGE_LIMIT),
      page: selected,
    });
  };

  handleSearch = e => {
    const searchValue = e.target.value;
    const filteredTeams = this.state.teams.sort((a, b) => b[this.state.sort.value] - a[this.state.sort.value]);
    const searchResults = this.findMatches(searchValue, filteredTeams);
    const filters = this.state.filterOptions;
    const filteredArray = searchResults.filter(
      team =>
        team.cargoship_cargo <= filters.find(option => option.option === 'Cargo Ship Cargo').value.max &&
        team.cargoship_hatch <= filters.find(option => option.option === 'Cargo Ship Hatches').value.max &&
        team.rocket_cargo <= filters.find(option => option.option === 'Rocket Cargo').value.max &&
        team.rocket_hatch <= filters.find(option => option.option === 'Rocket Hatches').value.max &&
        team.rocket_cargo_lvl1 <= filters.find(option => option.option === 'Rocket Cargo Level 1').value.max &&
        team.rocket_cargo_lvl2 <= filters.find(option => option.option === 'Rocket Cargo Level 2').value.max &&
        team.rocket_cargo_lvl3 <= filters.find(option => option.option === 'Rocket Cargo Level 3').value.max &&
        team.rocket_hatch_lvl1 <= filters.find(option => option.option === 'Rocket Hatch Level 1').value.max &&
        team.rocket_hatch_lvl2 <= filters.find(option => option.option === 'Rocket Hatch Level 2').value.max &&
        team.rocket_hatch_lvl3 <= filters.find(option => option.option === 'Rocket Hatch Level 3').value.max &&
        team.HAB_start_level <= filters.find(option => option.option === 'HAB Start Level').value.max &&
        team.HAB_climb <= filters.find(option => option.option === 'HAB Climb').value.max &&
        
        team.cargoship_cargo >= filters.find(option => option.option === 'Cargo Ship Cargo').value.min &&
        team.cargoship_hatch >= filters.find(option => option.option === 'Cargo Ship Hatches').value.min &&
        team.rocket_cargo >= filters.find(option => option.option === 'Rocket Cargo').value.min &&
        team.rocket_hatch >= filters.find(option => option.option === 'Rocket Hatches').value.min &&
        team.rocket_cargo_lvl1 >= filters.find(option => option.option === 'Rocket Cargo Level 1').value.min &&
        team.rocket_cargo_lvl2 >= filters.find(option => option.option === 'Rocket Cargo Level 2').value.min &&
        team.rocket_cargo_lvl3 >= filters.find(option => option.option === 'Rocket Cargo Level 3').value.min &&
        team.rocket_hatch_lvl1 >= filters.find(option => option.option === 'Rocket Hatch Level 1').value.min &&
        team.rocket_hatch_lvl2 >= filters.find(option => option.option === 'Rocket Hatch Level 2').value.min &&
        team.rocket_hatch_lvl3 >= filters.find(option => option.option === 'Rocket Hatch Level 3').value.min &&
        team.HAB_start_level >= filters.find(option => option.option === 'HAB Start Level').value.min &&
        team.HAB_climb >= filters.find(option => option.option === 'HAB Climb').value.min 
    );
    this.setState({
      page: 0,
      results: filteredArray.length,
      pageCount: Math.ceil(filteredArray.length / PAGE_LIMIT),
      currentResults: filteredArray.slice(0, PAGE_LIMIT),
      search: searchValue,
    });
  };

  filter = (filterItem, value) => {
    // Current sort & search state results
    const searchValue = this.state.search;
    const filteredTeams = this.state.teams.sort((a, b) => b[this.state.sort.value] - a[this.state.sort.value]);
    const searchResults = this.findMatches(searchValue, filteredTeams);
    // Updated the filter first
    const filters = this.state.filterOptions;
    const updatedFilterOptions = filters.map(filterOption => {
      if (filterOption.option === filterItem) {
        filterOption.value = value;
      }
      return filterOption;
    });
    // Now lets filter out those results

    const filteredArray = searchResults.filter(
      team =>
        team.baRank <= updatedFilterOptions.find(option => option.option === 'baRank').value.max &&
        team.opRank <= updatedFilterOptions.find(option => option.option === 'opRank').value.max &&
        team.dpRank <= updatedFilterOptions.find(option => option.option === 'dpRank').value.max &&
        team.cargoship_cargo <= updatedFilterOptions.find(option => option.option === 'Cargo Ship Cargo').value.max &&
        team.cargoship_hatch <= updatedFilterOptions.find(option => option.option === 'Cargo Ship Hatches').value.max &&
        team.rocket_cargo <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo').value.max &&
        team.rocket_hatch <= updatedFilterOptions.find(option => option.option === 'Rocket Hatches').value.max &&
        team.rocket_cargo_lvl1 <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 1').value.max &&
        team.rocket_cargo_lvl2 <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 2').value.max &&
        team.rocket_cargo_lvl3 <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 3').value.max &&
        team.rocket_hatch_lvl1 <= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 1').value.max &&
        team.rocket_hatch_lvl2 <= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 2').value.max &&
        team.rocket_hatch_lvl3 <= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 3').value.max &&
        team.HAB_start_level <= updatedFilterOptions.find(option => option.option === 'HAB Start Level').value.max &&
        team.HAB_climb <= updatedFilterOptions.find(option => option.option === 'HAB Climb').value.max &&

        team.baRank >= updatedFilterOptions.find(option => option.option === 'baRank').value.min &&
        team.opRank >= updatedFilterOptions.find(option => option.option === 'opRank').value.min &&
        team.dpRank >= updatedFilterOptions.find(option => option.option === 'dpRank').value.min &&
        team.cargoship_cargo >= updatedFilterOptions.find(option => option.option === 'Cargo Ship Cargo').value.min &&
        team.cargoship_hatch >= updatedFilterOptions.find(option => option.option === 'Cargo Ship Hatches').value.min &&
        team.rocket_cargo >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo').value.min &&
        team.rocket_hatch >= updatedFilterOptions.find(option => option.option === 'Rocket Hatches').value.min &&
        team.rocket_cargo_lvl1 >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 1').value.min &&
        team.rocket_cargo_lvl2 >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 2').value.min &&
        team.rocket_cargo_lvl3 >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 3').value.min &&
        team.rocket_hatch_lvl1 >= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 1').value.min &&
        team.rocket_hatch_lvl2 >= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 2').value.min &&
        team.rocket_hatch_lvl3 >= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 3').value.min &&
        team.HAB_start_level >= updatedFilterOptions.find(option => option.option === 'HAB Start Level').value.min &&
        team.HAB_climb >= updatedFilterOptions.find(option => option.option === 'HAB Climb').value.min
        
    );

    this.setState({
      page: 0,
      results: filteredArray.length,
      pageCount: Math.ceil(filteredArray.length / PAGE_LIMIT),
      currentResults: filteredArray.slice(0, PAGE_LIMIT),
      filterOptions: updatedFilterOptions,
    });
  };

  findMatches = (wordToMatch, teams) =>
    teams.filter(team => {
      const regex = new RegExp(wordToMatch, 'gi');
      return team.name.match(regex);
    });

  handleSortChange = selected => {
    const teams = this.state.teams.sort((a, b) => b[selected.value] - a[selected.value]);
    const searchResults = this.findMatches(this.state.search, teams);

    const filters = this.state.filterOptions;
    const filteredArray = searchResults.filter(
      team =>
        team.cargoship_cargo <= filters.find(option => option.option === 'Cargo Ship Cargo').value.max &&
        team.cargoship_hatch <= filters.find(option => option.option === 'Cargo Ship Hatches').value.max &&
        team.rocket_cargo <= filters.find(option => option.option === 'Rocket Cargo').value.max &&
        team.rocket_hatch <= filters.find(option => option.option === 'Rocket Hatches').value.max &&
        team.rocket_cargo_lvl1 <= filters.find(option => option.option === 'Rocket Cargo Level 1').value.max &&
        team.rocket_cargo_lvl2 <= filters.find(option => option.option === 'Rocket Cargo Level 2').value.max &&
        team.rocket_cargo_lvl3 <= filters.find(option => option.option === 'Rocket Cargo Level 3').value.max &&
        team.rocket_hatch_lvl1 <= filters.find(option => option.option === 'Rocket Hatch Level 1').value.max &&
        team.rocket_hatch_lvl2 <= filters.find(option => option.option === 'Rocket Hatch Level 2').value.max &&
        team.rocket_hatch_lvl3 <= filters.find(option => option.option === 'Rocket Hatch Level 3').value.max &&
        team.HAB_start_level <= filters.find(option => option.option === 'HAB Start Level').value.max &&
        team.HAB_climb <= filters.find(option => option.option === 'HAB Climb').value.max &&
        
        team.cargoship_cargo >= filters.find(option => option.option === 'Cargo Ship Cargo').value.min &&
        team.cargoship_hatch >= filters.find(option => option.option === 'Cargo Ship Hatches').value.min &&
        team.rocket_cargo >= filters.find(option => option.option === 'Rocket Cargo').value.min &&
        team.rocket_hatch >= filters.find(option => option.option === 'Rocket Hatches').value.min &&
        team.rocket_cargo_lvl1 >= filters.find(option => option.option === 'Rocket Cargo Level 1').value.min &&
        team.rocket_cargo_lvl2 >= filters.find(option => option.option === 'Rocket Cargo Level 2').value.min &&
        team.rocket_cargo_lvl3 >= filters.find(option => option.option === 'Rocket Cargo Level 3').value.min &&
        team.rocket_hatch_lvl1 >= filters.find(option => option.option === 'Rocket Hatch Level 1').value.min &&
        team.rocket_hatch_lvl2 >= filters.find(option => option.option === 'Rocket Hatch Level 2').value.min &&
        team.rocket_hatch_lvl3 >= filters.find(option => option.option === 'Rocket Hatch Level 3').value.min &&
        team.HAB_start_level >= filters.find(option => option.option === 'HAB Start Level').value.min &&
        team.HAB_climb >= filters.find(option => option.option === 'HAB Climb').value.min 
        
    );

    this.setState({
      teams,
      currentResults: filteredArray.slice(this.state.page * PAGE_LIMIT, this.state.page * PAGE_LIMIT + PAGE_LIMIT),
      sort: selected,
    });
  };

  compare = () => {
    const comparingState = this.state.comparing;
    this.setState({ comparing: !comparingState});
  };

  setSelectedTeamToNull = () => {
    this.setState({ drillDownSpecificTeam: null });
  };

  clearList = () => {
    this.setState({
      comparing: false,
      selectedTeams: [],
    });
  };

  childUpdated = (team) => {
    console.log(team)
    this.setState({
      drillDownSpecificTeam: team
    });
  }

  clearFilters = () => {
    const searchValue = this.state.search;
    const filteredTeams = this.state.teams.sort((a, b) => b[this.state.sort.value] - a[this.state.sort.value]);
    const searchResults = this.findMatches(searchValue, filteredTeams);
    // Now lets filter out those results
    const updatedFilterOptions = this.state.filterOptions.map(filterOption => {
      filterOption.value = {min: 0, max: filterOption.max}
      return filterOption;
    });
    const filteredArray = searchResults.filter(
      team =>
      team.baRank <= updatedFilterOptions.find(option => option.option === 'baRank').value.max &&
      team.opRank <= updatedFilterOptions.find(option => option.option === 'opRank').value.max &&
      team.dpRank <= updatedFilterOptions.find(option => option.option === 'dpRank').value.max &&
      team.cargoship_cargo <= updatedFilterOptions.find(option => option.option === 'Cargo Ship Cargo').value.max &&
      team.cargoship_hatch <= updatedFilterOptions.find(option => option.option === 'Cargo Ship Hatches').value.max &&
      team.rocket_cargo <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo').value.max &&
      team.rocket_hatch <= updatedFilterOptions.find(option => option.option === 'Rocket Hatches').value.max &&
      team.rocket_cargo_lvl1 <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 1').value.max &&
      team.rocket_cargo_lvl2 <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 2').value.max &&
      team.rocket_cargo_lvl3 <= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 3').value.max &&
      team.rocket_hatch_lvl1 <= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 1').value.max &&
      team.rocket_hatch_lvl2 <= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 2').value.max &&
      team.rocket_hatch_lvl3 <= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 3').value.max &&
      team.HAB_start_level <= updatedFilterOptions.find(option => option.option === 'HAB Start Level').value.max &&
      team.HAB_climb <= updatedFilterOptions.find(option => option.option === 'HAB Climb').value.max &&

      team.baRank >= updatedFilterOptions.find(option => option.option === 'baRank').value.min &&
      team.opRank >= updatedFilterOptions.find(option => option.option === 'opRank').value.min &&
      team.dpRank >= updatedFilterOptions.find(option => option.option === 'dpRank').value.min &&
      team.cargoship_cargo >= updatedFilterOptions.find(option => option.option === 'Cargo Ship Cargo').value.min &&
      team.cargoship_hatch >= updatedFilterOptions.find(option => option.option === 'Cargo Ship Hatches').value.min &&
      team.rocket_cargo >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo').value.min &&
      team.rocket_hatch >= updatedFilterOptions.find(option => option.option === 'Rocket Hatches').value.min &&
      team.rocket_cargo_lvl1 >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 1').value.min &&
      team.rocket_cargo_lvl2 >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 2').value.min &&
      team.rocket_cargo_lvl3 >= updatedFilterOptions.find(option => option.option === 'Rocket Cargo Level 3').value.min &&
      team.rocket_hatch_lvl1 >= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 1').value.min &&
      team.rocket_hatch_lvl2 >= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 2').value.min &&
      team.rocket_hatch_lvl3 >= updatedFilterOptions.find(option => option.option === 'Rocket Hatch Level 3').value.min &&
      team.HAB_start_level >= updatedFilterOptions.find(option => option.option === 'HAB Start Level').value.min &&
      team.HAB_climb >= updatedFilterOptions.find(option => option.option === 'HAB Climb').value.min
    );

    this.setState({
      page: 0,
      results: filteredArray.length,
      pageCount: Math.ceil(filteredArray.length / PAGE_LIMIT),
      currentResults: filteredArray.slice(0, PAGE_LIMIT),
      filterOptions: updatedFilterOptions,
    });
  };

  renderFullList = () => (
    <div className="TeamList">
      <div className="filters">
        <div className="filter-wrapper search">
          <span className="filter-label">Search:</span>{' '}
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Type a team number..."
            value={this.state.search}
            onChange={e => this.handleSearch(e)}
          />
        </div>
        <div className="filter-wrapper">
          <span className="filter-label">Sort By:</span>{' '}
          <Select
            options={SORT_OPTIONS}
            className="filter"
            isClearable={false}
            value={this.state.sort}
            onChange={this.handleSortChange}
          />
        </div>
        <div className="filter-wrapper">
          <button className="filter-button" onClick={() => this.setState({ open: !this.state.open })}>
            {this.state.open ? 'Close' : 'Open'} Filters
          </button>
        </div>
      </div>
      <h4 style={{ textAlign: `center` }}>Total Teams: {this.state.results}</h4>
      <div className="list-and-filters">
        {this.renderTeamList()}
        <TeamFilters
          open={this.state.open}
          filterOptions={this.state.filterOptions}
          filter={this.filter}
          clearFilters={this.clearFilters}
        />
      </div>

      <ReactPaginate
        previousLabel={
          <span role="img" aria-labelledby="Arrow backward">
            ◀️
          </span>
        }
        nextLabel={
          <span role="img" aria-labelledby="Arrow forward">
            ▶️
          </span>
        }
        breakLabel={<button onClick={e => e.preventDefault()}>...</button>}
        breakClassName="break-me"
        forcePage={this.state.page}
        pageCount={this.state.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={this.handlePageClick}
        containerClassName="pagination"
        subContainerClassName="pages pagination"
        activeClassName="active"
      />
    </div>
  );

  renderTeamList = () => (
    <ul className="team-list">
      {this.state.currentResults.length ? (
        this.state.currentResults.map(team => (
          <Team
            key={team.name}
            team={team}
            sortOption={this.state.sort.value}
            search={this.state.search}
            selectTeam={this.selectTeam}
            selected={this.state.selectedTeams.indexOf(team) !== -1}
            childUpdated={this.childUpdated}
          />
        ))
      ) : (
        <div className="no-results">
          <h2>Looks like there aren't any teams that match your search</h2>
          <img src={NotFound} alt="No Results" />
        </div>
      )}
    </ul>
  );

  renderCompareList = () => (
    <div>
      <ul className="team-list">
        {this.state.selectedTeams.map(team => (
          <Team
            key={team.name}
            team={team}
            sortOption={this.state.sort.value}
            search={this.state.search}
            selectTeam={this.selectTeam}
            selected={this.state.selectedTeams.indexOf(team) !== -1}
            childUpdated={this.childUpdated}
          />
        ))}
      </ul>
      {this.state.selectedTeams.length ? <BestOfEach selectedTeams={this.state.selectedTeams} /> : null}
    </div>
  );

  renderMatchTable = () => (
    <div className='team-table' style={{borderRadius: '5px'}}>
    <p>
      <h1 style={{ fontWeight: 1000 }}>{this.state.drillDownSpecificTeam.name}</h1>
    </p>
      <p><h3>Blue Alliance Rank: {this.state.drillDownSpecificTeam.baRank}</h3></p>
      <p><h3>Offensive Power Rank: {this.state.drillDownSpecificTeam.opRank}</h3></p>
      <p><h3>Defensive Power Rank: {this.state.drillDownSpecificTeam.dpRank}</h3></p>
      <ReactTable
          data={this.state.drillDownSpecificTeam.matches}
          columns={[
            {
              columns: [
                {
                  Header: "Match Number",
                  headerClassName: 'headBold',
                  accessor: "match_num",
                  maxWidth: 150
                },
                {
                  Header: "HAB Start",
                  headerClassName: 'headBold',
                  id: "lastName",
                  accessor: "HAB_start_level",
                  className: "wordwrap"
                }
              ]
            },
            {
              columns: [
                
                {
                  Header: "Cargo Ship Cargo",
                  headerClassName: 'headBold',
                  accessor: "cargoship_cargo",
                  maxWidth: 125,
                  Footer: (
                    <span>
                      <strong>Average:</strong>{" "}
                      {Math.round(this.state.drillDownSpecificTeam.cargoship_cargo*100)/100}
                    </span>
                  )
                },
                // {
                //   Header: "Scale",
                //   headerClassName: 'headBold',
                //   accessor: "scale",
                //   maxWidth: 125,
                //   Footer: (
                //     <span>
                //       <strong>Average:</strong>{" "}
                //       {Math.round(this.state.drillDownSpecificTeam.scale*100)/100}
                //     </span>
                //   )
                // },
                // {
                //   Header: "Exchange",
                //   headerClassName: 'headBold',
                //   accessor: "exchange",
                //   maxWidth: 125,
                //   Footer: (
                //     <span>
                //       <strong>Average:</strong>{" "}
                //       {Math.round(this.state.drillDownSpecificTeam.exchange*100)/100}
                //     </span>
                //   )
                // },
                // {
                //   Header: "Climbing",
                //   headerClassName: 'headBold',
                //   accessor: "climbing",
                //   maxWidth: 150,
                //   Footer: (
                //     <span>
                //       <strong>Climbing:</strong>{" "}
                //       {
                //         _.first(
                //           _.reduce(
                //             _.map(_.groupBy(this.state.drillDownSpecificTeam.matches, d => d.climbing)),
                //             (a, b) => (a.length > b.length ? a : b)
                //           )
                //         ).climbing
                //       }
                //     </span>
                //   )
                // },
                {
                  Header: "Comments",
                  headerClassName: 'headBold',
                  accessor: "comments",
                  className: "wordwrap"
                }
              ]
            },
          ]}
          showPagination={false}
          style={{
            height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          //defaultPageSize={-1}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
    </div>
  );

  render() {
    if (this.state.loading) {
      return (
        <div className="Loading">
          <PacmanLoader color="#6aa84f" loading={this.state.loading} />
        </div>
      );
    }
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
    return (
      <div>
        {this.state.drillDownSpecificTeam == null ? (!this.state.comparing ? this.renderFullList() : this.renderCompareList()) : this.renderMatchTable()}
        {this.state.selectedTeams.length ? (
          <div className="comparing-buttons">
            <button className="main" onClick={() => this.compare()}>
              {this.state.comparing ? 'Cancel' : 'Compare'}
            </button>
            <button onClick={() => this.clearList()}>Clear List</button>
          </div>
        ) : null}
        {this.state.drillDownSpecificTeam != null ? (
          <div className="comparing-buttons">
            <button className="main" onClick={() => this.setSelectedTeamToNull()}>
              Back
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default TeamList;
