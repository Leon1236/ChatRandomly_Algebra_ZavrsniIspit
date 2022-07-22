import React, { Component } from "react";
import "./App.css";
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
  const adjectives = [
    "black",
    "silver",
    "gray",
    "white",
    "maroon",
    "red",
    "purple",
    "fuchsia",
    "green",
    "lime",
    "olive",
    "yellow",
    "navy",
    "blue",
    "teal",
    "aqua",
  ];
  const nouns = [
    "apple",
    "apricot",
    "avodado",
    "banana",
    "blackberrie",
    "blackcurrant",
    "blueberrie",
    "breadfruit",
    "cantaloupe",
    "charry",
    "cranberrie",
    "guava",
    "kivi",
    "mellon",
    "mango",
    "range",
    "papaya",
    "pineapple",

  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function randomColor() {//mjenja boju # + string brojeva
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

function randomNumber(){
  return "" + Math.floor(Math.random() * 16).toString(5);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName() + randomNumber(),
      color: randomColor(),
    },
  };

  constructor() {
    super();
    this.drone = new window.Scaledrone("6rHPtkW5Rfl1SPVz", {
      data: this.state.member,
    });
    
    this.drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });

    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = this.state.messages;
      messages.push({ member, text: data });
      this.setState({ messages });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Chat Randomly</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };
}

export default App;
