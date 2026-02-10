
import React from 'react';
import { OperationMode, NavTab, SystemStats } from '../types';
import { TopBar } from './TopBar';
import { BottomDock } from './BottomDock';

interface MasterLayoutProps {
  opMode: OperationMode;
  stats: SystemStats;
  activeTab: NavTab;
  recording: boolean;
  streaming: boolean;
  time: Date;
  
  // Slots
  topBarActions: {
      onConfig: () => void;
      onRec: () => void;
      onStream: () => void;
  };
  
  leftPanel?: React.ReactNode; // Monitor in Studio
  mainWorkspace: React.ReactNode; // Center
  rightPanel?: React.ReactNode; // Actions
  
  onTabSelect: (tab: NavTab) => void;
}

export const MasterLayout: React.FC<MasterLayoutProps> = ({ 
    opMode, stats, activeTab, recording, streaming, time,
    topBarActions, leftPanel, mainWorkspace, rightPanel, onTabSelect
}) => {
  
  // STUDIO LAYOUT (Grid)
  if (opMode === 'STUDIO') {
      return (
          <div className="h-screen w-screen flex flex-col bg-[#0d0d0d] overflow-hidden text-gray-200">
              <TopBar 
                  stats={stats} 
                  recording={recording} 
                  streaming={streaming} 
                  time={time} 
                  onOpenConfig={topBarActions.onConfig}
                  onToggleRec={topBarActions.onRec}
                  onToggleStream={topBarActions.onStream}
              />
              
              <div className="flex-1 flex overflow-hidden">
                  {/* LEFT: MONITOR / PREVIEW (40-50%) */}
                  <div className="w-[45%] flex flex-col border-r border-gray-800">
                      {leftPanel}
                  </div>

                  {/* CENTER: WORKSPACE (Flexible) */}
                  <div className="flex-1 flex flex-col min-w-0 bg-[#111]">
                      {mainWorkspace}
                  </div>

                  {/* RIGHT: QUICK ACTIONS (15-20%) */}
                  <div className="w-[18%] min-w-[200px] border-l border-gray-800 bg-[#151515]">
                      {rightPanel}
                  </div>
              </div>

              <BottomDock activeTab={activeTab} onSelect={onTabSelect} />
          </div>
      );
  }

  // SINGLE MODE (Vertical Stack for Mobile/Tablet)
  return (
      <div className="h-screen w-screen flex flex-col bg-[#0d0d0d] overflow-hidden text-gray-200">
          <TopBar 
              stats={stats} 
              recording={recording} 
              streaming={streaming} 
              time={time} 
              onOpenConfig={topBarActions.onConfig}
              onToggleRec={topBarActions.onRec}
              onToggleStream={topBarActions.onStream}
          />
          
          <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Main workspace takes full height, simple overlay buttons for actions */}
              <div className="flex-1 relative z-0">
                  {mainWorkspace}
              </div>
              
              {/* Floating Action Bar overlay logic could go here, or handled within specific workspace */}
          </div>

          <BottomDock activeTab={activeTab} onSelect={onTabSelect} />
      </div>
  );
};
