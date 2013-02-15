###
 Copyright (c) 2013 Yukiya Okuda
 http://alumican.net/

 Milkpack is free software distributed under the terms of the MIT license:
 http://www.opensource.org/licenses/mit-license.php
###
jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.util').use()
	jpp.util.Namespace('jpp.event').use()
	jpp.util.Namespace('jpp.milkpack').use()

	class Milkpack extends jpp.event.EventDispatcher

		#バージョン
		@VERSION: '0.1.0'

		#===============================================
		#
		# Constructor
		#
		#===============================================
		constructor: (option) ->
			super(@)

			@_isReleaseMode = option.isReleaseMode ? true
			@_log = jpp.milkpack.Util.log

			@_queue = []
			@_queuePosition = -1
			@_direction = []
			@_targetFragment = null
			@_targetScene = null
			@_currentScene = null
			@_notFoundScene = null
			@_isInGeneratingSubFragment = false
			@_isRunning = false
			@_scenes = {}

			@root = option.root ? @root
			@rootFile = option.rootFile ? @rootFile
			@routes = option.routes ? @routes
			@notFound = option.notFound ? @notFound

			#ルート
			kazitoriRoutes = {}
			getRouteHandler = (rule, sceneClass) =>
				return (params...) =>
					@_kazitoriRoutingHandler(rule, sceneClass, params)
			#シーンが関連づけられているパス
			for rule, sceneClass of @routes
				kazitoriRoutes[rule] = getRouteHandler(rule, sceneClass)
			#シーンが関連づけられていない中間パス
			for rule of @routes
				fragments = jpp.milkpack.Util.decompseFragment(rule).route
				for subRule in fragments
					if kazitoriRoutes[subRule] is undefined
						kazitoriRoutes[subRule] = getRouteHandler(subRule, null)

			#kazitoriに渡す用
			kazitoriOption = {}
			kazitoriOption.root = @root
			kazitoriOption.rootFile = @rootFile
			kazitoriOption.routes = kazitoriRoutes
			kazitoriOption.isAutoStart = false
			#kazitoriOption.notFound = (params...) => @_kazitoriRoutingNotFoundHandler(params)

			@_kazitori = new Kazitori(kazitoriOption)
			@_kazitori.addEventListener(KazitoriEvent.EXECUTED, @_kazitoriExecutedHandler)

			jpp.milkpack.Util.LOGGING = true
			jpp.milkpack.Util.printInit(Milkpack, @_kazitori, @routes)

			#ユーザによる初期化タイミング
			@onInit()

			#開始
			@_kazitori.start()


		#===============================================
		#
		# Method
		#
		#===============================================

		#指定のフラグメントに遷移する
		goto: (fragment) ->
			@_log("goto : '#{fragment}'")
			@_kazitori.change(fragment)

		#指定のフラグメントに遷移する(ヒストリーに残さない)
		replace: (fragment) ->
			@_log("replace : '#{fragment}'")
			@_kazitori.replace(fragment)

		#ヒストリーの次へ遷移する
		next: () ->
			@_log('next')
			@_kazitori.torikazi()

		#ヒストリーの前へ遷移する
		prev: () ->
			@_log('prev')
			@_kazitori.omokazi()

		#シーンオブジェクトを取得する
		getScene: (fragment) ->
			@_log("get scene : '#{fragment}'")
			scene = @_scenes[fragment]

			#シーンが登録されていない場合は作成
			if scene is undefined
				@_log("get scene temporary : '#{fragment}'")
				@_isInGeneratingSubFragment = true
				tmpFragment = @_kazitori.fragment
				@_kazitori.fragment = fragment
				@_kazitori.executeHandlers() #TODO loadURLではエラーが出る謎を解く
				@_kazitori.fragment = tmpFragment
				@_isInGeneratingSubFragment = false
				scene = @_scenes[fragment]

			#初期化されていない場合はエラー
			if scene.getIsInitialized() is false
				jpp.milkpack.Util.error("初期化されていないシーン'#{fragment}'が呼び出されました")

			return scene

		#ユーザによる初期化のタイミングで呼び出される(for ovverride)
		onInit: () ->

		#シーンが未定義だったときに呼び出される(for ovverride)
		onSceneRequest: (fragment, params) ->
			return jpp.milkpack.Scene

		#kazitoriのルーティングバインド関数
		_kazitoriRoutingHandler: (rule, sceneClass, params) =>
			fragment = @_kazitori.fragment
			scene = @_scenes[fragment]

			#シーン生成
			if scene is undefined
				@_log("create new Scene of '#{fragment}'")
				if sceneClass is null
					@_log("request Scene of '#{fragment}'")
					sceneClass = @onSceneRequest(fragment, params)
					if sceneClass is undefined or sceneClass is null
						@_log("default Scene of '#{fragment}'")
						sceneClass = jpp.milkpack.Scene

				scene = new sceneClass(@, rule, fragment, params)
				scene.init()
				@_scenes[fragment] = scene

			@_log("kazitoriRoutingHandler : rule     = #{scene.getRule()}")
			@_log("kazitoriRoutingHandler : fragment = #{scene.getFragment()}")
			@_log("kazitoriRoutingHandler : params   = [#{scene.getParams().join(', ')}]")

		#kazitoriのルーティングバインド関数(not found)
		_kazitoriRoutingNotFoundHandler: (params) =>
			@_log('404 :' + params.join(', '))

			if @notFound isnt null
				#シーン生成
				if @_notFoundScene is null
					@_notFoundScene = new @notFound(@, '', @_kazitori.fragment, params)
					@_notFoundScene.init()

				#経路生成
				@_pushRoute(@_kazitori.fragment)


		#Kazitori.EXECUTEDイベントハンドラ(not foundの場合は実行されない)
		_kazitoriExecutedHandler: (event) =>
			#中間パス生成中は何もしない
			return if @_isInGeneratingSubFragment

			#経路生成
			@_pushRoute(event.next)

		#経路を追加する
		_pushRoute: (fragment) ->
			#ルート生成
			if @_targetFragment is null
				flow = jpp.milkpack.Util.decompseFragment(fragment) #1st request
			else
				flow = jpp.milkpack.Util.complementFragment(@_targetFragment, fragment)
			route = flow.route
			direction = flow.direction

			return false if route is null
			return false if route.length == 0
			return false if route[route.length - 1] is @_targetFragment

			prevTargetFragment = @_targetFragment

			@_targetFragment = route[route.length - 1]
			@_targetScene = @getScene(@_targetFragment)

			@_queue = @_queue[0...@_queuePosition].concat(route)
			@_direction = @_direction[0...@_queuePosition].concat(direction)
			@_log("pushRoute : queue = '#{@_queue.join('\' -> \'')}'")
			@_log("pushRoute : direction = '#{@_direction.join('\' -> \'')}'")
			@_log("pushRoute : position = #{@_queuePosition}")

			#タイトルの変更
			#"document.title = @_targetScene.getTitle()
			document.getElementsByTagName('title')[0].firstChild.nodeValue = @_targetScene.getTitle()

			#イベントの発行
			@_log("change : route = '#{route.join('\' -> \'')}'")
			@dispatchEvent(jpp.milkpack.MilkpackEvent.CHANGE, { prev: prevTargetFragment , next: @_targetFragment })

			@_startAsync()
			return true

		#非同期処理を開始する
		_startAsync: () ->
			return false if @_isRunning

			if @_currentScene is null
				#初回
				@_log('start async process : first')
				@_nextAsync()
			else
				#2回目以降
				if @_currentScene.getStatus() is jpp.milkpack.SceneStatus.STAY
					@_log('start async process : leave')
					@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
					@_currentScene.leave()
				else
					if @_getNextDirection() < 0
						@_log('start async process : bye')
						@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
						@_currentScene.bye()
					else
						@_log('start async process : next')
						@_nextAsync()

		#キューを進める
		_nextAsync: () ->
			@_log('next async process : first')
			@_currentScene?.removeEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)

			direction = @_getNextDirection()

			++@_queuePosition
			fragment = @_queue[@_queuePosition]
			@_currentScene = @getScene(fragment)

			if direction >= 0
				@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
				@_currentScene.hello()
			else if @_queuePosition == @_queue.length - 1
				@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
				@_currentScene.arrive()
			else
				@_nextAsync()

		#シーン変更ハンドラ
		_sceneChangeStatusHandler: (event) =>
			if event.extra.isComplete
				@_isRunning = false
				@_currentScene.removeEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
				switch event.extra.status

					when jpp.milkpack.SceneStatus.HELLO
						if @_queuePosition == @_queue.length - 1
							@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
							@_currentScene.arrive()
						else if @_getNextDirection() > 0
							@_nextAsync()
						else
							@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
							@_currentScene.bye()

					when jpp.milkpack.SceneStatus.ARRIVE
						if @_queuePosition < @_queue.length - 1
							@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
							@_currentScene.leave()

					when jpp.milkpack.SceneStatus.LEAVE
						if @_getNextDirection() > 0
							@_nextAsync()
						else
							@_currentScene.addEventListener(jpp.milkpack.SceneEvent.CHANGE_STATUS, @_sceneChangeStatusHandler)
							@_currentScene.bye()

					when jpp.milkpack.SceneStatus.BYE
						@_nextAsync()
			else
				@_isRunning = true

		#次のシーンに向かう時の最初の方向を取得する
		_getNextDirection: () ->
			return 1 if @_queuePosition < 0
			return 0 if @_queuePosition == @_queue.length - 1
			return jpp.milkpack.Util.getDirection(@_queue[@_queuePosition], @_queue[@_queuePosition + 1])


	#export
	jpp.util.Namespace('jpp.milkpack').register('Milkpack', Milkpack)
