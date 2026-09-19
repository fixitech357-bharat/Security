/* ============================================================
   C# Topic Generator — one command fills all folders
   Usage:
     node _build.js              # generate missing only
     node _build.js --force      # regenerate all
     node _build.js --from 0011  # from topic 0011 onwards
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const FROM = (() => { const i = args.indexOf('--from'); return i >= 0 ? args[i+1] : null; })();

/* ============================================================
   THEME NAMES — human-readable titles
   ============================================================ */
const THEME_TITLES = {
  'c-sharp-language-fundamentals': 'C# Language Fundamentals',
  'c-sharp-version-evolution': 'C# Version Evolution',
  'net-sdk-and-cli': '.NET SDK & CLI',
  'object-oriented-programming': 'Object-Oriented Programming',
  'generics-and-collections': 'Generics & Collections',
  'linq-and-queries': 'LINQ & Queries',
  'async-and-concurrency': 'Async & Concurrency',
  'memory-management': 'Memory Management',
  'file-and-io': 'File & I/O',
  'serialization': 'Serialization',
  'networking': 'Networking',
  'asp-net-core': 'ASP.NET Core',
  'entity-framework-core': 'Entity Framework Core',
  'web-api': 'Web API',
  'blazor': 'Blazor',
  'desktop-apps': 'Desktop Apps (WPF/WinForms)',
  'unity-and-games': 'Unity & Games',
  'cloud-and-azure': 'Cloud & Azure',
  'testing': 'Testing',
  'design-patterns': 'Design Patterns',
  'microservices': 'Microservices',
  'performance-engineering': 'Performance Engineering',
  'security': 'Security',
  'devops-and-ci-cd': 'DevOps & CI/CD',
  'advanced-c-sharp': 'Advanced C#',
  'interview-preparation': 'Interview Preparation',
  'real-world-projects': 'Real-World Projects'
};

/* ============================================================
   CATEGORY TEMPLATES — 10 recurring categories
   ============================================================ */
