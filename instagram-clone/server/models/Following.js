const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema
const followingSchema = new Schema({
    // 팔로우한 유저
    user : {type : Schema.ObjectId, required: true},
    // 팔로우 받은 유저
    following: {type : Schema.ObjectId, required : true}
}, {
    toJSON : {virtuals: true},
    toObject : {virtuals: true}
})

module.exports = mongoose.model("Following", followingSchema)