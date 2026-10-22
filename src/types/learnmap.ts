export type AppMode = 'student' | 'parent_teacher' | 'architect';

export type StudentTheme = 'space' | 'dinosaurs' | 'cooking' | 'robotics' | 'ocean';

export type ErrorAttribution = 
  | 'careless_calculation' // Sai do tính toán ẩu (nhầm số, quên nhớ)
  | 'conceptual_gap'       // Sai do không hiểu lý thuyết gốc (cộng thẳng mẫu số)
  | 'reading_comprehension'// Sai do đọc hiểu đề bài kém (bài toán lời văn)
  | 'mastered';            // Đã làm chủ hoàn toàn

export interface MultiTierTrace {
  currentGradeConcept: string; // VD: Lớp 5 - Cộng hai số thập phân
  tier1RootCause: string;      // VD: Lớp 4 - Đặt tính lệch hàng (dấu phẩy không thẳng)
  tier2RootCause: string;      // VD: Lớp 2-3 - Bảng cộng trừ có nhớ trong phạm vi 100
  pedagogicalAdvice: string;
}

export interface AdaptiveBranchNode {
  id: string;
  title: string;
  type: 'remedial_visual' | 'advanced_hack' | 'standard';
  description: string;
  icon: string;
  badge: string;
  visualAnalogy?: string; // Bánh chưng, bánh pizza, thanh đo
  targetSkill: string;
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
}

export interface VoiceLectureCard {
  step: number;
  heading: string;
  visualEmoji: string;
  caption: string;
}

export interface VoiceLecture {
  id: string;
  title: string;
  topic: string;
  duration: string; // "< 2 phút"
  gradeLevel: number;
  speechText: string;
  cards: VoiceLectureCard[];
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: number;
  className?: string; // 4A1, 4A2
  schoolName?: string; // Trường Tiểu học Hoài Nhơn
  theme: StudentTheme;
  themeLabel: string;
  petName: string;
  petAvatar: string;
  currentTopic: string;
  targetNodeId: string;
  stressState: 'calm' | 'hesitant' | 'frustrated' | 'in_flow';
  persistenceCount: number;
  recentMistake: string;
  xp: number;
  bioMapCrystals: number;
  badges: string[];
  lastActive?: string;
  // AI Core fields
  errorAttribution?: ErrorAttribution;
  multiTierTrace?: MultiTierTrace;
  adaptiveBranches?: AdaptiveBranchNode[];
  activeBranchId?: string;
}

export interface KnowledgeNode {
  id: string;
  code: string;
  label: string;
  grade: number;
  domain: string;
  status: 'mastered' | 'current_challenge' | 'gap_alert' | 'fog' | 'locked';
  x: number; // For visualization
  y: number;
  ancestors: string[]; // Root causes / prerequisites
  description: string;
  coreConcept: string;
  misconceptionAlert?: string;
  phygitalActivity?: {
    title: string;
    materials: string[];
    steps: string[];
    pedagogicalGoal: string;
  };
}

export interface SocraticStep {
  level: number;
  title: string;
  prompt: string;
  hint: string;
}

export interface GeneratedResponse {
  format: 'student_mission' | 'parent_report' | 'system_analysis';
  rawText: string;
  timestamp: string;
  source: string;
}

export interface SchoolInfo {
  schoolName: string; // Tên trường: "Trường Tiểu học Hoài Nhơn"
  schoolCode: string; // TH-HOAINHON
  district: string; // Thị xã Hoài Nhơn
  province: string; // Bình Định
  academicYear: string; // 2025 - 2026
  teacherInCharge: string; // Ban Giám Hiệu & Tổ Chuyên Môn
  totalStudents: number;
  lastSyncTime?: string;
  isRegistered: boolean;
}

export interface GoogleSheetsConfig {
  sheetId: string;
  sheetUrl: string;
  webAppUrl?: string;
  studentSheetName: string;
  curriculumSheetName: string;
  logsSheetName: string;
  schoolSheetName: string;
  autoSyncInterval: number;
  lastSyncedAt?: string;
  isConnected: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  dataSource: 'google_sheets' | 'local_demo';
}

export interface LearningActivityLog {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  className: string;
  action: string;
  topic: string;
  result: 'correct' | 'socratic_guided' | 'need_scaffolding';
  xpAwarded: number;
  pedagogicalNote: string;
}
