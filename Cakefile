{exec} = require 'child_process'

task 'build', 'compile and uglify show-once', (options) ->
  exec(
    [
      "coffee -o lib -c src/jquery.show-once.coffee"
      "uglifyjs lib/jquery.show-once.js > lib/jquery.show-once.min.js"
    ].join(' && '), (err, stdout, stderr) ->
      if err then console.log stderr.trim()
  )
