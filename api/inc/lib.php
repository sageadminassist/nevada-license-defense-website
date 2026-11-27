<?php
/*
 * Shared backend for nevadalicensedefense.com: database, settings, analytics recording.
 *
 * Nothing secret lives in this file or anywhere under public_html. The SQLite database,
 * the PHP session files and the auto-generated hashing secret all live in a private
 * folder ONE LEVEL ABOVE public_html (…/nld-private), which the web server never serves.
 */
if (!defined('NLD_LIB')) define('NLD_LIB', 1);
date_default_timezone_set('America/Los_Angeles');

function nld_private_dir() {
  $env = getenv('NLD_PRIVATE_DIR');
  // public_html/api/inc -> three levels up is the folder that CONTAINS public_html.
  return $env ? rtrim($env, '/') : dirname(__DIR__, 3) . '/nld-private';
}

/** Returns the PDO handle, or null when the database cannot be opened (site keeps working). */
function nld_db() {
  static $pdo = false;
  if ($pdo !== false) return $pdo;
  $pdo = null;
  try {
    if (!extension_loaded('pdo_sqlite')) return null;
    $dir = nld_private_dir();
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    if (!is_dir($dir) || !is_writable($dir)) return null;
    // Belt and braces in case someone ever points the web root at the parent folder.
    if (!is_file("$dir/.htaccess")) @file_put_contents("$dir/.htaccess", "Require all denied\n");
    $db = new PDO('sqlite:' . $dir . '/nld.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $db->exec('PRAGMA journal_mode=WAL');
    $db->exec('PRAGMA busy_timeout=3000');
    $db->exec('PRAGMA synchronous=NORMAL');
    nld_migrate($db);
    $pdo = $db;
  } catch (Throwable $e) {
    error_log('nld db: ' . $e->getMessage());
    $pdo = null;
  }
  return $pdo;
}

function nld_migrate(PDO $db) {
  $v = (int) $db->query('PRAGMA user_version')->fetchColumn();
  if ($v < 2) {
    // Replies sent to a lead from the admin inbox.
    $db->exec('CREATE TABLE IF NOT EXISTS lead_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER NOT NULL, ts INTEGER NOT NULL,
      subject TEXT NOT NULL DEFAULT \'\', body TEXT NOT NULL DEFAULT \'\', ok INTEGER NOT NULL DEFAULT 0)');
    $db->exec('CREATE INDEX IF NOT EXISTS lr_lead ON lead_replies(lead_id)');
    if ($v >= 1) $db->exec('PRAGMA user_version = 2');
  }
  if ($v >= 1) return;
  $db->exec('CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  $db->exec('CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts INTEGER NOT NULL, day TEXT NOT NULL,
    type TEXT NOT NULL, name TEXT NOT NULL DEFAULT \'\',
    visitor TEXT NOT NULL, session TEXT NOT NULL DEFAULT \'\',
    path TEXT NOT NULL DEFAULT \'/\',
    ref_host TEXT NOT NULL DEFAULT \'\', source TEXT NOT NULL DEFAULT \'\', medium TEXT NOT NULL DEFAULT \'\',
    campaign TEXT NOT NULL DEFAULT \'\', term TEXT NOT NULL DEFAULT \'\', content TEXT NOT NULL DEFAULT \'\',
    device TEXT NOT NULL DEFAULT \'\', browser TEXT NOT NULL DEFAULT \'\', os TEXT NOT NULL DEFAULT \'\',
    screen TEXT NOT NULL DEFAULT \'\', lang TEXT NOT NULL DEFAULT \'\',
    target TEXT NOT NULL DEFAULT \'\', meta TEXT NOT NULL DEFAULT \'\',
    is_entry INTEGER NOT NULL DEFAULT 0)');
  $db->exec('CREATE INDEX IF NOT EXISTS ev_day ON events(day, type, name)');
  $db->exec('CREATE INDEX IF NOT EXISTS ev_visitor ON events(visitor, day)');
  $db->exec('CREATE INDEX IF NOT EXISTS ev_session ON events(session)');
  $db->exec('CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts INTEGER NOT NULL, day TEXT NOT NULL,
    kind TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL DEFAULT \'\', phone TEXT NOT NULL DEFAULT \'\',
    license TEXT NOT NULL DEFAULT \'\', pref_when TEXT NOT NULL DEFAULT \'\', message TEXT NOT NULL DEFAULT \'\',
    page TEXT NOT NULL DEFAULT \'\',
    source TEXT NOT NULL DEFAULT \'\', medium TEXT NOT NULL DEFAULT \'\', campaign TEXT NOT NULL DEFAULT \'\',
    landing TEXT NOT NULL DEFAULT \'\', device TEXT NOT NULL DEFAULT \'\',
    status TEXT NOT NULL DEFAULT \'new\', notes TEXT NOT NULL DEFAULT \'\', handled_at INTEGER,
    mail_ok INTEGER NOT NULL DEFAULT 0)');
  $db->exec('CREATE INDEX IF NOT EXISTS leads_day ON leads(day)');
  $db->exec('CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, who TEXT NOT NULL, ok INTEGER NOT NULL)');
  $db->exec('CREATE INDEX IF NOT EXISTS la_ts ON login_attempts(ts)');
  $db->exec('PRAGMA user_version = 1');
}

function nld_setting($k, $default = null) {
  $db = nld_db();
  if (!$db) return $default;
  $st = $db->prepare('SELECT v FROM settings WHERE k = ?');
  $st->execute([$k]);
  $v = $st->fetchColumn();
  return $v === false ? $default : $v;
}
function nld_set_setting($k, $v) {
  $db = nld_db();
  if (!$db) return false;
  if ($v === null) return $db->prepare('DELETE FROM settings WHERE k = ?')->execute([$k]);
  return $db->prepare('INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v')->execute([$k, (string) $v]);
}

/** Random server-side secret, created on first use and kept only in the private database. */
function nld_secret() {
  $s = nld_setting('secret');
  if (!$s) { $s = bin2hex(random_bytes(32)); nld_set_setting('secret', $s); }
  return $s;
}

function nld_ip() {
  $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
  return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}
/** Anonymous visitor id that changes every day. The raw IP address is never stored. */
function nld_visitor_hash() {
  return substr(hash('sha256', date('Y-m-d') . '|' . nld_secret() . '|' . nld_ip() . '|' . ($_SERVER['HTTP_USER_AGENT'] ?? '')), 0, 24);
}
function nld_is_bot($ua) {
  if (trim((string) $ua) === '') return true;
  return (bool) preg_match('~bot|crawl|spider|slurp|bingpreview|facebookexternal|headless|phantom|python|curl/|wget|monitor|uptime|pingdom|lighthouse|gtmetrix|ahrefs|semrush|preview|scrap|http-client|okhttp|go-http|java/|libwww|axios|node-fetch|gpt|claude|perplexity|bytespider~i', (string) $ua);
}
function nld_wants_no_tracking() {
  return ($_SERVER['HTTP_DNT'] ?? '') === '1' || ($_SERVER['HTTP_SEC_GPC'] ?? '') === '1';
}
/** Same-site check for POSTs coming from the browser. */
function nld_same_origin() {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin === '') return true;
  $oh = parse_url($origin, PHP_URL_HOST);
  $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
  return $oh && strcasecmp($oh, $host) === 0;
}

