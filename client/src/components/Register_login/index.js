import React from 'react';
import MyButton from '../utils/button';
import Login from './login';

const RegisterLogin = () => {
    return (
        <div className='page_wrapper'>
            <div className="container">
                <div className="register_login_container">
                    <div className="left">
                        <h1>New Customer</h1>
                        <p>WORDS</p>
                        <MyButton
                            type="default"
                            title="Create an account"
                            linkTo="/register"
                            addStyles={{
                                margin: '10px 0 0 0'
                            }}
                        />
                    </div>
                    <div className="right">
                            <h2>Registered Customer</h2>
                            <p>If you have an account log in</p>
                            <Login/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLogin;