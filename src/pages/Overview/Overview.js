import SpotifyAuth from "../../components/SpotifyAuth/SpotifyAuth";
import classes from "./Overview.module.css";
const Overview = () => {
  return (
    <div>
      <h1 className={classes.hello}>pokefy</h1>
      <SpotifyAuth />
    </div>
  );
};

export default Overview;
