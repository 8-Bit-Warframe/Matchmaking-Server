"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _server = require("./server");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(id) {
        _classCallCheck(this, Game);

        this.players = [];
        this.probation = [];
        this.probationTimeout = [];
        this.host = null;
        this.id = id;
    }

    _createClass(Game, [{
        key: "addPlayer",
        value: function addPlayer(player) {
            var host = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (host) {
                if (this.host != null) {
                    console.error("Could not set player as host, as a host already exists");
                } else {
                    this.host = player;
                }
            }
            var id = this.getAvailableId();
            this.players[id] = player;
            if (player.uid != this.host.uid) {
                this.probation[id] = setTimeout(function () {
                    _server.Server.removePlayer(this, this.players[id]);
                }, 60000);
                this.probationTimeout[id] = Date.now() + 60000;
            }
        }
    }, {
        key: "confirmPlayer",
        value: function confirmPlayer(player) {
            var id = this.players.findIndex(function (p) {
                return p.uid == player.uid;
            });
            clearTimeout(this.probation[id]);
            this.probation[id] = setTimeout(function () {
                _server.Server.removePlayer(this, player);
            }, 10000);
            this.probationTimeout[id] = Date.now() + 10000;
        }
    }, {
        key: "removePlayer",
        value: function removePlayer(player) {
            this.players.splice(this.players.findIndex(function (p) {
                return p.uid == player.uid;
            }), 1);
        }
    }, {
        key: "isHost",
        value: function isHost(player) {
            return player.uid == this.host.uid;
        }
    }, {
        key: "getAvailableId",
        value: function getAvailableId() {
            var id = 0;
            while (this.players[id] != null) {
                id++;
            }
            return id;
        }
    }, {
        key: "getPlayers",
        value: function getPlayers() {
            return this.players.filter(function (player) {
                return player != null;
            });
        }
    }, {
        key: "getPlayerId",
        value: function getPlayerId(player) {
            return this.players.findIndex(function (p) {
                return player.uid == p.uid;
            });
        }
    }, {
        key: "getJson",
        value: function getJson() {
            var players = [];
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i] == null) {
                    players[i] = null;
                } else {
                    players[i] = this.players[i].getJson(i);
                }
            }
            return {
                id: this.id,
                players: players
            };
        }
    }]);

    return Game;
}();

exports.default = Game;