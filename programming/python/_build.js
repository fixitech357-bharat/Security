/* ============================================================
   Python Topic Generator — fills all folders
   Usage:
     node _build.js              # generate missing/placeholder
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
   CATEGORY DETECTION
   ============================================================ */
function detectCategory(theme) {
  const t = theme.toLowerCase();

  if (/(introduction|intro|overview|use-case|application)/.test(t)) return 'intro';
  if (/(history|guido|origin|evolution|version|release)/.test(t)) return 'history';
  if (/(philosophy|zen|design-goal|pep-?20)/.test(t)) return 'philosophy';
  if (/(implementation|cpython|pypy|jython|ironpython|micropython|interpreter)/.test(t)) return 'implementations';
  if (/(syntax|indentation|comment|statement|keyword|identifier|variable|naming)/.test(t)) return 'syntax';
  if (/(data-type|int|float|string|bool|list|tuple|dict|set|none|number)/.test(t)) return 'datatypes';
  if (/(operator|expression|precedence|arithmetic|comparison|logical)/.test(t)) return 'operators';
  if (/(if|else|elif|switch|match|loop|for|while|control|break|continue)/.test(t)) return 'control';
  if (/(function|def|lambda|argument|parameter|decorator|closure|scope|recursion)/.test(t)) return 'functions';
  if (/(class|object|oop|inherit|polymorph|encapsul|abstraction|method)/.test(t)) return 'oop';
  if (/(module|package|import|pip|venv|virtualenv|pypi)/.test(t)) return 'modules';
  if (/(exception|error|try|except|finally|raise|assert)/.test(t)) return 'exceptions';
  if (/(file|io|read|write|open|path|os|sys)/.test(t)) return 'fileio';
  if (/(iterator|generator|yield|comprehension|map|filter|reduce)/.test(t)) return 'iterators';
  if (/(thread|process|async|await|concurren|parallel|asyncio|gil)/.test(t)) return 'concurrency';
  if (/(test|unittest|pytest|mock|coverage|tdd)/.test(t)) return 'testing';
  if (/(performance|optimi|profil|cprofile|benchmark|speed|memory)/.test(t)) return 'performance';
  if (/(security|hash|crypto|encrypt|secure|injection)/.test(t)) return 'security';
  if (/(web|flask|django|fastapi|http|api|rest|request)/.test(t)) return 'web';
  if (/(data-science|pandas|numpy|matplotlib|analysis|ml|machine-learning|ai)/.test(t)) return 'datascience';
  if (/(database|sql|sqlite|postgres|mysql|orm|sqlalchemy)/.test(t)) return 'database';
  if (/(regex|regular-expression|re-module|pattern-match)/.test(t)) return 'regex';
  if (/(decorator|@|metaclass|descriptor|dunder|magic-method)/.test(t)) return 'advanced';
  if (/(interview|question|practice|exercise|quiz)/.test(t)) return 'interview';
  if (/(project|library|framework|tool|cli|script)/.test(t)) return 'projects';
  return 'general';
}

/* ============================================================
   CATEGORY TEMPLATES
   ============================================================ */
