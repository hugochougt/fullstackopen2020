describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', {
      username: 'admin',
      name: 'admin',
      password: 'password'
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.get('form').contains('Username')
    cy.get('form').contains('Password')
    cy.get('#login-btn').contains('login')
  })

  describe('Login', function() {
    it('succeed with correct credentails', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('password')
      cy.get('#login-btn').click()

      cy.contains('admin logged in')
    })

    it('fails with wrong credentails', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('wrong-password')
      cy.get('#login-btn').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'admin logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'password' })
    })

    it('a blog can be created', function() {
      cy.get('.blog-item').should('have.length', 0)

      cy.contains('add blog').click()
      cy.get('#title').type('blog title')
      cy.get('#author').type('blog author')
      cy.get('#url').type('blog url')
      cy.get('#add-blog-btn').click()

      cy.contains('a new blog')
      cy.get('.blog-item').should('have.length', 1)
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'first blog',
          author: 'first author',
          url: 'https://example.com'
        })
        cy.contains('view').click()
      })

      it('it can be liked', function() {
        cy.get('.likes').should('have.text', 'likes: 0 like')

        cy.get('.like-btn').click()

        cy.get('.likes').should('have.text', 'likes: 1 like')
      })

      it('it can be deleted by its creator', function() {
        cy.contains('remove').click()
        cy.on('window:confirm', () => true)

        cy.get('.blog-item').should('have.length', 0)
      })

      it('it cannot be deleted by other users', function() {
        cy.contains('logout').click()

        const another_user = {
          username: 'another_user',
          name: 'another_user',
          password: 'password'
        }
        cy.request('POST', 'http://localhost:3001/api/users', another_user)
        cy.login({ ...another_user })

        cy.contains('view').click()
        cy.get('.remove-btn').should('not.exist')
      })
    })

    it('blogs are ordered according to likes', function() {
      const blogs = [
        {
          title: 'blog 1',
          author: 'author 1',
          url: 'url 1',
          likes: 8
        },
        {
          title: 'blog 2',
          author: 'author 2',
          url: 'url 2',
          likes: 12
        },
        {
          title: 'blog 3',
          author: 'author 3',
          url: 'url 3',
          likes: 5
        }
      ]
      blogs.forEach(blog => cy.createBlog({ ...blog }))
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

      cy.get('.likes').should('have.length', 3)
        .each(($likes, index) => {
          const text = $likes.text()
          expect(text).to.equal(`likes: ${sortedBlogs[index].likes} like`)
        })
    })
  })
})
