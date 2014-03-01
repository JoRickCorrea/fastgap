"use strict";

var buildConfig = require('./config/build');

module.exports = function(grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    var appConfig = {

        // Default Paths
        paths: {
          src: "./src",
          dist: "./dist"
        },

        // Assets directory
        dirs: {
            js:     "<%= paths.src %>/assets/js",
            sass:   "<%= paths.src %>/assets/scss",
            css:    "<%= paths.src %>/assets/css",
            img:    "<%= paths.src %>/assets/images",
            vendor: "<%= paths.src %>/vendor"
        },

        // Load package.jsom
        pkg: grunt.file.readJSON("package.json"),

        // Metadata
        banner:
        "\n" +
        "/*\n" +
         " * -------------------------------------------------------\n" +
         " * Project: <%= pkg.name %>\n" +
         " * Version: <%= pkg.version %>\n" +
         " *\n" +
         " *\n" +
         " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>\n" +
         " * -------------------------------------------------------\n" +
         " */\n" +
         "\n",

        // Watch files
        watch: {
            options: {
                livereload: true
            },
            css: {
                files: ["<%= dirs.sass %>/{,*/}*.{scss,sass}"],
                tasks: ["compass", "notify:compass"]
            },
            js: {
                files: ["<%= jshint.all %>"],
                tasks: ["jshint", "uglify", "notify:js"]
            },
            html: {
                files: [
                    // carregamento automático do browser para as atualizações das extensões abaixo
                    "/*.{html,htm,shtml,shtm,xhtml,php,jsp,asp,aspx,erb,ctp}"
                ]
            }
        },

        // Files Validation
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                "Gruntfile.js",
                "<%= dirs.js %>/main.js"
            ]
        },

        // Minification
        uglify: {
            options: {
                mangle: false,
                banner: "<%= banner %>"
            }
            // ,
            // dist: {
            //     files: {
            //         "<%= dirs.js %>/main.min.js": [
            //         "<%= dirs.js %>/main.js"
            //         ]
            //     }
            // }
        },

        // Compass for SCSS
        compass: {
            dist: {
                options: {
                    force: true,
                    config: "config/compass.rb",
                    sassDir: "<%= dirs.sass %>",
                    cssDir: "<%= dirs.css %>",
                    banner: "<%= banner %>",
                    specify: "<%= dirs.sass %>/*.scss"
                }
            }
        },

        // Notificações
        notify: {
          compass: {
            options: {
              title: "SASS - <%= pkg.title %>",
              message: "Build with success!"
            }
          },
          js: {
            options: {
              title: "Javascript - <%= pkg.title %>",
              message: "Minified and validated with success!"
            }
          }
        },

        copy: {
          distVendor: {
            files: [{
              expand: true,
              cwd: "<%= dirs.vendor %>/",
              src: buildConfig.vendorFiles,
              dest: "<%= paths.dist %>/vendor/"
            }]
          },
          distHtml: {
            files: [{
              expand: true,
              cwd: "<%= paths.src %>/",
              src: buildConfig.htmlFiles,
              dest: "<%= paths.dist %>/"
            }]
          },
          distCss: {
            files: [{
              expand: true,
              cwd: "<%= dirs.css %>/",
              src: buildConfig.cssFiles,
              dest: "<%= paths.dist %>/assets/css"
            }]
          }
        }



    };


    // Init grunt configurations
    grunt.initConfig(appConfig);


    // Tasks
    // --------------------------

    // Default task
    grunt.registerTask( "default", [ "jshint", "compass", "uglify" ] );

    // Watch files
    grunt.registerTask( "watch-files", [ "watch" ]);

    // grunt.registerTask('server', [
    //   'connect',
    //   'watch'
    // ]);

    //NOTE(ajoslin): the order of these tasks is very important.
    grunt.registerTask('build', [
      'compass',
      'copy:distVendor',
      'copy:distHtml',
      'copy:distCss',
      'uglify'
    ]);


    // Alias
    grunt.registerTask( "w", [ "watch" ] );

};
