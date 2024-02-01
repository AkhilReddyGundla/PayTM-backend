
const {userSchema} = require('./db')
const bcrypt = require("bcrypt");




userSchema.methods.createHash = async function (plainTextPassword){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
}

// validation
UserSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  };

  module.exports = {
    createHash,validatePassword
  }