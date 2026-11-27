<?php
/* Admin core: session, login, lockout, CSRF, date range, layout and chart helpers. */
if (!defined('NLD_ADMIN')) { http_response_code(403); exit; }
require_once dirname(__DIR__, 2) . '/api/inc/lib.php';

const ADMIN_IDLE_SECONDS = 7200;      // signed out after 2 hours without activity
const ADMIN_MAX_FAILS    = 5;         // wrong passwords allowed per 15 minutes (per network address)
const ADMIN_MAX_FAILS_ALL = 30;       // wrong passwords allowed per 15 minutes (everyone combined)
const ADMIN_MIN_PASSWORD = 12;

function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function n($v) { return number_format((float) $v); }
function is_https() {
  return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function admin_headers() {
  header('X-Robots-Tag: noindex, nofollow, noarchive');
  header('Cache-Control: no-store, private');
  header('X-Frame-Options: DENY');
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: same-origin');
  header("Content-Security-Policy: default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self' data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
  if (is_https()) header('Strict-Transport-Security: max-age=15552000');
}

function admin_session_start() {
  $dir = nld_private_dir() . '/sessions';
  if (!is_dir($dir)) @mkdir($dir, 0700, true);
  if (is_dir($dir) && is_writable($dir)) session_save_path($dir);
  ini_set('session.use_strict_mode', '1');
  ini_set('session.use_only_cookies', '1');
  ini_set('session.gc_maxlifetime', (string) ADMIN_IDLE_SECONDS);
  session_name('nld_admin');
  session_set_cookie_params(['lifetime' => 0, 'path' => '/admin', 'secure' => is_https(), 'httponly' => true, 'samesite' => 'Strict']);
  session_start();
  if (!empty($_SESSION['admin']) && time() - (int) ($_SESSION['seen'] ?? 0) > ADMIN_IDLE_SECONDS) {
    $_SESSION = [];
    session_regenerate_id(true);
  }
  if (!empty($_SESSION['admin'])) {
    // Changing the password signs out every other browser.
    if (!hash_equals((string) ($_SESSION['pwv'] ?? ''), (string) nld_setting('admin_pw_version', ''))) {
      $_SESSION = [];
      session_regenerate_id(true);
    } else {
      $_SESSION['seen'] = time();
    }
  }
}
function admin_logged_in() { return !empty($_SESSION['admin']); }

function csrf_token() {
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(24));
  return $_SESSION['csrf'];
}
function csrf_field() { return '<input type="hidden" name="csrf" value="' . h(csrf_token()) . '">'; }
function csrf_check() {
  $t = (string) ($_POST['csrf'] ?? '');
  if ($t === '' || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $t) || !nld_same_origin()) {
    http_response_code(400);
    exit('This form expired. Go back, reload the page and try again.');
  }
}

