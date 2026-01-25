import { useState } from "react";
import LoginStyle from "./Login.module.css";

const Login = ({ closeModal,setSwitchLoginLogout }) => {
  const [ToggleForm,setToggleForm]=useState(true)
  const [RegFormData,setRegFormData]=useState({
    Name:'',
    Phone:'',
    Email:'',
    Password:'',
    Address:'',
    Place:''
  })

  const [LogFormData,setLogFormData]=useState({
    Name:'',
    Password:''
  })

  const RegDataHandle=(e)=>{
    setRegFormData({...RegFormData,[e.target.name]:e.target.value})
  }

  const LogDataHandle=(e)=>{
    setLogFormData({...LogFormData,[e.target.name]:e.target.value})
  }


  const switchForm=()=>{
    setToggleForm(!ToggleForm)
  }

  const LogFormSubmit=async(e)=>{
      e.preventDefault();
      try{
          const res=await fetch('http://localhost:3000/api/login',{method:'POST',credentials:'include', headers: {'Content-Type': 'application/json'},body:JSON.stringify(LogFormData)})

           const d= await res.json()

           if(res.ok){
            console.log('Login successful:', d);
            alert('Your Login Has Successful')
            setSwitchLoginLogout(true)
            closeModal()
            

           } else {
              // Login failed
              console.error('Login failed:', d.message || d);
            }
          
      }catch(err){
        console.error(err);
        
      }
  }

  const RegFormSubmit= async(e)=>{
      e.preventDefault();

      try{
            const resp= await fetch('http://localhost:3000/api/register',{method:'POST',credentials:'include', headers: {'Content-Type': 'application/json'},body:JSON.stringify(RegFormData)})
          
            const data=resp.json()

            if(resp.ok){
              alert('Registration Successful')
              setToggleForm(!ToggleForm)
            }else{
              alert(data.message)
            }
      }catch(err){
            console.error(err);
            alert('server error')
        
      }
  }
  return (
    <div className={LoginStyle.modalBackdrop}>
      <div className={LoginStyle.modalContent}>
        <button className={LoginStyle.modalClose} onClick={closeModal}>
          &times;
        </button>
        {ToggleForm?<>
            <h2>Login</h2>
              <form method="POST" onSubmit={LogFormSubmit} className={LoginStyle.modalForm}>
                <input type="email" name="Email" placeholder="Email" onChange={LogDataHandle} required />
                <input type="password" name="Password" placeholder="Password" onChange={LogDataHandle} required />
                <button type="submit" className={LoginStyle.modalSubmit}>
                  Login
                </button>
                
              </form>
              <p>
                Don't have an account?{" "}
                <span onClick={switchForm} className={LoginStyle.switchForm}>Register</span>
              </p>
        </>:
              <>
            <h2 className={LoginStyle.RegHead}>Register</h2>
            <form onSubmit={RegFormSubmit} method="POST" className={LoginStyle.modalRegForm}>
              <input type="text" name="Name" id="Name" placeholder="Name" onChange={RegDataHandle} required />
              <input type="text" name="Phone" id="Phone" placeholder="Phone" onChange={RegDataHandle} required />
              <input type="email" name="Email" id="Email" placeholder="Email" onChange={RegDataHandle} required />
              <input type="password" name="Password" id="Password" placeholder="Password" onChange={RegDataHandle} required />
              <textarea name="Address" id="Address" onChange={RegDataHandle}></textarea>
              <input type="text" name="Place" id="Place" placeholder="Place" onChange={RegDataHandle} required />
              <button type="submit" className={LoginStyle.modalRegSubmit}>
                Register
              </button>
              <p>
              Already have an account?{" "}
              <span onClick={switchForm} className={LoginStyle.switchForm}>Login</span>
            </p>
            </form>
      </>
        }
      </div>

      
    </div>
  );
};

export default Login;
