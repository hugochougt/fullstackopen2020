import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon, Button } from "semantic-ui-react";
import { useStateValue, showPatient, setDiagnosisList, addEntry } from "../state";
import { Patient, Diagnosis, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import EntryDetails from "../EntryDetails";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>('');
  const [error, setError] = React.useState<string | undefined>();

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

  const openModal = (type: string): void => {
    setModalOpen(true);
    setModalType(type);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    console.log('submitNewEntry start');
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(patient, newEntry));
      closeModal();
      console.log('submitNewEntry end');
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data.error);
    }
  };

  const genderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <Icon color='blue' name='mars' />;
      case "female":
        return <Icon color='pink' name='venus' />;
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
      <AddEntryModal
        modalOpen={modalOpen}
        modalType={modalType}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button.Group>
        <Button.Group></Button.Group>
        <Button onClick={() => openModal('HealthCheck')}>New Health Check Entry</Button>
        <Button.Or />
        <Button onClick={() => openModal('OccupationalHealthcare')}>New Occupational Healthcare Entry</Button>
        <Button.Or />
        <Button onClick={() => openModal('Hospital')}>New Hospital Entry</Button>
      </Button.Group>
    </div>
  );
};

export default PatientDetailsPage;
