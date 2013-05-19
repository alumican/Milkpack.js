jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.event').use()

	class SceneStatus extends jpp.event.Event

		#===============================================
		#
		# Event Type
		#
		#===============================================

		@HELLO : 'hello'
		@ARRIVE: 'arrive'
		@STAY  : 'stay'
		@LEAVE : 'leave'
		@BYE   : 'bye'
		@GONE  : 'gone'


	# export
	jpp.util.Namespace('jpp.milkpack').register('SceneStatus', SceneStatus)
