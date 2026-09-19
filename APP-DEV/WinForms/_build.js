/* ============================================================
   WinForms Topic Generator — clean version (no backtick issues)
   Usage:
     node _build.js
     node _build.js --force
     node _build.js --from 100
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
  if (/(introduction|intro|overview)/.test(t)) return 'intro';
  if (/(history|origin)/.test(t)) return 'history';
  if (/(architecture|design)/.test(t)) return 'architecture';
  if (/vs-|versus|comparison/.test(t)) return 'comparison';
  if (/and-net|and-framework|and-core|on-modern-net|platform/.test(t)) return 'platform';
  if (/runtime|message-loop|message-pump|ui-thread|main-ui-thread/.test(t)) return 'runtime';
  if (/^application|app-|application-/.test(t)) return 'application';
  if (/form-(lifecycle|creation|closing|disposal)|^forms$/.test(t)) return 'forms';
  if (/^controls$|control-hierarchy|parent-child|^containers$|^components$/.test(t)) return 'controls';
  if (/handle|window-handles/.test(t)) return 'handles';
  if (/disposable|disposal/.test(t)) return 'disposal';
  return 'general';
}

/* ============================================================
   TEMPLATES
   ============================================================ */
const CATEGORIES = {

  intro: {
    icon: '🪟',
    titleHtml: '{THEME}: <span class="grad">Introduction</span>',
    subtitle: 'Learn {THEME} — one of the oldest and most widely used desktop UI frameworks in the .NET ecosystem.',
    facts: [
      { big: '2002', lbl: 'Released' },
      { big: '.NET', lbl: 'Framework' },
      { big: 'C# / VB', lbl: 'Languages' },
      { big: 'Windows', lbl: 'Platform' },
      { big: 'Native', lbl: 'Controls' }
    ],
    concepts: [
      { icon: '🪟', title: 'What It Is', desc: '{THEME} — a mature, stable framework for building Windows desktop apps.' },
      { icon: '⚙️', title: 'How It Works', desc: 'Wraps native Win32 controls with .NET classes.' },
      { icon: '🚀', title: 'Why It Matters', desc: 'Still used in enterprise and legacy systems everywhere.' },
      { icon: '🎯', title: 'When to Use', desc: 'Fast internal tools, legacy maintenance, Windows-only apps.' }
    ],
    preview: {
      title: 'MainForm',
      size: { w: 480, h: 340 },
      controls: [
        { type: 'label', text: 'Welcome to WinForms', x: 20, y: 20, w: 400, h: 30, style: 'title' },
        { type: 'label', text: 'Enter your name:', x: 20, y: 70, w: 150, h: 22 },
        { type: 'textbox', id: 'nameInput', placeholder: 'Type here...', x: 20, y: 95, w: 320, h: 28 },
        { type: 'button', text: 'Greet', id: 'greetBtn', x: 350, y: 95, w: 90, h: 28, style: 'primary' },
        { type: 'label', id: 'result', text: '', x: 20, y: 145, w: 420, h: 24, style: 'success' },
        { type: 'label', text: 'Click a button below to see controls in action', x: 20, y: 195, w: 420, h: 20, style: 'small' },
        { type: 'button', text: 'Show Message', id: 'msgShow', x: 20, y: 220, w: 130, h: 30 },
        { type: 'button', text: 'Toggle State', id: 'toggleBtn', x: 160, y: 220, w: 130, h: 30 }
      ],
      script: '// When the Greet button is clicked:\nprivate void greetBtn_Click(object sender, EventArgs e)\n{\n    string name = nameInput.Text;\n    if (string.IsNullOrWhiteSpace(name))\n        result.Text = "Please enter a name.";\n    else\n        result.Text = "Hello, " + name + "!";\n}'
    },
    stepCode: [
      'using System;',
      'using System.Windows.Forms;',
      '',
      'public class MainForm : Form',
      '{',
      '    public MainForm()',
      '    {',
      '        Text = "My First WinForms App";',
      '        Width = 480;',
      '        Height = 340;',
      '    }',
      '',
      '    [STAThread]',
      '    static void Main()',
      '    {',
      '        Application.Run(new MainForm());',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: '<code>using System.Windows.Forms</code> — brings in the WinForms namespace.', tags: ['using'] },
      { line: 3, text: 'Your form is a class that inherits from <code>Form</code>.', tags: ['Class'] },
      { line: 7, text: '<code>Text</code> — the window title. <code>Width</code>/<code>Height</code> — size.', tags: ['Property'] },
      { line: 12, text: '<code>[STAThread]</code> — required for Windows message pump.', tags: ['Attribute'] },
      { line: 16, text: '<code>Application.Run()</code> — starts the app and shows the form.', tags: ['Run'] }
    ],
    recap: [
      { title: 'Mature', text: '20+ years of production use.' },
      { title: 'Native', text: 'Wraps real Win32 controls.' },
      { title: 'Visual Designer', text: 'Drag-and-drop UI in Visual Studio.' },
      { title: 'Windows Only', text: 'No cross-platform support.' }
    ]
  },

  history: {
    icon: '📜',
    titleHtml: '{THEME}: <span class="grad">History</span>',
    subtitle: 'The journey of {THEME} — from .NET Framework 1.0 to modern .NET.',
    facts: [
      { big: '2002', lbl: '.NET 1.0' },
      { big: '2005', lbl: '.NET 2.0' },
      { big: '2019', lbl: '.NET Core 3' },
      { big: '2020', lbl: '.NET 5' },
      { big: '2024', lbl: '.NET 8' }
    ],
    concepts: [
      { icon: '🔬', title: 'Origin', desc: 'Where {THEME} came from — replaced MFC and VB6.' },
      { icon: '📛', title: 'Evolution', desc: 'How {THEME} grew with each .NET release.' },
      { icon: '📖', title: 'Milestones', desc: 'Version 2.0 → 4.8 → Core → modern .NET.' },
      { icon: '🌍', title: 'Today', desc: 'Still supported and shipped with .NET 8.' }
    ],
    preview: {
      title: 'Timeline',
      size: { w: 500, h: 320 },
      controls: [
        { type: 'label', text: 'WinForms Versions', x: 20, y: 15, w: 400, h: 30, style: 'title' },
        { type: 'listbox', id: 'list1', x: 20, y: 55, w: 440, h: 220, items: [
          '2002 · .NET Framework 1.0 — First release',
          '2005 · .NET Framework 2.0 — Major improvements',
          '2010 · .NET Framework 4.0 — Task Parallel Library',
          '2019 · .NET Core 3.0 — Cross-platform base',
          '2020 · .NET 5 — Unified platform',
          '2024 · .NET 8 — Current LTS'
        ]}
      ],
      script: '// Populating a ListBox in code:\nprivate void Form1_Load(object sender, EventArgs e)\n{\n    list1.Items.Add("2002 · .NET Framework 1.0");\n    list1.Items.Add("2005 · .NET Framework 2.0");\n    list1.Items.Add("2020 · .NET 5");\n    list1.Items.Add("2024 · .NET 8");\n}'
    },
    stepCode: [
      '// WinForms has shipped with:',
      '// .NET Framework 1.0 (2002)',
      '// .NET Framework 2.0 (2005)',
      '// .NET Framework 4.8 (2019)',
      '// .NET Core 3.0 (2019)',
      '// .NET 5, 6, 7, 8 (2020-2024)',
      '',
      '// Still actively maintained in .NET 8'
    ],
    steps: [
      { line: 0, text: 'History timeline — WinForms shipped since 2002.', tags: ['History'] },
      { line: 3, text: '.NET Framework 4.8 was the last Framework-only version.', tags: ['Framework'] },
      { line: 4, text: '.NET Core 3.0 brought WinForms to the modern runtime.', tags: ['Core'] },
      { line: 7, text: 'Still supported in .NET 8 — one of the longest-lived UI frameworks.', tags: ['Current'] }
    ],
    recap: [
      { title: '2002', text: 'WinForms ships with .NET Framework 1.0.' },
      { title: '2019', text: '.NET Core 3.0 — WinForms goes modern.' },
      { title: '2020+', text: 'Unified .NET 5/6/7/8 with full WinForms support.' },
      { title: 'Still Active', text: 'Microsoft continues to ship it with .NET 8.' }
    ]
  },

  comparison: {
    icon: '⚖️',
    titleHtml: '{THEME}: <span class="grad">Comparison</span>',
    subtitle: 'How WinForms compares to {THEME}.',
    facts: [
      { big: 'WinForms', lbl: 'Since 2002' },
      { big: 'WPF', lbl: 'Since 2006' },
      { big: 'WinUI', lbl: 'Since 2018' },
      { big: 'MAUI', lbl: 'Since 2022' },
      { big: 'Cross-Plat', lbl: 'Only MAUI' }
    ],
    concepts: [
      { icon: '🪟', title: 'WinForms', desc: 'Mature, fast to build, native look. Best for internal tools.' },
      { icon: '🎨', title: 'WPF', desc: 'XAML, MVVM, powerful styling. Best for rich desktop apps.' },
      { icon: '✨', title: 'WinUI 3', desc: 'Modern Fluent design. Best for new Windows 11 apps.' },
      { icon: '🌍', title: '.NET MAUI', desc: 'Cross-platform (Windows, Mac, iOS, Android).' }
    ],
    preview: {
      title: 'Framework Comparison',
      size: { w: 520, h: 380 },
      controls: [
        { type: 'label', text: 'Choose a Framework', x: 20, y: 15, w: 400, h: 30, style: 'title' },
        { type: 'radiogroup', id: 'frameworkPick', x: 20, y: 55, options: ['WinForms — mature, native', 'WPF — XAML, styling', 'WinUI 3 — modern Fluent', '.NET MAUI — cross-platform'] },
        { type: 'button', text: 'Compare', id: 'compareBtn', x: 20, y: 200, w: 120, h: 30, style: 'primary' },
        { type: 'label', id: 'comparison', text: '', x: 20, y: 245, w: 480, h: 100, style: 'box' }
      ],
      script: '// Update the label based on the radio selection:\nprivate void compareBtn_Click(object sender, EventArgs e)\n{\n    if (radioWinForms.Checked)\n        comparison.Text = "WinForms: fastest to build, native controls.";\n    else if (radioWPF.Checked)\n        comparison.Text = "WPF: XAML, MVVM, GPU rendering.";\n    else if (radioWinUI.Checked)\n        comparison.Text = "WinUI 3: modern Fluent design.";\n    else\n        comparison.Text = ".NET MAUI: cross-platform.";\n}'
    },
    stepCode: [
      '// When to choose which:',
      '',
      '// WinForms — internal tools, legacy, fast dev',
      '// WPF — rich UI, styling, animations',
      '// WinUI 3 — Windows 11 look, new apps',
      '// MAUI — cross-platform (mobile + desktop)',
      '',
      '// All 4 are supported in .NET 8'
    ],
    steps: [
      { line: 2, text: 'WinForms — fastest for internal tools. Mature but limited styling.', tags: ['WinForms'] },
      { line: 3, text: 'WPF — powerful XAML, MVVM, GPU rendering.', tags: ['WPF'] },
      { line: 4, text: 'WinUI 3 — modern Fluent design, Windows App SDK.', tags: ['WinUI'] },
      { line: 5, text: 'MAUI — cross-platform with a single codebase.', tags: ['MAUI'] }
    ],
    recap: [
      { title: 'WinForms', text: 'Best for fast, native internal tools.' },
      { title: 'WPF', text: 'Best for rich desktop UIs.' },
      { title: 'WinUI 3', text: 'Best for new Windows 11 apps.' },
      { title: 'MAUI', text: 'Best for cross-platform.' }
    ]
  },

  platform: {
    icon: '🔧',
    titleHtml: '{THEME}: <span class="grad">Platform &amp; Runtime</span>',
    subtitle: 'How WinForms fits into the modern .NET platform — {THEME}.',
    facts: [
      { big: '.NET 8', lbl: 'Current' },
      { big: 'SDK-style', lbl: 'csproj' },
      { big: 'WinForms', lbl: 'Runtime' },
      { big: 'MSBuild', lbl: 'Build' },
      { big: 'NuGet', lbl: 'Packages' }
    ],
    concepts: [
      { icon: '🎯', title: 'Modern .NET', desc: 'WinForms ships with .NET 8 — same runtime as ASP.NET.' },
      { icon: '📦', title: 'SDK-style Project', desc: 'Modern csproj with <code>net8.0-windows</code>.' },
      { icon: '⚙️', title: 'Trimming & AOT', desc: 'Can be trimmed or published AOT for faster startup.' },
      { icon: '🌍', title: 'Compatibility', desc: 'Runs on Windows 7 through Windows 11.' }
    ],
    preview: {
      title: 'Runtime Information',
      size: { w: 500, h: 340 },
      controls: [
        { type: 'label', text: '.NET Runtime Info', x: 20, y: 15, w: 400, h: 30, style: 'title' },
        { type: 'button', text: 'Refresh Info', id: 'refreshBtn', x: 20, y: 55, w: 140, h: 30, style: 'primary' },
        { type: 'listbox', id: 'infoList', x: 20, y: 100, w: 460, h: 210, items: [
          'Runtime: .NET 8.0',
          'Framework: Microsoft.WindowsDesktop.App',
          'Architecture: x64',
          'OS: Windows 11',
          'CLR Version: 8.0.0'
        ]}
      ],
      script: '// Query the runtime environment:\nprivate void refreshBtn_Click(object sender, EventArgs e)\n{\n    infoList.Items.Clear();\n    infoList.Items.Add("Runtime: " + Environment.Version);\n    infoList.Items.Add("OS: " + Environment.OSVersion);\n    infoList.Items.Add("CLR Version: " + Environment.Version);\n}'
    },
    stepCode: [
      '// Modern csproj for WinForms:',
      '<Project Sdk="Microsoft.NET.Sdk">',
      '  <PropertyGroup>',
      '    <OutputType>WinExe</OutputType>',
      '    <TargetFramework>net8.0-windows</TargetFramework>',
      '    <UseWindowsForms>true</UseWindowsForms>',
      '  </PropertyGroup>',
      '</Project>'
    ],
    steps: [
      { line: 1, text: 'SDK-style project — modern, concise csproj format.', tags: ['csproj'] },
      { line: 3, text: '<code>WinExe</code> — Windows executable (no console window).', tags: ['Output'] },
      { line: 4, text: '<code>net8.0-windows</code> — target framework for WinForms.', tags: ['TFM'] },
      { line: 5, text: '<code>UseWindowsForms=true</code> — pulls in the WinForms runtime.', tags: ['WinForms'] }
    ],
    recap: [
      { title: 'Modern csproj', text: 'SDK-style with <code>UseWindowsForms</code>.' },
      { title: 'Target', text: '<code>net8.0-windows</code> for the latest LTS.' },
      { title: 'AOT', text: 'Trimmed and AOT publishing supported.' },
      { title: 'Compatible', text: 'Runs on Windows 7 through Windows 11.' }
    ]
  },

  runtime: {
    icon: '⚙️',
    titleHtml: '{THEME}: <span class="grad">Runtime &amp; Message Loop</span>',
    subtitle: 'How {THEME} — the engine that powers every WinForms app.',
    facts: [
      { big: 'Message', lbl: 'Loop' },
      { big: 'UI Thread', lbl: 'Single' },
      { big: 'Win32', lbl: 'Messages' },
      { big: 'STA', lbl: 'Apartment' },
      { big: 'Paint', lbl: 'Events' }
    ],
    concepts: [
      { icon: '🔄', title: 'Message Loop', desc: 'The infinite loop that dispatches Windows messages to your controls.' },
      { icon: '🧵', title: 'UI Thread', desc: 'Only one thread can touch UI controls — the "UI thread".' },
      { icon: '⚡', title: 'Events', desc: 'Click, Paint, KeyPress — dispatched by the loop.' },
      { icon: '🔒', title: 'STA', desc: 'Single-Threaded Apartment — required for COM and clipboard.' }
    ],
    preview: {
      title: 'Message Loop Demo',
      size: { w: 500, h: 340 },
      controls: [
        { type: 'label', text: 'Message Loop Visualizer', x: 20, y: 15, w: 400, h: 30, style: 'title' },
        { type: 'label', text: 'Click any button and watch the message log:', x: 20, y: 55, w: 460, h: 20, style: 'small' },
        { type: 'button', text: 'Click Me', id: 'msgBtn1', x: 20, y: 85, w: 130, h: 30, style: 'primary' },
        { type: 'button', text: 'Send Paint', id: 'msgBtn2', x: 165, y: 85, w: 130, h: 30 },
        { type: 'button', text: 'Send Resize', id: 'msgBtn3', x: 310, y: 85, w: 130, h: 30 },
        { type: 'listbox', id: 'msgLog', x: 20, y: 130, w: 460, h: 180, items: [
          '▶ Loop started — waiting for messages...'
        ]}
      ],
      script: '// The WinForms message loop:\n// 1. Waits for a message (click, key, paint)\n// 2. Dispatches it to the right control\n// 3. Returns to waiting\n\nprotected override void WndProc(ref Message m)\n{\n    base.WndProc(ref m);\n}'
    },
    stepCode: [
      '// Simplified message loop:',
      'while (GetMessage(out msg, IntPtr.Zero, 0, 0))',
      '{',
      '    TranslateMessage(ref msg);',
      '    DispatchMessage(ref msg);',
      '}',
      '',
      '// Application.Run() starts this loop',
      '// and returns when the main form closes.'
    ],
    steps: [
      { line: 1, text: 'The message loop — infinite until quit message.', tags: ['Loop'] },
      { line: 3, text: 'Translate keyboard messages (WM_KEYDOWN → WM_CHAR).', tags: ['Translate'] },
      { line: 4, text: 'Dispatch to the control that owns the window handle.', tags: ['Dispatch'] },
      { line: 7, text: '<code>Application.Run()</code> starts this loop and blocks until exit.', tags: ['Run'] }
    ],
    recap: [
      { title: 'Message Loop', text: 'The heart of every Windows app.' },
      { title: 'UI Thread', text: 'All UI updates happen on this single thread.' },
      { title: 'Events', text: 'The loop converts Windows messages into .NET events.' },
      { title: 'STA', text: 'Single-Threaded Apartment — required.' }
    ]
  },

  application: {
    icon: '🚀',
    titleHtml: '{THEME}: <span class="grad">Application Class</span>',
    subtitle: 'Understanding the <code>Application</code> class and {THEME}.',
    facts: [
      { big: 'Application.Run', lbl: 'Starts' },
      { big: 'DoEvents', lbl: 'Pump' },
      { big: 'Exit', lbl: 'Quit' },
      { big: 'EnableVisualStyles', lbl: 'Themes' },
      { big: 'SetHighDpiMode', lbl: 'DPI' }
    ],
    concepts: [
      { icon: '🚀', title: 'Run()', desc: 'The main entry point — starts the message loop.' },
      { icon: '🎨', title: 'Visual Styles', desc: '<code>EnableVisualStyles()</code> gives modern look.' },
      { icon: '⚡', title: 'DoEvents()', desc: 'Pump the message queue once — use carefully.' },
      { icon: '🛑', title: 'Exit()', desc: 'Shuts down the app.' }
    ],
    preview: {
      title: 'Application Lifecycle',
      size: { w: 480, h: 320 },
      controls: [
        { type: 'label', text: 'Application Lifecycle', x: 20, y: 15, w: 400, h: 30, style: 'title' },
        { type: 'listbox', id: 'lifecycle', x: 20, y: 55, w: 440, h: 170, items: [
          '1. Application.EnableVisualStyles()',
          '2. Application.SetCompatibleTextRenderingDefault(false)',
          '3. Application.SetHighDpiMode(HighDpiMode.SystemAware)',
          '4. Application.Run(new MainForm())',
          '5. [Message loop running...]',
          '6. Application.Exit()'
        ]},
        { type: 'button', text: 'Simulate Exit', id: 'exitBtn', x: 20, y: 240, w: 160, h: 35, style: 'primary' },
        { type: 'button', text: 'Reset', id: 'resetBtn', x: 190, y: 240, w: 100, h: 35 }
      ],
      script: '// Typical Program.cs entry point:\n[STAThread]\nstatic void Main()\n{\n    ApplicationConfiguration.Initialize();\n    Application.Run(new MainForm());\n}'
    },
    stepCode: [
      '[STAThread]',
      'static void Main()',
      '{',
      '    ApplicationConfiguration.Initialize();',
      '    Application.Run(new MainForm());',
      '}',
      '',
      '// Initialize() sets:',
      '//   EnableVisualStyles',
      '//   High DPI mode',
      '//   Text rendering default'
    ],
    steps: [
      { line: 0, text: '<code>[STAThread]</code> — required for COM interoperability.', tags: ['STA'] },
      { line: 3, text: '<code>ApplicationConfiguration.Initialize()</code> — .NET 6+ helper.', tags: ['Init'] },
      { line: 4, text: '<code>Application.Run(form)</code> — starts loop, shows form, blocks.', tags: ['Run'] },
      { line: 7, text: 'Initialize() replaces three separate setup calls.', tags: ['Helper'] }
    ],
    recap: [
      { title: 'Application.Run', text: 'The blocking call that starts your app.' },
      { title: 'Initialize()', text: 'Modern helper — sets up everything.' },
      { title: 'STAThread', text: 'Required for the UI thread.' },
      { title: 'Exit()', text: 'Ends the message loop, closes all forms.' }
    ]
  },

  forms: {
    icon: '🪟',
    titleHtml: '{THEME}: <span class="grad">Forms &amp; Lifecycle</span>',
    subtitle: 'Understanding forms and {THEME} in WinForms.',
    facts: [
      { big: 'Form', lbl: 'Base Class' },
      { big: 'Load', lbl: 'Event' },
      { big: 'Closing', lbl: 'Event' },
      { big: 'Dispose', lbl: 'Cleanup' },
      { big: 'Modal', lbl: 'Dialog' }
    ],
    concepts: [
      { icon: '🪟', title: 'Form Class', desc: 'The window — inherits from <code>System.Windows.Forms.Form</code>.' },
      { icon: '🔄', title: 'Lifecycle', desc: 'Load → Shown → Activate → Closing → Closed → Disposed.' },
      { icon: '⚙️', title: 'Properties', desc: 'Text, Size, Location, StartPosition, FormBorderStyle.' },
      { icon: '🧹', title: 'Disposal', desc: 'Forms implement <code>IDisposable</code>. Always dispose.' }
    ],
    preview: {
      title: 'Form Lifecycle',
      size: { w: 500, h: 340 },
      controls: [
        { type: 'label', text: 'Form Events Timeline', x: 20, y: 15, w: 400, h: 30, style: 'title' },
        { type: 'button', text: 'Trigger Load', id: 'loadBtn', x: 20, y: 55, w: 130, h: 30 },
        { type: 'button', text: 'Trigger Shown', id: 'shownBtn', x: 160, y: 55, w: 130, h: 30 },
        { type: 'button', text: 'Trigger Closing', id: 'closingBtn', x: 300, y: 55, w: 130, h: 30 },
        { type: 'listbox', id: 'eventLog', x: 20, y: 100, w: 460, h: 200, items: [
          '⏳ Form created — not yet shown'
        ]}
      ],
      script: '// Typical lifecycle events:\nprivate void MainForm_Load(object sender, EventArgs e)\n{\n    // Runs once, before the form appears\n}\n\nprivate void MainForm_Shown(object sender, EventArgs e)\n{\n    // Runs after the form is visible\n}\n\nprivate void MainForm_FormClosing(object sender, FormClosingEventArgs e)\n{\n    if (!ConfirmExit()) e.Cancel = true;\n}'
    },
    stepCode: [
      'public partial class MainForm : Form',
      '{',
      '    public MainForm()',
      '    {',
      '        InitializeComponent();',
      '        Load += MainForm_Load;',
      '        Shown += MainForm_Shown;',
      '        FormClosing += MainForm_FormClosing;',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: 'Every form inherits from <code>Form</code>.', tags: ['Class'] },
      { line: 4, text: '<code>InitializeComponent()</code> — auto-generated; sets up controls.', tags: ['Init'] },
      { line: 5, text: '<code>Load</code> — fires before the form is visible.', tags: ['Load'] },
      { line: 6, text: '<code>Shown</code> — fires after the form is visible.', tags: ['Shown'] },
      { line: 7, text: '<code>FormClosing</code> — fired when the user tries to close.', tags: ['Closing'] }
    ],
    recap: [
      { title: 'Load', text: 'Before the form is shown — for setup.' },
      { title: 'Shown', text: 'After the form is visible.' },
      { title: 'Closing', text: 'Can cancel with <code>e.Cancel = true</code>.' },
      { title: 'Dispose', text: 'Release resources when the form is gone.' }
    ]
  },

  controls: {
    icon: '🎛️',
    titleHtml: '{THEME}: <span class="grad">Controls &amp; Containers</span>',
    subtitle: 'Explore {THEME} — the building blocks of every WinForms UI.',
    facts: [
      { big: 'Control', lbl: 'Base Class' },
      { big: 'Container', lbl: 'Parent' },
      { big: 'Dock', lbl: 'Layout' },
      { big: 'Anchor', lbl: 'Layout' },
      { big: 'Hierarchy', lbl: 'Tree' }
    ],
    concepts: [
      { icon: '🎛️', title: 'Controls', desc: 'Button, TextBox, Label, ListBox, ComboBox, CheckBox...' },
      { icon: '📦', title: 'Containers', desc: 'Panel, GroupBox, TabControl hold other controls.' },
      { icon: '🌳', title: 'Hierarchy', desc: 'Controls nest — each has a <code>Parent</code> and <code>Controls</code> collection.' },
      { icon: '⚙️', title: 'Layout', desc: '<code>Dock</code> and <code>Anchor</code> for responsive UIs.' }
    ],
    preview: {
      title: 'Control Gallery',
      size: { w: 560, h: 420 },
      controls: [
        { type: 'label', text: 'All Common WinForms Controls', x: 20, y: 15, w: 400, h: 28, style: 'title' },
        { type: 'label', text: 'TextBox:', x: 20, y: 55, w: 90, h: 22 },
        { type: 'textbox', id: 'tb1', placeholder: 'type here', x: 120, y: 55, w: 200, h: 26 },
        { type: 'label', text: 'CheckBox:', x: 20, y: 95, w: 90, h: 22 },
        { type: 'checkbox', id: 'cb1', text: 'Enable feature', x: 120, y: 95, w: 200, h: 22 },
        { type: 'label', text: 'Radio:', x: 20, y: 125, w: 90, h: 22 },
        { type: 'radio', id: 'r1', name: 'rgroup', text: 'Option A', x: 120, y: 125, w: 100, h: 22 },
        { type: 'radio', id: 'r2', name: 'rgroup', text: 'Option B', x: 230, y: 125, w: 100, h: 22 },
        { type: 'label', text: 'ComboBox:', x: 20, y: 155, w: 90, h: 22 },
        { type: 'combobox', id: 'combo1', x: 120, y: 155, w: 200, h: 26, items: ['Small', 'Medium', 'Large'] },
        { type: 'label', text: 'Button:', x: 20, y: 195, w: 90, h: 22 },
        { type: 'button', text: 'Click Me', id: 'cbBtn', x: 120, y: 192, w: 120, h: 30, style: 'primary' },
        { type: 'label', text: 'ProgressBar:', x: 20, y: 240, w: 90, h: 22 },
        { type: 'progress', id: 'pbar1', x: 120, y: 240, w: 400, h: 20, value: 65 },
        { type: 'label', text: 'ListBox:', x: 20, y: 280, w: 90, h: 22 },
        { type: 'listbox', id: 'lb1', x: 120, y: 280, w: 400, h: 120, items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'] }
      ],
      script: '// Controls are added to the form:\nthis.Controls.Add(textBox1);\nthis.Controls.Add(checkBox1);\nthis.Controls.Add(button1);\n\n// Containers hold other controls:\nvar panel = new Panel { Dock = DockStyle.Fill };\npanel.Controls.Add(new Label { Text = "Nested!" });\nthis.Controls.Add(panel);'
    },
    stepCode: [
      '// Common controls:',
      'Button      — clickable action',
      'Label       — static text',
      'TextBox     — user input',
      'CheckBox    — on/off toggle',
      'RadioButton — one-of-many',
      'ComboBox    — dropdown list',
      'ListBox     — scrollable list',
      'ProgressBar — progress indicator',
      '',
      '// Containers:',
      'Panel, GroupBox, TabControl, FlowLayoutPanel'
    ],
    steps: [
      { line: 0, text: '<strong>Button</strong> — the most common interactive control.', tags: ['Button'] },
      { line: 2, text: '<strong>Label</strong> — displays static text. Not editable.', tags: ['Label'] },
      { line: 3, text: '<strong>TextBox</strong> — single-line or multi-line input.', tags: ['TextBox'] },
      { line: 4, text: '<strong>CheckBox</strong> — independent on/off toggle.', tags: ['CheckBox'] },
      { line: 5, text: '<strong>RadioButton</strong> — grouped, only one can be checked.', tags: ['Radio'] },
      { line: 11, text: 'Containers like <code>Panel</code> hold and organize other controls.', tags: ['Container'] }
    ],
    recap: [
      { title: 'Base Class', text: 'Every control inherits from <code>Control</code>.' },
      { title: 'Parent/Child', text: 'Controls nest via <code>Controls.Add()</code>.' },
      { title: 'Containers', text: 'Panel, GroupBox, TabControl — for layout.' },
      { title: 'Events', text: 'Each control raises events like Click, TextChanged.' }
    ]
  },

  handles: {
    icon: '🔗',
    titleHtml: '{THEME}: <span class="grad">Window Handles</span>',
    subtitle: 'Understanding {THEME} — the bridge between .NET controls and Win32.',
    facts: [
      { big: 'HWND', lbl: 'Handle Type' },
      { big: 'IntPtr', lbl: '.NET Type' },
      { big: 'HandleCreated', lbl: 'Event' },
      { big: 'Recreate', lbl: 'Property' },
      { big: 'Win32', lbl: 'Underlying' }
    ],
    concepts: [
      { icon: '🔗', title: 'What Is a Handle', desc: 'An <code>IntPtr</code> pointing to a Win32 window.' },
      { icon: '⚙️', title: 'When Created', desc: 'Lazily — when the control first needs to render.' },
      { icon: '🔄', title: 'Recreation', desc: 'Changing some properties recreates the handle.' },
      { icon: '⚠️', title: 'Pitfalls', desc: 'Comparing handles after recreation breaks code.' }
    ],
    preview: {
      title: 'Handle Inspector',
      size: { w: 500, h: 340 },
      controls: [
        { type: 'label', text: 'Window Handle Inspector', x: 20, y: 15, w: 400, h: 28, style: 'title' },
        { type: 'button', text: 'Show Handle Info', id: 'handleBtn', x: 20, y: 55, w: 170, h: 32, style: 'primary' },
        { type: 'listbox', id: 'handleList', x: 20, y: 100, w: 460, h: 220, items: [
          'Form.Handle    = 0x000A12F4',
          'Button.Handle  = 0x000A12F8',
          'TextBox.Handle = 0x000A130C',
          'Label.Handle   = 0x000A1310',
          'IsHandleCreated = true'
        ]}
      ],
      script: '// Inspect any control\'s Win32 handle:\nprivate void handleBtn_Click(object sender, EventArgs e)\n{\n    list.Items.Clear();\n    list.Items.Add("Form Handle = 0x" + this.Handle.ToString("X8"));\n    list.Items.Add("Button Handle = 0x" + button1.Handle.ToString("X8"));\n    list.Items.Add("IsHandleCreated = " + this.IsHandleCreated);\n}'
    },
    stepCode: [
      '// Every control has a Handle property',
      'IntPtr hwnd = button1.Handle;',
      '',
      '// Check if it exists yet',
      'if (button1.IsHandleCreated) {',
      '    // Safe to use Handle',
      '}',
      '',
      '// Force creation',
      'var h = button1.Handle; // creates it'
    ],
    steps: [
      { line: 1, text: 'Every WinForms control exposes <code>Handle</code> — a Win32 HWND.', tags: ['Handle'] },
      { line: 4, text: '<code>IsHandleCreated</code> — true after the control is rendered.', tags: ['Check'] },
      { line: 9, text: 'Accessing <code>Handle</code> forces the control to create its HWND.', tags: ['Lazy'] }
    ],
    recap: [
      { title: 'Handle = HWND', text: 'A pointer to the underlying Win32 window.' },
      { title: 'Lazy', text: 'Not created until needed.' },
      { title: 'Recreation', text: 'Some property changes recreate the handle.' },
      { title: 'Events', text: '<code>HandleCreated</code> and <code>HandleDestroyed</code>.' }
    ]
  },

  disposal: {
    icon: '🧹',
    titleHtml: '{THEME}: <span class="grad">Disposal &amp; Cleanup</span>',
    subtitle: 'Properly releasing resources in WinForms using {THEME}.',
    facts: [
      { big: 'IDisposable', lbl: 'Interface' },
      { big: 'Dispose()', lbl: 'Method' },
      { big: 'using', lbl: 'Statement' },
      { big: 'GC', lbl: 'Collector' },
      { big: 'Leak', lbl: 'Danger' }
    ],
    concepts: [
      { icon: '🧹', title: 'IDisposable', desc: 'Interface for deterministic cleanup.' },
      { icon: '📦', title: 'using', desc: '<code>using var x = new ...</code> — auto-dispose at scope end.' },
      { icon: '🎯', title: 'Components', desc: 'Forms and components have <code>Dispose(bool)</code>.' },
      { icon: '⚠️', title: 'Leaks', desc: 'Forgetting to dispose = native handle leaks.' }
    ],
    preview: {
      title: 'Disposal Demo',
      size: { w: 480, h: 320 },
      controls: [
        { type: 'label', text: 'Resource Disposal', x: 20, y: 15, w: 400, h: 28, style: 'title' },
        { type: 'button', text: 'Create Form', id: 'createBtn', x: 20, y: 55, w: 140, h: 32, style: 'primary' },
        { type: 'button', text: 'Dispose Form', id: 'disposeBtn', x: 175, y: 55, w: 140, h: 32 },
        { type: 'listbox', id: 'disposalLog', x: 20, y: 100, w: 440, h: 200, items: [
          '⏳ No form created yet'
        ]}
      ],
      script: '// Correct disposal patterns:\nusing (var form = new DialogForm())\n{\n    form.ShowDialog();\n} // Auto-disposed here\n\n// Override for custom cleanup\nprotected override void Dispose(bool disposing)\n{\n    if (disposing) components?.Dispose();\n    base.Dispose(disposing);\n}'
    },
    stepCode: [
      '// Preferred: using statement',
      'using var form = new DialogForm();',
      'form.ShowDialog();',
      '// Auto-disposed at scope end',
      '',
      '// Override for custom cleanup',
      'protected override void Dispose(bool disposing)',
      '{',
      '    if (disposing) components?.Dispose();',
      '    base.Dispose(disposing);',
      '}'
    ],
    steps: [
      { line: 1, text: '<code>using var</code> — auto-dispose at end of scope. Modern C# 8+.', tags: ['using'] },
      { line: 2, text: '<code>ShowDialog()</code> — modal, blocks until closed.', tags: ['Modal'] },
      { line: 6, text: 'Override <code>Dispose</code> to release custom resources.', tags: ['Override'] },
      { line: 8, text: '<code>components?.Dispose()</code> — dispose designer components.', tags: ['Components'] }
    ],
    recap: [
      { title: 'IDisposable', text: 'Every Form, Control, and Component implements it.' },
      { title: 'using', text: 'The cleanest pattern. Always prefer it.' },
      { title: 'Override Dispose', text: 'For custom cleanup in your forms.' },
      { title: 'Leaks', text: 'Undisposed controls leak native handles.' }
    ]
  },

  general: {
    icon: '📘',
    titleHtml: '{THEME}',
    subtitle: 'A complete guide to {THEME} in WinForms.',
    facts: [
      { big: 'WinForms', lbl: 'Framework' },
      { big: '.NET 8', lbl: 'Runtime' },
      { big: 'Windows', lbl: 'Platform' },
      { big: 'C# / VB', lbl: 'Language' },
      { big: 'Mature', lbl: 'Since 2002' }
    ],
    concepts: [
      { icon: '📖', title: 'Overview', desc: 'An introduction to {THEME} in the WinForms world.' },
      { icon: '🎯', title: 'Importance', desc: 'Why {THEME} matters for real WinForms apps.' },
      { icon: '⚙️', title: 'Details', desc: 'Key points and common patterns.' },
      { icon: '🚀', title: 'Practice', desc: 'How to apply {THEME}.' }
    ],
    preview: {
      title: 'WinForms Demo',
      size: { w: 480, h: 320 },
      controls: [
        { type: 'label', text: 'Topic Demo', x: 20, y: 15, w: 400, h: 28, style: 'title' },
        { type: 'label', text: 'Enter a value:', x: 20, y: 60, w: 120, h: 22 },
        { type: 'textbox', id: 'inputBox', placeholder: 'Type something...', x: 20, y: 85, w: 300, h: 28 },
        { type: 'button', text: 'Process', id: 'processBtn', x: 330, y: 85, w: 110, h: 28, style: 'primary' },
        { type: 'label', id: 'outputLabel', text: '', x: 20, y: 135, w: 420, h: 24, style: 'success' },
        { type: 'listbox', id: 'outputList', x: 20, y: 175, w: 420, h: 120, items: ['Ready. Click Process.'] }
      ],
      script: '// Typical event handler:\nprivate void processBtn_Click(object sender, EventArgs e)\n{\n    string input = inputBox.Text;\n    if (string.IsNullOrWhiteSpace(input))\n    {\n        outputLabel.Text = "Please enter something.";\n        return;\n    }\n    outputLabel.Text = "Processed: " + input;\n    outputList.Items.Add("[" + DateTime.Now.ToString("HH:mm:ss") + "] " + input);\n}'
    },
    stepCode: [
      'using System.Windows.Forms;',
      '',
      'public partial class MainForm : Form',
      '{',
      '    public MainForm()',
      '    {',
      '        InitializeComponent();',
      '    }',
      '',
      '    private void processBtn_Click(object s, EventArgs e)',
      '    {',
      '        // Your logic here',
      '    }',
      '}'
    ],
    steps: [
      { line: 0, text: 'WinForms namespace gives you Form, Control, and events.', tags: ['using'] },
      { line: 2, text: 'Every form is a class inheriting from <code>Form</code>.', tags: ['Class'] },
      { line: 9, text: 'Event handlers use the <code>(object, EventArgs)</code> signature.', tags: ['Event'] },
      { line: 11, text: 'Your business logic goes here.', tags: ['Logic'] }
    ],
    recap: [
      { title: 'WinForms', text: 'Mature, stable, widely used.' },
      { title: 'Native', text: 'Real Win32 controls under the hood.' },
      { title: 'Fast Dev', text: 'Visual designer + drag-and-drop.' },
      { title: 'Windows Only', text: 'No cross-platform support.' }
    ]
  }
};

