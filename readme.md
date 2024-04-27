# Football

This application provides a way for users to looks at rankings of their intrested teams.

## frontend

To run the frontend only, follow these steps:

1. Make sure you have Git, Docker engine & Node latest with NPM installed on your machine.
2. Clone the repository: `git clone https://github.com/LRagji/football`.
3. Navigate to the frontend directory: `cd frontend`.
4. Build the Docker image: `npm run docker-local`.
5. Run the Docker container: `docker run -d -p 80:80 --name frontend-container football-frontend:local`.

## backend

To run the backend only, follow these steps:

1. Make sure you have Git, Docker engine & Node latest with NPM installed on your machine.
2. Clone the repository: `git clone https://github.com/LRagji/football`.
3. Navigate to the backend directory: `cd backend`.
4. Build the Docker image: `npm run docker-local`.
5. Run the Docker container: `docker run -d -p 8080:8080 --name backend-container football-backend:local`.

## Running the whole application

To run the whole application using Docker Compose, follow these steps:

1. Make sure you have Git, Docker engine & Node latest with NPM installed on your machine.
2. Clone the repository: `git clone https://github.com/LRagji/football`.
3. Navigate to the root directory of the project: `cd football`.
4. Start the Docker Compose services: `docker-compose up -d`.

After running the above steps, you should be able to access the application by opening your browser and navigating to `http://localhost`.

## Environment Variables

The following environment variables are used in the `./docker-compose.yml` file:

- `UPSTREAMAPI`: URL to which backend wil make request for data.
- `UPSTREAMAPIKEY`: The secret api key used for authentication of those APIs.

Make sure to set these environment variables appropriately before running the Docker Compose services.
