
/* =========================================
   SUPER73 ZX SE BUILDER
   COMPLETE REBUILT SCRIPT
========================================= */

/* =========================================
   PART IMAGES
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
  frameHue: 0,
  frameSaturation: 100,
  frameBrightness: 50
};

let editingBikeId = null;

const allowedAccessoryPairs = [
  [0, 1], [0, 3], [1, 2],
  [1, 4], [3, 4], [2, 3]
];

/* =========================================
   LAYER ORDER
========================================= */

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

/* =========================================
   IMAGE PATH
========================================= */

function imagePath(category, filename) {
  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}

/* =========================================
   FRAME COLOR
========================================= */

function getFrameColor() {
  return `hsl(
    ${selectedColors.frameHue},
    ${selectedColors.frameSaturation}%,
    ${selectedColors.frameBrightness}%
  )`;
}

function addFrameColorOverlay(canvas, source, position, zIndex) {
  const overlay = document.createElement("div");

  overlay.className = "frame-color-overlay";

  Object.assign(overlay.style, {
    position: "absolute",
    left: position.left,
    top: position.top,
    width: position.width,
    height: position.height,
    backgroundColor: getFrameColor(),
    maskImage: `url("${source}")`,
    webkitMaskImage: `url("${source}")`,
    maskSize: "contain",
    webkitMaskSize: "contain",
    maskPosition: "center",
    webkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    webkitMaskRepeat: "no-repeat",
    mixBlendMode: "color",
    opacity: "1",
    zIndex: String(zIndex),
    pointerEvents: "none"
  });

  canvas.appendChild(overlay);
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
      ? {
          left: "1%", top: "48%",
          width: "34%", height: "34%"
        }
      : {
          left: "66.5%", top: "49%",
          width: "34%", height: "34%"
        };
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
        pointerEvents: "none"
      });

      image.onerror = () => {
        console.error("Image failed:", source);
      };

      canvas.appendChild(image);

      if (category === "frame") {
        addFrameColorOverlay(
          canvas,
          source,
          position,
          layerIndex + 1.5
        );
      }
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
   FRAME COLOR SLIDERS
========================================= */

function changeFrameAdjustment(type, value) {
  if (!["frameHue", "frameSaturation", "frameBrightness"].includes(type)) {
    return;
  }

  selectedColors[type] = Number(value);

  updatePreview();
}

function createColorControls() {
  const section = document.querySelector(".custom-colors");
  if (!section) return;

  section.innerHTML = `
    <h2>Frame Color</h2>
    <p>Adjust your frame's color.</p>

    <div class="hsb-controls">

      <label>
        Hue
        <input id="frame-hue" type="range"
          min="0" max="360" value="0">
      </label>

      <label>
        Saturation
        <input id="frame-saturation" type="range"
          min="0" max="100" value="100">
      </label>

      <label>
        Brightness
        <input id="frame-brightness" type="range"
          min="0" max="100" value="50">
      </label>

    </div>

    <button type="button" id="reset-frame-color">
      Reset Frame Color
    </button>
  `;

  const controls = [
    ["frame-hue", "frameHue"],
    ["frame-saturation", "frameSaturation"],
    ["frame-brightness", "frameBrightness"]
  ];

  controls.forEach(([id, property]) => {
    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("input", () => {
      changeFrameAdjustment(property, input.value);
    });
  });

  document.getElementById("reset-frame-color")
    .addEventListener("click", resetColors);

  updateColorInputs();
}

function updateColorInputs() {
  const controls = [
    ["frame-hue", "frameHue"],
    ["frame-saturation", "frameSaturation"],
    ["frame-brightness", "frameBrightness"]
  ];

  controls.forEach(([id, property]) => {
    const input = document.getElementById(id);

    if (input) {
      input.value = selectedColors[property];
    }
  });
}

function resetColors() {
  selectedColors = {
    frameHue: 0,
    frameSaturation: 100,
    frameBrightness: 50
  };

  updateColorInputs();
  updatePreview();
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
      optionNames[category]?.[index] ||
      `Unlabeled Option ${index + 1}`;

    option.append(image, name);

    const current = selectedParts[category];

    const isSelected = Array.isArray(current)
      ? current.includes(filename)
      : current === filename;

    if (isSelected) {
      option.classList.add("selected");
    }

    option.addEventListener("click", () => {
      selectPart(category, filename, index);
    });

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

    if (!Array.isArray(current)) {
      current = [current];
    }

    if (current.includes(filename)) {
      current = current.filter(item => item !== filename);
    } else {
      if (current.length >= 2) {
        alert(category === "battery"
          ? "You can only select two batteries."
          : "You can only select two accessories.");
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
    console.error("Garage loading error:", error);
    return [];
  }
}

function storeSavedBikes(bikes) {
  try {
    localStorage.setItem("savedBikes", JSON.stringify(bikes));
    return true;
  } catch (error) {
    console.error("Garage saving error:", error);
    alert("Could not save bike. Check browser storage.");
    return false;
  }
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
      bike.parts = structuredClone(selectedParts);
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
    parts: structuredClone(selectedParts),
    colors: { ...selectedColors }
  };

  savedBikes.push(newBike);

  if (!storeSavedBikes(savedBikes)) return;

  editingBikeId = newBike.id;

  showSavedBikes();
  updateEditingStatus();

  alert("Bike saved!");
}

/* =========================================
   SAVE AS NEW
========================================= */

function saveBikeAsNew() {
  const name = prompt("Name your new bike:");
  if (!name || !name.trim()) return;

  const savedBikes = getSavedBikes();

  const newBike = {
    id: Date.now(),
    name: name.trim(),
    parts: structuredClone(selectedParts),
    colors: { ...selectedColors }
  };

  savedBikes.push(newBike);

  if (!storeSavedBikes(savedBikes)) return;

  editingBikeId = newBike.id;

  showSavedBikes();
  updateEditingStatus();

  alert("New bike saved!");
}

/* =========================================
   LOAD BIKE
========================================= */

function loadBike(id) {
  const bike = getSavedBikes().find(item => item.id === id);
  if (!bike) return;

  selectedParts = structuredClone(bike.parts || {});

  selectedColors = {
    frameHue: bike.colors?.frameHue ?? bike.colors?.hue ?? 0,
    frameSaturation: bike.colors?.frameSaturation ?? bike.colors?.saturation ?? 100,
    frameBrightness: bike.colors?.frameBrightness ?? bike.colors?.brightness ?? 50
  };

  editingBikeId = bike.id;

  updateColorInputs();
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
        frameHue: 0,
        frameSaturation: 100,
        frameBrightness: 50
      },
      true
    );

    const buttons = document.createElement("div");
    buttons.className = "garage-buttons";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.textContent = "Load / Edit";
    loadButton.addEventListener("click", () => loadBike(bike.id));

    const renameButton = document.createElement("button");
    renameButton.type = "button";
    renameButton.textContent = "Rename";
    renameButton.addEventListener("click", () => renameBike(bike.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteBike(bike.id));

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

  const bike = getSavedBikes().find(
    item => item.id === editingBikeId
  );

  status.textContent = bike
    ? `Editing: ${bike.name} — Save Bike updates this build.`
    : "Not currently editing a saved bike.";
}

/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  createColorControls();
  updatePreview();
  showSavedBikes();
  updateEditingStatus();

  console.log("SUPER73 ZX SE Builder loaded successfully.");
});
