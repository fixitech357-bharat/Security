/* ============================================================
   .NET Topic Generator — one command fills all folders
   Usage:
     node _build.js              # generate missing/placeholder only
     node _build.js --force      # regenerate all
     node _build.js --from 050   # from topic 050 onwards
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const FROM = (() => { const i = args.indexOf('--from'); return i >= 0 ? args[i+1] : null; })();

/* ============================================================
   CATEGORY DETECTION — based on keywords in the theme
   ============================================================ */
function detectCategory(theme) {
  const t = theme.toLowerCase();

  if (/(history|evolution|origin|version|release)/.test(t)) return 'history';
  if (/(architecture|structure|design|host|hosting|runtime)/.test(t)) return 'architecture';
  if (/(sdk|cli|tool|build|publish|msbuild|dotnet-cli|project|solution|nuget|package)/.test(t)) return 'tooling';
  if (/(clr|cts|cls|il|cil|jit|gc|memory|metadata|assembly|assemblies|reflection|appdomain)/.test(t)) return 'internals';
  if (/(async|thread|task|concurrency|parallel|reactive|channel)/.test(t)) return 'async';
  if (/(security|auth|identity|crypto|hashing|encryption)/.test(t)) return 'security';
  if (/(test|testing|xunit|nunit|benchmark|quality)/.test(t)) return 'testing';
  if (/(performance|optimization|benchmark|profiling|aot|trimming)/.test(t)) return 'performance';
  if (/(asp|web|api|blazor|mvc|razor|signalr|grpc|minimal)/.test(t)) return 'web';
  if (/(ef|entity|data|orm|database|linq|sql|dapper)/.test(t)) return 'data';
  if (/(deploy|docker|k8s|kubernetes|container|ci|cd|devops|azure|aws|cloud)/.test(t)) return 'devops';
  if (/(microservice|distributed|messaging|event|queue|service-bus|kafka)/.test(t)) return 'microservices';
  if (/(pattern|architecture|solid|repository|factory|clean|cqrs|ddd)/.test(t)) return 'design';
  return 'fundamentals';
}

/* ============================================================
   CATEGORY TEMPLATES
   ============================================================ */
const CATEGORIES = {

  fundamentals: {
    icon: '🧠',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Fundamentals</span>',
    subtitle: 'The core ideas behind {THEME} — what it is, why .NET developers care, and how it fits in modern .NET applications.',
    facts: [
      { big: '.NET 8', lbl: 'Current LTS' },
      { big: 'CLR', lbl: 'Runtime' },
      { big: 'CIL', lbl: 'Bytecode' },
      { big: 'BCL', lbl: 'Class Library' },
      { big: 'MIT', lbl: 'Open Source' }
    ],
    concepts: [
      { icon: '🎯', title: 'What It Is', desc: '{THEME} is a foundational concept in the .NET ecosystem — every .NET developer encounters it.' },
      { icon: '⚙️', title: 'How It Works', desc: 'The CLR, BCL, and language compilers work together to enable {THEME}.' },
      { icon: '🚀', title: 'Why It Matters', desc: 'Understanding {THEME} unlocks deeper .NET knowledge and better design decisions.' },
      { icon: '🌍', title: 'Real-World Use', desc: 'Every ASP.NET service, desktop app, and cloud workload benefits from this.' }
    ],
    playground: {
      file: 'Program.cs',
      code: `using System;

namespace FundamentalsDemo
{
    class Program
    {
        static void Main()
        {
            // {THEME} — .NET fundamentals demo
            Console.WriteLine("Exploring: {THEME}");

            string[] topics = { ".NET", "CLR", "CIL", "BCL" };
            foreach (var topic in topics)
            {
                Console.WriteLine($"→ {topic}");
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
      'namespace FundamentalsDemo',
      '{',
      '    class Program',
      '    {',
      '        static void Main()',
      '        {',
      '            Console.WriteLine("Hello, .NET!");',
      '            int[] numbers = { 1, 2, 3 };',
      '            foreach (int n in numbers)',
      '                Console.WriteLine(n);',
      '        }',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>using System;</code> — the base BCL namespace, available in every .NET app.', tags: ['using'] },
      { line: 4, text: 'Classes are the core building blocks of .NET programs.', tags: ['Class'] },
      { line: 6, text: '<code>static void Main()</code> — the entry point the CLR looks for.', tags: ['Entry'] },
      { line: 8, text: '<code>Console.WriteLine()</code> — one of thousands of BCL methods.', tags: ['Output'] },
      { line: 9, text: 'Arrays are managed by the CLR — no manual memory management.', tags: ['Array'] },
      { line: 10, text: '<code>foreach</code> iterates elements. Clean, safe, idiomatic .NET.', tags: ['foreach'] }
    ],
    recap: [
      { title: '{THEME}', text: 'Foundation of every .NET application.' },
      { title: 'CLR', text: 'Manages memory, threads, and JIT compilation.' },
      { title: 'BCL', text: 'The rich Base Class Library provides classes for everything.' },
      { title: 'Cross-Platform', text: 'Same code runs on Windows, Linux, and macOS.' }
    ]
  },

  history: {
    icon: '📜',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">History & Evolution</span>',
    subtitle: 'How {THEME} evolved from its origins to the modern .NET platform.',
    facts: [
      { big: '2002', lbl: '.NET 1.0' },
      { big: '2016', lbl: '.NET Core' },
      { big: '2020', lbl: '.NET 5' },
      { big: '2023', lbl: '.NET 8 LTS' },
      { big: '2025', lbl: '.NET 10' }
    ],
    concepts: [
      { icon: '🔬', title: 'Origin', desc: 'Where {THEME} came from and the problem it solved.' },
      { icon: '📛', title: 'Evolution', desc: 'How {THEME} changed across .NET versions.' },
      { icon: '📖', title: 'Milestones', desc: 'Key releases and their impact on {THEME}.' },
      { icon: '🌍', title: 'Impact Today', desc: 'How modern .NET reflects the history of {THEME}.' }
    ],
    playground: {
      file: 'History.cs',
      code: `using System;

namespace HistoryDemo
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine(".NET Timeline");
            var releases = new (string Version, int Year)[]
            {
                (".NET Framework 1.0", 2002),
                (".NET Framework 4.8", 2019),
                (".NET Core 1.0", 2016),
                (".NET 5", 2020),
                (".NET 8 LTS", 2023),
            };

            foreach (var r in releases)
                Console.WriteLine($"{r.Year} → {r.Version}");
        }
    }
}`
    },
    stepCode: [
      'var releases = new[] {',
      '    (".NET Framework 1.0", 2002),',
      '    (".NET Core 1.0", 2016),',
      '    (".NET 5", 2020),',
      '    (".NET 8 LTS", 2023)',
      '};',
      '',
      'foreach (var r in releases)',
      '    Console.WriteLine(r.Item1 + " (" + r.Item2 + ")");'
    ],
    steps: [
      { line: 0, text: 'Array of <strong>tuples</strong> — a lightweight way to bundle multiple values.', tags: ['Tuple'] },
      { line: 1, text: 'First release: .NET Framework 1.0 in 2002, Windows-only.', tags: ['History'] },
      { line: 2, text: '.NET Core 1.0 in 2016 — cross-platform, open source, modular.', tags: ['History'] },
      { line: 3, text: '.NET 5 unified Framework and Core into one platform.', tags: ['History'] },
      { line: 7, text: '<code>foreach</code> over tuples — modern, clean iteration.', tags: ['foreach'] }
    ],
    recap: [
      { title: '2002', text: '.NET Framework 1.0 released — Windows only.' },
      { title: '2016', text: '.NET Core 1.0 — cross-platform, open source.' },
      { title: '2020', text: '.NET 5 unified everything into one .NET.' },
      { title: 'Today', text: '.NET 8 is the current LTS with AOT and NativeAOT.' }
    ]
  },

  architecture: {
    icon: '🏗️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Architecture</span>',
    subtitle: 'How {THEME} is structured — the layers, components, and design that power the .NET platform.',
    facts: [
      { big: 'CLR', lbl: 'Runtime' },
      { big: 'BCL', lbl: 'Class Library' },
      { big: 'SDK', lbl: 'Tooling' },
      { big: 'JIT', lbl: 'Code Gen' },
      { big: 'GC', lbl: 'Memory' }
    ],
    concepts: [
      { icon: '🧱', title: 'Components', desc: 'The major pieces that make up {THEME}.' },
      { icon: '🔗', title: 'Interactions', desc: 'How components communicate and depend on each other.' },
      { icon: '⚙️', title: 'Runtime Behavior', desc: 'What actually happens when your code runs.' },
      { icon: '🎯', title: 'Design Goals', desc: 'Why the architecture is designed the way it is.' }
    ],
    playground: {
      file: 'Architecture.cs',
      code: `using System;