const CATEGORIES = {

  'core-concepts': {
    icon: '🧠',
    title: '{THEME}: Core Concepts',
    titleHtml: '{THEME}: <span class="grad">Core Concepts</span>',
    subtitle: 'The essential ideas behind {THEME} — what it is, why it matters, and how it fits in the modern C# ecosystem.',
    facts: [
      { big: 'C# 12', lbl: 'Latest Standard' },
      { big: '.NET 8', lbl: 'Modern Runtime' },
      { big: 'Multi-Platform', lbl: 'Win/Linux/macOS' },
      { big: 'Type-Safe', lbl: 'Static Typing' },
      { big: 'Open Source', lbl: 'MIT Licensed' }
    ],
    concepts: [
      { icon: '🎯', title: 'What It Is', desc: '{THEME} covers the foundational ideas every C# developer must internalize.' },
      { icon: '⚙️', title: 'How It Works', desc: 'The runtime, compiler, and language features work together to enable {THEME}.' },
      { icon: '🚀', title: 'Why It Matters', desc: 'Modern C# applications rely on {THEME} for correctness, speed, and safety.' },
      { icon: '🌍', title: 'Real-World Use', desc: '{THEME} appears in enterprise apps, cloud services, games, and mobile.' }
    ],
    playground: {
      file: 'CoreConcepts.cs',
      code: `using System;

namespace CoreConcepts
{
    class Program
    {
        static void Main()
        {
            // {THEME} — core concept demo
            Console.WriteLine("Exploring: {THEME}");

            var items = new[] { "Alpha", "Beta", "Gamma" };
            foreach (var item in items)
            {
                Console.WriteLine($"→ {item}");
            }

            int total = 0;
            for (int i = 1; i <= 5; i++) total += i;
            Console.WriteLine($"Sum 1..5 = {total}");
        }
    }
}`
    },
    stepCode: [
      'using System;',
      '',
      'class Program',
      '{',
      '    static void Main()',
      '    {',
      '        Console.WriteLine("Hello, C#");',
      '        int[] numbers = { 1, 2, 3 };',
      '        foreach (var n in numbers)',
      '            Console.WriteLine(n);',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>using System;</code> — import the core .NET namespace.', tags: ['using', 'Namespace'] },
      { line: 2, text: 'Classes are the containers of C# code. Every program lives inside one.', tags: ['Class'] },
      { line: 4, text: '<code>Main()</code> — the entry point invoked by the CLR at startup.', tags: ['Main'] },
      { line: 6, text: '<code>Console.WriteLine()</code> prints to stdout — the classic first step.', tags: ['Output'] },
      { line: 7, text: 'Arrays are fixed-size collections declared with <code>[]</code>.', tags: ['Array'] },
      { line: 8, text: '<code>foreach</code> iterates elements without needing an index.', tags: ['foreach'] },
      { line: 9, text: 'Each iteration prints the current element. Clean, readable loop.', tags: ['Loop'] },
      { line: 11, text: 'Balanced braces close <code>Main()</code> and the class.', tags: ['Block', 'End'] }
    ],
    recap: [
      { title: '{THEME}', text: 'Foundation of many modern .NET features.' },
      { title: 'Runs on .NET', text: 'Managed by the CLR with garbage collection.' },
      { title: 'Type-Safe', text: 'Compile-time verification prevents many bugs.' },
      { title: 'Cross-Platform', text: 'Same code runs on Windows, Linux, and macOS.' }
    ]
  },

  'syntax-and-semantics': {
    icon: '📝',
    title: '{THEME}: Syntax & Semantics',
    titleHtml: '{THEME}: <span class="grad">Syntax & Semantics</span>',
    subtitle: 'How {THEME} is written and what it means — grammar rules, valid forms, and behavior.',
    facts: [
      { big: 'Case-Sensitive', lbl: 'Identifiers' },
      { big: ';', lbl: 'Statement End' },
      { big: '{ }', lbl: 'Blocks' },
      { big: '// ///', lbl: 'Comments' },
      { big: 'PascalCase', lbl: 'Convention' }
    ],
    concepts: [
      { icon: '📐', title: 'Grammar Rules', desc: 'The exact tokens, punctuation, and ordering C# accepts for {THEME}.' },
      { icon: '🎯', title: 'Meaning', desc: 'What the compiler does with {THEME} — semantics define runtime behavior.' },
      { icon: '⚠️', title: 'Common Mistakes', desc: 'Missing semicolons, wrong casing, and ordering issues are frequent.' },
      { icon: '💡', title: 'Idioms', desc: 'The accepted, modern ways to write {THEME} in production code.' }
    ],
    playground: {
      file: 'Syntax.cs',
      code: `using System;

namespace SyntaxDemo
{
    class Program
    {
        static void Main()
        {
            // Single-line comment
            string name = "Alice";
            int age = 30;
            bool isActive = true;

            if (age >= 18 && isActive)
            {
                Console.WriteLine($"{name} is active");
            }

            for (int i = 1; i <= 3; i++)
            {
                Console.WriteLine($"Step {i}");
            }
        }
    }
}`
    },
    stepCode: [
      'using System;',
      '',
      'class Program',
      '{',
      '    static void Main()',
      '    {',
      '        int x = 42;',
      '        string s = "hello";',
      '        if (x > 0)',
      '            Console.WriteLine(s);',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>using</code> imports a namespace — no semicolon inside class body.', tags: ['using'] },
      { line: 6, text: '<code>int x = 42;</code> — declaration must end with <code>;</code>. Missing it = syntax error.', tags: [';', 'Statement'] },
      { line: 7, text: '<code>string s = "hello";</code> — string literals use double quotes.', tags: ['string'] },
      { line: 8, text: '<code>if (x &gt; 0)</code> — condition must be in parentheses, boolean result.', tags: ['if'] },
      { line: 9, text: 'Single statement bodies don\'t need braces — but always use them for clarity.', tags: ['Style'] },
      { line: 11, text: 'Closing braces must balance. Every <code>{</code> needs a <code>}</code>.', tags: ['Block'] }
    ],
    recap: [
      { title: 'Syntax = Grammar', text: 'Rules for how code looks. Compiler enforces strictly.' },
      { title: 'Semantics = Meaning', text: 'What code does at runtime. You verify logically.' },
      { title: 'Semicolons', text: 'Every statement ends with <code>;</code>. Blocks do not.' },
      { title: 'Case Matters', text: '<code>name</code>, <code>Name</code>, <code>NAME</code> are three different identifiers.' }
    ]
  },

  'common-api-and-usage': {
    icon: '📚',
    title: '{THEME}: Common API & Usage',
    titleHtml: '{THEME}: <span class="grad">Common API & Usage</span>',
    subtitle: 'The most-used classes, methods, and patterns in {THEME} — with practical examples.',
    facts: [
      { big: 'BCL', lbl: 'Base Class Library' },
      { big: '300K+', lbl: 'NuGet Packages' },
      { big: 'Task<T>', lbl: 'Async Result' },
      { big: 'LINQ', lbl: 'Query Syntax' },
      { big: 'IDisposable', lbl: 'Cleanup Pattern' }
    ],
    concepts: [
      { icon: '🔧', title: 'Core APIs', desc: 'The standard classes you call most often when working with {THEME}.' },
      { icon: '📦', title: 'Namespaces', desc: '<code>System</code>, <code>System.IO</code>, <code>System.Linq</code>, <code>System.Collections.Generic</code>.' },
      { icon: '🔁', title: 'Common Patterns', desc: 'Using statements, try/catch, LINQ queries, and async/await.' },
      { icon: '🎯', title: 'When to Use', desc: 'Choosing between similar APIs — performance, safety, readability.' }
    ],
    playground: {
      file: 'ApiDemo.cs',
      code: `using System;
using System.Collections.Generic;
using System.Linq;

namespace ApiDemo
{
    class Program
    {
        static void Main()
        {
            var numbers = new List<int> { 5, 2, 8, 1, 9, 3 };

            // LINQ — filter, sort, project
            var even = numbers.Where(n => n % 2 == 0).ToList();
            Console.WriteLine($"Even: {string.Join(", ", even)}");

            var sorted = numbers.OrderBy(n => n);
            Console.WriteLine($"Sorted: {string.Join(", ", sorted)}");

            int sum = numbers.Sum();
            int max = numbers.Max();
            Console.WriteLine($"Sum = {sum}, Max = {max}");
        }
    }
}`
    },
    stepCode: [
      'using System;',
      'using System.Collections.Generic;',
      'using System.Linq;',
      '',
      'class Program',
      '{',
      '    static void Main()',
      '    {',
      '        var list = new List<int> { 3, 1, 4 };',
      '        var sorted = list.OrderBy(x => x);',
      '        Console.WriteLine(string.Join(",", sorted));',
      '    }',
      '}'
    ],
    steps: [
      { line: 1, text: '<code>System.Collections.Generic</code> — where <code>List&lt;T&gt;</code> lives.', tags: ['Generic'] },
      { line: 2, text: '<code>System.Linq</code> — extension methods for querying collections.', tags: ['LINQ'] },
      { line: 8, text: 'Collection initializers let you populate a <code>List&lt;T&gt;</code> in one line.', tags: ['List'] },
      { line: 9, text: '<code>OrderBy()</code> — LINQ\'s way to sort. Uses lambdas.', tags: ['Lambda', 'Sort'] },
      { line: 10, text: '<code>string.Join()</code> combines elements into a single string.', tags: ['Join'] }
    ],
    recap: [
      { title: 'BCL is Rich', text: 'The .NET Base Class Library has a class for almost everything.' },
      { title: 'LINQ = Power', text: 'Query any collection in one line.' },
      { title: 'List<T>', text: 'The go-to resizable collection.' },
      { title: 'NuGet', text: 'Over 300,000 third-party packages are one command away.' }
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
      { big: 'Modern', lbl: 'C# 12 Syntax' },
      { big: 'Tested', lbl: 'Patterns' }
    ],
    concepts: [
      { icon: '🎯', title: 'Real Scenario', desc: 'Common tasks developers actually perform with {THEME}.' },
      { icon: '🔧', title: 'Complete Code', desc: 'Every example compiles and runs — no pseudocode.' },
      { icon: '🧩', title: 'Pattern', desc: 'The reusable shape you can adapt to your own problem.' },
      { icon: '⚡', title: 'Output', desc: 'What running the code produces — verified.' }
    ],
    playground: {
      file: 'Practical.cs',
      code: `using System;
using System.Collections.Generic;
using System.Linq;

namespace Practical
{
    class Program
    {
        static void Main()
        {
            // Example: Group people by age range
            var people = new List<(string Name, int Age)>
            {
                ("Alice", 25), ("Bob", 32), ("Carol", 19),
                ("Dave", 45), ("Eve", 28)
            };

            var groups = people
                .GroupBy(p => p.Age < 30 ? "Young" : "Experienced");

            foreach (var group in groups)
            {
                Console.WriteLine($"{group.Key}: {group.Count()} people");
                foreach (var p in group)
                    Console.WriteLine($"  - {p.Name} ({p.Age})");
            }
        }
    }
}`
    },
    stepCode: [
      'var people = new[]',
      '{',
      '    ("Alice", 25),',
      '    ("Bob", 32),',
      '    ("Carol", 19)',
      '};',
      '',
      'var groups = people',
      '    .GroupBy(p => p.Age < 30 ? "Young" : "Senior");',
      '',
      'foreach (var g in groups)',
      '    Console.WriteLine(g.Key);'
    ],
    steps: [
      { line: 0, text: 'Tuple arrays — lightweight multi-value records.', tags: ['Tuple'] },
      { line: 3, text: 'Each tuple holds a name and age — no class needed.', tags: ['Tuple'] },
      { line: 8, text: '<code>GroupBy()</code> — LINQ operator that buckets elements.', tags: ['LINQ', 'Group'] },
      { line: 9, text: 'Lambda expression uses conditional (<code>?:</code>) to categorize.', tags: ['Lambda'] },
      { line: 11, text: '<code>foreach</code> over grouped results — each group has a <code>Key</code>.', tags: ['Group'] }
    ],
    recap: [
      { title: 'Tuples', text: 'Lightweight way to group values without a class.' },
      { title: 'GroupBy', text: 'LINQ splits a collection into categories.' },
      { title: 'Lambda + LINQ', text: 'Combine them for expressive one-liners.' },
      { title: 'Real Data', text: 'The pattern you see here scales to enterprise code.' }
    ]
  },

  'advanced-techniques': {
    icon: '🚀',
    title: '{THEME}: Advanced Techniques',
    titleHtml: '{THEME}: <span class="grad">Advanced Techniques</span>',
    subtitle: 'Powerful patterns and less-known features of {THEME} used by senior developers.',
    facts: [
      { big: 'Span<T>', lbl: 'Zero-Copy' },
      { big: 'Expression Trees', lbl: 'Meta' },
      { big: 'Ref Structs', lbl: 'Stack Only' },
      { big: 'Source Gen', lbl: 'Compile-Time' },
      { big: 'AOT', lbl: 'Native Compile' }
    ],
    concepts: [
      { icon: '⚡', title: 'Performance', desc: 'Advanced {THEME} techniques often target memory and speed.' },
      { icon: '🧬', title: 'Meta-Programming', desc: 'Reflection, expression trees, source generators.' },
      { icon: '🎯', title: 'Precision', desc: 'Fine-grained control over runtime behavior.' },
      { icon: '⚠️', title: 'Trade-offs', desc: 'When advanced techniques pay off — and when they hurt.' }
    ],
    playground: {
      file: 'Advanced.cs',
      code: `using System;
using System.Collections.Generic;

namespace Advanced
{
    class Program
    {
        static void Main()
        {
            // Span<T> — stack-allocated slice, zero-copy
            ReadOnlySpan<char> text = "Hello, C#!".AsSpan();
            ReadOnlySpan<char> slice = text.Slice(7, 2);
            Console.WriteLine($"Slice: {slice.ToString()}");

            // Pattern matching with switch expression
            foreach (var value in new object[] { 42, "hi", 3.14, true })
            {
                string result = value switch
                {
                    int i => $"int: {i}",
                    string s => $"string: {s}",
                    double d => $"double: {d}",
                    _ => "unknown"
                };
                Console.WriteLine(result);
            }
        }
    }
}`
    },
    stepCode: [
      'ReadOnlySpan<char> span = "hello".AsSpan();',
      '',
      'object value = 42;',
      'string result = value switch',
      '{',
      '    int i => $"int {i}",',
      '    string s => $"str {s}",',
      '    _ => "other"',
      '};',
      'Console.WriteLine(result);'
    ],
    steps: [
      { line: 0, text: '<code>Span&lt;T&gt;</code> — a stack-allocated view over memory. Zero-copy slicing.', tags: ['Span'] },
      { line: 3, text: 'Switch <strong>expressions</strong> return a value — unlike traditional switch statements.', tags: ['Pattern'] },
      { line: 5, text: 'Type pattern: <code>int i</code> matches and binds an <code>int</code>.', tags: ['Pattern'] },
      { line: 7, text: '<code>_</code> is the discard pattern — matches anything unmatched above.', tags: ['Discard'] },
      { line: 9, text: 'Result is computed and printed. Concise, safe, expressive.', tags: ['Output'] }
    ],
    recap: [
      { title: 'Span<T>', text: 'High-performance memory slices with no allocations.' },
      { title: 'Switch Expressions', text: 'Return values from pattern matching directly.' },
      { title: 'Patterns', text: 'Type, constant, relational, and property patterns.' },
      { title: 'Trade-offs', text: 'Advanced features cost compile time and clarity — use wisely.' }
    ]
  },

  'best-practices': {
    icon: '⭐',
    title: '{THEME}: Best Practices',
    titleHtml: '{THEME}: <span class="grad">Best Practices</span>',
    subtitle: 'The conventions, patterns, and habits that separate professional {THEME} code from amateur code.',
    facts: [
      { big: 'Microsoft', lbl: 'Guidelines' },
      { big: 'SOLID', lbl: 'Principles' },
      { big: 'DRY', lbl: 'No Duplication' },
      { big: 'KISS', lbl: 'Keep Simple' },
      { big: 'YAGNI', lbl: 'No Speculation' }
    ],
    concepts: [
      { icon: '📏', title: 'Coding Standards', desc: 'Microsoft\'s official C# conventions for naming, layout, and structure.' },
      { icon: '🎯', title: 'Clarity First', desc: 'Readable code beats clever code. Every time.' },
      { icon: '🔒', title: 'Safety', desc: 'Null checks, input validation, and defensive coding.' },
      { icon: '🧪', title: 'Testability', desc: 'Write code that is easy to unit test — small, pure, focused.' }
    ],
    playground: {
      file: 'BestPractices.cs',
      code: `using System;
using System.Collections.Generic;

namespace BestPractices
{
    // DO: Use PascalCase for classes and methods
    public class OrderProcessor
    {
        private readonly List<string> _items = new();

        // DO: Validate inputs
        public void AddItem(string item)
        {
            if (string.IsNullOrWhiteSpace(item))
                throw new ArgumentException("Item cannot be empty", nameof(item));

            _items.Add(item);
        }

        public int GetItemCount() => _items.Count;

        // DO: Return clear, documented results
        public override string ToString()
            => $"OrderProcessor with {_items.Count} items";
    }

    class Program
    {
        static void Main()
        {
            var processor = new OrderProcessor();
            processor.AddItem("Laptop");
            processor.AddItem("Mouse");
            Console.WriteLine(processor);
        }
    }
}`
    },
    stepCode: [
      'public class OrderProcessor',
      '{',
      '    private readonly List<string> _items = new();',
      '',
      '    public void AddItem(string item)',
      '    {',
      '        if (string.IsNullOrWhiteSpace(item))',
      '            throw new ArgumentException(nameof(item));',
      '        _items.Add(item);',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: 'Class names use <strong>PascalCase</strong> — Microsoft convention.', tags: ['Naming'] },
      { line: 2, text: 'Private fields use <code>_camelCase</code> with underscore prefix.', tags: ['Field'] },
      { line: 4, text: 'Methods are <strong>PascalCase</strong>, parameters <code>camelCase</code>.', tags: ['Method'] },
      { line: 7, text: 'Validate inputs early — throw clear exceptions with <code>nameof</code>.', tags: ['Validation'] },
      { line: 8, text: 'Immutable where possible. <code>readonly</code> prevents reassignment.', tags: ['Immutable'] }
    ],
    recap: [
      { title: 'PascalCase', text: 'Classes, methods, properties, events.' },
      { title: 'camelCase', text: 'Local variables and parameters.' },
      { title: '_underscore', text: 'Private fields follow this convention.' },
      { title: 'Validate', text: 'Check inputs. Throw ArgumentException with nameof.' }
    ]
  },

  'testing-and-validation': {
    icon: '🧪',
    title: '{THEME}: Testing & Validation',
    titleHtml: '{THEME}: <span class="grad">Testing & Validation</span>',
    subtitle: 'How to verify {THEME} works — unit tests, edge cases, and quality gates.',
    facts: [
      { big: 'xUnit', lbl: 'Test Framework' },
      { big: 'NUnit', lbl: 'Alternative' },
      { big: 'MSTest', lbl: 'Microsoft' },
      { big: 'Moq', lbl: 'Mocking' },
      { big: 'TDD', lbl: 'Methodology' }
    ],
    concepts: [
      { icon: '✅', title: 'Unit Tests', desc: 'Small, focused tests for one behavior of {THEME}.' },
      { icon: '🎯', title: 'Edge Cases', desc: 'Null, empty, boundary values — where bugs hide.' },
      { icon: '🔁', title: 'Arrange-Act-Assert', desc: 'The classic pattern for structuring every test.' },
      { icon: '📊', title: 'Coverage', desc: 'What percentage of your {THEME} code is exercised by tests.' }
    ],
    playground: {
      file: 'Tests.cs',
      code: `using System;

namespace TestingDemo
{
    // The code under test
    public static class Calculator
    {
        public static int Add(int a, int b) => a + b;
        public static int Divide(int a, int b)
        {
            if (b == 0) throw new DivideByZeroException();
            return a / b;
        }
    }

    // A simple test runner (in production you'd use xUnit)
    class Program
    {
        static void Main()
        {
            Assert(Calculator.Add(2, 3) == 5, "Add works");
            Assert(Calculator.Add(-1, 1) == 0, "Add negatives");
            Assert(Calculator.Divide(10, 2) == 5, "Divide works");

            bool threw = false;
            try { Calculator.Divide(5, 0); }
            catch (DivideByZeroException) { threw = true; }
            Assert(threw, "Divide by zero throws");

            Console.WriteLine("All tests passed!");
        }

        static void Assert(bool condition, string name)
        {
            Console.WriteLine((condition ? "PASS" : "FAIL") + ": " + name);
            if (!condition) throw new Exception("Test failed: " + name);
        }
    }
}`
    },
    stepCode: [
      'public static int Add(int a, int b) => a + b;',
      '',
      'Assert(Calculator.Add(2, 3) == 5, "Add works");',
      'Assert(Calculator.Add(-1, 1) == 0, "Add negatives");',
      '',
      'bool threw = false;',
      'try { Calculator.Divide(5, 0); }',
      'catch (DivideByZeroException) { threw = true; }',
      'Assert(threw, "Divide by zero throws");'
    ],
    steps: [
      { line: 0, text: 'Expression-bodied methods keep simple logic clean and concise.', tags: ['Syntax'] },
      { line: 2, text: 'First test — verifies <code>Add(2, 3)</code> returns 5.', tags: ['Test'] },
      { line: 3, text: 'Second test — boundary case with negative numbers.', tags: ['Edge'] },
      { line: 5, text: 'Testing exceptions requires a try/catch pattern.', tags: ['Exception'] },
      { line: 8, text: 'Assert that the exception <em>was</em> thrown — this is a valid test.', tags: ['Assert'] }
    ],
    recap: [
      { title: 'Test Early', text: 'Write tests alongside the code — not after.' },
      { title: 'Edge Cases', text: 'Null, empty, boundaries, and errors.' },
      { title: 'AAA', text: 'Arrange, Act, Assert — structure every test.' },
      { title: 'Frameworks', text: 'xUnit is the modern default in .NET.' }
    ]
  },

  'performance-and-optimization': {
    icon: '⚡',
    title: '{THEME}: Performance & Optimization',
    titleHtml: '{THEME}: <span class="grad">Performance & Optimization</span>',
    subtitle: 'How to make {THEME} fast — profiling, allocation reduction, and hot-path tuning.',
    facts: [
      { big: 'BenchmarkDotNet', lbl: 'Micro-Bench' },
      { big: 'Span<T>', lbl: 'Zero Alloc' },
      { big: 'ArrayPool<T>', lbl: 'Reuse Buffers' },
      { big: 'AOT', lbl: 'Native' },
      { big: 'SIMD', lbl: 'Vectorized' }
    ],
    concepts: [
      { icon: '📊', title: 'Measure First', desc: 'Never optimize by guessing — profile with real data.' },
      { icon: '🔥', title: 'Hot Paths', desc: 'Find the 10% of code that consumes 90% of time.' },
      { icon: '🧠', title: 'Allocations', desc: 'Reduce GC pressure by minimizing heap allocations.' },
      { icon: '⚙️', title: 'Trade-offs', desc: 'Faster code often costs readability — measure the win.' }
    ],
    playground: {
      file: 'Performance.cs',
      code: `using System;
using System.Diagnostics;
using System.Text;

namespace Performance
{
    class Program
    {
        static void Main()
        {
            const int N = 100_000;
            var sw = Stopwatch.StartNew();

            // Slow: repeated string concatenation
            string slow = "";
            for (int i = 0; i < N; i++) slow += "x";
            sw.Stop();
            Console.WriteLine($"String += : {sw.ElapsedMilliseconds}ms");

            // Fast: StringBuilder
            sw.Restart();
            var sb = new StringBuilder();
            for (int i = 0; i < N; i++) sb.Append('x');
            string fast = sb.ToString();
            sw.Stop();
            Console.WriteLine($"StringBuilder: {sw.ElapsedMilliseconds}ms");

            Console.WriteLine($"Same length: {slow.Length == fast.Length}");
        }
    }
}`
    },
    stepCode: [
      'const int N = 100_000;',
      'var sw = Stopwatch.StartNew();',
      '',
      'string slow = "";',
      'for (int i = 0; i < N; i++) slow += "x";',
      'sw.Stop();',
      '',
      'sw.Restart();',
      'var sb = new StringBuilder();',
      'for (int i = 0; i < N; i++) sb.Append(\'x\');',
      'sw.Stop();'
    ],
    steps: [
      { line: 1, text: '<code>Stopwatch</code> — the standard way to measure elapsed time in .NET.', tags: ['Timing'] },
      { line: 4, text: '<code>+=</code> on strings creates a NEW string every iteration — O(N²).', tags: ['Anti-Pattern'] },
      { line: 7, text: '<code>Restart()</code> resets the stopwatch for the next measurement.', tags: ['Timing'] },
      { line: 9, text: '<code>StringBuilder</code> appends in-place, O(N) instead of O(N²).', tags: ['Optimization'] },
      { line: 10, text: 'Same result — but 100x+ faster with large strings.', tags: ['Result'] }
    ],
    recap: [
      { title: 'Measure', text: 'Never optimize without profiling data.' },
      { title: 'StringBuilder', text: 'Use for loop concatenation — never <code>+=</code>.' },
      { title: 'Reduce Alloc', text: 'Reuse buffers, use Span<T>, pool arrays.' },
      { title: 'BenchmarkDotNet', text: 'Standard tool for micro-benchmarks.' }
    ]
  },

  'security-and-reliability': {
    icon: '🛡️',
    title: '{THEME}: Security & Reliability',
    titleHtml: '{THEME}: <span class="grad">Security & Reliability</span>',
    subtitle: 'Writing {THEME} that is safe, defensive, and resilient against attacks and failures.',
    facts: [
      { big: 'OWASP', lbl: 'Guidelines' },
      { big: 'Null-Safe', lbl: 'Defensive' },
      { big: 'Encryption', lbl: 'At Rest' },
      { big: 'HTTPS', lbl: 'In Transit' },
      { big: 'Validate', lbl: 'All Inputs' }
    ],
    concepts: [
      { icon: '🔒', title: 'Input Validation', desc: 'Never trust input. Validate everything from outside {THEME}.' },
      { icon: '🛡️', title: 'Defense in Depth', desc: 'Multiple layers — one failure should never be catastrophic.' },
      { icon: '⚠️', title: 'Common Attacks', desc: 'Injection, XSS, CSRF, and how .NET helps prevent them.' },
      { icon: '🔁', title: 'Fail Safe', desc: 'When errors happen, fail to a safe state — never crash silently.' }
    ],
    playground: {
      file: 'Security.cs',
      code: `using System;
using System.Text.RegularExpressions;

namespace Security
{
    class Program
    {
        static void Main()
        {
            // BAD: Direct string interpolation into SQL (never do this)
            string userInput = "'; DROP TABLE users; --";
            string badQuery = $"SELECT * FROM users WHERE name = '{userInput}'";
            Console.WriteLine("UNSAFE: " + badQuery);

            // GOOD: Validate and sanitize input
            string clean = Regex.Replace(userInput, @"[^a-zA-Z0-9 ]", "");
            Console.WriteLine("CLEAN:  " + clean);

            // GOOD: Use parameterized queries (concept)
            Console.WriteLine("SAFE:   Use SqlParameter for real queries");
        }
    }
}`
    },
    stepCode: [
      'string userInput = "\'; DROP TABLE users; --";',
      '',
      'string badQuery = $"SELECT * FROM users WHERE name = \'{userInput}\'";',
      '// ↑ NEVER do this — SQL injection!',
      '',
      'string clean = Regex.Replace(userInput, @"[^a-zA-Z0-9 ]", "");',
      '// ↑ Sanitize by removing non-alphanumeric characters',
      '',
      '// Real fix: use parameterized queries'
    ],
    steps: [
      { line: 0, text: 'Malicious user input can contain SQL injection payloads.', tags: ['Threat'] },
      { line: 2, text: '<strong>Never</strong> concatenate user input into SQL. This is the #1 security flaw.', tags: ['SQL Injection'] },
      { line: 5, text: 'Sanitization removes dangerous characters — one layer of defense.', tags: ['Validation'] },
      { line: 8, text: 'The real fix is <strong>parameterized queries</strong> — user input is never treated as SQL.', tags: ['Fix'] }
    ],
    recap: [
      { title: 'Never Trust Input', text: 'All data from outside is suspect.' },
      { title: 'Parameterize SQL', text: 'Use <code>SqlParameter</code> — not string concatenation.' },
      { title: 'Sanitize', text: 'Regex and allowlists for known-safe characters.' },
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
      { icon: '🎤', title: 'Interview Qs', desc: 'The questions asked in C# job interviews about {THEME}.' },
      { icon: '✅', title: 'Best Answers', desc: 'Clear, correct responses that impress interviewers.' }
    ],
    playground: {
      file: 'Troubleshoot.cs',
      code: `using System;

namespace Troubleshooting
{
    class Program
    {
        static void Main()
        {
            // Common error: NullReferenceException
            try
            {
                string s = null;
                Console.WriteLine(s.Length); // CRASH
            }
            catch (NullReferenceException ex)
            {
                Console.WriteLine("Caught: " + ex.GetType().Name);
                Console.WriteLine("Fix: use s?.Length or null check");
            }

            // Common error: IndexOutOfRange
            try
            {
                int[] arr = { 1, 2, 3 };
                Console.WriteLine(arr[5]); // CRASH
            }
            catch (IndexOutOfRangeException)
            {
                Console.WriteLine("Fix: check arr.Length before indexing");
            }

            Console.WriteLine("Program survived both errors");
        }
    }
}`
    },
    stepCode: [
      'string s = null;',
      'Console.WriteLine(s.Length);  // 💥 NullReferenceException',
      '',
      'int[] arr = { 1, 2, 3 };',
      'Console.WriteLine(arr[5]);    // 💥 IndexOutOfRangeException',
      '',
      '// Fixes:',
      '// s?.Length ?? 0',
      '// if (i < arr.Length) ...'
    ],
    steps: [
      { line: 0, text: 'Declaring a string without assigning gives <code>null</code>.', tags: ['Null'] },
      { line: 1, text: 'Calling <code>.Length</code> on null throws <strong>NullReferenceException</strong> — the #1 C# bug.', tags: ['NRE'] },
      { line: 3, text: 'Arrays are zero-indexed. Size 3 means valid indexes are 0, 1, 2.', tags: ['Array'] },
      { line: 4, text: 'Accessing <code>arr[5]</code> throws <strong>IndexOutOfRangeException</strong>.', tags: ['Range'] },
      { line: 7, text: 'Null-conditional <code>?.</code> returns null instead of crashing.', tags: ['Fix'] }
    ],
    recap: [
      { title: 'NullRef #1', text: 'The most common C# bug. Use <code>?.</code> and <code>??</code>.' },
      { title: 'Range Checks', text: 'Always validate indexes against <code>Length</code>.' },
      { title: 'Read Stack Traces', text: 'They tell you exactly where the error occurred.' },
      { title: 'Defensive Code', text: 'Wrap risky operations in try/catch when appropriate.' }
    ]
  }
};

