import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      generalUserInput: "",
      adminUserInput: "",
      isAdmin: false,
      generalMessages: [],
      adminMessages: []
    };
  }
  componentDidMount() {
    this.socket = io();
    this.socket.on("general-message", data => {
      console.log('got general mesage');
      let gm = this.state.generalMessages.slice();
      gm.push(data);
      this.setState({ generalMessages: gm });
    });
    this.socket.on("admin-message", data => {
      console.log('got admin message')
      let am = this.state.adminMessages.slice();
      am.push(data);
      this.setState({ adminMessages: am });
    })
  }
  sendMessage = () => {
    this.socket.emit("to-server", { message: "hello world" });
  };
  submitMessage = (message, roomName) => {
    this.socket.emit(`${roomName}-chat`, message);
  };
  handleKeyUp = e => {
    if (e.key === "Enter") {
      this.submitMessage(this.state[e.target.name+'UserInput'], e.target.name);
      this.setState({ [e.target.name+'UserInput']: "" });
    }
  };
  joinAdmin = () => {
    this.socket.emit("join-admin");
    this.setState({ isAdmin: true });
  };
  render() {
    return (
      <div className="app--component">
        <nav>socket chat app</nav>
        <section className="chat-container">
          <div className="general chat">
            <div className="messages-container">
              <h4> general chat </h4>
              {
                this.state.generalMessages.map((gm,i)=>{
                  return (<p key={i}>{gm}</p>)
                })
              }
            </div>
            <div className="user-input-container">
              <input
                type="text"
                value={this.state.generalUserInput}
                onChange={e => this.setState({ generalUserInput: e.target.value })}
                name="general"
                onKeyUp={this.handleKeyUp}
              />
            </div>
          </div>
          {this.state.isAdmin ? 
          <div className="admin chat">
            <div className="messages-container">
              <h4> admin chat </h4>
              {
                this.state.adminMessages.map((am,i)=>{
                  return (<p key={i}>{am}</p>)
                })
              }
            </div>
            <div className="user-input-container">
              <input
                type="text"
                value={this.state.adminUserInput}
                onChange={e => this.setState({ adminUserInput: e.target.value })}
                name="admin"
                onKeyUp={this.handleKeyUp}
              />
            </div>
          </div>
          :
          <div className="notAdmin">
            <button onClick={this.joinAdmin}> join admin chat </button>
          </div>
          }
        </section>
      </div>
    );
  }
}

export default App;
