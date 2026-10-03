import React from 'react';
import { X } from 'lucide-react';

const NoticePreview = ({ file, preview, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Notice</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">{file.name}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Remove file"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="relative bg-gray-50 rounded-lg p-2">
        <img
          src={preview}
          alt="Uploaded notice preview"
          className="w-full max-h-80 object-contain rounded-lg"
        />
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {file.type.split('/')[1].toUpperCase()}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-blue-700 font-medium">File Type</div>
          <div className="text-blue-900">{file.type}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-green-700 font-medium">File Size</div>
          <div className="text-green-900">{formatFileSize(file.size)}</div>
        </div>
      </div>
    </div>
  );
};

export default NoticePreview;