/* ============================================================
   THEME OVERRIDES — subtitle tweaks per theme
   ============================================================ */
const THEME_OVERRIDES = {
  'c-sharp-language-fundamentals': 'the core of the C# language',
  'c-sharp-version-evolution': 'how C# has evolved from 1.0 to 12',
  'net-sdk-and-cli': 'the modern .NET SDK and its command-line tools',
  'object-oriented-programming': 'classes, inheritance, polymorphism, and abstraction',
  'generics-and-collections': 'type-safe containers and generic algorithms',
  'linq-and-queries': 'querying data in a declarative style',
  'async-and-concurrency': 'asynchronous and parallel execution in .NET',
  'memory-management': 'how the CLR allocates, tracks, and frees memory',
  'file-and-io': 'reading, writing, and manipulating files',
  'serialization': 'converting objects to and from formats',
  'networking': 'HTTP, sockets, and distributed communication',
  'asp-net-core': 'building modern web applications',
  'entity-framework-core': 'the modern ORM for .NET',
  'web-api': 'building RESTful HTTP services',
  'blazor': 'full-stack web development with C#',
  'desktop-apps': 'WPF, WinForms, and WinUI applications',
  'unity-and-games': 'C# for Unity and game development',
  'cloud-and-azure': 'cloud-native development on Azure',
  'testing': 'unit, integration, and end-to-end testing',
  'design-patterns': 'reusable solutions to common problems',
  'microservices': 'distributed systems and service architecture',
  'performance-engineering': 'profiling, benchmarking, and optimization',
  'security': 'building safe and secure applications',
  'devops-and-ci-cd': 'automation and continuous delivery',
  'advanced-c-sharp': 'advanced language features and patterns',
  'interview-preparation': 'preparing for C# developer interviews',
  'real-world-projects': 'building production-ready applications'
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
    'common-api-and-usage',
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
   GENERATE TOPIC DATA
   ============================================================ */
function buildTopic(folderName) {
  const parsed = parseFolder(folderName);
  if (!parsed) return null;

  const { num, theme, category } = parsed;
  const catTemplate = CATEGORIES[category] || CATEGORIES['core-concepts'];
  const themeTitle = THEME_TITLES[theme] || theme.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const themeContext = THEME_OVERRIDES[theme] || themeTitle;

  const substitute = (s) => s
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
function renderHTML(topic) {
  const factsHtml = topic.facts.map(f =>
    `<div class="fact"><div class="big">${escapeHtml(f.big)}</div><div class="lbl">${escapeHtml(f.lbl)}</div></div>`
  ).join('');

  const conceptsHtml = topic.concepts.map((c, i) => {
    const colors = ['#7c3aed,#a78bfa', '#0891b2,#22d3ee', '#f59e0b,#fbbf24', '#ec4899,#f472b6'];
    const [c1, c2] = colors[i % colors.length].split(',');
    return `<div class="concept" style="--c1:${c1};--c2:${c2}">
      <div class="c-ico">${c.icon}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${c.desc}</p>
    </div>`;
  }).join('');

  const recapHtml = topic.recap.map((r, i) => {
    const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#22c55e'];
    return `<div class="recap" style="--rc:${colors[i % colors.length]}">
      <div class="t">${escapeHtml(r.title)}</div>
      <div class="d">${r.text}</div>
    </div>`;
  }).join('');

  const stepCodeHtml = topic.stepCode.map((l, i) =>
    `<div class="step-line" data-line="${i}">${escapeHtml(l) || ' '}</div>`
  ).join('');

  const stepCount = topic.steps.length;
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
.space-base{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#1a1035 0%,#0a0a20 45%,#05060f 85%),radial-gradient(ellipse at 0% 100%,#130a22 0%,transparent 55%)}
.orbs{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:.45}
.orb{position:absolute;border-radius:50%;filter:blur(90px)}
.orb-1{width:520px;height:520px;top:-10%;left:-8%;background:radial-gradient(circle,#7c3aed,transparent 70%);animation:d1 26s ease-in-out infinite}
.orb-2{width:460px;height:460px;top:45%;right:-10%;background:radial-gradient(circle,#0891b2,transparent 70%);animation:d2 30s ease-in-out infinite}
.orb-3{width:600px;height:600px;bottom:-18%;left:18%;background:radial-gradient(circle,#9333ea,transparent 70%);animation:d3 34s ease-in-out infinite}
@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,40px) scale(1.15)}}
@keyframes d2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.2)}}
@keyframes d3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-60px) scale(1.1)}}
.grid-bg{position:fixed;inset:-50%;z-index:2;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(139,92,246,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.14) 1px,transparent 1px);background-size:80px 80px;transform:perspective(500px) rotateX(60deg);animation:gf 22s linear infinite;mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%)}
@keyframes gf{from{background-position:0 0}to{background-position:0 80px}}
.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.72) 100%)}
.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}
.container{max-width:1150px;margin:0 auto;padding:0 1.5rem;width:100%}
nav{position:sticky;top:0;z-index:100;background:rgba(5,6,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(148,163,184,.08)}
.nav-inner{max-width:1150px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1rem;color:#f1f5f9;text-decoration:none}
.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#06b6d4);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.8rem;color:#fff;box-shadow:0 8px 20px -6px rgba(124,58,237,.6)}
.hero{padding:4.5rem 1.5rem 3rem;text-align:center}
.tpill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.35);border-radius:999px;padding:.45rem 1.1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c4b5fd;margin-bottom:1.5rem}
.tpill .n{background:#7c3aed;color:#fff;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900}
.hero h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:900;letter-spacing:-.04em;line-height:1.15;margin-bottom:1.2rem}
.hero h1 .grad{background:linear-gradient(135deg,#a78bfa 0%,#7c3aed 45%,#06b6d4 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gs 7s ease-in-out infinite}
@keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.hero p{color:#a1a1aa;font-size:1.05rem;max-width:660px;margin:0 auto;line-height:1.7}
section{padding:3rem 0}
.sec-head{text-align:center;margin-bottom:2.5rem}
.stag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.3);border-radius:999px;padding:.4rem 1rem;font-size:.68rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c4b5fd;margin-bottom:1rem}
.sec-head h2{font-size:clamp(1.6rem,3.8vw,2.3rem);font-weight:900;letter-spacing:-.03em;line-height:1.15;margin-bottom:.6rem}
.sec-head h2 .grad{background:linear-gradient(135deg,#a78bfa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sec-head p{color:#94a3b8;font-size:.95rem;max-width:620px;margin:0 auto}
.facts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:2rem}
.fact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:1.05rem 1rem;text-align:center;transition:all .25s}
.fact:hover{transform:translateY(-3px);border-color:rgba(124,58,237,.4)}
.fact .big{font-size:1.05rem;font-weight:900;background:linear-gradient(135deg,#a78bfa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}
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
.step-btn{background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3);color:#c4b5fd;border-radius:8px;padding:.35rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.step-btn:hover:not(:disabled){background:rgba(124,58,237,.3)}
.step-btn:disabled{opacity:.35;cursor:not-allowed}
.step-body{display:grid;grid-template-columns:1.2fr 1fr}
@media(max-width:800px){.step-body{grid-template-columns:1fr}}
.step-code{padding:1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1);overflow-x:auto}
@media(max-width:800px){.step-code{border-right:none;border-bottom:1px solid rgba(148,163,184,.1)}}
.step-line{padding:.15rem .5rem;border-radius:5px;transition:background .3s;white-space:pre}
.step-line.active{background:rgba(124,58,237,.18);box-shadow:inset 3px 0 0 #7c3aed;color:#fff}
.step-info{padding:1.1rem 1.3rem;background:rgba(30,41,59,.4)}
.explain{font-size:.85rem;color:#cbd5e1;min-height:4rem;margin-bottom:.9rem;line-height:1.6}
.explain code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.82em}
.tag-list{display:flex;flex-wrap:wrap;gap:.35rem}
.tag{background:rgba(167,139,250,.15);border:1px solid rgba(167,139,250,.3);color:#d2a8ff;border-radius:6px;padding:.25rem .65rem;font-size:.7rem;font-family:'JetBrains Mono',monospace;font-weight:600}
.step-progress{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}
.bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}
.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#7c3aed,#06b6d4);border-radius:999px;transition:width .35s}
.count{font-size:.72rem;color:#64748b;font-family:'JetBrains Mono',monospace;min-width:3.5rem;text-align:right}
.recap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.9rem;margin-top:1.2rem}
.recap{background:rgba(30,41,59,.6);border-radius:14px;padding:1.1rem 1.2rem;border-left:3px solid var(--rc,#7c3aed)}
.recap .t{font-size:.72rem;font-weight:800;color:var(--rc,#7c3aed);text-transform:uppercase;letter-spacing:.08em}
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
      <a href="#" class="brand"><div class="brand-mark">C#</div> C# Series</a>
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
          <div class="count" id="stepCount">0 / ${stepCount}</div>
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
    <p>📘 ${escapeHtml(topic.title)} · C# Series · Built for learners</p>
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
function stripComments(c){return c.replace(/\\/\\/.*$/gm,'').replace(/\\/\\*[\\s\\S]*?\\*\\//g,'')}
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
  let clean=stripComments(code).replace(/using\\s+[\\w.]+;/g,'');
  const mm=clean.match(/static\\s+void\\s+Main\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)\\n\\s*\\}\\s*\\}/);
  if(!mm)return{output:[],error:'No static void Main() found'};
  const body=mm[1];
  function evalE(expr){
    expr=expr.trim();
    let sm=expr.match(/^"(.*)"$/);if(sm)return sm[1].replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t');
    let im=expr.match(/^\\$"(.*)"$/);
    if(im)return im[1].replace(/\\{(\\w+)\\}/g,(m,n)=>vars[n]!==undefined?vars[n]:'{'+n+'}');
    if(/^-?\\d+$/.test(expr))return parseInt(expr,10);
    if(/^-?\\d+\\.\\d+$/.test(expr))return parseFloat(expr);
    if(expr==='true')return true;
    if(expr==='false')return false;
    if(vars[expr]!==undefined)return vars[expr];
    let r=expr;
    Object.keys(vars).sort((a,b)=>b.length-a.length).forEach(n=>{
      r=r.replace(new RegExp('\\\\b'+n+'\\\\b','g'),'('+(typeof vars[n]==='string'?JSON.stringify(vars[n]):vars[n])+')');
    });
    try{return Function('"use strict";return('+r+')')()}catch{return 0}
  }
  function exec(list){
    for(const st of list){
      const s=st.trim();if(!s||s==='{'||s==='}')continue;
      let w=s.match(/^Console\\.WriteLine\\s*\\(([\\s\\S]+)\\)$/);
      if(w){output.push(String(evalE(w[1])));continue}
      let d=s.match(/^(int|string|bool|double|long|float|var|object)\\s+(\\w+)\\s*=\\s*([\\s\\S]+)$/);
      if(d){vars[d[2]]=evalE(d[3]);continue}
      let dn=s.match(/^(int|string|bool|double|long|float|object)\\s+(\\w+)$/);
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

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   MAIN BUILD
   ============================================================ */
const folders = fs.readdirSync(ROOT)
  .filter(f => /^\d{4}-/.test(f) && fs.statSync(path.join(ROOT, f)).isDirectory())
  .sort();

console.log(`\n📁 Found ${folders.length} topic folders.\n`);

let generated = 0, skipped = 0, failed = 0;

for(const folder of folders){
  // From filter
  if(FROM){
    const n = folder.match(/^(\d+)/)[1];
    if(n < FROM) { continue; }
  }

  const outPath = path.join(ROOT, folder, 'index.html');

  // Skip if exists unless --force
    // Skip only if the file contains our real template marker
  if(fs.existsSync(outPath) && !FORCE){
    const existing = fs.readFileSync(outPath, 'utf8');
    // Real template pages contain these markers
    const hasRealContent =
      existing.includes('class="step-viz"') &&
      existing.includes('class="step-line"') &&
      existing.includes('class="concept"') &&
      existing.includes('class="facts-row"');

    // Real pages also DON'T contain the placeholder text
    const isPlaceholder =
      existing.includes('XTutiRaiseUp') ||
      existing.includes('ready for complete documentation') ||
      existing.includes('This is topic') && existing.includes('learning roadmap');

    if(hasRealContent && !isPlaceholder){
      skipped++;
      continue;
    }
    // Otherwise → fall through and regenerate
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
console.log(`   Skipped (already existed): ${skipped}`);
console.log(`   Failed:    ${failed}`);
console.log(`\n💡 Run with --force to regenerate everything.`);
console.log(`💡 Run with --from 0050 to build from topic 0050 onward.\n`);