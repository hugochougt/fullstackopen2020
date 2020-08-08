import anecdoteService from '../services/anecdotes'

const INIT_ACTION = 'INITIALIZE'
const VOTE_ACTION = 'VOTE'
const NEW_ACTION = 'NEW_ANECDOTE'

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const returnedAnecdote = await anecdoteService.update(anecdote.id, { ...anecdote, votes: anecdote.votes + 1})
    dispatch({
      type: VOTE_ACTION,
      data: returnedAnecdote
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: NEW_ACTION,
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: INIT_ACTION,
      data: anecdotes
    })
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
      return state.map(ana => ana.id !== id ? ana : action.data)
    case INIT_ACTION:
      return action.data
    default:
      return state
  }
}

export default anecdoteReducer
