import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Create a new staff member
export const createStaff = async (staffData) => {
    try {
        const response = await axiosInstance.post('/staff/create', staffData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Staff created successfully!',
        });
        return response.data; // Handle the newly created Staff
    } catch (error) {
        console.error('Error creating Staff:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to create Staff. Please try again later.',
        });
        throw error;
    }
};

// Fetch all staff members
export const fetchStaff = async () => {
    try {
        // Retrieve branchId from localStorage
        const branchId = localStorage.getItem('branchId');

        if (!branchId) {
            throw new Error('Branch ID is missing from local storage');
        }

        // Make API request with branchId as a query parameter
        const response = await axiosInstance.get('/staff/get-all', {
            params: { branchId }
        });

        return response.data; // Handle the fetched staff members
    } catch (error) {
        console.error('Error fetching staff:', error);
    }
};

// Fetch staff member by ID
export const fetchStaffById = async (id) => {
    try {
        const response = await axiosInstance.get(`/staff/get-by-id/${id}`);
        return response.data; // Handle the fetched staff member
    } catch (error) {
        console.error('Error fetching staff by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch staff details. Please try again later.',
        });
        throw error; // Handle or propagate error
    }
};

// Update a staff member
export const updateStaff = async (id, staffData) => {
    try {
        const response = await axiosInstance.put(`/staff/update/${id}`, staffData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Staff member updated successfully!',
        });
        return response.data; // Handle the updated staff member
    } catch (error) {
        console.error('Error updating staff:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to update staff member. Please try again later.',
        });
        throw error; // Handle or propagate error
    }
};

// Delete a staff member
export const deleteStaff = async (id) => {
    try {
        const response = await axiosInstance.delete(`/staff/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Staff member deleted successfully!',
        });
        return response.data; // Handle the deleted staff member
    } catch (error) {
        console.error('Error deleting staff:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to delete staff member. Please try again later.',
        });
        throw error; // Handle or propagate error
    }
};