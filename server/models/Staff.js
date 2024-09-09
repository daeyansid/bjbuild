const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
    fullName: { 
        type: String, 
        required: [true, 'Full Name is required.'] 
    },
    cnicNumber: { 
        type: String, 
        required: [true, 'CNIC Number is required.'] 
    },
    phoneNumber: { 
        type: String, 
        required: [true, 'Phone Number is required.'] 
    },
    address: { 
        type: String, 
        required: [true, 'Address is required.'] 
    },
    gender: { 
        type: String, 
        required: [true, 'Gender is required.'] 
    },
    cast: { 
        type: String, 
        required: [true, 'Cast is required.'] 
    },
    joinDate: { 
        type: Date, 
        required: [true, 'Join Date is required.'] 
    },
    salary: { 
        type: Number, 
        required: [true, 'Salary is required.'] 
    },
    staffType: { 
        type: String, 
        required: [true, 'Staff Type is required.'] 
    },
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true 
    },
    employeeNumber: {
        type: String,
        required: [true, 'Employsdee Number is required.']
    },
    photo: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('staff', staffSchema);
