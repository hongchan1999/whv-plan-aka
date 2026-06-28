/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { PlaneTakeoff, MapPin, DollarSign, Activity, HardHat, CarFront, AlertTriangle, Send, Loader2, Sparkles, Zap, List, Briefcase, Home, WalletCards, Star, Utensils, Bus, Car, Calculator, TrendingUp, DollarSign as DollarIcon, PiggyBank, Receipt, Info, Search, BookOpen, Clock, Heart, Gamepad2, Calendar, Trophy, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AnalysisResult, WorkItem, HostelItem, CostOfLivingItem, JourneyItem } from './types';
import { generateWorks, generateHostels, generateLivingCosts, JOURNEYS } from './data';
import VisaQuest from './components/VisaQuest';



const getSentimentColor = (score: number = 0) => {
  if (score >= 4) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  if (score === 3) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
};

const getSentimentText = (score: number = 0) => {
  if (score >= 4) return 'Grass Planting (Recommend)';
  if (score === 3) return 'Neutral';
  return 'Grass Pulling (Avoid / Red Flags)';
};

function ResultCard({ result }: { result: AnalysisResult }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8"
    >
      {result.title && (
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-medium text-white mb-2">{result.title}</h2>
          <div className="h-px w-full bg-white/10 mt-4" />
        </div>
      )}
      
      {/* Destination & Cost Card */}
      <div className="col-span-1 md:col-span-2 bg-[#111111] border border-white/5 p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-3 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Location Intelligence</span>
            </div>
            <div className="text-xl md:text-2xl text-white font-medium mb-1">
              {result.destination || "Unknown Location"}
            </div>
            {result.coordinatesOrAddress && (
              <div className="text-gray-400 text-sm font-mono mt-2">
                {result.coordinatesOrAddress}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-3 text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Financial Details</span>
            </div>
            <div className="text-lg md:text-xl text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5 inline-block w-full">
              {result.costs || "No financial data extracted"}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Card */}
      <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Activity className="w-4 h-4" />
            <span>Sentiment Analysis</span>
          </div>
          {result.sentimentScore !== undefined && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(result.sentimentScore)}`}>
              {getSentimentText(result.sentimentScore)} • {result.sentimentScore}/5
            </div>
          )}
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-6 font-mono bg-black/30 p-4 rounded-xl border border-white/5 flex-grow">
          {result.sentimentReasoning || "No reasoning provided."}
        </p>

        {result.prosAndCons && result.prosAndCons.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Key Takeaways</div>
            <ul className="space-y-2">
              {result.prosAndCons.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Career & Logistics */}
      <div className="space-y-4 md:space-y-6">
        
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <HardHat className="w-4 h-4" />
              <span>Career Evaluation</span>
            </div>
            <div className="flex gap-2">
              {result.hardWorkSuitable && (
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs font-medium">Hard Work OK</span>
              )}
              {result.visaExtension && (
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-xs font-medium">88 Days Visa</span>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {result.careerAdvice || "No specific career advice extracted."}
          </p>
        </div>

        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <CarFront className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4 relative z-10">
            <CarFront className="w-4 h-4" />
            <span>Non-Driver Logistics</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed relative z-10 font-mono">
             {result.logistics || "No logistics information found."}
          </p>
        </div>

      </div>
    </motion.div>
  );
}

function WorkCard({ 
  item, 
  activeQuestId, 
  questProgress, 
  onStart 
}: { 
  item: WorkItem, 
  activeQuestId: string | null, 
  questProgress: number, 
  onStart: (item: WorkItem) => void,
  key?: any
}) {
  const isDiffEasy = item.difficulty === 'Easy';
  const isDiffMed = item.difficulty === 'Medium';
  const isDiffHard = item.difficulty === 'Hard';
  const difficultyColors = isDiffEasy 
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
    : isDiffMed 
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
    : isDiffHard
    ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
    : 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]';

  const staminaCost = item.difficulty === 'Easy' ? 12 : (item.difficulty === 'Medium' ? 18 : (item.difficulty === 'Hard' ? 26 : 38));
  
  const isCurrentActive = activeQuestId === item.id;
  const isAnyActive = activeQuestId !== null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={`bg-[#0b0c10]/95 border-2 ${isCurrentActive ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-black' : 'border-amber-500/20 hover:border-amber-500/40'} p-5 md:p-6 rounded-2xl mb-6 transition-all duration-300 relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${isDiffEasy ? 'from-emerald-500 to-green-400' : isDiffMed ? 'from-amber-400 to-orange-400' : isDiffHard ? 'from-rose-500 to-orange-500' : 'from-purple-500 to-pink-500'}`} />

      {/* Header Info */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase font-black bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              ⚔️ TASK QUEST CONTRACT
            </span>
            <span className="text-[9px] text-indigo-400 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded font-mono uppercase font-bold">
              {item.natureOfBusiness || 'Horticulture'}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-mono mt-1">
            {item.title}
          </h3>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          {item.eligible88 && (
            <span className="px-2.5 py-1 bg-violet-500/15 text-violet-300 border border-violet-500/25 rounded font-black text-[9px] tracking-wider uppercase shrink-0">
              📜 88-Days Eligible
            </span>
          )}
          <span className={`px-2.5 py-0.5 ${difficultyColors} border rounded text-[9px] font-black uppercase tracking-wider shrink-0 text-center`}>
            Difficulty: {item.difficulty}
          </span>
        </div>
      </div>

      {/* Comprehensive Task Specs Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5 font-mono">
        
        {/* Destination Area */}
        <div className="bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition-all flex flex-col justify-between">
          <div className="text-gray-500 text-[9px] uppercase font-bold mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Destination (Area)
          </div>
          <div className="text-amber-300 font-extrabold text-xs">{item.area}</div>
        </div>

        {/* Nature Of Business */}
        <div className="bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition-all flex flex-col justify-between">
          <div className="text-gray-500 text-[9px] uppercase font-bold mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Nature of Business
          </div>
          <div className="text-gray-200 font-bold text-xs">{item.natureOfBusiness || 'Commercial Agriculture'}</div>
        </div>

        {/* Salary */}
        <div className="bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition-all flex flex-col justify-between">
          <div className="text-gray-500 text-[9px] uppercase font-bold mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Salary Offer
          </div>
          <div className="text-emerald-400 font-black text-xs">{item.salaryRange}</div>
        </div>

        {/* Working Hour */}
        <div className="bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition-all flex flex-col justify-between">
          <div className="text-gray-500 text-[9px] uppercase font-bold mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Working Hour
          </div>
          <div className="text-gray-300 font-bold text-xs">{item.workingHours || "38 hours / week"}</div>
        </div>

        {/* When to When */}
        <div className="bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition-all flex flex-col justify-between">
          <div className="text-gray-500 text-[9px] uppercase font-bold mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-violet-400 shrink-0" /> When to When
          </div>
          <div className="text-gray-300 font-bold text-xs">{item.dateRange || "Year-round roster"}</div>
        </div>

        {/* Working Days */}
        <div className="bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition-all flex flex-col justify-between">
          <div className="text-gray-500 text-[9px] uppercase font-bold mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Working Days
          </div>
          <div className="text-gray-300 font-bold text-xs">{item.workingDays || "Mon - Fri (Standard)"}</div>
        </div>

      </div>

      {/* Task Description */}
      <div className="bg-amber-500/[0.02] border border-amber-500/10 rounded-xl p-3 md:p-4 mb-4">
        <p className="text-amber-500/40 text-[9px] font-mono font-bold tracking-wider uppercase mb-1">TASK DESCRIPTION & REQUIREMENTS</p>
        <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
          {item.description || 'Deliver regular field maintenance operations, harvest seasonal bounty, catalog crates, and secure visa validation parameters on-site.'}
        </p>
      </div>

      {/* Bounty Rewards & Begin Quest Button */}
      <div className="border-t border-amber-500/15 pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[10px] text-gray-500 font-black tracking-wider uppercase shrink-0">BOUNTY REWARDS:</span>
          
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-amber-300 font-black text-xs shrink-0">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            +{(item.goldReward || 100).toFixed(0)} GLD
          </div>

          <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded text-indigo-300 font-black text-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            +{(item.xpReward || 80).toFixed(0)} EXP
          </div>

          <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded text-rose-300 font-black text-xs shrink-0">
            <Activity className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            -{staminaCost}% STAMINA
          </div>
        </div>

        <div className="shrink-0 min-w-[200px]">
          {isCurrentActive ? (
            <div className="space-y-1">
              <div className="flex justify-between items-end text-[9px] font-black tracking-widest text-amber-400 uppercase">
                <span>⚔️ LABOR EXECUTION ACTIVE...</span>
                <span>{questProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded border border-white/10 overflow-hidden p-0.5">
                <div 
                  className="bg-amber-400 h-full rounded transition-all duration-150"
                  style={{ width: `${questProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => onStart(item)}
              disabled={isAnyActive}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 select-none ${
                isAnyActive 
                  ? 'bg-amber-500/10 text-amber-500/30 cursor-not-allowed border-2 border-transparent' 
                  : 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 border border-amber-400 cursor-pointer'
              }`}
            >
              Begin Job Quest ⚔️
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function HostelCard({ 
  item, 
  onRest,
  playerStats 
}: { 
  item: HostelItem, 
  onRest: (hostel: HostelItem) => void,
  playerStats: any,
  key?: any
}) {
  const gpCost = item.id.includes('gh_') ? 35 : 45;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/80 border border-amber-500/15 p-5 md:p-6 rounded-2xl mb-4 hover:border-amber-500/35 transition-all duration-300 relative overflow-hidden select-none">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] rotate-45 translate-x-8 -translate-y-8 border-l border-b border-indigo-500/10" />
      
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-[10px] tracking-widest text-indigo-400 font-mono font-black uppercase">
            🏡 SAFEHOUSE INN & REST BED
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-wide font-mono">{item.name}</h3>
          
          <div className="flex items-center gap-4 text-gray-400 text-xs mt-2 font-mono">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-500" />{item.area}</span>
            {item.source && (
              <a href={`https://www.google.com/search?q=${encodeURIComponent(item.source + ' working hostel ' + item.area)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-indigo-400/60 hover:text-indigo-400 transition-colors">
                <Home className="w-3.5 h-3.5 shrink-0" />Source: {item.source}
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 font-mono">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-black">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            REPUTATION: {item.rating}/5
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">RARE SANCTUARY</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-indigo-500/15 pt-4 font-mono">
        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5 inline-block pr-6">
          <div className="text-gray-500 text-[9px] uppercase font-bold mb-1 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-indigo-400"/> Rental Rate
          </div>
          <div className="text-gray-200 font-extrabold text-xs">{item.amount}</div>
        </div>

        <button 
          onClick={() => onRest(item)}
          className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-indigo-400 hover:bg-indigo-300 border border-indigo-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(129,140,248,0.4)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <Coffee className="w-4 h-4 text-black animate-bounce" />
          Rent Bed & Rest (+45 Stamina for -{gpCost} GP)
        </button>
      </div>
    </motion.div>
  );
}

function LivingCostCard({ item }: { item: CostOfLivingItem, key?: string | number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] border border-white/5 p-5 md:p-6 rounded-2xl mb-4 hover:border-white/10 transition-colors">
      <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-400"/> {item.area}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
          <div className="text-gray-500 text-xs mb-2 flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5"/> Food (Weekly)</div>
          <div className="text-gray-200 font-medium text-sm">{item.food}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
          <div className="text-gray-500 text-xs mb-2 flex items-center gap-1.5"><Bus className="w-3.5 h-3.5"/> Public Transport</div>
          <div className="text-gray-200 font-medium text-sm">{item.transportPublic}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
          <div className="text-gray-500 text-xs mb-2 flex items-center gap-1.5"><Car className="w-3.5 h-3.5"/> Car Rental</div>
          <div className="text-gray-200 font-medium text-sm">{item.transportCarRental}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
          <div className="text-gray-500 text-xs mb-2 flex items-center gap-1.5"><CarFront className="w-3.5 h-3.5"/> Car Purchase (Used)</div>
          <div className="text-gray-200 font-medium text-sm">{item.transportCarPurchase}</div>
        </div>
      </div>
    </motion.div>
  );
}

function JourneyCard({ item }: { item: JourneyItem, key?: string | number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] border border-white/5 p-5 md:p-6 rounded-2xl mb-6 hover:border-white/10 transition-colors shadow-lg">
      <div className="flex justify-between items-start flex-wrap gap-4 mb-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">{item.author}</h3>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md text-xs font-medium"><Heart className="w-3 h-3" /> {item.platform}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{item.duration}</span>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 opacity-70 hover:opacity-100 hover:text-indigo-400 transition-colors">
                <Briefcase className="w-4 h-4" />Source Link
              </a>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Earned/Saved</div>
          <div className="text-2xl font-bold text-emerald-400">{item.earningsAmount.toLocaleString()} <span className="text-base text-emerald-400/70">{item.earningsCurrency}</span></div>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 leading-relaxed mb-6 font-mono bg-white/5 p-4 rounded-xl border border-white/5">
        "{item.summary}"
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Career Tracker</h4>
          <ul className="space-y-2">
            {item.jobs.map((job, idx) => (
              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span className="leading-relaxed">{job}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Travel Excursions</h4>
          <ul className="space-y-2">
            {item.travelLocations.map((loc, idx) => (
              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span className="leading-relaxed">{loc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

const exchangeRates: Record<string, number> = {
  'AUD': 1,
  'USD': 0.65,
  'EUR': 0.60,
  'GBP': 0.52,
  'MYR': 3.10,
  'TWD': 21.0,
  'JPY': 98.0,
  'KRW': 875.0,
};

interface JobRecord {
  id: string;
  title: string;
  hourlyRate: number;
  hoursPerWeek: number;
  weeksWorking: number;
}

function WHVCalculator() {
  const [currency, setCurrency] = useState<string>('AUD');
  const [showDeductionsHelp, setShowDeductionsHelp] = useState(false);
  const [jobs, setJobs] = useState<JobRecord[]>([
    { id: '1', title: 'Job 1', hourlyRate: 30, hoursPerWeek: 38, weeksWorking: 20 },
  ]);
  const [weeksTraveling, setWeeksTraveling] = useState<number>(12);
  const [deductions, setDeductions] = useState<number>(0);

  const [rentPerWeek, setRentPerWeek] = useState<number>(200);
  const [foodPerWeek, setFoodPerWeek] = useState<number>(120);
  const [transportPerWeek, setTransportPerWeek] = useState<number>(50);
  const [carRentalPerWeek, setCarRentalPerWeek] = useState<number>(0);
  const [travelFunPerMonth, setTravelFunPerMonth] = useState<number>(400);
  const [visaCost, setVisaCost] = useState<number>(635);
  const [flightCost, setFlightCost] = useState<number>(1000);

  const totalGross = jobs.reduce((acc, job) => acc + (job.hourlyRate * job.hoursPerWeek * job.weeksWorking), 0);
  
  // Taxable income is reduced by allowable deductions
  const taxableIncome = Math.max(0, totalGross - deductions);
  
  let totalTax = 0;
  if (taxableIncome <= 45000) {
    totalTax = taxableIncome * 0.15;
  } else if (taxableIncome <= 135000) {
    totalTax = (45000 * 0.15) + ((taxableIncome - 45000) * 0.325);
  } else {
    totalTax = (45000 * 0.15) + ((135000 - 45000) * 0.325) + ((taxableIncome - 135000) * 0.37);
  }
  
  const totalNet = totalGross - totalTax;
  const effectiveTaxRate = totalGross > 0 ? (totalTax / totalGross) * 100 : 0;

  const totalWeeksWorking = jobs.reduce((acc, job) => acc + job.weeksWorking, 0);
  const totalWeeks = totalWeeksWorking + weeksTraveling;
  const weeklyLivingExpenses = rentPerWeek + foodPerWeek + transportPerWeek + carRentalPerWeek;
  
  const totalTravelFun = travelFunPerMonth * (totalWeeks / 4.33);
  const totalExpenses = (weeklyLivingExpenses * totalWeeks) + totalTravelFun;
  
  const totalSavings = totalNet - totalExpenses;
  const netROI = totalSavings - visaCost - flightCost;

  const exRate = exchangeRates[currency] || 1;
  const symbol = currency === 'AUD' ? '$' : (currency === 'EUR' ? '€' : (currency === 'GBP' ? '£' : (currency === 'MYR' ? 'RM' : (currency === 'USD' ? '$' : ''))));

  const addJob = () => {
    setJobs([...jobs, { id: Math.random().toString(), title: `Job ${jobs.length + 1}`, hourlyRate: 28, hoursPerWeek: 35, weeksWorking: 12 }]);
  };

  const updateJob = (id: string, field: keyof JobRecord, value: string | number) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, [field]: value } : j));
  };

  const removeJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white flex items-center gap-2"><Calculator className="w-5 h-5 text-indigo-400" /> Income & Expenses Planner</h2>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500">
                {Object.keys(exchangeRates).map(c => <option key={c} value={c}>Display in {c}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                   <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Income Sources</h3>
                   <button onClick={addJob} className="text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 px-3 py-1.5 rounded-full transition-colors">+ Add Job</button>
                </div>
                
                <div className="space-y-3">
                  {jobs.map((job, index) => (
                    <div key={job.id} className="grid grid-cols-12 gap-2 items-center bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="col-span-4">
                        <label className="block text-[10px] text-gray-500 mb-1 uppercase">Job Title</label>
                        <input type="text" value={job.title} onChange={e => updateJob(job.id, 'title', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500 mb-1 uppercase">$/Hr</label>
                        <input type="number" value={job.hourlyRate} onChange={e => updateJob(job.id, 'hourlyRate', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-gray-500 mb-1 uppercase">Hrs/Wk</label>
                        <input type="number" value={job.hoursPerWeek} onChange={e => updateJob(job.id, 'hoursPerWeek', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[10px] text-gray-500 mb-1 uppercase">Weeks</label>
                        <input type="number" value={job.weeksWorking} onChange={e => updateJob(job.id, 'weeksWorking', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="col-span-1 flex justify-center mt-4">
                        {jobs.length > 1 && (
                          <button onClick={() => removeJob(job.id)} className="text-rose-400/60 hover:text-rose-400 p-1">×</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Allowable Tax Deductions</h3>
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs text-gray-400">Work Expenses ($)</label>
                    <button onClick={() => setShowDeductionsHelp(!showDeductionsHelp)} className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                      <Info className="w-3 h-3" />
                      What can I claim?
                    </button>
                  </div>
                  <input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="e.g. Tools, Uniforms" />
                  
                  <AnimatePresence>
                    {showDeductionsHelp && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mt-3 text-xs text-purple-200/90 space-y-2">
                          <p className="font-medium text-purple-300">Common WHM Deductions:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Protective Clothing:</strong> Sunnies, wide-brim hats, sunscreen, steel-cap boots, hi-vis shirts (common for farm/construction).</li>
                            <li><strong>Tools & Equipment:</strong> Secateurs, picking harnesses, specialized chef knives.</li>
                            <li><strong>Licenses/Courses:</strong> RSA, White Card, or Forklift ticket (claimable only if required for your <i>current</i> job, not to get one).</li>
                            <li><strong>Union Fees:</strong> Worker union memberships.</li>
                          </ul>
                          <p className="text-[10px] text-purple-300/60 mt-2">* Note: You cannot claim travel from home to work, or everyday clothing (like plain black clothes for hospitality).</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="space-y-4">
                 <h3 className="text-sm font-medium text-emerald-300 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Travel Time</h3>
                 <div>
                    <label className="block text-xs text-gray-400 mb-1">Weeks Traveling (Not working)</label>
                    <input type="number" value={weeksTraveling} onChange={(e) => setWeeksTraveling(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-medium text-rose-300 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Weekly Living (AUD)</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Rent/Hostel ($/wk)</label>
                    <input type="number" value={rentPerWeek} onChange={(e) => setRentPerWeek(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Food ($/wk)</label>
                    <input type="number" value={foodPerWeek} onChange={(e) => setFoodPerWeek(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Transport ($/wk)</label>
                    <input type="number" value={transportPerWeek} onChange={(e) => setTransportPerWeek(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Car Rental ($/wk)</label>
                    <input type="number" value={carRentalPerWeek} onChange={(e) => setCarRentalPerWeek(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2 mt-2 pt-4 border-t border-white/5">
                <h3 className="text-sm font-medium text-amber-300 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Travel & Startup Costs (AUD)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Travel/Fun ($/mth)</label>
                    <input type="number" value={travelFunPerMonth} onChange={(e) => setTravelFunPerMonth(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Visa Fee ($)</label>
                    <input type="number" value={visaCost} onChange={(e) => setVisaCost(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Flights ($)</label>
                    <input type="number" value={flightCost} onChange={(e) => setFlightCost(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
             <h3 className="flex items-center gap-2 text-blue-400 font-medium mb-3"><Info className="w-4 h-4"/> Tax Information Guide</h3>
             <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
               <li><strong>Working Holiday Makers (417/462 visas)</strong>: You are taxed at <strong>15%</strong> for the first $45,000 AUD earned during the financial year.</li>
               <li>Once you earn over $45,000, standard residency tax brackets apply (typically starting at 32.5% for the excess).</li>
               <li><strong>Deductions:</strong> You can claim work-related expenses like protective clothing, specific tools, or required courses (e.g. RSA, White Card used for work) to reduce your taxable income.</li>
               <li><strong>Superannuation:</strong> Employers pay 11.5% on top of your wage. WHMs can claim DASP when leaving Australia permanently, but it is taxed at 65%.</li>
             </ul>
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-400" /> Projections {currency !== 'AUD' && <span className="text-xs font-normal text-emerald-400/60 ml-2">in {currency}</span>}</h2>
          
          <div className="flex-grow space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-gray-400 text-sm">Total Gross Earnings</span>
              <span className="text-white font-mono">{symbol}{(totalGross * exRate).toFixed(0)}</span>
            </div>
            {deductions > 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-gray-400 text-sm">Tax Deductions</span>
                <span className="text-purple-400 font-mono">-{symbol}{(deductions * exRate).toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-gray-400 text-sm">Avg {effectiveTaxRate.toFixed(1)}% Tax (WHM)</span>
              <span className="text-rose-400 font-mono">-{symbol}{(totalTax * exRate).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-gray-400 text-sm">Total Net Pay</span>
              <span className="text-white font-medium font-mono">{symbol}{(totalNet * exRate).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-gray-400 text-sm">Total Living & Travel Expenses</span>
              <span className="text-amber-400 font-mono">-{symbol}{(totalExpenses * exRate).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center md:pt-2">
              <span className="text-emerald-400 font-medium">Total Savings Generated</span>
              <span className="text-emerald-400 font-bold font-mono">{symbol}{(totalSavings * exRate).toFixed(0)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Duration Tracked</div>
                 <div className="text-2xl text-white font-semibold">{totalWeeks} Wks</div>
               </div>
               <div>
                 <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Avg Savings / Wk</div>
                 <div className="text-2xl text-emerald-400 font-semibold">{symbol}{((totalSavings / Math.max(1, totalWeeks)) * exRate).toFixed(0)}</div>
               </div>
            </div>
          </div>

          <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
             <div className="text-indigo-300 text-xs uppercase tracking-wider mb-1">Net ROI</div>
             <div className="text-xl text-indigo-400 font-bold">{symbol}{(netROI * exRate).toFixed(0)} <span className="text-xs text-indigo-300/60 font-normal block mt-1">After flights & visa fees</span></div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'work' | 'hostels' | 'living' | 'stories' | 'quest' | 'calculator' | 'analyze'>('quest');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const WORK_ITEMS = useMemo(() => generateWorks(1000), []);
  const HOSTEL_ITEMS = useMemo(() => generateHostels(1000), []);
  const LIVING_COSTS = useMemo(() => generateLivingCosts(), []);

  const [visibleWorks, setVisibleWorks] = useState(20);
  const [visibleHostels, setVisibleHostels] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  // Retro Quest States
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [questProgress, setQuestProgress] = useState(0);
  const [gameToast, setGameToast] = useState<{ message: string; type: 'success' | 'level' | 'error' } | null>(null);

  // Sound Engine
  function playSound(type: 'click' | 'coin' | 'levelUp' | 'rest' | 'error') {
    try {
      const isMuted = localStorage.getItem('whv_quest_mute') === 'true';
      if (isMuted) return;
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
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'rest') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.linearRampToValueAtTime(329.63, now + 0.4);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch(e) {}
  }

  // Immersive character stats synced from Visa Quest minigame
  const normalizeCharacter = (raw: any) => {
    const d = {
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

  const [playerStats, setPlayerStats] = useState(() => {
    try {
      const saved = localStorage.getItem('whv_quest_char_v2');
      if (saved) {
        return normalizeCharacter(JSON.parse(saved));
      }
    } catch(e) {}
    return normalizeCharacter(null);
  });

  useEffect(() => {
    const updateStats = () => {
      try {
        const saved = localStorage.getItem('whv_quest_char_v2');
        if (saved) {
          setPlayerStats(normalizeCharacter(JSON.parse(saved)));
        }
      } catch (e) {}
    };
    
    const interval = setInterval(updateStats, 1000);
    window.addEventListener('storage', updateStats);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateStats);
    };
  }, []);

  const startQuest = (item: WorkItem) => {
    const staminaCost = item.difficulty === 'Easy' ? 12 : (item.difficulty === 'Medium' ? 18 : (item.difficulty === 'Hard' ? 26 : 38));
    if (playerStats.energy < staminaCost) {
      playSound('error');
      setGameToast({
        message: `🔴 LOW STAMINA! Standard labor requires ${staminaCost}% energy. Rest at a Safehouse Inn!`,
        type: 'error'
      });
      setTimeout(() => setGameToast(null), 3500);
      return;
    }

    playSound('click');
    setActiveQuestId(item.id);
    setQuestProgress(5);
    
    // incremental progress
    let prog = 5;
    const intervalRef = setInterval(() => {
      prog += 15;
      if (prog >= 100) {
        clearInterval(intervalRef);
        setQuestProgress(100);
        setTimeout(() => {
          // complete and earn rewards!
          let gReward = item.goldReward || 60;
          let xReward = item.xpReward || 50;
          
          let newGold = playerStats.gold + gReward;
          let newXp = playerStats.xp + xReward;
          let newLevel = playerStats.level;
          let newXpNeeded = playerStats.xpNeeded || 180;
          let didLevelUp = false;
          let newEnergy = Math.max(0, playerStats.energy - staminaCost);
          let newVisaDays = playerStats.visaDays + 1;
          
          if (newXp >= newXpNeeded) {
            didLevelUp = true;
            newLevel += 1;
            newXp -= newXpNeeded;
            newXpNeeded = Math.round(newXpNeeded * 1.35);
            newEnergy = playerStats.maxEnergy || 100;
          }
          
          let currentTitle = playerStats.currentTitle || 'Greenhorn Backpacker';
          if (newLevel >= 15) {
            currentTitle = 'Outback Overlord 👑';
          } else if (newLevel >= 10) {
            currentTitle = 'Elite Bushranger ⚔️';
          } else if (newLevel >= 6) {
            currentTitle = 'Outback Pioneer 🚜';
          } else if (newLevel >= 3) {
            currentTitle = 'Seasoned Farmhand 🌾';
          }

          const updatedChar = {
            ...playerStats,
            name: playerStats.name || 'Aussie Warrior',
            subclass: playerStats.subclass || '462',
            classId: playerStats.classId || 'orchardist',
            maxEnergy: playerStats.maxEnergy || 100,
            coffeeCred: playerStats.coffeeCred || 0,
            sunResist: playerStats.sunResist || 0,
            combatAtk: playerStats.combatAtk || 15,
            combatDef: playerStats.combatDef || 10,
            gold: newGold,
            xp: newXp,
            level: newLevel,
            xpNeeded: newXpNeeded,
            energy: newEnergy,
            visaDays: newVisaDays,
            currentTitle
          };

          try {
            localStorage.setItem('whv_quest_char_v2', JSON.stringify(updatedChar));
            window.dispatchEvent(new Event('storage'));
          } catch(e) {}

          setPlayerStats(updatedChar);
          setActiveQuestId(null);
          setQuestProgress(0);

          if (didLevelUp) {
            playSound('levelUp');
            setGameToast({
              message: `🎉 Triumphant Level Up! Reached level ${newLevel}. Stamina fully restored. Title: "${currentTitle}"`,
              type: 'level'
            });
          } else {
            playSound('coin');
            setGameToast({
              message: `🪙 QUEST SECURED! +${gReward} Gold coins, +${xReward} EXP gained. +1 Specified Visa Day logged.`,
              type: 'success'
            });
          }
          setTimeout(() => setGameToast(null), 3500);
        }, 150);
      } else {
        setQuestProgress(prog);
      }
    }, 120);
  };

  const handleRestHostel = (hostel: HostelItem) => {
    // night's rest in gold coins
    const gpCost = hostel.id.includes('gh_') ? 35 : 45;
    
    if (playerStats.gold < gpCost) {
      playSound('error');
      setGameToast({
        message: `🔴 POOR INN-GUEST! This safehouse bed costs ${gpCost} GP. Accomplish more labor quests to earn gold.`,
        type: 'error'
      });
      setTimeout(() => setGameToast(null), 3500);
      return;
    }

    const maxE = playerStats.maxEnergy || 100;
    if (playerStats.energy >= maxE) {
      playSound('click');
      setGameToast({
        message: `💤 Energy already fully topped up! Go explore the outback!`,
        type: 'success'
      });
      setTimeout(() => setGameToast(null), 3500);
      return;
    }

    playSound('rest');
    
    const newEnergy = Math.min(maxE, playerStats.energy + 45);
    const updatedChar = {
      ...playerStats,
      name: playerStats.name || 'Aussie Warrior',
      subclass: playerStats.subclass || '462',
      classId: playerStats.classId || 'orchardist',
      maxEnergy: playerStats.maxEnergy || 100,
      coffeeCred: playerStats.coffeeCred || 0,
      sunResist: playerStats.sunResist || 0,
      combatAtk: playerStats.combatAtk || 15,
      combatDef: playerStats.combatDef || 10,
      xpNeeded: playerStats.xpNeeded || 180,
      currentTitle: playerStats.currentTitle || 'Greenhorn Backpacker',
      gold: Math.max(0, playerStats.gold - gpCost),
      energy: newEnergy
    };

    try {
      localStorage.setItem('whv_quest_char_v2', JSON.stringify(updatedChar));
      window.dispatchEvent(new Event('storage'));
    } catch(e) {}

    setPlayerStats(updatedChar);
    setGameToast({
      message: `💤 Checked In at "${hostel.name}"! Gained +45% Stamina for -${gpCost} GP. Safe travels, mate!`,
      type: 'success'
    });
    setTimeout(() => setGameToast(null), 3500);
  };

  const filteredWorks = useMemo(() => {
    if (!searchQuery.trim()) return WORK_ITEMS;
    const q = searchQuery.toLowerCase();
    return WORK_ITEMS.filter(item => 
      item.title?.toLowerCase().includes(q) || 
      item.area?.toLowerCase().includes(q) || 
      item.source?.toLowerCase().includes(q)
    );
  }, [WORK_ITEMS, searchQuery]);

  const filteredHostels = useMemo(() => {
    if (!searchQuery.trim()) return HOSTEL_ITEMS;
    const q = searchQuery.toLowerCase();
    return HOSTEL_ITEMS.filter(item => 
      item.name?.toLowerCase().includes(q) || 
      item.area?.toLowerCase().includes(q) || 
      item.source?.toLowerCase().includes(q)
    );
  }, [HOSTEL_ITEMS, searchQuery]);

  const filteredLivingCosts = useMemo(() => {
    if (!searchQuery.trim()) return LIVING_COSTS;
    const q = searchQuery.toLowerCase();
    return LIVING_COSTS.filter(item => 
      item.area?.toLowerCase().includes(q)
    );
  }, [LIVING_COSTS, searchQuery]);

  const filteredJourneys = useMemo(() => {
    if (!searchQuery.trim()) return JOURNEYS;
    const q = searchQuery.toLowerCase();
    return JOURNEYS.filter(item => 
      item.author?.toLowerCase().includes(q) || 
      item.platform?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q)
    );
  }, [JOURNEYS, searchQuery]);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#07080a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-black to-[#040506] text-gray-200 font-sans selection:bg-amber-500/30 pb-24 relative overflow-x-hidden">
      
      {/* Retro Arcade SCAN LINES overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50 opacity-60" />

      {/* Retro Floating Alerts */}
      <AnimatePresence>
        {gameToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] max-w-md w-11/12 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 p-4 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-md ${
                gameToast.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                  : gameToast.type === 'level'
                  ? 'bg-indigo-950/90 border-indigo-400/50 text-indigo-100 shadow-[0_0_30px_rgba(129,140,248,0.3)]'
                  : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${
                gameToast.type === 'error' ? 'bg-rose-500/20' : gameToast.type === 'level' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
              }`}>
                {gameToast.type === 'error' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                ) : gameToast.type === 'level' ? (
                  <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                ) : (
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-wider font-mono leading-relaxed">{gameToast.message}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-10">
        
        {/* Immersive Game Title / Header */}
        <header className="mb-8 text-center space-y-3 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-400 select-none animate-pulse">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
            WORLD AREA: AUSTRALIAN OUTBACK
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase select-none mt-2">
            AUS WHV <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">QUEST CHRONICLES</span>
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto text-[11px] md:text-xs uppercase font-bold tracking-wider leading-relaxed">
            Holographic intelligence log across crop dungeons, tavern inns, and outback labor guilds. Prepared for hard workers & rare Camry drivers.
          </p>
        </header>

        {/* ================= HOLOGRAPHIC PLAYER HUD BAR ================= */}
        <div className="mb-8 bg-black/80 border-2 border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-4 md:p-5 shadow-[0_0_25px_rgba(245,158,11,0.1)] transition-all duration-300 backdrop-blur-md relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rotate-45 translate-x-8 -translate-y-8 border-l border-b border-amber-500/20" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-amber-500/15">
            
            {/* Column 1: Player Profile Info */}
            <div className="flex items-center gap-3 md:pb-0">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-xl border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner relative">
                <div className="absolute -inset-0.5 bg-amber-500/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000" />
                <Gamepad2 className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">AVATAR IN-GAME</p>
                <p className="text-xs font-black text-white truncate uppercase tracking-wide">{playerStats.name || 'AUSSIEVAGABOND'}</p>
                <span className="inline-block text-[9px] bg-amber-500/10 text-amber-400 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                  {playerStats.currentTitle || 'Greenhorn' }
                </span>
              </div>
            </div>

            {/* Column 2: Level & Expericence Bar */}
            <div className="pt-3 md:pt-0 md:pl-5 space-y-1.5">
              <div className="flex justify-between items-end text-[10px] font-bold">
                <span className="text-amber-400 uppercase font-extrabold tracking-wider font-mono">LEVEL {playerStats.level}</span>
                <span className="text-gray-400 font-mono">XP: {playerStats.xp} / {playerStats.xpNeeded}</span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded border border-white/10 overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded transition-all duration-300"
                  style={{ width: `${Math.min(100, (playerStats.xp / Math.max(1, playerStats.xpNeeded)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Column 3: Stats - Energy and Coins */}
            <div className="pt-3 md:pt-0 md:pl-5 grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-[9px] text-gray-500 font-black uppercase font-mono">STAMINA</p>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-bold text-white font-mono">{playerStats.energy}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${playerStats.energy}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-gray-500 font-black uppercase font-mono">GOLD BANK</p>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 font-bold">$</span>
                  <span className="text-xs font-black text-amber-300 font-mono">{(playerStats.gold).toFixed(0)}</span>
                  <span className="text-[10px] text-amber-500 font-bold uppercase font-mono">GLD</span>
                </div>
              </div>
            </div>

            {/* Column 4: 88 Specified Days Status Block */}
            <div className="pt-3 md:pt-0 md:pl-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[9px] text-gray-500 font-black uppercase font-mono">VISA DAYS SAVED</p>
                <p className="text-base font-black text-white font-mono">
                  {playerStats.visaDays} <span className="text-xs font-bold text-violet-400 font-mono">/ 88 D</span>
                </p>
              </div>
              <div>
                {playerStats.visaDays >= 88 ? (
                  <div className="bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded animate-pulse">
                    READY 👑
                  </div>
                ) : (
                  <div className="text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-1 rounded font-black tracking-widest font-mono">
                    {Math.max(0, 88 - playerStats.visaDays)} LEFT
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Tabs - Game Console styled */}
        <div className="mb-8 font-mono">
          {/* Mobile Grid Menu, gorgeous and completely visible on narrow screens */}
          <div className="grid grid-cols-2 gap-2 md:hidden bg-black/60 border-2 border-white/10 rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('quest')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider border ${
                activeTab === 'quest' 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-amber-400/90 hover:bg-white/5 border-transparent bg-white/[0.02]'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">⚔️ Combat</span>
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider border ${
                activeTab === 'work' 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent bg-white/[0.02]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">🎯 Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab('hostels')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider border ${
                activeTab === 'hostels' 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent bg-white/[0.02]'
              }`}
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">🏡 Safehouses</span>
            </button>
            <button
              onClick={() => setActiveTab('living')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider border ${
                activeTab === 'living' 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent bg-white/[0.02]'
              }`}
            >
              <WalletCards className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">⚖️ Bazaar</span>
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider border ${
                activeTab === 'stories' 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent bg-white/[0.02]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">🔥 Campfire</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider border ${
                activeTab === 'calculator' 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent bg-white/[0.02]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">📊 Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab('analyze')}
              className={`col-span-2 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider border ${
                activeTab === 'analyze' 
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent bg-white/[0.02]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>🔮 Seer's Scroll</span>
            </button>
          </div>

          {/* Desktop/Tablet Menu - Sleek Inline console */}
          <div className="hidden md:flex justify-center">
            <div className="inline-flex bg-black border-2 border-white/10 rounded-xl p-1.5 whitespace-nowrap min-w-max gap-1">
              <button
                onClick={() => setActiveTab('quest')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${
                  activeTab === 'quest' 
                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.03] border-amber-400' 
                    : 'text-amber-400/70 hover:text-amber-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                ⚔️ Combat Arena
              </button>
              <button
                onClick={() => setActiveTab('work')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${
                  activeTab === 'work' 
                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.03]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                🎯 Job Quests
              </button>
              <button
                onClick={() => setActiveTab('hostels')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${
                  activeTab === 'hostels' 
                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.03]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4" />
                🏡 Safehouse Inns
              </button>
              <button
                onClick={() => setActiveTab('living')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${
                  activeTab === 'living' 
                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.03]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <WalletCards className="w-4 h-4" />
                ⚖️ Bazaar Prices
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${
                  activeTab === 'stories' 
                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.03]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                🔥 Campfire Lore
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${
                  activeTab === 'calculator' 
                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.03]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Calculator className="w-4 h-4" />
                📊 Treasury Ledger
              </button>
              <button
                onClick={() => setActiveTab('analyze')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider ${
                  activeTab === 'analyze' 
                    ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-[1.03]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                🔮 Seer's Scroll
              </button>
            </div>
          </div>
        </div>

        {activeTab !== 'analyze' && activeTab !== 'quest' && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-200 font-extrabold mb-1">Curated Database</p>
              <p className="text-gray-400 text-xs">
                This is a pre-curated intelligence feed of known hotspots based on aggregated community knowledge. Since direct scraping of Xiaohongshu or Facebook groups is restricted, to analyze a brand-new post, copy its text and use the <button onClick={() => setActiveTab('analyze')} className="text-indigo-400 underline hover:text-indigo-300 font-medium font-mono uppercase">🔮 Seer's Scroll</button> tab.
              </p>
            </div>
          </div>
        )}

        {(activeTab === 'work' || activeTab === 'hostels' || activeTab === 'living' || activeTab === 'stories') && (
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder={activeTab === 'stories' ? "Search by author, platform, or keyword..." : `Search ${activeTab} by area, name, or source...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'work' && (
            <motion.div key="work" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="mb-6 px-2 text-sm text-gray-400 flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-400"/> {filteredWorks.length} job entries available</div>
              {filteredWorks.slice(0, visibleWorks).map((item) => (
                <WorkCard 
                  key={item.id} 
                  item={item} 
                  activeQuestId={activeQuestId}
                  questProgress={questProgress}
                  onStart={startQuest}
                />
              ))}
              {visibleWorks < filteredWorks.length && (
                <div className="flex justify-center mt-6 mb-8">
                  <button onClick={() => setVisibleWorks(v => v + 20)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-full transition-all duration-200 cursor-pointer">
                    Load More Jobs
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'hostels' && (
            <motion.div key="hostels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="mb-6 px-2 text-sm text-gray-400 flex items-center gap-2"><Home className="w-4 h-4 text-indigo-400"/> {filteredHostels.length} hostel & accommodation listings</div>
              {filteredHostels.slice(0, visibleHostels).map((item) => (
                <HostelCard 
                  key={item.id} 
                  item={item} 
                  onRest={handleRestHostel}
                  playerStats={playerStats}
                />
              ))}
              {visibleHostels < filteredHostels.length && (
                <div className="flex justify-center mt-6 mb-8">
                  <button onClick={() => setVisibleHostels(v => v + 20)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-full transition-all duration-200 cursor-pointer">
                    Load More Hostels
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'living' && (
            <motion.div key="living" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="mb-6 px-2 text-sm text-gray-400 flex items-center gap-2"><WalletCards className="w-4 h-4 text-indigo-400"/> Estimates for food and transport by region</div>
              {filteredLivingCosts.map((item) => <LivingCostCard key={item.id} item={item} />)}
            </motion.div>
          )}

          {activeTab === 'stories' && (
            <motion.div key="stories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="mb-6 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-sm text-gray-400 flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-400"/> Experience sharing from different backgrounds</div>
                <button className="text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 px-4 py-2 rounded-full transition-colors flex items-center justify-center gap-2 w-full md:w-auto">
                   <Zap className="w-3.5 h-3.5" /> Submit Your Story
                </button>
              </div>
              
              {filteredJourneys.length > 0 ? (
                filteredJourneys.map((item) => <JourneyCard key={item.id} item={item} />)
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-gray-400 mb-2">No stories match your search.</div>
                  <button onClick={() => setSearchQuery('')} className="text-indigo-400 text-sm hover:underline">Clear Search</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'quest' && (
            <motion.div key="quest" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <VisaQuest userCurrency="AUD" exchangeRate={1} symbol="$" />
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div key="calculator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <WHVCalculator />
            </motion.div>
          )}

          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-[#111111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl mb-8 relative transition-all duration-300 hover:border-white/10">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Source Material
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
                
                <div className="p-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste the post content here..."
                    className="w-full h-48 md:h-64 bg-transparent text-gray-300 placeholder:text-gray-600 p-6 resize-none focus:outline-none focus:ring-0 text-sm md:text-base leading-relaxed"
                  />
                </div>

                <div className="p-4 bg-black/20 border-t border-white/5 flex justify-end">
                  <button
                    onClick={analyzeText}
                    disabled={loading || !text.trim()}
                    className="group relative flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Extract Intelligence
                      </>
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm"
                  >
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {result && !loading && (
                  <ResultCard result={result} />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
