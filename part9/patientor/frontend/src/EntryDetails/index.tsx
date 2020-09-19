import React from "react";
import { assertNever } from "assert-never";
import HospitalEntryDetails from "./HospitalEntryDetails";
import HealthCheckEntryDetails from "./HealthCheckEntryDetails";
import OccupationalHealthcareEntryDetails from "./OccupationalHealthcareEntryDetails";
import { Entry, Diagnosis } from "../types";

const EntryDetails: React.FC<{ entry: Entry; diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
