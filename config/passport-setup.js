const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user,done)=>{
    done(null,user.id)
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })

});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        proxy: true,
        callbackURL: '/auth/google/redirect'

    } ,(accessToken, refreshToken, profile, done) => {
        // passport callback function
        //console.log('passport callback function fired:');
        console.log(profile);
        User.findOne({googleId:profile.id}).then((currentUser)=>{
            if(currentUser){
                console.log('currentUser :'+ currentUser);
                done(null,currentUser);
            }
            else{
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail:profile._json.image.url
                }).save().then((newUser) => {
                    console.log('new user created: ', newUser);
                    done(null,newUser);
                });
            }
        })

   })
 );
