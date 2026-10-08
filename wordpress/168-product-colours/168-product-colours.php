<?php
/**
 * Plugin Name: 168 Product Colours
 * Description: Colour names and images for the existing product post type and headless storefront.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) exit;
add_action('add_meta_boxes_product', function () {
    add_meta_box('168-product-colours', 'สีและรูปสินค้า / Colour images', 'innovative_colour_box', 'product', 'normal', 'default');
});
function innovative_colour_box($post) {
    wp_nonce_field('innovative_save_colours', 'innovative_colours_nonce');
    $rows = get_post_meta($post->ID, '_168_product_colours', true);
    if (!is_array($rows)) $rows = array();
    echo '<p>เพิ่มชื่อสีและรูปของสินค้ารุ่นนี้ สีที่ไม่มีรูปจะไม่แสดงบนเว็บไซต์</p><div id="innovative-colours"></div><button type="button" class="button" id="innovative-add-colour">เพิ่มสี</button>';
    echo '<script type="application/json" id="innovative-colours-data">' . wp_json_encode($rows, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . '</script>';
}
add_action('admin_enqueue_scripts', function () {
    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'product' || $screen->base !== 'post') return;
    wp_enqueue_media();
    wp_enqueue_script('168-product-colours', plugins_url('admin.js', __FILE__), array('jquery'), '1.0.0', true);
    wp_enqueue_style('168-product-colours', plugins_url('admin.css', __FILE__), array(), '1.0.0');
});
add_action('save_post_product', function ($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id) || !current_user_can('edit_post', $post_id)) return;
    if (!isset($_POST['innovative_colours_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['innovative_colours_nonce'])), 'innovative_save_colours')) return;
    $input = isset($_POST['innovative_colours']) && is_array($_POST['innovative_colours']) ? wp_unslash($_POST['innovative_colours']) : array();
    $rows = array(); $seen = array();
    foreach (array_slice($input, 0, 100) as $row) {
        if (!is_array($row)) continue;
        $th = sanitize_text_field($row['name_th'] ?? '');
        $en = sanitize_text_field($row['name_en'] ?? '');
        if (!$th && !$en) continue;
        $id = sanitize_key($row['id'] ?? '');
        if (!$id || isset($seen[$id])) $id = wp_generate_uuid4();
        $seen[$id] = true;
        $attachment = absint($row['attachment_id'] ?? 0);
        if ($attachment && !wp_attachment_is_image($attachment)) $attachment = 0;
        $rows[] = array('id'=>$id, 'name_th'=>$th, 'name_en'=>$en, 'hex'=>sanitize_hex_color($row['hex'] ?? '') ?: '', 'attachment_id'=>$attachment, 'image_url'=>$attachment ? wp_get_attachment_url($attachment) : '');
    }
    update_post_meta($post_id, '_168_product_colours', $rows);
});
add_action('rest_api_init', function () {
    register_rest_field('product', 'colour_images', array(
        'get_callback' => function ($post) {
            $rows = get_post_meta($post['id'], '_168_product_colours', true);
            if (!is_array($rows)) return array();
            foreach ($rows as &$row) {
                $row['image_url'] = !empty($row['attachment_id']) ? (wp_get_attachment_url($row['attachment_id']) ?: '') : '';
                unset($row['attachment_id']);
            }
            return $rows;
        },
        'schema' => array('type'=>'array', 'readonly'=>true, 'context'=>array('view','edit'), 'items'=>array('type'=>'object')),
    ));
});
