import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Banner from './components/banner/Banner'
import Footer from './components/Footer/Footer'
import { Route, Routes } from 'react-router-dom'
import Account from './pages/Account/Account'
import { useEffect } from 'react'
import Cart from './components/Cart/Cart'
import { ToastContainer, toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [logged, setLogged] = useState(false)

  useEffect(()=>{
      fetch('http://localhost:3000/api/me',{method:'get',credentials:'include'})
      .then(res=>{if(res.ok) return res.json();
                  throw new Error('Not Logged')
      }).then(()=>setLogged(true))
      .catch(()=>setLogged(false))
  },[])


  return (
    <>
      <Header logged={logged} setLogged={setLogged}/>
      <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
      />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Account' element={<Account/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>

      </Routes>
      
      <Footer/>
    </>
  )
}

export default App
