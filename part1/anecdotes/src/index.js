import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const randomIndex = n => Math.floor(Math.random() * n)

const MostVotedAnecdote = props => {
  const { points } = props
  const idxOfMaxVaule = points.indexOf(Math.max(...points))
  const mostVotedAnecdote = props.anecdotes[idxOfMaxVaule]

  return (
    <p>{mostVotedAnecdote}</p>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(props.points)
  const voteText = points[selected] > 1 ? 'votes' : 'vote'

  const handleVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <p>{props.anecdotes[selected]}</p>
      <p>has {points[selected]} {voteText}</p>
      <div>
        <Button handleClick={handleVote} text="vote" />
        <Button handleClick={() => setSelected(randomIndex(anecdotes.length))} text="next anecdote" />
      </div>

      <h1>Anecdote with most votes</h1>
      <MostVotedAnecdote points={points} anecdotes={props.anecdotes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

let points = new Array(anecdotes.length)
for (let i = 0; i < anecdotes.length; ++i) points[i] = 0;

ReactDOM.render(<App anecdotes={anecdotes} points={points} />, document.getElementById('root'))
