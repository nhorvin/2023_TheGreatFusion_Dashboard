import React, { useEffect } from 'react';
import Header from './Header/Header';

import { Outlet } from 'react-router';


const BaseLayout = () => {
    useEffect(() => {
        document.title = "TheGreatFusion"
    });
    return (
        
        <React.StrictMode>
            <Header />
            <Outlet />
        </React.StrictMode>
    )
};

export default BaseLayout;
