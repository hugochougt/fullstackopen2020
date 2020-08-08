import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdoteOf } from '../reducers/anecdoteReducer'
import { setNotification, resetNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    let resultAnecdotes = []
    if (state.filter) {
      resultAnecdotes = state.anecdotes.filter(ana => ana.content.includes(state.filter))
    } else {
      resultAnecdotes = state.anecdotes
    }

    return resultAnecdotes.sort((a, b) => b.votes - a.votes)
  })

  const handleVote = (id, content) => {
    dispatch(voteAnecdoteOf(id, content))
    dispatch(setNotification(`You voted '${content}'`))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => handleVote(anecdote.id, anecdote.content)}
        />
      )}
    </div>
  )
}

export default AnecdoteList
