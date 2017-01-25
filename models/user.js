import mongoose, { Schema } from 'mongoose';

let userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },

  password: String,

});

userSchema.methods.checkPassword = function(password) {
  return this.password == password;
}

export default mongoose.model('User', userSchema);