<?php
/* Admin screens. Every number comes from the private SQLite database. */
if (!defined('NLD_ADMIN')) { http_response_code(403); exit; }

const EVENT_LABELS = [
  'call_click'     => 'Phone number clicked',
  'email_click'    => 'Email address clicked',
  'consult_open'   => 'Consultation form opened',
  'consult_submit' => 'Consultation form sent',
  'faq_open'       => 'FAQ assistant opened',
  'faq_question'   => 'FAQ assistant question',
  'outbound'       => 'Link to another site clicked',
  'search'         => 'Site search',
];

function rng(array $r) { return [$r['from'], $r['to']]; }
function prng(array $r) { return [$r['pfrom'], $r['pto']]; }
function by_day($sql, array $r) {
  $out = [];
  foreach (q_all($sql, rng($r)) as $row) $out[$row['day']] = $row['n'];
  return series_fill($out, $r);
}
function totals(array $range) {
  $t = q_all("SELECT COUNT(*) pv, COUNT(DISTINCT visitor) vis, COUNT(DISTINCT CASE WHEN session <> '' THEN session END) ses
              FROM events WHERE type = 'pageview' AND day BETWEEN ? AND ?", $range)[0];
  $t['leads'] = (int) q_val('SELECT COUNT(*) FROM leads WHERE day BETWEEN ? AND ?', $range);
  $t['calls'] = (int) q_val("SELECT COUNT(*) FROM events WHERE name = 'call_click' AND day BETWEEN ? AND ?", $range);
  $t['conv'] = $t['vis'] > 0 ? $t['leads'] / $t['vis'] * 100 : 0;
  return $t;
}

/* ---------------- dashboard ---------------- */
function page_dashboard(array $r) {
  layout_start('dashboard', $r);
  $now = totals(rng($r));
  $prev = totals(prng($r));
  $live = (int) q_val('SELECT COUNT(DISTINCT visitor) FROM events WHERE ts > ?', [time() - 1800]);
  $unsent = (int) q_val("SELECT COUNT(*) FROM leads WHERE mail_ok = 0 AND status = 'new'");
  if ($unsent) echo '<p class="warn"><b>' . $unsent . ' new lead' . ($unsent === 1 ? '' : 's') . ' could not be emailed</b> to the office. They are safe in the <a href="?p=leads&amp;status=new">Leads inbox</a>; please check them here.</p>';

  echo '<div class="tiles">'
    . tile('Visitors', $now['vis'], $prev['vis'], 'n', 'People, counted once per day')
    . tile('Page views', $now['pv'], $prev['pv'])
    . tile('Leads (forms sent)', $now['leads'], $prev['leads'])
    . tile('Calls clicked', $now['calls'], $prev['calls'], 'n', 'Taps on the phone number')
    . tile('Conversion rate', $now['conv'], $prev['conv'], 'pct', 'Leads ÷ visitors')
    . '<div class="tile live"><span class="k">On the site now</span><span class="v">' . n($live) . '</span><span class="hint">Visitors in the last 30 minutes</span></div>'
    . '</div>';

  $vis = by_day("SELECT day, COUNT(DISTINCT visitor) n FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY day", $r);
  $pv  = by_day("SELECT day, COUNT(*) n FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY day", $r);
  // Weekly buckets must not add up daily visitor counts twice; they are "visitor-days", labelled as such.
  echo '<section class="card">' . chart([
    ['label' => $r['days'] > 120 ? 'Visitors (daily visitors added up)' : 'Visitors', 'data' => $vis],
    ['label' => 'Page views', 'data' => $pv],
  ], $r, 'Traffic') . '</section>';

  $leads = by_day('SELECT day, COUNT(*) n FROM leads WHERE day BETWEEN ? AND ? GROUP BY day', $r);
  $calls = by_day("SELECT day, COUNT(*) n FROM events WHERE name='call_click' AND day BETWEEN ? AND ? GROUP BY day", $r);
  echo '<div class="grid2"><section class="card">' . chart([['label' => 'Leads', 'data' => $leads]], $r, 'Leads (forms sent)') . '</section>'
    . '<section class="card">' . chart([['label' => 'Calls clicked', 'data' => $calls]], $r, 'Calls clicked') . '</section></div>';

  $pages = q_all("SELECT path, COUNT(*) pv, COUNT(DISTINCT visitor) vis FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY path ORDER BY pv DESC LIMIT 8", rng($r));
  $src = q_all("SELECT source, COUNT(DISTINCT visitor) vis FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY source ORDER BY vis DESC LIMIT 8", rng($r));
  echo '<div class="grid2">' . card('Top pages', ranked($pages, ['path' => 'Page', 'pv' => 'Views', 'vis' => 'Visitors']) . '<p class="more"><a href="' . h(qs(['p' => 'pages'])) . '">All pages →</a></p>')
    . card('Where visitors came from', ranked($src, ['source' => 'Source', 'vis' => 'Visitors']) . '<p class="more"><a href="' . h(qs(['p' => 'sources'])) . '">All sources →</a></p>') . '</div>';

  $recent = q_all('SELECT * FROM leads ORDER BY id DESC LIMIT 6');
  echo card('Latest leads', leads_table($recent) . '<p class="more"><a href="?p=leads">Open the inbox →</a></p>');
  layout_end();
}

/* ---------------- top pages ---------------- */
function page_pages(array $r) {
  layout_start('pages', $r);
  $rows = q_all("SELECT path, COUNT(*) pv, COUNT(DISTINCT visitor) vis, SUM(is_entry) ent FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY path ORDER BY pv DESC LIMIT 200", rng($r));
  // Calls and leads attributed to the page the visitor was on.
  $calls = []; foreach (q_all("SELECT path, COUNT(*) n FROM events WHERE name='call_click' AND day BETWEEN ? AND ? GROUP BY path", rng($r)) as $c) $calls[$c['path']] = $c['n'];
  $forms = []; foreach (q_all("SELECT path, COUNT(*) n FROM events WHERE name='consult_submit' AND day BETWEEN ? AND ? GROUP BY path", rng($r)) as $c) $forms[$c['path']] = $c['n'];
  foreach ($rows as &$row) { $row['calls'] = $calls[$row['path']] ?? 0; $row['forms'] = $forms[$row['path']] ?? 0; }
  unset($row);
  echo card('All pages', ranked($rows, ['path' => 'Page', 'pv' => 'Views', 'vis' => 'Visitors', 'ent' => 'Started here', 'calls' => 'Calls clicked', 'forms' => 'Forms sent']),
    '“Started here” counts visits where this was the first page someone saw.');
  $entry = q_all("SELECT path, COUNT(*) n FROM events WHERE type='pageview' AND is_entry = 1 AND day BETWEEN ? AND ? GROUP BY path ORDER BY n DESC LIMIT 15", rng($r));
  echo card('Landing pages', ranked($entry, ['path' => 'First page of the visit', 'n' => 'Visits']));
  layout_end();
}

/* ---------------- sources ---------------- */
function page_sources(array $r) {
  layout_start('sources', $r);
  $lead = []; foreach (q_all('SELECT source, COUNT(*) n FROM leads WHERE day BETWEEN ? AND ? GROUP BY source', rng($r)) as $l) $lead[$l['source']] = $l['n'];
  $src = q_all("SELECT source, medium, COUNT(DISTINCT visitor) vis, COUNT(*) pv FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY source, medium ORDER BY vis DESC LIMIT 100", rng($r));
  foreach ($src as &$s) { $s['leads'] = $lead[$s['source']] ?? 0; $s['label'] = $s['source'] . '  ·  ' . $s['medium']; }
  unset($s);
  echo card('Sources', ranked($src, ['label' => 'Source · type', 'vis' => 'Visitors', 'pv' => 'Page views', 'leads' => 'Leads']),
    'Direct means the address was typed, bookmarked, or the previous site did not say where the visitor came from.');
  $med = q_all("SELECT medium, COUNT(DISTINCT visitor) vis FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY medium ORDER BY vis DESC", rng($r));
  $ref = q_all("SELECT ref_host, COUNT(DISTINCT visitor) vis FROM events WHERE type='pageview' AND ref_host <> '' AND day BETWEEN ? AND ? GROUP BY ref_host ORDER BY vis DESC LIMIT 50", rng($r));
  echo '<div class="grid2">' . card('By type', ranked($med, ['medium' => 'Type', 'vis' => 'Visitors']))
    . card('Referring websites', ranked($ref, ['ref_host' => 'Website', 'vis' => 'Visitors'], 'No visits from other websites in this date range.')) . '</div>';
  $camp = q_all("SELECT campaign, source, medium, term, content, COUNT(DISTINCT visitor) vis, COUNT(*) pv FROM events
                 WHERE type='pageview' AND (campaign <> '' OR medium NOT IN ('direct','search','social','referral','ai','sister site')) AND day BETWEEN ? AND ?
                 GROUP BY campaign, source, medium, term, content ORDER BY vis DESC LIMIT 100", rng($r));
  foreach ($camp as &$c) $c['label'] = ($c['campaign'] ?: '(no campaign name)') . '  ·  ' . $c['source'] . ' / ' . $c['medium'] . ($c['term'] ? '  ·  term: ' . $c['term'] : '') . ($c['content'] ? '  ·  content: ' . $c['content'] : '');
  unset($c);
  echo card('Campaigns (UTM tags)', ranked($camp, ['label' => 'Campaign · source / medium', 'vis' => 'Visitors', 'pv' => 'Page views'], 'No tagged campaign links were used in this date range.'),
    'To measure an ad or email, add tags to its link, for example: ?utm_source=google&utm_medium=cpc&utm_campaign=nursing-defense');
  layout_end();
}

/* ---------------- devices ---------------- */
function page_devices(array $r) {
  layout_start('devices', $r);
  $g = function ($col) use ($r) {
    return q_all("SELECT $col AS label, COUNT(DISTINCT visitor) vis, COUNT(*) pv FROM events WHERE type='pageview' AND day BETWEEN ? AND ? GROUP BY $col ORDER BY vis DESC LIMIT 25", rng($r));
  };
  $c = ['label' => '', 'vis' => 'Visitors', 'pv' => 'Page views'];
  echo '<div class="grid2">'
    . card('Device type', ranked($g('device'), ['label' => 'Device'] + $c))
    . card('Browser', ranked($g('browser'), ['label' => 'Browser'] + $c))
    . card('Operating system', ranked($g('os'), ['label' => 'System'] + $c))
    . card('Screen width (pixels)', ranked($g('screen'), ['label' => 'Width'] + $c))
    . card('Browser language', ranked($g('lang'), ['label' => 'Language'] + $c))
    . '</div>';
  layout_end();
}

/* ---------------- events ---------------- */
function page_events(array $r) {
  layout_start('events', $r);
  $sum = q_all("SELECT name, COUNT(*) n, COUNT(DISTINCT visitor) vis FROM events WHERE type='event' AND day BETWEEN ? AND ? GROUP BY name ORDER BY n DESC", rng($r));
  foreach ($sum as &$s) $s['label'] = EVENT_LABELS[$s['name']] ?? $s['name'];
  unset($s);
  echo card('What visitors did', ranked($sum, ['label' => 'Action', 'n' => 'Times', 'vis' => 'Visitors']));

  $ev = (string) ($_GET['ev'] ?? 'call_click');
  if (!isset(EVENT_LABELS[$ev])) $ev = 'call_click';
  echo '<section class="card"><div class="pills">';
  foreach (EVENT_LABELS as $k => $label) echo '<a href="' . h(qs(['ev' => $k])) . '"' . ($k === $ev ? ' class="on"' : '') . '>' . h($label) . '</a>';
  echo '</div>';
  $st = nld_db()->prepare("SELECT day, COUNT(*) n FROM events WHERE name = ? AND day BETWEEN ? AND ? GROUP BY day");
  $st->execute([$ev, $r['from'], $r['to']]);
  $d = []; foreach ($st->fetchAll() as $row) $d[$row['day']] = $row['n'];
  echo chart([['label' => EVENT_LABELS[$ev], 'data' => series_fill($d, $r)]], $r, EVENT_LABELS[$ev] . ' per ' . ($r['days'] > 120 ? 'week' : 'day')) . '</section>';

  $callPages = q_all("SELECT path, COUNT(*) n FROM events WHERE name='call_click' AND day BETWEEN ? AND ? GROUP BY path ORDER BY n DESC LIMIT 20", rng($r));
  $out = q_all("SELECT target, COUNT(*) n, COUNT(DISTINCT visitor) vis FROM events WHERE name='outbound' AND day BETWEEN ? AND ? GROUP BY target ORDER BY n DESC LIMIT 30", rng($r));
  echo '<div class="grid2">' . card('Pages where people tapped the phone number', ranked($callPages, ['path' => 'Page', 'n' => 'Calls clicked']))
    . card('Links to other sites', ranked($out, ['target' => 'Link (MyCase login, sister sites, others)', 'n' => 'Clicks', 'vis' => 'Visitors'])) . '</div>';

  $recent = q_all("SELECT ts, name, path, target, meta, source, device FROM events WHERE type='event' AND day BETWEEN ? AND ? ORDER BY id DESC LIMIT 100", rng($r));
  $o = $recent ? '<div class="scroll"><table class="t"><thead><tr><th>When</th><th>Action</th><th>Page</th><th>Detail</th><th>Source</th><th>Device</th></tr></thead><tbody>' : '<p class="empty">Nothing recorded in this date range yet.</p>';
  foreach ($recent as $e) $o .= '<tr><td class="nowrap">' . h(when($e['ts'])) . '</td><td>' . h(EVENT_LABELS[$e['name']] ?? $e['name']) . '</td><td>' . h($e['path']) . '</td><td class="wrap">' . h($e['target']) . '</td><td>' . h($e['source']) . '</td><td>' . h($e['device']) . '</td></tr>';
  echo card('Most recent 100 actions', $o . ($recent ? '</tbody></table></div>' : ''));
  layout_end();
}

/* ---------------- FAQ assistant ---------------- */
function page_faq(array $r) {
  layout_start('faq', $r);
  $opens = (int) q_val("SELECT COUNT(*) FROM events WHERE name='faq_open' AND day BETWEEN ? AND ?", rng($r));
  $asked = (int) q_val("SELECT COUNT(*) FROM events WHERE name='faq_question' AND day BETWEEN ? AND ?", rng($r));
  $miss  = (int) q_val("SELECT COUNT(*) FROM events WHERE name='faq_question' AND meta NOT LIKE '1%' AND day BETWEEN ? AND ?", rng($r));
  echo '<div class="tiles">' . tile('Assistant opened', $opens, null) . tile('Questions asked', $asked, null)
    . tile('Answered from the FAQ', $asked ? ($asked - $miss) / $asked * 100 : 0, null, 'pct')
    . tile('Not answered', $miss, null, 'n', 'Ideas for new FAQ entries') . '</div>';
  $un = q_all("SELECT MIN(target) q, COUNT(*) n, MAX(ts) last FROM events WHERE name='faq_question' AND meta NOT LIKE '1%' AND day BETWEEN ? AND ? GROUP BY LOWER(target) ORDER BY n DESC, last DESC LIMIT 100", rng($r));
  echo card('Questions the assistant could not answer', ranked($un, ['q' => 'Question as typed', 'n' => 'Times asked'], 'Every question in this date range was answered.'),
    'These are the best candidates for new FAQ entries.');
  $top = q_all("SELECT MIN(target) q, COUNT(*) n FROM events WHERE name='faq_question' AND meta LIKE '1%' AND day BETWEEN ? AND ? GROUP BY LOWER(target) ORDER BY n DESC LIMIT 50", rng($r));
  $ans = q_all("SELECT SUBSTR(meta, 3) a, COUNT(*) n FROM events WHERE name='faq_question' AND meta LIKE '1|%' AND day BETWEEN ? AND ? GROUP BY a ORDER BY n DESC LIMIT 50", rng($r));
  echo '<div class="grid2">' . card('Most asked (answered)', ranked($top, ['q' => 'Question', 'n' => 'Times asked']))
    . card('FAQ entries shown most', ranked($ans, ['a' => 'FAQ entry', 'n' => 'Times shown'])) . '</div>';
  $recent = q_all("SELECT ts, target, meta, path FROM events WHERE name='faq_question' AND day BETWEEN ? AND ? ORDER BY id DESC LIMIT 100", rng($r));
  $o = $recent ? '<div class="scroll"><table class="t"><thead><tr><th>When</th><th>Question</th><th>Result</th><th>Page</th></tr></thead><tbody>' : '<p class="empty">No questions in this date range yet.</p>';
  foreach ($recent as $e) {
    $ok = strpos($e['meta'], '1') === 0;
    $o .= '<tr><td class="nowrap">' . h(when($e['ts'])) . '</td><td class="wrap">' . h($e['target']) . '</td><td><span class="tag ' . ($ok ? 'ok' : 'bad') . '">' . ($ok ? '✓ Answered' : '✕ No answer') . '</span></td><td>' . h($e['path']) . '</td></tr>';
  }
  echo card('Most recent 100 questions', $o . ($recent ? '</tbody></table></div>' : ''));
  layout_end();
}

/* ---------------- site search ---------------- */
function page_search(array $r) {
  layout_start('search', $r);
  $all = q_all("SELECT MIN(target) q, COUNT(*) n, COUNT(DISTINCT visitor) vis FROM events WHERE name='search' AND day BETWEEN ? AND ? GROUP BY LOWER(target) ORDER BY n DESC LIMIT 100", rng($r));
  $zero = q_all("SELECT MIN(target) q, COUNT(*) n FROM events WHERE name='search' AND meta = '0' AND day BETWEEN ? AND ? GROUP BY LOWER(target) ORDER BY n DESC LIMIT 100", rng($r));
  echo '<div class="grid2">' . card('What people searched for', ranked($all, ['q' => 'Search', 'n' => 'Times', 'vis' => 'Visitors'], 'No searches in this date range yet.'))
    . card('Searches with no results', ranked($zero, ['q' => 'Search', 'n' => 'Times'], 'Every search in this date range found something.'), 'Topics visitors wanted that the site does not cover yet.') . '</div>';
  layout_end();
}

/* ---------------- leads ---------------- */
function leads_table(array $rows) {
  if (!$rows) return '<p class="empty">No leads yet. Every consultation or appointment form sent on the website appears here.</p>';
  $o = '<div class="scroll"><table class="t leads"><thead><tr><th>Received</th><th>Name</th><th>Type</th><th>Contact</th><th>License / board</th><th>Came from</th><th>Status</th></tr></thead><tbody>';
  foreach ($rows as $l) {
    $o .= '<tr class="' . ($l['status'] === 'new' ? 'isnew' : '') . '"><td class="nowrap">' . h(when($l['ts'])) . '</td>'
      . '<td><a class="strong" href="?p=lead&amp;id=' . (int) $l['id'] . '">' . h($l['name']) . '</a></td>'
      . '<td>' . ($l['kind'] === 'appointment' ? 'Appointment' : 'Consultation') . '</td>'
      . '<td>' . h($l['phone']) . ($l['phone'] && $l['email'] ? '<br>' : '') . h($l['email']) . '</td>'
      . '<td>' . h($l['license']) . '</td><td>' . h($l['source'] ?: 'Unknown') . '</td>'
      . '<td><span class="tag ' . ($l['status'] === 'new' ? 'new' : 'ok') . '">' . ($l['status'] === 'new' ? '● New' : '✓ Handled') . '</span>'
      . ($l['mail_ok'] ? '' : ' <span class="tag bad" title="The notification email could not be sent">✕ Not emailed</span>') . '</td></tr>';
  }
  return $o . '</tbody></table></div>';
}
function leads_filter() {
  $where = '1=1'; $args = [];
  $status = (string) ($_GET['status'] ?? '');
  if ($status === 'new' || $status === 'handled') { $where .= ' AND status = ?'; $args[] = $status; }
  $q = trim((string) ($_GET['q'] ?? ''));
  if ($q !== '') {
    $like = '%' . str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], mb_substr($q, 0, 100)) . '%';
    $where .= " AND (name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR message LIKE ? ESCAPE '\\' OR license LIKE ? ESCAPE '\\')";
    array_push($args, $like, $like, $like, $like, $like);
  }
  return [$where, $args, $status, $q];
}
function page_leads(array $r) {
  layout_start('leads', $r, false);
  [$where, $args, $status, $q] = leads_filter();
  $per = 50;
  $pg = max(1, (int) ($_GET['pg'] ?? 1));
  $total = (int) q_val("SELECT COUNT(*) FROM leads WHERE $where", $args);
  $rows = q_all("SELECT * FROM leads WHERE $where ORDER BY id DESC LIMIT $per OFFSET " . (($pg - 1) * $per), $args);
  $cnt = ['' => (int) q_val('SELECT COUNT(*) FROM leads'), 'new' => (int) q_val("SELECT COUNT(*) FROM leads WHERE status='new'"), 'handled' => (int) q_val("SELECT COUNT(*) FROM leads WHERE status='handled'")];
  echo '<section class="card"><div class="toolbar"><div class="pills">';
  foreach (['' => 'All', 'new' => 'New', 'handled' => 'Handled'] as $k => $label) {
    echo '<a href="' . h(qs(['status' => $k ?: null])) . '"' . ($status === $k ? ' class="on"' : '') . '>' . $label . ' (' . $cnt[$k] . ')</a>';
  }
  echo '</div><form method="get" class="searchform"><input type="hidden" name="p" value="leads">' . ($status ? '<input type="hidden" name="status" value="' . h($status) . '">' : '')
    . '<input type="search" name="q" value="' . h($q) . '" placeholder="Search name, phone, email, message" aria-label="Search leads"><button class="btn small">Search</button></form>'
    . '<a class="btn small ghost" href="' . h(qs(['export' => '1'])) . '">Download spreadsheet (CSV)</a></div>';
  echo leads_table($rows);
  if ($total > $per) {
    echo '<p class="pager">';
    if ($pg > 1) echo '<a href="' . h(qs() . '&pg=' . ($pg - 1)) . '">← Newer</a> ';
    echo 'Page ' . $pg . ' of ' . ceil($total / $per);
    if ($pg * $per < $total) echo ' <a href="' . h(qs() . '&pg=' . ($pg + 1)) . '">Older →</a>';
    echo '</p>';
  }
  echo '</section>';
  layout_end();
}
function page_lead(array $r) {
  $id = (int) ($_GET['id'] ?? 0);
  $rows = q_all('SELECT * FROM leads WHERE id = ?', [$id]);
  if (!$rows) redirect('?p=leads');
  $l = $rows[0];
  layout_start('leads', $r, false);
  $row = function ($k, $v) { return '<tr><th>' . h($k) . '</th><td>' . $v . '</td></tr>'; };
  $tel = preg_replace('/[^0-9+]/', '', $l['phone']);
  echo '<p class="back"><a href="?p=leads">← Back to the inbox</a></p><div class="grid2 lead"><section class="card"><h2>' . h($l['name'])
    . ' <span class="tag ' . ($l['status'] === 'new' ? 'new' : 'ok') . '">' . ($l['status'] === 'new' ? '● New' : '✓ Handled') . '</span></h2><table class="kv">'
    . $row('Received', h(when($l['ts'])) . ' Pacific')
    . $row('Type', $l['kind'] === 'appointment' ? 'Appointment request' : 'Free consultation request')
    . $row('Phone', $l['phone'] !== '' ? '<a href="tel:' . h($tel) . '">' . h($l['phone']) . '</a>' : '–')
    . $row('Email', $l['email'] !== '' ? '<a href="mailto:' . h($l['email']) . '">' . h($l['email']) . '</a>' : '–')
    . $row('License / board', h($l['license'] ?: '–'))
    . ($l['kind'] === 'appointment' ? $row('Preferred time', h($l['pref_when'] ?: '–')) : '')
    . $row('Message', '<div class="msg">' . nl2br(h($l['message'])) . '</div>')
    . $row('Sent from page', h($l['page'] ?: '–'))
    . $row('Came from', h(($l['source'] ?: 'Unknown') . ($l['medium'] ? ' (' . $l['medium'] . ')' : '') . ($l['campaign'] ? ', campaign: ' . $l['campaign'] : '')))
    . $row('First page seen', h($l['landing'] ?: '–'))
    . $row('Device', h($l['device'] ?: '–'))
    . $row('Email to office', $l['mail_ok'] ? 'Sent' : '<span class="tag bad">✕ Could not be sent</span>')
    . ($l['handled_at'] ? $row('Handled on', h(when($l['handled_at']))) : '')
    . '</table></section><section class="card"><h2>Follow-up</h2>'
    . '<form method="post" action="?p=lead&amp;id=' . $id . '">' . csrf_field()
    . '<label class="block">Private notes (only visible here)<textarea name="notes" rows="8" maxlength="5000">' . h($l['notes']) . '</textarea></label>'
    . '<div class="row"><button class="btn" name="do" value="notes">Save notes</button>'
    . ($l['status'] === 'new' ? '<button class="btn gold" name="do" value="handled">Save and mark handled</button>' : '<button class="btn ghost" name="do" value="reopen">Mark as new again</button>')
    . '</div></form><hr><form method="post" action="?p=lead&amp;id=' . $id . '" class="danger">' . csrf_field()
    . '<label><input type="checkbox" name="sure" value="1" required> Permanently delete this lead</label> <button class="btn small ghost" name="do" value="delete">Delete</button></form></section></div>';
  layout_end();
}
function csv_cell($v) {
  $v = (string) $v;
  // Stop spreadsheet programs from running a cell that starts like a formula.
  if ($v !== '' && strpos("=+-@\t\r", $v[0]) !== false) $v = "'" . $v;
  return $v;
}
function export_leads(array $r) {
  [$where, $args] = leads_filter();
  admin_headers();
  header('Content-Type: text/csv; charset=utf-8');
  header('Content-Disposition: attachment; filename="nld-leads-' . date('Y-m-d') . '.csv"');
  $out = fopen('php://output', 'w');
  fwrite($out, "\xEF\xBB\xBF");
  fputcsv($out, ['Received (Pacific)', 'Status', 'Type', 'Name', 'Phone', 'Email', 'License / board', 'Preferred time', 'Message', 'Sent from page', 'Source', 'Source type', 'Campaign', 'First page seen', 'Device', 'Emailed to office', 'Notes', 'Handled on']);
  foreach (q_all("SELECT * FROM leads WHERE $where ORDER BY id DESC", $args) as $l) {
    fputcsv($out, array_map('csv_cell', [date('Y-m-d H:i', $l['ts']), $l['status'], $l['kind'], $l['name'], $l['phone'], $l['email'], $l['license'], $l['pref_when'], $l['message'], $l['page'], $l['source'], $l['medium'], $l['campaign'], $l['landing'], $l['device'], $l['mail_ok'] ? 'yes' : 'no', $l['notes'], $l['handled_at'] ? date('Y-m-d H:i', $l['handled_at']) : '']));
  }
  exit;
}

