(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jpp.util.Scope.temp(function() {
    var AboutScene, Application, ContactScene, DownloadScene, IndexScene, NotFoundScene, PageScene, UsageScene;
    jpp.util.Namespace('jpp.command').use();
    jpp.util.Namespace('jpp.milkpack').use();
    IndexScene = (function(_super) {

      __extends(IndexScene, _super);

      function IndexScene() {
        this._onBye = __bind(this._onBye, this);

        this._onLeave = __bind(this._onLeave, this);

        this._onArrive = __bind(this._onArrive, this);

        this._onHello = __bind(this._onHello, this);

        this._onInit = __bind(this._onInit, this);
        return IndexScene.__super__.constructor.apply(this, arguments);
      }

      IndexScene.prototype._onInit = function() {
        this.setTitle('Milkpack JS');
        this.$header = $('#header');
        return this.$footer = $('#footer');
      };

      IndexScene.prototype._onHello = function() {
        return this.addCommand(new jpp.command.Parallel(new jpp.command.JqueryAnimate(this.$header, {
          opacity: '1'
        }, {
          duration: 500,
          easing: 'linear'
        }), new jpp.command.JqueryAnimate(this.$footer, {
          opacity: '1'
        }, {
          duration: 500,
          easing: 'linear'
        })));
      };

      IndexScene.prototype._onArrive = function() {
        return this.addCommand();
      };

      IndexScene.prototype._onLeave = function() {
        return this.addCommand();
      };

      IndexScene.prototype._onBye = function() {
        return this.addCommand(new jpp.command.Parallel(new jpp.command.JqueryAnimate(this.$header, {
          opacity: '0'
        }, {
          duration: 500,
          easing: 'linear'
        }), new jpp.command.JqueryAnimate(this.$footer, {
          opacity: '0'
        }, {
          duration: 500,
          easing: 'linear'
        })));
      };

      return IndexScene;

    })(jpp.milkpack.Scene);
    PageScene = (function(_super) {

      __extends(PageScene, _super);

      function PageScene() {
        this._onBye = __bind(this._onBye, this);

        this._onHello = __bind(this._onHello, this);

        this._onInit = __bind(this._onInit, this);
        return PageScene.__super__.constructor.apply(this, arguments);
      }

      PageScene.prototype._onInit = function($page) {
        return this.$page = $page;
      };

      PageScene.prototype._onHello = function() {
        return this.addCommand(new jpp.command.JqueryAnimate(this.$page, {
          opacity: '1'
        }, {
          duration: 500,
          easing: 'linear'
        }));
      };

      PageScene.prototype._onBye = function() {
        return this.addCommand(new jpp.command.JqueryAnimate(this.$page, {
          opacity: '0'
        }, {
          duration: 500,
          easing: 'linear'
        }));
      };

      return PageScene;

    })(jpp.milkpack.Scene);
    AboutScene = (function(_super) {

      __extends(AboutScene, _super);

      function AboutScene() {
        this._onInit = __bind(this._onInit, this);
        return AboutScene.__super__.constructor.apply(this, arguments);
      }

      AboutScene.prototype._onInit = function() {
        this.setTitle('What | Milkpack JS');
        return AboutScene.__super__._onInit.call(this, $('#page_what'));
      };

      return AboutScene;

    })(PageScene);
    UsageScene = (function(_super) {

      __extends(UsageScene, _super);

      function UsageScene() {
        this._onInit = __bind(this._onInit, this);
        return UsageScene.__super__.constructor.apply(this, arguments);
      }

      UsageScene.prototype._onInit = function() {
        this.setTitle('How | Milkpack JS');
        return UsageScene.__super__._onInit.call(this, $('#page_how'));
      };

      return UsageScene;

    })(PageScene);
    DownloadScene = (function(_super) {

      __extends(DownloadScene, _super);

      function DownloadScene() {
        this._onInit = __bind(this._onInit, this);
        return DownloadScene.__super__.constructor.apply(this, arguments);
      }

      DownloadScene.prototype._onInit = function(id) {
        this.setTitle('Where | Milkpack JS');
        return DownloadScene.__super__._onInit.call(this, $('#page_where'));
      };

      return DownloadScene;

    })(PageScene);
    ContactScene = (function(_super) {

      __extends(ContactScene, _super);

      function ContactScene() {
        this._onInit = __bind(this._onInit, this);
        return ContactScene.__super__.constructor.apply(this, arguments);
      }

      ContactScene.prototype._onInit = function() {
        this.setTitle('Who | Milkpack JS');
        return ContactScene.__super__._onInit.call(this, $('#page_who'));
      };

      return ContactScene;

    })(PageScene);
    NotFoundScene = (function(_super) {

      __extends(NotFoundScene, _super);

      function NotFoundScene() {
        this._onInit = __bind(this._onInit, this);
        return NotFoundScene.__super__.constructor.apply(this, arguments);
      }

      NotFoundScene.prototype._onInit = function() {
        this.setTitle('404 Not Found | Milkpack JS');
        return NotFoundScene.__super__._onInit.call(this, $('#page_not_found'));
      };

      return NotFoundScene;

    })(PageScene);
    Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        return Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.root = '/';

      Application.prototype.rootFile = 'index.html';

      Application.prototype.routes = {
        '/': IndexScene,
        '/what': AboutScene,
        '/how': UsageScene,
        '/where': DownloadScene,
        '/who': ContactScene
      };

      Application.prototype.notFound = NotFoundScene;

      Application.prototype.onInit = function() {
        var _this = this;
        return $('.fragment').on('click', function(event) {
          if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
          }
          event.preventDefault();
          return _this.goto(event.currentTarget.pathname);
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
