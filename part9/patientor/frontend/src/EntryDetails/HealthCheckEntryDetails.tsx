import React from "react";
import {
  Segment,
  Icon,
} from "semantic-ui-react";
import { HealthCheckEntry, Diagnosis } from "../types";
import HealthRatingBar from "../components/HealthRatingBar";

interface EntryProps {
  entry: HealthCheckEntry;
  diagnoses: { [code: string]: Diagnosis };
}

const HealthCheckEntryDetails = ({ entry, diagnoses }: EntryProps) => {
  return (
    <Segment>
      <h3>
        { entry.date } <Icon name="user doctor" />
      </h3>
      <p style={{ color: "#ACACAC", fontStyle: "italic" }}>
        { entry.description }
      </p>
      <ul>
        {
          entry.diagnosisCodes && entry.diagnosisCodes.map((code) => <li key={code}> { code }: { diagnoses[code] && diagnoses[code].name }</li>)
        }
      </ul>
      <HealthRatingBar showText={true} rating={entry.healthCheckRating} />
    </Segment>
  );
};

export default HealthCheckEntryDetails;
