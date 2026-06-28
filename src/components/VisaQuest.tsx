import { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Swords, Compass, Coins, Award, Info, Dumbbell, Sun, 
  CloudRain, CloudLightning, Wind, ShoppingBag, Trophy, Backpack, 
  User, Sliders, Dices, RotateCcw, Flame, Check, HelpCircle, 
  ChevronRight, Sparkles, Plus, Play, CheckCircle, RefreshCcw, 
  HardHat, Loader2, Volume2, VolumeX, Ghost, Landmark, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Character Class Option definitions
interface CharacterClass {
  id: string;
  name: string;
  description: string;
  bonus: string;
  perkMultiplier: { gold: number; energyCost: number; coffee: number };
  statBonus: { baseEnergy: number; baseGold: number };
  icon: string;
}

const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'orchardist',
    name: 'Fruit Picking Ranger',
    description: 'Expert fruit hand. Immune to orchard thorns, and gets optimal yield from sunny days.',
    bonus: '+15% Farm Dungeon Gold, 10% Energy Discount',
    perkMultiplier: { gold: 1.15, energyCost: 0.9, coffee: 1.0 },
    statBonus: { baseEnergy: 10, baseGold: 100 },
    icon: '🍇'
  },
  {
    id: 'barista',
    name: 'Espresso Barista Summoner',
    description: 'Master of the steam-wand. Recovers rapid stamina through premium ristrettos.',
    bonus: '+2x Coffee Cred Accumulation, Start with +100 Gold',
    perkMultiplier: { gold: 1.0, energyCost: 1.0, coffee: 2.0 },
    statBonus: { baseEnergy: 0, baseGold: 250 },
    icon: '☕'
  },
  {
    id: 'miner',
    name: 'Outback FIFO Miner Berserker',
    description: 'High stakes high fatigue lifestyle. Massive payout but experiences higher outback exhaustion.',
    bonus: '+25% Outback Dungeons Gold, +20% Energy Consumed',
    perkMultiplier: { gold: 1.25, energyCost: 1.2, coffee: 1.0 },
    statBonus: { baseEnergy: -20, baseGold: 400 },
    icon: '⛏️'
  },
  {
    id: 'nomad',
    name: 'Hostel Ranger Rogue',
    description: 'Master of hitchhiking and sleeping in communal dorms. Highest baseline recovery.',
    bonus: '+20% Base Stamina reserves, 15% Energy discount across all regions',
    perkMultiplier: { gold: 0.9, energyCost: 0.8, coffee: 1.0 },
    statBonus: { baseEnergy: 25, baseGold: 50 },
    icon: '🎒'
  }
];

interface GameCharacter {
  name: string;
  subclass: '417' | '462';
  classId: string;
  level: number;
  xp: number;
  xpNeeded: number;
  gold: number;
  energy: number;
  maxEnergy: number;
  coffeeCred: number;
  sunResist: number;
  visaDays: number;
  currentTitle: string;
  combatAtk: number;
  combatDef: number;
}

interface Equipment {
  id: string;
  name: string;
  cost: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  effect: string;
  statBonus: { sunResist?: number; coffeeCred?: number; farmDaysMod?: number; combatAtk?: number; combatDef?: number };
  purchased: boolean;
  equipped: boolean;
  icon: any;
}

interface Dungeon {
  id: string;
  name: string;
  levelReq: number;
  energyCost: number;
  durationSeconds: number;
  goldReward: number;
  xpReward: number;
  farmDaysReward: number;
  boss: string;
  bossMaxHp: number;
  description: string;
  type: 'farm' | 'hospitality' | 'outback';
}

interface Weather {
  id: string;
  name: string;
  description: string;
  effectLabel: string;
  farmBonus: number;
  energyLossRate: number;
  icon: any;
  color: string;
}

const REGIONS_WEATHER_OPTS = [
  { region: 'Tully QLD (Far North Fruit)', defaultWeather: 'monsoon', x: '45%', y: '15%' },
  { region: 'Mildura VIC (Regional Farm)', defaultWeather: 'sunny', x: '55%', y: '75%' },
  { region: 'Broome WA (Remote Outback Craft)', defaultWeather: 'desert_heat', x: '20%', y: '28%' },
  { region: 'Melbourne VIC (Fitzroy Barista HQ)', defaultWeather: 'four_seasons', x: '58%', y: '85%' },
  { region: 'Tasmanian Wilderness', defaultWeather: 'frosty', x: '63%', y: '95%' }
];

const WEATHER_TYPES: Record<string, Weather> = {
  sunny: {
    id: 'sunny',
    name: 'Blazing Sun (UV 11+)',
    description: 'Intense Australian UV ray. Perfect for fruit ripening, but requires sun protection!',
    effectLabel: '+25% Fruit Picking XP, +20% Energy depletion rate',
    farmBonus: 1.25,
    energyLossRate: 1.2,
    icon: Sun,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
  },
  monsoon: {
    id: 'monsoon',
    name: 'Tropical Wet Season',
    description: 'Heavy pouring rains in northern Australia. Mud levels are off the chart!',
    effectLabel: '-15% Harvesting yield speed, +30% Mud-sliding resistance required',
    farmBonus: 0.85,
    energyLossRate: 1.0,
    icon: CloudRain,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
  },
  desert_heat: {
    id: 'desert_heat',
    name: 'Outback Dry Blow',
    description: 'Brutal dry desert wind. Evaporates hydration instantly.',
    effectLabel: '+50% Gold from Outback Dungeons, -30% Stamina duration',
    farmBonus: 1.15,
    energyLossRate: 1.4,
    icon: Wind,
    color: 'text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(248,113,113,0.2)]'
  },
  four_seasons: {
    id: 'four_seasons',
    name: 'Four Seasons in One Day',
    description: 'Classic Melbourne meteorological chaos. Jacket on, jacket off.',
    effectLabel: '+20% Melbourne Coffee Cred earnings, RNG random events',
    farmBonus: 1.0,
    energyLossRate: 1.1,
    icon: CloudLightning,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_10px_rgba(129,140,248,0.2)]'
  },
  frosty: {
    id: 'frosty',
    name: 'Alps Crisp Morning',
    description: 'Freezing cold start in Tasmania. Pack those thick flannel shirts.',
    effectLabel: '+15% Solitude reflection XP, Warm soup restore bonus',
    farmBonus: 1.0,
    energyLossRate: 0.8,
    icon: Wind,
    color: 'text-sky-300 border-sky-400/30 bg-sky-400/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
  }
};

