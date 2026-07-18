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
        USERS: '/administracion/users',
        NEW_PRODUCT: '/administracion/new',
    },
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/unauthorized'
}