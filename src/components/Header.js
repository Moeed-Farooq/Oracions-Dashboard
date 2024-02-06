import React from 'react'
import logo from './image/logo.png';



const Header = () => {
  return (
    <>

    <div className="container-fluid "  style={{backgroundColor:"#41B2A8"}}>
        <div className="row  header ps-4 pt-3">
            <div className='d-flex '>
                <img src={logo} width={50} height={50} alt="" />
                <p className='d-flex mt-1 ms-3' style={{fontSize:"30px"}}>Oracions Dashboard</p>
            </div>
        </div>
    </div>
     
    </>
  )
}

export default Header