using System.Reflection;

namespace ArchitectureDemo
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("Runtime Info");
            Console.WriteLine($"Version: {Environment.Version}");
            Console.WriteLine($"OS: {Environment.OSVersion}");
            Console.WriteLine($"Cores: {Environment.ProcessorCount}");
            Console.WriteLine($"64-bit: {Environment.Is64BitProcess}");

            // Reflection — inspect your own assembly
            var asm = Assembly.GetExecutingAssembly();
            Console.WriteLine($"Assembly: {asm.GetName().Name}");
        }
    }
}`
    },
    stepCode: [
      'using System;',
      'using System.Reflection;',
      '',
      'Console.WriteLine($"Version: {Environment.Version}");',
      'Console.WriteLine($"Cores: {Environment.ProcessorCount}");',
      '',
      'var asm = Assembly.GetExecutingAssembly();',
      'Console.WriteLine(asm.GetName().Name);'
    ],
    steps: [
      { line: 1, text: '<code>System.Reflection</code> — the API for inspecting assemblies at runtime.', tags: ['Reflection'] },
      { line: 3, text: '<code>Environment.Version</code> returns the current CLR version.', tags: ['CLR'] },
      { line: 4, text: '<code>Environment.ProcessorCount</code> — useful for parallelism tuning.', tags: ['Runtime'] },
      { line: 6, text: '<code>Assembly.GetExecutingAssembly()</code> — the compiled DLL containing this code.', tags: ['Assembly'] },
      { line: 7, text: 'Every .NET app is packaged as one or more assemblies.', tags: ['Assembly'] }
    ],
    recap: [
      { title: 'Layered', text: 'App → BCL → CLR → OS. Each layer has clear responsibility.' },
      { title: 'Assemblies', text: 'The deployable unit of .NET — a .dll or .exe.' },
      { title: 'Reflection', text: 'Inspect and manipulate types at runtime.' },
      { title: 'Environment', text: 'Query platform, version, and hardware details.' }
    ]
  },

  internals: {
    icon: '⚙️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">.NET Internals</span>',
    subtitle: 'A deep look inside {THEME} — how the CLR, CIL, JIT, and BCL work together under the hood.',
    facts: [
      { big: 'CIL', lbl: 'Bytecode' },
      { big: 'JIT', lbl: 'Compilation' },
      { big: 'GC', lbl: 'Memory' },
      { big: 'SOS', lbl: 'Debugger' },
      { big: 'ILSpy', lbl: 'Inspector' }
    ],
    concepts: [
      { icon: '🔬', title: 'Under the Hood', desc: 'What happens inside the runtime when you run {THEME}.' },
      { icon: '📦', title: 'Bytecode', desc: 'CIL is the intermediate language every .NET assembly contains.' },
      { icon: '⚡', title: 'JIT Compilation', desc: 'CIL is compiled to native code on demand by the JIT.' },
      { icon: '🧠', title: 'Managed Memory', desc: 'The GC tracks objects and reclaims memory automatically.' }
    ],
    playground: {
      file: 'Internals.cs',
      code: `using System;

