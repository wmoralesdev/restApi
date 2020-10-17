const sendgrid = require('@sendgrid/mail')
const { LexModelBuildingService } = require('aws-sdk')
const { models } = require('mongoose')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async function(email) {
    try {
        await sendgrid.send(email)
    }
    catch(err) {
        return err
    }
}