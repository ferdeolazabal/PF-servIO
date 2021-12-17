import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { showFormProfessionalOffer } from '../redux/actions'
import Swal from 'sweetalert2'
import s from './styles/ProfessionalServiceOffer.module.css'


export const ProfessionalServiceOffer = () => {
    
    const modal = useSelector(state => state.modalProfessionalsOffer)
    
    const user = !localStorage.getItem ? null: JSON.parse(localStorage.getItem("user"))

    const [form, setform] = useState({
        // categoria: '', // sugerencia para agregar categoria de servicio ofrecido y no en el registro
        name: "",
        description: "", // no esta en la base de datos
        photo: "",
        materials: "", // boolean
        price: "",
        guarantee: "",  // no esta en la base de datos
        guarantee_time: "", // no esta en la base de datos
        job_time: "",  // días
        professionalId: "",
        
    })

    function onChangeForm(e) {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const postNeed = async (e) =>{
        e.preventDefault()
        try {

            
            // const post = await axios.post('http://localhost:3001/clientNeeds', obj)
            // .then(() => {

                const fondo = document.getElementById("fondo-form-Professional-offer")
                fondo.style.top = "-100vh"
                
                Swal.fire({
                    icon: 'success',
                    title: 'Publicacion creada!',
                    showConfirmButton: false,
                    timer: 1500
                })
            // })
            // console.log('post',post)

        } catch (error) {
            console.error("message: ", error)
        }
    }

    const dispatch = useDispatch()

    useEffect(() => {
        if (modal === "show") {
            const fondo = document.getElementById("fondo-form-Professional-offer")
            fondo.style.top = "0px"
        } else if("notshow") {
            const fondo = document.getElementById("fondo-form-Professional-offer")
            fondo.style.top = "-100vh"
        }
    }, [modal])

    function hideFormProfessionalOffer(){
        dispatch(showFormProfessionalOffer("notshow"))
    };
    
    // name: "",
    // description: "", // no esta en la base de datos
    // photo: "",
    // materials: "", // boolean
    // price: "",
    // guarantee: "",  // no esta en la base de datos
    // guarantee_time: "", // no esta en la base de datos
    // job_time: "",  // días
    // professionalId: "",

return (
    <>
    <div id='fondo-form-Professional-offer' className={s.container}>
        <div className={s.container_background} onClick={hideFormProfessionalOffer}></div>
        <div className={s.container_form}>
            <form onSubmit={postNeed} action="">
                <div className="row mb-4">
                <div>
                    <div className={"col" && s.container_filter}>
                        <div className="input-group mb-1">
                        <h1 className="me-3">Ofrecé tu servicio</h1>
                            <input
                                type="text"
                                name='name'
                                value={ form.name }
                                onChange={ onChangeForm }
                                className="form-control"
                                aria-label="Default" aria-describedby="inputGroup-sizing-default"
                                placeholder="Escribe aquí el título del servicio"
                            />
                        </div>

                        <div className="form-group mt-2 mb-2">
                            <label
                                for="exampleFormControlTextarea1">
                                Descripción del servicio
                            </label>
                            <textarea
                                type='text'
                                name='description'
                                value={ form.description }
                                onChange={ onChangeForm }
                                className="form-control z-depth-1"
                                id="exampleFormControlTextarea1"
                                rows="3"
                            >
                            </textarea>
                        </div>

                        <div className="col input-group mb-2 pt-3 pb-3">
                            <div className="me-5">
                                ¿Incluye Garantia?   {`    `}
                                <input
                                    className="input"
                                    type="radio" 
                                    value="yes" 
                                    name="materials"
                                    onChange={ e=> onChangeForm(e) }
                                /> Si {`    `}
                                <input
                                    className="input"
                                    type="radio" 
                                    value="no" 
                                    name="materials"
                                    onChange={ e=> onChangeForm(e) }
                                /> No {`    `}
                            </div>
                            <div className="me-2">
                                ¿Incluye material? {`    `}   
                                <input
                                    className="input"
                                    type="radio" 
                                    value="yes" 
                                    name="materials"
                                    onChange={ e=> onChangeForm(e) }
                                    /> Si {`    `}
                                <input
                                    className="input"
                                    type="radio" 
                                    value="no" 
                                    name="materials"
                                    onChange={ e=> onChangeForm(e) }
                                    /> No {`    `}
                            </div>
                        </div>

                        {/* <div className="row mb-4"> */}
                            <div className="col">
                            <div className="form-outline">
                            {/* <span>dias de garantia</span> */}
                                <input
                                    type="number"
                                    name='guarantee_time'
                                    value={ form.guarantee_time }
                                    onChange={ onChangeForm }
                                    className="col form-control me-2"
                                    aria-label="Default" aria-describedby="inputGroup-sizing-default"
                                    placeholder="Días de garantíaaa"
                                />
                            </div>
                            <div className="form-outline">
                            <div className="col">
                            {/* <span>dias de trabajo</span> */}
                                <input
                                    type="number"
                                    name='guarantee_time'
                                    value={ form.guarantee_time }
                                    onChange={ onChangeForm }
                                    className="col form-control me-2"
                                    aria-label="Default" aria-describedby="inputGroup-sizing-default"
                                    placeholder="Días estimados de trabajo"
                                    />
                            </div>
                            </div>
                            </div>
                        {/* </div> */}

                        <div className="col input-group mt-2 mb-2">
                            <span class="input-group-text">$</span>
                            <input
                                type="number"
                                name='price'
                                value={ form.price }
                                onChange={ onChangeForm }
                                className="form-control"
                                aria-label="Dollar amount (with dot and two decimal places)" aria-describedby="inputGroup-sizing-default"
                                placeholder="Ingresa un precio"
                                />
                        </div>

                    </div>
                    <button
                        type="submit"
                        className={ "btn btn-primary btn-lg btn-block mt-4"}
                        >
                        Crear Actividad
                    </button>
                </div>
                </div>
            </form>
        </div>

    </div>

    </>
        
)
}
