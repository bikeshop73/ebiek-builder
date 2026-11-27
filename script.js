
/* =========================================
   SUPER73 ZX SE BUILDER
   COMPLETE BUILDER ENGINE
========================================= */

const parts = {
  frame: [
    "IMG_5964.PNG","IMG_5965.PNG","IMG_5966.PNG",
    "IMG_5967.PNG","IMG_5968.PNG","IMG_5969.PNG",
    "IMG_5970.PNG","IMG_5971.PNG","IMG_5972.PNG",
    "IMG_5973.PNG","IMG_5974.PNG","IMG_5987.PNG"
  ],

  frontForks: [
    "IMG_5975.PNG","IMG_5976.PNG","IMG_5977.PNG",
    "IMG_5998.PNG","IMG_5999.PNG","IMG_5997.PNG",
    "IMG_6001.PNG","IMG_5900.PNG"
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

  motor: ["IMG_5959.PNG","IMG_5993.PNG"],

  handlebars: [
    "IMG_5980.PNG","IMG_5981.PNG",
    "IMG_5982.PNG","IMG_5983.PNG"
  ],

  seat: [
    "IMG_6004.PNG","IMG_6005.PNG","IMG_6006.PNG",
    "IMG_6007.PNG","IMG_6008.PNG","IMG_6009.PNG",
    "IMG_6010.PNG","IMG_6011.PNG","IMG_6012.PNG",
    "IMG_6013.PNG","IMG_6014.PNG","IMG_6015.PNG",
    "IMG_6016.PNG","IMG_6017.PNG","IMG_6018.PNG",
    "IMG_6019.PNG","IMG_6020.PNG","IMG_6021.PNG",
    "IMG_6022.PNG","IMG_6023.PNG"
  ],

  battery: [
    "IMG_5984.PNG","IMG_5985.PNG",
    "IMG_5988.PNG","IMG_7000.PNG"
  ],

  fenders: ["IMG_5989.PNG","IMG_5990.PNG","IMG_5991.PNG"],

  lights: ["IMG_5992.PNG"],

  accessories: [
    "IMG_6030.PNG","IMG_6031.PNG","IMG_6032.PNG",
    "IMG_6033.PNG","IMG_6034.PNG"
  ],

  brakes: ["IMG_6057.PNG","IMG_6058.PNG","IMG_6060.PNG"],

  chain: ["IMG_6061.PNG"],

  controller: ["Stock","BAC855","BAC2000","FarDriver"]
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
    "White","Red","Orange","Yellow","Lime","Green",
    "Blue","Purple","Black","Cyan/White",
    "White/Pink","Unlabeled Frame 12"
  ],

  frontForks: [
    "Silver Inverted","Inverted","Gold Inverted",
    "Silver Triple Clamp Normal",
    "Silver Triple Clamp + Silver Bottom",
    "Black Normal","Silver Bottom Normal","Bucklos"
  ],

  frontWheel: ["Black","Chrome"],
  rearWheel: ["Black","Chrome"],

  tires: [
    "LZRD Tires",
    "White Wall LZRD Tires",
    "SuperSucker Tires"
  ],

  motor: ["1350W","4,000W"],

  handlebars: [
    "Stock","Mountain Bike Bars","Harley Riser","ProTaper"
  ],

  seat: [
    "White","Black","Red","Orange","Yellow","Lime",
    "Green","Blue","Purple","Brown","Pink","Cyan",
    "Red/Black","Orange/Black","Yellow/Black",
    "Lime/Black","Blue/Black","Cyan/Black",
    "Purple/Black","Pink/Black"
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
    "Pedals","Rear Moto Pegs Silver","Silver Peg Swap",
    "Rear Moto Pegs Black","Black Peg Swap"
  ],

  brakes: [
    "Stock Tektro","UB Brakes","Magura Brakes"
  ],

  chain: ["Chain"],

  controller: ["Stock","BAC855","BAC2000","FarDriver"]
};

