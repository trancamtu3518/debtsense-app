from fastapi import FastAPI
from pydantic import BaseModel
from routers import anxiety_scan, reframe_engine, nudge_scheduler, profile_manager
from gemini_service import coach_response

app = FastAPI(title="DebtSense AI Engine", version="1.0.0")

app.include_router(anxiety_scan.router, prefix="/api/anxiety-scan")
app.include_router(reframe_engine.router, prefix="/api/reframe")
app.include_router(nudge_scheduler.router, prefix="/api/nudge")
app.include_router(profile_manager.router, prefix="/api/profile")

class ChatRequest(BaseModel):
    message: str
    profile: str = "avoider"

@app.post("/coach")
def coach(data: ChatRequest):
    reply = coach_response(data.message, data.profile)
    return {
        "reply": reply
    }

@app.get("/")
async def root():
    return {"message": "DebtSense AI Engine is running!"}
