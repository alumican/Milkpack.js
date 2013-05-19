(function() {
  var Application,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jpp.util.Namespace('jpp.event').use();

  jpp.util.Namespace('jpp.milkpack').use();

  Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.root = '/example/createjs-pushstate-slide/';

    Application.prototype.rootFile = 'index.html';

    Application.prototype.routes = {
      '/': 'IndexScene',
      '/title': 'PageScene',
      '/profile': 'PageScene',
      '/theme': 'PageScene',
      '/pushstate': 'PageScene',
      '/pushstate/<int:id>': 'PageScene',
      '/pushstate/pjax': 'PageScene',
      '/pushstate/pjax/<int:id>': 'PageScene',
      '/pushstate/backbone': 'PageScene',
      '/pushstate/backbone/<int:id>': 'PageScene',
      '/pushstate/kazitori': 'PageScene',
      '/pushstate/kazitori/<int:id>': 'PageScene',
      '/milkpack': 'PageScene',
      '/milkpack/<int:id>': 'PageScene',
      '/conclusion': 'PageScene',
      '/conclusion/<int:id>': 'PageScene',
      '/seeyou': 'LastScene'
    };

    Application.prototype.stage = null;

    Application.prototype.stageWidth = 0;

    Application.prototype.stageHeight = 0;

    Application.prototype.resourcesById = {};

    Application.prototype.pages = null;

    Application.prototype.pageLength = 0;

    Application.prototype.pageTypes = null;

    Application.prototype.pageFragments = null;

    Application.prototype.pageTree = null;

    Application.prototype.pageTreeNodes = null;

    Application.prototype.newPageType = -1;

    Application.prototype.oldPageType = -1;

    Application.prototype.pageContainer = null;

    Application.prototype.lineContainer = null;

    Application.prototype.moveContainer = null;

    Application.prototype.zoomContainer = null;

    Application.prototype.isKeyDown = false;

    Application.prototype.onInit = function() {
      var files, i, lineGraphics, loadQueue, loadQueueFunc, pageIndex, pageType, search, simpleCreatejs, _i, _ref,
        _this = this;
      simpleCreatejs = new SimpleCreateJS('canvas', 60, 30, function(stageWidth, stageHeight) {
        _this.stageWidth = stageWidth;
        _this.stageHeight = stageHeight;
        if (_this.zoomContainer) {
          _this.zoomContainer.x = _this.stageWidth / 2;
          _this.zoomContainer.y = _this.stageHeight / 2;
        }
        return _this.dispatchEvent(jpp.event.Event.RESIZE, {
          stageWidth: _this.stageWidth,
          stageHeight: _this.stageHeight
        });
      });
      this.stage = simpleCreatejs.stage;
      this.zoomContainer = new createjs.Container();
      this.zoomContainer.x = this.stageWidth / 2;
      this.zoomContainer.y = this.stageHeight / 2;
      this.stage.addChild(this.zoomContainer);
      this.moveContainer = new createjs.Container();
      this.moveContainer.visible = false;
      this.zoomContainer.addChild(this.moveContainer);
      this.lineContainer = new createjs.Shape();
      this.moveContainer.addChild(this.lineContainer);
      this.pageContainer = new createjs.Container();
      this.moveContainer.addChild(this.pageContainer);
      this.pageTree = {
        id: 'title',
        length: 0,
        branch: [
          {
            id: 'profile',
            length: 0,
            branch: []
          }, {
            id: 'theme',
            length: 0,
            branch: []
          }, {
            id: 'pushstate',
            length: 2,
            branch: [
              {
                id: 'pjax',
                length: 1,
                branch: []
              }, {
                id: 'backbone',
                length: 1,
                branch: []
              }, {
                id: 'kazitori',
                length: 2,
                branch: []
              }
            ]
          }, {
            id: 'milkpack',
            length: 12,
            branch: []
          }, {
            id: 'conclusion',
            length: 2,
            branch: []
          }
        ]
      };
      this.pageFragments = ['/'];
      this.pageTreeNodes = [null];
      this.pageTypes = [2];
      pageIndex = this.pageFragments.length;
      pageType = 0;
      lineGraphics = this.lineContainer.graphics;
      lineGraphics.setStrokeStyle(50);
      search = function(node, level, fragment, siblingIndex, siblingLength, x, y, angle) {
        var branch, branchAngle, branchLength, branchRadius, branchX, branchY, child, childLength, childRadius, i, lastChildX, lastChildY, range, _i, _j, _results;
        node.index = pageIndex;
        node.level = level;
        node.type = pageType;
        node.fragment = fragment === '' ? '/' + node.id : fragment;
        node.siblingIndex = siblingIndex;
        node.siblingLength = siblingLength;
        node.x = x;
        node.y = y;
        node.angle = angle;
        _this.pageTypes.push(node.type);
        _this.pageFragments.push(node.fragment);
        _this.pageTreeNodes.push(node);
        ++pageIndex;
        lastChildX = x;
        lastChildY = y;
        childLength = node.length;
        for (i = _i = 0; 0 <= childLength ? _i < childLength : _i > childLength; i = 0 <= childLength ? ++_i : --_i) {
          childRadius = 800 * (i + 1);
          child = {};
          child.index = pageIndex;
          child.level = level;
          child.type = pageType;
          child.fragment = fragment + '/' + (i + 1);
          child.siblingIndex = siblingIndex;
          child.siblingLength = siblingLength;
          child.x = x + childRadius * Math.cos(angle);
          child.y = y + childRadius * Math.sin(angle);
          child.angle = angle;
          _this.pageTypes.push(child.type);
          _this.pageFragments.push(child.fragment);
          _this.pageTreeNodes.push(child);
          ++pageIndex;
          lastChildX = child.x;
          lastChildY = child.y;
          /*
                          lineGraphics.beginStroke('#999999')
                          lineGraphics.moveTo(x, y)
                          lineGraphics.lineTo(child.x, child.y)
                          lineGraphics.endStroke()
          */

        }
        branchLength = node.branch.length;
        _results = [];
        for (i = _j = 0; 0 <= branchLength ? _j < branchLength : _j > branchLength; i = 0 <= branchLength ? ++_j : --_j) {
          branch = node.branch[i];
          if (branchLength === 1) {
            branchAngle = angle;
            branchRadius = 800 * (i + 1);
          } else {
            if (level === 0) {
              range = Math.PI * 2;
              branchAngle = angle + range * i / branchLength;
              branchRadius = 2000;
            } else {
              range = Math.PI * 2 / 3;
              branchAngle = angle + range * (i / (branchLength - 1) - 0.5);
              branchRadius = 1500;
            }
          }
          branchX = lastChildX + branchRadius * Math.cos(branchAngle);
          branchY = lastChildY + branchRadius * Math.sin(branchAngle);
          lineGraphics.beginStroke('#999999');
          lineGraphics.moveTo(lastChildX, lastChildY);
          lineGraphics.lineTo(branchX, branchY);
          lineGraphics.endStroke();
          ++pageType;
          _results.push(search(branch, level + 1, "" + fragment + "/" + branch.id, i, branchLength, branchX, branchY, branchAngle));
        }
        return _results;
      };
      search(this.pageTree, 0, '', 0, 1, 0, 0, 0);
      this.pageLength = pageIndex;
      this.pageFragments.push('/seeyou');
      this.pageTreeNodes.push(null);
      this.pageTypes.push(2);
      ++this.pageLength;
      for (i = _i = 0, _ref = this.pageLength - 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.pageTreeNodes[i + 1].color = '#' + tinycolor({
          h: 360 * i / (this.pageLength - 2),
          s: 40,
          v: 70
        }).toHex();
      }
      console.log(this.pageFragments.join('\n'));
      this.resourcesById = {};
      files = (function() {
        var _j, _ref1, _results;
        _results = [];
        for (i = _j = 0, _ref1 = this.pageLength; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          _results.push({
            id: "" + i,
            src: "" + this.root + "asset/page_" + (('000' + (i + 1)).substr(-4, 4)) + ".png"
          });
        }
        return _results;
      }).call(this);
      loadQueue = simpleCreatejs.createLoadQueue(files, createjs.Sound);
      loadQueueFunc = function() {
        return loadQueue.load();
      };
      return this.addCommand(new jpp.command.Func(loadQueueFunc, [], loadQueue, 'complete'), function() {
        var file, node, nodeColor, nodeFragment, nodeIndex, nodeLevel, page, view, _j, _k, _len, _ref1;
        for (_j = 0, _len = files.length; _j < _len; _j++) {
          file = files[_j];
          _this.resourcesById[file.id] = loadQueue.getResult(file.id);
        }
        _this.pages = [null];
        for (i = _k = 1, _ref1 = _this.pageLength - 1; 1 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 1 <= _ref1 ? ++_k : --_k) {
          node = _this.pageTreeNodes[i];
          nodeIndex = node.index;
          nodeLevel = node.level;
          nodeFragment = node.fragment;
          nodeColor = node.color;
          page = new Page(_this, _this.stage, nodeIndex, nodeLevel, nodeFragment, nodeColor, _this.resourcesById[i]);
          _this.pages.push(page);
          view = page.getView();
          view.x = node.x;
          view.y = node.y;
          if (nodeLevel === 0) {
            view.rotation = node.angle * 180 / Math.PI;
          } else {
            view.rotation = node.angle * 180 / Math.PI - 90;
          }
          /*
                              ratio = i / @pageLength
                              angle = ratio * Math.PI * 2
                              radius = 5000 #+ 1000 * Math.sin(angle * 5)
                              view.x = radius * Math.cos(angle)
                              view.y = radius * Math.sin(angle)
                              view.rotation = angle * 180 / Math.PI
          */

          /*
                              ratio = i / @pageLength
                              angle = ratio * Math.PI * 2
                              radius = 5000 + 1024 * nodeLevel
                              view.x = radius * Math.cos(angle)
                              view.y = radius * Math.sin(angle)
                              view.rotation = angle * 180 / Math.PI
          */

          /*
                              ratio = i / @pageLength
                              radius = 3000 + i * 100
                              angle = ratio * Math.PI * 2
                              view.x = radius * Math.cos(angle)
                              view.y = radius * Math.sin(angle)
                              view.rotation = angle * 180 / Math.PI
          */

          _this.pageContainer.addChild(view);
          page.show(false);
        }
        _this.pages.push(null);
        return $(document).keyup(function(event) {
          switch (event.keyCode) {
            case 38:
              return _this.gotoSpecifiedPageByIndex(0);
            case 40:
              break;
            case 37:
              return _this.gotoPrevPage();
            case 39:
              return _this.gotoNextPage();
          }
        });
      });
    };

    Application.prototype.gotoSpecifiedPageByIndex = function(index, useTransition) {
      var fragment;
      fragment = this.pageFragments[index];
      this.oldPageType = this.newPageType;
      this.newPageType = this.pageTypes[index];
      console.log("gotoSpecifiedPageByIndex: fragment = " + fragment);
      return this.goto(fragment);
    };

    Application.prototype.gotoNextPage = function(useTransition) {
      var fragment, index;
      fragment = this.getTargetFragment();
      index = this.pageFragments.indexOf(fragment) + 1;
      if (index > this.pageLength - 1) {
        return;
      }
      return this.gotoSpecifiedPageByIndex(index, useTransition);
    };

    Application.prototype.gotoPrevPage = function(useTransition) {
      var fragment, index;
      fragment = this.getTargetFragment();
      index = this.pageFragments.indexOf(fragment) - 1;
      if (index < 0) {
        return;
      }
      return this.gotoSpecifiedPageByIndex(index, useTransition);
    };

    Application.prototype.gotoSpecifiedPageByFragment = function(fragment, useTransition) {
      var index;
      index = this.pageFragments.indexOf(fragment);
      if (index !== -1) {
        return this.gotoSpecifiedPageByIndex(index, useTransition);
      }
    };

    Application.prototype.setButton = function(target, onClick) {
      var _this = this;
      target.onMouseOver = function(event) {
        target.alpha = 0.3;
        return $('#canvas').css('cursor', 'pointer');
      };
      target.onMouseOut = function(event) {
        target.alpha = 1;
        return $('#canvas').css('cursor', 'default');
      };
      return target.onClick = onClick;
    };

    return Application;

  })(jpp.milkpack.Milkpack);

  $(document).ready(function() {
    return new Application({
      isReleaseMode: false
    });
  });

}).call(this);

