import { Button } from '@misabio/core-ui'
import { Menu, PanelRightClose, PanelRightOpen, Home, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { ChatInterface } from './components/ChatInterface'
import { UploadZone } from './components/UploadZone'

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
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <ChatInterface />
          </div>
        </main>

        {/* Right Sidebar (Details) - Hidden on Mobile/Tablet */}
        {isDetailsOpen && (
          <aside className="hidden lg:flex flex-col border-l bg-muted/10 p-4">
            <div className="font-semibold mb-4">Details</div>
            <div className="space-y-4">
              <UploadZone />

              <div className="h-auto rounded-md border bg-card p-4 shadow-sm text-sm text-muted-foreground">
                <p>Upload documents here to add them to your knowledge base. Once ingested, you can ask questions about them in the chat.</p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
