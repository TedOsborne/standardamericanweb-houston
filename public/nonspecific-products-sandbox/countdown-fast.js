(function () {
  'use strict';

  // This timer is deliberately dependency-free. It renders as soon as the DOM
  // is parsed and never waits for images, Lottie, sliders, jQuery, or PHP.
  window.SAW_FAST_COUNTDOWN_ACTIVE = true;

  var TIME_ZONE = 'America/Chicago';
  var bootEpoch = Date.now();
  var navigationEpoch = window.performance && Number.isFinite(window.performance.timeOrigin)
    ? window.performance.timeOrigin
    : bootEpoch;
  var timerId = 0;
  var targetMs = 0;
  var started = false;
  var flipControl = null;
  var formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23'
  });

  function partsAt(date) {
    var result = {};
    formatter.formatToParts(date).forEach(function (part) {
      if (part.type !== 'literal') result[part.type] = Number(part.value);
    });
    return result;
  }

  function zonedEpoch(year, month, day, hour, minute, second) {
    var wanted = Date.UTC(year, month - 1, day, hour, minute, second);
    var guess = wanted;
    for (var i = 0; i < 3; i += 1) {
      var p = partsAt(new Date(guess));
      var represented = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
      guess += wanted - represented;
    }
    return guess;
  }

  function lastWeekday(year, month) {
    var last = new Date(Date.UTC(year, month, 0));
    while (last.getUTCDay() === 0 || last.getUTCDay() === 6) {
      last.setUTCDate(last.getUTCDate() - 1);
    }
    return { year: year, month: month, day: last.getUTCDate() };
  }

  function addCalendarDays(dateParts, days) {
    var value = new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day + days));
    return { year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate() };
  }

  function localSchedule() {
    var now = new Date();
    var local = partsAt(now);
    var deadlineDate = lastWeekday(local.year, local.month);
    var deadline = zonedEpoch(deadlineDate.year, deadlineDate.month, deadlineDate.day, 16, 45, 0);
    var resumeDate = addCalendarDays(deadlineDate, 3);
    var resume = zonedEpoch(resumeDate.year, resumeDate.month, resumeDate.day, 0, 0, 0);
    var active = true;

    if (now.getTime() > deadline) {
      active = now.getTime() >= resume;
      var nextMonthDate = new Date(Date.UTC(local.year, local.month, 1));
      var next = lastWeekday(nextMonthDate.getUTCFullYear(), nextMonthDate.getUTCMonth() + 1);
      deadline = zonedEpoch(next.year, next.month, next.day, 16, 45, 0);
    }
    return { active: active, target_ms: deadline };
  }

  function parseServerTarget(schedule) {
    if (!schedule || !schedule.target_iso) return 0;
    var parsed = Date.parse(schedule.target_iso);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function addStyles() {
    if (document.getElementById('saw-fast-countdown-styles')) return;
    var style = document.createElement('style');
    style.id = 'saw-fast-countdown-styles';
    style.textContent =
      '#first_countdown.saw-fast-countdown{position:relative!important;width:100%!important;height:clamp(145px,18vw,285px)!important;min-height:145px;visibility:visible!important;opacity:1!important;overflow:visible}' +
      '#first_countdown.saw-fast-countdown canvas{max-width:100%}' +
      '@media(max-width:480px){#first_countdown.saw-fast-countdown{height:145px!important;min-height:145px}}';
    document.head.appendChild(style);
  }

  function setOfferVisibility(active) {
    var shell = document.getElementById('count_cont');
    var timer = document.getElementById('first_countdown');
    if (shell) {
      shell.hidden = !active;
      shell.setAttribute('aria-hidden', active ? 'false' : 'true');
    }
    if (timer) {
      timer.hidden = !active;
      timer.setAttribute('aria-hidden', active ? 'false' : 'true');
    }
  }

  function renderShell() {
    var el = document.getElementById('first_countdown');
    if (!el) return false;
    addStyles();
    el.className = (el.className ? el.className + ' ' : '') + 'saw-fast-countdown';
    el.setAttribute('role', 'timer');
    el.setAttribute('aria-live', 'off');
    el.innerHTML = '';
    return true;
  }

  function paint() {
    var remaining = Math.max(0, targetMs - Date.now());
    var totalSeconds = Math.floor(remaining / 1000);
    var values = [
      Math.floor(totalSeconds / 86400),
      Math.floor(totalSeconds / 3600) % 24,
      Math.floor(totalSeconds / 60) % 60,
      totalSeconds % 60
    ];
    document.querySelectorAll('[data-saw-countdown-value]').forEach(function (node, index) {
      var width = index === 0 ? 3 : 2;
      node.textContent = String(values[index]).padStart(width, '0');
    });
  }

  function applySchedule(schedule) {
    var local = localSchedule();
    var active = schedule && typeof schedule.active === 'boolean' ? schedule.active : local.active;
    var serverTarget = parseServerTarget(schedule);
    targetMs = serverTarget || local.target_ms;
    setOfferVisibility(active);
    if (flipControl && typeof flipControl.destroy_countdown === 'function') {
      flipControl.destroy_countdown();
      flipControl = null;
      var oldTimer = document.getElementById('first_countdown');
      if (oldTimer) oldTimer.innerHTML = '';
    }
    if (!active) {
      if (timerId) clearInterval(timerId);
      return;
    }
    if (!window.jQuery || typeof window.jQuery.fn.ResponsiveCountdown !== 'function') return;
    var target = new Date(targetMs);
    flipControl = window.jQuery('#first_countdown').ResponsiveCountdown({
      target_date: target.toISOString(),
      time_zone: -target.getTimezoneOffset() / 60,
      target_future: true,
      set_id: 0,
      pan_id: 0,
      day_digits: 3,
      fillStyleSymbol1: 'rgba(255,255,255,1)',
      fillStyleSymbol2: 'rgba(255,255,255,1)',
      fillStylesPanel_g1_1: 'rgba(100,100,100,1)',
      fillStylesPanel_g1_2: 'rgba(30,30,30,1)',
      fillStylesPanel_g2_1: 'rgba(232,79,30,1)',
      fillStylesPanel_g2_2: 'rgba(255,102,0,1)',
      text_color: 'rgba(26,26,26,1)',
      text_glow: 'rgba(0,0,0,1)',
      show_ss: true,
      show_mm: true,
      show_hh: true,
      show_dd: true,
      f_family: 'Verdana',
      f_weight: 'bold',
      show_labels: true,
      type3d: 'single',
      max_height: 285,
      min_f_size: 11,
      max_f_size: 30,
      spacer: 'none',
      groups_spacing: 0,
      text_blur: 2,
      font_to_digit_ratio: 0.125,
      labels_space: 1.2
    });
  }

  function start() {
    if (started) return true;
    if (!renderShell()) return false;
    started = true;
    applySchedule(window.SAW_COUNTDOWN_SCHEDULE || null);
    window.SAW_COUNTDOWN_RENDERED_AT = window.performance && typeof window.performance.now === 'function'
      ? window.performance.now()
      : Date.now() - bootEpoch;
    var timerElement = document.getElementById('first_countdown');
    if (timerElement) {
      timerElement.setAttribute('data-saw-rendered', 'true');
      timerElement.setAttribute('data-saw-render-delay-ms', String(Date.now() - bootEpoch));
      timerElement.setAttribute('data-saw-navigation-delay-ms', String(Math.round(Date.now() - navigationEpoch)));
    }
    document.dispatchEvent(new CustomEvent('saw-countdown-rendered', {
      detail: { elapsed_ms: window.SAW_COUNTDOWN_RENDERED_AT }
    }));
    return true;
  }

  window.addEventListener('saw-countdown-schedule', function (event) {
    if (document.getElementById('first_countdown')) applySchedule(event.detail || window.SAW_COUNTDOWN_SCHEDULE);
  });

  // The script is placed near the top of each page. Observe the parser so the
  // timer renders the instant its container appears, even if later scripts or
  // images keep DOMContentLoaded/window.load waiting for minutes.
  if (!start()) {
    var observer = new MutationObserver(function () {
      if (start()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', function () {
      if (start()) observer.disconnect();
    }, { once: true });
  }
}());