/* ---------- login throttling ---------- */
function admin_who() { return substr(hash('sha256', 'login|' . nld_secret() . '|' . nld_ip()), 0, 24); }
function admin_locked() {
  $db = nld_db();
  $since = time() - 900;
  $st = $db->prepare('SELECT COUNT(*) FROM login_attempts WHERE ok = 0 AND ts > ? AND who = ?');
  $st->execute([$since, admin_who()]);
  if ((int) $st->fetchColumn() >= ADMIN_MAX_FAILS) return true;
  $st = $db->prepare('SELECT COUNT(*) FROM login_attempts WHERE ok = 0 AND ts > ?');
  $st->execute([$since]);
  return (int) $st->fetchColumn() >= ADMIN_MAX_FAILS_ALL;
}
function admin_note_attempt($ok) {
  nld_db()->prepare('INSERT INTO login_attempts (ts, who, ok) VALUES (?,?,?)')->execute([time(), admin_who(), $ok ? 1 : 0]);
  if ($ok) nld_db()->prepare('DELETE FROM login_attempts WHERE ok = 0 AND who = ?')->execute([admin_who()]);
}
function admin_sign_in() {
  session_regenerate_id(true);
  $_SESSION = ['admin' => 1, 'seen' => time(), 'pwv' => (string) nld_setting('admin_pw_version', ''), 'csrf' => bin2hex(random_bytes(24))];
}
function admin_set_password($pw) {
  nld_set_setting('admin_hash', password_hash($pw, PASSWORD_DEFAULT));
  nld_set_setting('admin_pw_version', bin2hex(random_bytes(8)));
}
function password_problem($pw, $again) {
  if (strlen($pw) < ADMIN_MIN_PASSWORD) return 'Use at least ' . ADMIN_MIN_PASSWORD . ' characters.';
  if (strlen($pw) > 200) return 'That password is too long.';
  if ($pw !== $again) return 'The two passwords do not match.';
  if (preg_match('/^(.)\1+$/', $pw) || in_array(strtolower($pw), ['password1234', '123456789012', 'nevadalicensedefense'], true)) return 'Please choose a less guessable password.';
  return '';
}
function redirect($to) { header('Location: ' . $to, true, 303); exit; }

/* ---------- date range ---------- */
function valid_day($s) { return is_string($s) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) && strtotime($s) !== false; }
/** Returns [from, to, prevFrom, prevTo, key, days]. Days are in Pacific time. */
function admin_range() {
  $key = (string) ($_GET['range'] ?? '30');
  $today = date('Y-m-d');
  if ($key === 'custom' && valid_day($_GET['from'] ?? null) && valid_day($_GET['to'] ?? null)) {
    $from = $_GET['from']; $to = $_GET['to'];
    if ($from > $to) [$from, $to] = [$to, $from];
    if ($to > $today) $to = $today;
    if ($from > $to) $from = $to;
  } else {
    if (!in_array($key, ['today', '7', '30', '90', '365'], true)) $key = '30';
    $d = $key === 'today' ? 1 : (int) $key;
    $to = $today;
    $from = date('Y-m-d', strtotime($today . ' -' . ($d - 1) . ' days'));
  }
  $days = (int) round((strtotime($to) - strtotime($from)) / 86400) + 1;
  $prevTo = date('Y-m-d', strtotime($from . ' -1 day'));
  $prevFrom = date('Y-m-d', strtotime($prevTo . ' -' . ($days - 1) . ' days'));
  return ['from' => $from, 'to' => $to, 'pfrom' => $prevFrom, 'pto' => $prevTo, 'key' => $key, 'days' => $days];
}
/** Query string that keeps the current page + date range. */
function qs(array $over = []) {
  $keep = [];
  foreach (['p', 'range', 'from', 'to', 'status', 'q', 'ev'] as $k) if (isset($_GET[$k]) && is_string($_GET[$k]) && $_GET[$k] !== '') $keep[$k] = $_GET[$k];
  foreach ($over as $k => $v) { if ($v === null) unset($keep[$k]); else $keep[$k] = $v; }
  return '?' . http_build_query($keep);
}

function q_all($sql, array $args = []) { $st = nld_db()->prepare($sql); $st->execute($args); return $st->fetchAll(); }
function q_val($sql, array $args = []) { $st = nld_db()->prepare($sql); $st->execute($args); return $st->fetchColumn(); }

/** Fill every day (or week, for long ranges) of the range. $rows = [day => value]. */
function series_fill(array $rows, array $r) {
  $weekly = $r['days'] > 120;
  $out = [];
  for ($t = strtotime($r['from']); $t <= strtotime($r['to']); $t = strtotime('+1 day', $t)) {
    $day = date('Y-m-d', $t);
    $key = $weekly ? date('Y-m-d', strtotime('monday this week', $t)) : $day;
    $out[$key] = ($out[$key] ?? 0) + (float) ($rows[$day] ?? 0);
  }
  return $out;
}
function day_label($day, $weekly = false) { return ($weekly ? 'Week of ' : '') . date('M j', strtotime($day)); }
function nice_max($v) {
  if ($v <= 4) return 4;
  $p = pow(10, floor(log10($v)));
  foreach ([1, 2, 2.5, 5, 10] as $m) if ($v <= $m * $p) return $m * $p;
  return 10 * $p;
}

