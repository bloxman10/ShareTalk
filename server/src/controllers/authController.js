const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =====================
// REGISTER
// =====================

const register = async (req, res) => {
  try {

    const {
      username,
      email,
      password
    } = req.body;



    // בדיקה שכל השדות קיימים
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }



    // בדיקת פורמט אימייל
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }



    const normalizedEmail = email.toLowerCase();




    // בדיקה אם אימייל קיים
    const existingUser = await User.findOne({
      email: normalizedEmail
    });


    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }





    // בדיקה אם שם משתמש קיים
    const existingUsername = await User.findOne({
      username
    });


    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken"
      });
    }






    // בדיקת חוזק סיסמה
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;



    if (!passwordRegex.test(password)) {

      return res.status(400).json({

        message:
          "Password must be at least 8 characters and include uppercase letter, lowercase letter, number and special character"

      });

    }






    // הצפנת סיסמה
    const hashedPassword =
      await bcrypt.hash(password, 10);






    // יצירת משתמש
    const user = await User.create({

      username,

      email: normalizedEmail,

      password: hashedPassword,

    });







    res.status(201).json({

      message: "User created successfully",

      user: {

        id: user._id,

        username: user.username,

        email: user.email,

      },

    });





  } catch (err) {


    console.log("REGISTER ERROR:", err);


    res.status(500).json({

      message: err.message,

    });


  }
};







// =====================
// LOGIN
// =====================

const login = async (req, res) => {

  try {


    const {
      email,
      password
    } = req.body;





    if (!email || !password) {

      return res.status(400).json({

        message: "Please fill all fields"

      });

    }







    const user = await User.findOne({

      email: email.toLowerCase()

    });






    if (!user) {

      return res.status(400).json({

        message: "Invalid credentials"

      });

    }






    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );






    if (!isMatch) {

      return res.status(400).json({

        message: "Invalid credentials"

      });

    }







    const token = jwt.sign(

      {
        id: user._id.toString(),

        username: user.username,

      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );








    res.json({

      message: "Login successful",


      token,



      user: {

        id: user._id,

        username: user.username,

        email: user.email,

      },

    });






  } catch (error) {


    console.log("LOGIN ERROR:", error);



    res.status(500).json({

      message: error.message

    });


  }

};






module.exports = {
  register,
  login
};