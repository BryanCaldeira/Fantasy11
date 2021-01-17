import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../authentication/navbar";
import Background from "./images/background.jpg";
import Switch from "react-switch";
import axios from "axios";
import "./css/mymatches.css"

var matches_array, live_matches, upcoming_matches;

class myMatches extends Component {
  constructor() {
    super();

    this.state = {
      checked: false,
      load: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getMatchInfos = this.getMatchInfos.bind(this);
    let result = document.cookie.match(new RegExp('userData=([^;]+)'));
    if(result){
      let json_data = JSON.parse(result[1]);
      matches_array = json_data.data[4];
      console.log(matches_array);
      this.getMatchInfos(matches_array);
    }
  }

  componentDidMount() {
    document.body.style.background = `url(${Background})`;
    document.body.style.backgroundColor = "#000000";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover 100%";
  }

  componentWillUnmount() {
    document.body.style.background = "transparent";
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover 100%";
  }

  handleChange(checked) {
    this.setState({ checked });
    if(this.state.checked){
      document.getElementById('live-matches').style.display = 'block';
      document.getElementById('upcoming-matches').style.display = 'none';
    }
    else{
      document.getElementById('live-matches').style.display = 'none';
      document.getElementById('upcoming-matches').style.display = 'block';
    }
  }

  getMatchInfos(array) {
    live_matches = [];
    upcoming_matches = []
    axios
      .get(`https://fantasy11api.herokuapp.com//matches/`)
      .then((response) => {
        response.data['final_data'].forEach(match=>{
          for(let i=0; i<array.length; i++){
            if(Object.keys(array[i])[0] === match.uid){
              if(match.live && !live_matches.some(val=> val.uid === match.uid)){
                live_matches.push({"uid": match.uid, "title": match.title, "dateTime": match.dateTime});
              }
              else if(!upcoming_matches.some(val=> val.uid === match.uid)){
                upcoming_matches.push({"uid": match.uid, "title": match.title, "dateTime": match.dateTime});
              }
            }
          }
        });        
        this.setState({
          load: false,
        })
      })
      .catch((error) => {
        console.log(error);
    });
  }

  render() {
    if(this.state.load){
      return(
        <Navbar />
      );
    }
    return (
      <React.Fragment>
        <Navbar />
        <div id="matches-container" className="container">
          <div id="matches-row" className="row">
            <div id="switch-p">
              <span className="match-type-tag" style={{marginRight: "20px"}}> Live Now </span><Switch
              onChange={this.handleChange}
              checked={this.state.checked}
              offColor={"#454CFD"}
              onColor={"#F9A602"}
              checkedIcon={false}
              uncheckedIcon={false}
            />
            <span className="match-type-tag" style={{marginLeft: "20px"}}> Up Coming</span>
            </div>
            <div id="all-match-types">
              <div id="live-matches">
              { live_matches.map(match =>
                <div className="match-info">
                  <p className="match-info-title">{match.title}</p>
                  <p className="match-info-datetime">{match.dateTime}</p>
                </div>
              )}
              </div>
              <div id="upcoming-matches">
                { upcoming_matches.map(match =>
                  <Link to={{pathname: '/team' , state: { 'uid': match.uid }}}>
                    <div className="match-info">
                      <p className="match-info-title">{match.title}</p>
                      <p className="match-info-datetime">{match.dateTime}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default myMatches;
