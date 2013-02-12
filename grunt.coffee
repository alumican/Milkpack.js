module.exports = (grunt) ->
	grunt.initConfig

		#========================================
		# SCRIPT
		#========================================
		concat:
			milkpack:
				src: [
					'src/Milkpack.coffee'
					'src/MilkpackEvent.coffee'
					'src/Scene.coffee'
					'src/SceneEvent.coffee'
					'src/SceneStatus.coffee'
					'src/Util.coffee'
				]
				dest: 'tmp/milkpack-concat.coffee'

		coffee:
			milkpack:
				files:
					'lib/milkpack.js': 'tmp/milkpack-concat.coffee'
			example:
				files:
					'example/official/script/main.js': 'example/official/coffee/main.coffee'
			kazitori:
				files:
					'example/official/script/kazitori.js': 'example/official/coffee/kazitori.coffee'
				options:
					bare: true

		min:
			milkpack:
				src:
					'lib/milkpack.js'
				dest:
					'lib/milkpack.min.js'

		#========================================
		# WATCH
		#========================================
		less:
			example:
				src:
					'example/official/less/main.less'
				dest:
					'example/official/style/main.css'

		#========================================
		# WATCH
		#========================================
		watch:
			script:
				files: [
					'src/**/*.coffee'
					'example/official/coffee/*.coffee'
				]
				tasks:
					#['default', 'r']
					'default'
			style:
				files:
					'example/official/less/*.less'
				tasks:
					#['default', 'r']
					'default'
			#html:
			#	files: 'example/official/index.html'
			#	tasks: 'r'

	#========================================
	# PLUGIN
	#========================================
	grunt.loadNpmTasks 'grunt-contrib'

	#========================================
	# TASK
	#========================================
	grunt.registerTask 'default', 'concat coffee min less'
	grunt.registerTask "r", "reload Google Chrome (OS X)", () -> require("child_process").exec 'osascript -e \'tell application \"Google Chrome\" to tell the active tab of its first window to reload\''
	grunt.registerTask 'w', 'watch'
