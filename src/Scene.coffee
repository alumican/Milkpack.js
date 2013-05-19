jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.command').use()
	jpp.util.Namespace('jpp.event').use()
	jpp.util.Namespace('jpp.milkpack').use()

	class Scene extends jpp.event.EventDispatcher

		@self = null


		#===============================================
		#
		# Constructor
		#
		#===============================================
		constructor: (manager, rule, fragment, params) ->
			super(@)

			@_manager = manager
			@_rule = rule
			@_fragment = fragment
			@_params = params

			@self = @

			@_title = null
			@_status = jpp.milkpack.SceneStatus.GONE
			@_isInitialized = false

			@_command = null
			@_commandWrapper = null

			@__commandsHello = []
			@__commandsArrive = []
			@__commandsLeave = []
			@__commandsBye = []


		#===============================================
		#
		# Method
		#
		#===============================================

		# 初期化
		init: () ->
			return if @_isInitialized
			@_isInitialized = true
			@_onInit()

		# Helloフェーズを開始する
		hello: () ->
			@_switchStatus(jpp.milkpack.SceneStatus.HELLO, @_getHello)

		# Arriveフェーズを開始する
		arrive: () ->
			@_switchStatus(jpp.milkpack.SceneStatus.ARRIVE, @_getArrive)

		# Leaveフェーズを開始する
		leave: () ->
			@_switchStatus(jpp.milkpack.SceneStatus.LEAVE, @_getLeave)

		# Byeフェーズを開始する
		bye: () ->
			@_switchStatus(jpp.milkpack.SceneStatus.BYE, @_getBye)

		# 実行中のコマンドに新たなコマンドを追加する
		addCommand: (commands...) ->
			@_commandWrapper.addCommand(commands...) if @_commandWrapper isnt null

		# 実行中のコマンドに新たなコマンドを挿入する
		insertCommand: (commands...) ->
			@_commandWrapper.insertCommand(commands...) if @_commandWrapper isnt null

		# フェーズを切り替える
		_switchStatus: (status, commandFunction) ->
			if @_command isnt null
				jpp.milkpack.Util.log("Command is being executed (status = #{@_status})")
				return
			@_clearCommand()
			@_status = status
			@_dispatchStatusEvent(@_status, false)
			@_command = commandFunction() #非同期処理生成 / 同期処理実行
			@_command.addEventListener(jpp.event.Event.COMPLETE, @_commandCompleteHandler)
			@_command.execute()

		# フェーズを終了する
		_clearCommand: () ->
			if @_command isnt null
				@_command.removeEventListener(jpp.event.Event.COMPLETE, @_commandCompleteHandler)
				@_command.interrupt()
				@_command = null

		# コマンドの完了ハンドラ
		_commandCompleteHandler: (event) =>
			@_clearCommand()
			prevStatus = @_status
			switch @_status
				when jpp.milkpack.SceneStatus.ARRIVE then @_status = jpp.milkpack.SceneStatus.STAY
				when jpp.milkpack.SceneStatus.BYE then @_status = jpp.milkpack.SceneStatus.GONE
			@_dispatchStatusEvent(prevStatus, true)

		# イベントを発行する
		_dispatchStatusEvent: (status, isComplete) ->
			jpp.milkpack.Util.log("Scene '#{@_fragment}' : #{status} #{if isComplete then 'End' else 'Begin'}")
			@dispatchEvent(jpp.milkpack.SceneEvent.CHANGE_STATUS, { status: status, isComplete: isComplete })

		# 登録されているコマンドを取得する
		_getCommandInternal: (protectedFunction, externalCommands) ->
			@_commandWrapper = new jpp.command.Serial()
			if @__commandsHello.length == 0 then protectedFunction() else @_commandWrapper.addCommandArray(externalCommands)
			return @_commandWrapper


		#===============================================
		#
		# Getter / Setter
		#
		#===============================================

		# 初期化されたかどうかを取得する
		getIsInitialized: () -> return @_isInitialized

		# マネージャクラスを取得する
		getManager: () -> return @_manager

		# ルールを取得する
		getRule: () -> return @_rule

		# フラグメントを取得する
		getFragment: () -> return @_fragment

		# パラメータを取得する
		getParams: () -> return @_params

		# 現在のステータスを取得する
		getStatus: () -> return @_status

		# このシーンが目的地だった場合もしくはこのシーンを通過するときに実行するコマンドを設定する
		_getHello: () =>
			return @_getCommandInternal(@_onHello, @__commandsHello)

		setHello: (command...) ->
			@__commandsHello = command
			return @

		# このシーンが目的地だった場合に行するコマンドを設定する
		_getArrive: () =>
			return @_getCommandInternal(@_onArrive, @__commandsArrive)

		setArrive: (command...) ->
			@__commandsArrive = command
			return @

		# このシーンから離れる場合に行するコマンドを設定する
		_getLeave: () =>
			return @_getCommandInternal(@_onLeave, @__commandsLeave)

		setLeave: (command...) ->
			@__commandsLeave = command
			return @

		# このシーンより上の階層が目的地だった場合にこのシーンを通過するときに実行するコマンドを設定する
		_getBye: () =>
			return @_getCommandInternal(@_onBye, @__commandsBye)

		setBye: (command...) ->
			@__commandsBye = command
			return @

		# ページタイトルを設定する
		getTitle: () -> return @_title
		setTitle: (title) -> @_title = title


		#===============================================
		#
		# Protected
		#
		#===============================================

		# このシーンを初期化する
		# サブクラスでオーバーライドする
		_onInit: () =>

		# このシーンが目的地だった場合もしくはこのシーンを通過するときに実行するコマンドを設定する
		# サブクラスでオーバーライドする
		_onHello: () =>

		# このシーンが目的地だった場合に行するコマンドを設定する
		# サブクラスでオーバーライドする
		_onArrive: () =>

		# このシーンから離れる場合に行するコマンドを設定する
		# サブクラスでオーバーライドする
		_onLeave: () =>

		# このシーンより上の階層が目的地だった場合にこのシーンを通過するときに実行するコマンドを設定する
		# サブクラスでオーバーライドする
		_onBye: () =>


	# export
	jpp.util.Namespace('jpp.milkpack').register('Scene', Scene)
