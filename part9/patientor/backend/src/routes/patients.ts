import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedPatient = patientService.addEntry(newPatient);

    res.json(addedPatient);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(400).send(err.message);
  }
});

export default router;
