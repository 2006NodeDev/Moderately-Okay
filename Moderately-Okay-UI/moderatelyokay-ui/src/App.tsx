import React from 'react';
import './App.css';
import {NavBarComponent} from './components/NavBarComponent/NavBarComponent'
import {LoginComponent} from './components/LoginComponent/LoginComponent'
import {SignUpComponent} from './components/SignupComponent/SignupComponent'
import {ProfileComponent} from './components/ProfileComponent/ProfileComponent'
import {BrowserRouter as Router,Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <NavBarComponent /><br />
        <Route path = '/login' component ={LoginComponent}></Route>
        <Route path='/signup' render={()=>(<SignUpComponent/>)} />
        <Route path='/profile/:userId' component={ProfileComponent}></Route>
      </Router>
    </div>
  );
}

export default App;
