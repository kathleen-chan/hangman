const titleText = document.getElementById('title-text');
const navbar = document.querySelector('.navbar');
const footer = document.querySelector('.footer');
const body = document.body;
const gameContainer = document.querySelector('.game-container');
const menu = document.getElementById('menu');
const backBtn = document.getElementById('back');
const settings = document.getElementById('settings');
const settingsPage = document.getElementById('settings-page');
const backSettings = document.getElementById('back-settings');
const bgMusic = document.getElementById('bg-music');
const soundPrev = document.getElementById('sound-prev');
const soundNext = document.getElementById('sound-next');
const soundLabel = document.querySelector('.sound-label');
const soundSlider = document.getElementById('sound');
const leaderboardBtn = document.getElementById('leaderboard');
const leaderboardPage = document.getElementById('leaderboard-page');
const backLeaderboard = document.getElementById('back-leaderboard');
const registerPlayerBtn = document.getElementById('register-btn');
const removePlayerBtn = document.getElementById('remove-btn');
const registerPage = document.getElementById('register-page');
const registerPrev = document.getElementById('register-prev');
const registerNext = document.getElementById('register-next');
const charDisplay = document.getElementById('character-display');
const confirmRegister = document.getElementById('confirm-register');
const username = document.getElementById('username');
const backRegister = document.getElementById('back-register');
const playBtn = document.getElementById('play');
const playPage = document.getElementById('play-page');
const playMathBtn = document.getElementById('play-math');
const playClickerBtn = document.getElementById('play-clicker');
const playFillerBtn = document.getElementById('play-filler');
const playTypeBtn = document.getElementById('play-type');
const playHangmanBtn = document.getElementById('play-hangman');
const backPlay = document.getElementById('back-play');

// Theme
const themeConfig = {
  'Red': {
    bgColor: '#f85d6d', // Red
    textColor: '#ffb752', // Yellow
    hoverColor: '#f85d6d' // Red
  },
  'Yellow': {
    bgColor: '#ffb752', // Yellow
    textColor: '#f85d6d', // Red
    hoverColor: '#ffb752' // Yellow
  },
  'Green': {
    bgColor: '#a1fcac', // Green
    textColor: '#f85d6d', // Red
    hoverColor: '#a1fcac' // Green
  },
  'Blue': {
    bgColor: '#7fa2f5', // Blue
    textColor: '#ffb752', // Yellow
    hoverColor: '#7fa2f5' // Blue
  }
};

function applyTheme(theme) {
  const themeSettings = themeConfig[theme] || themeConfig.Yellow;
  document.documentElement.style.setProperty('--theme-bg-color', themeSettings.bgColor);

  navbar.style.backgroundColor = themeSettings.bgColor;
  footer.style.backgroundColor = themeSettings.bgColor;
  menu.style.backgroundColor = themeSettings.bgColor;
  settingsPage.style.backgroundColor = themeSettings.bgColor;
  leaderboardPage.style.backgroundColor = themeSettings.bgColor;
  registerPage.style.backgroundColor = themeSettings.bgColor;
  titleText.style.color = themeSettings.textColor;

  let complementaryColor = theme === 'Red' || theme === 'Blue' ? '#ffb752' : '#f85d6d';

  const styleId = 'theme-hover-styles';
  let hoverStyle = document.getElementById(styleId);
  if (!hoverStyle) {
    hoverStyle = document.createElement('style');
    hoverStyle.id = styleId;
    document.head.appendChild(hoverStyle);
  }

  hoverStyle.textContent = `
    .menu-item:hover,
    .settings-back:hover,
    .leaderboard-back:hover,
    .register-back:hover,
    .game-option:hover,
    .arrow:hover {
      color: ${complementaryColor};
    }
    #sound { accent-color: ${complementaryColor}; }
    .register-button { background-color: ${complementaryColor}; }
    #title-text:hover { color: ${themeSettings.hoverColor} !important; }
  `;
}

// Default theme
applyTheme('Yellow');

document.getElementById('theme').addEventListener('change', function () {
  const theme = this.value;
  if (theme) applyTheme(theme);
});

// Changing starter screen color when 'Brainrot! ... ish!' is clicked
let isSqueezed = false;
titleText.addEventListener('click', function () {
  if (!isSqueezed) {
    navbar.classList.add('squeeze-navbar');
    body.classList.add('squeeze-bg');
    gameContainer.style.opacity = '0';
    setTimeout(() => menu.style.display = 'flex', 500);
  }
  isSqueezed = true;
});