/* ---------------- settings ---------------- */
function page_settings(array $r) {
  layout_start('settings', $r, false);
  $ev = (int) nld_setting('retain_events_days', 400);
  $ld = (int) nld_setting('retain_leads_days', 0);
  $opt = function ($opts, $cur) { $o = ''; foreach ($opts as $v => $label) $o .= '<option value="' . $v . '"' . ((int) $v === $cur ? ' selected' : '') . '>' . $label . '</option>'; return $o; };
  $file = nld_private_dir() . '/nld.sqlite';
  echo '<div class="grid2"><section class="card"><h2>Change password</h2><form method="post" action="?p=settings" autocomplete="off">' . csrf_field()
    . '<label class="block">Current password<input type="password" name="cur" required autocomplete="current-password"></label>'
    . '<label class="block">New password (at least ' . ADMIN_MIN_PASSWORD . ' characters)<input type="password" name="pw" required minlength="' . ADMIN_MIN_PASSWORD . '" autocomplete="new-password"></label>'
    . '<label class="block">New password again<input type="password" name="pw2" required minlength="' . ADMIN_MIN_PASSWORD . '" autocomplete="new-password"></label>'
    . '<button class="btn" name="do" value="password">Change password</button><p class="note">Changing it signs out every other browser.</p></form></section>';

  echo '<section class="card"><h2>How long to keep data</h2><form method="post" action="?p=settings">' . csrf_field()
    . '<label class="block">Visitor statistics<select name="events">' . $opt([90 => '3 months', 180 => '6 months', 400 => '13 months (recommended)', 730 => '2 years', 0 => 'Keep forever'], $ev) . '</select></label>'
    . '<label class="block">Leads (form messages)<select name="leads">' . $opt([0 => 'Keep until I delete them (recommended)', 365 => '1 year', 730 => '2 years', 1825 => '5 years'], $ld) . '</select></label>'
    . '<button class="btn" name="do" value="retention">Save</button><p class="note">Older records are deleted automatically.</p></form></section>';

  echo '<section class="card"><h2>Do not count my own visits</h2><p>Open one of these links once in each browser you use (office computer, phone). That browser is then left out of the statistics.</p>'
    . '<p><a class="btn small" href="/?nld_notrack=1" target="_blank" rel="noopener">Stop counting this browser</a> <a class="btn small ghost" href="/?nld_notrack=0" target="_blank" rel="noopener">Count this browser again</a></p></section>';

  echo '<section class="card"><h2>About the data</h2><table class="kv">'
    . '<tr><th>Page views and actions stored</th><td>' . n(q_val('SELECT COUNT(*) FROM events')) . '</td></tr>'
    . '<tr><th>Leads stored</th><td>' . n(q_val('SELECT COUNT(*) FROM leads')) . '</td></tr>'
    . '<tr><th>Oldest statistic</th><td>' . h(q_val('SELECT MIN(day) FROM events') ?: '–') . '</td></tr>'
    . '<tr><th>Database size</th><td>' . (is_file($file) ? number_format(filesize($file) / 1048576, 2) . ' MB' : '–') . '</td></tr>'
    . '<tr><th>Server</th><td>PHP ' . h(PHP_VERSION) . ', SQLite ' . h(q_val('SELECT sqlite_version()')) . '</td></tr></table>'
    . '<p class="note">Privacy: no cookies, no IP addresses stored. Visitors are counted with an anonymous code that changes every day. Browsers that send “Do Not Track” or “Global Privacy Control” are not counted, and known bots are ignored.</p>'
    . '<hr><form method="post" action="?p=settings" class="danger">' . csrf_field() . '<label><input type="checkbox" name="sure" value="1" required> Erase all visitor statistics (leads are kept)</label> <button class="btn small ghost" name="do" value="wipe">Erase statistics</button></form></section></div>';
  layout_end();
}

