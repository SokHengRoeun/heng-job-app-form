import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const dataFile = join(__dirname, 'formData.json');

// Middleware to parse JSON with a larger size limit
app.use(express.json({ limit: '10mb' }));

app.post('/api/save-data', async (req, res) => {
  try {
    const formData = req.body;
    await fs.writeFile(dataFile, JSON.stringify(formData, null, 2));
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

app.get('/api/load-data', async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return an empty object
      res.json({
        dateOfApplication: '',
        position: '',
        employmentType: '',
        fullName: '',
        nationality: '',
        address: '',
        phone: '',
        email: '',
        dob: '',
        drivingLicense: 'No',
        yearsOfWork: '',
        maritalStatus: 'Single',
        dependents: '',
        education: [{ degree: '', university: '', yearOfGraduate: '', grade: '', city: '' }],
        employmentHistory: [{ company: '', position: '', year: '', reasonForLeaving: '' }],
        skillsAndTraining: [{ skill: '', level: '', year: '', institute: '' }]
      });
    } else {
      console.error('Error loading data:', error);
      res.status(500).json({ message: 'Error loading data' });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));