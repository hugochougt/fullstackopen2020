import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddHealthCheckEntryForm from './AddHealthCheckEntryForm';
import AddOccupationalHealthcareEntryForm from './AddOccupationalHealthcareEntryForm';
import AddHospitalEntryFrom from './AddHospitalEntryForm';
import { HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry } from '../types';

export type EntryFormValues = Omit<HealthCheckEntry, "id"> | Omit<OccupationalHealthcareEntry, "id"> | Omit<HospitalEntry, "id">;

interface Props {
  modalOpen: boolean;
  modalType: string;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, modalType, onClose, onSubmit, error }: Props) => {
  let form;
  switch (modalType) {
    case "HealthCheck":
      form = <AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} />;
      break;
    case "OccupationalHealthcare":
      form = <AddOccupationalHealthcareEntryForm onSubmit={onSubmit} onCancel={onClose} />;
      break;
    case "Hospital":
      form = <AddHospitalEntryFrom onSubmit={onSubmit} onCancel={onClose} />;
      break;
    default:
      form = null;
  }

  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new { modalType } entry</Modal.Header>
      <Modal.Content>
        { error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
        { form }
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;
