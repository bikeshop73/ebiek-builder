
/* =============================================
   SUPER73 ZX SE BIKE BUILDER
   COMPLETE SCRIPT - PIXEL COLOR VERSION
============================================= */

// =============================================
// PART IMAGES
// =============================================

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
    "IMG_6004.PNG", "IMG_6005.PNG",
    "IMG_6006.PNG", "IMG_6007.PNG",
    "IMG_6008.PNG", "IMG_6009.PNG",
    "IMG_6010.PNG", "IMG_6011.PNG",
    "IMG_6012.PNG", "IMG_6013.PNG",
    "IMG_6014.PNG", "IMG_6015.PNG",
    "IMG_6016.PNG", "IMG_6017.PNG",
    "IMG_6018.PNG", "IMG_6019.PNG",
    "IMG_6020.PNG", "IMG_6021.PNG",
    "IMG_6022.PNG", "IMG_6023.PNG"
  ],

  battery: [
    "IMG_5984.PNG",
    "IMG_5985.PNG",
    "IMG_5988.PNG"
  ],

  fenders: [
    "IMG_5989.PNG",
    "IMG_5990.PNG",
    "IMG_5991.PNG"
  ],

  lights: ["IMG_5992.PNG"],

  accessories: [
    "IMG_6030.PNG",
    "IMG_6031.PNG",
    "IMG_6032.PNG",
    "IMG_6033.PNG",
    "IMG_6034.PNG"
  ]
};


// =============================================
// IMAGE FOLDERS
// =============================================

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
  accessories: "Accessories"
};


// =============================================
// CURRENT BUILD
// =============================================

let selectedParts = {};

let selectedColors = {
  frame: {
    hue: 0,
    saturation: 100,
    brightness: 100
  }
};

let editingBikeId = null;

const allowedAccessoryPairs = [
  [0, 1],
  [0, 3],
  [1, 2],
  [1, 4],
  [3, 4],
  [2, 3]
];


// =============================================
// LAYER ORDER
// =============================================

const layers = [
  { category: "tires", position: "rear" },
  { category: "tires", position: "front" },
  { category: "rearWheel" },
  { category: "frontWheel" },
  { category: "motor" },
  { category: "frontForks" },
  { category: "fenders" },
  { category: "lights" },
  { category: "handlebars" },
  { category: "seat" },
  { category: "frame" },
  { category: "battery" },
  { category: "accessories" }
];


// =============================================
// IMAGE PATH
// =============================================

function imagePath(category, filename) {
  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}


// =============================================
// PART POSITIONING
// =============================================

function getLayerPosition(category, position) {

  const positions = {
    frontForks: {
      left: "42%", top: "7%",
      width: "58%", height: "78%"
    },

    frontWheel: {
      left: "70%", top: "53%",
      width: "27%", height: "27%"
    },

    rearWheel: {
      left: "4%", top: "52%",
      width: "27%", height: "27%"
    },

    rearTire: {
      left: "1%", top: "48%",
      width: "34%", height: "34%"
    },

    frontTire: {
      left: "66.5%", top: "49%",
      width: "34%", height: "34%"
    },

    motor: {
      left: "5.5%", top: "52.5%",
      width: "24%", height: "24%"
    },

    handlebars: {
      left: "53.5%", top: "13%",
      width: "24%", height: "24%"
    },

    fenders: {
      left: "57.5%", top: "22%",
      width: "29%", height: "29%"
    },

    lights: {
      left: "64%", top: "27%",
      width: "10%", height: "10%"
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


// =============================================
// HSL COLOR CONVERSION
// =============================================

function rgbToHsl(r, g, b) {

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {

    const d = max - min;

    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}


function hslToRgb(h, s, l) {

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;

      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);

      return p;
    };

    const q = l < 0.5
      ? l * (1 + s)
      : l + s - l * s;

    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}


// =============================================
// FRAME RECOLORING
// ACTUALLY RECOLORS EVERY FRAME PIXEL
// =============================================

const originalImageCache = new Map();
const coloredImageCache = new Map();

function recolorFrame(source, settings, callback) {

  const key = [
    source,
    settings.hue,
    settings.saturation,
    settings.brightness
  ].join("|");

  if (coloredImageCache.has(key)) {
    callback(coloredImageCache.get(key));
    return;
  }

  function processImage(originalImage) {

    const canvas = document.createElement("canvas");

    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true
    });

    ctx.drawImage(originalImage, 0, 0);

    const imageData = ctx.getImageData(
      0, 0, canvas.width, canvas.height
    );

    const pixels = imageData.data;

    const targetHue =
      ((settings.hue % 360) + 360) % 360 / 360;

    const targetSaturation =
      Math.max(0, Math.min(100, settings.saturation)) / 100;

    const brightness =
      Math.max(0, Math.min(200, settings.brightness)) / 100;

    for (let i = 0; i < pixels.length; i += 4) {

      const alpha = pixels[i + 3];

      // Preserve transparent pixels.
      if (alpha === 0) continue;

      const [oldH, oldS, oldL] = rgbToHsl(
        pixels[i],
        pixels[i + 1],
        pixels[i + 2]
      );

      // Preserve original shading and highlights.
      // Replace the original frame color.
      const newL = Math.max(
        0,
        Math.min(1, oldL * brightness)
      );

      const [r, g, b] = hslToRgb(
        targetHue,
        targetSaturation,
        newL
      );

      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);

    const result = canvas.toDataURL("image/png");

    coloredImageCache.set(key, result);

    callback(result);
  }

  if (originalImageCache.has(source)) {
    processImage(originalImageCache.get(source));
    return;
  }

  const image = new Image();

  image.onload = () => {
    originalImageCache.set(source, image);
    processImage(image);
  };

  image.onerror = () => {
    console.error("Frame image failed:", source);
  };

  image.src = source;
}


