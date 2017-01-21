"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require("./game");

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameManager = function () {
    function GameManager() {
        _classCallCheck(this, GameManager);
    }

    _createClass(GameManager, null, [{
        key: "createGame",
        value: function createGame(host) {
            var id = 0;
            while (GameManager.games.some(function (game) {
                return game.id == id;
            })) {
                id++;
            }
            GameManager.games[id] = new _game2.default(id);
            GameManager.games[id].addPlayer(host, true);
            GameManager.probation[id] = setTimeout(function () {}, 60000);
            GameManager.probationTimeout[id] = Date.now() + 60000;
            return GameManager.games[id];
        }
    }, {
        key: "confirmGame",
        value: function confirmGame(gameId) {
            clearTimeout(GameManager.probation[gameId]);
            GameManager.probation[gameId] = null;
            GameManager.probationTimeout[gameId] = 0;
        }
    }, {
        key: "findGame",
        value: function findGame() {
            return GameManager.games.find(function (game) {
                return game.players.length > 0 && game.players.length < GameManager.MAX_PLAYERS;
            });
        }
    }, {
        key: "getGameById",
        value: function getGameById(id) {
            return GameManager.games.find(function (game) {
                return game.id == id;
            });
        }
    }, {
        key: "destroyGame",
        value: function destroyGame(game) {
            GameManager.games.splice(GameManager.games.findIndex(function (g) {
                return g.id == game.id;
            }), 1);
        }
    }]);

    return GameManager;
}();

exports.default = GameManager;

GameManager.MAX_PLAYERS = 2;
GameManager.games = [];
GameManager.probation = [];
GameManager.probationTimeout = [];