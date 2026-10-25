import { Link } from 'react-router-dom';
import { useApp } from '../state/AppState';

export default function NotFound() {
  const { t } = useApp();
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-6xl font-bold text-vermilion">404</p>
      <h1 className="mt-4 text-2xl font-bold">{t('notFoundTitle')}</h1>
      <p className="mt-2 opacity-75">{t('notFoundText')}</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-vermilion px-4 py-2 text-white">{t('backHome')}</Link>
    </div>
  );
}
