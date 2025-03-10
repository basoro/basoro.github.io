! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports, require("jquery"), require("popper.js")) : "function" == typeof define && define.amd ? define(["exports", "jquery", "popper.js"], t) : t((e = e || self).bootstrap = {}, e.jQuery, e.Popper)
}(this, function(e, p, d) {
    "use strict";

    function o(e, t) {
        for (var i = 0; i < t.length; i++) {
            var o = t[i];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }

    function s(e, t, i) {
        return t && o(e.prototype, t), i && o(e, i), e
    }

    function l(n) {
        for (var e = 1; e < arguments.length; e++) {
            var a = null != arguments[e] ? arguments[e] : {},
                t = Object.keys(a);
            "function" == typeof Object.getOwnPropertySymbols && (t = t.concat(Object.getOwnPropertySymbols(a).filter(function(e) {
                return Object.getOwnPropertyDescriptor(a, e).enumerable
            }))), t.forEach(function(e) {
                var t, i, o;
                t = n, o = a[i = e], i in t ? Object.defineProperty(t, i, {
                    value: o,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : t[i] = o
            })
        }
        return n
    }
    p = p && p.hasOwnProperty("default") ? p.default : p, d = d && d.hasOwnProperty("default") ? d.default : d;
    var t = "transitionend";

    function i(e) {
        var t = this,
            i = !1;
        return p(this).one(f.TRANSITION_END, function() {
            i = !0
        }), setTimeout(function() {
            i || f.triggerTransitionEnd(t)
        }, e), this
    }
    var f = {
        TRANSITION_END: "bsTransitionEnd",
        getUID: function(e) {
            for (; e += ~~(1e6 * Math.random()), document.getElementById(e););
            return e
        },
        getSelectorFromElement: function(e) {
            var t = e.getAttribute("data-target");
            if (!t || "#" === t) {
                var i = e.getAttribute("href");
                t = i && "#" !== i ? i.trim() : ""
            }
            try {
                return document.querySelector(t) ? t : null
            } catch (e) {
                return null
            }
        },
        getTransitionDurationFromElement: function(e) {
            if (!e) return 0;
            var t = p(e).css("transition-duration"),
                i = p(e).css("transition-delay"),
                o = parseFloat(t),
                n = parseFloat(i);
            return o || n ? (t = t.split(",")[0], i = i.split(",")[0], 1e3 * (parseFloat(t) + parseFloat(i))) : 0
        },
        reflow: function(e) {
            return e.offsetHeight
        },
        triggerTransitionEnd: function(e) {
            p(e).trigger(t)
        },
        supportsTransitionEnd: function() {
            return Boolean(t)
        },
        isElement: function(e) {
            return (e[0] || e).nodeType
        },
        typeCheckConfig: function(e, t, i) {
            for (var o in i)
                if (Object.prototype.hasOwnProperty.call(i, o)) {
                    var n = i[o],
                        a = t[o],
                        s = a && f.isElement(a) ? "element" : (r = a, {}.toString.call(r).match(/\s([a-z]+)/i)[1].toLowerCase());
                    if (!new RegExp(n).test(s)) throw new Error(e.toUpperCase() + ': Option "' + o + '" provided type "' + s + '" but expected type "' + n + '".')
                }
            var r
        },
        findShadowRoot: function(e) {
            if (!document.documentElement.attachShadow) return null;
            if ("function" == typeof e.getRootNode) {
                var t = e.getRootNode();
                return t instanceof ShadowRoot ? t : null
            }
            return e instanceof ShadowRoot ? e : e.parentNode ? f.findShadowRoot(e.parentNode) : null
        }
    };
    p.fn.emulateTransitionEnd = i, p.event.special[f.TRANSITION_END] = {
        bindType: t,
        delegateType: t,
        handle: function(e) {
            if (p(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
        }
    };
    var n = "alert",
        a = "bs.alert",
        r = "." + a,
        c = p.fn[n],
        m = {
            CLOSE: "close" + r,
            CLOSED: "closed" + r,
            CLICK_DATA_API: "click" + r + ".data-api"
        },
        u = "alert",
        h = "fade",
        g = "show",
        v = function() {
            function o(e) {
                this._element = e
            }
            var e = o.prototype;
            return e.close = function(e) {
                var t = this._element;
                e && (t = this._getRootElement(e)), this._triggerCloseEvent(t).isDefaultPrevented() || this._removeElement(t)
            }, e.dispose = function() {
                p.removeData(this._element, a), this._element = null
            }, e._getRootElement = function(e) {
                var t = f.getSelectorFromElement(e),
                    i = !1;
                return t && (i = document.querySelector(t)), i || (i = p(e).closest("." + u)[0]), i
            }, e._triggerCloseEvent = function(e) {
                var t = p.Event(m.CLOSE);
                return p(e).trigger(t), t
            }, e._removeElement = function(t) {
                var i = this;
                if (p(t).removeClass(g), p(t).hasClass(h)) {
                    var e = f.getTransitionDurationFromElement(t);
                    p(t).one(f.TRANSITION_END, function(e) {
                        return i._destroyElement(t, e)
                    }).emulateTransitionEnd(e)
                } else this._destroyElement(t)
            }, e._destroyElement = function(e) {
                p(e).detach().trigger(m.CLOSED).remove()
            }, o._jQueryInterface = function(i) {
                return this.each(function() {
                    var e = p(this),
                        t = e.data(a);
                    t || (t = new o(this), e.data(a, t)), "close" === i && t[i](this)
                })
            }, o._handleDismiss = function(t) {
                return function(e) {
                    e && e.preventDefault(), t.close(this)
                }
            }, s(o, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }]), o
        }();
    p(document).on(m.CLICK_DATA_API, '[data-dismiss="alert"]', v._handleDismiss(new v)), p.fn[n] = v._jQueryInterface, p.fn[n].Constructor = v, p.fn[n].noConflict = function() {
        return p.fn[n] = c, v._jQueryInterface
    };
    var y = "button",
        w = "bs.button",
        b = "." + w,
        _ = ".data-api",
        k = p.fn[y],
        C = "active",
        x = "btn",
        S = "focus",
        T = '[data-toggle^="button"]',
        E = '[data-toggle="buttons"]',
        A = 'input:not([type="hidden"])',
        $ = ".active",
        I = ".btn",
        D = {
            CLICK_DATA_API: "click" + b + _,
            FOCUS_BLUR_DATA_API: "focus" + b + _ + " blur" + b + _
        },
        O = function() {
            function i(e) {
                this._element = e
            }
            var e = i.prototype;
            return e.toggle = function() {
                var e = !0,
                    t = !0,
                    i = p(this._element).closest(E)[0];
                if (i) {
                    var o = this._element.querySelector(A);
                    if (o) {
                        if ("radio" === o.type)
                            if (o.checked && this._element.classList.contains(C)) e = !1;
                            else {
                                var n = i.querySelector($);
                                n && p(n).removeClass(C)
                            }
                        if (e) {
                            if (o.hasAttribute("disabled") || i.hasAttribute("disabled") || o.classList.contains("disabled") || i.classList.contains("disabled")) return;
                            o.checked = !this._element.classList.contains(C), p(o).trigger("change")
                        }
                        o.focus(), t = !1
                    }
                }
                t && this._element.setAttribute("aria-pressed", !this._element.classList.contains(C)), e && p(this._element).toggleClass(C)
            }, e.dispose = function() {
                p.removeData(this._element, w), this._element = null
            }, i._jQueryInterface = function(t) {
                return this.each(function() {
                    var e = p(this).data(w);
                    e || (e = new i(this), p(this).data(w, e)), "toggle" === t && e[t]()
                })
            }, s(i, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }]), i
        }();
    p(document).on(D.CLICK_DATA_API, T, function(e) {
        e.preventDefault();
        var t = e.target;
        p(t).hasClass(x) || (t = p(t).closest(I)), O._jQueryInterface.call(p(t), "toggle")
    }).on(D.FOCUS_BLUR_DATA_API, T, function(e) {
        var t = p(e.target).closest(I)[0];
        p(t).toggleClass(S, /^focus(in)?$/.test(e.type))
    }), p.fn[y] = O._jQueryInterface, p.fn[y].Constructor = O, p.fn[y].noConflict = function() {
        return p.fn[y] = k, O._jQueryInterface
    };
    var z = "carousel",
        j = "bs.carousel",
        P = "." + j,
        L = ".data-api",
        M = p.fn[z],
        N = {
            interval: 5e3,
            keyboard: !0,
            slide: !1,
            pause: "hover",
            wrap: !0,
            touch: !0
        },
        H = {
            interval: "(number|boolean)",
            keyboard: "boolean",
            slide: "(boolean|string)",
            pause: "(string|boolean)",
            wrap: "boolean",
            touch: "boolean"
        },
        B = "next",
        q = "prev",
        R = "left",
        W = "right",
        U = {
            SLIDE: "slide" + P,
            SLID: "slid" + P,
            KEYDOWN: "keydown" + P,
            MOUSEENTER: "mouseenter" + P,
            MOUSELEAVE: "mouseleave" + P,
            TOUCHSTART: "touchstart" + P,
            TOUCHMOVE: "touchmove" + P,
            TOUCHEND: "touchend" + P,
            POINTERDOWN: "pointerdown" + P,
            POINTERUP: "pointerup" + P,
            DRAG_START: "dragstart" + P,
            LOAD_DATA_API: "load" + P + L,
            CLICK_DATA_API: "click" + P + L
        },
        F = "carousel",
        Y = "active",
        X = "slide",
        V = "carousel-item-right",
        K = "carousel-item-left",
        Q = "carousel-item-next",
        G = "carousel-item-prev",
        Z = "pointer-event",
        J = {
            ACTIVE: ".active",
            ACTIVE_ITEM: ".active.carousel-item",
            ITEM: ".carousel-item",
            ITEM_IMG: ".carousel-item img",
            NEXT_PREV: ".carousel-item-next, .carousel-item-prev",
            INDICATORS: ".carousel-indicators",
            DATA_SLIDE: "[data-slide], [data-slide-to]",
            DATA_RIDE: '[data-ride="carousel"]'
        },
        ee = {
            TOUCH: "touch",
            PEN: "pen"
        },
        te = function() {
            function a(e, t) {
                this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(t), this._element = e, this._indicatorsElement = this._element.querySelector(J.INDICATORS), this._touchSupported = "ontouchstart" in document.documentElement || 0 < navigator.maxTouchPoints, this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent), this._addEventListeners()
            }
            var e = a.prototype;
            return e.next = function() {
                this._isSliding || this._slide(B)
            }, e.nextWhenVisible = function() {
                !document.hidden && p(this._element).is(":visible") && "hidden" !== p(this._element).css("visibility") && this.next()
            }, e.prev = function() {
                this._isSliding || this._slide(q)
            }, e.pause = function(e) {
                e || (this._isPaused = !0), this._element.querySelector(J.NEXT_PREV) && (f.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
            }, e.cycle = function(e) {
                e || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
            }, e.to = function(e) {
                var t = this;
                this._activeElement = this._element.querySelector(J.ACTIVE_ITEM);
                var i = this._getItemIndex(this._activeElement);
                if (!(e > this._items.length - 1 || e < 0))
                    if (this._isSliding) p(this._element).one(U.SLID, function() {
                        return t.to(e)
                    });
                    else {
                        if (i === e) return this.pause(), void this.cycle();
                        var o = i < e ? B : q;
                        this._slide(o, this._items[e])
                    }
            }, e.dispose = function() {
                p(this._element).off(P), p.removeData(this._element, j), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null
            }, e._getConfig = function(e) {
                return e = l({}, N, e), f.typeCheckConfig(z, e, H), e
            }, e._handleSwipe = function() {
                var e = Math.abs(this.touchDeltaX);
                if (!(e <= 40)) {
                    var t = e / this.touchDeltaX;
                    0 < t && this.prev(), t < 0 && this.next()
                }
            }, e._addEventListeners = function() {
                var t = this;
                this._config.keyboard && p(this._element).on(U.KEYDOWN, function(e) {
                    return t._keydown(e)
                }), "hover" === this._config.pause && p(this._element).on(U.MOUSEENTER, function(e) {
                    return t.pause(e)
                }).on(U.MOUSELEAVE, function(e) {
                    return t.cycle(e)
                }), this._config.touch && this._addTouchEventListeners()
            }, e._addTouchEventListeners = function() {
                var i = this;
                if (this._touchSupported) {
                    var t = function(e) {
                            i._pointerEvent && ee[e.originalEvent.pointerType.toUpperCase()] ? i.touchStartX = e.originalEvent.clientX : i._pointerEvent || (i.touchStartX = e.originalEvent.touches[0].clientX)
                        },
                        o = function(e) {
                            i._pointerEvent && ee[e.originalEvent.pointerType.toUpperCase()] && (i.touchDeltaX = e.originalEvent.clientX - i.touchStartX), i._handleSwipe(), "hover" === i._config.pause && (i.pause(), i.touchTimeout && clearTimeout(i.touchTimeout), i.touchTimeout = setTimeout(function(e) {
                                return i.cycle(e)
                            }, 500 + i._config.interval))
                        };
                    p(this._element.querySelectorAll(J.ITEM_IMG)).on(U.DRAG_START, function(e) {
                        return e.preventDefault()
                    }), this._pointerEvent ? (p(this._element).on(U.POINTERDOWN, function(e) {
                        return t(e)
                    }), p(this._element).on(U.POINTERUP, function(e) {
                        return o(e)
                    }), this._element.classList.add(Z)) : (p(this._element).on(U.TOUCHSTART, function(e) {
                        return t(e)
                    }), p(this._element).on(U.TOUCHMOVE, function(e) {
                        var t;
                        (t = e).originalEvent.touches && 1 < t.originalEvent.touches.length ? i.touchDeltaX = 0 : i.touchDeltaX = t.originalEvent.touches[0].clientX - i.touchStartX
                    }), p(this._element).on(U.TOUCHEND, function(e) {
                        return o(e)
                    }))
                }
            }, e._keydown = function(e) {
                if (!/input|textarea/i.test(e.target.tagName)) switch (e.which) {
                    case 37:
                        e.preventDefault(), this.prev();
                        break;
                    case 39:
                        e.preventDefault(), this.next()
                }
            }, e._getItemIndex = function(e) {
                return this._items = e && e.parentNode ? [].slice.call(e.parentNode.querySelectorAll(J.ITEM)) : [], this._items.indexOf(e)
            }, e._getItemByDirection = function(e, t) {
                var i = e === B,
                    o = e === q,
                    n = this._getItemIndex(t),
                    a = this._items.length - 1;
                if ((o && 0 === n || i && n === a) && !this._config.wrap) return t;
                var s = (n + (e === q ? -1 : 1)) % this._items.length;
                return -1 === s ? this._items[this._items.length - 1] : this._items[s]
            }, e._triggerSlideEvent = function(e, t) {
                var i = this._getItemIndex(e),
                    o = this._getItemIndex(this._element.querySelector(J.ACTIVE_ITEM)),
                    n = p.Event(U.SLIDE, {
                        relatedTarget: e,
                        direction: t,
                        from: o,
                        to: i
                    });
                return p(this._element).trigger(n), n
            }, e._setActiveIndicatorElement = function(e) {
                if (this._indicatorsElement) {
                    var t = [].slice.call(this._indicatorsElement.querySelectorAll(J.ACTIVE));
                    p(t).removeClass(Y);
                    var i = this._indicatorsElement.children[this._getItemIndex(e)];
                    i && p(i).addClass(Y)
                }
            }, e._slide = function(e, t) {
                var i, o, n, a = this,
                    s = this._element.querySelector(J.ACTIVE_ITEM),
                    r = this._getItemIndex(s),
                    l = t || s && this._getItemByDirection(e, s),
                    c = this._getItemIndex(l),
                    m = Boolean(this._interval);
                if (e === B ? (i = K, o = Q, n = R) : (i = V, o = G, n = W), l && p(l).hasClass(Y)) this._isSliding = !1;
                else if (!this._triggerSlideEvent(l, n).isDefaultPrevented() && s && l) {
                    this._isSliding = !0, m && this.pause(), this._setActiveIndicatorElement(l);
                    var d = p.Event(U.SLID, {
                        relatedTarget: l,
                        direction: n,
                        from: r,
                        to: c
                    });
                    if (p(this._element).hasClass(X)) {
                        p(l).addClass(o), f.reflow(l), p(s).addClass(i), p(l).addClass(i);
                        var u = parseInt(l.getAttribute("data-interval"), 10);
                        u ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = u) : this._config.interval = this._config.defaultInterval || this._config.interval;
                        var h = f.getTransitionDurationFromElement(s);
                        p(s).one(f.TRANSITION_END, function() {
                            p(l).removeClass(i + " " + o).addClass(Y), p(s).removeClass(Y + " " + o + " " + i), a._isSliding = !1, setTimeout(function() {
                                return p(a._element).trigger(d)
                            }, 0)
                        }).emulateTransitionEnd(h)
                    } else p(s).removeClass(Y), p(l).addClass(Y), this._isSliding = !1, p(this._element).trigger(d);
                    m && this.cycle()
                }
            }, a._jQueryInterface = function(o) {
                return this.each(function() {
                    var e = p(this).data(j),
                        t = l({}, N, p(this).data());
                    "object" == typeof o && (t = l({}, t, o));
                    var i = "string" == typeof o ? o : t.slide;
                    if (e || (e = new a(this, t), p(this).data(j, e)), "number" == typeof o) e.to(o);
                    else if ("string" == typeof i) {
                        if (void 0 === e[i]) throw new TypeError('No method named "' + i + '"');
                        e[i]()
                    } else t.interval && t.ride && (e.pause(), e.cycle())
                })
            }, a._dataApiClickHandler = function(e) {
                var t = f.getSelectorFromElement(this);
                if (t) {
                    var i = p(t)[0];
                    if (i && p(i).hasClass(F)) {
                        var o = l({}, p(i).data(), p(this).data()),
                            n = this.getAttribute("data-slide-to");
                        n && (o.interval = !1), a._jQueryInterface.call(p(i), o), n && p(i).data(j).to(n), e.preventDefault()
                    }
                }
            }, s(a, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "Default",
                get: function() {
                    return N
                }
            }]), a
        }();
    p(document).on(U.CLICK_DATA_API, J.DATA_SLIDE, te._dataApiClickHandler), p(window).on(U.LOAD_DATA_API, function() {
        for (var e = [].slice.call(document.querySelectorAll(J.DATA_RIDE)), t = 0, i = e.length; t < i; t++) {
            var o = p(e[t]);
            te._jQueryInterface.call(o, o.data())
        }
    }), p.fn[z] = te._jQueryInterface, p.fn[z].Constructor = te, p.fn[z].noConflict = function() {
        return p.fn[z] = M, te._jQueryInterface
    };
    var ie = "collapse",
        oe = "bs.collapse",
        ne = "." + oe,
        ae = p.fn[ie],
        se = {
            toggle: !0,
            parent: ""
        },
        re = {
            toggle: "boolean",
            parent: "(string|element)"
        },
        le = {
            SHOW: "show" + ne,
            SHOWN: "shown" + ne,
            HIDE: "hide" + ne,
            HIDDEN: "hidden" + ne,
            CLICK_DATA_API: "click" + ne + ".data-api"
        },
        ce = "show",
        me = "collapse",
        de = "collapsing",
        ue = "collapsed",
        he = "width",
        pe = "height",
        fe = {
            ACTIVES: ".show, .collapsing",
            DATA_TOGGLE: '[data-toggle="collapse"]'
        },
        ge = function() {
            function r(t, e) {
                this._isTransitioning = !1, this._element = t, this._config = this._getConfig(e), this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'));
                for (var i = [].slice.call(document.querySelectorAll(fe.DATA_TOGGLE)), o = 0, n = i.length; o < n; o++) {
                    var a = i[o],
                        s = f.getSelectorFromElement(a),
                        r = [].slice.call(document.querySelectorAll(s)).filter(function(e) {
                            return e === t
                        });
                    null !== s && 0 < r.length && (this._selector = s, this._triggerArray.push(a))
                }
                this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle()
            }
            var e = r.prototype;
            return e.toggle = function() {
                p(this._element).hasClass(ce) ? this.hide() : this.show()
            }, e.show = function() {
                var e, t, i = this;
                if (!this._isTransitioning && !p(this._element).hasClass(ce) && (this._parent && 0 === (e = [].slice.call(this._parent.querySelectorAll(fe.ACTIVES)).filter(function(e) {
                        return "string" == typeof i._config.parent ? e.getAttribute("data-parent") === i._config.parent : e.classList.contains(me)
                    })).length && (e = null), !(e && (t = p(e).not(this._selector).data(oe)) && t._isTransitioning))) {
                    var o = p.Event(le.SHOW);
                    if (p(this._element).trigger(o), !o.isDefaultPrevented()) {
                        e && (r._jQueryInterface.call(p(e).not(this._selector), "hide"), t || p(e).data(oe, null));
                        var n = this._getDimension();
                        p(this._element).removeClass(me).addClass(de), this._element.style[n] = 0, this._triggerArray.length && p(this._triggerArray).removeClass(ue).attr("aria-expanded", !0), this.setTransitioning(!0);
                        var a = "scroll" + (n[0].toUpperCase() + n.slice(1)),
                            s = f.getTransitionDurationFromElement(this._element);
                        p(this._element).one(f.TRANSITION_END, function() {
                            p(i._element).removeClass(de).addClass(me).addClass(ce), i._element.style[n] = "", i.setTransitioning(!1), p(i._element).trigger(le.SHOWN)
                        }).emulateTransitionEnd(s), this._element.style[n] = this._element[a] + "px"
                    }
                }
            }, e.hide = function() {
                var e = this;
                if (!this._isTransitioning && p(this._element).hasClass(ce)) {
                    var t = p.Event(le.HIDE);
                    if (p(this._element).trigger(t), !t.isDefaultPrevented()) {
                        var i = this._getDimension();
                        this._element.style[i] = this._element.getBoundingClientRect()[i] + "px", f.reflow(this._element), p(this._element).addClass(de).removeClass(me).removeClass(ce);
                        var o = this._triggerArray.length;
                        if (0 < o)
                            for (var n = 0; n < o; n++) {
                                var a = this._triggerArray[n],
                                    s = f.getSelectorFromElement(a);
                                if (null !== s) p([].slice.call(document.querySelectorAll(s))).hasClass(ce) || p(a).addClass(ue).attr("aria-expanded", !1)
                            }
                        this.setTransitioning(!0);
                        this._element.style[i] = "";
                        var r = f.getTransitionDurationFromElement(this._element);
                        p(this._element).one(f.TRANSITION_END, function() {
                            e.setTransitioning(!1), p(e._element).removeClass(de).addClass(me).trigger(le.HIDDEN)
                        }).emulateTransitionEnd(r)
                    }
                }
            }, e.setTransitioning = function(e) {
                this._isTransitioning = e
            }, e.dispose = function() {
                p.removeData(this._element, oe), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null
            }, e._getConfig = function(e) {
                return (e = l({}, se, e)).toggle = Boolean(e.toggle), f.typeCheckConfig(ie, e, re), e
            }, e._getDimension = function() {
                return p(this._element).hasClass(he) ? he : pe
            }, e._getParent = function() {
                var e, i = this;
                f.isElement(this._config.parent) ? (e = this._config.parent, void 0 !== this._config.parent.jquery && (e = this._config.parent[0])) : e = document.querySelector(this._config.parent);
                var t = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]',
                    o = [].slice.call(e.querySelectorAll(t));
                return p(o).each(function(e, t) {
                    i._addAriaAndCollapsedClass(r._getTargetFromElement(t), [t])
                }), e
            }, e._addAriaAndCollapsedClass = function(e, t) {
                var i = p(e).hasClass(ce);
                t.length && p(t).toggleClass(ue, !i).attr("aria-expanded", i)
            }, r._getTargetFromElement = function(e) {
                var t = f.getSelectorFromElement(e);
                return t ? document.querySelector(t) : null
            }, r._jQueryInterface = function(o) {
                return this.each(function() {
                    var e = p(this),
                        t = e.data(oe),
                        i = l({}, se, e.data(), "object" == typeof o && o ? o : {});
                    if (!t && i.toggle && /show|hide/.test(o) && (i.toggle = !1), t || (t = new r(this, i), e.data(oe, t)), "string" == typeof o) {
                        if (void 0 === t[o]) throw new TypeError('No method named "' + o + '"');
                        t[o]()
                    }
                })
            }, s(r, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "Default",
                get: function() {
                    return se
                }
            }]), r
        }();
    p(document).on(le.CLICK_DATA_API, fe.DATA_TOGGLE, function(e) {
        "A" === e.currentTarget.tagName && e.preventDefault();
        var i = p(this),
            t = f.getSelectorFromElement(this),
            o = [].slice.call(document.querySelectorAll(t));
        p(o).each(function() {
            var e = p(this),
                t = e.data(oe) ? "toggle" : i.data();
            ge._jQueryInterface.call(e, t)
        })
    }), p.fn[ie] = ge._jQueryInterface, p.fn[ie].Constructor = ge, p.fn[ie].noConflict = function() {
        return p.fn[ie] = ae, ge._jQueryInterface
    };
    var ve = "dropdown",
        ye = "bs.dropdown",
        we = "." + ye,
        be = ".data-api",
        _e = p.fn[ve],
        ke = new RegExp("38|40|27"),
        Ce = {
            HIDE: "hide" + we,
            HIDDEN: "hidden" + we,
            SHOW: "show" + we,
            SHOWN: "shown" + we,
            CLICK: "click" + we,
            CLICK_DATA_API: "click" + we + be,
            KEYDOWN_DATA_API: "keydown" + we + be,
            KEYUP_DATA_API: "keyup" + we + be
        },
        xe = "disabled",
        Se = "show",
        Te = "dropup",
        Ee = "dropright",
        Ae = "dropleft",
        $e = "dropdown-menu-right",
        Ie = "position-static",
        De = '[data-toggle="dropdown"]',
        Oe = ".dropdown form",
        ze = ".dropdown-menu",
        je = ".navbar-nav",
        Pe = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",
        Le = "top-start",
        Me = "top-end",
        Ne = "bottom-start",
        He = "bottom-end",
        Be = "right-start",
        qe = "left-start",
        Re = {
            offset: 0,
            flip: !0,
            boundary: "scrollParent",
            reference: "toggle",
            display: "dynamic"
        },
        We = {
            offset: "(number|string|function)",
            flip: "boolean",
            boundary: "(string|element)",
            reference: "(string|element)",
            display: "string"
        },
        Ue = function() {
            function c(e, t) {
                this._element = e, this._popper = null, this._config = this._getConfig(t), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners()
            }
            var e = c.prototype;
            return e.toggle = function() {
                if (!this._element.disabled && !p(this._element).hasClass(xe)) {
                    var e = c._getParentFromElement(this._element),
                        t = p(this._menu).hasClass(Se);
                    if (c._clearMenus(), !t) {
                        var i = {
                                relatedTarget: this._element
                            },
                            o = p.Event(Ce.SHOW, i);
                        if (p(e).trigger(o), !o.isDefaultPrevented()) {
                            if (!this._inNavbar) {
                                if (void 0 === d) throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");
                                var n = this._element;
                                "parent" === this._config.reference ? n = e : f.isElement(this._config.reference) && (n = this._config.reference, void 0 !== this._config.reference.jquery && (n = this._config.reference[0])), "scrollParent" !== this._config.boundary && p(e).addClass(Ie), this._popper = new d(n, this._menu, this._getPopperConfig())
                            }
                            "ontouchstart" in document.documentElement && 0 === p(e).closest(je).length && p(document.body).children().on("mouseover", null, p.noop), this._element.focus(), this._element.setAttribute("aria-expanded", !0), p(this._menu).toggleClass(Se), p(e).toggleClass(Se).trigger(p.Event(Ce.SHOWN, i))
                        }
                    }
                }
            }, e.show = function() {
                if (!(this._element.disabled || p(this._element).hasClass(xe) || p(this._menu).hasClass(Se))) {
                    var e = {
                            relatedTarget: this._element
                        },
                        t = p.Event(Ce.SHOW, e),
                        i = c._getParentFromElement(this._element);
                    p(i).trigger(t), t.isDefaultPrevented() || (p(this._menu).toggleClass(Se), p(i).toggleClass(Se).trigger(p.Event(Ce.SHOWN, e)))
                }
            }, e.hide = function() {
                if (!this._element.disabled && !p(this._element).hasClass(xe) && p(this._menu).hasClass(Se)) {
                    var e = {
                            relatedTarget: this._element
                        },
                        t = p.Event(Ce.HIDE, e),
                        i = c._getParentFromElement(this._element);
                    p(i).trigger(t), t.isDefaultPrevented() || (p(this._menu).toggleClass(Se), p(i).toggleClass(Se).trigger(p.Event(Ce.HIDDEN, e)))
                }
            }, e.dispose = function() {
                p.removeData(this._element, ye), p(this._element).off(we), this._element = null, (this._menu = null) !== this._popper && (this._popper.destroy(), this._popper = null)
            }, e.update = function() {
                this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate()
            }, e._addEventListeners = function() {
                var t = this;
                p(this._element).on(Ce.CLICK, function(e) {
                    e.preventDefault(), e.stopPropagation(), t.toggle()
                })
            }, e._getConfig = function(e) {
                return e = l({}, this.constructor.Default, p(this._element).data(), e), f.typeCheckConfig(ve, e, this.constructor.DefaultType), e
            }, e._getMenuElement = function() {
                if (!this._menu) {
                    var e = c._getParentFromElement(this._element);
                    e && (this._menu = e.querySelector(ze))
                }
                return this._menu
            }, e._getPlacement = function() {
                var e = p(this._element.parentNode),
                    t = Ne;
                return e.hasClass(Te) ? (t = Le, p(this._menu).hasClass($e) && (t = Me)) : e.hasClass(Ee) ? t = Be : e.hasClass(Ae) ? t = qe : p(this._menu).hasClass($e) && (t = He), t
            }, e._detectNavbar = function() {
                return 0 < p(this._element).closest(".navbar").length
            }, e._getOffset = function() {
                var t = this,
                    e = {};
                return "function" == typeof this._config.offset ? e.fn = function(e) {
                    return e.offsets = l({}, e.offsets, t._config.offset(e.offsets, t._element) || {}), e
                } : e.offset = this._config.offset, e
            }, e._getPopperConfig = function() {
                var e = {
                    placement: this._getPlacement(),
                    modifiers: {
                        offset: this._getOffset(),
                        flip: {
                            enabled: this._config.flip
                        },
                        preventOverflow: {
                            boundariesElement: this._config.boundary
                        }
                    }
                };
                return "static" === this._config.display && (e.modifiers.applyStyle = {
                    enabled: !1
                }), e
            }, c._jQueryInterface = function(t) {
                return this.each(function() {
                    var e = p(this).data(ye);
                    if (e || (e = new c(this, "object" == typeof t ? t : null), p(this).data(ye, e)), "string" == typeof t) {
                        if (void 0 === e[t]) throw new TypeError('No method named "' + t + '"');
                        e[t]()
                    }
                })
            }, c._clearMenus = function(e) {
                if (!e || 3 !== e.which && ("keyup" !== e.type || 9 === e.which))
                    for (var t = [].slice.call(document.querySelectorAll(De)), i = 0, o = t.length; i < o; i++) {
                        var n = c._getParentFromElement(t[i]),
                            a = p(t[i]).data(ye),
                            s = {
                                relatedTarget: t[i]
                            };
                        if (e && "click" === e.type && (s.clickEvent = e), a) {
                            var r = a._menu;
                            if (p(n).hasClass(Se) && !(e && ("click" === e.type && /input|textarea/i.test(e.target.tagName) || "keyup" === e.type && 9 === e.which) && p.contains(n, e.target))) {
                                var l = p.Event(Ce.HIDE, s);
                                p(n).trigger(l), l.isDefaultPrevented() || ("ontouchstart" in document.documentElement && p(document.body).children().off("mouseover", null, p.noop), t[i].setAttribute("aria-expanded", "false"), p(r).removeClass(Se), p(n).removeClass(Se).trigger(p.Event(Ce.HIDDEN, s)))
                            }
                        }
                    }
            }, c._getParentFromElement = function(e) {
                var t, i = f.getSelectorFromElement(e);
                return i && (t = document.querySelector(i)), t || e.parentNode
            }, c._dataApiKeydownHandler = function(e) {
                if ((/input|textarea/i.test(e.target.tagName) ? !(32 === e.which || 27 !== e.which && (40 !== e.which && 38 !== e.which || p(e.target).closest(ze).length)) : ke.test(e.which)) && (e.preventDefault(), e.stopPropagation(), !this.disabled && !p(this).hasClass(xe))) {
                    var t = c._getParentFromElement(this),
                        i = p(t).hasClass(Se);
                    if (i && (!i || 27 !== e.which && 32 !== e.which)) {
                        var o = [].slice.call(t.querySelectorAll(Pe));
                        if (0 !== o.length) {
                            var n = o.indexOf(e.target);
                            38 === e.which && 0 < n && n--, 40 === e.which && n < o.length - 1 && n++, n < 0 && (n = 0), o[n].focus()
                        }
                    } else {
                        if (27 === e.which) {
                            var a = t.querySelector(De);
                            p(a).trigger("focus")
                        }
                        p(this).trigger("click")
                    }
                }
            }, s(c, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "Default",
                get: function() {
                    return Re
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return We
                }
            }]), c
        }();
    p(document).on(Ce.KEYDOWN_DATA_API, De, Ue._dataApiKeydownHandler).on(Ce.KEYDOWN_DATA_API, ze, Ue._dataApiKeydownHandler).on(Ce.CLICK_DATA_API + " " + Ce.KEYUP_DATA_API, Ue._clearMenus).on(Ce.CLICK_DATA_API, De, function(e) {
        e.preventDefault(), e.stopPropagation(), Ue._jQueryInterface.call(p(this), "toggle")
    }).on(Ce.CLICK_DATA_API, Oe, function(e) {
        e.stopPropagation()
    }), p.fn[ve] = Ue._jQueryInterface, p.fn[ve].Constructor = Ue, p.fn[ve].noConflict = function() {
        return p.fn[ve] = _e, Ue._jQueryInterface
    };
    var Fe = "modal",
        Ye = "bs.modal",
        Xe = "." + Ye,
        Ve = p.fn[Fe],
        Ke = {
            backdrop: !0,
            keyboard: !0,
            focus: !0,
            show: !0
        },
        Qe = {
            backdrop: "(boolean|string)",
            keyboard: "boolean",
            focus: "boolean",
            show: "boolean"
        },
        Ge = {
            HIDE: "hide" + Xe,
            HIDDEN: "hidden" + Xe,
            SHOW: "show" + Xe,
            SHOWN: "shown" + Xe,
            FOCUSIN: "focusin" + Xe,
            RESIZE: "resize" + Xe,
            CLICK_DISMISS: "click.dismiss" + Xe,
            KEYDOWN_DISMISS: "keydown.dismiss" + Xe,
            MOUSEUP_DISMISS: "mouseup.dismiss" + Xe,
            MOUSEDOWN_DISMISS: "mousedown.dismiss" + Xe,
            CLICK_DATA_API: "click" + Xe + ".data-api"
        },
        Ze = "modal-dialog-scrollable",
        Je = "modal-scrollbar-measure",
        et = "modal-backdrop",
        tt = "modal-open",
        it = "fade",
        ot = "show",
        nt = {
            DIALOG: ".modal-dialog",
            MODAL_BODY: ".modal-body",
            DATA_TOGGLE: '[data-toggle="modal"]',
            DATA_DISMISS: '[data-dismiss="modal"]',
            FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
            STICKY_CONTENT: ".sticky-top"
        },
        at = function() {
            function n(e, t) {
                this._config = this._getConfig(t), this._element = e, this._dialog = e.querySelector(nt.DIALOG), this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollbarWidth = 0
            }
            var e = n.prototype;
            return e.toggle = function(e) {
                return this._isShown ? this.hide() : this.show(e)
            }, e.show = function(e) {
                var t = this;
                if (!this._isShown && !this._isTransitioning) {
                    p(this._element).hasClass(it) && (this._isTransitioning = !0);
                    var i = p.Event(Ge.SHOW, {
                        relatedTarget: e
                    });
                    p(this._element).trigger(i), this._isShown || i.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), p(this._element).on(Ge.CLICK_DISMISS, nt.DATA_DISMISS, function(e) {
                        return t.hide(e)
                    }), p(this._dialog).on(Ge.MOUSEDOWN_DISMISS, function() {
                        p(t._element).one(Ge.MOUSEUP_DISMISS, function(e) {
                            p(e.target).is(t._element) && (t._ignoreBackdropClick = !0)
                        })
                    }), this._showBackdrop(function() {
                        return t._showElement(e)
                    }))
                }
            }, e.hide = function(e) {
                var t = this;
                if (e && e.preventDefault(), this._isShown && !this._isTransitioning) {
                    var i = p.Event(Ge.HIDE);
                    if (p(this._element).trigger(i), this._isShown && !i.isDefaultPrevented()) {
                        this._isShown = !1;
                        var o = p(this._element).hasClass(it);
                        if (o && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), p(document).off(Ge.FOCUSIN), p(this._element).removeClass(ot), p(this._element).off(Ge.CLICK_DISMISS), p(this._dialog).off(Ge.MOUSEDOWN_DISMISS), o) {
                            var n = f.getTransitionDurationFromElement(this._element);
                            p(this._element).one(f.TRANSITION_END, function(e) {
                                return t._hideModal(e)
                            }).emulateTransitionEnd(n)
                        } else this._hideModal()
                    }
                }
            }, e.dispose = function() {
                [window, this._element, this._dialog].forEach(function(e) {
                    return p(e).off(Xe)
                }), p(document).off(Ge.FOCUSIN), p.removeData(this._element, Ye), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null
            }, e.handleUpdate = function() {
                this._adjustDialog()
            }, e._getConfig = function(e) {
                return e = l({}, Ke, e), f.typeCheckConfig(Fe, e, Qe), e
            }, e._showElement = function(e) {
                var t = this,
                    i = p(this._element).hasClass(it);
                this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), p(this._dialog).hasClass(Ze) ? this._dialog.querySelector(nt.MODAL_BODY).scrollTop = 0 : this._element.scrollTop = 0, i && f.reflow(this._element), p(this._element).addClass(ot), this._config.focus && this._enforceFocus();
                var o = p.Event(Ge.SHOWN, {
                        relatedTarget: e
                    }),
                    n = function() {
                        t._config.focus && t._element.focus(), t._isTransitioning = !1, p(t._element).trigger(o)
                    };
                if (i) {
                    var a = f.getTransitionDurationFromElement(this._dialog);
                    p(this._dialog).one(f.TRANSITION_END, n).emulateTransitionEnd(a)
                } else n()
            }, e._enforceFocus = function() {
                var t = this;
                p(document).off(Ge.FOCUSIN).on(Ge.FOCUSIN, function(e) {
                    document !== e.target && t._element !== e.target && 0 === p(t._element).has(e.target).length && t._element.focus()
                })
            }, e._setEscapeEvent = function() {
                var t = this;
                this._isShown && this._config.keyboard ? p(this._element).on(Ge.KEYDOWN_DISMISS, function(e) {
                    27 === e.which && (e.preventDefault(), t.hide())
                }) : this._isShown || p(this._element).off(Ge.KEYDOWN_DISMISS)
            }, e._setResizeEvent = function() {
                var t = this;
                this._isShown ? p(window).on(Ge.RESIZE, function(e) {
                    return t.handleUpdate(e)
                }) : p(window).off(Ge.RESIZE)
            }, e._hideModal = function() {
                var e = this;
                this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._isTransitioning = !1, this._showBackdrop(function() {
                    p(document.body).removeClass(tt), e._resetAdjustments(), e._resetScrollbar(), p(e._element).trigger(Ge.HIDDEN)
                })
            }, e._removeBackdrop = function() {
                this._backdrop && (p(this._backdrop).remove(), this._backdrop = null)
            }, e._showBackdrop = function(e) {
                var t = this,
                    i = p(this._element).hasClass(it) ? it : "";
                if (this._isShown && this._config.backdrop) {
                    if (this._backdrop = document.createElement("div"), this._backdrop.className = et, i && this._backdrop.classList.add(i), p(this._backdrop).appendTo(document.body), p(this._element).on(Ge.CLICK_DISMISS, function(e) {
                            t._ignoreBackdropClick ? t._ignoreBackdropClick = !1 : e.target === e.currentTarget && ("static" === t._config.backdrop ? t._element.focus() : t.hide())
                        }), i && f.reflow(this._backdrop), p(this._backdrop).addClass(ot), !e) return;
                    if (!i) return void e();
                    var o = f.getTransitionDurationFromElement(this._backdrop);
                    p(this._backdrop).one(f.TRANSITION_END, e).emulateTransitionEnd(o)
                } else if (!this._isShown && this._backdrop) {
                    p(this._backdrop).removeClass(ot);
                    var n = function() {
                        t._removeBackdrop(), e && e()
                    };
                    if (p(this._element).hasClass(it)) {
                        var a = f.getTransitionDurationFromElement(this._backdrop);
                        p(this._backdrop).one(f.TRANSITION_END, n).emulateTransitionEnd(a)
                    } else n()
                } else e && e()
            }, e._adjustDialog = function() {
                var e = this._element.scrollHeight > document.documentElement.clientHeight;
                !this._isBodyOverflowing && e && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !e && (this._element.style.paddingRight = this._scrollbarWidth + "px")
            }, e._resetAdjustments = function() {
                this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
            }, e._checkScrollbar = function() {
                var e = document.body.getBoundingClientRect();
                this._isBodyOverflowing = e.left + e.right < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth()
            }, e._setScrollbar = function() {
                var n = this;
                if (this._isBodyOverflowing) {
                    var e = [].slice.call(document.querySelectorAll(nt.FIXED_CONTENT)),
                        t = [].slice.call(document.querySelectorAll(nt.STICKY_CONTENT));
                    p(e).each(function(e, t) {
                        var i = t.style.paddingRight,
                            o = p(t).css("padding-right");
                        p(t).data("padding-right", i).css("padding-right", parseFloat(o) + n._scrollbarWidth + "px")
                    }), p(t).each(function(e, t) {
                        var i = t.style.marginRight,
                            o = p(t).css("margin-right");
                        p(t).data("margin-right", i).css("margin-right", parseFloat(o) - n._scrollbarWidth + "px")
                    });
                    var i = document.body.style.paddingRight,
                        o = p(document.body).css("padding-right");
                    p(document.body).data("padding-right", i).css("padding-right", parseFloat(o) + this._scrollbarWidth + "px")
                }
                p(document.body).addClass(tt)
            }, e._resetScrollbar = function() {
                var e = [].slice.call(document.querySelectorAll(nt.FIXED_CONTENT));
                p(e).each(function(e, t) {
                    var i = p(t).data("padding-right");
                    p(t).removeData("padding-right"), t.style.paddingRight = i || ""
                });
                var t = [].slice.call(document.querySelectorAll("" + nt.STICKY_CONTENT));
                p(t).each(function(e, t) {
                    var i = p(t).data("margin-right");
                    void 0 !== i && p(t).css("margin-right", i).removeData("margin-right")
                });
                var i = p(document.body).data("padding-right");
                p(document.body).removeData("padding-right"), document.body.style.paddingRight = i || ""
            }, e._getScrollbarWidth = function() {
                var e = document.createElement("div");
                e.className = Je, document.body.appendChild(e);
                var t = e.getBoundingClientRect().width - e.clientWidth;
                return document.body.removeChild(e), t
            }, n._jQueryInterface = function(i, o) {
                return this.each(function() {
                    var e = p(this).data(Ye),
                        t = l({}, Ke, p(this).data(), "object" == typeof i && i ? i : {});
                    if (e || (e = new n(this, t), p(this).data(Ye, e)), "string" == typeof i) {
                        if (void 0 === e[i]) throw new TypeError('No method named "' + i + '"');
                        e[i](o)
                    } else t.show && e.show(o)
                })
            }, s(n, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "Default",
                get: function() {
                    return Ke
                }
            }]), n
        }();
    p(document).on(Ge.CLICK_DATA_API, nt.DATA_TOGGLE, function(e) {
        var t, i = this,
            o = f.getSelectorFromElement(this);
        o && (t = document.querySelector(o));
        var n = p(t).data(Ye) ? "toggle" : l({}, p(t).data(), p(this).data());
        "A" !== this.tagName && "AREA" !== this.tagName || e.preventDefault();
        var a = p(t).one(Ge.SHOW, function(e) {
            e.isDefaultPrevented() || a.one(Ge.HIDDEN, function() {
                p(i).is(":visible") && i.focus()
            })
        });
        at._jQueryInterface.call(p(t), n, this)
    }), p.fn[Fe] = at._jQueryInterface, p.fn[Fe].Constructor = at, p.fn[Fe].noConflict = function() {
        return p.fn[Fe] = Ve, at._jQueryInterface
    };
    var st = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"],
        rt = {
            "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
            a: ["target", "href", "title", "rel"],
            area: [],
            b: [],
            br: [],
            col: [],
            code: [],
            div: [],
            em: [],
            hr: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            i: [],
            img: ["src", "alt", "title", "width", "height"],
            li: [],
            ol: [],
            p: [],
            pre: [],
            s: [],
            small: [],
            span: [],
            sub: [],
            sup: [],
            strong: [],
            u: [],
            ul: []
        },
        lt = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,
        ct = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

    function mt(e, s, t) {
        if (0 === e.length) return e;
        if (t && "function" == typeof t) return t(e);
        for (var i = (new window.DOMParser).parseFromString(e, "text/html"), r = Object.keys(s), l = [].slice.call(i.body.querySelectorAll("*")), o = function(e, t) {
                var i = l[e],
                    o = i.nodeName.toLowerCase();
                if (-1 === r.indexOf(i.nodeName.toLowerCase())) return i.parentNode.removeChild(i), "continue";
                var n = [].slice.call(i.attributes),
                    a = [].concat(s["*"] || [], s[o] || []);
                n.forEach(function(e) {
                    (function(e, t) {
                        var i = e.nodeName.toLowerCase();
                        if (-1 !== t.indexOf(i)) return -1 === st.indexOf(i) || Boolean(e.nodeValue.match(lt) || e.nodeValue.match(ct));
                        for (var o = t.filter(function(e) {
                                return e instanceof RegExp
                            }), n = 0, a = o.length; n < a; n++)
                            if (i.match(o[n])) return !0;
                        return !1
                    })(e, a) || i.removeAttribute(e.nodeName)
                })
            }, n = 0, a = l.length; n < a; n++) o(n);
        return i.body.innerHTML
    }
    var dt = "tooltip",
        ut = "bs.tooltip",
        ht = "." + ut,
        pt = p.fn[dt],
        ft = "bs-tooltip",
        gt = new RegExp("(^|\\s)" + ft + "\\S+", "g"),
        vt = ["sanitize", "whiteList", "sanitizeFn"],
        yt = {
            animation: "boolean",
            template: "string",
            title: "(string|element|function)",
            trigger: "string",
            delay: "(number|object)",
            html: "boolean",
            selector: "(string|boolean)",
            placement: "(string|function)",
            offset: "(number|string|function)",
            container: "(string|element|boolean)",
            fallbackPlacement: "(string|array)",
            boundary: "(string|element)",
            sanitize: "boolean",
            sanitizeFn: "(null|function)",
            whiteList: "object"
        },
        wt = {
            AUTO: "auto",
            TOP: "top",
            RIGHT: "right",
            BOTTOM: "bottom",
            LEFT: "left"
        },
        bt = {
            animation: !0,
            template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            selector: !1,
            placement: "top",
            offset: 0,
            container: !1,
            fallbackPlacement: "flip",
            boundary: "scrollParent",
            sanitize: !0,
            sanitizeFn: null,
            whiteList: rt
        },
        _t = "show",
        kt = "out",
        Ct = {
            HIDE: "hide" + ht,
            HIDDEN: "hidden" + ht,
            SHOW: "show" + ht,
            SHOWN: "shown" + ht,
            INSERTED: "inserted" + ht,
            CLICK: "click" + ht,
            FOCUSIN: "focusin" + ht,
            FOCUSOUT: "focusout" + ht,
            MOUSEENTER: "mouseenter" + ht,
            MOUSELEAVE: "mouseleave" + ht
        },
        xt = "fade",
        St = "show",
        Tt = ".tooltip-inner",
        Et = ".arrow",
        At = "hover",
        $t = "focus",
        It = "click",
        Dt = "manual",
        Ot = function() {
            function o(e, t) {
                if (void 0 === d) throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");
                this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = e, this.config = this._getConfig(t), this.tip = null, this._setListeners()
            }
            var e = o.prototype;
            return e.enable = function() {
                this._isEnabled = !0
            }, e.disable = function() {
                this._isEnabled = !1
            }, e.toggleEnabled = function() {
                this._isEnabled = !this._isEnabled
            }, e.toggle = function(e) {
                if (this._isEnabled)
                    if (e) {
                        var t = this.constructor.DATA_KEY,
                            i = p(e.currentTarget).data(t);
                        i || (i = new this.constructor(e.currentTarget, this._getDelegateConfig()), p(e.currentTarget).data(t, i)), i._activeTrigger.click = !i._activeTrigger.click, i._isWithActiveTrigger() ? i._enter(null, i) : i._leave(null, i)
                    } else {
                        if (p(this.getTipElement()).hasClass(St)) return void this._leave(null, this);
                        this._enter(null, this)
                    }
            }, e.dispose = function() {
                clearTimeout(this._timeout), p.removeData(this.element, this.constructor.DATA_KEY), p(this.element).off(this.constructor.EVENT_KEY), p(this.element).closest(".modal").off("hide.bs.modal"), this.tip && p(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, (this._activeTrigger = null) !== this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null
            }, e.show = function() {
                var t = this;
                if ("none" === p(this.element).css("display")) throw new Error("Please use show on visible elements");
                var e = p.Event(this.constructor.Event.SHOW);
                if (this.isWithContent() && this._isEnabled) {
                    p(this.element).trigger(e);
                    var i = f.findShadowRoot(this.element),
                        o = p.contains(null !== i ? i : this.element.ownerDocument.documentElement, this.element);
                    if (e.isDefaultPrevented() || !o) return;
                    var n = this.getTipElement(),
                        a = f.getUID(this.constructor.NAME);
                    n.setAttribute("id", a), this.element.setAttribute("aria-describedby", a), this.setContent(), this.config.animation && p(n).addClass(xt);
                    var s = "function" == typeof this.config.placement ? this.config.placement.call(this, n, this.element) : this.config.placement,
                        r = this._getAttachment(s);
                    this.addAttachmentClass(r);
                    var l = this._getContainer();
                    p(n).data(this.constructor.DATA_KEY, this), p.contains(this.element.ownerDocument.documentElement, this.tip) || p(n).appendTo(l), p(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new d(this.element, n, {
                        placement: r,
                        modifiers: {
                            offset: this._getOffset(),
                            flip: {
                                behavior: this.config.fallbackPlacement
                            },
                            arrow: {
                                element: Et
                            },
                            preventOverflow: {
                                boundariesElement: this.config.boundary
                            }
                        },
                        onCreate: function(e) {
                            e.originalPlacement !== e.placement && t._handlePopperPlacementChange(e)
                        },
                        onUpdate: function(e) {
                            return t._handlePopperPlacementChange(e)
                        }
                    }), p(n).addClass(St), "ontouchstart" in document.documentElement && p(document.body).children().on("mouseover", null, p.noop);
                    var c = function() {
                        t.config.animation && t._fixTransition();
                        var e = t._hoverState;
                        t._hoverState = null, p(t.element).trigger(t.constructor.Event.SHOWN), e === kt && t._leave(null, t)
                    };
                    if (p(this.tip).hasClass(xt)) {
                        var m = f.getTransitionDurationFromElement(this.tip);
                        p(this.tip).one(f.TRANSITION_END, c).emulateTransitionEnd(m)
                    } else c()
                }
            }, e.hide = function(e) {
                var t = this,
                    i = this.getTipElement(),
                    o = p.Event(this.constructor.Event.HIDE),
                    n = function() {
                        t._hoverState !== _t && i.parentNode && i.parentNode.removeChild(i), t._cleanTipClass(), t.element.removeAttribute("aria-describedby"), p(t.element).trigger(t.constructor.Event.HIDDEN), null !== t._popper && t._popper.destroy(), e && e()
                    };
                if (p(this.element).trigger(o), !o.isDefaultPrevented()) {
                    if (p(i).removeClass(St), "ontouchstart" in document.documentElement && p(document.body).children().off("mouseover", null, p.noop), this._activeTrigger[It] = !1, this._activeTrigger[$t] = !1, this._activeTrigger[At] = !1, p(this.tip).hasClass(xt)) {
                        var a = f.getTransitionDurationFromElement(i);
                        p(i).one(f.TRANSITION_END, n).emulateTransitionEnd(a)
                    } else n();
                    this._hoverState = ""
                }
            }, e.update = function() {
                null !== this._popper && this._popper.scheduleUpdate()
            }, e.isWithContent = function() {
                return Boolean(this.getTitle())
            }, e.addAttachmentClass = function(e) {
                p(this.getTipElement()).addClass(ft + "-" + e)
            }, e.getTipElement = function() {
                return this.tip = this.tip || p(this.config.template)[0], this.tip
            }, e.setContent = function() {
                var e = this.getTipElement();
                this.setElementContent(p(e.querySelectorAll(Tt)), this.getTitle()), p(e).removeClass(xt + " " + St)
            }, e.setElementContent = function(e, t) {
                "object" != typeof t || !t.nodeType && !t.jquery ? this.config.html ? (this.config.sanitize && (t = mt(t, this.config.whiteList, this.config.sanitizeFn)), e.html(t)) : e.text(t) : this.config.html ? p(t).parent().is(e) || e.empty().append(t) : e.text(p(t).text())
            }, e.getTitle = function() {
                var e = this.element.getAttribute("data-original-title");
                return e || (e = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), e
            }, e._getOffset = function() {
                var t = this,
                    e = {};
                return "function" == typeof this.config.offset ? e.fn = function(e) {
                    return e.offsets = l({}, e.offsets, t.config.offset(e.offsets, t.element) || {}), e
                } : e.offset = this.config.offset, e
            }, e._getContainer = function() {
                return !1 === this.config.container ? document.body : f.isElement(this.config.container) ? p(this.config.container) : p(document).find(this.config.container)
            }, e._getAttachment = function(e) {
                return wt[e.toUpperCase()]
            }, e._setListeners = function() {
                var o = this;
                this.config.trigger.split(" ").forEach(function(e) {
                    if ("click" === e) p(o.element).on(o.constructor.Event.CLICK, o.config.selector, function(e) {
                        return o.toggle(e)
                    });
                    else if (e !== Dt) {
                        var t = e === At ? o.constructor.Event.MOUSEENTER : o.constructor.Event.FOCUSIN,
                            i = e === At ? o.constructor.Event.MOUSELEAVE : o.constructor.Event.FOCUSOUT;
                        p(o.element).on(t, o.config.selector, function(e) {
                            return o._enter(e)
                        }).on(i, o.config.selector, function(e) {
                            return o._leave(e)
                        })
                    }
                }), p(this.element).closest(".modal").on("hide.bs.modal", function() {
                    o.element && o.hide()
                }), this.config.selector ? this.config = l({}, this.config, {
                    trigger: "manual",
                    selector: ""
                }) : this._fixTitle()
            }, e._fixTitle = function() {
                var e = typeof this.element.getAttribute("data-original-title");
                (this.element.getAttribute("title") || "string" !== e) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""))
            }, e._enter = function(e, t) {
                var i = this.constructor.DATA_KEY;
                (t = t || p(e.currentTarget).data(i)) || (t = new this.constructor(e.currentTarget, this._getDelegateConfig()), p(e.currentTarget).data(i, t)), e && (t._activeTrigger["focusin" === e.type ? $t : At] = !0), p(t.getTipElement()).hasClass(St) || t._hoverState === _t ? t._hoverState = _t : (clearTimeout(t._timeout), t._hoverState = _t, t.config.delay && t.config.delay.show ? t._timeout = setTimeout(function() {
                    t._hoverState === _t && t.show()
                }, t.config.delay.show) : t.show())
            }, e._leave = function(e, t) {
                var i = this.constructor.DATA_KEY;
                (t = t || p(e.currentTarget).data(i)) || (t = new this.constructor(e.currentTarget, this._getDelegateConfig()), p(e.currentTarget).data(i, t)), e && (t._activeTrigger["focusout" === e.type ? $t : At] = !1), t._isWithActiveTrigger() || (clearTimeout(t._timeout), t._hoverState = kt, t.config.delay && t.config.delay.hide ? t._timeout = setTimeout(function() {
                    t._hoverState === kt && t.hide()
                }, t.config.delay.hide) : t.hide())
            }, e._isWithActiveTrigger = function() {
                for (var e in this._activeTrigger)
                    if (this._activeTrigger[e]) return !0;
                return !1
            }, e._getConfig = function(e) {
                var t = p(this.element).data();
                return Object.keys(t).forEach(function(e) {
                    -1 !== vt.indexOf(e) && delete t[e]
                }), "number" == typeof(e = l({}, this.constructor.Default, t, "object" == typeof e && e ? e : {})).delay && (e.delay = {
                    show: e.delay,
                    hide: e.delay
                }), "number" == typeof e.title && (e.title = e.title.toString()), "number" == typeof e.content && (e.content = e.content.toString()), f.typeCheckConfig(dt, e, this.constructor.DefaultType), e.sanitize && (e.template = mt(e.template, e.whiteList, e.sanitizeFn)), e
            }, e._getDelegateConfig = function() {
                var e = {};
                if (this.config)
                    for (var t in this.config) this.constructor.Default[t] !== this.config[t] && (e[t] = this.config[t]);
                return e
            }, e._cleanTipClass = function() {
                var e = p(this.getTipElement()),
                    t = e.attr("class").match(gt);
                null !== t && t.length && e.removeClass(t.join(""))
            }, e._handlePopperPlacementChange = function(e) {
                var t = e.instance;
                this.tip = t.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(e.placement))
            }, e._fixTransition = function() {
                var e = this.getTipElement(),
                    t = this.config.animation;
                null === e.getAttribute("x-placement") && (p(e).removeClass(xt), this.config.animation = !1, this.hide(), this.show(), this.config.animation = t)
            }, o._jQueryInterface = function(i) {
                return this.each(function() {
                    var e = p(this).data(ut),
                        t = "object" == typeof i && i;
                    if ((e || !/dispose|hide/.test(i)) && (e || (e = new o(this, t), p(this).data(ut, e)), "string" == typeof i)) {
                        if (void 0 === e[i]) throw new TypeError('No method named "' + i + '"');
                        e[i]()
                    }
                })
            }, s(o, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "Default",
                get: function() {
                    return bt
                }
            }, {
                key: "NAME",
                get: function() {
                    return dt
                }
            }, {
                key: "DATA_KEY",
                get: function() {
                    return ut
                }
            }, {
                key: "Event",
                get: function() {
                    return Ct
                }
            }, {
                key: "EVENT_KEY",
                get: function() {
                    return ht
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return yt
                }
            }]), o
        }();
    p.fn[dt] = Ot._jQueryInterface, p.fn[dt].Constructor = Ot, p.fn[dt].noConflict = function() {
        return p.fn[dt] = pt, Ot._jQueryInterface
    };
    var zt = "popover",
        jt = "bs.popover",
        Pt = "." + jt,
        Lt = p.fn[zt],
        Mt = "bs-popover",
        Nt = new RegExp("(^|\\s)" + Mt + "\\S+", "g"),
        Ht = l({}, Ot.Default, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        }),
        Bt = l({}, Ot.DefaultType, {
            content: "(string|element|function)"
        }),
        qt = "fade",
        Rt = "show",
        Wt = ".popover-header",
        Ut = ".popover-body",
        Ft = {
            HIDE: "hide" + Pt,
            HIDDEN: "hidden" + Pt,
            SHOW: "show" + Pt,
            SHOWN: "shown" + Pt,
            INSERTED: "inserted" + Pt,
            CLICK: "click" + Pt,
            FOCUSIN: "focusin" + Pt,
            FOCUSOUT: "focusout" + Pt,
            MOUSEENTER: "mouseenter" + Pt,
            MOUSELEAVE: "mouseleave" + Pt
        },
        Yt = function(e) {
            var t, i;

            function o() {
                return e.apply(this, arguments) || this
            }
            i = e, (t = o).prototype = Object.create(i.prototype), (t.prototype.constructor = t).__proto__ = i;
            var n = o.prototype;
            return n.isWithContent = function() {
                return this.getTitle() || this._getContent()
            }, n.addAttachmentClass = function(e) {
                p(this.getTipElement()).addClass(Mt + "-" + e)
            }, n.getTipElement = function() {
                return this.tip = this.tip || p(this.config.template)[0], this.tip
            }, n.setContent = function() {
                var e = p(this.getTipElement());
                this.setElementContent(e.find(Wt), this.getTitle());
                var t = this._getContent();
                "function" == typeof t && (t = t.call(this.element)), this.setElementContent(e.find(Ut), t), e.removeClass(qt + " " + Rt)
            }, n._getContent = function() {
                return this.element.getAttribute("data-content") || this.config.content
            }, n._cleanTipClass = function() {
                var e = p(this.getTipElement()),
                    t = e.attr("class").match(Nt);
                null !== t && 0 < t.length && e.removeClass(t.join(""))
            }, o._jQueryInterface = function(i) {
                return this.each(function() {
                    var e = p(this).data(jt),
                        t = "object" == typeof i ? i : null;
                    if ((e || !/dispose|hide/.test(i)) && (e || (e = new o(this, t), p(this).data(jt, e)), "string" == typeof i)) {
                        if (void 0 === e[i]) throw new TypeError('No method named "' + i + '"');
                        e[i]()
                    }
                })
            }, s(o, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "Default",
                get: function() {
                    return Ht
                }
            }, {
                key: "NAME",
                get: function() {
                    return zt
                }
            }, {
                key: "DATA_KEY",
                get: function() {
                    return jt
                }
            }, {
                key: "Event",
                get: function() {
                    return Ft
                }
            }, {
                key: "EVENT_KEY",
                get: function() {
                    return Pt
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return Bt
                }
            }]), o
        }(Ot);
    p.fn[zt] = Yt._jQueryInterface, p.fn[zt].Constructor = Yt, p.fn[zt].noConflict = function() {
        return p.fn[zt] = Lt, Yt._jQueryInterface
    };
    var Xt = "scrollspy",
        Vt = "bs.scrollspy",
        Kt = "." + Vt,
        Qt = p.fn[Xt],
        Gt = {
            offset: 10,
            method: "auto",
            target: ""
        },
        Zt = {
            offset: "number",
            method: "string",
            target: "(string|element)"
        },
        Jt = {
            ACTIVATE: "activate" + Kt,
            SCROLL: "scroll" + Kt,
            LOAD_DATA_API: "load" + Kt + ".data-api"
        },
        ei = "dropdown-item",
        ti = "active",
        ii = {
            DATA_SPY: '[data-spy="scroll"]',
            ACTIVE: ".active",
            NAV_LIST_GROUP: ".nav, .list-group",
            NAV_LINKS: ".nav-link",
            NAV_ITEMS: ".nav-item",
            LIST_ITEMS: ".list-group-item",
            DROPDOWN: ".dropdown",
            DROPDOWN_ITEMS: ".dropdown-item",
            DROPDOWN_TOGGLE: ".dropdown-toggle"
        },
        oi = "offset",
        ni = "position",
        ai = function() {
            function i(e, t) {
                var i = this;
                this._element = e, this._scrollElement = "BODY" === e.tagName ? window : e, this._config = this._getConfig(t), this._selector = this._config.target + " " + ii.NAV_LINKS + "," + this._config.target + " " + ii.LIST_ITEMS + "," + this._config.target + " " + ii.DROPDOWN_ITEMS, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, p(this._scrollElement).on(Jt.SCROLL, function(e) {
                    return i._process(e)
                }), this.refresh(), this._process()
            }
            var e = i.prototype;
            return e.refresh = function() {
                var t = this,
                    e = this._scrollElement === this._scrollElement.window ? oi : ni,
                    n = "auto" === this._config.method ? e : this._config.method,
                    a = n === ni ? this._getScrollTop() : 0;
                this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function(e) {
                    var t, i = f.getSelectorFromElement(e);
                    if (i && (t = document.querySelector(i)), t) {
                        var o = t.getBoundingClientRect();
                        if (o.width || o.height) return [p(t)[n]().top + a, i]
                    }
                    return null
                }).filter(function(e) {
                    return e
                }).sort(function(e, t) {
                    return e[0] - t[0]
                }).forEach(function(e) {
                    t._offsets.push(e[0]), t._targets.push(e[1])
                })
            }, e.dispose = function() {
                p.removeData(this._element, Vt), p(this._scrollElement).off(Kt), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null
            }, e._getConfig = function(e) {
                if ("string" != typeof(e = l({}, Gt, "object" == typeof e && e ? e : {})).target) {
                    var t = p(e.target).attr("id");
                    t || (t = f.getUID(Xt), p(e.target).attr("id", t)), e.target = "#" + t
                }
                return f.typeCheckConfig(Xt, e, Zt), e
            }, e._getScrollTop = function() {
                return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
            }, e._getScrollHeight = function() {
                return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
            }, e._getOffsetHeight = function() {
                return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
            }, e._process = function() {
                var e = this._getScrollTop() + this._config.offset,
                    t = this._getScrollHeight(),
                    i = this._config.offset + t - this._getOffsetHeight();
                if (this._scrollHeight !== t && this.refresh(), i <= e) {
                    var o = this._targets[this._targets.length - 1];
                    this._activeTarget !== o && this._activate(o)
                } else {
                    if (this._activeTarget && e < this._offsets[0] && 0 < this._offsets[0]) return this._activeTarget = null, void this._clear();
                    for (var n = this._offsets.length; n--;) {
                        this._activeTarget !== this._targets[n] && e >= this._offsets[n] && (void 0 === this._offsets[n + 1] || e < this._offsets[n + 1]) && this._activate(this._targets[n])
                    }
                }
            }, e._activate = function(t) {
                this._activeTarget = t, this._clear();
                var e = this._selector.split(",").map(function(e) {
                        return e + '[data-target="' + t + '"],' + e + '[href="' + t + '"]'
                    }),
                    i = p([].slice.call(document.querySelectorAll(e.join(","))));
                i.hasClass(ei) ? (i.closest(ii.DROPDOWN).find(ii.DROPDOWN_TOGGLE).addClass(ti), i.addClass(ti)) : (i.addClass(ti), i.parents(ii.NAV_LIST_GROUP).prev(ii.NAV_LINKS + ", " + ii.LIST_ITEMS).addClass(ti), i.parents(ii.NAV_LIST_GROUP).prev(ii.NAV_ITEMS).children(ii.NAV_LINKS).addClass(ti)), p(this._scrollElement).trigger(Jt.ACTIVATE, {
                    relatedTarget: t
                })
            }, e._clear = function() {
                [].slice.call(document.querySelectorAll(this._selector)).filter(function(e) {
                    return e.classList.contains(ti)
                }).forEach(function(e) {
                    return e.classList.remove(ti)
                })
            }, i._jQueryInterface = function(t) {
                return this.each(function() {
                    var e = p(this).data(Vt);
                    if (e || (e = new i(this, "object" == typeof t && t), p(this).data(Vt, e)), "string" == typeof t) {
                        if (void 0 === e[t]) throw new TypeError('No method named "' + t + '"');
                        e[t]()
                    }
                })
            }, s(i, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "Default",
                get: function() {
                    return Gt
                }
            }]), i
        }();
    p(window).on(Jt.LOAD_DATA_API, function() {
        for (var e = [].slice.call(document.querySelectorAll(ii.DATA_SPY)), t = e.length; t--;) {
            var i = p(e[t]);
            ai._jQueryInterface.call(i, i.data())
        }
    }), p.fn[Xt] = ai._jQueryInterface, p.fn[Xt].Constructor = ai, p.fn[Xt].noConflict = function() {
        return p.fn[Xt] = Qt, ai._jQueryInterface
    };
    var si = "bs.tab",
        ri = "." + si,
        li = p.fn.tab,
        ci = {
            HIDE: "hide" + ri,
            HIDDEN: "hidden" + ri,
            SHOW: "show" + ri,
            SHOWN: "shown" + ri,
            CLICK_DATA_API: "click" + ri + ".data-api"
        },
        mi = "dropdown-menu",
        di = "active",
        ui = "disabled",
        hi = "fade",
        pi = "show",
        fi = ".dropdown",
        gi = ".nav, .list-group",
        vi = ".active",
        yi = "> li > .active",
        wi = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
        bi = ".dropdown-toggle",
        _i = "> .dropdown-menu .active",
        ki = function() {
            function o(e) {
                this._element = e
            }
            var e = o.prototype;
            return e.show = function() {
                var i = this;
                if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && p(this._element).hasClass(di) || p(this._element).hasClass(ui))) {
                    var e, o, t = p(this._element).closest(gi)[0],
                        n = f.getSelectorFromElement(this._element);
                    if (t) {
                        var a = "UL" === t.nodeName || "OL" === t.nodeName ? yi : vi;
                        o = (o = p.makeArray(p(t).find(a)))[o.length - 1]
                    }
                    var s = p.Event(ci.HIDE, {
                            relatedTarget: this._element
                        }),
                        r = p.Event(ci.SHOW, {
                            relatedTarget: o
                        });
                    if (o && p(o).trigger(s), p(this._element).trigger(r), !r.isDefaultPrevented() && !s.isDefaultPrevented()) {
                        n && (e = document.querySelector(n)), this._activate(this._element, t);
                        var l = function() {
                            var e = p.Event(ci.HIDDEN, {
                                    relatedTarget: i._element
                                }),
                                t = p.Event(ci.SHOWN, {
                                    relatedTarget: o
                                });
                            p(o).trigger(e), p(i._element).trigger(t)
                        };
                        e ? this._activate(e, e.parentNode, l) : l()
                    }
                }
            }, e.dispose = function() {
                p.removeData(this._element, si), this._element = null
            }, e._activate = function(e, t, i) {
                var o = this,
                    n = (!t || "UL" !== t.nodeName && "OL" !== t.nodeName ? p(t).children(vi) : p(t).find(yi))[0],
                    a = i && n && p(n).hasClass(hi),
                    s = function() {
                        return o._transitionComplete(e, n, i)
                    };
                if (n && a) {
                    var r = f.getTransitionDurationFromElement(n);
                    p(n).removeClass(pi).one(f.TRANSITION_END, s).emulateTransitionEnd(r)
                } else s()
            }, e._transitionComplete = function(e, t, i) {
                if (t) {
                    p(t).removeClass(di);
                    var o = p(t.parentNode).find(_i)[0];
                    o && p(o).removeClass(di), "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !1)
                }
                if (p(e).addClass(di), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !0), f.reflow(e), e.classList.contains(hi) && e.classList.add(pi), e.parentNode && p(e.parentNode).hasClass(mi)) {
                    var n = p(e).closest(fi)[0];
                    if (n) {
                        var a = [].slice.call(n.querySelectorAll(bi));
                        p(a).addClass(di)
                    }
                    e.setAttribute("aria-expanded", !0)
                }
                i && i()
            }, o._jQueryInterface = function(i) {
                return this.each(function() {
                    var e = p(this),
                        t = e.data(si);
                    if (t || (t = new o(this), e.data(si, t)), "string" == typeof i) {
                        if (void 0 === t[i]) throw new TypeError('No method named "' + i + '"');
                        t[i]()
                    }
                })
            }, s(o, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }]), o
        }();
    p(document).on(ci.CLICK_DATA_API, wi, function(e) {
        e.preventDefault(), ki._jQueryInterface.call(p(this), "show")
    }), p.fn.tab = ki._jQueryInterface, p.fn.tab.Constructor = ki, p.fn.tab.noConflict = function() {
        return p.fn.tab = li, ki._jQueryInterface
    };
    var Ci = "toast",
        xi = "bs.toast",
        Si = "." + xi,
        Ti = p.fn[Ci],
        Ei = {
            CLICK_DISMISS: "click.dismiss" + Si,
            HIDE: "hide" + Si,
            HIDDEN: "hidden" + Si,
            SHOW: "show" + Si,
            SHOWN: "shown" + Si
        },
        Ai = "fade",
        $i = "hide",
        Ii = "show",
        Di = "showing",
        Oi = {
            animation: "boolean",
            autohide: "boolean",
            delay: "number"
        },
        zi = {
            animation: !0,
            autohide: !0,
            delay: 500
        },
        ji = '[data-dismiss="toast"]',
        Pi = function() {
            function o(e, t) {
                this._element = e, this._config = this._getConfig(t), this._timeout = null, this._setListeners()
            }
            var e = o.prototype;
            return e.show = function() {
                var e = this;
                p(this._element).trigger(Ei.SHOW), this._config.animation && this._element.classList.add(Ai);
                var t = function() {
                    e._element.classList.remove(Di), e._element.classList.add(Ii), p(e._element).trigger(Ei.SHOWN), e._config.autohide && e.hide()
                };
                if (this._element.classList.remove($i), this._element.classList.add(Di), this._config.animation) {
                    var i = f.getTransitionDurationFromElement(this._element);
                    p(this._element).one(f.TRANSITION_END, t).emulateTransitionEnd(i)
                } else t()
            }, e.hide = function(e) {
                var t = this;
                this._element.classList.contains(Ii) && (p(this._element).trigger(Ei.HIDE), e ? this._close() : this._timeout = setTimeout(function() {
                    t._close()
                }, this._config.delay))
            }, e.dispose = function() {
                clearTimeout(this._timeout), this._timeout = null, this._element.classList.contains(Ii) && this._element.classList.remove(Ii), p(this._element).off(Ei.CLICK_DISMISS), p.removeData(this._element, xi), this._element = null, this._config = null
            }, e._getConfig = function(e) {
                return e = l({}, zi, p(this._element).data(), "object" == typeof e && e ? e : {}), f.typeCheckConfig(Ci, e, this.constructor.DefaultType), e
            }, e._setListeners = function() {
                var e = this;
                p(this._element).on(Ei.CLICK_DISMISS, ji, function() {
                    return e.hide(!0)
                })
            }, e._close = function() {
                var e = this,
                    t = function() {
                        e._element.classList.add($i), p(e._element).trigger(Ei.HIDDEN)
                    };
                if (this._element.classList.remove(Ii), this._config.animation) {
                    var i = f.getTransitionDurationFromElement(this._element);
                    p(this._element).one(f.TRANSITION_END, t).emulateTransitionEnd(i)
                } else t()
            }, o._jQueryInterface = function(i) {
                return this.each(function() {
                    var e = p(this),
                        t = e.data(xi);
                    if (t || (t = new o(this, "object" == typeof i && i), e.data(xi, t)), "string" == typeof i) {
                        if (void 0 === t[i]) throw new TypeError('No method named "' + i + '"');
                        t[i](this)
                    }
                })
            }, s(o, null, [{
                key: "VERSION",
                get: function() {
                    return "4.3.1"
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return Oi
                }
            }, {
                key: "Default",
                get: function() {
                    return zi
                }
            }]), o
        }();
    p.fn[Ci] = Pi._jQueryInterface, p.fn[Ci].Constructor = Pi, p.fn[Ci].noConflict = function() {
            return p.fn[Ci] = Ti, Pi._jQueryInterface
        },
        function() {
            if (void 0 === p) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
            var e = p.fn.jquery.split(" ")[0].split(".");
            if (e[0] < 2 && e[1] < 9 || 1 === e[0] && 9 === e[1] && e[2] < 1 || 4 <= e[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
        }(), e.Util = f, e.Alert = v, e.Button = O, e.Carousel = te, e.Collapse = ge, e.Dropdown = Ue, e.Modal = at, e.Popover = Yt, e.Scrollspy = ai, e.Tab = ki, e.Toast = Pi, e.Tooltip = Ot, Object.defineProperty(e, "__esModule", {
            value: !0
        })
}),
function() {
    var e = -1 < navigator.userAgent.toLowerCase().indexOf("webkit"),
        t = -1 < navigator.userAgent.toLowerCase().indexOf("opera"),
        i = -1 < navigator.userAgent.toLowerCase().indexOf("msie");
    (e || t || i) && document.getElementById && window.addEventListener && window.addEventListener("hashchange", function() {
        var e, t = location.hash.substring(1);
        /^[A-z0-9_-]+$/.test(t) && (e = document.getElementById(t)) && (/^(?:a|select|input|button|textarea)$/i.test(e.tagName) || (e.tabIndex = -1), e.focus())
    }, !1)
}(), jQuery(document).ready(function(t) {
        var e = t(".home-new-slider");
        e.slick({
            dots: !0,
            infinite: !0,
            arrows: !1,
            autoplaySpeed: 4e3
        }), t(".home-solution-navbar li").on("click", function() {
            var e = t(this).index() + 1;
            t(".home-solution-navbar li,.home-solution-nav-content").removeClass("active"), t(this).addClass("active"), t(".solution-content-" + e).addClass("active")
        }), e.on("beforeChange", function() {
            t(".slick-slide, .slick-slide img.lazy").Lazy({
                scrollDirection: "horizontal"
            })
        })
    }), jQuery(function(e) {
        e(".lazy").Lazy({})
    }),
    function(e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e : e(jQuery, window, document)
    }(function(M) {
        var N, h, H, o, n, r, a, g, B, _, p, c, l, m, d, u, f, v, y, w, b, k, E, C, x, S, T, A, q, s, $, I, D, O, R, z, j, P, L, W, U, F, Y, X, V, K, Q, G, Z, J, ee, te, ie, oe, ne, ae, se, e, t, i;
        e = "function" == typeof define && define.amd, t = "undefined" != typeof module && module.exports, i = "https:" == document.location.protocol ? "https:" : "http:", e || (t ? require("jquery-mousewheel")(M) : M.event.special.mousewheel || M("head").append(decodeURI("%3Cscript src=" + i + "//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js%3E%3C/script%3E"))), h = "mCustomScrollbar", H = "mCS", o = ".mCustomScrollbar", n = {
            setTop: 0,
            setLeft: 0,
            axis: "y",
            scrollbarPosition: "inside",
            scrollInertia: 950,
            autoDraggerLength: !0,
            alwaysShowScrollbar: 0,
            snapOffset: 0,
            mouseWheel: {
                enable: !0,
                scrollAmount: "auto",
                axis: "y",
                deltaFactor: "auto",
                disableOver: ["select", "option", "keygen", "datalist", "textarea"]
            },
            scrollButtons: {
                scrollType: "stepless",
                scrollAmount: "auto"
            },
            keyboard: {
                enable: !0,
                scrollType: "stepless",
                scrollAmount: "auto"
            },
            contentTouchScroll: 25,
            documentTouchScroll: !0,
            advanced: {
                autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
                updateOnContentResize: !0,
                updateOnImageLoad: "auto",
                autoUpdateTimeout: 60
            },
            theme: "light",
            callbacks: {
                onTotalScrollOffset: 0,
                onTotalScrollBackOffset: 0,
                alwaysTriggerOffsets: !0
            }
        }, r = 0, a = {}, g = window.attachEvent && !window.addEventListener ? 1 : 0, B = !1, _ = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight"], p = {
            init: function(s) {
                var s = M.extend(!0, {}, n, s),
                    e = c.call(this);
                if (s.live) {
                    var t = s.liveSelector || this.selector || o,
                        i = M(t);
                    if ("off" === s.live) return void m(t);
                    a[t] = setTimeout(function() {
                        i.mCustomScrollbar(s), "once" === s.live && i.length && m(t)
                    }, 500)
                } else m(t);
                return s.setWidth = s.set_width ? s.set_width : s.setWidth, s.setHeight = s.set_height ? s.set_height : s.setHeight, s.axis = s.horizontalScroll ? "x" : d(s.axis), s.scrollInertia = 0 < s.scrollInertia && s.scrollInertia < 17 ? 17 : s.scrollInertia, "object" != typeof s.mouseWheel && 1 == s.mouseWheel && (s.mouseWheel = {
                    enable: !0,
                    scrollAmount: "auto",
                    axis: "y",
                    preventDefault: !1,
                    deltaFactor: "auto",
                    normalizeDelta: !1,
                    invert: !1
                }), s.mouseWheel.scrollAmount = s.mouseWheelPixels ? s.mouseWheelPixels : s.mouseWheel.scrollAmount, s.mouseWheel.normalizeDelta = s.advanced.normalizeMouseWheelDelta ? s.advanced.normalizeMouseWheelDelta : s.mouseWheel.normalizeDelta, s.scrollButtons.scrollType = u(s.scrollButtons.scrollType), l(s), M(e).each(function() {
                    var e = M(this);
                    if (!e.data(H)) {
                        e.data(H, {
                            idx: ++r,
                            opt: s,
                            scrollRatio: {
                                y: null,
                                x: null
                            },
                            overflowed: null,
                            contentReset: {
                                y: null,
                                x: null
                            },
                            bindEvents: !1,
                            tweenRunning: !1,
                            sequential: {},
                            langDir: e.css("direction"),
                            cbOffsets: null,
                            trigger: null,
                            poll: {
                                size: {
                                    o: 0,
                                    n: 0
                                },
                                img: {
                                    o: 0,
                                    n: 0
                                },
                                change: {
                                    o: 0,
                                    n: 0
                                }
                            }
                        });
                        var t = e.data(H),
                            i = t.opt,
                            o = e.data("mcs-axis"),
                            n = e.data("mcs-scrollbar-position"),
                            a = e.data("mcs-theme");
                        o && (i.axis = o), n && (i.scrollbarPosition = n), a && (i.theme = a, l(i)), f.call(this), t && i.callbacks.onCreate && "function" == typeof i.callbacks.onCreate && i.callbacks.onCreate.call(this), M("#mCSB_" + t.idx + "_container img:not(." + _[2] + ")").addClass(_[2]), p.update.call(null, e)
                    }
                })
            },
            update: function(e, r) {
                var t = e || c.call(this);
                return M(t).each(function() {
                    var e = M(this);
                    if (e.data(H)) {
                        var t = e.data(H),
                            i = t.opt,
                            o = M("#mCSB_" + t.idx + "_container"),
                            n = M("#mCSB_" + t.idx),
                            a = [M("#mCSB_" + t.idx + "_dragger_vertical"), M("#mCSB_" + t.idx + "_dragger_horizontal")];
                        if (!o.length) return;
                        t.tweenRunning && Q(e), r && t && i.callbacks.onBeforeUpdate && "function" == typeof i.callbacks.onBeforeUpdate && i.callbacks.onBeforeUpdate.call(this), e.hasClass(_[3]) && e.removeClass(_[3]), e.hasClass(_[4]) && e.removeClass(_[4]), n.css("max-height", "none"), n.height() !== e.height() && n.css("max-height", e.height()), y.call(this), "y" === i.axis || i.advanced.autoExpandHorizontalScroll || o.css("width", v(o)), t.overflowed = C.call(this), A.call(this), i.autoDraggerLength && b.call(this), k.call(this), S.call(this);
                        var s = [Math.abs(o[0].offsetTop), Math.abs(o[0].offsetLeft)];
                        "x" !== i.axis && (t.overflowed[0] ? a[0].height() > a[0].parent().height() ? x.call(this) : (G(e, s[0].toString(), {
                            dir: "y",
                            dur: 0,
                            overwrite: "none"
                        }), t.contentReset.y = null) : (x.call(this), "y" === i.axis ? T.call(this) : "yx" === i.axis && t.overflowed[1] && G(e, s[1].toString(), {
                            dir: "x",
                            dur: 0,
                            overwrite: "none"
                        }))), "y" !== i.axis && (t.overflowed[1] ? a[1].width() > a[1].parent().width() ? x.call(this) : (G(e, s[1].toString(), {
                            dir: "x",
                            dur: 0,
                            overwrite: "none"
                        }), t.contentReset.x = null) : (x.call(this), "x" === i.axis ? T.call(this) : "yx" === i.axis && t.overflowed[0] && G(e, s[0].toString(), {
                            dir: "y",
                            dur: 0,
                            overwrite: "none"
                        }))), r && t && (2 === r && i.callbacks.onImageLoad && "function" == typeof i.callbacks.onImageLoad ? i.callbacks.onImageLoad.call(this) : 3 === r && i.callbacks.onSelectorChange && "function" == typeof i.callbacks.onSelectorChange ? i.callbacks.onSelectorChange.call(this) : i.callbacks.onUpdate && "function" == typeof i.callbacks.onUpdate && i.callbacks.onUpdate.call(this)), K.call(this)
                    }
                })
            },
            scrollTo: function(r, l) {
                if (void 0 !== r && null != r) {
                    var e = c.call(this);
                    return M(e).each(function() {
                        var e = M(this);
                        if (e.data(H)) {
                            var t = e.data(H),
                                i = t.opt,
                                o = {
                                    trigger: "external",
                                    scrollInertia: i.scrollInertia,
                                    scrollEasing: "mcsEaseInOut",
                                    moveDragger: !1,
                                    timeout: 60,
                                    callbacks: !0,
                                    onStart: !0,
                                    onUpdate: !0,
                                    onComplete: !0
                                },
                                n = M.extend(!0, {}, o, l),
                                a = X.call(this, r),
                                s = 0 < n.scrollInertia && n.scrollInertia < 17 ? 17 : n.scrollInertia;
                            a[0] = V.call(this, a[0], "y"), a[1] = V.call(this, a[1], "x"), n.moveDragger && (a[0] *= t.scrollRatio.y, a[1] *= t.scrollRatio.x), n.dur = se() ? 0 : s, setTimeout(function() {
                                null !== a[0] && void 0 !== a[0] && "x" !== i.axis && t.overflowed[0] && (n.dir = "y", n.overwrite = "all", G(e, a[0].toString(), n)), null !== a[1] && void 0 !== a[1] && "y" !== i.axis && t.overflowed[1] && (n.dir = "x", n.overwrite = "none", G(e, a[1].toString(), n))
                            }, n.timeout)
                        }
                    })
                }
            },
            stop: function() {
                var e = c.call(this);
                return M(e).each(function() {
                    var e = M(this);
                    e.data(H) && Q(e)
                })
            },
            disable: function(t) {
                var e = c.call(this);
                return M(e).each(function() {
                    var e = M(this);
                    e.data(H) && (e.data(H), K.call(this, "remove"), T.call(this), t && x.call(this), A.call(this, !0), e.addClass(_[3]))
                })
            },
            destroy: function() {
                var s = c.call(this);
                return M(s).each(function() {
                    var e = M(this);
                    if (e.data(H)) {
                        var t = e.data(H),
                            i = t.opt,
                            o = M("#mCSB_" + t.idx),
                            n = M("#mCSB_" + t.idx + "_container"),
                            a = M(".mCSB_" + t.idx + "_scrollbar");
                        i.live && m(i.liveSelector || M(s).selector), K.call(this, "remove"), T.call(this), x.call(this), e.removeData(H), te(this, "mcs"), a.remove(), n.find("img." + _[2]).removeClass(_[2]), o.replaceWith(n.contents()), e.removeClass(h + " _" + H + "_" + t.idx + " " + _[6] + " " + _[7] + " " + _[5] + " " + _[3]).addClass(_[4])
                    }
                })
            }
        }, c = function() {
            return "object" != typeof M(this) || M(this).length < 1 ? o : this
        }, l = function(e) {
            e.autoDraggerLength = !(-1 < M.inArray(e.theme, ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"])) && e.autoDraggerLength, e.autoExpandScrollbar = !(-1 < M.inArray(e.theme, ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"])) && e.autoExpandScrollbar, e.scrollButtons.enable = !(-1 < M.inArray(e.theme, ["minimal", "minimal-dark"])) && e.scrollButtons.enable, e.autoHideScrollbar = -1 < M.inArray(e.theme, ["minimal", "minimal-dark"]) || e.autoHideScrollbar, e.scrollbarPosition = -1 < M.inArray(e.theme, ["minimal", "minimal-dark"]) ? "outside" : e.scrollbarPosition
        }, m = function(e) {
            a[e] && (clearTimeout(a[e]), te(a, e))
        }, d = function(e) {
            return "yx" === e || "xy" === e || "auto" === e ? "yx" : "x" === e || "horizontal" === e ? "x" : "y"
        }, u = function(e) {
            return "stepped" === e || "pixels" === e || "step" === e || "click" === e ? "stepped" : "stepless"
        }, f = function() {
            var e = M(this),
                t = e.data(H),
                i = t.opt,
                o = i.autoExpandScrollbar ? " " + _[1] + "_expand" : "",
                n = ["<div id='mCSB_" + t.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + t.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_vertical" + o + "'><div class='" + _[12] + "'><div id='mCSB_" + t.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + t.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + t.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_horizontal" + o + "'><div class='" + _[12] + "'><div id='mCSB_" + t.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
                a = "yx" === i.axis ? "mCSB_vertical_horizontal" : "x" === i.axis ? "mCSB_horizontal" : "mCSB_vertical",
                s = "yx" === i.axis ? n[0] + n[1] : "x" === i.axis ? n[1] : n[0],
                r = "yx" === i.axis ? "<div id='mCSB_" + t.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "",
                l = i.autoHideScrollbar ? " " + _[6] : "",
                c = "x" !== i.axis && "rtl" === t.langDir ? " " + _[7] : "";
            i.setWidth && e.css("width", i.setWidth), i.setHeight && e.css("height", i.setHeight), i.setLeft = "y" !== i.axis && "rtl" === t.langDir ? "989999px" : i.setLeft, e.addClass(h + " _" + H + "_" + t.idx + l + c).wrapInner("<div id='mCSB_" + t.idx + "' class='mCustomScrollBox mCS-" + i.theme + " " + a + "'><div id='mCSB_" + t.idx + "_container' class='mCSB_container' style='position:relative; top:" + i.setTop + "; left:" + i.setLeft + ";' dir='" + t.langDir + "' /></div>");
            var m = M("#mCSB_" + t.idx),
                d = M("#mCSB_" + t.idx + "_container");
            "y" === i.axis || i.advanced.autoExpandHorizontalScroll || d.css("width", v(d)), "outside" === i.scrollbarPosition ? ("static" === e.css("position") && e.css("position", "relative"), e.css("overflow", "visible"), m.addClass("mCSB_outside").after(s)) : (m.addClass("mCSB_inside").append(s), d.wrap(r)), w.call(this);
            var u = [M("#mCSB_" + t.idx + "_dragger_vertical"), M("#mCSB_" + t.idx + "_dragger_horizontal")];
            u[0].css("min-height", u[0].height()), u[1].css("min-width", u[1].width())
        }, v = function(e) {
            var t = [e[0].scrollWidth, Math.max.apply(Math, e.children().map(function() {
                    return M(this).outerWidth(!0)
                }).get())],
                i = e.parent().width();
            return i < t[0] ? t[0] : i < t[1] ? t[1] : "100%"
        }, y = function() {
            var e = M(this),
                t = e.data(H),
                i = t.opt,
                o = M("#mCSB_" + t.idx + "_container");
            if (i.advanced.autoExpandHorizontalScroll && "y" !== i.axis) {
                o.css({
                    width: "auto",
                    "min-width": 0,
                    "overflow-x": "scroll"
                });
                var n = Math.ceil(o[0].scrollWidth);
                3 === i.advanced.autoExpandHorizontalScroll || 2 !== i.advanced.autoExpandHorizontalScroll && n > o.parent().width() ? o.css({
                    width: n,
                    "min-width": "100%",
                    "overflow-x": "inherit"
                }) : o.css({
                    "overflow-x": "inherit",
                    position: "absolute"
                }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
                    width: Math.ceil(o[0].getBoundingClientRect().right + .4) - Math.floor(o[0].getBoundingClientRect().left),
                    "min-width": "100%",
                    position: "relative"
                }).unwrap()
            }
        }, w = function() {
            var e = M(this),
                t = e.data(H),
                i = t.opt,
                o = M(".mCSB_" + t.idx + "_scrollbar:first"),
                n = ne(i.scrollButtons.tabindex) ? "tabindex='" + i.scrollButtons.tabindex + "'" : "",
                a = ["<a href='#' class='" + _[13] + "' " + n + " />", "<a href='#' class='" + _[14] + "' " + n + " />", "<a href='#' class='" + _[15] + "' " + n + " />", "<a href='#' class='" + _[16] + "' " + n + " />"],
                s = ["x" === i.axis ? a[2] : a[0], "x" === i.axis ? a[3] : a[1], a[2], a[3]];
            i.scrollButtons.enable && o.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3])
        }, b = function() {
            var e = M(this),
                t = e.data(H),
                i = M("#mCSB_" + t.idx),
                o = M("#mCSB_" + t.idx + "_container"),
                n = [M("#mCSB_" + t.idx + "_dragger_vertical"), M("#mCSB_" + t.idx + "_dragger_horizontal")],
                a = [i.height() / o.outerHeight(!1), i.width() / o.outerWidth(!1)],
                s = [parseInt(n[0].css("min-height")), Math.round(a[0] * n[0].parent().height()), parseInt(n[1].css("min-width")), Math.round(a[1] * n[1].parent().width())],
                r = g && s[1] < s[0] ? s[0] : s[1],
                l = g && s[3] < s[2] ? s[2] : s[3];
            n[0].css({
                height: r,
                "max-height": n[0].parent().height() - 10
            }).find(".mCSB_dragger_bar").css({
                "line-height": s[0] + "px"
            }), n[1].css({
                width: l,
                "max-width": n[1].parent().width() - 10
            })
        }, k = function() {
            var e = M(this),
                t = e.data(H),
                i = M("#mCSB_" + t.idx),
                o = M("#mCSB_" + t.idx + "_container"),
                n = [M("#mCSB_" + t.idx + "_dragger_vertical"), M("#mCSB_" + t.idx + "_dragger_horizontal")],
                a = [o.outerHeight(!1) - i.height(), o.outerWidth(!1) - i.width()],
                s = [a[0] / (n[0].parent().height() - n[0].height()), a[1] / (n[1].parent().width() - n[1].width())];
            t.scrollRatio = {
                y: s[0],
                x: s[1]
            }
        }, E = function(e, t, i) {
            var o = i ? _[0] + "_expanded" : "",
                n = e.closest(".mCSB_scrollTools");
            "active" === t ? (e.toggleClass(_[0] + " " + o), n.toggleClass(_[1]), e[0]._draggable = e[0]._draggable ? 0 : 1) : e[0]._draggable || ("hide" === t ? (e.removeClass(_[0]), n.removeClass(_[1])) : (e.addClass(_[0]), n.addClass(_[1])))
        }, C = function() {
            var e = M(this),
                t = e.data(H),
                i = M("#mCSB_" + t.idx),
                o = M("#mCSB_" + t.idx + "_container"),
                n = null == t.overflowed ? o.height() : o.outerHeight(!1),
                a = null == t.overflowed ? o.width() : o.outerWidth(!1),
                s = o[0].scrollHeight,
                r = o[0].scrollWidth;
            return n < s && (n = s), a < r && (a = r), [n > i.height(), a > i.width()]
        }, x = function() {
            var e = M(this),
                t = e.data(H),
                i = t.opt,
                o = M("#mCSB_" + t.idx),
                n = M("#mCSB_" + t.idx + "_container"),
                a = [M("#mCSB_" + t.idx + "_dragger_vertical"), M("#mCSB_" + t.idx + "_dragger_horizontal")];
            if (Q(e), ("x" !== i.axis && !t.overflowed[0] || "y" === i.axis && t.overflowed[0]) && (a[0].add(n).css("top", 0), G(e, "_resetY")), "y" !== i.axis && !t.overflowed[1] || "x" === i.axis && t.overflowed[1]) {
                var s = dx = 0;
                "rtl" === t.langDir && (s = o.width() - n.outerWidth(!1), dx = Math.abs(s / t.scrollRatio.x)), n.css("left", s), a[1].css("left", dx), G(e, "_resetX")
            }
        }, S = function() {
            var t = M(this),
                e = t.data(H),
                i = e.opt;
            if (!e.bindEvents) {
                var o;
                if (s.call(this), i.contentTouchScroll && $.call(this), I.call(this), i.mouseWheel.enable) ! function e() {
                    o = setTimeout(function() {
                        M.event.special.mousewheel ? (clearTimeout(o), D.call(t[0])) : e()
                    }, 100)
                }();
                P.call(this), W.call(this), i.advanced.autoScrollOnFocus && L.call(this), i.scrollButtons.enable && U.call(this), i.keyboard.enable && F.call(this), e.bindEvents = !0
            }
        }, T = function() {
            var e = M(this),
                t = e.data(H),
                i = t.opt,
                o = "mCS_" + t.idx,
                n = ".mCSB_" + t.idx + "_scrollbar",
                a = M("#mCSB_" + t.idx + ",#mCSB_" + t.idx + "_container,#mCSB_" + t.idx + "_container_wrapper," + n + " ." + _[12] + ",#mCSB_" + t.idx + "_dragger_vertical,#mCSB_" + t.idx + "_dragger_horizontal," + n + ">a"),
                s = M("#mCSB_" + t.idx + "_container");
            i.advanced.releaseDraggableSelectors && a.add(M(i.advanced.releaseDraggableSelectors)), i.advanced.extraDraggableSelectors && a.add(M(i.advanced.extraDraggableSelectors)), t.bindEvents && (M(document).add(M(!R() || top.document)).unbind("." + o), a.each(function() {
                M(this).unbind("." + o)
            }), clearTimeout(e[0]._focusTimeout), te(e[0], "_focusTimeout"), clearTimeout(t.sequential.step), te(t.sequential, "step"), clearTimeout(s[0].onCompleteTimeout), te(s[0], "onCompleteTimeout"), t.bindEvents = !1)
        }, A = function(e) {
            var t = M(this),
                i = t.data(H),
                o = i.opt,
                n = M("#mCSB_" + i.idx + "_container_wrapper"),
                a = n.length ? n : M("#mCSB_" + i.idx + "_container"),
                s = [M("#mCSB_" + i.idx + "_scrollbar_vertical"), M("#mCSB_" + i.idx + "_scrollbar_horizontal")],
                r = [s[0].find(".mCSB_dragger"), s[1].find(".mCSB_dragger")];
            "x" !== o.axis && (i.overflowed[0] && !e ? (s[0].add(r[0]).add(s[0].children("a")).css("display", "block"), a.removeClass(_[8] + " " + _[10])) : (o.alwaysShowScrollbar ? (2 !== o.alwaysShowScrollbar && r[0].css("display", "none"), a.removeClass(_[10])) : (s[0].css("display", "none"), a.addClass(_[10])), a.addClass(_[8]))), "y" !== o.axis && (i.overflowed[1] && !e ? (s[1].add(r[1]).add(s[1].children("a")).css("display", "block"), a.removeClass(_[9] + " " + _[11])) : (o.alwaysShowScrollbar ? (2 !== o.alwaysShowScrollbar && r[1].css("display", "none"), a.removeClass(_[11])) : (s[1].css("display", "none"), a.addClass(_[11])), a.addClass(_[9]))), i.overflowed[0] || i.overflowed[1] ? t.removeClass(_[5]) : t.addClass(_[5])
        }, q = function(e) {
            var t = e.type,
                i = e.target.ownerDocument !== document && null !== frameElement ? [M(frameElement).offset().top, M(frameElement).offset().left] : null,
                o = R() && e.target.ownerDocument !== top.document && null !== frameElement ? [M(e.view.frameElement).offset().top, M(e.view.frameElement).offset().left] : [0, 0];
            switch (t) {
                case "pointerdown":
                case "MSPointerDown":
                case "pointermove":
                case "MSPointerMove":
                case "pointerup":
                case "MSPointerUp":
                    return i ? [e.originalEvent.pageY - i[0] + o[0], e.originalEvent.pageX - i[1] + o[1], !1] : [e.originalEvent.pageY, e.originalEvent.pageX, !1];
                case "touchstart":
                case "touchmove":
                case "touchend":
                    var n = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                        a = e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
                    return e.target.ownerDocument !== document ? [n.screenY, n.screenX, 1 < a] : [n.pageY, n.pageX, 1 < a];
                default:
                    return i ? [e.pageY - i[0] + o[0], e.pageX - i[1] + o[1], !1] : [e.pageY, e.pageX, !1]
            }
        }, s = function() {
            var s, r, l, c = M(this),
                m = c.data(H),
                d = m.opt,
                e = "mCS_" + m.idx,
                u = ["mCSB_" + m.idx + "_dragger_vertical", "mCSB_" + m.idx + "_dragger_horizontal"],
                h = M("#mCSB_" + m.idx + "_container"),
                t = M("#" + u[0] + ",#" + u[1]),
                i = d.advanced.releaseDraggableSelectors ? t.add(M(d.advanced.releaseDraggableSelectors)) : t,
                o = d.advanced.extraDraggableSelectors ? M(!R() || top.document).add(M(d.advanced.extraDraggableSelectors)) : M(!R() || top.document);

            function n(e, t, i, o) {
                if (h[0].idleTimer = d.scrollInertia < 233 ? 250 : 0, s.attr("id") === u[1]) var n = "x",
                    a = (s[0].offsetLeft - t + o) * m.scrollRatio.x;
                else var n = "y",
                    a = (s[0].offsetTop - e + i) * m.scrollRatio.y;
                G(c, a.toString(), {
                    dir: n,
                    drag: !0
                })
            }
            t.bind("contextmenu." + e, function(e) {
                e.preventDefault()
            }).bind("mousedown." + e + " touchstart." + e + " pointerdown." + e + " MSPointerDown." + e, function(e) {
                if (e.stopImmediatePropagation(), e.preventDefault(), ie(e)) {
                    B = !0, g && (document.onselectstart = function() {
                        return !1
                    }), z.call(h, !1), Q(c);
                    var t = (s = M(this)).offset(),
                        i = q(e)[0] - t.top,
                        o = q(e)[1] - t.left,
                        n = s.height() + t.top,
                        a = s.width() + t.left;
                    i < n && 0 < i && o < a && 0 < o && (r = i, l = o), E(s, "active", d.autoExpandScrollbar)
                }
            }).bind("touchmove." + e, function(e) {
                e.stopImmediatePropagation(), e.preventDefault();
                var t = s.offset(),
                    i = q(e)[0] - t.top,
                    o = q(e)[1] - t.left;
                n(r, l, i, o)
            }), M(document).add(o).bind("mousemove." + e + " pointermove." + e + " MSPointerMove." + e, function(e) {
                if (s) {
                    var t = s.offset(),
                        i = q(e)[0] - t.top,
                        o = q(e)[1] - t.left;
                    if (r === i && l === o) return;
                    n(r, l, i, o)
                }
            }).add(i).bind("mouseup." + e + " touchend." + e + " pointerup." + e + " MSPointerUp." + e, function(e) {
                s && (E(s, "active", d.autoExpandScrollbar), s = null), B = !1, g && (document.onselectstart = null), z.call(h, !0)
            })
        }, $ = function() {
            var m, c, d, u, h, p, f, g, v, y, w, b, _, k, C = M(this),
                x = C.data(H),
                S = x.opt,
                e = "mCS_" + x.idx,
                T = M("#mCSB_" + x.idx),
                E = M("#mCSB_" + x.idx + "_container"),
                A = [M("#mCSB_" + x.idx + "_dragger_vertical"), M("#mCSB_" + x.idx + "_dragger_horizontal")],
                $ = [],
                I = [],
                D = 0,
                O = "yx" === S.axis ? "none" : "all",
                z = [],
                t = E.find("iframe"),
                i = ["touchstart." + e + " pointerdown." + e + " MSPointerDown." + e, "touchmove." + e + " pointermove." + e + " MSPointerMove." + e, "touchend." + e + " pointerup." + e + " MSPointerUp." + e],
                j = void 0 !== document.body.style.touchAction && "" !== document.body.style.touchAction;

            function o(e) {
                if (!oe(e) || B || q(e)[2]) N = 0;
                else {
                    k = _ = 0, m = N = 1, C.removeClass("mCS_touch_action");
                    var t = E.offset();
                    c = q(e)[0] - t.top, d = q(e)[1] - t.left, z = [q(e)[0], q(e)[1]]
                }
            }

            function n(e) {
                if (oe(e) && !B && !q(e)[2] && (S.documentTouchScroll || e.preventDefault(), e.stopImmediatePropagation(), (!k || _) && m)) {
                    f = J();
                    var t = T.offset(),
                        i = q(e)[0] - t.top,
                        o = q(e)[1] - t.left,
                        n = "mcsLinearOut";
                    if ($.push(i), I.push(o), z[2] = Math.abs(q(e)[0] - z[0]), z[3] = Math.abs(q(e)[1] - z[1]), x.overflowed[0]) var a = A[0].parent().height() - A[0].height(),
                        s = 0 < c - i && i - c > -a * x.scrollRatio.y && (2 * z[3] < z[2] || "yx" === S.axis);
                    if (x.overflowed[1]) var r = A[1].parent().width() - A[1].width(),
                        l = 0 < d - o && o - d > -r * x.scrollRatio.x && (2 * z[2] < z[3] || "yx" === S.axis);
                    s || l ? (j || e.preventDefault(), _ = 1) : (k = 1, C.addClass("mCS_touch_action")), j && e.preventDefault(), w = "yx" === S.axis ? [c - i, d - o] : "x" === S.axis ? [null, d - o] : [c - i, null], E[0].idleTimer = 250, x.overflowed[0] && L(w[0], D, n, "y", "all", !0), x.overflowed[1] && L(w[1], D, n, "x", O, !0)
                }
            }

            function a(e) {
                if (!oe(e) || B || q(e)[2]) N = 0;
                else {
                    N = 1, e.stopImmediatePropagation(), Q(C), p = J();
                    var t = T.offset();
                    u = q(e)[0] - t.top, h = q(e)[1] - t.left, $ = [], I = []
                }
            }

            function s(e) {
                if (oe(e) && !B && !q(e)[2]) {
                    m = 0, e.stopImmediatePropagation(), k = _ = 0, g = J();
                    var t = T.offset(),
                        i = q(e)[0] - t.top,
                        o = q(e)[1] - t.left;
                    if (!(30 < g - f)) {
                        var n = "mcsEaseOut",
                            a = (y = 1e3 / (g - p)) < 2.5,
                            s = a ? [$[$.length - 2], I[I.length - 2]] : [0, 0];
                        v = a ? [i - s[0], o - s[1]] : [i - u, o - h];
                        var r = [Math.abs(v[0]), Math.abs(v[1])];
                        y = a ? [Math.abs(v[0] / 4), Math.abs(v[1] / 4)] : [y, y];
                        var l = [Math.abs(E[0].offsetTop) - v[0] * P(r[0] / y[0], y[0]), Math.abs(E[0].offsetLeft) - v[1] * P(r[1] / y[1], y[1])];
                        w = "yx" === S.axis ? [l[0], l[1]] : "x" === S.axis ? [null, l[1]] : [l[0], null], b = [4 * r[0] + S.scrollInertia, 4 * r[1] + S.scrollInertia];
                        var c = parseInt(S.contentTouchScroll) || 0;
                        w[0] = c < r[0] ? w[0] : 0, w[1] = c < r[1] ? w[1] : 0, x.overflowed[0] && L(w[0], b[0], n, "y", O, !1), x.overflowed[1] && L(w[1], b[1], n, "x", O, !1)
                    }
                }
            }

            function P(e, t) {
                var i = [1.5 * t, 2 * t, t / 1.5, t / 2];
                return 90 < e ? 4 < t ? i[0] : i[3] : 60 < e ? 3 < t ? i[3] : i[2] : 30 < e ? 8 < t ? i[1] : 6 < t ? i[0] : 4 < t ? t : i[2] : 8 < t ? t : i[3]
            }

            function L(e, t, i, o, n, a) {
                e && G(C, e.toString(), {
                    dur: t,
                    scrollEasing: i,
                    dir: o,
                    overwrite: n,
                    drag: a
                })
            }
            E.bind(i[0], function(e) {
                o(e)
            }).bind(i[1], function(e) {
                n(e)
            }), T.bind(i[0], function(e) {
                a(e)
            }).bind(i[2], function(e) {
                s(e)
            }), t.length && t.each(function() {
                M(this).bind("load", function() {
                    R(this) && M(this.contentDocument || this.contentWindow.document).bind(i[0], function(e) {
                        o(e), a(e)
                    }).bind(i[1], function(e) {
                        n(e)
                    }).bind(i[2], function(e) {
                        s(e)
                    })
                })
            })
        }, I = function() {
            var n, o = M(this),
                a = o.data(H),
                s = a.opt,
                r = a.sequential,
                e = "mCS_" + a.idx,
                l = M("#mCSB_" + a.idx + "_container"),
                c = l.parent();

            function m(e, t, i) {
                r.type = i && n ? "stepped" : "stepless", r.scrollAmount = 10, Y(o, e, t, "mcsLinearOut", i ? 60 : null)
            }
            l.bind("mousedown." + e, function(e) {
                N || n || (n = 1, B = !0)
            }).add(document).bind("mousemove." + e, function(e) {
                if (!N && n && (window.getSelection ? window.getSelection().toString() : document.selection && "Control" != document.selection.type && document.selection.createRange().text)) {
                    var t = l.offset(),
                        i = q(e)[0] - t.top + l[0].offsetTop,
                        o = q(e)[1] - t.left + l[0].offsetLeft;
                    0 < i && i < c.height() && 0 < o && o < c.width() ? r.step && m("off", null, "stepped") : ("x" !== s.axis && a.overflowed[0] && (i < 0 ? m("on", 38) : i > c.height() && m("on", 40)), "y" !== s.axis && a.overflowed[1] && (o < 0 ? m("on", 37) : o > c.width() && m("on", 39)))
                }
            }).bind("mouseup." + e + " dragend." + e, function(e) {
                N || (n && (n = 0, m("off", null)), B = !1)
            })
        }, D = function() {
            if (M(this).data(H)) {
                var d = M(this),
                    u = d.data(H),
                    h = u.opt,
                    e = "mCS_" + u.idx,
                    p = M("#mCSB_" + u.idx),
                    f = [M("#mCSB_" + u.idx + "_dragger_vertical"), M("#mCSB_" + u.idx + "_dragger_horizontal")],
                    t = M("#mCSB_" + u.idx + "_container").find("iframe");
                t.length && t.each(function() {
                    M(this).bind("load", function() {
                        R(this) && M(this.contentDocument || this.contentWindow.document).bind("mousewheel." + e, function(e, t) {
                            i(e, t)
                        })
                    })
                }), p.bind("mousewheel." + e, function(e, t) {
                    i(e, t)
                })
            }

            function i(e, t) {
                if (Q(d), !j(d, e.target)) {
                    var i = "auto" !== h.mouseWheel.deltaFactor ? parseInt(h.mouseWheel.deltaFactor) : g && e.deltaFactor < 100 ? 100 : e.deltaFactor || 100,
                        o = h.scrollInertia;
                    if ("x" === h.axis || "x" === h.mouseWheel.axis) var n = "x",
                        a = [Math.round(i * u.scrollRatio.x), parseInt(h.mouseWheel.scrollAmount)],
                        s = "auto" !== h.mouseWheel.scrollAmount ? a[1] : a[0] >= p.width() ? .9 * p.width() : a[0],
                        r = Math.abs(M("#mCSB_" + u.idx + "_container")[0].offsetLeft),
                        l = f[1][0].offsetLeft,
                        c = f[1].parent().width() - f[1].width(),
                        m = "y" === h.mouseWheel.axis ? e.deltaY || t : e.deltaX;
                    else var n = "y",
                        a = [Math.round(i * u.scrollRatio.y), parseInt(h.mouseWheel.scrollAmount)],
                        s = "auto" !== h.mouseWheel.scrollAmount ? a[1] : a[0] >= p.height() ? .9 * p.height() : a[0],
                        r = Math.abs(M("#mCSB_" + u.idx + "_container")[0].offsetTop),
                        l = f[0][0].offsetTop,
                        c = f[0].parent().height() - f[0].height(),
                        m = e.deltaY || t;
                    "y" === n && !u.overflowed[0] || "x" === n && !u.overflowed[1] || ((h.mouseWheel.invert || e.webkitDirectionInvertedFromDevice) && (m = -m), h.mouseWheel.normalizeDelta && (m = m < 0 ? -1 : 1), (0 < m && 0 !== l || m < 0 && l !== c || h.mouseWheel.preventDefault) && (e.stopImmediatePropagation(), e.preventDefault()), e.deltaFactor < 5 && !h.mouseWheel.normalizeDelta && (s = e.deltaFactor, o = 17), G(d, (r - m * s).toString(), {
                        dir: n,
                        dur: o
                    }))
                }
            }
        }, O = new Object, R = function(e) {
            var t = !1,
                i = !1,
                o = null;
            if (void 0 === e ? i = "#empty" : void 0 !== M(e).attr("id") && (i = M(e).attr("id")), !1 !== i && void 0 !== O[i]) return O[i];
            if (e) {
                try {
                    var n = e.contentDocument || e.contentWindow.document;
                    o = n.body.innerHTML
                } catch (e) {}
                t = null !== o
            } else {
                try {
                    var n = top.document;
                    o = n.body.innerHTML
                } catch (e) {}
                t = null !== o
            }
            return !1 !== i && (O[i] = t), t
        }, z = function(e) {
            var t = this.find("iframe");
            if (t.length) {
                var i = e ? "auto" : "none";
                t.css("pointer-events", i)
            }
        }, j = function(e, t) {
            var i = t.nodeName.toLowerCase(),
                o = e.data(H).opt.mouseWheel.disableOver;
            return -1 < M.inArray(i, o) && !(-1 < M.inArray(i, ["select", "textarea"]) && !M(t).is(":focus"))
        }, P = function() {
            var s, r = M(this),
                l = r.data(H),
                e = "mCS_" + l.idx,
                c = M("#mCSB_" + l.idx + "_container"),
                m = c.parent(),
                t = M(".mCSB_" + l.idx + "_scrollbar ." + _[12]);
            t.bind("mousedown." + e + " touchstart." + e + " pointerdown." + e + " MSPointerDown." + e, function(e) {
                B = !0, M(e.target).hasClass("mCSB_dragger") || (s = 1)
            }).bind("touchend." + e + " pointerup." + e + " MSPointerUp." + e, function(e) {
                B = !1
            }).bind("click." + e, function(e) {
                if (s && (s = 0, M(e.target).hasClass(_[12]) || M(e.target).hasClass("mCSB_draggerRail"))) {
                    Q(r);
                    var t = M(this),
                        i = t.find(".mCSB_dragger");
                    if (0 < t.parent(".mCSB_scrollTools_horizontal").length) {
                        if (!l.overflowed[1]) return;
                        var o = "x",
                            n = e.pageX > i.offset().left ? -1 : 1,
                            a = Math.abs(c[0].offsetLeft) - n * (.9 * m.width())
                    } else {
                        if (!l.overflowed[0]) return;
                        var o = "y",
                            n = e.pageY > i.offset().top ? -1 : 1,
                            a = Math.abs(c[0].offsetTop) - n * (.9 * m.height())
                    }
                    G(r, a.toString(), {
                        dir: o,
                        scrollEasing: "mcsEaseInOut"
                    })
                }
            })
        }, L = function() {
            var a = M(this),
                e = a.data(H),
                s = e.opt,
                t = "mCS_" + e.idx,
                r = M("#mCSB_" + e.idx + "_container"),
                l = r.parent();
            r.bind("focusin." + t, function(e) {
                var n = M(document.activeElement),
                    t = r.find(".mCustomScrollBox").length;
                n.is(s.advanced.autoScrollOnFocus) && (Q(a), clearTimeout(a[0]._focusTimeout), a[0]._focusTimer = t ? 17 * t : 0, a[0]._focusTimeout = setTimeout(function() {
                    var e = [ae(n)[0], ae(n)[1]],
                        t = [r[0].offsetTop, r[0].offsetLeft],
                        i = [0 <= t[0] + e[0] && t[0] + e[0] < l.height() - n.outerHeight(!1), 0 <= t[1] + e[1] && t[0] + e[1] < l.width() - n.outerWidth(!1)],
                        o = "yx" !== s.axis || i[0] || i[1] ? "all" : "none";
                    "x" === s.axis || i[0] || G(a, e[0].toString(), {
                        dir: "y",
                        scrollEasing: "mcsEaseInOut",
                        overwrite: o,
                        dur: 0
                    }), "y" === s.axis || i[1] || G(a, e[1].toString(), {
                        dir: "x",
                        scrollEasing: "mcsEaseInOut",
                        overwrite: o,
                        dur: 0
                    })
                }, a[0]._focusTimer))
            })
        }, W = function() {
            var e = M(this),
                t = e.data(H),
                i = "mCS_" + t.idx,
                o = M("#mCSB_" + t.idx + "_container").parent();
            o.bind("scroll." + i, function(e) {
                0 === o.scrollTop() && 0 === o.scrollLeft() || M(".mCSB_" + t.idx + "_scrollbar").css("visibility", "hidden")
            })
        }, U = function() {
            var o = M(this),
                n = o.data(H),
                a = n.opt,
                s = n.sequential,
                e = "mCS_" + n.idx,
                t = ".mCSB_" + n.idx + "_scrollbar",
                i = M(t + ">a");
            i.bind("contextmenu." + e, function(e) {
                e.preventDefault()
            }).bind("mousedown." + e + " touchstart." + e + " pointerdown." + e + " MSPointerDown." + e + " mouseup." + e + " touchend." + e + " pointerup." + e + " MSPointerUp." + e + " mouseout." + e + " pointerout." + e + " MSPointerOut." + e + " click." + e, function(e) {
                if (e.preventDefault(), ie(e)) {
                    var t = M(this).attr("class");
                    switch (s.type = a.scrollButtons.scrollType, e.type) {
                        case "mousedown":
                        case "touchstart":
                        case "pointerdown":
                        case "MSPointerDown":
                            if ("stepped" === s.type) return;
                            B = !0, n.tweenRunning = !1, i("on", t);
                            break;
                        case "mouseup":
                        case "touchend":
                        case "pointerup":
                        case "MSPointerUp":
                        case "mouseout":
                        case "pointerout":
                        case "MSPointerOut":
                            if ("stepped" === s.type) return;
                            B = !1, s.dir && i("off", t);
                            break;
                        case "click":
                            if ("stepped" !== s.type || n.tweenRunning) return;
                            i("on", t)
                    }
                }

                function i(e, t) {
                    s.scrollAmount = a.scrollButtons.scrollAmount, Y(o, e, t)
                }
            })
        }, F = function() {
            var r = M(this),
                l = r.data(H),
                c = l.opt,
                m = l.sequential,
                e = "mCS_" + l.idx,
                t = M("#mCSB_" + l.idx),
                d = M("#mCSB_" + l.idx + "_container"),
                u = d.parent(),
                h = "input,textarea,select,datalist,keygen,[contenteditable='true']",
                i = d.find("iframe"),
                o = ["blur." + e + " keydown." + e + " keyup." + e];

            function n(e) {
                switch (e.type) {
                    case "blur":
                        l.tweenRunning && m.dir && s("off", null);
                        break;
                    case "keydown":
                    case "keyup":
                        var t = e.keyCode ? e.keyCode : e.which,
                            i = "on";
                        if ("x" !== c.axis && (38 === t || 40 === t) || "y" !== c.axis && (37 === t || 39 === t)) {
                            if ((38 === t || 40 === t) && !l.overflowed[0] || (37 === t || 39 === t) && !l.overflowed[1]) return;
                            "keyup" === e.type && (i = "off"), M(document.activeElement).is(h) || (e.preventDefault(), e.stopImmediatePropagation(), s(i, t))
                        } else if (33 === t || 34 === t) {
                            if ((l.overflowed[0] || l.overflowed[1]) && (e.preventDefault(), e.stopImmediatePropagation()), "keyup" === e.type) {
                                Q(r);
                                var o = 34 === t ? -1 : 1;
                                if ("x" === c.axis || "yx" === c.axis && l.overflowed[1] && !l.overflowed[0]) var n = "x",
                                    a = Math.abs(d[0].offsetLeft) - o * (.9 * u.width());
                                else var n = "y",
                                    a = Math.abs(d[0].offsetTop) - o * (.9 * u.height());
                                G(r, a.toString(), {
                                    dir: n,
                                    scrollEasing: "mcsEaseInOut"
                                })
                            }
                        } else if ((35 === t || 36 === t) && !M(document.activeElement).is(h) && ((l.overflowed[0] || l.overflowed[1]) && (e.preventDefault(), e.stopImmediatePropagation()), "keyup" === e.type)) {
                            if ("x" === c.axis || "yx" === c.axis && l.overflowed[1] && !l.overflowed[0]) var n = "x",
                                a = 35 === t ? Math.abs(u.width() - d.outerWidth(!1)) : 0;
                            else var n = "y",
                                a = 35 === t ? Math.abs(u.height() - d.outerHeight(!1)) : 0;
                            G(r, a.toString(), {
                                dir: n,
                                scrollEasing: "mcsEaseInOut"
                            })
                        }
                }

                function s(e, t) {
                    m.type = c.keyboard.scrollType, m.scrollAmount = c.keyboard.scrollAmount, "stepped" === m.type && l.tweenRunning || Y(r, e, t)
                }
            }
            i.length && i.each(function() {
                M(this).bind("load", function() {
                    R(this) && M(this.contentDocument || this.contentWindow.document).bind(o[0], function(e) {
                        n(e)
                    })
                })
            }), t.attr("tabindex", "0").bind(o[0], function(e) {
                n(e)
            })
        }, Y = function(d, e, t, u, h) {
            var p = d.data(H),
                f = p.opt,
                g = p.sequential,
                v = M("#mCSB_" + p.idx + "_container"),
                i = "stepped" === g.type,
                y = f.scrollInertia < 26 ? 26 : f.scrollInertia,
                w = f.scrollInertia < 1 ? 17 : f.scrollInertia;
            switch (e) {
                case "on":
                    if (g.dir = [t === _[16] || t === _[15] || 39 === t || 37 === t ? "x" : "y", t === _[13] || t === _[15] || 38 === t || 37 === t ? -1 : 1], Q(d), ne(t) && "stepped" === g.type) return;
                    b(i);
                    break;
                case "off":
                    clearTimeout(g.step), te(g, "step"), Q(d), (i || p.tweenRunning && g.dir) && b(!0)
            }

            function b(e) {
                f.snapAmount && (g.scrollAmount = f.snapAmount instanceof Array ? "x" === g.dir[0] ? f.snapAmount[1] : f.snapAmount[0] : f.snapAmount);
                var t = "stepped" !== g.type,
                    i = h || (e ? t ? y / 1.5 : w : 1e3 / 60),
                    o = e ? t ? 7.5 : 40 : 2.5,
                    n = [Math.abs(v[0].offsetTop), Math.abs(v[0].offsetLeft)],
                    a = [10 < p.scrollRatio.y ? 10 : p.scrollRatio.y, 10 < p.scrollRatio.x ? 10 : p.scrollRatio.x],
                    s = "x" === g.dir[0] ? n[1] + g.dir[1] * (a[1] * o) : n[0] + g.dir[1] * (a[0] * o),
                    r = "x" === g.dir[0] ? n[1] + g.dir[1] * parseInt(g.scrollAmount) : n[0] + g.dir[1] * parseInt(g.scrollAmount),
                    l = "auto" !== g.scrollAmount ? r : s,
                    c = u || (e ? t ? "mcsLinearOut" : "mcsEaseInOut" : "mcsLinear"),
                    m = !!e;
                e && i < 17 && (l = "x" === g.dir[0] ? n[1] : n[0]), G(d, l.toString(), {
                    dir: g.dir[0],
                    scrollEasing: c,
                    dur: i,
                    onComplete: m
                }), e ? g.dir = !1 : (clearTimeout(g.step), g.step = setTimeout(function() {
                    b()
                }, i))
            }
        }, X = function(e) {
            var t = M(this).data(H).opt,
                i = [];
            return "function" == typeof e && (e = e()), e instanceof Array ? i = 1 < e.length ? [e[0], e[1]] : "x" === t.axis ? [null, e[0]] : [e[0], null] : (i[0] = e.y ? e.y : e.x || "x" === t.axis ? null : e, i[1] = e.x ? e.x : e.y || "y" === t.axis ? null : e), "function" == typeof i[0] && (i[0] = i[0]()), "function" == typeof i[1] && (i[1] = i[1]()), i
        }, V = function(e, t) {
            if (null != e && void 0 !== e) {
                var i = M(this),
                    o = i.data(H),
                    n = o.opt,
                    a = M("#mCSB_" + o.idx + "_container"),
                    s = a.parent(),
                    r = typeof e;
                t || (t = "x" === n.axis ? "x" : "y");
                var l = "x" === t ? a.outerWidth(!1) - s.width() : a.outerHeight(!1) - s.height(),
                    c = "x" === t ? a[0].offsetLeft : a[0].offsetTop,
                    m = "x" === t ? "left" : "top";
                switch (r) {
                    case "function":
                        return e();
                    case "object":
                        var d = e.jquery ? e : M(e);
                        if (!d.length) return;
                        return "x" === t ? ae(d)[1] : ae(d)[0];
                    case "string":
                    case "number":
                        if (ne(e)) return Math.abs(e);
                        if (-1 !== e.indexOf("%")) return Math.abs(l * parseInt(e) / 100);
                        if (-1 !== e.indexOf("-=")) return Math.abs(c - parseInt(e.split("-=")[1]));
                        if (-1 !== e.indexOf("+=")) {
                            var u = c + parseInt(e.split("+=")[1]);
                            return 0 <= u ? 0 : Math.abs(u)
                        }
                        if (-1 !== e.indexOf("px") && ne(e.split("px")[0])) return Math.abs(e.split("px")[0]);
                        if ("top" === e || "left" === e) return 0;
                        if ("bottom" === e) return Math.abs(s.height() - a.outerHeight(!1));
                        if ("right" === e) return Math.abs(s.width() - a.outerWidth(!1));
                        if ("first" === e || "last" === e) {
                            var d = a.find(":" + e);
                            return "x" === t ? ae(d)[1] : ae(d)[0]
                        }
                        return M(e).length ? "x" === t ? ae(M(e))[1] : ae(M(e))[0] : (a.css(m, e), void p.update.call(null, i[0]))
                }
            }
        }, K = function(e) {
            var t = M(this),
                i = t.data(H),
                o = i.opt,
                n = M("#mCSB_" + i.idx + "_container");
            if (e) return clearTimeout(n[0].autoUpdate), void te(n[0], "autoUpdate");

            function a(e) {
                clearTimeout(n[0].autoUpdate), p.update.call(null, t[0], e)
            }! function e() {
                clearTimeout(n[0].autoUpdate), 0 !== t.parents("html").length ? n[0].autoUpdate = setTimeout(function() {
                    return o.advanced.updateOnSelectorChange && (i.poll.change.n = function() {
                        !0 === o.advanced.updateOnSelectorChange && (o.advanced.updateOnSelectorChange = "*");
                        var e = 0,
                            t = n.find(o.advanced.updateOnSelectorChange);
                        return o.advanced.updateOnSelectorChange && 0 < t.length && t.each(function() {
                            e += this.offsetHeight + this.offsetWidth
                        }), e
                    }(), i.poll.change.n !== i.poll.change.o) ? (i.poll.change.o = i.poll.change.n, void a(3)) : o.advanced.updateOnContentResize && (i.poll.size.n = t[0].scrollHeight + t[0].scrollWidth + n[0].offsetHeight + t[0].offsetHeight + t[0].offsetWidth, i.poll.size.n !== i.poll.size.o) ? (i.poll.size.o = i.poll.size.n, void a(1)) : !o.advanced.updateOnImageLoad || "auto" === o.advanced.updateOnImageLoad && "y" === o.axis || (i.poll.img.n = n.find("img").length, i.poll.img.n === i.poll.img.o) ? void((o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad) && e()) : (i.poll.img.o = i.poll.img.n, void n.find("img").each(function() {
                        ! function(e) {
                            if (M(e).hasClass(_[2])) return a();
                            var t, i, o = new Image;
                            o.onload = (t = o, i = function() {
                                this.onload = null, M(e).addClass(_[2]), a(2)
                            }, function() {
                                return i.apply(t, arguments)
                            }), o.src = e.src
                        }(this)
                    }))
                }, o.advanced.autoUpdateTimeout) : t = null
            }()
        }, Q = function(e) {
            var t = e.data(H),
                i = M("#mCSB_" + t.idx + "_container,#mCSB_" + t.idx + "_container_wrapper,#mCSB_" + t.idx + "_dragger_vertical,#mCSB_" + t.idx + "_dragger_horizontal");
            i.each(function() {
                ee.call(this)
            })
        }, G = function(n, e, a) {
            var t = n.data(H),
                i = t.opt,
                o = {
                    trigger: "internal",
                    dir: "y",
                    scrollEasing: "mcsEaseOut",
                    drag: !1,
                    dur: i.scrollInertia,
                    overwrite: "all",
                    callbacks: !0,
                    onStart: !0,
                    onUpdate: !0,
                    onComplete: !0
                },
                a = M.extend(o, a),
                s = [a.dur, a.drag ? 0 : a.dur],
                r = M("#mCSB_" + t.idx),
                l = M("#mCSB_" + t.idx + "_container"),
                c = l.parent(),
                m = i.callbacks.onTotalScrollOffset ? X.call(n, i.callbacks.onTotalScrollOffset) : [0, 0],
                d = i.callbacks.onTotalScrollBackOffset ? X.call(n, i.callbacks.onTotalScrollBackOffset) : [0, 0];
            if (t.trigger = a.trigger, 0 === c.scrollTop() && 0 === c.scrollLeft() || (M(".mCSB_" + t.idx + "_scrollbar").css("visibility", "visible"), c.scrollTop(0).scrollLeft(0)), "_resetY" !== e || t.contentReset.y || (S("onOverflowYNone") && i.callbacks.onOverflowYNone.call(n[0]), t.contentReset.y = 1), "_resetX" !== e || t.contentReset.x || (S("onOverflowXNone") && i.callbacks.onOverflowXNone.call(n[0]), t.contentReset.x = 1), "_resetY" !== e && "_resetX" !== e) {
                if (!t.contentReset.y && n[0].mcs || !t.overflowed[0] || (S("onOverflowY") && i.callbacks.onOverflowY.call(n[0]), t.contentReset.x = null), !t.contentReset.x && n[0].mcs || !t.overflowed[1] || (S("onOverflowX") && i.callbacks.onOverflowX.call(n[0]), t.contentReset.x = null), i.snapAmount) {
                    var u = i.snapAmount instanceof Array ? "x" === a.dir ? i.snapAmount[1] : i.snapAmount[0] : i.snapAmount;
                    h = e, p = u, f = i.snapOffset, e = Math.round(h / p) * p - f
                }
                var h, p, f;
                switch (a.dir) {
                    case "x":
                        var g = M("#mCSB_" + t.idx + "_dragger_horizontal"),
                            v = "left",
                            y = l[0].offsetLeft,
                            w = [r.width() - l.outerWidth(!1), g.parent().width() - g.width()],
                            b = [e, 0 === e ? 0 : e / t.scrollRatio.x],
                            _ = m[1],
                            k = d[1],
                            C = 0 < _ ? _ / t.scrollRatio.x : 0,
                            x = 0 < k ? k / t.scrollRatio.x : 0;
                        break;
                    case "y":
                        var g = M("#mCSB_" + t.idx + "_dragger_vertical"),
                            v = "top",
                            y = l[0].offsetTop,
                            w = [r.height() - l.outerHeight(!1), g.parent().height() - g.height()],
                            b = [e, 0 === e ? 0 : e / t.scrollRatio.y],
                            _ = m[0],
                            k = d[0],
                            C = 0 < _ ? _ / t.scrollRatio.y : 0,
                            x = 0 < k ? k / t.scrollRatio.y : 0
                }
                b[1] < 0 || 0 === b[0] && 0 === b[1] ? b = [0, 0] : b[1] >= w[1] ? b = [w[0], w[1]] : b[0] = -b[0], n[0].mcs || (T(), S("onInit") && i.callbacks.onInit.call(n[0])), clearTimeout(l[0].onCompleteTimeout), Z(g[0], v, Math.round(b[1]), s[1], a.scrollEasing), !t.tweenRunning && (0 === y && 0 <= b[0] || y === w[0] && b[0] <= w[0]) || Z(l[0], v, Math.round(b[0]), s[0], a.scrollEasing, a.overwrite, {
                    onStart: function() {
                        a.callbacks && a.onStart && !t.tweenRunning && (S("onScrollStart") && (T(), i.callbacks.onScrollStart.call(n[0])), t.tweenRunning = !0, E(g), t.cbOffsets = [i.callbacks.alwaysTriggerOffsets || y >= w[0] + _, i.callbacks.alwaysTriggerOffsets || y <= -k])
                    },
                    onUpdate: function() {
                        a.callbacks && a.onUpdate && S("whileScrolling") && (T(), i.callbacks.whileScrolling.call(n[0]))
                    },
                    onComplete: function() {
                        if (a.callbacks && a.onComplete) {
                            "yx" === i.axis && clearTimeout(l[0].onCompleteTimeout);
                            var e = l[0].idleTimer || 0;
                            l[0].onCompleteTimeout = setTimeout(function() {
                                S("onScroll") && (T(), i.callbacks.onScroll.call(n[0])), S("onTotalScroll") && b[1] >= w[1] - C && t.cbOffsets[0] && (T(), i.callbacks.onTotalScroll.call(n[0])), S("onTotalScrollBack") && b[1] <= x && t.cbOffsets[1] && (T(), i.callbacks.onTotalScrollBack.call(n[0])), t.tweenRunning = !1, l[0].idleTimer = 0, E(g, "hide")
                            }, e)
                        }
                    }
                })
            }

            function S(e) {
                return t && i.callbacks[e] && "function" == typeof i.callbacks[e]
            }

            function T() {
                var e = [l[0].offsetTop, l[0].offsetLeft],
                    t = [g[0].offsetTop, g[0].offsetLeft],
                    i = [l.outerHeight(!1), l.outerWidth(!1)],
                    o = [r.height(), r.width()];
                n[0].mcs = {
                    content: l,
                    top: e[0],
                    left: e[1],
                    draggerTop: t[0],
                    draggerLeft: t[1],
                    topPct: Math.round(100 * Math.abs(e[0]) / (Math.abs(i[0]) - o[0])),
                    leftPct: Math.round(100 * Math.abs(e[1]) / (Math.abs(i[1]) - o[1])),
                    direction: a.dir
                }
            }
        }, Z = function(e, t, i, o, n, a, s) {
            e._mTween || (e._mTween = {
                top: {},
                left: {}
            });
            var r, l, s = s || {},
                c = s.onStart || function() {},
                m = s.onUpdate || function() {},
                d = s.onComplete || function() {},
                u = J(),
                h = 0,
                p = e.offsetTop,
                f = e.style,
                g = e._mTween[t];
            "left" === t && (p = e.offsetLeft);
            var v = i - p;

            function y() {
                g.stop || (h || c.call(), h = J() - u, w(), h >= g.time && (g.time = h > g.time ? h + r - (h - g.time) : h + r - 1, g.time < h + 1 && (g.time = h + 1)), g.time < o ? g.id = l(y) : d.call())
            }

            function w() {
                0 < o ? (g.currVal = function(e, t, i, o, n) {
                    switch (n) {
                        case "linear":
                        case "mcsLinear":
                            return i * e / o + t;
                        case "mcsLinearOut":
                            return e /= o, e--, i * Math.sqrt(1 - e * e) + t;
                        case "easeInOutSmooth":
                            return (e /= o / 2) < 1 ? i / 2 * e * e + t : -i / 2 * (--e * (e - 2) - 1) + t;
                        case "easeInOutStrong":
                            return (e /= o / 2) < 1 ? i / 2 * Math.pow(2, 10 * (e - 1)) + t : (e--, i / 2 * (2 - Math.pow(2, -10 * e)) + t);
                        case "easeInOut":
                        case "mcsEaseInOut":
                            return (e /= o / 2) < 1 ? i / 2 * e * e * e + t : i / 2 * ((e -= 2) * e * e + 2) + t;
                        case "easeOutSmooth":
                            return e /= o, -i * (--e * e * e * e - 1) + t;
                        case "easeOutStrong":
                            return i * (1 - Math.pow(2, -10 * e / o)) + t;
                        case "easeOut":
                        case "mcsEaseOut":
                        default:
                            var a = (e /= o) * e,
                                s = a * e;
                            return t + i * (.499999999999997 * s * a + -2.5 * a * a + 5.5 * s + -6.5 * a + 4 * e)
                    }
                }(g.time, p, v, o, n), f[t] = Math.round(g.currVal) + "px") : f[t] = i + "px", m.call()
            }
            g.stop = 0, "none" !== a && null != g.id && (window.requestAnimationFrame ? window.cancelAnimationFrame(g.id) : clearTimeout(g.id), g.id = null), r = 1e3 / 60, g.time = h + r, l = window.requestAnimationFrame ? window.requestAnimationFrame : function(e) {
                return w(), setTimeout(e, .01)
            }, g.id = l(y)
        }, J = function() {
            return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : Date.now ? Date.now() : (new Date).getTime()
        }, ee = function() {
            var e = this;
            e._mTween || (e._mTween = {
                top: {},
                left: {}
            });
            for (var t = ["top", "left"], i = 0; i < t.length; i++) {
                var o = t[i];
                e._mTween[o].id && (window.requestAnimationFrame ? window.cancelAnimationFrame(e._mTween[o].id) : clearTimeout(e._mTween[o].id), e._mTween[o].id = null, e._mTween[o].stop = 1)
            }
        }, te = function(t, i) {
            try {
                delete t[i]
            } catch (e) {
                t[i] = null
            }
        }, ie = function(e) {
            return !(e.which && 1 !== e.which)
        }, oe = function(e) {
            var t = e.originalEvent.pointerType;
            return !(t && "touch" !== t && 2 !== t)
        }, ne = function(e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        }, ae = function(e) {
            var t = e.parents(".mCSB_container");
            return [e.offset().top - t.offset().top, e.offset().left - t.offset().left]
        }, se = function() {
            var e = function() {
                var e = ["webkit", "moz", "ms", "o"];
                if ("hidden" in document) return "hidden";
                for (var t = 0; t < e.length; t++)
                    if (e[t] + "Hidden" in document) return e[t] + "Hidden";
                return null
            }();
            return !!e && document[e]
        }, M.fn[h] = function(e) {
            return p[e] ? p[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? void M.error("Method " + e + " does not exist") : p.init.apply(this, arguments)
        }, M[h] = function(e) {
            return p[e] ? p[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? void M.error("Method " + e + " does not exist") : p.init.apply(this, arguments)
        }, M[h].defaults = n, window[h] = !0, M(window).bind("load", function() {
            M(o)[h](), M.extend(M.expr[":"], {
                mcsInView: M.expr[":"].mcsInView || function(e) {
                    var t, i, o = M(e),
                        n = o.parents(".mCSB_container");
                    if (n.length) return t = n.parent(), 0 <= (i = [n[0].offsetTop, n[0].offsetLeft])[0] + ae(o)[0] && i[0] + ae(o)[0] < t.height() - o.outerHeight(!1) && 0 <= i[1] + ae(o)[1] && i[1] + ae(o)[1] < t.width() - o.outerWidth(!1)
                },
                mcsInSight: M.expr[":"].mcsInSight || function(e, t, i) {
                    var o, n, a, s, r = M(e),
                        l = r.parents(".mCSB_container"),
                        c = "exact" === i[3] ? [
                            [1, 0],
                            [1, 0]
                        ] : [
                            [.9, .1],
                            [.6, .4]
                        ];
                    if (l.length) return o = [r.outerHeight(!1), r.outerWidth(!1)], a = [l[0].offsetTop + ae(r)[0], l[0].offsetLeft + ae(r)[1]], n = [l.parent()[0].offsetHeight, l.parent()[0].offsetWidth], a[0] - n[0] * (s = [o[0] < n[0] ? c[0] : c[1], o[1] < n[1] ? c[0] : c[1]])[0][0] < 0 && 0 <= a[0] + o[0] - n[0] * s[0][1] && a[1] - n[1] * s[1][0] < 0 && 0 <= a[1] + o[1] - n[1] * s[1][1]
                },
                mcsOverflow: M.expr[":"].mcsOverflow || function(e) {
                    var t = M(e).data(H);
                    if (t) return t.overflowed[0] || t.overflowed[1]
                }
            })
        })
    }),
    function(j, h) {
        "use strict";

        function s(w, b, _, e, t) {
            function i() {
                var n, a, s, r;
                y = 1 < j.devicePixelRatio, _ = o(_), 0 <= b.delay && setTimeout(function() {
                    l(!0)
                }, b.delay), (b.delay < 0 || b.combined) && (e.e = (n = b.throttle, a = function(e) {
                    "resize" === e.type && (x = S = -1), l(e.all)
                }, r = 0, function(e, t) {
                    function i() {
                        r = +new Date, a.call(w, e)
                    }
                    var o = +new Date - r;
                    s && clearTimeout(s), n < o || !b.enableThrottle || t ? i() : s = setTimeout(i, n - o)
                }), e.a = function(e) {
                    e = o(e), _.push.apply(_, e)
                }, e.g = function() {
                    return _ = P(_).filter(function() {
                        return !P(this).data(b.loadedName)
                    })
                }, e.f = function(e) {
                    for (var t = 0; t < e.length; t++) {
                        var i = _.filter(function() {
                            return this === e[t]
                        });
                        i.length && l(!1, i)
                    }
                }, l(), P(b.appendScroll).on("scroll." + t + " resize." + t, e.e))
            }

            function o(e) {
                for (var t = b.defaultImage, i = b.placeholder, o = b.imageBase, n = b.srcsetAttribute, a = b.loaderAttribute, s = b._f || {}, r = 0, l = (e = P(e).filter(function() {
                        var e = P(this),
                            t = C(this);
                        return !e.data(b.handledName) && (e.attr(b.attribute) || e.attr(n) || e.attr(a) || s[t] !== h)
                    }).data("plugin_" + b.name, w)).length; r < l; r++) {
                    var c = P(e[r]),
                        m = C(e[r]),
                        d = c.attr(b.imageBaseAttribute) || o;
                    m === $ && d && c.attr(n) && c.attr(n, u(c.attr(n), d)), s[m] === h || c.attr(a) || c.attr(a, s[m]), m === $ && t && !c.attr(I) ? c.attr(I, t) : m === $ || !i || c.css(z) && "none" !== c.css(z) || c.css(z, "url('" + i + "')")
                }
                return e
            }

            function l(e, t) {
                if (_.length) {
                    for (var i = t || _, o = !1, n = b.imageBase || "", a = b.srcsetAttribute, s = b.handledName, r = 0; r < i.length; r++)
                        if (e || t || (h = i[r], void 0, p = h.getBoundingClientRect(), f = b.scrollDirection, g = b.threshold, v = (0 <= S ? S : S = P(j).height()) + g > p.top && -g < p.bottom, y = (0 <= x ? x : x = P(j).width()) + g > p.left && -g < p.right, "vertical" === f ? v : "horizontal" === f ? y : v && y)) {
                            var l = P(i[r]),
                                c = C(i[r]),
                                m = l.attr(b.attribute),
                                d = l.attr(b.imageBaseAttribute) || n,
                                u = l.attr(b.loaderAttribute);
                            l.data(s) || b.visibleOnly && !l.is(":visible") || !((m || l.attr(a)) && (c === $ && (d + m !== l.attr(I) || l.attr(a) !== l.attr(D)) || c !== $ && d + m !== l.css(z)) || u) || (o = !0, l.data(s, !0), k(l, c, d, u))
                        }
                    var h, p, f, g, v, y;
                    o && (_ = P(_).filter(function() {
                        return !P(this).data(s)
                    }))
                } else b.autoDestroy && w.destroy()
            }

            function k(t, e, i, o) {
                ++v;
                var n = function() {
                    g("onError", t), f(), n = P.noop
                };
                g("beforeLoad", t);
                var a = b.attribute,
                    s = b.srcsetAttribute,
                    r = b.sizesAttribute,
                    l = b.retinaAttribute,
                    c = b.removeAttribute,
                    m = b.loadedName,
                    d = t.attr(l);
                if (o) {
                    var u = function() {
                        c && t.removeAttr(b.loaderAttribute), t.data(m, !0), g(T, t), setTimeout(f, 1), u = P.noop
                    };
                    t.off(A).one(A, n).one(E, u), g(o, t, function(e) {
                        e ? (t.off(E), u()) : (t.off(A), n())
                    }) || t.trigger(A)
                } else {
                    var h = P(new Image);
                    h.one(A, n).one(E, function() {
                        t.hide(), e === $ ? t.attr(O, h.attr(O)).attr(D, h.attr(D)).attr(I, h.attr(I)) : t.css(z, "url('" + h.attr(I) + "')"), t[b.effect](b.effectTime), c && (t.removeAttr(a + " " + s + " " + l + " " + b.imageBaseAttribute), r !== O && t.removeAttr(r)), t.data(m, !0), g(T, t), h.remove(), f()
                    });
                    var p = (y && d ? d : t.attr(a)) || "";
                    h.attr(O, t.attr(r)).attr(D, t.attr(s)).attr(I, p ? i + p : null), h.complete && h.trigger(E)
                }
            }

            function C(e) {
                return e.tagName.toLowerCase()
            }

            function u(e, t) {
                if (t) {
                    var i = e.split(",");
                    e = "";
                    for (var o = 0, n = i.length; o < n; o++) e += t + i[o].trim() + (o !== n - 1 ? "," : "")
                }
                return e
            }

            function f() {
                --v, _.length || v || g("onFinishedAll")
            }

            function g(e, t, i) {
                return !!(e = b[e]) && (e.apply(w, [].slice.call(arguments, 1)), !0)
            }
            var v = 0,
                x = -1,
                S = -1,
                y = !1,
                T = "afterLoad",
                E = "load",
                A = "error",
                $ = "img",
                I = "src",
                D = "srcset",
                O = "sizes",
                z = "background-image";
            "event" === b.bind || n ? i() : P(j).on(E + "." + t, i)
        }

        function c(e, t) {
            var i = this,
                o = P.extend({}, i.config, t),
                n = {},
                a = o.name + "-" + ++r;
            return i.config = function(e, t) {
                return t === h ? o[e] : (o[e] = t, i)
            }, i.addItems = function(e) {
                return n.a && n.a("string" === P.type(e) ? P(e) : e), i
            }, i.getItems = function() {
                return n.g ? n.g() : {}
            }, i.update = function(e) {
                return n.e && n.e({}, !e), i
            }, i.force = function(e) {
                return n.f && n.f("string" === P.type(e) ? P(e) : e), i
            }, i.loadAll = function() {
                return n.e && n.e({
                    all: !0
                }, !0), i
            }, i.destroy = function() {
                return P(o.appendScroll).off("." + a, n.e), P(j).off("." + a), n = {}, h
            }, s(i, o, e, n, a), o.chainable ? e : i
        }
        var P = j.jQuery || j.Zepto,
            r = 0,
            n = !1;
        P.fn.Lazy = P.fn.lazy = function(e) {
            return new c(this, e)
        }, P.Lazy = P.lazy = function(e, t, i) {
            if (P.isFunction(t) && (i = t, t = []), P.isFunction(i)) {
                e = P.isArray(e) ? e : [e], t = P.isArray(t) ? t : [t];
                for (var o = c.prototype.config, n = o._f || (o._f = {}), a = 0, s = e.length; a < s; a++)(o[e[a]] === h || P.isFunction(o[e[a]])) && (o[e[a]] = i);
                for (var r = 0, l = t.length; r < l; r++) n[t[r]] = e[0]
            }
        }, c.prototype.config = {
            name: "lazy",
            chainable: !0,
            autoDestroy: !0,
            bind: "load",
            threshold: 500,
            visibleOnly: !1,
            appendScroll: j,
            scrollDirection: "both",
            imageBase: null,
            defaultImage: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            placeholder: null,
            delay: -1,
            combined: !1,
            attribute: "data-src",
            srcsetAttribute: "data-srcset",
            sizesAttribute: "data-sizes",
            retinaAttribute: "data-retina",
            loaderAttribute: "data-loader",
            imageBaseAttribute: "data-imagebase",
            removeAttribute: !0,
            handledName: "handled",
            loadedName: "loaded",
            effect: "show",
            effectTime: 0,
            enableThrottle: !0,
            throttle: 250,
            beforeLoad: h,
            afterLoad: h,
            onError: h,
            onFinishedAll: h
        }, P(j).on("load", function() {
            n = !0
        })
    }(window),
    function(a) {
        function i(t, i, o, e) {
            var n;
            "POST" !== (e = e ? e.toUpperCase() : "GET") && "PUT" !== e || !t.config("ajaxCreateData") || (n = t.config("ajaxCreateData").apply(t, [i])), a.ajax({
                url: i.attr("data-src"),
                type: "POST" === e || "PUT" === e ? e : "GET",
                data: n,
                dataType: i.attr("data-type") || "html",
                success: function(e) {
                    i.html(e), o(!0), t.config("removeAttribute") && i.removeAttr("data-src data-method data-type")
                },
                error: function() {
                    o(!1)
                }
            })
        }
        a.lazy("ajax", function(e, t) {
            i(this, e, t, e.attr("data-method"))
        }), a.lazy("get", function(e, t) {
            i(this, e, t, "GET")
        }), a.lazy("post", function(e, t) {
            i(this, e, t, "POST")
        }), a.lazy("put", function(e, t) {
            i(this, e, t, "PUT")
        })
    }(window.jQuery || window.Zepto),
    function(l) {
        l.lazy(["av", "audio", "video"], ["audio", "video"], function(o, e) {
            var t = o[0].tagName.toLowerCase();
            if ("audio" === t || "video" === t) {
                var i = o.find("data-src"),
                    n = o.find("data-track"),
                    a = 0,
                    s = function() {
                        ++a === i.length && e(!1)
                    },
                    r = function() {
                        var e = l(this),
                            t = e[0].tagName.toLowerCase(),
                            i = e.prop("attributes"),
                            o = l("data-src" === t ? "<source>" : "<track>");
                        "data-src" === t && o.one("error", s), l.each(i, function(e, t) {
                            o.attr(t.name, t.value)
                        }), e.replaceWith(o)
                    };
                o.one("loadedmetadata", function() {
                    e(!0)
                }).off("load error").attr("poster", o.attr("data-poster")), i.length ? i.each(r) : o.attr("data-src") ? (l.each(o.attr("data-src").split(","), function(e, t) {
                    var i = t.split("|");
                    o.append(l("<source>").one("error", s).attr({
                        src: i[0].trim(),
                        type: i[1].trim()
                    }))
                }), this.config("removeAttribute") && o.removeAttr("data-src")) : e(!1), n.length && n.each(r)
            } else e(!1)
        })
    }(window.jQuery || window.Zepto),
    function(n) {
        n.lazy(["frame", "iframe"], "iframe", function(t, e) {
            var i = this;
            if ("iframe" === t[0].tagName.toLowerCase()) {
                var o = t.attr("data-error-detect");
                "true" !== o && "1" !== o ? (t.attr("src", t.attr("data-src")), i.config("removeAttribute") && t.removeAttr("data-src data-error-detect")) : n.ajax({
                    url: t.attr("data-src"),
                    dataType: "html",
                    crossDomain: !0,
                    xhrFields: {
                        withCredentials: !0
                    },
                    success: function(e) {
                        t.html(e).attr("src", t.attr("data-src")), i.config("removeAttribute") && t.removeAttr("data-src data-error-detect")
                    },
                    error: function() {
                        e(!1)
                    }
                })
            } else e(!1)
        })
    }(window.jQuery || window.Zepto),
    function(e) {
        e.lazy("noop", function() {}), e.lazy("noop-success", function(e, t) {
            t(!0)
        }), e.lazy("noop-error", function(e, t) {
            t(!1)
        })
    }(window.jQuery || window.Zepto),
    function(a) {
        function s(e, t, i) {
            var o = e.prop("attributes"),
                n = a("<" + t + ">");
            return a.each(o, function(e, t) {
                "srcset" !== t.name && t.name !== c || (t.value = l(t.value, i)), n.attr(t.name, t.value)
            }), e.replaceWith(n), n
        }

        function r(e, t, i) {
            var o = a("<img>").one("load", function() {
                i(!0)
            }).one("error", function() {
                i(!1)
            }).appendTo(e).attr("src", t);
            o.complete && o.load()
        }

        function l(e, t) {
            if (t) {
                var i = e.split(",");
                e = "";
                for (var o = 0, n = i.length; o < n; o++) e += t + i[o].trim() + (o !== n - 1 ? "," : "")
            }
            return e
        }
        var c = "data-src";
        a.lazy(["pic", "picture"], ["picture"], function(e, t) {
            if ("picture" === e[0].tagName.toLowerCase()) {
                var i = e.find(c),
                    o = e.find("data-img"),
                    n = this.config("imageBase") || "";
                i.length ? (i.each(function() {
                    s(a(this), "source", n)
                }), 1 === o.length ? ((o = s(o, "img", n)).on("load", function() {
                    t(!0)
                }).on("error", function() {
                    t(!1)
                }), o.attr("src", o.attr(c)), this.config("removeAttribute") && o.removeAttr(c)) : e.attr(c) ? (r(e, n + e.attr(c), t), this.config("removeAttribute") && e.removeAttr(c)) : t(!1)) : e.attr("data-srcset") ? (a("<source>").attr({
                    media: e.attr("data-media"),
                    sizes: e.attr("data-sizes"),
                    type: e.attr("data-type"),
                    srcset: l(e.attr("data-srcset"), n)
                }).appendTo(e), r(e, n + e.attr(c), t), this.config("removeAttribute") && e.removeAttr(c + " data-srcset data-media data-sizes data-type")) : t(!1)
            } else t(!1)
        })
    }(window.jQuery || window.Zepto), (window.jQuery || window.Zepto).lazy(["js", "javascript", "script"], "script", function(e, t) {
        "script" === e[0].tagName.toLowerCase() ? (e.attr("src", e.attr("data-src")), this.config("removeAttribute") && e.removeAttr("data-src")) : t(!1)
    }), (window.jQuery || window.Zepto).lazy("vimeo", function(e, t) {
        "iframe" === e[0].tagName.toLowerCase() ? (e.attr("src", "https://player.vimeo.com/video/" + e.attr("data-src")), this.config("removeAttribute") && e.removeAttr("data-src")) : t(!1)
    }), (window.jQuery || window.Zepto).lazy(["yt", "youtube"], function(e, t) {
        "iframe" === e[0].tagName.toLowerCase() ? (e.attr("src", "https://www.youtube.com/embed/" + e.attr("data-src") + "?rel=0&amp;showinfo=0"), this.config("removeAttribute") && e.removeAttr("data-src")) : t(!1)
    }),
    function(n) {
        "use strict";
        n.fn.fitVids = function(e) {
            var i = {
                customSelector: null,
                ignore: null
            };
            if (!document.getElementById("fit-vids-style")) {
                var t = document.head || document.getElementsByTagName("head")[0],
                    o = document.createElement("div");
                o.innerHTML = '<p>x</p><style id="fit-vids-style">.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>', t.appendChild(o.childNodes[1])
            }
            return e && n.extend(i, e), this.each(function() {
                var e = ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', "object", "embed"];
                i.customSelector && e.push(i.customSelector);
                var o = ".fitvidsignore";
                i.ignore && (o = o + ", " + i.ignore);
                var t = n(this).find(e.join(","));
                (t = (t = t.not("object object")).not(o)).each(function() {
                    var e = n(this);
                    if (!(0 < e.parents(o).length || "embed" === this.tagName.toLowerCase() && e.parent("object").length || e.parent(".fluid-width-video-wrapper").length)) {
                        e.css("height") || e.css("width") || !isNaN(e.attr("height")) && !isNaN(e.attr("width")) || (e.attr("height", 9), e.attr("width", 16));
                        var t = ("object" === this.tagName.toLowerCase() || e.attr("height") && !isNaN(parseInt(e.attr("height"), 10)) ? parseInt(e.attr("height"), 10) : e.height()) / (isNaN(parseInt(e.attr("width"), 10)) ? e.width() : parseInt(e.attr("width"), 10));
                        if (!e.attr("name")) {
                            var i = "fitvid" + n.fn.fitVids._count;
                            e.attr("name", i), n.fn.fitVids._count++
                        }
                        e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * t + "%"), e.removeAttr("height").removeAttr("width")
                    }
                })
            })
        }, n.fn.fitVids._count = 0
    }(window.jQuery || window.Zepto),
    function(n) {
        var i = function() {
                var e = "mobile-expanded",
                    t = n("#nx_masthead");
                t.stop(!0, !0), t.hasClass(e) ? t.removeClass(e) : t.addClass(e)
            },
            o = function(e) {
                var t = "item-mobile-expanded",
                    i = n(e).closest(".menu-item"),
                    o = i.find(".icon").first();
                i.stop(!0, !0), i.hasClass(t) ? (i.removeClass(t), o.removeClass("icon-arrow-up").addClass("icon-arrow-down")) : (i.addClass(t), o.removeClass("icon-arrow-down").addClass("icon-arrow-up"))
            };
        n(document).ready(function() {
            n(".mobile-menu-button").on("click", function(e) {
                e.preventDefault(), i()
            }), n("body").on("click", "#nx_masthead.mobile-expanded #menu-primary > li.menu-item-has-children > a .icon", function(e) {
                e.preventDefault(), o(this)
            }), n(".search-field").on("focus", function() {
                n(this).closest(".search-form-wrapper").addClass("focused"), n(".nx-site-title").addClass("logo-left"), n("#nx_masthead").hasClass("sticky-menu") || n(".header-extras-wrapper").not(".mobile-expanded .header-extras-wrapper").toggle()
            }).on("blur", function() {
                n(this).closest(".search-form-wrapper").removeClass("focused"), n(".nx-site-title").removeClass("logo-left"), n("#nx_masthead").hasClass("sticky-menu") || setTimeout(function() {
                    n(".header-extras-wrapper").not(".mobile-expanded .header-extras-wrapper").fadeToggle()
                }, 1e3)
            });
            var e = n(window).width(),
                t = n(window).height() - 69;
            e <= 979 && n(".nx-header-menus").css("max-height", t + "px")
        })
    }(jQuery),
    function(e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : jQuery)
    }(function(i) {
        var e = function() {
                if (i && i.fn && i.fn.select2 && i.fn.select2.amd) var e = i.fn.select2.amd;
                var t, n, c, m;
                return e && e.requirejs || (e ? c = e : e = {}, function(u) {
                    function h(e, t) {
                        return i.call(e, t)
                    }

                    function s(e, t) {
                        var i, o, n, a, s, r, l, c, m, d, u, h = t && t.split("/"),
                            p = _.map,
                            f = p && p["*"] || {};
                        if (e && "." === e.charAt(0))
                            if (t) {
                                for (h = h.slice(0, h.length - 1), s = (e = e.split("/")).length - 1, _.nodeIdCompat && C.test(e[s]) && (e[s] = e[s].replace(C, "")), e = h.concat(e), m = 0; m < e.length; m += 1)
                                    if ("." === (u = e[m])) e.splice(m, 1), m -= 1;
                                    else if (".." === u) {
                                    if (1 === m && (".." === e[2] || ".." === e[0])) break;
                                    0 < m && (e.splice(m - 1, 2), m -= 2)
                                }
                                e = e.join("/")
                            } else 0 === e.indexOf("./") && (e = e.substring(2));
                        if ((h || f) && p) {
                            for (m = (i = e.split("/")).length; 0 < m; m -= 1) {
                                if (o = i.slice(0, m).join("/"), h)
                                    for (d = h.length; 0 < d; d -= 1)
                                        if ((n = p[h.slice(0, d).join("/")]) && (n = n[o])) {
                                            a = n, r = m;
                                            break
                                        }
                                if (a) break;
                                !l && f && f[o] && (l = f[o], c = m)
                            }!a && l && (a = l, r = c), a && (i.splice(0, r, a), e = i.join("/"))
                        }
                        return e
                    }

                    function p(e, t) {
                        return function() {
                            return l.apply(u, o.call(arguments, 0).concat([e, t]))
                        }
                    }

                    function f(t) {
                        return function(e) {
                            w[t] = e
                        }
                    }

                    function g(e) {
                        if (h(b, e)) {
                            var t = b[e];
                            delete b[e], k[e] = !0, a.apply(u, t)
                        }
                        if (!h(w, e) && !h(k, e)) throw new Error("No " + e);
                        return w[e]
                    }

                    function r(e) {
                        var t, i = e ? e.indexOf("!") : -1;
                        return -1 < i && (t = e.substring(0, i), e = e.substring(i + 1, e.length)), [t, e]
                    }
                    var a, l, v, y, w = {},
                        b = {},
                        _ = {},
                        k = {},
                        i = Object.prototype.hasOwnProperty,
                        o = [].slice,
                        C = /\.js$/;
                    v = function(e, t) {
                        var i, o, n = r(e),
                            a = n[0];
                        return e = n[1], a && (i = g(a = s(a, t))), a ? e = i && i.normalize ? i.normalize(e, (o = t, function(e) {
                            return s(e, o)
                        })) : s(e, t) : (a = (n = r(e = s(e, t)))[0], e = n[1], a && (i = g(a))), {
                            f: a ? a + "!" + e : e,
                            n: e,
                            pr: a,
                            p: i
                        }
                    }, y = {
                        require: function(e) {
                            return p(e)
                        },
                        exports: function(e) {
                            var t = w[e];
                            return void 0 !== t ? t : w[e] = {}
                        },
                        module: function(e) {
                            return {
                                id: e,
                                uri: "",
                                exports: w[e],
                                config: (t = e, function() {
                                    return _ && _.config && _.config[t] || {}
                                })
                            };
                            var t
                        }
                    }, a = function(e, t, i, o) {
                        var n, a, s, r, l, c, m = [],
                            d = typeof i;
                        if (o = o || e, "undefined" === d || "function" === d) {
                            for (t = !t.length && i.length ? ["require", "exports", "module"] : t, l = 0; l < t.length; l += 1)
                                if ("require" === (a = (r = v(t[l], o)).f)) m[l] = y.require(e);
                                else if ("exports" === a) m[l] = y.exports(e), c = !0;
                            else if ("module" === a) n = m[l] = y.module(e);
                            else if (h(w, a) || h(b, a) || h(k, a)) m[l] = g(a);
                            else {
                                if (!r.p) throw new Error(e + " missing " + a);
                                r.p.load(r.n, p(o, !0), f(a), {}), m[l] = w[a]
                            }
                            s = i ? i.apply(w[e], m) : void 0, e && (n && n.exports !== u && n.exports !== w[e] ? w[e] = n.exports : s === u && c || (w[e] = s))
                        } else e && (w[e] = i)
                    }, n = c = l = function(e, t, i, o, n) {
                        if ("string" == typeof e) return y[e] ? y[e](t) : g(v(e, t).f);
                        if (!e.splice) {
                            if ((_ = e).deps && l(_.deps, _.callback), !t) return;
                            t.splice ? (e = t, t = i, i = null) : e = u
                        }
                        return t = t || function() {}, "function" == typeof i && (i = o, o = n), o ? a(u, e, t, i) : setTimeout(function() {
                            a(u, e, t, i)
                        }, 4), l
                    }, l.config = function(e) {
                        return l(e)
                    }, n._defined = w, (m = function(e, t, i) {
                        t.splice || (i = t, t = []), h(w, e) || h(b, e) || (b[e] = [e, t, i])
                    }).amd = {
                        jQuery: !0
                    }
                }(), e.requirejs = n, e.require = c, e.define = m), e.define("almond", function() {}), e.define("jquery", [], function() {
                    var e = i || $;
                    return null == e && console && console.error && console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."), e
                }), e.define("select2/utils", ["jquery"], function(a) {
                    function m(e) {
                        var t = e.prototype,
                            i = [];
                        for (var o in t) {
                            "function" == typeof t[o] && "constructor" !== o && i.push(o)
                        }
                        return i
                    }
                    var e = {
                            Extend: function(e, t) {
                                function i() {
                                    this.constructor = e
                                }
                                var o = {}.hasOwnProperty;
                                for (var n in t) o.call(t, n) && (e[n] = t[n]);
                                return i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype, e
                            },
                            Decorate: function(o, n) {
                                function a() {
                                    var e = Array.prototype.unshift,
                                        t = n.prototype.constructor.length,
                                        i = o.prototype.constructor;
                                    0 < t && (e.call(arguments, o.prototype.constructor), i = n.prototype.constructor), i.apply(this, arguments)
                                }
                                var e = m(n),
                                    t = m(o);
                                n.displayName = o.displayName, a.prototype = new function() {
                                    this.constructor = a
                                };
                                for (var i = 0; i < t.length; i++) {
                                    var s = t[i];
                                    a.prototype[s] = o.prototype[s]
                                }
                                for (var r = function(e) {
                                        var t = function() {};
                                        e in a.prototype && (t = a.prototype[e]);
                                        var i = n.prototype[e];
                                        return function() {
                                            return Array.prototype.unshift.call(arguments, t), i.apply(this, arguments)
                                        }
                                    }, l = 0; l < e.length; l++) {
                                    var c = e[l];
                                    a.prototype[c] = r(c)
                                }
                                return a
                            }
                        },
                        t = function() {
                            this.listeners = {}
                        };
                    return t.prototype.on = function(e, t) {
                        this.listeners = this.listeners || {}, e in this.listeners ? this.listeners[e].push(t) : this.listeners[e] = [t]
                    }, t.prototype.trigger = function(e) {
                        var t = Array.prototype.slice;
                        this.listeners = this.listeners || {}, e in this.listeners && this.invoke(this.listeners[e], t.call(arguments, 1)), "*" in this.listeners && this.invoke(this.listeners["*"], arguments)
                    }, t.prototype.invoke = function(e, t) {
                        for (var i = 0, o = e.length; i < o; i++) e[i].apply(this, t)
                    }, e.Observable = t, e.generateChars = function(e) {
                        for (var t = "", i = 0; i < e; i++) {
                            t += Math.floor(36 * Math.random()).toString(36)
                        }
                        return t
                    }, e.bind = function(e, t) {
                        return function() {
                            e.apply(t, arguments)
                        }
                    }, e._convertData = function(e) {
                        for (var t in e) {
                            var i = t.split("-"),
                                o = e;
                            if (1 !== i.length) {
                                for (var n = 0; n < i.length; n++) {
                                    var a = i[n];
                                    (a = a.substring(0, 1).toLowerCase() + a.substring(1)) in o || (o[a] = {}), n == i.length - 1 && (o[a] = e[t]), o = o[a]
                                }
                                delete e[t]
                            }
                        }
                        return e
                    }, e.hasScroll = function(e, t) {
                        var i = a(t),
                            o = t.style.overflowX,
                            n = t.style.overflowY;
                        return (o !== n || "hidden" !== n && "visible" !== n) && ("scroll" === o || "scroll" === n || (i.innerHeight() < t.scrollHeight || i.innerWidth() < t.scrollWidth))
                    }, e.escapeMarkup = function(e) {
                        var t = {
                            "\\": "&#92;",
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#39;",
                            "/": "&#47;"
                        };
                        return "string" != typeof e ? e : String(e).replace(/[&<>"'\/\\]/g, function(e) {
                            return t[e]
                        })
                    }, e.appendMany = function(e, t) {
                        if ("1.7" === a.fn.jquery.substr(0, 3)) {
                            var i = a();
                            a.map(t, function(e) {
                                i = i.add(e)
                            }), t = i
                        }
                        e.append(t)
                    }, e
                }), e.define("select2/results", ["jquery", "./utils"], function(u, e) {
                    function o(e, t, i) {
                        this.$element = e, this.data = i, this.options = t, o.__super__.constructor.call(this)
                    }
                    return e.Extend(o, e.Observable), o.prototype.render = function() {
                        var e = u('<ul class="select2-results__options" role="tree"></ul>');
                        return this.options.get("multiple") && e.attr("aria-multiselectable", "true"), this.$results = e
                    }, o.prototype.clear = function() {
                        this.$results.empty()
                    }, o.prototype.displayMessage = function(e) {
                        var t = this.options.get("escapeMarkup");
                        this.clear(), this.hideLoading();
                        var i = u('<li role="treeitem" class="select2-results__option"></li>'),
                            o = this.options.get("translations").get(e.message);
                        i.append(t(o(e.args))), this.$results.append(i)
                    }, o.prototype.append = function(e) {
                        this.hideLoading();
                        var t = [];
                        if (null != e.results && 0 !== e.results.length) {
                            e.results = this.sort(e.results);
                            for (var i = 0; i < e.results.length; i++) {
                                var o = e.results[i],
                                    n = this.option(o);
                                t.push(n)
                            }
                            this.$results.append(t)
                        } else 0 === this.$results.children().length && this.trigger("results:message", {
                            message: "noResults"
                        })
                    }, o.prototype.position = function(e, t) {
                        t.find(".select2-results").append(e)
                    }, o.prototype.sort = function(e) {
                        return this.options.get("sorter")(e)
                    }, o.prototype.setClasses = function() {
                        var n = this;
                        this.data.current(function(e) {
                            var o = u.map(e, function(e) {
                                    return e.id.toString()
                                }),
                                t = n.$results.find(".select2-results__option[aria-selected]");
                            t.each(function() {
                                var e = u(this),
                                    t = u.data(this, "data"),
                                    i = "" + t.id;
                                null != t.element && t.element.selected || null == t.element && -1 < u.inArray(i, o) ? e.attr("aria-selected", "true") : e.attr("aria-selected", "false")
                            });
                            var i = t.filter("[aria-selected=true]");
                            0 < i.length ? i.first().trigger("mouseenter") : t.first().trigger("mouseenter")
                        })
                    }, o.prototype.showLoading = function(e) {
                        this.hideLoading();
                        var t = {
                                disabled: !0,
                                loading: !0,
                                text: this.options.get("translations").get("searching")(e)
                            },
                            i = this.option(t);
                        i.className += " loading-results", this.$results.prepend(i)
                    }, o.prototype.hideLoading = function() {
                        this.$results.find(".loading-results").remove()
                    }, o.prototype.option = function(e) {
                        var t = document.createElement("li");
                        t.className = "select2-results__option";
                        var i = {
                            role: "treeitem",
                            "aria-selected": "false"
                        };
                        for (var o in e.disabled && (delete i["aria-selected"], i["aria-disabled"] = "true"), null == e.id && delete i["aria-selected"], null != e._resultId && (t.id = e._resultId), e.title && (t.title = e.title), e.children && (i.role = "group", i["aria-label"] = e.text, delete i["aria-selected"]), i) {
                            var n = i[o];
                            t.setAttribute(o, n)
                        }
                        if (e.children) {
                            var a = u(t),
                                s = document.createElement("strong");
                            s.className = "select2-results__group", u(s), this.template(e, s);
                            for (var r = [], l = 0; l < e.children.length; l++) {
                                var c = e.children[l],
                                    m = this.option(c);
                                r.push(m)
                            }
                            var d = u("<ul></ul>", {
                                class: "select2-results__options select2-results__options--nested"
                            });
                            d.append(r), a.append(s), a.append(d)
                        } else this.template(e, t);
                        return u.data(t, "data", e), t
                    }, o.prototype.bind = function(t) {
                        var l = this,
                            e = t.id + "-results";
                        this.$results.attr("id", e), t.on("results:all", function(e) {
                            l.clear(), l.append(e.data), t.isOpen() && l.setClasses()
                        }), t.on("results:append", function(e) {
                            l.append(e.data), t.isOpen() && l.setClasses()
                        }), t.on("query", function(e) {
                            l.showLoading(e)
                        }), t.on("select", function() {
                            t.isOpen() && l.setClasses()
                        }), t.on("unselect", function() {
                            t.isOpen() && l.setClasses()
                        }), t.on("open", function() {
                            l.$results.attr("aria-expanded", "true"), l.$results.attr("aria-hidden", "false"), l.setClasses(), l.ensureHighlightVisible()
                        }), t.on("close", function() {
                            l.$results.attr("aria-expanded", "false"), l.$results.attr("aria-hidden", "true"), l.$results.removeAttr("aria-activedescendant")
                        }), t.on("results:toggle", function() {
                            var e = l.getHighlightedResults();
                            0 !== e.length && e.trigger("mouseup")
                        }), t.on("results:select", function() {
                            var e = l.getHighlightedResults();
                            if (0 !== e.length) {
                                var t = e.data("data");
                                "true" == e.attr("aria-selected") ? l.trigger("close") : l.trigger("select", {
                                    data: t
                                })
                            }
                        }), t.on("results:previous", function() {
                            var e = l.getHighlightedResults(),
                                t = l.$results.find("[aria-selected]"),
                                i = t.index(e);
                            if (0 !== i) {
                                var o = i - 1;
                                0 === e.length && (o = 0);
                                var n = t.eq(o);
                                n.trigger("mouseenter");
                                var a = l.$results.offset().top,
                                    s = n.offset().top,
                                    r = l.$results.scrollTop() + (s - a);
                                0 === o ? l.$results.scrollTop(0) : s - a < 0 && l.$results.scrollTop(r)
                            }
                        }), t.on("results:next", function() {
                            var e = l.getHighlightedResults(),
                                t = l.$results.find("[aria-selected]"),
                                i = t.index(e) + 1;
                            if (!(i >= t.length)) {
                                var o = t.eq(i);
                                o.trigger("mouseenter");
                                var n = l.$results.offset().top + l.$results.outerHeight(!1),
                                    a = o.offset().top + o.outerHeight(!1),
                                    s = l.$results.scrollTop() + a - n;
                                0 === i ? l.$results.scrollTop(0) : n < a && l.$results.scrollTop(s)
                            }
                        }), t.on("results:focus", function(e) {
                            e.element.addClass("select2-results__option--highlighted")
                        }), t.on("results:message", function(e) {
                            l.displayMessage(e)
                        }), u.fn.mousewheel && this.$results.on("mousewheel", function(e) {
                            var t = l.$results.scrollTop(),
                                i = l.$results.get(0).scrollHeight - l.$results.scrollTop() + e.deltaY,
                                o = 0 < e.deltaY && t - e.deltaY <= 0,
                                n = e.deltaY < 0 && i <= l.$results.height();
                            o ? (l.$results.scrollTop(0), e.preventDefault(), e.stopPropagation()) : n && (l.$results.scrollTop(l.$results.get(0).scrollHeight - l.$results.height()), e.preventDefault(), e.stopPropagation())
                        }), this.$results.on("mouseup", ".select2-results__option[aria-selected]", function(e) {
                            var t = u(this),
                                i = t.data("data");
                            return "true" === t.attr("aria-selected") ? void(l.options.get("multiple") ? l.trigger("unselect", {
                                originalEvent: e,
                                data: i
                            }) : l.trigger("close")) : void l.trigger("select", {
                                originalEvent: e,
                                data: i
                            })
                        }), this.$results.on("mouseenter", ".select2-results__option[aria-selected]", function() {
                            var e = u(this).data("data");
                            l.getHighlightedResults().removeClass("select2-results__option--highlighted"), l.trigger("results:focus", {
                                data: e,
                                element: u(this)
                            })
                        })
                    }, o.prototype.getHighlightedResults = function() {
                        return this.$results.find(".select2-results__option--highlighted")
                    }, o.prototype.destroy = function() {
                        this.$results.remove()
                    }, o.prototype.ensureHighlightVisible = function() {
                        var e = this.getHighlightedResults();
                        if (0 !== e.length) {
                            var t = this.$results.find("[aria-selected]").index(e),
                                i = this.$results.offset().top,
                                o = e.offset().top,
                                n = this.$results.scrollTop() + (o - i),
                                a = o - i;
                            n -= 2 * e.outerHeight(!1), t <= 2 ? this.$results.scrollTop(0) : (a > this.$results.outerHeight() || a < 0) && this.$results.scrollTop(n)
                        }
                    }, o.prototype.template = function(e, t) {
                        var i = this.options.get("templateResult"),
                            o = this.options.get("escapeMarkup"),
                            n = i(e);
                        null == n ? t.style.display = "none" : "string" == typeof n ? t.innerHTML = o(n) : u(t).append(n)
                    }, o
                }), e.define("select2/keys", [], function() {
                    return {
                        BACKSPACE: 8,
                        TAB: 9,
                        ENTER: 13,
                        SHIFT: 16,
                        CTRL: 17,
                        ALT: 18,
                        ESC: 27,
                        SPACE: 32,
                        PAGE_UP: 33,
                        PAGE_DOWN: 34,
                        END: 35,
                        HOME: 36,
                        LEFT: 37,
                        UP: 38,
                        RIGHT: 39,
                        DOWN: 40,
                        DELETE: 46
                    }
                }), e.define("select2/selection/base", ["jquery", "../utils", "../keys"], function(i, e, o) {
                    function n(e, t) {
                        this.$element = e, this.options = t, n.__super__.constructor.call(this)
                    }
                    return e.Extend(n, e.Observable), n.prototype.render = function() {
                        var e = i('<span class="select2-selection" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-expanded="false"></span>');
                        return this._tabindex = 0, null != this.$element.data("old-tabindex") ? this._tabindex = this.$element.data("old-tabindex") : null != this.$element.attr("tabindex") && (this._tabindex = this.$element.attr("tabindex")), e.attr("title", this.$element.attr("title")), e.attr("tabindex", this._tabindex), this.$selection = e
                    }, n.prototype.bind = function(e) {
                        var t = this,
                            i = (e.id, e.id + "-results");
                        this.container = e, this.$selection.on("focus", function(e) {
                            t.trigger("focus", e)
                        }), this.$selection.on("blur", function(e) {
                            t.trigger("blur", e)
                        }), this.$selection.on("keydown", function(e) {
                            t.trigger("keypress", e), e.which === o.SPACE && e.preventDefault()
                        }), e.on("results:focus", function(e) {
                            t.$selection.attr("aria-activedescendant", e.data._resultId)
                        }), e.on("selection:update", function(e) {
                            t.update(e.data)
                        }), e.on("open", function() {
                            t.$selection.attr("aria-expanded", "true"), t.$selection.attr("aria-owns", i), t._attachCloseHandler(e)
                        }), e.on("close", function() {
                            t.$selection.attr("aria-expanded", "false"), t.$selection.removeAttr("aria-activedescendant"), t.$selection.removeAttr("aria-owns"), t.$selection.focus(), t._detachCloseHandler(e)
                        }), e.on("enable", function() {
                            t.$selection.attr("tabindex", t._tabindex)
                        }), e.on("disable", function() {
                            t.$selection.attr("tabindex", "-1")
                        })
                    }, n.prototype._attachCloseHandler = function(e) {
                        i(document.body).on("mousedown.select2." + e.id, function(e) {
                            var t = i(e.target).closest(".select2");
                            i(".select2.select2-container--open").each(function() {
                                var e = i(this);
                                this != t[0] && e.data("element").select2("close")
                            })
                        })
                    }, n.prototype._detachCloseHandler = function(e) {
                        i(document.body).off("mousedown.select2." + e.id)
                    }, n.prototype.position = function(e, t) {
                        t.find(".selection").append(e)
                    }, n.prototype.destroy = function() {
                        this._detachCloseHandler(this.container)
                    }, n.prototype.update = function() {
                        throw new Error("The `update` method must be defined in child classes.")
                    }, n
                }), e.define("select2/selection/single", ["jquery", "./base", "../utils", "../keys"], function(e, t, i) {
                    function o() {
                        o.__super__.constructor.apply(this, arguments)
                    }
                    return i.Extend(o, t), o.prototype.render = function() {
                        var e = o.__super__.render.call(this);
                        return e.addClass("select2-selection--single"), e.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'), e
                    }, o.prototype.bind = function(e) {
                        var t = this;
                        o.__super__.bind.apply(this, arguments);
                        var i = e.id + "-container";
                        this.$selection.find(".select2-selection__rendered").attr("id", i), this.$selection.attr("aria-labelledby", i), this.$selection.on("mousedown", function(e) {
                            1 === e.which && t.trigger("toggle", {
                                originalEvent: e
                            })
                        }), this.$selection.on("focus", function() {}), this.$selection.on("blur", function() {}), e.on("selection:update", function(e) {
                            t.update(e.data)
                        })
                    }, o.prototype.clear = function() {
                        this.$selection.find(".select2-selection__rendered").empty()
                    }, o.prototype.display = function(e) {
                        var t = this.options.get("templateSelection");
                        return this.options.get("escapeMarkup")(t(e))
                    }, o.prototype.selectionContainer = function() {
                        return e("<span></span>")
                    }, o.prototype.update = function(e) {
                        if (0 !== e.length) {
                            var t = e[0],
                                i = this.display(t),
                                o = this.$selection.find(".select2-selection__rendered");
                            o.empty().append(i), o.prop("title", t.title || t.text)
                        } else this.clear()
                    }, o
                }), e.define("select2/selection/multiple", ["jquery", "./base", "../utils"], function(o, e, r) {
                    function t() {
                        t.__super__.constructor.apply(this, arguments)
                    }
                    return r.Extend(t, e), t.prototype.render = function() {
                        var e = t.__super__.render.call(this);
                        return e.addClass("select2-selection--multiple"), e.html('<ul class="select2-selection__rendered"></ul>'), e
                    }, t.prototype.bind = function() {
                        var i = this;
                        t.__super__.bind.apply(this, arguments), this.$selection.on("click", function(e) {
                            i.trigger("toggle", {
                                originalEvent: e
                            })
                        }), this.$selection.on("click", ".select2-selection__choice__remove", function(e) {
                            var t = o(this).parent().data("data");
                            i.trigger("unselect", {
                                originalEvent: e,
                                data: t
                            })
                        })
                    }, t.prototype.clear = function() {
                        this.$selection.find(".select2-selection__rendered").empty()
                    }, t.prototype.display = function(e) {
                        var t = this.options.get("templateSelection");
                        return this.options.get("escapeMarkup")(t(e))
                    }, t.prototype.selectionContainer = function() {
                        return o('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>')
                    }, t.prototype.update = function(e) {
                        if (this.clear(), 0 !== e.length) {
                            for (var t = [], i = 0; i < e.length; i++) {
                                var o = e[i],
                                    n = this.display(o),
                                    a = this.selectionContainer();
                                a.append(n), a.prop("title", o.title || o.text), a.data("data", o), t.push(a)
                            }
                            var s = this.$selection.find(".select2-selection__rendered");
                            r.appendMany(s, t)
                        }
                    }, t
                }), e.define("select2/selection/placeholder", ["../utils"], function() {
                    function e(e, t, i) {
                        this.placeholder = this.normalizePlaceholder(i.get("placeholder")), e.call(this, t, i)
                    }
                    return e.prototype.normalizePlaceholder = function(e, t) {
                        return "string" == typeof t && (t = {
                            id: "",
                            text: t
                        }), t
                    }, e.prototype.createPlaceholder = function(e, t) {
                        var i = this.selectionContainer();
                        return i.html(this.display(t)), i.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"), i
                    }, e.prototype.update = function(e, t) {
                        var i = 1 == t.length && t[0].id != this.placeholder.id;
                        if (1 < t.length || i) return e.call(this, t);
                        this.clear();
                        var o = this.createPlaceholder(this.placeholder);
                        this.$selection.find(".select2-selection__rendered").append(o)
                    }, e
                }), e.define("select2/selection/allowClear", ["jquery", "../keys"], function(o, n) {
                    function e() {}
                    return e.prototype.bind = function(e, t, i) {
                        var o = this;
                        e.call(this, t, i), null == this.placeholder && this.options.get("debug") && window.console && console.error && console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."), this.$selection.on("mousedown", ".select2-selection__clear", function(e) {
                            o._handleClear(e)
                        }), t.on("keypress", function(e) {
                            o._handleKeyboardClear(e, t)
                        })
                    }, e.prototype._handleClear = function(e, t) {
                        if (!this.options.get("disabled")) {
                            var i = this.$selection.find(".select2-selection__clear");
                            if (0 !== i.length) {
                                t.stopPropagation();
                                for (var o = i.data("data"), n = 0; n < o.length; n++) {
                                    var a = {
                                        data: o[n]
                                    };
                                    if (this.trigger("unselect", a), a.prevented) return
                                }
                                this.$element.val(this.placeholder.id).trigger("change"), this.trigger("toggle")
                            }
                        }
                    }, e.prototype._handleKeyboardClear = function(e, t, i) {
                        i.isOpen() || (t.which == n.DELETE || t.which == n.BACKSPACE) && this._handleClear(t)
                    }, e.prototype.update = function(e, t) {
                        if (e.call(this, t), !(0 < this.$selection.find(".select2-selection__placeholder").length || 0 === t.length)) {
                            var i = o('<span class="select2-selection__clear">&times;</span>');
                            i.data("data", t), this.$selection.find(".select2-selection__rendered").prepend(i)
                        }
                    }, e
                }), e.define("select2/selection/search", ["jquery", "../utils", "../keys"], function(i, e, n) {
                    function t(e, t, i) {
                        e.call(this, t, i)
                    }
                    return t.prototype.render = function(e) {
                        var t = i('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></li>');
                        return this.$searchContainer = t, this.$search = t.find("input"), e.call(this)
                    }, t.prototype.bind = function(e, t, i) {
                        var o = this;
                        e.call(this, t, i), t.on("open", function() {
                            o.$search.attr("tabindex", 0), o.$search.focus()
                        }), t.on("close", function() {
                            o.$search.attr("tabindex", -1), o.$search.val(""), o.$search.focus()
                        }), t.on("enable", function() {
                            o.$search.prop("disabled", !1)
                        }), t.on("disable", function() {
                            o.$search.prop("disabled", !0)
                        }), this.$selection.on("focusin", ".select2-search--inline", function(e) {
                            o.trigger("focus", e)
                        }), this.$selection.on("focusout", ".select2-search--inline", function(e) {
                            o.trigger("blur", e)
                        }), this.$selection.on("keydown", ".select2-search--inline", function(e) {
                            if (e.stopPropagation(), o.trigger("keypress", e), o._keyUpPrevented = e.isDefaultPrevented(), e.which === n.BACKSPACE && "" === o.$search.val()) {
                                var t = o.$searchContainer.prev(".select2-selection__choice");
                                if (0 < t.length) {
                                    var i = t.data("data");
                                    o.searchRemoveChoice(i), e.preventDefault()
                                }
                            }
                        }), this.$selection.on("input", ".select2-search--inline", function() {
                            o.$selection.off("keyup.search")
                        }), this.$selection.on("keyup.search input", ".select2-search--inline", function(e) {
                            o.handleSearch(e)
                        })
                    }, t.prototype.createPlaceholder = function(e, t) {
                        this.$search.attr("placeholder", t.text)
                    }, t.prototype.update = function(e, t) {
                        this.$search.attr("placeholder", ""), e.call(this, t), this.$selection.find(".select2-selection__rendered").append(this.$searchContainer), this.resizeSearch()
                    }, t.prototype.handleSearch = function() {
                        if (this.resizeSearch(), !this._keyUpPrevented) {
                            var e = this.$search.val();
                            this.trigger("query", {
                                term: e
                            })
                        }
                        this._keyUpPrevented = !1
                    }, t.prototype.searchRemoveChoice = function(e, t) {
                        this.trigger("unselect", {
                            data: t
                        }), this.trigger("open"), this.$search.val(t.text + " ")
                    }, t.prototype.resizeSearch = function() {
                        this.$search.css("width", "25px");
                        var e = "";
                        "" !== this.$search.attr("placeholder") ? e = this.$selection.find(".select2-selection__rendered").innerWidth() : e = .75 * (this.$search.val().length + 1) + "em";
                        this.$search.css("width", e)
                    }, t
                }), e.define("select2/selection/eventRelay", ["jquery"], function(s) {
                    function e() {}
                    return e.prototype.bind = function(e, t, i) {
                        var o = this,
                            n = ["open", "opening", "close", "closing", "select", "selecting", "unselect", "unselecting"],
                            a = ["opening", "closing", "selecting", "unselecting"];
                        e.call(this, t, i), t.on("*", function(e, t) {
                            if (-1 !== s.inArray(e, n)) {
                                t = t || {};
                                var i = s.Event("select2:" + e, {
                                    params: t
                                });
                                o.$element.trigger(i), -1 !== s.inArray(e, a) && (t.prevented = i.isDefaultPrevented())
                            }
                        })
                    }, e
                }), e.define("select2/translation", ["jquery", "require"], function(t, i) {
                    function o(e) {
                        this.dict = e || {}
                    }
                    return o.prototype.all = function() {
                        return this.dict
                    }, o.prototype.get = function(e) {
                        return this.dict[e]
                    }, o.prototype.extend = function(e) {
                        this.dict = t.extend({}, e.all(), this.dict)
                    }, o._cache = {}, o.loadPath = function(e) {
                        if (!(e in o._cache)) {
                            var t = i(e);
                            o._cache[e] = t
                        }
                        return new o(o._cache[e])
                    }, o
                }), e.define("select2/diacritics", [], function() {
                    return {
                        "â’¶": "A",
                        "ï¼¡": "A",
                        "Ã€": "A",
                        "Ã": "A",
                        "Ã‚": "A",
                        "áº¦": "A",
                        "áº¤": "A",
                        "áºª": "A",
                        "áº¨": "A",
                        "Ãƒ": "A",
                        "Ä€": "A",
                        "Ä‚": "A",
                        "áº°": "A",
                        "áº®": "A",
                        "áº´": "A",
                        "áº²": "A",
                        "È¦": "A",
                        "Ç ": "A",
                        "Ã„": "A",
                        "Çž": "A",
                        "áº¢": "A",
                        "Ã…": "A",
                        "Çº": "A",
                        "Ç": "A",
                        "È€": "A",
                        "È‚": "A",
                        "áº ": "A",
                        "áº¬": "A",
                        "áº¶": "A",
                        "á¸€": "A",
                        "Ä„": "A",
                        "Èº": "A",
                        "â±¯": "A",
                        "êœ²": "AA",
                        "Ã†": "AE",
                        "Ç¼": "AE",
                        "Ç¢": "AE",
                        "êœ´": "AO",
                        "êœ¶": "AU",
                        "êœ¸": "AV",
                        "êœº": "AV",
                        "êœ¼": "AY",
                        "â’·": "B",
                        "ï¼¢": "B",
                        "á¸‚": "B",
                        "á¸„": "B",
                        "á¸†": "B",
                        "Éƒ": "B",
                        "Æ‚": "B",
                        "Æ": "B",
                        "â’¸": "C",
                        "ï¼£": "C",
                        "Ä†": "C",
                        "Äˆ": "C",
                        "ÄŠ": "C",
                        "ÄŒ": "C",
                        "Ã‡": "C",
                        "á¸ˆ": "C",
                        "Æ‡": "C",
                        "È»": "C",
                        "êœ¾": "C",
                        "â’¹": "D",
                        "ï¼¤": "D",
                        "á¸Š": "D",
                        "ÄŽ": "D",
                        "á¸Œ": "D",
                        "á¸": "D",
                        "á¸’": "D",
                        "á¸Ž": "D",
                        "Ä": "D",
                        "Æ‹": "D",
                        "ÆŠ": "D",
                        "Æ‰": "D",
                        "ê¹": "D",
                        "Ç±": "DZ",
                        "Ç„": "DZ",
                        "Ç²": "Dz",
                        "Ç…": "Dz",
                        "â’º": "E",
                        "ï¼¥": "E",
                        "Ãˆ": "E",
                        "Ã‰": "E",
                        "ÃŠ": "E",
                        "á»€": "E",
                        "áº¾": "E",
                        "á»„": "E",
                        "á»‚": "E",
                        "áº¼": "E",
                        "Ä’": "E",
                        "á¸”": "E",
                        "á¸–": "E",
                        "Ä”": "E",
                        "Ä–": "E",
                        "Ã‹": "E",
                        "áºº": "E",
                        "Äš": "E",
                        "È„": "E",
                        "È†": "E",
                        "áº¸": "E",
                        "á»†": "E",
                        "È¨": "E",
                        "á¸œ": "E",
                        "Ä˜": "E",
                        "á¸˜": "E",
                        "á¸š": "E",
                        "Æ": "E",
                        "ÆŽ": "E",
                        "â’»": "F",
                        "ï¼¦": "F",
                        "á¸ž": "F",
                        "Æ‘": "F",
                        "ê»": "F",
                        "â’¼": "G",
                        "ï¼§": "G",
                        "Ç´": "G",
                        "Äœ": "G",
                        "á¸ ": "G",
                        "Äž": "G",
                        "Ä ": "G",
                        "Ç¦": "G",
                        "Ä¢": "G",
                        "Ç¤": "G",
                        "Æ“": "G",
                        "êž ": "G",
                        "ê½": "G",
                        "ê¾": "G",
                        "â’½": "H",
                        "ï¼¨": "H",
                        "Ä¤": "H",
                        "á¸¢": "H",
                        "á¸¦": "H",
                        "Èž": "H",
                        "á¸¤": "H",
                        "á¸¨": "H",
                        "á¸ª": "H",
                        "Ä¦": "H",
                        "â±§": "H",
                        "â±µ": "H",
                        "êž": "H",
                        "â’¾": "I",
                        "ï¼©": "I",
                        "ÃŒ": "I",
                        "Ã": "I",
                        "ÃŽ": "I",
                        "Ä¨": "I",
                        "Äª": "I",
                        "Ä¬": "I",
                        "Ä°": "I",
                        "Ã": "I",
                        "á¸®": "I",
                        "á»ˆ": "I",
                        "Ç": "I",
                        "Èˆ": "I",
                        "ÈŠ": "I",
                        "á»Š": "I",
                        "Ä®": "I",
                        "á¸¬": "I",
                        "Æ—": "I",
                        "â’¿": "J",
                        "ï¼ª": "J",
                        "Ä´": "J",
                        "Éˆ": "J",
                        "â“€": "K",
                        "ï¼«": "K",
                        "á¸°": "K",
                        "Ç¨": "K",
                        "á¸²": "K",
                        "Ä¶": "K",
                        "á¸´": "K",
                        "Æ˜": "K",
                        "â±©": "K",
                        "ê€": "K",
                        "ê‚": "K",
                        "ê„": "K",
                        "êž¢": "K",
                        "â“": "L",
                        "ï¼¬": "L",
                        "Ä¿": "L",
                        "Ä¹": "L",
                        "Ä½": "L",
                        "á¸¶": "L",
                        "á¸¸": "L",
                        "Ä»": "L",
                        "á¸¼": "L",
                        "á¸º": "L",
                        "Å": "L",
                        "È½": "L",
                        "â±¢": "L",
                        "â± ": "L",
                        "êˆ": "L",
                        "ê†": "L",
                        "êž€": "L",
                        "Ç‡": "LJ",
                        "Çˆ": "Lj",
                        "â“‚": "M",
                        "ï¼­": "M",
                        "á¸¾": "M",
                        "á¹€": "M",
                        "á¹‚": "M",
                        "â±®": "M",
                        "Æœ": "M",
                        "â“ƒ": "N",
                        "ï¼®": "N",
                        "Ç¸": "N",
                        "Åƒ": "N",
                        "Ã‘": "N",
                        "á¹„": "N",
                        "Å‡": "N",
                        "á¹†": "N",
                        "Å…": "N",
                        "á¹Š": "N",
                        "á¹ˆ": "N",
                        "È ": "N",
                        "Æ": "N",
                        "êž": "N",
                        "êž¤": "N",
                        "ÇŠ": "NJ",
                        "Ç‹": "Nj",
                        "â“„": "O",
                        "ï¼¯": "O",
                        "Ã’": "O",
                        "Ã“": "O",
                        "Ã”": "O",
                        "á»’": "O",
                        "á»": "O",
                        "á»–": "O",
                        "á»”": "O",
                        "Ã•": "O",
                        "á¹Œ": "O",
                        "È¬": "O",
                        "á¹Ž": "O",
                        "ÅŒ": "O",
                        "á¹": "O",
                        "á¹’": "O",
                        "ÅŽ": "O",
                        "È®": "O",
                        "È°": "O",
                        "Ã–": "O",
                        "Èª": "O",
                        "á»Ž": "O",
                        "Å": "O",
                        "Ç‘": "O",
                        "ÈŒ": "O",
                        "ÈŽ": "O",
                        "Æ ": "O",
                        "á»œ": "O",
                        "á»š": "O",
                        "á» ": "O",
                        "á»ž": "O",
                        "á»¢": "O",
                        "á»Œ": "O",
                        "á»˜": "O",
                        "Çª": "O",
                        "Ç¬": "O",
                        "Ã˜": "O",
                        "Ç¾": "O",
                        "Æ†": "O",
                        "ÆŸ": "O",
                        "êŠ": "O",
                        "êŒ": "O",
                        "Æ¢": "OI",
                        "êŽ": "OO",
                        "È¢": "OU",
                        "â“…": "P",
                        "ï¼°": "P",
                        "á¹”": "P",
                        "á¹–": "P",
                        "Æ¤": "P",
                        "â±£": "P",
                        "ê": "P",
                        "ê’": "P",
                        "ê”": "P",
                        "â“†": "Q",
                        "ï¼±": "Q",
                        "ê–": "Q",
                        "ê˜": "Q",
                        "ÉŠ": "Q",
                        "â“‡": "R",
                        "ï¼²": "R",
                        "Å”": "R",
                        "á¹˜": "R",
                        "Å˜": "R",
                        "È": "R",
                        "È’": "R",
                        "á¹š": "R",
                        "á¹œ": "R",
                        "Å–": "R",
                        "á¹ž": "R",
                        "ÉŒ": "R",
                        "â±¤": "R",
                        "êš": "R",
                        "êž¦": "R",
                        "êž‚": "R",
                        "â“ˆ": "S",
                        "ï¼³": "S",
                        "áºž": "S",
                        "Åš": "S",
                        "á¹¤": "S",
                        "Åœ": "S",
                        "á¹ ": "S",
                        "Å ": "S",
                        "á¹¦": "S",
                        "á¹¢": "S",
                        "á¹¨": "S",
                        "È˜": "S",
                        "Åž": "S",
                        "â±¾": "S",
                        "êž¨": "S",
                        "êž„": "S",
                        "â“‰": "T",
                        "ï¼´": "T",
                        "á¹ª": "T",
                        "Å¤": "T",
                        "á¹¬": "T",
                        "Èš": "T",
                        "Å¢": "T",
                        "á¹°": "T",
                        "á¹®": "T",
                        "Å¦": "T",
                        "Æ¬": "T",
                        "Æ®": "T",
                        "È¾": "T",
                        "êž†": "T",
                        "êœ¨": "TZ",
                        "â“Š": "U",
                        "ï¼µ": "U",
                        "Ã™": "U",
                        "Ãš": "U",
                        "Ã›": "U",
                        "Å¨": "U",
                        "á¹¸": "U",
                        "Åª": "U",
                        "á¹º": "U",
                        "Å¬": "U",
                        "Ãœ": "U",
                        "Ç›": "U",
                        "Ç—": "U",
                        "Ç•": "U",
                        "Ç™": "U",
                        "á»¦": "U",
                        "Å®": "U",
                        "Å°": "U",
                        "Ç“": "U",
                        "È”": "U",
                        "È–": "U",
                        "Æ¯": "U",
                        "á»ª": "U",
                        "á»¨": "U",
                        "á»®": "U",
                        "á»¬": "U",
                        "á»°": "U",
                        "á»¤": "U",
                        "á¹²": "U",
                        "Å²": "U",
                        "á¹¶": "U",
                        "á¹´": "U",
                        "É„": "U",
                        "â“‹": "V",
                        "ï¼¶": "V",
                        "á¹¼": "V",
                        "á¹¾": "V",
                        "Æ²": "V",
                        "êž": "V",
                        "É…": "V",
                        "ê ": "VY",
                        "â“Œ": "W",
                        "ï¼·": "W",
                        "áº€": "W",
                        "áº‚": "W",
                        "Å´": "W",
                        "áº†": "W",
                        "áº„": "W",
                        "áºˆ": "W",
                        "â±²": "W",
                        "â“": "X",
                        "ï¼¸": "X",
                        "áºŠ": "X",
                        "áºŒ": "X",
                        "â“Ž": "Y",
                        "ï¼¹": "Y",
                        "á»²": "Y",
                        "Ã": "Y",
                        "Å¶": "Y",
                        "á»¸": "Y",
                        "È²": "Y",
                        "áºŽ": "Y",
                        "Å¸": "Y",
                        "á»¶": "Y",
                        "á»´": "Y",
                        "Æ³": "Y",
                        "ÉŽ": "Y",
                        "á»¾": "Y",
                        "â“": "Z",
                        "ï¼º": "Z",
                        "Å¹": "Z",
                        "áº": "Z",
                        "Å»": "Z",
                        "Å½": "Z",
                        "áº’": "Z",
                        "áº”": "Z",
                        "Æµ": "Z",
                        "È¤": "Z",
                        "â±¿": "Z",
                        "â±«": "Z",
                        "ê¢": "Z",
                        "â“": "a",
                        "ï½": "a",
                        "áºš": "a",
                        "Ã ": "a",
                        "Ã¡": "a",
                        "Ã¢": "a",
                        "áº§": "a",
                        "áº¥": "a",
                        "áº«": "a",
                        "áº©": "a",
                        "Ã£": "a",
                        "Ä": "a",
                        "Äƒ": "a",
                        "áº±": "a",
                        "áº¯": "a",
                        "áºµ": "a",
                        "áº³": "a",
                        "È§": "a",
                        "Ç¡": "a",
                        "Ã¤": "a",
                        "ÇŸ": "a",
                        "áº£": "a",
                        "Ã¥": "a",
                        "Ç»": "a",
                        "ÇŽ": "a",
                        "È": "a",
                        "Èƒ": "a",
                        "áº¡": "a",
                        "áº­": "a",
                        "áº·": "a",
                        "á¸": "a",
                        "Ä…": "a",
                        "â±¥": "a",
                        "É": "a",
                        "êœ³": "aa",
                        "Ã¦": "ae",
                        "Ç½": "ae",
                        "Ç£": "ae",
                        "êœµ": "ao",
                        "êœ·": "au",
                        "êœ¹": "av",
                        "êœ»": "av",
                        "êœ½": "ay",
                        "â“‘": "b",
                        "ï½‚": "b",
                        "á¸ƒ": "b",
                        "á¸…": "b",
                        "á¸‡": "b",
                        "Æ€": "b",
                        "Æƒ": "b",
                        "É“": "b",
                        "â“’": "c",
                        "ï½ƒ": "c",
                        "Ä‡": "c",
                        "Ä‰": "c",
                        "Ä‹": "c",
                        "Ä": "c",
                        "Ã§": "c",
                        "á¸‰": "c",
                        "Æˆ": "c",
                        "È¼": "c",
                        "êœ¿": "c",
                        "â†„": "c",
                        "â““": "d",
                        "ï½„": "d",
                        "á¸‹": "d",
                        "Ä": "d",
                        "á¸": "d",
                        "á¸‘": "d",
                        "á¸“": "d",
                        "á¸": "d",
                        "Ä‘": "d",
                        "ÆŒ": "d",
                        "É–": "d",
                        "É—": "d",
                        "êº": "d",
                        "Ç³": "dz",
                        "Ç†": "dz",
                        "â“”": "e",
                        "ï½…": "e",
                        "Ã¨": "e",
                        "Ã©": "e",
                        "Ãª": "e",
                        "á»": "e",
                        "áº¿": "e",
                        "á»…": "e",
                        "á»ƒ": "e",
                        "áº½": "e",
                        "Ä“": "e",
                        "á¸•": "e",
                        "á¸—": "e",
                        "Ä•": "e",
                        "Ä—": "e",
                        "Ã«": "e",
                        "áº»": "e",
                        "Ä›": "e",
                        "È…": "e",
                        "È‡": "e",
                        "áº¹": "e",
                        "á»‡": "e",
                        "È©": "e",
                        "á¸": "e",
                        "Ä™": "e",
                        "á¸™": "e",
                        "á¸›": "e",
                        "É‡": "e",
                        "É›": "e",
                        "Ç": "e",
                        "â“•": "f",
                        "ï½†": "f",
                        "á¸Ÿ": "f",
                        "Æ’": "f",
                        "ê¼": "f",
                        "â“–": "g",
                        "ï½‡": "g",
                        "Çµ": "g",
                        "Ä": "g",
                        "á¸¡": "g",
                        "ÄŸ": "g",
                        "Ä¡": "g",
                        "Ç§": "g",
                        "Ä£": "g",
                        "Ç¥": "g",
                        "É ": "g",
                        "êž¡": "g",
                        "áµ¹": "g",
                        "ê¿": "g",
                        "â“—": "h",
                        "ï½ˆ": "h",
                        "Ä¥": "h",
                        "á¸£": "h",
                        "á¸§": "h",
                        "ÈŸ": "h",
                        "á¸¥": "h",
                        "á¸©": "h",
                        "á¸«": "h",
                        "áº–": "h",
                        "Ä§": "h",
                        "â±¨": "h",
                        "â±¶": "h",
                        "É¥": "h",
                        "Æ•": "hv",
                        "â“˜": "i",
                        "ï½‰": "i",
                        "Ã¬": "i",
                        "Ã­": "i",
                        "Ã®": "i",
                        "Ä©": "i",
                        "Ä«": "i",
                        "Ä­": "i",
                        "Ã¯": "i",
                        "á¸¯": "i",
                        "á»‰": "i",
                        "Ç": "i",
                        "È‰": "i",
                        "È‹": "i",
                        "á»‹": "i",
                        "Ä¯": "i",
                        "á¸­": "i",
                        "É¨": "i",
                        "Ä±": "i",
                        "â“™": "j",
                        "ï½Š": "j",
                        "Äµ": "j",
                        "Ç°": "j",
                        "É‰": "j",
                        "â“š": "k",
                        "ï½‹": "k",
                        "á¸±": "k",
                        "Ç©": "k",
                        "á¸³": "k",
                        "Ä·": "k",
                        "á¸µ": "k",
                        "Æ™": "k",
                        "â±ª": "k",
                        "ê": "k",
                        "êƒ": "k",
                        "ê…": "k",
                        "êž£": "k",
                        "â“›": "l",
                        "ï½Œ": "l",
                        "Å€": "l",
                        "Äº": "l",
                        "Ä¾": "l",
                        "á¸·": "l",
                        "á¸¹": "l",
                        "Ä¼": "l",
                        "á¸½": "l",
                        "á¸»": "l",
                        "Å¿": "l",
                        "Å‚": "l",
                        "Æš": "l",
                        "É«": "l",
                        "â±¡": "l",
                        "ê‰": "l",
                        "êž": "l",
                        "ê‡": "l",
                        "Ç‰": "lj",
                        "â“œ": "m",
                        "ï½": "m",
                        "á¸¿": "m",
                        "á¹": "m",
                        "á¹ƒ": "m",
                        "É±": "m",
                        "É¯": "m",
                        "â“": "n",
                        "ï½Ž": "n",
                        "Ç¹": "n",
                        "Å„": "n",
                        "Ã±": "n",
                        "á¹…": "n",
                        "Åˆ": "n",
                        "á¹‡": "n",
                        "Å†": "n",
                        "á¹‹": "n",
                        "á¹‰": "n",
                        "Æž": "n",
                        "É²": "n",
                        "Å‰": "n",
                        "êž‘": "n",
                        "êž¥": "n",
                        "ÇŒ": "nj",
                        "â“ž": "o",
                        "ï½": "o",
                        "Ã²": "o",
                        "Ã³": "o",
                        "Ã´": "o",
                        "á»“": "o",
                        "á»‘": "o",
                        "á»—": "o",
                        "á»•": "o",
                        "Ãµ": "o",
                        "á¹": "o",
                        "È­": "o",
                        "á¹": "o",
                        "Å": "o",
                        "á¹‘": "o",
                        "á¹“": "o",
                        "Å": "o",
                        "È¯": "o",
                        "È±": "o",
                        "Ã¶": "o",
                        "È«": "o",
                        "á»": "o",
                        "Å‘": "o",
                        "Ç’": "o",
                        "È": "o",
                        "È": "o",
                        "Æ¡": "o",
                        "á»": "o",
                        "á»›": "o",
                        "á»¡": "o",
                        "á»Ÿ": "o",
                        "á»£": "o",
                        "á»": "o",
                        "á»™": "o",
                        "Ç«": "o",
                        "Ç­": "o",
                        "Ã¸": "o",
                        "Ç¿": "o",
                        "É”": "o",
                        "ê‹": "o",
                        "ê": "o",
                        "Éµ": "o",
                        "Æ£": "oi",
                        "È£": "ou",
                        "ê": "oo",
                        "â“Ÿ": "p",
                        "ï½": "p",
                        "á¹•": "p",
                        "á¹—": "p",
                        "Æ¥": "p",
                        "áµ½": "p",
                        "ê‘": "p",
                        "ê“": "p",
                        "ê•": "p",
                        "â“ ": "q",
                        "ï½‘": "q",
                        "É‹": "q",
                        "ê—": "q",
                        "ê™": "q",
                        "â“¡": "r",
                        "ï½’": "r",
                        "Å•": "r",
                        "á¹™": "r",
                        "Å™": "r",
                        "È‘": "r",
                        "È“": "r",
                        "á¹›": "r",
                        "á¹": "r",
                        "Å—": "r",
                        "á¹Ÿ": "r",
                        "É": "r",
                        "É½": "r",
                        "ê›": "r",
                        "êž§": "r",
                        "êžƒ": "r",
                        "â“¢": "s",
                        "ï½“": "s",
                        "ÃŸ": "s",
                        "Å›": "s",
                        "á¹¥": "s",
                        "Å": "s",
                        "á¹¡": "s",
                        "Å¡": "s",
                        "á¹§": "s",
                        "á¹£": "s",
                        "á¹©": "s",
                        "È™": "s",
                        "ÅŸ": "s",
                        "È¿": "s",
                        "êž©": "s",
                        "êž…": "s",
                        "áº›": "s",
                        "â“£": "t",
                        "ï½”": "t",
                        "á¹«": "t",
                        "áº—": "t",
                        "Å¥": "t",
                        "á¹­": "t",
                        "È›": "t",
                        "Å£": "t",
                        "á¹±": "t",
                        "á¹¯": "t",
                        "Å§": "t",
                        "Æ­": "t",
                        "Êˆ": "t",
                        "â±¦": "t",
                        "êž‡": "t",
                        "êœ©": "tz",
                        "â“¤": "u",
                        "ï½•": "u",
                        "Ã¹": "u",
                        "Ãº": "u",
                        "Ã»": "u",
                        "Å©": "u",
                        "á¹¹": "u",
                        "Å«": "u",
                        "á¹»": "u",
                        "Å­": "u",
                        "Ã¼": "u",
                        "Çœ": "u",
                        "Ç˜": "u",
                        "Ç–": "u",
                        "Çš": "u",
                        "á»§": "u",
                        "Å¯": "u",
                        "Å±": "u",
                        "Ç”": "u",
                        "È•": "u",
                        "È—": "u",
                        "Æ°": "u",
                        "á»«": "u",
                        "á»©": "u",
                        "á»¯": "u",
                        "á»­": "u",
                        "á»±": "u",
                        "á»¥": "u",
                        "á¹³": "u",
                        "Å³": "u",
                        "á¹·": "u",
                        "á¹µ": "u",
                        "Ê‰": "u",
                        "â“¥": "v",
                        "ï½–": "v",
                        "á¹½": "v",
                        "á¹¿": "v",
                        "Ê‹": "v",
                        "êŸ": "v",
                        "ÊŒ": "v",
                        "ê¡": "vy",
                        "â“¦": "w",
                        "ï½—": "w",
                        "áº": "w",
                        "áºƒ": "w",
                        "Åµ": "w",
                        "áº‡": "w",
                        "áº…": "w",
                        "áº˜": "w",
                        "áº‰": "w",
                        "â±³": "w",
                        "â“§": "x",
                        "ï½˜": "x",
                        "áº‹": "x",
                        "áº": "x",
                        "â“¨": "y",
                        "ï½™": "y",
                        "á»³": "y",
                        "Ã½": "y",
                        "Å·": "y",
                        "á»¹": "y",
                        "È³": "y",
                        "áº": "y",
                        "Ã¿": "y",
                        "á»·": "y",
                        "áº™": "y",
                        "á»µ": "y",
                        "Æ´": "y",
                        "É": "y",
                        "á»¿": "y",
                        "â“©": "z",
                        "ï½š": "z",
                        "Åº": "z",
                        "áº‘": "z",
                        "Å¼": "z",
                        "Å¾": "z",
                        "áº“": "z",
                        "áº•": "z",
                        "Æ¶": "z",
                        "È¥": "z",
                        "É€": "z",
                        "â±¬": "z",
                        "ê£": "z",
                        "Î†": "Î‘",
                        "Îˆ": "Î•",
                        "Î‰": "Î—",
                        "ÎŠ": "Î™",
                        "Îª": "Î™",
                        "ÎŒ": "ÎŸ",
                        "ÎŽ": "Î¥",
                        "Î«": "Î¥",
                        "Î": "Î©",
                        "Î¬": "Î±",
                        "Î­": "Îµ",
                        "Î®": "Î·",
                        "Î¯": "Î¹",
                        "ÏŠ": "Î¹",
                        "Î": "Î¹",
                        "ÏŒ": "Î¿",
                        "Ï": "Ï…",
                        "Ï‹": "Ï…",
                        "Î°": "Ï…",
                        "Ï‰": "Ï‰",
                        "Ï‚": "Ïƒ"
                    }
                }), e.define("select2/data/base", ["../utils"], function(o) {
                    function e() {
                        e.__super__.constructor.call(this)
                    }
                    return o.Extend(e, o.Observable), e.prototype.current = function() {
                        throw new Error("The `current` method must be defined in child classes.")
                    }, e.prototype.query = function() {
                        throw new Error("The `query` method must be defined in child classes.")
                    }, e.prototype.bind = function() {}, e.prototype.destroy = function() {}, e.prototype.generateResultId = function(e, t) {
                        var i = e.id + "-result-";
                        return (i += o.generateChars(4)) + (null != t.id ? "-" + t.id.toString() : "-" + o.generateChars(4))
                    }, e
                }), e.define("select2/data/select", ["./base", "../utils", "jquery"], function(e, t, r) {
                    function i(e, t) {
                        this.$element = e, this.options = t, i.__super__.constructor.call(this)
                    }
                    return t.Extend(i, e), i.prototype.current = function(e) {
                        var i = [],
                            o = this;
                        this.$element.find(":selected").each(function() {
                            var e = r(this),
                                t = o.item(e);
                            i.push(t)
                        }), e(i)
                    }, i.prototype.select = function(n) {
                        var a = this;
                        if (n.selected = !0, r(n.element).is("option")) return n.element.selected = !0, void this.$element.trigger("change");
                        if (this.$element.prop("multiple")) this.current(function(e) {
                            var t = [];
                            (n = [n]).push.apply(n, e);
                            for (var i = 0; i < n.length; i++) {
                                var o = n[i].id; - 1 === r.inArray(o, t) && t.push(o)
                            }
                            a.$element.val(t), a.$element.trigger("change")
                        });
                        else {
                            var e = n.id;
                            this.$element.val(e), this.$element.trigger("change")
                        }
                    }, i.prototype.unselect = function(n) {
                        var a = this;
                        if (this.$element.prop("multiple")) return n.selected = !1, r(n.element).is("option") ? (n.element.selected = !1, void this.$element.trigger("change")) : void this.current(function(e) {
                            for (var t = [], i = 0; i < e.length; i++) {
                                var o = e[i].id;
                                o !== n.id && -1 === r.inArray(o, t) && t.push(o)
                            }
                            a.$element.val(t), a.$element.trigger("change")
                        })
                    }, i.prototype.bind = function(e) {
                        var t = this;
                        (this.container = e).on("select", function(e) {
                            t.select(e.data)
                        }), e.on("unselect", function(e) {
                            t.unselect(e.data)
                        })
                    }, i.prototype.destroy = function() {
                        this.$element.find("*").each(function() {
                            r.removeData(this, "data")
                        })
                    }, i.prototype.query = function(o, e) {
                        var n = [],
                            a = this;
                        this.$element.children().each(function() {
                            var e = r(this);
                            if (e.is("option") || e.is("optgroup")) {
                                var t = a.item(e),
                                    i = a.matches(o, t);
                                null !== i && n.push(i)
                            }
                        }), e({
                            results: n
                        })
                    }, i.prototype.addOptions = function(e) {
                        t.appendMany(this.$element, e)
                    }, i.prototype.option = function(e) {
                        var t;
                        e.children ? (t = document.createElement("optgroup")).label = e.text : void 0 !== (t = document.createElement("option")).textContent ? t.textContent = e.text : t.innerText = e.text, e.id && (t.value = e.id), e.disabled && (t.disabled = !0), e.selected && (t.selected = !0), e.title && (t.title = e.title);
                        var i = r(t),
                            o = this._normalizeItem(e);
                        return o.element = t, r.data(t, "data", o), i
                    }, i.prototype.item = function(e) {
                        var t = {};
                        if (null != (t = r.data(e[0], "data"))) return t;
                        if (e.is("option")) t = {
                            id: e.val(),
                            text: e.text(),
                            disabled: e.prop("disabled"),
                            selected: e.prop("selected"),
                            title: e.prop("title")
                        };
                        else if (e.is("optgroup")) {
                            t = {
                                text: e.prop("label"),
                                children: [],
                                title: e.prop("title")
                            };
                            for (var i = e.children("option"), o = [], n = 0; n < i.length; n++) {
                                var a = r(i[n]),
                                    s = this.item(a);
                                o.push(s)
                            }
                            t.children = o
                        }
                        return (t = this._normalizeItem(t)).element = e[0], r.data(e[0], "data", t), t
                    }, i.prototype._normalizeItem = function(e) {
                        r.isPlainObject(e) || (e = {
                            id: e,
                            text: e
                        });
                        return null != (e = r.extend({}, {
                            text: ""
                        }, e)).id && (e.id = e.id.toString()), null != e.text && (e.text = e.text.toString()), null == e._resultId && e.id && null != this.container && (e._resultId = this.generateResultId(this.container, e)), r.extend({}, {
                            selected: !1,
                            disabled: !1
                        }, e)
                    }, i.prototype.matches = function(e, t) {
                        return this.options.get("matcher")(e, t)
                    }, i
                }), e.define("select2/data/array", ["./select", "../utils", "jquery"], function(e, h, p) {
                    function o(e, t) {
                        var i = t.get("data") || [];
                        o.__super__.constructor.call(this, e, t), this.addOptions(this.convertToOptions(i))
                    }
                    return h.Extend(o, e), o.prototype.select = function(i) {
                        var e = this.$element.find("option").filter(function(e, t) {
                            return t.value == i.id.toString()
                        });
                        0 === e.length && (e = this.option(i), this.addOptions(e)), o.__super__.select.call(this, i)
                    }, o.prototype.convertToOptions = function(e) {
                        function t(e) {
                            return function() {
                                return p(this).val() == e.id
                            }
                        }
                        for (var i = this, o = this.$element.find("option"), n = o.map(function() {
                                return i.item(p(this)).id
                            }).get(), a = [], s = 0; s < e.length; s++) {
                            var r = this._normalizeItem(e[s]);
                            if (0 <= p.inArray(r.id, n)) {
                                var l = o.filter(t(r)),
                                    c = this.item(l),
                                    m = (p.extend(!0, {}, c, r), this.option(c));
                                l.replaceWith(m)
                            } else {
                                var d = this.option(r);
                                if (r.children) {
                                    var u = this.convertToOptions(r.children);
                                    h.appendMany(d, u)
                                }
                                a.push(d)
                            }
                        }
                        return a
                    }, o
                }), e.define("select2/data/ajax", ["./array", "../utils", "jquery"], function(i, e, a) {
                    function t(e, t) {
                        this.ajaxOptions = this._applyDefaults(t.get("ajax")), null != this.ajaxOptions.processResults && (this.processResults = this.ajaxOptions.processResults), i.__super__.constructor.call(this, e, t)
                    }
                    return e.Extend(t, i), t.prototype._applyDefaults = function(e) {
                        var t = {
                            data: function(e) {
                                return {
                                    q: e.term
                                }
                            },
                            transport: function(e, t, i) {
                                var o = a.ajax(e);
                                return o.then(t), o.fail(i), o
                            }
                        };
                        return a.extend({}, t, e, !0)
                    }, t.prototype.processResults = function(e) {
                        return e
                    }, t.prototype.query = function(i, o) {
                        function e() {
                            var e = t.transport(t, function(e) {
                                var t = n.processResults(e, i);
                                n.options.get("debug") && window.console && console.error && (t && t.results && a.isArray(t.results) || console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")), o(t)
                            }, function() {});
                            n._request = e
                        }
                        var n = this;
                        null != this._request && (a.isFunction(this._request.abort) && this._request.abort(), this._request = null);
                        var t = a.extend({
                            type: "GET"
                        }, this.ajaxOptions);
                        "function" == typeof t.url && (t.url = t.url(i)), "function" == typeof t.data && (t.data = t.data(i)), this.ajaxOptions.delay && "" !== i.term ? (this._queryTimeout && window.clearTimeout(this._queryTimeout), this._queryTimeout = window.setTimeout(e, this.ajaxOptions.delay)) : e()
                    }, t
                }), e.define("select2/data/tags", ["jquery"], function(c) {
                    function e(e, t, i) {
                        var o = i.get("tags"),
                            n = i.get("createTag");
                        if (void 0 !== n && (this.createTag = n), e.call(this, t, i), c.isArray(o))
                            for (var a = 0; a < o.length; a++) {
                                var s = o[a],
                                    r = this._normalizeItem(s),
                                    l = this.option(r);
                                this.$element.append(l)
                            }
                    }
                    return e.prototype.query = function(e, c, m) {
                        var d = this;
                        return this._removeOldTags(), null == c.term || null != c.page ? void e.call(this, c, m) : void e.call(this, c, function e(t, i) {
                            for (var o = t.results, n = 0; n < o.length; n++) {
                                var a = o[n],
                                    s = null != a.children && !e({
                                        results: a.children
                                    }, !0);
                                if (a.text === c.term || s) return !i && (t.data = o, void m(t))
                            }
                            if (i) return !0;
                            var r = d.createTag(c);
                            if (null != r) {
                                var l = d.option(r);
                                l.attr("data-select2-tag", !0), d.addOptions([l]), d.insertTag(o, r)
                            }
                            t.results = o, m(t)
                        })
                    }, e.prototype.createTag = function(e, t) {
                        var i = c.trim(t.term);
                        return "" === i ? null : {
                            id: i,
                            text: i
                        }
                    }, e.prototype.insertTag = function(e, t, i) {
                        t.unshift(i)
                    }, e.prototype._removeOldTags = function() {
                        (this._lastTag, this.$element.find("option[data-select2-tag]")).each(function() {
                            this.selected || c(this).remove()
                        })
                    }, e
                }), e.define("select2/data/tokenizer", ["jquery"], function(m) {
                    function e(e, t, i) {
                        var o = i.get("tokenizer");
                        void 0 !== o && (this.tokenizer = o), e.call(this, t, i)
                    }
                    return e.prototype.bind = function(e, t, i) {
                        e.call(this, t, i), this.$search = t.dropdown.$search || t.selection.$search || i.find(".select2-search__field")
                    }, e.prototype.query = function(e, t, i) {
                        var o = this;
                        t.term = t.term || "";
                        var n = this.tokenizer(t, this.options, function(e) {
                            o.select(e)
                        });
                        n.term !== t.term && (this.$search.length && (this.$search.val(n.term), this.$search.focus()), t.term = n.term), e.call(this, t, i)
                    }, e.prototype.tokenizer = function(e, t, i, o) {
                        for (var n = i.get("tokenSeparators") || [], a = t.term, s = 0, r = this.createTag || function(e) {
                                return {
                                    id: e.term,
                                    text: e.term
                                }
                            }; s < a.length;) {
                            var l = a[s];
                            if (-1 !== m.inArray(l, n)) {
                                var c = a.substr(0, s);
                                o(r(m.extend({}, t, {
                                    term: c
                                }))), a = a.substr(s + 1) || "", s = 0
                            } else s++
                        }
                        return {
                            term: a
                        }
                    }, e
                }), e.define("select2/data/minimumInputLength", [], function() {
                    function e(e, t, i) {
                        this.minimumInputLength = i.get("minimumInputLength"), e.call(this, t, i)
                    }
                    return e.prototype.query = function(e, t, i) {
                        return t.term = t.term || "", t.term.length < this.minimumInputLength ? void this.trigger("results:message", {
                            message: "inputTooShort",
                            args: {
                                minimum: this.minimumInputLength,
                                input: t.term,
                                params: t
                            }
                        }) : void e.call(this, t, i)
                    }, e
                }), e.define("select2/data/maximumInputLength", [], function() {
                    function e(e, t, i) {
                        this.maximumInputLength = i.get("maximumInputLength"), e.call(this, t, i)
                    }
                    return e.prototype.query = function(e, t, i) {
                        return t.term = t.term || "", 0 < this.maximumInputLength && t.term.length > this.maximumInputLength ? void this.trigger("results:message", {
                            message: "inputTooLong",
                            args: {
                                maximum: this.maximumInputLength,
                                input: t.term,
                                params: t
                            }
                        }) : void e.call(this, t, i)
                    }, e
                }), e.define("select2/data/maximumSelectionLength", [], function() {
                    function e(e, t, i) {
                        this.maximumSelectionLength = i.get("maximumSelectionLength"), e.call(this, t, i)
                    }
                    return e.prototype.query = function(i, o, n) {
                        var a = this;
                        this.current(function(e) {
                            var t = null != e ? e.length : 0;
                            return 0 < a.maximumSelectionLength && t >= a.maximumSelectionLength ? void a.trigger("results:message", {
                                message: "maximumSelected",
                                args: {
                                    maximum: a.maximumSelectionLength
                                }
                            }) : void i.call(a, o, n)
                        })
                    }, e
                }), e.define("select2/dropdown", ["jquery", "./utils"], function(t, e) {
                    function i(e, t) {
                        this.$element = e, this.options = t, i.__super__.constructor.call(this)
                    }
                    return e.Extend(i, e.Observable), i.prototype.render = function() {
                        var e = t('<span class="select2-dropdown"><span class="select2-results"></span></span>');
                        return e.attr("dir", this.options.get("dir")), this.$dropdown = e
                    }, i.prototype.position = function() {}, i.prototype.destroy = function() {
                        this.$dropdown.remove()
                    }, i
                }), e.define("select2/dropdown/search", ["jquery", "../utils"], function(n) {
                    function e() {}
                    return e.prototype.render = function(e) {
                        var t = e.call(this),
                            i = n('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');
                        return this.$searchContainer = i, this.$search = i.find("input"), t.prepend(i), t
                    }, e.prototype.bind = function(e, t, i) {
                        var o = this;
                        e.call(this, t, i), this.$search.on("keydown", function(e) {
                            o.trigger("keypress", e), o._keyUpPrevented = e.isDefaultPrevented()
                        }), this.$search.on("input", function() {
                            n(this).off("keyup")
                        }), this.$search.on("keyup input", function(e) {
                            o.handleSearch(e)
                        }), t.on("open", function() {
                            o.$search.attr("tabindex", 0), o.$search.focus(), window.setTimeout(function() {
                                o.$search.focus()
                            }, 0)
                        }), t.on("close", function() {
                            o.$search.attr("tabindex", -1), o.$search.val("")
                        }), t.on("results:all", function(e) {
                            null != e.query.term && "" !== e.query.term || (o.showSearch(e) ? o.$searchContainer.removeClass("select2-search--hide") : o.$searchContainer.addClass("select2-search--hide"))
                        })
                    }, e.prototype.handleSearch = function() {
                        if (!this._keyUpPrevented) {
                            var e = this.$search.val();
                            this.trigger("query", {
                                term: e
                            })
                        }
                        this._keyUpPrevented = !1
                    }, e.prototype.showSearch = function() {
                        return !0
                    }, e
                }), e.define("select2/dropdown/hidePlaceholder", [], function() {
                    function e(e, t, i, o) {
                        this.placeholder = this.normalizePlaceholder(i.get("placeholder")), e.call(this, t, i, o)
                    }
                    return e.prototype.append = function(e, t) {
                        t.results = this.removePlaceholder(t.results), e.call(this, t)
                    }, e.prototype.normalizePlaceholder = function(e, t) {
                        return "string" == typeof t && (t = {
                            id: "",
                            text: t
                        }), t
                    }, e.prototype.removePlaceholder = function(e, t) {
                        for (var i = t.slice(0), o = t.length - 1; 0 <= o; o--) {
                            var n = t[o];
                            this.placeholder.id === n.id && i.splice(o, 1)
                        }
                        return i
                    }, e
                }), e.define("select2/dropdown/infiniteScroll", ["jquery"], function(n) {
                    function e(e, t, i, o) {
                        this.lastParams = {}, e.call(this, t, i, o), this.$loadingMore = this.createLoadingMore(), this.loading = !1
                    }
                    return e.prototype.append = function(e, t) {
                        this.$loadingMore.remove(), this.loading = !1, e.call(this, t), this.showLoadingMore(t) && this.$results.append(this.$loadingMore)
                    }, e.prototype.bind = function(e, t, i) {
                        var o = this;
                        e.call(this, t, i), t.on("query", function(e) {
                            o.lastParams = e, o.loading = !0
                        }), t.on("query:append", function(e) {
                            o.lastParams = e, o.loading = !0
                        }), this.$results.on("scroll", function() {
                            var e = n.contains(document.documentElement, o.$loadingMore[0]);
                            if (!o.loading && e) {
                                var t = o.$results.offset().top + o.$results.outerHeight(!1);
                                o.$loadingMore.offset().top + o.$loadingMore.outerHeight(!1) <= t + 50 && o.loadMore()
                            }
                        })
                    }, e.prototype.loadMore = function() {
                        this.loading = !0;
                        var e = n.extend({}, {
                            page: 1
                        }, this.lastParams);
                        e.page++, this.trigger("query:append", e)
                    }, e.prototype.showLoadingMore = function(e, t) {
                        return t.pagination && t.pagination.more
                    }, e.prototype.createLoadingMore = function() {
                        var e = n('<li class="option load-more" role="treeitem"></li>'),
                            t = this.options.get("translations").get("loadingMore");
                        return e.html(t(this.lastParams)), e
                    }, e
                }), e.define("select2/dropdown/attachBody", ["jquery", "../utils"], function(u, s) {
                    function e(e, t, i) {
                        this.$dropdownParent = i.get("dropdownParent") || document.body, e.call(this, t, i)
                    }
                    return e.prototype.bind = function(e, t, i) {
                        var o = this,
                            n = !1;
                        e.call(this, t, i), t.on("open", function() {
                            o._showDropdown(), o._attachPositioningHandler(t), n || (n = !0, t.on("results:all", function() {
                                o._positionDropdown(), o._resizeDropdown()
                            }), t.on("results:append", function() {
                                o._positionDropdown(), o._resizeDropdown()
                            }))
                        }), t.on("close", function() {
                            o._hideDropdown(), o._detachPositioningHandler(t)
                        }), this.$dropdownContainer.on("mousedown", function(e) {
                            e.stopPropagation()
                        })
                    }, e.prototype.position = function(e, t, i) {
                        t.attr("class", i.attr("class")), t.removeClass("select2"), t.addClass("select2-container--open"), t.css({
                            position: "absolute",
                            top: -999999
                        }), this.$container = i
                    }, e.prototype.render = function(e) {
                        var t = u("<span></span>"),
                            i = e.call(this);
                        return t.append(i), this.$dropdownContainer = t
                    }, e.prototype._hideDropdown = function() {
                        this.$dropdownContainer.detach()
                    }, e.prototype._attachPositioningHandler = function(e) {
                        var t = this,
                            i = "scroll.select2." + e.id,
                            o = "resize.select2." + e.id,
                            n = "orientationchange.select2." + e.id,
                            a = this.$container.parents().filter(s.hasScroll);
                        a.each(function() {
                            u(this).data("select2-scroll-position", {
                                x: u(this).scrollLeft(),
                                y: u(this).scrollTop()
                            })
                        }), a.on(i, function() {
                            var e = u(this).data("select2-scroll-position");
                            u(this).scrollTop(e.y)
                        }), u(window).on(i + " " + o + " " + n, function() {
                            t._positionDropdown(), t._resizeDropdown()
                        })
                    }, e.prototype._detachPositioningHandler = function(e) {
                        var t = "scroll.select2." + e.id,
                            i = "resize.select2." + e.id,
                            o = "orientationchange.select2." + e.id;
                        this.$container.parents().filter(s.hasScroll).off(t), u(window).off(t + " " + i + " " + o)
                    }, e.prototype._positionDropdown = function() {
                        var e = u(window),
                            t = this.$dropdown.hasClass("select2-dropdown--above"),
                            i = this.$dropdown.hasClass("select2-dropdown--below"),
                            o = null,
                            n = (this.$container.position(), this.$container.offset());
                        n.bottom = n.top + this.$container.outerHeight(!1);
                        var a = {
                            height: this.$container.outerHeight(!1)
                        };
                        a.top = n.top, a.bottom = n.top + a.height;
                        var s = this.$dropdown.outerHeight(!1),
                            r = e.scrollTop(),
                            l = e.scrollTop() + e.height(),
                            c = r < n.top - s,
                            m = l > n.bottom + s,
                            d = {
                                left: n.left,
                                top: a.bottom
                            };
                        t || i || (o = "below"), m || !c || t ? !c && m && t && (o = "below") : o = "above", ("above" == o || t && "below" !== o) && (d.top = a.top - s), null != o && (this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--" + o), this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--" + o)), this.$dropdownContainer.css(d)
                    }, e.prototype._resizeDropdown = function() {
                        this.$dropdownContainer.width();
                        var e = {
                            width: this.$container.outerWidth(!1) + "px"
                        };
                        this.options.get("dropdownAutoWidth") && (e.minWidth = e.width, e.width = "auto"), this.$dropdown.css(e)
                    }, e.prototype._showDropdown = function() {
                        this.$dropdownContainer.appendTo(this.$dropdownParent), this._positionDropdown(), this._resizeDropdown()
                    }, e
                }), e.define("select2/dropdown/minimumResultsForSearch", [], function() {
                    function e(e, t, i, o) {
                        this.minimumResultsForSearch = i.get("minimumResultsForSearch"), this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0), e.call(this, t, i, o)
                    }
                    return e.prototype.showSearch = function(e, t) {
                        return !(function e(t) {
                            for (var i = 0, o = 0; o < t.length; o++) {
                                var n = t[o];
                                n.children ? i += e(n.children) : i++
                            }
                            return i
                        }(t.data.results) < this.minimumResultsForSearch) && e.call(this, t)
                    }, e
                }), e.define("select2/dropdown/selectOnClose", [], function() {
                    function e() {}
                    return e.prototype.bind = function(e, t, i) {
                        var o = this;
                        e.call(this, t, i), t.on("close", function() {
                            o._handleSelectOnClose()
                        })
                    }, e.prototype._handleSelectOnClose = function() {
                        var e = this.getHighlightedResults();
                        e.length < 1 || this.trigger("select", {
                            data: e.data("data")
                        })
                    }, e
                }), e.define("select2/dropdown/closeOnSelect", [], function() {
                    function e() {}
                    return e.prototype.bind = function(e, t, i) {
                        var o = this;
                        e.call(this, t, i), t.on("select", function(e) {
                            o._selectTriggered(e)
                        }), t.on("unselect", function(e) {
                            o._selectTriggered(e)
                        })
                    }, e.prototype._selectTriggered = function(e, t) {
                        var i = t.originalEvent;
                        i && i.ctrlKey || this.trigger("close")
                    }, e
                }), e.define("select2/i18n/en", [], function() {
                    return {
                        errorLoading: function() {
                            return "The results could not be loaded."
                        },
                        inputTooLong: function(e) {
                            var t = e.input.length - e.maximum,
                                i = "Please delete " + t + " character";
                            return 1 != t && (i += "s"), i
                        },
                        inputTooShort: function(e) {
                            return "Please enter " + (e.minimum - e.input.length) + " or more characters"
                        },
                        loadingMore: function() {
                            return "Loading more resultsâ€¦"
                        },
                        maximumSelected: function(e) {
                            var t = "You can only select " + e.maximum + " item";
                            return 1 != e.maximum && (t += "s"), t
                        },
                        noResults: function() {
                            return "No results found"
                        },
                        searching: function() {
                            return "Searchingâ€¦"
                        }
                    }
                }), e.define("select2/defaults", ["jquery", "require", "./results", "./selection/single", "./selection/multiple", "./selection/placeholder", "./selection/allowClear", "./selection/search", "./selection/eventRelay", "./utils", "./translation", "./diacritics", "./data/select", "./data/array", "./data/ajax", "./data/tags", "./data/tokenizer", "./data/minimumInputLength", "./data/maximumInputLength", "./data/maximumSelectionLength", "./dropdown", "./dropdown/search", "./dropdown/hidePlaceholder", "./dropdown/infiniteScroll", "./dropdown/attachBody", "./dropdown/minimumResultsForSearch", "./dropdown/selectOnClose", "./dropdown/closeOnSelect", "./i18n/en"], function(p, f, g, v, y, w, b, _, k, C, x, t, S, T, E, A, $, I, D, O, z, j, P, L, M, N, H, B, e) {
                    function i() {
                        this.reset()
                    }
                    return i.prototype.apply = function(t) {
                        if (null == (t = p.extend({}, this.defaults, t)).dataAdapter) {
                            if (t.dataAdapter = null != t.ajax ? E : null != t.data ? T : S, 0 < t.minimumInputLength && (t.dataAdapter = C.Decorate(t.dataAdapter, I)), 0 < t.maximumInputLength && (t.dataAdapter = C.Decorate(t.dataAdapter, D)), 0 < t.maximumSelectionLength && (t.dataAdapter = C.Decorate(t.dataAdapter, O)), t.tags && (t.dataAdapter = C.Decorate(t.dataAdapter, A)), (null != t.tokenSeparators || null != t.tokenizer) && (t.dataAdapter = C.Decorate(t.dataAdapter, $)), null != t.query) {
                                var e = f(t.amdBase + "compat/query");
                                t.dataAdapter = C.Decorate(t.dataAdapter, e)
                            }
                            if (null != t.initSelection) {
                                var i = f(t.amdBase + "compat/initSelection");
                                t.dataAdapter = C.Decorate(t.dataAdapter, i)
                            }
                        }
                        if (null == t.resultsAdapter && (t.resultsAdapter = g, null != t.ajax && (t.resultsAdapter = C.Decorate(t.resultsAdapter, L)), null != t.placeholder && (t.resultsAdapter = C.Decorate(t.resultsAdapter, P)), t.selectOnClose && (t.resultsAdapter = C.Decorate(t.resultsAdapter, H))), null == t.dropdownAdapter) {
                            if (t.multiple) t.dropdownAdapter = z;
                            else {
                                var o = C.Decorate(z, j);
                                t.dropdownAdapter = o
                            }
                            if (0 !== t.minimumResultsForSearch && (t.dropdownAdapter = C.Decorate(t.dropdownAdapter, N)), t.closeOnSelect && (t.dropdownAdapter = C.Decorate(t.dropdownAdapter, B)), null != t.dropdownCssClass || null != t.dropdownCss || null != t.adaptDropdownCssClass) {
                                var n = f(t.amdBase + "compat/dropdownCss");
                                t.dropdownAdapter = C.Decorate(t.dropdownAdapter, n)
                            }
                            t.dropdownAdapter = C.Decorate(t.dropdownAdapter, M)
                        }
                        if (null == t.selectionAdapter) {
                            if (t.selectionAdapter = t.multiple ? y : v, null != t.placeholder && (t.selectionAdapter = C.Decorate(t.selectionAdapter, w)), t.allowClear && (t.selectionAdapter = C.Decorate(t.selectionAdapter, b)), t.multiple && (t.selectionAdapter = C.Decorate(t.selectionAdapter, _)), null != t.containerCssClass || null != t.containerCss || null != t.adaptContainerCssClass) {
                                var a = f(t.amdBase + "compat/containerCss");
                                t.selectionAdapter = C.Decorate(t.selectionAdapter, a)
                            }
                            t.selectionAdapter = C.Decorate(t.selectionAdapter, k)
                        }
                        if ("string" == typeof t.language)
                            if (0 < t.language.indexOf("-")) {
                                var s = t.language.split("-")[0];
                                t.language = [t.language, s]
                            } else t.language = [t.language];
                        if (p.isArray(t.language)) {
                            var r = new x;
                            t.language.push("en");
                            for (var l = t.language, c = 0; c < l.length; c++) {
                                var m = l[c],
                                    d = {};
                                try {
                                    d = x.loadPath(m)
                                } catch (e) {
                                    try {
                                        m = this.defaults.amdLanguageBase + m, d = x.loadPath(m)
                                    } catch (e) {
                                        t.debug && window.console && console.warn && console.warn('Select2: The language file for "' + m + '" could not be automatically loaded. A fallback will be used instead.');
                                        continue
                                    }
                                }
                                r.extend(d)
                            }
                            t.translations = r
                        } else {
                            var u = x.loadPath(this.defaults.amdLanguageBase + "en"),
                                h = new x(t.language);
                            h.extend(u), t.translations = h
                        }
                        return t
                    }, i.prototype.reset = function() {
                        function r(e) {
                            return e.replace(/[^\u0000-\u007E]/g, function(e) {
                                return t[e] || e
                            })
                        }
                        this.defaults = {
                            amdBase: "./",
                            amdLanguageBase: "./i18n/",
                            closeOnSelect: !0,
                            debug: !1,
                            dropdownAutoWidth: !1,
                            escapeMarkup: C.escapeMarkup,
                            language: e,
                            matcher: function e(t, i) {
                                if ("" === p.trim(t.term)) return i;
                                if (i.children && 0 < i.children.length) {
                                    for (var o = p.extend(!0, {}, i), n = i.children.length - 1; 0 <= n; n--) null == e(t, i.children[n]) && o.children.splice(n, 1);
                                    return 0 < o.children.length ? o : e(t, o)
                                }
                                var a = r(i.text).toUpperCase(),
                                    s = r(t.term).toUpperCase();
                                return -1 < a.indexOf(s) ? i : null
                            },
                            minimumInputLength: 0,
                            maximumInputLength: 0,
                            maximumSelectionLength: 0,
                            minimumResultsForSearch: 0,
                            selectOnClose: !1,
                            sorter: function(e) {
                                return e
                            },
                            templateResult: function(e) {
                                return e.text
                            },
                            templateSelection: function(e) {
                                return e.text
                            },
                            theme: "default",
                            width: "resolve"
                        }
                    }, i.prototype.set = function(e, t) {
                        var i = {};
                        i[p.camelCase(e)] = t;
                        var o = C._convertData(i);
                        p.extend(this.defaults, o)
                    }, new i
                }), e.define("select2/options", ["require", "jquery", "./defaults", "./utils"], function(o, a, n, s) {
                    function e(e, t) {
                        if (this.options = e, null != t && this.fromElement(t), this.options = n.apply(this.options), t && t.is("input")) {
                            var i = o(this.get("amdBase") + "compat/inputData");
                            this.options.dataAdapter = s.Decorate(this.options.dataAdapter, i)
                        }
                    }
                    return e.prototype.fromElement = function(e) {
                        var t = ["select2"];
                        null == this.options.multiple && (this.options.multiple = e.prop("multiple")), null == this.options.disabled && (this.options.disabled = e.prop("disabled")), null == this.options.language && (e.prop("lang") ? this.options.language = e.prop("lang").toLowerCase() : e.closest("[lang]").prop("lang") && (this.options.language = e.closest("[lang]").prop("lang"))), null == this.options.dir && (this.options.dir = e.prop("dir") ? e.prop("dir") : e.closest("[dir]").prop("dir") ? e.closest("[dir]").prop("dir") : "ltr"), e.prop("disabled", this.options.disabled), e.prop("multiple", this.options.multiple), e.data("select2Tags") && (this.options.debug && window.console && console.warn && console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'), e.data("data", e.data("select2Tags")), e.data("tags", !0)), e.data("ajaxUrl") && (this.options.debug && window.console && console.warn && console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."), e.attr("ajax--url", e.data("ajaxUrl")), e.data("ajax--url", e.data("ajaxUrl")));
                        var i;
                        i = a.fn.jquery && "1." == a.fn.jquery.substr(0, 2) && e[0].dataset ? a.extend(!0, {}, e[0].dataset, e.data()) : e.data();
                        var o = a.extend(!0, {}, i);
                        for (var n in o = s._convertData(o)) - 1 < a.inArray(n, t) || (a.isPlainObject(this.options[n]) ? a.extend(this.options[n], o[n]) : this.options[n] = o[n]);
                        return this
                    }, e.prototype.get = function(e) {
                        return this.options[e]
                    }, e.prototype.set = function(e, t) {
                        this.options[e] = t
                    }, e
                }), e.define("select2/core", ["jquery", "./options", "./utils", "./keys"], function(n, c, i, o) {
                    var m = function(e, t) {
                        null != e.data("select2") && e.data("select2").destroy(), this.$element = e, this.id = this._generateId(e), t = t || {}, this.options = new c(t, e), m.__super__.constructor.call(this);
                        var i = e.attr("tabindex") || 0;
                        e.data("old-tabindex", i), e.attr("tabindex", "-1");
                        var o = this.options.get("dataAdapter");
                        this.dataAdapter = new o(e, this.options);
                        var n = this.render();
                        this._placeContainer(n);
                        var a = this.options.get("selectionAdapter");
                        this.selection = new a(e, this.options), this.$selection = this.selection.render(), this.selection.position(this.$selection, n);
                        var s = this.options.get("dropdownAdapter");
                        this.dropdown = new s(e, this.options), this.$dropdown = this.dropdown.render(), this.dropdown.position(this.$dropdown, n);
                        var r = this.options.get("resultsAdapter");
                        this.results = new r(e, this.options, this.dataAdapter), this.$results = this.results.render(), this.results.position(this.$results, this.$dropdown);
                        var l = this;
                        this._bindAdapters(), this._registerDomEvents(), this._registerDataEvents(), this._registerSelectionEvents(), this._registerDropdownEvents(), this._registerResultsEvents(), this._registerEvents(), this.dataAdapter.current(function(e) {
                            l.trigger("selection:update", {
                                data: e
                            })
                        }), e.addClass("select2-hidden-accessible"), e.attr("aria-hidden", "true"), this._syncAttributes(), e.data("select2", this)
                    };
                    return i.Extend(m, i.Observable), m.prototype._generateId = function(e) {
                        return "select2-" + (null != e.attr("id") ? e.attr("id") : null != e.attr("name") ? e.attr("name") + "-" + i.generateChars(2) : i.generateChars(4))
                    }, m.prototype._placeContainer = function(e) {
                        e.insertAfter(this.$element);
                        var t = this._resolveWidth(this.$element, this.options.get("width"));
                        null != t && e.css("width", t)
                    }, m.prototype._resolveWidth = function(e, t) {
                        var i = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                        if ("resolve" == t) {
                            var o = this._resolveWidth(e, "style");
                            return null != o ? o : this._resolveWidth(e, "element")
                        }
                        if ("element" == t) {
                            var n = e.outerWidth(!1);
                            return n <= 0 ? "auto" : n + "px"
                        }
                        if ("style" == t) {
                            var a = e.attr("style");
                            if ("string" != typeof a) return null;
                            for (var s = a.split(";"), r = 0, l = s.length; r < l; r += 1) {
                                var c = s[r].replace(/\s/g, "").match(i);
                                if (null !== c && 1 <= c.length) return c[1]
                            }
                            return null
                        }
                        return t
                    }, m.prototype._bindAdapters = function() {
                        this.dataAdapter.bind(this, this.$container), this.selection.bind(this, this.$container), this.dropdown.bind(this, this.$container), this.results.bind(this, this.$container)
                    }, m.prototype._registerDomEvents = function() {
                        var t = this;
                        this.$element.on("change.select2", function() {
                            t.dataAdapter.current(function(e) {
                                t.trigger("selection:update", {
                                    data: e
                                })
                            })
                        }), this._sync = i.bind(this._syncAttributes, this), this.$element[0].attachEvent && this.$element[0].attachEvent("onpropertychange", this._sync);
                        var e = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                        null != e ? (this._observer = new e(function(e) {
                            n.each(e, t._sync)
                        }), this._observer.observe(this.$element[0], {
                            attributes: !0,
                            subtree: !1
                        })) : this.$element[0].addEventListener && this.$element[0].addEventListener("DOMAttrModified", t._sync, !1)
                    }, m.prototype._registerDataEvents = function() {
                        var i = this;
                        this.dataAdapter.on("*", function(e, t) {
                            i.trigger(e, t)
                        })
                    }, m.prototype._registerSelectionEvents = function() {
                        var i = this,
                            o = ["toggle"];
                        this.selection.on("toggle", function() {
                            i.toggleDropdown()
                        }), this.selection.on("*", function(e, t) {
                            -1 === n.inArray(e, o) && i.trigger(e, t)
                        })
                    }, m.prototype._registerDropdownEvents = function() {
                        var i = this;
                        this.dropdown.on("*", function(e, t) {
                            i.trigger(e, t)
                        })
                    }, m.prototype._registerResultsEvents = function() {
                        var i = this;
                        this.results.on("*", function(e, t) {
                            i.trigger(e, t)
                        })
                    }, m.prototype._registerEvents = function() {
                        var i = this;
                        this.on("open", function() {
                            i.$container.addClass("select2-container--open")
                        }), this.on("close", function() {
                            i.$container.removeClass("select2-container--open")
                        }), this.on("enable", function() {
                            i.$container.removeClass("select2-container--disabled")
                        }), this.on("disable", function() {
                            i.$container.addClass("select2-container--disabled")
                        }), this.on("focus", function() {
                            i.$container.addClass("select2-container--focus")
                        }), this.on("blur", function() {
                            i.$container.removeClass("select2-container--focus")
                        }), this.on("query", function(t) {
                            i.isOpen() || i.trigger("open"), this.dataAdapter.query(t, function(e) {
                                i.trigger("results:all", {
                                    data: e,
                                    query: t
                                })
                            })
                        }), this.on("query:append", function(t) {
                            this.dataAdapter.query(t, function(e) {
                                i.trigger("results:append", {
                                    data: e,
                                    query: t
                                })
                            })
                        }), this.on("keypress", function(e) {
                            var t = e.which;
                            i.isOpen() ? t === o.ENTER ? (i.trigger("results:select"), e.preventDefault()) : t === o.SPACE && e.ctrlKey ? (i.trigger("results:toggle"), e.preventDefault()) : t === o.UP ? (i.trigger("results:previous"), e.preventDefault()) : t === o.DOWN ? (i.trigger("results:next"), e.preventDefault()) : (t === o.ESC || t === o.TAB) && (i.close(), e.preventDefault()) : (t === o.ENTER || t === o.SPACE || (t === o.DOWN || t === o.UP) && e.altKey) && (i.open(), e.preventDefault())
                        })
                    }, m.prototype._syncAttributes = function() {
                        this.options.set("disabled", this.$element.prop("disabled")), this.options.get("disabled") ? (this.isOpen() && this.close(), this.trigger("disable")) : this.trigger("enable")
                    }, m.prototype.trigger = function(e, t) {
                        var i = m.__super__.trigger,
                            o = {
                                open: "opening",
                                close: "closing",
                                select: "selecting",
                                unselect: "unselecting"
                            };
                        if (e in o) {
                            var n = o[e],
                                a = {
                                    prevented: !1,
                                    name: e,
                                    args: t
                                };
                            if (i.call(this, n, a), a.prevented) return void(t.prevented = !0)
                        }
                        i.call(this, e, t)
                    }, m.prototype.toggleDropdown = function() {
                        this.options.get("disabled") || (this.isOpen() ? this.close() : this.open())
                    }, m.prototype.open = function() {
                        this.isOpen() || (this.trigger("query", {}), this.trigger("open"))
                    }, m.prototype.close = function() {
                        this.isOpen() && this.trigger("close")
                    }, m.prototype.isOpen = function() {
                        return this.$container.hasClass("select2-container--open")
                    }, m.prototype.enable = function(e) {
                        this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'), (null == e || 0 === e.length) && (e = [!0]);
                        var t = !e[0];
                        this.$element.prop("disabled", t)
                    }, m.prototype.data = function() {
                        this.options.get("debug") && 0 < arguments.length && window.console && console.warn && console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');
                        var t = [];
                        return this.dataAdapter.current(function(e) {
                            t = e
                        }), t
                    }, m.prototype.val = function(e) {
                        if (this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'), null == e || 0 === e.length) return this.$element.val();
                        var t = e[0];
                        n.isArray(t) && (t = n.map(t, function(e) {
                            return e.toString()
                        })), this.$element.val(t).trigger("change")
                    }, m.prototype.destroy = function() {
                        this.$container.remove(), this.$element[0].detachEvent && this.$element[0].detachEvent("onpropertychange", this._sync), null != this._observer ? (this._observer.disconnect(), this._observer = null) : this.$element[0].removeEventListener && this.$element[0].removeEventListener("DOMAttrModified", this._sync, !1), this._sync = null, this.$element.off(".select2"), this.$element.attr("tabindex", this.$element.data("old-tabindex")), this.$element.removeClass("select2-hidden-accessible"), this.$element.attr("aria-hidden", "false"), this.$element.removeData("select2"), this.dataAdapter.destroy(), this.selection.destroy(), this.dropdown.destroy(), this.results.destroy(), this.dataAdapter = null, this.selection = null, this.dropdown = null, this.results = null
                    }, m.prototype.render = function() {
                        var e = n('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');
                        return e.attr("dir", this.options.get("dir")), this.$container = e, this.$container.addClass("select2-container--" + this.options.get("theme")), e.data("element", this.$element), e
                    }, m
                }), e.define("select2/compat/utils", ["jquery"], function(s) {
                    return {
                        syncCssClasses: function(e, t, i) {
                            var o, n, a = [];
                            (o = s.trim(e.attr("class"))) && s((o = "" + o).split(/\s+/)).each(function() {
                                0 === this.indexOf("select2-") && a.push(this)
                            }), (o = s.trim(t.attr("class"))) && s((o = "" + o).split(/\s+/)).each(function() {
                                0 !== this.indexOf("select2-") && null != (n = i(this)) && a.push(n)
                            }), e.attr("class", a.join(" "))
                        }
                    }
                }), e.define("select2/compat/containerCss", ["jquery", "./utils"], function(s, r) {
                    function l() {
                        return null
                    }

                    function e() {}
                    return e.prototype.render = function(e) {
                        var t = e.call(this),
                            i = this.options.get("containerCssClass") || "";
                        s.isFunction(i) && (i = i(this.$element));
                        var o = this.options.get("adaptContainerCssClass");
                        if (o = o || l, -1 !== i.indexOf(":all:")) {
                            i = i.replace(":all", "");
                            var n = o;
                            o = function(e) {
                                var t = n(e);
                                return null != t ? t + " " + e : e
                            }
                        }
                        var a = this.options.get("containerCss") || {};
                        return s.isFunction(a) && (a = a(this.$element)), r.syncCssClasses(t, this.$element, o), t.css(a), t.addClass(i), t
                    }, e
                }), e.define("select2/compat/dropdownCss", ["jquery", "./utils"], function(s, r) {
                    function l() {
                        return null
                    }

                    function e() {}
                    return e.prototype.render = function(e) {
                        var t = e.call(this),
                            i = this.options.get("dropdownCssClass") || "";
                        s.isFunction(i) && (i = i(this.$element));
                        var o = this.options.get("adaptDropdownCssClass");
                        if (o = o || l, -1 !== i.indexOf(":all:")) {
                            i = i.replace(":all", "");
                            var n = o;
                            o = function(e) {
                                var t = n(e);
                                return null != t ? t + " " + e : e
                            }
                        }
                        var a = this.options.get("dropdownCss") || {};
                        return s.isFunction(a) && (a = a(this.$element)), r.syncCssClasses(t, this.$element, o), t.css(a), t.addClass(i), t
                    }, e
                }), e.define("select2/compat/initSelection", ["jquery"], function(o) {
                    function e(e, t, i) {
                        i.get("debug") && window.console && console.warn && console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"), this.initSelection = i.get("initSelection"), this._isInitialized = !1, e.call(this, t, i)
                    }
                    return e.prototype.current = function(e, t) {
                        var i = this;
                        return this._isInitialized ? void e.call(this, t) : void this.initSelection.call(null, this.$element, function(e) {
                            i._isInitialized = !0, o.isArray(e) || (e = [e]), t(e)
                        })
                    }, e
                }), e.define("select2/compat/inputData", ["jquery"], function(s) {
                    function e(e, t, i) {
                        this._currentData = [], this._valueSeparator = i.get("valueSeparator") || ",", "hidden" === t.prop("type") && i.get("debug") && console && console.warn && console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."), e.call(this, t, i)
                    }
                    return e.prototype.current = function(e, t) {
                        function o(e, t) {
                            var i = [];
                            return e.selected || -1 !== s.inArray(e.id, t) ? (e.selected = !0, i.push(e)) : e.selected = !1, e.children && i.push.apply(i, o(e.children, t)), i
                        }
                        for (var i = [], n = 0; n < this._currentData.length; n++) {
                            var a = this._currentData[n];
                            i.push.apply(i, o(a, this.$element.val().split(this._valueSeparator)))
                        }
                        t(i)
                    }, e.prototype.select = function(e, t) {
                        if (this.options.get("multiple")) {
                            var i = this.$element.val();
                            i += this._valueSeparator + t.id, this.$element.val(i), this.$element.trigger("change")
                        } else this.current(function(e) {
                            s.map(e, function(e) {
                                e.selected = !1
                            })
                        }), this.$element.val(t.id), this.$element.trigger("change")
                    }, e.prototype.unselect = function(e, n) {
                        var a = this;
                        n.selected = !1, this.current(function(e) {
                            for (var t = [], i = 0; i < e.length; i++) {
                                var o = e[i];
                                n.id != o.id && t.push(o.id)
                            }
                            a.$element.val(t.join(a._valueSeparator)), a.$element.trigger("change")
                        })
                    }, e.prototype.query = function(e, t, i) {
                        for (var o = [], n = 0; n < this._currentData.length; n++) {
                            var a = this._currentData[n],
                                s = this.matches(t, a);
                            null !== s && o.push(s)
                        }
                        i({
                            results: o
                        })
                    }, e.prototype.addOptions = function(e, t) {
                        var i = s.map(t, function(e) {
                            return s.data(e[0], "data")
                        });
                        this._currentData.push.apply(this._currentData, i)
                    }, e
                }), e.define("select2/compat/matcher", ["jquery"], function(s) {
                    return function(a) {
                        return function(e, t) {
                            var i = s.extend(!0, {}, t);
                            if (null == e.term || "" === s.trim(e.term)) return i;
                            if (t.children) {
                                for (var o = t.children.length - 1; 0 <= o; o--) {
                                    var n = t.children[o];
                                    a(e.term, n.text, n) || i.children.splice(o, 1)
                                }
                                if (0 < i.children.length) return i
                            }
                            return a(e.term, t.text, t) ? i : null
                        }
                    }
                }), e.define("select2/compat/query", [], function() {
                    function e(e, t, i) {
                        i.get("debug") && window.console && console.warn && console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."), e.call(this, t, i)
                    }
                    return e.prototype.query = function(e, t, i) {
                        t.callback = i, this.options.get("query").call(null, t)
                    }, e
                }), e.define("select2/dropdown/attachContainer", [], function() {
                    function e(e, t, i) {
                        e.call(this, t, i)
                    }
                    return e.prototype.position = function(e, t, i) {
                        i.find(".dropdown-wrapper").append(t), t.addClass("select2-dropdown--below"), i.addClass("select2-container--below")
                    }, e
                }), e.define("select2/dropdown/stopPropagation", [], function() {
                    function e() {}
                    return e.prototype.bind = function(e, t, i) {
                        e.call(this, t, i);
                        this.$dropdown.on(["blur", "change", "click", "dblclick", "focus", "focusin", "focusout", "input", "keydown", "keyup", "keypress", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseup", "search", "touchend", "touchstart"].join(" "), function(e) {
                            e.stopPropagation()
                        })
                    }, e
                }), e.define("select2/selection/stopPropagation", [], function() {
                    function e() {}
                    return e.prototype.bind = function(e, t, i) {
                        e.call(this, t, i);
                        this.$selection.on(["blur", "change", "click", "dblclick", "focus", "focusin", "focusout", "input", "keydown", "keyup", "keypress", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseup", "search", "touchend", "touchstart"].join(" "), function(e) {
                            e.stopPropagation()
                        })
                    }, e
                }), e.define("jquery.select2", ["jquery", "require", "./select2/core", "./select2/defaults"], function(n, e, a, t) {
                    if (e("jquery.mousewheel"), null == n.fn.select2) {
                        var s = ["open", "close", "destroy"];
                        n.fn.select2 = function(t) {
                            if ("object" == typeof(t = t || {})) return this.each(function() {
                                var e = n.extend({}, t, !0);
                                new a(n(this), e)
                            }), this;
                            if ("string" == typeof t) {
                                var e = this.data("select2");
                                null == e && window.console && console.error && console.error("The select2('" + t + "') method was called on an element that is not using Select2.");
                                var i = Array.prototype.slice.call(arguments, 1),
                                    o = e[t](i);
                                return -1 < n.inArray(t, s) ? this : o
                            }
                            throw new Error("Invalid arguments for Select2: " + t)
                        }
                    }
                    return null == n.fn.select2.defaults && (n.fn.select2.defaults = t), a
                }), t = function(u) {
                    function t(e) {
                        var t = e || window.event,
                            i = v.call(arguments, 1),
                            o = 0,
                            n = 0,
                            a = 0,
                            s = 0,
                            r = 0,
                            l = 0;
                        if ((e = u.event.fix(t)).type = "mousewheel", "detail" in t && (a = -1 * t.detail), "wheelDelta" in t && (a = t.wheelDelta), "wheelDeltaY" in t && (a = t.wheelDeltaY), "wheelDeltaX" in t && (n = -1 * t.wheelDeltaX), "axis" in t && t.axis === t.HORIZONTAL_AXIS && (n = -1 * a, a = 0), o = 0 === a ? n : a, "deltaY" in t && (o = a = -1 * t.deltaY), "deltaX" in t && (n = t.deltaX, 0 === a && (o = -1 * n)), 0 !== a || 0 !== n) {
                            if (1 === t.deltaMode) {
                                var c = u.data(this, "mousewheel-line-height");
                                o *= c, a *= c, n *= c
                            } else if (2 === t.deltaMode) {
                                var m = u.data(this, "mousewheel-page-height");
                                o *= m, a *= m, n *= m
                            }
                            if (s = Math.max(Math.abs(a), Math.abs(n)), (!g || s < g) && (p(t, g = s) && (g /= 40)), p(t, s) && (o /= 40, n /= 40, a /= 40), o = Math[1 <= o ? "floor" : "ceil"](o / g), n = Math[1 <= n ? "floor" : "ceil"](n / g), a = Math[1 <= a ? "floor" : "ceil"](a / g), y.settings.normalizeOffset && this.getBoundingClientRect) {
                                var d = this.getBoundingClientRect();
                                r = e.clientX - d.left, l = e.clientY - d.top
                            }
                            return e.deltaX = n, e.deltaY = a, e.deltaFactor = g, e.offsetX = r, e.offsetY = l, e.deltaMode = 0, i.unshift(e, o, n, a), f && clearTimeout(f), f = setTimeout(h, 200), (u.event.dispatch || u.event.handle).apply(this, i)
                        }
                    }

                    function h() {
                        g = null
                    }

                    function p(e, t) {
                        return y.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0
                    }
                    var f, g, e = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
                        i = "onwheel" in document || 9 <= document.documentMode ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
                        v = Array.prototype.slice;
                    if (u.event.fixHooks)
                        for (var o = e.length; o;) u.event.fixHooks[e[--o]] = u.event.mouseHooks;
                    var y = u.event.special.mousewheel = {
                        version: "3.1.12",
                        setup: function() {
                            if (this.addEventListener)
                                for (var e = i.length; e;) this.addEventListener(i[--e], t, !1);
                            else this.onmousewheel = t;
                            u.data(this, "mousewheel-line-height", y.getLineHeight(this)), u.data(this, "mousewheel-page-height", y.getPageHeight(this))
                        },
                        teardown: function() {
                            if (this.removeEventListener)
                                for (var e = i.length; e;) this.removeEventListener(i[--e], t, !1);
                            else this.onmousewheel = null;
                            u.removeData(this, "mousewheel-line-height"), u.removeData(this, "mousewheel-page-height")
                        },
                        getLineHeight: function(e) {
                            var t = u(e),
                                i = t["offsetParent" in u.fn ? "offsetParent" : "parent"]();
                            return i.length || (i = u("body")), parseInt(i.css("fontSize"), 10) || parseInt(t.css("fontSize"), 10) || 16
                        },
                        getPageHeight: function(e) {
                            return u(e).height()
                        },
                        settings: {
                            adjustOldDeltas: !0,
                            normalizeOffset: !0
                        }
                    };
                    u.fn.extend({
                        mousewheel: function(e) {
                            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
                        },
                        unmousewheel: function(e) {
                            return this.unbind("mousewheel", e)
                        }
                    })
                }, "function" == typeof e.define && e.define.amd ? e.define("jquery.mousewheel", ["jquery"], t) : "object" == typeof exports ? module.exports = t : t(i), {
                    define: e.define,
                    require: e.require
                }
            }(),
            t = e.require("jquery.select2");
        return i.fn.select2.amd = e, t
    });
var nx_free_email_domain_list = new Array("1033edge.com", "11mail.com", "123.com", "123box.net", "123india.com", "123mail.cl", "123qwe.co.uk", "126.com", "150ml.com", "15meg4free.com", "163.com", "1coolplace.com", "1freeemail.com", "1funplace.com", "1internetdrive.com", "1mail.net", "1me.net", "1mum.com", "1musicrow.com", "1netdrive.com", "1nsyncfan.com", "1under.com", "1webave.com", "1webhighway.com", "212.com", "24horas.com", "2911.net", "2bmail.co.uk", "2d2i.com", "2die4.com", "3000.it", "321media.com", "37.com", "3ammagazine.com", "3dmail.com", "3email.com", "3xl.net", "444.net", "4email.com", "4email.net", "4mg.com", "4newyork.com", "4x4man.com", "5iron.com", "5star.com", "88.am", "8848.net", "888.nu", "97rock.com", "aaamail.zzn.com", "aamail.net", "aaronkwok.net", "abbeyroadlondon.co.uk", "abcflash.net", "abdulnour.com", "aberystwyth.com", "abolition-now.com", "about.com", "academycougars.com", "acceso.or.cr", "access4less.net", "accessgcc.com", "ace-of-base.com", "acmecity.com", "acmemail.net", "acninc.net", "adelphia.net", "adexec.com", "adfarrow.com", "adios.net", "ados.fr", "advalvas.be", "aeiou.pt", "aemail4u.com", "aeneasmail.com", "afreeinternet.com", "africamail.com", "agoodmail.com", "ahaa.dk", "aichi.com", "aim.com", "airforce.net", "airforceemail.com", "airpost.net", "ajacied.com", "ak47.hu", "aknet.kg", "albawaba.com", "alex4all.com", "alexandria.cc", "algeria.com", "alhilal.net", "alibaba.com", "alive.cz", "allmail.net", "alloymail.com", "allracing.com", "allsaintsfan.com", "alltel.net", "alskens.dk", "altavista.com", "altavista.net", "altavista.se", "alternativagratis.com", "alumnidirector.com", "alvilag.hu", "amele.com", "america.hm", "ameritech.net", "amnetsal.com", "amrer.net", "amuro.net", "amuromail.com", "ananzi.co.za", "andylau.net", "anfmail.com", "angelfan.com", "angelfire.com", "animal.net", "animalhouse.com", "animalwoman.net", "anjungcafe.com", "anote.com", "another.com", "anotherwin95.com", "anti-social.com", "antisocial.com", "antongijsen.com", "antwerpen.com", "anymoment.com", "anytimenow.com", "aol.com", "apexmail.com", "apmail.com", "apollo.lv", "approvers.net", "arabia.com", "arabtop.net", "arcademaster.com", "archaeologist.com", "arcor.de", "arcotronics.bg", "argentina.com", "aristotle.org", "army.net", "arnet.com.ar", "artlover.com", "artlover.com.au", "as-if.com", "asean-mail.com", "asheville.com", "asia-links.com", "asia.com", "asiafind.com", "asianavenue.com", "asiancityweb.com", "asiansonly.net", "asianwired.net", "asiapoint.net", "assala.com", "assamesemail.com", "astroboymail.com", "astrolover.com", "astrosfan.com", "astrosfan.net", "asurfer.com", "athenachu.net", "atina.cl", "atl.lv", "atlaswebmail.com", "atlink.com", "ato.check.com", "atozasia.com", "att.net", "attglobal.net", "attymail.com", "au.ru", "ausi.com", "austin.rr.com", "australia.edu", "australiamail.com", "austrosearch.net", "autoescuelanerja.com", "automotiveauthority.com", "avh.hu", "awsom.net", "axoskate.com", "ayna.com", "azimiweb.com", "bachelorboy.com", "bachelorgal.com", "backpackers.com", "backstreet-boys.com", "backstreetboysclub.com", "bagherpour.com", "bangkok.com", "bangkok2000.com", "bannertown.net", "baptistmail.com", "baptized.com", "barcelona.com", "baseballmail.com", "basketballmail.com", "batuta.net", "baudoinconsulting.com", "bboy.zzn.com", "bcvibes.com", "beeebank.com", "beenhad.com", "beep.ru", "beer.com", "beethoven.com", "belice.com", "belizehome.com", "bellsouth.net", "berkscounty.com", "berlin.com", "berlin.de", "berlinexpo.de", "bestmail.us", "bettergolf.net", "bharatmail.com", "bigassweb.com", "bigblue.net.au", "bigboab.com", "bigfoot.com", "bigfoot.de", "bigger.com", "bigmailbox.com", "bigpond.com", "bigpond.com.au", "bigpond.net.au", "bigramp.com", "bikemechanics.com", "bikeracer.com", "bikeracers.net", "bikerider.com", "billsfan.com", "billsfan.net", "bimamail.com", "bimla.net", "birdowner.net", "bisons.com", "bitmail.com", "bitpage.net", "bizhosting.com", "bla-bla.com", "blackburnmail.com", "blackplanet.com", "blazemail.com", "bluehyppo.com", "bluemail.ch", "bluemail.dk", "bluesfan.com", "blushmail.com", "bmlsports.net", "boardermail.com", "boatracers.com", "bol.com.br", "bolando.com", "bollywoodz.com", "bolt.com", "boltonfans.com", "bombdiggity.com", "bonbon.net", "boom.com", "bootmail.com", "bornnaked.com", "bossofthemoss.com", "bostonoffice.com", "bounce.net", "box.az", "boxbg.com", "boxemail.com", "boxfrog.com", "boyzoneclub.com", "bradfordfans.com", "brasilia.net", "brazilmail.com.br", "breathe.com", "bresnan.net", "brfree.com.br", "bright.net", "britneyclub.com", "brittonsign.com", "broadcast.net", "btopenworld.co.uk", "buffymail.com", "bullsfan.com", "bullsgame.com", "bumerang.ro", "bunko.com", "buryfans.com", "business-man.com", "businessman.net", "businessweekmail.com", "busta-rhymes.com", "busymail.com", "buyersusa.com", "bvimailbox.com", "byteme.com", "c2i.net", "c3.hu", "c4.com", "cabacabana.com", "cableone.net", "caere.it", "cairomail.com", "callnetuk.com", "callsign.net", "caltanet.it", "camidge.com", "canada-11.com", "canada.com", "canadianmail.com", "canoemail.com", "canwetalk.com", "caramail.com", "care2.com", "careerbuildermail.com", "carioca.net", "cartestraina.ro", "casablancaresort.com", "casino.com", "catcha.com", "catholic.org", "catlover.com", "catsrule.garfield.com", "ccnmail.com", "cd2.com", "celineclub.com", "celtic.com", "centoper.it", "centralpets.com", "centrum.cz", "centrum.sk", "centurytel.net", "cfl.rr.com", "cgac.es", "chaiyomail.com", "chance2mail.com", "chandrasekar.net", "charmedmail.com", "charter.net", "chat.ru", "chattown.com", "chauhanweb.com", "check.com", "check1check.com", "cheerful.com", "chek.com", "chemist.com", "chequemail.com", "cheyenneweb.com", "chez.com", "chickmail.com", "china.net.vg", "chinalook.com", "chirk.com", "chocaholic.com.au", "christianmail.net", "churchusa.com", "cia-agent.com", "cia.hu", "ciaoweb.it", "cicciociccio.com", "cincinow.net", "citeweb.net", "citlink.net", "city-of-bath.org", "city-of-birmingham.com", "city-of-brighton.org", "city-of-cambridge.com", "city-of-coventry.com", "city-of-edinburgh.com", "city-of-lichfield.com", "city-of-lincoln.com", "city-of-liverpool.com", "city-of-manchester.com", "city-of-nottingham.com", "city-of-oxford.com", "city-of-swansea.com", "city-of-westminster.com", "city-of-westminster.net", "city-of-york.net", "city2city.com", "cityofcardiff.net", "cityoflondon.org", "claramail.com", "classicalfan.com", "classicmail.co.za", "clerk.com", "cliffhanger.com", "close2you.net", "club4x4.net", "clubalfa.com", "clubbers.net", "clubducati.com", "clubhonda.net", "clubvdo.net", "cluemail.com", "cmpmail.com", "cnnsimail.com", "codec.ro", "coder.hu", "coid.biz", "coldmail.com", "collectiblesuperstore.com", "collegebeat.com", "collegeclub.com", "collegemail.com", "colleges.com", "columbus.rr.com", "columbusrr.com", "columnist.com", "comcast.net", "comic.com", "communityconnect.com", "comprendemail.com", "compuserve.com", "computer-freak.com", "computermail.net", "conexcol.com", "conk.com", "connect4free.net", "connectbox.com", "conok.com", "consultant.com", "cookiemonster.com", "cool.br", "coolgoose.ca", "coolgoose.com", "coolkiwi.com", "coollist.com", "coolmail.com", "coolmail.net", "coolsend.com", "cooooool.com", "cooperation.net", "cooperationtogo.net", "copacabana.com", "cornells.com", "cornerpub.com", "corporatedirtbag.com", "correo.terra.com.gt", "cortinet.com", "cotas.net", "counsellor.com", "countrylover.com", "cox.net", "coxinet.net", "cpaonline.net", "cracker.hu", "crazedanddazed.com", "crazysexycool.com", "cristianemail.com", "critterpost.com", "croeso.com", "crosshairs.com", "crosswinds.net", "crwmail.com", "cry4helponline.com", "cs.com", "csinibaba.hu", "cuemail.com", "curio-city.com", "cute-girl.com", "cuteandcuddly.com", "cutey.com", "cww.de", "cyber-africa.net", "cyber4all.com", "cyberbabies.com", "cybercafemaui.com", "cyberdude.com", "cyberforeplay.net", "cybergal.com", "cybergrrl.com", "cyberinbox.com", "cyberleports.com", "cybermail.net", "cybernet.it", "cyberspace-asia.com", "cybertrains.org", "cyclefanz.com", "cynetcity.com", "dabsol.net", "dadacasa.com", "daha.com", "dailypioneer.com", "dallas.theboys.com", "dangerous-minds.com", "dansegulvet.com", "data54.com", "davegracey.com", "dawnsonmail.com", "dawsonmail.com", "dazedandconfused.com", "dbzmail.com", "dcemail.com", "deadlymob.org", "deal-maker.com", "dearriba.com", "death-star.com", "dejanews.com", "deliveryman.com", "deneg.net", "depechemode.com", "deseretmail.com", "desertmail.com", "desilota.com", "deskmail.com", "deskpilot.com", "destin.com", "detik.com", "deutschland-net.com", "devotedcouples.com", "dfwatson.com", "di-ve.com", "digibel.be", "diplomats.com", "dirtracer.com", "discofan.com", "discovery.com", "discoverymail.com", "disinfo.net", "dmailman.com", "dnsmadeeasy.com", "doctor.com", "dog.com", "doglover.com", "dogmail.co.uk", "dogsnob.net", "doityourself.com", "doneasy.com", "donjuan.com", "dontgotmail.com", "dontmesswithtexas.com", "doramail.com", "dostmail.com", "dotcom.fr", "dott.it", "dplanet.ch", "dr.com", "dragoncon.net", "dragracer.com", "draviero.info", "dropzone.com", "drotposta.hu", "dubaimail.com", "dublin.com", "dublin.ie", "dunlopdriver.com", "dunloprider.com", "duno.com", "dwp.net", "dygo.com", "dynamitemail.com", "e-apollo.lv", "e-mail.dk", "e-mail.ru", "e-mailanywhere.com", "e-mails.ru", "e-tapaal.com", "earthalliance.com", "earthcam.net", "earthdome.com", "earthling.net", "earthlink.net", "earthonline.net", "eastcoast.co.za", "eastmail.com", "easy.to", "easypost.com", "eatmydirt.com", "ecardmail.com", "ecbsolutions.net", "echina.com", "ecompare.com", "edmail.com", "ednatx.com", "edtnmail.com", "educacao.te.pt", "educastmail.com", "ehmail.com", "eircom.net", "elsitio.com", "elvis.com", "email-london.co.uk", "email.com", "email.cz", "email.ee", "email.it", "email.nu", "email.ro", "email.ru", "email.si", "email.women.com", "email2me.net", "emailacc.com", "emailaccount.com", "emailchoice.com", "emailcorner.net", "emailem.com", "emailengine.net", "emailforyou.net", "emailgroups.net", "emailpinoy.com", "emailplanet.com", "emails.ru", "emailuser.net", "emailx.net", "ematic.com", "embarqmail.com", "emumail.com", "end-war.com", "enel.net", "engineer.com", "england.com", "england.edu", "epatra.com", "epix.net", "epost.de", "eposta.hu", "eqqu.com", "eramail.co.za", "eresmas.com", "eriga.lv", "estranet.it", "ethos.st", "etoast.com", "etrademail.com", "eudoramail.com", "europe.com", "euroseek.com", "every1.net", "everyday.com.kh", "everyone.net", "examnotes.net", "excite.co.jp", "excite.com", "excite.it", "execs.com", "expressasia.com", "extenda.net", "extended.com", "eyou.com", "ezcybersearch.com", "ezmail.egine.com", "ezmail.ru", "ezrs.com", "f1fans.net", "fan.com", "fan.theboys.com", "fansonlymail.com", "fantasticmail.com", "farang.net", "faroweb.com", "fastem.com", "fastemail.us", "fastemailer.com", "fastermail.com", "fastimap.com", "fastmail.fm", "fastmailbox.net", "fastmessaging.com", "fatcock.net", "fathersrightsne.org", "fbi-agent.com", "fbi.hu", "federalcontractors.com", "felicity.com", "felicitymail.com", "femenino.com", "fetchmail.co.uk", "fetchmail.com", "feyenoorder.com", "ffanet.com", "fiberia.com", "filipinolinks.com", "financemail.net", "financier.com", "findmail.com", "finebody.com", "finfin.com", "fire-brigade.com", "fishburne.org", "flashemail.com", "flashmail.com", "flashmail.net", "flipcode.com", "fmail.co.uk", "fmailbox.com", "fmgirl.com", "fmguy.com", "fnbmail.co.za", "fnmail.com", "folkfan.com", "foodmail.com", "football.theboys.com", "footballmail.com", "for-president.com", "forfree.at", "forpresident.com", "fortuncity.com", "fortunecity.com", "forum.dk", "free-org.com", "free.com.pe", "free.fr", "freeaccess.nl", "freeaccount.com", "freeandsingle.com", "freedom.usa.com", "freedomlover.com", "freegates.be", "freeghana.com", "freeler.nl", "freemail.c3.hu", "freemail.com.au", "freemail.com.pk", "freemail.de", "freemail.et", "freemail.gr", "freemail.hu", "freemail.it", "freemail.lt", "freemail.nl", "freemail.org.mk", "freenet.de", "freenet.kg", "freeola.com", "freeola.net", "freeserve.co.uk", "freestamp.com", "freestart.hu", "freesurf.fr", "freesurf.nl", "freeuk.com", "freeuk.net", "freeukisp.co.uk", "freeweb.org", "freewebemail.com", "freeyellow.com", "freezone.co.uk", "fresnomail.com", "friends-cafe.com", "friendsfan.com", "from-africa.com", "from-america.com", "from-argentina.com", "from-asia.com", "from-australia.com", "from-belgium.com", "from-brazil.com", "from-canada.com", "from-china.net", "from-england.com", "from-europe.com", "from-france.net", "from-germany.net", "from-holland.com", "from-israel.com", "from-italy.net", "from-japan.net", "from-korea.com", "from-mexico.com", "from-outerspace.com", "from-russia.com", "from-spain.net", "fromalabama.com", "fromalaska.com", "fromarizona.com", "fromarkansas.com", "fromcalifornia.com", "fromcolorado.com", "fromconnecticut.com", "fromdelaware.com", "fromflorida.net", "fromgeorgia.com", "fromhawaii.net", "fromidaho.com", "fromillinois.com", "fromindiana.com", "fromiowa.com", "fromjupiter.com", "fromkansas.com", "fromkentucky.com", "fromlouisiana.com", "frommaine.net", "frommaryland.com", "frommassachusetts.com", "frommiami.com", "frommichigan.com", "fromminnesota.com", "frommississippi.com", "frommissouri.com", "frommontana.com", "fromnebraska.com", "fromnevada.com", "fromnewhampshire.com", "fromnewjersey.com", "fromnewmexico.com", "fromnewyork.net", "fromnorthcarolina.com", "fromnorthdakota.com", "fromohio.com", "fromoklahoma.com", "fromoregon.net", "frompennsylvania.com", "fromrhodeisland.com", "fromru.com", "fromsouthcarolina.com", "fromsouthdakota.com", "fromtennessee.com", "fromtexas.com", "fromthestates.com", "fromutah.com", "fromvermont.com", "fromvirginia.com", "fromwashington.com", "fromwashingtondc.com", "fromwestvirginia.com", "fromwisconsin.com", "fromwyoming.com", "front.ru", "frontier.com", "frontiernet.net", "frostbyte.uk.net", "fsmail.net", "ftml.net", "fullmail.com", "funkfan.com", "fuorissimo.com", "furnitureprovider.com", "fuse.net", "fut.es", "fwnb.com", "fxsmails.com", "galamb.net", "galaxy5.com", "gamebox.net", "gamegeek.com", "gamespotmail.com", "garbage.com", "gardener.com", "gawab.com", "gaybrighton.co.uk", "gaza.net", "gazeta.pl", "gazibooks.com", "gci.net", "gee-wiz.com", "geecities.com", "geek.com", "geek.hu", "geeklife.com", "general-hospital.com", "geocities.com", "geologist.com", "geopia.com", "gh2000.com", "ghanamail.com", "ghostmail.com", "giantsfan.com", "giga4u.de", "gigileung.org", "givepeaceachance.com", "glay.org", "glendale.net", "globalfree.it", "globalpagan.com", "globalsite.com.br", "gmail.com", "gmail.co", "gmail.ru", "gmx.at", "gmx.de", "gmx.li", "gmx.net", "gnwmail.com", "go.com", "go.ro", "go.ru", "go2.com.py", "go2net.com", "gocollege.com", "gocubs.com", "gofree.co.uk", "goldenmail.ru", "goldmail.ru", "golfemail.com", "golfmail.be", "gonavy.net", "goodstick.com", "googlemail.com", "goplay.com", "gorontalo.net", "gospelfan.com", "gothere.uk.com", "gotmail.com", "gotomy.com", "govolsfan.com", "gportal.hu", "grabmail.com", "graffiti.net", "gramszu.net", "grapplers.com", "gratisweb.com", "grungecafe.com", "gtemail.net", "gtmc.net", "gua.net", "guessmail.com", "guju.net", "gurlmail.com", "guy.com", "guy2.com", "guyanafriends.com", "gyorsposta.com", "gyorsposta.hu", "hackermail.net", "hailmail.net", "hairdresser.net", "hamptonroads.com", "handbag.com", "handleit.com", "hang-ten.com", "hanmail.net", "happemail.com", "happycounsel.com", "happypuppy.com", "hardcorefreak.com", "hawaii.rr.com", "hawaiiantel.net", "headbone.com", "heartthrob.com", "heerschap.com", "heesun.net", "hehe.com", "hello.hu", "hello.net.au", "hello.to", "helter-skelter.com", "hempseed.com", "herediano.com", "heremail.com", "herono1.com", "hey.to", "hhdevel.com", "highmilton.com", "highquality.com", "highveldmail.co.za", "hiphopfan.com", "hispavista.com", "hitthe.net", "hkg.net", "hkstarphoto.com", "hockeymail.com", "hollywoodkids.com", "home-email.com", "home.no.net", "home.ro", "home.se", "homeart.com", "homelocator.com", "homemail.com", "homestead.com", "homeworkcentral.com", "hongkong.com", "hookup.net", "hoopsmail.com", "horrormail.com", "host-it.com.sg", "hot-shot.com", "hot.ee", "hotbot.com", "hotbrev.com", "hotepmail.com", "hotfire.net", "hotletter.com", "hotmail.co.il", "hotmail.co.uk", "hotmail.com", "hotmail.fr", "hotmail.kg", "hotmail.kz", "hotmail.ru", "hotpop.com", "hotpop3.com", "hotvoice.com", "housefancom", "housemail.com", "hsuchi.net", "html.tou.com", "hughes.net", "hunsa.com", "hushmail.com", "hypernautica.com", "i-connect.com", "i-france.com", "i-mail.com.au", "i-p.com", "i.am", "i12.com", "iamawoman.com", "iamwaiting.com", "iamwasted.com", "iamyours.com", "icestorm.com", "icloud.com", "icmsconsultants.com", "icq.com", "icqmail.com", "icrazy.com", "id-base.com", "ididitmyway.com", "idirect.com", "iespana.es", "ifoward.com", "ig.com.br", "ignazio.it", "ignmail.com", "ihateclowns.com", "iinet.net.au", "ijustdontcare.com", "ilovechocolate.com", "ilovejesus.com", "ilovethemovies.com", "ilovetocollect.net", "ilse.nl", "imaginemail.com", "imail.org", "imail.ru", "imailbox.com", "imel.org", "imneverwrong.com", "imposter.co.uk", "imstressed.com", "imtoosexy.com", "in-box.net", "iname.com", "inbox.net", "inbox.ru", "incamail.com", "incredimail.com", "indexa.fr", "india.com", "indiatimes.com", "indo-mail.com", "indocities.com", "indomail.com", "indyracers.com", "info-media.de", "info66.com", "infohq.com", "infomail.es", "infomart.or.jp", "infospacemail.com", "infovia.com.ar", "inicia.es", "inmail.sk", "innocent.com", "inorbit.com", "insidebaltimore.net", "insight.rr.com", "insurer.com", "interburp.com", "interfree.it", "interia.pl", "interlap.com.ar", "intermail.co.il", "internet-club.com", "internet-police.com", "internetbiz.com", "internetdrive.com", "internetegypt.com", "internetemails.net", "internetmailing.net", "investormail.com", "inwind.it", "iobox.com", "iobox.fi", "iol.it", "iowaemail.com", "ip3.com", "iprimus.com.au", "iqemail.com", "irangate.net", "iraqmail.com", "ireland.com", "irj.hu", "isellcars.com", "islamonline.net", "isleuthmail.com", "ismart.net", "isonfire.com", "isp9.net", "itloox.com", "itmom.com", "ivebeenframed.com", "ivillage.com", "iwan-fals.com", "iwmail.com", "iwon.com", "izadpanah.com", "jahoopa.com", "jakuza.hu", "japan.com", "jaydemail.com", "jazzandjava.com", "jazzfan.com", "jazzgame.com", "jerusalemmail.com", "jetemail.net", "jewishmail.com", "jippii.fi", "jmail.co.za", "joinme.com", "jokes.com", "jordanmail.com", "journalist.com", "jovem.te.pt", "joymail.com", "jpopmail.com", "jubiimail.dk", "jump.com", "jumpy.it", "juniormail.com", "juno.com", "justemail.net", "justicemail.com", "kaazoo.com", "kaixo.com", "kalpoint.com", "kansascity.com", "kapoorweb.com", "karachian.com", "karachioye.com", "karbasi.com", "katamail.com", "kayafmmail.co.za", "kbjrmail.com", "kcks.com", "keg-party.com", "keko.com.ar", "kellychen.com", "keromail.com", "keyemail.com", "kgb.hu", "khosropour.com", "kickassmail.com", "killermail.com", "kimo.com", "kinki-kids.com", "kittymail.com", "kitznet.at", "kiwibox.com", "kiwitown.com", "kmail.com.au", "konx.com", "korea.com", "kozmail.com", "krongthip.com", "krunis.com", "ksanmail.com", "ksee24mail.com", "kube93mail.com", "kukamail.com", "kumarweb.com", "kuwait-mail.com", "la.com", "ladymail.cz", "lagerlouts.com", "lahoreoye.com", "lakmail.com", "lamer.hu", "land.ru", "lankamail.com", "laposte.net", "latemodels.com", "latinmail.com", "latino.com", "law.com", "lawyer.com", "leehom.net", "legalactions.com", "legislator.com", "leonlai.net", "letsgomets.net", "letterbox.com", "levele.com", "levele.hu", "lex.bg", "lexis-nexis-mail.com", "liberomail.com", "lick101.com", "linkmaster.com", "linktrader.com", "linuxfreemail.com", "linuxmail.org", "lionsfan.com.au", "liontrucks.com", "liquidinformation.net", "list.ru", "littleblueroom.com", "live.com", "liverpoolfans.com", "llandudno.com", "llangollen.com", "lmxmail.sk", "lobbyist.com", "localbar.com", "london.com", "loobie.com", "looksmart.co.uk", "looksmart.com", "looksmart.com.au", "lopezclub.com", "louiskoo.com", "love.cz", "loveable.com", "lovelygirl.net", "lovemail.com", "lover-boy.com", "lovergirl.com", "lovingjesus.com", "lowandslow.com", "luso.pt", "luukku.com", "lycos.co.uk", "lycos.com", "lycos.es", "lycos.it", "lycos.ne.jp", "lycosemail.com", "lycosmail.com", "m-a-i-l.com", "m-hmail.com", "m4.org", "mac.com", "macbox.com", "macfreak.com", "machinecandy.com", "macmail.com", "madcreations.com", "madrid.com", "maffia.hu", "magicmail.co.za", "mahmoodweb.com", "mail-awu.de", "mail-box.cz", "mail-center.com", "mail-central.com", "mail-page.com", "mail.austria.com", "mail.az", "mail.be", "mail.bulgaria.com", "mail.byte.it", "mail.co.za", "mail.com", "mail.ee", "mail.entrepeneurmag.com", "mail.freetown.com", "mail.gr", "mail.hitthebeach.com", "mail.kmsp.com", "mail.md", "mail.nu", "mail.org.uk", "mail.pf", "mail.pharmacy.com", "mail.pt", "mail.r-o-o-t.com", "mail.ru", "mail.salu.net", "mail.sisna.com", "mail.spaceports.com", "mail.theboys.com", "mail.usa.com", "mail.vasarhely.hu", "mail15.com", "mail1st.com", "mail2007.com", "mail2aaron.com", "mail2abby.com", "mail2abc.com", "mail2actor.com", "mail2admiral.com", "mail2adorable.com", "mail2adoration.com", "mail2adore.com", "mail2adventure.com", "mail2aeolus.com", "mail2aether.com", "mail2affection.com", "mail2afghanistan.com", "mail2africa.com", "mail2agent.com", "mail2aha.com", "mail2ahoy.com", "mail2aim.com", "mail2air.com", "mail2airbag.com", "mail2airforce.com", "mail2airport.com", "mail2alabama.com", "mail2alan.com", "mail2alaska.com", "mail2albania.com", "mail2alcoholic.com", "mail2alec.com", "mail2alexa.com", "mail2algeria.com", "mail2alicia.com", "mail2alien.com", "mail2allan.com", "mail2allen.com", "mail2allison.com", "mail2alpha.com", "mail2alyssa.com", "mail2amanda.com", "mail2amazing.com", "mail2amber.com", "mail2america.com", "mail2american.com", "mail2andorra.com", "mail2andrea.com", "mail2andy.com", "mail2anesthesiologist.com", "mail2angela.com", "mail2angola.com", "mail2ann.com", "mail2anna.com", "mail2anne.com", "mail2anthony.com", "mail2anything.com", "mail2aphrodite.com", "mail2apollo.com", "mail2april.com", "mail2aquarius.com", "mail2arabia.com", "mail2arabic.com", "mail2architect.com", "mail2ares.com", "mail2argentina.com", "mail2aries.com", "mail2arizona.com", "mail2arkansas.com", "mail2armenia.com", "mail2army.com", "mail2arnold.com", "mail2art.com", "mail2artemus.com", "mail2arthur.com", "mail2artist.com", "mail2ashley.com", "mail2ask.com", "mail2astronomer.com", "mail2athena.com", "mail2athlete.com", "mail2atlas.com", "mail2atom.com", "mail2attitude.com", "mail2auction.com", "mail2aunt.com", "mail2australia.com", "mail2austria.com", "mail2azerbaijan.com", "mail2baby.com", "mail2bahamas.com", "mail2bahrain.com", "mail2ballerina.com", "mail2ballplayer.com", "mail2band.com", "mail2bangladesh.com", "mail2bank.com", "mail2banker.com", "mail2bankrupt.com", "mail2baptist.com", "mail2bar.com", "mail2barbados.com", "mail2barbara.com", "mail2barter.com", "mail2basketball.com", "mail2batter.com", "mail2beach.com", "mail2beast.com", "mail2beatles.com", "mail2beauty.com", "mail2becky.com", "mail2beijing.com", "mail2belgium.com", "mail2belize.com", "mail2ben.com", "mail2bernard.com", "mail2beth.com", "mail2betty.com", "mail2beverly.com", "mail2beyond.com", "mail2biker.com", "mail2bill.com", "mail2billionaire.com", "mail2billy.com", "mail2bio.com", "mail2biologist.com", "mail2black.com", "mail2blackbelt.com", "mail2blake.com", "mail2blind.com", "mail2blonde.com", "mail2blues.com", "mail2bob.com", "mail2bobby.com", "mail2bolivia.com", "mail2bombay.com", "mail2bonn.com", "mail2bookmark.com", "mail2boreas.com", "mail2bosnia.com", "mail2boston.com", "mail2botswana.com", "mail2bradley.com", "mail2brazil.com", "mail2breakfast.com", "mail2brian.com", "mail2bride.com", "mail2brittany.com", "mail2broker.com", "mail2brook.com", "mail2bruce.com", "mail2brunei.com", "mail2brunette.com", "mail2brussels.com", "mail2bryan.com", "mail2bug.com", "mail2bulgaria.com", "mail2business.com", "mail2buy.com", "mail2ca.com", "mail2california.com", "mail2calvin.com", "mail2cambodia.com", "mail2cameroon.com", "mail2canada.com", "mail2cancer.com", "mail2capeverde.com", "mail2capricorn.com", "mail2cardinal.com", "mail2cardiologist.com", "mail2care.com", "mail2caroline.com", "mail2carolyn.com", "mail2casey.com", "mail2cat.com", "mail2caterer.com", "mail2cathy.com", "mail2catlover.com", "mail2catwalk.com", "mail2cell.com", "mail2chad.com", "mail2champaign.com", "mail2charles.com", "mail2chef.com", "mail2chemist.com", "mail2cherry.com", "mail2chicago.com", "mail2chile.com", "mail2china.com", "mail2chinese.com", "mail2chocolate.com", "mail2christian.com", "mail2christie.com", "mail2christmas.com", "mail2christy.com", "mail2chuck.com", "mail2cindy.com", "mail2clark.com", "mail2classifieds.com", "mail2claude.com", "mail2cliff.com", "mail2clinic.com", "mail2clint.com", "mail2close.com", "mail2club.com", "mail2coach.com", "mail2coastguard.com", "mail2colin.com", "mail2college.com", "mail2colombia.com", "mail2color.com", "mail2colorado.com", "mail2columbia.com", "mail2comedian.com", "mail2composer.com", "mail2computer.com", "mail2computers.com", "mail2concert.com", "mail2congo.com", "mail2connect.com", "mail2connecticut.com", "mail2consultant.com", "mail2convict.com", "mail2cook.com", "mail2cool.com", "mail2cory.com", "mail2costarica.com", "mail2country.com", "mail2courtney.com", "mail2cowboy.com", "mail2cowgirl.com", "mail2craig.com", "mail2crave.com", "mail2crazy.com", "mail2create.com", "mail2croatia.com", "mail2cry.com", "mail2crystal.com", "mail2cuba.com", "mail2culture.com", "mail2curt.com", "mail2customs.com", "mail2cute.com", "mail2cutey.com", "mail2cynthia.com", "mail2cyprus.com", "mail2czechrepublic.com", "mail2dad.com", "mail2dale.com", "mail2dallas.com", "mail2dan.com", "mail2dana.com", "mail2dance.com", "mail2dancer.com", "mail2danielle.com", "mail2danny.com", "mail2darlene.com", "mail2darling.com", "mail2darren.com", "mail2daughter.com", "mail2dave.com", "mail2dawn.com", "mail2dc.com", "mail2dealer.com", "mail2deanna.com", "mail2dearest.com", "mail2debbie.com", "mail2debby.com", "mail2deer.com", "mail2delaware.com", "mail2delicious.com", "mail2demeter.com", "mail2democrat.com", "mail2denise.com", "mail2denmark.com", "mail2dennis.com", "mail2dentist.com", "mail2derek.com", "mail2desert.com", "mail2devoted.com", "mail2devotion.com", "mail2diamond.com", "mail2diana.com", "mail2diane.com", "mail2diehard.com", "mail2dilemma.com", "mail2dillon.com", "mail2dinner.com", "mail2dinosaur.com", "mail2dionysos.com", "mail2diplomat.com", "mail2director.com", "mail2dirk.com", "mail2disco.com", "mail2dive.com", "mail2diver.com", "mail2divorced.com", "mail2djibouti.com", "mail2doctor.com", "mail2doglover.com", "mail2dominic.com", "mail2dominica.com", "mail2dominicanrepublic.com", "mail2don.com", "mail2donald.com", "mail2donna.com", "mail2doris.com", "mail2dorothy.com", "mail2doug.com", "mail2dough.com", "mail2douglas.com", "mail2dow.com", "mail2downtown.com", "mail2dream.com", "mail2dreamer.com", "mail2dude.com", "mail2dustin.com", "mail2dyke.com", "mail2dylan.com", "mail2earl.com", "mail2earth.com", "mail2eastend.com", "mail2eat.com", "mail2economist.com", "mail2ecuador.com", "mail2eddie.com", "mail2edgar.com", "mail2edwin.com", "mail2egypt.com", "mail2electron.com", "mail2eli.com", "mail2elizabeth.com", "mail2ellen.com", "mail2elliot.com", "mail2elsalvador.com", "mail2elvis.com", "mail2emergency.com", "mail2emily.com", "mail2engineer.com", "mail2english.com", "mail2environmentalist.com", "mail2eos.com", "mail2eric.com", "mail2erica.com", "mail2erin.com", "mail2erinyes.com", "mail2eris.com", "mail2eritrea.com", "mail2ernie.com", "mail2eros.com", "mail2estonia.com", "mail2ethan.com", "mail2ethiopia.com", "mail2eu.com", "mail2europe.com", "mail2eurus.com", "mail2eva.com", "mail2evan.com", "mail2evelyn.com", "mail2everything.com", "mail2exciting.com", "mail2expert.com", "mail2fairy.com", "mail2faith.com", "mail2fanatic.com", "mail2fancy.com", "mail2fantasy.com", "mail2farm.com", "mail2farmer.com", "mail2fashion.com", "mail2fat.com", "mail2feeling.com", "mail2female.com", "mail2fever.com", "mail2fighter.com", "mail2fiji.com", "mail2filmfestival.com", "mail2films.com", "mail2finance.com", "mail2finland.com", "mail2fireman.com", "mail2firm.com", "mail2fisherman.com", "mail2flexible.com", "mail2florence.com", "mail2florida.com", "mail2floyd.com", "mail2fly.com", "mail2fond.com", "mail2fondness.com", "mail2football.com", "mail2footballfan.com", "mail2found.com", "mail2france.com", "mail2frank.com", "mail2frankfurt.com", "mail2franklin.com", "mail2fred.com", "mail2freddie.com", "mail2free.com", "mail2freedom.com", "mail2french.com", "mail2freudian.com", "mail2friendship.com", "mail2from.com", "mail2fun.com", "mail2gabon.com", "mail2gabriel.com", "mail2gail.com", "mail2galaxy.com", "mail2gambia.com", "mail2games.com", "mail2gary.com", "mail2gavin.com", "mail2gemini.com", "mail2gene.com", "mail2genes.com", "mail2geneva.com", "mail2george.com", "mail2georgia.com", "mail2gerald.com", "mail2german.com", "mail2germany.com", "mail2ghana.com", "mail2gilbert.com", "mail2gina.com", "mail2girl.com", "mail2glen.com", "mail2gloria.com", "mail2goddess.com", "mail2gold.com", "mail2golfclub.com", "mail2golfer.com", "mail2gordon.com", "mail2government.com", "mail2grab.com", "mail2grace.com", "mail2graham.com", "mail2grandma.com", "mail2grandpa.com", "mail2grant.com", "mail2greece.com", "mail2green.com", "mail2greg.com", "mail2grenada.com", "mail2gsm.com", "mail2guard.com", "mail2guatemala.com", "mail2guy.com", "mail2hades.com", "mail2haiti.com", "mail2hal.com", "mail2handhelds.com", "mail2hank.com", "mail2hannah.com", "mail2harold.com", "mail2harry.com", "mail2hawaii.com", "mail2headhunter.com", "mail2heal.com", "mail2heather.com", "mail2heaven.com", "mail2hebe.com", "mail2hecate.com", "mail2heidi.com", "mail2helen.com", "mail2hell.com", "mail2help.com", "mail2helpdesk.com", "mail2henry.com", "mail2hephaestus.com", "mail2hera.com", "mail2hercules.com", "mail2herman.com", "mail2hermes.com", "mail2hespera.com", "mail2hestia.com", "mail2highschool.com", "mail2hindu.com", "mail2hip.com", "mail2hiphop.com", "mail2holland.com", "mail2holly.com", "mail2hollywood.com", "mail2homer.com", "mail2honduras.com", "mail2honey.com", "mail2hongkong.com", "mail2hope.com", "mail2horse.com", "mail2hot.com", "mail2hotel.com", "mail2houston.com", "mail2howard.com", "mail2hugh.com", "mail2human.com", "mail2hungary.com", "mail2hungry.com", "mail2hygeia.com", "mail2hyperspace.com", "mail2hypnos.com", "mail2ian.com", "mail2ice-cream.com", "mail2iceland.com", "mail2idaho.com", "mail2idontknow.com", "mail2illinois.com", "mail2imam.com", "mail2in.com", "mail2india.com", "mail2indian.com", "mail2indiana.com", "mail2indonesia.com", "mail2infinity.com", "mail2intense.com", "mail2iowa.com", "mail2iran.com", "mail2iraq.com", "mail2ireland.com", "mail2irene.com", "mail2iris.com", "mail2irresistible.com", "mail2irving.com", "mail2irwin.com", "mail2isaac.com", "mail2israel.com", "mail2italian.com", "mail2italy.com", "mail2jackie.com", "mail2jacob.com", "mail2jail.com", "mail2jaime.com", "mail2jake.com", "mail2jamaica.com", "mail2james.com", "mail2jamie.com", "mail2jan.com", "mail2jane.com", "mail2janet.com", "mail2janice.com", "mail2japan.com", "mail2japanese.com", "mail2jasmine.com", "mail2jason.com", "mail2java.com", "mail2jay.com", "mail2jazz.com", "mail2jed.com", "mail2jeffrey.com", "mail2jennifer.com", "mail2jenny.com", "mail2jeremy.com", "mail2jerry.com", "mail2jessica.com", "mail2jessie.com", "mail2jesus.com", "mail2jew.com", "mail2jeweler.com", "mail2jim.com", "mail2jimmy.com", "mail2joan.com", "mail2joann.com", "mail2joanna.com", "mail2jody.com", "mail2joe.com", "mail2joel.com", "mail2joey.com", "mail2john.com", "mail2join.com", "mail2jon.com", "mail2jonathan.com", "mail2jones.com", "mail2jordan.com", "mail2joseph.com", "mail2josh.com", "mail2joy.com", "mail2juan.com", "mail2judge.com", "mail2judy.com", "mail2juggler.com", "mail2julian.com", "mail2julie.com", "mail2jumbo.com", "mail2junk.com", "mail2justin.com", "mail2justme.com", "mail2kansas.com", "mail2karate.com", "mail2karen.com", "mail2karl.com", "mail2karma.com", "mail2kathleen.com", "mail2kathy.com", "mail2katie.com", "mail2kay.com", "mail2kazakhstan.com", "mail2keen.com", "mail2keith.com", "mail2kelly.com", "mail2kelsey.com", "mail2ken.com", "mail2kendall.com", "mail2kennedy.com", "mail2kenneth.com", "mail2kenny.com", "mail2kentucky.com", "mail2kenya.com", "mail2kerry.com", "mail2kevin.com", "mail2kim.com", "mail2kimberly.com", "mail2king.com", "mail2kirk.com", "mail2kiss.com", "mail2kosher.com", "mail2kristin.com", "mail2kurt.com", "mail2kuwait.com", "mail2kyle.com", "mail2kyrgyzstan.com", "mail2la.com", "mail2lacrosse.com", "mail2lance.com", "mail2lao.com", "mail2larry.com", "mail2latvia.com", "mail2laugh.com", "mail2laura.com", "mail2lauren.com", "mail2laurie.com", "mail2lawrence.com", "mail2lawyer.com", "mail2lebanon.com", "mail2lee.com", "mail2leo.com", "mail2leon.com", "mail2leonard.com", "mail2leone.com", "mail2leslie.com", "mail2letter.com", "mail2liberia.com", "mail2libertarian.com", "mail2libra.com", "mail2libya.com", "mail2liechtenstein.com", "mail2life.com", "mail2linda.com", "mail2linux.com", "mail2lionel.com", "mail2lipstick.com", "mail2liquid.com", "mail2lisa.com", "mail2lithuania.com", "mail2litigator.com", "mail2liz.com", "mail2lloyd.com", "mail2lois.com", "mail2lola.com", "mail2london.com", "mail2looking.com", "mail2lori.com", "mail2lost.com", "mail2lou.com", "mail2louis.com", "mail2louisiana.com", "mail2lovable.com", "mail2love.com", "mail2lucky.com", "mail2lucy.com", "mail2lunch.com", "mail2lust.com", "mail2luxembourg.com", "mail2luxury.com", "mail2lyle.com", "mail2lynn.com", "mail2madagascar.com", "mail2madison.com", "mail2madrid.com", "mail2maggie.com", "mail2mail4.com", "mail2maine.com", "mail2malawi.com", "mail2malaysia.com", "mail2maldives.com", "mail2mali.com", "mail2malta.com", "mail2mambo.com", "mail2man.com", "mail2mandy.com", "mail2manhunter.com", "mail2mankind.com", "mail2many.com", "mail2marc.com", "mail2marcia.com", "mail2margaret.com", "mail2margie.com", "mail2marhaba.com", "mail2maria.com", "mail2marilyn.com", "mail2marines.com", "mail2mark.com", "mail2marriage.com", "mail2married.com", "mail2marries.com", "mail2mars.com", "mail2marsha.com", "mail2marshallislands.com", "mail2martha.com", "mail2martin.com", "mail2marty.com", "mail2marvin.com", "mail2mary.com", "mail2maryland.com", "mail2mason.com", "mail2massachusetts.com", "mail2matt.com", "mail2matthew.com", "mail2maurice.com", "mail2mauritania.com", "mail2mauritius.com", "mail2max.com", "mail2maxwell.com", "mail2maybe.com", "mail2mba.com", "mail2me4u.com", "mail2mechanic.com", "mail2medieval.com", "mail2megan.com", "mail2mel.com", "mail2melanie.com", "mail2melissa.com", "mail2melody.com", "mail2member.com", "mail2memphis.com", "mail2methodist.com", "mail2mexican.com", "mail2mexico.com", "mail2mgz.com", "mail2miami.com", "mail2michael.com", "mail2michelle.com", "mail2michigan.com", "mail2mike.com", "mail2milan.com", "mail2milano.com", "mail2mildred.com", "mail2milkyway.com", "mail2millennium.com", "mail2millionaire.com", "mail2milton.com", "mail2mime.com", "mail2mindreader.com", "mail2mini.com", "mail2minister.com", "mail2minneapolis.com", "mail2minnesota.com", "mail2miracle.com", "mail2missionary.com", "mail2mississippi.com", "mail2missouri.com", "mail2mitch.com", "mail2model.com", "mail2moldova.commail2molly.com", "mail2mom.com", "mail2monaco.com", "mail2money.com", "mail2mongolia.com", "mail2monica.com", "mail2montana.com", "mail2monty.com", "mail2moon.com", "mail2morocco.com", "mail2morpheus.com", "mail2mors.com", "mail2moscow.com", "mail2moslem.com", "mail2mouseketeer.com", "mail2movies.com", "mail2mozambique.com", "mail2mp3.com", "mail2mrright.com", "mail2msright.com", "mail2museum.com", "mail2music.com", "mail2musician.com", "mail2muslim.com", "mail2my.com", "mail2myboat.com", "mail2mycar.com", "mail2mycell.com", "mail2mygsm.com", "mail2mylaptop.com", "mail2mymac.com", "mail2mypager.com", "mail2mypalm.com", "mail2mypc.com", "mail2myphone.com", "mail2myplane.com", "mail2namibia.com", "mail2nancy.com", "mail2nasdaq.com", "mail2nathan.com", "mail2nauru.com", "mail2navy.com", "mail2neal.com", "mail2nebraska.com", "mail2ned.com", "mail2neil.com", "mail2nelson.com", "mail2nemesis.com", "mail2nepal.com", "mail2netherlands.com", "mail2network.com", "mail2nevada.com", "mail2newhampshire.com", "mail2newjersey.com", "mail2newmexico.com", "mail2newyork.com", "mail2newzealand.com", "mail2nicaragua.com", "mail2nick.com", "mail2nicole.com", "mail2niger.com", "mail2nigeria.com", "mail2nike.com", "mail2no.com", "mail2noah.com", "mail2noel.com", "mail2noelle.com", "mail2normal.com", "mail2norman.com", "mail2northamerica.com", "mail2northcarolina.com", "mail2northdakota.com", "mail2northpole.com", "mail2norway.com", "mail2notus.com", "mail2noway.com", "mail2nowhere.com", "mail2nuclear.com", "mail2nun.com", "mail2ny.com", "mail2oasis.com", "mail2oceanographer.com", "mail2ohio.com", "mail2ok.com", "mail2oklahoma.com", "mail2oliver.com", "mail2oman.com", "mail2one.com", "mail2onfire.com", "mail2online.com", "mail2oops.com", "mail2open.com", "mail2ophthalmologist.com", "mail2optometrist.com", "mail2oregon.com", "mail2oscars.com", "mail2oslo.com", "mail2painter.com", "mail2pakistan.com", "mail2palau.com", "mail2pan.com", "mail2panama.com", "mail2paraguay.com", "mail2paralegal.com", "mail2paris.com", "mail2park.com", "mail2parker.com", "mail2party.com", "mail2passion.com", "mail2pat.com", "mail2patricia.com", "mail2patrick.com", "mail2patty.com", "mail2paul.com", "mail2paula.com", "mail2pay.com", "mail2peace.com", "mail2pediatrician.com", "mail2peggy.com", "mail2pennsylvania.com", "mail2perry.com", "mail2persephone.com", "mail2persian.com", "mail2peru.com", "mail2pete.com", "mail2peter.com", "mail2pharmacist.com", "mail2phil.com", "mail2philippines.com", "mail2phoenix.com", "mail2phonecall.com", "mail2phyllis.com", "mail2pickup.com", "mail2pilot.com", "mail2pisces.com", "mail2planet.com", "mail2platinum.com", "mail2plato.com", "mail2pluto.com", "mail2pm.com", "mail2podiatrist.com", "mail2poet.com", "mail2poland.com", "mail2policeman.com", "mail2policewoman.com", "mail2politician.com", "mail2pop.com", "mail2pope.com", "mail2popular.com", "mail2portugal.com", "mail2poseidon.com", "mail2potatohead.com", "mail2power.com", "mail2presbyterian.com", "mail2president.com", "mail2priest.com", "mail2prince.com", "mail2princess.com", "mail2producer.com", "mail2professor.com", "mail2protect.com", "mail2psychiatrist.com", "mail2psycho.com", "mail2psychologist.com", "mail2qatar.com", "mail2queen.com", "mail2rabbi.com", "mail2race.com", "mail2racer.com", "mail2rachel.com", "mail2rage.com", "mail2rainmaker.com", "mail2ralph.com", "mail2randy.com", "mail2rap.com", "mail2rare.com", "mail2rave.com", "mail2ray.com", "mail2raymond.com", "mail2realtor.com", "mail2rebecca.com", "mail2recruiter.com", "mail2recycle.com", "mail2redhead.com", "mail2reed.com", "mail2reggie.com", "mail2register.com", "mail2rent.com", "mail2republican.com", "mail2resort.com", "mail2rex.com", "mail2rhodeisland.com", "mail2rich.com", "mail2richard.com", "mail2ricky.com", "mail2ride.com", "mail2riley.com", "mail2rita.com", "mail2rob.com", "mail2robert.com", "mail2roberta.com", "mail2robin.com", "mail2rock.com", "mail2rocker.com", "mail2rod.com", "mail2rodney.com", "mail2romania.com", "mail2rome.com", "mail2ron.com", "mail2ronald.com", "mail2ronnie.com", "mail2rose.com", "mail2rosie.com", "mail2roy.com", "mail2rudy.com", "mail2rugby.com", "mail2runner.com", "mail2russell.com", "mail2russia.com", "mail2russian.com", "mail2rusty.com", "mail2ruth.com", "mail2rwanda.com", "mail2ryan.com", "mail2sa.com", "mail2sabrina.com", "mail2safe.com", "mail2sagittarius.com", "mail2sail.com", "mail2sailor.com", "mail2sal.com", "mail2salaam.com", "mail2sam.com", "mail2samantha.com", "mail2samoa.com", "mail2samurai.com", "mail2sandra.com", "mail2sandy.com", "mail2sanfrancisco.com", "mail2sanmarino.com", "mail2santa.com", "mail2sara.com", "mail2sarah.com", "mail2sat.com", "mail2saturn.com", "mail2saudi.com", "mail2saudiarabia.com", "mail2save.com", "mail2savings.com", "mail2school.com", "mail2scientist.com", "mail2scorpio.com", "mail2scott.com", "mail2sean.com", "mail2search.com", "mail2seattle.com", "mail2secretagent.com", "mail2senate.com", "mail2senegal.com", "mail2sensual.com", "mail2seth.com", "mail2sevenseas.com", "mail2sexy.com", "mail2seychelles.com", "mail2shane.com", "mail2sharon.com", "mail2shawn.com", "mail2ship.com", "mail2shirley.com", "mail2shoot.com", "mail2shuttle.com", "mail2sierraleone.com", "mail2simon.com", "mail2singapore.com", "mail2single.com", "mail2site.com", "mail2skater.com", "mail2skier.com", "mail2sky.com", "mail2sleek.com", "mail2slim.com", "mail2slovakia.com", "mail2slovenia.com", "mail2smile.com", "mail2smith.com", "mail2smooth.com", "mail2soccer.com", "mail2soccerfan.com", "mail2socialist.com", "mail2soldier.com", "mail2somalia.com", "mail2son.com", "mail2song.com", "mail2sos.com", "mail2sound.com", "mail2southafrica.com", "mail2southamerica.com", "mail2southcarolina.com", "mail2southdakota.com", "mail2southkorea.com", "mail2southpole.com", "mail2spain.com", "mail2spanish.com", "mail2spare.com", "mail2spectrum.com", "mail2splash.com", "mail2sponsor.com", "mail2sports.com", "mail2srilanka.com", "mail2stacy.com", "mail2stan.com", "mail2stanley.com", "mail2star.com", "mail2state.com", "mail2stephanie.com", "mail2steve.com", "mail2steven.com", "mail2stewart.com", "mail2stlouis.com", "mail2stock.com", "mail2stockholm.com", "mail2stockmarket.com", "mail2storage.com", "mail2store.com", "mail2strong.com", "mail2student.com", "mail2studio.com", "mail2studio54.com", "mail2stuntman.com", "mail2subscribe.com", "mail2sudan.com", "mail2superstar.com", "mail2surfer.com", "mail2suriname.com", "mail2susan.com", "mail2suzie.com", "mail2swaziland.com", "mail2sweden.com", "mail2sweetheart.com", "mail2swim.com", "mail2swimmer.com", "mail2swiss.com", "mail2switzerland.com", "mail2sydney.com", "mail2sylvia.com", "mail2syria.com", "mail2taboo.com", "mail2taiwan.com", "mail2tajikistan.com", "mail2tammy.com", "mail2tango.com", "mail2tanya.com", "mail2tanzania.com", "mail2tara.com", "mail2taurus.com", "mail2taxi.com", "mail2taxidermist.com", "mail2taylor.com", "mail2taz.com", "mail2teacher.com", "mail2technician.com", "mail2ted.com", "mail2telephone.com", "mail2teletubbie.com", "mail2tenderness.com", "mail2tennessee.com", "mail2tennis.com", "mail2tennisfan.com", "mail2terri.com", "mail2terry.com", "mail2test.com", "mail2texas.com", "mail2thailand.com", "mail2therapy.com", "mail2think.com", "mail2tickets.com", "mail2tiffany.com", "mail2tim.com", "mail2time.com", "mail2timothy.com", "mail2tina.com", "mail2titanic.com", "mail2toby.com", "mail2todd.com", "mail2togo.com", "mail2tom.com", "mail2tommy.com", "mail2tonga.com", "mail2tony.com", "mail2touch.com", "mail2tourist.com", "mail2tracey.com", "mail2tracy.com", "mail2tramp.com", "mail2travel.com", "mail2traveler.com", "mail2travis.com", "mail2trekkie.com", "mail2trex.com", "mail2triallawyer.com", "mail2trick.com", "mail2trillionaire.com", "mail2troy.com", "mail2truck.com", "mail2trump.com", "mail2try.com", "mail2tunisia.com", "mail2turbo.com", "mail2turkey.com", "mail2turkmenistan.com", "mail2tv.com", "mail2tycoon.com", "mail2tyler.com", "mail2u4me.com", "mail2uae.com", "mail2uganda.com", "mail2uk.com", "mail2ukraine.com", "mail2uncle.com", "mail2unsubscribe.com", "mail2uptown.com", "mail2uruguay.com", "mail2usa.com", "mail2utah.com", "mail2uzbekistan.com", "mail2v.com", "mail2vacation.com", "mail2valentines.com", "mail2valerie.com", "mail2valley.com", "mail2vamoose.com", "mail2vanessa.com", "mail2vanuatu.com", "mail2venezuela.com", "mail2venous.com", "mail2venus.com", "mail2vermont.com", "mail2vickie.com", "mail2victor.com", "mail2victoria.com", "mail2vienna.com", "mail2vietnam.com", "mail2vince.com", "mail2virginia.com", "mail2virgo.com", "mail2visionary.com", "mail2vodka.com", "mail2volleyball.com", "mail2waiter.com", "mail2wallstreet.com", "mail2wally.com", "mail2walter.com", "mail2warren.com", "mail2washington.com", "mail2wave.com", "mail2way.com", "mail2waycool.com", "mail2wayne.com", "mail2webmaster.com", "mail2webtop.com", "mail2webtv.com", "mail2weird.com", "mail2wendell.com", "mail2wendy.com", "mail2westend.com", "mail2westvirginia.com", "mail2whether.com", "mail2whip.com", "mail2white.com", "mail2whitehouse.com", "mail2whitney.com", "mail2why.com", "mail2wilbur.com", "mail2wild.com", "mail2willard.com", "mail2willie.com", "mail2wine.com", "mail2winner.com", "mail2wired.com", "mail2wisconsin.com", "mail2woman.com", "mail2wonder.com", "mail2world.com", "mail2worship.com", "mail2wow.com", "mail2www.com", "mail2wyoming.com", "mail2xfiles.com", "mail2xox.com", "mail2yachtclub.com", "mail2yahalla.com", "mail2yemen.com", "mail2yes.com", "mail2yugoslavia.com", "mail2zack.com", "mail2zambia.com", "mail2zenith.com", "mail2zephir.com", "mail2zeus.com", "mail2zipper.com", "mail2zoo.com", "mail2zoologist.com", "mail2zurich.com", "mail3000.com", "mail333.com", "mailandftp.com", "mailandnews.com", "mailas.com", "mailasia.com", "mailbolt.com", "mailbomb.net", "mailboom.com", "mailbox.as", "mailbox.co.za", "mailbox.gr", "mailbox.hu", "mailbr.com.br", "mailc.net", "mailcan.com", "mailcc.com", "mailchoose.co", "mailcity.com", "mailclub.fr", "mailclub.net", "mailexcite.com", "mailforce.net", "mailftp.com", "mailgate.gr", "mailgenie.net", "mailhaven.com", "mailhood.com", "mailingweb.com", "mailisent.com", "mailite.com", "mailme.dk", "mailmight.com", "mailmij.nl", "mailnew.com", "mailops.com", "mailoye.com", "mailpanda.com", "mailpost.zzn.com", "mailpride.com", "mailpuppy.com", "mailroom.com", "mailru.com", "mailsent.net", "mailshuttle.com", "mailstart.com", "mailstartplus.com", "mailsurf.com", "mailtag.com", "mailto.de", "mailup.net", "mailwire.com", "maktoob.com", "malayalamtelevision.net", "manager.de", "mantrafreenet.com", "mantramail.com", "mantraonline.com", "marchmail.com", "mariah-carey.ml.org", "mariahc.com", "marijuana.nl", "marketing.lu", "married-not.com", "marsattack.com", "martindalemail.com", "masrawy.com", "matmail.com", "mauimail.com", "mauritius.com", "maxleft.com", "maxmail.co.uk", "mbox.com.au", "me-mail.hu", "me.com", "medical.net.au", "medmail.com", "medscape.com", "meetingmall.com", "megago.com", "megamail.pt", "megapoint.com", "mehrani.com", "mehtaweb.com", "mekhong.com", "melodymail.com", "meloo.com", "members.student.com", "message.hu", "messages.to", "metacrawler.com", "metalfan.com", "metta.lk", "miatadriver.com", "miesto.sk", "mighty.co.za", "miho-nakayama.com", "mikrotamanet.com", "millionaireintraining.com", "milmail.com", "mindless.com", "mindspring.com", "mini-mail.com", "misery.net", "mittalweb.com", "mixmail.com", "mjfrogmail.com", "ml1.net", "mobilbatam.com", "mochamail.com", "mohammed.com", "moldova.cc", "moldova.com", "moldovacc.com", "money.net", "montevideo.com.uy", "moonman.com", "moose-mail.com", "mortaza.com", "mosaicfx.com", "most-wanted.com", "mostlysunny.com", "motormania.com", "movemail.com", "movieluver.com", "mp4.it", "mr-potatohead.com", "mrpost.com", "mscold.com", "msgbox.com", "msn.com", "mttestdriver.com", "mundomail.net", "munich.com", "music.com", "musician.org", "musicscene.org", "mybox.it", "mycabin.com", "mycampus.com", "mycity.com", "mycool.com", "mydomain.com", "mydotcomaddress.com", "myfamily.com", "mygo.com", "myiris.com", "mynamedot.com", "mynetaddress.com", "myownemail.com", "myownfriends.com", "mypad.com", "mypersonalemail.com", "myplace.com", "myrealbox.com", "myremarq.com", "myself.com", "mystupidjob.com", "mythirdage.com", "myway.com", "myworldmail.com", "n2.com", "n2business.com", "n2mail.com", "n2software.com", "nabc.biz", "nafe.com", "nagpal.net", "nakedgreens.com", "name.com", "nameplanet.com", "nandomail.com", "naplesnews.net", "naseej.com", "nativestar.net", "nativeweb.net", "naui.net", "navigator.lv", "navy.org", "naz.com", "nchoicemail.com", "neeva.net", "nemra1.com", "nenter.com", "neo.rr.com", "nervhq.org", "net-pager.net", "net4b.pt", "net4you.at", "netbounce.com", "netbroadcaster.com", "netby.dk", "netcenter-vn.net", "netcourrier.com", "netexecutive.com", "netexpressway.com", "netgenie.com", "netian.com", "netizen.com.ar", "netlane.com", "netlimit.com", "netmanor.com", "netmongol.com", "netnet.com.sg", "netpiper.com", "netposta.net", "netradiomail.com", "netralink.com", "netscape.net", "netscapeonline.co.uk", "netspeedway.com", "netsquare.com", "netster.com", "nettaxi.com", "netzero.com", "netzero.net", "newmail.com", "newmail.net", "newmail.ru", "newyork.com", "nexxmail.com", "nfmail.com", "nhmail.com", "nicebush.com", "nicegal.com", "nicholastse.net", "nicolastse.com", "nightmail.com", "nikopage.com", "nimail.com", "nirvanafan.com", "noavar.com", "norika-fujiwara.com", "norikomail.com", "northgates.net", "nospammail.net", "ntscan.com", "nwytg.net", "ny.com", "nyc.com", "nycmail.com", "nzoomail.com", "o-tay.com", "o2.co.uk", "oaklandas-fan.com", "oceanfree.net", "oddpost.com", "odmail.com", "office-email.com", "officedomain.com", "offroadwarrior.com", "oicexchange.com", "okbank.com", "okhuman.com", "okmad.com", "okmagic.com", "okname.net", "okuk.com", "oldies1041.com", "oldies104mail.com", "ole.com", "olemail.com", "olympist.net", "omaninfo.com", "onebox.com", "onenet.com.ar", "onet.pl", "oninet.pt", "online.ie", "onlinewiz.com", "onmilwaukee.com", "onobox.com", "onvillage.com", "operafan.com", "operamail.com", "optician.com", "optonline.net", "optusnet.com.au", "orbitel.bg", "orgmail.net", "osite.com.br", "oso.com", "otakumail.com", "our-computer.com", "our-office.com", "our.st", "ourbrisbane.com", "ournet.md", "outel.com", "outgun.com", "outlook.com", "over-the-rainbow.com", "ownmail.net", "ozbytes.net.au", "ozemail.com.au", "pacbell.net", "pacific-re.com", "packersfan.com", "pagina.de", "pagons.org", "pakistanoye.com", "palestinemail.com", "parkjiyoon.com", "parrot.com", "parsmail.com", "partlycloudy.com", "partynight.at", "parvazi.com", "passwordmail.com", "pathfindermail.com", "pconnections.net", "pcpostal.com", "pcsrock.com", "peachworld.com", "pediatrician.com", "pemail.net", "penpen.com", "peoplepc.com", "peopleweb.com", "perfectmail.com", "personal.ro", "personales.com", "petml.com", "pettypool.com", "pezeshkpour.com", "phayze.com", "phreaker.net", "pickupman.com", "picusnet.com", "pigpig.net", "pinoymail.com", "piracha.net", "pisem.net", "planet-mail.com", "planetaccess.com", "planetall.com", "planetarymotion.net", "planetdirect.com", "planetearthinter.net", "planetout.com", "plasa.com", "playersodds.com", "playful.com", "plusmail.com.br", "pmail.net", "pobox.hu", "pobox.sk", "pochta.ru", "poczta.fm", "poetic.com", "polbox.com", "policeoffice.com", "pool-sharks.com", "poond.com", "popaccount.com", "popmail.com", "popsmail.com", "popstar.com", "populus.net", "portableoffice.com", "portugalmail.com", "portugalmail.pt", "portugalnet.com", "positive-thinking.com", "post.com", "post.cz", "post.sk", "posta.net", "posta.ro", "postaccesslite.com", "postafree.com", "postaweb.com", "postinbox.com", "postino.ch", "postmark.net", "postmaster.co.uk", "postpro.net", "pousa.com", "powerfan.com", "praize.com", "premiumservice.com", "presidency.com", "press.co.jp", "priest.com", "primposta.com", "primposta.hu", "pro.hu", "probemail.com", "prodigy.net", "progetplus.it", "programmer.net", "programozo.hu", "proinbox.com", "project2k.com", "prolaunch.com", "promessage.com", "prontomail.com", "psv-supporter.com", "ptd.net", "public.usa.com", "publicist.com", "pulp-fiction.com", "punkass.com", "qatarmail.com", "qprfans.com", "qq.com", "qrio.com", "quackquack.com", "quakemail.com", "qudsmail.com", "quepasa.com", "quickwebmail.com", "quiklinks.com", "quikmail.com", "qwest.net", "qwestoffice.net", "r-o-o-t.com", "raakim.com", "racedriver.com", "racefanz.com", "racingfan.com.au", "racingmail.com", "radicalz.com", "ragingbull.com", "ranmamail.com", "rastogi.net", "ratt-n-roll.com", "rattle-snake.com", "ravearena.com", "ravemail.com", "razormail.com", "rccgmail.org", "realemail.net", "reallyfast.biz", "realradiomail.com", "recycler.com", "rediffmail.com", "rediffmailpro.com", "rednecks.com", "redseven.de", "redsfans.com", "reggafan.com", "registerednurses.com", "repairman.com", "reply.hu", "representative.com", "rescueteam.com", "resumemail.com", "rezai.com", "richmondhill.com", "rickymail.com", "rin.ru", "riopreto.com.br", "rn.com", "roadrunner.com", "roanokemail.com", "rock.com", "rocketmail.com", "rockfan.com", "rodrun.com", "rome.com", "roosh.com", "rotfl.com", "roughnet.com", "rr.com", "rrohio.com", "rsub.com", "rubyridge.com", "runbox.com", "rushpost.com", "ruttolibero.com", "rvshop.com", "s-mail.com", "sabreshockey.com", "sacbeemail.com", "safarimail.com", "safe-mail.net", "sagra.lu", "sailormoon.com", "saintly.com", "saintmail.net", "sale-sale-sale.com", "salehi.net", "samerica.com", "samilan.net", "sammimail.com", "sanfranmail.com", "sanook.com", "sapo.pt", "sativa.ro.org", "saudia.com", "sayhi.net", "sbcglobal.net", "scandalmail.com", "schizo.com", "schoolemail.com", "schoolmail.com", "schoolsucks.com", "schweiz.org", "sci.fi", "science.com.au", "scientist.com", "scifianime.com", "scottishmail.co.uk", "scubadiving.com", "seanet.com", "searchwales.com", "sebil.com", "secret-police.com", "secretservices.net", "seductive.com", "seekstoyboy.com", "seguros.com.br", "send.hu", "sendme.cz", "sent.com", "sentrismail.com", "serga.com.ar", "servemymail.com", "sesmail.com", "sexmagnet.com", "seznam.cz", "shahweb.net", "shaniastuff.com", "sharewaredevelopers.com", "sharmaweb.com", "she.com", "shootmail.com", "shotgun.hu", "shuf.com", "sialkotcity.com", "sialkotian.com", "sialkotoye.com", "sify.com", "silkroad.net", "sinamail.com", "singapore.com", "singmail.com", "singnet.com.sg", "singpost.com", "skafan.com", "skim.com", "skizo.hu", "slamdunkfan.com", "slingshot.com", "slo.net", "slotter.com", "smapxsmap.net", "smileyface.comsmithemail.net", "smoothmail.com", "snail-mail.net", "snail-mail.ney", "snakemail.com", "sndt.net", "sneakemail.com", "snet.net", "sniper.hu", "snoopymail.com", "snowboarding.com", "snowdonia.net", "socamail.com", "socceramerica.net", "soccermail.com", "soccermomz.com", "sociologist.com", "softhome.net", "sol.dk", "soldier.hu", "soon.com", "soulfoodcookbook.com", "sp.nl", "space-bank.com", "space-man.com", "space-ship.com", "space-travel.com", "space.com", "spaceart.com", "spacebank.com", "spacemart.com", "spacetowns.com", "spacewar.com", "spamex.com", "spartapiet.com", "spazmail.com", "speedemail.net", "speedpost.net", "speedrules.com", "speedrulz.com", "spils.com", "spinfinder.com", "sportemail.com", "sportsmail.com", "sporttruckdriver.com", "spray.no", "spray.se", "spymac.com", "srilankan.net", "st-davids.net", "stade.fr", "stalag13.com", "stargateradio.com", "starmail.com", "starmail.org", "starmedia.com", "starplace.com", "starspath.com", "start.com.au", "starting-point.com", "startrekmail.com", "stealthmail.com", "stockracer.com", "stones.com", "stopdropandroll.com", "storksite.com", "stribmail.com", "strompost.com", "strongguy.com", "studentcenter.org", "subnetwork.com", "subram.com", "sudanmail.net", "suhabi.com", "suisse.org", "sukhumvit.net", "sunpoint.net", "sunrise-sunset.com", "sunsgame.com", "sunumail.sn", "superdada.com", "supereva.it", "supermail.ru", "surat.com", "surf3.net", "surfree.com", "surfy.net", "surimail.com", "survivormail.com", "swbell.net", "sweb.cz", "swiftdesk.com", "swingeasyhithard.com", "swingfan.com", "swipermail.zzn.com", "swirve.com", "swissinfo.org", "swissmail.net", "switchboardmail.com", "switzerland.org", "sx172.com", "syom.com", "syriamail.com", "t2mail.com", "takuyakimura.com", "talk21.com", "talkcity.com", "tamil.com", "tampabay.rr.com", "tatanova.com", "tbwt.com", "tds.net", "teamdiscovery.com", "teamtulsa.net", "tech4peace.org", "techemail.com", "techie.com", "technisamail.co.za", "technologist.com", "techpointer.com", "techscout.com", "techseek.com", "techspot.com", "teenagedirtbag.com", "telebot.com", "telebot.net", "teleline.es", "telerymd.com", "teleserve.dynip.com", "telinco.net", "telkom.net", "telpage.net", "temtulsa.net", "tenchiclub.com", "tenderkiss.com", "tennismail.com", "terra.cl", "terra.com", "terra.com.ar", "terra.com.br", "terra.es", "tfanus.com.er", "tfz.net", "thai.com", "thaimail.com", "thaimail.net", "the-african.com", "the-airforce.com", "the-aliens.com", "the-american.com", "the-animal.com", "the-army.com", "the-astronaut.com", "the-beauty.com", "the-big-apple.com", "the-biker.com", "the-boss.com", "the-brazilian.com", "the-canadian.com", "the-canuck.com", "the-captain.com", "the-chinese.com", "the-country.com", "the-cowboy.com", "the-davis-home.com", "the-dutchman.com", "the-eagles.com", "the-englishman.com", "the-fastest.net", "the-fool.com", "the-frenchman.com", "the-galaxy.net", "the-genius.com", "the-gentleman.com", "the-german.com", "the-gremlin.com", "the-hooligan.com", "the-italian.com", "the-japanese.com", "the-lair.com", "the-madman.com", "the-mailinglist.com", "the-marine.com", "the-master.com", "the-mexican.com", "the-ministry.com", "the-monkey.com", "the-newsletter.net", "the-pentagon.com", "the-police.com", "the-prayer.com", "the-professional.com", "the-quickest.com", "the-russian.com", "the-snake.com", "the-spaceman.com", "the-stock-market.com", "the-student.net", "the-whitehouse.net", "the-wild-west.com", "the18th.com", "thecoolguy.com", "thecriminals.com", "thedoghousemail.com", "thedorm.com", "theend.hu", "theglobe.com", "thegolfcourse.com", "thegooner.com", "theheadoffice.com", "thelanddownunder.com", "themillionare.net", "theoffice.net", "thepokerface.com", "thepostmaster.net", "theraces.com", "theracetrack.com", "thestreetfighter.com", "theteebox.com", "thewatercooler.com", "thewebpros.co.uk", "thewizzard.com", "thewizzkid.com", "thezhangs.net", "thirdage.com", "thisgirl.com", "thoic.com", "thundermail.com", "tidni.com", "timein.net", "tiscali.at", "tiscali.be", "tiscali.co.uk", "tiscali.lu", "tiscali.se", "tkcity.com", "toolsource.com", "topchat.com", "topgamers.co.uk", "topletter.com", "topmail.com.ar", "topsurf.com", "topteam.bg", "torchmail.com", "totalmusic.net", "toughguy.net", "tpg.com.au", "travel.li", "trialbytrivia.com", "tritium.net", "trmailbox.com", "tropicalstorm.com", "truckers.com", "truckerz.com", "truckracer.com", "trust-me.com", "tsamail.co.za", "ttml.co.in", "tunisiamail.com", "turkey.com", "twinstarsmail.com", "tycoonmail.com", "typemail.com", "u2club.com", "uae.ac", "uaemail.com", "ubbi.com", "ubbi.com.br", "uboot.com", "uk2k.com", "uk2net.com", "uk7.net", "uk8.net", "ukbuilder.com", "ukcool.com", "ukdreamcast.com", "ukmail.org", "ukmax.com", "ukr.net", "uku.co.uk", "ultapulta.com", "ultrapostman.com", "ummah.org", "umpire.com", "unbounded.com", "unforgettable.com", "uni.de", "unican.es", "unihome.com", "universal.pt", "uno.ee", "uno.it", "unofree.it", "unomail.com", "uol.com.ar", "uol.com.br", "uol.com.co", "uol.com.mx", "uol.com.ve", "uole.com", "uole.com.ve", "uolmail.com", "uomail.com", "upf.org", "ureach.com", "urgentmail.biz", "usa.com", "usa.net", "usaaccess.net", "usanetmail.com", "usermail.com", "usma.net", "usmc.net", "uswestmail.net", "uymail.com", "uyuyuy.com", "v-sexi.com", "vahoo.com", "varbizmail.com", "vcmail.com", "velnet.co.uk", "velocall.com", "verizon.net", "verizonmail.com", "veryfast.biz", "veryspeedy.net", "violinmakers.co.uk", "vip.gr", "vipmail.ru", "virgilio.it", "virgin.net", "virtualactive.com", "virtualmail.com", "visitmail.com", "visitweb.com", "visto.com", "visualcities.com", "vivavelocity.com", "vivianhsu.net", "vjmail.com", "vjtimail.com", "vlmail.com", "vnn.vn", "volcanomail.com", "vote-democrats.com", "vote-hillary.com", "vote-republicans.com", "vote4gop.org", "votenet.com", "vr9.com", "w3.to", "wahoye.com", "wales2000.net", "wam.co.za", "wanadoo.es", "warmmail.com", "warpmail.net", "warrior.hu", "waumail.com", "wbdet.com", "wearab.net", "web-mail.com.ar", "web-police.com", "web.de", "webave.com", "webcammail.com", "webcity.ca", "webdream.com", "webinbox.com", "webindia123.com", "webjump.com", "webmail.bellsouth.net", "webmail.co.yu", "webmail.co.za", "webmail.hu", "webmails.com", "webprogramming.com", "webstation.com", "websurfer.co.za", "webtopmail.com", "weedmail.com", "weekmail.com", "weekonline.com", "wehshee.com", "welsh-lady.com", "whale-mail.com", "whartontx.com", "wheelweb.com", "whipmail.com", "whoever.com", "whoopymail.com", "wickedmail.com", "wideopenwest.com", "wildmail.com", "windrivers.net", "windstream.net", "wingnutz.com", "winmail.com.au", "winning.com", "witty.com", "wiz.cc", "wkbwmail.com", "woh.rr.com", "wolf-web.com", "wombles.com", "wonder-net.com", "wongfaye.com", "wooow.it", "workmail.com", "worldemail.com", "worldmailer.com", "worldnet.att.net", "wosaddict.com", "wouldilie.com", "wowgirl.com", "wowmail.com", "wowway.com", "wp.pl", "wptamail.com", "wrestlingpages.com", "wrexham.net", "writeme.com", "writemeback.com", "wrongmail.com", "wtvhmail.com", "wwdg.com", "www.com", "www2000.net", "wx88.net", "wxs.net", "wyrm.supernews.com", "x-mail.net", "x-networks.net", "x5g.com", "xmastime.com", "xmsg.com", "xoom.com", "xoommail.com", "xpressmail.zzn.com", "xsmail.com", "xuno.com", "xzapmail.com", "yada-yada.com", "yaho.com", "yahoo.ca", "yahoo.co.id", "yahoo.co.in", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.nz", "yahoo.co.uk", "yahoo.com", "yahoo.com.ar", "yahoo.com.au", "yahoo.com.br", "yahoo.com.cn", "yahoo.com.hk", "yahoo.com.is", "yahoo.com.mx", "yahoo.com.ru", "yahoo.com.sg", "yahoo.de", "yahoo.dk", "yahoo.es", "yahoo.fr", "yahoo.ie", "yahoo.it", "yahoo.jp", "yahoo.ru", "yahoo.se", "yahoofs.com", "yalla.com", "yalla.com.lb", "yalook.com", "yam.com", "yandex.com", "yandex.ru", "yapost.com", "yawmail.com", "yclub.com", "yebox.com", "yehaa.com", "yehey.com", "yemenmail.com", "yepmail.net", "yesbox.net", "yifan.net", "ymail.com", "ynnmail.com", "yogotemail.com", "yopolis.com", "youareadork.com", "youpy.com", "your-house.com", "yourinbox.com", "yourlover.net", "yourname.ddns.org", "yourname.freeservers.com", "yournightmare.com", "yours.com", "yourssincerely.com", "yoursubdomain.findhere.com", "yoursubdomain.zzn.com", "yourteacher.net", "yourwap.com", "youvegotmail.net", "yuuhuu.net", "yyhmail.com", "zahadum.com", "zcities.com", "zdnetmail.com", "zeeks.com", "zeepost.nl", "zensearch.net", "zhaowei.net", "zionweb.org", "zip.net", "zipido.com", "ziplip.com", "zipmail.com", "zipmail.com.br", "zipmax.com", "zmail.ru", "zonnet.nl", "zoominternet.net", "zubee.com", "zuvio.com", "zuzzurello.com", "zwallet.com", "zybermail.com", "zydecofan.com", "zzn.com", "zzom.co.uk");

function nx_is_fee_email(e) {
    e = e.toLowerCase();
    var t = !1;
    for (i in nx_free_email_domain_list)
        if (-1 != e.indexOf("@" + nx_free_email_domain_list[i])) {
            t = !0;
            break
        }
    return t
}! function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? e(require("jquery")) : e(jQuery)
}(function(f) {
    function g(e) {
        return e.replace(/(:|\.|\/)/g, "\\$1")
    }
    var u = {},
        i = function(e) {
            var t = [],
                i = e.dir && "left" === e.dir ? "scrollLeft" : "scrollTop";
            return this.each(function() {
                if (this !== document && this !== window) {
                    var e = f(this);
                    0 < e[i]() ? t.push(this) : (e[i](1), 0 < e[i]() && t.push(this), e[i](0))
                }
            }), t.length || this.each(function() {
                "BODY" === this.nodeName && (t = [this])
            }), "first" === e.el && 1 < t.length && (t = [t[0]]), t
        };
    f.fn.extend({
        scrollable: function(e) {
            var t = i.call(this, {
                dir: e
            });
            return this.pushStack(t)
        },
        firstScrollable: function(e) {
            var t = i.call(this, {
                el: "first",
                dir: e
            });
            return this.pushStack(t)
        },
        smoothScroll: function(e, i) {
            if ("options" === (e = e || {})) return i ? this.each(function() {
                var e = f(this),
                    t = f.extend(e.data("ssOpts") || {}, i);
                f(this).data("ssOpts", t)
            }) : this.first().data("ssOpts");
            var h = f.extend({}, f.fn.smoothScroll.defaults, e),
                p = f.smoothScroll.filterPath(location.pathname);
            return this.unbind("click.smoothscroll").bind("click.smoothscroll", function(e) {
                var t = this,
                    i = f(this),
                    o = f.extend({}, h, i.data("ssOpts") || {}),
                    n = h.exclude,
                    a = o.excludeWithin,
                    s = 0,
                    r = 0,
                    l = !0,
                    c = {},
                    m = location.hostname === t.hostname || !t.hostname,
                    d = o.scrollTarget || f.smoothScroll.filterPath(t.pathname) === p,
                    u = g(t.hash);
                if (o.scrollTarget || m && d && u) {
                    for (; l && n.length > s;) i.is(g(n[s++])) && (l = !1);
                    for (; l && a.length > r;) i.closest(a[r++]).length && (l = !1)
                } else l = !1;
                l && (o.preventDefault && e.preventDefault(), f.extend(c, o, {
                    scrollTarget: o.scrollTarget || u,
                    link: t
                }), f.smoothScroll(c))
            }), this
        }
    }), f.smoothScroll = function(e, t) {
        if ("options" === e && "object" == typeof t) return f.extend(u, t);
        var i, o, n, a, s, r = 0,
            l = "offset",
            c = "scrollTop",
            m = {},
            d = {};
        "number" == typeof e ? (i = f.extend({
            link: null
        }, f.fn.smoothScroll.defaults, u), n = e) : (i = f.extend({
            link: null
        }, f.fn.smoothScroll.defaults, e || {}, u)).scrollElement && (l = "position", "static" === i.scrollElement.css("position") && i.scrollElement.css("position", "relative")), c = "left" === i.direction ? "scrollLeft" : c, i.scrollElement ? (o = i.scrollElement, /^(?:HTML|BODY)$/.test(o[0].nodeName) || (r = o[c]())) : o = f("html, body").firstScrollable(i.direction), i.beforeScroll.call(o, i), n = "number" == typeof e ? e : t || f(i.scrollTarget)[l]() && f(i.scrollTarget)[l]()[i.direction] || 0, m[c] = n + r + i.offset, "auto" === (a = i.speed) && ((s = m[c] - o.scrollTop()) < 0 && (s *= -1), a = s / i.autoCoefficient), d = {
            duration: a,
            easing: i.easing,
            complete: function() {
                i.afterScroll.call(i.link, i)
            }
        }, i.step && (d.step = i.step), o.length ? o.stop().animate(m, d) : i.afterScroll.call(i.link, i)
    }, f.smoothScroll.version = "1.5.5", f.smoothScroll.filterPath = function(e) {
        return (e = e || "").replace(/^\//, "").replace(/(?:index|default).[a-zA-Z]{3,4}$/, "").replace(/\/$/, "")
    }, f.fn.smoothScroll.defaults = {
        exclude: [],
        excludeWithin: [],
        offset: 0,
        direction: "top",
        scrollElement: null,
        scrollTarget: null,
        beforeScroll: function() {},
        afterScroll: function() {},
        easing: "swing",
        speed: 400,
        autoCoefficient: 2,
        preventDefault: !0
    }
}),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function(m) {
    var d, o, u, n, h, t, l = "Close",
        c = "BeforeClose",
        p = "MarkupParse",
        f = "Open",
        g = ".mfp",
        v = "mfp-ready",
        i = "mfp-removing",
        s = "mfp-prevent-close",
        e = function() {},
        r = !!window.jQuery,
        y = m(window),
        w = function(e, t) {
            d.ev.on("mfp" + e + g, t)
        },
        b = function(e, t, i, o) {
            var n = document.createElement("div");
            return n.className = "mfp-" + e, i && (n.innerHTML = i), o ? t && t.appendChild(n) : (n = m(n), t && n.appendTo(t)), n
        },
        _ = function(e, t) {
            d.ev.triggerHandler("mfp" + e, t), d.st.callbacks && (e = e.charAt(0).toLowerCase() + e.slice(1), d.st.callbacks[e] && d.st.callbacks[e].apply(d, m.isArray(t) ? t : [t]))
        },
        k = function(e) {
            return e === t && d.currTemplate.closeBtn || (d.currTemplate.closeBtn = m(d.st.closeMarkup.replace("%title%", d.st.tClose)), t = e), d.currTemplate.closeBtn
        },
        a = function() {
            m.magnificPopup.instance || ((d = new e).init(), m.magnificPopup.instance = d)
        };
    e.prototype = {
        constructor: e,
        init: function() {
            var e = navigator.appVersion;
            d.isIE7 = -1 !== e.indexOf("MSIE 7."), d.isIE8 = -1 !== e.indexOf("MSIE 8."), d.isLowIE = d.isIE7 || d.isIE8, d.isAndroid = /android/gi.test(e), d.isIOS = /iphone|ipad|ipod/gi.test(e), d.supportsTransition = function() {
                var e = document.createElement("p").style,
                    t = ["ms", "O", "Moz", "Webkit"];
                if (void 0 !== e.transition) return !0;
                for (; t.length;)
                    if (t.pop() + "Transition" in e) return !0;
                return !1
            }(), d.probablyMobile = d.isAndroid || d.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), u = m(document), d.popupsCache = {}
        },
        open: function(e) {
            var t;
            if (!1 === e.isObj) {
                d.items = e.items.toArray(), d.index = 0;
                var i, o = e.items;
                for (t = 0; t < o.length; t++)
                    if ((i = o[t]).parsed && (i = i.el[0]), i === e.el[0]) {
                        d.index = t;
                        break
                    }
            } else d.items = m.isArray(e.items) ? e.items : [e.items], d.index = e.index || 0;
            if (!d.isOpen) {
                d.types = [], h = "", d.ev = e.mainEl && e.mainEl.length ? e.mainEl.eq(0) : u, e.key ? (d.popupsCache[e.key] || (d.popupsCache[e.key] = {}), d.currTemplate = d.popupsCache[e.key]) : d.currTemplate = {}, d.st = m.extend(!0, {}, m.magnificPopup.defaults, e), d.fixedContentPos = "auto" === d.st.fixedContentPos ? !d.probablyMobile : d.st.fixedContentPos, d.st.modal && (d.st.closeOnContentClick = !1, d.st.closeOnBgClick = !1, d.st.showCloseBtn = !1, d.st.enableEscapeKey = !1), d.bgOverlay || (d.bgOverlay = b("bg").on("click" + g, function() {
                    d.close()
                }), d.wrap = b("wrap").attr("tabindex", -1).on("click" + g, function(e) {
                    d._checkIfClose(e.target) && d.close()
                }), d.container = b("container", d.wrap)), d.contentContainer = b("content"), d.st.preloader && (d.preloader = b("preloader", d.container, d.st.tLoading));
                var n = m.magnificPopup.modules;
                for (t = 0; t < n.length; t++) {
                    var a = n[t];
                    a = a.charAt(0).toUpperCase() + a.slice(1), d["init" + a].call(d)
                }
                _("BeforeOpen"), d.st.showCloseBtn && (d.st.closeBtnInside ? (w(p, function(e, t, i, o) {
                    i.close_replaceWith = k(o.type)
                }), h += " mfp-close-btn-in") : d.wrap.append(k())), d.st.alignTop && (h += " mfp-align-top"), d.wrap.css(d.fixedContentPos ? {
                    overflow: d.st.overflowY,
                    overflowX: "hidden",
                    overflowY: d.st.overflowY
                } : {
                    top: y.scrollTop(),
                    position: "absolute"
                }), (!1 === d.st.fixedBgPos || "auto" === d.st.fixedBgPos && !d.fixedContentPos) && d.bgOverlay.css({
                    height: u.height(),
                    position: "absolute"
                }), d.st.enableEscapeKey && u.on("keyup" + g, function(e) {
                    27 === e.keyCode && d.close()
                }), y.on("resize" + g, function() {
                    d.updateSize()
                }), d.st.closeOnContentClick || (h += " mfp-auto-cursor"), h && d.wrap.addClass(h);
                var s = d.wH = y.height(),
                    r = {};
                if (d.fixedContentPos && d._hasScrollBar(s)) {
                    var l = d._getScrollbarSize();
                    l && (r.marginRight = l)
                }
                d.fixedContentPos && (d.isIE7 ? m("body, html").css("overflow", "hidden") : r.overflow = "hidden");
                var c = d.st.mainClass;
                return d.isIE7 && (c += " mfp-ie7"), c && d._addClassToMFP(c), d.updateItemHTML(), _("BuildControls"), m("html").css(r), d.bgOverlay.add(d.wrap).prependTo(d.st.prependTo || m(document.body)), d._lastFocusedEl = document.activeElement, setTimeout(function() {
                    d.content ? (d._addClassToMFP(v), d._setFocus()) : d.bgOverlay.addClass(v), u.on("focusin" + g, d._onFocusIn)
                }, 16), d.isOpen = !0, d.updateSize(s), _(f), e
            }
            d.updateItemHTML()
        },
        close: function() {
            d.isOpen && (_(c), d.isOpen = !1, d.st.removalDelay && !d.isLowIE && d.supportsTransition ? (d._addClassToMFP(i), setTimeout(function() {
                d._close()
            }, d.st.removalDelay)) : d._close())
        },
        _close: function() {
            _(l);
            var e = i + " " + v + " ";
            if (d.bgOverlay.detach(), d.wrap.detach(), d.container.empty(), d.st.mainClass && (e += d.st.mainClass + " "), d._removeClassFromMFP(e), d.fixedContentPos) {
                var t = {
                    marginRight: ""
                };
                d.isIE7 ? m("body, html").css("overflow", "") : t.overflow = "", m("html").css(t)
            }
            u.off("keyup.mfp focusin" + g), d.ev.off(g), d.wrap.attr("class", "mfp-wrap").removeAttr("style"), d.bgOverlay.attr("class", "mfp-bg"), d.container.attr("class", "mfp-container"), !d.st.showCloseBtn || d.st.closeBtnInside && !0 !== d.currTemplate[d.currItem.type] || d.currTemplate.closeBtn && d.currTemplate.closeBtn.detach(), d._lastFocusedEl && m(d._lastFocusedEl).focus(), d.currItem = null, d.content = null, d.currTemplate = null, d.prevHeight = 0, _("AfterClose")
        },
        updateSize: function(e) {
            if (d.isIOS) {
                var t = document.documentElement.clientWidth / window.innerWidth,
                    i = window.innerHeight * t;
                d.wrap.css("height", i), d.wH = i
            } else d.wH = e || y.height();
            d.fixedContentPos || d.wrap.css("height", d.wH), _("Resize")
        },
        updateItemHTML: function() {
            var e = d.items[d.index];
            d.contentContainer.detach(), d.content && d.content.detach(), e.parsed || (e = d.parseEl(d.index));
            var t = e.type;
            if (_("BeforeChange", [d.currItem ? d.currItem.type : "", t]), d.currItem = e, !d.currTemplate[t]) {
                var i = !!d.st[t] && d.st[t].markup;
                _("FirstMarkupParse", i), d.currTemplate[t] = !i || m(i)
            }
            n && n !== e.type && d.container.removeClass("mfp-" + n + "-holder");
            var o = d["get" + t.charAt(0).toUpperCase() + t.slice(1)](e, d.currTemplate[t]);
            d.appendContent(o, t), e.preloaded = !0, _("Change", e), n = e.type, d.container.prepend(d.contentContainer), _("AfterChange")
        },
        appendContent: function(e, t) {
            (d.content = e) ? d.st.showCloseBtn && d.st.closeBtnInside && !0 === d.currTemplate[t] ? d.content.find(".mfp-close").length || d.content.append(k()) : d.content = e: d.content = "", _("BeforeAppend"), d.container.addClass("mfp-" + t + "-holder"), d.contentContainer.append(d.content)
        },
        parseEl: function(e) {
            var t, i = d.items[e];
            if (i.tagName ? i = {
                    el: m(i)
                } : (t = i.type, i = {
                    data: i,
                    src: i.src
                }), i.el) {
                for (var o = d.types, n = 0; n < o.length; n++)
                    if (i.el.hasClass("mfp-" + o[n])) {
                        t = o[n];
                        break
                    }
                i.src = i.el.attr("data-mfp-src"), i.src || (i.src = i.el.attr("href"))
            }
            return i.type = t || d.st.type || "inline", i.index = e, i.parsed = !0, d.items[e] = i, _("ElementParse", i), d.items[e]
        },
        addGroup: function(t, i) {
            var e = function(e) {
                e.mfpEl = this, d._openClick(e, t, i)
            };
            i || (i = {});
            var o = "click.magnificPopup";
            i.mainEl = t, i.items ? (i.isObj = !0, t.off(o).on(o, e)) : (i.isObj = !1, i.delegate ? t.off(o).on(o, i.delegate, e) : (i.items = t).off(o).on(o, e))
        },
        _openClick: function(e, t, i) {
            if ((void 0 !== i.midClick ? i.midClick : m.magnificPopup.defaults.midClick) || 2 !== e.which && !e.ctrlKey && !e.metaKey) {
                var o = void 0 !== i.disableOn ? i.disableOn : m.magnificPopup.defaults.disableOn;
                if (o)
                    if (m.isFunction(o)) {
                        if (!o.call(d)) return !0
                    } else if (y.width() < o) return !0;
                e.type && (e.preventDefault(), d.isOpen && e.stopPropagation()), i.el = m(e.mfpEl), i.delegate && (i.items = t.find(i.delegate)), d.open(i)
            }
        },
        updateStatus: function(e, t) {
            if (d.preloader) {
                o !== e && d.container.removeClass("mfp-s-" + o), t || "loading" !== e || (t = d.st.tLoading);
                var i = {
                    status: e,
                    text: t
                };
                _("UpdateStatus", i), e = i.status, t = i.text, d.preloader.html(t), d.preloader.find("a").on("click", function(e) {
                    e.stopImmediatePropagation()
                }), d.container.addClass("mfp-s-" + e), o = e
            }
        },
        _checkIfClose: function(e) {
            if (!m(e).hasClass(s)) {
                var t = d.st.closeOnContentClick,
                    i = d.st.closeOnBgClick;
                if (t && i) return !0;
                if (!d.content || m(e).hasClass("mfp-close") || d.preloader && e === d.preloader[0]) return !0;
                if (e === d.content[0] || m.contains(d.content[0], e)) {
                    if (t) return !0
                } else if (i && m.contains(document, e)) return !0;
                return !1
            }
        },
        _addClassToMFP: function(e) {
            d.bgOverlay.addClass(e), d.wrap.addClass(e)
        },
        _removeClassFromMFP: function(e) {
            this.bgOverlay.removeClass(e), d.wrap.removeClass(e)
        },
        _hasScrollBar: function(e) {
            return (d.isIE7 ? u.height() : document.body.scrollHeight) > (e || y.height())
        },
        _setFocus: function() {
            (d.st.focus ? d.content.find(d.st.focus).eq(0) : d.wrap).focus()
        },
        _onFocusIn: function(e) {
            return e.target === d.wrap[0] || m.contains(d.wrap[0], e.target) ? void 0 : (d._setFocus(), !1)
        },
        _parseMarkup: function(n, e, t) {
            var a;
            t.data && (e = m.extend(t.data, e)), _(p, [n, e, t]), m.each(e, function(e, t) {
                if (void 0 === t || !1 === t) return !0;
                if (1 < (a = e.split("_")).length) {
                    var i = n.find(g + "-" + a[0]);
                    if (0 < i.length) {
                        var o = a[1];
                        "replaceWith" === o ? i[0] !== t[0] && i.replaceWith(t) : "img" === o ? i.is("img") ? i.attr("src", t) : i.replaceWith('<img src="' + t + '" class="' + i.attr("class") + '" />') : i.attr(a[1], t)
                    }
                } else n.find(g + "-" + e).html(t)
            })
        },
        _getScrollbarSize: function() {
            if (void 0 === d.scrollbarSize) {
                var e = document.createElement("div");
                e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(e), d.scrollbarSize = e.offsetWidth - e.clientWidth, document.body.removeChild(e)
            }
            return d.scrollbarSize
        }
    }, m.magnificPopup = {
        instance: null,
        proto: e.prototype,
        modules: [],
        open: function(e, t) {
            return a(), (e = e ? m.extend(!0, {}, e) : {}).isObj = !0, e.index = t || 0, this.instance.open(e)
        },
        close: function() {
            return m.magnificPopup.instance && m.magnificPopup.instance.close()
        },
        registerModule: function(e, t) {
            t.options && (m.magnificPopup.defaults[e] = t.options), m.extend(this.proto, t.proto), this.modules.push(e)
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading..."
        }
    }, m.fn.magnificPopup = function(e) {
        a();
        var t = m(this);
        if ("string" == typeof e)
            if ("open" === e) {
                var i, o = r ? t.data("magnificPopup") : t[0].magnificPopup,
                    n = parseInt(arguments[1], 10) || 0;
                o.items ? i = o.items[n] : (i = t, o.delegate && (i = i.find(o.delegate)), i = i.eq(n)), d._openClick({
                    mfpEl: i
                }, t, o)
            } else d.isOpen && d[e].apply(d, Array.prototype.slice.call(arguments, 1));
        else e = m.extend(!0, {}, e), r ? t.data("magnificPopup", e) : t[0].magnificPopup = e, d.addGroup(t, e);
        return t
    };
    var C, x, S, T = "inline",
        E = function() {
            S && (x.after(S.addClass(C)).detach(), S = null)
        };
    m.magnificPopup.registerModule(T, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function() {
                d.types.push(T), w(l + "." + T, function() {
                    E()
                })
            },
            getInline: function(e, t) {
                if (E(), e.src) {
                    var i = d.st.inline,
                        o = m(e.src);
                    if (o.length) {
                        var n = o[0].parentNode;
                        n && n.tagName && (x || (C = i.hiddenClass, x = b(C), C = "mfp-" + C), S = o.after(x).detach().removeClass(C)), d.updateStatus("ready")
                    } else d.updateStatus("error", i.tNotFound), o = m("<div>");
                    return e.inlineElement = o
                }
                return d.updateStatus("ready"), d._parseMarkup(t, {}, e), t
            }
        }
    });
    var A, $ = "ajax",
        I = function() {
            A && m(document.body).removeClass(A)
        },
        D = function() {
            I(), d.req && d.req.abort()
        };
    m.magnificPopup.registerModule($, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function() {
                d.types.push($), A = d.st.ajax.cursor, w(l + "." + $, D), w("BeforeChange." + $, D)
            },
            getAjax: function(n) {
                A && m(document.body).addClass(A), d.updateStatus("loading");
                var e = m.extend({
                    url: n.src,
                    success: function(e, t, i) {
                        var o = {
                            data: e,
                            xhr: i
                        };
                        _("ParseAjax", o), d.appendContent(m(o.data), $), n.finished = !0, I(), d._setFocus(), setTimeout(function() {
                            d.wrap.addClass(v)
                        }, 16), d.updateStatus("ready"), _("AjaxContentAdded")
                    },
                    error: function() {
                        I(), n.finished = n.loadError = !0, d.updateStatus("error", d.st.ajax.tError.replace("%url%", n.src))
                    }
                }, d.st.ajax.settings);
                return d.req = m.ajax(e), ""
            }
        }
    });
    var O;
    m.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function() {
                var e = d.st.image,
                    t = ".image";
                d.types.push("image"), w(f + t, function() {
                    "image" === d.currItem.type && e.cursor && m(document.body).addClass(e.cursor)
                }), w(l + t, function() {
                    e.cursor && m(document.body).removeClass(e.cursor), y.off("resize" + g)
                }), w("Resize" + t, d.resizeImage), d.isLowIE && w("AfterChange", d.resizeImage)
            },
            resizeImage: function() {
                var e = d.currItem;
                if (e && e.img && d.st.image.verticalFit) {
                    var t = 0;
                    d.isLowIE && (t = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)), e.img.css("max-height", d.wH - t)
                }
            },
            _onImageHasSize: function(e) {
                e.img && (e.hasSize = !0, O && clearInterval(O), e.isCheckingImgSize = !1, _("ImageHasSize", e), e.imgHidden && (d.content && d.content.removeClass("mfp-loading"), e.imgHidden = !1))
            },
            findImageSize: function(t) {
                var i = 0,
                    o = t.img[0],
                    n = function(e) {
                        O && clearInterval(O), O = setInterval(function() {
                            return 0 < o.naturalWidth ? void d._onImageHasSize(t) : (200 < i && clearInterval(O), void(3 === ++i ? n(10) : 40 === i ? n(50) : 100 === i && n(500)))
                        }, e)
                    };
                n(1)
            },
            getImage: function(e, t) {
                var i = 0,
                    o = function() {
                        e && (e.img[0].complete ? (e.img.off(".mfploader"), e === d.currItem && (d._onImageHasSize(e), d.updateStatus("ready")), e.hasSize = !0, e.loaded = !0, _("ImageLoadComplete")) : ++i < 200 ? setTimeout(o, 100) : n())
                    },
                    n = function() {
                        e && (e.img.off(".mfploader"), e === d.currItem && (d._onImageHasSize(e), d.updateStatus("error", a.tError.replace("%url%", e.src))), e.hasSize = !0, e.loaded = !0, e.loadError = !0)
                    },
                    a = d.st.image,
                    s = t.find(".mfp-img");
                if (s.length) {
                    var r = document.createElement("img");
                    r.className = "mfp-img", e.el && e.el.find("img").length && (r.alt = e.el.find("img").attr("alt")), e.img = m(r).on("load.mfploader", o).on("error.mfploader", n), r.src = e.src, s.is("img") && (e.img = e.img.clone()), 0 < (r = e.img[0]).naturalWidth ? e.hasSize = !0 : r.width || (e.hasSize = !1)
                }
                return d._parseMarkup(t, {
                    title: function(e) {
                        if (e.data && void 0 !== e.data.title) return e.data.title;
                        var t = d.st.image.titleSrc;
                        if (t) {
                            if (m.isFunction(t)) return t.call(d, e);
                            if (e.el) return e.el.attr(t) || ""
                        }
                        return ""
                    }(e),
                    img_replaceWith: e.img
                }, e), d.resizeImage(), e.hasSize ? (O && clearInterval(O), e.loadError ? (t.addClass("mfp-loading"), d.updateStatus("error", a.tError.replace("%url%", e.src))) : (t.removeClass("mfp-loading"), d.updateStatus("ready"))) : (d.updateStatus("loading"), e.loading = !0, e.hasSize || (e.imgHidden = !0, t.addClass("mfp-loading"), d.findImageSize(e))), t
            }
        }
    });
    var z;
    m.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function(e) {
                return e.is("img") ? e : e.find("img")
            }
        },
        proto: {
            initZoom: function() {
                var e, a = d.st.zoom,
                    t = ".zoom";
                if (a.enabled && d.supportsTransition) {
                    var i, o, n = a.duration,
                        s = function(e) {
                            var t = e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                i = "all " + a.duration / 1e3 + "s " + a.easing,
                                o = {
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: 0,
                                    top: 0,
                                    "-webkit-backface-visibility": "hidden"
                                },
                                n = "transition";
                            return o["-webkit-" + n] = o["-moz-" + n] = o["-o-" + n] = o[n] = i, t.css(o), t
                        },
                        r = function() {
                            d.content.css("visibility", "visible")
                        };
                    w("BuildControls" + t, function() {
                        if (d._allowZoom()) {
                            if (clearTimeout(i), d.content.css("visibility", "hidden"), !(e = d._getItemToZoom())) return void r();
                            (o = s(e)).css(d._getOffset()), d.wrap.append(o), i = setTimeout(function() {
                                o.css(d._getOffset(!0)), i = setTimeout(function() {
                                    r(), setTimeout(function() {
                                        o.remove(), e = o = null, _("ZoomAnimationEnded")
                                    }, 16)
                                }, n)
                            }, 16)
                        }
                    }), w(c + t, function() {
                        if (d._allowZoom()) {
                            if (clearTimeout(i), d.st.removalDelay = n, !e) {
                                if (!(e = d._getItemToZoom())) return;
                                o = s(e)
                            }
                            o.css(d._getOffset(!0)), d.wrap.append(o), d.content.css("visibility", "hidden"), setTimeout(function() {
                                o.css(d._getOffset())
                            }, 16)
                        }
                    }), w(l + t, function() {
                        d._allowZoom() && (r(), o && o.remove(), e = null)
                    })
                }
            },
            _allowZoom: function() {
                return "image" === d.currItem.type
            },
            _getItemToZoom: function() {
                return !!d.currItem.hasSize && d.currItem.img
            },
            _getOffset: function(e) {
                var t, i = (t = e ? d.currItem.img : d.st.zoom.opener(d.currItem.el || d.currItem)).offset(),
                    o = parseInt(t.css("padding-top"), 10),
                    n = parseInt(t.css("padding-bottom"), 10);
                i.top -= m(window).scrollTop() - o;
                var a = {
                    width: t.width(),
                    height: (r ? t.innerHeight() : t[0].offsetHeight) - n - o
                };
                return void 0 === z && (z = void 0 !== document.createElement("p").style.MozTransform), z ? a["-moz-transform"] = a.transform = "translate(" + i.left + "px," + i.top + "px)" : (a.left = i.left, a.top = i.top), a
            }
        }
    });
    var j = "iframe",
        P = function(e) {
            if (d.currTemplate[j]) {
                var t = d.currTemplate[j].find("iframe");
                t.length && (e || (t[0].src = "//about:blank"), d.isIE8 && t.css("display", e ? "block" : "none"))
            }
        };
    m.magnificPopup.registerModule(j, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function() {
                d.types.push(j), w("BeforeChange", function(e, t, i) {
                    t !== i && (t === j ? P() : i === j && P(!0))
                }), w(l + "." + j, function() {
                    P()
                })
            },
            getIframe: function(e, t) {
                var i = e.src,
                    o = d.st.iframe;
                m.each(o.patterns, function() {
                    return -1 < i.indexOf(this.index) ? (this.id && (i = "string" == typeof this.id ? i.substr(i.lastIndexOf(this.id) + this.id.length, i.length) : this.id.call(this, i)), i = this.src.replace("%id%", i), !1) : void 0
                });
                var n = {};
                return o.srcAction && (n[o.srcAction] = i), d._parseMarkup(t, n, e), d.updateStatus("ready"), t
            }
        }
    });
    var L = function(e) {
            var t = d.items.length;
            return t - 1 < e ? e - t : e < 0 ? t + e : e
        },
        M = function(e, t, i) {
            return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, i)
        };
    m.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function() {
                var a = d.st.gallery,
                    e = ".mfp-gallery",
                    n = Boolean(m.fn.mfpFastClick);
                return d.direction = !0, !(!a || !a.enabled) && (h += " mfp-gallery", w(f + e, function() {
                    a.navigateByImgClick && d.wrap.on("click" + e, ".mfp-img", function() {
                        return 1 < d.items.length ? (d.next(), !1) : void 0
                    }), u.on("keydown" + e, function(e) {
                        37 === e.keyCode ? d.prev() : 39 === e.keyCode && d.next()
                    })
                }), w("UpdateStatus" + e, function(e, t) {
                    t.text && (t.text = M(t.text, d.currItem.index, d.items.length))
                }), w(p + e, function(e, t, i, o) {
                    var n = d.items.length;
                    i.counter = 1 < n ? M(a.tCounter, o.index, n) : ""
                }), w("BuildControls" + e, function() {
                    if (1 < d.items.length && a.arrows && !d.arrowLeft) {
                        var e = a.arrowMarkup,
                            t = d.arrowLeft = m(e.replace(/%title%/gi, a.tPrev).replace(/%dir%/gi, "left")).addClass(s),
                            i = d.arrowRight = m(e.replace(/%title%/gi, a.tNext).replace(/%dir%/gi, "right")).addClass(s),
                            o = n ? "mfpFastClick" : "click";
                        t[o](function() {
                            d.prev()
                        }), i[o](function() {
                            d.next()
                        }), d.isIE7 && (b("b", t[0], !1, !0), b("a", t[0], !1, !0), b("b", i[0], !1, !0), b("a", i[0], !1, !0)), d.container.append(t.add(i))
                    }
                }), w("Change" + e, function() {
                    d._preloadTimeout && clearTimeout(d._preloadTimeout), d._preloadTimeout = setTimeout(function() {
                        d.preloadNearbyImages(), d._preloadTimeout = null
                    }, 16)
                }), void w(l + e, function() {
                    u.off(e), d.wrap.off("click" + e), d.arrowLeft && n && d.arrowLeft.add(d.arrowRight).destroyMfpFastClick(), d.arrowRight = d.arrowLeft = null
                }))
            },
            next: function() {
                d.direction = !0, d.index = L(d.index + 1), d.updateItemHTML()
            },
            prev: function() {
                d.direction = !1, d.index = L(d.index - 1), d.updateItemHTML()
            },
            goTo: function(e) {
                d.direction = e >= d.index, d.index = e, d.updateItemHTML()
            },
            preloadNearbyImages: function() {
                var e, t = d.st.gallery.preload,
                    i = Math.min(t[0], d.items.length),
                    o = Math.min(t[1], d.items.length);
                for (e = 1; e <= (d.direction ? o : i); e++) d._preloadItem(d.index + e);
                for (e = 1; e <= (d.direction ? i : o); e++) d._preloadItem(d.index - e)
            },
            _preloadItem: function(e) {
                if (e = L(e), !d.items[e].preloaded) {
                    var t = d.items[e];
                    t.parsed || (t = d.parseEl(e)), _("LazyLoad", t), "image" === t.type && (t.img = m('<img class="mfp-img" />').on("load.mfploader", function() {
                        t.hasSize = !0
                    }).on("error.mfploader", function() {
                        t.hasSize = !0, t.loadError = !0, _("LazyLoadError", t)
                    }).attr("src", t.src)), t.preloaded = !0
                }
            }
        }
    });
    var N, H, B, q = "retina";
    m.magnificPopup.registerModule(q, {
        options: {
            replaceSrc: function(e) {
                return e.src.replace(/\.\w+$/, function(e) {
                    return "@2x" + e
                })
            },
            ratio: 1
        },
        proto: {
            initRetina: function() {
                if (1 < window.devicePixelRatio) {
                    var i = d.st.retina,
                        o = i.ratio;
                    1 < (o = isNaN(o) ? o() : o) && (w("ImageHasSize." + q, function(e, t) {
                        t.img.css({
                            "max-width": t.img[0].naturalWidth / o,
                            width: "100%"
                        })
                    }), w("ElementParse." + q, function(e, t) {
                        t.src = i.replaceSrc(t, o)
                    }))
                }
            }
        }
    }), N = "ontouchstart" in window, H = function() {
        y.off("touchmove" + B + " touchend" + B)
    }, B = ".mfpFastClick", m.fn.mfpFastClick = function(l) {
        return m(this).each(function() {
            var t, i, o, n, a, s, r, e = m(this);
            N && e.on("touchstart" + B, function(e) {
                a = !1, r = 1, s = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0], o = s.clientX, n = s.clientY, y.on("touchmove" + B, function(e) {
                    s = e.originalEvent ? e.originalEvent.touches : e.touches, r = s.length, s = s[0], (10 < Math.abs(s.clientX - o) || 10 < Math.abs(s.clientY - n)) && (a = !0, H())
                }).on("touchend" + B, function(e) {
                    H(), a || 1 < r || (t = !0, e.preventDefault(), clearTimeout(i), i = setTimeout(function() {
                        t = !1
                    }, 1e3), l())
                })
            }), e.on("click" + B, function() {
                t || l()
            })
        })
    }, m.fn.destroyMfpFastClick = function() {
        m(this).off("touchstart" + B + " click" + B), N && y.off("touchmove" + B + " touchend" + B)
    }, a()
}),
function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.viewportUnitsBuggyfill = t()
}(this, function() {
    "use strict";
    var l, c, o, i, e, a = !1,
        t = window.navigator.userAgent,
        m = /([+-]?[0-9.]+)(vh|vw|vmin|vmax)/g,
        s = [].forEach,
        r = !1,
        d = !1,
        u = -1 < t.indexOf("Opera Mini"),
        h = /(iPhone|iPod|iPad).+AppleWebKit/i.test(t) && ((e = t.match(/OS (\d)/)) && 1 < e.length && parseInt(e[1]) < 8),
        p = -1 < t.indexOf(" Android ") && -1 < t.indexOf("Version/") && parseFloat((t.match("Android ([0-9.]+)") || [])[1]) <= 4.4;

    function f() {
        a && (n(), setTimeout(function() {
            i.textContent = v(), i.parentNode.appendChild(i)
        }, 1))
    }

    function n() {
        return o = [], s.call(document.styleSheets, function(e) {
            "patched-viewport" !== e.ownerNode.id && e.cssRules && "ignore" !== e.ownerNode.getAttribute("data-viewport-units-buggyfill") && (e.media && e.media.mediaText && window.matchMedia && !window.matchMedia(e.media.mediaText).matches || s.call(e.cssRules, g))
        }), o
    }

    function g(i) {
        if (7 === i.type) {
            var e;
            try {
                e = i.cssText
            } catch (e) {
                return
            }
            return m.lastIndex = 0, void(m.test(e) && (o.push([i, null, e]), l.hacks && l.hacks.findDeclarations(o, i, null, e)))
        }
        if (i.style) s.call(i.style, function(e) {
            var t = i.style.getPropertyValue(e);
            i.style.getPropertyPriority(e) && (t += " !important"), m.lastIndex = 0, m.test(t) && (o.push([i, e, t]), l.hacks && l.hacks.findDeclarations(o, i, e, t))
        });
        else {
            if (!i.cssRules) return;
            s.call(i.cssRules, function(e) {
                g(e)
            })
        }
    }

    function v() {
        var e, t;
        e = window.innerHeight, t = window.innerWidth, c = {
            vh: e,
            vw: t,
            vmax: Math.max(t, e),
            vmin: Math.min(t, e)
        };
        var n, a, s = [],
            r = [];
        return o.forEach(function(e) {
            var t = function(e, t, i) {
                    var o, n = [];
                    o = i.replace(m, y), l.hacks && (o = l.hacks.overwriteDeclaration(e, t, o));
                    t && (n.push(e.selectorText), o = t + ": " + o + ";");
                    var a = e.parentRule;
                    for (; a;) n.unshift("@media " + a.media.mediaText), a = a.parentRule;
                    return {
                        selector: n,
                        content: o
                    }
                }.apply(null, e),
                i = t.selector.length ? t.selector.join(" {\n") + " {\n" : "",
                o = new Array(t.selector.length + 1).join("\n}");
            if (!i || i !== n) return r.length && (s.push(n + r.join("\n") + a), r.length = 0), void(i ? (n = i, a = o, r.push(t.content)) : (s.push(t.content), a = n = null));
            i && !n && (n = i, a = o), r.push(t.content)
        }), r.length && s.push(n + r.join("\n") + a), u && s.push("* { content: normal !important; }"), s.join("\n\n")
    }

    function y(e, t, i) {
        var o = c[i];
        return parseFloat(t) / 100 * o + "px"
    }

    function w(e) {
        return e.slice(0, e.indexOf("/", e.indexOf("://") + 3))
    }
    return r || (r = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./)), {
        version: "0.5.3",
        findProperties: n,
        getCss: v,
        init: function(e) {
            if (!a) {
                if (!0 === e && (e = {
                        force: !0
                    }), (l = e || {}).isMobileSafari = h, l.isBadStockAndroid = p, d || !l.force && !h && !r && !p && !u && (!l.hacks || !l.hacks.required(l))) return window.console && d && console.info("viewport-units-buggyfill requires a proper CSSOM and basic viewport unit support, which are not available in IE8 and below"), {
                    init: function() {}
                };
                var t, o, n;
                l.hacks && l.hacks.initialize(l), a = !0, (i = document.createElement("style")).id = "patched-viewport", document.head.appendChild(i), t = function() {
                    var i, o, n, e = (i = f, o = l.refreshDebounceWait || 100, function() {
                        var e = this,
                            t = arguments;
                        clearTimeout(n), n = setTimeout(function() {
                            i.apply(e, t)
                        }, o)
                    });
                    window.addEventListener("orientationchange", e, !0), window.addEventListener("pageshow", e, !0), (l.force || r || function() {
                        try {
                            return window.self !== window.top
                        } catch (e) {
                            return !0
                        }
                    }()) && (window.addEventListener("resize", e, !0), l._listeningToResize = !0), l.hacks && l.hacks.initializeEvents(l, f, e), f()
                }, o = 0, n = function() {
                    --o || t()
                }, s.call(document.styleSheets, function(e) {
                    var t, i;
                    e.href && w(e.href) !== w(location.href) && "ignore" !== e.ownerNode.getAttribute("data-viewport-units-buggyfill") && (o++, t = e.ownerNode, i = n, function(e, t, i) {
                        var o = new XMLHttpRequest;
                        if ("withCredentials" in o) o.open("GET", e, !0);
                        else {
                            if ("undefined" == typeof XDomainRequest) throw new Error("cross-domain XHR not supported");
                            (o = new XDomainRequest).open("GET", e)
                        }
                        o.onload = t, o.onerror = i, o.send()
                    }(t.href, function() {
                        var e = document.createElement("style");
                        e.media = t.media, e.setAttribute("data-href", t.href), e.textContent = this.responseText, t.parentNode.replaceChild(e, t), i()
                    }, i))
                }), o || t()
            }
        },
        refresh: f
    }
}),
function(l, c, a, r) {
    function i(e, t) {
        this.settings = null, this.options = l.extend({}, i.Defaults, t), this.$element = l(e), this.drag = l.extend({}, o), this.state = l.extend({}, n), this.e = l.extend({}, s), this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._invalidated = {}, this._pipe = [], l.each(i.Plugins, l.proxy(function(e, t) {
            this._plugins[e[0].toLowerCase() + e.slice(1)] = new t(this)
        }, this)), l.each(i.Pipe, l.proxy(function(e, t) {
            this._pipe.push({
                filter: t.filter,
                run: l.proxy(t.run, this)
            })
        }, this)), this.setup(), this.initialize()
    }

    function m(e) {
        if (e.touches !== r) return {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
        };
        if (e.touches === r) {
            if (e.pageX !== r) return {
                x: e.pageX,
                y: e.pageY
            };
            if (e.pageX === r) return {
                x: e.clientX,
                y: e.clientY
            }
        }
    }

    function e(e) {
        var t, i, o = a.createElement("div"),
            n = e;
        for (t in n)
            if (i = n[t], void 0 !== o.style[i]) return o = null, [i, t];
        return [!1]
    }
    var o, n, s;
    i.Defaults = {
        items: 3,
        loop: !(s = {
            _onDragStart: null,
            _onDragMove: null,
            _onDragEnd: null,
            _transitionEnd: null,
            _resizer: null,
            _responsiveCall: null,
            _goToLoop: null,
            _checkVisibile: null
        }),
        center: !(n = {
            isTouch: !(o = {
                start: 0,
                startX: 0,
                startY: 0,
                current: 0,
                currentX: 0,
                currentY: 0,
                offsetX: 0,
                offsetY: 0,
                distance: null,
                startTime: 0,
                endTime: 0,
                updatedX: 0,
                targetEl: null
            }),
            isScrolling: !1,
            isSwiping: !1,
            direction: !1,
            inMotion: !1
        }),
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: c,
        responsiveClass: !1,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        themeClass: "owl-theme",
        baseClass: "owl-carousel",
        itemClass: "owl-item",
        centerClass: "center",
        activeClass: "active"
    }, i.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    }, i.Plugins = {}, i.Pipe = [{
        filter: ["width", "items", "settings"],
        run: function(e) {
            e.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"],
        run: function() {
            var e = this._clones;
            (this.$stage.children(".cloned").length !== e.length || !this.settings.loop && 0 < e.length) && (this.$stage.children(".cloned").remove(), this._clones = [])
        }
    }, {
        filter: ["items", "settings"],
        run: function() {
            var e, t, i = this._clones,
                o = this._items,
                n = this.settings.loop ? i.length - Math.max(2 * this.settings.items, 4) : 0;
            for (e = 0, t = Math.abs(n / 2); e < t; e++) 0 < n ? (this.$stage.children().eq(o.length + i.length - 1).remove(), i.pop(), this.$stage.children().eq(0).remove(), i.pop()) : (i.push(i.length / 2), this.$stage.append(o[i[i.length - 1]].clone().addClass("cloned")), i.push(o.length - 1 - (i.length - 1) / 2), this.$stage.prepend(o[i[i.length - 1]].clone().addClass("cloned")))
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            var e, t, i, o = this.settings.rtl ? 1 : -1,
                n = (this.width() / this.settings.items).toFixed(3),
                a = 0;
            for (this._coordinates = [], t = 0, i = this._clones.length + this._items.length; t < i; t++) e = this._mergers[this.relative(t)], e = this.settings.mergeFit && Math.min(e, this.settings.items) || e, a += (this.settings.autoWidth ? this._items[this.relative(t)].width() + this.settings.margin : n * e) * o, this._coordinates.push(a)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            var e, t, i = (this.width() / this.settings.items).toFixed(3),
                o = {
                    width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding,
                    "padding-left": this.settings.stagePadding || "",
                    "padding-right": this.settings.stagePadding || ""
                };
            if (this.$stage.css(o), (o = {
                    width: this.settings.autoWidth ? "auto" : i - this.settings.margin
                })[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, !this.settings.autoWidth && 0 < l.grep(this._mergers, function(e) {
                    return 1 < e
                }).length)
                for (e = 0, t = this._coordinates.length; e < t; e++) o.width = Math.abs(this._coordinates[e]) - Math.abs(this._coordinates[e - 1] || 0) - this.settings.margin, this.$stage.children().eq(e).css(o);
            else this.$stage.children().css(o)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(e) {
            e.current && this.reset(this.$stage.children().index(e.current))
        }
    }, {
        filter: ["position"],
        run: function() {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"],
        run: function() {
            var e, t, i, o, n = this.settings.rtl ? 1 : -1,
                a = 2 * this.settings.stagePadding,
                s = this.coordinates(this.current()) + a,
                r = s + this.width() * n,
                l = [];
            for (i = 0, o = this._coordinates.length; i < o; i++) e = this._coordinates[i - 1] || 0, t = Math.abs(this._coordinates[i]) + a * n, (this.op(e, "<=", s) && this.op(e, ">", r) || this.op(t, "<", s) && this.op(t, ">", r)) && l.push(i);
            this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass), this.$stage.children(":eq(" + l.join("), :eq(") + ")").addClass(this.settings.activeClass), this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass))
        }
    }], i.prototype.initialize = function() {
        var e, t, i;
        if ((this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), this.browserSupport(), this.settings.autoWidth && !0 !== this.state.imagesLoaded) && (e = this.$element.find("img"), t = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : r, i = this.$element.children(t).width(), e.length && i <= 0)) return this.preloadAutoWidthImages(e), !1;
        this.$element.addClass("owl-loading"), this.$stage = l("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this._width = this.$element.width(), this.refresh(), this.$element.removeClass("owl-loading").addClass("owl-loaded"), this.eventsCall(), this.internalEvents(), this.addTriggerableEvents(), this.trigger("initialized")
    }, i.prototype.setup = function() {
        var t = this.viewport(),
            e = this.options.responsive,
            i = -1,
            o = null;
        e ? (l.each(e, function(e) {
            e <= t && i < e && (i = Number(e))
        }), delete(o = l.extend({}, this.options, e[i])).responsive, o.responsiveClass && this.$element.attr("class", function(e, t) {
            return t.replace(/\b owl-responsive-\S+/g, "")
        }).addClass("owl-responsive-" + i)) : o = l.extend({}, this.options), (null === this.settings || this._breakpoint !== i) && (this.trigger("change", {
            property: {
                name: "settings",
                value: o
            }
        }), this._breakpoint = i, this.settings = o, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        }))
    }, i.prototype.optionsLogic = function() {
        this.$element.toggleClass("owl-center", this.settings.center), this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1), this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, i.prototype.prepare = function(e) {
        var t = this.trigger("prepare", {
            content: e
        });
        return t.data || (t.data = l("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(e)), this.trigger("prepared", {
            content: t.data
        }), t.data
    }, i.prototype.update = function() {
        for (var e = 0, t = this._pipe.length, i = l.proxy(function(e) {
                return this[e]
            }, this._invalidated), o = {}; e < t;)(this._invalidated.all || 0 < l.grep(this._pipe[e].filter, i).length) && this._pipe[e].run(o), e++;
        this._invalidated = {}
    }, i.prototype.width = function(e) {
        switch (e = e || i.Width.Default) {
            case i.Width.Inner:
            case i.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, i.prototype.refresh = function() {
        if (0 === this._items.length) return !1;
        (new Date).getTime(), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$stage.addClass("owl-refresh"), this.update(), this.$stage.removeClass("owl-refresh"), this.state.orientation = c.orientation, this.watchVisibility(), this.trigger("refreshed")
    }, i.prototype.eventsCall = function() {
        this.e._onDragStart = l.proxy(function(e) {
            this.onDragStart(e)
        }, this), this.e._onDragMove = l.proxy(function(e) {
            this.onDragMove(e)
        }, this), this.e._onDragEnd = l.proxy(function(e) {
            this.onDragEnd(e)
        }, this), this.e._onResize = l.proxy(function(e) {
            this.onResize(e)
        }, this), this.e._transitionEnd = l.proxy(function(e) {
            this.transitionEnd(e)
        }, this), this.e._preventClick = l.proxy(function(e) {
            this.preventClick(e)
        }, this)
    }, i.prototype.onThrottledResize = function() {
        c.clearTimeout(this.resizeTimer), this.resizeTimer = c.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate)
    }, i.prototype.onResize = function() {
        return !!this._items.length && (this._width !== this.$element.width() && (!this.trigger("resize").isDefaultPrevented() && (this._width = this.$element.width(), this.invalidate("width"), this.refresh(), void this.trigger("resized"))))
    }, i.prototype.eventsRouter = function(e) {
        var t = e.type;
        "mousedown" === t || "touchstart" === t ? this.onDragStart(e) : "mousemove" === t || "touchmove" === t ? this.onDragMove(e) : "mouseup" === t || "touchend" === t ? this.onDragEnd(e) : "touchcancel" === t && this.onDragEnd(e)
    }, i.prototype.internalEvents = function() {
        var e = ("ontouchstart" in c || navigator.msMaxTouchPoints, c.navigator.msPointerEnabled);
        this.settings.mouseDrag ? (this.$stage.on("mousedown", l.proxy(function(e) {
            this.eventsRouter(e)
        }, this)), this.$stage.on("dragstart", function() {
            return !1
        }), this.$stage.get(0).onselectstart = function() {
            return !1
        }) : this.$element.addClass("owl-text-select-on"), this.settings.touchDrag && !e && this.$stage.on("touchstart touchcancel", l.proxy(function(e) {
            this.eventsRouter(e)
        }, this)), this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1), !1 !== this.settings.responsive && this.on(c, "resize", l.proxy(this.onThrottledResize, this))
    }, i.prototype.onDragStart = function(e) {
        var t, i, o, n;
        if (3 === (t = e.originalEvent || e || c.event).which || this.state.isTouch) return !1;
        if ("mousedown" === t.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), this.drag.startTime = (new Date).getTime(), this.speed(0), this.state.isTouch = !0, this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, i = m(t).x, o = m(t).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), this.state.inMotion && this.support3d) n = this.getTransformProperty(), this.drag.offsetX = n, this.animate(n), this.state.inMotion = !0;
        else if (this.state.inMotion && !this.support3d) return this.state.inMotion = !1;
        this.drag.startX = i - this.drag.offsetX, this.drag.startY = o - this.drag.offsetY, this.drag.start = i - this.drag.startX, this.drag.targetEl = t.target || t.srcElement, this.drag.updatedX = this.drag.start, ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1), l(a).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", l.proxy(function(e) {
            this.eventsRouter(e)
        }, this))
    }, i.prototype.onDragMove = function(e) {
        var t, i, o, n, a, s;
        this.state.isTouch && (this.state.isScrolling || (i = m(t = e.originalEvent || e || c.event).x, o = m(t).y, this.drag.currentX = i - this.drag.startX, this.drag.currentY = o - this.drag.startY, this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : 0 < this.drag.distance && (this.state.direction = this.settings.rtl ? "left" : "right"), this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (n = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), a = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), s = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, n + s), a + s)), (8 < this.drag.distance || this.drag.distance < -8) && (t.preventDefault !== r ? t.preventDefault() : t.returnValue = !1, this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (16 < this.drag.currentY || this.drag.currentY < -16) && !1 === this.state.isSwiping && (this.state.isScrolling = !0, this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX)))
    }, i.prototype.onDragEnd = function(e) {
        var t, i;
        if (this.state.isTouch) {
            if ("mouseup" === e.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, this.state.isSwiping = !1, 0 === this.drag.distance && !0 !== this.state.inMotion) return this.state.inMotion = !1;
            this.drag.endTime = (new Date).getTime(), t = this.drag.endTime - this.drag.startTime, (3 < Math.abs(this.drag.distance) || 300 < t) && this.removeClick(this.drag.targetEl), i = this.closest(this.drag.updatedX), this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(i), this.invalidate("position"), this.update(), this.settings.pullDrag || this.drag.updatedX !== this.coordinates(i) || this.transitionEnd(), this.drag.distance = 0, l(a).off(".owl.dragEvents")
        }
    }, i.prototype.removeClick = function(e) {
        this.drag.targetEl = e, l(e).on("click.preventClick", this.e._preventClick), c.setTimeout(function() {
            l(e).off("click.preventClick")
        }, 300)
    }, i.prototype.preventClick = function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation && e.stopPropagation(), l(e.target).off("click.preventClick")
    }, i.prototype.getTransformProperty = function() {
        var e;
        return !0 !== (16 === (e = (e = c.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform")).replace(/matrix(3d)?\(|\)/g, "").split(",")).length) ? e[4] : e[12]
    }, i.prototype.closest = function(i) {
        var o = -1,
            n = this.width(),
            a = this.coordinates();
        return this.settings.freeDrag || l.each(a, l.proxy(function(e, t) {
            return t - 30 < i && i < t + 30 ? o = e : this.op(i, "<", t) && this.op(i, ">", a[e + 1] || t - n) && (o = "left" === this.state.direction ? e + 1 : e), -1 === o
        }, this)), this.settings.loop || (this.op(i, ">", a[this.minimum()]) ? o = i = this.minimum() : this.op(i, "<", a[this.maximum()]) && (o = i = this.maximum())), o
    }, i.prototype.animate = function(e) {
        this.trigger("translate"), this.state.inMotion = 0 < this.speed(), this.support3d ? this.$stage.css({
            transform: "translate3d(" + e + "px,0px, 0px)",
            transition: this.speed() / 1e3 + "s"
        }) : this.state.isTouch ? this.$stage.css({
            left: e + "px"
        }) : this.$stage.animate({
            left: e
        }, this.speed() / 1e3, this.settings.fallbackEasing, l.proxy(function() {
            this.state.inMotion && this.transitionEnd()
        }, this))
    }, i.prototype.current = function(e) {
        if (e === r) return this._current;
        if (0 === this._items.length) return r;
        if (e = this.normalize(e), this._current !== e) {
            var t = this.trigger("change", {
                property: {
                    name: "position",
                    value: e
                }
            });
            t.data !== r && (e = this.normalize(t.data)), this._current = e, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, i.prototype.invalidate = function(e) {
        this._invalidated[e] = !0
    }, i.prototype.reset = function(e) {
        (e = this.normalize(e)) !== r && (this._speed = 0, this._current = e, this.suppress(["translate", "translated"]), this.animate(this.coordinates(e)), this.release(["translate", "translated"]))
    }, i.prototype.normalize = function(e, t) {
        var i = t ? this._items.length : this._items.length + this._clones.length;
        return !l.isNumeric(e) || i < 1 ? r : e = this._clones.length ? (e % i + i) % i : Math.max(this.minimum(t), Math.min(this.maximum(t), e))
    }, i.prototype.relative = function(e) {
        return e = this.normalize(e), e -= this._clones.length / 2, this.normalize(e, !0)
    }, i.prototype.maximum = function(e) {
        var t, i, o, n = 0,
            a = this.settings;
        if (e) return this._items.length - 1;
        if (!a.loop && a.center) t = this._items.length - 1;
        else if (a.loop || a.center)
            if (a.loop || a.center) t = this._items.length + a.items;
            else {
                if (!a.autoWidth && !a.merge) throw "Can not detect maximum absolute position.";
                for (revert = a.rtl ? 1 : -1, i = this.$stage.width() - this.$element.width();
                    (o = this.coordinates(n)) && !(o * revert >= i);) t = ++n
            }
        else t = this._items.length - a.items;
        return t
    }, i.prototype.minimum = function(e) {
        return e ? 0 : this._clones.length / 2
    }, i.prototype.items = function(e) {
        return e === r ? this._items.slice() : (e = this.normalize(e, !0), this._items[e])
    }, i.prototype.mergers = function(e) {
        return e === r ? this._mergers.slice() : (e = this.normalize(e, !0), this._mergers[e])
    }, i.prototype.clones = function(i) {
        var t = this._clones.length / 2,
            o = t + this._items.length,
            n = function(e) {
                return e % 2 == 0 ? o + e / 2 : t - (e + 1) / 2
            };
        return i === r ? l.map(this._clones, function(e, t) {
            return n(t)
        }) : l.map(this._clones, function(e, t) {
            return e === i ? n(t) : null
        })
    }, i.prototype.speed = function(e) {
        return e !== r && (this._speed = e), this._speed
    }, i.prototype.coordinates = function(e) {
        var t = null;
        return e === r ? l.map(this._coordinates, l.proxy(function(e, t) {
            return this.coordinates(t)
        }, this)) : (this.settings.center ? (t = this._coordinates[e], t += (this.width() - t + (this._coordinates[e - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : t = this._coordinates[e - 1] || 0, t)
    }, i.prototype.duration = function(e, t, i) {
        return Math.min(Math.max(Math.abs(t - e), 1), 6) * Math.abs(i || this.settings.smartSpeed)
    }, i.prototype.to = function(e, t) {
        if (this.settings.loop) {
            var i = e - this.relative(this.current()),
                o = this.current(),
                n = this.current(),
                a = this.current() + i,
                s = n - a < 0,
                r = this._clones.length + this._items.length;
            a < this.settings.items && !1 === s ? (o = n + this._items.length, this.reset(o)) : a >= r - this.settings.items && !0 === s && (o = n - this._items.length, this.reset(o)), c.clearTimeout(this.e._goToLoop), this.e._goToLoop = c.setTimeout(l.proxy(function() {
                this.speed(this.duration(this.current(), o + i, t)), this.current(o + i), this.update()
            }, this), 30)
        } else this.speed(this.duration(this.current(), e, t)), this.current(e), this.update()
    }, i.prototype.next = function(e) {
        e = e || !1, this.to(this.relative(this.current()) + 1, e)
    }, i.prototype.prev = function(e) {
        e = e || !1, this.to(this.relative(this.current()) - 1, e)
    }, i.prototype.transitionEnd = function(e) {
        return (e === r || (e.stopPropagation(), (e.target || e.srcElement || e.originalTarget) === this.$stage.get(0))) && (this.state.inMotion = !1, void this.trigger("translated"))
    }, i.prototype.viewport = function() {
        var e;
        if (this.options.responsiveBaseElement !== c) e = l(this.options.responsiveBaseElement).width();
        else if (c.innerWidth) e = c.innerWidth;
        else {
            if (!a.documentElement || !a.documentElement.clientWidth) throw "Can not detect viewport width.";
            e = a.documentElement.clientWidth
        }
        return e
    }, i.prototype.replace = function(e) {
        this.$stage.empty(), this._items = [], e && (e = e instanceof jQuery ? e : l(e)), this.settings.nestedItemSelector && (e = e.find("." + this.settings.nestedItemSelector)), e.filter(function() {
            return 1 === this.nodeType
        }).each(l.proxy(function(e, t) {
            t = this.prepare(t), this.$stage.append(t), this._items.push(t), this._mergers.push(1 * t.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(l.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, i.prototype.add = function(e, t) {
        t = t === r ? this._items.length : this.normalize(t, !0), this.trigger("add", {
            content: e,
            position: t
        }), 0 === this._items.length || t === this._items.length ? (this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[t].before(e), this._items.splice(t, 0, e), this._mergers.splice(t, 0, 1 * e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)), this.invalidate("items"), this.trigger("added", {
            content: e,
            position: t
        })
    }, i.prototype.remove = function(e) {
        (e = this.normalize(e, !0)) !== r && (this.trigger("remove", {
            content: this._items[e],
            position: e
        }), this._items[e].remove(), this._items.splice(e, 1), this._mergers.splice(e, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: e
        }))
    }, i.prototype.addTriggerableEvents = function() {
        var i = l.proxy(function(t, i) {
            return l.proxy(function(e) {
                e.relatedTarget !== this && (this.suppress([i]), t.apply(this, [].slice.call(arguments, 1)), this.release([i]))
            }, this)
        }, this);
        l.each({
            next: this.next,
            prev: this.prev,
            to: this.to,
            destroy: this.destroy,
            refresh: this.refresh,
            replace: this.replace,
            add: this.add,
            remove: this.remove
        }, l.proxy(function(e, t) {
            this.$element.on(e + ".owl.carousel", i(t, e + ".owl.carousel"))
        }, this))
    }, i.prototype.watchVisibility = function() {
        function e(e) {
            return 0 < e.offsetWidth && 0 < e.offsetHeight
        }
        e(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), c.clearInterval(this.e._checkVisibile), this.e._checkVisibile = c.setInterval(l.proxy(function() {
            e(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), c.clearInterval(this.e._checkVisibile))
        }, this), 500))
    }, i.prototype.preloadAutoWidthImages = function(i) {
        var o, n, a, s;
        o = 0, n = this, i.each(function(e, t) {
            a = l(t), (s = new Image).onload = function() {
                o++, a.attr("src", s.src), a.css("opacity", 1), o >= i.length && (n.state.imagesLoaded = !0, n.initialize())
            }, s.src = a.attr("src") || a.attr("data-src") || a.attr("data-src-retina")
        })
    }, i.prototype.destroy = function() {
        for (var e in this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass), !1 !== this.settings.responsive && l(c).off("resize.owl.carousel"), this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd), this._plugins) this._plugins[e].destroy();
        (this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), l(a).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function() {}, this.$stage.off("dragstart", function() {
            return !1
        })), this.$element.off(".owl"), this.$stage.children(".cloned").remove(), this.e = null, this.$element.removeData("owlCarousel"), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.unwrap()
    }, i.prototype.op = function(e, t, i) {
        var o = this.settings.rtl;
        switch (t) {
            case "<":
                return o ? i < e : e < i;
            case ">":
                return o ? e < i : i < e;
            case ">=":
                return o ? e <= i : i <= e;
            case "<=":
                return o ? i <= e : e <= i
        }
    }, i.prototype.on = function(e, t, i, o) {
        e.addEventListener ? e.addEventListener(t, i, o) : e.attachEvent && e.attachEvent("on" + t, i)
    }, i.prototype.off = function(e, t, i, o) {
        e.removeEventListener ? e.removeEventListener(t, i, o) : e.detachEvent && e.detachEvent("on" + t, i)
    }, i.prototype.trigger = function(e, t, i) {
        var o = {
                item: {
                    count: this._items.length,
                    index: this.current()
                }
            },
            n = l.camelCase(l.grep(["on", e, i], function(e) {
                return e
            }).join("-").toLowerCase()),
            a = l.Event([e, "owl", i || "carousel"].join(".").toLowerCase(), l.extend({
                relatedTarget: this
            }, o, t));
        return this._supress[e] || (l.each(this._plugins, function(e, t) {
            t.onTrigger && t.onTrigger(a)
        }), this.$element.trigger(a), this.settings && "function" == typeof this.settings[n] && this.settings[n].apply(this, a)), a
    }, i.prototype.suppress = function(e) {
        l.each(e, l.proxy(function(e, t) {
            this._supress[t] = !0
        }, this))
    }, i.prototype.release = function(e) {
        l.each(e, l.proxy(function(e, t) {
            delete this._supress[t]
        }, this))
    }, i.prototype.browserSupport = function() {
        if (this.support3d = e(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0], this.support3d) {
            this.transformVendor = e(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0];
            this.transitionEndVendor = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"][e(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1]], this.vendorName = this.transformVendor.replace(/Transform/i, ""), this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : ""
        }
        this.state.orientation = c.orientation
    }, l.fn.owlCarousel = function(e) {
        return this.each(function() {
            l(this).data("owlCarousel") || l(this).data("owlCarousel", new i(this, e))
        })
    }, l.fn.owlCarousel.Constructor = i
}(window.Zepto || window.jQuery, window, document),
function(r, a) {
    var t = function(e) {
        this._core = e, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel": r.proxy(function(e) {
                if (e.namespace && this._core.settings && this._core.settings.lazyLoad && (e.property && "position" == e.property.name || "initialized" == e.type))
                    for (var t = this._core.settings, i = t.center && Math.ceil(t.items / 2) || t.items, o = t.center && -1 * i || 0, n = (e.property && e.property.value || this._core.current()) + o, a = this._core.clones().length, s = r.proxy(function(e, t) {
                            this.load(t)
                        }, this); o++ < i;) this.load(a / 2 + this._core.relative(n)), a && r.each(this._core.clones(this._core.relative(n++)), s)
            }, this)
        }, this._core.options = r.extend({}, t.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    t.Defaults = {
        lazyLoad: !1
    }, t.prototype.load = function(e) {
        var t = this._core.$stage.children().eq(e),
            i = t && t.find(".owl-lazy");
        !i || -1 < r.inArray(t.get(0), this._loaded) || (i.each(r.proxy(function(e, t) {
            var i, o = r(t),
                n = 1 < a.devicePixelRatio && o.attr("data-src-retina") || o.attr("data-src");
            this._core.trigger("load", {
                element: o,
                url: n
            }, "lazy"), o.is("img") ? o.one("load.owl.lazy", r.proxy(function() {
                o.css("opacity", 1), this._core.trigger("loaded", {
                    element: o,
                    url: n
                }, "lazy")
            }, this)).attr("src", n) : ((i = new Image).onload = r.proxy(function() {
                o.css({
                    "background-image": "url(" + n + ")",
                    opacity: "1"
                }), this._core.trigger("loaded", {
                    element: o,
                    url: n
                }, "lazy")
            }, this), i.src = n)
        }, this)), this._loaded.push(t.get(0)))
    }, t.prototype.destroy = function() {
        var e, t;
        for (e in this.handlers) this._core.$element.off(e, this.handlers[e]);
        for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
    }, r.fn.owlCarousel.Constructor.Plugins.Lazy = t
}(window.Zepto || window.jQuery, window, document),
function(t) {
    var i = function(e) {
        this._core = e, this._handlers = {
            "initialized.owl.carousel": t.proxy(function() {
                this._core.settings.autoHeight && this.update()
            }, this),
            "changed.owl.carousel": t.proxy(function(e) {
                this._core.settings.autoHeight && "position" == e.property.name && this.update()
            }, this),
            "loaded.owl.lazy": t.proxy(function(e) {
                this._core.settings.autoHeight && e.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update()
            }, this)
        }, this._core.options = t.extend({}, i.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    i.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    }, i.prototype.update = function() {
        this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass)
    }, i.prototype.destroy = function() {
        var e, t;
        for (e in this._handlers) this._core.$element.off(e, this._handlers[e]);
        for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.AutoHeight = i
}(window.Zepto || window.jQuery, window, document),
function(m, t, i) {
    var o = function(e) {
        this._core = e, this._videos = {}, this._playing = null, this._fullscreen = !1, this._handlers = {
            "resize.owl.carousel": m.proxy(function(e) {
                this._core.settings.video && !this.isInFullScreen() && e.preventDefault()
            }, this),
            "refresh.owl.carousel changed.owl.carousel": m.proxy(function() {
                this._playing && this.stop()
            }, this),
            "prepared.owl.carousel": m.proxy(function(e) {
                var t = m(e.content).find(".owl-video");
                t.length && (t.css("display", "none"), this.fetch(t, m(e.content)))
            }, this)
        }, this._core.options = m.extend({}, o.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", m.proxy(function(e) {
            this.play(e)
        }, this))
    };
    o.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    }, o.prototype.fetch = function(e, t) {
        var i = e.attr("data-vimeo-id") ? "vimeo" : "youtube",
            o = e.attr("data-vimeo-id") || e.attr("data-youtube-id"),
            n = e.attr("data-width") || this._core.settings.videoWidth,
            a = e.attr("data-height") || this._core.settings.videoHeight,
            s = e.attr("href");
        if (!s) throw new Error("Missing video URL.");
        if (-1 < (o = s.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/))[3].indexOf("youtu")) i = "youtube";
        else {
            if (!(-1 < o[3].indexOf("vimeo"))) throw new Error("Video URL not supported.");
            i = "vimeo"
        }
        o = o[6], this._videos[s] = {
            type: i,
            id: o,
            width: n,
            height: a
        }, t.attr("data-video", s), this.thumbnail(e, this._videos[s])
    }, o.prototype.thumbnail = function(t, e) {
        var i, o, n = e.width && e.height ? 'style="width:' + e.width + "px;height:" + e.height + 'px;"' : "",
            a = t.find("img"),
            s = "src",
            r = "",
            l = this._core.settings,
            c = function(e) {
                '<div class="owl-video-play-icon"></div>',
                i = l.lazyLoad ? '<div class="owl-video-tn ' + r + '" ' + s + '="' + e + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + e + ')"></div>',
                t.after(i),
                t.after('<div class="owl-video-play-icon"></div>')
            };
        return t.wrap('<div class="owl-video-wrapper"' + n + "></div>"), this._core.settings.lazyLoad && (s = "data-src", r = "owl-lazy"), a.length ? (c(a.attr(s)), a.remove(), !1) : void("youtube" === e.type ? (o = "http://img.youtube.com/vi/" + e.id + "/hqdefault.jpg", c(o)) : "vimeo" === e.type && m.ajax({
            type: "GET",
            url: "http://vimeo.com/api/v2/video/" + e.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function(e) {
                o = e[0].thumbnail_large, c(o)
            }
        }))
    }, o.prototype.stop = function() {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null
    }, o.prototype.play = function(e) {
        this._core.trigger("play", null, "video"), this._playing && this.stop();
        var t, i, o = m(e.target || e.srcElement),
            n = o.closest("." + this._core.settings.itemClass),
            a = this._videos[n.attr("data-video")],
            s = a.width || "100%",
            r = a.height || this._core.$stage.height();
        "youtube" === a.type ? t = '<iframe width="' + s + '" height="' + r + '" src="http://www.youtube.com/embed/' + a.id + "?autoplay=1&v=" + a.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === a.type && (t = '<iframe src="http://player.vimeo.com/video/' + a.id + '?autoplay=1" width="' + s + '" height="' + r + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'), n.addClass("owl-video-playing"), this._playing = n, i = m('<div style="height:' + r + "px; width:" + s + 'px" class="owl-video-frame">' + t + "</div>"), o.after(i)
    }, o.prototype.isInFullScreen = function() {
        var e = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
        return e && m(e).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), !(e && this._fullscreen && this._playing) && (this._fullscreen ? this._fullscreen = !1 : !this._playing || this._core.state.orientation === t.orientation || (this._core.state.orientation = t.orientation, !1))
    }, o.prototype.destroy = function() {
        var e, t;
        for (e in this._core.$element.off("click.owl.video"), this._handlers) this._core.$element.off(e, this._handlers[e]);
        for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
    }, m.fn.owlCarousel.Constructor.Plugins.Video = o
}(window.Zepto || window.jQuery, window, document),
function(s, e, t, i) {
    var o = function(e) {
        this.core = e, this.core.options = s.extend({}, o.Defaults, this.core.options), this.swapping = !0, this.previous = void 0, this.next = void 0, this.handlers = {
            "change.owl.carousel": s.proxy(function(e) {
                "position" == e.property.name && (this.previous = this.core.current(), this.next = e.property.value)
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": s.proxy(function(e) {
                this.swapping = "translated" == e.type
            }, this),
            "translate.owl.carousel": s.proxy(function() {
                this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    o.Defaults = {
        animateOut: !1,
        animateIn: !1
    }, o.prototype.swap = function() {
        if (1 === this.core.settings.items && this.core.support3d) {
            this.core.speed(0);
            var e, t = s.proxy(this.clear, this),
                i = this.core.$stage.children().eq(this.previous),
                o = this.core.$stage.children().eq(this.next),
                n = this.core.settings.animateIn,
                a = this.core.settings.animateOut;
            this.core.current() !== this.previous && (a && (e = this.core.coordinates(this.previous) - this.core.coordinates(this.next), i.css({
                left: e + "px"
            }).addClass("animated owl-animated-out").addClass(a).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", t)), n && o.addClass("animated owl-animated-in").addClass(n).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", t))
        }
    }, o.prototype.clear = function(e) {
        s(e.target).css({
            left: ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.transitionEnd()
    }, o.prototype.destroy = function() {
        var e, t;
        for (e in this.handlers) this.core.$element.off(e, this.handlers[e]);
        for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
    }, s.fn.owlCarousel.Constructor.Plugins.Animate = o
}(window.Zepto || window.jQuery, window, document),
function(t, i, e) {
    var o = function(e) {
        this.core = e, this.core.options = t.extend({}, o.Defaults, this.core.options), this.handlers = {
            "translated.owl.carousel refreshed.owl.carousel": t.proxy(function() {
                this.autoplay()
            }, this),
            "play.owl.autoplay": t.proxy(function(e, t, i) {
                this.play(t, i)
            }, this),
            "stop.owl.autoplay": t.proxy(function() {
                this.stop()
            }, this),
            "mouseover.owl.autoplay": t.proxy(function() {
                this.core.settings.autoplayHoverPause && this.pause()
            }, this),
            "mouseleave.owl.autoplay": t.proxy(function() {
                this.core.settings.autoplayHoverPause && this.autoplay()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    o.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, o.prototype.autoplay = function() {
        this.core.settings.autoplay && !this.core.state.videoPlay ? (i.clearInterval(this.interval), this.interval = i.setInterval(t.proxy(function() {
            this.play()
        }, this), this.core.settings.autoplayTimeout)) : i.clearInterval(this.interval)
    }, o.prototype.play = function() {
        return !0 === e.hidden || this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion ? void 0 : !1 === this.core.settings.autoplay ? void i.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed)
    }, o.prototype.stop = function() {
        i.clearInterval(this.interval)
    }, o.prototype.pause = function() {
        i.clearInterval(this.interval)
    }, o.prototype.destroy = function() {
        var e, t;
        for (e in i.clearInterval(this.interval), this.handlers) this.core.$element.off(e, this.handlers[e]);
        for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.autoplay = o
}(window.Zepto || window.jQuery, window, document),
function(a) {
    "use strict";
    var t = function(e) {
        this._core = e, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": a.proxy(function(e) {
                this._core.settings.dotsData && this._templates.push(a(e.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
            }, this),
            "add.owl.carousel": a.proxy(function(e) {
                this._core.settings.dotsData && this._templates.splice(e.position, 0, a(e.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
            }, this),
            "remove.owl.carousel prepared.owl.carousel": a.proxy(function(e) {
                this._core.settings.dotsData && this._templates.splice(e.position, 1)
            }, this),
            "change.owl.carousel": a.proxy(function(e) {
                if ("position" == e.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
                    var t = this._core.current(),
                        i = this._core.maximum(),
                        o = this._core.minimum();
                    e.data = e.property.value > i ? i <= t ? o : i : e.property.value < o ? i : e.property.value
                }
            }, this),
            "changed.owl.carousel": a.proxy(function(e) {
                "position" == e.property.name && this.draw()
            }, this),
            "refreshed.owl.carousel": a.proxy(function() {
                this._initialized || (this.initialize(), this._initialized = !0), this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation")
            }, this)
        }, this._core.options = a.extend({}, t.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    t.Defaults = {
        nav: !1,
        navRewind: !0,
        navText: ["prev", "next"],
        navSpeed: !1,
        navElement: "div",
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotData: !1,
        dotsSpeed: !1,
        dotsContainer: !1,
        controlsClass: "owl-controls"
    }, t.prototype.initialize = function() {
        var e, t, i = this._core.settings;
        for (t in i.dotsData || (this._templates = [a("<div>").addClass(i.dotClass).append(a("<span>")).prop("outerHTML")]), i.navContainer && i.dotsContainer || (this._controls.$container = a("<div>").addClass(i.controlsClass).appendTo(this.$element)), this._controls.$indicators = i.dotsContainer ? a(i.dotsContainer) : a("<div>").hide().addClass(i.dotsClass).appendTo(this._controls.$container), this._controls.$indicators.on("click", "div", a.proxy(function(e) {
                var t = a(e.target).parent().is(this._controls.$indicators) ? a(e.target).index() : a(e.target).parent().index();
                e.preventDefault(), this.to(t, i.dotsSpeed)
            }, this)), e = i.navContainer ? a(i.navContainer) : a("<div>").addClass(i.navContainerClass).prependTo(this._controls.$container), this._controls.$next = a("<" + i.navElement + ">"), this._controls.$previous = this._controls.$next.clone(), this._controls.$previous.addClass(i.navClass[0]).html(i.navText[0]).hide().prependTo(e).on("click", a.proxy(function() {
                this.prev(i.navSpeed)
            }, this)), this._controls.$next.addClass(i.navClass[1]).html(i.navText[1]).hide().appendTo(e).on("click", a.proxy(function() {
                this.next(i.navSpeed)
            }, this)), this._overrides) this._core[t] = a.proxy(this[t], this)
    }, t.prototype.destroy = function() {
        var e, t, i, o;
        for (e in this._handlers) this.$element.off(e, this._handlers[e]);
        for (t in this._controls) this._controls[t].remove();
        for (o in this.overides) this._core[o] = this._overrides[o];
        for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, t.prototype.update = function() {
        var e, t, i = this._core.settings,
            o = this._core.clones().length / 2,
            n = o + this._core.items().length,
            a = i.center || i.autoWidth || i.dotData ? 1 : i.dotsEach || i.items;
        if ("page" !== i.slideBy && (i.slideBy = Math.min(i.slideBy, i.items)), i.dots || "page" == i.slideBy)
            for (this._pages = [], e = o, t = 0; e < n; e++)(a <= t || 0 === t) && (this._pages.push({
                start: e - o,
                end: e - o + a - 1
            }), t = 0, 0), t += this._core.mergers(this._core.relative(e))
    }, t.prototype.draw = function() {
        var e, t, i = "",
            o = this._core.settings,
            n = (this._core.$stage.children(), this._core.relative(this._core.current()));
        if (!o.nav || o.loop || o.navRewind || (this._controls.$previous.toggleClass("disabled", n <= 0), this._controls.$next.toggleClass("disabled", n >= this._core.maximum())), this._controls.$previous.toggle(o.nav), this._controls.$next.toggle(o.nav), o.dots) {
            if (e = this._pages.length - this._controls.$indicators.children().length, o.dotData && 0 !== e) {
                for (t = 0; t < this._controls.$indicators.children().length; t++) i += this._templates[this._core.relative(t)];
                this._controls.$indicators.html(i)
            } else 0 < e ? (i = new Array(e + 1).join(this._templates[0]), this._controls.$indicators.append(i)) : e < 0 && this._controls.$indicators.children().slice(e).remove();
            this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(a.inArray(this.current(), this._pages)).addClass("active")
        }
        this._controls.$indicators.toggle(o.dots)
    }, t.prototype.onTrigger = function(e) {
        var t = this._core.settings;
        e.page = {
            index: a.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: t && (t.center || t.autoWidth || t.dotData ? 1 : t.dotsEach || t.items)
        }
    }, t.prototype.current = function() {
        var t = this._core.relative(this._core.current());
        return a.grep(this._pages, function(e) {
            return e.start <= t && e.end >= t
        }).pop()
    }, t.prototype.getPosition = function(e) {
        var t, i, o = this._core.settings;
        return "page" == o.slideBy ? (t = a.inArray(this.current(), this._pages), i = this._pages.length, e ? ++t : --t, t = this._pages[(t % i + i) % i].start) : (t = this._core.relative(this._core.current()), i = this._core.items().length, e ? t += o.slideBy : t -= o.slideBy), t
    }, t.prototype.next = function(e) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), e)
    }, t.prototype.prev = function(e) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), e)
    }, t.prototype.to = function(e, t, i) {
        var o;
        i ? a.proxy(this._overrides.to, this._core)(e, t) : (o = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(e % o + o) % o].start, t))
    }, a.fn.owlCarousel.Constructor.Plugins.Navigation = t
}(window.Zepto || window.jQuery, window, document),
function(i, o) {
    "use strict";
    var t = function(e) {
        this._core = e, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": i.proxy(function() {
                "URLHash" == this._core.settings.startPosition && i(o).trigger("hashchange.owl.navigation")
            }, this),
            "prepared.owl.carousel": i.proxy(function(e) {
                var t = i(e.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
                this._hashes[t] = e.content
            }, this)
        }, this._core.options = i.extend({}, t.Defaults, this._core.options), this.$element.on(this._handlers), i(o).on("hashchange.owl.navigation", i.proxy(function() {
            var e = o.location.hash.substring(1),
                t = this._core.$stage.children(),
                i = this._hashes[e] && t.index(this._hashes[e]) || 0;
            return !!e && void this._core.to(i, !1, !0)
        }, this))
    };
    t.Defaults = {
        URLhashListener: !1
    }, t.prototype.destroy = function() {
        var e, t;
        for (e in i(o).off("hashchange.owl.navigation"), this._handlers) this._core.$element.off(e, this._handlers[e]);
        for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null)
    }, i.fn.owlCarousel.Constructor.Plugins.Hash = t
}(window.Zepto || window.jQuery, window, document),
function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(c) {
    "use strict";
    var n, a = window.Slick || {};
    (n = 0, a = function(e, t) {
        var i, o = this;
        o.defaults = {
            accessibility: !0,
            adaptiveHeight: !1,
            appendArrows: c(e),
            appendDots: c(e),
            arrows: !0,
            asNavFor: null,
            prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
            nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
            autoplay: !1,
            autoplaySpeed: 3e3,
            centerMode: !1,
            centerPadding: "50px",
            cssEase: "ease",
            customPaging: function(e, t) {
                return c('<button type="button" />').text(t + 1)
            },
            dots: !1,
            dotsClass: "slick-dots",
            draggable: !0,
            easing: "linear",
            edgeFriction: .35,
            fade: !1,
            focusOnSelect: !1,
            focusOnChange: !1,
            infinite: !0,
            initialSlide: 0,
            lazyLoad: "ondemand",
            mobileFirst: !1,
            pauseOnHover: !0,
            pauseOnFocus: !0,
            pauseOnDotsHover: !1,
            respondTo: "window",
            responsive: null,
            rows: 1,
            rtl: !1,
            slide: "",
            slidesPerRow: 1,
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 500,
            swipe: !0,
            swipeToSlide: !1,
            touchMove: !0,
            touchThreshold: 5,
            useCSS: !0,
            useTransform: !0,
            variableWidth: !1,
            vertical: !1,
            verticalSwiping: !1,
            waitForAnimate: !0,
            zIndex: 1e3
        }, o.initials = {
            animating: !1,
            dragging: !1,
            autoPlayTimer: null,
            currentDirection: 0,
            currentLeft: null,
            currentSlide: 0,
            direction: 1,
            $dots: null,
            listWidth: null,
            listHeight: null,
            loadIndex: 0,
            $nextArrow: null,
            $prevArrow: null,
            scrolling: !1,
            slideCount: null,
            slideWidth: null,
            $slideTrack: null,
            $slides: null,
            sliding: !1,
            slideOffset: 0,
            swipeLeft: null,
            swiping: !1,
            $list: null,
            touchObject: {},
            transformsEnabled: !1,
            unslicked: !1
        }, c.extend(o, o.initials), o.activeBreakpoint = null, o.animType = null, o.animProp = null, o.breakpoints = [], o.breakpointSettings = [], o.cssTransitions = !1, o.focussed = !1, o.interrupted = !1, o.hidden = "hidden", o.paused = !0, o.positionProp = null, o.respondTo = null, o.rowCount = 1, o.shouldClick = !0, o.$slider = c(e), o.$slidesCache = null, o.transformType = null, o.transitionType = null, o.visibilityChange = "visibilitychange", o.windowWidth = 0, o.windowTimer = null, i = c(e).data("slick") || {}, o.options = c.extend({}, o.defaults, t, i), o.currentSlide = o.options.initialSlide, o.originalSettings = o.options, void 0 !== document.mozHidden ? (o.hidden = "mozHidden", o.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (o.hidden = "webkitHidden", o.visibilityChange = "webkitvisibilitychange"), o.autoPlay = c.proxy(o.autoPlay, o), o.autoPlayClear = c.proxy(o.autoPlayClear, o), o.autoPlayIterator = c.proxy(o.autoPlayIterator, o), o.changeSlide = c.proxy(o.changeSlide, o), o.clickHandler = c.proxy(o.clickHandler, o), o.selectHandler = c.proxy(o.selectHandler, o), o.setPosition = c.proxy(o.setPosition, o), o.swipeHandler = c.proxy(o.swipeHandler, o), o.dragHandler = c.proxy(o.dragHandler, o), o.keyHandler = c.proxy(o.keyHandler, o), o.instanceUid = n++, o.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, o.registerBreakpoints(), o.init(!0)
    }).prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }, a.prototype.addSlide = a.prototype.slickAdd = function(e, t, i) {
        var o = this;
        if ("boolean" == typeof t) i = t, t = null;
        else if (t < 0 || t >= o.slideCount) return !1;
        o.unload(), "number" == typeof t ? 0 === t && 0 === o.$slides.length ? c(e).appendTo(o.$slideTrack) : i ? c(e).insertBefore(o.$slides.eq(t)) : c(e).insertAfter(o.$slides.eq(t)) : !0 === i ? c(e).prependTo(o.$slideTrack) : c(e).appendTo(o.$slideTrack), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slides.each(function(e, t) {
            c(t).attr("data-slick-index", e)
        }), o.$slidesCache = o.$slides, o.reinit()
    }, a.prototype.animateHeight = function() {
        if (1 === this.options.slidesToShow && !0 === this.options.adaptiveHeight && !1 === this.options.vertical) {
            var e = this.$slides.eq(this.currentSlide).outerHeight(!0);
            this.$list.animate({
                height: e
            }, this.options.speed)
        }
    }, a.prototype.animateSlide = function(e, t) {
        var i = {},
            o = this;
        o.animateHeight(), !0 === o.options.rtl && !1 === o.options.vertical && (e = -e), !1 === o.transformsEnabled ? !1 === o.options.vertical ? o.$slideTrack.animate({
            left: e
        }, o.options.speed, o.options.easing, t) : o.$slideTrack.animate({
            top: e
        }, o.options.speed, o.options.easing, t) : !1 === o.cssTransitions ? (!0 === o.options.rtl && (o.currentLeft = -o.currentLeft), c({
            animStart: o.currentLeft
        }).animate({
            animStart: e
        }, {
            duration: o.options.speed,
            easing: o.options.easing,
            step: function(e) {
                e = Math.ceil(e), !1 === o.options.vertical ? i[o.animType] = "translate(" + e + "px, 0px)" : i[o.animType] = "translate(0px," + e + "px)", o.$slideTrack.css(i)
            },
            complete: function() {
                t && t.call()
            }
        })) : (o.applyTransition(), e = Math.ceil(e), !1 === o.options.vertical ? i[o.animType] = "translate3d(" + e + "px, 0px, 0px)" : i[o.animType] = "translate3d(0px," + e + "px, 0px)", o.$slideTrack.css(i), t && setTimeout(function() {
            o.disableTransition(), t.call()
        }, o.options.speed))
    }, a.prototype.getNavTarget = function() {
        var e = this.options.asNavFor;
        return e && null !== e && (e = c(e).not(this.$slider)), e
    }, a.prototype.asNavFor = function(t) {
        var e = this.getNavTarget();
        null !== e && "object" == typeof e && e.each(function() {
            var e = c(this).slick("getSlick");
            e.unslicked || e.slideHandler(t, !0)
        })
    }, a.prototype.applyTransition = function(e) {
        var t = this,
            i = {};
        !1 === t.options.fade ? i[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : i[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
    }, a.prototype.autoPlay = function() {
        this.autoPlayClear(), this.slideCount > this.options.slidesToShow && (this.autoPlayTimer = setInterval(this.autoPlayIterator, this.options.autoplaySpeed))
    }, a.prototype.autoPlayClear = function() {
        this.autoPlayTimer && clearInterval(this.autoPlayTimer)
    }, a.prototype.autoPlayIterator = function() {
        var e = this,
            t = e.currentSlide + e.options.slidesToScroll;
        e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll, e.currentSlide - 1 == 0 && (e.direction = 1))), e.slideHandler(t))
    }, a.prototype.buildArrows = function() {
        var e = this;
        !0 === e.options.arrows && (e.$prevArrow = c(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = c(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }, a.prototype.buildDots = function() {
        var e, t;
        if (!0 === this.options.dots) {
            for (this.$slider.addClass("slick-dotted"), t = c("<ul />").addClass(this.options.dotsClass), e = 0; e <= this.getDotCount(); e += 1) t.append(c("<li />").append(this.options.customPaging.call(this, this, e)));
            this.$dots = t.appendTo(this.options.appendDots), this.$dots.find("li").first().addClass("slick-active")
        }
    }, a.prototype.buildOut = function() {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function(e, t) {
            c(t).attr("data-slick-index", e).data("originalStyling", c(t).attr("style") || "")
        }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? c('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), c("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable")
    }, a.prototype.buildRows = function() {
        var e, t, i, o, n, a, s, r = this;
        if (o = document.createDocumentFragment(), a = r.$slider.children(), 1 < r.options.rows) {
            for (s = r.options.slidesPerRow * r.options.rows, n = Math.ceil(a.length / s), e = 0; e < n; e++) {
                var l = document.createElement("div");
                for (t = 0; t < r.options.rows; t++) {
                    var c = document.createElement("div");
                    for (i = 0; i < r.options.slidesPerRow; i++) {
                        var m = e * s + (t * r.options.slidesPerRow + i);
                        a.get(m) && c.appendChild(a.get(m))
                    }
                    l.appendChild(c)
                }
                o.appendChild(l)
            }
            r.$slider.empty().append(o), r.$slider.children().children().children().css({
                width: 100 / r.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }, a.prototype.checkResponsive = function(e, t) {
        var i, o, n, a = this,
            s = !1,
            r = a.$slider.width(),
            l = window.innerWidth || c(window).width();
        if ("window" === a.respondTo ? n = l : "slider" === a.respondTo ? n = r : "min" === a.respondTo && (n = Math.min(l, r)), a.options.responsive && a.options.responsive.length && null !== a.options.responsive) {
            for (i in o = null, a.breakpoints) a.breakpoints.hasOwnProperty(i) && (!1 === a.originalSettings.mobileFirst ? n < a.breakpoints[i] && (o = a.breakpoints[i]) : n > a.breakpoints[i] && (o = a.breakpoints[i]));
            null !== o ? null !== a.activeBreakpoint ? (o !== a.activeBreakpoint || t) && (a.activeBreakpoint = o, "unslick" === a.breakpointSettings[o] ? a.unslick(o) : (a.options = c.extend({}, a.originalSettings, a.breakpointSettings[o]), !0 === e && (a.currentSlide = a.options.initialSlide), a.refresh(e)), s = o) : (a.activeBreakpoint = o, "unslick" === a.breakpointSettings[o] ? a.unslick(o) : (a.options = c.extend({}, a.originalSettings, a.breakpointSettings[o]), !0 === e && (a.currentSlide = a.options.initialSlide), a.refresh(e)), s = o) : null !== a.activeBreakpoint && (a.activeBreakpoint = null, a.options = a.originalSettings, !0 === e && (a.currentSlide = a.options.initialSlide), a.refresh(e), s = o), e || !1 === s || a.$slider.trigger("breakpoint", [a, s])
        }
    }, a.prototype.changeSlide = function(e, t) {
        var i, o, n = this,
            a = c(e.currentTarget);
        switch (a.is("a") && e.preventDefault(), a.is("li") || (a = a.closest("li")), i = n.slideCount % n.options.slidesToScroll != 0 ? 0 : (n.slideCount - n.currentSlide) % n.options.slidesToScroll, e.data.message) {
            case "previous":
                o = 0 === i ? n.options.slidesToScroll : n.options.slidesToShow - i, n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide - o, !1, t);
                break;
            case "next":
                o = 0 === i ? n.options.slidesToScroll : i, n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide + o, !1, t);
                break;
            case "index":
                var s = 0 === e.data.index ? 0 : e.data.index || a.index() * n.options.slidesToScroll;
                n.slideHandler(n.checkNavigable(s), !1, t), a.children().trigger("focus");
                break;
            default:
                return
        }
    }, a.prototype.checkNavigable = function(e) {
        var t, i;
        if (i = 0, e > (t = this.getNavigableIndexes())[t.length - 1]) e = t[t.length - 1];
        else
            for (var o in t) {
                if (e < t[o]) {
                    e = i;
                    break
                }
                i = t[o]
            }
        return e
    }, a.prototype.cleanUpEvents = function() {
        var e = this;
        e.options.dots && null !== e.$dots && (c("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", c.proxy(e.interrupt, e, !0)).off("mouseleave.slick", c.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), c(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().off("click.slick", e.selectHandler), c(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), c(window).off("resize.slick.slick-" + e.instanceUid, e.resize), c("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), c(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
    }, a.prototype.cleanUpSlideEvents = function() {
        this.$list.off("mouseenter.slick", c.proxy(this.interrupt, this, !0)), this.$list.off("mouseleave.slick", c.proxy(this.interrupt, this, !1))
    }, a.prototype.cleanUpRows = function() {
        var e;
        1 < this.options.rows && ((e = this.$slides.children().children()).removeAttr("style"), this.$slider.empty().append(e))
    }, a.prototype.clickHandler = function(e) {
        !1 === this.shouldClick && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
    }, a.prototype.destroy = function(e) {
        var t = this;
        t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), c(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            c(this).attr("style", c(this).data("originalStyling"))
        }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t])
    }, a.prototype.disableTransition = function(e) {
        var t = {};
        t[this.transitionType] = "", !1 === this.options.fade ? this.$slideTrack.css(t) : this.$slides.eq(e).css(t)
    }, a.prototype.fadeSlide = function(e, t) {
        var i = this;
        !1 === i.cssTransitions ? (i.$slides.eq(e).css({
            zIndex: i.options.zIndex
        }), i.$slides.eq(e).animate({
            opacity: 1
        }, i.options.speed, i.options.easing, t)) : (i.applyTransition(e), i.$slides.eq(e).css({
            opacity: 1,
            zIndex: i.options.zIndex
        }), t && setTimeout(function() {
            i.disableTransition(e), t.call()
        }, i.options.speed))
    }, a.prototype.fadeSlideOut = function(e) {
        !1 === this.cssTransitions ? this.$slides.eq(e).animate({
            opacity: 0,
            zIndex: this.options.zIndex - 2
        }, this.options.speed, this.options.easing) : (this.applyTransition(e), this.$slides.eq(e).css({
            opacity: 0,
            zIndex: this.options.zIndex - 2
        }))
    }, a.prototype.filterSlides = a.prototype.slickFilter = function(e) {
        null !== e && (this.$slidesCache = this.$slides, this.unload(), this.$slideTrack.children(this.options.slide).detach(), this.$slidesCache.filter(e).appendTo(this.$slideTrack), this.reinit())
    }, a.prototype.focusHandler = function() {
        var i = this;
        i.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(e) {
            e.stopImmediatePropagation();
            var t = c(this);
            setTimeout(function() {
                i.options.pauseOnFocus && (i.focussed = t.is(":focus"), i.autoPlay())
            }, 0)
        })
    }, a.prototype.getCurrent = a.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }, a.prototype.getDotCount = function() {
        var e = this,
            t = 0,
            i = 0,
            o = 0;
        if (!0 === e.options.infinite)
            if (e.slideCount <= e.options.slidesToShow) ++o;
            else
                for (; t < e.slideCount;) ++o, t = i + e.options.slidesToScroll, i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else if (!0 === e.options.centerMode) o = e.slideCount;
        else if (e.options.asNavFor)
            for (; t < e.slideCount;) ++o, t = i + e.options.slidesToScroll, i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else o = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
        return o - 1
    }, a.prototype.getLeft = function(e) {
        var t, i, o, n, a = this,
            s = 0;
        return a.slideOffset = 0, i = a.$slides.first().outerHeight(!0), !0 === a.options.infinite ? (a.slideCount > a.options.slidesToShow && (a.slideOffset = a.slideWidth * a.options.slidesToShow * -1, n = -1, !0 === a.options.vertical && !0 === a.options.centerMode && (2 === a.options.slidesToShow ? n = -1.5 : 1 === a.options.slidesToShow && (n = -2)), s = i * a.options.slidesToShow * n), a.slideCount % a.options.slidesToScroll != 0 && e + a.options.slidesToScroll > a.slideCount && a.slideCount > a.options.slidesToShow && (e > a.slideCount ? (a.slideOffset = (a.options.slidesToShow - (e - a.slideCount)) * a.slideWidth * -1, s = (a.options.slidesToShow - (e - a.slideCount)) * i * -1) : (a.slideOffset = a.slideCount % a.options.slidesToScroll * a.slideWidth * -1, s = a.slideCount % a.options.slidesToScroll * i * -1))) : e + a.options.slidesToShow > a.slideCount && (a.slideOffset = (e + a.options.slidesToShow - a.slideCount) * a.slideWidth, s = (e + a.options.slidesToShow - a.slideCount) * i), a.slideCount <= a.options.slidesToShow && (s = a.slideOffset = 0), !0 === a.options.centerMode && a.slideCount <= a.options.slidesToShow ? a.slideOffset = a.slideWidth * Math.floor(a.options.slidesToShow) / 2 - a.slideWidth * a.slideCount / 2 : !0 === a.options.centerMode && !0 === a.options.infinite ? a.slideOffset += a.slideWidth * Math.floor(a.options.slidesToShow / 2) - a.slideWidth : !0 === a.options.centerMode && (a.slideOffset = 0, a.slideOffset += a.slideWidth * Math.floor(a.options.slidesToShow / 2)), t = !1 === a.options.vertical ? e * a.slideWidth * -1 + a.slideOffset : e * i * -1 + s, !0 === a.options.variableWidth && (o = a.slideCount <= a.options.slidesToShow || !1 === a.options.infinite ? a.$slideTrack.children(".slick-slide").eq(e) : a.$slideTrack.children(".slick-slide").eq(e + a.options.slidesToShow), t = !0 === a.options.rtl ? o[0] ? -1 * (a.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === a.options.centerMode && (o = a.slideCount <= a.options.slidesToShow || !1 === a.options.infinite ? a.$slideTrack.children(".slick-slide").eq(e) : a.$slideTrack.children(".slick-slide").eq(e + a.options.slidesToShow + 1), t = !0 === a.options.rtl ? o[0] ? -1 * (a.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, t += (a.$list.width() - o.outerWidth()) / 2)), t
    }, a.prototype.getOption = a.prototype.slickGetOption = function(e) {
        return this.options[e]
    }, a.prototype.getNavigableIndexes = function() {
        var e, t = this,
            i = 0,
            o = 0,
            n = [];
        for (!1 === t.options.infinite ? e = t.slideCount : (i = -1 * t.options.slidesToScroll, o = -1 * t.options.slidesToScroll, e = 2 * t.slideCount); i < e;) n.push(i), i = o + t.options.slidesToScroll, o += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
        return n
    }, a.prototype.getSlick = function() {
        return this
    }, a.prototype.getSlideCount = function() {
        var i, o, n = this;
        return o = !0 === n.options.centerMode ? n.slideWidth * Math.floor(n.options.slidesToShow / 2) : 0, !0 === n.options.swipeToSlide ? (n.$slideTrack.find(".slick-slide").each(function(e, t) {
            if (t.offsetLeft - o + c(t).outerWidth() / 2 > -1 * n.swipeLeft) return i = t, !1
        }), Math.abs(c(i).attr("data-slick-index") - n.currentSlide) || 1) : n.options.slidesToScroll
    }, a.prototype.goTo = a.prototype.slickGoTo = function(e, t) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(e)
            }
        }, t)
    }, a.prototype.init = function(e) {
        var t = this;
        c(t.$slider).hasClass("slick-initialized") || (c(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay())
    }, a.prototype.initADA = function() {
        var i = this,
            o = Math.ceil(i.slideCount / i.options.slidesToShow),
            n = i.getNavigableIndexes().filter(function(e) {
                return 0 <= e && e < i.slideCount
            });
        i.$slides.add(i.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }), null !== i.$dots && (i.$slides.not(i.$slideTrack.find(".slick-cloned")).each(function(e) {
            var t = n.indexOf(e);
            c(this).attr({
                role: "tabpanel",
                id: "slick-slide" + i.instanceUid + e,
                tabindex: -1
            }), -1 !== t && c(this).attr({
                "aria-describedby": "slick-slide-control" + i.instanceUid + t
            })
        }), i.$dots.attr("role", "tablist").find("li").each(function(e) {
            var t = n[e];
            c(this).attr({
                role: "presentation"
            }), c(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + i.instanceUid + e,
                "aria-controls": "slick-slide" + i.instanceUid + t,
                "aria-label": e + 1 + " of " + o,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(i.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var e = i.currentSlide, t = e + i.options.slidesToShow; e < t; e++) i.$slides.eq(e).attr("tabindex", 0);
        i.activateADA()
    }, a.prototype.initArrowEvents = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler), e.$nextArrow.on("keydown.slick", e.keyHandler)))
    }, a.prototype.initDotEvents = function() {
        var e = this;
        !0 === e.options.dots && (c("li", e.$dots).on("click.slick", {
            message: "index"
        }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && c("li", e.$dots).on("mouseenter.slick", c.proxy(e.interrupt, e, !0)).on("mouseleave.slick", c.proxy(e.interrupt, e, !1))
    }, a.prototype.initSlideEvents = function() {
        this.options.pauseOnHover && (this.$list.on("mouseenter.slick", c.proxy(this.interrupt, this, !0)), this.$list.on("mouseleave.slick", c.proxy(this.interrupt, this, !1)))
    }, a.prototype.initializeEvents = function() {
        var e = this;
        e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), c(document).on(e.visibilityChange, c.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on("click.slick", e.selectHandler), c(window).on("orientationchange.slick.slick-" + e.instanceUid, c.proxy(e.orientationChange, e)), c(window).on("resize.slick.slick-" + e.instanceUid, c.proxy(e.resize, e)), c("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), c(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), c(e.setPosition)
    }, a.prototype.initUI = function() {
        !0 === this.options.arrows && this.slideCount > this.options.slidesToShow && (this.$prevArrow.show(), this.$nextArrow.show()), !0 === this.options.dots && this.slideCount > this.options.slidesToShow && this.$dots.show()
    }, a.prototype.keyHandler = function(e) {
        e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === this.options.accessibility ? this.changeSlide({
            data: {
                message: !0 === this.options.rtl ? "next" : "previous"
            }
        }) : 39 === e.keyCode && !0 === this.options.accessibility && this.changeSlide({
            data: {
                message: !0 === this.options.rtl ? "previous" : "next"
            }
        }))
    }, a.prototype.lazyLoad = function() {
        function e(e) {
            c("img[data-lazy]", e).each(function() {
                var e = c(this),
                    t = c(this).attr("data-lazy"),
                    i = c(this).attr("data-srcset"),
                    o = c(this).attr("data-sizes") || a.$slider.attr("data-sizes"),
                    n = document.createElement("img");
                n.onload = function() {
                    e.animate({
                        opacity: 0
                    }, 100, function() {
                        i && (e.attr("srcset", i), o && e.attr("sizes", o)), e.attr("src", t).animate({
                            opacity: 1
                        }, 200, function() {
                            e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }), a.$slider.trigger("lazyLoaded", [a, e, t])
                    })
                }, n.onerror = function() {
                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), a.$slider.trigger("lazyLoadError", [a, e, t])
                }, n.src = t
            })
        }
        var t, i, o, a = this;
        if (!0 === a.options.centerMode ? !0 === a.options.infinite ? o = (i = a.currentSlide + (a.options.slidesToShow / 2 + 1)) + a.options.slidesToShow + 2 : (i = Math.max(0, a.currentSlide - (a.options.slidesToShow / 2 + 1)), o = a.options.slidesToShow / 2 + 1 + 2 + a.currentSlide) : (i = a.options.infinite ? a.options.slidesToShow + a.currentSlide : a.currentSlide, o = Math.ceil(i + a.options.slidesToShow), !0 === a.options.fade && (0 < i && i--, o <= a.slideCount && o++)), t = a.$slider.find(".slick-slide").slice(i, o), "anticipated" === a.options.lazyLoad)
            for (var n = i - 1, s = o, r = a.$slider.find(".slick-slide"), l = 0; l < a.options.slidesToScroll; l++) n < 0 && (n = a.slideCount - 1), t = (t = t.add(r.eq(n))).add(r.eq(s)), n--, s++;
        e(t), a.slideCount <= a.options.slidesToShow ? e(a.$slider.find(".slick-slide")) : a.currentSlide >= a.slideCount - a.options.slidesToShow ? e(a.$slider.find(".slick-cloned").slice(0, a.options.slidesToShow)) : 0 === a.currentSlide && e(a.$slider.find(".slick-cloned").slice(-1 * a.options.slidesToShow))
    }, a.prototype.loadSlider = function() {
        this.setPosition(), this.$slideTrack.css({
            opacity: 1
        }), this.$slider.removeClass("slick-loading"), this.initUI(), "progressive" === this.options.lazyLoad && this.progressiveLazyLoad()
    }, a.prototype.next = a.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }, a.prototype.orientationChange = function() {
        this.checkResponsive(), this.setPosition()
    }, a.prototype.pause = a.prototype.slickPause = function() {
        this.autoPlayClear(), this.paused = !0
    }, a.prototype.play = a.prototype.slickPlay = function() {
        this.autoPlay(), this.options.autoplay = !0, this.paused = !1, this.focussed = !1, this.interrupted = !1
    }, a.prototype.postSlide = function(e) {
        var t = this;
        t.unslicked || (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange && c(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()))
    }, a.prototype.prev = a.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }, a.prototype.preventDefault = function(e) {
        e.preventDefault()
    }, a.prototype.progressiveLazyLoad = function(e) {
        e = e || 1;
        var t, i, o, n, a, s = this,
            r = c("img[data-lazy]", s.$slider);
        r.length ? (t = r.first(), i = t.attr("data-lazy"), o = t.attr("data-srcset"), n = t.attr("data-sizes") || s.$slider.attr("data-sizes"), (a = document.createElement("img")).onload = function() {
            o && (t.attr("srcset", o), n && t.attr("sizes", n)), t.attr("src", i).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === s.options.adaptiveHeight && s.setPosition(), s.$slider.trigger("lazyLoaded", [s, t, i]), s.progressiveLazyLoad()
        }, a.onerror = function() {
            e < 3 ? setTimeout(function() {
                s.progressiveLazyLoad(e + 1)
            }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), s.$slider.trigger("lazyLoadError", [s, t, i]), s.progressiveLazyLoad())
        }, a.src = i) : s.$slider.trigger("allImagesLoaded", [s])
    }, a.prototype.refresh = function(e) {
        var t, i, o = this;
        i = o.slideCount - o.options.slidesToShow, !o.options.infinite && o.currentSlide > i && (o.currentSlide = i), o.slideCount <= o.options.slidesToShow && (o.currentSlide = 0), t = o.currentSlide, o.destroy(!0), c.extend(o, o.initials, {
            currentSlide: t
        }), o.init(), e || o.changeSlide({
            data: {
                message: "index",
                index: t
            }
        }, !1)
    }, a.prototype.registerBreakpoints = function() {
        var e, t, i, o = this,
            n = o.options.responsive || null;
        if ("array" === c.type(n) && n.length) {
            for (e in o.respondTo = o.options.respondTo || "window", n)
                if (i = o.breakpoints.length - 1, n.hasOwnProperty(e)) {
                    for (t = n[e].breakpoint; 0 <= i;) o.breakpoints[i] && o.breakpoints[i] === t && o.breakpoints.splice(i, 1), i--;
                    o.breakpoints.push(t), o.breakpointSettings[t] = n[e].settings
                }
            o.breakpoints.sort(function(e, t) {
                return o.options.mobileFirst ? e - t : t - e
            })
        }
    }, a.prototype.reinit = function() {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
    }, a.prototype.resize = function() {
        var e = this;
        c(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function() {
            e.windowWidth = c(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
        }, 50))
    }, a.prototype.removeSlide = a.prototype.slickRemove = function(e, t, i) {
        var o = this;
        if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : o.slideCount - 1 : !0 === t ? --e : e, o.slideCount < 1 || e < 0 || e > o.slideCount - 1) return !1;
        o.unload(), !0 === i ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(e).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit()
    }, a.prototype.setCSS = function(e) {
        var t, i, o = this,
            n = {};
        !0 === o.options.rtl && (e = -e), t = "left" == o.positionProp ? Math.ceil(e) + "px" : "0px", i = "top" == o.positionProp ? Math.ceil(e) + "px" : "0px", n[o.positionProp] = e, !1 === o.transformsEnabled || (!(n = {}) === o.cssTransitions ? n[o.animType] = "translate(" + t + ", " + i + ")" : n[o.animType] = "translate3d(" + t + ", " + i + ", 0px)"), o.$slideTrack.css(n)
    }, a.prototype.setDimensions = function() {
        var e = this;
        !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
            padding: "0px " + e.options.centerPadding
        }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), !0 === e.options.centerMode && e.$list.css({
            padding: e.options.centerPadding + " 0px"
        })), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
        !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
    }, a.prototype.setFade = function() {
        var i, o = this;
        o.$slides.each(function(e, t) {
            i = o.slideWidth * e * -1, !0 === o.options.rtl ? c(t).css({
                position: "relative",
                right: i,
                top: 0,
                zIndex: o.options.zIndex - 2,
                opacity: 0
            }) : c(t).css({
                position: "relative",
                left: i,
                top: 0,
                zIndex: o.options.zIndex - 2,
                opacity: 0
            })
        }), o.$slides.eq(o.currentSlide).css({
            zIndex: o.options.zIndex - 1,
            opacity: 1
        })
    }, a.prototype.setHeight = function() {
        if (1 === this.options.slidesToShow && !0 === this.options.adaptiveHeight && !1 === this.options.vertical) {
            var e = this.$slides.eq(this.currentSlide).outerHeight(!0);
            this.$list.css("height", e)
        }
    }, a.prototype.setOption = a.prototype.slickSetOption = function() {
        var e, t, i, o, n, a = this,
            s = !1;
        if ("object" === c.type(arguments[0]) ? (i = arguments[0], s = arguments[1], n = "multiple") : "string" === c.type(arguments[0]) && (i = arguments[0], o = arguments[1], s = arguments[2], "responsive" === arguments[0] && "array" === c.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), "single" === n) a.options[i] = o;
        else if ("multiple" === n) c.each(i, function(e, t) {
            a.options[e] = t
        });
        else if ("responsive" === n)
            for (t in o)
                if ("array" !== c.type(a.options.responsive)) a.options.responsive = [o[t]];
                else {
                    for (e = a.options.responsive.length - 1; 0 <= e;) a.options.responsive[e].breakpoint === o[t].breakpoint && a.options.responsive.splice(e, 1), e--;
                    a.options.responsive.push(o[t])
                }
        s && (a.unload(), a.reinit())
    }, a.prototype.setPosition = function() {
        this.setDimensions(), this.setHeight(), !1 === this.options.fade ? this.setCSS(this.getLeft(this.currentSlide)) : this.setFade(), this.$slider.trigger("setPosition", [this])
    }, a.prototype.setProps = function() {
        var e = this,
            t = document.body.style;
        e.positionProp = !0 === e.options.vertical ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), void 0 !== t.OTransform && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.MozTransform && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)), void 0 !== t.webkitTransform && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.msTransform && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", void 0 === t.msTransform && (e.animType = !1)), void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
    }, a.prototype.setSlideClasses = function(e) {
        var t, i, o, n, a = this;
        if (i = a.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), a.$slides.eq(e).addClass("slick-current"), !0 === a.options.centerMode) {
            var s = a.options.slidesToShow % 2 == 0 ? 1 : 0;
            t = Math.floor(a.options.slidesToShow / 2), !0 === a.options.infinite && (t <= e && e <= a.slideCount - 1 - t ? a.$slides.slice(e - t + s, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = a.options.slidesToShow + e, i.slice(o - t + 1 + s, o + t + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === e ? i.eq(i.length - 1 - a.options.slidesToShow).addClass("slick-center") : e === a.slideCount - 1 && i.eq(a.options.slidesToShow).addClass("slick-center")), a.$slides.eq(e).addClass("slick-center")
        } else 0 <= e && e <= a.slideCount - a.options.slidesToShow ? a.$slides.slice(e, e + a.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= a.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (n = a.slideCount % a.options.slidesToShow, o = !0 === a.options.infinite ? a.options.slidesToShow + e : e, a.options.slidesToShow == a.options.slidesToScroll && a.slideCount - e < a.options.slidesToShow ? i.slice(o - (a.options.slidesToShow - n), o + n).addClass("slick-active").attr("aria-hidden", "false") : i.slice(o, o + a.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== a.options.lazyLoad && "anticipated" !== a.options.lazyLoad || a.lazyLoad()
    }, a.prototype.setupInfinite = function() {
        var e, t, i, o = this;
        if (!0 === o.options.fade && (o.options.centerMode = !1), !0 === o.options.infinite && !1 === o.options.fade && (t = null, o.slideCount > o.options.slidesToShow)) {
            for (i = !0 === o.options.centerMode ? o.options.slidesToShow + 1 : o.options.slidesToShow, e = o.slideCount; e > o.slideCount - i; e -= 1) t = e - 1, c(o.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");
            for (e = 0; e < i + o.slideCount; e += 1) t = e, c(o.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");
            o.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                c(this).attr("id", "")
            })
        }
    }, a.prototype.interrupt = function(e) {
        e || this.autoPlay(), this.interrupted = e
    }, a.prototype.selectHandler = function(e) {
        var t = c(e.target).is(".slick-slide") ? c(e.target) : c(e.target).parents(".slick-slide"),
            i = parseInt(t.attr("data-slick-index"));
        i || (i = 0), this.slideCount <= this.options.slidesToShow ? this.slideHandler(i, !1, !0) : this.slideHandler(i)
    }, a.prototype.slideHandler = function(e, t, i) {
        var o, n, a, s, r, l = null,
            c = this;
        if (t = t || !1, !(!0 === c.animating && !0 === c.options.waitForAnimate || !0 === c.options.fade && c.currentSlide === e))
            if (!1 === t && c.asNavFor(e), o = e, l = c.getLeft(o), s = c.getLeft(c.currentSlide), c.currentLeft = null === c.swipeLeft ? s : c.swipeLeft, !1 === c.options.infinite && !1 === c.options.centerMode && (e < 0 || e > c.getDotCount() * c.options.slidesToScroll)) !1 === c.options.fade && (o = c.currentSlide, !0 !== i ? c.animateSlide(s, function() {
                c.postSlide(o)
            }) : c.postSlide(o));
            else if (!1 === c.options.infinite && !0 === c.options.centerMode && (e < 0 || e > c.slideCount - c.options.slidesToScroll)) !1 === c.options.fade && (o = c.currentSlide, !0 !== i ? c.animateSlide(s, function() {
            c.postSlide(o)
        }) : c.postSlide(o));
        else {
            if (c.options.autoplay && clearInterval(c.autoPlayTimer), n = o < 0 ? c.slideCount % c.options.slidesToScroll != 0 ? c.slideCount - c.slideCount % c.options.slidesToScroll : c.slideCount + o : o >= c.slideCount ? c.slideCount % c.options.slidesToScroll != 0 ? 0 : o - c.slideCount : o, c.animating = !0, c.$slider.trigger("beforeChange", [c, c.currentSlide, n]), a = c.currentSlide, c.currentSlide = n, c.setSlideClasses(c.currentSlide), c.options.asNavFor && (r = (r = c.getNavTarget()).slick("getSlick")).slideCount <= r.options.slidesToShow && r.setSlideClasses(c.currentSlide), c.updateDots(), c.updateArrows(), !0 === c.options.fade) return !0 !== i ? (c.fadeSlideOut(a), c.fadeSlide(n, function() {
                c.postSlide(n)
            })) : c.postSlide(n), void c.animateHeight();
            !0 !== i ? c.animateSlide(l, function() {
                c.postSlide(n)
            }) : c.postSlide(n)
        }
    }, a.prototype.startLoad = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
    }, a.prototype.swipeDirection = function() {
        var e, t, i, o;
        return e = this.touchObject.startX - this.touchObject.curX, t = this.touchObject.startY - this.touchObject.curY, i = Math.atan2(t, e), (o = Math.round(180 * i / Math.PI)) < 0 && (o = 360 - Math.abs(o)), o <= 45 && 0 <= o ? !1 === this.options.rtl ? "left" : "right" : o <= 360 && 315 <= o ? !1 === this.options.rtl ? "left" : "right" : 135 <= o && o <= 225 ? !1 === this.options.rtl ? "right" : "left" : !0 === this.options.verticalSwiping ? 35 <= o && o <= 135 ? "down" : "up" : "vertical"
    }, a.prototype.swipeEnd = function(e) {
        var t, i, o = this;
        if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1;
        if (o.interrupted = !1, o.shouldClick = !(10 < o.touchObject.swipeLength), void 0 === o.touchObject.curX) return !1;
        if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe) {
            switch (i = o.swipeDirection()) {
                case "left":
                case "down":
                    t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), o.currentDirection = 0;
                    break;
                case "right":
                case "up":
                    t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), o.currentDirection = 1
            }
            "vertical" != i && (o.slideHandler(t), o.touchObject = {}, o.$slider.trigger("swipe", [o, i]))
        } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {})
    }, a.prototype.swipeHandler = function(e) {
        var t = this;
        if (!(!1 === t.options.swipe || "ontouchend" in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
            case "start":
                t.swipeStart(e);
                break;
            case "move":
                t.swipeMove(e);
                break;
            case "end":
                t.swipeEnd(e)
        }
    }, a.prototype.swipeMove = function(e) {
        var t, i, o, n, a, s, r = this;
        return a = void 0 !== e.originalEvent ? e.originalEvent.touches : null, !(!r.dragging || r.scrolling || a && 1 !== a.length) && (t = r.getLeft(r.currentSlide), r.touchObject.curX = void 0 !== a ? a[0].pageX : e.clientX, r.touchObject.curY = void 0 !== a ? a[0].pageY : e.clientY, r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curX - r.touchObject.startX, 2))), s = Math.round(Math.sqrt(Math.pow(r.touchObject.curY - r.touchObject.startY, 2))), !r.options.verticalSwiping && !r.swiping && 4 < s ? !(r.scrolling = !0) : (!0 === r.options.verticalSwiping && (r.touchObject.swipeLength = s), i = r.swipeDirection(), void 0 !== e.originalEvent && 4 < r.touchObject.swipeLength && (r.swiping = !0, e.preventDefault()), n = (!1 === r.options.rtl ? 1 : -1) * (r.touchObject.curX > r.touchObject.startX ? 1 : -1), !0 === r.options.verticalSwiping && (n = r.touchObject.curY > r.touchObject.startY ? 1 : -1), o = r.touchObject.swipeLength, (r.touchObject.edgeHit = !1) === r.options.infinite && (0 === r.currentSlide && "right" === i || r.currentSlide >= r.getDotCount() && "left" === i) && (o = r.touchObject.swipeLength * r.options.edgeFriction, r.touchObject.edgeHit = !0), !1 === r.options.vertical ? r.swipeLeft = t + o * n : r.swipeLeft = t + o * (r.$list.height() / r.listWidth) * n, !0 === r.options.verticalSwiping && (r.swipeLeft = t + o * n), !0 !== r.options.fade && !1 !== r.options.touchMove && (!0 === r.animating ? (r.swipeLeft = null, !1) : void r.setCSS(r.swipeLeft))))
    }, a.prototype.swipeStart = function(e) {
        var t, i = this;
        if (i.interrupted = !0, 1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow) return !(i.touchObject = {});
        void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]), i.touchObject.startX = i.touchObject.curX = void 0 !== t ? t.pageX : e.clientX, i.touchObject.startY = i.touchObject.curY = void 0 !== t ? t.pageY : e.clientY, i.dragging = !0
    }, a.prototype.unfilterSlides = a.prototype.slickUnfilter = function() {
        null !== this.$slidesCache && (this.unload(), this.$slideTrack.children(this.options.slide).detach(), this.$slidesCache.appendTo(this.$slideTrack), this.reinit())
    }, a.prototype.unload = function() {
        var e = this;
        c(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, a.prototype.unslick = function(e) {
        this.$slider.trigger("unslick", [this, e]), this.destroy()
    }, a.prototype.updateArrows = function() {
        var e = this;
        Math.floor(e.options.slidesToShow / 2), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, a.prototype.updateDots = function() {
        null !== this.$dots && (this.$dots.find("li").removeClass("slick-active").end(), this.$dots.find("li").eq(Math.floor(this.currentSlide / this.options.slidesToScroll)).addClass("slick-active"))
    }, a.prototype.visibility = function() {
        this.options.autoplay && (document[this.hidden] ? this.interrupted = !0 : this.interrupted = !1)
    }, c.fn.slick = function() {
        var e, t, i = arguments[0],
            o = Array.prototype.slice.call(arguments, 1),
            n = this.length;
        for (e = 0; e < n; e++)
            if ("object" == typeof i || void 0 === i ? this[e].slick = new a(this[e], i) : t = this[e].slick[i].apply(this[e].slick, o), void 0 !== t) return t;
        return this
    }
}), window.$clamp = function(n, e) {
        function i(e, t) {
            return l.getComputedStyle || (l.getComputedStyle = function(i, e) {
                return this.el = i, this.getPropertyValue = function(e) {
                    var t = /(\-([a-z]){1})/g;
                    return "float" == e && (e = "styleFloat"), t.test(e) && (e = e.replace(t, function(e, t, i) {
                        return i.toUpperCase()
                    })), i.currentStyle && i.currentStyle[e] ? i.currentStyle[e] : null
                }, this
            }), l.getComputedStyle(e, null).getPropertyValue(t)
        }

        function t(e) {
            e = e || n.clientHeight;
            var t = o(n);
            return Math.max(Math.floor(e / t), 0)
        }

        function o(e) {
            var t = i(e, "line-height");
            return "normal" == t && (t = 1.2 * parseInt(i(e, "font-size"))), parseInt(t)
        }

        function a(e) {
            return e.lastChild.children && 0 < e.lastChild.children.length ? a(Array.prototype.slice.call(e.children).pop()) : e.lastChild && e.lastChild.nodeValue && "" != e.lastChild.nodeValue && e.lastChild.nodeValue != c.truncationChar ? e.lastChild : (e.lastChild.parentNode.removeChild(e.lastChild), a(n))
        }

        function s(e, t) {
            e.nodeValue = t + c.truncationChar
        }
        e = e || {};
        var r, l = window,
            c = {
                clamp: e.clamp || 2,
                useNativeClamp: void 0 === e.useNativeClamp || e.useNativeClamp,
                splitOnChars: e.splitOnChars || [".", "-", "â€“", "â€”", " "],
                animate: e.animate || !1,
                truncationChar: e.truncationChar || "â€¦",
                truncationHTML: e.truncationHTML
            },
            m = n.style,
            d = n.innerHTML,
            u = void 0 !== n.style.webkitLineClamp,
            h = c.clamp,
            p = h.indexOf && (-1 < h.indexOf("px") || -1 < h.indexOf("em"));
        c.truncationHTML && ((r = document.createElement("span")).innerHTML = c.truncationHTML);
        var f, g, v, y, w = c.splitOnChars.slice(0),
            b = w[0];
        return "auto" == h ? h = t() : p && (h = t(parseInt(h))), u && c.useNativeClamp ? (m.overflow = "hidden", m.textOverflow = "ellipsis", m.webkitBoxOrient = "vertical", m.display = "-webkit-box", m.webkitLineClamp = h, p && (m.height = c.clamp + "px")) : (y = h, (m = o(n) * y) <= n.clientHeight && (v = function e(t, i) {
            if (i) {
                var o = t.nodeValue.replace(c.truncationChar, "");
                if (f || (b = 0 < w.length ? w.shift() : "", f = o.split(b)), 1 < f.length ? (g = f.pop(), s(t, f.join(b))) : f = null, r && (t.nodeValue = t.nodeValue.replace(c.truncationChar, ""), n.innerHTML = t.nodeValue + " " + r.innerHTML + c.truncationChar), f) {
                    if (n.clientHeight <= i) {
                        if (!(0 <= w.length && "" != b)) return n.innerHTML;
                        s(t, f.join(b) + b + g), f = null
                    }
                } else "" == b && (s(t, ""), t = a(n), w = c.splitOnChars.slice(0), b = w[0], g = f = null);
                if (!c.animate) return e(t, i);
                setTimeout(function() {
                    e(t, i)
                }, !0 === c.animate ? 10 : c.animate)
            }
        }(a(n), m))), {
            original: d,
            clamped: v
        }
    },
    function(d, u, h) {
        "use strict";
        var m = {
            calc: !1
        };
        u.fn.rrssb = function(e) {
            var t = u.extend({
                description: h,
                emailAddress: h,
                emailBody: h,
                emailSubject: h,
                image: h,
                title: h,
                url: h
            }, e);
            for (var i in t.emailSubject = t.emailSubject || t.title, t.emailBody = t.emailBody || (t.description ? t.description : "") + (t.url ? "\n\n" + t.url : ""), t) t.hasOwnProperty(i) && t[i] !== h && (t[i] = n(t[i]));
            t.url !== h && (u(this).find(".rrssb-facebook a").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + t.url), u(this).find(".rrssb-tumblr a").attr("href", "http://tumblr.com/share/link?url=" + t.url + (t.title !== h ? "&name=" + t.title : "") + (t.description !== h ? "&description=" + t.description : "")), u(this).find(".rrssb-linkedin a").attr("href", "http://www.linkedin.com/shareArticle?mini=true&url=" + t.url + (t.title !== h ? "&title=" + t.title : "") + (t.description !== h ? "&summary=" + t.description : "")), u(this).find(".rrssb-twitter a").attr("href", "https://twitter.com/intent/tweet?text=" + (t.description !== h ? t.description : "") + "%20" + t.url), u(this).find(".rrssb-hackernews a").attr("href", "https://news.ycombinator.com/submitlink?u=" + t.url + (t.title !== h ? "&text=" + t.title : "")), u(this).find(".rrssb-reddit a").attr("href", "http://www.reddit.com/submit?url=" + t.url + (t.description !== h ? "&text=" + t.description : "") + (t.title !== h ? "&title=" + t.title : "")), u(this).find(".rrssb-googleplus a").attr("href", "https://plus.google.com/share?url=" + (t.description !== h ? t.description : "") + "%20" + t.url), u(this).find(".rrssb-pinterest a").attr("href", "http://pinterest.com/pin/create/button/?url=" + t.url + (t.image !== h ? "&amp;media=" + t.image : "") + (t.description !== h ? "&description=" + t.description : "")), u(this).find(".rrssb-pocket a").attr("href", "https://getpocket.com/save?url=" + t.url), u(this).find(".rrssb-github a").attr("href", t.url), u(this).find(".rrssb-print a").attr("href", "javascript:window.print()")), (t.emailAddress !== h || t.emailSubject) && u(this).find(".rrssb-email a").attr("href", "mailto:" + (t.emailAddress ? t.emailAddress : "") + "?" + (t.emailSubject !== h ? "subject=" + t.emailSubject : "") + (t.emailBody !== h ? "&body=" + t.emailBody : ""))
        };
        var o, n = function(e) {
                if (e !== h && null !== e) {
                    if (null === e.match(/%[0-9a-f]{2}/i)) return encodeURIComponent(e);
                    e = decodeURIComponent(e), n(e)
                }
            },
            p = function() {
                u(".rrssb-buttons").each(function(e) {
                    var t = u(this),
                        i = u("li:visible", t),
                        o = 100 / i.length;
                    i.css("width", o + "%").attr("data-initwidth", o)
                })
            },
            t = function(e) {
                u(".rrssb-buttons").each(function(e) {
                    var t = u(this),
                        a = u("li", t);
                    u(a.get().reverse()).each(function(e, t) {
                        var i = u(this);
                        if (!1 === i.hasClass("small")) {
                            var o = parseFloat(i.attr("data-size")) + 55;
                            if (parseFloat(i.width()) < o) {
                                var n = a.not(".small").last();
                                u(n).addClass("small"), c()
                            }
                        }--t || u(".rrssb-buttons").each(function(e) {
                            var t = u(this),
                                i = u("li", t),
                                o = i.filter(".small"),
                                n = 0,
                                a = 0,
                                s = o.eq(0),
                                r = parseFloat(s.attr("data-size")) + 55,
                                l = o.length;
                            l === i.length ? 42 * l + r < t.width() && (t.removeClass("small-format"), o.eq(0).removeClass("small"), c()) : (i.not(".small").each(function(e) {
                                var t = u(this),
                                    i = parseFloat(t.attr("data-size")) + 55,
                                    o = parseFloat(t.width());
                                n += o, a += i
                            }), r < n - a && (s.removeClass("small"), c()))
                        })
                    })
                }), !0 === e && i(c)
            },
            c = function() {
                u(".rrssb-buttons").each(function(e) {
                    var t, i, o, n, a, s = u(this),
                        r = u("li", s),
                        l = r.filter(".small"),
                        c = l.length;
                    0 < c && c !== r.length ? (s.removeClass("small-format"), l.css("width", "42px"), o = 42 * c, i = 100 / (t = r.not(".small").length), a = o / t, !1 === m.calc ? (n = (s.innerWidth() - 1) / t - a, n = Math.floor(1e3 * n) / 1e3, n += "px") : n = m.calc + "(" + i + "% - " + a + "px)", r.not(".small").css("width", n)) : (c === r.length ? s.addClass("small-format") : s.removeClass("small-format"), p())
                }), u(".rrssb-buttons").each(function(e) {
                    var t = u(this),
                        i = t.width(),
                        o = u("li", t).not(".small").eq(0).width(),
                        n = u("li.small", t).length;
                    if (170 < o && n < 1) {
                        t.addClass("large-format");
                        var a = o / 12 + "px";
                        t.css("font-size", a)
                    } else t.removeClass("large-format"), t.css("font-size", "");
                    i < 25 * n ? t.removeClass("small-format").addClass("tiny-format") : t.removeClass("tiny-format")
                })
            },
            e = function() {
                u(".rrssb-buttons").each(function(e) {
                        u(this).addClass("rrssb-" + (e + 1))
                    }),
                    function() {
                        var e = u("<div>"),
                            t = ["calc", "-webkit-calc", "-moz-calc"];
                        u("body").append(e);
                        for (var i = 0; i < t.length; i++)
                            if (e.css("width", t[i] + "(1px)"), 1 === e.width()) {
                                m.calc = t[i];
                                break
                            }
                        e.remove()
                    }(), p(), u(".rrssb-buttons li .rrssb-text").each(function(e) {
                        var t = u(this),
                            i = t.width();
                        t.closest("li").attr("data-size", i)
                    }), t(!0)
            },
            i = function(e) {
                u(".rrssb-buttons li.small").removeClass("small"), t(), e()
            },
            a = (o = {}, function(e, t, i) {
                i || (i = "Don't call this twice without a uniqueId"), o[i] && clearTimeout(o[i]), o[i] = setTimeout(e, t)
            });
        u(document).ready(function() {
            try {
                u(document).on("click", ".rrssb-buttons a.popup", {}, function(e) {
                    var t, i, o, n, a, s, r, l, c, m = u(this);
                    t = m.attr("href"), i = m.find(".rrssb-text").html(), o = 580, n = 470, a = d.screenLeft !== h ? d.screenLeft : screen.left, s = d.screenTop !== h ? d.screenTop : screen.top, r = (d.innerWidth ? d.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width) / 2 - o / 2 + a, l = (d.innerHeight ? d.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height) / 3 - n / 3 + s, (c = d.open(t, i, "scrollbars=yes, width=" + o + ", height=" + n + ", top=" + l + ", left=" + r)) && c.focus && c.focus(), e.preventDefault()
                })
            } catch (e) {}
            u(d).resize(function() {
                i(c), a(function() {
                    i(c)
                }, 200, "finished resizing")
            }), e()
        }), d.rrssbInit = e
    }(window, jQuery),
    function() {
        var i = window.driftt = window.drift = window.driftt || [];
        if (!i.init) {
            if (i.invoked) return window.console && console.error && console.error("Drift snippet included twice.");
            i.invoked = !0, i.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"], i.factory = function(t) {
                return function() {
                    var e = Array.prototype.slice.call(arguments);
                    return e.unshift(t), i.push(e), i
                }
            }, i.methods.forEach(function(e) {
                i[e] = i.factory(e)
            }), i.load = function(e) {
                var t = 3e5 * Math.ceil(new Date / 3e5),
                    i = document.createElement("script");
                i.type = "text/javascript", i.async = !0, i.crossorigin = "anonymous", i.src = "https://js.driftt.com/include/" + t + "/" + e + ".js";
                var o = document.getElementsByTagName("script")[0];
                o.parentNode.insertBefore(i, o)
            }
        }
    }(), drift.SNIPPET_VERSION = "0.3.1", drift.load("acwym97sp35u"), drift.on("ready", function(e) {
        drift.api.startInteraction()
    });
//# sourceMappingURL=theme.min.js.map
