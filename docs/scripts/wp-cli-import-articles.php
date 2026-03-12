<?php

if (!defined('ABSPATH')) {
    exit("Run this file through wp eval-file.\n");
}

if (!function_exists('update_field')) {
    exit("ACF is required. update_field() is not available.\n");
}

$repoRoot = dirname(__DIR__);
$defaultBundle = $repoRoot . DIRECTORY_SEPARATOR . 'docs' . DIRECTORY_SEPARATOR . 'acf-import' . DIRECTORY_SEPARATOR . '168innovative-acf-field-groups.json';
$defaultReport = $repoRoot . DIRECTORY_SEPARATOR . 'docs' . DIRECTORY_SEPARATOR . 'acf-import' . DIRECTORY_SEPARATOR . 'backfill' . DIRECTORY_SEPARATOR . 'wp-cli-article-import-report.json';

$options = [
    'mode' => 'dry-run',
    'input' => '',
    'acf' => $defaultBundle,
    'report' => $defaultReport,
    'status' => 'draft',
    'taxonomy_map' => '',
    'limit' => 0,
];

$rawArgs = [];

if (isset($_SERVER['argv']) && is_array($_SERVER['argv'])) {
    $rawArgs = array_merge($rawArgs, $_SERVER['argv']);
}

if (isset($GLOBALS['args']) && is_array($GLOBALS['args'])) {
    $rawArgs = array_merge($rawArgs, $GLOBALS['args']);
}

if (isset($args) && is_array($args)) {
    $rawArgs = array_merge($rawArgs, $args);
}

foreach ($rawArgs as $arg) {
    if ($arg === 'apply' || $arg === '--apply') {
        $options['mode'] = 'apply';
        continue;
    }

    if ($arg === 'dry-run') {
        $options['mode'] = 'dry-run';
        continue;
    }

    if (strpos($arg, '--input=') === 0) {
        $options['input'] = substr($arg, 8);
        continue;
    }

    if (strpos($arg, 'input=') === 0) {
        $options['input'] = substr($arg, 6);
        continue;
    }

    if (strpos($arg, '--acf=') === 0) {
        $options['acf'] = substr($arg, 6);
        continue;
    }

    if (strpos($arg, 'acf=') === 0) {
        $options['acf'] = substr($arg, 4);
        continue;
    }

    if (strpos($arg, '--report=') === 0) {
        $options['report'] = substr($arg, 9);
        continue;
    }

    if (strpos($arg, 'report=') === 0) {
        $options['report'] = substr($arg, 7);
        continue;
    }

    if (strpos($arg, '--status=') === 0) {
        $options['status'] = substr($arg, 9);
        continue;
    }

    if (strpos($arg, 'status=') === 0) {
        $options['status'] = substr($arg, 7);
        continue;
    }

    if (strpos($arg, '--taxonomy-map=') === 0) {
        $options['taxonomy_map'] = substr($arg, 15);
        continue;
    }

    if (strpos($arg, 'taxonomy-map=') === 0) {
        $options['taxonomy_map'] = substr($arg, 13);
        continue;
    }

    if (strpos($arg, '--limit=') === 0) {
        $options['limit'] = max(0, (int) substr($arg, 8));
        continue;
    }

    if (strpos($arg, 'limit=') === 0) {
        $options['limit'] = max(0, (int) substr($arg, 6));
    }
}

function log_line($message)
{
    if (class_exists('WP_CLI')) {
        \WP_CLI::log($message);
        return;
    }

    echo $message . PHP_EOL;
}

function fail_now($message)
{
    if (class_exists('WP_CLI')) {
        \WP_CLI::error($message);
    }

    exit($message . PHP_EOL);
}

function read_json_or_fail($path)
{
    if (!$path || !file_exists($path)) {
        fail_now("File not found: {$path}");
    }

    $content = file_get_contents($path);
    $decoded = json_decode($content, true);

    if (!is_array($decoded)) {
        fail_now("Invalid JSON: {$path}");
    }

    return $decoded;
}

function normalize_text($value)
{
    return is_string($value) ? trim($value) : '';
}

function build_field_key_map(array $bundle)
{
    $map = [];

    foreach ($bundle as $group) {
        $title = $group['title'] ?? null;
        $fields = $group['fields'] ?? [];

        if (!$title || !is_array($fields)) {
            continue;
        }

        foreach ($fields as $field) {
            $name = $field['name'] ?? null;
            $key = $field['key'] ?? null;

            if ($name && $key) {
                $map[$title][$name] = $key;
            }
        }
    }

    return $map;
}

