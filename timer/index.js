const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const circle = document.querySelector('circle');

const perimeter = circle.getAttribute('r')*2*Math.PI;
circle.setAttribute('stroke-dasharray',perimeter);
let currOffset = 0;
let duration;
const t1 = new Timer(durationInput, startButton, pauseButton, {
    onStart(totalDuration) {
        duration = totalDuration;
        console.log('started');
    },
    onTick(timeRemaining) {
        circle.setAttribute('stroke-dashoffset',
        perimeter*timeRemaining /duration - perimeter);
        currOffset = currOffset - 1;
        console.log('Ticked');
    },
    onComplete() {
        console.log('completed');

    }
});