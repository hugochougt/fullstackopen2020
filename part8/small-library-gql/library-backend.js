const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const JWT_SECRET = 'JWT_SECRET'
const HARDCODED_PASSWORD = 'password'

mongoose.set('useFindAndModify', false)

const MONGODB_URI = 'mongodb://127.0.0.1:27017/library-backend'
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Author: {
    bookCount: (root) => {
      return Book.find({ author: root._id }).countDocuments()
    },
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}
      const { author, genre } = args

      if (genre) {
        query['genres'] = { $in: [args.genre] }
      }

      if (author) {
        await Author.findOne({ name: author }, (err, adventure) => {
          query["author"] = adventure._id
        })
      }

      return Book.find(query).populate('author')
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('unauthorized')
      }

      const { author } = args

      let dbAuthor = await Author.findOne({ name: author })
      if (!dbAuthor) {
        dbAuthor = new Author({ name: author })
        try {
          await dbAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args })
        }
      }

      const book = new Book({ ...args, author: dbAuthor._id })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }
      const dbBook = Book.findById(book._id)

      return dbBook.populate('author')
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('unauthorized')
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }

      return author
    },
    createUser: (root, args) => {
      const { username, favoriteGenre } = args
      const user = new User({ username, favoriteGenre })

      return user.save()
        .catch((error) => {
          throw new UserInputError(error.message, { invalidArgs: args })
        })
    },
    login: async (root, args) => {
      const { username, password } = args
      const user = await User.findOne({ username })

      if (!user || password !== HARDCODED_PASSWORD) {
        throw new UserInputError('invalid username or password')
      }

      const userForToken = {
        username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
