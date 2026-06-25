<?php
header('Content-Type: application/json');
// Public API; adjust CORS if you want to restrict usage.
header('Access-Control-Allow-Origin: *');

// Simple hardening and caching for preview.php
if (!isset($_GET['url'])) {
    echo json_encode(['error' => 'No URL provided']);
    exit;
}

$url = filter_var($_GET['url'], FILTER_SANITIZE_URL);

// Only allow http and https schemes
if (!preg_match('/^https?:\/\//i', $url) || !filter_var($url, FILTER_VALIDATE_URL)) {
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

// Basic cache in system temp directory
$cacheTtl = 60 * 60 * 12; // 12 hours
// Use site cache directory if available for easier management by site owners.
$siteCacheDir = __DIR__ . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR . 'preview';
$cacheDir = is_dir($siteCacheDir) || @mkdir($siteCacheDir, 0755, true) ? $siteCacheDir : (sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'htmly_preview_cache');
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0700, true);

// Optional domain whitelist (empty = disabled). Populate with hostnames to restrict which hosts may be previewed.
$domainWhitelist = [];
// Example: $domainWhitelist = ['example.com', 'mozilla.org'];

// If whitelist is set, validate the requested URL host
if (!empty($domainWhitelist)) {
    $host = parse_url($url, PHP_URL_HOST);
    $ok = false;
    if ($host) {
        foreach ($domainWhitelist as $allowed) {
            if (stripos($host, $allowed) !== false) { $ok = true; break; }
        }
    }
    if (!$ok) {
        echo json_encode(['error' => 'Domain not allowed']);
        exit;
    }
}
$cacheKey = sha1($url);
$cacheFile = $cacheDir . DIRECTORY_SEPARATOR . $cacheKey . '.json';
if (is_file($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtl)) {
    $out = file_get_contents($cacheFile);
    if ($out) {
        header('X-Preview-Cache: HIT');
        echo $out;
        exit;
    }
}

// Simple garbage collection: remove files older than TTL occasionally (costly but simple);
// run only when a small random chance triggers to avoid running on every request.
if (mt_rand(1, 20) === 1) { // ~5% of requests
    foreach (glob($cacheDir . DIRECTORY_SEPARATOR . '*.json') as $f) {
        if (is_file($f) && (time() - filemtime($f) > $cacheTtl)) @unlink($f);
    }
}

// fetchUrl with cURL primary and fopen fallback; return string or false
function fetchUrl($url) {
    $maxChars = 200000; // limit to first 200KB for parsing

    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language: en-US,en;q=0.5',
            'Accept-Encoding: gzip, deflate',
            'Connection: keep-alive',
            'Upgrade-Insecure-Requests: 1'
        ]);
        $html = curl_exec($ch);
        curl_close($ch);
        if ($html === false) return false;
        if (strlen($html) > $maxChars) $html = substr($html, 0, $maxChars);
        return $html;
    }

    if (ini_get('allow_url_fopen')) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'user_agent' => 'Mozilla/5.0 (compatible; LinkPreview/1.0)'
            ]
        ]);
        $html = @file_get_contents($url, false, $context);
        if ($html === false) return false;
        if (strlen($html) > $maxChars) $html = substr($html, 0, $maxChars);
        return $html;
    }

    return false;
}

$html = fetchUrl($url);
if (!$html) {
    echo json_encode(['error' => 'Could not fetch URL content']);
    exit;
}

// Extract metadata safely and limit lengths
$metadata = [
    'url' => $url,
    'title' => '',
    'description' => '',
    'image' => '',
    'site_name' => ''
];

// Title (prefer Open Graph / Twitter metadata)
if (preg_match('/<meta[^>]+property=["\']og:title["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['title'] = html_entity_decode(trim(strip_tags($m[1])));
} elseif (preg_match('/<meta[^>]+name=["\']twitter:title["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['title'] = html_entity_decode(trim(strip_tags($m[1])));
} elseif (preg_match('/<title>(.*?)<\/title>/is', $html, $m)) {
    $metadata['title'] = html_entity_decode(trim(strip_tags($m[1])));
}

// Description (og:description preferred)
if (preg_match('/<meta[^>]+property=["\']og:description["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['description'] = html_entity_decode(trim(strip_tags($m[1])));
} elseif (preg_match('/<meta[^>]+name=["\']twitter:description["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['description'] = html_entity_decode(trim(strip_tags($m[1])));
} elseif (preg_match('/<meta[^>]+name=["\']description["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['description'] = html_entity_decode(trim(strip_tags($m[1])));
}

// Site name
if (preg_match('/<meta[^>]+property=["\']og:site_name["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['site_name'] = html_entity_decode(trim(strip_tags($m[1])));
}

// Image (og:image / twitter:image / link rel=image_src)
if (preg_match('/<meta[^>]+property=["\']og:image["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['image'] = html_entity_decode(trim($m[1]));
} elseif (preg_match('/<meta[^>]+name=["\']twitter:image["\'][^>]*content=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['image'] = html_entity_decode(trim($m[1]));
} elseif (preg_match('/<link[^>]+rel=["\']image_src["\'][^>]*href=["\'](.*?)["\']/is', $html, $m)) {
    $metadata['image'] = html_entity_decode(trim($m[1]));
}

// Fallback title
if (empty($metadata['title'])) {
    $host = parse_url($url, PHP_URL_HOST);
    $metadata['title'] = $host ? $host : $url;
}

// Sanitize and clamp lengths
foreach (['title' => 200, 'description' => 500, 'image' => 2000, 'site_name' => 100] as $k => $max) {
    if (isset($metadata[$k])) {
        $metadata[$k] = strip_tags($metadata[$k]);
        if (strlen($metadata[$k]) > $max) $metadata[$k] = substr($metadata[$k], 0, $max);
    }
}

$jsonOut = json_encode($metadata);
// attempt to cache
if ($cacheDir) {
    @file_put_contents($cacheFile, $jsonOut);
}

header('X-Preview-Cache: MISS');
echo $jsonOut;
exit;
?>