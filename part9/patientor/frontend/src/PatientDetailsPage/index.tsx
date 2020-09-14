import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "semantic-ui-react";
import { useStateValue, showPatient } from "../state";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

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
    </div>
  );
};

export default PatientDetailsPage;
