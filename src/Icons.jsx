export const HomeIcon = ({ active }) => (
  <svg width="20" height="20" fill="none" stroke={active ? "#3b82f6" : "#64748b"} strokeWidth="2">
    <path d="M3 9l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
  </svg>
);

export const CalendarIcon = ({ active }) => (
  <svg width="20" height="20" fill="none" stroke={active ? "#3b82f6" : "#64748b"} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
  </svg>
);

export const UsersIcon = ({ active }) => (
  <svg width="20" height="20" fill="none" stroke={active ? "#3b82f6" : "#64748b"} strokeWidth="2">
    <circle cx="9" cy="7" r="4"/>
    <path d="M17 21v-2a4 4 0 00-3-3.87"/>
  </svg>
);