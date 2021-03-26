const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DepartmentSchema = new Schema({
 name: String,
 strength: String,
 hod: String,
 courses: [
     {
         type: Schema.Types.ObjectId,
         ref:'Course'
        }
    ]
});
module.exports = mongoose.model('Department',DepartmentSchema);