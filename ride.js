
/* =========================================
   SUPER73 2D RIDING ENGINE
   REAR-WHEEL PIVOT + BRAKING + MOVING WORLD
   PC + MOBILE
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

  rearRotation: 0,
  frontRotation: 0,

  wheelieTime: 0,
  frontWheelStopped: false,

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

  scenery: [],

  start(bike) {
    if (!bike) return;

    const stats = getPerformanceStats(bike.parts || {});

    this.maxSpeed = Number(stats.topSpeed) || 0;

    if (this.maxSpeed <= 0) {
      alert("This bike cannot move. Check its battery, motor and controller.");
      return;
    }

    this.bike = bike;

    this.speed = 0;
    this.distance = 0;

    this.angle = 0;
    this.angularVelocity = 0;

    this.worldOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;

    this.sparks = [];
    this.keys = {};

    const tireSelection = bike.parts?.tires;

    this.hasTires = Array.isArray(tireSelection)
      ? tireSelection.length > 0
      : Boolean(tireSelection);

    this.tireSpeedMultiplier = this.hasTires ? 1 : 0.28;

    const screen = document.getElementById("ride-screen");

    if (!screen) {
      console.error("Ride screen missing.");
      return;
    }

    screen.classList.add("active");

    document.getElementById("ride-bike-name").textContent =
      bike.name;

    this.container = document.getElementById("ride-bike-container");
    this.ground = document.getElementById("ride-ground");
    this.world = document.getElementById("ride-world");

    this.renderBike();
    this.createWorldBackground();
    this.createSparkCanvas();
    this.createMobileControls();

    this.active = true;

    this.startAudio();

    this.lastTime = performance.now();

    document.body.style.overflow = "hidden";

    this.positionBikeOnGround();

    this.loop();
  },

  /* =====================================
     BIKE RENDERING
  ===================================== */

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

    this.frontWheelImages = [];
    this.rearWheelImages = [];

    const frontWheel = canvas.querySelectorAll(
      'img[alt="frontWheel"]'
    );

    const rearWheel = canvas.querySelectorAll(
      'img[alt="rearWheel"]'
    );

    this.frontWheelImages.push(...frontWheel);
    this.rearWheelImages.push(...rearWheel);

    // Tire images are created in rear-then-front order.
    const tireImages = canvas.querySelectorAll(
      'img[alt="tires"]'
    );

    if (tireImages.length >= 2) {
      this.rearWheelImages.push(tireImages[0]);
      this.frontWheelImages.push(tireImages[1]);
    } else if (tireImages.length === 1) {
      this.rearWheelImages.push(tireImages[0]);
    }

    // Rear axle center:
    // Rear wheel position = left 4%, top 52%, size 27%.
    // Center = 17.5%, 65.5%.

    this.container.style.transformOrigin = "17.5% 65.5%";
    this.container.style.transform = "rotate(0deg)";

    this.frontWheelImages.forEach(img => {
      img.style.transformOrigin = "center center";
    });

    this.rearWheelImages.forEach(img => {
      img.style.transformOrigin = "center center";
    });

    this.positionBikeOnGround();
  },

  /* =====================================
     KEEP REAR AXLE AT GROUND LEVEL
  ===================================== */

  positionBikeOnGround() {
    if (!this.container || !this.world || !this.ground) return;

    const bikeRect = this.container.getBoundingClientRect();

    const bikeWidth = this.container.offsetWidth;

    const groundHeight = this.ground.offsetHeight;

    // Rear axle is 34.5% above the bottom
    // of the square bike canvas.

    const axleOffset = bikeWidth * 0.345;

    const bottomPosition = groundHeight - axleOffset;

    this.container.style.bottom = bottomPosition + "px";
  },

  /* =====================================
     MOVING BACKGROUND
  ===================================== */

  createWorldBackground() {
    if (!this.world) return;

    this.world.querySelectorAll(".ride-scenery-layer")
      .forEach(layer => layer.remove());

    this.scenery = [];

    const sceneryData = [
      {
        name: "far-hills",
        speed: 0.12,
        height: "45%"
      },
      {
        name: "mountains",
        speed: 0.22,
        height: "55%"
      },
      {
        name: "trees",
        speed: 0.55,
        height: "75%"
      },
      {
        name: "buildings",
        speed: 0.85,
        height: "80%"
      }
    ];

    sceneryData.forEach(data => {
      const layer = document.createElement("div");

      layer.className =
        "ride-scenery-layer " + data.name;

      layer.style.height = data.height;

      this.world.insertBefore(
        layer,
        this.ground
      );

      this.scenery.push({
        element: layer,
        speed: data.speed
      });
    });
  },

  updateBackground(dt) {
    this.scenery.forEach(layer => {
      const movement =
        this.worldOffset * layer.speed;

      layer.element.style.transform =
        `translate3d(-${movement % 1800}px, 0, 0)`;
    });
  },

  /* =====================================
     GAME LOOP
  ===================================== */

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

  /* =====================================
     PHYSICS
  ===================================== */

  update(dt) {
    const keys = this.keys;

    const gas =
      keys["KeyD"] || keys["gas"];

    const brake =
      keys["KeyA"] || keys["brake"];

    const popping =
      keys["ControlLeft"] || keys["wheelie"];

    const balanceLeft =
      keys["ArrowLeft"] || keys["balanceLeft"];

    const balanceRight =
      keys["ArrowRight"] || keys["balanceRight"];

    // ACCELERATION

    if (gas) {
      this.speed += this.acceleration * dt;
    }

    // BRAKING

    if (brake) {
      this.speed -= this.braking * dt;

      // Bring the front wheel down.
      // Positive angular velocity moves
      // the negative wheelie angle toward zero.

      this.angularVelocity += 0.18 * dt;

      // Additional smooth front-end lowering.

      if (this.angle < 0) {
        this.angle += Math.min(
          Math.abs(this.angle),
          0.32 * dt
        );
      }
    }

    // NATURAL FRICTION

    if (!gas && !brake) {
      this.speed *= Math.pow(0.997, dt);
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
      this.angularVelocity -= 0.16 * dt;
    }

    // BALANCE

    if (balanceLeft) {
      this.angularVelocity -= 0.055 * dt;
    }

    if (balanceRight) {
      this.angularVelocity += 0.055 * dt;
    }

    // GRAVITY
    // Gradual lowering instead of snapping down.

    if (!popping && !brake) {
      if (this.angle < 0) {
        this.angularVelocity += 0.0035 * dt;
      }
    }

    this.angularVelocity *= Math.pow(0.985, dt);

    this.angle += this.angularVelocity * dt;

    // NORMAL RIDING ANGLE

    this.angle = Math.min(0, this.angle);

    // MAXIMUM WHEELIE ANGLE

    if (this.angle < -110) {
      this.restart();
      return;
    }

    // FRONT WHEEL AIR TIME

    if (this.angle < -8 && this.speed > 2) {
      this.wheelieTime += dt * 16.667;

      if (this.wheelieTime >= 25000) {
        this.frontWheelStopped = true;
      }
    } else {
      this.wheelieTime = 0;
      this.frontWheelStopped = false;
    }

    // WHEEL ROTATION

    const wheelSpin = this.speed * 0.12 * dt;

    this.rearRotation += wheelSpin;

    if (!this.frontWheelStopped) {
      this.frontRotation += wheelSpin;
    }

    // DISTANCE

    this.distance += this.speed * dt / 60;

    // WORLD MOVEMENT

    this.worldOffset += this.speed * dt * 2;

    this.updateBackground(dt);

    // SPARKS

    if (!this.hasTires && this.speed > 1) {
      this.createSparks(dt);
      this.updateScrapeSound();
    } else {
      this.stopScrapeSound();
    }

    this.updateHUD();
  },

  /* =====================================
     DRAWING
  ===================================== */

  draw() {
    if (!this.container) return;

    // Rotate around rear axle.

    this.container.style.transform =
      `rotate(${this.angle}deg)`;

    // Move ground.

    if (this.ground) {
      this.ground.style.transform =
        `translate3d(-${this.worldOffset % 400}px, 0, 0)`;
    }

    // Rear wheel.

    this.rearWheelImages.forEach(img => {
      img.style.transform =
        `rotate(${this.rearRotation}deg)`;
    });

    // Front wheel.

    this.frontWheelImages.forEach(img => {
      img.style.transform =
        `rotate(${this.frontRotation}deg)`;
    });

    this.drawSparks();
  },

  /* =====================================
     HUD
  ===================================== */

  updateHUD() {
    const speed = document.getElementById("ride-speed");
    const distance = document.getElementById("ride-distance");
    const angle = document.getElementById("ride-angle");

    if (speed) {
      speed.textContent =
        Math.round(this.speed) + " MPH";
    }

    if (distance) {
      distance.textContent =
        Math.round(this.distance) + " FT";
    }

    if (angle) {
      angle.textContent =
        Math.round(Math.abs(this.angle)) + "°";
    }
  },

  /* =====================================
     SPARK CANVAS
  ===================================== */

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

    const rect = this.world.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    this.sparkCanvas.width = rect.width * dpr;
    this.sparkCanvas.height = rect.height * dpr;

    this.sparkContext.setTransform(
      dpr, 0, 0, dpr, 0, 0
    );
  },

  createSparks(dt) {
    if (!this.sparkCanvas) return;

    const width = this.sparkCanvas.clientWidth;
    const height = this.sparkCanvas.clientHeight;

    if (Math.random() < 0.65) {
      this.sparks.push({
        x: width * 0.25,
        y: height * 0.77,
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

    this.sparks = this.sparks.filter(
      spark => spark.life > 0
    );
  },

  drawSparks() {
    if (!this.sparkContext) return;

    const ctx = this.sparkContext;

    ctx.clearRect(
      0,
      0,
      this.sparkCanvas.width,
      this.sparkCanvas.height
    );

    this.sparks.forEach(spark => {
      ctx.globalAlpha = spark.life;
      ctx.fillStyle = "#ff9d00";

      ctx.fillRect(
        spark.x,
        spark.y,
        4,
        4
      );
    });

    ctx.globalAlpha = 1;
  },

  /* =====================================
     AUDIO
  ===================================== */

  startAudio() {
    try {
      const Audio =
        window.AudioContext ||
        window.webkitAudioContext;

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
      const oscillator =
        this.audioContext.createOscillator();

      const gain =
        this.audioContext.createGain();

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

  /* =====================================
     MOBILE CONTROLS
  ===================================== */

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

        button.addEventListener("pointerdown", event => {
          event.preventDefault();

          button.setPointerCapture(event.pointerId);

          this.keys[key] = true;

          button.classList.add("pressed");
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
    }
  },

  /* =====================================
     RESTART
  ===================================== */

  restart() {
    if (!this.active) return;

    this.speed = 0;
    this.distance = 0;

    this.angle = 0;
    this.angularVelocity = 0;

    this.worldOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;

    this.sparks = [];
    this.keys = {};

    this.stopScrapeSound();

    this.updateBackground(0);
    this.draw();
    this.updateHUD();
  },

  /* =====================================
     EXIT
  ===================================== */

  stop() {
    this.active = false;

    if (this.animation) {
      cancelAnimationFrame(this.animation);
    }

    this.animation = null;
    this.keys = {};

    this.stopScrapeSound();

    const screen = document.getElementById("ride-screen");

    if (screen) {
      screen.classList.remove("active");
    }

    document.body.style.overflow = "";

    this.bike = null;

    const controls = document.getElementById(
      "mobile-ride-controls"
    );

    if (controls) controls.remove();

    this.scenery.forEach(layer => {
      layer.element.remove();
    });

    this.scenery = [];
  }
};


/* =========================================
   KEYBOARD CONTROLS
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
      title && item.id === Number(card.dataset.bikeId)
    ) || getSavedBikes().find(item =>
      title && item.name === title.textContent
    );

    if (!bike || !buttons) return;

    card.dataset.bikeId = bike.id;

    const button = document.createElement("button");

    button.textContent = "▶ RIDE";
    button.className = "ride-button";

    button.onclick = () => {
      RideGame.start(bike);
    };

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

  const observer = new MutationObserver(() => {
    addRideButtons();
  });

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
