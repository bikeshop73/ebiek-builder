
/* =========================================
   SUPER73 ZX SE BUILDER
   COMPLETE SCRIPT
   BRAKES + CHAIN
========================================= */

/* =========================================
   PARTS DATABASE
========================================= */

const parts = {
  frame: [
    "IMG_5964.PNG", "IMG_5965.PNG", "IMG_5966.PNG",
    "IMG_5967.PNG", "IMG_5968.PNG", "IMG_5969.PNG",
    "IMG_5970.PNG", "IMG_5971.PNG", "IMG_5972.PNG",
    "IMG_5973.PNG", "IMG_5974.PNG", "IMG_5987.PNG"
  ],

  frontForks: [
    "IMG_5975.PNG", "IMG_5976.PNG", "IMG_5977.PNG",
    "IMG_5998.PNG", "IMG_5999.PNG", "IMG_5997.PNG",
    "IMG_6001.PNG", "IMG_5900.PNG"
  ],

  frontWheel: [
    "19B17299-2D11-4064-B836-D6700F3D255F.png",
    "IMG_5979.PNG"
  ],

  rearWheel: [
    "19B17299-2D11-4064-B836-D6700F3D255F.png",
    "IMG_5979.PNG"
  ],

  tires: [
    "644CD654-01BF-4AB7-A3F6-2FCABBD36835.png",
    "IMG_5978.PNG",
    "IMG_5986.PNG"
  ],

  motor: ["IMG_5959.PNG", "IMG_5993.PNG"],

  handlebars: [
    "IMG_5980.PNG", "IMG_5981.PNG",
    "IMG_5982.PNG", "IMG_5983.PNG"
  ],

  seat: [
    "IMG_6004.PNG", "IMG_6005.PNG", "IMG_6006.PNG",
    "IMG_6007.PNG", "IMG_6008.PNG", "IMG_6009.PNG",
    "IMG_6010.PNG", "IMG_6011.PNG", "IMG_6012.PNG",
    "IMG_6013.PNG", "IMG_6014.PNG", "IMG_6015.PNG",
    "IMG_6016.PNG", "IMG_6017.PNG", "IMG_6018.PNG",
    "IMG_6019.PNG", "IMG_6020.PNG", "IMG_6021.PNG",
    "IMG_6022.PNG", "IMG_6023.PNG"
  ],

  battery: [
    "IMG_5984.PNG",
    "IMG_5985.PNG",
    "IMG_5988.PNG",
    "IMG_7000.PNG"
  ],

  fenders: [
    "IMG_5989.PNG", "IMG_5990.PNG", "IMG_5991.PNG"
  ],

  lights: ["IMG_5992.PNG"],

  accessories: [
    "IMG_6030.PNG", "IMG_6031.PNG", "IMG_6032.PNG",
    "IMG_6033.PNG", "IMG_6034.PNG"
  ],

  brakes: [
    "IMG_6057.PNG",
    "IMG_6058.PNG",
    "IMG_6060.PNG"
  ],

  chain: [
    "IMG_6061.PNG"
  ],

  controller: [
    "Stock",
    "BAC855",
    "BAC2000",
    "FarDriver"
  ]
};


/* =========================================
   IMAGE FOLDERS
========================================= */

const folders = {
  frame: "Frames",
  frontForks: "Forks",
  frontWheel: "Front Wheels",
  rearWheel: "Front Wheels",
  tires: "Tires",
  motor: "Hub Motors",
  handlebars: "Handlebars",
  seat: "Seats",
  battery: "Batteries",
  fenders: "Fenders",
  lights: "Lights",
  accessories: "Accessories",
  brakes: "Brakes",
  chain: "Chain"
};


/* =========================================
   OPTION NAMES
========================================= */

