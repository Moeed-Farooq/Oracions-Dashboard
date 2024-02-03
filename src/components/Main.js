import React from 'react'
import Home from './home/Home'
import About from './about/About'
import Contact from './contact/Contact'
import Projects from './projects/Projects'
import CreateProjects from './projects/Createproject'
import Team from './Team/Team'
import CreateTeam from './Team/CreateTeam'
import Service from './service/Service'
import CreateService from './service/CreateService'

const Main = () => {
  return (
    <>
    <div className="row " style={{backgroundColor:"white"}}>
    <Home/>
    <About/>
    <Service/>
    <CreateService/>
    <Projects/>
    <CreateProjects/>
    <Team/>
    <CreateTeam/>
    <Contact/>
    
    </div>

    
      
    </>
  )
}

export default Main
