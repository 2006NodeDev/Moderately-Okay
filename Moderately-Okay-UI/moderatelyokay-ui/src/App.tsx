import React from 'react';
import './App.css';
import {NavBarComponent} from './components/NavBarComponent/NavBarComponent'
import {LoginComponent} from './components/LoginComponent/LoginComponent'
//import {SignUpComponent} from './components/SignupComponent/SignupComponent'
import {BrowserRouter as Router,Route} from 'react-router-dom'
function App() {
  return (
    <div className="App">
      <Router>
        <NavBarComponent /><br />
        <Route path = '/login' component ={LoginComponent}></Route>
      </Router>
    </div>
  );
}

export default App;
