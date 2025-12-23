# 🎓 Institute Courses Platform

A full-stack web application for managing and selling institute courses.  

The system allows users to browse courses, purchase them online, and access course content,  
while providing administrators with tools to manage courses and payments.


---

## 🧱 Project Structure

src/
├── Backend --> ASP.NET Core backend (Clean Architecture)
│ ├── Institute.API
│ ├── Institute.Application
│ ├── Institute.Domain
│ └── Institute.Infrastructure
└── Frontend --> React
└── web-app


> See `README.md` inside each folder for specific instructions.

---

## ⚙️ Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core (Code First)
- SQL Server
- Clean Architecture
- Repository Pattern

### Frontend
- React
- Axios / HTTP Client
- Component-based UI

---

## 🔗 API Base URL

- Backend API temporary URL (development):  
http://localhost:5000/api      ## PROBABLY WILL CHANGE

> Do not hardcode API URLs in frontend, use `.env` or config file.


👨‍💻 Teams & Workflow

Frontend Team → works inside src/Frontend/web-app

Backend Team → works inside src/Backend

Use git branches & descriptive commit messages



---

💡 **نصيحة**:  
- README الرئيسي في root يوضح **المشروع كله**  
- README داخل Backend و Frontend يوضح تعليمات كل فريق بالتفصيل  

---

