import { useState } from "react";
import HeaderStyle from "./Header.module.css";
import Login from "../../pages/Login/Login";
import  { useNavigate } from 'react-router-dom'


const Header = () => {
    const [showLogin,setShowLogin]=useState(false)
    const [SwitchLoginLogout,setSwitchLoginLogout]=useState(false)
    const Navigate=useNavigate()
    const switchToLogin=(e)=>{
      e.preventDefault();
      Navigate('/LogReg')
    }

    const LogOutHandle=async()=>{
        try{
          const res=await fetch('http://localhost:3000/api/logout',{method:'POST',credentials:'include', headers: {'Content-Type': 'application/json'}})

          if(res.ok){
            setSwitchLoginLogout(false);
            alert('Logged out Successfully')
          }else{
            alert('Logout Failed')
          }
        }catch(err){
          console.error(err);
          
        }
    }
  return (
   <>
     <header className={HeaderStyle.header}>
      <div className={HeaderStyle.headerleft}>
        <img src="/weblogo.png" alt="Amma Vegetables" className="logo" />
      </div>

      <div className={HeaderStyle.searchcontainer}>
        <input
            type="text"placeholder="Search vegetables..." className={HeaderStyle.searchinput}/>
        <button className={HeaderStyle.searchbtn}>🔍</button>
    </div>


      <nav className={HeaderStyle.headerright}>
        <a href="/">Home</a>
        <a href="/cart">Cart</a>
        {SwitchLoginLogout&&<a href="/cart">Account</a>}
       {!SwitchLoginLogout?<button className={HeaderStyle.loginbtn} onClick={() => setShowLogin(true)}>Login</button>:
        <button className={HeaderStyle.loginbtn} onClick={LogOutHandle} >Logout</button>}
      </nav>
    </header>

    {showLogin && <Login closeModal={() => setShowLogin(false)} setSwitchLoginLogout={setSwitchLoginLogout} />}

   </>
  );
};

export default Header;
