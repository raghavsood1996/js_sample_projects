const {
    Engine,
    Render,
    Runner, 
    World, 
    Bodies,
    Body,
    Events
} = Matter;

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 6;
const cellsVertical = 4;
const unitLengthX = width/cellsHorizontal;
const unitLengthY = height/cellsVertical;


const engine = Engine.create();
engine.world.gravity.y = 0;
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);



//walls
const walls = [
    Bodies.rectangle(width/2,0,width,2, {isStatic: true}),
    Bodies.rectangle(width/2,height,width,2, {isStatic: true}),
    Bodies.rectangle(0,height/2,2,height, {isStatic: true}),
    Bodies.rectangle(width,height/2,2,height, {isStatic: true})

]
World.add(world, walls);


//maze generation

const shuffle = (arr) => {
    let counter = arr.length;
    while(counter > 0)
    {
        const idx = Math.floor(Math.random()*counter);
        counter--;
        const temp = arr[counter];
        arr[counter] = arr[idx];
        arr[idx] = temp;
    }

    return arr;
};

const grid = Array(cellsVertical)
.fill(null)
.map(() => Array(cellsHorizontal).fill(false));
 
const verticals = Array(cellsVertical)
.fill(null)
.map(() => Array(cellsHorizontal-1).fill(false));

const horizontals = Array(cellsVertical - 1)
.fill(null)
.map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random()*cellsVertical);
const startCol = Math.floor(Math.random()*cellsHorizontal);

const stepThroughCell = (row, col) => {
    // if visited return
    if(grid[row][col]) {
        return;
    }

    //mark visited
    grid[row][col] = true;

    // assemble list of neighbors randomly ordered
    const neighbours = shuffle([
        [row - 1, col, "up"],
        [row, col + 1, "right"],
        [row + 1, col, "down"],
        [row, col - 1, "left"],
    ]);

    //for each neighbor
    for(let neighbor of neighbours)
    {
        const [nextRow, nextCol, dir] = neighbor;
        if(nextRow < 0 || nextRow >= cellsVertical || nextCol < 0 || nextCol >= cellsHorizontal)
        {
            continue;
        }

        if(grid[nextRow][nextCol])
        {
            continue;
        }

        if (dir === "left") {
            verticals[row][col-1] = true;
        } else if (dir === "right") {
            verticals[row][col] = true;
        } else if(dir === "up") {
            horizontals[row-1][col] = true;
        } else if (dir === "down") {
            horizontals[row][col] = true;
        }

        stepThroughCell(nextRow, nextCol);
    }


}

stepThroughCell(startRow, startCol);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open)
        {
            return;
        } 

        const wall = Bodies.rectangle(
            columnIndex*unitLengthX + unitLengthX/2,
            rowIndex*unitLengthY + unitLengthY,
            unitLengthX,
            10,
            {
                isStatic: true,
                label: 'wall',
                render: {
                    fillStyle: 'grey'
                }
            }
        );
        World.add(world,wall);
    })
})

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open)
        {
            return;
        } 

        const wall = Bodies.rectangle(
            columnIndex*unitLengthX + unitLengthX,
            rowIndex*unitLengthY + unitLengthY/2,
            10,
            unitLengthY,
            {
                isStatic: true,
                label: 'wall',
                render: {
                    fillStyle: 'grey'
                }
            }
        );
        World.add(world,wall);
    })
})

const goal = Bodies.rectangle(
width - unitLengthX/2,
height - unitLengthY/2,
unitLengthX*0.7,
unitLengthY*0.7,
{
    label: 'goal',
    isStatic: true,
    render: {
        fillStyle: 'yellow'
    }

}

);

World.add(world, goal);

const ballRadius = Math.min(unitLengthX, unitLengthY)/4;
//Ball
const ball = Bodies.circle(
    unitLengthX/2,
    unitLengthY/2,
    ballRadius,
    {
        label: 'ball',
        render: {
            fillStyle: 'cyan'
        }
    }
);

World.add(world,ball);
const ballSpeed = 5;

document.addEventListener('keydown',event => {
    const {x, y} = ball.velocity;
    if(event.keyCode === 87) {
        Body.setVelocity(ball,{x,y: y-ballSpeed});
    }
    if(event.keyCode === 68) {
        Body.setVelocity(ball,{x: x + ballSpeed,y});
    }
    if(event.keyCode === 83) {
        Body.setVelocity(ball,{x,y: y+ballSpeed});
    }
    if(event.keyCode === 65) {
        Body.setVelocity(ball,{x: x - ballSpeed,y});
    }
})

// win condition

Events.on(engine, 'collisionStart', event =>{
    event.pairs.forEach(collision => {
       const labels = ['ball', 'goal'];
       if(
           labels.includes(collision.bodyA.label) &&
           labels.includes(collision.bodyB.label)
       )
       {
           document.querySelector('.winner').classList.remove('hidden');
           world.gravity.y = 1;
           world.bodies.forEach((body) => {
               if(body.label === 'wall'){
                   Body.setStatic(body,false);
               }
           })
       }
    })
})