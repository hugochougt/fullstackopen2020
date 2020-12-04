import React from "react";
import { OccupationalHealthcareEntry, Diagnosis } from "../types";
import {
  Segment,
  Icon,
} from "semantic-ui-react";

interface EntryProps {
  entry: OccupationalHealthcareEntry;
  diagnoses: { [code: string]: Diagnosis };
}

const OccupationalHealthcareEntryDetails = ({ entry, diagnoses }: EntryProps) => {
  return (
    <Segment>
      <h3>
        { entry.date } <Icon name="stethoscope" /> { entry.employerName }
      </h3>
      <p style={{ color: "#ACACAC", fontStyle: "italic" }}>
        { entry.description }
      </p>
      {
        entry.sickLeave && (<p> Sick leave: { `${entry.sickLeave.startDate} ~ ${entry.sickLeave.endDate}` } </p>)
      }
      <ul>
        {
          entry.diagnosisCodes && entry.diagnosisCodes.map((code) => <li key={code}> { code }: { diagnoses[code] && diagnoses[code].name }</li>)
        }
      </ul>
    </Segment>
  );
};

export default OccupationalHealthcareEntryDetails;
