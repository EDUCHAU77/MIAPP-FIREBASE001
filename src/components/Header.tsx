import React from 'react';
import { Zap, Menu, Settings, Home, Edit3, Sparkles, Palette, Download } from 'lucide-react';

interface HeaderProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'input', label: 'Editor', icon: Edit3 },
    { id: 'generator', label: 'IA', icon: Sparkles },
    { id: 'personalization', label: 'Plantillas', icon: Palette },
    { id: 'export', label: 'Exportar', icon: Download },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <header className="bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="relative">
              <Zap className="h-8 w-8 text-pink-500" />
              <div className="absolute inset-0 bg-pink-500 blur-md opacity-50"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
                ThumbCrafter
              </h1>
              <p className="text-xs text-gray-400">Tu creatividad, potenciada por IA</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentScreen === id
                    ? 'bg-gradient-to-r from-pink-500/20 to-cyan-400/20 text-pink-400 border border-pink-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};