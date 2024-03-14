import React, { useState, useEffect } from 'react';
import {onAuthStateChanged, signOut} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebaseConnection'

export default function Admin() {
    const navigate = useNavigate()

    async function Logout() {
        await signOut(auth);
        navigate('/', { replace: true })
    }

return (
    <main id='admin'>
        <h1>Admin</h1>
        <button onClick={Logout}>Logout</button>
    </main>
);
}