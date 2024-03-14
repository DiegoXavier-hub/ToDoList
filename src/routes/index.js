import { Routes, Route} from 'react-router-dom'
import Private from './Private'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Admin from '../pages/admin'

function RoutesApp() {
    return(
        <Routes>
            <Route path="/" element={ <Home/> }/>
            <Route path="/register" element={ <Register/> }/>

            <Route path='/admin' element={ <Private><Admin/></Private> }/>
        </Routes>
    )
}

export default RoutesApp