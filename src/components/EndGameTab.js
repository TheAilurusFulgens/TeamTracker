import React, { Component } from 'react';
import './FormPage.css';
import TextField from '@material-ui/core/TextField';

class EndGameTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: '0',
      show: true
   }
  }
  handleChange = name => event => {
    this.setState({
      [this.clicks]: event.target.value,
    });
  };
  IncrementItem = () => {
    this.handleChange('clicks')

    this.setState({ clicks: (parseInt(this.state.clicks) + 1 ).toString()});
  }
  DecreaseItem = () => {
    this.handleChange('clicks')
    this.setState({ clicks: this.state.clicks - 1 });
  }
  
  render() {
    const { classes } = this.props;
    return (
      <div className= "FormPage" >
      <form noValidate autoComplete="off">
        <TextField
          required
          id="outlined-required"
          label="Team Number"
          defaultValue=""
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
          id="outlined-required"
          label="Match Number"
          defaultValue=""
          margin="normal"
          variant="outlined"
        />
        <h4></h4>
        <div class="triangle-up" onClick={this.IncrementItem}></div>
        <TextField
          label="Counter"
          type="number"
          value= {this.state.clicks}
          onChange={this.handleChange('clicks')}
          margin="normal"
          variant="outlined"
        />
        
        <div class="triangle-down" onClick={this.DecreaseItem}></div>
        </form>
      </div>
    );
  }
}

export default EndGameTab;