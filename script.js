// Daily 5 Words app logic
// This app keeps learned words in LocalStorage and generates 5 words based on today's date.

const STORAGE_KEYS = {
  learnedWords: 'daily5words_learned_words',
  learnedByDate: 'daily5words_learned_by_date',
};

const UI = {
  dateLabel: document.getElementById('todayDate'),
  todayWords: document.getElementById('todayWords'),
  learnedTodayCount: document.getElementById('learnedTodayCount'),
  learnedWordsContainer: document.getElementById('learnedWordsContainer'),
  toggleReviewBtn: document.getElementById('toggleReviewBtn'),
  wordCardTemplate: document.getElementById('wordCardTemplate'),
};

let allWords = [];
let todaysWords = [];

// Fallback data is used if browser blocks loading words.json (common in file:// mode).
const FALLBACK_WORDS =
[
  {"word":"Brave","meaning":"not afraid to do hard things","example":"She was brave and spoke in front of the class.","pronunciation":"brayv"},
  {"word":"Calm","meaning":"quiet and not worried","example":"Take a deep breath and stay calm.","pronunciation":"kahm"},
  {"word":"Tiny","meaning":"very small","example":"A tiny bird sat on the window.","pronunciation":"tie-nee"},
  {"word":"Quick","meaning":"fast","example":"He gave a quick answer.","pronunciation":"kwik"},
  {"word":"Kind","meaning":"good and caring to others","example":"My teacher is very kind.","pronunciation":"kynd"},
  {"word":"Lucky","meaning":"having good things happen by chance","example":"We were lucky to catch the bus.","pronunciation":"luh-kee"},
  {"word":"Honest","meaning":"always telling the truth","example":"Please be honest with your friend.","pronunciation":"on-ist"},
  {"word":"Fresh","meaning":"new and clean","example":"I like fresh orange juice in the morning.","pronunciation":"fresh"},
  {"word":"Simple","meaning":"easy to understand","example":"This game has simple rules.","pronunciation":"sim-pul"},
  {"word":"Bright","meaning":"full of light","example":"The room is bright in the afternoon.","pronunciation":"brite"},
  {"word":"Careful","meaning":"thinking before doing something","example":"Be careful when you cross the street.","pronunciation":"kair-ful"},
  {"word":"Happy","meaning":"feeling good and joyful","example":"I feel happy when I listen to music.","pronunciation":"hap-ee"},
  {"word":"Polite","meaning":"showing good manners","example":"It is polite to say thank you.","pronunciation":"puh-lite"},
  {"word":"Neat","meaning":"clean and organized","example":"Her desk is always neat.","pronunciation":"neet"},
  {"word":"Strong","meaning":"having much power","example":"He is strong enough to lift the box.","pronunciation":"strawng"},
  {"word":"Soft","meaning":"not hard","example":"This pillow is soft and comfortable.","pronunciation":"sawft"},
  {"word":"Wide","meaning":"having a lot of space from side to side","example":"The road is wide and safe.","pronunciation":"wyde"},
  {"word":"Narrow","meaning":"not wide","example":"We walked through a narrow street.","pronunciation":"nair-oh"},
  {"word":"Early","meaning":"before the usual time","example":"She arrived early for the meeting.","pronunciation":"ur-lee"},
  {"word":"Late","meaning":"after the expected time","example":"The train is five minutes late.","pronunciation":"layt"},
  {"word":"Useful","meaning":"helpful for a purpose","example":"This note is very useful for study.","pronunciation":"yoos-ful"},
  {"word":"Rare","meaning":"not common","example":"It is rare to see snow here.","pronunciation":"rair"},
  {"word":"Common","meaning":"happening often","example":"Colds are common in winter.","pronunciation":"kom-uhn"},
  {"word":"Friendly","meaning":"kind and easy to talk to","example":"Our new neighbor is friendly.","pronunciation":"frend-lee"},
  {"word":"Noisy","meaning":"making a lot of sound","example":"The market is noisy at night.","pronunciation":"noy-zee"},
  {"word":"Quiet","meaning":"with little sound","example":"The library is very quiet.","pronunciation":"kwy-uht"},
  {"word":"Crowded","meaning":"full of many people","example":"The bus was crowded this morning.","pronunciation":"krow-did"},
  {"word":"Empty","meaning":"having nothing inside","example":"The bottle is empty now.","pronunciation":"emp-tee"},
  {"word":"Clever","meaning":"quick at learning and understanding","example":"She found a clever way to solve it.","pronunciation":"klev-er"},
  {"word":"Curious","meaning":"wanting to know more","example":"Children are curious about the world.","pronunciation":"kyur-ee-us"},
  {"word":"Patient","meaning":"able to wait calmly","example":"Please be patient in the long line.","pronunciation":"pay-shunt"},
  {"word":"Proud","meaning":"feeling happy about your success","example":"I am proud of your hard work.","pronunciation":"prowd"},
  {"word":"Busy","meaning":"having a lot to do","example":"I am busy with homework tonight.","pronunciation":"biz-ee"},
  {"word":"Lazy","meaning":"not wanting to work","example":"Don’t be lazy before exams.","pronunciation":"lay-zee"},
  {"word":"Safe","meaning":"free from danger","example":"This place is safe for children.","pronunciation":"sayf"},
  {"word":"Dangerous","meaning":"likely to cause harm","example":"It is dangerous to text while driving.","pronunciation":"dayn-jur-us"},
  {"word":"Warm","meaning":"a little hot","example":"The soup is warm and tasty.","pronunciation":"wawm"},
  {"word":"Cool","meaning":"a little cold","example":"The evening air feels cool.","pronunciation":"kool"},
  {"word":"Dry","meaning":"not wet","example":"Keep your clothes dry in the rain.","pronunciation":"dry"},
  {"word":"Wet","meaning":"covered with water","example":"My shoes are wet after the storm.","pronunciation":"wet"},
  {"word":"Smart","meaning":"good at thinking and learning","example":"She is smart and asks great questions.","pronunciation":"smart"},
  {"word":"Gentle","meaning":"soft and kind in action","example":"Be gentle with the baby kitten.","pronunciation":"jen-tl"},
  {"word":"Rich","meaning":"having a lot of money","example":"That business owner is very rich.","pronunciation":"rich"},
  {"word":"Poor","meaning":"having little money","example":"The poor family needed help.","pronunciation":"poor"},
  {"word":"Modern","meaning":"new and current","example":"This school has modern classrooms.","pronunciation":"mod-urn"},
  {"word":"Ancient","meaning":"very old, from long ago","example":"We visited an ancient temple.","pronunciation":"ayn-shunt"},
  {"word":"Local","meaning":"from the same area","example":"I buy local fruit from the market.","pronunciation":"loh-kul"},
  {"word":"Global","meaning":"related to the whole world","example":"Climate change is a global issue.","pronunciation":"gloh-bul"},
  {"word":"Future","meaning":"the time that is coming","example":"She wants to be a doctor in the future.","pronunciation":"fyoo-cher"},
  {"word":"Present","meaning":"happening now","example":"Try to enjoy the present moment.","pronunciation":"prez-unt"},
  {"word":"Borrow","meaning":"to take and use for a short time","example":"Can I borrow your pen?","pronunciation":"bor-oh"},
  {"word":"Return","meaning":"to give something back","example":"Please return the book tomorrow.","pronunciation":"ri-turn"},
  {"word":"Build","meaning":"to make something by putting parts together","example":"They will build a new bridge.","pronunciation":"bild"},
  {"word":"Repair","meaning":"to fix something broken","example":"We need to repair the old chair.","pronunciation":"ri-pair"},
  {"word":"Choose","meaning":"to pick one option","example":"Choose a color you like.","pronunciation":"chooz"},
  {"word":"Improve","meaning":"to make better","example":"Practice every day to improve your English.","pronunciation":"im-proov"}
];

