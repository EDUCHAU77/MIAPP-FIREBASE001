import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ArrowRight, Zap, CheckCircle } from 'lucide-react';

interface AIGeneratorProps {
  onNavigate: (screen: string) => void;
  projectData: any;
  setProjectData: (data: any) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onNavigate, projectData, setProjectData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(null);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<any[]>([]);

  const mockThumbnails = [
    {
      id: 1,
      title: 'Estilo Dinámico',
      description: 'Colores vibrantes con efectos de movimiento',
      preview: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      style: 'dynamic'
    },
    {
      id: 2,
      title: 'Estilo Minimalista',
      description: 'Diseño limpio con tipografía destacada',
      preview: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      style: 'minimal'
    },
    {
      id: 3,
      title: 'Estilo Emocional',
      description: 'Expresiones llamativas y colores intensos',
      preview: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
      style: 'emotional'
    }
  ];

  useEffect(() => {
    if (projectData.description) {
      generateThumbnails();
    }
  }, []);

  const generateThumbnails = async () => {
    setIsGenerating(true);
    setGeneratedThumbnails([]);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratedThumbnails(mockThumbnails);
    setIsGenerating(false);
  };

  const handleSelectThumbnail = (thumbnailId: number) => {
    setSelectedThumbnail(thumbnailId);
    const selected = generatedThumbnails.find(t => t.id === thumbnailId);
    setProjectData({
      ...projectData,
      selectedThumbnail: selected
    });
  };

  const handleContinue = () => {
    if (selectedThumbnail) {
      onNavigate('editor');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Generador de Miniaturas con IA
        </h1>
        <p className="text-lg text-gray-400">
          La IA está analizando tu descripción y generando opciones optimizadas
        </p>
      </div>

      {/* Project Summary */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Tu proyecto:</h2>
        <div className="space-y-4">
          <p className="text-gray-300 bg-gray-900/50 p-4 rounded-lg">
            <strong>Descripción:</strong> {projectData.description}
          </p>
          
          {(projectData.baseImage || projectData.video) && (
            <div className="grid md:grid-cols-2 gap-4">
              {projectData.baseImage && (
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Imagen base:</h3>
                  <p className="text-white text-sm">{projectData.baseImage.name}</p>
                  <p className="text-gray-400 text-xs">{(projectData.baseImage.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              )}
              
              {projectData.video && (
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Video:</h3>
                  <p className="text-white text-sm">{projectData.video.name}</p>
                  <p className="text-gray-400 text-xs">{(projectData.video.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Generation Status */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <h2 className="text-xl font-semibold text-white">Estado de la IA</h2>
        </div>
        
        {isGenerating ? (
          <div className="flex items-center space-x-4">
            <div className="animate-spin">
              <Zap className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-cyan-400 font-medium">Generando miniaturas...</p>
              <p className="text-sm text-gray-400">Esto puede tomar unos segundos</p>
            </div>
          </div>
        ) : generatedThumbnails.length > 0 ? (
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">¡Generación completada!</p>
              <p className="text-sm text-gray-400">3 opciones generadas para tu proyecto</p>
            </div>
          </div>
        ) : (
          <button
            onClick={generateThumbnails}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
          >
            <Sparkles className="h-5 w-5" />
            <span>Generar miniaturas</span>
          </button>
        )}
      </div>

      {/* Generated Thumbnails */}
      {generatedThumbnails.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Opciones generadas:</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {generatedThumbnails.map((thumbnail) => (
              <div
                key={thumbnail.id}
                onClick={() => handleSelectThumbnail(thumbnail.id)}
                className={`cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                  selectedThumbnail === thumbnail.id
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="relative">
                  <img
                    src={thumbnail.preview}
                    alt={thumbnail.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  {selectedThumbnail === thumbnail.id && (
                    <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{thumbnail.title}</h3>
                  <p className="text-sm text-gray-400">{thumbnail.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => onNavigate('input')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Volver al editor
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={generateThumbnails}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Regenerar</span>
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedThumbnail}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Editar selección</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};