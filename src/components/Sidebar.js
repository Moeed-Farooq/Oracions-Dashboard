import React from 'react'

const Sidebar = () => {
  return (
    <>
   <div className='sidebar' style={{position:"fixed"}} >
   <h1 className='text-white'>Oracions</h1>
   <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#projects">Portfolio</a></li>
        <li><a href="#team">Team</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>
   </div>
      
    </>
  )
}

export default Sidebar
