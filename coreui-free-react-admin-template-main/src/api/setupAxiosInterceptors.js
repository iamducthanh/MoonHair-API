import  axiosClient  from './axiosClient';

export const setupAxiosInterceptors = (navigate) => {
    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 403) {
                navigate('/login'); // Chuyển hướng nếu lỗi 403
            }
            return Promise.reject(error);
        }
    );
};