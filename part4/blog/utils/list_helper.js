const getMapValue = (map, key) => map[key] || 0

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes_sum_reducer = (accumulator, blog) => accumulator + blog.likes

  return blogs.reduce(likes_sum_reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((prev, curr) => prev.likes >= curr.likes ? prev : curr)
  return (({ title, author, likes }) => ({ title, author, likes }))(favBlog)
}

const mostBlogs = (blogs) => {
  const authorBlogs = {}

  blogs.forEach(blog => {
    authorBlogs[blog.author] = getMapValue(authorBlogs, blog.author) + 1
  })

  const mostBlogsAuthor = Object.keys(authorBlogs).reduce((prev, curr) => authorBlogs[prev] >= authorBlogs[curr] ? prev : curr)

  return {
    author: mostBlogsAuthor,
    blogs: getMapValue(authorBlogs, mostBlogsAuthor)
  }
}

const mostLikes = (blogs) => {
  const authorLikes = {}
  blogs.forEach(blog => {
    authorLikes[blog.author] = getMapValue(authorLikes, blog.author) + blog.likes
  })

  const mostLikesAuthor = Object.keys(authorLikes).reduce((prev, curr) => authorLikes[prev] >= authorLikes[curr] ? prev : curr)

  return {
    author: mostLikesAuthor,
    likes: getMapValue(authorLikes, mostLikesAuthor)
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
