const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: process.env.AWS_KEY,
    accessKeyId: process.env.AWS_KEY_ID,
    region: 'us-east-1'
})

const s3 = new aws.S3()
const imageTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/BMP']

const fileFilter = (req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(new Error('Wrong filetype'), false)
    }
}

var file = {
    upload: multer({
        storage: multerS3({
            s3: s3,
            acl: 'public-read',
            bucket: process.env.AWS_BUCKET,
            key: function(req, file, cb) {
                cb(null, 'products/' + new Date().toISOString() + file.originalname);
            }
        }),
        limits: {
            fileSize: 1024 * 1024 * 5
        }
    }),

    deleteFile: fileName => {
        s3.deleteObject({Bucket: process.env.AWS_BUCKET, Key: fileName},
        function(err, data) {
            if(err)
                throw {error: true, message: 'Something went wrong'}
        })
    }
}

module.exports = file