import './App.css';
import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { SpeakerPhone, Send, Close } from '@material-ui/icons';
import firebase from 'firebase';
import _ from 'lodash'

const firebaseConfig =  {
  apiKey: "AIzaSyBngdpMTvxBFukBiG9lILk_HcAcdctzc4c",
  authDomain: "chat-box-8155e.firebaseapp.com",
  databaseURL: "https://chat-box-8155e.firebaseio.com",
  projectId: "chat-box-8155e",
  storageBucket: "chat-box-8155e.appspot.com",
  messagingSenderId: "946379418018",
  appId: "1:946379418018:web:c5da67333622282235aafb",
  measurementId: "G-7XXN7VZ7DT"
}
const avatarSelf = "https://www.flaticon.com/svg/static/icons/svg/147/147144.svg"
const avatarBot = "https://www.flaticon.com/svg/static/icons/svg/168/168734.svg"

function App() {
  const [chat, setChat] = useState(false);
  const [messageAll, setMessageAll] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    firebase.initializeApp(firebaseConfig)
    firebase.analytics()
    firebase.database().ref().set(null)
    getChatData()
  }, []);

  const onSubmit = (data, e) => {
    let dataPushSelf = {
      text: data.chatText,
      type: 'self'
    }
    let dataPushBot = {
      text: data.chatText,
      type: 'bot'
    }
    firebase.database().ref('chatRoom').push(dataPushSelf)
    setTimeout(() => {
      firebase.database().ref('chatRoom').push(dataPushBot)
    }, 1000)
    e.target.reset()
  }

  const getChatData = () => {
    let getChat = firebase.database().ref('chatRoom');
    getChat.on('value', (snapshot) => {
      if (!_.isNull(snapshot.val())) {
        setMessageAll(snapshot.val())
      }
    })
  }

  const renderMessage = () => {
    return _.map(messageAll, (value, key) => {
      return value.type === "self" ?
          <div key={ key } id={ key } className="chat-msg self">         
            <span className="msg-avatar">            
            <img src={ avatarSelf } />          
            </span>          
            <div className="cm-msg-text">
              { value.text }          
            </div>        
          </div>
        : value.type === "bot" ?
          <div key={ key } id={ key } className="chat-msg user">          
            <span className="msg-avatar">            
              <img src={ avatarBot } />          
            </span>          
            <div className="cm-msg-text">
              { value.text }                  
            </div>        
          </div>
        : null
    })
  }

  return (
    <div id="App">
      <div id="center-text">
          <h2>ChatBox UI</h2>
          <p>Message send and scroll to bottom enabled </p>
      </div> 
      <div id="body"> 
          { !chat ?
          <div id="chat-circle" className="btn btn-raised" onClick={ () => setChat(true) }>
                <div id="chat-overlay"></div>
                <SpeakerPhone />
          </div>
          :
          <div className="chat-box">
            <div className="chat-box-header">
              ChatBot
              <span className="chat-box-toggle" onClick={ () => setChat(false) }><Close /></span>
            </div>

            <div className="chat-box-body">
              <div className="chat-box-overlay">   
              </div>
              <div className="chat-logs">
                {
                  Object.keys(messageAll).length > 0 ?
                    renderMessage()
                  :
                    null
                }
              </div>
            </div>

            <div className="chat-input">      
              <form onSubmit={ handleSubmit(onSubmit) }>
                <input type="text" id="chat-input" name="chatText" placeholder="Send a message..." ref={ register({ required: false })} />
                <button type="submit" className="chat-submit" id="chat-submit">
                  <Send />
                </button>
              </form>      
            </div>
            
          </div>
          }
        </div>
    </div>
  );
}

export default App;
