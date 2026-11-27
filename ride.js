
/* =========================================
   SUPER73 2D RIDING ENGINE
   COMPLETE REWRITE
========================================= */

const RideGame = {
  active: false,
  bike: null,

  speed: 0,
  distance: 0,

  angle: 0,
  angularVelocity: 0,

  maxSpeed: 0,

  acceleration: 32,
  braking: 55,

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

  frontWheelImages: [],
  rearWheelImages: [],

  /* =====================================
     START
  ===================================== */

  start(bike) {
    if (!bike || this.active) return;

    const bikeParts = bike.parts || {};

    const stats = getPerformanceStats(bikeParts);

    const required = [
      bikeParts.battery,
      bikeParts.motor,
      bikeParts.controller
    ];

    if (required.some(part=>!part) || stats.topSpeed<=0) {
      alert(
        "This bike cannot move. It needs a battery, motor and controller."
      );
      return;
    }

    this.bike = bike;

    this.speed = 0;
    this.distance = 0;

    this.angle = 0;
    this.angularVelocity = 0;

    this.maxSpeed = stats.topSpeed;

    this.worldOffset = 0;

    this.rearRotation = 0;
    this.frontRotation = 0;

    this.wheelieTime = 0;
    this.frontWheelStopped = false;

    this.sparks = [];
    this.keys = {};

    this.hasTires =
      getArray(bikeParts.tires).length > 0;

    this.tireSpeedMultiplier =
      this.hasTires ? 1 : 0.28;

    const screen = document.getElementById("ride-screen");

    this.container = document.getElementById(
      "ride-bike-container"
    );

    this.ground = document.getElementById("ride-ground");

    if (!screen || !this.container || !this.ground) {
      console.error("Missing riding screen elements.");
      return;
    }

    screen.classList.add("active");
    document.body.classList.add("ride-active");

    document.getElementById("ride-bike-name").textContent =
      bike.name;

    this.renderBike();
    this.createSparkCanvas();

    this.active = true;

    this.startAudio();

    this.lastTime = performance.now();

    this.updateHUD();
    this.draw();

    this.animation = requestAnimationFrame(
      timestamp=>this.loop(timestamp)
    );
  },

  /* =====================================
     RENDER BIKE
  ===================================== */

  renderBike() {
    this.container.innerHTML = "";

    const canvas = createBikeCanvas(
      this.container,
      this.bike.parts || {},
      this.bike.colors || {}
    );

    canvas.style.maxWidth = "none";
    canvas.style.width = "100%";

    this.frontWheelImages = [];
    this.rearWheelImages = [];

    // Actual wheel images.
    canvas.querySelectorAll("img").forEach(img=>{
      const category = img.dataset.category;
      const position = img.dataset.position;

      if (category==="frontWheel") {
        this.frontWheelImages.push(img);
      }

      if (category==="rearWheel") {
        this.rearWheelImages.push(img);
      }

      if (category==="tires") {
        if (position==="front") {
          this.frontWheelImages.push(img);
        }

        if (position==="rear") {
          this.rearWheelImages.push(img);
        }
      }
    });

    this.frontWheelImages.forEach(img=>{
      img.dataset.baseTransform = img.style.transform || "";
      img.style.transformOrigin = "center center";
    });

    this.rearWheelImages.forEach(img=>{
      img.dataset.baseTransform = img.style.transform || "";
      img.style.transformOrigin = "center center";
    });
  },

  /* =====================================
     GAME LOOP
  ===================================== */

  loop(timestamp) {
    if (!this.active) return;

    const elapsed = Math.min(
      (timestamp-this.lastTime)/1000,
      0.05
    );

    this.lastTime = timestamp;

    this.update(elapsed);
    this.draw();

    this.animation = requestAnimationFrame(
      time=>this.loop(time)
    );
  },

  /* =====================================
     PHYSICS
  ===================================== */

  update(dt) {
    if (dt<=0) return;

    const keys = this.keys;

    const gas =
      keys.KeyD || keys.gas;

    const brake =
      keys.KeyA || keys.brake;

    const popping =
      keys.ControlLeft || keys.wheelie;

    /* ACCELERATION */

    if (gas) {
      this.speed += this.acceleration*dt;
    }

    /* BRAKING */

    if (brake) {
      this.speed -= this.braking*dt;
    }

    /* FRICTION */

    if (!gas && !brake) {
      this.speed *= Math.pow(0.985,dt*60);
    }

    /* TOP SPEED */

    const actualMaxSpeed =
      this.maxSpeed*this.tireSpeedMultiplier;

    this.speed = Math.max(
      0,
      Math.min(actualMaxSpeed,this.speed)
    );

    /* WHEELIE */

    if (popping && this.speed>2) {
      this.angularVelocity -= 75*dt;
    }

    /* BALANCE */

    if (keys.ArrowLeft || keys.balanceLeft) {
      this.angularVelocity -= 35*dt;
    }

    if (keys.ArrowRight || keys.balanceRight) {
      this.angularVelocity += 35*dt;
    }

    /* GRAVITY */

    this.angularVelocity +=
      18*Math.sin(this.angle*Math.PI/180)*dt;

    this.angularVelocity *= Math.pow(0.94,dt*60);

    this.angle += this.angularVelocity*dt;

    this.angle = Math.max(
      -10,
      Math.min(75,this.angle)
    );

    /* AIR TIME */

    if (this.angle>8 && this.speed>2) {
      this.wheelieTime += dt*1000;

      if (this.wheelieTime>=25000) {
        this.frontWheelStopped = true;
      }
    } else {
      this.wheelieTime = 0;
      this.frontWheelStopped = false;
    }

    /* FRONT WHEEL DOWN */

    if (
      this.angle<5 &&
      !popping &&
      !keys.ArrowLeft &&
      !keys.balanceLeft
    ) {
      this.angle *= Math.pow(0.92,dt*60);
    }

    /* WHEEL ROTATION */

    // Convert MPH into wheel angular speed.
    // 26-inch wheel circumference is approximately 81.68 inches.

    const wheelRPM =
      (this.speed*1056)/81.68;

    const wheelDegreesPerSecond =
      wheelRPM*6;

    const wheelSpin =
      wheelDegreesPerSecond*dt;

    // Rear wheel always follows ground speed.
    this.rearRotation += wheelSpin;

    // Front wheel stops after 25 seconds in the air.
    if (!this.frontWheelStopped) {
      this.frontRotation += wheelSpin;
    }

    /* DISTANCE */

    this.distance += this.speed*1.46667*dt;

    /* WORLD MOVEMENT */

    this.worldOffset += this.speed*30*dt;

    /* SPARKS */

    if (!this.hasTires && this.speed>0.5) {
      this.createSparks(dt);
      this.updateScrapeSound();
    } else {
      this.sparks = [];
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

    this.ground.style.transform =
      `translateX(-${this.worldOffset%400}px)`;

    this.rotateWheels();

    this.drawSparks();
  },

  rotateWheels() {
    this.rearWheelImages.forEach(img=>{
      const base = img.dataset.baseTransform || "";

      img.style.transform =
        `${base} rotate(${this.rearRotation}deg)`;
    });

    this.frontWheelImages.forEach(img=>{
      const base = img.dataset.baseTransform || "";

      img.style.transform =
        `${base} rotate(${this.frontRotation}deg)`;
    });
  },

  /* =====================================
     HUD
  ===================================== */

  updateHUD() {
    const speed = document.getElementById("ride-speed");
    const distance = document.getElementById("ride-distance");
    const angle = document.getElementById("ride-angle");
    const airtime = document.getElementById("ride-airtime");

    if (speed) {
      speed.textContent = Math.round(this.speed)+" MPH";
    }

    if (distance) {
      distance.textContent = Math.round(this.distance)+" FT";
    }

    if (angle) {
      angle.textContent = Math.round(this.angle)+"°";
    }

    if (airtime) {
      airtime.textContent =
        (this.wheelieTime/1000).toFixed(1)+"s";
    }
  },

  /* =====================================
     SPARK CANVAS
  ===================================== */

  createSparkCanvas() {
    this.sparkCanvas =
      document.getElementById("ride-sparks");

    if (!this.sparkCanvas) return;

    this.sparkContext =
      this.sparkCanvas.getContext("2d");

    this.resizeSparkCanvas();

    window.addEventListener(
      "resize",
      ()=>this.resizeSparkCanvas()
    );
  },

  resizeSparkCanvas() {
    if (!this.sparkCanvas) return;

    const world = document.getElementById("ride-world");

    if (!world) return;

    const rect = world.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio||1,2);

    this.sparkCanvas.width = rect.width*dpr;
    this.sparkCanvas.height = rect.height*dpr;

    this.sparkContext.setTransform(
      dpr,0,0,dpr,0,0
    );
  },

  /* =====================================
     CREATE SPARKS
  ===================================== */

  createSparks(dt) {
    if (!this.sparkCanvas || this.hasTires) return;

    const width = this.sparkCanvas.clientWidth;
    const height = this.sparkCanvas.clientHeight;

    const count = Math.max(
      1,
      Math.floor(dt*90)
    );

    for (let i=0;i<count;i++) {
      if (Math.random()<0.85) {
        this.sparks.push({
          x:width*0.25,
          y:height*0.77,
          vx:-Math.random()*180-40,
          vy:-Math.random()*160-40,
          life:0.4+Math.random()*0.6,
          size:2+Math.random()*3
        });
      }
    }

    this.sparks.forEach(spark=>{
      spark.x+=spark.vx*dt;
      spark.y+=spark.vy*dt;

      spark.vy+=450*dt;

      spark.life-=dt*1.8;
    });

    this.sparks=this.sparks.filter(
      spark=>spark.life>0
    );
  },

  /* =====================================
     DRAW SPARKS
  ===================================== */

  drawSparks() {
    if (!this.sparkContext) return;

    const ctx=this.sparkContext;

    const width=this.sparkCanvas.clientWidth;
    const height=this.sparkCanvas.clientHeight;

    ctx.clearRect(0,0,width,height);

    if (this.hasTires) return;

    this.sparks.forEach(spark=>{
      ctx.globalAlpha=spark.life;

      ctx.fillStyle="#ff9d00";

      ctx.shadowColor="#ff4b00";
      ctx.shadowBlur=10;

      ctx.fillRect(
        spark.x,
        spark.y,
        spark.size,
        spark.size
      );
    });

    ctx.globalAlpha=1;
    ctx.shadowBlur=0;
  },

  /* =====================================
     AUDIO
  ===================================== */

  startAudio() {
    try {
      const AudioClass =
        window.AudioContext||window.webkitAudioContext;

      if (!AudioClass) return;

      if (!this.audioContext) {
        this.audioContext=new AudioClass();
      }

      if (this.audioContext.state==="suspended") {
        this.audioContext.resume();
      }

    } catch(error) {
      console.warn("Audio unavailable:",error);
    }
  },

  updateScrapeSound() {
    if (!this.audioContext || this.hasTires) return;

    if (!this.scrapeOscillator) {
      const oscillator=this.audioContext.createOscillator();
      const gain=this.audioContext.createGain();

      oscillator.type="sawtooth";
      oscillator.frequency.value=85;

      gain.gain.value=0;

      oscillator.connect(gain);
      gain.connect(this.audioContext.destination);

      oscillator.start();

      this.scrapeOscillator=oscillator;
      this.scrapeGain=gain;
    }

    this.scrapeOscillator.frequency.setTargetAtTime(
      85+this.speed*2,
      this.audioContext.currentTime,
      0.05
    );

    this.scrapeGain.gain.setTargetAtTime(
      Math.min(this.speed/100,0.15),
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

  initializeMobileControls() {
    const controls =
      document.getElementById("mobile-ride-controls");

    if (!controls || controls.dataset.initialized) return;

    controls.dataset.initialized="true";

    controls.querySelectorAll("button").forEach(button=>{
      const key=button.dataset.control;

      button.addEventListener("pointerdown",event=>{
        event.preventDefault();

        this.keys[key]=true;

        button.classList.add("pressed");

        button.setPointerCapture(event.pointerId);
      });

      const release=event=>{
        event.preventDefault();

        this.keys[key]=false;

        button.classList.remove("pressed");
      };

      button.addEventListener("pointerup",release);
      button.addEventListener("pointercancel",release);
      button.addEventListener("lostpointercapture",release);
    });
  },

  /* =====================================
     RESTART
  ===================================== */

  restart() {
    if (!this.active) return;

    this.speed=0;
    this.distance=0;

    this.angle=0;
    this.angularVelocity=0;

    this.worldOffset=0;

    this.rearRotation=0;
    this.frontRotation=0;

    this.wheelieTime=0;
    this.frontWheelStopped=false;

    this.sparks=[];
    this.keys={};

    this.stopScrapeSound();

    this.updateHUD();
    this.draw();

    this.lastTime=performance.now();
  },

  /* =====================================
     STOP
  ===================================== */

  stop() {
    this.active=false;

    if (this.animation) {
      cancelAnimationFrame(this.animation);
    }

    this.animation=null;

    this.keys={};

    this.speed=0;

    this.stopScrapeSound();

    const screen=document.getElementById("ride-screen");

    if (screen) {
      screen.classList.remove("active");
    }

    document.body.classList.remove("ride-active");

    this.bike=null;

    this.sparks=[];

    if (this.sparkContext && this.sparkCanvas) {
      this.sparkContext.clearRect(
        0,0,
        this.sparkCanvas.width,
        this.sparkCanvas.height
      );
    }
  }
};

/* =========================================
   KEYBOARD INPUT
========================================= */

window.addEventListener("keydown",event=>{
  if (!RideGame.active) return;

  const allowed=[
    "KeyD","KeyA","ControlLeft",
    "ArrowLeft","ArrowRight","KeyR","Escape"
  ];

  if (allowed.includes(event.code)) {
    event.preventDefault();
  }

  RideGame.keys[event.code]=true;

  if (event.code==="KeyR" && !event.repeat) {
    RideGame.restart();
  }

  if (event.code==="Escape" && !event.repeat) {
    exitRide();
  }
});

window.addEventListener("keyup",event=>{
  RideGame.keys[event.code]=false;
});

window.addEventListener("blur",()=>{
  RideGame.keys={};
});

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
   INITIALIZE
========================================= */

function initializeRideSystem() {
  RideGame.initializeMobileControls();

  console.log("SUPER73 Riding Engine initialized.");
}

if (document.readyState==="loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeRideSystem,
    {once:true}
  );
} else {
  initializeRideSystem();
}
