(function() {
  var AboutScene, Application, DisplayScene, GalleryScene, IndexScene, PageScene, PhotoScene, createButton,
    _this = this,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jpp.util.Namespace('jpp.command').use();

  jpp.util.Namespace('jpp.event').use();

  jpp.util.Namespace('jpp.milkpack').use();

  createButton = function(container, fragments, onClick, offsetY) {
    var button, buttonIndex, buttonLength, buttonMargin, buttonMouseOutHandler, buttonMouseOverHandler, buttonRadius, buttons;
    buttonLength = fragments.length;
    buttons = new Array(buttonLength);
    buttonMargin = 50;
    buttonIndex = 0;
    buttonRadius = 10;
    buttonMouseOverHandler = function(event) {
      var button;
      button = event.target;
      button.alpha = 0.3;
      return $('#canvas').css('cursor', 'pointer');
    };
    buttonMouseOutHandler = function(event) {
      var button;
      button = event.target;
      button.alpha = 1;
      return $('#canvas').css('cursor', 'default');
    };
    while (buttonIndex < buttonLength) {
      button = new createjs.Shape();
      button.graphics.beginFill('#000').drawCircle(0, 0, buttonRadius);
      button.x = buttonMargin * (buttonIndex - (buttonLength - 1) / 2);
      button.y = container.y + offsetY;
      button.fragment = fragments[buttonIndex];
      button.onMouseOver = buttonMouseOverHandler;
      button.onMouseOut = buttonMouseOutHandler;
      button.onClick = onClick;
      container.addChild(button);
      buttons[buttonIndex] = button;
      ++buttonIndex;
    }
    return buttons;
  };

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
      this.manager.addEventListener(jpp.event.Event.RESIZE, this._resizeHandler);
      this.stage = this.manager.stage;
      this.textContainer = new createjs.Container();
      this.textContainer.alpha = 0;
      return this.stage.addChild(this.textContainer);
    };

    DisplayScene.prototype._resizeHandler = function(event) {
      return this._onResize(event.extra.stageWidth, event.extra.stageHeight);
    };

    DisplayScene.prototype._onResize = function(stageWidth, stageHeight) {
      this.textContainer.x = stageWidth / 2;
      return this.textContainer.y = 0;
    };

    return DisplayScene;

  })(jpp.milkpack.Scene);

  IndexScene = (function(_super) {

    __extends(IndexScene, _super);

    function IndexScene() {
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
      var _this = this;
      IndexScene.__super__._onInit.call(this);
      this.titleText = new createjs.Text('CreateJS & MilkpackJS\nPushState Demo', '60px Arial', '#333');
      this.titleText.textAlign = 'center';
      this.titleText.lineHeight = 80;
      this.titleTextOffsetY = 50;
      this.titleTextMoveY = 50;
      this.titleText.y = this.titleTextOffsetY - this.titleTextMoveY;
      this.titleText.onMouseOver = this._buttonMouseOverHandler;
      this.titleText.onMouseOut = this._buttonMouseOutHandler;
      this.titleText.onClick = function(event) {
        return _this.manager.goto('/');
      };
      this.titleTextArea = new createjs.Shape();
      this.titleTextArea.graphics.beginFill('#000').drawRect(-320, this.titleTextOffsetY, 640, 150);
      this.titleText.hitArea = this.titleTextArea;
      this.textContainer.addChild(this.titleText);
      createButton(this.textContainer, ['/about', '/gallery'], this._buttonClickHandler, 230);
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

    return IndexScene;

  })(DisplayScene);

  PageScene = (function(_super) {

    __extends(PageScene, _super);

    function PageScene() {
      this._onBye = __bind(this._onBye, this);

      this._onLeave = __bind(this._onLeave, this);

      this._onArrive = __bind(this._onArrive, this);

      this._onHello = __bind(this._onHello, this);

      this._buttonClickHandler = __bind(this._buttonClickHandler, this);

      this._onInit = __bind(this._onInit, this);
      return PageScene.__super__.constructor.apply(this, arguments);
    }

    PageScene.prototype._onInit = function(text, offsetY, subFragments) {
      if (offsetY == null) {
        offsetY = 0;
      }
      if (subFragments == null) {
        subFragments = [];
      }
      PageScene.__super__._onInit.call(this);
      this.titleText = new createjs.Text(text, '40px Arial', '#333');
      this.titleText.textAlign = 'center';
      this.titleTextMoveX = 300;
      this.titleText.x = this.titleTextMoveX;
      this.titleText.y = offsetY + 260;
      this.textContainer.addChild(this.titleText);
      createButton(this.textContainer, subFragments, this._buttonClickHandler, offsetY + 340);
      return this._onResize(this.manager.stageWidth, this.manager.stageHeight);
    };

    PageScene.prototype._buttonClickHandler = function(event) {
      var button;
      button = event.target;
      return this.manager.goto(button.fragment);
    };

    PageScene.prototype._onHello = function() {
      return this.addCommand(new jpp.command.Parallel(new jpp.command.Tween(this.titleText, {
        x: 0
      }, {
        x: this.titleTextMoveX
      }, 1, jpp.util.Easing.easeOutBounce), new jpp.command.Tween(this.textContainer, {
        alpha: 1
      }, null, 1, jpp.util.Easing.easeOutQuart)));
    };

    PageScene.prototype._onArrive = function() {
      return this.addCommand();
    };

    PageScene.prototype._onLeave = function() {
      return this.addCommand();
    };

    PageScene.prototype._onBye = function() {
      return this.addCommand(new jpp.command.Parallel(new jpp.command.Tween(this.titleText, {
        x: -this.titleTextMoveX
      }, {
        x: 0
      }, 1, jpp.util.Easing.easeOutBounce), new jpp.command.Tween(this.textContainer, {
        alpha: 0
      }, null, 1, jpp.util.Easing.easeOutQuart)));
    };

    return PageScene;

  })(DisplayScene);

  AboutScene = (function(_super) {

    __extends(AboutScene, _super);

    function AboutScene() {
      this._onInit = __bind(this._onInit, this);
      return AboutScene.__super__.constructor.apply(this, arguments);
    }

    AboutScene.prototype._onInit = function() {
      return AboutScene.__super__._onInit.call(this, 'About');
    };

    return AboutScene;

  })(PageScene);

  GalleryScene = (function(_super) {

    __extends(GalleryScene, _super);

    function GalleryScene() {
      this._onInit = __bind(this._onInit, this);
      return GalleryScene.__super__.constructor.apply(this, arguments);
    }

    GalleryScene.prototype._onInit = function() {
      return GalleryScene.__super__._onInit.call(this, 'Gallery', 0, ['/gallery/1', '/gallery/2', '/gallery/3', '/gallery/4', '/gallery/5']);
    };

    return GalleryScene;

  })(PageScene);

  PhotoScene = (function(_super) {

    __extends(PhotoScene, _super);

    function PhotoScene() {
      this._onInit = __bind(this._onInit, this);
      return PhotoScene.__super__.constructor.apply(this, arguments);
    }

    PhotoScene.prototype._onInit = function() {
      console.log(this);
      return PhotoScene.__super__._onInit.call(this, 'Photo ' + this.getParams()[0], 120);
    };

    return PhotoScene;

  })(PageScene);

  Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      this._windowResizeHandler = __bind(this._windowResizeHandler, this);

      this._tickerTickHandler = __bind(this._tickerTickHandler, this);
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.root = '/example/createjs-pushstate/';

    Application.prototype.rootFile = 'index.html';

    Application.prototype.routes = {
      '/': IndexScene,
      '/about': AboutScene,
      '/gallery': GalleryScene,
      '/gallery/<int:id>': PhotoScene
    };

    Application.prototype.onInit = function() {
      this.stage = new createjs.Stage('canvas');
      this.stage.enableMouseOver(30);
      createjs.Ticker.setFPS(60);
      createjs.Ticker.addEventListener('tick', this._tickerTickHandler);
      $(window).resize(this._windowResizeHandler);
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

  $(document).ready(function() {
    var app;
    return app = new Application({
      isReleaseMode: false
    });
  });

}).call(this);