(function() {
  var Page;

  jpp.util.Namespace('jpp.command').use();

  Page = (function() {

    Page.prototype._index = -1;

    Page.prototype._level = -1;

    Page.prototype._fragment = '';

    Page.prototype._color = '';

    Page.prototype._stage = null;

    Page.prototype._view = null;

    Page.prototype._content = null;

    Page.prototype._base = null;

    Page.prototype._cover = null;

    Page.prototype._image = null;

    Page.prototype._isFocused = false;

    Page.prototype._defaultWidth = 1024;

    Page.prototype._defaultHeight = 768;

    function Page(manager, stage, index, level, fragment, color, image) {
      var _this = this;
      this._manager = manager;
      this._stage = stage;
      this._index = index;
      this._level = level;
      this._fragment = fragment;
      this._color = color;
      this._image = image;
      this._build();
      this._base.onMouseOver = function(event) {
        if (_this._isFocused) {
          return;
        }
        _this._view.addChild(_this._cover);
        return $(document).css('cursor', 'pointer');
      };
      this._base.onMouseOut = function(event) {
        _this._view.removeChild(_this._cover);
        return $(document).css('cursor', 'default');
      };
      this._base.onClick = function(event) {
        return _this._manager.gotoSpecifiedPageByFragment(_this._fragment);
      };
      this.hide(false);
    }

    Page.prototype._build = function() {
      this._view = new createjs.Container();
      this._view.regX = this._defaultWidth / 2;
      this._view.regY = this._defaultHeight / 2;
      this._base = new createjs.Shape();
      this._base.graphics.beginFill(this._color).drawRect(0, 0, this._defaultWidth, this._defaultHeight);
      this._base.shadow = new createjs.Shadow('#666666', 2, 2, 4);
      this._view.addChild(this._base);
      this._content = new createjs.Bitmap(this._image);
      this._view.addChild(this._content);
      this._cover = new createjs.Shape();
      this._cover.graphics.beginFill('#ffffff').drawRect(0, 0, this._defaultWidth, this._defaultHeight);
      return this._cover.alpha = 0.5;
    };

    Page.prototype.show = function(useTransition, execute) {
      var easing, time,
        _this = this;
      if (useTransition == null) {
        useTransition = true;
      }
      if (execute == null) {
        execute = true;
      }
      time = useTransition ? 1 : 0;
      easing = jpp.util.Easing.easeOutQuart;
      return CommandUtil.serial(execute, function() {
        return _this._view.visible = true;
      }, new jpp.command.Tween(this._view, {
        alpha: 1
      }, null, time, easing));
    };

    Page.prototype.hide = function(useTransition, execute) {
      var easing, time,
        _this = this;
      if (useTransition == null) {
        useTransition = true;
      }
      if (execute == null) {
        execute = true;
      }
      time = useTransition ? 1 : 0;
      easing = jpp.util.Easing.easeOutQuart;
      return CommandUtil.serial(execute, new jpp.command.Tween(this._view, {
        alpha: 0
      }, null, time, easing), function() {
        return _this._view.visible = false;
      });
    };

    Page.prototype.resizeTo = function(width, height, useTransition, execute, isFocused) {
      var baseScaleX, baseScaleY, contentRect, contentScaleX, contentScaleY, contentX, contentY, easing, time, viewRegX, viewRegY;
      if (width == null) {
        width = -1;
      }
      if (height == null) {
        height = -1;
      }
      if (useTransition == null) {
        useTransition = true;
      }
      if (execute == null) {
        execute = true;
      }
      if (isFocused == null) {
        isFocused = true;
      }
      this._base.onMouseOut();
      this._isFocused = isFocused;
      if (width === -1) {
        width = this._defaultWidth;
      }
      if (height === -1) {
        height = this._defaultHeight;
      }
      viewRegX = width / 2;
      viewRegY = height / 2;
      baseScaleX = width / this._defaultWidth;
      baseScaleY = height / this._defaultHeight;
      contentRect = RectangleResizer.resize(RectangleResizer.rect(0, 0, this._defaultWidth, this._defaultHeight), RectangleResizer.rect(0, 0, width, height));
      contentX = contentRect.x;
      contentY = contentRect.y;
      contentScaleX = contentRect.scaleX;
      contentScaleY = contentRect.scaleY;
      time = useTransition ? 1 : 0;
      easing = jpp.util.Easing.easeOutQuart;
      return CommandUtil.parallel(execute, new jpp.command.Tween(this._view, {
        regX: viewRegX,
        regY: viewRegY
      }, null, time, easing), new jpp.command.Tween(this._content, {
        x: contentX,
        y: contentY,
        scaleX: contentScaleX,
        scaleY: contentScaleY
      }, null, time, easing), new jpp.command.Tween(this._base, {
        scaleX: baseScaleX,
        scaleY: baseScaleY
      }, null, time, easing));
    };

    Page.prototype.resizeToDefault = function(useTransition, execute) {
      if (useTransition == null) {
        useTransition = true;
      }
      if (execute == null) {
        execute = true;
      }
      this._base.onMouseOut();
      return this.resizeTo(this._defaultWidth, this._defaultHeight, useTransition, execute, false);
    };

    Page.prototype.getView = function() {
      return this._view;
    };

    return Page;

  })();

  window.Page = Page;

}).call(this);

