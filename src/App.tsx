import React, { useState, useEffect } from 'react';
import { 
  AppMode, 
  StudentProfile, 
  KnowledgeNode, 
  SchoolInfo, 
  GoogleSheetsConfig, 
  LearningActivityLog 
} from './types/learnmap';
import { KNOWLEDGE_GRAPH_NODES } from './data/mockKnowledgeGraph';
import { 
  loadCachedStudents, 
  saveCachedStudents, 
  loadCachedSchoolInfo, 
  saveCachedSchoolInfo, 
  loadSavedSheetsConfig, 
  saveSheetsConfig,
  loadCachedLogs,
  saveCachedLogs,
  appendLearningLogToGoogleSheet,
  syncGoogleSheetsDatabase
} from './services/googleSheetsService';
import { getStoredApiKey } from './services/geminiClientService';
import { Navbar } from './components/Navbar';
import { StudentExplorerView } from './components/StudentExplorerView';
import { ParentTeacherReportView } from './components/ParentTeacherReportView';
import { SystemArchitectConsole } from './components/SystemArchitectConsole';
import { SystemInstructionModal } from './components/SystemInstructionModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { MathLabVisualizerModal } from './components/MathLabVisualizerModal';
import { WorksheetGeneratorModal } from './components/WorksheetGeneratorModal';
import { AIDiagnosticModal } from './components/AIDiagnosticModal';
import { AIAdaptivePathModal } from './components/AIAdaptivePathModal';
import { AIVoiceAssistantModal } from './components/AIVoiceAssistantModal';
import { 
  Compass, 
  BarChart3, 
  Cpu, 
  ShieldCheck, 
  Heart, 
  School, 
  FileSpreadsheet, 
  CheckCircle2, 
  Key,
  Calculator,
  FileText,
  Search,
  Volume2,
  MapPin
} from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('student');
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(loadCachedSchoolInfo);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(loadSavedSheetsConfig);
  const [profiles, setProfiles] = useState<StudentProfile[]>(loadCachedStudents);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => {
    const cached = loadCachedStudents();
    return cached[0]?.id || 'student-hn-01';
  });
  const [nodes, setNodes] = useState<KnowledgeNode[]>(KNOWLEDGE_GRAPH_NODES);
  const [activityLogs, setActivityLogs] = useState<LearningActivityLog[]>(loadCachedLogs);
  const [isSystemInstructionOpen, setIsSystemInstructionOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(() => {
    return !getStoredApiKey();
  });
  const [isMathLabOpen, setIsMathLabOpen] = useState(false);
  const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isAdaptivePathOpen, setIsAdaptivePathOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [voiceCustomText, setVoiceCustomText] = useState('');
  const [voiceCustomTitle, setVoiceCustomTitle] = useState('');

  // Auto-sync interval if configured by teacher
  useEffect(() => {
    if (!sheetsConfig.autoSyncInterval || sheetsConfig.autoSyncInterval <= 0) return;
    const interval = setInterval(async () => {
      try {
        const res = await syncGoogleSheetsDatabase(sheetsConfig);
        setProfiles(res.students);
        setSchoolInfo(res.school);
        saveCachedStudents(res.students);
        saveCachedSchoolInfo(res.school);
      } catch (e) {
        console.warn('Auto-sync tick error:', e);
      }
    }, sheetsConfig.autoSyncInterval * 1000);

    return () => clearInterval(interval);
  }, [sheetsConfig]);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === selectedProfile.id ? { ...p, ...updated } : p));
      saveCachedStudents(next);
      return next;
    });
  };

  const handleSelectProfile = (profile: StudentProfile) => {
    setSelectedProfileId(profile.id);
  };

  const handleUpdateConfig = (newConfig: GoogleSheetsConfig) => {
    setSheetsConfig(newConfig);
    saveSheetsConfig(newConfig);
  };

  const handleUpdateSchoolInfo = (newSchool: SchoolInfo) => {
    setSchoolInfo(newSchool);
    saveCachedSchoolInfo(newSchool);
  };

  const handleUpdateStudents = (newStudents: StudentProfile[]) => {
    setProfiles(newStudents);
    saveCachedStudents(newStudents);
  };

  const handleLogActivity = async (log: LearningActivityLog) => {
    const updated = [log, ...activityLogs];
    setActivityLogs(updated);
    saveCachedLogs(updated);
    await appendLearningLogToGoogleSheet(sheetsConfig, log);
  };

  const handleAwardXp = (amount: number, reason: string) => {
    handleUpdateProfile({
      xp: selectedProfile.xp + amount,
      bioMapCrystals: selectedProfile.bioMapCrystals + 1,
      badges: selectedProfile.badges.includes(reason) 
        ? selectedProfile.badges 
        : [...selectedProfile.badges, reason],
    });
  };

  const handleOpenVoiceAssistant = (customText?: string, customTitle?: string) => {
    setVoiceCustomText(customText || '');
    setVoiceCustomTitle(customTitle || '');
    setIsVoiceAssistantOpen(true);
  };

  const handleSelectAdaptiveBranch = (branchId: string) => {
    const branch = selectedProfile.adaptiveBranches?.find((b) => b.id === branchId);
    if (branch?.type === 'remedial_visual') {
      setIsAdaptivePathOpen(false);
      setIsMathLabOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        selectedProfile={selectedProfile}
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        onOpenSystemInstruction={() => setIsSystemInstructionOpen(true)}
        schoolInfo={schoolInfo}
        sheetsConfig={sheetsConfig}
        onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenMathLab={() => setIsMathLabOpen(true)}
        onOpenWorksheet={() => setIsWorksheetOpen(true)}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenAdaptivePath={() => setIsAdaptivePathOpen(true)}
        onOpenVoiceAssistant={() => handleOpenVoiceAssistant()}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentMode === 'student' && (
          <StudentExplorerView
            profile={selectedProfile}
            nodes={nodes}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToReport={() => setCurrentMode('parent_teacher')}
            schoolInfo={schoolInfo}
            onLogActivity={handleLogActivity}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
            onOpenMathLab={() => setIsMathLabOpen(true)}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onOpenAdaptivePath={() => setIsAdaptivePathOpen(true)}
            onOpenVoiceAssistant={(text) => handleOpenVoiceAssistant(text, 'Đề bài Đang Luyện tập')}
          />
        )}

        {currentMode === 'parent_teacher' && (
          <ParentTeacherReportView
            profile={selectedProfile}
            nodes={nodes}
            onOpenArchitect={() => setCurrentMode('architect')}
            schoolInfo={schoolInfo}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
            onLogActivity={handleLogActivity}
            onOpenWorksheet={() => setIsWorksheetOpen(true)}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onOpenAdaptivePath={() => setIsAdaptivePathOpen(true)}
          />
        )}

        {currentMode === 'architect' && (
          <SystemArchitectConsole
            profile={selectedProfile}
            nodes={nodes}
            onOpenSystemInstructionModal={() => setIsSystemInstructionOpen(true)}
            schoolInfo={schoolInfo}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-slate-300">LearnMap Adaptive Learning Ecosystem</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <School className="w-3.5 h-3.5" />
              Đơn vị: {schoolInfo.schoolName}
            </span>
            <span>•</span>
            <span>Chuẩn GDPT 2018 (Việt Nam)</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] flex-wrap">
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="flex items-center gap-1 text-purple-400 hover:underline font-semibold"
            >
              <Search className="w-3.5 h-3.5" />
              <span>AI Chẩn Đoán (5p)</span>
            </button>
            <button
              onClick={() => setIsAdaptivePathOpen(true)}
              className="flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Lộ Trình Thích Ứng</span>
            </button>
            <button
              onClick={() => handleOpenVoiceAssistant()}
              className="flex items-center gap-1 text-pink-400 hover:underline font-semibold"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>AI Giảng Bài Giọng Nói</span>
            </button>
            <button
              onClick={() => setIsMathLabOpen(true)}
              className="flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Lab Toán</span>
            </button>
            <button
              onClick={() => setIsWorksheetOpen(true)}
              className="flex items-center gap-1 text-blue-400 hover:underline font-semibold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xuất Đề Thi (Word)</span>
            </button>
            <button
              onClick={() => setIsGoogleSheetsOpen(true)}
              className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets ({profiles.length})</span>
            </button>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1 text-amber-400 hover:underline font-semibold"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Gemini Key</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Google Sheets Database Management Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        config={sheetsConfig}
        onUpdateConfig={handleUpdateConfig}
        schoolInfo={schoolInfo}
        onUpdateSchoolInfo={handleUpdateSchoolInfo}
        students={profiles}
        onUpdateStudents={handleUpdateStudents}
        selectedStudentId={selectedProfileId}
        onSelectStudentId={setSelectedProfileId}
        activityLogs={activityLogs}
      />

      {/* Practical Feature 1: Math Lab Visualizer & Arena */}
      <MathLabVisualizerModal
        isOpen={isMathLabOpen}
        onClose={() => setIsMathLabOpen(false)}
        profile={selectedProfile}
        onAwardXp={handleAwardXp}
        onLogActivity={handleLogActivity}
      />

      {/* Practical Feature 2: Worksheet & Exam Generator (.doc / Print A4) */}
      <WorksheetGeneratorModal
        isOpen={isWorksheetOpen}
        onClose={() => setIsWorksheetOpen(false)}
        schoolInfo={schoolInfo}
        profile={selectedProfile}
        nodes={nodes}
      />

      {/* AI Core 1: AI Diagnostic & Multi-tier Back-Tracing Modal */}
      <AIDiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        profile={selectedProfile}
        onUpdateProfile={handleUpdateProfile}
        onLogActivity={handleLogActivity}
        onOpenAdaptivePath={() => setIsAdaptivePathOpen(true)}
      />

      {/* AI Core 2: AI Adaptive Learning Path Modal */}
      <AIAdaptivePathModal
        isOpen={isAdaptivePathOpen}
        onClose={() => setIsAdaptivePathOpen(false)}
        profile={selectedProfile}
        onSelectBranch={handleSelectAdaptiveBranch}
        onOpenMathLab={() => setIsMathLabOpen(true)}
        onOpenVoiceAssistant={() => handleOpenVoiceAssistant()}
      />

      {/* AI Core 3: AI Voice Assistant Modal (< 2 min Animated Lectures) */}
      <AIVoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        profile={selectedProfile}
        customTextToRead={voiceCustomText}
        customTopicTitle={voiceCustomTitle}
      />

      {/* Gemini API Key & Model Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* System Instruction Modal */}
      <SystemInstructionModal
        isOpen={isSystemInstructionOpen}
        onClose={() => setIsSystemInstructionOpen(false)}
      />
    </div>
  );
}
