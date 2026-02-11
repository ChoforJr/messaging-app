import { Link } from "react-router-dom";
import styles from "./homePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Link to="/posts">
        <h1>
          WELCOME TO
          <br />
          CHOFOR'S BLOG
          <br />
          ENTER
        </h1>
      </Link>
    </div>
  );
};

export default HomePage;
