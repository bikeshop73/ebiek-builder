
const RideGame = {
  active: false,
  bike: null,

  speed: 0,
  distance: 0,

  // Negative angle = front wheel up
  angle: 0,
  angularVelocity: 0,

  maxSpeed: 0,
  acceleration: 0.12,
  braking: 0.25,

  keys: {},
  animation: null,
  lastTime: 0,

  worldOffset: 0,
  sceneryOffset: 0,

  rearRotation: 0,
  frontRotation: 0,

  wheelieTime: 0,

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

  frontWheelImages: [],
  rearWheelImages: [],

  wheelDiameter: 150,

  start(bike) {
    if (!bike) return;

    this.bike = bike;

    const stats = getPerformanceStats(bike.parts || {});

    this.maxSpeed = Number(stats.topSpeed) || 0;

    if (this.maxSpeed <= 0) {
      alert("This bike needs a battery, motor and controller.");
      return;
    }

    this.speed = 0;
    this.distance = 0;
    this.angle = 0;
    this.angularVelocity = 0;

    this.worldOffset = 0;
    this.sceneryOffset = 0;

    this.frontRotation = 0;
    this.rearRotation = 0;

    this.wheelieTime = 0;

    this.sparks = [];
    this.keys = {};

    this.hasTires =
      Array.isArray(bike.parts?.tires) &&
      bike.parts.tires.length >= 2;

    this.tireSpeedMultiplier = this.hasTires ? 1 : 0.28;

    const screen = document.getElementById("ride-screen");

    if (!screen) {
      console.error("Ride screen missing.");
      return;
    }

    screen.classList.add("active");

    document.getElementById("ride-bike-name").textContent =
      bike.name;

    this.container = document.getElementById(
      "ride-bike-container"
    );

    this.ground = document.getElementById("ride-ground");
    this.world = document.getElementById("ride-world");

    this.renderBike();
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

    const images = [...canvas.querySelectorAll("img")];

    this.frontWheelImages = [];
    this.rearWheelImages = [];

    images.forEach(img => {
      const category = img.alt;

      if (category === "frontWheel") {
        this.frontWheelImages.push(img);
      }

      if (category === "rearWheel") {
        this.rearWheelImages.push(img);
      }

      if (category === "tires") {
        const left = parseFloat(img.style.left);

        if (left > 40) {
          this.frontWheelImages.push(img);
        } else {
          this.rearWheelImages.push(img);
        }
      }
    });

    this.frontWheelImages.forEach(img => {
      img.style.transformOrigin = "center center";
    });

    this.rearWheelImages.forEach(img => {
      img.style.transformOrigin = "center center";
    });
  },

  loop() {
    if (!this.active) return;

    this.animation = requestAnimationFrame(() => {
      this.loop();
    });

    const now = performance.now();

    const dt = Math.min(
      (now - this.lastTime) / 16.667,
      2
    );

    this.lastTime = now;

    this.update(dt);
    this.draw();
  },

  update(dt) {
    const keys = this.keys;

    const gas = keys["KeyD"] || keys.gas;
    const brake = keys["KeyA"] || keys.brake;

    const popping =
      keys["ControlLeft"] || keys.wheelie;

    const balanceLeft =
      keys["ArrowLeft"] || keys.balanceLeft;

    const balanceRight =
      keys["ArrowRight"] || keys.balanceRight;

    // ACCELERATION
    if (gas) {
      this.speed += this.acceleration * dt;
    }

    // BRAKING
    if (brake) {
      this.speed -= this.braking * dt;

      // Bring the front wheel down.
      this.angularVelocity += 0.12 * dt;

      this.angle += 0.75 * dt;

      if (this.angle > 0) {
        this.angle = 0;
      }
    }

    // NATURAL FRICTION
    if (!gas && !brake) {
      this.speed *= Math.pow(0.998, dt);
    }

    // TOP SPEED
    const actualMaxSpeed =
      this.maxSpeed * this.tireSpeedMultiplier;

    this.speed = Math.max(
      0,
      Math.min(actualMaxSpeed, this.speed)
    );

    // WHEELIE POP
    if (popping && this.speed > 4 && !brake) {
      this.angularVelocity -= 0.20 * dt;
    }

    // BALANCE
    if (balanceLeft) {
      this.angularVelocity -= 0.045 * dt;
    }

    if (balanceRight) {
      this.angularVelocity += 0.045 * dt;
    }

    // GRAVITY AND BALANCE
    if (!popping && !brake) {
      this.angularVelocity +=
        0.0025 * Math.sin(
          Math.abs(this.angle) * Math.PI / 180
        ) * dt;
    }

    // SLOWER ROTATION DECAY
    this.angularVelocity *= Math.pow(0.985, dt);

    this.angle += this.angularVelocity * dt;

    // MAXIMUM WHEELIE
    if (this.angle < -110) {
      this.restart();
      return;
    }

    // PREVENT FORWARD FLIP
    if (this.angle > 15) {
      this.angle = 15;
      this.angularVelocity = 0;
    }

    // GENTLE FRONT-WHEEL DROP
    if (
      !popping &&
      !brake &&
      this.angle < -2 &&
      this.speed < 5
    ) {
      this.angularVelocity += 0.015 * dt;
    }

    // WHEEL ROTATION
    // Both wheels match actual movement.
    const movement = this.speed * 0.35 * dt;

    const degrees = (
      movement / this.wheelDiameter
    ) * 360;

    this.rearRotation += degrees;

    // Front wheel spins independently while airborne.
    this.frontRotation += degrees;

    // DISTANCE
    this.distance += this.speed * dt / 60;

    // MOVING WORLD
    this.worldOffset += movement;

    this.sceneryOffset += movement * 0.35;

    // SPARKS ONLY WITHOUT TIRES
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

    // Rotate around rear wheel center.
    this.container.style.transformOrigin =
      "17.5% 65.5%";

    this.container.style.transform =
      `rotate(${this.angle}deg)`;

    // Road movement
    if (this.ground) {
      this.ground.style.transform =
        `translate3d(-${this.worldOffset % 600}px,0,0)`;
    }

    // Background scenery
    if (this.world) {
      this.world.style.setProperty(
        "--scenery-offset",
        `${-(this.sceneryOffset % 1000)}px`
      );
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

    this.drawSparks();
  },

  updateHUD() {
    const speed = document.getElementById("ride-speed");
    const distance = document.getElementById("ride-distance");
    const angle = document.getElementById("ride-angle");

    if (speed) {
      speed.textContent = Math.round(this.speed) + " MPH";
    }

    if (distance) {
      distance.textContent = Math.round(this.distance) + " FT";
    }

    if (angle) {
      angle.textContent = Math.round(this.angle) + "°";
    }
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.sparkCanvas.width = rect.width * dpr;
    this.sparkCanvas.height = rect.height * dpr;

    this.sparkContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  createSparks(dt) {
    if (!this.sparkCanvas) return;

    const rect = this.sparkCanvas.getBoundingClientRect();

    if (Math.random() < 0.7) {
      this.sparks.push({
        x: rect.width * 0.25,
        y: rect.height * 0.78,
        vx: -Math.random() * 7,
        vy: -Math.random() * 5,
        life: 1,
        size: 2 + Math.random() * 3
      });
    }

    this.sparks.forEach(spark => {
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;

      spark.vy += 0.18 * dt;

      spark.life -= 0.035 * dt;
    });

    this.sparks = this.sparks.filter(
      spark => spark.life > 0
    );
  },

  drawSparks() {
    if (!this.sparkContext) return;

    const ctx = this.sparkContext;
    const rect = this.sparkCanvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

    this.sparks.forEach(spark => {
      ctx.globalAlpha = spark.life;
      ctx.fillStyle = "#ffb000";
      ctx.shadowColor = "#ff4500";
      ctx.shadowBlur = 8;

      ctx.fillRect(
        spark.x,
        spark.y,
        spark.size,
        spark.size
      );
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
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
      Math.min(this.speed / 100, 0.15),
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

    let controls = document.getElementById(
      "mobile-ride-controls"
    );

    if (!controls) {
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
        button.dataset.control = key;

        const release = event => {
          event.preventDefault();
          this.keys[key] = false;
          button.classList.remove("pressed");
        };

        button.addEventListener("pointerdown", event => {
          event.preventDefault();
          this.keys[key] = true;
          button.classList.add("pressed");
          button.setPointerCapture(event.pointerId);
        });

        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
        button.addEventListener("lostpointercapture", release);

        controls.appendChild(button);
      });

      screen.appendChild(controls);
    }
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

    this.wheelieTime = 0;

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
      ?.classList.remove("active");

    document.body.style.overflow = "";

    this.bike = null;

    document.getElementById("mobile-ride-controls")?.remove();

    if (this.sparkContext && this.sparkCanvas) {
      this.sparkContext.clearRect(
        0,
        0,
        this.sparkCanvas.width,
        this.sparkCanvas.height
      );
    }
  }
};


// KEYBOARD
window.addEventListener("keydown", event => {
  if (!RideGame.active) return;

  const controlled = [
    "KeyD",
    "KeyA",
    "ControlLeft",
    "ArrowLeft",
    "ArrowRight",
    "KeyR",
    "Escape"
  ];

  if (controlled.includes(event.code)) {
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

window.addEventListener("resize", () => {
  if (RideGame.active) {
    RideGame.resizeSparkCanvas();
  }
});


// GARAGE RIDE BUTTONS
function addRideButtons() {
  document.querySelectorAll(".garage-card").forEach(card => {
    if (card.querySelector(".ride-button")) return;

    const buttons = card.querySelector(".garage-buttons");
    const title = card.querySelector("h3");

    if (!buttons || !title) return;

    const bike = getSavedBikes().find(
      item => item.name === title.textContent
    );

    if (!bike) return;

    const button = document.createElement("button");

    button.textContent = "▶ RIDE";
    button.className = "ride-button";

    button.onclick = () => RideGame.start(bike);

    buttons.insertBefore(button, buttons.firstChild);
  });
}


// GARAGE OBSERVER
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


// GAME BUTTONS
function exitRide() {
  RideGame.stop();
}

function restartRide() {
  RideGame.restart();
}


// STARTUP
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeRideSystem,
    { once: true }
  );
} else {
  initializeRideSystem();
}
