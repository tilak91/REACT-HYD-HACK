import React from 'react';
import { Package } from 'lucide-react';

const RequiredItems = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No specific items mentioned</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="item-row" style={{ animationDelay: `${0.05 * index}s` }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.25))' }}>
            <span className="text-sm">📌</span>
          </div>
          <p className="text-slate-300 text-sm flex-1">{item}</p>
        </div>
      ))}
    </div>
  );
};

export default RequiredItems;