import { VoiceLecture } from '../types/learnmap';

class VoiceAssistantService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private vietnameseVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Ưu tiên giọng tiếng Việt
    this.vietnameseVoice = 
      voices.find((v) => v.lang.includes('vi') || v.lang.includes('VI') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('vietnamese')) ||
      voices.find((v) => v.lang.startsWith('vi')) ||
      null;
    this.voicesLoaded = true;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.synth) {
      if (onError) onError('Trình duyệt không hỗ trợ Web Speech API');
      return false;
    }

    this.stop(); // Dừng phát âm trước đó

    // Làm sạch ký hiệu toán học / markdown để đọc mượt mà
    const cleanText = text
      .replace(/\$\$/g, '')
      .replace(/\$/g, '')
      .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1 phần $2')
      .replace(/(\d+)\/(\d+)/g, '$1 phần $2')
      .replace(/[#*_`]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.92; // Tốc độ vừa phải, dễ nghe cho học sinh tiểu học
    utterance.pitch = 1.05; // Cao độ tươi vui, thân thiện

    if (this.vietnameseVoice) {
      utterance.voice = this.vietnameseVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking && !this.synth.paused);
  }
}

export const voiceAssistant = new VoiceAssistantService();

// Bộ sưu tập bài giảng mini bằng giọng nói kèm hoạt họa sinh động (dưới 2 phút)
export const CURATED_VOICE_LECTURES: VoiceLecture[] = [
  {
    id: 'lec-frac-add',
    title: 'Bí Kíp Cắt Bánh Pizza: Bản Chất Cộng Phân Số Khác Mẫu',
    topic: 'Cộng Phân số khác Mẫu số',
    duration: '1 phút 40 giây',
    gradeLevel: 4,
    speechText: `Chào các bạn nhỏ của Trường Tiểu học Hoài Nhơn! Thầy trợ lý AI xin kể cho con một câu chuyện nhé. 
    Tưởng tượng con có một chiếc bánh pizza cắt làm hai miếng to, con lấy một miếng là một phần hai. 
    Bạn bên cạnh có chiếc bánh cắt làm ba miếng nhỏ hơn, bạn lấy một miếng là một phần ba. 
    Nếu gộp hai miếng bánh lại, con có thể bảo là có hai miếng của loại năm phần không? 
    Tuyệt đối không nhé! Vì kích cỡ hai miếng bánh đang khác nhau. 
    Bí quyết là gì nào? Hãy cắt miếng một phần hai thành ba phần nhỏ, cắt miếng một phần ba thành hai phần nhỏ. Giờ thì cả hai chiếc bánh đều có các miếng nhỏ bằng nhau là một phần sáu! 
    Ba miếng nhỏ cộng hai miếng nhỏ bằng đúng năm miếng nhỏ, tức là năm phần sáu! Thật kỳ diệu phải không nào?`,
    cards: [
      {
        step: 1,
        heading: 'Hai miếng bánh khác kích thước',
        visualEmoji: '🍕⚖️',
        caption: '1/2 chiếc bánh to hơn 1/3 chiếc bánh. Ta không thể gộp các miếng có độ to nhỏ khác nhau!',
      },
      {
        step: 2,
        heading: 'Cắt nhỏ thành các phần bằng nhau',
        visualEmoji: '🔪✨',
        caption: 'Cắt 1/2 thành 3/6 và cắt 1/3 thành 2/6. Giờ đây tất cả các miếng đều cùng cỡ 1/6!',
      },
      {
        step: 3,
        heading: 'Gộp lại thật dễ dàng',
        visualEmoji: '🎉🥧',
        caption: '3 miếng (3/6) + 2 miếng (2/6) = 5 miếng (5/6). Tuyệt đối không cộng mẫu với mẫu!',
      },
    ],
  },
  {
    id: 'lec-dec-align',
    title: 'Phép Thuật Dấu Phẩy: Đặt Tính Thẳng Hàng Phép Cộng Số Thập Phân',
    topic: 'Số Thập phân và Phép tính',
    duration: '1 phút 30 giây',
    gradeLevel: 5,
    speechText: `Thầy trợ lý AI xin chào các bạn học sinh Lớp năm! 
    Khi làm phép cộng hai số thập phân, nhiều bạn hay mắc lỗi tính sai vì quên mất một chiếc chìa khóa vàng: đó chính là dấu phẩy thẳng cột! 
    Dấu phẩy giống như một người bảo vệ phân chia: bên trái là phần nguyên, bên phải là phần thập phân. 
    Khi đặt tính dọc, con phải xếp dấu phẩy của số thứ nhất thẳng tắp với dấu phẩy của số thứ hai. 
    Hàng đơn vị thẳng hàng đơn vị, hàng phần mười thẳng hàng phần mười. 
    Sau đó con chỉ việc cộng như số tự nhiên, và hạ dấu phẩy thẳng hàng xuống kết quả. Nhớ nhé: Dấu phẩy thẳng hàng, điểm mười trong tay!`,
    cards: [
      {
        step: 1,
        heading: 'Người gác cổng Dấu Phẩy',
        visualEmoji: '📍🚪',
        caption: 'Dấu phẩy ngăn cách giữa hàng đơn vị (phần nguyên) và hàng phần mười (thập phân).',
      },
      {
        step: 2,
        heading: 'Xếp thẳng hàng cột dọc',
        visualEmoji: '📏📐',
        caption: 'Dấu phẩy trên phải thẳng tắp với dấu phẩy dưới. Không bao giờ được đặt lệch!',
      },
      {
        step: 3,
        heading: 'Cộng tự nhiên & Hạ dấu phẩy',
        visualEmoji: '🎯💯',
        caption: 'Thực hiện phép cộng bình thường rồi hạ dấu phẩy thẳng xuống kết quả.',
      },
    ],
  },
  {
    id: 'lec-mult-square',
    title: 'Chiếc Bánh Chưng 4 Góc: Bản Chất Của Phép Nhân',
    topic: 'Bảng nhân và Bội chung',
    duration: '1 phút 20 giây',
    gradeLevel: 3,
    speechText: `Chào các bạn nhỏ Lớp ba! Phép nhân không phải là điều gì xa lạ đâu. 
    Phép nhân thực chất là việc lặp lại những nhóm có số lượng bằng nhau! 
    Nếu một chiếc bánh chưng có bốn góc, vậy ba chiếc bánh chưng có bao nhiêu góc nhỉ? 
    Con lấy bốn góc được lấy ba lần: bốn nhân ba bằng mười hai góc! 
    Thay vì phải cộng bốn cộng bốn cộng bốn rất lâu, phép nhân giúp phi thuyền tri thức của con bay nhanh gấp mười lần đấy!`,
    cards: [
      {
        step: 1,
        heading: 'Nhóm các số bằng nhau',
        visualEmoji: '📦📦📦',
        caption: '3 chiếc bánh, mỗi chiếc có 4 góc.',
      },
      {
        step: 2,
        heading: 'Lặp lại nhanh chóng',
        visualEmoji: '⚡🔢',
        caption: '4 được lấy 3 lần: 4 + 4 + 4 = 4 × 3 = 12.',
      },
      {
        step: 3,
        heading: 'Làm chủ bội số',
        visualEmoji: '🚀🌟',
        caption: 'Phép nhân chính là nền tảng để tìm Mẫu số chung sau này ở Lớp 4!',
      },
    ],
  },
];
