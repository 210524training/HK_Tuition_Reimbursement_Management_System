import React, { Dispatch, SetStateAction, useState } from 'react';
import User from '../../models/user';
import RegisterForm from '../register-form/RegisterForm';
import SignInForm from '../sign-in-form/SignInForm';
import "./SignInRegisterContainer.styles.css";

type Props = {
  currentUser: User | undefined;
  setCurrentUser: Dispatch<SetStateAction<undefined | User>>;
}

const SignInRegisterContainer: React.FC<Props>  = ({ setCurrentUser, currentUser }) => {

  const [showRegister, toggleRegister] = useState(false)

  return (
    <>
    <div className="container">
      <div className="jumbotron col-md-4">
        {
        showRegister ? 
        <RegisterForm showRegister ={showRegister} toggleRegister={toggleRegister} /> : 
        <SignInForm showRegister ={showRegister} toggleRegister={toggleRegister} setCurrentUser={setCurrentUser} currentUser={currentUser} />
        }
      </div>
    </div>
    </>
    
  )
}

export default SignInRegisterContainer;