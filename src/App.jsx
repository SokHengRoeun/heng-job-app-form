import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, FormControlLabel, Radio, RadioGroup, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useReactToPrint } from 'react-to-pdf';

function App() {
  const [formData, setFormData] = useState({
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get('/api/load-data');
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayChange = (index, field, subfield, value) => {
    setFormData((prevData) => {
      const newArray = [...prevData[field]];
      newArray[index] = { ...newArray[index], [subfield]: value };
      return { ...prevData, [field]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/save-data', formData);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Job Application Form
      </Typography>
      <form onSubmit={handleSubmit} ref={componentRef}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Date of Application"
              name="dateOfApplication"
              type="date"
              value={formData.dateOfApplication}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <RadioGroup
              row
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
            >
              <FormControlLabel value="Full-Time" control={<Radio />} label="Full-Time" />
              <FormControlLabel value="Part-Time" control={<Radio />} label="Part-Time" />
              <FormControlLabel value="Contract" control={<Radio />} label="Contract" />
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Personal Information</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <RadioGroup
              row
              name="drivingLicense"
              value={formData.drivingLicense}
              onChange={handleChange}
            >
              <FormControlLabel value="No" control={<Radio />} label="No" />
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            </RadioGroup>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Years of work"
              name="yearsOfWork"
              type="number"
              value={formData.yearsOfWork}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <RadioGroup
              row
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <FormControlLabel value="Single" control={<Radio />} label="Single" />
              <FormControlLabel value="Married" control={<Radio />} label="Married" />
            </RadioGroup>
            {formData.maritalStatus === 'Married' && (
              <TextField
                fullWidth
                label="Number of dependents"
                name="dependents"
                type="number"
                value={formData.dependents}
                onChange={handleChange}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Educational Background</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Degree / Course</TableCell>
                    <TableCell>University / Institute</TableCell>
                    <TableCell>Year of Graduate</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>City</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.education.map((edu, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={edu.degree}
                          onChange={(e) => handleArrayChange(index, 'education', 'degree', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={edu.university}
                          onChange={(e) => handleArrayChange(index, 'education', 'university', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={edu.yearOfGraduate}
                          onChange={(e) => handleArrayChange(index, 'education', 'yearOfGraduate', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={edu.grade}
                          onChange={(e) => handleArrayChange(index, 'education', 'grade', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={edu.city}
                          onChange={(e) => handleArrayChange(index, 'education', 'city', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={() => setFormData((prevData) => ({ ...prevData, education: [...prevData.education, { degree: '', university: '', yearOfGraduate: '', grade: '', city: '' }] }))}>
              Add Education
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Employment History</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Reason for Leaving</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.employmentHistory.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={job.company}
                          onChange={(e) => handleArrayChange(index, 'employmentHistory', 'company', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={job.position}
                          onChange={(e) => handleArrayChange(index, 'employmentHistory', 'position', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={job.year}
                          onChange={(e) => handleArrayChange(index, 'employmentHistory', 'year', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={job.reasonForLeaving}
                          onChange={(e) => handleArrayChange(index, 'employmentHistory', 'reasonForLeaving', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={() => setFormData((prevData) => ({ ...prevData, employmentHistory: [...prevData.employmentHistory, { company: '', position: '', year: '', reasonForLeaving: '' }] }))}>
              Add Employment
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Skills & Training</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Skill & Training Achievement(s)</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Institute</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.skillsAndTraining.map((skill, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={skill.skill}
                          onChange={(e) => handleArrayChange(index, 'skillsAndTraining', 'skill', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={skill.level}
                          onChange={(e) => handleArrayChange(index, 'skillsAndTraining', 'level', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={skill.year}
                          onChange={(e) => handleArrayChange(index, 'skillsAndTraining', 'year', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={skill.institute}
                          onChange={(e) => handleArrayChange(index, 'skillsAndTraining', 'institute', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={() => setFormData((prevData) => ({ ...prevData, skillsAndTraining: [...prevData.skillsAndTraining, { skill: '', level: '', year: '', institute: '' }] }))}>
              Add Skill/Training
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={handlePrint} sx={{ marginLeft: '10px' }}>
              Export to PDF
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default App;