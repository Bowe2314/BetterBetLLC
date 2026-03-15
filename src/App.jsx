import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';

import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import CoinFlip from './pages/CoinFlip';
import DiceRoll from './pages/DiceRoll';
import SlotMachine from './pages/SlotMachine';
import Roulette from './pages/Roulette';
import Blackjack from './pages/Blackjack';
import Crash from './pages/Crash';

import Mines from './pages/Mines';
import Keno from './pages/Keno';
import Withdraw from './pages/Withdraw';
import Payment from './pages/Payment';
import Disclaimer from './pages/Disclaimer';
import CasinoLayout from './components/CasinoLayout';
import { ThemeProvider } from './components/ThemeContext';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/SignIn" replace />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route element={<CasinoLayout />}>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/CoinFlip" element={<CoinFlip />} />
              <Route path="/DiceRoll" element={<DiceRoll />} />
              <Route path="/SlotMachine" element={<SlotMachine />} />
              <Route path="/Roulette" element={<Roulette />} />
              <Route path="/Blackjack" element={<Blackjack />} />
              <Route path="/Crash" element={<Crash />} />
  
              <Route path="/Mines" element={<Mines />} />
              <Route path="/Keno" element={<Keno />} />
              <Route path="/Withdraw" element={<Withdraw />} />
              <Route path="/Payment" element={<Payment />} />
            </Route>
            <Route path="/Disclaimer" element={<Disclaimer />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App