(function() {
  var IndexScene,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jpp.util.Namespace('jpp.command').use();

  jpp.util.Namespace('jpp.event').use();

  jpp.util.Namespace('jpp.milkpack').use();

  IndexScene = (function(_super) {

    __extends(IndexScene, _super);

    function IndexScene() {
      this.startLoop = __bind(this.startLoop, this);

      this._onBye = __bind(this._onBye, this);

      this._onLeave = __bind(this._onLeave, this);

      this._onArrive = __bind(this._onArrive, this);

      this._onHello = __bind(this._onHello, this);

      this._onInit = __bind(this._onInit, this);
      return IndexScene.__super__.constructor.apply(this, arguments);
    }

    IndexScene.prototype.manager = null;

    IndexScene.prototype.pageContainer = null;

    IndexScene.prototype.moveContainer = null;

    IndexScene.prototype.zoomContainer = null;

    IndexScene.prototype._loopCommand = null;

    IndexScene.prototype._loopIndex = -1;

    IndexScene.prototype._onInit = function() {
      this.manager = this.getManager();
      this.pageContainer = this.manager.pageContainer;
      this.moveContainer = this.manager.moveContainer;
      return this.zoomContainer = this.manager.zoomContainer;
    };

    IndexScene.prototype._onHello = function() {
      this.moveContainer.rotation = (1 + Math.random()) * 360;
      this.moveContainer.scaleX = 0;
      this.moveContainer.scaleY = 0;
      this.moveContainer.visible = true;
      return this.addCommand();
    };

    IndexScene.prototype._onArrive = function() {
      var easing, targetRotation, targetScale, targetX, targetY, time,
        _this = this;
      this.manager.stage.enableMouseOver(0);
      targetX = 200;
      targetY = 0;
      targetScale = 0.08;
      targetRotation = 0;
      time = 2;
      easing = jpp.util.Easing.easeInOutQuart;
      return this.addCommand(new jpp.command.Tween(this.moveContainer, {
        x: targetX,
        y: targetY,
        scaleX: targetScale,
        scaleY: targetScale,
        rotation: targetRotation
      }, null, time, easing), new jpp.command.Wait(2), function() {
        return _this.startLoop();
      });
    };

    IndexScene.prototype._onLeave = function() {
      var _ref;
      this.manager.stage.enableMouseOver(30);
      if ((_ref = this._loopCommand) != null) {
        _ref.interrupt();
      }
      return this.addCommand();
    };

    IndexScene.prototype._onBye = function() {
      return this.addCommand();
    };

    IndexScene.prototype.startLoop = function() {
      var angle, easing, radius, rotation0, rotation1, scale0, scale1, time, x0, x1, y0, y1, _ref, _ref1,
        _this = this;
      angle = Math.random() * Math.PI * 2;
      radius = Math.random() * 800;
      rotation0 = Math.random() * 360;
      x0 = 200 + radius * Math.cos(angle);
      y0 = radius * Math.cos(angle);
      scale0 = 0.03 + Math.random() * 0.5;
      rotation1 = Math.random() * 360;
      x1 = 200 + radius * Math.cos(angle + Math.PI);
      y1 = radius * Math.cos(angle + Math.PI);
      scale1 = 0.03 + Math.random() * 0.5;
      time = 10;
      easing = jpp.util.Easing.Linear;
      if ((_ref = this._loopCommand) != null) {
        _ref.interrupt();
      }
      this._loopCommand = new jpp.command.Serial(new jpp.command.Tween(this.moveContainer, {
        x: x1,
        y: y1,
        scaleX: scale1,
        scaleY: scale1,
        rotation: rotation1
      }, {
        x: x0,
        y: y0,
        scaleX: scale0,
        scaleY: scale0,
        rotation: rotation0
      }, time, easing), function() {
        return _this.startLoop();
      });
      this._loopCommand.execute();
      return;
      ++this._loopIndex;
      this._loopIndex %= 2;
      console.log(this._loopIndex);
      this._loopIndex = 1;
      if ((_ref1 = this._loopCommand) != null) {
        _ref1.interrupt();
      }
      switch (this._loopIndex) {
        case 0:
          rotation0 = 0;
          x0 = 200;
          y0 = 0;
          scale0 = 2;
          rotation1 = 360;
          x1 = 200;
          y1 = 0;
          scale1 = 0.05;
          time = 10;
          easing = jpp.util.Easing.easeInOutQuart;
          this._loopCommand = new jpp.command.Serial(new jpp.command.Tween(this.moveContainer, {
            x: x1,
            y: y1,
            scaleX: scale1,
            scaleY: scale1,
            rotation: rotation1
          }, {
            x: x0,
            y: y0,
            scaleX: scale0,
            scaleY: scale0,
            rotation: rotation0
          }, time, easing), function() {
            return _this.startLoop();
          });
          return this._loopCommand.execute();
        case 1:
          angle = Math.random() * Math.PI * 2;
          radius = Math.random() * 500;
          rotation0 = Math.random() * 360;
          x0 = 200 + radius * Math.cos(angle);
          y0 = radius * Math.cos(angle);
          scale0 = 0.05 + Math.random() * 2;
          rotation1 = Math.random() * 360;
          x1 = 200 + radius * Math.cos(angle + Math.PI);
          y1 = radius * Math.cos(angle + Math.PI);
          scale1 = 0.05 + Math.random() * 2;
          time = 10;
          easing = Math.random() < 0.5 ? jpp.util.Easing.easeInOutQuart : jpp.util.Easing.Linear;
          this._loopCommand = new jpp.command.Serial(new jpp.command.Tween(this.moveContainer, {
            x: x1,
            y: y1,
            scaleX: scale1,
            scaleY: scale1,
            rotation: rotation1
          }, {
            x: x0,
            y: y0,
            scaleX: scale0,
            scaleY: scale0,
            rotation: rotation0
          }, time, easing), function() {
            return _this.startLoop();
          });
          return this._loopCommand.execute();
      }
    };

    return IndexScene;

  })(jpp.milkpack.Scene);

  window.IndexScene = IndexScene;

}).call(this);