const performanceDatabase = {
  "Surron|1350W": {
    Stock: [20,1680],
    BAC855: [45,3500],
    BAC2000: [43,2200],
    FarDriver: [43,2200]
  },

  "Stock|1350W": {
    Stock: [20,1350],
    BAC855: [40,2000],
    BAC2000: [36,1900],
    FarDriver: [36,1900]
  },

  "Chi|1350W": {
    Stock: [20,2310],
    BAC855: [60,6500],
    BAC2000: [58,8000],
    FarDriver: [58,8000]
  },

  "Handleworks|1350W": {
    Stock: [20,1680],
    BAC855: [45,3500],
    BAC2000: [43,2200],
    FarDriver: [43,2200]
  },

  "Surron|4000W": {
    Stock: [20,1680],
    BAC855: [50,4800],
    BAC2000: [52,6600],
    FarDriver: [52,6600]
  },

  "Stock|4000W": {
    Stock: [20,1350],
    BAC855: [35,2000],
    BAC2000: [33,1900],
    FarDriver: [36,1900]
  },

  "Chi|4000W": {
    Stock: [20,2310],
    BAC855: [65,8300],
    BAC2000: [68,16000],
    FarDriver: [68,12000]
  },

  "Handleworks|4000W": {
    Stock: [20,1680],
    BAC855: [50,4800],
    BAC2000: [52,5400],
    FarDriver: [52,6600]
  }
};

let selectedParts = {};

let selectedColors = {
  hue: 0,
  saturation: 100,
  brightness: 100
};

let editingBikeId = null;

const allowedAccessoryPairs = [
  [0,1],[0,3],[1,2],[1,4],[3,4],[2,3]
];

/* =========================================
   IMAGE LAYERS
========================================= */

const layers = [
  {category:"brakes"},
  {category:"battery"},
  {category:"tires",position:"rear"},
  {category:"tires",position:"front"},
  {category:"rearWheel"},
  {category:"frontWheel"},
  {category:"motor"},
  {category:"chain"},
  {category:"frontForks"},
  {category:"fenders"},
  {category:"lights"},
  {category:"handlebars"},
  {category:"seat"},
  {category:"frame"},
  {category:"accessories"}
];

/* =========================================
   HELPERS
========================================= */

function getArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function imagePath(category, filename) {
  if (!folders[category]) return "";

  return new URL(
    "images/" + folders[category] + "/" + filename,
    document.baseURI
  ).href;
}

function getFrameFilter(colors) {
  return `
    hue-rotate(${Number(colors?.hue ?? 0)}deg)
    saturate(${Number(colors?.saturation ?? 100)}%)
    brightness(${Number(colors?.brightness ?? 100)}%)
  `.trim();
}

/* =========================================
   PERFORMANCE CALCULATOR
========================================= */

function getPerformanceStats(partsToCheck) {
  const zero = {topSpeed:0,wattage:0};

  if (!partsToCheck) return zero;

  const motorNames = {
    "IMG_5959.PNG":"1350W",
    "IMG_5993.PNG":"4000W"
  };

  const batteryNames = {
    "IMG_5984.PNG":"Surron",
    "IMG_5985.PNG":"Stock",
    "IMG_5988.PNG":"Chi",
    "IMG_7000.PNG":"Handleworks"
  };

  const motor = motorNames[partsToCheck.motor];
  const controller = partsToCheck.controller;

  const batteries = getArray(partsToCheck.battery);

  if (!motor || !controller || !batteries.length) {
    return zero;
  }

  let best = zero;

  for (const battery of batteries) {
    const batteryName = batteryNames[battery];

    if (!batteryName) continue;

    const combination =
      performanceDatabase[batteryName + "|" + motor];

    if (!combination || !combination[controller]) continue;

    const result = combination[controller];

    if (
      result[1] > best.wattage ||
      (result[1] === best.wattage && result[0] > best.topSpeed)
    ) {
      best = {
        topSpeed: result[0],
        wattage: result[1]
      };
    }
  }

  return best;
}

/* =========================================
   CANVAS POSITIONING
========================================= */

