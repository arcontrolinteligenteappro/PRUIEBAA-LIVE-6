
import React, { useState } from 'react';
import { UniversalSportsState, TimelineMarker, CommercialLayout, OperationMode } from '../types';
import { Play, Pause, Plus, Minus, Flag, Trophy, Target, StopCircle, RefreshCw, Hand, Grid, Flame, LayoutTemplate, Clock, AlertTriangle, Video, Activity, Users, BarChart3, Database, Monitor, AlertOctagon, Timer, UserCheck } from 'lucide-react';

interface SportsControlPanelProps {
  state: UniversalSportsState;
  opMode: OperationMode;
  commercialMode: CommercialLayout;
  onUpdate: (newState: UniversalSportsState) => void;
  onTriggerEvent: (type: string, description: string, data?: any) => void;
  onToggleCommercial: (mode: CommercialLayout) => void;
}

export const SportsControlPanel: React.FC<SportsControlPanelProps> = ({ state, opMode, commercialMode, onUpdate, onTriggerEvent, onToggleCommercial }) => {
  
  // --- HELPERS ---
  const handleAction = (type: string, desc: string, data?: any) => onTriggerEvent(type, desc, data);
  
  const modScore = (team: 'home' | 'guest', amount: number) => {
      if (team === 'home') onUpdate({ ...state, home: { ...state.home, score: Math.max(0, state.home.score + amount) } });
      else onUpdate({ ...state, guest: { ...state.guest, score: Math.max(0, state.guest.score + amount) } });
  };
  
  const toggleClock = () => onUpdate({ ...state, clock: { ...state.clock, isRunning: !state.clock.isRunning } });
  const setPeriod = (p: number, name: string) => onUpdate({ ...state, period: p, periodName: name });

  const toggleGraphic = (type: typeof state.activeGraphic) => {
      onUpdate({ ...state, activeGraphic: state.activeGraphic === type ? 'SCOREBUG' : type });
  };

  // --- UI COMPONENTS ---
  const CBtn = ({ label, onClick, color, large, icon, disabled }: any) => (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`
            relative rounded font-bold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border-b-4
            ${large ? 'h-24 text-lg' : 'h-16 text-xs'}
            ${disabled ? 'bg-gray-800 border-gray-900 text-gray-600' : 
              color === 'red' ? 'bg-red-800 border-red-900 hover:bg-red-700 text-white' :
              color === 'blue' ? 'bg-blue-800 border-blue-900 hover:bg-blue-700 text-white' :
              color === 'yellow' ? 'bg-yellow-600 border-yellow-700 hover:bg-yellow-500 text-black' :
              color === 'gray' ? 'bg-gray-700 border-gray-900 hover:bg-gray-600 text-gray-200' :
              color === 'green' ? 'bg-green-700 border-green-800 hover:bg-green-600 text-white' :
              color === 'purple' ? 'bg-purple-800 border-purple-900 hover:bg-purple-700 text-white' : ''
            }
        `}
      >
          {icon && <span className={large ? 'mb-1' : ''}>{icon}</span>}
          <span className="text-center leading-tight">{label}</span>
      </button>
  );

  const SubPanel = ({ title, children }: any) => (
      <div className="bg-[#1a1a1a] rounded border border-gray-700 p-2 mt-2">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">{title}</h4>
          {children}
      </div>
  );

  // =================================================================
  // SPORT RENDERERS
  // =================================================================

  // --- SOCCER / FUTSAL ---
  const renderSoccer = () => (
      <div className="flex flex-col h-full gap-2">
          <div className="grid grid-cols-2 gap-3 flex-1">
               {/* Home */}
               <div className="flex flex-col gap-2">
                   <CBtn large color="blue" label="GOAL" icon={<Trophy size={20}/>} onClick={() => { modScore('home', 1); handleAction('GOAL', 'Goal Home', {team: 'home'}); }} />
                   <div className="grid grid-cols-2 gap-1">
                       <CBtn color="yellow" label="YEL" onClick={() => handleAction('CARD_YELLOW', 'Yellow Home')} />
                       <CBtn color="red" label="RED" onClick={() => handleAction('CARD_RED', 'Red Home')} />
                       <CBtn color="gray" label="SUB" onClick={() => handleAction('SUB', 'Sub Home')} />
                       <CBtn color="gray" label="FOUL" onClick={() => handleAction('FOUL', 'Foul Home')} />
                       {state.activeSport === 'FUTSAL' && <CBtn color="purple" label="5TH FOUL" onClick={() => handleAction('5TH_FOUL', '5th Foul Home')} />}
                   </div>
               </div>
               {/* Guest */}
               <div className="flex flex-col gap-2">
                   <CBtn large color="red" label="GOAL" icon={<Trophy size={20}/>} onClick={() => { modScore('guest', 1); handleAction('GOAL', 'Goal Guest', {team: 'guest'}); }} />
                   <div className="grid grid-cols-2 gap-1">
                       <CBtn color="yellow" label="YEL" onClick={() => handleAction('CARD_YELLOW', 'Yellow Guest')} />
                       <CBtn color="red" label="RED" onClick={() => handleAction('CARD_RED', 'Red Guest')} />
                       <CBtn color="gray" label="SUB" onClick={() => handleAction('SUB', 'Sub Guest')} />
                       <CBtn color="gray" label="FOUL" onClick={() => handleAction('FOUL', 'Foul Guest')} />
                       {state.activeSport === 'FUTSAL' && <CBtn color="purple" label="5TH FOUL" onClick={() => handleAction('5TH_FOUL', '5th Foul Guest')} />}
                   </div>
               </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
              <CBtn color="green" label={state.clock.isRunning ? 'STOP' : 'START'} onClick={toggleClock} icon={<Clock size={16}/>} />
              <CBtn 
                color={state.soccer?.varStatus === 'NONE' ? 'gray' : 'yellow'} 
                label="VAR" 
                icon={<Monitor size={16}/>}
                onClick={() => onUpdate({...state, soccer: {...state.soccer!, varStatus: state.soccer?.varStatus === 'NONE' ? 'CHECKING' : 'NONE'}})} 
              />
              <CBtn color="gray" label={`+${state.soccer?.addedTime}`} onClick={() => handleAction('EXTRA_TIME', '+4 Minute Added')} />
              <CBtn color={state.activeGraphic === 'FULL_STATS' ? 'purple' : 'gray'} label="STATS" icon={<BarChart3 size={16}/>} onClick={() => toggleGraphic('FULL_STATS')} />
          </div>

          <SubPanel title="Match Logic">
              <div className="grid grid-cols-4 gap-1">
                  <CBtn color="gray" label="PENALTY" onClick={() => handleAction('PENALTY', 'Penalty Kick')} />
                  {state.activeSport === 'FUTSAL' && (
                      <CBtn color={state.soccer?.powerPlayActive ? 'orange' : 'gray'} label="PWR PLAY" onClick={() => onUpdate({...state, soccer: {...state.soccer!, powerPlayActive: !state.soccer?.powerPlayActive}})} />
                  )}
              </div>
          </SubPanel>

          {opMode === 'STUDIO' && (
              <SubPanel title="Match Stats Control">
                  <div className="grid grid-cols-6 gap-1 text-[10px]">
                      <CBtn color="gray" label="CORNER H" onClick={() => handleAction('STAT', 'Corner Home')} />
                      <CBtn color="gray" label="SHOT H" onClick={() => handleAction('STAT', 'Shot Home')} />
                      <CBtn color="gray" label="OFFSIDE H" onClick={() => handleAction('STAT', 'Offside Home')} />
                      <CBtn color="gray" label="CORNER A" onClick={() => handleAction('STAT', 'Corner Away')} />
                      <CBtn color="gray" label="SHOT A" onClick={() => handleAction('STAT', 'Shot Away')} />
                      <CBtn color="gray" label="OFFSIDE A" onClick={() => handleAction('STAT', 'Offside Away')} />
                  </div>
              </SubPanel>
          )}
      </div>
  );

  // --- FOOTBALL (NFL) ---
  const renderFootball = () => (
      <div className="flex flex-col h-full gap-2">
          {/* Main Scoring */}
          <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-2 gap-1">
                      <CBtn large color="blue" label="TD" onClick={() => { modScore('home', 6); handleAction('TD', 'Touchdown Home'); }} />
                      <CBtn color="gray" label="FG (3)" onClick={() => modScore('home', 3)} />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                      <CBtn color="gray" label="PAT 1" onClick={() => modScore('home', 1)} />
                      <CBtn color="gray" label="PAT 2" onClick={() => modScore('home', 2)} />
                      <CBtn color="gray" label="SFTY" onClick={() => modScore('home', 2)} />
                  </div>
              </div>
              <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-2 gap-1">
                      <CBtn large color="red" label="TD" onClick={() => { modScore('guest', 6); handleAction('TD', 'Touchdown Guest'); }} />
                      <CBtn color="gray" label="FG (3)" onClick={() => modScore('guest', 3)} />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                      <CBtn color="gray" label="PAT 1" onClick={() => modScore('guest', 1)} />
                      <CBtn color="gray" label="PAT 2" onClick={() => modScore('guest', 2)} />
                      <CBtn color="gray" label="SFTY" onClick={() => modScore('guest', 2)} />
                  </div>
              </div>
          </div>

          {/* Game State Control */}
          <div className="bg-gray-800 p-2 rounded grid grid-cols-4 gap-2">
              <div className="col-span-2 grid grid-cols-2 gap-1">
                  <CBtn color="gray" label={`DOWN: ${state.football?.down}`} onClick={() => onUpdate({...state, football: {...state.football!, down: (state.football?.down || 0) % 4 + 1}})} />
                  <CBtn color="gray" label={`TOGOS: ${state.football?.distance}`} onClick={() => {}} />
                  <CBtn color="gray" label="YARDS +" onClick={() => {}} />
                  <CBtn color="gray" label="YARDS -" onClick={() => {}} />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-1">
                  <CBtn color={state.football?.possession === 'HOME' ? 'blue' : 'gray'} label="POSS HOME" onClick={() => onUpdate({...state, football: {...state.football!, possession: 'HOME'}})} />
                  <CBtn color={state.football?.possession === 'GUEST' ? 'red' : 'gray'} label="POSS AWAY" onClick={() => onUpdate({...state, football: {...state.football!, possession: 'GUEST'}})} />
                  <CBtn color="yellow" label="FLAG" icon={<Flag size={14}/>} onClick={() => onUpdate({...state, football: {...state.football!, flagActive: !state.football?.flagActive}})} />
                  <CBtn color="gray" label="TIMEOUT" onClick={() => {}} />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-1">
                <CBtn color="gray" label={`BALL ON: ${state.football?.ballOn}`} onClick={() => onUpdate({...state, football: {...state.football!, ballOn: (state.football?.ballOn || 0) + 1}})} />
                <CBtn color="gray" label="BALL ON -" onClick={() => onUpdate({...state, football: {...state.football!, ballOn: (state.football?.ballOn || 0) - 1}})} />
          </div>

          <div className="grid grid-cols-3 gap-2">
              <CBtn color="green" label={state.clock.isRunning ? 'STOP' : 'START'} onClick={toggleClock} />
              <CBtn color="purple" label={`QTR ${state.football?.quarter}`} onClick={() => onUpdate({...state, football: {...state.football!, quarter: (state.football?.quarter || 0) % 4 + 1}})} />
              <CBtn color="gray" label="PLAY CLOCK" onClick={() => {}} />
          </div>
      </div>
  );

  // --- BASEBALL ---
  const renderBaseball = () => (
    <div className="flex flex-col h-full gap-2">
        <div className="grid grid-cols-2 gap-2 flex-1">
            <CBtn large color="red" label="STRIKE" onClick={() => handleAction('STRIKE', 'Strike')} />
            <CBtn large color="green" label="BALL" onClick={() => handleAction('BALL', 'Ball')} />
            <CBtn large color="gray" label="OUT" onClick={() => handleAction('OUT', 'Out')} />
            <CBtn large color="blue" label="HIT" onClick={() => handleAction('HIT', 'Hit')} />
        </div>
        
        <div className="grid grid-cols-4 gap-1">
            <CBtn color="gray" label="FOUL" onClick={() => handleAction('FOUL', 'Foul Ball')} />
            <CBtn color="purple" label="HR" onClick={() => handleAction('HR', 'Home Run')} />
            <CBtn color="blue" label="RUN HOME" onClick={() => modScore('home', 1)} />
            <CBtn color="red" label="RUN AWAY" onClick={() => modScore('guest', 1)} />
        </div>

        <div className="grid grid-cols-4 gap-1">
            <CBtn color="gray" label="WALK" onClick={() => handleAction('WALK', 'Base on Balls')} />
            <CBtn color="gray" label="ERROR" onClick={() => handleAction('ERROR', 'Fielding Error')} />
            <CBtn color="gray" label="SB" onClick={() => handleAction('SB', 'Stolen Base')} />
            <CBtn color="gray" label="CS" onClick={() => handleAction('CS', 'Caught Stealing')} />
        </div>

        {/* Bases */}
        <div className="flex justify-center gap-2 p-2 bg-[#111] rounded">
            {[0, 1, 2].map(base => (
                <button 
                    key={base}
                    onClick={() => {
                        const newBases = [...(state.baseball?.bases || [])];
                        newBases[base] = !newBases[base];
                        onUpdate({...state, baseball: {...state.baseball!, bases: newBases as [boolean, boolean, boolean]}});
                    }}
                    className={`w-8 h-8 rotate-45 border-2 ${state.baseball?.bases[base] ? 'bg-yellow-500 border-yellow-300' : 'bg-gray-800 border-gray-600'}`}
                />
            ))}
        </div>
        
        {opMode === 'STUDIO' && (
            <div className="grid grid-cols-3 gap-1 bg-gray-800 p-2 rounded">
                 <button onClick={() => toggleGraphic('LOWER_THIRD_PLAYER')} className={`rounded font-bold text-xs p-2 ${state.activeGraphic === 'LOWER_THIRD_PLAYER' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>DUE UP</button>
                 <button onClick={() => toggleGraphic('FULL_STATS')} className={`rounded font-bold text-xs p-2 ${state.activeGraphic === 'FULL_STATS' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-white'}`}>PITCHER CARD</button>
                 <button onClick={() => handleAction('INNING_END', 'End Inning')} className="bg-gray-700 text-white rounded font-bold text-xs p-2">END INN</button>
            </div>
        )}
    </div>
  );

  // --- BASKETBALL ---
  const renderBasketball = () => (
      <div className="flex flex-col h-full gap-2">
          <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="flex flex-col gap-2">
                  <CBtn large color="blue" label="+2" onClick={() => modScore('home', 2)} />
                  <div className="grid grid-cols-2 gap-1">
                      <CBtn color="blue" label="+3" onClick={() => modScore('home', 3)} />
                      <CBtn color="blue" label="+1" onClick={() => modScore('home', 1)} />
                  </div>
                  <CBtn color="gray" label="FOUL" onClick={() => {}} />
                  <CBtn color={state.basketball?.bonusHome ? 'yellow' : 'gray'} label="BONUS H" onClick={() => onUpdate({...state, basketball: {...state.basketball!, bonusHome: !state.basketball?.bonusHome}})} />
              </div>
              <div className="flex flex-col gap-2">
                  <CBtn large color="red" label="+2" onClick={() => modScore('guest', 2)} />
                  <div className="grid grid-cols-2 gap-1">
                      <CBtn color="red" label="+3" onClick={() => modScore('guest', 3)} />
                      <CBtn color="red" label="+1" onClick={() => modScore('guest', 1)} />
                  </div>
                  <CBtn color="gray" label="FOUL" onClick={() => {}} />
                  <CBtn color={state.basketball?.bonusGuest ? 'yellow' : 'gray'} label="BONUS A" onClick={() => onUpdate({...state, basketball: {...state.basketball!, bonusGuest: !state.basketball?.bonusGuest}})} />
              </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
              <CBtn color="green" label={state.clock.isRunning ? 'STOP' : 'START'} onClick={toggleClock} />
              <CBtn color="yellow" label="SHOT 24" onClick={() => onUpdate({...state, basketball: {...state.basketball!, shotClock: 24}})} />
              <CBtn color="yellow" label="SHOT 14" onClick={() => onUpdate({...state, basketball: {...state.basketball!, shotClock: 14}})} />
          </div>

          <div className="grid grid-cols-2 gap-2">
              <CBtn color="purple" label={`QTR ${state.period}`} onClick={() => setPeriod(state.period + 1, `Q${state.period + 1}`)} />
              <div className="grid grid-cols-2 gap-1">
                  <CBtn color="gray" label="TIMEOUT" onClick={() => {}} />
                  <CBtn color="gray" label="SUB" onClick={() => handleAction('SUB', 'Substitution')} />
              </div>
          </div>
      </div>
  );

  // --- VOLLEYBALL ---
  const renderVolleyball = () => (
      <div className="flex flex-col h-full gap-2">
          <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col gap-2">
                  <CBtn large color="blue" label="POINT" onClick={() => modScore('home', 1)} />
                  <CBtn color="blue" label="SET WON" onClick={() => onUpdate({...state, volleyball: {...state.volleyball!, setsWonHome: (state.volleyball?.setsWonHome || 0) + 1}})} />
                  <CBtn color="gray" label="TIMEOUT" onClick={() => {}} />
              </div>
              <div className="flex flex-col gap-2">
                  <CBtn large color="red" label="POINT" onClick={() => modScore('guest', 1)} />
                  <CBtn color="red" label="SET WON" onClick={() => onUpdate({...state, volleyball: {...state.volleyball!, setsWonGuest: (state.volleyball?.setsWonGuest || 0) + 1}})} />
                  <CBtn color="gray" label="TIMEOUT" onClick={() => {}} />
              </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
              <CBtn color="gray" label="SUBSTITUTION" onClick={() => handleAction('SUB', 'Substitution')} />
              <CBtn color="gray" label={`ROT: ${state.volleyball?.rotationHome}`} onClick={() => onUpdate({...state, volleyball: {...state.volleyball!, rotationHome: (state.volleyball?.rotationHome || 0) % 6 + 1}})} />
          </div>

          <div className="bg-gray-800 p-2 rounded flex justify-between items-center">
              <span className="text-gray-400 font-bold text-xs">SETS: {state.volleyball?.setsWonHome} - {state.volleyball?.setsWonGuest}</span>
              <button className="bg-purple-700 px-4 py-2 rounded font-bold text-xs">NEW SET</button>
          </div>
      </div>
  );

  // --- COMBAT (BOXING / MMA / TKD) ---
  const renderCombat = () => (
      <div className="flex flex-col h-full gap-2">
          {/* Fighters */}
          <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col gap-2">
                  <div className="text-center font-bold text-blue-400">BLUE CORNER</div>
                  <CBtn large color="blue" label="POINT" onClick={() => modScore('home', 1)} />
                  <div className="grid grid-cols-2 gap-1">
                      <CBtn color="gray" label="KNOCKDOWN" onClick={() => {}} />
                      <CBtn color="gray" label="WARNING" onClick={() => {}} />
                  </div>
              </div>
              <div className="flex flex-col gap-2">
                  <div className="text-center font-bold text-red-400">RED CORNER</div>
                  <CBtn large color="red" label="POINT" onClick={() => modScore('guest', 1)} />
                  <div className="grid grid-cols-2 gap-1">
                      <CBtn color="gray" label="KNOCKDOWN" onClick={() => {}} />
                      <CBtn color="gray" label="WARNING" onClick={() => {}} />
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
              <CBtn color="green" label={state.clock.isRunning ? 'STOP' : 'START'} onClick={toggleClock} />
              <CBtn color="gray" label="END RND" onClick={() => {}} />
              <CBtn color="purple" label={`RND ${state.combat?.round}`} onClick={() => onUpdate({...state, combat: {...state.combat!, round: (state.combat?.round || 0) + 1}})} />
          </div>

          {state.activeSport === 'TAEKWONDO' && (
              <div className="grid grid-cols-4 gap-1">
                  <CBtn color="blue" label="+2" onClick={() => modScore('home', 2)} />
                  <CBtn color="blue" label="+3" onClick={() => modScore('home', 3)} />
                  <CBtn color="red" label="+2" onClick={() => modScore('guest', 2)} />
                  <CBtn color="red" label="+3" onClick={() => modScore('guest', 3)} />
              </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
              <CBtn color="yellow" label="KO / STOPPAGE" onClick={() => handleAction('KO', 'Knockout')} />
              <CBtn color="gray" label="DECISION" onClick={() => handleAction('DECISION', 'Judges Decision')} />
          </div>
      </div>
  );

  // --- MOTORSPORTS ---
  const renderMotorsports = () => (
      <div className="flex flex-col h-full gap-2">
          <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col gap-2">
                  <CBtn large color="yellow" label="YELLOW FLAG" onClick={() => onUpdate({...state, motorsports: {...state.motorsports!, flagStatus: 'YELLOW'}})} />
                  <CBtn color="blue" label="SAFETY CAR" onClick={() => onUpdate({...state, motorsports: {...state.motorsports!, flagStatus: 'SC'}})} />
                  <CBtn color="gray" label="PIT ENTRY" onClick={() => handleAction('PIT', 'Pit Stop')} />
              </div>
              <div className="flex flex-col gap-2">
                  <CBtn large color="green" label="GREEN FLAG" onClick={() => onUpdate({...state, motorsports: {...state.motorsports!, flagStatus: 'GREEN'}})} />
                  <CBtn color="red" label="RED FLAG" onClick={() => onUpdate({...state, motorsports: {...state.motorsports!, flagStatus: 'RED'}})} />
                  <CBtn color="gray" label="PENALTY" onClick={() => handleAction('PENALTY', 'Driver Penalty')} />
              </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <CBtn color={state.showDataLayer ? 'purple' : 'gray'} label="TELEMETRY" icon={<Activity size={16}/>} onClick={() => onUpdate({...state, showDataLayer: !state.showDataLayer})} />
              <CBtn color={state.motorsports?.trackMapActive ? 'blue' : 'gray'} label="TRACK MAP" onClick={() => onUpdate({...state, motorsports: {...state.motorsports!, trackMapActive: !state.motorsports?.trackMapActive}})} />
          </div>
      </div>
  );

  return (
    <div className="flex h-full bg-[#111] overflow-hidden">
        {/* Left: Global Clock & Commercial */}
        {opMode === 'STUDIO' && (
            <div className="w-64 border-r border-gray-800 p-4 flex flex-col gap-4">
                <div className="bg-black rounded-xl border-2 border-gray-700 p-4 flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-500 mb-1">{state.activeSport} CLOCK</span>
                    <div className={`text-5xl font-mono font-black mb-2 ${state.clock.isRunning ? 'text-green-500' : 'text-red-500'}`}>
                        {state.clock.minutes.toString().padStart(2, '0')}:{state.clock.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="flex gap-2 w-full">
                        <button onClick={toggleClock} className={`flex-1 py-3 rounded font-bold flex justify-center ${state.clock.isRunning ? 'bg-red-900 text-red-200' : 'bg-green-700 text-green-100'}`}>
                            {state.clock.isRunning ? <Pause /> : <Play />}
                        </button>
                         <button onClick={() => setPeriod(state.period + 1, 'NEXT')} className="px-3 bg-gray-700 rounded text-gray-300 hover:bg-gray-600"><Plus/></button>
                    </div>
                </div>
                
                {/* DATA TOGGLE (GLOBAL) */}
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => toggleGraphic('SCOREBUG')}
                        className={`w-full py-3 rounded font-black flex items-center justify-center gap-2 border transition-all ${state.activeGraphic === 'SCOREBUG' ? 'bg-blue-900 text-blue-200 border-blue-500' : 'bg-gray-800 text-gray-400 border-gray-600'}`}
                    >
                        <Monitor size={16} /> SCOREBUG
                    </button>
                    <button 
                        onClick={() => toggleGraphic('FULL_STATS')}
                        className={`w-full py-3 rounded font-black flex items-center justify-center gap-2 border transition-all ${state.activeGraphic === 'FULL_STATS' ? 'bg-purple-900 text-purple-200 border-purple-500 shadow-lg' : 'bg-gray-800 text-gray-400 border-gray-600'}`}
                    >
                        <BarChart3 size={16} /> FULL STATS
                    </button>
                </div>

                {/* COMMERCIAL TRIGGER */}
                 <div className="mt-auto">
                     <button 
                        onClick={() => onToggleCommercial(commercialMode === 'OFF' ? 'SIDE_BY_SIDE' : 'OFF')}
                        className={`w-full py-4 rounded font-black flex items-center justify-center gap-2 border-2 transition-all ${commercialMode !== 'OFF' ? 'bg-yellow-500 text-black border-yellow-300 animate-pulse' : 'bg-gray-800 text-gray-400 border-gray-600'}`}
                     >
                         <LayoutTemplate size={20} />
                         {commercialMode !== 'OFF' ? 'AD BREAK ACTIVE' : 'START AD BREAK'}
                     </button>
                 </div>
            </div>
        )}

        {/* Right: Sport Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
             {(state.activeSport === 'SOCCER' || state.activeSport === 'FUTSAL') && renderSoccer()}
             {(state.activeSport === 'BASEBALL' || state.activeSport === 'SOFTBOL') && renderBaseball()}
             {state.activeSport === 'MOTORSPORTS' && renderMotorsports()}
             {state.activeSport === 'BASKETBALL' && renderBasketball()}
             {state.activeSport === 'FOOTBALL' && renderFootball()}
             {state.activeSport === 'VOLLEYBALL' && renderVolleyball()}
             {(state.activeSport === 'BOXING' || state.activeSport === 'MMA' || state.activeSport === 'TAEKWONDO') && renderCombat()}
        </div>
    </div>
  );
};