// =============================================
// FRAME ADJUSTMENT SLIDERS
// =============================================

function changeFrameAdjustment(type, value) {

  value = Number(value);

  if (!Number.isFinite(value)) return;

  if (!["hue", "saturation", "brightness"].includes(type)) {
    return;
  }

  selectedColors.frame[type] = value;

  // Changing sliders clears old rendered color versions.
  coloredImageCache.clear();

  updatePreview();
}


// Support existing inline slider handlers.
window.changeFrameAdjustment = changeFrameAdjustment;


// =============================================
// CREATE BIKE CANVAS
// =============================================

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

      const position = getLayerPosition(
        category,
        layer.position
      );

      const image = document.createElement("img");

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
        pointerEvents: "none"
      });

      function displayImage(src) {
        image.src = src;
      }

      if (category === "frame") {

        recolorFrame(
          source,
          colorsToShow.frame || {
            hue: 0,
            saturation: 100,
            brightness: 100
          },
          displayImage
        );

      } else {
        image.src = source;
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


// =============================================
// UPDATE PREVIEW
// =============================================

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


// =============================================
// SELECT CATEGORY
// =============================================

function selectCategory(category) {

  const container = document.getElementById("parts-list");

  if (!container || !parts[category]) return;

  container.innerHTML = "";

  const heading = document.createElement("h3");

  heading.textContent =
    category === "fenders"
      ? "Fenders + Plates"
      : category.replace(/([A-Z])/g, " $1");

  container.appendChild(heading);

  const options = document.createElement("div");

  options.className = "part-options";

  parts[category].forEach((filename, index) => {

    const option = document.createElement("button");

    option.type = "button";
    option.className = "part-option";

    const image = document.createElement("img");

    image.src = imagePath(category, filename);
    image.alt = filename;

    const name = document.createElement("span");

    name.textContent = "Option " + (index + 1);

    option.appendChild(image);
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


// =============================================
// SELECT PART
// =============================================

function selectPart(category, filename, index) {

  if (category === "battery" || category === "accessories") {

    let current = selectedParts[category] || [];

    if (!Array.isArray(current)) {
      current = [current];
    }

    if (current.includes(filename)) {

      current = current.filter(item => item !== filename);

    } else {

      if (current.length >= 2) {
        alert("You can only select two " + category + ".");
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
            alert("Those two accessories cannot be combined.");
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
}


// =============================================
// SAVED BIKE STORAGE
// =============================================

function getSavedBikes() {

  try {
    const saved = JSON.parse(
      localStorage.getItem("savedBikes") || "[]"
    );

    return Array.isArray(saved) ? saved : [];

  } catch (error) {
    console.error(error);
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

    console.error(error);

    alert("Could not save your bike.");

    return false;
  }
}


// =============================================
// SAVE BIKE
// =============================================

function saveBike() {

  const saved = getSavedBikes();

  if (editingBikeId !== null) {

    const bike = saved.find(
      item => item.id === editingBikeId
    );

    if (bike) {

      bike.parts = structuredClone(selectedParts);
      bike.colors = structuredClone(selectedColors);

      if (!storeSavedBikes(saved)) return;

      alert("Changes saved!");

      showSavedBikes();

      return;
    }
  }

  const name = prompt("What do you want to name your bike?");

  if (!name || !name.trim()) return;

  const bike = {
    id: Date.now(),
    name: name.trim(),
    parts: structuredClone(selectedParts),
    colors: structuredClone(selectedColors)
  };

  saved.push(bike);

  if (!storeSavedBikes(saved)) return;

  editingBikeId = bike.id;

  updateEditingStatus();
  showSavedBikes();

  alert("Bike saved!");
}


// =============================================
// SAVE AS NEW
// =============================================

function saveBikeAsNew() {

  const name = prompt("Name your new bike:");

  if (!name || !name.trim()) return;

  const saved = getSavedBikes();

  const bike = {
    id: Date.now(),
    name: name.trim(),
    parts: structuredClone(selectedParts),
    colors: structuredClone(selectedColors)
  };

  saved.push(bike);

  if (!storeSavedBikes(saved)) return;

  editingBikeId = bike.id;

  updateEditingStatus();
  showSavedBikes();

  alert("New bike saved!");
}


// =============================================
// LOAD BIKE
// =============================================

function loadBike(id) {

  const bike = getSavedBikes().find(
    item => item.id === id
  );

  if (!bike) return;

  selectedParts = structuredClone(bike.parts || {});

  const savedColors = bike.colors || {};

  selectedColors = {
    frame: {
      hue: Number(savedColors.frame?.hue ?? 0),
      saturation: Number(savedColors.frame?.saturation ?? 100),
      brightness: Number(savedColors.frame?.brightness ?? 100)
    }
  };

  editingBikeId = bike.id;

  updateColorInputs();
  updatePreview();
  updateEditingStatus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  alert("Bike loaded!");
}


// =============================================
// UPDATE COLOR INPUTS
// =============================================

function updateColorInputs() {

  const settings = selectedColors.frame;

  const hue = document.getElementById("frame-hue");
  const saturation = document.getElementById("frame-saturation");
  const brightness = document.getElementById("frame-brightness");

  if (hue) hue.value = settings.hue;

  if (saturation) saturation.value = settings.saturation;

  if (brightness) brightness.value = settings.brightness;
}


// =============================================
// RENAME BIKE
// =============================================

function renameBike(id) {

  const saved = getSavedBikes();

  const bike = saved.find(item => item.id === id);

  if (!bike) return;

  const name = prompt("Enter a new name:", bike.name);

  if (!name || !name.trim()) return;

  bike.name = name.trim();

  if (!storeSavedBikes(saved)) return;

  showSavedBikes();
  updateEditingStatus();
}


// =============================================
// DELETE BIKE
// =============================================

function deleteBike(id) {

  if (!confirm("Are you sure you want to delete this bike?")) {
    return;
  }

  const saved = getSavedBikes().filter(
    bike => bike.id !== id
  );

  if (!storeSavedBikes(saved)) return;

  if (editingBikeId === id) {
    editingBikeId = null;
    updateEditingStatus();
  }

  showSavedBikes();
}


// =============================================
// MY GARAGE
// =============================================

function showSavedBikes() {

  const container = document.getElementById("saved-bikes");

  if (!container) return;

  container.innerHTML = "";

  const saved = getSavedBikes();

  if (!saved.length) {

    const empty = document.createElement("p");

    empty.textContent =
      "Your garage is empty. Save a bike to get started.";

    container.appendChild(empty);

    return;
  }

  saved.forEach(bike => {

    const card = document.createElement("div");

    card.className = "garage-card";

    const title = document.createElement("h3");

    title.textContent = bike.name;

    const preview = document.createElement("div");

    preview.className = "garage-bike-preview";

    createBikeCanvas(
      preview,
      bike.parts || {},
      bike.colors || selectedColors,
      true
    );

    const buttons = document.createElement("div");

    buttons.className = "garage-buttons";

    const load = document.createElement("button");

    load.type = "button";
    load.textContent = "Load / Edit";
    load.onclick = () => loadBike(bike.id);

    const rename = document.createElement("button");

    rename.type = "button";
    rename.textContent = "Rename";
    rename.onclick = () => renameBike(bike.id);

    const remove = document.createElement("button");

    remove.type = "button";
    remove.textContent = "Delete";
    remove.className = "delete-button";
    remove.onclick = () => deleteBike(bike.id);

    buttons.append(load, rename, remove);

    card.append(title, preview, buttons);

    container.appendChild(card);

  });
}


// =============================================
// EDITING STATUS
// =============================================

function updateEditingStatus() {

  const status = document.getElementById("editing-status");

  if (!status) return;

  if (editingBikeId === null) {

    status.textContent = "Not currently editing a saved bike.";

    return;
  }

  const bike = getSavedBikes().find(
    item => item.id === editingBikeId
  );

  status.textContent = bike
    ? "Editing: " + bike.name + " — Save Bike updates this build."
    : "Not currently editing a saved bike.";
}


// =============================================
// GLOBAL BUTTON FUNCTIONS
// =============================================

window.selectCategory = selectCategory;
window.selectPart = selectPart;
window.saveBike = saveBike;
window.saveBikeAsNew = saveBikeAsNew;
window.loadBike = loadBike;
window.renameBike = renameBike;
window.deleteBike = deleteBike;
window.showSavedBikes = showSavedBikes;


// =============================================
// INITIALIZE
// =============================================

function initializeBuilder() {

  updateColorInputs();
  updatePreview();
  showSavedBikes();
  updateEditingStatus();

  console.log("SUPER73 ZX SE Builder loaded.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBuilder);
} else {
  initializeBuilder();
}
