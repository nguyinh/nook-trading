import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppProvider } from "./contexts";
// import { AuthProvider } from "./contexts/AuthContext";

import { Profile, Home } from "./pages";

function App() {
  return (
    <AppProvider>
      {/* <AuthProvider> */}
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
      {/* </AuthProvider> */}
    </AppProvider>
  );
}

export default App;