const optionNames = {
  frame: [
    "White", "Red", "Orange", "Yellow", "Lime",
    "Green", "Blue", "Purple", "Black",
    "Cyan/White", "White/Pink", "Unlabeled Frame 12"
  ],

  frontForks: [
    "Silver Inverted",
    "Inverted",
    "Gold Inverted",
    "Silver Triple Clamp Normal",
    "Silver Triple Clamp + Silver Bottom",
    "Black Normal",
    "Silver Bottom Normal",
    "Bucklos"
  ],

  frontWheel: ["Black", "Chrome"],
  rearWheel: ["Black", "Chrome"],

  tires: [
    "LZRD Tires",
    "White Wall LZRD Tires",
    "SuperSucker Tires"
  ],

  motor: ["1350W", "4,000W"],

  handlebars: [
    "Stock",
    "Mountain Bike Bars",
    "Harley Riser",
    "ProTaper"
  ],

  seat: [
    "White", "Black", "Red", "Orange", "Yellow",
    "Lime", "Green", "Blue", "Purple", "Brown",
    "Pink", "Cyan", "Red/Black", "Orange/Black",
    "Yellow/Black", "Lime/Black", "Blue/Black",
    "Cyan/Black", "Purple/Black", "Pink/Black"
  ],

  battery: [
    "60V Surron LBX Battery",
    "Stock Battery",
    "81V Chi Battery",
    "60V Handleworks Battery"
  ],

  fenders: [
    "White Plate + Fender",
    "Black Plate + Fender",
    "Motocutz Plate"
  ],

  lights: ["Baja"],

  accessories: [
    "Pedals",
    "Rear Moto Pegs Silver",
    "Silver Peg Swap",
    "Rear Moto Pegs Black",
    "Black Peg Swap"
  ],

  brakes: [
    "Stock Tektro",
    "UB Brakes",
    "Magura Brakes"
  ],

  chain: ["Chain"],

  controller: [
    "Stock",
    "BAC855",
    "BAC2000",
    "FarDriver"
  ]
};


/* =========================================
   PERFORMANCE DATABASE
   FORMAT: [TOP SPEED, WATTAGE]
========================================= */

const performanceDatabase = {
  "Surron|1350W": {
    Stock: [20, 1680],
    BAC855: [45, 3500],
    BAC2000: [43, 2200],
    FarDriver: [43, 2200]
  },

  "Stock|1350W": {
    Stock: [20, 1350],
    BAC855: [40, 2000],
    BAC2000: [36, 1900],
    FarDriver: [36, 1900]
  },

  "Chi|1350W": {
    Stock: [20, 2310],
    BAC855: [60, 6500],
    BAC2000: [58, 8000],
    FarDriver: [58, 8000]
  },

  "Handleworks|1350W": {
    Stock: [20, 1680],
    BAC855: [45, 3500],
    BAC2000: [43, 2200],
    FarDriver: [43, 2200]
  },

  "Surron|4000W": {
    Stock: [20, 1680],
    BAC855: [50, 4800],
    BAC2000: [52, 6600],
    FarDriver: [52, 6600]
  },

  "Stock|4000W": {
    Stock: [20, 1350],
    BAC855: [35, 2000],
    BAC2000: [33, 1900],
    FarDriver: [36, 1900]
  },

  "Chi|4000W": {
    Stock: [20, 2310],
    BAC855: [65, 8300],
    BAC2000: [68, 16000],
    FarDriver: [68, 12000]
  },

  "Handleworks|4000W": {
    Stock: [20, 1680],
    BAC855: [50, 4800],
    BAC2000: [52, 5400],
    FarDriver: [52, 6600]
  }
};


/* =========================================
   CURRENT BUILD
========================================= */

let selectedParts = {};

let selectedColors = {
  hue: 0,
  saturation: 100,
  brightness: 100
};

let editingBikeId = null;

const allowedAccessoryPairs = [
  [0, 1], [0, 3], [1, 2],
  [1, 4], [3, 4], [2, 3]
];


/* =========================================
   BIKE IMAGE LAYERS
========================================= */

const layers = [
  { category: "brakes" },
  { category: "battery" },
  { category: "tires", position: "rear" },
  { category: "tires", position: "front" },
  { category: "rearWheel" },
  { category: "frontWheel" },
  { category: "motor" },
  { category: "chain" },
  { category: "frontForks" },
  { category: "fenders" },
  { category: "lights" },
  { category: "handlebars" },
  { category: "seat" },
  { category: "frame" },
  { category: "accessories" }
];


