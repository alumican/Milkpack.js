jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.command').use()
	jpp.util.Namespace('jpp.milkpack').use()

	#===============================================
	#
	# Scenes
	#
	#===============================================
	class IndexScene extends jpp.milkpack.Scene

		_onInit: () =>
			@setTitle('Milkpack JS')
			@$header = $('#header')
			@$footer = $('#footer')

		_onHello: () =>
			@addCommand(
				new jpp.command.Parallel(
					new jpp.command.JqueryAnimate(@$header, { opacity : '1' }, { duration : 500, easing : 'linear' })
					new jpp.command.JqueryAnimate(@$footer, { opacity : '1' }, { duration : 500, easing : 'linear' })
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
					new jpp.command.JqueryAnimate(@$header, { opacity : '0' }, { duration : 500, easing : 'linear' })
					new jpp.command.JqueryAnimate(@$footer, { opacity : '0' }, { duration : 500, easing : 'linear' })
				)
			)


	class PageScene extends jpp.milkpack.Scene

		_onInit: ($page) =>
			@$page = $page

		_onHello: () =>
			@addCommand(
				new jpp.command.JqueryAnimate(@$page, { opacity : '1' }, { duration : 500, easing : 'linear' })
			)

		_onBye: () =>
			@addCommand(
				new jpp.command.JqueryAnimate(@$page, { opacity : '0' }, { duration : 500, easing : 'linear' })
			)


	class AboutScene extends PageScene

		_onInit: () =>
			@setTitle('What | Milkpack JS')
			super($('#page_what'))


	class UsageScene extends PageScene

		_onInit: () =>
			@setTitle('How | Milkpack JS')
			super($('#page_how'))


	class DownloadScene extends PageScene

		_onInit: (id) =>
			@setTitle('Where | Milkpack JS')
			super($('#page_where'))


	class ContactScene extends PageScene

		_onInit: () =>
			@setTitle('Who | Milkpack JS')
			super($('#page_who'))

	class NotFoundScene extends PageScene

		_onInit: () =>
			@setTitle('404 Not Found | Milkpack JS')
			super($('#page_not_found'))


	#===============================================
	#
	# Application
	#
	#===============================================
	class Application extends jpp.milkpack.Milkpack

		#アプリケーションのルート
		root: '/'

		#インデックスファイル名
		rootFile: 'index.html'

		#ルーティング定義
		routes:
			'/': IndexScene
			'/what': AboutScene
			'/how': UsageScene
			'/where': DownloadScene
			'/who': ContactScene

		#Not Found
		notFound: NotFoundScene

		#アプリケーション初期化時に呼び出される
		onInit: () ->
			$('.fragment').on('click', (event) =>
				return if event.which > 1 or event.metaKey or event.ctrlKey or event.shiftKey or event.altKey
				event.preventDefault()
				@goto(event.currentTarget.pathname)
			)


	#===============================================
	#
	# Entry point
	#
	#===============================================
	$(document).ready ()->
		app = new Application({ isReleaseMode: false })
