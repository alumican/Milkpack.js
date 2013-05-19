jpp.util.Namespace('jpp.event').use()
jpp.util.Namespace('jpp.milkpack').use()

#===============================================
#
# ウェブサイトのドキュメントクラス
#
#===============================================
class Application extends jpp.milkpack.Milkpack

    #===============================================
    #
    # アプリケーション設定
    #
    #===============================================

    # アプリケーションの起点となるパス
    # 例えば http://example.com/hoge/fuga/ を起点とするのであれば /hoge/fuga/ となる
    #root: '/'
    root: '/example/createjs-pushstate-slide/'

    # アプリケーションの起点となるファイル
    rootFile: 'index.html'

    # ルーティングに対応するシーンクラス
    routes:
        '/'                           : 'IndexScene'
        '/title'                      : 'PageScene'
        '/profile'                    : 'PageScene'
        '/theme'                      : 'PageScene'
        '/pushstate'                  : 'PageScene'
        '/pushstate/<int:id>'         : 'PageScene'
        '/pushstate/pjax'             : 'PageScene'
        '/pushstate/pjax/<int:id>'    : 'PageScene'
        '/pushstate/backbone'         : 'PageScene'
        '/pushstate/backbone/<int:id>': 'PageScene'
        '/pushstate/kazitori'         : 'PageScene'
        '/pushstate/kazitori/<int:id>': 'PageScene'
        '/milkpack'                   : 'PageScene'
        '/milkpack/<int:id>'          : 'PageScene'
        '/conclusion'                 : 'PageScene'
        '/conclusion/<int:id>'        : 'PageScene'
        '/seeyou'                     : 'LastScene'

    # ルーティング定義外の URL にアクセスした場合に表示するシーン
    #notFound: NotFoundScene

    #===============================================
    #
    # メンバ変数の定義
    #
    #===============================================

    stage        : null
    stageWidth   : 0
    stageHeight  : 0

    resourcesById: {}

    pages        : null
    pageLength   : 0
    pageTypes    : null
    pageFragments: null
    pageTree     : null
    pageTreeNodes: null

    newPageType: -1
    oldPageType: -1

    pageContainer: null
    lineContainer: null
    moveContainer: null
    zoomContainer: null

    isKeyDown: false

    #===============================================
    #
    # メソッドの定義 / オーバーライド
    #
    #===============================================

    #アプリケーション初期化時に呼び出される
    onInit: () ->

        #----------------------------------------
        # CreateJS を初期化する
        simpleCreatejs = new SimpleCreateJS('canvas', 60, 30, (stageWidth, stageHeight) =>
            @stageWidth  = stageWidth
            @stageHeight = stageHeight

            if @zoomContainer
                @zoomContainer.x = @stageWidth  / 2
                @zoomContainer.y = @stageHeight / 2

            @dispatchEvent(jpp.event.Event.RESIZE, { stageWidth: @stageWidth , stageHeight: @stageHeight })
        )
        @stage = simpleCreatejs.stage

        #----------------------------------------
        # ページ配置用のコンテナを作成する
        @zoomContainer = new createjs.Container()
        @zoomContainer.x = @stageWidth  / 2
        @zoomContainer.y = @stageHeight / 2
        @stage.addChild(@zoomContainer)

        @moveContainer = new createjs.Container()
        @moveContainer.visible = false
        @zoomContainer.addChild(@moveContainer)

        @lineContainer = new createjs.Shape()
        @moveContainer.addChild(@lineContainer)

        @pageContainer = new createjs.Container()
        @moveContainer.addChild(@pageContainer)

        #----------------------------------------
        # スライドのページ構成を定義する
        @pageTree = {

            #タイトルページ
            id: 'title', length: 0, branch: [

                # プロフィール
                { id: 'profile', length: 0, branch: [] }

                # テーマ
                { id: 'theme', length: 0, branch: [] }

                # pushState について
                { id: 'pushstate', length: 2, branch: [
                    { id: 'pjax', length: 1, branch: [] }
                    { id: 'backbone', length: 1, branch: [] }
                    { id: 'kazitori', length: 2, branch: [] }
                ]}

                # Milkpack.js について
                { id: 'milkpack', length: 12, branch: [] }

                # まとめ
                { id: 'conclusion', length: 2, branch: [] }
            ]
        }

        #----------------------------------------
        # スライドのページ Tree に必要な情報を追加する
        @pageFragments = ['/']
        @pageTreeNodes = [null]
        @pageTypes     = [2]

        pageIndex = @pageFragments.length
        pageType = 0

        lineGraphics = @lineContainer.graphics
        lineGraphics.setStrokeStyle(50)

        search = (node, level, fragment, siblingIndex, siblingLength, x, y, angle) =>

            #
            node.index         = pageIndex
            node.level         = level
            node.type          = pageType
            node.fragment      = if fragment == '' then ('/' + node.id) else fragment
            node.siblingIndex  = siblingIndex
            node.siblingLength = siblingLength
            node.x             = x
            node.y             = y
            node.angle         = angle

            @pageTypes.push(node.type)
            @pageFragments.push(node.fragment)
            @pageTreeNodes.push(node)
            ++pageIndex

            #
            lastChildX = x
            lastChildY = y
            childLength = node.length
            for i in [0...childLength]
                childRadius = 800 * (i + 1)

                child               = {}
                child.index         = pageIndex
                child.level         = level
                child.type          = pageType
                child.fragment      = fragment + '/' + (i + 1)
                child.siblingIndex  = siblingIndex
                child.siblingLength = siblingLength
                child.x             = x + childRadius * Math.cos(angle)
                child.y             = y + childRadius * Math.sin(angle)
                child.angle         = angle

                @pageTypes.push(child.type)
                @pageFragments.push(child.fragment)
                @pageTreeNodes.push(child)
                ++pageIndex

                lastChildX = child.x
                lastChildY = child.y

                ###
                lineGraphics.beginStroke('#999999')
                lineGraphics.moveTo(x, y)
                lineGraphics.lineTo(child.x, child.y)
                lineGraphics.endStroke()
                ###

            #
            branchLength = node.branch.length
            for i in [0...branchLength]
                branch = node.branch[i]

                if branchLength == 1
                    branchAngle  = angle
                    branchRadius = 800 * (i + 1)

                else
                    if level == 0
                        range        = Math.PI * 2
                        branchAngle  = angle + range * i / branchLength
                        branchRadius = 2000
                    else
                        range        = Math.PI * 2 / 3
                        branchAngle  = angle + range * (i / (branchLength - 1) - 0.5)
                        branchRadius = 1500

                branchX = lastChildX + branchRadius * Math.cos(branchAngle)
                branchY = lastChildY + branchRadius * Math.sin(branchAngle)

                lineGraphics.beginStroke('#999999')
                lineGraphics.moveTo(lastChildX, lastChildY)
                lineGraphics.lineTo(branchX, branchY)
                lineGraphics.endStroke()

                ++pageType
                search(branch, level + 1, "#{fragment}/#{branch.id}", i, branchLength, branchX, branchY, branchAngle)

        search(@pageTree, 0, '', 0, 1, 0, 0, 0)

        # ノードの数
        @pageLength = pageIndex

        @pageFragments.push('/seeyou')
        @pageTreeNodes.push(null)
        @pageTypes.push(2)
        ++@pageLength

        # 色を設定する
        for i in [0...@pageLength - 2]
            @pageTreeNodes[i + 1].color = '#' + tinycolor({ h: 360 * i / (@pageLength - 2), s: 40, v: 70 }).toHex()

        console.log(@pageFragments.join('\n'))

        #----------------------------------------
        # リソースを読み込む
        @resourcesById = {}
        files = ({ id: "#{i}", src:"#{@root}asset/page_#{('000' + (i + 1)).substr(-4, 4)}.png" } for i in [0...@pageLength])
        loadQueue = simpleCreatejs.createLoadQueue(files, createjs.Sound)
        loadQueueFunc = () => loadQueue.load()

        @addCommand(
            new jpp.command.Func(loadQueueFunc, [], loadQueue, 'complete')
            () =>
                @resourcesById[file.id] = loadQueue.getResult(file.id) for file in files

                #----------------------------------------
                # ページを生成する
                @pages = [null]

                for i in [1...@pageLength - 1]
                    node = @pageTreeNodes[i]
                    nodeIndex    = node.index
                    nodeLevel    = node.level
                    nodeFragment = node.fragment
                    nodeColor    = node.color
                    page = new Page(@, @stage, nodeIndex, nodeLevel, nodeFragment, nodeColor, @resourcesById[i])
                    @pages.push(page)

                    view = page.getView()
                    view.x = node.x
                    view.y = node.y

                    if nodeLevel == 0
                        view.rotation = node.angle * 180 / Math.PI
                    else
                        view.rotation = node.angle * 180 / Math.PI - 90

                    ###
                    ratio = i / @pageLength
                    angle = ratio * Math.PI * 2
                    radius = 5000 #+ 1000 * Math.sin(angle * 5)
                    view.x = radius * Math.cos(angle)
                    view.y = radius * Math.sin(angle)
                    view.rotation = angle * 180 / Math.PI
                    ###

                    ###
                    ratio = i / @pageLength
                    angle = ratio * Math.PI * 2
                    radius = 5000 + 1024 * nodeLevel
                    view.x = radius * Math.cos(angle)
                    view.y = radius * Math.sin(angle)
                    view.rotation = angle * 180 / Math.PI
                    ###

                    ###
                    ratio = i / @pageLength
                    radius = 3000 + i * 100
                    angle = ratio * Math.PI * 2
                    view.x = radius * Math.cos(angle)
                    view.y = radius * Math.sin(angle)
                    view.rotation = angle * 180 / Math.PI
                    ###

                    #view.x = (Math.random() - 0.5) * 10000
                    #view.y = (Math.random() - 0.5) * 10000
                    #view.rotation = Math.random() * 360

                    @pageContainer.addChild(view)
                    page.show(false)

                @pages.push(null)

                #----------------------------------------
                # キーボード入力を有効化する
                $(document).keyup (event) =>
                    switch event.keyCode
                        when 38 # UP
                            @gotoSpecifiedPageByIndex(0)
                        when 40 # DOWN
                            return
                        when 37 # LEFT
                            @gotoPrevPage()
                        when 39 # RIGHT
                            @gotoNextPage()
        )



    gotoSpecifiedPageByIndex: (index, useTransition) ->
        fragment = @pageFragments[index]
        @oldPageType = @newPageType
        @newPageType = @pageTypes[index]
        console.log("gotoSpecifiedPageByIndex: fragment = #{fragment}")
        @goto(fragment)

    gotoNextPage: (useTransition) ->
        fragment = @getTargetFragment()
        index = @pageFragments.indexOf(fragment) + 1
        return if index > @pageLength - 1
        @gotoSpecifiedPageByIndex(index, useTransition)

    gotoPrevPage: (useTransition) ->
        fragment = @getTargetFragment()
        index = @pageFragments.indexOf(fragment) - 1
        return if index < 0
        @gotoSpecifiedPageByIndex(index, useTransition)

    gotoSpecifiedPageByFragment: (fragment, useTransition) ->
        index = @pageFragments.indexOf(fragment)
        @gotoSpecifiedPageByIndex(index, useTransition) if index != -1

    setButton: (target, onClick) ->
        target.onMouseOver = (event) =>
            target.alpha = 0.3
            $('#canvas').css('cursor', 'pointer')
        target.onMouseOut = (event) =>
            target.alpha = 1
            $('#canvas').css('cursor', 'default')
        target.onClick = onClick


# start application
$(document).ready ()->
    new Application({ isReleaseMode: false })
