const mongoose = require("mongoose")
const Schema = mongoose.Schema
const PointSchema = require("./utils/PointSchema")

const DevSchema = new Schema({
    name: {
        type: String
    },
    github_username: {
        type: String
    },
    bio: {
        type: String
    },
    avatar_url: {
        type: String
    },
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere'
    }

})

module.exports = mongoose.model('Dev', DevSchema)