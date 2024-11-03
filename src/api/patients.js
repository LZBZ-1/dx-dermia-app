import axios from 'axios';

const API_URL = 'http://localhost:8081/api/patients';

export const patientApi = {
    createPatient: async (patientData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL, patientData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addEmergencyContact: async (contactData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/emergency-contacts`, contactData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};