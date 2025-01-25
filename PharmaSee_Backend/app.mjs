import express from 'express';
import dotenv from 'dotenv';
import { Patient, Doctor, Medication } from './db.mjs';

dotenv.config();

const app = express();

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
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
app.get('/api/register', (req, res) => {

});

app.get('/api/login', (req, res) => {

});

// PATIENT ROUTES
app.get('/api/patientDashboard', (req, res) => {

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










