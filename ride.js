
/* =========================================
   SUPER73 2D RIDING ENGINE
   COMPLETE REWRITE
   GRAVITY + WHEELIES + ANIMATION + MOBILE
========================================= */

const RideGame = {
  active: false,
  bike: null,

  speed: 0,
  maxSpeed: 0,
  distance: 0,

  // Wheelie angle is NEGATIVE.
  // 0 = level, -110 = maximum wheelie.
  angle: 0,
  angularVelocity: 0,

  maxWheelieAngle: -110,

  wheelieMode: false,

  acceleration: 22,
  braking: 45,
  friction: 2,

  gravity: 28,
  wheelieLift: 75,
  balancePower: 85,

  keys: {},

  animation: null,
  lastTime: 0,

  worldOffset: 0,
  backgroundOffset: 0,

  rearRotation: 0,
  frontRotation: 0,
  motorRotation: 0,

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

  frontWheelImages: [],
  rearWheelImages: [],
  motorImages: [],

  bikeCanvas: null,

  mobileControls: null,

  /* =====================================
     START
  ===================================== */

  start(bike) {
    if (!bike || this.active) return;

    this.bike = bike;

    const stats = getPerformanceStats(bike.parts || {});

    this.maxSpeed = Number(stats.topSpeed) || 0;

    if (this.maxSpeed <= 0) {
      alert(
        "This bike cannot move. Check the battery, motor and controller."
      );
      return;
    }

    this.speed = 0;
    this.distance = 0;

    this.angle = 0;
    this.angularVelocity = 0;

    this.wheelieMode = false;

    this.worldOffset = 0;
    this.backgroundOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;
    this.motorRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;

    this.sparks = [];
    this.keys = {};

    this.hasTires = Boolean(bike.parts?.tires);

    this.tireSpeedMultiplier = this.hasTires ? 1 : 0.28;

    const screen = document.getElementById("ride-screen");

    this.container = document.getElementById(
      "ride-bike-container"
    );

    this.ground = document.getElementById("ride-ground");

    if (!screen || !this.container || !this.ground) {
      console.error("Missing riding screen elements.");
      return;
    }

    document.getElementById("ride-bike-name").textContent =
      bike.name || "YOUR BIKE";

    screen.classList.add("active");

    document.body.style.overflow = "hidden";

    this.renderBike();
    this.createSparkCanvas();
    this.createMobileControls();

    this.active = true;

    this.startAudio();

    this.lastTime = performance.now();

    this.updateHUD();

    this.loop();
  },

  /* =====================================
     RENDER BIKE
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

    this.bikeCanvas = canvas;

    canvas.style.width = "100%";
    canvas.style.maxWidth = "none";

    /*
      Rear wheel center:
      left: 4%
      width: 27%
      top: 52%
      height: 27%

      Rotation happens around the rear wheel.
    */

    this.container.style.transformOrigin =
      "17.5% 65.5%";

    this.frontWheelImages = [];
    this.rearWheelImages = [];
    this.motorImages = [];

    const allImages = canvas.querySelectorAll("img");

    const tireImages = [];

    allImages.forEach(img => {
      const category = img.alt;

      if (category === "frontWheel") {
        this.frontWheelImages.push(img);
      }

      if (category === "rearWheel") {
        this.rearWheelImages.push(img);
      }

      if (category === "tires") {
        tireImages.push(img);
      }

      if (category === "motor") {
        this.motorImages.push(img);
      }
    });

    // Tire layers are created rear first, then front.
    if (tireImages.length >= 2) {
      this.rearWheelImages.push(tireImages[0]);
      this.frontWheelImages.push(tireImages[1]);
    } else if (tireImages.length === 1) {
      this.rearWheelImages.push(tireImages[0]);
    }

    this.rearWheelImages.forEach(img => {
      img.style.transformOrigin = "center center";
    });

    this.frontWheelImages.forEach(img => {
      img.style.transformOrigin = "center center";
    });

    // Motor rotates slightly below its center.
    this.motorImages.forEach(img => {
      img.style.transformOrigin = "50% 56%";
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
      (now - this.lastTime) / 1000,
      0.05
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
      keys["KeyD"] || keys.gas;

    const brake =
      keys["KeyA"] || keys.brake;

    const left =
      keys["ArrowLeft"] || keys.balanceLeft;

    const right =
      keys["ArrowRight"] || keys.balanceRight;

    // ACCELERATION
    if (gas) {
      this.speed += this.acceleration * dt;
    }

    // BRAKING
    if (brake) {
      this.speed -= this.braking * dt;
    }

    // NATURAL FRICTION
    if (!gas && !brake) {
      this.speed *= Math.exp(-this.friction * dt);
    }

    // TOP SPEED
    const actualMaxSpeed =
      this.maxSpeed * this.tireSpeedMultiplier;

    this.speed = Math.max(
      0,
      Math.min(actualMaxSpeed, this.speed)
    );

    // WHEELIE MODE
    if (this.wheelieMode && gas && this.speed > 2) {
      this.angularVelocity -= this.wheelieLift * dt;
    }

    // BALANCING
    if (left) {
      this.angularVelocity -= this.balancePower * dt;
    }

    if (right) {
      this.angularVelocity += this.balancePower * dt;
    }

    /*
      GRAVITY

      Gravity constantly pulls the front wheel down.
      This is slower than the wheelie lift so the bike
      doesn't immediately fall when gas is released.
    */

    const gravityMultiplier = brake ? 3.5 : 1;

    this.angularVelocity +=
      this.gravity * gravityMultiplier * dt;

    // AIR RESISTANCE / ANGULAR DAMPING
    this.angularVelocity *= Math.exp(-2.2 * dt);

    // UPDATE ANGLE
    this.angle += this.angularVelocity * dt;

    // NEVER ALLOW POSITIVE ANGLES
    if (this.angle > 0) {
      this.angle = 0;
      this.angularVelocity = 0;
    }

    // MAXIMUM WHEELIE
    if (this.angle < this.maxWheelieAngle) {
      this.restart();
      return;
    }

    // FRONT WHEEL AIR TIME
    if (this.angle < -8 && this.speed > 2) {
      this.wheelieTime += dt * 1000;

      if (this.wheelieTime >= 25000) {
        this.frontWheelStopped = true;
      }
    } else {
      this.wheelieTime = 0;
      this.frontWheelStopped = false;
    }

    // WHEEL ROTATION MATCHES GROUND SPEED
    const wheelDiameter =
      this.bikeCanvas
        ? this.bikeCanvas.getBoundingClientRect().width * 0.27
        : 148;

    const circumference =
      Math.PI * wheelDiameter;

    // Background movement in pixels per second.
    const pixelsPerSecond = this.speed * 18;

    const wheelDegreesPerSecond =
      circumference > 0
        ? pixelsPerSecond / circumference * 360
        : 0;

    const wheelSpin = wheelDegreesPerSecond * dt;

    // REAR WHEEL
    this.rearRotation += wheelSpin;

    // FRONT WHEEL
    if (!this.frontWheelStopped) {
      if (this.angle < -8) {
        // Slowly loses rotation while airborne.
        this.frontRotation += wheelSpin * 0.75;
      } else {
        this.frontRotation += wheelSpin;
      }
    } else {
      // Slowly coast to a complete stop.
      this.frontRotation +=
        wheelSpin * Math.exp(-3 * dt);
    }

    // MOTOR
    this.motorRotation += wheelSpin * 1.15;

    // BACKGROUND
    this.worldOffset += pixelsPerSecond * dt;

    this.backgroundOffset += pixelsPerSecond * dt;

    // DISTANCE
    this.distance += this.speed * dt * 1.46667;

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
     DRAW
  ===================================== */

  draw() {
    if (!this.container) return;

    this.container.style.transform =
      `rotate(${this.angle}deg)`;

    // MOVING GROUND
    this.ground.style.backgroundPosition =
      `${-this.backgroundOffset}px 0`;

    // Move ground itself.
    this.ground.style.transform =
      `translateX(-${this.worldOffset % 400}px)`;

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
        Math.round(this.angle) + "°";
    }
  },

  /* =====================================
     SPARK CANVAS
  ===================================== */

  createSparkCanvas() {
    const world = document.getElementById("ride-world");

    if (!world) return;

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

      world.appendChild(canvas);
    }

    this.sparkCanvas = canvas;
    this.sparkContext = canvas.getContext("2d");

    this.resizeSparkCanvas();
  },

  resizeSparkCanvas() {
    if (!this.sparkCanvas) return;

    const rect = this.sparkCanvas.getBoundingClientRect();

    this.sparkCanvas.width =
      rect.width * window.devicePixelRatio;

    this.sparkCanvas.height =
      rect.height * window.devicePixelRatio;

    this.sparkContext.setTransform(
      window.devicePixelRatio,
      0,
      0,
      window.devicePixelRatio,
      0,
      0
    );
  },

  /* =====================================
     SPARK PARTICLES
  ===================================== */

  createSparks(dt) {
    if (!this.sparkCanvas) return;

    const rect = this.sparkCanvas.getBoundingClientRect();

    if (Math.random() < 0.8) {
      this.sparks.push({
        x: rect.width * 0.25,
        y: rect.height * 0.80,

        vx: -Math.random() * 180,
        vy: -Math.random() * 180,

        life: 1,
        size: 2 + Math.random() * 3
      });
    }

    this.sparks.forEach(spark => {
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;

      spark.vy += 400 * dt;

      spark.life -= 1.8 * dt;
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

      ctx.fillStyle = Math.random() > 0.5
        ? "#ff9d00"
        : "#ffe36b";

      ctx.fillRect(
        spark.x,
        spark.y,
        spark.size,
        spark.size
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

  /* =====================================
     MOBILE CONTROLS
  ===================================== */

  createMobileControls() {
    const screen = document.getElementById("ride-screen");

    let controls = document.getElementById(
      "mobile-ride-controls"
    );

    if (controls) controls.remove();

    controls = document.createElement("div");

    controls.id = "mobile-ride-controls";
    controls.className = "mobile-ride-controls";

    const buttons = [
      ["brake", "BRAKE"],
      ["gas", "GAS"],
      ["balanceLeft", "◀"],
      ["balanceRight", "▶"],
      ["wheelie", "CTRL / WHEELIE"]
    ];

    buttons.forEach(([key, label]) => {
      const button = document.createElement("button");

      button.textContent = label;

      if (key === "wheelie") {
        button.addEventListener("pointerdown", event => {
          event.preventDefault();

          this.wheelieMode = !this.wheelieMode;

          button.classList.toggle(
            "pressed",
            this.wheelieMode
          );
        });
      } else {
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
      }

      controls.appendChild(button);
    });

    screen.appendChild(controls);

    this.mobileControls = controls;
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

    this.wheelieMode = false;

    this.worldOffset = 0;
    this.backgroundOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;
    this.motorRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;

    this.sparks = [];
    this.keys = {};

    this.stopScrapeSound();

    const wheelieButton = this.mobileControls?.querySelector(
      'button:last-child'
    );

    if (wheelieButton) {
      wheelieButton.classList.remove("pressed");
    }

    this.updateHUD();
    this.draw();
  },

  /* =====================================
     STOP
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

    if (this.mobileControls) {
      this.mobileControls.remove();
    }

    this.mobileControls = null;
    this.bike = null;
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

  // CTRL TOGGLES WHEELIE MODE.
  if (
    event.code === "ControlLeft" &&
    !event.repeat
  ) {
    RideGame.wheelieMode =
      !RideGame.wheelieMode;

    return;
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
    const buttons = card.querySelector(".garage-buttons");

    if (!buttons || buttons.querySelector(".ride-button")) {
      return;
    }

    const title = card.querySelector("h3");

    if (!title) return;

    const bike = getSavedBikes().find(
      item => item.id === Number(card.dataset.bikeId)
    ) || getSavedBikes().find(
      item => item.name === title.textContent
    );

    if (!bike) return;

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
   RESIZE
========================================= */

window.addEventListener("resize", () => {
  RideGame.resizeSparkCanvas();
});


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
