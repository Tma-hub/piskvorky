let currentPlayer = 'circle';

const gameField = document.querySelectorAll('.hra__pole button');

const playerIndicator = document.querySelector('.hra__kruh'); // Změna symbolu
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

/* Hrací pole */

const handleClick = (event) => {
  const field = event.target;

  if (field.classList.contains('board__field--circle')) return;
  if (field.classList.contains('board__field--cross')) return;

  if (currentPlayer === 'circle') {
    changeToCircle(event);
    currentPlayer = 'cross';
  } else {
    changeToCross(event);
    currentPlayer = 'circle';
  }

  updatePlayerIndicator();
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
