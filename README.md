# BlogTonic Auth Server

This is a Node.js server that provides authentication functionality through a REST API. This API can be used by a [GraphQL Server](https://github.com/ramizwd/BlogTonic-backend) server to manage user authentication, creating, updating, and deletion.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (version 16.x or higher)
- npm or yarn package manager

### Installing

1.  Clone the repository
2.  Install dependencies using npm or yarn

```bash
npm i
```

### Configuration

The server needs a configuration file to work properly. Create a `.env` file in the root directory with the following variables:

```dotenv
NODE_ENV=
PORT=3001
DATABASE_URL=
JWT_SECRET=
```

### Running the Server

To start the server in dev mode, run the following command:

```bash
npm run dev
```

To build the server, run the following command:

```bash
npm run build
```

The server will be available at [http://localhost:3001](http://localhost:3001).

## API Endpoints

### POST /api/v1/users

Creates a new user account.

**Request Body:**

```json
{
  "email": "user@user.com",
  "password": "123456",
  "username": "user"
}
```

**Response:**

- 201 Created: User account created successfully.
- 400 Bad Request: Invalid request body or user already exists.

**Response Body:**

```json
{
  "message": "User created",
  "user": {
    "id": "091841084104",
    "username": "user",
    "email": "user@user.com"
  }
}
```

### POST /api/v1/auth/login

Logs in an existing user account.

**Request Body:**

```json
{
  "username": "user@user.com",
  "password": "123456"
}
```

**Response:**

- 200 OK: User logged in successfully.
- 401 Unauthorized: Invalid credentials.

**Response Body:**

```json
{
  "message": "Login successful",
  "token": "<token>",
  "user": {
    "id": "091841084104",
    "username": "user",
    "email": "user@user.com"
  }
}
```

### GET /api/user/:id

Retrieves the details of a user account.

**Request Parameters:**

- id: The ID of the user.

**Response:**

- 200 OK: User details retrieved successfully.
- 404 Not Found: User not found.

**Response Body:**

```json
{
  "_id": "abcdef123456",
  "username": "user",
  "email": "user@user.com"
}
```

### PUT /api/users

Updates the details of a user account.

**Auth:**

- token: token of the user to be updated

**Request Body:**

```json
{
  "username": "newname",
  "email": "user2@user.com",
  "password" "new pass"
}
```

**Response:**

- 200 OK: User details updated successfully.
- 401 Unauthorized: Invalid or missing authentication token.
- 404 Not Found: User not found.

**Response Body:**

```json
{
  "message": "User updated",
  "user": {
    "id": "091841084104",
    "username": "newname",
    "email": "user2@user.com"
  }
}
```

### DELETE /api/user

Deletes a user account.

**Auth:**

- token: token of the user to be deleted

**Response:**

- 204 No Content: User account deleted successfully.
- 401 Unauthorized: Invalid or missing authentication token.
- 404 Not Found: User not found.

### DELETE /api/user/:id

Deletes a user account from an admin account.

**Request Parameters:**

- id: The ID of the user.

**Response:**

- 204 No Content: User account deleted successfully.
- 401 Unauthorized: Invalid or missing authentication token.
- 404 Not Found: User not found.

### PUT /api/users/:id

Updates the details of a user account from an admin account.

**Request Parameters:**

- id: The ID of the user.

**Request Body:**

```json
{
  "username": "newname",
  "email": "user2@user.com",
  "password" "new pass"
}
```

**Response:**

- 200 OK: User details updated successfully.
- 401 Unauthorized: Invalid or missing authentication token.
- 404 Not Found: User not found.

**Response Body:**

```json
{
  "message": "User updated",
  "user": {
    "id": "091841084104",
    "username": "newname",
    "email": "user2@user.com"
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/ramizwd/BlogTonic-auth-server/blob/main/LICENSE) file for details.
