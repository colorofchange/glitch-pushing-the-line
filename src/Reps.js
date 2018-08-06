import React, { Component } from 'react';
import './App.css';
import UnorderedList from './components/UnorderedList';
require('dotenv').config({path: '.env'})



class Reps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location:'1600 Pennsylvania Ave. , NW. Washington, DC 20500',
      state: 'DC',
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
    // Create a API Key for the Google Civic API. https://developers.google.com/civic-information/
    const googleCivicApiKey = process.env.REACT_APP_GOOGLE_CIVIC_API;
    // Create a API Key for Open States API http://docs.openstates.org/en/latest/api/
    const openStatesApiKey = process.env.REACT_APP_OPENSTATES_API;
    // Create an API Key for geocode.xyz for geocoding addresses to latitude and longitute http://docs.openstates.org/en/latest/api/
    const geocodeApiKey = process.env.REACT_APP_GEOCODE_API;

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
      fetch(`https://geocode.xyz/${location}?&geoit=json&auth=${geocodeApiKey}`)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        console.log(myJson);
        const lat = myJson.latt;
        const lon = myJson.longt;

        // Use the latitude and longitude points to find user local legislators with Open States API
        fetch(`https://openstates.org/api/v1/legislators/geo/?lat=${lat}&long=${lon}&apikey=${openStatesApiKey}`)
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
          fetch(`https://openstates.org/api/v1/bills/?state=${state}&page=1&per_page=100&q=${billFilter}&apikey=${openStatesApiKey}`)
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
    if (this.state.loading === true) {
      return (
        <div className="Reps">
          <div className="search-container">
            <p>My address is:</p><input type="text" value={locale} onChange={this.handleLocationChange} />
            <p>Filter bills by:</p>
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
            Discrimination</label><br/><br/>
            <button onClick={this.findReps} >Click to Update</button>
          </div>
          <p>Loading…</p>
        </div>
      );
    }
    return (
      <div className="Reps">
        <div className="search-container">
          <p>My address is:</p><input type="text" value={locale} onChange={this.handleLocationChange} />
          <p>Filter bills by:</p>
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
          Discrimination</label><br/><br/>
          <button onClick={this.findReps} >Click to Update</button>
        </div>
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
