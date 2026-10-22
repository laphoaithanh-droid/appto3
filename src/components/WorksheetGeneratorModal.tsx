import React, { useState } from 'react';
import { SchoolInfo, StudentProfile, KnowledgeNode } from '../types/learnmap';
import { 
  generateContentWithFallback, 
  getStoredApiKey, 
  getStoredModel 
} from '../services/geminiClientService';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  School, 
  Layers, 
  BrainCircuit, 
  CheckCircle2,
  RefreshCw,
  Eye
} from 'lucide-react';

interface WorksheetGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  profile?: StudentProfile;
  nodes: KnowledgeNode[];
}

export const WorksheetGeneratorModal: React.FC<WorksheetGeneratorModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  profile,
  nodes,
}) => {
  const [grade, setGrade] = useState<number>(profile?.grade || 4);
  const [topic, setTopic] = useState<string>(profile?.currentTopic || 'Cộng Phân số khác Mẫu số');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [targetStudentName, setTargetStudentName] = useState<string>(profile?.name || 'Nguyễn Trần Minh An');
  const [targetClass, setTargetClass] = useState<string>(profile?.className || '4A1');
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(true);
  const [focusMisconception, setFocusMisconception] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedHtml(null);

    const apiKey = getStoredApiKey();

    if (apiKey && apiKey.length > 10) {
      try {
        const prompt = `Bạn là Chuyên gia Khảo thí và Đo lường Giáo dục Tiểu học của ${schoolInfo.schoolName}. 
Hãy tạo một "PHIẾU BÀI TẬP VÀ ĐÁNH GIÁ NĂNG LỰC TOÁN TIỂU HỌC" theo đúng Thông tư 27/2020/TT-BGDĐT và chuẩn GDPT 2018:
- Đơn vị: ${schoolInfo.schoolName} (Thị xã Hoài Nhơn, Bình Định)
- Học sinh đích: ${targetStudentName} - Lớp ${targetClass} (Khối Lớp ${grade})
- Chủ đề: ${topic}
- Trọng tâm cần bù đắp: ${focusMisconception ? 'Khắc phục quan niệm sai lầm cộng thẳng tử với tử, mẫu với mẫu (VD: 1/2 + 1/3 = 2/5), củng cố bản chất quy đồng.' : 'Luyện tập tổng hợp.'}
- Số lượng câu hỏi: ${questionCount} câu phân hóa 4 mức độ:
  + Mức 1 (Nhận biết): Trực quan hình vẽ / chọn mẫu số chung.
  + Mức 2 (Thông hiểu): Quy đồng phân số.
  + Mức 3 (Vận dụng): Thực hiện phép cộng phân số khác mẫu.
  + Mức 4 (Vận dụng cao): Bài toán lời văn gắn với thực tế (chia bánh, đo lường).

Hãy trả về nội dung phiếu bài tập định dạng Markdown chuẩn, rõ ràng, đẹp mắt, có ô ghi điểm và lời phê của giáo viên, kèm đáp án chi tiết ở phần cuối.`;

        const res = await generateContentWithFallback({
          prompt,
          preferredModel: getStoredModel(),
        });

        if (res.text) {
          setGeneratedHtml(res.text);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Fallback to local template generation:', err);
      }
    }

    // Template mặc định chuẩn GDPT 2018 cho Trường Tiểu học Hoài Nhơn
    setTimeout(() => {
      const sampleWorksheet = `### UBND THỊ XÃ HOÀI NHƠN
### **TRƯỜNG TIỂU HỌC HOÀI NHƠN**
**TỔ CHUYÊN MÔN KHỐI ${grade} - NĂM HỌC 2025 - 2026**

---
## **PHIẾU BÀI TẬP BÙ ĐẮP LỖ HỔNG & PHÁT TRIỂN NĂNG LỰC TOÁN**
**Môn: Toán Lớp ${grade} (Chuẩn GDPT 2018)**
**Chủ đề:** *${topic}*
*Thời gian làm bài: 35 phút (không kể thời gian giao đề)*

**Họ và tên học sinh:** ${targetStudentName} | **Lớp:** ${targetClass}  
**Điểm số:** ................. / 10 | **Lời nhận xét của Thầy/Cô:** ....................................................

---

### **PHẦN 1: TRẮC NGHIỆM ĐÁNH GIÁ BẢN CHẤT (Mức 1 & Mức 2 - 4.0 điểm)**

**Câu 1 (Mức 1 - Nhận biết):** Mẫu số chung nhỏ nhất của hai phân số $\\frac{1}{2}$ và $\\frac{1}{3}$ là:  
A. 5  
B. 6  
C. 12  
D. 23  

**Câu 2 (Mức 1 - Nhận biết):** Khi quy đồng mẫu số của phân số $\\frac{1}{2}$ về mẫu số chung là 6, ta được phân số:  
A. $\\frac{2}{6}$  
B. $\\frac{3}{6}$  
C. $\\frac{1}{6}$  
D. $\\frac{5}{6}$  

**Câu 3 (Mức 2 - Thông hiểu):** Bạn Nam thực hiện phép tính: $\\frac{1}{2} + \\frac{1}{3} = \\frac{1+1}{2+3} = \\frac{2}{5}$. Em hãy nhận xét cách làm của bạn Nam:  
A. Nam làm đúng.  
B. Nam làm sai vì cộng trực tiếp tử số với tử số và mẫu số với mẫu số khi chưa quy đồng.  
C. Nam làm sai vì phải lấy $2 \\times 3 = 6$ ở tử số.  
D. Nam làm đúng một nửa.  

---

### **PHẦN 2: TỰ LUẬN RÈN LUYỆN KỸ NĂNG (Mức 3 & Mức 4 - 6.0 điểm)**

**Câu 4 (Mức 3 - Vận dụng - 3.0 điểm):** Quy đồng mẫu số rồi tính:  
a) $\\frac{1}{2} + \\frac{1}{3} = ............................................................................................................$  
b) $\\frac{2}{5} + \\frac{3}{10} = ............................................................................................................$  
c) $\\frac{3}{4} + \\frac{1}{6} = ............................................................................................................$  

**Câu 5 (Mức 4 - Vận dụng cao - 3.0 điểm):**  
Trong tiết thực hành trải nghiệm tại sân trường Tiểu học Hoài Nhơn, tổ Một được phân công dọn vệ sinh $\\frac{1}{3}$ diện tích bồn hoa, tổ Hai dọn vệ sinh $\\frac{2}{5}$ diện tích bồn hoa đó.  
a) Cả hai tổ đã dọn vệ sinh được bao nhiêu phần diện tích bồn hoa?  
b) Còn lại bao nhiêu phần diện tích bồn hoa chưa được dọn vệ sinh?  

*Bài giải:*  
..........................................................................................................................................................  
..........................................................................................................................................................  
..........................................................................................................................................................  

---

${includeAnswers ? `### **HƯỚNG DẪN CHẤM & ĐÁP ÁN SƯ PHẠM (Dành cho Giáo viên TH Hoài Nhơn)**
1. **Câu 1:** Đáp án **B (6)**.
2. **Câu 2:** Đáp án **B (3/6)** vì nhân cả tử và mẫu với 3.
3. **Câu 3:** Đáp án **B**. *Lưu ý sư phạm:* Giáo viên dùng mô hình trực quan dải giấy hoặc bánh pizza để học sinh nhận ra 2/5 nhỏ hơn 1/2.
4. **Câu 4:**
   a) $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.
   b) $\\frac{4}{10} + \\frac{3}{10} = \\frac{7}{10}$.
   c) Mẫu số chung là 12: $\\frac{9}{12} + \\frac{2}{12} = \\frac{11}{12}$.
5. **Câu 5:**  
   a) Cả hai tổ làm được: $\\frac{1}{3} + \\frac{2}{5} = \\frac{5}{15} + \\frac{6}{15} = \\frac{11}{15}$ (diện tích).  
   b) Phần còn lại: $1 - \\frac{11}{15} = \\frac{4}{15}$ (diện tích).` : ''}`;

      setGeneratedHtml(sampleWorksheet);
      setIsLoading(false);
    }, 600);
  };

  const handleDownloadWord = () => {
    if (!generatedHtml) return;

    const headerHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Phiếu bài tập - Trường TH Hoài Nhơn</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; margin: 20mm; }
          h2, h3 { text-align: center; margin: 4px 0; }
          hr { border: none; border-top: 1px solid #000; margin: 12px 0; }
          p { margin: 6px 0; }
        </style>
      </head>
      <body>
        <div style="text-align: center; font-weight: bold;">
          UBND THỊ XÃ HOÀI NHƠN<br/>
          TRƯỜNG TIỂU HỌC HOÀI NHƠN
        </div>
        <div style="white-space: pre-wrap; font-family: 'Times New Roman', serif;">
          ${generatedHtml.replace(/###/g, '').replace(/##/g, '').replace(/\*\*/g, '')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', headerHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PhieuBaiTap_Toan_Lop${grade}_TruongTH_HoaiNhon.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Phiếu Bài Tập - Trường Tiểu học Hoài Nhơn</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 16pt; font-weight: bold; text-align: center; margin: 15px 0 5px; }
            .subtitle { font-size: 12pt; text-align: center; font-style: italic; margin-bottom: 15px; }
            .student-info { display: flex; justify-content: space-between; border-bottom: 1px dashed #666; padding-bottom: 8px; margin-bottom: 20px; font-size: 12pt; }
            .content { white-space: pre-wrap; line-height: 1.6; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <strong>ỦY BAN NHÂN DÂN THỊ XÃ HOÀI NHƠN</strong><br/>
            <strong>TRƯỜNG TIỂU HỌC HOÀI NHƠN - TỔ CHUYÊN MÔN TOÁN</strong>
          </div>
          <div class="student-info">
            <span>Học sinh: <strong>${targetStudentName}</strong></span>
            <span>Lớp: <strong>${targetClass}</strong></span>
            <span>Năm học: <strong>2025 - 2026</strong></span>
          </div>
          <div class="content">${generatedHtml?.replace(/###/g, '').replace(/##/g, '')}</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyText = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Trình Tạo Đề Thi & Phiếu Bài Tập Phân Hóa GDPT 2018
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Xuất Word / In A4
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span>Đơn vị:</span>
                <span className="font-semibold text-indigo-300">{schoolInfo.schoolName}</span>
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

          {/* Configuration Grid */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Thiết Lập Tham Số Phiếu Bài Tập</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Khối Lớp</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={3}>Lớp 3</option>
                  <option value={4}>Lớp 4 (Trọng tâm)</option>
                  <option value={5}>Lớp 5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Học sinh / Lớp</label>
                <input
                  type="text"
                  value={targetStudentName}
                  onChange={(e) => setTargetStudentName(e.target.value)}
                  placeholder="Tên học sinh"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Lớp Học</label>
                <input
                  type="text"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  placeholder="4A1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Số Lượng Câu Hỏi</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={5}>5 câu (Phiếu 15 phút)</option>
                  <option value={10}>10 câu (Đề kiểm tra 35 phút)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Chủ Đề Kiến Thức</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Cộng Phân số khác Mẫu số">Cộng Phân số khác Mẫu số (Lớp 4)</option>
                  <option value="Trừ Phân số khác Mẫu số">Trừ Phân số khác Mẫu số (Lớp 4)</option>
                  <option value="Quy đồng Mẫu số Phân số">Quy đồng Mẫu số Phân số (Lớp 4)</option>
                  <option value="Bội chung & Phép nhân (Lớp 3)">Bội chung & Phép nhân (Lớp 3)</option>
                  <option value="Số Thập phân & Tỷ số Phần trăm">Số Thập phân & Tỷ số Phần trăm (Lớp 5)</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAnswers}
                    onChange={(e) => setIncludeAnswers(e.target.checked)}
                    className="w-4 h-4 rounded accent-indigo-500"
                  />
                  <span>Kèm Đáp án & Hướng dẫn chấm</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={focusMisconception}
                    onChange={(e) => setFocusMisconception(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <span>Tập trung bù đắp quan niệm sai</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 italic">
                * Tự động áp dụng ma trận 4 mức độ nhận thức GDPT 2018 (Nhận biết - Thông hiểu - Vận dụng - Vận dụng cao).
              </span>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang khởi tạo phiếu bài tập...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Phiếu Bài Tập Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Preview Area */}
          {generatedHtml && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Bản Xem Trước Phiếu Bài Tập (In A4 / Xuất Word)</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Ngay (Print / PDF)</span>
                  </button>

                  <button
                    onClick={handleDownloadWord}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File Word (.doc)</span>
                  </button>
                </div>
              </div>

              {/* Printable sheet paper container */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 shadow-2xl font-serif text-sm leading-relaxed overflow-x-auto border border-slate-300">
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-900 leading-relaxed">
                  {generatedHtml}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Công cụ Sư phạm Thực tiễn • Trường Tiểu học Hoài Nhơn</span>
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
