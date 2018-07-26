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
      billFilter: ''
    };
    this.findReps = this.findReps.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    
    if(this.state.location) {
      this.findReps();
    }
  }
  
  findReps() {
    const openStatesApiKey = '704034e8-3809-4a4a-91f0-452a9f4d2fdb';
    const apiKey = 'AIzaSyCwm16-md7FqE5MvCztpNVEpRtj2TSc9eo';
    const city = this.state.location;
    const billFilter = this.state.billFilter;

    fetch(`https://www.googleapis.com/civicinfo/v2/representatives?key=${apiKey}&address=${city}`)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      
      // console.log(myJson);
      const state = myJson.normalizedInput.state;
      const officeArray = myJson.offices;
      const repArray = myJson.officials;
      
      const officialPositions = officeArray.map( position => position.name);
      const officialNames = repArray.map( name => name.name);
      
      const namesAndPositions = officialPositions.map((value, index) => {
        const theirNames = officialNames[index];
        return `${theirNames} - ${value}` ;
      })
      
      // console.log(namesAndPositions);
      
      this.setState({reps : namesAndPositions });
      this.setState({state: myJson.normalizedInput.state})
      // console.log(openStatesApiKey);

      const googleApiKey = 'AIzaSyCbhulKKL_yvx4MMHVLgKFgJgzkfk4ryfc';

      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleApiKey}`)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        const lat = myJson.results[0].geometry.location.lat;
        const lon = myJson.results[0].geometry.location.lng;

        fetch(`https://openstates.org/api/v1/legislators/geo/?lat=${lat}&long=${lon}`, {
          headers: {'X-API-KEY': openStatesApiKey}
        })
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          // console.log(myJson);

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
          
          // console.log(localReps);
          
          this.setState({localReps : localReps });

          fetch(`https://openstates.org/api/v1/bills/?state=${state}&page=1&per_page=100&q=${billFilter}`, {
            headers: {'X-API-KEY': openStatesApiKey}
          })
          .then(response => {
            return response.json();
          })
          .then(myJson => {
            const bills = myJson.map((value, index) => {
              const billId = value.bill_id;
              const billTitle = value.title;
              const billChamber = value.chamber;
              const billCreated = value.created_at;
              return `Bill ID: ${billId}, Bill Title: ${billTitle}, Bill Chamber: ${billChamber}, Bill Created: ${billCreated}` ;
            })
            
            // console.log(bills);
            
            this.setState({stateBills : bills });
          });
        });
      })


    });
  }
  
  handleLocationChange(event) {
    this.setState({location: event.target.value});
  }
  
  render() {
    const locale = this.state.location;
    const billFilter = this.state.billFilter;
    return (
      <div className="Reps">
        <p>I live in:</p><input type="text" value={locale} onChange={this.handleLocationChange} />
        <button onClick={this.findReps} >Click to Update</button>
        <p>Filter bills by:</p>
        <div>
            <input type="radio" id="bail" name="billFilter" />
            <label for="bail">Bail</label>
        </div>

        <div>
            <input type="radio" id="police" name="billFilter" />
            <label for="police">Police</label>
        </div>

        <div>
            <input type="radio" id="prison" name="billFilter" />
            <label for="prison">Prison</label>
        </div>
        <UnorderedList items={this.state.reps} />
        <p></p>
        <h1>Your local representatives</h1>
        <UnorderedList items={this.state.localReps} />
        <p></p>
        <h1>Latest 100 State Bills for {this.state.state}</h1>
        <UnorderedList items={this.state.stateBills} />
        <p></p>
      </div>
    );
  }
}

export default Reps;
