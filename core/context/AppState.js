import React, { useReducer, useCallback, useEffect } from "react";

//context
import AppContext from "./appContext";
import appReducer from "./appReducer";

//firebase
import firebase from "firebase/app";
import "firebase/auth";

import { logoutUser } from "../../src/api/auth";
import { getBlogEntries, deleteNote } from "../../src/api/blog";

const AppState = (props) => {
  const initialState = {
    loggedIn: null,
    uid: null,
    lightTheme: true,
    blogEntries: null,
  };
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { loggedIn, uid, notesLoaded } = state;

  const themeSwitch = () => dispatch({ type: "CHANGE_THEME" });

  // const loadNotes = () =>
  //   getNotes(uid).then((res) =>
  //     dispatch({
  //       type: "LOAD_NOTES",
  //       payload: res.sort((a, b) => (a.nid < b.nid ? 1 : -1)),
  //     })
  //   );

  // const onNotes = useCallback(loadNotes, [uid]);

  useEffect(() => {
    authCheck();

    // if (!notesLoaded && loggedIn) {
    //   onNotes();
    // }
  }, [loggedIn]);

  const authCheck = () =>
    firebase.auth().onAuthStateChanged((user) =>
      user
        ? dispatch({
            type: "LOGGED_IN",
            payload: {
              uid: user.uid,
              username: firebase.auth().currentUser.displayName,
            },
          })
        : dispatch({ type: "NOT_LOGGED_IN" })
    );

  const onLogout = () => {
    logoutUser();
    dispatch({ type: "LOG_OUT" });
  };

  // const removeNote = (uid, nid) => deleteNote(uid, nid).then(() => onNotes());

  return (
    <AppContext.Provider
      value={{
        uid: state.uid,
        loggedIn: state.loggedIn,
        lightTheme: state.lightTheme,
        blogEntries: state.blogEntries,
        themeSwitch,
        onLogout,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
export default AppState;
