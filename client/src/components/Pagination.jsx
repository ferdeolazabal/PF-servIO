import React, {useState, useEffect} from "react";
import './styles/pagination.css'
// import s from './styles/pa'
import {changeSwitch} from '../redux/actions'
import {useDispatch} from 'react-redux'

import { useGlobalStorage } from "../hooks/useGlobalStorage";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {

  const pageNumbers = [];
  const [state, setstate] = useState("professional")
  const [switcheo, setSwitcheo] = useGlobalStorage("switcheo", "professional")
  const dispatch = useDispatch()

  const [ login ] = useGlobalStorage("globalUser", "")

  useEffect(() => {
      // if (!login) {
      //   setSwitcheo("professional")
      // } else if(login.professional){
      //   setSwitcheo("user")
      // }
    }, [])

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  function moodRender(e){
    if(e === 'btnradio2') {
      dispatch(changeSwitch(true))
      setSwitcheo('professional')
      setstate('professional')
    } 
    if (e === 'btnradio1') {
      dispatch(changeSwitch(false))
      setSwitcheo('user')
      setstate('user')
    }
  }

  return (
    <div className='pagination'>
      {
        (login && login.professional) ? (
          <>
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
              <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" onClick={(e) => moodRender(e.target.id)} checked={switcheo === 'professional'} />
              <label class="btn btn-outline-info" for="btnradio2">Profesionales</label>

              <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" onClick={(e) => moodRender(e.target.id)} checked={switcheo === 'user'} />
              <label class="btn btn-outline-info" for="btnradio1">Usuarios</label>
            </div>
          </>
        ):<></>
      }
      
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li className="page-item" key={number}>
              <a
                onClick={() => paginate(number)}
                className="page-link"
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
