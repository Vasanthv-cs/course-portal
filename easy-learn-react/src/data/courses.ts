// Real YouTube tutorial courses with actual video IDs

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'code';
  youtubeId?: string;
  completed: boolean;
  active?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  rating: number;
  reviews: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  tags: string[];
  description: string;
  gradient: string;
  icon: string;
  enrolled: boolean;
  progress: number;
  modules: Module[];
  htmlQuizRequired?: boolean;
  htmlQuizPassed?: boolean;
}

export const courses: Course[] = [
  {
    id: 'html-css',
    title: 'HTML & CSS Full Course',
    slug: 'html-css',
    instructor: 'SuperSimpleDev',
    rating: 4.9,
    reviews: 28400,
    level: 'Beginner',
    duration: '6h 30m',
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'Frontend'],
    description: 'Learn HTML and CSS from scratch. Build real websites with modern layouts, Flexbox, Grid, and responsive design.',
    gradient: 'from-orange-500 to-red-500',
    icon: 'HTML',
    enrolled: true,
    progress: 72,
    htmlQuizRequired: true,
    htmlQuizPassed: false,
    modules: [
      {
        title: '1. HTML Basics',
        lessons: [
          { id: 'h1', title: 'HTML in 5 minutes', duration: '5:28', type: 'video', youtubeId: 'salY_Sm6mv4', completed: true },
          { id: 'h2', title: 'HTML Full Course', duration: '68:23', type: 'video', youtubeId: 'HD13eq_Pmp8', completed: true },
          { id: 'h3', title: 'HTML Tags & Elements', duration: '15:40', type: 'video', youtubeId: 'DPnqb74Smug', completed: true },
        ],
        quiz: [
          { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Language','Home Tool Markup Language'], correctIndex: 0, explanation: 'HTML stands for HyperText Markup Language, used for structuring web content.' },
          { question: 'Which tag is used for the largest heading?', options: ['<heading>','<h6>','<h1>','<head>'], correctIndex: 2, explanation: '<h1> defines the most important (largest) heading.' },
          { question: 'Which attribute specifies an image source?', options: ['href','src','link','url'], correctIndex: 1, explanation: 'The src attribute specifies the URL/path of the image.' },
        ]
      },
      {
        title: '2. CSS Fundamentals',
        lessons: [
          { id: 'c1', title: 'CSS in 5 minutes', duration: '5:15', type: 'video', youtubeId: 'Z4pCqp-uVvY', completed: true },
          { id: 'c2', title: 'CSS Flexbox Tutorial', duration: '15:02', type: 'video', youtubeId: 'fYq5PXgSsbE', completed: false, active: true },
          { id: 'c3', title: 'CSS Grid Layout', duration: '18:36', type: 'video', youtubeId: '9zBsdzdE4sM', completed: false },
          { id: 'c4', title: 'Responsive Design', duration: '22:14', type: 'video', youtubeId: 'srvUrASNj0s', completed: false },
        ],
        quiz: [
          { question: 'Which property changes text color?', options: ['font-color','text-color','color','foreground'], correctIndex: 2, explanation: 'The "color" property sets the text color in CSS.' },
          { question: 'What does "display: flex" do?', options: ['Hides the element','Creates a flex container','Makes text bold','Adds animation'], correctIndex: 1, explanation: 'display: flex turns an element into a flex container for flexible layouts.' },
        ]
      },
    ],
  },
  {
    id: 'javascript',
    title: 'JavaScript Complete Course',
    slug: 'javascript',
    instructor: 'Bro Code',
    rating: 4.8,
    reviews: 15200,
    level: 'Beginner',
    duration: '12h 00m',
    category: 'Web Development',
    tags: ['JavaScript', 'Frontend', 'Programming'],
    description: 'Master JavaScript from zero to hero. Covers variables, functions, DOM, async/await, ES6+ features and real projects.',
    gradient: 'from-yellow-400 to-amber-600',
    icon: 'JS',
    enrolled: true,
    progress: 35,
    modules: [
      {
        title: '1. JS Fundamentals',
        lessons: [
          { id: 'j1', title: 'JavaScript Tutorial Full Course', duration: '44:00', type: 'video', youtubeId: 'lfmg-EJ8gm4', completed: true },
          { id: 'j2', title: 'Variables & Data Types', duration: '12:18', type: 'video', youtubeId: 'edlFjlzxkSI', completed: true },
          { id: 'j3', title: 'Functions in JavaScript', duration: '20:35', type: 'video', youtubeId: 'FOD408a0EzU', completed: false, active: true },
        ],
        quiz: [
          { question: 'Which keyword declares a block-scoped variable?', options: ['var','let','function','define'], correctIndex: 1, explanation: '"let" declares a block-scoped variable, unlike "var" which is function-scoped.' },
          { question: 'What is the output of typeof null?', options: ['"null"','"undefined"','"object"','"boolean"'], correctIndex: 2, explanation: 'typeof null returns "object" — a well-known JavaScript bug since its creation.' },
        ]
      },
      {
        title: '2. DOM & Events',
        lessons: [
          { id: 'j4', title: 'DOM Manipulation', duration: '35:22', type: 'video', youtubeId: '5fb2aPlgoys', completed: false },
          { id: 'j5', title: 'Event Listeners', duration: '18:45', type: 'video', youtubeId: 'XF1_MlZ5l6M', completed: false },
          { id: 'j6', title: 'Build a To-Do App', duration: '45 min', type: 'code', completed: false },
        ],
        quiz: [
          { question: 'Which method selects an element by ID?', options: ['querySelector()','getElement()','getElementById()','findById()'], correctIndex: 2, explanation: 'document.getElementById() selects a single element by its unique ID attribute.' },
        ]
      },
      {
        title: '3. Async JavaScript',
        lessons: [
          { id: 'j7', title: 'Promises & Async/Await', duration: '24:56', type: 'video', youtubeId: 'li7FzDHYZpc', completed: false },
          { id: 'j8', title: 'Fetch API Tutorial', duration: '30:12', type: 'video', youtubeId: 'cuEtnrL9-H0', completed: false },
        ],
      },
    ],
  },
  {
    id: 'react',
    title: 'React 18 Complete Guide',
    slug: 'react',
    instructor: 'Codevolution',
    rating: 4.9,
    reviews: 22000,
    level: 'Intermediate',
    duration: '10h 45m',
    category: 'Web Development',
    tags: ['React', 'Frontend', 'Hooks'],
    description: 'Learn React 18 with hooks, context, routing, and state management. Build real-world projects step by step.',
    gradient: 'from-cyan-400 to-blue-600',
    icon: 'React',
    enrolled: false,
    progress: 0,
    modules: [
      {
        title: '1. React Basics',
        lessons: [
          { id: 'r1', title: 'React in 100 Seconds', duration: '2:27', type: 'video', youtubeId: 'Tn6-PIqc4UM', completed: false },
          { id: 'r2', title: 'React Tutorial for Beginners', duration: '85:00', type: 'video', youtubeId: 'SqcY0GlETPk', completed: false },
          { id: 'r3', title: 'JSX Explained', duration: '10:45', type: 'video', youtubeId: '7fPXI_MnBOY', completed: false },
        ],
        quiz: [
          { question: 'What is JSX?', options: ['A JavaScript framework','JavaScript XML syntax','A CSS preprocessor','A database query'], correctIndex: 1, explanation: 'JSX is a syntax extension for JavaScript that looks like HTML and compiles to React.createElement calls.' },
        ]
      },
      {
        title: '2. Hooks Deep Dive',
        lessons: [
          { id: 'r4', title: 'useState Hook', duration: '16:20', type: 'video', youtubeId: 'O6P86uwfdR0', completed: false },
          { id: 'r5', title: 'useEffect Hook', duration: '20:10', type: 'video', youtubeId: '0ZJgIjIuY7U', completed: false },
          { id: 'r6', title: 'Custom Hooks', duration: '14:33', type: 'video', youtubeId: 'J-g9ZJha8FE', completed: false },
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python for Beginners',
    slug: 'python',
    instructor: 'Programming with Mosh',
    rating: 4.8,
    reviews: 45000,
    level: 'Beginner',
    duration: '6h 14m',
    category: 'Data Science',
    tags: ['Python', 'Programming', 'Backend'],
    description: 'Learn Python programming from scratch. Covers syntax, data structures, OOP, file handling and automation.',
    gradient: 'from-blue-500 to-indigo-700',
    icon: 'PY',
    enrolled: false,
    progress: 0,
    modules: [
      {
        title: '1. Python Basics',
        lessons: [
          { id: 'p1', title: 'Python Full Course for Beginners', duration: '60:00', type: 'video', youtubeId: '_uQrJ0TkZlc', completed: false },
          { id: 'p2', title: 'Variables & Strings', duration: '18:20', type: 'video', youtubeId: 'cQT33yu9pY8', completed: false },
          { id: 'p3', title: 'Lists & Tuples', duration: '22:15', type: 'video', youtubeId: 'W8KRzm-HUcc', completed: false },
        ],
        quiz: [
          { question: 'How do you print in Python?', options: ['echo()','console.log()','print()','System.out.println()'], correctIndex: 2, explanation: 'The print() function outputs text to the console in Python.' },
          { question: 'Python is a...', options: ['Compiled language','Interpreted language','Markup language','Assembly language'], correctIndex: 1, explanation: 'Python is an interpreted, high-level programming language.' },
        ]
      },
      {
        title: '2. Data Structures',
        lessons: [
          { id: 'p4', title: 'Dictionaries & Sets', duration: '24:30', type: 'video', youtubeId: 'daefaLgNkw0', completed: false },
          { id: 'p5', title: 'List Comprehensions', duration: '12:10', type: 'video', youtubeId: '3dt4OGnU5sM', completed: false },
        ],
      },
    ],
  },
  {
    id: 'java',
    title: 'Java Programming Masterclass',
    slug: 'java',
    instructor: 'Telusko',
    rating: 4.7,
    reviews: 18500,
    level: 'Intermediate',
    duration: '14h 00m',
    category: 'Backend',
    tags: ['Java', 'OOP', 'Backend'],
    description: 'Complete Java course covering OOP, collections, streams, multithreading, and Spring Boot fundamentals.',
    gradient: 'from-red-500 to-rose-700',
    icon: 'Java',
    enrolled: true,
    progress: 0,
    modules: [
      {
        title: '1. Java Basics',
        lessons: [
          { id: 'ja1', title: 'Java Tutorial for Beginners', duration: '144:00', type: 'video', youtubeId: 'eIrMbAQSU34', completed: false },
          { id: 'ja2', title: 'OOP Concepts in Java', duration: '42:00', type: 'video', youtubeId: 'pTB0EiLXUC8', completed: false },
        ],
        quiz: [
          { question: 'What is the entry point of a Java program?', options: ['start()','init()','main()','run()'], correctIndex: 2, explanation: 'The main() method is the entry point: public static void main(String[] args)' },
        ]
      },
    ],
  },
  {
    id: 'sql',
    title: 'SQL & Database Design',
    slug: 'sql',
    instructor: 'freeCodeCamp',
    rating: 4.8,
    reviews: 32000,
    level: 'Beginner',
    duration: '4h 20m',
    category: 'Backend',
    tags: ['SQL', 'Database', 'MySQL'],
    description: 'Master SQL queries, joins, subqueries, database design, normalization, and real-world database projects.',
    gradient: 'from-emerald-500 to-teal-700',
    icon: 'SQL',
    enrolled: false,
    progress: 0,
    modules: [
      {
        title: '1. SQL Fundamentals',
        lessons: [
          { id: 's1', title: 'SQL Tutorial - Full Course', duration: '260:00', type: 'video', youtubeId: 'HXV3zeQKqGY', completed: false },
          { id: 's2', title: 'SQL Joins Explained', duration: '18:20', type: 'video', youtubeId: '9yeOJ0ZMUYw', completed: false },
        ],
        quiz: [
          { question: 'Which SQL command retrieves data?', options: ['GET','FETCH','SELECT','RETRIEVE'], correctIndex: 2, explanation: 'SELECT is used to query and retrieve data from database tables.' },
        ]
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}

export function getEnrolledCourses(): Course[] {
  return courses.filter(c => c.enrolled);
}

export function getCoursesByCategory(cat: string): Course[] {
  if (cat === 'All') return courses;
  return courses.filter(c => c.category === cat);
}
