jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.event').use()

	class SceneEvent extends jpp.event.Event

		#===============================================
		#
		# Event Type
		#
		#===============================================

		@CHANGE_STATUS: 'chanegStatus'


	# export
	jpp.util.Namespace('jpp.milkpack').register('SceneEvent', SceneEvent)