(function() {
  var LastScene,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jpp.util.Namespace('jpp.command').use();

  jpp.util.Namespace('jpp.event').use();

  jpp.util.Namespace('jpp.milkpack').use();

  LastScene = (function(_super) {

    __extends(LastScene, _super);

    function LastScene() {
      this._onBye = __bind(this._onBye, this);

      this._onLeave = __bind(this._onLeave, this);

      this._onArrive = __bind(this._onArrive, this);

      this._onHello = __bind(this._onHello, this);

      this._onInit = __bind(this._onInit, this);
      return LastScene.__super__.constructor.apply(this, arguments);
    }

    LastScene.prototype.manager = null;

    LastScene.prototype.pageContainer = null;

    LastScene.prototype.moveContainer = null;

    LastScene.prototype.zoomContainer = null;

    LastScene.stage = null;

    LastScene.image = null;

    LastScene.bitmap = null;

    LastScene.prototype._onInit = function() {
      this.manager = this.getManager();
      this.pageContainer = this.manager.pageContainer;
      this.moveContainer = this.manager.moveContainer;
      this.zoomContainer = this.manager.zoomContainer;
      this.stage = this.manager.stage;
      this.image = this.manager.resourcesById[this.manager.pageLength - 1];
      return this.bitmap = new createjs.Bitmap(this.image);
    };

    LastScene.prototype._onHello = function() {
      return this.addCommand();
    };

    LastScene.prototype._onArrive = function() {
      var easing, targetRotation, targetScale, targetX, targetY, time;
      this.stage.addChild(this.bitmap);
      this.bitmap.alpha = 0;
      this.bitmap.x = (this.manager.stageWidth - 1024) / 2;
      this.bitmap.y = (this.manager.stageHeight - 768) / 2;
      targetX = 0;
      targetY = 0;
      targetScale = 0;
      targetRotation = Math.random() * Math.PI * 2;
      time = 2;
      easing = jpp.util.Easing.easeInOutQuart;
      return this.addCommand(new jpp.command.Tween(this.moveContainer, {
        x: targetX,
        y: targetY,
        scaleX: targetScale,
        scaleY: targetScale,
        rotation: targetRotation
      }, null, time, easing), new jpp.command.Tween(this.bitmap, {
        alpha: 1
      }, null, 1, jpp.util.Easing.Linear));
    };

    LastScene.prototype._onLeave = function() {
      this.stage.removeChild(this.bitmap);
      return this.addCommand();
    };

    LastScene.prototype._onBye = function() {
      return this.addCommand();
    };

    return LastScene;

  })(jpp.milkpack.Scene);

  window.LastScene = LastScene;

}).call(this);

