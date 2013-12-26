var BABB = global.BABB

exports.ViewExtends = BABB.PlatformsConfig.defaultViewName

var BasePlatformView = BABB.platformsViewsRequire(exports.ViewExtends).PlatformView

exports.PlatformView = BasePlatformView.extend({
})
