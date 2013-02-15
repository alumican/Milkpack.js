jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.command').use()
	jpp.util.Namespace('jpp.milkpack').use()

	#===============================================
	#
	# Scenes
	#
	#===============================================
	class DisplayScene extends jpp.milkpack.Scene

		_onInit: () =>
			@manager = @getManager()
			@manager.addEventListener(jpp.event.Event, @_resizeHandler)
			@stage = @manager.stage

		_resizeHandler: (event) =>
			@_onResize(event.extra.stageWidth, event.extra.stageHeight)

		_onResize: (stageWidth, stageHeight) =>


	class IndexScene extends DisplayScene

		_onInit: () =>
			super()

			@textContainer = new createjs.Container()
			@textContainer.alpha = 0
			@stage.addChild(@textContainer)

			@titleText = new createjs.Text('CreateJS & MilkpackJS\nPushState Demo', '60px Arial', '#333')
			@titleText.textAlign = 'center'
			@titleText.lineHeight = 80
			@titleTextOffsetY = -75 - 100
			@titleTextMoveY = 50
			@titleText.y = @titleTextOffsetY - @titleTextMoveY
			@titleText.onMouseOver = @_buttonMouseOverHandler
			@titleText.onMouseOut = @_buttonMouseOutHandler
			@titleText.onClick = (event) => @manager.goto('/')
			@titleTextArea = new createjs.Shape()
			@titleTextArea.graphics.beginFill('#000').drawRect(-320, 0, 640, 150)
			@titleText.hitArea = @titleTextArea
			@textContainer.addChild(@titleText)

			buttonFragments = ['/A', '/B', '/C', '/D']
			@buttons = new Array(@buttonLength)
			@buttonLength = buttonFragments.length
			buttonMargin = 50
			buttonIndex = 0
			buttonRadius = 10
			getClickHandler = (buttonIndex) => return (event) => @_buttonClickHandler()
			while (buttonIndex < @buttonLength)
				button = new createjs.Shape()
				button.graphics.beginFill('#000').drawCircle(0, 0, buttonRadius)
				button.x = buttonMargin * (buttonIndex - (@buttonLength - 1) / 2)
				button.fragment = buttonFragments[buttonIndex]
				button.onMouseOver = @_buttonMouseOverHandler
				button.onMouseOut = @_buttonMouseOutHandler
				button.onClick = @_buttonClickHandler
				@textContainer.addChild(button)
				@buttons[buttonIndex] = button
				++buttonIndex

			@_onResize(@manager.stageWidth, @manager.stageHeight)

		_buttonMouseOverHandler: (event) =>
			button = event.target
			button.alpha = 0.3
			$('#canvas').css('cursor', 'pointer')

		_buttonMouseOutHandler: (event) =>
			button = event.target
			button.alpha = 1
			$('#canvas').css('cursor', 'default')

		_buttonClickHandler: (event) =>
			button = event.target
			@manager.goto(button.fragment)

		_onHello: () =>
			@addCommand(
				new jpp.command.Parallel(
					new jpp.command.Tween(@titleText    , { y: @titleTextOffsetY }, null, 1, jpp.util.Easing.easeOutBounce)
					new jpp.command.Tween(@textContainer, { alpha: 1 }            , null, 1, jpp.util.Easing.easeOutQuart)
				)
			)

		_onArrive: () =>
			@addCommand(
			)

		_onLeave: () =>
			@addCommand(
			)

		_onBye: () =>
			@addCommand(
				new jpp.command.Parallel(
					new jpp.command.Tween(@titleText    , { y: @titleTextOffsetY - @titleTextMoveY }, null, 1, jpp.util.Easing.easeOutQuart)
					new jpp.command.Tween(@textContainer, { alpha: 0 }                              , null, 1, jpp.util.Easing.easeOutQuart)
				)
			)

		_onResize: (stageWidth, stageHeight) =>
			@textContainer.x = stageWidth / 2
			@textContainer.y = stageHeight / 2 + 40



	class PageScene extends DisplayScene

		_onInit: (text) =>
			super()

			@textContainer = new createjs.Container()
			@stage.addChild(@textContainer)

			@titleText = new createjs.Text(text, '40px Arial', '#333')
			@titleText.textAlign = 'center'
			@titleText.alpha = 0
			@titleTextMoveX = 300
			@titleText.x = @titleTextMoveX
			@titleText.y = 30
			@textContainer.addChild(@titleText)

			@_onResize(@manager.stageWidth, @manager.stageHeight)

		_onHello: () =>
			@addCommand(
				new jpp.command.Tween(@titleText, { alpha: 1, x: 0 }, { x : @titleTextMoveX }, 1, jpp.util.Easing.easeOutBounce)
			)

		_onArrive: () =>
			@addCommand(
			)

		_onLeave: () =>
			@addCommand(
			)

		_onBye: () =>
			@addCommand(
				new jpp.command.Tween(@titleText, { alpha: 0, x: -@titleTextMoveX }, { x : 0 }, 1, jpp.util.Easing.easeOutQuart)
			)

		_onResize: (stageWidth, stageHeight) =>
			@textContainer.x = stageWidth / 2
			@textContainer.y = stageHeight / 2 + 40


	class PageAScene extends PageScene
		_onInit: () =>
			super('This is Scene A')


	class PageBScene extends PageScene
		_onInit: () =>
			super('This is Scene B')


	class PageCScene extends PageScene
		_onInit: () =>
			super('This is Scene C')


	class PageDScene extends PageScene
		_onInit: () =>
			super('This is Scene D')


	#===============================================
	#
	# Application
	#
	#===============================================
	class Application extends jpp.milkpack.Milkpack

		#アプリケーションのルート
		#root: '/milkpack-js/createjs-pushstate/'
		root: '/'

		#インデックスファイル名
		rootFile: 'index.html'

		#ルーティング定義
		routes:
			'/': IndexScene
			'/A': PageAScene
			'/B': PageBScene
			'/C': PageCScene
			'/D': PageDScene

		#アプリケーション初期化時に呼び出される
		onInit: () ->
			@stage = new createjs.Stage('canvas')
			@stage.enableMouseOver(30)

			#@circle = new createjs.Shape()
			#@circle.graphics.beginFill('red').drawCircle(0, 0, 10)
			#@stage.addChild(@circle)

			#ticker handler
			createjs.Ticker.setFPS(60)
			createjs.Ticker.addEventListener('tick', @_tickerTickHandler);

			#resize handler
			$(window).resize = @_windowResizeHandler
			@_windowResizeHandler()

		_tickerTickHandler: (event) =>
			@stage.update()

		_windowResizeHandler: (event) =>
			sizeref = $('#sizeref')
			@stageWidth = sizeref.width()
			@stageHeight = sizeref.height()

			canvas = $('#canvas')
			canvas.attr({ width: @stageWidth })
			canvas.attr({ height: @stageHeight })

			#@circle.x = @stageWidth / 2
			#@circle.y = @stageHeight / 2

			@dispatchEvent(jpp.event.Event.RESIZE, { stageWidth: @stageWidth, stageHeight: @stageHeight })


	#===============================================
	#
	# Entry point
	#
	#===============================================
	$(document).ready ()->
		app = new Application({ isReleaseMode: false })
