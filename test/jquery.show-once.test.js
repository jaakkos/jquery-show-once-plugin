
buster.spec.expose();

var runner = buster.testRunner.create({
    timeout: 5000
});

var log = function() {
  buster.log(arguments);
};

var clearCookies = function() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

var defaultContent = '<p>Content from server</p><a href="http://www.google.fi/" id="show-once-link">link 1</a><p><a href="#s">Link 2</a></p>';

describe("Show Once", function() {
  describe("with Cookie", function() {
    before(function() {
      clearCookies();
      document.cookie = '_show_once_traking_cookie_show-once-1=1; expires=Thu, 01 Jan 2013 00:00:00 GMT; path=/';
    });

    it("dont load content from server if cookie is allready dropped", function(done) {
      jQuery("#show-once-1").bind('plugin_showOnce.contentLoaded', function(event) {
        var content = jQuery("#show-once-1").html();
        expect(content).toBeSameAs("<p>place holder</p>");
        done();
      });
      jQuery("#show-once-1").showOnce({contentUrl: "/content.html", logger: buster.log, log: true});
    });

    after(function() {
      clearCookies();
    });

  });

  describe("with out Cookie", function() {

    before(function() {
      clearCookies();
    });

    it("load the content from server", function(done) {
      jQuery("#show-once-2").bind('plugin_showOnce.contentLoaded', function(event) {
        expect(jQuery("#show-once-2").html()).toBeSameAs(defaultContent);
        done();
      });
      jQuery("#show-once-2").showOnce({contentUrl: "/content.html", logger: buster.log, log: true});
    });

    it("add bind to all links inside given element", function(done) {
      jQuery("#show-once-4").bind('plugin_showOnce.contentLoaded', function(event) {
        var links = jQuery.find("#show-once-4 a");
        expect((jQuery(links[0]).data("events"))['click'][0]['namespace']).toBeSameAs('showOnce');
        expect((jQuery(links[1]).data("events"))['click'][0]['namespace']).toBeSameAs('showOnce');
        done();
      });
      jQuery("#show-once-4").showOnce({contentUrl: "/content.html", logger: buster.log, log: true});
    });

    it("dont add cookie if links are not clicked", function(done) {
      jQuery("#show-once-3").bind('plugin_showOnce.contentLoaded', function(event) {
        expect(document.cookie).toBeSameAs('');
        done();
      });
      jQuery("#show-once-3").showOnce({contentUrl: "/content.html", logger: buster.log, log: true});
    });

    it("add cookie when link is clicked",  function(done) {
      jQuery("#show-once-5").bind('plugin_showOnce.contentLoaded', function(event) {
        jQuery("#show-once-5 a:first").click();
        expect(document.cookie).toBeSameAs('_show_once_traking_cookie_show-once-5=1');
        done();
      });
      jQuery("#show-once-5").showOnce({contentUrl: "/content.html", logger: buster.log, log: true});
    });

    after(function() {
      clearCookies();
    });

  });

});