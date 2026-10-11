(() => {
  const FIRST_PASSWORD = '瑩輝241212^_^';
  const SECOND_PASSWORD = '朗屏巴士總站';
  const STAR_TOTAL = 12;
  const BUS_TOTAL = 24;
  const REVEAL_AT = new Date('2026-12-12T00:00:00+08:00');
  const keys = {
    step: 'sunny-anniversary-step-v1',
    stars: 'sunny-anniversary-stars-v1',
    bus: 'sunny-anniversary-bus-v1',
    complete: 'sunny-anniversary-complete-v1'
  };

  const elements = {
    app: document.querySelector('.app'),
    gate: document.querySelector('#anniversaryGate'),
    close: document.querySelector('#anniversaryClose'),
    enter: document.querySelector('#anniversaryEnter'),
    nav: document.querySelector('#anniversaryNav'),
    passPanel: document.querySelector('#anniversaryPassPanel'),
    form: document.querySelector('#anniversaryForm'),
    pass: document.querySelector('#anniversaryPass'),
    stage: document.querySelector('#anniversaryStage'),
    title: document.querySelector('#anniversaryPassTitle'),
    copy: document.querySelector('#anniversaryPassCopy'),
    label: document.querySelector('#anniversaryLabel'),
    error: document.querySelector('#anniversaryError'),
    starGame: document.querySelector('#starGame'),
    starField: document.querySelector('#starField'),
    starCount: document.querySelector('#starCount'),
    starBar: document.querySelector('#starBar'),
    starMessage: document.querySelector('#starMessage'),
    busGame: document.querySelector('#busGame'),
    busCount: document.querySelector('#busCount'),
    busBar: document.querySelector('#busBar'),
    busRoute: document.querySelector('#busRoute'),
    busIcon: document.querySelector('#busIcon'),
    busStops: document.querySelector('#busStops'),
    busMessage: document.querySelector('#busMessage'),
    preview: document.querySelector('#anniversaryPreview'),
    countdown: document.querySelector('#anniversaryLiveCountdown'),
    previewBack: document.querySelector('#previewBack'),
    section: document.querySelector('#anniversary'),
    timeline: document.querySelector('#monthTimeline')
  };
  if (!elements.gate || !elements.enter) return;

  let passStage = 1;
  let countdownTimer;
  const starPositions = [
    [18, 22], [68, 18], [42, 33], [82, 42], [24, 51], [58, 58],
    [77, 70], [35, 76], [14, 66], [52, 84], [88, 24], [48, 48]
  ];
  const starMessages = [
    '第一點星光已記低', '夜空開始有我哋嘅路線', '第三粒星都搵到啦', '慢慢連成一條路',
    '差唔多行到一半', '6 / 12，已經一半', '星光繼續向前', '留意會呼吸嗰粒星',
    '12 · 12 開始成形', '最後三粒', '差一粒就完成', '12點星光路線完成'
  ];

  function splitGraphemes(value) {
    const normalized = String(value ?? '').normalize('NFC');
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return [...new Intl.Segmenter('zh-Hant', {granularity: 'grapheme'}).segment(normalized)].map(item => item.segment);
    }
    const result = [];
    for (const character of Array.from(normalized)) {
      if ((character === '\uFE0E' || character === '\uFE0F') && result.length) result[result.length - 1] += character;
      else result.push(character);
    }
    return result;
  }

  function graphemeKey(value) {
    return value.replace(/[\uFE0E\uFE0F]/gu, '');
  }

  function normalize(value) {
    return splitGraphemes(String(value).trim()).map(graphemeKey).join('');
  }

  function scoreGuess(guess, answer) {
    const guessed = splitGraphemes(guess).map(graphemeKey);
    const expected = splitGraphemes(answer).map(graphemeKey);
    const remaining = new Map();
    expected.forEach(character => remaining.set(character, (remaining.get(character) || 0) + 1));
    let matched = 0;
    guessed.forEach(character => {
      const available = remaining.get(character) || 0;
      if (available > 0) {
        matched += 1;
        remaining.set(character, available - 1);
      }
    });
    const placed = guessed.reduce((total, character, index) => total + Number(character === expected[index]), 0);
    return {matched, placed, total: expected.length};
  }

  function readCount(key, maximum) {
    const value = Number.parseInt(sessionStorage.getItem(key) || '0', 10);
    return Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0;
  }

  function setBackgroundLocked(locked) {
    document.querySelectorAll('.story-section,.bottom').forEach(node => {
      node.inert = locked;
      if (locked) node.setAttribute('aria-hidden', 'true');
      else node.removeAttribute('aria-hidden');
    });
  }

  function setActiveNav(id) {
    document.querySelectorAll('.bottom [data-go]').forEach(link => link.classList.toggle('active', link.dataset.go === id));
  }

  function showOnly(panel) {
    [elements.passPanel, elements.starGame, elements.busGame, elements.preview].forEach(item => { item.hidden = item !== panel; });
    elements.gate.scrollTop = 0;
  }

  function openGate() {
    elements.gate.hidden = false;
    document.body.classList.add('modal-open');
    setBackgroundLocked(true);
    if (localStorage.getItem(keys.complete) === 'yes') {
      if (Date.now() >= REVEAL_AT.getTime()) revealFullSite();
      else showPreview();
      return;
    }
    const step = sessionStorage.getItem(keys.step) || 'first';
    if (step === 'stars') showStarGame();
    else if (step === 'second') showSecondPassword();
    else if (step === 'bus') showBusGame();
    else showFirstPassword();
  }

  function closeGate({returnToPortal = true} = {}) {
    clearInterval(countdownTimer);
    elements.gate.hidden = true;
    document.body.classList.remove('modal-open');
    setBackgroundLocked(false);
    if (returnToPortal) {
      setActiveNav('portal');
      document.querySelector('#portal').scrollIntoView({behavior: 'smooth'});
    }
  }

  function showFirstPassword() {
    passStage = 1;
    sessionStorage.setItem(keys.step, 'first');
    showOnly(elements.passPanel);
    elements.stage.textContent = 'ANNIVERSARY CHECK · 01 / 02';
    elements.title.innerHTML = '第一個<br>周年暗號';
    elements.copy.textContent = '提示：我哋嘅名字、日期，同一個熟悉表情。答案共有 11 個字元。';
    elements.label.textContent = '第一個紀念日口令 · 11 個字元';
    elements.pass.value = '';
    elements.error.textContent = '';
    setTimeout(() => elements.pass.focus(), 50);
  }

  function showSecondPassword() {
    passStage = 2;
    sessionStorage.setItem(keys.step, 'second');
    showOnly(elements.passPanel);
    elements.stage.textContent = 'ANNIVERSARY CHECK · 02 / 02';
    elements.title.innerHTML = '我哋開始嘅<br>第一個地方';
    elements.copy.textContent = '提示：夜晚約11時，一個屬於我哋嘅巴士總站。答案共有 6 個中文字。';
    elements.label.textContent = '第二個紀念日口令 · 6 個中文字';
    elements.pass.value = '';
    elements.error.textContent = '';
    setTimeout(() => elements.pass.focus(), 50);
  }

  function renderStars() {
    const count = readCount(keys.stars, STAR_TOTAL);
    elements.starCount.textContent = `已點亮 ${count} / ${STAR_TOTAL}`;
    elements.starBar.style.width = `${count / STAR_TOTAL * 100}%`;
    elements.starField.replaceChildren();
    for (let index = 0; index < count; index += 1) {
      const [left, top] = starPositions[index];
      const dot = document.createElement('span');
      dot.className = 'constellation-dot';
      dot.style.left = `${left}%`;
      dot.style.top = `${top}%`;
      elements.starField.append(dot);
    }
    if (count >= STAR_TOTAL) return;
    const [left, top] = starPositions[count];
    const trueStar = document.createElement('button');
    trueStar.type = 'button';
    trueStar.className = 'star-target true';
    trueStar.setAttribute('aria-label', '會呼吸閃動的正確星星');
    trueStar.textContent = '✦';
    trueStar.style.left = `${left}%`;
    trueStar.style.top = `${top}%`;
    trueStar.addEventListener('click', catchStar);
    elements.starField.append(trueStar);
    [[(left + 37) % 84 + 8, (top + 31) % 76 + 12], [(left + 61) % 84 + 8, (top + 53) % 76 + 12]].forEach(([x, y]) => {
      const decoy = document.createElement('button');
      decoy.type = 'button';
      decoy.className = 'star-target decoy';
      decoy.setAttribute('aria-label', '普通星星');
      decoy.textContent = '✧';
      decoy.style.left = `${x}%`;
      decoy.style.top = `${y}%`;
      decoy.addEventListener('click', () => {
        elements.starMessage.textContent = '再望清楚邊粒星最掛住你 ✨';
        if (navigator.vibrate) navigator.vibrate(15);
      });
      elements.starField.append(decoy);
    });
  }

  function catchStar() {
    const count = Math.min(STAR_TOTAL, readCount(keys.stars, STAR_TOTAL) + 1);
    sessionStorage.setItem(keys.stars, String(count));
    elements.starMessage.textContent = starMessages[count - 1];
    if (navigator.vibrate) navigator.vibrate(count === STAR_TOTAL ? [25, 35, 65] : 15);
    renderStars();
    if (count === STAR_TOTAL) setTimeout(showSecondPassword, 850);
  }

  function showStarGame() {
    sessionStorage.setItem(keys.step, 'stars');
    showOnly(elements.starGame);
    elements.starMessage.textContent = readCount(keys.stars, STAR_TOTAL) ? '沿住之前嘅星光繼續行' : '第一粒星正等緊你';
    renderStars();
  }

  function buildBusStops() {
    if (elements.busStops.children.length) return;
    for (let index = 0; index < BUS_TOTAL; index += 1) elements.busStops.append(document.createElement('span'));
  }

  function updateBus() {
    buildBusStops();
    const count = readCount(keys.bus, BUS_TOTAL);
    const ratio = count / BUS_TOTAL;
    elements.busCount.textContent = `已同行 ${count} / ${BUS_TOTAL} 個月`;
    elements.busBar.style.width = `${ratio * 100}%`;
    elements.busRoute.style.width = `${ratio * 100}%`;
    elements.busIcon.style.left = `calc(16px + ${ratio * 78}%)`;
    [...elements.busStops.children].forEach((stop, index) => stop.classList.toggle('lit', index < count));
    const expected = count % 2 === 0 ? 'sunny' : 'yingfai';
    document.querySelectorAll('[data-rider]').forEach(button => button.classList.toggle('expected', button.dataset.rider === expected));
    if (count && count < BUS_TOTAL && count % 6 === 0) elements.busMessage.textContent = `${count}個月站已到達，繼續一齊行`;
  }

  function rideBus(rider) {
    const count = readCount(keys.bus, BUS_TOTAL);
    const expected = count % 2 === 0 ? 'sunny' : 'yingfai';
    if (rider !== expected) {
      elements.busMessage.textContent = '要兩個人左右交替，架車先行得到 💕';
      if (navigator.vibrate) navigator.vibrate(18);
      return;
    }
    const next = Math.min(BUS_TOTAL, count + 1);
    sessionStorage.setItem(keys.bus, String(next));
    elements.busMessage.textContent = next === BUS_TOTAL ? '24個月同行完成，尾班車到站啦' : `第 ${next} 個月已點亮`;
    if (navigator.vibrate) navigator.vibrate(next === BUS_TOTAL ? [30, 35, 80] : 12);
    updateBus();
    if (next === BUS_TOTAL) {
      localStorage.setItem(keys.complete, 'yes');
      sessionStorage.setItem(keys.step, 'preview');
      setTimeout(showPreview, 850);
    }
  }

  function showBusGame() {
    sessionStorage.setItem(keys.step, 'bus');
    showOnly(elements.busGame);
    updateBus();
  }

  function updateCountdown() {
    const difference = Math.max(0, REVEAL_AT.getTime() - Date.now());
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference / 3600000) % 24;
    const minutes = Math.floor(difference / 60000) % 60;
    const seconds = Math.floor(difference / 1000) % 60;
    [days, hours, minutes, seconds].forEach((value, index) => {
      elements.countdown.children[index].querySelector('b').textContent = String(value).padStart(2, '0');
    });
    if (difference === 0 && localStorage.getItem(keys.complete) === 'yes') revealFullSite();
  }

  function showPreview() {
    showOnly(elements.preview);
    updateCountdown();
    clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);
  }

  function renderTimeline() {
    if (elements.timeline.children.length) return;
    for (let index = 0; index < 24; index += 1) {
      const start = new Date(Date.UTC(2024, 11 + index, 12));
      const end = new Date(Date.UTC(2025, 0 + index, 11));
      const pad = value => String(value).padStart(2, '0');
      const range = `${start.getUTCFullYear()}.${pad(start.getUTCMonth() + 1)}.${pad(start.getUTCDate())} — ${end.getUTCFullYear()}.${pad(end.getUTCMonth() + 1)}.${pad(end.getUTCDate())}`;
      const card = document.createElement('article');
      card.className = 'month-card';
      let title = '回憶待補';
      let copy = '留低位置，等 Sunny 之後補返呢一個月嘅故事。';
      if (index === 0) {
        card.classList.add('known');
        title = '我哋開始咗';
        copy = '約晚上11時，朗屏巴士總站成為我哋故事嘅起點。';
      } else if (index === 21) {
        card.classList.add('known');
        title = '生日配送完成';
        copy = '2026年10月4日，生日配送成為兩周年前嘅新回憶。';
      } else if (index === 23) {
        title = '兩周年前夕';
        copy = '等候12月12日正式揭曉完整紀念日內容。';
      }
      card.innerHTML = `<small>MONTH ${String(index + 1).padStart(2, '0')} · ${range}</small><strong>${title}</strong><p>${copy}</p>`;
      elements.timeline.append(card);
    }
  }

  function revealFullSite() {
    clearInterval(countdownTimer);
    renderTimeline();
    elements.section.hidden = false;
    closeGate({returnToPortal: false});
    setActiveNav('anniversary');
    requestAnimationFrame(() => elements.section.scrollIntoView({behavior: 'smooth'}));
  }

  elements.form.addEventListener('submit', event => {
    event.preventDefault();
    const guess = elements.pass.value.trim();
    window.dispatchEvent(new CustomEvent('sunny:guess-attempt', {detail:{experience:'anniversary',stage:passStage,guess,noteSelector:'#anniversaryLogNote'}}));
    const answer = passStage === 1 ? FIRST_PASSWORD : SECOND_PASSWORD;
    if (normalize(guess) === normalize(answer)) {
      elements.error.textContent = '';
      if (passStage === 1) {
        sessionStorage.setItem(keys.stars, '0');
        showStarGame();
      } else {
        sessionStorage.setItem(keys.bus, '0');
        showBusGame();
      }
      return;
    }
    const {matched, placed, total} = scoreGuess(guess, answer);
    elements.error.textContent = `答案共有 ${total} 個字元。今次估中 ${matched} 個，其中 ${placed} 個位置正確。再試一次 💕`;
    elements.pass.select();
  });

  elements.enter.addEventListener('click', openGate);
  elements.nav.addEventListener('click', event => {
    if (!(localStorage.getItem(keys.complete) === 'yes' && Date.now() >= REVEAL_AT.getTime())) event.preventDefault();
    openGate();
  });
  elements.close.addEventListener('click', () => closeGate());
  elements.previewBack.addEventListener('click', () => closeGate());
  document.querySelectorAll('[data-rider]').forEach(button => button.addEventListener('click', () => rideBus(button.dataset.rider)));
  renderTimeline();
  if (localStorage.getItem(keys.complete) === 'yes' && Date.now() >= REVEAL_AT.getTime()) elements.section.hidden = false;
})();
