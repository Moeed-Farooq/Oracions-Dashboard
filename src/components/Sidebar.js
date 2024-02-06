import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <>
   <div className='sidebar mt-5' >
   <ul>
        <li><Link to="/Home">Home</Link></li>
        <li><Link to="/About">About</Link></li>
        <li><Link to="/Service">Services</Link></li>
        <li><Link to="/Projects">Portfolio</Link></li>
        <li><Link to="/Team">Team</Link></li>
        <li><Link to="/Contact">Contact</Link></li>
    </ul>
   </div>
      
    </>
  )
}

export default Sidebar