namespace InternalsDemo
{
    class Program
    {
        static void Main()
        {
            // {THEME} — internals demo
            var obj = new object();
            Console.WriteLine($"Hash code: {obj.GetHashCode()}");
            Console.WriteLine($"Type: {obj.GetType().FullName}");

            // Force a GC and see memory stats
            GC.Collect();
            Console.WriteLine($"Gen0 collections: {GC.CollectionCount(0)}");
            Console.WriteLine($"Total memory: {GC.GetTotalMemory(false) / 1024} KB");
        }
    }
}`
    },
    stepCode: [
      'var obj = new object();',
      'Console.WriteLine(obj.GetHashCode());',
      'Console.WriteLine(obj.GetType().FullName);',
      '',
      'GC.Collect();',
      'Console.WriteLine(GC.CollectionCount(0));',
      'Console.WriteLine(GC.GetTotalMemory(false) / 1024);'
    ],
    steps: [
      { line: 0, text: 'Every object inherits from <code>System.Object</code> — the root of the type hierarchy.', tags: ['Object'] },
      { line: 1, text: '<code>GetHashCode()</code> comes from the CLR — default implementation exists.', tags: ['CLR'] },
      { line: 2, text: '<code>GetType()</code> returns metadata from the assembly.', tags: ['Metadata'] },
      { line: 4, text: '<code>GC.Collect()</code> forces a garbage collection — rarely used in production.', tags: ['GC'] },
      { line: 6, text: '<code>GC.GetTotalMemory()</code> reports current managed heap usage.', tags: ['GC'] }
    ],
    recap: [
      { title: 'CIL', text: 'The bytecode every .NET assembly contains.' },
      { title: 'JIT', text: 'Compiles CIL to native code at runtime.' },
      { title: 'GC', text: 'Automatic memory management — no free() needed.' },
      { title: 'Metadata', text: 'Every assembly carries rich type information.' }
    ]
  },

  tooling: {
    icon: '🛠️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Tooling & Workflow</span>',
    subtitle: 'The tools, commands, and workflows developers use every day with {THEME}.',
    facts: [
      { big: 'dotnet', lbl: 'CLI Command' },
      { big: 'MSBuild', lbl: 'Build Engine' },
      { big: 'NuGet', lbl: 'Packages' },
      { big: 'CLI', lbl: 'Cross-Platform' },
      { big: 'SDK', lbl: 'Batteries Incl.' }
    ],
    concepts: [
      { icon: '⌨️', title: 'Core Commands', desc: 'The essential commands you will type in the terminal for {THEME}.' },
      { icon: '📁', title: 'Project Structure', desc: 'How files are organized in a modern .NET project.' },
      { icon: '⚙️', title: 'Configuration', desc: 'MSBuild, csproj files, and how the build pipeline works.' },
      { icon: '📦', title: 'Package Management', desc: 'NuGet, dependencies, and restoring packages.' }
    ],
    playground: {
      file: 'Commands.txt',
      code: `# Essential dotnet CLI commands

dotnet new console -n MyApp          # create a new console app
cd MyApp                              # enter the folder
dotnet build                          # compile the project
dotnet run                            # build and run
dotnet publish -c Release -o ./out    # publish for deployment
dotnet add package Newtonsoft.Json    # add a NuGet package
dotnet test                           # run unit tests
dotnet --info                         # show SDK/runtime info

# Solution-level
dotnet new sln -n MySolution
dotnet sln add ./MyApp/MyApp.csproj`
    },
    stepCode: [
      'dotnet new console -n MyApp',
      'cd MyApp',
      'dotnet build',
      'dotnet run',
      'dotnet publish -c Release -o ./out',
      '',
      '# These 5 commands cover 90% of daily workflow'
    ],
    steps: [
      { line: 0, text: '<code>dotnet new</code> — scaffolding. Creates a starter project from a template.', tags: ['new'] },
      { line: 2, text: '<code>dotnet build</code> — compiles the project into a DLL in <code>bin/Debug/</code>.', tags: ['build'] },
      { line: 3, text: '<code>dotnet run</code> — builds and runs the executable in one step.', tags: ['run'] },
      { line: 4, text: '<code>dotnet publish</code> — produces a deployable output, optionally self-contained.', tags: ['publish'] }
    ],
    recap: [
      { title: 'dotnet CLI', text: 'One tool for creating, building, running, and publishing.' },
      { title: 'MSBuild', text: 'The underlying build engine — driven by .csproj files.' },
      { title: 'NuGet', text: 'Over 400,000 packages available with one command.' },
      { title: 'Cross-Platform', text: 'Same CLI works on Windows, Linux, and macOS.' }
    ]
  },

  async: {
    icon: '⚡',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Async & Concurrency</span>',
    subtitle: 'Asynchronous and parallel programming in .NET using {THEME}.',
    facts: [
      { big: 'async', lbl: 'Keyword' },
      { big: 'await', lbl: 'Keyword' },
      { big: 'Task<T>', lbl: 'Result Type' },
      { big: 'TPL', lbl: 'Task Library' },
      { big: 'Channels', lbl: 'Producer/Consumer' }
    ],
    concepts: [
      { icon: '🔁', title: 'Non-Blocking', desc: 'Async code frees the thread while waiting for I/O.' },
      { icon: '📊', title: 'Scalability', desc: 'Servers handle thousands of concurrent requests with fewer threads.' },
      { icon: '⚠️', title: 'Pitfalls', desc: 'Deadlocks, forgotten awaits, and fire-and-forget bugs.' },
      { icon: '🎯', title: 'When to Use', desc: 'I/O-bound operations benefit most from async in .NET.' }
    ],
    playground: {
      file: 'Async.cs',
      code: `using System;
using System.Threading.Tasks;

namespace AsyncDemo
{
    class Program
    {
        static async Task Main()
        {
            Console.WriteLine("Start");

            await DoWorkAsync("Task A", 500);
            await DoWorkAsync("Task B", 300);

            Console.WriteLine("Done");
        }

        static async Task DoWorkAsync(string name, int delay)
        {
            Console.WriteLine($"{name} started");
            await Task.Delay(delay);
            Console.WriteLine($"{name} completed");
        }
    }
}`
    },
    stepCode: [
      'static async Task Main()',
      '{',
      '    Console.WriteLine("Start");',
      '    await DoWorkAsync("A", 500);',
      '    Console.WriteLine("Done");',
      '}',
      '',
      'static async Task DoWorkAsync(string name, int delay)',
      '{',
      '    await Task.Delay(delay);',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>async Task Main()</code> — modern entry point that can await.', tags: ['async'] },
      { line: 3, text: '<code>await</code> — pauses this method but frees the thread. Resumes when complete.', tags: ['await'] },
      { line: 7, text: 'Async methods return <code>Task</code> or <code>Task&lt;T&gt;</code>.', tags: ['Task'] },
      { line: 9, text: '<code>Task.Delay</code> — non-blocking wait. Replaces <code>Thread.Sleep</code> in async code.', tags: ['Delay'] }
    ],
    recap: [
      { title: 'async/await', text: 'Keep code readable while running asynchronously.' },
      { title: 'Task<T>', text: 'Represents an operation that produces a result.' },
      { title: 'Never Block', text: 'Don\'t use <code>.Result</code> or <code>.Wait()</code> — you\'ll deadlock.' },
      { title: 'I/O Bound', text: 'Use async for I/O; use Parallel for CPU work.' }
    ]
  },

  security: {
    icon: '🛡️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Security & Reliability</span>',
    subtitle: 'Writing {THEME} that is safe, defensive, and resilient against attacks and failures.',
    facts: [
      { big: 'OWASP', lbl: 'Guidelines' },
      { big: 'DataProtection', lbl: 'ASP.NET API' },
      { big: 'JWT', lbl: 'Tokens' },
      { big: 'HTTPS', lbl: 'Always' },
      { big: 'Validate', lbl: 'All Inputs' }
    ],
    concepts: [
      { icon: '🔒', title: 'Input Validation', desc: 'Never trust user input. Validate everything.' },
      { icon: '🛡️', title: 'Defense in Depth', desc: 'Multiple layers so one failure isn\'t catastrophic.' },
      { icon: '⚠️', title: 'Common Attacks', desc: 'SQL injection, XSS, CSRF, and .NET defenses.' },
      { icon: '🔁', title: 'Fail Safe', desc: 'When errors occur, fail to a safe, known state.' }
    ],
    playground: {
      file: 'Security.cs',
      code: `using System;
