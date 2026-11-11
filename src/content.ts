export type Lang = 'en' | 'uk';
export type Status = 'INTACT' | 'PARTIAL' | 'CORRUPTED';

export interface ArchiveRecord {
  id: string;
  status: Status;
  recovered: string;
  serial: string;
  seed: string;
  repo: string;
  stack: string;
  chips: string[];
  title: string;
  key: string;
}

export interface Skill { key: string; items: string[]; load: number }

export interface Contact {
  key: 'freelancehunt' | 'telegram' | 'github';
  label: string;
  url: string;
  copy: string;
}

export const FREELANCEHUNT_URL = 'https://freelancehunt.com/freelancer/kujira88.html';
const GH = 'https://github.com/YehorSS';

export const RECORDS: ArchiveRecord[] = [
  { id: 'REC-001', status: 'INTACT', recovered: '2026-11-11', serial: '0047-YK-001-VY', seed: 'vasyan', repo: `${GH}/vasyan-lang`, stack: 'C++17 · CMake', chips: ['Lexer', 'Parser', 'Bytecode', 'Validator', 'VM'], title: 'VasyanLang', key: 'vasyan' },
  { id: 'REC-002', status: 'INTACT', recovered: '2026-10-24', serial: '0047-YK-002-TS', seed: 'tsm', repo: `${GH}/TSM`, stack: 'Tauri 2 · React · TypeScript', chips: ['Tauri', 'React', 'Carrier APIs', 'EN / RU / IT'], title: 'TSM', key: 'tsm' },
  { id: 'REC-003', status: 'INTACT', recovered: '2026-11-08', serial: '0047-YK-003-CM', seed: 'controller', repo: `${GH}/controller-manager`, stack: 'C++ · WinAPI · WebView2', chips: ['DualSense', 'DualShock 4', 'XInput', 'HID'], title: 'Controller Manager', key: 'controller' },
  { id: 'REC-004', status: 'PARTIAL', recovered: '2026-10-19', serial: '0047-YK-004-H4', seed: 'hoi4', repo: `${GH}/hoi4-external-advisor`, stack: 'C++20 · WinAPI · ImGui · DX11', chips: ['Memory reading', 'Dijkstra', 'Overlay', 'memscan'], title: 'HoI4 External Advisor', key: 'hoi4' },
  { id: 'REC-005', status: 'PARTIAL', recovered: '2026-10-02', serial: '0047-YK-005-DS', seed: 'crit', repo: `${GH}/DragonSwordCritCombatModifacator`, stack: 'Node.js · JavaScript', chips: ['Unreal archives', 'Mod build', 'Sliders'], title: 'Crit & Combat', key: 'crit' },
  { id: 'REC-006', status: 'CORRUPTED', recovered: '2026-09-14', serial: '0047-YK-006-DB', seed: 'damage', repo: `${GH}/DamageBuildAnalitics`, stack: 'JavaScript', chips: ['Damage math', 'Builds'], title: 'DamageBuildAnalitics', key: 'damage' },
];

export const SKILLS: Skill[] = [
  { key: 'lang', items: ['Java 21', 'C++17/20', 'TypeScript', 'JavaScript', 'Python', 'GLSL'], load: 0.92 },
  { key: 'mods', items: ['Fabric', 'Paper / Spigot', 'JVM bytecode', 'Memory reading', 'Save & archive formats', 'Shaders'], load: 0.86 },
  { key: 'desktop', items: ['Tauri 2', 'WinAPI', 'Dear ImGui', 'DirectX 11'], load: 0.74 },
  { key: 'web', items: ['React', 'Vite', 'Node.js', 'REST APIs'], load: 0.63 },
  { key: 'tools', items: ['Git', 'Gradle', 'CMake', 'Visual Studio', 'IntelliJ IDEA'], load: 0.55 },
];

export const CONTACTS: Contact[] = [
  { key: 'freelancehunt', label: 'Freelancehunt', url: FREELANCEHUNT_URL, copy: FREELANCEHUNT_URL },
  { key: 'telegram', label: '@kujira88', url: 'https://t.me/kujira88', copy: '@kujira88' },
  { key: 'github', label: 'YehorSS', url: GH, copy: GH },
];

