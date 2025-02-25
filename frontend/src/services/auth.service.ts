import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

class AuthService {
    async login(username: string, password: string) {
        const response = await axios.post(API_URL + 'auth/jwt/create/', {
            username,
            password
        });
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
        }
        return response.data;
    }

    async register(username: string, email: string, password: string) {
        return axios.post(API_URL + 'auth/users/', {
            username,
            email,
            password
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
    }
}

export default new AuthService();
