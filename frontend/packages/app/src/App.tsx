import { Button } from '@misabio/core-ui'
import { Menu, PanelRightClose, PanelRightOpen, Home, Settings, User, MessageSquare, Share2, X } from 'lucide-react'
import { useState } from 'react'
import { ChatInterface } from './components/ChatInterface'
import { UploadZone } from './components/UploadZone'
import { GraphView, Node } from './components/GraphView'

type ViewMode = 'chat' | 'graph'

function App() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('chat')
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node)
    if (!isDetailsOpen) setIsDetailsOpen(true)
  }

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
               <h1 className="font-semibold text-lg mr-4">Dashboard</h1>

               <div className="flex items-center bg-muted/20 p-1 rounded-lg border">
                 <Button
                    variant={viewMode === 'chat' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2 h-8"
                    onClick={() => setViewMode('chat')}
                 >
                   <MessageSquare className="h-4 w-4" /> Chat
                 </Button>
                 <Button
                    variant={viewMode === 'graph' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2 h-8"
                    onClick={() => setViewMode('graph')}
                 >
                   <Share2 className="h-4 w-4" /> Graph
                 </Button>
               </div>
             </div>

             <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="hidden lg:flex">
                  {isDetailsOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
               </Button>
             </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {viewMode === 'chat' ? (
                <ChatInterface />
            ) : (
                <GraphView onNodeClick={handleNodeClick} />
            )}
          </div>
        </main>

        {/* Right Sidebar (Details) - Hidden on Mobile/Tablet */}
        {isDetailsOpen && (
          <aside className="hidden lg:flex flex-col border-l bg-muted/10 p-4 w-[300px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <div className="font-semibold">{selectedNode ? 'Node Details' : 'Details'}</div>
                {selectedNode && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedNode(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-4">
              {selectedNode ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="rounded-md border bg-card p-4 shadow-sm">
                        <div className="font-bold text-lg mb-1">{selectedNode.label}</div>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 uppercase">
                            {selectedNode.type}
                        </div>
                    </div>

                    <div className="rounded-md border bg-card p-4 shadow-sm text-sm">
                        <h3 className="font-semibold mb-2">Properties</h3>
                        <div className="space-y-2">
                             {Object.entries(selectedNode.properties).length > 0 ? (
                                Object.entries(selectedNode.properties).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-[1fr_2fr] gap-2 border-b last:border-0 pb-2 last:pb-0">
                                        <span className="font-medium text-muted-foreground truncate" title={key}>{key}</span>
                                        <span className="break-words">{String(value)}</span>
                                    </div>
                                ))
                             ) : (
                                 <div className="text-muted-foreground italic">No properties available</div>
                             )}
                        </div>
                    </div>
                </div>
              ) : (
                <>
                  <UploadZone />
                  <div className="h-auto rounded-md border bg-card p-4 shadow-sm text-sm text-muted-foreground">
                    <p>Upload documents here to add them to your knowledge base. Once ingested, you can ask questions about them in the chat.</p>
                  </div>
                </>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
