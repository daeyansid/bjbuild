import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2';



// Fetch all Branch Admins
export const fetchBranchAdmins = async () => {
    try {
        const response = await axiosInstance.get('/branch-admin/get-all-branch-admins');
        return response.data;
    } catch (error) {
        console.error('Error fetching branch admins:', error);
        throw error;
    }
};

// Fetch all branches
export const fetchBranches = async () => {
    try {
        const response = await axiosInstance.get('/branch/get-all');
        return response.data; 
    } catch (error) {
        console.error('Error fetching branches:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch branches. Please try again later.',
        });
        throw error;
    }
};

// Fetch branch by ID
export const fetchBranchById = async (id) => {
    try {
        const response = await axiosInstance.get(`/branch/get/${id}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching branch by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch branch details. Please try again later.',
        });
        throw error;
    }
};

// Create a new branch
export const createBranch = async (branchData) => {
    try {
        const response = await axiosInstance.post('/branch/create', branchData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Branch created successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error creating branch:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to create branch. Please try again later.',
        });
        throw error;
    }
};

// Update a branch
export const updateBranch = async (id, branchData) => {
    try {
        const response = await axiosInstance.put(`/branch/update/${id}`, branchData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Branch updated successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error updating branch:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to update branch. Please try again later.',
        });
        throw error;
    }
};

// Delete a branch
export const deleteBranch = async (id) => {
    try {
        const response = await axiosInstance.delete(`/branch/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Branch deleted successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting branch:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to delete branch. Please try again later.',
        });
        throw error;
    }
};
