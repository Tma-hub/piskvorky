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

/* Získání stavu hrací plochy pro API a výherce */
const getBoard = () => {
  return Array.from(gameField).map((field) => {
    if (field.classList.contains('board__field--cross')) return 'x';
    if (field.classList.contains('board__field--circle')) return 'o';
    return '_';
  });
};

/* Převod souřadnic z API na index */
const coordsToIndex = (x, y) => x + y * 10;

/* Kontrola výherce nebo remízy */
const checkWinner = () => {
  const board = getBoard();
  const vitez = findWinner(board);

  if (vitez === 'x') {
    disableGame();
    setTimeout(() => {
      alert('Vyhrál křížek!');
      location.reload();
    }, 100);
    return true;
  } else if (vitez === 'o') {
    disableGame();
    setTimeout(() => {
      alert('Vyhrálo kolečko!');
      location.reload();
    }, 100);
    return true;
  } else if (vitez === 'tie') {
    disableGame();
    setTimeout(() => {
      alert('Remíza, hra skončila nerozhodně!');
      location.reload();
    }, 100);
    return true;
  }

  return false;
};

/* Získání a odehrání tahu AI */
const playAIMove = async () => {
  const board = getBoard();

  const response = await fetch(
    'https://piskvorky.czechitas-podklady.cz/api/suggest-next-move',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board: board,
        player: 'x',
      }),
    },
  );

  const data = await response.json();
  const index = coordsToIndex(data.position.x, data.position.y);

  /* Zpoždení AI simuluje kliknutí */
  setTimeout(() => {
    gameField[index].click();
  }, 200);
};

/* Kliknutí na jedno pole */
const handleClick = async (event) => {
  const field = event.target;

  if (
    field.classList.contains('board__field--circle') ||
    field.classList.contains('board__field--cross') ||
    field.disabled
  )
    return;

  if (currentPlayer === 'circle') {
    changeToCircle(event);
    field.disabled = true;

    if (!checkWinner()) {
      currentPlayer = 'cross';
      updatePlayerIndicator();
      await playAIMove(); // AI hraje za křížek
    }
  } else if (currentPlayer === 'cross') {
    changeToCross(event);
    field.disabled = true;

    if (!checkWinner()) {
      currentPlayer = 'circle';
      updatePlayerIndicator();
    }
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