using System.Text.RegularExpressions;

namespace SecurityDemo
{
    class Program
    {
        static void Main()
        {
            string userInput = "'; DROP TABLE users; --";

            // BAD: string concatenation into SQL
            string badQuery = $"SELECT * FROM users WHERE name = '{userInput}'";
            Console.WriteLine("UNSAFE: " + badQuery);

            // GOOD: validate and sanitize
            string clean = Regex.Replace(userInput, @"[^a-zA-Z0-9 ]", "");
            Console.WriteLine("CLEAN:  " + clean);

            // BEST: parameterized queries (concept)
            Console.WriteLine("SAFE:   Use SqlParameter or EF Core");
        }
    }
}`
    },
    stepCode: [
      'string userInput = "\'; DROP TABLE users; --";',
      '',
      'string badQuery = $"SELECT * FROM users WHERE name = \'{userInput}\'";',
      '// ↑ NEVER — SQL injection!',
      '',
      'string clean = Regex.Replace(userInput, @"[^a-zA-Z0-9 ]", "");',
      '',
      '// BEST: SqlParameter or EF Core'
    ],
    steps: [
      { line: 0, text: 'Malicious input can contain SQL injection payloads.', tags: ['Threat'] },
      { line: 2, text: 'Never concatenate user input into SQL. Use <code>SqlParameter</code> instead.', tags: ['SQLi'] },
      { line: 5, text: 'Sanitization strips dangerous characters — one layer of defense.', tags: ['Validate'] },
      { line: 7, text: 'Real fix: parameterized queries via ADO.NET or EF Core.', tags: ['Fix'] }
    ],
    recap: [
      { title: 'Never Trust Input', text: 'All data from outside is suspect.' },
      { title: 'Parameterize', text: 'Always use SqlParameter, never string concat.' },
      { title: 'ASP.NET Core', text: 'Built-in DataProtection, Identity, and auth.' },
      { title: 'Defense in Depth', text: 'Multiple overlapping protections.' }
    ]
  },

  testing: {
    icon: '🧪',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Testing & Quality</span>',
    subtitle: 'How to verify {THEME} works — unit tests, integration tests, and quality gates.',
    facts: [
      { big: 'xUnit', lbl: 'Framework' },
      { big: 'NUnit', lbl: 'Alternative' },
      { big: 'MSTest', lbl: 'Microsoft' },
      { big: 'Moq', lbl: 'Mocking' },
      { big: 'Coverlet', lbl: 'Coverage' }
    ],
    concepts: [
      { icon: '✅', title: 'Unit Tests', desc: 'Small, focused tests for one behavior of {THEME}.' },
      { icon: '🎯', title: 'Edge Cases', desc: 'Null, empty, boundary values — where bugs hide.' },
      { icon: '🔁', title: 'AAA Pattern', desc: 'Arrange, Act, Assert — structure every test.' },
      { icon: '📊', title: 'Coverage', desc: 'What percentage of your code is tested.' }
    ],
    playground: {
      file: 'Tests.cs',
      code: `using System;

namespace TestingDemo
{
    public static class Calculator
    {
        public static int Add(int a, int b) => a + b;
        public static int Divide(int a, int b)
        {
            if (b == 0) throw new DivideByZeroException();
            return a / b;
        }
    }

    class Program
    {
        static void Main()
        {
            Assert(Calculator.Add(2, 3) == 5, "Add positive");
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
      'Assert(Calculator.Add(2, 3) == 5, "Add positive");',
      'Assert(Calculator.Add(-1, 1) == 0, "Add negatives");',
      '',
      'bool threw = false;',
      'try { Calculator.Divide(5, 0); }',
      'catch (DivideByZeroException) { threw = true; }',
      'Assert(threw, "Divide by zero throws");'
    ],
    steps: [
      { line: 0, text: 'Expression-bodied method — concise, idiomatic C#.', tags: ['Syntax'] },
      { line: 2, text: 'First test — verify the happy path.', tags: ['Test'] },
      { line: 3, text: 'Second test — boundary case with negative numbers.', tags: ['Edge'] },
      { line: 6, text: 'Testing exceptions requires try/catch pattern.', tags: ['Exception'] },
      { line: 8, text: 'Assert the exception <em>was</em> thrown — a valid test case.', tags: ['Assert'] }
    ],
    recap: [
      { title: 'Test Early', text: 'Write tests alongside the code.' },
      { title: 'Edge Cases', text: 'Null, empty, boundaries, exceptions.' },
      { title: 'AAA Pattern', text: 'Arrange, Act, Assert.' },
      { title: 'xUnit', text: 'The modern default in .NET projects.' }
    ]
  },

