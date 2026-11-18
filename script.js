
/* =========================================
   SUPER73 ZX SE BUILDER
   COMPLETE SCRIPT
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
    "IMG_5978.PNG", "IMG_5986.PNG"
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
  battery: ["IMG_5984.PNG", "IMG_5985.PNG", "IMG_5988.PNG"],
  fenders: ["IMG_5989.PNG", "IMG_5990.PNG", "IMG_5991.PNG"],
  lights: ["IMG_5992.PNG"],
  accessories: [
    "IMG_6030.PNG", "IMG_6031.PNG", "IMG_6032.PNG",
    "IMG_6033.PNG", "IMG_6034.PNG"
  ]
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
  accessories: "Accessories"
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
    "Surron Battery",
    "Stock Battery",
    "Chi Battery"
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
  ]
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

function imagePath(category, filename) {
  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}

/* =========================================
   FRAME IMAGE FILTER
========================================= */

// Uses the actual original frame image.
// No canvas recoloring, no color overlay.

function getFrameFilter(colors) {
  return [
    `hue-rotate(${colors.hue}deg)`,
    `saturate(${colors.saturation}%)`,
    `brightness(${colors.brightness}%)`
  ].join(" ");
}

function applyFrameFilter(image, colors) {
  image.style.filter = getFrameFilter(colors);
  image.style.webkitFilter = getFrameFilter(colors);
}

function updateFrameImages() {
  document.querySelectorAll(
    "#bike-preview .frame-layer, .garage-card .frame-layer"
  ).forEach(image => {
    const colors = image.closest("#bike-preview")
      ? selectedColors
      : JSON.parse(image.dataset.colors || '{"hue":0,"saturation":100,"brightness":100}');

    applyFrameFilter(image, colors);
  });
}

