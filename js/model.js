var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

 var RomView = Backbone.View.extend({
    el : $('#content'),
    initialize : function() {
        this.template = _.template($('#rom-template').html());
    },

    render : function() {
        var renderedContent = this.template(this.model.toJSON());
        $(this.el).html(renderedContent);
        return this;
    }
});

var Rom = Backbone.Model.extend({
  defaults: {
    id : "???",
    title : "Rom title",
    path : "/default/path"    
  },
  
  initialize: function Rom(){
    console.log('Rom constructor');
  }
});

var RomsCollection = Backbone.Collection.extend({
  model: Rom,
  initialize: function(){
    console.log('RomsCollection constructor');
  }
});

exports.Rom = Rom;
exports.RomsCollection = RomsCollection;
exports.RomView = RomView;