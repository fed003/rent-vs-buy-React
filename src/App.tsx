import './styles/globals.css';
import Calculator from './components/layout/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        <Calculator />
      </main>
    </div>
  );
}

export default App;