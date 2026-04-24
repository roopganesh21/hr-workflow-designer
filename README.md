# HR Workflow Designer

> A visual drag-and-drop HR workflow builder built for the Tredence Analytics Full Stack Engineering Intern Case Study.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite) ![React Flow](https://img.shields.io/badge/React%20Flow-Graph%20Canvas-FF7A00) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-0055FF?logo=framer) ![Zustand](https://img.shields.io/badge/Zustand-State%20Management-443E38) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-38B2AC?logo=tailwindcss) ![MIT License](https://img.shields.io/badge/License-MIT-green)

HR Workflow Designer is a fully working visual workflow builder for HR operations, designed to model onboarding, approvals, automations, and completion steps in a clean drag-and-drop interface. I built it to show how a workflow editor can be implemented using a modern React stack while still staying practical enough to feel like a real product. The app is meant for HR teams, operations teams, and technical reviewers who want to explore and validate workflow logic visually instead of reading it from static forms or spreadsheets. For me, the important part of this project was showing that a student can still build something structured, polished, and type-safe without needing a backend service.

## Live Demo

[View Live Demo](https://vercel.com/roopganesh21s-projects/hr-workflow-designer)


## Architecture

The application is built on React + Vite, which gave me a fast development environment and a simple production setup. React Flow is the core of the canvas, because it handles the graph rendering, dragging, connecting, and node interaction logic very cleanly. Zustand acts as the single source of truth for workflow state, which keeps the app simpler than using a deeper prop chain or a more complicated global state setup. I also added a mock API layer to imitate backend behavior, so the app can simulate real workflow execution without depending on an external server. Framer Motion is used only where motion actually improves the experience, such as the form panel slide-in and the simulation timeline. Overall, I tried to keep the structure component-driven so each feature stays easy to understand and maintain.

### Folder Structure

```text
src/
├── api/
│   └── mockApi.ts          # GET /automations, POST /simulate (local mocks)
├── components/
│   ├── nodes/              # 5 custom React Flow node components
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedNode.tsx
│   │   └── EndNode.tsx
│   ├── forms/              # Node config forms (one per node type)
│   │   ├── NodeFormPanel.tsx
│   │   ├── StartForm.tsx
│   │   ├── TaskForm.tsx
│   │   ├── ApprovalForm.tsx
│   │   ├── AutomatedForm.tsx
│   │   └── EndForm.tsx
│   ├── sidebar/
│   │   └── DraggableSidebar.tsx   # Drag source for all node types
│   ├── toolbar/
│   │   └── Toolbar.tsx            # Theme toggle, Run, Export
│   └── sandbox/
│       └── SimulationPanel.tsx    # Step-by-step execution log
├── hooks/
│   ├── useWorkflowStore.ts  # Zustand store — nodes, edges, selection
│   └── useSimulate.ts       # Simulation logic + streaming steps
├── types/
│   └── workflow.ts          # All TypeScript interfaces and types
└── App.tsx                  # Root — ReactFlow canvas + layout
```

### State Management

The Zustand store holds `nodes`, `edges`, `selectedNodeId`, `isDark`, `simulationResults`, and `isSimulating`. I intentionally avoided prop drilling because the application has several separate areas that all need access to the same workflow state. Instead, components read directly from the store and dispatch actions directly to the store, which keeps the code easier to follow. React Flow is connected straight to the store through `onNodesChange` and `onEdgesChange`, so the canvas stays synchronized without extra reducer code or complicated state wiring. This was one of the biggest decisions that kept the project manageable.

### Data Flow

```text
User drags node → addNode() in store → ReactFlow renders node
User clicks node → setSelectedNode() → NodeFormPanel slides in
User edits form → local state → Save → updateNodeData() in store
User clicks Run → useSimulate() → mockApi.simulateWorkflow() →
results stream into SimulationPanel step by step
```

## How to Run

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn

### Installation and Development

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/hr-workflow-designer.git
   cd hr-workflow-designer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open in browser
   ```text
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

### Quick Start Guide

1. Drag any node type from the left sidebar onto the canvas
2. Connect nodes by dragging from one handle to another
3. Click any node to open its configuration form on the right
4. Fill in the node details and click Save Changes
5. Click Run Simulation in the toolbar to test the workflow
6. View step-by-step execution in the simulation panel
7. Toggle dark/light theme using the button in the toolbar
8. Export your workflow as JSON using the Export button

## Features

### Workflow Canvas

- Drag-and-drop 5 node types from sidebar onto canvas
- Connect nodes with animated edges
- Delete nodes and edges (Delete key or right-click)
- MiniMap, zoom controls, and fit-to-view
- Auto-validation (Start node required, no orphan nodes)

### Node Types and Configuration

- **Start Node** — Title + optional metadata key-value pairs
- **Task Node** — Title, description, assignee, due date, custom fields
- **Approval Node** — Title, approver role (Select), auto-approve threshold
- **Automated Step Node** — Action picker (from mock API), dynamic params
- **End Node** — End message, summary flag toggle

### Mock API Layer

- GET /automations — returns 4 mock automation actions
- POST /simulate — validates graph + returns step-by-step execution
- Cycle detection using DFS
- Disconnected node validation

### UI and Experience

- Dark / Light theme toggle with smooth transition
- Framer Motion animations — node entrance, form slide-in, simulation timeline
- Lucide React icons for all node types and actions
- Fully typed with TypeScript strict mode

## Design Decisions

**Zustand over Redux or Context API**  
I chose Zustand because it gave me the smallest amount of boilerplate while still keeping the state management predictable. I did not want to wrap the tree in multiple providers or write a lot of reducer code for a project where the store actions could stay very direct. The flat store design also made it easier to keep each action readable, especially for graph updates, selection, simulation state, and theme changes.

**Local mock API over JSON Server or MSW**  
I used a local mock API because I wanted the prototype to stay self-contained and easy to run with just `npm run dev`. It also made the project easier to submit since there is no second process or setup step that has to be explained. The artificial delay inside the mock functions was enough to make the simulation feel realistic without adding unnecessary complexity.

**Framer Motion for transitions**  
I used Framer Motion for the form panel slide-in and the staggered simulation steps because those are the moments where motion actually improves the product. I wanted the interface to feel polished, but not over-animated, so I limited the animations to the parts where they help the user understand what is happening. That made the prototype feel more professional without turning it into a flashy demo.

**Controlled forms with local state + explicit Save**  
Each form keeps its own local state and only saves back to the store when the user clicks Save Changes. I used this approach because I did not want partially edited form values to update the canvas immediately. It also makes the editing flow feel safer and more deliberate, which is useful in a workflow builder where mistakes can affect the whole graph.

**TypeScript strict mode throughout**  
The project is written in TypeScript strict mode so the types act as a real safety net instead of being decorative. I modeled the node data as discriminated unions so it is harder to send the wrong data to the wrong form or component. This was important to me because the case study should show that I can think about type safety the same way it would matter in a real production app.

**Tailwind CSS with darkMode: 'class'**  
I used class-based dark mode so the theme can switch instantly without a page reload. The preference is saved in `localStorage`, which means the app remembers the user’s choice between sessions. This was a simple but effective way to make the UI feel more finished and practical.

## What Was Completed

- [x] Vite + React + TypeScript project setup
- [x] Tailwind CSS with dark/light theme toggle
- [x] Zustand store for all workflow state
- [x] 5 custom React Flow node types with Framer Motion animations
- [x] Drag-and-drop from sidebar to canvas
- [x] Node selection and deletion (keyboard + UI)
- [x] Node form panel with all required fields per node type
- [x] Dynamic action params in Automated Step form (from mock API)
- [x] Mock API — GET /automations and POST /simulate
- [x] Workflow simulation with step-by-step execution log
- [x] Graph validation — cycle detection, disconnected nodes
- [x] Export workflow as JSON
- [x] MiniMap and zoom controls
- [x] Lucide React icons throughout
- [x] Full TypeScript strict mode with no 'any' types
- [x] README documentation

## What Would Be Added With More Time

### Backend and Persistence

- [ ] Real REST API with FastAPI (Python) and PostgreSQL
- [ ] User authentication with JWT
- [ ] Save/load workflows per user from database
- [ ] Workflow versioning and history

### Canvas Enhancements

- [ ] Undo/Redo with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- [ ] Auto-layout using Dagre or ELK
- [ ] Node templates for common workflows (onboarding, leave approval)
- [ ] Inline validation errors shown on nodes visually
- [ ] Multi-select and bulk delete

### Simulation

- [ ] Real-time WebSocket simulation updates
- [ ] Highlight active node on canvas during simulation
- [ ] Simulation history log with timestamps

### Testing

- [ ] Unit tests for all Zustand store actions (Vitest)
- [ ] Component tests for all node forms (React Testing Library)
- [ ] E2E tests for drag-drop and simulation flow (Playwright)

### DevOps

- [ ] CI/CD pipeline with GitHub Actions
- [ ] Docker containerization
- [ ] Kubernetes deployment manifests

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (strict) |
| Canvas | React Flow (@xyflow/react) |
| State | Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| Styling | Tailwind CSS |
| UI Primitives | Radix UI |
| Mock API | Local async mocks |

## Submission Info

- Candidate: P Rup Ganesh
- Role: Full Stack Engineering Intern — Tredence Analytics
- GitHub: https://github.com/roopganesh21/hr-workflow-designer
- Live Demo:https://vercel.com/roopganesh21s-projects/hr-workflow-designer 
