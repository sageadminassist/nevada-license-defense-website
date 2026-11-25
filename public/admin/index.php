<?php
/*
 * Nevada License Defense admin: analytics + leads inbox.
 * One front controller: /admin/?p=dashboard|leads|lead|pages|sources|devices|events|faq|search|settings
 */
define('NLD_ADMIN', 1);
require __DIR__ . '/inc/core.php';
require __DIR__ . '/inc/pages.php';

if (!nld_db()) {
  page_head('Setup needed', 'auth');
  echo '<div class="authbox"><h1>Storage is not ready</h1><p>The admin could not open its private database.</p><ul>'
    . '<li>PHP SQLite extension (pdo_sqlite): <b>' . (extension_loaded('pdo_sqlite') ? 'available' : 'MISSING. Turn it on in Hostinger: Advanced, PHP Configuration, PHP Extensions.') . '</b></li>'
    . '<li>Private folder: <code>' . h(nld_private_dir()) . '</code> is <b>' . (is_dir(nld_private_dir()) ? (is_writable(nld_private_dir()) ? 'writable' : 'NOT writable') : 'missing and could not be created. Create it in the Hostinger File Manager, next to public_html.') . '</b></li>'
    . '<li>PHP version: ' . h(PHP_VERSION) . ' (8.0 or newer needed)</li></ul></div>';
  page_foot();
  exit;
}

admin_session_start();
$p = (string) ($_GET['p'] ?? 'dashboard');
$isPost = ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';

// Password recovery: the owner drops an empty file named reset-admin.txt into the private folder.
$resetFile = nld_private_dir() . '/reset-admin.txt';
if (is_file($resetFile)) {
  nld_set_setting('admin_hash', null);
  nld_set_setting('admin_pw_version', bin2hex(random_bytes(8)));
  @unlink($resetFile);
  $_SESSION = [];
}

/* ---------- first run: create the password (only possible while none exists) ---------- */
if (!nld_setting('admin_hash')) {
  $err = '';
  if ($isPost) {
    csrf_check();
    $err = password_problem((string) ($_POST['pw'] ?? ''), (string) ($_POST['pw2'] ?? ''));
    if (!$err && !nld_setting('admin_hash')) {
      admin_set_password((string) $_POST['pw']);
      admin_sign_in();
      @mail('info@nevadalicensedefense.com', 'Website admin password was created',
        "The admin password for nevadalicensedefense.com/admin was just created (" . date('M j, Y g:i a T') . ").\n\nIf this was not you, reset it right away: in the Hostinger File Manager, create an empty file named reset-admin.txt inside the nld-private folder (next to public_html), then open /admin and choose a new password.\n",
        "From: Nevada License Defense Website <info@nevadalicensedefense.com>\r\nContent-Type: text/plain; charset=UTF-8", '-finfo@nevadalicensedefense.com');
      $_SESSION['flash'] = 'Password created. You are signed in.';
      redirect('?p=dashboard');
    }
  }
  page_head('Create password', 'auth');
  echo '<form class="authbox" method="post" autocomplete="off"><p class="mark">Nevada License Defense</p><h1>Create the admin password</h1>'
    . '<p>This screen appears only once, while no password exists. Choose a long password (at least ' . ADMIN_MIN_PASSWORD . ' characters) and save it in your password manager.</p>'
    . ($err ? '<p class="err" role="alert">' . h($err) . '</p>' : '') . csrf_field()
    . '<label>New password<input type="password" name="pw" required minlength="' . ADMIN_MIN_PASSWORD . '" autocomplete="new-password" autofocus></label>'
    . '<label>Type it again<input type="password" name="pw2" required minlength="' . ADMIN_MIN_PASSWORD . '" autocomplete="new-password"></label>'
    . '<button class="btn">Create password</button></form>';
  page_foot();
  exit;
}

/* ---------- sign out ---------- */
if ($p === 'logout' && $isPost) {
  csrf_check();
  $_SESSION = [];
  session_destroy();
  setcookie('nld_admin', '', ['expires' => 1, 'path' => '/admin', 'secure' => is_https(), 'httponly' => true, 'samesite' => 'Strict']);
  redirect('./');
}

/* ---------- sign in ---------- */
if (!admin_logged_in()) {
  $err = '';
  $locked = admin_locked();
  if ($isPost && !$locked) {
    csrf_check();
    $ok = password_verify((string) ($_POST['pw'] ?? ''), (string) nld_setting('admin_hash'));
    admin_note_attempt($ok);
    if ($ok) {
      if (password_needs_rehash((string) nld_setting('admin_hash'), PASSWORD_DEFAULT)) nld_set_setting('admin_hash', password_hash((string) $_POST['pw'], PASSWORD_DEFAULT));
      admin_sign_in();
      redirect('?p=dashboard');
    }
    usleep(400000);
    $locked = admin_locked();
    $err = 'That password is not correct.';
  }
  if ($locked) { http_response_code(429); $err = 'Too many wrong passwords. Sign-in is paused for 15 minutes.'; }
  page_head('Sign in', 'auth');
  echo '<form class="authbox" method="post"><p class="mark">Nevada License Defense</p><h1>Admin sign in</h1>'
    . ($err ? '<p class="err" role="alert">' . h($err) . '</p>' : '') . csrf_field()
    . '<label>Password<input type="password" name="pw" required autocomplete="current-password" autofocus' . ($locked ? ' disabled' : '') . '></label>'
    . '<button class="btn"' . ($locked ? ' disabled' : '') . '>Sign in</button>'
    . '<p class="small">Forgot it? See “Resetting the password” in the setup notes.</p></form>';
  page_foot();
  exit;
}

/* ---------- signed in ---------- */
if (!isset(ADMIN_NAV[$p]) && $p !== 'lead') $p = 'dashboard';
$r = admin_range();
if ($isPost) {
  csrf_check();
  handle_post($p);          // always redirects
}
if ($p === 'leads' && isset($_GET['export'])) export_leads($r);
if (random_int(1, 20) === 1) nld_purge();

$fn = 'page_' . $p;
$fn($r);
