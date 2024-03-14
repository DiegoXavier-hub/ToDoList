import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebaseConnection'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

export default function Register(){
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function handleRegister(e){
        e.preventDefault()
        let redirect = true
        
        if(nome.length <= 3) {
            document.getElementById('nome').style.border = '1px solid red'
            redirect = false
        }

        if(!email.includes('@') || email.length <= 9) {
            document.getElementById('email').style.border = '1px solid red'
            redirect = false
        }

        if(password.length < 6) {
            document.getElementById('password').style.border = '1px solid red'
            redirect = false
        }

        if(redirect){
            await createUserWithEmailAndPassword(auth, email, password)
            .then(()=>{
                navigate('/admin', { replace: true })
            })
            .catch((error)=>{
                switch(error.code){
                    case 'auth/weak-password':
                        alert('Senha fraca, tente uma senha mais forte')
                        break;
                    case 'auth/invalid-email':
                        alert('Email inválido')
                        break;
                    case 'auth/email-already-in-use':
                        alert('Este email já está em uso')
                        break;
                    default:
                        alert('Ocorreu um erro ao cadastrar')
                        break;
                }
            })
        }else{
            alert('Por favor, preencha todos os campos corretamente!')
        }
        
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                //se tem algum usuário logado entra aqui
                navigate('/admin', { replace: true })
            }
            });
    
            return () => unsubscribe();
    },[]);

    return(
        <main id="register">

        <h1>Cadastre-se</h1>

            <form className='form' onSubmit={handleRegister}>

                <span>Vamos criar sua conta, tão rapido quanto o Flash</span>

                <span>
                    <label htmlFor='nome'>nome:</label>
                    <input
                    type="text"
                    placeholder= 'Fulano de tal'
                    id='nome'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    >
                    </input>
                </span>

                <span>
                    <label htmlFor='email'>email:</label>
                    <input
                    type="text"
                    placeholder='exemplo@email.com'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    >
                    </input>
                </span>

                <span>
                    <label htmlFor='password'>Password:</label>
                    <input
                    autoComplete='off'
                    type="password"
                    placeholder='********'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    >
                    </input>
                </span>

                <button type='submit'>Cadastre-se</button>
                <span className='switch'>Já possui uma conta?</span>
                <Link to='/' className='link'>Login</Link>
            </form>
        </main>
    )
}