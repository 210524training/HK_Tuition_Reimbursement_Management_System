import React, { Dispatch, SetStateAction } from "react";
// import { Form, Button } from "react-bootstrap";
import RegisterButton from "../register-button/RegistorButton";

type Props = {
  toggleRegister: Dispatch<SetStateAction<boolean>>
  showRegister: boolean
}

const RegisterForm: React.FC<Props> = ({ toggleRegister, showRegister }) => {
  return (
    <>
      <div>
        <h2>Register</h2>
        <form>
          <input type = "text" placeholder="formUsername">
            <form>Username</form>
            <input type="text" placeholder="My Name" />
          </input>
          <input type="formBasicEmail">
            <form>Email</form>
            <input type="email" placeholder="username@trms.mail" />
          </input>
          <input type="formBasicPassword">
            <form>Password</form>
            <input type="password" placeholder="My Password" />
          </input>
          <button type="submit">
            Submit
          </button>
          <RegisterButton showRegister ={showRegister} toggleRegister={toggleRegister} />
        </form>
      </div>
    </>
  )
}

export default RegisterForm;