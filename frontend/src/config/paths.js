export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: {
        ROOT: '/products',
        BYID: '/products/:id',
        IMAGES: `/products/:id/images`
    },
    PROFILE: '/profile',
    ADMIN: {
        ROOT: '/administracion',
        PRODUCTS: '/administracion/products',
        NEW_PRODUCT: '/administracion/new',
        USERS: '/administracion/users',
        CATEGORIES: '/administracion/categories',
        NEW_CATEGORY: '/administracion/new-cat',
        FEATURES: '/administracion/features',
    },
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/unauthorized'
}