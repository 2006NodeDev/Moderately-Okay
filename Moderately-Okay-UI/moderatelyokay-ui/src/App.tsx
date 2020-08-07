import React, { useState } from 'react';
import './App.css';
import {NavBarComponent} from './components/NavBarComponent/NavBarComponent'
import {LoginComponent} from './components/LoginComponent/LoginComponent'
import {SignUpComponent} from './components/SignupComponent/SignupComponent'
import {ProfileComponent} from './components/ProfileComponent/ProfileComponent'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import { AddNewBookingComponent } from './components/AddNewBookingComponent/AddNewBookingComponent';
import { User } from './models/User';
import { UpdateUserComponent } from './components/UpdateUserComponent/UpdateUserComponent';

//add new booking is there for testing, it does not have to stay there or even keep the same path.
function App() {
  const [currentUser, changeCurrentUser] = useState<null | User>(null)
  return (
    <div className="App">
      <Router>
      <NavBarComponent user={currentUser}/>
        <Route path='/login' render={(props)=>(<LoginComponent changeCurrentUser={changeCurrentUser} {...props} />)} />
        <Route path='/signup' render={()=>(<SignUpComponent/>)} />
        <Route path='/profile/:userId' component={ProfileComponent}/>
        <Route path='/addnewbooking' component={AddNewBookingComponent}/>
        <Route path="/editUser"><UpdateUserComponent/></Route>
      </Router>
    </div>
  );
}

export default App;
