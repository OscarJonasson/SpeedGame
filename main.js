/* eslint-disable no-else-return */
const gameButtons = document.querySelectorAll('.speed__button');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const overlay = document.querySelector('#overlay');
const closeButton = document.querySelector('#close');
const scoreTxt = document.querySelector('#score');
const resultTxt = document.querySelector('#result');

const getRng = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

let active = 0;
let score = 0;
let pace = 1000;
let timer;
let rounds = 0;

const clickGameButton = i => {
  if (i !== active) {
    stopGame();
  } else {
    rounds--;
    score++;
    scoreTxt.textContent = score;
  }
};

gameButtons.forEach((button, i) => {
  button.addEventListener('click', () => {
    clickGameButton(i);
  });
});

const startGame = () => {
  for (let i = 0; i < gameButtons.length; i++) {
    gameButtons[i].style.pointerEvents = 'auto';
  }

  let nextActive = pickNew(active);
  gameButtons[nextActive].classList.toggle('active');
  gameButtons[active].classList.remove('active');
  stopButton.style.display = 'inline';
  startButton.style.display = 'none';

  active = nextActive;
  timer = setTimeout(startGame, pace);
  pace -= 20;

  if (rounds >= 3) {
    stopGame();
  }
  rounds++;

  function pickNew(active) {
    let nextActive = getRng(0, 3);
    if (nextActive !== active) {
      return nextActive;
    } else {
      return pickNew(active);
    }
  }
};

const stopGame = () => {
  stopGameSound();
  clearTimeout(timer);
  overlay.style.visibility = 'visible';
  if (score === 0) {
    resultTxt.textContent = `C'mon try harder! Score: ${score}`;
  } else if (score <= 3) {
    resultTxt.textContent = `You can do better! Score: ${score}`;
  } else if (score <= 9) {
    resultTxt.textContent = `You are getting the hang of it! Score: ${score}`;
  } else if (score >= 10) {
    resultTxt.textContent = `Good job! Time to take a break! Score: ${score}`;
  }
};

const reloadGame = () => {
  window.location.reload();
};

/* SOUNDS
 ********** */

function sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.volume = 0.1;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);

  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

const startGameSound = () => {
  startSound = new sound('./MetalMan.mp3');
  startSound.play();
};

const stopGameSound = () => {
  endSound = new sound('./gameOver.mp3');
  startSound.stop();
  endSound.play();
};

startButton.addEventListener('click', () => {
  startGame();
  startGameSound();
});
stopButton.addEventListener('click', stopGame);
closeButton.addEventListener('click', reloadGame);
