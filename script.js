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
const howToPlayBtn = document.getElementById('how-to-play');
const bgMusic = document.getElementById('bg-music');
const soundPrev = document.getElementById('soun-prev');
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
  { name: "", file: "" },
  { name: "", file: "" }
];

let currentTrack = 0;

function audio() {
  loadTrack(currentTrack);
  const playAudio = bgMusic.play();
  bgMusic.volume = soundSlider.value / 100;
  soundSlider.addEventListener('input', function() {
    bgMusic.volume = this.value / 100;
  });
}

function loadTrack(index) {
  currentTrack = index;
  bgMusic.src = audioFiles[index].file;
  soundLabel.textContent = audioFiles[index].name;
  preloadAdjacentTeacks();
}

function preloadAdjacentTracks() {
  const prevIndex = (currentTrack - 1 + audioFiles.length) % audioFiles.length;
  const nextIndex = (currentTrack + 1) % audioFiles.length;
  const prevAudio = new Audio(audioFiles[prevIndex].file);
  const nextAudio = new Audio(audioFIles[nextIndex].file);
  prevAudio.load();
  nextAudio.load();
}

soundPrev.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + audioFiles.length) % audioFiles.length;
  loadTrack(currentTrack);
});

soundNext.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % audioFiles.length;
  loadTrack(currentTrack);
})

window.addEventListener('DOMContentLoaded', audio);

// Game
playBtn.addEventListener('click', function() {
  playPage.style.display = 'none';
  menu.style.display = 'flex';
});

// How to Play
howToPlayBtn.addEventListener('click', function() {

});