/* =========================================
   PERFORMANCE CALCULATOR
========================================= */

function getPerformanceStats(partsToCheck) {
  const zeroStats = {
    topSpeed: 0,
    wattage: 0
  };

  if (!partsToCheck) return zeroStats;

  const batterySelection = partsToCheck.battery;

  if (
    !Array.isArray(batterySelection) ||
    batterySelection.length !== 1
  ) {
    return zeroStats;
  }

  const motorFilename = partsToCheck.motor;
  const controller = partsToCheck.controller;

  if (!motorFilename || !controller) {
    return zeroStats;
  }

  const batteryNames = {
    "IMG_5984.PNG": "Surron",
    "IMG_5985.PNG": "Stock",
    "IMG_5988.PNG": "Chi",
    "IMG_7000.PNG": "Handleworks"
  };

  const motorNames = {
    "IMG_5959.PNG": "1350W",
    "IMG_5993.PNG": "4000W"
  };

  const batteryName = batteryNames[batterySelection[0]];
  const motorName = motorNames[motorFilename];

  if (!batteryName || !motorName) {
    return zeroStats;
  }

  const combination =
    performanceDatabase[batteryName + "|" + motorName];

  if (!combination || !combination[controller]) {
    return zeroStats;
  }

  const result = combination[controller];

  return {
    topSpeed: result[0],
    wattage: result[1]
  };
}


/* =========================================
   IMAGE PATH
========================================= */

function imagePath(category, filename) {
  if (!folders[category]) {
    console.error("Missing image folder:", category);
    return "";
  }

  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}


/* =========================================
   FRAME COLOR PROCESSING
========================================= */

function getFrameFilter(colors) {
  const hue = Number(colors?.hue ?? 0);
  const saturation = Number(colors?.saturation ?? 100);
  const brightness = Number(colors?.brightness ?? 100);

  return `
    hue-rotate(${hue}deg)
    saturate(${saturation}%)
    brightness(${brightness}%)
  `.trim();
}


/* =========================================
   PART POSITIONING
========================================= */

function getLayerPosition(category, position) {
  const positions = {
    frontForks: {
      left: "42%",
      top: "7%",
      width: "58%",
      height: "78%"
    },

    frontWheel: {
      left: "70%",
      top: "53%",
      width: "27%",
      height: "27%"
    },

    rearWheel: {
      left: "4%",
      top: "52%",
      width: "27%",
      height: "27%"
    },

    rearTire: {
      left: "1%",
      top: "48%",
      width: "34%",
      height: "34%"
    },

    frontTire: {
      left: "66.5%",
      top: "49%",
      width: "34%",
      height: "34%"
    },

    motor: {
      left: "5.5%",
      top: "52.5%",
      width: "24%",
      height: "24%"
    },

    handlebars: {
      left: "53.5%",
      top: "13%",
      width: "24%",
      height: "24%"
    },
     
    brakes: {
      left: "-5%",
      top: "-5%",
      width: "105%",
      height: "105%"
    },

    fenders: {
      left: "57.5%",
      top: "22%",
      width: "29%",
      height: "29%"
    },

    lights: {
      left: "64%",
      top: "27%",
      width: "10%",
      height: "10%"
    }
  };

  if (category === "tires") {
    return position === "rear"
      ? positions.rearTire
      : positions.frontTire;
  }

  return positions[category] || {
    left: "0%",
    top: "0%",
    width: "100%",
    height: "100%"
  };
}


/* =========================================
   CREATE BIKE CANVAS
========================================= */

