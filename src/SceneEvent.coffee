###
 Copyright (c) 2013 Yukiya Okuda
 http://alumican.net/

 Milkpack is free software distributed under the terms of the MIT license:
 http://www.opensource.org/licenses/mit-license.php
###

jpp.util.Scope.temp () ->

	jpp.util.Namespace('jpp.event').use()

	class SceneEvent extends jpp.event.Event

		#===============================================
		#
		# Event Type
		#
		#===============================================

		@CHANGE_STATUS: 'chanegStatus'


	#export
	jpp.util.Namespace('jpp.milkpack').register('SceneEvent', SceneEvent)
