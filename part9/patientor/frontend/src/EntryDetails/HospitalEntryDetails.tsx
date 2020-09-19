import React from "react";
import { HospitalEntry, Diagnosis } from "../types";
import {
  Segment,
  Icon,
} from "semantic-ui-react";

interface EntryProps {
  entry: HospitalEntry;
  diagnoses: { [code: string]: Diagnosis };
}

const HospitalEntryDetails = ({ entry, diagnoses }: EntryProps) => {
  return (
    <Segment>
      <h3>
        { entry.date } <Icon name="user doctor" />
      </h3>
      <p style={{ color: "#ACACAC", fontStyle: "italic" }}>
        { entry.description }
      </p>
      <h4>{ entry.specialist }</h4>
      <p>
        { `${entry.discharge.date}: ${entry.discharge.criteria}` }
      </p>
      <ul>
        {
          entry.diagnosisCodes && entry.diagnosisCodes.map((code) => <li key={code}> { code }: { diagnoses[code] && diagnoses[code].name }</li>)
        }
      </ul>
    </Segment>
  );
};

export default HospitalEntryDetails;
