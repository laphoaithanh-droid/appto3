import React, { useState, useEffect } from 'react';
import { StudentProfile, VoiceLecture } from '../types/learnmap';
import { 
  voiceAssistant, 
  CURATED_VOICE_LECTURES 
} from '../services/voiceAssistantService';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  X, 
  Layers, 
  Clock, 
  Heart, 
  MessageSquare,
  BookOpen
} from 'lucide-react';

interface AIVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  customTextToRead?: string;
  customTopicTitle?: string;
}

export const AIVoiceAssistantModal: React.FC<AIVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  profile,
  customTextToRead,
  customTopicTitle,
}) => {
  const [selectedLectureIdx, setSelectedLectureIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const lectures = CURATED_VOICE_LECTURES;
  const currentLecture = lectures[selectedLectureIdx] || lectures[0];

  const speechContent = customTextToRead || currentLecture.speechText;
  const displayTitle = customTopicTitle || currentLecture.title;

  useEffect(() => {
    return () => {
      // Dừng giọng nói khi đóng modal
      voiceAssistant.stop();
    };
  }, []);

  if (!isOpen) return null;

  const handlePlayVoice = () => {
    if (voiceAssistant.isSpeaking()) {
      voiceAssistant.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    voiceAssistant.speak(
      speechContent,
      () => setIsPlaying(true),
      () => {
        setIsPlaying(false);
        setCurrentStep(currentLecture.cards.length - 1);
      },
      () => setIsPlaying(false)
    );
  };

  const handleStopVoice = () => {
    voiceAssistant.stop();
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStep + 1 < currentLecture.cards.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-purple-700/60 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Trợ Lý Ảo Giảng Bài Bằng Giọng Nói (Voice AI)
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Audio & Hoạt Họa &lt; 2 Phút
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Đọc diễn cảm đề bài • Giải thích trực quan dễ hiểu cho học sinh Lớp 1, 2, 3, 4, 5
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Talking Mascot Stage */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/50 via-slate-900 to-indigo-950/40 border border-purple-800/40 text-center space-y-4">
            {/* Mascot Avatar with Sound Waves */}
            <div className="relative inline-block">
              {/* Animated wave rings when speaking */}
              {isPlaying && (
                <>
                  <span className="absolute -inset-4 rounded-full bg-purple-500/20 animate-ping" />
                  <span className="absolute -inset-8 rounded-full bg-pink-500/10 animate-pulse" />
                </>
              )}

              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-purple-400/60 flex items-center justify-center text-4xl shadow-xl shadow-purple-950/60 mx-auto">
                {profile.petAvatar}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 px-2.5 py-0.5 rounded-full bg-slate-900 border border-purple-500/30">
                Linh vật {profile.petName} đang đồng hành
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-white mt-1.5">
                {displayTitle}
              </h4>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Thời lượng: {currentLecture.duration}</span>
              </p>
            </div>

            {/* Voice Audio Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePlayVoice}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/30'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Tạm Dừng Giọng Nói' : 'Bắt Đầu Nghe Giảng Bài'}</span>
              </button>

              <button
                onClick={handleStopVoice}
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Dừng và đọc lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Under 2-minute Visual Slide Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span>Hoạt Họa Minh Họa Từng Bước (Visual Step-by-Step)</span>
              <span className="text-purple-400 font-mono">
                Bước {currentStep + 1} / {currentLecture.cards.length}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 shadow-inner">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-purple-500/30 flex items-center justify-center text-5xl shrink-0 shadow-lg">
                {currentLecture.cards[currentStep]?.visualEmoji || '🍕'}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  Bước {currentLecture.cards[currentStep]?.step}: {currentLecture.cards[currentStep]?.heading}
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {currentLecture.cards[currentStep]?.caption}
                </p>
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                Quay lại bước trước
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStep + 1 >= currentLecture.cards.length}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                Xem bước tiếp theo &rarr;
              </button>
            </div>
          </div>

          {/* Lecture Switcher */}
          {!customTextToRead && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400">Chọn chủ đề bài giảng khác:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {lectures.map((lec, idx) => (
                  <button
                    key={lec.id}
                    onClick={() => {
                      voiceAssistant.stop();
                      setIsPlaying(false);
                      setSelectedLectureIdx(idx);
                      setCurrentStep(0);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedLectureIdx === idx
                        ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-white truncate">{lec.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Lớp {lec.gradeLevel} • {lec.duration}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Công nghệ Trợ lý Giọng nói Thân thiện • Trường Tiểu học Hoài Nhơn</span>
          <button
            onClick={() => {
              voiceAssistant.stop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
