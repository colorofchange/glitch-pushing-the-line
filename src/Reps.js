import React, { Component } from 'react';
import './App.css';
import UnorderedList from './components/UnorderedList';


class Reps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location:'Denver,CO',
      state: 'CO',
      reps: [],
      stateBills: [],
      localReps: [],
      billFilter: 'Bail',
      billText: 'Bail',
      loading: true
    };
    this.findReps = this.findReps.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.getInitialBillState = this.getInitialBillState.bind(this);
    
    if(this.state.location) {
      this.findReps();
    }
  }
  
  findReps() {
    // Set loading state to true.
    this.setState({loading : true });
    // All API keys
    const googleCivicApiKey = 'AIzaSyCwm16-md7FqE5MvCztpNVEpRtj2TSc9eo';
    const openStatesApiKey = '704034e8-3809-4a4a-91f0-452a9f4d2fdb';
    const googleGeocodeApiKey = 'AIzaSyCbhulKKL_yvx4MMHVLgKFgJgzkfk4ryfc';

    const location = this.state.location;
    const billFilter = this.state.billFilter;

    // Fetch representatives from Google Civic API based on user location
    fetch(`https://www.googleapis.com/civicinfo/v2/representatives?key=${googleCivicApiKey}&address=${location}`)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      const state = myJson.normalizedInput.state;
      const officeArray = myJson.offices;
      const repArray = myJson.officials;
      
      const officialPositions = officeArray.map( position => position.name);
      const officialNames = repArray.map( name => name.name);
      
      // Store user representative data in state
      const namesAndPositions = officialPositions.map((value, index) => {
        const theirNames = officialNames[index];
        return `${theirNames} - ${value}` ;
      })
            
      this.setState({reps : namesAndPositions });
      this.setState({state: myJson.normalizedInput.state})

      // Use Googles geocoding API to convert user location to latitude and longitute points
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleGeocodeApiKey}`)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        const lat = myJson.results[0].geometry.location.lat;
        const lon = myJson.results[0].geometry.location.lng;

        // Use the latitude and longitude points to find user local legislators with Open States API
        fetch(`https://openstates.org/api/v1/legislators/geo/?lat=${lat}&long=${lon}`, {
          headers: {'X-API-KEY': openStatesApiKey}
        })
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          // Store user local legislators in state
          const localReps = myJson.map((value, index) => {
            const fullName = value.full_name;
            const id = value.id;
            const district = value.district;
            const chamber = value.chamber;
            const phone = value['+phone'];
            const email = value.email;
            const party = value.party;
            const url = value.url;
            return `Name: ${fullName}, ID: ${id}, District: ${district}, Chamber: ${chamber}, Phone: ${phone}, Email: ${email}, Party: ${party}, URL: ${url}`;
          })
          this.setState({localReps : localReps });

          // Fetch state bill infomration for users state and selected bill query from Open States API
          fetch(`https://openstates.org/api/v1/bills/?state=${state}&page=1&per_page=100&q=${billFilter}`, {
            headers: {'X-API-KEY': openStatesApiKey}
          })
          .then(response => {
            return response.json();
          })
          .then(myJson => {
            // Store the latest bills in a state
            const bills = myJson.map((value, index) => {
              const billId = value.bill_id;
              const billTitle = value.title;
              const billChamber = value.chamber;
              const billCreated = value.created_at;
              return `Bill ID: ${billId}, Bill Title: ${billTitle}, Bill Chamber: ${billChamber}, Bill Created: ${billCreated}` ;
            })
            this.setState({billText : this.state.billFilter })
            this.setState({stateBills : bills });
            // Set loading state to false
            this.setState({loading : false });
          });
        });
      })


    });
  }
  
  handleLocationChange(event) {
    this.setState({location: event.target.value});
  }

  getInitialBillState(event) {
    this.setState({billFilter: event.target.value})
  }
  
  render() {
    const locale = this.state.location;
    const billFilter = this.state.billFilter;
    if (this.state.loading == true) {
      return (
        <div className="Reps">
          <p>I live in:</p><input type="text" value={locale} onChange={this.handleLocationChange} />
          <p>Filter bills by:</p>
          <div>
              <label><input type="radio" id="bail" name="billFilter" value="Bail" 
              checked={this.state.billFilter==='Bail'} 
              onChange={this.getInitialBillState} />
              Bail</label>
              <label><input type="radio" id="police" name="billFilter" value="Police" 
              checked={this.state.billFilter==='Police'} 
              onChange={this.getInitialBillState} />
              Police</label>
              <label><input type="radio" id="prison" name="billFilter" value="Prison" 
              checked={this.state.billFilter==='Prison'} 
              onChange={this.getInitialBillState} />
              Prison</label>
              <label><input type="radio" id="discrimination" name="billFilter" value="Discrimination" 
              checked={this.state.billFilter==='Discrimination'} 
              onChange={this.getInitialBillState} />
              Discrimination</label>
          </div>
          <p>Loading…</p>
        </div>
      );
    }
    return (
      <div className="Reps">
        <p>I live in:</p><input type="text" value={locale} onChange={this.handleLocationChange} />
        <p>Filter bills by:</p>
        <div>
            <label><input type="radio" id="bail" name="billFilter" value="Bail" 
            checked={this.state.billFilter==='Bail'} 
            onChange={this.getInitialBillState} />
            Bail</label>
            <label><input type="radio" id="police" name="billFilter" value="Police" 
            checked={this.state.billFilter==='Police'} 
            onChange={this.getInitialBillState} />
            Police</label>
            <label><input type="radio" id="prison" name="billFilter" value="Prison" 
            checked={this.state.billFilter==='Prison'} 
            onChange={this.getInitialBillState} />
            Prison</label>
            <label><input type="radio" id="discrimination" name="billFilter" value="Discrimination" 
            checked={this.state.billFilter==='Discrimination'} 
            onChange={this.getInitialBillState} />
            Discrimination</label>
        </div>
        <button onClick={this.findReps} >Click to Update</button>
        <UnorderedList items={this.state.reps} />
        <p></p>
        <h1>Your local representatives</h1>
        <UnorderedList items={this.state.localReps} />
        <p></p>
        <h1>Latest {this.state.billText}-Related State Bills for {this.state.state}</h1>
        <UnorderedList items={this.state.stateBills} />
        <p></p>
      </div>
    );
  }
}

export default Reps;
