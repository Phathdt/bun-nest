import { RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PanelHeader({
  title,
  count,
  isLoading,
  onRefresh,
}: {
  title: string;
  count: number;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
        <Badge>{count}</Badge>
      </div>
      <Button variant="ghost" onClick={onRefresh}>
        <RefreshCcw className={cn('size-4', isLoading && 'animate-spin')} />
        Refresh
      </Button>
    </div>
  );
}
