// Tiny Core Web Vitals overlay built on PerformanceObserver (no libraries).
// Measures LCP, CLS (session windows) and INP (worst interaction) the same way the
// web-vitals library does, simplified for teaching purposes. Chromium-based browsers only.
(function () {
  var THRESHOLDS = {
    LCP: [2500, 4000],
    CLS: [0.1, 0.25],
    INP: [200, 500],
  };
  var values = { LCP: null, CLS: 0, INP: null };

  var panel = document.createElement('aside');
  panel.className = 'vitals';
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML =
    '<strong>Core Web Vitals</strong>' +
    ['LCP', 'CLS', 'INP']
      .map(function (name) {
        return '<div class="row" data-metric="' + name + '"><span>' + name + '</span><output>—</output></div>';
      })
      .join('');

  function rating(name, value) {
    var t = THRESHOLDS[name];
    return value <= t[0] ? 'good' : value <= t[1] ? 'needs-improvement' : 'poor';
  }

  function format(name, value) {
    return name === 'CLS' ? value.toFixed(3) : Math.round(value) + ' ms';
  }

  function render(name) {
    var row = panel.querySelector('[data-metric="' + name + '"]');
    var value = values[name];
    if (value === null) return;
    row.dataset.rating = rating(name, value);
    row.querySelector('output').textContent = format(name, value);
    window.dispatchEvent(new CustomEvent('vitals', { detail: { name: name, value: value, rating: rating(name, value) } }));
  }

  function observe(type, callback, options) {
    try {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(callback);
      });
      po.observe(Object.assign({ type: type, buffered: true }, options || {}));
      return po;
    } catch (e) {
      return null;
    }
  }

  // LCP: the last candidate reported before the first user input.
  var lcpObserver = observe('largest-contentful-paint', function (entry) {
    values.LCP = entry.startTime;
    render('LCP');
  });
  ['keydown', 'pointerdown'].forEach(function (type) {
    addEventListener(type, function () { if (lcpObserver) lcpObserver.disconnect(); }, { once: true, capture: true });
  });

  // CLS: largest "session window" of shifts (gaps < 1s, window < 5s), ignoring shifts caused by input.
  var session = { value: 0, first: 0, last: 0 };
  observe('layout-shift', function (entry) {
    if (entry.hadRecentInput) return;
    if (session.value && entry.startTime - session.last < 1000 && entry.startTime - session.first < 5000) {
      session.value += entry.value;
      session.last = entry.startTime;
    } else {
      session = { value: entry.value, first: entry.startTime, last: entry.startTime };
    }
    if (session.value > values.CLS) {
      values.CLS = session.value;
    }
    render('CLS');
  });

  // INP: the slowest interaction (input delay + processing + time to next paint).
  // With fewer than 50 interactions this is simply the worst one.
  observe('event', function (entry) {
    if (!entry.interactionId) return;
    if (values.INP === null || entry.duration > values.INP) {
      values.INP = entry.duration;
      render('INP');
    }
  }, { durationThreshold: 16 });

  if (!('PerformanceObserver' in window) || !PerformanceObserver.supportedEntryTypes || PerformanceObserver.supportedEntryTypes.indexOf('layout-shift') < 0) {
    panel.insertAdjacentHTML('beforeend', '<p class="note">Open in Chrome or Edge to see the metrics.</p>');
  }

  function mount() {
    document.body.appendChild(panel);
    render('CLS');
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  window.__vitals = values;
})();
