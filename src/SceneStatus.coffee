###
 Copyright (c) 2013 Yukiya Okuda
 http://alumican.net/

 Milkpack is free software distributed under the terms of the MIT license:
 http://www.opensource.org/licenses/mit-license.php
###

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


	#export
	jpp.util.Namespace('jpp.milkpack').register('SceneStatus', SceneStatus)
