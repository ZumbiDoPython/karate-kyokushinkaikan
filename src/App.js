import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import AppRoutes from "./routes";
import { MenuProvider } from "./contexts/MenuContext";
import { WordPressProvider } from "./contexts/WordPressContext";

const App = () => {
  return (
    <Router>
      <WordPressProvider>
        <MenuProvider>
          <div className="flex flex-col min-h-screen">
            <Banner />
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </MenuProvider>
      </WordPressProvider>
    </Router>
  );
};

export default App;
