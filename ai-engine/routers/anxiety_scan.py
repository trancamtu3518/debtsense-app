from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import random

router = APIRouter()

ANXIETY_SCAN_QUESTIONS = [
    "Khi bạn nghĩ đến các khoản nợ hoặc chi phí sắp tới, cảm giác đầu tiên xuất hiện trong đầu bạn là gì?",
    "Lần cuối cùng bạn chủ động kiểm tra số dư tài khoản là khi nào, và bạn cảm thấy thế nào sau đó?",
    "Khi nhận được thông báo từ ngân hàng, phản ứng đầu tiên của bạn thường là gì?",
    "Bạn thường làm gì khi cảm thấy lo lắng về tiền bạc — đối mặt ngay hay để qua hôm sau?",
    "Nếu được thay đổi một điều về cách bạn quản lý tài chính ngay bây giờ, bạn muốn thay đổi điều gì?"
]

class QuestionResponse(BaseModel):
    question_id: int
    text: str
    sentiment: str

class ScanRequest(BaseModel):
    responses: List[QuestionResponse]

class ScanResponse(BaseModel):
    profile: str
    confidence: float
    recommendations: List[str]

@router.post("/analyze", response_model=ScanResponse)
async def analyze_anxiety_scan(request: ScanRequest):
    total_avoidance = 0
    total_worry = 0
    total_ostrich = 0
    
    for resp in request.responses:
        lower_text = resp.text.lower()
        
        if any(keyword in lower_text for keyword in ['không muốn', 'né', 'tránh', 'quên', 'để sau']):
            total_avoidance += 3
        elif any(keyword in lower_text for keyword in ['lo', 'sợ', 'hốt hoảng', 'áp lực', 'nỗi lo']):
            total_worry +=3
        elif any(keyword in lower_text for keyword in ['thôi', 'để đó', 'không quan tâm', 'thử sau']):
            total_ostrich += 2
            
    scores = {
        'avoider': total_avoidance,
        'worrier': total_worry,
        'ostrich': total_ostrich
    }
    
    profile = max(scores, key=scores.get)
    confidence = min(0.7 + random.random() * 0.3)
    
    recommendations = {
        'avoider': [
            "Bắt đầu với các bước cực nhỏ",
            "Không cần xem số tiền tuyệt đối",
            "Chỉ tập trung vào cảm xúc của bạn"
        ],
        'worrier': [
            "Tập trung vào tiến độ thay vì số tiền",
            "Thử bài tập thở khi lo lắng",
            "Đặt mục tiêu nhỏ mỗi tuần"
        ],
        'ostrich': [
            "Thử thách streak hàng tuần với phần thưởng",
            "Tham gia bảng xếp hạng",
            "Thu thập huy hiệu"
        ]
    }
    
    return ScanResponse(
        profile=profile,
        confidence=round(confidence, 2),
        recommendations=recommendations[profile]
    )