function createBikeCanvas(
  parent,
  partsToShow,
  colorsToShow,
  thumbnail = false
) {
  const canvas = document.createElement("div");

  canvas.className = thumbnail
    ? "bike-canvas bike-thumbnail"
    : "bike-canvas";

  Object.assign(canvas.style, {
    position: "relative",
    width: "100%",
    maxWidth: thumbnail ? "260px" : "700px",
    aspectRatio: "1 / 1",
    margin: "auto",
    isolation: "isolate",
    overflow: "hidden"
  });

  layers.forEach((layer, layerIndex) => {
    const category = layer.category;
    const selected = partsToShow[category];

    if (!selected) return;

    const filenames = Array.isArray(selected)
      ? selected
      : [selected];

    filenames.forEach(filename => {
      const source = imagePath(category, filename);

      if (!source) return;

      const position = getLayerPosition(
        category,
        layer.position
      );

      const image = document.createElement("img");

      image.src = source;
      image.alt = category;
      image.draggable = false;

      Object.assign(image.style, {
        position: "absolute",
        left: position.left,
        top: position.top,
        width: position.width,
        height: position.height,
        objectFit: "contain",
        zIndex: String(layerIndex + 1),
        pointerEvents: "none",
        maxWidth: "none"
      });

      if (category === "frame") {
        image.style.filter = getFrameFilter(colorsToShow);
      }

      image.onerror = () => {
        console.error("Image failed:", source);
      };

      canvas.appendChild(image);
    });
  });

  parent.appendChild(canvas);

  return canvas;
}


/* =========================================
   MAIN PREVIEW
========================================= */

function updatePreview() {
  const preview = document.getElementById("bike-preview");

  if (!preview) return;

  preview.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "SUPER73 ZX SE";

  preview.appendChild(title);

  const holder = document.createElement("div");
  holder.className = "preview-canvas-holder";

  preview.appendChild(holder);

  createBikeCanvas(
    holder,
    selectedParts,
    selectedColors
  );
}


/* =========================================
   FRAME SLIDERS
========================================= */

function changeFrameAdjustment() {
  const hue = document.getElementById("frame-hue");
  const saturation = document.getElementById("frame-saturation");
  const brightness = document.getElementById("frame-brightness");

  if (!hue || !saturation || !brightness) return;

  selectedColors.hue = Number(hue.value);
  selectedColors.saturation = Number(saturation.value);
  selectedColors.brightness = Number(brightness.value);

  updatePreview();
}

function resetFrameAdjustments() {
  selectedColors = {
    hue: 0,
    saturation: 100,
    brightness: 100
  };

  resetSliderDisplay();
  updatePreview();
}

function resetSliderDisplay() {
  const hue = document.getElementById("frame-hue");
  const saturation = document.getElementById("frame-saturation");
  const brightness = document.getElementById("frame-brightness");

  if (hue) hue.value = selectedColors.hue;
  if (saturation) saturation.value = selectedColors.saturation;
  if (brightness) brightness.value = selectedColors.brightness;
}


/* =========================================
   CONTROLLER CATEGORY BUTTON
========================================= */

function addControllerButton() {
  const categories = document.querySelector(".categories");

  if (!categories) {
    console.error("Could not find .categories container.");
    return;
  }

  if (categories.querySelector('[data-category="controller"]')) {
    return;
  }

  const button = document.createElement("button");

  button.type = "button";
  button.textContent = "Controller";
  button.dataset.category = "controller";

  button.addEventListener("click", () => {
    selectCategory("controller");
  });

  categories.appendChild(button);
}


/* =========================================
   CATEGORY SELECTION
========================================= */

