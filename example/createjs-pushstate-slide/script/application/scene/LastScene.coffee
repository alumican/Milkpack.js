jpp.util.Namespace('jpp.command').use()
jpp.util.Namespace('jpp.event').use()
jpp.util.Namespace('jpp.milkpack').use()


#===============================================
#
# 最後のシーン
#
#===============================================
class LastScene extends jpp.milkpack.Scene

    #===============================================
    #
    # メンバ変数の定義
    #
    #===============================================

    manager      : null
    pageContainer: null
    moveContainer: null
    zoomContainer: null

    @stage: null
    @image: null
    @bitmap: null

    #===============================================
    #
    # メソッドの定義 / オーバーライド
    #
    #===============================================

    #初期化メソッドのオーバーライド
    _onInit: () =>
        @manager       = @getManager()
        @pageContainer = @manager.pageContainer
        @moveContainer = @manager.moveContainer
        @zoomContainer = @manager.zoomContainer

        @stage = @manager.stage
        @image = @manager.resourcesById[@manager.pageLength - 1]
        @bitmap = new createjs.Bitmap(@image)

    #シーン遷移メソッド（シーン通過 / 到着）のオーバーライド
    _onHello: () =>
        @addCommand(
        )

    #シーン遷移メソッド（シーン到着）のオーバーライド
    _onArrive: () =>
        @stage.addChild(@bitmap)
        @bitmap.alpha = 0
        @bitmap.x = (@manager.stageWidth  - 1024) / 2
        @bitmap.y = (@manager.stageHeight -  768) / 2

        targetX        = 0
        targetY        = 0
        targetScale    = 0
        targetRotation = Math.random() * Math.PI * 2

        time   = 2
        easing = jpp.util.Easing.easeInOutQuart

        @addCommand(
            new jpp.command.Tween(@moveContainer, { x: targetX, y:targetY, scaleX:targetScale, scaleY: targetScale, rotation: targetRotation }, null, time, easing)
            new jpp.command.Tween(@bitmap, { alpha: 1 }, null, 1, jpp.util.Easing.Linear)
        )

    #シーン遷移メソッド（シーン離脱）のオーバーライド
    _onLeave: () =>
        @stage.removeChild(@bitmap)

        @addCommand(
        )

    #シーン遷移メソッド（シーン離脱 / 通過）のオーバーライド
    _onBye: () =>
        @addCommand(
        )


# export class
window.LastScene = LastScene