function find_article_by_slug($slug)
{
    $posts = get_posts([
        'post_type' => 'article',
        'name' => $slug,
        'post_status' => ['publish', 'draft', 'pending', 'private', 'future'],
        'numberposts' => 1,
        'fields' => 'ids',
    ]);

    return $posts ? (int) $posts[0] : 0;
}

function file_name_from_url($url)
{
    $path = parse_url((string) $url, PHP_URL_PATH);
    return $path ? basename($path) : '';
}

function file_stem_from_url($url)
{
    return preg_replace('/\.[^.]+$/', '', file_name_from_url($url));
}

function resolve_attachment_id_from_url($url)
{
    $url = normalize_text($url);
    if ($url === '') {
        return 0;
    }

    $attachmentId = attachment_url_to_postid($url);
    if ($attachmentId) {
        return (int) $attachmentId;
    }

    $stem = file_stem_from_url($url);
    if ($stem === '') {
        return 0;
    }

    $attachments = get_posts([
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'name' => sanitize_title($stem),
        'numberposts' => 1,
        'fields' => 'ids',
    ]);

    if ($attachments) {
        return (int) $attachments[0];
    }

    global $wpdb;
    $like = '%' . $wpdb->esc_like(file_name_from_url($url)) . '%';
    $found = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'attachment' AND guid LIKE %s ORDER BY ID DESC LIMIT 1",
            $like
        )
    );

    return $found ? (int) $found : 0;
}

function build_content_blocks($article)
{
    return [
        [
            'acf_fc_layout' => 'rich_text',
            'body_th' => normalize_text($article['content_th'] ?? ''),
            'body_en' => normalize_text($article['content_en'] ?? ''),
        ],
    ];
}

function build_acf_payload($article, $map = [])
{
    return [
        'title_th' => normalize_text($article['title_th'] ?? ''),
        'title_en' => normalize_text($article['title_en'] ?? ''),
        'excerpt_th' => normalize_text($article['excerpt_th'] ?? ''),
        'excerpt_en' => normalize_text($article['excerpt_en'] ?? ''),
        'content_th' => normalize_text($article['content_th'] ?? ''),
        'content_en' => normalize_text($article['content_en'] ?? ''),
        'content_blocks' => build_content_blocks($article),
        'image_alt_th' => normalize_text($article['image_alt_th'] ?? ''),
        'image_alt_en' => normalize_text($article['image_alt_en'] ?? ''),
        'seo_title_th' => normalize_text($article['seo_title_th'] ?? ''),
        'seo_title_en' => normalize_text($article['seo_title_en'] ?? ''),
        'meta_description_th' => normalize_text($article['meta_description_th'] ?? ''),
        'meta_description_en' => normalize_text($article['meta_description_en'] ?? ''),
        'canonical_url_th' => normalize_text($article['canonical_url_th'] ?? ''),
        'canonical_url_en' => normalize_text($article['canonical_url_en'] ?? ''),
        'focus_keyword' => normalize_text($article['focus_keyword'] ?? ''),
        'focus_keyword_th' => normalize_text($article['focus_keyword_th'] ?? ($article['focus_keyword'] ?? '')),
        'focus_keyword_en' => normalize_text($article['focus_keyword_en'] ?? ($article['focus_keyword'] ?? '')),
        'author_name' => normalize_text($map['author_name'] ?? '168 Innovative'),
        'reading_time_minutes' => (int) ($map['reading_time_minutes'] ?? 5),
        'primary_category' => isset($map['primary_category']) ? (int) $map['primary_category'] : '',
        'article_tags' => isset($map['article_tags']) && is_array($map['article_tags']) ? array_values($map['article_tags']) : [],
        'faq_items' => isset($map['faq_items']) && is_array($map['faq_items']) ? array_values($map['faq_items']) : [],
        'related_products' => isset($map['related_products']) && is_array($map['related_products']) ? array_values($map['related_products']) : [],
        'related_articles' => isset($map['related_articles']) && is_array($map['related_articles']) ? array_values($map['related_articles']) : [],
        'robots_index' => array_key_exists('robots_index', $map) ? (int) ((bool) $map['robots_index']) : 1,
        'robots_follow' => array_key_exists('robots_follow', $map) ? (int) ((bool) $map['robots_follow']) : 1,
    ];
}