/* ---------------- form actions (all redirect) ---------------- */
function handle_post($p) {
  $do = (string) ($_POST['do'] ?? '');
  $db = nld_db();
  if ($p === 'lead') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($do === 'delete' && !empty($_POST['sure'])) {
      $db->prepare('DELETE FROM leads WHERE id = ?')->execute([$id]);
      $_SESSION['flash'] = 'Lead deleted.';
      redirect('?p=leads');
    }
    if (in_array($do, ['notes', 'handled'], true)) $db->prepare('UPDATE leads SET notes = ? WHERE id = ?')->execute([mb_substr((string) ($_POST['notes'] ?? ''), 0, 5000), $id]);
    if ($do === 'handled') $db->prepare("UPDATE leads SET status = 'handled', handled_at = ? WHERE id = ?")->execute([time(), $id]);
    if ($do === 'reopen') $db->prepare("UPDATE leads SET status = 'new', handled_at = NULL WHERE id = ?")->execute([$id]);
    $_SESSION['flash'] = $do === 'handled' ? 'Marked as handled.' : ($do === 'reopen' ? 'Marked as new.' : 'Notes saved.');
    redirect('?p=lead&id=' . $id);
  }
  if ($p === 'settings') {
    if ($do === 'password') {
      if (admin_locked()) { $_SESSION['flash'] = 'Too many wrong passwords. Try again in 15 minutes.'; redirect('?p=settings'); }
      $ok = password_verify((string) ($_POST['cur'] ?? ''), (string) nld_setting('admin_hash'));
      if (!$ok) { admin_note_attempt(false); $_SESSION['flash'] = 'The current password is not correct. Nothing was changed.'; redirect('?p=settings'); }
      $err = password_problem((string) ($_POST['pw'] ?? ''), (string) ($_POST['pw2'] ?? ''));
      if ($err) { $_SESSION['flash'] = 'Password not changed. ' . $err; redirect('?p=settings'); }
      admin_set_password((string) $_POST['pw']);
      $flash = 'Password changed.';
      admin_sign_in();
      $_SESSION['flash'] = $flash;
    } elseif ($do === 'retention') {
      $e = (int) ($_POST['events'] ?? 400); $l = (int) ($_POST['leads'] ?? 0);
      if (in_array($e, [0, 90, 180, 400, 730], true)) nld_set_setting('retain_events_days', $e);
      if (in_array($l, [0, 365, 730, 1825], true)) nld_set_setting('retain_leads_days', $l);
      nld_purge();
      $_SESSION['flash'] = 'Saved.';
    } elseif ($do === 'wipe' && !empty($_POST['sure'])) {
      $db->exec('DELETE FROM events');
      $_SESSION['flash'] = 'All visitor statistics were erased.';
    }
    redirect('?p=settings');
  }
  redirect('?p=' . rawurlencode($p));
}
