import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth'
import { auth, db } from '../../firebaseConnection'
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
} from 'firebase/firestore'

export default function Admin() {
    const [tarefaInput, setTarefaInput] = useState('')
    const [user, setUser] = useState({})
    const [tarefas, setTarefas] = useState([])
    const [updateTarefas, setUpdateTarefas] = useState({})
    const textareaRef = useRef(null)

    //verifica o textarea e cadastra tarefa no banco
    async function handleRegister(e){
        e.preventDefault()

        if(tarefaInput.trim() === ''){
            alert('Preencha todos os campos!')
            return
        }
        
        if(updateTarefas?.id){
            handleUpdateTarefa()
            return
        }

        await addDoc(collection(db, 'tarefas'), {
            //campos a serem cadastrados
            userUid: user?.uid,
            createdAt: new Date(),
            tarefa: tarefaInput.trim()
        })
        .then(()=>{
            setTarefaInput('')
            setUpdateTarefas('')
        })
        .catch((error)=>{
            alert('Erro ao adicionar tarefa!', error)
        })

    }

    //deleta a tarefa
    async function handleDelete(id){
        const docRef = doc(db, 'tarefas', id)
        await deleteDoc(docRef)
        .then(()=>{
                setTarefas(tarefas.filter(tarefa => tarefa.id!== id))
            })
        .catch((error)=>{
                alert('Erro ao deletar tarefa!', error)
            })
    }

    //atualiza uma tarefa
    function handleUpdate(item){
        setTarefaInput(item.tarefa)
        setUpdateTarefas(item)
    }

    async function handleUpdateTarefa(){
        const docRef = doc(db, 'tarefas', updateTarefas?.id)
        await updateDoc(docRef, {
            tarefa: tarefaInput.trim()
        })
        .then(()=>{
            setTarefaInput('')
            setUpdateTarefas({})
        })
        .catch((error)=>{
            setTarefaInput('')
            setUpdateTarefas({})
            alert('Erro ao atualizar tarefa!', error)
        })
    }

    //desloga o usuário
    async function handleLogout() {
        await signOut(auth);
    }

    //se clicar enter no textarea ativa o botão e cadastra tarefa
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Para evitar a quebra de linha padrão do Enter no textarea
            document.getElementById('btn-add').click()
        }
    }

    useEffect(()=>{ 
        //carrega as tarefas quando a aplicação é montada
        async function loadTarefas(){
            const userDatail = localStorage.getItem('@detailUser')
            setUser(JSON.parse(userDatail))

            if(userDatail){
                const data = JSON.parse(userDatail)

                const tarefaRef = collection(db, 'tarefas')
                //organiza as tarefas pela data de criação (createdAt) de forma decrescente (desc)
                //e filtra pelo userUid (where('userUid', '==', data?.uid))
                const q = query(tarefaRef, orderBy('createdAt', 'desc'), where('userUid', '==', data?.uid))

                const onsub = onSnapshot(q, (snapshot) => {
                    let lista = []
                    //percorre a lista de documentos e adiciona à lista[]
                    snapshot.forEach((doc)=>{
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })
                    onsub()
                    setTarefas(lista)
                    
                })
            }
        }

        loadTarefas()
    }, [tarefas, updateTarefas])

return (
    <main id='admin'>
        <h1>Minhas Tarefas</h1>
        <form onSubmit={handleRegister} name='formTarefas' id='formTarefas'>
            <textarea
            value={tarefaInput}
            onChange={(e) => setTarefaInput(e.target.value)}
            placeholder='Digite suas tarefas aqui...'
            ref={textareaRef}
            onKeyDown={handleKeyDown} 
            />

            {
                (Object.keys(updateTarefas).length > 0 )
                ? (<button type='submit' id='btn-add' className='btn-update-tarefa' onClick={handleRegister}>Atualizar</button>)
                : (<button type='submit' id='btn-add' onClick={handleRegister}>Adicionar</button>)
            }

        </form>

        {tarefas.map((item)=>(
            <article key={item.id}>
                <div className='tarefa'>
                    <p className='content'>{item.tarefa}</p>
                    <div className='btn-ud-container'>
                        <button className='btn-update' onClick={()=> handleUpdate(item)}>update</button>
                        <button className='btn-complete' onClick={()=> handleDelete(item.id)}>complete</button>
                    </div>
                </div>
            </article>
        ))}

        <button className='btn-logout' onClick={handleLogout}>Sair</button>
    </main>
);
}