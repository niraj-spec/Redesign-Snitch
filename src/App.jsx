import React, { useEffect } from 'react'
import MainRoute from './routes/MainRoute'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='overflow-auto  font-thin w-screen h-screen scroll-smooth'>
         <Navbar/>         
      <MainRoute/>
    </div>
  )
}

export default App;