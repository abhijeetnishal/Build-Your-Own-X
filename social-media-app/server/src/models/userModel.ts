import mongoose from "mongoose";

//create a userSchema
const UserSchema = new mongoose.Schema({
    //Specify how the fields should work by adding some mongoose option:
    userName: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    userImage: {
        type: String,
        default: '',
        required: false
    },
}, { timestamps: true })

//this will create a table or collection if there is no table with that name already.
const userSchema = mongoose.models.User || mongoose.model("User", UserSchema);

export default userSchema;