import React from 'react';

export function FeedbackPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Feedback</h1>
        <p className="text-lg text-gray-700">
          Have feedback? Wish to add or update your facility information?{' '}
          <a 
            href="mailto:dispomatchapp@gmail.com" 
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Let us know!
          </a>
        </p>
      </div>
    </div>
  );
}