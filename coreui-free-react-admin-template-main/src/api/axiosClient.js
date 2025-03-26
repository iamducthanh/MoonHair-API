import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/',

    headers: {
        'Content-Type': 'application/json'
    },
});

axiosClient.interceptors.request.use(
    (config) => {        
        const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage
        console.log(token);
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header
        }
        console.log('Request Headers:', config.headers);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
           window.location.href = '/#/login'; // Chuyển hướng về trang login
        }
        return Promise.reject(error);
    }
);

export default axiosClient

