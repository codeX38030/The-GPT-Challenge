export type Category = "crop" | "soil" | "machinery" | "irrigation";
export type Severity = "high" | "medium" | "low" | "none";

export interface KnowledgeEntry {
  id: string;
  category: Category;
  title: string;
  symptoms: string[];
  causes: string[];
  solution: string[];
  prevention: string[];
  severity: Severity;
  isHealthy?: boolean;
  crops?: string[];
  tags: string[];
}

export const HEALTHY_CROP_RESULT: KnowledgeEntry = {
  id: "healthy_001",
  category: "crop",
  title: "Healthy Crop — No Disease Detected",
  symptoms: [
    "Leaves are uniformly green with no discoloration",
    "No spots, lesions, or abnormal growth patterns",
    "Plant structure appears vigorous and upright",
    "No pest presence or feeding damage visible",
  ],
  causes: [],
  solution: [
    "Continue current care routine — it's working well",
    "Maintain regular watering schedule",
    "Continue balanced fertilization as per schedule",
    "Keep monitoring weekly for any early signs",
  ],
  prevention: [
    "Inspect plants every 7–10 days for early detection",
    "Maintain proper plant spacing for air circulation",
    "Rotate crops each season to prevent soil-borne diseases",
    "Keep field edges clean to reduce pest harboring",
    "Record current conditions for future reference",
  ],
  severity: "none",
  isHealthy: true,
  tags: ["healthy", "normal", "no disease", "good condition"],
};

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // CROP DISEASES
  {
    id: "c001",
    category: "crop",
    title: "Leaf Blast (Rice)",
    symptoms: [
      "Diamond-shaped spots on leaves",
      "Gray-white lesions with dark borders",
      "Leaves turning yellow then brown",
      "Withering of leaf tips",
    ],
    causes: [
      "Fungus Magnaporthe oryzae",
      "High humidity above 90%",
      "Night temperature 17–22°C",
      "Excessive nitrogen application",
    ],
    solution: [
      "Apply Tricyclazole 75% WP at 6g per 10L water",
      "Spray Isoprothiolane 40% EC at 1.5ml per liter",
      "Remove and destroy infected plant parts",
      "Avoid waterlogging in fields",
      "Drain excess water from fields",
    ],
    prevention: [
      "Use resistant varieties like Swarna Sub1",
      "Apply silicon fertilizer to strengthen cell walls",
      "Maintain balanced nitrogen levels",
      "Avoid dense planting — maintain proper spacing",
      "Seed treatment with fungicide before sowing",
    ],
    severity: "high",
    crops: ["Rice", "Paddy"],
    tags: ["blast", "rice", "fungal", "leaf spots", "brown", "gray lesions"],
  },
  {
    id: "c002",
    category: "crop",
    title: "Powdery Mildew",
    symptoms: [
      "White powdery coating on leaves",
      "Yellowing under white patches",
      "Leaf distortion and curling",
      "Early leaf drop",
    ],
    causes: [
      "Fungus Erysiphe sp.",
      "Low humidity with warm days",
      "Poor air circulation",
      "Overcrowding of plants",
    ],
    solution: [
      "Spray Sulfur 80% WP at 25g per 10L water",
      "Apply Myclobutanil 10% WP at 10g per 10L",
      "Use neem oil spray (5ml per liter) as organic option",
      "Remove heavily infected leaves immediately",
      "Improve plant spacing for air flow",
    ],
    prevention: [
      "Plant resistant varieties",
      "Avoid overhead irrigation",
      "Maintain plant spacing for ventilation",
      "Apply preventive sulfur spray in high-risk season",
      "Avoid excessive nitrogen fertilization",
    ],
    severity: "medium",
    crops: ["Wheat", "Grapes", "Cucurbits", "Peas"],
    tags: ["powdery", "mildew", "white powder", "fungal", "leaf coating"],
  },
  {
    id: "c003",
    category: "crop",
    title: "Early Blight (Tomato/Potato)",
    symptoms: [
      "Dark brown circular spots with concentric rings",
      "Yellow halo around spots",
      "Lower leaves affected first",
      "Stem lesions",
    ],
    causes: [
      "Fungus Alternaria solani",
      "Warm humid weather 24–29°C",
      "Plant stress or nutrient deficiency",
      "Splashing rain or irrigation",
    ],
    solution: [
      "Apply Mancozeb 75% WP at 25g per 10L water",
      "Spray Chlorothalonil 75% WP at 20g per 10L",
      "Remove infected leaves and destroy",
      "Increase potassium fertilizer application",
      "Spray copper-based fungicide as protective measure",
    ],
    prevention: [
      "Crop rotation — avoid tomato/potato in same field",
      "Use certified disease-free seeds",
      "Mulch soil to prevent splash dispersal",
      "Avoid wetting foliage during irrigation",
      "Plant spacing minimum 45cm between plants",
    ],
    severity: "high",
    crops: ["Tomato", "Potato"],
    tags: [
      "early blight",
      "alternaria",
      "tomato",
      "potato",
      "brown spots",
      "concentric rings",
    ],
  },
  {
    id: "c004",
    category: "crop",
    title: "Aphid Infestation",
    symptoms: [
      "Curled or distorted leaves",
      "Sticky honeydew on leaves",
      "Black sooty mold on surfaces",
      "Yellowing new growth",
      "Visible clusters of tiny insects",
    ],
    causes: [
      "Aphid species (Myzus persicae etc.)",
      "High nitrogen in soil",
      "Absence of natural predators",
      "Dry weather conditions",
    ],
    solution: [
      "Spray Imidacloprid 17.8% SL at 0.3ml per liter",
      "Apply insecticidal soap at 5ml per liter",
      "Use neem oil 5ml per liter with soap emulsifier",
      "Release ladybird beetles as biological control",
      "Strong water jet to dislodge aphids from plants",
    ],
    prevention: [
      "Encourage natural predators — avoid broad-spectrum pesticides",
      "Reflective mulches repel aphids",
      "Remove weeds that harbor aphids",
      "Monitor plants weekly in early season",
      "Balanced fertilization — avoid excess nitrogen",
    ],
    severity: "medium",
    crops: ["Vegetables", "Pulses", "Oilseeds", "Cotton"],
    tags: [
      "aphid",
      "insect",
      "pest",
      "curled leaves",
      "sticky",
      "small insects",
      "yellow",
    ],
  },
  {
    id: "c005",
    category: "crop",
    title: "Nitrogen Deficiency",
    symptoms: [
      "Pale yellow-green leaves starting from older leaves",
      "Stunted growth",
      "Thin weak stems",
      "Reduced tillering in cereals",
      "Early maturity",
    ],
    causes: [
      "Insufficient nitrogen in soil",
      "Waterlogged soil reducing nitrogen uptake",
      "Sandy soil with poor retention",
      "High pH soil locking nutrients",
    ],
    solution: [
      "Apply urea 46% N at 20–25 kg/acre as top dressing",
      "Use ammonium sulfate for alkaline soils",
      "Foliar spray of 2% urea solution",
      "Apply liquid fertilizer near root zone",
      "Check and correct soil pH to 6.0–7.0",
    ],
    prevention: [
      "Soil test before sowing and apply as per recommendation",
      "Split nitrogen application — not all at once",
      "Use slow-release nitrogen fertilizers",
      "Green manuring with legumes in rotation",
      "Maintain organic matter in soil",
    ],
    severity: "medium",
    crops: ["All crops"],
    tags: [
      "nitrogen deficiency",
      "yellow leaves",
      "pale",
      "stunted",
      "nutrient",
      "NPK",
    ],
  },
  {
    id: "c006",
    category: "crop",
    title: "Stem Borer (Sugarcane/Rice)",
    symptoms: [
      "Dead heart in young plants",
      "White ear in paddy",
      "Pinholes in stems",
      "Frass (insect excreta) inside stem",
      "Wilting of central shoot",
    ],
    causes: [
      "Chilo suppressalis moth larvae",
      "High humidity periods",
      "Dense crop stands",
      "Ratooning without field sanitation",
    ],
    solution: [
      "Apply Chlorpyriphos 20% EC at 2ml per liter",
      "Use Carbofuran 3G granules at 20 kg/acre in soil",
      "Trichogramma biological control — release 50,000/acre",
      "Pheromone traps for adult moth monitoring",
      "Cut and destroy affected shoots below water level",
    ],
    prevention: [
      "Early sowing to escape peak pest period",
      "Avoid ratooning in heavily infested fields",
      "Burn crop residues after harvest",
      "Maintain field sanitation between seasons",
      "Use resistant varieties where available",
    ],
    severity: "high",
    crops: ["Rice", "Sugarcane", "Maize"],
    tags: ["stem borer", "dead heart", "borer", "hole", "larvae", "caterpillar"],
  },
  {
    id: "c007",
    category: "crop",
    title: "Downy Mildew",
    symptoms: [
      "Yellow angular patches on upper leaf surface",
      "Purple-gray downy growth on underside",
      "Rapid wilting in humid conditions",
      "Brown necrotic patches",
    ],
    causes: [
      "Oomycete Plasmopara or Sclerospora sp.",
      "Cool temperatures 15–20°C",
      "High moisture and fog",
      "Poor drainage",
    ],
    solution: [
      "Spray Metalaxyl + Mancozeb 72% WP at 25g per 10L",
      "Apply Fosetyl Aluminium 80% WP at 30g per 10L",
      "Remove infected plant material immediately",
      "Improve field drainage",
      "Avoid overhead irrigation in evening",
    ],
    prevention: [
      "Use resistant varieties",
      "Seed treatment with Metalaxyl 35% WS",
      "Crop rotation with non-host crops",
      "Ensure good drainage in fields",
      "Avoid planting in frost pockets",
    ],
    severity: "high",
    crops: ["Grapes", "Cucumber", "Millet", "Maize"],
    tags: [
      "downy mildew",
      "yellow patches",
      "purple growth",
      "underleaf",
      "oomycete",
    ],
  },
  {
    id: "c008",
    category: "crop",
    title: "Whitefly Infestation",
    symptoms: [
      "Small white flying insects on underside of leaves",
      "Yellowing and wilting of leaves",
      "Sticky honeydew deposit",
      "Sooty mold growth",
      "Virus transmission signs",
    ],
    causes: [
      "Bemisia tabaci or Trialeurodes vaporariorum",
      "Hot dry weather",
      "Over-use of pesticides killing natural enemies",
      "High nitrogen fertilization",
    ],
    solution: [
      "Spray Thiamethoxam 25% WG at 3g per 10L",
      "Apply Spiromesifen 22.9% SC at 1ml per liter",
      "Neem oil 5ml per liter as organic option",
      "Yellow sticky traps — 15 per acre",
      "Reflective silver mulch to repel adults",
    ],
    prevention: [
      "Monitor with yellow sticky traps from early stage",
      "Remove infested leaves",
      "Avoid excessive nitrogen",
      "Introduce Encarsia parasitoid in greenhouses",
      "Destroy crop residues promptly after harvest",
    ],
    severity: "medium",
    crops: ["Cotton", "Tomato", "Chilli", "Soybean"],
    tags: [
      "whitefly",
      "white insects",
      "yellow leaves",
      "sticky",
      "virus",
      "small flies",
    ],
  },

  // SOIL PROBLEMS
  {
    id: "s001",
    category: "soil",
    title: "Soil Salinity",
    symptoms: [
      "White salt crust on soil surface",
      "Plants wilting despite watering",
      "Leaf tip burn",
      "Stunted germination",
      "Dry crusty soil patches",
    ],
    causes: [
      "Excess irrigation with saline water",
      "Poor drainage causing salt buildup",
      "Over-fertilization with chemical fertilizers",
      "Seawater intrusion in coastal areas",
    ],
    solution: [
      "Apply gypsum (calcium sulfate) 200–500 kg/acre",
      "Deep leaching irrigation — flood and drain repeatedly",
      "Install proper drainage system",
      "Add organic matter — 5–10 tonnes FYM per acre",
      "Use salt-tolerant crop varieties for one season",
    ],
    prevention: [
      "Test irrigation water quality regularly",
      "Maintain proper drainage in fields",
      "Avoid over-irrigation — use drip irrigation",
      "Periodic soil testing for EC levels",
      "Practice crop rotation with salt-tolerant crops",
    ],
    severity: "high",
    tags: [
      "salinity",
      "white crust",
      "salt",
      "wilting",
      "coastal",
      "salty soil",
      "EC",
    ],
  },
  {
    id: "s002",
    category: "soil",
    title: "Soil Compaction",
    symptoms: [
      "Water pooling on surface",
      "Poor root penetration",
      "Stunted plant growth",
      "Roots growing horizontally near surface",
      "Hard crust on soil surface",
    ],
    causes: [
      "Heavy machinery traffic on wet soil",
      "Repeated tillage at same depth",
      "Low organic matter",
      "Cattle grazing on wet soil",
      "Rainfall impact on bare soil",
    ],
    solution: [
      "Deep plowing with subsoiler to 30–45cm depth",
      "Add organic matter — compost or farmyard manure 5 tonnes/acre",
      "Grow cover crops like radish or rye to break compaction",
      "Avoid field operations when soil is wet",
      "Chisel plowing to break hardpan",
    ],
    prevention: [
      "Establish permanent traffic lanes for machinery",
      "Minimum tillage practices",
      "Maintain minimum 3% organic matter in soil",
      "Avoid heavy equipment on wet soils",
      "Grow deep-rooted green manure crops",
    ],
    severity: "medium",
    tags: [
      "compaction",
      "hard soil",
      "pooling water",
      "poor drainage",
      "roots",
      "hardpan",
    ],
  },
  {
    id: "s003",
    category: "soil",
    title: "Iron Deficiency (Chlorosis)",
    symptoms: [
      "Yellowing between leaf veins while veins stay green",
      "New leaves most affected",
      "Small leaf size",
      "Poor fruit development",
      "Alkaline soil conditions",
    ],
    causes: [
      "High soil pH above 7.5",
      "Waterlogged conditions",
      "High phosphorus reducing iron uptake",
      "Excess calcium in soil",
      "Calcareous soils",
    ],
    solution: [
      "Foliar spray FeSO4 (ferrous sulfate) 5g per liter water",
      "Apply iron chelate (Fe-EDTA) at 2–4 kg/acre",
      "Acidify soil with elemental sulfur 100–200 kg/acre",
      "Mix sulfuric acid with irrigation water (use carefully)",
      "Apply iron sulfate to soil before planting",
    ],
    prevention: [
      "Maintain soil pH 6.0–6.5 for maximum iron availability",
      "Avoid over-irrigation causing waterlogging",
      "Balance phosphorus application",
      "Add organic matter to improve iron availability",
      "Regular soil and tissue testing",
    ],
    severity: "medium",
    tags: [
      "iron deficiency",
      "chlorosis",
      "yellow between veins",
      "interveinal",
      "alkaline soil",
      "pH",
    ],
  },
  {
    id: "s004",
    category: "soil",
    title: "Soil Acidity",
    symptoms: [
      "Aluminum and manganese toxicity symptoms",
      "Poor nodulation in legumes",
      "Purple coloration of leaves",
      "Stunted root growth",
      "pH below 5.5",
    ],
    causes: [
      "Acid rain",
      "Long-term use of ammonium-based fertilizers",
      "Leaching of basic cations",
      "High rainfall areas",
      "Waterlogging",
    ],
    solution: [
      "Apply agricultural lime (CaCO3) 200–500 kg/acre based on soil test",
      "Use dolomite lime if magnesium is also deficient",
      "Apply slaked lime 100–200 kg/acre for faster action",
      "Incorporate lime deep into root zone",
      "Re-test soil pH after 6 months",
    ],
    prevention: [
      "Regular soil pH testing every 2 years",
      "Use neutral or alkaline fertilizers",
      "Lime application every 3–5 years as maintenance",
      "Organic matter helps buffer pH",
      "Avoid over-application of ammonium fertilizers",
    ],
    severity: "high",
    tags: [
      "acidity",
      "acid soil",
      "low pH",
      "lime",
      "aluminum toxicity",
      "purple leaves",
    ],
  },
  {
    id: "s005",
    category: "soil",
    title: "Phosphorus Deficiency",
    symptoms: [
      "Purple or reddish discoloration of stems and undersides",
      "Poor root development",
      "Delayed maturity",
      "Dark green or blue-green leaves",
      "Weak stems",
    ],
    causes: [
      "Low soil phosphorus",
      "Acid soil reducing phosphorus availability",
      "Cold soil temperatures",
      "High iron or aluminum in soil fixing phosphorus",
      "Waterlogged conditions",
    ],
    solution: [
      "Apply SSP (Single Super Phosphate) 50 kg/acre",
      "Use DAP (Diammonium Phosphate) 25 kg/acre",
      "Foliar spray of 0.5% potassium dihydrogen phosphate",
      "Apply phosphate biofertilizers like PSB",
      "Correct soil pH to 6.0–7.0 range",
    ],
    prevention: [
      "Soil test for phosphorus before sowing",
      "Band placement of phosphate fertilizer near seed",
      "Use mycorrhizal inoculants to improve phosphorus uptake",
      "Maintain adequate soil pH",
      "Apply rock phosphate in acidic soils",
    ],
    severity: "medium",
    crops: ["All crops"],
    tags: [
      "phosphorus deficiency",
      "purple leaves",
      "red stem",
      "poor root",
      "slow growth",
      "dark green",
    ],
  },

  // MACHINERY ISSUES
  {
    id: "m001",
    category: "machinery",
    title: "Engine Knocking Sound",
    symptoms: [
      "Metallic banging or knocking from engine",
      "Low power output",
      "Engine vibration",
      "Sound increases with RPM",
      "Smoke from exhaust",
    ],
    causes: [
      "Low engine oil level or pressure",
      "Worn connecting rod bearings",
      "Piston slap due to worn pistons",
      "Detonation from low-quality fuel",
      "Overheating engine",
    ],
    solution: [
      "Stop engine immediately — check oil level",
      "Add engine oil if low — use correct grade (SAE 40 or as specified)",
      "Check oil pressure warning light",
      "Inspect coolant level and radiator",
      "Professional inspection of bearings and pistons needed",
      "Replace connecting rod bearings if worn",
    ],
    prevention: [
      "Check engine oil level daily before starting",
      "Change oil every 250 operating hours",
      "Use correct fuel grade recommended by manufacturer",
      "Check coolant level weekly",
      "Warm up engine 5 minutes before full load",
    ],
    severity: "high",
    tags: [
      "knocking",
      "banging",
      "engine noise",
      "low oil",
      "bearing",
      "mechanical sound",
    ],
  },
  {
    id: "m002",
    category: "machinery",
    title: "Vibration / Excessive Shaking",
    symptoms: [
      "Unusual vibration during operation",
      "Steering wheel shaking",
      "Uneven operation",
      "Loosening of bolts over time",
      "Driver fatigue from vibration",
    ],
    causes: [
      "Unbalanced or damaged blades (tractor implements)",
      "Worn or missing wheel weights",
      "Loose wheel nuts",
      "Damaged bearings in PTO shaft",
      "Uneven tire pressure",
    ],
    solution: [
      "Stop machine — check and tighten all visible bolts and nuts",
      "Check tire pressure — inflate to recommended PSI",
      "Inspect and balance/replace blades if bent",
      "Check PTO shaft bearings for play",
      "Inspect wheel hubs for wobble",
    ],
    prevention: [
      "Check tire pressure weekly",
      "Inspect blades before each use",
      "Lubricate bearings as per schedule",
      "Check all fasteners after first 10 hours of new season",
      "Keep spare blade set balanced and ready",
    ],
    severity: "medium",
    tags: [
      "vibration",
      "shaking",
      "wobble",
      "unbalanced",
      "rough operation",
      "rattling",
    ],
  },
  {
    id: "m003",
    category: "machinery",
    title: "Black Smoke from Exhaust",
    symptoms: [
      "Heavy black smoke from exhaust pipe",
      "Reduced engine power",
      "High fuel consumption",
      "Soot deposits around exhaust",
      "Smell of unburned diesel",
    ],
    causes: [
      "Overloaded engine",
      "Dirty or clogged air filter",
      "Faulty fuel injectors",
      "Wrong injection timing",
      "Worn piston rings allowing oil burning",
    ],
    solution: [
      "Clean or replace air filter immediately",
      "Reduce engine load if overloaded",
      "Check and clean fuel injectors",
      "Adjust injection timing per service manual",
      "Have injectors tested and cleaned at workshop",
    ],
    prevention: [
      "Clean air filter every 50–100 hours or after dusty operation",
      "Replace air filter every 500 hours",
      "Service injectors every 1000 hours",
      "Avoid prolonged overloading of engine",
      "Use clean quality diesel fuel",
    ],
    severity: "medium",
    tags: [
      "black smoke",
      "exhaust smoke",
      "diesel smoke",
      "air filter",
      "injector",
      "pollution",
    ],
  },
  {
    id: "m004",
    category: "machinery",
    title: "Engine Overheating",
    symptoms: [
      "Temperature gauge in red zone",
      "Steam from radiator",
      "Boiling coolant sound",
      "Loss of power",
      "Warning light on dashboard",
    ],
    causes: [
      "Low coolant level",
      "Blocked radiator fins",
      "Faulty thermostat",
      "Broken water pump",
      "Blocked coolant passages",
    ],
    solution: [
      "STOP engine immediately — do NOT remove radiator cap when hot",
      "Wait 20–30 minutes for cooling before inspection",
      "Check coolant level — add coolant if low (when cool)",
      "Clean radiator fins with compressed air or water",
      "Check thermostat function",
      "Inspect water pump belt tension and condition",
    ],
    prevention: [
      "Check coolant level daily",
      "Clean radiator weekly during harvest season",
      "Inspect belts every 250 hours",
      "Replace coolant every 2 years",
      "Do not work in peak afternoon heat when possible",
    ],
    severity: "high",
    tags: [
      "overheating",
      "hot engine",
      "steam",
      "radiator",
      "coolant",
      "temperature warning",
    ],
  },
  {
    id: "m005",
    category: "machinery",
    title: "Hydraulic System Failure",
    symptoms: [
      "Implements not lifting or lifting slowly",
      "Jerky implement movement",
      "Oil leak under tractor",
      "Low hydraulic oil level",
      "Groaning hydraulic noise",
    ],
    causes: [
      "Low hydraulic oil",
      "Worn hydraulic pump",
      "Blocked hydraulic filter",
      "Leaking hydraulic cylinders or hoses",
      "Air in hydraulic system",
    ],
    solution: [
      "Check hydraulic oil level — fill to correct level",
      "Inspect hydraulic hoses for leaks or cracks",
      "Replace hydraulic filter — typically every 500 hours",
      "Bleed air from system by cycling implement several times",
      "Check and tighten hydraulic connections",
    ],
    prevention: [
      "Check hydraulic oil level weekly",
      "Replace hydraulic oil every 1000 hours",
      "Inspect hoses for wear before season",
      "Replace hydraulic filter as per schedule",
      "Keep hydraulic breather clean",
    ],
    severity: "high",
    tags: [
      "hydraulic",
      "implement not lifting",
      "oil leak",
      "hydraulic pump",
      "jerky movement",
    ],
  },
  {
    id: "m006",
    category: "machinery",
    title: "Thresher/Harvester Blockage",
    symptoms: [
      "Machine stops suddenly",
      "Unusual grinding sound",
      "Crop material wrapped around drum",
      "Excessive crop loss",
      "Belt slipping or burning smell",
    ],
    causes: [
      "Overfeeding wet or tangled crop",
      "Belt tension too low",
      "Damaged sieves",
      "Incorrectly set drum speed",
      "Worn concaves",
    ],
    solution: [
      "Stop machine immediately",
      "Disengage PTO before clearing blockage",
      "Manually remove blocked crop material",
      "Check and adjust belt tension",
      "Reduce feed rate for wet crops",
    ],
    prevention: [
      "Harvest crop at correct moisture — not too wet",
      "Maintain consistent feeding rate",
      "Check belt tension before each day",
      "Clean machine after each use",
      "Adjust settings for each crop type",
    ],
    severity: "medium",
    tags: [
      "thresher",
      "blockage",
      "harvester",
      "blocked",
      "belt",
      "drum",
      "clogged",
    ],
  },

  // IRRIGATION PROBLEMS
  {
    id: "i001",
    category: "irrigation",
    title: "Drip Emitter Clogging",
    symptoms: [
      "Uneven water distribution",
      "Some plants wilting while others fine",
      "No drip from certain emitters",
      "Reduced flow rate overall",
      "Algae or deposits in emitters",
    ],
    causes: [
      "Sand or debris in water supply",
      "Algae growth in pipes",
      "Chemical precipitation from fertilizer injection",
      "Hard water mineral deposits",
      "Filter failure",
    ],
    solution: [
      "Flush all lateral pipes by opening end caps",
      "Remove and clean clogged emitters with needle",
      "Acid flush — diluted HCl 0.1% through system for 30 minutes",
      "Chlorine flush — 10ppm chlorine water circulation",
      "Replace severely clogged emitters",
    ],
    prevention: [
      "Install properly sized disc or screen filter (120–200 mesh)",
      "Clean filters every 2–3 days during operation",
      "Chlorinate system weekly during season",
      "Flush laterals every 15 days",
      "Use compatible fertilizers to avoid precipitation",
    ],
    severity: "medium",
    tags: [
      "drip",
      "emitter",
      "clogging",
      "blocked drip",
      "uneven irrigation",
      "filter",
    ],
  },
  {
    id: "i002",
    category: "irrigation",
    title: "Waterlogging",
    symptoms: [
      "Standing water in field for >24 hours",
      "Yellowing and wilting of plants",
      "Root rot symptoms",
      "Sour or anaerobic smell from soil",
      "Soil turning grey or blue-grey",
    ],
    causes: [
      "Heavy rainfall exceeding drainage capacity",
      "Poor drainage design",
      "Blocked drainage channels",
      "Impermeable hardpan layer",
      "Over-irrigation",
    ],
    solution: [
      "Open all drainage channels immediately",
      "Install raised beds for next season",
      "Pump out water if possible",
      "Add gypsum to improve drainage",
      "Apply Potassium at 13 kg/acre to reduce stress",
    ],
    prevention: [
      "Design proper field drainage with 0.2–0.5% slope",
      "Maintain field drainage channels",
      "Avoid over-irrigation — schedule based on crop needs",
      "Install subsurface drainage in problem areas",
      "Grow raised beds for sensitive crops",
    ],
    severity: "high",
    tags: [
      "waterlogging",
      "flooding",
      "standing water",
      "drainage",
      "root rot",
      "yellow plants",
      "wet soil",
    ],
  },
  {
    id: "i003",
    category: "irrigation",
    title: "Sprinkler Malfunction",
    symptoms: [
      "Uneven water distribution pattern",
      "Dry patches in field",
      "Sprinkler not rotating",
      "Water spraying in wrong direction",
      "Blocked nozzles",
    ],
    causes: [
      "Worn sprinkler nozzle",
      "Low water pressure",
      "Debris in sprinkler head",
      "Bent or damaged riser pipe",
      "Incorrect nozzle size for pressure",
    ],
    solution: [
      "Inspect and clean nozzle openings with pin",
      "Check and adjust system pressure — should be 2.0–3.5 bar",
      "Replace worn or damaged nozzles",
      "Check riser pipes for bending or leaks",
      "Replace entire sprinkler head if faulty",
    ],
    prevention: [
      "Filter all irrigation water before sprinkler",
      "Check sprinkler operation at season start",
      "Replace nozzles every 3–5 seasons",
      "Maintain system pressure within specification",
      "Flush main lines before connecting sprinklers",
    ],
    severity: "medium",
    tags: [
      "sprinkler",
      "nozzle",
      "uneven watering",
      "dry patches",
      "pressure",
      "rotating sprinkler",
    ],
  },
  {
    id: "i004",
    category: "irrigation",
    title: "Canal/Channel Seepage Loss",
    symptoms: [
      "Water level dropping faster than expected",
      "Wet areas beside canal",
      "Less water reaching end of field",
      "Soft soggy banks",
      "Animal burrows in banks",
    ],
    causes: [
      "Earthen canal without lining",
      "Cracks in concrete lining",
      "Animal damage to embankments",
      "Poor construction standards",
      "Settlement of embankment",
    ],
    solution: [
      "Apply clay puddle lining to earthen sections",
      "Repair concrete cracks with cement slurry + sealant",
      "Block animal burrows and reinforce embankments",
      "Apply plastic lining sheet in critical sections",
      "Maintain water level — avoid running canal nearly empty",
    ],
    prevention: [
      "Concrete or brick line main canals",
      "Regular inspection of all channel sections",
      "Vegetation management on canal banks",
      "Rodent control program near canals",
      "Annual desilting and maintenance",
    ],
    severity: "medium",
    tags: [
      "canal",
      "seepage",
      "water loss",
      "leaking canal",
      "channel",
      "drainage loss",
    ],
  },
];

