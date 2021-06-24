const score = document.querySelector(".score"),
	start = document.querySelector(".start");

const gameArea = document.querySelector(".gameArea");
gameArea.classList.add("hide");

const car = document.createElement("div");
car.classList.add("car", "player");

const MAX_ENEMY = 8;

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const setting = {
	start: false,
	score: 0,
	speed: 8,
	traffic: 2.5,
};

const music = new Audio("audio.mp3");

const getQuantityElements = (heightElement) =>
	document.documentElement.clientHeight / heightElement + 1;

const getRandomEnemy = (maxEnemy) => Math.floor(Math.random() * (maxEnemy + 1));

function startGame() {
    start.classList.add("hide");
    gameArea.classList.remove("hide");

	music.play();
	setTimeout(() => music.stop(), 60000);

	for (let i = 0; i < getQuantityElements(100); i++) {
		const line = document.createElement("div");
		line.classList.add("line");
		line.style.top = i * 100 + "px";
		line.y = i * 100;
		gameArea.appendChild(line);
	}

	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
		const enemy = document.createElement("div");
		enemy.classList.add("car", "enemy");
		enemy.style.background = `transparent url(./image/enemy${getRandomEnemy(
			MAX_ENEMY
		)}.png) center / cover no-repeat`;
		enemy.y = -100 * setting.traffic * (i + 1);
		enemy.style.left =
			Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
		enemy.style.top = enemy.y + "px";
		gameArea.appendChild(enemy);
	}

	setting.start = true;
	gameArea.appendChild(car);
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;

	requestAnimationFrame(playGame);
}

function playGame() {
	if (setting.start) {
		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && setting.x > 0) {
			setting.x -= setting.speed;
		}

		if (
			keys.ArrowRight &&
			setting.x < gameArea.offsetWidth - car.offsetWidth
		) {
			setting.x += setting.speed;
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
	if (!(event.key in keys)) {
		return;
	}
	event.preventDefault();
	keys[event.key] = true;
}

function stopRun(event) {
	if (!(event.key in keys)) {
		return;
	}
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad() {
	let lines = document.querySelectorAll(".line");
	lines.forEach(function (line) {
		line.y += setting.speed;
		if (line.y >= document.documentElement.clientHeight) {
			line.y = -100;
		}
		line.style.top = line.y + "px";
	});
}

function moveEnemy() {
	let enemies = document.querySelectorAll(".enemy");
	enemies.forEach(function (enemy) {
		enemy.y += setting.speed / 2;
		if (enemy.y >= document.documentElement.clientHeight) {
			enemy.y = -100 * setting.traffic;
			enemy.style.left =
				Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
		}
		enemy.style.top = enemy.y + "px";
	});
}

start.addEventListener("click", startGame);

document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);
