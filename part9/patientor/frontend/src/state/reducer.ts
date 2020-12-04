import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";

const SET_PATIENT_LIST = "SET_PATIENT_LIST";
const ADD_PATIENT = "ADD_PATIENT";
const SHOW_PATIENT = "SHOW_PATIENT";
const SET_DIAGNOSIS_LIST = "SET_DIAGNOSIS_LIST";
const ADD_ENTRY = "ADD_ENTRY";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "SHOW_PATIENT";
      payload: Patient;
  }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
  }
  | {
    type: "ADD_ENTRY";
    payload: {
      patient: Patient;
      entry: Entry;
    };
  };

export const setPatientList = (patients: Patient[]): Action => {
  return {
    type: SET_PATIENT_LIST,
    payload: patients,
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: ADD_PATIENT,
    payload: patient,
  };
};

export const showPatient = (patient: Patient): Action => {
  return {
    type: SHOW_PATIENT,
    payload: patient,
  };
};

export const setDiagnosisList = (diagnoses: Diagnosis[]): Action => {
  return {
    type: SET_DIAGNOSIS_LIST,
    payload: diagnoses,
  };
};

export const addEntry = (patient: Patient, entry: Entry): Action => {
  return {
    type: ADD_ENTRY,
    payload: {
      patient,
      entry,
    },
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_PATIENT_LIST:
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case ADD_PATIENT:
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case SHOW_PATIENT:
      return {
        ...state,
        patient: {
          ...action.payload,
        }
      };
    case SET_DIAGNOSIS_LIST:
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
        }
      };
    case ADD_ENTRY:
      const entries = action.payload.patient.entries === undefined ? [action.payload.entry] : action.payload.patient.entries.concat(action.payload.entry);
      return {
        ...state,
        patient: {
          ...action.payload.patient,
          entries
        },
      };
    default:
      return state;
  }
};