/* ============================================================
   TITLE FROM SLUG
   ============================================================ */
function titleFromSlug(slug) {
  const special = {
    'winforms': 'WinForms', 'wpf': 'WPF', 'winui': 'WinUI',
    'net': '.NET', 'net-framework': '.NET Framework', 'net-core': '.NET Core',
    'net-maui': '.NET MAUI', 'csharp': 'C#', 'vb': 'VB.NET',
    'ui': 'UI', 'gui': 'GUI', 'api': 'API', 'id': 'ID',
    'dpi': 'DPI', 'sta': 'STA', 'mta': 'MTA', 'clr': 'CLR',
    'gc': 'GC', 'gdi': 'GDI+', 'hwnd': 'HWND', 'wndproc': 'WndProc'
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
  const tpl = CATEGORIES[category] || CATEGORIES.general;
  const themeTitle = titleFromSlug(theme);
  const sub = (s) => String(s).replace(/\{THEME\}/g, themeTitle);

  return {
    num,
    title: themeTitle,
    titleHtml: sub(tpl.titleHtml),
    subtitle: sub(tpl.subtitle),
    facts: tpl.facts.map(f => ({ big: sub(f.big), lbl: sub(f.lbl) })),
    concepts: tpl.concepts.map(c => ({ icon: c.icon, title: sub(c.title), desc: sub(c.desc) })),
    preview: {
      title: sub(tpl.preview.title),
      size: tpl.preview.size,
      controls: JSON.parse(sub(JSON.stringify(tpl.preview.controls))),
      script: sub(tpl.preview.script)
    },
    stepCode: tpl.stepCode,
    steps: tpl.steps,
    recap: tpl.recap.map(r => ({ title: sub(r.title), text: sub(r.text) }))
  };
}

/* ============================================================
   RENDER
   ============================================================ */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderControlsPreview(topic) {
  const width = topic.preview.size.w;
  const height = topic.preview.size.h;
  const controlsHtml = topic.preview.controls.map(c => {
    const commonStyle = 'left:' + c.x + 'px;top:' + c.y + 'px;';
    const w = c.w ? 'width:' + c.w + 'px;' : '';
    const h = c.h ? 'height:' + c.h + 'px;' : '';
    const pos = 'position:absolute;' + commonStyle + w + h;
    const idAttr = c.id ? ' id="wf-' + c.id + '"' : '';

    switch(c.type){
      case 'label':
        const cls = c.style ? 'wf-label wf-label-' + c.style : 'wf-label';
        return '<div' + idAttr + ' class="' + cls + '" style="' + pos + '">' + escapeHtml(c.text) + '</div>';

      case 'textbox':
        return '<input type="text"' + idAttr + ' class="wf-input" style="' + pos + '" placeholder="' + escapeHtml(c.placeholder || '') + '" />';

      case 'button':
        const btnCls = c.style === 'primary' ? 'wf-button wf-button-primary' : 'wf-button';
        return '<button type="button"' + idAttr + ' class="' + btnCls + '" style="' + pos + '">' + escapeHtml(c.text) + '</button>';

      case 'checkbox':
        return '<label' + idAttr + ' class="wf-check" style="' + pos + '"><input type="checkbox" /> <span>' + escapeHtml(c.text) + '</span></label>';

      case 'radio':
        return '<label' + idAttr + ' class="wf-radio" style="' + pos + '"><input type="radio" name="' + escapeHtml(c.name||'') + '" /> <span>' + escapeHtml(c.text) + '</span></label>';

      case 'radiogroup':
        const opts = c.options.map((o,i) => '<label class="wf-radio"><input type="radio" name="' + escapeHtml(c.id||'rg') + '" value="' + i + '" ' + (i===0?'checked':'') + '/> <span>' + escapeHtml(o) + '</span></label>').join('');
        return '<div' + idAttr + ' class="wf-radiogroup" style="' + pos + '">' + opts + '</div>';

      case 'combobox':
        const options = (c.items||[]).map(i => '<option>' + escapeHtml(i) + '</option>').join('');
        return '<select' + idAttr + ' class="wf-combo" style="' + pos + '">' + options + '</select>';

      case 'listbox':
        const items = (c.items||[]).map(i => '<li>' + escapeHtml(i) + '</li>').join('');
        return '<ul' + idAttr + ' class="wf-listbox" style="' + pos + '">' + items + '</ul>';

      case 'progress':
        return '<div' + idAttr + ' class="wf-progress" style="' + pos + '"><div class="wf-progress-fill" style="width:' + (c.value||0) + '%"></div></div>';

      default:
        return '';
    }
  }).join('');

  return '<div class="wf-window" style="width:' + width + 'px;height:' + height + 'px;">' +
    '<div class="wf-titlebar">' +
      '<div class="wf-titlebar-left">' +
        '<span class="wf-icon">🪟</span>' +
        '<span class="wf-title">' + escapeHtml(topic.preview.title) + '</span>' +
      '</div>' +
      '<div class="wf-controls">' +
        '<button class="wf-ctrl" title="Minimize">─</button>' +
        '<button class="wf-ctrl" title="Maximize">□</button>' +
        '<button class="wf-ctrl wf-ctrl-close" title="Close">✕</button>' +
      '</div>' +
    '</div>' +
    '<div class="wf-body">' + controlsHtml + '</div>' +
  '</div>';
}

function renderHTML(topic) {
  const factsHtml = topic.facts.map(f =>
    '<div class="fact"><div class="big">' + escapeHtml(f.big) + '</div><div class="lbl">' + escapeHtml(f.lbl) + '</div></div>'
  ).join('');

  const conceptsHtml = topic.concepts.map((c, i) => {
    const colors = ['#0078d4,#00a4ef', '#8661c5,#a78bfa', '#f59e0b,#fbbf24', '#22c55e,#4ade80'];
    const parts = colors[i % colors.length].split(',');
    const c1 = parts[0], c2 = parts[1];
    return '<div class="concept" style="--c1:' + c1 + ';--c2:' + c2 + '">' +
      '<div class="c-ico">' + c.icon + '</div>' +
      '<h3>' + escapeHtml(c.title) + '</h3>' +
      '<p>' + c.desc + '</p>' +
    '</div>';
  }).join('');

  const recapHtml = topic.recap.map((r, i) => {
    const colors = ['#0078d4', '#8661c5', '#f59e0b', '#22c55e'];
    return '<div class="recap" style="--rc:' + colors[i % colors.length] + '">' +
      '<div class="t">' + escapeHtml(r.title) + '</div>' +
      '<div class="d">' + r.text + '</div>' +
    '</div>';
  }).join('');

  const stepCodeHtml = topic.stepCode.map((l, i) =>
    '<div class="step-line" data-line="' + i + '">' + (escapeHtml(l) || ' ') + '</div>'
  ).join('');

  const previewHtml = renderControlsPreview(topic);
  const scriptEscaped = escapeHtml(topic.preview.script);
  const stepCount = topic.steps.length;
  const stepsJson = JSON.stringify(topic.steps);

  return '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>' + escapeHtml(topic.num) + ' · ' + escapeHtml(topic.title) + '</title>\n' +
'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">\n' +
'<style>\n' +
'*{margin:0;padding:0;box-sizing:border-box}\n' +
'html{scroll-behavior:smooth}\n' +
'body{font-family:"Inter",system-ui,sans-serif;background:#05060f;color:#f1f5f9;line-height:1.65;overflow-x:hidden}\n' +
'.space-base{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#0a1a30 0%,#0a0a20 45%,#05060f 85%),radial-gradient(ellipse at 100% 100%,#1a0f30 0%,transparent 55%)}\n' +
'.orbs{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:.45}\n' +
'.orb{position:absolute;border-radius:50%;filter:blur(90px)}\n' +
'.orb-1{width:520px;height:520px;top:-10%;left:-8%;background:radial-gradient(circle,#0078d4,transparent 70%);animation:d1 26s ease-in-out infinite}\n' +
'.orb-2{width:460px;height:460px;top:45%;right:-10%;background:radial-gradient(circle,#8661c5,transparent 70%);animation:d2 30s ease-in-out infinite}\n' +
'.orb-3{width:600px;height:600px;bottom:-18%;left:18%;background:radial-gradient(circle,#00a4ef,transparent 70%);animation:d3 34s ease-in-out infinite}\n' +
'@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,40px) scale(1.15)}}\n' +
'@keyframes d2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.2)}}\n' +
'@keyframes d3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-60px) scale(1.1)}}\n' +
'.grid-bg{position:fixed;inset:-50%;z-index:2;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(0,120,212,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,120,212,.14) 1px,transparent 1px);background-size:80px 80px;transform:perspective(500px) rotateX(60deg);animation:gf 22s linear infinite;mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%)}\n' +
'@keyframes gf{from{background-position:0 0}to{background-position:0 80px}}\n' +
'.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.72) 100%)}\n' +
'.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}\n' +
'.container{max-width:1150px;margin:0 auto;padding:0 1.5rem;width:100%}\n' +
'nav{position:sticky;top:0;z-index:100;background:rgba(5,6,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(148,163,184,.08)}\n' +
'.nav-inner{max-width:1150px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}\n' +
'.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1rem;color:#f1f5f9;text-decoration:none}\n' +
'.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#0078d4,#00a4ef);display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;box-shadow:0 8px 20px -6px rgba(0,120,212,.6)}\n' +
'.hero{padding:4.5rem 1.5rem 3rem;text-align:center}\n' +
'.tpill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(0,120,212,.12);border:1px solid rgba(0,120,212,.35);border-radius:999px;padding:.45rem 1.1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#60c4f0;margin-bottom:1.5rem}\n' +
'.tpill .n{background:#0078d4;color:#fff;min-width:26px;height:22px;border-radius:11px;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;padding:0 .4rem}\n' +
'.hero h1{font-size:clamp(1.7rem,4.4vw,2.8rem);font-weight:900;letter-spacing:-.04em;line-height:1.15;margin-bottom:1.2rem}\n' +
'.hero h1 .grad{background:linear-gradient(135deg,#60c4f0 0%,#0078d4 45%,#8661c5 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gs 7s ease-in-out infinite}\n' +
'@keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}\n' +
'.hero p{color:#a1a1aa;font-size:1.05rem;max-width:660px;margin:0 auto;line-height:1.7}\n' +
'section{padding:3rem 0}\n' +
'.sec-head{text-align:center;margin-bottom:2.5rem}\n' +
'.stag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(0,120,212,.1);border:1px solid rgba(0,120,212,.3);border-radius:999px;padding:.4rem 1rem;font-size:.68rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#60c4f0;margin-bottom:1rem}\n' +
'.sec-head h2{font-size:clamp(1.6rem,3.8vw,2.3rem);font-weight:900;letter-spacing:-.03em;line-height:1.15;margin-bottom:.6rem}\n' +
'.sec-head h2 .grad{background:linear-gradient(135deg,#60c4f0,#8661c5);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\n' +
'.sec-head p{color:#94a3b8;font-size:.95rem;max-width:620px;margin:0 auto}\n' +
'.facts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:2rem}\n' +
'.fact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:1.05rem 1rem;text-align:center;transition:all .25s}\n' +
'.fact:hover{transform:translateY(-3px);border-color:rgba(0,120,212,.4)}\n' +
'.fact .big{font-size:1.05rem;font-weight:900;background:linear-gradient(135deg,#60c4f0,#8661c5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}\n' +
'.fact .lbl{font-size:.66rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-top:.4rem}\n' +
'.concept-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}\n' +
'.concept{position:relative;padding:1.5rem;border-radius:18px;background:linear-gradient(155deg,rgba(24,25,50,.8),rgba(12,13,30,.6));border:1px solid rgba(148,163,184,.1);transition:all .3s;overflow:hidden}\n' +
'.concept::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--c1),var(--c2),transparent)}\n' +
'.concept:hover{transform:translateY(-4px);border-color:var(--c1);box-shadow:0 20px 40px -18px var(--c1)}\n' +
'.c-ico{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--c1),var(--c2));display:flex;align-items:center;justify-content:center;font-size:1.45rem;margin-bottom:.9rem;box-shadow:0 10px 24px -8px var(--c1)}\n' +
'.concept h3{font-size:1.05rem;font-weight:800;margin-bottom:.4rem;color:#f1f5f9}\n' +
'.concept p{color:#94a3b8;font-size:.85rem;line-height:1.6}\n' +
'.preview-stage{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1rem}\n' +
'@media(max-width:900px){.preview-stage{grid-template-columns:1fr}}\n' +
'.preview-panel{background:linear-gradient(155deg,rgba(15,16,36,.7),rgba(10,11,28,.5));border:1px solid rgba(148,163,184,.12);border-radius:16px;padding:1.2rem;display:flex;align-items:center;justify-content:center;overflow:auto;min-height:420px}\n' +
'.code-panel{background:#0d1117;border:1px solid rgba(148,163,184,.15);border-radius:16px;overflow:hidden}\n' +
'.code-panel-header{padding:.6rem 1rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);font-size:.72rem;color:#8b949e;font-family:"JetBrains Mono",monospace;display:flex;align-items:center;gap:.5rem}\n' +
'.code-panel-header .dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e}\n' +
'.code-panel pre{margin:0;padding:1rem 1.2rem;font-family:"JetBrains Mono",monospace;font-size:.8rem;line-height:1.7;color:#e6edf3;overflow-x:auto;white-space:pre}\n' +
'.wf-window{background:#f3f3f3;border-radius:8px;box-shadow:0 30px 60px -20px rgba(0,0,0,.6),0 0 0 1px rgba(0,0,0,.15);overflow:hidden;font-family:"Segoe UI",Tahoma,sans-serif;color:#1a1a1a;user-select:none;max-width:100%}\n' +
'.wf-titlebar{background:linear-gradient(180deg,#f0f0f0,#e8e8e8);padding:8px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d0d0d0;font-size:13px}\n' +
'.wf-titlebar-left{display:flex;align-items:center;gap:6px;font-weight:600;color:#1a1a1a}\n' +
'.wf-icon{font-size:12px}\n' +
'.wf-title{font-size:12.5px}\n' +
'.wf-controls{display:flex;gap:2px}\n' +
'.wf-ctrl{background:transparent;border:none;width:32px;height:26px;font-family:"Segoe UI",sans-serif;font-size:11px;color:#444;cursor:pointer;border-radius:4px;transition:background .12s}\n' +
'.wf-ctrl:hover{background:rgba(0,0,0,.06)}\n' +
'.wf-ctrl-close:hover{background:#e81123;color:#fff}\n' +
'.wf-body{position:relative;background:#fff;min-height:200px;background-image:linear-gradient(rgba(0,0,0,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.02) 1px,transparent 1px);background-size:8px 8px}\n' +
'.wf-label{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;color:#1a1a1a;display:flex;align-items:center}\n' +
'.wf-label-title{font-size:17px;font-weight:700;color:#0a3d6b}\n' +
'.wf-label-success{color:#0f9d58;font-weight:600}\n' +
'.wf-label-small{font-size:11.5px;color:#666}\n' +
'.wf-label-box{border:1px solid #c8c8c8;padding:8px;background:#fafafa;align-items:flex-start;overflow:auto;font-size:12px}\n' +
'.wf-input{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;border:1px solid #c8c8c8;background:#fff;padding:3px 8px;border-radius:2px;color:#1a1a1a;outline:none;transition:border-color .15s,box-shadow .15s}\n' +
'.wf-input::placeholder{color:#999}\n' +
'.wf-input:focus{border-color:#0078d4;box-shadow:0 0 0 1px #0078d4}\n' +
'.wf-button{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;background:linear-gradient(180deg,#fdfdfd,#e8e8e8);border:1px solid #adadad;border-radius:2px;cursor:pointer;color:#1a1a1a;padding:0;transition:all .12s}\n' +
'.wf-button:hover{background:linear-gradient(180deg,#f0f9ff,#dceffd);border-color:#0078d4}\n' +
'.wf-button:active{background:linear-gradient(180deg,#d9ecfa,#c2e0f7)}\n' +
'.wf-button-primary{background:linear-gradient(180deg,#2a90e0,#0d6ebd);border-color:#005a9e;color:#fff;font-weight:600}\n' +
'.wf-button-primary:hover{background:linear-gradient(180deg,#3aa0f0,#1378cc)}\n' +
'.wf-check,.wf-radio{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;color:#1a1a1a;display:flex;align-items:center;gap:6px;cursor:pointer}\n' +
'.wf-check input,.wf-radio input{cursor:pointer;accent-color:#0078d4}\n' +
'.wf-radiogroup{display:flex;flex-direction:column;gap:8px}\n' +
'.wf-combo{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;border:1px solid #c8c8c8;background:#fff;padding:3px 8px;border-radius:2px;color:#1a1a1a;outline:none;cursor:pointer}\n' +
'.wf-combo:focus{border-color:#0078d4}\n' +
'.wf-listbox{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;list-style:none;border:1px solid #c8c8c8;background:#fff;border-radius:2px;overflow-y:auto;margin:0;padding:2px}\n' +
'.wf-listbox li{padding:3px 8px;color:#1a1a1a;border-radius:2px;cursor:default}\n' +
'.wf-listbox li:hover{background:#e5f1fb}\n' +
'.wf-listbox li:not(:last-child){border-bottom:1px solid #f0f0f0}\n' +
'.wf-progress{background:#e6e6e6;border:1px solid #c8c8c8;border-radius:2px;overflow:hidden}\n' +
'.wf-progress-fill{height:100%;background:linear-gradient(180deg,#3a9ee8,#0d6ebd);transition:width .3s}\n' +
'.step-viz{margin-top:1.2rem;background:#0d1117;border-radius:16px;border:1px solid rgba(148,163,184,.15);overflow:hidden}\n' +
'.step-header{padding:.7rem 1.2rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}\n' +
'.step-header .title{font-size:.8rem;color:#8b949e;font-family:"JetBrains Mono",monospace}\n' +
'.step-controls{display:flex;gap:.4rem}\n' +
'.step-btn{background:rgba(0,120,212,.15);border:1px solid rgba(0,120,212,.3);color:#60c4f0;border-radius:8px;padding:.35rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}\n' +
'.step-btn:hover:not(:disabled){background:rgba(0,120,212,.3)}\n' +
'.step-btn:disabled{opacity:.35;cursor:not-allowed}\n' +
'.step-body{display:grid;grid-template-columns:1.2fr 1fr}\n' +
'@media(max-width:800px){.step-body{grid-template-columns:1fr}}\n' +
'.step-code{padding:1rem 1.2rem;font-family:"JetBrains Mono",monospace;font-size:.82rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1);overflow-x:auto}\n' +
'@media(max-width:800px){.step-code{border-right:none;border-bottom:1px solid rgba(148,163,184,.1)}}\n' +
'.step-line{padding:.15rem .5rem;border-radius:5px;transition:background .3s;white-space:pre}\n' +
'.step-line.active{background:rgba(0,120,212,.18);box-shadow:inset 3px 0 0 #0078d4;color:#fff}\n' +
'.step-info{padding:1.1rem 1.3rem;background:rgba(30,41,59,.4)}\n' +
'.explain{font-size:.85rem;color:#cbd5e1;min-height:4rem;margin-bottom:.9rem;line-height:1.6}\n' +
'.explain code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:"JetBrains Mono",monospace;font-size:.82em}\n' +
'.tag-list{display:flex;flex-wrap:wrap;gap:.35rem}\n' +
'.tag{background:rgba(96,196,240,.15);border:1px solid rgba(96,196,240,.3);color:#60c4f0;border-radius:6px;padding:.25rem .65rem;font-size:.7rem;font-family:"JetBrains Mono",monospace;font-weight:600}\n' +
'.step-progress{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}\n' +
'.bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}\n' +
'.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#0078d4,#8661c5);border-radius:999px;transition:width .35s}\n' +
'.count{font-size:.72rem;color:#64748b;font-family:"JetBrains Mono",monospace;min-width:3.5rem;text-align:right}\n' +
'.recap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.9rem;margin-top:1.2rem}\n' +
'.recap{background:rgba(30,41,59,.6);border-radius:14px;padding:1.1rem 1.2rem;border-left:3px solid var(--rc,#0078d4)}\n' +
'.recap .t{font-size:.72rem;font-weight:800;color:var(--rc,#0078d4);text-transform:uppercase;letter-spacing:.08em}\n' +
'.recap .d{font-size:.85rem;color:#cbd5e1;margin-top:.35rem;line-height:1.55}\n' +
'.recap .d code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:"JetBrains Mono",monospace;font-size:.82em}\n' +
'footer{text-align:center;padding:3rem 1.5rem;border-top:1px solid rgba(148,163,184,.08);color:#52525b;font-size:.82rem;margin-top:auto}\n' +
'.reveal{opacity:0;transform:translateY(24px);transition:opacity .8s,transform .8s}\n' +
'.reveal.in{opacity:1;transform:translateY(0)}\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
'<div class="space-base"></div>\n' +
'<div class="orbs"><div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div></div>\n' +
'<div class="grid-bg"></div>\n' +
'<div class="vig"></div>\n' +
'\n' +
'<div class="page">\n' +
'  <nav>\n' +
'    <div class="nav-inner">\n' +
'      <a href="#" class="brand"><div class="brand-mark">🪟</div> WinForms Series</a>\n' +
'    </div>\n' +
'  </nav>\n' +
'\n' +
'  <div class="hero">\n' +
'    <div class="tpill"><span class="n">' + topic.num + '</span> Topic ' + topic.num + '</div>\n' +
'    <h1>' + topic.titleHtml + '</h1>\n' +
'    <p>' + escapeHtml(topic.subtitle) + '</p>\n' +
'  </div>\n' +
'\n' +
'  <div class="container">\n' +
'    <div class="facts-row reveal">' + factsHtml + '</div>\n' +
'\n' +
'    <section>\n' +
'      <div class="sec-head reveal">\n' +
'        <div class="stag">Live Preview</div>\n' +
'        <h2>See It <span class="grad">In Action</span></h2>\n' +
'        <p>Click the buttons and type in the text boxes — this is a real interactive mockup.</p>\n' +
'      </div>\n' +
'      <div class="preview-stage reveal">\n' +
'        <div class="preview-panel">' + previewHtml + '</div>\n' +
'        <div class="code-panel">\n' +
'          <div class="code-panel-header"><span class="dot"></span> Preview.cs</div>\n' +
'          <pre>' + scriptEscaped + '</pre>\n' +
'        </div>\n' +
'      </div>\n' +
'    </section>\n' +
'\n' +
'    <section>\n' +
'      <div class="sec-head reveal">\n' +
'        <div class="stag">Core Concepts</div>\n' +
'        <h2>What You Need to <span class="grad">Know</span></h2>\n' +
'      </div>\n' +
'      <div class="concept-grid">' + conceptsHtml + '</div>\n' +
'    </section>\n' +
'\n' +
'    <section>\n' +
'      <div class="sec-head reveal">\n' +
'        <div class="stag">Walkthrough</div>\n' +
'        <h2>Step-by-Step <span class="grad">Explanation</span></h2>\n' +
'      </div>\n' +
'      <div class="step-viz reveal">\n' +
'        <div class="step-header">\n' +
'          <span class="title">Program.cs</span>\n' +
'          <div class="step-controls">\n' +
'            <button class="step-btn" id="prevBtn" onclick="stepPrev()" disabled>← Prev</button>\n' +
'            <button class="step-btn" id="nextBtn" onclick="stepNext()">Next Step →</button>\n' +
'            <button class="step-btn" onclick="stepReset()">↺ Reset</button>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div class="step-body">\n' +
'          <div class="step-code" id="stepCode">' + stepCodeHtml + '</div>\n' +
'          <div class="step-info">\n' +
'            <div class="explain" id="stepExplain">Click <strong>Next Step</strong> to begin.</div>\n' +
'            <div class="tag-list" id="stepTags"><span style="font-size:.72rem;color:#484f58;">Waiting to start</span></div>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div class="step-progress">\n' +
'          <div class="bar"><div class="bar-fill" id="stepBar"></div></div>\n' +
'          <div class="count" id="stepCount">0 / ' + stepCount + '</div>\n' +
'        </div>\n' +
'      </div>\n' +
'    </section>\n' +
'\n' +
'    <section>\n' +
'      <div class="sec-head reveal">\n' +
'        <div class="stag">Recap</div>\n' +
'        <h2>Key <span class="grad">Takeaways</span></h2>\n' +
'      </div>\n' +
'      <div class="recap-grid">' + recapHtml + '</div>\n' +
'    </section>\n' +
'  </div>\n' +
'\n' +
'  <footer>\n' +
'    <p>🪟 ' + escapeHtml(topic.title) + ' · WinForms Series</p>\n' +
'  </footer>\n' +
'</div>\n' +
'\n' +
'<script>\n' +
'var STEPS = ' + stepsJson + ';\n' +
'(function(){\n' +
'  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold:0.1});\n' +
'  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });\n' +
'})();\n' +
'\n' +
'(function(){\n' +
'  document.querySelectorAll(".wf-button").forEach(function(btn){\n' +
'    btn.addEventListener("click", function(){\n' +
'      var id = btn.id.replace("wf-", "");\n' +
'      handleButtonClick(id);\n' +
'    });\n' +
'  });\n' +
'  document.querySelectorAll(".wf-input").forEach(function(inp){\n' +
'    inp.addEventListener("keydown", function(e){\n' +
'      if(e.key === "Enter") handleButtonClick("greetBtn");\n' +
'    });\n' +
'  });\n' +
'})();\n' +
'\n' +
'function handleButtonClick(id){\n' +
'  switch(id){\n' +
'    case "greetBtn": {\n' +
'      var input = document.querySelector("#wf-nameInput") || document.querySelector("#wf-inputBox");\n' +
'      var result = document.querySelector("#wf-result") || document.querySelector("#wf-outputLabel");\n' +
'      if(!input || !result) return;\n' +
'      var name = input.value.trim();\n' +
'      if(!name){\n' +
'        result.textContent = "Please enter a name.";\n' +
'        result.style.color = "#c0392b";\n' +
'      } else {\n' +
'        result.textContent = "Hello, " + name + "! Welcome to WinForms.";\n' +
'        result.style.color = "#0f9d58";\n' +
'      }\n' +
'      break;\n' +
'    }\n' +
'    case "toggleBtn": {\n' +
'      var btn = document.querySelector("#wf-toggleBtn");\n' +
'      if(!btn) return;\n' +
'      btn.textContent = btn.textContent === "Toggle State" ? "Toggled!" : "Toggle State";\n' +
'      break;\n' +
'    }\n' +
'    case "msgShow": {\n' +
'      var r = document.querySelector("#wf-result");\n' +
'      if(r){ r.textContent = "Message shown!"; r.style.color = "#0f9d58"; }\n' +
'      break;\n' +
'    }\n' +
'    case "compareBtn": {\n' +
'      var selected = document.querySelector("input[name=\\"frameworkPick\\"]:checked");\n' +
'      var out = document.querySelector("#wf-comparison");\n' +
'      if(!out) return;\n' +
'      var messages = [\n' +
'        "WinForms: fastest to build, native controls, Windows only.",\n' +
'        "WPF: XAML, MVVM, GPU rendering, steeper learning curve.",\n' +
'        "WinUI 3: modern Fluent design, Windows App SDK.",\n' +
'        ".NET MAUI: cross-platform, one codebase for all devices."\n' +
'      ];\n' +
'      var idx = selected ? parseInt(selected.value) : 0;\n' +
'      out.textContent = messages[idx];\n' +
'      break;\n' +
'    }\n' +
'    case "refreshBtn": {\n' +
'      var list = document.querySelector("#wf-infoList");\n' +
'      if(!list) return;\n' +
'      list.innerHTML = "";\n' +
'      var now = new Date();\n' +
'      var items = [\n' +
'        "Runtime: .NET 8.0",\n' +
'        "Framework: Microsoft.WindowsDesktop.App",\n' +
'        "Architecture: x64",\n' +
'        "OS: Windows 11",\n' +
'        "CLR Version: 8.0.0",\n' +
'        "Time: " + now.toLocaleTimeString()\n' +
'      ];\n' +
'      items.forEach(function(t){\n' +
'        var li = document.createElement("li");\n' +
'        li.textContent = t;\n' +
'        list.appendChild(li);\n' +
'      });\n' +
'      break;\n' +
'    }\n' +
'    case "msgBtn1": addMsg("👆 Button clicked — WM_LBUTTONDOWN → WM_LBUTTONUP"); break;\n' +
'    case "msgBtn2": addMsg("🎨 Paint event — WM_PAINT dispatched to WndProc"); break;\n' +
'    case "msgBtn3": addMsg("📐 Resize event — WM_SIZE → layout recalculation"); break;\n' +
'    case "loadBtn":   addMsg("📥 Form_Load fired — before form is visible"); break;\n' +
'    case "shownBtn":  addMsg("👀 Form_Shown fired — after form is visible"); break;\n' +
'    case "closingBtn": addMsg("🚪 Form_Closing — can be cancelled with e.Cancel"); break;\n' +
'    case "handleBtn": {\n' +
'      var hlist = document.querySelector("#wf-handleList");\n' +
'      if(!hlist) return;\n' +
'      hlist.innerHTML = "";\n' +
'      var base = 0x000A0000 + Math.floor(Math.random() * 0x10000);\n' +
'      var hItems = [\n' +
'        "Form.Handle    = 0x" + (base).toString(16).toUpperCase().padStart(8,"0"),\n' +
'        "Button.Handle  = 0x" + (base+4).toString(16).toUpperCase().padStart(8,"0"),\n' +
'        "TextBox.Handle = 0x" + (base+8).toString(16).toUpperCase().padStart(8,"0"),\n' +
'        "Label.Handle   = 0x" + (base+12).toString(16).toUpperCase().padStart(8,"0"),\n' +
'        "IsHandleCreated = true"\n' +
'      ];\n' +
'      hItems.forEach(function(t){\n' +
'        var li = document.createElement("li");\n' +
'        li.textContent = t;\n' +
'        hlist.appendChild(li);\n' +
'      });\n' +
'      break;\n' +
'    }\n' +
'    case "createBtn": addLog("✅ Form created — resources allocated"); break;\n' +
'    case "disposeBtn": addLog("🧹 Form.Dispose() called — resources released"); break;\n' +
'    case "exitBtn": addLog("🛑 Application.Exit() — message loop stopping"); break;\n' +
'    case "resetBtn": {\n' +
'      var log = document.querySelector("#wf-lifecycle");\n' +
'      if(log){\n' +
'        log.innerHTML = "";\n' +
'        var items2 = ["1. Application.EnableVisualStyles()","2. Application.SetCompatibleTextRenderingDefault(false)","3. Application.SetHighDpiMode(HighDpiMode.SystemAware)","4. Application.Run(new MainForm())","5. [Message loop running...]","6. Application.Exit()"];\n' +
'        items2.forEach(function(t){\n' +
'          var li = document.createElement("li");\n' +
'          li.textContent = t;\n' +
'          log.appendChild(li);\n' +
'        });\n' +
'      }\n' +
'      break;\n' +
'    }\n' +
'    case "processBtn": {\n' +
'      var pin = document.querySelector("#wf-inputBox");\n' +
'      var pout = document.querySelector("#wf-outputLabel");\n' +
'      var plist = document.querySelector("#wf-outputList");\n' +
'      if(!pin || !pout) return;\n' +
'      var v = pin.value.trim();\n' +
'      if(!v){\n' +
'        pout.textContent = "Please enter something.";\n' +
'        pout.style.color = "#c0392b";\n' +
'      } else {\n' +
'        pout.textContent = "Processed: " + v;\n' +
'        pout.style.color = "#0f9d58";\n' +
'        if(plist){\n' +
'          var li = document.createElement("li");\n' +
'          li.textContent = "[" + new Date().toLocaleTimeString() + "] " + v;\n' +
'          plist.appendChild(li);\n' +
'        }\n' +
'      }\n' +
'      break;\n' +
'    }\n' +
'    case "cbBtn": {\n' +
'      var list2 = document.querySelector("#wf-lb1");\n' +
'      if(list2){\n' +
'        var li2 = document.createElement("li");\n' +
'        li2.textContent = "Clicked at " + new Date().toLocaleTimeString();\n' +
'        list2.appendChild(li2);\n' +
'      }\n' +
'      break;\n' +
'    }\n' +
'  }\n' +
'}\n' +
'\n' +
'function addMsg(text){\n' +
'  var log = document.querySelector("#wf-msgLog");\n' +
'  if(!log) return;\n' +
'  var li = document.createElement("li");\n' +
'  li.textContent = "[" + new Date().toLocaleTimeString() + "] " + text;\n' +
'  log.appendChild(li);\n' +
'  log.scrollTop = log.scrollHeight;\n' +
'}\n' +
'\n' +
'function addLog(text){\n' +
'  var log = document.querySelector("#wf-disposalLog");\n' +
'  if(!log) return;\n' +
'  var li = document.createElement("li");\n' +
'  li.textContent = text;\n' +
'  log.appendChild(li);\n' +
'}\n' +
'\n' +
'var cur = -1;\n' +
'function update(){\n' +
'  document.querySelectorAll(".step-line").forEach(function(el){ el.classList.remove("active"); });\n' +
'  if(cur < 0){\n' +
'    document.getElementById("stepExplain").innerHTML = "Click <strong>Next Step</strong> to begin.";\n' +
'    document.getElementById("stepTags").innerHTML = "<span style=\\"font-size:.72rem;color:#484f58;\\">Waiting to start</span>";\n' +
'    document.getElementById("stepBar").style.width = "0%";\n' +
'    document.getElementById("stepCount").textContent = "0 / " + STEPS.length;\n' +
'    document.getElementById("prevBtn").disabled = true;\n' +
'    document.getElementById("nextBtn").disabled = false;\n' +
'    return;\n' +
'  }\n' +
'  var s = STEPS[cur];\n' +
'  var el = document.querySelector(".step-line[data-line=\\"" + s.line + "\\"]");\n' +
'  if(el) el.classList.add("active");\n' +
'  document.getElementById("stepExplain").innerHTML = s.text;\n' +
'  document.getElementById("stepTags").innerHTML = (s.tags||[]).map(function(t){ return "<span class=\\"tag\\">"+t+"</span>"; }).join("");\n' +
'  document.getElementById("stepBar").style.width = ((cur+1)/STEPS.length*100) + "%";\n' +
'  document.getElementById("stepCount").textContent = (cur+1) + " / " + STEPS.length;\n' +
'  document.getElementById("prevBtn").disabled = cur <= 0;\n' +
'  document.getElementById("nextBtn").disabled = cur >= STEPS.length-1;\n' +
'}\n' +
'function stepNext(){ if(cur < STEPS.length-1){ cur++; update(); } }\n' +
'function stepPrev(){ if(cur > 0){ cur--; update(); } }\n' +
'function stepReset(){ cur = -1; update(); }\n' +
'update();\n' +
'</script>\n' +
'</body>\n' +
'</html>';
}

/* ============================================================
   BUILD
   ============================================================ */
const folders = fs.readdirSync(ROOT)
  .filter(f => /^\d+-/.test(f) && fs.statSync(path.join(ROOT, f)).isDirectory())
  .sort();

console.log('\n🪟 Found ' + folders.length + ' WinForms topic folders.\n');

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
      existing.includes('class="wf-window"') &&
      existing.includes('class="step-viz"') &&
      existing.includes('class="concept"');
    const isPlaceholder =
      existing.includes('XTutiRaiseUp') ||
      existing.includes('ready for complete documentation');
    if(hasRealContent && !isPlaceholder){ skipped++; continue; }
  }

  try {
    const topic = buildTopic(folder);
    if(!topic){ console.log('⚠  Skipped: ' + folder); failed++; continue; }
    const html = renderHTML(topic);
    fs.writeFileSync(outPath, html, 'utf8');
    generated++;
    if(generated % 50 === 0) console.log('✓ Generated ' + generated + '...');
  } catch(e){
    console.log('✗ ' + folder + ': ' + e.message);
    failed++;
  }
}

console.log('\n✨ Build complete!');
console.log('   Generated: ' + generated);
console.log('   Skipped:   ' + skipped);
console.log('   Failed:    ' + failed + '\n');