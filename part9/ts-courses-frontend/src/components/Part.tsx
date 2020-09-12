import React from "react";
import { CoursePart } from "../types";

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
  /**
   * Helper function for exhaustive type checking
   */
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (part.name) {
    case "Fundamentals":
      return (
        <ul>
          <li>{ part.name }</li>
          <li>Number of exercises: { part.exerciseCount }</li>
          <li>{ part.description }</li>
        </ul>
      )
    case "Using props to pass data":
      return (
        <ul>
          <li>{ part.name }</li>
          <li>Number of exercises: { part.exerciseCount }</li>
          <li>{ part.groupProjectCount }</li>
        </ul>
      )
    case "Deeper type usage":
      return (
        <ul>
          <li>{ part.name }</li>
          <li>Number of exercises: { part.exerciseCount }</li>
          <li>{ part.description }</li>
          <li><a href={ part.exerciseSubmissionLink }>{ part.exerciseSubmissionLink}</a></li>
        </ul>
      )
    default:
      return assertNever(part);
  }
}

export default Part
