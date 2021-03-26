const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require('method-override')
const app = express();
const flash = require("connect-flash");
const User = require("./models/user");
const Student = require("./models/student");
const Lecturer = require("./models/Lecturer");
const Department = require("./models/department");
const Course = require("./models/course");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));


mongoose.connect('mongodb://localhost:27017/studentproject',{
useNewUrlParser:true,
useUnifiedTopology:true
}).then(()=>{
    console.log("DATABASE CONNECTED");
}).catch(err=>{
    console.log("ERROR!");
    console.log(err);
});
mongoose.set('useFindAndModify', false);

//PASSPORT SETUP
app.use(require("express-session")({
secret: "Arihant is a good boy",
resave: false,
saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
res.locals.currentUser = req.user;
res.locals.error = req.flash("error");
res.locals.success = req.flash("success");
next();
});
//STUDENT
app.get("/", async(req,res)=>{
    res.render('students/front');
    });
app.get("/students",isLoggedIn ,function(req,res){
    Student.find({},function(err,students){
        console.log(students);
res.render('students/home',{
thisStudents : students
      });
   });
});
app.get("/students/new",function(req,res){
res.render('students/new');
});
app.post("/students",function(req,res){
    const student = new Student({
       name: req.body.name,
       branch: req.body.branch,
       Rank: req.body.rank,
       studentrollid: req.body.studentrollid,
       Guardianname: req.body.Guardianname
    });
    student.save();
    req.flash("success","Successfully Added");
    res.redirect("/students");
});
app.get("/students/:id", async(req, res) => {
   const student = await Student.findById(req.params.id);
   res.render('students/about',{student});
  });
app.get("/students/:id/edit",async (req,res) => {
  const student = await Student.findById(req.params.id);
  res.render('students/edit',{student});
});
app.put('/students/:id',async (req,res)=>{
    Student.findByIdAndUpdate(req.params.id, req.body.student, function(err,editStudent){
           if(err){
               console.log(err);
               res.redirect("/students");
           }else{
               res.redirect("/students");
           }
    });
});
app.delete('/students/:id',async(req,res)=>{
  Student.findByIdAndRemove(req.params.id, function(err,deleteStudent){
      if(err)res.redirect('/students');
      else{
          res.redirect('/students');
      }
  })
});



//DASHBOARD
app.get('/dashboard',isLoggedIn, function(req,res){
res.render('students/dashboard', {currentUser: req.user});
});







//LECTURERS
app.get('/lecturers',isLoggedIn ,async(req,res)=>{
    Lecturer.find({},function(err,lecturers){
        console.log(lecturers);
res.render('lecturers/home2',{
thislecturers : lecturers
      });
   });
});
app.get("/lecturers/new",function(req,res){
    res.render('lecturers/new');
    });
app.post("/lecturers" ,function(req,res){
    const lecturer = new Lecturer({
       name: req.body.name,
       qualification: req.body.qualification,
       branch: req.body.branch,
       teachingExperience: req.body.teachingExperience
    });
    lecturer.save();
    req.flash("success","Successfully Added");
    res.redirect("/lecturers");
});
app.get("/lecturers/:id",async(req, res) => {
    const lecturer = await Lecturer.findById(req.params.id);
    res.render('lecturers/about',{lecturer});
   });
   app.get("/lecturers/:id/edit",async (req,res) => {
    const lecturer = await Lecturer.findById(req.params.id);
    res.render('lecturers/edit',{lecturer});
  });
  app.put('/lecturers/:id',async (req,res)=>{
      Lecturer.findByIdAndUpdate(req.params.id, req.body.lecturer, function(err,editLecturer){
             if(err){
                 console.log(err);
                 res.redirect("/lecturers");
             }else{
                 res.redirect("/lecturers/");
             }
      });
  });
  app.delete('/lecturers/:id',async(req,res)=>{
    Lecturer.findByIdAndRemove(req.params.id, function(err,deleteLecturer){
        if(err)res.redirect('/lecturers');
        else{
            res.redirect('/lecturers');
        }
    })
  });




  //DEPARTMENTS
  app.get('/departments',isLoggedIn ,async(req,res)=>{
    Department.find({},function(err,departments){
        console.log(departments);
res.render('departments/home3',{
thisdepartments : departments
      });
   });
});
app.get("/departments/new",function(req,res){
    res.render('departments/new');
    });
app.post("/departments" ,function(req,res){
    const department = new Department({
       name: req.body.name,
       strength: req.body.strength,
       hod: req.body.hod,
    });
    department.save();
    req.flash("success","Successfully Added");
    res.redirect("/departments");
});
app.get("/departments/:id/new",async(req,res)=>{
    const department = await Department.findById(req.params.id);
    res.render("departments/new2",{department});
   });
app.get("/departments/:id",async(req,res)=>{
    const department =  await Department.findById(req.params.id).populate('courses');
    console.log(department);
    res.render('departments/about',{department});
   });
   app.post("/departments/:id/course",async(req,res)=>{
    const department = await Department.findById(req.params.id);
    const course = new Course({
        name: req.body.name,
        code: req.body.code,
        faculty: req.body.faculty,
     });
    department.courses.push(course);
    course.save();
    department.save();
    res.redirect("/departments/" + req.params.id);
    });
   app.get("/departments/:id/edit",async (req,res) => {
    const department = await Department.findById(req.params.id);
    res.render('departments/edit',{department});
  });
  app.put('/departments/:id',async (req,res)=>{
      Department.findByIdAndUpdate(req.params.id, req.body.department, function(err,editDepartment){
             if(err){
                 console.log(err);
                 res.redirect("/departments");
             }else{
                 res.redirect("/departments");
             }
      });
  });
  app.delete('/departments/:id',async(req,res)=>{
    Department.findByIdAndRemove(req.params.id, function(err,deleteDepartment){
        if(err)res.redirect('/departments');
        else{
            res.redirect('/departments');
        }
    })
  });

  app.delete("/departments/:id/courses/:courseid",function(req,res){
    Course.findByIdAndRemove(req.params.courseid, function(err,deleteCourse){
     if(err)res.redirect('/departments/' + req.params.id);
     else{
         res.redirect('/departments/' + req.params.id);
     }
    });
  });












  //AUTH ROUTES
app.get('/register',function(req,res){
res.render('students/register');
});
app.post('/register',function(req,res){
var newUser = new User({username: req.body.username});
User.register(newUser,req.body.password,function(err, user){
    if(err){
        console.log(err);
        req.flash("error",err.message);
        return res.render("students/register");
    }
    passport.authenticate("local")(req,res,function(){
        //req.flash("success","Welcome to CollegeTelly "+ user.username);
        res.redirect("/dashboard");
    });
});
});
//SHOW LOGIN FORM
app.get('/login',function(req,res){
res.render('students/login');
});
app.post('/login',passport.authenticate("local",{
successRedirect: "/dashboard",
failureRedirect: "/login"
}), function(req,res){
});

//LOGOUT
app.get('/logout',function(req,res){
req.logout();
req.flash("success","Logged you out");
res.redirect("/");
});
function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
    return next();
}
req.flash("error", "Please Login First");
res.redirect("/login");
}



app.listen(3000,function(){
    console.log("SERVER IS RUNNING");
});