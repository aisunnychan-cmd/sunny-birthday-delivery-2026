(() => {
  const ACCESS_VERSION = 'two-stage-love-games-v5';
  const FIRST_PASSWORD = '只准芷瑩入場';
  const SECOND_PASSWORD = '因為我❤️你';
  const CHASE_TOTAL = 12;
  const HEART_TOTAL = 24;

  function splitGraphemes(value) {
    const normalized = String(value ?? '').normalize('NFC');
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return [...new Intl.Segmenter('zh-Hant', {granularity: 'grapheme'}).segment(normalized)]
        .map(item => item.segment);
    }
    const result = [];
    for (const character of Array.from(normalized)) {
      if ((character === '\uFE0E' || character === '\uFE0F') && result.length) {
        result[result.length - 1] += character;
      } else {
        result.push(character);
      }
    }
    return result;
  }

  function graphemeKey(value) {
    return value.replace(/[\uFE0E\uFE0F]/gu, '');
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
    const placed = guessed.reduce(
      (total, character, index) => total + Number(character === expected[index]),
      0
    );
    return {matched, placed, total: expected.length};
  }

  function passphraseMatches(guess, answer) {
    const normalize = value => splitGraphemes(String(value).trim()).map(graphemeKey).join('');
    return normalize(guess) === normalize(answer);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {splitGraphemes, scoreGuess, passphraseMatches};
  }
  if (typeof document === 'undefined') return;

  const birthday = new Date('2026-10-04T00:00:00+08:00');
  const now = new Date();
  const difference = birthday - now;
  document.querySelector('#countdown').textContent = difference <= 0
    ? '今日正式配送中'
    : `距離派送還有 ${Math.ceil(difference / 86400000)} 日`;
  document.querySelector('#days').textContent = `已累積 ${Math.max(0, Math.floor((now - new Date('2024-12-12T00:00:00+08:00')) / 86400000))} 日`;

  const elements = {
    gate: document.querySelector('#entryGate'),
    card: document.querySelector('#entryCard'),
    form: document.querySelector('#entryForm'),
    pass: document.querySelector('#entryPass'),
    error: document.querySelector('#entryError'),
    stage: document.querySelector('#entryStage'),
    title: document.querySelector('#entryTitle'),
    copy: document.querySelector('#entryCopy'),
    label: document.querySelector('#entryLabel'),
    button: document.querySelector('#entryButton'),
    poster: document.querySelector('#entryPoster'),
    chase: document.querySelector('#loveChase'),
    chaseTarget: document.querySelector('#loveTarget'),
    chaseCount: document.querySelector('#chaseCount'),
    chaseBar: document.querySelector('#chaseBar'),
    chasePlayfield: document.querySelector('.love-playfield'),
    chaseLive: document.querySelector('#chaseLive'),
    heart: document.querySelector('#heartChallenge'),
    heartButton: document.querySelector('#heartButton'),
    heartCount: document.querySelector('#heartCount'),
    heartBar: document.querySelector('#heartBar'),
    heartStage: document.querySelector('.heart-stage'),
    finale: document.querySelector('#loveFinale'),
    finaleWords: document.querySelector('#finaleWords'),
    skip: document.querySelector('#skipFinale')
  };

  const stateKeys = {
    version: 'sunny-access-version',
    step: 'sunny-access-step-v5',
    chase: 'sunny-love-chase-v5',
    heart: 'sunny-heart-count-v5',
    complete: 'sunny-entry-ok'
  };
  let accessStage = 1;
  let chaseLocked = false;
  let heartLocked = false;
  let finaleTimer;

  const chasePositions = [
    [18, 25], [72, 30], [42, 43], [80, 55], [22, 62], [58, 72],
    [35, 82], [73, 83], [15, 47], [60, 20], [46, 58], [27, 74]
  ];
  const decoyPositions = [
    [[68, 28], [38, 72]],
    [[20, 28], [76, 72]],
    [[72, 42], [18, 78]]
  ];
  const chaseFeedback = [
    '第一個捉到啦 💕', '好快手喎', '愛你又走咗去第二邊', '熱身完成',
    '捉到我啦', '再嚟一次', '差少少就追到晒', '開始有煙幕啦',
    '留意會發光嗰個', '假嘅會走開㗎', '最後兩個，加油', '第一關愛意已確認'
  ];
  const heartPhrases = [
    '心意正在充電', '每一下都係掛住你', '偷偷加多一點鍾意', '今日都係偏愛你',
    '想抱你一下', '心動訊號已收到', '再近一點', '只准你收下',
    '愛意開始滿瀉', '最後幾下啦', '準備爆發', '全部愛意已送達'
  ];

  function buildProgressiveEffects() {
    elements.chaseMessage = document.createElement('p');
    elements.chaseMessage.className = 'chase-feedback';
    elements.chaseMessage.setAttribute('aria-live', 'polite');
    elements.chaseMessage.textContent = '先捉住第一個「愛你」';
    elements.chasePlayfield.before(elements.chaseMessage);

    elements.chaseComplete = document.createElement('div');
    elements.chaseComplete.className = 'chase-complete-card';
    elements.chaseComplete.innerHTML = '<span>♥</span><strong>第一關愛意已確認</strong>';
    elements.chase.append(elements.chaseComplete);

    const heartBase = elements.heartButton.querySelector('span');
    heartBase.className = 'heart-base';
    elements.heartFill = document.createElement('span');
    elements.heartFill.className = 'heart-fill';
    elements.heartFill.textContent = '♥';
    elements.heartFill.setAttribute('aria-hidden', 'true');
    elements.heartButton.append(elements.heartFill);

    elements.heartMessage = document.createElement('p');
    elements.heartMessage.className = 'heart-message';
    elements.heartMessage.setAttribute('aria-live', 'polite');
    elements.heartMessage.textContent = heartPhrases[0];

    elements.heartStamps = document.createElement('div');
    elements.heartStamps.className = 'heart-stamps';
    ['心動', '掛念', '偏愛', '送達'].forEach(label => {
      const stamp = document.createElement('span');
      stamp.textContent = label;
      elements.heartStamps.append(stamp);
    });
    elements.heartStage.append(elements.heartMessage, elements.heartStamps);
  }

  buildProgressiveEffects();

  function readCount(key, maximum) {
    const value = Number.parseInt(sessionStorage.getItem(key) || '0', 10);
    return Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0;
  }

  function resetVersion() {
    if (sessionStorage.getItem(stateKeys.version) === ACCESS_VERSION) return;
    Object.values(stateKeys).forEach(key => sessionStorage.removeItem(key));
    sessionStorage.removeItem('sunny-gift-ok');
    sessionStorage.setItem(stateKeys.version, ACCESS_VERSION);
    sessionStorage.setItem(stateKeys.step, 'first');
  }

  function hideEntryPanels() {
    [elements.card, elements.chase, elements.heart, elements.finale].forEach(panel => {
      panel.hidden = true;
    });
  }

  function showPanel(panel) {
    hideEntryPanels();
    panel.hidden = false;
  }

  function enterService() {
    clearTimeout(finaleTimer);
    elements.gate.classList.add('hide');
    document.body.classList.remove('locked');
    elements.pass.blur();
  }

  function showHome() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.toggle('active', screen.id === 'home'));
    document.querySelectorAll('[data-go]').forEach(button => button.classList.toggle('active', button.dataset.go === 'home'));
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  function showFirstCheck() {
    accessStage = 1;
    showPanel(elements.card);
    elements.poster.src = 'images/memory-01.webp';
    elements.stage.textContent = 'FIRST CHECK · 01 / 02';
    elements.title.innerHTML = '先核對第一個<br>美好暗號';
    elements.copy.textContent = '提示：通行證持有人只有一位 💕';
    elements.label.textContent = '第一個入口口令';
    elements.button.textContent = '進入下一頁';
    elements.pass.value = '';
    elements.error.textContent = '';
    setTimeout(() => elements.pass.focus(), 50);
  }

  function showSecondCheck() {
    accessStage = 2;
    sessionStorage.setItem(stateKeys.step, 'second');
    showPanel(elements.card);
    elements.poster.src = 'images/memory-02.webp';
    elements.stage.textContent = 'SECOND CHECK · 02 / 02';
    elements.title.innerHTML = '再核對一個<br>只屬於你的暗號';
    elements.copy.textContent = '第二個口令確認後，還有最後一個愛心挑戰。';
    elements.label.textContent = '第二個入口口令';
    elements.button.textContent = '確認第二個暗號';
    elements.pass.value = '';
    elements.error.textContent = '';
    setTimeout(() => elements.pass.focus(), 50);
  }

  function updateChase() {
    const count = readCount(stateKeys.chase, CHASE_TOTAL);
    const [left, top] = chasePositions[Math.min(count, CHASE_TOTAL - 1)];
    elements.chaseCount.textContent = `已捉到 ${count} / ${CHASE_TOTAL}`;
    elements.chaseBar.style.width = `${(count / CHASE_TOTAL) * 100}%`;
    elements.chaseTarget.style.left = `${left}%`;
    elements.chaseTarget.style.top = `${top}%`;
    elements.chaseTarget.style.setProperty('--target-rotate', `${((count % 5) - 2) * 6}deg`);
    elements.chaseTarget.classList.toggle('playful', count >= 4 && count < 8);
    elements.chaseTarget.classList.toggle('glowing', count >= 8 && count < 11);
    elements.chaseTarget.classList.toggle('final-target', count === 11);
    elements.chaseMessage.textContent = count === 0
      ? '先捉住第一個「愛你」'
      : count < 4
        ? '愛你留下咗一條心心軌跡'
        : count < 8
          ? '佢開始識得轉身走避啦'
          : count < 11
            ? '小心煙幕：撳會發光嗰個'
            : '最後一個縮細咗，捉實佢！';
    renderDecoys(count);
  }

  function showLoveChase() {
    if (readCount(stateKeys.chase, CHASE_TOTAL) === CHASE_TOTAL) {
      showSecondCheck();
      return;
    }
    sessionStorage.setItem(stateKeys.step, 'chase');
    showPanel(elements.chase);
    updateChase();
    setTimeout(() => elements.chaseTarget.focus({preventScroll: true}), 50);
  }

  function spawnParticles(origin, amount = 5) {
    const holder = origin.closest('.entry-game') || elements.gate;
    const rect = origin.getBoundingClientRect();
    const holderRect = holder.getBoundingClientRect();
    for (let index = 0; index < amount; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'love-particle';
      particle.textContent = index % 2 ? '♥' : '♡';
      particle.style.left = `${rect.left - holderRect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top - holderRect.top + rect.height / 2}px`;
      particle.style.setProperty('--particle-x', `${(index - (amount - 1) / 2) * 24}px`);
      particle.style.setProperty('--particle-y', `${-45 - (index % 3) * 20}px`);
      holder.append(particle);
      particle.addEventListener('animationend', () => particle.remove(), {once: true});
    }
  }

  function haptic(pattern) {
    if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
  }

  function leaveLoveTrail(origin) {
    const rect = origin.getBoundingClientRect();
    const holderRect = elements.chasePlayfield.getBoundingClientRect();
    const trail = document.createElement('span');
    trail.className = 'love-trail';
    trail.textContent = '♥';
    trail.style.left = `${rect.left - holderRect.left + rect.width / 2}px`;
    trail.style.top = `${rect.top - holderRect.top + rect.height / 2}px`;
    elements.chasePlayfield.append(trail);
    trail.addEventListener('animationend', () => trail.remove(), {once: true});
  }

  function clearDecoys() {
    elements.chasePlayfield.querySelectorAll('.love-decoy').forEach(decoy => decoy.remove());
  }

  function renderDecoys(count) {
    clearDecoys();
    if (count < 8 || count > 10) return;
    decoyPositions[count - 8].forEach(([left, top], index) => {
      const decoy = document.createElement('button');
      decoy.type = 'button';
      decoy.className = 'love-target love-decoy';
      decoy.textContent = '愛你';
      decoy.style.left = `${left}%`;
      decoy.style.top = `${top}%`;
      decoy.style.setProperty('--target-rotate', `${index ? 8 : -8}deg`);
      decoy.addEventListener('click', () => {
        decoy.classList.remove('wrong');
        void decoy.offsetWidth;
        decoy.classList.add('wrong');
        elements.chaseMessage.textContent = '呢個係煙幕，再搵下會發光嗰個 💕';
        elements.chaseLive.textContent = '撳中煙幕，請尋找發光的愛你';
        haptic(15);
      });
      elements.chasePlayfield.append(decoy);
    });
  }

  function catchLove() {
    if (chaseLocked) return;
    chaseLocked = true;
    const count = Math.min(CHASE_TOTAL, readCount(stateKeys.chase, CHASE_TOTAL) + 1);
    sessionStorage.setItem(stateKeys.chase, String(count));
    clearDecoys();
    leaveLoveTrail(elements.chaseTarget);
    elements.chaseTarget.classList.remove('caught');
    void elements.chaseTarget.offsetWidth;
    elements.chaseTarget.classList.add('caught');
    spawnParticles(elements.chaseTarget, 6);
    haptic(count === CHASE_TOTAL ? [25, 35, 70] : 18);
    elements.chaseCount.textContent = `已捉到 ${count} / ${CHASE_TOTAL}`;
    elements.chaseBar.style.width = `${(count / CHASE_TOTAL) * 100}%`;
    elements.chaseMessage.textContent = chaseFeedback[count - 1];
    elements.chaseLive.textContent = `${chaseFeedback[count - 1]}，已捉到 ${count} 個愛你`;
    if (count === CHASE_TOTAL) {
      elements.chase.classList.add('complete');
      setTimeout(() => {
        elements.chase.classList.remove('complete');
        showSecondCheck();
        chaseLocked = false;
      }, 1050);
      return;
    }
    setTimeout(() => {
      updateChase();
      elements.chaseTarget.classList.remove('caught');
      elements.chaseTarget.focus({preventScroll: true});
      chaseLocked = false;
    }, 240);
  }

  function updateHeart() {
    const count = readCount(stateKeys.heart, HEART_TOTAL);
    const ratio = count / HEART_TOTAL;
    const phase = Math.min(4, Math.floor(count / 6) + 1);
    elements.heartCount.textContent = `${count} / ${HEART_TOTAL}`;
    elements.heartBar.style.width = `${ratio * 100}%`;
    elements.heartButton.style.setProperty('--heart-scale', String(1 + ratio * 0.18));
    elements.heartButton.style.setProperty('--heart-progress', `${ratio * 360}deg`);
    elements.heartButton.style.setProperty('--heart-clip', `${100 - ratio * 100}%`);
    elements.heart.classList.remove('phase-1', 'phase-2', 'phase-3', 'phase-4', 'urgent');
    elements.heart.classList.add(`phase-${phase}`);
    if (count >= 18 && count < HEART_TOTAL) elements.heart.classList.add('urgent');
    const phraseIndex = count < 6
      ? Math.min(3, count % 4)
      : count < 12
        ? 4 + (count % 4)
        : count < 18
          ? 5 + (count % 4)
          : 8 + (count % 4);
    elements.heartMessage.textContent = count === HEART_TOTAL
      ? heartPhrases[11]
      : heartPhrases[Math.min(11, phraseIndex)];
    [...elements.heartStamps.children].forEach((stamp, index) => {
      stamp.classList.toggle('active', count >= (index + 1) * 6);
    });
  }

  function showHeartChallenge() {
    if (readCount(stateKeys.heart, HEART_TOTAL) === HEART_TOTAL) {
      showFinale();
      return;
    }
    sessionStorage.setItem(stateKeys.step, 'heart');
    showPanel(elements.heart);
    updateHeart();
    setTimeout(() => elements.heartButton.focus({preventScroll: true}), 50);
  }

  function createFinaleWords() {
    elements.finaleWords.replaceChildren();
    const positions = [
      [12, 18], [62, 12], [35, 28], [76, 35], [8, 45], [48, 48],
      [68, 58], [20, 65], [42, 75], [78, 80], [15, 88], [55, 90],
      [30, 12], [84, 22], [5, 73], [60, 38]
    ];
    positions.forEach(([left, top], index) => {
      const word = document.createElement('span');
      word.className = 'finale-love-word';
      word.textContent = '愛你';
      word.style.left = `${left}%`;
      word.style.top = `${top}%`;
      word.style.animationDelay = `${(index % 8) * 0.24}s`;
      word.style.setProperty('--love-rotate', `${(index % 5 - 2) * 7}deg`);
      elements.finaleWords.append(word);
    });
  }

  function finishFinale() {
    sessionStorage.setItem(stateKeys.complete, 'yes');
    sessionStorage.setItem(stateKeys.step, 'complete');
    showHome();
    enterService();
  }

  function showFinale() {
    sessionStorage.setItem(stateKeys.step, 'finale');
    showPanel(elements.finale);
    createFinaleWords();
    setTimeout(() => elements.skip.focus({preventScroll: true}), 50);
    finaleTimer = setTimeout(finishFinale, 5000);
  }

  function pressHeart() {
    if (heartLocked) return;
    heartLocked = true;
    const count = Math.min(HEART_TOTAL, readCount(stateKeys.heart, HEART_TOTAL) + 1);
    sessionStorage.setItem(stateKeys.heart, String(count));
    elements.heartButton.classList.remove('pressed');
    void elements.heartButton.offsetWidth;
    elements.heartButton.classList.add('pressed');
    spawnParticles(elements.heartButton, count === HEART_TOTAL ? 14 : 5);
    haptic(count === HEART_TOTAL ? [35, 30, 80] : count >= 18 ? 24 : 12);
    updateHeart();
    if (count === HEART_TOTAL) {
      setTimeout(() => elements.heart.classList.add('complete'), 240);
      setTimeout(showFinale, 1150);
      return;
    }
    setTimeout(() => {
      elements.heartButton.classList.remove('pressed');
      heartLocked = false;
    }, 150);
  }

  function showScore(value, answer) {
    const {matched, placed, total} = scoreGuess(value, answer);
    elements.error.textContent = `今次估中咗 ${matched} / ${total} 個字，其中 ${placed} 個位置正確。再試一次 💕`;
    elements.pass.select();
  }

  elements.form.addEventListener('submit', event => {
    event.preventDefault();
    const value = elements.pass.value.trim();
    if (accessStage === 1 && passphraseMatches(value, FIRST_PASSWORD)) {
      sessionStorage.setItem(stateKeys.chase, '0');
      showLoveChase();
    } else if (accessStage === 2 && passphraseMatches(value, SECOND_PASSWORD)) {
      sessionStorage.setItem(stateKeys.heart, '0');
      showHeartChallenge();
    } else {
      showScore(value, accessStage === 1 ? FIRST_PASSWORD : SECOND_PASSWORD);
    }
  });
  elements.chaseTarget.addEventListener('click', catchLove);
  elements.heartButton.addEventListener('click', pressHeart);
  elements.skip.addEventListener('click', finishFinale);

  document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.screen').forEach(screen => screen.classList.toggle('active', screen.id === button.dataset.go));
      document.querySelectorAll('[data-go]').forEach(item => item.classList.toggle('active', item === button));
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  });

  resetVersion();
  if (sessionStorage.getItem(stateKeys.complete) === 'yes') {
    showHome();
    enterService();
  } else {
    const step = sessionStorage.getItem(stateKeys.step) || 'first';
    if (step === 'chase') showLoveChase();
    else if (step === 'second') showSecondCheck();
    else if (step === 'heart') showHeartChallenge();
    else if (step === 'finale') showFinale();
    else showFirstCheck();
  }
})();
