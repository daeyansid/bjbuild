import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createStaff } from '../../../../api/staffApi';

const AddStaffModal = ({ showModal, setShowModal, reloadData }) => {
    const [formData, setFormData] = useState({
        userRole: 'staff',
        fullName: '',
        cnicNumber: '',
        phoneNumber: '',
        address: '',
        gender: '',
        cast: '',
        basicSalary: '',
        branchId: '',
        joinDate: '',
        employeeId: '',
        employeeNumber: '',
        salary: '',
        staffType: '',
        photo: null,
    });

    useEffect(() => {
        const branchId = localStorage.getItem('branchId');
        if (branchId) {
            setFormData((prevState) => ({
                ...prevState,
                branchId,
            }));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Branch ID is missing. Please try again later.',
            });
            setShowModal(false);
        }
    }, [setShowModal]);

    const formatCnicNumber = (value) => {
        const cnic = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (cnic.length <= 5) {
            return cnic;
        } else if (cnic.length <= 12) {
            return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
        } else {
            return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12, 13)}`;
        }
    };

    const formatPhoneNumber = (value) => {
        const phone = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (phone.length <= 4) {
            return phone;
        } else {
            return `${phone.slice(0, 4)}-${phone.slice(4, 11)}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cnicNumber') {
            setFormData({
                ...formData,
                [name]: formatCnicNumber(value),
            });
        } else if (name === 'phoneNumber') {
            setFormData({
                ...formData,
                [name]: formatPhoneNumber(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        let formattedJoinDate = '';
        if (formData.joinDate) {
            try {
                formattedJoinDate = new Date(formData.joinDate).toISOString().split('T')[0] + "T00:00:00Z";
            } catch (error) {
                console.error('Error formatting join date:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date',
                    text: 'The join date is invalid. Please enter a valid date.',
                });
                return;
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Missing Date',
                text: 'Join date is required.',
            });
            return;
        }

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        data.set('joinDate', formattedJoinDate);

        try {
            await createStaff(data);
            Swal.fire('Success!', 'Staff added successfully!', 'success');
            setShowModal(false);
            reloadData();
        } catch (error) {
            console.error('Error creating Staff:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to add Staff. Please try again later.',
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            userRole: 'staff',
            fullName: '',
            cnicNumber: '',
            phoneNumber: '',
            address: '',
            gender: '',
            cast: '',
            basicSalary: '',
            branchId: '',
            joinDate: '',
            employeeId: '',
            employeeNumber: '',
            salary: '',
            staffType: '',
            photo: null,
        });
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
                <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Add New Staff</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Name Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* CNIC Number Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">CNIC Number</label>
                            <input
                                type="text"
                                name="cnicNumber"
                                value={formData.cnicNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength="15" // Max length to account for CNIC format
                            />
                        </div>
                        {/* Phone Number Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength="12" // Max length to account for phone number format
                            />
                        </div>
                        {/* Address Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Gender Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        {/* Cast Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Cast</label>
                            <input
                                type="text"
                                name="cast"
                                value={formData.cast}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Basic Salary Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Basic Salary</label>
                            <input
                                type="number"
                                name="basicSalary"
                                value={formData.basicSalary}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Staff ID Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Staff ID</label>
                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Salary Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Salary</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Staff Type Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Staff Type</label>
                            <input
                                type="text"
                                name="staffType"
                                value={formData.staffType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Employee Number Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Employee Number</label>
                            <input
                                type="text"
                                name="employeeNumber"
                                value={formData.employeeNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Join Date Input */}
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Join Date</label>
                            <input
                                type="date"
                                name="joinDate"
                                value={formData.joinDate}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Photo Input */}
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Photo</label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffModal;
