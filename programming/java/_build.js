/* ============================================================
   Java Topic Generator — one command fills all folders
   Usage:
     node _build.js              # generate missing/placeholder only
     node _build.js --force      # regenerate all
     node _build.js --from 100   # from topic 100 onwards
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const FROM = (() => { const i = args.indexOf('--from'); return i >= 0 ? args[i+1] : null; })();

/* ============================================================
   THEME TITLES
   ============================================================ */
const THEME_TITLES = {
  'introduction-to-java': 'Introduction to Java',
  'history-of-java': 'History of Java',
  'java-design-goals': 'Java Design Goals',
  'java-platform-overview': 'Java Platform Overview',
  'java-language-vs-platform': 'Java Language vs Platform',
  'java-applications': 'Java Applications',
  'java-editions': 'Java Editions (SE / EE / ME)',
  'java-se': 'Java SE',
  'jakarta-ee-relationship': 'Jakarta EE Relationship',
  'java-virtual-machine': 'Java Virtual Machine',
  'jvm-architecture': 'JVM Architecture',
  'bytecode-and-class-files': 'Bytecode & Class Files',
  'jdk-jre-jvm': 'JDK vs JRE vs JVM',
  'java-syntax-basics': 'Java Syntax Basics',
  'variables-and-data-types': 'Variables & Data Types',
  'operators': 'Java Operators',
  'control-flow': 'Control Flow',
  'loops': 'Loops in Java',
  'arrays': 'Arrays in Java',
  'methods': 'Methods in Java',
  'classes-and-objects': 'Classes & Objects',
  'inheritance': 'Inheritance',
  'polymorphism': 'Polymorphism',
  'encapsulation': 'Encapsulation',
  'abstraction': 'Abstraction',
  'interfaces': 'Interfaces',
  'abstract-classes': 'Abstract Classes',
  'packages': 'Packages',
  'access-modifiers': 'Access Modifiers',
  'static-keyword': 'The static keyword',
  'final-keyword': 'The final keyword',
  'this-and-super': 'this and super',
  'exceptions': 'Exception Handling',
  'collections-framework': 'Collections Framework',
  'generics': 'Generics',
  'streams-and-lambdas': 'Streams & Lambdas',
  'file-io': 'File I/O',
  'multithreading': 'Multithreading',
  'concurrency-utilities': 'Concurrency Utilities',
  'jdbc': 'JDBC',
  'networking': 'Networking in Java',
  'reflection': 'Reflection',
  'annotations': 'Annotations',
  'lambda-expressions': 'Lambda Expressions',
  'functional-interfaces': 'Functional Interfaces',
  'optional-class': 'The Optional Class',
  'records': 'Records (Java 16+)',
  'sealed-classes': 'Sealed Classes',
  'pattern-matching': 'Pattern Matching',
  'modules': 'Java Modules (JPMS)',
  'garbage-collection': 'Garbage Collection',
  'memory-management': 'Memory Management',
  'performance-tuning': 'Performance Tuning',
  'unit-testing': 'Unit Testing (JUnit)',
  'maven': 'Maven',
  'gradle': 'Gradle',
  'spring-framework': 'Spring Framework',
  'spring-boot': 'Spring Boot',
  'hibernate': 'Hibernate',
  'rest-apis': 'REST APIs',
  'microservices': 'Microservices',
  'design-patterns': 'Design Patterns',
  'interview-preparation': 'Interview Preparation',
  'real-world-projects': 'Real-World Projects'
};

/* ============================================================
   CATEGORY TEMPLATES — 10 recurring content types
   ============================================================ */
