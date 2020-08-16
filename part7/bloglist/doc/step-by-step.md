# Step by Step

## Model Design

- User:
  - attrs:
    - username
    - passwordHash
  - assocs:
    - has many:
      - Blog
      - Comment, through Blog
- Blog:
  - attrs:
    - title:string, null: false
    - url:string, null: false
    - author:string, null: false
    - likes:integer, default: 0
  - assocs:
    - belongs to: User
    - has many: Comment
- Comment:
  - attrs:
    - body:string, null: false
  - assocs:
    - belongs to:
      - User
      - Blog
