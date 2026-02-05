import { Button } from '@misabio/core-ui'
import { Menu, PanelRightClose, PanelRightOpen, Home, Settings, User } from 'lucide-react'
import { useState } from 'react'

function App() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/*
        Layout Grid:
        - Mobile: Single column
        - Tablet (md): Sidebar + Content
        - Desktop (lg): Sidebar + Content + Details
      */}
      <div className="grid h-screen w-full transition-all duration-300 grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_300px]">

        {/* Left Sidebar (Navigation) - Hidden on Mobile */}
        <aside className="hidden md:flex flex-col border-r bg-muted/20 p-4 gap-4">
          <div className="font-bold text-xl px-2 mb-4">Mi Sabio</div>
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <User className="h-4 w-4" /> Profile
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <Settings className="h-4 w-4" /> Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="h-14 border-b flex items-center px-4 justify-between bg-background z-10">
             <div className="flex items-center gap-2">
               {/* Mobile Menu Trigger (Visible only on mobile) */}
               <Button variant="ghost" size="icon" className="md:hidden">
                 <Menu className="h-5 w-5" />
               </Button>
               <h1 className="font-semibold text-lg">Dashboard</h1>
             </div>

             <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="hidden lg:flex">
                  {isDetailsOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
               </Button>
             </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
                <p className="text-muted-foreground mb-6">
                  This is the main content area. It takes up the remaining space between the sidebar and the details panel.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => alert('Primary Action')}>Primary Action</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Placeholder Content Blocks */}
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 rounded-lg border bg-muted/10 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar (Details) - Hidden on Mobile/Tablet */}
        {isDetailsOpen && (
          <aside className="hidden lg:flex flex-col border-l bg-muted/10 p-4">
            <div className="font-semibold mb-4">Details</div>
            <div className="space-y-4">
              <div className="h-24 rounded-md border bg-card p-3 shadow-sm text-sm">
                Contextual information goes here.
              </div>
              <div className="h-24 rounded-md border bg-card p-3 shadow-sm text-sm">
                More details about the selected item.
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
