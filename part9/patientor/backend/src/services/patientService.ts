import { v4 as uuidv4 } from 'uuid';
import patients from '../../data/patients';
import { Patient, PublicPatient, Entry, NewPatient, NewEntry } from '../types';

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    id: uuidv4(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntryToPatient = (patient: Patient, entry: NewEntry): Entry => {
  if (!patient.entries) {
    patient.entries = [];
  }

  const newEntry = {
    id: uuidv4(),
    ...entry,
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getNonSensitiveEntries,
  findById,
  addPatient,
  addEntryToPatient,
};
