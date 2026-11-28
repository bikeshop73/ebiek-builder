
/* =========================================
   SUPER73 2D RIDING ENGINE
   COMPLETE REWRITE
   MOTOR + WHEEL PHYSICS + WHEELIE MODE
   KEYBOARD + MOBILE CONTROLS
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
  braking: 0.35,

  wheelieMode: false,

  keys: {},
  animation: null,
  lastTime: 0,

  worldOffset: 0,

  rearRotation: 0,
  frontRotation: 0,
  motorRotation: 0,

  frontAirborne: false,
  frontWheelStopped: false,

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

  frontWheelImages: [],
  rearWheelImages: [],
  motorImages: [],

  mobilePointers: new Map(),

  /* =====================================
     START
  ===================================== */

  start(bike) {
    if (!bike) return;

    this.stop();

    this.bike = bike;

    this.speed = 0;
    this.distance = 0;

    this.angle = 0;
    this.angularVelocity = 0;

    this.worldOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;
    this.motorRotation = 0;

    this.frontAirborne = false;
    this.frontWheelStopped = false;

    this.wheelieTime = 0;
    this.wheelieMode = false;

    this.sparks = [];
    this.keys = {};
    this.mobilePointers.clear();

    const stats = getPerformanceStats(bike.parts || {});

    this.maxSpeed = Number(stats.topSpeed) || 0;

    if (this.maxSpeed <= 0) {
      alert(
        "This bike cannot move! Install a compatible battery, motor and controller."
      );

      this.bike = null;
      return;
    }

    const selectedTires = bike.parts?.tires;

    this.hasTires =
      Array.isArray(selectedTires) &&
      selectedTires.length >= 2;

    this.tireSpeedMultiplier = this.hasTires ? 1 : 0.28;

    const screen = document.getElementById("ride-screen");

    if (!screen) {
      console.error("Ride screen missing.");
      return;
    }

    this.container = document.getElementById(
      "ride-bike-container"
    );

    this.ground = document.getElementById("ride-ground");

    if (!this.container || !this.ground) {
      console.error("Ride elements missing.");
      return;
    }

    screen.classList.add("active");

    document.getElementById("ride-bike-name").textContent =
      bike.name;

    this.renderBike();
    this.createSparkCanvas();
    this.createMobileControls();

    this.active = true;

    this.startAudio();

    this.lastTime = performance.now();

    document.body.style.overflow = "hidden";

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

    canvas.style.width = "100%";
    canvas.style.maxWidth = "none";

    const images = canvas.querySelectorAll("img");

    this.frontWheelImages = [];
    this.rearWheelImages = [];
    this.motorImages = [];

    const tireImages = [];

    images.forEach(img => {
      if (img.alt === "frontWheel") {
        this.frontWheelImages.push(img);
      }

      if (img.alt === "rearWheel") {
        this.rearWheelImages.push(img);
      }

      if (img.alt === "tires") {
        tireImages.push(img);
      }

      if (img.alt === "motor") {
        this.motorImages.push(img);
      }
    });

    // Tire layers are rendered rear first, then front.
    if (tireImages.length >= 2) {
      this.rearWheelImages.push(tireImages[0]);
      this.frontWheelImages.push(tireImages[1]);
    } else if (tireImages.length === 1) {
      this.rearWheelImages.push(tireImages[0]);
    }

    [
      ...this.frontWheelImages,
      ...this.rearWheelImages,
      ...this.motorImages
    ].forEach(img => {
      img.style.transformOrigin = "center center";
    });

    // Rotate around the rear wheel center.
    this.container.style.transformOrigin = "17.5% 65.5%";
  },

  /* =====================================
     MAIN LOOP
  ===================================== */

  loop() {
    if (!this.active) return;

    this.animation = requestAnimationFrame(() => {
      this.loop();
    });

    const now = performance.now();

    const dt = Math.min(
      (now - this.lastTime) / 16.67,
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

    const gas = keys.KeyD || keys.gas;
    const brake = keys.KeyA || keys.brake;

    // ACCELERATION
    if (gas) {
      this.speed += this.acceleration * dt;
    }

    // BRAKING
    if (brake) {
      this.speed -= this.braking * dt;

      // Braking pushes the front wheel down.
      this.angularVelocity += 0.11 * dt;

      if (this.angle < 0) {
        this.angularVelocity += 0.12 * dt;
      }

      this.wheelieMode = false;
    }

    // FRICTION
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

    // WHEELIE MODE
    if (this.wheelieMode && gas && this.speed > 2) {
      this.angularVelocity -= 0.13 * dt;
    }

    // BALANCE LEFT
    if (keys.ArrowLeft || keys.balanceLeft) {
      this.angularVelocity -= 0.045 * dt;
    }

    // BALANCE RIGHT
    if (keys.ArrowRight || keys.balanceRight) {
      this.angularVelocity += 0.045 * dt;
    }

    // GRAVITY
    if (this.angle < 0) {
      this.angularVelocity += 0.0035 * dt;
    }

    // AIR RESISTANCE
    this.angularVelocity *= Math.pow(0.985, dt);

    // ANGLE
    this.angle += this.angularVelocity * dt;

    // WHEELIE LIMIT
    if (this.angle < -110) {
      this.restart();
      return;
    }

    // PREVENT FALLING TOO FAR BACKWARD
    this.angle = Math.max(-110, this.angle);

    // FRONT WHEEL AIRBORNE
    this.frontAirborne = this.angle < -5;

    if (this.frontAirborne) {
      this.wheelieTime += dt * 16.67;
    } else {
      this.wheelieTime = 0;
    }

    // FRONT WHEEL RETURNS TO GROUND
    if (!this.frontAirborne && !this.wheelieMode) {
      this.angle *= Math.pow(0.97, dt);

      if (Math.abs(this.angle) < 0.15) {
        this.angle = 0;
        this.angularVelocity = 0;
      }
    }

    // BRAKING HELPS LOWER FRONT
    if (brake && this.angle < 0) {
      this.angle += Math.min(
        Math.abs(this.angle),
        0.12 * dt
      );
    }

    // WHEEL ROTATION
    // Ground scroll distance determines wheel rotation.
    const movement = this.speed * dt * 2;

    const wheelRadius = 75;

    const wheelSpin =
      (movement / wheelRadius) * (180 / Math.PI);

    // REAR WHEEL
    this.rearRotation += wheelSpin;

    // MOTOR
    this.motorRotation += wheelSpin;

    // FRONT WHEEL
    if (!this.frontAirborne) {
      this.frontRotation = this.rearRotation;
      this.frontWheelStopped = false;
    } else {
      // Gradually freewheel to a stop.
      if (!this.frontWheelStopped) {
        this.frontRotation +=
          wheelSpin * 0.25 * dt;

        this.frontRotation *= Math.pow(0.985, dt);

        if (
          Math.abs(this.frontRotation) <
          0.1
        ) {
          this.frontWheelStopped = true;
        }
      }
    }

    // DISTANCE
    this.distance += movement / 60;

    // BACKGROUND MOVEMENT
    this.worldOffset += movement;

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

    // BIKE ROTATION AROUND REAR WHEEL
    this.container.style.transform =
      `rotate(${this.angle}deg)`;

    // MOVING WORLD
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

    // MOTOR ROTATION
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
        Math.round(Math.abs(this.angle)) + "°";
    }

    const modeButton = document.querySelector(
      '[data-control="wheelieToggle"]'
    );

    if (modeButton) {
      modeButton.textContent = this.wheelieMode
        ? "WHEELIE ON"
        : "WHEELIE OFF";

      modeButton.classList.toggle(
        "pressed",
        this.wheelieMode
      );
    }
  },

  /* =====================================
     SPARKS
  ===================================== */

  createSparkCanvas() {
    const world = document.getElementById("ride-world");

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

    const ratio = window.devicePixelRatio || 1;

    this.sparkCanvas.width = rect.width * ratio;
    this.sparkCanvas.height = rect.height * ratio;

    this.sparkContext.setTransform(
      ratio, 0, 0, ratio, 0, 0
    );
  },

  createSparks(dt) {
    if (!this.sparkCanvas) return;

    const rect = this.sparkCanvas.getBoundingClientRect();

    if (Math.random() < 0.65) {
      this.sparks.push({
        x: rect.width * 0.25,
        y: rect.height * 0.77,
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

    const rect = this.sparkCanvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

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
      const AudioClass =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioClass) return;

      if (!this.audioContext) {
        this.audioContext = new AudioClass();
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

      screen.appendChild(controls);
    }

    controls.innerHTML = "";

    const buttons = [
      ["brake", "BRAKE"],
      ["gas", "GAS"],
      ["balanceLeft", "◀"],
      ["balanceRight", "▶"],
      ["wheelieToggle", "WHEELIE OFF"]
    ];

    buttons.forEach(([key, label]) => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = label;
      button.dataset.control = key;

      button.addEventListener("pointerdown", event => {
        event.preventDefault();

        if (key === "wheelieToggle") {
          this.wheelieMode = !this.wheelieMode;
          this.updateHUD();
          return;
        }

        this.keys[key] = true;

        this.mobilePointers.set(
          event.pointerId,
          key
        );

        try {
          button.setPointerCapture(event.pointerId);
        } catch (error) {
          console.warn("Pointer capture unavailable.");
        }

        button.classList.add("pressed");
      });

      const release = event => {
        const control = this.mobilePointers.get(
          event.pointerId
        );

        if (!control) return;

        this.keys[control] = false;

        this.mobilePointers.delete(
          event.pointerId
        );

        button.classList.remove("pressed");
      };

      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);

      controls.appendChild(button);
    });

    this.updateHUD();
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
    this.motorRotation = 0;

    this.frontAirborne = false;
    this.frontWheelStopped = false;

    this.wheelieTime = 0;
    this.wheelieMode = false;

    this.sparks = [];
    this.keys = {};
    this.mobilePointers.clear();

    this.stopScrapeSound();

    this.draw();
    this.updateHUD();
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
    this.mobilePointers.clear();

    this.stopScrapeSound();

    const screen = document.getElementById("ride-screen");

    if (screen) {
      screen.classList.remove("active");
    }

    document.body.style.overflow = "";

    const controls = document.getElementById(
      "mobile-ride-controls"
    );

    if (controls) controls.innerHTML = "";

    this.bike = null;
    this.container = null;
    this.ground = null;
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

  // CTRL TOGGLES WHEELIE MODE
  if (
    event.code === "ControlLeft" &&
    !event.repeat
  ) {
    RideGame.wheelieMode = !RideGame.wheelieMode;
    RideGame.updateHUD();
    return;
  }

  // RESTART
  if (event.code === "KeyR" && !event.repeat) {
    RideGame.restart();
    return;
  }

  // EXIT
  if (event.code === "Escape" && !event.repeat) {
    exitRide();
    return;
  }

  RideGame.keys[event.code] = true;
});

window.addEventListener("keyup", event => {
  RideGame.keys[event.code] = false;
});

window.addEventListener("blur", () => {
  RideGame.keys = {};
  RideGame.mobilePointers.clear();
});


/* =========================================
   GARAGE RIDE BUTTONS
========================================= */

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

    button.onclick = () => {
      const latestBike = getSavedBikes().find(
        item => item.id === bike.id
      );

      if (latestBike) {
        RideGame.start(latestBike);
      }
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

  if (window.rideGarageObserver) {
    window.rideGarageObserver.disconnect();
  }

  window.rideGarageObserver = new MutationObserver(() => {
    addRideButtons();
  });

  window.rideGarageObserver.observe(garage, {
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
  if (RideGame.active) {
    RideGame.resizeSparkCanvas();
  }
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
