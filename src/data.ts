import { WorkItem, HostelItem, CostOfLivingItem } from './types';

const jobTitles = [
  'Farm Hand', 'Tractor Operator', 'Solar Farm Laborer', 'Meat Packer / Abattoir', 
  'Hospitality All-Rounder', 'Housekeeper', 'Kitchen Hand', 'Barista', 
  'Forklift Driver', 'Au Pair', 'Deckhand', 'Cellar Hand', 'Cotton Gin Worker',
  'Construction Laborer', 'Cleaner', 'Waitstaff', 'Warehouse Assistant'
];
const crops = ['Blueberry', 'Strawberry', 'Mango', 'Cherry', 'Apple', 'Banana', 'Macadamia', 'Tomato', 'Avocado', 'Citrus', 'Grape', 'Onion', 'Pumpkin', 'Watermelon'];
const regions = [
  'Corindi Beach NSW', 'Broome WA', 'Darwin NT', 'Bowen QLD', 'Griffith NSW', 
  'Cairns QLD', 'Sydney NSW', 'Goondiwindi QLD', 'Melbourne VIC', 'Kuri Bay WA', 
  'Young NSW', 'Gippsland VIC', 'Brisbane QLD', 'Perth WA', 'Wheatbelt WA', 
  'Margaret River WA', 'Bundaberg QLD', 'Mildura VIC', 'Riverland SA', 
  'Alice Springs NT', 'Byron Bay NSW', 'Devonport TAS', 'Hobart TAS', 
  'Stanthorpe QLD', 'Ayr QLD', 'Tully QLD', 'Innisfail QLD', 'Mareeba QLD', 
  'Shepparton VIC', 'Cobram VIC', 'Swan Hill VIC', 'Kununurra WA', 'Carnarvon WA'
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length - 1)];
}

