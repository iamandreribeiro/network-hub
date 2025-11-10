import { redirect } from 'next/navigation';
import DashboardClient from './dashboard';

export default function Page() {
  const acessoLiberado = process.env.DASHBOARD_ENABLED === 'true';

  if (!acessoLiberado) {
    redirect('/');
  }

  return <DashboardClient />;
}