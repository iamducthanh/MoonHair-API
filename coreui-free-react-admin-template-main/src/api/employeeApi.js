import  axiosClient  from './axiosClient';

const employeeApi = {
    getEmployeesByBranch(branchId) {
        return axiosClient.get(`/api/employees?branchId=${branchId}`);
    },
    getEmployeeById(id) {
        return axiosClient.get(`/api/employees/${id}`);
    },
    createEmployee(employee) {
        return axiosClient.post('/api/employees', employee);
    },
    updateEmployee(id, employee) {
        return axiosClient.put(`/api/employees/${id}`, employee);
    },
    deleteEmployee(id) {
        return axiosClient.delete(`/api/employees/${id}`, { active: false });
    }
};

export default employeeApi;
