import React from 'react';
import { StudentProfile, AdaptiveBranchNode } from '../types/learnmap';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Award, 
  Flame, 
  X, 
  Zap, 
  Layers, 
  Lightbulb, 
  BrainCircuit, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AIAdaptivePathModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSelectBranch: (branchId: string) => void;
  onOpenMathLab?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const AIAdaptivePathModal: React.FC<AIAdaptivePathModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectBranch,
  onOpenMathLab,
  onOpenVoiceAssistant,
}) => {
  if (!isOpen) return null;

  const branches = profile.adaptiveBranches && profile.adaptiveBranches.length > 0
    ? profile.adaptiveBranches
    : [
        {
          id: 'branch-visual-pizza',
          title: 'Trạm Cứu Trợ: Cắt Bánh Pizza & Bánh Chưng',
          type: 'remedial_visual' as const,
          description: 'Trực quan hóa kích thước đơn vị chia bằng mô hình cắt bánh 6 miếng và 4 góc trước khi làm bài tập số học.',
          icon: '🍕',
          badge: 'Cứu trợ Trực quan',
          visualAnalogy: 'Chia đều bánh pizza 6 phần',
          targetSkill: 'Đồng nhất mẫu số trước khi gộp',
          xpReward: 120,
          unlocked: true,
          completed: false,
        },
        {
          id: 'branch-step-ladder',
          title: 'Bậc Thang Scaffolding: Quy Đồng Mẫu Số Nhỏ',
          type: 'standard' as const,
          description: 'Luyện tập các cặp phân số cơ bản có mẫu số chia hết cho nhau (1/2 và 1/4).',
          icon: '🪜',
          badge: 'Củng cố nền tảng',
          targetSkill: 'Tìm mẫu số chung thuận tiện',
          xpReward: 100,
          unlocked: true,
          completed: false,
        },
      ];

  const isRemedial = profile.errorAttribution === 'conceptual_gap' || profile.errorAttribution === 'careless_calculation';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-indigo-700/60 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Bản Đồ Lộ Trình Học Tập Thích Ứng (AI Adaptive Path)
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Phân Nhánh Cá Nhân Hóa
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lộ trình riêng biệt cho Thuyền trưởng: <strong className="text-white">{profile.name}</strong> • Trường TH Hoài Nhơn
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* AI Strategy Banner */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isRemedial
              ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/50 border-amber-500/40'
              : 'bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border-purple-500/40'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30">
                  {isRemedial ? 'Điều Hướng: Lộ Trình Cứu Trợ Trực Quan' : 'Điều Hướng: Lộ Trình Thử Thách Hack Não'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {profile.themeLabel}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                {isRemedial
                  ? 'Tự động giảm tải độ khó: Bổ sung trạm trải nghiệm bánh chưng & bánh pizza'
                  : 'Năng lực vượt trội: Mở khóa nhánh Hack Não Olympic để thử thách tư duy đỉnh cao!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                {isRemedial
                  ? 'AI nhận thấy con đang cần củng cố trực quan về kích thước đơn vị chia. Con sẽ đi qua trạm hình ảnh trực quan trước khi quay lại các bài tập tính toán số học!'
                  : 'Con đã vượt qua bài test chẩn đoán với điểm số tuyệt đối. Hãy thử sức với những bài toán tư duy mở rộng!'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenVoiceAssistant && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenVoiceAssistant();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nghe Trợ Lý Giảng Bài</span>
                </button>
              )}
            </div>
          </div>

          {/* Visual Dynamic Branch Flowchart */}
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <span>Các Chặng Trên Nhánh Phân Tuyến Của AI</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Dynamic AI Flow</span>
            </div>

            {/* Stages Grid */}
            <div className="space-y-4">
              {branches.map((b, idx) => {
                const isActive = profile.activeBranchId === b.id || idx === 0;
                return (
                  <div
                    key={b.id}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                        : 'bg-slate-900/60 border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
                          {b.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.type === 'remedial_visual'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : b.type === 'advanced_hack'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}>
                              {b.badge}
                            </span>
                            <span className="text-xs font-bold text-white">{b.title}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                            {b.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-semibold">
                            <span className="text-cyan-400">Kỹ năng mục tiêu: {b.targetSkill}</span>
                            <span>•</span>
                            <span className="text-amber-400">+{b.xpReward} XP Thưởng</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-center">
                        {b.type === 'remedial_visual' && onOpenMathLab ? (
                          <button
                            onClick={() => {
                              onSelectBranch(b.id);
                              onClose();
                              onOpenMathLab();
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>Vào Trạm Cắt Bánh Pizza</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectBranch(b.id);
                              onClose();
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>Bắt Đầu Chặng Này</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Hệ thống Lộ trình Thích ứng Tự động (CAT) • Trường Tiểu học Hoài Nhơn</span>
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
