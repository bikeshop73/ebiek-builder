
/* =========================================
   SUPER73 2D RIDING ENGINE
========================================= */

const RideGame = {
  active: false,
  bike: null,

  speed: 0,
  distance: 0,
  angle: 0,
  angularVelocity: 0,

  acceleration: 0.12,
  maxSpeed: 68,
  braking: 0.25,

  keys: {},
  animation: null,
  lastTime: 0,

  worldOffset: 0,
  popCooldown: 0,

  container: null,
  ground: null,

  start(bike) {
    if (!bike) return;

    this.bike = bike;
    this.active = true;

    this.speed = 0;
    this.distance = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.worldOffset = 0;
    this.popCooldown = 0;

    const screen = document.getElementById("ride-screen");

    screen.classList.add("active");

    document.getElementById("ride-bike-name").textContent =
      bike.name;

    this.container = document.getElementById(
      "ride-bike-container"
    );

    this.ground = document.getElementById("ride-ground");

    this.renderBike();

    this.lastTime = performance.now();

    this.loop();

    document.body.style.overflow = "hidden";
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
  },

  loop() {
    if (!this.active) return;

    this.animation = requestAnimationFrame(() => {
      this.loop();
    });

    const now = performance.now();

    const delta = Math.min(
      (now - this.lastTime) / 16.67,
      2
    );

    this.lastTime = now;

    this.update(delta);
    this.draw();
  },

  update(dt) {
    const keys = this.keys;

    // ACCELERATION
    if (keys["KeyD"]) {
      this.speed += this.acceleration * dt;
    }

    // BRAKING
    if (keys["KeyA"]) {
      this.speed -= this.braking * dt;
    }

    this.speed = Math.max(
      0,
      Math.min(this.maxSpeed, this.speed)
    );

    // POP FRONT WHEEL
    if (this.popCooldown > 0) {
      this.popCooldown -= dt;
    }

    // Wheelie only initiates while moving.
    if (
      keys["ControlLeft"] &&
      this.popCooldown <= 0 &&
      this.speed > 4
    ) {
      this.angularVelocity -= 0.16 * dt;
      this.popCooldown = 12;
    }

    // BALANCE
    if (keys["ArrowLeft"]) {
      this.angularVelocity -= 0.055 * dt;
    }

    if (keys["ArrowRight"]) {
      this.angularVelocity += 0.055 * dt;
    }

    // NATURAL GRAVITY
    this.angularVelocity +=
      (this.angle === 0 ? 0 : 0.006 * Math.sin(this.angle * Math.PI / 180)) * dt;

    // AIR / ANGLE DAMPING
    this.angularVelocity *= Math.pow(0.96, dt);

    this.angle += this.angularVelocity * dt;

    // Keep wheelie angle within playable limits.
    this.angle = Math.max(
      -10,
      Math.min(75, this.angle)
    );

    // If the front comes down, settle toward normal riding.
    if (
      this.angle < 5 &&
      !keys["ControlLeft"] &&
      !keys["ArrowLeft"]
    ) {
      this.angle *= Math.pow(0.92, dt);
    }

    // Movement
    this.distance += this.speed * dt / 60;

    this.worldOffset += this.speed * dt * 2;

    this.updateHUD();
  },

  draw() {
    if (!this.container) return;

    this.container.style.transform =
      `rotate(${this.angle}deg)`;

    this.ground.style.transform =
      `translateX(-${this.worldOffset % 400}px)`;
  },

  updateHUD() {
    document.getElementById("ride-speed").textContent =
      Math.round(this.speed) + " MPH";

    document.getElementById("ride-distance").textContent =
      Math.round(this.distance) + " FT";

    document.getElementById("ride-angle").textContent =
      Math.round(this.angle) + "°";
  },

  restart() {
    if (!this.active) return;

    this.speed = 0;
    this.distance = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.worldOffset = 0;
    this.popCooldown = 0;

    this.keys = {};

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

    document.getElementById("ride-screen")
      .classList.remove("active");

    document.body.style.overflow = "";

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

  if (event.repeat && event.code === "KeyR") return;

  RideGame.keys[event.code] = true;

  if (event.code === "KeyR") {
    RideGame.restart();
  }

  if (event.code === "Escape") {
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
  const cards = document.querySelectorAll(".garage-card");

  cards.forEach(card => {
    if (card.querySelector(".ride-button")) return;

    const title = card.querySelector("h3");

    if (!title) return;

    const bikeName = title.textContent;

    const button = document.createElement("button");

    button.textContent = "▶ RIDE";
    button.className = "ride-button";

    button.onclick = () => {
      const bike = getSavedBikes().find(
        item => item.name === bikeName
      );

      if (bike) {
        RideGame.start(bike);
      }
    };

    const buttons = card.querySelector(".garage-buttons");

    if (buttons) {
      card.insertBefore(button, buttons);
    }
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
