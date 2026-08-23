export interface TestCase {
  input: string; // JSON stringified array of arguments
  expectedOutput: any; // The expected return value
}

export interface Algorithm {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  startingCode: string;
  testCases: TestCase[];
}

export const algorithms: Algorithm[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    startingCode: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
    testCases: [
      { input: '[[2,7,11,15], 9]', expectedOutput: [0, 1] },
      { input: '[[3,2,4], 6]', expectedOutput: [1, 2] },
      { input: '[[3,3], 6]', expectedOutput: [0, 1] },
    ]
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
      { input: 'x = -121', output: 'false', explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.' },
    ],
    startingCode: 'function isPalindrome(x) {\n  // Write your code here\n  \n}',
    testCases: [
      { input: '[121]', expectedOutput: true },
      { input: '[-121]', expectedOutput: false },
      { input: '[10]', expectedOutput: false },
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    startingCode: 'function isValid(s) {\n  // Write your code here\n  \n}',
    testCases: [
      { input: '["()"]', expectedOutput: true },
      { input: '["()[]{}"]', expectedOutput: true },
      { input: '["(]"]', expectedOutput: false },
      { input: '["([)]"]', expectedOutput: false },
      { input: '["{[]}"]', expectedOutput: true },
    ]
  }
];
