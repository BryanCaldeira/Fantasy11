import React, { Component } from "react";
import axios from "axios";

import Navbar from "../authentication/navbar";
import "./css/dashboard.css"

import Background from './images/background.jpg'


class DashBoard extends Component {
  constructor(){
    super();
    this.state={
      titles: [],
      squad: [],
      load: false,
      showMatchDetails: false,
    }
    this.matchs = this.matchs.bind(this);
    this.matchTiming = this.matchTiming.bind(this);
  }

  matchs(){
    axios
      .get("https://cricapi.com/api/cricket?apikey=vZ8QkC2tRycUB13qronYltfQIY72")
      .then((response) => {
        console.log(response.data);
        
        response.data['data'].forEach(match=>{

        this.state.titles.push({"uid": match.unique_id, "title": match.title});
        })
        this.setState({
          load: true
        })   
      })
      .catch((error) => {
        console.log(error);
      });
  }

  matchTiming(uid){
    axios
      .get(`https://cricapi.com/api/fantasySummary?apikey=vZ8QkC2tRycUB13qronYltfQIY72&unique_id=${uid}`)
      .then((response) => {
        console.log(response.data)
        var matchDateTime = new Date(response.data.dateTimeGMT).toLocaleTimeString({},
            {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric', day: 'numeric', month: 'numeric', year: 'numeric'}
        );
        console.log(matchDateTime)

      })
      .catch((error) => {
        console.log(error);
      })
  }

  matchInfo(uid){
    this.setState({
      squad: [],
    })
    axios
      .get(`https://cricapi.com/api/fantasySquad?apikey=vZ8QkC2tRycUB13qronYltfQIY72&unique_id=${uid}`)
      .then((response) => {

        console.log("data: ",response.data)
        this.state.squad.push(response.data.squad[0], response.data.squad[1])
        this.setState({
          showMatchDetails: true,
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }


  componentDidMount(){
    document.body.style.background= `url(${Background})`;
    document.body.style.backgroundColor = "#000000";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    this.matchs();
  }



  render() {
    if(!this.state.load){
      return <Navbar />
    }
    return (
    <React.Fragment>
      <Navbar />
      {!this.state.showMatchDetails ? 
      (
        <div className="container" style={{marginTop: '100px', height:'80vh', overflow: 'hidden'}}>
          <div className="row matches" style={{overflow: 'scroll'}}>
            {this.state.titles.map((d)=>
              
              <div className="col-12 col-md-6 matches-outer">
                <div className="matches-inner">
                  <h5>{d.title}</h5>
                  <p>{d.dateTime}</p>
                  <button onClick={()=>{this.matchInfo(d.uid); this.matchTiming(d.uid)}} className="make-team-btn">Details</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) :
      (
        <div className="container" style={{marginTop: '100px', height:'80vh', overflow: 'hidden'}}>
          <div className="row players" style={{overflow: 'scroll'}}>

            <div className="col-12 col-md-6 playernames-col">
              <div className="playernames-col-inner">
                <h3 className="country-tag">{this.state.squad[0].name} LIST</h3>
                {this.state.squad[0].players.map((player, index)=>
                  <p className="player-name-tag">{index+1}&#41; {player.name}</p>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6 playernames-col">
              <div className="playernames-col-inner">
              <h3 className="country-tag">{this.state.squad[1].name} LIST</h3>
                {this.state.squad[1].players.map((player, index)=>
                  <p className="player-name-tag">{index+1}&#41; {player.name}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </React.Fragment>
  );
  
  }
}



export default DashBoard;