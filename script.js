
// =====================================
// SUPER73 ZX SE BIKE BUILDER
// =====================================

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

// =====================================
// IMAGE FOLDERS
// =====================================

const folders = {
  frame: "frames",
  frontForks: "forks",
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

// =====================================
// SELECTED PARTS
// =====================================

const selectedParts = {};

// =====================================
// IMAGE PATH
// =====================================

function imagePath(category, filename) {
  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}

// =====================================
// ACCESSORY COMBINATIONS
// =====================================

const allowedAccessoryPairs = [
  [0, 1], // 1 + 2
  [0, 3], // 1 + 4
  [1, 2], // 2 + 3
  [1, 4], // 2 + 5
  [3, 4], // 4 + 5
  [2, 3]  // 3 + 4
];

// =====================================
// SHOW CATEGORY OPTIONS
// =====================================

function selectCategory(category) {
  const list = document.getElementById("parts-list");

  if (!list || !parts[category]) return;

  list.innerHTML = "";

  const heading = document.createElement("h3");

  heading.textContent = category
    .replace(/([A-Z])/g, " $1")
    .toUpperCase();

  list.appendChild(heading);

  parts[category].forEach(part => {
    const button = document.createElement("button");

    button.className = "part-option";

    // IMAGE THUMBNAIL
    if (folders[category]) {
      const img = document.createElement("img");

      img.src = imagePath(category, part);
      img.alt = part;

      img.onerror = () => {
        console.error("Thumbnail failed:", img.src);
      };

      button.appendChild(img);
    }

    // PART LABEL
    const label = document.createElement("span");

    label.textContent = part.replace(/\.[^.]+$/, "");

    button.appendChild(label);

    // SELECTED HIGHLIGHT
    const multiSelected = ["battery", "accessories"];

    const isSelected = multiSelected.includes(category)
      ? (selectedParts[category] || []).includes(part)
      : selectedParts[category] === part;

    if (isSelected) {
      button.classList.add("selected");
    }

    // =====================================
    // BUTTON CLICK
    // =====================================

    button.onclick = () => {

      // BATTERIES: ONLY ADJACENT PAIRS
      if (category === "battery") {
        const current = selectedParts.battery || [];

        if (current.includes(part)) {

          selectedParts.battery =
            current.filter(p => p !== part);

        } else if (current.length < 2) {

          const indexes = [...current, part]
            .map(p => parts.battery.indexOf(p));

          if (
            indexes.length === 1 ||
            Math.abs(indexes[0] - indexes[1]) === 1
          ) {
            selectedParts.battery = [...current, part];
          }
        }
      }

      // ACCESSORIES: ONLY SIX APPROVED PAIRS
      else if (category === "accessories") {
        const current = selectedParts.accessories || [];

        const currentIndex = parts.accessories.indexOf(part);

        if (current.includes(part)) {

          selectedParts.accessories =
            current.filter(p => p !== part);

        } else if (current.length === 0) {

          selectedParts.accessories = [part];

        } else if (current.length === 1) {

          const firstIndex = parts.accessories.indexOf(current[0]);

          const valid = allowedAccessoryPairs.some(pair =>
            pair.includes(firstIndex) &&
            pair.includes(currentIndex)
          );

          if (valid) {
            selectedParts.accessories = [...current, part];
          }
        }
      }

      // ALL OTHER PARTS: SINGLE SELECTION
      else {
        selectedParts[category] = part;
      }

      updatePreview();
      selectCategory(category);
    };

    list.appendChild(button);
  });
}

// =====================================
// UPDATE BIKE PREVIEW
// =====================================

function updatePreview() {
  const preview = document.getElementById("bike-preview");

  if (!preview) return;

  preview.innerHTML = "";

  const title = document.createElement("h2");

  title.textContent = "SUPER73 ZX SE";

  preview.appendChild(title);

  const canvas = document.createElement("div");

  canvas.style.position = "relative";
  canvas.style.width = "100%";
  canvas.style.maxWidth = "700px";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.margin = "auto";

  preview.appendChild(canvas);

  // =====================================
  // LAYER ORDER
  // =====================================

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

  // =====================================
  // DRAW EACH LAYER
  // =====================================

  layers.forEach(layer => {

    const category = layer.category;

    const multiple = ["battery", "accessories"];

    const selected = multiple.includes(category)
      ? (selectedParts[category] || [])
      : [selectedParts[category]];

    selected.forEach(part => {

      if (!part) return;

      const img = document.createElement("img");

      img.src = imagePath(category, part);
      img.alt = part;

      img.onerror = () => {
        console.error("Preview image failed:", img.src);
      };

      img.style.position = "absolute";
      img.style.objectFit = "contain";

      // =====================================
      // POSITIONING
      // =====================================

      if (category === "frontForks") {
        img.style.left = "42%";
        img.style.top = "7%";
        img.style.width = "58%";
        img.style.height = "78%";

      } else if (category === "frontWheel") {
        img.style.left = "70%";
        img.style.top = "53%";
        img.style.width = "27%";
        img.style.height = "27%";

      } else if (category === "rearWheel") {
        img.style.left = "4%";
        img.style.top = "52%";
        img.style.width = "27%";
        img.style.height = "27%";

      } else if (category === "tires" && layer.position === "rear") {
        img.style.left = "1%";
        img.style.top = "48%";
        img.style.width = "34%";
        img.style.height = "34%";

      } else if (category === "tires" && layer.position === "front") {
        img.style.left = "66.5%";
        img.style.top = "49%";
        img.style.width = "34%";
        img.style.height = "34%";

      } else if (category === "motor") {
        img.style.left = "5.5%";
        img.style.top = "52.5%";
        img.style.width = "24%";
        img.style.height = "24%";

      } else if (category === "handlebars") {
        img.style.left = "53.5%";
        img.style.top = "13%";
        img.style.width = "24%";
        img.style.height = "24%";

      } else if (category === "fenders") {
        img.style.left = "57.5%";
        img.style.top = "22%";
        img.style.width = "29%";
        img.style.height = "29%";

      } else if (category === "lights") {
        img.style.left = "64%";
        img.style.top = "27%";
        img.style.width = "10%";
        img.style.height = "10%";

      } else {
        // SEAT, BATTERY AND ACCESSORIES
        img.style.left = "0%";
        img.style.top = "0%";
        img.style.width = "100%";
        img.style.height = "100%";
      }

      canvas.appendChild(img);
    });
  });
}

// =====================================
// INITIALIZE APP
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  updatePreview();
});

