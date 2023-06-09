import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Route } from 'react-router';



import BaseLayout from './BaseLayout';
import './custom.css';
import Home from './Dashboard';
// import ProductTypeChart from './ProductTypeChart';


const App = () => {
  return (
    <div className="main-content">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Home />} />
      
            
  
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;