const mongoose = require("mongoose");
const { schema } = require("./Comment");
const Schema = mongoose.Schema;

// Schema
const likesSchema = new Schema({
    // 좋아요한 유저
    user : {type : Schema.ObjectId,required: true},
    // 좋아요한 게시물
    post : {type : Schema.ObjectId, required: true}
}, {
    toJSON : {virtuals: true},
    toObject : {virtuals : true}
})

module.exports = mongoose.model("Likes", likesSchema);