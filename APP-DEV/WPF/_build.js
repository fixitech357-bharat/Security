/* ============================================================
   WPF Topic Generator — clean version, no backtick issues
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
  if (/(design-goal|philosophy)/.test(t)) return 'philosophy';
  if (/(architecture|composition|rendering|application-model)/.test(t)) return 'architecture';
  if (/(project-structure|application-lifecycle|lifecycle)/.test(t)) return 'structure';
  if (/(xaml)/.test(t)) return 'xaml';
  if (/(data-binding|binding|mvvm|viewmodel|inotify)/.test(t)) return 'binding';
  if (/(layout|grid|stackpanel|dockpanel|canvas|wrap)/.test(t)) return 'layout';
  if (/(control|button|textbox|listbox|combobox|datagrid)/.test(t)) return 'controls';
  if (/(style|template|trigger|theme)/.test(t)) return 'styling';
  if (/(animation|storyboard|visual-state|transition)/.test(t)) return 'animation';
  if (/(resource|dictionary|staticresource|dynamicresource)/.test(t)) return 'resources';
  if (/(command|icommand|routed-command)/.test(t)) return 'commands';
  if (/(dependency-property|dependencyproperty|attached)/.test(t)) return 'dependency';
  if (/(routed-event|event|delegate|handler)/.test(t)) return 'events';
  if (/(navigation|page|frame)/.test(t)) return 'navigation';
  if (/(3d|graphics|drawing|shapes|geometry)/.test(t)) return 'graphics';
  if (/(performance|optimi|virtualization)/.test(t)) return 'performance';
  if (/(deploy|publish|installer|clickonce)/.test(t)) return 'deploy';
  if (/(best-practice|pattern|solid)/.test(t)) return 'patterns';
  if (/(threading|async|dispatcher)/.test(t)) return 'threading';
  if (/(security|safe)/.test(t)) return 'security';
  return 'general';
}

/* ============================================================
   TEMPLATES
   ============================================================ */
