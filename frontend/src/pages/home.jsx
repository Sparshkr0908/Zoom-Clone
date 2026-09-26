import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import withAuth from '../utils/withAuth'
import "../App.css";
import { Button, IconButton, TextField, Typography } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");
    const { addToUserHistory, checkMeetingActive } = useContext(AuthContext);

    const generateMeetingCode = () => {
        return Math.random().toString(36).substring(2, 10);
    }

    let handleCreateMeeting = async () => {
        const newCode = generateMeetingCode();
        try {
            await addToUserHistory(newCode);
            navigate(`/${newCode}`, { state: { isHost: true } });
        } catch (err) {
            setError("Failed to create meeting. Please try again.");
        }
    }

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            setError("Please enter a meeting code");
            return;
        }

        try {
            const active = await checkMeetingActive(meetingCode);
            if (!active) {
                setError("Meeting not found or has ended.");
                return;
            }
            setError("");
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`, { state: { isHost: false } });
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <>
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="/logo.png" alt="Apni BaatCheet Logo" className="logoImg" />
                    <h2>Apni BaatCheet</h2>
                </div>
                <div className="navRight">
                    <IconButton onClick={() => navigate("/history")}>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>
                    <Button
                        className="logoutBtn"
                        onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/auth")
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <h2>Apni BaatCheet Mein Aapka Swagat Hai — Baat Karo Befikar</h2>
                    <p className="subtext">
                        Start an instant meeting or join with a code — simple, fast, and reliable.
                    </p>

                    <div className="joinRow">
                        <TextField
                            onChange={e => { setMeetingCode(e.target.value); setError(""); }}
                            id="outlined-basic"
                            label="Meeting Code"
                            variant="outlined"
                            error={!!error}
                            size="small"
                        />
                        <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>
                    </div>

                    {error && (
                        <Typography color="error" sx={{ mb: 2, fontSize: "14px" }}>
                            {error}
                        </Typography>
                    )}

                    <Button className="newMeetingBtn" onClick={handleCreateMeeting} variant='outlined'>
                        + New Meeting
                    </Button>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/logo3.png' alt="" />
                </div>
            </div>
        </>
    )
}

export default withAuth(HomeComponent)