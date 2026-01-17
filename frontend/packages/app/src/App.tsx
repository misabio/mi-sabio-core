import { Button } from '@misabio/core-ui'

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Mi Sabio Core App</h1>
      <p>This button comes from @misabio/core-ui:</p>
      <Button onClick={() => alert('Clicked!')}>Click Me</Button>
    </div>
  )
}

export default App