export function generateWorks(count: number = 1000): WorkItem[] {
  const works: WorkItem[] = [];
  
  const hospitalityNatures = [
    'Melbourne Specialty Coffee House', 'Wilderness Resort Dining Hall', 
    'Outback Tavern & Roadhouse Bistro', 'Coastal Seafood Restaurant & Oyster Bar',
    'Yarra Valley Winery & Cellar Barn', 'Sydney Beachside Pub & Distillery'
  ];

  const cropNatures = [
    'Organic Blueberry Plantation', 'Family-Owned Cherry Orchards',
    'Commercial Apple Harvesting Shed', 'Humid Tropical Banana Acres',
    'Sovereign Grape Vineyard Estates', 'Macadamia Nut Farm Operations'
  ];

  const industrialNatures = [
    'Regional Meat Packing & Processing Center', 'Outback Solar Farm Grid Construction',
    'Large-Scale Cotton Gin facility', 'Port Hedland Marine Shipyard Logistics',
    'Sovereign Warehouse Distribution Hub'
  ];

  const taskDescriptions = {
    crop: [
      'Perform manual ground or ladder harvesting of ripe agricultural crops. Inspect quality under fast solar UV, packing standard crates.',
      'Operate mechanical grading conveyor belts, sorting high-grade produce from dust and organic rubble with speed and concentration.',
      'Assist with orchard maintenance, clearing dead vines, spraying pest controls, and adjusting irrigation micro-drips in the field.',
      'Pruning and wrapping delicate winter vines in thick gloves. Strenuous outdoor activity with rewarding scenery and clear country air.'
    ],
    hospitality: [
      'Extract double-shot espressos under extreme rush hours. Froth microfoam milk, handcraft pristine flat whites, and clean heavy steam grinders.',
      'Deliver peak food service across active dining tables. Present local wine lists, clear dining ware, and handle point-of-sale systems.',
      'Oversee outback motel guest check-ins, wash heavy communal linens, vacuum dusty carpet pathways, and manage room keys.',
      'Wash heavy industrial cooking pans, prepare raw ingredients (peeling onions/potatoes), and keep commercial kitchen surfaces sanitized.'
    ],
    industrial: [
      'Pack, freeze, and vacuum-seal premium portions of meat. Wear thick thermal layers in temperature-controlled production lines.',
      'Unload long solar photovoltaic panels, carry heavy steel mounting brackets across outback clay, and assist licensed installers.',
      'Maneuver high-payload gas forklifts, stacking pallets safely into multi-tier high warehouse racking systems under tight shipping rosters.',
      'Operate heavy hydraulic gin clamps, compressing raw unrefined regional cotton bales and cataloguing export batch dockets.'
    ]
  };

  const hoursOptions = [
    '38 - 45 hours / week (Regular Day Shift)',
    '15 - 28 hours / week (Part-Time roster)',
    '50 - 65 hours / week (High-Exhaustion Overtime)',
    '06:00 AM - 02:00 PM (Early Crop Sunrise)',
    '04:00 PM - Midnight (Evening Dining Shift)',
    '07:00 AM - 05:00 PM (Site Construction hours)'
  ];

  const datesOptions = [
    'Nov - Mar (High Peak Summer)',
    'Feb - Jun (Autumn Harvest Cycle)',
    'Immediate start - Sept 2026 (Winter Lock-in)',
    'Year-round availability (Minimum 3 months commitment)',
    'Immediate - Nov (Spring prep roster)',
    'Dec - Feb (Summer Student break season)'
  ];

  const daysOptions = [
    'Mon - Fri (Standard Guild roster)',
    'Mon - Sat (6-Day push to secure visa)',
    '10 Days On, 4 Days Off (Outback FIFO pattern)',
    'Rostered 5 Days (Including rotating weekends)',
    'Mon - Thu (4 Long days, 3-day weekend)',
    'Thu - Sun (High-stakes weekend penalty rates)'
  ];

  for (let i = 0; i < count; i++) {
    const isCrop = Math.random() > 0.52;
    const isHospitality = !isCrop && Math.random() > 0.45;
    
    // Choose nature & title
    let natureOfBusiness = '';
    let title = '';
    let desc = '';
    
    const action = getRandomItem(['Picker', 'Packer', 'Farm Hand', 'Sorter']);
    if (isCrop) {
      natureOfBusiness = getRandomItem(cropNatures);
      title = `${getRandomItem(crops)} ${action}`;
      desc = getRandomItem(taskDescriptions.crop);
    } else if (isHospitality) {
      natureOfBusiness = getRandomItem(hospitalityNatures);
      title = getRandomItem(jobTitles).replace('Hospitality All-Rounder', 'Resort All-Rounder');
      desc = getRandomItem(taskDescriptions.hospitality);
    } else {
      natureOfBusiness = getRandomItem(industrialNatures);
      title = getRandomItem([
        'Tractor Operator', 'Solar Farm Laborer', 'Meat Packer / Abattoir', 
        'Forklift Driver', 'Deckhand', 'Cotton Gin Worker', 'Construction Laborer'
      ]);
      desc = getRandomItem(taskDescriptions.industrial);
    }

    const minSalary = getRandomInt(24, 34);
    const maxSalary = minSalary + getRandomInt(4, 9);
    const usePieceRate = isCrop && Math.random() > 0.6;
    
    const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Extreme'] as const;
    const diffIndex = isCrop ? getRandomInt(1, 3) : (isHospitality ? getRandomInt(0, 1) : getRandomInt(1, 2));
    const difficulty = difficultyOptions[diffIndex];

    // RPG game scores proportional to difficulty
    let goldReward = 80;
    let xpReward = 70;
    if (difficulty === 'Easy') {
      goldReward = getRandomInt(60, 90);
      xpReward = getRandomInt(50, 80);
    } else if (difficulty === 'Medium') {
      goldReward = getRandomInt(100, 140);
      xpReward = getRandomInt(90, 130);
    } else if (difficulty === 'Hard') {
      goldReward = getRandomInt(150, 200);
      xpReward = getRandomInt(140, 190);
    } else {
      goldReward = getRandomInt(220, 290);
      xpReward = getRandomInt(210, 270);
    }

    const workSources = ['Seek.com.au', 'Backpacker Job Board', 'Harvest Trail Helpline', 'Facebook Aussie Jobs Gp', 'Gumtree Premium'];

    works.push({
      id: `gw_${i}`,
      title,
      salaryRange: usePieceRate ? `$${minSalary} - $${maxSalary} / hr (Piece rate est.)` : `$${minSalary} - $${maxSalary} / hr`,
      difficulty,
      area: getRandomItem(regions),
      eligible88: Math.random() > 0.22, // ~78% chance of being eligible
      source: getRandomItem(workSources),
      workingHours: getRandomItem(hoursOptions),
      dateRange: getRandomItem(datesOptions),
      natureOfBusiness,
      description: desc,
      workingDays: getRandomItem(daysOptions),
      goldReward,
      xpReward
    });
  }
  return works;
}

const hostelNames = ['Backpackers', 'Working Hostel', 'Staff Housing', 'Lodge', 'Resort Staff Accom', 'Farm Stay', 'Caravan Park', 'Motel', 'YHA', 'Workers Camp'];

