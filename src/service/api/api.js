import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    // baseURL: 'http://api-ws-floor.waliczek.org/',
    withCredentials: true,
});

export default apiClient;
