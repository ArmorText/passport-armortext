# Passport-ArmorText

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [ArmorText](http://armortext.com) using the OAuth 2.0 API.

## Install

    $ npm install passport-armortext

## Usage

#### Configure Strategy

The ArmorText authentication strategy authenticates users using a ArmorText
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new ArmorTextStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ ArmorTextId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authorize()`, specifying the `'ArmorText'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/armortext',
      passport.authorize('armortext'));

    app.get('/auth/armortext/callback', 
      passport.authorize('armortext', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Thanks

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 ArmorText <[http://github.com/armortext](http://github.com/armortext)>