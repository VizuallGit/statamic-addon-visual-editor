/**
 * tw-classes.js — the pane's stylesheet.
 * Split out of tw-classes.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. tw-classes.js re-exports this file.
 */
import { injectStyle } from '../lib/style.js';
import { MENU_ID } from '../tw-classes.js';

const STYLE_ID = '__sve-tw-style';

export function ensureStyles(doc) {
  injectStyle(
    doc,
    STYLE_ID,
    `
    #${MENU_ID} {
      position: fixed;
      z-index: 100000;
      box-sizing: border-box;
      min-width: 13rem;
      max-width: 18rem;
      max-height: 60vh;
      overflow-y: auto;
      padding: 0.5rem;
      border-radius: 0.6rem;
      border: 1px solid rgba(255,255,255,.12);
      background: #252526;
      color: #d4d4d4;
      box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,.4);
      font-size: 0.75rem;
    }
    /* A menu with a search and rows under it: the search and the tabs stay
       put, and only the rows scroll — the state popup and the class list. */
    #${MENU_ID}:has([data-sve-tw-rows]),
    #${MENU_ID}[data-sve-data-menu] {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #${MENU_ID} [data-sve-tw-rows] {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
    }
    /* The search and the tabs keep their height however long the list is. */
    #${MENU_ID} [data-sve-tw-search],
    #${MENU_ID} [data-sve-tw-tabs],
    #${MENU_ID} [data-sve-tw-add-empty] {
      flex: 0 0 auto;
    }
    /* The state popup is the Insert data one: wider than a class menu, same look. */
    #${MENU_ID}[data-sve-data-menu] {
      min-width: 20rem;
      max-width: 20rem;
    }
    #${MENU_ID} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${MENU_ID} [data-sve-tw-option],
    #${MENU_ID} [data-sve-tw-remove] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 0.55em;
      width: 100%;
      padding: 0.4em 0.5em;
      border-radius: 0.4em;
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.5;
    }
    #${MENU_ID} [data-sve-tw-option]:hover,
    #${MENU_ID} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${MENU_ID} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${MENU_ID} [data-sve-tw-option][data-cursor] {
      background: rgba(255,255,255,.1);
    }
    /* The tag menu's Custom: under a line, in the menu's words, not a tag. */
    #${MENU_ID} [data-sve-tw-custom] {
      margin-top: 0.25rem;
      border-top: 1px solid rgba(255,255,255,.08);
      border-radius: 0 0 0.4em 0.4em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${MENU_ID} [data-sve-tw-note] {
      margin: 0.25rem 0;
      padding: 0.4em 0.5em;
      border-radius: 0.4em;
      background: rgba(240,179,126,.12);
      color: #f0b37e;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1.4;
    }
    #${MENU_ID} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${MENU_ID} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${MENU_ID} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${MENU_ID} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${MENU_ID} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${MENU_ID} [data-sve-tw-search] {
      display: flex;
      align-items: center;
      gap: 0.5em;
      box-sizing: border-box;
      height: 2.2rem;
      padding: 0 0.6em;
      margin-bottom: 0.45rem;
      border-radius: 0.45em;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(0,0,0,.28);
    }
    #${MENU_ID} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${MENU_ID} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${MENU_ID} [data-sve-tw-add-input],
    #${MENU_ID} [data-sve-tw-filter-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${MENU_ID} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${MENU_ID} [data-sve-tw-tab] {
      all: unset;
      flex: 1 1 0;
      box-sizing: border-box;
      padding: 0.35em 0;
      border-radius: 0.35em;
      cursor: pointer;
      text-align: center;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 0.6875rem;
      opacity: .65;
    }
    #${MENU_ID} [data-sve-tw-tab]:hover { opacity: 1; }
    #${MENU_ID} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${MENU_ID} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `
  );
}
