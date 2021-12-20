import React, {useEffect, useState} from 'react';
import s from './styles/EditUser.module.css';
import {useGlobalStorage} from '../hooks/useGlobalStorage';
import { useDispatch, useSelector } from "react-redux";
import { getByUserId, filterProfessions } from '../redux/actions';
import axios from 'axios';

export default function EditCliente() {

    const [globalUser, setGlobalUser] = useGlobalStorage("globalUser", "");
    const login = !localStorage.getItem ? null: JSON.parse(localStorage.getItem("user"))
    const dispatch = useDispatch();
    const[errors, setErrors] = useState({});
    const [buttonSubmit, setbuttonSubmit] = useState(false)
    const oficio = useSelector((state) => state.professionsName)
    const [profession, setProfession] = useState([])

    const [details, setDetails] = useState({
        firstName: globalUser.first_name,
        lastName: globalUser.last_name,
        email: globalUser.email,
        professional: globalUser.professional,
        professionalCase:false,
        profession:profession.toString(),
    })

    console.log('profecional: ', globalUser.professional)
    useEffect(() => {
        dispatch(getByUserId(login?.id))  
        dispatch(filterProfessions (oficio))      
    },[])
    
    
    function validate(valores){
        let errores = {};
        
        //validacion nombre
        console.log('error: ',valores)
        if(!valores.firstName) {
            errores.firstName = 'Por favor ingresa tu nombre'
        }else if(!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.firstName)){
            errores.firstName= 'El nombre solo puede contener letras y espacios'
        }

        return errores;
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const err = validate(details)

        setErrors(err)

        try{
            let prof= profession.toString()
            let newData= {
                firstName:details.firstName,
                lastName: details.lastName,
                email: details.email,
                dni:details.dni,
                password:details.password,
                professional: details.professional,
                profession:prof,

            }
            await axios.put(`http://localhost:3001/user/updateUser/101`, newData)
            setGlobalUser({
                ...globalUser,
                first_name:details.firstName,
                last_name: details.lastName,
                email: details.email,
                dni:details.dni,
                password:details.password,
                rofessional: details.professional,
                
            })
        }catch(e){
            console.log(e)
        }
    }

    function handleChange(e){
        setDetails({
            ...details,
            [e.target.name] : e.target.value
            
        })
        setErrors(
            validate(errors)
        )
        
    }

    function handleCheck(e){
        console.log(details.professionalCase)
        if (e.target.id === 'checkboxClient') {
            setDetails({
                ...details,
                professionalCase:false,
                professional:"false",
                profession: []
            })
        } else {
            setDetails({
                ...details,
                professionalCase:true,
                professional:"true",
            })
        }
    } 

    function onClick(e){
        if(profession.indexOf(details.profession) === -1 && details.profession !== ''){
        setProfession([...profession, details.profession])
        }
    }
    function changeCountry(event){
        setDetails({...details, profession: event.target.value})
    }  
    function onClose(e){
        let index = profession.indexOf(e.target.value)
        setProfession([...profession.slice(0, index).concat(...profession.slice(index+1, profession.length))])
        setDetails({
            ...details,
            profession: details.profession + e.target.id + ","
        })
    }
    
    return (
        <div className={s.container}>
            <div className={ s.container_img}>
                <p>
                    Sé parte de nuestra plataforma, registrate ya y disfruta!
                </p>
            </div>
            <div className={ s.container_edilt}>
                <div className={s.container_edilt_titulo}>
                    <h2>Edita tu perfil</h2>
                </div>
            <form className={s.container_edilt_form} onSubmit={(e) => handleSubmit(e)}>
                <div className={s.container_edilt_form_input}>
                    <label >Nombre: </label>
                    <input 
                        type="text"  
                        name="firstName"
                        value={details.firstName}
                        onChange={(e) => handleChange(e)}
                    />
                    {!errors.name && (
                        <p>{errors.firstName}</p>
                    )}
                </div>
                <div className={s.container_edilt_form_input}>
                    <label >Apellido: </label>
                    <input 
                        type="text"  
                        name="lastName"
                        value={globalUser.last_name}
                        onChange={(e) => handleChange(e)}
                    />
                    {/* {!errors.name && (
                        <p >{errors.lastName}</p>
                    )} */}
                </div>
                <div className={s.container_edilt_form_input}>
                    <label >Correo: </label>
                    <input 
                        type='email' 
                        name='email'
                        value={globalUser.email}
                        onChange={(e) => handleChange(e)}
                    />
                    {/* {errors.email && (
                        <p>{errors.email}</p>
                    )} */}
                </div>
                <div className={s.container_edilt_form_input}>
                    <label>DNI:</label>
                    <input 
                        type='text'
                        name='dni'
                        readonly
                        />
                </div>
                <div className={s.container_edilt_form_input}>
                <label>Password:</label>
                    <input 
                        type='password'
                        name='password'
                        // onChange={(e) => handleChange(e)}
                    />
                    {/* {errors.password && (
                        <p>{errors.password}</p>
                    )} */}
                </div>
                <div className={s.container_edilt_form_input}>
                    <label>Repeat Password:</label>
                    <input 
                        type='password'
                        name='repeatPassword'
                        // onChange={(e) => handleChange(e)}
                    />
                    {/* {errors.repeatPassword && (
                        <p>{errors.repeatPassword}</p>
                    )} */}
                </div>
                <div className={s.container_edilt_form_input}>
                    <label >Teléfono: </label>
                    <input 
                        type="text"  
                        name="phone"
                        // onChange={(e) => handleChange(e)}
                    />
                    {/* {errors.photo && (
                        <p>{errors.photo}</p>
                    )} */}
                </div>

                <div className={s.container_edilt_form_input_img} >
                    <label for="imageFile">Selecciona alguna imágen (png):</label><br/>
                    <div className={s.div_file}>
                        <p className={s.text}>Elegir archivo</p>
                        <input className={s.btn_enviar} 
                            type="file"  
                            accept=".png" 
                            multiple
                            // onChange={(e) => handleChange(e)}
                        /> 
                    </div>
                </div>

                {
                    globalUser.professional ?
                    
////////----------------------- edit Profesional -------------------- 

                    <div className={s.subDiv}>
                        <label for="countries">Seleccona tu Oficio:</label>
                        <div>
                            <select 
                            className={s.inputClass3}
                            onChange={changeCountry}
                            value={details.profession}
                            >
                            <option >{details.profession}</option>
                            {oficio.map(e => {
                                return (<option >{e}</option>)
                            })
                            }
                            </select>
                            <input 
                            onClick={onClick} 
                            className={s.btnAdd} 
                            type="button" 
                            value="+" 
                            />
                        </div>
                        <div className={s.countriesDiv}>

                            {
                            profession.map(e => {
                                return(
                                <input type="button" value={e} className={s.countryBtn}  onClick={onClose} />
                                )
                                
                                })}
                        </div>
                        <div>
                            <label>Dar de baja como profesional:<input
                            type='checkbox'
                            id="checkboxClient"
                            checked={!details.professionalCase}
                            value='cliente'
                            onChange={(e) => handleCheck(e)}
                        /></label>    
                        </div>
                    </div>

                    :

//////--------------------- edit de cliente -------------------------------

                    <div className={s.container_edilt_form_pofcional}>
                        <label>Dar de alta como profecional:<input
                                type='checkbox'
                                value={globalUser.professional}
                                checked={details.professionalCase}
                                onChange={(e) => handleCheck(e)}
                        /></label>
                        <div className={s.subDiv}>
                            <label for="countries">Seleccona tu Oficio:</label>
                            <div>
                                <select 
                                className={s.inputClass3}
                                onChange={changeCountry}
                                value={details.profession}
                                >
                                <option >Elige tu profesión</option>
                                {oficio.map(e => {
                                    return (<option >{e}</option>)
                                })
                                }
                                </select>
                                <input 
                                onClick={onClick} 
                                className={s.btnAdd} 
                                type="button" 
                                value="+" 
                                />
                            </div>
                            <div className={s.countriesDiv}>

                                {
                                profession.map(e => {
                                    return(
                                    <input type="button" value={e} className={s.countryBtn}  onClick={onClose} />
                                    )
                                    
                                    })}
                            </div>
                        </div>
                        
                    
                </div>

                }

                <div >
                    <p>Reguerdas que los campos que no edites nada no se  van a cambian, lo unico que no se 
                    va a poder editar es el DNI.</p>  
                </div>
                
                <button type='submit'id='buttonSubmit' className={"btn btn-success " + s.buttonSubmit} >Cambiar Perfil</button>
            </form>
            </div>
        </div>
    )
}
