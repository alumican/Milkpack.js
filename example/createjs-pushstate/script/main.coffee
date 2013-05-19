jpp.util.Namespace('jpp.command').use()
jpp.util.Namespace('jpp.event').use()
jpp.util.Namespace('jpp.milkpack').use()

createButton = (container, fragments, onClick, offsetY) =>
	buttonLength = fragments.length
	buttons = new Array(buttonLength)
	buttonMargin = 50
	buttonIndex = 0
	buttonRadius = 10
	buttonMouseOverHandler = (event) =>
		button = event.target
		button.alpha = 0.3
		$('#canvas').css('cursor', 'pointer')
	buttonMouseOutHandler = (event) =>
		button = event.target
		button.alpha = 1
		$('#canvas').css('cursor', 'default')
	while (buttonIndex < buttonLength)
		button = new createjs.Shape()
		button.graphics.beginFill('#000').drawCircle(0, 0, buttonRadius)
		button.x = buttonMargin * (buttonIndex - (buttonLength - 1) / 2)
		button.y = container.y + offsetY
		button.fragment = fragments[buttonIndex]
		button.onMouseOver = buttonMouseOverHandler
		button.onMouseOut = buttonMouseOutHandler
		button.onClick = onClick
		container.addChild(button)
		buttons[buttonIndex] = button
		++buttonIndex
	return buttons

#===============================================
#
# Scenes
#
#===============================================
class DisplayScene extends jpp.milkpack.Scene

	_onInit: () =>
		@manager = @getManager()
		@manager.addEventListener(jpp.event.Event.RESIZE, @_resizeHandler)
		@stage = @manager.stage

		@textContainer = new createjs.Container()
		@textContainer.alpha = 0
		@stage.addChild(@textContainer)

	_resizeHandler: (event) =>
		@_onResize(event.extra.stageWidth, event.extra.stageHeight)

	_onResize: (stageWidth, stageHeight) =>
		@textContainer.x = stageWidth / 2
		@textContainer.y = 0


class IndexScene extends DisplayScene

	_onInit: () =>
		super()

		@titleText = new createjs.Text('CreateJS & MilkpackJS\nPushState Demo', '60px Arial', '#333')
		@titleText.textAlign = 'center'
		@titleText.lineHeight = 80
		@titleTextOffsetY = 50
		@titleTextMoveY = 50
		@titleText.y = @titleTextOffsetY - @titleTextMoveY
		@titleText.onMouseOver = @_buttonMouseOverHandler
		@titleText.onMouseOut = @_buttonMouseOutHandler
		@titleText.onClick = (event) => @manager.goto('/')
		@titleTextArea = new createjs.Shape()
		@titleTextArea.graphics.beginFill('#000').drawRect(-320, @titleTextOffsetY, 640, 150)
		@titleText.hitArea = @titleTextArea
		@textContainer.addChild(@titleText)

		createButton(@textContainer, ['/about', '/gallery'], @_buttonClickHandler, 230)

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



class PageScene extends DisplayScene

	_onInit: (text, offsetY = 0, subFragments = []) =>
		super()

		@titleText = new createjs.Text(text, '40px Arial', '#333')
		@titleText.textAlign = 'center'
		@titleTextMoveX = 300
		@titleText.x = @titleTextMoveX
		@titleText.y = offsetY + 260
		@textContainer.addChild(@titleText)

		createButton(@textContainer, subFragments, @_buttonClickHandler, offsetY + 340)

		@_onResize(@manager.stageWidth, @manager.stageHeight)

	_buttonClickHandler: (event) =>
		button = event.target
		@manager.goto(button.fragment)

	_onHello: () =>
		@addCommand(
			new jpp.command.Parallel(
				new jpp.command.Tween(@titleText    , { x: 0 }, { x: @titleTextMoveX }, 1, jpp.util.Easing.easeOutBounce)
				new jpp.command.Tween(@textContainer, { alpha: 1 }, null, 1, jpp.util.Easing.easeOutQuart)
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
				new jpp.command.Tween(@titleText    , { x: -@titleTextMoveX }, { x: 0 }, 1, jpp.util.Easing.easeOutBounce)
				new jpp.command.Tween(@textContainer, { alpha: 0 }, null, 1, jpp.util.Easing.easeOutQuart)
			)
		)


class AboutScene extends PageScene
	_onInit: () =>
		super('About')


class GalleryScene extends PageScene
	_onInit: () =>
		super('Gallery', 0, ['/gallery/1', '/gallery/2', '/gallery/3', '/gallery/4', '/gallery/5'])


class PhotoScene extends PageScene
	_onInit: () =>
		console.log(@)
		super('Photo ' + @getParams()[0], 120)


#===============================================
#
# Application
#
#===============================================
class Application extends jpp.milkpack.Milkpack

	#アプリケーションのルート
	root: '/example/createjs-pushstate/'
	#root: '/'

	#インデックスファイル名
	rootFile: 'index.html'

	#ルーティング定義
	routes:
		'/': IndexScene
		'/about': AboutScene
		'/gallery': GalleryScene
		'/gallery/<int:id>': PhotoScene

	#アプリケーション初期化時に呼び出される
	onInit: () ->
		@stage = new createjs.Stage('canvas')
		@stage.enableMouseOver(30)

		#ticker handler
		createjs.Ticker.setFPS(60)
		createjs.Ticker.addEventListener('tick', @_tickerTickHandler);

		#resize handler
		$(window).resize(@_windowResizeHandler)
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

		@dispatchEvent(jpp.event.Event.RESIZE, { stageWidth: @stageWidth, stageHeight: @stageHeight })


#===============================================
#
# Entry point
#
#===============================================
$(document).ready ()->
	app = new Application({ isReleaseMode: false })
