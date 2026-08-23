export interface LabStep {
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface Lab {
  id: string;
  title: string;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  outcomeImage: string;
  steps: LabStep[];
  startingCode: string;
}

export const labs: Lab[] = [
  {
    id: 'html-nav',
    title: 'Create a Responsive Navbar',
    language: 'HTML/CSS',
    difficulty: 'Beginner',
    description: 'Build a modern, responsive navigation bar with a logo and links.',
    outcomeImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    startingCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* Add your CSS here */
  </style>
</head>
<body>
  <!-- Build your navbar here -->
</body>
</html>`,
    steps: [
      {
        title: 'Step 1: HTML Structure',
        description: 'Create a <nav> element containing a <div> for the logo and an <ul> for the navigation links.',
        codeSnippet: '<nav>\\n  <div class="logo">MySite</div>\\n  <ul>\\n    <li><a href="#">Home</a></li>\\n  </ul>\\n</nav>'
      },
      {
        title: 'Step 2: Basic Styling',
        description: 'Use Flexbox on the <nav> element to align the logo and the list horizontally. Use justify-content: space-between.',
      },
      {
        title: 'Step 3: Style the Links',
        description: 'Remove the default list styling and underline from the links. Add some padding and hover effects.',
      }
    ]
  },
  {
    id: 'html-form',
    title: 'Build a Registration Form',
    language: 'HTML/CSS',
    difficulty: 'Beginner',
    description: 'Design a clean registration form with various input types and a submit button.',
    outcomeImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop',
    startingCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; padding-top: 50px; }
  </style>
</head>
<body>
  <!-- Create your form here -->
</body>
</html>`,
    steps: [
      {
        title: 'Step 1: The Form Element',
        description: 'Start with a <form> tag. Add a heading inside it.',
      },
      {
        title: 'Step 2: Input Fields',
        description: 'Add labels and inputs for Name (type="text"), Email (type="email"), and Password (type="password").',
      },
      {
        title: 'Step 3: Submit Button',
        description: 'Add a <button type="submit"> at the bottom and style it to look like a call-to-action.',
      }
    ]
  },
  {
    id: 'html-table',
    title: 'Data Table with Hover Effects',
    language: 'HTML/CSS',
    difficulty: 'Intermediate',
    description: 'Create a styled table to display tabular data, with striped rows and hover effects.',
    outcomeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    startingCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    table { width: 100%; border-collapse: collapse; }
  </style>
</head>
<body>
  <!-- Add table structure -->
</body>
</html>`,
    steps: [
      {
        title: 'Step 1: Table Structure',
        description: 'Use <table>, <thead>, and <tbody>. Create header rows with <th> and data rows with <td>.',
      },
      {
        title: 'Step 2: Borders and Padding',
        description: 'Add borders to the cells and padding to make the content breathable.',
      },
      {
        title: 'Step 3: Stripes & Hover',
        description: 'Use the :nth-child(even) selector for striped rows, and :hover on tr elements in the body.',
      }
    ]
  },
  {
    id: 'js-counter',
    title: 'Interactive Counter',
    language: 'JavaScript',
    difficulty: 'Beginner',
    description: 'Build a counter with increment, decrement, and reset buttons.',
    outcomeImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop',
    startingCode: `<!DOCTYPE html>
<html>
<body>
  <h1 id="count">0</h1>
  <button id="dec">-</button>
  <button id="res">Reset</button>
  <button id="inc">+</button>

  <script>
    // Add logic here
  </script>
</body>
</html>`,
    steps: [
      {
        title: 'Step 1: Select Elements',
        description: 'Use document.getElementById to select the buttons and the heading.',
      },
      {
        title: 'Step 2: State Variable',
        description: 'Create a variable let count = 0; to hold the current value.',
      },
      {
        title: 'Step 3: Event Listeners',
        description: 'Add click event listeners to the buttons to update the count and update the innerText of the heading.',
      }
    ]
  }
];
