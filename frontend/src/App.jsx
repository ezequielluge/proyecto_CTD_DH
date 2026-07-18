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
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'

import { ROUTES } from './config/paths'
import { ROLES } from './config/roles'
import UnauthorizedPage from './pages/UnauthorizedPage'

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path='' element={<MainLayout />} >
                <Route index element={<HomePage />} />

                <Route path={ROUTES.PRODUCTS.ROOT} element={<AllProductsPage />} />

                <Route path={ROUTES.PRODUCTS.BYID}>
                    <Route index element={<ProductPage />} />
                    <Route path={ROUTES.PRODUCTS.IMAGES} element={<ProductGalery />} />
                </Route>

                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Route>

            {/* Not found route */}
            <Route path={ROUTES.NOT_FOUND} element={<MainLayout />} >
                <Route index element={<NotFoundPage />} />
            </Route>

            {/* Unauthorized access route */}
            <Route path={ROUTES.UNAUTHORIZED} element={<MainLayout />} >
                <Route index element={<UnauthorizedPage />} />
            </Route>


            {/* Protected profile routes */}
            {/* TODO solo acceso de ROLE ADMIN y del dueño del perfil */}
            <Route
                path={ROUTES.PROFILE}
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={ <ProfilePage />} />

            </Route>

            {/* Protected Admin routes */}
            <Route
                path={ROUTES.ADMIN.ROOT}
                element={
                    <ProtectedRoute role={ROLES.ADMIN} >
                        <AdminPageLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminPage />} />
                <Route path='products' element={<AdminProductsPage />} />
                <Route path='new' element={<NewProductPage />} />
                <Route path='categories' element={<AdminCategoriesPage />} />
                <Route path='new-cat' element={<NewCategoryPage />} />
                <Route path='users' element={<AdminUsersPage />} />
            </Route>

            <Route path='/*' element={<Navigate to='/' />} />
        </Routes>
    )
}

export default App
