require('dotenv').config()

const fs = require('fs')
const faker = require('faker')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const User = require('../Models/UserModel')
const Product = require('../Models/ProductModel')

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

            var product = new Product({
                SKU: faker.random.alpha(32),
                name: faker.commerce.productName(),
                quantity: getRandomArbitrary(1, 999),
                price: getRandomArbitrary(50, 1000),
                desc: faker.commerce.productDescription()
            })

            await user.save()
            await product.save()
            user.password = unhashedPassword

            jsonStorage.users.push(user)
            jsonStorage.products.push(product)
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

    console.log('Seeded');
    process.exit(0)
}

var dropCurrentDb = async () => {
    await User.collection.drop()
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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