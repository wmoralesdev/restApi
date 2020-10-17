# Rest API

## Summary
[Description](#Description)

[Instalation](#Instalation)

[Database seeding](#Seeding-database)

[Environment](#Environtment)

## Description
Rest API created in NodeJS with express web framework. 

Implements a MongoDB database with mongoose ORM for every schema and collection. Authetication is made through JWT, and has a connection to a AWS S3 bucket storage.

## Instalation
1. Clone repository.
2. In root, to install every dependency run `npm install`
3. Create a *dotenv* file with the variables specified in [environment seccion](#Environment).
4. To test in development mode run `npm run devStart` script.

## Seeding database
The database used is stored in MongoDbAtlas Clusters, a **environment variable with mongodb uri must be provided**.

The seeding process consists in running `npm run seed` script.
The seeding process execution consists of a faker (npm module) instance creating mockup data for every document field after deleting every existing collection.

If an error is detected, the process ends without seeding the database.

*Note: when users creation is made, passwords are hash stored, so to have a reference for unhashed passwords a Dummy folder is created with JSONs for products and users.*