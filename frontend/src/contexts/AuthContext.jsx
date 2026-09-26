import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext({});

const API_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
    baseURL: `${API_URL}/api/v1/users`
})

const meetingClient = axios.create({
    baseURL: `${API_URL}/api/v1/meeting`
})

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }

    const checkMeetingActive = async (meetingCode) => {
        try {
            let request = await meetingClient.get(`/check/${meetingCode}`);
            return request.data.active;
        } catch (err) {
            throw err;
        }
    }

    const markMeetingStarted = async (meetingCode) => {
    try {
        await meetingClient.post(`/mark-started/${meetingCode}`);
    } catch (err) {
        console.log(err);
    }
}


    const data = {
        userData, setUserData, handleRegister, handleLogin, getHistoryOfUser, addToUserHistory, checkMeetingActive, markMeetingStarted
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}