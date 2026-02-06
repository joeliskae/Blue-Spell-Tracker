import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Filter, MapPin } from 'lucide-react';


// Complete spell data with mob names and coordinates
const SPELL_DATA = [
  { id: 1, name: 'Water Cannon', rank: 1, type: 'Damage', level: 1, location: 'Default', mob: 'Starting Spell', coords: '' },
  { id: 2, name: 'Flame Thrower', rank: 4, type: 'Damage', level: 50, location: "Brayflox's Longstop (Hard)", mob: 'Gobmachine G-VI', coords: '' },
  { id: 3, name: 'Aqua Breath', rank: 4, type: 'Damage', level: 50, location: "The Dragon's Neck", mob: 'Ultros', coords: '' },
  { id: 4, name: 'Flying Frenzy', rank: 3, type: 'Damage', level: 1, location: 'Pharos Sirius', mob: 'Zu', coords: '' },
  { id: 5, name: 'Drill Cannons', rank: 2, type: 'Damage', level: 1, location: 'Northern Thanalan', mob: 'Magitek Vanguard H-2', coords: 'X:16 Y:15' },
  { id: 6, name: 'High Voltage', rank: 4, type: 'Damage', level: 50, location: 'Binding Coil Turn 1', mob: 'ADS', coords: '' },
  { id: 7, name: 'Loom', rank: 1, type: 'Utility', level: 1, location: 'Northern Thanalan', mob: 'Flame Sergeant Dalvag', coords: '' },
  { id: 8, name: 'Final Sting', rank: 2, type: 'Damage', level: 1, location: 'Middle La Noscea', mob: 'Killer Wespe', coords: 'X:15 Y:15' },
  { id: 9, name: 'Song of Torment', rank: 2, type: 'Damage', level: 1, location: 'Pharos Sirius', mob: 'Siren', coords: '' },
  { id: 10, name: 'Glower', rank: 4, type: 'Damage', level: 1, location: 'The Aurum Vale', mob: 'Coincounter', coords: '' },
  { id: 11, name: 'Plaincracker', rank: 2, type: 'Damage', level: 1, location: 'North Shroud', mob: 'Clay Golem', coords: 'X:19 Y:29' },
  { id: 12, name: 'Bristle', rank: 2, type: 'Utility', level: 1, location: 'Central Shroud', mob: 'Angry Sow', coords: '' },
  { id: 13, name: 'White Wind', rank: 3, type: 'Heal', level: 1, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 14, name: 'Level 5 Petrify', rank: 2, type: 'Utility', level: 28, location: 'Haukke Manor', mob: 'Manor Sentry', coords: '' },
  { id: 15, name: 'Sharpened Knife', rank: 4, type: 'Damage', level: 1, location: "The Wanderer's Palace", mob: 'Tonberry King', coords: '' },
  { id: 16, name: 'Ice Spikes', rank: 1, type: 'Utility', level: 1, location: 'Central Shroud', mob: 'Trickster Imp', coords: 'X:27 Y:24' },
  { id: 17, name: 'Blood Drain', rank: 1, type: 'Damage', level: 1, location: 'Central Shroud', mob: 'Chigoe', coords: 'X:25 Y:20' },
  { id: 18, name: 'Acorn Bomb', rank: 1, type: 'Damage', level: 1, location: 'North Shroud', mob: 'Treant Sapling', coords: 'X:27 Y:28' },
  { id: 19, name: 'Bomb Toss', rank: 2, type: 'Damage', level: 1, location: 'Middle La Noscea', mob: 'Goblin Fisher', coords: 'X:23 Y:21' },
  { id: 20, name: 'Off-guard', rank: 2, type: 'Utility', level: 1, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 21, name: 'Self-destruct', rank: 1, type: 'Damage', level: 1, location: 'Western Thanalan', mob: 'Glide Bomb', coords: 'X:27 Y:16' },
  { id: 22, name: 'Transfusion', rank: 2, type: 'Utility', level: 1, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 23, name: 'Faze', rank: 3, type: 'Utility', level: 1, location: 'Central Thanalan', mob: 'Qiqirn Shellsweeper', coords: 'X:16 Y:19' },
  { id: 24, name: 'Flying Sardine', rank: 1, type: 'Damage', level: 1, location: 'Eastern La Noscea', mob: 'Apkallu', coords: 'X:27 Y:35' },
  { id: 25, name: 'Snort', rank: 4, type: 'Utility', level: 50, location: "The Dragon's Neck", mob: 'Typhon', coords: '' },
  { id: 26, name: '4-tonze Weight', rank: 4, type: 'Damage', level: 50, location: "The Dragon's Neck", mob: 'Ultros', coords: '' },
  { id: 27, name: 'The Look', rank: 2, type: 'Utility', level: 1, location: 'Mor Dhona', mob: 'Denizen of the Dark', coords: 'X:29 Y:12' },
  { id: 28, name: 'Bad Breath', rank: 3, type: 'Utility', level: 1, location: 'Central Shroud', mob: 'Stroper', coords: 'X:13 Y:21' },
  { id: 29, name: 'Diamondback', rank: 4, type: 'Tank', level: 50, location: 'Stone Vigil (Hard)', mob: 'Cuca Fera', coords: '' },
  { id: 30, name: 'Mighty Guard', rank: 4, type: 'Tank', level: 1, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 31, name: 'Sticky Tongue', rank: 4, type: 'Utility', level: 1, location: 'Central Thanalan', mob: 'Toxic Toad', coords: 'X:27 Y:19' },
  { id: 32, name: 'Toad Oil', rank: 3, type: 'Utility', level: 1, location: 'Western Thanalan', mob: 'Giggling Gigantoad', coords: 'X:15 Y:7' },
  { id: 33, name: "The Ram's Voice", rank: 2, type: 'Damage', level: 1, location: "Cutter's Cry", mob: 'Chimera', coords: '' },
  { id: 34, name: "The Dragon's Voice", rank: 2, type: 'Damage', level: 1, location: "Cutter's Cry", mob: 'Chimera', coords: '' },
  { id: 35, name: 'Missile', rank: 4, type: 'Damage', level: 50, location: 'Battle in the Big Keep', mob: 'Enkidu', coords: '' },
  { id: 36, name: '1000 Needles', rank: 4, type: 'Damage', level: 1, location: 'Southern Thanalan', mob: 'Sabotender Bailaor', coords: 'X:16 Y:15' },
  { id: 37, name: 'Ink Jet', rank: 3, type: 'Damage', level: 50, location: 'Sastasha (Hard)', mob: 'Kraken', coords: '' },
  { id: 38, name: 'Fire Angon', rank: 3, type: 'Damage', level: 50, location: "Wanderer's Palace (Hard)", mob: 'Frumious Koheel Ja', coords: '' },
  { id: 39, name: 'Moon Flute', rank: 1, type: 'Utility', level: 50, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 40, name: 'Tail Screw', rank: 4, type: 'Damage', level: 1, location: 'Sastasha (Hard)', mob: 'Karlabos', coords: '' },
  { id: 41, name: 'Mind Blast', rank: 1, type: 'Damage', level: 1, location: 'Tam-Tara Deepcroft', mob: 'Galvanth the Dominator', coords: '' },
  { id: 42, name: 'Doom', rank: 4, type: 'Utility', level: 50, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 43, name: 'Peculiar Light', rank: 2, type: 'Utility', level: 1, location: 'Mor Dhona', mob: 'Lentic Mudpuppy', coords: 'X:13 Y:10' },
  { id: 44, name: 'Feather Rain', rank: 5, type: 'Damage', level: 50, location: 'Howling Eye (Extreme)', mob: 'Garuda', coords: '' },
  { id: 45, name: 'Eruption', rank: 5, type: 'Damage', level: 20, location: 'Bowl of Embers', mob: 'Ifrit', coords: '' },
  { id: 46, name: 'Mountain Buster', rank: 5, type: 'Damage', level: 50, location: 'Navel (Hard)', mob: 'Titan', coords: '' },
  { id: 47, name: 'Shock Strike', rank: 5, type: 'Damage', level: 50, location: 'Striking Tree (Hard)', mob: 'Ramuh', coords: '' },
  { id: 48, name: 'Glass Dance', rank: 5, type: 'Damage', level: 50, location: 'Akh Afah (Extreme)', mob: 'Shiva', coords: '' },
  { id: 49, name: 'Veil of the Whorl', rank: 5, type: 'Utility', level: 50, location: 'Whorleater (Hard)', mob: 'Leviathan', coords: '' },
  { id: 50, name: 'Alpine Draft', rank: 2, type: 'Damage', level: 1, location: 'The Dusk Vigil', mob: 'Opinicus', coords: '' },
  { id: 51, name: 'Protean Wave', rank: 3, type: 'Damage', level: 1, location: 'Alexander A2', mob: 'Living Liquid', coords: '' },
  { id: 52, name: 'Northerlies', rank: 4, type: 'Damage', level: 1, location: 'Coerthas Western Highlands', mob: 'Lone Yeti', coords: 'X:20 Y:31' },
  { id: 53, name: 'Electrogenesis', rank: 2, type: 'Damage', level: 1, location: 'Sea of Clouds', mob: 'Conodont', coords: 'X:26 Y:33' },
  { id: 54, name: 'Kaltstrahl', rank: 2, type: 'Damage', level: 60, location: 'Alexander A1', mob: 'Faust', coords: '' },
  { id: 55, name: 'Abyssal Transfixion', rank: 4, type: 'Damage', level: 1, location: 'Foundation', mob: 'Arch Demon', coords: 'X:10 Y:10' },
  { id: 56, name: 'Chirp', rank: 1, type: 'Utility', level: 1, location: 'Sea of Clouds', mob: 'Paissa', coords: 'X:19 Y:35' },
  { id: 57, name: 'Eerie Soundwave', rank: 2, type: 'Utility', level: 1, location: 'Battle in the Big Keep', mob: 'Enkidu', coords: '' },
  { id: 58, name: 'Pom Cure', rank: 3, type: 'Heal', level: 50, location: 'Thornmarch (Hard)', mob: 'Furryfoot Kupli Kipp', coords: '' },
  { id: 59, name: 'Gobskin', rank: 4, type: 'Tank', level: 1, location: 'Alexander A12', mob: 'Alexandrian Hider', coords: '' },
  { id: 60, name: 'Magic Hammer', rank: 2, type: 'Utility', level: 60, location: 'Great Gubal Library (Hard)', mob: 'Apanda', coords: '' },
  { id: 61, name: 'Avail', rank: 1, type: 'Tank', level: 60, location: "Saint Mocianne's Arboretum", mob: 'Queen Hawk', coords: '' },
  { id: 62, name: 'Frog Legs', rank: 1, type: 'Damage', level: 1, location: 'Dravanian Hinterlands', mob: 'Poroggo', coords: 'X:12 Y:34' },
  { id: 63, name: 'Sonic Boom', rank: 4, type: 'Damage', level: 1, location: 'Pharos Sirius', mob: 'Zu', coords: '' },
  { id: 64, name: 'Whistle', rank: 3, type: 'Utility', level: 1, location: 'Sea of Clouds', mob: 'Dhalmel', coords: 'X:16 Y:32' },
  { id: 65, name: "White Knight's Tour", rank: 2, type: 'Damage', level: 57, location: 'The Vault', mob: 'White Knight', coords: '' },
  { id: 66, name: "Black Knight's Tour", rank: 2, type: 'Damage', level: 57, location: 'The Vault', mob: 'Black Knight', coords: '' },
  { id: 67, name: 'Level 5 Death', rank: 4, type: 'Damage', level: 59, location: 'Great Gubal Library', mob: 'Page 64', coords: '' },
  { id: 68, name: 'Launcher', rank: 2, type: 'Damage', level: 1, location: 'The Peaks', mob: 'Lethal Weapon', coords: '' },
  { id: 69, name: 'Perpetual Ray', rank: 4, type: 'Damage', level: 60, location: 'Alexander A4', mob: 'The Manipulator', coords: '' },
  { id: 70, name: 'Cactguard', rank: 1, type: 'Tank', level: 50, location: 'Sunken Temple (Hard)', mob: 'Sabotender Guardia', coords: '' },
  { id: 71, name: 'Revenge Blast', rank: 2, type: 'Damage', level: 50, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 72, name: 'Angel Whisper', rank: 4, type: 'Heal', level: 60, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 73, name: 'Exuviation', rank: 2, type: 'Heal', level: 1, location: 'Sea of Clouds', mob: 'Abalathian Wamoura', coords: 'X:10 Y:17' },
  { id: 74, name: 'Reflux', rank: 3, type: 'Damage', level: 1, location: 'Churning Mists', mob: 'Cloud Wyvern', coords: 'X:24 Y:29' },
  { id: 75, name: 'Devour', rank: 1, type: 'Utility', level: 1, location: 'Lost City of Amdapor', mob: 'Decaying Gourmand', coords: '' },
  { id: 76, name: 'Condensed Libra', rank: 3, type: 'Utility', level: 60, location: 'Great Gubal Library (Hard)', mob: 'Mechanoscribe', coords: '' },
  { id: 77, name: 'Aetheric Mimicry', rank: 4, type: 'Utility', level: 60, location: 'Pharos Sirius (Hard)', mob: 'Ghrah Luminary', coords: '' },
  { id: 78, name: 'Surpanakha', rank: 5, type: 'Damage', level: 53, location: 'Thok ast Thok (Hard)', mob: 'Ravana', coords: '' },
  { id: 79, name: 'Quasar', rank: 5, type: 'Damage', level: 60, location: 'Containment Bay P1T6', mob: 'Sophia', coords: '' },
  { id: 80, name: 'J Kick', rank: 5, type: 'Damage', level: 60, location: 'Alexander A8', mob: 'Brute Justice', coords: '' },
  { id: 81, name: 'Triple Trident', rank: 1, type: 'Damage', level: 1, location: 'Yanxia', mob: 'Ebisu Catfish', coords: 'X:28 Y:6' },
  { id: 82, name: 'Tingle', rank: 2, type: 'Utility', level: 1, location: 'Yanxia', mob: 'Ebisu Catfish', coords: 'X:28 Y:6' },
  { id: 83, name: 'Tatami-gaeshi', rank: 3, type: 'Tank', level: 70, location: 'Kugane Castle', mob: 'Dojun-maru', coords: '' },
  { id: 84, name: 'Cold Fog', rank: 4, type: 'Damage', level: 70, location: 'The Burn', mob: 'Mist Dragon', coords: '' },
  { id: 85, name: 'Stotram', rank: 2, type: 'Utility', level: 67, location: 'Emanation', mob: 'Lakshmi', coords: '' },
  { id: 86, name: 'Saintly Beam', rank: 2, type: 'Damage', level: 70, location: 'Sigmascape V1.0', mob: 'Phantom Train', coords: '' },
  { id: 87, name: 'Feculent Flood', rank: 1, type: 'Damage', level: 1, location: "Saint Mocianne's (Hard)", mob: 'Tokkapchi', coords: '' },
  { id: 88, name: "Angel's Snack", rank: 3, type: 'Heal', level: 70, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 89, name: 'Chelonian Gate', rank: 4, type: 'Tank', level: 70, location: "Hells' Lid", mob: 'Genbu', coords: '' },
  { id: 90, name: 'The Rose of Destruction', rank: 2, type: 'Damage', level: 70, location: 'Temple of the Fist', mob: 'Ivon Coeurlfist', coords: '' },
  { id: 91, name: 'Basic Instinct', rank: 2, type: 'Utility', level: 1, location: 'Upper La Noscea', mob: 'Master Coeurl', coords: 'X:8.9 Y:21.4' },
  { id: 92, name: 'Ultravibration', rank: 1, type: 'Damage', level: 1, location: 'The Peaks', mob: 'Kongamato', coords: 'X:11 Y:25' },
  { id: 93, name: 'Blaze', rank: 2, type: 'Damage', level: 70, location: 'Deltascape V1.0', mob: 'Alte Roite', coords: '' },
  { id: 94, name: 'Mustard Bomb', rank: 4, type: 'Damage', level: 70, location: 'Alphascape V3.0', mob: 'Omega', coords: '' },
  { id: 95, name: 'Dragon Force', rank: 3, type: 'Utility', level: 1, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 96, name: 'Aetherial Spark', rank: 1, type: 'Damage', level: 1, location: 'The Lochs', mob: 'Salt Dhruva', coords: 'X:22 Y:22' },
  { id: 97, name: 'Hydro Pull', rank: 4, type: 'Utility', level: 70, location: 'Drowned City of Skalla', mob: 'Kelpie', coords: '' },
  { id: 98, name: 'Malediction of Water', rank: 2, type: 'Damage', level: 70, location: "Swallow's Compass", mob: 'Sai Taisui', coords: '' },
  { id: 99, name: 'Choco Meteor', rank: 1, type: 'Damage', level: 1, location: 'Dravanian Forelands', mob: 'Courser Chocobo', coords: 'X:37.5 Y:23.7' },
  { id: 100, name: 'Matra Magic', rank: 3, type: 'Damage', level: 70, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 101, name: 'Peripheral Synthesis', rank: 4, type: 'Utility', level: 70, location: 'Alphascape V3.0', mob: 'Omega', coords: '' },
  { id: 102, name: 'Both Ends', rank: 5, type: 'Damage', level: 70, location: "Swallow's Compass", mob: 'Qitian Dasheng', coords: '' },
  { id: 103, name: 'Phantom Flurry', rank: 5, type: 'Damage', level: 70, location: "Hells' Kier", mob: 'Suzaku', coords: '' },
  { id: 104, name: 'Nightbloom', rank: 5, type: 'Damage', level: 70, location: 'Castrum Fluminis', mob: 'Tsukuyomi', coords: '' },
  { id: 105, name: 'Goblin Punch', rank: 1, type: 'Damage', level: 1, location: 'Kholusia', mob: 'Hobgoblin', coords: 'X:37 Y:28' },
  { id: 106, name: 'Right Round', rank: 2, type: 'Damage', level: 77, location: "Malikah's Well", mob: 'Greater Armadillo', coords: '' },
  { id: 107, name: 'Schiltron', rank: 1, type: 'Tank', level: 1, location: 'Amh Araeng', mob: 'Long-tailed Armadillo', coords: 'X:17 Y:30' },
  { id: 108, name: 'Rehydration', rank: 1, type: 'Heal', level: 1, location: 'Amh Araeng', mob: 'Slippery Armadillo', coords: 'X:32.5 Y:9.5' },
  { id: 109, name: 'Breath of Magic', rank: 3, type: 'Utility', level: 80, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 110, name: 'Wild Rage', rank: 4, type: 'Damage', level: 80, location: "Heroes' Gauntlet", mob: 'Spectral Berserker', coords: '' },
  { id: 111, name: 'Peat Pelt', rank: 2, type: 'Damage', level: 80, location: "Matoya's Relict", mob: 'Mudman', coords: '' },
  { id: 112, name: 'Deep Clean', rank: 3, type: 'Utility', level: 80, location: 'Grand Cosmos', mob: 'Seeker Of Solitude', coords: '' },
  { id: 113, name: 'Ruby Dynamics', rank: 4, type: 'Damage', level: 80, location: 'Cinder Drift', mob: 'Ruby Weapon', coords: '' },
  { id: 114, name: 'Divination Rune', rank: 4, type: 'Utility', level: 73, location: 'Dancing Plague', mob: 'Titania', coords: '' },
  { id: 115, name: 'Dimensional Shift', rank: 4, type: 'Utility', level: 80, location: "Eden's Gate: Resurrection", mob: 'Eden Prime', coords: '' },
  { id: 116, name: 'Conviction Marcato', rank: 3, type: 'Damage', level: 79, location: 'Mt. Gulg', mob: 'Forgiven Obscenity', coords: '' },
  { id: 117, name: 'Force Field', rank: 3, type: 'Tank', level: 1, location: 'Ul\'dah - Steps of Thal', mob: 'Wayward Gaheel Ja (Totem)', coords: 'X:12.5 Y:12.9' },
  { id: 118, name: 'Winged Reprobation', rank: 3, type: 'Damage', level: 79, location: 'Crown of the Immaculate', mob: 'Innocence', coords: '' },
  { id: 119, name: 'Laser Eye', rank: 3, type: 'Damage', level: 80, location: "Eden's Promise: Eternity", mob: 'Eden\'s Promise', coords: '' },
  { id: 120, name: 'Candy Cane', rank: 2, type: 'Damage', level: 73, location: 'Dohn Mheg', mob: 'Aenc Thon', coords: '' },
  { id: 121, name: 'Mortal Flame', rank: 3, type: 'Damage', level: 80, location: 'Grand Cosmos', mob: 'Lugus', coords: '' },
  { id: 122, name: 'Sea Shanty', rank: 5, type: 'Utility', level: 80, location: "Matoya's Relict", mob: 'Nixie', coords: '' },
  { id: 123, name: 'Apokalypsis', rank: 5, type: 'Damage', level: 80, location: 'Amaurot', mob: 'Therion', coords: '' },
  { id: 124, name: 'Being Mortal', rank: 5, type: 'Damage', level: 73, location: 'Dancing Plague', mob: 'Titania', coords: '' }
];