  performance: {
    icon: '⚡',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Performance & Optimization</span>',
    subtitle: 'How to make {THEME} fast — profiling, allocation reduction, and hot-path tuning.',
    facts: [
      { big: 'BenchmarkDotNet', lbl: 'Micro-Bench' },
      { big: 'Span<T>', lbl: 'Zero Alloc' },
      { big: 'ArrayPool<T>', lbl: 'Reuse' },
      { big: 'AOT', lbl: 'Native' },
      { big: 'JIT', lbl: 'Tiered' }
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

namespace PerformanceDemo
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

            Console.WriteLine($"Same: {slow.Length == fast.Length}");
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
      { line: 4, text: '<code>+=</code> on strings creates a new string each iteration — O(N²).', tags: ['Anti-Pattern'] },
      { line: 7, text: '<code>Restart()</code> resets for the next measurement.', tags: ['Timing'] },
      { line: 9, text: '<code>StringBuilder</code> mutates in-place — O(N) instead of O(N²).', tags: ['Optimize'] }
    ],
    recap: [
      { title: 'Measure', text: 'Never optimize without profiling.' },
      { title: 'StringBuilder', text: 'Use in loops — never <code>+=</code>.' },
      { title: 'Reduce Alloc', text: 'Span<T>, ArrayPool<T>, stackalloc.' },
      { title: 'BenchmarkDotNet', text: 'The standard micro-benchmarking tool.' }
    ]
  },

  web: {
    icon: '🌐',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Web Development</span>',
    subtitle: 'Building modern web applications and APIs with {THEME}.',
    facts: [
      { big: 'Kestrel', lbl: 'Web Server' },
      { big: 'Minimal API', lbl: '.NET 6+' },
      { big: 'DI', lbl: 'Built-In' },
      { big: 'Middleware', lbl: 'Pipeline' },
      { big: 'Blazor', lbl: 'C# Frontend' }
    ],
    concepts: [
      { icon: '🌐', title: 'HTTP Pipeline', desc: 'How requests flow through middleware in ASP.NET Core.' },
      { icon: '🎯', title: 'Routing', desc: 'URL patterns map to endpoint handlers.' },
      { icon: '📦', title: 'Dependency Injection', desc: 'Built-in DI container — no third-party needed.' },
      { icon: '⚡', title: 'Minimal APIs', desc: 'Express endpoints with a single line of code.' }
    ],
    playground: {
      file: 'Program.cs',
      code: `// Minimal API example (ASP.NET Core 8)
// Run with: dotnet new web && dotnet run

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello, ASP.NET Core!");

app.MapGet("/time", () => DateTime.UtcNow.ToString());

app.MapGet("/users/{id}", (int id) =>
    new { Id = id, Name = $"User {id}" });

app.Run();`
    },
    stepCode: [
      'var builder = WebApplication.CreateBuilder(args);',
      'var app = builder.Build();',
      '',
      'app.MapGet("/", () => "Hello, ASP.NET Core!");',
      '',
      'app.MapGet("/users/{id}", (int id) =>',
      '    new { Id = id, Name = $"User {id}" });',
      '',
      'app.Run();'
    ],
    steps: [
      { line: 0, text: '<code>WebApplication.CreateBuilder</code> — sets up DI, config, and logging.', tags: ['Builder'] },
      { line: 1, text: '<code>builder.Build()</code> — produces the configured app.', tags: ['Build'] },
      { line: 3, text: '<code>MapGet</code> — register a handler for GET requests to a route.', tags: ['Endpoint'] },
      { line: 5, text: 'Route params like <code>{id}</code> bind automatically to method args.', tags: ['Route'] },
      { line: 8, text: '<code>app.Run()</code> — starts Kestrel and begins listening.', tags: ['Run'] }
    ],
    recap: [
      { title: 'Minimal APIs', text: 'The fastest way to build HTTP services in .NET.' },
      { title: 'Middleware', text: 'Compose the request pipeline with <code>app.Use...</code>' },
      { title: 'Built-in DI', text: 'No third-party container required.' },
      { title: 'Kestrel', text: 'The cross-platform web server for ASP.NET Core.' }
    ]
  },

  data: {
    icon: '🗄️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Data & Persistence</span>',
    subtitle: 'Working with data in .NET — ORMs, LINQ, and database access with {THEME}.',
    facts: [
      { big: 'EF Core', lbl: 'ORM' },
      { big: 'LINQ', lbl: 'Query' },
      { big: 'ADO.NET', lbl: 'Low-Level' },
      { big: 'Dapper', lbl: 'Micro-ORM' },
      { big: 'Migrations', lbl: 'Schema' }
    ],
    concepts: [
      { icon: '🗄️', title: 'ORM', desc: 'Map C# objects to database tables with EF Core.' },
      { icon: '🔍', title: 'LINQ', desc: 'Query databases using C# — no SQL strings needed.' },
      { icon: '⚙️', title: 'Migrations', desc: 'Evolve the schema as your code changes.' },
      { icon: '⚡', title: 'Performance', desc: 'Avoid N+1 queries, use projections, track vs no-track.' }
    ],
    playground: {
      file: 'Data.cs',
      code: `using System;
using System.Linq;

namespace DataDemo
{
    class Program
    {
        record Product(string Name, decimal Price, string Category);

        static void Main()
        {
            var products = new[]
            {
                new Product("Laptop", 1200, "Electronics"),
                new Product("Mouse", 25, "Electronics"),
                new Product("Desk", 350, "Furniture"),
                new Product("Chair", 200, "Furniture"),
                new Product("Monitor", 400, "Electronics")
            };

            // LINQ — group by category
            var g = products.GroupBy(p => p.Category);

            foreach (var g in groups)
            {
                Console.WriteLine($"{g.Key}: {g.Count()} items, total \${g.Sum(p => p.Price)}");
            }
        }
    }
}`
    },
    stepCode: [
      'record Product(string Name, decimal Price, string Category);',
      '',
      'var products = new[] {',
      '    new Product("Laptop", 1200, "Electronics"),',
      '    new Product("Mouse", 25, "Electronics")',
      '};',
      '',
      'var groups = products.GroupBy(p => p.Category);',
      '',
      'foreach (var g in groups)',
      '    Console.WriteLine(g.Key + ": " + g.Count());'
    ],
    steps: [
      { line: 0, text: '<code>record</code> — immutable data class with auto-generated members.', tags: ['record'] },
      { line: 2, text: 'Collection initializer — compact way to populate data.', tags: ['Collection'] },
      { line: 7, text: '<code>GroupBy</code> — LINQ operator that buckets elements by key.', tags: ['LINQ'] },
      { line: 10, text: 'Each group has a <code>Key</code> and is itself enumerable.', tags: ['Group'] }
    ],
    recap: [
      { title: 'EF Core', text: 'The ORM of choice for modern .NET.' },
      { title: 'LINQ', text: 'Query in C# — with type safety.' },
      { title: 'Records', text: 'Perfect for data carriers and DTOs.' },
      { title: 'Migrations', text: 'Version-controlled schema changes.' }
    ]
  },

