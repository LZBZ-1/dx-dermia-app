import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authApi.login(credentials);
            login(response);

            if (response.roles.includes('patient')) {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Error de login:', err);
            setError(
                err.response?.data?.message ||
                'Error al iniciar sesión. Por favor, verifica tus credenciales.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={credentials.username}
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-2 rounded text-white font-medium 
              ${isLoading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-500 hover:underline font-medium"
                            disabled={isLoading}
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;