/* =========================================
   PART POSITIONING
========================================= */

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
    isolation: "isolate"
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
      const position = getLayerPosition(category, layer.position);

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
        pointerEvents: "none"
      });

      if (category === "frame") {
        image.classList.add("frame-layer");

        image.dataset.colors = JSON.stringify(colorsToShow);

        applyFrameFilter(image, colorsToShow);
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
   LIVE FRAME SLIDERS
========================================= */

function changeFrameAdjustment() {
  const hue = document.getElementById("frame-hue");
  const saturation = document.getElementById("frame-saturation");
  const brightness = document.getElementById("frame-brightness");

  if (!hue || !saturation || !brightness) return;

  selectedColors.hue = Number(hue.value);
  selectedColors.saturation = Number(saturation.value);
  selectedColors.brightness = Number(brightness.value);

  // Update existing image directly.
  // Do NOT rebuild the bike while dragging.
  document.querySelectorAll(
    "#bike-preview .frame-layer"
  ).forEach(image => {
    applyFrameFilter(image, selectedColors);
  });
}

function resetFrameAdjustments() {
  selectedColors = {
    hue: 0,
    saturation: 100,
    brightness: 100
  };

  resetSliderDisplay();
  changeFrameAdjustment();
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
   CATEGORY SELECTION
========================================= */

function selectCategory(category) {
  const container = document.getElementById("parts-list");

  if (!container || !parts[category]) return;

  container.innerHTML = "";

  const heading = document.createElement("h3");

  heading.textContent = category === "fenders"
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
    image.alt = optionNames[category]?.[index] || filename;

    image.onerror = () => {
      console.error("Thumbnail failed:", image.src);
    };

    const name = document.createElement("span");
    name.textContent =
      optionNames[category]?.[index] || `Option ${index + 1}`;

    option.append(image, name);

    const current = selectedParts[category];

    const isSelected = Array.isArray(current)
      ? current.includes(filename)
      : current === filename;

    if (isSelected) option.classList.add("selected");

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
    localStorage.setItem("savedBikes", JSON.stringify(bikes));
    return true;
  } catch (error) {
    console.error("Could not save bikes:", error);
    alert("Could not save. Browser storage may be full.");
    return false;
  }
}

/* =========================================
   SAVE BIKE
========================================= */

function saveBike() {
  const savedBikes = getSavedBikes();

  if (editingBikeId !== null) {
    const bike = savedBikes.find(item => item.id === editingBikeId);

    if (bike) {
      bike.parts = JSON.parse(JSON.stringify(selectedParts));
      bike.colors = { ...selectedColors };

      if (!storeSavedBikes(savedBikes)) return;

      showSavedBikes();
      updateEditingStatus();

      alert("Your changes have been saved!");
      return;
    }
  }

  const name = prompt("What do you want to name your bike?");
  if (!name || !name.trim()) return;

  const newBike = {
    id: Date.now(),
    name: name.trim(),
    parts: JSON.parse(JSON.stringify(selectedParts)),
    colors: { ...selectedColors }
  };

  savedBikes.push(newBike);

  if (!storeSavedBikes(savedBikes)) return;

  editingBikeId = newBike.id;

  updateEditingStatus();
  showSavedBikes();

  alert("Bike saved!");
}

function saveBikeAsNew() {
  const name = prompt("Name your new bike:");
  if (!name || !name.trim()) return;

  const savedBikes = getSavedBikes();

  const newBike = {
    id: Date.now(),
    name: name.trim(),
    parts: JSON.parse(JSON.stringify(selectedParts)),
    colors: { ...selectedColors }
  };

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
  const bike = getSavedBikes().find(item => item.id === id);
  if (!bike) return;

  selectedParts = JSON.parse(JSON.stringify(bike.parts || {}));

  selectedColors = {
    hue: bike.colors?.hue ?? 0,
    saturation: bike.colors?.saturation ?? 100,
    brightness: bike.colors?.brightness ?? 100
  };

  editingBikeId = bike.id;

  resetSliderDisplay();
  updatePreview();
  updateEditingStatus();

  window.scrollTo({ top: 0, behavior: "smooth" });

  alert("Bike loaded! You can now edit it.");
}

/* =========================================
   RENAME BIKE
========================================= */

function renameBike(id) {
  const savedBikes = getSavedBikes();
  const bike = savedBikes.find(item => item.id === id);

  if (!bike) return;

  const newName = prompt("Enter a new name:", bike.name);
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
  if (!confirm("Are you sure you want to delete this bike?")) return;

  const savedBikes = getSavedBikes().filter(bike => bike.id !== id);

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
    empty.textContent = "Your garage is empty. Save a bike to get started.";
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
        hue: 0,
        saturation: 100,
        brightness: 100
      },
      true
    );

    // Store saved colors on thumbnail frame images.
    preview.querySelectorAll(".frame-layer").forEach(image => {
      image.dataset.colors = JSON.stringify(
        bike.colors || {
          hue: 0,
          saturation: 100,
          brightness: 100
        }
      );
    });

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

    buttons.append(loadButton, renameButton, deleteButton);
    card.append(title, preview, buttons);
    container.appendChild(card);
  });
}

/* =========================================
   EDITING STATUS
========================================= */

function updateEditingStatus() {
  const status = document.getElementById("editing-status");
  if (!status) return;

  if (editingBikeId === null) {
    status.textContent = "Not currently editing a saved bike.";
    return;
  }

  const bike = getSavedBikes().find(item => item.id === editingBikeId);

  status.textContent = bike
    ? "Editing: " + bike.name + " — Save Bike updates this build."
    : "Not currently editing a saved bike.";
}

/* =========================================
   GLOBAL FUNCTIONS
   Supports HTML onclick attributes.
========================================= */

window.selectCategory = selectCategory;
window.saveBike = saveBike;
window.saveBikeAsNew = saveBikeAsNew;
window.showSavedBikes = showSavedBikes;
window.resetFrameAdjustments = resetFrameAdjustments;
window.changeFrameAdjustment = changeFrameAdjustment;
window.loadBike = loadBike;
window.renameBike = renameBike;
window.deleteBike = deleteBike;

/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  ["frame-hue", "frame-saturation", "frame-brightness"]
    .forEach(id => {
      const slider = document.getElementById(id);

      if (slider) {
        slider.addEventListener("input", changeFrameAdjustment);
      }
    });

  updatePreview();
  showSavedBikes();
  updateEditingStatus();

  console.log("SUPER73 ZX SE Builder loaded successfully.");
});