function getLayerPosition(category, position) {
  const positions = {
    frontForks: {
      left:"42%",top:"7%",width:"58%",height:"78%"
    },

    frontWheel: {
      left:"70%",top:"53%",width:"27%",height:"27%"
    },

    rearWheel: {
      left:"4%",top:"52%",width:"27%",height:"27%"
    },

    rearTire: {
      left:"1%",top:"48%",width:"34%",height:"34%"
    },

    frontTire: {
      left:"66.5%",top:"49%",width:"34%",height:"34%"
    },

    motor: {
      left:"5.5%",top:"52.5%",width:"24%",height:"24%"
    },

    handlebars: {
      left:"53.5%",top:"13%",width:"24%",height:"24%"
    },

    brakes: {
      left:"-2%",top:"-2%",width:"105%",height:"105%"
    },

    fenders: {
      left:"57.5%",top:"22%",width:"29%",height:"29%"
    },

    lights: {
      left:"64%",top:"27%",width:"10%",height:"10%"
    }
  };

  if (category === "tires") {
    return position === "rear"
      ? positions.rearTire
      : positions.frontTire;
  }

  return positions[category] || {
    left:"0%",top:"0%",width:"100%",height:"100%"
  };
}

/* =========================================
   BIKE CANVAS
========================================= */

function createBikeCanvas(parent, partsToShow, colorsToShow, thumbnail=false) {
  const canvas = document.createElement("div");

  canvas.className = thumbnail
    ? "bike-canvas bike-thumbnail"
    : "bike-canvas";

  Object.assign(canvas.style,{
    position:"relative",
    width:"100%",
    maxWidth:thumbnail ? "260px":"700px",
    aspectRatio:"1 / 1",
    margin:"auto",
    isolation:"isolate",
    overflow:"hidden"
  });

  layers.forEach((layer,layerIndex)=>{
    const category = layer.category;

    const selected = partsToShow?.[category];

    if (!selected) return;

    getArray(selected).forEach(filename=>{
      const source = imagePath(category,filename);

      if (!source) return;

      const position = getLayerPosition(category,layer.position);

      const image = document.createElement("img");

      image.src = source;
      image.alt = category;
      image.draggable = false;

      image.dataset.category = category;

      if (category === "tires") {
        image.dataset.position = layer.position;
      }

      Object.assign(image.style,{
        position:"absolute",
        left:position.left,
        top:position.top,
        width:position.width,
        height:position.height,
        objectFit:"contain",
        zIndex:String(layerIndex+1),
        pointerEvents:"none",
        userSelect:"none",
        maxWidth:"none"
      });

      if (category === "frame") {
        image.style.filter = getFrameFilter(colorsToShow);
      }

      image.onerror = ()=>{
        console.error("Image failed:",source);
      };

      canvas.appendChild(image);
    });
  });

  parent.appendChild(canvas);

  return canvas;
}

/* =========================================
   PREVIEW
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

  createBikeCanvas(holder,selectedParts,selectedColors);

  updatePerformanceDisplay();
}

function updatePerformanceDisplay() {
  const stats = getPerformanceStats(selectedParts);

  const speed = document.getElementById("preview-speed");
  const power = document.getElementById("preview-wattage");

  if (speed) speed.textContent = stats.topSpeed+" MPH";

  if (power) {
    power.textContent = stats.wattage.toLocaleString()+"W";
  }
}

/* =========================================
   FRAME COLOR
========================================= */

function changeFrameAdjustment() {
  const hue = document.getElementById("frame-hue");
  const sat = document.getElementById("frame-saturation");
  const bright = document.getElementById("frame-brightness");

  if (!hue || !sat || !bright) return;

  selectedColors = {
    hue:Number(hue.value),
    saturation:Number(sat.value),
    brightness:Number(bright.value)
  };

  updatePreview();
}

function resetSliderDisplay() {
  const hue = document.getElementById("frame-hue");
  const sat = document.getElementById("frame-saturation");
  const bright = document.getElementById("frame-brightness");

  if (hue) hue.value = selectedColors.hue;
  if (sat) sat.value = selectedColors.saturation;
  if (bright) bright.value = selectedColors.brightness;
}