const en: Record<string, string> = {
  'meta.title': 'Yehor Kudinchykov — game tools, mods and desktop apps',
  'meta.desc': 'Portfolio of Yehor Kudinchykov: game tools, mods, desktop apps and websites. Java, C++, TypeScript.',
  'boot.0': 'GEKKO-MO // ARCHIVE RECOVERY',
  'boot.1': 'link ........................ established',
  'boot.2': 'crew manifest ............... 0 / 4 112',
  'boot.3': 'engineer archive ............ found',
  'boot.4': 'integrity ................... 98%',
  'boot.5': 'decrypting records ...',
  'boot.skip': 'Click to skip',
  'rail.drift': 'Drift',
  'rail.days': 'd',
  'rail.hull': 'Hull',
  'rail.signal': 'Signal',
  'rail.lost': 'LOST',
  'gauge': 'Archive integrity',
  'deck.bridge': 'Bridge',
  'deck.archive': 'Archive · recovered records',
  'deck.engineering': 'Engineering · system readouts',
  'deck.comms': 'Comms',
  'bridge.crew': 'Last engineer on board',
  'bridge.first': 'Yehor',
  'bridge.last': 'Kudinchykov',
  'bridge.role': 'I build <em>game tools, mods and desktop apps</em>, and take them all the way to a finished product.',
  'spec.core': 'Core',
  'spec.systems': 'Systems',
  'spec.interface': 'Interface',
  'spec.comms': 'Comms',
  'bridge.open': 'Open the archive ↓',
  'rec.record': 'Record',
  'rec.status': 'Status',
  'rec.recovered': 'Recovered',
  'rec.open': 'Open record ↗',
  'rec.damaged': 'sector damaged',
  'rec.breach': 'Breach',
  'rec.sector': 'sector',
  'rec.lost': 'lost',
  'rec.corrupt': 'Data loss · checksum failed',
  'rec.vasyan.cat': 'Systems · language design',
  'rec.vasyan.desc': 'A programming language with Ukrainian keywords, written from scratch: lexer, parser, bytecode compiler, a validator that checks every function before it runs, and a stack VM with limits on time, memory and call depth.',
  'rec.tsm.cat': 'Desktop · travel search',
  'rec.tsm.desc': 'A desktop app for Windows and macOS. One sentence finds the cheapest trains, buses and flights across Italy from Trenitalia, FlixBus and Ryanair, then opens the carrier to buy. Built for people who are not comfortable with computers.',
  'rec.controller.cat': 'Hardware · input testing',
  'rec.controller.desc': 'Lists every connected controller and tests each button, stick and D-pad live, with directions in numpad notation for fighting games. Knows DualSense, DualShock 4 and Xbox pads over USB or Bluetooth.',
  'rec.hoi4.cat': 'Memory · overlay · strategy',
  'rec.hoi4.desc': "An outside advisor for Hearts of Iron IV. It reads the running game's memory, plans war goals on the real map and draws a frame around the button to press, without touching the game itself.",
  'rec.crit.cat': 'Modding · combat tuning',
  'rec.crit.desc': 'Combat stat sliders for DragonSword: Awakening in one browser page. Move crit chance to ×5, press build, and a single mod file appears next to the game. Reset removes it.',
  'rec.damage.cat': 'Analysis · damage builds',
  'rec.damage.desc': 'Damage and build calculations for comparing character setups.',
  'eng.lang': 'Language core',
  'eng.mods': 'Mod bay',
  'eng.desktop': 'Desktop array',
  'eng.web': 'Web relay',
  'eng.tools': 'Toolchain',
  'eng.online': 'online',
  'comms.lead': 'Every channel is down but these. Signal goes out on contact.',
  'comms.offline': 'Offline',
  'comms.copy': 'Copy',
  'comms.copied': 'Copied',
  'comms.selected': 'Selected, press Ctrl+C',
  'comms.sent': 'Signal sent',
  'comms.freelancehunt': 'Freelance profile',
  'comms.telegram': 'Telegram',
  'comms.github': 'Source code',
  'nav.label': 'Decks',
};

