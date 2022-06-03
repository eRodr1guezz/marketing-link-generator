let therapeuticAreas = [
  { param: 1000, label: "Allergists & Clinical Immunologists" },
  { param: 1100, label: "Cardiologists" },
  { param: 1120, label: "Cardiac Electrophysiologists" },
  { param: 1130, label: "Cardiology, Interventional" },
  { param: 1200, label: "Critical Care Specialists" },
  { param: 1300, label: "Dermatologists" },
  { param: 1400, label: "Diabetologists & Endocrinologists" },
  { param: 1500, label: "Gastroenterologists" },
  { param: 1600, label: "Hem/Onc Specialists" },
  { param: 1610, label: "Hematologists" },
  { param: 1620, label: "Surgical Oncologists" },
  { param: 1630, label: "Medical Oncologists" },
  { param: 1700, label: "ID/HIV Specialists" },
  { param: 1710, label: "HIV/AIDS Specialists" },
  { param: 1720, label: "Infectious Diseases" },
  { param: 1800, label: "Medical Geneticists" },
  { param: 1900, label: "Neurologists" },
  { param: 2000, label: "Obstetricians & Gynecologists" },
  { param: 2100, label: "Ophthalmologists" },
  {
    param: 2200,
    label: "Orthopedists & Orthopedic Surgeons",
    children: [
      {
        childID: 2210,
        label: "Physical Medicine & Rehabilitation Specialists",
      },
    ],
  },
  { param: 2400, label: "Primary Care Physicians" },
  { param: 2410, label: "Family Practitioners" },
  { param: 2420, label: "General Internists" },
  { param: 2430, label: "General Practitioners" },
  { param: 2421, label: "Nephrologists" },
  { param: 2500, label: "Public Health & Preventive Medicine Specialists " },
  { param: 2600, label: "Psychiatrists" },
  { param: 2700, label: "Pulmonologists" },
];

let businessUnitSubCategories = [
  { label: "Marketing", param: "mrk" },
  { label: "Education", param: "edu" },
  { label: "MedAffairs", param: "ma" },
  { label: "Proprietary", param: "prop" },
  { label: "Professional", param: "prof" },
  { label: "VCS", param: "vcs" },
  { label: "Partner", param: "part" },
  { label: "Other", param: "oth" },
];

let businessUnits = [
  {
    label: "MedscapeLive!",
    param: "lbu",
    excluded: ['prop'],
    subcategories: businessUnitSubCategories,
  },
  {
    label: "MDEdge",
    param: "mde",
    excluded: ['prop'],
    subcategories: businessUnitSubCategories,
  },
  {
    label: "Medscape",
    param: "msc",
    excluded: ['prop'],
    subcategories: businessUnitSubCategories,
  },
  {
    label: "Sonaworks",
    param: "sw",
    excluded: ['prop'],
    subcategories: businessUnitSubCategories,
  },
];

businessUnits.map((unit, i, arr) => arr.excluded !== unit.subcategories[i].param ? unit : null)


let drivers = [
  {
    driver: "Email",
    param: "em",
    type: [
      { param: "int", label: "Internal" },
      { param: "ext", label: "External" },
    ],
    details: null, //in the case of an email, the YYMMDD ie. 220323
    custom1: {
      type: [],
    },
    custom2: {
      type: [],
    },
  },
  {
    driver: "Banners",
    param: "ban",
    type: [
      { param: "app", label: "App Push Notification" },
      { param: "atp", label: "Activity Tracker Promo" },
      { param: "lb", label: "Leaderboard" },
      // { param: 'mpu', label: '' },
      { param: "co", label: "Call Out" },
      { param: "nc", label: "Native Connect" },
      // { param: 'fyp', label: '' },
      { param: "com", label: "MedscapeLive.com" },
      { param: "pp", label: "Pulsepoint" },
      { param: "adr", label: "ADRoll Retargeting" },
      { param: "rt", label: "Retargeting" },
    ],
    details: null,
    custom1: {
      type: [],
    },
    custom2: {
      type: [],
    },
  },
  {
    driver: "Social",
    param: "soc",
    type: [
      { param: "twi", label: "Twitter" },
      { param: "li", label: "LinkedIn" },
      { param: "in", label: "Instagram" },
      { param: "fb", label: "Facebook" },
    ],
    details: null,
    custom1: {
      type: [
        { label: "image", param: "img" },
        { label: "video", param: "vid" },
        { label: "poll", param: "poll" },
        { label: "text", param: "txt" },
      ],
    },
    custom2: {
      type: [],
    },
  },
  {
    driver: "Social Paid",
    param: "socpd",
    source: businessUnitSubCategories,
    therapeuticAreas,
    businessUnits,
    type: [
      { param: "twi", label: "Twitter" },
      { param: "li", label: "LinkedIn" },
      { param: "in", label: "Instagram" },
      { param: "fb", label: "Facebook" },
    ],
    details: null,
    custom1: {
      type: [
        { label: "image", param: "img" },
        { label: "video", param: "vid" },
        { label: "poll", param: "poll" },
        { label: "text", param: "txt" },
      ],
    },
    custom2: {
      type: [],
    },
  },
  {
    driver: "Social Ambassador",
    param: "socamb",
    source: businessUnitSubCategories,
    therapeuticAreas,
    businessUnits,
    type: [
      { param: "twi", label: "Twitter" },
      { param: "li", label: "LinkedIn" },
      { param: "in", label: "Instagram" },
      { param: "fb", label: "Facebook" },
    ],
    details: null,
    custom1: {
      type: [
        { label: "image", param: "img" },
        { label: "video", param: "vid" },
        { label: "poll", param: "poll" },
        { label: "text", param: "txt" },
      ],
    },
    custom2: {
      type: [],
    },
  },
  {
    driver: "Print",
    param: "prt",
    type: [
      { label: "brochure", param: "broch" },
      { label: "ad", param: "ads" },
      { label: "journal", param: "jrl" },
      { label: "postcard", param: "pc" },
    ],
    details: null,
    custom1: {
      type: [],
    },
    custom2: {
      type: [],
    },
  },
  {
    driver: "3rd Party Partnership Promotions - Digital Delivery",
    param: "part",
    type: [
      { label: "E-Mail", param: "em" },
    ],
    custom1: {
      type: [],
    },
    custom2: {
      type: [],
    },
  },
  {
    driver: "Clickable PDF",
    param: "partpdf",
    id: {},
    type: [
      { label: "E-Mail", param: "em" },
    ],
    custom1: {
      types: {},
    },
    custom2: {
      types: {},
    },
  },
  {
    driver: "Rep Recruitment",
    param: "cp",
    type: [{ label: "E-Mail", param: "em" },],
    details: null,
    custom1: {
      types: [],
    },
    custom2: {
      types: [],
    },
  },
  {
    driver: "Faculty Recruitment",
    param: "partfac",
    id: {},
    type: [
      { label: "E-Mail", param: "em" },
    ],
    custom1: {
      types: {},
    },
    custom2: {
      types: {},
    },
  },
];

export { drivers, therapeuticAreas, businessUnits, businessUnitSubCategories };
