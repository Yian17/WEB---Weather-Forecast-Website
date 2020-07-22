const request = require('request');
const users = require('../../data/userDB_mongo.js');

// yahoo weather api calling url
const head = 'https://query.yahooapis.com/v1/public/yql?q=';
const woeid = 'select woeid from geo.places(1) where text="';
const allDataOfWoeid = 'select * from weather.forecast where woeid in (';
const tail = '")&format=json';
const messages = [{ id: 0, content: 'welcome' }];

// one log in session expire time 15mins
const sessionExpireTime = 15 * 60 * 1000;

function route(app) {
  // redirect to root page
  app.get('/', (req, res) => {
    res.redirect('/weather');
  });

  // root page
  app.get('/weather', (req, res) => {
    res.render('welcome');
  });

  /*
  * Get a location's weather info
  *
  * Method: GET
  * Input: a concat url with location name at the end
  * Output:a json object of weather info
  */
  app.get('/api/weather/:location', (req, res) => {
    const searchLocation = req.params.location;
    const url = head + allDataOfWoeid + woeid + searchLocation + tail;

    request(url, (err, response, body) => {
      if (err) {
        res.send(err);
        return;
      }

      if (response.statusCode === 200) {
        const fullData = JSON.parse(body);
        res.send(fullData);
      } else {
        res.send(response.statusCode);
      }
    });
  });

  /*
  * Get user's data
  *
  * Pre-requisite: user already logged in
  *
  * Method: GET
  * Output:an encap user info if user already logged in,
  *        otherwise return false
  */
  app.get('/api/users/data', (req, res) => {
    const user = req.session.user;
    if (user === undefined) {
      res.send(false);
    } else if (req.session.authenticated) {
      res.send(user);
    } else {
      res.send(false);
    }
  });

  /*
  * Verified if a user has correct password to
  * their info store in database
  *
  * Method: POST
  * Input: a json object, contain at least username
  *        and a password
  * Output:an encap user info on success,
  *        (and change user's logged state)
  *        otherwise return false
  */
  app.post('/api/users/login', (req, res) => {
    const user = {
      username: req.body.username,
      password: req.body.password,
      remember: req.body.isRemember,
    };

    users.logIn(user.username, user.password).then((data) => {
      if (data !== false) {
        //once users signed in, sign them a 15 mins session
        res.cookie('current_user', user.username, { maxAge: sessionExpireTime, httpOnly: true });

        //if user choose remember their account, then save a 
        //signed non-expire cookie on user's browser
        //if not, then remove already exists non-expire cookie
        //for a user
        if (user.remember) {
          res.cookie(user.username, user, { httpOnly: true, signed: true });
        } else {
          res.clearCookie(user.username);
        }

        //change user state, and save their data in their session
        //those data will gone once user loged out or 
        //session expired
        req.session.authenticated = true;
        req.session.user = data;
        req.session.cookie.maxAge = sessionExpireTime;

        res.send(data);
      } else res.send(false);
    });
  });

  /*
  * Get user's password storing in browser from
  * signed cookies
  *
  * Method: GET
  * Input: a concat url with username at the end of input url
  * Output: password for given username on success
  *         otherwise return false
  */
  app.get('/api/users/getPassword/:username', (req, res) => {
    const username = req.params.username;

    const user = req.signedCookies[username];
    if (user == null) {
      res.send(false);
    } else {
      res.send(user.password);
    }
  });

  /*
  * Create a new user
  *
  * Method: POST
  * Input: a json object with user info
  * Output: true on success(no empty username,password
  *         and no repeat username), otherwise false
  */
  app.post('/api/users', (req, res) => {
    const newCount = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      gender: req.body.gender,
    };

    users.createUser(newCount).then((data) => {
      res.send(data);
    });
  });

  /*
  * Add a recently searched city to user's collection
  *
  * Pre-requisite: user already logged in
  *
  * Method: PUT
  * Input: a json object with a attribute city
  * Output: true on success, otherwise false
  */
  app.put('/api/users/addCity', (req, res) => {
    const user = req.session.user;
    if (req.session.authenticated) {
      const city = req.body.city;
      const savedCity = user.savedCities;

      // delete city from collection
      // if added city already exists
      const index = savedCity.indexOf(city);
      if (index >= 0) {
        savedCity.splice(index, 1);
      }

      // add added city to the position
      // where indicates the most recent search
      user.savedCities.push(city);

      users.updateUserInfo(user.username, user).then((data) => {
        res.send(data);
      });
    } else {
      res.send(false);
    }
  });

  /*
  * Delete a searched city from user's collection
  *
  * Pre-requisite: user already logged in
  *
  * Method: DELETE
  * Input: a concat url, delete target at the end of url
  * Output: true on success, otherwise false
  */
  app.delete('/api/users/deleteCity/:city', (req, res) => {
    const user = req.session.user;
    if (req.session.authenticated) {
      const city = req.params.city;
      const savedCity = user.savedCities;
      const index = savedCity.indexOf(city);

      if (index >= 0) {
        savedCity.splice(index, 1);
        users.updateUserInfo(user.username, user).then((data) => {
          res.send(data);
        });
      } else res.send(false);
    } else {
      res.send(false);
    }
  });

  /*
  * Update user's info (exclude username)
  *
  * Pre-requisite: user already logged in
  *
  * Method: PUT
  * Input: a json object, cointains the field that want update
  * Output: true on success, otherwise false
  */
  app.put('/api/users/updateUserInfo', (req, res) => {
    const user = req.session.user;
    if (req.session.authenticated) {
      const updateUser = {};

      if (req.body.password != null) {
        updateUser.password = req.body.password;
      }

      if (req.body.email != null) {
        updateUser.email = req.body.email;
        user.email = req.body.email;
      } else {
        user.email = null;
        updateUser.email = null;
      }

      if (req.body.gender != null) {
        user.gender = req.body.gender;
        updateUser.gender = req.body.gender;
      } else {
        user.gender = null;
        updateUser.gender = null;
      }

      users.updateUserInfo(user.username, updateUser).then((data) => {
        res.send(data);
      });
    } else {
      res.send(false);
    }
  });

  /*
  * Delete a user from database
  *
  * Pre-requisite: user already logged in
  *
  * Method: DELETE
  * Output: true on success, otherwise false
  */
  app.delete('/api/users', (req, res) => {
    const user = req.session.user;
    if (req.session.authenticated) {
      users.deleteUser(user.username).then((data) => {
        res.send(data);
      });

      delete req.session.authenticated;
    } else res.send(false);
  });

  /*
  * Allow user terminate their own session
  *
  * Pre-requisite: user already logged in
  *
  * Method: GET
  */
  app.get('/users/logout', (req, res) => {
    //remove all user's data
    res.clearCookie('current_user');
    req.session.authenticated = false;
    req.session.cookie.expires = new Date(Date.now());
    req.session.cookie.maxAge = 0;

    res.redirect('/');
  });

  /*
  * Get all boardcasting messages
  *
  * Method: GET
  * Output: a array with all messages which has two
  *         attributes, id and content
  */
  app.get('/api/messages', (req, res) => {
    res.send(messages);
  });

  /*
  * Post a boardcasting message
  *
  * Method: POST
  * Input: a json object with only message data
  * Output: true on success
  */
  app.post('/api/messages', (req, res) => {
    const latestMessage = messages[messages.length - 1];
    const messageID = (latestMessage == null) ? 0 : latestMessage.id + 1;

    const tempMessage = {
      id: messageID,
      content: req.body.data,
    };

    messages.push(tempMessage);
    res.send(true);
  });

  /*
  * Delete a boardcasting message by it's id
  *
  * Method: DELETE
  * Input: a concat url with a message id at the end
  * Output: a message on whether delete a message or not
  */
  app.delete('/api/messages/:id', (req, res) => {
    const messageID = parseInt(req.params.id);
    for (let index = 0; index < messages.length; index++) {
      if (messages[index].id === messageID) {
        messages.splice(index, 1);
        res.send(`delete post with id:${messageID}`);
        return;
      }
    }
    res.send('No such message id');
  });

  /*
  * Delete a boardcasting message by it's id
  *
  * Pre-requisite: user already logged in
  *
  * Method: GET
  * Output: true if current user's session is expired
  *         otherwise return false
  */
  app.get('/api/users/session_expired', (req, res) => {
    const isExpired = !(req.session.cookie.expires == null);
    res.send(isExpired);
  });

  // aviod error on calling this
  app.get('/favicon.ico', (req, res) => {
    res.send(' ');
  });
}

module.exports = route;
