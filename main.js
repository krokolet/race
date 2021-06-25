const MAX_ENEMY = 8;
const HEIGHT_ELEM = 100;

const score = document.querySelector(".score"),
	start = document.querySelector(".start"),
	gameArea = document.querySelector(".gameArea");
car = document.createElement("div");
car.classList.add("car", "player");

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const setting = {
	start: false,
	score: 0,
	speed: 1,
	traffic: 2.5,
};


const setGamesLevel = {
	easy: () => { setting.traffic = 4.5; setting.speed = 1; },
	medium: () => { setting.traffic = 3.5; setting.speed = 3; },
	hard: () => {setting.traffic = 2.5; setting.speed = 6;},
};


const setBestResult = (score) => localStorage.setItem("bestScore", score);
const getBestResult = () => localStorage.getItem("bestScore");

const music = new Audio("audio.mp3");
music.loop = true;

const getQuantityElements = (heightElement) =>
	gameArea.offsetHeight / heightElement + 1;

const getRandomEnemy = (maxEnemy) => Math.floor(Math.random() * (maxEnemy + 1));

const isCarTouched = (carRect, enemyRect) =>
	carRect.top <= enemyRect.bottom &&
	carRect.right >= enemyRect.left &&
	carRect.left <= enemyRect.right &&
	carRect.bottom >= enemyRect.top;

function startGame(event) {
	const { target } = event;
	if (!target.classList.contains('btn')) return;

	setGamesLevel[target.dataset.level]();

	score.style.minHeight = '100px';
	gameArea.style.minHeight =
		Math.floor(
			(document.documentElement.clientHeight - score.offsetHeight) /
			HEIGHT_ELEM) * HEIGHT_ELEM + 'px';
	gameArea.style.top = score.offsetHeight +'px';

	gameArea.innerHTML = "";
	start.classList.add("hide");
	music.play();

	if (!getBestResult()) {
		setBestResult(0);
	}

	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
		const line = document.createElement("div");
		line.classList.add("line");
		line.style.top = i * HEIGHT_ELEM + "px";
		line.style.height = HEIGHT_ELEM / 2 + "px";
		line.y = i * HEIGHT_ELEM;
		gameArea.appendChild(line);
	}

	for (
		let i = 0;
		i < getQuantityElements(HEIGHT_ELEM * setting.traffic);
		i++
	) {
		const enemy = document.createElement("div");
		enemy.classList.add("car", "enemy");
		enemy.style.background = `transparent url(./image/enemy${getRandomEnemy(
			MAX_ENEMY
		)}.png) center / cover no-repeat`;
		enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1) - setting.speed * 20;
		enemy.style.left =
			Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
		enemy.style.top = enemy.y + "px";
		gameArea.appendChild(enemy);
	}

	setting.score = 0;
	setting.start = true;

	gameArea.appendChild(car);

	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + "px";
	car.style.top = "auto";
	car.style.bottom = "10px";

	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;

	requestAnimationFrame(playGame);
}

function playGame() {
	if (setting.start) {
		setting.score += setting.speed / 10;
		if (
			setting.score >
			50 * (setting.speed * setting.speed + setting.speed)
		) {
			setting.speed += 1;
		}

		score.innerHTML =
			"SCORE: " +
			Math.floor(setting.score) +
			"<br>(Best score: " +
			getBestResult() +
			")" +
			"<br>Current speed: " +
			setting.speed * 10 +
			" km/h";

		moveRoad();
		moveEnemy();

		if (keys.ArrowLeft && setting.x > 0) {
			setting.x -= Math.ceil(setting.speed / 2);
		}

		if (
			keys.ArrowRight &&
			setting.x < gameArea.offsetWidth - car.offsetWidth
		) {
			setting.x += Math.ceil(setting.speed / 2);
		}

		if (
			keys.ArrowDown &&
			setting.y < gameArea.offsetHeight - car.offsetHeight
		) {
			setting.y += setting.speed;
		}

		if (keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}

		car.style.left = setting.x + "px";
		car.style.top = setting.y + "px";

		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	if (!(keys.hasOwnProperty(event.key))) {
		return;
	}
	event.preventDefault();
	keys[event.key] = true;
}

function stopRun(event) {
	if (!(keys.hasOwnProperty(event.key))) {
		return;
	}
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad() {
	let lines = document.querySelectorAll(".line");
	lines.forEach(function (line) {
		line.y += setting.speed;
		if (line.y >= gameArea.offsetHeight) {
			line.y = -HEIGHT_ELEM;
		}
		line.style.top = line.y + "px";
	});
}

function moveEnemy() {
	let enemies = document.querySelectorAll(".enemy");
	enemies.forEach(function (enemy) {
		let carRect = car.getBoundingClientRect();
		let enemyRect = enemy.getBoundingClientRect();

		if (isCarTouched(carRect, enemyRect)) {
			stopGame();
		}

		enemy.y += setting.speed / 2;
		enemy.style.top = enemy.y + "px";

		if (enemy.y >= gameArea.offsetHeight) {
			enemy.y = -HEIGHT_ELEM * setting.traffic - setting.speed * 20;
			enemy.style.left =
				Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
		}
	});
}

function stopGame() {
	setting.start = false;
	start.classList.remove("hide");
	start.style.top = score.offsetHeight + "px";
	music.pause();
	music.currentTime = 0;
	if (Math.floor(setting.score) > getBestResult()) {
		setBestResult(Math.floor(setting.score));
		alert(
			"You are the best now !!! Your score: " + Math.floor(setting.score)
		);
	}
}

start.addEventListener("click", startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);