import axios from 'axios';

// Mock API for development - replace with actual backend URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface TimetableEntry {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  courseType: 'major' | 'minor' | 'skillBased' | 'abilityEnhancement' | 'valueAdded';
  duration: number;
}

export interface TimetableData {
  schedule: {
    [day: string]: {
      [timeSlot: string]: TimetableEntry | null;
    };
  };
  metadata: {
    totalCredits: number;
    totalSubjects: number;
    conflictsResolved: number;
    generatedAt: string;
  };
}

export interface StudentFormData {
  studentName: string;
  rollNumber: string;
  program: string;
  selectedCourses: {
    major: string[];
    minor: string[];
    skillBased: string[];
    abilityEnhancement: string[];
    valueAdded: string[];
  };
  preferredTimeSlots: string[];
  additionalRequirements: string;
}

// Mock data generator for demonstration
const generateMockTimetable = (formData: StudentFormData): TimetableData => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  const facultyNames = [
    'Dr. Priya Sharma', 'Prof. Rajesh Kumar', 'Dr. Meera Patel', 'Prof. Anil Gupta',
    'Dr. Sunita Singh', 'Prof. Vikram Joshi', 'Dr. Kavita Reddy', 'Prof. Amit Verma'
  ];

  const rooms = [
    'Room 101', 'Room 102', 'Room 201', 'Room 202', 'Lab A', 'Lab B', 
    'Seminar Hall', 'Conference Room', 'Room 301', 'Room 302'
  ];

  const schedule: { [day: string]: { [timeSlot: string]: TimetableEntry | null } } = {};
  const allCourses = Object.entries(formData.selectedCourses).flatMap(([type, courses]) => 
    courses.map(course => ({ course, type: type as TimetableEntry['courseType'] }))
  );

  let courseIndex = 0;
  let totalCredits = 0;
  let conflictsResolved = 3; // Mock conflicts resolved

  days.forEach(day => {
    schedule[day] = {};
    timeSlots.forEach(timeSlot => {
      // Add some randomness and ensure preferred time slots are more likely to be filled
      const shouldFillSlot = formData.preferredTimeSlots.includes(timeSlot) 
        ? Math.random() > 0.2 
        : Math.random() > 0.6;

      if (shouldFillSlot && courseIndex < allCourses.length) {
        const currentCourse = allCourses[courseIndex];
        schedule[day][timeSlot] = {
          id: `${day}-${timeSlot}-${courseIndex}`,
          subject: currentCourse.course,
          faculty: facultyNames[Math.floor(Math.random() * facultyNames.length)],
          room: rooms[Math.floor(Math.random() * rooms.length)],
          courseType: currentCourse.type,
          duration: 1
        };
        courseIndex++;
        totalCredits += currentCourse.type === 'major' ? 4 : 
                       currentCourse.type === 'minor' ? 3 : 2;
      } else {
        schedule[day][timeSlot] = null;
      }
    });
  });

  return {
    schedule,
    metadata: {
      totalCredits,
      totalSubjects: allCourses.length,
      conflictsResolved,
      generatedAt: new Date().toISOString()
    }
  };
};

export const generateTimetable = async (formData: StudentFormData): Promise<TimetableData> => {
  try {
    // In development, use mock data
    if (process.env.NODE_ENV !== 'production') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return generateMockTimetable(formData);
    }

    // Production API call
    const response = await axios.post(`${API_BASE_URL}/generate-timetable`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return response.data;
  } catch (error) {
    console.error('Error generating timetable:', error);
    
    // Fallback to mock data if API fails
    console.log('Falling back to mock data...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMockTimetable(formData);
  }
};