/**
 * Trend chart drawn as plain SVG (no scripts). $series = [['label' =>, 'color' =>, 'data' => [day => n]], …].
 * One series is drawn as bars; two or more as lines with a legend. Hover any day for the exact numbers.
 */
function chart(array $series, array $r, $title) {
  $weekly = $r['days'] > 120;
  $keys = array_keys($series[0]['data']);
  $count = count($keys);
  if (!$count) return '';
  $max = 0;
  foreach ($series as $s) $max = max($max, max($s['data']));
  $top = nice_max($max);
  $W = 900; $H = 240; $L = 44; $R = 12; $T = 12; $B = 28;
  $pw = $W - $L - $R; $ph = $H - $T - $B;
  $step = $pw / $count;
  $y = function ($v) use ($T, $ph, $top) { return round($T + $ph - ($v / $top) * $ph, 1); };
  $o = '<figure class="chart"><figcaption>' . h($title);
  if (count($series) > 1) {
    $o .= '<span class="legend">';
    foreach ($series as $i => $s) $o .= '<span><i class="sw sw' . $i . '"></i>' . h($s['label']) . '</span>';
    $o .= '</span>';
  }
  $o .= '</figcaption><svg viewBox="0 0 ' . $W . ' ' . $H . '" role="img" aria-label="' . h($title) . '">';
  for ($g = 0; $g <= 4; $g++) {
    $v = $top * $g / 4; $gy = $y($v);
    $o .= '<line class="grid" x1="' . $L . '" x2="' . ($W - $R) . '" y1="' . $gy . '" y2="' . $gy . '"/>';
    $o .= '<text class="ax" x="' . ($L - 8) . '" y="' . ($gy + 4) . '" text-anchor="end">' . h($v == floor($v) ? n($v) : rtrim(rtrim(number_format($v, 1), '0'), '.')) . '</text>';
  }
  $every = max(1, (int) ceil($count / 8));
  foreach ($keys as $i => $k) {
    if ($i % $every === 0) $o .= '<text class="ax" x="' . round($L + $step * ($i + 0.5), 1) . '" y="' . ($H - 8) . '" text-anchor="middle">' . h(date('M j', strtotime($k))) . '</text>';
  }
  if (count($series) === 1) {
    $bw = max(2, min(28, $step - 2));
    foreach ($keys as $i => $k) {
      $v = $series[0]['data'][$k];
      if ($v <= 0) continue;
      $by = $y($v); $bh = max(1.5, $T + $ph - $by);
      $o .= '<rect class="bar sw0" rx="' . min(3, $bw / 2) . '" x="' . round($L + $step * $i + ($step - $bw) / 2, 1) . '" y="' . round($T + $ph - $bh, 1) . '" width="' . round($bw, 1) . '" height="' . round($bh, 1) . '"/>';
    }
  } else {
    foreach ($series as $si => $s) {
      $pts = [];
      foreach ($keys as $i => $k) $pts[] = round($L + $step * ($i + 0.5), 1) . ',' . $y($s['data'][$k]);
      $o .= '<polyline class="line sw' . $si . '" points="' . implode(' ', $pts) . '"/>';
      if ($count <= 45) foreach ($pts as $p) { [$px, $py] = explode(',', $p); $o .= '<circle class="dot sw' . $si . '" cx="' . $px . '" cy="' . $py . '" r="3"/>'; }
    }
  }
  // Full-height hover targets carrying the tooltip text.
  foreach ($keys as $i => $k) {
    $tip = day_label($k, $weekly);
    foreach ($series as $s) $tip .= "\n" . $s['label'] . ': ' . n($s['data'][$k]);
    $o .= '<rect class="hit" x="' . round($L + $step * $i, 1) . '" y="' . $T . '" width="' . round($step, 1) . '" height="' . $ph . '"><title>' . h($tip) . '</title></rect>';
  }
  $o .= '</svg><details><summary>Show these numbers as a table</summary><div class="scroll"><table class="t"><thead><tr><th>' . ($weekly ? 'Week of' : 'Day') . '</th>';
  foreach ($series as $s) $o .= '<th class="num">' . h($s['label']) . '</th>';
  $o .= '</tr></thead><tbody>';
  foreach (array_reverse($keys) as $k) {
    $o .= '<tr><td>' . h(date('D, M j, Y', strtotime($k))) . '</td>';
    foreach ($series as $s) $o .= '<td class="num">' . n($s['data'][$k]) . '</td>';
    $o .= '</tr>';
  }
  return $o . '</tbody></table></div></details></figure>';
}

