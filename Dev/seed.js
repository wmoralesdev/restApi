require('dotenv').config()

const fs = require('fs')
const faker = require('faker')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const User = require('../Models/UserModel')

var seedDatabase = async () => {
    try {
        var jsonStorage = { users: [], products: [] }

        for(let i = 0; i < 20; i++) {
            var unhashedPassword = faker.internet.password()
            var hashedPassword = bcrypt.hashSync(unhashedPassword, 10)

            var user =  new User({
                name: faker.name.firstName() + ' ' + faker.name.lastName(),
                username: faker.internet.userName(),
                phone: faker.phone.phoneNumber('########'),
                birthdate: faker.date.past(),
                email: faker.internet.email(),
                password: hashedPassword
            })

            await user.save()
            user.password = unhashedPassword

            jsonStorage.users.push(user)
        }

        fs.writeFileSync('Dummy/Users.json', JSON.stringify(jsonStorage.users), err => {
            if (err) console.log(err);
        })

        fs.writeFileSync('Dummy/Products.json', JSON.stringify(jsonStorage.products), err => {
            if (err) console.log(err);
        })
    }
    catch(err) {
        console.log(err);
    }

    process.exit(0)
}

var dropCurrentDb = async () => {
    await User.collection.drop()
}

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(async () => {
        dropCurrentDb()
        seedDatabase()
    })
    .catch((err) => {
        debug(err);
        process.exit(1);
    });