const BlueTrackerApp = () => {
  const [learnedSpells, setLearnedSpells] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('number');
  const [filterType, setFilterType] = useState('all');
  const [filterRank, setFilterRank] = useState('all');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ffxiv-blue-mage-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setLearnedSpells(new Set(data.learned || []));
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  // Save to localStorage whenever learned spells change
  useEffect(() => {
    const data = {
      learned: Array.from(learnedSpells),
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('ffxiv-blue-mage-progress', JSON.stringify(data));
    console.log(data);
  }, [learnedSpells]);

  const toggleSpell = (id, e) => {
    e.stopPropagation(); // Prevent click from bubbling
    const newLearned = new Set(learnedSpells);
    if (newLearned.has(id)) {
      newLearned.delete(id);
    } else {
      newLearned.add(id);
    }
    setLearnedSpells(newLearned);
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setLearnedSpells(new Set());
      localStorage.removeItem('ffxiv-blue-mage-progress');
    }
  };

  // Get filtered and sorted spells
  const getFilteredSpells = () => {
    let filtered = SPELL_DATA;

    if (filterType !== 'all') {
      filtered = filtered.filter(s => s.type === filterType);
    }

    if (filterRank !== 'all') {
      filtered = filtered.filter(s => s.rank === parseInt(filterRank));
    }

    if (!showAll) {
      filtered = filtered.filter(s => !learnedSpells.has(s.id));
    }

    // Sort
    switch (sortBy) {
      case 'number':
        return [...filtered].sort((a, b) => a.id - b.id);
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'level':
        return [...filtered].sort((a, b) => a.level - b.level);
      case 'location':
        return [...filtered].sort((a, b) => a.location.localeCompare(b.location));
      case 'type':
        return [...filtered].sort((a, b) => a.type.localeCompare(b.type));
      default:
        return filtered;
    }
  };

  // Group spells by location and categorize by player count
  const getLocationGroups = () => {
    const filtered = getFilteredSpells();
    const groups = {};
    
    // Filter out Whalaqee Totem spells (NPC in Ul'dah)
    const instanceSpells = filtered.filter(spell => 
      !spell.location.includes('Ul\'dah') && 
      !spell.mob.includes('Totem') &&
      !spell.location.includes('Default')
    );
    
    instanceSpells.forEach(spell => {
      if (!groups[spell.location]) {
        groups[spell.location] = [];
      }
      groups[spell.location].push(spell);
    });

    // Categorize locations by player count
    const dungeonKeywords = ['Longstop', 'Vigil', 'Manor', 'Palace', 'Sastasha', 'Deepcroft', 'Vale', 'Mines', 'Qarn', 
                             'Amdapor', 'Halatali', 'Castle', 'Vault', 'Library', 'Arboretum', 'Compass', 'Fist', 
                             'Skalla', 'Cosmos', 'Gauntlet', 'Relict', 'Gulg', 'Mheg', 'Amaurot', 'Well', 'Burn', 
                             'Dzemael', 'Cutter', 'Snowcloak', 'Shisui', 'Sirensong', 'Doma'];
    
    const trialRaidKeywords = ['Neck', 'Embers', 'Navel', 'Howling', 'Whorleater', 'Keep', 'Thornmarch', 'Tree', 
                               'Amphitheatre', 'Thok ast Thok', 'Containment', 'Emanation', 'Kier', 'Fluminis', 
                               'Plague', 'Immaculate', 'Drift', 'Coil', 'Alexander', 'Deltascape', 'Sigmascape', 
                               'Alphascape', 'Eden'];
    
    const categorized = {
      fourPlayer: [],
      eightPlayer: []
    };

    Object.entries(groups)
      .filter(([_, spells]) => spells.length > 1)
      .forEach(([location, spells]) => {
        if (dungeonKeywords.some(keyword => location.includes(keyword))) {
          categorized.fourPlayer.push([location, spells]);
        } else if (trialRaidKeywords.some(keyword => location.includes(keyword))) {
          categorized.eightPlayer.push([location, spells]);
        }
        // If it doesn't match either, it's open world and we skip it
      });

    // Sort each category by spell count and take top 3
    categorized.fourPlayer.sort((a, b) => b[1].length - a[1].length);
    categorized.eightPlayer.sort((a, b) => b[1].length - a[1].length);

    return categorized;
  };

  const filteredSpells = getFilteredSpells();
  const locationGroups = getLocationGroups();
  const progress = Math.round((learnedSpells.size / SPELL_DATA.length) * 100);

  const getRankStars = (rank) => '★'.repeat(rank);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Damage': return 'bg-red-100 text-red-800';
      case 'Heal': return 'bg-green-100 text-green-800';
      case 'Tank': return 'bg-blue-100 text-blue-800';
      case 'Utility': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Damage': return '⚔️';
      case 'Heal': return '💚';
      case 'Tank': return '🛡️';
      case 'Utility': return '🔮';
      default: return '✨';
    }
  };

  // Generate spell icon URL (using consolegameswiki pattern)
  const getSpellIconUrl = (spellName) => {
    const formatted = spellName.replace(/'/g, '%27').replace(/ /g, '_');
    return `https://ffxiv.consolegameswiki.com/mediawiki/images/thumb/${formatted}.png/20px-${formatted}.png`;
  };

  // Generate spell wiki URL
  const getSpellWikiUrl = (spellName) => {
    const formatted = spellName.replace(/ /g, '_').replace(/'/g, '%27');
    return `https://ffxiv.consolegameswiki.com/wiki/${formatted}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">FFXIV Blue Mage Spell Tracker</h1>
          <p className="text-gray-600 mb-4">Track your progress collecting all 124 Blue Mage spells!</p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-indigo-700">Progress</span>
              <span className="font-bold text-indigo-900">{learnedSpells.size} / {SPELL_DATA.length} ({progress}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showAll 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showAll ? 'Show Missing Only' : 'Show All Spells'}
            </button>
            
            <button onClick={resetProgress} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <RotateCcw size={18} />
              Reset All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-indigo-900">Filters & Sorting</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="number">Spell Number</option>
                <option value="name">Name</option>
                <option value="level">Level</option>
                <option value="location">Location</option>
                <option value="type">Type</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="Damage">⚔️ Damage</option>
                <option value="Heal">💚 Heal</option>
                <option value="Tank">🛡️ Tank</option>
                <option value="Utility">🔮 Utility</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Rank</label>
              <select 
                value={filterRank} 
                onChange={(e) => setFilterRank(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Ranks</option>
                <option value="1">★ (Easy)</option>
                <option value="2">★★</option>
                <option value="3">★★★</option>
                <option value="4">★★★★</option>
                <option value="5">★★★★★ (Hard)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Results</label>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-900 font-semibold">
                {filteredSpells.length} spells
              </div>
            </div>
          </div>
        </div>

        {/* Location Suggestions */}
        {(locationGroups.fourPlayer.length > 0 || locationGroups.eightPlayer.length > 0) && !showAll && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={24} className="text-amber-600" />
              <h2 className="text-xl font-bold text-amber-900">Multiple spell locations</h2>
            </div>
            <p className="text-amber-800 mb-4">These instances have multiple spells you haven't learned yet:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 4-Player Content (Dungeons) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏰</span>
                  <h3 className="text-lg font-bold text-amber-900">Dungeons</h3>
                </div>
                {locationGroups.fourPlayer.length > 0 ? (
                  <div className="space-y-2">
                    {locationGroups.fourPlayer.slice(0, 3).map(([location, spells, number]) => (
                      <div key={location} className="bg-white rounded-lg p-3 border border-amber-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-amber-900 text-sm">{location}</h4>
                          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold text-xs">
                            {spells.length} spells
                          </span>
                        </div>
                        <p className="text-xs text-amber-700">
                          {spells.map(s => s.name).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 italic">No dungeon content with multiple spells</p>
                )}
              </div>

              {/* 8-Player Content (Trials & Raids) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚔️</span>
                  <h3 className="text-lg font-bold text-amber-900">Trials</h3>
                </div>
                {locationGroups.eightPlayer.length > 0 ? (
                  <div className="space-y-2">
                    {locationGroups.eightPlayer.slice(0, 3).map(([location, spells]) => (
                      <div key={location} className="bg-white rounded-lg p-3 border border-amber-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-amber-900 text-sm">{location}</h4>
                          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full font-bold text-xs">
                            {spells.length} spells
                          </span>
                        </div>
                        <p className="text-xs text-amber-700">
                          {spells.map(s => s.name).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 italic">No trial content with multiple spells</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Spell List - 3 COLUMNS */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">
            {showAll ? 'All Spells' : 'Missing Spells'} ({filteredSpells.length})
          </h2>
          
          {filteredSpells.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-2">Congratulations!</h3>
              <p className="text-gray-600">You've learned all the spells in this filter!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSpells.map(spell => (
                <div
                  key={spell.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    learnedSpells.has(spell.id)
                      ? 'bg-gray-50 border-gray-300 opacity-75'
                      : 'bg-white border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">#{spell.id}</span>
                        <span className="text-yellow-600 text-xs">{getRankStars(spell.rank)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTypeColor(spell.type)}`}>
                          {getTypeIcon(spell.type)} {spell.type}
                        </span>
                      </div>
                      <a 
                        href={getSpellWikiUrl(spell.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base text-indigo-700 hover:text-indigo-900 hover:underline block mb-1"
                      >
                        {spell.name}
                      </a>
                    </div>
                    
                    {/* Clickable checkbox icon only */}
                    <button
                      onClick={(e) => toggleSpell(spell.id, e)}
                      className={`ml-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                        learnedSpells.has(spell.id)
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <Check size={20} className={learnedSpells.has(spell.id) ? 'text-white' : 'text-gray-400'} />
                    </button>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600">
                      <span className="font-semibold">Lv {spell.level}</span> • 📍 {spell.location}
                    </p>
                    <p className="text-indigo-700 font-medium">
                      🎯 {spell.mob}
                      {spell.coords && <span className="text-gray-500 ml-1">({spell.coords})</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mt-1">Good luck collecting all the spells, Warrior of Light!</p>
          <p>💙 From Valentina with love 💙</p>
        </div>
      </div>
    </div>
  );
};

export default BlueTrackerApp;