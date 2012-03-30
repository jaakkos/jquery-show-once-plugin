(function() {
  ;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var PluginShowOnce, defaults, pluginName;
    pluginName = 'showOnce';
    defaults = {
      expires: 65,
      cookieKeyPrefix: '_show_once_traking_cookie',
      contentUrl: null,
      callback: null,
      log: false,
      logger: null
    };
    PluginShowOnce = (function() {

      function PluginShowOnce(element, options) {
        this.element = element;
        this.contenLoaded = __bind(this.contenLoaded, this);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      PluginShowOnce.prototype.init = function() {
        if (this.cookie()) {
          return this.contenLoaded();
        } else {
          return this.loadContent();
        }
      };

      PluginShowOnce.prototype.loadContent = function() {
        var _this = this;
        return $.ajax({
          url: this.options.contentUrl,
          type: 'GET',
          error: function(xhr, status, error) {
            _this.log("Error while loading content from:", xhr, status, error);
            return _this.contenLoaded();
          },
          success: function(content) {
            $(_this.element).html(content);
            _this.addTrackingToLinks();
            return _this.contenLoaded();
          }
        });
      };

      PluginShowOnce.prototype.addTrackingToLinks = function() {
        var link, _i, _len, _ref, _results;
        _ref = $(this.element).find('a');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          link = _ref[_i];
          _results.push(this.bindTrackerToLink(link));
        }
        return _results;
      };

      PluginShowOnce.prototype.bindTrackerToLink = function(linkElement) {
        var _this = this;
        return $(linkElement).bind('click.showOnce', function(event) {
          _this.cookie(1);
          return true;
        });
      };

      PluginShowOnce.prototype.contenLoaded = function() {
        var callback_function;
        if (this.options.callback) {
          if (!this.cookie()) {
            callback_function = this.options.callback($(this.element));
          }
        }
        $(this.element).trigger('plugin_showOnce.contentLoaded');
        return this;
      };

      PluginShowOnce.prototype.cookie = function(value) {
        var cookieExpiresAt, pair, pairs, _i, _len;
        if (arguments.length === 1 && (!/Object/.test(Object.prototype.toString.call(value)))) {
          value = String(value);
          cookieExpiresAt = new Date();
          cookieExpiresAt.setDate(cookieExpiresAt.getDate() + this.options.expires);
          return document.cookie = [encodeURIComponent(this.cookieKey()), '=', encodeURIComponent(value), '; expires=' + cookieExpiresAt.toUTCString()].join('');
        }
        pairs = document.cookie.split('; ');
        for (_i = 0, _len = pairs.length; _i < _len; _i++) {
          pair = pairs[_i];
          pair = pair.split('=');
          if (decodeURIComponent(pair[0]) === this.cookieKey()) {
            return decodeURIComponent(pair[1]) || '';
          }
        }
        return null;
      };

      PluginShowOnce.prototype.cookieKey = function() {
        return this.options.cookieKeyPrefix + ($(this.element).attr('id') ? '_' + $(this.element).attr('id') : '');
      };

      PluginShowOnce.prototype.log = function(message) {
        if (this.options.log && this.options.logger) {
          try {
            return this.options.logger(message);
          } catch (error) {

          }
        }
      };

      return PluginShowOnce;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new PluginShowOnce(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