  devops: {
    icon: '🚀',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">DevOps & Deployment</span>',
    subtitle: 'Deploying .NET applications with {THEME} — containers, CI/CD, and cloud platforms.',
    facts: [
      { big: 'Docker', lbl: 'Containers' },
      { big: 'GitHub Actions', lbl: 'CI/CD' },
      { big: 'Azure', lbl: 'Cloud' },
      { big: 'K8s', lbl: 'Orchestration' },
      { big: 'AOT', lbl: 'Tiny Images' }
    ],
    concepts: [
      { icon: '📦', title: 'Containerization', desc: 'Package your app + runtime into a portable image.' },
      { icon: '🔁', title: 'CI/CD', desc: 'Automated build, test, and deployment pipelines.' },
      { icon: '☁️', title: 'Cloud', desc: 'Deploy to Azure, AWS, GCP, or on-prem.' },
      { icon: '⚙️', title: 'Config', desc: 'Environment variables, secrets, and per-env settings.' }
    ],
    playground: {
      file: 'Dockerfile.txt',
      code: `# Multi-stage Dockerfile for .NET 8

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "MyApp.dll"]`
    },
    stepCode: [
      'FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build',
      'WORKDIR /src',
      'COPY *.csproj ./',
      'RUN dotnet restore',
      'COPY . .',
      'RUN dotnet publish -c Release -o /app',
      '',
      'FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime',
      'COPY --from=build /app .',
      'ENTRYPOINT ["dotnet", "MyApp.dll"]'
    ],
    steps: [
      { line: 0, text: 'Stage 1: build using the SDK image — includes compilers and CLI.', tags: ['Build'] },
      { line: 3, text: '<code>dotnet restore</code> — download NuGet packages (cached layer).', tags: ['Restore'] },
      { line: 5, text: '<code>dotnet publish</code> — produce a deployable output.', tags: ['Publish'] },
      { line: 7, text: 'Stage 2: runtime-only image — much smaller than the SDK image.', tags: ['Runtime'] },
      { line: 9, text: '<code>ENTRYPOINT</code> — what runs when the container starts.', tags: ['Entry'] }
    ],
    recap: [
      { title: 'Multi-Stage', text: 'Build in SDK image, run in slim runtime image.' },
      { title: 'Smaller Images', text: 'Alpine and chiseled variants save space.' },
      { title: 'Config via Env', text: 'Override settings with environment variables.' },
      { title: 'CI/CD', text: 'GitHub Actions, Azure DevOps, GitLab CI all support .NET.' }
    ]
  },

  microservices: {
    icon: '🕸️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Microservices & Distributed Systems</span>',
    subtitle: 'Building distributed .NET systems with {THEME}.',
    facts: [
      { big: 'gRPC', lbl: 'RPC' },
      { big: 'RabbitMQ', lbl: 'Messaging' },
      { big: 'MassTransit', lbl: 'Bus' },
      { big: 'YARP', lbl: 'Gateway' },
      { big: 'OpenTelemetry', lbl: 'Tracing' }
    ],
    concepts: [
      { icon: '🕸️', title: 'Decomposition', desc: 'Splitting a monolith into independent services.' },
      { icon: '📬', title: 'Messaging', desc: 'Async communication via queues and events.' },
      { icon: '🔍', title: 'Observability', desc: 'Tracing, metrics, and logging across services.' },
      { icon: '⚠️', title: 'Pitfalls', desc: 'Distributed transactions, network failures, versioning.' }
    ],
    playground: {
      file: 'Service.cs',
      code: `// Example: publishing and consuming a message
// Uses MassTransit + RabbitMQ (concept)

public record OrderPlaced(Guid OrderId, decimal Total, DateTime PlacedAt);

public class OrderService
{
    private readonly IPublishEndpoint _bus;

    public OrderService(IPublishEndpoint bus) => _bus = bus;

    public async Task PlaceOrderAsync(Order order)
    {
        // ... save order to DB ...

        await _bus.Publish(new OrderPlaced(
            order.Id,
            order.Total,
            DateTime.UtcNow
        ));
    }
}

// Another service subscribes
public class EmailConsumer : IConsumer<OrderPlaced>
{
    public Task Consume(ConsumeContext<OrderPlaced> ctx)
    {
        Console.WriteLine($"Send receipt for {ctx.Message.OrderId}");
        return Task.CompletedTask;
    }
}`
    },
    stepCode: [
      'public record OrderPlaced(Guid OrderId, decimal Total);',
      '',
      'public class OrderService',
      '{',
      '    private readonly IPublishEndpoint _bus;',
      '',
      '    public async Task PlaceOrderAsync(Order order)',
      '    {',
      '        await _bus.Publish(new OrderPlaced(order.Id, order.Total));',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>record</code> — immutable event payload, easy to serialize.', tags: ['Event'] },
      { line: 4, text: 'Message bus injected via DI — decouples producers from consumers.', tags: ['DI'] },
      { line: 8, text: '<code>Publish</code> sends the event to the bus — no direct receiver.', tags: ['Publish'] },
      { line: 8, text: 'Consumers subscribe independently — perfect for scaling.', tags: ['Async'] }
    ],
    recap: [
      { title: 'Decoupled', text: 'Services communicate via messages, not direct calls.' },
      { title: 'Scalable', text: 'Add consumers to handle more load.' },
      { title: 'Observable', text: 'OpenTelemetry traces across services.' },
      { title: 'Resilient', text: 'Handles network failures with retries and queues.' }
    ]
  },

