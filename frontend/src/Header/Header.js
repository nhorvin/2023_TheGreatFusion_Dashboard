import React from 'react';
import HeadItem from './HeadItem';
import { useNavigate } from "react-router-dom";




function Header() {

let navigate = useNavigate(); 
const routeChange = () =>{ 
  let path = `frontend.local/`; 
  navigate(path);
}
    return (
        <div className="header-basic">
            <header>
                <ul className="list-inline">
                    <div className='basic'>
                        <HeadItem link="/Scraper.html" text="Trends" />
                    </div>
                </ul>
            </header>
        </div>
    );
}
export default Header;
