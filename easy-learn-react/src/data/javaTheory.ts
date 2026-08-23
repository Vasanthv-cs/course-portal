export const javaTheory = `
# Java Master Course — Modules 1 to 5

---

# Module 1: Introduction to Java

## Learning Objectives
By the end of this module, you will:
- Understand what Java is and why it matters
- Know the history and features of Java
- Understand JVM, JRE, and JDK
- Be able to install Java and write your first program

---

## 1. What is Java?

Java is a **high-level, object-oriented, platform-independent programming language** developed by Sun Microsystems (now owned by Oracle). It is one of the most popular programming languages in the world, used for building web applications, mobile apps (Android), enterprise software, and more.

Java was designed with the philosophy: **"Write Once, Run Anywhere (WORA)"** — meaning code written on one machine can run on any other machine that has the Java Virtual Machine (JVM) installed.

---

## 2. History of Java

| Year | Event |
|------|-------|
| 1991 | James Gosling and team at Sun Microsystems started "Project Green" |
| 1995 | Java 1.0 officially released |
| 1997 | Java 1.1 released — inner classes, JDBC |
| 2004 | Java 5 — generics, enhanced for loop, autoboxing |
| 2014 | Java 8 — Lambda expressions, Stream API |
| 2017 | Java 9 — Module system |
| 2021 | Java 17 (LTS) — sealed classes, pattern matching |
| 2023 | Java 21 (LTS) — virtual threads, record patterns |

**Key People:** James Gosling (Father of Java), Mike Sheridan, Patrick Naughton.

---

## 3. Features of Java

### 1. Simple
Java has clean syntax similar to C/C++ but removes complex features like pointers and manual memory management.

### 2. Object-Oriented
Everything in Java is an object. Java follows OOP principles: Encapsulation, Inheritance, Polymorphism, Abstraction.

### 3. Platform Independent
Java code compiles to **bytecode** which runs on any OS via the JVM.

### 4. Secure
Java has no explicit pointer, and the JVM provides a secure execution environment.

### 5. Robust
Strong type checking, exception handling, and garbage collection make Java reliable.

### 6. Multithreaded
Java supports multiple threads of execution natively.

### 7. High Performance
JIT (Just-In-Time) compiler converts bytecode to native machine code at runtime.

### 8. Distributed
Java supports networking via built-in libraries (java.net).

### 9. Dynamic
Java can load classes at runtime dynamically.

---

## 4. JVM, JRE, JDK — Explained

\`\`\`
JDK (Java Development Kit)
│
├── JRE (Java Runtime Environment)
│   │
│   ├── JVM (Java Virtual Machine)
│   ├── Core Libraries (java.lang, java.util, etc.)
│   └── Other Files
│
├── Compiler (javac)
├── Debugger (jdb)
└── Other Tools (jar, javadoc, etc.)
\`\`\`

### JVM — Java Virtual Machine
- The JVM is an **abstract machine** that provides the runtime environment to execute Java bytecode.
- It is **platform-specific** (different JVM for Windows, Linux, Mac).
- Handles memory management (garbage collection), security, and execution.

### JRE — Java Runtime Environment
- JRE = JVM + Core Libraries
- Used to **run** Java programs.
- If you only want to run Java apps (not develop), install JRE.

### JDK — Java Development Kit
- JDK = JRE + Development Tools (compiler, debugger, etc.)
- Used to **develop and run** Java programs.
- If you are a developer, install JDK.

**Simple Rule:**
- End User → JRE
- Developer → JDK

---

## 5. How Java Works (Compilation Process)

\`\`\`
Source Code (.java)
        ↓
   [javac Compiler]
        ↓
  Bytecode (.class)
        ↓
   [JVM — Class Loader → Bytecode Verifier → JIT Compiler]
        ↓
  Machine Code (executed by OS)
\`\`\`

**Step-by-step:**
1. You write Java code in a \`.java\` file.
2. The \`javac\` compiler compiles it into platform-independent **bytecode** (\`.class\` file).
3. The JVM loads the \`.class\` file.
4. The **Class Loader** loads the class into memory.
5. The **Bytecode Verifier** checks for security violations.
6. The **JIT Compiler** converts bytecode to native machine code.
7. The OS executes the machine code.

---

## 6. Installing Java

### Step 1: Download JDK
- Visit: https://www.oracle.com/java/technologies/downloads/
- Or use OpenJDK: https://adoptium.net/
- Download JDK 17 or JDK 21 (LTS versions recommended)

### Step 2: Install
- Run the installer
- Follow the setup wizard

### Step 3: Set Environment Variable (Windows)
\`\`\`
JAVA_HOME = C:\\Program Files\\Java\\jdk-21
PATH = %JAVA_HOME%\\bin
\`\`\`

### Step 4: Verify Installation
Open terminal/command prompt:
\`\`\`bash
java -version
javac -version
\`\`\`

---

## 7. Your First Java Program

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### How to Run
\`\`\`bash
# Compile
javac HelloWorld.java

# Run
java HelloWorld

# Output
Hello, World!
\`\`\`

---

# Module 2: Variables & Data Types

## 1. What is a Variable?
A **variable** is a named memory location that stores a value.

\`\`\`java
int age = 25;
\`\`\`

## 3. Primitive Data Types

Java has **8 primitive data types**:

| Type | Size | Range |
|------|------|-------|
| \`byte\` | 1 byte | -128 to 127 |
| \`short\` | 2 bytes | -32,768 to 32,767 |
| \`int\` | 4 bytes | -2^31 to 2^31-1 |
| \`long\` | 8 bytes | -2^63 to 2^63-1 |
| \`float\` | 4 bytes | ~7 decimal digits |
| \`double\` | 8 bytes | ~15 decimal digits |
| \`char\` | 2 bytes | 0 to 65,535 (Unicode) |
| \`boolean\` | 1 bit | true / false |

---

# Module 3: Operators
## 1. Arithmetic Operators
Used for mathematical calculations (\`+\`, \`-\`, \`*\`, \`/\`, \`%\`).

## 2. Relational (Comparison) Operators
Return \`true\` or \`false\` (\`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`).

## 3. Logical Operators
Combine boolean expressions (\`&&\`, \`||\`, \`!\`).

---

# Module 4: Decision Making
## 1. if Statement
Executes a block only if the condition is \`true\`.

## 5. switch Statement
Selects one of many blocks to execute. Best when comparing a variable to constant values.

---

# Module 5: Loops
## 1. for Loop
Used when the number of iterations is known.

## 2. while Loop
Used when number of iterations is **not known** in advance.

## 3. do-while Loop
Executes the body **at least once** before checking the condition.

---
`;
