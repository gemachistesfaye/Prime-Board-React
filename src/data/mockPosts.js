export const mockPosts = [
  {
    id: "1",
    text: "🎉 Welcome to Prime Board! Your all-in-one academic management dashboard. Explore the Dashboard, Analytics, Students, Tools and Posts pages to get started.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    text: "📊 Check the Analytics page for real-time enrollment stats, course activity trends and institutional performance metrics updated daily.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: "3",
    text: "🎓 New semester registrations are now open. Head to the Students page to review enrollments, manage records and track attendance.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "4",
    text: "🛠️ The Student Toolkit has been updated with 16 tools including GPA Calculator, Pomodoro Timer, Flashcard Maker, Exam Countdown, Loan Calculator and more. Check it out under Tools.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "5",
    text: "📅 Reminder: Mid-semester assessments begin next week. Make sure all course records and student profiles are up to date before then.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "6",
    text: "✅ System maintenance completed successfully. All data pipelines are running normally. Performance has improved by approximately 18% across all modules.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
];