(function() {
  var PageScene,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jpp.util.Namespace('jpp.command').use();

  jpp.util.Namespace('jpp.event').use();

  jpp.util.Namespace('jpp.milkpack').use();

  PageScene = (function(_super) {

    __extends(PageScene, _super);

    function PageScene() {
      this._stageResizeHandler = __bind(this._stageResizeHandler, this);

      this._onBye = __bind(this._onBye, this);

      this._onLeave = __bind(this._onLeave, this);

      this._onArrive = __bind(this._onArrive, this);

      this._onHello = __bind(this._onHello, this);

      this._onInit = __bind(this._onInit, this);
      return PageScene.__super__.constructor.apply(this, arguments);
    }

    PageScene.prototype.manager = null;

    PageScene.prototype.pageIndex = -1;

    PageScene.prototype.pageType = -1;

    PageScene.prototype.pageLevel = -1;

    PageScene.prototype.page = null;

    PageScene.prototype.pageView = null;

    PageScene.prototype.pageContainer = null;

    PageScene.prototype.zoomContainer = null;

    PageScene.prototype._onInit = function() {
      this.manager = this.getManager();
      this.pageIndex = this.manager.pageFragments.indexOf(this.getFragment());
      this.pageType = this.manager.pageTypes[this.pageIndex];
      this.pageLevel = this.manager.pageTreeNodes[this.pageIndex].level;
      this.page = this.manager.pages[this.pageIndex];
      this.pageContainer = this.manager.pageContainer;
      this.moveContainer = this.manager.moveContainer;
      this.zoomContainer = this.manager.zoomContainer;
      return this.pageView = this.page.getView();
    };

    PageScene.prototype._onHello = function() {
      return this.addCommand();
    };

    PageScene.prototype._onArrive = function() {
      var cos, easing, pageViewX, pageViewY, rad, sin, targetRotation, targetScale, targetX, targetY, time, zoomScale, zoomTime;
      this.manager.addEventListener(jpp.event.Event.RESIZE, this._stageResizeHandler);
      this.page.resizeTo(this.manager.stageWidth, this.manager.stageHeight);
      pageViewX = this.pageView.x;
      pageViewY = this.pageView.y;
      rad = this.pageView.rotation * Math.PI / 180;
      sin = Math.sin(rad);
      cos = Math.cos(rad);
      targetX = -(cos * pageViewX + sin * pageViewY);
      targetY = -(-sin * pageViewX + cos * pageViewY);
      targetScale = 1;
      targetRotation = -this.pageView.rotation;
      easing = jpp.util.Easing.easeInOutQuart;
      if (this.pageLevel === 0) {
        time = 1;
        zoomScale = this.zoomContainer.scaleX * 0.8;
        zoomTime = 0.5;
        easing = jpp.util.Easing.easeInOutQuart;
        /*
                    time = 1
                    @addCommand(
                        new jpp.command.Parallel(
                            new jpp.command.Tween(@zoomContainer, { scaleX:1, scaleY: 1 }, null, time, jpp.util.Easing.easeInOutQuart)
                            new jpp.command.Tween(@moveContainer, { x: targetX, y:targetY, scaleX:targetScale, scaleY: targetScale, rotation: targetRotation }, null, time, easing)
                        )
                    )
                    return
        */

      } else if (this.pageType !== this.manager.oldPageType) {
        time = 2;
        zoomScale = 0.1 * this.pageLevel;
        zoomTime = 0.5;
      } else {
        time = 1;
        zoomScale = 0.7;
        zoomTime = 0.7;
      }
      return this.addCommand(new jpp.command.Parallel(new jpp.command.Serial(new jpp.command.Tween(this.zoomContainer, {
        scaleX: zoomScale,
        scaleY: zoomScale
      }, null, time * 0.5, jpp.util.Easing.easeOutQuart), new jpp.command.Tween(this.zoomContainer, {
        scaleX: 1,
        scaleY: 1
      }, null, time * zoomTime, jpp.util.Easing.easeInOutQuart)), new jpp.command.Tween(this.moveContainer, {
        x: targetX,
        y: targetY,
        scaleX: targetScale,
        scaleY: targetScale,
        rotation: targetRotation
      }, null, time, easing)));
    };

    PageScene.prototype._onLeave = function() {
      this.manager.removeEventListener(jpp.event.Event.RESIZE, this._stageResizeHandler);
      this.page.resizeToDefault();
      return this.addCommand();
    };

    PageScene.prototype._onBye = function() {
      return this.addCommand();
    };

    PageScene.prototype._stageResizeHandler = function(event) {
      return this.page.resizeTo(this.manager.stageWidth, this.manager.stageHeight, false);
    };

    return PageScene;

  })(jpp.milkpack.Scene);

  window.PageScene = PageScene;

}).call(this);

