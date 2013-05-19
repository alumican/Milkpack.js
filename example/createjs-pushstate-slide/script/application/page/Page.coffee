jpp.util.Namespace('jpp.command').use()

#===============================================
#
# 個別ページクラス
#
#===============================================
class Page

    #===============================================
    #
    # メンバ変数の定義
    #
    #===============================================

    # ページ情報
    _index   : -1
    _level   : -1
    _fragment: ''
    _color   : ''

    # CreateJS のステージオブジェクト
    _stage: null

    # CreateJS のビューオブジェクト
    _view   : null
    _content: null
    _base   : null
    _cover  : null

    _image: null

    _isFocused: false

    _defaultWidth : 1024
    _defaultHeight: 768

    #===============================================
    #
    # メソッドの定義
    #
    #===============================================

    # コンストラクタ
    constructor: (manager, stage, index, level, fragment, color, image) ->
        @_manager  = manager
        @_stage    = stage
        @_index    = index
        @_level    = level
        @_fragment = fragment
        @_color    = color
        @_image    = image

        # ビューを構築する
        @_build()

        # ボタン化する
        @_base.onMouseOver = (event) =>
            return if @_isFocused
            @_view.addChild(@_cover)
            $(document).css('cursor', 'pointer')

        @_base.onMouseOut = (event) =>
            @_view.removeChild(@_cover)
            $(document).css('cursor', 'default')

        @_base.onClick = (event) =>
            @_manager.gotoSpecifiedPageByFragment(@_fragment)

        # 初期表示
        @hide(false)

        #console.log("New Page: index = #{index}, level = #{level}, fragment = #{fragment}, color = #{color}")

    # ビューを構築する
    _build: () ->
        @_view = new createjs.Container()
        @_view.regX = @_defaultWidth  / 2
        @_view.regY = @_defaultHeight / 2

        @_base = new createjs.Shape()
        @_base.graphics.beginFill(@_color).drawRect(0, 0, @_defaultWidth, @_defaultHeight)
        @_base.shadow = new createjs.Shadow('#666666', 2, 2, 4)
        @_view.addChild(@_base)

        #@_content = new createjs.Bitmap("asset/page_#{('000' + (@_index + 1)).substr(-4, 4)}.png")
        @_content = new createjs.Bitmap(@_image)
        @_view.addChild(@_content)

        @_cover = new createjs.Shape()
        @_cover.graphics.beginFill('#ffffff').drawRect(0, 0, @_defaultWidth, @_defaultHeight)
        @_cover.alpha = 0.5

    # 表示する
    show: (useTransition = true, execute = true) ->
        time   = if useTransition then 1 else 0
        easing = jpp.util.Easing.easeOutQuart

        return CommandUtil.serial(execute
            () => @_view.visible = true
            new jpp.command.Tween(@_view, { alpha: 1 }, null, time, easing)
        )

    # 非表示にする
    hide: (useTransition = true, execute = true) ->
        time   = if useTransition then 1 else 0
        easing = jpp.util.Easing.easeOutQuart

        return CommandUtil.serial(execute
            new jpp.command.Tween(@_view, { alpha: 0 }, null, time, easing)
            () => @_view.visible = false
        )

    # ページ内容を指定したサイズにリサイズする
    resizeTo: (width = -1, height = -1, useTransition = true, execute = true, isFocused = true) ->
        @_base.onMouseOut()
        @_isFocused = isFocused

        width  = @_defaultWidth  if width  == -1
        height = @_defaultHeight if height == -1

        viewRegX = width  / 2
        viewRegY = height / 2

        baseScaleX = width  / @_defaultWidth
        baseScaleY = height / @_defaultHeight

        contentRect = RectangleResizer.resize(RectangleResizer.rect(0, 0, @_defaultWidth, @_defaultHeight), RectangleResizer.rect(0, 0, width, height))
        contentX      = contentRect.x
        contentY      = contentRect.y
        contentScaleX = contentRect.scaleX
        contentScaleY = contentRect.scaleY

        time   = if useTransition then 1 else 0
        easing = jpp.util.Easing.easeOutQuart

        return CommandUtil.parallel(execute
            new jpp.command.Tween(@_view, { regX: viewRegX, regY: viewRegY }, null, time, easing)
            new jpp.command.Tween(@_content, { x: contentX, y: contentY, scaleX: contentScaleX, scaleY: contentScaleY }, null, time, easing)
            new jpp.command.Tween(@_base, { scaleX: baseScaleX, scaleY: baseScaleY }, null, time, easing)
        )

    # ページ内容をデフォルトサイズにリサイズする
    resizeToDefault: (useTransition = true, execute = true) ->
        @_base.onMouseOut()
        return @resizeTo(@_defaultWidth, @_defaultHeight, useTransition, execute, false)

    # ビューオブジェクトを取得する
    getView: () ->
        return @_view


# export class
window.Page = Page
