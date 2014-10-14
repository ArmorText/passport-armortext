/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


/**
 * `Strategy` constructor.
 *
 * The ArmorText authentication strategy authenticates requests by delegating
 * to ArmorText using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your ArmorText application's client id
 *   - `clientSecret`  your ArmorText application's client secret
 *   - `callbackURL`   URL to which ArmorText will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new ArmorTextStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/armortext/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {}; 
  options.authorizationURL = options.authorizationURL || 'https://app.armortext.co/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://app.armortext.co/oauth/token';
  this.profileUrl = options.profileUrl || "https://app.armortext.co/api/v1/users/me/profile";
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'armortext';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from ArmorText.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `armortext`
 *   - `id`               unique identifier for this user.
 *   - `username`         the user's ArmorText username
 *   - `displayName`      the user's auth username
 *   - `name.familyName`  user's last name
 *   - `name.givenName`   user's first name
 *   - `gender`           the user's gender: `male` or `female`
 *   - `emails`           the proxied or contact email address granted by the user
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.useAuthorizationHeaderforGET(true);
    
  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {      
    if (err) { return done(err); }

    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'armortext' };

      profile.id = json.id;
      profile.username = json.login;
      profile.displayName = json.first_name + ' ' + json.last_name;
      profile.name = {familyName: json.first_name, givenName: last_name};
      profile.gender = json.gender;
      profile.emails = [{ value: json.email }];
      
      profile._raw = body;
      profile._json = json;
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/** The default oauth2 strategy puts the access_token into Authorization: header AND query string
  * witch is a violation of the RFC so lets override and not add the header and supply only the token for qs.
  */
Strategy.prototype.get = function(url, access_token, callback) {
  this._oauth2._request("GET", url, {}, "", access_token, callback );
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;