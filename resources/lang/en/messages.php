<?php

/*
 * Every string the visual editor puts on screen.
 *
 * English is the base; a translation is picked by the Control Panel user's own
 * language preference (User::preferredLocale()), so the editor speaks whatever
 * the CP speaks. Anything missing from a translation falls back to here.
 */

return [
    // Hover control on a section / an orderable row
    'move_up' => 'Move up',
    'move_down' => 'Move down',
    'move_left' => 'Move left',
    'move_right' => 'Move right',
    'drag_section' => 'Drag to move the section',
    'drag_columns' => 'Drag to change the column widths',
    'add_another' => 'Add another',
    'remove_this' => 'Remove this one',
    'section_settings' => 'Settings for this section',
    'save_as_template' => 'Save section as a template',
    'add_section_below' => 'Add a section below this one',
    'remove_section' => 'Remove this section',
    'add_column' => 'Add column',
    'save_enter' => 'Save (Enter)',

    // Global (synced) sections
    'global_badge' => 'Global — synced',
    'global_bar' => 'You are inside a :section — edit it here; changes apply to every page',
    'global_bar_section' => 'global section',
    'global_panel_title' => 'Global section',
    'global_panel_note' => '— changes apply to every page',
    'save_global_section' => 'Save the global section',

    // Section library
    'sections' => 'Sections',
    'library_hint' => 'Drag a section onto the page — or click to add it at the end.',
    'tab_page' => 'Page',
    'tab_custom' => 'Custom',
    'tab_global' => 'Global',
    'no_preview' => 'No preview',
    'no_section_types' => 'No section types.',
    'loading' => 'Loading…',
    'no_saved_sections' => 'No saved sections yet. Save one to see it here.',
    'no_global_sections' => 'No global sections yet. Save a section as synced.',
    'saved_sections_failed' => 'Could not load the saved sections.',

    // "Save section as a template" dialog
    'save_section' => 'Save section',
    'save_section_heading' => 'Save section as a template',
    'name' => 'Name',
    'name_placeholder' => 'e.g. Contact CTA',
    'synced_hint' => 'Synced — changes apply everywhere (otherwise inserted as a copy)',
    'cancel' => 'Cancel',
    'saved_toast' => 'Section ":name" saved',
    'save_failed' => 'Could not save the section',

    // Live Preview chrome
    'all_sections' => 'All sections',
    'globals' => 'Globals…',
    'save_globals' => 'Save global settings',
    'back_to_site' => 'Back to the site',
    'back_to_site_title' => 'Leave the editor and go back to the live site',
    'back_to_admin' => 'Back to admin',
    'back_to_admin_title' => 'Close Live Preview and return to the Control Panel',
    'back_save_and_leave' => 'Save and go back',
    'back_save_and_close' => 'Save and close',
    'back_save_publish_and_leave' => 'Save, publish and go back',
    'back_save_publish_and_close' => 'Save, publish and close',
    'back_save_only' => 'Save changes',
    'back_leave_only' => 'Go back without saving',
    'back_close_only' => 'Close without saving',
    'collection' => 'Collection',
    'choose_entry' => 'Choose a page…',
    'new_entry' => 'New',
    'new_in' => 'Create a new entry in :collection',
    'no_preview_collection' => 'no preview',
    'no_preview_hint' => ':collection has no route, so its entries have no page to preview — it opens in the normal editor.',
    'unsaved_title' => 'You have unsaved changes',
    'unsaved_body' => 'Do you want to save them before leaving this page?',
    'unsaved_save' => 'Save and continue',
    'unsaved_discard' => 'Continue without saving',
    'saving' => 'Saving…',
    'publishing' => 'Publishing…',
    'save' => 'Save',
    'close' => 'Close',
    'tab_templates' => 'Templates',
    'save_page_as_template' => 'Save this page as a template',
    'template_name' => 'e.g. Campaign page',
    'template_saved' => ':name saved as a template.',
    'template_needs_sections' => 'This page has no sections to save.',
    'template_empty' => 'That template has no sections in it.',
    'no_templates' => 'No templates saved yet. Build a page, then save it here.',
    'templates_failed' => 'The templates could not be loaded.',
    'template_count' => ':count sections',
    'template_mode_body' => 'This template has :count sections. Replace what is on the page, or add them to it?',
    'template_replace' => 'Replace all sections',
    'template_append' => 'Add to the page',
    'title' => 'Title',
    'slug' => 'Slug',
    'create' => 'Create',
    'create_failed' => 'The page could not be created.',
    'slug_taken' => 'The slug “:slug” is already used in this collection.',
    'slug_invalid' => 'That title gives an empty slug — please write one.',
    'panel' => 'Page settings',
    'pages' => 'Pages',
];
