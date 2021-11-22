module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'public/client/app.js',
          'public/client/createLinkView.js',
          'public/client/link.js',
          'public/client/links.js',
          'public/client/linksView.js',
          'public/client/linkView.js',
          'public/client/router.js',
        ],
        dest: 'dist/build.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/**/index.test.js'],
      },
    },

    nodemon: {
      dev: {
        script: 'server/index.js',
      },
    },

    uglify: {
      mytarget: {
        files: {
          'dist/build.js': [
            'public/client/app.js',
            'public/client/createLinkView.js',
            'public/client/link.js',
            'public/client/links.js',
            'public/client/linksView.js',
            'public/client/linkView.js',
            'public/client/router.js',
          ],
        },
      },
    },

    eslint: {
      options: {
        quiet: true,
      },
      target: [
        'public/client/app.js',
        'public/client/createLinkView.js',
        'public/client/link.js',
        'public/client/links.js',
        'public/client/linksView.js',
        'public/client/linkView.js',
        'public/client/router.js',
        // Add list of files to lint here
      ],
    },

    cssmin: {
      'public/style.min.css': ['public/style.css'],
    },

    watch: {
      scripts: {
        files: ['public/client/**/*.js', 'public/lib/**/*.js'],
        tasks: ['concat', 'uglify'],
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin'],
      },
    },

    shell: {
      prodServer: {
        command: 'git push github main',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', (target) => {
    grunt.task.run(['nodemon', 'watch']);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('build', ['concat', 'uglify', 'eslint', 'cssmin']);

  grunt.registerTask('upload', (n) => {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['shell']);
    } else {
      grunt.task.run(['server-dev']);
    }
  });

  grunt.registerTask('deploy', (n) => {
    if (grunt.option('prod')) {
      grunt.task.run(['build', 'shell']);
    } else {
      grunt.task.run(['build', 'upload']);
    }
    // add your deploy tasks here
  });
};

