var config = exports;

config["Browser"] = {
    rootPath: "../",
    environment: "browser",
    sources: [
      "vendor/jquery-1.7.1.min.js",
      "lib/jquery.show-once.js"
    ],
    tests: [
      "test/jquery.show-once.test.js"
    ],
    resources: [
      {
        "path": "/",
        "file": "fixtures/testbed.html",
        "headers": {
          "Content-Type": "text/html"
        }
      },
      {
        "path": "/content.html",
        "file": "fixtures/content.html",
        "headers": {
          "Content-Type": "text/html"
        }
      }
    ]
};