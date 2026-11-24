
// ============================================
// VEHICLE BUILDER
// E-BIKE + DIRTBIKE + MY GARAGE
// ============================================


// ============================================
// NAVIGATION
// ============================================

document.querySelectorAll(".nav-tab").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;

    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.classList.remove("active");
    });

    document.querySelectorAll(".page").forEach(section => {
      section.classList.remove("active");
    });

    button.classList.add("active");

    document.getElementById(page + "-page").classList.add("active");

    if (page === "garage") {
      showSavedBikes();
    }
  });
});


// ============================================
// E-BIKE PARTS DATABASE
// ============================================

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
    "IMG_5984.PNG", "IMG_5985.PNG",
    "IMG_5988.PNG", "IMG_7000.PNG"
  ],

  fenders: [
    "IMG_5989.PNG", "IMG_5990.PNG", "IMG_5991.PNG"
  ],

  lights: ["IMG_5992.PNG"],

  accessories: [
    "IMG_6030.PNG", "IMG_6031.PNG", "IMG_6032.PNG",
    "IMG_6033.PNG", "IMG_6034.PNG"
  ],

  brakes: ["IMG_6057.PNG", "IMG_6058.PNG", "IMG_6060.PNG"],

  chain: ["IMG_6061.PNG"],

  controller: ["Stock", "BAC855", "BAC2000", "FarDriver"]
};


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