const uk: Record<string, string> = {
  'meta.title': 'Єгор Кудінчиков — ігрові інструменти, моди й десктопні програми',
  'meta.desc': 'Портфоліо Єгора Кудінчикова: ігрові інструменти, моди, десктопні програми й сайти. Java, C++, TypeScript.',
  'boot.0': 'GEKKO-MO // ВІДНОВЛЕННЯ АРХІВУ',
  'boot.1': 'з’єднання .................. встановлено',
  'boot.2': 'екіпаж ...................... 0 / 4 112',
  'boot.3': 'архів інженера .............. знайдено',
  'boot.4': 'цілісність .................. 98%',
  'boot.5': 'розшифрування записів ...',
  'boot.skip': 'Клацни, щоб пропустити',
  'rail.drift': 'Дрейф',
  'rail.days': 'д',
  'rail.hull': 'Корпус',
  'rail.signal': 'Сигнал',
  'rail.lost': 'ВТРАЧЕНО',
  'gauge': 'Цілісність архіву',
  'deck.bridge': 'Місток',
  'deck.archive': 'Архів · відновлені записи',
  'deck.engineering': 'Інженерний відсік · показники систем',
  'deck.comms': 'Зв’язок',
  'bridge.crew': 'Останній інженер на борту',
  'bridge.first': 'Єгор',
  'bridge.last': 'Кудінчиков',
  'bridge.role': 'Роблю <em>ігрові інструменти, моди й десктопні програми</em> і доводжу їх до готового продукту.',
  'spec.core': 'Основа',
  'spec.systems': 'Системи',
  'spec.interface': 'Інтерфейс',
  'spec.comms': 'Зв’язок',
  'bridge.open': 'Відкрити архів ↓',
  'rec.record': 'Запис',
  'rec.status': 'Стан',
  'rec.recovered': 'Відновлено',
  'rec.open': 'Відкрити запис ↗',
  'rec.damaged': 'сектор пошкоджено',
  'rec.breach': 'Пробій',
  'rec.sector': 'сектор',
  'rec.lost': 'втрачено',
  'rec.corrupt': 'Втрата даних · контрольна сума не збігається',
  'rec.vasyan.cat': 'Системи · дизайн мови',
  'rec.vasyan.desc': 'Мова програмування з українськими ключовими словами, написана з нуля: лексер, парсер, компілятор у байткод, валідатор, що перевіряє кожну функцію до запуску, і стекова VM з лімітами часу, пам’яті та глибини викликів.',
  'rec.tsm.cat': 'Десктоп · пошук поїздок',
  'rec.tsm.desc': 'Десктопна програма для Windows і macOS. Одним реченням знаходить найдешевші поїзди, автобуси й літаки по Італії від Trenitalia, FlixBus і Ryanair та відкриває сайт перевізника для купівлі. Зроблена для тих, хто погано знається на комп’ютерах.',
  'rec.controller.cat': 'Залізо · тест вводу',
  'rec.controller.desc': 'Показує всі підключені контролери й наживо перевіряє кожну кнопку, стік і хрестовину, а напрямки пише в нотації нумпаду, як у файтингах. Розпізнає DualSense, DualShock 4 і пади Xbox через USB або Bluetooth.',
  'rec.hoi4.cat': 'Пам’ять · оверлей · стратегія',
  'rec.hoi4.desc': 'Зовнішній радник для Hearts of Iron IV. Читає пам’ять запущеної гри, планує цілі війни на справжній карті й обводить рамкою кнопку, яку треба натиснути. Саму гру не змінює.',
  'rec.crit.cat': 'Модинг · бойовий баланс',
  'rec.crit.desc': 'Повзунки бойових характеристик для DragonSword: Awakening на одній сторінці в браузері. Ставиш шанс крита ×5, тиснеш «зібрати», і поруч із грою з’являється один файл мода. Скидання його прибирає.',
  'rec.damage.cat': 'Аналіз · білди урону',
  'rec.damage.desc': 'Розрахунок урону й білдів для порівняння збірок персонажа.',
  'eng.lang': 'Мовне ядро',
  'eng.mods': 'Відсік модів',
  'eng.desktop': 'Десктопний масив',
  'eng.web': 'Веб-ретранслятор',
  'eng.tools': 'Інструменти',
  'eng.online': 'у мережі',
  'comms.lead': 'Усі канали мертві, крім цих. Сигнал іде, щойно ви виходите на зв’язок.',
  'comms.offline': 'Вимкнено',
  'comms.copy': 'Копіювати',
  'comms.copied': 'Скопійовано',
  'comms.selected': 'Виділено, натисніть Ctrl+C',
  'comms.sent': 'Сигнал надіслано',
  'comms.freelancehunt': 'Профіль на фрилансі',
  'comms.telegram': 'Telegram',
  'comms.github': 'Код',
  'nav.label': 'Палуби',
};

export const DICT: Record<Lang, Record<string, string>> = { en, uk };
