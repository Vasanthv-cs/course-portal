export interface Project {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  technologies: string[];
  tasks: string[];
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    difficulty: 'Beginner',
    description: 'Build a responsive personal portfolio website to showcase your skills, projects, and contact information. This project focuses on semantic HTML, CSS Grid/Flexbox, and basic JavaScript for interactivity.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    tasks: [
      'Create a responsive navigation bar that collapses into a hamburger menu on mobile.',
      'Design a hero section with a brief introduction and a call-to-action button.',
      'Build a project gallery using CSS Grid.',
      'Implement a functional contact form with client-side validation.'
    ]
  },
  {
    id: 'weather-app',
    title: 'Weather App',
    difficulty: 'Intermediate',
    description: 'Develop a dynamic weather application that fetches data from a public API. Users should be able to search for a city and see the current weather conditions and a 5-day forecast.',
    technologies: ['React', 'REST API', 'Tailwind CSS'],
    tasks: [
      'Set up a React project and configure Tailwind CSS.',
      'Integrate the OpenWeatherMap API to fetch current weather data based on city name.',
      'Display temperature, humidity, wind speed, and weather icons.',
      'Implement a 5-day forecast section.'
    ]
  },
  {
    id: 'task-manager',
    title: 'Kanban Task Manager',
    difficulty: 'Advanced',
    description: 'Create a full-fledged Kanban board application where users can create columns, add tasks, and drag-and-drop tasks between columns. Persist the data using local storage.',
    technologies: ['React', 'TypeScript', 'Drag and Drop'],
    tasks: [
      'Design the board layout with multiple columns (e.g., To Do, In Progress, Done).',
      'Implement the ability to add, edit, and delete tasks.',
      'Use a drag-and-drop library (like dnd-kit or react-beautiful-dnd) to move tasks.',
      'Save the board state to localStorage so data persists across page reloads.'
    ]
  }
];
