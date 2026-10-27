<?php

/*
 * Build mode's strings (the left column's Add and Style tabs).
 *
 * Their own file, so Content mode carries none of them: the Control Panel is
 * handed these only while Build is switched on. English is the base; the
 * Danish file follows the CP user's own language, as messages.php does.
 * CSS words stay CSS words in every language (margin, padding, block-start,
 * display, gap …): they are what a designer looks up and what the dock shows.
 */

return [
    // The switch in the Live Preview top bar
    'mode_content' => 'Content',
    'mode_build' => 'Build',

    // Tabs
    'tab_add' => 'Add',
    'tab_style' => 'Style',
    'tab_fields' => 'Fields',
    'tab_settings' => 'Settings',

    // Add
    'elements' => 'Elements',
    'components' => 'Components',
    'search_elements' => 'Search elements…',
    'search_components' => 'Search components…',
    'none_found' => 'Nothing is called “:q”.',
    'group_layout' => 'Layout',
    'group_basic' => 'Basic',
    'group_logic' => 'Logic',
    'group_tags' => 'HTML tags',
    'group_other' => 'Other',
    'insert_into' => 'Inserting into :name',
    'insert_after' => 'Inserting after :name',
    'insert_end' => 'Inserting at the end of the file',
    'insert_locked' => 'This element is locked. Pick another place.',
    'insert_reset' => 'Insert at the selected element instead',
    'columns_title' => 'Choose columns',
    'columns_note' => 'Columns stack on mobile by themselves. Each column gets its own +.',
    'add_note' => 'Click to insert. The element is written into the file the dock has open.',
    'logic_note' => 'Loop and If open the same settings as the dock’s ∞ and if buttons: Field / Collection / Nav, sorting, limit, offset · condition, else if, else.',
    'components_note' => 'Read from :path. A new component shows up here by itself.',
    'components_none' => 'No components yet.',
    'components_loading' => 'Loading components…',

    // What an element is called in the panel
    'el_section' => 'Section',
    'el_container' => 'Container',
    'el_columns' => 'Columns',
    'el_column' => 'Column :n',
    'el_grid' => 'Grid',
    'el_flex' => 'Flex',
    'el_div' => 'Div',
    'el_heading' => 'Heading',
    'el_text' => 'Text',
    'el_button' => 'Button',
    'el_link' => 'Link',
    'el_image' => 'Image',
    'el_video' => 'Video',
    'el_list' => 'List',
    'el_divider' => 'Divider',
    'el_loop' => 'Loop',
    'el_if' => 'If',
    'el_component' => 'Component',

    // The words a new element starts with
    'new_heading' => 'New heading',
    'new_text' => 'Write your text here.',
    'new_button' => 'Read more',
    'new_link' => 'Link',
    'new_item' => 'List item',

    // Style
    'style_empty' => 'Pick an element in the preview or the tree to style it.',
    'size_all' => 'All',
    'size_hint' => 'Changes apply to :size. The same sizes as the Tailwind pane.',
    'size_hint_all' => 'all sizes',
    'group_position' => 'Position',
    'group_size' => 'Size',
    'group_spacing' => 'Spacing',
    'group_typography' => 'Typography',
    'group_background' => 'Background',
    'group_border' => 'Border',
    'group_effects' => 'Effects',
    'group_transform' => 'Transform & transition',
    'transform_later' => 'transform, transition and animation come later.',
    'effects_later' => 'box-shadow and opacity come later.',
    'align_main' => 'Align main axis',
    'align_cross' => 'Align cross axis',
    'link_sides' => 'sides',
    'link_all' => 'all',
    'link_block' => '↕ block',
    'link_inline' => '↔ inline',
    'link_each' => 'Each side on its own',
    'link_title' => 'Link all four sides',
    'box_content' => 'content',
    'box_element' => 'element',
    'value_hint' => 'Type a token (500), a value (10px, 4rem, calc(…)) or a custom property (--gutter). Light text is inherited.',
    'value_menu' => 'The site’s values',
    'classes' => 'Classes on the element',
    'classes_none' => 'None yet',
    'classes_note' => 'Written as Tailwind classes in the file. The dock shows them.',
    'duplicate' => 'Duplicate',
    'delete' => 'Delete',
    'own_class' => 'Class',
    'this_element' => 'This element',
    'fields_note' => 'The component has its own fields. Its design lives in :path.',
    'settings_note' => 'The same settings as in the HTML tree.',
    'later' => 'later',
    'close' => 'Close',
];
