(function(root) {
  var removeClasses = [ 'loading', 'authenticated', 'unauthenticated' ];
  function setState(cssClassesToAdd) {
    removeClasses.forEach(function(cssClass) {
      document.body.classList.remove(cssClass);
    });
    if (!Array.isArray(cssClassesToAdd)) {
      cssClassesToAdd = [cssClassesToAdd];
    }
    cssClassesToAdd.forEach(function(cssClass) {
      document.body.classList.add(cssClass);
    });
  }
  
  
  var ref = new Firebase('https://2048.firebaseio.com/');
  var loggedInUser = null;
  var auth = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      alert('Error with authentication: ' + error);
      setState('unauthenticated');
    } else if (user) {
      loggedInUser = user;
      setState('authenticated');
      document.querySelector('.logout-icon').classList.add('icon-' + user.provider);
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
      setState('unauthenticated');
    }
  });
  
  root.AuthenticationManager = {
    user: loggedInUser,
    login: function(provider) {
      setState(['loading', 'unauthenticated']);
      auth.login(provider);
    },
    logout: function() {
      setState('loading');
      document.querySelector('.best-container').innerText = 0;
      auth.logout();
    }
  };
  
  
  
})(window);