function resetFrameAdjustments() {
  selectedColors = {
    hue:0,
    saturation:100,
    brightness:100
  };

  resetSliderDisplay();
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

  heading.textContent = {
    frontForks:"Front Forks",
    fenders:"Fenders + Plates"
  }[category] || category.replace(/([A-Z])/g," $1");

  container.appendChild(heading);

  const options = document.createElement("div");
  options.className = "part-options";

  parts[category].forEach((filename,index)=>{
    const option = document.createElement("button");

    option.type = "button";
    option.className = "part-option";

    if (category !== "controller") {
      const img = document.createElement("img");

      img.src = imagePath(category,filename);
      img.alt = optionNames[category]?.[index] || filename;

      option.appendChild(img);
    }

    const label = document.createElement("span");

    label.textContent =
      optionNames[category]?.[index] ||
      `Option ${index+1}`;

    option.appendChild(label);

    const current = selectedParts[category];

    const isSelected = Array.isArray(current)
      ? current.includes(filename)
      : current === filename;

    if (isSelected) option.classList.add("selected");

    option.onclick = ()=>{
      selectPart(category,filename,index);
    };

    options.appendChild(option);
  });

  container.appendChild(options);
}

/* =========================================
   SELECT PART
========================================= */

function selectPart(category,filename,index) {

  if (category === "controller") {
    selectedParts.controller =
      selectedParts.controller === filename
        ? undefined
        : filename;

    if (!selectedParts.controller) delete selectedParts.controller;
  }

  else if (category === "battery" || category === "accessories") {
    let current = getArray(selectedParts[category]);

    if (current.includes(filename)) {
      current = current.filter(item=>item!==filename);
    } else {
      if (current.length >= 2) {
        alert("You can only select two.");
        return;
      }

      if (current.length === 1) {
        const firstIndex = parts[category].indexOf(current[0]);

        if (category === "battery") {
          if (Math.abs(firstIndex-index)!==1) {
            alert("Choose two batteries next to each other.");
            return;
          }
        } else {
          const allowed = allowedAccessoryPairs.some(pair=>
            pair.includes(firstIndex)&&pair.includes(index)
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
  }

  else {
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

    return Array.isArray(saved)?saved:[];
  } catch(error) {
    console.error(error);
    return [];
  }
}

function storeSavedBikes(bikes) {
  try {
    localStorage.setItem("savedBikes",JSON.stringify(bikes));
    return true;
  } catch(error) {
    alert("Could not save bike.");
    return false;
  }
}

function createBikeData(name) {
  return {
    id:Date.now()+Math.random(),
    name,
    parts:JSON.parse(JSON.stringify(selectedParts)),
    colors:{...selectedColors},
    performance:getPerformanceStats(selectedParts)
  };
}

/* =========================================
   SAVE
========================================= */

function saveBike() {
  const bikes = getSavedBikes();

  if (editingBikeId !== null) {
    const bike = bikes.find(item=>item.id===editingBikeId);

    if (bike) {
      bike.parts = JSON.parse(JSON.stringify(selectedParts));
      bike.colors = {...selectedColors};
      bike.performance = getPerformanceStats(selectedParts);

      if (!storeSavedBikes(bikes)) return;

      showSavedBikes();
      updateEditingStatus();

      alert("Changes saved!");
      return;
    }
  }

  const name = prompt("What do you want to name your bike?");

  if (!name?.trim()) return;

  const bike = createBikeData(name.trim());

  bikes.push(bike);

  if (!storeSavedBikes(bikes)) return;

  editingBikeId = bike.id;

  showSavedBikes();
  updateEditingStatus();

  alert("Bike saved!");
}

function saveBikeAsNew() {
  const name = prompt("Name your new bike:");

  if (!name?.trim()) return;

  const bikes = getSavedBikes();
  const bike = createBikeData(name.trim());

  bikes.push(bike);

  if (!storeSavedBikes(bikes)) return;

  editingBikeId = bike.id;

  showSavedBikes();
  updateEditingStatus();

  alert("New bike saved!");
}

/* =========================================
   LOAD / EDIT
========================================= */

function loadBike(id) {
  const bike = getSavedBikes().find(item=>item.id===id);

  if (!bike) return;

  selectedParts = JSON.parse(JSON.stringify(bike.parts||{}));

  selectedColors = {
    hue:bike.colors?.hue??0,
    saturation:bike.colors?.saturation??100,
    brightness:bike.colors?.brightness??100
  };

  editingBikeId = bike.id;

  resetSliderDisplay();
  updatePreview();
  updateEditingStatus();

  window.scrollTo({top:0,behavior:"smooth"});
}

function renameBike(id) {
  const bikes = getSavedBikes();
  const bike = bikes.find(item=>item.id===id);

  if (!bike) return;

  const name = prompt("Enter a new name:",bike.name);

  if (!name?.trim()) return;

  bike.name = name.trim();

  if (!storeSavedBikes(bikes)) return;

  showSavedBikes();
  updateEditingStatus();
}

function deleteBike(id) {
  if (!confirm("Delete this bike?")) return;

  const bikes = getSavedBikes().filter(item=>item.id!==id);

  if (!storeSavedBikes(bikes)) return;

  if (editingBikeId===id) {
    editingBikeId=null;
    updateEditingStatus();
  }

  showSavedBikes();
}

/* =========================================
   GARAGE
========================================= */

function showSavedBikes() {
  const container = document.getElementById("saved-bikes");

  if (!container) return;

  container.innerHTML = "";

  const bikes = getSavedBikes();

  if (!bikes.length) {
    const empty = document.createElement("p");
    empty.textContent = "Your garage is empty. Save a bike to get started.";
    container.appendChild(empty);
    return;
  }

  bikes.forEach(bike=>{
    const card = document.createElement("div");
    card.className = "garage-card";

    const title = document.createElement("h3");
    title.textContent = bike.name;

    const preview = document.createElement("div");
    preview.className = "garage-bike-preview";

    createBikeCanvas(
      preview,
      bike.parts||{},
      bike.colors||{},
      true
    );

    const stats = getPerformanceStats(bike.parts||{});

    const performance = document.createElement("div");
    performance.className = "bike-performance";

    performance.innerHTML = `
      <div>TOP SPEED<strong>${stats.topSpeed} MPH</strong></div>
      <div>POWER<strong>${stats.wattage.toLocaleString()}W</strong></div>
    `;

    const components = document.createElement("div");
    components.className = "bike-components";

    const labels = {
      battery:{
        "IMG_5984.PNG":"Surron",
        "IMG_5985.PNG":"Stock",
        "IMG_5988.PNG":"Chi",
        "IMG_7000.PNG":"Handleworks"
      },
      motor:{
        "IMG_5959.PNG":"1350W",
        "IMG_5993.PNG":"4000W"
      }
    };

    const battery = getArray(bike.parts?.battery)
      .map(item=>labels.battery[item]||item)
      .join(" + ")||"None";

    components.textContent =
      "Battery: "+battery+
      " | Motor: "+(labels.motor[bike.parts?.motor]||"None")+
      " | Controller: "+(bike.parts?.controller||"None")+
      " | Tires: "+(getArray(bike.parts?.tires).length?"Equipped":"None");

    const buttons = document.createElement("div");
    buttons.className = "garage-buttons";

    const ride = document.createElement("button");
    ride.className = "ride-button";
    ride.textContent = "▶ RIDE";
    ride.onclick = ()=>RideGame.start(bike);

    const load = document.createElement("button");
    load.textContent = "Load / Edit";
    load.onclick = ()=>loadBike(bike.id);

    const rename = document.createElement("button");
    rename.textContent = "Rename";
    rename.onclick = ()=>renameBike(bike.id);

    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.className = "delete-button";
    remove.onclick = ()=>deleteBike(bike.id);

    buttons.append(ride,load,rename,remove);

    card.append(title,preview,performance,components,buttons);

    container.appendChild(card);
  });
}

/* =========================================
   EDITING STATUS
========================================= */

function updateEditingStatus() {
  const status = document.getElementById("editing-status");

  if (!status) return;

  const bike = getSavedBikes().find(item=>item.id===editingBikeId);

  status.textContent = bike
    ? "Editing: "+bike.name+" — Save Bike updates this build."
    : "Not currently editing a saved bike.";
}

/* =========================================
   INITIALIZE
========================================= */

function initializeBuilder() {
  ["frame-hue","frame-saturation","frame-brightness"].forEach(id=>{
    document.getElementById(id)?.addEventListener(
      "input",
      changeFrameAdjustment
    );
  });

  updatePreview();
  showSavedBikes();
  updateEditingStatus();

  console.log("SUPER73 Builder initialized.");
}

if (document.readyState==="loading") {
  document.addEventListener("DOMContentLoaded",initializeBuilder,{once:true});
} else {
  initializeBuilder();
}
