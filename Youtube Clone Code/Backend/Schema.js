import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    profilePic: {
        type: String
    },
    description: {
        type: String,
        default: ''
    },
    videos: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    savedPosts: {
        type: Array,
        default: []
    },
    likedPosts: {
        type: Array,
        default: []
    },
});

const postSchema  = mongoose.Schema({
    userId: {
        type: String
    },
    userName:{
        type: String
    },
    userPic:{
        type: String
    },
    video: {
        type: String
    },
    thumbnail: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    uploadTime: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
}, {timestamps: true});




export const User = mongoose.model("users", userSchema);

export const Post = mongoose.model("posts", postSchema);