function getTodayKey() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getDaySeed(dateKey) {
  // Convert date text into a repeatable number for stable daily selection.
  return dateKey.split('-').reduce((sum, part) => sum + Number(part), 0);
}

function getStoredJSON(key, fallbackValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallbackValue;

  try {
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function loadWords() {
  try {
    const response = await fetch('./words.json');
    if (!response.ok) throw new Error('Could not load words.json');
    const data = await response.json();
    if (!Array.isArray(data) || data.length < 5) {
      throw new Error('words.json needs at least 5 words.');
    }
    return data;
  } catch {
    return FALLBACK_WORDS;
  }
}

function pickTodaysWords(words, dateKey) {
  const selected = [];
  const usedIndexes = new Set();
  const seed = getDaySeed(dateKey);

  // Pick exactly 5 unique words for today.
  for (let i = 0; i < 5; i += 1) {
    let idx = (seed * (i + 3) + i * 17) % words.length;
    while (usedIndexes.has(idx)) {
      idx = (idx + 1) % words.length;
    }
    usedIndexes.add(idx);
    selected.push(words[idx]);
  }

  return selected;
}

function formatLongDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isWordLearned(wordText) {
  const learnedWords = getStoredJSON(STORAGE_KEYS.learnedWords, []);
  return learnedWords.some((w) => w.word === wordText);
}

function markWordAsLearned(wordObj) {
  const learnedWords = getStoredJSON(STORAGE_KEYS.learnedWords, []);
  const alreadyExists = learnedWords.some((item) => item.word === wordObj.word);

  if (!alreadyExists) {
    learnedWords.push({ ...wordObj, learnedOn: getTodayKey() });
    saveJSON(STORAGE_KEYS.learnedWords, learnedWords);
  }

  const learnedByDate = getStoredJSON(STORAGE_KEYS.learnedByDate, {});
  const todayKey = getTodayKey();
  const todayLearned = new Set(learnedByDate[todayKey] || []);
  todayLearned.add(wordObj.word);
  learnedByDate[todayKey] = [...todayLearned];
  saveJSON(STORAGE_KEYS.learnedByDate, learnedByDate);
}

function getLearnedCountForToday() {
  const learnedByDate = getStoredJSON(STORAGE_KEYS.learnedByDate, {});
  const today = getTodayKey();
  return (learnedByDate[today] || []).length;
}

function renderTodayWords() {
  UI.todayWords.innerHTML = '';

  todaysWords.forEach((wordObj) => {
    const card = UI.wordCardTemplate.content.firstElementChild.cloneNode(true);

    card.querySelector('.word').textContent = wordObj.word;
    card.querySelector('.pronunciation').textContent = `/${wordObj.pronunciation}/`;
    card.querySelector('.meaning').textContent = wordObj.meaning;
    card.querySelector('.example').textContent = wordObj.example;

    const button = card.querySelector('.learn-btn');
    const learned = isWordLearned(wordObj.word);

    if (learned) {
      button.textContent = 'Learned ✅';
      button.disabled = true;
    }

    button.addEventListener('click', () => {
      markWordAsLearned(wordObj);
      button.textContent = 'Learned ✅';
      button.disabled = true;
      updateLearnedTodayCount();
      renderLearnedWords();
    });

    UI.todayWords.appendChild(card);
  });
}

function updateLearnedTodayCount() {
  const count = getLearnedCountForToday();
  UI.learnedTodayCount.textContent = `${count} / 5 learned`;
}

function renderLearnedWords() {
  const learnedWords = getStoredJSON(STORAGE_KEYS.learnedWords, []);

  if (!learnedWords.length) {
    UI.learnedWordsContainer.innerHTML = '<p class="empty-note">No learned words yet. Start with today\'s 5 words!</p>';
    return;
  }

  const sorted = [...learnedWords].sort((a, b) => a.word.localeCompare(b.word));
  const listItems = sorted
    .map((item) => `<li><strong>${item.word}</strong> — ${item.meaning} <em>(learned: ${item.learnedOn})</em></li>`)
    .join('');

  UI.learnedWordsContainer.innerHTML = `<ol class="review-list">${listItems}</ol>`;
}

function setupReviewToggle() {
  UI.toggleReviewBtn.addEventListener('click', () => {
    UI.learnedWordsContainer.classList.toggle('hidden');
    const isHidden = UI.learnedWordsContainer.classList.contains('hidden');
    UI.toggleReviewBtn.textContent = isHidden ? 'Show Review List' : 'Hide Review List';
  });
}

async function init() {
  UI.dateLabel.textContent = `Today: ${formatLongDate(new Date())}`;

  allWords = await loadWords();
  const todayKey = getTodayKey();
  todaysWords = pickTodaysWords(allWords, todayKey);

  renderTodayWords();
  updateLearnedTodayCount();
  renderLearnedWords();
  setupReviewToggle();
}

init();
