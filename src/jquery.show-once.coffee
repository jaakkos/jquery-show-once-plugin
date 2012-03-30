#  Project: Show Once jQuery plugin
#  Description: Show seleced content only once for user. When user has clicked link in the content it wont be shown agen.
#  Author: Jaakko Suutarla <jaakko@suutarla.com>
#  License: MIT

# Borrowed from
# 1. Cookie related things https://github.com/carhartl/jquery-cookie
#
# the semi-colon before function invocation is a safety net against concatenated
# scripts and/or other plugins which may not be closed properly.
``
# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
(($, window, document) ->
  # window and document are passed through as local variables rather than globals
  # as this (slightly) quickens the resolution process and can be more efficiently
  # minified (especially when both are regularly referenced in your plugin).

  # Create the defaults once
  pluginName = 'showOnce'
  defaults =
    expires: 65
    cookieKeyPrefix: '_show_once_traking_cookie'
    contentUrl: null,
    callback: null,
    log: false,
    logger: null

  # The actual plugin constructor
  class PluginShowOnce
    constructor: (@element, options) ->
      @options = $.extend {}, defaults, options
      @_defaults = defaults
      @_name = pluginName
      @init()

    init: ->
      if @cookie()
        @contenLoaded()
      else
        @loadContent()

    loadContent: () ->
      $.ajax
        url: @options.contentUrl
        type: 'GET'
        error: (xhr, status, error) =>
          @log "Error while loading content from:", xhr, status, error
          @contenLoaded()
        success: (content) =>
          $(@element).html(content)
          @addTrackingToLinks()
          @contenLoaded()

    addTrackingToLinks: () ->
      for link in $(@element).find('a')
        @bindTrackerToLink(link)

    bindTrackerToLink:(linkElement) ->
      $(linkElement).bind 'click.showOnce', (event) =>
        @cookie(1)
        true

    contenLoaded: () =>
      if @options.callback
        callback_function = @options.callback($(@element))
      $(@element).trigger('plugin_showOnce.contentLoaded')
      @

    cookie: ( value ) ->
      if (arguments.length == 1 && (!/Object/.test(Object.prototype.toString.call(value))))
        value = String(value)

        cookieExpiresAt = new Date()
        cookieExpiresAt.setDate(cookieExpiresAt.getDate() + @options.expires)

        return document.cookie = [
            encodeURIComponent(@cookieKey()), '=', encodeURIComponent(value),
            '; expires=' + cookieExpiresAt.toUTCString(),
            '; path=' + document.location.pathname
          ].join('')

      pairs =  document.cookie.split('; ')
      for pair in pairs
        pair = pair.split('=')
        if decodeURIComponent(pair[0]) == @cookieKey()
          return decodeURIComponent( pair[1] ) || ''

      return null

    cookieKey: ->
      @options.cookieKeyPrefix + if $(@element).attr('id') then '_' + $(@element).attr('id') else ''

    log: (message) ->
      if @options.log && @options.logger
        try
          @options.logger message
        catch error

  # A really lightweight plugin wrapper around the constructor,
  # preventing against multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(this, "plugin_#{pluginName}")
        $.data(@, "plugin_#{pluginName}", new PluginShowOnce(@, options))

)(jQuery, window, document)