jpp.util.Namespace('jpp.command').use()
jpp.util.Namespace('jpp.event').use()
jpp.util.Namespace('jpp.milkpack').use()


#===============================================
#
# ルートとなるシーン
#
#===============================================
class IndexScene extends jpp.milkpack.Scene

    #===============================================
    #
    # メンバ変数の定義
    #
    #===============================================

    manager      : null
    pageContainer: null
    moveContainer: null
    zoomContainer: null

    _loopCommand: null
    _loopIndex: -1

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

    #シーン遷移メソッド（シーン通過 / 到着）のオーバーライド
    _onHello: () =>
        @moveContainer.rotation = (1 + Math.random()) * 360
        @moveContainer.scaleX = 0
        @moveContainer.scaleY = 0
        @moveContainer.visible = true

        @addCommand(
        )

    #シーン遷移メソッド（シーン到着）のオーバーライド
    _onArrive: () =>
        @manager.stage.enableMouseOver(0)

        targetX        = 200
        targetY        = 0
        targetScale    = 0.08
        targetRotation = 0

        time   = 2
        easing = jpp.util.Easing.easeInOutQuart

        @addCommand(
            new jpp.command.Tween(@moveContainer, { x: targetX, y:targetY, scaleX:targetScale, scaleY: targetScale, rotation: targetRotation }, null, time, easing)
            new jpp.command.Wait(2)
            () => @startLoop()
        )

    #シーン遷移メソッド（シーン離脱）のオーバーライド
    _onLeave: () =>
        @manager.stage.enableMouseOver(30)

        @_loopCommand?.interrupt()

        @addCommand(
        )

    #シーン遷移メソッド（シーン離脱 / 通過）のオーバーライド
    _onBye: () =>
        @addCommand(
        )

    startLoop: () =>

        angle  = Math.random() * Math.PI * 2
        radius = Math.random() * 800

        rotation0 = Math.random() * 360
        x0        = 200 + radius * Math.cos(angle)
        y0        = radius * Math.cos(angle)
        scale0    = 0.03 + Math.random() * 0.5

        rotation1 = Math.random() * 360
        x1        = 200 + radius * Math.cos(angle + Math.PI)
        y1        = radius * Math.cos(angle + Math.PI)
        scale1    = 0.03 + Math.random() * 0.5

        time   = 10
        #easing = if Math.random() < 0.5 then jpp.util.Easing.easeInOutQuart else jpp.util.Easing.Linear
        easing = jpp.util.Easing.Linear

        @_loopCommand?.interrupt()
        @_loopCommand = new jpp.command.Serial(
            new jpp.command.Tween(@moveContainer, { x: x1, y: y1, scaleX: scale1, scaleY: scale1, rotation: rotation1 }, { x: x0, y: y0, scaleX: scale0, scaleY: scale0, rotation: rotation0 }, time, easing)
            () => @startLoop()
        )
        @_loopCommand.execute()

        return


        ++@_loopIndex
        @_loopIndex %= 2
        console.log(@_loopIndex)

        @_loopIndex = 1

        @_loopCommand?.interrupt()
        switch @_loopIndex

            when 0
                rotation0 = 0
                x0        = 200
                y0        = 0
                scale0    = 2

                rotation1 = 360
                x1        = 200
                y1        = 0
                scale1    = 0.05

                time   = 10
                easing = jpp.util.Easing.easeInOutQuart

                @_loopCommand = new jpp.command.Serial(
                    new jpp.command.Tween(@moveContainer, { x: x1, y: y1, scaleX: scale1, scaleY: scale1, rotation: rotation1 }, { x: x0, y: y0, scaleX: scale0, scaleY: scale0, rotation: rotation0 }, time, easing)
                    () => @startLoop()
                )
                @_loopCommand.execute()


            when 1
                angle  = Math.random() * Math.PI * 2
                radius = Math.random() * 500

                rotation0 = Math.random() * 360
                x0        = 200 + radius * Math.cos(angle)
                y0        = radius * Math.cos(angle)
                scale0    = 0.05 + Math.random() * 2

                rotation1 = Math.random() * 360
                x1        = 200 + radius * Math.cos(angle + Math.PI)
                y1        = radius * Math.cos(angle + Math.PI)
                scale1    = 0.05 + Math.random() * 2

                time   = 10
                easing = if Math.random() < 0.5 then jpp.util.Easing.easeInOutQuart else jpp.util.Easing.Linear

                @_loopCommand = new jpp.command.Serial(
                    new jpp.command.Tween(@moveContainer, { x: x1, y: y1, scaleX: scale1, scaleY: scale1, rotation: rotation1 }, { x: x0, y: y0, scaleX: scale0, scaleY: scale0, rotation: rotation0 }, time, easing)
                    () => @startLoop()
                )
                @_loopCommand.execute()




# export class
window.IndexScene = IndexScene