export function searchKnowledge(
  query: string,
  category?: Category
): KnowledgeEntry[] {
  const q = query.toLowerCase().trim();
  if (!q && !category) return KNOWLEDGE_BASE;

  return KNOWLEDGE_BASE.filter((entry) => {
    const matchesCategory = !category || entry.category === category;
    if (!q) return matchesCategory;

    const searchText = [
      entry.title,
      ...entry.symptoms,
      ...entry.causes,
      ...entry.tags,
      ...(entry.crops || []),
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchText.includes(q);
  });
}

export type DiagnosisType = "crop" | "sound";

export interface DiagnosisResult {
  id: string;
  type: DiagnosisType;
  timestamp: number;
  knowledge: KnowledgeEntry;
  confidence: number;
  imageUri?: string;
  isHealthy?: boolean;
}

// ─────────────────────────────────────────────────────────
// Offline AI Engine — On-device inference simulation
// In production: replaces random selection with AnyWhere SDK
// GitHub: https://github.com/RunanywhereAI/runanywhere-sdks
// ─────────────────────────────────────────────────────────

/**
 * Diagnose a crop/soil image using the on-device AI engine.
 *
 * Production integration point:
 *   const sdk = new AnyWhereSDK({ modelPath: 'crop_disease_v2.tflite' });
 *   const result = await sdk.classifyImage(imageUri);
 *   return mapResultToKnowledge(result.label);
 *
 * For demo: Uses image URI hash + probability to simulate healthy vs diseased.
 * - Images with "gallery" or certain patterns → higher healthy probability
 * - 35% chance of returning "Healthy Crop" result
 * - 65% chance of returning a specific disease
 */
export function diagnoseCropImage(imageUri: string): {
  knowledge: KnowledgeEntry;
  isHealthy: boolean;
} {
  // Simulate healthy detection: ~35% chance of healthy result
  // In a real model, pixel analysis would determine this
  const uriHash = imageUri
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const deterministicRandom = ((uriHash * 7 + 13) % 100) / 100;

  if (deterministicRandom < 0.35) {
    return { knowledge: HEALTHY_CROP_RESULT, isHealthy: true };
  }

  const cropSoilEntries = KNOWLEDGE_BASE.filter(
    (e) => e.category === "crop" || e.category === "soil"
  );
  const idx = uriHash % cropSoilEntries.length;
  return { knowledge: cropSoilEntries[idx], isHealthy: false };
}

/**
 * Diagnose machinery sound using on-device MFCC + classifier.
 *
 * Production integration point:
 *   const sdk = new AnyWhereSDK({ modelPath: 'machinery_sound_v1.tflite' });
 *   const mfcc = extractMFCC(audioBuffer, sampleRate: 16000, numCoeffs: 40);
 *   const result = await sdk.classify(mfcc);
 *   return mapResultToKnowledge(result.label);
 */
export function diagnoseMachinerySound(durationMs: number): KnowledgeEntry {
  const machineryEntries = KNOWLEDGE_BASE.filter(
    (e) => e.category === "machinery"
  );
  const idx = Math.floor((durationMs / 1000) * 3) % machineryEntries.length;
  return machineryEntries[Math.max(0, idx)];
}
