import React from 'react'
import Sidebar from './Sidebar'
import Home from './home/Home'
import Main from './Main'

const Dashboard = () => {
  return (
    <>

    <div className="container-fluid" >
        <div className="row" >

            <div className="col-md-2  " style={{backgroundColor:"#41B2A8"}}>
                
            <Sidebar/>
            </div>

            <div className="col-md-10">
           <Main/>
            </div>

        </div>
    </div>
        

      
    </>
  )
}

export default Dashboard
