/*
 * Page transitions on a list: only the card that was clicked flies.
 *
 * Every card in a loop over entries carries a name (`case-<entry id>`), so
 * the browser would lift every card on the page into a layer of its own and
 * the ones with no partner would stand over the one that flies. CSS cannot
 * know which card was clicked; this does, in the moment the browser asks:
 *
 * - pageswap (the page being left): names that stand on more than one element
 *   of the page (a list) are taken off every element but the one whose card
 *   links to the page being opened. That one's own hover transforms are
 *   reset first, so it does not start from its hover zoom.
 * - pagereveal (the page that opens, e.g. the list again after Back): the same
 *   for the card that links to the page we came from.
 *
 * An element whose name stands once on its page (the case page's image) is
 * never touched. Put in <head> by InjectPageTransitions on a page that has a
 * view-transition-name in its markup; nothing else on the site.
 */
(function () {
  var ID = /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  function path(href) {
    try {
      return new URL(href, location.href).pathname.replace(/\/+$/, '') || '/';
    } catch (e) {
      return null;
    }
  }

  function linksNear(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      var links = n.matches('a[href]') ? [n] : n.querySelectorAll('a[href]');

      if (links.length) {
        return links;
      }
    }

    return [];
  }

  function onlyTheOneFor(url, leaving) {
    var to = path(url);
    var groups = {};

    if (!to) {
      return;
    }

    document.querySelectorAll('[style*="view-transition-name"]').forEach(function (el) {
      var name = el.style.viewTransitionName;

      if (name && name !== 'none') {
        var pair = name.replace(ID, '');

        (groups[pair] = groups[pair] || []).push(el);
      }
    });

    Object.keys(groups).forEach(function (pair) {
      if (groups[pair].length < 2) {
        return;
      }

      groups[pair].forEach(function (el) {
        var hit = Array.prototype.some.call(linksNear(el), function (a) {
          return path(a.href) === to;
        });

        if (!hit) {
          el.style.viewTransitionName = 'none';
        } else if (leaving) {
          el.querySelectorAll('*').forEach(function (child) {
            child.style.transition = 'none';
            child.style.transform = 'none';
            child.style.scale = 'none';
          });
        }
      });
    });
  }

  addEventListener('pageswap', function (e) {
    if (e.viewTransition && e.activation && e.activation.entry) {
      onlyTheOneFor(e.activation.entry.url, true);
    }
  });

  addEventListener('pagereveal', function (e) {
    var from = e.viewTransition && window.navigation && navigation.activation && navigation.activation.from;

    if (from) {
      onlyTheOneFor(from.url, false);
    }
  });
})();
