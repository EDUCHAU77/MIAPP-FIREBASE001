import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, ArrowRight, Zap, CheckCircle } from 'lucide-react';

interface AIGeneratorProps {
  onNavigate: (screen: string) => void;
  projectData: any;
  setProjectData: (data: any) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onNavigate, projectData, setProjectData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null); 
  const [generatedThumbnails, setGeneratedThumbnails] = useState<any[]>([]);

  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    // Trigger thumbnail generation when relevant project data changes
    if (projectData.video || (projectData.baseImages && projectData.baseImages.length > 0) || projectData.description) {
      console.log('AIGenerator useEffect: Project data changed, triggering generateThumbnails.');
      generateThumbnails();
    } else {
      console.log('AIGenerator useEffect: No relevant project data, showing no thumbnails initially.');
      setGeneratedThumbnails([]); // Clear thumbnails if no relevant data
    }
  }, [projectData.video, projectData.baseImages, projectData.description]); // Depend on all relevant data

  const extractFramesFromVideo = async (videoFile: File): Promise<any[]> => {
    console.log('extractFramesFromVideo: Starting video frame extraction.');
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const frames: any[] = [];
      let currentFrameTime = 0;
      const maxFrames = 12; // Maximum 12 frames as per user request

      video.preload = 'metadata';
      video.muted = true; 
      video.src = URL.createObjectURL(videoFile);
      objectUrlsRef.current.push(video.src); 

      video.onloadedmetadata = () => {
        console.log('Video metadata loaded. Duration:', video.duration, 'seconds');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const effectiveDuration = video.duration > 0 ? video.duration : 1;
        const frameInterval = effectiveDuration / maxFrames; 

        const captureFrame = () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL('image/jpeg', 0.8); 

            frames.push({
              id: `video-frame-${frames.length + 1}`,
              title: `Fotograma ${frames.length + 1}`,
              description: `Generado en ${currentFrameTime.toFixed(1)} segundos`,
              preview: imageUrl,
              style: 'video-frame'
            });
            console.log('Captured frame at', currentFrameTime.toFixed(1), 's');

            currentFrameTime += frameInterval;

            if (currentFrameTime <= video.duration && frames.length < maxFrames) {
              video.currentTime = currentFrameTime;
            } else {
              console.log('Finished video frame extraction. Total frames:', frames.length);
              resolve(frames);
              video.removeEventListener('seeked', captureFrame);
              video.remove(); 
              canvas.remove(); 
            }
          }
        };

        video.addEventListener('seeked', captureFrame);
        video.currentTime = currentFrameTime; 
      };

      video.onerror = (e) => {
        console.error('Video loading error:', e);
        reject(new Error('Error al cargar el video.'));
      };
    });
  };

  const createCompositeThumbnail = async (imageFiles: File[]): Promise<string> => {
    console.log('createCompositeThumbnail: Starting composite thumbnail creation.');
    return new Promise(async (resolve, reject) => {
      if (imageFiles.length === 0) {
        console.log('createCompositeThumbnail: No images provided.');
        reject(new Error('No images provided for composite thumbnail.'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('createCompositeThumbnail: Could not get 2D context from canvas.');
        reject(new Error('Could not get 2D context from canvas.'));
        return;
      }

      const imagesToLoad: HTMLImageElement[] = [];
      const urlsToRevoke: string[] = [];

      for (const file of imageFiles) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        urlsToRevoke.push(url);
        img.src = url;
        imagesToLoad.push(img);
      }

      console.log(`createCompositeThumbnail: Loading ${imagesToLoad.length} images.`);
      await Promise.all(imagesToLoad.map(img => new Promise((imgResolve, imgReject) => {
        img.onload = imgResolve;
        img.onerror = imgReject;
      }))).catch(error => {
        urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
        console.error("createCompositeThumbnail: Error loading one or more images:", error);
        reject(new Error(`Error loading one or more images: ${error.message}`));
        return;
      });
      console.log('createCompositeThumbnail: All images loaded.');

      // Determine layout based on number of images (up to 4 for combinations)
      let rows = 1;
      let cols = imageFiles.length;

      if (imageFiles.length === 2) { 
        rows = 1;
        cols = 2;
      } else if (imageFiles.length === 3) {
        rows = 1; 
        cols = 3;
      } else if (imageFiles.length === 4) {
        rows = 2;
        cols = 2;
      } else { // For single images or more than 4 (shouldn't happen with 2-4 logic)
        rows = 1;
        cols = 1;
      }
      
      const thumbnailWidth = 400;
      const thumbnailHeight = 225;
      canvas.width = thumbnailWidth;
      canvas.height = thumbnailHeight;

      const cellWidth = canvas.width / cols;
      const cellHeight = canvas.height / rows;

      let currentImageIndex = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (currentImageIndex < imagesToLoad.length) {
            const img = imagesToLoad[currentImageIndex];
            
            const imgAspectRatio = img.width / img.height;
            const cellAspectRatio = cellWidth / cellHeight;

            let drawWidth = cellWidth;
            let drawHeight = cellHeight;
            let offsetX = 0;
            let offsetY = 0;

            if (imgAspectRatio > cellAspectRatio) {
              drawHeight = cellWidth / imgAspectRatio;
              offsetY = (cellHeight - drawHeight) / 2;
            } else {
              drawWidth = cellHeight * imgAspectRatio;
              offsetX = (cellWidth - drawWidth) / 2;
            }

            ctx.drawImage(
              img,
              c * cellWidth + offsetX,
              r * cellHeight + offsetY,
              drawWidth,
              drawHeight
            );
            currentImageIndex++;
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);
          }
        }
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
      console.log('createCompositeThumbnail: Composite thumbnail created.');
      resolve(dataUrl);
    });
  };

  // New helper to generate combinations of images
  const generateImageCombinations = async (images: File[], description: string, startIndex: number): Promise<any[]> => {
    console.log('generateImageCombinations: Starting image combination generation.');
    const combinedThumbnails: any[] = [];
    const styles = ['Emocional', 'Minimalista', 'Dinámica', 'Clásica', 'Moderna']; // More styles
    let currentId = startIndex;

    if (images.length === 0) {
        return [];
    }

    const maxCombinationsToGenerate = 12; // Increased limit for more options
    let combinationsCount = 0;

    // Helper to normalize text for matching (remove accents, convert to lower case)
    const normalizeText = (text: string) => {
      return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    };

    const normalizedDescription = normalizeText(description);
    const availableImages = [...images]; // Create a mutable copy
    const usedImageIndices = new Set<number>(); // To track images used in specific combinations

    // 1. Try to create specific combinations based on "foto X" references
    const photoNumberMatches = [...normalizedDescription.matchAll(/foto\s*(\d+)/g)];
    const requestedPhotoIndices = photoNumberMatches
        .map(match => parseInt(match[1], 10) - 1) // Convert to 0-based index
        .filter(index => index >= 0 && index < images.length);

    if (requestedPhotoIndices.length >= 2 && requestedPhotoIndices.length <= 4) {
        const specificImages: File[] = [];
        const specificImageNames: string[] = [];
        for (const index of requestedPhotoIndices) {
            specificImages.push(images[index]);
            specificImageNames.push(`Foto ${index + 1}`);
            usedImageIndices.add(index);
        }

        try {
            const compositeUrl = await createCompositeThumbnail(specificImages);
            const selectedStyle = styles[Math.floor(Math.random() * styles.length)];
            combinedThumbnails.push({
                id: `combined-specific-photo-ref-${currentId++}`,
                title: `Combinación: ${specificImageNames.join(' y ')}`,
                description: `Sugerencia de IA (estilo ${selectedStyle})`,
                preview: compositeUrl,
                style: 'composite-image'
            });
            combinationsCount++;
        } catch (error) {
            console.error("Error creating specific composite thumbnail from photo reference:", error);
        }
    }

    // 2. Try to create specific combinations based on description matching file names
    const descriptionKeywords = normalizedDescription.split(/\s*,\s*|\s+con\s+|\s+y\s+|\s+/).filter(word => word.length > 2);
    let specificCombinationsAttempted = 0;

    // Look for combinations of 2 to 4 images mentioned together
    for (let i = 0; i < descriptionKeywords.length && specificCombinationsAttempted < 5; i++) { // Limit attempts
        if (combinationsCount >= maxCombinationsToGenerate) break;
        const potentialCombination: File[] = [];
        const potentialIndices: number[] = [];

        // Find images that match current and subsequent keywords
        for (let j = 0; j < Math.min(4, descriptionKeywords.length - i); j++) {
            const keyword = descriptionKeywords[i + j];
            const matchingImage = availableImages.find((img, idx) => 
                !usedImageIndices.has(idx) && normalizeText(img.name).includes(keyword)
            );
            if (matchingImage) {
                potentialCombination.push(matchingImage);
                potentialIndices.push(images.indexOf(matchingImage)); // Use original index
            }
        }

        if (potentialCombination.length >= 2 && potentialCombination.length <= 4) {
            // Ensure these specific images haven't been used together in a prior specific combo
            if (potentialCombination.every(img => !usedImageIndices.has(images.indexOf(img)))) {
                try {
                    const compositeUrl = await createCompositeThumbnail(potentialCombination);
                    const selectedStyle = styles[Math.floor(Math.random() * styles.length)];
                    const imageNames = potentialCombination.map(img => img.name.split('.')[0]).join(', ');

                    combinedThumbnails.push({
                        id: `combined-specific-keyword-${currentId++}`,
                        title: `Combinación: ${imageNames}`,
                        description: `Sugerencia de IA (estilo ${selectedStyle})`,
                        preview: compositeUrl,
                        style: 'composite-image'
                    });
                    combinationsCount++;
                    potentialIndices.forEach(idx => usedImageIndices.add(idx)); // Mark as used for specific combos
                } catch (error) {
                    console.error("Error creating specific composite thumbnail:", error);
                }
            }
        }
        specificCombinationsAttempted++;
        if (combinationsCount >= maxCombinationsToGenerate) break;
    }

    // 3. Generate single image thumbnails (up to 4, if not already generated as part of combined)
    // Only add if total combinations are still low and images haven't been used in a specific combo
    const singleImagesToAdd = availableImages.filter((_, idx) => !usedImageIndices.has(idx)).slice(0, 4);
    for (let i = 0; i < singleImagesToAdd.length; i++) {
        if (combinationsCount >= maxCombinationsToGenerate) break;
        try {
            const imgFile = singleImagesToAdd[i];
            const previewUrl = URL.createObjectURL(imgFile);
            objectUrlsRef.current.push(previewUrl);
            combinedThumbnails.push({
                id: `combined-single-${currentId++}`,
                title: `Foto ${images.indexOf(imgFile) + 1}`,
                description: `Imagen base cargada`,
                preview: previewUrl,
                style: 'single-image'
            });
            combinationsCount++;
        } catch (error) {
            console.error(`Error generating single thumbnail for image ${i + 1}:`, error);
        }
    }

    // 4. Generate random combinations of 2 to 4 images if more slots are available
    const unusedImages = availableImages.filter((_, idx) => !usedImageIndices.has(idx));

    const generateRandomCombinationFromPool = (arr: File[], count: number): File[] => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    while (combinationsCount < maxCombinationsToGenerate && unusedImages.length >= 2) {
        const numImagesInCombination = Math.floor(Math.random() * 3) + 2; // Randomly 2, 3, or 4
        if (unusedImages.length < numImagesInCombination) break; 

        const selectedImages = generateRandomCombinationFromPool(unusedImages, numImagesInCombination);
        if (selectedImages.length === 0) continue;

        try {
            const compositeUrl = await createCompositeThumbnail(selectedImages);
            let selectedStyle = styles[Math.floor(Math.random() * styles.length)];
            
            // Simulate text-based style influence (even for random combos)
            if (normalizedDescription.includes('emocional')) selectedStyle = 'Emocional';
            else if (normalizedDescription.includes('minimalista')) selectedStyle = 'Minimalista';
            else if (normalizedDescription.includes('dinámica') || normalizedDescription.includes('dinamica')) selectedStyle = 'Dinámica';

            combinedThumbnails.push({
                id: `combined-random-${currentId++}`,
                title: `Combinación aleatoria ${selectedImages.length}`,
                description: `Sugerencia de IA (estilo ${selectedStyle})`,
                preview: compositeUrl,
                style: 'composite-image'
            });
            combinationsCount++;
        } catch (error) {
            console.error("Error creating random composite thumbnail:", error);
        }
    }

    console.log(`generateImageCombinations: Generated ${combinedThumbnails.length} combined thumbnails.`);
    return combinedThumbnails;
  };

  const generateThumbnails = async () => {
    console.log('generateThumbnails: Function called.');
    setIsGenerating(true);
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
    setGeneratedThumbnails([]);
    setSelectedThumbnail(null);
    
    console.log('generateThumbnails: Current projectData state:', projectData);

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    let newThumbnails: any[] = [];
    let currentIdCounter = 0; 

    // 1. Generate from Video (prioritized if video is present)
    if (projectData.video) {
      console.log('generateThumbnails: Attempting to process video.');
      try {
        const videoFrames = await extractFramesFromVideo(projectData.video);
        const videoThumbs = videoFrames.map(frame => ({
          ...frame,
          id: `video-${currentIdCounter++}` // Ensure unique ID
        }));
        newThumbnails = newThumbnails.concat(videoThumbs);
        console.log(`generateThumbnails: Added ${videoThumbs.length} video thumbnails. Total so far: ${newThumbnails.length}`);
      } catch (error) {
        console.error("generateThumbnails: Error processing video:", error);
      }
    }

    // 2. Generate from Base Images if no video, or if base images are explicitly provided without a video
    // and the user wants combinations.
    if (!projectData.video && projectData.baseImages && projectData.baseImages.length > 0) {
      console.log('generateThumbnails: Attempting to generate image combinations.');
      try {
        const imageCombs = await generateImageCombinations(projectData.baseImages, projectData.description || '', currentIdCounter);
        newThumbnails = newThumbnails.concat(imageCombs);
        currentIdCounter += imageCombs.length;
        console.log(`generateThumbnails: Added ${imageCombs.length} image combination thumbnails. Total so far: ${newThumbnails.length}`);
      } catch (error) {
        console.error("generateThumbnails: Error generating image combinations:", error);
      }
    }

    console.log('generateThumbnails: Final newThumbnails array before setting state:', newThumbnails);
    console.log('generateThumbnails: Final count of newThumbnails:', newThumbnails.length);
    setGeneratedThumbnails(newThumbnails);
    setIsGenerating(false);
    console.log('generateThumbnails: Generation complete. isGenerating set to false.');
  };

  const handleSelectThumbnail = (thumbnailId: string) => {
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
            <strong>Descripción:</strong> {projectData.description || 'No proporcionada'}
          </p>
          
          {(projectData.baseImages && projectData.baseImages.length > 0 || projectData.video) && (
            <div className="grid md:grid-cols-2 gap-4">
              {projectData.baseImages && projectData.baseImages.length > 0 && (
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Imagen(es) base:</h3>
                  {projectData.baseImages.map((file: File, index: number) => (
                    <p key={index} className="text-white text-sm">{`Foto ${index + 1}: ${file.name}`} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                  ))}
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
           {/* Removed inspirationUrl display as it's no longer used for generation */}
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
              <p className="text-sm text-gray-400">{generatedThumbnails.length} opciones generadas para tu proyecto</p>
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