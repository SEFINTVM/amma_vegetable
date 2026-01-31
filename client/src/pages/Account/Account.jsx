import React, { useEffect, useState } from 'react'
import AccountStyle from "./Account.module.css";

function Account() {
  const [PassForm,setPassForm]=useState({
    CurrPass:'',
    NewPass:'',
    ConNewPass:''
  })
  const [mode,setMode]=useState('view')
  const [ProfileData,setProfileData]=useState({})
  const [EditFormData,setEditFormData]=useState({
    Name:'',
    Phone:'',
    Email:'',
    Address:'',
    Place:''
  })
  useEffect(()=>{
    try{
      fetch('http://localhost:3000/api/Profile',{credentials:'include'})
      .then(res=>res.json())
      .then(data=>setProfileData(data))
      .catch(err=>console.error(err))
    }catch(err){
        console.error(err);
        console.log('Server error');
        
        
    }
  },[])
  useEffect(()=>{
    if(ProfileData){
      setEditFormData(ProfileData)
    }
  },[ProfileData])

  const EditFormChange=(e)=>{
    setEditFormData({...EditFormData,[e.target.name]:e.target.value})
  }


  const RegFormSubmit= async(e)=>{
      e.preventDefault();
      try{
          const res=await fetch('http://localhost:3000/api/update',{method:'POST',credentials:'include', headers: {'Content-Type': 'application/json'},body:JSON.stringify(EditFormData)})

           const d= await res.json()
            if(res.ok){
              console.log('Profile Update successful:', d);
              alert('Your Profile Has Updated Successfully')
              setProfileData(d.user)
              setFormSwitch(true)
              
            }
      }catch(err){
        console.error(err);
      }

  }
  
      const handleChange=(e)=>{
        setPassForm({...PassForm,[e.target.name]:e.target.value})
      }

      const handleSubmit=async(e)=>{
        e.preventDefault();

        if(PassForm.NewPass!==PassForm.ConNewPass){
          return alert('Password do not match')
        }

        const res=await fetch('http://localhost:3000/api/PassChange',{
          method:'POST',
          credentials:'include',
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify({
            currentPassword:PassForm.CurrPass,
            newPassword:PassForm.NewPass
          })
        })

        const data=await res.json();
        alert(data.message);

        if (res.ok) setMode("view");
      }
      
  return (
    <div>
        <div className={AccountStyle.AccContainer}>
            <h2>Costomer Profile</h2>
           {mode==='view'&&<>
             
              <a onClick={()=>setMode('edit')}>Edit</a>
              <a onClick={()=>setMode('pass')}>Change Password</a>
              <p>Manage your account details and settings here.</p>

              <div className={AccountStyle.infoSec}>
                <p data-label="Name">{ProfileData.Name}</p>
                <p data-label="Phone">{ProfileData.Phone}</p>
                <p data-label="Email">{ProfileData.Email}</p>
                <p data-label="Address">{ProfileData.Address}</p>
                <p data-label="Place">{ProfileData.Place}</p>
            </div>
           </>}

          {mode==='edit'&&<div className={AccountStyle.EditSec}>
            <a onClick={()=>setMode('view')}>No Edit</a>
               <form onSubmit={RegFormSubmit} method="POST" className={AccountStyle.modalRegForm}>
                            <input type="text" name="Name" value={EditFormData.Name} id="Name" placeholder="Name" onChange={EditFormChange} required />
                            <input type="text" name="Phone" value={EditFormData.Phone} id="Phone" placeholder="Phone" onChange={EditFormChange} required />
                            <input type="email" name="Email" value={EditFormData.Email} id="Email" placeholder="Email" onChange={EditFormChange} required />
                           
                            <textarea name="Address" id="Address" value={EditFormData.Address} placeholder='Address....' onChange={EditFormChange}></textarea>
                            <input type="text" name="Place" id="Place" value={EditFormData.Place} placeholder="Place" onChange={EditFormChange} required />
                            <button type="submit" className={AccountStyle.modalRegSubmit}>
                              Update
                            </button>
                            
                          </form>
          </div>}

          {
            mode==='pass'&&

            <div className={AccountStyle.EditSec}>
            <a onClick={() => setMode("view")}>Cancel</a>

            <form onSubmit={handleSubmit} className={AccountStyle.modalRegForm}>
              <input type="password" name="CurrPass" placeholder="Current Password" onChange={handleChange} required />
              <input type="password" name="NewPass" placeholder="New Password" onChange={handleChange} required />
              <input type="password" name="ConNewPass" placeholder="Confirm Password" onChange={handleChange} required />
              <button type="submit">Change Password</button>
            </form>
          </div>
          }
        </div>

    </div>
  )
}

export default Account