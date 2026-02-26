import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './components/MainLayout'
import { HomePage } from './pages/HomePage'
import NewProductPage from './pages/admin/NewProductPage'
import AdminPage from './pages/admin/AdminPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import ProductPage from './pages/ProductPage'
import ProductGalery from './components/product/ProductGalery'
import NotFoundPage from './pages/NotFoundPage'
import NewCategoryPage from './pages/admin/NewCategoryPage'
import AdminPageLayout from './components/AdminPageLayout'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AllProductsPage from './pages/AllProductsPage'

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path='/' element={<MainLayout />} >
                <Route index element={<HomePage />} />

                <Route path='/products' element={<AllProductsPage />} />

                <Route path='/products/:id'>
                    <Route index element={<ProductPage />} />
                    <Route path='images' element={<ProductGalery />} />
                </Route>
            </Route>

            {/* Not found route */}
            <Route path='/404' element={<MainLayout />} >
                <Route index element={<NotFoundPage />} />
            </Route>

            {/* Admin routes */}
            <Route path='/administracion' element={<AdminPageLayout />} >
                <Route index element={<AdminPage />} />
                <Route path='products' element={<AdminProductsPage />} />
                <Route path='new' element={<NewProductPage />} />
                <Route path='categories' element={<AdminCategoriesPage />} />
                <Route path='new-cat' element={<NewCategoryPage />} />
            </Route>

            <Route path='/*' element={<Navigate to='/' />} />
        </Routes>
    )
}

export default App
