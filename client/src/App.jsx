import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',paddingTop:"250px"}}>
        <h1>Website Working in Progress !</h1>
      </div>
    </>
  )
}

export default App
