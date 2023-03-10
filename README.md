![Logo]()




# OleCheckAPI

This API allows user to manage and organize a virtual cinema data. You can manage your cinema clients or/and their tickets.


## API Reference


### Get all cinema's users

```http
  GET /api/membership/members
```


| Header | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `x-access-token`      | `string` | **Required**. Token obtained after login |

#### Response
```json
     [
         {
             "id": 1,
             "name": "George",
             "email": "george@example.com",
             "password": "12345",
             "roles": "active"
         },
         {
             "id": 2,
             "name": "Jerry",
             "email": "jerry@example.com",
             "password": "12345",
             "roles": "active"
         }
     ]
```

## Tech Stack

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"></a> <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"></a> <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge"></a> <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"></a> <a href="https://www.npmjs.com/package/jsonwebtoken"><img src="https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink"></a>
