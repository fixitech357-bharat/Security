/* ============================================================
   C Topic Generator — one command fills all folders
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
   CATEGORY DETECTION
   ============================================================ */
function detectCategory(theme) {
  const t = theme.toLowerCase();

  if (/(introduction|intro|overview|application|use-case)/.test(t)) return 'intro';
  if (/(history|origin|evolution|richie|k&r|kernighan|bell)/.test(t)) return 'history';
  if (/(standard|c89|c90|c99|c11|c17|c23|ansi|iso)/.test(t)) return 'standards';
  if (/(philosophy|design-goal|feature|characteristic)/.test(t)) return 'philosophy';
  if (/(syntax|token|keyword|identifier|comment|statement|block|scope|lifetime)/.test(t)) return 'syntax';
  if (/(variable|data-type|literal|constant|type-cast|type-conversion)/.test(t)) return 'datatypes';
  if (/(operator|expression|precedence|associativity)/.test(t)) return 'operators';
  if (/(if|switch|loop|for|while|do-while|goto|control|branch|jump)/.test(t)) return 'control';
  if (/(function|recursion|parameter|argument|prototype|variadic)/.test(t)) return 'functions';
  if (/(array|matrix|string|char-array)/.test(t)) return 'arrays';
  if (/(pointer|reference|address|dereference)/.test(t)) return 'pointers';
  if (/(memory|malloc|calloc|realloc|free|heap|stack|allocation|leak)/.test(t)) return 'memory';
  if (/(struct|union|enum|typedef|bit-field)/.test(t)) return 'structs';
  if (/(preprocessor|macro|define|include|pragmatic|conditional-compilation)/.test(t)) return 'preprocessor';
  if (/(file|fopen|fprintf|fscanf|stream|i\/o|input|output)/.test(t)) return 'fileio';
  if (/(thread|pthread|concurren|mutex|atomic|parallel)/.test(t)) return 'concurrency';
  if (/(gcc|clang|compiler|makefile|cmake|tool|ide|debugger|gdb)/.test(t)) return 'tooling';
  if (/(test|unit|assert|valgrind|sanitizer|coverage)/.test(t)) return 'testing';
  if (/(performance|optimiz|profil|benchmark|speed|efficien)/.test(t)) return 'performance';
  if (/(security|buffer-overflow|exploit|safe|secure|vulnerab)/.test(t)) return 'security';
  if (/(interview|question|quiz|practice|exercise)/.test(t)) return 'interview';
  if (/(project|real-world|application|library|framework)/.test(t)) return 'projects';
  return 'general';
}

/* ============================================================
   CATEGORY TEMPLATES
   ============================================================ */
