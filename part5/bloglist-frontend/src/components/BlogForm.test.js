import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm.js'

test('<BlogForm /> updates parent state and call onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(<BlogForm createBlog={createBlog} />)

  const title = 'testing of form should be easier'
  const author = 'nobody'
  const url = 'https://example.com'

  const form = component.container.querySelector('form')
  const titleInput = component.container.querySelector('input[name="title"]')
  const authorInput = component.container.querySelector('input[name="author"]')
  const urlInput = component.container.querySelector('input[name="url"]')

  fireEvent.change(titleInput, {
    target: { value: title }
  })
  fireEvent.change(authorInput, {
    target: { value: author }
  })
  fireEvent.change(urlInput, {
    target: { value: url }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(title)
  expect(createBlog.mock.calls[0][0].author).toBe(author)
  expect(createBlog.mock.calls[0][0].url).toBe(url)
})
