import logo from "./logo.svg";
import Appointments from "./component/Appointments";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import ReactDOM from "react-dom";
import { Router } from "react-router";

import history from "./Utils/history";
function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Appointments></Appointments>
      </Router>
    </div>
  );
}

export default App;
