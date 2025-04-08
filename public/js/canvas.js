
// ===== Helper Functions =====
const PI2 = Math.PI * 2
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const timestamp = () => new Date().getTime()

var showTaurus = false;
setTimeout(() => { showTaurus = true }, 5000);
// ===== Star Class =====
class Star {
    constructor(width, height) {
        this.reset(width, height)
    }

    reset(width, height) {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 1.2 + 0.1
        this.alpha = Math.random()
        this.speed = Math.random() * 0.001 + 0.0002
    }

    update(delta) {
        this.alpha += this.speed * delta * 1000
        if (this.alpha > 1 || this.alpha < 0) this.speed *= -1
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = 'white'
        ctx.arc(this.x, this.y, this.size, 0, PI2)
        ctx.fill()
        ctx.globalAlpha = 1
    }
}

// ===== Starfield Class =====
class Starfield {
    constructor(numStars) {
        this.stars = []
        this.numStars = numStars
        this.resize()
    }

    resize() {
        this.width = canvas.width
        this.height = canvas.height
        this.stars = []
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(new Star(this.width, this.height))
        }
    }

    update(delta) {
        for (let star of this.stars) star.update(delta)
    }

    draw(ctx) {
        for (let star of this.stars) star.draw(ctx)
    }
}

// ===== Comet Class =====
class Comet {
    constructor(width, height) {
        this.reset(width, height)
    }

    reset(width, height) {
        this.x = Math.random() * -width
        this.y = Math.random() * height * 0.5
        this.length = Math.random() * 80 + 30
        this.speedX = Math.random() * 0.5 + 0.3
        this.speedY = Math.random() * 0.2 + 0.1
        this.opacity = Math.random() * 0.5 + 0.5
    }

    update(delta, width, height) {
        this.x += this.speedX * delta * 60
        this.y += this.speedY * delta * 60
        if (this.x > width || this.y > height) this.reset(width, height)
    }

    draw(ctx) {
        const angle = Math.atan2(this.speedY, this.speedX); // hướng di chuyển

        const tailX = this.x - this.length * Math.cos(angle);
        const tailY = this.y - this.length * Math.sin(angle);

        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
    }
}

// ===== Firework Class =====
class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
        this.dead = false
        this.offsprings = offsprings
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.shade = shade
        this.history = []
    }

    update(delta) {
        if (this.dead) return

        const xDiff = this.targetX - this.x
        const yDiff = this.targetY - this.y
        if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
            this.x += xDiff * 2 * delta
            this.y += yDiff * 2 * delta
            this.history.push({ x: this.x, y: this.y })
            if (this.history.length > 20) this.history.shift()
        } else {
            if (this.offsprings && !this.madeChilds) {
                const babies = this.offsprings / 2
                for (let i = 0; i < babies; i++) {
                    const angle = PI2 * i / babies
                    const targetX = this.x + this.offsprings * Math.cos(angle)
                    const targetY = this.y + this.offsprings * Math.sin(angle)
                    birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))
                }
            }
            this.madeChilds = true
            this.history.shift()
        }

        if (this.history.length === 0) this.dead = true
        else if (this.offsprings) {
            for (let i = 0; i < this.history.length; i++) {
                const point = this.history[i]
                ctx.beginPath()
                ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`
                ctx.arc(point.x, point.y, 1, 0, PI2, false)
                ctx.fill()
            }
        } else {
            ctx.beginPath()
            ctx.fillStyle = `hsl(${this.shade},100%,50%)`
            ctx.arc(this.x, this.y, 1, 0, PI2, false)
            ctx.fill()
        }
    }
}

// ===== Birthday Container =====
class Birthday {
    constructor() {
        this.canvas = canvas
        this.ctx = ctx
        this.fireworks = []
        this.counter = 0
        this.startTime = timestamp()
        this.comets = []
        this.stars = new Starfield(100)
        this.resize()
    }

    resize() {
        this.width = canvas.width = window.innerWidth
        this.height = canvas.height = window.innerHeight
        const center = this.width / 2 | 0
        this.spawnA = center - center / 4 | 0
        this.spawnB = center + center / 4 | 0
        this.spawnC = this.height * 0.1
        this.spawnD = this.height * 0.5
        this.stars.resize()
    }

    onClick(evt) {
        const x = evt.clientX || (evt.touches && evt.touches[0].pageX)
        const y = evt.clientY || (evt.touches && evt.touches[0].pageY)
        const count = random(3, 5)
        for (let i = 0; i < count; i++) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                x,
                y,
                random(0, 260),
                random(30, 110)))
        }
        this.counter = -1
    }

    update(delta) {
        const now = timestamp()
        const elapsed = (now - this.startTime) / 1000

        ctx.globalCompositeOperation = 'hard-light'
        ctx.fillStyle = `rgba(20,20,20,${7 * delta})`
        ctx.fillRect(0, 0, this.width, this.height)

        this.stars.update(delta)
        this.stars.draw(ctx)

        // ==== SAO BĂNG ====
        if (elapsed >= 10 && elapsed <= 180) {
            if (this.comets.length === 0) {
                const cometCount = random(3, 9)
                this.comets = Array.from({ length: cometCount }, () => new Comet(this.width, this.height))
            }
            this.comets.forEach(comet => {
                comet.update(delta, this.width, this.height)
                comet.draw(ctx)
            })
        } else {
            this.comets = []
        }

        // ==== PHÁO HOA ====
        ctx.globalCompositeOperation = 'lighter'
        for (let firework of this.fireworks) firework.update(delta)

        this.counter += delta * 3
        if (this.counter >= 5 && elapsed <= 300) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                random(0, this.width),
                random(this.spawnC, this.spawnD),
                random(0, 360),
                random(30, 110)))
            this.counter = 0
        }

        this.fireworks = this.fireworks.filter(fw => !fw.dead)
    }
}

// ===== Khởi tạo Canvas =====
const canvas = document.getElementById('birthday')
const ctx = canvas.getContext('2d')
let then = timestamp()
const birthday = new Birthday()

window.onresize = () => birthday.resize()
document.onclick = evt => birthday.onClick(evt)
document.ontouchstart = evt => birthday.onClick(evt)

    ; (function loop() {
        requestAnimationFrame(loop)
        const now = timestamp()
        const delta = (now - then) / 1000
        then = now
        birthday.update(delta)
    })()








