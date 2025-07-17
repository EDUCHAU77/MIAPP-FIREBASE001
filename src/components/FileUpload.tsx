import React, { useRef, useState } from 'react';
import { Upload, X, FileImage, Video, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  type: 'image' | 'video';
  onFileSelect: (file: File) => void;
  currentFile?: File | null;
  onRemoveFile?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  type, 
  onFileSelect, 
  currentFile, 
  onRemoveFile 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const acceptedTypes = type === 'image' 
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'video/mp4,video/mov,video/webm,video/avi';

  const maxSize = type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for images, 100MB for videos

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes = acceptedTypes.split(',');
    if (!validTypes.some(validType => file.type === validType.trim())) {
      alert(`Tipo de archivo no válido. Solo se permiten: ${acceptedTypes}`);
      return false;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      alert(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    return type === 'image' ? FileImage : Video;
  };

  const FileIcon = getFileIcon();

  if (currentFile) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Archivo cargado</h3>
              <p className="text-sm text-gray-400">
                {type === 'image' ? 'Imagen base' : 'Video corto'}
              </p>
            </div>
          </div>
          {onRemoveFile && (
            <button
              onClick={onRemoveFile}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-red-400" />
            </button>
          )}
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <FileIcon className="h-5 w-5 text-pink-400" />
            <span className="text-white font-medium truncate">{currentFile.name}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatFileSize(currentFile.size)}</span>
            <span>{currentFile.type}</span>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-white"
        >
          Cambiar archivo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center space-x-3 mb-4">
        <FileIcon className={`h-6 w-6 ${type === 'image' ? 'text-pink-500' : 'text-cyan-400'}`} />
        <h2 className="text-xl font-semibold text-white">
          {type === 'image' ? 'Imagen base' : 'Video corto'}
        </h2>
        <span className="text-sm text-gray-400">(opcional)</span>
      </div>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? `border-${type === 'image' ? 'pink' : 'cyan'}-400 bg-${type === 'image' ? 'pink' : 'cyan'}-400/10`
            : `border-gray-600 hover:border-${type === 'image' ? 'pink' : 'cyan'}-500`
        }`}
      >
        <div className={`mx-auto mb-4 p-3 rounded-full ${
          isDragOver 
            ? `bg-${type === 'image' ? 'pink' : 'cyan'}-500/20` 
            : 'bg-gray-700'
        }`}>
          <Upload className={`h-8 w-8 ${
            isDragOver 
              ? `text-${type === 'image' ? 'pink' : 'cyan'}-400` 
              : 'text-gray-400'
          }`} />
        </div>
        
        <p className="text-white font-medium mb-2">
          {isDragOver 
            ? `Suelta tu ${type === 'image' ? 'imagen' : 'video'} aquí`
            : `Haz clic para seleccionar ${type === 'image' ? 'una imagen' : 'un video'}`
          }
        </p>
        
        <p className="text-gray-400 mb-2">
          o arrastra y suelta tu archivo aquí
        </p>
        
        <p className="text-sm text-gray-500">
          {type === 'image' 
            ? 'JPG, PNG, WebP, GIF (máx. 10MB)'
            : 'MP4, MOV, WebM, AVI (máx. 100MB, 2 min)'
          }
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};