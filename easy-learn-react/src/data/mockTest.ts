export interface MockQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const mockQuestions: MockQuestion[] = [
  { id: 1, question: "Which of the following is not a primitive data type in JavaScript?", options: ["String", "Number", "Object", "Boolean"], correctAnswer: 2 },
  { id: 2, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctAnswer: 0 },
  { id: 3, question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], correctAnswer: 2 },
  { id: 4, question: "What is the correct way to write a JavaScript array?", options: ["var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')", "var colors = (1:'red', 2:'green', 3:'blue')", "var colors = ['red', 'green', 'blue']", "var colors = 'red', 'green', 'blue'"], correctAnswer: 2 },
  { id: 5, question: "Which HTML attribute is used to define inline styles?", options: ["style", "class", "styles", "font"], correctAnswer: 0 },
  { id: 6, question: "How do you add a comment in a CSS file?", options: ["// this is a comment", "/* this is a comment */", "' this is a comment", "<!-- this is a comment -->"], correctAnswer: 1 },
  { id: 7, question: "Which event occurs when the user clicks on an HTML element?", options: ["onmouseclick", "onchange", "onclick", "onmouseover"], correctAnswer: 2 },
  { id: 8, question: "What is the default value of the position property in CSS?", options: ["relative", "fixed", "absolute", "static"], correctAnswer: 3 },
  { id: 9, question: "Inside which HTML element do we put the JavaScript?", options: ["<js>", "<scripting>", "<javascript>", "<script>"], correctAnswer: 3 },
  { id: 10, question: "Which method can be used to round a number to the nearest integer in JavaScript?", options: ["Math.rnd()", "round()", "Math.round()", "Math.floor()"], correctAnswer: 2 },
  { id: 11, question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correctAnswer: 1 },
  { id: 12, question: "How do you declare a JavaScript variable?", options: ["v carName;", "var carName;", "variable carName;", "string carName;"], correctAnswer: 1 },
  { id: 13, question: "Which SQL statement is used to extract data from a database?", options: ["OPEN", "EXTRACT", "SELECT", "GET"], correctAnswer: 2 },
  { id: 14, question: "With SQL, how do you select all the columns from a table named 'Persons'?", options: ["SELECT [all] FROM Persons", "SELECT Persons", "SELECT * FROM Persons", "SELECT *.Persons"], correctAnswer: 2 },
  { id: 15, question: "Which operator is used to assign a value to a variable?", options: ["*", "-", "=", "x"], correctAnswer: 2 },
  { id: 16, question: "What does the 'typeof' operator return?", options: ["The size of a variable", "The type of a variable", "The value of a variable", "The scope of a variable"], correctAnswer: 1 },
  { id: 17, question: "In HTML, which attribute is used to specify that an input field must be filled out?", options: ["placeholder", "validate", "required", "formvalidate"], correctAnswer: 2 },
  { id: 18, question: "Which property is used to change the background color?", options: ["color", "bgcolor", "background-color", "bg-color"], correctAnswer: 2 },
  { id: 19, question: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"], correctAnswer: 0 },
  { id: 20, question: "How to write an IF statement in JavaScript?", options: ["if i = 5 then", "if (i == 5)", "if i == 5 then", "if i = 5"], correctAnswer: 1 },
  { id: 21, question: "How does a WHILE loop start?", options: ["while (i <= 10; i++)", "while i = 1 to 10", "while (i <= 10)", "while (i++)"], correctAnswer: 2 },
  { id: 22, question: "Which CSS property is used to change the text color of an element?", options: ["fgcolor", "text-color", "color", "font-color"], correctAnswer: 2 },
  { id: 23, question: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');", "msgBox('Hello World');"], correctAnswer: 2 },
  { id: 24, question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<link>"], correctAnswer: 2 },
  { id: 25, question: "Which JavaScript method is used to write HTML output?", options: ["document.write()", "console.log()", "document.output()", "window.print()"], correctAnswer: 0 },
  { id: 26, question: "What is the correct SQL statement to update data in a database?", options: ["MODIFY", "SAVE AS", "SAVE", "UPDATE"], correctAnswer: 3 },
  { id: 27, question: "How do you insert comments in SQL?", options: ["// comment", "/* comment */", "-- comment", "# comment"], correctAnswer: 2 },
  { id: 28, question: "Which attribute specifies a unique alphanumeric identifier for an element?", options: ["class", "id", "name", "type"], correctAnswer: 1 },
  { id: 29, question: "What does XML stand for?", options: ["eXtensible Markup Language", "eXtra Modern Link", "eXample Markup Language", "X-Markup Language"], correctAnswer: 0 },
  { id: 30, question: "Which of the following creates a new line in HTML?", options: ["<nl>", "<br>", "<lb>", "<break>"], correctAnswer: 1 }
];
