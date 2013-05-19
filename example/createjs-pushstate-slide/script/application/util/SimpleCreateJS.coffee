class SimpleCreateJS

    #===============================================
    #
    # メンバ変数の定義
    #
    #===============================================

    # CreateJS のステージオブジェクトへの参照
    stage: null

    # ステージサイズ
    stageWidth : 0
    stageHeight: 0

    # Ticker 更新時に呼び出されるコールバック関数
    onUpdate: null

    # レンダリング完了時に呼び出されるコールバック関数
    onRender: null

    # ウィンドウリサイズ時に呼び出されるコールバック関数
    onResize: null

    # リソースの読み込み完了時に呼び出されるコールバック関数
    onLoad: null

    # 内部用の jQuery オブジェクト
    _$sizeref: null
    _$canvas : null

    #===============================================
    #
    # メソッドの定義
    #
    #===============================================

    # コンストラクタ
    constructor: (canvasId, frameRate = 60, mouseRate = 0, onResize = null) ->
        # canvas を作成 / 取得する
        @_$canvas = $("##{canvasId}")
        if @_$canvas.length == 0
            @_$canvas = $('<canvas>')
            @_$canvas.attr('id', canvasId)
            @_$canvas.css({ position: 'absolute', 'z-index': 1, top: 0, left: 0 })
            $('body').append(@_$canvas)

        # ウィンドウサイズ参照用の div を作成する
        @_$sizeref = $('<div>')
        @_$sizeref.css({ position: 'absolute', 'z-index': 0, top: 0, left: 0, width: '100%', height: '100%' })
        $('body').append(@_$sizeref)

        # CreateJS を初期化する
        @stage = new createjs.Stage(canvasId)
        @stage.enableMouseOver(mouseRate) if mouseRate > 0
        createjs.Ticker.setFPS(frameRate)
        createjs.Ticker.addEventListener('tick', @_createjsTickHandler)

        # ウィンドウのリサイズを検出する
        @onResize = onResize
        $(window).resize(@_windowResizeHandler)
        @_windowResizeHandler()

    # CreateJS の Ticker が更新されたときに呼び出されるイベントランドラ
    _createjsTickHandler: (event) =>
        @onUpdate?()
        @stage.update()
        @onRender?()

    # ウィンドウがリサイズされたときに呼び出されるイベントハンドラ
    _windowResizeHandler: (event) =>
        # ウィンドウサイズを取得する
        @stageWidth = @_$sizeref.width()
        @stageHeight = @_$sizeref.height()

        # canvas をリサイズする
        @_$canvas.attr({ width: @stageWidth })
        @_$canvas.attr({ height: @stageHeight })

        # コールバック関数を呼び出す
        @onResize?(@stageWidth, @stageHeight)

    #----------------------------------------
    #
    # リソースの読み込み
    #
    #----------------------------------------

    # リソースを読み込むキューを発行する
    createLoadQueue: (files, plugins = null, onLoad = null) ->
        queue = new createjs.LoadQueue()

        # イベントハンドラを登録する
        queue.addEventListener('complete', @_loadCmpleteHandler)

        # プラグインをインストールする
        if plugins != null
            plugins = [plugins] unless plugins instanceof Array
            queue.installPlugin(plugin) for plugin in plugins

        # 読み込むファイル名登録する
        files = [files] unless files instanceof Array
        queue.loadManifest(files, false)

        @onLoad = onLoad
        return queue

    # リソースの読み込み完了時に呼び出されるイベントハンドラ
    _loadCmpleteHandler: (event) =>
        queue = event.target

        # コールバック関数を呼び出す
        @onLoad?(queue)


# export class
window.SimpleCreateJS = SimpleCreateJS
