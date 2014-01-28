/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Chris Talkington, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // Make an empty dir for testing as git doesn't track empty folders.
  grunt.file.mkdir('test/fixtures/empty_folder');
  grunt.file.mkdir('test/expected/copy_test_mix/empty_folder');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['tmp']
    },

    test_vars: {
      name: 'grunt-contrib-copy',
      version: '0.1.0',
      match: 'folder_one/*'
    },

    // Configuration to be run (and then tested).
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.*'], dest: 'tmp/copy_test_files/'},
          {expand: true, cwd: 'test/fixtures', src: ['**'], dest: 'tmp/copy_test_mix/'},
          {expand: true, cwd: 'test/fixtures', src: ['<%= test_vars.match %>'], dest: 'tmp/copy_test_v<%= test_vars.version %>/'}
        ]
      },

      flatten: {
        files: [
          {expand: true, flatten: true, filter: 'isFile', src: ['test/fixtures/**'], dest: 'tmp/copy_test_flatten/'}
        ]
      },

      single: {
        files: [
          {src: ['test/fixtures/test.js'], dest: 'tmp/single.js'}
        ]
      },

      verbose: {
        files: [
          {expand: true, src: ['test/fixtures/**'], dest: 'tmp/copy_test_verbose/'}
        ]
      },

      mode: {
        options: {
          mode: '0444',
        },
        src: ['test/fixtures/test2.js'],
        dest: 'tmp/mode.js',
      },

      symlink: {
        options: {
          copySymlinkAsSymlink: true,
        },
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['*.js'], dest: 'tmp/copy_test_symlink'}
        ]
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  //git clone on windows can't copy symlinks properly. 
  //So, we need to create test symlinks here
  grunt.registerTask('create-symlink', function() {
     if (process.platform ==='win32') {
       var fs = require('fs');
       if (fs.existsSync('test/fixtures/test2.link.js')) {
         fs.unlinkSync('test/fixtures/test2.link.js');
       }

       if (fs.existsSync('test/expected/copy_test_symlink/test2.link.js')) {
         fs.unlinkSync('test/expected/copy_test_symlink/test2.link.js');
       }

       try {                       
         fs.symlinkSync('test/fixtures/test2.js', 'test/fixtures/test2.link.js');
         fs.symlinkSync('test/fixtures/test2.js', 'test/expected/copy_test_symlink/test2.link.js');
       } catch(err) {
         if (err.code === 35) { //symlinks not implemented in os
         
         }
       }
     }
  });

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'create-symlink', 'copy', 'nodeunit']);
  
  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};