  design: {
    icon: '🎨',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Design & Patterns</span>',
    subtitle: 'Design principles and architectural patterns for {THEME} in .NET applications.',
    facts: [
      { big: 'SOLID', lbl: 'Principles' },
      { big: 'DI', lbl: 'Built-In' },
      { big: 'CQRS', lbl: 'Pattern' },
      { big: 'Clean', lbl: 'Architecture' },
      { big: 'DDD', lbl: 'Domain-Driven' }
    ],
    concepts: [
      { icon: '🏗️', title: 'Layered', desc: 'Separate concerns into clear layers.' },
      { icon: '🧩', title: 'Reusable', desc: 'Apply proven patterns to recurring problems.' },
      { icon: '⚖️', title: 'Trade-offs', desc: 'Every pattern has costs — apply judiciously.' },
      { icon: '🎯', title: 'Testability', desc: 'Good design = easy to test.' }
    ],
    playground: {
      file: 'Patterns.cs',
      code: `using System;

namespace DesignDemo
{
    // Repository pattern — abstract data access
    public interface IUserRepository
    {
        User? FindById(int id);
    }

    public record User(int Id, string Name, string Email);

    // Implementation (could be EF Core, Dapper, in-memory, etc.)
    public class InMemoryUserRepository : IUserRepository
    {
        private readonly User[] _users =
        {
            new User(1, "Alice", "alice@example.com"),
            new User(2, "Bob", "bob@example.com")
        };

        public User? FindById(int id)
        {
            foreach (var u in _users)
                if (u.Id == id) return u;
            return null;
        }
    }

    class Program
    {
        static void Main()
        {
            IUserRepository repo = new InMemoryUserRepository();
            var user = repo.FindById(1);
            Console.WriteLine(user?.Name ?? "Not found");
        }
    }
}`
    },
    stepCode: [
      'public interface IUserRepository',
      '{',
      '    User? FindById(int id);',
      '}',
      '',
      'public class InMemoryUserRepository : IUserRepository',
      '{',
      '    public User? FindById(int id) { /* ... */ }',
      '}',
      '',
      '// Program.cs — depend on abstraction, not concrete class',
      'IUserRepository repo = new InMemoryUserRepository();'
    ],
    steps: [
      { line: 0, text: 'Interface defines <strong>what</strong> — not <strong>how</strong>.', tags: ['Interface'] },
      { line: 2, text: 'Return type <code>User?</code> — nullable reference, may return null.', tags: ['Nullable'] },
      { line: 5, text: 'Concrete implementation — could be swapped for EF Core, Dapper, etc.', tags: ['Implementation'] },
      { line: 11, text: 'Program depends on the interface — a core SOLID principle (DIP).', tags: ['SOLID'] }
    ],
    recap: [
      { title: 'SOLID', text: 'Single responsibility, open/closed, Liskov, ISP, DIP.' },
      { title: 'Repository', text: 'Abstract data access behind an interface.' },
      { title: 'Dependency Inversion', text: 'Depend on abstractions, not concrete types.' },
      { title: 'Clean Architecture', text: 'Separate domain, application, and infrastructure.' }
    ]
  }
};

/* ============================================================
   THEME TITLE GENERATOR
   ============================================================ */
