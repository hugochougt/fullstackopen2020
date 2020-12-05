# Step by Step

## Model Design

- User:
  - attrs:
    - username
    - passwordHash
  - assocs:
    - has many Blog
- Blog:
  - attrs:
    - title:string, null: false
    - url:string, null: false
    - author:string, null: false
    - likes:integer, default: 0
  - assocs:
    - belongs to User
    - has many Comment
- Comment:
  - attrs:
    - body:string, null: false
  - assocs:
    - belongs to Blog

## Databse

- MongoDB
- `npm install mongoose --save`

## APIs

### Users API

- bcrypt: `npm install bcrypt --save`
- mongoose-unique-validator: `npm install mongoose-unique-validator --save`
- jsonwebtoken: `npm install jsonwebtoken --save`
