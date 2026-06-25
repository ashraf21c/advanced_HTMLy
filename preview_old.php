<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_GET['url'])) {
    echo json_encode(['error' => 'No URL provided']);
    exit;
}

$url = filter_var($_GET['url'], FILTER_SANITIZE_URL);

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

function fetchUrl($url) {
    // Method 1: Try cURL first (more reliable)
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        $html = curl_exec($ch);
        curl_close($ch);
        return $html;
    }
    
    // Method 2: Try file_get_contents if allow_url_fopen is enabled
    if (ini_get('allow_url_fopen')) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ]
        ]);
        return file_get_contents($url, false, $context);
    }
    
    return false;
}

$html = fetchUrl($url);

if (!$html) {
    echo json_encode(['error' => 'Could not fetch URL content']);
    exit;
}

// Extract metadata
$metadata = [
    'url' => $url,
    'title' => '',
    'description' => '',
    'image' => ''
];

// Extract title
preg_match('/<title>(.*?)<\/title>/i', $html, $titleMatches);
if ($titleMatches) {
    $metadata['title'] = html_entity_decode(trim($titleMatches[1]));
}

// Extract description
preg_match('/<meta name="description" content="(.*?)"/i', $html, $descMatches);
if (!$descMatches) {
    preg_match('/<meta property="og:description" content="(.*?)"/i', $html, $descMatches);
}
if ($descMatches) {
    $metadata['description'] = html_entity_decode(trim($descMatches[1]));
}

// Extract image
preg_match('/<meta property="og:image" content="(.*?)"/i', $html, $imageMatches);
if (!$imageMatches) {
    preg_match('/<meta name="twitter:image" content="(.*?)"/i', $html, $imageMatches);
}
if ($imageMatches) {
    $metadata['image'] = html_entity_decode(trim($imageMatches[1]));
}

// If no title found, use URL as fallback
if (empty($metadata['title'])) {
    $metadata['title'] = parse_url($url, PHP_URL_HOST);
}

echo json_encode($metadata);
?>