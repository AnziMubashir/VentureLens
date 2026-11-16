import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-center space-x-2">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      <span>
        <strong>Academic Evaluation Tool:</strong> VentureLens simulates multi-agent analytical boardrooms for ideation and demonstration purposes. It does not provide formal financial, legal, or investment advice.
      </span>
    </div>
  );
};
