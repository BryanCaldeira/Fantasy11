/*
;==========================================
; Title:  login component
; Author: Bryan Caldeira
; Date:   21 Dec 2020
;==========================================
*/

import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link, useHistory } from "react-router-dom";
import axios from "axios";
import "../fonts.css";
import "./css/login-signup-forgotpass.css"

import SignUp from "./signup";
import Navbar from "./navbar";
import ForgotPass from "./forgot-pass";
import background from "./images/back1.png";

var emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var url;

function Redirect(){
  const history = useHistory();
  history.push("/dashboard");
}

class Login extends Component {

  constructor() {
    super();
    this.state = {
      usernameEmail: "",
      password: "",
      message: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  clearMessage(value, color) {
    let message = document.getElementById("mess");
    message.innerHTML = value;
    message.style.color = color;
    setTimeout(() => {
      message.innerHTML = "";
    }, 5000);
  }

  handleChange({target}) {
    this.setState({
      [target.name]: target.value,
    });
  }

  getUser(event) {
    if (this.state.usernameEmail.length > 2 && this.state.password.length > 7) {
      if (this.state.usernameEmail.match(emailPattern)) {
        url = `http://127.0.0.1:5000/exe/${btoa(this.state.usernameEmail)}/${btoa(this.state.password)}/`;
      } else {
        url = `http://127.0.0.1:5000/exu/${btoa(this.state.usernameEmail)}/${btoa(this.state.password)}/`;
      }

      axios
        .get(url)
        .then((response) => {
          this.clearMessage(response.data['message'], response.data['check']  ? "#645AFC" : "#F60000");
          document.getElementById("login-form").reset();

          if(response.data['check']){
            window.location.replace('/dashboard');
          }
          
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else{
      this.clearMessage(this.state.usernameEmail.length > 2   ? "Invaild password" : "Invalid username or email-id", "#F60000");
    }
    event.preventDefault();
  }



  render() {
    return (
      <React.Fragment>
        <Navbar/>
        <BrowserRouter>
          <div className="container">
            <div className="row">
              <Route exact path="/login">
                <div id="form-col" className="col-lg-6">
                  <div id="form-div">
                    <h2 style={{marginBottom: '30px', cursor: 'default'}}>Login</h2>
                    <form id="login-form" onSubmit={this.getUser}>
                      <input name="usernameEmail" onChange={this.handleChange} id="uname-email" type="text"
                             className="inp form-control" placeholder="Enter username or email-id..." required/>
                      <input name="password" onChange={this.handleChange} id="pass" type="password"
                             className="inp form-control" placeholder="Enter password..." required/><br/>
                      <button type="submit" id="lgn-btn">Submit</button>
                      <p id="mess"></p>
                      <p id="lgn-tag">Don't have an account? <Link to="/signup">SignUp</Link></p>
                      <p id="fgt-tag">Forgot Password <Link to="/forgotpass">Click Here</Link></p>
                      <p id="or-tag"><span>or</span></p>
                      <hr/>
                    </form>
                    <button id="oauth-btn"><img
                      src="https://img.icons8.com/fluent/96/000000/google-logo.png" alt=""/> Login/Signup with Google
                    </button>
                  </div>
                </div>
              </Route>

              <Switch>
                <Route exact path="/signup">
                  <SignUp/>
                </Route>
                <Route exact path="/forgotpass">
                  <ForgotPass/>
                </Route>
              </Switch>

              <div id="bg" className="col-lg-6">
                <img id="bg-img" src={background} alt="background"/>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}


export default Login;