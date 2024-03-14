import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

export default function Home(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function handleLogin(e){
        e.preventDefault()
        let redirect = true
        
        if(!email.includes('@') || email.length <= 9) {
            document.getElementById('email').style.border = '1px solid red'
            redirect = false
        }

        if(password.length < 6) {
            document.getElementById('password').style.border = '1px solid red'
            redirect = false
        }

        if(redirect){
            await signInWithEmailAndPassword(auth, email, password)
            .then(()=>{
                navigate('/admin', { replace: true })
            })
            .catch((error)=>{
                alert('Erro ao logar, tente novamente! ', error)
            })
        }else{
            alert('Por favor, preencha todos os campos corretamente!')
        }
        
    }

//Se não estiver logado, redireciona para a página de login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                //se tem algum usuário logado entra aqui
                navigate('/admin', { replace: true })
            }
        });
        
        return () => unsubscribe();
    }, []);

    return(
        <main id="home">

        <h1>To-Do List</h1>

            <form className='form' onSubmit={handleLogin}>

                <span>Gerencie sua agenda de forma fácil</span>

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

                <button type='submit'>Login</button>
                <span className='switch'>Ainda não possui uma conta?</span>
                <Link to='/register' className='link'>Cadastre-se</Link>
            </form>
        </main>
    )
}