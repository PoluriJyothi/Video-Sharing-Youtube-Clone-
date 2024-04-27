import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { User, Post } from './Schema.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

// mongoose setup

const PORT = 6001;
mongoose.connect('mongodb://localhost:27017/videoSharing', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{

    // All the client-server activites


     app.post('/register', async (req, res) =>{
        try{
    
            const {username, email, password, profilePic} = req.body;
    
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
    
            const newUser = new User({
                username, 
                email,
                password: passwordHash,
                profilePic
            });
    
            const user = await newUser.save();
    
            res.status(200).json(user);
    
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });
    
    app.post('/login', async (req, res) =>{
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email:email});
            if(!user) return res.status(400).json({msg: "User does not exist"});
    
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});
    
            // generate jwt token using function we defined at top of the page

            
                                 
            res.status(200).json(user);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });



    // fetch all users

    app.get('/fetch-users', async(req, res)=>{

        try{
            const users = await User.find()
            res.json(users);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })

    // fetch individual user

    app.get('/fetch-user/:id', async(req, res)=>{

        try{
            const user = await User.findById(req.params.id)
            res.json(user);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })


     // create new post

     app.post('/createPost', async(req, res)=>{

        const {userId, userName, userPic, video, thumbnail, title, description, uploadTime} = req.body;

        try{
            const newPost = new Post({userId, userName, userPic, video, thumbnail, title, description, uploadTime});
            await newPost.save();
            res.json(newPost);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })


    // fetch all videos

    app.get('/fetch-videos', async(req, res)=>{

        try{
            const videos = await Post.find()
            res.json(videos);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })

     // fetch individual video data

     app.get('/fetch-video/:id', async(req, res)=>{

        try{
            const video = await Post.findById(req.params.id)
            res.json(video);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })

     // add view to video

     app.get('/add-view/:id', async(req, res)=>{

        try{
            const video = await Post.findById(req.params.id);
            video.views = parseInt(video.views) + 1;
            await video.save();
            res.json(video);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })

    // add like to video

    app.post('/add-like', async(req, res)=>{
        const {videoId, userId} = req.body;
        try{
            const video = await Post.findById(videoId);
            console.log(video.likes);
            if(!video.likes.includes(userId)){
                video.likes.push(userId);
                await video.save();
            }
            res.json(video);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })

    // remove like to video

    app.post('/remove-like', async(req, res)=>{
        const {videoId, userId} = req.body;
        try{
            const video = await Post.findById(videoId);
            if(video.likes.includes(userId)){
                video.likes.remove(userId);
                await video.save();
            }
            
            res.json(video);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })


    // delete video

    app.post('/delete-video', async(req, res)=>{
        const {videoId} = req.body;
        try{
            const video = await Post.deleteOne({_id : videoId});
            res.json({message: 'deleted'});
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })


    // follow user

    app.post('/follow-user', async(req, res)=>{
        const {userId, channelId} = req.body;
        try{
            const user = await User.findById(userId);
            const channel = await User.findById(channelId);

            if(!user.following.includes(channelId)){
                user.following.push(channelId);
                await user.save();
            }
            if(!channel.followers.includes(userId)){
                channel.followers.push(userId);
                await channel.save();
            }


            res.json({message: "followed"});
        }catch(err){
            res.status(500).json({message: 'error'});
        }
    })

    // unfollow user

    app.post('/unfollow-user', async(req, res)=>{
        const {userId, channelId} = req.body;
        try{
            const user = await User.findById(userId);
            const channel = await User.findById(channelId);

            if(user.following.includes(channelId)){
                user.following.remove(channelId);
                await user.save();
            }
            if(channel.followers.includes(userId)){
                channel.followers.remove(userId);
                await channel.save();
            }

            res.json({message: "followed"});
        }catch(err){
            res.status(500).json({message: 'error'});
        }
    })



    // save post

    app.post('/save-post', async(req, res)=>{
        const {userId, videoId} = req.body;
        try{
            const user = await User.findById(userId);

            if(!user.savedPosts.includes(videoId)){
                user.savedPosts.push(videoId);
                await user.save();
            }

            res.json({message: "saved"});
        }catch(err){
            res.status(500).json({message: 'error'});
        }
    })


    // unsave post

    app.post('/unsave-post', async(req, res)=>{
        const {userId, videoId} = req.body;
        try{
            const user = await User.findById(userId);

            if(user.savedPosts.includes(videoId)){
                user.savedPosts.remove(videoId);
                await user.save();
            }

            res.json({message: "saved"});
        }catch(err){
            res.status(500).json({message: 'error'});
        }
    })




    // update user data

    app.post('/update-user', async(req, res)=>{
        const {userId, title, description, ProfilePicUpdate, profilePic} = req.body;
        try{
            const user = await User.findById(userId);

            if(ProfilePicUpdate === 'no'){
                user.title = title;
                user.description = description;

                const videos = await Post.find({userId: userId});

                
                videos.map(async (video)=>{
                    video.userName = title;
                    await video.save();
                })
                await user.save();

            } else if(ProfilePicUpdate === 'yes'){
                user.title = title;
                user.description = description;
                user.profilePic = profilePic;

                const videos = await Post.find({userId: userId});

                videos.map(async (video)=>{
                    video.userName = title;
                    video.userPic = profilePic;
                    await video.save();
                })

                await user.save();
            }

            res.json({message: "saved"});
        }catch(err){
            res.status(500).json({message: 'error'});
        }
    })


     // // fetch comments

     app.post('/fetch-comments', async(req, res)=>{
        const {videoId} = req.body;
        try{
            const video = await Post.findById( videoId);

            res.json(video.comments);
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })


    // // add comment to video

    app.post('/add-comment', async(req, res)=>{
        const {videoId, comment} = req.body;
        try{
            const video = await Post.findById( videoId);
            video.comments.push(comment);
            await video.save();

            res.json({message: 'comment added'});
        }catch(err){
            res.status(500).json({message: 'error'});

        }
    })





        app.listen(PORT, ()=>{
            console.log(`Running @ ${PORT}`);
        });
    }
).catch((e)=> console.log(`Error in db connection ${e}`));