backBtn.addEventListener('click', function () {
  menu.style.display = 'none';
  navbar.classList.remove('squeeze-navbar');
  body.classList.remove('squeeze-bg');
  gameContainer.style.opacity = '1';
  isSqueezed = false;
});

// Settings
settings.addEventListener('click', function () {
  menu.style.display = 'none';
  settingsPage.style.display = 'flex';
  const themeSelect = document.getElementById('theme');
  themeSelect.selectedIndex = 0;
});

backSettings.addEventListener('click', function () {
  settingsPage.style.display = 'none';
  menu.style.display = 'flex';
});

// Sound
const audioFiles = [
  { name: "Intro", file: "audio/intro.mp3" },
  { name: "Showdown!", file: "audio/vibes.mp3" }
];

let currentTrack = 0;
let audioInitialized = false;

function loadTrack(index) {
  currentTrack = index;
  bgMusic.src = audioFiles[index].file;
  soundLabel.textContent = audioFiles[index].name;
  preloadAdjacentTracks();
}

function preloadAdjacentTracks() {
  const prevIndex = (currentTrack - 1 + audioFiles.length) % audioFiles.length;
  const nextIndex = (currentTrack + 1) % audioFiles.length;
  const prevAudio = new Audio(audioFiles[prevIndex].file);
  const nextAudio = new Audio(audioFiles[nextIndex].file);
  prevAudio.load();
  nextAudio.load();
}

soundPrev.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + audioFiles.length) % audioFiles.length;
  loadTrack(currentTrack);
  if (audioInitialized) bgMusic.play();
});

soundNext.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % audioFiles.length;
  loadTrack(currentTrack);
  if (audioInitialized) bgMusic.play();
});

soundSlider.addEventListener('input', () => {
  if (audioInitialized) {
    bgMusic.volume = soundSlider.value / 100;
  }
});

// Auto-play
window.addEventListener('DOMContentLoaded', () => {
  bgMusic.volume = 0;
  bgMusic.muted = true;
  loadTrack(currentTrack);
  bgMusic.play().catch(err => {
    console.warn("Autoplay likely blocked, waiting for user interaction.", err);
  });

  const enableSound = () => {
    bgMusic.muted = false;
    bgMusic.volume = soundSlider.value / 100;
    audioInitialized = true;
    window.removeEventListener('click', enableSound);
    window.removeEventListener('keydown', enableSound);
  };

  window.addEventListener('click', enableSound);
  window.addEventListener('keydown', enableSound);
});

//Leaderboard
leaderboardBtn.addEventListener('click', function () {
  menu.style.display = 'none';
  leaderboardPage.style.display = 'flex';
  initLeaderboard();
});

backLeaderboard.addEventListener('click', function () {
  username.value = '';
  leaderboardPage.style.display = 'none';
  menu.style.display = 'flex';
});

//Register
registerPlayerBtn.addEventListener('click', function () {
  leaderboardPage.style.display = 'none';
  registerPage.style.display = 'flex';
});

let currentChar = 0;
const charFiles = [
  { name: "willy", file: ["characters/will1.png", "characters/will2.png"] },
  { name: "lucy", file: ["characters/lucy1.png", "characters/lucy2.png"] },
  { name: "j lei", file: ["characters/jlei1.png", "characters/jlei2.png"] },
  { name: "tsai", file: ["characters/tsai1.png", "characters/tsai2.png"] },
  { name: "tristan", file: ["characters/tristan1.png", "characters/tristan2.png"] }
];

let animationInterval;
let currentFrame = 0;

function loadCharacter(index) {
  currentChar = index;
  if (animationInterval) {
    clearInterval(animationInterval);
  }
  animateCharacter();
}

function animateCharacter() {
  currentFrame = 0;
  charDisplay.src = charFiles[currentChar].file[currentFrame];
  charDisplay.alt = charFiles[currentChar].name;
  animationInterval = setInterval(() => {
    currentFrame = (currentFrame + 1) % 2;
    charDisplay.src = charFiles[currentChar].file[currentFrame];
  }, 500);
}

registerPrev.addEventListener('click', () => {
  currentChar = (currentChar - 1 + charFiles.length) % charFiles.length;
  loadCharacter(currentChar);
});

