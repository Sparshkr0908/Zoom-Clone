import React, { useRef, useState,useEffect } from "react";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';

const server_url = "https://localhost:5501";

var connections = {};

const peerConfigConnection = {
    "iceServer" : [
        {"url" : "stun:stun.l.google.com:19302"}
    ]
}

export default function VideoMeeting() {

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();
    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(3);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([])
    let [videos, setVideos] = useState([])

   let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    return (
        <div>
            {askForUsername === true ? 
                <div>
                    <h2>Enter into Lobby </h2>
                    <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
                    <Button variant="contained" onClick={connect}>Connect</Button>
                    <div>
                        <video ref={localVideoref} autoPlay muted></video>
                    </div>
                </div> :
            }
                
        </div>
    );
}