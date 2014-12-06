// # User Library

// ## User Objects
function User(username, password, uid, admin) {
  this.username = username;
  this.password = password;
  // Added uid
  this.uid      = uid;
  this.admin    = admin;
}

// This is our stub database until we look at a real database!
var userdb = [
  new User('tim',   'mit', 1, 'no'),
  new User('hazel', 'lezah', 2, 'no'),
  new User('caleb', 'belac', 3, 'no'),
  new User('adminy', 'power', 4, 'yes'),
  new User('o', 'p', 5, 'yes'),
  new User('kafinn', 'Arc', 6, 'no')
];

exports.admns = function(type, cb){
  var len = userdb.length;
  var a = [];
  var u = [];
  var j = 0;
  for(var i = 0; i < len; i++){
    u[i] = userdb[i];
    if(userdb[i].admin === 'yes'){
      a[j] = userdb[i];
      j++;
    }
  }
  if(type === 'admin'){
    cb(undefined, a);
  }
  else {
    cb(undefined, u);
  }
};

//
// ## lookup function
// locates a user by `name` if it exists. Invokes callback `cb` with the
// signature cb(error, userobj).
//
exports.lookup = function(username, password, cb) {
  var len = userdb.length;
  for (var i = 0; i < len; i++) {
    var u = userdb[i];
    if (u.username === username) {
      if (u.password === password) {
        cb(undefined, u);
      }
      else {
        cb('password is not correct');
      }
      return;
    }
  }
  cb('user not found');
};

exports.newUser = function(username, password, uid, admin, cb){
  var user = new User(username, password, userdb.length+1, admin, cb);
  userdb.push(user);
  cb(undefined, user);
}

