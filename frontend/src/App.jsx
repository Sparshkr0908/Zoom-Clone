import React from "react";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing";"./pages/landing.jsx"

function App(){
    return(
        <div className="App">
            <Router>
                <Routes>
                    <Route  path = '/' element = {<LandingPage/>}/>
                </Routes>
            </Router>
        </div>
    );
}


export default App; 