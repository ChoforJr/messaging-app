import styles from "./post.module.css";
// import { useState, useEffect } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
// const apiUrl = import.meta.env.MESSAGING_APP_API_URL;

export const PeopleChats = () => {
  const { auth } = useContext(ItemContext);

  return (
    <div className={styles.chatBody}>
      {auth ? (
        <>
          <section className={styles.contacts}></section>
          <section className={styles.messages}></section>
        </>
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

export const GroupChats = () => {
  const { auth } = useContext(ItemContext);

  return (
    <div className={styles.chatBody}>
      {auth ? (
        <>
          <section className={styles.joinedGroups}></section>
          <section className={styles.messages}></section>
        </>
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
