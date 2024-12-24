import './styles/globals.css';
import BuyCalculator from './components/buy/BuyCalculator';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        <BuyCalculator />
      </main>
    </div>
  );
}

export default App;