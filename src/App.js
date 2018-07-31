import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Reps from './Reps';


class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to pushing the line</h2>
        </div>
        <Reps/>
      </div>
    );
  }
}

export default App;
