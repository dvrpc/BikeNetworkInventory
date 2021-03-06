// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/on dojo/keys dijit/_WidgetBase dijit/_TemplatedMixin jimu/utils".split(" "), function (f, d, b, e, c, g, h, k) {
    return f([g, h], {
        baseClass: "jimu-foldable-dijit",
        width: "100%",
        titleHeight: 20,
        content: null,
        folded: !1,
        templateString: '\x3cdiv\x3e\x3cdiv class\x3d"title" data-dojo-attach-point\x3d"titleNode"\x3e\x3ch2 class\x3d"title-label" data-dojo-attach-point\x3d"titleLabelNode" tabindex\x3d"-1" data-dojo-attach-event\x3d"onkeydown:_onTitleLabelKeyDown"\x3e\x3c/h2\x3e\x3cdiv class\x3d"btns-container" data-dojo-attach-point\x3d"btnsContainer"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"jimu-panel-content" data-dojo-attach-point\x3d"containerNode"\x3e\x3c/div\x3e\x3c/div\x3e',
        postMixInProperties: function () {
            this.headerNls = window.jimuNls.panelHeader
        },
        startup: function () {
            this.inherited(arguments);
            b.setStyle(this.titleNode, {
                width: this.width,
                height: this.titleHeight + "px"
            });
            b.setStyle(this.containerNode, {
                top: this.titleHeight + "px"
            });
            b.setStyle(this.titleLabelNode, {
                lineHeight: this.titleHeight + "px"
            });
            this.label && this.setTitleLabel(this.label);
            this.foldEnable = !0;
            this.own(e(this.titleNode, "click", d.hitch(this, function () {
                this.onFoldableNodeClick()
            })))
        },
        setTitleLabel: function (a) {
            this.label =
                a;
            this.titleLabelNode.innerHTML = k.stripHTML(a);
            this.titleLabelNode.title = a
        },
        _onTitleLabelKeyDown: function (a) {
            a.shiftKey && a.keyCode === c.TAB && a.preventDefault()
        },
        createFoldableBtn: function () {
            this.foldableNode = b.create("div", {
                "class": "foldable-btn",
                role: "button",
                "aria-label": this.headerNls.foldWindow,
                tabindex: 0
            }, this.btnsContainer);
            this.own(e(this.foldableNode, "click", d.hitch(this, function (a) {
                a.stopPropagation();
                this.onFoldableNodeClick()
            })));
            this.own(e(this.foldableNode, "keydown", d.hitch(this, function (a) {
                a.keyCode ===
                    c.ENTER || a.keyCode === c.SPACE ? (a.stopPropagation(), this.onFoldableNodeClick()) : a.keyCode === c.TAB && a.shiftKey && a.preventDefault()
            })))
        },
        onFoldableNodeClick: function () {
            this.foldEnable && (this.folded ? (this.folded = !1, b.removeClass(this.foldableNode, "folded"), b.setAttr(this.foldableNode, "aria-label", this.headerNls.foldWindow)) : (this.folded = !0, b.addClass(this.foldableNode, "folded"), b.setAttr(this.foldableNode, "aria-label", this.headerNls.unfoldWindow)), this.onFoldStateChanged())
        },
        onFoldStateChanged: function () {}
    })
});