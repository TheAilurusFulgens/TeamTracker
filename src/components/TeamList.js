import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { PacmanLoader } from 'react-spinners';
import { load } from '../helpers/spreadsheet';
import Team from './Team';
import TeamFilters from './TeamFilters';
import BestOfEach from './BestOfEach';
import './TeamList.css';

import NotFound from './not-found.gif';

const PAGE_LIMIT = 20;

const SORT_OPTIONS = [
  { value: 'baRank', label: 'Team Rank' },
  { value: 'azRank', label: 'AZTECH Rank' },
  { value: 'switch', label: 'Switch' },
  { value: 'scale', label: 'Scale' },
  { value: 'exchange', label: 'Exchange' },
  { value: 'climbing', label: 'Climbing' },
];

const FILTER_OPTIONS = [
  { value: 10, option: 'switch', label: 'Team Rank' },
  { value: 10, option: 'scale', label: 'AZTECH Rank' },
  { value: 10, option: 'exchange', label: 'Switch' },
  { value: 10, option: 'climbing', label: 'Scale' },
  { value: 10, option: 'wCool', label: 'Exchange' },
  { value: 10, option: 'dFeatures', label: 'Climbing' },
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
    } else {
      this.setState({ error, loading: false });
    }
  };

  start = () => {
    //Initialize the JavaScript client library.
    window.gapi.client
      .init({
        apiKey: 'AIzaSyC1bxZaTOj6Nu8otaC-teW1Tb5anLaAG2E',
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
        team.switch <= filters.find(option => option.option === 'switch').value &&
        team.scale <= filters.find(option => option.option === 'scale').value &&
        team.exchange <= filters.find(option => option.option === 'exchange').value &&
        team.climbing <= filters.find(option => option.option === 'climbing').value
        // team.wCool <= filters.find(option => option.option === 'wCool').value &&
        // team.dFeatures <= filters.find(option => option.option === 'dFeatures').value

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
        team.switch <= filters.find(option => option.option === 'switch').value &&
        team.scale <= filters.find(option => option.option === 'scale').value &&
        team.exchange <= filters.find(option => option.option === 'exchange').value &&
        team.climbing <= filters.find(option => option.option === 'climbing').value 
        // team.wCool <= filters.find(option => option.option === 'wCool').value &&
        // team.dFeatures <= filters.find(option => option.option === 'dFeatures').value

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
    console.log(FILTER_OPTIONS);
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
        team.baRank <= updatedFilterOptions.find(option => option.option === 'switch').value &&
        team.azRank <= updatedFilterOptions.find(option => option.option === 'scale').value &&
        team.switch <= updatedFilterOptions.find(option => option.option === 'exchange').value &&
        team.scale <= updatedFilterOptions.find(option => option.option === 'climbing').value &&
        team.exchange <= updatedFilterOptions.find(option => option.option === 'wCool').value &&
        team.climbing <= updatedFilterOptions.find(option => option.option === 'dFeatures').value
        
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
        team.switch <= filters.find(option => option.option === 'switch').value &&
        team.scale <= filters.find(option => option.option === 'scale').value &&
        team.exchange <= filters.find(option => option.option === 'exchange').value &&
        team.climbing <= filters.find(option => option.option === 'climbing').value 
        // team.wCool <= filters.find(option => option.option === 'wCool').value &&
        // team.dFeatures <= filters.find(option => option.option === 'dFeatures').value
        
    );

    this.setState({
      teams,
      currentResults: filteredArray.slice(this.state.page * PAGE_LIMIT, this.state.page * PAGE_LIMIT + PAGE_LIMIT),
      sort: selected,
    });
  };

  compare = () => {
    const comparingState = this.state.comparing;
    this.setState({ comparing: !comparingState });
  };

  clearList = () => {
    this.setState({
      comparing: false,
      selectedTeams: [],
    });
  };

  clearFilters = () => {
    const searchValue = this.state.search;
    const filteredTeams = this.state.teams.sort((a, b) => b[this.state.sort.value] - a[this.state.sort.value]);
    const searchResults = this.findMatches(searchValue, filteredTeams);
    // Now lets filter out those results
    const updatedFilterOptions = this.state.filterOptions.map(filterOption => {
      filterOption.value = 10;
      return filterOption;
    });
    const filteredArray = searchResults.filter(
      team =>
        team.switch <= updatedFilterOptions.find(option => option.option === 'switch').value &&
        team.scale <= updatedFilterOptions.find(option => option.option === 'scale').value &&
        team.exchange <= updatedFilterOptions.find(option => option.option === 'exchange').value &&
        team.climbing <= updatedFilterOptions.find(option => option.option === 'climbing').value 
        // team.wCool <= updatedFilterOptions.find(option => option.option === 'wCool').value &&
        // team.dFeatures <= updatedFilterOptions.find(option => option.option === 'dFeatures').value
       
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
            placeholder="Start typing a team number..."
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
          />
        ))}
      </ul>
      {this.state.selectedTeams.length ? <BestOfEach selectedTeams={this.state.selectedTeams} /> : null}
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
        {!this.state.comparing ? this.renderFullList() : this.renderCompareList()}
        {this.state.selectedTeams.length ? (
          <div className="comparing-buttons">
            <button className="main" onClick={() => this.compare()}>
              {this.state.comparing ? 'Cancel' : 'Compare'}
            </button>
            <button onClick={() => this.clearList()}>Clear List</button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default TeamList;
