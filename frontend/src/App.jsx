import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './components/MainLayout'
import { HomePage } from './pages/HomePage'
import NewProductPage from './pages/NewProductPage'
import AdminPage from './pages/AdminPage'

function App() {
    return (
        <Routes>
            <Route path='/' element={<MainLayout />} >
                <Route index element={<HomePage />} />
                <Route path='new' element={ <NewProductPage /> } />
                <Route path='administracion' element={ <AdminPage /> } />
            </Route>

            <Route path='/*' element={<Navigate to='/' />} />
        </Routes>
    )
}

export default App