function update_acf_fields($postId, array $acfPayload, array $fieldKeyMap)
{
    $updated = [];

    foreach ($acfPayload as $fieldName => $value) {
        $fieldKey = $fieldKeyMap[$fieldName] ?? null;

        if (!$fieldKey) {
            continue;
        }

        update_field($fieldKey, $value, $postId);
        $updated[] = $fieldName;
    }

    return $updated;
}

if ($options['input'] === '') {
    fail_now("Missing input=. Example: wp eval-file /path/to/repo/docs/scripts/wp-cli-import-articles.php dry-run input=/path/to/articles.json");
}

$source = read_json_or_fail($options['input']);
$bundle = read_json_or_fail($options['acf']);
$taxonomyMap = $options['taxonomy_map'] ? read_json_or_fail($options['taxonomy_map']) : [];
$fieldKeyMap = build_field_key_map($bundle);
$articleFieldMap = $fieldKeyMap['Article Fields'] ?? [];
$articles = isset($source['articles']) && is_array($source['articles']) ? $source['articles'] : [];

if (!$articles) {
    fail_now("No articles array found in source JSON");
}

$report = [
    'generated_at' => gmdate('c'),
    'mode' => $options['mode'],
    'input' => $options['input'],
    'status' => $options['status'],
    'total' => count($articles),
    'items' => [],
];

$processed = 0;

foreach ($articles as $article) {
    if ($options['limit'] > 0 && $processed >= $options['limit']) {
        break;
    }

    $processed++;
    $slug = normalize_text($article['slug'] ?? '');

    if ($slug === '') {
        $report['items'][] = [
            'action' => 'skipped',
            'reason' => 'Missing slug',
        ];
        continue;
    }

    $map = isset($taxonomyMap[$slug]) && is_array($taxonomyMap[$slug]) ? $taxonomyMap[$slug] : [];
    $existingId = find_article_by_slug($slug);
    $featuredMediaId = resolve_attachment_id_from_url($article['featured_image'] ?? '');

    $postArr = [
        'ID' => $existingId ?: 0,
        'post_type' => 'article',
        'post_status' => $map['status'] ?? $options['status'],
        'post_name' => $slug,
        'post_title' => normalize_text($article['title_en'] ?? ($article['title_th'] ?? $slug)),
        'post_excerpt' => normalize_text($article['excerpt_en'] ?? ($article['excerpt_th'] ?? '')),
        'post_content' => normalize_text($article['content_en'] ?? ($article['content_th'] ?? '')),
    ];

    $acfPayload = build_acf_payload($article, $map);

    if ($options['mode'] !== 'apply') {
        $report['items'][] = [
            'action' => $existingId ? 'would_update' : 'would_create',
            'slug' => $slug,
            'existing_id' => $existingId,
            'post_status' => $postArr['post_status'],
            'featured_media_id' => $featuredMediaId,
            'acf_fields' => array_keys($acfPayload),
            'taxonomy' => [
                'article_category' => isset($map['article_category']) && is_array($map['article_category']) ? array_values($map['article_category']) : [],
                'article_tag' => isset($map['article_tag']) && is_array($map['article_tag']) ? array_values($map['article_tag']) : [],
            ],
        ];
        continue;
    }

    $result = $existingId ? wp_update_post($postArr, true) : wp_insert_post($postArr, true);

    if (is_wp_error($result)) {
        $report['items'][] = [
            'action' => 'failed',
            'slug' => $slug,
            'error' => $result->get_error_message(),
        ];
        continue;
    }

    $postId = (int) $result;

    if ($featuredMediaId > 0) {
      set_post_thumbnail($postId, $featuredMediaId);
    }

    if (isset($map['article_category']) && is_array($map['article_category']) && $map['article_category']) {
        wp_set_object_terms($postId, array_values($map['article_category']), 'article_category', false);
    }

    if (isset($map['article_tag']) && is_array($map['article_tag'])) {
        wp_set_object_terms($postId, array_values($map['article_tag']), 'article_tag', false);
    }

    $updatedFields = update_acf_fields($postId, $acfPayload, $articleFieldMap);

    $report['items'][] = [
        'action' => $existingId ? 'updated' : 'created',
        'slug' => $slug,
        'post_id' => $postId,
        'featured_media_id' => $featuredMediaId,
        'updated_acf_fields' => $updatedFields,
    ];

    log_line(sprintf('[article] %s (%d) %s', $slug, $postId, $existingId ? 'updated' : 'created'));
}

$reportDir = dirname($options['report']);
if (!is_dir($reportDir)) {
    wp_mkdir_p($reportDir);
}

file_put_contents(
    $options['report'],
    json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL
);

log_line('Report written to: ' . $options['report']);
