const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Validation function
function validateUser(username, email, password) {
  if (!username || !email || !password) {
    throw new Error("All fields must be filled");
  }

  if (username.length <= 2) {
    throw new Error("Username is too short");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
}

// Static methods
userSchema.statics.signup = async function (username, email, password) {
  validateUser(username, email, password);

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email has already been registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        console.trace({ err });
        reject(new Error("Error hashing password"));
      }
      resolve(hashedPassword);
    });
  });

  const user = await this.create({ username, email, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
