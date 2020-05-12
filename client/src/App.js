import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

import "./App.scss";

import * as util from "./lib/util";
import Header    from "./Header";
import SvgCanvas from "./SvgCanvas";



const socket = io("http://localhost:3001");

// socket.on("connect", function() {
//   console.log("socket.connect");
// });

// socket.on("disconnect", function() {
//   console.log("socket.disconnect");
// });

socket.on("server_message", (message) => {
  console.log("socket.server_message:", message);
});



const DEFAULT_SESSION = { cards: {} };



function App(_props) {

  // session = {
  //   id: <sessionId>,
  //   name: "<name>",
  //   cards: {
  //     <cardId>: {
  //     x: 0,
  //     y: 0,
  //     fields: {
  //       ...
  //     }
  //   }
  // }

  const [ session, setSession ] = useState(DEFAULT_SESSION);

  const setCard = useCallback((id, card) => {
    setSession((prevState) => {
      if (card) {
        prevState.cards[id] = {
          ...prevState.cards[id],
          ...card
        };
      } else {
        delete prevState.cards[id];
      }
      return { ...prevState };
    });
  }, [ setSession ]);

  const setCardNotify = (id, card) => {
    setCard(id, card);
    socket.emit("update_card", id, card);
  };



  // Temporary testing functions

  const addRandomCard = () => {
    const title   = document.querySelector(".App-sidebar input[name='card-title']").value;
    const content = document.querySelector(".App-sidebar textarea").value;
    setCardNotify(util.uuidv4_compact(), {
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
      fields: {
        title:   title,
        content: content
      }
    });
  };

  const updateChickens = () => {
    setCardNotify("chickens", { x: 10, y: 10 });
  };



  const joinSession = (sessionId) => {
    socket.emit("join_session", sessionId, (status, session) => {
      console.log("socket.join_session:", status, session)
      setSession(session);
    });
  };

  const newSession = () => {
    const title = document.querySelector(".App-sidebar input[name='card-title']").value;
    socket.emit("new_session", title, (status, sessionId) => {
      console.log("socket.new_session:", status, sessionId)
      if (status === "session_created") {
        joinSession(sessionId);
      }
    });
  };



  // Set up stuff on page load:
  useEffect(() => {

    joinSession("default");

    socket.on("update_card", (id, card) => setCard(id, card));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className="App">

      <Header sessionName={session.name} />

      <main>

        <div className="App-sidebar">
          {/* <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset pan</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset zoom</p> */}
          <hr/>
          <p style={{cursor: "pointer"}} onClick={(_event) => console.log(session)}>Dump session to console</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => newSession()}>New session</p>
          {/* <p style={{cursor: "pointer"}} onClick={(_event) => joinSession()}>Join session</p> */}
          <hr/>
          <div>
            <label>Title</label><br/><input name={"card-title"} /><br/>
            <label>Content</label><br/><textarea name={"card-content"} /><br/>
            <button onClick={addRandomCard}>Add card</button>
          </div>
          <p style={{cursor: "pointer"}} onClick={(_event) => updateChickens()}>Move chickens</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => setCardNotify("kitckens")}>Remove kitckens</p>
          {/* <svg>
            <Card x={0} y={0} w={125} h={100} />
          </svg> */}
        </div>

        <div className="main-container">
          <div className="left size-cue">EASY</div>
          <div className="right size-cue">HARD</div>
          <SvgCanvas
            viewBoxSize={300}
            className={"whiteboard"}
            cards={session.cards}
            setCardNotify={setCardNotify}
          />
        </div>

      </main>

    </div>
  );
}

export default App;