function titleFromSlug(slug) {
  return slug
    .split('-')
    .map(w => {
      if (w === 'net') return '.NET';
      if (w === 'csharp') return 'C#';
      if (w === 'cli') return 'CLI';
      if (w === 'sdk') return 'SDK';
      if (w === 'clr') return 'CLR';
      if (w === 'cls') return 'CLS';
      if (w === 'cts') return 'CTS';
      if (w === 'il') return 'IL';
      if (w === 'cil') return 'CIL';
      if (w === 'jit') return 'JIT';
      if (w === 'gc') return 'GC';
      if (w === 'aot') return 'AOT';
      if (w === 'api') return 'API';
      if (w === 'apis') return 'APIs';
      if (w === 'asp') return 'ASP';
      if (w === 'di') return 'DI';
      if (w === 'ioc') return 'IoC';
      if (w === 'ef') return 'EF';
      if (w === 'orm') return 'ORM';
      if (w === 'mvc') return 'MVC';
      if (w === 'mvvm') return 'MVVM';
      if (w === 'grpc') return 'gRPC';
      if (w === 'http') return 'HTTP';
      if (w === 'json') return 'JSON';
      if (w === 'xml') return 'XML';
      if (w === 'yaml') return 'YAML';
      if (w === 'sql') return 'SQL';
      if (w === 'azure') return 'Azure';
      if (w === 'aws') return 'AWS';
      if (w === 'gcp') return 'GCP';
      if (w === 'k8s') return 'K8s';
      if (w === 'docker') return 'Docker';
      if (w === 'ci') return 'CI';
      if (w === 'cd') return 'CD';
      if (w === 'nuget') return 'NuGet';
      if (w === 'msbuild') return 'MSBuild';
      if (w === 'blazor') return 'Blazor';
      if (w === 'signalr') return 'SignalR';
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ')
    .replace(/\.NET Net/g, '.NET')
    .replace(/\.NET Framework/g, '.NET Framework');
}

/* ============================================================
   PARSE FOLDER
   ============================================================ */
function parseFolder(name) {
  const m = name.match(/^(\d+)-(.+)$/);
  if (!m) return null;
  return { num: m[1], theme: m[2] };
}

/* ============================================================
   BUILD TOPIC
   ============================================================ */
function buildTopic(folderName) {
  const parsed = parseFolder(folderName);
  if (!parsed) return null;

  const { num, theme } = parsed;
  const category = detectCategory(theme);
  const catTemplate = CATEGORIES[category] || CATEGORIES.fundamentals;
  const themeTitle = titleFromSlug(theme);

  const substitute = (s) => String(s).replace(/\{THEME\}/g, themeTitle);

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
   ESCAPE + RENDER
   ============================================================ */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHTML(topic) {
  const factsHtml = topic.facts.map(f =>
    `<div class="fact"><div class="big">${escapeHtml(f.big)}</div><div class="lbl">${escapeHtml(f.lbl)}</div></div>`
  ).join('');

  const conceptsHtml = topic.concepts.map((c, i) => {
    const colors = ['#512bd4,#7c3aed', '#0078d4,#00a4ef', '#22c55e,#4ade80', '#f59e0b,#fbbf24'];
    const [c1, c2] = colors[i % colors.length].split(',');
    return `<div class="concept" style="--c1:${c1};--c2:${c2}">
      <div class="c-ico">${c.icon}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${c.desc}</p>
    </div>`;
  }).join('');

  const recapHtml = topic.recap.map((r, i) => {
    const colors = ['#512bd4', '#0078d4', '#22c55e', '#f59e0b'];
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
.space-base{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#180d30 0%,#0a0a20 45%,#05060f 85%),radial-gradient(ellipse at 0% 100%,#0a1526 0%,transparent 55%)}
.orbs{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:.45}
.orb{position:absolute;border-radius:50%;filter:blur(90px)}
.orb-1{width:520px;height:520px;top:-10%;left:-8%;background:radial-gradient(circle,#512bd4,transparent 70%);animation:d1 26s ease-in-out infinite}
.orb-2{width:460px;height:460px;top:45%;right:-10%;background:radial-gradient(circle,#0078d4,transparent 70%);animation:d2 30s ease-in-out infinite}
.orb-3{width:600px;height:600px;bottom:-18%;left:18%;background:radial-gradient(circle,#7c3aed,transparent 70%);animation:d3 34s ease-in-out infinite}
@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,40px) scale(1.15)}}
@keyframes d2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.2)}}
@keyframes d3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-60px) scale(1.1)}}
.grid-bg{position:fixed;inset:-50%;z-index:2;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(81,43,212,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(81,43,212,.14) 1px,transparent 1px);background-size:80px 80px;transform:perspective(500px) rotateX(60deg);animation:gf 22s linear infinite;mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%)}
@keyframes gf{from{background-position:0 0}to{background-position:0 80px}}
.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.72) 100%)}
.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}
.container{max-width:1150px;margin:0 auto;padding:0 1.5rem;width:100%}
nav{position:sticky;top:0;z-index:100;background:rgba(5,6,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(148,163,184,.08)}
.nav-inner{max-width:1150px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1rem;color:#f1f5f9;text-decoration:none}
.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#512bd4,#0078d4);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.85rem;color:#fff;box-shadow:0 8px 20px -6px rgba(81,43,212,.6)}
.hero{padding:4.5rem 1.5rem 3rem;text-align:center}
.tpill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(81,43,212,.12);border:1px solid rgba(81,43,212,.35);border-radius:999px;padding:.45rem 1.1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c4b5fd;margin-bottom:1.5rem}
.tpill .n{background:#512bd4;color:#fff;min-width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;padding:0 .35rem}
.hero h1{font-size:clamp(1.9rem,4.8vw,3rem);font-weight:900;letter-spacing:-.04em;line-height:1.15;margin-bottom:1.2rem}
.hero h1 .grad{background:linear-gradient(135deg,#a78bfa 0%,#512bd4 45%,#0078d4 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gs 7s ease-in-out infinite}
@keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.hero p{color:#a1a1aa;font-size:1.05rem;max-width:660px;margin:0 auto;line-height:1.7}
section{padding:3rem 0}
.sec-head{text-align:center;margin-bottom:2.5rem}
.stag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(81,43,212,.1);border:1px solid rgba(81,43,212,.3);border-radius:999px;padding:.4rem 1rem;font-size:.68rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c4b5fd;margin-bottom:1rem}
.sec-head h2{font-size:clamp(1.6rem,3.8vw,2.3rem);font-weight:900;letter-spacing:-.03em;line-height:1.15;margin-bottom:.6rem}
.sec-head h2 .grad{background:linear-gradient(135deg,#c4b5fd,#0078d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sec-head p{color:#94a3b8;font-size:.95rem;max-width:620px;margin:0 auto}
.facts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:2rem}
.fact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:1.05rem 1rem;text-align:center;transition:all .25s}
.fact:hover{transform:translateY(-3px);border-color:rgba(81,43,212,.4)}
.fact .big{font-size:1.05rem;font-weight:900;background:linear-gradient(135deg,#c4b5fd,#0078d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}
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
.step-btn{background:rgba(81,43,212,.15);border:1px solid rgba(81,43,212,.3);color:#c4b5fd;border-radius:8px;padding:.35rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.step-btn:hover:not(:disabled){background:rgba(81,43,212,.3)}
.step-btn:disabled{opacity:.35;cursor:not-allowed}
.step-body{display:grid;grid-template-columns:1.2fr 1fr}
@media(max-width:800px){.step-body{grid-template-columns:1fr}}
.step-code{padding:1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1);overflow-x:auto}
@media(max-width:800px){.step-code{border-right:none;border-bottom:1px solid rgba(148,163,184,.1)}}
.step-line{padding:.15rem .5rem;border-radius:5px;transition:background .3s;white-space:pre}
.step-line.active{background:rgba(81,43,212,.18);box-shadow:inset 3px 0 0 #512bd4;color:#fff}
.step-info{padding:1.1rem 1.3rem;background:rgba(30,41,59,.4)}
.explain{font-size:.85rem;color:#cbd5e1;min-height:4rem;margin-bottom:.9rem;line-height:1.6}
.explain code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.82em}
.tag-list{display:flex;flex-wrap:wrap;gap:.35rem}
.tag{background:rgba(196,181,253,.15);border:1px solid rgba(196,181,253,.3);color:#c4b5fd;border-radius:6px;padding:.25rem .65rem;font-size:.7rem;font-family:'JetBrains Mono',monospace;font-weight:600}
.step-progress{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}
.bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}
.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#512bd4,#0078d4);border-radius:999px;transition:width .35s}
.count{font-size:.72rem;color:#64748b;font-family:'JetBrains Mono',monospace;min-width:3.5rem;text-align:right}
.recap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.9rem;margin-top:1.2rem}
.recap{background:rgba(30,41,59,.6);border-radius:14px;padding:1.1rem 1.2rem;border-left:3px solid var(--rc,#512bd4)}
.recap .t{font-size:.72rem;font-weight:800;color:var(--rc,#512bd4);text-transform:uppercase;letter-spacing:.08em}
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
      <a href="#" class="brand"><div class="brand-mark">.NET</div> .NET Series</a>
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
    <p>🔷 ${escapeHtml(topic.title)} · .NET Series · Built for learners</p>
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
  let clean=stripComments(code).replace(/using\\s+[\\w.]+;/g,'');
  const mm=clean.match(/static\\s+void\\s+Main\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)\\n\\s*\\}\\s*\\}/)
          || clean.match(/static\\s+async\\s+Task\\s+Main\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)\\n\\s*\\}\\s*\\}/);
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
      let d=s.match(/^(int|string|bool|double|long|float|var|decimal)\\s+(\\w+)\\s*=\\s*([\\s\\S]+)$/);
      if(d){vars[d[2]]=evalE(d[3]);continue}
      let dn=s.match(/^(int|string|bool|double|long|float|decimal)\\s+(\\w+)$/);
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

/* ============================================================
   MAIN BUILD
   ============================================================ */
const folders = fs.readdirSync(ROOT)
  .filter(f => /^\d+-/.test(f) && fs.statSync(path.join(ROOT, f)).isDirectory())
  .sort();

console.log(`\n🔷 Found ${folders.length} .NET topic folders.\n`);

let generated = 0, skipped = 0, failed = 0;

for(const folder of folders){
  if(FROM){
    const n = folder.match(/^(\d+)/)[1];
    if(n < FROM) continue;
  }

  const outPath = path.join(ROOT, folder, 'index.html');

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