export default function VisaQuest({ userCurrency, exchangeRate, symbol }: { userCurrency: string; exchangeRate: number; symbol: string }) {
  // --- Audio Settings ---
  const [soundMuted, setSoundMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('whv_quest_mute');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const [selectedClassId, setSelectedClassId] = useState('orchardist');

  // Sparkle floating notifications
  const [damagePopups, setDamagePopups] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);

  const activeClass = useMemo(() => {
    return CHARACTER_CLASSES.find(c => c.id === selectedClassId) || CHARACTER_CLASSES[0];
  }, [selectedClassId]);

  // --- Character State ---
  const normalizeCharacter = (raw: any): GameCharacter => {
    const d: GameCharacter = {
      name: 'Aussie Warrior',
      subclass: '462',
      classId: 'orchardist',
      level: 1,
      xp: 0,
      xpNeeded: 180,
      gold: 450,
      energy: 100,
      maxEnergy: 100,
      coffeeCred: 0,
      sunResist: 10,
      visaDays: 0,
      currentTitle: 'Greenhorn Backpacker',
      combatAtk: 12,
      combatDef: 8
    };
    if (!raw || typeof raw !== 'object') return d;
    
    // Defensive extraction with non-zero fallback for metrics used in calculations or display
    const xpNeededVal = typeof raw.xpNeeded === 'number' && !isNaN(raw.xpNeeded) ? raw.xpNeeded : d.xpNeeded;
    const maxEnergyVal = typeof raw.maxEnergy === 'number' && !isNaN(raw.maxEnergy) ? raw.maxEnergy : d.maxEnergy;
    const levelVal = typeof raw.level === 'number' && !isNaN(raw.level) ? raw.level : d.level;
    const combatAtkVal = typeof raw.combatAtk === 'number' && !isNaN(raw.combatAtk) ? raw.combatAtk : d.combatAtk;
    const combatDefVal = typeof raw.combatDef === 'number' && !isNaN(raw.combatDef) ? raw.combatDef : d.combatDef;

    return {
      name: typeof raw.name === 'string' ? raw.name : d.name,
      subclass: (raw.subclass === '417' || raw.subclass === '462') ? raw.subclass : d.subclass,
      classId: typeof raw.classId === 'string' ? raw.classId : d.classId,
      level: levelVal > 0 ? levelVal : d.level,
      xp: typeof raw.xp === 'number' && !isNaN(raw.xp) ? Math.max(0, raw.xp) : d.xp,
      xpNeeded: xpNeededVal > 0 ? xpNeededVal : d.xpNeeded,
      gold: typeof raw.gold === 'number' && !isNaN(raw.gold) ? raw.gold : d.gold,
      energy: typeof raw.energy === 'number' && !isNaN(raw.energy) ? Math.max(0, raw.energy) : d.energy,
      maxEnergy: maxEnergyVal > 0 ? maxEnergyVal : d.maxEnergy,
      coffeeCred: typeof raw.coffeeCred === 'number' && !isNaN(raw.coffeeCred) ? Math.max(0, raw.coffeeCred) : d.coffeeCred,
      sunResist: typeof raw.sunResist === 'number' && !isNaN(raw.sunResist) ? raw.sunResist : d.sunResist,
      visaDays: typeof raw.visaDays === 'number' && !isNaN(raw.visaDays) ? Math.max(0, raw.visaDays) : d.visaDays,
      currentTitle: typeof raw.currentTitle === 'string' ? raw.currentTitle : d.currentTitle,
      combatAtk: combatAtkVal > 0 ? combatAtkVal : d.combatAtk,
      combatDef: combatDefVal > 0 ? combatDefVal : d.combatDef,
    };
  };

  const [character, setCharacter] = useState<GameCharacter>(() => {
    try {
      const saved = localStorage.getItem('whv_quest_char_v2');
      if (saved) {
        return normalizeCharacter(JSON.parse(saved));
      }
    } catch (e) {}
    return normalizeCharacter(null);
  });

  // --- Equipment State ---
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem('whv_quest_gear');
      if (saved) {
        const loaded = JSON.parse(saved);
        // Bind functions icons back
        return loaded.map((item: any) => ({
          ...item,
          icon: item.id === 'boots' ? HardHat : (item.id === 'hat' ? Sun : (item.id === 'tamper' ? Flame : Compass))
        }));
      }
    } catch (e) {}
    return [
      {
        id: 'boots',
        name: 'Steel-Cap Work Boots',
        cost: 150,
        rarity: 'Common',
        description: 'Standard site entry requirement. Protects toes from heavy agricultural bins.',
        effect: '+20% Harvest Rate & +5 Attack Defense',
        statBonus: { combatDef: 5, combatAtk: 2 },
        purchased: false,
        equipped: false,
        icon: HardHat
      },
      {
        id: 'hat',
        name: 'Wide-Brim Akubra Hat',
        cost: 120,
        rarity: 'Rare',
        description: 'Traditional heavy straw sun-hat. Essential protection against UV.',
        effect: '+30 Sun Resistance & +10% Solar Immunity',
        statBonus: { sunResist: 30, combatDef: 3 },
        purchased: false,
        equipped: false,
        icon: Sun
      },
      {
        id: 'tamper',
        name: 'Precision Barista Tamper',
        cost: 200,
        rarity: 'Epic',
        description: 'Heavy metal Fitzroy spring calibration leveler.',
        effect: '+40 Coffee Cred & +15 Barista Coffee Attack power',
        statBonus: { coffeeCred: 40, combatAtk: 15 },
        purchased: false,
        equipped: false,
        icon: Flame
      },
      {
        id: 'camry',
        name: '1998 Toyota Camry',
        cost: 550,
        rarity: 'Legendary',
        description: 'Dented build. Indestructible four-cylinder engine. Drives across Australia without single repair!',
        effect: 'Outback Raids Unlocker & +25 Travel defense shield',
        statBonus: { sunResist: 15, combatDef: 25, combatAtk: 10 },
        purchased: false,
        equipped: false,
        icon: Compass
      }
    ];
  });

  // --- Dynamic Weather & Area ---
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [weatherId, setWeatherId] = useState('sunny');

  // --- Active Raid Simulation ---
  const [questingTimeLeft, setQuestingTimeLeft] = useState<number | null>(null);
  const [activeDungeon, setActiveDungeon] = useState<Dungeon | null>(null);
  const [bossHp, setBossHp] = useState<number>(100);
  const [adventureLogs, setAdventureLogs] = useState<string[]>([
    'System Diagnostic: RPG Combat Kernel loaded successfully!',
    'HINT: Complete Daily Quests under "Daily Mission" to replenish energy & gain base funds! Hand in farm sign-offs below.'
  ]);

  // --- Edit Name Mode ---
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(character.name);

  // --- Daily Tasks State ---
  const [dailyTasks, setDailyTasks] = useState([
    { id: 'tfn', text: 'Pre-apply Tax File Number (TFN) documentation online', rewardXp: 35, rewardGold: 30, completed: false },
    { id: 'sunscreen', text: 'Slap 50+ broad UV sunscreen before harvest begins', rewardXp: 20, rewardGold: 15, completed: false },
    { id: 'cook', text: 'Batch cook cheap instant noodles & tuna lunches', rewardXp: 45, rewardGold: 40, completed: false },
    { id: 'resume', text: 'Hand out 15 coffee house CV printouts in the Melbourne wind', rewardXp: 55, rewardGold: 20, completed: false },
  ]);

  // --- Synthesized 8-Bit SFX Engine ---
  const triggerSound = (type: 'click' | 'coin' | 'levelUp' | 'embark' | 'error' | 'success' | 'combat') => {
    if (soundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.setValueAtTime(1400, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'levelUp') {
        // High triumphant chord
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'embark') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.35);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.setValueAtTime(80, now + 0.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1760, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'combat') {
        // Explosion noise
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150 + Math.random() * 80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {}
  };

  // Synchronize sounds settings to storage
  useEffect(() => {
    try {
      localStorage.setItem('whv_quest_mute', String(soundMuted));
    } catch (e) {}
  }, [soundMuted]);

  // Synchronize dynamic character data to storage
  useEffect(() => {
    try {
      localStorage.setItem('whv_quest_char_v2', JSON.stringify(character));
    } catch (e) {}
  }, [character]);

  // Synchronize equipment states to storage
  useEffect(() => {
    try {
      localStorage.setItem('whv_quest_gear', JSON.stringify(equipmentList));
    } catch (e) {}
  }, [equipmentList]);

  // Default region weather mapping
  useEffect(() => {
    const defaultWeather = REGIONS_WEATHER_OPTS[selectedRegionIndex].defaultWeather;
    setWeatherId(defaultWeather);
  }, [selectedRegionIndex]);

  // Handle combat / countdown ticks
  useEffect(() => {
    if (questingTimeLeft === null || !activeDungeon) return;

    if (questingTimeLeft > 0) {
      const timer = setTimeout(() => {
        setQuestingTimeLeft(questingTimeLeft - 1);
        
        // Combat attack simulation log
        triggerSound('combat');
        
        // Random interactive battle effects
        const currentProgress = activeDungeon.durationSeconds - questingTimeLeft;
        const playerAtkMod = Math.round(character.combatAtk + (Math.random() * 6 - 3));
        const finalAtk = Math.max(1, playerAtkMod);

        // Spawn hit points float
        setDamagePopups(prev => [
          ...prev,
          {
            id: Date.now(),
            text: `-${finalAtk} HP`,
            x: 25 + Math.random() * 50,
            y: 20 + Math.random() * 40,
            color: 'text-amber-400 font-extrabold text-lg'
          }
        ]);

        setBossHp(prevHp => Math.max(0, prevHp - finalAtk));

        if (currentProgress === 1) {
          addLog(`⚔️ ENCOUNTER! Entering "${activeDungeon.name}". Boss [${activeDungeon.boss}] has appeared!`);
        } else if (currentProgress === 3) {
          const wObj = WEATHER_TYPES[weatherId];
          addLog(`🌩️ Weather shift detected: "${wObj.name}"! Gaining buffs and experiencing increased energy exhaustion.`);
        } else {
          addLog(`🔪 You sliced through crop rows! Swung weapon/hoe for ${finalAtk} field damage!`);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Dungeon raid finished! Award victory spoils
      const weatherMod = WEATHER_TYPES[weatherId];
      const classObj = CHARACTER_CLASSES.find(c => c.id === character.classId) || CHARACTER_CLASSES[0];

      // Calculate yields
      const classGoldBonus = classObj.perkMultiplier.gold;
      const baseGoldPlus = activeDungeon.goldReward * (weatherMod.farmBonus || 1);
      const finalGold = Math.round(baseGoldPlus * classGoldBonus);

      const finalXp = Math.round(activeDungeon.xpReward * (weatherMod.farmBonus || 1));
      const finalDays = activeDungeon.farmDaysReward;
      const finalCoffeeCred = activeDungeon.type === 'hospitality' ? Math.round(15 * classObj.perkMultiplier.coffee) : 0;

      triggerSound('success');

      addLog(`🏆 VICTORY! Successfully defeated "${activeDungeon.boss}"! Gained +${finalGold} GLD, +${finalXp} XP, +${finalDays} Days, +${finalCoffeeCred} Coffee Creds!`);

      // Character XP and level-up checks
      let newXp = character.xp + finalXp;
      let newLevel = character.level;
      let newXpNeeded = character.xpNeeded;

      if (newXp >= newXpNeeded) {
        newXp -= newXpNeeded;
        newLevel += 1;
        newXpNeeded = Math.round(newXpNeeded * 1.45);
        triggerSound('levelUp');
        addLog(`✨ LEVEL UP! You reached LEVEL ${newLevel}! Stat cap increased, combat prowess scaled.`);
      }

      // Progression Titles
      let currentTitle = character.currentTitle;
      if (newLevel >= 4 && character.currentTitle === 'Greenhorn Backpacker') {
        currentTitle = 'Outback Hard-Yakka Veteran';
        addLog(`🎖️ NEW CLASS TITLE ACQUIRED: "Outback Hard-Yakka Veteran"`);
      } else if (newLevel >= 8) {
        currentTitle = 'Fierce Working Legend';
        addLog(`👑 ROYAL TITLE ACQUIRED: "Fierce Working Legend"`);
      }

      // Update state
      setCharacter(prev => ({
        ...prev,
        gold: prev.gold + finalGold,
        xp: newXp,
        level: newLevel,
        xpNeeded: newXpNeeded,
        visaDays: prev.visaDays + finalDays,
        coffeeCred: prev.coffeeCred + finalCoffeeCred,
        combatAtk: prev.combatAtk + 2,
        combatDef: prev.combatDef + 1,
        currentTitle
      }));

      // Flush popups
      setTimeout(() => setDamagePopups([]), 1500);

      setActiveDungeon(null);
      setQuestingTimeLeft(null);
    }
  }, [questingTimeLeft, activeDungeon]);

  const addLog = (msg: string) => {
    setAdventureLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 14)]);
  };

  const handleNameChangeSubmit = () => {
    if (tempName.trim()) {
      setCharacter(prev => ({ ...prev, name: tempName.trim() }));
      addLog(`Comrades labeled you standard label: "${tempName.trim()}"`);
    }
    setIsEditingName(false);
  };

  const toggleSubclass = () => {
    triggerSound('click');
    const nextSub = character.subclass === '417' ? '462' : '417';
    setCharacter(prev => ({ ...prev, subclass: nextSub }));
    addLog(`Flipped active subclass ruleset to: Subclass ${nextSub}.`);
  };

  const prayToWeatherSpirits = () => {
    triggerSound('click');
    const keys = Object.keys(WEATHER_TYPES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setWeatherId(randomKey);
    const weatherName = WEATHER_TYPES[randomKey].name;
    addLog(`🌀 Prayers submitted to Sky Spirit. Winds transformed into "${weatherName}"!`);
  };

  // Execute starting background class change
  const selectStartingClass = (classId: string) => {
    triggerSound('click');
    const classObj = CHARACTER_CLASSES.find(c => c.id === classId);
    if (!classObj) return;

    // Reset base characteristics for selected backgrounds
    setCharacter(prev => ({
      ...prev,
      classId,
      maxEnergy: 100 + classObj.statBonus.baseEnergy,
      energy: Math.min(100 + classObj.statBonus.baseEnergy, prev.energy),
      currentTitle: `Class Champion: ${classObj.name}`
    }));
    addLog(`Chosen Background Role: "${classObj.name}". Trait applied: ${classObj.bonus}`);
  };

  // Complete Daily Task Quest
  const completeDailyTask = (id: string) => {
    setDailyTasks(prev => prev.map(t => {
      if (t.id === id && !t.completed) {
        triggerSound('coin');
        let newXp = character.xp + t.rewardXp;
        let newLevel = character.level;
        let newXpNeeded = character.xpNeeded;

        if (newXp >= newXpNeeded) {
          newXp -= newXpNeeded;
          newLevel += 1;
          newXpNeeded = Math.round(newXpNeeded * 1.45);
          triggerSound('levelUp');
        }

        setCharacter(c => ({
          ...c,
          gold: c.gold + t.rewardGold,
          xp: newXp,
          level: newLevel,
          xpNeeded: newXpNeeded
        }));

        addLog(`✅ TASK ACCOMPLISHED: "${t.text}". Claimed +${t.rewardGold} GLD, +${t.rewardXp} XP!`);
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  // Rest and sunrise daily trigger
  const triggerRest = () => {
    triggerSound('success');
    setDailyTasks(prev => prev.map(t => ({ ...t, completed: false })));
    setCharacter(prev => ({ ...prev, energy: prev.maxEnergy }));
    addLog(`🌅 SUNRISE RESTORE: Rested on cheap hostel bunk. Daily missions refreshed and stamina completely fueled!`);
  };

  // Purchase Equipment Gear Shop
  const buyEquipment = (itemToBuy: Equipment) => {
    if (character.gold < itemToBuy.cost) {
      triggerSound('error');
      addLog(`❌ TRANSACTION ABORTED: Insufficient gold funds. Required ${itemToBuy.cost} Gold, but you carry only ${character.gold}!`);
      return;
    }

    triggerSound('coin');
    setEquipmentList(prev => prev.map(e => e.id === itemToBuy.id ? { ...e, purchased: true } : e));
    setCharacter(prev => {
      const updatedGold = prev.gold - itemToBuy.cost;
      return {
        ...prev,
        gold: updatedGold
      };
    });

    addLog(`🛒 ITEM ACQUIRED: Obtained "${itemToBuy.name}" from Outfitter shop for ${itemToBuy.cost} GLD.`);
  };

  // Equip / unequip Toggle handler
  const toggleEquip = (itemId: string) => {
    triggerSound('click');
    setEquipmentList(prev => prev.map(e => {
      if (e.id === itemId) {
        const nextState = !e.equipped;
        
        // Calculate dynamic bonus modifiers
        setCharacter(c => {
          let sunResistMod = e.statBonus.sunResist ? (nextState ? e.statBonus.sunResist : -e.statBonus.sunResist) : 0;
          let coffeeCredMod = e.statBonus.coffeeCred ? (nextState ? e.statBonus.coffeeCred : -e.statBonus.coffeeCred) : 0;
          let atkMod = e.statBonus.combatAtk ? (nextState ? e.statBonus.combatAtk : -e.statBonus.combatAtk) : 0;
          let defMod = e.statBonus.combatDef ? (nextState ? e.statBonus.combatDef : -e.statBonus.combatDef) : 0;

          return {
            ...c,
            sunResist: Math.max(0, c.sunResist + sunResistMod),
            coffeeCred: Math.max(0, c.coffeeCred + coffeeCredMod),
            combatAtk: Math.max(1, c.combatAtk + atkMod),
            combatDef: Math.max(1, c.combatDef + defMod)
          };
        });

        addLog(nextState ? `🛡️ EQUIPPED ACTIVE: Mount gear item "${e.name}".` : `🎒 UNEQUIPPED: Slid "${e.name}" into inventory pack.`);
        return { ...e, equipped: nextState };
      }
      return e;
    }));
  };

  // Embark on specific regional crop dungeon combat simulation
  const DUNGEONS: Dungeon[] = [
    {
      id: 'd1',
      name: 'QLD Banana Mudfields',
      levelReq: 1,
      energyCost: 18,
      durationSeconds: 5,
      goldReward: 100,
      xpReward: 90,
      farmDaysReward: 5,
      boss: 'Raw Tully Slither Crop-Monster',
      bossMaxHp: 65,
      description: 'Challenging humid rainforest clay. Dodge banana-picking spiders on steep agricultural slope.',
      type: 'farm'
    },
    {
      id: 'd2',
      name: 'Fitzroy Espresso Colosseum',
      levelReq: 2,
      energyCost: 22,
      durationSeconds: 6,
      goldReward: 150,
      xpReward: 120,
      farmDaysReward: 0,
      boss: 'The Frantic Latte Art Auditor',
      bossMaxHp: 95,
      description: 'Handcraft dozens of dynamic double-shot microfoamed flat whites in frantic morning rush.',
      type: 'hospitality'
    },
    {
      id: 'd3',
      name: 'Western Broome Deckhand Raid',
      levelReq: 3,
      energyCost: 32,
      durationSeconds: 8,
      goldReward: 240,
      xpReward: 180,
      farmDaysReward: 12,
      boss: 'The Giant Sovereign Salt Swell',
      bossMaxHp: 150,
      description: 'Operate heavy steel cage lines offshore amidst heavy spray and ocean tides. Requires Camry Vehicle.',
      type: 'outback'
    }
  ];

  const embarkOnDungeon = (dungeon: Dungeon) => {
    // Check level boundaries
    if (character.level < dungeon.levelReq) {
      triggerSound('error');
      addLog(`🔒 DUNGEON ROADBLOCK: Level insufficient! Requires LEVEL ${dungeon.levelReq} to brave "${dungeon.name}".`);
      return;
    }

    // Check stamina cost
    const weatherMod = WEATHER_TYPES[weatherId];
    const classObj = CHARACTER_CLASSES.find(c => c.id === character.classId) || CHARACTER_CLASSES[0];
    
    // Apply compounding weather & class modifications
    const baseEnergyCost = dungeon.energyCost * weatherMod.energyLossRate;
    const finalEnergyCost = Math.round(baseEnergyCost * classObj.perkMultiplier.energyCost);

    if (character.energy < finalEnergyCost) {
      triggerSound('error');
      addLog(`❌ ZERO ENERGY FAILURE: Action requires ${finalEnergyCost} stamina. Rest on bunk bed to replenish!`);
      return;
    }

    // Check specific outback item unlock requirements
    if (dungeon.type === 'outback') {
      const carOwned = equipmentList.find(e => e.id === 'camry')?.purchased;
      if (!carOwned) {
        triggerSound('error');
        addLog(`🚗 TRAVEL BARRIER: Outback FIFO Deckhand dockets require ownership of 1998 Toyota Camry to negotiate transit!`);
        return;
      }
    }

    // Start running active simulation combat trigger
    triggerSound('embark');
    setActiveDungeon(dungeon);
    setBossHp(dungeon.bossMaxHp);
    setQuestingTimeLeft(dungeon.durationSeconds);
    
    // Sleep or exhaust active pool
    setCharacter(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - finalEnergyCost)
    }));

    addLog(`⚔️ ENEMY CHALLENGE ACCEPTED: Sailing out into "${dungeon.name}". Speeding up field harvester and engaging boss: [${dungeon.boss}]!`);
  };

  const weatherObj = WEATHER_TYPES[weatherId];

  return (
    <div id="visa-quest-arcade-console" className="bg-[#0b0c10] border-4 border-amber-500 rounded-3xl p-3 md:p-6 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden font-mono text-gray-200">
      
      {/* GLOWING AMBIENT SCAN LINES OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10 opacity-70"></div>
      
      {/* SCREEN GLARE RADIANT */}
      <div className="absolute inset-0 bg-radial-gradient from-white/[0.04] to-transparent pointer-events-none z-10"></div>

      {/* ARCADE HEADER BAR BEZEL */}
      <div className="border-b-4 border-amber-500/60 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] p-4 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative">
        <div className="absolute -top-1 left-4 px-3 py-0.5 bg-amber-500 text-black text-[10px] font-black tracking-widest uppercase rounded">
          SYSTEM UNIT: WHV-OS v88.2
        </div>

        {/* Brand & Audio Controller */}
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto mt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-400"></span>
            <h2 className="text-lg md:text-xl font-extrabold text-amber-400 tracking-wide uppercase select-none flex items-center gap-2">
              <Swords className="w-5 h-5 text-amber-500" /> AUS WHV WARRIOR
            </h2>
          </div>
          
          <button 
            onClick={() => { setSoundMuted(!soundMuted); triggerSound('click'); }}
            className={`px-3 py-1.5 rounded border text-[11px] font-bold tracking-wider transition-colors flex items-center gap-1.5 ${
              soundMuted 
                ? 'border-gray-700 bg-gray-900/40 text-gray-500' 
                : 'border-amber-500/50 bg-amber-500/10 text-amber-400 font-black shadow-[0_0_10px_rgba(245,158,11,0.1)]'
            }`}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce" />}
            {soundMuted ? "SOUND: OFF" : "SOUND: ON"}
          </button>
        </div>

        {/* Dynamic Class Selector background slot */}
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded border border-white/10 w-full md:w-auto">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">ROLE PERK</span>
          <select 
            value={character.classId} 
            onChange={(e) => { selectStartingClass(e.target.value); }}
            className="bg-[#111] border border-white/15 text-xs text-amber-300 font-bold px-2 py-0.5 rounded focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {CHARACTER_CLASSES.map(c => (
              <option key={c.id} value={c.id} className="bg-[#111]">{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CHARACTER CLASS SUMMARY NOTIFICATION BAR */}
      <div className="mb-6 bg-amber-500/5 border border-amber-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">{activeClass.icon}</span>
          <p className="text-gray-300">
            Active Role Trait: <strong className="text-amber-400 uppercase tracking-wider">{activeClass.name}</strong> - <span className="text-amber-300">{activeClass.bonus}</span>
          </p>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          Class modifiers active
        </div>
      </div>

      {/* HUD MAIN METERS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        
        {/* Profile Card & Avatar */}
        <div className="md:col-span-4 bg-[#111] border-2 border-amber-500/40 rounded-xl p-4 flex items-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 rounded-lg flex items-center justify-center text-black font-black text-2xl border-2 border-amber-300 shrink-0 select-none shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            {activeClass.icon}
          </div>

          <div className="space-y-1 flex-grow">
            <div className="flex items-center justify-between">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={e => setTempName(e.target.value)} 
                    className="bg-black border border-amber-500/60 text-white rounded px-2 py-0.5 text-xs focus:outline-none max-w-[120px]" 
                  />
                  <button onClick={handleNameChangeSubmit} className="text-emerald-400 hover:text-emerald-300 text-xs font-black">X</button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-white text-sm tracking-widest uppercase">{character.name}</span>
                  <button onClick={() => { setTempName(character.name); setIsEditingName(true); }} className="text-[10px] text-amber-500/60 hover:text-amber-400 underline pl-1">EDIT</button>
                </div>
              )}
              <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black font-mono">LVL {character.level}</span>
            </div>

            <p className="text-[10px] text-amber-300 font-bold tracking-widest uppercase">{character.currentTitle}</p>
            
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <button onClick={toggleSubclass} className="hover:text-amber-400 underline">SUBCLASS {character.subclass}</button>
              <span>ATK: {character.combatAtk} · DEF: {character.combatDef}</span>
            </div>
          </div>
        </div>

        {/* Meters Display Bar */}
        <div className="md:col-span-8 bg-black/60 border-2 border-amber-500/20 rounded-xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-3 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] relative">
          
          {/* GP meter */}
          <div className="bg-[#151515] p-2 rounded border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[9px] text-gray-500 uppercase tracking-widest">
              <span>GOLD FUNDS</span>
              <Coins className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-sm font-extrabold text-amber-400 font-sans tracking-tight">
              {symbol}{(character.gold * exchangeRate).toFixed(0)} <span className="text-[10px] text-amber-400/70 font-normal">{userCurrency}</span>
            </div>
          </div>

          {/* Energy Pool */}
          <div className="bg-[#151515] p-2 rounded border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[9px] text-gray-400 uppercase tracking-widest">
              <span>ENERGY</span>
              <Flame className="w-3.5 h-3.5 text-rose-500" />
            </div>
            {/* Custom Health-style Segment bar */}
            <div className="w-full bg-white/5 h-2 rounded overflow-hidden flex gap-0.5 border border-white/10">
              {Array.from({ length: 5 }).map((_, idx) => {
                const step = (idx + 1) * 20;
                const active = character.energy >= step;
                return (
                  <div 
                    key={idx} 
                    className={`flex-grow h-full duration-300 ${
                      active ? 'bg-gradient-to-b from-rose-400 to-rose-600 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-[10px] text-right font-black text-rose-400 font-mono">{character.energy} / {character.maxEnergy} HP</div>
          </div>

          {/* Coffee Cred Vault */}
          <div className="bg-[#151515] p-2 rounded border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[9px] text-gray-500 uppercase tracking-widest">
              <span>COFFEE CRED</span>
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-sm font-extrabold text-purple-400">+{character.coffeeCred}</div>
          </div>

          {/* 88 Days Tracker Meter */}
          <div className="bg-[#151515] p-2 rounded border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[9px] text-gray-400 uppercase tracking-widest">
              <span>FARM DAY SLOTS</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-sm font-extrabold text-emerald-400">
              {character.visaDays} <span className="text-[10px] text-emerald-500/70 font-normal">/ 88 DAYS</span>
            </div>
          </div>

        </div>

      </div>

      {/* XP EXPERIENCE ENGINE */}
      <div className="mb-6 bg-black/90 p-3 rounded-xl border-2 border-amber-500/20 flex flex-col sm:flex-row items-center gap-3 relative">
        <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest whitespace-nowrap">XP STAGE ENGINE</span>
        <div className="flex-grow bg-white/5 h-4 rounded overflow-hidden relative border border-white/10 w-full sm:w-auto">
          {/* Animated striped bar */}
          <div 
            className="bg-gradient-to-r from-amber-500 to-yellow-600 h-full rounded transition-all duration-300 relative shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
            style={{ width: `${(character.xp / Math.max(1, character.xpNeeded)) * 100}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] animate-pulse"></div>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-gray-400 whitespace-nowrap">{character.xp} / {character.xpNeeded} EXP</span>
      </div>

      {/* INTERACTIVE VIDEO GAME INTERFACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        
        {/* Left Hand: Missions Map & Weather Oracle */}
        <div className="lg:col-span-5 space-y-6">

          {/* DYNAMIC COMBAT ORACLE / REGION MAP */}
          <div className="bg-[#111111] border-2 border-amber-500/40 rounded-xl p-4 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-amber-500/20 select-none">
              <Compass className="w-4 h-4 text-amber-500" /> TACTICAL COMBAT RANGE MAP
            </h3>

            {/* DYNAMIC RETRO GRID MAP VISUAL */}
            <div className="bg-black rounded-lg border border-white/10 h-44 relative overflow-hidden flex items-center justify-center select-none bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] bg-[size:16px_16px]">
              
              {/* Plot map outline */}
              <div className="absolute inset-x-2 inset-y-4 border border-dashed border-white/10 rounded-lg pointer-events-none"></div>

              {/* Connecting dashed route lanes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="45%" y1="15%" x2="55%" y2="75%" stroke="white" strokeDasharray="4" strokeWidth="2" />
                <line x1="55%" y1="75%" x2="20%" y2="28%" stroke="white" strokeDasharray="4" strokeWidth="2" />
                <line x1="20%" y1="28%" x2="58%" y2="85%" stroke="white" strokeDasharray="4" strokeWidth="2" />
                <line x1="58%" y1="85%" x2="63%" y2="95%" stroke="white" strokeDasharray="4" strokeWidth="2" />
              </svg>

              {/* MAP PINS FOR REGIONS */}
              {REGIONS_WEATHER_OPTS.map((reg, idx) => {
                const isActive = idx === selectedRegionIndex;
                return (
                  <button
                    key={reg.region}
                    onClick={() => { setSelectedRegionIndex(idx); triggerSound('click'); }}
                    className="absolute group z-20 focus:outline-none"
                    style={{ left: reg.x, top: reg.y }}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 transition-all relative ${
                      isActive 
                        ? 'bg-amber-400 border-amber-200 scale-125 animate-ping' 
                        : 'bg-indigo-900 border-indigo-400 hover:bg-amber-500 hover:scale-110'
                    }`}>
                      {isActive && <div className="absolute w-2 h-2 rounded-full bg-amber-400" />}
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-black/90 border border-white/20 rounded px-1.5 py-0.5 text-[9px] text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 whitespace-nowrap transition-opacity font-bold">
                      {reg.region.split(' ')[0]}
                    </div>
                  </button>
                );
              })}

              {/* Mini Character avatar walking sprite indicator */}
              <motion.div 
                className="absolute w-7 h-7 bg-amber-400 border border-black rounded flex items-center justify-center font-bold text-xs shadow-lg z-20 text-black cursor-default select-none pt-0.5"
                animate={{
                  left: REGIONS_WEATHER_OPTS[selectedRegionIndex].x,
                  top: REGIONS_WEATHER_OPTS[selectedRegionIndex].y,
                }}
                transition={{ type: 'spring', damping: 15 }}
                style={{ transform: 'translate(-50%, -100%)' }}
              >
                🚴
              </motion.div>

              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded text-[8px] border border-white/15">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                <span>RADAR ONLINE</span>
              </div>
            </div>

            {/* Weather parameters */}
            <div className="space-y-3">
              <div className="flex gap-2 justify-between">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Target Mission Sector</label>
                  <select 
                    value={selectedRegionIndex} 
                    onChange={e => { setSelectedRegionIndex(Number(e.target.value)); triggerSound('click'); }} 
                    className="bg-black text-amber-400 font-bold border border-amber-500/30 rounded pl-2 pr-6 py-1.5 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {REGIONS_WEATHER_OPTS.map((opt, i) => (
                      <option key={opt.region} value={i} className="bg-[#111]">{opt.region}</option>
                    ))}
                  </select>
                </div>

                <div className="self-end">
                  <button 
                    onClick={prayToWeatherSpirits} 
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] rounded flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Dices className="w-3.5 h-3.5" /> PRAY WEATHER
                  </button>
                </div>
              </div>

              {/* Oracle weather description output */}
              <div className={`p-3 border-2 rounded-xl flex items-start gap-3 transition-all ${weatherObj.color}`}>
                <div className="p-2 bg-black/60 rounded border border-white/5 mt-0.5">
                  <weatherObj.icon className="w-5 h-5 shrink-0" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase">{weatherObj.name}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{weatherObj.description}</p>
                  <p className="text-[10px] uppercase font-bold text-amber-300">MODIFIER: {weatherObj.effectLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DAILY MISSION QUEST BOARD */}
          <div className="bg-[#111111] border-2 border-amber-500/40 rounded-xl p-4 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-amber-500/20">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Trophy className="w-4 h-4 text-amber-500" /> DAILY MISSION QUEST BOARD
              </h3>
              <button 
                onClick={triggerRest} 
                className="text-[10px] text-amber-500 hover:text-amber-400 font-extrabold border border-amber-500/30 px-2 py-0.5 rounded bg-black/40 hover:bg-black uppercase tracking-wider active:scale-95"
              >
                REST AT HOSTEL (REFRESH)
              </button>
            </div>

            <div className="space-y-3">
              {dailyTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => !task.completed && completeDailyTask(task.id)}
                  className={`p-2.5 rounded border text-left cursor-pointer transition-all duration-150 flex items-start gap-2.5 ${
                    task.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20 opacity-50' 
                      : 'bg-black border-amber-500/10 hover:border-amber-500/30 hover:bg-black/80'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                    task.completed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/20'
                  }`}>
                    {task.completed ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-gray-600" />}
                  </div>
                  <div className="space-y-1 flex-grow">
                    <p className={`text-xs leading-relaxed font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 font-mono">
                      <span className="text-amber-400">BG: +{task.rewardGold} GLD</span>
                      <span>·</span>
                      <span className="text-amber-300">XP: +{task.rewardXp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Hand: Active Battle Simulator, Dungeons, Outfitter Gear */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* COMBAT ARENA BATTLE SIMULATOR */}
          <div className="bg-black/90 border-4 border-amber-500/70 rounded-2xl p-5 relative overflow-hidden shadow-2xl relative">
            
            {/* RETRO CORNER HATCH DECOR */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 border-l border-b border-black flex items-center justify-center font-black text-black text-xs select-none">
              ⚠️
            </div>

            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">ACTIVE HARVEST SIMULATOR DOCK</h3>

            <div className="bg-[#111] p-4 rounded-xl border border-white/10 relative h-48 flex items-center justify-center">
              
              {/* Float damage coordinates overlay inside combat simulator */}
              <AnimatePresence>
                {damagePopups.map(pop => (
                  <motion.div
                    key={pop.id}
                    className={`absolute ${pop.color}`}
                    style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: -25 }}
                    exit={{ opacity: 0 }}
                  >
                    {pop.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              {questingTimeLeft !== null && activeDungeon ? (
                <div className="space-y-4 w-full h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center bg-black/60 p-2 rounded border border-white/5">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                      <span className="font-extrabold text-white text-xs uppercase tracking-wider">{activeDungeon.name}</span>
                    </div>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black tracking-widest animate-pulse">WARFARE TIME: {questingTimeLeft}S</span>
                  </div>

                  {/* Character Battle Boss Display HP */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/85 p-2 rounded border border-rose-500/20 text-center">
                      <p className="text-[9px] text-gray-500 uppercase font-black">BOSS: {activeDungeon.boss.split(' ')[0]}</p>
                      <div className="w-full bg-white/5 h-2 rounded overflow-hidden mt-1 border border-white/10">
                        <div 
                          className="bg-red-500 h-full transition-all duration-300" 
                          style={{ width: `${(bossHp / activeDungeon.bossMaxHp) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-red-400 font-bold mt-1 uppercase">HP: {bossHp} / {activeDungeon.bossMaxHp}</p>
                    </div>

                    <div className="bg-black/85 p-2 rounded border border-amber-500/20 text-center">
                      <p className="text-[9px] text-gray-500 uppercase font-black">YOU: {character.name.split(' ')[0]}</p>
                      <div className="w-full bg-white/5 h-2 rounded overflow-hidden mt-1 border border-white/10">
                        <div 
                          className="bg-amber-400 h-full transition-all duration-300" 
                          style={{ width: `${character.energy}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-amber-400 font-bold mt-1 uppercase">STAMINA: {character.energy}% </p>
                    </div>
                  </div>

                  {/* Static simulated battlefield animation graphics (swinging sword/banana) */}
                  <div className="w-full bg-white/5 h-1.5 rounded overflow-hidden mt-1.5">
                    <motion.div 
                      className="bg-amber-400 h-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: activeDungeon.durationSeconds, ease: 'linear' }}
                    />
                  </div>

                </div>
              ) : (
                <div className="py-4 text-center w-full space-y-3">
                  <Swords className="w-10 h-10 text-amber-500/50 mx-auto animate-pulse" />
                  <p className="text-xs text-amber-400 font-black uppercase tracking-wider">CROP WARFARE RADAR IDLE</p>
                  <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Select a crop field dungeon of interest below, check subclass barriers and level requirements, consume stamina energy to **EMBARK**!
                  </p>
                </div>
              )}
            </div>

            {/* REAL TIME CONSOLE BATTLE LOGS */}
            <div className="mt-4 bg-[#050505] rounded-xl p-3 border border-white/15 h-36 overflow-y-auto text-left flex flex-col-reverse gap-1.5 shadow-inner">
              {adventureLogs.map((log, index) => (
                <div key={index} className="text-[10px] leading-relaxed select-text flex items-start gap-1.5 font-bold">
                  <span className="text-amber-500 font-extrabold shrink-0">$ admin_log &gt;</span>
                  <span className="text-gray-300 font-mono">{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DECK CROP DUNGEONS SECTION */}
          <div className="bg-[#111111] border-2 border-amber-500/40 rounded-xl p-4 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider pb-2 border-b border-amber-500/20 flex items-center gap-1.5 select-none">
              <Swords className="w-4 h-4 text-amber-500" /> CROP DUNGEONS & COMBAT RAIDS
            </h3>

            <div className="space-y-4">
              {DUNGEONS.map(dun => {
                const weatherMod = WEATHER_TYPES[weatherId];
                const goldFinal = Math.round(dun.goldReward * weatherMod.farmBonus * activeClass.perkMultiplier.gold);
                const xpFinal = Math.round(dun.xpReward * weatherMod.farmBonus);
                const isUnderLevel = character.level < dun.levelReq;
                const finalEnergyCost = Math.round(dun.energyCost * weatherMod.energyLossRate * activeClass.perkMultiplier.energyCost);
                const isFIFO = dun.type === 'outback';
                const hasCamry = equipmentList.find(e => e.id === 'camry')?.purchased;

                return (
                  <div key={dun.id} className="bg-black/40 rounded-xl p-3 md:p-4 border border-white/10 hover:border-amber-500/40 transition-colors flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-xs uppercase tracking-wider">{dun.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">REQ. LEVEL {dun.levelReq}</span>
                        {isFIFO && <span className="text-[9px] font-black uppercase tracking-wider bg-red-600/15 text-red-500 border border-red-500/20 px-2 py-0.5 rounded">CAMRY MANDATORY</span>}
                      </div>

                      <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{dun.description}</p>
                      
                      {/* Rewards loot block */}
                      <div className="flex gap-4 items-center text-[10px] font-bold text-gray-500 flex-wrap font-mono">
                        <span className="text-amber-400">REWARD: {symbol}{(goldFinal * exchangeRate).toFixed(0)} GLD</span>
                        <span className="text-amber-300">XP: +{xpFinal}</span>
                        {dun.farmDaysReward > 0 && <span className="text-emerald-400">VISA DAY RECOVERY: +{dun.farmDaysReward} DAYS</span>}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between md:justify-center items-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4 min-w-[125px]">
                      <div className="text-center md:text-right">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">CONSUMED</p>
                        <p className="text-xs font-black text-rose-400">-{finalEnergyCost} HP</p>
                      </div>

                      <button 
                        disabled={questingTimeLeft !== null || isUnderLevel || (isFIFO && !hasCamry)}
                        onClick={() => { triggerSound('click'); embarkOnDungeon(dun); }}
                        className="w-full md:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded active:scale-95 disabled:opacity-40 tracking-wider uppercase transition-colors flex items-center justify-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 shrink-0" /> FIGHT
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INFRASTRUCTURE EQUIPMENT INVENTORY STORE */}
          <div className="bg-[#111111] border-2 border-amber-500/40 rounded-xl p-4 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider pb-2 border-b border-amber-500/20 flex items-center gap-1.5 select-none">
              <ShoppingBag className="w-4 h-4 text-amber-500" /> ARMORY OUTFITTER GEAR STORE
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipmentList.map(item => (
                <div key={item.id} className="bg-black/50 border border-white/10 rounded-xl p-3 flex gap-3 relative overflow-hidden hover:border-amber-500/20 transition-all duration-150">
                  <div className="w-10 h-10 bg-[#151515] rounded border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                    <item.icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase leading-tight">{item.name}</h4>
                        <span className={`text-[8px] font-black tracking-widest uppercase ${
                          item.rarity === 'Legendary' ? 'text-rose-500' : (item.rarity === 'Epic' ? 'text-purple-400' : 'text-gray-400')
                        }`}>{item.rarity}</span>
                      </div>
                      
                      {!item.purchased && (
                        <span className="text-xs font-bold text-amber-400 shrink-0 font-mono">{symbol}{(item.cost * exchangeRate).toFixed(0)}</span>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-400 font-sans leading-normal">{item.description}</p>
                    <p className="text-[10px] font-bold text-emerald-400 font-mono">STATS: {item.effect}</p>

                    <div className="pt-2 select-none">
                      {!item.purchased ? (
                        <button 
                          onClick={() => buyEquipment(item)}
                          disabled={character.gold < item.cost}
                          className="w-full text-center py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-extrabold rounded text-[11px] transition-colors"
                        >
                          BUY UPGRADE
                        </button>
                      ) : (
                        <button 
                          onClick={() => toggleEquip(item.id)}
                          className={`w-full text-center py-1 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1 border ${
                            item.equipped 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-extrabold shadow-[0_0_5px_rgba(16,185,129,0.15)]' 
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 border-white/10 hover:text-white'
                          }`}
                        >
                          {item.equipped ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> ACTIVE MOUNTED
                            </>
                          ) : 'MOUNT GEAR'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GOAL SIGN-OFF DECK PROGRESS */}
          <div className="bg-amber-500/5 border-2 border-amber-500/40 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
            <div className="space-y-1 text-left">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> SECURE 2ND YEAR VISA SIGN-OFF DAYS
              </h4>
              <p className="text-[11px] text-gray-400 max-w-sm leading-relaxed font-sans">
                Accumulate specified crop days of harvest and outback offshore deckhand tasks. Upon hitting 88 days logged, complete the WHV quest loop!
              </p>
            </div>

            <div className="text-center md:text-right w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-amber-500/20 pt-3 md:pt-0 md:pl-4">
              <span className="text-2xl font-black text-white">{character.visaDays} <span className="text-xs text-gray-500 block uppercase font-bold tracking-widest mt-0.5">SPECIFIED DAYS</span></span>
              <div className="mt-2 select-none">
                {character.visaDays >= 88 ? (
                  <span className="bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-400">
                    QUEST UNLOCKED: 2ND YEAR VISA 👑
                  </span>
                ) : (
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-white/5 inline-block">
                    REMAINING: {Math.max(0, 88 - character.visaDays)} DAYS
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
