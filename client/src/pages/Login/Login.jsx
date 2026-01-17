import LoginStyle from "./Login.module.css";

const Login = ({ closeModal }) => {
  return (
    <div className={LoginStyle.modalBackdrop}>
      <div className={LoginStyle.modalContent}>
        <button className={LoginStyle.modalClose} onClick={closeModal}>
          &times;
        </button>
        <h2>Login</h2>
        <form className={LoginStyle.modalForm}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className={LoginStyle.modalSubmit}>
            Login
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <span className={LoginStyle.switchForm}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
