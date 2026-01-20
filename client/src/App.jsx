import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Banner from './components/banner/Banner'
import Footer from './components/Footer/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      {/* <div style={{display:'flex',alignItems:'center',justifyContent:'center',paddingTop:"250px"}}>
        <h1>Website Working in Progress !</h1>
      </div> */}
      <Banner/>
      <Home/>
      <Footer/>
    </>
  )
}

export default App
