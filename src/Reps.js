import React, { Component } from 'react';
import './App.css';
import UnorderedList from './components/UnorderedList';


class Reps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location:'Denver,CO',
      reps: [],
    };
    this.findReps = this.findReps.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    
    if(this.state.location) {
      this.findReps();
    }
  }
  
  findReps() {
    const apiKey = 'AIzaSyCwm16-md7FqE5MvCztpNVEpRtj2TSc9eo';
    const city = this.state.location;

    fetch(`https://www.googleapis.com/civicinfo/v2/representatives?key=${apiKey}&address=${city}`)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      
      console.log(myJson);
      
      const officeArray = myJson.offices;
      const repArray = myJson.officials;
      
      const officialPositions = officeArray.map( position => position.name);
      const officialNames = repArray.map( name => name.name);
      
      const namesAndPositions = officialPositions.map((value, index) => {
        const theirNames = officialNames[index];
        return `${theirNames} - ${value}` ;
      })
      
      console.log(namesAndPositions);
      
      this.setState({reps : namesAndPositions });
            
    });
  }
  
  handleLocationChange(event) {
    this.setState({location: event.target.value});
  }
  
  render() {
    const locale = this.state.location;
    return (
      <div className="Reps">
        <p>I live in:</p><input type="text" value={locale} onChange={this.handleLocationChange} />
        <button onClick={this.findReps} >Click to Update</button>
        <UnorderedList items={this.state.reps} />
        <p></p>
      </div>
    );
  }
}

export default Reps;