const CATEGORIES = {

  'core-concepts': {
    icon: '🧠',
    title: '{THEME}: Core Concepts',
    titleHtml: '{THEME}: <span class="grad">Core Concepts</span>',
    subtitle: 'The essential ideas behind {THEME} — what it is, why it matters, and how it fits in the modern Java ecosystem.',
    facts: [
      { big: 'Java 21', lbl: 'LTS Release' },
      { big: 'JVM', lbl: 'Runs On' },
      { big: 'WORA', lbl: 'Write Once Run Anywhere' },
      { big: 'Object-OOP', lbl: 'Pure OOP' },
      { big: 'OpenJDK', lbl: 'Open Source' }
    ],
    concepts: [
      { icon: '🎯', title: 'What It Is', desc: '{THEME} covers the foundational ideas every Java developer must know.' },
      { icon: '⚙️', title: 'How It Works', desc: 'The JVM, compiler, and Java language work together to enable {THEME}.' },
      { icon: '🚀', title: 'Why It Matters', desc: 'Enterprise Java relies on {THEME} for correctness, portability, and safety.' },
      { icon: '🌍', title: 'Real-World Use', desc: '{THEME} appears in Android apps, banking systems, big data, and cloud services.' }
    ],
    playground: {
      file: 'Main.java',
      code: `public class Main {
    public static void main(String[] args) {
        // {THEME} — core concept demo
        System.out.println("Exploring: {THEME}");

        String[] items = { "Alpha", "Beta", "Gamma" };
        for (String item : items) {
            System.out.println("→ " + item);
        }

        int total = 0;
        for (int i = 1; i <= 5; i++) total += i;
        System.out.println("Sum 1..5 = " + total);
    }
}`
    },
    stepCode: [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        System.out.println("Hello, Java!");',
      '        int[] numbers = { 1, 2, 3 };',
      '        for (int n : numbers) {',
      '            System.out.println(n);',
      '        }',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>public class Main</code> — every Java program lives inside a class. The file must be named <code>Main.java</code>.', tags: ['Class'] },
      { line: 1, text: '<code>public static void main(String[] args)</code> — the exact signature the JVM looks for to start execution.', tags: ['main', 'Entry'] },
      { line: 2, text: '<code>System.out.println()</code> — Java\'s standard console output method.', tags: ['Output'] },
      { line: 3, text: 'Array of ints declared and initialized in one line.', tags: ['Array'] },
      { line: 4, text: 'Enhanced for-loop iterates over elements — no index needed.', tags: ['for-each'] },
      { line: 5, text: 'Prints each element. Runs on any platform that has a JVM.', tags: ['Output'] }
    ],
    recap: [
      { title: '{THEME}', text: 'Foundation of many modern Java features.' },
      { title: 'Runs on JVM', text: 'Compiled to bytecode, executed by the Java Virtual Machine.' },
      { title: 'Portable', text: 'Same bytecode runs on Windows, Linux, macOS.' },
      { title: 'Object-Oriented', text: 'Everything lives inside classes.' }
    ]
  },

  'syntax-and-semantics': {
    icon: '📝',
    title: '{THEME}: Syntax & Semantics',
    titleHtml: '{THEME}: <span class="grad">Syntax & Semantics</span>',
    subtitle: 'How {THEME} is written and what it means — grammar rules, valid forms, and runtime behavior.',
    facts: [
      { big: 'Case-Sensitive', lbl: 'Identifiers' },
      { big: ';', lbl: 'Statement End' },
      { big: '{ }', lbl: 'Code Blocks' },
      { big: '// /** */', lbl: 'Comments' },
      { big: 'camelCase', lbl: 'Convention' }
    ],
    concepts: [
      { icon: '📐', title: 'Grammar Rules', desc: 'The exact tokens, punctuation, and ordering Java accepts for {THEME}.' },
      { icon: '🎯', title: 'Meaning', desc: 'What the JVM does with {THEME} — semantics define runtime behavior.' },
      { icon: '⚠️', title: 'Common Mistakes', desc: 'Missing semicolons, wrong casing, and ordering issues.' },
      { icon: '💡', title: 'Idioms', desc: 'Accepted ways to write {THEME} in professional Java code.' }
    ],
    playground: {
      file: 'SyntaxDemo.java',
      code: `public class SyntaxDemo {
    public static void main(String[] args) {
        // Single-line comment
        String name = "Alice";
        int age = 30;
        boolean isActive = true;

        if (age >= 18 && isActive) {
            System.out.println(name + " is active");
        }

        for (int i = 1; i <= 3; i++) {
            System.out.println("Step " + i);
        }
    }
}`
    },
    stepCode: [
      'public class SyntaxDemo {',
      '    public static void main(String[] args) {',
      '        int x = 42;',
      '        String s = "hello";',
      '        if (x > 0) {',
      '            System.out.println(s);',
      '        }',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: 'File name must match public class name — <code>SyntaxDemo.java</code>.', tags: ['Class', 'Rule'] },
      { line: 2, text: '<code>int x = 42;</code> — statement must end with <code>;</code>. Missing it = compile error.', tags: [';', 'Statement'] },
      { line: 3, text: 'Strings use <code>String</code> (capital S). Java strings are objects, not primitives.', tags: ['String'] },
      { line: 4, text: '<code>if (x &gt; 0)</code> — condition in parentheses, returns boolean.', tags: ['if'] },
      { line: 5, text: 'Braces are required in modern Java even for single statements.', tags: ['Block'] },
      { line: 8, text: 'Every brace must balance. Formatting matters for readability.', tags: ['End'] }
    ],
    recap: [
      { title: 'Syntax = Grammar', text: 'Rules for how code looks. Compiler enforces it.' },
      { title: 'Semantics = Meaning', text: 'What code does at runtime. JVM executes it.' },
      { title: 'Semicolons', text: 'Every statement ends with <code>;</code>. Blocks do not.' },
      { title: 'Case Matters', text: '<code>Name</code> and <code>name</code> are different identifiers.' }
    ]
  },

  'common-apis-and-usage': {
    icon: '📚',
    title: '{THEME}: Common APIs & Usage',
    titleHtml: '{THEME}: <span class="grad">Common APIs & Usage</span>',
    subtitle: 'The most-used classes, methods, and patterns in {THEME} — with practical examples.',
    facts: [
      { big: 'JRE', lbl: 'Runtime' },
      { big: '400K+', lbl: 'Maven Artifacts' },
      { big: 'Stream', lbl: 'Functional API' },
      { big: 'Collector', lbl: 'Aggregation' },
      { big: 'AutoCloseable', lbl: 'Cleanup' }
    ],
    concepts: [
      { icon: '🔧', title: 'Core APIs', desc: 'The standard classes you call most often when working with {THEME}.' },
      { icon: '📦', title: 'Packages', desc: '<code>java.lang</code>, <code>java.util</code>, <code>java.io</code>, <code>java.util.stream</code>.' },
      { icon: '🔁', title: 'Common Patterns', desc: 'try-with-resources, streams, Optional, and functional style.' },
      { icon: '🎯', title: 'When to Use', desc: 'Choosing between similar APIs — performance, safety, readability.' }
    ],
    playground: {
      file: 'ApiDemo.java',
      code: `import java.util.*;
import java.util.stream.*;

public class ApiDemo {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(5, 2, 8, 1, 9, 3);

        List<Integer> even = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());
        System.out.println("Even: " + even);

        List<Integer> sorted = numbers.stream()
            .sorted()
            .collect(Collectors.toList());
        System.out.println("Sorted: " + sorted);

        int sum = numbers.stream().mapToInt(Integer::intValue).sum();
        int max = numbers.stream().mapToInt(Integer::intValue).max().orElse(0);
        System.out.println("Sum = " + sum + ", Max = " + max);
    }
}`
    },
    stepCode: [
      'List<Integer> list = List.of(3, 1, 4);',
      '',
      'List<Integer> sorted = list.stream()',
      '    .sorted()',
      '    .collect(Collectors.toList());',
      '',
      'System.out.println(sorted);',
      '',
      '// Also: filter, map, reduce, findFirst'
    ],
    steps: [
      { line: 0, text: '<code>List.of()</code> — immutable list factory (Java 9+). No more <code>Arrays.asList</code> for constants.', tags: ['List'] },
      { line: 2, text: '<code>.stream()</code> — turns the collection into a lazy stream pipeline.', tags: ['Stream'] },
      { line: 3, text: '<code>.sorted()</code> — intermediate operation. Streams are lazy — nothing runs yet.', tags: ['Sorted'] },
      { line: 4, text: '<code>.collect(Collectors.toList())</code> — terminal operation triggers execution.', tags: ['Collect'] },
      { line: 6, text: 'Result printed. Java streams make complex transformations readable.', tags: ['Output'] }
    ],
    recap: [
      { title: 'Collections API', text: 'List, Map, Set, Deque — the backbone of Java data.' },
      { title: 'Streams', text: 'Functional pipelines for filtering, mapping, reducing.' },
      { title: 'Optional', text: 'Safe way to handle values that may be missing.' },
      { title: 'Maven Central', text: 'Over 400,000 libraries available with one dependency line.' }
    ]
  },

  'practical-examples': {
    icon: '💻',
    title: '{THEME}: Practical Examples',
    titleHtml: '{THEME}: <span class="grad">Practical Examples</span>',
    subtitle: 'Real code you can run today — patterns and snippets from production {THEME}.',
    facts: [
      { big: 'Copy-Paste', lbl: 'Ready Code' },
      { big: 'Real-World', lbl: 'Scenario Driven' },
      { big: 'Runnable', lbl: 'Every Snippet' },
      { big: 'Modern', lbl: 'Java 21 Syntax' },
      { big: 'Tested', lbl: 'Patterns' }
    ],
    concepts: [
      { icon: '🎯', title: 'Real Scenario', desc: 'Common tasks developers actually perform with {THEME}.' },
      { icon: '🔧', title: 'Complete Code', desc: 'Every example compiles and runs — no pseudocode.' },
      { icon: '🧩', title: 'Pattern', desc: 'The reusable shape you can adapt to your own problem.' },
      { icon: '⚡', title: 'Output', desc: 'What running the code produces.' }
    ],
    playground: {
      file: 'Practical.java',
      code: `import java.util.*;
import java.util.stream.*;

public class Practical {
    record Person(String name, int age) {}

    public static void main(String[] args) {
        var people = List.of(
            new Person("Alice", 25),
            new Person("Bob", 32),
            new Person("Carol", 19),
            new Person("Dave", 45),
            new Person("Eve", 28)
        );

        Map<String, List<Person>> groups = people.stream()
            .collect(Collectors.groupingBy(
                p -> p.age() < 30 ? "Young" : "Experienced"
            ));

        groups.forEach((key, group) -> {
            System.out.println(key + ": " + group.size() + " people");
            group.forEach(p -> System.out.println("  - " + p.name() + " (" + p.age() + ")"));
        });
    }
}`
    },
    stepCode: [
      'record Person(String name, int age) {}',
      '',
      'var people = List.of(',
      '    new Person("Alice", 25),',
      '    new Person("Bob", 32)',
      ');',
      '',
      'Map<String, List<Person>> groups = people.stream()',
      '    .collect(Collectors.groupingBy(',
      '        p -> p.age() < 30 ? "Young" : "Senior"',
      '    ));'
    ],
    steps: [
      { line: 0, text: '<code>record</code> (Java 16+) — compact data classes with auto-generated getters, equals, hashCode.', tags: ['record'] },
      { line: 2, text: '<code>var</code> — local variable type inference (Java 10+).', tags: ['var'] },
      { line: 3, text: 'Record constructor auto-assigns fields.', tags: ['record'] },
      { line: 7, text: 'Stream → collector pipeline: transform + group in one expression.', tags: ['Stream'] },
      { line: 9, text: 'Lambda with ternary decides the grouping key.', tags: ['Lambda'] }
    ],
    recap: [
      { title: 'Records', text: 'Lightweight data carriers. No boilerplate.' },
      { title: 'GroupingBy', text: 'Streams split into Map<K, List<V>>.' },
      { title: 'var', text: 'Local type inference — less typing, same type safety.' },
      { title: 'Modern Java', text: 'Records, streams, lambdas all play together.' }
    ]
  },

  'advanced-techniques': {
    icon: '🚀',
    title: '{THEME}: Advanced Techniques',
    titleHtml: '{THEME}: <span class="grad">Advanced Techniques</span>',
    subtitle: 'Powerful patterns and less-known features of {THEME} used by senior Java developers.',
    facts: [
      { big: 'Reflection', lbl: 'Runtime Meta' },
      { big: 'JPMS', lbl: 'Modules' },
      { big: 'Loom', lbl: 'Virtual Threads' },
      { big: 'Sealed', lbl: 'Restricted Types' },
      { big: 'AOT', lbl: 'Native Image' }
    ],
    concepts: [
      { icon: '⚡', title: 'Performance', desc: 'Advanced {THEME} techniques often target memory, JIT, and throughput.' },
      { icon: '🧬', title: 'Meta-Programming', desc: 'Reflection, dynamic proxies, bytecode manipulation.' },
      { icon: '🎯', title: 'Precision', desc: 'Fine-grained control over JVM behavior.' },
      { icon: '⚠️', title: 'Trade-offs', desc: 'When advanced techniques pay off — and when they hurt.' }
    ],
    playground: {
      file: 'Advanced.java',
      code: `import java.util.*;

public class Advanced {
    sealed interface Shape permits Circle, Square {}
    record Circle(double radius) implements Shape {}
    record Square(double side) implements Shape {}

    static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Square s -> s.side() * s.side();
        };
    }

    public static void main(String[] args) {
        List<Shape> shapes = List.of(new Circle(2), new Square(3));
        for (Shape s : shapes) {
            System.out.printf("Area: %.2f%n", area(s));
        }
    }
}`
    },
    stepCode: [
      'sealed interface Shape permits Circle, Square {}',
      '',
      'record Circle(double radius) implements Shape {}',
      'record Square(double side) implements Shape {}',
      '',
      'static double area(Shape shape) {',
      '    return switch (shape) {',
      '        case Circle c -> Math.PI * c.radius() * c.radius();',
      '        case Square s -> s.side() * s.side();',
      '    };',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>sealed interface</code> — restricts which classes may implement it. Enables exhaustive patterns.', tags: ['sealed'] },
      { line: 2, text: '<code>record</code> is a perfect fit for sealed hierarchies — immutable value types.', tags: ['record'] },
      { line: 6, text: '<strong>Pattern matching switch</strong> (Java 21) — switch over types, no casting needed.', tags: ['switch'] },
      { line: 8, text: 'The compiler knows all permitted types — no <code>default</code> required.', tags: ['Exhaustive'] }
    ],
    recap: [
      { title: 'Sealed Types', text: 'Compiler-enforced restricted hierarchies.' },
      { title: 'Records', text: 'Immutable data with less code.' },
      { title: 'Pattern Switch', text: 'Type-safe, exhaustive switch expressions.' },
      { title: 'Virtual Threads', text: 'Project Loom brings lightweight concurrency.' }
    ]
  },

  'best-practices': {
    icon: '⭐',
    title: '{THEME}: Best Practices',
    titleHtml: '{THEME}: <span class="grad">Best Practices</span>',
    subtitle: 'The conventions, patterns, and habits that separate professional {THEME} code from amateur code.',
    facts: [
      { big: 'Oracle', lbl: 'Guidelines' },
      { big: 'SOLID', lbl: 'Principles' },
      { big: 'DRY', lbl: 'No Duplication' },
      { big: 'KISS', lbl: 'Keep Simple' },
      { big: 'Effective Java', lbl: 'Book' }
    ],
    concepts: [
      { icon: '📏', title: 'Coding Standards', desc: 'Oracle and Google Java Style guides for naming and structure.' },
      { icon: '🎯', title: 'Clarity First', desc: 'Readable code beats clever code. Every time.' },
      { icon: '🔒', title: 'Safety', desc: 'Null checks, Optional, immutable types, defensive coding.' },
      { icon: '🧪', title: 'Testability', desc: 'Small, pure, dependency-injected classes are easy to test.' }
    ],
    playground: {
      file: 'BestPractices.java',
      code: `import java.util.*;
import java.util.Objects;

public class BestPractices {

    // DO: Use private final fields, immutability where possible
    public static final class OrderProcessor {
        private final List<String> items = new ArrayList<>();

        // DO: Validate inputs and throw informative exceptions
        public void addItem(String item) {
            if (item == null || item.isBlank()) {
                throw new IllegalArgumentException("Item must not be blank");
            }
            items.add(item);
        }

        public int getItemCount() { return items.size(); }

        @Override
        public String toString() {
            return "OrderProcessor with " + items.size() + " items";
        }
    }

    public static void main(String[] args) {
        OrderProcessor processor = new OrderProcessor();
        processor.addItem("Laptop");
        processor.addItem("Mouse");
        System.out.println(processor);
    }
}`
    },
    stepCode: [
      'public final class OrderProcessor {',
      '    private final List<String> items = new ArrayList<>();',
      '',
      '    public void addItem(String item) {',
      '        if (item == null || item.isBlank()) {',
      '            throw new IllegalArgumentException();',
      '        }',
      '        items.add(item);',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: 'Class names use <strong>PascalCase</strong>. Public classes go in their own file.', tags: ['Naming'] },
      { line: 1, text: '<code>private final</code> — encapsulate state, make it immutable when possible.', tags: ['Field'] },
      { line: 3, text: 'Methods use <strong>camelCase</strong>. Return type comes before name.', tags: ['Method'] },
      { line: 5, text: 'Validate inputs and throw <code>IllegalArgumentException</code> with a clear message.', tags: ['Validation'] },
      { line: 7, text: 'Prefer immutability — makes code thread-safe by default.', tags: ['Immutable'] }
    ],
    recap: [
      { title: 'PascalCase', text: 'Classes, interfaces, enums, records.' },
      { title: 'camelCase', text: 'Methods, variables, parameters.' },
      { title: 'Validate', text: 'Check inputs, throw informative exceptions.' },
      { title: 'Effective Java', text: 'Joshua Bloch\'s book — still the canonical guide.' }
    ]
  },

  'testing-and-validation': {
    icon: '🧪',
    title: '{THEME}: Testing & Validation',
    titleHtml: '{THEME}: <span class="grad">Testing & Validation</span>',
    subtitle: 'How to verify {THEME} works — unit tests, edge cases, and quality gates.',
    facts: [
      { big: 'JUnit 5', lbl: 'Test Framework' },
      { big: 'Mockito', lbl: 'Mocking' },
      { big: 'AssertJ', lbl: 'Fluent Asserts' },
      { big: 'TDD', lbl: 'Methodology' },
      { big: 'Codecov', lbl: 'Coverage' }
    ],
    concepts: [
      { icon: '✅', title: 'Unit Tests', desc: 'Small, focused tests for one behavior of {THEME}.' },
      { icon: '🎯', title: 'Edge Cases', desc: 'Null, empty, boundary values — where bugs hide.' },
      { icon: '🔁', title: 'Arrange-Act-Assert', desc: 'The classic pattern for structuring every test.' },
      { icon: '📊', title: 'Coverage', desc: 'What percentage of your {THEME} code is exercised by tests.' }
    ],
    playground: {
      file: 'Tests.java',
      code: `public class Tests {

    // Code under test
    static class Calculator {
        static int add(int a, int b) { return a + b; }
        static int divide(int a, int b) {
            if (b == 0) throw new ArithmeticException("Divide by zero");
            return a / b;
        }
    }

    // Simple assert helper (in production you'd use JUnit)
    static void assertEquals(int expected, int actual, String name) {
        String status = (expected == actual) ? "PASS" : "FAIL";
        System.out.println(status + ": " + name);
        if (expected != actual) throw new AssertionError(name);
    }

    public static void main(String[] args) {
        assertEquals(5, Calculator.add(2, 3), "add positive");
        assertEquals(0, Calculator.add(-1, 1), "add negative");
        assertEquals(5, Calculator.divide(10, 2), "divide works");

        boolean threw = false;
        try { Calculator.divide(5, 0); }
        catch (ArithmeticException e) { threw = true; }
        assertEquals(1, threw ? 1 : 0, "divide by zero throws");

        System.out.println("All tests passed!");
    }
}`
    },
    stepCode: [
      'static int add(int a, int b) { return a + b; }',
      '',
      'assertEquals(5, Calculator.add(2, 3), "add positive");',
      'assertEquals(0, Calculator.add(-1, 1), "add negative");',
      '',
      'boolean threw = false;',
      'try { Calculator.divide(5, 0); }',
      'catch (ArithmeticException e) { threw = true; }',
      'assertEquals(1, threw ? 1 : 0, "divide by zero throws");'
    ],
    steps: [
      { line: 0, text: 'Keep testable code small and pure — one responsibility.', tags: ['Design'] },
      { line: 2, text: 'First test — happy path. Verify the expected result.', tags: ['Test'] },
      { line: 3, text: 'Second test — negative numbers. Boundary case.', tags: ['Edge'] },
      { line: 6, text: 'Testing exceptions requires try/catch. Verify the throw happened.', tags: ['Exception'] },
      { line: 8, text: 'Assert the exception <em>was</em> thrown — a valid test case.', tags: ['Assert'] }
    ],
    recap: [
      { title: 'Test Early', text: 'Write tests alongside the code.' },
      { title: 'Edge Cases', text: 'Null, empty, boundaries, exceptions.' },
      { title: 'AAA Pattern', text: 'Arrange, Act, Assert — every test.' },
      { title: 'JUnit 5', text: 'The modern standard test framework for Java.' }
    ]
  },

  'performance-and-optimization': {
    icon: '⚡',
    title: '{THEME}: Performance & Optimization',
    titleHtml: '{THEME}: <span class="grad">Performance & Optimization</span>',
    subtitle: 'How to make {THEME} fast — profiling, JIT, and hot-path tuning.',
    facts: [
      { big: 'JMH', lbl: 'Micro-Benchmark' },
      { big: 'JIT', lbl: 'Just-In-Time' },
      { big: 'G1 / ZGC', lbl: 'GC Options' },
      { big: 'JFR', lbl: 'Flight Recorder' },
      { big: 'JProfiler', lbl: 'Profilers' }
    ],
    concepts: [
      { icon: '📊', title: 'Measure First', desc: 'Never optimize by guessing — profile with JFR or async-profiler.' },
      { icon: '🔥', title: 'Hot Paths', desc: 'Find the 10% of code that consumes 90% of time.' },
      { icon: '🧠', title: 'GC Pressure', desc: 'Reduce object allocations to keep GC young-gen fast.' },
      { icon: '⚙️', title: 'JIT Warmup', desc: 'The JVM gets faster as it runs — benchmark after warmup.' }
    ],
    playground: {
      file: 'Performance.java',
      code: `public class Performance {
    public static void main(String[] args) {
        final int N = 100_000;

        // Slow: string concatenation in a loop
        long t1 = System.nanoTime();
        String slow = "";
        for (int i = 0; i < N; i++) slow += "x";
        long t2 = System.nanoTime();
        System.out.println("String += : " + (t2 - t1) / 1_000_000 + " ms");

        // Fast: StringBuilder
        long t3 = System.nanoTime();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < N; i++) sb.append('x');
        String fast = sb.toString();
        long t4 = System.nanoTime();
        System.out.println("StringBuilder: " + (t4 - t3) / 1_000_000 + " ms");

        System.out.println("Same length: " + (slow.length() == fast.length()));
    }
}`
    },
    stepCode: [
      'final int N = 100_000;',
      'long t1 = System.nanoTime();',
      '',
      'String slow = "";',
      'for (int i = 0; i < N; i++) slow += "x";',
      '',
      'long t2 = System.nanoTime();',
      '',
      'StringBuilder sb = new StringBuilder();',
      'for (int i = 0; i < N; i++) sb.append(\'x\');',
      'String fast = sb.toString();'
    ],
    steps: [
      { line: 1, text: '<code>System.nanoTime()</code> — the standard way to measure elapsed time in Java.', tags: ['Timing'] },
      { line: 4, text: '<code>+=</code> on Strings creates a NEW String every iteration — O(N²).', tags: ['Anti-Pattern'] },
      { line: 8, text: '<code>StringBuilder</code> mutates a buffer in place — O(N).', tags: ['Optimization'] },
      { line: 9, text: '<code>append(char)</code> is faster than <code>append(String)</code> for single chars.', tags: ['Fast'] },
      { line: 10, text: 'Same result — but 100x+ faster at scale.', tags: ['Result'] }
    ],
    recap: [
      { title: 'Measure', text: 'Never optimize without profiling data.' },
      { title: 'StringBuilder', text: 'Use for loop concatenation — never <code>+=</code>.' },
      { title: 'GC Matters', text: 'Fewer allocations = faster young-gen collections.' },
      { title: 'JMH', text: 'Java Microbenchmark Harness — the correct tool.' }
    ]
  },

  'security-and-reliability': {
    icon: '🛡️',
    title: '{THEME}: Security & Reliability',
    titleHtml: '{THEME}: <span class="grad">Security & Reliability</span>',
    subtitle: 'Writing {THEME} that is safe, defensive, and resilient against attacks and failures.',
    facts: [
      { big: 'OWASP', lbl: 'Guidelines' },
      { big: 'PreparedStatement', lbl: 'SQL Safe' },
      { big: 'Optional', lbl: 'Null Safe' },
      { big: 'HTTPS', lbl: 'In Transit' },
      { big: 'Validate', lbl: 'All Inputs' }
    ],
    concepts: [
      { icon: '🔒', title: 'Input Validation', desc: 'Never trust input. Validate everything from outside {THEME}.' },
      { icon: '🛡️', title: 'Defense in Depth', desc: 'Multiple layers — one failure should never be catastrophic.' },
      { icon: '⚠️', title: 'Common Attacks', desc: 'SQL injection, XSS, deserialization, and how Java prevents them.' },
      { icon: '🔁', title: 'Fail Safe', desc: 'When errors happen, fail to a safe state — never crash silently.' }
    ],
    playground: {
      file: 'Security.java',
      code: `import java.sql.*;
import java.util.regex.Pattern;

public class Security {
    private static final Pattern SAFE = Pattern.compile("[a-zA-Z0-9 ]+");

    public static void main(String[] args) {
        String userInput = "'; DROP TABLE users; --";

        // BAD: string concatenation into SQL
        String badQuery = "SELECT * FROM users WHERE name = '" + userInput + "'";
        System.out.println("UNSAFE: " + badQuery);

        // GOOD: validate input
        String clean = SAFE.matcher(userInput).replaceAll("");
        System.out.println("CLEAN:  " + clean);

        // BEST: parameterized query
        System.out.println("SAFE:   Use PreparedStatement with setString()");
        // String sql = "SELECT * FROM users WHERE name = ?";
        // PreparedStatement ps = conn.prepareStatement(sql);
        // ps.setString(1, userInput);
    }
}`
    },
    stepCode: [
      'String userInput = "\'; DROP TABLE users; --";',
      '',
      'String badQuery = "SELECT * FROM users WHERE name = \'" + userInput + "\'";',
      '// ↑ NEVER do this — SQL injection!',
      '',
      'String clean = userInput.replaceAll("[^a-zA-Z0-9 ]", "");',
      '// ↑ Sanitize — one layer of defense',
      '',
      '// BEST: PreparedStatement + setString()',
    ],
    steps: [
      { line: 0, text: 'Malicious user input can contain SQL injection payloads.', tags: ['Threat'] },
      { line: 2, text: '<strong>Never</strong> concatenate user input into SQL — the #1 security flaw.', tags: ['SQL Injection'] },
      { line: 5, text: 'Sanitization removes dangerous characters — one layer of defense.', tags: ['Validation'] },
      { line: 8, text: 'The real fix is <strong>PreparedStatement</strong> — user input is treated as data, never as SQL.', tags: ['Fix'] }
    ],
    recap: [
      { title: 'Never Trust Input', text: 'All data from outside is suspect.' },
      { title: 'PreparedStatement', text: 'Always parameterize SQL — never concatenate.' },
      { title: 'Validate', text: 'Regex and allowlists for known-safe input.' },
      { title: 'Defense in Depth', text: 'Multiple layers of protection.' }
    ]
  },

  'troubleshooting-and-interview-questions': {
    icon: '🎯',
    title: '{THEME}: Troubleshooting & Interview Questions',
    titleHtml: '{THEME}: <span class="grad">Troubleshooting & Interviews</span>',
    subtitle: 'Common bugs, error messages, and the interview questions asked about {THEME}.',
    facts: [
      { big: 'FAQ', lbl: 'Common Errors' },
      { big: '10+', lbl: 'Interview Qs' },
      { big: 'Real', lbl: 'Scenario Based' },
      { big: 'Answers', lbl: 'Explained' },
      { big: 'Patterns', lbl: 'To Memorize' }
    ],
    concepts: [
      { icon: '🐛', title: 'Common Errors', desc: 'The exact error messages you will hit with {THEME}.' },
      { icon: '💡', title: 'Diagnosis', desc: 'How to read stack traces, logs, and debug efficiently.' },
      { icon: '🎤', title: 'Interview Qs', desc: 'The questions asked in Java job interviews about {THEME}.' },
      { icon: '✅', title: 'Best Answers', desc: 'Clear, correct responses that impress interviewers.' }
    ],
    playground: {
      file: 'Troubleshoot.java',
      code: `public class Troubleshoot {
    public static void main(String[] args) {
        // Common error: NullPointerException
        try {
            String s = null;
            System.out.println(s.length()); // CRASH
        } catch (NullPointerException ex) {
            System.out.println("Caught: " + ex.getClass().getSimpleName());
            System.out.println("Fix: use Optional or null check");
        }

        // Common error: ArrayIndexOutOfBoundsException
        try {
            int[] arr = { 1, 2, 3 };
            System.out.println(arr[5]); // CRASH
        } catch (ArrayIndexOutOfBoundsException ex) {
            System.out.println("Fix: check arr.length before indexing");
        }

        System.out.println("Program survived both errors");
    }
}`
    },
    stepCode: [
      'String s = null;',
      'System.out.println(s.length());  // 💥 NullPointerException',
      '',
      'int[] arr = { 1, 2, 3 };',
      'System.out.println(arr[5]);    // 💥 ArrayIndexOutOfBoundsException',
      '',
      '// Fixes:',
      '// Optional.ofNullable(s).map(String::length)',
      '// if (i < arr.length) ...'
    ],
    steps: [
      { line: 0, text: 'Assigning null to a reference — very common in Java.', tags: ['Null'] },
      { line: 1, text: 'Calling a method on null throws <strong>NullPointerException</strong> — the most common Java bug.', tags: ['NPE'] },
      { line: 3, text: 'Arrays are zero-indexed. Size 3 → valid indexes are 0, 1, 2.', tags: ['Array'] },
      { line: 4, text: 'Accessing <code>arr[5]</code> throws <strong>ArrayIndexOutOfBoundsException</strong>.', tags: ['Range'] },
      { line: 7, text: '<code>Optional</code> and null checks are the safe alternatives.', tags: ['Fix'] }
    ],
    recap: [
      { title: 'NPE #1', text: 'The most common Java bug. Use <code>Optional</code> and null checks.' },
      { title: 'Range Checks', text: 'Always validate indexes against <code>length</code>.' },
      { title: 'Read Stack Traces', text: 'They tell you exactly where the error occurred.' },
      { title: 'try/catch', text: 'Wrap risky operations appropriately.' }
    ]
  }
};

