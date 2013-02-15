(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jpp.util.Scope.temp(function() {
    var Application, DisplayScene, IndexScene, PageAScene, PageBScene, PageCScene, PageDScene, PageScene;
    jpp.util.Namespace('jpp.command').use();
    jpp.util.Namespace('jpp.milkpack').use();
    DisplayScene = (function(_super) {

      __extends(DisplayScene, _super);

      function DisplayScene() {
        this._onResize = __bind(this._onResize, this);

        this._resizeHandler = __bind(this._resizeHandler, this);

        this._onInit = __bind(this._onInit, this);
        return DisplayScene.__super__.constructor.apply(this, arguments);
      }

      DisplayScene.prototype._onInit = function() {
        this.manager = this.getManager();
        this.manager.addEventListener(jpp.event.Event, this._resizeHandler);
        return this.stage = this.manager.stage;
      };

      DisplayScene.prototype._resizeHandler = function(event) {
        return this._onResize(event.extra.stageWidth, event.extra.stageHeight);
      };

      DisplayScene.prototype._onResize = function(stageWidth, stageHeight) {};

      return DisplayScene;

    })(jpp.milkpack.Scene);
    IndexScene = (function(_super) {

      __extends(IndexScene, _super);

      function IndexScene() {
        this._onResize = __bind(this._onResize, this);

        this._onBye = __bind(this._onBye, this);

        this._onLeave = __bind(this._onLeave, this);

        this._onArrive = __bind(this._onArrive, this);

        this._onHello = __bind(this._onHello, this);

        this._buttonClickHandler = __bind(this._buttonClickHandler, this);

        this._buttonMouseOutHandler = __bind(this._buttonMouseOutHandler, this);

        this._buttonMouseOverHandler = __bind(this._buttonMouseOverHandler, this);

        this._onInit = __bind(this._onInit, this);
        return IndexScene.__super__.constructor.apply(this, arguments);
      }

      IndexScene.prototype._onInit = function() {
        var button, buttonFragments, buttonIndex, buttonMargin, buttonRadius, getClickHandler,
          _this = this;
        IndexScene.__super__._onInit.call(this);
        this.textContainer = new createjs.Container();
        this.textContainer.alpha = 0;
        this.stage.addChild(this.textContainer);
        this.titleText = new createjs.Text('CreateJS & MilkpackJS\nPushState Demo', '60px Arial', '#333');
        this.titleText.textAlign = 'center';
        this.titleText.lineHeight = 80;
        this.titleTextOffsetY = -75 - 100;
        this.titleTextMoveY = 50;
        this.titleText.y = this.titleTextOffsetY - this.titleTextMoveY;
        this.titleText.onMouseOver = this._buttonMouseOverHandler;
        this.titleText.onMouseOut = this._buttonMouseOutHandler;
        this.titleText.onClick = function(event) {
          return _this.manager.goto('/');
        };
        this.titleTextArea = new createjs.Shape();
        this.titleTextArea.graphics.beginFill('#000').drawRect(-320, 0, 640, 150);
        this.titleText.hitArea = this.titleTextArea;
        this.textContainer.addChild(this.titleText);
        buttonFragments = ['/A', '/B', '/C', '/D'];
        this.buttons = new Array(this.buttonLength);
        this.buttonLength = buttonFragments.length;
        buttonMargin = 50;
        buttonIndex = 0;
        buttonRadius = 10;
        getClickHandler = function(buttonIndex) {
          return function(event) {
            return _this._buttonClickHandler();
          };
        };
        while (buttonIndex < this.buttonLength) {
          button = new createjs.Shape();
          button.graphics.beginFill('#000').drawCircle(0, 0, buttonRadius);
          button.x = buttonMargin * (buttonIndex - (this.buttonLength - 1) / 2);
          button.fragment = buttonFragments[buttonIndex];
          button.onMouseOver = this._buttonMouseOverHandler;
          button.onMouseOut = this._buttonMouseOutHandler;
          button.onClick = this._buttonClickHandler;
          this.textContainer.addChild(button);
          this.buttons[buttonIndex] = button;
          ++buttonIndex;
        }
        return this._onResize(this.manager.stageWidth, this.manager.stageHeight);
      };

      IndexScene.prototype._buttonMouseOverHandler = function(event) {
        var button;
        button = event.target;
        button.alpha = 0.3;
        return $('#canvas').css('cursor', 'pointer');
      };

      IndexScene.prototype._buttonMouseOutHandler = function(event) {
        var button;
        button = event.target;
        button.alpha = 1;
        return $('#canvas').css('cursor', 'default');
      };

      IndexScene.prototype._buttonClickHandler = function(event) {
        var button;
        button = event.target;
        return this.manager.goto(button.fragment);
      };

      IndexScene.prototype._onHello = function() {
        return this.addCommand(new jpp.command.Parallel(new jpp.command.Tween(this.titleText, {
          y: this.titleTextOffsetY
        }, null, 1, jpp.util.Easing.easeOutBounce), new jpp.command.Tween(this.textContainer, {
          alpha: 1
        }, null, 1, jpp.util.Easing.easeOutQuart)));
      };

      IndexScene.prototype._onArrive = function() {
        return this.addCommand();
      };

      IndexScene.prototype._onLeave = function() {
        return this.addCommand();
      };

      IndexScene.prototype._onBye = function() {
        return this.addCommand(new jpp.command.Parallel(new jpp.command.Tween(this.titleText, {
          y: this.titleTextOffsetY - this.titleTextMoveY
        }, null, 1, jpp.util.Easing.easeOutQuart), new jpp.command.Tween(this.textContainer, {
          alpha: 0
        }, null, 1, jpp.util.Easing.easeOutQuart)));
      };

      IndexScene.prototype._onResize = function(stageWidth, stageHeight) {
        this.textContainer.x = stageWidth / 2;
        return this.textContainer.y = stageHeight / 2 + 40;
      };

      return IndexScene;

    })(DisplayScene);
    PageScene = (function(_super) {

      __extends(PageScene, _super);

      function PageScene() {
        this._onResize = __bind(this._onResize, this);

        this._onBye = __bind(this._onBye, this);

        this._onLeave = __bind(this._onLeave, this);

        this._onArrive = __bind(this._onArrive, this);

        this._onHello = __bind(this._onHello, this);

        this._onInit = __bind(this._onInit, this);
        return PageScene.__super__.constructor.apply(this, arguments);
      }

      PageScene.prototype._onInit = function(text) {
        PageScene.__super__._onInit.call(this);
        this.textContainer = new createjs.Container();
        this.stage.addChild(this.textContainer);
        this.titleText = new createjs.Text(text, '40px Arial', '#333');
        this.titleText.textAlign = 'center';
        this.titleText.alpha = 0;
        this.titleTextMoveX = 300;
        this.titleText.x = this.titleTextMoveX;
        this.titleText.y = 30;
        this.textContainer.addChild(this.titleText);
        return this._onResize(this.manager.stageWidth, this.manager.stageHeight);
      };

      PageScene.prototype._onHello = function() {
        return this.addCommand(new jpp.command.Tween(this.titleText, {
          alpha: 1,
          x: 0
        }, {
          x: this.titleTextMoveX
        }, 1, jpp.util.Easing.easeOutBounce));
      };

      PageScene.prototype._onArrive = function() {
        return this.addCommand();
      };

      PageScene.prototype._onLeave = function() {
        return this.addCommand();
      };

      PageScene.prototype._onBye = function() {
        return this.addCommand(new jpp.command.Tween(this.titleText, {
          alpha: 0,
          x: -this.titleTextMoveX
        }, {
          x: 0
        }, 1, jpp.util.Easing.easeOutQuart));
      };

      PageScene.prototype._onResize = function(stageWidth, stageHeight) {
        this.textContainer.x = stageWidth / 2;
        return this.textContainer.y = stageHeight / 2 + 40;
      };

      return PageScene;

    })(DisplayScene);
    PageAScene = (function(_super) {

      __extends(PageAScene, _super);

      function PageAScene() {
        this._onInit = __bind(this._onInit, this);
        return PageAScene.__super__.constructor.apply(this, arguments);
      }

      PageAScene.prototype._onInit = function() {
        return PageAScene.__super__._onInit.call(this, 'This is Scene A');
      };

      return PageAScene;

    })(PageScene);
    PageBScene = (function(_super) {

      __extends(PageBScene, _super);

      function PageBScene() {
        this._onInit = __bind(this._onInit, this);
        return PageBScene.__super__.constructor.apply(this, arguments);
      }

      PageBScene.prototype._onInit = function() {
        return PageBScene.__super__._onInit.call(this, 'This is Scene B');
      };

      return PageBScene;

    })(PageScene);
    PageCScene = (function(_super) {

      __extends(PageCScene, _super);

      function PageCScene() {
        this._onInit = __bind(this._onInit, this);
        return PageCScene.__super__.constructor.apply(this, arguments);
      }

      PageCScene.prototype._onInit = function() {
        return PageCScene.__super__._onInit.call(this, 'This is Scene C');
      };

      return PageCScene;

    })(PageScene);
    PageDScene = (function(_super) {

      __extends(PageDScene, _super);

      function PageDScene() {
        this._onInit = __bind(this._onInit, this);
        return PageDScene.__super__.constructor.apply(this, arguments);
      }

      PageDScene.prototype._onInit = function() {
        return PageDScene.__super__._onInit.call(this, 'This is Scene D');
      };

      return PageDScene;

    })(PageScene);
    Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        this._windowResizeHandler = __bind(this._windowResizeHandler, this);

        this._tickerTickHandler = __bind(this._tickerTickHandler, this);
        return Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.root = '/';

      Application.prototype.rootFile = 'index.html';

      Application.prototype.routes = {
        '/': IndexScene,
        '/A': PageAScene,
        '/B': PageBScene,
        '/C': PageCScene,
        '/D': PageDScene
      };

      Application.prototype.onInit = function() {
        this.stage = new createjs.Stage('canvas');
        this.stage.enableMouseOver(30);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', this._tickerTickHandler);
        $(window).resize = this._windowResizeHandler;
        return this._windowResizeHandler();
      };

      Application.prototype._tickerTickHandler = function(event) {
        return this.stage.update();
      };

      Application.prototype._windowResizeHandler = function(event) {
        var canvas, sizeref;
        sizeref = $('#sizeref');
        this.stageWidth = sizeref.width();
        this.stageHeight = sizeref.height();
        canvas = $('#canvas');
        canvas.attr({
          width: this.stageWidth
        });
        canvas.attr({
          height: this.stageHeight
        });
        return this.dispatchEvent(jpp.event.Event.RESIZE, {
          stageWidth: this.stageWidth,
          stageHeight: this.stageHeight
        });
      };

      return Application;

    })(jpp.milkpack.Milkpack);
    return $(document).ready(function() {
      var app;
      return app = new Application({
        isReleaseMode: false
      });
    });
  });

}).call(this);
