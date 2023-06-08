import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Route } from 'react-router';



import BaseLayout from './BaseLayout';
import './custom.css';
import Home from './Dashboard';
//import Scraper from './Scraper';


const App = () => {
  return (
    <div className="main-content">
      <BrowserRouter>
        <Routes>
          {/* De index element moet naar de homepage als we die hebben */}
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Home />} />
            {/* <Route path="/Scraper" element={<Scraper />} /> */}
            
  
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;