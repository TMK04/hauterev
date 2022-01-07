# Hauterev

## Setup

|                          | Command       |
| -----------------------: | ------------- |
| **Install Dependencies** | `npm install` |
|                **Start** | `npm start`   |

### .env

Create a new .env file, using .env.example as a template.

### .http test files

The "humao.rest-client" extension is required.
The REST Client Environment local address variable may also need to be changed:

1. Start the server to retrive the address it listens on
2. Use that address to replace the one in .vscode/settings.json

The test files are numbered according to the order they should be run in.

## Project Structure

### database

1. Interacts with MySQL database through queries
2. Not responsible for validating data

### routers

1. Cleans inputs from client-side

   - Assume all client-side data is not clean

2. Presents the status of requests to users
