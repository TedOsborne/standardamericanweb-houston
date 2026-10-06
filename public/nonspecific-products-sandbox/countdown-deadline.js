(function () {
  'use strict';

  // Static equivalent of the former PHP schedule for Cloudflare Pages.
  var timeZone = 'America/Chicago';
  var formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone,
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
      guess += wanted - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
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

  function plusDays(parts, days) {
    var date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
  }

  function targetDateString(parts) {
    function two(value) { return String(value).padStart(2, '0'); }
    return parts.year + '/' + two(parts.month) + '/' + two(parts.day) + ' 16:45:00';
  }

  var now = new Date();
  var local = partsAt(now);
  var currentDate = lastWeekday(local.year, local.month);
  var currentDeadline = zonedEpoch(currentDate.year, currentDate.month, currentDate.day, 16, 45, 0);
  var resumeDate = plusDays(currentDate, 3);
  var resume = zonedEpoch(resumeDate.year, resumeDate.month, resumeDate.day, 0, 0, 0);
  var active = true;
  var targetDate = currentDate;
  var target = currentDeadline;

  if (now.getTime() > currentDeadline) {
    var nextMonth = new Date(Date.UTC(local.year, local.month, 1));
    targetDate = lastWeekday(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth() + 1);
    target = zonedEpoch(targetDate.year, targetDate.month, targetDate.day, 16, 45, 0);
    active = now.getTime() >= resume;
  } else {
    // A deadline at month-end can leave its two-day pause in the next month.
    var previousMonth = new Date(Date.UTC(local.year, local.month - 2, 1));
    var previousDate = lastWeekday(previousMonth.getUTCFullYear(), previousMonth.getUTCMonth() + 1);
    var previousDeadline = zonedEpoch(previousDate.year, previousDate.month, previousDate.day, 16, 45, 0);
    var previousResumeDate = plusDays(previousDate, 3);
    var previousResume = zonedEpoch(previousResumeDate.year, previousResumeDate.month, previousResumeDate.day, 0, 0, 0);
    if (now.getTime() > previousDeadline && now.getTime() < previousResume) {
      active = false;
      resume = previousResume;
    }
  }

  window.SAW_COUNTDOWN_SCHEDULE = {
    active: active,
    target_date: targetDateString(targetDate),
    target_iso: new Date(target).toISOString(),
    resume_iso: new Date(resume).toISOString(),
    timezone: timeZone
  };
  window.dispatchEvent(new CustomEvent('saw-countdown-schedule', {
    detail: window.SAW_COUNTDOWN_SCHEDULE
  }));

  if (!active) {
    function hideCountdown() {
      var container = document.getElementById('count_cont');
      if (container) {
        container.hidden = true;
        container.setAttribute('aria-hidden', 'true');
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hideCountdown, { once: true });
    } else {
      hideCountdown();
    }
  }
}());
