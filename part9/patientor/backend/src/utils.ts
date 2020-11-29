/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NewPatient,
  Gender,
  SickLeave,
  HealthCheckRating,
  Discharge,
  EntryType,
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthCareEntry,
} from './types';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isObject = (param: any): param is Object => {
  return (typeof param  === 'object' && param !== null);
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseStringAttr = (str: any, attr: string): string => {
  if (!str || !isString(str)) {
    throw new Error(`Incorrect or missing ${attr}}: ${str}`);
  }

  return str;
}

const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }

  return name;
};

const parseSsn = (ssn: any): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }

  return ssn;
};

const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }

  return occupation;
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }

  return gender;
};

const parseRating = (rating: any): HealthCheckRating => {
  if (!rating || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing rating: ' + rating);
  }

  return rating;
};

const parseDescription = (description: any): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description: ' + description);
  }

  return description;
};

const parseSpecialist = (specialist: any): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist: ' + specialist);
  }

  return specialist;
};

const parseDischarge = (discharge: any): Discharge => {
  if (!discharge || !isObject(discharge)) {
    throw new Error('Incorrect or missing discharge: ' + discharge);
  }

  if (!discharge.date || !isDate(discharge.date)) {
    throw new Error('Incorrect or missing discharge date: ' + discharge.date);
  }

  if (!discharge.criteria || !isString(discharge.criteria)) {
    throw new Error('Incorrect or missing discharge criteria: ' + discharge.criteria);
  }

  return discharge;
}

const parseSickLeave = (sickLeave: any): SickLeave | undefined => {
  if (!sickLeave || !isObject(sickLeave)) {
    return undefined;
  }

  if (!sickLeave.startDate || !isDate(sickLeave.startDate)) {
    throw new Error('Incorrect or missing start date of sickLeave: ' + sickLeave.startDate);
  }

  if (!sickLeave.endDate || !isDate(sickLeave.endDate)) {
    throw new Error('Incorrect or missing end date of sickLeave: ' + sickLeave.endDate);
  }

  return sickLeave;
};

export const toNewPatientEntry = (obj: any): NewPatient => {
  return {
    name: parseName(obj.name),
    dateOfBirth: parseDate(obj.dateOfBirth),
    ssn: parseSsn(obj.ssn),
    gender: parseGender(obj.gender),
    occupation: parseOccupation(obj.occupation),
  };
};

export const toNewHealthCheckEntry = (obj: any): NewHealthCheckEntry => {
  return {
    type: EntryType.HealthCheck,
    description: parseDescription(obj.description),
    date: parseDate(obj.date),
    specialist: parseSpecialist(obj.specialist),
    healthCheckRating: parseRating(obj.healthCheckRating)
  };
};

export const toNewHospitalEntry = (obj: any): NewHospitalEntry => {
  return {
    type: EntryType.Hospital,
    description: parseStringAttr(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseStringAttr(obj.specialist, 'specialist'),
    discharge: parseDischarge(obj.discharge)
  };
};

export const toNewOccupationalHealthCareEntry = (obj: any): NewOccupationalHealthCareEntry => {
  return {
    type: EntryType.OccupationalHealthcare,
    description: parseStringAttr(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseStringAttr(obj.specialist, 'specialist'),
    employerName: parseStringAttr(obj.employerName, 'employerName'),
    sickLeave: parseSickLeave(obj.sickLeave)
  };
};
