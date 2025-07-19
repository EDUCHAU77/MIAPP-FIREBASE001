import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { Terminal, Lightbulb, Save, Link } from 'lucide-react';

interface InputEditorProps {
  onNavigate: (screen: string) => void;
  projectData: any;
  setProjectData: (data: any) => void;
}

export const InputEditor: React.FC<InputEditorProps> = ({ onNavigate, projectData, setProjectData }) => {
  const [description, setDescription] = useState(projectData.description || '');
  const [baseImages, setBaseImages] = useState<File[]>(projectData.baseImages || []); 
  const [video, setVideo] = useState<File | null>(projectData.video || null);
  const [inspirationUrl, setInspirationUrl] = useState(projectData.inspirationUrl || ''); 

  useEffect(() => {
    const updatedProjectData = {
      ...projectData,
      description,
      baseImages,
      video,
      inspirationUrl,
    };
    console.log('InputEditor useEffect: Updating projectData to:', updatedProjectData);
    setProjectData(updatedProjectData);
  }, [description, baseImages, video, inspirationUrl]);

  const handleImageFilesChange = (files: File[]) => {
    console.log('InputEditor: Image files changed:', files);
    setBaseImages(files);
    setVideo(null); 
  };

  const handleVideoFileChange = (files: File[]) => {
    console.log('InputEditor: Video files changed:', files);
    setVideo(files[0] || null);
    setBaseImages([]); 
  };

  const handleRemoveImages = () => {
    console.log('InputEditor: Removing images.');
    setBaseImages([]);
  };

  const handleRemoveVideo = () => {
    console.log('InputEditor: Removing video.');
    setVideo(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">
          Describe tu proyecto de miniatura
        </h1>
        <p className="text-lg text-gray-400">
          Cuéntanos sobre tu video o imagen para que la IA genere miniaturas increíbles.
        </p>
      </div>

      {/* Descripción del proyecto */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Terminal className="h-6 w-6 text-purple-500" />
          <h2 className="text-xl font-semibold text-white">Descripción del proyecto</h2>
        </div>
        <textarea
          className="w-full p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300"
          rows={5}
          placeholder="Ej: Un video tutorial sobre cómo cocinar pasta carbonara, destacando la cremosidad y los ingredientes frescos."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {/* Carga de Archivos */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <FileUpload
          type="image"
          onFilesChange={handleImageFilesChange}
          currentFiles={baseImages}
          onRemoveFiles={handleRemoveImages}
          allowMultiple={false} 
        />
        <FileUpload
          type="video"
          onFilesChange={handleVideoFileChange}
          currentFiles={video ? [video] : null} 
          onRemoveFiles={handleRemoveVideo}
          allowMultiple={false} 
        />
      </div>

      {/* Inspiración con URL */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Link className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">Inspiración con URL (opcional)</h2>
        </div>
        <input
          type="url"
          className="w-full p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300"
          placeholder="Pega aquí una URL de un video o canal para inspirarte (ej: YouTube, Vimeo)"
          value={inspirationUrl}
          onChange={(e) => setInspirationUrl(e.target.value)}
        />
        <p className="text-sm text-gray-400 mt-2">
          Puedes pegar el enlace a un video o canal de YouTube para que la IA se inspire en su estilo.
        </p>
      </div>

      {/* Sugerencias de IA */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-white">Sugerencias de IA (próximamente)</h2>
        </div>
        <p className="text-gray-400">
          La IA podría sugerirte descripciones o elementos clave para tu miniatura basados en tu contenido.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end">
        <button
          onClick={() => onNavigate('generator')} 
          disabled={!description && baseImages.length === 0 && !video && !inspirationUrl} 
          className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-lg font-bold text-white text-lg
                     hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-6 w-6" />
          <span>Generar Miniaturas con IA</span>
        </button>
      </div>
    </div>
  );
};