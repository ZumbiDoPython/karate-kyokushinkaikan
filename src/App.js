import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import AppRoutes from "./routes";

const App = () => {
  return (
    <Router>
      <Banner />
      <Navbar />
      <AppRoutes />
    </Router>
  );
};

export default App;
