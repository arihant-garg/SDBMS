const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var students = [];
const StudentSchema = new Schema({
 name: String,
 branch: String,
 Rank: String,
 studentrollid: String,
 Guardianname: String,
});

module.exports = mongoose.model('Student',StudentSchema);