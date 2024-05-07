import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./CallbackPage.module.css";
import hpbar from "../../assets/images/hpbar.png";

function CallbackPage() {
  const [userData, setUserData] = useState({ topGenres: [], minutesPlayed: 0 });
  const [pokemonImages, setPokemonImages] = useState({});
  const [pokemonList, setPokemonList] = useState([]);

  const fetchPlaybackData = async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const recentlyPlayed = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        { headers }
      );
      const minutesPlayed = recentlyPlayed.data.items.reduce(
        (total, track) => total + track.track.duration_ms / 60000,
        0
      );

      return {
        recentlyPlayed: recentlyPlayed.data.items,
        minutesPlayed,
      };
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      return null;
    }
  };

  const fetchUserData = async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const topArtists = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?limit=10",
        { headers }
      );
      let genreCount = {};
      topArtists.data.items.forEach((artist) => {
        artist.genres.forEach((genre) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      });

      // Sorting genres by frequency and extracting top genres
      const topGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map((genre) => genre[0]);

      return {
        topGenres,
        topArtists: topArtists.data.items,
      };
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      return null;
    }
  };

  const fetchPokemonImages = async (pList) => {
    try {
      const pokemonImagesData = {};

      // Fetch images for each Pokémon in the list
      await Promise.all(
        pList.map(async (pokemon) => {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
          );
          pokemonImagesData[pokemon] = response.data.sprites.front_default;
        })
      );

      // Update state with the fetched images
      setPokemonImages(pokemonImagesData);
    } catch (error) {
      console.error("Error fetching Pokémon images:", error);
    }
  };

  const callChatGPT = async (topGenres, topArtists) => {
    try {
      const apiKey = process.env.REACT_APP_OPEN_AI_KEY;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
          Context: Pokemon generator based on personality assessed by user's top artists and genres
      
          Input:
          Top genres: ${topGenres.join(", ")}
          Top artists: ${topArtists.join(", ")}
      
          Task: Only output the names of 6 different pokemon separated by commas based on personality traits and quirks representative of the top artists and genres.
          All Pokemon outputted must be unique and different from one another. Do not use pikachu, ludicolo, or charizard
          Structure of Ouput: [Pokemon1, Pokemon2, Pokemon3, Pokemon4, Pokemon5, Pokemon6]`,
            },
          ],
          temperature: 0.6,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      console.log(response.data.choices[0].message.content);
      const pokemonString = response.data.choices[0].message.content;
      const firstIndexOfBracket = pokemonString.indexOf("[") + 1;
      const parsedPokemonList = pokemonString
        .slice(firstIndexOfBracket, -1) // Remove square brackets
        .split(",") // Split by commas
        .map((pokemon) => pokemon.trim()); // Trim each name
      setPokemonList(parsedPokemonList);
      fetchPokemonImages(parsedPokemonList);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error gracefully, e.g., show an error message to the user
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = new URLSearchParams(hash.substring(1)).get("access_token");

    if (token) {
      Promise.all([fetchUserData(token), fetchPlaybackData(token)]).then(
        ([userData, playbackData]) => {
          setUserData({
            topGenres: userData.topGenres,
            topArtists: userData.topArtists,
            recentlyPlayed: playbackData.recentlyPlayed,
            minutesPlayed: playbackData.minutesPlayed,
          });
          callChatGPT(userData.topGenres, userData.topArtists);
        }
      );
      window.location.hash = ""; // Clean up the URL
    }
  });

  return (
    <div>
      {userData.topGenres.length ? (
        <div>
          <h1>Here are your results:</h1>
          <div className={classes.grid_holder}>
            {pokemonList.map((pokemon, index) => (
              <div key={index} className={classes.rectangle}>
                <div className={classes.grid_container}>
                  <div className={classes.grid_item_large}>
                    <img
                      src={pokemonImages[pokemon]}
                      alt={pokemon}
                      style={{ width: "110px", height: "110px" }}
                    />
                  </div>
                  <div className={classes.grid_item}>
                    {" "}
                    <h3>{pokemon.toUpperCase()}</h3>
                  </div>
                  <div className={classes.grid_item}>
                    <img src={hpbar} alt="hpbar" className={classes.hp_bar} />
                  </div>
                  <div className={classes.grid_item_small}>Lv. 30</div>
                  <div className={classes.grid_item_small}>100/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CallbackPage;
