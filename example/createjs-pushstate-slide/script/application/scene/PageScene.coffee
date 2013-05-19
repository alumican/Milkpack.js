jpp.util.Namespace('jpp.command').use()
jpp.util.Namespace('jpp.event').use()
jpp.util.Namespace('jpp.milkpack').use()


#===============================================
#
# 個別ページのシーン
#
#===============================================
class PageScene extends jpp.milkpack.Scene

    #===============================================
    #
    # メンバ変数の定義
    #
    #===============================================

    manager      : null
    pageIndex    : -1
    pageType     : -1
    pageLevel    : -1
    page         : null
    pageView     : null
    pageContainer: null
    zoomContainer: null

    #===============================================
    #
    # メソッドの定義 / オーバーライド
    #
    #===============================================

    #初期化メソッドのオーバーライド
    _onInit: () =>
        @manager       = @getManager()
        @pageIndex     = @manager.pageFragments.indexOf(@getFragment())
        @pageType      = @manager.pageTypes[@pageIndex]
        @pageLevel     = @manager.pageTreeNodes[@pageIndex].level
        @page          = @manager.pages[@pageIndex]
        @pageContainer = @manager.pageContainer
        @moveContainer = @manager.moveContainer
        @zoomContainer = @manager.zoomContainer
        @pageView      = @page.getView()

    #シーン遷移メソッド（シーン通過 / 到着）のオーバーライド
    _onHello: () =>
        @addCommand(
        )

    #シーン遷移メソッド（シーン到着）のオーバーライド
    _onArrive: () =>
        @manager.addEventListener(jpp.event.Event.RESIZE, @_stageResizeHandler)
        @page.resizeTo(@manager.stageWidth, @manager.stageHeight)

        pageViewX = @pageView.x
        pageViewY = @pageView.y

        rad = @pageView.rotation * Math.PI / 180
        sin = Math.sin(rad)
        cos = Math.cos(rad)

        targetX        = -( cos * pageViewX + sin * pageViewY)
        targetY        = -(-sin * pageViewX + cos * pageViewY)
        targetScale    = 1
        targetRotation = -@pageView.rotation

        easing = jpp.util.Easing.easeInOutQuart

        if @pageLevel == 0
            time      = 1
            zoomScale = @zoomContainer.scaleX * 0.8
            zoomTime  = 0.5
            easing = jpp.util.Easing.easeInOutQuart

            ###
            time = 1
            @addCommand(
                new jpp.command.Parallel(
                    new jpp.command.Tween(@zoomContainer, { scaleX:1, scaleY: 1 }, null, time, jpp.util.Easing.easeInOutQuart)
                    new jpp.command.Tween(@moveContainer, { x: targetX, y:targetY, scaleX:targetScale, scaleY: targetScale, rotation: targetRotation }, null, time, easing)
                )
            )
            return
            ###

        else if @pageType != @manager.oldPageType
            time      = 2
            zoomScale = 0.1 * @pageLevel
            zoomTime  = 0.5
        else
            time      = 1
            zoomScale = 0.7
            zoomTime  = 0.7

        @addCommand(
            new jpp.command.Parallel(
                new jpp.command.Serial(
                    new jpp.command.Tween(@zoomContainer, { scaleX:zoomScale, scaleY: zoomScale }, null, time * 0.5, jpp.util.Easing.easeOutQuart)
                    new jpp.command.Tween(@zoomContainer, { scaleX:1, scaleY: 1 }, null, time * zoomTime, jpp.util.Easing.easeInOutQuart)
                )
                new jpp.command.Tween(@moveContainer, { x: targetX, y:targetY, scaleX:targetScale, scaleY: targetScale, rotation: targetRotation }, null, time, easing)
            )
        )

    #シーン遷移メソッド（シーン離脱）のオーバーライド
    _onLeave: () =>
        @manager.removeEventListener(jpp.event.Event.RESIZE, @_stageResizeHandler)
        @page.resizeToDefault()

        @addCommand(
        )

    #シーン遷移メソッド（シーン離脱 / 通過）のオーバーライド
    _onBye: () =>
        @addCommand(
        )

    _stageResizeHandler: (event) =>
        @page.resizeTo(@manager.stageWidth, @manager.stageHeight, false)


# export class
window.PageScene = PageScene
