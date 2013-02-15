module.exports = (grunt) ->
	grunt.initConfig

		#========================================
		# SCRIPT
		#========================================
		concat:
			milkpack:
				src: [
					'src/Util.coffee'
					'src/SceneStatus.coffee'
					'src/SceneEvent.coffee'
					'src/Scene.coffee'
					'src/MilkpackEvent.coffee'
					'src/Milkpack.coffee'
				]
				dest: 'tmp/milkpack-concat.coffee'

		coffee:
			milkpack:
				files:
					'lib/milkpack.js': 'tmp/milkpack-concat.coffee'
			example:
				files:
					'example/official-site/script/main.js': 'example/official-site/script/main.coffee'
					'example/dev-test/script/main.js': 'example/dev-test/script/main.coffee'
					'example/createjs-pushstate/script/main.js': 'example/createjs-pushstate/script/main.coffee'

		min:
			milkpack:
				src:
					'lib/milkpack.js'
				dest:
					'lib/milkpack.min.js'

		copy:
			official_site:
				files: [
					src: ['lib/milkpack.js']
					dest: 'example/official-site/script/milkpack/milkpack.js'
				]

			dev_test:
				files: [
					src: ['lib/milkpack.js']
					dest: 'example/dev-test/script/milkpack/milkpack.js'
				]

			createjs_pushstate:
				files: [
					src: ['lib/milkpack.js']
					dest: 'example/createjs-pushstate/script/milkpack/milkpack.js'
				]

		#========================================
		# STYLE
		#========================================
		less:
			official_site:
				src:
					'example/official-site/style/main.less'
				dest:
					'example/official-site/style/main.css'

			dev_test:
				src:
					'example/dev-test/style/main.less'
				dest:
					'example/dev-test/style/main.css'

			createjs_pushstate:
				src:
					'example/createjs-pushstate/style/main.less'
				dest:
					'example/createjs-pushstate/style/main.css'

		#========================================
		# CLEAN
		#========================================
		clean:
			tmp: [
				'tmp/',
				'grunt.js'
			]

		#========================================
		# WATCH
		#========================================
		watch:
			script:
				files: [
					'src/**/*.coffee'
					'example/**/*.coffee'
				]
				tasks:
					'default'
			style:
				files:
					'example/**/*.less'
				tasks:
					'default'

	#========================================
	# PLUGIN
	#========================================
	grunt.loadNpmTasks 'grunt-contrib'

	#========================================
	# TASK
	#========================================
	grunt.registerTask 'default', 'concat coffee min less copy clean'
	grunt.registerTask "r", "reload Google Chrome (OS X)", () -> require("child_process").exec 'osascript -e \'tell application \"Google Chrome\" to tell the active tab of its first window to reload\''
	grunt.registerTask 'w', 'watch'
