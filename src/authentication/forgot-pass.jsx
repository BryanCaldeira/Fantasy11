/*
;==========================================
; Title:  forgot password component
; Author: Bryan Caldeira
; Date:   21 Dec 2020
;==========================================
*/

import React, { Component } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

class ForgotPassword extends Component {
    constructor(){
      super();
      this.state = {
        email: null,
        message: null,
      };
      this.handleChange = this.handleChange.bind(this);
      this.forgotPass = this.forgotPass.bind(this);
    }

    handleChange({ target }){
      this.setState({
        [target.name]: target.value,
      });
    }

    forgotPass(event){
      let url = `http://127.0.0.1:5000/fp/otp/${btoa(this.state.email)}/`;
      console.log(this.state.email);
      axios.get(url)
      .then((response)=> {
        this.setState({
          message: response.data["message"],
        });
        if(!response.data["check"]){
          document.getElementById("mess").style.color = "#F60000";
          }
        setTimeout(()=>{
          document.getElementById("mess").innerHTML = "";
        }, 5000);
        document.getElementById("forgotpass-form").reset();
      })
      .catch((error)=> {
        console.log(error);
      });
      event.preventDefault();
    }


    render() { 
        return ( 
        <div id="form-col" className="col-lg-6">
            <div id="form-div">
            <h2 style={{marginBottom: '30px', cursor: 'default'}}>Forgot Password</h2>
            <form id="forgotpass-form" onSubmit={this.forgotPass}>
              <input name="email" onChange={this.handleChange} id="email" type="email" className="inp form-control" placeholder="Enter email-id..." required /><br/>
              <button type="submit" id="lgn-btn">Submit</button>
              <p id="mess">{this.state.message}</p>

              <p id="lgn-tag">Back to login <Link to="/login">Click Here</Link></p>
            </form>
            </div>
        </div>
        );
    }
}
 
export default ForgotPassword;