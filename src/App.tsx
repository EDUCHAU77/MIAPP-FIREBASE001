import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { InputEditor } from './components/InputEditor';
import { AIGenerator } from './components/AIGenerator';
import { VisualEditor } from './components/VisualEditor';
import { PersonalizationCenter } from './components/PersonalizationCenter';
import { ExportCenter } from './components/ExportCenter';
import { Settings } from './components/Settings';

type Screen = 'home' | 'input' | 'generator' | 'editor' | 'personalization' | 'export' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [projectData, setProjectData] = useState({
    description: '',
    baseImage: null,
    video: null,
    channelRef: '',
    selectedThumbnail: null,
  });

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomePage onNavigate={navigateToScreen} />;
      case 'input':
        return <InputEditor onNavigate={navigateToScreen} projectData={projectData} setProjectData={setProjectData} />;
      case 'generator':
        return <AIGenerator onNavigate={navigateToScreen} projectData={projectData} setProjectData={setProjectData} />;
      case 'editor':
        return <VisualEditor onNavigate={navigateToScreen} projectData={projectData} />;
      case 'personalization':
        return <PersonalizationCenter onNavigate={navigateToScreen} />;
      case 'export':
        return <ExportCenter onNavigate={navigateToScreen} projectData={projectData} />;
      case 'settings':
        return <Settings onNavigate={navigateToScreen} />;
      default:
        return <HomePage onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header currentScreen={currentScreen} onNavigate={navigateToScreen} />
      <main className="container mx-auto px-4 py-8">
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;