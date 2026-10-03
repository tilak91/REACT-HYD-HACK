import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const ImportantDates = ({ dates }) => {
  if (!dates || dates.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No specific dates mentioned</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dates.map((date, index) => (
        <div key={index} className="date-card" style={{ animationDelay: `${0.05 * index}s` }}>
          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.25))' }}>
            <Calendar className="w-5 h-5 text-blue-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-200 text-sm">{date.event}</p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {date.date && (
                <span className="text-blue-400 text-sm font-medium">📅 {date.date}</span>
              )}
              {date.time && (
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {date.time}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImportantDates;