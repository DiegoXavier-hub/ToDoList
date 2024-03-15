import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConnection'
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

export default function Private({children}){
    const [loading, setLoading] = useState(true)
    const [signed, setSigned] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        async function checkLogin(){

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email
                    }

                    localStorage.setItem('@detailUser', JSON.stringify(userData))

                    setLoading(false)
                    setSigned(true)
                }
                if (!user) {
                    setLoading(false)
                    setSigned(false)
                }
            });
        }

        checkLogin()
    }, [])

    if(loading){
        return(
            <span className="loader"></span>
        )
    }

    if(!signed){
        navigate('/', { replace: true })
        return
    } else {
        return children
    }
    
}