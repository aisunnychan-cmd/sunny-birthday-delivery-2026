(() => {
  const FIRST_PASSWORD = '瑩輝241212^_^';
  const SECOND_PASSWORD = '朗屏巴士總站';
  const STAR_TOTAL = 12;
  const MONTH_TOTAL = 24;
  const REVEAL_AT = new Date('2026-12-12T00:00:00+08:00');
  const keys = {
    step: 'sunny-anniversary-step-v2',
    stars: 'sunny-anniversary-stars-v2',
    months: 'sunny-anniversary-months-v2',
    complete: 'sunny-anniversary-complete-v2'
  };

  const photo = number => `images/anniversary/${String(number).padStart(2, '0')}.jpg`;
  const MONTHS = [
    {title:'由朗屏去到第一個約會', kind:'start', photos:[photo(1),photo(2),photo(3)], alt:['牛角飯局留影','Big Bounce Asia 一齊玩嘅相','Big Bounce Asia 當日留影'], copy:'2024年12月12日夜晚，我哋喺朗屏巴士總站開始。第二日同你兩位大學朋友食牛角，仲撞正其中一位生日；到1月5日，再一齊去 Big Bounce Asia 跳餐飽。', action:'由第一站開始儲低'},
    {title:'年宵、整杯，同埋陪伴', kind:'quiet', photos:[photo(4),photo(5),photo(6)], alt:['第一次一齊行維園年宵','生日一齊整陶瓷杯','屯門醫院陪伴嘅一刻'], copy:'第一次一齊行維園年宵，就係周圍行吓；2月1日生日一齊整杯。到我盲腸炎入院，你喺探病時間過嚟，趁我瞓着影低咗呢張相。有你坐喺身邊，已經夠。', action:'收低呢段陪伴'},
    {title:'收埋喺身後嘅花', kind:'flower', photos:[photo(7)], alt:['第一次情人節送花留影'], copy:'第一次一齊過情人節。喺商場等你去完洗手間，我將花收埋喺身後；你返嚟嗰刻，先拎出嚟送畀你。', action:'收低朵花 🌷'},
    {title:'「禾嘅愛」同杯上面嘅我哋', kind:'rabbit', photos:[photo(8)], alt:['一齊完成杯上圖案嘅留影'], ascii:'{\\__/} \n( • - •) \n/ > ❤️\n你睇，依個禾嘅愛！\n\n{\\__/} \n( - _ -)\n/ >❤️\n你唔應係喵意思？\n\n{\\__/} \n( • - •) \n❤️< \\\n喔~咁我收返先!', copy:'3月26日嗰段傻兔仔訊息，我一直記得。4月6日，我哋再一齊完成杯上面嗰幅圖——就係我哋成日用、我又好鍾意嗰對攬住同錫錫嘅角色。', action:'唔好收返，畀我 ❤️'},
    {title:'留住五月前半頁', kind:'open', copy:'呢個月嘅相同細節仲未整理好。唔亂作住，先留一格畀我哋之後補返。', action:'先打個留位印'},
    {title:'終於拎到我哋隻杯', kind:'cup', photos:[photo(9)], alt:['拎到完成陶瓷杯嘅合照'], copy:'由2月整杯、4月畫好圖案，到5月29日終於拎到製成品。呢隻杯唔只係作品，係我哋分三次一齊完成嘅小故事。', action:'完成三步杯仔故事 ☕'},
    {title:'普通日子照樣儲低', kind:'open', copy:'呢段時間未揀到最想放入嚟嗰個畫面。先留返空位，等 Sunny 補相同故事。', action:'留低呢一頁'},
    {title:'第一次一齊去大阪', kind:'travel', photos:[photo(10),photo(11)], alt:['出發大阪嘅機上留影','日本旅程交通留影'], copy:'7月29日由香港飛去大阪，第二日去環球影城，8月1日去世博。其他日子唔逐格背行程啦，最重要係第一次一齊去日本。', action:'蓋個大阪出發印 🇯🇵'},
    {title:'旅行返嚟嘅日常', kind:'open', copy:'旅行完返到香港，日子又繼續。呢個月暫時留白，之後先揀一件最值得記住嘅小事。', action:'留低呢一頁'},
    {title:'十月呢頁等緊你', kind:'open', copy:'暫時未寫好。呢張車票唔會亂填，等有真實回憶先再補。', action:'先打個留位印'},
    {title:'十一月呢頁等緊你', kind:'open', copy:'有啲日子唔需要即刻寫成故事。呢頁先留低，遲啲再一齊揀。', action:'留低呢一頁'},
    {title:'第一年，準備出發', kind:'open', copy:'由開始拍拖去到差唔多一年，呢一頁係第一周年旅行前嘅倒數。', action:'行到第一年'},
    {title:'同一個12月12日，去台北', kind:'travel', copy:'一年前喺朗屏巴士總站開始；一年後嘅同一日，我哋一齊飛去台北。行過士林夜市、饒河夜市，將第一周年變成一段旅程。', action:'蓋個台北周年印 ✈️'},
    {title:'新一年第一頁', kind:'open', copy:'第二年嘅第一個月，暫時先留住位置。之後有相、有故事，再慢慢補返。', action:'打開第二年'},
    {title:'二月呢頁等緊你', kind:'open', copy:'呢個月嘅回憶仲未整理好，所以唔會為填滿而作故事。', action:'先打個留位印'},
    {title:'澳門珠海：我哋兩個先行', kind:'travel', copy:'4月11日，第一次一齊去澳門珠海。第一日得我哋兩個，冇特別趕行程，就咁一齊周圍行。', action:'收低第一日車票'},
    {title:'第二日先同朋友集合', kind:'travel', copy:'4月12日先同你兩位大學朋友集合，食完晏就一齊去賭場。去過梳打冰室、買過手信，仲記得一路搭免費接駁車。細節唔使堆到太滿，記住係第一次就夠。', action:'蓋個澳門珠海印'},
    {title:'五月呢頁等緊你', kind:'open', copy:'呢一頁而家仲係空白。留返畀真正發生過、又想記住嘅事。', action:'留低呢一頁'},
    {title:'六月呢頁等緊你', kind:'open', copy:'未揀好呢個月嘅代表回憶，先唔亂加。', action:'先打個留位印'},
    {title:'曼谷：食、按、影泰服', kind:'travel', copy:'7月30日至8月4日嘅曼谷旅程，最記得一齊做泰式按摩、周圍試唔同嘢食，仲有一齊影泰服。三樣已經夠代表嗰次旅行。', action:'蓋個曼谷印 🇹🇭'},
    {title:'八月呢頁等緊你', kind:'open', copy:'旅行之後嘅呢頁，等之後揀返一件最想留下嘅事。', action:'留低呢一頁'},
    {title:'生日配送完成', kind:'birthday', photos:['images/memory-01.webp'], alt:['2026生日配送回憶海報'], copy:'10月4日，生日配送正式完成。暗號、12個「愛你」、24下心心，連同生日鞋履，一齊變成呢個私人站嘅一部分。', action:'簽收生日配送 💚'},
    {title:'兩周年前嘅一個月', kind:'open', copy:'差一個月就兩周年。呢頁唔預先寫結局，留返畀真正發生嗰日。', action:'繼續行落去'},
    {title:'去到第24個月', kind:'final', copy:'24個月唔係24件大事，而係好多普通日子一齊行出嚟。呢張係最後一張車票；完整內容要等12月12日先正式開。', action:'收低第24張車票 ♥'}
  ];

  const STAR_MEMORIES = [
    ['2024.12.12','朗屏巴士總站，約夜晚11點，我哋由呢度開始。'],
    ['2024.12.13','第二日同你兩位大學朋友食牛角，係我哋第一個正式約會。'],
    ['2025.01.05','Big Bounce Asia，一齊跳嚟跳去，玩到好開心。'],
    ['2025.01.25','第一次一齊行維園年宵，就咁周圍行。'],
    ['2025.02.01','生日一齊整杯，開咗呢個小作品嘅第一步。'],
    ['2025.02.09','屯門醫院嗰日，有你坐喺身邊已經夠。'],
    ['2025.02.14','商場入面，收埋喺身後嘅花終於送到你手。'],
    ['2025.03.26','「你睇，依個禾嘅愛！」傻得嚟好想一直留住。'],
    ['2025.07.29','第一次一齊飛去大阪。'],
    ['2025.12.12','同一個12月12日，一齊去台北過第一周年。'],
    ['2026.04.11','第一次一齊去澳門珠海，第一日得我哋兩個周圍行。'],
    ['2026.07.30','曼谷：泰式按摩、周圍食，同埋一齊影泰服。']
  ];

  const STAR_POSITIONS = [[50,84],[34,69],[21,54],[15,37],[20,23],[34,20],[50,36],[66,20],[80,23],[85,37],[79,54],[66,69]];
  const elements = {
    gate: document.querySelector('#anniversaryGate'), close: document.querySelector('#anniversaryClose'), enter: document.querySelector('#anniversaryEnter'), nav: document.querySelector('#anniversaryNav'),
    passPanel: document.querySelector('#anniversaryPassPanel'), form: document.querySelector('#anniversaryForm'), pass: document.querySelector('#anniversaryPass'), stage: document.querySelector('#anniversaryStage'), title: document.querySelector('#anniversaryPassTitle'), copy: document.querySelector('#anniversaryPassCopy'), label: document.querySelector('#anniversaryLabel'), error: document.querySelector('#anniversaryError'),
    starGame: document.querySelector('#starGame'), starField: document.querySelector('#starField'), starCount: document.querySelector('#starCount'), starBar: document.querySelector('#starBar'), starMessage: document.querySelector('#starMessage'), heartRoute: document.querySelector('#heartRouteLive'),
    busGame: document.querySelector('#busGame'), busCount: document.querySelector('#busCount'), busBar: document.querySelector('#busBar'), busMessage: document.querySelector('#busMessage'), tickets: document.querySelector('#monthTickets'),
    preview: document.querySelector('#anniversaryPreview'), countdown: document.querySelector('#anniversaryLiveCountdown'), previewBack: document.querySelector('#previewBack'), section: document.querySelector('#anniversary'), releasedStars: document.querySelector('#releasedStarMemories'), timeline: document.querySelector('#monthTimeline')
  };
  if (!elements.gate || !elements.enter) return;

  let passStage = 1;
  let countdownTimer;

  function splitGraphemes(value) {
    const normalized = String(value ?? '').normalize('NFC');
    if (typeof Intl !== 'undefined' && Intl.Segmenter) return [...new Intl.Segmenter('zh-Hant', {granularity:'grapheme'}).segment(normalized)].map(item => item.segment);
    const result = [];
    for (const character of Array.from(normalized)) {
      if ((character === '\uFE0E' || character === '\uFE0F') && result.length) result[result.length - 1] += character;
      else result.push(character);
    }
    return result;
  }
  const graphemeKey = value => value.replace(/[\uFE0E\uFE0F]/gu, '');
  const normalize = value => splitGraphemes(String(value).trim()).map(graphemeKey).join('');

  function scoreGuess(guess, answer) {
    const guessed = splitGraphemes(guess).map(graphemeKey);
    const expected = splitGraphemes(answer).map(graphemeKey);
    const remaining = new Map();
    expected.forEach(character => remaining.set(character, (remaining.get(character) || 0) + 1));
    let matched = 0;
    guessed.forEach(character => { const available = remaining.get(character) || 0; if (available > 0) { matched += 1; remaining.set(character, available - 1); } });
    const placed = guessed.reduce((total, character, index) => total + Number(character === expected[index]), 0);
    return {matched, placed, total:expected.length};
  }

  function readStarCount() {
    const value = Number.parseInt(sessionStorage.getItem(keys.stars) || '0', 10);
    return Number.isFinite(value) ? Math.min(STAR_TOTAL, Math.max(0, value)) : 0;
  }
  function readStamped() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(keys.months) || '[]');
      return new Set(Array.isArray(parsed) ? parsed.filter(value => Number.isInteger(value) && value >= 0 && value < MONTH_TOTAL) : []);
    } catch { return new Set(); }
  }
  function saveStamped(stamped) { sessionStorage.setItem(keys.months, JSON.stringify([...stamped].sort((a,b) => a-b))); }
  function monthRange(index) {
    const start = new Date(Date.UTC(2024, 11 + index, 12));
    const end = new Date(Date.UTC(2025, index, 11));
    const pad = value => String(value).padStart(2, '0');
    const show = value => `${value.getUTCFullYear()}.${pad(value.getUTCMonth()+1)}.${pad(value.getUTCDate())}`;
    return `${show(start)} — ${show(end)}`;
  }

  function setBackgroundLocked(locked) {
    document.querySelectorAll('.story-section,.bottom').forEach(node => { node.inert = locked; if (locked) node.setAttribute('aria-hidden','true'); else node.removeAttribute('aria-hidden'); });
  }
  function setActiveNav(id) { document.querySelectorAll('.bottom [data-go]').forEach(link => link.classList.toggle('active', link.dataset.go === id)); }
  function showOnly(panel) {
    [elements.passPanel,elements.starGame,elements.busGame,elements.preview].forEach(item => { item.hidden = item !== panel; });
    elements.gate.scrollTop = 0;
  }
  function openGate() {
    elements.gate.hidden = false;
    document.body.classList.add('modal-open');
    setBackgroundLocked(true);
    if (localStorage.getItem(keys.complete) === 'yes') { if (Date.now() >= REVEAL_AT.getTime()) revealFullSite(); else showPreview(); return; }
    const step = sessionStorage.getItem(keys.step) || 'first';
    if (step === 'stars') showStarGame(); else if (step === 'second') showSecondPassword(); else if (step === 'months') showMonthGame(); else showFirstPassword();
  }
  function closeGate({returnToPortal=true}={}) {
    clearInterval(countdownTimer);
    elements.gate.hidden = true;
    document.body.classList.remove('modal-open');
    setBackgroundLocked(false);
    if (returnToPortal) { setActiveNav('portal'); document.querySelector('#portal').scrollIntoView({behavior:'smooth'}); }
  }

  function showFirstPassword() {
    passStage = 1; sessionStorage.setItem(keys.step,'first'); showOnly(elements.passPanel);
    elements.stage.textContent = 'ANNIVERSARY CHECK · 01 / 02'; elements.title.innerHTML = '第一個<br>周年暗號';
    elements.copy.textContent = '提示：我哋嘅名字、開始日期，同一個熟悉表情。答案共有 11 個字元。';
    elements.label.textContent = '第一個紀念日口令 · 11 個字元'; elements.pass.value = ''; elements.error.textContent = '';
    setTimeout(() => elements.pass.focus(),50);
  }
  function showSecondPassword() {
    passStage = 2; sessionStorage.setItem(keys.step,'second'); showOnly(elements.passPanel);
    elements.stage.textContent = 'ANNIVERSARY CHECK · 02 / 02'; elements.title.innerHTML = '我哋開始嘅<br>第一個地方';
    elements.copy.textContent = '提示：夜晚大約11點，嗰個屬於我哋嘅巴士總站。答案共有 6 個中文字。';
    elements.label.textContent = '第二個紀念日口令 · 6 個中文字'; elements.pass.value = ''; elements.error.textContent = '';
    setTimeout(() => elements.pass.focus(),50);
  }

  function renderStars() {
    const count = readStarCount();
    elements.starCount.textContent = `已點亮 ${count} / ${STAR_TOTAL}`; elements.starBar.style.width = `${count / STAR_TOTAL * 100}%`;
    elements.starField.classList.toggle('heart-complete', count === STAR_TOTAL);
    elements.starField.querySelectorAll('.heart-point').forEach(node => node.remove());
    elements.heartRoute.style.strokeDashoffset = String(100 * (1 - count / STAR_TOTAL));
    STAR_POSITIONS.forEach(([left,top], index) => {
      const button = document.createElement('button'); button.type = 'button';
      button.className = `heart-point${index < count ? ' done' : ''}${index === count ? ' current' : ''}`;
      button.style.left = `${left}%`; button.style.top = `${top}%`; button.textContent = index < count ? '✦' : '✧';
      button.setAttribute('aria-label', index === count ? `點亮第${index+1}個回憶點` : `第${index+1}個回憶點`);
      button.addEventListener('click', () => { if (index === count) catchStar(); else if (index < count) elements.starMessage.textContent = '呢粒已經亮咗，跟住最光嗰粒繼續行。'; else elements.starMessage.textContent = '跟住而家最光嗰粒行先 ✨'; });
      elements.starField.append(button);
    });
  }
  function catchStar() {
    const next = Math.min(STAR_TOTAL, readStarCount()+1); sessionStorage.setItem(keys.stars,String(next));
    elements.starMessage.textContent = next === STAR_TOTAL ? '12點連成一顆心。呢條路線完成啦 ♥' : `第 ${next} 點已亮，下一粒都喺心形路線上。`;
    if (navigator.vibrate) navigator.vibrate(next === STAR_TOTAL ? [25,35,65] : 15);
    renderStars(); if (next === STAR_TOTAL) setTimeout(showSecondPassword,1200);
  }
  function showStarGame() { sessionStorage.setItem(keys.step,'stars'); showOnly(elements.starGame); elements.starMessage.textContent = readStarCount() ? '沿住最光嗰一點繼續行。' : '由最下面嗰粒星開始。'; renderStars(); }

  function renderTickets() {
    const stamped = readStamped(); elements.tickets.replaceChildren();
    for (let index = 0; index < MONTH_TOTAL; index += 1) {
      const button = document.createElement('button'); button.type = 'button';
      button.className = `month-ticket${stamped.has(index) ? ' stamped' : ''}`;
      button.dataset.month = String(index); button.innerHTML = `MONTH ${String(index+1).padStart(2,'0')}<span>${stamped.has(index) ? '已蓋印' : '撳一下'}</span>`;
      button.addEventListener('click', () => stampMonth(index)); elements.tickets.append(button);
    }
    elements.busCount.textContent = `已收低 ${stamped.size} / ${MONTH_TOTAL} 個月`; elements.busBar.style.width = `${stamped.size / MONTH_TOTAL * 100}%`;
  }
  function stampMonth(index) {
    const stamped = readStamped();
    if (!stamped.has(index)) { stamped.add(index); saveStamped(stamped); if (navigator.vibrate) navigator.vibrate(stamped.size === MONTH_TOTAL ? [30,35,80] : 12); }
    renderTickets();
    if (stamped.size === MONTH_TOTAL) { localStorage.setItem(keys.complete,'yes'); sessionStorage.setItem(keys.step,'preview'); elements.busMessage.textContent = '24張車票收齊。去睇倒數啦 ♥'; setTimeout(showPreview,700); }
    else elements.busMessage.textContent = `第 ${index+1} 個月已蓋印；仲有 ${MONTH_TOTAL-stamped.size} 張。`;
  }
  function showMonthGame() { sessionStorage.setItem(keys.step,'months'); showOnly(elements.busGame); renderTickets(); }

  function updateCountdown() {
    const difference = Math.max(0, REVEAL_AT.getTime()-Date.now());
    const values = [Math.floor(difference/86400000),Math.floor(difference/3600000)%24,Math.floor(difference/60000)%60,Math.floor(difference/1000)%60];
    values.forEach((value,index) => { elements.countdown.children[index].querySelector('b').textContent = String(value).padStart(2,'0'); });
    if (difference === 0 && localStorage.getItem(keys.complete) === 'yes') revealFullSite();
  }
  function showPreview() { showOnly(elements.preview); updateCountdown(); clearInterval(countdownTimer); countdownTimer = setInterval(updateCountdown,1000); }
  function renderReleasedStars() {
    if (elements.releasedStars.children.length) return;
    STAR_MEMORIES.forEach(([date,copy],index) => {
      const card = document.createElement('article');
      const point = document.createElement('span'); const body = document.createElement('div');
      const small = document.createElement('small'); const strong = document.createElement('strong');
      point.textContent = '✦'; small.textContent = `POINT ${String(index+1).padStart(2,'0')} · ${date}`; strong.textContent = copy;
      body.append(small,strong); card.append(point,body); elements.releasedStars.append(card);
    });
  }
  function renderTimeline() {
    if (elements.timeline.children.length) return;
    MONTHS.forEach((month,index) => {
      const card = document.createElement('article'); card.className = `month-card ${month.kind === 'open' ? 'low' : 'known'}`;
      if (month.photos?.length) { const image = document.createElement('img'); image.className = 'month-card-image'; image.src = month.photos[0]; image.alt = (month.alt || [])[0] || `${month.title}回憶相片`; image.loading = 'lazy'; card.append(image); }
      const body = document.createElement('div'); body.className = 'month-card-body';
      const small = document.createElement('small'); const strong = document.createElement('strong'); const copy = document.createElement('p');
      small.textContent = `MONTH ${String(index+1).padStart(2,'0')} · ${monthRange(index)}`; strong.textContent = month.title; copy.textContent = month.copy;
      body.append(small,strong,copy); card.append(body); elements.timeline.append(card);
    });
  }
  function revealFullSite() {
    if (Date.now() < REVEAL_AT.getTime() || localStorage.getItem(keys.complete) !== 'yes') return;
    clearInterval(countdownTimer); renderReleasedStars(); renderTimeline(); elements.section.hidden = false; closeGate({returnToPortal:false}); setActiveNav('anniversary');
    requestAnimationFrame(() => elements.section.scrollIntoView({behavior:'smooth'}));
  }

  elements.form.addEventListener('submit', event => {
    event.preventDefault(); const guess = elements.pass.value.trim();
    window.dispatchEvent(new CustomEvent('sunny:guess-attempt',{detail:{experience:'anniversary',stage:passStage,guess,noteSelector:'#anniversaryLogNote'}}));
    const answer = passStage === 1 ? FIRST_PASSWORD : SECOND_PASSWORD;
    if (normalize(guess) === normalize(answer)) {
      elements.error.textContent = '';
      if (passStage === 1) { if (sessionStorage.getItem(keys.stars) === null) sessionStorage.setItem(keys.stars,'0'); showStarGame(); }
      else { if (sessionStorage.getItem(keys.months) === null) saveStamped(new Set()); showMonthGame(); }
      return;
    }
    const {matched,placed,total} = scoreGuess(guess,answer);
    elements.error.textContent = `答案共有 ${total} 個字元。今次估中 ${matched} 個，其中 ${placed} 個位置正確。再試一次 💕`; elements.pass.select();
  });

  elements.enter.addEventListener('click',openGate);
  elements.nav.addEventListener('click',event => { if (!(localStorage.getItem(keys.complete) === 'yes' && Date.now() >= REVEAL_AT.getTime())) event.preventDefault(); openGate(); });
  elements.close.addEventListener('click',() => closeGate()); elements.previewBack.addEventListener('click',() => closeGate());
  if (localStorage.getItem(keys.complete) === 'yes' && Date.now() >= REVEAL_AT.getTime()) {
    renderReleasedStars();
    renderTimeline();
    elements.section.hidden = false;
  }
})();
