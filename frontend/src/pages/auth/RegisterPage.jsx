import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { REGISTER_ENDPOINT } from '../../config/config';
import Swal from 'sweetalert2';
import { AuthContext } from '../../components/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        emailRep: '',
        password: '',
        passwordRep: ''
    })

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailRegexValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validations
        // Empty fields validation
        if (Object.values(formData).some(field => field === '')) {
            setError('¡Por favor rellene todos los campos!');
            return;
        }
        // Email validation
        if (!emailRegexValidation.test(formData.email)) {
            setError('El correo electrónico ingresado no es válido.');
            return;
        } else if (formData.email != formData.emailRep) {
            setError('¡Los correos electrónicos no coinciden!');
            return;
        }
        // Password validation
        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (formData.password != formData.passwordRep) {
            setError('¡Las contraseñas no coinciden!');
            return;
        }

        // Fetch
        try {
            const res = await fetch(REGISTER_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    password: formData.password,
                })
            })

            if (res.status == 409) {
                const errorData = await res.json();
                setError(errorData.error);
                return;
            } else if (!res.ok) {
                setError('Error en el registro, intente nuevamente más tarde.');
                return;
            }

            Swal.fire({
                title: '¡Registro existoso!',
                text: 'Tu cuenta ha sido creada correctamente.',
                icon: 'success',
                confirmButtonText: 'Ir al Login',
                confirmButtonColor: '#2FBF71'
            }).then(() => {
                navigate('/login');
            });

        } catch (error) {
            setError("¡Error en la conexión al servidor!")
            console.error(error);
        }


    }

    return (
        <div className='container-fluid card w-75 my-4 p-4'>
            <h4>Registrate</h4>
            <NavLink
                className='text-decoration-none text-reset'
                to='/login'
            >
                <p className=''>¿Ya eres usuario? Haz click acá.</p>
            </NavLink>

            <form
                onSubmit={handleSubmit}
            >
                <div className="mb-3">
                    <label htmlFor="inputFirstname" className="form-label">Nombre</label>
                    <input type="text" name='firstname' className="form-control" id="inputFirstname" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputLastname" className="form-label">Apellido</label>
                    <input type="text" name='lastname' className="form-control" id="inputLastname" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Correo electrónico</label>
                    <input type="email" name='email' className="form-control" id="inputEmail" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmailRep" className="form-label">Repita su correo electrónico</label>
                    <input type="email" name='emailRep' className="form-control" id="inputEmailRep" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Contraseña</label>
                    <input type="password" name='password' className="form-control" id="inputPassword" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPasswordRep" className="form-label">Repita su contraseña</label>
                    <input type="password" name='passwordRep' className="form-control" id="inputPasswordRep" onChange={handleChange} />
                </div>
                {error &&
                    <p className='alert alert-danger'>{error}</p>
                }
                {isAuthenticated &&
                    <p>¡Ya tienes una sesión activa!</p>
                }
                <button type="submit" className={`btn btn-primary ${isAuthenticated ? 'disabled': '' } `}>Submit</button>
            </form>
        </div>
    )
}

export default RegisterPage