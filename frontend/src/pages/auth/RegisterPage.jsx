import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { REGISTER_ENDPOINT } from '../../config/config';
import Swal from 'sweetalert2';
import { AuthContext } from '../../components/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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

        console.log(formData);

        // Validations
        if (Object.values(formData).some(field => field === '')) {
            setError('¡Por favor rellene todos los campos!');
            return;
        }
        if (formData.email != formData.emailRep) {
            setError('¡Los correos electrónicos no coinciden!');
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
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                })
            })

            if (res.status == 409) {
                setError('¡El correo eléctronico ya está en uso!');
                return
            } else if (!res.ok) {
                setError('Error en el registro, intente nuevamente más tarde.');
                return
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
                    <label htmlFor="inputFirstName" className="form-label">Nombre</label>
                    <input type="text" name='firstName' className="form-control" id="inputFirstName" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputLastName" className="form-label">Apellido</label>
                    <input type="text" name='lastName' className="form-control" id="inputLastName" onChange={handleChange} />
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