/* ============================================================
   THEME OVERRIDES — natural theme references
   ============================================================ */
const THEME_OVERRIDES = {
  'java-language-vs-platform': 'the difference between the Java language and the Java platform',
  'java-editions': 'Java SE, Java EE (Jakarta EE), and Java ME',
  'java-se': 'the Standard Edition of Java',
  'jakarta-ee-relationship': 'how Java EE became Jakarta EE',
  'jvm-architecture': 'the internals of the Java Virtual Machine',
  'bytecode-and-class-files': 'how Java bytecode is structured',
  'multithreading': 'concurrent programming in Java',
  'concurrency-utilities': 'the java.util.concurrent package',
  'streams-and-lambdas': 'functional-style Java with Streams and lambdas',
  'generics': 'type-safe generic programming in Java',
  'reflection': 'runtime introspection and dynamic code',
  'annotations': 'metadata and annotation processing',
  'optional-class': 'the Optional<T> container',
  'records': 'compact data classes in modern Java',
  'sealed-classes': 'restricted class hierarchies',
  'pattern-matching': 'type patterns and switch expressions',
  'modules': 'the Java Platform Module System (JPMS)',
  'garbage-collection': 'how the JVM reclaims memory automatically',
  'memory-management': 'heap, stack, and object lifetimes in Java'
};

