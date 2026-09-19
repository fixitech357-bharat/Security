/* ============================================================
   Content-Only Updater — with auto-fallback for any topic
   Keeps header/footer/nav. Only replaces the <p> content.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP = ['node_modules', '.git', '.vscode', 'assets'];

/* ============================================================
   HAND-WRITTEN TOPIC DATA (day-01 topics)
   ============================================================ */
var TOPICS = {
  'introduction-to-computers': {
    simple: 'A computer is an electronic machine that takes input, processes it, stores it, and gives output.',
    analogy: 'Like a chef: you give ingredients (input), the chef cooks (processing), stores leftovers (storage), and serves a dish (output).',
    svg: 'computer',
    flow: ['INPUT', 'PROCESS', 'STORE', 'OUTPUT'],
    facts: [{big:'4',lbl:'Core Functions'},{big:'1940s',lbl:'First Computers'},{big:'2 Types',lbl:'Analog & Digital'},{big:'100%',lbl:'Electronic'},{big:'24/7',lbl:'Runs'}],
    sections: [
      { title: 'What is a Computer?', text: 'An electronic device that accepts data, processes it, stores results, and displays output.' },
      { title: 'The Four Core Functions', text: 'Every computer does: Input, Processing, Storage, Output.' },
      { title: 'Why Computers Matter', text: 'They run hospitals, banks, cars, and phones.' },
      { title: 'Simple Example', text: 'Type "Hello" — keyboard sends letters, CPU processes, RAM stores, monitor shows.' }
    ]
  },
  'what-is-a-computer': {
    simple: 'A programmable machine. You give it instructions, it follows them exactly, and returns results.',
    analogy: 'Like a very obedient robot — does exactly what you tell it.',
    svg: 'question',
    flow: ['INSTRUCTION', 'FOLLOW', 'RESULT'],
    facts: [{big:'Programmable',lbl:'Nature'},{big:'Binary',lbl:'Language'},{big:'1B+',lbl:'Ops/sec'},{big:'Everywhere',lbl:'Today'},{big:'GIGO',lbl:'Rule'}],
    sections: [
      { title: 'Programmable Machine', text: 'Unlike a calculator, computers can be reprogrammed to do anything.' },
      { title: 'Talks in Binary', text: 'Computers understand only ON (1) and OFF (0).' },
      { title: 'Extremely Fast', text: 'Modern CPU does over a billion operations per second.' },
      { title: 'Follows Blindly', text: 'A computer never questions you. It does what it is told.' }
    ]
  },
  'characteristics-of-computers': {
    simple: 'Computers are fast, accurate, tireless, versatile, and can store huge data. But they lack common sense.',
    analogy: 'Like a super-fast worker who works 24/7, never complains — but has zero common sense.',
    svg: 'characteristics',
    flow: ['SPEED', 'ACCURACY', 'DILIGENCE', 'VERSATILITY', 'STORAGE'],
    facts: [{big:'1B+',lbl:'Ops/sec'},{big:'100%',lbl:'Accuracy'},{big:'24/7',lbl:'Works'},{big:'TB-scale',lbl:'Memory'},{big:'0',lbl:'Common Sense'}],
    sections: [
      { title: 'Speed', text: 'Billions of calculations per second.' },
      { title: 'Accuracy', text: 'No mistakes in calculations.' },
      { title: 'Diligence', text: 'Never gets bored or tired.' },
      { title: 'Versatility', text: 'Same machine, many tasks.' },
      { title: 'Storage', text: 'Terabytes of data.' },
      { title: 'No Intelligence', text: 'Only follows instructions.' }
    ]
  },
  'evolution-of-computers': {
    simple: 'Computers evolved through five generations — from room-sized vacuum tubes to pocket devices.',
    analogy: 'Like a baby growing into an adult in 80 years.',
    svg: 'evolution',
    flow: ['VACUUM', 'TRANSISTOR', 'IC', 'MICRO', 'AI'],
    facts: [{big:'5',lbl:'Generations'},{big:'1940',lbl:'ENIAC'},{big:'27 tons',lbl:'First Size'},{big:'1.5 GB',lbl:'Phone'},{big:'AI',lbl:'Now'}],
    sections: [
      { title: 'Gen 1 (1940-1956)', text: 'Vacuum tubes. ENIAC weighed 27 tons.' },
      { title: 'Gen 2 (1956-1963)', text: 'Transistors. Smaller, faster.' },
      { title: 'Gen 3 (1964-1971)', text: 'ICs. Keyboards and monitors.' },
      { title: 'Gen 4 (1971-Present)', text: 'Microprocessors. PCs and smartphones.' },
      { title: 'Gen 5 (Present)', text: 'AI, ML, quantum computing.' }
    ]
  },
  'generations-of-computers': {
    simple: 'Each generation: smaller, faster, cheaper, more reliable.',
    analogy: 'Like phone evolution from bricks to smartwatches.',
    svg: 'generations',
    flow: ['GEN 1', 'GEN 2', 'GEN 3', 'GEN 4', 'GEN 5'],
    facts: [{big:'Vacuum',lbl:'Gen 1'},{big:'Transistor',lbl:'Gen 2'},{big:'IC',lbl:'Gen 3'},{big:'Micro',lbl:'Gen 4'},{big:'AI',lbl:'Gen 5'}],
    sections: [
      { title: 'Gen 1: Vacuum Tubes', text: 'Room-sized. ENIAC, UNIVAC.' },
      { title: 'Gen 2: Transistors', text: '100x smaller and faster.' },
      { title: 'Gen 3: ICs', text: 'Chips. UNIX was born.' },
      { title: 'Gen 4: Microprocessors', text: 'Personal computers.' },
      { title: 'Gen 5: AI', text: 'Artificial intelligence.' }
    ]
  },
  'types-of-computers': {
    simple: 'Computers come in sizes: super, mainframe, mini, micro, embedded.',
    analogy: 'Like vehicles: trucks, buses, cars, bikes.',
    svg: 'types',
    flow: ['SUPER', 'MAIN', 'MINI', 'MICRO', 'EMBED'],
    facts: [{big:'Super',lbl:'Fastest'},{big:'Main',lbl:'Bulk'},{big:'Mini',lbl:'Mid'},{big:'Micro',lbl:'Personal'},{big:'Embed',lbl:'Hidden'}],
    sections: [
      { title: 'Supercomputers', text: 'Weather, drug discovery.' },
      { title: 'Mainframes', text: 'Banks, airlines.' },
      { title: 'Minicomputers', text: 'Departments. Now servers.' },
      { title: 'Microcomputers', text: 'Desktops, laptops, phones.' },
      { title: 'Embedded', text: 'Washing machines, cars, ATMs.' }
    ]
  },
  'desktop-vs-laptop': {
    simple: 'Desktops: powerful, upgradeable, fixed. Laptops: portable, compact.',
    analogy: 'Desktop = house. Laptop = car.',
    svg: 'desktop-laptop',
    flow: ['PRIORITY', 'POWER/PORT', 'BUDGET', 'CHOOSE'],
    facts: [{big:'Desktop',lbl:'Power'},{big:'Laptop',lbl:'Portable'},{big:'Desktop',lbl:'Upgradeable'},{big:'Laptop',lbl:'Compact'},{big:'Both',lbl:'Multi-OS'}],
    sections: [
      { title: 'Desktop Strengths', text: 'Power, upgradeable, larger screens.' },
      { title: 'Laptop Strengths', text: 'Portable, battery, compact.' },
      { title: 'When Desktop', text: 'Gaming, editing, development.' },
      { title: 'When Laptop', text: 'Students, travelers, office.' }
    ]
  },
  'workstations': {
    simple: 'High-performance computers for technical work — 3D, CAD, video editing.',
    analogy: 'Like a sports car: powerful, built for a specific purpose.',
    svg: 'workstation',
    flow: ['TASK', 'PERF NEED', 'WORKSTATION', 'RESULT'],
    facts: [{big:'GPU',lbl:'Heavy Use'},{big:'ECC',lbl:'RAM'},{big:'Xeon',lbl:'CPU'},{big:'$2K+',lbl:'Cost'},{big:'3D/AI',lbl:'Uses'}],
    sections: [
      { title: 'What is a Workstation?', text: 'High-end tuned for reliability.' },
      { title: 'vs Desktop', text: 'ECC memory, pro GPUs, Xeon CPUs.' },
      { title: 'Common Uses', text: '3D, video, CAD, simulation.' },
      { title: 'Examples', text: 'Pixar, NASA, hospitals.' }
    ]
  },
  'cpu': {
    simple: 'The CPU is the brain. Fetches, decodes, executes instructions — billions of times per second.',
    analogy: 'Like a chef: takes orders, reads recipe, cooks.',
    svg: 'cpu',
    flow: ['FETCH', 'DECODE', 'EXECUTE', 'STORE'],
    facts: [{big:'1B+',lbl:'Ops/sec'},{big:'Cores',lbl:'Multiple'},{big:'GHz',lbl:'Speed'},{big:'Cache',lbl:'Fast'},{big:'Intel/AMD',lbl:'Makers'}],
    sections: [
      { title: 'What is a CPU?', text: 'Executes all instructions.' },
      { title: 'Fetch-Decode-Execute', text: '4-step cycle, billions/sec.' },
      { title: 'Components', text: 'ALU, CU, Registers, Cache.' },
      { title: 'Cores & Threads', text: 'Multiple cores = parallel tasks.' },
      { title: 'Analogy', text: 'A chef in a kitchen.' }
    ]
  },
  'alu': {
    simple: 'The ALU performs math (add, subtract) and logic (compare, AND, OR) inside the CPU.',
    analogy: 'Like a pocket calculator: give numbers + operation, get answer.',
    svg: 'alu',
    flow: ['INPUT A', 'INPUT B', 'OPERATION', 'RESULT'],
    facts: [{big:'Math',lbl:'Arithmetic'},{big:'Logic',lbl:'Boolean'},{big:'Fast',lbl:'Instant'},{big:'In CPU',lbl:'Location'},{big:'Bits',lbl:'Operates'}],
    sections: [
      { title: 'What is the ALU?', text: 'Arithmetic Logic Unit — math and logic.' },
      { title: 'Arithmetic', text: '+ - × ÷ increment decrement.' },
      { title: 'Logic', text: 'AND, OR, NOT, XOR, compare.' },
      { title: 'How It Works', text: 'Two inputs + opcode = result + flags.' },
      { title: 'Example', text: '5 + 3 in a spreadsheet.' }
    ]
  },
  'control-unit': {
    simple: 'The Control Unit directs all operations inside the CPU.',
    analogy: 'Like an orchestra conductor: doesn\'t play, tells others when.',
    svg: 'control-unit',
    flow: ['READ', 'DECODE', 'SIGNAL', 'COORDINATE'],
    facts: [{big:'CU',lbl:'Short Form'},{big:'Directs',lbl:'Role'},{big:'In CPU',lbl:'Location'},{big:'Signals',lbl:'Uses'},{big:'Timing',lbl:'Critical'}],
    sections: [
      { title: 'What is CU?', text: 'Coordinates all CPU components.' },
      { title: 'Traffic Direction', text: 'Reads, decodes, signals.' },
      { title: 'Timing', text: 'Works on clock cycles.' },
      { title: 'Analogy', text: 'Factory floor manager.' }
    ]
  },
  'registers': {
    simple: 'Registers are tiny CPU storage locations — fastest memory in the computer.',
    analogy: 'Like shirt pockets: hold what you use right now.',
    svg: 'registers',
    flow: ['LOAD', 'PROCESS', 'STORE', 'REPEAT'],
    facts: [{big:'Bytes',lbl:'Tiny'},{big:'Fastest',lbl:'Speed'},{big:'32/64',lbl:'Bit'},{big:'In CPU',lbl:'Location'},{big:'Handful',lbl:'Count'}],
    sections: [
      { title: 'What Are Registers?', text: 'Small storage inside the CPU.' },
      { title: 'Common', text: 'Accumulator, PC, IR, SP.' },
      { title: 'Why They Matter', text: 'Access in under 1 nanosecond.' },
      { title: 'Analogy', text: 'Brain holds few numbers at once.' }
    ]
  },
  'cache-memory': {
    simple: 'Cache is small, super-fast memory that holds frequently-used data.',
    analogy: 'Snacks on your desk vs walking to the kitchen.',
    svg: 'cache',
    flow: ['CPU ASKS', 'CHECK', 'HIT', 'MISS → RAM'],
    facts: [{big:'L1',lbl:'Fastest'},{big:'L2',lbl:'Medium'},{big:'L3',lbl:'Largest'},{big:'KB-MB',lbl:'Size'},{big:'10x',lbl:'Speedup'}],
    sections: [
      { title: 'What is Cache?', text: 'Between CPU and RAM. Extremely fast.' },
      { title: 'Levels', text: 'L1 fastest, L2 medium, L3 largest.' },
      { title: 'Hit vs Miss', text: 'Hit = found. Miss = fetch from RAM.' },
      { title: 'Why It Matters', text: '10-100x speedup on real work.' }
    ]
  },
  'ram': {
    simple: 'RAM holds data being used right now. Fast but temporary — cleared at power off.',
    analogy: 'Your work desk: holds current task, cleared when you leave.',
    svg: 'ram',
    flow: ['OPEN', 'LOAD', 'WORK', 'FREE'],
    facts: [{big:'Volatile',lbl:'Temporary'},{big:'8-32 GB',lbl:'Modern'},{big:'DDR4/5',lbl:'Types'},{big:'GB/s',lbl:'Speed'},{big:'Faster',lbl:'Than Disk'}],
    sections: [
      { title: 'What is RAM?', text: 'Short-term memory. Volatile.' },
      { title: 'Volatile', text: 'Loses data at power off.' },
      { title: 'How Much?', text: '8 GB basic, 16 GB gaming, 32 GB+ work.' },
      { title: 'Analogy', text: 'Your desk.' }
    ]
  },
  'rom': {
    simple: 'ROM holds permanent instructions — like BIOS. Keeps contents without power.',
    analogy: 'Like a printed book: read, cannot rewrite.',
    svg: 'rom',
    flow: ['ON', 'READ', 'BOOT', 'START'],
    facts: [{big:'Non-Vol',lbl:'Permanent'},{big:'Read-Only',lbl:'Normally'},{big:'BIOS',lbl:'Stores'},{big:'Tiny',lbl:'Size'},{big:'Essential',lbl:'Boot'}],
    sections: [
      { title: 'What is ROM?', text: 'Permanent boot instructions.' },
      { title: 'What It Stores', text: 'BIOS/UEFI firmware.' },
      { title: 'Types', text: 'PROM, EPROM, EEPROM, Flash.' },
      { title: 'Analogy', text: 'Printed recipe book.' }
    ]
  },
  'motherboard': {
    simple: 'The main circuit board that connects all components together.',
    analogy: 'Like a highway system: every city connects via roads.',
    svg: 'motherboard',
    flow: ['CPU', 'RAM', 'PCIe', 'STORAGE', 'I/O'],
    facts: [{big:'ATX',lbl:'Sizes'},{big:'PCB',lbl:'Material'},{big:'Chipset',lbl:'Traffic'},{big:'BIOS',lbl:'Firmware'},{big:'All',lbl:'Connects'}],
    sections: [
      { title: 'What is it?', text: 'Main PCB in a computer.' },
      { title: 'Key Parts', text: 'CPU socket, RAM, PCIe, chipset.' },
      { title: 'Chipset', text: 'Handles communication.' },
      { title: 'Form Factors', text: 'ATX, mATX, ITX.' }
    ]
  },
  'hard-disk': {
    simple: 'HDD stores data on spinning magnetic disks. Cheaper than SSD but slower.',
    analogy: 'Like a vinyl record player.',
    svg: 'hdd',
    flow: ['SPIN', 'HEAD', 'READ/WRITE', 'STORE'],
    facts: [{big:'5400-7200',lbl:'RPM'},{big:'1-20 TB',lbl:'Size'},{big:'Mechanical',lbl:'Type'},{big:'Cheap',lbl:'Per GB'},{big:'Fragile',lbl:'If Dropped'}],
    sections: [
      { title: 'What is an HDD?', text: 'Spinning magnetic platters.' },
      { title: 'How It Works', text: 'Head reads magnetic patterns.' },
      { title: 'Pros/Cons', text: 'Cheap, huge — but slower.' },
      { title: 'Modern', text: 'Backups only now.' }
    ]
  },
  'ssd': {
    simple: 'SSD stores data in flash memory chips — no moving parts, much faster than HDD.',
    analogy: 'Like a USB stick but much bigger.',
    svg: 'ssd',
    flow: ['RECEIVE', 'CELLS', 'WRITE', 'READ'],
    facts: [{big:'5-10x',lbl:'Faster'},{big:'250GB-4TB',lbl:'Sizes'},{big:'Silent',lbl:'No Noise'},{big:'Durable',lbl:'No Parts'},{big:'NVMe',lbl:'Modern'}],
    sections: [
      { title: 'What is SSD?', text: 'Flash memory chips.' },
      { title: 'Why Faster?', text: 'Microseconds vs milliseconds.' },
      { title: 'Types', text: 'SATA, NVMe, M.2.' },
      { title: 'Impact', text: 'Boot time 60s → 8s.' }
    ]
  },
  'storage-devices': {
    simple: 'Storage keeps data safe — HDDs, SSDs, USB, SD, cloud.',
    analogy: 'Warehouse, safe, wallet, locker.',
    svg: 'storage',
    flow: ['PRIMARY', 'SECONDARY', 'PORTABLE', 'CLOUD'],
    facts: [{big:'Primary',lbl:'OS+Apps'},{big:'Secondary',lbl:'Bulk'},{big:'Portable',lbl:'USB/SD'},{big:'Cloud',lbl:'Anywhere'},{big:'3-2-1',lbl:'Backup'}],
    sections: [
      { title: 'Primary', text: 'Main drive with OS.' },
      { title: 'Secondary', text: 'Bulk storage.' },
      { title: 'Portable', text: 'USB, external, SD.' },
      { title: 'Cloud', text: 'Google Drive, OneDrive.' },
      { title: '3-2-1 Rule', text: '3 copies, 2 media, 1 offsite.' }
    ]
  },
  'input-devices': {
    simple: 'Input devices send data to the computer — keyboard, mouse, mic, camera.',
    analogy: 'Your five senses.',
    svg: 'input',
    flow: ['ACTION', 'CONVERT', 'TO CPU', 'REACT'],
    facts: [{big:'Keyboard',lbl:'Text'},{big:'Mouse',lbl:'Point'},{big:'Mic',lbl:'Voice'},{big:'Camera',lbl:'Visual'},{big:'Scanner',lbl:'Docs'}],
    sections: [
      { title: 'What Are They?', text: 'Collect data from outside.' },
      { title: 'Common', text: 'Keyboard, mouse, touch, mic, webcam.' },
      { title: 'Specialized', text: 'Barcode, fingerprint, joystick.' },
      { title: 'How', text: 'Convert action to digital signals.' }
    ]
  },
  'output-devices': {
    simple: 'Output devices display results — monitors, speakers, printers.',
    analogy: 'Your voice and expressions.',
    svg: 'output',
    flow: ['CPU', 'SIGNAL', 'CONVERT', 'SEE/HEAR'],
    facts: [{big:'Monitor',lbl:'Visual'},{big:'Speakers',lbl:'Audio'},{big:'Printer',lbl:'Paper'},{big:'Projector',lbl:'Big'},{big:'Haptics',lbl:'Touch'}],
    sections: [
      { title: 'What Are They?', text: 'Present processed data.' },
      { title: 'Common', text: 'Monitors, speakers, printers.' },
      { title: 'Monitor Types', text: 'LCD, LED, OLED, QLED.' },
      { title: 'Example', text: 'Movie: CPU → monitor → pixels.' }
    ]
  },
  'hardware-vs-software': {
    simple: 'Hardware is physical. Software is instructions. Both needed.',
    analogy: 'Body and soul.',
    svg: 'hw-sw',
    flow: ['HARDWARE', 'SOFTWARE', 'TOGETHER', 'RESULT'],
    facts: [{big:'HW',lbl:'Physical'},{big:'SW',lbl:'Logical'},{big:'Both',lbl:'Essential'},{big:'Touch',lbl:'HW Yes'},{big:'Code',lbl:'SW Only'}],
    sections: [
      { title: 'Hardware', text: 'CPU, RAM, HDD, monitor.' },
      { title: 'Software', text: 'OS, apps, browsers.' },
      { title: 'Together', text: 'SW tells HW what to do.' },
      { title: 'Examples', text: 'i7 + 16GB + Windows 11.' }
    ]
  },
  'application-software': {
    simple: 'Programs for specific tasks — writing, photos, browsing, games.',
    analogy: 'Tools in a toolbox.',
    svg: 'application',
    flow: ['OPEN', 'LOAD', 'WORK', 'DONE'],
    facts: [{big:'Apps',lbl:'Name'},{big:'Specific',lbl:'Purpose'},{big:'Many',lbl:'Types'},{big:'User',lbl:'Facing'},{big:'Optional',lbl:'Not Required'}],
    sections: [
      { title: 'What is it?', text: 'Programs for end users.' },
      { title: 'Categories', text: 'Productivity, Multimedia, Communication.' },
      { title: 'Installed vs Web', text: 'On your PC vs in browser.' },
      { title: 'Examples', text: 'WhatsApp, Chrome, Word.' }
    ]
  },
  'system-software': {
    simple: 'Manages the computer itself — OS, drivers, utilities, BIOS.',
    analogy: 'The government of a country.',
    svg: 'system',
    flow: ['BIOS', 'OS', 'DRIVERS', 'APPS'],
    facts: [{big:'OS',lbl:'Main'},{big:'Drivers',lbl:'HW Talk'},{big:'Utilities',lbl:'Maintenance'},{big:'BG',lbl:'Invisible'},{big:'Essential',lbl:'Required'}],
    sections: [
      { title: 'What is it?', text: 'Manages hardware + platform for apps.' },
      { title: 'OS', text: 'Windows, macOS, Linux.' },
      { title: 'Drivers', text: 'Talk to hardware.' },
      { title: 'Utilities', text: 'Antivirus, cleaner.' }
    ]
  },
  'operating-systems': {
    simple: 'OS manages all hardware and software — files, memory, processes, users.',
    analogy: 'Hotel manager.',
    svg: 'os',
    flow: ['ON', 'BIOS', 'OS', 'LOGIN', 'APPS'],
    facts: [{big:'Windows',lbl:'Most Used'},{big:'macOS',lbl:'Apple'},{big:'Linux',lbl:'Open'},{big:'Mobile',lbl:'Android/iOS'},{big:'Kernel',lbl:'Core'}],
    sections: [
      { title: 'What is OS?', text: 'Bridge between user and machine.' },
      { title: 'Functions', text: 'Process, memory, file, device.' },
      { title: 'Popular', text: 'Windows, macOS, Linux.' },
      { title: 'Boot', text: 'BIOS → kernel → login.' }
    ]
  },
  'open-source-vs-proprietary-software': {
    simple: 'Open source: public code. Proprietary: private code.',
    analogy: 'Public library vs private collection.',
    svg: 'open-source',
    flow: ['OPEN', 'COMMUNITY', 'USE', 'FREE/PAID'],
    facts: [{big:'Linux',lbl:'Open'},{big:'Windows',lbl:'Proprietary'},{big:'Free',lbl:'OSS'},{big:'Paid',lbl:'Proprietary'},{big:'Both',lbl:'Pros'}],
    sections: [
      { title: 'Open Source', text: 'Code public. Modify freely.' },
      { title: 'Proprietary', text: 'Code private. Owner only.' },
      { title: 'Examples', text: 'Linux vs Windows.' },
      { title: 'Pros/Cons', text: 'Flexible vs polished.' }
    ]
  },
  'device-drivers': {
    simple: 'Small programs that let OS talk to hardware.',
    analogy: 'Translator between two languages.',
    svg: 'driver',
    flow: ['OS', 'DRIVER', 'HW', 'RESULT'],
    facts: [{big:'Small',lbl:'Size'},{big:'Specific',lbl:'Per Device'},{big:'BG',lbl:'Runs'},{big:'Auto',lbl:'Plug&Play'},{big:'Critical',lbl:'Needed'}],
    sections: [
      { title: 'What is a Driver?', text: 'Translates OS commands to hardware.' },
      { title: 'Why?', text: 'Every device has its own commands.' },
      { title: 'Examples', text: 'Graphics, printer, WiFi.' },
      { title: 'Missing?', text: 'No sound, no WiFi, low res.' }
    ]
  },
  'firmware': {
    simple: 'Software permanently on a chip. Runs before OS.',
    analogy: 'Starter motor in a car.',
    svg: 'firmware',
    flow: ['ON', 'FW', 'CHECK', 'OS'],
    facts: [{big:'BIOS/UEFI',lbl:'Example'},{big:'Chip',lbl:'Stored'},{big:'First',lbl:'At Boot'},{big:'Rare',lbl:'Changes'},{big:'Essential',lbl:'Boot'}],
    sections: [
      { title: 'What is Firmware?', text: 'Permanent software in ROM/flash.' },
      { title: 'Where?', text: 'BIOS, routers, printers, TVs.' },
      { title: 'BIOS vs UEFI', text: 'UEFI is modern — faster, Secure Boot.' },
      { title: 'Updating', text: 'Flashing. Risky.' }
    ]
  },
  'explore-windows-linux-basic-system-settings': {
    simple: 'Learn where key settings live in Windows and Linux.',
    analogy: 'Control panel in a car.',
    svg: 'settings',
    flow: ['OPEN', 'CATEGORY', 'ADJUST', 'APPLY'],
    facts: [{big:'Windows+I',lbl:'Shortcut'},{big:'Linux',lbl:'System Settings'},{big:'Same',lbl:'Concepts'},{big:'GUI',lbl:'Easy'},{big:'CLI',lbl:'Powerful'}],
    sections: [
      { title: 'Windows', text: 'Windows + I opens Settings.' },
      { title: 'Linux', text: 'System Settings or terminal.' },
      { title: 'Common', text: 'Wallpaper, WiFi, users, updates.' },
      { title: 'CLI', text: 'PowerShell (Win), Bash (Linux).' }
    ]
  },
  'identify-computer-components': {
    simple: 'Learn to recognize parts inside a computer.',
    analogy: 'Parts of a car engine.',
    svg: 'components',
    flow: ['OPEN', 'IDENTIFY', 'UNDERSTAND', 'UPGRADE'],
    facts: [{big:'CPU',lbl:'Brain'},{big:'RAM',lbl:'Desk'},{big:'SSD',lbl:'Cabinet'},{big:'PSU',lbl:'Power'},{big:'GPU',lbl:'Graphics'}],
    sections: [
      { title: 'CPU', text: 'The brain. Under heatsink.' },
      { title: 'RAM', text: 'Long sticks in slots.' },
      { title: 'Storage', text: 'SSD chip or HDD box.' },
      { title: 'GPU', text: 'PCIe card with fan.' },
      { title: 'PSU', text: 'Metal box with cables.' }
    ]
  },
  'check-cpu-information': {
    simple: 'Check CPU model, speed, and cores on Windows or Linux.',
    analogy: 'Check engine specs of a car.',
    svg: 'cpu-info',
    flow: ['OPEN', 'READ', 'NOTES', 'USAGE'],
    facts: [{big:'Model',lbl:'i7 etc'},{big:'Cores',lbl:'Count'},{big:'GHz',lbl:'Speed'},{big:'Cache',lbl:'L1-L3'},{big:'Live',lbl:'Usage'}],
    sections: [
      { title: 'Windows', text: 'This PC → Properties. Or Task Manager.' },
      { title: 'Linux', text: 'cat /proc/cpuinfo or lscpu.' },
      { title: 'Look For', text: 'Model, cores, GHz, cache.' },
      { title: 'Monitor', text: 'Task Manager or top/htop.' }
    ]
  },
  'check-ram-and-storage': {
    simple: 'Check how much RAM and storage you have and use.',
    analogy: 'Check desk and cabinet fullness.',
    svg: 'ram-storage',
    flow: ['INFO', 'TOTAL', 'USED', 'PLAN'],
    facts: [{big:'GB',lbl:'RAM'},{big:'GB/TB',lbl:'Storage'},{big:'Used',lbl:'Current'},{big:'Free',lbl:'Available'},{big:'Upgrade',lbl:'If Low'}],
    sections: [
      { title: 'Windows RAM', text: 'Task Manager → Performance → Memory.' },
      { title: 'Windows Storage', text: 'File Explorer → This PC.' },
      { title: 'Linux', text: 'free -h and df -h.' },
      { title: 'Upgrade when', text: 'RAM > 80% used. Storage < 10% free.' }
    ]
  },
  'ports-and-connectors': {
    simple: 'Ports are physical sockets — USB, HDMI, audio, ethernet.',
    analogy: 'Electrical outlets in a house.',
    svg: 'ports',
    flow: ['IDENTIFY', 'MATCH', 'PLUG', 'WORKS'],
    facts: [{big:'USB',lbl:'Common'},{big:'HDMI',lbl:'Video'},{big:'RJ45',lbl:'Ethernet'},{big:'3.5mm',lbl:'Audio'},{big:'USB-C',lbl:'Modern'}],
    sections: [
      { title: 'USB', text: 'Type-A, Type-C. USB 2.0-4.' },
      { title: 'Display', text: 'HDMI, DisplayPort, VGA, DVI.' },
      { title: 'Network', text: 'RJ45 wired ethernet.' },
      { title: 'Audio', text: '3.5mm headphones/mic.' },
      { title: 'Power', text: 'Barrel jack or USB-C.' }
    ]
  },
  'embedded-computers': {
    simple: 'Small computers built into other devices — cars, ATMs, TVs.',
    analogy: 'Tiny brain inside a bigger machine.',
    svg: 'embedded',
    flow: ['ON', 'RUN', 'CONTROL', 'WORK'],
    facts: [{big:'Single',lbl:'Purpose'},{big:'Tiny',lbl:'Size'},{big:'Fixed',lbl:'Firmware'},{big:'Billions',lbl:'In Use'},{big:'Everywhere',lbl:'Location'}],
    sections: [
      { title: 'What?', text: 'Computer inside another device.' },
      { title: 'Examples', text: 'Washing machine, ECU, ATM.' },
      { title: 'Traits', text: 'Tiny, low power, single purpose.' },
      { title: 'Why?', text: 'Billions run the world quietly.' }
    ]
  }
};

