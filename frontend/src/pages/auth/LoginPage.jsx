import { useContext, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LOGIN_ENDPOINT } from '../../config/config';
import Swal from 'sweetalert2';
import { AuthContext } from '../../components/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, login, isAuthenticated } = useContext(AuthContext);
    const from = location.state?.from?.pathname || "/";

    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        'email': '',
        'password': ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validations
        if (Object.values(formData).some(field => field === '')) {
            setError('¡Por favor rellene todos los campos!');
        }

        // Fetch
        try {
            const res = await fetch(LOGIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                setError('¡Credenciales incorrectas!');
                return;
            }

            // Saving token into local storage
            const userData = await res.json();
            login(userData);
            
            Swal.fire({
                title: `¡Bienvenido ${userData?.firstname || ''}!`,
                text: 'Sesión iniciada con éxito.',
                icon: 'success',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#2FBF71'
            }).then(() => {
                navigate(from, { replace: true });
            });
        } catch (error) {
            setError('¡Error en la conexión al servidor!');
            console.error(error);
        }
    }


    return (
        <div className='container-fluid card w-75 my-4 p-4'>
            <h4>Iniciá sesión</h4>
            <NavLink
                className='text-decoration-none text-reset'
                to='/register'
            >
                <p className=''>¿Todavía no eres usuario? Haz click acá.</p>
            </NavLink>

            <form
                onSubmit={handleSubmit}
            >
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Correo electrónico</label>
                    <input type="email" name='email' className="form-control" id="inputEmail" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Contraseña</label>
                    <input type="password" name='password' className="form-control" id="inputPassword" onChange={handleChange} />
                </div>
                {error &&
                    <p className='alert alert-danger'>{error}</p>
                }
                {isAuthenticated &&
                    <p>¡Ya has iniciado sesión!</p>
                }
                <button type="submit" className={`btn btn-primary ${isAuthenticated ? 'disabled': '' } `}>Submit</button>
            </form>
        </div>
    )
}

export default LoginPage