registerNext.addEventListener('click', () => {
  currentChar = (currentChar + 1) % charFiles.length;
  loadCharacter(currentChar);
});

loadCharacter(0);

const registerForm = document.getElementById('register-form');
function handleRegistration(e) {
  if (e) e.preventDefault();
  const usernameValue = username.value.trim();
  const playerData = {
    username: usernameValue,
    character: charFiles[currentChar].name,
    characterImage: charFiles[currentChar].file,
    score: 0,
  };

  if (usernameValue.length > 20) {
    alert("Username cannot exceed 20 characters");
    return;
  }

  let leaderboardBtn = JSON.parse(localStorage.getItem('leaderboard')) || [];

  const isDuplicate = leaderboardBtn.some(p => p.username.toLowerCase() === usernameValue.toLowerCase());
  if (isDuplicate) {
    alert("Username already exists");
    return;
  }

  username.value = '';

  //Register Player
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.push(playerData);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  localStorage.setItem('currentPlayer', JSON.stringify(playerData));

  username.value = '';
  registerPage.style.display = 'none';
  leaderboardPage.style.display = 'flex';
  initLeaderboard();
}

registerForm.addEventListener('submit', handleRegistration);
confirmRegister.addEventListener('click', handleRegistration);

let selectedPlayer = null;

function initLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const leaderboardTable = document.querySelector('.leaderboard-table');
  const currentTheme = document.getElementById('theme').value || 'Yellow';
  const themeSettings = themeConfig[currentTheme];

  while (leaderboardTable.children.length > 1) {
    leaderboardTable.removeChild(leaderboardTable.lastChild);
  }

  leaderboard.sort((a, b) => b.score - a.score).forEach((player, index) => {
    const row = document.createElement('div');
    row.className = 'leaderboard-row';
    row.innerHTML = `
      <div>${index + 1}</div>
      <div><img class="leaderboard-character" src="${player.characterImage}" alt="${player.character}"></div>
      <div>${player.username}</div>
      <div>${player.score || 0}</div>
    `;

    const charImg = row.querySelector('.leaderboard-character');
    let currentFrame = 0;
    const characterImages = Array.isArray(player.characterImage) ? 
                         player.characterImage : 
                         [player.characterImage];
                         charImg.src = characterImages[currentFrame];
                         if (characterImages.length > 1) {
                          const animateInterval = setInterval(() => {
                              currentFrame = (currentFrame + 1) % characterImages.length;
                              charImg.src = characterImages[currentFrame];
                          }, 500);
                          row.addEventListener('DOMNodeRemoved', () => {
                            clearInterval(animateInterval);
                        });
                    }

    //Remove Player
    row.addEventListener('click', () => {
      document.querySelectorAll('.leaderboard-row').forEach(r => {
        r.style.backgroundColor = '';
        r.classList.remove('selected');
      });
      row.style.backgroundColor = themeSettings.hoverColor + '40';
      row.classList.add('selected');
      selectedPlayer = player;
    });
    leaderboardTable.appendChild(row);
  });
}

removePlayerBtn.addEventListener('click', function () {
  if (!selectedPlayer) {
    alert("Please select a player by clicking on their row first");
    return;
  }

  if (confirm(`Are you sure you want to remove ${selectedPlayer.username}?`)) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard = leaderboard.filter(player => player.username !== selectedPlayer.username);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    selectedPlayer = null;
    initLeaderboard();
    document.querySelectorAll('.leaderboard-row').forEach(r => {
      r.style.backgroundColor = '';
      r.classList.remove('selected');
    });
  }
});

backRegister.addEventListener('click', function () {
  username.value = '';
  registerPage.style.display = 'none';
  leaderboardPage.style.display = 'flex';
});

//Game
playBtn.addEventListener('click', function () {
  menu.style.display = 'none';
  playPage.style.display = 'flex';
});

playMathBtn.addEventListener('click', function () {
  window.location.href = 'games/math_game.html';
});

playClickerBtn.addEventListener('click', function () {
  window.location.href = 'games/clicker.html';
});

playFillerBtn.addEventListener('click', function () {
  window.location.href = 'games/filler.html';
});

playTypeBtn.addEventListener('click', function () {
  window.location.href = 'games/type.html';
});

playHangmanBtn.addEventListener('click', function () {
  window.location.href = 'games/hangman.html';
});

backPlay.addEventListener('click', function () {
  playPage.style.display = 'none';
  menu.style.display = 'flex';
});