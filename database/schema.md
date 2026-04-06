# MongoDB Schema Design

## Users Collection
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "password": "String(Hashed)",
  "role": "String(USER/ADMIN)",
  "createdAt": "ISODate"
}
```

## Snippets Collection
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "code": "String",
  "language": "String",
  "tags": ["String"],
  "authorId": "ObjectId(User)",
  "authorUsername": "String",
  "isPrivate": "Boolean",
  "views": "Integer",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

## Reviews Collection
```json
{
  "_id": "ObjectId",
  "snippetId": "ObjectId(Snippet)",
  "reviewerId": "ObjectId(User)",
  "reviewerUsername": "String",
  "rating": "Integer",
  "comment": "String",
  "createdAt": "ISODate"
}
```
