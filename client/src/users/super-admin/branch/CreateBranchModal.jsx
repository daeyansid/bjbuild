import React, { useState, useEffect } from 'react';
import { createBranch, fetchBranchAdmins } from '../../../api/super-admin/superAdminBranch';
import Swal from 'sweetalert2';

const CreateBranchModal = ({ showModal, setShowModal, reloadBranches }) => {
    const [formData, setFormData] = useState({
        branchName: '',
        branchType: 'Prime',
        branchAddress: '',
        branchPhoneNumber: '',
        branchEmailAddress: '',
        assignedTo: '',
        machineAttendance: false,
        dairy: false,
        startTime: '',
        endTime: '',
    });

    const [branchAdmins, setBranchAdmins] = useState([]);

    useEffect(() => {
        const loadBranchAdmins = async () => {
            try {
                const data = await fetchBranchAdmins();
                setBranchAdmins(data.data);
            } catch (error) {
                console.error('Error fetching branch admins:', error);
            }
        };

        if (showModal) {
            loadBranchAdmins();
        }
    }, [showModal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBranch(formData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Branch created successfully!',
            });
            handleCloseModal();
            reloadBranches();
        } catch (error) {
            console.error('Error creating branch:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            branchName: '',
            branchType: 'Prime',
            branchAddress: '',
            branchPhoneNumber: '',
            branchEmailAddress: '',
            assignedTo: '',
            machineAttendance: false,
            dairy: false,
            startTime: '',
            endTime: '',
        });
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    useEffect(() => {
        if (!showModal) {
            resetForm();
        }
    }, [showModal]);

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Create New Branch</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Branch Name</label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Branch Type</label>
                            <select
                                name="branchType"
                                value={formData.branchType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="Prime">Prime</option>
                                <option value="Star">Star</option>
                            </select>
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Assigned To</label>
                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="" disabled>Select Branch Admin</option>
                                {branchAdmins.map((admin) => (
                                    <option key={admin._id} value={admin._id}>
                                        {admin.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Branch Address</label>
                            <input
                                type="text"
                                name="branchAddress"
                                value={formData.branchAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Branch Phone Number</label>
                            <input
                                type="text"
                                name="branchPhoneNumber"
                                value={formData.branchPhoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Branch Email Address</label>
                            <input
                                type="email"
                                name="branchEmailAddress"
                                value={formData.branchEmailAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1 flex flex-row gap-2 items-start">
                            <input
                                type="checkbox"
                                name="machineAttendance"
                                checked={formData.machineAttendance}
                                onChange={handleCheckboxChange}
                                className="h-5 w-5 custom-checkbox"
                            />
                            <span className="block text-gray-700 font-semibold">Machine Attendance</span>
                        </div>
                        <div className="mb-4 col-span-1 flex flex-row gap-2 items-start">
                            <input
                                type="checkbox"
                                name="dairy"
                                checked={formData.dairy}
                                onChange={handleCheckboxChange}
                                className="h-5 w-5 custom-checkbox"
                            />
                            <span className="block text-gray-700 font-semibold">Dairy</span>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
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
                            Create Branch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBranchModal;
