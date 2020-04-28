import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./contexts";
import Navigation from "./Navigation";
import Changelog from "./Changelog";

import { Profile, Market, TurnipTrend, Home } from "./pages";

function App() {
  return (
    <AppProvider>
      <Router>
        <>
          <Changelog/>

          <Navigation />

          <Switch>
            <Route path="/profile/:pseudo">
              <Profile />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/turnip-trend/:pseudo">
              <TurnipTrend />
            </Route>
            <Route path="/turnip-trend">
              <TurnipTrend />
            </Route>
            <Route path="/market">
              <Market />
            </Route>

            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </>
      </Router>
    </AppProvider>
  );
}

export default App;
