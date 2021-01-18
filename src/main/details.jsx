import React, {Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../authentication/navbar";
import Background from './images/background.jpg';
import './css/details.css';
import Loading from "./images/loading.gif";

var playerList = [];
var uid, result, secretKey, uname, email;

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squad: [],
      showMatchDetails: false,
    };
    this.matchInfo = this.matchInfo.bind(this);

    uid = props.location.state === undefined ? false : props.location.state['uid'];
    if (uid)
      this.matchInfo(uid);

    result = document.cookie.match(new RegExp('userData=([^;]+)'));
    if(result){
      let json_data = JSON.parse(result[1]);
      secretKey = json_data.data[0];
      uname = json_data.data[1];
      email = json_data.data[2]
    }
  }

  componentDidMount() {
    document.body.style.background = `url(${Background})`;
    document.body.style.backgroundColor = "#000000";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover 100%";
  }

  componentWillUnmount() {
    document.body.style.background = 'transparent';
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover 100%";
  }

  matchInfo(id) {
    this.setState({
      squad: [],
      showMatchDetails: false,
    });
    axios
      .get(`https://fantasy11api.herokuapp.com/squad/${id}/`)
      .then((response) => {
        console.log(response.data['final_data']);

        this.setState({
          squad: response.data['final_data'],
        });

        this.setState({
          showMatchDetails: true,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addPlayer(event) {
    let playerKey = event.target.value;
    let checkedBoolVal = event.target.checked;
    
    console.log(event.target.parentNode.style);
    if (playerList.includes(playerKey)) {
      let index = playerList.indexOf(playerKey);
      playerList.splice(index, 1);
      event.target.parentNode.style.color = "black";
    }

    if (checkedBoolVal){
      playerList.push(playerKey);
      event.target.parentNode.style.color = "#013BBE";
    }
  }

  makeTeam() {
    let errMess = document.getElementById('errmess');
    if (playerList.length === 11) {
      axios.get(`http://localhost:5000/maketeam/${btoa(secretKey)}/${btoa(uname)}/${btoa(email)}/${btoa(uid)}/${btoa(playerList.toString())}/`)
      axios.get(`https://fantasy11api.herokuapp.com/maketeam/${btoa(secretKey)}/${btoa(uname)}/${btoa(email)}/${btoa(uid)}/${btoa(playerList.toString())}/`)
        .then((response) => {
          if(response.data['check']){
            let date = new Date();
            date.setTime(date.getTime()+(15*60*1000))

            let result1 = document.cookie.match(new RegExp("userData=([^;]+)"));

            let result2 = document.cookie;
            let cookies = result2.split(";");
            
            if (result1) {
              let userData = JSON.parse(result1[1]);
              userData.data[4] = response.data["data"];

              for(let i = 0; i < cookies.length; i++) {
                var key = cookies[i].split("=");
                document.cookie = key[0]+"="+JSON.stringify(userData)+";"+date.toUTCString() +";";
              }
            }
          }
          setTimeout(()=>window.location.replace('/dashboard'), 2000);
          errMess.innerHTML = response.data['message'];
        }).catch(error =>{
        console.log(error);
      });
    } else {
      errMess = document.getElementById('errmess');
      errMess.innerHTML = `Select 11 players <br/>You have selected ${playerList.length} players.`;
      setTimeout(() => {
        errMess.innerHTML = '';
      }, 5000);
    }
  }

  render() {
    if(!this.state.showMatchDetails){
      return (
        <React.Fragment>
          <Navbar />
          <div id="loading-div">
            <img src={Loading} alt="loading..." id="loading-gif"/>
          </div>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <Navbar/>
        <div className="container" style={{marginTop: "100px", height: "80vh", overflow: "hidden"}}>
          <div className="row players" style={{overflow: "scroll"}}>
            <div className="col-12 col-md-6 playernames-col">
              <div className="playernames-col-inner">
                <h3 className="country-tag">{this.state.showMatchDetails ? this.state.squad[0].name : null} LIST</h3>
                {this.state.showMatchDetails ? this.state.squad[0]['players'].map((player, index) => (
                  <p className="player-name-tag">
                    <label htmlFor={'t1p' + index} className="player-name-tag">
                      <input className="player-checkboxes" type="checkbox" id={'t1p' + index} value={player.pid} onClick={this.addPlayer}/>
                      {index + 1}&#41; {player.name}
                    </label>
                  </p>
                )) : null}
              </div>
            </div>

            <div className="col-12 col-md-6 playernames-col">
              <div className="playernames-col-inner">
                <h3 className="country-tag">{this.state.showMatchDetails ? this.state.squad[1].name : null} LIST</h3>
                {this.state.showMatchDetails ? this.state.squad[1]['players'].map((player, index) => (
                  <p className="player-name-tag">
                    <label htmlFor={'t2p' + index} className="player-name-tag">
                      <input className="player-checkboxes" type="checkbox" id={'t2p' + index} value={player.pid} onClick={this.addPlayer}/>
                      <span className="player-name">{index + 1}&#41; {player.name}</span>
                    </label>
                  </p>
                )) : null}
              </div>
            </div>

            <div className="col-12 col-md-12 playernames-col">
              <div className="playernames-col-inner" style={{textAlign: "center", marginTop: "50px"}}>
                { result ? <button id="make-team-btn" className="btn btn-primary" onClick={this.makeTeam}>Make your team</button> 
                  : (<Link to="/login"><button id="make-team-btn" className="btn btn-primary">Login to make team</button></Link>)
                }
                <p id="errmess"></p>
              </div>
            </div>

          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Details;