/* ============================================================
   PARSE FOLDER NAME
   ============================================================ */
function parseFolder(name) {
  const m = name.match(/^(\d+)-(.+)$/);
  if (!m) return null;
  const num = m[1];
  const rest = m[2];

  const CATEGORY_SUFFIXES = [
    'troubleshooting-and-interview-questions',
    'performance-and-optimization',
    'security-and-reliability',
    'testing-and-validation',
    'common-apis-and-usage',
    'advanced-techniques',
    'syntax-and-semantics',
    'practical-examples',
    'best-practices',
    'core-concepts'
  ];

  let theme = rest;
  let category = 'core-concepts';
  for (const cat of CATEGORY_SUFFIXES) {
    if (rest.endsWith('-' + cat)) {
      theme = rest.slice(0, -(cat.length + 1));
      category = cat;
      break;
    }
  }

  return { num, theme, category };
}

/* ============================================================
   BUILD TOPIC
   ============================================================ */
function buildTopic(folderName) {
  const parsed = parseFolder(folderName);
  if (!parsed) return null;

  const { num, theme, category } = parsed;
  const catTemplate = CATEGORIES[category] || CATEGORIES['core-concepts'];
  const themeTitle = THEME_TITLES[theme] || theme.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const themeContext = THEME_OVERRIDES[theme] || themeTitle;

  const substitute = (s) => String(s)
    .replace(/\{THEME\}/g, themeTitle)
    .replace(/\{THEME_LOWER\}/g, themeContext);

  return {
    num,
    title: substitute(catTemplate.title),
    titleHtml: substitute(catTemplate.titleHtml),
    subtitle: substitute(catTemplate.subtitle),
    facts: catTemplate.facts.map(f => ({ big: substitute(f.big), lbl: substitute(f.lbl) })),
    concepts: catTemplate.concepts.map(c => ({
      icon: c.icon,
      title: substitute(c.title),
      desc: substitute(c.desc)
    })),
    playground: {
      file: catTemplate.playground.file,
      code: substitute(catTemplate.playground.code)
    },
    stepCode: catTemplate.stepCode,
    steps: catTemplate.steps,
    recap: catTemplate.recap.map(r => ({
      title: substitute(r.title),
      text: substitute(r.text)
    }))
  };
}

