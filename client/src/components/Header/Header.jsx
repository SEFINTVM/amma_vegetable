import { useState } from "react";
import HeaderStyle from "./Header.module.css";
import Login from "../../pages/Login/Login";


const Header = () => {
    const [showLogin,setShowLogin]=useState(false)
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
        <button className={HeaderStyle.loginbtn} onClick={() => setShowLogin(true)}>Login</button>
      </nav>
    </header>

    {showLogin && <Login closeModal={() => setShowLogin(false)} />}

   </>
  );
};

export default Header;
