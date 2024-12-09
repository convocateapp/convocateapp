import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; // Importar el componente Header
import config from '../../config/config';

const EditUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [apodo, setApodo] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    
   
    const urlgetuser = config.bffauthgetuser;
    const urlupdateuser = config.bffauthupdateuser;


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
                const response = await fetch(urlgetuser, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userName: user,
                        password: "",
                        email: "",
                        name: "",
                        lastName: "",
                        apodo: ""
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.userName);
                    setEmail(data.email);
                    setName(data.name);
                    setLastName(data.lastName);
                    setApodo(data.apodo);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    interface User {
      userName: string;
      email: string;
      password: string;
      name: string;
      lastName: string;
      apodo: string;
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setMessage('');

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(urlupdateuser, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userName: username, email, password, name, lastName, apodo } as User)
        });

        if (response.ok) {
          setMessage('Perfil actualizado correctamente');
          setTimeout(() => navigate('/'), 3000); // Redirigir a la página principal después de 3 segundos
        } else {
          setMessage('Error al actualizar el perfil');
        }
      } catch (error) {
        setMessage('Error en la conexión con la API');
      }
    };

    return (
        <>
            <Header /> {/* Añadir el componente Header */}
            <div className="container mt-4" style={{ paddingTop: '85px' }}> {/* Añadir paddingTop para el header fijo */}
                <h1>Editar Usuario</h1>
                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="lastName" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="apodo" className="form-label">Apodo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="apodo" 
                            value={apodo} 
                            onChange={(e) => setApodo(e.target.value)} 
                            required 
                        />
                    </div>
                    {message && <p className="text-info">{message}</p>}
                    <button type="submit" className="btn btn-primary">Guardar</button>
                    <button type="button" className="btn btn-secondary mt-2" onClick={() => navigate('/forgot-password')}>Modificar Pass</button>
                </form>
            </div>
        </>
    );
};

export default EditUser;