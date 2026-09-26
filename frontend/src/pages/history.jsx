import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton, Snackbar } from "@mui/material";
import styles from "../styles/history.module.css";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (err) {
        console.log(err);
        setError("Failed to load meeting history. Please try again.");
        setOpenSnackbar(true);
      }
    };
    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  let formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <IconButton className={styles.homeIconBtn} onClick={() => routeTo("/home")}>
          <HomeIcon />
        </IconButton>
        <h2>Meeting History</h2>
      </div>

      {meetings.length !== 0 ? (
        <div className={styles.meetingsGrid}>
          {meetings.map((e, i) => (
            <div className={styles.meetingCard} key={i}>
              <div className={styles.meetingCode}>Code: {e.meetingCode}</div>
              <div className={styles.meetingDateTime}>
                <span>{e.date ? formatDate(e.date) : "Not started yet"}</span>
                <span>{e.date ? formatTime(e.date) : "-"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No meeting history found.</div>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        message={error}
        onClose={() => setOpenSnackbar(false)}
      />
    </div>
  );
}