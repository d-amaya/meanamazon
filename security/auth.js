var expressSession = require("express-session");
var passport = require("passport");
var passportFacebook = require("passport-facebook");

module.exports = function setupAuth (User, app) {
    var FacebookStrategy = passportFacebook.Strategy;
    
    passport.serializeUser(function (user, done) {
       done(null, user._id); 
    });
    
    passport.deserializeUser(function (id, done) {
       User.findOne( { _id: id} ).exec(done); 
    });
    
    passport.use(new FacebookStrategy(
        {
            clientID: "1739257079644324" /*process.env.FACEBOOK_CLIENT_ID*/,
            clientSecret: "b29a218363cdb102a27db3a74bc23647" /*process.env.FACEBOOK_CLIENT_SECRET*/,
            callbackURL: "http://localhost:3000/auth/facebook/callback/",
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("El perfil recibido es: " + JSON.stringify(profile));
            if (!profile.emails || !profile.emails.length) {
                return done("No emails associated with this account!");
            }
            
            User.findOneAndUpdate(
                { "data.oauth": profile.id },
                {
                  $set: {
                      "profile.username" : profile.emails[0].value,
                      "profile.picture"  : "http://graph.facebook.com/" + profile.id.toString() + "/picture?type=large"
                  }  
                },
                { "new": true, upsert: true, runValidators: true },
                function (error, user) {
                    done(error, user);
                }
            );
        }
    ));
    
    // Express middlewares
    app.use(expressSession({
        secret: "this is secret"
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Express routes for auth
    app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
    app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/fail" }), function(req, res) {
        res.send("Welcome, " + req.user.profile.username);
    });
}