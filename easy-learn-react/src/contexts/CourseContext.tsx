import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { courseApi } from '../api/courses';
import { courses as defaultCourses } from '../data/courses';
import type { Course } from '../data/courses';

interface CourseCtx {
  courses: Course[];
  loading: boolean;
  refreshCourses: () => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  addCourse: (course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseCtx | null>(null);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await courseApi.getAll();
      if (res.data && res.data.length > 0) {
        setCourses(res.data);
      } else {
        // Fallback or automatic seed (we only want to fall back visually for normal users if DB is empty)
        setCourses(defaultCourses as any);
      }
    } catch (e) {
      console.error('Failed to load courses from DB', e);
      setCourses(defaultCourses as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const refreshCourses = async () => { await fetchCourses(); };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    await courseApi.update(id, updates);
    await fetchCourses();
  };

  const addCourse = async (course: Partial<Course>) => {
    await courseApi.create(course);
    await fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    await courseApi.delete(id);
    await fetchCourses();
  };

  return (
    <CourseContext.Provider value={{ courses, loading, refreshCourses, updateCourse, addCourse, deleteCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourses must be used within a CourseProvider');
  return ctx;
};
