import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose, { trusted } from 'mongoose';
import { Patient, Doctor, Medication } from './db.mjs';

dotenv.config();

const app = express();

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MONGO CONNECTION //
await mongoose.connect(process.env.MONG_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// GENERAL ROUTES
app.post('/api/register', async (req, res) => {
    const formData = req.body;
 
    // Registers user based on selected role
    if (formData.role === 'patient') {
        const newPatient = new Patient(formData);
        await newPatient.save();
        res.status(201).json({ message: 'Patient registered successfully' });
    }   
    else if (formData.role === 'doctor') {    
        const newDoctor = new Doctor(formData);
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor registered successfully' });
    }
});

app.post('/api/login', async (req, res) => {
  const { fullName, password, role } = req.body;
  console.log("TESTING LOGIN!");
  try {
    // if role set to patient
    if (role === 'patient') {
      const patient = await Patient.findOne({ fullName: fullName});
      // if patient name not found
      if (!patient) {
        console.log("PATIENT NOT FOUND");
        return res.status(404).send('Patient not found');
      }
      // if password does not match
      if (patient.password !== password) {
        console.log("PATIENT INCORRECT PASSWORD");
        return res.status(401).json({message:'Incorrect password', authenticated: false, role: 'patient'});
      }
      // successful login
      else {
        return res.status(200).json({message:'Login successful', authenticated: true, role: 'patient'});
      }
    }
    // if role set to doctor
    else if (role === 'doctor') {
      console.log(`DOCTOR NAME IS ${fullName}`);
      const doctor = await Doctor.findOne({ fullName: fullName});
      // if doctor name not found
      if (!doctor) {
        console.log("DOCTOR NOT FOUND");
        return res.status(404).send('Doctor not found');
      }
      // if password does not match
      console.log(password);
      if (doctor.password !== password) {
        console.log("DOCTOR INCORRECT PASSWORD");
        return res.status(401).json({message:'Incorrect password', authenticated: false, role: 'doctor'});
      }
      else {
        return res.status(200).json({message:'Login successful', authenticated: true, role: 'doctor'});
      }
    }
  }
  catch (error) {
    res.status(500).send('Internal server error: ' + error);
  }



});

// PATIENT ROUTES
app.get('/api/patientDashboard/:id', (req, res) => {
  
});

app.get('/api/doctorDashboard', (req, res) => { 

});

app.get('/api/patientProfile', (req, res) => {

});

app.get('/api/medication/:id', (req, res) => {
    
});

// /scan prompts webcam for picture taking 

// what the text generated from gpt from picture is sent to
app.post('/api/addMedication', (req, res) => {

}); 

// DOCTOR ROUTES
app.get('/api/patient/:id', (req, res) => { 

});

app.post('/api/patient/:id/prescribe', (req, res) => {

});

app.post('/api/addPatient', (req, res) => {

});










