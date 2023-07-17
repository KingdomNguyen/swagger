const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    username: {type: String, required: true},
    task: {type: String, required: true},
    completed: {type: Boolean, required: true, default: false},
    canView: {type: Array, required: true},
    canChange: {type: Array, required: true}
})

module.exports = mongoose.model("Todo",TodoSchema)