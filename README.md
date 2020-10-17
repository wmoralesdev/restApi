# Rest API

## Summary
[Description](#Description)

[Instalation](#Instalation)

[Database seeding](#Seeding-database)

[Environment](#Environment)

[Entities/Schemas](#Entities)

[Endpoints](#Endpoints)

[Inquiries](#Inquiries)

---
## Description
Rest API created in NodeJS with express web framework. 

Implements a MongoDB database with **mongoose** ORM for every schema and collection. Authetication is made through JWT, and has a connection to a AWS S3 bucket storage.

---
## Instalation
0. Read [dependencies](#Dependencies) section.
1. Clone repository.
2. In root, to install every dependency run `npm install`
3. Create a *dotenv* file with the variables specified in [environment seccion](#Environment).
4. To test in development mode run `npm run devStart` script.

---
## Dependencies
RestAPI needs the following things to run:
* An AWS S3 bucket
* A Sendgrid API key with previous email configuration
* A MongoDB URI, preferable a MongoDbAtlas remote connection

---
## Seeding database
The database used is stored in MongoDbAtlas Clusters, a **environment variable with mongodb uri must be provided**.

The seeding process consists in running `npm run seed` script.
The seeding process execution consists of a faker (npm module) instance creating mockup data for every document field after deleting every existing collection.

If an error is detected, the process ends without seeding the database, the script must be runned again.

*Note: when users creation is made, passwords are hash stored, so to have a reference for unhashed passwords a Dummy folder is created with JSONs for products and users.*

---
## Environment
### Variables
The RestAPI instance needs the following environment variables (obtained through dotenv file).

| Variable         | Description                                                                         |
|------------------|-------------------------------------------------------------------------------------|
| PORT             | Number for available port to run server.                                            |
| CLIENT_URL       | URL where the server runs, localhost or remote.                                     |
| MONGO_URI        | A MongoDB URI for connection. Must provide user, password and database name within. |
| TOKEN_KEY        | Key used for JWT verification.                                                      |
| TOKEN_RESET_KEY  | Key used for JWT reset petitions.                                                   |
| MAIL             | Email configured Sendgrid access.                                                   |
| SENDGRID_API_KEY | Sendgrid API key for remote mail access.                                            |
| AWS_BUCKET       | S3 AWS bucket. name                                                                  |
| AWS_KEY          | AWS key for bucket access.                                                          |
| AWS_KEY_ID       | AWS key identifier.                                                                  |

---
## Entities
Rest API functionality is based in *Users and products*. Everything is handled through **mongoose**.

### User Schema
    name: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        phone: String,
        birthdate: Date,
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        recoverLink: String
    }

### Product Schema
    product: {
        SKU: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            get: getPrice,
            set: setPrice,
            required: true
        },
        desc: String,
        key: String,
        imageLocation: String
    }
    
#### Product annotations
* Money is stored in cents with USD currency considerated.

    To avoid money issues with floating point variables, every price is stored in cents, *but is received as dollars anyways*. 

    *getPrice* takes the value stored in document and converts it to USD.

    *setPrice* takes the value received in request body and converts it to cents.

* Key and imageLocation refer to AWS S3 file name identifier, and URL to visualize the image.

---
## Endpoints
Endpoints are documented and handled in **Insomnia** client, refer to [Insomnia JSON file](https://github.com/wmoralesdev/restApi/blob/master/Dev/Insomnia_2020-10-16.json) and import it to client.

---
## Inquiries
You can contact me at walterafael26@gmail.com anytime!
