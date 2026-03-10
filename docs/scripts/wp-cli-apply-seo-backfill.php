<?php

if (!defined('ABSPATH')) {
    exit("Run this file through wp eval-file.\n");
}

if (!function_exists('update_field')) {
    exit("ACF is required. update_field() is not available.\n");
}

$repoRoot = dirname(__DIR__);
$defaultPlan = $repoRoot . DIRECTORY_SEPARATOR . 'docs' . DIRECTORY_SEPARATOR . 'acf-import' . DIRECTORY_SEPARATOR . 'backfill' . DIRECTORY_SEPARATOR . 'wp-seo-backfill-plan.json';
$defaultBundle = $repoRoot . DIRECTORY_SEPARATOR . 'docs' . DIRECTORY_SEPARATOR . 'acf-import' . DIRECTORY_SEPARATOR . '168innovative-acf-field-groups.json';
$defaultReport = $repoRoot . DIRECTORY_SEPARATOR . 'docs' . DIRECTORY_SEPARATOR . 'acf-import' . DIRECTORY_SEPARATOR . 'backfill' . DIRECTORY_SEPARATOR . 'wp-cli-apply-result.json';

$options = [
    'plan' => $defaultPlan,
    'acf' => $defaultBundle,
    'report' => $defaultReport,
    'apply' => false,
    'include' => ['products', 'categories', 'articles', 'about', 'home'],
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
    if ($arg === '--apply') {
        $options['apply'] = true;
        continue;
    }

    if ($arg === 'apply') {
        $options['apply'] = true;
        continue;
    }

    if ($arg === 'dry-run') {
        $options['apply'] = false;
        continue;
    }

    if (strpos($arg, '--plan=') === 0) {
        $options['plan'] = substr($arg, 7);
        continue;
    }

    if (strpos($arg, 'plan=') === 0) {
        $options['plan'] = substr($arg, 5);
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

    if (strpos($arg, '--include=') === 0) {
        $value = substr($arg, 10);
        $options['include'] = array_values(array_filter(array_map('trim', explode(',', $value))));
        continue;
    }

    if (strpos($arg, 'include=') === 0) {
        $value = substr($arg, 8);
        $options['include'] = array_values(array_filter(array_map('trim', explode(',', $value))));
        continue;
    }

    if (strpos($arg, '--limit=') === 0) {
        $options['limit'] = max(0, (int) substr($arg, 8));
        continue;
    }

    if (strpos($arg, 'limit=') === 0) {
        $options['limit'] = max(0, (int) substr($arg, 6));
        continue;
    }

    if (ctype_digit((string) $arg)) {
        $options['limit'] = max(0, (int) $arg);
    }
}

function read_json_file_or_fail($path)
{
    if (!file_exists($path)) {
        exit("File not found: {$path}\n");
    }

    $content = file_get_contents($path);
    $decoded = json_decode($content, true);

    if (!is_array($decoded)) {
        exit("Invalid JSON: {$path}\n");
    }

    return $decoded;
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

            if (!$name || !$key) {
                continue;
            }

            $map[$title][$name] = $key;
        }
    }

    return $map;
}

function section_to_group_title($section)
{
    $map = [
        'products' => 'Product Fields',
        'categories' => 'Product Category Fields',
        'articles' => 'Article Fields',
        'about' => 'About Fields',
        'home' => 'Home - Hero Section',
    ];

    return $map[$section] ?? null;
}

function endpoint_to_object_id($endpoint, $id)
{
    switch ($endpoint) {
        case 'product_category':
            return "product_category_{$id}";
        default:
            return (int) $id;
    }
}

function metadata_context($endpoint)
{
    switch ($endpoint) {
        case 'product_category':
            return ['type' => 'term', 'taxonomy' => 'product_category'];
        default:
            return ['type' => 'post', 'taxonomy' => null];
    }
}

function value_is_missing($endpoint, $id, $fieldName)
{
    $context = metadata_context($endpoint);
    $type = $context['type'];

    if (!metadata_exists($type, $id, $fieldName)) {
        return true;
    }

    $raw = get_metadata($type, $id, $fieldName, true);

    if (is_array($raw)) {
        return empty($raw);
    }

    if ($raw === null) {
        return true;
    }

    if (is_string($raw)) {
        return trim($raw) === '';
    }

    return false;
}

function normalize_patch_value($value)
{
    if (is_bool($value)) {
        return $value ? 1 : 0;
    }

    return $value;
}