const CATEGORIES = {

  intro: {
    icon: '🐍',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Introduction</span>',
    subtitle: 'An introduction to {THEME} — what it is, why it matters, and how it fits into modern Python.',
    facts: [
      { big: '1991', lbl: 'Released' },
      { big: 'Guido', lbl: 'Creator' },
      { big: 'Python 3', lbl: 'Current' },
      { big: 'Batteries', lbl: 'Stdlib' },
      { big: 'MIT-style', lbl: 'License' }
    ],
    concepts: [
      { icon: '🎯', title: 'What It Is', desc: '{THEME} is foundational to Python — every Python developer encounters it.' },
      { icon: '⚙️', title: 'How It Works', desc: 'The CPython interpreter executes {THEME} using bytecode.' },
      { icon: '🚀', title: 'Why It Matters', desc: 'Understanding {THEME} unlocks Python\'s full power.' },
      { icon: '🌍', title: 'Real-World Use', desc: 'Web, data science, AI, automation — Python is everywhere.' }
    ],
    playground: {
      file: 'intro.py',
      code: `# {THEME} — introduction demo

print("Exploring: {THEME}")

topics = ["Python", "Guido", "PEP 20", "Zen"]
for topic in topics:
    print(f"-> {topic}")

total = sum(range(1, 6))
print(f"Sum 1..5 = {total}")`
    },
    stepCode: [
      '# This is a comment',
      'print("Hello, Python!")',
      '',
      'name = "Alice"',
      'age = 30',
      'print(f"{name} is {age}")',
      '',
      'for i in range(3):',
      '    print(i)'
    ],
    steps: [
      { line: 0, text: '<code>#</code> starts a comment. Python ignores the rest of the line.', tags: ['Comment'] },
      { line: 1, text: '<code>print()</code> — Python\'s built-in output function.', tags: ['print'] },
      { line: 3, text: 'No type declaration needed. Python infers the type.', tags: ['Variable'] },
      { line: 5, text: '<code>f"..."</code> — f-string. Interpolates <code>{name}</code> and <code>{age}</code> inline.', tags: ['f-string'] },
      { line: 7, text: '<code>for i in range(3)</code> — iterates 0, 1, 2. Indentation defines the block.', tags: ['for'] }
    ],
    recap: [
      { title: '{THEME}', text: 'Foundation of every Python program.' },
      { title: 'Interpreted', text: 'Runs via CPython — no compilation step.' },
      { title: 'Dynamic Types', text: 'No type declarations — Python infers.' },
      { title: 'Readable', text: 'Indentation-based syntax reads like English.' }
    ]
  },

  history: {
    icon: '📜',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">History & Evolution</span>',
    subtitle: 'The story of {THEME} — from Guido\'s hobby project to the world\'s most popular language.',
    facts: [
      { big: '1989', lbl: 'Started' },
      { big: '1991', lbl: 'v0.9.0' },
      { big: '2000', lbl: 'Python 2' },
      { big: '2008', lbl: 'Python 3' },
      { big: '2020', lbl: 'Py2 EOL' }
    ],
    concepts: [
      { icon: '🔬', title: 'Origin', desc: 'Where {THEME} came from and the problem it solved.' },
      { icon: '📛', title: 'Evolution', desc: 'How {THEME} changed across Python versions.' },
      { icon: '📖', title: 'Milestones', desc: 'Key moments in the history of {THEME}.' },
      { icon: '🌍', title: 'Legacy', desc: 'How {THEME} shaped modern software.' }
    ],
    playground: {
      file: 'history.py',
      code: `# Python timeline

releases = [
    ("v0.9.0", 1991),
    ("Python 1.0", 1994),
    ("Python 2.0", 2000),
    ("Python 3.0", 2008),
    ("Python 3.12", 2023),
    ("Python 3.13", 2024),
]

for version, year in releases:
    print(f"{year} -> {version}")`
    },
    stepCode: [
      'releases = [',
      '    ("v0.9.0", 1991),',
      '    ("Python 2.0", 2000),',
      '    ("Python 3.0", 2008),',
      ']',
      '',
      'for version, year in releases:',
      '    print(year, version)'
    ],
    steps: [
      { line: 0, text: 'A list of <strong>tuples</strong> — Python\'s lightweight data bundling.', tags: ['Tuple'] },
      { line: 1, text: 'Python 0.9.0 released in 1991 by Guido van Rossum.', tags: ['History'] },
      { line: 2, text: 'Python 2.0 in 2000 introduced list comprehensions and garbage collection.', tags: ['Python 2'] },
      { line: 3, text: 'Python 3.0 in 2008 — major redesign, not backward compatible.', tags: ['Python 3'] },
      { line: 6, text: 'Tuple unpacking in the loop — elegant and Pythonic.', tags: ['Unpacking'] }
    ],
    recap: [
      { title: '1989', text: 'Guido starts Python as a Christmas hobby project.' },
      { title: '1991', text: 'First public release (v0.9.0).' },
      { title: '2008', text: 'Python 3 — cleaner, more consistent.' },
      { title: '2020', text: 'Python 2 reaches end of life.' }
    ]
  },

  philosophy: {
    icon: '🧘',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Design Philosophy</span>',
    subtitle: 'The principles behind {THEME} — why Python looks and feels the way it does.',
    facts: [
      { big: 'PEP 20', lbl: 'The Zen' },
      { big: 'Readability', lbl: 'Matters' },
      { big: 'Explicit', lbl: 'Over Implicit' },
      { big: 'Simple', lbl: 'Over Complex' },
      { big: 'One Way', lbl: 'To Do It' }
    ],
    concepts: [
      { icon: '🧘', title: 'The Zen', desc: 'Tim Peters\' 19 aphorisms guide Python design.' },
      { icon: '📖', title: 'Readability', desc: 'Code is read more than it is written.' },
      { icon: '⚙️', title: 'Explicit > Implicit', desc: 'No magic. Clarity wins.' },
      { icon: '🌍', title: 'Batteries Included', desc: 'A rich standard library ships with Python.' }
    ],
    playground: {
      file: 'zen.py',
      code: `import this

# Prints "The Zen of Python" by Tim Peters
# Beautiful is better than ugly.
# Explicit is better than implicit.
# Simple is better than complex.
# Readability counts.

# Example of Pythonic code
numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers]
print(squares)

# vs non-Pythonic
squares2 = []
for n in numbers:
    squares2.append(n ** 2)
print(squares2)

# Same result. First is more "Pythonic".`
    },
    stepCode: [
      'import this',
      '',
      'numbers = [1, 2, 3, 4, 5]',
      'squares = [n ** 2 for n in numbers]',
      'print(squares)',
      '',
      '# Non-Pythonic equivalent:',
      '# squares = []',
      '# for n in numbers: squares.append(n ** 2)'
    ],
    steps: [
      { line: 0, text: '<code>import this</code> — a legendary Easter egg. Prints the Zen of Python.', tags: ['Easter Egg'] },
      { line: 2, text: 'A simple list of numbers.', tags: ['List'] },
      { line: 3, text: '<strong>List comprehension</strong> — one-line, readable, Pythonic.', tags: ['Comprehension'] },
      { line: 4, text: 'Output: <code>[1, 4, 9, 16, 25]</code>.', tags: ['Output'] }
    ],
    recap: [
      { title: 'PEP 20', text: 'The Zen of Python — 19 guiding principles.' },
      { title: 'Readable', text: 'Code is read far more often than written.' },
      { title: 'Explicit', text: 'No hidden behavior. Clarity above all.' },
      { title: 'Pythonic', text: 'Idiomatic code that embraces the language.' }
    ]
  },

  implementations: {
    icon: '⚙️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Python Implementations</span>',
    subtitle: 'Understanding {THEME} — the engines that run Python code.',
    facts: [
      { big: 'CPython', lbl: 'Reference' },
      { big: 'PyPy', lbl: 'JIT' },
      { big: 'Jython', lbl: 'JVM' },
      { big: 'IronPython', lbl: '.NET' },
      { big: 'MicroPython', lbl: 'Embedded' }
    ],
    concepts: [
      { icon: '🐍', title: 'CPython', desc: 'The reference implementation. Written in C. What you get from python.org.' },
      { icon: '⚡', title: 'PyPy', desc: 'JIT-compiled Python — often 4-10x faster than CPython.' },
      { icon: '☕', title: 'Jython', desc: 'Python on the JVM. Interoperates with Java.' },
      { icon: '🔷', title: 'IronPython', desc: 'Python for .NET — interoperability with C#.' }
    ],
    playground: {
      file: 'implementations.py',
      code: `import sys
import platform

print(f"Implementation: {platform.python_implementation()}")
print(f"Version: {sys.version.split()[0]}")
print(f"Platform: {platform.system()}")
print(f"Byte order: {sys.byteorder}")

# CPython is what you're most likely running
# Try PyPy for speed, Jython for JVM, IronPython for .NET`
    },
    stepCode: [
      'import sys',
      'import platform',
      '',
      'print(platform.python_implementation())',
      'print(sys.version.split()[0])',
      'print(sys.byteorder)'
    ],
    steps: [
      { line: 0, text: '<code>sys</code> — core system module, always available.', tags: ['sys'] },
      { line: 1, text: '<code>platform</code> — info about the runtime and OS.', tags: ['platform'] },
      { line: 3, text: 'Returns <code>CPython</code>, <code>PyPy</code>, <code>Jython</code>, etc.', tags: ['Output'] },
      { line: 4, text: 'Version string like <code>3.12.0</code>.', tags: ['Version'] },
      { line: 5, text: 'Byte order: <code>little</code> or <code>big</code>.', tags: ['Endian'] }
    ],
    recap: [
      { title: 'CPython', text: 'Reference implementation. Written in C.' },
      { title: 'PyPy', text: 'JIT-compiled. Up to 10x faster in loops.' },
      { title: 'Jython/IronPython', text: 'Python on JVM and .NET runtimes.' },
      { title: 'MicroPython', text: 'Runs on microcontrollers.' }
    ]
  },

  syntax: {
    icon: '📝',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Syntax</span>',
    subtitle: 'How {THEME} works in Python — indentation, statements, and rules.',
    facts: [
      { big: 'Indentation', lbl: 'Defines Blocks' },
      { big: '4 spaces', lbl: 'Standard' },
      { big: '#', lbl: 'Comment' },
      { big: 'snake_case', lbl: 'Convention' },
      { big: ':', lbl: 'Block Start' }
    ],
    concepts: [
      { icon: '📐', title: 'Indentation', desc: 'Python uses indentation for blocks — no braces.' },
      { icon: '📏', title: 'Consistency', desc: 'Pick 4 spaces and stick with it. Mixed tabs/spaces = error.' },
      { icon: '📝', title: 'Statements', desc: 'One per line. No semicolons needed (but allowed).' },
      { icon: '💬', title: 'Comments', desc: '<code>#</code> for single line, <code>""" """</code> for docstrings.' }
    ],
    playground: {
      file: 'syntax.py',
      code: `# This is a comment

x = 10
y = 20
result = x + y
print(f"{x} + {y} = {result}")

# Indentation defines blocks
if result > 25:
    print("Large")
    if result > 28:
        print("Very large")
else:
    print("Small")

# Multiple assignment
a, b, c = 1, 2, 3
print(a, b, c)`
    },
    stepCode: [
      '# Comment',
      'x = 10',
      'if x > 5:',
      '    print("big")',
      'else:',
      '    print("small")',
      '',
      'a, b = 1, 2  # multiple assignment'
    ],
    steps: [
      { line: 0, text: '<code>#</code> — comment. Python ignores this line.', tags: ['Comment'] },
      { line: 1, text: 'Assignment. No <code>;</code> needed, no type declared.', tags: ['Assign'] },
      { line: 2, text: '<code>if ...:</code> — colon ends the header. Block follows indented.', tags: ['if'] },
      { line: 3, text: '<strong>4 spaces</strong> of indentation define the block body.', tags: ['Indent'] },
      { line: 5, text: '<code>else:</code> — same indentation level as <code>if</code>.', tags: ['else'] },
      { line: 7, text: 'Tuple unpacking — assign multiple variables in one line.', tags: ['Unpack'] }
    ],
    recap: [
      { title: 'Indentation = Blocks', text: 'No braces. Whitespace matters.' },
      { title: 'Colons', text: '<code>:</code> ends <code>if</code>, <code>for</code>, <code>def</code>, <code>class</code> headers.' },
      { title: '4 Spaces', text: 'PEP 8 standard. Never mix tabs and spaces.' },
      { title: 'Readable', text: 'Python forces clean, consistent formatting.' }
    ]
  },

  datatypes: {
    icon: '📦',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Data Types</span>',
    subtitle: 'Python\'s data types covered via {THEME} — dynamic, flexible, powerful.',
    facts: [
      { big: 'int', lbl: 'Unlimited' },
      { big: 'float', lbl: '64-bit' },
      { big: 'str', lbl: 'Unicode' },
      { big: 'bool', lbl: 'True/False' },
      { big: 'None', lbl: 'Null' }
    ],
    concepts: [
      { icon: '🔢', title: 'Numbers', desc: '<code>int</code> (unlimited), <code>float</code>, <code>complex</code>.' },
      { icon: '📝', title: 'Strings', desc: '<code>str</code> — immutable Unicode sequences.' },
      { icon: '📦', title: 'Collections', desc: '<code>list</code>, <code>tuple</code>, <code>dict</code>, <code>set</code>.' },
      { icon: '✅', title: 'Booleans', desc: '<code>True</code> and <code>False</code> — subclass of int.' }
    ],
    playground: {
      file: 'types.py',
      code: `# Core types
age = 30                    # int
price = 19.99               # float
name = "Alice"              # str
is_active = True            # bool
nothing = None              # NoneType

print(type(age).__name__, age)
print(type(price).__name__, price)
print(type(name).__name__, name)
print(type(is_active).__name__, is_active)
print(type(nothing).__name__, nothing)

# Collections
numbers = [1, 2, 3]         # list
point = (10, 20)            # tuple
person = {"name": "Bob"}    # dict
colors = {"red", "green"}   # set

print(numbers, point, person, colors)`
    },
    stepCode: [
      'age = 30',
      'price = 19.99',
      'name = "Alice"',
      'is_active = True',
      'nothing = None',
      '',
      'print(type(age).__name__)',
      'print(type(name).__name__)'
    ],
    steps: [
      { line: 0, text: '<code>int</code> — Python integers are <strong>unlimited</strong> in size.', tags: ['int'] },
      { line: 1, text: '<code>float</code> — 64-bit double precision by default.', tags: ['float'] },
      { line: 2, text: '<code>str</code> — Unicode text. Single or double quotes.', tags: ['str'] },
      { line: 3, text: '<code>True</code> / <code>False</code> — capitalized in Python (not true/false).', tags: ['bool'] },
      { line: 4, text: '<code>None</code> — Python\'s null value. Capitalized.', tags: ['None'] },
      { line: 6, text: '<code>type(x).__name__</code> — the runtime type name.', tags: ['type'] }
    ],
    recap: [
      { title: 'Dynamic', text: 'No type declarations — Python infers.' },
      { title: 'Unlimited ints', text: 'No overflow. Ever.' },
      { title: 'Immutable str', text: 'Strings can\'t be modified in-place.' },
      { title: 'None', text: 'Python\'s null. Capital N.' }
    ]
  },

  operators: {
    icon: '➕',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Operators</span>',
    subtitle: 'Python operators for {THEME} — arithmetic, comparison, logical, and more.',
    facts: [
      { big: '+ - * /', lbl: 'Arithmetic' },
      { big: '//', lbl: 'Floor Div' },
      { big: '**', lbl: 'Power' },
      { big: 'and/or/not', lbl: 'Logical' },
      { big: 'in', lbl: 'Membership' }
    ],
    concepts: [
      { icon: '➕', title: 'Arithmetic', desc: '<code>+ - * / // % **</code> — includes power and floor division.' },
      { icon: '🔍', title: 'Comparison', desc: '<code>== != &lt; &lt;= &gt; &gt;=</code> — return <code>bool</code>.' },
      { icon: '🔗', title: 'Logical', desc: '<code>and</code>, <code>or</code>, <code>not</code> — words, not symbols.' },
      { icon: '🎯', title: 'Special', desc: '<code>in</code>, <code>is</code>, <code>not in</code>, <code>is not</code>.' }
    ],
    playground: {
      file: 'operators.py',
      code: `a, b = 10, 3

print(f"a + b = {a + b}")
print(f"a - b = {a - b}")
print(f"a * b = {a * b}")
print(f"a / b = {a / b}")     # true division -> float
print(f"a // b = {a // b}")   # floor division -> int
print(f"a % b = {a % b}")     # modulo
print(f"a ** b = {a ** b}")   # power

# Comparison
print(a > b, a == b, a != b)

# Logical
print(a > 5 and b < 5)
print(a > 100 or b < 5)
print(not (a == b))

# Membership
print(3 in [1, 2, 3])
print("py" in "python")`
    },
    stepCode: [
      'a, b = 10, 3',
      'print(a / b)   # 3.3333 -> float',
      'print(a // b)  # 3      -> int',
      'print(a % b)   # 1      -> remainder',
      'print(a ** b)  # 1000   -> power',
      '',
      'print(a > 5 and b < 5)',
      'print(3 in [1, 2, 3])'
    ],
    steps: [
      { line: 0, text: 'Multiple assignment: <code>a=10</code> and <code>b=3</code> in one line.', tags: ['Assign'] },
      { line: 1, text: '<code>/</code> — true division. Always returns a float.', tags: ['/'] },
      { line: 2, text: '<code>//</code> — floor division. Returns an integer.', tags: ['//'] },
      { line: 3, text: '<code>%</code> — modulo (remainder).', tags: ['%'] },
      { line: 4, text: '<code>**</code> — power operator. <code>10**3 = 1000</code>.', tags: ['**'] },
      { line: 6, text: '<code>and</code> / <code>or</code> / <code>not</code> — Python uses words.', tags: ['Logical'] },
      { line: 7, text: '<code>in</code> — membership test. Works on lists, strings, dicts, sets.', tags: ['in'] }
    ],
    recap: [
      { title: 'True Division', text: '<code>/</code> always returns float.' },
      { title: 'Floor Division', text: '<code>//</code> returns int.' },
      { title: 'Power', text: '<code>**</code>, not <code>^</code> (^ is XOR).' },
      { title: 'and/or/not', text: 'Python uses words, not <code>&amp;&amp;</code>/<code>||</code>/<code>!</code>.' }
    ]
  },

  control: {
    icon: '🔀',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Control Flow</span>',
    subtitle: 'Controlling the flow of Python programs with {THEME}.',
    facts: [
      { big: 'if/elif/else', lbl: 'Branch' },
      { big: 'for', lbl: 'Iterate' },
      { big: 'while', lbl: 'Condition' },
      { big: 'match', lbl: 'Pattern (3.10+)' },
      { big: 'break/continue', lbl: 'Control' }
    ],
    concepts: [
      { icon: '🔀', title: 'Branching', desc: '<code>if</code>, <code>elif</code>, <code>else</code> — decide what to run.' },
      { icon: '🔁', title: 'Loops', desc: '<code>for</code> and <code>while</code> — repeat code.' },
      { icon: '⚡', title: 'Pattern Matching', desc: '<code>match/case</code> — added in Python 3.10.' },
      { icon: '⏹️', title: 'Jump Control', desc: '<code>break</code>, <code>continue</code>, <code>pass</code>.' }
    ],
    playground: {
      file: 'control.py',
      code: `score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")

# for loop
for i in range(1, 4):
    print(f"Iteration {i}")

# while loop
n = 3
while n > 0:
    print(f"Countdown {n}")
    n -= 1

# match statement (Python 3.10+)
command = "start"
match command:
    case "start":
        print("Starting...")
    case "stop":
        print("Stopping...")
    case _:
        print("Unknown")`
    },
    stepCode: [
      'score = 85',
      'if score >= 90:',
      '    print("A")',
      'elif score >= 80:',
      '    print("B")',
      'else:',
      '    print("F")',
      '',
      'for i in range(3):',
      '    print(i)'
    ],
    steps: [
      { line: 1, text: 'First condition checked. If true, its body runs.', tags: ['if'] },
      { line: 3, text: '<code>elif</code> — Python\'s "else if". Only checked if previous was false.', tags: ['elif'] },
      { line: 4, text: 'Body runs (85 ≥ 80). Prints "B". Rest of chain skipped.', tags: ['Branch'] },
      { line: 6, text: '<code>else</code> — the fallback.', tags: ['else'] },
      { line: 8, text: '<code>for i in range(3)</code> — iterates 0, 1, 2.', tags: ['for'] }
    ],
    recap: [
      { title: 'elif', text: 'Python uses <code>elif</code>, not "else if".' },
      { title: 'for ... in', text: 'Iterate over any iterable directly.' },
      { title: 'match/case', text: 'Python 3.10+ structural pattern matching.' },
      { title: 'No switch', text: 'Use match/case or if/elif chains.' }
    ]
  },

  functions: {
    icon: '🔧',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Functions</span>',
    subtitle: 'Defining and using {THEME} in Python — clean, reusable, powerful.',
    facts: [
      { big: 'def', lbl: 'Keyword' },
      { big: 'return', lbl: 'Value' },
      { big: '*args', lbl: 'Var Positional' },
      { big: '**kwargs', lbl: 'Var Keyword' },
      { big: 'lambda', lbl: 'Anonymous' }
    ],
    concepts: [
      { icon: '🔧', title: 'Defining', desc: '<code>def name(params):</code> — the standard syntax.' },
      { icon: '🔁', title: 'Arguments', desc: 'Positional, keyword, default, <code>*args</code>, <code>**kwargs</code>.' },
      { icon: '🎯', title: 'Return Values', desc: 'Use <code>return</code>. Implicit <code>None</code> if missing.' },
      { icon: '⚡', title: 'Lambdas', desc: '<code>lambda x: x*2</code> — small anonymous functions.' }
    ],
    playground: {
      file: 'functions.py',
      code: `def add(a, b):
    return a + b

def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

def total(*numbers):
    return sum(numbers)

def show_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print(add(3, 5))
print(greet("Alice"))
print(greet("Bob", greeting="Hi"))
print(total(1, 2, 3, 4, 5))
show_info(name="Alice", age=30)

# Lambda
double = lambda x: x * 2
print(double(21))`
    },
    stepCode: [
      'def add(a, b):',
      '    return a + b',
      '',
      'def greet(name, greeting="Hello"):',
      '    return f"{greeting}, {name}!"',
      '',
      'print(add(3, 5))',
      'print(greet("Alice"))',
      'print(greet("Bob", greeting="Hi"))'
    ],
    steps: [
      { line: 0, text: '<code>def</code> — keyword to define a function.', tags: ['def'] },
      { line: 1, text: '<code>return</code> — send a value back. Body is indented.', tags: ['return'] },
      { line: 3, text: 'Default parameter value: <code>greeting="Hello"</code>.', tags: ['Default'] },
      { line: 6, text: 'Call with positional args.', tags: ['Call'] },
      { line: 8, text: 'Call with keyword argument — more readable.', tags: ['Keyword'] }
    ],
    recap: [
      { title: 'def', text: 'Define functions with <code>def name():</code>.' },
      { title: 'Defaults', text: 'Parameters can have default values.' },
      { title: '*args', text: 'Collect variable positional args into a tuple.' },
      { title: '**kwargs', text: 'Collect variable keyword args into a dict.' }
    ]
  },

  oop: {
    icon: '🏗️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Object-Oriented Python</span>',
    subtitle: 'Classes, objects, and {THEME} in Python.',
    facts: [
      { big: 'class', lbl: 'Keyword' },
      { big: '__init__', lbl: 'Constructor' },
      { big: 'self', lbl: 'Instance' },
      { big: 'Multiple', lbl: 'Inheritance' },
      { big: 'Dunder', lbl: 'Methods' }
    ],
    concepts: [
      { icon: '🏗️', title: 'Classes', desc: 'Blueprints for objects. Defined with <code>class</code>.' },
      { icon: '🎯', title: 'Methods', desc: 'Functions that belong to the class. First arg is <code>self</code>.' },
      { icon: '🧬', title: 'Inheritance', desc: 'Reuse code by subclassing. Python supports multiple inheritance.' },
      { icon: '✨', title: 'Dunder Methods', desc: '<code>__init__</code>, <code>__str__</code>, <code>__len__</code> customize behavior.' }
    ],
    playground: {
      file: 'oop.py',
      code: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

    def __str__(self):
        return f"Animal({self.name})"


class Dog(Animal):
    def speak(self):
        return "Woof!"


class Cat(Animal):
    def speak(self):
        return "Meow!"


animals = [Dog("Rex"), Cat("Whiskers")]
for a in animals:
    print(f"{a.name} says {a.speak()}")`
    },
    stepCode: [
      'class Animal:',
      '    def __init__(self, name):',
      '        self.name = name',
      '',
      '    def speak(self):',
      '        return "..."',
      '',
      'class Dog(Animal):',
      '    def speak(self):',
      '        return "Woof!"'
    ],
    steps: [
      { line: 0, text: '<code>class</code> — defines a class. Capitalized by convention.', tags: ['class'] },
      { line: 1, text: '<code>__init__</code> — constructor. Called when you create an instance.', tags: ['__init__'] },
      { line: 2, text: '<code>self</code> — refers to the instance. Always the first arg.', tags: ['self'] },
      { line: 7, text: '<code>class Dog(Animal)</code> — inherits from <code>Animal</code>.', tags: ['Inherit'] },
      { line: 8, text: '<strong>Method override</strong> — Dog replaces <code>speak()</code>.', tags: ['Override'] }
    ],
    recap: [
      { title: 'class', text: 'Define classes with the <code>class</code> keyword.' },
      { title: '__init__', text: 'The constructor. Called on instantiation.' },
      { title: 'self', text: 'Always the first parameter of instance methods.' },
      { title: 'Multiple inheritance', text: 'Python allows inheriting from multiple classes.' }
    ]
  },

  modules: {
    icon: '📦',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Modules & Packages</span>',
    subtitle: 'Organizing Python code with {THEME} — modules, packages, and virtual environments.',
    facts: [
      { big: 'import', lbl: 'Keyword' },
      { big: 'pip', lbl: 'Installer' },
      { big: 'venv', lbl: 'Isolation' },
      { big: 'PyPI', lbl: 'Repository' },
      { big: '__init__', lbl: 'Package' }
    ],
    concepts: [
      { icon: '📦', title: 'Modules', desc: 'A <code>.py</code> file — anything importable.' },
      { icon: '📁', title: 'Packages', desc: 'A folder of modules with <code>__init__.py</code>.' },
      { icon: '🔧', title: 'pip', desc: 'The Python package installer.' },
      { icon: '🔒', title: 'Virtual Envs', desc: 'Isolated environments for each project.' }
    ],
    playground: {
      file: 'modules.py',
      code: `# Standard library imports
import os
import sys
import math
from datetime import datetime

# Use them
print("Current dir:", os.getcwd())
print("Python version:", sys.version.split()[0])
print("Pi:", math.pi)
print("Now:", datetime.now().strftime("%Y-%m-%d"))

# Import specific function
from math import sqrt, pow
print(sqrt(16))
print(pow(2, 10))

# Aliases
import json as j
data = j.dumps({"name": "Alice", "age": 30})
print(data)`
    },
    stepCode: [
      'import os',
      'import sys',
      'from datetime import datetime',
      '',
      'print(os.getcwd())',
      'print(sys.version.split()[0])',
      'print(datetime.now().year)',
      '',
      'import math as m',
      'print(m.pi)'
    ],
    steps: [
      { line: 0, text: '<code>import os</code> — loads the entire module.', tags: ['import'] },
      { line: 2, text: '<code>from X import Y</code> — imports a specific name.', tags: ['from'] },
      { line: 4, text: 'Access module members with dot notation.', tags: ['Access'] },
      { line: 8, text: '<code>import math as m</code> — alias for brevity.', tags: ['Alias'] },
      { line: 9, text: '<code>m.pi</code> — access via the alias.', tags: ['Use'] }
    ],
    recap: [
      { title: 'import', text: 'Every <code>.py</code> file is a module.' },
      { title: 'from X import Y', text: 'Bring specific names into your namespace.' },
      { title: 'venv', text: '<code>python -m venv env</code> — isolate project deps.' },
      { title: 'pip', text: '<code>pip install package_name</code> — the standard installer.' }
    ]
  },

  exceptions: {
    icon: '⚠️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Exceptions</span>',
    subtitle: 'Handling errors in Python with {THEME}.',
    facts: [
      { big: 'try/except', lbl: 'Handler' },
      { big: 'finally', lbl: 'Always' },
      { big: 'raise', lbl: 'Throw' },
      { big: 'Exception', lbl: 'Base' },
      { big: 'with', lbl: 'Context' }
    ],
    concepts: [
      { icon: '🎯', title: 'try/except', desc: 'Catch exceptions that would crash your program.' },
      { icon: '🔒', title: 'finally', desc: 'Code that always runs — even if an exception occurs.' },
      { icon: '🚨', title: 'raise', desc: 'Explicitly throw an exception.' },
      { icon: '✨', title: 'Custom Exceptions', desc: 'Subclass <code>Exception</code> for domain-specific errors.' }
    ],
    playground: {
      file: 'exceptions.py',
      code: `def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return None
    except TypeError as e:
        print(f"Type error: {e}")
        return None

print(divide(10, 2))
print(divide(10, 0))
print(divide(10, "x"))

# finally always runs
try:
    x = 1 / 0
except ZeroDivisionError:
    print("Caught")
finally:
    print("Always runs")

# Custom exception
class MyError(Exception):
    pass

try:
    raise MyError("Something bad")
except MyError as e:
    print(f"Custom: {e}")`
    },
    stepCode: [
      'try:',
      '    result = 10 / 0',
      'except ZeroDivisionError:',
      '    print("Divide by zero")',
      'finally:',
      '    print("Always runs")',
      '',
      'class MyError(Exception): pass',
      'raise MyError("custom")'
    ],
    steps: [
      { line: 0, text: '<code>try:</code> — code that might raise an exception.', tags: ['try'] },
      { line: 2, text: '<code>except Type:</code> — catch a specific exception type.', tags: ['except'] },
      { line: 4, text: '<code>finally:</code> — runs whether or not an exception occurred.', tags: ['finally'] },
      { line: 7, text: 'Custom exceptions inherit from <code>Exception</code>.', tags: ['Custom'] },
      { line: 8, text: '<code>raise</code> — explicitly throw an exception.', tags: ['raise'] }
    ],
    recap: [
      { title: 'try/except', text: 'Catch specific exceptions — never use bare <code>except:</code>.' },
      { title: 'finally', text: 'Always executes — perfect for cleanup.' },
      { title: 'raise', text: 'Throw exceptions when a condition fails.' },
      { title: 'Custom', text: 'Subclass <code>Exception</code> for domain errors.' }
    ]
  },

  fileio: {
    icon: '📁',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">File I/O</span>',
    subtitle: 'Reading and writing files in Python using {THEME}.',
    facts: [
      { big: 'open()', lbl: 'Open File' },
      { big: 'with', lbl: 'Auto Close' },
      { big: '"r"/"w"/"a"', lbl: 'Modes' },
      { big: 'utf-8', lbl: 'Encoding' },
      { big: 'pathlib', lbl: 'Modern' }
    ],
    concepts: [
      { icon: '📖', title: 'Reading', desc: '<code>open().read()</code>, <code>readlines()</code>, iterate lines.' },
      { icon: '✍️', title: 'Writing', desc: '<code>open(..., "w").write()</code> — overwrites the file.' },
      { icon: '🔒', title: 'Context Manager', desc: '<code>with open(...) as f:</code> auto-closes the file.' },
      { icon: '📁', title: 'pathlib', desc: 'The modern, object-oriented path API.' }
    ],
    playground: {
      file: 'fileio.py',
      code: `# Write to a file
with open("demo.txt", "w") as f:
    f.write("Line 1: Hello\\n")
    f.write("Line 2: World\\n")
    f.write("Line 3: Python\\n")

print("Wrote demo.txt")

# Read the whole file
with open("demo.txt", "r") as f:
    content = f.read()
print("Full content:")
print(content)

# Read line by line
with open("demo.txt", "r") as f:
    for i, line in enumerate(f, 1):
        print(f"{i}: {line.rstrip()}")

# Append
with open("demo.txt", "a") as f:
    f.write("Line 4: Appended\\n")`
    },
    stepCode: [
      'with open("demo.txt", "w") as f:',
      '    f.write("Hello\\n")',
      '',
      'with open("demo.txt", "r") as f:',
      '    content = f.read()',
      '    print(content)',
      '',
      'with open("demo.txt", "a") as f:',
      '    f.write("Appended\\n")'
    ],
    steps: [
      { line: 0, text: '<code>with open(...)</code> — context manager. File auto-closes.', tags: ['with'] },
      { line: 1, text: '<code>f.write()</code> — writes a string. <code>\\n</code> for newline.', tags: ['write'] },
      { line: 3, text: '<code>"r"</code> — read mode. Fails if the file doesn\'t exist.', tags: ['read'] },
      { line: 4, text: '<code>f.read()</code> — reads the entire file as one string.', tags: ['read'] },
      { line: 7, text: '<code>"a"</code> — append mode. Adds to the end.', tags: ['append'] }
    ],
    recap: [
      { title: 'with open', text: 'Always use it — auto-closes even on error.' },
      { title: 'Modes', text: '<code>"r"</code> read, <code>"w"</code> write, <code>"a"</code> append.' },
      { title: 'utf-8', text: 'Pass <code>encoding="utf-8"</code> for portability.' },
      { title: 'pathlib', text: 'Modern path handling — <code>Path("file.txt")</code>.' }
    ]
  },

  iterators: {
    icon: '🔄',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Iterators & Generators</span>',
    subtitle: 'Powerful iteration patterns in Python with {THEME}.',
    facts: [
      { big: 'yield', lbl: 'Generator' },
      { big: 'iter()', lbl: 'Iterator' },
      { big: '[...]', lbl: 'Comprehension' },
      { big: '(...)', lbl: 'Gen Expr' },
      { big: 'Lazy', lbl: 'Evaluation' }
    ],
    concepts: [
      { icon: '🔄', title: 'Iterators', desc: 'Objects with <code>__iter__</code> and <code>__next__</code>.' },
      { icon: '⚡', title: 'Generators', desc: 'Functions with <code>yield</code> — produce values lazily.' },
      { icon: '📋', title: 'Comprehensions', desc: 'Concise syntax for lists, sets, and dicts.' },
      { icon: '🧠', title: 'Memory', desc: 'Generators use constant memory regardless of size.' }
    ],
    playground: {
      file: 'iterators.py',
      code: `# List comprehension
squares = [n ** 2 for n in range(10)]
print("Squares:", squares)

# With condition
evens = [n for n in range(20) if n % 2 == 0]
print("Evens:", evens)

# Dict comprehension
lengths = {word: len(word) for word in ["hi", "hello", "hey"]}
print("Lengths:", lengths)

# Generator function
def count_up(n):
    for i in range(n):
        yield i

print("Generator:")
for value in count_up(5):
    print(value)

# Generator expression
gen = (n * 2 for n in range(5))
print("Doubled:", list(gen))`
    },
    stepCode: [
      'squares = [n ** 2 for n in range(5)]',
      'evens = [n for n in range(20) if n % 2 == 0]',
      '',
      'def count_up(n):',
      '    for i in range(n):',
      '        yield i',
      '',
      'for value in count_up(5):',
      '    print(value)'
    ],
    steps: [
      { line: 0, text: '<strong>List comprehension</strong> — one-line list building.', tags: ['Comp'] },
      { line: 1, text: 'Add a filter with <code>if</code> at the end.', tags: ['Filter'] },
      { line: 3, text: '<code>def</code> with <code>yield</code> = a <strong>generator function</strong>.', tags: ['Generator'] },
      { line: 5, text: '<code>yield</code> — produces one value at a time. Pauses execution.', tags: ['yield'] },
      { line: 7, text: 'Generators are lazy — they produce values on demand.', tags: ['Lazy'] }
    ],
    recap: [
      { title: 'Comprehensions', text: 'Concise, fast, Pythonic list/dict/set building.' },
      { title: 'yield', text: 'Generators produce values lazily.' },
      { title: 'Memory', text: 'Generators use O(1) memory regardless of size.' },
      { title: 'Generator Expression', text: '<code>(expr for x in iterable)</code> — lazy version.' }
    ]
  },

  concurrency: {
    icon: '⚡',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Concurrency</span>',
    subtitle: 'Running tasks in parallel or concurrently in Python using {THEME}.',
    facts: [
      { big: 'GIL', lbl: 'Lock' },
      { big: 'threading', lbl: 'Threads' },
      { big: 'multiprocessing', lbl: 'Processes' },
      { big: 'asyncio', lbl: 'Async' },
      { big: 'async/await', lbl: 'Coroutines' }
    ],
    concepts: [
      { icon: '🧵', title: 'Threads', desc: 'Good for I/O-bound tasks. GIL limits CPU-bound use.' },
      { icon: '🔧', title: 'Processes', desc: 'True parallelism. Each has its own interpreter.' },
      { icon: '⚡', title: 'Async', desc: 'Single-threaded concurrency via <code>async/await</code>.' },
      { icon: '🔒', title: 'The GIL', desc: 'Global Interpreter Lock prevents true multi-thread CPU parallelism in CPython.' }
    ],
    playground: {
      file: 'concurrency.py',
      code: `import threading
import time

def worker(name, delay):
    print(f"{name} starting")
    time.sleep(delay)
    print(f"{name} done")

# Create threads
t1 = threading.Thread(target=worker, args=("Thread-1", 0.5))
t2 = threading.Thread(target=worker, args=("Thread-2", 0.3))

t1.start()
t2.start()

t1.join()
t2.join()

print("All threads finished")`
    },
    stepCode: [
      'import threading',
      '',
      'def worker(name):',
      '    print(f"{name} starting")',
      '',
      't1 = threading.Thread(target=worker, args=("A",))',
      't2 = threading.Thread(target=worker, args=("B",))',
      't1.start()',
      't2.start()',
      't1.join()',
      't2.join()'
    ],
    steps: [
      { line: 0, text: '<code>threading</code> — standard library for threads.', tags: ['import'] },
      { line: 2, text: 'The function each thread will run.', tags: ['Worker'] },
      { line: 5, text: '<code>Thread(target=..., args=...)</code> — configure the thread.', tags: ['Thread'] },
      { line: 7, text: '<code>.start()</code> — begin execution.', tags: ['start'] },
      { line: 9, text: '<code>.join()</code> — wait for the thread to finish.', tags: ['join'] }
    ],
    recap: [
      { title: 'GIL', text: 'Threads can\'t run Python bytecode in parallel.' },
      { title: 'I/O-bound', text: 'Use <code>threading</code> or <code>asyncio</code>.' },
      { title: 'CPU-bound', text: 'Use <code>multiprocessing</code> for real parallelism.' },
      { title: 'async/await', text: 'Modern, high-performance for I/O.' }
    ]
  },

  testing: {
    icon: '🧪',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Testing</span>',
    subtitle: 'Testing Python code with {THEME} — unit tests, mocks, and coverage.',
    facts: [
      { big: 'unittest', lbl: 'Stdlib' },
      { big: 'pytest', lbl: 'Popular' },
      { big: 'mock', lbl: 'Isolation' },
      { big: 'coverage', lbl: 'Measure' },
      { big: 'assert', lbl: 'Check' }
    ],
    concepts: [
      { icon: '🧪', title: 'Unit Tests', desc: 'Small tests for individual functions.' },
      { icon: '✅', title: 'Assertions', desc: 'Use <code>assert</code> to check expected outcomes.' },
      { icon: '🎭', title: 'Mocks', desc: 'Replace dependencies with fakes.' },
      { icon: '📊', title: 'Coverage', desc: 'Measure what fraction of code is tested.' }
    ],
    playground: {
      file: 'tests.py',
      code: `def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0
    print("PASS: test_add")


def test_divide():
    assert divide(10, 2) == 5
    try:
        divide(10, 0)
        assert False, "Should have raised"
    except ValueError:
        pass
    print("PASS: test_divide")


test_add()
test_divide()
print("All tests passed!")`
    },
    stepCode: [
      'def add(a, b):',
      '    return a + b',
      '',
      'def test_add():',
      '    assert add(2, 3) == 5',
      '    assert add(-1, 1) == 0',
      '    print("PASS")',
      '',
      'test_add()'
    ],
    steps: [
      { line: 0, text: 'Code under test — simple, pure function.', tags: ['Code'] },
      { line: 3, text: 'Test function — convention: <code>test_*</code>.', tags: ['Test'] },
      { line: 4, text: '<code>assert</code> — raises <code>AssertionError</code> if false.', tags: ['assert'] },
      { line: 5, text: 'Boundary case: negative numbers.', tags: ['Edge'] },
      { line: 8, text: 'Run the test. In pytest, this would be automatic.', tags: ['Run'] }
    ],
    recap: [
      { title: 'pytest', text: 'The modern standard. Simpler than unittest.' },
      { title: 'assert', text: 'Built-in keyword. Fails fast on mismatch.' },
      { title: 'Coverage', text: '<code>coverage.py</code> measures untested lines.' },
      { title: 'AAA', text: 'Arrange, Act, Assert — structure every test.' }
    ]
  },

  performance: {
    icon: '⚡',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Performance</span>',
    subtitle: 'Optimization techniques for {THEME} in Python.',
    facts: [
      { big: 'cProfile', lbl: 'Profiler' },
      { big: 'timeit', lbl: 'Benchmark' },
      { big: 'Cython', lbl: 'Speed' },
      { big: 'Numba', lbl: 'JIT' },
      { big: 'PyPy', lbl: 'Faster' }
    ],
    concepts: [
      { icon: '📊', title: 'Measure First', desc: 'Use <code>cProfile</code> and <code>timeit</code> before optimizing.' },
      { icon: '🔥', title: 'Hot Paths', desc: 'Find the slow 5% and optimize only that.' },
      { icon: '🧠', title: 'Vectorize', desc: 'Use NumPy or list comprehensions over Python loops.' },
      { icon: '⚙️', title: 'Alternatives', desc: 'PyPy, Cython, Numba for CPU-heavy work.' }
    ],
    playground: {
      file: 'performance.py',
      code: `import time

N = 100000

# Slow: string concatenation
start = time.time()
s = ""
for i in range(N):
    s += "x"
print(f"String += : {time.time() - start:.3f}s")

# Fast: join
start = time.time()
parts = ["x"] * N
s = "".join(parts)
print(f"str.join  : {time.time() - start:.3f}s")

# Fast: list comprehension
start = time.time()
squares = [n ** 2 for n in range(N)]
print(f"List comp : {time.time() - start:.3f}s")

# Slower: manual loop
start = time.time()
squares = []
for n in range(N):
    squares.append(n ** 2)
print(f"Manual app: {time.time() - start:.3f}s")`
    },
    stepCode: [
      'import time',
      '',
      'start = time.time()',
      'result = "".join(["x"] * N)',
      'print(time.time() - start)',
      '',
      '# Faster than:',
      '# s = ""',
      '# for i in range(N): s += "x"'
    ],
    steps: [
      { line: 2, text: '<code>time.time()</code> — wall-clock timer. Simple benchmarking.', tags: ['Timing'] },
      { line: 3, text: '<code>"".join()</code> — always faster than concatenating in a loop.', tags: ['join'] },
      { line: 4, text: 'Elapsed time in seconds — print with 3 decimal places.', tags: ['Output'] },
      { line: 6, text: 'String concatenation in a loop is O(N²) — never do it.', tags: ['Anti-Pattern'] }
    ],
    recap: [
      { title: 'Measure', text: '<code>timeit</code> for micro, <code>cProfile</code> for macro.' },
      { title: 'join()', text: 'Never <code>+=</code> strings in a loop.' },
      { title: 'Comprehensions', text: 'Faster than manual loops.' },
      { title: 'NumPy', text: 'Vectorized operations beat Python loops 100x.' }
    ]
  },

  security: {
    icon: '🛡️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Security</span>',
    subtitle: 'Writing secure Python code with {THEME}.',
    facts: [
      { big: 'secrets', lbl: 'Tokens' },
      { big: 'hashlib', lbl: 'Hashing' },
      { big: 'pip-audit', lbl: 'Deps' },
      { big: 'bandit', lbl: 'Linter' },
      { big: 'bcrypt', lbl: 'Passwords' }
    ],
    concepts: [
      { icon: '🔒', title: 'Input Validation', desc: 'Never trust user input. Validate everything.' },
      { icon: '🔐', title: 'Secrets', desc: 'Use <code>secrets</code> for tokens, not <code>random</code>.' },
      { icon: '🧂', title: 'Hashing', desc: 'Use <code>bcrypt</code> or <code>argon2</code> for passwords.' },
      { icon: '⚠️', title: 'Injection', desc: 'Never concatenate SQL or shell commands.' }
    ],
    playground: {
      file: 'security.py',
      code: `import hashlib
import secrets

# GOOD: cryptographically secure random token
token = secrets.token_urlsafe(32)
print(f"Token: {token[:16]}...")

# BAD: random module is NOT secure
# import random
# token = random.randint(0, 10**9)

# Hashing
text = "Hello, World"
md5 = hashlib.md5(text.encode()).hexdigest()
sha256 = hashlib.sha256(text.encode()).hexdigest()

print(f"MD5:    {md5}")
print(f"SHA256: {sha256}")

# For PASSWORDS, use bcrypt or argon2 — NEVER md5/sha256
print("Use bcrypt for passwords, not hashlib.md5")

# SQL injection example — never do this:
user_input = "'; DROP TABLE users; --"
bad_query = f"SELECT * FROM users WHERE name = '{user_input}'"
print("UNSAFE:", bad_query)
print("Use parameterized queries instead")`
    },
    stepCode: [
      'import secrets',
      'import hashlib',
      '',
      'token = secrets.token_urlsafe(32)',
      'print(token)',
      '',
      'sha = hashlib.sha256(b"data").hexdigest()',
      'print(sha)',
      '',
      '# SQL: use parameterized queries!'
    ],
    steps: [
      { line: 0, text: '<code>secrets</code> — cryptographically secure random.', tags: ['secrets'] },
      { line: 3, text: '<code>token_urlsafe()</code> — generates a secure random token.', tags: ['Token'] },
      { line: 6, text: '<code>hashlib</code> — cryptographic hashes (SHA-256, etc.).', tags: ['hashlib'] },
      { line: 9, text: 'For SQL, use parameterized queries — never string formatting.', tags: ['SQLi'] }
    ],
    recap: [
      { title: 'secrets', text: 'Use for tokens, not <code>random</code>.' },
      { title: 'bcrypt', text: 'Passwords need slow hashing, not SHA.' },
      { title: 'Parameterize', text: 'Never concatenate SQL. Ever.' },
      { title: 'bandit', text: 'Automated security linter for Python.' }
    ]
  },

  web: {
    icon: '🌐',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Web Development</span>',
    subtitle: 'Building web applications with {THEME} in Python.',
    facts: [
      { big: 'Flask', lbl: 'Micro' },
      { big: 'Django', lbl: 'Full-stack' },
      { big: 'FastAPI', lbl: 'Modern' },
      { big: 'Pydantic', lbl: 'Validation' },
      { big: 'ASGI', lbl: 'Async' }
    ],
    concepts: [
      { icon: '🎯', title: 'Flask', desc: 'Minimal, flexible micro-framework.' },
      { icon: '🏗️', title: 'Django', desc: 'Batteries-included framework. ORM, admin, auth.' },
      { icon: '⚡', title: 'FastAPI', desc: 'Modern, fast, async-first. Automatic docs.' },
      { icon: '🔌', title: 'APIs', desc: 'REST and async APIs with automatic validation.' }
    ],
    playground: {
      file: 'flask_app.py',
      code: `# Flask example — minimal web server
# Run with: python flask_app.py

from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/api/users/<int:user_id>")
def get_user(user_id):
    return jsonify({"id": user_id, "name": f"User {user_id}"})

if __name__ == "__main__":
    # In real code: app.run(debug=False)
    print("Would start Flask server on http://127.0.0.1:5000")
    print("Routes:")
    print("  GET /")
    print("  GET /api/users/<id>")`
    },
    stepCode: [
      'from flask import Flask, jsonify',
      '',
      'app = Flask(__name__)',
      '',
      '@app.route("/")',
      'def home():',
      '    return "Hello"',
      '',
      '@app.route("/api/users/<int:user_id>")',
      'def get_user(user_id):',
      '    return jsonify({"id": user_id})'
    ],
    steps: [
      { line: 0, text: 'Import Flask and helpers.', tags: ['import'] },
      { line: 2, text: '<code>Flask(__name__)</code> — create the app.', tags: ['App'] },
      { line: 4, text: '<code>@app.route()</code> — decorator registers a URL handler.', tags: ['Route'] },
      { line: 8, text: '<code>&lt;int:user_id&gt;</code> — URL parameter with type conversion.', tags: ['Param'] },
      { line: 10, text: '<code>jsonify()</code> — returns a JSON response.', tags: ['JSON'] }
    ],
    recap: [
      { title: 'Flask', text: 'Best for small apps and APIs.' },
      { title: 'Django', text: 'Best for large, full-featured apps.' },
      { title: 'FastAPI', text: 'Best for modern async APIs.' },
      { title: 'Choose', text: 'Match the framework to the project size.' }
    ]
  },

  datascience: {
    icon: '📊',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Data Science</span>',
    subtitle: 'Using {THEME} in Python for data analysis and visualization.',
    facts: [
      { big: 'NumPy', lbl: 'Arrays' },
      { big: 'Pandas', lbl: 'DataFrames' },
      { big: 'Matplotlib', lbl: 'Plots' },
      { big: 'Scikit', lbl: 'ML' },
      { big: 'Jupyter', lbl: 'Notebooks' }
    ],
    concepts: [
      { icon: '🔢', title: 'NumPy', desc: 'Fast numerical arrays and vectorized operations.' },
      { icon: '📊', title: 'Pandas', desc: 'DataFrames — like Excel in code.' },
      { icon: '📈', title: 'Matplotlib', desc: 'Plotting and visualization.' },
      { icon: '🤖', title: 'Scikit-learn', desc: 'Machine learning algorithms.' }
    ],
    playground: {
      file: 'datascience.py',
      code: `# Data science essentials (no external libs in this demo)

# Simulated dataset
sales = [
    {"product": "Laptop", "price": 1200, "qty": 5},
    {"product": "Mouse", "price": 25, "qty": 50},
    {"product": "Monitor", "price": 400, "qty": 10},
    {"product": "Keyboard", "price": 80, "qty": 30},
]

# Total revenue per product
for item in sales:
    revenue = item["price"] * item["qty"]
    print(f"{item['product']:10} {revenue:>8}")

# Total
total = sum(item["price"] * item["qty"] for item in sales)
print(f"{'TOTAL':10} {total:>8}")

# Average price
avg_price = sum(item["price"] for item in sales) / len(sales)
print(f"Average price: {avg_price:.2f}")`
    },
    stepCode: [
      'sales = [',
      '    {"product": "Laptop", "price": 1200, "qty": 5},',
      '    {"product": "Mouse", "price": 25, "qty": 50}',
      ']',
      '',
      'for item in sales:',
      '    revenue = item["price"] * item["qty"]',
      '    print(item["product"], revenue)'
    ],
    steps: [
      { line: 0, text: 'List of dicts — a "poor man\'s DataFrame".', tags: ['Data'] },
      { line: 1, text: 'Each dict is a row with named fields.', tags: ['Dict'] },
      { line: 5, text: 'Loop through rows — real Pandas hides this with vectorization.', tags: ['Loop'] },
      { line: 6, text: 'Compute derived values.', tags: ['Compute'] },
      { line: 7, text: 'Print results formatted.', tags: ['Print'] }
    ],
    recap: [
      { title: 'NumPy', text: 'Foundation for all numerical work.' },
      { title: 'Pandas', text: 'DataFrames make data analysis easy.' },
      { title: 'Matplotlib', text: 'Basic plotting. Seaborn for beauty.' },
      { title: 'Jupyter', text: 'The standard data science notebook.' }
    ]
  },

  database: {
    icon: '🗄️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Databases</span>',
    subtitle: 'Working with databases in Python using {THEME}.',
    facts: [
      { big: 'sqlite3', lbl: 'Built-in' },
      { big: 'SQLAlchemy', lbl: 'ORM' },
      { big: 'psycopg', lbl: 'Postgres' },
      { big: 'pymysql', lbl: 'MySQL' },
      { big: 'Django ORM', lbl: 'Framework' }
    ],
    concepts: [
      { icon: '🗄️', title: 'sqlite3', desc: 'Standard library. Zero-config database.' },
      { icon: '🔧', title: 'SQLAlchemy', desc: 'The most popular ORM.' },
      { icon: '⚙️', title: 'Parameterized', desc: 'Always use <code>?</code> placeholders — never string formatting.' },
      { icon: '🧪', title: 'Transactions', desc: 'Commit or rollback — atomic operations.' }
    ],
    playground: {
      file: 'database.py',
      code: `import sqlite3

# Connect (creates file if not exists)
conn = sqlite3.connect(":memory:")  # in-memory for demo
cur = conn.cursor()

# Create table
cur.execute("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER
    )
""")

# Insert
cur.executemany("INSERT INTO users (name, age) VALUES (?, ?)", [
    ("Alice", 30),
    ("Bob", 25),
    ("Carol", 35)
])
conn.commit()

# Query
cur.execute("SELECT * FROM users WHERE age > ?", (28,))
for row in cur.fetchall():
    print(row)

# Total count
cur.execute("SELECT COUNT(*) FROM users")
print("Total users:", cur.fetchone()[0])

conn.close()`
    },
    stepCode: [
      'import sqlite3',
      'conn = sqlite3.connect("mydb.db")',
      'cur = conn.cursor()',
      '',
      'cur.execute("CREATE TABLE users (id INTEGER, name TEXT)")',
      '',
      'cur.execute("INSERT INTO users VALUES (?, ?)", (1, "Alice"))',
      'conn.commit()',
      '',
      'cur.execute("SELECT * FROM users")',
      'for row in cur.fetchall(): print(row)'
    ],
    steps: [
      { line: 0, text: '<code>sqlite3</code> — built into Python. No installation.', tags: ['sqlite3'] },
      { line: 1, text: '<code>connect()</code> — opens or creates the database file.', tags: ['Connect'] },
      { line: 2, text: '<code>cursor()</code> — object to execute SQL statements.', tags: ['Cursor'] },
      { line: 6, text: 'Use <code>?</code> placeholders — parameterized, safe from SQL injection.', tags: ['Params'] },
      { line: 7, text: '<code>commit()</code> — save changes. Without it, they roll back.', tags: ['Commit'] }
    ],
    recap: [
      { title: 'sqlite3', text: 'Built-in. Perfect for small apps and prototypes.' },
      { title: 'Parameterize', text: 'Always use <code>?</code> — never f-strings in SQL.' },
      { title: 'commit()', text: 'Save changes or they will be lost.' },
      { title: 'ORM', text: 'SQLAlchemy or Django ORM for larger apps.' }
    ]
  },

  regex: {
    icon: '🔍',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Regular Expressions</span>',
    subtitle: 'Pattern matching in Python with {THEME}.',
    facts: [
      { big: 're', lbl: 'Module' },
      { big: '\\d \\w \\s', lbl: 'Classes' },
      { big: '* + ?', lbl: 'Quantifiers' },
      { big: '() [] {}', lbl: 'Groups' },
      { big: '^ $', lbl: 'Anchors' }
    ],
    concepts: [
      { icon: '🔍', title: 'Matching', desc: '<code>re.match</code>, <code>re.search</code>, <code>re.findall</code>.' },
      { icon: '🔄', title: 'Substitution', desc: '<code>re.sub</code> — replace matches.' },
      { icon: '🎯', title: 'Groups', desc: '<code>(...)</code> capture parts of the match.' },
      { icon: '⚙️', title: 'Compile', desc: '<code>re.compile()</code> — cache patterns for speed.' }
    ],
    playground: {
      file: 'regex.py',
      code: `import re

text = "Contact: alice@example.com or bob@test.org"

# Find all emails
emails = re.findall(r'[\\w.]+@[\\w.]+', text)
print("Emails:", emails)

# Match a phone number pattern
phone = "Call 555-1234 or 555-5678"
numbers = re.findall(r'\\d{3}-\\d{4}', phone)
print("Numbers:", numbers)

# Groups
match = re.search(r'(\\w+)@(\\w+)', text)
if match:
    print("Username:", match.group(1))
    print("Domain:  ", match.group(2))

# Substitute
masked = re.sub(r'[\\w.]+@[\\w.]+', '[REDACTED]', text)
print("Masked:  ", masked)

# Compile for reuse
email_re = re.compile(r'[\\w.]+@[\\w.]+')
print("Compiled:", email_re.findall(text))`
    },
    stepCode: [
      'import re',
      '',
      'text = "alice@example.com"',
      'emails = re.findall(r"[\\w.]+@[\\w.]+", text)',
      'print(emails)',
      '',
      'match = re.search(r"(\\w+)@(\\w+)", text)',
      'print(match.group(1), match.group(2))',
      '',
      'masked = re.sub(r"[\\w.]+@[\\w.]+", "[X]", text)'
    ],
    steps: [
      { line: 0, text: '<code>re</code> — Python\'s regex module.', tags: ['re'] },
      { line: 3, text: '<code>\\w</code> = word char, <code>+</code> = one or more, <code>.</code> = any char.', tags: ['Pattern'] },
      { line: 6, text: '<code>(...)</code> — capture groups for extraction.', tags: ['Groups'] },
      { line: 7, text: '<code>.group(1)</code> — first captured group.', tags: ['Group'] },
      { line: 9, text: '<code>re.sub()</code> — replace all matches with a string.', tags: ['Sub'] }
    ],
    recap: [
      { title: 'Raw strings', text: 'Always use <code>r"..."</code> for patterns.' },
      { title: 'findall', text: 'All matches. <code>search</code> for first.' },
      { title: 'Groups', text: '<code>()</code> capture — access with <code>.group(n)</code>.' },
      { title: 'compile', text: 'Cache patterns for repeated use.' }
    ]
  },

  advanced: {
    icon: '🚀',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Advanced Python</span>',
    subtitle: 'Advanced Python features — {THEME} used by senior developers.',
    facts: [
      { big: '@decorator', lbl: 'Wrap' },
      { big: 'metaclass', lbl: 'Meta' },
      { big: '__dunder__', lbl: 'Special' },
      { big: 'property', lbl: 'Descriptor' },
      { big: 'context', lbl: 'Manager' }
    ],
    concepts: [
      { icon: '🎁', title: 'Decorators', desc: 'Functions that wrap other functions.' },
      { icon: '🧬', title: 'Metaclasses', desc: 'Classes of classes — for frameworks.' },
      { icon: '✨', title: 'Dunder Methods', desc: '<code>__str__</code>, <code>__eq__</code>, <code>__len__</code>.' },
      { icon: '🔒', title: 'Properties', desc: '<code>@property</code> for computed attributes.' }
    ],
    playground: {
      file: 'advanced.py',
      code: `# Custom decorator
def logged(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"Result: {result}")
        return result
    return wrapper


@logged
def add(a, b):
    return a + b


add(3, 5)


# Dunder methods
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)


p1 = Point(1, 2)
p2 = Point(3, 4)
print(p1 + p2)
print(repr(p1))`
    },
    stepCode: [
      'def logged(func):',
      '    def wrapper(*args, **kwargs):',
      '        print(f"Calling {func.__name__}")',
      '        return func(*args, **kwargs)',
      '    return wrapper',
      '',
      '@logged',
      'def add(a, b):',
      '    return a + b',
      '',
      'add(3, 5)'
    ],
    steps: [
      { line: 0, text: 'A decorator is a function that takes another function.', tags: ['Decorator'] },
      { line: 1, text: '<code>*args, **kwargs</code> — accept any arguments, pass them through.', tags: ['args'] },
      { line: 4, text: 'Return the new function — this replaces the original.', tags: ['Return'] },
      { line: 6, text: '<code>@logged</code> — syntactic sugar for <code>add = logged(add)</code>.', tags: ['@'] },
      { line: 10, text: 'Calling <code>add()</code> now runs the wrapper first.', tags: ['Call'] }
    ],
    recap: [
      { title: 'Decorators', text: 'Wrap functions with <code>@name</code>.' },
      { title: 'Dunder', text: 'Define special behavior with <code>__name__</code> methods.' },
      { title: 'Property', text: '<code>@property</code> for computed attributes.' },
      { title: 'Metaclass', text: 'Advanced. Used by frameworks like Django.' }
    ]
  },

  interview: {
    icon: '🎯',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Interview Prep</span>',
    subtitle: 'Common Python interview questions on {THEME} with answers.',
    facts: [
      { big: '10+', lbl: 'Questions' },
      { big: 'FAQ', lbl: 'Common' },
      { big: 'Real', lbl: 'Scenario' },
      { big: 'Answers', lbl: 'Explained' },
      { big: 'Practice', lbl: 'Matters' }
    ],
    concepts: [
      { icon: '🎤', title: 'Common Questions', desc: 'Frequently asked Python interview questions on {THEME}.' },
      { icon: '💡', title: 'Answers', desc: 'Clear, correct explanations with examples.' },
      { icon: '⚠️', title: 'Gotchas', desc: 'The tricky bits interviewers love to test.' },
      { icon: '🎯', title: 'Follow-ups', desc: 'Where interviewers go next.' }
    ],
    playground: {
      file: 'interview.py',
      code: `# Q: Mutable default arguments — a classic gotcha
def bad(items=[]):
    items.append(1)
    return items

print(bad())   # [1]
print(bad())   # [1, 1] — SURPRISE!
print(bad())   # [1, 1, 1]

# Fix: use None as default
def good(items=None):
    if items is None:
        items = []
    items.append(1)
    return items

print(good())  # [1]
print(good())  # [1]

# Q: is vs ==
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True  (same value)
print(a is b)  # False (different objects)

# Q: Shallow vs deep copy
import copy
x = [[1, 2], [3, 4]]
y = x.copy()          # shallow
z = copy.deepcopy(x)  # deep`
    },
    stepCode: [
      'def bad(items=[]):',
      '    items.append(1)',
      '    return items',
      '',
      'print(bad())',
      'print(bad())',
      'print(bad())',
      '',
      '# Fix: use None',
      'def good(items=None):',
      '    if items is None: items = []'
    ],
    steps: [
      { line: 0, text: '<strong>Never</strong> use mutable defaults. The list is shared across calls.', tags: ['Gotcha'] },
      { line: 4, text: 'First call: creates the default list, appends 1 → <code>[1]</code>.', tags: ['Result'] },
      { line: 5, text: 'Second call: appends to the <strong>same</strong> list → <code>[1, 1]</code>.', tags: ['Bug'] },
      { line: 9, text: 'Use <code>None</code> as default, then create inside.', tags: ['Fix'] },
      { line: 10, text: '<code>is</code> checks identity, <code>==</code> checks equality.', tags: ['is-vs-=='] }
    ],
    recap: [
      { title: 'Mutable Defaults', text: 'Never use <code>[]</code> or <code>{}</code> as default args.' },
      { title: 'is vs ==', text: '<code>is</code> is identity, <code>==</code> is equality.' },
      { title: 'Shallow vs Deep', text: '<code>.copy()</code> is shallow. Use <code>copy.deepcopy()</code>.' },
      { title: 'Practice', text: 'Explain these out loud before your interview.' }
    ]
  },

  projects: {
    icon: '🚀',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Real Projects</span>',
    subtitle: 'Build real Python projects using {THEME}.',
    facts: [
      { big: 'CLI', lbl: 'argparse' },
      { big: 'Web', lbl: 'Flask' },
      { big: 'Data', lbl: 'Pandas' },
      { big: 'API', lbl: 'Requests' },
      { big: 'Automate', lbl: 'Scripts' }
    ],
    concepts: [
      { icon: '📁', title: 'Project Layout', desc: '<code>src/</code>, <code>tests/</code>, <code>pyproject.toml</code>.' },
      { icon: '🔧', title: 'Modular Code', desc: 'Split into modules, keep functions small.' },
      { icon: '🧪', title: 'Testing', desc: 'pytest tests next to your modules.' },
      { icon: '📦', title: 'Dependencies', desc: 'Manage with <code>pyproject.toml</code> + <code>pip</code>.' }
    ],
    playground: {
      file: 'cli.py',
      code: `# Simple CLI tool example
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python cli.py <name>")
        return 1

    name = sys.argv[1]
    print(f"Hello, {name}!")
    return 0

# Typical project structure:
# myproject/
#   src/
#     __init__.py
#     cli.py
#     core.py
#   tests/
#     test_core.py
#   pyproject.toml
#   README.md

if __name__ == "__main__":
    sys.exit(main())`
    },
    stepCode: [
      'import sys',
      '',
      'def main():',
      '    if len(sys.argv) < 2:',
      '        print("Usage: ...")',
      '        return 1',
      '    name = sys.argv[1]',
      '    print(f"Hello, {name}")',
      '    return 0',
      '',
      'if __name__ == "__main__":',
      '    sys.exit(main())'
    ],
    steps: [
      { line: 0, text: '<code>sys.argv</code> — command-line arguments.', tags: ['argv'] },
      { line: 2, text: 'Entry point in <code>main()</code>. Keeps things testable.', tags: ['main'] },
      { line: 7, text: 'Use the arg. In real tools, use <code>argparse</code> for flags.', tags: ['argparse'] },
      { line: 10, text: '<code>if __name__ == "__main__"</code> — runs only if script is executed directly.', tags: ['Guard'] },
      { line: 11, text: '<code>sys.exit()</code> — return an exit code to the OS.', tags: ['Exit'] }
    ],
    recap: [
      { title: 'Layout', text: 'src/, tests/, pyproject.toml, README.md.' },
      { title: 'Entry Guard', text: '<code>if __name__ == "__main__"</code>.' },
      { title: 'argparse', text: 'Standard library CLI argument parser.' },
      { title: 'Packaging', text: 'Use <code>pyproject.toml</code> for modern packaging.' }
    ]
  },

  general: {
    icon: '📘',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Complete Guide</span>',
    subtitle: 'A complete overview of {THEME} in Python.',
    facts: [
      { big: 'Py3', lbl: 'Standard' },
      { big: 'CPython', lbl: 'Runtime' },
      { big: 'Portable', lbl: 'Cross-OS' },
      { big: 'Fast Dev', lbl: 'Speed' },
      { big: 'Rich Stdlib', lbl: 'Batteries' }
    ],
    concepts: [
      { icon: '📖', title: 'Overview', desc: 'An introduction to {THEME}.' },
      { icon: '🎯', title: 'Importance', desc: 'Why {THEME} matters in real Python.' },
      { icon: '⚙️', title: 'Details', desc: 'Key points and edge cases.' },
      { icon: '🚀', title: 'Practice', desc: 'How to apply {THEME}.' }
    ],
    playground: {
      file: 'example.py',
      code: `# {THEME} — general example

print("Topic: {THEME}")
print("Language: Python 3")

x = 10
y = 20
print(f"x + y = {x + y}")

numbers = [1, 2, 3, 4, 5]
print(f"Sum: {sum(numbers)}")
print(f"Max: {max(numbers)}")
print(f"Min: {min(numbers)}")`
    },
    stepCode: [
      'print("Hello, Python!")',
      '',
      'x = 10',
      'print(x)',
      '',
      'for i in range(3):',
      '    print(i)'
    ],
    steps: [
      { line: 0, text: '<code>print</code> — the universal output function.', tags: ['print'] },
      { line: 2, text: 'Simple variable assignment.', tags: ['Assign'] },
      { line: 5, text: '<code>for i in range(3)</code> — iterates 0, 1, 2.', tags: ['for'] },
      { line: 6, text: 'Indented block — Python uses whitespace, not braces.', tags: ['Indent'] }
    ],
    recap: [
      { title: 'Simple', text: 'Python is famously readable.' },
      { title: 'Versatile', text: 'Web, data, AI, automation — all in one language.' },
      { title: 'Portable', text: 'Runs on Windows, Linux, macOS.' },
      { title: 'Keep Practicing', text: 'The more Python you write, the better.' }
    ]
  }
};

/* ============================================================
   TITLE FROM SLUG
   ============================================================ */
function titleFromSlug(slug) {
  const special = {
    'python': 'Python', 'pep': 'PEP', 'pep-20': 'PEP 20',
    'cpython': 'CPython', 'pypy': 'PyPy', 'jython': 'Jython',
    'ironpython': 'IronPython', 'micropython': 'MicroPython',
    'oop': 'OOP', 'api': 'API', 'apis': 'APIs', 'json': 'JSON',
    'http': 'HTTP', 'rest': 'REST', 'cli': 'CLI', 'ide': 'IDE',
    'sql': 'SQL', 'orm': 'ORM', 'csv': 'CSV', 'xml': 'XML',
    'html': 'HTML', 'url': 'URL', 'urls': 'URLs', 'utc': 'UTC',
    'io': 'I/O', 'ai': 'AI', 'ml': 'ML', 'gil': 'GIL',
    'faq': 'FAQ', 'tdd': 'TDD', 'ci': 'CI', 'cd': 'CD',
    'gui': 'GUI', 'os': 'OS', 'aws': 'AWS', 'gcp': 'GCP'
  };
  return slug.split('-').map(w => {
    const lw = w.toLowerCase();
    if (special[lw]) return special[lw];
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

/* ============================================================
   PARSE + BUILD
   ============================================================ */
function parseFolder(name) {
  const m = name.match(/^(\d+)-(.+)$/);
  if (!m) return null;
  return { num: m[1], theme: m[2] };
}

function buildTopic(folderName) {
  const parsed = parseFolder(folderName);
  if (!parsed) return null;
  const { num, theme } = parsed;
  const category = detectCategory(theme);
  const catTemplate = CATEGORIES[category] || CATEGORIES.general;
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
   RENDER HTML
   ============================================================ */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHTML(topic) {
  const factsHtml = topic.facts.map(f =>
    `<div class="fact"><div class="big">${escapeHtml(f.big)}</div><div class="lbl">${escapeHtml(f.lbl)}</div></div>`
  ).join('');

  const conceptsHtml = topic.concepts.map((c, i) => {
    const colors = ['#3776AB,#4B8BBE', '#FFD43B,#FFE873', '#306998,#4584B6', '#22c55e,#4ade80'];
    const [c1, c2] = colors[i % colors.length].split(',');
    return `<div class="concept" style="--c1:${c1};--c2:${c2}">
      <div class="c-ico">${c.icon}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${c.desc}</p>
    </div>`;
  }).join('');

  const recapHtml = topic.recap.map((r, i) => {
    const colors = ['#3776AB', '#FFD43B', '#306998', '#22c55e'];
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
.space-base{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#0d1e30 0%,#0a0a20 45%,#05060f 85%),radial-gradient(ellipse at 0% 100%,#1a1505 0%,transparent 55%)}
.orbs{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:.45}
.orb{position:absolute;border-radius:50%;filter:blur(90px)}
.orb-1{width:520px;height:520px;top:-10%;left:-8%;background:radial-gradient(circle,#3776AB,transparent 70%);animation:d1 26s ease-in-out infinite}
.orb-2{width:460px;height:460px;top:45%;right:-10%;background:radial-gradient(circle,#FFD43B,transparent 70%);animation:d2 30s ease-in-out infinite}
.orb-3{width:600px;height:600px;bottom:-18%;left:18%;background:radial-gradient(circle,#306998,transparent 70%);animation:d3 34s ease-in-out infinite}
@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,40px) scale(1.15)}}
@keyframes d2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.2)}}
@keyframes d3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-60px) scale(1.1)}}
.grid-bg{position:fixed;inset:-50%;z-index:2;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(55,118,171,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(55,118,171,.14) 1px,transparent 1px);background-size:80px 80px;transform:perspective(500px) rotateX(60deg);animation:gf 22s linear infinite;mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%)}
@keyframes gf{from{background-position:0 0}to{background-position:0 80px}}
.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.72) 100%)}
.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}
.container{max-width:1150px;margin:0 auto;padding:0 1.5rem;width:100%}
nav{position:sticky;top:0;z-index:100;background:rgba(5,6,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(148,163,184,.08)}
.nav-inner{max-width:1150px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1rem;color:#f1f5f9;text-decoration:none}
.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#3776AB,#FFD43B);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1rem;color:#fff;box-shadow:0 8px 20px -6px rgba(55,118,171,.6)}
.hero{padding:4.5rem 1.5rem 3rem;text-align:center}
.tpill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(55,118,171,.12);border:1px solid rgba(55,118,171,.35);border-radius:999px;padding:.45rem 1.1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#8ab4dc;margin-bottom:1.5rem}
.tpill .n{background:#3776AB;color:#fff;min-width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;padding:0 .35rem}
.hero h1{font-size:clamp(1.9rem,4.8vw,3rem);font-weight:900;letter-spacing:-.04em;line-height:1.15;margin-bottom:1.2rem}
.hero h1 .grad{background:linear-gradient(135deg,#8ab4dc 0%,#3776AB 45%,#FFD43B 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gs 7s ease-in-out infinite}
@keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.hero p{color:#a1a1aa;font-size:1.05rem;max-width:660px;margin:0 auto;line-height:1.7}
section{padding:3rem 0}
.sec-head{text-align:center;margin-bottom:2.5rem}
.stag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(55,118,171,.1);border:1px solid rgba(55,118,171,.3);border-radius:999px;padding:.4rem 1rem;font-size:.68rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#8ab4dc;margin-bottom:1rem}
.sec-head h2{font-size:clamp(1.6rem,3.8vw,2.3rem);font-weight:900;letter-spacing:-.03em;line-height:1.15;margin-bottom:.6rem}
.sec-head h2 .grad{background:linear-gradient(135deg,#8ab4dc,#FFD43B);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sec-head p{color:#94a3b8;font-size:.95rem;max-width:620px;margin:0 auto}
.facts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:2rem}
.fact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:1.05rem 1rem;text-align:center;transition:all .25s}
.fact:hover{transform:translateY(-3px);border-color:rgba(55,118,171,.4)}
.fact .big{font-size:1.05rem;font-weight:900;background:linear-gradient(135deg,#8ab4dc,#FFD43B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}
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
.step-btn{background:rgba(55,118,171,.15);border:1px solid rgba(55,118,171,.3);color:#8ab4dc;border-radius:8px;padding:.35rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.step-btn:hover:not(:disabled){background:rgba(55,118,171,.3)}
.step-btn:disabled{opacity:.35;cursor:not-allowed}
.step-body{display:grid;grid-template-columns:1.2fr 1fr}
@media(max-width:800px){.step-body{grid-template-columns:1fr}}
.step-code{padding:1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1);overflow-x:auto}
@media(max-width:800px){.step-code{border-right:none;border-bottom:1px solid rgba(148,163,184,.1)}}
.step-line{padding:.15rem .5rem;border-radius:5px;transition:background .3s;white-space:pre}
.step-line.active{background:rgba(55,118,171,.18);box-shadow:inset 3px 0 0 #3776AB;color:#fff}
.step-info{padding:1.1rem 1.3rem;background:rgba(30,41,59,.4)}
.explain{font-size:.85rem;color:#cbd5e1;min-height:4rem;margin-bottom:.9rem;line-height:1.6}
.explain code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.82em}
.tag-list{display:flex;flex-wrap:wrap;gap:.35rem}
.tag{background:rgba(138,180,220,.15);border:1px solid rgba(138,180,220,.3);color:#8ab4dc;border-radius:6px;padding:.25rem .65rem;font-size:.7rem;font-family:'JetBrains Mono',monospace;font-weight:600}
.step-progress{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}
.bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}
.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#3776AB,#FFD43B);border-radius:999px;transition:width .35s}
.count{font-size:.72rem;color:#64748b;font-family:'JetBrains Mono',monospace;min-width:3.5rem;text-align:right}
.recap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.9rem;margin-top:1.2rem}
.recap{background:rgba(30,41,59,.6);border-radius:14px;padding:1.1rem 1.2rem;border-left:3px solid var(--rc,#3776AB)}
.recap .t{font-size:.72rem;font-weight:800;color:var(--rc,#3776AB);text-transform:uppercase;letter-spacing:.08em}
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
      <a href="#" class="brand"><div class="brand-mark">🐍</div> Python Series</a>
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
    <p>🐍 ${escapeHtml(topic.title)} · Python Series · Built for learners</p>
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
  return c.replace(/#.*$/gm,'');
}
function interpret(code){
  const output=[],vars={};let error=null;
  const clean=stripComments(code);
  const lines = clean.split('\\n').map(l => l.replace(/\\s+$/,''));

  // Skip import lines
  const body = lines.filter(l => !/^\\s*import\\s+/.test(l) && !/^\\s*from\\s+/.test(l));

  function evalE(expr){
    expr=expr.trim();
    // f-string
    let fm=expr.match(/^f"([\\s\\S]*)"$/);
    if(fm){
      let inner = fm[1];
      inner = inner.replace(/\\{([^{}]+)\\}/g, (m, e) => String(evalE(e)));
      return inner.replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t');
    }
    // Regular string
    let sm=expr.match(/^"(.*)"$/) || expr.match(/^'(.*)'$/);
    if(sm) return sm[1].replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t');
    // Number
    if(/^-?\\d+$/.test(expr)) return parseInt(expr,10);
    if(/^-?\\d+\\.\\d+$/.test(expr)) return parseFloat(expr);
    if(expr==='True') return true;
    if(expr==='False') return false;
    if(expr==='None') return null;
    if(vars[expr]!==undefined) return vars[expr];
    // Sub
    let r = expr;
    Object.keys(vars).sort((a,b)=>b.length-a.length).forEach(n => {
      r = r.replace(new RegExp('\\\\b'+n+'\\\\b','g'),
        '('+(typeof vars[n]==='string'?JSON.stringify(vars[n]):vars[n])+')');
    });
    // Python built-ins
    r = r.replace(/\\brange\\(([^)]+)\\)/g, (_, args) => {
      const parts = args.split(',').map(s => evalE(s.trim()));
      const [start, stop, step] = parts.length===1 ? [0, parts[0], 1]
        : parts.length===2 ? [parts[0], parts[1], 1]
        : parts;
      const arr = [];
      if(step>0) for(let i=start;i<stop;i+=step) arr.push(i);
      else for(let i=start;i>stop;i+=step) arr.push(i);
      return JSON.stringify(arr);
    });
    try{ return Function('"use strict";return('+r+')')(); }
    catch { return 0; }
  }

  function evalPrint(args){
    // Split args by comma at depth 0
    const parts = []; let cur='', d=0, ins=false;
    for(let i=0;i<args.length;i++){
      const ch=args[i], p=args[i-1];
      if((ch==='"'||ch==="'") && p!=='\\\\') ins=!ins;
      if(!ins){
        if(ch==='('||ch==='['||ch==='{') d++;
        if(ch===')'||ch===']'||ch==='}') d--;
        if(ch===',' && d===0){ parts.push(cur.trim()); cur=''; continue; }
      }
      cur+=ch;
    }
    if(cur.trim()) parts.push(cur.trim());
    // Handle sep= and end= kwargs
    let sep=' ', end='\\n';
    const exprs = [];
    parts.forEach(p => {
      const kw = p.match(/^(sep|end)\\s*=\\s*(.+)$/);
      if(kw){
        const v = evalE(kw[2]);
        if(kw[1]==='sep') sep = String(v);
        else end = String(v);
      } else exprs.push(p);
    });
    const values = exprs.map(e => evalE(e));
    return values.map(v => v === null ? 'None' : (typeof v === 'string' ? v : String(v))).join(sep) + end;
  }

  let i = 0;
  function execLines(lines){
    while(i < lines.length){
      const line = lines[i];
      const trimmed = line.trim();
      const indent = line.match(/^(\\s*)/)[1].length;
      i++;

      if(!trimmed) continue;
      if(trimmed.startsWith('#')) continue;

      // print(...)
      let pm = trimmed.match(/^print\\s*\\(([\\s\\S]+)\\)$/);
      if(pm){ output.push(evalPrint(pm[1])); continue; }

      // Assignment
      let am = trimmed.match(/^([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/);
      if(am){
        let valExpr = am[2];
        let v = evalE(valExpr);
        vars[am[1]] = v;
        continue;
      }

      // Multi-assign: a, b = 1, 2
      let mm = trimmed.match(/^([a-zA-Z_]\\w*)\\s*,\\s*([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/);
      if(mm){
        const rhs = mm[3].split(',').map(s => evalE(s.trim()));
        vars[mm[1]] = rhs[0];
        vars[mm[2]] = rhs[1];
        continue;
      }

      // for loop
      let fm = trimmed.match(/^for\\s+([a-zA-Z_]\\w*)\\s+in\\s+(.+):$/);
      if(fm){
        const varName = fm[1];
        const iterable = evalE(fm[2]);
        const loopBody = [];
        while(i < lines.length){
          const nextLine = lines[i];
          if(nextLine.trim() === ''){ loopBody.push(nextLine); i++; continue; }
          const nextIndent = nextLine.match(/^(\\s*)/)[1].length;
          if(nextIndent <= indent) break;
          loopBody.push(nextLine.slice(indent + 4));
          i++;
        }
        const items = Array.isArray(iterable) ? iterable :
          (iterable && typeof iterable[Symbol.iterator] === 'function') ? [...iterable] :
          (typeof iterable === 'string') ? iterable.split('') : [];
        for(const item of items){
          vars[varName] = item;
          // Recursively exec the loop body
          const savedI = i;
          const subI = { val: 0 };
          const subLines = loopBody;
          function runSub(){
            let j = 0;
            while(j < subLines.length){
              const sl = subLines[j];
              const st = sl.trim();
              j++;
              if(!st || st.startsWith('#')) continue;
              let subPm = st.match(/^print\\s*\\(([\\s\\S]+)\\)$/);
              if(subPm){ output.push(evalPrint(subPm[1])); continue; }
              let subAm = st.match(/^([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/);
              if(subAm){ vars[subAm[1]] = evalE(subAm[2]); continue; }
              let subIm = st.match(/^if\\s+(.+):$/);
              if(subIm){
                const cond = evalE(subIm[1]);
                const thenBody = [];
                while(j < subLines.length){
                  const nl = subLines[j];
                  if(nl.trim() === ''){ j++; continue; }
                  const ni = nl.match(/^(\\s*)/)[1].length;
                  if(ni === 0) break;
                  thenBody.push(nl);
                  j++;
                }
                if(cond){
                  // Execute then body (strip first-level indent)
                  thenBody.forEach(tb => {
                    const tt = tb.trim();
                    if(!tt) return;
                    const pm2 = tt.match(/^print\\s*\\(([\\s\\S]+)\\)$/);
                    if(pm2){ output.push(evalPrint(pm2[1])); return; }
                    const am2 = tt.match(/^([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/);
                    if(am2){ vars[am2[1]] = evalE(am2[2]); return; }
                  });
                }
                continue;
              }
              // Nested for (simple)
              let subFm = st.match(/^for\\s+([a-zA-Z_]\\w*)\\s+in\\s+(.+):$/);
              if(subFm){
                const v2 = subFm[1];
                const it2 = evalE(subFm[2]);
                const items2 = Array.isArray(it2) ? it2 : [];
                const innerBody = [];
                while(j < subLines.length){
                  const nl = subLines[j];
                  if(nl.trim() === ''){ j++; continue; }
                  const ni = nl.match(/^(\\s*)/)[1].length;
                  if(ni <= st.match(/^(\\s*)/)[1].length) break;
                  innerBody.push(nl.trim());
                  j++;
                }
                for(const itm of items2){
                  vars[v2] = itm;
                  innerBody.forEach(tb => {
                    const pm2 = tb.match(/^print\\s*\\(([\\s\\S]+)\\)$/);
                    if(pm2){ output.push(evalPrint(pm2[1])); return; }
                  });
                }
                continue;
              }
            }
          }
          runSub();
        }
        continue;
      }

      // if statement
      let im = trimmed.match(/^if\\s+(.+):$/);
      if(im){
        const cond = evalE(im[1]);
        const thenBody = [];
        const elseBody = [];
        let inElse = false;
        while(i < lines.length){
          const nl = lines[i];
          if(nl.trim() === ''){ i++; continue; }
          const ni = nl.match(/^(\\s*)/)[1].length;
          if(ni <= indent){
            if(nl.trim().match(/^elif/)) { i++; inElse = true; continue; }
            if(nl.trim().match(/^else/)) { i++; inElse = true; continue; }
            break;
          }
          if(inElse) elseBody.push(nl);
          else thenBody.push(nl);
          i++;
        }
        const body = cond ? thenBody : elseBody;
        // Execute body
        body.forEach(bl => {
          const st = bl.trim();
          if(!st || st.startsWith('#')) return;
          const pm2 = st.match(/^print\\s*\\(([\\s\\S]+)\\)$/);
          if(pm2){ output.push(evalPrint(pm2[1])); return; }
          const am2 = st.match(/^([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/);
          if(am2){ vars[am2[1]] = evalE(am2[2]); return; }
        });
        continue;
      }

      // while loop
      let wm = trimmed.match(/^while\\s+(.+):$/);
      if(wm){
        const cond = wm[1];
        const loopBody = [];
        while(i < lines.length){
          const nl = lines[i];
          if(nl.trim() === ''){ i++; continue; }
          const ni = nl.match(/^(\\s*)/)[1].length;
          if(ni <= indent) break;
          loopBody.push(nl.trim());
          i++;
        }
        let safety = 0;
        while(evalE(cond) && safety++ < 1000){
          loopBody.forEach(st => {
            if(!st) return;
            const pm2 = st.match(/^print\\s*\\(([\\s\\S]+)\\)$/);
            if(pm2){ output.push(evalPrint(pm2[1])); return; }
            const am2 = st.match(/^([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/);
            if(am2){ vars[am2[1]] = evalE(am2[2]); return; }
          });
        }
        continue;
      }
    }
  }

  try{ execLines(body); }
  catch(e){ error = e.message; }

  return {output, vars, error};
}

function runCode(){
  const code = document.getElementById('codeInput').value;
  const r = interpret(code);
  const ob = document.getElementById('outputBody');
  const sd = document.getElementById('statusDot');
  ob.innerHTML = '';
  if(r.error){
    sd.className = 'status-dot err';
    ob.innerHTML = '<span class="err">⚠ ' + r.error + '</span>';
  } else if(!r.output.length){
    sd.className = 'status-dot ok';
    ob.innerHTML = '<span class="dim">// Program ran but printed nothing.</span>';
  } else {
    sd.className = 'status-dot ok';
    r.output.forEach(l => {
      const el = document.createElement('div');
      el.textContent = l.replace(/\\n$/, '');
      ob.appendChild(el);
    });
  }
}

let cur = -1;
function update(){
  document.querySelectorAll('.step-line').forEach(el => el.classList.remove('active'));
  if(cur < 0){
    document.getElementById('stepExplain').innerHTML = 'Click <strong>Next Step</strong> to begin.';
    document.getElementById('stepTags').innerHTML = '<span style="font-size:.72rem;color:#484f58;">Waiting to start</span>';
    document.getElementById('stepBar').style.width = '0%';
    document.getElementById('stepCount').textContent = '0 / ' + STEPS.length;
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = false;
    return;
  }
  const s = STEPS[cur];
  const el = document.querySelector('.step-line[data-line="' + s.line + '"]');
  if(el) el.classList.add('active');
  document.getElementById('stepExplain').innerHTML = s.text;
  document.getElementById('stepTags').innerHTML = (s.tags||[]).map(t => '<span class="tag">'+t+'</span>').join('');
  document.getElementById('stepBar').style.width = ((cur+1)/STEPS.length*100) + '%';
  document.getElementById('stepCount').textContent = (cur+1) + ' / ' + STEPS.length;
  document.getElementById('prevBtn').disabled = cur <= 0;
  document.getElementById('nextBtn').disabled = cur >= STEPS.length-1;
}
function stepNext(){ if(cur < STEPS.length-1){ cur++; update(); } }
function stepPrev(){ if(cur > 0){ cur--; update(); } }
function stepReset(){ cur = -1; update(); }
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

console.log(`\n🐍 Found ${folders.length} Python topic folders.\n`);

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