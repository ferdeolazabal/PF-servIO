import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import axios from 'axios'
import logo from '../img/ServIO.svg';

import { useDispatch, useSelector } from 'react-redux';

import s from './styles/Login.module.css'
import { userLogin } from '../redux/actions';
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Login() {
  const [globalUser,setGlobalUser ] = useGlobalStorage("globalUser", "")
    const user = useSelector(state => state.user)
    const loginDetail = useSelector(state => state.loginDetail)
    const navigate = useNavigate()
    const [ input, setInput ] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch()

    const [errors, setErrors] = useState({});
    // const [, setGlobalUser] = useGlobalStorage("globalUser", "");
    const [localUser, setLocalUser] = useLocalStorage("localUser", "");
    const [, setSwitcheo] = useGlobalStorage("switcheo", "")
    const validate = (input) => {
        let errors = {};
        if (!input.email) {
            errors.email = 'e-mail is required';
        } else if (!/\S+@\S+\.\S+/.test(input.email)) {
            errors.email = 'e-mail is invalid';
        };

        if (!input.password) {
            errors.password = 'Password is required';
        } else if (!/(?=.*[0-9])/.test(input.password)) {
            errors.password = 'Password is invalid';
        }
        return errors;
    };

    const handleInputChange = function(e) {
        
        let objError = validate({
            ...input,
            [e.target.name]: e.target.value
        });
    
        setErrors(objError);
    
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const validate = await axios.post('http://localhost:3001/user/login', input)
            if(validate) {
                await setGlobalUser(validate.data.data)
                await setLocalUser(validate.data.data)

                if(globalUser.professional) {
                    setSwitcheo("user")
                } else {
                    setSwitcheo('professional')
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Logged in',
                    showConfirmButton: false,
                    timer: 2500
                })
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                showConfirmButton: false,
                timer: 2500
            })
        }
    }

    const googleLog = async () => {
      try {
        let result= await axios.get('http://localhost:3001/user/getUser')
        // console.log('resulllt', result.data[0])
        await setGlobalUser(result.data[0].data)
        await setLocalUser(result.data[0].data)
        if(localUser) {
          Swal.fire({
              icon: 'success',
              title: 'Logged in',
              showConfirmButton: false,
              timer: 2500
          })
          navigate('/')
      }
      } catch (error) {
          console.log('errorrrrrr', error)
      }
    }
    
    useEffect(() => {
      googleLog()
    },[])

    return (
        <div className={ s.login_master }>
          {/* {
            globalUser !== '' ? 
              <> */}
                <div className={ s.login_form }>
                    <form onSubmit={ handleSubmit } >
                    <div className={ s.login_logo}><img src={ logo } alt="logo"/></div>

                        <div className="row mb-2">
                            <input 
                                className={`form-control && ${errors.email && 'danger'}`}
                                type="text"
                                name="email"
                                placeholder="Email"
                                onChange={handleInputChange}
                                autoComplete='off'
                            />
                            {errors.email && (<p className="danger">{errors.email}</p>)}
                            <label 
                                className="form-label" 
                                // for="form<2Example1"
                            >
                            </label>
                        </div>

                        <div className="row mb-2">
                            <input
                                className={`form-control && ${errors.password && 'danger'}`}
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={input.password}
                                onChange={handleInputChange} 
                            />
                            <label 
                                className="form-label" 
                            >
                            </label>
                        </div>

                        <div className="row mb-2">
                            <div className="col d-flex justify-content-center">
                                <div className="form-check">
                                    {/* <input
                                        className="form-check-input"
                                        type="checkbox"
                                        // value={false}
                                        id="form2Example34"
                                    /> */}
                                    {/* <label 
                                        className="form-check-label" 
                                        checked autoComplete="off"
                                    >
                                    Recordar mi sesión
                                    </label> */}
                                </div>
                            </div>

                        <div className="row mb-3">
                            {/* <div className="col d-flex justify-content-center">
                                <a href="#!">¿Olvidaste tu contraseña?</a>
                            </div> */}
                        </div>
                        </div>

                        <div className="row mb-1">
                            <button 
                                type="submit" 
                                className = "btn btn-primary mx-auto block mb-4"
                            >
                                Iniciar sesión
                            </button>
                        </div>

                        <div className="text-center row mb-1">
                            <p>¿Aún no te registrado? <a href="/register">Registrate!</a></p>
                            <p>¿Olvidaste tu contraseña? <a href="/forget-password">Recuperala!</a></p>
                            <p>O inicia con:</p>

                            <a 
                                type="button"
                                className="btn btn-lg btn-google  text-uppercase btn-outline col-lg-4" href="http://localhost:3001/user/auth/google">
                                <img src="https://img.icons8.com/color/40/000000/google-logo.png" alt="google"/> 
                            </a>
                            <a 
                                type="button"
                                className="btn btn-lg btn-github text-uppercase btn-outline col-lg-4" href="http://localhost:3001/user/auth/github">
                                <img src="https://img.icons8.com/material-rounded/48/000000/github.png" alt='github'/>
                            </a>
                            {/* <a 
                                type="button"
                                className="btn btn-lg btn-facebook text-uppercase btn-outline col-lg-4" href="http://localhost:3001/user/auth/facebook">
                                <img src="https://img.icons8.com/fluency/48/000000/facebook.png" alt='facebook'/>
                            </a> */}
                        </div>

                    </form>
                </div>
                <div className={ s.login_image }></div>
                {/* </> 
              :
                window.location.assign("/")
          } */}
        </div>  
    )
}