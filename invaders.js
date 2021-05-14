const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('#results')
const timerDisplay = document.querySelector('#time')
const pause = document.getElementById('pause')
const event = window.event
var lifes
let currentShooterIndex = 825
let width = 30
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0
var RequestAnimationFrame = window.requestAnimationFrame
var timer = 180;

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed, timeflag = 0;

for (let i = 0; i < 900; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, 18,
    60, 62, 64, 66, 68, 70, 72, 74, 76, 78,
    120, 122, 124, 126, 128, 130, 132, 134, 136, 138
]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}

draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

squares[currentShooterIndex].classList.add('shooter')


function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
            // clearInterval(invadersId)
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > (squares.length)) {
            resultsDisplay.innerHTML = 'GAME OVER'
                // clearInterval(invadersId)
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN'
            // clearInterval(invadersId)
    }
}

function startAnimating() {
    fpsInterval = 1000;
    then = Date.now();
    startTime = Date.now();
    animate();
}
startAnimating();

function animate() {
    pause2 = event
    console.log(pause2)

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // request another frame
    if (now < (startTime + 5100)) {
        requestAnimationFrame(animate);
        if (timeflag <= 60) {
            timeflag++;
        } else {
            timer--;
            timeflag = 0;
        }
        timerDisplay.innerHTML = timer;
    } else {
        resultsDisplay.innerHTML = 'GAME OVER';
    }

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
        console.log("animated")
        moveInvaders();
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here

    }
}

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)

        }

    }
    switch (e.keyCode) {
        case 32:
            laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)