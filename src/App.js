import React, { Component } from 'react';
import './App.css';
import Reps from './Reps';

class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="App">
        <div className="remix-button">
          <a href="https://glitch.com/edit/#!/remix/remix4change" target="_blank">
            <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="remix" height="25" />
          </a>
        </div>
        <div className="App-header">
          <img className="logo" src="COC-Full-Color_320px.png" />
          <h2>Welcome to #Remix4Change</h2>
        </div>
        <Reps/>
        <div>
          <a className="get-registered" href="https://coc.turbovote.org/?r=glitch" target="_blank">Register to Vote!</a>
        </div>
      </div>
    );
  }
}

export default App;