const CATEGORIES = {

  intro: {
    icon: '🌱',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Getting Started</span>',
    subtitle: 'An introduction to {THEME} — what it is, why it matters, and how it fits into modern C programming.',
    facts: [
      { big: '1972', lbl: 'Created' },
      { big: 'Dennis Ritchie', lbl: 'Creator' },
      { big: 'Bell Labs', lbl: 'Origin' },
      { big: '32', lbl: 'Keywords' },
      { big: 'C23', lbl: 'Latest' }
    ],
    concepts: [
      { icon: '🎯', title: 'What It Is', desc: '{THEME} is fundamental to C — every C programmer encounters it.' },
      { icon: '⚙️', title: 'How It Works', desc: 'The compiler and runtime enable {THEME} at the lowest level.' },
      { icon: '🚀', title: 'Why It Matters', desc: 'Understanding {THEME} unlocks C\'s full power.' },
      { icon: '🌍', title: 'Real-World Use', desc: 'Operating systems, embedded devices, and high-performance software rely on it.' }
    ],
    playground: {
      file: 'intro.c',
      code: `#include <stdio.h>

int main(void) {
    /* {THEME} — introduction demo */
    printf("Exploring: {THEME}\\n");

    const char *topics[] = { "C", "Ritchie", "Unix", "PDP-11" };
    int n = sizeof(topics) / sizeof(topics[0]);

    for (int i = 0; i < n; i++) {
        printf("-> %s\\n", topics[i]);
    }

    int total = 0;
    for (int i = 1; i <= 5; i++) total += i;
    printf("Sum 1..5 = %d\\n", total);

    return 0;
}`
    },
    stepCode: [
      '#include <stdio.h>',
      '',
      'int main(void) {',
      '    printf("Hello, C!\\n");',
      '    int numbers[] = { 1, 2, 3 };',
      '    for (int i = 0; i < 3; i++) {',
      '        printf("%d\\n", numbers[i]);',
      '    }',
      '    return 0;',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>#include &lt;stdio.h&gt;</code> — brings in <code>printf</code> from the standard library.', tags: ['Header'] },
      { line: 2, text: '<code>int main(void)</code> — the entry point. <code>void</code> = takes no arguments.', tags: ['main'] },
      { line: 3, text: '<code>printf()</code> — formatted output to stdout.', tags: ['printf'] },
      { line: 4, text: 'Arrays in C are fixed-size at compile time.', tags: ['Array'] },
      { line: 5, text: '<code>for</code> loop iterates with an explicit index — no for-each in C.', tags: ['for'] },
      { line: 9, text: '<code>return 0;</code> signals success to the operating system.', tags: ['return'] }
    ],
    recap: [
      { title: '{THEME}', text: 'Foundation of every C program.' },
      { title: 'Compiled', text: 'Directly to machine code — no interpreter.' },
      { title: 'Portable', text: 'Same source, recompiled for every platform.' },
      { title: 'Small Language', text: 'Only 32 keywords, but infinite power.' }
    ]
  },

  history: {
    icon: '📜',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">History & Evolution</span>',
    subtitle: 'The story of {THEME} — from Bell Labs to modern C standards.',
    facts: [
      { big: '1969', lbl: 'Unix Started' },
      { big: '1972', lbl: 'C Created' },
      { big: '1978', lbl: 'K&R Book' },
      { big: '1989', lbl: 'ANSI C' },
      { big: '2024', lbl: 'C23 Released' }
    ],
    concepts: [
      { icon: '🔬', title: 'Origin', desc: 'Where {THEME} came from and the problem it solved.' },
      { icon: '📛', title: 'Evolution', desc: 'How {THEME} changed over the decades.' },
      { icon: '📖', title: 'Milestones', desc: 'Key moments in the history of {THEME}.' },
      { icon: '🌍', title: 'Legacy', desc: 'How {THEME} shaped modern computing.' }
    ],
    playground: {
      file: 'history.c',
      code: `#include <stdio.h>

int main(void) {
    printf("C Timeline\\n");

    struct Release {
        const char *version;
        int year;
    };

    struct Release releases[] = {
        { "C (K&R)", 1972 },
        { "K&R Book", 1978 },
        { "ANSI C", 1989 },
        { "C99", 1999 },
        { "C11", 2011 },
        { "C17", 2018 },
        { "C23", 2024 }
    };

    int n = sizeof(releases) / sizeof(releases[0]);
    for (int i = 0; i < n; i++) {
        printf("%d - %s\\n", releases[i].year, releases[i].version);
    }

    return 0;
}`
    },
    stepCode: [
      'struct Release {',
      '    const char *version;',
      '    int year;',
      '};',
      '',
      'struct Release releases[] = {',
      '    { "K&R C", 1972 },',
      '    { "ANSI C", 1989 },',
      '    { "C23", 2024 }',
      '};'
    ],
    steps: [
      { line: 0, text: '<code>struct</code> — C\'s way to bundle multiple values into one type.', tags: ['struct'] },
      { line: 1, text: '<code>const char *</code> — a pointer to read-only string data.', tags: ['Pointer'] },
      { line: 5, text: 'Array of structs — classic C data modeling.', tags: ['Array'] },
      { line: 6, text: '<code>K&R C</code> — the original language from 1972.', tags: ['History'] },
      { line: 8, text: '<code>C23</code> — the newest ISO C standard (2024).', tags: ['C23'] }
    ],
    recap: [
      { title: '1972', text: 'Dennis Ritchie creates C at Bell Labs.' },
      { title: '1978', text: 'K&R book becomes the de-facto spec.' },
      { title: '1989', text: 'ANSI C — first official standard.' },
      { title: '2024', text: 'C23 released — modern features added.' }
    ]
  },

  standards: {
    icon: '📘',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">C Standards</span>',
    subtitle: 'Everything about {THEME} — features, changes, and what it introduced to the C language.',
    facts: [
      { big: 'ISO', lbl: 'Body' },
      { big: 'WG14', lbl: 'Committee' },
      { big: '1989', lbl: 'ANSI C' },
      { big: '__STDC__', lbl: 'Macro' },
      { big: '7+', lbl: 'Revisions' }
    ],
    concepts: [
      { icon: '📘', title: 'Overview', desc: 'What {THEME} changed and why it matters.' },
      { icon: '✨', title: 'New Features', desc: 'Language and library additions.' },
      { icon: '🐛', title: 'Bug Fixes', desc: 'Corrections and deprecated features.' },
      { icon: '🎯', title: 'Impact', desc: 'How {THEME} affected real-world C code.' }
    ],
    playground: {
      file: 'standards.c',
      code: `#include <stdio.h>

int main(void) {
    /* Detect the standard */
#ifdef __STDC_VERSION__
    printf("__STDC_VERSION__ = %ldL\\n", __STDC_VERSION__);
#else
    printf("Pre-C89 or not defined\\n");
#endif

    /* C99 fixed-width types */
    long long big = 9999999999LL;
    printf("long long: %lld\\n", big);

    /* C11 _Static_assert */
    _Static_assert(sizeof(int) >= 4, "int must be at least 4 bytes");

    /* C11 _Generic */
    int choice = _Generic(big,
        long long: 1,
        int: 2,
        default: 0
    );
    printf("Generic matched: %d\\n", choice);

    return 0;
}`
    },
    stepCode: [
      '#ifdef __STDC_VERSION__',
      '    printf("%ldL\\n", __STDC_VERSION__);',
      '#else',
      '    printf("Pre-C89\\n");',
      '#endif',
      '',
      'long long big = 9999999999LL;',
      '_Static_assert(sizeof(int) >= 4, "int too small");',
      'int choice = _Generic(big, long long: 1, default: 0);'
    ],
    steps: [
      { line: 0, text: '<code>#ifdef</code> — conditional compilation. Checks if a macro is defined.', tags: ['Preprocessor'] },
      { line: 1, text: '<code>__STDC_VERSION__</code> — set by the compiler, tells you the C standard.', tags: ['Macro'] },
      { line: 6, text: '<code>long long</code> — added in C99. 64-bit integer.', tags: ['C99'] },
      { line: 7, text: '<code>_Static_assert</code> — added in C11. Fails compilation if condition is false.', tags: ['C11'] },
      { line: 8, text: '<code>_Generic</code> — added in C11. Type-generic selection.', tags: ['C11'] }
    ],
    recap: [
      { title: 'C89', text: 'First ANSI standard. Function prototypes.' },
      { title: 'C99', text: '// comments, long long, VLAs, stdint.h.' },
      { title: 'C11', text: 'Threads, _Generic, _Static_assert.' },
      { title: 'C23', text: 'nullptr, typeof, binary literals, constexpr.' }
    ]
  },

  philosophy: {
    icon: '💭',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Design Philosophy</span>',
    subtitle: 'The design goals behind {THEME} — why C looks and behaves the way it does.',
    facts: [
      { big: 'Small', lbl: 'Language' },
      { big: 'Low-Level', lbl: 'Control' },
      { big: 'Portable', lbl: 'Recompiled' },
      { big: 'Trust', lbl: 'Programmer' },
      { big: 'Fast', lbl: 'No Overhead' }
    ],
    concepts: [
      { icon: '🎯', title: 'Simplicity', desc: 'C does very few things, but does them well.' },
      { icon: '⚙️', title: 'Trust the Programmer', desc: 'C assumes you know what you\'re doing — no hidden safety nets.' },
      { icon: '🚀', title: 'Close to Hardware', desc: 'C maps cleanly to assembly and machine code.' },
      { icon: '🌍', title: 'Portability', desc: 'The same code recompiles on any platform.' }
    ],
    playground: {
      file: 'philosophy.c',
      code: `#include <stdio.h>

int main(void) {
    /* C trusts the programmer — no bounds checking */
    int numbers[3] = { 10, 20, 30 };

    /* Deliberately shows direct memory access via pointer */
    int *ptr = numbers;
    printf("*ptr     = %d\\n", *ptr);
    printf("*(ptr+1) = %d\\n", *(ptr + 1));
    printf("*(ptr+2) = %d\\n", *(ptr + 2));

    /* C lets you do manual memory layout */
    printf("sizeof(int)      = %zu bytes\\n", sizeof(int));
    printf("sizeof(numbers)  = %zu bytes\\n", sizeof(numbers));

    return 0;
}`
    },
    stepCode: [
      'int numbers[3] = { 10, 20, 30 };',
      '',
      'int *ptr = numbers;',
      'printf("%d\\n", *ptr);',
      'printf("%d\\n", *(ptr + 1));',
      'printf("%d\\n", *(ptr + 2));',
      '',
      'printf("sizeof(int) = %zu\\n", sizeof(int));'
    ],
    steps: [
      { line: 0, text: 'Arrays decay to pointers when passed around — fundamental to C.', tags: ['Array'] },
      { line: 2, text: '<code>int *ptr = numbers;</code> — pointer to the first element.', tags: ['Pointer'] },
      { line: 3, text: '<code>*ptr</code> — dereference. Reads the value at the address.', tags: ['Dereference'] },
      { line: 4, text: '<code>*(ptr + 1)</code> — pointer arithmetic. Next element.', tags: ['Arithmetic'] },
      { line: 7, text: '<code>sizeof</code> — compile-time operator. Returns size in bytes.', tags: ['sizeof'] }
    ],
    recap: [
      { title: 'Minimal', text: 'C has only 32 keywords. No hidden magic.' },
      { title: 'Trust the Programmer', text: 'No runtime checks — full responsibility.' },
      { title: 'Fast', text: 'Zero-cost abstractions — you pay only for what you use.' },
      { title: 'Portable', text: 'Write once, recompile everywhere.' }
    ]
  },

  syntax: {
    icon: '📝',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Syntax & Structure</span>',
    subtitle: 'How {THEME} is written in C — grammar rules, valid forms, and common mistakes.',
    facts: [
      { big: 'Case-Sensitive', lbl: 'Identifiers' },
      { big: ';', lbl: 'Statement End' },
      { big: '{ }', lbl: 'Blocks' },
      { big: '// /* */', lbl: 'Comments' },
      { big: 'snake_case', lbl: 'Convention' }
    ],
    concepts: [
      { icon: '📐', title: 'Grammar Rules', desc: 'The exact tokens, punctuation, and ordering C accepts for {THEME}.' },
      { icon: '🎯', title: 'Meaning', desc: 'What the compiler does with {THEME} — semantics define behavior.' },
      { icon: '⚠️', title: 'Common Errors', desc: 'Missing semicolons, wrong types, undeclared variables.' },
      { icon: '💡', title: 'Idioms', desc: 'Accepted ways to write {THEME} in professional C.' }
    ],
    playground: {
      file: 'syntax.c',
      code: `#include <stdio.h>

int main(void) {
    // Single-line comment (C99+)
    /* Multi-line comment */

    int x = 42;      /* declaration + initialization */
    int y = 0;       /* separate declaration */

    y = x * 2;       /* assignment */

    if (y > 50) {
        printf("y is large: %d\\n", y);
    } else {
        printf("y is small: %d\\n", y);
    }

    for (int i = 0; i < 3; i++) {
        printf("i = %d\\n", i);
    }

    return 0;
}`
    },
    stepCode: [
      '#include <stdio.h>',
      '',
      'int main(void) {',
      '    int x = 42;',
      '    int y = x * 2;',
      '    if (y > 50) {',
      '        printf("%d\\n", y);',
      '    }',
      '    return 0;',
      '}'
    ],
    steps: [
      { line: 0, text: 'Preprocessor directive — must start with <code>#</code> at column 1.', tags: ['Include'] },
      { line: 2, text: 'Every statement must end with a semicolon <code>;</code>.', tags: [';'] },
      { line: 3, text: '<code>int x = 42;</code> — declaration and initialization.', tags: ['int'] },
      { line: 5, text: '<code>if (cond)</code> — condition in parentheses, body in braces.', tags: ['if'] },
      { line: 6, text: '<code>printf</code> — formatted output. <code>%d</code> inserts an int.', tags: ['printf'] },
      { line: 9, text: 'Closing brace ends <code>main()</code>. Braces must balance.', tags: ['Block'] }
    ],
    recap: [
      { title: 'Semicolons', text: 'Every statement ends with <code>;</code>. Declarations too.' },
      { title: 'Case-Sensitive', text: '<code>x</code>, <code>X</code>, <code>_x</code> are different.' },
      { title: 'Braces', text: '<code>{ }</code> group multiple statements into a block.' },
      { title: 'Comments', text: '<code>//</code> for one line, <code>/* */</code> for many.' }
    ]
  },

  datatypes: {
    icon: '📦',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Data Types & Variables</span>',
    subtitle: 'How C stores data using {THEME} — types, sizes, and storage.',
    facts: [
      { big: 'char', lbl: '1 byte' },
      { big: 'int', lbl: '4 bytes' },
      { big: 'float', lbl: '4 bytes' },
      { big: 'double', lbl: '8 bytes' },
      { big: 'void', lbl: 'No Type' }
    ],
    concepts: [
      { icon: '📦', title: 'Primitive Types', desc: 'char, int, float, double — the building blocks.' },
      { icon: '🔧', title: 'Modifiers', desc: 'short, long, signed, unsigned change size/range.' },
      { icon: '⚙️', title: 'Storage', desc: 'How variables are stored in memory (stack, static).' },
      { icon: '💡', title: 'When to Use', desc: 'Choosing the right type for correctness and portability.' }
    ],
    playground: {
      file: 'types.c',
      code: `#include <stdio.h>

int main(void) {
    char grade = 'A';
    int age = 25;
    float price = 9.99f;
    double pi = 3.14159265358979;
    unsigned int count = 100;

    printf("char      = %c (%zu byte)\\n", grade, sizeof(grade));
    printf("int       = %d (%zu bytes)\\n", age, sizeof(age));
    printf("float     = %.2f (%zu bytes)\\n", price, sizeof(price));
    printf("double    = %.10f (%zu bytes)\\n", pi, sizeof(pi));
    printf("unsigned  = %u (%zu bytes)\\n", count, sizeof(count));

    return 0;
}`
    },
    stepCode: [
      'char grade = \'A\';',
      'int age = 25;',
      'float price = 9.99f;',
      'double pi = 3.14159265358979;',
      '',
      'printf("%c\\n", grade);',
      'printf("%d\\n", age);',
      'printf("%.2f\\n", price);',
      'printf("%.10f\\n", pi);'
    ],
    steps: [
      { line: 0, text: '<code>char</code> — one byte. Holds a single character or small integer.', tags: ['char'] },
      { line: 1, text: '<code>int</code> — typically 4 bytes. Whole numbers.', tags: ['int'] },
      { line: 2, text: '<code>float</code> — 4 bytes, single precision. The <code>f</code> suffix is required.', tags: ['float'] },
      { line: 3, text: '<code>double</code> — 8 bytes, double precision. Default for floating literals.', tags: ['double'] },
      { line: 5, text: '<code>%c</code> prints a char, <code>%d</code> an int, <code>%f</code> a float.', tags: ['printf'] }
    ],
    recap: [
      { title: 'Fixed Sizes', text: 'Standard types have implementation-defined sizes.' },
      { title: 'Portable Types', text: 'Use <code>stdint.h</code> for exact widths (int32_t, uint8_t).' },
      { title: 'Format Specifiers', text: 'Must match the type — mismatches cause UB.' },
      { title: 'sizeof', text: 'Compile-time operator to get the byte size of any type.' }
    ]
  },

  operators: {
    icon: '➕',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Operators & Expressions</span>',
    subtitle: 'How {THEME} work in C — arithmetic, logical, bitwise, and pointer operators.',
    facts: [
      { big: '+ - * /', lbl: 'Arithmetic' },
      { big: '&& || !', lbl: 'Logical' },
      { big: '& | ^ ~', lbl: 'Bitwise' },
      { big: '< <= >', lbl: 'Comparison' },
      { big: '?:', lbl: 'Ternary' }
    ],
    concepts: [
      { icon: '➕', title: 'Arithmetic', desc: '<code>+ - * / %</code> — with integer division gotchas.' },
      { icon: '🔍', title: 'Comparison', desc: '<code>== != &lt; &lt;= &gt; &gt;=</code> — always yield 0 or 1.' },
      { icon: '🔗', title: 'Logical', desc: '<code>&amp;&amp; || !</code> — short-circuit evaluation.' },
      { icon: '⚡', title: 'Bitwise', desc: '<code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code> — operate on individual bits.' }
    ],
    playground: {
      file: 'operators.c',
      code: `#include <stdio.h>

int main(void) {
    int a = 10, b = 3;

    printf("a + b = %d\\n", a + b);
    printf("a - b = %d\\n", a - b);
    printf("a * b = %d\\n", a * b);
    printf("a / b = %d  (integer division)\\n", a / b);
    printf("a %% b = %d\\n", a % b);

    /* Bitwise */
    printf("a & b  = %d\\n", a & b);
    printf("a | b  = %d\\n", a | b);
    printf("a ^ b  = %d\\n", a ^ b);
    printf("a << 1 = %d\\n", a << 1);

    /* Comparison & logical */
    printf("a > b   = %d\\n", a > b);
    printf("a == b  = %d\\n", a == b);
    printf("a > 5 && b < 5 = %d\\n", a > 5 && b < 5);

    /* Ternary */
    printf("max = %d\\n", a > b ? a : b);

    return 0;
}`
    },
    stepCode: [
      'int a = 10, b = 3;',
      '',
      'int sum = a + b;',
      'int div = a / b;   // 3 (integer division!)',
      'int rem = a % b;   // 1 (remainder)',
      '',
      'int bits = a & b;  // bitwise AND',
      'int shifted = a << 1;  // multiply by 2',
      'int max = a > b ? a : b;'
    ],
    steps: [
      { line: 0, text: 'Multiple variables on one line — <code>int a = 10, b = 3;</code>.', tags: ['Declare'] },
      { line: 3, text: '<strong>Integer division</strong> truncates. <code>10 / 3 == 3</code>, not 3.33.', tags: ['Division'] },
      { line: 4, text: '<code>%</code> — modulo. Returns the remainder.', tags: ['Modulo'] },
      { line: 6, text: '<code>&amp;</code> — bitwise AND. Operates on each binary digit.', tags: ['Bitwise'] },
      { line: 7, text: '<code>&lt;&lt; 1</code> — left shift. Same as multiply by 2.', tags: ['Shift'] },
      { line: 8, text: '<code>?:</code> — ternary. Compact if-else that returns a value.', tags: ['Ternary'] }
    ],
    recap: [
      { title: 'Integer Division', text: '<code>10/3 = 3</code>. Cast to float to get decimals.' },
      { title: 'Short-Circuit', text: '<code>&amp;&amp;</code> and <code>||</code> stop evaluating when result is known.' },
      { title: 'Bitwise', text: 'Powerful for flags, hashing, low-level work.' },
      { title: 'Ternary', text: 'Inline if-else that produces a value.' }
    ]
  },

  control: {
    icon: '🔀',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Control Flow</span>',
    subtitle: 'How to control the flow of execution in C using {THEME}.',
    facts: [
      { big: 'if/else', lbl: 'Branch' },
      { big: 'switch', lbl: 'Multi-way' },
      { big: 'for', lbl: 'Count Loop' },
      { big: 'while', lbl: 'Condition Loop' },
      { big: 'break/continue', lbl: 'Control' }
    ],
    concepts: [
      { icon: '🔀', title: 'Branching', desc: '<code>if</code>, <code>else if</code>, <code>switch</code> — decide what to execute.' },
      { icon: '🔁', title: 'Loops', desc: '<code>for</code>, <code>while</code>, <code>do-while</code> — repeat code.' },
      { icon: '⏹️', title: 'Jump Statements', desc: '<code>break</code>, <code>continue</code>, <code>goto</code>, <code>return</code>.' },
      { icon: '🎯', title: 'Best Practices', desc: 'Always use braces. Avoid <code>goto</code> except for cleanup.' }
    ],
    playground: {
      file: 'control.c',
      code: `#include <stdio.h>

int main(void) {
    int score = 85;

    /* if / else if / else */
    if (score >= 90) {
        printf("Grade: A\\n");
    } else if (score >= 80) {
        printf("Grade: B\\n");
    } else if (score >= 70) {
        printf("Grade: C\\n");
    } else {
        printf("Grade: F\\n");
    }

    /* switch */
    int day = 3;
    switch (day) {
        case 1: printf("Monday\\n"); break;
        case 2: printf("Tuesday\\n"); break;
        case 3: printf("Wednesday\\n"); break;
        default: printf("Other day\\n");
    }

    /* for loop */
    for (int i = 1; i <= 3; i++) {
        printf("Iteration %d\\n", i);
    }

    /* while loop */
    int n = 3;
    while (n > 0) {
        printf("Countdown %d\\n", n);
        n--;
    }

    return 0;
}`
    },
    stepCode: [
      'int score = 85;',
      '',
      'if (score >= 90) {',
      '    printf("A\\n");',
      '} else if (score >= 80) {',
      '    printf("B\\n");',
      '} else {',
      '    printf("F\\n");',
      '}'
    ],
    steps: [
      { line: 2, text: 'First condition checked. If true, its body runs and the rest is skipped.', tags: ['if'] },
      { line: 4, text: '<code>else if</code> — only evaluated when previous conditions were false.', tags: ['else-if'] },
      { line: 5, text: 'Body runs (85 ≥ 80). Prints "B". Program continues after the whole if-chain.', tags: ['Branch'] },
      { line: 7, text: '<code>else</code> — the fallback when nothing matches.', tags: ['else'] }
    ],
    recap: [
      { title: 'if/else', text: 'The universal branching construct.' },
      { title: 'switch', text: 'Cleaner than long if-chains for discrete values.' },
      { title: 'Loops', text: '<code>for</code> when you know the count, <code>while</code> when you don\'t.' },
      { title: 'break/continue', text: '<code>break</code> exits the loop; <code>continue</code> skips to next iteration.' }
    ]
  },

  functions: {
    icon: '🔧',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Functions & Modularity</span>',
    subtitle: 'How to structure C code with {THEME} — reusable, testable building blocks.',
    facts: [
      { big: 'int main', lbl: 'Entry' },
      { big: 'return', lbl: 'Output' },
      { big: 'void', lbl: 'No Return' },
      { big: 'static', lbl: 'Private' },
      { big: 'prototype', lbl: 'Declaration' }
    ],
    concepts: [
      { icon: '🔧', title: 'Declaration', desc: 'Prototypes tell the compiler "this function exists".' },
      { icon: '📦', title: 'Definition', desc: 'The actual body — what the function does.' },
      { icon: '🔄', title: 'Recursion', desc: 'Functions that call themselves. Every C programmer learns recursion.' },
      { icon: '⚡', title: 'Best Practices', desc: 'Small functions, clear names, single responsibility.' }
    ],
    playground: {
      file: 'functions.c',
      code: `#include <stdio.h>

/* Function prototypes */
int add(int a, int b);
int factorial(int n);
void print_hello(void);

/* Definitions */
int add(int a, int b) {
    return a + b;
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

void print_hello(void) {
    printf("Hello from a function!\\n");
}

int main(void) {
    print_hello();
    printf("add(3, 5) = %d\\n", add(3, 5));
    printf("factorial(5) = %d\\n", factorial(5));
    return 0;
}`
    },
    stepCode: [
      'int add(int a, int b);',
      '',
      'int add(int a, int b) {',
      '    return a + b;',
      '}',
      '',
      'int factorial(int n) {',
      '    if (n <= 1) return 1;',
      '    return n * factorial(n - 1);',
      '}'
    ],
    steps: [
      { line: 0, text: '<strong>Prototype</strong> — tells the compiler the function signature. Must come before use.', tags: ['Prototype'] },
      { line: 2, text: '<strong>Definition</strong> — the actual body. Can be in the same file or another .c file.', tags: ['Definition'] },
      { line: 3, text: '<code>return</code> — sends a value back to the caller.', tags: ['return'] },
      { line: 7, text: '<strong>Recursive function</strong> — calls itself with a smaller input.', tags: ['Recursion'] },
      { line: 8, text: '<strong>Base case</strong> — stops the recursion. Must exist or stack overflow!', tags: ['Base Case'] }
    ],
    recap: [
      { title: 'Prototypes', text: 'Declare before use. Put them in a .h file.' },
      { title: 'Small Functions', text: 'Do one thing well.' },
      { title: 'Recursion', text: 'Needs a base case + smaller subproblem.' },
      { title: 'static', text: 'Makes a function private to the file.' }
    ]
  },

  arrays: {
    icon: '📊',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Arrays & Strings</span>',
    subtitle: 'Working with {THEME} in C — fixed-size collections and null-terminated strings.',
    facts: [
      { big: '[]', lbl: 'Array Syntax' },
      { big: '0-indexed', lbl: 'First Element' },
      { big: '\\0', lbl: 'String End' },
      { big: 'strlen', lbl: 'Length' },
      { big: 'contiguous', lbl: 'Memory' }
    ],
    concepts: [
      { icon: '📊', title: 'Arrays', desc: 'Fixed-size sequences stored contiguously in memory.' },
      { icon: '🔤', title: 'Strings', desc: 'Arrays of <code>char</code> terminated by <code>\\0</code>.' },
      { icon: '⚠️', title: 'Bounds', desc: 'No built-in checking — you must guard against overflow.' },
      { icon: '⚙️', title: 'Pointers', desc: 'Arrays decay to pointers when passed to functions.' }
    ],
    playground: {
      file: 'arrays.c',
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    /* Integer array */
    int nums[5] = { 10, 20, 30, 40, 50 };
    int n = sizeof(nums) / sizeof(nums[0]);
    int sum = 0;
    for (int i = 0; i < n; i++) sum += nums[i];
    printf("Sum = %d, Avg = %.2f\\n", sum, (double)sum / n);

    /* String (char array, null-terminated) */
    char greeting[] = "Hello";
    printf("String: %s\\n", greeting);
    printf("Length: %zu\\n", strlen(greeting));
    printf("Bytes:  %zu\\n", sizeof(greeting));

    return 0;
}`
    },
    stepCode: [
      'int nums[5] = { 10, 20, 30, 40, 50 };',
      'int n = sizeof(nums) / sizeof(nums[0]);',
      '',
      'for (int i = 0; i < n; i++)',
      '    sum += nums[i];',
      '',
      'char greeting[] = "Hello";',
      'printf("%s\\n", greeting);',
      'printf("%zu\\n", strlen(greeting));'
    ],
    steps: [
      { line: 0, text: 'Fixed-size array — memory is laid out contiguously.', tags: ['Array'] },
      { line: 1, text: '<code>sizeof</code> trick to compute element count at compile time.', tags: ['sizeof'] },
      { line: 3, text: 'C arrays are zero-indexed. Valid indexes: 0..n-1.', tags: ['Index'] },
      { line: 6, text: 'Strings are char arrays ending with <code>\\0</code> — the null terminator.', tags: ['String'] },
      { line: 8, text: '<code>strlen</code> counts characters up to <code>\\0</code> (not including it).', tags: ['strlen'] }
    ],
    recap: [
      { title: 'Zero-Indexed', text: 'First element is <code>arr[0]</code>.' },
      { title: 'No Bounds Check', text: 'C trusts you. Going out of bounds = undefined behavior.' },
      { title: 'Strings', text: 'End with <code>\\0</code>. Length must include the terminator.' },
      { title: 'sizeof Trick', text: '<code>sizeof(arr)/sizeof(arr[0])</code> gives the count.' }
    ]
  },

  pointers: {
    icon: '👉',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Pointers</span>',
    subtitle: 'Understanding {THEME} in C — the language\'s most powerful and most misunderstood feature.',
    facts: [
      { big: '&', lbl: 'Address-of' },
      { big: '*', lbl: 'Dereference' },
      { big: 'NULL', lbl: 'Null Pointer' },
      { big: 'void *', lbl: 'Generic Pointer' },
      { big: '8 bytes', lbl: 'On 64-bit' }
    ],
    concepts: [
      { icon: '👉', title: 'What Is a Pointer', desc: 'A variable that stores a memory address.' },
      { icon: '&amp;', title: 'Getting an Address', desc: '<code>&amp;x</code> returns the address of <code>x</code>.' },
      { icon: '*', title: 'Dereferencing', desc: '<code>*ptr</code> accesses the value at that address.' },
      { icon: '⚙️', title: 'Pointer Arithmetic', desc: '<code>ptr + 1</code> moves by <code>sizeof(*ptr)</code> bytes.' }
    ],
    playground: {
      file: 'pointers.c',
      code: `#include <stdio.h>

int main(void) {
    int x = 42;
    int *ptr = &x;

    printf("x         = %d\\n", x);
    printf("&x        = %p\\n", (void *)&x);
    printf("ptr       = %p\\n", (void *)ptr);
    printf("*ptr      = %d\\n", *ptr);

    /* Modify through pointer */
    *ptr = 100;
    printf("After *ptr = 100, x = %d\\n", x);

    /* NULL pointer */
    int *null_ptr = NULL;
    if (null_ptr == NULL) {
        printf("null_ptr is NULL, safe to check before dereferencing\\n");
    }

    /* Pointer to array */
    int arr[] = { 1, 2, 3 };
    int *ap = arr;
    for (int i = 0; i < 3; i++) {
        printf("arr[%d] = %d  *(ap+%d) = %d\\n", i, arr[i], i, *(ap + i));
    }

    return 0;
}`
    },
    stepCode: [
      'int x = 42;',
      'int *ptr = &x;',
      '',
      'printf("%p\\n", (void *)ptr);',
      'printf("%d\\n", *ptr);',
      '',
      '*ptr = 100;',
      '',
      'int *null_ptr = NULL;',
      'if (null_ptr == NULL) { /* safe */ }'
    ],
    steps: [
      { line: 0, text: 'A normal int variable stored on the stack.', tags: ['int'] },
      { line: 1, text: '<code>&amp;x</code> — gets the address of <code>x</code>. <code>ptr</code> holds it.', tags: ['&'] },
      { line: 3, text: '<code>%p</code> prints pointers. Cast to <code>void *</code> for portability.', tags: ['printf'] },
      { line: 4, text: '<code>*ptr</code> — dereference. Reads the value at the address.', tags: ['Dereference'] },
      { line: 6, text: 'Writing through the pointer changes <code>x</code> itself.', tags: ['Write'] },
      { line: 8, text: '<code>NULL</code> — always check pointers before dereferencing.', tags: ['NULL'] }
    ],
    recap: [
      { title: '&amp; and *', text: '<code>&amp;</code> gets the address, <code>*</code> reads it.' },
      { title: 'Pointer Arithmetic', text: '<code>ptr + 1</code> jumps by the type size, not 1 byte.' },
      { title: 'NULL', text: 'Always initialize and always check.' },
      { title: 'Power & Danger', text: 'Pointers enable low-level control but invite crashes.' }
    ]
  },

  memory: {
    icon: '🧠',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Memory Management</span>',
    subtitle: 'Managing {THEME} in C — dynamic allocation, the heap, and avoiding leaks.',
    facts: [
      { big: 'malloc', lbl: 'Allocate' },
      { big: 'free', lbl: 'Release' },
      { big: 'Stack', lbl: 'Auto' },
      { big: 'Heap', lbl: 'Manual' },
      { big: 'valgrind', lbl: 'Detect' }
    ],
    concepts: [
      { icon: '📚', title: 'Stack vs Heap', desc: 'Stack is automatic and fast. Heap is manual and flexible.' },
      { icon: '⚙️', title: 'malloc/free', desc: 'Allocate and release dynamic memory.' },
      { icon: '⚠️', title: 'Memory Leaks', desc: 'Forgetting to <code>free()</code> wastes memory.' },
      { icon: '🐛', title: 'Use-After-Free', desc: 'Accessing memory after releasing it = undefined behavior.' }
    ],
    playground: {
      file: 'memory.c',
      code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    /* Allocate space for 5 ints on the heap */
    int n = 5;
    int *arr = malloc(n * sizeof(int));

    if (arr == NULL) {
        fprintf(stderr, "malloc failed\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;

    int sum = 0;
    for (int i = 0; i < n; i++) sum += arr[i];
    printf("Sum = %d\\n", sum);

    /* Resize with realloc */
    arr = realloc(arr, 10 * sizeof(int));
    if (arr == NULL) return 1;

    for (int i = n; i < 10; i++) arr[i] = (i + 1) * 10;

    int total = 0;
    for (int i = 0; i < 10; i++) total += arr[i];
    printf("New total = %d\\n", total);

    /* Always free! */
    free(arr);
    arr = NULL;  /* prevent dangling pointer */

    printf("Memory freed cleanly\\n");
    return 0;
}`
    },
    stepCode: [
      'int *arr = malloc(5 * sizeof(int));',
      'if (arr == NULL) return 1;',
      '',
      'for (int i = 0; i < 5; i++)',
      '    arr[i] = (i + 1) * 10;',
      '',
      'arr = realloc(arr, 10 * sizeof(int));',
      '',
      'free(arr);',
      'arr = NULL;'
    ],
    steps: [
      { line: 0, text: '<code>malloc</code> — allocate bytes on the heap. Returns a <code>void *</code>.', tags: ['malloc'] },
      { line: 1, text: 'Always check the return value. <code>malloc</code> can return NULL.', tags: ['NULL'] },
      { line: 4, text: 'Access like an array — <code>arr[i]</code> equals <code>*(arr + i)</code>.', tags: ['Array'] },
      { line: 6, text: '<code>realloc</code> — resize an existing allocation, preserving contents.', tags: ['realloc'] },
      { line: 8, text: '<code>free</code> — release memory. Every <code>malloc</code> must have one <code>free</code>.', tags: ['free'] },
      { line: 9, text: 'Set to NULL after free — prevents accidental use-after-free.', tags: ['Safety'] }
    ],
    recap: [
      { title: 'malloc/free', text: 'You allocate, you release. No garbage collector.' },
      { title: 'Always Check', text: '<code>malloc</code> can fail — check for NULL.' },
      { title: 'No Leaks', text: 'Every allocation needs a matching free.' },
      { title: 'Valgrind', text: 'The essential tool for catching memory bugs.' }
    ]
  },

  structs: {
    icon: '🏗️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Structs, Unions, Enums</span>',
    subtitle: 'Creating custom data types in C using {THEME}.',
    facts: [
      { big: 'struct', lbl: 'Bundle' },
      { big: 'union', lbl: 'Shared Mem' },
      { big: 'enum', lbl: 'Named Ints' },
      { big: 'typedef', lbl: 'Alias' },
      { big: '->', lbl: 'Pointer Access' }
    ],
    concepts: [
      { icon: '🏗️', title: 'struct', desc: 'Group related fields into a single custom type.' },
      { icon: '🔀', title: 'union', desc: 'Same memory, different interpretations.' },
      { icon: '🔢', title: 'enum', desc: 'Named integer constants.' },
      { icon: '🏷️', title: 'typedef', desc: 'Create aliases for existing types.' }
    ],
    playground: {
      file: 'structs.c',
      code: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[32];
    int age;
    float height;
} Person;

typedef enum {
    RED,
    GREEN,
    BLUE
} Color;

int main(void) {
    Person p1;
    strcpy(p1.name, "Alice");
    p1.age = 30;
    p1.height = 1.65f;

    Person p2 = { "Bob", 25, 1.80f };

    Person *ptr = &p1;
    printf("%s is %d years old (%.2f m)\\n", ptr->name, ptr->age, ptr->height);
    printf("%s is %d years old (%.2f m)\\n", p2.name, p2.age, p2.height);

    Color c = GREEN;
    switch (c) {
        case RED:   printf("RED\\n");   break;
        case GREEN: printf("GREEN\\n"); break;
        case BLUE:  printf("BLUE\\n");  break;
    }

    return 0;
}`
    },
    stepCode: [
      'typedef struct {',
      '    char name[32];',
      '    int age;',
      '    float height;',
      '} Person;',
      '',
      'Person p = { "Alice", 30, 1.65f };',
      'Person *ptr = &p;',
      'printf("%s\\n", ptr->name);',
      'printf("%d\\n", p.age);'
    ],
    steps: [
      { line: 0, text: '<code>struct</code> — a user-defined type with multiple fields.', tags: ['struct'] },
      { line: 1, text: 'Arrays inside structs need a fixed size at compile time.', tags: ['Array'] },
      { line: 5, text: '<code>typedef</code> creates an alias — no more <code>struct Person</code> typing.', tags: ['typedef'] },
      { line: 6, text: 'Brace initialization — fields must match declaration order.', tags: ['Init'] },
      { line: 8, text: '<code>ptr-&gt;name</code> = <code>(*ptr).name</code>. Arrow for pointer access.', tags: ['Arrow'] }
    ],
    recap: [
      { title: 'struct', text: 'Bundle related data together.' },
      { title: 'typedef', text: 'Alias for cleaner type names.' },
      { title: 'enum', text: 'Named constants with automatic numbering.' },
      { title: '-> vs .', text: 'Dot for values, arrow for pointers.' }
    ]
  },

  preprocessor: {
    icon: '⚙️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Preprocessor</span>',
    subtitle: 'Everything about {THEME} — macros, includes, and conditional compilation.',
    facts: [
      { big: '#define', lbl: 'Macro' },
      { big: '#include', lbl: 'Import' },
      { big: '#ifdef', lbl: 'Condition' },
      { big: '##', lbl: 'Concat' },
      { big: '#', lbl: 'Stringify' }
    ],
    concepts: [
      { icon: '📥', title: '#include', desc: 'Paste file contents at this point.' },
      { icon: '🔤', title: '#define', desc: 'Simple text substitution — before compilation.' },
      { icon: '⚙️', title: 'Conditional', desc: '<code>#ifdef</code>, <code>#ifndef</code>, <code>#if</code> — include or exclude code.' },
      { icon: '⚠️', title: 'Pitfalls', desc: 'No type checking. Watch out for macros without parentheses.' }
    ],
    playground: {
      file: 'preprocessor.c',
      code: `#include <stdio.h>

#define PI 3.14159
#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define DEBUG 1

int main(void) {
    printf("PI = %f\\n", PI);
    printf("SQUARE(5) = %d\\n", SQUARE(5));
    printf("MAX(3, 7) = %d\\n", MAX(3, 7));

    /* Conditional compilation */
#ifdef DEBUG
    printf("[DEBUG] debug mode is on\\n");
#endif

#ifndef RELEASE
    printf("[INFO] this is not a release build\\n");
#endif

    /* Stringify */
#define STR(x) #x
    printf("STR(hello) = %s\\n", STR(hello));

    return 0;
}`
    },
    stepCode: [
      '#define PI 3.14159',
      '#define SQUARE(x) ((x) * (x))',
      '#define MAX(a, b) ((a) > (b) ? (a) : (b))',
      '',
      '#ifdef DEBUG',
      '    printf("debug\\n");',
      '#endif',
      '',
      'printf("%d\\n", SQUARE(5));',
      'printf("%d\\n", MAX(3, 7));'
    ],
    steps: [
      { line: 0, text: '<code>#define</code> — pure text substitution. No type. No semicolon.', tags: ['define'] },
      { line: 1, text: 'Macros with arguments. Always wrap args in <code>()</code> to avoid precedence bugs.', tags: ['Macro'] },
      { line: 2, text: 'The ternary + parens pattern — classic safe macro.', tags: ['Macro'] },
      { line: 4, text: '<code>#ifdef DEBUG</code> — includes code only when DEBUG is defined.', tags: ['ifdef'] },
      { line: 8, text: 'Preprocessor expands <code>SQUARE(5)</code> to <code>((5) * (5))</code>.', tags: ['Expand'] }
    ],
    recap: [
      { title: 'Text Substitution', text: 'Macros copy-paste before compilation.' },
      { title: 'Parenthesize', text: 'Always wrap macro args: <code>((x) * (x))</code>.' },
      { title: 'Conditional', text: '<code>#ifdef</code> enables/disables code per platform.' },
      { title: 'Include Guards', text: '<code>#ifndef FILE_H</code> prevents double inclusion.' }
    ]
  },

  fileio: {
    icon: '📁',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">File I/O</span>',
    subtitle: 'Reading and writing files in C using {THEME}.',
    facts: [
      { big: 'fopen', lbl: 'Open' },
      { big: 'fclose', lbl: 'Close' },
      { big: 'fprintf', lbl: 'Write' },
      { big: 'fscanf', lbl: 'Read' },
      { big: 'FILE *', lbl: 'Handle' }
    ],
    concepts: [
      { icon: '📂', title: 'File Modes', desc: '<code>"r"</code> read, <code>"w"</code> write, <code>"a"</code> append.' },
      { icon: '🔒', title: 'Always Close', desc: 'Every <code>fopen</code> needs a matching <code>fclose</code>.' },
      { icon: '📖', title: 'Reading', desc: '<code>fgets</code>, <code>fscanf</code>, <code>fread</code>.' },
      { icon: '✍️', title: 'Writing', desc: '<code>fputs</code>, <code>fprintf</code>, <code>fwrite</code>.' }
    ],
    playground: {
      file: 'fileio.c',
      code: `#include <stdio.h>

int main(void) {
    const char *filename = "demo.txt";

    /* Write to a file */
    FILE *f = fopen(filename, "w");
    if (f == NULL) {
        perror("fopen for write");
        return 1;
    }
    fprintf(f, "Line 1: Hello\\n");
    fprintf(f, "Line 2: World\\n");
    fprintf(f, "Line 3: C is awesome\\n");
    fclose(f);
    printf("Wrote to %s\\n", filename);

    /* Read it back */
    f = fopen(filename, "r");
    if (f == NULL) {
        perror("fopen for read");
        return 1;
    }

    char buffer[256];
    int line = 0;
    while (fgets(buffer, sizeof(buffer), f) != NULL) {
        line++;
        printf("%d: %s", line, buffer);
    }
    fclose(f);

    return 0;
}`
    },
    stepCode: [
      'FILE *f = fopen("demo.txt", "w");',
      'if (f == NULL) { perror("fopen"); return 1; }',
      '',
      'fprintf(f, "Hello\\n");',
      'fclose(f);',
      '',
      'f = fopen("demo.txt", "r");',
      'while (fgets(buffer, sizeof(buffer), f) != NULL) {',
      '    printf("%s", buffer);',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>fopen</code> — opens a file. Returns a <code>FILE *</code> or NULL on error.', tags: ['fopen'] },
      { line: 1, text: 'Always check for NULL. <code>perror</code> prints the system error message.', tags: ['Check'] },
      { line: 3, text: '<code>fprintf</code> — like printf, but writes to a file.', tags: ['fprintf'] },
      { line: 4, text: '<code>fclose</code> — flush buffers and release the file handle. Never forget.', tags: ['fclose'] },
      { line: 7, text: '<code>fgets</code> — safe line reader. Returns NULL at end of file.', tags: ['fgets'] }
    ],
    recap: [
      { title: 'fopen/fclose', text: 'Every open must be closed.' },
      { title: 'Modes', text: '<code>"r"</code> read, <code>"w"</code> write (truncates), <code>"a"</code> append.' },
      { title: 'Safety', text: 'Always check for NULL return values.' },
      { title: 'Binary Mode', text: 'Add "b" for binary files on Windows.' }
    ]
  },

  concurrency: {
    icon: '⚡',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Concurrency</span>',
    subtitle: 'Multi-threaded programming in C with {THEME}.',
    facts: [
      { big: 'pthreads', lbl: 'POSIX Threads' },
      { big: 'mutex', lbl: 'Locking' },
      { big: 'atomic', lbl: 'C11' },
      { big: 'race', lbl: 'Condition' },
      { big: 'join', lbl: 'Sync' }
    ],
    concepts: [
      { icon: '⚡', title: 'Threads', desc: 'Independent sequences of execution sharing memory.' },
      { icon: '🔒', title: 'Mutexes', desc: 'Prevent two threads from accessing shared data at once.' },
      { icon: '⚛️', title: 'Atomics', desc: 'C11 <code>_Atomic</code> — lock-free primitives.' },
      { icon: '⚠️', title: 'Race Conditions', desc: 'The #1 concurrency bug. Non-deterministic.' }
    ],
    playground: {
      file: 'threads.c',
      code: `#include <stdio.h>
#include <pthread.h>

void *worker(void *arg) {
    int id = *(int *)arg;
    printf("Thread %d running\\n", id);
    return NULL;
}

int main(void) {
    pthread_t threads[3];
    int ids[3] = { 1, 2, 3 };

    for (int i = 0; i < 3; i++) {
        pthread_create(&threads[i], NULL, worker, &ids[i]);
    }

    for (int i = 0; i < 3; i++) {
        pthread_join(threads[i], NULL);
    }

    printf("All threads finished\\n");
    return 0;
}`
    },
    stepCode: [
      'void *worker(void *arg) {',
      '    int id = *(int *)arg;',
      '    printf("Thread %d\\n", id);',
      '    return NULL;',
      '}',
      '',
      'pthread_create(&threads[i], NULL, worker, &ids[i]);',
      '',
      'pthread_join(threads[i], NULL);'
    ],
    steps: [
      { line: 0, text: 'Thread function signature: <code>void *(void *)</code> — returns and takes a void pointer.', tags: ['Thread'] },
      { line: 1, text: 'Cast the arg back to its original type to use it.', tags: ['Cast'] },
      { line: 6, text: '<code>pthread_create</code> — spawn a thread. Pass function + argument.', tags: ['Create'] },
      { line: 8, text: '<code>pthread_join</code> — wait for the thread to finish. Always join.', tags: ['Join'] }
    ],
    recap: [
      { title: 'pthreads', text: 'The POSIX standard threading library.' },
      { title: 'Shared Memory', text: 'Threads share the heap — the source of most bugs.' },
      { title: 'Mutexes', text: 'Lock before read/write of shared data.' },
      { title: 'C11 <threads.h>', text: 'Modern standard alternative to pthreads.' }
    ]
  },

  tooling: {
    icon: '🛠️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Tools & Workflow</span>',
    subtitle: 'The tools every C developer uses daily with {THEME}.',
    facts: [
      { big: 'gcc', lbl: 'Compiler' },
      { big: 'clang', lbl: 'Alternative' },
      { big: 'make', lbl: 'Build' },
      { big: 'gdb', lbl: 'Debugger' },
      { big: 'valgrind', lbl: 'Analysis' }
    ],
    concepts: [
      { icon: '⚙️', title: 'Compiler', desc: 'gcc or clang — the two major C compilers.' },
      { icon: '📁', title: 'Makefile', desc: 'Automate multi-file builds with <code>make</code>.' },
      { icon: '🐛', title: 'Debugger', desc: 'gdb for step-through debugging.' },
      { icon: '🔍', title: 'Analysis', desc: 'valgrind and sanitizers for runtime bugs.' }
    ],
    playground: {
      file: 'commands.sh',
      code: `# Essential C compiler commands

gcc hello.c -o hello              # compile
./hello                           # run

# Compile with warnings (always do this)
gcc -Wall -Wextra -pedantic hello.c -o hello

# Debug build
gcc -g -O0 hello.c -o hello

# Optimized release build
gcc -O2 hello.c -o hello

# Link a library
gcc main.c -lm -o app

# With sanitizers
gcc -fsanitize=address,undefined -g main.c -o main

# Makefile
# hello: hello.c
#     gcc -Wall -o hello hello.c`
    },
    stepCode: [
      'gcc hello.c -o hello',
      './hello',
      '',
      'gcc -Wall -Wextra -pedantic hello.c -o hello',
      'gcc -g -O0 hello.c -o hello',
      'gcc -O2 hello.c -o hello',
      'gcc main.c -lm -o app',
      'gcc -fsanitize=address -g main.c -o main'
    ],
    steps: [
      { line: 0, text: 'Basic compile: source → executable. <code>-o</code> names the output.', tags: ['gcc'] },
      { line: 1, text: 'Run the compiled binary.', tags: ['Run'] },
      { line: 3, text: '<code>-Wall -Wextra</code> enables all warnings. Never skip these.', tags: ['Warnings'] },
      { line: 4, text: '<code>-g</code> keeps debug info. <code>-O0</code> disables optimization (better debugging).', tags: ['Debug'] },
      { line: 5, text: '<code>-O2</code> for production. Faster code, harder to debug.', tags: ['Optimize'] },
      { line: 7, text: 'AddressSanitizer catches memory bugs at runtime — essential.', tags: ['Sanitizer'] }
    ],
    recap: [
      { title: 'Always -Wall', text: 'Enable all warnings. Then fix them.' },
      { title: 'Two Builds', text: 'Debug (-g -O0) and Release (-O2).' },
      { title: 'Sanitizers', text: 'ASan + UBSan catch what testing misses.' },
      { title: 'Makefile', text: 'Required for multi-file projects.' }
    ]
  },

  testing: {
    icon: '🧪',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Testing & Validation</span>',
    subtitle: 'How to verify {THEME} works — unit tests, assertions, and quality tools.',
    facts: [
      { big: 'assert.h', lbl: 'Standard' },
      { big: 'Unity', lbl: 'Framework' },
      { big: 'CMocka', lbl: 'Alternative' },
      { big: 'valgrind', lbl: 'Memory' },
      { big: 'gcov', lbl: 'Coverage' }
    ],
    concepts: [
      { icon: '✅', title: 'Assertions', desc: 'Use <code>assert()</code> to catch logic errors early.' },
      { icon: '🧪', title: 'Unit Tests', desc: 'Small frameworks: Unity, CMocka, or custom.' },
      { icon: '🔍', title: 'Valgrind', desc: 'Detects memory leaks and uninitialized reads.' },
      { icon: '📊', title: 'Coverage', desc: 'gcov + lcov measure tested code paths.' }
    ],
    playground: {
      file: 'tests.c',
      code: `#include <stdio.h>
#include <assert.h>

int add(int a, int b) { return a + b; }
int divide(int a, int b) {
    assert(b != 0);
    return a / b;
}

int test_add(void) {
    if (add(2, 3) != 5) { printf("FAIL: add(2,3)\\n"); return 1; }
    if (add(-1, 1) != 0) { printf("FAIL: add(-1,1)\\n"); return 1; }
    printf("PASS: add tests\\n");
    return 0;
}

int test_divide(void) {
    if (divide(10, 2) != 5) { printf("FAIL: divide\\n"); return 1; }
    printf("PASS: divide tests\\n");
    return 0;
}

int main(void) {
    int failures = 0;
    failures += test_add();
    failures += test_divide();

    if (failures == 0) {
        printf("All tests passed!\\n");
        return 0;
    }
    printf("%d test(s) failed\\n", failures);
    return 1;
}`
    },
    stepCode: [
      '#include <assert.h>',
      '',
      'int divide(int a, int b) {',
      '    assert(b != 0);',
      '    return a / b;',
      '}',
      '',
      'int test_add(void) {',
      '    if (add(2, 3) != 5) return 1;',
      '    return 0;',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>assert.h</code> — the standard assertion macro.', tags: ['Header'] },
      { line: 3, text: '<code>assert(cond)</code> — aborts if condition is false. Disabled in NDEBUG builds.', tags: ['assert'] },
      { line: 7, text: 'Simple test function — returns 0 on pass, non-zero on fail.', tags: ['Test'] },
      { line: 8, text: 'Compare expected vs actual. <code>!=</code> catches mismatches.', tags: ['Compare'] }
    ],
    recap: [
      { title: 'assert', text: 'Catch programming errors during development.' },
      { title: 'Test Early', text: 'Write tests as you write code.' },
      { title: 'Valgrind', text: 'Run every test binary under valgrind.' },
      { title: 'Unity', text: 'Popular lightweight C testing framework.' }
    ]
  },

  performance: {
    icon: '⚡',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Performance</span>',
    subtitle: 'Optimization techniques for {THEME} — profiling, cache, and compiler hints.',
    facts: [
      { big: '-O2', lbl: 'Optimize' },
      { big: 'perf', lbl: 'Profile' },
      { big: 'cache', lbl: 'Cache Line' },
      { big: 'inline', lbl: 'Hint' },
      { big: 'SIMD', lbl: 'Vector' }
    ],
    concepts: [
      { icon: '📊', title: 'Measure First', desc: 'Never optimize by guessing. Profile with <code>perf</code>.' },
      { icon: '🔥', title: 'Hot Paths', desc: 'Find the 10% of code that runs 90% of the time.' },
      { icon: '🧠', title: 'Cache Locality', desc: 'Access memory sequentially for best CPU cache use.' },
      { icon: '⚙️', title: 'Compiler Flags', desc: '<code>-O2</code>, <code>-O3</code>, <code>-march=native</code>.' }
    ],
    playground: {
      file: 'performance.c',
      code: `#include <stdio.h>
#include <time.h>

#define N 1000000

int main(void) {
    /* Row-major vs column-major access */
    static int matrix[1000][1000];

    clock_t t1 = clock();
    long long sum1 = 0;
    for (int i = 0; i < 1000; i++)
        for (int j = 0; j < 1000; j++)
            sum1 += matrix[i][j];
    double row_time = (double)(clock() - t1) / CLOCKS_PER_SEC;

    clock_t t2 = clock();
    long long sum2 = 0;
    for (int j = 0; j < 1000; j++)
        for (int i = 0; i < 1000; i++)
            sum2 += matrix[i][j];
    double col_time = (double)(clock() - t2) / CLOCKS_PER_SEC;

    printf("Row-major: %.6f s\\n", row_time);
    printf("Col-major: %.6f s\\n", col_time);
    printf("Row is usually much faster (cache)\\n");

    return 0;
}`
    },
    stepCode: [
      '#define N 1000000',
      'clock_t t1 = clock();',
      '',
      'for (int i = 0; i < 1000; i++)',
      '    for (int j = 0; j < 1000; j++)',
      '        sum += matrix[i][j];',
      '',
      'double t = (double)(clock() - t1) / CLOCKS_PER_SEC;',
      'printf("%.6f s\\n", t);'
    ],
    steps: [
      { line: 1, text: '<code>clock()</code> — standard C timing function. Returns CPU ticks.', tags: ['Timing'] },
      { line: 3, text: 'Row-major traversal — reads memory in the same order it was allocated. Cache-friendly.', tags: ['Cache'] },
      { line: 6, text: 'If you flip the loops (column-major), each access misses the cache — 10x slower.', tags: ['Cache'] },
      { line: 7, text: 'Convert ticks to seconds by dividing by <code>CLOCKS_PER_SEC</code>.', tags: ['Timing'] }
    ],
    recap: [
      { title: 'Measure', text: 'Never optimize without profiling data.' },
      { title: 'Cache Locality', text: 'Sequential memory access is 10x faster.' },
      { title: 'Compiler Flags', text: '<code>-O2</code> gives huge speedups for free.' },
      { title: 'Profiling', text: '<code>perf</code> and <code>gprof</code> show where time is spent.' }
    ]
  },

  security: {
    icon: '🛡️',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Security & Safety</span>',
    subtitle: 'Writing safe C code with {THEME} — preventing overflow, injection, and undefined behavior.',
    facts: [
      { big: 'ASLR', lbl: 'OS' },
      { big: 'Stack Canary', lbl: 'Compiler' },
      { big: 'ASan', lbl: 'Sanitizer' },
      { big: 'FORTIFY', lbl: 'Hardening' },
      { big: 'strncpy', lbl: 'Safe' }
    ],
    concepts: [
      { icon: '🛡️', title: 'Buffer Overflow', desc: 'The #1 C vulnerability. Never trust input length.' },
      { icon: '🔒', title: 'Input Validation', desc: 'Validate every byte that comes from outside.' },
      { icon: '⚠️', title: 'Undefined Behavior', desc: 'Signed overflow, null deref, use-after-free.' },
      { icon: '🔧', title: 'Hardening Flags', desc: '<code>-fstack-protector-strong</code>, ASan, UBSan.' }
    ],
    playground: {
      file: 'security.c',
      code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char buffer[16];
    const char *user_input = "This is way too long for the buffer";

    /* BAD: unchecked copy — buffer overflow */
    /* strcpy(buffer, user_input); */

    /* GOOD: bounded copy */
    strncpy(buffer, user_input, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\\0';
    printf("Safe buffer: %s\\n", buffer);

    /* Integer overflow check */
    int a = 2000000000;
    int b = 2000000000;
    if (a > 0 && b > 0 && a > 2147483647 - b) {
        printf("Integer overflow would occur!\\n");
    } else {
        printf("a + b = %d\\n", a + b);
    }

    return 0;
}`
    },
    stepCode: [
      'char buffer[16];',
      'const char *input = "way too long";',
      '',
      '// BAD: strcpy(buffer, input);',
      '',
      'strncpy(buffer, input, sizeof(buffer) - 1);',
      'buffer[sizeof(buffer) - 1] = \'\\0\';',
      '',
      '// Check for overflow before add',
      'if (a > INT_MAX - b) { /* overflow! */ }'
    ],
    steps: [
      { line: 0, text: 'Fixed-size buffer — a classic source of overflow bugs.', tags: ['Buffer'] },
      { line: 3, text: '<code>strcpy</code> copies until <code>\\0</code> — no length check. Dangerous.', tags: ['strcpy'] },
      { line: 5, text: '<code>strncpy</code> — bounded copy. Never writes more than <code>size</code> bytes.', tags: ['strncpy'] },
      { line: 6, text: 'Always manually null-terminate — <code>strncpy</code> may not.', tags: ['Safety'] },
      { line: 9, text: 'Check for integer overflow <em>before</em> performing the operation.', tags: ['Overflow'] }
    ],
    recap: [
      { title: 'Buffer Overflow', text: 'The #1 C vulnerability. Use bounded functions.' },
      { title: 'strncpy', text: 'Always specify the size and null-terminate.' },
      { title: 'Overflow Checks', text: 'Check before adding or multiplying integers.' },
      { title: 'Hardening', text: 'Enable stack protector, ASan, FORTIFY_SOURCE.' }
    ]
  },

  interview: {
    icon: '🎯',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Interview Preparation</span>',
    subtitle: 'Common C interview questions on {THEME} with answers.',
    facts: [
      { big: '10+', lbl: 'Questions' },
      { big: 'FAQ', lbl: 'Common' },
      { big: 'Real', lbl: 'Scenario' },
      { big: 'Answers', lbl: 'Explained' },
      { big: 'Practice', lbl: 'Needed' }
    ],
    concepts: [
      { icon: '🎤', title: 'Common Questions', desc: 'The most frequent C interview questions on {THEME}.' },
      { icon: '💡', title: 'Answers', desc: 'Clear, correct explanations with code.' },
      { icon: '⚠️', title: 'Gotchas', desc: 'The tricky parts interviewers test.' },
      { icon: '🎯', title: 'Follow-ups', desc: 'Questions the interviewer asks next.' }
    ],
    playground: {
      file: 'interview.c',
      code: `#include <stdio.h>

int main(void) {
    /* Q: What is the difference between i++ and ++i? */
    int i = 5;
    printf("i++ = %d (returns %d, then increments)\\n", i++, i);
    i = 5;
    printf("++i = %d (increments %d first)\\n", ++i, i);

    /* Q: What is the size of an array? */
    int arr[] = { 1, 2, 3, 4, 5 };
    printf("Size of arr = %zu bytes\\n", sizeof(arr));
    printf("Elements    = %zu\\n", sizeof(arr) / sizeof(arr[0]));

    /* Q: What is the difference between int *p and int **p? */
    int x = 10;
    int *p = &x;
    int **pp = &p;
    printf("x = %d, *p = %d, **pp = %d\\n", x, *p, **pp);

    return 0;
}`
    },
    stepCode: [
      'int i = 5;',
      'printf("%d\\n", i++);  // 5 (then i becomes 6)',
      'i = 5;',
      'printf("%d\\n", ++i);  // 6 (i becomes 6 first)',
      '',
      'int **pp = &p;',
      'printf("%d\\n", **pp);  // double dereference'
    ],
    steps: [
      { line: 1, text: '<strong>Post-increment</strong> — returns original value, then increments.', tags: ['i++'] },
      { line: 3, text: '<strong>Pre-increment</strong> — increments first, then returns.', tags: ['++i'] },
      { line: 5, text: 'Pointer to pointer — used for out-parameters and dynamic 2D arrays.', tags: ['Pointer'] },
      { line: 6, text: 'Double dereference <code>**pp</code> follows both pointers to the value.', tags: ['Deref'] }
    ],
    recap: [
      { title: 'i++ vs ++i', text: 'Post returns old value, pre returns new.' },
      { title: 'sizeof', text: 'Compile-time. Arrays give total bytes.' },
      { title: 'Pointer Levels', text: '<code>*p</code> is one level, <code>**p</code> is two.' },
      { title: 'Practice', text: 'Whiteboard these by hand before the interview.' }
    ]
  },

  projects: {
    icon: '🚀',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Real-World Projects</span>',
    subtitle: 'Build real C projects using {THEME} — patterns used in production software.',
    facts: [
      { big: 'CLI', lbl: 'Tool' },
      { big: 'Library', lbl: 'Reusable' },
      { big: 'Embedded', lbl: 'Hardware' },
      { big: 'OS', lbl: 'Kernel' },
      { big: 'Port', lbl: 'Modular' }
    ],
    concepts: [
      { icon: '📁', title: 'Project Layout', desc: 'src/, include/, tests/, Makefile — the classic structure.' },
      { icon: '🔧', title: 'Modular Code', desc: 'Split logic across <code>.c</code> files with <code>.h</code> interfaces.' },
      { icon: '🧪', title: 'Testability', desc: 'Design for unit tests from day one.' },
      { icon: '📦', title: 'Build System', desc: 'Makefile or CMake to automate builds.' }
    ],
    playground: {
      file: 'main.c',
      code: `#include <stdio.h>
#include "calc.h"

int main(void) {
    int a = 15, b = 4;

    printf("add(%d, %d)     = %d\\n", a, b, add(a, b));
    printf("subtract(%d, %d) = %d\\n", a, b, subtract(a, b));
    printf("multiply(%d, %d) = %d\\n", a, b, multiply(a, b));

    return 0;
}

/* ---- calc.h ---- */
// int add(int a, int b);
// int subtract(int a, int b);
// int multiply(int a, int b);

/* ---- calc.c ---- */
// int add(int a, int b) { return a + b; }
// int subtract(int a, int b) { return a - b; }
// int multiply(int a, int b) { return a * b; }`
    },
    stepCode: [
      '#include "calc.h"',
      '',
      'int main(void) {',
      '    printf("%d\\n", add(15, 4));',
      '    printf("%d\\n", subtract(15, 4));',
      '    printf("%d\\n", multiply(15, 4));',
      '    return 0;',
      '}',
      '',
      '// calc.h — public API',
      '// calc.c — implementation'
    ],
    steps: [
      { line: 0, text: 'Include your own header with <code>"..."</code> — not angle brackets.', tags: ['Include'] },
      { line: 3, text: 'Each function in its own file — clean separation of concerns.', tags: ['Modular'] },
      { line: 9, text: '<code>.h</code> files declare the API. <code>.c</code> files implement it.', tags: ['Structure'] },
      { line: 10, text: 'Build with: <code>gcc main.c calc.c -o app</code>.', tags: ['Build'] }
    ],
    recap: [
      { title: 'Layered', text: 'Separate headers (interfaces) from sources (implementation).' },
      { title: 'Small Modules', text: 'One responsibility per file.' },
      { title: 'Makefile', text: 'Automate the build for multi-file projects.' },
      { title: 'Tests', text: 'Keep tests in a parallel directory structure.' }
    ]
  },

  general: {
    icon: '📘',
    title: '{THEME}',
    titleHtml: '{THEME}: <span class="grad">Complete Guide</span>',
    subtitle: 'A complete overview of {THEME} — core concepts, code, and best practices.',
    facts: [
      { big: 'C99', lbl: 'Common Standard' },
      { big: 'gcc', lbl: 'Compiler' },
      { big: 'Portable', lbl: 'Cross-Platform' },
      { big: 'Fast', lbl: 'Compiled' },
      { big: 'Rich', lbl: 'Library' }
    ],
    concepts: [
      { icon: '📖', title: 'Overview', desc: 'An introduction to {THEME} with practical examples.' },
      { icon: '🎯', title: 'Importance', desc: 'Why {THEME} matters for real C developers.' },
      { icon: '⚙️', title: 'Details', desc: 'Key points, edge cases, and common pitfalls.' },
      { icon: '🚀', title: 'Practice', desc: 'How to apply {THEME} in production code.' }
    ],
    playground: {
      file: 'example.c',
      code: `#include <stdio.h>

int main(void) {
    printf("Topic: {THEME}\\n");
    printf("Standard: C99/C11/C17/C23\\n");

    int x = 10, y = 20;
    printf("x = %d, y = %d\\n", x, y);
    printf("x + y = %d\\n", x + y);

    return 0;
}`
    },
    stepCode: [
      '#include <stdio.h>',
      '',
      'int main(void) {',
      '    printf("Hello\\n");',
      '    int x = 10;',
      '    printf("%d\\n", x);',
      '    return 0;',
      '}'
    ],
    steps: [
      { line: 0, text: 'Standard headers — always include the ones you use.', tags: ['Include'] },
      { line: 2, text: 'The program starts at <code>main()</code>.', tags: ['main'] },
      { line: 3, text: '<code>printf</code> outputs formatted text.', tags: ['printf'] },
      { line: 5, text: 'Format specifiers like <code>%d</code> must match the argument type.', tags: ['Format'] },
      { line: 6, text: '<code>return 0;</code> signals success.', tags: ['return'] }
    ],
    recap: [
      { title: 'C Is Small', text: 'Only 32 keywords, infinite flexibility.' },
      { title: 'C Is Fast', text: 'Compiled to native machine code.' },
      { title: 'C Is Everywhere', text: 'OS kernels, embedded, high-performance.' },
      { title: 'Keep Practicing', text: 'The more C you write, the better.' }
    ]
  }
};

