(window.webpackJsonp = window.webpackJsonp || []).push([
  [20],
  {
    190: function (module, exports, __webpack_require__) {
      (function (global) {
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        !(function (t, e) {
          module.exports = e(t);
        })(
          "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : void 0 !== global
            ? global
            : this,
          function (global) {
            "use strict";
            global = global || {};
            var _Base64 = global.Base64,
              version = "2.5.2",
              buffer;
            if (module.exports)
              try {
                buffer = eval("require('buffer').Buffer");
              } catch (t) {
                buffer = void 0;
              }
            var b64chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
              b64tab = (function (t) {
                for (var e = {}, i = 0, r = t.length; i < r; i++)
                  e[t.charAt(i)] = i;
                return e;
              })(b64chars),
              fromCharCode = String.fromCharCode,
              cb_utob = function (t) {
                if (t.length < 2)
                  return (e = t.charCodeAt(0)) < 128
                    ? t
                    : e < 2048
                    ? fromCharCode(192 | (e >>> 6)) +
                      fromCharCode(128 | (63 & e))
                    : fromCharCode(224 | ((e >>> 12) & 15)) +
                      fromCharCode(128 | ((e >>> 6) & 63)) +
                      fromCharCode(128 | (63 & e));
                var e =
                  65536 +
                  1024 * (t.charCodeAt(0) - 55296) +
                  (t.charCodeAt(1) - 56320);
                return (
                  fromCharCode(240 | ((e >>> 18) & 7)) +
                  fromCharCode(128 | ((e >>> 12) & 63)) +
                  fromCharCode(128 | ((e >>> 6) & 63)) +
                  fromCharCode(128 | (63 & e))
                );
              },
              re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
              utob = function (u) {
                return u.replace(re_utob, cb_utob);
              },
              cb_encode = function (t) {
                var e = [0, 2, 1][t.length % 3],
                  r =
                    (t.charCodeAt(0) << 16) |
                    ((t.length > 1 ? t.charCodeAt(1) : 0) << 8) |
                    (t.length > 2 ? t.charCodeAt(2) : 0);
                return [
                  b64chars.charAt(r >>> 18),
                  b64chars.charAt((r >>> 12) & 63),
                  e >= 2 ? "=" : b64chars.charAt((r >>> 6) & 63),
                  e >= 1 ? "=" : b64chars.charAt(63 & r),
                ].join("");
              },
              btoa = global.btoa
                ? function (b) {
                    return global.btoa(b);
                  }
                : function (b) {
                    return b.replace(/[\s\S]{1,3}/g, cb_encode);
                  },
              _encode = function (u) {
                return "[object Uint8Array]" ===
                  Object.prototype.toString.call(u)
                  ? u.toString("base64")
                  : btoa(utob(String(u)));
              },
              encode = function (u, t) {
                return t
                  ? _encode(String(u))
                      .replace(/[+\/]/g, function (t) {
                        return "+" == t ? "-" : "_";
                      })
                      .replace(/=/g, "")
                  : _encode(u);
              },
              encodeURI = function (u) {
                return encode(u, !0);
              },
              re_btou =
                /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,
              cb_btou = function (t) {
                switch (t.length) {
                  case 4:
                    var e =
                      (((7 & t.charCodeAt(0)) << 18) |
                        ((63 & t.charCodeAt(1)) << 12) |
                        ((63 & t.charCodeAt(2)) << 6) |
                        (63 & t.charCodeAt(3))) -
                      65536;
                    return (
                      fromCharCode(55296 + (e >>> 10)) +
                      fromCharCode(56320 + (1023 & e))
                    );
                  case 3:
                    return fromCharCode(
                      ((15 & t.charCodeAt(0)) << 12) |
                        ((63 & t.charCodeAt(1)) << 6) |
                        (63 & t.charCodeAt(2))
                    );
                  default:
                    return fromCharCode(
                      ((31 & t.charCodeAt(0)) << 6) | (63 & t.charCodeAt(1))
                    );
                }
              },
              btou = function (b) {
                return b.replace(re_btou, cb_btou);
              },
              cb_decode = function (t) {
                var e = t.length,
                  r = e % 4,
                  o =
                    (e > 0 ? b64tab[t.charAt(0)] << 18 : 0) |
                    (e > 1 ? b64tab[t.charAt(1)] << 12 : 0) |
                    (e > 2 ? b64tab[t.charAt(2)] << 6 : 0) |
                    (e > 3 ? b64tab[t.charAt(3)] : 0),
                  n = [
                    fromCharCode(o >>> 16),
                    fromCharCode((o >>> 8) & 255),
                    fromCharCode(255 & o),
                  ];
                return (n.length -= [0, 0, 2, 1][r]), n.join("");
              },
              _atob = global.atob
                ? function (a) {
                    return global.atob(a);
                  }
                : function (a) {
                    return a.replace(/\S{1,4}/g, cb_decode);
                  },
              atob = function (a) {
                return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ""));
              },
              _decode = buffer
                ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from
                  ? function (a) {
                      return (
                        a.constructor === buffer.constructor
                          ? a
                          : buffer.from(a, "base64")
                      ).toString();
                    }
                  : function (a) {
                      return (
                        a.constructor === buffer.constructor
                          ? a
                          : new buffer(a, "base64")
                      ).toString();
                    }
                : function (a) {
                    return btou(_atob(a));
                  },
              decode = function (a) {
                return _decode(
                  String(a)
                    .replace(/[-_]/g, function (t) {
                      return "-" == t ? "+" : "/";
                    })
                    .replace(/[^A-Za-z0-9\+\/]/g, "")
                );
              },
              noConflict = function () {
                var t = global.Base64;
                return (global.Base64 = _Base64), t;
              };
            if (
              ((global.Base64 = {
                VERSION: version,
                atob: atob,
                btoa: btoa,
                fromBase64: decode,
                toBase64: encode,
                utob: utob,
                encode: encode,
                encodeURI: encodeURI,
                btou: btou,
                decode: decode,
                noConflict: noConflict,
                __buffer__: buffer,
              }),
              "function" == typeof Object.defineProperty)
            ) {
              var noEnum = function (t) {
                return {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                };
              };
              global.Base64.extendString = function () {
                Object.defineProperty(
                  String.prototype,
                  "fromBase64",
                  noEnum(function () {
                    return decode(this);
                  })
                ),
                  Object.defineProperty(
                    String.prototype,
                    "toBase64",
                    noEnum(function (t) {
                      return encode(this, t);
                    })
                  ),
                  Object.defineProperty(
                    String.prototype,
                    "toBase64URI",
                    noEnum(function () {
                      return encode(this, !0);
                    })
                  );
              };
            }
            return (
              global.Meteor && (Base64 = global.Base64),
              module.exports
                ? (module.exports.Base64 = global.Base64)
                : ((__WEBPACK_AMD_DEFINE_ARRAY__ = []),
                  (__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                    return global.Base64;
                  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)),
                  void 0 === __WEBPACK_AMD_DEFINE_RESULT__ ||
                    (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)),
              { Base64: global.Base64 }
            );
          }
        );
      }.call(this, __webpack_require__(44)));
    },
    191: function (t, e, r) {
      var content = r(200);
      "string" == typeof content && (content = [[t.i, content, ""]]),
        content.locals && (t.exports = content.locals);
      (0, r(98).default)("ed3363e4", content, !0, { sourceMap: !1 });
    },
    199: function (t, e, r) {
      "use strict";
      var o = r(191);
      r.n(o).a;
    },
    200: function (t, e, r) {
      (e = r(97)(!1)).push([
        t.i,
        ".reaction-screen[data-v-e9d95260]{display:block;cursor:pointer;font-size:1rem;text-align:center;padding:50px 2rem}.reaction-start[data-v-e9d95260]{background-color:rgba(0,0,255,.3)}.reaction-ready[data-v-e9d95260]{background-color:rgba(255,0,0,.3)}.reaction-click[data-v-e9d95260]{background-color:rgba(0,255,0,.3)}.reaction-error[data-v-e9d95260]{background-color:hsla(0,0%,43.5%,.8)}",
        "",
      ]),
        (t.exports = e);
    },
    221: function (t, e, r) {
      "use strict";
      r.r(e);
      r(31), r(32), r(1);
      var o = r(99),
        n = r(190),
        c = {
          components: { Ad: o.a },
          data: function () {
            return {
              title: "반응속도 테스트 시작",
              description:
                "반응속도 테스트 시작, 반응속도 게임 시작, 반응속도 검사, 동체시력 테스트, 동체시력 검사, 동체시력 게임 테스트 시작",
              resultPageLink: "/reaction/result/",
              url: "https://simritest.com" + this.$nuxt.$route.path,
              questionsPerPage: 1,
              totalPages: 5,
              page: 0,
              isStartPage: !0,
              isStarted: !1,
              isReadyPage: !1,
              isBetween: !1,
              isError: !1,
              isFinished: !1,
              startTimestamp: 0,
              endTimestamp: 0,
              triesTimestamp: [],
              reactionBlock: "reaction-start",
            };
          },
          head: function () {
            return {
              title: this.title,
              meta: [
                {
                  hid: "description",
                  name: "description",
                  content: this.description,
                },
                { property: "og:url", content: this.url },
                { property: "og:type", content: "website" },
                { property: "og:title", content: this.title },
                { property: "og:description", content: this.description },
              ],
              link: [{ rel: "canonical", href: this.url }],
            };
          },
          computed: {
            questionStartLimit: function () {
              return this.questionsPerPage * (this.page - 1);
            },
            questionEndLimit: function () {
              return this.questionsPerPage * this.page;
            },
            isLastPage: function () {
              return this.page === this.totalPages;
            },
            myProgress: function () {
              return Math.floor((this.page / this.totalPages) * 100);
            },
            averageTimestamp: function () {
              if (0 === this.page) return !1;
              for (var t = 0, i = 0; i < this.triesTimestamp.length; i++)
                t += this.triesTimestamp[i];
              return (t /= this.triesTimestamp.length), Math.ceil(t);
            },
          },
          methods: {
            nextPage: function () {},
            restart: function () {
              (this.page = 0),
                (this.isStartPage = !0),
                (this.isStarted = !1),
                (this.isReadyPage = !1),
                (this.isBetween = !1),
                (this.isError = !1),
                (this.startTimestamp = 0),
                (this.endTimestamp = 0),
                (this.triesTimestamp = []),
                (this.reactionBlock = "reaction-start");
            },
            start: function () {
              if (
                (this.isBetween && (this.isError = !0),
                this.isStartPage &&
                  ((this.reactionBlock = "reaction-ready"),
                  (this.isStartPage = !1),
                  (this.isReadyPage = !0)),
                this.isStarted &&
                  !this.isReadyPage &&
                  ((this.endTimestamp = new Date().getTime()),
                  this.$device.isMobileOrTablet &&
                    this.endTimestamp - this.startTimestamp > 250 &&
                    (this.endTimestamp -= 100),
                  this.triesTimestamp.push(
                    this.endTimestamp - this.startTimestamp
                  ),
                  console.log(this.endTimestamp - this.startTimestamp),
                  (this.isStarted = !1),
                  (this.reactionBlock = "reaction-ready"),
                  (this.endTimestamp = 0),
                  (this.startTimestamp = 0),
                  (this.isStarted = !1),
                  (this.isReadyPage = !0),
                  this.page++,
                  console.log(this.triesTimestamp),
                  console.log(
                    n.Base64.encode(this.averageTimestamp.toString())
                  ),
                  this.page === this.totalPages &&
                    ((this.isFinished = !0),
                    this.$router.push(
                      this.resultPageLink +
                        n.Base64.encode(this.averageTimestamp.toString())
                    ))),
                this.isReadyPage && !this.isBetween)
              ) {
                this.isBetween = !0;
                var t = 5 * Math.floor(300 * Math.random()) + 2e3;
                setTimeout(
                  function () {
                    (this.reactionBlock = "reaction-click"),
                      (this.isStarted = !0),
                      (this.isReadyPage = !1),
                      (this.isBetween = !1),
                      (this.startTimestamp = new Date().getTime());
                  }.bind(this),
                  t
                );
              }
            },
          },
        },
        d = (r(199), r(24)),
        component = Object(d.a)(
          c,
          function () {
            var t = this,
              e = t.$createElement,
              r = t._self._c || e;
            return r(
              "div",
              { staticClass: "animated fadeIn fast" },
              [
                r("div", { staticClass: "text-right p-2" }, [
                  t._v(t._s(t.page) + " / " + t._s(t.totalPages)),
                ]),
                t._v(" "),
                r("b-progress", { attrs: { value: t.myProgress } }),
                t._v(" "),
                r(
                  "b-form",
                  {
                    on: {
                      submit: function (e) {
                        return e.preventDefault(), t.onSubmit(e);
                      },
                    },
                  },
                  [
                    t.isFinished
                      ? r("section", [
                          r("h1", [t._v("결과 페이지 이동중입니다.")]),
                        ])
                      : t.isError
                      ? r("section", [
                          r(
                            "div",
                            {
                              staticClass:
                                "mb-3 mt-3 reaction-screen reaction-error",
                              on: { click: t.restart },
                            },
                            [
                              r("h1", [
                                t._v("준비 화면에서는 클릭이 불가합니다."),
                              ]),
                              t._v(" "),
                              r("p", [
                                t._v(
                                  "\n          빨간색 준비 화면에서는 클릭이 불가합니다. 화면이 초록색으로 바뀌면\n          클릭 해 주시길 바랍니다. 처음부터 시작하시려면 화면을 클릭 해\n          주세요.\n        "
                                ),
                              ]),
                            ]
                          ),
                        ])
                      : r(
                          "section",
                          [
                            t.isStartPage
                              ? r(
                                  "div",
                                  {
                                    staticClass: "mb-3 mt-3 reaction-screen",
                                    class: t.reactionBlock,
                                    on: { click: t.start },
                                  },
                                  [
                                    r("h1", [t._v("시작")]),
                                    t._v(" "),
                                    r("p", [
                                      t._v(
                                        "\n          총 기회는 5회 주어집니다. 다음 준비화면에서 배경화면이 초록색이\n          되었을 때 클릭하시면 됩니다. 시작하시려면 현재 화면을 클릭해주세요.\n        "
                                      ),
                                    ]),
                                  ]
                                )
                              : r(
                                  "div",
                                  {
                                    staticClass: "mb-3 mt-3 reaction-screen",
                                    class: t.reactionBlock,
                                    on: { click: t.start },
                                  },
                                  [
                                    t.isStarted
                                      ? r("div", [
                                          r("h1", [t._v("클릭")]),
                                          t._v(" "),
                                          r("p", [t._v("클릭해주세요")]),
                                        ])
                                      : r("div", [
                                          r("h1", [t._v("준비")]),
                                          t._v(" "),
                                          r("p", [
                                            t._v(
                                              "\n            배경화면이 초록색이 되면 클릭해주세요.\n            "
                                            ),
                                            t.triesTimestamp.length > 0
                                              ? r("span", [
                                                  t._v(
                                                    "\n              (마지막 시도:\n              " +
                                                      t._s(
                                                        t.triesTimestamp[
                                                          t.triesTimestamp
                                                            .length - 1
                                                        ]
                                                      ) +
                                                      "ms)\n            "
                                                  ),
                                                ])
                                              : t._e(),
                                          ]),
                                        ]),
                                  ]
                                ),
                            t._v(" "),
                            t._l(t.triesTimestamp, function (e, o) {
                              return r("div", { key: o }, [
                                t._v(
                                  t._s(o + 1) + "번째 시도: " + t._s(e) + " ms"
                                ),
                              ]);
                            }),
                          ],
                          2
                        ),
                  ]
                ),
              ],
              1
            );
          },
          [],
          !1,
          null,
          "e9d95260",
          null
        );
      e.default = component.exports;
    },
  },
]);
