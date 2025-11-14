!(function () {
  "use strict";
  var t = function () {
      return (
        (t =
          Object.assign ||
          function (t) {
            for (var e, i = 1, n = arguments.length; i < n; i++)
              for (var a in (e = arguments[i]))
                Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
            return t;
          }),
        t.apply(this, arguments)
      );
    },
    e = (function () {
      function e(e, i, n) {
        var a = this;
        (this.endVal = i),
          (this.options = n),
          (this.version = "2.9.0"),
          (this.defaults = {
            startVal: 0,
            decimalPlaces: 0,
            duration: 2,
            useEasing: !0,
            useGrouping: !0,
            useIndianSeparators: !1,
            smartEasingThreshold: 999,
            smartEasingAmount: 333,
            separator: ",",
            decimal: ".",
            prefix: "",
            suffix: "",
            enableScrollSpy: !1,
            scrollSpyDelay: 200,
            scrollSpyOnce: !1,
          }),
          (this.finalEndVal = null),
          (this.useEasing = !0),
          (this.countDown = !1),
          (this.error = ""),
          (this.startVal = 0),
          (this.paused = !0),
          (this.once = !1),
          (this.count = function (t) {
            a.startTime || (a.startTime = t);
            var e = t - a.startTime;
            (a.remaining = a.duration - e),
              a.useEasing
                ? a.countDown
                  ? (a.frameVal =
                      a.startVal -
                      a.easingFn(e, 0, a.startVal - a.endVal, a.duration))
                  : (a.frameVal = a.easingFn(
                      e,
                      a.startVal,
                      a.endVal - a.startVal,
                      a.duration
                    ))
                : (a.frameVal =
                    a.startVal + (a.endVal - a.startVal) * (e / a.duration));
            var i = a.countDown ? a.frameVal < a.endVal : a.frameVal > a.endVal;
            (a.frameVal = i ? a.endVal : a.frameVal),
              (a.frameVal = Number(
                a.frameVal.toFixed(a.options.decimalPlaces)
              )),
              a.printValue(a.frameVal),
              e < a.duration
                ? (a.rAF = requestAnimationFrame(a.count))
                : null !== a.finalEndVal
                ? a.update(a.finalEndVal)
                : a.options.onCompleteCallback &&
                  a.options.onCompleteCallback();
          }),
          (this.formatNumber = function (t) {
            var e,
              i,
              n,
              s,
              r = t < 0 ? "-" : "";
            e = Math.abs(t).toFixed(a.options.decimalPlaces);
            var o = (e += "").split(".");
            if (
              ((i = o[0]),
              (n = o.length > 1 ? a.options.decimal + o[1] : ""),
              a.options.useGrouping)
            ) {
              s = "";
              for (var l = 3, u = 0, h = 0, d = i.length; h < d; ++h)
                a.options.useIndianSeparators && 4 === h && ((l = 2), (u = 1)),
                  0 !== h && u % l == 0 && (s = a.options.separator + s),
                  u++,
                  (s = i[d - h - 1] + s);
              i = s;
            }
            return (
              a.options.numerals &&
                a.options.numerals.length &&
                ((i = i.replace(/[0-9]/g, function (t) {
                  return a.options.numerals[+t];
                })),
                (n = n.replace(/[0-9]/g, function (t) {
                  return a.options.numerals[+t];
                }))),
              r + a.options.prefix + i + n + a.options.suffix
            );
          }),
          (this.easeOutExpo = function (t, e, i, n) {
            return (i * (1 - Math.pow(2, (-10 * t) / n)) * 1024) / 1023 + e;
          }),
          (this.options = t(t({}, this.defaults), n)),
          (this.formattingFn = this.options.formattingFn
            ? this.options.formattingFn
            : this.formatNumber),
          (this.easingFn = this.options.easingFn
            ? this.options.easingFn
            : this.easeOutExpo),
          (this.el = "string" == typeof e ? document.getElementById(e) : e),
          (i = null == i ? this.parse(this.el.innerHTML) : i),
          (this.startVal = this.validateValue(this.options.startVal)),
          (this.frameVal = this.startVal),
          (this.endVal = this.validateValue(i)),
          (this.options.decimalPlaces = Math.max(this.options.decimalPlaces)),
          this.resetDuration(),
          (this.options.separator = String(this.options.separator)),
          (this.useEasing = this.options.useEasing),
          "" === this.options.separator && (this.options.useGrouping = !1),
          this.el
            ? this.printValue(this.startVal)
            : (this.error = "[CountUp] target is null or undefined"),
          "undefined" != typeof window &&
            this.options.enableScrollSpy &&
            (this.error
              ? console.error(this.error, e)
              : ((window.onScrollFns = window.onScrollFns || []),
                window.onScrollFns.push(function () {
                  return a.handleScroll(a);
                }),
                (window.onscroll = function () {
                  window.onScrollFns.forEach(function (t) {
                    return t();
                  });
                }),
                this.handleScroll(this)));
      }
      return (
        (e.prototype.handleScroll = function (t) {
          if (t && window && !t.once) {
            var e = window.innerHeight + window.scrollY,
              i = t.el.getBoundingClientRect(),
              n = i.top + window.pageYOffset,
              a = i.top + i.height + window.pageYOffset;
            a < e && a > window.scrollY && t.paused
              ? ((t.paused = !1),
                setTimeout(function () {
                  return t.start();
                }, t.options.scrollSpyDelay),
                t.options.scrollSpyOnce && (t.once = !0))
              : (window.scrollY > a || n > e) && !t.paused && t.reset();
          }
        }),
        (e.prototype.determineDirectionAndSmartEasing = function () {
          var t = this.finalEndVal ? this.finalEndVal : this.endVal;
          this.countDown = this.startVal > t;
          var e = t - this.startVal;
          if (
            Math.abs(e) > this.options.smartEasingThreshold &&
            this.options.useEasing
          ) {
            this.finalEndVal = t;
            var i = this.countDown ? 1 : -1;
            (this.endVal = t + i * this.options.smartEasingAmount),
              (this.duration = this.duration / 2);
          } else (this.endVal = t), (this.finalEndVal = null);
          null !== this.finalEndVal
            ? (this.useEasing = !1)
            : (this.useEasing = this.options.useEasing);
        }),
        (e.prototype.start = function (t) {
          this.error ||
            (this.options.onStartCallback && this.options.onStartCallback(),
            t && (this.options.onCompleteCallback = t),
            this.duration > 0
              ? (this.determineDirectionAndSmartEasing(),
                (this.paused = !1),
                (this.rAF = requestAnimationFrame(this.count)))
              : this.printValue(this.endVal));
        }),
        (e.prototype.pauseResume = function () {
          this.paused
            ? ((this.startTime = null),
              (this.duration = this.remaining),
              (this.startVal = this.frameVal),
              this.determineDirectionAndSmartEasing(),
              (this.rAF = requestAnimationFrame(this.count)))
            : cancelAnimationFrame(this.rAF),
            (this.paused = !this.paused);
        }),
        (e.prototype.reset = function () {
          cancelAnimationFrame(this.rAF),
            (this.paused = !0),
            this.resetDuration(),
            (this.startVal = this.validateValue(this.options.startVal)),
            (this.frameVal = this.startVal),
            this.printValue(this.startVal);
        }),
        (e.prototype.update = function (t) {
          cancelAnimationFrame(this.rAF),
            (this.startTime = null),
            (this.endVal = this.validateValue(t)),
            this.endVal !== this.frameVal &&
              ((this.startVal = this.frameVal),
              null == this.finalEndVal && this.resetDuration(),
              (this.finalEndVal = null),
              this.determineDirectionAndSmartEasing(),
              (this.rAF = requestAnimationFrame(this.count)));
        }),
        (e.prototype.printValue = function (t) {
          var e;
          if (this.el) {
            var i = this.formattingFn(t);
            (
              null === (e = this.options.plugin) || void 0 === e
                ? void 0
                : e.render
            )
              ? this.options.plugin.render(this.el, i)
              : "INPUT" === this.el.tagName
              ? (this.el.value = i)
              : "text" === this.el.tagName || "tspan" === this.el.tagName
              ? (this.el.textContent = i)
              : (this.el.innerHTML = i);
          }
        }),
        (e.prototype.ensureNumber = function (t) {
          return "number" == typeof t && !isNaN(t);
        }),
        (e.prototype.validateValue = function (t) {
          var e = Number(t);
          return this.ensureNumber(e)
            ? e
            : ((this.error = "[CountUp] invalid start or end value: ".concat(
                t
              )),
              null);
        }),
        (e.prototype.resetDuration = function () {
          (this.startTime = null),
            (this.duration = 1e3 * Number(this.options.duration)),
            (this.remaining = this.duration);
        }),
        (e.prototype.parse = function (t) {
          var e = function (t) {
              return t.replace(/([.,'  ])/g, "\\$1");
            },
            i = e(this.options.separator),
            n = e(this.options.decimal),
            a = t
              .replace(new RegExp(i, "g"), "")
              .replace(new RegExp(n, "g"), ".");
          return parseFloat(a);
        }),
        e
      );
    })();
  document.addEventListener("DOMContentLoaded", () => {
    AOS.init(),
      (function () {
        const t = document.querySelectorAll("[data-da]");
        function e() {
          t.forEach((t) => {
            if (!t._originalData) {
              const e = t.parentElement,
                i = Array.from(e.children).indexOf(t);
              t._originalData = {
                parent: e,
                index: i,
                nextSibling: e.children[i + 1] || null,
              };
            }
            const { parent: e, index: i, nextSibling: n } = t._originalData,
              [a, s] = t.getAttribute("data-da").split("|"),
              r = document.querySelector(a);
            if (!r || !e) return void console.error("Parent is not found!");
            const o = window.innerWidth < parseInt(s),
              l = t.parentNode === r;
            o && !l
              ? r.appendChild(t)
              : !o &&
                l &&
                (n && n.parentNode === e
                  ? e.insertBefore(t, n)
                  : e.appendChild(t));
          });
        }
        let i;
        e(),
          window.addEventListener("resize", () => {
            clearTimeout(i), (i = setTimeout(e, 100));
          });
      })(),
      document.querySelectorAll("[data-count]").forEach((t) => {
        const i = +t.dataset.count;
        new e(t, i, {
          duration: 1,
          suffix: "+",
          enableScrollSpy: !0,
        }).handleScroll();
      });
    const t = document.body,
      i = document.documentElement,
      n = document.querySelector(".burger"),
      a = document.querySelector(".header__nav");
    n.addEventListener("click", () => {
      n.classList.toggle("_active"),
        a.classList.toggle("_active"),
        t.classList.toggle("_lock"),
        i.classList.toggle("_lock");
    }),
      document.querySelectorAll(".accordion").forEach((t) => {
        const e = t.querySelector(".accordion__header"),
          i = t.querySelector(".accordion__content");
        e.addEventListener("click", () => {
          "true" === e.getAttribute("aria-expanded")
            ? ((i.style.height = i.scrollHeight + "px"),
              requestAnimationFrame(() => {
                i.style.height = "0";
              }),
              e.setAttribute("aria-expanded", "false"),
              i.setAttribute("aria-hidden", "true"))
            : ((i.style.height = i.scrollHeight + "px"),
              e.setAttribute("aria-expanded", "true"),
              i.setAttribute("aria-hidden", "false"),
              i.addEventListener("transitionend", function t() {
                (i.style.height = "auto"),
                  i.removeEventListener("transitionend", t);
              }));
        });
      });
    const s = document.querySelector(".reviews__slider"),
      r = document
        .querySelector(".reviews__arrows")
        .querySelector(".swiper-button-prev"),
      o = document
        .querySelector(".reviews__arrows")
        .querySelector(".swiper-button-next");
    new Swiper(s, {
      loop: !0,
      navigation: { nextEl: o, prevEl: r },
      breakpoints: {
        1199.97: { slidesPerView: "2", spaceBetween: 60 },
        1023.97: { spaceBetween: 30, slidesPerView: "3" },
        767.97: { slidesPerView: "2", spaceBetween: 30 },
        319.97: { slidesPerView: "1", spaceBetween: 100 },
      },
    });
  });
})();
