(function() {
  var __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jpp.util.Scope.temp(function() {
    var Util;
    Util = (function() {

      function Util() {}

      Util.LOGGING = true;

      Util.decompseFragment = function(fragment) {
        var direction, i, route, s, sub, _i, _len;
        if (fragment === null || fragment === '' || fragment === '/') {
          return {
            route: ['/'],
            direction: true
          };
        } else {
          route = fragment.split('/');
          direction = [];
          s = '';
          i = 0;
          for (_i = 0, _len = route.length; _i < _len; _i++) {
            sub = route[_i];
            s += s === '/' ? sub : '/' + sub;
            route[i] = s;
            direction[i] = true;
            ++i;
          }
          return {
            route: route,
            direction: direction
          };
        }
      };

      Util.complementFragment = function(prev, next) {
        var branch, direction, i, n, nexts, prevs, route, _i, _ref;
        route = [];
        direction = [];
        if (prev == null) {
          prev = '';
        }
        if (next == null) {
          next = '';
        }
        if (prev.charAt(0) === '/') {
          prev = prev.substr(1);
        }
        if (next.charAt(0) === '/') {
          next = next.substr(1);
        }
        prevs = Util.decompseFragment(prev).route;
        nexts = Util.decompseFragment(next).route;
        n = Math.min(prevs.length, nexts.length);
        branch = 0;
        while (branch < n) {
          if (prevs[branch] !== nexts[branch]) {
            break;
          }
          ++branch;
        }
        if (branch === nexts.length) {
          --branch;
        }
        n = branch;
        i = prevs.length - 1;
        while (i >= n) {
          route.push(prevs[i]);
          direction.push(false);
          --i;
        }
        n = nexts.length - 1;
        i = branch;
        while (i <= n) {
          route.push(nexts[i]);
          direction.push(true);
          ++i;
        }
        for (i = _i = _ref = route.length - 1; _ref <= 1 ? _i <= 1 : _i >= 1; i = _ref <= 1 ? ++_i : --_i) {
          if (route[i] === route[i - 1]) {
            route.splice(i, 1);
            direction.splice(i, 1);
          }
        }
        return {
          route: route,
          direction: direction
        };
      };

      Util.getDirection = function(fragmentA, fragmentB) {
        var a, aLen, b, bLen, i, n;
        if (fragmentA === fragmentB) {
          return 0;
        }
        a = fragmentA === '/' ? [''] : fragmentA.split('/');
        b = fragmentB === '/' ? [''] : fragmentB.split('/');
        aLen = a.length;
        bLen = b.length;
        n = Math.min(aLen, bLen);
        i = 1;
        while (i < n) {
          if (a[i] !== b[i]) {
            break;
          }
          ++i;
        }
        /*
        			console.log a
        			console.log b
        			console.log aLen
        			console.log bLen
        			console.log i
        */

        if (aLen === bLen && i === aLen - 1) {
          return 0;
        }
        if (i === aLen && i < bLen) {
          return 1;
        }
        return -1;
      };

      Util.log = function() {
        var m;
        m = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (Util.LOGGING) {
          return console.log('[Milkpack] ' + m.join(' '));
        }
      };

      Util.error = function() {
        var m;
        m = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return console.log('[Milkpack Error] ' + m.join(' '));
      };

      Util.printInit = function(Milkpack, kazitori, routes) {
        var fragment, handler, routeArray;
        if (!Util.LOGGING) {
          return;
        }
        routeArray = [];
        for (fragment in routes) {
          handler = routes[fragment];
          routeArray.push('           \'' + fragment + '\'');
        }
        Util.log("----------------------------------------");
        Util.log("Milkpack " + Milkpack.VERSION + "  © Copyright alumican.net All rights reserved.");
        Util.log("Kazitori " + kazitori.VERSION + "  © Copyright hageee.net All rights reserved.");
        Util.log("root: " + kazitori.root);
        Util.log("routes: \n" + routeArray.join('\n'));
        return Util.log("----------------------------------------");
      };

      return Util;

    })();
    return jpp.util.Namespace('jpp.milkpack').register('Util', Util);
  });

  jpp.util.Scope.temp(function() {
    var SceneStatus;
    jpp.util.Namespace('jpp.event').use();
    SceneStatus = (function(_super) {

      __extends(SceneStatus, _super);

      function SceneStatus() {
        return SceneStatus.__super__.constructor.apply(this, arguments);
      }

      SceneStatus.HELLO = 'hello';

      SceneStatus.ARRIVE = 'arrive';

      SceneStatus.STAY = 'stay';

      SceneStatus.LEAVE = 'leave';

      SceneStatus.BYE = 'bye';

      SceneStatus.GONE = 'gone';

      return SceneStatus;

    })(jpp.event.Event);
    return jpp.util.Namespace('jpp.milkpack').register('SceneStatus', SceneStatus);
  });

  jpp.util.Scope.temp(function() {
    var SceneEvent;
    jpp.util.Namespace('jpp.event').use();
    SceneEvent = (function(_super) {

      __extends(SceneEvent, _super);

      function SceneEvent() {
        return SceneEvent.__super__.constructor.apply(this, arguments);
      }

      SceneEvent.CHANGE_STATUS = 'chanegStatus';

      return SceneEvent;

    })(jpp.event.Event);
    return jpp.util.Namespace('jpp.milkpack').register('SceneEvent', SceneEvent);
  });

  jpp.util.Scope.temp(function() {
    var Scene;
    jpp.util.Namespace('jpp.command').use();
    jpp.util.Namespace('jpp.event').use();
    jpp.util.Namespace('jpp.milkpack').use();
    Scene = (function(_super) {

      __extends(Scene, _super);

      Scene.self = null;

      function Scene(manager, rule, fragment, params) {
        this._onBye = __bind(this._onBye, this);

        this._onLeave = __bind(this._onLeave, this);

        this._onArrive = __bind(this._onArrive, this);

        this._onHello = __bind(this._onHello, this);

        this._onInit = __bind(this._onInit, this);

        this._getBye = __bind(this._getBye, this);

        this._getLeave = __bind(this._getLeave, this);

        this._getArrive = __bind(this._getArrive, this);

        this._getHello = __bind(this._getHello, this);

        this._commandCompleteHandler = __bind(this._commandCompleteHandler, this);
        Scene.__super__.constructor.call(this, this);
        this._manager = manager;
        this._rule = rule;
        this._fragment = fragment;
        this._params = params;
        this.self = this;
        this._title = null;
        this._status = jpp.milkpack.SceneStatus.GONE;
        this._isInitialized = false;
        this._command = null;
        this._commandWrapper = null;
        this.__commandsHello = [];
        this.__commandsArrive = [];
        this.__commandsLeave = [];
        this.__commandsBye = [];
      }

      Scene.prototype.init = function() {
        if (this._isInitialized) {
          return;
        }
        this._isInitialized = true;
        return this._onInit();
      };

      Scene.prototype.hello = function() {
        return this._switchStatus(jpp.milkpack.SceneStatus.HELLO, this._getHello);
      };

      Scene.prototype.arrive = function() {
        return this._switchStatus(jpp.milkpack.SceneStatus.ARRIVE, this._getArrive);
      };

      Scene.prototype.leave = function() {
        return this._switchStatus(jpp.milkpack.SceneStatus.LEAVE, this._getLeave);
      };

      Scene.prototype.bye = function() {
        return this._switchStatus(jpp.milkpack.SceneStatus.BYE, this._getBye);
      };

      Scene.prototype.addCommand = function() {
        var commands, _ref;
        commands = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (this._commandWrapper !== null) {
          return (_ref = this._commandWrapper).addCommand.apply(_ref, commands);
        }
      };

      Scene.prototype.insertCommand = function() {
        var commands, _ref;
        commands = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (this._commandWrapper !== null) {
          return (_ref = this._commandWrapper).insertCommand.apply(_ref, commands);
        }
      };

      Scene.prototype._switchStatus = function(status, commandFunction) {
        if (this._command !== null) {
          jpp.milkpack.Util.log("Command is being executed (status = " + this._status + ")");
          return;
        }
        this._clearCommand();
        this._status = status;
        this._dispatchStatusEvent(this._status, false);
        this._command = commandFunction();
        this._command.addEventListener(jpp.event.Event.COMPLETE, this._commandCompleteHandler);
        return this._command.execute();
      };

      Scene.prototype._clearCommand = function() {
        if (this._command !== null) {
          this._command.removeEventListener(jpp.event.Event.COMPLETE, this._commandCompleteHandler);
          this._command.interrupt();
          return this._command = null;
        }
      };

      Scene.prototype._commandCompleteHandler = function(event) {
        var prevStatus;
        this._clearCommand();
        prevStatus = this._status;
        switch (this._status) {
          case jpp.milkpack.SceneStatus.ARRIVE:
            this._status = jpp.milkpack.SceneStatus.STAY;
            break;
          case jpp.milkpack.SceneStatus.BYE:
            this._status = jpp.milkpack.SceneStatus.GONE;
        }
        return this._dispatchStatusEvent(prevStatus, true);
      };

      Scene.prototype._dispatchStatusEvent = function(status, isComplete) {
        jpp.milkpack.Util.log("Scene '" + this._fragment + "' : " + status + " " + (isComplete ? 'End' : 'Begin'));
        return this.dispatchEvent(jpp.milkpack.SceneEvent.CHANGE_STATUS, {
          status: status,
          isComplete: isComplete
        });
      };

      Scene.prototype._getCommandInternal = function(protectedFunction, externalCommands) {
        this._commandWrapper = new jpp.command.Serial();
        if (this.__commandsHello.length === 0) {
          protectedFunction();
        } else {
          this._commandWrapper.addCommandArray(externalCommands);
        }
        return this._commandWrapper;
      };

      Scene.prototype.getIsInitialized = function() {
        return this._isInitialized;
      };

      Scene.prototype.getManager = function() {
        return this._manager;
      };

      Scene.prototype.getRule = function() {
        return this._rule;
      };

      Scene.prototype.getFragment = function() {
        return this._fragment;
      };

      Scene.prototype.getParams = function() {
        return this._params;
      };

      Scene.prototype.getStatus = function() {
        return this._status;
      };

      Scene.prototype._getHello = function() {
        return this._getCommandInternal(this._onHello, this.__commandsHello);
      };

      Scene.prototype.setHello = function() {
        var command;
        command = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.__commandsHello = command;
        return this;
      };

      Scene.prototype._getArrive = function() {
        return this._getCommandInternal(this._onArrive, this.__commandsArrive);
      };

      Scene.prototype.setArrive = function() {
        var command;
        command = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.__commandsArrive = command;
        return this;
      };

      Scene.prototype._getLeave = function() {
        return this._getCommandInternal(this._onLeave, this.__commandsLeave);
      };

      Scene.prototype.setLeave = function() {
        var command;
        command = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.__commandsLeave = command;
        return this;
      };

      Scene.prototype._getBye = function() {
        return this._getCommandInternal(this._onBye, this.__commandsBye);
      };

      Scene.prototype.setBye = function() {
        var command;
        command = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.__commandsBye = command;
        return this;
      };

      Scene.prototype.getTitle = function() {
        return this._title;
      };

      Scene.prototype.setTitle = function(title) {
        return this._title = title;
      };

      Scene.prototype._onInit = function() {};

      Scene.prototype._onHello = function() {};

      Scene.prototype._onArrive = function() {};

      Scene.prototype._onLeave = function() {};

      Scene.prototype._onBye = function() {};

      return Scene;

    })(jpp.event.EventDispatcher);
    return jpp.util.Namespace('jpp.milkpack').register('Scene', Scene);
  });

  jpp.util.Scope.temp(function() {
    var MilkpackEvent;
    jpp.util.Namespace('jpp.event').use();
    MilkpackEvent = (function(_super) {

      __extends(MilkpackEvent, _super);

      function MilkpackEvent() {
        return MilkpackEvent.__super__.constructor.apply(this, arguments);
      }

      MilkpackEvent.INIT = 'init';

      MilkpackEvent.CHANGE = 'change';

      return MilkpackEvent;

    })(jpp.event.Event);
    return jpp.util.Namespace('jpp.milkpack').register('MilkpackEvent', MilkpackEvent);
  });

  /*
   Copyright (c) 2013 Yukiya Okuda
   http://alumican.net/

   Milkpack is free software distributed under the terms of the MIT license:
   http://www.opensource.org/licenses/mit-license.php
  */


  jpp.util.Scope.temp(function() {
    var Milkpack;
    jpp.util.Namespace('jpp.util').use();
    jpp.util.Namespace('jpp.event').use();
    jpp.util.Namespace('jpp.milkpack').use();
    Milkpack = (function(_super) {

      __extends(Milkpack, _super);

      Milkpack.VERSION = '0.1.0';

      function Milkpack(option) {
        this._sceneChangeStatusHandler = __bind(this._sceneChangeStatusHandler, this);

        this._kazitoriExecutedHandler = __bind(this._kazitoriExecutedHandler, this);

        this._kazitoriRoutingNotFoundHandler = __bind(this._kazitoriRoutingNotFoundHandler, this);

        this._kazitoriRoutingHandler = __bind(this._kazitoriRoutingHandler, this);

        var fragments, getRouteHandler, kazitoriOption, kazitoriRoutes, rule, sceneClass, subRule, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
          _this = this;
        Milkpack.__super__.constructor.call(this, this);
        this._isReleaseMode = (_ref = option.isReleaseMode) != null ? _ref : true;
        this._log = jpp.milkpack.Util.log;
        this._queue = [];
        this._queuePosition = -1;
        this._direction = [];
        this._targetFragment = null;
        this._targetScene = null;
        this._currentScene = null;
        this._notFoundScene = null;
        this._isInGeneratingSubFragment = false;
        this._isRunning = false;
        this._scenes = {};
        this.root = (_ref1 = option.root) != null ? _ref1 : this.root;
        this.rootFile = (_ref2 = option.rootFile) != null ? _ref2 : this.rootFile;
        this.routes = (_ref3 = option.routes) != null ? _ref3 : this.routes;
        this.notFound = (_ref4 = option.notFound) != null ? _ref4 : this.notFound;
        kazitoriRoutes = {};
        getRouteHandler = function(rule, sceneClass) {
          return function() {
            var params;
            params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return _this._kazitoriRoutingHandler(rule, sceneClass, params);
          };
        };
        _ref5 = this.routes;
        for (rule in _ref5) {
          sceneClass = _ref5[rule];
          kazitoriRoutes[rule] = getRouteHandler(rule, sceneClass);
        }
        for (rule in this.routes) {
          fragments = jpp.milkpack.Util.decompseFragment(rule).route;
          for (_i = 0, _len = fragments.length; _i < _len; _i++) {
            subRule = fragments[_i];
            if (kazitoriRoutes[subRule] === void 0) {
              kazitoriRoutes[subRule] = getRouteHandler(subRule, null);
            }
          }
        }
        kazitoriOption = {};
        kazitoriOption.root = this.root;
        kazitoriOption.rootFile = this.rootFile;
        kazitoriOption.routes = kazitoriRoutes;
        kazitoriOption.isAutoStart = false;
        this._kazitori = new Kazitori(kazitoriOption);
        this._kazitori.addEventListener(KazitoriEvent.EXECUTED, this._kazitoriExecutedHandler);
        jpp.milkpack.Util.LOGGING = !this._isReleaseMode;
        jpp.milkpack.Util.printInit(Milkpack, this._kazitori, this.routes);
        this._initCommand = new jpp.command.Serial();
        this.onInit();
        new jpp.command.Serial(this._initCommand, function() {
          return _this._kazitori.start();
        }).execute();
      }

      Milkpack.prototype.goto = function(fragment) {
        this._log("goto : '" + fragment + "'");
        return this._kazitori.change(fragment);
      };

      Milkpack.prototype.replace = function(fragment) {
        this._log("replace : '" + fragment + "'");
        return this._kazitori.replace(fragment);
      };

      Milkpack.prototype.next = function() {
        this._log('next');
        return this._kazitori.torikazi();
      };

      Milkpack.prototype.prev = function() {
        this._log('prev');
        return this._kazitori.omokazi();
      };

      Milkpack.prototype.getScene = function(fragment) {
        var scene, tmpFragment;
        this._log("get scene : '" + fragment + "'");
        scene = this._scenes[fragment];
        if (scene === void 0) {
          this._log("get scene temporary : '" + fragment + "'");
          this._isInGeneratingSubFragment = true;
          tmpFragment = this._kazitori.fragment;
          this._kazitori.fragment = fragment;
          this._kazitori.executeHandlers();
          this._kazitori.fragment = tmpFragment;
          this._isInGeneratingSubFragment = false;
          scene = this._scenes[fragment];
        }
        if (scene.getIsInitialized() === false) {
          jpp.milkpack.Util.error("初期化されていないシーン'" + fragment + "'が呼び出されました");
        }
        return scene;
      };

      Milkpack.prototype.onInit = function() {};

      Milkpack.prototype.onSceneRequest = function(fragment, params) {
        return jpp.milkpack.Scene;
      };

      Milkpack.prototype.addCommand = function() {
        var commands, _ref;
        commands = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (this._initCommand !== null) {
          return (_ref = this._initCommand).addCommand.apply(_ref, commands);
        }
      };

      Milkpack.prototype.insertCommand = function() {
        var commands, _ref;
        commands = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (this._initCommand !== null) {
          return (_ref = this._initCommand).insertCommand.apply(_ref, commands);
        }
      };

      Milkpack.prototype.getTargetFragment = function() {
        return this._kazitori.fragment;
      };

      Milkpack.prototype.getTargetScene = function() {
        return this._taregtScene;
      };

      Milkpack.prototype._kazitoriRoutingHandler = function(rule, sceneClass, params) {
        var fragment, scene;
        fragment = this._kazitori.fragment;
        scene = this._scenes[fragment];
        if (scene === void 0) {
          this._log("create new Scene of '" + fragment + "'");
          if (typeof sceneClass === 'string') {
            sceneClass = eval(sceneClass);
          }
          if (sceneClass === null) {
            this._log("request Scene of '" + fragment + "'");
            sceneClass = this.onSceneRequest(fragment, params);
            if (sceneClass === void 0 || sceneClass === null) {
              this._log("default Scene of '" + fragment + "'");
              sceneClass = jpp.milkpack.Scene;
            }
          }
          scene = new sceneClass(this, rule, fragment, params);
          scene.init();
          this._scenes[fragment] = scene;
        }
        this._log("kazitoriRoutingHandler : rule     = " + (scene.getRule()));
        this._log("kazitoriRoutingHandler : fragment = " + (scene.getFragment()));
        return this._log("kazitoriRoutingHandler : params   = [" + (scene.getParams().join(', ')) + "]");
      };

      Milkpack.prototype._kazitoriRoutingNotFoundHandler = function(params) {
        this._log('404 :' + params.join(', '));
        if (this.notFound !== null) {
          if (this._notFoundScene === null) {
            this._notFoundScene = new this.notFound(this, '', this._kazitori.fragment, params);
            this._notFoundScene.init();
          }
          return this._pushRoute(this._kazitori.fragment);
        }
      };

      Milkpack.prototype._kazitoriExecutedHandler = function(event) {
        this._log("kazitoriExecutedHandler : isInGeneratingSubFragment = " + this._isInGeneratingSubFragment);
        this._log("kazitoriExecutedHandler : next                      = " + event.next);
        if (this._isInGeneratingSubFragment) {
          return;
        }
        return this._pushRoute(event.next);
      };

      Milkpack.prototype._pushRoute = function(fragment) {
        var direction, flow, prevTargetFragment, route;
        if (this._targetFragment === null) {
          flow = jpp.milkpack.Util.decompseFragment(fragment);
        } else {
          flow = jpp.milkpack.Util.complementFragment(this._targetFragment, fragment);
        }
        route = flow.route;
        direction = flow.direction;
        if (route === null) {
          return false;
        }
        if (route.length === 0) {
          return false;
        }
        if (route[route.length - 1] === this._targetFragment) {
          return false;
        }
        prevTargetFragment = this._targetFragment;
        this._targetFragment = route[route.length - 1];
        this._targetScene = this.getScene(this._targetFragment);
        if (this._queue.length > 0 && this._queue[this._queue.length - 1] === route[0]) {
          this._queue = this._queue.slice(0, this._queuePosition).concat(route);
          this._direction = this._direction.slice(0, this._queuePosition).concat(direction);
        } else {
          this._queue = this._queue.slice(0, +this._queuePosition + 1 || 9e9).concat(route);
          this._direction = this._direction.slice(0, +this._queuePosition + 1 || 9e9).concat(direction);
        }
        this._log("pushRoute : queue = '" + (this._queue.join('\' -> \'')) + "'");
        this._log("pushRoute : direction = '" + (this._direction.join('\' -> \'')) + "'");
        this._log("pushRoute : position = " + this._queuePosition);
        document.getElementsByTagName('title')[0].firstChild.nodeValue = this._targetScene.getTitle();
        this._log("change : route = '" + (route.join('\' -> \'')) + "'");
        this.dispatchEvent(jpp.milkpack.MilkpackEvent.CHANGE, {
          prev: prevTargetFragment,
          next: this._targetFragment
        });
        this._startAsync();
        return true;
      };

      Milkpack.prototype._startAsync = function() {
        if (this._isRunning) {
          return false;
        }
        if (this._currentScene === null) {
          this._log('start async process : first');
          return this._nextAsync();
        } else {
          if (this._currentScene.getStatus() === jpp.milkpack.SceneStatus.STAY) {
            this._log('start async process : leave');
            this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
            return this._currentScene.leave();
          } else {
            if (this._getNextDirection() < 0) {
              this._log('start async process : bye');
              this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
              return this._currentScene.bye();
            } else {
              this._log('start async process : next');
              return this._nextAsync();
            }
          }
        }
      };

      Milkpack.prototype._nextAsync = function() {
        var direction, fragment, _ref;
        this._log('next async process : first');
        if ((_ref = this._currentScene) != null) {
          _ref.removeEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
        }
        direction = this._getNextDirection();
        ++this._queuePosition;
        fragment = this._queue[this._queuePosition];
        this._currentScene = this.getScene(fragment);
        if (direction < 0 && fragment !== this._targetFragment) {
          this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
          return this._currentScene.bye();
        } else if (direction >= 0) {
          this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
          return this._currentScene.hello();
        } else if (this._queuePosition === this._queue.length - 1) {
          this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
          return this._currentScene.arrive();
        } else {
          return this._nextAsync();
        }
      };

      Milkpack.prototype._sceneChangeStatusHandler = function(event) {
        if (event.extra.isComplete) {
          this._isRunning = false;
          this._currentScene.removeEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
          switch (event.extra.status) {
            case jpp.milkpack.SceneStatus.HELLO:
              if (this._queuePosition === this._queue.length - 1) {
                this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
                return this._currentScene.arrive();
              } else if (this._getNextDirection() > 0) {
                return this._nextAsync();
              } else {
                this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
                return this._currentScene.bye();
              }
              break;
            case jpp.milkpack.SceneStatus.ARRIVE:
              if (this._queuePosition < this._queue.length - 1) {
                this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
                return this._currentScene.leave();
              }
              break;
            case jpp.milkpack.SceneStatus.LEAVE:
              if (this._getNextDirection() > 0) {
                return this._nextAsync();
              } else {
                this._currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, this._sceneChangeStatusHandler);
                return this._currentScene.bye();
              }
              break;
            case jpp.milkpack.SceneStatus.BYE:
              return this._nextAsync();
          }
        } else {
          return this._isRunning = true;
        }
      };

      Milkpack.prototype._getNextDirection = function() {
        if (this._queuePosition < 0) {
          return 1;
        }
        if (this._queuePosition === this._queue.length - 1) {
          return 0;
        }
        return jpp.milkpack.Util.getDirection(this._queue[this._queuePosition], this._queue[this._queuePosition + 1]);
      };

      return Milkpack;

    })(jpp.event.EventDispatcher);
    return jpp.util.Namespace('jpp.milkpack').register('Milkpack', Milkpack);
  });

}).call(this);
