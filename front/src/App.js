import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./contexts";
import Navigation from "./Navigation";
// import { AuthProvider } from "./contexts/AuthContext";

import { Profile, Market, PostCreator } from "./pages";

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
            <Route path="/turnip-trend">
              <div className="wip">
                <span className="wip-title">Work in progress 👨‍💻🔥</span>
                <span className="wip-explanations">
                  icitupourraspartagertoncoursdunavetavectesmeilleurspotosmatin&après-midimaischutc'estunsecret
                </span>
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
