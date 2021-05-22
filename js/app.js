const TOP_BORDER = 0;
const DOWN_BORDER = 500;
const LEFT_BORDER = 0;
const RIGHT_BORDER = 500;


class Entity {
    everyStepHandler() { }
    collisionHandler() { }
}
//dfghjm
class Player extends Entity {
    constructor(x, y, color) {
        super();

        this.props = {
            type: "player",
            points: 3,
        };

        this.x = x;
        this.y = y;
        this.h = 10;
        this.w = 10;
        this.speed = 10;
        this.color = color;
        this.needRendering = true;
        this.needCheckCollision = true;
    }

    everyStepHandler() {
        this.h = 10 * this.props.points;
        this.w = 10 * this.props.points;
    }

    collisionHandler(otherEntity) {
        if (this == otherEntity) {
            return;
        } else if (otherEntity.props.type == "food") {
            otherEntity.needCheckCollision = false;
            otherEntity.needRendering = false;

            this.props.points += otherEntity.props.points;
        } else if (otherEntity.props.type == "player") {
            if (this.props.points > otherEntity.props.points) {

                otherEntity.needCheckCollision = false;
                otherEntity.needRendering = false;

                this.props.points += otherEntity.props.points;
            }
        }
    }

    moveUp() {
        if (this.y - this.speed >= TOP_BORDER) {
            this.y -= this.speed;
        }
    }
    moveDown() {
        if (this.y + this.speed + this.h < DOWN_BORDER) {
            this.y += this.speed;
        }
    }
    moveLeft() {
        if (this.x - this.speed >= LEFT_BORDER) {
            this.x -= this.speed;
        }
    }
    moveRight() {
        if (this.x + this.speed + this.w < RIGHT_BORDER) {
            this.x += this.speed;
        }
    }
}

class Food extends Entity {
    constructor(x, y, points) {
        super();

        this.props = {
            type: "food",
            points: points,
        };

        this.type = "food point";
        this.x = x;
        this.y = y;
        this.h = 10;
        this.w = 10;
        this.color = "green";
        this.needRendering = true;
        this.needCheckCollision = true;
    }

    everyStepHandler() {
        if (this.needRendering === false) {
            this.x = 10 * Math.floor(Math.random() * (45 - 0) + 0);
            this.y = 10 * Math.floor(Math.random() * (45 - 0) + 0);
            this.points = Math.floor(Math.random() * (3 - 1) + 1);

            this.needRendering = true;
            this.needCheckCollision = true;
        }

        this.h = 10 * this.props.points;
        this.w = 10 * this.props.points;
    }
}

class Model {
    constructor() {
        this.entityObjs = [];

        for (let i = 0; i < 3; i++) {
            this.entityObjs.push(new Food(10 * Math.floor(Math.random() * (45 - 0) + 0), 10 * Math.floor(Math.random() * (45 - 0) + 0), Math.floor(Math.random() * (3 - 1) + 1)));
        }

        this.entityObjs.push(new Player(470, 470, "blue"));
        this.entityObjs.push(new Player(0, 0, "red"));
    }

    getPlayers() {
        return this.entityObjs.filter(obj => obj.props.type === "player")
    }

    init(renderFunction) {
        this.needRendering = renderFunction;
        setInterval(this.step.bind(this));
    }

    input(e) {
        const players = this.getPlayers();
        const keyCode = e.keyCode;


        switch (keyCode) {
            case 38: { // Arrow up
                players[0].moveUp();
                break;
            }
            case 40: { // Arrow down
                players[0].moveDown();
                break;
            }
            case 37: { // Arrow left
                players[0].moveLeft();
                break;
            }
            case 39: { // Arrow right
                players[0].moveRight();
                break;
            }
        }


        switch (keyCode) {
            case 87: { // w
                players[1].moveUp();
                break;
            }
            case 83: { // s
                players[1].moveDown();
                break;
            }
            case 65: { // Arrow left
                players[1].moveLeft();
                break;
            }
            case 68: { // Arrow right
                players[1].moveRight();
                break;
            }
        }
    }

    checkCollision = (obj1, obj2) => {
        return (
            obj1.needCheckCollision &&
            obj2.needCheckCollision &&
            obj1.x < obj2.x + obj2.w &&
            obj1.x + obj1.w > obj2.x &&
            obj1.y < obj2.y + obj2.h &&
            obj1.y + obj1.h > obj2.y
        );
    }

    step() {
        for (let i in this.entityObjs) {
            this.entityObjs[i].everyStepHandler();
        }

        for (let i = 0; i < this.entityObjs.length; i++) {
            for (let j = 0; j < this.entityObjs.length; j++) {
                const obj1 = this.entityObjs[i];
                const obj2 = this.entityObjs[j];
                if (obj1 != obj2) {
                    if (this.checkCollision(obj1, obj2)) {
                        obj1.collisionHandler(obj2);
                        obj2.collisionHandler(obj1);
                    }
                }
            }
        }

        this.needRendering();
        setInterval(this.step.bind(this));
    }
}

class View {
    constructor() {
        this.SVGMainScene = document.getElementById("mainScene");

        this.onKeyDownEvent = null;
    }

    init() {
        document.addEventListener('keydown', this.onKeyDownEvent);
    }

    render(objs) {
    

        while (this.SVGMainScene.firstChild) {
            this.SVGMainScene.removeChild(this.SVGMainScene.firstChild);
        }
    
        for (let i in objs) {
            let curObj = objs[i];
            if (curObj.needRendering) {
                let curNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    
                // curNode.setAttribute('id', parseInt(Math.floor(Math.random() * 900 + 100)));
                
                curNode.setAttribute('x', parseInt(curObj.x));
                curNode.setAttribute('y', parseInt(curObj.y));
                
                curNode.setAttribute('width', parseInt(curObj.h));
                curNode.setAttribute('height', parseInt(curObj.w));
    
                curNode.setAttribute('fill', curObj.color);
    
                this.SVGMainScene.append(curNode);
            }
        }
    }
}


class Controller {
    constructor(View, Model) {
        this.marioView = View;
        this.marioModel = Model;
    }

    init() {
        this.marioView.onKeyDownEvent = this.input.bind(this);

        this.marioView.init();
        this.marioModel.init(this.needRendering.bind(this));
        this.needRendering();
    }

    input(e) {
        this.marioModel.input(e);
    }

    needRendering() {
        this.marioView.render(model.entityObjs);
    }
}



let model = new Model();
let view = new View();
let controller = new Controller(view, model);

controller.init();