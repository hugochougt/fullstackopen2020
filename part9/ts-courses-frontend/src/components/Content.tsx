import React from "react";
import { CoursePart } from "../types";
import Part from "./Part";

const Content: React.FC<{ courseParts: Array<CoursePart> }> = ({ courseParts }) => {
  return (
    <>
    {
      courseParts.map((part, idx) => <Part key={idx} part={part} />)
    }
    </>
  )
}

export default Content
