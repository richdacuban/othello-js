angular.module('OthelloOnline', ['ngRoute', 'firebase'])
.value('fbUrl', 'https://brilliant-inferno-6551.firebaseio.com/')
.service('fbRef', function(fbUrl) {
  return new Firebase(fbUrl)
})
.service('GameOutlines', function($q, $firebase, fbRef) {
  var self = this;
  self.fetch = function () {
    if (self.gameOutlines)
      return $q.when(self.gameOutlines);
    var deferred = $q.defer();
    var ref = fbRef.child('gameOutlines');
    var $gameOutlines = $firebase(ref);
    ref.on('value', function (snapshot) {
      if (snapshot.val() === null)
        $gameOutlines.$set([]);
      self.gameOutlines = $gameOutlines.$asArray();
      deferred.resolve(self.gameOutlines);
    });
    return deferred.promise;
  };
})
.config(function ($routeProvider) {
  $routeProvider
    .when('/games', {
      controller: 'GameList',
      templateUrl: 'othello-online-game-list.html',
      resolve: {
        gameOutlines: function (GameOutlines) {
          return GameOutlines.fetch();
        }
      }
    })
    .when('/games/:gameId', {
      controller: 'GameDetail',
      templateUrl: 'othello-online-game-detail.html'
    })
    .otherwise({
      redirectTo: '/games'
    });
})
.controller('GameList', function ($scope, gameOutlines) {
  $scope.games = gameOutlines;
})
.controller('GameDetail', function ($scope) {
  // TODO: Fetch the details of a game from Firebase.
  $scope.black = 'Ian';
  $scope.white = 'Julia';
  $scope.turn = 'black';
  $scope.state = 'playing';
  $scope.moves = ['a1', 'b2', 'c8', 'd2', 'pass', 'f3'];
  $scope.board = '__bbbw_________bbww___b____ww___w____bbb________________________';
});
// vim: expandtab softtabstop=2 shiftwidth=2 foldmethod=marker
