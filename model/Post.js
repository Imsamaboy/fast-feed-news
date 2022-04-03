const {Schema, model, Types} = require("mongoose")

const schema = new Schema({
    owner: {type: Types.ObjectId, ref: "User"},
    ownerName: {type: String, required: true},
    header: {type: String, required: true},
    content: {type: String, required: true},
    date: {type: Date, default: Date.now}
})

module.exports = model("Post", schema)