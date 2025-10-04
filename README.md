# Docker Demo – User Profile App

A simple **User Profile Application** demonstrating how to develop and containerize a full-stack web app using **Docker**, **Node.js**, **Express**, and **MongoDB**.  

This project showcases my understanding of **containerized environments**, **service networking**, and **full-stack application deployment** using **Docker Compose**.

---

## Overview

This demo app consists of:
- A simple **frontend** built with pure **HTML**, **CSS**, and **JavaScript**
- A **Node.js backend** using the **Express** framework
- A **MongoDB** database for storing user data
- A **Mongo Express** web interface for database administration

All services are fully **containerized with Docker** and can be managed individually or together via **Docker Compose**.

---

## Tech Stack

| Component     | Technology Used        |
|----------------|------------------------|
| Frontend       | HTML, CSS, JavaScript  |
| Backend        | Node.js (Express)      |
| Database       | MongoDB                |
| DB Admin Tool  | Mongo Express          |
| Containerization | Docker, Docker Compose |

---

##  Setup with Docker

#### To start the application

Step 1: Create docker network

    docker network create mongo-network 

Step 2: start mongodb 

    docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password --name mongodb --net mongo-network mongo    

Step 3: start mongo-express
    
    docker run -d -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=password --net mongo-network --name mongo-express -e ME_CONFIG_MONGODB_SERVER=mongodb mongo-express   

_NOTE: creating docker-network in optional. You can start both containers in a default network. In this case, just emit `--net` flag in `docker run` command_

Step 4: open mongo-express from browser

    http://localhost:8081

Step 5: create `user-account` _db_ and `users` _collection_ in mongo-express

Step 6: Start your nodejs application locally - go to `app` directory of project 

    npm install 
    node server.js
    
Step 7: Access you nodejs application UI from browser

    http://localhost:3000

### With Docker Compose

#### To start the application

Step 1: start mongodb and mongo-express

    docker-compose -f docker-compose.yaml up
    
_You can access the mongo-express under localhost:8080 from your browser_
    
Step 2: in mongo-express UI - create a new database "my-db"

Step 3: in mongo-express UI - create a new collection "users" in the database "my-db"       
    
Step 4: start node server 

    npm install
    node server.js
    
Step 5: access the nodejs application from browser 

    http://localhost:3000

#### To build a docker image from the application

    docker build -t my-app:1.0 .       
    
The dot "." at the end of the command denotes location of the Dockerfile.

