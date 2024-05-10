import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./CallbackPage.module.css";
import hpbar from "../../assets/images/hpbar.png";
import pokeball from "../../assets/images/pokeball.webp";

import electric from "../../assets/images/electrictype.png";
import normal from "../../assets/images/normaltype.png";
import poison from "../../assets/images/poisontype.png";
import bug from "../../assets/images/bugtype.png";
import dark from "../../assets/images/darktype.png";
import dragon from "../../assets/images/dragontype.png";
import fairy from "../../assets/images/fairytype.png";
import fighting from "../../assets/images/fightingtype.png";
import fire from "../../assets/images/firetype.png";
import flying from "../../assets/images/flyingtype.png";
import ghost from "../../assets/images/grasstype.png";
import grass from "../../assets/images/poisontype.png";
import ground from "../../assets/images/groundtype.png";
import ice from "../../assets/images/icetype.png";
import psychic from "../../assets/images/psychictype.png";
import rock from "../../assets/images/rocktype.png";
import steel from "../../assets/images/steeltype.png";
import water from "../../assets/images/watertype.png";

import trainer from "../../assets/images/trainer.png";
import DialogBox from "../../components/Dialog/Dialog";

const typeImages = {
  electric: electric,
  normal: normal,
  poison: poison,
  bug: bug,
  dark: dark,
  dragon: dragon,
  fairy: fairy,
  fire: fire,
  fighting: fighting,
  flying: flying,
  ghost: ghost,
  grass: grass,
  ground: ground,
  ice: ice,
  psychic: psychic,
  rock: rock,
  steel: steel,
  water: water,
};

function CallbackPage() {
  const [userData, setUserData] = useState({ topGenres: [], minutesPlayed: 0 });
  const [pokemonImages, setPokemonImages] = useState({});
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState({});
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

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
      const pokemonTypesData = {};

      // Fetch images for each Pokémon in the list
      await Promise.all(
        pList.map(async (pokemon) => {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
          );
          pokemonImagesData[pokemon] = response.data.sprites.front_default;
          pokemonTypesData[pokemon] = response.data.types.map(
            (typeInfo) => typeInfo.type.name
          );
        })
      );

      // Update state with the fetched images
      setPokemonImages(pokemonImagesData);
      setPokemonTypes(pokemonTypesData);
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
          console.log(userData.topArtists);
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
      {/* {isActive ? <DialogBox isActive={isActive} /> : ""} */}
      {userData.topGenres.length ? (
        <div style={{ textAlign: "center" }}>
          <h2 className={classes.results_text}>Here are your results:</h2>
          <div className={classes.all_holder}>
            <div className={classes.grid_holder}>
              {pokemonList.map((pokemon, index) => (
                <div
                  key={index}
                  className={classes.rectangle}
                  onClick={handleClick}
                >
                  <div className={classes.grid_container}>
                    <div className={classes.grid_item_large}>
                      <img
                        src={pokemonImages[pokemon]}
                        alt={pokemon}
                        className={classes.pokemon_pic}
                      />
                      <img
                        src={pokeball}
                        alt="pokeball"
                        className={classes.pokeball}
                      />
                    </div>
                    <div className={classes.grid_item}>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0px",
                        }}
                      >
                        <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
                          {pokemon.toUpperCase()}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            marginBottom: "15px",
                            marginTop: "0px",
                            borderRadius: "36%",
                            padding: "2px",
                            overflow: "hidden",
                            backgroundColor: "#15A942",
                          }}
                        >
                          <div style={{ flex: 1 }} />
                          {pokemonTypes[pokemon]?.map((type) => (
                            <img
                              key={type}
                              src={typeImages[type]}
                              alt={`${type} type`}
                              className={classes.type_images}
                            />
                          ))}
                          <div style={{ flex: 1 }} />
                        </div>
                      </div>
                    </div>
                    <div className={classes.grid_item}>
                      <img src={hpbar} alt="hpbar" className={classes.hp_bar} />
                    </div>
                    <div
                      className={classes.grid_item_small}
                      style={{ marginTop: "5px" }}
                    >
                      Lv. 30
                    </div>
                    <div className={classes.grid_item_small}>100/100</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={classes.stats_holder}>
              <div className={classes.top_genres_holder}>
                <h4 className={classes.top_genres_title}>Top Genres</h4>
                <ul>
                  {userData.topGenres.map((genre) => (
                    <li key={genre}>{genre}</li>
                  ))}
                </ul>
                <img
                  key={"trainer"}
                  src={trainer}
                  alt={"trainer"}
                  className={classes.trainer_image}
                />
              </div>
              <div className={classes.top_artists_holder}>
                <h4 className={classes.top_artists_title}>Top Artists</h4>
                <ul>
                  {userData.topArtists.map((artist) => (
                    <li key={artist.id}>{artist.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CallbackPage;
