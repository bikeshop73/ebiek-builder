
// =====================================
// SUPER73 ZX SE BIKE BUILDER
// =====================================


// PART IMAGES

const parts = {
  frame: [
    "IMG_5964.PNG", "IMG_5965.PNG", "IMG_5966.PNG",
    "IMG_5967.PNG", "IMG_5968.PNG", "IMG_5969.PNG",
    "IMG_5970.PNG", "IMG_5971.PNG", "IMG_5972.PNG",
    "IMG_5973.PNG", "IMG_5974.PNG", "IMG_5987.PNG"
  ],

  frontForks: [
    "IMG_5975.PNG", "IMG_5976.PNG",
    "IMG_5977.PNG", "IMG_5998.PNG",
    "IMG_5999.PNG", "IMG_5997.PNG",
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


// IMAGE FOLDERS

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


// CURRENT BUILD

let selectedParts = {};

let selectedColors = {
  frame: "#000000",
  accent: "#000000"
};

let editingBikeId = null;


// ACCESSORY COMBINATIONS

const allowedAccessoryPairs = [
  [0, 1],
  [0, 3],
  [1, 2],
  [1, 4],
  [3, 4],
  [2, 3]
];


// LAYER ORDER

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


// IMAGE PATH

function imagePath(category, filename) {
  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}


// PART POSITIONING

function getLayerPosition(category, position) {

  if (category === "frontForks") {
    return { left: "42%", top: "7%", width: "58%", height: "78%" };
  }

  if (category === "frontWheel") {
    return { left: "70%", top: "53%", width: "27%", height: "27%" };
  }

  if (category === "rearWheel") {
    return { left: "4%", top: "52%", width: "27%", height: "27%" };
  }

  if (category === "tires" && position === "rear") {
    return { left: "1%", top: "48%", width: "34%", height: "34%" };
  }

  if (category === "tires" && position === "front") {
    return { left: "66.5%", top: "49%", width: "34%", height: "34%" };
  }

  if (category === "motor") {
    return { left: "5.5%", top: "52.5%", width: "24%", height: "24%" };
  }

  if (category === "handlebars") {
    return { left: "53.5%", top: "13%", width: "24%", height: "24%" };
  }

  if (category === "fenders") {
    return { left: "57.5%", top: "22%", width: "29%", height: "29%" };
  }

  if (category === "lights") {
    return { left: "64%", top: "27%", width: "10%", height: "10%" };
  }

  return {
    left: "0%",
    top: "0%",
    width: "100%",
    height: "100%"
  };
}


// =====================================
// COLOR OVERLAY
// Uses the transparent image pixels as a mask.
// This avoids the old color-blending problem.
// =====================================


function addColorOverlay(canvas, source, position, color, zIndex) {
  const overlay = document.createElement("div");

  overlay.className = "color-overlay";

  overlay.style.position = "absolute";
  overlay.style.left = position.left;
  overlay.style.top = position.top;
  overlay.style.width = position.width;
  overlay.style.height = position.height;

  overlay.style.backgroundColor = color;

  overlay.style.maskImage = `url("${source}")`;
  overlay.style.webkitMaskImage = `url("${source}")`;

  overlay.style.maskSize = "contain";
  overlay.style.webkitMaskSize = "contain";

  overlay.style.maskPosition = "center";
  overlay.style.webkitMaskPosition = "center";

  overlay.style.maskRepeat = "no-repeat";
  overlay.style.webkitMaskRepeat = "no-repeat";

  // Color Burn blending
  overlay.style.mixBlendMode = "color";
  overlay.style.opacity = "1";
  
  overlay.style.zIndex = String(zIndex);

  canvas.appendChild(overlay);
}


// CREATE BIKE CANVAS

function createBikeCanvas(parent, partsToShow, colorsToShow, thumbnail = false) {

  const canvas = document.createElement("div");

  canvas.className = thumbnail
    ? "bike-canvas bike-thumbnail"
    : "bike-canvas";

  canvas.style.position = "relative";
  canvas.style.width = "100%";
  canvas.style.maxWidth = thumbnail ? "260px" : "700px";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.margin = "auto";

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
        zIndex: String(layerIndex + 1)
      });

      canvas.appendChild(image);

      // FRAME COLOR
      if (category === "frame") {
        addColorOverlay(
          canvas,
          source,
          position,
          colorsToShow.frame || "#000000",
          layerIndex + 1.5
        );
      }

      // WHEEL COLOR
      if (
        category === "frontWheel" ||
        category === "rearWheel"
      ) {
        addColorOverlay(
          canvas,
          source,
          position,
          colorsToShow.accent || "#000000",
          layerIndex + 1.5
        );
      }

      image.onerror = () => {
        console.error("Preview image failed:", source);
      };

    });
  });

  parent.appendChild(canvas);

  return canvas;
}


