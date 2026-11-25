<?php
// Website consultation / appointment form -> email. Runs on Hostinger (public_html/api/contact.php).
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function done($code, $ok, $msg = '') {
  http_response_code($code);
  echo json_encode(['ok' => $ok, 'error' => $msg]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') done(405, false, 'Method not allowed');

// Same-site requests only.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
  $oh = parse_url($origin, PHP_URL_HOST);
  $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
  if (!$oh || strcasecmp($oh, $host) !== 0) done(403, false, 'Forbidden');
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$d = json_decode($raw, true);
if (!is_array($d)) done(400, false, 'Bad request');

function field($d, $k, $max) {
  $v = isset($d[$k]) && is_string($d[$k]) ? trim($d[$k]) : '';
  return mb_substr($v, 0, $max);
}
// Strip anything that could inject mail headers.
function oneLine($s) { return trim(preg_replace('/[\r\n\t\0]+/', ' ', $s)); }

// Honeypot: bots fill it, people never see it. Pretend success.
if (field($d, 'website', 200) !== '') done(200, true);

$name    = oneLine(field($d, 'name', 120));
$email   = oneLine(field($d, 'email', 160));
$phone   = oneLine(field($d, 'phone', 40));
$kind    = field($d, 'kind', 20) === 'appointment' ? 'Appointment request' : 'Free consultation request';
$license = oneLine(field($d, 'license', 120));
$when    = oneLine(field($d, 'when', 160));
$message = field($d, 'message', 5000);
$page    = oneLine(field($d, 'page', 300));

if ($name === '' || $message === '') done(422, false, 'Please enter your name and a message.');
if ($email === '' && $phone === '') done(422, false, 'Please enter a phone number or an email address.');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) done(422, false, 'Please enter a valid email address.');

// Simple per-visitor limit: 5 messages an hour.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rl = sys_get_temp_dir() . '/nld-contact-' . md5($ip);
$hits = [];
if (is_file($rl)) {
  $hits = array_filter(array_map('intval', explode("\n", (string) @file_get_contents($rl))), function ($t) { return $t > time() - 3600; });
}
if (count($hits) >= 5) done(429, false, 'Too many messages. Please call 702.893.4777.');
$hits[] = time();
@file_put_contents($rl, implode("\n", $hits), LOCK_EX);

$to = 'info@nevadalicensedefense.com';
$subject = "$kind from $name (nevadalicensedefense.com)";
$body = "$kind\n\n"
  . "Name: $name\n"
  . "Phone: " . ($phone !== '' ? $phone : '-') . "\n"
  . "Email: " . ($email !== '' ? $email : '-') . "\n"
  . "License / board: " . ($license !== '' ? $license : '-') . "\n"
  . "Preferred day/time: " . ($when !== '' ? $when : '-') . "\n\n"
  . "Message:\n$message\n\n"
  . "--\nSent from: " . ($page !== '' ? $page : 'website') . "\n"
  . "Time: " . gmdate('Y-m-d H:i') . " UTC\n";

$headers = [
  'From: Nevada License Defense Website <info@nevadalicensedefense.com>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
];
if ($email !== '') $headers[] = 'Reply-To: ' . $email;

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-finfo@nevadalicensedefense.com');
if (!$sent) done(500, false, 'We could not send your message. Please call 702.893.4777.');
done(200, true);
