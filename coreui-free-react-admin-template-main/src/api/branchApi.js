import  axiosClient  from './axiosClient';
const branchApi = {
    getAllBranches() {
        const url = `/api/branches`;
        return axiosClient.get(url);
    },

    getBranchById(id) {
        const url = `/api/branches/${id}`;
        return axiosClient.get(url);
    },

    createBranch(branch) {
        const url = `/api/branches`;
        return axiosClient.post(url, branch);
    },

    updateBranch(id, branch) {
        const url = `/api/branches/${id}`;
        return axiosClient.put(url, branch);
    },

    deleteBranch(id) {
        const url = `/api/branches/${id}`;
        return axiosClient.delete(url);
    }
};

export default branchApi;