const CATEGORIES = {

  intro: {
    icon: '🎨',
    titleHtml: '{THEME}: <span class="grad">Introduction</span>',
    subtitle: 'Learn {THEME} — Microsoft\'s modern UI framework for Windows desktop applications.',
    facts: [
      { big: '2006', lbl: 'Released' },
      { big: '.NET', lbl: 'Framework' },
      { big: 'XAML', lbl: 'Markup' },
      { big: 'GPU', lbl: 'Rendering' },
      { big: 'MVVM', lbl: 'Pattern' }
    ],
    concepts: [
      { icon: '🎨', title: 'What It Is', desc: '{THEME} — a modern, GPU-accelerated UI framework built on XAML.' },
      { icon: '⚙️', title: 'How It Works', desc: 'XAML declares the UI; C# code-behind or ViewModels drive behavior.' },
      { icon: '🚀', title: 'Why It Matters', desc: 'Rich styling, animations, and data binding make complex UIs manageable.' },
      { icon: '🎯', title: 'When to Use', desc: 'Best for complex, polished Windows desktop applications.' }
    ],
    preview: {
      title: 'MainWindow',
      controls: [
        { type: 'textblock', text: 'Welcome to WPF', x: 24, y: 20, w: 400, h: 40, style: 'title' },
        { type: 'textblock', text: 'Enter your name:', x: 24, y: 80, w: 150, h: 22 },
        { type: 'textbox', id: 'nameInput', placeholder: 'Type here...', x: 24, y: 108, w: 320, h: 32 },
        { type: 'button', text: 'Greet Me', id: 'greetBtn', x: 354, y: 108, w: 110, h: 32, style: 'primary' },
        { type: 'textblock', id: 'result', text: '', x: 24, y: 160, w: 440, h: 24, style: 'success' },
        { type: 'button', text: 'Change Theme', id: 'themeBtn', x: 24, y: 210, w: 140, h: 32 },
        { type: 'button', text: 'Animate', id: 'animBtn', x: 180, y: 210, w: 140, h: 32 }
      ],
      xaml: '<Window x:Class="WpfApp.MainWindow"\n        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"\n        Title="My First WPF App" Width="520" Height="340">\n    <Grid Margin="20">\n        <TextBlock Text="Welcome to WPF"\n                   FontSize="24" FontWeight="Bold" />\n        <TextBox x:Name="nameInput" />\n        <Button Content="Greet Me" Click="Greet_Click" />\n    </Grid>\n</Window>'
    },
    stepCode: [
      '<!-- MainWindow.xaml -->',
      '<Window x:Class="WpfApp.MainWindow"',
      '        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"',
      '        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"',
      '        Title="My First WPF App" Width="520" Height="340">',
      '    <Grid Margin="20">',
      '        <TextBlock Text="Welcome to WPF" FontSize="24" />',
      '        <Button Content="Click Me" />',
      '    </Grid>',
      '</Window>'
    ],
    steps: [
      { line: 0, text: 'XAML files use the <code>.xaml</code> extension. XML-based markup.', tags: ['XAML'] },
      { line: 1, text: 'The <code>x:Class</code> attribute links XAML to its C# code-behind.', tags: ['Class'] },
      { line: 6, text: '<code>Grid</code> — WPF\'s most powerful layout panel.', tags: ['Layout'] },
      { line: 7, text: '<code>TextBlock</code> displays read-only text (like Label in WinForms).', tags: ['TextBlock'] },
      { line: 8, text: '<code>Button</code> with <code>Content</code> property — not <code>Text</code>.', tags: ['Button'] }
    ],
    recap: [
      { title: 'XAML + Code', text: 'UI in XAML, logic in C#.' },
      { title: 'GPU Rendering', text: 'DirectX-accelerated — smooth animations.' },
      { title: 'Data Binding', text: 'Connect UI to data automatically.' },
      { title: 'Windows Only', text: 'No cross-platform support.' }
    ]
  },

  history: {
    icon: '📜',
    titleHtml: '{THEME}: <span class="grad">History</span>',
    subtitle: 'The journey of {THEME} — from .NET Framework 3.0 to modern .NET.',
    facts: [
      { big: '2006', lbl: '.NET 3.0' },
      { big: '2008', lbl: '3.5 SP1' },
      { big: '2019', lbl: '.NET Core 3' },
      { big: '2020', lbl: '.NET 5' },
      { big: '2024', lbl: '.NET 8' }
    ],
    concepts: [
      { icon: '🔬', title: 'Origin', desc: 'WPF replaced Windows Forms for rich desktop UIs.' },
      { icon: '📛', title: 'Codename', desc: 'Originally "Avalon" — the UI layer of WinFX.' },
      { icon: '📖', title: 'Milestones', desc: '3.0 → 4.8 → Core → modern .NET.' },
      { icon: '🌍', title: 'Today', desc: 'Still supported in .NET 8 (Windows-only).' }
    ],
    preview: {
      title: 'Timeline',
      controls: [
        { type: 'textblock', text: 'WPF Release Timeline', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'listbox', id: 'timelineList', x: 24, y: 70, w: 460, h: 240, items: [
          '2006  · .NET Framework 3.0 — WPF (Avalon) released',
          '2008  · .NET Framework 3.5 SP1 — Performance improvements',
          '2010  · .NET Framework 4.0 — New controls, ribbon',
          '2015  · .NET Framework 4.6 — DPI improvements',
          '2019  · .NET Core 3.0 — WPF goes cross-runtime',
          '2020  · .NET 5 — Unified platform',
          '2024  · .NET 8 — Current LTS'
        ]}
      ],
      xaml: '<Window x:Class="TimelineApp.MainWindow"\n        Title="WPF Timeline" Width="520" Height="340">\n    <Grid Margin="20">\n        <TextBlock Text="WPF Release Timeline"\n                   FontSize="22" FontWeight="Bold" />\n        <ListBox x:Name="timelineList" Margin="0,50,0,0" />\n    </Grid>\n</Window>'
    },
    stepCode: [
      '// WPF versions across .NET:',
      '// .NET 3.0   (2006) — Initial release',
      '// .NET 3.5   (2008) — SP1 improvements',
      '// .NET 4.0   (2010) — New features',
      '// .NET 4.8   (2019) — Last full-framework',
      '// .NET Core 3 (2019) — Open source + cross-runtime',
      '// .NET 5-8   (2020-2024) — Unified modern .NET'
    ],
    steps: [
      { line: 1, text: '.NET Framework 3.0 — the very first WPF release, codename "Avalon".', tags: ['2006'] },
      { line: 3, text: '.NET Framework 4.0 — added ribbon controls and touch support.', tags: ['4.0'] },
      { line: 5, text: '.NET Core 3.0 brought WPF to the modern runtime.', tags: ['Core'] },
      { line: 6, text: '.NET 5+ — unified platform. .NET 8 is current LTS.', tags: ['Today'] }
    ],
    recap: [
      { title: '2006', text: 'WPF ships with .NET Framework 3.0.' },
      { title: 'Codename', text: 'Originally called "Avalon".' },
      { title: '2019', text: '.NET Core 3.0 — open source.' },
      { title: 'Still Active', text: 'Supported in .NET 8 (Windows-only).' }
    ]
  },

  philosophy: {
    icon: '💭',
    titleHtml: '{THEME}: <span class="grad">Design Goals</span>',
    subtitle: 'The design philosophy behind WPF — {THEME}.',
    facts: [
      { big: 'Vector', lbl: 'Graphics' },
      { big: 'Declarative', lbl: 'XAML' },
      { big: 'Retained', lbl: 'Mode' },
      { big: 'Resolution', lbl: 'Independent' },
      { big: 'Composable', lbl: 'UI' }
    ],
    concepts: [
      { icon: '🎯', title: 'Declarative UI', desc: 'Describe UI in XAML — not imperative code.' },
      { icon: '🎨', title: 'Vector Graphics', desc: 'Everything renders as vectors — scales without pixelation.' },
      { icon: '🧩', title: 'Composition', desc: 'Every control is a tree of smaller elements.' },
      { icon: '⚙️', title: 'Data-Driven', desc: 'Data binding separates UI from business logic.' }
    ],
    preview: {
      title: 'Composition Demo',
      controls: [
        { type: 'textblock', text: 'UI as a Composition Tree', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'WPF controls are made of smaller controls:', x: 24, y: 70, w: 460, h: 22 },
        { type: 'border', id: 'outerBorder', x: 24, y: 105, w: 460, h: 140, label: 'Border' },
        { type: 'textblock', text: 'Button', x: 60, y: 140, w: 100, h: 22, style: 'small' },
        { type: 'textblock', text: '  └ Border', x: 90, y: 162, w: 200, h: 22, style: 'small' },
        { type: 'textblock', text: '      └ ContentPresenter', x: 120, y: 184, w: 300, h: 22, style: 'small' },
        { type: 'textblock', text: '          └ TextBlock', x: 150, y: 206, w: 300, h: 22, style: 'small' }
      ],
      xaml: '<Button Content="Click Me" Padding="10">\n    <!-- A Button is composed of: -->\n    <!-- Border > ContentPresenter > TextBlock -->\n</Button>\n\n<!-- Every control is a composable tree -->'
    },
    stepCode: [
      '// WPF composition:',
      '// Every control is itself a tree of elements',
      '',
      '<Button>',
      '  <Button.Content>',
      '    <StackPanel Orientation="Horizontal">',
      '      <Image Source="icon.png" />',
      '      <TextBlock Text="Click" />',
      '    </StackPanel>',
      '  </Button.Content>',
      '</Button>'
    ],
    steps: [
      { line: 1, text: 'Composition: a control is built from smaller elements.', tags: ['Composition'] },
      { line: 3, text: 'A Button contains content — could be text, image, or a whole panel.', tags: ['Content'] },
      { line: 5, text: '<code>StackPanel</code> stacks children horizontally or vertically.', tags: ['StackPanel'] },
      { line: 7, text: 'This flexibility is why WPF is so powerful for custom UIs.', tags: ['Flexibility'] }
    ],
    recap: [
      { title: 'Declarative', text: 'XAML describes *what*, not *how*.' },
      { title: 'Vector-Based', text: 'Resolution-independent graphics.' },
      { title: 'Composable', text: 'Controls nest to build anything.' },
      { title: 'Data-Driven', text: 'Binding connects UI to data.' }
    ]
  },

  architecture: {
    icon: '🏗️',
    titleHtml: '{THEME}: <span class="grad">Architecture</span>',
    subtitle: 'Understanding the internals of {THEME}.',
    facts: [
      { big: 'milcore', lbl: 'Renderer' },
      { big: 'DirectX', lbl: 'GPU' },
      { big: 'Dispatcher', lbl: 'Threading' },
      { big: 'Visual Tree', lbl: 'Structure' },
      { big: 'Logical Tree', lbl: 'Model' }
    ],
    concepts: [
      { icon: '🎨', title: 'Rendering', desc: 'milcore.dll renders to DirectX. Every pixel is GPU-composited.' },
      { icon: '🌳', title: 'Visual Tree', desc: 'Every rendered element. Lowest level of the UI.' },
      { icon: '🌲', title: 'Logical Tree', desc: 'Your declared controls — higher-level view.' },
      { icon: '⚙️', title: 'Dispatcher', desc: 'WPF has one UI thread — the Dispatcher.' }
    ],
    preview: {
      title: 'WPF Architecture',
      controls: [
        { type: 'textblock', text: 'WPF Rendering Pipeline', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'Your XAML/C# Code', x: 24, y: 70, w: 460, h: 32, style: 'layer1' },
        { type: 'textblock', text: '  ↓', x: 24, y: 106, w: 460, h: 20, style: 'small' },
        { type: 'textblock', text: 'PresentationFramework (WPF API)', x: 24, y: 130, w: 460, h: 32, style: 'layer2' },
        { type: 'textblock', text: '  ↓', x: 24, y: 166, w: 460, h: 20, style: 'small' },
        { type: 'textblock', text: 'milcore (Media Integration Layer)', x: 24, y: 190, w: 460, h: 32, style: 'layer3' },
        { type: 'textblock', text: '  ↓', x: 24, y: 226, w: 460, h: 20, style: 'small' },
        { type: 'textblock', text: 'DirectX / GPU', x: 24, y: 250, w: 460, h: 32, style: 'layer4' }
      ],
      xaml: '<!-- Layers of WPF: -->\n<!-- 1. Your Code (XAML + C#) -->\n<!-- 2. PresentationFramework -->\n<!-- 3. milcore (native renderer) -->\n<!-- 4. DirectX / GPU -->\n\n<!-- Visual Tree: every rendered element -->\n<!-- Logical Tree: your declared controls -->'
    },
    stepCode: [
      '// WPF rendering pipeline:',
      '',
      '// 1. XAML parsed into logical tree',
      '// 2. Logical tree expanded to visual tree',
      '// 3. Visual tree handed to milcore',
      '// 4. milcore sends to DirectX',
      '// 5. GPU draws the pixels'
    ],
    steps: [
      { line: 2, text: 'XAML becomes a logical tree — your declared controls.', tags: ['Logical'] },
      { line: 3, text: 'The logical tree expands to a visual tree — everything rendered.', tags: ['Visual'] },
      { line: 4, text: '<code>milcore.dll</code> — the native component that talks to DirectX.', tags: ['milcore'] },
      { line: 6, text: 'GPU draws everything. WPF is fully hardware-accelerated.', tags: ['GPU'] }
    ],
    recap: [
      { title: 'Two Trees', text: 'Logical tree (yours) + Visual tree (rendered).' },
      { title: 'milcore', text: 'Native renderer built on DirectX.' },
      { title: 'Dispatcher', text: 'Single UI thread for all WPF operations.' },
      { title: 'Retained Mode', text: 'WPF remembers the scene graph.' }
    ]
  },

  structure: {
    icon: '📁',
    titleHtml: '{THEME}: <span class="grad">Project &amp; Lifecycle</span>',
    subtitle: 'How a WPF application is structured — {THEME}.',
    facts: [
      { big: '.xaml', lbl: 'UI Files' },
      { big: '.xaml.cs', lbl: 'Code-Behind' },
      { big: 'App.xaml', lbl: 'Entry Point' },
      { big: 'StartupUri', lbl: 'Boot Config' },
      { big: 'MSBuild', lbl: 'Build' }
    ],
    concepts: [
      { icon: '📁', title: 'Project Layout', desc: 'App.xaml, MainWindow.xaml, and code-behind files.' },
      { icon: '🚀', title: 'Startup', desc: 'App.xaml sets StartupUri — the first window shown.' },
      { icon: '🔄', title: 'Lifecycle', desc: 'Startup → MainWindow.Loaded → Running → Exit.' },
      { icon: '⚙️', title: 'csproj', desc: 'Modern SDK-style project with <code>UseWPF=true</code>.' }
    ],
    preview: {
      title: 'Project Structure',
      controls: [
        { type: 'textblock', text: 'WPF Project Structure', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'listbox', id: 'projTree', x: 24, y: 70, w: 460, h: 240, items: [
          '📁 MyWpfApp/',
          '  ├─ App.xaml          (application entry)',
          '  ├─ App.xaml.cs       (startup logic)',
          '  ├─ MainWindow.xaml   (main window UI)',
          '  ├─ MainWindow.xaml.cs (code-behind)',
          '  ├─ Views/            (additional windows)',
          '  ├─ ViewModels/       (MVVM view models)',
          '  ├─ Models/           (data models)',
          '  ├─ Resources/        (styles, images)',
          '  └─ MyWpfApp.csproj'
        ]}
      ],
      xaml: '<!-- App.xaml -->\n<Application x:Class="MyWpfApp.App"\n             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n             StartupUri="MainWindow.xaml">\n    <Application.Resources>\n    </Application.Resources>\n</Application>'
    },
    stepCode: [
      '<!-- App.xaml -->',
      '<Application x:Class="MyWpfApp.App"',
      '             StartupUri="MainWindow.xaml">',
      '    <Application.Resources>',
      '        <!-- global styles, brushes, etc. -->',
      '    </Application.Resources>',
      '</Application>',
      '',
      '<!-- csproj -->',
      '<UseWPF>true</UseWPF>'
    ],
    steps: [
      { line: 1, text: 'App.xaml — the application entry point. Sets global resources.', tags: ['App'] },
      { line: 2, text: '<code>StartupUri</code> — the first window shown when the app starts.', tags: ['Startup'] },
      { line: 3, text: '<code>Application.Resources</code> — global styles shared across windows.', tags: ['Resources'] },
      { line: 9, text: '<code>&lt;UseWPF&gt;true&lt;/UseWPF&gt;</code> in csproj enables WPF build.', tags: ['csproj'] }
    ],
    recap: [
      { title: 'App.xaml', text: 'Application entry with StartupUri.' },
      { title: 'MainWindow', text: 'The primary window shown at startup.' },
      { title: 'Code-Behind', text: 'Every XAML has a matching .xaml.cs file.' },
      { title: 'csproj', text: '<code>UseWPF=true</code> activates WPF tooling.' }
    ]
  },

  binding: {
    icon: '🔗',
    titleHtml: '{THEME}: <span class="grad">Data Binding</span>',
    subtitle: 'Connecting UI to data in WPF using {THEME}.',
    facts: [
      { big: 'Binding', lbl: 'Keyword' },
      { big: 'INotifyPropertyChanged', lbl: 'Interface' },
      { big: 'MVVM', lbl: 'Pattern' },
      { big: 'Mode=TwoWay', lbl: 'Update' },
      { big: 'Converter', lbl: 'Transform' }
    ],
    concepts: [
      { icon: '🔗', title: 'Binding', desc: '<code>{Binding Path=...}</code> links a UI property to a data property.' },
      { icon: '🔄', title: 'INotifyPropertyChanged', desc: 'Notifies UI when data changes.' },
      { icon: '🎯', title: 'MVVM', desc: 'Model-View-ViewModel — the recommended WPF pattern.' },
      { icon: '⚡', title: 'Update Source', desc: 'TwoWay, OneWay, OneTime, OneWayToSource.' }
    ],
    preview: {
      title: 'Data Binding Demo',
      controls: [
        { type: 'textblock', text: 'Two-Way Binding', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'Name:', x: 24, y: 70, w: 60, h: 22 },
        { type: 'textbox', id: 'bindInput', placeholder: 'type a name', x: 100, y: 70, w: 260, h: 32 },
        { type: 'textblock', text: 'You typed:', x: 24, y: 120, w: 100, h: 22 },
        { type: 'textblock', id: 'bindOutput', text: '(nothing yet)', x: 130, y: 120, w: 350, h: 24, style: 'success' },
        { type: 'textblock', text: '↑ Both update instantly — no button needed.', x: 24, y: 155, w: 460, h: 20, style: 'small' },
        { type: 'button', text: 'Clear', id: 'clearBind', x: 24, y: 200, w: 100, h: 32 }
      ],
      xaml: '<StackPanel Margin="20">\n    <TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}" />\n    <TextBlock Text="{Binding Name}" />\n</StackPanel>\n\n<!-- ViewModel -->\npublic class ViewModel : INotifyPropertyChanged\n{\n    private string _name;\n    public string Name\n    {\n        get => _name;\n        set { _name = value; OnPropertyChanged(); }\n    }\n}'
    },
    stepCode: [
      '<!-- XAML binding -->',
      '<TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}" />',
      '<TextBlock Text="{Binding Name}" />',
      '',
      '// ViewModel',
      'public class MainViewModel : INotifyPropertyChanged',
      '{',
      '    private string _name;',
      '    public string Name',
      '    {',
      '        get => _name;',
      '        set { _name = value; OnPropertyChanged(); }',
      '    }',
      '}'
    ],
    steps: [
      { line: 1, text: '<code>{Binding Name}</code> — connects TextBox.Text to ViewModel.Name.', tags: ['Binding'] },
      { line: 2, text: '<code>TextBlock</code> bound to the same property — updates automatically.', tags: ['Binding'] },
      { line: 5, text: 'ViewModel implements <code>INotifyPropertyChanged</code>.', tags: ['INPC'] },
      { line: 11, text: 'When set runs, <code>OnPropertyChanged()</code> notifies the UI.', tags: ['Notify'] }
    ],
    recap: [
      { title: 'Binding', text: '<code>{Binding Path=...}</code> in XAML.' },
      { title: 'INPC', text: 'Data class notifies when properties change.' },
      { title: 'MVVM', text: 'Separate View, ViewModel, Model.' },
      { title: 'Modes', text: 'TwoWay, OneWay, OneTime.' }
    ]
  },

  layout: {
    icon: '📐',
    titleHtml: '{THEME}: <span class="grad">Layout System</span>',
    subtitle: 'Mastering WPF layout with {THEME}.',
    facts: [
      { big: 'Grid', lbl: 'Panel' },
      { big: 'StackPanel', lbl: 'Panel' },
      { big: 'DockPanel', lbl: 'Panel' },
      { big: 'Canvas', lbl: 'Panel' },
      { big: 'WrapPanel', lbl: 'Panel' }
    ],
    concepts: [
      { icon: '📊', title: 'Grid', desc: 'Rows and columns — the most powerful layout.' },
      { icon: '📚', title: 'StackPanel', desc: 'Stacks children vertically or horizontally.' },
      { icon: '⚓', title: 'DockPanel', desc: 'Docks children to edges — like WinForms Dock.' },
      { icon: '🎨', title: 'Canvas', desc: 'Absolute positioning — pixel-perfect control.' }
    ],
    preview: {
      title: 'Layout Demo',
      controls: [
        { type: 'textblock', text: 'WPF Layout Panels', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'border', id: 'grid1', x: 24, y: 70, w: 220, h: 140, label: 'Grid (2x2)' },
        { type: 'textblock', text: 'A', x: 40, y: 100, w: 30, h: 22 },
        { type: 'textblock', text: 'B', x: 140, y: 100, w: 30, h: 22 },
        { type: 'textblock', text: 'C', x: 40, y: 160, w: 30, h: 22 },
        { type: 'textblock', text: 'D', x: 140, y: 160, w: 30, h: 22 },
        { type: 'border', id: 'stack1', x: 260, y: 70, w: 220, h: 140, label: 'StackPanel (vertical)' },
        { type: 'textblock', text: '1 ───', x: 280, y: 100, w: 180, h: 22, style: 'small' },
        { type: 'textblock', text: '2 ───', x: 280, y: 122, w: 180, h: 22, style: 'small' },
        { type: 'textblock', text: '3 ───', x: 280, y: 144, w: 180, h: 22, style: 'small' }
      ],
      xaml: '<Grid>\n    <Grid.RowDefinitions>\n        <RowDefinition Height="Auto" />\n        <RowDefinition Height="*" />\n    </Grid.RowDefinitions>\n    <Grid.ColumnDefinitions>\n        <ColumnDefinition Width="200" />\n        <ColumnDefinition Width="*" />\n    </Grid.ColumnDefinitions>\n\n    <TextBlock Grid.Row="0" Grid.Column="0" Text="Top-left" />\n</Grid>'
    },
    stepCode: [
      '<Grid>',
      '    <Grid.RowDefinitions>',
      '        <RowDefinition Height="Auto" />',
      '        <RowDefinition Height="*" />',
      '    </Grid.RowDefinitions>',
      '    <Grid.ColumnDefinitions>',
      '        <ColumnDefinition Width="200" />',
      '        <ColumnDefinition Width="*" />',
      '    </Grid.ColumnDefinitions>',
      '',
      '    <TextBlock Grid.Row="0" Grid.Column="0" Text="Hello" />',
      '</Grid>'
    ],
    steps: [
      { line: 0, text: '<code>Grid</code> — rows and columns. The go-to WPF layout panel.', tags: ['Grid'] },
      { line: 2, text: '<code>Auto</code> — sizes to content. <code>*</code> — takes remaining space.', tags: ['Sizing'] },
      { line: 10, text: 'Attach children with <code>Grid.Row</code> and <code>Grid.Column</code>.', tags: ['Attach'] }
    ],
    recap: [
      { title: 'Grid', text: 'Best for complex layouts.' },
      { title: 'StackPanel', text: 'Simple vertical or horizontal stacking.' },
      { title: 'DockPanel', text: 'Edge docking (top, bottom, left, right).' },
      { title: 'Sizing', text: '<code>Auto</code>, <code>*</code>, and fixed pixels.' }
    ]
  },

  controls: {
    icon: '🎛️',
    titleHtml: '{THEME}: <span class="grad">Controls</span>',
    subtitle: 'The controls that make up every WPF UI — {THEME}.',
    facts: [
      { big: 'ContentControl', lbl: 'Base' },
      { big: 'ItemsControl', lbl: 'Lists' },
      { big: 'HeaderedContent', lbl: 'Tab/Group' },
      { big: 'RangeBase', lbl: 'Sliders' },
      { big: 'Panel', lbl: 'Layout' }
    ],
    concepts: [
      { icon: '🎛️', title: 'Content Controls', desc: 'Button, Label, CheckBox — hold arbitrary content.' },
      { icon: '📋', title: 'Item Controls', desc: 'ListBox, ComboBox, DataGrid — hold collections.' },
      { icon: '🎨', title: 'Templating', desc: 'Every control is fully customizable via templates.' },
      { icon: '⚙️', title: 'Content Property', desc: 'WPF buttons use <code>Content</code>, not <code>Text</code>.' }
    ],
    preview: {
      title: 'Control Gallery',
      controls: [
        { type: 'textblock', text: 'WPF Controls', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'TextBox:', x: 24, y: 70, w: 100, h: 22 },
        { type: 'textbox', id: 'c1', placeholder: 'type...', x: 130, y: 70, w: 200, h: 30 },
        { type: 'textblock', text: 'CheckBox:', x: 24, y: 110, w: 100, h: 22 },
        { type: 'checkbox', id: 'c2', text: 'Enabled', x: 130, y: 110, w: 150, h: 22 },
        { type: 'textblock', text: 'ComboBox:', x: 24, y: 145, w: 100, h: 22 },
        { type: 'combobox', id: 'c3', x: 130, y: 145, w: 200, h: 30, items: ['Small', 'Medium', 'Large'] },
        { type: 'textblock', text: 'Button:', x: 24, y: 190, w: 100, h: 22 },
        { type: 'button', text: 'Click Me', id: 'cbtn', x: 130, y: 190, w: 120, h: 32, style: 'primary' },
        { type: 'textblock', text: 'ProgressBar:', x: 24, y: 240, w: 100, h: 22 },
        { type: 'progress', id: 'cprog', x: 130, y: 240, w: 400, h: 20, value: 70 },
        { type: 'textblock', text: 'ListBox:', x: 24, y: 280, w: 100, h: 22 },
        { type: 'listbox', id: 'clist', x: 130, y: 280, w: 400, h: 90, items: ['Item 1', 'Item 2', 'Item 3'] }
      ],
      xaml: '<StackPanel Margin="20">\n    <TextBox x:Name="nameBox" />\n    <CheckBox Content="Enabled" />\n    <ComboBox>\n        <ComboBoxItem>Small</ComboBoxItem>\n        <ComboBoxItem>Medium</ComboBoxItem>\n    </ComboBox>\n    <Button Content="Click Me" />\n    <ProgressBar Value="70" Maximum="100" />\n    <ListBox />\n</StackPanel>'
    },
    stepCode: [
      '<StackPanel Margin="20">',
      '    <TextBox x:Name="nameBox" />',
      '    <CheckBox Content="Enabled" />',
      '    <ComboBox>',
      '        <ComboBoxItem>Small</ComboBoxItem>',
      '        <ComboBoxItem>Medium</ComboBoxItem>',
      '    </ComboBox>',
      '    <Button Content="Click Me" />',
      '    <ProgressBar Value="70" Maximum="100" />',
      '    <ListBox />',
      '</StackPanel>'
    ],
    steps: [
      { line: 1, text: '<code>TextBox</code> — single-line text input.', tags: ['TextBox'] },
      { line: 2, text: '<code>CheckBox</code> — uses <code>Content</code> for the label.', tags: ['CheckBox'] },
      { line: 7, text: '<code>Button</code> — WPF buttons also use <code>Content</code>.', tags: ['Button'] },
      { line: 8, text: '<code>ProgressBar</code> with <code>Value</code> and <code>Maximum</code>.', tags: ['Progress'] }
    ],
    recap: [
      { title: 'Content', text: 'Most controls use <code>Content</code>, not <code>Text</code>.' },
      { title: 'Two Families', text: 'ContentControls vs ItemsControls.' },
      { title: 'Templated', text: 'Every control is fully re-styleable.' },
      { title: 'Data-Driven', text: 'ListBox/DataGrid bind to collections.' }
    ]
  },

  styling: {
    icon: '🎨',
    titleHtml: '{THEME}: <span class="grad">Styles &amp; Templates</span>',
    subtitle: 'Customizing WPF appearance with {THEME}.',
    facts: [
      { big: 'Style', lbl: 'Reusable' },
      { big: 'ControlTemplate', lbl: 'Full' },
      { big: 'DataTemplate', lbl: 'Item' },
      { big: 'Trigger', lbl: 'Conditional' },
      { big: 'Setter', lbl: 'Property' }
    ],
    concepts: [
      { icon: '🎨', title: 'Style', desc: 'Reusable set of property values for a control type.' },
      { icon: '🧬', title: 'ControlTemplate', desc: 'Completely redefine how a control looks.' },
      { icon: '⚡', title: 'Triggers', desc: 'Change appearance based on state (hover, focused).' },
      { icon: '📦', title: 'Resources', desc: 'Store styles globally or per-window.' }
    ],
    preview: {
      title: 'Styling Demo',
      controls: [
        { type: 'textblock', text: 'WPF Styling', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'Hover over the buttons below — triggers change their look.', x: 24, y: 70, w: 460, h: 22, style: 'small' },
        { type: 'button', text: 'Default Style', x: 24, y: 110, w: 200, h: 42 },
        { type: 'button', text: 'Primary Button', id: 'styledPrimary', x: 240, y: 110, w: 200, h: 42, style: 'primary' },
        { type: 'button', text: 'Danger Button', id: 'styledDanger', x: 24, y: 170, w: 200, h: 42, style: 'danger' },
        { type: 'button', text: 'Success Button', id: 'styledSuccess', x: 240, y: 170, w: 200, h: 42, style: 'success' }
      ],
      xaml: '<Window.Resources>\n    <Style x:Key="PrimaryButton" TargetType="Button">\n        <Setter Property="Background" Value="#0078D4" />\n        <Setter Property="Foreground" Value="White" />\n        <Setter Property="Padding" Value="20,10" />\n        <Style.Triggers>\n            <Trigger Property="IsMouseOver" Value="True">\n                <Setter Property="Background" Value="#106EBE" />\n            </Trigger>\n        </Style.Triggers>\n    </Style>\n</Window.Resources>\n\n<Button Style="{StaticResource PrimaryButton}" Content="Click" />'
    },
    stepCode: [
      '<Window.Resources>',
      '    <Style x:Key="PrimaryButton" TargetType="Button">',
      '        <Setter Property="Background" Value="#0078D4" />',
      '        <Setter Property="Foreground" Value="White" />',
      '        <Style.Triggers>',
      '            <Trigger Property="IsMouseOver" Value="True">',
      '                <Setter Property="Background" Value="#106EBE" />',
      '            </Trigger>',
      '        </Style.Triggers>',
      '    </Style>',
      '</Window.Resources>'
    ],
    steps: [
      { line: 1, text: '<code>Style</code> with <code>x:Key</code> — a reusable named style.', tags: ['Style'] },
      { line: 2, text: '<code>Setter</code> assigns a property value.', tags: ['Setter'] },
      { line: 4, text: '<code>Style.Triggers</code> — conditional setters.', tags: ['Trigger'] },
      { line: 5, text: '<code>IsMouseOver</code> — change background on hover.', tags: ['Hover'] }
    ],
    recap: [
      { title: 'Style', text: 'Reusable property bundles.' },
      { title: 'Templates', text: 'Full control over visuals.' },
      { title: 'Triggers', text: 'Conditional styling — hover, focus, etc.' },
      { title: 'Resources', text: 'Define once, use everywhere.' }
    ]
  },

  animation: {
    icon: '✨',
    titleHtml: '{THEME}: <span class="grad">Animation &amp; Storyboards</span>',
    subtitle: 'Adding motion to WPF apps with {THEME}.',
    facts: [
      { big: 'Storyboard', lbl: 'Container' },
      { big: 'DoubleAnimation', lbl: 'Type' },
      { big: 'Duration', lbl: 'Timing' },
      { big: 'Easing', lbl: 'Smooth' },
      { big: 'BeginStoryboard', lbl: 'Trigger' }
    ],
    concepts: [
      { icon: '✨', title: 'Animations', desc: 'Smoothly change properties over time.' },
      { icon: '🎬', title: 'Storyboards', desc: 'Group multiple animations.' },
      { icon: '⏱️', title: 'Timing', desc: 'Duration, BeginTime, RepeatBehavior.' },
      { icon: '🎨', title: 'Easing', desc: 'Smooth, natural motion with easing functions.' }
    ],
    preview: {
      title: 'Animation Demo',
      controls: [
        { type: 'textblock', text: 'WPF Animations', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'button', text: '▶ Play Animation', id: 'playAnim', x: 24, y: 70, w: 180, h: 40, style: 'primary' },
        { type: 'textblock', text: 'Watch this box move:', x: 24, y: 130, w: 300, h: 22, style: 'small' },
        { type: 'animatedbox', id: 'animBox', x: 24, y: 160, w: 80, h: 80 },
        { type: 'button', text: 'Fade In/Out', id: 'fadeAnim', x: 220, y: 70, w: 160, h: 40 },
        { type: 'button', text: 'Rotate', id: 'rotateAnim', x: 400, y: 70, w: 100, h: 40 }
      ],
      xaml: '<Button Content="Animate Me">\n    <Button.Triggers>\n        <EventTrigger RoutedEvent="Click">\n            <BeginStoryboard>\n                <Storyboard>\n                    <DoubleAnimation\n                        Storyboard.TargetProperty="Width"\n                        From="100" To="300"\n                        Duration="0:0:0.5" />\n                </Storyboard>\n            </BeginStoryboard>\n        </EventTrigger>\n    </Button.Triggers>\n</Button>'
    },
    stepCode: [
      '<Button Content="Animate">',
      '    <Button.Triggers>',
      '        <EventTrigger RoutedEvent="Click">',
      '            <BeginStoryboard>',
      '                <Storyboard>',
      '                    <DoubleAnimation',
      '                        Storyboard.TargetProperty="Width"',
      '                        From="100" To="300"',
      '                        Duration="0:0:0.5" />',
      '                </Storyboard>',
      '            </BeginStoryboard>',
      '        </EventTrigger>',
      '    </Button.Triggers>',
      '</Button>'
    ],
    steps: [
      { line: 2, text: '<code>EventTrigger</code> — fires the animation on an event.', tags: ['Trigger'] },
      { line: 4, text: '<code>Storyboard</code> — container for one or more animations.', tags: ['Storyboard'] },
      { line: 6, text: '<code>DoubleAnimation</code> — animates a numeric property.', tags: ['Animation'] },
      { line: 9, text: '<code>Duration="0:0:0.5"</code> — half a second (H:M:S).', tags: ['Duration'] }
    ],
    recap: [
      { title: 'Storyboard', text: 'Container for animations.' },
      { title: 'DoubleAnimation', text: 'Animate numeric properties like Width.' },
      { title: 'Duration', text: 'Format: H:M:S. Use easing for natural motion.' },
      { title: 'Triggers', text: 'Start animations from events or states.' }
    ]
  },

  resources: {
    icon: '📦',
    titleHtml: '{THEME}: <span class="grad">Resources</span>',
    subtitle: 'Managing and sharing resources in WPF using {THEME}.',
    facts: [
      { big: 'StaticResource', lbl: 'Resolve' },
      { big: 'DynamicResource', lbl: 'Live' },
      { big: 'ResourceDictionary', lbl: 'Shared' },
      { big: 'Merged', lbl: 'Dictionaries' },
      { big: 'App.xaml', lbl: 'Global' }
    ],
    concepts: [
      { icon: '📦', title: 'StaticResource', desc: 'Resolved once at load time — fastest.' },
      { icon: '🔄', title: 'DynamicResource', desc: 'Resolved every time — allows runtime changes.' },
      { icon: '📚', title: 'ResourceDictionary', desc: 'Reusable collection of styles, brushes, templates.' },
      { icon: '🌍', title: 'Global Resources', desc: 'Define in App.xaml to share across the whole app.' }
    ],
    preview: {
      title: 'Resources Demo',
      controls: [
        { type: 'textblock', text: 'WPF Resources', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'Global brushes and styles:', x: 24, y: 70, w: 300, h: 22, style: 'small' },
        { type: 'coloredbox', id: 'brush1', x: 24, y: 105, w: 100, h: 60, color: '#0078d4', label: 'PrimaryBrush' },
        { type: 'coloredbox', id: 'brush2', x: 140, y: 105, w: 100, h: 60, color: '#8661c5', label: 'AccentBrush' },
        { type: 'coloredbox', id: 'brush3', x: 256, y: 105, w: 100, h: 60, color: '#22c55e', label: 'SuccessBrush' },
        { type: 'coloredbox', id: 'brush4', x: 372, y: 105, w: 100, h: 60, color: '#f59e0b', label: 'WarningBrush' },
        { type: 'button', text: 'Change Theme', id: 'changeTheme', x: 24, y: 190, w: 180, h: 40, style: 'primary' }
      ],
      xaml: '<!-- App.xaml -->\n<Application.Resources>\n    <SolidColorBrush x:Key="PrimaryBrush" Color="#0078D4" />\n    <SolidColorBrush x:Key="AccentBrush" Color="#8661C5" />\n</Application.Resources>\n\n<!-- Usage -->\n<Button Background="{StaticResource PrimaryBrush}" />\n<TextBlock Foreground="{DynamicResource AccentBrush}" />'
    },
    stepCode: [
      '<!-- App.xaml -->',
      '<Application.Resources>',
      '    <SolidColorBrush x:Key="PrimaryBrush" Color="#0078D4" />',
      '    <Style x:Key="TitleStyle" TargetType="TextBlock">',
      '        <Setter Property="FontSize" Value="24" />',
      '    </Style>',
      '</Application.Resources>',
      '',
      '<!-- Usage -->',
      '<Button Background="{StaticResource PrimaryBrush}" />',
      '<TextBlock Style="{StaticResource TitleStyle}" />'
    ],
    steps: [
      { line: 1, text: '<code>Application.Resources</code> — global resources for the whole app.', tags: ['Global'] },
      { line: 2, text: '<code>SolidColorBrush</code> with <code>x:Key</code> — a named brush.', tags: ['Brush'] },
      { line: 3, text: '<code>Style</code> with <code>Setter</code> — reusable style bundle.', tags: ['Style'] },
      { line: 9, text: 'Access with <code>{StaticResource Key}</code>.', tags: ['Static'] }
    ],
    recap: [
      { title: 'StaticResource', text: 'Faster. Resolved once.' },
      { title: 'DynamicResource', text: 'Live. Allows runtime updates.' },
      { title: 'App.xaml', text: 'Global resource scope.' },
      { title: 'Merged Dictionaries', text: 'Split resources across files.' }
    ]
  },

  commands: {
    icon: '⌨️',
    titleHtml: '{THEME}: <span class="grad">Commands</span>',
    subtitle: 'WPF commands and {THEME} — the MVVM way to handle user actions.',
    facts: [
      { big: 'ICommand', lbl: 'Interface' },
      { big: 'RelayCommand', lbl: 'Common' },
      { big: 'RoutedCommand', lbl: 'Built-in' },
      { big: 'CanExecute', lbl: 'Enable' },
      { big: 'Execute', lbl: 'Action' }
    ],
    concepts: [
      { icon: '⌨️', title: 'ICommand', desc: 'The interface — with Execute and CanExecute.' },
      { icon: '🎯', title: 'MVVM', desc: 'Commands bind ViewModel logic to UI events.' },
      { icon: '⚡', title: 'RoutedCommand', desc: 'Built-in commands like ApplicationCommands.Copy.' },
      { icon: '🔄', title: 'CanExecute', desc: 'Auto-enables/disables the button.' }
    ],
    preview: {
      title: 'Commands Demo',
      controls: [
        { type: 'textblock', text: 'WPF Commands (ICommand)', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'The button enables only when input is valid:', x: 24, y: 70, w: 460, h: 22, style: 'small' },
        { type: 'textbox', id: 'cmdInput', placeholder: 'Type a message (min 3 chars)', x: 24, y: 105, w: 400, h: 32 },
        { type: 'button', text: 'Send Command', id: 'cmdBtn', x: 24, y: 155, w: 180, h: 42, style: 'primary' },
        { type: 'textblock', id: 'cmdResult', text: '', x: 24, y: 215, w: 440, h: 24, style: 'success' },
        { type: 'button', text: 'Reset', id: 'cmdReset', x: 220, y: 155, w: 100, h: 42 }
      ],
      xaml: '<!-- XAML -->\n<Button Content="Send"\n        Command="{Binding SendCommand}" />\n\n<!-- ViewModel -->\npublic ICommand SendCommand { get; }\n\nSendCommand = new RelayCommand(\n    execute: () => Send(),\n    canExecute: () => !string.IsNullOrEmpty(Name));'
    },
    stepCode: [
      'public class MainViewModel',
      '{',
      '    public string Message { get; set; }',
      '',
      '    public ICommand SendCommand { get; }',
      '',
      '    public MainViewModel()',
      '    {',
      '        SendCommand = new RelayCommand(',
      '            execute: () => Send(),',
      '            canExecute: () => Message?.Length >= 3',
      '        );',
      '    }',
      '}'
    ],
    steps: [
      { line: 4, text: '<code>ICommand</code> — the command interface.', tags: ['ICommand'] },
      { line: 8, text: '<code>RelayCommand</code> — a common custom implementation.', tags: ['Relay'] },
      { line: 9, text: '<code>execute</code> — what happens on click.', tags: ['Execute'] },
      { line: 10, text: '<code>canExecute</code> — button enabled only when valid.', tags: ['CanExecute'] }
    ],
    recap: [
      { title: 'ICommand', text: 'Execute + CanExecute.' },
      { title: 'MVVM-friendly', text: 'No click handlers in code-behind.' },
      { title: 'Auto-enable', text: 'Buttons disable when CanExecute is false.' },
      { title: 'Reusable', text: 'Same command works from button, menu, keybinding.' }
    ]
  },

  general: {
    icon: '📘',
    titleHtml: '{THEME}',
    subtitle: 'A complete guide to {THEME} in WPF.',
    facts: [
      { big: 'WPF', lbl: 'Framework' },
      { big: '.NET 8', lbl: 'Runtime' },
      { big: 'XAML', lbl: 'Markup' },
      { big: 'C#', lbl: 'Language' },
      { big: 'Windows', lbl: 'Platform' }
    ],
    concepts: [
      { icon: '📖', title: 'Overview', desc: 'An introduction to {THEME} in the WPF world.' },
      { icon: '🎯', title: 'Importance', desc: 'Why {THEME} matters for real WPF apps.' },
      { icon: '⚙️', title: 'Details', desc: 'Key points and common patterns.' },
      { icon: '🚀', title: 'Practice', desc: 'How to apply {THEME}.' }
    ],
    preview: {
      title: 'WPF Demo',
      controls: [
        { type: 'textblock', text: 'Topic Demo', x: 24, y: 20, w: 400, h: 34, style: 'title' },
        { type: 'textblock', text: 'Enter a value:', x: 24, y: 70, w: 120, h: 22 },
        { type: 'textbox', id: 'genInput', placeholder: 'Type something...', x: 24, y: 98, w: 340, h: 32 },
        { type: 'button', text: 'Process', id: 'genBtn', x: 374, y: 98, w: 110, h: 32, style: 'primary' },
        { type: 'textblock', id: 'genResult', text: '', x: 24, y: 150, w: 460, h: 24, style: 'success' },
        { type: 'listbox', id: 'genList', x: 24, y: 195, w: 460, h: 120, items: ['Ready. Click Process.'] }
      ],
      xaml: '<StackPanel Margin="20">\n    <TextBlock Text="Enter a value:" />\n    <TextBox x:Name="inputBox" />\n    <Button Content="Process" Click="Process_Click" />\n    <TextBlock x:Name="resultText" />\n    <ListBox x:Name="outputList" />\n</StackPanel>'
    },
    stepCode: [
      '<Window x:Class="App.MainWindow"',
      '        Title="WPF App" Width="520" Height="360">',
      '    <StackPanel Margin="20">',
      '        <TextBox x:Name="inputBox" />',
      '        <Button Content="Process" Click="Process_Click" />',
      '        <TextBlock x:Name="resultText" />',
      '    </StackPanel>',
      '</Window>'
    ],
    steps: [
      { line: 0, text: 'Every WPF window inherits from <code>Window</code>.', tags: ['Window'] },
      { line: 2, text: '<code>StackPanel</code> — simplest layout, stacks children.', tags: ['Layout'] },
      { line: 3, text: '<code>x:Name</code> — gives the control a C# accessible name.', tags: ['Name'] },
      { line: 4, text: '<code>Click="Process_Click"</code> — wires the event to code-behind.', tags: ['Event'] }
    ],
    recap: [
      { title: 'XAML + C#', text: 'Declare UI, code the logic.' },
      { title: 'Layout Panels', text: 'Grid, StackPanel, DockPanel.' },
      { title: 'Data Binding', text: 'Connect UI to ViewModels.' },
      { title: 'Rich Styling', text: 'Full control over appearance.' }
    ]
  }
};

