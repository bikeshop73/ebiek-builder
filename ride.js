
/* =========================================
   SUPER73 2D RIDING ENGINE
   VISUAL MOVEMENT FIX
   - Continuous moving stunt background
   - Correct wheel rotation
   - Spinning motor
   - Front wheel slows while airborne
   - Keeps existing bike physics and controls
========================================= */

const RideGame = {
  active: false,
  bike: null,

  speed: 0,
  distance: 0,
  angle: 0,
  angularVelocity: 0,

  maxSpeed: 0,
  acceleration: 0.12,
  braking: 0.25,

  keys: {},
  animation: null,
  lastTime: 0,

  worldOffset: 0,
  worldSpeed: 0,

  rearRotation: 0,
  frontRotation: 0,
  motorRotation: 0,

  wheelieTime: 0,
  frontWheelStopped: false,

  frontWheelImages: [],
  rearWheelImages: [],
  motorImages: [],

  hasTires: true,
  tireSpeedMultiplier: 1,

  sparks: [],
  sparkCanvas: null,
  sparkContext: null,

  audioContext: null,
  scrapeOscillator: null,
  scrapeGain: null,

  container: null,
  ground: null,
  world: null,

  scenery: null,
  sceneryOffset: 0,

  start(bike) {
    if (!bike) return;

    this.bike = bike;

    this.speed = 0;
    this.distance = 0;
    this.angle = 0;
    this.angularVelocity = 0;

    this.worldOffset = 0;
    this.worldSpeed = 0;
    this.sceneryOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;
    this.motorRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;

    this.sparks = [];
    this.keys = {};

    const stats = getPerformanceStats(bike.parts || {});

    this.maxSpeed = Number(stats.topSpeed) || 0;

    if (this.maxSpeed <= 0) {
      alert("This bike cannot move. Check its battery, motor and controller.");
      return;
    }

    this.hasTires =
      Array.isArray(bike.parts?.tires) &&
      bike.parts.tires.length > 0;

    this.tireSpeedMultiplier = this.hasTires ? 1 : 0.28;

    const screen = document.getElementById("ride-screen");

    if (!screen) return;

    this.world = document.getElementById("ride-world");
    this.container = document.getElementById("ride-bike-container");
    this.ground = document.getElementById("ride-ground");

    if (!this.world || !this.container || !this.ground) return;

    screen.classList.add("active");

    document.getElementById("ride-bike-name").textContent = bike.name;

    this.renderBike();
    this.createMovingScenery();
    this.createSparkCanvas();
    this.createMobileControls();

    this.active = true;

    this.startAudio();

    this.lastTime = performance.now();

    document.body.style.overflow = "hidden";

    this.loop();
  },

  renderBike() {
    this.container.innerHTML = "";

    const canvas = createBikeCanvas(
      this.container,
      this.bike.parts || {},
      this.bike.colors || {
        hue: 0,
        saturation: 100,
        brightness: 100
      }
    );

    canvas.style.maxWidth = "none";
    canvas.style.width = "100%";

    this.frontWheelImages = [
      ...canvas.querySelectorAll('img[alt="frontWheel"]')
    ];

    this.rearWheelImages = [
      ...canvas.querySelectorAll('img[alt="rearWheel"]')
    ];

    const tires = [
      ...canvas.querySelectorAll('img[alt="tires"]')
    ];

    if (tires.length >= 2) {
      this.rearWheelImages.push(tires[0]);
      this.frontWheelImages.push(tires[1]);
    } else if (tires.length === 1) {
      this.rearWheelImages.push(tires[0]);
    }

    this.motorImages = [
      ...canvas.querySelectorAll('img[alt="motor"]')
    ];

    this.frontWheelImages.forEach(img => {
      img.style.transformOrigin = "50% 50%";
      img.style.willChange = "transform";
    });

    this.rearWheelImages.forEach(img => {
      img.style.transformOrigin = "50% 50%";
      img.style.willChange = "transform";
    });

    this.motorImages.forEach(img => {
      img.style.transformOrigin = "50% 65%";
      img.style.willChange = "transform";
    });
  },

  loop() {
    if (!this.active) return;

    this.animation = requestAnimationFrame(() => this.loop());

    const now = performance.now();

    const dt = Math.min(
      (now - this.lastTime) / 16.67,
      2
    );

    this.lastTime = now;

    this.update(dt);
    this.draw();
  },

  update(dt) {
    const keys = this.keys;

    // ACCELERATION
    if (keys["KeyD"] || keys.gas) {
      this.speed += this.acceleration * dt;
    }

    // BRAKES
    if (keys["KeyA"] || keys.brake) {
      this.speed -= this.braking * dt;

      // Braking lowers the front wheel.
      this.angularVelocity += 0.09 * dt;
    }

    // FRICTION
    if (!keys["KeyD"] && !keys.gas) {
      this.speed *= Math.pow(0.997, dt);
    }

    const actualMaxSpeed =
      this.maxSpeed * this.tireSpeedMultiplier;

    this.speed = Math.max(
      0,
      Math.min(actualMaxSpeed, this.speed)
    );

    // WHEELIE MODE
    const popping =
      keys.ControlLeft || keys.wheelie;

    if (popping && this.speed > 4) {
      this.angularVelocity -= 0.16 * dt;
    }

    // BALANCE
    if (keys.ArrowLeft || keys.balanceLeft) {
      this.angularVelocity -= 0.055 * dt;
    }

    if (keys.ArrowRight || keys.balanceRight) {
      this.angularVelocity += 0.055 * dt;
    }

    // GRAVITY AND ANGULAR DAMPING
    this.angularVelocity +=
      0.006 * Math.sin(this.angle * Math.PI / 180) * dt;

    this.angularVelocity *= Math.pow(0.985, dt);

    this.angle += this.angularVelocity * dt;

    this.angle = Math.max(-110, Math.min(0, this.angle));

    // AUTOMATIC RESTART IF ROTATED TOO FAR
    if (this.angle <= -110) {
      this.restart();
      return;
    }

    // FRONT WHEEL AIR TIME
    if (this.angle < -8 && this.speed > 2) {
      this.wheelieTime += dt * 16.67;

      if (this.wheelieTime >= 25000) {
        this.frontWheelStopped = true;
      }
    } else {
      this.wheelieTime = 0;
      this.frontWheelStopped = false;
    }

    // FRONT WHEEL SLOWLY COMES DOWN
    if (
      this.angle > -5 &&
      !popping &&
      !keys.ArrowLeft &&
      !keys.balanceLeft
    ) {
      this.angle *= Math.pow(0.985, dt);
    }

    // MOVEMENT DISTANCE
    const movement = this.speed * dt * 0.8;

    this.distance += movement / 10;

    // CONTINUOUS WORLD SCROLL
    this.worldOffset += movement;
    this.sceneryOffset += movement;

    // WHEEL ROTATION BASED ON WORLD MOVEMENT
    // This keeps wheel speed proportional to scrolling.

    const wheelRadius = 48;

    const rotationDelta =
      movement / wheelRadius * (180 / Math.PI);

    this.rearRotation += rotationDelta;

    // FRONT WHEEL SLOWS DOWN GRADUALLY IN AIR
    if (this.frontWheelStopped) {
      this.frontRotation *= Math.pow(0.985, dt);
    } else if (this.angle < -8) {
      this.frontRotation += rotationDelta;
    } else {
      this.frontRotation += rotationDelta;
    }

    // MOTOR ROTATION
    this.motorRotation += rotationDelta * 0.9;

    // SPARKS
    if (!this.hasTires && this.speed > 1) {
      this.createSparks(dt);
      this.updateScrapeSound();
    } else {
      this.stopScrapeSound();
    }

    this.updateHUD();
  },

  draw() {
    if (!this.container) return;

    // BIKE ANGLE
    this.container.style.transform =
      `rotate(${this.angle}deg)`;

    // GROUND MOVEMENT
    this.ground.style.transform =
      `translate3d(-${this.worldOffset % 400}px,0,0)`;

    // SCENERY MOVEMENT
    if (this.scenery) {
      this.scenery.style.transform =
        `translate3d(-${this.sceneryOffset % 1200}px,0,0)`;
    }

    // REAR WHEEL
    this.rearWheelImages.forEach(img => {
      img.style.transform =
        `rotate(${this.rearRotation}deg)`;
    });

    // FRONT WHEEL
    this.frontWheelImages.forEach(img => {
      img.style.transform =
        `rotate(${this.frontRotation}deg)`;
    });

    // MOTOR
    this.motorImages.forEach(img => {
      img.style.transform =
        `rotate(${this.motorRotation}deg)`;
    });

    this.drawSparks();
  },

  createMovingScenery() {
    if (!this.world) return;

    let scenery = document.getElementById("ride-scenery");

    if (scenery) scenery.remove();

    scenery = document.createElement("div");
    scenery.id = "ride-scenery";

    Object.assign(scenery.style, {
      position: "absolute",
      left: "0",
      bottom: "28%",
      width: "300%",
      height: "55%",
      pointerEvents: "none",
      zIndex: "1",
      willChange: "transform",
      backgroundImage: `
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          transparent 130px,
          rgba(30,30,30,.55) 131px,
          rgba(30,30,30,.55) 135px,
          transparent 136px,
          transparent 350px
        )
      `
    });

    // Stunt park obstacles and ramps
    for (let i = 0; i < 12; i++) {
      const obstacle = document.createElement("div");

      obstacle.style.position = "absolute";
      obstacle.style.left = (i * 350 + 100) + "px";
      obstacle.style.bottom = "0";
      obstacle.style.width = "100px";
      obstacle.style.height = (50 + Math.random() * 120) + "px";
      obstacle.style.background = "#454545";
      obstacle.style.borderTop = "5px solid #d71920";
      obstacle.style.transform = "skewX(-12deg)";

      scenery.appendChild(obstacle);
    }

    this.world.insertBefore(scenery, this.container);

    this.scenery = scenery;
  },

  updateHUD() {
    document.getElementById("ride-speed").textContent =
      Math.round(this.speed) + " MPH";

    document.getElementById("ride-distance").textContent =
      Math.round(this.distance) + " FT";

    document.getElementById("ride-angle").textContent =
      Math.round(Math.abs(this.angle)) + "°";
  },

  createSparkCanvas() {
    let canvas = document.getElementById("ride-sparks");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "ride-sparks";

      Object.assign(canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "20"
      });

      this.world.appendChild(canvas);
    }

    this.sparkCanvas = canvas;
    this.sparkContext = canvas.getContext("2d");

    this.resizeSparkCanvas();
  },

  resizeSparkCanvas() {
    if (!this.sparkCanvas) return;

    const rect = this.sparkCanvas.getBoundingClientRect();

    this.sparkCanvas.width = rect.width;
    this.sparkCanvas.height = rect.height;
  },

  createSparks(dt) {
    if (!this.sparkCanvas) return;

    if (Math.random() < 0.65) {
      this.sparks.push({
        x: this.sparkCanvas.width * 0.25,
        y: this.sparkCanvas.height * 0.77,
        vx: -Math.random() * 5,
        vy: -Math.random() * 4,
        life: 1
      });
    }

    this.sparks.forEach(spark => {
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      spark.vy += 0.15 * dt;
      spark.life -= 0.025 * dt;
    });

    this.sparks = this.sparks.filter(s => s.life > 0);
  },

  drawSparks() {
    if (!this.sparkContext) return;

    const ctx = this.sparkContext;

    ctx.clearRect(
      0, 0,
      this.sparkCanvas.width,
      this.sparkCanvas.height
    );

    this.sparks.forEach(spark => {
      ctx.globalAlpha = spark.life;
      ctx.fillStyle = "#ff9d00";

      ctx.fillRect(spark.x, spark.y, 4, 4);
    });

    ctx.globalAlpha = 1;
  },

  startAudio() {
    try {
      const Audio =
        window.AudioContext || window.webkitAudioContext;

      if (!Audio) return;

      if (!this.audioContext) {
        this.audioContext = new Audio();
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
    } catch (error) {
      console.warn("Audio unavailable:", error);
    }
  },

  updateScrapeSound() {
    if (!this.audioContext) return;

    if (!this.scrapeOscillator) {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      oscillator.type = "sawtooth";
      oscillator.frequency.value = 85;

      gain.gain.value = 0;

      oscillator.connect(gain);
      gain.connect(this.audioContext.destination);

      oscillator.start();

      this.scrapeOscillator = oscillator;
      this.scrapeGain = gain;
    }

    this.scrapeGain.gain.setTargetAtTime(
      Math.min(this.speed / 100, 0.12),
      this.audioContext.currentTime,
      0.05
    );
  },

  stopScrapeSound() {
    if (!this.scrapeGain || !this.audioContext) return;

    this.scrapeGain.gain.setTargetAtTime(
      0,
      this.audioContext.currentTime,
      0.05
    );
  },

  createMobileControls() {
    const screen = document.getElementById("ride-screen");

    let controls = document.getElementById("mobile-ride-controls");

    if (controls) controls.remove();

    controls = document.createElement("div");
    controls.id = "mobile-ride-controls";
    controls.className = "mobile-ride-controls";

    const buttons = [
      ["brake", "BRAKE"],
      ["gas", "GAS"],
      ["balanceLeft", "◀"],
      ["balanceRight", "▶"],
      ["wheelie", "POP"]
    ];

    buttons.forEach(([key, label]) => {
      const button = document.createElement("button");

      button.textContent = label;

      button.addEventListener("pointerdown", event => {
        event.preventDefault();
        this.keys[key] = true;
        button.classList.add("pressed");
        button.setPointerCapture(event.pointerId);
      });

      const release = event => {
        event.preventDefault();
        this.keys[key] = false;
        button.classList.remove("pressed");
      };

      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);

      controls.appendChild(button);
    });

    screen.appendChild(controls);
  },

  restart() {
    if (!this.active) return;

    this.speed = 0;
    this.distance = 0;
    this.angle = 0;
    this.angularVelocity = 0;

    this.worldOffset = 0;
    this.sceneryOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;
    this.motorRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;

    this.sparks = [];
    this.keys = {};

    this.stopScrapeSound();

    this.draw();
    this.updateHUD();
  },

  stop() {
    this.active = false;

    if (this.animation) {
      cancelAnimationFrame(this.animation);
    }

    this.animation = null;
    this.keys = {};

    this.stopScrapeSound();

    document.getElementById("ride-screen")
      .classList.remove("active");

    document.body.style.overflow = "";

    this.bike = null;

    if (this.scenery) {
      this.scenery.remove();
      this.scenery = null;
    }

    const controls = document.getElementById("mobile-ride-controls");

    if (controls) controls.remove();
  }
};


