import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPE =
  "user-read-private user-read-email user-top-read user-read-recently-played";

function SpotifyAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    if (token) {
      fetchUserData(token).then((userData) => {
        // Assuming you have a route setup for '/profile'
        navigate("/profile", { state: { userData } });
      });
    }
  });

  const fetchUserData = async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", config);
      return response.data; // Contains user data
    } catch (error) {
      console.error("Error fetching data from Spotify: ", error);
      return null;
    }
  };

  const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(
      SCOPE
    )}`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Login to Spotify</button>
    </div>
  );
}

export default SpotifyAuth;
