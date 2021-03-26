const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var lecturers = [];
const LecturerSchema = new Schema({
 name: String,
 qualification: String,
 branch: String,
 teachingExperience: String
});

module.exports = mongoose.model('Lecturer',LecturerSchema);