
import React, { useState, createContext, useContext } from 'react';

export function Sidebar({ children }) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-50`}
    >
      {children}
    </div>
  );
}