/* ============================================================
   THEME → TITLE
   ============================================================ */
function titleFromSlug(slug) {
  const special = {
    'ansi': 'ANSI', 'iso': 'ISO', 'gcc': 'GCC', 'clang': 'Clang',
    'gdb': 'GDB', 'k&r': 'K&R', 'os': 'OS', 'io': 'I/O',
    'c': 'C', 'c89': 'C89', 'c90': 'C90', 'c99': 'C99',
    'c11': 'C11', 'c17': 'C17', 'c23': 'C23',
    'malloc': 'malloc()', 'calloc': 'calloc()',
    'realloc': 'realloc()', 'free': 'free()',
    'printf': 'printf()', 'scanf': 'scanf()',
    'pthreads': 'pthreads', 'cpu': 'CPU', 'fifo': 'FIFO',
    'api': 'API', 'ascii': 'ASCII', 'utf': 'UTF',
    'pid': 'PID', 'ipc': 'IPC', 'dma': 'DMA',
    'sql': 'SQL', 'xml': 'XML', 'json': 'JSON'
  };
  return slug.split('-').map(w => {
    if (special[w.toLowerCase()]) return special[w.toLowerCase()];
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
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
   HTML RENDER
   ============================================================ */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHTML(topic) {
  const factsHtml = topic.facts.map(f =>
    `<div class="fact"><div class="big">${escapeHtml(f.big)}</div><div class="lbl">${escapeHtml(f.lbl)}</div></div>`
  ).join('');

  const conceptsHtml = topic.concepts.map((c, i) => {
    const colors = ['#5b8def,#7c3aed', '#0ea5e9,#06b6d4', '#22c55e,#4ade80', '#f59e0b,#fbbf24'];
    const [c1, c2] = colors[i % colors.length].split(',');
    return `<div class="concept" style="--c1:${c1};--c2:${c2}">
      <div class="c-ico">${c.icon}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${c.desc}</p>
    </div>`;
  }).join('');

  const recapHtml = topic.recap.map((r, i) => {
    const colors = ['#5b8def', '#0ea5e9', '#22c55e', '#f59e0b'];
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
.space-base{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#0d1530 0%,#0a0a20 45%,#05060f 85%),radial-gradient(ellipse at 0% 100%,#0a1a2e 0%,transparent 55%)}
.orbs{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:.45}
.orb{position:absolute;border-radius:50%;filter:blur(90px)}
.orb-1{width:520px;height:520px;top:-10%;left:-8%;background:radial-gradient(circle,#5b8def,transparent 70%);animation:d1 26s ease-in-out infinite}
.orb-2{width:460px;height:460px;top:45%;right:-10%;background:radial-gradient(circle,#0ea5e9,transparent 70%);animation:d2 30s ease-in-out infinite}
.orb-3{width:600px;height:600px;bottom:-18%;left:18%;background:radial-gradient(circle,#7c3aed,transparent 70%);animation:d3 34s ease-in-out infinite}
@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,40px) scale(1.15)}}
@keyframes d2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.2)}}
@keyframes d3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-60px) scale(1.1)}}
.grid-bg{position:fixed;inset:-50%;z-index:2;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(91,141,239,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(91,141,239,.14) 1px,transparent 1px);background-size:80px 80px;transform:perspective(500px) rotateX(60deg);animation:gf 22s linear infinite;mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%)}
@keyframes gf{from{background-position:0 0}to{background-position:0 80px}}
.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.72) 100%)}
.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}
.container{max-width:1150px;margin:0 auto;padding:0 1.5rem;width:100%}
nav{position:sticky;top:0;z-index:100;background:rgba(5,6,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(148,163,184,.08)}
.nav-inner{max-width:1150px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1rem;color:#f1f5f9;text-decoration:none}
.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#5b8def,#0ea5e9);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1rem;color:#fff;box-shadow:0 8px 20px -6px rgba(91,141,239,.6)}
.hero{padding:4.5rem 1.5rem 3rem;text-align:center}
.tpill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(91,141,239,.12);border:1px solid rgba(91,141,239,.35);border-radius:999px;padding:.45rem 1.1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#a5c2ff;margin-bottom:1.5rem}
.tpill .n{background:#5b8def;color:#fff;min-width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;padding:0 .35rem}
.hero h1{font-size:clamp(1.9rem,4.8vw,3rem);font-weight:900;letter-spacing:-.04em;line-height:1.15;margin-bottom:1.2rem}
.hero h1 .grad{background:linear-gradient(135deg,#a5c2ff 0%,#5b8def 45%,#0ea5e9 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gs 7s ease-in-out infinite}
@keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.hero p{color:#a1a1aa;font-size:1.05rem;max-width:660px;margin:0 auto;line-height:1.7}
section{padding:3rem 0}
.sec-head{text-align:center;margin-bottom:2.5rem}
.stag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(91,141,239,.1);border:1px solid rgba(91,141,239,.3);border-radius:999px;padding:.4rem 1rem;font-size:.68rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#a5c2ff;margin-bottom:1rem}
.sec-head h2{font-size:clamp(1.6rem,3.8vw,2.3rem);font-weight:900;letter-spacing:-.03em;line-height:1.15;margin-bottom:.6rem}
.sec-head h2 .grad{background:linear-gradient(135deg,#a5c2ff,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sec-head p{color:#94a3b8;font-size:.95rem;max-width:620px;margin:0 auto}
.facts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:2rem}
.fact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:1.05rem 1rem;text-align:center;transition:all .25s}
.fact:hover{transform:translateY(-3px);border-color:rgba(91,141,239,.4)}
.fact .big{font-size:1.05rem;font-weight:900;background:linear-gradient(135deg,#a5c2ff,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}
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
.step-btn{background:rgba(91,141,239,.15);border:1px solid rgba(91,141,239,.3);color:#a5c2ff;border-radius:8px;padding:.35rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.step-btn:hover:not(:disabled){background:rgba(91,141,239,.3)}
.step-btn:disabled{opacity:.35;cursor:not-allowed}
.step-body{display:grid;grid-template-columns:1.2fr 1fr}
@media(max-width:800px){.step-body{grid-template-columns:1fr}}
.step-code{padding:1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1);overflow-x:auto}
@media(max-width:800px){.step-code{border-right:none;border-bottom:1px solid rgba(148,163,184,.1)}}
.step-line{padding:.15rem .5rem;border-radius:5px;transition:background .3s;white-space:pre}
.step-line.active{background:rgba(91,141,239,.18);box-shadow:inset 3px 0 0 #5b8def;color:#fff}
.step-info{padding:1.1rem 1.3rem;background:rgba(30,41,59,.4)}
.explain{font-size:.85rem;color:#cbd5e1;min-height:4rem;margin-bottom:.9rem;line-height:1.6}
.explain code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.82em}
.tag-list{display:flex;flex-wrap:wrap;gap:.35rem}
.tag{background:rgba(165,194,255,.15);border:1px solid rgba(165,194,255,.3);color:#a5c2ff;border-radius:6px;padding:.25rem .65rem;font-size:.7rem;font-family:'JetBrains Mono',monospace;font-weight:600}
.step-progress{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}
.bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}
.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#5b8def,#0ea5e9);border-radius:999px;transition:width .35s}
.count{font-size:.72rem;color:#64748b;font-family:'JetBrains Mono',monospace;min-width:3.5rem;text-align:right}
.recap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.9rem;margin-top:1.2rem}
.recap{background:rgba(30,41,59,.6);border-radius:14px;padding:1.1rem 1.2rem;border-left:3px solid var(--rc,#5b8def)}
.recap .t{font-size:.72rem;font-weight:800;color:var(--rc,#5b8def);text-transform:uppercase;letter-spacing:.08em}
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
      <a href="#" class="brand"><div class="brand-mark">C</div> C Series</a>
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
    <p>🔷 ${escapeHtml(topic.title)} · C Series · Built for learners</p>
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
  let clean=stripComments(code).replace(/#include\\s*<[^>]+>/g,'').replace(/#define[^\\n]+/g,'');
  const mm=clean.match(/int\\s+main\\s*\\(\\s*void\\s*\\)\\s*\\{([\\s\\S]*?)\\n\\s*return\\s+\\d+;\\s*\\}/)
          || clean.match(/int\\s+main\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)\\n\\s*return\\s+\\d+;\\s*\\}/);
  if(!mm)return{output:[],error:'No int main() found'};
  const body=mm[1];
  function evalE(expr){
    expr=expr.trim();
    let sm=expr.match(/^"(.*)"$/);if(sm)return sm[1].replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t');
    if(/^-?\\d+$/.test(expr))return parseInt(expr,10);
    if(/^-?\\d+\\.\\d+f?$/.test(expr))return parseFloat(expr);
    if(vars[expr]!==undefined)return vars[expr];
    let r=expr;
    Object.keys(vars).sort((a,b)=>b.length-a.length).forEach(n=>{
      r=r.replace(new RegExp('\\\\b'+n+'\\\\b','g'),'('+(typeof vars[n]==='string'?JSON.stringify(vars[n]):vars[n])+')');
    });
    try{return Function('"use strict";return('+r+')')()}catch{return 0}
  }
  function evalPrintf(args){
    let m=args.match(/^"((?:[^"\\\\]|\\\\.)*)"(.*)$/);
    if(!m)return String(evalE(args));
    let fmt=m[1].replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t');
    const rest=(m[2]||'').replace(/^\\s*,\\s*/,'').trim();
    const parts=rest?rest.split(/\\s*,\\s*/):[];
    const vals=parts.map(p=>evalE(p));
    let ai=0;
    fmt=fmt.replace(/%[dicsfu]/g,(spec)=>{
      const v=vals[ai++];
      if(spec==='%d'||spec==='%i')return Math.floor(Number(v));
      if(spec==='%c')return String(v);
      if(spec==='%f')return Number(v).toFixed(6);
      if(spec==='%s')return String(v);
      if(spec==='%u')return Math.floor(Number(v));
      return spec;
    });
    fmt=fmt.replace(/%\\.(\\d+)f/g,(_,d)=>{
      const v=vals[ai++];
      return Number(v).toFixed(parseInt(d,10));
    });
    return fmt;
  }
  function exec(list){
    for(const st of list){
      const s=st.trim();if(!s||s==='{'||s==='}')continue;
      let w=s.match(/^printf\\s*\\(([\\s\\S]+)\\)$/);
      if(w){output.push(evalPrintf(w[1]));continue}
      let d=s.match(/^(int|long|float|double|char|unsigned)\\s+(\\w+)\\s*=\\s*([\\s\\S]+)$/);
      if(d){vars[d[2]]=evalE(d[3]);continue}
      let dn=s.match(/^(int|long|float|double|char|unsigned)\\s+(\\w+)$/);
      if(dn){vars[dn[2]]=0;continue}
      let a=s.match(/^(\\w+)\\s*=\\s*([\\s\\S]+)$/);
      if(a&&vars[a[1]]!==undefined){vars[a[1]]=evalE(a[2]);continue}
      let fm=s.match(/^for\\s*\\(\\s*int\\s+(\\w+)\\s*=\\s*(-?\\d+)\\s*;\\s*\\1\\s*(<=|<)\\s*(-?\\d+)\\s*;\\s*\\1\\+\\+\\s*\\)\\s*\\{([\\s\\S]*)\\}$/);
      if(fm){
        const vn=fm[1],st0=parseInt(fm[2],10),op=fm[3],en=parseInt(fm[4],10);
        const inner=splitStmts(fm[5]);
        for(let i=st0;(op==='<'?i<en:i<=en);i++){vars[vn]=i;exec(inner)}
        continue;
      }
      let im=s.match(/^if\\s*\\(([\\s\\S]+?)\\)\\s*\\{([\\s\\S]*?)\\}(?:\\s*else\\s*\\{([\\s\\S]*?)\\})?$/);
      if(im){
        if(evalE(im[1]))exec(splitStmts(im[2]));
        else if(im[3])exec(splitStmts(im[3]));
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

console.log(`\n🔷 Found ${folders.length} C topic folders.\n`);

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