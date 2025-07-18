import  axiosClient  from './axiosClient';
const dashboardApi = {
    getDashboard() {
        const url = `/api/dashboard`;
        return axiosClient.get(url);
    }
};

export default dashboardApi;