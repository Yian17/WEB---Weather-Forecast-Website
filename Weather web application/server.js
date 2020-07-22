const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

function checkAuth(req, res, next) {
  // don't serve /secure to those not logged in
  if (req.url === '/secure' && (!req.session || !req.session.authenticated)) {
    res.render('unauthorised', { status: 403 });
    return;
  }
  next();
}

// middle where for all request
function configure(app) {
  app.set('view engine', 'ejs');
  app.use(checkAuth);
  app.use(express.static(`${__dirname}/public`));
  app.use(function(req,res,next){
    //if a request mission content-type, force it to json
    if((req.method==="POST")||(req.method==="PUT")){
      if( req.headers['content-type'] != 'application/json'){
         req.headers['content-type'] = 'application/json';
      }
    }
    next();
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  app.use(morgan('dev'));
  app.use(cookieParser('Do not let you know'));
  app.use(session({
    secret: 'Do not let you know',
    saveUninitialized: true,
    resave: true,
    name: 'Weather_search',
  }));
}

const app = express();
const route = require('./public/script/js_server/route.js');

configure(app);

route(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
