import httpStatus from "http-status";
import {User} from "../Models/User.model.js";
import bcrypt, {hash} from "bcrypt"; 
import crypto from "crypto";
import { Meeting } from "../Models/Meeting.model.js";

const login = async(req, res)=>{
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({message:"Please Provide"})
    }
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not Found"})
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(isPasswordCorrect){
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            user.tokenExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
            await user.save();
            return res.status(httpStatus.OK).json({token:token})
        }
         else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }
    }
    catch (e){
        return res.status(500).json({message:`Something went Wrong ${e}`})
    }
}

const register = async (req, res)=>{
    const {name, username, password} = req.body;

    if(!name || !username || !password){
        return res.status(httpStatus.BAD_REQUEST).json({message: "Please provide name, username and password"});
    }

    if(password.length < 6){
        return res.status(httpStatus.BAD_REQUEST).json({message: "Password must be at least 6 characters long"});
    }

    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({message: "User Register"})
    }
    catch(e){
        res.json({message:`Something Went Wrong ${e}`})
    }
}

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        res.set("Cache-Control", "no-store");
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const verifyToken = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ valid: false, message: "No token provided" });
    }

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ valid: false, message: "Invalid token" });
        }

        if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
            return res.status(httpStatus.UNAUTHORIZED).json({ valid: false, message: "Token expired" });
        }

        return res.status(httpStatus.OK).json({ valid: true, username: user.username });
    } catch (e) {
        return res.status(500).json({ valid: false, message: `Something went wrong ${e}` });
    }
}

export {login, register, getUserHistory, addToHistory, verifyToken}