// =====================================
// SAVE AND LOAD BIKES
// =====================================

function getSavedBikes() {
  return JSON.parse(localStorage.getItem("savedBikes") || "[]");
}

function saveBike() {
  const name = prompt("What do you want to name your bike?");

  if (!name || !name.trim()) return;

  const savedBikes = getSavedBikes();

  savedBikes.push({
    id: Date.now(),
    name: name.trim(),
    parts: JSON.parse(JSON.stringify(selectedParts))
  });

  localStorage.setItem("savedBikes", JSON.stringify(savedBikes));

  alert("Bike saved!");
}

function showSavedBikes() {
  const container = document.getElementById("saved-bikes");

  if (!container) return;

  container.innerHTML = "<h2>My Saved Bikes</h2>";

  const savedBikes = getSavedBikes();

  if (savedBikes.length === 0) {
    container.innerHTML += "<p>No saved bikes yet!</p>";
    return;
  }

  savedBikes.forEach(bike => {
    const item = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = bike.name;

    const loadButton = document.createElement("button");
    loadButton.textContent = "Load";

    loadButton.onclick = () => {
      Object.keys(selectedParts).forEach(key => delete selectedParts[key]);

      Object.assign(selectedParts, JSON.parse(JSON.stringify(bike.parts)));

      updatePreview();
      alert("Bike loaded!");
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.onclick = () => {
      const updated = getSavedBikes().filter(b => b.id !== bike.id);

      localStorage.setItem("savedBikes", JSON.stringify(updated));

      showSavedBikes();
    };

    item.appendChild(name);
    item.appendChild(loadButton);
    item.appendChild(deleteButton);

    container.appendChild(item);
  });
}
