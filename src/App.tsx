import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KanaPage from './pages/KanaPage';
import VocabDetail from './pages/VocabDetail';
import Vocabulary from './pages/Vocabulary';
import Review from './pages/Review';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import { AppProvider } from './state/AppState';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="hiragana" element={<KanaPage key="hira" script="hira" />} />
            <Route path="katakana" element={<KanaPage key="kata" script="kata" />} />
            <Route path="vocabulary" element={<Vocabulary />} />
            <Route path="vocabulary/:id" element={<VocabDetail />} />
            <Route path="review" element={<Review />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AppProvider>
    </ErrorBoundary>
  );
}
