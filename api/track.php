<?php
// First-party, cookieless analytics beacon. Always answers 204 so it can never break a page.
require __DIR__ . '/inc/lib.php';
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
http_response_code(204);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !nld_same_origin()) exit;
$raw = file_get_contents('php://input', false, null, 0, 4000);
$p = json_decode((string) $raw, true);
if (!is_array($p)) exit;
try {
  nld_record($p);
  if (random_int(1, 300) === 1) nld_purge();
} catch (Throwable $e) {
  error_log('nld track: ' . $e->getMessage());
}
