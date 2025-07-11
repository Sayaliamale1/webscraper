// App.js - React Frontend for Web Scraper with Google OAuth
import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/data");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const scrapeData = async (source) => {
    setLoading(true);
    try {
      await axios.get(`http://localhost:5000/api/scrape/${source}`);
      await fetchData();
    } catch (error) {
      console.error("Scrape error:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:5000/api/data");
    } catch (err) {
      console.error("Error deleting data:", err);
    }
    googleLogout();
    setIsLoggedIn(false);
    setData([]);
  };

  return (
    <div>
      {!isLoggedIn && <h1 className="main-title">🌐 Web Scraper Portal</h1>}
      {!isLoggedIn ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            setIsLoggedIn(true);
            fetchData();
          }}
          onError={() => console.log("Login Failed")}
        />
      ) : (
        <div className="app-container">
          <div className="button-group">
            <button onClick={() => scrapeData("hn")}>📰 Hacker News</button>
            <button onClick={() => scrapeData("books")}>📚 Books</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="card-container">
          {data.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default App;
