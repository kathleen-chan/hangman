const hangmanText = document.getElementById('hangman-text');
const navbar = document.querySelector('.navbar');
const footer = document.querySelector('.footer');
const body = document.body;
const gameContainer = document.querySelector('.game-container');
const menu = document.getElementById('menu');
const backBtn = document.getElementById('back');
const settings = document.getElementById('settings');
const settingsPage = document.getElementById('settings-page');
const backSettings = document.getElementById('back-settings');
const playBtn = document.getElementById('play');
const playPage = document.getElementById('play-page');
const leaderboardBtn = document.getElementById('leaderboard');
const leaderboardPage = document.getElementById('leaderboard-page');
const registerPlayerBtn = document.getElementById('register-btn');
const resgisterPage = document.getElementById('register-page');
const backRegister = document.getElementById('back-register');
const backLeaderboard = document.getElementById('back-leaderboard');
const bgMusic = document.getElementById('bg-music');
const soundPrev = document.getElementById('sound-prev');
const soundNext = document.getElementById('sound-next');
const soundLabel = document.querySelector('.sound-label');
const soundSlider = document.getElementById('sound');

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
  hangmanText.style.color = themeSettings.textColor;

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
    .arrow:hover {
      color: ${complementaryColor};
      transform: scale(1.1);
    }
    #sound { accent-color: ${complementaryColor}; }
    #hangman-text:hover { color: ${themeSettings.hoverColor} !important; }
  `;
}

// Default theme
applyTheme('Yellow');

document.getElementById('theme').addEventListener('change', function() {
  const theme = this.value;
  if (theme) applyTheme(theme);
});

// Changing starter screen color when 'Hangman!' is clicked
let isSqueezed = false;
hangmanText.addEventListener('click', function() {
  if (!isSqueezed) {
    navbar.classList.add('squeeze-navbar');
    body.classList.add('squeeze-bg');
    gameContainer.style.opacity = '0';
    setTimeout(() => menu.style.display = 'flex', 500);
  }
  isSqueezed = true;
});

backBtn.addEventListener('click', function() {
  menu.style.display = 'none';
  navbar.classList.remove('squeeze-navbar');
  body.classList.remove('squeeze-bg');
  gameContainer.style.opacity = '1';
  isSqueezed = false;
});

// Settings
settings.addEventListener('click', function() {
  menu.style.display = 'none';
  settingsPage.style.display = 'flex';
  const themeSelect = document.getElementById('theme');
  themeSelect.selectedIndex = 0;
});

backSettings.addEventListener('click', function() {
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
leaderboardBtn.addEventListener('click', function() {
  menu.style.display = 'none';
  leaderboardPage.style.display = 'flex';
  initLeaderboard();
});

registerPlayerBtn.addEventListener('click', function() {
  leaderboardPage.style.display = 'none';
  registerPage.style.display = 'flex';
});

backLeaderboard.addEventListener('click', function() {
  leaderboardPage.style.display = 'none';
  menu.style.display = 'flex';
});

backRegister.addEventListener('click', function() {
  registerPage.style.display = 'none';
  leaderboardPage.style.display = 'flex';
});

// Game
playBtn.addEventListener('click', function() {
  menu.style.display = 'none';
  playPage.style.display = 'flex';
});
