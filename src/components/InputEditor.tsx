import React, { useState } from 'react';
import { FileText, Upload, Video, Youtube, ArrowRight, Lightbulb } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface InputEditorProps {
  onNavigate: (screen: string) => void;
  projectData: any;
  setProjectData: (data: any) => void;
}

export const InputEditor: React.FC<InputEditorProps> = ({ onNavigate, projectData, setProjectData }) => {
  const [description, setDescription] = useState(projectData.description || '');
  const [channelRef, setChannelRef] = useState(projectData.channelRef || '');
  const [baseImage, setBaseImage] = useState<File | null>(projectData.baseImage || null);
  const [video, setVideo] = useState<File | null>(projectData.video || null);

  const handleContinue = () => {
    setProjectData({
      ...projectData,
      description,
      channelRef,
      baseImage,
      video
    });
    onNavigate('generator');
  };

  const handleImageSelect = (file: File) => {
    setBaseImage(file);
  };

  const handleVideoSelect = (file: File) => {
    setVideo(file);
  };

  const handleRemoveImage = () => {
    setBaseImage(null);
  };

  const handleRemoveVideo = () => {
    setVideo(null);
  };
  const suggestions = [
    'Thumbnail para tutorial de programación Python para principiantes',
    'Miniatura gaming para gameplay de Minecraft con estilo épico',
    'Thumbnail educativo sobre historia del arte con colores vibrantes',
    'Miniatura de receta de cocina con ingredientes frescos'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Editor de Entrada
        </h1>
        <p className="text-lg text-gray-400">
          Proporciona los elementos para crear tu miniatura perfecta
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Text Input */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-white">Describe tu idea</h2>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ejemplo: Thumbnail para un video sobre '10 trucos de productividad', con fondo colorido, persona sorprendida, números grandes y estilo dinámico..."
              className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
            />
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Youtube className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Inspírate en un canal</h2>
              <span className="text-sm text-gray-400">(opcional)</span>
            </div>
            <input
              type="text"
              value={channelRef}
              onChange={(e) => setChannelRef(e.target.value)}
              placeholder="Nombre del canal o URL para inspiración de estilo..."
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          {/* Suggestions */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Sugerencias</h2>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setDescription(suggestion)}
                  className="w-full text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - File Uploads */}
        <div className="space-y-6">
          <FileUpload
            type="image"
            onFileSelect={handleImageSelect}
            currentFile={baseImage}
            onRemoveFile={handleRemoveImage}
          />

          <FileUpload
            type="video"
            onFileSelect={handleVideoSelect}
            currentFile={video}
            onRemoveFile={handleRemoveVideo}
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleContinue}
              disabled={!description.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};