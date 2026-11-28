
/* =========================================
   SUPER73 2D RIDING ENGINE
   COMPLETE REWRITE
   PHYSICS + WHEELIES + MOVING WORLD
========================================= */

const RideGame = {
  active: false,
  bike: null,

  speed: 0,
  maxSpeed: 0,
  distance: 0,

  // Negative angles are wheelies.
  angle: 0,
  angularVelocity: 0,

  maxWheelieAngle: -110,

  wheelieMode: false,
  frontWheelStopped: false,
  wheelieTime: 0,

  rearRotation: 0,
  frontRotation: 0,
  motorRotation: 0,

  hasTires: true,
  tireSpeedMultiplier: 1,

  acceleration: 24,
  braking: 65,
  friction: 5,

  worldOffset: 0,

  keys: {},
  animation: null,
  lastTime: 0,

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
  motorImages: [],

  scenery: null,

  start(bike) {
    if (!bike) return;

    this.stop();

    this.bike = bike;

    const stats = getPerformanceStats(bike.parts || {});

    this.maxSpeed = Number(stats.topSpeed) || 0;

    // Required components.
    if (
      this.maxSpeed <= 0 ||
      !bike.parts?.motor ||
      !bike.parts?.controller ||
      !bike.parts?.battery
    ) {
      alert("This bike cannot move. It needs a battery, motor and controller.");
      return;
    }

    this.speed = 0;
    this.distance = 0;
    this.angle = 0;
    this.angularVelocity = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;
    this.motorRotation = 0;

    this.wheelieMode = false;
    this.frontWheelStopped = false;
    this.wheelieTime = 0;

    this.worldOffset = 0;
    this.sparks = [];
    this.keys = {};

    this.hasTires =
      Array.isArray(bike.parts.tires)
        ? bike.parts.tires.length > 0
        : !!bike.parts.tires;

    this.tireSpeedMultiplier = this.hasTires ? 1 : 0.28;

    this.world = document.getElementById("ride-world");
    this.container = document.getElementById("ride-bike-container");
    this.ground = document.getElementById("ride-ground");

    if (!this.world || !this.container || !this.ground) {
      console.error("Missing ride elements.");
      return;
    }

    document.getElementById("ride-screen").classList.add("active");
    document.getElementById("ride-bike-name").textContent = bike.name;

    this.renderBike();
    this.createScenery();
    this.createSparkCanvas();
    this.createMobileControls();
    this.startAudio();

    this.active = true;

    document.body.style.overflow = "hidden";

    this.lastTime = 0;
    this.animation = requestAnimationFrame(t => this.loop(t));

    this.updateHUD();
  },

  stop() {
    this.active = false;

    if (this.animation !== null) {
      cancelAnimationFrame(this.animation);
    }

    this.animation = null;
    this.keys = {};

    this.stopScrapeSound();

    const screen = document.getElementById("ride-screen");
    if (screen) screen.classList.remove("active");

    document.body.style.overflow = "";

    const controls = document.getElementById("mobile-ride-controls");
    if (controls) controls.remove();

    if (this.scenery) this.scenery.remove();

    this.scenery = null;
    this.bike = null;
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

    canvas.style.width = "100%";
    canvas.style.maxWidth = "none";

    this.frontWheelImages = [
      ...canvas.querySelectorAll(
        '[data-category="frontWheel"], [data-category="tires"][data-position="front"]'
      )
    ];

    this.rearWheelImages = [
      ...canvas.querySelectorAll(
        '[data-category="rearWheel"], [data-category="tires"][data-position="rear"]'
      )
    ];

    this.motorImages = [
      ...canvas.querySelectorAll('[data-category="motor"]')
    ];

    // Each spinning part gets its own transform origin.
    this.frontWheelImages.forEach(img => {
      img.style.transformOrigin = "50% 50%";
    });

    this.rearWheelImages.forEach(img => {
      img.style.transformOrigin = "50% 50%";
    });

    this.motorImages.forEach(img => {
      img.style.transformOrigin = "50% 65%";
    });

    // Rotation is around the rear wheel center.
    this.container.style.transformOrigin = "17.5% 65%";
  },

  createScenery() {
    if (this.scenery) this.scenery.remove();

    const scenery = document.createElement("div");
    scenery.id = "ride-scenery";

    Object.assign(scenery.style, {
      position: "absolute",
      inset: "0",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "0"
    });

    // Sky.
    scenery.style.background =
      "linear-gradient(#68a4d6 0%, #c0dbea 65%, #e1e5dc 100%)";

    // Distant hills.
    const hills = document.createElement("div");

    Object.assign(hills.style, {
      position: "absolute",
      bottom: "28%",
      width: "300%",
      height: "35%",
      background:
        "linear-gradient(150deg, transparent 20%, #587c64 20% 40%, transparent 40%)," +
        "linear-gradient(30deg, transparent 30%, #78916b 30% 55%, transparent 55%)",
      backgroundSize: "500px 100%, 650px 100%",
      opacity: "0.8"
    });

    hills.className = "ride-moving-hills";

    // Stunt park.
    const park = document.createElement("div");

    Object.assign(park.style, {
      position: "absolute",
      bottom: "28%",
      width: "300%",
      height: "28%",
      background:
        "repeating-linear-gradient(90deg, transparent 0 130px, #343d36 130px 145px, transparent 145px 260px)",
      opacity: "0.45"
    });

    park.className = "ride-moving-park";

    scenery.append(hills, park);

    this.world.insertBefore(scenery, this.ground);

    this.scenery = scenery;
  },

  loop(timestamp) {
    if (!this.active) return;

    if (!this.lastTime) this.lastTime = timestamp;

    // Delta time in seconds.
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);

    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    this.animation = requestAnimationFrame(t => this.loop(t));
  },

  update(dt) {
    const keys = this.keys;

    const gas = keys["KeyD"] || keys.gas;
    const brake = keys["KeyA"] || keys.brake;

    // SPEED.
    if (gas) {
      this.speed += this.acceleration * dt;
    }

    if (brake) {
      this.speed -= this.braking * dt;
    }

    if (!gas && !brake) {
      this.speed -= this.friction * dt;
    }

    const actualMaxSpeed =
      this.maxSpeed * this.tireSpeedMultiplier;

    this.speed = Math.max(0, Math.min(actualMaxSpeed, this.speed));

    // WHEELIE MODE.
    // CTRL toggles the mode instead of directly lifting.
    if (keys.toggleWheelie) {
      this.wheelieMode = !this.wheelieMode;
      keys.toggleWheelie = false;
    }

    // D lifts the front while wheelie mode is active.
    if (this.wheelieMode && gas && this.speed > 2) {
      this.angularVelocity -= 85 * dt;
    }

    // Braking pushes the front wheel down.
    if (brake) {
      this.angularVelocity += 115 * dt;
    }

    // Balance.
    if (keys["ArrowLeft"] || keys.balanceLeft) {
      this.angularVelocity -= 45 * dt;
    }

    if (keys["ArrowRight"] || keys.balanceRight) {
      this.angularVelocity += 45 * dt;
    }

    // Natural angle correction.
    // Slower return than the previous version.
    if (!gas && !brake && !this.wheelieMode) {
      this.angularVelocity +=
        (0 - this.angle) * 0.9 * dt;
    }

    // Angular damping.
    this.angularVelocity *= Math.pow(0.985, dt * 60);

    this.angle += this.angularVelocity * dt;

    // Never allow positive angles.
    this.angle = Math.min(0, this.angle);

    // Maximum wheelie angle.
    if (this.angle < this.maxWheelieAngle) {
      this.restart();
      return;
    }

    // FRONT WHEEL AIR TIME.
    const frontInAir = this.angle < -5 && this.speed > 2;

    if (frontInAir) {
      this.wheelieTime += dt;
    } else {
      this.wheelieTime = 0;
    }

    // WHEEL ROTATION.
    // Rotation is calculated from distance travelled.
    // This synchronizes the wheels with the world.
    const pixelsPerMile = 120;
    const pixelsPerFoot = pixelsPerMile / 5280;

    const travelFeet = this.speed * 1.46667 * dt;
    const travelPixels = travelFeet * pixelsPerFoot;

    this.distance += travelFeet;
    this.worldOffset += travelPixels;

    // Wheel circumference in the bike canvas coordinate system.
    const wheelCircumference = 2 * Math.PI * 95;

    const rotationDegrees =
      (travelPixels / wheelCircumference) * 360;

    this.rearRotation -= rotationDegrees;

    // Front wheel gradually slows when airborne.
    if (frontInAir) {
      const slowdown = Math.pow(0.97, dt * 60);
      this.frontRotation *= slowdown;
    } else {
      this.frontRotation -= rotationDegrees;
    }

    // Motor rotation.
    this.motorRotation -= rotationDegrees;

    // SPARKS AND SOUND.
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

    // Rear-wheel-centered rotation.
    this.container.style.transform =
      `rotate(${this.angle}deg)`;

    // Moving ground.
    this.ground.style.transform =
      `translateX(-${this.worldOffset % 1200}px)`;

    // Moving stunt park scenery.
    if (this.scenery) {
      const hills = this.scenery.querySelector(".ride-moving-hills");
      const park = this.scenery.querySelector(".ride-moving-park");

      if (hills) {
        hills.style.transform =
          `translateX(-${this.worldOffset * 0.2 % 1000}px)`;
      }

      if (park) {
        park.style.transform =
          `translateX(-${this.worldOffset * 0.55 % 1000}px)`;
      }
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

    // Motor.
    this.motorImages.forEach(img => {
      img.style.transform =
        `rotate(${this.motorRotation}deg)`;
    });

    this.drawSparks();
  },

  updateHUD() {
    const speed = document.getElementById("ride-speed");
    const distance = document.getElementById("ride-distance");
    const angle = document.getElementById("ride-angle");

    if (speed) speed.textContent =
      Math.round(this.speed) + " MPH";

    if (distance) distance.textContent =
      Math.round(this.distance) + " FT";

    if (angle) angle.textContent =
      Math.round(this.angle) + "°";
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

    const rect = this.world.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.sparkCanvas.width = rect.width * dpr;
    this.sparkCanvas.height = rect.height * dpr;

    this.sparkContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  createSparks(dt) {
    if (!this.sparkCanvas) return;

    const width = this.world.clientWidth;
    const height = this.world.clientHeight;

    if (Math.random() < 0.8) {
      this.sparks.push({
        x: width * 0.30,
        y: height * 0.79,
        vx: -Math.random() * 180,
        vy: -Math.random() * 160,
        life: 0.6 + Math.random() * 0.4,
        size: 2 + Math.random() * 3
      });
    }

    this.sparks.forEach(spark => {
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;

      spark.vy += 400 * dt;
      spark.life -= dt * 1.8;
    });

    this.sparks = this.sparks.filter(s => s.life > 0);
  },

  drawSparks() {
    if (!this.sparkContext) return;

    const ctx = this.sparkContext;

    ctx.clearRect(
      0, 0,
      this.world.clientWidth,
      this.world.clientHeight
    );

    this.sparks.forEach(spark => {
      ctx.globalAlpha = spark.life;
      ctx.fillStyle = Math.random() > 0.5 ? "#ffb000" : "#ff5b00";

      ctx.fillRect(
        spark.x,
        spark.y,
        spark.size,
        spark.size
      );
    });

    ctx.globalAlpha = 1;
  },

  startAudio() {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
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
      ["toggleWheelie", "WHEELIE"]
    ];

    buttons.forEach(([key, label]) => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = label;
      button.dataset.control = key;

      if (key === "toggleWheelie") {
        button.addEventListener("click", event => {
          event.preventDefault();
          this.keys.toggleWheelie = true;
        });
      } else {
        const press = event => {
          event.preventDefault();
          this.keys[key] = true;
          button.classList.add("pressed");
        };

        const release = event => {
          event.preventDefault();
          this.keys[key] = false;
          button.classList.remove("pressed");
        };

        button.addEventListener("pointerdown", press);
        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
        button.addEventListener("lostpointercapture", release);
      }

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

    this.rearRotation = 0;
    this.frontRotation = 0;
    this.motorRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;
    this.wheelieMode = false;

    this.sparks = [];
    this.keys = {};

    this.stopScrapeSound();

    this.draw();
    this.updateHUD();
  }
};

/* =========================================
   KEYBOARD CONTROLS
========================================= */

window.addEventListener("keydown", event => {
  if (!RideGame.active) return;

  const controlled = [
    "KeyD", "KeyA",
    "ControlLeft", "ControlRight",
    "ArrowLeft", "ArrowRight",
    "KeyR", "Escape"
  ];

  if (controlled.includes(event.code)) {
    event.preventDefault();
  }

  // CTRL toggles wheelie mode once.
  if (
    (event.code === "ControlLeft" ||
     event.code === "ControlRight") &&
    !event.repeat
  ) {
    RideGame.keys.toggleWheelie = true;
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

function initializeRideSystem() {
  // Garage ride buttons are created in script.js.
  console.log("SUPER73 riding engine ready.");
}

function exitRide() {
  RideGame.stop();
}

function restartRide() {
  RideGame.restart();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeRideSystem,
    { once: true }
  );
} else {
  initializeRideSystem();
}
