// import { Link } from "react-router-dom";
import styles from "./explore.module.css";
// import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

export const ExplorePeople = () => {
  const { auth } = useContext(ItemContext);
  const explorePeople = [];
  return (
    <div className={styles.exploreBody}>
      {auth ? (
        explorePeople.map((item) => (
          <article
            key={item.keyID}
            className={styles.levelArticle}
            id={item.id}
          >
            <img src={item.image} alt={item.name} />
            <div>
              <h2>level {item.level}</h2>
              {item.difficulty == "easy" ? (
                <p style={{ color: "#7CFC00", backgroundColor: "#cd5700" }}>
                  {item.difficulty}
                </p>
              ) : (
                <p style={{ color: "#FFFF00", backgroundColor: "#cd5700" }}>
                  {item.difficulty}
                </p>
              )}
            </div>
          </article>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          Interact with Page
        </h1>
      )}
    </div>
  );
};

export const ExploreGroups = () => {
  const { auth } = useContext(ItemContext);
  const exploreGroups = [];
  return (
    <div className={styles.exploreBody}>
      {auth ? (
        exploreGroups.map((item) => (
          <article
            key={item.keyID}
            className={styles.levelArticle}
            id={item.id}
          >
            <img src={item.image} alt={item.name} />
            <div>
              <h2>level {item.level}</h2>
              {item.difficulty == "easy" ? (
                <p style={{ color: "#7CFC00", backgroundColor: "#cd5700" }}>
                  {item.difficulty}
                </p>
              ) : (
                <p style={{ color: "#FFFF00", backgroundColor: "#cd5700" }}>
                  {item.difficulty}
                </p>
              )}
            </div>
          </article>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          Interact with Page
        </h1>
      )}
    </div>
  );
};
