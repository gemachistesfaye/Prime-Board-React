<div align="center">
  <img src="public/banner.png" alt="Prime Board Banner" width="100%" style="max-height: 220px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;" />
  
  # 🎓 Prime Board 
  **Premium Academic Management Dashboard** ✨

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![jsPDF](https://img.shields.io/badge/jsPDF-ff69b4?style=for-the-badge&logo=pdf&logoColor=white)](https://parall.ax/products/jspdf)
</div>

---

## 🚀 Overview

**Prime Board** is a high-fidelity, modern administrative dashboard designed for universities and academic institutions. It provides a seamless, dark-mode-first user experience for managing students, generating official academic transcripts, and analyzing institutional data.

## 📸 Screenshots

| 🖥️ Main Dashboard Overview | 📈 Advanced Analytics |
|:---:|:---:|
| <img src="docs/screenshots/1-dashboard.png" width="400" alt="Main Dashboard Overview"> | <img src="docs/screenshots/2-analytics.png" width="400" alt="Advanced Analytics"> |
| **⚙️ Settings & Theme** | **👥 Users & Students Table** |
| <img src="docs/screenshots/3-settings.png" width="400" alt="Settings & Theme Controls"> | <img src="docs/screenshots/4-users-table.png" width="400" alt="Users & Students Table"> |
| **📅 Booking Interface** | **🧰 Academic Toolkit** |
| <img src="docs/screenshots/5-booking.png" width="400" alt="Booking Interface"> | <img src="docs/screenshots/6-toolkit.png" width="400" alt="Academic Toolkit"> |

## ✨ Key Features

- 🌓 **Dark Mode First:** Sleek, modern aesthetic featuring glassmorphism and a responsive vertical sidebar layout.
- 🎓 **Dynamic Student Management:** Complete CRUD capabilities for student records, enrollment statuses, and GPAs.
- 📄 **Professional PDF Transcripts:** Automated, high-quality PDF generation for academic transcripts using `jspdf` and `jspdf-autotable`.
- 📊 **Real-time Analytics:** Interactive dashboard metrics to track pending tuition, enrollment counts, and average GPAs.
- 📱 **Fully Responsive:** Carefully crafted layouts that look perfect on desktop, tablet, and mobile displays.

## 🛠️ Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gemachistesfaye/PrimeBoard-React.git
   cd PrimeBoard-React
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the dashboard.

## 📂 Project Structure

```text
PrimeBoard-React/
├── public/                 # Static assets (Favicons, Logos)
├── src/
│   ├── components/         # Reusable UI components (Navbar, Sidebar, Layout)
│   ├── pages/              # Primary application views (Dashboard, Students, etc.)
│   ├── App.jsx             # Main application entry point & routing
│   └── index.css           # Global Tailwind utilities and base styles
├── .github/                # GitHub Actions & Issue Templates
└── package.json            # Project dependencies and scripts
```

## 🔒 Security

We take security seriously! 🛡️ Please review our [Security Policy](.github/SECURITY.md) for information on how to securely report vulnerabilities and our support guidelines.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
