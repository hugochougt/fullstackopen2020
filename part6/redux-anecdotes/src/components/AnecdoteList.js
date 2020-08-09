import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

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

const AnecdoteList = (props) => {
  const handleVote = anecdote => {
    props.voteAnecdote(anecdote)
    props.setNotification(`You voted ${anecdote.content}`, 5)
  }

  return (
    <div>
      {props.anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => handleVote(anecdote)}
        />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  let resultAnecdotes = []
  if (state.filter) {
    resultAnecdotes = state.anecdotes.filter(ana => ana.content.includes(state.filter))
  } else {
    resultAnecdotes = state.anecdotes
  }

  return {
    anecdotes: resultAnecdotes.sort((a, b) => b.votes - a.votes),
    filter: state.filter
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  setNotification
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList
