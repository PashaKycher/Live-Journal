import mongoose from "mongoose";

const userSchems = new mongoose.Schema({
    _id: {type: String, required: true},
    email: {type: String, required: true},
    full_name: {type: String, required: true},
    username: {type: String, unique: true},
    bio: {type: String, default: "Hey there! I'm using LiveJournal."},
    profile_picture: {type: String, default: ""},
    cover_photo: {type: String, default: ""},
    locstion: {type: String, default: ""},
    followers: [{type: String, ref: 'User'}],
    following: [{type: String, ref: 'User'}],
    connection: [{type: String, ref: 'User'}],
},{timestamps: true, minimize: false});

const User = mongoose.model('User', userSchems);

export default User