/**
 * Ranked table with an inline share bar on the first number column.
 * $cols = [key => heading]; the first column is the label, the rest are numbers.
 */
function ranked(array $rows, array $cols, $empty = 'Nothing recorded in this date range yet.') {
  if (!$rows) return '<p class="empty">' . h($empty) . '</p>';
  $keys = array_keys($cols);
  $first = $keys[1] ?? null;
  $max = 0;
  foreach ($rows as $row) $max = max($max, (float) ($row[$first] ?? 0));
  $o = '<div class="scroll"><table class="t"><thead><tr>';
  foreach ($keys as $i => $k) $o .= '<th' . ($i ? ' class="num"' : '') . '>' . h($cols[$k]) . '</th>';
  $o .= '</tr></thead><tbody>';
  foreach ($rows as $row) {
    $o .= '<tr>';
    foreach ($keys as $i => $k) {
      $v = $row[$k] ?? '';
      if ($i === 0) {
        $w = $max > 0 ? max(1, round(((float) $row[$first]) / $max * 100)) : 0;
        $o .= '<td class="lbl"><svg class="share" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true"><rect width="' . $w . '" height="4" rx="1"/></svg><span title="' . h($v) . '">' . h($v === '' ? '(none)' : $v) . '</span></td>';
      } else {
        $o .= '<td class="num">' . (is_numeric($v) ? n($v) : h($v)) . '</td>';
      }
    }
    $o .= '</tr>';
  }
  return $o . '</tbody></table></div>';
}

function pct($a, $b, $dp = 1) { return $b > 0 ? number_format($a / $b * 100, $dp) . '%' : '–'; }
/** KPI tile with change against the previous period of equal length. */
function tile($label, $now, $prev, $fmt = 'n', $hint = '') {
  $show = $fmt === 'pct' ? number_format($now, 1) . '%' : n($now);
  $delta = '';
  if ($prev !== null) {
    if ($prev > 0) {
      $ch = ($now - $prev) / $prev * 100;
      $cls = $ch > 0.5 ? 'up' : ($ch < -0.5 ? 'down' : 'flat');
      $delta = '<span class="delta ' . $cls . '">' . ($ch > 0.5 ? '▲' : ($ch < -0.5 ? '▼' : '•')) . ' ' . number_format(abs($ch), 0) . '% vs previous period</span>';
    } else {
      $delta = '<span class="delta flat">' . ($now > 0 ? 'New this period' : 'No change') . '</span>';
    }
  }
  return '<div class="tile"><span class="k">' . h($label) . '</span><span class="v">' . $show . '</span>' . $delta . ($hint ? '<span class="hint">' . h($hint) . '</span>' : '') . '</div>';
}

