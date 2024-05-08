import SpotifyAuth from "../../components/SpotifyAuth/SpotifyAuth";
import classes from "./Overview.module.css";
const Overview = () => {
  return (
    <div style={{ padding: "32px", textAlign: "center" }}>
      <h1 className={classes.main_title}>pokefy!</h1>
      <SpotifyAuth />
    </div>
  );
};

export default Overview;
