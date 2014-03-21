(function(root) {
  var ref = new Firebase('https://2048.firebaseio.com/');
  var loggedInUser = null;
  var auth = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      alert('Error with authentication:', error);
    } else if (user) {
      loggedInUser = user;
      document.querySelector('.auth-buttons').classList.add('authenticated');
      console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
      var bestScoreRef = ref.child('users/' + user.provider + '/' + user.id + '/bestScore');
      window.game.scoreManager = new LocalScoreManager(function getter(callback) {
        bestScoreRef.once('value', function(data) {
          callback(data.val() || 0);
        });
      }, function setter(value) {
        bestScoreRef.set(value);
      });
      window.game.restart();
    } else {
      document.querySelector('.auth-buttons').classList.remove('authenticated');
    }
  });
  
  root.AuthenticationManager = {
    user: loggedInUser,
    login: function(provider) {
      auth.login(provider);
    },
    logout: function() {
      auth.logout();
    }
  };
  
  
  
})(window);