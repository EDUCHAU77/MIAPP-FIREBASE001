import React, { useState } from 'react';
import { Download, Settings, Folder, Image, Monitor, Smartphone, Share2 } from 'lucide-react';

interface ExportCenterProps {
  onNavigate: (screen: string) => void;
  projectData: any;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({ onNavigate, projectData }) => {
  const [exportFormat, setExportFormat] = useState('youtube');
  const [quality, setQuality] = useState('hd');
  const [fileName, setFileName] = useState('mi-thumbnail-genial');

  const platforms = [
    { id: 'youtube', name: 'YouTube', size: '1280x720', icon: Monitor },
    { id: 'instagram', name: 'Instagram', size: '1080x1080', icon: Image },
    { id: 'tiktok', name: 'TikTok', size: '1080x1920', icon: Smartphone },
    { id: 'custom', name: 'Personalizado', size: 'Custom', icon: Settings }
  ];

  const qualityOptions = [
    { id: 'hd', label: 'HD (1280x720)', size: '~500KB' },
    { id: '4k', label: '4K (3840x2160)', size: '~2MB' },
    { id: 'web', label: 'Web optimizado', size: '~200KB' }
  ];

  const handleExport = () => {
    // Simulate export process
    console.log('Exporting with:', { exportFormat, quality, fileName });
    
    // Create a mock download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (exportFormat === 'youtube') {
      canvas.width = 1280;
      canvas.height = 720;
    } else if (exportFormat === 'instagram') {
      canvas.width = 1080;
      canvas.height = 1080;
    } else if (exportFormat === 'tiktok') {
      canvas.width = 1080;
      canvas.height = 1920;
    }

    // Fill with a gradient background
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FF0080');
      gradient.addColorStop(1, '#00FFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ThumbCrafter', canvas.width / 2, canvas.height / 2);
    }

    // Download the canvas as image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Exportador Multiformato
        </h1>
        <p className="text-lg text-gray-400">
          Exporta tu miniatura optimizada para cada plataforma
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Export Settings */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Plataforma</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setExportFormat(platform.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    exportFormat === platform.id
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <platform.icon className="h-6 w-6 mx-auto mb-2 text-pink-400" />
                  <div className="text-sm font-medium text-white">{platform.name}</div>
                  <div className="text-xs text-gray-400">{platform.size}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Calidad</span>
            </h2>
            <div className="space-y-3">
              {qualityOptions.map((option) => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="quality"
                    value={option.id}
                    checked={quality === option.id}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                  />
                  <div className="flex-1 flex justify-between">
                    <span className="text-white">{option.label}</span>
                    <span className="text-gray-400 text-sm">{option.size}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* File Settings */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Archivo</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre del archivo</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="transparent"
                  className="w-4 h-4 text-pink-500 focus:ring-pink-500 rounded"
                />
                <label htmlFor="transparent" className="text-sm text-gray-300">
                  Fondo transparente (PNG)
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="timestamp"
                  className="w-4 h-4 text-pink-500 focus:ring-pink-500 rounded"
                />
                <label htmlFor="timestamp" className="text-sm text-gray-300">
                  Agregar timestamp al nombre
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Export */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Vista previa</h2>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="relative bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg aspect-video overflow-hidden">
                {projectData.baseImage ? (
                  <img
                    src={URL.createObjectURL(projectData.baseImage)}
                    alt="Vista previa con imagen del usuario"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={projectData.selectedThumbnail?.preview || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=225'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">TÍTULO PRINCIPAL</h3>
                  <p className="text-gray-200 text-sm">Subtítulo descriptivo</p>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                {exportFormat === 'youtube' && '1280 x 720 px'}
                {exportFormat === 'instagram' && '1080 x 1080 px'}
                {exportFormat === 'tiktok' && '1080 x 1920 px'}
                {exportFormat === 'custom' && 'Tamaño personalizado'}
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Exportar</h2>
            <div className="space-y-4">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-5 w-5" />
                <span>Descargar miniatura</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Compartir enlace</span>
              </button>
              
              <button
                onClick={() => onNavigate('personalization')}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                💾 Guardar como plantilla
              </button>
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-3">Información del archivo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Formato:</span>
                <span className="text-white">PNG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resolución:</span>
                <span className="text-white">
                  {exportFormat === 'youtube' && '1280 x 720'}
                  {exportFormat === 'instagram' && '1080 x 1080'}
                  {exportFormat === 'tiktok' && '1080 x 1920'}
                  {exportFormat === 'custom' && 'Personalizado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tamaño estimado:</span>
                <span className="text-white">
                  {qualityOptions.find(q => q.id === quality)?.size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};