module.exports = function(grunt) {
    
    require('load-grunt-tasks')(grunt); 
    
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            libsass: {
                filesObject:{
                    files: {
                        'css/local.css' : 'css/local.scss',
                        'css/libs/ionic.css': 'css/libs/scss/ionic.scss'
                    }
                }
            },
            cssmin: {
                options: {},
                target: {
                  files: {
                   'css/local.css' : 'css/local.css',
                   'css/libs/ionic.min.css' : 'css/libs/ionic.css'
                  }
                }
              },
           watch: {
                css: {
                    files: ['**/*.scss'],
                    tasks: ['libsass','cssmin'],
                    options: {
                      spawn: false
                    }
                  }
              }
});

      grunt.registerTask( 'default', ['libsass', 'cssmin' ,'watch'] );

      grunt.loadNpmTasks('grunt-libsass');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-contrib-watch');
};