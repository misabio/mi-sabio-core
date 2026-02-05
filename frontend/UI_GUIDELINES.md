# UI Guidelines & Design System

## Core Principles
1.  **Mobile-First**: Design for smaller screens first, then enhance for tablet and desktop.
2.  **Coherence**: Use shared components from `@misabio/core-ui` rather than re-implementing styles.
3.  **Accessibility**: Ensure all interactive elements are keyboard navigable and screen-reader friendly (leveraging Radix primitives).

## Tech Stack
*   **Styling**: Tailwind CSS
*   **Component Library**: Shadcn UI (Headless UI/Radix + Tailwind)
*   **Icons**: Lucide React
*   **Utils**: `clsx` and `tailwind-merge` for class management.

## Project Structure
*   `packages/core-ui`: Reusable UI components (Buttons, Inputs, Cards).
*   `packages/app`: The main application logic and page layouts.

## Layout Strategy: "The Progressive 3-Column"

The application uses a responsive grid layout that adapts to screen width:

### 1. Mobile (< 768px)
*   **Format**: Single Column.
*   **Navigation**: Hidden behind a hamburger menu (Sheet/Drawer).
*   **Main Content**: Full width.
*   **Details/Sidebar**: Hidden or accessible via modal/overlay.

### 2. Tablet (768px - 1024px)
*   **Format**: Two Columns.
*   **Navigation**: Visible Sidebar (Fixed width, e.g., 250px).
*   **Main Content**: Flex/Grid fluid width.
*   **Details**: Hidden or Overlay.

### 3. Desktop (> 1024px)
*   **Format**: Three Columns.
*   **Navigation**: Visible Sidebar (Left).
*   **Main Content**: Center stage.
*   **Details/Context**: Visible Sidebar (Right, e.g., 300px).

## Code Standards
*   Use `cva` (Class Variance Authority) for component variants.
*   Use the `cn()` utility to merge classes.
*   Avoid inline styles (`style={{ ... }}`) in favor of Tailwind utility classes.
