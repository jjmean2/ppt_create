import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "Routes";

function App() {
  return (
    <Router basename="/ppt_create">
      <Routes />
    </Router>
  );
}

export default App;
