const mazeGeneration={
    allSq:[],
    isVisited:[],
    firstKey:0,
    exitKey:0,
    posStack:[],
    visitedCounter:0,
    intervalCode:0,

    populateMaze(){
        for (var i=0;i<64;i++){
            const sq=document.createElement('div');
            sq.classList.add('square');
            sq.classList.add('top');
            sq.classList.add('bottom');
            sq.classList.add('left');
            sq.classList.add('right');
            sq.setAttribute('key',i);
            document.getElementById('maze').appendChild(sq);  
            mazeGeneration.allSq.push(sq);
            mazeGeneration.isVisited.push(false);
        }
    },
    pickStartingSq(){
        const num=Math.floor(Math.random()*7.99);
        mazeGeneration.firstKey=num;
        mazeGeneration.isVisited[num]=true;
        mazeGeneration.allSq[num].classList.add('current');
        mazeGeneration.allSq[num].classList.add('entrance');

        mazeGeneration.posStack.push(num);
        mazeGeneration.visitedCounter++;
    },
    pickExitSq(){
        const num=Math.floor(Math.random()*7.99)+56;
        mazeGeneration.exitKey=num;
    },
    currentMovement(currKey,direction){
        var nextKey=0;
        switch(direction){
            case 'up':
                nextKey=currKey-8;
                mazeGeneration.allSq[currKey].classList.remove('top');
                mazeGeneration.allSq[nextKey].classList.remove('bottom');

                mazeGeneration.allSq[currKey].classList.remove('current');
                mazeGeneration.allSq[nextKey].classList.add('current');

                break;
            case 'down':
                nextKey=currKey+8;
                mazeGeneration.allSq[currKey].classList.remove('bottom');
                mazeGeneration.allSq[nextKey].classList.remove('top');

                mazeGeneration.allSq[currKey].classList.remove('current');
                mazeGeneration.allSq[nextKey].classList.add('current');
                break;
            case 'left':
                nextKey=currKey-1;
                mazeGeneration.allSq[currKey].classList.remove('left');
                mazeGeneration.allSq[nextKey].classList.remove('right');

                mazeGeneration.allSq[currKey].classList.remove('current');
                mazeGeneration.allSq[nextKey].classList.add('current');
                break;
            case 'right':
                nextKey=currKey+1;
                mazeGeneration.allSq[currKey].classList.remove('right');
                mazeGeneration.allSq[nextKey].classList.remove('left');

                mazeGeneration.allSq[currKey].classList.remove('current');
                mazeGeneration.allSq[nextKey].classList.add('current');
                break;

            default:
                break;
        }
    },
    getNbrKey(currKey,direction){
        const gridSize=mazeGeneration.isVisited.length;
        if (gridSize===64){            
            switch (direction){
                case 'up':
                    return (currKey<8)?-1:currKey-8;
                case 'down':
                    return (55<currKey)?-1:currKey+8;
                case 'left':
                    return ((currKey%8)===0)?-1:currKey-1;
                case 'right':
                    return ((currKey+1)%8===0)?-1:currKey+1;
                default:
                    break;
            }
        }
    },
    //generates the maze walls using a timeInterval
    stackRandomMazeGenerator(){

        var nbrPositions=["up","down","left","right"];

        mazeGeneration.intervalCode=setInterval(()=>{
            if (mazeGeneration.visitedCounter===mazeGeneration.isVisited.length){
                clearInterval(mazeGeneration.intervalCode);
                document.getElementsByClassName('current')[0].classList.remove('current');
                return;
            }

            document.getElementsByClassName('current')[0].classList.remove('current');
            const currPos=mazeGeneration.posStack[mazeGeneration.posStack.length-1];
            mazeGeneration.allSq[currPos].classList.add('current');

            if (currPos===mazeGeneration.exitKey){
                mazeGeneration.allSq[currPos].classList.add('exit');
            }
            

            nbrPositions.sort(()=>Math.random()-.5);

            for (var i=0;i<4;i++){
                const nbrKey=mazeGeneration.getNbrKey(currPos,nbrPositions[i]);
                if (nbrKey!==-1 && !mazeGeneration.isVisited[nbrKey]){
                    mazeGeneration.currentMovement(currPos,nbrPositions[i]);
                    mazeGeneration.isVisited[nbrKey]=true;
                    mazeGeneration.posStack.push(nbrKey);
                    mazeGeneration.visitedCounter++;
                    return;
                }
            }
            mazeGeneration.posStack.pop();
        },10)
    },
    //this function isn't really used but I keep it cause its cool
    recursiveRandomMazeGenerator(currKey){

        //shuffle all poss nbrs
        var nbrPositions=["up","down","left","right"];
        nbrPositions.sort(()=>Math.random()-.5);

        //recurse into each nbr
        for (var i=0;i<4;i++){

            const direction=nbrPositions[i];
            const nbrKey=mazeGeneration.getNbrKey(currKey,direction);

            if (nbrKey!==-1 && !mazeGeneration.isVisited[nbrKey]){
                mazeGeneration.isVisited[nbrKey]=true;
                mazeGeneration.currentMovement(currKey,direction);
                mazeGeneration.recursiveRandomMazeGenerator(nbrKey);
            }
        }
    },
    //easily called function that calls all steps required to generate the maze
    createMaze(){
        mazeGeneration.populateMaze();
        mazeGeneration.pickStartingSq();
        mazeGeneration.pickExitSq();
        mazeGeneration.stackRandomMazeGenerator();
    }
}

export default mazeGeneration