# DebtSense - Ứng dụng Tâm lý Tài chính Cá nhân

Ứng dụng AI hỗ trợ quản lý nợ và lo lắng tài chính cho Gen Z Việt Nam.

## Đặc điểm chính
- **Đồng cảm trước, số liệu sau**: UX được thiết kế để giảm bớt lo lắng
- **3 loại hồ sơ**: Avoider (né tránh), Worrier (lo lắng quá mức), Ostrich (thiếu động lực)
- **Debt Reframe Engine**: Biến số liệu nợ thành ngôn ngữ dễ chịu
- **Gamification**: Streak, huy hiệu, bảng xếp hạng (cho Ostrich)
- **Giọng nói**: Tích hợp SmartVoice STT/TTS

## Cấu trúc dự án
```
debtsense/
├── mobile/          # React Native (Expo)
├── backend/         # Node.js + Express
├── ai-engine/       # Python + FastAPI
├── docker-compose.yml
└── schema.sql
```

## Cách chạy

### Yêu cầu
- Node.js 18+
- Python 3.11+
- Expo CLI (cho mobile)

### 1. Chạy Backend
```bash
cd backend
npm install
npm run dev
```
Backend chạy trên http://localhost:3000

### 2. Chạy AI Engine (tùy chọn, dùng mock data cho demo)
```bash
cd ai-engine
python -m venv venv
# Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
AI Engine chạy trên http://localhost:8000

### 3. Chạy Mobile App
```bash
cd mobile
npm install
npm start
```
- Nhấn `w` để chạy trên web
- Quét mã QR bằng Expo Go (phiên bản cũ hỗ trợ SDK 49)

## Đọc thêm
Xem file `DebtSense_AI_Coding_Prompt.md` để biết chi tiết về thiết kế và yêu cầu.

## Công nghệ sử dụng
- **Frontend**: React Native, Expo, Zustand
- **Backend**: Node.js, Express
- **AI**: Python, FastAPI
- **Database**: PostgreSQL (planned)
- **APIs**: VNPT SmartBot, SmartVoice, eKYC
