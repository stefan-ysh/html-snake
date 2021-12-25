// 地图/画布 map
var map = document.getElementById('map');

// 开始按钮
var playBtn = document.getElementById('begin')

// 暂停按钮
var pauseBtn = document.getElementById('pause')

// 得分板
var score = document.getElementById('score')

// 是否是暂停状态
var isPause = false

// 定时器
var timer;

// TODO 速度
var speed = 500

// 开始游戏
function startGame() {
    if (!isPause) {
        score.innerText = 0
    } else {
        isPause = !isPause
    }
    clearInterval(timer);
    // timer = setInterval(snake.run(), 500);  // 先执行run函数，把执行得到的结果，每500毫秒执行一次，不会在执行内部代码
    // 小技巧，每500毫秒执行字符串，字符串执行内部代码
    timer = setInterval("snake.run()", speed);
}

// 构造蛇
class Snake {
    constructor() {
        this.width = 40
        this.height = 40
        this.direction = 'right'
        this.body = [{
                x: 2,
                y: 0
            },
            {
                x: 1,
                y: 0
            },
            {
                x: 0,
                y: 0
            }
        ]
    }
    // 渲染蛇
    display() {
        this.body.forEach((item, index) => {
            if (item.x !== null) {
                let sb = document.createElement('div')
                // 将节点保存到状态中，以便于后面删除
                item.flag = sb;
                sb.style.width = this.width + 'px';
                sb.style.height = this.height + 'px';
                sb.style.borderRadius = '50%'
                if (index === 0) {
                    sb.style.background = 'yellow'
                    sb.innerText = '头'
                } else if (index === this.body.length - 1) {
                    sb.style.background = 'lightgrey'
                    sb.innerText = '尾'
                } else {
                    sb.style.background = '#fff'
                    sb.innerText = '身'
                }
                sb.style.lineHeight = this.height + 'px'
                sb.style.textAlign = 'center'
                sb.style.position = 'absolute'
                sb.style.left = (item.x * this.width) + 'px'
                sb.style.top = (item.y * this.height) + 'px'
                map.appendChild(sb)
            }

        })
    }
    // 让蛇跑起来,后一个元素到前一个元素的位置
    // 蛇头根据方向单独再处理，所以i不能等于0
    run() {
        // 后一节跑到前一节的地方
        for (var i = this.body.length - 1; i > 0; i--) {
            // console.log(this.body);
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // 处理蛇头
        switch (this.direction) {
            case 'up':
                this.body[0].y -= 1
                break;
            case 'down':
                this.body[0].y += 1
                break;
            case 'left':
                this.body[0].x -= 1
                break;
            case 'right':
                this.body[0].x += 1
                break;

        }

        // 判断蛇头是否出界
        if (this.body[0].x < 0 || this.body[0].x > 19 || this.body[0].y < 0 || this.body[0].y > 9) {
            alert('撞墙了')
            isPause = false
            clearInterval(timer); // 清除定时器，
            // 删除旧的
            for (var i = 0; i < this.body.length; i++) {
                if (this.body[i].flag != null) { // 如果刚吃完就死掉，会加一个值为null的
                    map.removeChild(this.body[i].flag);
                }
            }
            this.body = [ // 回到初始状态，
                {
                    x: 2,
                    y: 0
                },
                {
                    x: 1,
                    y: 0
                },
                {
                    x: 0,
                    y: 0
                }
            ];
            this.direction = 'right';
            this.display(); // 显示初始状态
            return false; // 结束
        }

        // 判断蛇头吃到食物，xy坐标重合，
        if (this.body[0].x == food.x && this.body[0].y == food.y) {
            // 蛇加一节，因为根据最后节点定，下面display时，会自动赋值的
            this.body.push({
                x: null,
                y: null,
                flag: null
            });
            score.innerText = (this.body.length - 3) * 10
            // 清除食物,重新生成食物
            map.removeChild(food.flag);
            food.display();
        }

        // 判断是否咬到自己
        if (this.body.length > 4) {
            let isBitMe = this.body.find((item, index) => {
                if (index !== 0) {
                    return item.x === this.body[0].x && item.y === this.body[0].y
                }
            })
            if (isBitMe !== undefined) {
                clearInterval(timer); // 清除定时器，
                isPause = false
                alert('对自己下手也太狠了')
                this.body.forEach((item, index) => {
                    if (item.flag !== null) {
                        map.removeChild(item.flag)
                    }
                })
                this.body = [{
                        x: 2,
                        y: 0
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ]
                this.direction = 'right'
                this.display()
                return false
            }
        }

        // 先删掉旧的蛇
        this.body.forEach((item, index) => {
            if (item.flag != null) { // 当吃到食物时，flag是等于null，且不能删除
                map.removeChild(item.flag);
            }
        })
        // 再创建新的蛇
        this.display()
    }
}

// 构造食物
class Food {
    constructor() {
        this.width = 40
        this.height = 40

    };
    display() {
        let food = document.createElement('div')
        this.flag = food;
        this.x = Math.floor(Math.random() * 20)
        this.y = Math.floor(Math.random() * 10)
        food.style.position = 'absolute'
        food.style.width = this.width + 'px'
        food.style.height = this.height + 'px'
        food.style.display = 'flex'
        food.style.display = 'flex'
        food.style.justifyContent = 'center'
        food.style.alignItems = 'center'
        // food.style.backgroundImage = "url('../image/food.png')"
        let img = document.createElement('img')
        img.style.width = '40px'
        img.src = './image/food.png'
        // food.style.background = 'red'
        food.appendChild(img)
        food.style.borderRadius = '50%';
        food.style.left = (this.x * this.width) + 'px'
        food.style.top = (this.y * this.height) + 'px'
        let isExist = snake.body.find((item, index) => {
            return item.x === this.x * this.width && item.y === this.y * this.height
        })
        if (isExist) {
            return this.display()
        } else {
            map.appendChild(food)
        }

    }
}

// 实例化贪吃蛇
var snake = new Snake()

// 实例化食物
var food = new Food()

// 贪吃蛇显示
snake.display()

// 食物显示
food.display()

// 挂载按键事件
document.body.onkeyup = function (e) {
    // 有事件对象就用事件对象，没有就自己创建一个，兼容低版本浏览器
    var ev = e || window.event;
    switch (ev.keyCode) {
        case 38:
            // 不允许返回，向上的时候不能向下,其他方向同理
            if (snake.direction != 'down') {
                snake.direction = "up";
            }
            break;
        case 40:
            if (snake.direction != "up") {
                snake.direction = "down";
            }
            break;
        case 37:
            if (snake.direction != "right") {
                snake.direction = "left";
            }
            break;
        case 39:
            if (snake.direction != "left") {
                snake.direction = "right";
            }
            break;
        case 32:
            startGame()
            break;
    }
}

// 开始按钮绑定事件
playBtn.onclick = startGame

// 暂停按钮绑定事件
pauseBtn.addEventListener('click', () => {
    isPause = true
    clearInterval(timer)
})