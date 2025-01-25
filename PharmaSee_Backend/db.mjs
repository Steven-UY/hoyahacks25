import mongoose from 'mongoose';

// patient ID not needed (done by mongoose)
const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true},
    email: { type: String, required: true},
    age: { type: Number, required : true},
    medication: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medication' }]
});

const medicationSchema = new mongoose.Schema({
    name: { type: String, required: true},
    dose: { type: Number, required: true},
    frequency: { type: String, required: true},
    count: { type: Number },
    refill: { type: Boolean }
});

const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true},
    email: { type: String, required: true},
    age: { type: Number, required : true},
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
})

export const Patient = mongoose.model('Patient', patientSchema);
export const Doctor = mongoose.model('Doctor', doctorSchema);
export const Medication = mongoose.model('Medication', medicationSchema);

