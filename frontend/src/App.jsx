import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './components/MainLayout'
import { HomePage } from './pages/HomePage'
import NewProductPage from './pages/admin/NewProductPage'
import AdminPage from './pages/admin/AdminPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import ProductPage from './pages/ProductPage'
import ProductGalery from './components/product/ProductGalery'
import NotFoundPage from './pages/NotFoundPage'

function App() {
    return (
        <Routes>
            <Route path='/' element={<MainLayout />} >
                <Route index element={<HomePage />} />
                
                <Route path='/products/:id'>
                    <Route index element={ <ProductPage /> } />
                    <Route path='images' element={ <ProductGalery /> } />
                </Route>

                <Route path='/administracion'>
                    <Route index element={ <AdminPage /> } />
                    <Route path='products' element={ <AdminProductsPage /> } />
                    <Route path='new' element={ <NewProductPage /> } />
                </Route>

                <Route path='/404'>
                    <Route index element={ <NotFoundPage /> } />
                </Route>
            </Route>

            <Route path='/*' element={<Navigate to='/' />} />
        </Routes>
    )
}

export default App
