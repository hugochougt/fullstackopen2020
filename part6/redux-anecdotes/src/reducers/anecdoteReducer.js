const INIT_ACTION = 'INITIALIZE'
const VOTE_ACTION = 'VOTE'
const NEW_ACTION = 'NEW_ANECDOTE'

export const voteAnecdoteOf = id => {
  return {
    type: VOTE_ACTION,
    data: { id }
  }
}

export const createAnecdote = data => {
  return {
    type: NEW_ACTION,
    data
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: INIT_ACTION,
    data: anecdotes
  }
}

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case NEW_ACTION:
      return state.concat(action.data)
    case VOTE_ACTION:
      const id = action.data.id
      const anecdoteToVote = state.find(ana => ana.id === id)
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }

      return state.map(ana => ana.id !== id ? ana : votedAnecdote)
    case INIT_ACTION:
      return action.data
    default:
      return state
  }
}

export default anecdoteReducer
