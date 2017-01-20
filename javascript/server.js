"use strict";

var _player3 = require("./player");

var _player4 = _interopRequireDefault(_player3);

var _gamemanager = require("./gamemanager");

var _gamemanager2 = _interopRequireDefault(_gamemanager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var PING_INTERVAL = 1000;
var PING_TIMEOUT = 10000;
var MATCHMAKING_JOIN = "matchmaking_join";
var MATCHMAKING_PING = "matchmaking_ping";
var MATCHMAKING_LEAVE = "matchmaking_leave";
var GAME_CREATE = "game_create";
var GAME_JOIN = "game_join";
var GAME_PING = "game_ping";
var GAME_LEAVE = "game_leave";
var PLAYER_JOIN = "player_join";
var PLAYER_LEAVE = "player_leave";

var Message = function Message() {
    _classCallCheck(this, Message);

    this.gameId = null;
};

server.on("message", function (msg, info) {
    var player = _player4.default.fromAddressInfo(info);
    var message = JSON.parse(msg);
    var game = null;
    if (message.gameId != null) {
        game = _gamemanager2.default.getGameById(message.gameId);
    }
    switch (message.message) {
        case MATCHMAKING_JOIN:
            joinMatchmaking(player);
            console.log("Player joined matchmaking");
            printState();
            break;
        case GAME_CREATE:
            _gamemanager2.default.createGame().addPlayer(player, true);
            console.log("Game created");
            printState();
            break;
        case GAME_JOIN:
            game.confirmPlayer(player);
            break;
        case GAME_PING:
            game.confirmPlayer(player);
            break;
        case GAME_LEAVE:
            if (game.isHost(player)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = game.getPlayers()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _player = _step.value;

                        game.removePlayer(_player);
                        var _message = {
                            message: GAME_LEAVE,
                            reason: "Host disconnected"
                        };
                        sendMessage(JSON.stringify(_message), _player);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                _gamemanager2.default.destroyGame(game);
            } else {
                game.removePlayer(player);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = game.getPlayers()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _player2 = _step2.value;

                        sendMessage(JSON.stringify({ message: PLAYER_LEAVE, player: _player2.getJson(false) }), _player2);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            console.log("Player left game");
            printState();
            break;
        default:
            break;
    }
});
server.bind(3000);
function joinMatchmaking(player) {
    var game = _gamemanager2.default.findGame();
    if (game) {
        game.addPlayer(player);
        var message = {
            message: GAME_JOIN,
            playerId: game.getPlayerId(player),
            game: game.getJson()
        };
        sendMessage(JSON.stringify(message), player);
    } else {
        var _message2 = {
            message: GAME_CREATE
        };
        sendMessage(JSON.stringify(_message2), player);
    }
}
function sendMessage(message, player) {
    server.send(message, player.port, player.ip);
}
function printState() {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = _gamemanager2.default.games[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var game = _step3.value;

            var log = "\n";
            log += "+---------------------------------+\n";
            log += "|Game                             |\n";
            log += "+-------+-------------------------+\n";
            log += "|id     |" + pad(game.id, 25) + "|\n";
            log += "+-------+-------------------------+\n";
            log += "|players                          |\n";
            for (var i = 0; i < game.players.length; i++) {
                var player = game.players[i];
                log += "+-------+---------+---------------+\n";
                log += "|       |ip       |" + pad(player.ip, 15) + "|\n";
                log += "|       |port     |" + pad(player.port, 15) + "|\n";
                if (game.probation[i]) {
                    log += "|       |probation|0              |\n";
                } else {
                    log += "|       |probation|" + pad((game.probationTimeout[i] - Date.now()) / 1000, 15) + "|\n";
                }
            }
            log += "+-------+---------+---------------+\n";
            log += "|host   |ip       |" + pad(game.host.ip, 15) + "|\n";
            log += "|       |port     |" + pad(game.host.port, 15) + "|\n";
            log += "+-------+---------+---------------+\n";
            log += "\n";
            console.log(log);
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }
}
function pad(object, targetLength) {
    var str = object.toString();
    while (str.length < targetLength) {
        str += " ";
    }
    return str;
}