export function generateHostels(count: number = 1000): HostelItem[] {
  const hostels: HostelItem[] = [];
  for (let i = 0; i < count; i++) {
    const area = getRandomItem(regions);
    const prefix = area.split(' ')[0]; // Use town name as prefix
    const name = `${prefix} ${getRandomItem(hostelNames)}`;
    const rentMin = getRandomInt(130, 260);
    const rentMax = rentMin + getRandomInt(20, 60);
    const isWeekly = Math.random() > 0.1;
    const amount = isWeekly ? `$${rentMin} - $${rentMax} / week` : `$${Math.floor(rentMin/4)} / night`;
    const rating = Math.round((Math.random() * 3.5 + 1.5) * 10) / 10; // 1.5 to 5.0
    const hostelSources = ['Hostelworld', 'Direct Website', 'Booking.com', 'Facebook Groups'];

    hostels.push({
      id: `gh_${i}`,
      name,
      amount,
      area,
      rating,
      source: getRandomItem(hostelSources)
    });
  }
  return hostels;
}

const costRegions = [
  'Regional NSW', 'Remote WA', 'Major Cities (Sydney/Melb)', 'Tropical North QLD', 
  'Outback NT', 'Regional VIC', 'South Australia', 'Tasmania', 'Western Australia', 
  'SEQ (Brisbane/Gold Coast)', 'Far North QLD', 'Remote SA'
];

export function generateLivingCosts(): CostOfLivingItem[] {
  return costRegions.map((area, i) => {
    const isRemote = area.includes('Remote') || area.includes('Outback');
    const isCity = area.includes('City') || area.includes('Cities') || area.includes('SEQ');
    
    const foodMin = isRemote ? getRandomInt(140, 180) : getRandomInt(90, 130);
    const foodMax = foodMin + getRandomInt(30, 70);
    const food = `$${foodMin} - $${foodMax} / week`;

    const transportPublicMin = isCity ? 40 : (isRemote ? 15 : 25);
    const transportPublicMax = transportPublicMin + getRandomInt(10, 30);
    const transportPublic = isCity ? `$${transportPublicMin} - $${transportPublicMax} (Train/Bus)` : (isRemote ? 'None / Very Limited' : `$${transportPublicMin} (Limited Bus)`);

    const transportCarRentalMin = isRemote ? getRandomInt(300, 450) : getRandomInt(180, 260);
    const transportCarRental = `$${transportCarRentalMin}+ / week`;

    const carPurchasemMin = isRemote ? getRandomInt(4500, 7000) : getRandomInt(2500, 4500);
    const carPurchasemMax = carPurchasemMin + getRandomInt(1500, 3500);
    const transportCarPurchase = `$${carPurchasemMin} - $${carPurchasemMax} (Used)`;

    return {
      id: `gc_${i}`,
      area,
      food,
      transportPublic,
      transportCarRental,
      transportCarPurchase
    };
  });
}

import { JourneyItem } from './types';

export const JOURNEYS: JourneyItem[] = [
  {
    id: 'j1',
    author: 'WHV Tracker (Xiaohongshu)',
    platform: 'Xiaohongshu',
    duration: '3 Years (subclass 462)',
    earningsAmount: 500000,
    earningsCurrency: 'CNY',
    jobs: [
      'Meatworks Packer (QLD)', 
      'Cherry Picker (TAS)', 
      'Solar Farm Hand (NSW)', 
      'Cafe Barista (VIC)'
    ],
    travelLocations: ['Great Ocean Road', 'Uluru', 'Cairns Diving', 'Tasmania Roadtrip'],
    summary: 'Completed 3 years on a 462 Visa. Hustled initially at a meatworks facility to save up, then switched to solar farm jobs. Saved around 500k CNY net after covering 3 years of living expenses, car rentals, and massive road trips!',
    sourceUrl: 'https://www.google.com/search?q=Xiaohongshu+WHV+Australia+500k+CNY'
  },
  {
    id: 'j2',
    author: 'Aussie Explorer (Blog)',
    platform: 'Personal Blog',
    duration: '1 Year (subclass 417)',
    earningsAmount: 32000,
    earningsCurrency: 'EUR',
    jobs: [
      'Hospitality All-Rounder (WA)', 
      'Deckhand (Broome)'
    ],
    travelLocations: ['Perth to Broome', 'Ningaloo Reef', 'Kakadu'],
    summary: 'Managed to save enough from working in remote hospitality locations in WA to afford a month-long trip through the red center. High pay rate but high cost of living!',
  }
];
