import './App.css';
import React from "react";
import AccountComp from "./components/AccountComp";
import { Route, Switch } from 'react-router-dom';
import Login from "./components/Login";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Switch>
              <Route path="/accounts" component={AccountComp} exact/>
              <Route path="/login" component={Login} exact/>
          </Switch>
      </header>
    </div>
  );
}

export default App;
