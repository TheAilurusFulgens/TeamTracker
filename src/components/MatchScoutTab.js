import React, { Component } from 'react';
import './FormPage.css';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import './MatchScoutTab.css'
import Stopwatch from './Stopwatch'

const HABStart = [
  {
    value: 0,
    label: 'None',
  },
  {
    value: 1,
    label: 'One',
  },
  {
    value: 2,
    label: 'Two',
  },
];

class MatchScoutTab extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState = {
      CargoAuto: '0',
      CargoAquired: '0',
      CargoLow: '0',
      CargoMiddle: '0',
      CargoTop: '0',
      CargoDropped: '0',
      HatchAuto: '0',
      HatchAcquired: '0',
      HatchLow: '0',
      HatchMiddle: '0',
      HatchTop: '0',
      HatchDropped: '0',
      HABStart: '',
           
   }
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  IncrementElement = name => () => {
    this.setState({ [name]: (parseInt(this.state[name]) + 1 ).toString()});
  }
  DecrementElement = name => () => {
    this.setState({ [name]: this.state[name] - 1 });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className= "FormPage" >
        <form noValidate autoComplete="off">
          <div className= "FormRow">
            <TextField
              required
              id="outlined-required"
              label="Team Number"
              defaultValue=""
              margin="normal"
              variant="outlined"
              className = "TextBox"
            />
            <TextField
              required
              id="outlined-required"
              label="Match Number"
              defaultValue=""
              margin="normal"
              variant="outlined"
            />
          </div>
          <br></br>
          <div className= "FormRow">
            <div>
              <h2>HAB Start Level:</h2>
              <TextField
                select
                label="HAB Start"
                value={this.state.HABStart}
                variant="outlined"
                onChange={this.handleChange('HABStart')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Level</InputAdornment>,
                }}
              >
                {HABStart.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
              <h2>Cargo:  </h2>
              <div class="triangle-up" onClick={this.IncrementElement("CargoAuto")}></div>
              <TextField
                label="Auto"
                type="number"
                value= {this.state.CargoAuto}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("CargoAuto")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("CargoAquired")}></div>
              <TextField
                label="Acquired"
                type="number"
                value= {this.state.CargoAquired}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("CargoAquired")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("CargoLow")}></div>
              <TextField
                label="Delivered Low"
                type="number"
                value= {this.state.CargoLow}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("CargoLow")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("CargoMiddle")}></div>
              <TextField
                label="Delivered Middle"
                type="number"
                value= {this.state.CargoMiddle}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("CargoMiddle")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("CargoTop")}></div>
              <TextField
                label="Delivered Top"
                type="number"
                value= {this.state.CargoTop}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("CargoTop")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("CargoDropped")}></div>
              <TextField
                label="Dropped"
                type="number"
                value= {this.state.CargoDropped}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("CargoDropped")}></div>
            </div>

            <div>
              <h2>Hatch:  </h2>
              <div class="triangle-up" onClick={this.IncrementElement("HatchAuto")}></div>
              <TextField
                label="Auto"
                type="number"
                value= {this.state.HatchAuto}
                onChange={this.handleChange('AutoHatch')}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("HatchAuto")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("HatchAcquired")}></div>
              <TextField
                label="Acquired"
                type="number"
                value= {this.state.HatchAuto}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("HatchAquired")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("HatchLow")}></div>
              <TextField
                label="Low"
                type="number"
                value= {this.state.HatchLow}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("HatchLow")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("HatchMiddle")}></div>
              <TextField
                label="Middle"
                type="number"
                value= {this.state.HatchMiddle}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("HatchMiddle")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("HatchTop")}></div>
              <TextField
                label="Top"
                type="number"
                value= {this.state.HatchTop}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("HatchTop")}></div>
            </div>
            <div>
              <div class="triangle-up" onClick={this.IncrementElement("HatchDropped")}></div>
              <TextField
                label="Dropped"
                type="number"
                value= {this.state.HatchDropped}
                margin="normal"
                variant="outlined"
              />
              <div class="triangle-down" onClick={this.DecrementElement("HatchDropped")}></div>
            </div>
            <Stopwatch/>
          </div>
        </form>
      </div>
    );
  }
}

export default MatchScoutTab;