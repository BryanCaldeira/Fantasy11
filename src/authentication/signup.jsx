/*
;==========================================
; Title:  signup component
; Author: Bryan Caldeira, Dinesh
; Date:   21 Dec 2020
;==========================================
*/

import React, {Component} from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: null,
      repassword: null,
      otpPin: "",
      otp: false,
      verified: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
    this.verifyUserDetails = this.verifyUserDetails.bind(this);
    this.insertUser = this.insertUser.bind(this);
  }

  // To update the state variable values 😎 
  handleChange({target}) {
    this.setState({
      [target.name]: target.value,
    });
    console.log("in handlechange");
  }

  // Display message and clear it in 5 sec 😎 
  clearMessage(value, color) {
    let message = document.getElementById("mess");
    message.innerHTML = value;
    message.style.color = color;
    setTimeout(() => {
      message.innerHTML = "";
    }, 5000);
  }

  // Check if username is available in database 😎 
  checkUname(event) {

    // Make API call only when username is above 7 characters 🤓 
    // Hit the API every 1 sec 😎 
    if(this.state.username.length > 7) {
      setTimeout(()=>{
        let unameMess = document.getElementById('uname-mess');
        let url = `http://127.0.0.1:5000/ck/${btoa(event.target.value)}/`;
        axios.get(url).then((response) => {
          unameMess.innerHTML = response.data['message'];

          if (response.data['check']) {
            unameMess.style.color = "#645AFC";
          } else {
            unameMess.style.color = "#F60000";
          }
        }).catch((error) => {
          console.log(error);
        });
      }, 1000);
    }
  }


  // Verify user details 😎 
  verifyUserDetails(event) {
    document.getElementById('uname-mess').innerHTML = '';
    document.getElementById('uname-mess').style.display = 'none';
    let signUpBtn = document.getElementById('sgn-btn');

    // Disable the sign-up button 🤓 
    signUpBtn.disabled = true;

    if (this.state.username.length > 7 && this.state.email.length > 2) {
      let url = `http://127.0.0.1:5000/vr/${btoa(this.state.username)}/${btoa(this.state.email)}/`;
      
      // Make a API call 😎 
      axios
        .get(url)
        .then((response) => {

          // Check weather the user details where verified 🤓 
          this.setState({
            otp: response.data["check"],
          });

          if (response.data["check"]) {
            // Maker username and email field readonly
            document.getElementById('uname').readOnly = true;
            document.getElementById('email').readOnly = true;
            this.clearMessage(response.data['message'], "#645AFC");
            signUpBtn.innerHTML = "Submit";
          } 
          else {
            document.getElementById('signup-form').reset();
            this.clearMessage(response.data['message'], "#F60000");
          }

          // Enabling the button which was disable before
          signUpBtn.disabled = false;

        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.clearMessage(this.state.username.length > 7 ? "Invaild email id" : "Invalid username", "#F60000");
    }

    // Prevent form from reloading the page 🧐 
    event.preventDefault();
  }


  // Verify the OTP 😎 
  verifyOtp(event) {
    let url = `http://127.0.0.1:5000/vr/otp/${btoa(this.state.email)}/${btoa(this.state.otpPin)}/`;
    
    axios.get(url).then((response) => {
      // Check weather user OTP was correct and store it in verified 🤓 
      this.setState({
        verified: response.data['check'],
      });

      // Display Appropriate Message 😉 
      this.clearMessage(response.data['message'], response.data['check'] ? "#645AFC" : "#F60000");
    }).catch((error) => {
      // Some error occured 😣 
      console.log(error);
    });

    // Prevent form from reloading the page 🧐 
    event.preventDefault();
  }


  // Insert User details 😎 
  insertUser(event){
    
    // Check if password fields match 🧐
    if(this.state.password === this.state.repassword){
      let url = `http://127.0.0.1:5000/in/${btoa(this.state.username)}/${btoa(this.state.email)}/${btoa('bryan')}/${btoa(this.state.password)}/`;
      
      axios.get(url).then((response)=>{
        // Check User account was created 🤓 
        this.clearMessage(response.data['message'], response.data['check'] ? "#645AFC" : "#F60000");
        
        // After 3sec change the url to /login if Account Created 🙂 
        if(response.data['check']){
          setTimeout(()=>{
            window.location.replace('/login');
          }, 3000);
        }

        // Else reload the same page 😔  
        else{
          setTimeout(()=>{
            window.location.reload();
          }, 3000);
        }

        document.getElementById('signup-form').reset();
      }).catch((error) => {
        // Some error occured 😣 
        console.log(error);
      });
    }
    else{
      this.clearMessage("Password don't match", "#F60000");
    }

    // Prevent form from reloading the page 🧐 
    event.preventDefault()
  }

  render() {
    return (
      <div id="form-col" className="col-lg-6">
        <div id="form-div">
          <h2 style={{marginBottom: '30px', cursor: 'default'}}>SignUp</h2>
          <form id="signup-form" onSubmit={this.state.otp ? this.state.verified ? this.insertUser : this.verifyOtp : this.verifyUserDetails}>
            <input onChange={(event)=>{this.handleChange(event); this.checkUname(event)}} name="username" id="uname" type="text" className="inp form-control"
                   placeholder="Enter username" required/>
            <p id="uname-mess"></p>
            <input onChange={this.handleChange} name="email" id="email" type="email" className="inp form-control"
                   placeholder="Enter email-id..." required/>
            
            {/* Display this only when otp is 'true' and verified 'false' 😎 */}
            {this.state.otp && ! this.state.verified ?
              <input onChange={this.handleChange} name="otpPin" id="otp-pin" type="number" className="inp form-control"
                     placeholder="Enter otp..." required/> : null}
            
            {/* Display this when verified is 'true' 😎 */}
            {this.state.verified ?
              <input onChange={this.handleChange} name="password" id="pass" type="password" className="inp form-control"
                     placeholder="Enter password..." pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,20}$" title="Password must contain a Uppercase Letter a Lowercase Letter a Number and a Special charcater [@#$%^&+=]" required/> : null}
            
            {/* Display this when verified is 'true' 😎 */}
            {this.state.verified ?
              <input onChange={this.handleChange} name="repassword" id="repass" type="password" className="inp form-control"
                     placeholder="Confirm password..." pattern="^[a-zA-Z0-9]+[\._]?[a-zA-Z0-9]+[@]\w+[.]\w{2,3}$" required/> : null}
            <button type="submit" id="sgn-btn">Verify</button>
            {/* The error messages */}
            <p id="mess"></p>
            <p id="lgn-tag">Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;