function selectCategory(category) {
  const container = document.getElementById("parts-list");

  if (!container || !parts[category]) return;

  container.innerHTML = "";

  const headingNames = {
    fenders: "Fenders + Plates",
    frontForks: "Front Forks",
    controller: "Controller",
    brakes: "Brakes",
    chain: "Chain"
  };

  const heading = document.createElement("h3");

  heading.textContent =
    headingNames[category] ||
    category.replace(/([A-Z])/g, " $1");

  container.appendChild(heading);

  const options = document.createElement("div");
  options.className = "part-options";

  parts[category].forEach((filename, index) => {
    const option = document.createElement("button");

    option.type = "button";
    option.className = "part-option";

    if (category !== "controller") {
      const image = document.createElement("img");

      image.src = imagePath(category, filename);
      image.alt = optionNames[category]?.[index] || filename;

      image.onerror = () => {
        console.error("Thumbnail failed:", image.src);
      };

      option.appendChild(image);
    }

    const name = document.createElement("span");

    name.textContent =
      optionNames[category]?.[index] ||
      `Unlabeled Option ${index + 1}`;

    option.appendChild(name);

    const current = selectedParts[category];

    const isSelected = Array.isArray(current)
      ? current.includes(filename)
      : current === filename;

    if (isSelected) {
      option.classList.add("selected");
    }

    option.onclick = () => {
      selectPart(category, filename, index);
    };

    options.appendChild(option);
  });

  container.appendChild(options);
}


/* =========================================
   SELECT PART
========================================= */

function selectPart(category, filename, index) {

  // Controller: single selection.
  if (category === "controller") {
    if (selectedParts.controller === filename) {
      delete selectedParts.controller;
    } else {
      selectedParts.controller = filename;
    }

    updatePreview();
    selectCategory(category);
    updateEditingStatus();

    return;
  }

  // Batteries and accessories: up to two selections.
  if (category === "battery" || category === "accessories") {
    let current = selectedParts[category] || [];

    if (!Array.isArray(current)) {
      current = [current];
    }

    if (current.includes(filename)) {
      current = current.filter(item => item !== filename);

    } else {
      if (current.length >= 2) {
        alert("You can only select two.");
        return;
      }

      if (current.length === 1) {
        const firstIndex = parts[category].indexOf(current[0]);

        if (category === "battery") {
          if (Math.abs(firstIndex - index) !== 1) {
            alert("Choose two batteries next to each other.");
            return;
          }

        } else {
          const allowed = allowedAccessoryPairs.some(pair =>
            pair.includes(firstIndex) && pair.includes(index)
          );

          if (!allowed) {
            alert("Those accessories cannot be combined.");
            return;
          }
        }
      }

      current.push(filename);
    }

    if (current.length) {
      selectedParts[category] = current;
    } else {
      delete selectedParts[category];
    }

  } else {
    // Brakes, chain, wheels, frame, etc.: single selection.
    if (selectedParts[category] === filename) {
      delete selectedParts[category];
    } else {
      selectedParts[category] = filename;
    }
  }

  updatePreview();
  selectCategory(category);
  updateEditingStatus();
}


/* =========================================
   GARAGE STORAGE
========================================= */

function getSavedBikes() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("savedBikes") || "[]"
    );

    return Array.isArray(saved) ? saved : [];

  } catch (error) {
    console.error("Could not load bikes:", error);
    return [];
  }
}

function storeSavedBikes(bikes) {
  try {
    localStorage.setItem(
      "savedBikes",
      JSON.stringify(bikes)
    );

    return true;

  } catch (error) {
    console.error("Could not save bikes:", error);

    alert("Could not save. Browser storage may be full.");

    return false;
  }
}


/* =========================================
   CREATE SAVED BIKE DATA
========================================= */

function createBikeData(name) {
  const performance = getPerformanceStats(selectedParts);

  return {
    id: Date.now(),
    name: name,

    parts: JSON.parse(JSON.stringify(selectedParts)),

    colors: { ...selectedColors },

    performance: {
      topSpeed: performance.topSpeed,
      wattage: performance.wattage
    }
  };
}


/* =========================================
   SAVE BIKE
========================================= */

function saveBike() {
  const savedBikes = getSavedBikes();

  if (editingBikeId !== null) {
    const bike = savedBikes.find(
      item => item.id === editingBikeId
    );

    if (bike) {
      bike.parts = JSON.parse(
        JSON.stringify(selectedParts)
      );

      bike.colors = { ...selectedColors };
      bike.performance = getPerformanceStats(selectedParts);

      if (!storeSavedBikes(savedBikes)) return;

      showSavedBikes();
      updateEditingStatus();

      alert("Your changes have been saved!");

      return;
    }
  }

  const name = prompt("What do you want to name your bike?");

  if (!name || !name.trim()) return;

  const newBike = createBikeData(name.trim());

  savedBikes.push(newBike);

  if (!storeSavedBikes(savedBikes)) return;

  editingBikeId = newBike.id;

  updateEditingStatus();
  showSavedBikes();

  alert("Bike saved!");
}


