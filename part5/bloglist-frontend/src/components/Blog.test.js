import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
// import { prettyDOM } from '@testing-library/dom'

const blog = {
  author: "d838o23dd8h",
  id: "5f007fbfca929e946010be97",
  likes: 89,
  title: "Structure of backend application, introduction to testing",
  url: "https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing",
}

describe('<Blog />', () => {
  const invisibleStyle = 'display: none'
  const visibleStyle = 'display: block'

  let component

  beforeEach(() => {
    component = render(
      <Blog blog={blog} />
    )
    // component.debug()
  })

  test('renders blog', () => {

    const titleElement = component.container.querySelector('.title')
    expect(titleElement).toHaveTextContent(blog.title)
    expect(titleElement).toHaveStyle(visibleStyle)

    const authorElement = component.container.querySelector('.author')
    expect(authorElement).toHaveTextContent(blog.author)
    expect(authorElement).toHaveStyle(visibleStyle)

    const togglableContent = component.container.querySelector('.togglableContent')
    expect(togglableContent).toHaveStyle(invisibleStyle)

    const urlElement = togglableContent.querySelector('.url')
    expect(urlElement).toBeDefined()
    const likesElement = togglableContent.querySelector('.likes')
    expect(likesElement).toBeDefined()
  })

  test('after clicking view button, blog\'s url and number of likes are shown', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const togglableContent = component.container.querySelector('.togglableContent')
    expect(togglableContent).toHaveStyle(visibleStyle)
  })

  test('clicking the button twice calls event handler twice', () => {
    const likeBlog = jest.fn()
    component = render(
      <Blog blog={blog} likeBlog={likeBlog} />
    )
    const likesButton = component.container.querySelector('.like-btn')
    fireEvent.click(likesButton)
    fireEvent.click(likesButton)
    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})

