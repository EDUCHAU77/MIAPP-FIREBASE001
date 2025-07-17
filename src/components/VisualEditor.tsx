import React, { useState } from 'react';
import { Layers, Type, Sticker, Palette, Wand2, ArrowRight, Undo, Redo } from 'lucide-react';

interface VisualEditorProps {
  onNavigate: (screen: string) => void;
  projectData: any;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({ onNavigate, projectData }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [textElements, setTextElements] = useState([
    { id: 1, text: 'TÍTULO PRINCIPAL', x: 50, y: 30, size: 48, color: '#FF0080' },
    { id: 2, text: 'Subtítulo descriptivo', x: 50, y: 70, size: 24, color: '#00FFFF' }
  ]);

  const tools = [
    { id: 'text', label: 'Texto', icon: Type },
    { id: 'layers', label: 'Capas', icon: Layers },
    { id: 'stickers', label: 'Stickers', icon: Sticker },
    { id: 'colors', label: 'Colores', icon: Palette },
    { id: 'magic', label: 'Magic Touch', icon: Wand2 }
  ];

  const fonts = [
    'Poppins', 'Montserrat', 'Roboto', 'Arial Black', 'Impact'
  ];

  const colors = [
    '#FF0080', '#00FFFF', '#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#7209B7', '#FF1744'
  ];

  const renderToolPanel = () => {
    switch (activeTab) {
      case 'text':
        return (
          <div className="space-y-4">
            <button className="w-full p-3 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition-colors">
              + Agregar texto
            </button>
            
            <div className="space-y-3">
              {textElements.map((element) => (
                <div key={element.id} className="p-3 bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={element.text}
                    className="w-full bg-gray-600 text-white p-2 rounded mb-2 text-sm"
                    onChange={(e) => {
                      setTextElements(prev => 
                        prev.map(el => 
                          el.id === element.id ? { ...el, text: e.target.value } : el
                        )
                      );
                    }}
                  />
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={element.size}
                      onChange={(e) => {
                        setTextElements(prev => 
                          prev.map(el => 
                            el.id === element.id ? { ...el, size: parseInt(e.target.value) } : el
                          )
                        );
                      }}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400">{element.size}px</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'colors':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Colores principales</h3>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-gray-600 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        );
      
      case 'magic':
        return (
          <div className="space-y-4">
            <button className="w-full p-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium transition-colors">
              ✨ Auto-optimizar
            </button>
            <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
              🎯 Resaltar emoción
            </button>
            <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              🔥 Aumentar contraste
            </button>
          </div>
        );
      
      default:
        return (
          <div className="text-center text-gray-400 py-8">
            <p>Selecciona una herramienta para comenzar</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Editor Visual Avanzado
        </h1>
        <p className="text-lg text-gray-400">
          Personaliza cada detalle de tu miniatura
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 sticky top-4">
            <h2 className="text-lg font-semibold text-white mb-4">Herramientas</h2>
            
            {/* Tool Tabs */}
            <div className="flex flex-wrap lg:flex-col gap-2 mb-4">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tool.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <tool.icon className="h-4 w-4" />
                  <span className="text-sm">{tool.label}</span>
                </button>
              ))}
            </div>

            {/* Tool Content */}
            <div className="border-t border-gray-700 pt-4">
              {renderToolPanel()}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            {/* Canvas Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Undo className="h-4 w-4" />
                </button>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Redo className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-gray-400">
                1280 x 720 px | YouTube
              </div>
            </div>

            {/* Canvas */}
            <div className="relative bg-gray-900 rounded-lg aspect-video overflow-hidden">
              {projectData.baseImage ? (
                <img
                  src={URL.createObjectURL(projectData.baseImage)}
                  alt="Imagen base del usuario"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={projectData.selectedThumbnail?.preview || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720'}
                  alt="Canvas background"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Text Elements */}
              {textElements.map((element) => (
                <div
                  key={element.id}
                  className="absolute cursor-move select-none"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    fontSize: `${element.size * 0.8}px`,
                    color: element.color,
                    transform: 'translate(-50%, -50%)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                    fontWeight: 'bold'
                  }}
                >
                  {element.text}
                </div>
              ))}

              {/* Grid Overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-pink-500 to-transparent" style={{ width: '1px', left: '33.33%' }}></div>
                <div className="w-full h-full bg-gradient-to-r from-transparent via-pink-500 to-transparent" style={{ width: '1px', left: '66.66%' }}></div>
                <div className="w-full h-full bg-gradient-to-b from-transparent via-pink-500 to-transparent" style={{ height: '1px', top: '33.33%' }}></div>
                <div className="w-full h-full bg-gradient-to-b from-transparent via-pink-500 to-transparent" style={{ height: '1px', top: '66.66%' }}></div>
              </div>
            </div>

            {/* Canvas Footer */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                  Vista previa
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                  Guardar borrador
                </button>
              </div>
              
              <button
                onClick={() => onNavigate('export')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                <span>Exportar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};