/* =========================================
   SAVE AS NEW
========================================= */

function saveBikeAsNew() {
  const name = prompt("Name your new bike:");

  if (!name || !name.trim()) return;

  const savedBikes = getSavedBikes();

  const newBike = createBikeData(name.trim());

  savedBikes.push(newBike);

  if (!storeSavedBikes(savedBikes)) return;

  editingBikeId = newBike.id;

  updateEditingStatus();
  showSavedBikes();

  alert("New bike saved!");
}


/* =========================================
   LOAD BIKE
========================================= */

function loadBike(id) {
  const bike = getSavedBikes().find(
    item => item.id === id
  );

  if (!bike) return;

  selectedParts = JSON.parse(
    JSON.stringify(bike.parts || {})
  );

  selectedColors = {
    hue: bike.colors?.hue ?? 0,
    saturation: bike.colors?.saturation ?? 100,
    brightness: bike.colors?.brightness ?? 100
  };

  editingBikeId = bike.id;

  resetSliderDisplay();
  updatePreview();
  updateEditingStatus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  alert("Bike loaded! You can now edit it.");
}


/* =========================================
   RENAME BIKE
========================================= */

function renameBike(id) {
  const savedBikes = getSavedBikes();

  const bike = savedBikes.find(
    item => item.id === id
  );

  if (!bike) return;

  const newName = prompt(
    "Enter a new name:",
    bike.name
  );

  if (!newName || !newName.trim()) return;

  bike.name = newName.trim();

  if (!storeSavedBikes(savedBikes)) return;

  showSavedBikes();
  updateEditingStatus();
}


/* =========================================
   DELETE BIKE
========================================= */

function deleteBike(id) {
  if (!confirm("Are you sure you want to delete this bike?")) {
    return;
  }

  const savedBikes = getSavedBikes().filter(
    bike => bike.id !== id
  );

  if (!storeSavedBikes(savedBikes)) return;

  if (editingBikeId === id) {
    editingBikeId = null;
    updateEditingStatus();
  }

  showSavedBikes();
}


/* =========================================
   MY GARAGE
========================================= */

