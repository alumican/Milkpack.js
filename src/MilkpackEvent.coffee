jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.event').use()

	class MilkpackEvent extends jpp.event.Event

		#===============================================
		#
		# Event Type
		#
		#===============================================

		# 最初のシーンが認識されたときに発行される
		@INIT: 'init'

		# シーンが切り替わったときに発行される
		@CHANGE: 'change'


	# export
	jpp.util.Namespace('jpp.milkpack').register('MilkpackEvent', MilkpackEvent)