function log_line($message)
{
    if (class_exists('WP_CLI')) {
        \WP_CLI::log($message);
        return;
    }

    echo $message . PHP_EOL;
}

$plan = read_json_file_or_fail($options['plan']);
$bundle = read_json_file_or_fail($options['acf']);
$fieldKeyMap = build_field_key_map($bundle);

$selectedSections = [];
foreach ($options['include'] as $section) {
    if (!isset($plan['patches'][$section])) {
        log_line("Skip unknown section: {$section}");
        continue;
    }

    $selectedSections[$section] = $plan['patches'][$section];
}

$processed = 0;
$applied = [];
$skipped = [];
$failed = [];

log_line($options['apply'] ? 'Mode: APPLY' : 'Mode: DRY-RUN');
log_line('Plan: ' . $options['plan']);
log_line('ACF bundle: ' . $options['acf']);

foreach ($selectedSections as $section => $items) {
    $groupTitle = section_to_group_title($section);

    if (!$groupTitle || empty($fieldKeyMap[$groupTitle])) {
        $failed[] = [
            'section' => $section,
            'error' => "No field key map for group: {$groupTitle}",
        ];
        continue;
    }

    foreach ($items as $item) {
        if ($options['limit'] > 0 && $processed >= $options['limit']) {
            break 2;
        }

        $processed++;
        $endpoint = $item['endpoint'] ?? '';
        $entityId = (int) ($item['id'] ?? 0);
        $slug = $item['slug'] ?? '';
        $patch = $item['patch'] ?? [];
        $objectId = endpoint_to_object_id($endpoint, $entityId);

        if (!$entityId || !is_array($patch) || !$patch) {
            $skipped[] = [
                'section' => $section,
                'id' => $entityId,
                'slug' => $slug,
                'reason' => 'Empty patch or invalid item',
            ];
            continue;
        }

        $itemApplied = [];
        $itemSkipped = [];

        foreach ($patch as $fieldName => $value) {
            $fieldKey = $fieldKeyMap[$groupTitle][$fieldName] ?? null;

            if (!$fieldKey) {
                $itemSkipped[] = [
                    'field' => $fieldName,
                    'reason' => 'Field key not found in ACF bundle',
                ];
                continue;
            }

            if (!value_is_missing($endpoint, $entityId, $fieldName)) {
                $itemSkipped[] = [
                    'field' => $fieldName,
                    'reason' => 'Already has a saved value',
                ];
                continue;
            }

            $normalizedValue = normalize_patch_value($value);

            if (!$options['apply']) {
                $itemApplied[] = [
                    'field' => $fieldName,
                    'field_key' => $fieldKey,
                    'value' => $normalizedValue,
                ];
                continue;
            }

            $result = update_field($fieldKey, $normalizedValue, $objectId);

            if ($result === false) {
                $itemSkipped[] = [
                    'field' => $fieldName,
                    'reason' => 'update_field returned false',
                ];
                continue;
            }

            $itemApplied[] = [
                'field' => $fieldName,
                'field_key' => $fieldKey,
            ];
        }

        if ($itemApplied) {
            $applied[] = [
                'section' => $section,
                'endpoint' => $endpoint,
                'id' => $entityId,
                'slug' => $slug,
                'object_id' => $objectId,
                'fields' => $itemApplied,
            ];
            log_line(sprintf('[%s] %s (%d): %d field(s)', $section, $slug, $entityId, count($itemApplied)));
        }

        if ($itemSkipped) {
            $skipped[] = [
                'section' => $section,
                'endpoint' => $endpoint,
                'id' => $entityId,
                'slug' => $slug,
                'fields' => $itemSkipped,
            ];
        }
    }
}

$report = [
    'generated_at' => gmdate('c'),
    'mode' => $options['apply'] ? 'apply' : 'dry-run',
    'plan' => $options['plan'],
    'acf_bundle' => $options['acf'],
    'processed_items' => $processed,
    'applied_count' => count($applied),
    'skipped_count' => count($skipped),
    'failed_count' => count($failed),
    'applied' => $applied,
    'skipped' => $skipped,
    'failed' => $failed,
];

$reportDir = dirname($options['report']);
if (!is_dir($reportDir)) {
    wp_mkdir_p($reportDir);
}

file_put_contents(
    $options['report'],
    json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL
);

log_line('Report written to: ' . $options['report']);
log_line(sprintf(
    'Summary: processed=%d applied=%d skipped=%d failed=%d',
    $report['processed_items'],
    $report['applied_count'],
    $report['skipped_count'],
    $report['failed_count']
));
