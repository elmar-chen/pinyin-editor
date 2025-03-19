import Editor from './components/Editor'
import './App.css'

function App(): JSX.Element {
  return (
    <div className="app">
      <header className="app-header">
        <h1>拼音编辑器</h1>
      </header>
      <main>
        <Editor />
      </main>
    </div>
  )
}

export default App
