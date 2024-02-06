import React from 'react';
import Sidebar from './Sidebar';
import Home from './home/Home';
import Main from './Main';
import Header from './Header';
import Service from './service/Service';
import CreateService from './service/CreateService';
import Projects from './projects/Projects';
import CreateProjects from './projects/Createproject';
import Team from './Team/Team';
import CreateTeam from './Team/CreateTeam';
import Contact from './contact/Contact';
import About from './about/About';
import { Routes, Route } from "react-router-dom"
import Message from './contact/Message';

const Dashboard = () => {
  return (
    <>
      <div className="container-fluid"   >
        <div className="row " >
          <Header />
        </div>
        <div className="row"  style={{height:"100vh"}} >
          <div className="col-md-2" style={{ backgroundColor: "#41B2A8", borderRadius: "0px 30px 0px 0px" }}>
            <Sidebar />
          </div>
          <div className="col-md-10 p-2 d-flex justify-content-center">
            <div className="main row">
              <Routes>
                <Route path='/Home' element={<Home/>}/>
                <Route path='/About' element={<About/>}/>
                <Route path='/Service' element={<Service/>}/>
                <Route path='/CreateService' element={<CreateService/>}/>
                <Route path='/Projects' element={<Projects/>}/>
                <Route path='/CreateProjects' element={<CreateProjects/>}/>
                <Route path='/Team' element={<Team/>}/>
                <Route path='/CreateTeam' element={<CreateTeam/>}/>
                <Route path='/Contact' element={<Contact/>}/>
                <Route path='/Message' element={<Message/>}/>


              </Routes>
            
    
    
    
    
    
    
    
    
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