function nld_parse_ua($ua) {
  $l = strtolower((string) $ua);
  $tablet = strpos($l, 'ipad') !== false || strpos($l, 'tablet') !== false || (strpos($l, 'android') !== false && strpos($l, 'mobile') === false);
  $mobile = strpos($l, 'mobi') !== false || strpos($l, 'iphone') !== false || strpos($l, 'ipod') !== false;
  $device = $tablet ? 'Tablet' : ($mobile ? 'Mobile' : 'Desktop');

  if (strpos($l, 'iphone') !== false || strpos($l, 'ipad') !== false || strpos($l, 'ipod') !== false) $os = 'iOS';
  elseif (strpos($l, 'android') !== false) $os = 'Android';
  elseif (strpos($l, 'windows') !== false) $os = 'Windows';
  elseif (strpos($l, 'cros') !== false) $os = 'ChromeOS';
  elseif (strpos($l, 'mac os') !== false || strpos($l, 'macintosh') !== false) $os = 'macOS';
  elseif (strpos($l, 'linux') !== false) $os = 'Linux';
  else $os = 'Other';

  if (strpos($l, 'edg') !== false) $browser = 'Edge';
  elseif (strpos($l, 'opr/') !== false || strpos($l, 'opera') !== false) $browser = 'Opera';
  elseif (strpos($l, 'firefox') !== false || strpos($l, 'fxios') !== false) $browser = 'Firefox';
  elseif (strpos($l, 'samsungbrowser') !== false) $browser = 'Samsung Internet';
  elseif (strpos($l, 'chrome') !== false || strpos($l, 'crios') !== false) $browser = 'Chrome';
  elseif (strpos($l, 'safari') !== false) $browser = 'Safari';
  else $browser = 'Other';
  return [$device, $browser, $os];
}

