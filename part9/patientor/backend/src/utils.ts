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
  Diagnosis,
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthCareEntry,
} from './types';
import diagnoseData from '../data/diagnoses.json';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: any): boolean => {
  return isString(date) && Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

export const isObject = (param: unknown) => {
  return (typeof param  === 'object' && param !== null);
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const isDischarge = (param: any): param is Discharge => {
  return isObject(param) && isString(param.criteria) && isDate(param.date);
};

const isDiagnosisCodes = (param: any): param is string[] => {
  if (!param) {
    return true;
  }

  const codes = diagnoseData.map(diagnosis => diagnosis.code);
  return param.every((code: any) => isString(code) && codes.includes(code));
};

const parseStringAttr = (str: unknown, attr: string): string => {
  if (!str || !isString(str)) {
    throw new Error(`Incorrect or missing ${attr}}: ${String(str)}`);
  }

  return str;
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
  const ratingNumber = Number(rating);

  if (!rating || !isHealthCheckRating(ratingNumber)) {
    throw new Error('Incorrect or missing rating: ' + rating);
  }

  return ratingNumber;
};

const parseDischarge = (param: any): Discharge => {
  if (!param|| !isDischarge(param)) {
    throw new Error('Incorrect or missing discharge: ' + param);
  }

  return param;
};

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

const parseDiagnosisCodes = (diagnosisCodes: any): Array<Diagnosis['code']> => {
  if (!isDiagnosisCodes(diagnosisCodes)) {
    return [];
  }

  return diagnosisCodes;
};

export const toNewPatientEntry = (obj: any): NewPatient => {
  return {
    name: parseStringAttr(obj.name, 'name'),
    dateOfBirth: parseDate(obj.dateOfBirth),
    ssn: parseStringAttr(obj.ssn, 'ssn'),
    gender: parseGender(obj.gender),
    occupation: parseStringAttr(obj.occupation, 'occupation'),
  };
};

export const toNewHealthCheckEntry = (obj: any): NewHealthCheckEntry => {
  return {
    type: EntryType.HealthCheck,
    description: parseStringAttr(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseStringAttr(obj.specialist, 'specialist'),
    healthCheckRating: parseRating(obj.healthCheckRating),
    diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes)
  };
};

export const toNewHospitalEntry = (obj: any): NewHospitalEntry => {
  return {
    type: EntryType.Hospital,
    description: parseStringAttr(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseStringAttr(obj.specialist, 'specialist'),
    discharge: parseDischarge(obj.discharge),
    diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes)
  };
};

export const toNewOccupationalHealthCareEntry = (obj: any): NewOccupationalHealthCareEntry => {
  return {
    type: EntryType.OccupationalHealthcare,
    description: parseStringAttr(obj.description, 'description'),
    date: parseDate(obj.date),
    specialist: parseStringAttr(obj.specialist, 'specialist'),
    employerName: parseStringAttr(obj.employerName, 'employerName'),
    sickLeave: parseSickLeave(obj.sickLeave),
    diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes)
  };
};
