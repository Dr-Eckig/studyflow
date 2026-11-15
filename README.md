# StudyFlow is a study planner software by

- IN6 [Naqeebah Binti Mohd Zaini](https://github.com/naqeebahzaini) (Database)
- IN6 [Jessica Schach](https://github.com/Dr-Eckig) (Frontend)
- IN6 [Franka Marie Schmid](https://github.com/schmifran) (Backend)

## Demo

A live demo of StudyFlow is available at https://studyflow-red-two.vercel.app/login.

Feel free to create an account and explore StudyFlow!

# Project Setup Guide

To run the project smoothly, follow these key steps. This project uses Docker to manage its PostgreSQL database and backend services.

## ⚙️ Create Environment Files

The project requires `.env` files for different services (frontend, backend, Docker). These are automatically generated using a script.

#### If you're using WSL/Linux:

From the root of the project, run:

```bash
./create_dotenv.sh
```

#### If you're on Windows:

First, open your project in Ubuntu (WSL) terminal, and run:

```bash
./create_dotenv.sh
```

## 🐳 Start Docker Containers

Once the `.env` files are created, you can use Docker Compose to spin up different parts of the project.

```bash
docker compose -f compose-database.yml up [-d]      # postgres only
docker compose -f compose-backend.yml up [-d]       # postgres and backend only
docker compose -f compose-development.yml up [-d]   # development mode (postgres, BE & FE)
# Add -d to run in detached mode (in the background).
# Omit -d if you want to see the logs in the terminal.
```

## 😉 Extra Tips

```bash
docker compose down           # to stop all running containers
docker compose down -v        # to remove all volumes (deletes data!)
docker logs <container_name>  # to see logs for a specific service
```

**Adminer** (tool to manage the DB) can be accessed under [http://localhost:11000](http://localhost:11000) once the docker has been created.  
The username and password for it is _postgres_.

## 🖼️ Frontend

### Developer Mode

To start the frontend in developer mode, use the following commands:

```bash
cd ./frontend
npm install
npm run dev
```

### Preview Production Run

To start a local server to preview the built Vite project, use the following commands:

```bash
npm install
npx vite build          # or npm run build
npx vite preview
```
