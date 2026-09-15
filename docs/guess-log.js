// Submit each birthday passphrase attempt to Sunny's private log.
(() => {
  const endpoint = 'https://script.google.com/macros/s/AKfycbzmXnciQHCf_StLVJ6BT6-AoYU2VRCQxIk82XSTjbCDCAJOpQcZAyqzn9rKszPyDZZcwA/exec';
  if (!endpoint) return;
  const key = 'sunny-guess-pending-v1';
  let queue;
  try { queue = JSON.parse(localStorage.getItem(key) || '[]'); } catch { queue = []; }
  if (!Array.isArray(queue)) queue = [];
  let active = false;
  const session = crypto.randomUUID();
  function save() { try { localStorage.setItem(key, JSON.stringify(queue)); } catch {} }
  function flush() {
    if (active || !queue.length || !navigator.onLine) return;
    active = true;
    const item = queue[0];
    const nonce = crypto.randomUUID();
    const frame = document.createElement('iframe');
    frame.hidden = true;
    frame.name = 'guess-' + nonce;
    frame.title = '生日暗號記錄';
    const form = document.createElement('form');
    form.hidden = true;
    form.method = 'POST';
    form.action = endpoint;
    form.target = frame.name;
    for (const [name, value] of Object.entries({...item, nonce})) {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = String(value);
      form.append(input);
    }
    let timer;
    function finish(ok) {
      clearTimeout(timer);
      window.removeEventListener('message', receive);
      frame.remove(); form.remove(); active = false;
      if (ok) {
        queue.shift(); save();
        const note = document.querySelector('#entryLogNote');
        if (note) note.textContent = queue.length ? '正在留低你的暗號嘗試 💕。' : '暗號嘗試已由 Sunny 保存，留作生日回憶 💕。';
        flush();
      }
      else {
        item.retries = (item.retries || 0) + 1;
        save();
        if (item.retries < 3) setTimeout(flush, 5000);
      }
    }
    function receive(event) {
      if (!/^https:\/\/(?:[a-z0-9-]+[.-])?script\.googleusercontent\.com$/.test(event.origin) && event.origin !== 'https://script.google.com') return;
      const data = event.data;
      if (data && data.type === 'sunny-guess-ack' && data.id === item.id && data.nonce === nonce) finish(data.ok === true);
    }
    window.addEventListener('message', receive);
    document.body.append(frame, form);
    timer = setTimeout(() => finish(false), 20000);
    form.submit();
  }
  document.querySelector('#entryForm').addEventListener('submit', () => {
    const guess = document.querySelector('#entryPass').value;
    const stage = document.querySelector('#entryStage').textContent.includes('SECOND') ? 2 : 1;
    queue.push({id:crypto.randomUUID(),session,stage,guess});
    document.querySelector('#entryLogNote').textContent = '正在留低你的暗號嘗試 💕。';
    save(); flush();
  }, true);
  window.addEventListener('online', flush);
  flush();
})();
