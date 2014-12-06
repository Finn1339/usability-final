var express = require('express');
var router = express.Router();

var userlib = require('../lib/user');

// A logged in "database":
var allAdmins = {};
var online = {};

router.get('/', function(req, res) {
  // TDR: added session support
  var admin = req.session.user;
  if(admin.admin === 'yes'){
    if (admin !== undefined || online[admin.uid] === undefined) {
      online[admin.uid] = admin;
    }
      userlib.admns('admin', function(error, user) {
        if (error) {
            // If there is an error we "flash" a message to the
            // redirected route `/user/login`.
            req.flash('/', error);
            res.redirect('/user/login');
          }
        else{
          allAdmins = user;
          res.render('admin', { title   : 'Admin list',
                             //message : 'these Admins are online',
                             admins  :  allAdmins});
      }
    });
  }
  else{
    req.flash('auth', 'not an admin');
    res.redirect('/user/main');
  }
});

router.get('/newuser', function(req, res){
  // Grab any messages being sent to use from redirect.

  var admin = req.session.user;
  var createmessage = req.flash('create') || '';
  if(admin.admin === 'yes'){
    online[admin.uid] = admin;
    res.render('newuserpage', { title   : 'New User Page',
                          message : createmessage });
  }
  else{
    req.flash('/create', 'not an admin');
    res.redirect('/user/main');
  }
});

router.post('/create', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var adminValue = req.body.admin;
  var admin = req.session.user;
  userlib.lookup(username, password, function(error, users) {
        if (error === 'user not found') {
            // If there is an error we "flash" a message to the
            // redirected route `/user/login`.
            userlib.admns('users', function(error, user) {
                if (error) {
                    // If there is an error we "flash" a message to the
                    // redirected route `/user/login`.
                    req.flash('create', error);
                    res.redirect('/user/admin/newuser');
                  }
                else{
                  var uid = user.length;
                  uid = uid + 1;
                  userlib.newUser(username, password, uid, adminValue, function(error, usered){
                    if(error){
                      req.flash('create', error);
                      res.redirect('/user/admin/newuser');
                    }
                    else{
                      req.flash('create', 'successfully create');
                      res.redirect('/user/main');
                    }
                  });
              }
            });
          }
        else{
          req.flash('create', error);
          res.redirect('/user/admin/newuser');
      }
    });
});


module.exports = router;