/* ============================================================
   FALLBACK — auto-generate for topics without hand-written data
   ============================================================ */
function buildFallbackTopic(folderName){
  var title = titleFromSlug(folderName);
  var cat = detectCategory(folderName);

  var templates = {
    network: {
      simple: title + ' is a key networking concept that helps computers communicate over the internet.',
      analogy: 'Like a postal system: addresses (IP), envelopes (packets), routes (routers).',
      svg: 'network',
      flow: ['DEVICE', 'NETWORK', 'ROUTER', 'DESTINATION'],
      facts: [{big:'Network',lbl:'Category'},{big:'TCP/IP',lbl:'Protocol'},{big:'Ports',lbl:'Layer'},{big:'Standard',lbl:'Based'},{big:'Everywhere',lbl:'Used'}],
      sections: [
        { title: 'What is ' + title + '?', text: title + ' is a foundational networking concept used in every modern internet connection.' },
        { title: 'How It Works', text: 'Networks pass data as packets. Each packet follows rules (protocols) to reach its destination.' },
        { title: 'Why It Matters', text: 'Without ' + title + ', computers could not talk to each other across the world.' },
        { title: 'Real-World Example', text: 'When you open a website, ' + title + ' is involved behind the scenes to make it load.' }
      ]
    },
    programming: {
      simple: title + ' is a programming concept every developer learns early. It makes code cleaner and more powerful.',
      analogy: 'Like a recipe: ingredients (data), steps (instructions), result (output).',
      svg: 'code',
      flow: ['INPUT', 'LOGIC', 'OUTPUT'],
      facts: [{big:'Programming',lbl:'Category'},{big:'Core',lbl:'Concept'},{big:'Universal',lbl:'Across Languages'},{big:'Practical',lbl:'Focus'},{big:'Beginner',lbl:'Level'}],
      sections: [
        { title: 'What is ' + title + '?', text: title + ' is a programming concept used in almost every language — C, Python, Java, JavaScript.' },
        { title: 'Why It Matters', text: 'Understanding ' + title + ' lets you write cleaner, more efficient code.' },
        { title: 'How It Works', text: 'You write the code once, and it can be used many times — that is the power.' },
        { title: 'Example', text: 'Open a code editor and try using ' + title + ' in a simple program.' }
      ]
    },
    web: {
      simple: title + ' is a key web concept that makes websites work. From HTML to HTTPS, it defines how the web behaves.',
      analogy: 'Like a restaurant: browser (customer) asks, server (kitchen) responds.',
      svg: 'web',
      flow: ['REQUEST', 'SERVER', 'RESPONSE', 'PAGE'],
      facts: [{big:'Web',lbl:'Category'},{big:'HTTP/S',lbl:'Protocol'},{big:'URL',lbl:'Address'},{big:'Browser',lbl:'Client'},{big:'Server',lbl:'Backend'}],
      sections: [
        { title: 'What is ' + title + '?', text: title + ' is a key part of how the World Wide Web works.' },
        { title: 'How It Works', text: 'Your browser sends a request. The server sends back a response. The page displays.' },
        { title: 'Why It Matters', text: 'Every website you visit uses ' + title + ' in some form.' },
        { title: 'Example', text: 'Open any website and inspect it in DevTools to see ' + title + ' in action.' }
      ]
    },
    data: {
      simple: title + ' is a data concept — how information is stored, measured, or represented on computers.',
      analogy: 'Like measuring distance in meters — data has its own units and rules.',
      svg: 'data',
      flow: ['BITS', 'BYTES', 'FORMAT', 'MEANING'],
      facts: [{big:'Data',lbl:'Category'},{big:'Binary',lbl:'Representation'},{big:'Bits',lbl:'Smallest Unit'},{big:'Precision',lbl:'Important'},{big:'Universal',lbl:'Concept'}],
      sections: [
        { title: 'What is ' + title + '?', text: title + ' describes how computers store and represent information.' },
        { title: 'How It Works', text: 'Everything is stored as binary 0s and 1s, then interpreted based on rules.' },
        { title: 'Why It Matters', text: 'Understanding data representation is essential for programming and IT.' },
        { title: 'Example', text: 'Text, images, and videos are all stored using ' + title + '.' }
      ]
    },
    default: {
      simple: title + ' is a key concept in computer fundamentals. Learning it helps you understand how computers work.',
      analogy: 'Think of it as a building block — small on its own, essential as part of a bigger system.',
      svg: 'general',
      flow: ['LEARN', 'UNDERSTAND', 'APPLY'],
      facts: [{big:'Fundamental',lbl:'Category'},{big:'Practical',lbl:'Focus'},{big:'Visual',lbl:'Format'},{big:'Beginner',lbl:'Level'},{big:'Essential',lbl:'Skill'}],
      sections: [
        { title: 'What is ' + title + '?', text: title + ' is an important topic in computer fundamentals.' },
        { title: 'Why It Matters', text: 'Understanding ' + title + ' gives you a stronger foundation in computing.' },
        { title: 'How It Works', text: 'Every concept fits into a bigger picture — this one connects with many others.' },
        { title: 'Real-World Use', text: 'You encounter ' + title + ' in your daily use of phones, laptops, and the internet.' }
      ]
    }
  };

  return templates[cat] || templates.default;
}