/* ============================================================
   TITLE FROM SLUG
   ============================================================ */
function titleFromSlug(slug) {
  const special = {
    'wpf': 'WPF', 'xaml': 'XAML', 'mvvm': 'MVVM', 'ui': 'UI',
    'gui': 'GUI', 'api': 'API', 'id': 'ID', 'dpi': 'DPI',
    'clr': 'CLR', 'gpu': 'GPU', 'net': '.NET', 'inpc': 'INPC',
    'inotifypropertychanged': 'INotifyPropertyChanged',
    'icommand': 'ICommand', 'dp': 'DP', 'wndproc': 'WndProc',
    '3d': '3D', '2d': '2D', 'theming': 'Theming'
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
      controls: JSON.parse(sub(JSON.stringify(tpl.preview.controls))),
      xaml: sub(tpl.preview.xaml)
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
  const controlsHtml = topic.controls || '';
  const controlsRendered = topic.preview.controls.map(c => {
    const commonStyle = 'left:' + c.x + 'px;top:' + c.y + 'px;';
    const w = c.w ? 'width:' + c.w + 'px;' : '';
    const h = c.h ? 'height:' + c.h + 'px;' : '';
    const pos = 'position:absolute;' + commonStyle + w + h;
    const idAttr = c.id ? ' id="wf-' + c.id + '"' : '';

    switch(c.type){
      case 'textblock':
        const cls = c.style ? 'wf-label wf-label-' + c.style : 'wf-label';
        return '<div' + idAttr + ' class="' + cls + '" style="' + pos + '">' + escapeHtml(c.text) + '</div>';

      case 'textbox':
        return '<input type="text"' + idAttr + ' class="wf-input" style="' + pos + '" placeholder="' + escapeHtml(c.placeholder || '') + '" />';

      case 'button':
        const btnCls = c.style ? 'wf-button wf-button-' + c.style : 'wf-button';
        return '<button type="button"' + idAttr + ' class="' + btnCls + '" style="' + pos + '">' + escapeHtml(c.text) + '</button>';

      case 'checkbox':
        return '<label' + idAttr + ' class="wf-check" style="' + pos + '"><input type="checkbox" /> <span>' + escapeHtml(c.text) + '</span></label>';

      case 'combobox':
        const options = (c.items||[]).map(i => '<option>' + escapeHtml(i) + '</option>').join('');
        return '<select' + idAttr + ' class="wf-combo" style="' + pos + '">' + options + '</select>';

      case 'listbox':
        const items = (c.items||[]).map(i => '<li>' + escapeHtml(i) + '</li>').join('');
        return '<ul' + idAttr + ' class="wf-listbox" style="' + pos + '">' + items + '</ul>';

      case 'progress':
        return '<div' + idAttr + ' class="wf-progress" style="' + pos + '"><div class="wf-progress-fill" style="width:' + (c.value||0) + '%"></div></div>';

      case 'border':
        return '<div' + idAttr + ' class="wf-border" style="' + pos + '"><span class="wf-border-label">' + escapeHtml(c.label||'') + '</span></div>';

      case 'coloredbox':
        return '<div' + idAttr + ' class="wf-coloredbox" style="' + pos + ';background:' + c.color + ';"><span>' + escapeHtml(c.label||'') + '</span></div>';

      case 'animatedbox':
        return '<div' + idAttr + ' class="wf-animbox" style="' + pos + ';"></div>';

      default:
        return '';
    }
  }).join('');

  return '<div class="wf-window">' +
    '<div class="wf-titlebar">' +
      '<div class="wf-titlebar-left">' +
        '<span class="wf-icon">🎨</span>' +
        '<span class="wf-title">' + escapeHtml(topic.preview.title) + ' — WPF</span>' +
      '</div>' +
      '<div class="wf-controls">' +
        '<button class="wf-ctrl" title="Minimize">─</button>' +
        '<button class="wf-ctrl" title="Maximize">□</button>' +
        '<button class="wf-ctrl wf-ctrl-close" title="Close">✕</button>' +
      '</div>' +
    '</div>' +
    '<div class="wf-body">' + controlsRendered + '</div>' +
  '</div>';
}

function renderHTML(topic) {
  const factsHtml = topic.facts.map(f =>
    '<div class="fact"><div class="big">' + escapeHtml(f.big) + '</div><div class="lbl">' + escapeHtml(f.lbl) + '</div></div>'
  ).join('');

  const conceptsHtml = topic.concepts.map((c, i) => {
    const colors = ['#7c3aed,#a78bfa', '#0078d4,#00a4ef', '#ec4899,#f472b6', '#22c55e,#4ade80'];
    const parts = colors[i % colors.length].split(',');
    const c1 = parts[0], c2 = parts[1];
    return '<div class="concept" style="--c1:' + c1 + ';--c2:' + c2 + '">' +
      '<div class="c-ico">' + c.icon + '</div>' +
      '<h3>' + escapeHtml(c.title) + '</h3>' +
      '<p>' + c.desc + '</p>' +
    '</div>';
  }).join('');

  const recapHtml = topic.recap.map((r, i) => {
    const colors = ['#7c3aed', '#0078d4', '#ec4899', '#22c55e'];
    return '<div class="recap" style="--rc:' + colors[i % colors.length] + '">' +
      '<div class="t">' + escapeHtml(r.title) + '</div>' +
      '<div class="d">' + r.text + '</div>' +
    '</div>';
  }).join('');

  const stepCodeHtml = topic.stepCode.map((l, i) =>
    '<div class="step-line" data-line="' + i + '">' + (escapeHtml(l) || ' ') + '</div>'
  ).join('');

  const previewHtml = renderControlsPreview(topic);
  const xamlEscaped = escapeHtml(topic.preview.xaml);
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
'.space-base{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,#1a0a2e 0%,#0a0a20 45%,#05060f 85%),radial-gradient(ellipse at 100% 100%,#0a1a30 0%,transparent 55%)}\n' +
'.orbs{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:.45}\n' +
'.orb{position:absolute;border-radius:50%;filter:blur(90px)}\n' +
'.orb-1{width:520px;height:520px;top:-10%;left:-8%;background:radial-gradient(circle,#7c3aed,transparent 70%);animation:d1 26s ease-in-out infinite}\n' +
'.orb-2{width:460px;height:460px;top:45%;right:-10%;background:radial-gradient(circle,#0078d4,transparent 70%);animation:d2 30s ease-in-out infinite}\n' +
'.orb-3{width:600px;height:600px;bottom:-18%;left:18%;background:radial-gradient(circle,#ec4899,transparent 70%);animation:d3 34s ease-in-out infinite}\n' +
'@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,40px) scale(1.15)}}\n' +
'@keyframes d2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.2)}}\n' +
'@keyframes d3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-60px) scale(1.1)}}\n' +
'.grid-bg{position:fixed;inset:-50%;z-index:2;pointer-events:none;opacity:.22;background-image:linear-gradient(rgba(124,58,237,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.14) 1px,transparent 1px);background-size:80px 80px;transform:perspective(500px) rotateX(60deg);animation:gf 22s linear infinite;mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 50% 50%,black 20%,transparent 70%)}\n' +
'@keyframes gf{from{background-position:0 0}to{background-position:0 80px}}\n' +
'.vig{position:fixed;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.72) 100%)}\n' +
'.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}\n' +
'.container{max-width:1150px;margin:0 auto;padding:0 1.5rem;width:100%}\n' +
'nav{position:sticky;top:0;z-index:100;background:rgba(5,6,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(148,163,184,.08)}\n' +
'.nav-inner{max-width:1150px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}\n' +
'.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1rem;color:#f1f5f9;text-decoration:none}\n' +
'.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#0078d4);display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;box-shadow:0 8px 20px -6px rgba(124,58,237,.6)}\n' +
'.hero{padding:4.5rem 1.5rem 3rem;text-align:center}\n' +
'.tpill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.35);border-radius:999px;padding:.45rem 1.1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c4b5fd;margin-bottom:1.5rem}\n' +
'.tpill .n{background:#7c3aed;color:#fff;min-width:26px;height:22px;border-radius:11px;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:900;padding:0 .4rem}\n' +
'.hero h1{font-size:clamp(1.7rem,4.4vw,2.8rem);font-weight:900;letter-spacing:-.04em;line-height:1.15;margin-bottom:1.2rem}\n' +
'.hero h1 .grad{background:linear-gradient(135deg,#c4b5fd 0%,#7c3aed 45%,#0078d4 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gs 7s ease-in-out infinite}\n' +
'@keyframes gs{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}\n' +
'.hero p{color:#a1a1aa;font-size:1.05rem;max-width:660px;margin:0 auto;line-height:1.7}\n' +
'section{padding:3rem 0}\n' +
'.sec-head{text-align:center;margin-bottom:2.5rem}\n' +
'.stag{display:inline-flex;align-items:center;gap:.5rem;background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.3);border-radius:999px;padding:.4rem 1rem;font-size:.68rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c4b5fd;margin-bottom:1rem}\n' +
'.sec-head h2{font-size:clamp(1.6rem,3.8vw,2.3rem);font-weight:900;letter-spacing:-.03em;line-height:1.15;margin-bottom:.6rem}\n' +
'.sec-head h2 .grad{background:linear-gradient(135deg,#c4b5fd,#0078d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\n' +
'.sec-head p{color:#94a3b8;font-size:.95rem;max-width:620px;margin:0 auto}\n' +
'.facts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:2rem}\n' +
'.fact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:1.05rem 1rem;text-align:center;transition:all .25s}\n' +
'.fact:hover{transform:translateY(-3px);border-color:rgba(124,58,237,.4)}\n' +
'.fact .big{font-size:1.05rem;font-weight:900;background:linear-gradient(135deg,#c4b5fd,#0078d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}\n' +
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
'.code-panel-header .dot{width:8px;height:8px;border-radius:50%;background:#a78bfa;box-shadow:0 0 8px #a78bfa}\n' +
'.code-panel pre{margin:0;padding:1rem 1.2rem;font-family:"JetBrains Mono",monospace;font-size:.8rem;line-height:1.7;color:#e6edf3;overflow-x:auto;white-space:pre}\n' +
'.wf-window{width:520px;max-width:100%;background:#f5f5f5;border-radius:10px;box-shadow:0 30px 60px -20px rgba(0,0,0,.6),0 0 0 1px rgba(124,58,237,.3);overflow:hidden;font-family:"Segoe UI",Tahoma,sans-serif;color:#1a1a1a;user-select:none}\n' +
'.wf-titlebar{background:linear-gradient(180deg,#f0f0f0,#e8e8e8);padding:8px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d0d0d0;font-size:13px}\n' +
'.wf-titlebar-left{display:flex;align-items:center;gap:6px;font-weight:600;color:#1a1a1a}\n' +
'.wf-icon{font-size:12px}\n' +
'.wf-title{font-size:12.5px}\n' +
'.wf-controls{display:flex;gap:2px}\n' +
'.wf-ctrl{background:transparent;border:none;width:32px;height:26px;font-family:"Segoe UI",sans-serif;font-size:11px;color:#444;cursor:pointer;border-radius:4px;transition:background .12s}\n' +
'.wf-ctrl:hover{background:rgba(0,0,0,.06)}\n' +
'.wf-ctrl-close:hover{background:#e81123;color:#fff}\n' +
'.wf-body{position:relative;background:#fff;min-height:340px;background-image:linear-gradient(rgba(124,58,237,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.025) 1px,transparent 1px);background-size:10px 10px}\n' +
'.wf-label{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;color:#1a1a1a;display:flex;align-items:center}\n' +
'.wf-label-title{font-size:18px;font-weight:700;color:#5b21b6}\n' +
'.wf-label-success{color:#0f9d58;font-weight:600}\n' +
'.wf-label-small{font-size:11.5px;color:#666}\n' +
'.wf-label-layer1{background:#7c3aed;color:#fff;padding:0 12px;border-radius:6px;justify-content:center;font-weight:600}\n' +
'.wf-label-layer2{background:#5b21b6;color:#fff;padding:0 12px;border-radius:6px;justify-content:center;font-weight:600}\n' +
'.wf-label-layer3{background:#0078d4;color:#fff;padding:0 12px;border-radius:6px;justify-content:center;font-weight:600}\n' +
'.wf-label-layer4{background:#0ea5e9;color:#fff;padding:0 12px;border-radius:6px;justify-content:center;font-weight:600}\n' +
'.wf-input{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;border:1px solid #c8c8c8;background:#fff;padding:3px 8px;border-radius:4px;color:#1a1a1a;outline:none;transition:border-color .15s,box-shadow .15s}\n' +
'.wf-input::placeholder{color:#999}\n' +
'.wf-input:focus{border-color:#7c3aed;box-shadow:0 0 0 2px rgba(124,58,237,.2)}\n' +
'.wf-button{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;background:linear-gradient(180deg,#fff,#f0f0f0);border:1px solid #d0d0d0;border-radius:6px;cursor:pointer;color:#1a1a1a;padding:0;transition:all .15s;font-weight:500}\n' +
'.wf-button:hover{border-color:#7c3aed;background:linear-gradient(180deg,#faf5ff,#f3e8ff)}\n' +
'.wf-button:active{background:linear-gradient(180deg,#ede9fe,#ddd6fe)}\n' +
'.wf-button-primary{background:linear-gradient(180deg,#8b5cf6,#7c3aed);border-color:#6d28d9;color:#fff;font-weight:600}\n' +
'.wf-button-primary:hover{background:linear-gradient(180deg,#a78bfa,#8b5cf6);border-color:#7c3aed}\n' +
'.wf-button-danger{background:linear-gradient(180deg,#ef4444,#dc2626);border-color:#b91c1c;color:#fff;font-weight:600}\n' +
'.wf-button-success{background:linear-gradient(180deg,#22c55e,#16a34a);border-color:#15803d;color:#fff;font-weight:600}\n' +
'.wf-check,.wf-radio{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;color:#1a1a1a;display:flex;align-items:center;gap:6px;cursor:pointer}\n' +
'.wf-check input,.wf-radio input{cursor:pointer;accent-color:#7c3aed}\n' +
'.wf-combo{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;border:1px solid #c8c8c8;background:#fff;padding:3px 8px;border-radius:4px;color:#1a1a1a;outline:none;cursor:pointer}\n' +
'.wf-listbox{font-family:"Segoe UI",Tahoma,sans-serif;font-size:13px;list-style:none;border:1px solid #c8c8c8;background:#fff;border-radius:6px;overflow-y:auto;margin:0;padding:2px}\n' +
'.wf-listbox li{padding:4px 8px;color:#1a1a1a;border-radius:4px;cursor:default}\n' +
'.wf-listbox li:hover{background:#f3e8ff}\n' +
'.wf-listbox li:not(:last-child){border-bottom:1px solid #f5f5f5}\n' +
'.wf-progress{background:#e6e6e6;border:1px solid #d0d0d0;border-radius:6px;overflow:hidden}\n' +
'.wf-progress-fill{height:100%;background:linear-gradient(180deg,#8b5cf6,#7c3aed);transition:width .3s}\n' +
'.wf-border{border:2px dashed #7c3aed;border-radius:6px;position:relative;background:rgba(124,58,237,.03)}\n' +
'.wf-border-label{position:absolute;top:-10px;left:12px;background:#fff;padding:0 6px;font-size:11px;color:#7c3aed;font-weight:600}\n' +
'.wf-coloredbox{border-radius:6px;display:flex;align-items:flex-end;justify-content:center;color:#fff;font-size:11px;font-weight:700;padding:6px;text-shadow:0 1px 2px rgba(0,0,0,.3)}\n' +
'.wf-animbox{background:linear-gradient(135deg,#7c3aed,#0078d4);border-radius:12px;box-shadow:0 10px 24px -6px rgba(124,58,237,.6)}\n' +
'.step-viz{margin-top:1.2rem;background:#0d1117;border-radius:16px;border:1px solid rgba(148,163,184,.15);overflow:hidden}\n' +
'.step-header{padding:.7rem 1.2rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}\n' +
'.step-header .title{font-size:.8rem;color:#8b949e;font-family:"JetBrains Mono",monospace}\n' +
'.step-controls{display:flex;gap:.4rem}\n' +
'.step-btn{background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3);color:#c4b5fd;border-radius:8px;padding:.35rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}\n' +
'.step-btn:hover:not(:disabled){background:rgba(124,58,237,.3)}\n' +
'.step-btn:disabled{opacity:.35;cursor:not-allowed}\n' +
'.step-body{display:grid;grid-template-columns:1.2fr 1fr}\n' +
'@media(max-width:800px){.step-body{grid-template-columns:1fr}}\n' +
'.step-code{padding:1rem 1.2rem;font-family:"JetBrains Mono",monospace;font-size:.82rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1);overflow-x:auto}\n' +
'@media(max-width:800px){.step-code{border-right:none;border-bottom:1px solid rgba(148,163,184,.1)}}\n' +
'.step-line{padding:.15rem .5rem;border-radius:5px;transition:background .3s;white-space:pre}\n' +
'.step-line.active{background:rgba(124,58,237,.18);box-shadow:inset 3px 0 0 #7c3aed;color:#fff}\n' +
'.step-info{padding:1.1rem 1.3rem;background:rgba(30,41,59,.4)}\n' +
'.explain{font-size:.85rem;color:#cbd5e1;min-height:4rem;margin-bottom:.9rem;line-height:1.6}\n' +
'.explain code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .4rem;border-radius:4px;font-family:"JetBrains Mono",monospace;font-size:.82em}\n' +
'.tag-list{display:flex;flex-wrap:wrap;gap:.35rem}\n' +
'.tag{background:rgba(196,181,253,.15);border:1px solid rgba(196,181,253,.3);color:#c4b5fd;border-radius:6px;padding:.25rem .65rem;font-size:.7rem;font-family:"JetBrains Mono",monospace;font-weight:600}\n' +
'.step-progress{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}\n' +
'.bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}\n' +
'.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#7c3aed,#0078d4);border-radius:999px;transition:width .35s}\n' +
'.count{font-size:.72rem;color:#64748b;font-family:"JetBrains Mono",monospace;min-width:3.5rem;text-align:right}\n' +
'.recap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.9rem;margin-top:1.2rem}\n' +
'.recap{background:rgba(30,41,59,.6);border-radius:14px;padding:1.1rem 1.2rem;border-left:3px solid var(--rc,#7c3aed)}\n' +
'.recap .t{font-size:.72rem;font-weight:800;color:var(--rc,#7c3aed);text-transform:uppercase;letter-spacing:.08em}\n' +
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
'      <a href="#" class="brand"><div class="brand-mark">🎨</div> WPF Series</a>\n' +
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
'        <p>This is a real interactive mockup of a WPF window. Click, type, and explore.</p>\n' +
'      </div>\n' +
'      <div class="preview-stage reveal">\n' +
'        <div class="preview-panel">' + previewHtml + '</div>\n' +
'        <div class="code-panel">\n' +
'          <div class="code-panel-header"><span class="dot"></span> MainWindow.xaml</div>\n' +
'          <pre>' + xamlEscaped + '</pre>\n' +
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
'          <span class="title">MainWindow.xaml</span>\n' +
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
'    <p>🎨 ' + escapeHtml(topic.title) + ' · WPF Series</p>\n' +
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
'  var bind = document.querySelector("#wf-bindInput");\n' +
'  if(bind){\n' +
'    bind.addEventListener("input", function(){\n' +
'      var out = document.querySelector("#wf-bindOutput");\n' +
'      if(out) out.textContent = bind.value || "(nothing yet)";\n' +
'    });\n' +
'  }\n' +
'  var cmd = document.querySelector("#wf-cmdInput");\n' +
'  if(cmd){\n' +
'    cmd.addEventListener("input", function(){\n' +
'      var btn = document.querySelector("#wf-cmdBtn");\n' +
'      if(btn) btn.style.opacity = cmd.value.length >= 3 ? "1" : "0.5";\n' +
'    });\n' +
'  }\n' +
'})();\n' +
'\n' +
'function handleButtonClick(id){\n' +
'  switch(id){\n' +
'    case "greetBtn": {\n' +
'      var input = document.querySelector("#wf-nameInput");\n' +
'      var result = document.querySelector("#wf-result");\n' +
'      if(!input || !result) return;\n' +
'      var name = input.value.trim();\n' +
'      if(!name){ result.textContent = "Please enter a name."; result.style.color = "#c0392b"; }\n' +
'      else { result.textContent = "Hello, " + name + "! Welcome to WPF."; result.style.color = "#0f9d58"; }\n' +
'      break;\n' +
'    }\n' +
'    case "themeBtn": {\n' +
'      var win = document.querySelector(".wf-window");\n' +
'      if(!win) return;\n' +
'      var dark = win.dataset.dark === "1";\n' +
'      win.dataset.dark = dark ? "0" : "1";\n' +
'      win.style.background = dark ? "#f5f5f5" : "#1e1e2e";\n' +
'      var body = win.querySelector(".wf-body");\n' +
'      if(body) body.style.background = dark ? "#ffffff" : "#252540";\n' +
'      break;\n' +
'    }\n' +
'    case "animBtn": {\n' +
'      var result2 = document.querySelector("#wf-result");\n' +
'      if(result2){ result2.textContent = "Animation would play here"; result2.style.color = "#7c3aed"; }\n' +
'      break;\n' +
'    }\n' +
'    case "clearBind": {\n' +
'      var bind = document.querySelector("#wf-bindInput");\n' +
'      if(bind){ bind.value = ""; bind.dispatchEvent(new Event("input")); }\n' +
'      break;\n' +
'    }\n' +
'    case "cmdBtn": {\n' +
'      var input = document.querySelector("#wf-cmdInput");\n' +
'      var result3 = document.querySelector("#wf-cmdResult");\n' +
'      if(!input || !result3) return;\n' +
'      var v = input.value.trim();\n' +
'      if(v.length < 3){ result3.textContent = "Command cannot execute — min 3 chars"; result3.style.color = "#c0392b"; }\n' +
'      else { result3.textContent = "Command executed: " + v; result3.style.color = "#0f9d58"; }\n' +
'      break;\n' +
'    }\n' +
'    case "cmdReset": {\n' +
'      var input2 = document.querySelector("#wf-cmdInput");\n' +
'      var result4 = document.querySelector("#wf-cmdResult");\n' +
'      if(input2) input2.value = "";\n' +
'      if(result4) result4.textContent = "";\n' +
'      break;\n' +
'    }\n' +
'    case "playAnim": {\n' +
'      var box = document.querySelector("#wf-animBox");\n' +
'      if(!box) return;\n' +
'      var state = 0;\n' +
'      var iv = setInterval(function(){\n' +
'        state++;\n' +
'        box.style.transition = "left .4s ease-in-out, transform .4s ease-in-out";\n' +
'        if(state % 4 === 1) box.style.left = "380px";\n' +
'        if(state % 4 === 2) { box.style.left = "380px"; box.style.transform = "rotate(180deg)"; }\n' +
'        if(state % 4 === 3) { box.style.left = "24px"; box.style.transform = "rotate(180deg)"; }\n' +
'        if(state % 4 === 0) { box.style.left = "24px"; box.style.transform = "rotate(0deg)"; clearInterval(iv); }\n' +
'      }, 500);\n' +
'      break;\n' +
'    }\n' +
'    case "fadeAnim": {\n' +
'      var box2 = document.querySelector("#wf-animBox");\n' +
'      if(!box2) return;\n' +
'      box2.style.transition = "opacity .5s";\n' +
'      box2.style.opacity = box2.style.opacity === "0.3" ? "1" : "0.3";\n' +
'      break;\n' +
'    }\n' +
'    case "rotateAnim": {\n' +
'      var box3 = document.querySelector("#wf-animBox");\n' +
'      if(!box3) return;\n' +
'      box3.style.transition = "transform .5s ease-in-out";\n' +
'      var current = box3.style.transform || "rotate(0deg)";\n' +
'      var match = current.match(/rotate\\((\\d+)/);\n' +
'      var deg = match ? parseInt(match[1]) + 90 : 90;\n' +
'      box3.style.transform = "rotate(" + deg + "deg)";\n' +
'      break;\n' +
'    }\n' +
'    case "changeTheme": {\n' +
'      var colors = ["#0078d4", "#8661c5", "#22c55e", "#f59e0b", "#ec4899"];\n' +
'      var idx = Math.floor(Math.random() * colors.length);\n' +
'      document.querySelectorAll(".wf-coloredbox").forEach(function(el, i){\n' +
'        el.style.background = colors[(idx + i) % colors.length];\n' +
'      });\n' +
'      break;\n' +
'    }\n' +
'    case "cbtn": {\n' +
'      var list = document.querySelector("#wf-clist");\n' +
'      if(list){\n' +
'        var li = document.createElement("li");\n' +
'        li.textContent = "Clicked at " + new Date().toLocaleTimeString();\n' +
'        list.appendChild(li);\n' +
'      }\n' +
'      break;\n' +
'    }\n' +
'    case "genBtn": {\n' +
'      var pin = document.querySelector("#wf-genInput");\n' +
'      var pout = document.querySelector("#wf-genResult");\n' +
'      var plist = document.querySelector("#wf-genList");\n' +
'      if(!pin || !pout) return;\n' +
'      var v2 = pin.value.trim();\n' +
'      if(!v2){ pout.textContent = "Please enter something."; pout.style.color = "#c0392b"; }\n' +
'      else {\n' +
'        pout.textContent = "Processed: " + v2;\n' +
'        pout.style.color = "#0f9d58";\n' +
'        if(plist){\n' +
'          var li2 = document.createElement("li");\n' +
'          li2.textContent = "[" + new Date().toLocaleTimeString() + "] " + v2;\n' +
'          plist.appendChild(li2);\n' +
'        }\n' +
'      }\n' +
'      break;\n' +
'    }\n' +
'  }\n' +
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

console.log('\n🎨 Found ' + folders.length + ' WPF topic folders.\n');

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