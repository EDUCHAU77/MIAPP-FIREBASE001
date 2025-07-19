import React, { useRef, useState } from 'react';
import { Upload, X, FileImage, Video, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  type: 'image' | 'video';
  onFilesChange: (files: File[]) => void; // Now handles array of files
  currentFiles?: File[] | null; // Now handles array of files
  onRemoveFiles?: () => void; // Changed to onRemoveFiles for consistency
  allowMultiple?: boolean; // New prop to allow multiple file selection
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onFilesChange,
  currentFiles,
  onRemoveFiles,
  allowMultiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const acceptedTypes = type === 'image'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'video/mp4,video/mov,video/webm,video/avi';

  const maxSize = type === 'image' ? 10 * 1024 * 1024 : 500 * 1024 * 1024; // 10MB for images, 500MB for videos
  const maxVideoDuration = 2 * 60 + 24; // 2 minutes and 24 seconds in seconds
  const maxImageCount = 12; // Max 12 images for multiple selection

  const validateFile = (file: File, totalNewFiles: number, existingFilesCount: number): Promise<boolean> => {
    return new Promise(async (resolve) => {
      // 1. Validar tipo de archivo
      const validTypes = acceptedTypes.split(',').map(type => type.trim());
      if (!validTypes.some(validType => file.type.startsWith(validType))) {
        alert(`Tipo de archivo no válido para '${file.name}'. Solo se permiten: ${acceptedTypes}`);
        return resolve(false);
      }
  
      // 2. Validar tamaño de archivo
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        alert(`El archivo '${file.name}' es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
        return resolve(false);
      }
  
      // 3. Validar cantidad de archivos (solo para imágenes y si es carga múltiple)
      if (type === 'image' && (totalNewFiles + existingFilesCount > maxImageCount)) {
        alert(`Demasiadas imágenes. Puedes cargar un máximo de ${maxImageCount} imágenes.`);
        return resolve(false);
      }
  
      // 4. Lógica de validación de video (asíncrona)
      if (type === 'video' && file.type.startsWith('video/')) {
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.src = URL.createObjectURL(file);
  
        tempVideo.onloadedmetadata = () => {
          URL.revokeObjectURL(tempVideo.src);
          if (tempVideo.duration > maxVideoDuration) {
            alert(`El video '${file.name}' es demasiado largo. Duración máxima: ${Math.floor(maxVideoDuration / 60)} minutos y ${maxVideoDuration % 60} segundos`);
            resolve(false);
          } else {
            resolve(true); // Video válido
          }
        };
        tempVideo.onerror = () => {
          URL.revokeObjectURL(tempVideo.src);
          alert(`Error al cargar los metadatos del video '${file.name}'.`);
          resolve(false); // Video inválido
        };
      } else {
        // 5. Si no es un video, asume que es una imagen válida
        resolve(true);
      }
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    if (newFiles.length > 0) {
      const existingFiles = currentFiles || [];
      // Validate each new file, considering existing ones for total count
      const allValid = await Promise.all(newFiles.map(file => validateFile(file, newFiles.length, existingFiles.length)));
      
      if (allValid.every(isValid => isValid)) {
        // If allowing multiple and it's an image upload, add to existing files
        // Otherwise, replace existing files (e.g., for video or single image upload)
        if (allowMultiple && type === 'image') {
          // Only add files that pass validation
          const validNewFiles = newFiles.filter((_, index) => allValid[index]);
          const updatedFiles = [...existingFiles, ...validNewFiles].slice(0, maxImageCount);
          // Sort files by name to ensure consistent order if order matters for combination later.
          // However, user requested order by upload. If user selects multiple files at once, 
          // Array.from(event.target.files) already provides them in the order they were selected.
          // So, no explicit sorting needed here, just concatenation.
          onFilesChange(updatedFiles);
        } else {
          onFilesChange(newFiles.filter((_, index) => allValid[index]));
        }
      }
    }
    // Reset the input value to allow re-uploading the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      const existingFiles = currentFiles || [];
      const allValid = await Promise.all(newFiles.map(file => validateFile(file, newFiles.length, existingFiles.length)));

      if (allValid.every(isValid => isValid)) {
        if (allowMultiple && type === 'image') {
          const validNewFiles = newFiles.filter((_, index) => allValid[index]);
          const updatedFiles = [...existingFiles, ...validNewFiles].slice(0, maxImageCount);
          onFilesChange(updatedFiles);
        } else {
          onFilesChange(newFiles.filter((_, index) => allValid[index]));
        }
      }
    }
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

  const displayFiles = currentFiles || [];

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center space-x-3 mb-4">
        <FileIcon className={`h-6 w-6 ${type === 'image' ? 'text-pink-500' : 'text-cyan-400'}`} />
        <h2 className="text-xl font-semibold text-white">
          {type === 'image' ? 'Imagen(es) base' : 'Video'}
        </h2>
        <span className="text-sm text-gray-400">(opcional)</span>
      </div>

      {displayFiles.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <h3 className="text-white font-medium mb-2">Archivos cargados:</h3>
          <div className="space-y-2">
            {displayFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-green-400" />
                <div className="flex-grow truncate">
                  <span className="text-white font-medium block truncate">{`Foto ${index + 1}: ${file.name}`}</span>
                  <span className="text-sm text-gray-400">{formatFileSize(file.size)}</span>
                </div>
                {/* Optionally add individual file remove button here */}
              </div>
            ))}
          </div>
        </div>
      )}

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
            ? `Suelta tu(s) ${type === 'image' ? 'imagen(es)' : 'video'} aquí`
            : `Haz clic para seleccionar ${type === 'image' ? 'imágenes' : 'un video'}`
          }
        </p>

        <p className="text-gray-400 mb-2">
          o arrastra y suelta tu(s) archivo(s) aquí
        </p>

        <p className="text-sm text-gray-500">
          {type === 'image'
            ? `JPG, PNG, WebP, GIF (máx. 10MB por imagen, hasta ${maxImageCount} imágenes)`
            : `MP4, MOV, WebM, AVI (máx. 500MB, ${Math.floor(maxVideoDuration / 60)} min ${maxVideoDuration % 60} seg)`
          }
        </p>
      </div>

      {displayFiles.length > 0 && onRemoveFiles && (
        <button
          onClick={onRemoveFiles}
          className="w-full mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg font-medium transition-colors text-white"
        >
          Eliminar todas las imágenes
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        multiple={allowMultiple && type === 'image'} // Only allow multiple for images when allowMultiple is true
      />
    </div>
  );
};