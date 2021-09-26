import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    profilePic : { type: String, default : 'https://www.nicepng.com/png/full/522-5226533_get-beyond-the-usual-suspects-profile-pic-icon.png' },
    password : {type : String , required : true} ,

  },
  {
    timestamps: true,
  }
);

const User =  mongoose.models.Userr || mongoose.model('Userr', userSchema);
export default User;