function showSavedBikes() {
  const container = document.getElementById("saved-bikes");

  if (!container) return;

  container.innerHTML = "";

  const savedBikes = getSavedBikes();

  if (!savedBikes.length) {
    const empty = document.createElement("p");

    empty.textContent =
      "Your garage is empty. Save a bike to get started.";

    container.appendChild(empty);

    return;
  }

  const batteryLabels = {
    "IMG_5984.PNG": "60V Surron LBX Battery",
    "IMG_5985.PNG": "Stock Battery",
    "IMG_5988.PNG": "81V Chi Battery",
    "IMG_7000.PNG": "60V Handleworks Battery"
  };

  const motorLabels = {
    "IMG_5959.PNG": "1350W",
    "IMG_5993.PNG": "4,000W"
  };

  const brakeLabels = {
    "IMG_6057.PNG": "Stock Tektro",
    "IMG_6058.PNG": "UB Brakes",
    "IMG_6060.PNG": "Magura Brakes"
  };

  savedBikes.forEach(bike => {
    const card = document.createElement("div");
    card.className = "garage-card";

    const title = document.createElement("h3");
    title.textContent = bike.name;

    const preview = document.createElement("div");
    preview.className = "garage-bike-preview";

    createBikeCanvas(
      preview,
      bike.parts || {},
      bike.colors || {
        hue: 0,
        saturation: 100,
        brightness: 100
      },
      true
    );

    const stats = getPerformanceStats(bike.parts || {});

    bike.performance = stats;

    // PERFORMANCE DISPLAY.
    const performance = document.createElement("div");
    performance.className = "bike-performance";

    Object.assign(performance.style, {
      display: "flex",
      justifyContent: "center",
      gap: "24px",
      flexWrap: "wrap",
      margin: "12px 0",
      padding: "12px",
      borderRadius: "10px",
      background: "#202020",
      color: "white",
      textAlign: "center"
    });

    const speed = document.createElement("div");
    const speedLabel = document.createElement("div");

    speedLabel.textContent = "TOP SPEED";
    speedLabel.style.fontSize = "11px";
    speedLabel.style.opacity = "0.7";

    const speedValue = document.createElement("strong");
    speedValue.textContent = stats.topSpeed + " MPH";
    speedValue.style.fontSize = "20px";

    speed.append(speedLabel, speedValue);

    const power = document.createElement("div");
    const powerLabel = document.createElement("div");

    powerLabel.textContent = "WATTAGE";
    powerLabel.style.fontSize = "11px";
    powerLabel.style.opacity = "0.7";

    const powerValue = document.createElement("strong");

    powerValue.textContent =
      stats.wattage.toLocaleString() + "W";

    powerValue.style.fontSize = "20px";

    power.append(powerLabel, powerValue);

    performance.append(speed, power);

    // COMPONENT INFORMATION.
    const components = document.createElement("div");
    components.className = "bike-components";

    const componentNames = document.createElement("p");

    const batterySelection = bike.parts?.battery;

    const batteryText = Array.isArray(batterySelection)
      ? batterySelection
          .map(item => batteryLabels[item] || item)
          .join(" + ")
      : "None";

    const motorText =
      motorLabels[bike.parts?.motor] || "None";

    const controllerText =
      bike.parts?.controller || "None";

    const brakeText =
      brakeLabels[bike.parts?.brakes] || "None";

    const chainText =
      bike.parts?.chain ? "Chain" : "None";

    componentNames.textContent =
      "Battery: " + batteryText +
      " | Motor: " + motorText +
      " | Controller: " + controllerText +
      " | Brakes: " + brakeText +
      " | Chain: " + chainText;

    components.appendChild(componentNames);

    // GARAGE BUTTONS.
    const buttons = document.createElement("div");
    buttons.className = "garage-buttons";

    const loadButton = document.createElement("button");
    loadButton.textContent = "Load / Edit";
    loadButton.onclick = () => loadBike(bike.id);

    const renameButton = document.createElement("button");
    renameButton.textContent = "Rename";
    renameButton.onclick = () => renameBike(bike.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.onclick = () => deleteBike(bike.id);

    buttons.append(
      loadButton,
      renameButton,
      deleteButton
    );

    card.append(
      title,
      preview,
      performance,
      components,
      buttons
    );

    container.appendChild(card);
  });

  storeSavedBikes(savedBikes);
}


/* =========================================
   EDITING STATUS
========================================= */

function updateEditingStatus() {
  const status = document.getElementById("editing-status");

  if (!status) return;

  if (editingBikeId === null) {
    status.textContent =
      "Not currently editing a saved bike.";

    return;
  }

  const bike = getSavedBikes().find(
    item => item.id === editingBikeId
  );

  status.textContent = bike
    ? "Editing: " + bike.name +
      " — Save Bike updates this build."
    : "Not currently editing a saved bike.";
}


/* =========================================
   INITIALIZATION
========================================= */

function initializeBuilder() {
  console.log("Initializing SUPER73 ZX SE Builder...");

  addControllerButton();

  [
    "frame-hue",
    "frame-saturation",
    "frame-brightness"
  ].forEach(id => {
    const slider = document.getElementById(id);

    if (slider) {
      slider.addEventListener(
        "input",
        changeFrameAdjustment
      );
    }
  });

  updatePreview();
  showSavedBikes();
  updateEditingStatus();

  console.log(
    "SUPER73 ZX SE Builder loaded successfully with brakes and chain."
  );
}

// Works whether the script loads before or after the page DOM.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeBuilder,
    { once: true }
  );
} else {
  initializeBuilder();
}