(function() {
  var CommandUtil,
    __slice = [].slice;

  jpp.util.Namespace('jpp.command').use();

  CommandUtil = (function() {

    function CommandUtil() {}

    CommandUtil.serial = function() {
      var c, commands, execute;
      execute = arguments[0], commands = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      c = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(jpp.command.Serial, commands, function(){});
      if (execute) {
        c.execute();
      }
      return c;
    };

    CommandUtil.parallel = function() {
      var c, commands, execute;
      execute = arguments[0], commands = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      c = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(jpp.command.Parallel, commands, function(){});
      if (execute) {
        c.execute();
      }
      return c;
    };

    return CommandUtil;

  })();

  window.CommandUtil = CommandUtil;

}).call(this);

(function() {
  var RectangleResizer;

  RectangleResizer = (function() {

    function RectangleResizer() {}

    RectangleResizer.EXACT_FIT = 'ecaxtFit';

    RectangleResizer.SHOW_ALL = 'showAll';

    RectangleResizer.NO_BORDER = 'noBorder';

    RectangleResizer.NO_SCALE = 'noScale';

    RectangleResizer.TOP_LEFT = 'TL';

    RectangleResizer.TOP = 'T';

    RectangleResizer.TOP_RIGHT = 'TR';

    RectangleResizer.LEFT = 'L';

    RectangleResizer.CENTER = '';

    RectangleResizer.RIGHT = 'R';

    RectangleResizer.BOTTOM_LEFT = 'BL';

    RectangleResizer.BOTTOM = 'B';

    RectangleResizer.BOTTOM_RIGHT = 'BR';

    RectangleResizer.resize = function(target, boundary, scaleMode, align) {
      var h0, h1, ratio, ratioH, ratioW, w0, w1, x0, x1, y0, y1;
      if (scaleMode == null) {
        scaleMode = 'showAll';
      }
      if (align == null) {
        align = '';
      }
      x0 = target.x;
      y0 = target.y;
      w0 = target.width;
      h0 = target.height;
      x1 = boundary.x;
      y1 = boundary.y;
      w1 = boundary.width;
      h1 = boundary.height;
      switch (scaleMode) {
        case 'showAll':
        case 'noBorder':
          ratioW = w1 / w0;
          ratioH = h1 / h0;
          ratio = scaleMode === 'showAll' ? (ratioW < ratioH ? ratioW : ratioH) : (ratioW > ratioH ? ratioW : ratioH);
          w0 *= ratio;
          h0 *= ratio;
          break;
        case 'exactFit':
          return {
            x: x1,
            y: y1,
            width: w1,
            height: h1,
            scaleX: w1 / w0,
            scaleY: h1 / h0
          };
      }
      x0 = x1 + (align === 'TL' || align === 'L' || align === 'BL' ? 0 : (align === 'TR' || align === 'R' || align === 'BR' ? w1 - w0 : (w1 - w0) / 2));
      y0 = y1 + (align === 'TL' || align === 'T' || align === 'TR' ? 0 : (align === 'BL' || align === 'B' || align === 'BR' ? h1 - h0 : (h1 - h0) / 2));
      return {
        x: x0,
        y: y0,
        width: w0,
        height: h0,
        scaleX: w0 / target.width,
        scaleY: h0 / target.height
      };
    };

    RectangleResizer.rect = function(x, y, width, height) {
      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    };

    return RectangleResizer;

  })();

  window.RectangleResizer = RectangleResizer;

}).call(this);

