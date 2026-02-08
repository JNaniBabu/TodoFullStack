import { useRef, useState, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { AuthenticationContext } from "./auth.jsx";


import "./Register.css";

function RegisterSection({ HandleBack, handleImageUpdation }) {
  const API = "http://127.0.0.1:8000";

  const { RegisterCheck, setRegisterCheck } = useContext(AuthenticationContext);
  let [ActivateForm, setActivateForm] = useState(true);

  let [Message, setMessage] = useState("");

  const emailData = useRef("");
  const EmailData = useRef("");
  const nameData = useRef("");
  const passwordData = useRef("");
  const PasswordData = useRef("");

  const handleChange = () => {
    setMessage("");
  };

  const HandleRegistration = (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailData.current.value.trim() ||
      !passwordData.current.value.trim() ||
      !nameData.current.value.trim()
    ) {
      setMessage("All fields are required ");
      return;
    }
    if (!emailPattern.test(emailData.current.value.trim())) {
      setMessage("Invalid mail Pattern");
      return;
    }

    const data = {
      email: emailData.current.value,
      password: passwordData.current.value,
      name: nameData.current.value,
    };
    async function registerUser() {
      try {
        const response = await fetch(`${API}/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),

        });
        const result = await response.json();
        setMessage(result["message"]);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    registerUser();
  };

  const HandleLogin = (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EmailData.current.value.trim() || !PasswordData.current.value.trim()) {
      setMessage("All fields are required!. ");
      return;
    }
    if (!emailPattern.test(EmailData.current.value.trim())) {
      setMessage("Invalid mail Pattern");
      return;
    }

    const data = {
      email: EmailData.current.value,
      password: PasswordData.current.value,
    };

    async function HandleLoignBackend() {
      try {
        const response = await fetch(`${API}/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.message !== "Login successful") {
          setMessage(result.message);
          return;
        }
        setRegisterCheck(false);
        window.localStorage.setItem('access',result.access)
        setMessage("Login successful");
        handleImageUpdation(result.profile_pic);
      } catch (error) {
        console.error(error);
      }
    }

    HandleLoignBackend();
  };

  return (
    <div className="RegisterFormSection">
      <div className="line" onClick={HandleBack}>
        <FaArrowLeft />
      </div>
      <div className="Forms">
        {ActivateForm && (
          <form className="RegistrationFrom">
            <h3>Registration Form</h3>
            <div className="formRow">
              <div className="formLabel">
                <label htmlFor="">Name:</label>
              </div>

              <input
                type="text"
                placeholder="Enter Name"
                ref={nameData}
                onChange={handleChange}
              />
            </div>
            <div className="formRow">
              <div className="formLabel">
                <label htmlFor="">Email:</label>
              </div>
              <input
                type="text"
                placeholder="Enter Email"
                ref={emailData}
                onChange={handleChange}
              />
            </div>
            <div className="formRow">
              <div className="formLabel">
                <label htmlFor="">Password:</label>
              </div>
              <input
                type="password"
                placeholder="Enter Password"
                ref={passwordData}
                onChange={handleChange}
              />
            </div>
            <h5
              style={
                Message === "Successfully registered"
                  ? { color: "green" }
                  : { color: "red" }
              }
            >
              {Message}
            </h5>
            <button onClick={HandleRegistration} className="button">
              Register
            </button>

            <p>
              Already have an Account ?{" "}
              <span
                onClick={() => {
                  setActivateForm(false);
                  handleChange();
                }}
              >
                Login
              </span>
            </p>
          </form>
        )}
        {ActivateForm == false && (
          <form className="LoginFrom">
            <h3>Login Form</h3>
            <div className="formRow">
              <div className="formLabel">
                <label htmlFor="">Email:</label>
              </div>
              <input
                type="text"
                placeholder="Enter Email"
                onChange={handleChange}
                ref={EmailData}
              />
            </div>
            <div className="formRow">
              <div className="formLabel">
                <label htmlFor="">Password:</label>
              </div>
              <input
                type="password"
                placeholder="Enter Password"
                onChange={handleChange}
                ref={PasswordData}
              />
            </div>
            <h6
              style={
                Message === "Login successful"
                  ? { color: "green" }
                  : { color: "red" }
              }
            >
              {Message}
            </h6>
            <button onClick={HandleLogin} className="button">
              Login
            </button>

            <p>
              Dont you Have An Account ?{" "}
              <span
                onClick={() => {
                  setActivateForm(true);
                  handleChange();
                }}
              >
                Register
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterSection;