function detectCategory(folderName){
  var t = folderName.toLowerCase();
  if(/(dns|ip|ipv4|ipv6|http|https|url|router|modem|lan|wan|wi-fi|wifi|isp|domain|internet|web|browser|www|email|cloud|server|client)/.test(t)) return 'network';
  if(/(variable|function|loop|array|string|operator|syntax|compiler|interpreter|error|debug|algorithm|flowchart|pseudocode|code|programming|statement|expression|identifier|keyword|literal|comment)/.test(t)) return 'programming';
  if(/(html|css|javascript|frontend|backend|web|site|page|dom|selector|flexbox|responsive)/.test(t)) return 'web';
  if(/(ascii|unicode|binary|decimal|number|bit|byte|encoding|data|kb|mb|gb|tb)/.test(t)) return 'data';
  return 'default';
}

function titleFromSlug(slug){
  var s = slug.replace(/^\d+-/, '');
  var special = {
    'cpu':'CPU','alu':'ALU','ram':'RAM','rom':'ROM','hdd':'HDD','ssd':'SSD',
    'os':'OS','gui':'GUI','usb':'USB','hdmi':'HDMI','psu':'PSU','gpu':'GPU',
    'bios':'BIOS','uefi':'UEFI','pcb':'PCB','io':'I/O','ip':'IP','lan':'LAN',
    'wan':'WAN','dns':'DNS','http':'HTTP','https':'HTTPS','url':'URL','www':'WWW',
    'ascii':'ASCII','isp':'ISP','kb':'KB','mb':'MB','gb':'GB','tb':'TB','lcm':'LCM','gcd':'GCD'
  };
  return s.split('-').map(function(w){
    var lw = w.toLowerCase();
    if(special[lw]) return special[lw];
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

/* ============================================================
   SVG LIBRARY
   ============================================================ */
function getSVG(type){
  var svgs = {
    computer: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#0ea5e9"/></linearGradient></defs><rect x="70" y="40" width="260" height="150" rx="10" fill="#0a0a1e" stroke="url(#g1)" stroke-width="2"/><rect x="90" y="60" width="220" height="110" rx="5" fill="#05060f"/><text x="200" y="125" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="13">PROCESSING UNIT</text><rect x="160" y="195" width="80" height="12" rx="3" fill="url(#g1)"/></svg>',
    question: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><text x="200" y="150" text-anchor="middle" fill="#7c3aed" font-family="monospace" font-weight="bold" font-size="100">?</text></svg>',
    characteristics: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">' + ['FAST','ACCURATE','TIRELESS','VERSATILE','STORAGE','AUTO'].map(function(t,i){var x=40+(i%3)*115;var y=60+Math.floor(i/3)*80;return '<rect x="'+x+'" y="'+y+'" width="100" height="55" rx="8" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="'+(x+50)+'" y="'+(y+33)+'" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="10">'+t+'</text>';}).join('') + '</svg>',
    evolution: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">' + [['1940s','#ef4444',130],['1960s','#f59e0b',110],['1980s','#22c55e',90],['NOW','#0ea5e9',70]].map(function(d,i){var x=60+i*80;return '<rect x="'+x+'" y="'+d[2]+'" width="55" height="'+(160-d[2]+40)+'" rx="4" fill="#0a0a1e" stroke="'+d[1]+'" stroke-width="2"/><text x="'+(x+27)+'" y="140" text-anchor="middle" fill="'+d[1]+'" font-family="monospace" font-size="10">'+d[0]+'</text>';}).join('') + '</svg>',
    generations: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">' + ['VACUUM','TRANS','IC','MICRO','AI'].map(function(t,i){var x=30+i*72;return '<circle cx="'+(x+30)+'" cy="110" r="28" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="'+(x+30)+'" y="115" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="9">G'+(i+1)+'</text><text x="'+(x+30)+'" y="165" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="8">'+t+'</text>';}).join('') + '</svg>',
    types: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">' + ['SUPER','MAIN','MINI','MICRO','EMBED'].map(function(t,i){var x=30+i*72;return '<rect x="'+x+'" y="80" width="60" height="80" rx="6" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="'+(x+30)+'" y="125" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="9">'+t+'</text>';}).join('') + '</svg>',
    'desktop-laptop': '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="60" width="140" height="110" rx="6" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="110" y="120" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">DESKTOP</text><rect x="220" y="60" width="140" height="90" rx="6" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="290" y="110" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="11">LAPTOP</text><rect x="220" y="150" width="140" height="20" rx="3" fill="#0ea5e9"/></svg>',
    workstation: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="80" y="40" width="240" height="160" rx="8" fill="#0a0a1e" stroke="#22c55e" stroke-width="3"/><text x="200" y="110" text-anchor="middle" fill="#4ade80" font-family="monospace" font-weight="bold" font-size="18">WORKSTATION</text><text x="200" y="140" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="10">3D · CAD · AI</text></svg>',
    cpu: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="120" y="50" width="160" height="140" rx="8" fill="#0a0a1e" stroke="#f59e0b" stroke-width="3"/><text x="200" y="125" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="22">CPU</text><text x="200" y="155" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="10">FETCH · DECODE · EXECUTE</text></svg>',
    alu: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><polygon points="130,90 270,90 290,120 270,150 130,150 110,120" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><text x="200" y="125" text-anchor="middle" fill="#4ade80" font-family="monospace" font-weight="bold" font-size="18">ALU</text><text x="70" y="115" fill="#c4b5fd" font-family="monospace" font-size="11">A</text><text x="70" y="140" fill="#c4b5fd" font-family="monospace" font-size="11">B</text><line x1="85" y1="115" x2="110" y2="120" stroke="#c4b5fd" stroke-width="2"/><line x1="85" y1="140" x2="110" y2="120" stroke="#c4b5fd" stroke-width="2"/><line x1="290" y1="120" x2="340" y2="120" stroke="#4ade80" stroke-width="2"/></svg>',
    'control-unit': '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="100" y="60" width="200" height="120" rx="8" fill="#0a0a1e" stroke="#7c3aed" stroke-width="3"/><text x="200" y="115" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-weight="bold" font-size="16">CONTROL UNIT</text></svg>',
    registers: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="80" y="50" width="240" height="140" rx="8" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/>' + ['AX','BX','CX','DX'].map(function(t,i){return '<rect x="100" y="'+(70+i*28)+'" width="200" height="22" rx="3" fill="#1e1e2e" stroke="#c4b5fd" stroke-width="1"/><text x="115" y="'+(85+i*28)+'" fill="#c4b5fd" font-family="monospace" font-size="11">'+t+'  · 0000 0000</text>';}).join('') + '</svg>',
    cache: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="120" r="32" fill="#0a0a1e" stroke="#fbbf24" stroke-width="2"/><text x="70" y="126" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="11">CPU</text>' + [['L1','#4ade80',140],['L2','#22c55e',215],['L3','#0ea5e9',290]].map(function(d){return '<rect x="'+d[2]+'" y="95" width="60" height="50" rx="6" fill="#0a0a1e" stroke="'+d[1]+'" stroke-width="2"/><text x="'+(d[2]+30)+'" y="127" text-anchor="middle" fill="'+d[1]+'" font-family="monospace" font-weight="bold" font-size="14">'+d[0]+'</text>';}).join('') + '</svg>',
    ram: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="80" width="320" height="80" rx="6" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/>' + Array.from({length:8},function(_,i){return '<rect x="'+(60+i*38)+'" y="95" width="28" height="50" rx="2" fill="#22c55e"/>';}).join('') + '<text x="200" y="200" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">RAM · TEMPORARY</text></svg>',
    rom: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="100" y="70" width="200" height="120" rx="8" fill="#0a0a1e" stroke="#ef4444" stroke-width="2"/><text x="200" y="125" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="20">ROM</text></svg>',
    hdd: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="70" y="60" width="260" height="130" rx="12" fill="#0a0a1e" stroke="#71717a" stroke-width="2"/><circle cx="200" cy="125" r="50" fill="none" stroke="#a1a1aa" stroke-width="2"/><circle cx="200" cy="125" r="7" fill="#71717a"/><line x1="200" y1="125" x2="240" y2="100" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/><text x="200" y="215" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">HDD · SPINNING DISK</text></svg>',
    ssd: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="90" y="70" width="220" height="90" rx="6" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/>' + Array.from({length:4},function(_,i){return '<rect x="'+(110+i*50)+'" y="90" width="40" height="50" rx="3" fill="#4ade80"/>';}).join('') + '<text x="200" y="200" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="12">SSD · FLASH MEMORY</text></svg>',
    storage: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">' + [['PRIMARY','#22c55e',50],['SECONDARY','#0ea5e9',110],['PORTABLE','#f59e0b',170]].map(function(d){return '<rect x="50" y="'+d[2]+'" width="300" height="45" rx="6" fill="#0a0a1e" stroke="'+d[1]+'" stroke-width="2"/><text x="200" y="'+(d[2]+28)+'" text-anchor="middle" fill="'+d[1]+'" font-family="monospace" font-size="11">'+d[0]+'</text>';}).join('') + '</svg>',
    input: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="80" width="130" height="80" rx="6" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="125" y="125" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="12">KEYBOARD</text><circle cx="290" cy="120" r="38" fill="#0a0a1e" stroke="#4ade80" stroke-width="2"/><text x="290" y="127" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="14">MOUSE</text><text x="200" y="200" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">INPUT · YOU → COMPUTER</text></svg>',
    output: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="100" y="50" width="200" height="120" rx="6" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="200" y="125" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="14">MONITOR</text><rect x="150" y="175" width="100" height="12" fill="#7c3aed"/><text x="200" y="215" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">OUTPUT · COMPUTER → YOU</text></svg>',
    'hw-sw': '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="70" width="140" height="110" rx="6" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><text x="110" y="110" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="13">HARDWARE</text><rect x="220" y="70" width="140" height="110" rx="6" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="290" y="110" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="13">SOFTWARE</text></svg>',
    application: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">' + ['APP','WEB','GAME','MEDIA'].map(function(t,i){var x=60+(i%3)*100;var y=50+Math.floor(i/3)*90;return '<rect x="'+x+'" y="'+y+'" width="70" height="70" rx="12" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="'+(x+35)+'" y="'+(y+42)+'" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="10">'+t+'</text>';}).join('') + '</svg>',
    system: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="50" width="280" height="45" rx="6" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><text x="200" y="78" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="12">OS</text><rect x="60" y="110" width="280" height="45" rx="6" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="200" y="138" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="12">DRIVERS + UTILITIES</text><text x="200" y="200" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="11">BACKGROUND SOFTWARE</text></svg>',
    os: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="40" width="280" height="40" rx="4" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><text x="200" y="65" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="12">USER APPS</text><rect x="60" y="90" width="280" height="40" rx="4" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="200" y="115" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="12">OPERATING SYSTEM</text><rect x="60" y="140" width="280" height="40" rx="4" fill="#0a0a1e" stroke="#f59e0b" stroke-width="2"/><text x="200" y="165" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="12">HARDWARE</text></svg>',
    'open-source': '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="60" width="150" height="120" rx="6" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><text x="115" y="125" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="13">OPEN SOURCE</text><rect x="210" y="60" width="150" height="120" rx="6" fill="#0a0a1e" stroke="#ef4444" stroke-width="2"/><text x="285" y="125" text-anchor="middle" fill="#f87171" font-family="monospace" font-size="12">PROPRIETARY</text></svg>',
    driver: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="90" width="100" height="60" rx="6" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="80" y="127" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">OS</text><rect x="160" y="90" width="80" height="60" rx="6" fill="#0a0a1e" stroke="#f59e0b" stroke-width="2"/><text x="200" y="127" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="11">DRIVER</text><rect x="270" y="90" width="100" height="60" rx="6" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><text x="320" y="127" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="11">DEVICE</text></svg>',
    firmware: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="130" y="60" width="140" height="120" rx="8" fill="#0a0a1e" stroke="#f59e0b" stroke-width="2"/><text x="200" y="110" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="18">FIRMWARE</text><text x="200" y="145" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="10">BIOS / UEFI</text></svg>',
    settings: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="50" width="280" height="150" rx="6" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="200" y="90" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="13">SETTINGS</text>' + ['DISPLAY','SOUND','NETWORK','USERS','UPDATES'].map(function(t,i){return '<rect x="90" y="'+(115+i*15)+'" width="220" height="11" rx="2" fill="#1e1e2e"/><text x="105" y="'+(124+i*15)+'" fill="#a1a1aa" font-family="monospace" font-size="9">'+t+'</text>';}).join('') + '</svg>',
    components: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="30" width="340" height="180" rx="8" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><rect x="50" y="50" width="80" height="70" rx="4" fill="#1e1e2e" stroke="#7c3aed" stroke-width="2"/><text x="90" y="90" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="10">CPU</text><rect x="150" y="50" width="60" height="70" fill="#1e1e2e" stroke="#0ea5e9" stroke-width="1"/><text x="180" y="90" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="10">RAM</text><rect x="230" y="50" width="120" height="35" rx="4" fill="#1e1e2e" stroke="#f59e0b" stroke-width="1"/><text x="290" y="73" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="10">GPU</text><rect x="230" y="95" width="120" height="35" rx="4" fill="#1e1e2e" stroke="#ef4444" stroke-width="1"/><text x="290" y="118" text-anchor="middle" fill="#f87171" font-family="monospace" font-size="10">SSD</text><rect x="50" y="140" width="300" height="55" rx="4" fill="#1e1e2e" stroke="#22c55e" stroke-width="1"/><text x="200" y="175" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="11">MOTHERBOARD</text></svg>',
    'cpu-info': '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="50" width="280" height="140" rx="6" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="200" y="90" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="13">CPU INFORMATION</text><text x="200" y="125" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="11">Intel i7 · 8 Cores · 3.5 GHz</text><text x="200" y="160" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="11">Usage: 12%</text></svg>',
    'ram-storage': '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="60" width="150" height="120" rx="6" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="115" y="110" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="11">RAM</text><text x="115" y="145" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="10">50% USED</text><rect x="210" y="60" width="150" height="120" rx="6" fill="#0a0a1e" stroke="#f59e0b" stroke-width="2"/><text x="285" y="110" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="11">STORAGE</text><text x="285" y="145" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="10">60% USED</text></svg>',
    ports: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="90" width="320" height="60" rx="6" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/>' + ['USB','HDMI','RJ45','AUDIO','PWR'].map(function(t,i){return '<rect x="'+(55+i*60)+'" y="105" width="45" height="30" rx="4" fill="#1e1e2e" stroke="#c4b5fd" stroke-width="1"/><text x="'+(77+i*60)+'" y="125" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="9">'+t+'</text>';}).join('') + '</svg>',
    embedded: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="100" y="60" width="200" height="120" rx="8" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><rect x="140" y="85" width="120" height="60" rx="4" fill="#1e1e2e" stroke="#7c3aed" stroke-width="2"/><text x="200" y="122" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">CHIP</text></svg>',
    network: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="120" r="40" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><text x="200" y="125" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="11">NETWORK</text>' + [[60,60,'USER'],[340,60,'SERVER'],[60,180,'LAN'],[340,180,'WAN']].map(function(d){return '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="25" fill="#0a0a1e" stroke="#7c3aed" stroke-width="2"/><text x="'+d[0]+'" y="'+(d[1]+4)+'" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="9">'+d[2]+'</text><line x1="'+d[0]+'" y1="'+d[1]+'" x2="200" y2="120" stroke="#7c3aed" stroke-width="1" stroke-dasharray="4,4"/>';}).join('') + '</svg>',
    code: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="40" width="280" height="160" rx="6" fill="#0a0a1e" stroke="#22c55e" stroke-width="2"/><text x="80" y="80" fill="#4ade80" font-family="monospace" font-size="12">function solve() {</text><text x="100" y="105" fill="#c4b5fd" font-family="monospace" font-size="12">// your logic here</text><text x="100" y="130" fill="#fbbf24" font-family="monospace" font-size="12">return result;</text><text x="80" y="155" fill="#4ade80" font-family="monospace" font-size="12">}</text></svg>',
    web: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="40" width="280" height="160" rx="6" fill="#0a0a1e" stroke="#0ea5e9" stroke-width="2"/><circle cx="90" cy="60" r="4" fill="#ef4444"/><circle cx="105" cy="60" r="4" fill="#f59e0b"/><circle cx="120" cy="60" r="4" fill="#22c55e"/><rect x="80" y="80" width="240" height="100" rx="4" fill="#1e1e2e"/><text x="200" y="135" text-anchor="middle" fill="#60c4f0" font-family="monospace" font-size="12">WEB PAGE</text></svg>',
    data: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><text x="200" y="80" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="40">1 0 1 0</text><text x="200" y="130" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="12">BINARY DATA</text><text x="200" y="170" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="11">0s AND 1s · STORED EVERYWHERE</text></svg>',
    general: '<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="120" r="70" fill="none" stroke="#7c3aed" stroke-width="2"/><circle cx="200" cy="120" r="45" fill="none" stroke="#0ea5e9" stroke-width="2"/><circle cx="200" cy="120" r="20" fill="#7c3aed"/><text x="200" y="215" text-anchor="middle" fill="#c4b5fd" font-family="monospace" font-size="11">CORE CONCEPT</text></svg>'
  };
  return svgs[type] || svgs.general;
}

/* ============================================================
   BUILD CONTENT HTML
   ============================================================ */
function buildContentHTML(topic){
  var safeTopic = topic || {};
  var simple = safeTopic.simple || 'Learn the fundamentals of this topic.';
  var analogy = safeTopic.analogy || 'Think of it as a building block of computing.';
  var svg = safeTopic.svg || 'general';
  var flow = safeTopic.flow || ['LEARN','PRACTICE','MASTER'];
  var facts = safeTopic.facts || [{big:'Key',lbl:'Concept'},{big:'Core',lbl:'Skill'},{big:'Beginner',lbl:'Level'},{big:'Visual',lbl:'Format'},{big:'Practical',lbl:'Focus'}];
  var sections = safeTopic.sections || [{title:'Overview',text:'This topic is essential to computer fundamentals.'}];

  var simpleHtml = '<div class="content-simple"><div class="cs-label">💡 In Simple Words</div><p>' + escapeHtml(simple) + '</p></div>';
  var analogyHtml = '<div class="content-analogy"><div class="ca-label">🎯 Real-World Analogy</div><p>' + escapeHtml(analogy) + '</p></div>';
  var svgHtml = '<div class="content-visual">' + getSVG(svg) + '</div>';

  var flowHtml = '<div class="content-flow">' +
    flow.map(function(step, i){
      return '<div class="cf-step"><div class="cf-num">' + (i+1) + '</div><div class="cf-label">' + escapeHtml(step) + '</div></div>' +
        (i < flow.length - 1 ? '<div class="cf-arrow">→</div>' : '');
    }).join('') + '</div>';

  var factsHtml = '<div class="content-facts">' +
    facts.map(function(f){
      return '<div class="cfact"><div class="cfact-big">' + escapeHtml(f.big) + '</div><div class="cfact-lbl">' + escapeHtml(f.lbl) + '</div></div>';
    }).join('') + '</div>';

  var sectionsHtml = '<div class="content-sections">' +
    sections.map(function(s){
      return '<div class="cs-card"><h3>' + escapeHtml(s.title) + '</h3><p>' + escapeHtml(s.text) + '</p></div>';
    }).join('') + '</div>';

  return simpleHtml + analogyHtml + svgHtml + flowHtml + factsHtml + sectionsHtml;
}

function escapeHtml(s){
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ============================================================
   CSS INJECTION
   ============================================================ */
var CONTENT_CSS = '\n<style id="content-enhancement">\n' +
'.content-simple,.content-analogy{padding:1.1rem 1.3rem;border-radius:12px;margin:1rem 0;border-left:4px solid}\n' +
'.content-simple{background:rgba(124,58,237,.08);border-left-color:#7c3aed}\n' +
'.content-analogy{background:rgba(251,191,36,.08);border-left-color:#fbbf24}\n' +
'.cs-label,.ca-label{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em;margin-bottom:.45rem}\n' +
'.cs-label{color:#c4b5fd}\n' +
'.ca-label{color:#fbbf24}\n' +
'.content-simple p,.content-analogy p{color:#e2e8f0;font-size:.95rem;line-height:1.7;margin:0}\n' +
'.content-analogy p{font-style:italic}\n' +
'.content-visual{margin:1.2rem 0;padding:1.3rem;background:rgba(10,10,30,.5);border:1px solid rgba(148,163,184,.12);border-radius:14px;display:flex;justify-content:center;align-items:center}\n' +
'.content-visual svg{width:100%;max-width:400px;height:auto}\n' +
'.content-flow{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;align-items:center;padding:1.1rem;background:rgba(15,16,36,.5);border:1px solid rgba(148,163,184,.1);border-radius:12px;margin:1.2rem 0}\n' +
'.cf-step{display:flex;flex-direction:column;align-items:center;gap:.3rem}\n' +
'.cf-num{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#0ea5e9);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.75rem}\n' +
'.cf-label{font-size:.66rem;font-weight:700;color:#c4b5fd;text-transform:uppercase;letter-spacing:.05em;text-align:center;max-width:100px;line-height:1.3}\n' +
'.cf-arrow{color:#7c3aed;font-weight:900;font-size:1.1rem}\n' +
'.content-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.6rem;margin:1.2rem 0}\n' +
'.cfact{background:rgba(15,16,36,.7);border:1px solid rgba(148,163,184,.12);border-radius:12px;padding:.9rem .8rem;text-align:center;transition:all .25s}\n' +
'.cfact:hover{transform:translateY(-2px);border-color:rgba(124,58,237,.4)}\n' +
'.cfact-big{font-size:.95rem;font-weight:900;background:linear-gradient(135deg,#c4b5fd,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}\n' +
'.cfact-lbl{font-size:.6rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-top:.35rem}\n' +
'.content-sections{margin:1.2rem 0}\n' +
'.cs-card{background:rgba(15,16,36,.6);border:1px solid rgba(148,163,184,.1);border-radius:12px;padding:1.1rem 1.3rem;margin-bottom:.7rem;border-left:3px solid #0ea5e9;transition:all .2s}\n' +
'.cs-card:hover{transform:translateX(3px);border-left-color:#7c3aed}\n' +
'.cs-card h3{font-size:.98rem;font-weight:800;color:#c4b5fd;margin-bottom:.35rem}\n' +
'.cs-card p{color:#cbd5e1;font-size:.9rem;line-height:1.65;margin:0}\n' +
'</style>\n';

/* ============================================================
   UPDATE ONE FILE
   ============================================================ */
function updateFile(filePath, folderName){
  var content = fs.readFileSync(filePath, 'utf8');
  var topic = TOPICS[folderName] || buildFallbackTopic(folderName);

  var h1End = content.indexOf('</h1>');
  if(h1End === -1) return { status: 'skip', reason: 'no </h1>' };

  var navStart = content.indexOf('<div class="topic-nav"', h1End);
  if(navStart === -1) return { status: 'skip', reason: 'no topic-nav' };

  var pStart = content.indexOf('<p>', h1End);
  if(pStart === -1 || pStart > navStart) return { status: 'skip', reason: 'no <p>' };

  var before = content.substring(0, pStart);
  var after = content.substring(navStart);

  var newHTML = buildContentHTML(topic);

  var cleaned = before + newHTML + after;
  cleaned = cleaned.replace(/<style id="content-enhancement">[\s\S]*?<\/style>/g, '');

  var headClose = cleaned.indexOf('</head>');
  if(headClose !== -1){
    cleaned = cleaned.substring(0, headClose) + CONTENT_CSS + cleaned.substring(headClose);
  }

  fs.writeFileSync(filePath, cleaned, 'utf8');
  return { status: 'updated' };
}

/* ============================================================
   WALK
   ============================================================ */
function walk(dir){
  var entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch(e){ return; }

  var folderName = path.basename(dir);
  var indexPath = path.join(dir, 'index.html');
  var isRoot = (dir === ROOT);

  // Only process leaf folders (topic folders have index.html but are not day-XX roots)
  if(!isRoot && fs.existsSync(indexPath) && !/^day-\d+/.test(folderName)){
    try {
      var result = updateFile(indexPath, folderName);
      if(result.status === 'updated') console.log('✓ ' + folderName);
      else console.log('· ' + folderName + ' (' + result.reason + ')');
    } catch(e){
      console.log('✗ ' + folderName + ': ' + e.message);
    }
  }

  entries.filter(function(e){
    return e.isDirectory() && SKIP.indexOf(e.name) === -1 && e.name.charAt(0) !== '.';
  }).forEach(function(e){
    walk(path.join(dir, e.name));
  });
}

console.log('\n📝 Updating content in each topic index.html...\n');
walk(ROOT);
console.log('\n✨ Done!\n');