const optionNames = {
  frame: [
    "White", "Red", "Orange", "Yellow", "Lime",
    "Green", "Blue", "Purple", "Black",
    "Cyan/White", "White/Pink", "Unlabeled Frame 12"
  ],

  frontForks: [
    "Silver Inverted", "Inverted", "Gold Inverted",
    "Silver Triple Clamp Normal",
    "Silver Triple Clamp + Silver Bottom",
    "Black Normal", "Silver Bottom Normal", "Bucklos"
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
    "Stock", "Mountain Bike Bars", "Harley Riser", "ProTaper"
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

  brakes: ["Stock Tektro", "UB Brakes", "Magura Brakes"],
  chain: ["Chain"],

  controller: ["Stock", "BAC855", "BAC2000", "FarDriver"]
};


// ============================================
// E-BIKE PERFORMANCE DATABASE
// ============================================

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


// ============================================
// E-BIKE CURRENT BUILD
// ============================================

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


// ============================================
// E-BIKE IMAGE LAYERS
// ============================================

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


// ============================================
// E-BIKE PERFORMANCE
// ============================================

function getPerformanceStats(partsToCheck) {
  const zeroStats = { topSpeed: 0, wattage: 0 };

  if (!partsToCheck) return zeroStats;

  const batterySelection = partsToCheck.battery;

  if (!Array.isArray(batterySelection) ||
      batterySelection.length !== 1) {
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
  const motorName = motorNames[partsToCheck.motor];
  const controller = partsToCheck.controller;

  if (!batteryName || !motorName || !controller) {
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


// ============================================
// IMAGE PATH
// ============================================

function imagePath(category, filename) {
  if (!folders[category]) return "";

  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}


// ============================================
// FRAME COLOR FILTER
// ============================================

function getFrameFilter(colors) {
  return `
    hue-rotate(${Number(colors?.hue ?? 0)}deg)
    saturate(${Number(colors?.saturation ?? 100)}%)
    brightness(${Number(colors?.brightness ?? 100)}%)
  `.trim();
}


// ============================================
// E-BIKE IMAGE POSITIONS
// ============================================

function getLayerPosition(category, position) {
  const positions = {
    frontForks: {
      left: "42%", top: "7%", width: "58%", height: "78%"
    },

    frontWheel: {
      left: "70%", top: "53%", width: "27%", height: "27%"
    },

    rearWheel: {
      left: "4%", top: "52%", width: "27%", height: "27%"
    },

    rearTire: {
      left: "1%", top: "48%", width: "34%", height: "34%"
    },

    frontTire: {
      left: "66.5%", top: "49%", width: "34%", height: "34%"
    },

    motor: {
      left: "5.5%", top: "52.5%", width: "24%", height: "24%"
    },

    handlebars: {
      left: "53.5%", top: "13%", width: "24%", height: "24%"
    },

    brakes: {
      left: "-2%", top: "-2%", width: "105%", height: "105%"
    },

    fenders: {
      left: "57.5%", top: "22%", width: "29%", height: "29%"
    },

    lights: {
      left: "64%", top: "27%", width: "10%", height: "10%"
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


// ============================================
// CREATE E-BIKE CANVAS
// ============================================

function createBikeCanvas(parent, partsToShow, colorsToShow, thumbnail = false) {
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
    const selected = partsToShow[layer.category];

    if (!selected) return;

    const filenames = Array.isArray(selected)
      ? selected
      : [selected];

    filenames.forEach(filename => {
      const source = imagePath(layer.category, filename);
      if (!source) return;

      const position = getLayerPosition(
        layer.category,
        layer.position
      );

      const image = document.createElement("img");

      image.src = source;
      image.alt = layer.category;
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

      if (layer.category === "frame") {
        image.style.filter = getFrameFilter(colorsToShow);
      }

      if (layer.category === "brakes") {
        image.style.transform = "rotate(2deg)";
      }

      image.onerror = () => console.error("Image failed:", source);

      canvas.appendChild(image);
    });
  });

  parent.appendChild(canvas);
  return canvas;
}


// ============================================
// E-BIKE PREVIEW
// ============================================

function updatePreview() {
  const preview = document.getElementById("bike-preview");
  if (!preview) return;

  preview.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "SUPER73 ZX SE";

  const holder = document.createElement("div");
  holder.className = "preview-canvas-holder";

  preview.append(title, holder);

  createBikeCanvas(holder, selectedParts, selectedColors);
}


// ============================================
// FRAME SLIDERS
// ============================================

function changeFrameAdjustment() {
  const hue = document.getElementById("frame-hue");
  const saturation = document.getElementById("frame-saturation");
  const brightness = document.getElementById("frame-brightness");

  if (!hue || !saturation || !brightness) return;

  selectedColors = {
    hue: Number(hue.value),
    saturation: Number(saturation.value),
    brightness: Number(brightness.value)
  };

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

function resetFrameAdjustments() {
  selectedColors = {
    hue: 0,
    saturation: 100,
    brightness: 100
  };

  resetSliderDisplay();
  updatePreview();
}


// ============================================
// CONTROLLER BUTTON
// ============================================

function addControllerButton() {
  const categories = document.querySelector(".categories");
  if (!categories) return;

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


// ============================================
// CATEGORY SELECTION
// ============================================

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
  heading.textContent = headingNames[category] ||
    category.replace(/([A-Z])/g, " $1");

  const options = document.createElement("div");
  options.className = "part-options";

  container.appendChild(heading);
  container.appendChild(options);

  parts[category].forEach((filename, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "part-option";

    if (category !== "controller") {
      const image = document.createElement("img");
      image.src = imagePath(category, filename);
      image.alt = optionNames[category]?.[index] || filename;
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

    if (isSelected) option.classList.add("selected");

    option.onclick = () => selectPart(category, filename, index);

    options.appendChild(option);
  });
}


// ============================================
// SELECT E-BIKE PART
// ============================================

function selectPart(category, filename, index) {
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

  if (category === "battery" || category === "accessories") {
    let current = selectedParts[category] || [];

    if (!Array.isArray(current)) current = [current];

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


// ============================================
// DIRTBIKE BUILDER
// ============================================

let dirtbikeBuild = {
  model: "Yamaha YZ250X",
  engine: "Yamaha 250 2-Stroke",
  color: "Blue"
};

let editingDirtbikeId = null;

const dirtbikeModels = [
  "Yamaha YZ250X",
  "Yamaha YZ250F",
  "Yamaha YZ450F",
  "Honda CR250R",
  "Honda CRF250R",
  "Honda CRF450R"
];

const dirtbikeEngines = [
  "Yamaha 250 2-Stroke",
  "Yamaha 250 4-Stroke",
  "Yamaha 450 4-Stroke",
  "Honda 250 2-Stroke",
  "Honda 250 4-Stroke",
  "Honda 450 4-Stroke"
];

function selectDirtbike(model) {
  if (!dirtbikeModels.includes(model)) return;

  dirtbikeBuild.model = model;
  updateDirtbikePreview();
  updateDirtbikeStatus();
}

function selectDirtbikeEngine(engine) {
  if (!dirtbikeEngines.includes(engine)) return;

  dirtbikeBuild.engine = engine;
  updateDirtbikePreview();
  updateDirtbikeStatus();
}

function selectDirtbikeColor(color) {
  dirtbikeBuild.color = color;
  updateDirtbikePreview();
  updateDirtbikeStatus();
}

function updateDirtbikePreview() {
  const preview = document.getElementById("dirtbike-preview");
  if (!preview) return;

  preview.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = dirtbikeBuild.model;

  const details = document.createElement("div");
  details.className = "dirtbike-details";

  details.innerHTML = `
    <p><strong>Engine:</strong> ${escapeHTML(dirtbikeBuild.engine)}</p>
    <p><strong>Color:</strong> ${escapeHTML(dirtbikeBuild.color)}</p>
  `;

  const note = document.createElement("p");
  note.textContent =
    "Dirt bike image layers can be added when your model images are ready.";

  note.style.marginTop = "18px";
  note.style.color = "#888";

  preview.append(title, details, note);

  const engineDisplay = document.getElementById("selected-engine");
  const colorDisplay = document.getElementById("selected-color");

  if (engineDisplay) {
    engineDisplay.textContent = "Selected engine: " + dirtbikeBuild.engine;
  }

  if (colorDisplay) {
    colorDisplay.textContent = "Selected color: " + dirtbikeBuild.color;
  }
}

function updateDirtbikeStatus() {
  const status = document.getElementById("dirtbike-editing-status");
  if (!status) return;

  const bike = getSavedBikes().find(item =>
    item.id === editingDirtbikeId && item.type === "dirtbike"
  );

  status.textContent = bike
    ? "Editing: " + bike.name + " — Save Dirtbike updates this build."
    : "Not currently editing a saved dirt bike.";
}


// ============================================
// SHARED GARAGE STORAGE
// ============================================

function getSavedBikes() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("savedBikes") || "[]"
    );

    return Array.isArray(saved)
      ? saved.map(bike => ({
          ...bike,
          type: bike.type || "ebike"
        }))
      : [];
  } catch (error) {
    console.error("Could not load garage:", error);
    return [];
  }
}

function storeSavedBikes(bikes) {
  try {
    localStorage.setItem("savedBikes", JSON.stringify(bikes));
    return true;
  } catch (error) {
    console.error("Could not save garage:", error);
    alert("Could not save. Browser storage may be full.");
    return false;
  }
}


// ============================================
// E-BIKE SAVING
// ============================================

function createBikeData(name) {
  return {
    id: Date.now(),
    type: "ebike",
    name,
    parts: JSON.parse(JSON.stringify(selectedParts)),
    colors: { ...selectedColors },
    performance: getPerformanceStats(selectedParts)
  };
}

function saveBike() {
  const saved = getSavedBikes();

  if (editingBikeId !== null) {
    const bike = saved.find(item =>
      item.id === editingBikeId && item.type === "ebike"
    );

    if (bike) {
      bike.parts = JSON.parse(JSON.stringify(selectedParts));
      bike.colors = { ...selectedColors };
      bike.performance = getPerformanceStats(selectedParts);

      if (!storeSavedBikes(saved)) return;

      showSavedBikes();
      updateEditingStatus();
      alert("Your e-bike changes have been saved!");
      return;
    }
  }

  const name = prompt("What do you want to name your e-bike?");
  if (!name || !name.trim()) return;

  const bike = createBikeData(name.trim());
  saved.push(bike);

  if (!storeSavedBikes(saved)) return;

  editingBikeId = bike.id;
  updateEditingStatus();
  showSavedBikes();
  alert("E-bike saved!");
}

function saveBikeAsNew() {
  const name = prompt("Name your new e-bike:");
  if (!name || !name.trim()) return;

  const saved = getSavedBikes();
  const bike = createBikeData(name.trim());

  saved.push(bike);

  if (!storeSavedBikes(saved)) return;

  editingBikeId = bike.id;
  updateEditingStatus();
  showSavedBikes();
  alert("New e-bike saved!");
}


// ============================================
// DIRTBIKE SAVING
// ============================================

function createDirtbikeData(name) {
  return {
    id: Date.now(),
    type: "dirtbike",
    name,
    dirtbike: { ...dirtbikeBuild }
  };
}

function saveDirtbike() {
  const saved = getSavedBikes();

  if (editingDirtbikeId !== null) {
    const bike = saved.find(item =>
      item.id === editingDirtbikeId && item.type === "dirtbike"
    );

    if (bike) {
      bike.dirtbike = { ...dirtbikeBuild };

      if (!storeSavedBikes(saved)) return;

      showSavedBikes();
      updateDirtbikeStatus();
      alert("Your dirt bike changes have been saved!");
      return;
    }
  }

  const name = prompt("What do you want to name your dirt bike?");
  if (!name || !name.trim()) return;

  const bike = createDirtbikeData(name.trim());
  saved.push(bike);

  if (!storeSavedBikes(saved)) return;

  editingDirtbikeId = bike.id;
  updateDirtbikeStatus();
  showSavedBikes();
  alert("Dirt bike saved!");
}

function saveDirtbikeAsNew() {
  const name = prompt("Name your new dirt bike:");
  if (!name || !name.trim()) return;

  const saved = getSavedBikes();
  const bike = createDirtbikeData(name.trim());

  saved.push(bike);

  if (!storeSavedBikes(saved)) return;

  editingDirtbikeId = bike.id;
  updateDirtbikeStatus();
  showSavedBikes();
  alert("New dirt bike saved!");
}


// ============================================
// GARAGE FILTER
// ============================================

let garageFilter = "all";

function showGarageType(type) {
  garageFilter = type;
  showSavedBikes();
}


// ============================================
// SAFE TEXT
// ============================================

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}


// ============================================
// LOAD E-BIKE
// ============================================

function loadBike(id) {
  const bike = getSavedBikes().find(item =>
    item.id === id && item.type === "ebike"
  );

  if (!bike) return;

  selectedParts = JSON.parse(JSON.stringify(bike.parts || {}));

  selectedColors = {
    hue: bike.colors?.hue ?? 0,
    saturation: bike.colors?.saturation ?? 100,
    brightness: bike.colors?.brightness ?? 100
  };

  editingBikeId = bike.id;

  switchPage("ebike");

  resetSliderDisplay();
  updatePreview();
  updateEditingStatus();

  window.scrollTo({ top: 0, behavior: "smooth" });
}


// ============================================
// LOAD DIRTBIKE
// ============================================

function loadDirtbike(id) {
  const bike = getSavedBikes().find(item =>
    item.id === id && item.type === "dirtbike"
  );

  if (!bike) return;

  dirtbikeBuild = {
    model: bike.dirtbike?.model || "Yamaha YZ250X",
    engine: bike.dirtbike?.engine || "Yamaha 250 2-Stroke",
    color: bike.dirtbike?.color || "Blue"
  };

  editingDirtbikeId = bike.id;

  switchPage("dirtbike");
  updateDirtbikePreview();
  updateDirtbikeStatus();

  window.scrollTo({ top: 0, behavior: "smooth" });
}


// ============================================
// SWITCH PAGE
// ============================================

function switchPage(page) {
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.page === page);
  });

  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === page + "-page");
  });
}


