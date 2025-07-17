import React, { useState } from 'react';
import { Bookmark, Palette, Clock, Star, Copy, Trash2 } from 'lucide-react';

interface PersonalizationCenterProps {
  onNavigate: (screen: string) => void;
}

export const PersonalizationCenter: React.FC<PersonalizationCenterProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('templates');

  const templates = [
    {
      id: 1,
      name: 'Gaming Épico',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=169',
      category: 'Gaming',
      uses: 15,
      lastUsed: '2 días atrás'
    },
    {
      id: 2,
      name: 'Tutorial Limpio',
      thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=169',
      category: 'Educación',
      uses: 8,
      lastUsed: '1 semana atrás'
    },
    {
      id: 3,
      name: 'Reacción Viral',
      thumbnail: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300&h=169',
      category: 'Entretenimiento',
      uses: 23,
      lastUsed: 'Ayer'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Tutorial Python 2024',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=169',
      created: '2 horas atrás',
      status: 'Exportado'
    },
    {
      id: 2,
      title: 'Gameplay Minecraft',
      thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=169',
      created: '1 día atrás',
      status: 'Borrador'
    }
  ];

  const tabs = [
    { id: 'templates', label: 'Plantillas', icon: Palette },
    { id: 'recent', label: 'Recientes', icon: Clock },
    { id: 'favorites', label: 'Favoritos', icon: Star }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'templates':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Plantillas guardadas</h2>
              <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition-colors">
                + Nueva plantilla
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
                      {template.category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span>{template.uses} usos</span>
                      <span>{template.lastUsed}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                        Usar plantilla
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'recent':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Proyectos recientes</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <div key={project.id} className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className={`absolute top-2 right-2 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white ${
                      project.status === 'Exportado' ? 'bg-green-500/50' : 'bg-yellow-500/50'
                    }`}>
                      {project.status}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{project.created}</p>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                        Continuar editando
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'favorites':
        return (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No tienes favoritos aún</h2>
            <p className="text-gray-400 mb-6">Marca como favoritos tus plantillas y proyectos más utilizados</p>
            <button
              onClick={() => onNavigate('input')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            >
              Crear nuevo proyecto
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Centro de Personalización
        </h1>
        <p className="text-lg text-gray-400">
          Gestiona tus plantillas, proyectos y elementos favoritos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-400 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
        {renderContent()}
      </div>
    </div>
  );
};