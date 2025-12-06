# Research Gennie Frontend

A modern React-based web application that helps researchers identify unexplored areas in academic domains using AI-powered analysis.

## 🚀 Features

- **AI-Powered Research Gap Analysis**: Enter a research domain and discover unexplored areas
- **Advanced Filtering**: Customize your search with year ranges, paper counts, and keywords
- **History Management**: Save and manage your previous research analyses
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preferences
- **Responsive Design**: Fully responsive interface that works on mobile, tablet, and desktop
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Download Results**: Export your research gaps as PDF or TXT files

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library + fast-check (Property-Based Testing)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rg-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🧪 Testing

Run all tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests once (CI mode):
```bash
npm run test:run
```

## 🏗️ Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Loading, Error, Empty states)
│   ├── layout/         # Layout components (Navbar, Footer, MainLayout)
│   └── research/       # Research-specific components
├── pages/              # Page components
├── store/              # Zustand state management
├── routes/             # Route configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── test/               # Test setup and utilities
```

## 🎨 Features in Detail

### Theme Support
- Dark mode by default
- Persistent theme preference across sessions
- Smooth transitions between themes

### Research Gap Generation
- Input validation (minimum 3 characters, no special symbols)
- Advanced filters for refined searches
- Real-time processing feedback
- Auto-save to history

### History Management
- Search and filter previous analyses
- Sort by date or topic
- View full details of past results
- Delete unwanted entries

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles
- Logical tab order
- Focus indicators on all interactive elements

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## 📧 Contact

[Add contact information here]