// UPDATE PREVIEW

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


// CHANGE COLORS

function changeColor(type, color) {

  selectedColors[type] = color;

  updatePreview();
}


// RESET COLORS

function resetColors() {

  selectedColors.frame = "#000000";
  selectedColors.accent = "#000000";

  updateColorInputs();
  updatePreview();
}


// UPDATE COLOR INPUTS

function updateColorInputs() {

  const frame = document.getElementById("frame-color");
  const accent = document.getElementById("accent-color");

  if (frame) frame.value = selectedColors.frame;
  if (accent) accent.value = selectedColors.accent;
}


// SELECT CATEGORY

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


// SELECT PART

function selectPart(category, filename, index) {

  // BATTERY RULES

  if (category === "battery") {

    let current = selectedParts.battery || [];

    if (!Array.isArray(current)) current = [current];

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

    if (!Array.isArray(current)) current = [current];

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

  // SINGLE-SELECTION PARTS

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


// SAVED BIKES STORAGE

function getSavedBikes() {

  try {
    return JSON.parse(localStorage.getItem("savedBikes") || "[]");
  } catch (error) {
    console.error(error);
    return [];
  }
}


function storeSavedBikes(bikes) {

  localStorage.setItem(
    "savedBikes",
    JSON.stringify(bikes)
  );
}


// SAVE BIKE

function saveBike() {

  const savedBikes = getSavedBikes();

  if (editingBikeId !== null) {

    const bike = savedBikes.find(
      item => item.id === editingBikeId
    );

    if (bike) {

      bike.parts = JSON.parse(JSON.stringify(selectedParts));
      bike.colors = JSON.parse(JSON.stringify(selectedColors));

      storeSavedBikes(savedBikes);

      alert("Your changes have been saved!");

      showSavedBikes();

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

  storeSavedBikes(savedBikes);

  editingBikeId = newBike.id;

  updateEditingStatus();

  alert("Bike saved!");

  showSavedBikes();
}


// SAVE AS NEW

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

  storeSavedBikes(savedBikes);

  editingBikeId = newBike.id;

  updateEditingStatus();

  alert("New bike saved!");

  showSavedBikes();
}


// LOAD BIKE

function loadBike(id) {

  const bike = getSavedBikes().find(item => item.id === id);

  if (!bike) return;

  selectedParts = JSON.parse(
    JSON.stringify(bike.parts || {})
  );

  selectedColors = JSON.parse(
    JSON.stringify(bike.colors || {
      frame: "#000000",
      accent: "#000000"
    })
  );

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


// RENAME BIKE

function renameBike(id) {

  const savedBikes = getSavedBikes();

  const bike = savedBikes.find(item => item.id === id);

  if (!bike) return;

  const newName = prompt("Enter a new name:", bike.name);

  if (!newName || !newName.trim()) return;

  bike.name = newName.trim();

  storeSavedBikes(savedBikes);
  showSavedBikes();
  updateEditingStatus();
}


// DELETE BIKE

function deleteBike(id) {

  if (!confirm("Are you sure you want to delete this bike?")) {
    return;
  }

  const updated = getSavedBikes().filter(
    bike => bike.id !== id
  );

  storeSavedBikes(updated);

  if (editingBikeId === id) {
    editingBikeId = null;
    updateEditingStatus();
  }

  showSavedBikes();
}


// MY GARAGE

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
        frame: "#000000",
        accent: "#000000"
      },
      true
    );

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

    buttons.appendChild(loadButton);
    buttons.appendChild(renameButton);
    buttons.appendChild(deleteButton);

    card.appendChild(title);
    card.appendChild(preview);
    card.appendChild(buttons);

    container.appendChild(card);

  });
}


// EDITING STATUS

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


// INITIALIZE

document.addEventListener("DOMContentLoaded", () => {

  updateColorInputs();
  updatePreview();
  showSavedBikes();
  updateEditingStatus();

});
