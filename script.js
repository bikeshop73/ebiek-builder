
// =============================================
// SUPER73 ZX SE BIKE BUILDER
// COMPLETE SCRIPT - PIXEL HSL FRAME COLORING
// =============================================

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
    "IMG_5984.PNG", "IMG_5985.PNG", "IMG_5988.PNG"
  ],
  fenders: [
    "IMG_5989.PNG", "IMG_5990.PNG", "IMG_5991.PNG"
  ],
  lights: ["IMG_5992.PNG"],
  accessories: [
    "IMG_6030.PNG", "IMG_6031.PNG",
    "IMG_6032.PNG", "IMG_6033.PNG", "IMG_6034.PNG"
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

// =============================================
// IMAGE CACHES
// =============================================

const originalImageCache = new Map();
const coloredImageCache = new Map();

// =============================================
// ACCESSORY COMBINATIONS
// =============================================

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
// IMAGE LOADER
// =============================================

function loadImage(source) {

  if (originalImageCache.has(source)) {
    return originalImageCache.get(source);
  }

  const promise = new Promise((resolve, reject) => {

    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(new Error("Image failed to load: " + source));
    };

    image.src = source;
  });

  originalImageCache.set(source, promise);

  return promise;
}

// =============================================
// HSL TO RGB
// =============================================

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
// ACTUAL PIXEL PROCESSING
// =============================================

async function recolorFrame(source, settings) {

  const hue = Math.max(0, Math.min(360, Number(settings.hue) || 0));

  const saturation = Math.max(
    0,
    Math.min(100, Number(settings.saturation) || 0)
  );

  const brightness = Math.max(
    0,
    Math.min(200, Number(settings.brightness) || 0)
  );

  const cacheKey = [
    source,
    hue,
    saturation,
    brightness
  ].join("|");

  if (coloredImageCache.has(cacheKey)) {
    return coloredImageCache.get(cacheKey);
  }

  const promise = (async () => {

    const original = await loadImage(source);

    const canvas = document.createElement("canvas");

    canvas.width = original.naturalWidth;
    canvas.height = original.naturalHeight;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true
    });

    ctx.drawImage(original, 0, 0);

    const imageData = ctx.getImageData(
      0, 0, canvas.width, canvas.height
    );

    const pixels = imageData.data;

    const targetHue = hue / 360;
    const targetSaturation = saturation / 100;
    const brightnessMultiplier = brightness / 100;

    let visiblePixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {

      const alpha = pixels[i + 3];

      // Completely transparent pixels stay untouched.
      if (alpha === 0) continue;

      visiblePixels++;

      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];

      // Calculate original pixel brightness.
      const luminance = (
        red * 0.2126 +
        green * 0.7152 +
        blue * 0.0722
      ) / 255;

      // Remap original shading.
      // This prevents white pixels from staying white.
      let lightness = 0.10 + luminance * 0.78;

      // Apply brightness adjustment.
      lightness *= brightnessMultiplier;

      lightness = Math.max(
        0,
        Math.min(1, lightness)
      );

      // Generate the new actual pixel color.
      const rgb = hslToRgb(
        targetHue,
        targetSaturation,
        lightness
      );

      pixels[i] = rgb[0];
      pixels[i + 1] = rgb[1];
      pixels[i + 2] = rgb[2];

      // Alpha is deliberately preserved.
    }

    ctx.putImageData(imageData, 0, 0);

    console.log(
      "Frame recolored:",
      source,
      "Visible pixels:",
      visiblePixels
    );

    return canvas.toDataURL("image/png");

  })();

  coloredImageCache.set(cacheKey, promise);

  try {
    return await promise;
  } catch (error) {
    coloredImageCache.delete(cacheKey);
    throw error;
  }
}

// =============================================
// FRAME SLIDERS
// =============================================

function changeFrameAdjustment(type, value) {

  if (type === "hue" || type === "saturation" || type === "brightness") {

    selectedColors.frame[type] = Number(value);
  }

  else if (type === undefined) {

    const hue = document.getElementById("frame-hue");
    const saturation = document.getElementById("frame-saturation");
    const brightness = document.getElementById("frame-brightness");

    if (hue) selectedColors.frame.hue = Number(hue.value);
    if (saturation) selectedColors.frame.saturation = Number(saturation.value);
    if (brightness) selectedColors.frame.brightness = Number(brightness.value);
  }

  updateFrameSliderLabels();
  updatePreview();
}

