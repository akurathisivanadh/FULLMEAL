import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, ImageUp, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onCapture: (base64Img: string) => void;
}

export function CameraUpload({ onCapture }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setImage(imageSrc);
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (image) onCapture(image);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div 
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full relative rounded-3xl overflow-hidden bg-dark-surface border border-dark-border aspect-[3/4] flex flex-col"
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-8">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-full bg-dark-surface/80 text-white backdrop-blur-md hover:bg-dark-surface transition-colors">
                <ImageUp className="w-6 h-6" />
              </button>
              
              <button 
                onClick={capture}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
              >
                <div className="w-full h-full bg-white rounded-full" />
              </button>

              <div className="w-14" /> {/* Spacer to balance flex layout */}
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full relative rounded-3xl overflow-hidden bg-dark-surface border border-dark-border aspect-[3/4]"
          >
            <img src={image} alt="Captured food" className="w-full h-full object-cover" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-6">
              <button 
                onClick={() => setImage(null)}
                className="px-6 py-4 rounded-xl bg-dark-surface text-white font-medium flex items-center gap-2 hover:bg-dark-surface-hover transition-colors">
                <RotateCcw className="w-5 h-5" /> Retake
              </button>
              <button 
                onClick={handleConfirm}
                className="px-6 py-4 rounded-xl bg-brand-primary text-black font-semibold flex items-center gap-2 hover:bg-[#00cce6] transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                <Check className="w-5 h-5" /> Analyze Meal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
