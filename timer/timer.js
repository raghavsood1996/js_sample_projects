class Timer{
    constructor(durationInput, startButton, pauseButton, callbacks)
    {
       
        this.duration = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        if(callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
        }
        startButton.addEventListener('click',this.start);
        pauseButton.addEventListener('click', this.pause);


    }
    start = () =>
    {
        if(this.onStart){
            this.onStart(this.timeRemaining);
        }
        this.tick();
        this.interval = setInterval(this.tick, 50);
    }

    tick = () =>
    {
        if(this.timeRemaining <= 0)
        {
            if(this.onComplete)
            {
                this.onComplete();
            }
            this.pause();
        }
        else{
            if(this.onTick){
                this.onTick(this.timeRemaining);
            }
            this.timeRemaining = this.timeRemaining - 0.05;

        }
    }

    pause = () =>
    {
        clearInterval(this.interval);
    }

    get timeRemaining() {
        return parseFloat(this.duration.value);
    }

    set timeRemaining(time) {
        this.duration.value = time.toFixed(2);
    }
}