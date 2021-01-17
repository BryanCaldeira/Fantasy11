import React, { Component } from "react";
import Navbar from "../authentication/navbar";
import UserAvatar from "./images/user-avatar.png";
import axios from "axios";
import "./css/account.css";
import Background from "./images/accounts-background.png";

var userData;

class Account extends Component {
  constructor() {
    super();

    this.state = {
      deleteModal: false,
    };

    let result = document.cookie.match(new RegExp("userData=([^;]+)"));
    if (result) {
      userData = JSON.parse(result[1]);
    }
    this.openConf = this.openConf.bind(this);
    this.closeConf = this.closeConf.bind(this);
    this.delete = this.delete.bind(this);
  }

  openConf() {
    this.setState({
      deleteModal: true,
    });
  }

  closeConf() {
    this.setState({
      deleteModal: false,
    });
  }

  delete() {
    axios
      .get(
        `http://localhost:5000/del/${btoa(userData.data[0])}/${btoa(userData.data[1])}/${btoa(userData.data[2])}/`
      )
      .then((response) => {
        if (response.data["check"]) {
          var result = document.cookie;
          var cookies = result.split(";");
          for (let i = 0; i < cookies.length; i++) {
            var key = cookies[i].split("=");
            document.cookie =
              key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
          }

          window.location.replace("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <div id="user-avatar-div">
          <img id="user-avatar" src={UserAvatar} alt="user-avatar" />
          {this.state.deleteModal ? (
            <div id="delete-modal">
              <p id="close-tag" onClick={() => this.closeConf()}>
                X
              </p>
              <button
                onClick={() => this.delete()}
                id="conf-delete"
                className="btn btn-danger"
              >
                Confirm Delete
              </button>
            </div>
          ) : null}
          <p id="user-name">Username: {userData ? userData.data[1] : null}</p>
          <p id="user-email">Email: {userData ? userData.data[2] : null}</p>
          <button
            onClick={() => this.openConf()}
            id="delete-btn"
            class="btn btn-danger"
          >
            Delete Account
          </button>
          <img id="user-details-background" src={Background} alt="background" />
        </div>
      </React.Fragment>
    );
  }
}

export default Account;