/* =========================================
   KEYBOARD INPUT
========================================= */

window.addEventListener("keydown", event => {
  if (!RideGame.active) return;

  const controlledKeys = [
    "KeyD",
    "KeyA",
    "ControlLeft",
    "ArrowLeft",
    "ArrowRight",
    "KeyR",
    "Escape"
  ];

  if (controlledKeys.includes(event.code)) {
    event.preventDefault();
  }

  RideGame.keys[event.code] = true;

  if (event.code === "KeyR" && !event.repeat) {
    RideGame.restart();
  }

  if (event.code === "Escape" && !event.repeat) {
    exitRide();
  }
});

window.addEventListener("keyup", event => {
  RideGame.keys[event.code] = false;
});

window.addEventListener("blur", () => {
  RideGame.keys = {};
});


/* =========================================
   GARAGE RIDE BUTTONS
========================================= */

function addRideButtons() {
  document.querySelectorAll(".garage-card").forEach(card => {
    if (card.querySelector(".ride-button")) return;

    const buttons = card.querySelector(".garage-buttons");

    const title = card.querySelector("h3");

    const bike = getSavedBikes().find(item =>
      title && item.name === title.textContent
    );

    if (!bike || !buttons) return;

    const button = document.createElement("button");

    button.textContent = "▶ RIDE";
    button.className = "ride-button";

    button.onclick = () => RideGame.start(bike);

    buttons.insertBefore(button, buttons.firstChild);
  });
}


/* =========================================
   GARAGE OBSERVER
========================================= */

function initializeRideSystem() {
  addRideButtons();

  const garage = document.getElementById("saved-bikes");

  if (!garage) return;

  const observer = new MutationObserver(addRideButtons);

  observer.observe(garage, {
    childList: true,
    subtree: true
  });
}


/* =========================================
   GAME BUTTONS
========================================= */

function exitRide() {
  RideGame.stop();
}

function restartRide() {
  RideGame.restart();
}


/* =========================================
   STARTUP
========================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeRideSystem,
    { once: true }
  );
} else {
  initializeRideSystem();
}
