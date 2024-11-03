import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { patientApi } from '../../api/patients';
import { useAuth } from '../../context/AuthContext';

const RegisterFlow = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estado para cada paso
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [patientData, setPatientData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        nationalId: ''
    });

    const [emergencyContact, setEmergencyContact] = useState({
        contactName: '',
        relationship: '',
        phone: ''
    });

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (userData.password !== userData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            // Registrar usuario
            const registerResponse = await authApi.register({
                username: userData.username,
                email: userData.email,
                password: userData.password
            });

            // Login automático después del registro
            const loginResponse = await authApi.login({
                username: userData.username,
                password: userData.password
            });

            // Guardar tokens y datos de usuario
            login(loginResponse);

            // Avanzar al siguiente paso
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el registro');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePatientSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await patientApi.createPatient({
                ...patientData,
                userId: JSON.parse(localStorage.getItem('user')).userId
            });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el perfil del paciente');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmergencyContactSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await patientApi.addEmergencyContact(emergencyContact);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al agregar el contacto de emergencia');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
                <div className="mb-6">
                    <div className="flex justify-between mb-4">
                        <div className={`h-2 flex-1 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                        <div className={`h-2 flex-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                        <div className={`h-2 flex-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    </div>
                    <h2 className="text-2xl font-bold text-center">
                        {step === 1 ? 'Crear Cuenta' :
                            step === 2 ? 'Información Personal' :
                                'Contacto de Emergencia'}
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={userData.username}
                                onChange={(e) => setUserData({...userData, username: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded"
                                value={userData.email}
                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded"
                                value={userData.password}
                                onChange={(e) => setUserData({...userData, password: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded"
                                value={userData.confirmPassword}
                                onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full p-2 rounded text-white font-medium 
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Siguiente'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handlePatientSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={patientData.firstName}
                                onChange={(e) => setPatientData({...patientData, firstName: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={patientData.lastName}
                                onChange={(e) => setPatientData({...patientData, lastName: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={patientData.dateOfBirth}
                                onChange={(e) => setPatientData({...patientData, dateOfBirth: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Género
                            </label>
                            <select
                                className="w-full p-2 border rounded"
                                value={patientData.gender}
                                onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Documento de Identidad
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={patientData.nationalId}
                                onChange={(e) => setPatientData({...patientData, nationalId: e.target.value})}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full p-2 rounded text-white font-medium 
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Siguiente'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleEmergencyContactSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del Contacto
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={emergencyContact.contactName}
                                onChange={(e) => setEmergencyContact({...emergencyContact, contactName: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Relación/Parentesco
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={emergencyContact.relationship}
                                onChange={(e) => setEmergencyContact({...emergencyContact, relationship: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                className="w-full p-2 border rounded"
                                value={emergencyContact.phone}
                                onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full p-2 rounded text-white font-medium 
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Finalizando...' : 'Completar Registro'}
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterFlow;