import React, { useState } from 'react';
import { StudentProfile, LearningActivityLog } from '../types/learnmap';
import { 
  X, 
  Sparkles, 
  Layers, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Flame, 
  Gamepad2, 
  Calculator, 
  Lightbulb, 
  Award,
  ArrowRight
} from 'lucide-react';

interface MathLabVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onAwardXp: (amount: number, reason: string) => void;
  onLogActivity?: (log: LearningActivityLog) => void;
}

export const MathLabVisualizerModal: React.FC<MathLabVisualizerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onAwardXp,
  onLogActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'minigame'>('visualizer');

  // Visualizer state
  const [numA, setNumA] = useState(1);
  const [denA, setDenA] = useState(2);
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(3);
  const [isEquated, setIsEquated] = useState(false); // Đã quy đồng mẫu số chưa
  const [isMerged, setIsMerged] = useState(false); // Đã gộp chưa

  // Minigame state
  const [gameScore, setGameScore] = useState(0);
  const [gameQuestionIdx, setGameQuestionIdx] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  if (!isOpen) return null;

  // Tính BCNN đơn giản
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  const commonDenom = lcm(denA, denB);
  const equivNumA = (numA * commonDenom) / denA;
  const equivNumB = (numB * commonDenom) / denB;
  const totalNum = equivNumA + equivNumB;

  const minigameQuestions = [
    {
      q: 'Mẫu số chung nhỏ nhất của 1/2 và 1/3 là số mấy?',
      options: ['5', '6', '12', '23'],
      correct: '6',
      explain: 'Vì 6 là số nhỏ nhất cùng chia hết cho 2 và 3 (2 × 3 = 6).',
    },
    {
      q: 'Khi quy đồng mẫu số chung là 6, phân số 1/2 trở thành:',
      options: ['2/6', '3/6', '1/6', '4/6'],
      correct: '3/6',
      explain: 'Nhân cả tử số và mẫu số của 1/2 với 3: (1×3)/(2×3) = 3/6.',
    },
    {
      q: 'Tổng của 1/2 + 1/3 sau khi quy đồng mẫu số bằng:',
      options: ['2/5', '5/6', '6/5', '4/6'],
      correct: '5/6',
      explain: 'Ta có: 3/6 + 2/6 = (3+2)/6 = 5/6. Tuyệt đối không cộng mẫu số với mẫu số!',
    },
    {
      q: 'Phân số 1/4 và 1/2 có mẫu số chung thuận tiện nhất là:',
      options: ['8', '4', '6', '2'],
      correct: '4',
      explain: 'Vì 4 chia hết cho 2, nên chỉ cần giữ nguyên 1/4 và quy đồng 1/2 = 2/4!',
    },
  ];

  const handleAnswerMinigame = (selectedOption: string) => {
    const curr = minigameQuestions[gameQuestionIdx];
    if (selectedOption === curr.correct) {
      setGameScore((prev) => prev + 50);
      setGameFeedback(`🎉 Chính xác! ${curr.explain}`);
      onAwardXp(50, 'Đấu trường Phân số: Trả lời đúng');
      
      if (onLogActivity) {
        onLogActivity({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          studentId: profile.id,
          studentName: profile.name,
          className: profile.className || `${profile.grade}A1`,
          action: 'Đấu trường Minigame Phân số',
          topic: 'Quy đồng mẫu số thực hành',
          result: 'correct',
          xpAwarded: 50,
          pedagogicalNote: `Giải đúng câu hỏi: "${curr.q}"`,
        });
      }
    } else {
      setGameFeedback(`💡 Chưa đúng rồi! ${curr.explain}`);
    }

    setTimeout(() => {
      setGameFeedback(null);
      if (gameQuestionIdx + 1 < minigameQuestions.length) {
        setGameQuestionIdx((prev) => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleResetVisualizer = () => {
    setIsEquated(false);
    setIsMerged(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-indigo-700/60 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Phòng Thí Nghiệm Toán Học Trực Quan GDPT 2018
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Interactive Lab
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mô hình thanh phân số động (Visual Fraction Strips) & Đấu trường thực hành
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'visualizer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mô Phỏng Trực Quan Quy Đồng</span>
          </button>

          <button
            onClick={() => setActiveTab('minigame')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'minigame'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Đấu Trường Toán Học (+XP)</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: VISUALIZER */}
          {activeTab === 'visualizer' && (
            <div className="space-y-6">
              {/* Concept intro banner */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Bản chất sư phạm:</strong> Không thể gộp hai phân số khi kích thước các phần chia (mẫu số) không bằng nhau. Bằng cách quy đồng về mẫu số chung, ta chia nhỏ các thanh thành những phần đồng kích thước trước khi cộng!
                </div>
              </div>

              {/* Fraction selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fraction A */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-400">Phân số thứ nhất (A)</span>
                    <span className="text-base font-extrabold text-cyan-300 font-mono">
                      {numA} / {denA}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Tử số (Số phần lấy):</span>
                        <strong className="text-white">{numA}</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max={denA - 1 || 1}
                        value={numA}
                        disabled={isEquated}
                        onChange={(e) => {
                          setNumA(Number(e.target.value));
                          handleResetVisualizer();
                        }}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Mẫu số (Số phần chia):</span>
                        <strong className="text-white">{denA}</strong>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        value={denA}
                        disabled={isEquated}
                        onChange={(e) => {
                          const newDen = Number(e.target.value);
                          setDenA(newDen);
                          if (numA >= newDen) setNumA(newDen - 1);
                          handleResetVisualizer();
                        }}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Fraction B */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400">Phân số thứ hai (B)</span>
                    <span className="text-base font-extrabold text-amber-300 font-mono">
                      {numB} / {denB}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Tử số (Số phần lấy):</span>
                        <strong className="text-white">{numB}</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max={denB - 1 || 1}
                        value={numB}
                        disabled={isEquated}
                        onChange={(e) => {
                          setNumB(Number(e.target.value));
                          handleResetVisualizer();
                        }}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Mẫu số (Số phần chia):</span>
                        <strong className="text-white">{denB}</strong>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        value={denB}
                        disabled={isEquated}
                        onChange={(e) => {
                          const newDen = Number(e.target.value);
                          setDenB(newDen);
                          if (numB >= newDen) setNumB(newDen - 1);
                          handleResetVisualizer();
                        }}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Strips Area */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Mô Hình Trực Quan Phân Số</span>
                  {isEquated && (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold animate-pulse">
                      Mẫu số chung: {commonDenom}
                    </span>
                  )}
                </div>

                {/* Strip A */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Thanh A: {isEquated ? `${equivNumA}/${commonDenom}` : `${numA}/${denA}`}</span>
                    <span className="text-[11px] text-cyan-400">
                      {isEquated ? `Nhân tử và mẫu với ${commonDenom / denA}` : `Kích thước mỗi khoang = 1/${denA}`}
                    </span>
                  </div>
                  <div className="h-10 w-full bg-slate-900 rounded-xl border border-slate-800 flex overflow-hidden">
                    {Array.from({ length: isEquated ? commonDenom : denA }).map((_, i) => {
                      const isTaken = isEquated ? i < equivNumA : i < numA;
                      return (
                        <div
                          key={i}
                          className={`flex-1 border-r border-slate-950/80 flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-500 ${
                            isTaken
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                              : 'bg-slate-900/60 text-slate-600'
                          }`}
                        >
                          1/{isEquated ? commonDenom : denA}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strip B */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Thanh B: {isEquated ? `${equivNumB}/${commonDenom}` : `${numB}/${denB}`}</span>
                    <span className="text-[11px] text-amber-400">
                      {isEquated ? `Nhân tử và mẫu với ${commonDenom / denB}` : `Kích thước mỗi khoang = 1/${denB}`}
                    </span>
                  </div>
                  <div className="h-10 w-full bg-slate-900 rounded-xl border border-slate-800 flex overflow-hidden">
                    {Array.from({ length: isEquated ? commonDenom : denB }).map((_, i) => {
                      const isTaken = isEquated ? i < equivNumB : i < numB;
                      return (
                        <div
                          key={i}
                          className={`flex-1 border-r border-slate-950/80 flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-500 ${
                            isTaken
                              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                              : 'bg-slate-900/60 text-slate-600'
                          }`}
                        >
                          1/{isEquated ? commonDenom : denB}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Merged Strip when clicked */}
                {isMerged && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 animate-fade-in">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                      <span>Thanh Tổng Hợp: {equivNumA}/{commonDenom} + {equivNumB}/{commonDenom} = {totalNum}/{commonDenom}</span>
                      <span>{totalNum >= commonDenom ? '(Lớn hơn hoặc bằng 1 đơn vị)' : ''}</span>
                    </div>
                    <div className="h-12 w-full bg-slate-900 rounded-xl border-2 border-emerald-500/60 flex overflow-hidden shadow-lg shadow-emerald-500/10">
                      {Array.from({ length: commonDenom }).map((_, i) => {
                        const fromA = i < equivNumA;
                        const fromB = i >= equivNumA && i < totalNum;
                        return (
                          <div
                            key={i}
                            className={`flex-1 border-r border-slate-950/80 flex items-center justify-center text-[10px] font-bold font-mono ${
                              fromA
                                ? 'bg-cyan-600 text-white'
                                : fromB
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-900 text-slate-700'
                            }`}
                          >
                            1/{commonDenom}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleResetVisualizer}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại kích thước ban đầu</span>
                </button>

                <div className="flex items-center gap-2">
                  {!isEquated ? (
                    <button
                      onClick={() => setIsEquated(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Bước 1: Kích Hoạt Quy Đồng Mẫu Số</span>
                    </button>
                  ) : !isMerged ? (
                    <button
                      onClick={() => {
                        setIsMerged(true);
                        onAwardXp(100, 'Làm chủ Thí nghiệm Trực quan Quy đồng');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bước 2: Gộp Hai Phân Số Lại (+100 XP)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hoàn tất chứng minh bản chất cộng phân số!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MINIGAME */}
          {activeTab === 'minigame' && (
            <div className="space-y-6">
              {/* Gamification stats banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-300 uppercase">Đấu trường Tri thức Hoài Nhơn</div>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    Thử Thách Phản Xạ Phân Số GDPT 2018
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Điểm Đấu Trường</span>
                    <span className="text-sm font-extrabold text-amber-400">⭐ {gameScore} XP</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Tiến độ</span>
                    <span className="text-sm font-bold text-indigo-300">
                      {gameQuestionIdx + 1} / {minigameQuestions.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Game card */}
              {!gameFinished ? (
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase">
                      Câu hỏi {gameQuestionIdx + 1}:
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                      {minigameQuestions[gameQuestionIdx].q}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {minigameQuestions[gameQuestionIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerMinigame(opt)}
                        disabled={!!gameFeedback}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500 hover:bg-indigo-950/40 text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between group disabled:opacity-50"
                      >
                        <span>{opt}</span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      </button>
                    ))}
                  </div>

                  {/* Feedback toast */}
                  {gameFeedback && (
                    <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-500/50 text-xs text-indigo-200 animate-fade-in font-medium">
                      {gameFeedback}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-950 border border-indigo-500/40 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-white">Xuất Sắc Vượt Qua Đấu Trường!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Thuyền trưởng {profile.name} đã tích lũy thêm <strong>+{gameScore} XP</strong> cho Trường Tiểu học Hoài Nhơn!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setGameFinished(false);
                      setGameQuestionIdx(0);
                      setGameScore(0);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Chơi lại từ đầu
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Hệ sinh thái Học tập Thích ứng • Trường Tiểu học Hoài Nhơn</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
