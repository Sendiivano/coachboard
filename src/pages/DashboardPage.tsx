import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

export function DashboardPage() {
  return (
    <div className="max-w-4xl w-full mx-auto flex flex-col gap-6 px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's where you can manage your teams and formations.</p>
      </div>

      <Link to="/teams">
        <Card className="hover:border-brand-400 transition-colors cursor-pointer">
          <h2 className="text-lg font-medium text-gray-900">Your Teams</h2>
          <p className="text-sm text-gray-500 mt-1">Manage rosters and open the tactical board.</p>
        </Card>
      </Link>
    </div>
  );
}