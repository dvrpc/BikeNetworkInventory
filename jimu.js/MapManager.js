// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dojo/query dojo/topic dojo/on dojo/aspect dojo/keys dojo/i18n dojo/_base/config esri/dijit/InfoWindow esri/dijit/PopupMobile esri/InfoTemplate esri/request esri/arcgis/utils esri/geometry/Extent esri/geometry/Point esri/layers/FeatureLayer require ./utils jimu/LayerInfos/LayerInfos jimu/dijit/Message jimu/dijit/AppStatePopup ./MapUrlParamsHandler ./AppStateManager ./PopupManager ./FilterManager".split(" "), function (z, e, l,
    k, r, n, m, t, A, B, C, D, E, F, G, H, x, I, J, u, p, K, y, L, M, N, O, P) {
    var v = null,
        w = z(null, {
            appConfig: null,
            mapDivId: "",
            map: null,
            previousInfoWindow: null,
            mobileInfoWindow: null,
            isMobileInfoWindow: !1,
            layerInfosObj: null,
            constructor: function (a, b) {
                this.appConfig = a.appConfig;
                this.urlParams = a.urlParams;
                this.id = this.mapDivId = b;
                this.appStateManager = N.getInstance(this.urlParams);
                this.popupManager = O.getInstance(this);
                this.filterManager = P.getInstance();
                this.nls = window.jimuNls;
                n.subscribe("appConfigChanged", e.hitch(this, this.onAppConfigChanged));
                n.subscribe("syncExtent", e.hitch(this, this.onSyncExtent));
                n.subscribe("mapContentModified", e.hitch(this, this.onMapContentModified));
                m(window, "resize", e.hitch(this, this.onWindowResize));
                m(window, "unload", e.hitch(this, this.onUnload))
            },
            showMap: function () {
                this._showMap(this.appConfig)
            },
            _showMap: function (a) {
                console.time("Load Map");
                a.map["3D"] ? a.map.itemId ? this._show3DWebScene(a) : this._show3DLayersMap(a) : a.map.itemId ? this._show2DWebMap(a) : console.log("No webmap found. Please set map.itemId in config.json.")
            },
            onUnload: function () {
                this.appConfig.keepAppState && this.appStateManager.saveWabAppState(this.map, this.layerInfosObj)
            },
            onWindowResize: function () {
                this.map && this.map.resize && (this.map.resize(), this.resetInfoWindow(!1))
            },
            getMapInfoWindow: function () {
                return {
                    mobile: this._mapMobileInfoWindow,
                    bigScreen: this._mapInfoWindow
                }
            },
            resetInfoWindow: function (a) {
                a && (this._mapInfoWindow = this.map.infoWindow, this._mapMobileInfoWindow && (this._mapMobileInfoWindow.destroy(), r("div.esriMobileInfoView.esriMobilePopupInfoView").forEach(function (b) {
                        k.destroy(b)
                    }),
                    r("div.esriMobileNavigationBar").forEach(function (b) {
                        k.destroy(b)
                    })), this._mapMobileInfoWindow = new E(null, k.create("div", null, null, this.map.root)), this.isMobileInfoWindow = !1);
                p.inMobileSize() && !this.isMobileInfoWindow ? (this.map.infoWindow.hide(), this.map.setInfoWindow(this._mapMobileInfoWindow), this.isMobileInfoWindow = !0) : !p.inMobileSize() && this.isMobileInfoWindow && (this.map.infoWindow.hide(), this.map.setInfoWindow(this._mapInfoWindow), this.isMobileInfoWindow = !1)
                this.map.infoWindow.resize(360,200);
            },
            onSyncExtent: function (a) {
                this.map &&
                    (a = new x(a.extent), this.map.setExtent(a))
            },
            _visitConfigMapLayers: function (a, b) {
                l.forEach(a.map.basemaps, function (c, d) {
                    c.isOperationalLayer = !1;
                    b(c, d)
                }, this);
                l.forEach(a.map.operationallayers, function (c, d) {
                    c.isOperationalLayer = !0;
                    b(c, d)
                }, this)
            },
            _show3DLayersMap: function (a) {
                u(["esri3d/Map"], e.hitch(this, function (b) {
                    var c = new b(this.mapDivId, {
                        camera: a.map.mapOptions.camera
                    });
                    this._visitConfigMapLayers(a, e.hitch(this, function (d) {
                        this.createLayer(c, "3D", d)
                    }));
                    c.usePlugin = b.usePlugin;
                    this._publishMapEvent(c)
                }))
            },
            _show3DWebScene: function (a) {
                this._getWebsceneData(a.map.itemId).then(e.hitch(this, function (b) {
                    u(["esri3d/Map"], e.hitch(this, function (c) {
                        var d = new c(this.mapDivId, a.map.mapOptions);
                        l.forEach(b.itemData.operationalLayers, function (f) {
                            this.createLayer(d, "3D", f)
                        }, this);
                        l.forEach(b.itemData.baseMap.baseMapLayers, function (f) {
                            f.type = "tile";
                            this.createLayer(d, "3D", f)
                        }, this);
                        l.forEach(b.itemData.baseMap.elevationLayers, function (f) {
                            f.type = "elevation";
                            this.createLayer(d, "3D", f)
                        }, this);
                        d.toc = b.itemData.toc;
                        d.bookmarks =
                            b.itemData.bookmarks;
                        d.tours = b.itemData.tours
                    }))
                }))
            },
            _publishMapEvent: function (a) {
                window._viewerMap = a;
                M.postProcessUrlParams(this.urlParams, a);
                console.timeEnd("Load Map");
                this.map ? (this.map = a, this.resetInfoWindow(!0), console.log("map changed."), n.publish("mapChanged", this.map, this.layerInfosObj)) : (this.map = a, this.resetInfoWindow(!0), n.publish("mapLoaded", this.map, this.layerInfosObj))
            },
            _getWebsceneData: function (a) {
                return G({
                    url: "http://184.169.133.166/sharing/rest/content/items/" + a + "/data",
                    handleAs: "json"
                })
            },
            _show2DWebMap: function (a) {
                this._increasePointCount(a);
                a.map.mapOptions || (a.map.mapOptions = {});
                var b = this._processMapOptions(a.map.mapOptions) || {};
                b.slider = !1;
                var c = a.map.portalUrl,
                    d = a.map.itemId;
                b = {
                    mapOptions: b,
                    bingMapsKey: a.bingMapsKey,
                    usePopupManager: !0
                };
                if (!window.isBuilder && !a.mode && a.map.appProxy && a.map.appProxy.mapItemId === a.map.itemId) {
                    var f = [];
                    l.forEach(a.map.appProxy.proxyItems, function (g) {
                        g.useProxy && g.proxyUrl && f.push({
                            url: g.sourceUrl,
                            mixin: {
                                url: g.proxyUrl
                            }
                        })
                    });
                    0 < f.length && (b.layerMixins =
                        f)
                }
                this._createWebMapRaw(c, d, this.mapDivId, b).then(e.hitch(this, function (g) {
                    var h = g.map;
                    h.hideZoomSlider();
                    h.infoWindow.resize(270, 316);
                    h.itemId = a.map.itemId;
                    h.itemInfo = g.itemInfo;
                    h.webMapResponse = g;
                    h.enableSnapping({
                        snapKey: A.copyKey
                    });
                    k.setStyle(h.root, "zIndex", 0);
                    h._initialExtent = h.extent;
                    this.layerInfosObj = K.getInstanceSyncForInit(h, h.itemInfo);
                    this.layerInfosObj.getLayerInfoArrayOfWebmap().forEach(function (Q) {
                        Q.getLayerObject().then(e.hitch(this, function (q) {
                            q && e.setObject("_wabProperties.originalRefreshinterval",
                                q.refreshInterval, q)
                        }), e.hitch(this, function (q) {
                            console.error("can't get layerObject", q)
                        }))
                    }, this);
                    a.map.mapRefreshInterval && !a.map.mapRefreshInterval.useWebMapRefreshInterval && this._updateRefreshInterval(a.map.mapRefreshInterval);
                    this._showUnreachableLayersTitleMessage();
                    this._publishMapEvent(h);
                    setTimeout(e.hitch(this, this._checkAppState), 500);
                    this._addDataLoadingOnMapUpdate(h);
                    this._hideError()
                }), e.hitch(this, function (g) {
                    console.error(g);
                    this._showError(g);
                    n.publish("mapCreatedFailed")
                }))
            },
            _increasePointCount: function (a) {
                if ("1" !==
                    window.queryObject.disableLargePointCountForTimeSlider && "true" !== window.queryObject.disableLargePointCountForTimeSlider) {
                    var b = !1;
                    p.visitElement(a, function (c) {
                        "widgets/TimeSlider/Widget" === c.uri && (b = !0)
                    });
                    b && (J.prototype.maxPointCountForAuto = 35E3)
                }
            },
            _handleRefreshLayer: function (a) {
                var b = a._mode._drawFeatures,
                    c = a._mode._clearIIf,
                    d = null;
                a._mode._drawFeatures = function (f, g) {
                    g && "number" === typeof g.row && "number" === typeof g.col && a._mode._removeCell(g.row, g.col);
                    b.apply(a._mode, arguments)
                };
                t.before(a, "refresh",
                    function () {
                        d = a._mode._cellMap;
                        a._mode._clearIIf = function () {}
                    });
                t.after(a, "refresh", function () {
                    a._mode._cellMap = d;
                    a._mode._clearIIf = c
                });
                m(a, "update-start", function () {
                    a.isUpdating = !0
                });
                m(a, "update-end", function () {
                    a.isUpdating = !1
                })
            },
            _showError: function (a) {
                a && a.message && k.create("div", {
                    "class": "app-error load-map-error",
                    innerHTML: a.message
                }, document.body)
            },
            _hideError: function () {
                r("div.load-map-error", document.body).forEach(function (a) {
                    document.body.removeChild(a)
                })
            },
            _createWebMapRaw: function (a, b, c, d) {
                return p.createWebMap(a,
                    b, c, d).then(e.hitch(this, function (f) {
                    return f
                }), e.hitch(this, function (f) {
                    console.error(f);
                    if (f && f instanceof Error && f.message) {
                        var g = e.getObject("arcgis.utils.baseLayerError", !1, B.cache["esri/nls/jsapi/" + C.locale]);
                        if (g && 0 <= f.message.indexOf(g)) return new y({
                            message: window.jimuNls.map.basemapNotAvailable + window.jimuNls.map.displayDefaultBasemap
                        }), H.getItem(b).then(e.hitch(this, function (h) {
                            h.itemData.spatialReference = {
                                wkid: 102100,
                                latestWkid: 3857
                            };
                            h.itemData.baseMap = {
                                baseMapLayers: [{
                                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
                                    opacity: 1,
                                    layerType: "ArcGISTiledMapServiceLayer",
                                    visibility: !0,
                                    id: "defaultBasemap_0"
                                }],
                                title: "Topographic"
                            };
                            return p.createWebMap(a, h, c, d)
                        }))
                    }
                    throw f;
                }))
            },
            _showUnreachableLayersTitleMessage: function () {
                var a = this.layerInfosObj.getUnreachableLayersTitle(),
                    b = "",
                    c = window.jimuNls.map.layerLoadedError || "The layer, ${layers} cannot be added to the map.";
                c && a && 0 < a.length && (l.forEach(a, e.hitch(this, function (d) {
                    b = b + d + ", "
                })), new y({
                    message: c.replace("${layers}", b)
                }))
            },
            _addDataLoadingOnMapUpdate: function (a) {
                var b =
                    k.toDom('\x3cdiv class\x3d"map-loading"\x3eLoading...\x3c/div\x3e');
                k.place(b, a.root);
                a.updating && k.addClass(b, "loading");
                m(a, "update-start", e.hitch(this, function () {
                    k.addClass(b, "loading")
                }));
                m(a, "update-end", e.hitch(this, function () {
                    k.removeClass(b, "loading")
                }));
                m(a, "unload", e.hitch(this, function () {
                    k.destroy(b);
                    b = null
                }))
            },
            _checkAppState: function () {
                var a = "extent center marker find query scale level".split(" "),
                    b = this.appConfig.keepAppState;
                b && l.forEach(a, function (c) {
                    c in this.urlParams && (b = !1)
                }, this);
                b && this.appStateManager.getWabAppState().then(e.hitch(this, function (c) {
                    if (c.extent || c.layers) {
                        var d = new L({
                            nls: {
                                title: this.nls.appState.title,
                                restoreMap: this.nls.appState.restoreMap
                            }
                        });
                        d.placeAt("main-page");
                        m(d, "applyAppState", e.hitch(this, function () {
                            this._applyAppState(c, this.map)
                        }));
                        d.startup();
                        d.show()
                    }
                }))
            },
            _applyAppState: function (a, b) {
                this.layerInfosObj.restoreState({
                    layerOptions: a.layers || null
                });
                a.extent && b.setExtent(a.extent)
            },
            _processMapOptions: function (a) {
                if (a) return a.lods || delete a.lods,
                    a.lods && 0 === a.lods.length && delete a.lods, a = e.clone(a), a.extent && (a.extent = new x(a.extent)), a.center && !e.isArrayLike(a.center) && (a.center = new I(a.center)), a.infoWindow && (a.infoWindow = new D(a.infoWindow, k.create("div", {}, this.mapDivId))), a
            },
            createLayer: function (a, b, c) {
                u([{
                    "2D_tiled": "esri/layers/ArcGISTiledMapServiceLayer",
                    "2D_dynamic": "esri/layers/ArcGISDynamicMapServiceLayer",
                    "2D_image": "esri/layers/ArcGISImageServiceLayer",
                    "2D_feature": "esri/layers/FeatureLayer",
                    "2D_rss": "esri/layers/GeoRSSLayer",
                    "2D_kml": "esri/layers/KMLLayer",
                    "2D_webTiled": "esri/layers/WebTiledLayer",
                    "2D_wms": "esri/layers/WMSLayer",
                    "2D_wmts": "esri/layers/WMTSLayer",
                    "3D_tiled": "esri3d/layers/ArcGISTiledMapServiceLayer",
                    "3D_dynamic": "esri3d/layers/ArcGISDynamicMapServiceLayer",
                    "3D_image": "esri3d/layers/ArcGISImageServiceLayer",
                    "3D_feature": "esri3d/layers/FeatureLayer",
                    "3D_elevation": "esri3d/layers/ArcGISElevationServiceLayer",
                    "3D_3dmodle": "esri3d/layers/SceneLayer"
                } [b + "_" + c.type]], e.hitch(this, function (d) {
                    var f = {};
                    var g = "label url type icon infoTemplate isOperationalLayer".split(" ");
                    for (var h in c) 0 > g.indexOf(h) && (f[h] = c[h]);
                    c.infoTemplate ? (g = new F(c.infoTemplate.title, c.infoTemplate.content), f.infoTemplate = g, d = new d(c.url, f), c.infoTemplate.width && c.infoTemplate.height && t.after(d, "onClick", e.hitch(this, function () {
                        a.infoWindow.resize(c.infoTemplate.width, c.infoTemplate.height)
                    }), !0)) : d = new d(c.url, f);
                    d.isOperationalLayer = c.isOperationalLayer;
                    d.label = c.label;
                    d.icon = c.icon;
                    a.addLayer(d)
                }))
            },
            onAppConfigChanged: function (a, b, c) {
                this.appConfig = a;
                "mapChange" === b ? this._recreateMap(a) :
                    "mapOptionsChange" === b ? c.lods && this._recreateMap(a) : "mapRefreshIntervalChange" === b && this.map && this.map.itemInfo.itemData && this.layerInfosObj && this._updateRefreshInterval(c)
            },
            onMapContentModified: function () {
                this._recreateMap(this.appConfig)
            },
            _updateRefreshInterval: function (a) {
                var b = -1;
                b = a.useWebMapRefreshInterval ? -1 : a.minutes;
                this.layerInfosObj.getLayerInfoArrayOfWebmap().forEach(function (c) {
                    c.getLayerObject().then(e.hitch(this, function (d) {
                        if (d) {
                            var f = e.getObject("_wabProperties.originalRefreshinterval",
                                !1, d);
                            0 < f && "function" === typeof d.setRefreshInterval && (0 > b ? d.setRefreshInterval(f) : d.setRefreshInterval(b))
                        }
                    }), e.hitch(this, function (d) {
                        console.error("can't get layerObject", d)
                    }))
                }, this)
            },
            _recreateMap: function (a) {
                this.map && (n.publish("beforeMapDestory", this.map), this.map.destroy());
                this._showMap(a)
            },
            disableWebMapPopup: function () {
                this.map.setInfoWindowOnClick(!1)
            },
            enableWebMapPopup: function () {
                this.map.setInfoWindowOnClick(!0)
            }
        });
    w.getInstance = function (a, b) {
        null === v && (v = new w(a, b));
        return v
    };
    return w
});