const ADMIN_NAV = [
  'dashboard' => 'Dashboard',
  'leads'     => 'Leads inbox',
  'pages'     => 'Top pages',
  'sources'   => 'Sources & campaigns',
  'devices'   => 'Devices & browsers',
  'events'    => 'Calls & clicks',
  'faq'       => 'FAQ assistant',
  'search'    => 'Site searches',
  'settings'  => 'Settings',
];

function page_head($title, $bodyClass = '') {
  admin_headers();
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
    . '<meta name="robots" content="noindex, nofollow, noarchive"><title>' . h($title) . ' · NLD Admin</title>'
    . '<link rel="stylesheet" href="admin.css?v=1"></head><body class="' . h($bodyClass) . '">';
}
function page_foot() { echo '</body></html>'; }

function layout_start($p, array $r, $showRange = true) {
  page_head(ADMIN_NAV[$p] ?? 'Admin');
  $new = (int) q_val("SELECT COUNT(*) FROM leads WHERE status = 'new'");
  echo '<div class="shell"><aside class="side"><a class="brand" href="?p=dashboard"><img src="/images/NEVADA%20LICENSE%20DEFENSE%20LOGO-WHITE-SVG.svg" alt="Nevada License Defense" width="180" height="88"><span>Admin</span></a><nav>';
  foreach (ADMIN_NAV as $k => $label) {
    $keep = ['p' => $k, 'status' => null, 'q' => null, 'ev' => null, 'id' => null];
    echo '<a href="' . h(qs($keep)) . '"' . ($k === $p ? ' class="on" aria-current="page"' : '') . '>' . h($label)
      . ($k === 'leads' && $new ? ' <em>' . $new . ' new</em>' : '') . '</a>';
  }
  echo '</nav><div class="side-foot"><a href="/" target="_blank" rel="noopener">View website ↗</a>'
    . '<form method="post" action="?p=logout">' . csrf_field() . '<button class="linkish">Sign out</button></form></div></aside><main class="main">';
  echo '<header class="top"><h1>' . h(ADMIN_NAV[$p] ?? 'Admin') . '</h1>';
  if ($showRange) {
    echo '<div class="range"><div class="presets">';
    foreach (['today' => 'Today', '7' => '7 days', '30' => '30 days', '90' => '90 days', '365' => '12 months'] as $k => $label) {
      echo '<a href="' . h(qs(['range' => $k, 'from' => null, 'to' => null])) . '"' . ($r['key'] === $k ? ' class="on"' : '') . '>' . $label . '</a>';
    }
    echo '</div><form method="get" class="custom">';
    foreach (['p', 'status', 'q', 'ev'] as $k) if (!empty($_GET[$k]) && is_string($_GET[$k])) echo '<input type="hidden" name="' . $k . '" value="' . h($_GET[$k]) . '">';
    echo '<input type="hidden" name="range" value="custom"><label>From <input type="date" name="from" value="' . h($r['from']) . '" max="' . date('Y-m-d') . '"></label>'
      . '<label>To <input type="date" name="to" value="' . h($r['to']) . '" max="' . date('Y-m-d') . '"></label><button class="btn small">Apply</button></form></div>';
  }
  echo '</header>';
  if ($showRange) echo '<p class="period">Showing ' . h(date('M j, Y', strtotime($r['from']))) . ' to ' . h(date('M j, Y', strtotime($r['to']))) . ' (' . $r['days'] . ' day' . ($r['days'] === 1 ? '' : 's') . ', Pacific time)</p>';
  if (!empty($_SESSION['flash'])) { echo '<p class="flash">' . h($_SESSION['flash']) . '</p>'; unset($_SESSION['flash']); }
}
function layout_end() { echo '</main></div>'; page_foot(); }
function card($title, $body, $note = '') {
  return '<section class="card"><h2>' . h($title) . '</h2>' . ($note ? '<p class="note">' . h($note) . '</p>' : '') . $body . '</section>';
}
function when($ts) { return date('M j, Y g:i a', (int) $ts); }