/** [source, medium] from the referring site and any UTM tags. */
function nld_classify_source($refHost, $utmSource, $utmMedium) {
  $utmSource = trim((string) $utmSource);
  $utmMedium = trim((string) $utmMedium);
  if ($utmSource !== '') return [mb_substr(strtolower($utmSource), 0, 80), $utmMedium !== '' ? mb_substr(strtolower($utmMedium), 0, 40) : 'campaign'];
  $h = preg_replace('~^www\.~', '', strtolower((string) $refHost));
  if ($h === '') return ['Direct', 'direct'];
  $search = ['google' => 'Google', 'bing' => 'Bing', 'duckduckgo' => 'DuckDuckGo', 'yahoo' => 'Yahoo', 'ecosia' => 'Ecosia', 'yandex' => 'Yandex', 'baidu' => 'Baidu', 'brave' => 'Brave', 'startpage' => 'Startpage'];
  foreach ($search as $n => $name) if (strpos($h, $n) !== false) return [$name, 'search'];
  $ai = ['chatgpt' => 'ChatGPT', 'openai' => 'ChatGPT', 'perplexity' => 'Perplexity', 'claude.ai' => 'Claude', 'gemini' => 'Gemini', 'copilot' => 'Copilot'];
  foreach ($ai as $n => $name) if (strpos($h, $n) !== false) return [$name, 'ai'];
  $social = ['instagram' => 'Instagram', 't.co' => 'Twitter/X', 'twitter' => 'Twitter/X', 'x.com' => 'Twitter/X', 'facebook' => 'Facebook', 'fb.com' => 'Facebook', 'tiktok' => 'TikTok', 'reddit' => 'Reddit', 'youtube' => 'YouTube', 'youtu.be' => 'YouTube', 'linkedin' => 'LinkedIn', 'lnkd.in' => 'LinkedIn', 'nextdoor' => 'Nextdoor', 'yelp' => 'Yelp', 'avvo' => 'Avvo'];
  foreach ($social as $n => $name) if (strpos($h, $n) !== false) return [$name, 'social'];
  $sister = ['craigperry.com' => 'craigperry.com', 'lvnurseattorney.com' => 'lvnurseattorney.com'];
  foreach ($sister as $n => $name) if (strpos($h, $n) !== false) return [$name, 'sister site'];
  return [mb_substr($h, 0, 80), 'referral'];
}

function nld_clean_path($p) {
  $p = explode('#', explode('?', (string) $p)[0])[0];
  if ($p === '' || $p[0] !== '/') $p = '/' . $p;
  if (strlen($p) > 1) $p = rtrim($p, '/');
  $p = preg_replace('/[\x00-\x1f\x7f]/', '', $p);
  return mb_substr($p === '' ? '/' : $p, 0, 200);
}
function nld_str($v, $max) {
  if (!is_string($v) && !is_int($v) && !is_float($v)) return '';
  return mb_substr(trim(preg_replace('/[\x00-\x1f\x7f]+/u', ' ', (string) $v) ?? ''), 0, $max);
}

