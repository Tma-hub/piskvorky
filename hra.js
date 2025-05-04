import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4';

let currentPlayer = 'circle';

const gameField = document.querySelectorAll('.hra__pole button');
const playerIndicator = document.querySelector('.hra__kruh');
const restartLink = document.querySelector('.hra__restart');

/* Křížky a kolečka */
const changeToCircle = (event) => {
  event.target.classList.add('board__field--circle');
};

const changeToCross = (event) => {
  event.target.classList.add('board__field--cross');
};

/* Změna symbolů dle hrajícího */
const updatePlayerIndicator = () => {
  playerIndicator.classList.remove('hra__kruh--circle', 'hra__kruh--cross');
  if (currentPlayer === 'circle') {
    playerIndicator.classList.add('hra__kruh--circle');
  } else {
    playerIndicator.classList.add('hra__kruh--cross');
  }
};

/* Zablokování hry po výhře nebo remíze */
const disableGame = () => {
  gameField.forEach((field) => {
    field.disabled = true;
  });
};

/* Kliknutí na jedno pole */
const handleClick = (event) => {
  const field = event.target;

  if (
    field.classList.contains('board__field--circle') ||
    field.classList.contains('board__field--cross')
  )
    return;

  if (currentPlayer === 'circle') {
    changeToCircle(event);
    currentPlayer = 'cross';
  } else {
    changeToCross(event);
    currentPlayer = 'circle';
  }

  updatePlayerIndicator();

  /* Určení výherce */
  const herniPole = Array.from(gameField).map((field) => {
    if (field.classList.contains('board__field--cross')) return 'x';
    if (field.classList.contains('board__field--circle')) return 'o';
    return '_';
  });

  const vitez = findWinner(herniPole);

  /* Výhra nebo remíza */
  if (vitez === 'x') {
    disableGame();
    setTimeout(() => {
      alert('Vyhrál křížek!');
      location.reload();
    }, 100);
  } else if (vitez === 'o') {
    disableGame();
    setTimeout(() => {
      alert('Vyhrálo kolečko!');
      location.reload();
    }, 100);
  } else if (vitez === 'tie') {
    disableGame();
    setTimeout(() => {
      alert('Remíza, hra skončila nerozhodně!');
      location.reload();
    }, 100);
  }
};

/* Kliknutí na restart */
const whenRestartBtn = (event) => {
  const confirmed = confirm('Opravdu chceš začít znovu?');
  if (!confirmed) {
    event.preventDefault();
  }
};

gameField.forEach((field) => {
  field.addEventListener('click', handleClick);
});

restartLink.addEventListener('click', whenRestartBtn);

updatePlayerIndicator();
