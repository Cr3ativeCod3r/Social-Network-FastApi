from fastapi import FastAPI
from .routers import auth, users

app = FastAPI(title="FastAPI Auth")

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "API is running"}