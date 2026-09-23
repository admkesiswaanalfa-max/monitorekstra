import { ClassInfo, Student } from '../types';

/**
 * Natural sort comparator for Indonesian class names like VII-A, VII-B, VIII-A, IX-C, 7A, 8B, etc.
 */
export const compareClassNames = (a: string, b: string): number => {
  const gradeRank = (name: string): number => {
    const upper = name.toUpperCase().trim();
    if (upper.startsWith('VII') || upper.startsWith('7')) return 7;
    if (upper.startsWith('VIII') || upper.startsWith('8')) return 8;
    if (upper.startsWith('IX') || upper.startsWith('9')) return 9;
    if (upper.startsWith('X') || upper.startsWith('10')) return 10;
    if (upper.startsWith('XI') || upper.startsWith('11')) return 11;
    if (upper.startsWith('XII') || upper.startsWith('12')) return 12;
    return 99;
  };

  const rankA = gradeRank(a);
  const rankB = gradeRank(b);

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

/**
 * Returns a sorted, deduplicated list of all available class names across registered classes and existing students.
 */
export const getAvailableClassNames = (classes?: ClassInfo[], students?: Student[]): string[] => {
  const set = new Set<string>();

  if (classes && classes.length > 0) {
    classes.forEach((c) => {
      if (c.name && c.name.trim()) {
        set.add(c.name.trim());
      }
    });
  }

  if (students && students.length > 0) {
    students.forEach((s) => {
      if (s.class && s.class.trim()) {
        set.add(s.class.trim());
      }
    });
  }

  // Fallback if completely empty
  if (set.size === 0) {
    ['VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-B'].forEach((c) => set.add(c));
  }

  return Array.from(set).sort(compareClassNames);
};

/**
 * Retrieves the assigned Wali Kelas name for a class from the master classes list
 */
export const getWaliKelasForClass = (
  className: string,
  classes?: ClassInfo[],
  defaultWali = ''
): string => {
  if (!className) return defaultWali;
  const matched = classes?.find(
    (c) => c.name.toLowerCase().trim() === className.toLowerCase().trim()
  );
  if (matched?.waliKelas && matched.waliKelas.trim()) {
    return matched.waliKelas.trim();
  }
  return defaultWali || `Wali Kelas ${className}`;
};

/**
 * Retrieves the assigned Wali Kelas NIP for a class from the master classes list
 */
export const getWaliKelasNipForClass = (
  className: string,
  classes?: ClassInfo[],
  defaultNip = ''
): string => {
  if (!className) return defaultNip;
  const matched = classes?.find(
    (c) => c.name.toLowerCase().trim() === className.toLowerCase().trim()
  );
  if (matched?.waliKelasNip && matched.waliKelasNip.trim()) {
    return matched.waliKelasNip.trim();
  }
  return defaultNip || '-';
};
