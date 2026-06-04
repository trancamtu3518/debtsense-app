// Mock data for DebtSense MVP
const crypto = require('crypto');

// Mock user
let currentUser = {
  id: 'mock-user-123',
  phone: '0901234567',
  displayName: 'Minh',
  createdAt: new Date().toISOString(),
};

// Mock financial profile
let financialProfile = {
  userId: currentUser.id,
  profile: 'avoider',
  confidence: 0.87,
  createdAt: new Date().toISOString(),
};

// Mock debt accounts
let debtAccounts = [
  {
    id: 'debt-1',
    userId: currentUser.id,
    debtName: 'Vay học phí',
    totalAmount: 30000000,
    monthlyPayment: 600000,
    remainingMonths: 50,
    debtType: 'student_loan',
    paidPercentage: 18,
  },
];

// Mock transactions
let transactions = [
  { id: 'txn-1', amount: 50000, category: 'food', date: '2024-06-01', source: 'manual', description: 'Cà phê' },
  { id: 'txn-2', amount: 30000, category: 'transport', date: '2024-06-02', source: 'manual', description: 'Xe bus' },
  { id: 'txn-3', amount: 600000, category: 'loan_payment', date: '2024-06-03', source: 'manual', description: 'Trả nợ' },
  { id: 'txn-4', amount: 120000, category: 'food', date: '2024-06-04', source: 'manual', description: 'Ăn trưa' },
];

// Mock goals
let currentGoal = {
  goalId: 'goal-123',
  description: 'Hôm nay, chỉ cần mở app và xem số dư 1 lần. Không cần làm gì thêm.',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  completed: false,
  difficulty: 'easy',
};

// Mock milestones
let milestones = [
  { id: 'ms-1', type: 'first_payment', title: 'Thanh toán đầu tiên', achievedAt: '2024-05-01T00:00:00Z', celebrationSent: true },
  { id: 'ms-2', type: 'streak_2weeks', title: 'Streak 2 tuần', achievedAt: '2024-05-15T00:00:00Z', celebrationSent: true },
  { id: 'ms-3', type: 'streak_4weeks', title: 'Streak 4 tuần', achievedAt: '2024-06-01T00:00:00Z', celebrationSent: true },
  { id: 'ms-4', type: 'debt_10percent', title: 'Đã trả 10% khoản nợ', achievedAt: null, celebrationSent: false },
];

// Mock nudge
let currentNudge = {
  nudgeType: 'weekly_checkin',
  content: 'Hôm nay bạn cảm thấy thế nào về tài chính?',
  createdAt: new Date().toISOString(),
};

// Mock debt reframe
const getDebtReframe = (profile) => {
  const examples = {
    avoider: {
      reframed_text: '600.000đ/tháng = 4 ly cà phê/tuần → thoát nợ 50 tháng',
      metaphor: 'Chặng đường marathon: bạn đang ở km số 5',
      progress_context: 'Đã đi được 18% chặng đường',
      weekly_equivalent: 'Mỗi tuần chỉ cần để dành bằng 1 buổi ăn ngoài',
    },
    worrier: {
      reframed_text: '600.000đ/tháng, bạn đang đi đúng tiến độ!',
      metaphor: 'Tàu thủy của bạn đã vượt qua 18% quãng đường',
      progress_context: 'Tốt lắm! Tiếp tục giữ vững nhịp độ này',
      weekly_equivalent: '150.000đ/tuần là hoàn toàn có thể',
    },
    ostrich: {
      reframed_text: '600.000đ/tháng, bạn đang on track!',
      metaphor: 'Bạn đã tích lũy được 8 điểm streak!',
      progress_context: 'Top 34% người dùng cùng hoàn cảnh',
      weekly_equivalent: 'Cứ mỗi tuần, bạn lại tiến thêm một bước!',
    },
  };
  return examples[profile] || examples.avoider;
};

module.exports = {
  currentUser,
  financialProfile,
  debtAccounts,
  transactions,
  currentGoal,
  milestones,
  currentNudge,
  getDebtReframe,
};
