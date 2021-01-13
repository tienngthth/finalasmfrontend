import './styles/App.css';
import React from "react";
import { Route, Switch } from 'react-router-dom';
import AccountCRUD from "./components/AccountCRUD";
import TableCRUD from "./components/TableCRUD";
import LoginPanel from "./components/LoginPanel";
import ReservationCRUD from "./components/ReservationCRUD";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Switch>
              <Route path="/login" component={ LoginPanel } exact/>
              <Route path="/accounts" component={ AccountCRUD } exact/>
              <Route path="/tables" component={ TableCRUD } exact/>
              <Route path="/reservations" component={ ReservationCRUD } exact/>
          </Switch>
      </header>
    </div>
  );
}

export default App;
