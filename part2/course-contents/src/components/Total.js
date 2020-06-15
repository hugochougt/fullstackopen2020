import React from 'react'

const Total = ({ course }) => {
  const { parts } = course
  const total = parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)

  return (
    <p><b>total of {total} exercises</b></p>
  )
}

export default Total
