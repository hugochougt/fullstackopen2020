import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "semantic-ui-react";
import { useStateValue, showPatient, setDiagnosisList } from "../state";
import { Patient, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";
import EntryDetails from "../EntryDetails";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient, diagnoses }, dispatch] = useStateValue();

  React.useEffect(() => {
    const fetchPatientDetails = async () => {
      if (patient.id === id) {
        return ;
      }

      try {
        const { data: patientDetailFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(showPatient(patientDetailFromApi));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDiagnosisList = async () => {
      try {
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosisList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    fetchDiagnosisList();
    fetchPatientDetails();
  }, [id, patient.id, dispatch]);

  const genderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <Icon color='blue' name='mars' />;
      case "female":
        return <Icon color='pink' name='venus' />
      default:
        return <Icon color='grey' name='genderless' />;
    }
  };

  return (
    <div className="App">
      <h1>{patient.name} {genderIcon(patient.gender)}</h1>
      <p>dob: {patient.dateOfBirth}</p>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <h2>entries</h2>
      {
        patient.entries && patient.entries.map((entry) => <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />)
      }
    </div>
  );
};

export default PatientDetailsPage;