// Allows sliders to use individual calls.
function changeFrameHue(value) {
  changeFrameAdjustment("hue", value);
}

function changeFrameSaturation(value) {
  changeFrameAdjustment("saturation", value);
}

function changeFrameBrightness(value) {
  changeFrameAdjustment("brightness", value);
}

// =============================================
// SLIDER LABELS
// =============================================

function updateFrameSliderLabels() {

  const settings = selectedColors.frame;

  const hueValue = document.getElementById("frame-hue-value");
  const saturationValue = document.getElementById("frame-saturation-value");
  const brightnessValue = document.getElementById("frame-brightness-value");

  if (hueValue) {
    hueValue.textContent = settings.hue + "°";
  }

  if (saturationValue) {
    saturationValue.textContent = settings.saturation + "%";
  }

  if (brightnessValue) {
    brightnessValue.textContent = settings.brightness + "%";
  }

  const hue = document.getElementById("frame-hue");
  const saturation = document.getElementById("frame-saturation");
  const brightness = document.getElementById("frame-brightness");

  if (hue) hue.value = settings.hue;
  if (saturation) saturation.value = settings.saturation;
  if (brightness) brightness.value = settings.brightness;
}

// =============================================
// RESET FRAME COLOR
// =============================================

function resetColors() {

  selectedColors.frame = {
    hue: 0,
    saturation: 100,
    brightness: 100
  };

  updateFrameSliderLabels();
  updatePreview();
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
    overflow: "hidden"
  });

  parent.appendChild(canvas);

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

      canvas.appendChild(image);

      // FRAME: RECOLOR EVERY VISIBLE PIXEL.
      if (category === "frame") {

        recolorFrame(
          source,
          colorsToShow.frame || {
            hue: 0,
            saturation: 100,
            brightness: 100
          }
        )
        .then(coloredSource => {
          image.src = coloredSource;
        })
        .catch(error => {
          console.error("Frame recoloring failed:", error);
          image.src = source;
        });

      } else {

        image.src = source;
      }

      image.onerror = () => {
        console.error("Preview image failed:", source);
      };

    });

  });

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

    image.onerror = () => {
      console.error("Thumbnail failed:", image.src);
    };

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

  // BATTERY RULES

  if (category === "battery") {

    let current = selectedParts.battery || [];

    if (!Array.isArray(current)) {
      current = [current];
    }

    if (current.includes(filename)) {

      current = current.filter(item => item !== filename);

    } else {

      if (current.length >= 2) {
        alert("You can only select two batteries.");
        return;
      }

      if (current.length === 1) {

        const firstIndex = parts.battery.indexOf(current[0]);

        if (Math.abs(firstIndex - index) !== 1) {
          alert("Choose two batteries next to each other.");
          return;
        }
      }

      current.push(filename);
    }

    if (current.length) {
      selectedParts.battery = current;
    } else {
      delete selectedParts.battery;
    }
  }

  // ACCESSORY RULES

  else if (category === "accessories") {

    let current = selectedParts.accessories || [];

    if (!Array.isArray(current)) {
      current = [current];
    }

    if (current.includes(filename)) {

      current = current.filter(item => item !== filename);

    } else {

      if (current.length >= 2) {
        alert("You can only select two accessories.");
        return;
      }

      if (current.length === 1) {

        const firstIndex = parts.accessories.indexOf(current[0]);

        const allowed = allowedAccessoryPairs.some(pair =>
          pair.includes(firstIndex) && pair.includes(index)
        );

        if (!allowed) {
          alert("Those two accessories cannot be combined.");
          return;
        }
      }

      current.push(filename);
    }

    if (current.length) {
      selectedParts.accessories = current;
    } else {
      delete selectedParts.accessories;
    }
  }

  // SINGLE SELECTION

  else {

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
// SAVED BIKES STORAGE
// =============================================

function getSavedBikes() {

  try {

    const saved = JSON.parse(
      localStorage.getItem("savedBikes") || "[]"
    );

    return Array.isArray(saved) ? saved : [];

  } catch (error) {

    console.error("Could not load saved bikes:", error);

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

    alert("Could not save bikes. Browser storage may be full.");

    return false;
  }
}

// =============================================
// SAVE BIKE
// =============================================

function saveBike() {

  const savedBikes = getSavedBikes();

  if (editingBikeId !== null) {

    const bike = savedBikes.find(
      item => item.id === editingBikeId
    );

    if (bike) {

      bike.parts = JSON.parse(JSON.stringify(selectedParts));

      bike.colors = JSON.parse(JSON.stringify(selectedColors));

      if (!storeSavedBikes(savedBikes)) return;

      alert("Your changes have been saved!");

      showSavedBikes();
      updateEditingStatus();

      return;
    }
  }

  const name = prompt("What do you want to name your bike?");

  if (!name || !name.trim()) return;

  const newBike = {
    id: Date.now(),
    name: name.trim(),
    parts: JSON.parse(JSON.stringify(selectedParts)),
    colors: JSON.parse(JSON.stringify(selectedColors))
  };

  savedBikes.push(newBike);

  if (!storeSavedBikes(savedBikes)) return;

  editingBikeId = newBike.id;

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

  const savedBikes = getSavedBikes();

  const newBike = {
    id: Date.now(),
    name: name.trim(),
    parts: JSON.parse(JSON.stringify(selectedParts)),
    colors: JSON.parse(JSON.stringify(selectedColors))
  };

  savedBikes.push(newBike);

  if (!storeSavedBikes(savedBikes)) return;

  editingBikeId = newBike.id;

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

  selectedParts = JSON.parse(
    JSON.stringify(bike.parts || {})
  );

  const oldColors = bike.colors || {};

  // Supports older saved builds.
  selectedColors = {
    frame: {
      hue: Number(oldColors.frame?.hue ?? 0),
      saturation: Number(oldColors.frame?.saturation ?? 100),
      brightness: Number(oldColors.frame?.brightness ?? 100)
    }
  };

  editingBikeId = bike.id;

  updateFrameSliderLabels();
  updatePreview();
  updateEditingStatus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  alert("Bike loaded! You can now edit it.");
}

// =============================================
// RENAME BIKE
// =============================================

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

// =============================================
// DELETE BIKE
// =============================================

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

// =============================================
// MY GARAGE
// =============================================

function showSavedBikes() {

  const container = document.getElementById("saved-bikes");

  if (!container) return;

  container.innerHTML = "";

  const savedBikes = getSavedBikes();

  if (savedBikes.length === 0) {

    const empty = document.createElement("p");

    empty.textContent =
      "Your garage is empty. Save a bike to get started.";

    container.appendChild(empty);

    return;
  }

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
        frame: {
          hue: 0,
          saturation: 100,
          brightness: 100
        }
      },
      true
    );

    const buttons = document.createElement("div");

    buttons.className = "garage-buttons";

    const loadButton = document.createElement("button");

    loadButton.type = "button";
    loadButton.textContent = "Load / Edit";
    loadButton.onclick = () => loadBike(bike.id);

    const renameButton = document.createElement("button");

    renameButton.type = "button";
    renameButton.textContent = "Rename";
    renameButton.onclick = () => renameBike(bike.id);

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.onclick = () => deleteBike(bike.id);

    buttons.appendChild(loadButton);
    buttons.appendChild(renameButton);
    buttons.appendChild(deleteButton);

    card.appendChild(title);
    card.appendChild(preview);
    card.appendChild(buttons);

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

// =============================================
// INITIALIZE
// =============================================

function initializeBuilder() {

  updateFrameSliderLabels();
  updatePreview();
  showSavedBikes();
  updateEditingStatus();

  // Initial category.
  selectCategory("frame");

  console.log("SUPER73 ZX SE Builder loaded successfully.");
}

// =============================================
// EXPOSE FUNCTIONS FOR HTML BUTTONS
// =============================================

Object.assign(window, {
  selectCategory,
  selectPart,
  changeFrameAdjustment,
  changeFrameHue,
  changeFrameSaturation,
  changeFrameBrightness,
  resetColors,
  saveBike,
  saveBikeAsNew,
  loadBike,
  renameBike,
  deleteBike,
  showSavedBikes
});

// =============================================
// START
// =============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBuilder);
} else {
  initializeBuilder();
}