/* ============================================================
   HTML TEMPLATE
   ============================================================ */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHTML(topic) {
  const factsHtml = topic.facts.map(f =>
    `<div class="fact"><div class="big">${escapeHtml(f.big)}</div><div class="lbl">${escapeHtml(f.lbl)}</div></div>`
  ).join('');

  const conceptsHtml = topic.concepts.map((c, i) => {
    const colors = ['#ed8b00,#f89820', '#007396,#00a6d6', '#ea2d2e,#ff5f56', '#5382a1,#7ba7c4'];
    const [c1, c2] = colors[i % colors.length].split(',');
    return `<div class="concept" style="--c1:${c1};--c2:${c2}">
      <div class="c-ico">${c.icon}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${c.desc}</p>
    </div>`;
  }).join('');

  const recapHtml = topic.recap.map((r, i) => {
    const colors = ['#ed8b00', '#007396', '#ea2d2e', '#22c55e'];
    return `<div class="recap" style="--rc:${colors[i % colors.length]}">
      <div class="t">${escapeHtml(r.title)}</div>
      <div class="d">${r.text}</div>
    </div>`;
  }).join('');

  const stepCodeHtml = topic.stepCode.map((l, i) =>
    `<div class="step-line" data-line="${i}">${escapeHtml(l) || ' '}</div>`
  ).join('');

  const codeEscaped = topic.playground.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(topic.num)} · ${escapeHtml(topic.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:#05060f;color:#f1f5f9;line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.space-base{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#1a0f05 0%,#0a0a20 45%,#05060f 85%),radial-gradient(ellipse at 0% 100%,#0a1a2e 0%,transparent 55%)}
.orbs{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:.45}
.orb{position:absolute;border-radius:50%;filter:blur(90px)}
.orb-1{width:520px;height:520px;top:-10%;left:-8%;background:radial-gradient(circle,#ed8b00,transparent 70%);animation:d1 26s ease-in-out infinite}
.orb-2{width:460px;height:460px;top:45%;right:-10%;background:radial-gradient(circle,#007396,transparent 70%);animation:d2 30s ease-in-out infinite}
.orb-3{width:600px;height:600px;bottom:-18%;left:18%;background:radial-gradient(circle,#ea2d2e,transparent 70%);animation:d3 34s ease-in-out infinite}
@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,40px) scale(1.15)}}
@keyframes d2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.2)}}
@keyframes d3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-60px) scale(1.1)}}
.grid-bg{position:fixed;inset:-50%;z-index:2;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(237,139,0,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(237,139,0,.12) 1px,transparent 1px);background-size:80px 80px;transform:perspective(500px) rotateX(60deg);animation:gf 22s linear infinite;mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%)}
@keyframes gf{from{background-position:0 0}to{background-position:0 80px}}
.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.72) 100%)}
.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}
.container{max-width:1150px;margin:0 auto;padding:0 1.5rem;width:100%}
nav{position:sticky;top:0;z-index:100;background:rgba(5,6,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(148,163,184,.08)}
.nav-inner{max-width:1150px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1rem;color:#f1f5f9;text-decoration:none}
.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#ed8b00,#007396);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.85rem;color:#fff;box-shadow:0 8px 20px -6px rgba(237,139,0,.6)}
.hero{padding:4.5rem 1.5rem 3rem;text-align:center}
.tpill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(237,139,0,.12);border:1px solid rgba(237,139,0,.35);border-radius:999px;padding:.45rem 1.1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#ffb84d;margin-bottom:1.5rem}
.tpill .n{background:#ed8b00;color:#fff;min-width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;padding:0 .35rem}
.hero h1{font-size:clamp(1.9rem,4.8vw,3rem);font-weight:900;letter-spacing:-.04em;line-height:1.15;margin-bottom:1.2rem}
.hero h1 .grad{background:linear-gradient(135deg,#ffb84d 0%,#ed8b00 45%,#007396 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gs 7s ease-in-out infinite}
@keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.hero p{color:#a1a1aa;font-size:1.05rem;max-width:660px;margin:0 auto;line-height:1.7}
section{padding:3rem 0}
.sec-head{text-align:center;margin-bottom:2.5rem}
.stag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(237,139,0,.1);border:1px solid rgba(237,139,0,.3);border-radius:999px;padding:.4rem 1rem;font-size:.68rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#ffb84d;margin-bottom:1rem}
.sec-head h2{font-size:clamp(1.6rem,3.8vw,2.3rem);font-weight:900;letter-spacing:-.03em;line-height:1.15;margin-bottom:.6rem}
.sec-head h2 .grad{background:linear-gradient(135deg,#ffb84d,#007396);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sec-head p{color:#94a3b8;font-size:.95rem;max-width:620px;margin:0 auto}
.facts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:2rem}
.fact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:1.05rem 1rem;text-align:center;transition:all .25s}
.fact:hover{transform:translateY(-3px);border-color:rgba(237,139,0,.4)}
.fact .big{font-size:1.05rem;font-weight:900;background:linear-gradient(135deg,#ffb84d,#007396);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}
.fact .lbl{font-size:.66rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-top:.4rem}
.concept-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}
.concept{position:relative;padding:1.5rem;border-radius:18px;background:linear-gradient(155deg,rgba(24,25,50,.8),rgba(12,13,30,.6));border:1px solid rgba(148,163,184,.1);transition:all .3s;overflow:hidden}
.concept::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--c1),var(--c2),transparent)}
.concept:hover{transform:translateY(-4px);border-color:var(--c1);box-shadow:0 20px 40px -18px var(--c1)}
.c-ico{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--c1),var(--c2));display:flex;align-items:center;justify-content:center;font-size:1.45rem;margin-bottom:.9rem;box-shadow:0 10px 24px -8px var(--c1);animation:if 5s ease-in-out infinite}
@keyframes if{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.concept h3{font-size:1.05rem;font-weight:800;margin-bottom:.4rem;color:#f1f5f9}
.concept p{color:#94a3b8;font-size:.85rem;line-height:1.6}
.playground{display:grid;grid-template-columns:1.5fr 1fr;gap:0;border-radius:16px;overflow:hidden;border:1px solid rgba(148,163,184,.15);margin-top:1.2rem;background:#0d1117}
@media(max-width:900px){.playground{grid-template-columns:1fr}}
.editor-pane{border-right:1px solid rgba(148,163,184,.12);display:flex;flex-direction:column}
@media(max-width:900px){.editor-pane{border-right:none;border-bottom:1px solid rgba(148,163,184,.12)}}
.editor-toolbar{display:flex;align-items:center;justify-content:space-between;padding:.6rem 1rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);flex-wrap:wrap;gap:.5rem}
.toolbar-left{display:flex;align-items:center;gap:.6rem}
.traffic{display:flex;gap:6px}
.traffic span{width:11px;height:11px;border-radius:50%}
.traffic span:nth-child(1){background:#ff5f56}
.traffic span:nth-child(2){background:#ffbd2e}
.traffic span:nth-child(3){background:#27c93f}
.filename{font-size:.78rem;color:#8b949e;font-family:'JetBrains Mono',monospace}
.run-btn{background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:999px;padding:.45rem 1.15rem;font-size:.8rem;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:.4rem;box-shadow:0 4px 12px -3px rgba(16,185,129,.5);transition:all .2s}
.run-btn:hover{transform:translateY(-1px)}
.code-area{width:100%;min-height:360px;background:#0d1117;color:#e6edf3;border:none;padding:1.2rem 1.4rem;font-family:'JetBrains Mono',monospace;font-size:.86rem;line-height:1.75;resize:vertical;outline:none;tab-size:4;white-space:pre;overflow-x:auto}
.output-pane{background:#010409;display:flex;flex-direction:column}
.output-header{padding:.6rem 1rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);font-size:.72rem;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:.5rem}
.status-dot{width:8px;height:8px;border-radius:50%;background:#484f58;transition:background .3s}
.status-dot.ok{background:#27c93f;box-shadow:0 0 8px rgba(39,201,63,.5)}
.status-dot.err{background:#ff5f56;box-shadow:0 0 8px rgba(255,95,86,.5)}
.output-body{padding:1.2rem 1.4rem;font-family:'JetBrains Mono',monospace;font-size:.84rem;line-height:1.7;color:#7ee787;white-space:pre-wrap;overflow-y:auto;flex:1;min-height:300px}
.output-body .err{color:#ff7b72}
.output-body .dim{color:#484f58;font-style:italic}
.step-viz{margin-top:1.2rem;background:#0d1117;border-radius:16px;border:1px solid rgba(148,163,184,.15);overflow:hidden}
.step-header{padding:.7rem 1.2rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
.step-header .title{font-size:.8rem;color:#8b949e;font-family:'JetBrains Mono',monospace}
.step-controls{display:flex;gap:.4rem}
.step-btn{background:rgba(237,139,0,.15);border:1px solid rgba(237,139,0,.3);color:#ffb84d;border-radius:8px;padding:.35rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.step-btn:hover:not(:disabled){background:rgba(237,139,0,.3)}
.step-btn:disabled{opacity:.35;cursor:not-allowed}
.step-body{display:grid;grid-template-columns:1.2fr 1fr}
@media(max-width:800px){.step-body{grid-template-columns:1fr}}
.step-code{padding:1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1);overflow-x:auto}
@media(max-width:800px){.step-code{border-right:none;border-bottom:1px solid rgba(148,163,184,.1)}}
.step-line{padding:.15rem .5rem;border-radius:5px;transition:background .3s;white-space:pre}
.step-line.active{background:rgba(237,139,0,.18);box-shadow:inset 3px 0 0 #ed8b00;color:#fff}
.step-info{padding:1.1rem 1.3rem;background:rgba(30,41,59,.4)}
.explain{font-size:.85rem;color:#cbd5e1;min-height:4rem;margin-bottom:.9rem;line-height:1.6}
.explain code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.82em}
.tag-list{display:flex;flex-wrap:wrap;gap:.35rem}
.tag{background:rgba(255,184,77,.15);border:1px solid rgba(255,184,77,.3);color:#ffb84d;border-radius:6px;padding:.25rem .65rem;font-size:.7rem;font-family:'JetBrains Mono',monospace;font-weight:600}
.step-progress{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}
.bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}
.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#ed8b00,#007396);border-radius:999px;transition:width .35s}
.count{font-size:.72rem;color:#64748b;font-family:'JetBrains Mono',monospace;min-width:3.5rem;text-align:right}
.recap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.9rem;margin-top:1.2rem}
.recap{background:rgba(30,41,59,.6);border-radius:14px;padding:1.1rem 1.2rem;border-left:3px solid var(--rc,#ed8b00)}
.recap .t{font-size:.72rem;font-weight:800;color:var(--rc,#ed8b00);text-transform:uppercase;letter-spacing:.08em}
.recap .d{font-size:.85rem;color:#cbd5e1;margin-top:.35rem;line-height:1.55}
.recap .d code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.82em}
footer{text-align:center;padding:3rem 1.5rem;border-top:1px solid rgba(148,163,184,.08);color:#52525b;font-size:.82rem;margin-top:auto}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .8s,transform .8s}
.reveal.in{opacity:1;transform:translateY(0)}
</style>
</head>
<body>
<div class="space-base"></div>
<div class="orbs"><div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div></div>
<div class="grid-bg"></div>
<div class="vig"></div>

<div class="page">
  <nav>
    <div class="nav-inner">
      <a href="#" class="brand"><div class="brand-mark">J</div> Java Series</a>
    </div>
  </nav>

  <div class="hero">
    <div class="tpill"><span class="n">${topic.num}</span> Topic ${topic.num}</div>
    <h1>${topic.titleHtml}</h1>
    <p>${escapeHtml(topic.subtitle)}</p>
  </div>

  <div class="container">
    <div class="facts-row reveal">${factsHtml}</div>

    <section>
      <div class="sec-head reveal">
        <div class="stag">Core Concepts</div>
        <h2>What You Need to <span class="grad">Know</span></h2>
      </div>
      <div class="concept-grid">${conceptsHtml}</div>
    </section>

    <section>
      <div class="sec-head reveal">
        <div class="stag">Hands-On</div>
        <h2>Try It <span class="grad">Yourself</span></h2>
      </div>
      <div class="playground reveal">
        <div class="editor-pane">
          <div class="editor-toolbar">
            <div class="toolbar-left">
              <div class="traffic"><span></span><span></span><span></span></div>
              <span class="filename">${escapeHtml(topic.playground.file)}</span>
            </div>
            <button class="run-btn" onclick="runCode()">▶ Run Code</button>
          </div>
          <textarea class="code-area" id="codeInput" spellcheck="false">${codeEscaped}</textarea>
        </div>
        <div class="output-pane">
          <div class="output-header"><span class="status-dot" id="statusDot"></span> OUTPUT</div>
          <div class="output-body" id="outputBody"><span class="dim">// Click "Run Code" to see the output...</span></div>
        </div>
      </div>
    </section>

    <section>
      <div class="sec-head reveal">
        <div class="stag">Walkthrough</div>
        <h2>Step-by-Step <span class="grad">Explanation</span></h2>
      </div>
      <div class="step-viz reveal">
        <div class="step-header">
          <span class="title">${escapeHtml(topic.playground.file)}</span>
          <div class="step-controls">
            <button class="step-btn" id="prevBtn" onclick="stepPrev()" disabled>← Prev</button>
            <button class="step-btn" id="nextBtn" onclick="stepNext()">Next Step →</button>
            <button class="step-btn" onclick="stepReset()">↺ Reset</button>
          </div>
        </div>
        <div class="step-body">
          <div class="step-code" id="stepCode">${stepCodeHtml}</div>
          <div class="step-info">
            <div class="explain" id="stepExplain">Click <strong>Next Step</strong> to begin.</div>
            <div class="tag-list" id="stepTags"><span style="font-size:.72rem;color:#484f58;">Waiting to start</span></div>
          </div>
        </div>
        <div class="step-progress">
          <div class="bar"><div class="bar-fill" id="stepBar"></div></div>
          <div class="count" id="stepCount">0 / ${topic.steps.length}</div>
        </div>
      </div>
    </section>

    <section>
      <div class="sec-head reveal">
        <div class="stag">Recap</div>
        <h2>Key <span class="grad">Takeaways</span></h2>
      </div>
      <div class="recap-grid">${recapHtml}</div>
    </section>
  </div>

  <footer>
    <p>☕ ${escapeHtml(topic.title)} · Java Series · Built for learners</p>
  </footer>
</div>

<script>
const STEPS = ${JSON.stringify(topic.steps)};
(function(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

function stripComments(c){
  return c.replace(/\\/\\/.*$/gm,'').replace(/\\/\\*[\\s\\S]*?\\*\\//g,'');
}
function splitStmts(src){
  const out=[];let cur='',inStr=false,depth=0;
  for(let i=0;i<src.length;i++){
    const c=src[i],p=src[i-1];
    if(c==='"'&&p!=='\\\\')inStr=!inStr;
    if(!inStr){
      if(c==='{')depth++;
      if(c==='}')depth--;
      if(c===';'&&depth===0){out.push(cur.trim());cur='';continue}
    }
    cur+=c;
  }
  if(cur.trim())out.push(cur.trim());
  return out;
}
function interpret(code){
  const output=[],vars={};let error=null;
  let clean=stripComments(code).replace(/import\\s+[\\w.*]+;/g,'');
  const mm=clean.match(/public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\[\\]\\s*\\w+\\s*\\)\\s*\\{([\\s\\S]*)\\n\\s*\\}/);
  if(!mm)return{output:[],error:'No public static void main(String[] args) found'};
  const body=mm[1];
  function evalE(expr){
    expr=expr.trim();
    let sm=expr.match(/^"(.*)"$/);if(sm)return sm[1].replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t');
    if(/^-?\\d+$/.test(expr))return parseInt(expr,10);
    if(/^-?\\d+\\.\\d+$/.test(expr))return parseFloat(expr);
    if(expr==='true')return true;
    if(expr==='false')return false;
    if(vars[expr]!==undefined)return vars[expr];
    let r=expr;
    Object.keys(vars).sort((a,b)=>b.length-a.length).forEach(n=>{
      r=r.replace(new RegExp('\\\\b'+n+'\\\\b','g'),'('+(typeof vars[n]==='string'?JSON.stringify(vars[n]):vars[n])+')');
    });
    r=r.replace(/\\+\\s*/g,' + ').replace(/\\bnew\\s+/g,'');
    try{return Function('"use strict";return('+r+')')()}catch{return 0}
  }
  function exec(list){
    for(const st of list){
      const s=st.trim();if(!s||s==='{'||s==='}')continue;
      let w=s.match(/^System\\.out\\.println\\s*\\(([\\s\\S]+)\\)$/);
      if(w){
        let parts=w[1].split(/\\s*\\+\\s*/);
        output.push(parts.map(p=>String(evalE(p))).join(''));
        continue;
      }
      let d=s.match(/^(int|String|boolean|double|long|float|var)\\s+(\\w+)\\s*=\\s*([\\s\\S]+)$/);
      if(d){vars[d[2]]=evalE(d[3]);continue}
      let dn=s.match(/^(int|String|boolean|double|long|float)\\s+(\\w+)$/);
      if(dn){vars[dn[2]]=0;continue}
      let a=s.match(/^(\\w+)\\s*=\\s*([\\s\\S]+)$/);
      if(a&&vars[a[1]]!==undefined){vars[a[1]]=evalE(a[2]);continue}
      let fm=s.match(/^for\\s*\\(\\s*(?:int\\s+)?(\\w+)\\s*=\\s*(-?\\d+)\\s*;\\s*\\1\\s*(<=|<)\\s*(-?\\d+)\\s*;\\s*\\1\\+\\+\\s*\\)\\s*\\{([\\s\\S]*)\\}$/);
      if(fm){
        const vn=fm[1],st0=parseInt(fm[2],10),op=fm[3],en=parseInt(fm[4],10);
        const inner=splitStmts(fm[5]);
        for(let i=st0;(op==='<'?i<en:i<=en);i++){vars[vn]=i;exec(inner)}
        continue;
      }
      let im2=s.match(/^if\\s*\\(([\\s\\S]+?)\\)\\s*\\{([\\s\\S]*?)\\}(?:\\s*else\\s*\\{([\\s\\S]*?)\\})?$/);
      if(im2){
        if(evalE(im2[1]))exec(splitStmts(im2[2]));
        else if(im2[3])exec(splitStmts(im2[3]));
        continue;
      }
      // Handle System.out.println with simple + concatenation
      let w2=s.match(/^System\\.out\\.print\\s*\\(([\\s\\S]+)\\)$/);
      if(w2){
        if(!output.length)output.push('');
        output[output.length-1]+=String(evalE(w2[1]));
        continue;
      }
    }
  }
  try{exec(splitStmts(body))}catch(e){error=e.message}
  return{output,vars,error};
}
function runCode(){
  const code=document.getElementById('codeInput').value;
  const r=interpret(code);
  const ob=document.getElementById('outputBody'),sd=document.getElementById('statusDot');
  ob.innerHTML='';
  if(r.error){sd.className='status-dot err';ob.innerHTML='<span class="err">⚠ '+r.error+'</span>'}
  else if(!r.output.length){sd.className='status-dot ok';ob.innerHTML='<span class="dim">// Program ran but printed nothing.</span>'}
  else{sd.className='status-dot ok';r.output.forEach(l=>{const el=document.createElement('div');el.textContent=l;ob.appendChild(el)})}
}
let cur=-1;
function update(){
  document.querySelectorAll('.step-line').forEach(el=>el.classList.remove('active'));
  if(cur<0){
    document.getElementById('stepExplain').innerHTML='Click <strong>Next Step</strong> to begin.';
    document.getElementById('stepTags').innerHTML='<span style="font-size:.72rem;color:#484f58;">Waiting to start</span>';
    document.getElementById('stepBar').style.width='0%';
    document.getElementById('stepCount').textContent='0 / '+STEPS.length;
    document.getElementById('prevBtn').disabled=true;document.getElementById('nextBtn').disabled=false;
    return;
  }
  const s=STEPS[cur];
  const el=document.querySelector('.step-line[data-line="'+s.line+'"]');if(el)el.classList.add('active');
  document.getElementById('stepExplain').innerHTML=s.text;
  document.getElementById('stepTags').innerHTML=(s.tags||[]).map(t=>'<span class="tag">'+t+'</span>').join('');
  document.getElementById('stepBar').style.width=((cur+1)/STEPS.length*100)+'%';
  document.getElementById('stepCount').textContent=(cur+1)+' / '+STEPS.length;
  document.getElementById('prevBtn').disabled=cur<=0;
  document.getElementById('nextBtn').disabled=cur>=STEPS.length-1;
}
function stepNext(){if(cur<STEPS.length-1){cur++;update()}}
function stepPrev(){if(cur>0){cur--;update()}}
function stepReset(){cur=-1;update()}
update();
</script>
</body>
</html>`;
}

/* ============================================================
   MAIN BUILD
   ============================================================ */
const folders = fs.readdirSync(ROOT)
  .filter(f => /^\d+-/.test(f) && fs.statSync(path.join(ROOT, f)).isDirectory())
  .sort();

console.log(`\n☕ Found ${folders.length} Java topic folders.\n`);

let generated = 0, skipped = 0, failed = 0;

for(const folder of folders){
  if(FROM){
    const n = folder.match(/^(\d+)/)[1];
    if(n < FROM) continue;
  }

  const outPath = path.join(ROOT, folder, 'index.html');

  // Smart skip — only skip real content
  if(fs.existsSync(outPath) && !FORCE){
    const existing = fs.readFileSync(outPath, 'utf8');
    const hasRealContent =
      existing.includes('class="step-viz"') &&
      existing.includes('class="step-line"') &&
      existing.includes('class="concept"') &&
      existing.includes('class="facts-row"');
    const isPlaceholder =
      existing.includes('XTutiRaiseUp') ||
      existing.includes('ready for complete documentation');

    if(hasRealContent && !isPlaceholder){
      skipped++;
      continue;
    }
  }

  try {
    const topic = buildTopic(folder);
    if(!topic){
      console.log(`⚠  Skipped (bad name): ${folder}`);
      failed++;
      continue;
    }
    const html = renderHTML(topic);
    fs.writeFileSync(outPath, html, 'utf8');
    generated++;
    if(generated % 50 === 0) console.log(`✓ Generated ${generated}...`);
  } catch(e){
    console.log(`✗ Error on ${folder}: ${e.message}`);
    failed++;
  }
}

console.log(`\n✨ Build complete!`);
console.log(`   Generated: ${generated}`);
console.log(`   Skipped (already real): ${skipped}`);
console.log(`   Failed:    ${failed}`);
console.log(`\n💡 Run with --force to regenerate everything.\n`);