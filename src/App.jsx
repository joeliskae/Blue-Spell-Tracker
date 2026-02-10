import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Filter, MapPin, Target } from 'lucide-react';
import { SPELL_DATA } from './spelldata.js';
import { BUILD_PRESETS } from './buildData.js';


const BlueTrackerApp = () => {
  const [learnedSpells, setLearnedSpells] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('number');
  const [filterType, setFilterType] = useState('all');
  const [filterRank, setFilterRank] = useState('all');
  const [activeBuild, setActiveBuild] = useState('none'); // Build preset selector

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

  // Handle build preset change
  const handleBuildChange = (build) => {
    setActiveBuild(build);
    if (build !== 'none') {
      setShowAll(true); // Automatically show all spells when selecting a build
    }
    if (build === 'none') {
      setShowAll(false);
    }
  };

  // Get filtered and sorted spells
  const getFilteredSpells = () => {
    let filtered = SPELL_DATA;

    // Filter by build preset first
    if (activeBuild !== 'none' && BUILD_PRESETS[activeBuild]) {
      filtered = filtered.filter(s => BUILD_PRESETS[activeBuild].includes(s.id));
    }

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
          <div className="flex justify-between items-center">
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
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <option value="1">★</option>
                <option value="2">★★</option>
                <option value="3">★★★</option>
                <option value="4">★★★★</option>
                <option value="5">★★★★★</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Build Preset</label>
              <select 
                value={activeBuild} 
                onChange={(e) => handleBuildChange(e.target.value)}
                className="w-full p-2 border border-indigo-400 rounded-lg bg-indigo-50"
              >
                <option value="none">No Preset</option>
                <option value="solo">Solo</option>
                <option value="dungeonTank">Dungeon Tank</option>
                <option value="dungeonHealer">Dungeon Healer</option>
                <option value="dungeonDps">Dungeon DPS</option>
                <option value="raidTank">Raid Tank</option>
                <option value="raidHealer">Raid Main Healer</option>
                <option value="raidOffHeal">Raid Off Healer</option>
                <option value="raidDps">Raid DPS</option>
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
                          {spells.map(s => `${s.name} #${s.id}`).join(', ')}
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
                          {spells.map(s => `${s.name} #${s.id}`).join(', ')}
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
                  className={`p-3 rounded-lg border-2 transition-all ${
                    learnedSpells.has(spell.id)
                      ? 'bg-gray-50 border-gray-300 opacity-75'
                      : 'bg-white border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Row 1: #3 TYPE Lv 50 */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">#{spell.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${getTypeColor(spell.type)}`}>
                          {spell.type}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">Lv {spell.level}</span>
                      </div>
                      
                      {/* Row 2: SPELL NAME **** */}
                      <a 
                        href={getSpellWikiUrl(spell.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base text-indigo-700 hover:text-indigo-900 hover:underline block mb-2"
                      >
                        {spell.name} <span className="text-yellow-600 text-xs">{getRankStars(spell.rank)}</span>
                      </a>
                      
                      {/* Row 3 & 4: Icon on left, location & mob on right */}
                      <div className="flex items-start gap-3">
                        {/* Spell Icon */}
                        <img 
                          src={spell.icon} 
                          alt={spell.name}
                          className="w-10 h-10 flex-shrink-0 rounded border border-gray-300"
                        />
                        
                        {/* Location and mob info */}
                        <div className="flex-1 text-sm text-gray-600 space-y-0.5">
                          <p> {spell.location}</p>
                          <p className="text-indigo-700">
                          <span className="text-gray-500"> └ </span>
                               {spell.mob}
                            {spell.coords && <span className="text-gray-500 ml-1 text-xs">({spell.coords})</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Checkbox */}
                    <button
                      onClick={(e) => toggleSpell(spell.id, e)}
                      className={`ml-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${learnedSpells.has(spell.id)
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      <Check size={24} className={learnedSpells.has(spell.id) ? 'text-white' : 'text-gray-400'} />
                    </button>
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