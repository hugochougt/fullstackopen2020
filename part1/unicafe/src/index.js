import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const FeedbackButton = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const Statistics = (props) => {
  return (
    <table>
      <tbody>
        <Statistic text="good" value={props.good} />
        <Statistic text="neutral" value={props.neutral} />
        <Statistic text="bad" value={props.bad} />
        <Statistic text="all" value={props.all} />
        <Statistic text="average" value={props.average} />
        <Statistic text="positive" value={props.positive} />
      </tbody>
    </table>
  )
}

const Statistic = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = good / all * 100 + ' %'

  let statistics = <p>No feedback given</p>
  if (all > 0) {
    statistics = <Statistics
                    good={good}
                    neutral={neutral}
                    bad={bad}
                    all={all}
                    average={average}
                    positive={positive}
                  />
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <FeedbackButton text="good" handleClick={() => setGood(good + 1)} />
        <FeedbackButton text="neutral" handleClick={() => setNeutral(neutral + 1)} />
        <FeedbackButton text="bad" handleClick={() => setBad(bad + 1)} />
      </div>
      <h1>statistics</h1>
      {statistics}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