(function() {
  var SimpleCreateJS,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SimpleCreateJS = (function() {

    SimpleCreateJS.prototype.stage = null;

    SimpleCreateJS.prototype.stageWidth = 0;

    SimpleCreateJS.prototype.stageHeight = 0;

    SimpleCreateJS.prototype.onUpdate = null;

    SimpleCreateJS.prototype.onRender = null;

    SimpleCreateJS.prototype.onResize = null;

    SimpleCreateJS.prototype.onLoad = null;

    SimpleCreateJS.prototype._$sizeref = null;

    SimpleCreateJS.prototype._$canvas = null;

    function SimpleCreateJS(canvasId, frameRate, mouseRate, onResize) {
      if (frameRate == null) {
        frameRate = 60;
      }
      if (mouseRate == null) {
        mouseRate = 0;
      }
      if (onResize == null) {
        onResize = null;
      }
      this._loadCmpleteHandler = __bind(this._loadCmpleteHandler, this);

      this._windowResizeHandler = __bind(this._windowResizeHandler, this);

      this._createjsTickHandler = __bind(this._createjsTickHandler, this);

      this._$canvas = $("#" + canvasId);
      if (this._$canvas.length === 0) {
        this._$canvas = $('<canvas>');
        this._$canvas.attr('id', canvasId);
        this._$canvas.css({
          position: 'absolute',
          'z-index': 1,
          top: 0,
          left: 0
        });
        $('body').append(this._$canvas);
      }
      this._$sizeref = $('<div>');
      this._$sizeref.css({
        position: 'absolute',
        'z-index': 0,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      });
      $('body').append(this._$sizeref);
      this.stage = new createjs.Stage(canvasId);
      if (mouseRate > 0) {
        this.stage.enableMouseOver(mouseRate);
      }
      createjs.Ticker.setFPS(frameRate);
      createjs.Ticker.addEventListener('tick', this._createjsTickHandler);
      this.onResize = onResize;
      $(window).resize(this._windowResizeHandler);
      this._windowResizeHandler();
    }

    SimpleCreateJS.prototype._createjsTickHandler = function(event) {
      if (typeof this.onUpdate === "function") {
        this.onUpdate();
      }
      this.stage.update();
      return typeof this.onRender === "function" ? this.onRender() : void 0;
    };

    SimpleCreateJS.prototype._windowResizeHandler = function(event) {
      this.stageWidth = this._$sizeref.width();
      this.stageHeight = this._$sizeref.height();
      this._$canvas.attr({
        width: this.stageWidth
      });
      this._$canvas.attr({
        height: this.stageHeight
      });
      return typeof this.onResize === "function" ? this.onResize(this.stageWidth, this.stageHeight) : void 0;
    };

    SimpleCreateJS.prototype.createLoadQueue = function(files, plugins, onLoad) {
      var plugin, queue, _i, _len;
      if (plugins == null) {
        plugins = null;
      }
      if (onLoad == null) {
        onLoad = null;
      }
      queue = new createjs.LoadQueue();
      queue.addEventListener('complete', this._loadCmpleteHandler);
      if (plugins !== null) {
        if (!(plugins instanceof Array)) {
          plugins = [plugins];
        }
        for (_i = 0, _len = plugins.length; _i < _len; _i++) {
          plugin = plugins[_i];
          queue.installPlugin(plugin);
        }
      }
      if (!(files instanceof Array)) {
        files = [files];
      }
      queue.loadManifest(files, false);
      this.onLoad = onLoad;
      return queue;
    };

    SimpleCreateJS.prototype._loadCmpleteHandler = function(event) {
      var queue;
      queue = event.target;
      return typeof this.onLoad === "function" ? this.onLoad(queue) : void 0;
    };

    return SimpleCreateJS;

  })();

  window.SimpleCreateJS = SimpleCreateJS;

}).call(this);