const NLD_EVENT_NAMES = ['call_click', 'email_click', 'consult_open', 'consult_submit', 'faq_open', 'faq_question', 'outbound', 'search'];

/** Store one beacon from the browser. Returns true when a row was written. */
function nld_record(array $p) {
  $db = nld_db();
  if (!$db) return false;
  $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
  if (nld_is_bot($ua) || nld_wants_no_tracking()) return false;

  $type = ($p['t'] ?? '') === 'event' ? 'event' : 'pageview';
  $name = '';
  if ($type === 'event') {
    $name = nld_str($p['n'] ?? '', 30);
    if (!in_array($name, NLD_EVENT_NAMES, true)) return false;
  }
  $visitor = nld_visitor_hash();
  $day = date('Y-m-d');

  // Flood guard: one visitor cannot write more than 400 rows a day.
  $st = $db->prepare('SELECT COUNT(*) FROM events WHERE visitor = ? AND day = ?');
  $st->execute([$visitor, $day]);
  if ((int) $st->fetchColumn() >= 400) return false;

  [$device, $browser, $os] = nld_parse_ua($ua);
  $refHost = '';
  if (!empty($p['r']) && is_string($p['r'])) { $rh = parse_url($p['r'], PHP_URL_HOST); if ($rh) $refHost = strtolower($rh); }
  $self = preg_replace('/:\d+$/', '', strtolower($_SERVER['HTTP_HOST'] ?? ''));
  $strip = function ($h) { return preg_replace('~^www\.~', '', $h); };
  if ($refHost !== '' && $strip($refHost) === $strip($self)) $refHost = '';
  [$source, $medium] = nld_classify_source($refHost, $p['us'] ?? '', $p['um'] ?? '');

  $sw = (int) ($p['w'] ?? 0);
  $screen = $sw >= 1440 ? '1440+' : ($sw >= 1200 ? '1200-1439' : ($sw >= 992 ? '992-1199' : ($sw >= 768 ? '768-991' : ($sw >= 480 ? '480-767' : ($sw > 0 ? 'under 480' : 'unknown')))));

  $db->prepare('INSERT INTO events (ts,day,type,name,visitor,session,path,ref_host,source,medium,campaign,term,content,device,browser,os,screen,lang,target,meta,is_entry)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    ->execute([
      time(), $day, $type, $name, $visitor,
      preg_replace('/[^A-Za-z0-9]/', '', nld_str($p['s'] ?? '', 32)),
      nld_clean_path($p['p'] ?? '/'),
      mb_substr($refHost, 0, 120), $source, $medium,
      nld_str($p['uc'] ?? '', 80), nld_str($p['ut'] ?? '', 80), nld_str($p['un'] ?? '', 80),
      $device, $browser, $os, $screen,
      strtolower(preg_replace('/[^A-Za-z\-]/', '', nld_str($p['l'] ?? '', 8))),
      nld_str($p['g'] ?? '', 300), nld_str($p['m'] ?? '', 200),
      !empty($p['e']) ? 1 : 0,
    ]);
  return true;
}

/** Delete data older than the retention settings. Cheap; safe to call often. */
function nld_purge() {
  $db = nld_db();
  if (!$db) return;
  $d = (int) nld_setting('retain_events_days', 400);
  if ($d > 0) $db->prepare('DELETE FROM events WHERE ts < ?')->execute([time() - $d * 86400]);
  $l = (int) nld_setting('retain_leads_days', 0);
  if ($l > 0) $db->prepare('DELETE FROM leads WHERE ts < ?')->execute([time() - $l * 86400]);
  $db->exec('DELETE FROM lead_replies WHERE lead_id NOT IN (SELECT id FROM leads)');
  $db->prepare('DELETE FROM login_attempts WHERE ts < ?')->execute([time() - 30 * 86400]);
}
