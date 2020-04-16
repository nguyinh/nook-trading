import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { AppProvider } from "./contexts";
import Navigation from "./Navigation";
// import { AuthProvider } from "./contexts/AuthContext";

import { Profile, Market,PostCreator } from "./pages";

function App() {
  return (
    <AppProvider>
      <Router>
        <div>
          <Navigation />

          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/navet-trend">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "90vh",
                  margin: "40vh 0",
                }}
              >
                <span style={{fontSize: 'x-large'}}>Work in progress 👨‍💻🔥</span>
              </div>
            </Route>
            <Route path="/market">
              <Market />
            </Route>
          </Switch>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