// ============================================
// RENAME BIKE
// ============================================

function renameBike(id) {
  const saved = getSavedBikes();
  const bike = saved.find(item => item.id === id);

  if (!bike) return;

  const newName = prompt("Enter a new name:", bike.name);

  if (!newName || !newName.trim()) return;

  bike.name = newName.trim();

  if (!storeSavedBikes(saved)) return;

  showSavedBikes();
}


// ============================================
// DELETE BIKE
// ============================================

function deleteBike(id) {
  if (!confirm("Are you sure you want to delete this bike?")) {
    return;
  }

  const saved = getSavedBikes().filter(item => item.id !== id);

  if (!storeSavedBikes(saved)) return;

  if (editingBikeId === id) {
    editingBikeId = null;
    updateEditingStatus();
  }

  if (editingDirtbikeId === id) {
    editingDirtbikeId = null;
    updateDirtbikeStatus();
  }

  showSavedBikes();
}


// ============================================
// DISPLAY GARAGE
// ============================================

function showSavedBikes() {
  const container = document.getElementById("saved-bikes");
  if (!container) return;

  container.innerHTML = "";

  const saved = getSavedBikes();

  const visible = saved.filter(bike =>
    garageFilter === "all" || bike.type === garageFilter
  );

  if (!visible.length) {
    const empty = document.createElement("p");

    empty.textContent = garageFilter === "all"
      ? "Your garage is empty. Save a bike to get started."
      : "No bikes in this category yet.";

    container.appendChild(empty);
    return;
  }

  visible.forEach(bike => {
    const card = document.createElement("div");
    card.className = "garage-card";

    const title = document.createElement("h3");
    title.textContent = bike.name;

    const type = document.createElement("div");
    type.className = "bike-type";
    type.textContent = bike.type === "dirtbike" ? "DIRT BIKE" : "E-BIKE";

    const preview = document.createElement("div");
    preview.className = "garage-bike-preview";

    const details = document.createElement("div");

    if (bike.type === "ebike") {
      createBikeCanvas(
        preview,
        bike.parts || {},
        bike.colors || { hue: 0, saturation: 100, brightness: 100 },
        true
      );

      const stats = getPerformanceStats(bike.parts || {});

      const performance = document.createElement("p");
      performance.textContent =
        "Top Speed: " + stats.topSpeed + " MPH | Power: " +
        stats.wattage.toLocaleString() + "W";

      details.appendChild(performance);

      const batteryLabels = {
        "IMG_5984.PNG": "60V Surron LBX",
        "IMG_5985.PNG": "Stock Battery",
        "IMG_5988.PNG": "81V Chi Battery",
        "IMG_7000.PNG": "60V Handleworks"
      };

      const motorLabels = {
        "IMG_5959.PNG": "1350W",
        "IMG_5993.PNG": "4000W"
      };

      const battery = bike.parts?.battery;
      const batteryText = Array.isArray(battery)
        ? battery.map(item => batteryLabels[item] || item).join(" + ")
        : "None";

      const componentInfo = document.createElement("p");
      componentInfo.textContent =
        "Battery: " + batteryText +
        " | Motor: " + (motorLabels[bike.parts?.motor] || "None") +
        " | Controller: " + (bike.parts?.controller || "None");

      details.appendChild(componentInfo);

    } else {
      const model = document.createElement("h2");
      model.textContent = bike.dirtbike?.model || "Dirt Bike";
      model.style.textAlign = "center";
      model.style.padding = "35px 5px";

      preview.appendChild(model);

      const engine = document.createElement("p");
      engine.textContent = "Engine: " +
        (bike.dirtbike?.engine || "Not selected");

      const color = document.createElement("p");
      color.textContent = "Color: " +
        (bike.dirtbike?.color || "Not selected");

      details.append(engine, color);
    }

    const buttons = document.createElement("div");
    buttons.className = "garage-buttons";

    const load = document.createElement("button");
    load.textContent = "Load / Edit";
    load.onclick = () => {
      if (bike.type === "dirtbike") {
        loadDirtbike(bike.id);
      } else {
        loadBike(bike.id);
      }
    };

    const rename = document.createElement("button");
    rename.textContent = "Rename";
    rename.onclick = () => renameBike(bike.id);

    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.className = "delete-button";
    remove.onclick = () => deleteBike(bike.id);

    buttons.append(load, rename, remove);

    card.append(title, type, preview, details, buttons);
    container.appendChild(card);
  });
}


// ============================================
// INITIALIZATION
// ============================================

function initializeBuilder() {
  console.log("Vehicle Builder loading...");

  addControllerButton();

  [
    "frame-hue",
    "frame-saturation",
    "frame-brightness"
  ].forEach(id => {
    const slider = document.getElementById(id);

    if (slider) {
      slider.addEventListener("input", changeFrameAdjustment);
    }
  });

  updatePreview();
  updateDirtbikePreview();
  showSavedBikes();
  updateEditingStatus();
  updateDirtbikeStatus();

  console.log("Vehicle Builder loaded successfully!");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBuilder, {
    once: true
  });
} else {
  initializeBuilder();
}
