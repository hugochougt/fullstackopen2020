import express from 'express';
import patientService from '../services/patientService';
import {
  toNewPatientEntry,
  toNewHealthCheckEntry,
  toNewHospitalEntry,
  toNewOccupationalHealthCareEntry,
} from '../utils';
import { EntryType } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send("Patient not found");
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedPatient = patientService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(400).send(err.message);
  }
});

router.post('/:id/entries', (req, res) => {
  const patient = patientService.findById(req.params.id);
  let newEntry;

  switch (req.body.type) {
    case EntryType.HealthCheck:
      newEntry = toNewHealthCheckEntry(req.body);
      break;
    case EntryType.Hospital:
      newEntry = toNewHospitalEntry(req.body);
      break;
    case EntryType.OccupationalHealthcare:
      newEntry = toNewOccupationalHealthCareEntry(req.body);
      break;
    default:
      return res.status(400).send('`type` not in list: ["HealthCheck", "Hospital", "OccupationalHealthcare"]');
  }

  if (patient) {
    const addedEntry = patientService.addEntryToPatient(patient, newEntry);
    return res.json(addedEntry);
  } else {
    return res.status(404).send("Patient not found");
  }
});

export default router;
