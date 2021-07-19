import React from "react";
import EnhancedTable from "./MainTable";
import Tgroup from "./GroupbyClinician";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DataTableRowGroupDemo from "./GroupbyClinician";
import GroupbyStartDate from "./GroupbyStartDate";
import history from "../Utils/history";
function Appointments() {
  function handleClick(e) {
    history.push(e.target.value);
    window.location.reload();
  }
  return (
    <div>
      <h1>Appointment</h1>
      <label>Groupby:</label>
      <select name="cars" id="cars" onChange={handleClick}>
        <option value="/">-</option>
        <option value="/about">StartDate</option>
        <option value="/topics">ClinicianName</option>
        <option value="/">None</option>
      </select>
      <Router history={history}>
        <Switch>
          <Route path="/about">
            <GroupbyStartDate></GroupbyStartDate>
          </Route>
          <Route path="/topics">
            <DataTableRowGroupDemo></DataTableRowGroupDemo>
          </Route>
          <Route exact path="/">
            <EnhancedTable></EnhancedTable>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default Appointments;
