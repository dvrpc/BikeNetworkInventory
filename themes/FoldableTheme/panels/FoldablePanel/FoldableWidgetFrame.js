// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define(["dojo/_base/declare", "jimu/BaseWidgetFrame", "./FoldableDijit"], function (a, b, c) {
    return a([b, c], {
        baseClass: "jimu-widget-frame jimu-foldable-dijit foldable-widget-frame",
        postCreate: function () {
            this.inherited(arguments);
            this.createFoldableBtn();
            this.titleHeight = 30;
            this.foldEnable = !0
        },
        startup: function () {
            this.inherited(arguments);
            this.setTitleLabel(this.label)
        },
        setWidget: function () {
            this.inherited(arguments);
            this.setTitleLabel(this.widget.label)
        },
        onFoldableNodeClick: function () {
            this.inherited(arguments);
            this.widget && (this.folded ? this.widgetManager.minimizeWidget(this.widget) : this.widgetManager.maximizeWidget(this.widget))
        }
    })
});