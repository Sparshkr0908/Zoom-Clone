import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <img src="/logo.png" alt="Apni BaatCheet Logo" className="logoImg" />
          <h2>Apni BaatCheet</h2>
        </div>
        <div className="navlist">
          <p className="hov"
            onClick={() => {
              router("/aljk23");
            }}
          >
            Join as Guest
          </p>

          <p className="hov"
            onClick={() => {
              router("/auth");
            }}
          >
            Register
          </p>
          <div
            onClick={() => {
              router("/auth");
            }}
            role="button"
          >
            <p className="hov">Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
         <h1>
    <span style={{ color: "#FF9839" }}>Judiye</span> apno se, <br/>
    Bina Kisi Doori Ke
</h1>

<p>Apni BaatCheet — Jahan Har Time Ho Apno ka Time</p>
          <div role="button">
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  );
}
