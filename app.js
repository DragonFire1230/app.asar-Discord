Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSettings = getSettings;
exports.init = init;

var _Settings = _interopRequireDefault(require("../common/Settings"));

var paths = _interopRequireWildcard(require("../common/paths"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let settings;

function init() {
  settings = new _Settings.default(paths.getUserData());
}

function getSettings() {
  return settings;
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusSplash = focusSplash;
exports.update = update;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var moduleUpdater = _interopRequireWildcard(require("../common/moduleUpdater"));

var paths = _interopRequireWildcard(require("../common/paths"));

var _updater = require("../common/updater");

var _appSettings = require("./appSettings");

var autoStart = _interopRequireWildcard(require("./autoStart"));

var _buildInfo = _interopRequireDefault(require("./buildInfo"));

var _errorHandler = require("./errorHandler");

var firstRun = _interopRequireWildcard(require("./firstRun"));

var splashScreen = _interopRequireWildcard(require("./splashScreen"));

var _Constants = require("./Constants");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// settings
const USE_PINNED_UPDATE_MANIFEST = 'USE_PINNED_UPDATE_MANIFEST';

function update(startMinimized, doneCallback, showCallback) {
  const settings = (0, _appSettings.getSettings)();

  if ((0, _updater.tryInitUpdater)(_buildInfo.default, _Constants.NEW_UPDATE_ENDPOINT)) {
    const updater = (0, _updater.getUpdater)();
    const usePinnedUpdateManifest = settings.get(USE_PINNED_UPDATE_MANIFEST);
    updater.on('host-updated', () => {
      autoStart.update(() => {});
    });
    updater.on('unhandled-exception', _errorHandler.fatal);
    updater.on(_updater.INCONSISTENT_INSTALLER_STATE_ERROR, _errorHandler.fatal);
    updater.on('update-error', _errorHandler.handled);

    if (usePinnedUpdateManifest) {
      const manifestPath = _path.default.join(paths.getUserData(), 'pinned_update.json');

      updater.setPinnedManifestSync(JSON.parse(_fs.default.readFileSync(manifestPath)));
    }

    firstRun.performFirstRunTasks(updater);
  } else {
    moduleUpdater.init(_Constants.UPDATE_ENDPOINT, settings, _buildInfo.default);
  }

  splashScreen.initSplash(startMinimized);
  splashScreen.events.once(splashScreen.APP_SHOULD_LAUNCH, doneCallback);
  splashScreen.events.once(splashScreen.APP_SHOULD_SHOW, showCallback);
}

function focusSplash() {
  splashScreen.focusWindow();
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports.isInstalled = isInstalled;
exports.uninstall = uninstall;
exports.update = update;

function install(callback) {
  return callback();
}

function update(callback) {
  return callback();
}

function isInstalled(callback) {
  return callback(false);
}

function uninstall(callback) {
  return callback();
}"use strict";

module.exports = require('./' + process.platform);"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports.isInstalled = isInstalled;
exports.uninstall = uninstall;
exports.update = update;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _electron = require("electron");

var _buildInfo = _interopRequireDefault(require("../buildInfo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: We should use Constant's APP_NAME, but only once
//       we set up backwards compat with this.
const appName = _path.default.basename(process.execPath, '.exe');

const exePath = _electron.app.getPath('exe');

const exeDir = _path.default.dirname(exePath);

const iconPath = _path.default.join(exeDir, 'discord.png');

const autostartDir = _path.default.join(_electron.app.getPath('appData'), 'autostart');

const electronAppName = _electron.app.name ? _electron.app.name : _electron.app.getName();

const autostartFileName = _path.default.join(autostartDir, electronAppName + '-' + _buildInfo.default.releaseChannel + '.desktop');

const desktopFile = `[Desktop Entry]
Type=Application
Exec=${exePath}
Hidden=false
NoDisplay=false
Name=${appName}
Icon=${iconPath}
Comment=Text and voice chat for gamers.
X-GNOME-Autostart-enabled=true
`;

function ensureDir() {
  try {
    _fs.default.mkdirSync(autostartDir);

    return true;
  } catch (e) {// catch for when it already exists.
  }

  return false;
}

function install(callback) {
  // TODO: This could fail. We should read its return value
  ensureDir();

  try {
    return _fs.default.writeFile(autostartFileName, desktopFile, callback);
  } catch (e) {
    // I guess we don't autostart then
    return callback();
  }
}

function update(callback) {
  // TODO: We might need to implement this later on
  return callback();
}

function isInstalled(callback) {
  try {
    _fs.default.stat(autostartFileName, (err, stats) => {
      if (err) {
        return callback(false);
      }

      return callback(stats.isFile());
    });
  } catch (e) {
    return callback(false);
  }
}

function uninstall(callback) {
  return _fs.default.unlink(autostartFileName, callback);
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports.isInstalled = isInstalled;
exports.uninstall = uninstall;
exports.update = update;

var _path = _interopRequireDefault(require("path"));

var windowsUtils = _interopRequireWildcard(require("../windowsUtils"));

var _appSettings = require("../appSettings");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const settings = (0, _appSettings.getSettings)(); // TODO: We should use Constant's APP_NAME, but only once
//       we set up backwards compat with this.

const appName = _path.default.basename(process.execPath, '.exe');

const fullExeName = _path.default.basename(process.execPath);

const updatePath = _path.default.join(_path.default.dirname(process.execPath), '..', 'Update.exe');

function install(callback) {
  const startMinimized = settings.get('START_MINIMIZED', false);
  let execPath = `${updatePath} --processStart ${fullExeName}`;

  if (startMinimized) {
    execPath = `${execPath} --process-start-args --start-minimized`;
  }

  const queue = [['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName, '/d', execPath]];
  windowsUtils.addToRegistry(queue, callback);
}

function update(callback) {
  isInstalled(installed => {
    if (installed) {
      install(callback);
    } else {
      callback();
    }
  });
}

function isInstalled(callback) {
  const queryValue = ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName];
  queryValue.unshift('query');
  windowsUtils.spawnReg(queryValue, (error, stdout) => {
    const doesOldKeyExist = stdout.indexOf(appName) >= 0;
    callback(doesOldKeyExist);
  });
}

function uninstall(callback) {
  const queryValue = ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName, '/f'];
  queryValue.unshift('delete');
  windowsUtils.spawnReg(queryValue, (error, stdout) => {
    callback();
  });
}"use strict";

// bootstrap, or what runs before the rest of desktop does
// responsible for handling updates and updating modules before continuing startup
if (process.platform === 'linux') {
  // Some people are reporting audio problems on Linux that are fixed by setting
  // an environment variable PULSE_LATENCY_MSEC=30 -- the "real" fix is to see
  // what conditions require this and set this then (also to set it directly in
  // our webrtc setup code rather than here) but this should fix the bug for now.
  if (process.env.PULSE_LATENCY_MSEC === undefined) {
    process.env.PULSE_LATENCY_MSEC = 30;
  }
}

const {
  app,
  Menu
} = require('electron');

const sentry = require('@sentry/node');

const buildInfo = require('./buildInfo');

app.setVersion(buildInfo.version); // expose releaseChannel to a global, since it's used by splash screen

global.releaseChannel = buildInfo.releaseChannel;

const errorHandler = require('./errorHandler');

errorHandler.init();

const crashReporterSetup = require('../common/crashReporterSetup');

crashReporterSetup.init(buildInfo, sentry);

const paths = require('../common/paths');

paths.init(buildInfo);
global.moduleDataPath = paths.getModuleDataPath();

const appSettings = require('./appSettings');

appSettings.init();

const Constants = require('./Constants');

const GPUSettings = require('./GPUSettings');

function setupHardwareAcceleration() {
  const settings = appSettings.getSettings(); // TODO: this is a copy of gpuSettings.getEnableHardwareAcceleration

  if (!settings.get('enableHardwareAcceleration', true)) {
    app.disableHardwareAcceleration();
  }
}

setupHardwareAcceleration();
app.allowRendererProcessReuse = false; // [adill] work around chrome 66 disabling autoplay by default

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required'); // WinRetrieveSuggestionsOnlyOnDemand: Work around electron 13 bug w/ async spellchecking on Windows.
// HardwareMediaKeyHandling,MediaSessionService: Prevent Discord from registering as a media service.

app.commandLine.appendSwitch('disable-features', 'WinRetrieveSuggestionsOnlyOnDemand,HardwareMediaKeyHandling,MediaSessionService');

function hasArgvFlag(flag) {
  return (process.argv || []).slice(1).includes(flag);
}

console.log(`${Constants.APP_NAME} ${app.getVersion()}`);
let pendingAppQuit = false;

if (process.platform === 'win32') {
  // this tells Windows (in particular Windows 10) which icon to associate your app with, important for correctly
  // pinning app to task bar.
  app.setAppUserModelId(Constants.APP_ID);

  const {
    handleStartupEvent
  } = require('./squirrelUpdate'); // TODO: Isn't using argv[1] fragile?


  const squirrelCommand = process.argv[1]; // TODO: Is protocol case sensitive?

  if (handleStartupEvent(Constants.APP_PROTOCOL, app, squirrelCommand)) {
    pendingAppQuit = true;
  }
}

const appUpdater = require('./appUpdater');

const moduleUpdater = require('../common/moduleUpdater');

const updater = require('../common/updater');

const splashScreen = require('./splashScreen');

const autoStart = require('./autoStart');

const requireNative = require('./requireNative');

let coreModule;
const isFirstInstance = app.requestSingleInstanceLock();
const allowMultipleInstances = hasArgvFlag('--multi-instance');

function extractUrlFromArgs(args) {
  const urlArgIndex = args.indexOf('--url');

  if (urlArgIndex < 0) {
    return null;
  }

  const passThroughArgsIndex = args.indexOf('--');

  if (passThroughArgsIndex < 0 || passThroughArgsIndex < urlArgIndex) {
    return null;
  }

  const url = args[passThroughArgsIndex + 1];

  if (url == null) {
    return null;
  }

  return url;
}

let initialUrl = extractUrlFromArgs(process.argv);

if (!allowMultipleInstances) {
  app.on('second-instance', (_event, args, _workingDirectory) => {
    if (args != null && args.indexOf('--squirrel-uninstall') > -1) {
      app.quit();
      return;
    }

    const url = extractUrlFromArgs(args);

    if (coreModule) {
      // url can be null, as a user opening the executable again will focus the app from background
      coreModule.handleOpenUrl(url);
    } else if (url != null) {
      initialUrl = url;
    }

    if (!coreModule) {
      appUpdater.focusSplash();
    }
  });
}

app.on('will-finish-launching', () => {
  // on macos protocol links are handled entirely through this event
  app.on('open-url', (event, url) => {
    event.preventDefault();

    if (coreModule) {
      coreModule.handleOpenUrl(url);
    } else {
      initialUrl = url;
    }
  });
});

function startUpdate() {
  console.log('Starting updater.');
  const startMinimized = hasArgvFlag('--start-minimized');
  appUpdater.update(startMinimized, () => {
    try {
      coreModule = requireNative('discord_desktop_core');
      coreModule.startup({
        paths,
        splashScreen,
        moduleUpdater,
        autoStart,
        buildInfo,
        appSettings,
        Constants,
        GPUSettings,
        updater,
        crashReporterSetup
      });

      if (initialUrl != null) {
        coreModule.handleOpenUrl(initialUrl);
        initialUrl = null;
      }
    } catch (err) {
      return errorHandler.fatal(err);
    }
  }, () => {
    coreModule.setMainWindowVisible(!startMinimized);
  });
}

function startApp() {
  console.log('Starting app.');
  paths.cleanOldVersions(buildInfo);

  const startupMenu = require('./startupMenu');

  Menu.setApplicationMenu(startupMenu);
  startUpdate();
}

if (pendingAppQuit) {
  console.log('Startup prevented.');
} else if (!isFirstInstance && !allowMultipleInstances) {
  console.log('Quitting secondary instance.');
  app.quit();
} else {
  if (app.isReady()) {
    startApp();
  } else {
    app.once('ready', startApp);
  }
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const buildInfo = require(_path.default.join(process.resourcesPath, 'build_info.json'));

var _default = buildInfo;
exports.default = _default;
module.exports = exports.default;"use strict";

// bootstrap constants
// after startup, these constants will be merged into core module constants
// since they are used in both locations (see app/Constants.js)
const {
  releaseChannel
} = require('./buildInfo');

const {
  getSettings
} = require('./appSettings');

const settings = getSettings();

function capitalizeFirstLetter(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const appNameSuffix = releaseChannel === 'stable' ? '' : capitalizeFirstLetter(releaseChannel);
const APP_COMPANY = 'Discord Inc';
const APP_DESCRIPTION = 'Discord - https://discord.com';
const APP_NAME = 'Discord' + appNameSuffix;
const APP_NAME_FOR_HUMANS = 'Discord' + (appNameSuffix !== '' ? ' ' + appNameSuffix : '');
const APP_ID_BASE = 'com.squirrel';
const APP_ID = `${APP_ID_BASE}.${APP_NAME}.${APP_NAME}`;
const APP_PROTOCOL = 'Discord';
const API_ENDPOINT = settings.get('API_ENDPOINT') || 'https://discord.com/api';
const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || API_ENDPOINT;
const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://discord.com/api/updates/';
module.exports = {
  APP_COMPANY,
  APP_DESCRIPTION,
  APP_NAME,
  APP_NAME_FOR_HUMANS,
  APP_ID,
  APP_PROTOCOL,
  API_ENDPOINT,
  NEW_UPDATE_ENDPOINT,
  UPDATE_ENDPOINT
};[
  "Upsorbing the Contents",
  "Additive Parsing the Load",
  "Commence Monosaturated Goodening",
  "Kick Off the Multi-Core Widening",
  "Bastening the Game Turkey",
  "Abstracting the Rummage Disc",
  "Undecerealenizing the Process",
  "Postrefragmenting the Widget Layer",
  "Satisfying the Constraints",
  "Abnoramalzing Some of the Matrices",
  "Optimizing the People",
  "Proclaigerizing the Network"
]
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fatal = fatal;
exports.handled = handled;
exports.init = init;

var Sentry = _interopRequireWildcard(require("@sentry/node"));

var _electron = require("electron");

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const HANDLED_ERROR_INTERVAL = 3;
const HANDLED_ERROR_LIMIT = 10;
let handledErrorCounter = 0;
let totalHandledErrors = 0;
const consoleOutputOnly = _process.default.env.DISCORD_TEST != null;

function isErrorSafeToSuppress(error) {
  return /attempting to call a function in a renderer window/i.test(error.message);
}

function init() {
  _process.default.on('uncaughtException', error => {
    const stack = error.stack ? error.stack : String(error);
    const message = `Uncaught exception:\n ${stack}`;
    console.warn(message);

    if (!isErrorSafeToSuppress(error)) {
      if (consoleOutputOnly) {
        console.error(`${message} error: ${error}`);

        _process.default.exit(-1);
      }

      _electron.dialog.showErrorBox('A JavaScript error occurred in the main process', message);
    }
  });
} // show a similar error message to the error handler, except exit out the app
// after the error message has been closed


function fatal(err) {
  const options = {
    type: 'error',
    message: 'A fatal Javascript error occured',
    detail: err && err.stack ? err.stack : String(err)
  };

  if (consoleOutputOnly) {
    console.error(`fatal: ${err}`);

    _process.default.exit(-1);
  }

  const callback = _ => _electron.app.quit();

  const electronMajor = parseInt(_process.default.versions.electron.split('.')[0]);

  if (electronMajor >= 6) {
    _electron.dialog.showMessageBox(null, options).then(callback);
  } else {
    _electron.dialog.showMessageBox(options, callback);
  }

  Sentry.captureException(err);
} // capture a handled error for telemetry purposes, e.g. finding update loops.


function handled(err) {
  if (global.releaseChannel !== 'ptb' && global.releaseChannel !== 'canary' && global.releaseChannel !== 'development') {
    return;
  }

  if (totalHandledErrors < HANDLED_ERROR_LIMIT && handledErrorCounter++ % HANDLED_ERROR_INTERVAL == 0) {
    console.warn('Reporting non-fatal error', err);
    Sentry.captureException(err);
    totalHandledErrors++;
  }
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performFirstRunTasks = performFirstRunTasks;

function performFirstRunTasks(_updater) {//
}"use strict";

module.exports = require('./' + process.platform);"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performFirstRunTasks = performFirstRunTasks;

function performFirstRunTasks(_updater) {//
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performFirstRunTasks = performFirstRunTasks;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var paths = _interopRequireWildcard(require("../../common/paths"));

var _errorHandler = require("../errorHandler");

var _squirrelUpdate = require("../squirrelUpdate");

var _Constants = require("../Constants");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const appFolder = _path.default.resolve(process.execPath, '..');

const rootFolder = _path.default.resolve(appFolder, '..');

const exeName = _path.default.basename(process.execPath);

const updateExe = _path.default.join(rootFolder, 'Update.exe');

function copyIconToRoot() {
  const icoSrc = _path.default.join(appFolder, 'app.ico');

  const icoDest = _path.default.join(rootFolder, 'app.ico');

  try {
    const ico = _fs.default.readFileSync(icoSrc);

    _fs.default.writeFileSync(icoDest, ico);

    return icoDest;
  } catch (e) {
    return icoSrc;
  }
}

function updateShortcuts(updater) {
  const shortcutFileName = `${_Constants.APP_NAME_FOR_HUMANS}.lnk`;
  const shortcutPaths = [_path.default.join(updater.getKnownFolder('desktop'), shortcutFileName), _path.default.join(updater.getKnownFolder('programs'), _Constants.APP_COMPANY, shortcutFileName)];
  const iconPath = copyIconToRoot();

  for (const shortcutPath of shortcutPaths) {
    if (!_fs.default.existsSync(shortcutPath)) {
      // If the user deleted the shortcut, don't recreate it.
      continue;
    }

    updater.createShortcut({
      /* eslint-disable camelcase */
      target_path: updateExe,
      shortcut_path: shortcutPath,
      arguments: `--processStart ${exeName}`,
      icon_path: iconPath,
      icon_index: 0,
      description: _Constants.APP_DESCRIPTION,
      app_user_model_id: _Constants.APP_ID,
      working_directory: appFolder
      /* eslint-enable camelcase */

    });
  }
}

function performFirstRunTasks(updater) {
  const firstRunCompletePath = _path.default.join(paths.getUserDataVersioned(), '.first-run');

  if (!_fs.default.existsSync(firstRunCompletePath)) {
    let updatedShortcuts = false;

    try {
      updateShortcuts(updater);
      updatedShortcuts = true;
    } catch (e) {
      (0, _errorHandler.handled)(e);
    }

    (0, _squirrelUpdate.installProtocol)(_Constants.APP_PROTOCOL, () => {
      try {
        if (updatedShortcuts) {
          _fs.default.writeFileSync(firstRunCompletePath, 'true');
        }
      } catch (e) {
        (0, _errorHandler.handled)(e);
      }
    });
  }
}"use strict";

// this file is here for two reasons:
// 1. web requires ./GPUSettings file from electron app (bad!), and requires are
//    relative to process.main (bootstrap's index.js)
// 2. GPUSettings has been refactored into GPUSettings, and because we want to
//    be able to update GPUSettings OTA, we will have the core module provide
//    us with the GPUSettings
// so tl;dr this is core module's GPUSettings, providing compat for web
exports.replace = function (GPUSettings) {
  // replacing module.exports directly would have no effect, since requires are cached
  // so we mutate the existing object
  for (const name of Object.keys(GPUSettings)) {
    exports[name] = GPUSettings[name];
  }
};"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _events = require("events");

var _request = _interopRequireDefault(require("./request"));

var squirrelUpdate = _interopRequireWildcard(require("./squirrelUpdate"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
function versionParse(verString) {
  return verString.split('.').map(i => parseInt(i));
}

function versionNewer(verA, verB) {
  let i = 0;

  while (true) {
    const a = verA[i];
    const b = verB[i];
    i++;

    if (a === undefined) {
      return false;
    } else {
      if (b === undefined || a > b) {
        return true;
      }

      if (a < b) {
        return false;
      }
    }
  }
}

class AutoUpdaterWin32 extends _events.EventEmitter {
  constructor() {
    super();
    this.updateUrl = null;
    this.updateVersion = null;
  }

  setFeedURL(updateUrl) {
    this.updateUrl = updateUrl;
  }

  quitAndInstall() {
    if (squirrelUpdate.updateExistsSync()) {
      squirrelUpdate.restart(_electron.app, this.updateVersion ?? _electron.app.getVersion());
    } else {
      /* eslint-disable-next-line */
      require('auto-updater').quitAndInstall();
    }
  }

  downloadAndInstallUpdate(callback) {
    squirrelUpdate.spawnUpdateInstall(this.updateUrl, progress => {
      this.emit('update-progress', progress);
    }).catch(err => callback(err)).then(() => callback());
  }

  checkForUpdates() {
    if (this.updateUrl == null) {
      throw new Error('Update URL is not set');
    }

    this.emit('checking-for-update');

    if (!squirrelUpdate.updateExistsSync()) {
      this.emit('update-not-available');
      return;
    }

    squirrelUpdate.spawnUpdate(['--check', this.updateUrl], (error, stdout) => {
      if (error != null) {
        this.emit('error', error);
        return;
      }

      try {
        // Last line of the output is JSON details about the releases
        const json = stdout.trim().split('\n').pop();
        const releasesFound = JSON.parse(json).releasesToApply;

        if (releasesFound == null || releasesFound.length === 0) {
          this.emit('update-not-available');
          return;
        }

        const update = releasesFound.pop();
        this.emit('update-available');
        this.downloadAndInstallUpdate(error => {
          if (error != null) {
            this.emit('error', error);
            return;
          }

          this.updateVersion = update.version;
          this.emit('update-downloaded', {}, update.release, update.version, new Date(), this.updateUrl, this.quitAndInstall.bind(this));
        });
      } catch (error) {
        error.stdout = stdout;
        this.emit('error', error);
      }
    });
  }

} // todo


class AutoUpdaterLinux extends _events.EventEmitter {
  constructor() {
    super();
    this.updateUrl = null;
  }

  setFeedURL(url) {
    this.updateUrl = url;
  }

  quitAndInstall() {
    // Just restart. The splash screen will hit the update manually state and
    // prompt the user to download the new package.
    _electron.app.relaunch();

    _electron.app.quit();
  }

  async checkForUpdates() {
    const currVersion = versionParse(_electron.app.getVersion());
    this.emit('checking-for-update');

    try {
      const response = await _request.default.get(this.updateUrl);

      if (response.statusCode === 204) {
        // you are up to date
        this.emit('update-not-available');
        return;
      }

      let latestVerStr = '';
      let latestVersion = [];

      try {
        const latestMetadata = JSON.parse(response.body);
        latestVerStr = latestMetadata.name;
        latestVersion = versionParse(latestVerStr);
      } catch (_) {}

      if (versionNewer(latestVersion, currVersion)) {
        console.log('[Updates] You are out of date!'); // you need to update

        this.emit('update-manually', latestVerStr);
      } else {
        console.log('[Updates] You are living in the future!');
        this.emit('update-not-available');
      }
    } catch (err) {
      console.error('[Updates] Error fetching ' + this.updateUrl + ': ' + err.message);
      this.emit('error', err);
    }
  }

}

let autoUpdater; // TODO
// events: checking-for-update, update-available, update-not-available, update-manually, update-downloaded, error
// also, checkForUpdates, setFeedURL, quitAndInstall
// also, see electron.autoUpdater, and its API

switch (process.platform) {
  case 'darwin':
    autoUpdater = require('electron').autoUpdater;
    break;

  case 'win32':
    autoUpdater = new AutoUpdaterWin32();
    break;

  case 'linux':
    autoUpdater = new AutoUpdaterLinux();
    break;
}

var _default = autoUpdater;
exports.default = _default;
module.exports = exports.default;

const {
  app
} = require('electron');

const buildInfo = require('./buildInfo');

const paths = require('../common/paths');

paths.init(buildInfo);

const moduleUpdater = require('../common/moduleUpdater');

const updater = require('../common/updater');

const requireNative = require('./requireNative');

function getAppMode() {
  if (process.argv && process.argv.includes('--overlay-host')) {
    return 'overlay-host';
  }

  return 'app';
}

const mode = getAppMode();

if (mode === 'app') {
  require('./bootstrap');
} else if (mode === 'overlay-host') {
  // Initialize the update system just enough to find installed native modules.
  const appSettings = require('./appSettings');

  appSettings.init();

  const {
    NEW_UPDATE_ENDPOINT
  } = require('./Constants');

  if (buildInfo.newUpdater) {
    if (!updater.tryInitUpdater(buildInfo, NEW_UPDATE_ENDPOINT)) {
      throw new Error('Failed to initialize modules in overlay host.');
    } // Load the module search path but if there's a pending host update, don't
    // restart into it.


    updater.getUpdater().startCurrentVersionSync({
      allowObsoleteHost: true
    });
  } else {
    moduleUpdater.initPathsOnly(buildInfo);
  }

  requireNative('discord_overlay2/standalone_host.js');
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// used in devtools to hook in additional dev tools
// require('electron').remote.require('./installDevTools')()
function installDevTools() {
  console.log(`Installing Devtron`);

  const devtron = require('devtron');

  devtron.uninstall();
  devtron.install();
  console.log(`Installed Devtron`);
}

var _default = installDevTools;
exports.default = _default;
module.exports = exports.default;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _default = {
  on: (event, callback) => _electron.ipcMain.on(`DISCORD_${event}`, callback),
  removeListener: (event, callback) => _electron.ipcMain.removeListener(`DISCORD_${event}`, callback)
};
exports.default = _default;
module.exports = exports.default;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _querystring = _interopRequireDefault(require("querystring"));

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_REQUEST_TIMEOUT = 30000;

function makeHTTPResponse({
  method,
  url,
  headers,
  statusCode,
  statusMessage
}, body) {
  return {
    method,
    url,
    headers,
    statusCode,
    statusMessage,
    body
  };
}

function makeHTTPStatusError(response) {
  const err = new Error(`HTTP Error: Status Code ${response.statusCode}`);
  err.response = response;
  return err;
}

function handleHTTPResponse(resolve, reject, response, stream) {
  const totalBytes = parseInt(response.headers['content-length'] || 1, 10);
  let receivedBytes = 0;
  const chunks = []; // don't stream response if it's a failure

  if (response.statusCode >= 300) {
    stream = null;
  }

  response.on('data', chunk => {
    if (stream != null) {
      receivedBytes += chunk.length;
      stream.write(chunk);
      stream.emit('progress', {
        totalBytes,
        receivedBytes
      });
      return;
    }

    chunks.push(chunk);
  });
  response.on('end', () => {
    if (stream != null) {
      stream.on('finish', () => resolve(makeHTTPResponse(response, null)));
      stream.end();
      return;
    }

    const res = makeHTTPResponse(response, Buffer.concat(chunks));

    if (res.statusCode >= 300) {
      reject(makeHTTPStatusError(res));
      return;
    }

    resolve(res);
  });
}

function nodeRequest({
  method,
  url,
  headers,
  qs,
  timeout,
  body,
  stream
}) {
  return new Promise((resolve, reject) => {
    const req = (0, _request.default)({
      method,
      url,
      qs,
      headers,
      followAllRedirects: true,
      encoding: null,
      timeout: timeout != null ? timeout : DEFAULT_REQUEST_TIMEOUT,
      body
    });
    req.on('response', response => handleHTTPResponse(resolve, reject, response, stream));
    req.on('error', err => reject(err));
  });
}

async function electronRequest({
  method,
  url,
  headers,
  qs,
  timeout,
  body,
  stream
}) {
  await _electron.app.whenReady();

  const {
    net,
    session
  } = require('electron');

  const req = net.request({
    method,
    url: `${url}${qs != null ? `?${_querystring.default.stringify(qs)}` : ''}`,
    redirect: 'follow',
    session: session.defaultSession
  });

  if (headers != null) {
    for (const headerKey of Object.keys(headers)) {
      req.setHeader(headerKey, headers[headerKey]);
    }
  }

  if (body != null) {
    req.write(body, 'utf-8');
  }

  return new Promise((resolve, reject) => {
    const reqTimeout = setTimeout(() => {
      req.abort();
      reject(new Error(`network timeout: ${url}`));
    }, timeout != null ? timeout : DEFAULT_REQUEST_TIMEOUT);
    req.on('login', (authInfo, callback) => callback());
    req.on('response', response => {
      clearTimeout(reqTimeout);
      handleHTTPResponse(resolve, reject, response, stream);
    });
    req.on('error', err => {
      clearTimeout(reqTimeout);
      reject(err);
    });
    req.end();
  });
}

async function requestWithMethod(method, options) {
  if (typeof options === 'string') {
    options = {
      url: options
    };
  }

  options = { ...options,
    method
  };

  try {
    return await electronRequest(options);
  } catch (err) {
    console.log(`Error downloading with electron net: ${err.message}`);
    console.log('Falling back to node net library..');
  }

  return nodeRequest(options);
} // only supports get for now, since retrying is non-idempotent and
// we'd want to grovel the errors to make sure it's safe to retry


var _default = {
  get: requestWithMethod.bind(null, 'GET')
};
exports.default = _default;
module.exports = exports.default;"use strict";

// require(), with paths specialized for requiring only native modules.
module.paths = [];
module.exports = require;

var A=function(e){return"string"==typeof e?e:null!==e&&JSON.stringify(e)||""},T=h.a.oneOfType([h.a.string,h.a.node]),M=h.a.oneOfType([h.a.string,h.a.number]),R=1,I=function(e,t){var n=void 0===e?"undefined":k(e);if("string"!==n&&"number"!==n&&"boolean"!==n)return e;var r=t.options,a=t.valueKey;if(r)for(var o=0;o<r.length;o++)if(String(r[o][a])===String(e))return r[o]},L=function(e,t){return!e||(t?0===e.length:0===Object.keys(e).length)},z=function(e){function t(e){S(this,t);var n=D(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return["clearValue","focusOption","getOptionLabel","handleInputBlur","handleInputChange","handleInputFocus","handleInputValueChange","handleKeyDown","handleMenuScroll","handleMouseDown","handleMouseDownOnArrow","handleMouseDownOnMenu","handleTouchEnd","handleTouchEndClearValue","handleTouchMove","handleTouchOutside","handleTouchStart","handleValueClick","onOptionRef","removeValue","selectValue"].forEach((function(e){return n[e]=n[e].bind(n)})),n.state={inputValue:"",isFocused:!1,isOpen:!1,isPseudoFocused:!1,required:!1},n}return O(t,e),x(t,[{key:"componentWillMount",value:function(){this._instancePrefix="react-select-"+(this.props.instanceId||++R)+"-";var e=this.getValueArray(this.props.value);this.props.required&&this.setState({required:L(e[0],this.props.multi)})}},{key:"componentDidMount",value:function(){void 0!==this.props.autofocus&&"undefined"!=typeof console&&console.warn("Warning: The autofocus prop has changed to autoFocus, support will be removed after react-select@1.0"),(this.props.autoFocus||this.props.autofocus)&&this.focus()}},{key:"componentWillReceiveProps",value:function(e){var t=this.getValueArray(e.value,e);e.required?this.setState({required:L(t[0],e.multi)}):this.props.required&&this.setState({required:!1}),this.state.inputValue&&this.props.value!==e.value&&e.onSelectResetsInput&&this.setState({inputValue:this.handleInputValueChange("")})}},{key:"componentDidUpdate",value:function(e,t){if(this.menu&&this.focused&&this.state.isOpen&&!this.hasScrolledToOption){var n=Object(o.findDOMNode)(this.focused),r=Object(o.findDOMNode)(this.menu),a=r.scrollTop,l=a+r.offsetHeight,i=n.offsetTop,u=i+n.offsetHeight;(a>i||l<u)&&(r.scrollTop=n.offsetTop),this.hasScrolledToOption=!0}else this.state.isOpen||(this.hasScrolledToOption=!1);if(this._scrollToFocusedOptionOnUpdate&&this.focused&&this.menu){this._scrollToFocusedOptionOnUpdate=!1;var s=Object(o.findDOMNode)(this.focused),c=Object(o.findDOMNode)(this.menu),f=s.getBoundingClientRect(),p=c.getBoundingClientRect();f.bottom>p.bottom?c.scrollTop=s.offsetTop+s.clientHeight-c.offsetHeight:f.top<p.top&&(c.scrollTop=s.offsetTop)}if(this.props.scrollMenuIntoView&&this.menuContainer){var d=this.menuContainer.getBoundingClientRect();window.innerHeight<d.bottom+this.props.menuBuffer&&window.scrollBy(0,d.bottom+this.props.menuBuffer-window.innerHeight)}if(e.disabled!==this.props.disabled&&(this.setState({isFocused:!1}),this.closeMenu()),t.isOpen!==this.state.isOpen){this.toggleTouchOutsideEvent(this.state.isOpen);var h=this.state.isOpen?this.props.onOpen:this.props.onClose;h&&h()}}},{key:"componentWillUnmount",value:function(){this.toggleTouchOutsideEvent(!1)}},{key:"toggleTouchOutsideEvent",value:function(e){var t=e?document.addEventListener?"addEventListener":"attachEvent":document.removeEventListener?"removeEventListener":"detachEvent",n=document.addEventListener?"":"on";document[t](n+"touchstart",this.handleTouchOutside),document[t](n+"mousedown",this.handleTouchOutside)}},{key:"handleTouchOutside",value:function(e){this.wrapper&&!this.wrapper.contains(e.target)&&this.closeMenu()}},{key:"focus",value:function(){this.input&&this.input.focus()}},{key:"blurInput",value:function(){this.input&&this.input.blur()}},{key:"handleTouchMove",value:function(){this.dragging=!0}},{key:"handleTouchStart",value:function(){this.dragging=!1}},{key:"handleTouchEnd",value:function(e){this.dragging||this.handleMouseDown(e)}},{key:"handleTouchEndClearValue",value:function(e){this.dragging||this.clearValue(e)}},{key:"handleMouseDown",value:function(e){if(!(this.props.disabled||"mousedown"===e.type&&0!==e.button))if("INPUT"!==e.target.tagName){if(e.preventDefault(),!this.props.searchable)return this.focus(),this.setState({isOpen:!this.state.isOpen,focusedOption:null});if(this.state.isFocused){this.focus();var t=this.input,n=!0;"function"==typeof t.getInput&&(t=t.getInput()),t.value="",this._focusAfterClear&&(n=!1,this._focusAfterClear=!1),this.setState({isOpen:n,isPseudoFocused:!1,focusedOption:null})}else this._openAfterFocus=this.props.openOnClick,this.focus(),this.setState({focusedOption:null})}else this.state.isFocused?this.state.isOpen||this.setState({isOpen:!0,isPseudoFocused:!1,focusedOption:null}):(this._openAfterFocus=this.props.openOnClick,this.focus())}},{key:"handleMouseDownOnArrow",value:function(e){this.props.disabled||"mousedown"===e.type&&0!==e.button||(this.state.isOpen?(e.stopPropagation(),e.preventDefault(),this.closeMenu()):this.setState({isOpen:!0}))}},{key:"handleMouseDownOnMenu",value:function(e){this.props.disabled||"mousedown"===e.type&&0!==e.button||(e.stopPropagation(),e.preventDefault(),this._openAfterFocus=!0,this.focus())}},{key:"closeMenu",value:function(){this.props.onCloseResetsInput?this.setState({inputValue:this.handleInputValueChange(""),isOpen:!1,isPseudoFocused:this.state.isFocused&&!this.props.multi}):this.setState({isOpen:!1,isPseudoFocused:this.state.isFocused&&!this.props.multi}),this.hasScrolledToOption=!1}},{key:"handleInputFocus",value:function(e){if(!this.props.disabled){var t=this.state.isOpen||this._openAfterFocus||this.props.openOnFocus;t=!this._focusAfterClear&&t,this.props.onFocus&&this.props.onFocus(e),this.setState({isFocused:!0,isOpen:!!t}),this._focusAfterClear=!1,this._openAfterFocus=!1}}},{key:"handleInputBlur",value:function(e){if(!this.menu||this.menu!==document.activeElement&&!this.menu.contains(document.activeElement)){this.props.onBlur&&this.props.onBlur(e);var t={isFocused:!1,isOpen:!1,isPseudoFocused:!1};this.props.onBlurResetsInput&&(t.inputValue=this.handleInputValueChange("")),this.setState(t)}else this.focus()}},{key:"handleInputChange",value:function(e){var t=e.target.value;this.state.inputValue!==e.target.value&&(t=this.handleInputValueChange(t)),this.setState({inputValue:t,isOpen:!0,isPseudoFocused:!1})}},{key:"setInputValue",value:function(e){if(this.props.onInputChange){var t=this.props.onInputChange(e);null!=t&&"object"!==(void 0===t?"undefined":k(t))&&(e=""+t)}this.setState({inputValue:e})}},{key:"handleInputValueChange",value:function(e){if(this.props.onInputChange){var t=this.props.onInputChange(e);null!=t&&"object"!==(void 0===t?"undefined":k(t))&&(e=""+t)}return e}},{key:"handleKeyDown",value:function(e){if(!(this.props.disabled||"function"==typeof this.props.onInputKeyDown&&(this.props.onInputKeyDown(e),e.defaultPrevented)))switch(e.keyCode){case 8:!this.state.inputValue&&this.props.backspaceRemoves&&(e.preventDefault(),this.popValue());break;case 9:if(e.shiftKey||!this.state.isOpen||!this.props.tabSelectsValue)break;e.preventDefault(),this.selectFocusedOption();break;case 13:e.preventDefault(),e.stopPropagation(),this.state.isOpen?this.selectFocusedOption():this.focusNextOption();break;case 27:e.preventDefault(),this.state.isOpen?(this.closeMenu(),e.stopPropagation()):this.props.clearable&&this.props.escapeClearsValue&&(this.clearValue(e),e.stopPropagation());break;case 32:if(this.props.searchable)break;if(e.preventDefault(),!this.state.isOpen){this.focusNextOption();break}e.stopPropagation(),this.selectFocusedOption();break;case 38:e.preventDefault(),this.focusPreviousOption();break;case 40:e.preventDefault(),this.focusNextOption();break;case 33:e.preventDefault(),this.focusPageUpOption();break;case 34:e.preventDefault(),this.focusPageDownOption();break;case 35:if(e.shiftKey)break;e.preventDefault(),this.focusEndOption();break;case 36:if(e.shiftKey)break;e.preventDefault(),this.focusStartOption();break;case 46:!this.state.inputValue&&this.props.deleteRemoves&&(e.preventDefault(),this.popValue())}}},{key:"handleValueClick",value:function(e,t){this.props.onValueClick&&this.props.onValueClick(e,t)}},{key:"handleMenuScroll",value:function(e){if(this.props.onMenuScrollToBottom){var t=e.target;t.scrollHeight>t.offsetHeight&&t.scrollHeight-t.offsetHeight-t.scrollTop<=0&&this.props.onMenuScrollToBottom()}}},{key:"getOptionLabel",value:function(e){return e[this.props.labelKey]}},{key:"getValueArray",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n="object"===(void 0===t?"undefined":k(t))?t:this.props;if(n.multi){if("string"==typeof e&&(e=e.split(n.delimiter)),!Array.isArray(e)){if(null==e)return[];e=[e]}return e.map((function(e){return I(e,n)})).filter((function(e){return e}))}var r=I(e,n);return r?[r]:[]}},{key:"setValue",value:function(e){var t=this;if(this.props.autoBlur&&this.blurInput(),this.props.required){var n=L(e,this.props.multi);this.setState({required:n})}this.props.simpleValue&&e&&(e=this.props.multi?e.map((function(e){return e[t.props.valueKey]})).join(this.props.delimiter):e[this.props.valueKey]),this.props.onChange&&this.props.onChange(e)}},{key:"selectValue",value:function(e){var t=this;this.props.closeOnSelect&&(this.hasScrolledToOption=!1);var n=this.props.onSelectResetsInput?"":this.state.inputValue;this.props.multi?this.setState({focusedIndex:null,inputValue:this.handleInputValueChange(n),isOpen:!this.props.closeOnSelect},(function(){t.getValueArray(t.props.value).some((function(n){return n[t.props.valueKey]===e[t.props.valueKey]}))?t.removeValue(e):t.addValue(e)})):this.setState({inputValue:this.handleInputValueChange(n),isOpen:!this.props.closeOnSelect,isPseudoFocused:this.state.isFocused},(function(){t.setValue(e)}))}},{key:"addValue",value:function(e){var t=this.getValueArray(this.props.value),n=this._visibleOptions.filter((function(e){return!e.disabled})),r=n.indexOf(e);this.setValue(t.concat(e)),this.props.closeOnSelect&&(n.length-1===r?this.focusOption(n[r-1]):n.length>r&&this.focusOption(n[r+1]))}},{key:"popValue",value:function(){var e=this.getValueArray(this.props.value);e.length&&!1!==e[e.length-1].clearableValue&&this.setValue(this.props.multi?e.slice(0,e.length-1):null)}},{key:"removeValue",value:function(e){var t=this,n=this.getValueArray(this.props.value);this.setValue(n.filter((function(n){return n[t.props.valueKey]!==e[t.props.valueKey]}))),this.focus()}},{key:"clearValue",value:function(e){e&&"mousedown"===e.type&&0!==e.button||(e.preventDefault(),this.setValue(this.getResetValue()),this.setState({inputValue:this.handleInputValueChange(""),isOpen:!1},this.focus),this._focusAfterClear=!0)}},{key:"getResetValue",value:function(){return void 0!==this.props.resetValue?this.props.resetValue:this.props.multi?[]:null}},{key:"focusOption",value:function(e){this.setState({focusedOption:e})}},{key:"focusNextOption",value:function(){this.focusAdjacentOption("next")}},{key:"focusPreviousOption",value:function(){this.focusAdjacentOption("previous")}},{key:"focusPageUpOption",value:function(){this.focusAdjacentOption("page_up")}},{key:"focusPageDownOption",value:function(){this.focusAdjacentOption("page_down")}},{key:"focusStartOption",value:function(){this.focusAdjacentOption("start")}},{key:"focusEndOption",value:function(){this.focusAdjacentOption("end")}},{key:"focusAdjacentOption",value:function(e){var t=this._visibleOptions.map((function(e,t){return{option:e,index:t}})).filter((function(e){return!e.option.disabled}));if(this._scrollToFocusedOptionOnUpdate=!0,!this.state.isOpen){var n={focusedOption:this._focusedOption||(t.length?t["next"===e?0:t.length-1].option:null),isOpen:!0};return this.props.onSelectResetsInput&&(n.inputValue=""),void this.setState(n)}if(t.length){for(var r=-1,a=0;a<t.length;a++)if(this._focusedOption===t[a].option){r=a;break}if("next"===e&&-1!==r)r=(r+1)%t.length;else if("previous"===e)r>0?r-=1:r=t.length-1;else if("start"===e)r=0;else if("end"===e)r=t.length-1;else if("page_up"===e){var o=r-this.props.pageSize;r=o<0?0:o}else if("page_down"===e){var l=r+this.props.pageSize;r=l>t.length-1?t.length-1:l}-1===r&&(r=0),this.setState({focusedIndex:t[r].index,focusedOption:t[r].option})}}},{key:"getFocusedOption",value:function(){return this._focusedOption}},{key:"selectFocusedOption",value:function(){if(this._focusedOption)return this.selectValue(this._focusedOption)}},{key:"renderLoading",value:function(){if(this.props.isLoading)return a.a.createElement("span",{className:"Select-loading-zone","aria-hidden":"true"},a.a.createElement("span",{className:"Select-loading"}))}},{key:"renderValue",value:function(e,t){var n=this,r=this.props.valueRenderer||this.getOptionLabel,o=this.props.valueComponent;if(!e.length)return function(e,t,n){var r=e.inputValue,a=e.isPseudoFocused,o=e.isFocused,l=t.onSelectResetsInput;return!r||!l&&!n&&!a&&!o}(this.state,this.props,t)?a.a.createElement("div",{className:"Select-placeholder"},this.props.placeholder):null;var l,i,u,s,c,f,p=this.props.onValueClick?this.handleValueClick:null;return this.props.multi?e.map((function(t,l){return a.a.createElement(o,{disabled:n.props.disabled||!1===t.clearableValue,id:n._instancePrefix+"-value-"+l,instancePrefix:n._instancePrefix,key:"value-"+l+"-"+t[n.props.valueKey],onClick:p,onRemove:n.removeValue,placeholder:n.props.placeholder,value:t,values:e},r(t,l),a.a.createElement("span",{className:"Select-aria-only"}," "))})):(l=this.state,i=this.props,u=l.inputValue,s=l.isPseudoFocused,c=l.isFocused,f=i.onSelectResetsInput,u&&(f||!c&&s||c&&!s)?void 0:(t&&(p=null),a.a.createElement(o,{disabled:this.props.disabled,id:this._instancePrefix+"-value-item",instancePrefix:this._instancePrefix,onClick:p,placeholder:this.props.placeholder,value:e[0]},r(e[0]))))}},{key:"renderInput",value:function(e,t){var n,r=this,o=p()("Select-input",this.props.inputProps.className),l=this.state.isOpen,i=p()((C(n={},this._instancePrefix+"-list",l),C(n,this._instancePrefix+"-backspace-remove-message",this.props.multi&&!this.props.disabled&&this.state.isFocused&&!this.state.inputValue),n)),u=this.state.inputValue;!u||this.props.onSelectResetsInput||this.state.isFocused||(u="");var s=_({},this.props.inputProps,{"aria-activedescendant":l?this._instancePrefix+"-option-"+t:this._instancePrefix+"-value","aria-describedby":this.props["aria-describedby"],"aria-expanded":""+l,"aria-haspopup":""+l,"aria-label":this.props["aria-label"],"aria-labelledby":this.props["aria-labelledby"],"aria-owns":i,onBlur:this.handleInputBlur,onChange:this.handleInputChange,onFocus:this.handleInputFocus,ref:function(e){return r.input=e},role:"combobox",required:this.state.required,tabIndex:this.props.tabIndex,value:u});if(this.props.inputRenderer)return this.props.inputRenderer(s);if(this.props.disabled||!this.props.searchable){var f=F(this.props.inputProps,[]),d=p()(C({},this._instancePrefix+"-list",l));return a.a.createElement("div",_({},f,{"aria-expanded":l,"aria-owns":d,"aria-activedescendant":l?this._instancePrefix+"-option-"+t:this._instancePrefix+"-value","aria-disabled":""+this.props.disabled,"aria-label":this.props["aria-label"],"aria-labelledby":this.props["aria-labelledby"],className:o,onBlur:this.handleInputBlur,onFocus:this.handleInputFocus,ref:function(e){return r.input=e},role:"combobox",style:{border:0,width:1,display:"inline-block"},tabIndex:this.props.tabIndex||0}))}return this.props.autosize?a.a.createElement(c.a,_({id:this.props.id},s,{className:o,minWidth:"5"})):a.a.createElement("div",{className:o,key:"input-wrap",style:{display:"inline-block"}},a.a.createElement("input",_({id:this.props.id},s)))}},{key:"renderClear",value:function(){var e=this.getValueArray(this.props.value);if(this.props.clearable&&e.length&&!this.props.disabled&&!this.props.isLoading){var t=this.props.multi?this.props.clearAllText:this.props.clearValueText,n=this.props.clearRenderer();return a.a.createElement("span",{"aria-label":t,className:"Select-clear-zone",onMouseDown:this.clearValue,onTouchEnd:this.handleTouchEndClearValue,onTouchMove:this.handleTouchMove,onTouchStart:this.handleTouchStart,title:t},n)}}},{key:"renderArrow",value:function(){if(this.props.arrowRenderer){var e=this.handleMouseDownOnArrow,t=this.state.isOpen,n=this.props.arrowRenderer({onMouseDown:e,isOpen:t});return n?a.a.createElement("span",{className:"Select-arrow-zone",onMouseDown:e},n):null}}},{key:"filterOptions",value:function(e){var t=this.state.inputValue,n=this.props.options||[];if(this.props.filterOptions){var r="function"==typeof this.props.filterOptions?this.props.filterOptions:b;return r(n,t,e,{filterOption:this.props.filterOption,ignoreAccents:this.props.ignoreAccents,ignoreCase:this.props.ignoreCase,labelKey:this.props.labelKey,matchPos:this.props.matchPos,matchProp:this.props.matchProp,trimFilter:this.props.trimFilter,valueKey:this.props.valueKey})}return n}},{key:"onOptionRef",value:function(e,t){t&&(this.focused=e)}},{key:"renderMenu",value:function(e,t,n){return e&&e.length?this.props.menuRenderer({focusedOption:n,focusOption:this.focusOption,inputValue:this.state.inputValue,instancePrefix:this._instancePrefix,labelKey:this.props.labelKey,onFocus:this.focusOption,onOptionRef:this.onOptionRef,onSelect:this.selectValue,optionClassName:this.props.optionClassName,optionComponent:this.props.optionComponent,optionRenderer:this.props.optionRenderer||this.getOptionLabel,options:e,removeValue:this.removeValue,selectValue:this.selectValue,valueArray:t,valueKey:this.props.valueKey}):this.props.noResultsText?a.a.createElement("div",{className:"Select-noresults"},this.props.noResultsText):null}},{key:"renderHiddenField",value:function(e){var t=this;if(this.props.name){if(this.props.joinValues){var n=e.map((function(e){return A(e[t.props.valueKey])})).join(this.props.delimiter);return a.a.createElement("input",{disabled:this.props.disabled,name:this.props.name,ref:function(e){return t.value=e},type:"hidden",value:n})}return e.map((function(e,n){return a.a.createElement("input",{disabled:t.props.disabled,key:"hidden."+n,name:t.props.name,ref:"value"+n,type:"hidden",value:A(e[t.props.valueKey])})}))}}},{key:"getFocusableOptionIndex",value:function(e){var t=this._visibleOptions;if(!t.length)return null;var n=this.props.valueKey,r=this.state.focusedOption||e;if(r&&!r.disabled){var a=-1;if(t.some((function(e,t){var o=e[n]===r[n];return o&&(a=t),o})),-1!==a)return a}for(var o=0;o<t.length;o++)if(!t[o].disabled)return o;return null}},{key:"renderOuter",value:function(e,t,n){var r=this,o=this.renderMenu(e,t,n);return o?a.a.createElement("div",{ref:function(e){return r.menuContainer=e},className:"Select-menu-outer",style:this.props.menuContainerStyle},a.a.createElement("div",{className:"Select-menu",id:this._instancePrefix+"-list",onMouseDown:this.handleMouseDownOnMenu,onScroll:this.handleMenuScroll,ref:function(e){return r.menu=e},role:"listbox",style:this.props.menuStyle,tabIndex:-1},o)):null}},{key:"render",value:function(){var e=this,t=this.getValueArray(this.props.value),n=this._visibleOptions=this.filterOptions(this.props.multi&&this.props.removeSelected?t:null),r=this.state.isOpen;this.props.multi&&!n.length&&t.length&&!this.state.inputValue&&(r=!1);var o=this.getFocusableOptionIndex(t[0]),l=null;l=this._focusedOption=null!==o?n[o]:null;var i=p()("Select",this.props.className,{"has-value":t.length,"is-clearable":this.props.clearable,"is-disabled":this.props.disabled,"is-focused":this.state.isFocused,"is-loading":this.props.isLoading,"is-open":r,"is-pseudo-focused":this.state.isPseudoFocused,"is-searchable":this.props.searchable,"Select--multi":this.props.multi,"Select--rtl":this.props.rtl,"Select--single":!this.props.multi}),u=null;return this.props.multi&&!this.props.disabled&&t.length&&!this.state.inputValue&&this.state.isFocused&&this.props.backspaceRemoves&&(u=a.a.createElement("span",{id:this._instancePrefix+"-backspace-remove-message",className:"Select-aria-only","aria-live":"assertive"},this.props.backspaceToRemoveMessage.replace("{label}",t[t.length-1][this.props.labelKey]))),a.a.createElement("div",{ref:function(t){return e.wrapper=t},className:i,style:this.props.wrapperStyle},this.renderHiddenField(t),a.a.createElement("div",{ref:function(t){return e.control=t},className:"Select-control",onKeyDown:this.handleKeyDown,onMouseDown:this.handleMouseDown,onTouchEnd:this.handleTouchEnd,onTouchMove:this.handleTouchMove,onTouchStart:this.handleTouchStart,style:this.props.style},a.a.createElement("div",{className:"Select-multi-value-wrapper",id:this._instancePrefix+"-value"},this.renderValue(t,r),this.renderInput(t,o)),u,this.renderLoading(),this.renderClear(),this.renderArrow()),r?this.renderOuter(n,t,l):null)}}]),t}(a.a.Component);z.propTypes={"aria-describedby":h.a.string,"aria-label":h.a.string,"aria-labelledby":h.a.string,arrowRenderer:h.a.func,autoBlur:h.a.bool,autoFocus:h.a.bool,autofocus:h.a.bool,autosize:h.a.bool,backspaceRemoves:h.a.bool,backspaceToRemoveMessage:h.a.string,className:h.a.string,clearAllText:T,clearRenderer:h.a.func,clearValueText:T,clearable:h.a.bool,closeOnSelect:h.a.bool,deleteRemoves:h.a.bool,delimiter:h.a.string,disabled:h.a.bool,escapeClearsValue:h.a.bool,filterOption:h.a.func,filterOptions:h.a.any,id:h.a.string,ignoreAccents:h.a.bool,ignoreCase:h.a.bool,inputProps:h.a.object,inputRenderer:h.a.func,instanceId:h.a.string,isLoading:h.a.bool,joinValues:h.a.bool,labelKey:h.a.string,matchPos:h.a.string,matchProp:h.a.string,menuBuffer:h.a.number,menuContainerStyle:h.a.object,menuRenderer:h.a.func,menuStyle:h.a.object,multi:h.a.bool,name:h.a.string,noResultsText:T,onBlur:h.a.func,onBlurResetsInput:h.a.bool,onChange:h.a.func,onClose:h.a.func,onCloseResetsInput:h.a.bool,onFocus:h.a.func,onInputChange:h.a.func,onInputKeyDown:h.a.func,onMenuScrollToBottom:h.a.func,onOpen:h.a.func,onSelectResetsInput:h.a.bool,onValueClick:h.a.func,openOnClick:h.a.bool,openOnFocus:h.a.bool,optionClassName:h.a.string,optionComponent:h.a.func,optionRenderer:h.a.func,options:h.a.array,pageSize:h.a.number,placeholder:T,removeSelected:h.a.bool,required:h.a.bool,resetValue:h.a.any,rtl:h.a.bool,scrollMenuIntoView:h.a.bool,searchable:h.a.bool,simpleValue:h.a.bool,style:h.a.object,tabIndex:M,tabSelectsValue:h.a.bool,trimFilter:h.a.bool,value:h.a.any,valueComponent:h.a.func,valueKey:h.a.string,valueRenderer:h.a.func,wrapperStyle:h.a.object},z.defaultProps={arrowRenderer:m,autosize:!0,backspaceRemoves:!0,backspaceToRemoveMessage:"Press backspace to remove {label}",clearable:!0,clearAllText:"Clear all",clearRenderer:function(){return a.a.createElement("span",{className:"Select-clear",dangerouslySetInnerHTML:{__html:"&times;"}})},clearValueText:"Clear value",closeOnSelect:!0,deleteRemoves:!0,delimiter:",",disabled:!1,escapeClearsValue:!0,filterOptions:b,ignoreAccents:!0,ignoreCase:!0,inputProps:{},isLoading:!1,joinValues:!1,labelKey:"label",matchPos:"any",matchProp:"any",menuBuffer:0,menuRenderer:E,multi:!1,noResultsText:"No results found",onBlurResetsInput:!0,onCloseResetsInput:!0,onSelectResetsInput:!0,openOnClick:!0,optionComponent:P,pageSize:5,placeholder:"Select...",removeSelected:!0,required:!1,rtl:!1,scrollMenuIntoView:!0,searchable:!0,simpleValue:!1,tabSelectsValue:!0,trimFilter:!0,valueComponent:N,valueKey:"value"};var V={autoload:h.a.bool.isRequired,cache:h.a.any,children:h.a.func.isRequired,ignoreAccents:h.a.bool,ignoreCase:h.a.bool,loadOptions:h.a.func.isRequired,loadingPlaceholder:h.a.oneOfType([h.a.string,h.a.node]),multi:h.a.bool,noResultsText:h.a.oneOfType([h.a.string,h.a.node]),onChange:h.a.func,onInputChange:h.a.func,options:h.a.array.isRequired,placeholder:h.a.oneOfType([h.a.string,h.a.node]),searchPromptText:h.a.oneOfType([h.a.string,h.a.node]),value:h.a.any},j={},B={autoload:!0,cache:j,children:function(e){return a.a.createElement(z,e)},ignoreAccents:!0,ignoreCase:!0,loadingPlaceholder:"Loading...",options:[],searchPromptText:"Type to search"},U=function(e){function t(e,n){S(this,t);var r=D(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r._cache=e.cache===j?{}:e.cache,r.state={inputValue:"",isLoading:!1,options:e.options},r.onInputChange=r.onInputChange.bind(r),r}return O(t,e),x(t,[{key:"componentDidMount",value:function(){this.props.autoload&&this.loadOptions("")}},{key:"componentWillReceiveProps",value:function(e){e.options!==this.props.options&&this.setState({options:e.options})}},{key:"componentWillUnmount",value:function(){this._callback=null}},{key:"loadOptions",value:function(e){var t=this,n=this.props.loadOptions,r=this._cache;if(r&&Object.prototype.hasOwnProperty.call(r,e))return this._callback=null,void this.setState({isLoading:!1,options:r[e]});var a=function n(a,o){var l=o&&o.options||[];r&&(r[e]=l),n===t._callback&&(t._callback=null,t.setState({isLoading:!1,options:l}))};this._callback=a;var o=n(e,a);o&&o.then((function(e){return a(0,e)}),(function(e){return a()})),this._callback&&!this.state.isLoading&&this.setState({isLoading:!0})}},{key:"onInputChange",value:function(e){var t=this.props,n=t.ignoreAccents,r=t.ignoreCase,a=t.onInputChange,o=e;if(a){var l=a(o);null!=l&&"object"!==(void 0===l?"undefined":k(l))&&(o=""+l)}var i=o;return n&&(i=g(i)),r&&(i=i.toLowerCase()),this.setState({inputValue:o}),this.loadOptions(i),o}},{key:"noResultsText",value:function(){var e=this.props,t=e.loadingPlaceholder,n=e.noResultsText,r=e.searchPromptText,a=this.state,o=a.inputValue;return a.isLoading?t:o&&n?n:r}},{key:"focus",value:function(){this.select.focus()}},{key:"render",value:function(){var e=this,t=this.props,n=t.children,r=t.loadingPlaceholder,a=t.placeholder,o=this.state,l=o.isLoading,i=o.options,u={noResultsText:this.noResultsText(),placeholder:l?r:a,options:l&&r?[]:i,ref:function(t){return e.select=t}};return n(_({},this.props,u,{isLoading:l,onInputChange:this.onInputChange}))}}]),t}(r.Component);U.propTypes=V,U.defaultProps=B;var W=function(e){function t(e,n){S(this,t);var r=D(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.filterOptions=r.filterOptions.bind(r),r.menuRenderer=r.menuRenderer.bind(r),r.onInputKeyDown=r.onInputKeyDown.bind(r),r.onInputChange=r.onInputChange.bind(r),r.onOptionSelect=r.onOptionSelect.bind(r),r}return O(t,e),x(t,[{key:"createNewOption",value:function(){var e=this.props,t=e.isValidNewOption,n=e.newOptionCreator,r=e.onNewOptionClick,a=e.options,o=void 0===a?[]:a;if(t({label:this.inputValue})){var l=n({label:this.inputValue,labelKey:this.labelKey,valueKey:this.valueKey});this.isOptionUnique({option:l,options:o})&&(r?r(l):(o.unshift(l),this.select.selectValue(l)))}}},{key:"filterOptions",value:function(){var e=this.props,t=e.filterOptions,n=e.isValidNewOption,r=e.promptTextCreator,a=e.showNewOptionAtTop,o=(arguments.length<=2?void 0:arguments[2])||[],l=t.apply(void 0,arguments)||[];if(n({label:this.inputValue})){var i=this.props.newOptionCreator,u=i({label:this.inputValue,labelKey:this.labelKey,valueKey:this.valueKey}),s=this.isOptionUnique({option:u,options:o.concat(l)});if(s){var c=r(this.inputValue);this._createPlaceholderOption=i({label:c,labelKey:this.labelKey,valueKey:this.valueKey}),a?l.unshift(this._createPlaceholderOption):l.push(this._createPlaceholderOption)}}return l}},{key:"isOptionUnique",value:function(e){var t=e.option,n=e.options,r=this.props.isOptionUnique;return n=n||this.props.options,r({labelKey:this.labelKey,option:t,options:n,valueKey:this.valueKey})}},{key:"menuRenderer",value:function(e){var t=this.props.menuRenderer;return t(_({},e,{onSelect:this.onOptionSelect,selectValue:this.onOptionSelect}))}},{key:"onInputChange",value:function(e){var t=this.props.onInputChange;return this.inputValue=e,t&&(this.inputValue=t(e)),this.inputValue}},{key:"onInputKeyDown",value:function(e){var t=this.props,n=t.shouldKeyDownEventCreateNewOption,r=t.onInputKeyDown,a=this.select.getFocusedOption();a&&a===this._createPlaceholderOption&&n(e)?(this.createNewOption(),e.preventDefault()):r&&r(e)}},{key:"onOptionSelect",value:function(e){e===this._createPlaceholderOption?this.createNewOption():this.select.selectValue(e)}},{key:"focus",value:function(){this.select.focus()}},{key:"render",value:function(){var e=this,t=this.props,n=t.ref,r=F(t,["ref"]),a=this.props.children;return a||(a=$),a(_({},r,{allowCreate:!0,filterOptions:this.filterOptions,menuRenderer:this.menuRenderer,onInputChange:this.onInputChange,onInputKeyDown:this.onInputKeyDown,ref:function(t){e.select=t,t&&(e.labelKey=t.props.labelKey,e.valueKey=t.props.valueKey),n&&n(t)}}))}}]),t}(a.a.Component),$=function(e){return a.a.createElement(z,e)},K=function(e){var t=e.option,n=e.options,r=e.labelKey,a=e.valueKey;return!n||!n.length||0===n.filter((function(e){return e[r]===t[r]||e[a]===t[a]})).length},H=function(e){return!!e.label},q=function(e){var t=e.label,n=e.labelKey,r={};return r[e.valueKey]=t,r[n]=t,r.className="Select-create-option-placeholder",r},Q=function(e){return'Create option "'+e+'"'},Y=function(e){switch(e.keyCode){case 9:case 13:case 188:return!0;default:return!1}};W.isOptionUnique=K,W.isValidNewOption=H,W.newOptionCreator=q,W.promptTextCreator=Q,W.shouldKeyDownEventCreateNewOption=Y,W.defaultProps={filterOptions:b,isOptionUnique:K,isValidNewOption:H,menuRenderer:E,newOptionCreator:q,promptTextCreator:Q,shouldKeyDownEventCreateNewOption:Y,showNewOptionAtTop:!0},W.propTypes={children:h.a.func,filterOptions:h.a.any,isOptionUnique:h.a.func,isValidNewOption:h.a.func,menuRenderer:h.a.any,newOptionCreator:h.a.func,onInputChange:h.a.func,onInputKeyDown:h.a.func,onNewOptionClick:h.a.func,options:h.a.array,promptTextCreator:h.a.func,ref:h.a.func,shouldKeyDownEventCreateNewOption:h.a.func,showNewOptionAtTop:h.a.bool};var G=function(e){function t(){return S(this,t),D(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return O(t,e),x(t,[{key:"focus",value:function(){this.select.focus()}},{key:"render",value:function(){var e=this;return a.a.createElement(U,this.props,(function(t){var n=t.ref,r=F(t,["ref"]),o=n;return a.a.createElement(W,r,(function(t){var n=t.ref,r=F(t,["ref"]),a=n;return e.props.children(_({},r,{ref:function(t){a(t),o(t),e.select=t}}))}))}))}}]),t}(a.a.Component);G.propTypes={children:h.a.func.isRequired},G.defaultProps={children:function(e){return a.a.createElement(z,e)}},z.Async=U,z.AsyncCreatable=G,z.Creatable=W,z.Value=N,z.Option=P;var X=z,J=n(5);var Z=({percent:e=0})=>r.createElement("div",{className:"progress"},r.createElement("div",{className:"progress-bar"},r.createElement("div",{className:"complete",style:{width:e+"%"}})));const ee=[{value:"deb",label:"Ubuntu (deb)"},{value:"tar.gz",label:"Linux (tar.gz)"},{value:"nope",label:"I'll figure it out"}],te=`https://discord.com/api/download/${DiscordSplash.getReleaseChannel()}?platform=linux&format=`;var ne=u()({displayName:"Splash",setInterval(e,t){this.clearInterval(),this._interval=window.setInterval(t,e)},clearInterval(){this._interval&&(window.clearInterval(this._interval),this._interval=null)},componentWillUnmount(){this.clearInterval()},getInitialState:()=>({quote:J[Math.floor(Math.random()*J.length)],videoLoaded:!1,status:"checking-for-updates",update:{},selectedDownload:"deb"}),componentDidMount(){l.a.findDOMNode(this.refs.video).addEventListener("loadeddata",this.handleVideoLoaded),this.setInterval(1e3,this.updateCountdownSeconds),DiscordSplash.onStateUpdate(e=>{this.setState({update:e})}),DiscordSplash.onQuoteUpdate(e=>{this.setState({quote:e})}),DiscordSplash.signalReady()},updateCountdownSeconds(){if(this.state.update.seconds>0){const e=this.state.update;e.seconds-=1,this.setState({update:e})}},handleVideoLoaded(){this.setState({videoLoaded:!0})},handleDownloadChanged(e){this.setState({selectedDownload:e.value})},handleDownload(){if("nope"!==this.state.selectedDownload){const e=te+this.state.selectedDownload;DiscordSplash.openUrl(e,{activate:!0})}DiscordSplash.quitDiscord()},render(){let e,t=a.a.createElement("div",{className:"progress-placeholder"}," ");switch(this.state.update.status){case"installing-updates":e=a.a.createElement("span",null,"Installing Update ",this.state.update.current," of ",this.state.update.total),"number"==typeof this.state.update.progress&&(t=a.a.createElement(Z,{percent:this.state.update.progress}));break;case"downloading-updates":e=a.a.createElement("span",null,"Downloading Update ",this.state.update.current," of ",this.state.update.total),"number"==typeof this.state.update.progress&&(t=a.a.createElement(Z,{percent:this.state.update.progress}));break;case"update-failure":e=a.a.createElement("span",null,"Update Failed — Retrying in ",this.state.update.seconds," sec");break;case"launching":e=a.a.createElement("span",null,"Starting…");break;case"update-manually":const n="nope"!=this.state.selectedDownload?"Download":"Okay";return a.a.createElement("div",{id:"splash"},a.a.createElement("div",{className:"splash-inner-dl"},a.a.createElement("div",{className:"dice-image"}),a.a.createElement("div",{className:"dl-update-message"},"Must be your lucky day, there’s a new update!"),a.a.createElement("div",{className:"dl-select-frame"},a.a.createElement(X,{value:this.state.selectedDownload,autosize:!1,clearable:!1,searchable:!1,options:ee,disabled:!1,onChange:this.handleDownloadChanged}),a.a.createElement("div",{className:"dl-button",onClick:this.handleDownload},n)),a.a.createElement("div",{className:"dl-version-message"},"Version ",this.state.update.newVersion," available")));case"checking-for-updates":default:e=a.a.createElement("span",null,"Checking For Updates")}return a.a.createElement("div",{id:"splash"},a.a.createElement("div",{className:"splash-inner"},a.a.createElement("video",{autoPlay:!0,width:200,height:200,loop:!0,ref:"video",className:this.state.videoLoaded?"loaded":void 0},a.a.createElement("source",{src:"../videos/connecting.webm",type:"video/webm"})),a.a.createElement("div",{className:"splash-text"},a.a.createElement("span",{className:"splash-status"},e),t)))}});l.a.render(a.a.createElement(ne,null),document.getElementById("splash-mount"))}]);{
  "width": "300px",
  "height": "300px",
  "inDuration": 700,
  "outDuration": 333
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = exports.APP_SHOULD_SHOW = exports.APP_SHOULD_LAUNCH = void 0;
exports.focusWindow = focusWindow;
exports.initSplash = initSplash;
exports.pageReady = pageReady;

var _electron = require("electron");

var _events = require("events");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

var _Backoff = _interopRequireDefault(require("../common/Backoff"));

var moduleUpdater = _interopRequireWildcard(require("../common/moduleUpdater"));

var paths = _interopRequireWildcard(require("../common/paths"));

var _securityUtils = require("../common/securityUtils");

var _updater = require("../common/updater");

var _ipcMain = _interopRequireDefault(require("./ipcMain"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UPDATE_TIMEOUT_WAIT = 10000;
const RETRY_CAP_SECONDS = 60; // citron note: atom seems to add about 50px height to the frame on mac but not windows
// TODO: see if we can eliminate fudge by using useContentSize BrowserWindow option

const LOADING_WINDOW_WIDTH = 300;
const LOADING_WINDOW_HEIGHT = process.platform === 'darwin' ? 300 : 350; // TODO: addModulesListener events should use Module's constants

const CHECKING_FOR_UPDATES = 'checking-for-updates';
const UPDATE_CHECK_FINISHED = 'update-check-finished';
const UPDATE_FAILURE = 'update-failure';
const LAUNCHING = 'launching';
const DOWNLOADING_MODULE = 'downloading-module';
const DOWNLOADING_UPDATES = 'downloading-updates';
const DOWNLOADING_MODULES_FINISHED = 'downloading-modules-finished';
const DOWNLOADING_MODULE_PROGRESS = 'downloading-module-progress';
const DOWNLOADED_MODULE = 'downloaded-module';
const NO_PENDING_UPDATES = 'no-pending-updates';
const INSTALLING_MODULE = 'installing-module';
const INSTALLING_UPDATES = 'installing-updates';
const INSTALLED_MODULE = 'installed-module';
const INSTALLING_MODULE_PROGRESS = 'installing-module-progress';
const INSTALLING_MODULES_FINISHED = 'installing-modules-finished';
const UPDATE_MANUALLY = 'update-manually';
const APP_SHOULD_LAUNCH = 'APP_SHOULD_LAUNCH';
exports.APP_SHOULD_LAUNCH = APP_SHOULD_LAUNCH;
const APP_SHOULD_SHOW = 'APP_SHOULD_SHOW';
exports.APP_SHOULD_SHOW = APP_SHOULD_SHOW;
const events = new _events.EventEmitter();
exports.events = events;

function webContentsSend(win, event, ...args) {
  if (win != null && win.webContents != null) {
    win.webContents.send(`DISCORD_${event}`, ...args);
  }
}

let splashWindow;
let modulesListeners;
let updateTimeout;
let updateAttempt;
let splashState;
let launchedMainWindow;
let quoteCachePath;
let restartRequired = false;
let newUpdater;
const updateBackoff = new _Backoff.default(1000, 30000); // TODO(eiz): some of this logic should probably not live in the splash.
//
// Disabled because Rust interop stuff is going on in here.

/* eslint-disable camelcase */

class TaskProgress {
  constructor() {
    this.inProgress = new Map();
    this.finished = new Set();
    this.allTasks = new Set();
  }

  recordProgress(progress, task) {
    this.allTasks.add(task.package_sha256);

    if (progress.state !== _updater.TASK_STATE_WAITING) {
      this.inProgress.set(task.package_sha256, progress.percent);

      if (progress.state === _updater.TASK_STATE_COMPLETE) {
        this.finished.add(task.package_sha256);
      }
    }
  }

  updateSplashState(newState) {
    if (this.inProgress.size > 0 && this.inProgress.size > this.finished.size) {
      let totalPercent = 0;

      for (const item of this.inProgress.values()) {
        totalPercent += item;
      }

      totalPercent /= this.allTasks.size;
      splashState = {
        current: this.finished.size + 1,
        total: this.allTasks.size,
        progress: totalPercent
      };
      updateSplashState(newState);
      return true;
    }

    return false;
  }

}

async function updateUntilCurrent() {
  const retryOptions = {
    skip_host_delta: false,
    skip_module_delta: {}
  };

  while (true) {
    updateSplashState(CHECKING_FOR_UPDATES);

    try {
      let installedAnything = false;
      const downloads = new TaskProgress();
      const installs = new TaskProgress();
      await newUpdater.updateToLatestWithOptions(retryOptions, progress => {
        const task = progress.task;
        const downloadTask = task.HostDownload || task.ModuleDownload;
        const installTask = task.HostInstall || task.ModuleInstall;
        installedAnything = true;

        if (downloadTask != null) {
          downloads.recordProgress(progress, downloadTask);
        }

        if (installTask != null) {
          installs.recordProgress(progress, installTask);

          if (progress.state.Failed != null) {
            if (task.HostInstall != null) {
              retryOptions.skip_host_delta = true;
            } else if (task.ModuleInstall != null) {
              retryOptions.skip_module_delta[installTask.version.module.name] = true;
            }
          }
        }

        if (!downloads.updateSplashState(DOWNLOADING_UPDATES)) {
          installs.updateSplashState(INSTALLING_UPDATES);
        }
      });

      if (!installedAnything) {
        await newUpdater.startCurrentVersion();
        newUpdater.setRunningInBackground();
        newUpdater.collectGarbage();
        launchMainWindow();
        updateBackoff.succeed();
        updateSplashState(LAUNCHING);
        return;
      }
    } catch (e) {
      console.error('Update failed', e);
      await new Promise(resolve => {
        const delayMs = updateBackoff.fail(resolve);
        splashState.seconds = Math.round(delayMs / 1000);
        updateSplashState(UPDATE_FAILURE);
      });
    }
  }
}
/* eslint-enable camelcase */


function initOldUpdater() {
  modulesListeners = {};
  addModulesListener(CHECKING_FOR_UPDATES, () => {
    startUpdateTimeout();
    updateSplashState(CHECKING_FOR_UPDATES);
  });
  addModulesListener(UPDATE_CHECK_FINISHED, ({
    succeeded,
    updateCount,
    manualRequired
  }) => {
    stopUpdateTimeout();

    if (!succeeded) {
      scheduleUpdateCheck();
      updateSplashState(UPDATE_FAILURE);
    } else if (updateCount === 0) {
      moduleUpdater.setInBackground();
      launchMainWindow();
      updateSplashState(LAUNCHING);
    }
  });
  addModulesListener(DOWNLOADING_MODULE, ({
    name,
    current,
    total
  }) => {
    stopUpdateTimeout();
    splashState = {
      current,
      total
    };
    updateSplashState(DOWNLOADING_UPDATES);
  });
  addModulesListener(DOWNLOADING_MODULE_PROGRESS, ({
    name,
    progress
  }) => {
    splashState.progress = progress;
    updateSplashState(DOWNLOADING_UPDATES);
  });
  addModulesListener(DOWNLOADED_MODULE, ({
    name,
    current,
    total,
    succeeded
  }) => {
    delete splashState.progress;

    if (name === 'host') {
      restartRequired = true;
    }
  });
  addModulesListener(DOWNLOADING_MODULES_FINISHED, ({
    succeeded,
    failed
  }) => {
    if (failed > 0) {
      scheduleUpdateCheck();
      updateSplashState(UPDATE_FAILURE);
    } else {
      process.nextTick(() => {
        if (restartRequired) {
          moduleUpdater.quitAndInstallUpdates();
        } else {
          moduleUpdater.installPendingUpdates();
        }
      });
    }
  });
  addModulesListener(NO_PENDING_UPDATES, () => moduleUpdater.checkForUpdates());
  addModulesListener(INSTALLING_MODULE, ({
    name,
    current,
    total
  }) => {
    splashState = {
      current,
      total
    };
    updateSplashState(INSTALLING_UPDATES);
  });
  addModulesListener(INSTALLED_MODULE, ({
    name,
    current,
    total,
    succeeded
  }) => delete splashState.progress);
  addModulesListener(INSTALLING_MODULE_PROGRESS, ({
    name,
    progress
  }) => {
    splashState.progress = progress;
    updateSplashState(INSTALLING_UPDATES);
  });
  addModulesListener(INSTALLING_MODULES_FINISHED, ({
    succeeded,
    failed
  }) => moduleUpdater.checkForUpdates());
  addModulesListener(UPDATE_MANUALLY, ({
    newVersion
  }) => {
    splashState.newVersion = newVersion;
    updateSplashState(UPDATE_MANUALLY);
  });
}

function initSplash(startMinimized = false) {
  splashState = {};
  launchedMainWindow = false;
  updateAttempt = 0;
  newUpdater = (0, _updater.getUpdater)();

  if (newUpdater == null) {
    initOldUpdater();
  }

  launchSplashWindow(startMinimized);
  quoteCachePath = _path.default.join(paths.getUserData(), 'quotes.json');

  _ipcMain.default.on('UPDATED_QUOTES', (_event, quotes) => cacheLatestQuotes(quotes));
}

function destroySplash() {
  stopUpdateTimeout();

  if (splashWindow) {
    splashWindow.setSkipTaskbar(true); // defer the window hiding for a short moment so it gets covered by the main window

    const _nukeWindow = () => {
      if (splashWindow != null) {
        splashWindow.hide();
        splashWindow.close();
        splashWindow = null;
      }
    };

    setTimeout(_nukeWindow, 100);
  }
}

function addModulesListener(event, listener) {
  if (newUpdater != null) return;
  modulesListeners[event] = listener;
  moduleUpdater.events.addListener(event, listener);
}

function removeModulesListeners() {
  if (newUpdater != null) return;

  for (const event of Object.keys(modulesListeners)) {
    moduleUpdater.events.removeListener(event, modulesListeners[event]);
  }
}

function startUpdateTimeout() {
  if (!updateTimeout) {
    updateTimeout = setTimeout(() => scheduleUpdateCheck(), UPDATE_TIMEOUT_WAIT);
  }
}

function stopUpdateTimeout() {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
    updateTimeout = null;
  }
}

function updateSplashState(event) {
  if (splashWindow != null && !splashWindow.isDestroyed() && !splashWindow.webContents.isDestroyed()) {
    webContentsSend(splashWindow, 'SPLASH_UPDATE_STATE', {
      status: event,
      ...splashState
    });
  }
}

function launchSplashWindow(startMinimized) {
  const windowConfig = {
    width: LOADING_WINDOW_WIDTH,
    height: LOADING_WINDOW_HEIGHT,
    transparent: false,
    frame: false,
    resizable: false,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: _path.default.join(__dirname, 'splashScreenPreload.js')
    }
  };
  splashWindow = new _electron.BrowserWindow(windowConfig); // prevent users from dropping links to navigate in splash window

  splashWindow.webContents.on('will-navigate', e => e.preventDefault());
  splashWindow.webContents.on('new-window', (e, windowURL) => {
    e.preventDefault();
    (0, _securityUtils.saferShellOpenExternal)(windowURL); // exit, but delay half a second because openExternal is about to fire
    // some events to things that are freed by app.quit.

    setTimeout(_electron.app.quit, 500);
  });

  if (process.platform !== 'darwin') {
    // citron note: this causes a crash on quit while the window is open on osx
    splashWindow.on('closed', () => {
      splashWindow = null;

      if (!launchedMainWindow) {
        // user has closed this window before we launched the app, so let's quit
        _electron.app.quit();
      }
    });
  }

  _ipcMain.default.on('SPLASH_SCREEN_READY', () => {
    const cachedQuote = chooseCachedQuote();

    if (cachedQuote) {
      webContentsSend(splashWindow, 'SPLASH_SCREEN_QUOTE', cachedQuote);
    }

    if (splashWindow && !startMinimized) {
      splashWindow.show();
    }

    if (newUpdater != null) {
      updateUntilCurrent();
    } else {
      moduleUpdater.installPendingUpdates();
    }
  });

  _ipcMain.default.on('SPLASH_SCREEN_QUIT', () => {
    _electron.app.quit();
  });

  const splashUrl = _url.default.format({
    protocol: 'file',
    slashes: true,
    pathname: _path.default.join(__dirname, 'splash', 'index.html')
  });

  splashWindow.loadURL(splashUrl);
}

function launchMainWindow() {
  removeModulesListeners();

  if (!launchedMainWindow && splashWindow != null) {
    launchedMainWindow = true;
    events.emit(APP_SHOULD_LAUNCH);
  }
}

function scheduleUpdateCheck() {
  // TODO: can we use backoff here?
  updateAttempt += 1;
  const retryInSeconds = Math.min(updateAttempt * 10, RETRY_CAP_SECONDS);
  splashState.seconds = retryInSeconds;
  setTimeout(() => moduleUpdater.checkForUpdates(), retryInSeconds * 1000);
}

function focusWindow() {
  if (splashWindow != null) {
    splashWindow.focus();
  }
}

function pageReady() {
  destroySplash();
  process.nextTick(() => events.emit(APP_SHOULD_SHOW));
}

function cacheLatestQuotes(quotes) {
  _fs.default.writeFile(quoteCachePath, JSON.stringify(quotes), e => {
    if (e) {
      console.warn('Failed updating quote cache with error: ', e);
    }
  });
}

function chooseCachedQuote() {
  let cachedQuote = null;

  try {
    const cachedQuotes = JSON.parse(_fs.default.readFileSync(quoteCachePath));
    cachedQuote = cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
  } catch (_err) {}

  return cachedQuote;
}"use strict";

const {
  app,
  contextBridge,
  ipcRenderer
} = require('electron');

const {
  saferShellOpenExternal
} = require('../common/securityUtils');

contextBridge.exposeInMainWorld('DiscordSplash', {
  getReleaseChannel: () => {
    const buildInfo = require('./buildInfo');

    return buildInfo.releaseChannel;
  },
  signalReady: () => {
    ipcRenderer.send('DISCORD_SPLASH_SCREEN_READY');
  },
  onStateUpdate: callback => {
    ipcRenderer.on('DISCORD_SPLASH_UPDATE_STATE', (_, state) => {
      callback(state);
    });
  },
  onQuoteUpdate: callback => {
    ipcRenderer.on('DISCORD_SPLASH_SCREEN_QUOTE', (_, quote) => {
      callback(quote);
    });
  },
  openUrl: saferShellOpenExternal,
  quitDiscord: () => {
    ipcRenderer.send('DISCORD_SPLASH_SCREEN_QUIT');
  }
});"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleStartupEvent = handleStartupEvent;
exports.installProtocol = installProtocol;
exports.restart = restart;
exports.spawnUpdate = spawnUpdate;
exports.spawnUpdateInstall = spawnUpdateInstall;
exports.updateExistsSync = updateExistsSync;

var _child_process = _interopRequireDefault(require("child_process"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var autoStart = _interopRequireWildcard(require("./autoStart"));

var windowsUtils = _interopRequireWildcard(require("./windowsUtils"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// citron note: this assumes the execPath is in the format Discord/someVersion/Discord.exe
const appFolder = _path.default.resolve(process.execPath, '..');

const rootFolder = _path.default.resolve(appFolder, '..');

const exeName = _path.default.basename(process.execPath);

const updateExe = _path.default.join(rootFolder, 'Update.exe'); // Specialized spawn function specifically used for spawning the updater in
// update mode. Calls back with progress percentages.
// Returns Promise.


function spawnUpdateInstall(updateUrl, progressCallback) {
  return new Promise((resolve, reject) => {
    const proc = _child_process.default.spawn(updateExe, ['--update', updateUrl]);

    proc.on('error', reject);
    proc.on('exit', code => {
      if (code !== 0) {
        return reject(new Error(`Update failed with exit code ${code}`));
      }

      return resolve();
    });
    let lastProgress = -1;

    function parseProgress() {
      const lines = stdout.split(/\r?\n/);
      if (lines.length === 1) return; // return the last (possibly incomplete) line to stdout for parsing again

      stdout = lines.pop();
      let currentProgress;

      for (const line of lines) {
        if (!/^\d\d?$/.test(line)) continue;
        const progress = Number(line); // make sure that this number is steadily increasing

        if (lastProgress > progress) continue;
        currentProgress = progress;
      }

      if (currentProgress == null) return;
      lastProgress = currentProgress;
      progressCallback(Math.min(currentProgress, 100));
    }

    let stdout = '';
    proc.stdout.on('data', chunk => {
      stdout += String(chunk);
      parseProgress();
    });
  });
} // Spawn the Update.exe with the given arguments and invoke the callback when
// the command completes.


function spawnUpdate(args, callback) {
  windowsUtils.spawn(updateExe, args, callback);
} // Create a desktop and start menu shortcut by using the command line API
// provided by Squirrel's Update.exe


function createShortcuts(callback, updateOnly) {
  // move icon out to a more stable location, to keep shortcuts from breaking as much
  const icoSrc = _path.default.join(appFolder, 'app.ico');

  const icoDest = _path.default.join(rootFolder, 'app.ico');

  let icoForTarget = icoDest;

  try {
    const ico = _fs.default.readFileSync(icoSrc);

    _fs.default.writeFileSync(icoDest, ico);
  } catch (e) {
    // if we can't write there for some reason, just use the source.
    icoForTarget = icoSrc;
  }

  const createShortcutArgs = ['--createShortcut', exeName, '--setupIcon', icoForTarget];

  if (updateOnly) {
    createShortcutArgs.push('--updateOnly');
  }

  spawnUpdate(createShortcutArgs, callback);
} // Add a protocol registration for this application.


function installProtocol(protocol, callback) {
  const queue = [['HKCU\\Software\\Classes\\' + protocol, '/ve', '/d', `URL:${protocol} Protocol`], ['HKCU\\Software\\Classes\\' + protocol, '/v', 'URL Protocol'], ['HKCU\\Software\\Classes\\' + protocol + '\\DefaultIcon', '/ve', '/d', '"' + process.execPath + '",-1'], ['HKCU\\Software\\Classes\\' + protocol + '\\shell\\open\\command', '/ve', '/d', `"${process.execPath}" --url -- "%1"`]];
  windowsUtils.addToRegistry(queue, callback);
}

function terminate(app) {
  app.quit();
  process.exit(0);
} // Remove the desktop and start menu shortcuts by using the command line API
// provided by Squirrel's Update.exe


function removeShortcuts(callback) {
  spawnUpdate(['--removeShortcut', exeName], callback);
} // Update the desktop and start menu shortcuts by using the command line API
// provided by Squirrel's Update.exe


function updateShortcuts(callback) {
  createShortcuts(callback, true);
} // Purge the protocol for this applicationstart.


function uninstallProtocol(protocol, callback) {
  windowsUtils.spawnReg(['delete', 'HKCU\\Software\\Classes\\' + protocol, '/f'], callback);
}

function maybeInstallNewUpdaterSeedDb() {
  const installerDbSrc = _path.default.join(appFolder, 'installer.db');

  const installerDbDest = _path.default.join(rootFolder, 'installer.db');

  if (_fs.default.existsSync(installerDbSrc)) {
    _fs.default.renameSync(installerDbSrc, installerDbDest);
  }
} // Handle squirrel events denoted by --squirrel-* command line arguments.
// returns `true` if regular startup should be prevented


function handleStartupEvent(protocol, app, squirrelCommand) {
  switch (squirrelCommand) {
    case '--squirrel-install':
      createShortcuts(() => {
        autoStart.install(() => {
          installProtocol(protocol, () => {
            // Squirrel doesn't have a way to include app-level files.
            // We get around this for new updater hosts, which rely on
            // a seeded manifest, by bubbling the db up from the versioned-app
            // directory if it exists.
            maybeInstallNewUpdaterSeedDb();
            terminate(app);
          });
        });
      }, false);
      return true;

    case '--squirrel-updated':
      updateShortcuts(() => {
        autoStart.update(() => {
          installProtocol(protocol, () => {
            terminate(app);
          });
        });
      });
      return true;

    case '--squirrel-uninstall':
      removeShortcuts(() => {
        autoStart.uninstall(() => {
          uninstallProtocol(protocol, () => {
            terminate(app);
          });
        });
      });
      return true;

    case '--squirrel-obsolete':
      terminate(app);
      return true;

    default:
      return false;
  }
} // Are we using Squirrel for updates?


function updateExistsSync() {
  return _fs.default.existsSync(updateExe);
} // Restart app as the new version


function restart(app, newVersion) {
  app.once('will-quit', () => {
    const execPath = _path.default.resolve(rootFolder, `app-${newVersion}/${exeName}`);

    _child_process.default.spawn(execPath, [], {
      detached: true
    });
  });
  app.quit();
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _default = [{
  label: 'Discord',
  submenu: [{
    label: 'Quit',
    click: () => _electron.app.quit(),
    accelerator: 'Command+Q'
  }]
}];
exports.default = _default;
module.exports = exports.default;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

const menu = require('./' + process.platform);

var _default = _electron.Menu.buildFromTemplate(menu);

exports.default = _default;
module.exports = exports.default;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _default = [{
  label: '&File',
  submenu: [{
    label: '&Exit',
    click: () => _electron.app.quit(),
    accelerator: 'Control+Q'
  }]
}];
exports.default = _default;
module.exports = exports.default;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _default = [{
  label: '&File',
  submenu: [{
    label: '&Exit',
    click: () => _electron.app.quit(),
    accelerator: 'Alt+F4'
  }]
}];
exports.default = _default;
module.exports = exports.default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToRegistry = addToRegistry;
exports.spawn = spawn;
exports.spawnReg = spawnReg;

var _child_process = _interopRequireDefault(require("child_process"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const regExe = process.env.SystemRoot ? _path.default.join(process.env.SystemRoot, 'System32', 'reg.exe') : 'reg.exe'; // Spawn a command and invoke the callback when it completes with an error
// and the output from standard out.

function spawn(command, args, callback) {
  let stdout = '';
  let spawnedProcess;

  try {
    // TODO: contrary to below, it should not throw any error
    spawnedProcess = _child_process.default.spawn(command, args);
  } catch (err) {
    // Spawn can throw an error
    process.nextTick(() => {
      if (callback != null) {
        callback(err, stdout);
      }
    });
    return;
  } // TODO: we need to specify the encoding for the data if we're going to concat it as a string


  spawnedProcess.stdout.on('data', data => {
    stdout += data;
  });
  let err = null; // TODO: close event might not get called, we should
  //       callback on error https://nodejs.org/api/child_process.html#child_process_event_error

  spawnedProcess.on('error', err => {
    // TODO: there should always be an error
    if (err != null) {
      err = err;
    }
  }); // TODO: don't listen to close, but listen to exit instead

  spawnedProcess.on('close', (code, signal) => {
    if (err === null && code !== 0) {
      err = new Error('Command failed: ' + (signal || code));
    }

    if (err != null) {
      err.code = err.code || code;
      err.stdout = err.stdout || stdout;
    }

    if (callback != null) {
      callback(err, stdout);
    }
  });
} // Spawn reg.exe and callback when it completes


function spawnReg(args, callback) {
  return spawn(regExe, args, callback);
} // TODO: since we're doing this one by one, we could have a more graceful way of processing the queue
//       rather than mutating the array


function addToRegistry(queue, callback) {
  if (queue.length === 0) {
    return callback && callback();
  }

  const args = queue.shift();
  args.unshift('add');
  args.push('/f');
  return spawnReg(args, () => addToRegistry(queue, callback));
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// copied from discord_app/lib because including from there is broken.
class Backoff {
  /**
   * Create a backoff instance can automatically backoff retries.
   */
  constructor(min = 500, max = null, jitter = true) {
    this.min = min;
    this.max = max != null ? max : min * 10;
    this.jitter = jitter;
    this._current = min;
    this._timeoutId = null;
    this._fails = 0;
  }
  /**
   * Return the number of failures.
   */


  get fails() {
    return this._fails;
  }
  /**
   * Current backoff value in milliseconds.
   */


  get current() {
    return this._current;
  }
  /**
   * A callback is going to fire.
   */


  get pending() {
    return this._timeoutId != null;
  }
  /**
   * Clear any pending callbacks and reset the backoff.
   */


  succeed() {
    this.cancel();
    this._fails = 0;
    this._current = this.min;
  }
  /**
   * Increment the backoff and schedule a callback if provided.
   */


  fail(callback) {
    this._fails += 1;
    let delay = this._current * 2;

    if (this.jitter) {
      delay *= Math.random();
    }

    this._current = Math.min(this._current + delay, this.max);

    if (callback != null) {
      if (this._timeoutId != null) {
        throw new Error('callback already pending');
      }

      this._timeoutId = setTimeout(() => {
        try {
          if (callback != null) {
            callback();
          }
        } finally {
          this._timeoutId = null;
        }
      }, this._current);
    }

    return this._current;
  }
  /**
   *  Clear any pending callbacks.
   */


  cancel() {
    if (this._timeoutId != null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

}

exports.default = Backoff;
module.exports = exports.default;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.isInitialized = isInitialized;
exports.metadata = void 0;

const electron = require('electron');

const childProcess = require('child_process');

const {
  flatten
} = require('./crashReporterUtils');

let initialized = false;
const metadata = {};
exports.metadata = metadata;
const DEFAULT_SENTRY_KEY = '384ce4413de74fe0be270abe03b2b35a';
const TEST_SENTRY_KEY = '1a27a96457b24ff286a000266c573919';
const CHANNEL_SENTRY_KEYS = {
  stable: DEFAULT_SENTRY_KEY,
  ptb: TEST_SENTRY_KEY,
  canary: TEST_SENTRY_KEY,
  development: TEST_SENTRY_KEY
};
const DESKTOP_JS_SENTRY_DSN = 'https://8405981abe5045908f0d88135eba7ba5@o64374.ingest.sentry.io/1197903';

function getCrashReporterArgs(metadata) {
  // NB: we need to flatten the metadata because modern electron caps metadata values at 127 bytes,
  // which our sentry subobject can easily exceed.
  let flat_metadata = flatten(metadata);
  const channel = metadata['channel'];
  const sentryKey = CHANNEL_SENTRY_KEYS[channel] != null ? CHANNEL_SENTRY_KEYS[channel] : DEFAULT_SENTRY_KEY;
  return {
    productName: 'Discord',
    companyName: 'Discord Inc.',
    submitURL: `https://sentry.io/api/146342/minidump/?sentry_key=${sentryKey}`,
    uploadToServer: true,
    ignoreSystemCrashHandler: false,
    extra: flat_metadata
  };
}

function initializeSentrySdk(sentry) {
  sentry.init({
    dsn: DESKTOP_JS_SENTRY_DSN
  });
}

function init(buildInfo, sentry) {
  if (initialized) {
    console.warn('Ignoring double initialization of crash reporter.');
    return;
  } // It's desirable for test runs to have the stacktrace print to the console (and thusly, be shown in buildkite logs).


  if (process.env.ELECTRON_ENABLE_STACK_DUMPING === 'true') {
    console.warn('Not initializing crash reporter because ELECTRON_ENABLE_STACK_DUMPING is set.');
    return;
  }

  if (sentry != null) {
    initializeSentrySdk(sentry);
  }

  metadata['channel'] = buildInfo.releaseChannel;
  const sentryMetadata = metadata['sentry'] != null ? metadata['sentry'] : {};
  sentryMetadata['environment'] = buildInfo.releaseChannel;
  sentryMetadata['release'] = buildInfo.version;
  metadata['sentry'] = sentryMetadata;

  if (process.platform === 'linux') {
    const XDG_CURRENT_DESKTOP = process.env.XDG_CURRENT_DESKTOP || 'unknown';
    const GDMSESSION = process.env.GDMSESSION || 'unknown';
    metadata['wm'] = `${XDG_CURRENT_DESKTOP},${GDMSESSION}`;

    try {
      metadata['distro'] = childProcess.execFileSync('lsb_release', ['-ds'], {
        timeout: 100,
        maxBuffer: 512,
        encoding: 'utf-8'
      }).trim();
    } catch (_) {} // just in case lsb_release doesn't exist

  }

  const config = getCrashReporterArgs(metadata);
  electron.crashReporter.start(config);
  initialized = true;
}

function isInitialized() {
  return initialized;
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.reconcileCrashReporterMetadata = reconcileCrashReporterMetadata;

const {
  getElectronMajorVersion
} = require('./processUtils');

function flatten(metadata, prefix, root) {
  root = root ? root : {};
  prefix = prefix ? prefix : '';

  if (typeof metadata === 'object') {
    for (const key in metadata) {
      const next_prefix = prefix === '' ? key : `${prefix}[${key}]`;
      flatten(metadata[key], next_prefix, root);
    }
  } else {
    root[prefix] = metadata;
  }

  return root;
}

function reconcileCrashReporterMetadata(crashReporter, metadata) {
  if (getElectronMajorVersion() < 8) {
    return;
  }

  const new_metadata = flatten(metadata);
  const old_metadata = crashReporter.getParameters();

  for (const key in old_metadata) {
    if (!new_metadata.hasOwnProperty(key)) {
      crashReporter.removeExtraParameter(key);
    }
  }

  for (const key in new_metadata) {
    if (!old_metadata.hasOwnProperty(key)) {
      crashReporter.addExtraParameter(key, new_metadata[key]);
    }
  }
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FeatureFlags {
  constructor() {
    this.flags = new Set();
  }

  getSupported() {
    return Array.from(this.flags);
  }

  supports(feature) {
    return this.flags.has(feature);
  }

  declareSupported(feature) {
    if (this.supports(feature)) {
      console.error('Feature redeclared; is this a duplicate flag? ', feature);
      return;
    }

    this.flags.add(feature);
  }

}

exports.default = FeatureFlags;
module.exports = exports.default;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_MANUALLY = exports.UPDATE_CHECK_FINISHED = exports.NO_PENDING_UPDATES = exports.INSTALLING_MODULE_PROGRESS = exports.INSTALLING_MODULES_FINISHED = exports.INSTALLING_MODULE = exports.INSTALLED_MODULE = exports.DOWNLOADING_MODULE_PROGRESS = exports.DOWNLOADING_MODULES_FINISHED = exports.DOWNLOADING_MODULE = exports.DOWNLOADED_MODULE = exports.CHECKING_FOR_UPDATES = void 0;
exports.checkForUpdates = checkForUpdates;
exports.events = void 0;
exports.getInstalled = getInstalled;
exports.init = init;
exports.initPathsOnly = initPathsOnly;
exports.install = install;
exports.installPendingUpdates = installPendingUpdates;
exports.isInstalled = isInstalled;
exports.quitAndInstallUpdates = quitAndInstallUpdates;
exports.setInBackground = setInBackground;
exports.supportsEventObjects = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _module = _interopRequireDefault(require("module"));

var _events = require("events");

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _process = require("process");

var _yauzl = _interopRequireDefault(require("yauzl"));

var _Backoff = _interopRequireDefault(require("./Backoff"));

var paths = _interopRequireWildcard(require("./paths"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Manages additional module installation and management.
// We add the module folder path to require() lookup paths here.
// undocumented node API
const originalFs = require('original-fs'); // events


const CHECKING_FOR_UPDATES = 'checking-for-updates';
exports.CHECKING_FOR_UPDATES = CHECKING_FOR_UPDATES;
const INSTALLED_MODULE = 'installed-module';
exports.INSTALLED_MODULE = INSTALLED_MODULE;
const UPDATE_CHECK_FINISHED = 'update-check-finished';
exports.UPDATE_CHECK_FINISHED = UPDATE_CHECK_FINISHED;
const DOWNLOADING_MODULE = 'downloading-module';
exports.DOWNLOADING_MODULE = DOWNLOADING_MODULE;
const DOWNLOADING_MODULE_PROGRESS = 'downloading-module-progress';
exports.DOWNLOADING_MODULE_PROGRESS = DOWNLOADING_MODULE_PROGRESS;
const DOWNLOADING_MODULES_FINISHED = 'downloading-modules-finished';
exports.DOWNLOADING_MODULES_FINISHED = DOWNLOADING_MODULES_FINISHED;
const UPDATE_MANUALLY = 'update-manually';
exports.UPDATE_MANUALLY = UPDATE_MANUALLY;
const DOWNLOADED_MODULE = 'downloaded-module';
exports.DOWNLOADED_MODULE = DOWNLOADED_MODULE;
const INSTALLING_MODULES_FINISHED = 'installing-modules-finished';
exports.INSTALLING_MODULES_FINISHED = INSTALLING_MODULES_FINISHED;
const INSTALLING_MODULE = 'installing-module';
exports.INSTALLING_MODULE = INSTALLING_MODULE;
const INSTALLING_MODULE_PROGRESS = 'installing-module-progress';
exports.INSTALLING_MODULE_PROGRESS = INSTALLING_MODULE_PROGRESS;
const NO_PENDING_UPDATES = 'no-pending-updates'; // settings

exports.NO_PENDING_UPDATES = NO_PENDING_UPDATES;
const ALWAYS_ALLOW_UPDATES = 'ALWAYS_ALLOW_UPDATES';
const SKIP_HOST_UPDATE = 'SKIP_HOST_UPDATE';
const SKIP_MODULE_UPDATE = 'SKIP_MODULE_UPDATE';
const ALWAYS_BOOTSTRAP_MODULES = 'ALWAYS_BOOTSTRAP_MODULES';
const USE_LOCAL_MODULE_VERSIONS = 'USE_LOCAL_MODULE_VERSIONS';

class Events extends _events.EventEmitter {
  constructor() {
    super();
    this.history = [];
  }

  append(evt) {
    evt.now = String(_process.hrtime.bigint());

    if (this._eventIsInteresting(evt)) {
      this.history.push(evt);
    }

    process.nextTick(() => this.emit(evt.type, evt));
  }

  _eventIsInteresting(evt) {
    return evt.type !== DOWNLOADING_MODULE_PROGRESS && evt.type !== INSTALLING_MODULE_PROGRESS;
  }

}

class LogStream {
  constructor(logPath) {
    try {
      this.logStream = _fs.default.createWriteStream(logPath, {
        flags: 'a'
      });
    } catch (e) {
      console.error(`Failed to create ${logPath}: ${String(e)}`);
    }
  }

  log(message) {
    message = `[Modules] ${message}`;
    console.log(message);

    if (this.logStream) {
      this.logStream.write(message);
      this.logStream.write('\r\n');
    }
  }

  end() {
    if (this.logStream) {
      this.logStream.end();
      this.logStream = null;
    }
  }

}

const request = require('../app_bootstrap/request');

const REQUEST_TIMEOUT = 15000;
const backoff = new _Backoff.default(1000, 20000);
const events = new Events();
exports.events = events;
const supportsEventObjects = true;
exports.supportsEventObjects = supportsEventObjects;
let logger;
let locallyInstalledModules;
let moduleInstallPath;
let installedModulesFilePath;
let moduleDownloadPath;
let bootstrapping;
let hostUpdater;
let hostUpdateAvailable;
let skipHostUpdate;
let skipModuleUpdate;
let checkingForUpdates;
let remoteBaseURL;
let remoteQuery;
let settings;
let remoteModuleVersions;
let installedModules;
let download;
let unzip;
let newInstallInProgress;
let localModuleVersionsFilePath;
let updatable;
let bootstrapManifestFilePath;
let runningInBackground = false;

function initPathsOnly(_buildInfo) {
  if (locallyInstalledModules || moduleInstallPath) {
    return;
  } // If we have `localModulesRoot` in our buildInfo file, we do not fetch modules
  // from remote, and rely on our locally bundled ones.
  // Typically used for development mode, or private builds.


  locallyInstalledModules = _buildInfo.localModulesRoot != null;

  if (locallyInstalledModules) {
    if (_module.default.globalPaths.indexOf(_buildInfo.localModulesRoot) === -1) {
      _module.default.globalPaths.push(_buildInfo.localModulesRoot);
    }
  } else {
    moduleInstallPath = _path.default.join(paths.getUserDataVersioned(), 'modules');

    if (_module.default.globalPaths.indexOf(moduleInstallPath) === -1) {
      _module.default.globalPaths.push(moduleInstallPath);
    }
  }
}

function init(_endpoint, _settings, _buildInfo) {
  const endpoint = _endpoint;
  settings = _settings;
  const buildInfo = _buildInfo;
  updatable = buildInfo.version != '0.0.0' && !buildInfo.debug || settings.get(ALWAYS_ALLOW_UPDATES);
  initPathsOnly(buildInfo);
  logger = new LogStream(_path.default.join(paths.getUserData(), 'modules.log'));
  bootstrapping = false;
  hostUpdateAvailable = false;
  checkingForUpdates = false;
  skipHostUpdate = settings.get(SKIP_HOST_UPDATE) || !updatable;
  skipModuleUpdate = settings.get(SKIP_MODULE_UPDATE) || locallyInstalledModules || !updatable;
  localModuleVersionsFilePath = _path.default.join(paths.getUserData(), 'local_module_versions.json');
  bootstrapManifestFilePath = _path.default.join(paths.getResources(), 'bootstrap', 'manifest.json');
  installedModules = {};
  remoteModuleVersions = {};
  newInstallInProgress = {};
  download = {
    // currently downloading
    active: false,
    // {name, version}
    queue: [],
    // current queue index being downloaded
    next: 0,
    // download failure count
    failures: 0
  };
  unzip = {
    // currently unzipping
    active: false,
    // {name, version, zipfile}
    queue: [],
    // current queue index being unzipped
    next: 0,
    // unzip failure count
    failures: 0
  };
  logger.log(`Modules initializing`);
  logger.log(`Distribution: ${locallyInstalledModules ? 'local' : 'remote'}`);
  logger.log(`Host updates: ${skipHostUpdate ? 'disabled' : 'enabled'}`);
  logger.log(`Module updates: ${skipModuleUpdate ? 'disabled' : 'enabled'}`);

  if (!locallyInstalledModules) {
    installedModulesFilePath = _path.default.join(moduleInstallPath, 'installed.json');
    moduleDownloadPath = _path.default.join(moduleInstallPath, 'pending');

    _mkdirp.default.sync(moduleDownloadPath);

    logger.log(`Module install path: ${moduleInstallPath}`);
    logger.log(`Module installed file path: ${installedModulesFilePath}`);
    logger.log(`Module download path: ${moduleDownloadPath}`);
    let failedLoadingInstalledModules = false;

    try {
      installedModules = JSON.parse(_fs.default.readFileSync(installedModulesFilePath));
    } catch (err) {
      failedLoadingInstalledModules = true;
    }

    cleanDownloadedModules(installedModules);
    bootstrapping = failedLoadingInstalledModules || settings.get(ALWAYS_BOOTSTRAP_MODULES);
  }

  hostUpdater = require('../app_bootstrap/hostUpdater'); // TODO: hostUpdater constants

  hostUpdater.on('checking-for-update', () => events.append({
    type: CHECKING_FOR_UPDATES
  }));
  hostUpdater.on('update-available', () => hostOnUpdateAvailable());
  hostUpdater.on('update-progress', progress => hostOnUpdateProgress(progress));
  hostUpdater.on('update-not-available', () => hostOnUpdateNotAvailable());
  hostUpdater.on('update-manually', newVersion => hostOnUpdateManually(newVersion));
  hostUpdater.on('update-downloaded', () => hostOnUpdateDownloaded());
  hostUpdater.on('error', err => hostOnError(err));
  const setFeedURL = hostUpdater.setFeedURL.bind(hostUpdater);
  remoteBaseURL = `${endpoint}/modules/${buildInfo.releaseChannel}`; // eslint-disable-next-line camelcase

  remoteQuery = {
    host_version: buildInfo.version
  };

  switch (process.platform) {
    case 'darwin':
      setFeedURL(`${endpoint}/updates/${buildInfo.releaseChannel}?platform=osx&version=${buildInfo.version}`);
      remoteQuery.platform = 'osx';
      break;

    case 'win32':
      // Squirrel for Windows can't handle query params
      // https://github.com/Squirrel/Squirrel.Windows/issues/132
      setFeedURL(`${endpoint}/updates/${buildInfo.releaseChannel}`);
      remoteQuery.platform = 'win';
      break;

    case 'linux':
      setFeedURL(`${endpoint}/updates/${buildInfo.releaseChannel}?platform=linux&version=${buildInfo.version}`);
      remoteQuery.platform = 'linux';
      break;
  }
}

function cleanDownloadedModules(installedModules) {
  try {
    const entries = _fs.default.readdirSync(moduleDownloadPath) || [];
    entries.forEach(entry => {
      const entryPath = _path.default.join(moduleDownloadPath, entry);

      let isStale = true;

      for (const moduleName of Object.keys(installedModules)) {
        if (entryPath === installedModules[moduleName].updateZipfile) {
          isStale = false;
          break;
        }
      }

      if (isStale) {
        _fs.default.unlinkSync(_path.default.join(moduleDownloadPath, entry));
      }
    });
  } catch (err) {
    logger.log('Could not clean downloaded modules');
    logger.log(err.stack);
  }
}

function hostOnUpdateAvailable() {
  logger.log(`Host update is available.`);
  hostUpdateAvailable = true;
  events.append({
    type: UPDATE_CHECK_FINISHED,
    succeeded: true,
    updateCount: 1,
    manualRequired: false
  });
  events.append({
    type: DOWNLOADING_MODULE,
    name: 'host',
    current: 1,
    total: 1,
    foreground: !runningInBackground
  });
}

function hostOnUpdateProgress(progress) {
  logger.log(`Host update progress: ${progress}%`);
  events.append({
    type: DOWNLOADING_MODULE_PROGRESS,
    name: 'host',
    progress: progress
  });
}

function hostOnUpdateNotAvailable() {
  logger.log(`Host is up to date.`);

  if (!skipModuleUpdate) {
    checkForModuleUpdates();
  } else {
    events.append({
      type: UPDATE_CHECK_FINISHED,
      succeeded: true,
      updateCount: 0,
      manualRequired: false
    });
  }
}

function hostOnUpdateManually(newVersion) {
  logger.log(`Host update is available. Manual update required!`);
  hostUpdateAvailable = true;
  checkingForUpdates = false;
  events.append({
    type: UPDATE_MANUALLY,
    newVersion: newVersion
  });
  events.append({
    type: UPDATE_CHECK_FINISHED,
    succeeded: true,
    updateCount: 1,
    manualRequired: true
  });
}

function hostOnUpdateDownloaded() {
  logger.log(`Host update downloaded.`);
  checkingForUpdates = false;
  events.append({
    type: DOWNLOADED_MODULE,
    name: 'host',
    current: 1,
    total: 1,
    succeeded: true
  });
  events.append({
    type: DOWNLOADING_MODULES_FINISHED,
    succeeded: 1,
    failed: 0
  });
}

function hostOnError(err) {
  logger.log(`Host update failed: ${err}`); // [adill] osx unsigned builds will fire this code signing error inside setFeedURL and
  // if we don't do anything about it hostUpdater.checkForUpdates() will never respond.

  if (err && String(err).indexOf('Could not get code signature for running application') !== -1) {
    console.warn('Skipping host updates due to code signing failure.');
    skipHostUpdate = true;
  }

  checkingForUpdates = false;

  if (!hostUpdateAvailable) {
    events.append({
      type: UPDATE_CHECK_FINISHED,
      succeeded: false,
      updateCount: 0,
      manualRequired: false
    });
  } else {
    events.append({
      type: DOWNLOADED_MODULE,
      name: 'host',
      current: 1,
      total: 1,
      succeeded: false
    });
    events.append({
      type: DOWNLOADING_MODULES_FINISHED,
      succeeded: 0,
      failed: 1
    });
  }
}

function checkForUpdates() {
  if (checkingForUpdates) return;
  checkingForUpdates = true;
  hostUpdateAvailable = false;

  if (skipHostUpdate) {
    events.append({
      type: CHECKING_FOR_UPDATES
    });
    hostOnUpdateNotAvailable();
  } else {
    logger.log('Checking for host updates.');
    hostUpdater.checkForUpdates();
  }
} // Indicates that the initial update process is complete and that future updates
// are background updates. This merely affects the content of the events sent to
// the app so that analytics can correctly attribute module download/installs
// depending on whether they were ui-blocking or not.


function setInBackground() {
  runningInBackground = true;
}

function getRemoteModuleName(name) {
  if (process.platform === 'win32' && process.arch === 'x64') {
    return `${name}.x64`;
  }

  return name;
}

async function checkForModuleUpdates() {
  const query = { ...remoteQuery,
    _: Math.floor(Date.now() / 1000 / 60 / 5)
  };
  const url = `${remoteBaseURL}/versions.json`;
  logger.log(`Checking for module updates at ${url}`);
  let response;

  try {
    response = await request.get({
      url,
      qs: query,
      timeout: REQUEST_TIMEOUT
    });
    checkingForUpdates = false;
  } catch (err) {
    checkingForUpdates = false;
    logger.log(`Failed fetching module versions: ${String(err)}`);
    events.append({
      type: UPDATE_CHECK_FINISHED,
      succeeded: false,
      updateCount: 0,
      manualRequired: false
    });
    return;
  }

  remoteModuleVersions = JSON.parse(response.body);

  if (settings.get(USE_LOCAL_MODULE_VERSIONS)) {
    try {
      remoteModuleVersions = JSON.parse(_fs.default.readFileSync(localModuleVersionsFilePath));
      console.log('Using local module versions: ', remoteModuleVersions);
    } catch (err) {
      console.warn('Failed to parse local module versions: ', err);
    }
  }

  const updatesToDownload = [];

  for (const moduleName of Object.keys(installedModules)) {
    const installedModule = installedModules[moduleName];
    const installed = installedModule.installedVersion;

    if (installed === null) {
      continue;
    }

    const update = installedModule.updateVersion || 0;
    const remote = remoteModuleVersions[getRemoteModuleName(moduleName)] || 0;

    if (installed !== remote && update !== remote) {
      logger.log(`Module update available: ${moduleName}@${remote} [installed: ${installed}]`);
      updatesToDownload.push({
        name: moduleName,
        version: remote
      });
    }
  }

  events.append({
    type: UPDATE_CHECK_FINISHED,
    succeeded: true,
    updateCount: updatesToDownload.length,
    manualRequired: false
  });

  if (updatesToDownload.length === 0) {
    logger.log(`No module updates available.`);
  } else {
    updatesToDownload.forEach(e => addModuleToDownloadQueue(e.name, e.version));
  }
}

function addModuleToDownloadQueue(name, version, authToken) {
  download.queue.push({
    name,
    version,
    authToken
  });
  process.nextTick(() => processDownloadQueue());
}

async function processDownloadQueue() {
  if (download.active) return;
  if (download.queue.length === 0) return;
  download.active = true;
  const queuedModule = download.queue[download.next];
  download.next += 1;
  events.append({
    type: DOWNLOADING_MODULE,
    name: queuedModule.name,
    current: download.next,
    total: download.queue.length,
    foreground: !runningInBackground
  });
  let progress = 0;
  let receivedBytes = 0;
  const url = `${remoteBaseURL}/${encodeURIComponent(getRemoteModuleName(queuedModule.name))}/${encodeURIComponent(queuedModule.version)}`;
  logger.log(`Fetching ${queuedModule.name}@${queuedModule.version} from ${url}`);
  const headers = {};

  if (queuedModule.authToken) {
    headers['Authorization'] = queuedModule.authToken;
  }

  const moduleZipPath = _path.default.join(moduleDownloadPath, `${queuedModule.name}-${queuedModule.version}.zip`);

  const stream = _fs.default.createWriteStream(moduleZipPath);

  stream.on('progress', ({
    receivedBytes: newReceivedBytes,
    totalBytes
  }) => {
    receivedBytes = newReceivedBytes;
    const newProgress = Math.min(Math.floor(100 * (receivedBytes / totalBytes)), 100);

    if (progress !== newProgress) {
      progress = newProgress;
      logger.log(`Streaming ${queuedModule.name}@${queuedModule.version} to ${moduleZipPath}: ${progress}%`);
      events.append({
        type: DOWNLOADING_MODULE_PROGRESS,
        name: queuedModule.name,
        progress: progress
      });
    }
  });
  logger.log(`Streaming ${queuedModule.name}@${queuedModule.version} to ${moduleZipPath}`);

  try {
    const response = await request.get({
      url,
      qs: remoteQuery,
      headers,
      timeout: REQUEST_TIMEOUT,
      stream
    });
    finishModuleDownload(queuedModule.name, queuedModule.version, moduleZipPath, receivedBytes, response.statusCode === 200);
  } catch (err) {
    logger.log(`Failed fetching module ${queuedModule.name}@${queuedModule.version}: ${String(err)}`);
    finishModuleDownload(queuedModule.name, queuedModule.version, null, receivedBytes, false);
  }
}

function commitInstalledModules() {
  const data = JSON.stringify(installedModules, null, 2);

  _fs.default.writeFileSync(installedModulesFilePath, data);
}

function finishModuleDownload(name, version, zipfile, receivedBytes, succeeded) {
  if (!installedModules[name]) {
    installedModules[name] = {};
  }

  if (succeeded) {
    installedModules[name].updateVersion = version;
    installedModules[name].updateZipfile = zipfile;
    commitInstalledModules();
  } else {
    download.failures += 1;
  }

  events.append({
    type: DOWNLOADED_MODULE,
    name: name,
    current: download.next,
    total: download.queue.length,
    succeeded: succeeded,
    receivedBytes: receivedBytes
  });

  if (download.next >= download.queue.length) {
    const successes = download.queue.length - download.failures;
    logger.log(`Finished module downloads. [success: ${successes}] [failure: ${download.failures}]`);
    events.append({
      type: DOWNLOADING_MODULES_FINISHED,
      succeeded: successes,
      failed: download.failures
    });
    download.queue = [];
    download.next = 0;
    download.failures = 0;
    download.active = false;
  } else {
    const continueDownloads = () => {
      download.active = false;
      processDownloadQueue();
    };

    if (succeeded) {
      backoff.succeed();
      process.nextTick(continueDownloads);
    } else {
      logger.log(`Waiting ${Math.floor(backoff.current)}ms before next download.`);
      backoff.fail(continueDownloads);
    }
  }

  if (newInstallInProgress[name]) {
    addModuleToUnzipQueue(name, version, zipfile);
  }
}

function addModuleToUnzipQueue(name, version, zipfile) {
  unzip.queue.push({
    name,
    version,
    zipfile
  });
  process.nextTick(() => processUnzipQueue());
}

function processUnzipQueue() {
  if (unzip.active) return;
  if (unzip.queue.length === 0) return;
  unzip.active = true;
  const queuedModule = unzip.queue[unzip.next];
  const installedModule = installedModules[queuedModule.name];
  const installedVersion = installedModule != null ? installedModule.installedVersion : null;
  unzip.next += 1;
  events.append({
    type: INSTALLING_MODULE,
    name: queuedModule.name,
    current: unzip.next,
    total: unzip.queue.length,
    foreground: !runningInBackground,
    oldVersion: installedVersion,
    newVersion: queuedModule.version
  });
  let hasErrored = false;

  const onError = (error, zipfile) => {
    if (hasErrored) return;
    hasErrored = true;
    logger.log(`Failed installing ${queuedModule.name}@${queuedModule.version}: ${String(error)}`);
    succeeded = false;

    if (zipfile) {
      zipfile.close();
    }

    finishModuleUnzip(queuedModule, succeeded);
  };

  let succeeded = true;

  const extractRoot = _path.default.join(moduleInstallPath, queuedModule.name);

  logger.log(`Installing ${queuedModule.name}@${queuedModule.version} from ${queuedModule.zipfile}`);

  const processZipfile = (err, zipfile) => {
    if (err) {
      onError(err, null);
      return;
    }

    const totalEntries = zipfile.entryCount;
    let processedEntries = 0;
    zipfile.on('entry', entry => {
      processedEntries += 1;
      const percent = Math.min(Math.floor(processedEntries / totalEntries * 100), 100);
      events.append({
        type: INSTALLING_MODULE_PROGRESS,
        name: queuedModule.name,
        progress: percent
      }); // skip directories

      if (/\/$/.test(entry.fileName)) {
        zipfile.readEntry();
        return;
      }

      zipfile.openReadStream(entry, (err, stream) => {
        if (err) {
          onError(err, zipfile);
          return;
        }

        stream.on('error', e => onError(e, zipfile));
        (0, _mkdirp.default)(_path.default.join(extractRoot, _path.default.dirname(entry.fileName)), err => {
          if (err) {
            onError(err, zipfile);
            return;
          } // [adill] createWriteStream via original-fs is broken in Electron 4.0.0-beta.6 with .asar files
          // so we unzip to a temporary filename and rename it afterwards


          const tempFileName = _path.default.join(extractRoot, entry.fileName + '.tmp');

          const finalFileName = _path.default.join(extractRoot, entry.fileName);

          const writeStream = originalFs.createWriteStream(tempFileName);
          writeStream.on('error', e => {
            stream.destroy();

            try {
              originalFs.unlinkSync(tempFileName);
            } catch (err) {}

            onError(e, zipfile);
          });
          writeStream.on('finish', () => {
            try {
              originalFs.unlinkSync(finalFileName);
            } catch (err) {}

            try {
              originalFs.renameSync(tempFileName, finalFileName);
            } catch (err) {
              onError(err, zipfile);
              return;
            }

            zipfile.readEntry();
          });
          stream.pipe(writeStream);
        });
      });
    });
    zipfile.on('error', err => {
      onError(err, zipfile);
    });
    zipfile.on('end', () => {
      if (!succeeded) return;
      installedModules[queuedModule.name].installedVersion = queuedModule.version;
      finishModuleUnzip(queuedModule, succeeded);
    });
    zipfile.readEntry();
  };

  try {
    _yauzl.default.open(queuedModule.zipfile, {
      lazyEntries: true,
      autoClose: true
    }, processZipfile);
  } catch (err) {
    onError(err, null);
  }
}

function finishModuleUnzip(unzippedModule, succeeded) {
  delete newInstallInProgress[unzippedModule.name];
  delete installedModules[unzippedModule.name].updateZipfile;
  delete installedModules[unzippedModule.name].updateVersion;
  commitInstalledModules();

  if (!succeeded) {
    unzip.failures += 1;
  }

  events.append({
    type: INSTALLED_MODULE,
    name: unzippedModule.name,
    current: unzip.next,
    total: unzip.queue.length,
    succeeded: succeeded
  });

  if (unzip.next >= unzip.queue.length) {
    const successes = unzip.queue.length - unzip.failures;
    bootstrapping = false;
    logger.log(`Finished module installations. [success: ${successes}] [failure: ${unzip.failures}]`);
    unzip.queue = [];
    unzip.next = 0;
    unzip.failures = 0;
    unzip.active = false;
    events.append({
      type: INSTALLING_MODULES_FINISHED,
      succeeded: successes,
      failed: unzip.failures
    });
    return;
  }

  process.nextTick(() => {
    unzip.active = false;
    processUnzipQueue();
  });
}

function quitAndInstallUpdates() {
  logger.log(`Relaunching to install ${hostUpdateAvailable ? 'host' : 'module'} updates...`);

  if (hostUpdateAvailable) {
    hostUpdater.quitAndInstall();
  } else {
    relaunch();
  }
}

function relaunch() {
  logger.end();

  const {
    app
  } = require('electron');

  app.relaunch();
  app.quit();
}

function isInstalled(name, version) {
  const metadata = installedModules[name];
  if (locallyInstalledModules) return true;

  if (metadata && metadata.installedVersion > 0) {
    if (!version) return true;
    if (metadata.installedVersion === version) return true;
  }

  return false;
}

function getInstalled() {
  return { ...installedModules
  };
}

function install(name, defer, options) {
  let {
    version,
    authToken
  } = options || {};

  if (isInstalled(name, version)) {
    if (!defer) {
      events.append({
        type: INSTALLED_MODULE,
        name: name,
        current: 1,
        total: 1,
        succeeded: true
      });
    }

    return;
  }

  if (newInstallInProgress[name]) return;

  if (!updatable) {
    logger.log(`Not updatable; ignoring request to install ${name}...`);
    return;
  }

  if (defer) {
    if (version) {
      throw new Error(`Cannot defer install for a specific version module (${name}, ${version})`);
    }

    logger.log(`Deferred install for ${name}...`);
    installedModules[name] = {
      installedVersion: 0
    };
    commitInstalledModules();
  } else {
    logger.log(`Starting to install ${name}...`);

    if (!version) {
      version = remoteModuleVersions[name] || 0;
    }

    newInstallInProgress[name] = version;
    addModuleToDownloadQueue(name, version, authToken);
  }
}

function installPendingUpdates() {
  const updatesToInstall = [];

  if (bootstrapping) {
    let modules = {};

    try {
      modules = JSON.parse(_fs.default.readFileSync(bootstrapManifestFilePath));
    } catch (err) {}

    for (const moduleName of Object.keys(modules)) {
      installedModules[moduleName] = {
        installedVersion: 0
      };

      const zipfile = _path.default.join(paths.getResources(), 'bootstrap', `${moduleName}.zip`);

      updatesToInstall.push({
        moduleName,
        update: modules[moduleName],
        zipfile
      });
    }
  }

  for (const moduleName of Object.keys(installedModules)) {
    const update = installedModules[moduleName].updateVersion || 0;
    const zipfile = installedModules[moduleName].updateZipfile;

    if (update > 0 && zipfile != null) {
      updatesToInstall.push({
        moduleName,
        update,
        zipfile
      });
    }
  }

  if (updatesToInstall.length > 0) {
    logger.log(`${bootstrapping ? 'Bootstrapping' : 'Installing updates'}...`);
    updatesToInstall.forEach(e => addModuleToUnzipQueue(e.moduleName, e.update, e.zipfile));
  } else {
    logger.log('No updates to install');
    events.append({
      type: NO_PENDING_UPDATES
    });
  }
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanOldVersions = cleanOldVersions;
exports.getInstallPath = getInstallPath;
exports.getModuleDataPath = getModuleDataPath;
exports.getResources = getResources;
exports.getUserData = getUserData;
exports.getUserDataVersioned = getUserDataVersioned;
exports.init = init;

var _fs = _interopRequireDefault(require("fs"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _originalFs = _interopRequireDefault(require("original-fs"));

var _path = _interopRequireDefault(require("path"));

var _rimraf = _interopRequireDefault(require("rimraf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
// Determines environment-specific paths based on info provided
let userDataPath = null;
let userDataVersionedPath = null;
let resourcesPath = null;
let moduleDataPath = null;
let installPath = null;

function determineAppUserDataRoot() {
  // Allow overwriting the user data directory. This can be important when using --multi-instance
  const userDataPath = process.env.DISCORD_USER_DATA_DIR;

  if (userDataPath) {
    return userDataPath;
  }

  const {
    app
  } = require('electron');

  return app.getPath('appData');
}

function determineUserData(userDataRoot, buildInfo) {
  return _path.default.join(userDataRoot, 'discord' + (buildInfo.releaseChannel == 'stable' ? '' : buildInfo.releaseChannel));
} // cleans old version data in the background


function cleanOldVersions(buildInfo) {
  const entries = _fs.default.readdirSync(userDataPath) || [];
  entries.forEach(entry => {
    const fullPath = _path.default.join(userDataPath, entry);

    let stat;

    try {
      stat = _fs.default.lstatSync(fullPath);
    } catch (e) {
      return;
    }

    if (stat.isDirectory() && entry.indexOf(buildInfo.version) === -1) {
      if (entry.match('^[0-9]+.[0-9]+.[0-9]+') != null) {
        console.log('Removing old directory ', entry);
        (0, _rimraf.default)(fullPath, _originalFs.default, error => {
          if (error) {
            console.warn('...failed with error: ', error);
          }
        });
      }
    }
  });
}

function init(buildInfo) {
  resourcesPath = _path.default.join(require.main.filename, '..', '..', '..');
  const userDataRoot = determineAppUserDataRoot();
  userDataPath = determineUserData(userDataRoot, buildInfo);

  const {
    app
  } = require('electron');

  app.setPath('userData', userDataPath);
  userDataVersionedPath = _path.default.join(userDataPath, buildInfo.version);

  _mkdirp.default.sync(userDataVersionedPath);

  if (buildInfo.localModulesRoot != null) {
    moduleDataPath = buildInfo.localModulesRoot;
  } else if (buildInfo.newUpdater) {
    moduleDataPath = _path.default.join(userDataPath, 'module_data');
  } else {
    moduleDataPath = _path.default.join(userDataVersionedPath, 'modules');
  }

  const exeDir = _path.default.dirname(app.getPath('exe'));

  if (/^app-[0-9]+\.[0-9]+\.[0-9]+/.test(_path.default.basename(exeDir))) {
    installPath = _path.default.join(exeDir, '..');
  }
}

function getUserData() {
  return userDataPath;
}

function getUserDataVersioned() {
  return userDataVersionedPath;
}

function getResources() {
  return resourcesPath;
}

function getModuleDataPath() {
  return moduleDataPath;
}

function getInstallPath() {
  return installPath;
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_WIN = void 0;
exports.getElectronMajorVersion = getElectronMajorVersion;

const process = require('process');

function getElectronMajorVersion() {
  return process.versions.electron != null ? parseInt(process.versions.electron.split('.')[0]) : 0;
}

const IS_WIN = process.platform === 'win32';
exports.IS_WIN = IS_WIN;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUrlOriginMatches = checkUrlOriginMatches;
exports.saferShellOpenExternal = saferShellOpenExternal;
exports.shouldOpenExternalUrl = shouldOpenExternalUrl;

var _electron = require("electron");

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BLOCKED_URL_PROTOCOLS = ['file:', 'javascript:', 'vbscript:', 'data:', 'about:', 'chrome:', 'ms-cxh:', 'ms-cxh-full:', 'ms-word:'];

function shouldOpenExternalUrl(externalUrl) {
  let parsedUrl;

  try {
    parsedUrl = _url.default.parse(externalUrl);
  } catch (_) {
    return false;
  }

  if (parsedUrl.protocol == null || BLOCKED_URL_PROTOCOLS.includes(parsedUrl.protocol.toLowerCase())) {
    return false;
  }

  return true;
}

function saferShellOpenExternal(externalUrl) {
  if (shouldOpenExternalUrl(externalUrl)) {
    return _electron.shell.openExternal(externalUrl);
  } else {
    return Promise.reject(new Error('External url open request blocked'));
  }
}

function checkUrlOriginMatches(urlA, urlB) {
  let parsedUrlA;
  let parsedUrlB;

  try {
    parsedUrlA = _url.default.parse(urlA);
    parsedUrlB = _url.default.parse(urlB);
  } catch (_) {
    return false;
  }

  return parsedUrlA.protocol === parsedUrlB.protocol && parsedUrlA.slashes === parsedUrlB.slashes && parsedUrlA.host === parsedUrlB.host;
}"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: sync fs operations could cause slowdown and/or freezes, depending on usage
//       if this is fine, remove this todo
class Settings {
  constructor(root) {
    this.path = _path.default.join(root, 'settings.json');

    try {
      this.lastSaved = _fs.default.readFileSync(this.path);
      this.settings = JSON.parse(this.lastSaved);
    } catch (e) {
      this.lastSaved = '';
      this.settings = {};
    }

    this.lastModified = this._lastModified();
  }

  _lastModified() {
    try {
      return _fs.default.statSync(this.path).mtime.getTime();
    } catch (e) {
      return 0;
    }
  }

  get(key, defaultValue = false) {
    if (this.settings.hasOwnProperty(key)) {
      return this.settings[key];
    }

    return defaultValue;
  }

  set(key, value) {
    this.settings[key] = value;
  }

  save() {
    if (this.lastModified && this.lastModified !== this._lastModified()) {
      console.warn('Not saving settings, it has been externally modified.');
      return;
    }

    try {
      const toSave = JSON.stringify(this.settings, null, 2);

      if (this.lastSaved != toSave) {
        this.lastSaved = toSave;

        _fs.default.writeFileSync(this.path, toSave);

        this.lastModified = this._lastModified();
      }
    } catch (err) {
      console.warn('Failed saving settings with error: ', err);
    }
  }

}

exports.default = Settings;
module.exports = exports.default;"use strict";

// Too much Rust integration stuff in here.

/* eslint camelcase: 0 */
const childProcess = require('child_process');

const {
  app
} = require('electron');

const {
  EventEmitter
} = require('events');

const NodeModule = require('module');

const path = require('path');

const {
  hrtime
} = require('process');

let instance;
const TASK_STATE_COMPLETE = 'Complete';
const TASK_STATE_FAILED = 'Failed';
const TASK_STATE_WAITING = 'Waiting';
const TASK_STATE_WORKING = 'Working';
const INCONSISTENT_INSTALLER_STATE_ERROR = 'InconsistentInstallerState'; // The dumb linters are mad at each other.
// eslint-disable-next-line quotes

const INVALID_UPDATER_ERROR = "Can't send request to updater because the native updater isn't loaded.";

class Updater extends EventEmitter {
  constructor(options) {
    super();
    let nativeUpdaterModule = options.nativeUpdaterModule;

    if (nativeUpdaterModule == null) {
      try {
        // eslint-disable-next-line import/no-unresolved
        nativeUpdaterModule = require('../../../updater');
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
          return;
        }

        throw e;
      }
    }

    this.committedHostVersion = null;
    this.committedModules = new Set();
    this.rootPath = options.root_path;
    this.nextRequestId = 0;
    this.requests = new Map();
    this.updateEventHistory = [];
    this.isRunningInBackground = false;
    this.currentlyDownloading = {};
    this.currentlyInstalling = {};
    this.hasEmittedUnhandledException = false;
    this.nativeUpdater = new nativeUpdaterModule.Updater({
      response_handler: this._handleResponse.bind(this),
      ...options
    });
  }

  get valid() {
    return this.nativeUpdater != null;
  }

  _sendRequest(detail, progressCallback = null) {
    if (!this.valid) {
      throw new Error(INVALID_UPDATER_ERROR);
    }

    const requestId = this.nextRequestId++;
    return new Promise((resolve, reject) => {
      this.requests.set(requestId, {
        resolve,
        reject,
        progressCallback
      });
      this.nativeUpdater.command(JSON.stringify([requestId, detail]));
    });
  }

  _sendRequestSync(detail) {
    if (!this.valid) {
      throw new Error(INVALID_UPDATER_ERROR);
    }

    const requestId = this.nextRequestId++;
    return this.nativeUpdater.command_blocking(JSON.stringify([requestId, detail]));
  }

  _handleResponse(response) {
    try {
      const [id, detail] = JSON.parse(response);
      const request = this.requests.get(id);

      if (request == null) {
        console.error('Received response ', detail, ' for a request (', id, ') not in the updater request map.');
        return;
      }

      if (detail['Error'] != null) {
        const {
          kind,
          details,
          severity
        } = detail['Error'];
        const e = new Error(`(${kind}) ${details}`);

        if (severity === 'Fatal') {
          const handled = this.emit(kind, e);

          if (!handled) {
            throw e;
          }
        } else {
          this.emit('update-error', e);
          request.reject(e);
          this.requests.delete(id);
        }
      } else if (detail === 'Ok') {
        request.resolve();
        this.requests.delete(id);
      } else if (detail['VersionInfo'] != null) {
        request.resolve(detail['VersionInfo']);
        this.requests.delete(id);
      } else if (detail['ManifestInfo'] != null) {
        request.resolve(detail['ManifestInfo']);
        this.requests.delete(id);
      } else if (detail['TaskProgress'] != null) {
        const msg = detail['TaskProgress'];
        const progress = {
          task: msg[0],
          state: msg[1],
          percent: msg[2],
          bytesProcessed: msg[3]
        };

        this._recordTaskProgress(progress);

        if (request.progressCallback != null) {
          request.progressCallback(progress);
        }

        if (progress.task['HostInstall'] != null && progress.state === TASK_STATE_COMPLETE) {
          this.emit('host-updated');
        }
      } else {
        console.warn('Unknown updater response', detail);
      }
    } catch (e) {
      console.error('Unhandled exception in updater response handler:', e); // Report the first time this happens, but don't spam.

      if (!this.hasEmittedUnhandledException) {
        this.hasEmittedUnhandledException = true;
        this.emit('unhandled-exception', e);
      }
    }
  }

  _handleSyncResponse(response) {
    const detail = JSON.parse(response);

    if (detail['Error'] != null) {
      throw new Error(detail['Error']);
    } else if (detail === 'Ok') {
      return;
    } else if (detail['VersionInfo'] != null) {
      return detail['VersionInfo'];
    }

    console.warn('Unknown updater response', detail);
  }

  _getHostPath() {
    const [major, minor, revision] = this.committedHostVersion;
    const hostVersionStr = `${major}.${minor}.${revision}`;
    return path.join(this.rootPath, `app-${hostVersionStr}`);
  }

  _startCurrentVersionInner(options, versions) {
    if (this.committedHostVersion == null) {
      this.committedHostVersion = versions.current_host;
    }

    const hostPath = this._getHostPath();

    const hostExePath = path.join(hostPath, path.basename(process.execPath));

    if (path.resolve(hostExePath) != path.resolve(process.execPath) && !(options === null || options === void 0 ? void 0 : options.allowObsoleteHost)) {
      app.once('will-quit', () => {
        // TODO(eiz): the actual, correct way to do this (win32) is to inherit a
        // handle to the current process into a new child process which then
        // waits for that process handle to exit, then runs the new electron.
        // This requires either implementing a separate updater exe process (big
        // todo item atm) or likely modifying Electron?
        //
        // I intend to do it properly once the new production updater .exe is a
        // thing.
        childProcess.spawn(hostExePath, [], {
          detached: true,
          stdio: 'inherit'
        });
      });
      console.log(`Restarting from ${path.resolve(process.execPath)} to ${path.resolve(hostExePath)}`);
      app.quit();
      return;
    }

    this._commitModulesInner(versions);
  }

  _commitModulesInner(versions) {
    const hostPath = this._getHostPath();

    const modulesPath = path.join(hostPath, 'modules');

    for (const module in versions.current_modules) {
      const moduleVersion = versions.current_modules[module];
      const moduleSearchPath = path.join(modulesPath, `${module}-${moduleVersion}`);

      if (!this.committedModules.has(module) && NodeModule.globalPaths.indexOf(moduleSearchPath) === -1) {
        this.committedModules.add(module);
        NodeModule.globalPaths.push(moduleSearchPath);
      }
    }
  }

  _recordDownloadProgress(name, progress) {
    const now = String(hrtime.bigint());

    if (progress.state === TASK_STATE_WORKING && !this.currentlyDownloading[name]) {
      this.currentlyDownloading[name] = true;
      this.updateEventHistory.push({
        type: 'downloading-module',
        name: name,
        now: now
      });
    } else if (progress.state === TASK_STATE_COMPLETE || progress.state === TASK_STATE_FAILED) {
      this.currentlyDownloading[name] = false;
      this.updateEventHistory.push({
        type: 'downloaded-module',
        name: name,
        now: now,
        succeeded: progress.state === TASK_STATE_COMPLETE,
        receivedBytes: progress.bytesProcessed
      });
    }
  }

  _recordInstallProgress(name, progress, newVersion, isDelta) {
    const now = String(hrtime.bigint());

    if (progress.state === TASK_STATE_WORKING && !this.currentlyInstalling[name]) {
      this.currentlyInstalling[name] = true;
      this.updateEventHistory.push({
        type: 'installing-module',
        name,
        now,
        newVersion,
        foreground: !this.isRunningInBackground
      });
    } else if (progress.state === TASK_STATE_COMPLETE || progress.state === TASK_STATE_FAILED) {
      this.currentlyInstalling[name] = false;
      this.updateEventHistory.push({
        type: 'installed-module',
        name,
        now,
        newVersion,
        succeeded: progress.state === TASK_STATE_COMPLETE,
        delta: isDelta,
        foreground: !this.isRunningInBackground
      });
    }
  }

  _recordTaskProgress(progress) {
    if (progress.task.HostDownload != null) {
      this._recordDownloadProgress('host', progress);
    } else if (progress.task.HostInstall != null) {
      this._recordInstallProgress('host', progress, null, progress.task.HostInstall.from_version != null);
    } else if (progress.task.ModuleDownload != null) {
      this._recordDownloadProgress(progress.task.ModuleDownload.version.module.name, progress);
    } else if (progress.task.ModuleInstall != null) {
      this._recordInstallProgress(progress.task.ModuleInstall.version.module.name, progress, progress.task.ModuleInstall.version.version, progress.task.ModuleInstall.from_version != null);
    }
  }

  queryCurrentVersions() {
    return this._sendRequest('QueryCurrentVersions');
  }

  queryCurrentVersionsSync() {
    return this._handleSyncResponse(this._sendRequestSync('QueryCurrentVersions'));
  }

  repair(progressCallback) {
    return this.repairWithOptions(null, progressCallback);
  }

  repairWithOptions(options, progressCallback) {
    return this._sendRequest({
      Repair: {
        options
      }
    }, progressCallback);
  }

  collectGarbage() {
    return this._sendRequest('CollectGarbage');
  }

  setRunningManifest(manifest) {
    return this._sendRequest({
      SetManifests: ['Running', manifest]
    });
  }

  setPinnedManifestSync(manifest) {
    return this._handleSyncResponse(this._sendRequestSync({
      SetManifests: ['Pinned', manifest]
    }));
  }

  installModule(name, progressCallback) {
    return this.installModuleWithOptions(name, null, progressCallback);
  }

  installModuleWithOptions(name, options, progressCallback) {
    return this._sendRequest({
      InstallModule: {
        name,
        options
      }
    }, progressCallback);
  }

  updateToLatest(progressCallback) {
    return this.updateToLatestWithOptions(null, progressCallback);
  }

  updateToLatestWithOptions(options, progressCallback) {
    return this._sendRequest({
      UpdateToLatest: {
        options
      }
    }, progressCallback);
  } // If the running host is current, adopt the current installed modules and
  // set up the module search path accordingly. If the running host is not
  // current, start the new current host and exit this process.


  async startCurrentVersion(options) {
    const versions = await this.queryCurrentVersions();
    await this.setRunningManifest(versions.last_successful_update);

    this._startCurrentVersionInner(options, versions);
  }

  startCurrentVersionSync(options) {
    const versions = this.queryCurrentVersionsSync();

    this._startCurrentVersionInner(options, versions);
  }

  async commitModules(versions) {
    if (this.committedHostVersion == null) {
      throw new Error('Cannot commit modules before host version.');
    }

    if (versions == null) {
      versions = await this.queryCurrentVersions();
    }

    this._commitModulesInner(versions);
  }

  setRunningInBackground() {
    this.isRunningInBackground = true;
  }

  queryAndTruncateHistory() {
    const history = this.updateEventHistory;
    this.updateEventHistory = [];
    return history;
  }

  getKnownFolder(name) {
    if (!this.valid) {
      throw new Error(INVALID_UPDATER_ERROR);
    }

    return this.nativeUpdater.known_folder(name);
  }

  createShortcut(options) {
    if (!this.valid) {
      throw new Error(INVALID_UPDATER_ERROR);
    }

    return this.nativeUpdater.create_shortcut(options);
  }

}

function getUpdaterPlatformName(platform) {
  switch (platform) {
    case 'darwin':
      return 'osx';

    case 'win32':
      return 'win';

    default:
      return platform;
  }
}

function tryInitUpdater(buildInfo, repositoryUrl) {
  // We can't require this in module scope because it's not part of the
  // bootstrapper, which carries a copy of the Updater class.
  const paths = require('./paths');

  const rootPath = paths.getInstallPath(); // If we're not running from an actual install directory, don't bother trying
  // to initialize the updater.

  if (rootPath == null) {
    return false;
  }

  instance = new Updater({
    release_channel: buildInfo.releaseChannel,
    platform: getUpdaterPlatformName(process.platform),
    repository_url: repositoryUrl,
    root_path: rootPath
  });
  return instance.valid;
}

function getUpdater() {
  if (instance != null && instance.valid) {
    return instance;
  }
}

module.exports = {
  Updater,
  tryInitUpdater,
  getUpdater,
  TASK_STATE_COMPLETE,
  TASK_STATE_FAILED,
  TASK_STATE_WAITING,
  TASK_STATE_WORKING,
  INCONSISTENT_INSTALLER_STATE_ERROR
};#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../mkdirp/bin/cmd.js" "$@"
  ret=$?
else 
  node  "$basedir/../mkdirp/bin/cmd.js" "$@"
  ret=$?
fi
exit $ret
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\mkdirp\bin\cmd.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\mkdirp\bin\cmd.js" %*
)#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../rimraf/bin.js" "$@"
  ret=$?
else 
  node  "$basedir/../rimraf/bin.js" "$@"
  ret=$?
fi
exit $ret
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\rimraf\bin.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\rimraf\bin.js" %*
)#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../sshpk/bin/sshpk-conv" "$@"
  ret=$?
else 
  node  "$basedir/../sshpk/bin/sshpk-conv" "$@"
  ret=$?
fi
exit $ret
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\sshpk\bin\sshpk-conv" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\sshpk\bin\sshpk-conv" %*
)#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../sshpk/bin/sshpk-sign" "$@"
  ret=$?
else 
  node  "$basedir/../sshpk/bin/sshpk-sign" "$@"
  ret=$?
fi
exit $ret
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\sshpk\bin\sshpk-sign" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\sshpk\bin\sshpk-sign" %*
)#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../sshpk/bin/sshpk-verify" "$@"
  ret=$?
else 
  node  "$basedir/../sshpk/bin/sshpk-verify" "$@"
  ret=$?
fi
exit $ret
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\sshpk\bin\sshpk-verify" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\sshpk\bin\sshpk-verify" %*
)#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../uuid/bin/uuid" "$@"
  ret=$?
else 
  node  "$basedir/../uuid/bin/uuid" "$@"
  ret=$?
fi
exit $ret
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\uuid\bin\uuid" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\uuid\bin\uuid" %*
){
  "systemParams": "win32-x64-83",
  "modulesFolders": [
    "node_modules"
  ],
  "flags": [
    "production"
  ],
  "linkedModules": [],
  "topLevelPatterns": [
    "@sentry/node@6.0.0",
    "@types/electron@1.6.10",
    "devtron@1.4.0",
    "mkdirp@^0.5.1",
    "request@2.88.0",
    "rimraf@^2.6.3",
    "yauzl@^2.10.0"
  ],
  "lockfileEntries": {
    "@electron/get@^1.13.0": "https://registry.yarnpkg.com/@electron/get/-/get-1.13.1.tgz#42a0aa62fd1189638bd966e23effaebb16108368",
    "@sentry/core@6.0.0": "https://registry.yarnpkg.com/@sentry/core/-/core-6.0.0.tgz#831c1737cad10c48a299e6ded4a3b4539657a25b",
    "@sentry/hub@6.0.0": "https://registry.yarnpkg.com/@sentry/hub/-/hub-6.0.0.tgz#c0d8cf1d1f19384d1d3f23fe8c00bc6b7134b002",
    "@sentry/minimal@6.0.0": "https://registry.yarnpkg.com/@sentry/minimal/-/minimal-6.0.0.tgz#f38e1325937770c7d038fdde11737e70804eb444",
    "@sentry/node@6.0.0": "https://registry.yarnpkg.com/@sentry/node/-/node-6.0.0.tgz#8d38dce5e23f35de87da12bb8b182f67fcd52218",
    "@sentry/tracing@6.0.0": "https://registry.yarnpkg.com/@sentry/tracing/-/tracing-6.0.0.tgz#9a78380ab6f316e2f50ce219af090f0d2896102e",
    "@sentry/types@6.0.0": "https://registry.yarnpkg.com/@sentry/types/-/types-6.0.0.tgz#250ae7287875bf729eddfe30346611bb11034f47",
    "@sentry/utils@6.0.0": "https://registry.yarnpkg.com/@sentry/utils/-/utils-6.0.0.tgz#87a8e7c29c3b05483d31654c106df6b7ed95d10a",
    "@sindresorhus/is@^0.14.0": "https://registry.yarnpkg.com/@sindresorhus/is/-/is-0.14.0.tgz#9fb3a3cf3132328151f353de4632e01e52102bea",
    "@szmarczak/http-timer@^1.1.2": "https://registry.yarnpkg.com/@szmarczak/http-timer/-/http-timer-1.1.2.tgz#b1665e2c461a2cd92f4c1bbf50d5454de0d4b421",
    "@types/electron@1.6.10": "https://registry.yarnpkg.com/@types/electron/-/electron-1.6.10.tgz#7e87888ed3888767cca68e92772c2c8ea46bc873",
    "@types/node@^14.6.2": "https://registry.yarnpkg.com/@types/node/-/node-14.18.5.tgz#0dd636fe7b2c6055cbed0d4ca3b7fb540f130a96",
    "accessibility-developer-tools@^2.11.0": "https://registry.yarnpkg.com/accessibility-developer-tools/-/accessibility-developer-tools-2.12.0.tgz#3da0cce9d6ec6373964b84f35db7cfc3df7ab514",
    "agent-base@6": "https://registry.yarnpkg.com/agent-base/-/agent-base-6.0.2.tgz#49fff58577cfee3f37176feab4c22e00f86d7f77",
    "ajv@^6.12.3": "https://registry.yarnpkg.com/ajv/-/ajv-6.12.6.tgz#baf5a62e802b07d977034586f8c3baf5adf26df4",
    "asn1@~0.2.3": "https://registry.yarnpkg.com/asn1/-/asn1-0.2.4.tgz#8d2475dfab553bb33e77b54e59e880bb8ce23136",
    "assert-plus@1.0.0": "https://registry.yarnpkg.com/assert-plus/-/assert-plus-1.0.0.tgz#f12e0f3c5d77b0b1cdd9146942e4e96c1e4dd525",
    "assert-plus@^1.0.0": "https://registry.yarnpkg.com/assert-plus/-/assert-plus-1.0.0.tgz#f12e0f3c5d77b0b1cdd9146942e4e96c1e4dd525",
    "asynckit@^0.4.0": "https://registry.yarnpkg.com/asynckit/-/asynckit-0.4.0.tgz#c79ed97f7f34cb8f2ba1bc9790bcc366474b4b79",
    "aws-sign2@~0.7.0": "https://registry.yarnpkg.com/aws-sign2/-/aws-sign2-0.7.0.tgz#b46e890934a9591f2d2f6f86d7e6a9f1b3fe76a8",
    "aws4@^1.8.0": "https://registry.yarnpkg.com/aws4/-/aws4-1.11.0.tgz#d61f46d83b2519250e2784daf5b09479a8b41c59",
    "balanced-match@^1.0.0": "https://registry.yarnpkg.com/balanced-match/-/balanced-match-1.0.2.tgz#e83e3a7e3f300b34cb9d87f615fa0cbf357690ee",
    "bcrypt-pbkdf@^1.0.0": "https://registry.yarnpkg.com/bcrypt-pbkdf/-/bcrypt-pbkdf-1.0.2.tgz#a4301d389b6a43f9b67ff3ca11a3f6637e360e9e",
    "boolean@^3.0.1": "https://registry.yarnpkg.com/boolean/-/boolean-3.1.4.tgz#f51a2fb5838a99e06f9b6ec1edb674de67026435",
    "brace-expansion@^1.1.7": "https://registry.yarnpkg.com/brace-expansion/-/brace-expansion-1.1.11.tgz#3c7fcbf529d87226f3d2f52b966ff5271eb441dd",
    "buffer-crc32@~0.2.3": "https://registry.yarnpkg.com/buffer-crc32/-/buffer-crc32-0.2.13.tgz#0d333e3f00eac50aa1454abd30ef8c2a5d9a7242",
    "buffer-from@^1.0.0": "https://registry.yarnpkg.com/buffer-from/-/buffer-from-1.1.2.tgz#2b146a6fd72e80b4f55d255f35ed59a3a9a41bd5",
    "cacheable-request@^6.0.0": "https://registry.yarnpkg.com/cacheable-request/-/cacheable-request-6.1.0.tgz#20ffb8bd162ba4be11e9567d823db651052ca912",
    "caseless@~0.12.0": "https://registry.yarnpkg.com/caseless/-/caseless-0.12.0.tgz#1b681c21ff84033c826543090689420d187151dc",
    "clone-response@^1.0.2": "https://registry.yarnpkg.com/clone-response/-/clone-response-1.0.2.tgz#d1dc973920314df67fbeb94223b4ee350239e96b",
    "combined-stream@^1.0.6": "https://registry.yarnpkg.com/combined-stream/-/combined-stream-1.0.8.tgz#c3d45a8b34fd730631a110a8a2520682b31d5a7f",
    "combined-stream@~1.0.6": "https://registry.yarnpkg.com/combined-stream/-/combined-stream-1.0.8.tgz#c3d45a8b34fd730631a110a8a2520682b31d5a7f",
    "concat-map@0.0.1": "https://registry.yarnpkg.com/concat-map/-/concat-map-0.0.1.tgz#d8a96bd77fd68df7793a73036a3ba0d5405d477b",
    "concat-stream@^1.6.2": "https://registry.yarnpkg.com/concat-stream/-/concat-stream-1.6.2.tgz#904bdf194cd3122fc675c77fc4ac3d4ff0fd1a34",
    "config-chain@^1.1.11": "https://registry.yarnpkg.com/config-chain/-/config-chain-1.1.13.tgz#fad0795aa6a6cdaff9ed1b68e9dff94372c232f4",
    "cookie@^0.4.1": "https://registry.yarnpkg.com/cookie/-/cookie-0.4.1.tgz#afd713fe26ebd21ba95ceb61f9a8116e50a537d1",
    "core-util-is@1.0.2": "https://registry.yarnpkg.com/core-util-is/-/core-util-is-1.0.2.tgz#b5fd54220aa2bc5ab57aab7140c940754503c1a7",
    "core-util-is@~1.0.0": "https://registry.yarnpkg.com/core-util-is/-/core-util-is-1.0.3.tgz#a6042d3634c2b27e9328f837b965fac83808db85",
    "dashdash@^1.12.0": "https://registry.yarnpkg.com/dashdash/-/dashdash-1.14.1.tgz#853cfa0f7cbe2fed5de20326b8dd581035f6e2f0",
    "debug@4": "https://registry.yarnpkg.com/debug/-/debug-4.3.2.tgz#f0a49c18ac8779e31d4a0c6029dfb76873c7428b",
    "debug@^2.6.9": "https://registry.yarnpkg.com/debug/-/debug-2.6.9.tgz#5d128515df134ff327e90a4c93f4e077a536341f",
    "debug@^4.1.0": "https://registry.yarnpkg.com/debug/-/debug-4.3.3.tgz#04266e0b70a98d4462e6e288e38259213332b664",
    "debug@^4.1.1": "https://registry.yarnpkg.com/debug/-/debug-4.3.3.tgz#04266e0b70a98d4462e6e288e38259213332b664",
    "decompress-response@^3.3.0": "https://registry.yarnpkg.com/decompress-response/-/decompress-response-3.3.0.tgz#80a4dd323748384bfa248083622aedec982adff3",
    "defer-to-connect@^1.0.1": "https://registry.yarnpkg.com/defer-to-connect/-/defer-to-connect-1.1.3.tgz#331ae050c08dcf789f8c83a7b81f0ed94f4ac591",
    "define-properties@^1.1.3": "https://registry.yarnpkg.com/define-properties/-/define-properties-1.1.3.tgz#cf88da6cbee26fe6db7094f61d870cbd84cee9f1",
    "delayed-stream@~1.0.0": "https://registry.yarnpkg.com/delayed-stream/-/delayed-stream-1.0.0.tgz#df3ae199acadfb7d440aaae0b29e2272b24ec619",
    "detect-node@^2.0.4": "https://registry.yarnpkg.com/detect-node/-/detect-node-2.1.0.tgz#c9c70775a49c3d03bc2c06d9a73be550f978f8b1",
    "devtron@1.4.0": "https://registry.yarnpkg.com/devtron/-/devtron-1.4.0.tgz#b5e748bd6e95bbe70bfcc68aae6fe696119441e1",
    "duplexer3@^0.1.4": "https://registry.yarnpkg.com/duplexer3/-/duplexer3-0.1.4.tgz#ee01dd1cac0ed3cbc7fdbea37dc0a8f1ce002ce2",
    "ecc-jsbn@~0.1.1": "https://registry.yarnpkg.com/ecc-jsbn/-/ecc-jsbn-0.1.2.tgz#3a83a904e54353287874c564b7549386849a98c9",
    "electron@*": "https://registry.yarnpkg.com/electron/-/electron-16.0.6.tgz#d7a420ef2cb39d7d0a4d8760c03d72b137a033d5",
    "encodeurl@^1.0.2": "https://registry.yarnpkg.com/encodeurl/-/encodeurl-1.0.2.tgz#ad3ff4c86ec2d029322f5a02c3a9a606c95b3f59",
    "end-of-stream@^1.1.0": "https://registry.yarnpkg.com/end-of-stream/-/end-of-stream-1.4.4.tgz#5ae64a5f45057baf3626ec14da0ca5e4b2431eb0",
    "env-paths@^2.2.0": "https://registry.yarnpkg.com/env-paths/-/env-paths-2.2.1.tgz#420399d416ce1fbe9bc0a07c62fa68d67fd0f8f2",
    "es6-error@^4.1.1": "https://registry.yarnpkg.com/es6-error/-/es6-error-4.1.1.tgz#9e3af407459deed47e9a91f9b885a84eb05c561d",
    "escape-string-regexp@^4.0.0": "https://registry.yarnpkg.com/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz#14ba83a5d373e3d311e5afca29cf5bfad965bf34",
    "extend@~3.0.2": "https://registry.yarnpkg.com/extend/-/extend-3.0.2.tgz#f8b1136b4071fbd8eb140aff858b1019ec2915fa",
    "extract-zip@^1.0.3": "https://registry.yarnpkg.com/extract-zip/-/extract-zip-1.7.0.tgz#556cc3ae9df7f452c493a0cfb51cc30277940927",
    "extsprintf@1.3.0": "https://registry.yarnpkg.com/extsprintf/-/extsprintf-1.3.0.tgz#96918440e3041a7a414f8c52e3c574eb3c3e1e05",
    "extsprintf@^1.2.0": "https://registry.yarnpkg.com/extsprintf/-/extsprintf-1.4.0.tgz#e2689f8f356fad62cca65a3a91c5df5f9551692f",
    "fast-deep-equal@^3.1.1": "https://registry.yarnpkg.com/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz#3a7d56b559d6cbc3eb512325244e619a65c6c525",
    "fast-json-stable-stringify@^2.0.0": "https://registry.yarnpkg.com/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz#874bf69c6f404c2b5d99c481341399fd55892633",
    "fd-slicer@~1.1.0": "https://registry.yarnpkg.com/fd-slicer/-/fd-slicer-1.1.0.tgz#25c7c89cb1f9077f8891bbe61d8f390eae256f1e",
    "forever-agent@~0.6.1": "https://registry.yarnpkg.com/forever-agent/-/forever-agent-0.6.1.tgz#fbc71f0c41adeb37f96c577ad1ed42d8fdacca91",
    "form-data@~2.3.2": "https://registry.yarnpkg.com/form-data/-/form-data-2.3.3.tgz#dcce52c05f644f298c6a7ab936bd724ceffbf3a6",
    "fs-extra@^8.1.0": "https://registry.yarnpkg.com/fs-extra/-/fs-extra-8.1.0.tgz#49d43c45a88cd9677668cb7be1b46efdb8d2e1c0",
    "fs.realpath@^1.0.0": "https://registry.yarnpkg.com/fs.realpath/-/fs.realpath-1.0.0.tgz#1504ad2523158caa40db4a2787cb01411994ea4f",
    "get-stream@^4.1.0": "https://registry.yarnpkg.com/get-stream/-/get-stream-4.1.0.tgz#c1b255575f3dc21d59bfc79cd3d2b46b1c3a54b5",
    "get-stream@^5.1.0": "https://registry.yarnpkg.com/get-stream/-/get-stream-5.2.0.tgz#4966a1795ee5ace65e706c4b7beb71257d6e22d3",
    "getpass@^0.1.1": "https://registry.yarnpkg.com/getpass/-/getpass-0.1.7.tgz#5eff8e3e684d569ae4cb2b1282604e8ba62149fa",
    "glob@^7.1.3": "https://registry.yarnpkg.com/glob/-/glob-7.1.7.tgz#3b193e9233f01d42d0b3f78294bbeeb418f94a90",
    "global-agent@^3.0.0": "https://registry.yarnpkg.com/global-agent/-/global-agent-3.0.0.tgz#ae7cd31bd3583b93c5a16437a1afe27cc33a1ab6",
    "global-tunnel-ng@^2.7.1": "https://registry.yarnpkg.com/global-tunnel-ng/-/global-tunnel-ng-2.7.1.tgz#d03b5102dfde3a69914f5ee7d86761ca35d57d8f",
    "globalthis@^1.0.1": "https://registry.yarnpkg.com/globalthis/-/globalthis-1.0.2.tgz#2a235d34f4d8036219f7e34929b5de9e18166b8b",
    "got@^9.6.0": "https://registry.yarnpkg.com/got/-/got-9.6.0.tgz#edf45e7d67f99545705de1f7bbeeeb121765ed85",
    "graceful-fs@^4.1.6": "https://registry.yarnpkg.com/graceful-fs/-/graceful-fs-4.2.8.tgz#e412b8d33f5e006593cbd3cee6df9f2cebbe802a",
    "graceful-fs@^4.2.0": "https://registry.yarnpkg.com/graceful-fs/-/graceful-fs-4.2.8.tgz#e412b8d33f5e006593cbd3cee6df9f2cebbe802a",
    "har-schema@^2.0.0": "https://registry.yarnpkg.com/har-schema/-/har-schema-2.0.0.tgz#a94c2224ebcac04782a0d9035521f24735b7ec92",
    "har-validator@~5.1.0": "https://registry.yarnpkg.com/har-validator/-/har-validator-5.1.5.tgz#1f0803b9f8cb20c0fa13822df1ecddb36bde1efd",
    "highlight.js@^9.3.0": "https://registry.yarnpkg.com/highlight.js/-/highlight.js-9.18.5.tgz#d18a359867f378c138d6819edfc2a8acd5f29825",
    "http-cache-semantics@^4.0.0": "https://registry.yarnpkg.com/http-cache-semantics/-/http-cache-semantics-4.1.0.tgz#49e91c5cbf36c9b94bcfcd71c23d5249ec74e390",
    "http-signature@~1.2.0": "https://registry.yarnpkg.com/http-signature/-/http-signature-1.2.0.tgz#9aecd925114772f3d95b65a60abb8f7c18fbace1",
    "https-proxy-agent@^5.0.0": "https://registry.yarnpkg.com/https-proxy-agent/-/https-proxy-agent-5.0.0.tgz#e2a90542abb68a762e0a0850f6c9edadfd8506b2",
    "humanize-plus@^1.8.1": "https://registry.yarnpkg.com/humanize-plus/-/humanize-plus-1.8.2.tgz#a65b34459ad6367adbb3707a82a3c9f916167030",
    "inflight@^1.0.4": "https://registry.yarnpkg.com/inflight/-/inflight-1.0.6.tgz#49bd6331d7d02d0c09bc910a1075ba8165b56df9",
    "inherits@2": "https://registry.yarnpkg.com/inherits/-/inherits-2.0.4.tgz#0fa2c64f932917c3433a0ded55363aae37416b7c",
    "inherits@^2.0.3": "https://registry.yarnpkg.com/inherits/-/inherits-2.0.4.tgz#0fa2c64f932917c3433a0ded55363aae37416b7c",
    "inherits@~2.0.3": "https://registry.yarnpkg.com/inherits/-/inherits-2.0.4.tgz#0fa2c64f932917c3433a0ded55363aae37416b7c",
    "ini@^1.3.4": "https://registry.yarnpkg.com/ini/-/ini-1.3.8.tgz#a29da425b48806f34767a4efce397269af28432c",
    "is-typedarray@~1.0.0": "https://registry.yarnpkg.com/is-typedarray/-/is-typedarray-1.0.0.tgz#e479c80858df0c1b11ddda6940f96011fcda4a9a",
    "isarray@~1.0.0": "https://registry.yarnpkg.com/isarray/-/isarray-1.0.0.tgz#bb935d48582cba168c06834957a54a3e07124f11",
    "isstream@~0.1.2": "https://registry.yarnpkg.com/isstream/-/isstream-0.1.2.tgz#47e63f7af55afa6f92e1500e690eb8b8529c099a",
    "jsbn@~0.1.0": "https://registry.yarnpkg.com/jsbn/-/jsbn-0.1.1.tgz#a5e654c2e5a2deb5f201d96cefbca80c0ef2f513",
    "json-buffer@3.0.0": "https://registry.yarnpkg.com/json-buffer/-/json-buffer-3.0.0.tgz#5b1f397afc75d677bde8bcfc0e47e1f9a3d9a898",
    "json-schema-traverse@^0.4.1": "https://registry.yarnpkg.com/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz#69f6a87d9513ab8bb8fe63bdb0979c448e684660",
    "json-schema@0.2.3": "https://registry.yarnpkg.com/json-schema/-/json-schema-0.2.3.tgz#b480c892e59a2f05954ce727bd3f2a4e882f9e13",
    "json-stringify-safe@^5.0.1": "https://registry.yarnpkg.com/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz#1296a2d58fd45f19a0f6ce01d65701e2c735b6eb",
    "json-stringify-safe@~5.0.1": "https://registry.yarnpkg.com/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz#1296a2d58fd45f19a0f6ce01d65701e2c735b6eb",
    "jsonfile@^4.0.0": "https://registry.yarnpkg.com/jsonfile/-/jsonfile-4.0.0.tgz#8771aae0799b64076b76640fca058f9c10e33ecb",
    "jsprim@^1.2.2": "https://registry.yarnpkg.com/jsprim/-/jsprim-1.4.1.tgz#313e66bc1e5cc06e438bc1b7499c2e5c56acb6a2",
    "keyv@^3.0.0": "https://registry.yarnpkg.com/keyv/-/keyv-3.1.0.tgz#ecc228486f69991e49e9476485a5be1e8fc5c4d9",
    "lodash@^4.17.10": "https://registry.yarnpkg.com/lodash/-/lodash-4.17.21.tgz#679591c564c3bffaae8454cf0b3df370c3d6911c",
    "lowercase-keys@^1.0.0": "https://registry.yarnpkg.com/lowercase-keys/-/lowercase-keys-1.0.1.tgz#6f9e30b47084d971a7c820ff15a6c5167b74c26f",
    "lowercase-keys@^1.0.1": "https://registry.yarnpkg.com/lowercase-keys/-/lowercase-keys-1.0.1.tgz#6f9e30b47084d971a7c820ff15a6c5167b74c26f",
    "lowercase-keys@^2.0.0": "https://registry.yarnpkg.com/lowercase-keys/-/lowercase-keys-2.0.0.tgz#2603e78b7b4b0006cbca2fbcc8a3202558ac9479",
    "lru-cache@^6.0.0": "https://registry.yarnpkg.com/lru-cache/-/lru-cache-6.0.0.tgz#6d6fe6570ebd96aaf90fcad1dafa3b2566db3a94",
    "lru_map@^0.3.3": "https://registry.yarnpkg.com/lru_map/-/lru_map-0.3.3.tgz#b5c8351b9464cbd750335a79650a0ec0e56118dd",
    "matcher@^3.0.0": "https://registry.yarnpkg.com/matcher/-/matcher-3.0.0.tgz#bd9060f4c5b70aa8041ccc6f80368760994f30ca",
    "mime-db@1.49.0": "https://registry.yarnpkg.com/mime-db/-/mime-db-1.49.0.tgz#f3dfde60c99e9cf3bc9701d687778f537001cbed",
    "mime-types@^2.1.12": "https://registry.yarnpkg.com/mime-types/-/mime-types-2.1.32.tgz#1d00e89e7de7fe02008db61001d9e02852670fd5",
    "mime-types@~2.1.19": "https://registry.yarnpkg.com/mime-types/-/mime-types-2.1.32.tgz#1d00e89e7de7fe02008db61001d9e02852670fd5",
    "mimic-response@^1.0.0": "https://registry.yarnpkg.com/mimic-response/-/mimic-response-1.0.1.tgz#4923538878eef42063cb8a3e3b0798781487ab1b",
    "mimic-response@^1.0.1": "https://registry.yarnpkg.com/mimic-response/-/mimic-response-1.0.1.tgz#4923538878eef42063cb8a3e3b0798781487ab1b",
    "minimatch@^3.0.4": "https://registry.yarnpkg.com/minimatch/-/minimatch-3.0.4.tgz#5166e286457f03306064be5497e8dbb0c3d32083",
    "minimist@^1.2.5": "https://registry.yarnpkg.com/minimist/-/minimist-1.2.5.tgz#67d66014b66a6a8aaa0c083c5fd58df4e4e97602",
    "mkdirp@^0.5.1": "https://registry.yarnpkg.com/mkdirp/-/mkdirp-0.5.5.tgz#d91cefd62d1436ca0f41620e251288d420099def",
    "mkdirp@^0.5.4": "https://registry.yarnpkg.com/mkdirp/-/mkdirp-0.5.5.tgz#d91cefd62d1436ca0f41620e251288d420099def",
    "ms@2.0.0": "https://registry.yarnpkg.com/ms/-/ms-2.0.0.tgz#5608aeadfc00be6c2901df5f9861788de0d597c8",
    "ms@2.1.2": "https://registry.yarnpkg.com/ms/-/ms-2.1.2.tgz#d09d1f357b443f493382a8eb3ccd183872ae6009",
    "normalize-url@^4.1.0": "https://registry.yarnpkg.com/normalize-url/-/normalize-url-4.5.1.tgz#0dd90cf1288ee1d1313b87081c9a5932ee48518a",
    "npm-conf@^1.1.3": "https://registry.yarnpkg.com/npm-conf/-/npm-conf-1.1.3.tgz#256cc47bd0e218c259c4e9550bf413bc2192aff9",
    "oauth-sign@~0.9.0": "https://registry.yarnpkg.com/oauth-sign/-/oauth-sign-0.9.0.tgz#47a7b016baa68b5fa0ecf3dee08a85c679ac6455",
    "object-keys@^1.0.12": "https://registry.yarnpkg.com/object-keys/-/object-keys-1.1.1.tgz#1c47f272df277f3b1daf061677d9c82e2322c60e",
    "once@^1.3.0": "https://registry.yarnpkg.com/once/-/once-1.4.0.tgz#583b1aa775961d4b113ac17d9c50baef9dd76bd1",
    "once@^1.3.1": "https://registry.yarnpkg.com/once/-/once-1.4.0.tgz#583b1aa775961d4b113ac17d9c50baef9dd76bd1",
    "once@^1.4.0": "https://registry.yarnpkg.com/once/-/once-1.4.0.tgz#583b1aa775961d4b113ac17d9c50baef9dd76bd1",
    "p-cancelable@^1.0.0": "https://registry.yarnpkg.com/p-cancelable/-/p-cancelable-1.1.0.tgz#d078d15a3af409220c886f1d9a0ca2e441ab26cc",
    "path-is-absolute@^1.0.0": "https://registry.yarnpkg.com/path-is-absolute/-/path-is-absolute-1.0.1.tgz#174b9268735534ffbc7ace6bf53a5a9e1b5c5f5f",
    "pend@~1.2.0": "https://registry.yarnpkg.com/pend/-/pend-1.2.0.tgz#7a57eb550a6783f9115331fcf4663d5c8e007a50",
    "performance-now@^2.1.0": "https://registry.yarnpkg.com/performance-now/-/performance-now-2.1.0.tgz#6309f4e0e5fa913ec1c69307ae364b4b377c9e7b",
    "pify@^3.0.0": "https://registry.yarnpkg.com/pify/-/pify-3.0.0.tgz#e5a4acd2c101fdf3d9a4d07f0dbc4db49dd28176",
    "prepend-http@^2.0.0": "https://registry.yarnpkg.com/prepend-http/-/prepend-http-2.0.0.tgz#e92434bfa5ea8c19f41cdfd401d741a3c819d897",
    "process-nextick-args@~2.0.0": "https://registry.yarnpkg.com/process-nextick-args/-/process-nextick-args-2.0.1.tgz#7820d9b16120cc55ca9ae7792680ae7dba6d7fe2",
    "progress@^2.0.3": "https://registry.yarnpkg.com/progress/-/progress-2.0.3.tgz#7e8cf8d8f5b8f239c1bc68beb4eb78567d572ef8",
    "proto-list@~1.2.1": "https://registry.yarnpkg.com/proto-list/-/proto-list-1.2.4.tgz#212d5bfe1318306a420f6402b8e26ff39647a849",
    "psl@^1.1.24": "https://registry.yarnpkg.com/psl/-/psl-1.8.0.tgz#9326f8bcfb013adcc005fdff056acce020e51c24",
    "pump@^3.0.0": "https://registry.yarnpkg.com/pump/-/pump-3.0.0.tgz#b4a2116815bde2f4e1ea602354e8c75565107a64",
    "punycode@^1.4.1": "https://registry.yarnpkg.com/punycode/-/punycode-1.4.1.tgz#c0d5a63b2718800ad8e1eb0fa5269c84dd41845e",
    "punycode@^2.1.0": "https://registry.yarnpkg.com/punycode/-/punycode-2.1.1.tgz#b58b010ac40c22c5657616c8d2c2c02c7bf479ec",
    "qs@~6.5.2": "https://registry.yarnpkg.com/qs/-/qs-6.5.2.tgz#cb3ae806e8740444584ef154ce8ee98d403f3e36",
    "readable-stream@^2.2.2": "https://registry.yarnpkg.com/readable-stream/-/readable-stream-2.3.7.tgz#1eca1cf711aef814c04f62252a36a62f6cb23b57",
    "request@2.88.0": "https://registry.yarnpkg.com/request/-/request-2.88.0.tgz#9c2fca4f7d35b592efe57c7f0a55e81052124fef",
    "responselike@^1.0.2": "https://registry.yarnpkg.com/responselike/-/responselike-1.0.2.tgz#918720ef3b631c5642be068f15ade5a46f4ba1e7",
    "rimraf@^2.6.3": "https://registry.yarnpkg.com/rimraf/-/rimraf-2.7.1.tgz#35797f13a7fdadc566142c29d4f07ccad483e3ec",
    "roarr@^2.15.3": "https://registry.yarnpkg.com/roarr/-/roarr-2.15.4.tgz#f5fe795b7b838ccfe35dc608e0282b9eba2e7afd",
    "safe-buffer@^5.0.1": "https://registry.yarnpkg.com/safe-buffer/-/safe-buffer-5.2.1.tgz#1eaf9fa9bdb1fdd4ec75f58f9cdb4e6b7827eec6",
    "safe-buffer@^5.1.2": "https://registry.yarnpkg.com/safe-buffer/-/safe-buffer-5.2.1.tgz#1eaf9fa9bdb1fdd4ec75f58f9cdb4e6b7827eec6",
    "safe-buffer@~5.1.0": "https://registry.yarnpkg.com/safe-buffer/-/safe-buffer-5.1.2.tgz#991ec69d296e0313747d59bdfd2b745c35f8828d",
    "safe-buffer@~5.1.1": "https://registry.yarnpkg.com/safe-buffer/-/safe-buffer-5.1.2.tgz#991ec69d296e0313747d59bdfd2b745c35f8828d",
    "safer-buffer@^2.0.2": "https://registry.yarnpkg.com/safer-buffer/-/safer-buffer-2.1.2.tgz#44fa161b0187b9549dd84bb91802f9bd8385cd6a",
    "safer-buffer@^2.1.0": "https://registry.yarnpkg.com/safer-buffer/-/safer-buffer-2.1.2.tgz#44fa161b0187b9549dd84bb91802f9bd8385cd6a",
    "safer-buffer@~2.1.0": "https://registry.yarnpkg.com/safer-buffer/-/safer-buffer-2.1.2.tgz#44fa161b0187b9549dd84bb91802f9bd8385cd6a",
    "semver-compare@^1.0.0": "https://registry.yarnpkg.com/semver-compare/-/semver-compare-1.0.0.tgz#0dee216a1c941ab37e9efb1788f6afc5ff5537fc",
    "semver@^6.2.0": "https://registry.yarnpkg.com/semver/-/semver-6.3.0.tgz#ee0a64c8af5e8ceea67687b133761e1becbd1d3d",
    "semver@^7.3.2": "https://registry.yarnpkg.com/semver/-/semver-7.3.5.tgz#0b621c879348d8998e4b0e4be94b3f12e6018ef7",
    "serialize-error@^7.0.1": "https://registry.yarnpkg.com/serialize-error/-/serialize-error-7.0.1.tgz#f1360b0447f61ffb483ec4157c737fab7d778e18",
    "sprintf-js@^1.1.2": "https://registry.yarnpkg.com/sprintf-js/-/sprintf-js-1.1.2.tgz#da1765262bf8c0f571749f2ad6c26300207ae673",
    "sshpk@^1.7.0": "https://registry.yarnpkg.com/sshpk/-/sshpk-1.16.1.tgz#fb661c0bef29b39db40769ee39fa70093d6f6877",
    "string_decoder@~1.1.1": "https://registry.yarnpkg.com/string_decoder/-/string_decoder-1.1.1.tgz#9cf1611ba62685d7030ae9e4ba34149c3af03fc8",
    "sumchecker@^3.0.1": "https://registry.yarnpkg.com/sumchecker/-/sumchecker-3.0.1.tgz#6377e996795abb0b6d348e9b3e1dfb24345a8e42",
    "to-readable-stream@^1.0.0": "https://registry.yarnpkg.com/to-readable-stream/-/to-readable-stream-1.0.0.tgz#ce0aa0c2f3df6adf852efb404a783e77c0475771",
    "tough-cookie@~2.4.3": "https://registry.yarnpkg.com/tough-cookie/-/tough-cookie-2.4.3.tgz#53f36da3f47783b0925afa06ff9f3b165280f781",
    "tslib@^1.9.3": "https://registry.yarnpkg.com/tslib/-/tslib-1.14.1.tgz#cf2d38bdc34a134bcaf1091c41f6619e2f672d00",
    "tunnel-agent@^0.6.0": "https://registry.yarnpkg.com/tunnel-agent/-/tunnel-agent-0.6.0.tgz#27a5dea06b36b04a0a9966774b290868f0fc40fd",
    "tunnel@^0.0.6": "https://registry.yarnpkg.com/tunnel/-/tunnel-0.0.6.tgz#72f1314b34a5b192db012324df2cc587ca47f92c",
    "tweetnacl@^0.14.3": "https://registry.yarnpkg.com/tweetnacl/-/tweetnacl-0.14.5.tgz#5ae68177f192d4456269d108afa93ff8743f4f64",
    "tweetnacl@~0.14.0": "https://registry.yarnpkg.com/tweetnacl/-/tweetnacl-0.14.5.tgz#5ae68177f192d4456269d108afa93ff8743f4f64",
    "type-fest@^0.13.1": "https://registry.yarnpkg.com/type-fest/-/type-fest-0.13.1.tgz#0172cb5bce80b0bd542ea348db50c7e21834d934",
    "typedarray@^0.0.6": "https://registry.yarnpkg.com/typedarray/-/typedarray-0.0.6.tgz#867ac74e3864187b1d3d47d996a78ec5c8830777",
    "universalify@^0.1.0": "https://registry.yarnpkg.com/universalify/-/universalify-0.1.2.tgz#b646f69be3942dabcecc9d6639c80dc105efaa66",
    "uri-js@^4.2.2": "https://registry.yarnpkg.com/uri-js/-/uri-js-4.4.1.tgz#9b1a52595225859e55f669d928f88c6c57f2a77e",
    "url-parse-lax@^3.0.0": "https://registry.yarnpkg.com/url-parse-lax/-/url-parse-lax-3.0.0.tgz#16b5cafc07dbe3676c1b1999177823d6503acb0c",
    "util-deprecate@~1.0.1": "https://registry.yarnpkg.com/util-deprecate/-/util-deprecate-1.0.2.tgz#450d4dc9fa70de732762fbd2d4a28981419a0ccf",
    "uuid@^3.3.2": "https://registry.yarnpkg.com/uuid/-/uuid-3.4.0.tgz#b23e4358afa8a202fe7a100af1f5f883f02007ee",
    "verror@1.10.0": "https://registry.yarnpkg.com/verror/-/verror-1.10.0.tgz#3a105ca17053af55d6e270c1f8288682e18da400",
    "wrappy@1": "https://registry.yarnpkg.com/wrappy/-/wrappy-1.0.2.tgz#b5243d8f3ec1aa35f1364605bc0d1036e30ab69f",
    "yallist@^4.0.0": "https://registry.yarnpkg.com/yallist/-/yallist-4.0.0.tgz#9bb92790d9c0effec63be73519e11a35019a3a72",
    "yauzl@^2.10.0": "https://registry.yarnpkg.com/yauzl/-/yauzl-2.10.0.tgz#c7eb17c93e112cb1086fa6d8e51fb0667b79a5f9"
  },
  "files": [],
  "artifacts": {}
}import { DsnLike, SdkMetadata } from '@sentry/types';
import { Dsn } from '@sentry/utils';
/**
 * Helper class to provide urls, headers and metadata that can be used to form
 * different types of requests to Sentry endpoints.
 * Supports both envelopes and regular event requests.
 **/
export declare class API {
    dsn: DsnLike;
    metadata: SdkMetadata;
    /** The internally used Dsn object. */
    private readonly _dsnObject;
    /** Create a new instance of API */
    constructor(dsn: DsnLike, metadata?: SdkMetadata);
    /** Returns the Dsn object. */
    getDsn(): Dsn;
    /** Returns the prefix to construct Sentry ingestion API endpoints. */
    getBaseApiEndpoint(): string;
    /** Returns the store endpoint URL. */
    getStoreEndpoint(): string;
    /**
     * Returns the store endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    getStoreEndpointWithUrlEncodedAuth(): string;
    /**
     * Returns the envelope endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    getEnvelopeEndpointWithUrlEncodedAuth(): string;
    /** Returns only the path component for the store endpoint. */
    getStoreEndpointPath(): string;
    /**
     * Returns an object that can be used in request headers.
     * This is needed for node and the old /store endpoint in sentry
     */
    getRequestHeaders(clientName: string, clientVersion: string): {
        [key: string]: string;
    };
    /** Returns the url to the report dialog endpoint. */
    getReportDialogEndpoint(dialogOptions?: {
        [key: string]: any;
        user?: {
            name?: string;
            email?: string;
        };
    }): string;
    /** Returns the envelope endpoint URL. */
    private _getEnvelopeEndpoint;
    /** Returns the ingest API endpoint for target. */
    private _getIngestEndpoint;
    /** Returns a URL-encoded string with auth config suitable for a query string. */
    private _encodedAuth;
}
//# sourceMappingURL=api.d.ts.map{"version":3,"file":"api.d.ts","sourceRoot":"","sources":["../src/api.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,OAAO,EAAE,WAAW,EAAE,MAAM,eAAe,CAAC;AACrD,OAAO,EAAE,GAAG,EAAa,MAAM,eAAe,CAAC;AAI/C;;;;IAII;AACJ,qBAAa,GAAG;IAIY,GAAG,EAAE,OAAO;IAAS,QAAQ,EAAE,WAAW;IAHpE,sCAAsC;IACtC,OAAO,CAAC,QAAQ,CAAC,UAAU,CAAM;IACjC,mCAAmC;gBACT,GAAG,EAAE,OAAO,EAAS,QAAQ,GAAE,WAAgB;IAIzE,8BAA8B;IACvB,MAAM,IAAI,GAAG;IAIpB,sEAAsE;IAC/D,kBAAkB,IAAI,MAAM;IAOnC,sCAAsC;IAC/B,gBAAgB,IAAI,MAAM;IAIjC;;;;OAIG;IACI,kCAAkC,IAAI,MAAM;IAInD;;;;OAIG;IACI,qCAAqC,IAAI,MAAM;IAItD,8DAA8D;IACvD,oBAAoB,IAAI,MAAM;IAKrC;;;OAGG;IACI,iBAAiB,CAAC,UAAU,EAAE,MAAM,EAAE,aAAa,EAAE,MAAM,GAAG;QAAE,CAAC,GAAG,EAAE,MAAM,GAAG,MAAM,CAAA;KAAE;IAe9F,qDAAqD;IAC9C,uBAAuB,CAC5B,aAAa,GAAE;QAEb,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAC;QACnB,IAAI,CAAC,EAAE;YAAE,IAAI,CAAC,EAAE,MAAM,CAAC;YAAC,KAAK,CAAC,EAAE,MAAM,CAAA;SAAE,CAAC;KACrC,GACL,MAAM;IAgCT,yCAAyC;IACzC,OAAO,CAAC,oBAAoB;IAI5B,kDAAkD;IAClD,OAAO,CAAC,kBAAkB;IAM1B,iFAAiF;IACjF,OAAO,CAAC,YAAY;CAUrB"}Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@sentry/utils");
var SENTRY_API_VERSION = '7';
/**
 * Helper class to provide urls, headers and metadata that can be used to form
 * different types of requests to Sentry endpoints.
 * Supports both envelopes and regular event requests.
 **/
var API = /** @class */ (function () {
    /** Create a new instance of API */
    function API(dsn, metadata) {
        if (metadata === void 0) { metadata = {}; }
        this.dsn = dsn;
        this.metadata = metadata;
        this._dsnObject = new utils_1.Dsn(dsn);
    }
    /** Returns the Dsn object. */
    API.prototype.getDsn = function () {
        return this._dsnObject;
    };
    /** Returns the prefix to construct Sentry ingestion API endpoints. */
    API.prototype.getBaseApiEndpoint = function () {
        var dsn = this._dsnObject;
        var protocol = dsn.protocol ? dsn.protocol + ":" : '';
        var port = dsn.port ? ":" + dsn.port : '';
        return protocol + "//" + dsn.host + port + (dsn.path ? "/" + dsn.path : '') + "/api/";
    };
    /** Returns the store endpoint URL. */
    API.prototype.getStoreEndpoint = function () {
        return this._getIngestEndpoint('store');
    };
    /**
     * Returns the store endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getStoreEndpointWithUrlEncodedAuth = function () {
        return this.getStoreEndpoint() + "?" + this._encodedAuth();
    };
    /**
     * Returns the envelope endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getEnvelopeEndpointWithUrlEncodedAuth = function () {
        return this._getEnvelopeEndpoint() + "?" + this._encodedAuth();
    };
    /** Returns only the path component for the store endpoint. */
    API.prototype.getStoreEndpointPath = function () {
        var dsn = this._dsnObject;
        return (dsn.path ? "/" + dsn.path : '') + "/api/" + dsn.projectId + "/store/";
    };
    /**
     * Returns an object that can be used in request headers.
     * This is needed for node and the old /store endpoint in sentry
     */
    API.prototype.getRequestHeaders = function (clientName, clientVersion) {
        // CHANGE THIS to use metadata but keep clientName and clientVersion compatible
        var dsn = this._dsnObject;
        var header = ["Sentry sentry_version=" + SENTRY_API_VERSION];
        header.push("sentry_client=" + clientName + "/" + clientVersion);
        header.push("sentry_key=" + dsn.user);
        if (dsn.pass) {
            header.push("sentry_secret=" + dsn.pass);
        }
        return {
            'Content-Type': 'application/json',
            'X-Sentry-Auth': header.join(', '),
        };
    };
    /** Returns the url to the report dialog endpoint. */
    API.prototype.getReportDialogEndpoint = function (dialogOptions) {
        if (dialogOptions === void 0) { dialogOptions = {}; }
        var dsn = this._dsnObject;
        var endpoint = this.getBaseApiEndpoint() + "embed/error-page/";
        var encodedOptions = [];
        encodedOptions.push("dsn=" + dsn.toString());
        for (var key in dialogOptions) {
            if (key === 'dsn') {
                continue;
            }
            if (key === 'user') {
                if (!dialogOptions.user) {
                    continue;
                }
                if (dialogOptions.user.name) {
                    encodedOptions.push("name=" + encodeURIComponent(dialogOptions.user.name));
                }
                if (dialogOptions.user.email) {
                    encodedOptions.push("email=" + encodeURIComponent(dialogOptions.user.email));
                }
            }
            else {
                encodedOptions.push(encodeURIComponent(key) + "=" + encodeURIComponent(dialogOptions[key]));
            }
        }
        if (encodedOptions.length) {
            return endpoint + "?" + encodedOptions.join('&');
        }
        return endpoint;
    };
    /** Returns the envelope endpoint URL. */
    API.prototype._getEnvelopeEndpoint = function () {
        return this._getIngestEndpoint('envelope');
    };
    /** Returns the ingest API endpoint for target. */
    API.prototype._getIngestEndpoint = function (target) {
        var base = this.getBaseApiEndpoint();
        var dsn = this._dsnObject;
        return "" + base + dsn.projectId + "/" + target + "/";
    };
    /** Returns a URL-encoded string with auth config suitable for a query string. */
    API.prototype._encodedAuth = function () {
        var dsn = this._dsnObject;
        var auth = {
            // We send only the minimum set of required information. See
            // https://github.com/getsentry/sentry-javascript/issues/2572.
            sentry_key: dsn.user,
            sentry_version: SENTRY_API_VERSION,
        };
        return utils_1.urlEncode(auth);
    };
    return API;
}());
exports.API = API;
//# sourceMappingURL=api.js.map{"version":3,"file":"api.js","sourceRoot":"","sources":["../src/api.ts"],"names":[],"mappings":"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","sourcesContent":["import { DsnLike, SdkMetadata } from '@sentry/types';\nimport { Dsn, urlEncode } from '@sentry/utils';\n\nconst SENTRY_API_VERSION = '7';\n\n/**\n * Helper class to provide urls, headers and metadata that can be used to form\n * different types of requests to Sentry endpoints.\n * Supports both envelopes and regular event requests.\n **/\nexport class API {\n  /** The internally used Dsn object. */\n  private readonly _dsnObject: Dsn;\n  /** Create a new instance of API */\n  public constructor(public dsn: DsnLike, public metadata: SdkMetadata = {}) {\n    this._dsnObject = new Dsn(dsn);\n  }\n\n  /** Returns the Dsn object. */\n  public getDsn(): Dsn {\n    return this._dsnObject;\n  }\n\n  /** Returns the prefix to construct Sentry ingestion API endpoints. */\n  public getBaseApiEndpoint(): string {\n    const dsn = this._dsnObject;\n    const protocol = dsn.protocol ? `${dsn.protocol}:` : '';\n    const port = dsn.port ? `:${dsn.port}` : '';\n    return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ''}/api/`;\n  }\n\n  /** Returns the store endpoint URL. */\n  public getStoreEndpoint(): string {\n    return this._getIngestEndpoint('store');\n  }\n\n  /**\n   * Returns the store endpoint URL with auth in the query string.\n   *\n   * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.\n   */\n  public getStoreEndpointWithUrlEncodedAuth(): string {\n    return `${this.getStoreEndpoint()}?${this._encodedAuth()}`;\n  }\n\n  /**\n   * Returns the envelope endpoint URL with auth in the query string.\n   *\n   * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.\n   */\n  public getEnvelopeEndpointWithUrlEncodedAuth(): string {\n    return `${this._getEnvelopeEndpoint()}?${this._encodedAuth()}`;\n  }\n\n  /** Returns only the path component for the store endpoint. */\n  public getStoreEndpointPath(): string {\n    const dsn = this._dsnObject;\n    return `${dsn.path ? `/${dsn.path}` : ''}/api/${dsn.projectId}/store/`;\n  }\n\n  /**\n   * Returns an object that can be used in request headers.\n   * This is needed for node and the old /store endpoint in sentry\n   */\n  public getRequestHeaders(clientName: string, clientVersion: string): { [key: string]: string } {\n    // CHANGE THIS to use metadata but keep clientName and clientVersion compatible\n    const dsn = this._dsnObject;\n    const header = [`Sentry sentry_version=${SENTRY_API_VERSION}`];\n    header.push(`sentry_client=${clientName}/${clientVersion}`);\n    header.push(`sentry_key=${dsn.user}`);\n    if (dsn.pass) {\n      header.push(`sentry_secret=${dsn.pass}`);\n    }\n    return {\n      'Content-Type': 'application/json',\n      'X-Sentry-Auth': header.join(', '),\n    };\n  }\n\n  /** Returns the url to the report dialog endpoint. */\n  public getReportDialogEndpoint(\n    dialogOptions: {\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      [key: string]: any;\n      user?: { name?: string; email?: string };\n    } = {},\n  ): string {\n    const dsn = this._dsnObject;\n    const endpoint = `${this.getBaseApiEndpoint()}embed/error-page/`;\n\n    const encodedOptions = [];\n    encodedOptions.push(`dsn=${dsn.toString()}`);\n    for (const key in dialogOptions) {\n      if (key === 'dsn') {\n        continue;\n      }\n\n      if (key === 'user') {\n        if (!dialogOptions.user) {\n          continue;\n        }\n        if (dialogOptions.user.name) {\n          encodedOptions.push(`name=${encodeURIComponent(dialogOptions.user.name)}`);\n        }\n        if (dialogOptions.user.email) {\n          encodedOptions.push(`email=${encodeURIComponent(dialogOptions.user.email)}`);\n        }\n      } else {\n        encodedOptions.push(`${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key] as string)}`);\n      }\n    }\n    if (encodedOptions.length) {\n      return `${endpoint}?${encodedOptions.join('&')}`;\n    }\n\n    return endpoint;\n  }\n\n  /** Returns the envelope endpoint URL. */\n  private _getEnvelopeEndpoint(): string {\n    return this._getIngestEndpoint('envelope');\n  }\n\n  /** Returns the ingest API endpoint for target. */\n  private _getIngestEndpoint(target: 'store' | 'envelope'): string {\n    const base = this.getBaseApiEndpoint();\n    const dsn = this._dsnObject;\n    return `${base}${dsn.projectId}/${target}/`;\n  }\n\n  /** Returns a URL-encoded string with auth config suitable for a query string. */\n  private _encodedAuth(): string {\n    const dsn = this._dsnObject;\n    const auth = {\n      // We send only the minimum set of required information. See\n      // https://github.com/getsentry/sentry-javascript/issues/2572.\n      sentry_key: dsn.user,\n      sentry_version: SENTRY_API_VERSION,\n    };\n    return urlEncode(auth);\n  }\n}\n"]}import { Event, EventHint, Options, Session, Severity, Transport } from '@sentry/types';
/**
 * Internal platform-dependent Sentry SDK Backend.
 *
 * While {@link Client} contains business logic specific to an SDK, the
 * Backend offers platform specific implementations for low-level operations.
 * These are persisting and loading information, sending events, and hooking
 * into the environment.
 *
 * Backends receive a handle to the Client in their constructor. When a
 * Backend automatically generates events, it must pass them to
 * the Client for validation and processing first.
 *
 * Usually, the Client will be of corresponding type, e.g. NodeBackend
 * receives NodeClient. However, higher-level SDKs can choose to instantiate
 * multiple Backends and delegate tasks between them. In this case, an event
 * generated by one backend might very well be sent by another one.
 *
 * The client also provides access to options via {@link Client.getOptions}.
 * @hidden
 */
export interface Backend {
    /** Creates a {@link Event} from an exception. */
    eventFromException(exception: any, hint?: EventHint): PromiseLike<Event>;
    /** Creates a {@link Event} from a plain message. */
    eventFromMessage(message: string, level?: Severity, hint?: EventHint): PromiseLike<Event>;
    /** Submits the event to Sentry */
    sendEvent(event: Event): void;
    /** Submits the session to Sentry */
    sendSession(session: Session): void;
    /**
     * Returns the transport that is used by the backend.
     * Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.
     *
     * @returns The transport.
     */
    getTransport(): Transport;
}
/**
 * A class object that can instantiate Backend objects.
 * @hidden
 */
export declare type BackendClass<B extends Backend, O extends Options> = new (options: O) => B;
/**
 * This is the base implemention of a Backend.
 * @hidden
 */
export declare abstract class BaseBackend<O extends Options> implements Backend {
    /** Options passed to the SDK. */
    protected readonly _options: O;
    /** Cached transport used internally. */
    protected _transport: Transport;
    /** Creates a new backend instance. */
    constructor(options: O);
    /**
     * @inheritDoc
     */
    eventFromException(_exception: any, _hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    eventFromMessage(_message: string, _level?: Severity, _hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    sendEvent(event: Event): void;
    /**
     * @inheritDoc
     */
    sendSession(session: Session): void;
    /**
     * @inheritDoc
     */
    getTransport(): Transport;
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    protected _setupTransport(): Transport;
}
//# sourceMappingURL=basebackend.d.ts.map{"version":3,"file":"basebackend.d.ts","sourceRoot":"","sources":["../src/basebackend.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,KAAK,EAAE,SAAS,EAAE,OAAO,EAAE,OAAO,EAAE,QAAQ,EAAE,SAAS,EAAE,MAAM,eAAe,CAAC;AAKxF;;;;;;;;;;;;;;;;;;;GAmBG;AACH,MAAM,WAAW,OAAO;IACtB,iDAAiD;IAEjD,kBAAkB,CAAC,SAAS,EAAE,GAAG,EAAE,IAAI,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC,CAAC;IAEzE,oDAAoD;IACpD,gBAAgB,CAAC,OAAO,EAAE,MAAM,EAAE,KAAK,CAAC,EAAE,QAAQ,EAAE,IAAI,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC,CAAC;IAE1F,kCAAkC;IAClC,SAAS,CAAC,KAAK,EAAE,KAAK,GAAG,IAAI,CAAC;IAE9B,oCAAoC;IACpC,WAAW,CAAC,OAAO,EAAE,OAAO,GAAG,IAAI,CAAC;IAEpC;;;;;OAKG;IACH,YAAY,IAAI,SAAS,CAAC;CAC3B;AAED;;;GAGG;AACH,oBAAY,YAAY,CAAC,CAAC,SAAS,OAAO,EAAE,CAAC,SAAS,OAAO,IAAI,KAAK,OAAO,EAAE,CAAC,KAAK,CAAC,CAAC;AAEvF;;;GAGG;AACH,8BAAsB,WAAW,CAAC,CAAC,SAAS,OAAO,CAAE,YAAW,OAAO;IACrE,iCAAiC;IACjC,SAAS,CAAC,QAAQ,CAAC,QAAQ,EAAE,CAAC,CAAC;IAE/B,wCAAwC;IACxC,SAAS,CAAC,UAAU,EAAE,SAAS,CAAC;IAEhC,sCAAsC;gBACnB,OAAO,EAAE,CAAC;IAQ7B;;OAEG;IAEI,kBAAkB,CAAC,UAAU,EAAE,GAAG,EAAE,KAAK,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC;IAIjF;;OAEG;IACI,gBAAgB,CAAC,QAAQ,EAAE,MAAM,EAAE,MAAM,CAAC,EAAE,QAAQ,EAAE,KAAK,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC;IAInG;;OAEG;IACI,SAAS,CAAC,KAAK,EAAE,KAAK,GAAG,IAAI;IAMpC;;OAEG;IACI,WAAW,CAAC,OAAO,EAAE,OAAO,GAAG,IAAI;IAW1C;;OAEG;IACI,YAAY,IAAI,SAAS;IAIhC;;OAEG;IACH,SAAS,CAAC,eAAe,IAAI,SAAS;CAGvC"}Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@sentry/utils");
var noop_1 = require("./transports/noop");
/**
 * This is the base implemention of a Backend.
 * @hidden
 */
var BaseBackend = /** @class */ (function () {
    /** Creates a new backend instance. */
    function BaseBackend(options) {
        this._options = options;
        if (!this._options.dsn) {
            utils_1.logger.warn('No DSN provided, backend will not do anything.');
        }
        this._transport = this._setupTransport();
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseBackend.prototype.eventFromException = function (_exception, _hint) {
        throw new utils_1.SentryError('Backend has to implement `eventFromException` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromMessage = function (_message, _level, _hint) {
        throw new utils_1.SentryError('Backend has to implement `eventFromMessage` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendEvent = function (event) {
        this._transport.sendEvent(event).then(null, function (reason) {
            utils_1.logger.error("Error while sending event: " + reason);
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendSession = function (session) {
        if (!this._transport.sendSession) {
            utils_1.logger.warn("Dropping session because custom transport doesn't implement sendSession");
            return;
        }
        this._transport.sendSession(session).then(null, function (reason) {
            utils_1.logger.error("Error while sending session: " + reason);
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.getTransport = function () {
        return this._transport;
    };
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    BaseBackend.prototype._setupTransport = function () {
        return new noop_1.NoopTransport();
    };
    return BaseBackend;
}());
exports.BaseBackend = BaseBackend;
//# sourceMappingURL=basebackend.js.map{"version":3,"file":"basebackend.js","sourceRoot":"","sources":["../src/basebackend.ts"],"names":[],"mappings":";AACA,uCAAoD;AAEpD,0CAAkD;AAmDlD;;;GAGG;AACH;IAOE,sCAAsC;IACtC,qBAAmB,OAAU;QAC3B,IAAI,CAAC,QAAQ,GAAG,OAAO,CAAC;QACxB,IAAI,CAAC,IAAI,CAAC,QAAQ,CAAC,GAAG,EAAE;YACtB,cAAM,CAAC,IAAI,CAAC,gDAAgD,CAAC,CAAC;SAC/D;QACD,IAAI,CAAC,UAAU,GAAG,IAAI,CAAC,eAAe,EAAE,CAAC;IAC3C,CAAC;IAED;;OAEG;IACH,iHAAiH;IAC1G,wCAAkB,GAAzB,UAA0B,UAAe,EAAE,KAAiB;QAC1D,MAAM,IAAI,mBAAW,CAAC,sDAAsD,CAAC,CAAC;IAChF,CAAC;IAED;;OAEG;IACI,sCAAgB,GAAvB,UAAwB,QAAgB,EAAE,MAAiB,EAAE,KAAiB;QAC5E,MAAM,IAAI,mBAAW,CAAC,oDAAoD,CAAC,CAAC;IAC9E,CAAC;IAED;;OAEG;IACI,+BAAS,GAAhB,UAAiB,KAAY;QAC3B,IAAI,CAAC,UAAU,CAAC,SAAS,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,IAAI,EAAE,UAAA,MAAM;YAChD,cAAM,CAAC,KAAK,CAAC,gCAA8B,MAAQ,CAAC,CAAC;QACvD,CAAC,CAAC,CAAC;IACL,CAAC;IAED;;OAEG;IACI,iCAAW,GAAlB,UAAmB,OAAgB;QACjC,IAAI,CAAC,IAAI,CAAC,UAAU,CAAC,WAAW,EAAE;YAChC,cAAM,CAAC,IAAI,CAAC,yEAAyE,CAAC,CAAC;YACvF,OAAO;SACR;QAED,IAAI,CAAC,UAAU,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,IAAI,EAAE,UAAA,MAAM;YACpD,cAAM,CAAC,KAAK,CAAC,kCAAgC,MAAQ,CAAC,CAAC;QACzD,CAAC,CAAC,CAAC;IACL,CAAC;IAED;;OAEG;IACI,kCAAY,GAAnB;QACE,OAAO,IAAI,CAAC,UAAU,CAAC;IACzB,CAAC;IAED;;OAEG;IACO,qCAAe,GAAzB;QACE,OAAO,IAAI,oBAAa,EAAE,CAAC;IAC7B,CAAC;IACH,kBAAC;AAAD,CAAC,AAnED,IAmEC;AAnEqB,kCAAW","sourcesContent":["import { Event, EventHint, Options, Session, Severity, Transport } from '@sentry/types';\nimport { logger, SentryError } from '@sentry/utils';\n\nimport { NoopTransport } from './transports/noop';\n\n/**\n * Internal platform-dependent Sentry SDK Backend.\n *\n * While {@link Client} contains business logic specific to an SDK, the\n * Backend offers platform specific implementations for low-level operations.\n * These are persisting and loading information, sending events, and hooking\n * into the environment.\n *\n * Backends receive a handle to the Client in their constructor. When a\n * Backend automatically generates events, it must pass them to\n * the Client for validation and processing first.\n *\n * Usually, the Client will be of corresponding type, e.g. NodeBackend\n * receives NodeClient. However, higher-level SDKs can choose to instantiate\n * multiple Backends and delegate tasks between them. In this case, an event\n * generated by one backend might very well be sent by another one.\n *\n * The client also provides access to options via {@link Client.getOptions}.\n * @hidden\n */\nexport interface Backend {\n  /** Creates a {@link Event} from an exception. */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  eventFromException(exception: any, hint?: EventHint): PromiseLike<Event>;\n\n  /** Creates a {@link Event} from a plain message. */\n  eventFromMessage(message: string, level?: Severity, hint?: EventHint): PromiseLike<Event>;\n\n  /** Submits the event to Sentry */\n  sendEvent(event: Event): void;\n\n  /** Submits the session to Sentry */\n  sendSession(session: Session): void;\n\n  /**\n   * Returns the transport that is used by the backend.\n   * Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.\n   *\n   * @returns The transport.\n   */\n  getTransport(): Transport;\n}\n\n/**\n * A class object that can instantiate Backend objects.\n * @hidden\n */\nexport type BackendClass<B extends Backend, O extends Options> = new (options: O) => B;\n\n/**\n * This is the base implemention of a Backend.\n * @hidden\n */\nexport abstract class BaseBackend<O extends Options> implements Backend {\n  /** Options passed to the SDK. */\n  protected readonly _options: O;\n\n  /** Cached transport used internally. */\n  protected _transport: Transport;\n\n  /** Creates a new backend instance. */\n  public constructor(options: O) {\n    this._options = options;\n    if (!this._options.dsn) {\n      logger.warn('No DSN provided, backend will not do anything.');\n    }\n    this._transport = this._setupTransport();\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  public eventFromException(_exception: any, _hint?: EventHint): PromiseLike<Event> {\n    throw new SentryError('Backend has to implement `eventFromException` method');\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public eventFromMessage(_message: string, _level?: Severity, _hint?: EventHint): PromiseLike<Event> {\n    throw new SentryError('Backend has to implement `eventFromMessage` method');\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public sendEvent(event: Event): void {\n    this._transport.sendEvent(event).then(null, reason => {\n      logger.error(`Error while sending event: ${reason}`);\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public sendSession(session: Session): void {\n    if (!this._transport.sendSession) {\n      logger.warn(\"Dropping session because custom transport doesn't implement sendSession\");\n      return;\n    }\n\n    this._transport.sendSession(session).then(null, reason => {\n      logger.error(`Error while sending session: ${reason}`);\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getTransport(): Transport {\n    return this._transport;\n  }\n\n  /**\n   * Sets up the transport so it can be used later to send requests.\n   */\n  protected _setupTransport(): Transport {\n    return new NoopTransport();\n  }\n}\n"]}import { Scope, Session } from '@sentry/hub';
import { Client, Event, EventHint, Integration, IntegrationClass, Options, Severity } from '@sentry/types';
import { Dsn } from '@sentry/utils';
import { Backend, BackendClass } from './basebackend';
import { IntegrationIndex } from './integration';
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding backend constructor and options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}. Also, the Backend instance is available via
 * {@link Client.getBackend}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event via the backend, it is passed through
 * {@link BaseClient.prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(NodeBackend, options);
 *   }
 *
 *   // ...
 * }
 */
export declare abstract class BaseClient<B extends Backend, O extends Options> implements Client<O> {
    /**
     * The backend used to physically interact in the environment. Usually, this
     * will correspond to the client. When composing SDKs, however, the Backend
     * from the root SDK will be used.
     */
    protected readonly _backend: B;
    /** Options passed to the SDK. */
    protected readonly _options: O;
    /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
    protected readonly _dsn?: Dsn;
    /** Array of used integrations. */
    protected _integrations: IntegrationIndex;
    /** Number of call being processed */
    protected _processing: number;
    /**
     * Initializes this client instance.
     *
     * @param backendClass A constructor function to create the backend.
     * @param options Options for the client.
     */
    protected constructor(backendClass: BackendClass<B, O>, options: O);
    /**
     * @inheritDoc
     */
    captureException(exception: any, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureMessage(message: string, level?: Severity, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureSession(session: Session): void;
    /**
     * @inheritDoc
     */
    getDsn(): Dsn | undefined;
    /**
     * @inheritDoc
     */
    getOptions(): O;
    /**
     * @inheritDoc
     */
    flush(timeout?: number): PromiseLike<boolean>;
    /**
     * @inheritDoc
     */
    close(timeout?: number): PromiseLike<boolean>;
    /**
     * Sets up the integrations
     */
    setupIntegrations(): void;
    /**
     * @inheritDoc
     */
    getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null;
    /** Updates existing session based on the provided event */
    protected _updateSessionFromEvent(session: Session, event: Event): void;
    /** Deliver captured session to Sentry */
    protected _sendSession(session: Session): void;
    /** Waits for the client to be done with processing. */
    protected _isClientProcessing(timeout?: number): PromiseLike<boolean>;
    /** Returns the current backend. */
    protected _getBackend(): B;
    /** Determines whether this SDK is enabled and a valid Dsn is present. */
    protected _isEnabled(): boolean;
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * @param event The original event.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): PromiseLike<Event | null>;
    /**
     * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
     * Normalized keys:
     * - `breadcrumbs.data`
     * - `user`
     * - `contexts`
     * - `extra`
     * @param event Event
     * @returns Normalized event
     */
    protected _normalizeEvent(event: Event | null, depth: number): Event | null;
    /**
     *  Enhances event using the client configuration.
     *  It takes care of all "static" values like environment, release and `dist`,
     *  as well as truncating overly long values.
     * @param event event instance to be enhanced
     */
    protected _applyClientOptions(event: Event): void;
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.
     */
    protected _applyIntegrationsMetadata(event: Event): void;
    /**
     * Tells the backend to send this event
     * @param event The Sentry event to send
     */
    protected _sendEvent(event: Event): void;
    /**
     * Processes the event and logs an error in case of rejection
     * @param event
     * @param hint
     * @param scope
     */
    protected _captureEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<string | undefined>;
    /**
     * Processes an event (either error or message) and sends it to Sentry.
     *
     * This also adds breadcrumbs and context information to the event. However,
     * platform specific meta data (such as the User's IP address) must be added
     * by the SDK implementor.
     *
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    protected _processEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<Event>;
    /**
     * Occupies the client with processing and event
     */
    protected _process<T>(promise: PromiseLike<T>): void;
}
//# sourceMappingURL=baseclient.d.ts.map{"version":3,"file":"baseclient.d.ts","sourceRoot":"","sources":["../src/baseclient.ts"],"names":[],"mappings":"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"}Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable max-lines */
var hub_1 = require("@sentry/hub");
var types_1 = require("@sentry/types");
var utils_1 = require("@sentry/utils");
var integration_1 = require("./integration");
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding backend constructor and options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}. Also, the Backend instance is available via
 * {@link Client.getBackend}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event via the backend, it is passed through
 * {@link BaseClient.prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(NodeBackend, options);
 *   }
 *
 *   // ...
 * }
 */
var BaseClient = /** @class */ (function () {
    /**
     * Initializes this client instance.
     *
     * @param backendClass A constructor function to create the backend.
     * @param options Options for the client.
     */
    function BaseClient(backendClass, options) {
        /** Array of used integrations. */
        this._integrations = {};
        /** Number of call being processed */
        this._processing = 0;
        this._backend = new backendClass(options);
        this._options = options;
        if (options.dsn) {
            this._dsn = new utils_1.Dsn(options.dsn);
        }
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseClient.prototype.captureException = function (exception, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        this._process(this._getBackend()
            .eventFromException(exception, hint)
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureMessage = function (message, level, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        var promisedEvent = utils_1.isPrimitive(message)
            ? this._getBackend().eventFromMessage(String(message), level, hint)
            : this._getBackend().eventFromException(message, hint);
        this._process(promisedEvent
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureEvent = function (event, hint, scope) {
        var eventId = hint && hint.event_id;
        this._process(this._captureEvent(event, hint, scope).then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureSession = function (session) {
        if (!session.release) {
            utils_1.logger.warn('Discarded session because of missing release');
        }
        else {
            this._sendSession(session);
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getDsn = function () {
        return this._dsn;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getOptions = function () {
        return this._options;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.flush = function (timeout) {
        var _this = this;
        return this._isClientProcessing(timeout).then(function (ready) {
            return _this._getBackend()
                .getTransport()
                .close(timeout)
                .then(function (transportFlushed) { return ready && transportFlushed; });
        });
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.close = function (timeout) {
        var _this = this;
        return this.flush(timeout).then(function (result) {
            _this.getOptions().enabled = false;
            return result;
        });
    };
    /**
     * Sets up the integrations
     */
    BaseClient.prototype.setupIntegrations = function () {
        if (this._isEnabled()) {
            this._integrations = integration_1.setupIntegrations(this._options);
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getIntegration = function (integration) {
        try {
            return this._integrations[integration.id] || null;
        }
        catch (_oO) {
            utils_1.logger.warn("Cannot retrieve integration " + integration.id + " from the current Client");
            return null;
        }
    };
    /** Updates existing session based on the provided event */
    BaseClient.prototype._updateSessionFromEvent = function (session, event) {
        var e_1, _a;
        var crashed = false;
        var errored = false;
        var userAgent;
        var exceptions = event.exception && event.exception.values;
        if (exceptions) {
            errored = true;
            try {
                for (var exceptions_1 = tslib_1.__values(exceptions), exceptions_1_1 = exceptions_1.next(); !exceptions_1_1.done; exceptions_1_1 = exceptions_1.next()) {
                    var ex = exceptions_1_1.value;
                    var mechanism = ex.mechanism;
                    if (mechanism && mechanism.handled === false) {
                        crashed = true;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (exceptions_1_1 && !exceptions_1_1.done && (_a = exceptions_1.return)) _a.call(exceptions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        var user = event.user;
        if (!session.userAgent) {
            var headers = event.request ? event.request.headers : {};
            for (var key in headers) {
                if (key.toLowerCase() === 'user-agent') {
                    userAgent = headers[key];
                    break;
                }
            }
        }
        session.update(tslib_1.__assign(tslib_1.__assign({}, (crashed && { status: types_1.SessionStatus.Crashed })), { user: user,
            userAgent: userAgent, errors: session.errors + Number(errored || crashed) }));
    };
    /** Deliver captured session to Sentry */
    BaseClient.prototype._sendSession = function (session) {
        this._getBackend().sendSession(session);
    };
    /** Waits for the client to be done with processing. */
    BaseClient.prototype._isClientProcessing = function (timeout) {
        var _this = this;
        return new utils_1.SyncPromise(function (resolve) {
            var ticked = 0;
            var tick = 1;
            var interval = setInterval(function () {
                if (_this._processing == 0) {
                    clearInterval(interval);
                    resolve(true);
                }
                else {
                    ticked += tick;
                    if (timeout && ticked >= timeout) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }
            }, tick);
        });
    };
    /** Returns the current backend. */
    BaseClient.prototype._getBackend = function () {
        return this._backend;
    };
    /** Determines whether this SDK is enabled and a valid Dsn is present. */
    BaseClient.prototype._isEnabled = function () {
        return this.getOptions().enabled !== false && this._dsn !== undefined;
    };
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * @param event The original event.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    BaseClient.prototype._prepareEvent = function (event, scope, hint) {
        var _this = this;
        var _a = this.getOptions().normalizeDepth, normalizeDepth = _a === void 0 ? 3 : _a;
        var prepared = tslib_1.__assign(tslib_1.__assign({}, event), { event_id: event.event_id || (hint && hint.event_id ? hint.event_id : utils_1.uuid4()), timestamp: event.timestamp || utils_1.dateTimestampInSeconds() });
        this._applyClientOptions(prepared);
        this._applyIntegrationsMetadata(prepared);
        // If we have scope given to us, use it as the base for further modifications.
        // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
        var finalScope = scope;
        if (hint && hint.captureContext) {
            finalScope = hub_1.Scope.clone(finalScope).update(hint.captureContext);
        }
        // We prepare the result here with a resolved Event.
        var result = utils_1.SyncPromise.resolve(prepared);
        // This should be the last thing called, since we want that
        // {@link Hub.addEventProcessor} gets the finished prepared event.
        if (finalScope) {
            // In case we have a hub we reassign it.
            result = finalScope.applyToEvent(prepared, hint);
        }
        return result.then(function (evt) {
            if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
                return _this._normalizeEvent(evt, normalizeDepth);
            }
            return evt;
        });
    };
    /**
     * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
     * Normalized keys:
     * - `breadcrumbs.data`
     * - `user`
     * - `contexts`
     * - `extra`
     * @param event Event
     * @returns Normalized event
     */
    BaseClient.prototype._normalizeEvent = function (event, depth) {
        if (!event) {
            return null;
        }
        var normalized = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, event), (event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map(function (b) { return (tslib_1.__assign(tslib_1.__assign({}, b), (b.data && {
                data: utils_1.normalize(b.data, depth),
            }))); }),
        })), (event.user && {
            user: utils_1.normalize(event.user, depth),
        })), (event.contexts && {
            contexts: utils_1.normalize(event.contexts, depth),
        })), (event.extra && {
            extra: utils_1.normalize(event.extra, depth),
        }));
        // event.contexts.trace stores information about a Transaction. Similarly,
        // event.spans[] stores information about child Spans. Given that a
        // Transaction is conceptually a Span, normalization should apply to both
        // Transactions and Spans consistently.
        // For now the decision is to skip normalization of Transactions and Spans,
        // so this block overwrites the normalized event to add back the original
        // Transaction information prior to normalization.
        if (event.contexts && event.contexts.trace) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            normalized.contexts.trace = event.contexts.trace;
        }
        return normalized;
    };
    /**
     *  Enhances event using the client configuration.
     *  It takes care of all "static" values like environment, release and `dist`,
     *  as well as truncating overly long values.
     * @param event event instance to be enhanced
     */
    BaseClient.prototype._applyClientOptions = function (event) {
        var options = this.getOptions();
        var environment = options.environment, release = options.release, dist = options.dist, _a = options.maxValueLength, maxValueLength = _a === void 0 ? 250 : _a;
        if (!('environment' in event)) {
            event.environment = 'environment' in options ? environment : 'production';
        }
        if (event.release === undefined && release !== undefined) {
            event.release = release;
        }
        if (event.dist === undefined && dist !== undefined) {
            event.dist = dist;
        }
        if (event.message) {
            event.message = utils_1.truncate(event.message, maxValueLength);
        }
        var exception = event.exception && event.exception.values && event.exception.values[0];
        if (exception && exception.value) {
            exception.value = utils_1.truncate(exception.value, maxValueLength);
        }
        var request = event.request;
        if (request && request.url) {
            request.url = utils_1.truncate(request.url, maxValueLength);
        }
    };
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.
     */
    BaseClient.prototype._applyIntegrationsMetadata = function (event) {
        var sdkInfo = event.sdk;
        var integrationsArray = Object.keys(this._integrations);
        if (sdkInfo && integrationsArray.length > 0) {
            sdkInfo.integrations = integrationsArray;
        }
    };
    /**
     * Tells the backend to send this event
     * @param event The Sentry event to send
     */
    BaseClient.prototype._sendEvent = function (event) {
        this._getBackend().sendEvent(event);
    };
    /**
     * Processes the event and logs an error in case of rejection
     * @param event
     * @param hint
     * @param scope
     */
    BaseClient.prototype._captureEvent = function (event, hint, scope) {
        return this._processEvent(event, hint, scope).then(function (finalEvent) {
            return finalEvent.event_id;
        }, function (reason) {
            utils_1.logger.error(reason);
            return undefined;
        });
    };
    /**
     * Processes an event (either error or message) and sends it to Sentry.
     *
     * This also adds breadcrumbs and context information to the event. However,
     * platform specific meta data (such as the User's IP address) must be added
     * by the SDK implementor.
     *
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    BaseClient.prototype._processEvent = function (event, hint, scope) {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _a = this.getOptions(), beforeSend = _a.beforeSend, sampleRate = _a.sampleRate;
        if (!this._isEnabled()) {
            return utils_1.SyncPromise.reject(new utils_1.SentryError('SDK not enabled, will not send event.'));
        }
        var isTransaction = event.type === 'transaction';
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {
            return utils_1.SyncPromise.reject(new utils_1.SentryError("Discarding event because it's not included in the random sample (sampling rate = " + sampleRate + ")"));
        }
        return this._prepareEvent(event, scope, hint)
            .then(function (prepared) {
            if (prepared === null) {
                throw new utils_1.SentryError('An event processor returned null, will not send event.');
            }
            var isInternalException = hint && hint.data && hint.data.__sentry__ === true;
            if (isInternalException || isTransaction || !beforeSend) {
                return prepared;
            }
            var beforeSendResult = beforeSend(prepared, hint);
            if (typeof beforeSendResult === 'undefined') {
                throw new utils_1.SentryError('`beforeSend` method has to return `null` or a valid event.');
            }
            else if (utils_1.isThenable(beforeSendResult)) {
                return beforeSendResult.then(function (event) { return event; }, function (e) {
                    throw new utils_1.SentryError("beforeSend rejected with " + e);
                });
            }
            return beforeSendResult;
        })
            .then(function (processedEvent) {
            if (processedEvent === null) {
                throw new utils_1.SentryError('`beforeSend` returned `null`, will not send event.');
            }
            var session = scope && scope.getSession && scope.getSession();
            if (!isTransaction && session) {
                _this._updateSessionFromEvent(session, processedEvent);
            }
            _this._sendEvent(processedEvent);
            return processedEvent;
        })
            .then(null, function (reason) {
            if (reason instanceof utils_1.SentryError) {
                throw reason;
            }
            _this.captureException(reason, {
                data: {
                    __sentry__: true,
                },
                originalException: reason,
            });
            throw new utils_1.SentryError("Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: " + reason);
        });
    };
    /**
     * Occupies the client with processing and event
     */
    BaseClient.prototype._process = function (promise) {
        var _this = this;
        this._processing += 1;
        promise.then(function (value) {
            _this._processing -= 1;
            return value;
        }, function (reason) {
            _this._processing -= 1;
            return reason;
        });
    };
    return BaseClient;
}());
exports.BaseClient = BaseClient;
//# sourceMappingURL=baseclient.js.map{"version":3,"file":"baseclient.js","sourceRoot":"","sources":["../src/baseclient.ts"],"names":[],"mappings":"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","sourcesContent":["/* eslint-disable max-lines */\nimport { Scope, Session } from '@sentry/hub';\nimport {\n  Client,\n  Event,\n  EventHint,\n  Integration,\n  IntegrationClass,\n  Options,\n  SessionStatus,\n  Severity,\n} from '@sentry/types';\nimport {\n  dateTimestampInSeconds,\n  Dsn,\n  isPrimitive,\n  isThenable,\n  logger,\n  normalize,\n  SentryError,\n  SyncPromise,\n  truncate,\n  uuid4,\n} from '@sentry/utils';\n\nimport { Backend, BackendClass } from './basebackend';\nimport { IntegrationIndex, setupIntegrations } from './integration';\n\n/**\n * Base implementation for all JavaScript SDK clients.\n *\n * Call the constructor with the corresponding backend constructor and options\n * specific to the client subclass. To access these options later, use\n * {@link Client.getOptions}. Also, the Backend instance is available via\n * {@link Client.getBackend}.\n *\n * If a Dsn is specified in the options, it will be parsed and stored. Use\n * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is\n * invalid, the constructor will throw a {@link SentryException}. Note that\n * without a valid Dsn, the SDK will not send any events to Sentry.\n *\n * Before sending an event via the backend, it is passed through\n * {@link BaseClient.prepareEvent} to add SDK information and scope data\n * (breadcrumbs and context). To add more custom information, override this\n * method and extend the resulting prepared event.\n *\n * To issue automatically created events (e.g. via instrumentation), use\n * {@link Client.captureEvent}. It will prepare the event and pass it through\n * the callback lifecycle. To issue auto-breadcrumbs, use\n * {@link Client.addBreadcrumb}.\n *\n * @example\n * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {\n *   public constructor(options: NodeOptions) {\n *     super(NodeBackend, options);\n *   }\n *\n *   // ...\n * }\n */\nexport abstract class BaseClient<B extends Backend, O extends Options> implements Client<O> {\n  /**\n   * The backend used to physically interact in the environment. Usually, this\n   * will correspond to the client. When composing SDKs, however, the Backend\n   * from the root SDK will be used.\n   */\n  protected readonly _backend: B;\n\n  /** Options passed to the SDK. */\n  protected readonly _options: O;\n\n  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */\n  protected readonly _dsn?: Dsn;\n\n  /** Array of used integrations. */\n  protected _integrations: IntegrationIndex = {};\n\n  /** Number of call being processed */\n  protected _processing: number = 0;\n\n  /**\n   * Initializes this client instance.\n   *\n   * @param backendClass A constructor function to create the backend.\n   * @param options Options for the client.\n   */\n  protected constructor(backendClass: BackendClass<B, O>, options: O) {\n    this._backend = new backendClass(options);\n    this._options = options;\n\n    if (options.dsn) {\n      this._dsn = new Dsn(options.dsn);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  public captureException(exception: any, hint?: EventHint, scope?: Scope): string | undefined {\n    let eventId: string | undefined = hint && hint.event_id;\n\n    this._process(\n      this._getBackend()\n        .eventFromException(exception, hint)\n        .then(event => this._captureEvent(event, hint, scope))\n        .then(result => {\n          eventId = result;\n        }),\n    );\n\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureMessage(message: string, level?: Severity, hint?: EventHint, scope?: Scope): string | undefined {\n    let eventId: string | undefined = hint && hint.event_id;\n\n    const promisedEvent = isPrimitive(message)\n      ? this._getBackend().eventFromMessage(String(message), level, hint)\n      : this._getBackend().eventFromException(message, hint);\n\n    this._process(\n      promisedEvent\n        .then(event => this._captureEvent(event, hint, scope))\n        .then(result => {\n          eventId = result;\n        }),\n    );\n\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureEvent(event: Event, hint?: EventHint, scope?: Scope): string | undefined {\n    let eventId: string | undefined = hint && hint.event_id;\n\n    this._process(\n      this._captureEvent(event, hint, scope).then(result => {\n        eventId = result;\n      }),\n    );\n\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureSession(session: Session): void {\n    if (!session.release) {\n      logger.warn('Discarded session because of missing release');\n    } else {\n      this._sendSession(session);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getDsn(): Dsn | undefined {\n    return this._dsn;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getOptions(): O {\n    return this._options;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public flush(timeout?: number): PromiseLike<boolean> {\n    return this._isClientProcessing(timeout).then(ready => {\n      return this._getBackend()\n        .getTransport()\n        .close(timeout)\n        .then(transportFlushed => ready && transportFlushed);\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public close(timeout?: number): PromiseLike<boolean> {\n    return this.flush(timeout).then(result => {\n      this.getOptions().enabled = false;\n      return result;\n    });\n  }\n\n  /**\n   * Sets up the integrations\n   */\n  public setupIntegrations(): void {\n    if (this._isEnabled()) {\n      this._integrations = setupIntegrations(this._options);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null {\n    try {\n      return (this._integrations[integration.id] as T) || null;\n    } catch (_oO) {\n      logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);\n      return null;\n    }\n  }\n\n  /** Updates existing session based on the provided event */\n  protected _updateSessionFromEvent(session: Session, event: Event): void {\n    let crashed = false;\n    let errored = false;\n    let userAgent;\n    const exceptions = event.exception && event.exception.values;\n\n    if (exceptions) {\n      errored = true;\n\n      for (const ex of exceptions) {\n        const mechanism = ex.mechanism;\n        if (mechanism && mechanism.handled === false) {\n          crashed = true;\n          break;\n        }\n      }\n    }\n\n    const user = event.user;\n    if (!session.userAgent) {\n      const headers = event.request ? event.request.headers : {};\n      for (const key in headers) {\n        if (key.toLowerCase() === 'user-agent') {\n          userAgent = headers[key];\n          break;\n        }\n      }\n    }\n\n    session.update({\n      ...(crashed && { status: SessionStatus.Crashed }),\n      user,\n      userAgent,\n      errors: session.errors + Number(errored || crashed),\n    });\n  }\n\n  /** Deliver captured session to Sentry */\n  protected _sendSession(session: Session): void {\n    this._getBackend().sendSession(session);\n  }\n\n  /** Waits for the client to be done with processing. */\n  protected _isClientProcessing(timeout?: number): PromiseLike<boolean> {\n    return new SyncPromise(resolve => {\n      let ticked: number = 0;\n      const tick: number = 1;\n\n      const interval = setInterval(() => {\n        if (this._processing == 0) {\n          clearInterval(interval);\n          resolve(true);\n        } else {\n          ticked += tick;\n          if (timeout && ticked >= timeout) {\n            clearInterval(interval);\n            resolve(false);\n          }\n        }\n      }, tick);\n    });\n  }\n\n  /** Returns the current backend. */\n  protected _getBackend(): B {\n    return this._backend;\n  }\n\n  /** Determines whether this SDK is enabled and a valid Dsn is present. */\n  protected _isEnabled(): boolean {\n    return this.getOptions().enabled !== false && this._dsn !== undefined;\n  }\n\n  /**\n   * Adds common information to events.\n   *\n   * The information includes release and environment from `options`,\n   * breadcrumbs and context (extra, tags and user) from the scope.\n   *\n   * Information that is already present in the event is never overwritten. For\n   * nested objects, such as the context, keys are merged.\n   *\n   * @param event The original event.\n   * @param hint May contain additional information about the original exception.\n   * @param scope A scope containing event metadata.\n   * @returns A new event with more information.\n   */\n  protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): PromiseLike<Event | null> {\n    const { normalizeDepth = 3 } = this.getOptions();\n    const prepared: Event = {\n      ...event,\n      event_id: event.event_id || (hint && hint.event_id ? hint.event_id : uuid4()),\n      timestamp: event.timestamp || dateTimestampInSeconds(),\n    };\n\n    this._applyClientOptions(prepared);\n    this._applyIntegrationsMetadata(prepared);\n\n    // If we have scope given to us, use it as the base for further modifications.\n    // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.\n    let finalScope = scope;\n    if (hint && hint.captureContext) {\n      finalScope = Scope.clone(finalScope).update(hint.captureContext);\n    }\n\n    // We prepare the result here with a resolved Event.\n    let result = SyncPromise.resolve<Event | null>(prepared);\n\n    // This should be the last thing called, since we want that\n    // {@link Hub.addEventProcessor} gets the finished prepared event.\n    if (finalScope) {\n      // In case we have a hub we reassign it.\n      result = finalScope.applyToEvent(prepared, hint);\n    }\n\n    return result.then(evt => {\n      if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {\n        return this._normalizeEvent(evt, normalizeDepth);\n      }\n      return evt;\n    });\n  }\n\n  /**\n   * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.\n   * Normalized keys:\n   * - `breadcrumbs.data`\n   * - `user`\n   * - `contexts`\n   * - `extra`\n   * @param event Event\n   * @returns Normalized event\n   */\n  protected _normalizeEvent(event: Event | null, depth: number): Event | null {\n    if (!event) {\n      return null;\n    }\n\n    const normalized = {\n      ...event,\n      ...(event.breadcrumbs && {\n        breadcrumbs: event.breadcrumbs.map(b => ({\n          ...b,\n          ...(b.data && {\n            data: normalize(b.data, depth),\n          }),\n        })),\n      }),\n      ...(event.user && {\n        user: normalize(event.user, depth),\n      }),\n      ...(event.contexts && {\n        contexts: normalize(event.contexts, depth),\n      }),\n      ...(event.extra && {\n        extra: normalize(event.extra, depth),\n      }),\n    };\n    // event.contexts.trace stores information about a Transaction. Similarly,\n    // event.spans[] stores information about child Spans. Given that a\n    // Transaction is conceptually a Span, normalization should apply to both\n    // Transactions and Spans consistently.\n    // For now the decision is to skip normalization of Transactions and Spans,\n    // so this block overwrites the normalized event to add back the original\n    // Transaction information prior to normalization.\n    if (event.contexts && event.contexts.trace) {\n      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access\n      normalized.contexts.trace = event.contexts.trace;\n    }\n    return normalized;\n  }\n\n  /**\n   *  Enhances event using the client configuration.\n   *  It takes care of all \"static\" values like environment, release and `dist`,\n   *  as well as truncating overly long values.\n   * @param event event instance to be enhanced\n   */\n  protected _applyClientOptions(event: Event): void {\n    const options = this.getOptions();\n    const { environment, release, dist, maxValueLength = 250 } = options;\n\n    if (!('environment' in event)) {\n      event.environment = 'environment' in options ? environment : 'production';\n    }\n\n    if (event.release === undefined && release !== undefined) {\n      event.release = release;\n    }\n\n    if (event.dist === undefined && dist !== undefined) {\n      event.dist = dist;\n    }\n\n    if (event.message) {\n      event.message = truncate(event.message, maxValueLength);\n    }\n\n    const exception = event.exception && event.exception.values && event.exception.values[0];\n    if (exception && exception.value) {\n      exception.value = truncate(exception.value, maxValueLength);\n    }\n\n    const request = event.request;\n    if (request && request.url) {\n      request.url = truncate(request.url, maxValueLength);\n    }\n  }\n\n  /**\n   * This function adds all used integrations to the SDK info in the event.\n   * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.\n   */\n  protected _applyIntegrationsMetadata(event: Event): void {\n    const sdkInfo = event.sdk;\n    const integrationsArray = Object.keys(this._integrations);\n    if (sdkInfo && integrationsArray.length > 0) {\n      sdkInfo.integrations = integrationsArray;\n    }\n  }\n\n  /**\n   * Tells the backend to send this event\n   * @param event The Sentry event to send\n   */\n  protected _sendEvent(event: Event): void {\n    this._getBackend().sendEvent(event);\n  }\n\n  /**\n   * Processes the event and logs an error in case of rejection\n   * @param event\n   * @param hint\n   * @param scope\n   */\n  protected _captureEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<string | undefined> {\n    return this._processEvent(event, hint, scope).then(\n      finalEvent => {\n        return finalEvent.event_id;\n      },\n      reason => {\n        logger.error(reason);\n        return undefined;\n      },\n    );\n  }\n\n  /**\n   * Processes an event (either error or message) and sends it to Sentry.\n   *\n   * This also adds breadcrumbs and context information to the event. However,\n   * platform specific meta data (such as the User's IP address) must be added\n   * by the SDK implementor.\n   *\n   *\n   * @param event The event to send to Sentry.\n   * @param hint May contain additional information about the original exception.\n   * @param scope A scope containing event metadata.\n   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.\n   */\n  protected _processEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<Event> {\n    // eslint-disable-next-line @typescript-eslint/unbound-method\n    const { beforeSend, sampleRate } = this.getOptions();\n\n    if (!this._isEnabled()) {\n      return SyncPromise.reject(new SentryError('SDK not enabled, will not send event.'));\n    }\n\n    const isTransaction = event.type === 'transaction';\n    // 1.0 === 100% events are sent\n    // 0.0 === 0% events are sent\n    // Sampling for transaction happens somewhere else\n    if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {\n      return SyncPromise.reject(\n        new SentryError(\n          `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,\n        ),\n      );\n    }\n\n    return this._prepareEvent(event, scope, hint)\n      .then(prepared => {\n        if (prepared === null) {\n          throw new SentryError('An event processor returned null, will not send event.');\n        }\n\n        const isInternalException = hint && hint.data && (hint.data as { __sentry__: boolean }).__sentry__ === true;\n        if (isInternalException || isTransaction || !beforeSend) {\n          return prepared;\n        }\n\n        const beforeSendResult = beforeSend(prepared, hint);\n        if (typeof beforeSendResult === 'undefined') {\n          throw new SentryError('`beforeSend` method has to return `null` or a valid event.');\n        } else if (isThenable(beforeSendResult)) {\n          return (beforeSendResult as PromiseLike<Event | null>).then(\n            event => event,\n            e => {\n              throw new SentryError(`beforeSend rejected with ${e}`);\n            },\n          );\n        }\n        return beforeSendResult;\n      })\n      .then(processedEvent => {\n        if (processedEvent === null) {\n          throw new SentryError('`beforeSend` returned `null`, will not send event.');\n        }\n\n        const session = scope && scope.getSession && scope.getSession();\n        if (!isTransaction && session) {\n          this._updateSessionFromEvent(session, processedEvent);\n        }\n\n        this._sendEvent(processedEvent);\n        return processedEvent;\n      })\n      .then(null, reason => {\n        if (reason instanceof SentryError) {\n          throw reason;\n        }\n\n        this.captureException(reason, {\n          data: {\n            __sentry__: true,\n          },\n          originalException: reason as Error,\n        });\n        throw new SentryError(\n          `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\\nReason: ${reason}`,\n        );\n      });\n  }\n\n  /**\n   * Occupies the client with processing and event\n   */\n  protected _process<T>(promise: PromiseLike<T>): void {\n    this._processing += 1;\n    promise.then(\n      value => {\n        this._processing -= 1;\n        return value;\n      },\n      reason => {\n        this._processing -= 1;\n        return reason;\n      },\n    );\n  }\n}\n"]}export { addBreadcrumb, captureException, captureEvent, captureMessage, configureScope, startTransaction, setContext, setExtra, setExtras, setTag, setTags, setUser, withScope, } from '@sentry/minimal';
export { addGlobalEventProcessor, getCurrentHub, getHubFromCarrier, Hub, makeMain, Scope } from '@sentry/hub';
export { API } from './api';
export { BaseClient } from './baseclient';
export { BackendClass, BaseBackend } from './basebackend';
export { eventToSentryRequest, sessionToSentryRequest } from './request';
export { initAndBind, ClientClass } from './sdk';
export { NoopTransport } from './transports/noop';
export { SDK_VERSION } from './version';
import * as Integrations from './integrations';
export { Integrations };
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AAAA,OAAO,EACL,aAAa,EACb,gBAAgB,EAChB,YAAY,EACZ,cAAc,EACd,cAAc,EACd,gBAAgB,EAChB,UAAU,EACV,QAAQ,EACR,SAAS,EACT,MAAM,EACN,OAAO,EACP,OAAO,EACP,SAAS,GACV,MAAM,iBAAiB,CAAC;AACzB,OAAO,EAAE,uBAAuB,EAAE,aAAa,EAAE,iBAAiB,EAAE,GAAG,EAAE,QAAQ,EAAE,KAAK,EAAE,MAAM,aAAa,CAAC;AAC9G,OAAO,EAAE,GAAG,EAAE,MAAM,OAAO,CAAC;AAC5B,OAAO,EAAE,UAAU,EAAE,MAAM,cAAc,CAAC;AAC1C,OAAO,EAAE,YAAY,EAAE,WAAW,EAAE,MAAM,eAAe,CAAC;AAC1D,OAAO,EAAE,oBAAoB,EAAE,sBAAsB,EAAE,MAAM,WAAW,CAAC;AACzE,OAAO,EAAE,WAAW,EAAE,WAAW,EAAE,MAAM,OAAO,CAAC;AACjD,OAAO,EAAE,aAAa,EAAE,MAAM,mBAAmB,CAAC;AAClD,OAAO,EAAE,WAAW,EAAE,MAAM,WAAW,CAAC;AAExC,OAAO,KAAK,YAAY,MAAM,gBAAgB,CAAC;AAE/C,OAAO,EAAE,YAAY,EAAE,CAAC"}Object.defineProperty(exports, "__esModule", { value: true });
var minimal_1 = require("@sentry/minimal");
exports.addBreadcrumb = minimal_1.addBreadcrumb;
exports.captureException = minimal_1.captureException;
exports.captureEvent = minimal_1.captureEvent;
exports.captureMessage = minimal_1.captureMessage;
exports.configureScope = minimal_1.configureScope;
exports.startTransaction = minimal_1.startTransaction;
exports.setContext = minimal_1.setContext;
exports.setExtra = minimal_1.setExtra;
exports.setExtras = minimal_1.setExtras;
exports.setTag = minimal_1.setTag;
exports.setTags = minimal_1.setTags;
exports.setUser = minimal_1.setUser;
exports.withScope = minimal_1.withScope;
var hub_1 = require("@sentry/hub");
exports.addGlobalEventProcessor = hub_1.addGlobalEventProcessor;
exports.getCurrentHub = hub_1.getCurrentHub;
exports.getHubFromCarrier = hub_1.getHubFromCarrier;
exports.Hub = hub_1.Hub;
exports.makeMain = hub_1.makeMain;
exports.Scope = hub_1.Scope;
var api_1 = require("./api");
exports.API = api_1.API;
var baseclient_1 = require("./baseclient");
exports.BaseClient = baseclient_1.BaseClient;
var basebackend_1 = require("./basebackend");
exports.BaseBackend = basebackend_1.BaseBackend;
var request_1 = require("./request");
exports.eventToSentryRequest = request_1.eventToSentryRequest;
exports.sessionToSentryRequest = request_1.sessionToSentryRequest;
var sdk_1 = require("./sdk");
exports.initAndBind = sdk_1.initAndBind;
var noop_1 = require("./transports/noop");
exports.NoopTransport = noop_1.NoopTransport;
var version_1 = require("./version");
exports.SDK_VERSION = version_1.SDK_VERSION;
var Integrations = require("./integrations");
exports.Integrations = Integrations;
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":";AAAA,2CAcyB;AAbvB,kCAAA,aAAa,CAAA;AACb,qCAAA,gBAAgB,CAAA;AAChB,iCAAA,YAAY,CAAA;AACZ,mCAAA,cAAc,CAAA;AACd,mCAAA,cAAc,CAAA;AACd,qCAAA,gBAAgB,CAAA;AAChB,+BAAA,UAAU,CAAA;AACV,6BAAA,QAAQ,CAAA;AACR,8BAAA,SAAS,CAAA;AACT,2BAAA,MAAM,CAAA;AACN,4BAAA,OAAO,CAAA;AACP,4BAAA,OAAO,CAAA;AACP,8BAAA,SAAS,CAAA;AAEX,mCAA8G;AAArG,wCAAA,uBAAuB,CAAA;AAAE,8BAAA,aAAa,CAAA;AAAE,kCAAA,iBAAiB,CAAA;AAAE,oBAAA,GAAG,CAAA;AAAE,yBAAA,QAAQ,CAAA;AAAE,sBAAA,KAAK,CAAA;AACxF,6BAA4B;AAAnB,oBAAA,GAAG,CAAA;AACZ,2CAA0C;AAAjC,kCAAA,UAAU,CAAA;AACnB,6CAA0D;AAAnC,oCAAA,WAAW,CAAA;AAClC,qCAAyE;AAAhE,yCAAA,oBAAoB,CAAA;AAAE,2CAAA,sBAAsB,CAAA;AACrD,6BAAiD;AAAxC,4BAAA,WAAW,CAAA;AACpB,0CAAkD;AAAzC,+BAAA,aAAa,CAAA;AACtB,qCAAwC;AAA/B,gCAAA,WAAW,CAAA;AAEpB,6CAA+C;AAEtC,oCAAY","sourcesContent":["export {\n  addBreadcrumb,\n  captureException,\n  captureEvent,\n  captureMessage,\n  configureScope,\n  startTransaction,\n  setContext,\n  setExtra,\n  setExtras,\n  setTag,\n  setTags,\n  setUser,\n  withScope,\n} from '@sentry/minimal';\nexport { addGlobalEventProcessor, getCurrentHub, getHubFromCarrier, Hub, makeMain, Scope } from '@sentry/hub';\nexport { API } from './api';\nexport { BaseClient } from './baseclient';\nexport { BackendClass, BaseBackend } from './basebackend';\nexport { eventToSentryRequest, sessionToSentryRequest } from './request';\nexport { initAndBind, ClientClass } from './sdk';\nexport { NoopTransport } from './transports/noop';\nexport { SDK_VERSION } from './version';\n\nimport * as Integrations from './integrations';\n\nexport { Integrations };\n"]}import { Integration, Options } from '@sentry/types';
export declare const installedIntegrations: string[];
/** Map of integrations assigned to a client */
export interface IntegrationIndex {
    [key: string]: Integration;
}
/** Gets integration to install */
export declare function getIntegrationsToSetup(options: Options): Integration[];
/** Setup given integration */
export declare function setupIntegration(integration: Integration): void;
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
export declare function setupIntegrations<O extends Options>(options: O): IntegrationIndex;
//# sourceMappingURL=integration.d.ts.map{"version":3,"file":"integration.d.ts","sourceRoot":"","sources":["../src/integration.ts"],"names":[],"mappings":"AACA,OAAO,EAAE,WAAW,EAAE,OAAO,EAAE,MAAM,eAAe,CAAC;AAGrD,eAAO,MAAM,qBAAqB,EAAE,MAAM,EAAO,CAAC;AAElD,+CAA+C;AAC/C,MAAM,WAAW,gBAAgB;IAC/B,CAAC,GAAG,EAAE,MAAM,GAAG,WAAW,CAAC;CAC5B;AAED,kCAAkC;AAClC,wBAAgB,sBAAsB,CAAC,OAAO,EAAE,OAAO,GAAG,WAAW,EAAE,CAyCtE;AAED,8BAA8B;AAC9B,wBAAgB,gBAAgB,CAAC,WAAW,EAAE,WAAW,GAAG,IAAI,CAO/D;AAED;;;;;GAKG;AACH,wBAAgB,iBAAiB,CAAC,CAAC,SAAS,OAAO,EAAE,OAAO,EAAE,CAAC,GAAG,gBAAgB,CAOjF"}Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
var utils_1 = require("@sentry/utils");
exports.installedIntegrations = [];
/** Gets integration to install */
function getIntegrationsToSetup(options) {
    var defaultIntegrations = (options.defaultIntegrations && tslib_1.__spread(options.defaultIntegrations)) || [];
    var userIntegrations = options.integrations;
    var integrations = [];
    if (Array.isArray(userIntegrations)) {
        var userIntegrationsNames_1 = userIntegrations.map(function (i) { return i.name; });
        var pickedIntegrationsNames_1 = [];
        // Leave only unique default integrations, that were not overridden with provided user integrations
        defaultIntegrations.forEach(function (defaultIntegration) {
            if (userIntegrationsNames_1.indexOf(defaultIntegration.name) === -1 &&
                pickedIntegrationsNames_1.indexOf(defaultIntegration.name) === -1) {
                integrations.push(defaultIntegration);
                pickedIntegrationsNames_1.push(defaultIntegration.name);
            }
        });
        // Don't add same user integration twice
        userIntegrations.forEach(function (userIntegration) {
            if (pickedIntegrationsNames_1.indexOf(userIntegration.name) === -1) {
                integrations.push(userIntegration);
                pickedIntegrationsNames_1.push(userIntegration.name);
            }
        });
    }
    else if (typeof userIntegrations === 'function') {
        integrations = userIntegrations(defaultIntegrations);
        integrations = Array.isArray(integrations) ? integrations : [integrations];
    }
    else {
        integrations = tslib_1.__spread(defaultIntegrations);
    }
    // Make sure that if present, `Debug` integration will always run last
    var integrationsNames = integrations.map(function (i) { return i.name; });
    var alwaysLastToRun = 'Debug';
    if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {
        integrations.push.apply(integrations, tslib_1.__spread(integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1)));
    }
    return integrations;
}
exports.getIntegrationsToSetup = getIntegrationsToSetup;
/** Setup given integration */
function setupIntegration(integration) {
    if (exports.installedIntegrations.indexOf(integration.name) !== -1) {
        return;
    }
    integration.setupOnce(hub_1.addGlobalEventProcessor, hub_1.getCurrentHub);
    exports.installedIntegrations.push(integration.name);
    utils_1.logger.log("Integration installed: " + integration.name);
}
exports.setupIntegration = setupIntegration;
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
function setupIntegrations(options) {
    var integrations = {};
    getIntegrationsToSetup(options).forEach(function (integration) {
        integrations[integration.name] = integration;
        setupIntegration(integration);
    });
    return integrations;
}
exports.setupIntegrations = setupIntegrations;
//# sourceMappingURL=integration.js.map{"version":3,"file":"integration.js","sourceRoot":"","sources":["../src/integration.ts"],"names":[],"mappings":"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","sourcesContent":["import { addGlobalEventProcessor, getCurrentHub } from '@sentry/hub';\nimport { Integration, Options } from '@sentry/types';\nimport { logger } from '@sentry/utils';\n\nexport const installedIntegrations: string[] = [];\n\n/** Map of integrations assigned to a client */\nexport interface IntegrationIndex {\n  [key: string]: Integration;\n}\n\n/** Gets integration to install */\nexport function getIntegrationsToSetup(options: Options): Integration[] {\n  const defaultIntegrations = (options.defaultIntegrations && [...options.defaultIntegrations]) || [];\n  const userIntegrations = options.integrations;\n  let integrations: Integration[] = [];\n  if (Array.isArray(userIntegrations)) {\n    const userIntegrationsNames = userIntegrations.map(i => i.name);\n    const pickedIntegrationsNames: string[] = [];\n\n    // Leave only unique default integrations, that were not overridden with provided user integrations\n    defaultIntegrations.forEach(defaultIntegration => {\n      if (\n        userIntegrationsNames.indexOf(defaultIntegration.name) === -1 &&\n        pickedIntegrationsNames.indexOf(defaultIntegration.name) === -1\n      ) {\n        integrations.push(defaultIntegration);\n        pickedIntegrationsNames.push(defaultIntegration.name);\n      }\n    });\n\n    // Don't add same user integration twice\n    userIntegrations.forEach(userIntegration => {\n      if (pickedIntegrationsNames.indexOf(userIntegration.name) === -1) {\n        integrations.push(userIntegration);\n        pickedIntegrationsNames.push(userIntegration.name);\n      }\n    });\n  } else if (typeof userIntegrations === 'function') {\n    integrations = userIntegrations(defaultIntegrations);\n    integrations = Array.isArray(integrations) ? integrations : [integrations];\n  } else {\n    integrations = [...defaultIntegrations];\n  }\n\n  // Make sure that if present, `Debug` integration will always run last\n  const integrationsNames = integrations.map(i => i.name);\n  const alwaysLastToRun = 'Debug';\n  if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {\n    integrations.push(...integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1));\n  }\n\n  return integrations;\n}\n\n/** Setup given integration */\nexport function setupIntegration(integration: Integration): void {\n  if (installedIntegrations.indexOf(integration.name) !== -1) {\n    return;\n  }\n  integration.setupOnce(addGlobalEventProcessor, getCurrentHub);\n  installedIntegrations.push(integration.name);\n  logger.log(`Integration installed: ${integration.name}`);\n}\n\n/**\n * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default\n * integrations are added unless they were already provided before.\n * @param integrations array of integration instances\n * @param withDefault should enable default integrations\n */\nexport function setupIntegrations<O extends Options>(options: O): IntegrationIndex {\n  const integrations: IntegrationIndex = {};\n  getIntegrationsToSetup(options).forEach(integration => {\n    integrations[integration.name] = integration;\n    setupIntegration(integration);\n  });\n  return integrations;\n}\n"]}import { Integration } from '@sentry/types';
/** Patch toString calls to return proper name for wrapped functions */
export declare class FunctionToString implements Integration {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * @inheritDoc
     */
    setupOnce(): void;
}
//# sourceMappingURL=functiontostring.d.ts.map{"version":3,"file":"functiontostring.d.ts","sourceRoot":"","sources":["../../src/integrations/functiontostring.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,WAAW,EAAmB,MAAM,eAAe,CAAC;AAI7D,uEAAuE;AACvE,qBAAa,gBAAiB,YAAW,WAAW;IAClD;;OAEG;IACH,OAAc,EAAE,EAAE,MAAM,CAAsB;IAE9C;;OAEG;IACI,IAAI,EAAE,MAAM,CAAuB;IAE1C;;OAEG;IACI,SAAS,IAAI,IAAI;CAUzB"}Object.defineProperty(exports, "__esModule", { value: true });
var originalFunctionToString;
/** Patch toString calls to return proper name for wrapped functions */
var FunctionToString = /** @class */ (function () {
    function FunctionToString() {
        /**
         * @inheritDoc
         */
        this.name = FunctionToString.id;
    }
    /**
     * @inheritDoc
     */
    FunctionToString.prototype.setupOnce = function () {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        originalFunctionToString = Function.prototype.toString;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Function.prototype.toString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = this.__sentry_original__ || this;
            return originalFunctionToString.apply(context, args);
        };
    };
    /**
     * @inheritDoc
     */
    FunctionToString.id = 'FunctionToString';
    return FunctionToString;
}());
exports.FunctionToString = FunctionToString;
//# sourceMappingURL=functiontostring.js.map{"version":3,"file":"functiontostring.js","sourceRoot":"","sources":["../../src/integrations/functiontostring.ts"],"names":[],"mappings":";AAEA,IAAI,wBAAoC,CAAC;AAEzC,uEAAuE;AACvE;IAAA;QAME;;WAEG;QACI,SAAI,GAAW,gBAAgB,CAAC,EAAE,CAAC;IAe5C,CAAC;IAbC;;OAEG;IACI,oCAAS,GAAhB;QACE,6DAA6D;QAC7D,wBAAwB,GAAG,QAAQ,CAAC,SAAS,CAAC,QAAQ,CAAC;QAEvD,8DAA8D;QAC9D,QAAQ,CAAC,SAAS,CAAC,QAAQ,GAAG;YAAgC,cAAc;iBAAd,UAAc,EAAd,qBAAc,EAAd,IAAc;gBAAd,yBAAc;;YAC1E,IAAM,OAAO,GAAG,IAAI,CAAC,mBAAmB,IAAI,IAAI,CAAC;YACjD,OAAO,wBAAwB,CAAC,KAAK,CAAC,OAAO,EAAE,IAAI,CAAC,CAAC;QACvD,CAAC,CAAC;IACJ,CAAC;IAtBD;;OAEG;IACW,mBAAE,GAAW,kBAAkB,CAAC;IAoBhD,uBAAC;CAAA,AAxBD,IAwBC;AAxBY,4CAAgB","sourcesContent":["import { Integration, WrappedFunction } from '@sentry/types';\n\nlet originalFunctionToString: () => void;\n\n/** Patch toString calls to return proper name for wrapped functions */\nexport class FunctionToString implements Integration {\n  /**\n   * @inheritDoc\n   */\n  public static id: string = 'FunctionToString';\n\n  /**\n   * @inheritDoc\n   */\n  public name: string = FunctionToString.id;\n\n  /**\n   * @inheritDoc\n   */\n  public setupOnce(): void {\n    // eslint-disable-next-line @typescript-eslint/unbound-method\n    originalFunctionToString = Function.prototype.toString;\n\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    Function.prototype.toString = function(this: WrappedFunction, ...args: any[]): string {\n      const context = this.__sentry_original__ || this;\n      return originalFunctionToString.apply(context, args);\n    };\n  }\n}\n"]}import { Integration } from '@sentry/types';
/** JSDoc */
interface InboundFiltersOptions {
    allowUrls: Array<string | RegExp>;
    denyUrls: Array<string | RegExp>;
    ignoreErrors: Array<string | RegExp>;
    ignoreInternal: boolean;
    /** @deprecated use {@link InboundFiltersOptions.allowUrls} instead. */
    whitelistUrls: Array<string | RegExp>;
    /** @deprecated use {@link InboundFiltersOptions.denyUrls} instead. */
    blacklistUrls: Array<string | RegExp>;
}
/** Inbound filters configurable by the user */
export declare class InboundFilters implements Integration {
    private readonly _options;
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    constructor(_options?: Partial<InboundFiltersOptions>);
    /**
     * @inheritDoc
     */
    setupOnce(): void;
    /** JSDoc */
    private _shouldDropEvent;
    /** JSDoc */
    private _isSentryError;
    /** JSDoc */
    private _isIgnoredError;
    /** JSDoc */
    private _isDeniedUrl;
    /** JSDoc */
    private _isAllowedUrl;
    /** JSDoc */
    private _mergeOptions;
    /** JSDoc */
    private _getPossibleEventMessages;
    /** JSDoc */
    private _getEventFilterUrl;
}
export {};
//# sourceMappingURL=inboundfilters.d.ts.map{"version":3,"file":"inboundfilters.d.ts","sourceRoot":"","sources":["../../src/integrations/inboundfilters.ts"],"names":[],"mappings":"AACA,OAAO,EAAS,WAAW,EAAE,MAAM,eAAe,CAAC;AAOnD,YAAY;AACZ,UAAU,qBAAqB;IAC7B,SAAS,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IAClC,QAAQ,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IACjC,YAAY,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IACrC,cAAc,EAAE,OAAO,CAAC;IAExB,uEAAuE;IACvE,aAAa,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IACtC,sEAAsE;IACtE,aAAa,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;CACvC;AAED,+CAA+C;AAC/C,qBAAa,cAAe,YAAW,WAAW;IAW7B,OAAO,CAAC,QAAQ,CAAC,QAAQ;IAV5C;;OAEG;IACH,OAAc,EAAE,EAAE,MAAM,CAAoB;IAE5C;;OAEG;IACI,IAAI,EAAE,MAAM,CAAqB;gBAEJ,QAAQ,GAAE,OAAO,CAAC,qBAAqB,CAAM;IAEjF;;OAEG;IACI,SAAS,IAAI,IAAI;IAmBxB,YAAY;IACZ,OAAO,CAAC,gBAAgB;IA8BxB,YAAY;IACZ,OAAO,CAAC,cAAc;IAmBtB,YAAY;IACZ,OAAO,CAAC,eAAe;IAWvB,YAAY;IACZ,OAAO,CAAC,YAAY;IASpB,YAAY;IACZ,OAAO,CAAC,aAAa;IASrB,YAAY;IACZ,OAAO,CAAC,aAAa;IA2BrB,YAAY;IACZ,OAAO,CAAC,yBAAyB;IAgBjC,YAAY;IACZ,OAAO,CAAC,kBAAkB;CAiB3B"}Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
var utils_1 = require("@sentry/utils");
// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
/** Inbound filters configurable by the user */
var InboundFilters = /** @class */ (function () {
    function InboundFilters(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = InboundFilters.id;
    }
    /**
     * @inheritDoc
     */
    InboundFilters.prototype.setupOnce = function () {
        hub_1.addGlobalEventProcessor(function (event) {
            var hub = hub_1.getCurrentHub();
            if (!hub) {
                return event;
            }
            var self = hub.getIntegration(InboundFilters);
            if (self) {
                var client = hub.getClient();
                var clientOptions = client ? client.getOptions() : {};
                var options = self._mergeOptions(clientOptions);
                if (self._shouldDropEvent(event, options)) {
                    return null;
                }
            }
            return event;
        });
    };
    /** JSDoc */
    InboundFilters.prototype._shouldDropEvent = function (event, options) {
        if (this._isSentryError(event, options)) {
            utils_1.logger.warn("Event dropped due to being internal Sentry Error.\nEvent: " + utils_1.getEventDescription(event));
            return true;
        }
        if (this._isIgnoredError(event, options)) {
            utils_1.logger.warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: " + utils_1.getEventDescription(event));
            return true;
        }
        if (this._isDeniedUrl(event, options)) {
            utils_1.logger.warn("Event dropped due to being matched by `denyUrls` option.\nEvent: " + utils_1.getEventDescription(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        if (!this._isAllowedUrl(event, options)) {
            utils_1.logger.warn("Event dropped due to not being matched by `allowUrls` option.\nEvent: " + utils_1.getEventDescription(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        return false;
    };
    /** JSDoc */
    InboundFilters.prototype._isSentryError = function (event, options) {
        if (!options.ignoreInternal) {
            return false;
        }
        try {
            return ((event &&
                event.exception &&
                event.exception.values &&
                event.exception.values[0] &&
                event.exception.values[0].type === 'SentryError') ||
                false);
        }
        catch (_oO) {
            return false;
        }
    };
    /** JSDoc */
    InboundFilters.prototype._isIgnoredError = function (event, options) {
        if (!options.ignoreErrors || !options.ignoreErrors.length) {
            return false;
        }
        return this._getPossibleEventMessages(event).some(function (message) {
            // Not sure why TypeScript complains here...
            return options.ignoreErrors.some(function (pattern) { return utils_1.isMatchingPattern(message, pattern); });
        });
    };
    /** JSDoc */
    InboundFilters.prototype._isDeniedUrl = function (event, options) {
        // TODO: Use Glob instead?
        if (!options.denyUrls || !options.denyUrls.length) {
            return false;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? false : options.denyUrls.some(function (pattern) { return utils_1.isMatchingPattern(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._isAllowedUrl = function (event, options) {
        // TODO: Use Glob instead?
        if (!options.allowUrls || !options.allowUrls.length) {
            return true;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? true : options.allowUrls.some(function (pattern) { return utils_1.isMatchingPattern(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._mergeOptions = function (clientOptions) {
        if (clientOptions === void 0) { clientOptions = {}; }
        return {
            allowUrls: tslib_1.__spread((this._options.whitelistUrls || []), (this._options.allowUrls || []), (clientOptions.whitelistUrls || []), (clientOptions.allowUrls || [])),
            denyUrls: tslib_1.__spread((this._options.blacklistUrls || []), (this._options.denyUrls || []), (clientOptions.blacklistUrls || []), (clientOptions.denyUrls || [])),
            ignoreErrors: tslib_1.__spread((this._options.ignoreErrors || []), (clientOptions.ignoreErrors || []), DEFAULT_IGNORE_ERRORS),
            ignoreInternal: typeof this._options.ignoreInternal !== 'undefined' ? this._options.ignoreInternal : true,
        };
    };
    /** JSDoc */
    InboundFilters.prototype._getPossibleEventMessages = function (event) {
        if (event.message) {
            return [event.message];
        }
        if (event.exception) {
            try {
                var _a = (event.exception.values && event.exception.values[0]) || {}, _b = _a.type, type = _b === void 0 ? '' : _b, _c = _a.value, value = _c === void 0 ? '' : _c;
                return ["" + value, type + ": " + value];
            }
            catch (oO) {
                utils_1.logger.error("Cannot extract message for event " + utils_1.getEventDescription(event));
                return [];
            }
        }
        return [];
    };
    /** JSDoc */
    InboundFilters.prototype._getEventFilterUrl = function (event) {
        try {
            if (event.stacktrace) {
                var frames_1 = event.stacktrace.frames;
                return (frames_1 && frames_1[frames_1.length - 1].filename) || null;
            }
            if (event.exception) {
                var frames_2 = event.exception.values && event.exception.values[0].stacktrace && event.exception.values[0].stacktrace.frames;
                return (frames_2 && frames_2[frames_2.length - 1].filename) || null;
            }
            return null;
        }
        catch (oO) {
            utils_1.logger.error("Cannot extract url for event " + utils_1.getEventDescription(event));
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    InboundFilters.id = 'InboundFilters';
    return InboundFilters;
}());
exports.InboundFilters = InboundFilters;
//# sourceMappingURL=inboundfilters.js.map{"version":3,"file":"inboundfilters.js","sourceRoot":"","sources":["../../src/integrations/inboundfilters.ts"],"names":[],"mappings":";;AAAA,mCAAqE;AAErE,uCAA+E;AAE/E,6EAA6E;AAC7E,mFAAmF;AACnF,IAAM,qBAAqB,GAAG,CAAC,mBAAmB,EAAE,+CAA+C,CAAC,CAAC;AAerG,+CAA+C;AAC/C;IAWE,wBAAoC,QAA6C;QAA7C,yBAAA,EAAA,aAA6C;QAA7C,aAAQ,GAAR,QAAQ,CAAqC;QALjF;;WAEG;QACI,SAAI,GAAW,cAAc,CAAC,EAAE,CAAC;IAE4C,CAAC;IAErF;;OAEG;IACI,kCAAS,GAAhB;QACE,6BAAuB,CAAC,UAAC,KAAY;YACnC,IAAM,GAAG,GAAG,mBAAa,EAAE,CAAC;YAC5B,IAAI,CAAC,GAAG,EAAE;gBACR,OAAO,KAAK,CAAC;aACd;YACD,IAAM,IAAI,GAAG,GAAG,CAAC,cAAc,CAAC,cAAc,CAAC,CAAC;YAChD,IAAI,IAAI,EAAE;gBACR,IAAM,MAAM,GAAG,GAAG,CAAC,SAAS,EAAE,CAAC;gBAC/B,IAAM,aAAa,GAAG,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,UAAU,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC;gBACxD,IAAM,OAAO,GAAG,IAAI,CAAC,aAAa,CAAC,aAAa,CAAC,CAAC;gBAClD,IAAI,IAAI,CAAC,gBAAgB,CAAC,KAAK,EAAE,OAAO,CAAC,EAAE;oBACzC,OAAO,IAAI,CAAC;iBACb;aACF;YACD,OAAO,KAAK,CAAC;QACf,CAAC,CAAC,CAAC;IACL,CAAC;IAED,YAAY;IACJ,yCAAgB,GAAxB,UAAyB,KAAY,EAAE,OAAuC;QAC5E,IAAI,IAAI,CAAC,cAAc,CAAC,KAAK,EAAE,OAAO,CAAC,EAAE;YACvC,cAAM,CAAC,IAAI,CAAC,+DAA6D,2BAAmB,CAAC,KAAK,CAAG,CAAC,CAAC;YACvG,OAAO,IAAI,CAAC;SACb;QACD,IAAI,IAAI,CAAC,eAAe,CAAC,KAAK,EAAE,OAAO,CAAC,EAAE;YACxC,cAAM,CAAC,IAAI,CACT,0EAA0E,2BAAmB,CAAC,KAAK,CAAG,CACvG,CAAC;YACF,OAAO,IAAI,CAAC;SACb;QACD,IAAI,IAAI,CAAC,YAAY,CAAC,KAAK,EAAE,OAAO,CAAC,EAAE;YACrC,cAAM,CAAC,IAAI,CACT,sEAAsE,2BAAmB,CACvF,KAAK,CACN,gBAAW,IAAI,CAAC,kBAAkB,CAAC,KAAK,CAAG,CAC7C,CAAC;YACF,OAAO,IAAI,CAAC;SACb;QACD,IAAI,CAAC,IAAI,CAAC,aAAa,CAAC,KAAK,EAAE,OAAO,CAAC,EAAE;YACvC,cAAM,CAAC,IAAI,CACT,2EAA2E,2BAAmB,CAC5F,KAAK,CACN,gBAAW,IAAI,CAAC,kBAAkB,CAAC,KAAK,CAAG,CAC7C,CAAC;YACF,OAAO,IAAI,CAAC;SACb;QACD,OAAO,KAAK,CAAC;IACf,CAAC;IAED,YAAY;IACJ,uCAAc,GAAtB,UAAuB,KAAY,EAAE,OAAuC;QAC1E,IAAI,CAAC,OAAO,CAAC,cAAc,EAAE;YAC3B,OAAO,KAAK,CAAC;SACd;QAED,IAAI;YACF,OAAO,CACL,CAAC,KAAK;gBACJ,KAAK,CAAC,SAAS;gBACf,KAAK,CAAC,SAAS,CAAC,MAAM;gBACtB,KAAK,CAAC,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC;gBACzB,KAAK,CAAC,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,IAAI,KAAK,aAAa,CAAC;gBACnD,KAAK,CACN,CAAC;SACH;QAAC,OAAO,GAAG,EAAE;YACZ,OAAO,KAAK,CAAC;SACd;IACH,CAAC;IAED,YAAY;IACJ,wCAAe,GAAvB,UAAwB,KAAY,EAAE,OAAuC;QAC3E,IAAI,CAAC,OAAO,CAAC,YAAY,IAAI,CAAC,OAAO,CAAC,YAAY,CAAC,MAAM,EAAE;YACzD,OAAO,KAAK,CAAC;SACd;QAED,OAAO,IAAI,CAAC,yBAAyB,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,UAAA,OAAO;YACvD,4CAA4C;YAC5C,OAAC,OAAO,CAAC,YAAuC,CAAC,IAAI,CAAC,UAAA,OAAO,IAAI,OAAA,yBAAiB,CAAC,OAAO,EAAE,OAAO,CAAC,EAAnC,CAAmC,CAAC;QAArG,CAAqG,CACtG,CAAC;IACJ,CAAC;IAED,YAAY;IACJ,qCAAY,GAApB,UAAqB,KAAY,EAAE,OAAuC;QACxE,0BAA0B;QAC1B,IAAI,CAAC,OAAO,CAAC,QAAQ,IAAI,CAAC,OAAO,CAAC,QAAQ,CAAC,MAAM,EAAE;YACjD,OAAO,KAAK,CAAC;SACd;QACD,IAAM,GAAG,GAAG,IAAI,CAAC,kBAAkB,CAAC,KAAK,CAAC,CAAC;QAC3C,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,OAAO,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAA,OAAO,IAAI,OAAA,yBAAiB,CAAC,GAAG,EAAE,OAAO,CAAC,EAA/B,CAA+B,CAAC,CAAC;IAC1F,CAAC;IAED,YAAY;IACJ,sCAAa,GAArB,UAAsB,KAAY,EAAE,OAAuC;QACzE,0BAA0B;QAC1B,IAAI,CAAC,OAAO,CAAC,SAAS,IAAI,CAAC,OAAO,CAAC,SAAS,CAAC,MAAM,EAAE;YACnD,OAAO,IAAI,CAAC;SACb;QACD,IAAM,GAAG,GAAG,IAAI,CAAC,kBAAkB,CAAC,KAAK,CAAC,CAAC;QAC3C,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,OAAO,CAAC,SAAS,CAAC,IAAI,CAAC,UAAA,OAAO,IAAI,OAAA,yBAAiB,CAAC,GAAG,EAAE,OAAO,CAAC,EAA/B,CAA+B,CAAC,CAAC;IAC1F,CAAC;IAED,YAAY;IACJ,sCAAa,GAArB,UAAsB,aAAkD;QAAlD,8BAAA,EAAA,kBAAkD;QACtE,OAAO;YACL,SAAS,mBAEJ,CAAC,IAAI,CAAC,QAAQ,CAAC,aAAa,IAAI,EAAE,CAAC,EACnC,CAAC,IAAI,CAAC,QAAQ,CAAC,SAAS,IAAI,EAAE,CAAC,EAE/B,CAAC,aAAa,CAAC,aAAa,IAAI,EAAE,CAAC,EACnC,CAAC,aAAa,CAAC,SAAS,IAAI,EAAE,CAAC,CACnC;YACD,QAAQ,mBAEH,CAAC,IAAI,CAAC,QAAQ,CAAC,aAAa,IAAI,EAAE,CAAC,EACnC,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,IAAI,EAAE,CAAC,EAE9B,CAAC,aAAa,CAAC,aAAa,IAAI,EAAE,CAAC,EACnC,CAAC,aAAa,CAAC,QAAQ,IAAI,EAAE,CAAC,CAClC;YACD,YAAY,mBACP,CAAC,IAAI,CAAC,QAAQ,CAAC,YAAY,IAAI,EAAE,CAAC,EAClC,CAAC,aAAa,CAAC,YAAY,IAAI,EAAE,CAAC,EAClC,qBAAqB,CACzB;YACD,cAAc,EAAE,OAAO,IAAI,CAAC,QAAQ,CAAC,cAAc,KAAK,WAAW,CAAC,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,cAAc,CAAC,CAAC,CAAC,IAAI;SAC1G,CAAC;IACJ,CAAC;IAED,YAAY;IACJ,kDAAyB,GAAjC,UAAkC,KAAY;QAC5C,IAAI,KAAK,CAAC,OAAO,EAAE;YACjB,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC;SACxB;QACD,IAAI,KAAK,CAAC,SAAS,EAAE;YACnB,IAAI;gBACI,IAAA,gEAAuF,EAArF,YAAS,EAAT,8BAAS,EAAE,aAAU,EAAV,+BAA0E,CAAC;gBAC9F,OAAO,CAAC,KAAG,KAAO,EAAK,IAAI,UAAK,KAAO,CAAC,CAAC;aAC1C;YAAC,OAAO,EAAE,EAAE;gBACX,cAAM,CAAC,KAAK,CAAC,sCAAoC,2BAAmB,CAAC,KAAK,CAAG,CAAC,CAAC;gBAC/E,OAAO,EAAE,CAAC;aACX;SACF;QACD,OAAO,EAAE,CAAC;IACZ,CAAC;IAED,YAAY;IACJ,2CAAkB,GAA1B,UAA2B,KAAY;QACrC,IAAI;YACF,IAAI,KAAK,CAAC,UAAU,EAAE;gBACpB,IAAM,QAAM,GAAG,KAAK,CAAC,UAAU,CAAC,MAAM,CAAC;gBACvC,OAAO,CAAC,QAAM,IAAI,QAAM,CAAC,QAAM,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC,QAAQ,CAAC,IAAI,IAAI,CAAC;aAC/D;YACD,IAAI,KAAK,CAAC,SAAS,EAAE;gBACnB,IAAM,QAAM,GACV,KAAK,CAAC,SAAS,CAAC,MAAM,IAAI,KAAK,CAAC,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,UAAU,IAAI,KAAK,CAAC,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,UAAU,CAAC,MAAM,CAAC;gBAChH,OAAO,CAAC,QAAM,IAAI,QAAM,CAAC,QAAM,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC,QAAQ,CAAC,IAAI,IAAI,CAAC;aAC/D;YACD,OAAO,IAAI,CAAC;SACb;QAAC,OAAO,EAAE,EAAE;YACX,cAAM,CAAC,KAAK,CAAC,kCAAgC,2BAAmB,CAAC,KAAK,CAAG,CAAC,CAAC;YAC3E,OAAO,IAAI,CAAC;SACb;IACH,CAAC;IAnLD;;OAEG;IACW,iBAAE,GAAW,gBAAgB,CAAC;IAiL9C,qBAAC;CAAA,AArLD,IAqLC;AArLY,wCAAc","sourcesContent":["import { addGlobalEventProcessor, getCurrentHub } from '@sentry/hub';\nimport { Event, Integration } from '@sentry/types';\nimport { getEventDescription, isMatchingPattern, logger } from '@sentry/utils';\n\n// \"Script error.\" is hard coded into browsers for errors that it can't read.\n// this is the result of a script being pulled in from an external domain and CORS.\nconst DEFAULT_IGNORE_ERRORS = [/^Script error\\.?$/, /^Javascript error: Script error\\.? on line 0$/];\n\n/** JSDoc */\ninterface InboundFiltersOptions {\n  allowUrls: Array<string | RegExp>;\n  denyUrls: Array<string | RegExp>;\n  ignoreErrors: Array<string | RegExp>;\n  ignoreInternal: boolean;\n\n  /** @deprecated use {@link InboundFiltersOptions.allowUrls} instead. */\n  whitelistUrls: Array<string | RegExp>;\n  /** @deprecated use {@link InboundFiltersOptions.denyUrls} instead. */\n  blacklistUrls: Array<string | RegExp>;\n}\n\n/** Inbound filters configurable by the user */\nexport class InboundFilters implements Integration {\n  /**\n   * @inheritDoc\n   */\n  public static id: string = 'InboundFilters';\n\n  /**\n   * @inheritDoc\n   */\n  public name: string = InboundFilters.id;\n\n  public constructor(private readonly _options: Partial<InboundFiltersOptions> = {}) {}\n\n  /**\n   * @inheritDoc\n   */\n  public setupOnce(): void {\n    addGlobalEventProcessor((event: Event) => {\n      const hub = getCurrentHub();\n      if (!hub) {\n        return event;\n      }\n      const self = hub.getIntegration(InboundFilters);\n      if (self) {\n        const client = hub.getClient();\n        const clientOptions = client ? client.getOptions() : {};\n        const options = self._mergeOptions(clientOptions);\n        if (self._shouldDropEvent(event, options)) {\n          return null;\n        }\n      }\n      return event;\n    });\n  }\n\n  /** JSDoc */\n  private _shouldDropEvent(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    if (this._isSentryError(event, options)) {\n      logger.warn(`Event dropped due to being internal Sentry Error.\\nEvent: ${getEventDescription(event)}`);\n      return true;\n    }\n    if (this._isIgnoredError(event, options)) {\n      logger.warn(\n        `Event dropped due to being matched by \\`ignoreErrors\\` option.\\nEvent: ${getEventDescription(event)}`,\n      );\n      return true;\n    }\n    if (this._isDeniedUrl(event, options)) {\n      logger.warn(\n        `Event dropped due to being matched by \\`denyUrls\\` option.\\nEvent: ${getEventDescription(\n          event,\n        )}.\\nUrl: ${this._getEventFilterUrl(event)}`,\n      );\n      return true;\n    }\n    if (!this._isAllowedUrl(event, options)) {\n      logger.warn(\n        `Event dropped due to not being matched by \\`allowUrls\\` option.\\nEvent: ${getEventDescription(\n          event,\n        )}.\\nUrl: ${this._getEventFilterUrl(event)}`,\n      );\n      return true;\n    }\n    return false;\n  }\n\n  /** JSDoc */\n  private _isSentryError(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    if (!options.ignoreInternal) {\n      return false;\n    }\n\n    try {\n      return (\n        (event &&\n          event.exception &&\n          event.exception.values &&\n          event.exception.values[0] &&\n          event.exception.values[0].type === 'SentryError') ||\n        false\n      );\n    } catch (_oO) {\n      return false;\n    }\n  }\n\n  /** JSDoc */\n  private _isIgnoredError(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    if (!options.ignoreErrors || !options.ignoreErrors.length) {\n      return false;\n    }\n\n    return this._getPossibleEventMessages(event).some(message =>\n      // Not sure why TypeScript complains here...\n      (options.ignoreErrors as Array<RegExp | string>).some(pattern => isMatchingPattern(message, pattern)),\n    );\n  }\n\n  /** JSDoc */\n  private _isDeniedUrl(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    // TODO: Use Glob instead?\n    if (!options.denyUrls || !options.denyUrls.length) {\n      return false;\n    }\n    const url = this._getEventFilterUrl(event);\n    return !url ? false : options.denyUrls.some(pattern => isMatchingPattern(url, pattern));\n  }\n\n  /** JSDoc */\n  private _isAllowedUrl(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    // TODO: Use Glob instead?\n    if (!options.allowUrls || !options.allowUrls.length) {\n      return true;\n    }\n    const url = this._getEventFilterUrl(event);\n    return !url ? true : options.allowUrls.some(pattern => isMatchingPattern(url, pattern));\n  }\n\n  /** JSDoc */\n  private _mergeOptions(clientOptions: Partial<InboundFiltersOptions> = {}): Partial<InboundFiltersOptions> {\n    return {\n      allowUrls: [\n        // eslint-disable-next-line deprecation/deprecation\n        ...(this._options.whitelistUrls || []),\n        ...(this._options.allowUrls || []),\n        // eslint-disable-next-line deprecation/deprecation\n        ...(clientOptions.whitelistUrls || []),\n        ...(clientOptions.allowUrls || []),\n      ],\n      denyUrls: [\n        // eslint-disable-next-line deprecation/deprecation\n        ...(this._options.blacklistUrls || []),\n        ...(this._options.denyUrls || []),\n        // eslint-disable-next-line deprecation/deprecation\n        ...(clientOptions.blacklistUrls || []),\n        ...(clientOptions.denyUrls || []),\n      ],\n      ignoreErrors: [\n        ...(this._options.ignoreErrors || []),\n        ...(clientOptions.ignoreErrors || []),\n        ...DEFAULT_IGNORE_ERRORS,\n      ],\n      ignoreInternal: typeof this._options.ignoreInternal !== 'undefined' ? this._options.ignoreInternal : true,\n    };\n  }\n\n  /** JSDoc */\n  private _getPossibleEventMessages(event: Event): string[] {\n    if (event.message) {\n      return [event.message];\n    }\n    if (event.exception) {\n      try {\n        const { type = '', value = '' } = (event.exception.values && event.exception.values[0]) || {};\n        return [`${value}`, `${type}: ${value}`];\n      } catch (oO) {\n        logger.error(`Cannot extract message for event ${getEventDescription(event)}`);\n        return [];\n      }\n    }\n    return [];\n  }\n\n  /** JSDoc */\n  private _getEventFilterUrl(event: Event): string | null {\n    try {\n      if (event.stacktrace) {\n        const frames = event.stacktrace.frames;\n        return (frames && frames[frames.length - 1].filename) || null;\n      }\n      if (event.exception) {\n        const frames =\n          event.exception.values && event.exception.values[0].stacktrace && event.exception.values[0].stacktrace.frames;\n        return (frames && frames[frames.length - 1].filename) || null;\n      }\n      return null;\n    } catch (oO) {\n      logger.error(`Cannot extract url for event ${getEventDescription(event)}`);\n      return null;\n    }\n  }\n}\n"]}export { FunctionToString } from './functiontostring';
export { InboundFilters } from './inboundfilters';
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../../src/integrations/index.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,gBAAgB,EAAE,MAAM,oBAAoB,CAAC;AACtD,OAAO,EAAE,cAAc,EAAE,MAAM,kBAAkB,CAAC"}Object.defineProperty(exports, "__esModule", { value: true });
var functiontostring_1 = require("./functiontostring");
exports.FunctionToString = functiontostring_1.FunctionToString;
var inboundfilters_1 = require("./inboundfilters");
exports.InboundFilters = inboundfilters_1.InboundFilters;
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../../src/integrations/index.ts"],"names":[],"mappings":";AAAA,uDAAsD;AAA7C,8CAAA,gBAAgB,CAAA;AACzB,mDAAkD;AAAzC,0CAAA,cAAc,CAAA","sourcesContent":["export { FunctionToString } from './functiontostring';\nexport { InboundFilters } from './inboundfilters';\n"]}import { Event, SentryRequest, Session } from '@sentry/types';
import { API } from './api';
/** Creates a SentryRequest from an event. */
export declare function sessionToSentryRequest(session: Session, api: API): SentryRequest;
/** Creates a SentryRequest from an event. */
export declare function eventToSentryRequest(event: Event, api: API): SentryRequest;
//# sourceMappingURL=request.d.ts.map{"version":3,"file":"request.d.ts","sourceRoot":"","sources":["../src/request.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,KAAK,EAAW,aAAa,EAAE,OAAO,EAAE,MAAM,eAAe,CAAC;AAEvE,OAAO,EAAE,GAAG,EAAE,MAAM,OAAO,CAAC;AA+B5B,6CAA6C;AAC7C,wBAAgB,sBAAsB,CAAC,OAAO,EAAE,OAAO,EAAE,GAAG,EAAE,GAAG,GAAG,aAAa,CAehF;AAED,6CAA6C;AAC7C,wBAAgB,oBAAoB,CAAC,KAAK,EAAE,KAAK,EAAE,GAAG,EAAE,GAAG,GAAG,aAAa,CAyD1E"}Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/** Extract sdk info from from the API metadata */
function getSdkMetadataForEnvelopeHeader(api) {
    if (!api.metadata || !api.metadata.sdk) {
        return;
    }
    var _a = api.metadata.sdk, name = _a.name, version = _a.version;
    return { name: name, version: version };
}
/**
 * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
 * Merge with existing data if any.
 **/
function enhanceEventWithSdkInfo(event, sdkInfo) {
    if (!sdkInfo) {
        return event;
    }
    event.sdk = event.sdk || {
        name: sdkInfo.name,
        version: sdkInfo.version,
    };
    event.sdk.name = event.sdk.name || sdkInfo.name;
    event.sdk.version = event.sdk.version || sdkInfo.version;
    event.sdk.integrations = tslib_1.__spread((event.sdk.integrations || []), (sdkInfo.integrations || []));
    event.sdk.packages = tslib_1.__spread((event.sdk.packages || []), (sdkInfo.packages || []));
    return event;
}
/** Creates a SentryRequest from an event. */
function sessionToSentryRequest(session, api) {
    var sdkInfo = getSdkMetadataForEnvelopeHeader(api);
    var envelopeHeaders = JSON.stringify(tslib_1.__assign({ sent_at: new Date().toISOString() }, (sdkInfo && { sdk: sdkInfo })));
    var itemHeaders = JSON.stringify({
        type: 'session',
    });
    return {
        body: envelopeHeaders + "\n" + itemHeaders + "\n" + JSON.stringify(session),
        type: 'session',
        url: api.getEnvelopeEndpointWithUrlEncodedAuth(),
    };
}
exports.sessionToSentryRequest = sessionToSentryRequest;
/** Creates a SentryRequest from an event. */
function eventToSentryRequest(event, api) {
    // since JS has no Object.prototype.pop()
    var _a = event.tags || {}, samplingMethod = _a.__sentry_samplingMethod, sampleRate = _a.__sentry_sampleRate, otherTags = tslib_1.__rest(_a, ["__sentry_samplingMethod", "__sentry_sampleRate"]);
    event.tags = otherTags;
    var sdkInfo = getSdkMetadataForEnvelopeHeader(api);
    var eventType = event.type || 'event';
    var useEnvelope = eventType === 'transaction';
    var req = {
        body: JSON.stringify(sdkInfo ? enhanceEventWithSdkInfo(event, api.metadata.sdk) : event),
        type: eventType,
        url: useEnvelope ? api.getEnvelopeEndpointWithUrlEncodedAuth() : api.getStoreEndpointWithUrlEncodedAuth(),
    };
    // https://develop.sentry.dev/sdk/envelopes/
    // Since we don't need to manipulate envelopes nor store them, there is no
    // exported concept of an Envelope with operations including serialization and
    // deserialization. Instead, we only implement a minimal subset of the spec to
    // serialize events inline here.
    if (useEnvelope) {
        var envelopeHeaders = JSON.stringify(tslib_1.__assign({ event_id: event.event_id, sent_at: new Date().toISOString() }, (sdkInfo && { sdk: sdkInfo })));
        var itemHeaders = JSON.stringify({
            type: event.type,
            // TODO: Right now, sampleRate may or may not be defined (it won't be in the cases of inheritance and
            // explicitly-set sampling decisions). Are we good with that?
            sample_rates: [{ id: samplingMethod, rate: sampleRate }],
        });
        // The trailing newline is optional. We intentionally don't send it to avoid
        // sending unnecessary bytes.
        //
        // const envelope = `${envelopeHeaders}\n${itemHeaders}\n${req.body}\n`;
        var envelope = envelopeHeaders + "\n" + itemHeaders + "\n" + req.body;
        req.body = envelope;
    }
    return req;
}
exports.eventToSentryRequest = eventToSentryRequest;
//# sourceMappingURL=request.js.map{"version":3,"file":"request.js","sourceRoot":"","sources":["../src/request.ts"],"names":[],"mappings":"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","sourcesContent":["import { Event, SdkInfo, SentryRequest, Session } from '@sentry/types';\n\nimport { API } from './api';\n\n/** Extract sdk info from from the API metadata */\nfunction getSdkMetadataForEnvelopeHeader(api: API): SdkInfo | undefined {\n  if (!api.metadata || !api.metadata.sdk) {\n    return;\n  }\n  const { name, version } = api.metadata.sdk;\n  return { name, version };\n}\n\n/**\n * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.\n * Merge with existing data if any.\n **/\nfunction enhanceEventWithSdkInfo(event: Event, sdkInfo?: SdkInfo): Event {\n  if (!sdkInfo) {\n    return event;\n  }\n\n  event.sdk = event.sdk || {\n    name: sdkInfo.name,\n    version: sdkInfo.version,\n  };\n  event.sdk.name = event.sdk.name || sdkInfo.name;\n  event.sdk.version = event.sdk.version || sdkInfo.version;\n  event.sdk.integrations = [...(event.sdk.integrations || []), ...(sdkInfo.integrations || [])];\n  event.sdk.packages = [...(event.sdk.packages || []), ...(sdkInfo.packages || [])];\n  return event;\n}\n\n/** Creates a SentryRequest from an event. */\nexport function sessionToSentryRequest(session: Session, api: API): SentryRequest {\n  const sdkInfo = getSdkMetadataForEnvelopeHeader(api);\n  const envelopeHeaders = JSON.stringify({\n    sent_at: new Date().toISOString(),\n    ...(sdkInfo && { sdk: sdkInfo }),\n  });\n  const itemHeaders = JSON.stringify({\n    type: 'session',\n  });\n\n  return {\n    body: `${envelopeHeaders}\\n${itemHeaders}\\n${JSON.stringify(session)}`,\n    type: 'session',\n    url: api.getEnvelopeEndpointWithUrlEncodedAuth(),\n  };\n}\n\n/** Creates a SentryRequest from an event. */\nexport function eventToSentryRequest(event: Event, api: API): SentryRequest {\n  // since JS has no Object.prototype.pop()\n  const { __sentry_samplingMethod: samplingMethod, __sentry_sampleRate: sampleRate, ...otherTags } = event.tags || {};\n  event.tags = otherTags;\n\n  const sdkInfo = getSdkMetadataForEnvelopeHeader(api);\n  const eventType = event.type || 'event';\n  const useEnvelope = eventType === 'transaction';\n\n  const req: SentryRequest = {\n    body: JSON.stringify(sdkInfo ? enhanceEventWithSdkInfo(event, api.metadata.sdk) : event),\n    type: eventType,\n    url: useEnvelope ? api.getEnvelopeEndpointWithUrlEncodedAuth() : api.getStoreEndpointWithUrlEncodedAuth(),\n  };\n\n  // https://develop.sentry.dev/sdk/envelopes/\n\n  // Since we don't need to manipulate envelopes nor store them, there is no\n  // exported concept of an Envelope with operations including serialization and\n  // deserialization. Instead, we only implement a minimal subset of the spec to\n  // serialize events inline here.\n  if (useEnvelope) {\n    const envelopeHeaders = JSON.stringify({\n      event_id: event.event_id,\n      sent_at: new Date().toISOString(),\n      ...(sdkInfo && { sdk: sdkInfo }),\n    });\n    const itemHeaders = JSON.stringify({\n      type: event.type,\n\n      // TODO: Right now, sampleRate may or may not be defined (it won't be in the cases of inheritance and\n      // explicitly-set sampling decisions). Are we good with that?\n      sample_rates: [{ id: samplingMethod, rate: sampleRate }],\n\n      // The content-type is assumed to be 'application/json' and not part of\n      // the current spec for transaction items, so we don't bloat the request\n      // body with it.\n      //\n      // content_type: 'application/json',\n      //\n      // The length is optional. It must be the number of bytes in req.Body\n      // encoded as UTF-8. Since the server can figure this out and would\n      // otherwise refuse events that report the length incorrectly, we decided\n      // not to send the length to avoid problems related to reporting the wrong\n      // size and to reduce request body size.\n      //\n      // length: new TextEncoder().encode(req.body).length,\n    });\n    // The trailing newline is optional. We intentionally don't send it to avoid\n    // sending unnecessary bytes.\n    //\n    // const envelope = `${envelopeHeaders}\\n${itemHeaders}\\n${req.body}\\n`;\n    const envelope = `${envelopeHeaders}\\n${itemHeaders}\\n${req.body}`;\n    req.body = envelope;\n  }\n\n  return req;\n}\n"]}import { Client, Options } from '@sentry/types';
/** A class object that can instantiate Client objects. */
export declare type ClientClass<F extends Client, O extends Options> = new (options: O) => F;
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
export declare function initAndBind<F extends Client, O extends Options>(clientClass: ClientClass<F, O>, options: O): void;
//# sourceMappingURL=sdk.d.ts.map{"version":3,"file":"sdk.d.ts","sourceRoot":"","sources":["../src/sdk.ts"],"names":[],"mappings":"AACA,OAAO,EAAE,MAAM,EAAE,OAAO,EAAE,MAAM,eAAe,CAAC;AAGhD,0DAA0D;AAC1D,oBAAY,WAAW,CAAC,CAAC,SAAS,MAAM,EAAE,CAAC,SAAS,OAAO,IAAI,KAAK,OAAO,EAAE,CAAC,KAAK,CAAC,CAAC;AAErF;;;;;;GAMG;AACH,wBAAgB,WAAW,CAAC,CAAC,SAAS,MAAM,EAAE,CAAC,SAAS,OAAO,EAAE,WAAW,EAAE,WAAW,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,OAAO,EAAE,CAAC,GAAG,IAAI,CAOjH"}Object.defineProperty(exports, "__esModule", { value: true });
var hub_1 = require("@sentry/hub");
var utils_1 = require("@sentry/utils");
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
function initAndBind(clientClass, options) {
    if (options.debug === true) {
        utils_1.logger.enable();
    }
    var hub = hub_1.getCurrentHub();
    var client = new clientClass(options);
    hub.bindClient(client);
}
exports.initAndBind = initAndBind;
//# sourceMappingURL=sdk.js.map{"version":3,"file":"sdk.js","sourceRoot":"","sources":["../src/sdk.ts"],"names":[],"mappings":";AAAA,mCAA4C;AAE5C,uCAAuC;AAKvC;;;;;;GAMG;AACH,SAAgB,WAAW,CAAsC,WAA8B,EAAE,OAAU;IACzG,IAAI,OAAO,CAAC,KAAK,KAAK,IAAI,EAAE;QAC1B,cAAM,CAAC,MAAM,EAAE,CAAC;KACjB;IACD,IAAM,GAAG,GAAG,mBAAa,EAAE,CAAC;IAC5B,IAAM,MAAM,GAAG,IAAI,WAAW,CAAC,OAAO,CAAC,CAAC;IACxC,GAAG,CAAC,UAAU,CAAC,MAAM,CAAC,CAAC;AACzB,CAAC;AAPD,kCAOC","sourcesContent":["import { getCurrentHub } from '@sentry/hub';\nimport { Client, Options } from '@sentry/types';\nimport { logger } from '@sentry/utils';\n\n/** A class object that can instantiate Client objects. */\nexport type ClientClass<F extends Client, O extends Options> = new (options: O) => F;\n\n/**\n * Internal function to create a new SDK client instance. The client is\n * installed and then bound to the current scope.\n *\n * @param clientClass The client class to instantiate.\n * @param options Options to pass to the client.\n */\nexport function initAndBind<F extends Client, O extends Options>(clientClass: ClientClass<F, O>, options: O): void {\n  if (options.debug === true) {\n    logger.enable();\n  }\n  const hub = getCurrentHub();\n  const client = new clientClass(options);\n  hub.bindClient(client);\n}\n"]}import { Event, Response, Transport } from '@sentry/types';
/** Noop transport */
export declare class NoopTransport implements Transport {
    /**
     * @inheritDoc
     */
    sendEvent(_: Event): PromiseLike<Response>;
    /**
     * @inheritDoc
     */
    close(_?: number): PromiseLike<boolean>;
}
//# sourceMappingURL=noop.d.ts.map{"version":3,"file":"noop.d.ts","sourceRoot":"","sources":["../../src/transports/noop.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,KAAK,EAAE,QAAQ,EAAU,SAAS,EAAE,MAAM,eAAe,CAAC;AAGnE,qBAAqB;AACrB,qBAAa,aAAc,YAAW,SAAS;IAC7C;;OAEG;IACI,SAAS,CAAC,CAAC,EAAE,KAAK,GAAG,WAAW,CAAC,QAAQ,CAAC;IAOjD;;OAEG;IACI,KAAK,CAAC,CAAC,CAAC,EAAE,MAAM,GAAG,WAAW,CAAC,OAAO,CAAC;CAG/C"}Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("@sentry/types");
var utils_1 = require("@sentry/utils");
/** Noop transport */
var NoopTransport = /** @class */ (function () {
    function NoopTransport() {
    }
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.sendEvent = function (_) {
        return utils_1.SyncPromise.resolve({
            reason: "NoopTransport: Event has been skipped because no Dsn is configured.",
            status: types_1.Status.Skipped,
        });
    };
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.close = function (_) {
        return utils_1.SyncPromise.resolve(true);
    };
    return NoopTransport;
}());
exports.NoopTransport = NoopTransport;
//# sourceMappingURL=noop.js.map{"version":3,"file":"noop.js","sourceRoot":"","sources":["../../src/transports/noop.ts"],"names":[],"mappings":";AAAA,uCAAmE;AACnE,uCAA4C;AAE5C,qBAAqB;AACrB;IAAA;IAiBA,CAAC;IAhBC;;OAEG;IACI,iCAAS,GAAhB,UAAiB,CAAQ;QACvB,OAAO,mBAAW,CAAC,OAAO,CAAC;YACzB,MAAM,EAAE,qEAAqE;YAC7E,MAAM,EAAE,cAAM,CAAC,OAAO;SACvB,CAAC,CAAC;IACL,CAAC;IAED;;OAEG;IACI,6BAAK,GAAZ,UAAa,CAAU;QACrB,OAAO,mBAAW,CAAC,OAAO,CAAC,IAAI,CAAC,CAAC;IACnC,CAAC;IACH,oBAAC;AAAD,CAAC,AAjBD,IAiBC;AAjBY,sCAAa","sourcesContent":["import { Event, Response, Status, Transport } from '@sentry/types';\nimport { SyncPromise } from '@sentry/utils';\n\n/** Noop transport */\nexport class NoopTransport implements Transport {\n  /**\n   * @inheritDoc\n   */\n  public sendEvent(_: Event): PromiseLike<Response> {\n    return SyncPromise.resolve({\n      reason: `NoopTransport: Event has been skipped because no Dsn is configured.`,\n      status: Status.Skipped,\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public close(_?: number): PromiseLike<boolean> {\n    return SyncPromise.resolve(true);\n  }\n}\n"]}export declare const SDK_VERSION = "6.0.0";
//# sourceMappingURL=version.d.ts.map{"version":3,"file":"version.d.ts","sourceRoot":"","sources":["../src/version.ts"],"names":[],"mappings":"AAAA,eAAO,MAAM,WAAW,UAAU,CAAC"}Object.defineProperty(exports, "__esModule", { value: true });
exports.SDK_VERSION = '6.0.0';
//# sourceMappingURL=version.js.map{"version":3,"file":"version.js","sourceRoot":"","sources":["../src/version.ts"],"names":[],"mappings":";AAAa,QAAA,WAAW,GAAG,OAAO,CAAC","sourcesContent":["export const SDK_VERSION = '6.0.0';\n"]}import { DsnLike, SdkMetadata } from '@sentry/types';
import { Dsn } from '@sentry/utils';
/**
 * Helper class to provide urls, headers and metadata that can be used to form
 * different types of requests to Sentry endpoints.
 * Supports both envelopes and regular event requests.
 **/
export declare class API {
    dsn: DsnLike;
    metadata: SdkMetadata;
    /** The internally used Dsn object. */
    private readonly _dsnObject;
    /** Create a new instance of API */
    constructor(dsn: DsnLike, metadata?: SdkMetadata);
    /** Returns the Dsn object. */
    getDsn(): Dsn;
    /** Returns the prefix to construct Sentry ingestion API endpoints. */
    getBaseApiEndpoint(): string;
    /** Returns the store endpoint URL. */
    getStoreEndpoint(): string;
    /**
     * Returns the store endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    getStoreEndpointWithUrlEncodedAuth(): string;
    /**
     * Returns the envelope endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    getEnvelopeEndpointWithUrlEncodedAuth(): string;
    /** Returns only the path component for the store endpoint. */
    getStoreEndpointPath(): string;
    /**
     * Returns an object that can be used in request headers.
     * This is needed for node and the old /store endpoint in sentry
     */
    getRequestHeaders(clientName: string, clientVersion: string): {
        [key: string]: string;
    };
    /** Returns the url to the report dialog endpoint. */
    getReportDialogEndpoint(dialogOptions?: {
        [key: string]: any;
        user?: {
            name?: string;
            email?: string;
        };
    }): string;
    /** Returns the envelope endpoint URL. */
    private _getEnvelopeEndpoint;
    /** Returns the ingest API endpoint for target. */
    private _getIngestEndpoint;
    /** Returns a URL-encoded string with auth config suitable for a query string. */
    private _encodedAuth;
}
//# sourceMappingURL=api.d.ts.map{"version":3,"file":"api.d.ts","sourceRoot":"","sources":["../src/api.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,OAAO,EAAE,WAAW,EAAE,MAAM,eAAe,CAAC;AACrD,OAAO,EAAE,GAAG,EAAa,MAAM,eAAe,CAAC;AAI/C;;;;IAII;AACJ,qBAAa,GAAG;IAIY,GAAG,EAAE,OAAO;IAAS,QAAQ,EAAE,WAAW;IAHpE,sCAAsC;IACtC,OAAO,CAAC,QAAQ,CAAC,UAAU,CAAM;IACjC,mCAAmC;gBACT,GAAG,EAAE,OAAO,EAAS,QAAQ,GAAE,WAAgB;IAIzE,8BAA8B;IACvB,MAAM,IAAI,GAAG;IAIpB,sEAAsE;IAC/D,kBAAkB,IAAI,MAAM;IAOnC,sCAAsC;IAC/B,gBAAgB,IAAI,MAAM;IAIjC;;;;OAIG;IACI,kCAAkC,IAAI,MAAM;IAInD;;;;OAIG;IACI,qCAAqC,IAAI,MAAM;IAItD,8DAA8D;IACvD,oBAAoB,IAAI,MAAM;IAKrC;;;OAGG;IACI,iBAAiB,CAAC,UAAU,EAAE,MAAM,EAAE,aAAa,EAAE,MAAM,GAAG;QAAE,CAAC,GAAG,EAAE,MAAM,GAAG,MAAM,CAAA;KAAE;IAe9F,qDAAqD;IAC9C,uBAAuB,CAC5B,aAAa,GAAE;QAEb,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAC;QACnB,IAAI,CAAC,EAAE;YAAE,IAAI,CAAC,EAAE,MAAM,CAAC;YAAC,KAAK,CAAC,EAAE,MAAM,CAAA;SAAE,CAAC;KACrC,GACL,MAAM;IAgCT,yCAAyC;IACzC,OAAO,CAAC,oBAAoB;IAI5B,kDAAkD;IAClD,OAAO,CAAC,kBAAkB;IAM1B,iFAAiF;IACjF,OAAO,CAAC,YAAY;CAUrB"}import { Dsn, urlEncode } from '@sentry/utils';
var SENTRY_API_VERSION = '7';
/**
 * Helper class to provide urls, headers and metadata that can be used to form
 * different types of requests to Sentry endpoints.
 * Supports both envelopes and regular event requests.
 **/
var API = /** @class */ (function () {
    /** Create a new instance of API */
    function API(dsn, metadata) {
        if (metadata === void 0) { metadata = {}; }
        this.dsn = dsn;
        this.metadata = metadata;
        this._dsnObject = new Dsn(dsn);
    }
    /** Returns the Dsn object. */
    API.prototype.getDsn = function () {
        return this._dsnObject;
    };
    /** Returns the prefix to construct Sentry ingestion API endpoints. */
    API.prototype.getBaseApiEndpoint = function () {
        var dsn = this._dsnObject;
        var protocol = dsn.protocol ? dsn.protocol + ":" : '';
        var port = dsn.port ? ":" + dsn.port : '';
        return protocol + "//" + dsn.host + port + (dsn.path ? "/" + dsn.path : '') + "/api/";
    };
    /** Returns the store endpoint URL. */
    API.prototype.getStoreEndpoint = function () {
        return this._getIngestEndpoint('store');
    };
    /**
     * Returns the store endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getStoreEndpointWithUrlEncodedAuth = function () {
        return this.getStoreEndpoint() + "?" + this._encodedAuth();
    };
    /**
     * Returns the envelope endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getEnvelopeEndpointWithUrlEncodedAuth = function () {
        return this._getEnvelopeEndpoint() + "?" + this._encodedAuth();
    };
    /** Returns only the path component for the store endpoint. */
    API.prototype.getStoreEndpointPath = function () {
        var dsn = this._dsnObject;
        return (dsn.path ? "/" + dsn.path : '') + "/api/" + dsn.projectId + "/store/";
    };
    /**
     * Returns an object that can be used in request headers.
     * This is needed for node and the old /store endpoint in sentry
     */
    API.prototype.getRequestHeaders = function (clientName, clientVersion) {
        // CHANGE THIS to use metadata but keep clientName and clientVersion compatible
        var dsn = this._dsnObject;
        var header = ["Sentry sentry_version=" + SENTRY_API_VERSION];
        header.push("sentry_client=" + clientName + "/" + clientVersion);
        header.push("sentry_key=" + dsn.user);
        if (dsn.pass) {
            header.push("sentry_secret=" + dsn.pass);
        }
        return {
            'Content-Type': 'application/json',
            'X-Sentry-Auth': header.join(', '),
        };
    };
    /** Returns the url to the report dialog endpoint. */
    API.prototype.getReportDialogEndpoint = function (dialogOptions) {
        if (dialogOptions === void 0) { dialogOptions = {}; }
        var dsn = this._dsnObject;
        var endpoint = this.getBaseApiEndpoint() + "embed/error-page/";
        var encodedOptions = [];
        encodedOptions.push("dsn=" + dsn.toString());
        for (var key in dialogOptions) {
            if (key === 'dsn') {
                continue;
            }
            if (key === 'user') {
                if (!dialogOptions.user) {
                    continue;
                }
                if (dialogOptions.user.name) {
                    encodedOptions.push("name=" + encodeURIComponent(dialogOptions.user.name));
                }
                if (dialogOptions.user.email) {
                    encodedOptions.push("email=" + encodeURIComponent(dialogOptions.user.email));
                }
            }
            else {
                encodedOptions.push(encodeURIComponent(key) + "=" + encodeURIComponent(dialogOptions[key]));
            }
        }
        if (encodedOptions.length) {
            return endpoint + "?" + encodedOptions.join('&');
        }
        return endpoint;
    };
    /** Returns the envelope endpoint URL. */
    API.prototype._getEnvelopeEndpoint = function () {
        return this._getIngestEndpoint('envelope');
    };
    /** Returns the ingest API endpoint for target. */
    API.prototype._getIngestEndpoint = function (target) {
        var base = this.getBaseApiEndpoint();
        var dsn = this._dsnObject;
        return "" + base + dsn.projectId + "/" + target + "/";
    };
    /** Returns a URL-encoded string with auth config suitable for a query string. */
    API.prototype._encodedAuth = function () {
        var dsn = this._dsnObject;
        var auth = {
            // We send only the minimum set of required information. See
            // https://github.com/getsentry/sentry-javascript/issues/2572.
            sentry_key: dsn.user,
            sentry_version: SENTRY_API_VERSION,
        };
        return urlEncode(auth);
    };
    return API;
}());
export { API };
//# sourceMappingURL=api.js.map{"version":3,"file":"api.js","sourceRoot":"","sources":["../src/api.ts"],"names":[],"mappings":"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","sourcesContent":["import { DsnLike, SdkMetadata } from '@sentry/types';\nimport { Dsn, urlEncode } from '@sentry/utils';\n\nconst SENTRY_API_VERSION = '7';\n\n/**\n * Helper class to provide urls, headers and metadata that can be used to form\n * different types of requests to Sentry endpoints.\n * Supports both envelopes and regular event requests.\n **/\nexport class API {\n  /** The internally used Dsn object. */\n  private readonly _dsnObject: Dsn;\n  /** Create a new instance of API */\n  public constructor(public dsn: DsnLike, public metadata: SdkMetadata = {}) {\n    this._dsnObject = new Dsn(dsn);\n  }\n\n  /** Returns the Dsn object. */\n  public getDsn(): Dsn {\n    return this._dsnObject;\n  }\n\n  /** Returns the prefix to construct Sentry ingestion API endpoints. */\n  public getBaseApiEndpoint(): string {\n    const dsn = this._dsnObject;\n    const protocol = dsn.protocol ? `${dsn.protocol}:` : '';\n    const port = dsn.port ? `:${dsn.port}` : '';\n    return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ''}/api/`;\n  }\n\n  /** Returns the store endpoint URL. */\n  public getStoreEndpoint(): string {\n    return this._getIngestEndpoint('store');\n  }\n\n  /**\n   * Returns the store endpoint URL with auth in the query string.\n   *\n   * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.\n   */\n  public getStoreEndpointWithUrlEncodedAuth(): string {\n    return `${this.getStoreEndpoint()}?${this._encodedAuth()}`;\n  }\n\n  /**\n   * Returns the envelope endpoint URL with auth in the query string.\n   *\n   * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.\n   */\n  public getEnvelopeEndpointWithUrlEncodedAuth(): string {\n    return `${this._getEnvelopeEndpoint()}?${this._encodedAuth()}`;\n  }\n\n  /** Returns only the path component for the store endpoint. */\n  public getStoreEndpointPath(): string {\n    const dsn = this._dsnObject;\n    return `${dsn.path ? `/${dsn.path}` : ''}/api/${dsn.projectId}/store/`;\n  }\n\n  /**\n   * Returns an object that can be used in request headers.\n   * This is needed for node and the old /store endpoint in sentry\n   */\n  public getRequestHeaders(clientName: string, clientVersion: string): { [key: string]: string } {\n    // CHANGE THIS to use metadata but keep clientName and clientVersion compatible\n    const dsn = this._dsnObject;\n    const header = [`Sentry sentry_version=${SENTRY_API_VERSION}`];\n    header.push(`sentry_client=${clientName}/${clientVersion}`);\n    header.push(`sentry_key=${dsn.user}`);\n    if (dsn.pass) {\n      header.push(`sentry_secret=${dsn.pass}`);\n    }\n    return {\n      'Content-Type': 'application/json',\n      'X-Sentry-Auth': header.join(', '),\n    };\n  }\n\n  /** Returns the url to the report dialog endpoint. */\n  public getReportDialogEndpoint(\n    dialogOptions: {\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      [key: string]: any;\n      user?: { name?: string; email?: string };\n    } = {},\n  ): string {\n    const dsn = this._dsnObject;\n    const endpoint = `${this.getBaseApiEndpoint()}embed/error-page/`;\n\n    const encodedOptions = [];\n    encodedOptions.push(`dsn=${dsn.toString()}`);\n    for (const key in dialogOptions) {\n      if (key === 'dsn') {\n        continue;\n      }\n\n      if (key === 'user') {\n        if (!dialogOptions.user) {\n          continue;\n        }\n        if (dialogOptions.user.name) {\n          encodedOptions.push(`name=${encodeURIComponent(dialogOptions.user.name)}`);\n        }\n        if (dialogOptions.user.email) {\n          encodedOptions.push(`email=${encodeURIComponent(dialogOptions.user.email)}`);\n        }\n      } else {\n        encodedOptions.push(`${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key] as string)}`);\n      }\n    }\n    if (encodedOptions.length) {\n      return `${endpoint}?${encodedOptions.join('&')}`;\n    }\n\n    return endpoint;\n  }\n\n  /** Returns the envelope endpoint URL. */\n  private _getEnvelopeEndpoint(): string {\n    return this._getIngestEndpoint('envelope');\n  }\n\n  /** Returns the ingest API endpoint for target. */\n  private _getIngestEndpoint(target: 'store' | 'envelope'): string {\n    const base = this.getBaseApiEndpoint();\n    const dsn = this._dsnObject;\n    return `${base}${dsn.projectId}/${target}/`;\n  }\n\n  /** Returns a URL-encoded string with auth config suitable for a query string. */\n  private _encodedAuth(): string {\n    const dsn = this._dsnObject;\n    const auth = {\n      // We send only the minimum set of required information. See\n      // https://github.com/getsentry/sentry-javascript/issues/2572.\n      sentry_key: dsn.user,\n      sentry_version: SENTRY_API_VERSION,\n    };\n    return urlEncode(auth);\n  }\n}\n"]}import { Event, EventHint, Options, Session, Severity, Transport } from '@sentry/types';
/**
 * Internal platform-dependent Sentry SDK Backend.
 *
 * While {@link Client} contains business logic specific to an SDK, the
 * Backend offers platform specific implementations for low-level operations.
 * These are persisting and loading information, sending events, and hooking
 * into the environment.
 *
 * Backends receive a handle to the Client in their constructor. When a
 * Backend automatically generates events, it must pass them to
 * the Client for validation and processing first.
 *
 * Usually, the Client will be of corresponding type, e.g. NodeBackend
 * receives NodeClient. However, higher-level SDKs can choose to instantiate
 * multiple Backends and delegate tasks between them. In this case, an event
 * generated by one backend might very well be sent by another one.
 *
 * The client also provides access to options via {@link Client.getOptions}.
 * @hidden
 */
export interface Backend {
    /** Creates a {@link Event} from an exception. */
    eventFromException(exception: any, hint?: EventHint): PromiseLike<Event>;
    /** Creates a {@link Event} from a plain message. */
    eventFromMessage(message: string, level?: Severity, hint?: EventHint): PromiseLike<Event>;
    /** Submits the event to Sentry */
    sendEvent(event: Event): void;
    /** Submits the session to Sentry */
    sendSession(session: Session): void;
    /**
     * Returns the transport that is used by the backend.
     * Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.
     *
     * @returns The transport.
     */
    getTransport(): Transport;
}
/**
 * A class object that can instantiate Backend objects.
 * @hidden
 */
export declare type BackendClass<B extends Backend, O extends Options> = new (options: O) => B;
/**
 * This is the base implemention of a Backend.
 * @hidden
 */
export declare abstract class BaseBackend<O extends Options> implements Backend {
    /** Options passed to the SDK. */
    protected readonly _options: O;
    /** Cached transport used internally. */
    protected _transport: Transport;
    /** Creates a new backend instance. */
    constructor(options: O);
    /**
     * @inheritDoc
     */
    eventFromException(_exception: any, _hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    eventFromMessage(_message: string, _level?: Severity, _hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    sendEvent(event: Event): void;
    /**
     * @inheritDoc
     */
    sendSession(session: Session): void;
    /**
     * @inheritDoc
     */
    getTransport(): Transport;
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    protected _setupTransport(): Transport;
}
//# sourceMappingURL=basebackend.d.ts.map{"version":3,"file":"basebackend.d.ts","sourceRoot":"","sources":["../src/basebackend.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,KAAK,EAAE,SAAS,EAAE,OAAO,EAAE,OAAO,EAAE,QAAQ,EAAE,SAAS,EAAE,MAAM,eAAe,CAAC;AAKxF;;;;;;;;;;;;;;;;;;;GAmBG;AACH,MAAM,WAAW,OAAO;IACtB,iDAAiD;IAEjD,kBAAkB,CAAC,SAAS,EAAE,GAAG,EAAE,IAAI,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC,CAAC;IAEzE,oDAAoD;IACpD,gBAAgB,CAAC,OAAO,EAAE,MAAM,EAAE,KAAK,CAAC,EAAE,QAAQ,EAAE,IAAI,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC,CAAC;IAE1F,kCAAkC;IAClC,SAAS,CAAC,KAAK,EAAE,KAAK,GAAG,IAAI,CAAC;IAE9B,oCAAoC;IACpC,WAAW,CAAC,OAAO,EAAE,OAAO,GAAG,IAAI,CAAC;IAEpC;;;;;OAKG;IACH,YAAY,IAAI,SAAS,CAAC;CAC3B;AAED;;;GAGG;AACH,oBAAY,YAAY,CAAC,CAAC,SAAS,OAAO,EAAE,CAAC,SAAS,OAAO,IAAI,KAAK,OAAO,EAAE,CAAC,KAAK,CAAC,CAAC;AAEvF;;;GAGG;AACH,8BAAsB,WAAW,CAAC,CAAC,SAAS,OAAO,CAAE,YAAW,OAAO;IACrE,iCAAiC;IACjC,SAAS,CAAC,QAAQ,CAAC,QAAQ,EAAE,CAAC,CAAC;IAE/B,wCAAwC;IACxC,SAAS,CAAC,UAAU,EAAE,SAAS,CAAC;IAEhC,sCAAsC;gBACnB,OAAO,EAAE,CAAC;IAQ7B;;OAEG;IAEI,kBAAkB,CAAC,UAAU,EAAE,GAAG,EAAE,KAAK,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC;IAIjF;;OAEG;IACI,gBAAgB,CAAC,QAAQ,EAAE,MAAM,EAAE,MAAM,CAAC,EAAE,QAAQ,EAAE,KAAK,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,CAAC;IAInG;;OAEG;IACI,SAAS,CAAC,KAAK,EAAE,KAAK,GAAG,IAAI;IAMpC;;OAEG;IACI,WAAW,CAAC,OAAO,EAAE,OAAO,GAAG,IAAI;IAW1C;;OAEG;IACI,YAAY,IAAI,SAAS;IAIhC;;OAEG;IACH,SAAS,CAAC,eAAe,IAAI,SAAS;CAGvC"}import { logger, SentryError } from '@sentry/utils';
import { NoopTransport } from './transports/noop';
/**
 * This is the base implemention of a Backend.
 * @hidden
 */
var BaseBackend = /** @class */ (function () {
    /** Creates a new backend instance. */
    function BaseBackend(options) {
        this._options = options;
        if (!this._options.dsn) {
            logger.warn('No DSN provided, backend will not do anything.');
        }
        this._transport = this._setupTransport();
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseBackend.prototype.eventFromException = function (_exception, _hint) {
        throw new SentryError('Backend has to implement `eventFromException` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromMessage = function (_message, _level, _hint) {
        throw new SentryError('Backend has to implement `eventFromMessage` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendEvent = function (event) {
        this._transport.sendEvent(event).then(null, function (reason) {
            logger.error("Error while sending event: " + reason);
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendSession = function (session) {
        if (!this._transport.sendSession) {
            logger.warn("Dropping session because custom transport doesn't implement sendSession");
            return;
        }
        this._transport.sendSession(session).then(null, function (reason) {
            logger.error("Error while sending session: " + reason);
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.getTransport = function () {
        return this._transport;
    };
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    BaseBackend.prototype._setupTransport = function () {
        return new NoopTransport();
    };
    return BaseBackend;
}());
export { BaseBackend };
//# sourceMappingURL=basebackend.js.map{"version":3,"file":"basebackend.js","sourceRoot":"","sources":["../src/basebackend.ts"],"names":[],"mappings":"AACA,OAAO,EAAE,MAAM,EAAE,WAAW,EAAE,MAAM,eAAe,CAAC;AAEpD,OAAO,EAAE,aAAa,EAAE,MAAM,mBAAmB,CAAC;AAmDlD;;;GAGG;AACH;IAOE,sCAAsC;IACtC,qBAAmB,OAAU;QAC3B,IAAI,CAAC,QAAQ,GAAG,OAAO,CAAC;QACxB,IAAI,CAAC,IAAI,CAAC,QAAQ,CAAC,GAAG,EAAE;YACtB,MAAM,CAAC,IAAI,CAAC,gDAAgD,CAAC,CAAC;SAC/D;QACD,IAAI,CAAC,UAAU,GAAG,IAAI,CAAC,eAAe,EAAE,CAAC;IAC3C,CAAC;IAED;;OAEG;IACH,iHAAiH;IAC1G,wCAAkB,GAAzB,UAA0B,UAAe,EAAE,KAAiB;QAC1D,MAAM,IAAI,WAAW,CAAC,sDAAsD,CAAC,CAAC;IAChF,CAAC;IAED;;OAEG;IACI,sCAAgB,GAAvB,UAAwB,QAAgB,EAAE,MAAiB,EAAE,KAAiB;QAC5E,MAAM,IAAI,WAAW,CAAC,oDAAoD,CAAC,CAAC;IAC9E,CAAC;IAED;;OAEG;IACI,+BAAS,GAAhB,UAAiB,KAAY;QAC3B,IAAI,CAAC,UAAU,CAAC,SAAS,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,IAAI,EAAE,UAAA,MAAM;YAChD,MAAM,CAAC,KAAK,CAAC,gCAA8B,MAAQ,CAAC,CAAC;QACvD,CAAC,CAAC,CAAC;IACL,CAAC;IAED;;OAEG;IACI,iCAAW,GAAlB,UAAmB,OAAgB;QACjC,IAAI,CAAC,IAAI,CAAC,UAAU,CAAC,WAAW,EAAE;YAChC,MAAM,CAAC,IAAI,CAAC,yEAAyE,CAAC,CAAC;YACvF,OAAO;SACR;QAED,IAAI,CAAC,UAAU,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,IAAI,EAAE,UAAA,MAAM;YACpD,MAAM,CAAC,KAAK,CAAC,kCAAgC,MAAQ,CAAC,CAAC;QACzD,CAAC,CAAC,CAAC;IACL,CAAC;IAED;;OAEG;IACI,kCAAY,GAAnB;QACE,OAAO,IAAI,CAAC,UAAU,CAAC;IACzB,CAAC;IAED;;OAEG;IACO,qCAAe,GAAzB;QACE,OAAO,IAAI,aAAa,EAAE,CAAC;IAC7B,CAAC;IACH,kBAAC;AAAD,CAAC,AAnED,IAmEC","sourcesContent":["import { Event, EventHint, Options, Session, Severity, Transport } from '@sentry/types';\nimport { logger, SentryError } from '@sentry/utils';\n\nimport { NoopTransport } from './transports/noop';\n\n/**\n * Internal platform-dependent Sentry SDK Backend.\n *\n * While {@link Client} contains business logic specific to an SDK, the\n * Backend offers platform specific implementations for low-level operations.\n * These are persisting and loading information, sending events, and hooking\n * into the environment.\n *\n * Backends receive a handle to the Client in their constructor. When a\n * Backend automatically generates events, it must pass them to\n * the Client for validation and processing first.\n *\n * Usually, the Client will be of corresponding type, e.g. NodeBackend\n * receives NodeClient. However, higher-level SDKs can choose to instantiate\n * multiple Backends and delegate tasks between them. In this case, an event\n * generated by one backend might very well be sent by another one.\n *\n * The client also provides access to options via {@link Client.getOptions}.\n * @hidden\n */\nexport interface Backend {\n  /** Creates a {@link Event} from an exception. */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  eventFromException(exception: any, hint?: EventHint): PromiseLike<Event>;\n\n  /** Creates a {@link Event} from a plain message. */\n  eventFromMessage(message: string, level?: Severity, hint?: EventHint): PromiseLike<Event>;\n\n  /** Submits the event to Sentry */\n  sendEvent(event: Event): void;\n\n  /** Submits the session to Sentry */\n  sendSession(session: Session): void;\n\n  /**\n   * Returns the transport that is used by the backend.\n   * Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.\n   *\n   * @returns The transport.\n   */\n  getTransport(): Transport;\n}\n\n/**\n * A class object that can instantiate Backend objects.\n * @hidden\n */\nexport type BackendClass<B extends Backend, O extends Options> = new (options: O) => B;\n\n/**\n * This is the base implemention of a Backend.\n * @hidden\n */\nexport abstract class BaseBackend<O extends Options> implements Backend {\n  /** Options passed to the SDK. */\n  protected readonly _options: O;\n\n  /** Cached transport used internally. */\n  protected _transport: Transport;\n\n  /** Creates a new backend instance. */\n  public constructor(options: O) {\n    this._options = options;\n    if (!this._options.dsn) {\n      logger.warn('No DSN provided, backend will not do anything.');\n    }\n    this._transport = this._setupTransport();\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  public eventFromException(_exception: any, _hint?: EventHint): PromiseLike<Event> {\n    throw new SentryError('Backend has to implement `eventFromException` method');\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public eventFromMessage(_message: string, _level?: Severity, _hint?: EventHint): PromiseLike<Event> {\n    throw new SentryError('Backend has to implement `eventFromMessage` method');\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public sendEvent(event: Event): void {\n    this._transport.sendEvent(event).then(null, reason => {\n      logger.error(`Error while sending event: ${reason}`);\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public sendSession(session: Session): void {\n    if (!this._transport.sendSession) {\n      logger.warn(\"Dropping session because custom transport doesn't implement sendSession\");\n      return;\n    }\n\n    this._transport.sendSession(session).then(null, reason => {\n      logger.error(`Error while sending session: ${reason}`);\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getTransport(): Transport {\n    return this._transport;\n  }\n\n  /**\n   * Sets up the transport so it can be used later to send requests.\n   */\n  protected _setupTransport(): Transport {\n    return new NoopTransport();\n  }\n}\n"]}import { Scope, Session } from '@sentry/hub';
import { Client, Event, EventHint, Integration, IntegrationClass, Options, Severity } from '@sentry/types';
import { Dsn } from '@sentry/utils';
import { Backend, BackendClass } from './basebackend';
import { IntegrationIndex } from './integration';
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding backend constructor and options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}. Also, the Backend instance is available via
 * {@link Client.getBackend}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event via the backend, it is passed through
 * {@link BaseClient.prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(NodeBackend, options);
 *   }
 *
 *   // ...
 * }
 */
export declare abstract class BaseClient<B extends Backend, O extends Options> implements Client<O> {
    /**
     * The backend used to physically interact in the environment. Usually, this
     * will correspond to the client. When composing SDKs, however, the Backend
     * from the root SDK will be used.
     */
    protected readonly _backend: B;
    /** Options passed to the SDK. */
    protected readonly _options: O;
    /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
    protected readonly _dsn?: Dsn;
    /** Array of used integrations. */
    protected _integrations: IntegrationIndex;
    /** Number of call being processed */
    protected _processing: number;
    /**
     * Initializes this client instance.
     *
     * @param backendClass A constructor function to create the backend.
     * @param options Options for the client.
     */
    protected constructor(backendClass: BackendClass<B, O>, options: O);
    /**
     * @inheritDoc
     */
    captureException(exception: any, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureMessage(message: string, level?: Severity, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureSession(session: Session): void;
    /**
     * @inheritDoc
     */
    getDsn(): Dsn | undefined;
    /**
     * @inheritDoc
     */
    getOptions(): O;
    /**
     * @inheritDoc
     */
    flush(timeout?: number): PromiseLike<boolean>;
    /**
     * @inheritDoc
     */
    close(timeout?: number): PromiseLike<boolean>;
    /**
     * Sets up the integrations
     */
    setupIntegrations(): void;
    /**
     * @inheritDoc
     */
    getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null;
    /** Updates existing session based on the provided event */
    protected _updateSessionFromEvent(session: Session, event: Event): void;
    /** Deliver captured session to Sentry */
    protected _sendSession(session: Session): void;
    /** Waits for the client to be done with processing. */
    protected _isClientProcessing(timeout?: number): PromiseLike<boolean>;
    /** Returns the current backend. */
    protected _getBackend(): B;
    /** Determines whether this SDK is enabled and a valid Dsn is present. */
    protected _isEnabled(): boolean;
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * @param event The original event.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): PromiseLike<Event | null>;
    /**
     * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
     * Normalized keys:
     * - `breadcrumbs.data`
     * - `user`
     * - `contexts`
     * - `extra`
     * @param event Event
     * @returns Normalized event
     */
    protected _normalizeEvent(event: Event | null, depth: number): Event | null;
    /**
     *  Enhances event using the client configuration.
     *  It takes care of all "static" values like environment, release and `dist`,
     *  as well as truncating overly long values.
     * @param event event instance to be enhanced
     */
    protected _applyClientOptions(event: Event): void;
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.
     */
    protected _applyIntegrationsMetadata(event: Event): void;
    /**
     * Tells the backend to send this event
     * @param event The Sentry event to send
     */
    protected _sendEvent(event: Event): void;
    /**
     * Processes the event and logs an error in case of rejection
     * @param event
     * @param hint
     * @param scope
     */
    protected _captureEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<string | undefined>;
    /**
     * Processes an event (either error or message) and sends it to Sentry.
     *
     * This also adds breadcrumbs and context information to the event. However,
     * platform specific meta data (such as the User's IP address) must be added
     * by the SDK implementor.
     *
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    protected _processEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<Event>;
    /**
     * Occupies the client with processing and event
     */
    protected _process<T>(promise: PromiseLike<T>): void;
}
//# sourceMappingURL=baseclient.d.ts.map{"version":3,"file":"baseclient.d.ts","sourceRoot":"","sources":["../src/baseclient.ts"],"names":[],"mappings":"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"}import { __assign, __values } from "tslib";
/* eslint-disable max-lines */
import { Scope } from '@sentry/hub';
import { SessionStatus, } from '@sentry/types';
import { dateTimestampInSeconds, Dsn, isPrimitive, isThenable, logger, normalize, SentryError, SyncPromise, truncate, uuid4, } from '@sentry/utils';
import { setupIntegrations } from './integration';
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding backend constructor and options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}. Also, the Backend instance is available via
 * {@link Client.getBackend}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event via the backend, it is passed through
 * {@link BaseClient.prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(NodeBackend, options);
 *   }
 *
 *   // ...
 * }
 */
var BaseClient = /** @class */ (function () {
    /**
     * Initializes this client instance.
     *
     * @param backendClass A constructor function to create the backend.
     * @param options Options for the client.
     */
    function BaseClient(backendClass, options) {
        /** Array of used integrations. */
        this._integrations = {};
        /** Number of call being processed */
        this._processing = 0;
        this._backend = new backendClass(options);
        this._options = options;
        if (options.dsn) {
            this._dsn = new Dsn(options.dsn);
        }
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseClient.prototype.captureException = function (exception, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        this._process(this._getBackend()
            .eventFromException(exception, hint)
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureMessage = function (message, level, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        var promisedEvent = isPrimitive(message)
            ? this._getBackend().eventFromMessage(String(message), level, hint)
            : this._getBackend().eventFromException(message, hint);
        this._process(promisedEvent
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureEvent = function (event, hint, scope) {
        var eventId = hint && hint.event_id;
        this._process(this._captureEvent(event, hint, scope).then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureSession = function (session) {
        if (!session.release) {
            logger.warn('Discarded session because of missing release');
        }
        else {
            this._sendSession(session);
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getDsn = function () {
        return this._dsn;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getOptions = function () {
        return this._options;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.flush = function (timeout) {
        var _this = this;
        return this._isClientProcessing(timeout).then(function (ready) {
            return _this._getBackend()
                .getTransport()
                .close(timeout)
                .then(function (transportFlushed) { return ready && transportFlushed; });
        });
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.close = function (timeout) {
        var _this = this;
        return this.flush(timeout).then(function (result) {
            _this.getOptions().enabled = false;
            return result;
        });
    };
    /**
     * Sets up the integrations
     */
    BaseClient.prototype.setupIntegrations = function () {
        if (this._isEnabled()) {
            this._integrations = setupIntegrations(this._options);
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getIntegration = function (integration) {
        try {
            return this._integrations[integration.id] || null;
        }
        catch (_oO) {
            logger.warn("Cannot retrieve integration " + integration.id + " from the current Client");
            return null;
        }
    };
    /** Updates existing session based on the provided event */
    BaseClient.prototype._updateSessionFromEvent = function (session, event) {
        var e_1, _a;
        var crashed = false;
        var errored = false;
        var userAgent;
        var exceptions = event.exception && event.exception.values;
        if (exceptions) {
            errored = true;
            try {
                for (var exceptions_1 = __values(exceptions), exceptions_1_1 = exceptions_1.next(); !exceptions_1_1.done; exceptions_1_1 = exceptions_1.next()) {
                    var ex = exceptions_1_1.value;
                    var mechanism = ex.mechanism;
                    if (mechanism && mechanism.handled === false) {
                        crashed = true;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (exceptions_1_1 && !exceptions_1_1.done && (_a = exceptions_1.return)) _a.call(exceptions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        var user = event.user;
        if (!session.userAgent) {
            var headers = event.request ? event.request.headers : {};
            for (var key in headers) {
                if (key.toLowerCase() === 'user-agent') {
                    userAgent = headers[key];
                    break;
                }
            }
        }
        session.update(__assign(__assign({}, (crashed && { status: SessionStatus.Crashed })), { user: user,
            userAgent: userAgent, errors: session.errors + Number(errored || crashed) }));
    };
    /** Deliver captured session to Sentry */
    BaseClient.prototype._sendSession = function (session) {
        this._getBackend().sendSession(session);
    };
    /** Waits for the client to be done with processing. */
    BaseClient.prototype._isClientProcessing = function (timeout) {
        var _this = this;
        return new SyncPromise(function (resolve) {
            var ticked = 0;
            var tick = 1;
            var interval = setInterval(function () {
                if (_this._processing == 0) {
                    clearInterval(interval);
                    resolve(true);
                }
                else {
                    ticked += tick;
                    if (timeout && ticked >= timeout) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }
            }, tick);
        });
    };
    /** Returns the current backend. */
    BaseClient.prototype._getBackend = function () {
        return this._backend;
    };
    /** Determines whether this SDK is enabled and a valid Dsn is present. */
    BaseClient.prototype._isEnabled = function () {
        return this.getOptions().enabled !== false && this._dsn !== undefined;
    };
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * @param event The original event.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    BaseClient.prototype._prepareEvent = function (event, scope, hint) {
        var _this = this;
        var _a = this.getOptions().normalizeDepth, normalizeDepth = _a === void 0 ? 3 : _a;
        var prepared = __assign(__assign({}, event), { event_id: event.event_id || (hint && hint.event_id ? hint.event_id : uuid4()), timestamp: event.timestamp || dateTimestampInSeconds() });
        this._applyClientOptions(prepared);
        this._applyIntegrationsMetadata(prepared);
        // If we have scope given to us, use it as the base for further modifications.
        // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
        var finalScope = scope;
        if (hint && hint.captureContext) {
            finalScope = Scope.clone(finalScope).update(hint.captureContext);
        }
        // We prepare the result here with a resolved Event.
        var result = SyncPromise.resolve(prepared);
        // This should be the last thing called, since we want that
        // {@link Hub.addEventProcessor} gets the finished prepared event.
        if (finalScope) {
            // In case we have a hub we reassign it.
            result = finalScope.applyToEvent(prepared, hint);
        }
        return result.then(function (evt) {
            if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
                return _this._normalizeEvent(evt, normalizeDepth);
            }
            return evt;
        });
    };
    /**
     * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
     * Normalized keys:
     * - `breadcrumbs.data`
     * - `user`
     * - `contexts`
     * - `extra`
     * @param event Event
     * @returns Normalized event
     */
    BaseClient.prototype._normalizeEvent = function (event, depth) {
        if (!event) {
            return null;
        }
        var normalized = __assign(__assign(__assign(__assign(__assign({}, event), (event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map(function (b) { return (__assign(__assign({}, b), (b.data && {
                data: normalize(b.data, depth),
            }))); }),
        })), (event.user && {
            user: normalize(event.user, depth),
        })), (event.contexts && {
            contexts: normalize(event.contexts, depth),
        })), (event.extra && {
            extra: normalize(event.extra, depth),
        }));
        // event.contexts.trace stores information about a Transaction. Similarly,
        // event.spans[] stores information about child Spans. Given that a
        // Transaction is conceptually a Span, normalization should apply to both
        // Transactions and Spans consistently.
        // For now the decision is to skip normalization of Transactions and Spans,
        // so this block overwrites the normalized event to add back the original
        // Transaction information prior to normalization.
        if (event.contexts && event.contexts.trace) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            normalized.contexts.trace = event.contexts.trace;
        }
        return normalized;
    };
    /**
     *  Enhances event using the client configuration.
     *  It takes care of all "static" values like environment, release and `dist`,
     *  as well as truncating overly long values.
     * @param event event instance to be enhanced
     */
    BaseClient.prototype._applyClientOptions = function (event) {
        var options = this.getOptions();
        var environment = options.environment, release = options.release, dist = options.dist, _a = options.maxValueLength, maxValueLength = _a === void 0 ? 250 : _a;
        if (!('environment' in event)) {
            event.environment = 'environment' in options ? environment : 'production';
        }
        if (event.release === undefined && release !== undefined) {
            event.release = release;
        }
        if (event.dist === undefined && dist !== undefined) {
            event.dist = dist;
        }
        if (event.message) {
            event.message = truncate(event.message, maxValueLength);
        }
        var exception = event.exception && event.exception.values && event.exception.values[0];
        if (exception && exception.value) {
            exception.value = truncate(exception.value, maxValueLength);
        }
        var request = event.request;
        if (request && request.url) {
            request.url = truncate(request.url, maxValueLength);
        }
    };
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.
     */
    BaseClient.prototype._applyIntegrationsMetadata = function (event) {
        var sdkInfo = event.sdk;
        var integrationsArray = Object.keys(this._integrations);
        if (sdkInfo && integrationsArray.length > 0) {
            sdkInfo.integrations = integrationsArray;
        }
    };
    /**
     * Tells the backend to send this event
     * @param event The Sentry event to send
     */
    BaseClient.prototype._sendEvent = function (event) {
        this._getBackend().sendEvent(event);
    };
    /**
     * Processes the event and logs an error in case of rejection
     * @param event
     * @param hint
     * @param scope
     */
    BaseClient.prototype._captureEvent = function (event, hint, scope) {
        return this._processEvent(event, hint, scope).then(function (finalEvent) {
            return finalEvent.event_id;
        }, function (reason) {
            logger.error(reason);
            return undefined;
        });
    };
    /**
     * Processes an event (either error or message) and sends it to Sentry.
     *
     * This also adds breadcrumbs and context information to the event. However,
     * platform specific meta data (such as the User's IP address) must be added
     * by the SDK implementor.
     *
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    BaseClient.prototype._processEvent = function (event, hint, scope) {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _a = this.getOptions(), beforeSend = _a.beforeSend, sampleRate = _a.sampleRate;
        if (!this._isEnabled()) {
            return SyncPromise.reject(new SentryError('SDK not enabled, will not send event.'));
        }
        var isTransaction = event.type === 'transaction';
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {
            return SyncPromise.reject(new SentryError("Discarding event because it's not included in the random sample (sampling rate = " + sampleRate + ")"));
        }
        return this._prepareEvent(event, scope, hint)
            .then(function (prepared) {
            if (prepared === null) {
                throw new SentryError('An event processor returned null, will not send event.');
            }
            var isInternalException = hint && hint.data && hint.data.__sentry__ === true;
            if (isInternalException || isTransaction || !beforeSend) {
                return prepared;
            }
            var beforeSendResult = beforeSend(prepared, hint);
            if (typeof beforeSendResult === 'undefined') {
                throw new SentryError('`beforeSend` method has to return `null` or a valid event.');
            }
            else if (isThenable(beforeSendResult)) {
                return beforeSendResult.then(function (event) { return event; }, function (e) {
                    throw new SentryError("beforeSend rejected with " + e);
                });
            }
            return beforeSendResult;
        })
            .then(function (processedEvent) {
            if (processedEvent === null) {
                throw new SentryError('`beforeSend` returned `null`, will not send event.');
            }
            var session = scope && scope.getSession && scope.getSession();
            if (!isTransaction && session) {
                _this._updateSessionFromEvent(session, processedEvent);
            }
            _this._sendEvent(processedEvent);
            return processedEvent;
        })
            .then(null, function (reason) {
            if (reason instanceof SentryError) {
                throw reason;
            }
            _this.captureException(reason, {
                data: {
                    __sentry__: true,
                },
                originalException: reason,
            });
            throw new SentryError("Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: " + reason);
        });
    };
    /**
     * Occupies the client with processing and event
     */
    BaseClient.prototype._process = function (promise) {
        var _this = this;
        this._processing += 1;
        promise.then(function (value) {
            _this._processing -= 1;
            return value;
        }, function (reason) {
            _this._processing -= 1;
            return reason;
        });
    };
    return BaseClient;
}());
export { BaseClient };
//# sourceMappingURL=baseclient.js.map{"version":3,"file":"baseclient.js","sourceRoot":"","sources":["../src/baseclient.ts"],"names":[],"mappings":"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","sourcesContent":["/* eslint-disable max-lines */\nimport { Scope, Session } from '@sentry/hub';\nimport {\n  Client,\n  Event,\n  EventHint,\n  Integration,\n  IntegrationClass,\n  Options,\n  SessionStatus,\n  Severity,\n} from '@sentry/types';\nimport {\n  dateTimestampInSeconds,\n  Dsn,\n  isPrimitive,\n  isThenable,\n  logger,\n  normalize,\n  SentryError,\n  SyncPromise,\n  truncate,\n  uuid4,\n} from '@sentry/utils';\n\nimport { Backend, BackendClass } from './basebackend';\nimport { IntegrationIndex, setupIntegrations } from './integration';\n\n/**\n * Base implementation for all JavaScript SDK clients.\n *\n * Call the constructor with the corresponding backend constructor and options\n * specific to the client subclass. To access these options later, use\n * {@link Client.getOptions}. Also, the Backend instance is available via\n * {@link Client.getBackend}.\n *\n * If a Dsn is specified in the options, it will be parsed and stored. Use\n * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is\n * invalid, the constructor will throw a {@link SentryException}. Note that\n * without a valid Dsn, the SDK will not send any events to Sentry.\n *\n * Before sending an event via the backend, it is passed through\n * {@link BaseClient.prepareEvent} to add SDK information and scope data\n * (breadcrumbs and context). To add more custom information, override this\n * method and extend the resulting prepared event.\n *\n * To issue automatically created events (e.g. via instrumentation), use\n * {@link Client.captureEvent}. It will prepare the event and pass it through\n * the callback lifecycle. To issue auto-breadcrumbs, use\n * {@link Client.addBreadcrumb}.\n *\n * @example\n * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {\n *   public constructor(options: NodeOptions) {\n *     super(NodeBackend, options);\n *   }\n *\n *   // ...\n * }\n */\nexport abstract class BaseClient<B extends Backend, O extends Options> implements Client<O> {\n  /**\n   * The backend used to physically interact in the environment. Usually, this\n   * will correspond to the client. When composing SDKs, however, the Backend\n   * from the root SDK will be used.\n   */\n  protected readonly _backend: B;\n\n  /** Options passed to the SDK. */\n  protected readonly _options: O;\n\n  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */\n  protected readonly _dsn?: Dsn;\n\n  /** Array of used integrations. */\n  protected _integrations: IntegrationIndex = {};\n\n  /** Number of call being processed */\n  protected _processing: number = 0;\n\n  /**\n   * Initializes this client instance.\n   *\n   * @param backendClass A constructor function to create the backend.\n   * @param options Options for the client.\n   */\n  protected constructor(backendClass: BackendClass<B, O>, options: O) {\n    this._backend = new backendClass(options);\n    this._options = options;\n\n    if (options.dsn) {\n      this._dsn = new Dsn(options.dsn);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  public captureException(exception: any, hint?: EventHint, scope?: Scope): string | undefined {\n    let eventId: string | undefined = hint && hint.event_id;\n\n    this._process(\n      this._getBackend()\n        .eventFromException(exception, hint)\n        .then(event => this._captureEvent(event, hint, scope))\n        .then(result => {\n          eventId = result;\n        }),\n    );\n\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureMessage(message: string, level?: Severity, hint?: EventHint, scope?: Scope): string | undefined {\n    let eventId: string | undefined = hint && hint.event_id;\n\n    const promisedEvent = isPrimitive(message)\n      ? this._getBackend().eventFromMessage(String(message), level, hint)\n      : this._getBackend().eventFromException(message, hint);\n\n    this._process(\n      promisedEvent\n        .then(event => this._captureEvent(event, hint, scope))\n        .then(result => {\n          eventId = result;\n        }),\n    );\n\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureEvent(event: Event, hint?: EventHint, scope?: Scope): string | undefined {\n    let eventId: string | undefined = hint && hint.event_id;\n\n    this._process(\n      this._captureEvent(event, hint, scope).then(result => {\n        eventId = result;\n      }),\n    );\n\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureSession(session: Session): void {\n    if (!session.release) {\n      logger.warn('Discarded session because of missing release');\n    } else {\n      this._sendSession(session);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getDsn(): Dsn | undefined {\n    return this._dsn;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getOptions(): O {\n    return this._options;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public flush(timeout?: number): PromiseLike<boolean> {\n    return this._isClientProcessing(timeout).then(ready => {\n      return this._getBackend()\n        .getTransport()\n        .close(timeout)\n        .then(transportFlushed => ready && transportFlushed);\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public close(timeout?: number): PromiseLike<boolean> {\n    return this.flush(timeout).then(result => {\n      this.getOptions().enabled = false;\n      return result;\n    });\n  }\n\n  /**\n   * Sets up the integrations\n   */\n  public setupIntegrations(): void {\n    if (this._isEnabled()) {\n      this._integrations = setupIntegrations(this._options);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null {\n    try {\n      return (this._integrations[integration.id] as T) || null;\n    } catch (_oO) {\n      logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);\n      return null;\n    }\n  }\n\n  /** Updates existing session based on the provided event */\n  protected _updateSessionFromEvent(session: Session, event: Event): void {\n    let crashed = false;\n    let errored = false;\n    let userAgent;\n    const exceptions = event.exception && event.exception.values;\n\n    if (exceptions) {\n      errored = true;\n\n      for (const ex of exceptions) {\n        const mechanism = ex.mechanism;\n        if (mechanism && mechanism.handled === false) {\n          crashed = true;\n          break;\n        }\n      }\n    }\n\n    const user = event.user;\n    if (!session.userAgent) {\n      const headers = event.request ? event.request.headers : {};\n      for (const key in headers) {\n        if (key.toLowerCase() === 'user-agent') {\n          userAgent = headers[key];\n          break;\n        }\n      }\n    }\n\n    session.update({\n      ...(crashed && { status: SessionStatus.Crashed }),\n      user,\n      userAgent,\n      errors: session.errors + Number(errored || crashed),\n    });\n  }\n\n  /** Deliver captured session to Sentry */\n  protected _sendSession(session: Session): void {\n    this._getBackend().sendSession(session);\n  }\n\n  /** Waits for the client to be done with processing. */\n  protected _isClientProcessing(timeout?: number): PromiseLike<boolean> {\n    return new SyncPromise(resolve => {\n      let ticked: number = 0;\n      const tick: number = 1;\n\n      const interval = setInterval(() => {\n        if (this._processing == 0) {\n          clearInterval(interval);\n          resolve(true);\n        } else {\n          ticked += tick;\n          if (timeout && ticked >= timeout) {\n            clearInterval(interval);\n            resolve(false);\n          }\n        }\n      }, tick);\n    });\n  }\n\n  /** Returns the current backend. */\n  protected _getBackend(): B {\n    return this._backend;\n  }\n\n  /** Determines whether this SDK is enabled and a valid Dsn is present. */\n  protected _isEnabled(): boolean {\n    return this.getOptions().enabled !== false && this._dsn !== undefined;\n  }\n\n  /**\n   * Adds common information to events.\n   *\n   * The information includes release and environment from `options`,\n   * breadcrumbs and context (extra, tags and user) from the scope.\n   *\n   * Information that is already present in the event is never overwritten. For\n   * nested objects, such as the context, keys are merged.\n   *\n   * @param event The original event.\n   * @param hint May contain additional information about the original exception.\n   * @param scope A scope containing event metadata.\n   * @returns A new event with more information.\n   */\n  protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): PromiseLike<Event | null> {\n    const { normalizeDepth = 3 } = this.getOptions();\n    const prepared: Event = {\n      ...event,\n      event_id: event.event_id || (hint && hint.event_id ? hint.event_id : uuid4()),\n      timestamp: event.timestamp || dateTimestampInSeconds(),\n    };\n\n    this._applyClientOptions(prepared);\n    this._applyIntegrationsMetadata(prepared);\n\n    // If we have scope given to us, use it as the base for further modifications.\n    // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.\n    let finalScope = scope;\n    if (hint && hint.captureContext) {\n      finalScope = Scope.clone(finalScope).update(hint.captureContext);\n    }\n\n    // We prepare the result here with a resolved Event.\n    let result = SyncPromise.resolve<Event | null>(prepared);\n\n    // This should be the last thing called, since we want that\n    // {@link Hub.addEventProcessor} gets the finished prepared event.\n    if (finalScope) {\n      // In case we have a hub we reassign it.\n      result = finalScope.applyToEvent(prepared, hint);\n    }\n\n    return result.then(evt => {\n      if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {\n        return this._normalizeEvent(evt, normalizeDepth);\n      }\n      return evt;\n    });\n  }\n\n  /**\n   * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.\n   * Normalized keys:\n   * - `breadcrumbs.data`\n   * - `user`\n   * - `contexts`\n   * - `extra`\n   * @param event Event\n   * @returns Normalized event\n   */\n  protected _normalizeEvent(event: Event | null, depth: number): Event | null {\n    if (!event) {\n      return null;\n    }\n\n    const normalized = {\n      ...event,\n      ...(event.breadcrumbs && {\n        breadcrumbs: event.breadcrumbs.map(b => ({\n          ...b,\n          ...(b.data && {\n            data: normalize(b.data, depth),\n          }),\n        })),\n      }),\n      ...(event.user && {\n        user: normalize(event.user, depth),\n      }),\n      ...(event.contexts && {\n        contexts: normalize(event.contexts, depth),\n      }),\n      ...(event.extra && {\n        extra: normalize(event.extra, depth),\n      }),\n    };\n    // event.contexts.trace stores information about a Transaction. Similarly,\n    // event.spans[] stores information about child Spans. Given that a\n    // Transaction is conceptually a Span, normalization should apply to both\n    // Transactions and Spans consistently.\n    // For now the decision is to skip normalization of Transactions and Spans,\n    // so this block overwrites the normalized event to add back the original\n    // Transaction information prior to normalization.\n    if (event.contexts && event.contexts.trace) {\n      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access\n      normalized.contexts.trace = event.contexts.trace;\n    }\n    return normalized;\n  }\n\n  /**\n   *  Enhances event using the client configuration.\n   *  It takes care of all \"static\" values like environment, release and `dist`,\n   *  as well as truncating overly long values.\n   * @param event event instance to be enhanced\n   */\n  protected _applyClientOptions(event: Event): void {\n    const options = this.getOptions();\n    const { environment, release, dist, maxValueLength = 250 } = options;\n\n    if (!('environment' in event)) {\n      event.environment = 'environment' in options ? environment : 'production';\n    }\n\n    if (event.release === undefined && release !== undefined) {\n      event.release = release;\n    }\n\n    if (event.dist === undefined && dist !== undefined) {\n      event.dist = dist;\n    }\n\n    if (event.message) {\n      event.message = truncate(event.message, maxValueLength);\n    }\n\n    const exception = event.exception && event.exception.values && event.exception.values[0];\n    if (exception && exception.value) {\n      exception.value = truncate(exception.value, maxValueLength);\n    }\n\n    const request = event.request;\n    if (request && request.url) {\n      request.url = truncate(request.url, maxValueLength);\n    }\n  }\n\n  /**\n   * This function adds all used integrations to the SDK info in the event.\n   * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.\n   */\n  protected _applyIntegrationsMetadata(event: Event): void {\n    const sdkInfo = event.sdk;\n    const integrationsArray = Object.keys(this._integrations);\n    if (sdkInfo && integrationsArray.length > 0) {\n      sdkInfo.integrations = integrationsArray;\n    }\n  }\n\n  /**\n   * Tells the backend to send this event\n   * @param event The Sentry event to send\n   */\n  protected _sendEvent(event: Event): void {\n    this._getBackend().sendEvent(event);\n  }\n\n  /**\n   * Processes the event and logs an error in case of rejection\n   * @param event\n   * @param hint\n   * @param scope\n   */\n  protected _captureEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<string | undefined> {\n    return this._processEvent(event, hint, scope).then(\n      finalEvent => {\n        return finalEvent.event_id;\n      },\n      reason => {\n        logger.error(reason);\n        return undefined;\n      },\n    );\n  }\n\n  /**\n   * Processes an event (either error or message) and sends it to Sentry.\n   *\n   * This also adds breadcrumbs and context information to the event. However,\n   * platform specific meta data (such as the User's IP address) must be added\n   * by the SDK implementor.\n   *\n   *\n   * @param event The event to send to Sentry.\n   * @param hint May contain additional information about the original exception.\n   * @param scope A scope containing event metadata.\n   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.\n   */\n  protected _processEvent(event: Event, hint?: EventHint, scope?: Scope): PromiseLike<Event> {\n    // eslint-disable-next-line @typescript-eslint/unbound-method\n    const { beforeSend, sampleRate } = this.getOptions();\n\n    if (!this._isEnabled()) {\n      return SyncPromise.reject(new SentryError('SDK not enabled, will not send event.'));\n    }\n\n    const isTransaction = event.type === 'transaction';\n    // 1.0 === 100% events are sent\n    // 0.0 === 0% events are sent\n    // Sampling for transaction happens somewhere else\n    if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {\n      return SyncPromise.reject(\n        new SentryError(\n          `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,\n        ),\n      );\n    }\n\n    return this._prepareEvent(event, scope, hint)\n      .then(prepared => {\n        if (prepared === null) {\n          throw new SentryError('An event processor returned null, will not send event.');\n        }\n\n        const isInternalException = hint && hint.data && (hint.data as { __sentry__: boolean }).__sentry__ === true;\n        if (isInternalException || isTransaction || !beforeSend) {\n          return prepared;\n        }\n\n        const beforeSendResult = beforeSend(prepared, hint);\n        if (typeof beforeSendResult === 'undefined') {\n          throw new SentryError('`beforeSend` method has to return `null` or a valid event.');\n        } else if (isThenable(beforeSendResult)) {\n          return (beforeSendResult as PromiseLike<Event | null>).then(\n            event => event,\n            e => {\n              throw new SentryError(`beforeSend rejected with ${e}`);\n            },\n          );\n        }\n        return beforeSendResult;\n      })\n      .then(processedEvent => {\n        if (processedEvent === null) {\n          throw new SentryError('`beforeSend` returned `null`, will not send event.');\n        }\n\n        const session = scope && scope.getSession && scope.getSession();\n        if (!isTransaction && session) {\n          this._updateSessionFromEvent(session, processedEvent);\n        }\n\n        this._sendEvent(processedEvent);\n        return processedEvent;\n      })\n      .then(null, reason => {\n        if (reason instanceof SentryError) {\n          throw reason;\n        }\n\n        this.captureException(reason, {\n          data: {\n            __sentry__: true,\n          },\n          originalException: reason as Error,\n        });\n        throw new SentryError(\n          `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\\nReason: ${reason}`,\n        );\n      });\n  }\n\n  /**\n   * Occupies the client with processing and event\n   */\n  protected _process<T>(promise: PromiseLike<T>): void {\n    this._processing += 1;\n    promise.then(\n      value => {\n        this._processing -= 1;\n        return value;\n      },\n      reason => {\n        this._processing -= 1;\n        return reason;\n      },\n    );\n  }\n}\n"]}export { addBreadcrumb, captureException, captureEvent, captureMessage, configureScope, startTransaction, setContext, setExtra, setExtras, setTag, setTags, setUser, withScope, } from '@sentry/minimal';
export { addGlobalEventProcessor, getCurrentHub, getHubFromCarrier, Hub, makeMain, Scope } from '@sentry/hub';
export { API } from './api';
export { BaseClient } from './baseclient';
export { BackendClass, BaseBackend } from './basebackend';
export { eventToSentryRequest, sessionToSentryRequest } from './request';
export { initAndBind, ClientClass } from './sdk';
export { NoopTransport } from './transports/noop';
export { SDK_VERSION } from './version';
import * as Integrations from './integrations';
export { Integrations };
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AAAA,OAAO,EACL,aAAa,EACb,gBAAgB,EAChB,YAAY,EACZ,cAAc,EACd,cAAc,EACd,gBAAgB,EAChB,UAAU,EACV,QAAQ,EACR,SAAS,EACT,MAAM,EACN,OAAO,EACP,OAAO,EACP,SAAS,GACV,MAAM,iBAAiB,CAAC;AACzB,OAAO,EAAE,uBAAuB,EAAE,aAAa,EAAE,iBAAiB,EAAE,GAAG,EAAE,QAAQ,EAAE,KAAK,EAAE,MAAM,aAAa,CAAC;AAC9G,OAAO,EAAE,GAAG,EAAE,MAAM,OAAO,CAAC;AAC5B,OAAO,EAAE,UAAU,EAAE,MAAM,cAAc,CAAC;AAC1C,OAAO,EAAE,YAAY,EAAE,WAAW,EAAE,MAAM,eAAe,CAAC;AAC1D,OAAO,EAAE,oBAAoB,EAAE,sBAAsB,EAAE,MAAM,WAAW,CAAC;AACzE,OAAO,EAAE,WAAW,EAAE,WAAW,EAAE,MAAM,OAAO,CAAC;AACjD,OAAO,EAAE,aAAa,EAAE,MAAM,mBAAmB,CAAC;AAClD,OAAO,EAAE,WAAW,EAAE,MAAM,WAAW,CAAC;AAExC,OAAO,KAAK,YAAY,MAAM,gBAAgB,CAAC;AAE/C,OAAO,EAAE,YAAY,EAAE,CAAC"}export { addBreadcrumb, captureException, captureEvent, captureMessage, configureScope, startTransaction, setContext, setExtra, setExtras, setTag, setTags, setUser, withScope, } from '@sentry/minimal';
export { addGlobalEventProcessor, getCurrentHub, getHubFromCarrier, Hub, makeMain, Scope } from '@sentry/hub';
export { API } from './api';
export { BaseClient } from './baseclient';
export { BaseBackend } from './basebackend';
export { eventToSentryRequest, sessionToSentryRequest } from './request';
export { initAndBind } from './sdk';
export { NoopTransport } from './transports/noop';
export { SDK_VERSION } from './version';
import * as Integrations from './integrations';
export { Integrations };
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AAAA,OAAO,EACL,aAAa,EACb,gBAAgB,EAChB,YAAY,EACZ,cAAc,EACd,cAAc,EACd,gBAAgB,EAChB,UAAU,EACV,QAAQ,EACR,SAAS,EACT,MAAM,EACN,OAAO,EACP,OAAO,EACP,SAAS,GACV,MAAM,iBAAiB,CAAC;AACzB,OAAO,EAAE,uBAAuB,EAAE,aAAa,EAAE,iBAAiB,EAAE,GAAG,EAAE,QAAQ,EAAE,KAAK,EAAE,MAAM,aAAa,CAAC;AAC9G,OAAO,EAAE,GAAG,EAAE,MAAM,OAAO,CAAC;AAC5B,OAAO,EAAE,UAAU,EAAE,MAAM,cAAc,CAAC;AAC1C,OAAO,EAAgB,WAAW,EAAE,MAAM,eAAe,CAAC;AAC1D,OAAO,EAAE,oBAAoB,EAAE,sBAAsB,EAAE,MAAM,WAAW,CAAC;AACzE,OAAO,EAAE,WAAW,EAAe,MAAM,OAAO,CAAC;AACjD,OAAO,EAAE,aAAa,EAAE,MAAM,mBAAmB,CAAC;AAClD,OAAO,EAAE,WAAW,EAAE,MAAM,WAAW,CAAC;AAExC,OAAO,KAAK,YAAY,MAAM,gBAAgB,CAAC;AAE/C,OAAO,EAAE,YAAY,EAAE,CAAC","sourcesContent":["export {\n  addBreadcrumb,\n  captureException,\n  captureEvent,\n  captureMessage,\n  configureScope,\n  startTransaction,\n  setContext,\n  setExtra,\n  setExtras,\n  setTag,\n  setTags,\n  setUser,\n  withScope,\n} from '@sentry/minimal';\nexport { addGlobalEventProcessor, getCurrentHub, getHubFromCarrier, Hub, makeMain, Scope } from '@sentry/hub';\nexport { API } from './api';\nexport { BaseClient } from './baseclient';\nexport { BackendClass, BaseBackend } from './basebackend';\nexport { eventToSentryRequest, sessionToSentryRequest } from './request';\nexport { initAndBind, ClientClass } from './sdk';\nexport { NoopTransport } from './transports/noop';\nexport { SDK_VERSION } from './version';\n\nimport * as Integrations from './integrations';\n\nexport { Integrations };\n"]}import { Integration, Options } from '@sentry/types';
export declare const installedIntegrations: string[];
/** Map of integrations assigned to a client */
export interface IntegrationIndex {
    [key: string]: Integration;
}
/** Gets integration to install */
export declare function getIntegrationsToSetup(options: Options): Integration[];
/** Setup given integration */
export declare function setupIntegration(integration: Integration): void;
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
export declare function setupIntegrations<O extends Options>(options: O): IntegrationIndex;
//# sourceMappingURL=integration.d.ts.map{"version":3,"file":"integration.d.ts","sourceRoot":"","sources":["../src/integration.ts"],"names":[],"mappings":"AACA,OAAO,EAAE,WAAW,EAAE,OAAO,EAAE,MAAM,eAAe,CAAC;AAGrD,eAAO,MAAM,qBAAqB,EAAE,MAAM,EAAO,CAAC;AAElD,+CAA+C;AAC/C,MAAM,WAAW,gBAAgB;IAC/B,CAAC,GAAG,EAAE,MAAM,GAAG,WAAW,CAAC;CAC5B;AAED,kCAAkC;AAClC,wBAAgB,sBAAsB,CAAC,OAAO,EAAE,OAAO,GAAG,WAAW,EAAE,CAyCtE;AAED,8BAA8B;AAC9B,wBAAgB,gBAAgB,CAAC,WAAW,EAAE,WAAW,GAAG,IAAI,CAO/D;AAED;;;;;GAKG;AACH,wBAAgB,iBAAiB,CAAC,CAAC,SAAS,OAAO,EAAE,OAAO,EAAE,CAAC,GAAG,gBAAgB,CAOjF"}import { __read, __spread } from "tslib";
import { addGlobalEventProcessor, getCurrentHub } from '@sentry/hub';
import { logger } from '@sentry/utils';
export var installedIntegrations = [];
/** Gets integration to install */
export function getIntegrationsToSetup(options) {
    var defaultIntegrations = (options.defaultIntegrations && __spread(options.defaultIntegrations)) || [];
    var userIntegrations = options.integrations;
    var integrations = [];
    if (Array.isArray(userIntegrations)) {
        var userIntegrationsNames_1 = userIntegrations.map(function (i) { return i.name; });
        var pickedIntegrationsNames_1 = [];
        // Leave only unique default integrations, that were not overridden with provided user integrations
        defaultIntegrations.forEach(function (defaultIntegration) {
            if (userIntegrationsNames_1.indexOf(defaultIntegration.name) === -1 &&
                pickedIntegrationsNames_1.indexOf(defaultIntegration.name) === -1) {
                integrations.push(defaultIntegration);
                pickedIntegrationsNames_1.push(defaultIntegration.name);
            }
        });
        // Don't add same user integration twice
        userIntegrations.forEach(function (userIntegration) {
            if (pickedIntegrationsNames_1.indexOf(userIntegration.name) === -1) {
                integrations.push(userIntegration);
                pickedIntegrationsNames_1.push(userIntegration.name);
            }
        });
    }
    else if (typeof userIntegrations === 'function') {
        integrations = userIntegrations(defaultIntegrations);
        integrations = Array.isArray(integrations) ? integrations : [integrations];
    }
    else {
        integrations = __spread(defaultIntegrations);
    }
    // Make sure that if present, `Debug` integration will always run last
    var integrationsNames = integrations.map(function (i) { return i.name; });
    var alwaysLastToRun = 'Debug';
    if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {
        integrations.push.apply(integrations, __spread(integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1)));
    }
    return integrations;
}
/** Setup given integration */
export function setupIntegration(integration) {
    if (installedIntegrations.indexOf(integration.name) !== -1) {
        return;
    }
    integration.setupOnce(addGlobalEventProcessor, getCurrentHub);
    installedIntegrations.push(integration.name);
    logger.log("Integration installed: " + integration.name);
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
export function setupIntegrations(options) {
    var integrations = {};
    getIntegrationsToSetup(options).forEach(function (integration) {
        integrations[integration.name] = integration;
        setupIntegration(integration);
    });
    return integrations;
}
//# sourceMappingURL=integration.js.map{"version":3,"file":"integration.js","sourceRoot":"","sources":["../src/integration.ts"],"names":[],"mappings":"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","sourcesContent":["import { addGlobalEventProcessor, getCurrentHub } from '@sentry/hub';\nimport { Integration, Options } from '@sentry/types';\nimport { logger } from '@sentry/utils';\n\nexport const installedIntegrations: string[] = [];\n\n/** Map of integrations assigned to a client */\nexport interface IntegrationIndex {\n  [key: string]: Integration;\n}\n\n/** Gets integration to install */\nexport function getIntegrationsToSetup(options: Options): Integration[] {\n  const defaultIntegrations = (options.defaultIntegrations && [...options.defaultIntegrations]) || [];\n  const userIntegrations = options.integrations;\n  let integrations: Integration[] = [];\n  if (Array.isArray(userIntegrations)) {\n    const userIntegrationsNames = userIntegrations.map(i => i.name);\n    const pickedIntegrationsNames: string[] = [];\n\n    // Leave only unique default integrations, that were not overridden with provided user integrations\n    defaultIntegrations.forEach(defaultIntegration => {\n      if (\n        userIntegrationsNames.indexOf(defaultIntegration.name) === -1 &&\n        pickedIntegrationsNames.indexOf(defaultIntegration.name) === -1\n      ) {\n        integrations.push(defaultIntegration);\n        pickedIntegrationsNames.push(defaultIntegration.name);\n      }\n    });\n\n    // Don't add same user integration twice\n    userIntegrations.forEach(userIntegration => {\n      if (pickedIntegrationsNames.indexOf(userIntegration.name) === -1) {\n        integrations.push(userIntegration);\n        pickedIntegrationsNames.push(userIntegration.name);\n      }\n    });\n  } else if (typeof userIntegrations === 'function') {\n    integrations = userIntegrations(defaultIntegrations);\n    integrations = Array.isArray(integrations) ? integrations : [integrations];\n  } else {\n    integrations = [...defaultIntegrations];\n  }\n\n  // Make sure that if present, `Debug` integration will always run last\n  const integrationsNames = integrations.map(i => i.name);\n  const alwaysLastToRun = 'Debug';\n  if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {\n    integrations.push(...integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1));\n  }\n\n  return integrations;\n}\n\n/** Setup given integration */\nexport function setupIntegration(integration: Integration): void {\n  if (installedIntegrations.indexOf(integration.name) !== -1) {\n    return;\n  }\n  integration.setupOnce(addGlobalEventProcessor, getCurrentHub);\n  installedIntegrations.push(integration.name);\n  logger.log(`Integration installed: ${integration.name}`);\n}\n\n/**\n * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default\n * integrations are added unless they were already provided before.\n * @param integrations array of integration instances\n * @param withDefault should enable default integrations\n */\nexport function setupIntegrations<O extends Options>(options: O): IntegrationIndex {\n  const integrations: IntegrationIndex = {};\n  getIntegrationsToSetup(options).forEach(integration => {\n    integrations[integration.name] = integration;\n    setupIntegration(integration);\n  });\n  return integrations;\n}\n"]}import { Integration } from '@sentry/types';
/** Patch toString calls to return proper name for wrapped functions */
export declare class FunctionToString implements Integration {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * @inheritDoc
     */
    setupOnce(): void;
}
//# sourceMappingURL=functiontostring.d.ts.map{"version":3,"file":"functiontostring.d.ts","sourceRoot":"","sources":["../../src/integrations/functiontostring.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,WAAW,EAAmB,MAAM,eAAe,CAAC;AAI7D,uEAAuE;AACvE,qBAAa,gBAAiB,YAAW,WAAW;IAClD;;OAEG;IACH,OAAc,EAAE,EAAE,MAAM,CAAsB;IAE9C;;OAEG;IACI,IAAI,EAAE,MAAM,CAAuB;IAE1C;;OAEG;IACI,SAAS,IAAI,IAAI;CAUzB"}var originalFunctionToString;
/** Patch toString calls to return proper name for wrapped functions */
var FunctionToString = /** @class */ (function () {
    function FunctionToString() {
        /**
         * @inheritDoc
         */
        this.name = FunctionToString.id;
    }
    /**
     * @inheritDoc
     */
    FunctionToString.prototype.setupOnce = function () {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        originalFunctionToString = Function.prototype.toString;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Function.prototype.toString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = this.__sentry_original__ || this;
            return originalFunctionToString.apply(context, args);
        };
    };
    /**
     * @inheritDoc
     */
    FunctionToString.id = 'FunctionToString';
    return FunctionToString;
}());
export { FunctionToString };
//# sourceMappingURL=functiontostring.js.map{"version":3,"file":"functiontostring.js","sourceRoot":"","sources":["../../src/integrations/functiontostring.ts"],"names":[],"mappings":"AAEA,IAAI,wBAAoC,CAAC;AAEzC,uEAAuE;AACvE;IAAA;QAME;;WAEG;QACI,SAAI,GAAW,gBAAgB,CAAC,EAAE,CAAC;IAe5C,CAAC;IAbC;;OAEG;IACI,oCAAS,GAAhB;QACE,6DAA6D;QAC7D,wBAAwB,GAAG,QAAQ,CAAC,SAAS,CAAC,QAAQ,CAAC;QAEvD,8DAA8D;QAC9D,QAAQ,CAAC,SAAS,CAAC,QAAQ,GAAG;YAAgC,cAAc;iBAAd,UAAc,EAAd,qBAAc,EAAd,IAAc;gBAAd,yBAAc;;YAC1E,IAAM,OAAO,GAAG,IAAI,CAAC,mBAAmB,IAAI,IAAI,CAAC;YACjD,OAAO,wBAAwB,CAAC,KAAK,CAAC,OAAO,EAAE,IAAI,CAAC,CAAC;QACvD,CAAC,CAAC;IACJ,CAAC;IAtBD;;OAEG;IACW,mBAAE,GAAW,kBAAkB,CAAC;IAoBhD,uBAAC;CAAA,AAxBD,IAwBC;SAxBY,gBAAgB","sourcesContent":["import { Integration, WrappedFunction } from '@sentry/types';\n\nlet originalFunctionToString: () => void;\n\n/** Patch toString calls to return proper name for wrapped functions */\nexport class FunctionToString implements Integration {\n  /**\n   * @inheritDoc\n   */\n  public static id: string = 'FunctionToString';\n\n  /**\n   * @inheritDoc\n   */\n  public name: string = FunctionToString.id;\n\n  /**\n   * @inheritDoc\n   */\n  public setupOnce(): void {\n    // eslint-disable-next-line @typescript-eslint/unbound-method\n    originalFunctionToString = Function.prototype.toString;\n\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    Function.prototype.toString = function(this: WrappedFunction, ...args: any[]): string {\n      const context = this.__sentry_original__ || this;\n      return originalFunctionToString.apply(context, args);\n    };\n  }\n}\n"]}import { Integration } from '@sentry/types';
/** JSDoc */
interface InboundFiltersOptions {
    allowUrls: Array<string | RegExp>;
    denyUrls: Array<string | RegExp>;
    ignoreErrors: Array<string | RegExp>;
    ignoreInternal: boolean;
    /** @deprecated use {@link InboundFiltersOptions.allowUrls} instead. */
    whitelistUrls: Array<string | RegExp>;
    /** @deprecated use {@link InboundFiltersOptions.denyUrls} instead. */
    blacklistUrls: Array<string | RegExp>;
}
/** Inbound filters configurable by the user */
export declare class InboundFilters implements Integration {
    private readonly _options;
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    constructor(_options?: Partial<InboundFiltersOptions>);
    /**
     * @inheritDoc
     */
    setupOnce(): void;
    /** JSDoc */
    private _shouldDropEvent;
    /** JSDoc */
    private _isSentryError;
    /** JSDoc */
    private _isIgnoredError;
    /** JSDoc */
    private _isDeniedUrl;
    /** JSDoc */
    private _isAllowedUrl;
    /** JSDoc */
    private _mergeOptions;
    /** JSDoc */
    private _getPossibleEventMessages;
    /** JSDoc */
    private _getEventFilterUrl;
}
export {};
//# sourceMappingURL=inboundfilters.d.ts.map{"version":3,"file":"inboundfilters.d.ts","sourceRoot":"","sources":["../../src/integrations/inboundfilters.ts"],"names":[],"mappings":"AACA,OAAO,EAAS,WAAW,EAAE,MAAM,eAAe,CAAC;AAOnD,YAAY;AACZ,UAAU,qBAAqB;IAC7B,SAAS,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IAClC,QAAQ,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IACjC,YAAY,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IACrC,cAAc,EAAE,OAAO,CAAC;IAExB,uEAAuE;IACvE,aAAa,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;IACtC,sEAAsE;IACtE,aAAa,EAAE,KAAK,CAAC,MAAM,GAAG,MAAM,CAAC,CAAC;CACvC;AAED,+CAA+C;AAC/C,qBAAa,cAAe,YAAW,WAAW;IAW7B,OAAO,CAAC,QAAQ,CAAC,QAAQ;IAV5C;;OAEG;IACH,OAAc,EAAE,EAAE,MAAM,CAAoB;IAE5C;;OAEG;IACI,IAAI,EAAE,MAAM,CAAqB;gBAEJ,QAAQ,GAAE,OAAO,CAAC,qBAAqB,CAAM;IAEjF;;OAEG;IACI,SAAS,IAAI,IAAI;IAmBxB,YAAY;IACZ,OAAO,CAAC,gBAAgB;IA8BxB,YAAY;IACZ,OAAO,CAAC,cAAc;IAmBtB,YAAY;IACZ,OAAO,CAAC,eAAe;IAWvB,YAAY;IACZ,OAAO,CAAC,YAAY;IASpB,YAAY;IACZ,OAAO,CAAC,aAAa;IASrB,YAAY;IACZ,OAAO,CAAC,aAAa;IA2BrB,YAAY;IACZ,OAAO,CAAC,yBAAyB;IAgBjC,YAAY;IACZ,OAAO,CAAC,kBAAkB;CAiB3B"}import { __read, __spread } from "tslib";
import { addGlobalEventProcessor, getCurrentHub } from '@sentry/hub';
import { getEventDescription, isMatchingPattern, logger } from '@sentry/utils';
// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
/** Inbound filters configurable by the user */
var InboundFilters = /** @class */ (function () {
    function InboundFilters(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = InboundFilters.id;
    }
    /**
     * @inheritDoc
     */
    InboundFilters.prototype.setupOnce = function () {
        addGlobalEventProcessor(function (event) {
            var hub = getCurrentHub();
            if (!hub) {
                return event;
            }
            var self = hub.getIntegration(InboundFilters);
            if (self) {
                var client = hub.getClient();
                var clientOptions = client ? client.getOptions() : {};
                var options = self._mergeOptions(clientOptions);
                if (self._shouldDropEvent(event, options)) {
                    return null;
                }
            }
            return event;
        });
    };
    /** JSDoc */
    InboundFilters.prototype._shouldDropEvent = function (event, options) {
        if (this._isSentryError(event, options)) {
            logger.warn("Event dropped due to being internal Sentry Error.\nEvent: " + getEventDescription(event));
            return true;
        }
        if (this._isIgnoredError(event, options)) {
            logger.warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: " + getEventDescription(event));
            return true;
        }
        if (this._isDeniedUrl(event, options)) {
            logger.warn("Event dropped due to being matched by `denyUrls` option.\nEvent: " + getEventDescription(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        if (!this._isAllowedUrl(event, options)) {
            logger.warn("Event dropped due to not being matched by `allowUrls` option.\nEvent: " + getEventDescription(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        return false;
    };
    /** JSDoc */
    InboundFilters.prototype._isSentryError = function (event, options) {
        if (!options.ignoreInternal) {
            return false;
        }
        try {
            return ((event &&
                event.exception &&
                event.exception.values &&
                event.exception.values[0] &&
                event.exception.values[0].type === 'SentryError') ||
                false);
        }
        catch (_oO) {
            return false;
        }
    };
    /** JSDoc */
    InboundFilters.prototype._isIgnoredError = function (event, options) {
        if (!options.ignoreErrors || !options.ignoreErrors.length) {
            return false;
        }
        return this._getPossibleEventMessages(event).some(function (message) {
            // Not sure why TypeScript complains here...
            return options.ignoreErrors.some(function (pattern) { return isMatchingPattern(message, pattern); });
        });
    };
    /** JSDoc */
    InboundFilters.prototype._isDeniedUrl = function (event, options) {
        // TODO: Use Glob instead?
        if (!options.denyUrls || !options.denyUrls.length) {
            return false;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? false : options.denyUrls.some(function (pattern) { return isMatchingPattern(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._isAllowedUrl = function (event, options) {
        // TODO: Use Glob instead?
        if (!options.allowUrls || !options.allowUrls.length) {
            return true;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? true : options.allowUrls.some(function (pattern) { return isMatchingPattern(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._mergeOptions = function (clientOptions) {
        if (clientOptions === void 0) { clientOptions = {}; }
        return {
            allowUrls: __spread((this._options.whitelistUrls || []), (this._options.allowUrls || []), (clientOptions.whitelistUrls || []), (clientOptions.allowUrls || [])),
            denyUrls: __spread((this._options.blacklistUrls || []), (this._options.denyUrls || []), (clientOptions.blacklistUrls || []), (clientOptions.denyUrls || [])),
            ignoreErrors: __spread((this._options.ignoreErrors || []), (clientOptions.ignoreErrors || []), DEFAULT_IGNORE_ERRORS),
            ignoreInternal: typeof this._options.ignoreInternal !== 'undefined' ? this._options.ignoreInternal : true,
        };
    };
    /** JSDoc */
    InboundFilters.prototype._getPossibleEventMessages = function (event) {
        if (event.message) {
            return [event.message];
        }
        if (event.exception) {
            try {
                var _a = (event.exception.values && event.exception.values[0]) || {}, _b = _a.type, type = _b === void 0 ? '' : _b, _c = _a.value, value = _c === void 0 ? '' : _c;
                return ["" + value, type + ": " + value];
            }
            catch (oO) {
                logger.error("Cannot extract message for event " + getEventDescription(event));
                return [];
            }
        }
        return [];
    };
    /** JSDoc */
    InboundFilters.prototype._getEventFilterUrl = function (event) {
        try {
            if (event.stacktrace) {
                var frames_1 = event.stacktrace.frames;
                return (frames_1 && frames_1[frames_1.length - 1].filename) || null;
            }
            if (event.exception) {
                var frames_2 = event.exception.values && event.exception.values[0].stacktrace && event.exception.values[0].stacktrace.frames;
                return (frames_2 && frames_2[frames_2.length - 1].filename) || null;
            }
            return null;
        }
        catch (oO) {
            logger.error("Cannot extract url for event " + getEventDescription(event));
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    InboundFilters.id = 'InboundFilters';
    return InboundFilters;
}());
export { InboundFilters };
//# sourceMappingURL=inboundfilters.js.map{"version":3,"file":"inboundfilters.js","sourceRoot":"","sources":["../../src/integrations/inboundfilters.ts"],"names":[],"mappings":"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","sourcesContent":["import { addGlobalEventProcessor, getCurrentHub } from '@sentry/hub';\nimport { Event, Integration } from '@sentry/types';\nimport { getEventDescription, isMatchingPattern, logger } from '@sentry/utils';\n\n// \"Script error.\" is hard coded into browsers for errors that it can't read.\n// this is the result of a script being pulled in from an external domain and CORS.\nconst DEFAULT_IGNORE_ERRORS = [/^Script error\\.?$/, /^Javascript error: Script error\\.? on line 0$/];\n\n/** JSDoc */\ninterface InboundFiltersOptions {\n  allowUrls: Array<string | RegExp>;\n  denyUrls: Array<string | RegExp>;\n  ignoreErrors: Array<string | RegExp>;\n  ignoreInternal: boolean;\n\n  /** @deprecated use {@link InboundFiltersOptions.allowUrls} instead. */\n  whitelistUrls: Array<string | RegExp>;\n  /** @deprecated use {@link InboundFiltersOptions.denyUrls} instead. */\n  blacklistUrls: Array<string | RegExp>;\n}\n\n/** Inbound filters configurable by the user */\nexport class InboundFilters implements Integration {\n  /**\n   * @inheritDoc\n   */\n  public static id: string = 'InboundFilters';\n\n  /**\n   * @inheritDoc\n   */\n  public name: string = InboundFilters.id;\n\n  public constructor(private readonly _options: Partial<InboundFiltersOptions> = {}) {}\n\n  /**\n   * @inheritDoc\n   */\n  public setupOnce(): void {\n    addGlobalEventProcessor((event: Event) => {\n      const hub = getCurrentHub();\n      if (!hub) {\n        return event;\n      }\n      const self = hub.getIntegration(InboundFilters);\n      if (self) {\n        const client = hub.getClient();\n        const clientOptions = client ? client.getOptions() : {};\n        const options = self._mergeOptions(clientOptions);\n        if (self._shouldDropEvent(event, options)) {\n          return null;\n        }\n      }\n      return event;\n    });\n  }\n\n  /** JSDoc */\n  private _shouldDropEvent(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    if (this._isSentryError(event, options)) {\n      logger.warn(`Event dropped due to being internal Sentry Error.\\nEvent: ${getEventDescription(event)}`);\n      return true;\n    }\n    if (this._isIgnoredError(event, options)) {\n      logger.warn(\n        `Event dropped due to being matched by \\`ignoreErrors\\` option.\\nEvent: ${getEventDescription(event)}`,\n      );\n      return true;\n    }\n    if (this._isDeniedUrl(event, options)) {\n      logger.warn(\n        `Event dropped due to being matched by \\`denyUrls\\` option.\\nEvent: ${getEventDescription(\n          event,\n        )}.\\nUrl: ${this._getEventFilterUrl(event)}`,\n      );\n      return true;\n    }\n    if (!this._isAllowedUrl(event, options)) {\n      logger.warn(\n        `Event dropped due to not being matched by \\`allowUrls\\` option.\\nEvent: ${getEventDescription(\n          event,\n        )}.\\nUrl: ${this._getEventFilterUrl(event)}`,\n      );\n      return true;\n    }\n    return false;\n  }\n\n  /** JSDoc */\n  private _isSentryError(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    if (!options.ignoreInternal) {\n      return false;\n    }\n\n    try {\n      return (\n        (event &&\n          event.exception &&\n          event.exception.values &&\n          event.exception.values[0] &&\n          event.exception.values[0].type === 'SentryError') ||\n        false\n      );\n    } catch (_oO) {\n      return false;\n    }\n  }\n\n  /** JSDoc */\n  private _isIgnoredError(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    if (!options.ignoreErrors || !options.ignoreErrors.length) {\n      return false;\n    }\n\n    return this._getPossibleEventMessages(event).some(message =>\n      // Not sure why TypeScript complains here...\n      (options.ignoreErrors as Array<RegExp | string>).some(pattern => isMatchingPattern(message, pattern)),\n    );\n  }\n\n  /** JSDoc */\n  private _isDeniedUrl(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    // TODO: Use Glob instead?\n    if (!options.denyUrls || !options.denyUrls.length) {\n      return false;\n    }\n    const url = this._getEventFilterUrl(event);\n    return !url ? false : options.denyUrls.some(pattern => isMatchingPattern(url, pattern));\n  }\n\n  /** JSDoc */\n  private _isAllowedUrl(event: Event, options: Partial<InboundFiltersOptions>): boolean {\n    // TODO: Use Glob instead?\n    if (!options.allowUrls || !options.allowUrls.length) {\n      return true;\n    }\n    const url = this._getEventFilterUrl(event);\n    return !url ? true : options.allowUrls.some(pattern => isMatchingPattern(url, pattern));\n  }\n\n  /** JSDoc */\n  private _mergeOptions(clientOptions: Partial<InboundFiltersOptions> = {}): Partial<InboundFiltersOptions> {\n    return {\n      allowUrls: [\n        // eslint-disable-next-line deprecation/deprecation\n        ...(this._options.whitelistUrls || []),\n        ...(this._options.allowUrls || []),\n        // eslint-disable-next-line deprecation/deprecation\n        ...(clientOptions.whitelistUrls || []),\n        ...(clientOptions.allowUrls || []),\n      ],\n      denyUrls: [\n        // eslint-disable-next-line deprecation/deprecation\n        ...(this._options.blacklistUrls || []),\n        ...(this._options.denyUrls || []),\n        // eslint-disable-next-line deprecation/deprecation\n        ...(clientOptions.blacklistUrls || []),\n        ...(clientOptions.denyUrls || []),\n      ],\n      ignoreErrors: [\n        ...(this._options.ignoreErrors || []),\n        ...(clientOptions.ignoreErrors || []),\n        ...DEFAULT_IGNORE_ERRORS,\n      ],\n      ignoreInternal: typeof this._options.ignoreInternal !== 'undefined' ? this._options.ignoreInternal : true,\n    };\n  }\n\n  /** JSDoc */\n  private _getPossibleEventMessages(event: Event): string[] {\n    if (event.message) {\n      return [event.message];\n    }\n    if (event.exception) {\n      try {\n        const { type = '', value = '' } = (event.exception.values && event.exception.values[0]) || {};\n        return [`${value}`, `${type}: ${value}`];\n      } catch (oO) {\n        logger.error(`Cannot extract message for event ${getEventDescription(event)}`);\n        return [];\n      }\n    }\n    return [];\n  }\n\n  /** JSDoc */\n  private _getEventFilterUrl(event: Event): string | null {\n    try {\n      if (event.stacktrace) {\n        const frames = event.stacktrace.frames;\n        return (frames && frames[frames.length - 1].filename) || null;\n      }\n      if (event.exception) {\n        const frames =\n          event.exception.values && event.exception.values[0].stacktrace && event.exception.values[0].stacktrace.frames;\n        return (frames && frames[frames.length - 1].filename) || null;\n      }\n      return null;\n    } catch (oO) {\n      logger.error(`Cannot extract url for event ${getEventDescription(event)}`);\n      return null;\n    }\n  }\n}\n"]}export { FunctionToString } from './functiontostring';
export { InboundFilters } from './inboundfilters';
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../../src/integrations/index.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,gBAAgB,EAAE,MAAM,oBAAoB,CAAC;AACtD,OAAO,EAAE,cAAc,EAAE,MAAM,kBAAkB,CAAC"}export { FunctionToString } from './functiontostring';
export { InboundFilters } from './inboundfilters';
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../../src/integrations/index.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,gBAAgB,EAAE,MAAM,oBAAoB,CAAC;AACtD,OAAO,EAAE,cAAc,EAAE,MAAM,kBAAkB,CAAC","sourcesContent":["export { FunctionToString } from './functiontostring';\nexport { InboundFilters } from './inboundfilters';\n"]}import { Event, SentryRequest, Session } from '@sentry/types';
import { API } from './api';
/** Creates a SentryRequest from an event. */
export declare function sessionToSentryRequest(session: Session, api: API): SentryRequest;
/** Creates a SentryRequest from an event. */
export declare function eventToSentryRequest(event: Event, api: API): SentryRequest;
//# sourceMappingURL=request.d.ts.map{"version":3,"file":"request.d.ts","sourceRoot":"","sources":["../src/request.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,KAAK,EAAW,aAAa,EAAE,OAAO,EAAE,MAAM,eAAe,CAAC;AAEvE,OAAO,EAAE,GAAG,EAAE,MAAM,OAAO,CAAC;AA+B5B,6CAA6C;AAC7C,wBAAgB,sBAAsB,CAAC,OAAO,EAAE,OAAO,EAAE,GAAG,EAAE,GAAG,GAAG,aAAa,CAehF;AAED,6CAA6C;AAC7C,wBAAgB,oBAAoB,CAAC,KAAK,EAAE,KAAK,EAAE,GAAG,EAAE,GAAG,GAAG,aAAa,CAyD1E"}import { __assign, __read, __rest, __spread } from "tslib";
/** Extract sdk info from from the API metadata */
function getSdkMetadataForEnvelopeHeader(api) {
    if (!api.metadata || !api.metadata.sdk) {
        return;
    }
    var _a = api.metadata.sdk, name = _a.name, version = _a.version;
    return { name: name, version: version };
}
/**
 * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
 * Merge with existing data if any.
 **/
function enhanceEventWithSdkInfo(event, sdkInfo) {
    if (!sdkInfo) {
        return event;
    }
    event.sdk = event.sdk || {
        name: sdkInfo.name,
        version: sdkInfo.version,
    };
    event.sdk.name = event.sdk.name || sdkInfo.name;
    event.sdk.version = event.sdk.version || sdkInfo.version;
    event.sdk.integrations = __spread((event.sdk.integrations || []), (sdkInfo.integrations || []));
    event.sdk.packages = __spread((event.sdk.packages || []), (sdkInfo.packages || []));
    return event;
}
/** Creates a SentryRequest from an event. */
export function sessionToSentryRequest(session, api) {
    var sdkInfo = getSdkMetadataForEnvelopeHeader(api);
    var envelopeHeaders = JSON.stringify(__assign({ sent_at: new Date().toISOString() }, (sdkInfo && { sdk: sdkInfo })));
    var itemHeaders = JSON.stringify({
        type: 'session',
    });
    return {
        body: envelopeHeaders + "\n" + itemHeaders + "\n" + JSON.stringify(session),
        type: 'session',
        url: api.getEnvelopeEndpointWithUrlEncodedAuth(),
    };
}
/** Creates a SentryRequest from an event. */
export function eventToSentryRequest(event, api) {
    // since JS has no Object.prototype.pop()
    var _a = event.tags || {}, samplingMethod = _a.__sentry_samplingMethod, sampleRate = _a.__sentry_sampleRate, otherTags = __rest(_a, ["__sentry_samplingMethod", "__sentry_sampleRate"]);
    event.tags = otherTags;
    var sdkInfo = getSdkMetadataForEnvelopeHeader(api);
    var eventType = event.type || 'event';
    var useEnvelope = eventType === 'transaction';
    var req = {
        body: JSON.stringify(sdkInfo ? enhanceEventWithSdkInfo(event, api.metadata.sdk) : event),
        type: eventType,
        url: useEnvelope ? api.getEnvelopeEndpointWithUrlEncodedAuth() : api.getStoreEndpointWithUrlEncodedAuth(),
    };
    // https://develop.sentry.dev/sdk/envelopes/
    // Since we don't need to manipulate envelopes nor store them, there is no
    // exported concept of an Envelope with operations including serialization and
    // deserialization. Instead, we only implement a minimal subset of the spec to
    // serialize events inline here.
    if (useEnvelope) {
        var envelopeHeaders = JSON.stringify(__assign({ event_id: event.event_id, sent_at: new Date().toISOString() }, (sdkInfo && { sdk: sdkInfo })));
        var itemHeaders = JSON.stringify({
            type: event.type,
            // TODO: Right now, sampleRate may or may not be defined (it won't be in the cases of inheritance and
            // explicitly-set sampling decisions). Are we good with that?
            sample_rates: [{ id: samplingMethod, rate: sampleRate }],
        });
        // The trailing newline is optional. We intentionally don't send it to avoid
        // sending unnecessary bytes.
        //
        // const envelope = `${envelopeHeaders}\n${itemHeaders}\n${req.body}\n`;
        var envelope = envelopeHeaders + "\n" + itemHeaders + "\n" + req.body;
        req.body = envelope;
    }
    return req;
}
//# sourceMappingURL=request.js.map{"version":3,"file":"request.js","sourceRoot":"","sources":["../src/request.ts"],"names":[],"mappings":"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","sourcesContent":["import { Event, SdkInfo, SentryRequest, Session } from '@sentry/types';\n\nimport { API } from './api';\n\n/** Extract sdk info from from the API metadata */\nfunction getSdkMetadataForEnvelopeHeader(api: API): SdkInfo | undefined {\n  if (!api.metadata || !api.metadata.sdk) {\n    return;\n  }\n  const { name, version } = api.metadata.sdk;\n  return { name, version };\n}\n\n/**\n * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.\n * Merge with existing data if any.\n **/\nfunction enhanceEventWithSdkInfo(event: Event, sdkInfo?: SdkInfo): Event {\n  if (!sdkInfo) {\n    return event;\n  }\n\n  event.sdk = event.sdk || {\n    name: sdkInfo.name,\n    version: sdkInfo.version,\n  };\n  event.sdk.name = event.sdk.name || sdkInfo.name;\n  event.sdk.version = event.sdk.version || sdkInfo.version;\n  event.sdk.integrations = [...(event.sdk.integrations || []), ...(sdkInfo.integrations || [])];\n  event.sdk.packages = [...(event.sdk.packages || []), ...(sdkInfo.packages || [])];\n  return event;\n}\n\n/** Creates a SentryRequest from an event. */\nexport function sessionToSentryRequest(session: Session, api: API): SentryRequest {\n  const sdkInfo = getSdkMetadataForEnvelopeHeader(api);\n  const envelopeHeaders = JSON.stringify({\n    sent_at: new Date().toISOString(),\n    ...(sdkInfo && { sdk: sdkInfo }),\n  });\n  const itemHeaders = JSON.stringify({\n    type: 'session',\n  });\n\n  return {\n    body: `${envelopeHeaders}\\n${itemHeaders}\\n${JSON.stringify(session)}`,\n    type: 'session',\n    url: api.getEnvelopeEndpointWithUrlEncodedAuth(),\n  };\n}\n\n/** Creates a SentryRequest from an event. */\nexport function eventToSentryRequest(event: Event, api: API): SentryRequest {\n  // since JS has no Object.prototype.pop()\n  const { __sentry_samplingMethod: samplingMethod, __sentry_sampleRate: sampleRate, ...otherTags } = event.tags || {};\n  event.tags = otherTags;\n\n  const sdkInfo = getSdkMetadataForEnvelopeHeader(api);\n  const eventType = event.type || 'event';\n  const useEnvelope = eventType === 'transaction';\n\n  const req: SentryRequest = {\n    body: JSON.stringify(sdkInfo ? enhanceEventWithSdkInfo(event, api.metadata.sdk) : event),\n    type: eventType,\n    url: useEnvelope ? api.getEnvelopeEndpointWithUrlEncodedAuth() : api.getStoreEndpointWithUrlEncodedAuth(),\n  };\n\n  // https://develop.sentry.dev/sdk/envelopes/\n\n  // Since we don't need to manipulate envelopes nor store them, there is no\n  // exported concept of an Envelope with operations including serialization and\n  // deserialization. Instead, we only implement a minimal subset of the spec to\n  // serialize events inline here.\n  if (useEnvelope) {\n    const envelopeHeaders = JSON.stringify({\n      event_id: event.event_id,\n      sent_at: new Date().toISOString(),\n      ...(sdkInfo && { sdk: sdkInfo }),\n    });\n    const itemHeaders = JSON.stringify({\n      type: event.type,\n\n      // TODO: Right now, sampleRate may or may not be defined (it won't be in the cases of inheritance and\n      // explicitly-set sampling decisions). Are we good with that?\n      sample_rates: [{ id: samplingMethod, rate: sampleRate }],\n\n      // The content-type is assumed to be 'application/json' and not part of\n      // the current spec for transaction items, so we don't bloat the request\n      // body with it.\n      //\n      // content_type: 'application/json',\n      //\n      // The length is optional. It must be the number of bytes in req.Body\n      // encoded as UTF-8. Since the server can figure this out and would\n      // otherwise refuse events that report the length incorrectly, we decided\n      // not to send the length to avoid problems related to reporting the wrong\n      // size and to reduce request body size.\n      //\n      // length: new TextEncoder().encode(req.body).length,\n    });\n    // The trailing newline is optional. We intentionally don't send it to avoid\n    // sending unnecessary bytes.\n    //\n    // const envelope = `${envelopeHeaders}\\n${itemHeaders}\\n${req.body}\\n`;\n    const envelope = `${envelopeHeaders}\\n${itemHeaders}\\n${req.body}`;\n    req.body = envelope;\n  }\n\n  return req;\n}\n"]}import { Client, Options } from '@sentry/types';
/** A class object that can instantiate Client objects. */
export declare type ClientClass<F extends Client, O extends Options> = new (options: O) => F;
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
export declare function initAndBind<F extends Client, O extends Options>(clientClass: ClientClass<F, O>, options: O): void;
//# sourceMappingURL=sdk.d.ts.map{"version":3,"file":"sdk.d.ts","sourceRoot":"","sources":["../src/sdk.ts"],"names":[],"mappings":"AACA,OAAO,EAAE,MAAM,EAAE,OAAO,EAAE,MAAM,eAAe,CAAC;AAGhD,0DAA0D;AAC1D,oBAAY,WAAW,CAAC,CAAC,SAAS,MAAM,EAAE,CAAC,SAAS,OAAO,IAAI,KAAK,OAAO,EAAE,CAAC,KAAK,CAAC,CAAC;AAErF;;;;;;GAMG;AACH,wBAAgB,WAAW,CAAC,CAAC,SAAS,MAAM,EAAE,CAAC,SAAS,OAAO,EAAE,WAAW,EAAE,WAAW,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,OAAO,EAAE,CAAC,GAAG,IAAI,CAOjH"}import { getCurrentHub } from '@sentry/hub';
import { logger } from '@sentry/utils';
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
export function initAndBind(clientClass, options) {
    if (options.debug === true) {
        logger.enable();
    }
    var hub = getCurrentHub();
    var client = new clientClass(options);
    hub.bindClient(client);
}
//# sourceMappingURL=sdk.js.map{"version":3,"file":"sdk.js","sourceRoot":"","sources":["../src/sdk.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,aAAa,EAAE,MAAM,aAAa,CAAC;AAE5C,OAAO,EAAE,MAAM,EAAE,MAAM,eAAe,CAAC;AAKvC;;;;;;GAMG;AACH,MAAM,UAAU,WAAW,CAAsC,WAA8B,EAAE,OAAU;IACzG,IAAI,OAAO,CAAC,KAAK,KAAK,IAAI,EAAE;QAC1B,MAAM,CAAC,MAAM,EAAE,CAAC;KACjB;IACD,IAAM,GAAG,GAAG,aAAa,EAAE,CAAC;IAC5B,IAAM,MAAM,GAAG,IAAI,WAAW,CAAC,OAAO,CAAC,CAAC;IACxC,GAAG,CAAC,UAAU,CAAC,MAAM,CAAC,CAAC;AACzB,CAAC","sourcesContent":["import { getCurrentHub } from '@sentry/hub';\nimport { Client, Options } from '@sentry/types';\nimport { logger } from '@sentry/utils';\n\n/** A class object that can instantiate Client objects. */\nexport type ClientClass<F extends Client, O extends Options> = new (options: O) => F;\n\n/**\n * Internal function to create a new SDK client instance. The client is\n * installed and then bound to the current scope.\n *\n * @param clientClass The client class to instantiate.\n * @param options Options to pass to the client.\n */\nexport function initAndBind<F extends Client, O extends Options>(clientClass: ClientClass<F, O>, options: O): void {\n  if (options.debug === true) {\n    logger.enable();\n  }\n  const hub = getCurrentHub();\n  const client = new clientClass(options);\n  hub.bindClient(client);\n}\n"]}import { Event, Response, Transport } from '@sentry/types';
/** Noop transport */
export declare class NoopTransport implements Transport {
    /**
     * @inheritDoc
     */
    sendEvent(_: Event): PromiseLike<Response>;
    /**
     * @inheritDoc
     */
    close(_?: number): PromiseLike<boolean>;
}
//# sourceMappingURL=noop.d.ts.map{"version":3,"file":"noop.d.ts","sourceRoot":"","sources":["../../src/transports/noop.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,KAAK,EAAE,QAAQ,EAAU,SAAS,EAAE,MAAM,eAAe,CAAC;AAGnE,qBAAqB;AACrB,qBAAa,aAAc,YAAW,SAAS;IAC7C;;OAEG;IACI,SAAS,CAAC,CAAC,EAAE,KAAK,GAAG,WAAW,CAAC,QAAQ,CAAC;IAOjD;;OAEG;IACI,KAAK,CAAC,CAAC,CAAC,EAAE,MAAM,GAAG,WAAW,CAAC,OAAO,CAAC;CAG/C"}import { Status } from '@sentry/types';
import { SyncPromise } from '@sentry/utils';
/** Noop transport */
var NoopTransport = /** @class */ (function () {
    function NoopTransport() {
    }
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.sendEvent = function (_) {
        return SyncPromise.resolve({
            reason: "NoopTransport: Event has been skipped because no Dsn is configured.",
            status: Status.Skipped,
        });
    };
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.close = function (_) {
        return SyncPromise.resolve(true);
    };
    return NoopTransport;
}());
export { NoopTransport };
//# sourceMappingURL=noop.js.map{"version":3,"file":"noop.js","sourceRoot":"","sources":["../../src/transports/noop.ts"],"names":[],"mappings":"AAAA,OAAO,EAAmB,MAAM,EAAa,MAAM,eAAe,CAAC;AACnE,OAAO,EAAE,WAAW,EAAE,MAAM,eAAe,CAAC;AAE5C,qBAAqB;AACrB;IAAA;IAiBA,CAAC;IAhBC;;OAEG;IACI,iCAAS,GAAhB,UAAiB,CAAQ;QACvB,OAAO,WAAW,CAAC,OAAO,CAAC;YACzB,MAAM,EAAE,qEAAqE;YAC7E,MAAM,EAAE,MAAM,CAAC,OAAO;SACvB,CAAC,CAAC;IACL,CAAC;IAED;;OAEG;IACI,6BAAK,GAAZ,UAAa,CAAU;QACrB,OAAO,WAAW,CAAC,OAAO,CAAC,IAAI,CAAC,CAAC;IACnC,CAAC;IACH,oBAAC;AAAD,CAAC,AAjBD,IAiBC","sourcesContent":["import { Event, Response, Status, Transport } from '@sentry/types';\nimport { SyncPromise } from '@sentry/utils';\n\n/** Noop transport */\nexport class NoopTransport implements Transport {\n  /**\n   * @inheritDoc\n   */\n  public sendEvent(_: Event): PromiseLike<Response> {\n    return SyncPromise.resolve({\n      reason: `NoopTransport: Event has been skipped because no Dsn is configured.`,\n      status: Status.Skipped,\n    });\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public close(_?: number): PromiseLike<boolean> {\n    return SyncPromise.resolve(true);\n  }\n}\n"]}export declare const SDK_VERSION = "6.0.0";
//# sourceMappingURL=version.d.ts.map{"version":3,"file":"version.d.ts","sourceRoot":"","sources":["../src/version.ts"],"names":[],"mappings":"AAAA,eAAO,MAAM,WAAW,UAAU,CAAC"}export var SDK_VERSION = '6.0.0';
//# sourceMappingURL=version.js.map{"version":3,"file":"version.js","sourceRoot":"","sources":["../src/version.ts"],"names":[],"mappings":"AAAA,MAAM,CAAC,IAAM,WAAW,GAAG,OAAO,CAAC","sourcesContent":["export const SDK_VERSION = '6.0.0';\n"]}BSD 3-Clause License

Copyright (c) 2019, Sentry
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
{
  "name": "@sentry/core",
  "version": "6.0.0",
  "description": "Base implementation for all Sentry JavaScript SDKs",
  "repository": "git://github.com/getsentry/sentry-javascript.git",
  "homepage": "https://github.com/getsentry/sentry-javascript/tree/master/packages/core",
  "author": "Sentry",
  "license": "BSD-3-Clause",
  "engines": {
    "node": ">=6"
  },
  "main": "dist/index.js",
  "module": "esm/index.js",
  "types": "dist/index.d.ts",
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "@sentry/hub": "6.0.0",
    "@sentry/minimal": "6.0.0",
    "@sentry/types": "6.0.0",
    "@sentry/utils": "6.0.0",
    "tslib": "^1.9.3"
  },
  "devDependencies": {
    "@sentry-internal/eslint-config-sdk": "6.0.0",
    "eslint": "7.6.0",
    "jest": "^24.7.1",
    "npm-run-all": "^4.1.2",
    "prettier": "1.19.0",
    "rimraf": "^2.6.3",
    "typescript": "3.7.5"
  },
  "scripts": {
    "build": "run-p build:es5 build:esm",
    "build:es5": "tsc -p tsconfig.build.json",
    "build:esm": "tsc -p tsconfig.esm.json",
    "build:watch": "run-p build:watch:es5 build:watch:esm",
    "build:watch:es5": "tsc -p tsconfig.build.json -w --preserveWatchOutput",
    "build:watch:esm": "tsc -p tsconfig.esm.json -w --preserveWatchOutput",
    "clean": "rimraf dist coverage",
    "link:yarn": "yarn link",
    "lint": "run-s lint:prettier lint:eslint",
    "lint:prettier": "prettier --check \"{src,test}/**/*.ts\"",
    "lint:eslint": "eslint . --cache --cache-location '../../eslintcache/' --format stylish",
    "fix": "run-s fix:eslint fix:prettier",
    "fix:prettier": "prettier --write \"{src,test}/**/*.ts\"",
    "fix:eslint": "eslint . --format stylish --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "pack": "npm pack",
    "version": "node ../../scripts/versionbump.js src/version.ts"
  },
  "volta": {
    "extends": "../../package.json"
  },
  "jest": {
    "collectCoverage": true,
    "transform": {
      "^.+\\.ts$": "ts-jest"
    },
    "moduleFileExtensions": [
      "js",
      "ts"
    ],
    "testEnvironment": "node",
    "testMatch": [
      "**/*.test.ts"
    ],
    "globals": {
      "ts-jest": {
        "tsConfig": "./tsconfig.json",
        "diagnostics": false
      }
    }
  },
  "sideEffects": false
}
<p align="center">
  <a href="https://sentry.io" target="_blank" align="center">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" width="280">
  </a>
  <br />
</p>

# Sentry JavaScript SDK Core

[![npm version](https://img.shields.io/npm/v/@sentry/core.svg)](https://www.npmjs.com/package/@sentry/core)
[![npm dm](https://img.shields.io/npm/dm/@sentry/core.svg)](https://www.npmjs.com/package/@sentry/core)
[![npm dt](https://img.shields.io/npm/dt/@sentry/core.svg)](https://www.npmjs.com/package/@sentry/core)
[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getsentry.github.io/sentry-javascript/)

## Links

- [Official SDK Docs](https://docs.sentry.io/quickstart/)
- [TypeDoc](http://getsentry.github.io/sentry-javascript/)

## General

This package contains interface definitions, base classes and utilities for building Sentry JavaScript SDKs, like
`@sentry/node` or `@sentry/browser`.

Please consider all classes and exported functions and interfaces `internal`.
import { Breadcrumb, BreadcrumbHint, Client, CustomSamplingContext, Event, EventHint, Extra, Extras, Hub as HubInterface, Integration, IntegrationClass, Primitive, SessionContext, Severity, Span, SpanContext, Transaction, TransactionContext, User } from '@sentry/types';
import { Carrier, DomainAsCarrier, Layer } from './interfaces';
import { Scope } from './scope';
import { Session } from './session';
/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
export declare const API_VERSION = 3;
/**
 * @inheritDoc
 */
export declare class Hub implements HubInterface {
    private readonly _version;
    /** Is a {@link Layer}[] containing the client and scope */
    private readonly _stack;
    /** Contains the last event id of a captured event.  */
    private _lastEventId?;
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    constructor(client?: Client, scope?: Scope, _version?: number);
    /**
     * @inheritDoc
     */
    isOlderThan(version: number): boolean;
    /**
     * @inheritDoc
     */
    bindClient(client?: Client): void;
    /**
     * @inheritDoc
     */
    pushScope(): Scope;
    /**
     * @inheritDoc
     */
    popScope(): boolean;
    /**
     * @inheritDoc
     */
    withScope(callback: (scope: Scope) => void): void;
    /**
     * @inheritDoc
     */
    getClient<C extends Client>(): C | undefined;
    /** Returns the scope of the top stack. */
    getScope(): Scope | undefined;
    /** Returns the scope stack for domains or the process. */
    getStack(): Layer[];
    /** Returns the topmost scope layer in the order domain > local > process. */
    getStackTop(): Layer;
    /**
     * @inheritDoc
     */
    captureException(exception: any, hint?: EventHint): string;
    /**
     * @inheritDoc
     */
    captureMessage(message: string, level?: Severity, hint?: EventHint): string;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint): string;
    /**
     * @inheritDoc
     */
    lastEventId(): string | undefined;
    /**
     * @inheritDoc
     */
    addBreadcrumb(breadcrumb: Breadcrumb, hint?: BreadcrumbHint): void;
    /**
     * @inheritDoc
     */
    setUser(user: User | null): void;
    /**
     * @inheritDoc
     */
    setTags(tags: {
        [key: string]: Primitive;
    }): void;
    /**
     * @inheritDoc
     */
    setExtras(extras: Extras): void;
    /**
     * @inheritDoc
     */
    setTag(key: string, value: Primitive): void;
    /**
     * @inheritDoc
     */
    setExtra(key: string, extra: Extra): void;
    /**
     * @inheritDoc
     */
    setContext(name: string, context: {
        [key: string]: any;
    } | null): void;
    /**
     * @inheritDoc
     */
    configureScope(callback: (scope: Scope) => void): void;
    /**
     * @inheritDoc
     */
    run(callback: (hub: Hub) => void): void;
    /**
     * @inheritDoc
     */
    getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null;
    /**
     * @inheritDoc
     */
    startSpan(context: SpanContext): Span;
    /**
     * @inheritDoc
     */
    startTransaction(context: TransactionContext, customSamplingContext?: CustomSamplingContext): Transaction;
    /**
     * @inheritDoc
     */
    traceHeaders(): {
        [key: string]: string;
    };
    /**
     * @inheritDoc
     */
    startSession(context?: SessionContext): Session;
    /**
     * @inheritDoc
     */
    endSession(): void;
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client.
     * @param args Arguments to pass to the client function.
     */
    private _invokeClient;
    /**
     * Calls global extension method and binding current instance to the function call
     */
    private _callExtensionMethod;
}
/** Returns the global shim registry. */
export declare function getMainCarrier(): Carrier;
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
export declare function makeMain(hub: Hub): Hub;
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
export declare function getCurrentHub(): Hub;
/**
 * Returns the active domain, if one exists
 *
 * @returns The domain, or undefined if there is no active domain
 */
export declare function getActiveDomain(): DomainAsCarrier | undefined;
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
export declare function getHubFromCarrier(carrier: Carrier): Hub;
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 */
export declare function setHubOnCarrier(carrier: Carrier, hub: Hub): boolean;
//# sourceMappingURL=hub.d.ts.map{"version":3,"file":"hub.d.ts","sourceRoot":"","sources":["../src/hub.ts"],"names":[],"mappings":"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"}Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("@sentry/utils");
var scope_1 = require("./scope");
var session_1 = require("./session");
/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
exports.API_VERSION = 3;
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
var DEFAULT_BREADCRUMBS = 100;
/**
 * Absolute maximum number of breadcrumbs added to an event. The
 * `maxBreadcrumbs` option cannot be higher than this value.
 */
var MAX_BREADCRUMBS = 100;
/**
 * @inheritDoc
 */
var Hub = /** @class */ (function () {
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    function Hub(client, scope, _version) {
        if (scope === void 0) { scope = new scope_1.Scope(); }
        if (_version === void 0) { _version = exports.API_VERSION; }
        this._version = _version;
        /** Is a {@link Layer}[] containing the client and scope */
        this._stack = [{}];
        this.getStackTop().scope = scope;
        this.bindClient(client);
    }
    /**
     * @inheritDoc
     */
    Hub.prototype.isOlderThan = function (version) {
        return this._version < version;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.bindClient = function (client) {
        var top = this.getStackTop();
        top.client = client;
        if (client && client.setupIntegrations) {
            client.setupIntegrations();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.pushScope = function () {
        // We want to clone the content of prev scope
        var scope = scope_1.Scope.clone(this.getScope());
        this.getStack().push({
            client: this.getClient(),
            scope: scope,
        });
        return scope;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.popScope = function () {
        if (this.getStack().length <= 1)
            return false;
        return !!this.getStack().pop();
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.withScope = function (callback) {
        var scope = this.pushScope();
        try {
            callback(scope);
        }
        finally {
            this.popScope();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getClient = function () {
        return this.getStackTop().client;
    };
    /** Returns the scope of the top stack. */
    Hub.prototype.getScope = function () {
        return this.getStackTop().scope;
    };
    /** Returns the scope stack for domains or the process. */
    Hub.prototype.getStack = function () {
        return this._stack;
    };
    /** Returns the topmost scope layer in the order domain > local > process. */
    Hub.prototype.getStackTop = function () {
        return this._stack[this._stack.length - 1];
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Hub.prototype.captureException = function (exception, hint) {
        var eventId = (this._lastEventId = utils_1.uuid4());
        var finalHint = hint;
        // If there's no explicit hint provided, mimick the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error('Sentry syntheticException');
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: exception,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureException', exception, tslib_1.__assign(tslib_1.__assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureMessage = function (message, level, hint) {
        var eventId = (this._lastEventId = utils_1.uuid4());
        var finalHint = hint;
        // If there's no explicit hint provided, mimick the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error(message);
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: message,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureMessage', message, level, tslib_1.__assign(tslib_1.__assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureEvent = function (event, hint) {
        var eventId = (this._lastEventId = utils_1.uuid4());
        this._invokeClient('captureEvent', event, tslib_1.__assign(tslib_1.__assign({}, hint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.lastEventId = function () {
        return this._lastEventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.addBreadcrumb = function (breadcrumb, hint) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope || !client)
            return;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _b = (client.getOptions && client.getOptions()) || {}, _c = _b.beforeBreadcrumb, beforeBreadcrumb = _c === void 0 ? null : _c, _d = _b.maxBreadcrumbs, maxBreadcrumbs = _d === void 0 ? DEFAULT_BREADCRUMBS : _d;
        if (maxBreadcrumbs <= 0)
            return;
        var timestamp = utils_1.dateTimestampInSeconds();
        var mergedBreadcrumb = tslib_1.__assign({ timestamp: timestamp }, breadcrumb);
        var finalBreadcrumb = beforeBreadcrumb
            ? utils_1.consoleSandbox(function () { return beforeBreadcrumb(mergedBreadcrumb, hint); })
            : mergedBreadcrumb;
        if (finalBreadcrumb === null)
            return;
        scope.addBreadcrumb(finalBreadcrumb, Math.min(maxBreadcrumbs, MAX_BREADCRUMBS));
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setUser = function (user) {
        var scope = this.getScope();
        if (scope)
            scope.setUser(user);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTags = function (tags) {
        var scope = this.getScope();
        if (scope)
            scope.setTags(tags);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtras = function (extras) {
        var scope = this.getScope();
        if (scope)
            scope.setExtras(extras);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTag = function (key, value) {
        var scope = this.getScope();
        if (scope)
            scope.setTag(key, value);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtra = function (key, extra) {
        var scope = this.getScope();
        if (scope)
            scope.setExtra(key, extra);
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype.setContext = function (name, context) {
        var scope = this.getScope();
        if (scope)
            scope.setContext(name, context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.configureScope = function (callback) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (scope && client) {
            callback(scope);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.run = function (callback) {
        var oldHub = makeMain(this);
        try {
            callback(this);
        }
        finally {
            makeMain(oldHub);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getIntegration = function (integration) {
        var client = this.getClient();
        if (!client)
            return null;
        try {
            return client.getIntegration(integration);
        }
        catch (_oO) {
            utils_1.logger.warn("Cannot retrieve integration " + integration.id + " from the current Hub");
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSpan = function (context) {
        return this._callExtensionMethod('startSpan', context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startTransaction = function (context, customSamplingContext) {
        return this._callExtensionMethod('startTransaction', context, customSamplingContext);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.traceHeaders = function () {
        return this._callExtensionMethod('traceHeaders');
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSession = function (context) {
        // End existing session if there's one
        this.endSession();
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        var _b = (client && client.getOptions()) || {}, release = _b.release, environment = _b.environment;
        var session = new session_1.Session(tslib_1.__assign(tslib_1.__assign({ release: release,
            environment: environment }, (scope && { user: scope.getUser() })), context));
        if (scope) {
            scope.setSession(session);
        }
        return session;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.endSession = function () {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope)
            return;
        var session = scope.getSession && scope.getSession();
        if (session) {
            session.close();
            if (client && client.captureSession) {
                client.captureSession(session);
            }
            scope.setSession();
        }
    };
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client.
     * @param args Arguments to pass to the client function.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._invokeClient = function (method) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _b = this.getStackTop(), scope = _b.scope, client = _b.client;
        if (client && client[method]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (_a = client)[method].apply(_a, tslib_1.__spread(args, [scope]));
        }
    };
    /**
     * Calls global extension method and binding current instance to the function call
     */
    // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._callExtensionMethod = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var carrier = getMainCarrier();
        var sentry = carrier.__SENTRY__;
        if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
            return sentry.extensions[method].apply(this, args);
        }
        utils_1.logger.warn("Extension method " + method + " couldn't be found, doing nothing.");
    };
    return Hub;
}());
exports.Hub = Hub;
/** Returns the global shim registry. */
function getMainCarrier() {
    var carrier = utils_1.getGlobalObject();
    carrier.__SENTRY__ = carrier.__SENTRY__ || {
        extensions: {},
        hub: undefined,
    };
    return carrier;
}
exports.getMainCarrier = getMainCarrier;
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
function makeMain(hub) {
    var registry = getMainCarrier();
    var oldHub = getHubFromCarrier(registry);
    setHubOnCarrier(registry, hub);
    return oldHub;
}
exports.makeMain = makeMain;
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
function getCurrentHub() {
    // Get main carrier (global for every environment)
    var registry = getMainCarrier();
    // If there's no hub, or its an old API, assign a new one
    if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(exports.API_VERSION)) {
        setHubOnCarrier(registry, new Hub());
    }
    // Prefer domains over global if they are there (applicable only to Node environment)
    if (utils_1.isNodeEnv()) {
        return getHubFromActiveDomain(registry);
    }
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
}
exports.getCurrentHub = getCurrentHub;
/**
 * Returns the active domain, if one exists
 *
 * @returns The domain, or undefined if there is no active domain
 */
function getActiveDomain() {
    var sentry = getMainCarrier().__SENTRY__;
    return sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;
}
exports.getActiveDomain = getActiveDomain;
/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
    try {
        var activeDomain = getActiveDomain();
        // If there's no active domain, just return global hub
        if (!activeDomain) {
            return getHubFromCarrier(registry);
        }
        // If there's no hub on current domain, or it's an old API, assign a new one
        if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(exports.API_VERSION)) {
            var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
            setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, scope_1.Scope.clone(registryHubTopStack.scope)));
        }
        // Return hub that lives on a domain
        return getHubFromCarrier(activeDomain);
    }
    catch (_Oo) {
        // Return hub that lives on a global object
        return getHubFromCarrier(registry);
    }
}
/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
function hasHubOnCarrier(carrier) {
    return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
function getHubFromCarrier(carrier) {
    if (carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub)
        return carrier.__SENTRY__.hub;
    carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    carrier.__SENTRY__.hub = new Hub();
    return carrier.__SENTRY__.hub;
}
exports.getHubFromCarrier = getHubFromCarrier;
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 */
function setHubOnCarrier(carrier, hub) {
    if (!carrier)
        return false;
    carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    carrier.__SENTRY__.hub = hub;
    return true;
}
exports.setHubOnCarrier = setHubOnCarrier;
//# sourceMappingURL=hub.js.map{"version":3,"file":"hub.js","sourceRoot":"","sources":["../src/hub.ts"],"names":[],"mappings":"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","sourcesContent":["/* eslint-disable max-lines */\nimport {\n  Breadcrumb,\n  BreadcrumbHint,\n  Client,\n  CustomSamplingContext,\n  Event,\n  EventHint,\n  Extra,\n  Extras,\n  Hub as HubInterface,\n  Integration,\n  IntegrationClass,\n  Primitive,\n  SessionContext,\n  Severity,\n  Span,\n  SpanContext,\n  Transaction,\n  TransactionContext,\n  User,\n} from '@sentry/types';\nimport { consoleSandbox, dateTimestampInSeconds, getGlobalObject, isNodeEnv, logger, uuid4 } from '@sentry/utils';\n\nimport { Carrier, DomainAsCarrier, Layer } from './interfaces';\nimport { Scope } from './scope';\nimport { Session } from './session';\n\n/**\n * API compatibility version of this hub.\n *\n * WARNING: This number should only be increased when the global interface\n * changes and new methods are introduced.\n *\n * @hidden\n */\nexport const API_VERSION = 3;\n\n/**\n * Default maximum number of breadcrumbs added to an event. Can be overwritten\n * with {@link Options.maxBreadcrumbs}.\n */\nconst DEFAULT_BREADCRUMBS = 100;\n\n/**\n * Absolute maximum number of breadcrumbs added to an event. The\n * `maxBreadcrumbs` option cannot be higher than this value.\n */\nconst MAX_BREADCRUMBS = 100;\n\n/**\n * @inheritDoc\n */\nexport class Hub implements HubInterface {\n  /** Is a {@link Layer}[] containing the client and scope */\n  private readonly _stack: Layer[] = [{}];\n\n  /** Contains the last event id of a captured event.  */\n  private _lastEventId?: string;\n\n  /**\n   * Creates a new instance of the hub, will push one {@link Layer} into the\n   * internal stack on creation.\n   *\n   * @param client bound to the hub.\n   * @param scope bound to the hub.\n   * @param version number, higher number means higher priority.\n   */\n  public constructor(client?: Client, scope: Scope = new Scope(), private readonly _version: number = API_VERSION) {\n    this.getStackTop().scope = scope;\n    this.bindClient(client);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public isOlderThan(version: number): boolean {\n    return this._version < version;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public bindClient(client?: Client): void {\n    const top = this.getStackTop();\n    top.client = client;\n    if (client && client.setupIntegrations) {\n      client.setupIntegrations();\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public pushScope(): Scope {\n    // We want to clone the content of prev scope\n    const scope = Scope.clone(this.getScope());\n    this.getStack().push({\n      client: this.getClient(),\n      scope,\n    });\n    return scope;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public popScope(): boolean {\n    if (this.getStack().length <= 1) return false;\n    return !!this.getStack().pop();\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public withScope(callback: (scope: Scope) => void): void {\n    const scope = this.pushScope();\n    try {\n      callback(scope);\n    } finally {\n      this.popScope();\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getClient<C extends Client>(): C | undefined {\n    return this.getStackTop().client as C;\n  }\n\n  /** Returns the scope of the top stack. */\n  public getScope(): Scope | undefined {\n    return this.getStackTop().scope;\n  }\n\n  /** Returns the scope stack for domains or the process. */\n  public getStack(): Layer[] {\n    return this._stack;\n  }\n\n  /** Returns the topmost scope layer in the order domain > local > process. */\n  public getStackTop(): Layer {\n    return this._stack[this._stack.length - 1];\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  public captureException(exception: any, hint?: EventHint): string {\n    const eventId = (this._lastEventId = uuid4());\n    let finalHint = hint;\n\n    // If there's no explicit hint provided, mimick the same thing that would happen\n    // in the minimal itself to create a consistent behavior.\n    // We don't do this in the client, as it's the lowest level API, and doing this,\n    // would prevent user from having full control over direct calls.\n    if (!hint) {\n      let syntheticException: Error;\n      try {\n        throw new Error('Sentry syntheticException');\n      } catch (exception) {\n        syntheticException = exception as Error;\n      }\n      finalHint = {\n        originalException: exception,\n        syntheticException,\n      };\n    }\n\n    this._invokeClient('captureException', exception, {\n      ...finalHint,\n      event_id: eventId,\n    });\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureMessage(message: string, level?: Severity, hint?: EventHint): string {\n    const eventId = (this._lastEventId = uuid4());\n    let finalHint = hint;\n\n    // If there's no explicit hint provided, mimick the same thing that would happen\n    // in the minimal itself to create a consistent behavior.\n    // We don't do this in the client, as it's the lowest level API, and doing this,\n    // would prevent user from having full control over direct calls.\n    if (!hint) {\n      let syntheticException: Error;\n      try {\n        throw new Error(message);\n      } catch (exception) {\n        syntheticException = exception as Error;\n      }\n      finalHint = {\n        originalException: message,\n        syntheticException,\n      };\n    }\n\n    this._invokeClient('captureMessage', message, level, {\n      ...finalHint,\n      event_id: eventId,\n    });\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureEvent(event: Event, hint?: EventHint): string {\n    const eventId = (this._lastEventId = uuid4());\n    this._invokeClient('captureEvent', event, {\n      ...hint,\n      event_id: eventId,\n    });\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public lastEventId(): string | undefined {\n    return this._lastEventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public addBreadcrumb(breadcrumb: Breadcrumb, hint?: BreadcrumbHint): void {\n    const { scope, client } = this.getStackTop();\n\n    if (!scope || !client) return;\n\n    // eslint-disable-next-line @typescript-eslint/unbound-method\n    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } =\n      (client.getOptions && client.getOptions()) || {};\n\n    if (maxBreadcrumbs <= 0) return;\n\n    const timestamp = dateTimestampInSeconds();\n    const mergedBreadcrumb = { timestamp, ...breadcrumb };\n    const finalBreadcrumb = beforeBreadcrumb\n      ? (consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) as Breadcrumb | null)\n      : mergedBreadcrumb;\n\n    if (finalBreadcrumb === null) return;\n\n    scope.addBreadcrumb(finalBreadcrumb, Math.min(maxBreadcrumbs, MAX_BREADCRUMBS));\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setUser(user: User | null): void {\n    const scope = this.getScope();\n    if (scope) scope.setUser(user);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTags(tags: { [key: string]: Primitive }): void {\n    const scope = this.getScope();\n    if (scope) scope.setTags(tags);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtras(extras: Extras): void {\n    const scope = this.getScope();\n    if (scope) scope.setExtras(extras);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTag(key: string, value: Primitive): void {\n    const scope = this.getScope();\n    if (scope) scope.setTag(key, value);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtra(key: string, extra: Extra): void {\n    const scope = this.getScope();\n    if (scope) scope.setExtra(key, extra);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  public setContext(name: string, context: { [key: string]: any } | null): void {\n    const scope = this.getScope();\n    if (scope) scope.setContext(name, context);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public configureScope(callback: (scope: Scope) => void): void {\n    const { scope, client } = this.getStackTop();\n    if (scope && client) {\n      callback(scope);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public run(callback: (hub: Hub) => void): void {\n    const oldHub = makeMain(this);\n    try {\n      callback(this);\n    } finally {\n      makeMain(oldHub);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null {\n    const client = this.getClient();\n    if (!client) return null;\n    try {\n      return client.getIntegration(integration);\n    } catch (_oO) {\n      logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);\n      return null;\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public startSpan(context: SpanContext): Span {\n    return this._callExtensionMethod('startSpan', context);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public startTransaction(context: TransactionContext, customSamplingContext?: CustomSamplingContext): Transaction {\n    return this._callExtensionMethod('startTransaction', context, customSamplingContext);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public traceHeaders(): { [key: string]: string } {\n    return this._callExtensionMethod<{ [key: string]: string }>('traceHeaders');\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public startSession(context?: SessionContext): Session {\n    // End existing session if there's one\n    this.endSession();\n\n    const { scope, client } = this.getStackTop();\n    const { release, environment } = (client && client.getOptions()) || {};\n    const session = new Session({\n      release,\n      environment,\n      ...(scope && { user: scope.getUser() }),\n      ...context,\n    });\n    if (scope) {\n      scope.setSession(session);\n    }\n    return session;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public endSession(): void {\n    const { scope, client } = this.getStackTop();\n    if (!scope) return;\n\n    const session = scope.getSession && scope.getSession();\n    if (session) {\n      session.close();\n      if (client && client.captureSession) {\n        client.captureSession(session);\n      }\n      scope.setSession();\n    }\n  }\n\n  /**\n   * Internal helper function to call a method on the top client if it exists.\n   *\n   * @param method The method to call on the client.\n   * @param args Arguments to pass to the client function.\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  private _invokeClient<M extends keyof Client>(method: M, ...args: any[]): void {\n    const { scope, client } = this.getStackTop();\n    if (client && client[method]) {\n      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any\n      (client as any)[method](...args, scope);\n    }\n  }\n\n  /**\n   * Calls global extension method and binding current instance to the function call\n   */\n  // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  private _callExtensionMethod<T>(method: string, ...args: any[]): T {\n    const carrier = getMainCarrier();\n    const sentry = carrier.__SENTRY__;\n    if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {\n      return sentry.extensions[method].apply(this, args);\n    }\n    logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);\n  }\n}\n\n/** Returns the global shim registry. */\nexport function getMainCarrier(): Carrier {\n  const carrier = getGlobalObject();\n  carrier.__SENTRY__ = carrier.__SENTRY__ || {\n    extensions: {},\n    hub: undefined,\n  };\n  return carrier;\n}\n\n/**\n * Replaces the current main hub with the passed one on the global object\n *\n * @returns The old replaced hub\n */\nexport function makeMain(hub: Hub): Hub {\n  const registry = getMainCarrier();\n  const oldHub = getHubFromCarrier(registry);\n  setHubOnCarrier(registry, hub);\n  return oldHub;\n}\n\n/**\n * Returns the default hub instance.\n *\n * If a hub is already registered in the global carrier but this module\n * contains a more recent version, it replaces the registered version.\n * Otherwise, the currently registered hub will be returned.\n */\nexport function getCurrentHub(): Hub {\n  // Get main carrier (global for every environment)\n  const registry = getMainCarrier();\n\n  // If there's no hub, or its an old API, assign a new one\n  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {\n    setHubOnCarrier(registry, new Hub());\n  }\n\n  // Prefer domains over global if they are there (applicable only to Node environment)\n  if (isNodeEnv()) {\n    return getHubFromActiveDomain(registry);\n  }\n  // Return hub that lives on a global object\n  return getHubFromCarrier(registry);\n}\n\n/**\n * Returns the active domain, if one exists\n *\n * @returns The domain, or undefined if there is no active domain\n */\nexport function getActiveDomain(): DomainAsCarrier | undefined {\n  const sentry = getMainCarrier().__SENTRY__;\n\n  return sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;\n}\n\n/**\n * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist\n * @returns discovered hub\n */\nfunction getHubFromActiveDomain(registry: Carrier): Hub {\n  try {\n    const activeDomain = getActiveDomain();\n\n    // If there's no active domain, just return global hub\n    if (!activeDomain) {\n      return getHubFromCarrier(registry);\n    }\n\n    // If there's no hub on current domain, or it's an old API, assign a new one\n    if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {\n      const registryHubTopStack = getHubFromCarrier(registry).getStackTop();\n      setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, Scope.clone(registryHubTopStack.scope)));\n    }\n\n    // Return hub that lives on a domain\n    return getHubFromCarrier(activeDomain);\n  } catch (_Oo) {\n    // Return hub that lives on a global object\n    return getHubFromCarrier(registry);\n  }\n}\n\n/**\n * This will tell whether a carrier has a hub on it or not\n * @param carrier object\n */\nfunction hasHubOnCarrier(carrier: Carrier): boolean {\n  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);\n}\n\n/**\n * This will create a new {@link Hub} and add to the passed object on\n * __SENTRY__.hub.\n * @param carrier object\n * @hidden\n */\nexport function getHubFromCarrier(carrier: Carrier): Hub {\n  if (carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub) return carrier.__SENTRY__.hub;\n  carrier.__SENTRY__ = carrier.__SENTRY__ || {};\n  carrier.__SENTRY__.hub = new Hub();\n  return carrier.__SENTRY__.hub;\n}\n\n/**\n * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute\n * @param carrier object\n * @param hub Hub\n */\nexport function setHubOnCarrier(carrier: Carrier, hub: Hub): boolean {\n  if (!carrier) return false;\n  carrier.__SENTRY__ = carrier.__SENTRY__ || {};\n  carrier.__SENTRY__.hub = hub;\n  return true;\n}\n"]}export { Carrier, DomainAsCarrier, Layer } from './interfaces';
export { addGlobalEventProcessor, Scope } from './scope';
export { Session } from './session';
export { getActiveDomain, getCurrentHub, getHubFromCarrier, getMainCarrier, Hub, makeMain, setHubOnCarrier, } from './hub';
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,OAAO,EAAE,eAAe,EAAE,KAAK,EAAE,MAAM,cAAc,CAAC;AAC/D,OAAO,EAAE,uBAAuB,EAAE,KAAK,EAAE,MAAM,SAAS,CAAC;AACzD,OAAO,EAAE,OAAO,EAAE,MAAM,WAAW,CAAC;AACpC,OAAO,EACL,eAAe,EACf,aAAa,EACb,iBAAiB,EACjB,cAAc,EACd,GAAG,EACH,QAAQ,EACR,eAAe,GAChB,MAAM,OAAO,CAAC"}Object.defineProperty(exports, "__esModule", { value: true });
var scope_1 = require("./scope");
exports.addGlobalEventProcessor = scope_1.addGlobalEventProcessor;
exports.Scope = scope_1.Scope;
var session_1 = require("./session");
exports.Session = session_1.Session;
var hub_1 = require("./hub");
exports.getActiveDomain = hub_1.getActiveDomain;
exports.getCurrentHub = hub_1.getCurrentHub;
exports.getHubFromCarrier = hub_1.getHubFromCarrier;
exports.getMainCarrier = hub_1.getMainCarrier;
exports.Hub = hub_1.Hub;
exports.makeMain = hub_1.makeMain;
exports.setHubOnCarrier = hub_1.setHubOnCarrier;
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":";AACA,iCAAyD;AAAhD,0CAAA,uBAAuB,CAAA;AAAE,wBAAA,KAAK,CAAA;AACvC,qCAAoC;AAA3B,4BAAA,OAAO,CAAA;AAChB,6BAQe;AAPb,gCAAA,eAAe,CAAA;AACf,8BAAA,aAAa,CAAA;AACb,kCAAA,iBAAiB,CAAA;AACjB,+BAAA,cAAc,CAAA;AACd,oBAAA,GAAG,CAAA;AACH,yBAAA,QAAQ,CAAA;AACR,gCAAA,eAAe,CAAA","sourcesContent":["export { Carrier, DomainAsCarrier, Layer } from './interfaces';\nexport { addGlobalEventProcessor, Scope } from './scope';\nexport { Session } from './session';\nexport {\n  getActiveDomain,\n  getCurrentHub,\n  getHubFromCarrier,\n  getMainCarrier,\n  Hub,\n  makeMain,\n  setHubOnCarrier,\n} from './hub';\n"]}import { Client } from '@sentry/types';
import { Hub } from './hub';
import { Scope } from './scope';
/**
 * A layer in the process stack.
 * @hidden
 */
export interface Layer {
    client?: Client;
    scope?: Scope;
}
/**
 * An object that contains a hub and maintains a scope stack.
 * @hidden
 */
export interface Carrier {
    __SENTRY__?: {
        hub?: Hub;
        /**
         * Extra Hub properties injected by various SDKs
         */
        extensions?: {
            /** Hack to prevent bundlers from breaking our usage of the domain package in the cross-platform Hub package */
            domain?: {
                [key: string]: any;
            };
        } & {
            /** Extension methods for the hub, which are bound to the current Hub instance */
            [key: string]: Function;
        };
    };
}
export interface DomainAsCarrier extends Carrier {
    members: {
        [key: string]: any;
    }[];
}
//# sourceMappingURL=interfaces.d.ts.map{"version":3,"file":"interfaces.d.ts","sourceRoot":"","sources":["../src/interfaces.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,MAAM,EAAE,MAAM,eAAe,CAAC;AAEvC,OAAO,EAAE,GAAG,EAAE,MAAM,OAAO,CAAC;AAC5B,OAAO,EAAE,KAAK,EAAE,MAAM,SAAS,CAAC;AAEhC;;;GAGG;AACH,MAAM,WAAW,KAAK;IACpB,MAAM,CAAC,EAAE,MAAM,CAAC;IAChB,KAAK,CAAC,EAAE,KAAK,CAAC;CACf;AAED;;;GAGG;AACH,MAAM,WAAW,OAAO;IACtB,UAAU,CAAC,EAAE;QACX,GAAG,CAAC,EAAE,GAAG,CAAC;QACV;;WAEG;QACH,UAAU,CAAC,EAAE;YACX,+GAA+G;YAE/G,MAAM,CAAC,EAAE;gBAAE,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAA;aAAE,CAAC;SACjC,GAAG;YACF,iFAAiF;YAEjF,CAAC,GAAG,EAAE,MAAM,GAAG,QAAQ,CAAC;SACzB,CAAC;KACH,CAAC;CACH;AAED,MAAM,WAAW,eAAgB,SAAQ,OAAO;IAE9C,OAAO,EAAE;QAAE,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAA;KAAE,EAAE,CAAC;CACnC"}Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=interfaces.js.map{"version":3,"file":"interfaces.js","sourceRoot":"","sources":["../src/interfaces.ts"],"names":[],"mappings":"","sourcesContent":["import { Client } from '@sentry/types';\n\nimport { Hub } from './hub';\nimport { Scope } from './scope';\n\n/**\n * A layer in the process stack.\n * @hidden\n */\nexport interface Layer {\n  client?: Client;\n  scope?: Scope;\n}\n\n/**\n * An object that contains a hub and maintains a scope stack.\n * @hidden\n */\nexport interface Carrier {\n  __SENTRY__?: {\n    hub?: Hub;\n    /**\n     * Extra Hub properties injected by various SDKs\n     */\n    extensions?: {\n      /** Hack to prevent bundlers from breaking our usage of the domain package in the cross-platform Hub package */\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      domain?: { [key: string]: any };\n    } & {\n      /** Extension methods for the hub, which are bound to the current Hub instance */\n      // eslint-disable-next-line @typescript-eslint/ban-types\n      [key: string]: Function;\n    };\n  };\n}\n\nexport interface DomainAsCarrier extends Carrier {\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  members: { [key: string]: any }[];\n}\n"]}import { Breadcrumb, CaptureContext, Context, Contexts, Event, EventHint, EventProcessor, Extra, Extras, Primitive, Scope as ScopeInterface, Severity, Span, Transaction, User } from '@sentry/types';
import { Session } from './session';
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
export declare class Scope implements ScopeInterface {
    /** Flag if notifiying is happening. */
    protected _notifyingListeners: boolean;
    /** Callback for client to receive scope changes. */
    protected _scopeListeners: Array<(scope: Scope) => void>;
    /** Callback list that will be called after {@link applyToEvent}. */
    protected _eventProcessors: EventProcessor[];
    /** Array of breadcrumbs. */
    protected _breadcrumbs: Breadcrumb[];
    /** User */
    protected _user: User;
    /** Tags */
    protected _tags: {
        [key: string]: Primitive;
    };
    /** Extra */
    protected _extra: Extras;
    /** Contexts */
    protected _contexts: Contexts;
    /** Fingerprint */
    protected _fingerprint?: string[];
    /** Severity */
    protected _level?: Severity;
    /** Transaction Name */
    protected _transactionName?: string;
    /** Span */
    protected _span?: Span;
    /** Session */
    protected _session?: Session;
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    static clone(scope?: Scope): Scope;
    /**
     * Add internal on change listener. Used for sub SDKs that need to store the scope.
     * @hidden
     */
    addScopeListener(callback: (scope: Scope) => void): void;
    /**
     * @inheritDoc
     */
    addEventProcessor(callback: EventProcessor): this;
    /**
     * @inheritDoc
     */
    setUser(user: User | null): this;
    /**
     * @inheritDoc
     */
    getUser(): User | undefined;
    /**
     * @inheritDoc
     */
    setTags(tags: {
        [key: string]: Primitive;
    }): this;
    /**
     * @inheritDoc
     */
    setTag(key: string, value: Primitive): this;
    /**
     * @inheritDoc
     */
    setExtras(extras: Extras): this;
    /**
     * @inheritDoc
     */
    setExtra(key: string, extra: Extra): this;
    /**
     * @inheritDoc
     */
    setFingerprint(fingerprint: string[]): this;
    /**
     * @inheritDoc
     */
    setLevel(level: Severity): this;
    /**
     * @inheritDoc
     */
    setTransactionName(name?: string): this;
    /**
     * Can be removed in major version.
     * @deprecated in favor of {@link this.setTransactionName}
     */
    setTransaction(name?: string): this;
    /**
     * @inheritDoc
     */
    setContext(key: string, context: Context | null): this;
    /**
     * @inheritDoc
     */
    setSpan(span?: Span): this;
    /**
     * @inheritDoc
     */
    getSpan(): Span | undefined;
    /**
     * @inheritDoc
     */
    getTransaction(): Transaction | undefined;
    /**
     * @inheritDoc
     */
    setSession(session?: Session): this;
    /**
     * @inheritDoc
     */
    getSession(): Session | undefined;
    /**
     * @inheritDoc
     */
    update(captureContext?: CaptureContext): this;
    /**
     * @inheritDoc
     */
    clear(): this;
    /**
     * @inheritDoc
     */
    addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): this;
    /**
     * @inheritDoc
     */
    clearBreadcrumbs(): this;
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event Event
     * @param hint May contain additional informartion about the original exception.
     * @hidden
     */
    applyToEvent(event: Event, hint?: EventHint): PromiseLike<Event | null>;
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    protected _notifyEventProcessors(processors: EventProcessor[], event: Event | null, hint?: EventHint, index?: number): PromiseLike<Event | null>;
    /**
     * This will be called on every set call.
     */
    protected _notifyScopeListeners(): void;
    /**
     * Applies fingerprint from the scope to the event if there's one,
     * uses message if there's one instead or get rid of empty fingerprint
     */
    private _applyFingerprint;
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
export declare function addGlobalEventProcessor(callback: EventProcessor): void;
//# sourceMappingURL=scope.d.ts.map{"version":3,"file":"scope.d.ts","sourceRoot":"","sources":["../src/scope.ts"],"names":[],"mappings":"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"}Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("@sentry/utils");
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
var Scope = /** @class */ (function () {
    function Scope() {
        /** Flag if notifiying is happening. */
        this._notifyingListeners = false;
        /** Callback for client to receive scope changes. */
        this._scopeListeners = [];
        /** Callback list that will be called after {@link applyToEvent}. */
        this._eventProcessors = [];
        /** Array of breadcrumbs. */
        this._breadcrumbs = [];
        /** User */
        this._user = {};
        /** Tags */
        this._tags = {};
        /** Extra */
        this._extra = {};
        /** Contexts */
        this._contexts = {};
    }
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    Scope.clone = function (scope) {
        var newScope = new Scope();
        if (scope) {
            newScope._breadcrumbs = tslib_1.__spread(scope._breadcrumbs);
            newScope._tags = tslib_1.__assign({}, scope._tags);
            newScope._extra = tslib_1.__assign({}, scope._extra);
            newScope._contexts = tslib_1.__assign({}, scope._contexts);
            newScope._user = scope._user;
            newScope._level = scope._level;
            newScope._span = scope._span;
            newScope._session = scope._session;
            newScope._transactionName = scope._transactionName;
            newScope._fingerprint = scope._fingerprint;
            newScope._eventProcessors = tslib_1.__spread(scope._eventProcessors);
        }
        return newScope;
    };
    /**
     * Add internal on change listener. Used for sub SDKs that need to store the scope.
     * @hidden
     */
    Scope.prototype.addScopeListener = function (callback) {
        this._scopeListeners.push(callback);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addEventProcessor = function (callback) {
        this._eventProcessors.push(callback);
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setUser = function (user) {
        this._user = user || {};
        if (this._session) {
            this._session.update({ user: user });
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getUser = function () {
        return this._user;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTags = function (tags) {
        this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), tags);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTag = function (key, value) {
        var _a;
        this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), (_a = {}, _a[key] = value, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtras = function (extras) {
        this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), extras);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtra = function (key, extra) {
        var _a;
        this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), (_a = {}, _a[key] = extra, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setFingerprint = function (fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setLevel = function (level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTransactionName = function (name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Can be removed in major version.
     * @deprecated in favor of {@link this.setTransactionName}
     */
    Scope.prototype.setTransaction = function (name) {
        return this.setTransactionName(name);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setContext = function (key, context) {
        var _a;
        if (context === null) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._contexts[key];
        }
        else {
            this._contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), (_a = {}, _a[key] = context, _a));
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSpan = function (span) {
        this._span = span;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSpan = function () {
        return this._span;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getTransaction = function () {
        var _a, _b, _c, _d;
        // often, this span will be a transaction, but it's not guaranteed to be
        var span = this.getSpan();
        // try it the new way first
        if ((_a = span) === null || _a === void 0 ? void 0 : _a.transaction) {
            return (_b = span) === null || _b === void 0 ? void 0 : _b.transaction;
        }
        // fallback to the old way (known bug: this only finds transactions with sampled = true)
        if ((_d = (_c = span) === null || _c === void 0 ? void 0 : _c.spanRecorder) === null || _d === void 0 ? void 0 : _d.spans[0]) {
            return span.spanRecorder.spans[0];
        }
        // neither way found a transaction
        return undefined;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSession = function (session) {
        if (!session) {
            delete this._session;
        }
        else {
            this._session = session;
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSession = function () {
        return this._session;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.update = function (captureContext) {
        if (!captureContext) {
            return this;
        }
        if (typeof captureContext === 'function') {
            var updatedScope = captureContext(this);
            return updatedScope instanceof Scope ? updatedScope : this;
        }
        if (captureContext instanceof Scope) {
            this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), captureContext._tags);
            this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), captureContext._extra);
            this._contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), captureContext._contexts);
            if (captureContext._user && Object.keys(captureContext._user).length) {
                this._user = captureContext._user;
            }
            if (captureContext._level) {
                this._level = captureContext._level;
            }
            if (captureContext._fingerprint) {
                this._fingerprint = captureContext._fingerprint;
            }
        }
        else if (utils_1.isPlainObject(captureContext)) {
            // eslint-disable-next-line no-param-reassign
            captureContext = captureContext;
            this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), captureContext.tags);
            this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), captureContext.extra);
            this._contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), captureContext.contexts);
            if (captureContext.user) {
                this._user = captureContext.user;
            }
            if (captureContext.level) {
                this._level = captureContext.level;
            }
            if (captureContext.fingerprint) {
                this._fingerprint = captureContext.fingerprint;
            }
        }
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clear = function () {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = undefined;
        this._transactionName = undefined;
        this._fingerprint = undefined;
        this._span = undefined;
        this._session = undefined;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
        var mergedBreadcrumb = tslib_1.__assign({ timestamp: utils_1.dateTimestampInSeconds() }, breadcrumb);
        this._breadcrumbs =
            maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0
                ? tslib_1.__spread(this._breadcrumbs, [mergedBreadcrumb]).slice(-maxBreadcrumbs)
                : tslib_1.__spread(this._breadcrumbs, [mergedBreadcrumb]);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clearBreadcrumbs = function () {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event Event
     * @param hint May contain additional informartion about the original exception.
     * @hidden
     */
    Scope.prototype.applyToEvent = function (event, hint) {
        var _a;
        if (this._extra && Object.keys(this._extra).length) {
            event.extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), event.extra);
        }
        if (this._tags && Object.keys(this._tags).length) {
            event.tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), event.tags);
        }
        if (this._user && Object.keys(this._user).length) {
            event.user = tslib_1.__assign(tslib_1.__assign({}, this._user), event.user);
        }
        if (this._contexts && Object.keys(this._contexts).length) {
            event.contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), event.contexts);
        }
        if (this._level) {
            event.level = this._level;
        }
        if (this._transactionName) {
            event.transaction = this._transactionName;
        }
        // We want to set the trace context for normal events only if there isn't already
        // a trace context on the event. There is a product feature in place where we link
        // errors with transaction and it relys on that.
        if (this._span) {
            event.contexts = tslib_1.__assign({ trace: this._span.getTraceContext() }, event.contexts);
            var transactionName = (_a = this._span.transaction) === null || _a === void 0 ? void 0 : _a.name;
            if (transactionName) {
                event.tags = tslib_1.__assign({ transaction: transactionName }, event.tags);
            }
        }
        this._applyFingerprint(event);
        event.breadcrumbs = tslib_1.__spread((event.breadcrumbs || []), this._breadcrumbs);
        event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
        return this._notifyEventProcessors(tslib_1.__spread(getGlobalEventProcessors(), this._eventProcessors), event, hint);
    };
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    Scope.prototype._notifyEventProcessors = function (processors, event, hint, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        return new utils_1.SyncPromise(function (resolve, reject) {
            var processor = processors[index];
            if (event === null || typeof processor !== 'function') {
                resolve(event);
            }
            else {
                var result = processor(tslib_1.__assign({}, event), hint);
                if (utils_1.isThenable(result)) {
                    result
                        .then(function (final) { return _this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve); })
                        .then(null, reject);
                }
                else {
                    _this._notifyEventProcessors(processors, result, hint, index + 1)
                        .then(resolve)
                        .then(null, reject);
                }
            }
        });
    };
    /**
     * This will be called on every set call.
     */
    Scope.prototype._notifyScopeListeners = function () {
        var _this = this;
        // We need this check for this._notifyingListeners to be able to work on scope during updates
        // If this check is not here we'll produce endless recursion when something is done with the scope
        // during the callback.
        if (!this._notifyingListeners) {
            this._notifyingListeners = true;
            this._scopeListeners.forEach(function (callback) {
                callback(_this);
            });
            this._notifyingListeners = false;
        }
    };
    /**
     * Applies fingerprint from the scope to the event if there's one,
     * uses message if there's one instead or get rid of empty fingerprint
     */
    Scope.prototype._applyFingerprint = function (event) {
        // Make sure it's an array first and we actually have something in place
        event.fingerprint = event.fingerprint
            ? Array.isArray(event.fingerprint)
                ? event.fingerprint
                : [event.fingerprint]
            : [];
        // If we have something on the scope, then merge it with event
        if (this._fingerprint) {
            event.fingerprint = event.fingerprint.concat(this._fingerprint);
        }
        // If we have no data at all, remove empty array default
        if (event.fingerprint && !event.fingerprint.length) {
            delete event.fingerprint;
        }
    };
    return Scope;
}());
exports.Scope = Scope;
/**
 * Retruns the global event processors.
 */
function getGlobalEventProcessors() {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access  */
    var global = utils_1.getGlobalObject();
    global.__SENTRY__ = global.__SENTRY__ || {};
    global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];
    return global.__SENTRY__.globalEventProcessors;
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
function addGlobalEventProcessor(callback) {
    getGlobalEventProcessors().push(callback);
}
exports.addGlobalEventProcessor = addGlobalEventProcessor;
//# sourceMappingURL=scope.js.map{"version":3,"file":"scope.js","sourceRoot":"","sources":["../src/scope.ts"],"names":[],"mappings":"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","sourcesContent":["/* eslint-disable max-lines */\nimport {\n  Breadcrumb,\n  CaptureContext,\n  Context,\n  Contexts,\n  Event,\n  EventHint,\n  EventProcessor,\n  Extra,\n  Extras,\n  Primitive,\n  Scope as ScopeInterface,\n  ScopeContext,\n  Severity,\n  Span,\n  Transaction,\n  User,\n} from '@sentry/types';\nimport { dateTimestampInSeconds, getGlobalObject, isPlainObject, isThenable, SyncPromise } from '@sentry/utils';\n\nimport { Session } from './session';\n\n/**\n * Holds additional event information. {@link Scope.applyToEvent} will be\n * called by the client before an event will be sent.\n */\nexport class Scope implements ScopeInterface {\n  /** Flag if notifiying is happening. */\n  protected _notifyingListeners: boolean = false;\n\n  /** Callback for client to receive scope changes. */\n  protected _scopeListeners: Array<(scope: Scope) => void> = [];\n\n  /** Callback list that will be called after {@link applyToEvent}. */\n  protected _eventProcessors: EventProcessor[] = [];\n\n  /** Array of breadcrumbs. */\n  protected _breadcrumbs: Breadcrumb[] = [];\n\n  /** User */\n  protected _user: User = {};\n\n  /** Tags */\n  protected _tags: { [key: string]: Primitive } = {};\n\n  /** Extra */\n  protected _extra: Extras = {};\n\n  /** Contexts */\n  protected _contexts: Contexts = {};\n\n  /** Fingerprint */\n  protected _fingerprint?: string[];\n\n  /** Severity */\n  protected _level?: Severity;\n\n  /** Transaction Name */\n  protected _transactionName?: string;\n\n  /** Span */\n  protected _span?: Span;\n\n  /** Session */\n  protected _session?: Session;\n\n  /**\n   * Inherit values from the parent scope.\n   * @param scope to clone.\n   */\n  public static clone(scope?: Scope): Scope {\n    const newScope = new Scope();\n    if (scope) {\n      newScope._breadcrumbs = [...scope._breadcrumbs];\n      newScope._tags = { ...scope._tags };\n      newScope._extra = { ...scope._extra };\n      newScope._contexts = { ...scope._contexts };\n      newScope._user = scope._user;\n      newScope._level = scope._level;\n      newScope._span = scope._span;\n      newScope._session = scope._session;\n      newScope._transactionName = scope._transactionName;\n      newScope._fingerprint = scope._fingerprint;\n      newScope._eventProcessors = [...scope._eventProcessors];\n    }\n    return newScope;\n  }\n\n  /**\n   * Add internal on change listener. Used for sub SDKs that need to store the scope.\n   * @hidden\n   */\n  public addScopeListener(callback: (scope: Scope) => void): void {\n    this._scopeListeners.push(callback);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public addEventProcessor(callback: EventProcessor): this {\n    this._eventProcessors.push(callback);\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setUser(user: User | null): this {\n    this._user = user || {};\n    if (this._session) {\n      this._session.update({ user });\n    }\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getUser(): User | undefined {\n    return this._user;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTags(tags: { [key: string]: Primitive }): this {\n    this._tags = {\n      ...this._tags,\n      ...tags,\n    };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTag(key: string, value: Primitive): this {\n    this._tags = { ...this._tags, [key]: value };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtras(extras: Extras): this {\n    this._extra = {\n      ...this._extra,\n      ...extras,\n    };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtra(key: string, extra: Extra): this {\n    this._extra = { ...this._extra, [key]: extra };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setFingerprint(fingerprint: string[]): this {\n    this._fingerprint = fingerprint;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setLevel(level: Severity): this {\n    this._level = level;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTransactionName(name?: string): this {\n    this._transactionName = name;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * Can be removed in major version.\n   * @deprecated in favor of {@link this.setTransactionName}\n   */\n  public setTransaction(name?: string): this {\n    return this.setTransactionName(name);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setContext(key: string, context: Context | null): this {\n    if (context === null) {\n      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete\n      delete this._contexts[key];\n    } else {\n      this._contexts = { ...this._contexts, [key]: context };\n    }\n\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setSpan(span?: Span): this {\n    this._span = span;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getSpan(): Span | undefined {\n    return this._span;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getTransaction(): Transaction | undefined {\n    // often, this span will be a transaction, but it's not guaranteed to be\n    const span = this.getSpan() as undefined | (Span & { spanRecorder: { spans: Span[] } });\n\n    // try it the new way first\n    if (span?.transaction) {\n      return span?.transaction;\n    }\n\n    // fallback to the old way (known bug: this only finds transactions with sampled = true)\n    if (span?.spanRecorder?.spans[0]) {\n      return span.spanRecorder.spans[0] as Transaction;\n    }\n\n    // neither way found a transaction\n    return undefined;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setSession(session?: Session): this {\n    if (!session) {\n      delete this._session;\n    } else {\n      this._session = session;\n    }\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getSession(): Session | undefined {\n    return this._session;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public update(captureContext?: CaptureContext): this {\n    if (!captureContext) {\n      return this;\n    }\n\n    if (typeof captureContext === 'function') {\n      const updatedScope = (captureContext as <T>(scope: T) => T)(this);\n      return updatedScope instanceof Scope ? updatedScope : this;\n    }\n\n    if (captureContext instanceof Scope) {\n      this._tags = { ...this._tags, ...captureContext._tags };\n      this._extra = { ...this._extra, ...captureContext._extra };\n      this._contexts = { ...this._contexts, ...captureContext._contexts };\n      if (captureContext._user && Object.keys(captureContext._user).length) {\n        this._user = captureContext._user;\n      }\n      if (captureContext._level) {\n        this._level = captureContext._level;\n      }\n      if (captureContext._fingerprint) {\n        this._fingerprint = captureContext._fingerprint;\n      }\n    } else if (isPlainObject(captureContext)) {\n      // eslint-disable-next-line no-param-reassign\n      captureContext = captureContext as ScopeContext;\n      this._tags = { ...this._tags, ...captureContext.tags };\n      this._extra = { ...this._extra, ...captureContext.extra };\n      this._contexts = { ...this._contexts, ...captureContext.contexts };\n      if (captureContext.user) {\n        this._user = captureContext.user;\n      }\n      if (captureContext.level) {\n        this._level = captureContext.level;\n      }\n      if (captureContext.fingerprint) {\n        this._fingerprint = captureContext.fingerprint;\n      }\n    }\n\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public clear(): this {\n    this._breadcrumbs = [];\n    this._tags = {};\n    this._extra = {};\n    this._user = {};\n    this._contexts = {};\n    this._level = undefined;\n    this._transactionName = undefined;\n    this._fingerprint = undefined;\n    this._span = undefined;\n    this._session = undefined;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): this {\n    const mergedBreadcrumb = {\n      timestamp: dateTimestampInSeconds(),\n      ...breadcrumb,\n    };\n\n    this._breadcrumbs =\n      maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0\n        ? [...this._breadcrumbs, mergedBreadcrumb].slice(-maxBreadcrumbs)\n        : [...this._breadcrumbs, mergedBreadcrumb];\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public clearBreadcrumbs(): this {\n    this._breadcrumbs = [];\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * Applies the current context and fingerprint to the event.\n   * Note that breadcrumbs will be added by the client.\n   * Also if the event has already breadcrumbs on it, we do not merge them.\n   * @param event Event\n   * @param hint May contain additional informartion about the original exception.\n   * @hidden\n   */\n  public applyToEvent(event: Event, hint?: EventHint): PromiseLike<Event | null> {\n    if (this._extra && Object.keys(this._extra).length) {\n      event.extra = { ...this._extra, ...event.extra };\n    }\n    if (this._tags && Object.keys(this._tags).length) {\n      event.tags = { ...this._tags, ...event.tags };\n    }\n    if (this._user && Object.keys(this._user).length) {\n      event.user = { ...this._user, ...event.user };\n    }\n    if (this._contexts && Object.keys(this._contexts).length) {\n      event.contexts = { ...this._contexts, ...event.contexts };\n    }\n    if (this._level) {\n      event.level = this._level;\n    }\n    if (this._transactionName) {\n      event.transaction = this._transactionName;\n    }\n    // We want to set the trace context for normal events only if there isn't already\n    // a trace context on the event. There is a product feature in place where we link\n    // errors with transaction and it relys on that.\n    if (this._span) {\n      event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };\n      const transactionName = this._span.transaction?.name;\n      if (transactionName) {\n        event.tags = { transaction: transactionName, ...event.tags };\n      }\n    }\n\n    this._applyFingerprint(event);\n\n    event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs];\n    event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;\n\n    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);\n  }\n\n  /**\n   * This will be called after {@link applyToEvent} is finished.\n   */\n  protected _notifyEventProcessors(\n    processors: EventProcessor[],\n    event: Event | null,\n    hint?: EventHint,\n    index: number = 0,\n  ): PromiseLike<Event | null> {\n    return new SyncPromise<Event | null>((resolve, reject) => {\n      const processor = processors[index];\n      if (event === null || typeof processor !== 'function') {\n        resolve(event);\n      } else {\n        const result = processor({ ...event }, hint) as Event | null;\n        if (isThenable(result)) {\n          (result as PromiseLike<Event | null>)\n            .then(final => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve))\n            .then(null, reject);\n        } else {\n          this._notifyEventProcessors(processors, result, hint, index + 1)\n            .then(resolve)\n            .then(null, reject);\n        }\n      }\n    });\n  }\n\n  /**\n   * This will be called on every set call.\n   */\n  protected _notifyScopeListeners(): void {\n    // We need this check for this._notifyingListeners to be able to work on scope during updates\n    // If this check is not here we'll produce endless recursion when something is done with the scope\n    // during the callback.\n    if (!this._notifyingListeners) {\n      this._notifyingListeners = true;\n      this._scopeListeners.forEach(callback => {\n        callback(this);\n      });\n      this._notifyingListeners = false;\n    }\n  }\n\n  /**\n   * Applies fingerprint from the scope to the event if there's one,\n   * uses message if there's one instead or get rid of empty fingerprint\n   */\n  private _applyFingerprint(event: Event): void {\n    // Make sure it's an array first and we actually have something in place\n    event.fingerprint = event.fingerprint\n      ? Array.isArray(event.fingerprint)\n        ? event.fingerprint\n        : [event.fingerprint]\n      : [];\n\n    // If we have something on the scope, then merge it with event\n    if (this._fingerprint) {\n      event.fingerprint = event.fingerprint.concat(this._fingerprint);\n    }\n\n    // If we have no data at all, remove empty array default\n    if (event.fingerprint && !event.fingerprint.length) {\n      delete event.fingerprint;\n    }\n  }\n}\n\n/**\n * Retruns the global event processors.\n */\nfunction getGlobalEventProcessors(): EventProcessor[] {\n  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access  */\n  const global = getGlobalObject<any>();\n  global.__SENTRY__ = global.__SENTRY__ || {};\n  global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];\n  return global.__SENTRY__.globalEventProcessors;\n  /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */\n}\n\n/**\n * Add a EventProcessor to be kept globally.\n * @param callback EventProcessor to add\n */\nexport function addGlobalEventProcessor(callback: EventProcessor): void {\n  getGlobalEventProcessors().push(callback);\n}\n"]}import { Session as SessionInterface, SessionContext, SessionStatus } from '@sentry/types';
/**
 * @inheritdoc
 */
export declare class Session implements SessionInterface {
    userAgent?: string;
    errors: number;
    release?: string;
    sid: string;
    did?: string;
    timestamp: number;
    started: number;
    duration: number;
    status: SessionStatus;
    environment?: string;
    ipAddress?: string;
    constructor(context?: Omit<SessionContext, 'started' | 'status'>);
    /** JSDoc */
    update(context?: SessionContext): void;
    /** JSDoc */
    close(status?: Exclude<SessionStatus, SessionStatus.Ok>): void;
    /** JSDoc */
    toJSON(): {
        init: boolean;
        sid: string;
        did?: string;
        timestamp: string;
        started: string;
        duration: number;
        status: SessionStatus;
        errors: number;
        attrs?: {
            release?: string;
            environment?: string;
            user_agent?: string;
            ip_address?: string;
        };
    };
}
//# sourceMappingURL=session.d.ts.map{"version":3,"file":"session.d.ts","sourceRoot":"","sources":["../src/session.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,OAAO,IAAI,gBAAgB,EAAE,cAAc,EAAE,aAAa,EAAE,MAAM,eAAe,CAAC;AAG3F;;GAEG;AACH,qBAAa,OAAQ,YAAW,gBAAgB;IACvC,SAAS,CAAC,EAAE,MAAM,CAAC;IACnB,MAAM,EAAE,MAAM,CAAK;IACnB,OAAO,CAAC,EAAE,MAAM,CAAC;IACjB,GAAG,EAAE,MAAM,CAAW;IACtB,GAAG,CAAC,EAAE,MAAM,CAAC;IACb,SAAS,EAAE,MAAM,CAAc;IAC/B,OAAO,EAAE,MAAM,CAAc;IAC7B,QAAQ,EAAE,MAAM,CAAK;IACrB,MAAM,EAAE,aAAa,CAAoB;IACzC,WAAW,CAAC,EAAE,MAAM,CAAC;IACrB,SAAS,CAAC,EAAE,MAAM,CAAC;gBAEd,OAAO,CAAC,EAAE,IAAI,CAAC,cAAc,EAAE,SAAS,GAAG,QAAQ,CAAC;IAMhE,YAAY;IAEZ,MAAM,CAAC,OAAO,GAAE,cAAmB,GAAG,IAAI;IAgD1C,YAAY;IACZ,KAAK,CAAC,MAAM,CAAC,EAAE,OAAO,CAAC,aAAa,EAAE,aAAa,CAAC,EAAE,CAAC,GAAG,IAAI;IAU9D,YAAY;IACZ,MAAM,IAAI;QACR,IAAI,EAAE,OAAO,CAAC;QACd,GAAG,EAAE,MAAM,CAAC;QACZ,GAAG,CAAC,EAAE,MAAM,CAAC;QACb,SAAS,EAAE,MAAM,CAAC;QAClB,OAAO,EAAE,MAAM,CAAC;QAChB,QAAQ,EAAE,MAAM,CAAC;QACjB,MAAM,EAAE,aAAa,CAAC;QACtB,MAAM,EAAE,MAAM,CAAC;QACf,KAAK,CAAC,EAAE;YACN,OAAO,CAAC,EAAE,MAAM,CAAC;YACjB,WAAW,CAAC,EAAE,MAAM,CAAC;YACrB,UAAU,CAAC,EAAE,MAAM,CAAC;YACpB,UAAU,CAAC,EAAE,MAAM,CAAC;SACrB,CAAC;KACH;CAkBF"}Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("@sentry/types");
var utils_1 = require("@sentry/utils");
/**
 * @inheritdoc
 */
var Session = /** @class */ (function () {
    function Session(context) {
        this.errors = 0;
        this.sid = utils_1.uuid4();
        this.timestamp = Date.now();
        this.started = Date.now();
        this.duration = 0;
        this.status = types_1.SessionStatus.Ok;
        if (context) {
            this.update(context);
        }
    }
    /** JSDoc */
    // eslint-disable-next-line complexity
    Session.prototype.update = function (context) {
        if (context === void 0) { context = {}; }
        if (context.user) {
            if (context.user.ip_address) {
                this.ipAddress = context.user.ip_address;
            }
            if (!context.did) {
                this.did = context.user.id || context.user.email || context.user.username;
            }
        }
        this.timestamp = context.timestamp || Date.now();
        if (context.sid) {
            // Good enough uuid validation. — Kamil
            this.sid = context.sid.length === 32 ? context.sid : utils_1.uuid4();
        }
        if (context.did) {
            this.did = "" + context.did;
        }
        if (typeof context.started === 'number') {
            this.started = context.started;
        }
        if (typeof context.duration === 'number') {
            this.duration = context.duration;
        }
        else {
            this.duration = this.timestamp - this.started;
        }
        if (context.release) {
            this.release = context.release;
        }
        if (context.environment) {
            this.environment = context.environment;
        }
        if (context.ipAddress) {
            this.ipAddress = context.ipAddress;
        }
        if (context.userAgent) {
            this.userAgent = context.userAgent;
        }
        if (typeof context.errors === 'number') {
            this.errors = context.errors;
        }
        if (context.status) {
            this.status = context.status;
        }
    };
    /** JSDoc */
    Session.prototype.close = function (status) {
        if (status) {
            this.update({ status: status });
        }
        else if (this.status === types_1.SessionStatus.Ok) {
            this.update({ status: types_1.SessionStatus.Exited });
        }
        else {
            this.update();
        }
    };
    /** JSDoc */
    Session.prototype.toJSON = function () {
        return utils_1.dropUndefinedKeys({
            sid: "" + this.sid,
            init: true,
            started: new Date(this.started).toISOString(),
            timestamp: new Date(this.timestamp).toISOString(),
            status: this.status,
            errors: this.errors,
            did: typeof this.did === 'number' || typeof this.did === 'string' ? "" + this.did : undefined,
            duration: this.duration,
            attrs: utils_1.dropUndefinedKeys({
                release: this.release,
                environment: this.environment,
                ip_address: this.ipAddress,
                user_agent: this.userAgent,
            }),
        });
    };
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=session.js.map{"version":3,"file":"session.js","sourceRoot":"","sources":["../src/session.ts"],"names":[],"mappings":"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","sourcesContent":["import { Session as SessionInterface, SessionContext, SessionStatus } from '@sentry/types';\nimport { dropUndefinedKeys, uuid4 } from '@sentry/utils';\n\n/**\n * @inheritdoc\n */\nexport class Session implements SessionInterface {\n  public userAgent?: string;\n  public errors: number = 0;\n  public release?: string;\n  public sid: string = uuid4();\n  public did?: string;\n  public timestamp: number = Date.now();\n  public started: number = Date.now();\n  public duration: number = 0;\n  public status: SessionStatus = SessionStatus.Ok;\n  public environment?: string;\n  public ipAddress?: string;\n\n  constructor(context?: Omit<SessionContext, 'started' | 'status'>) {\n    if (context) {\n      this.update(context);\n    }\n  }\n\n  /** JSDoc */\n  // eslint-disable-next-line complexity\n  update(context: SessionContext = {}): void {\n    if (context.user) {\n      if (context.user.ip_address) {\n        this.ipAddress = context.user.ip_address;\n      }\n\n      if (!context.did) {\n        this.did = context.user.id || context.user.email || context.user.username;\n      }\n    }\n\n    this.timestamp = context.timestamp || Date.now();\n\n    if (context.sid) {\n      // Good enough uuid validation. — Kamil\n      this.sid = context.sid.length === 32 ? context.sid : uuid4();\n    }\n    if (context.did) {\n      this.did = `${context.did}`;\n    }\n    if (typeof context.started === 'number') {\n      this.started = context.started;\n    }\n    if (typeof context.duration === 'number') {\n      this.duration = context.duration;\n    } else {\n      this.duration = this.timestamp - this.started;\n    }\n    if (context.release) {\n      this.release = context.release;\n    }\n    if (context.environment) {\n      this.environment = context.environment;\n    }\n    if (context.ipAddress) {\n      this.ipAddress = context.ipAddress;\n    }\n    if (context.userAgent) {\n      this.userAgent = context.userAgent;\n    }\n    if (typeof context.errors === 'number') {\n      this.errors = context.errors;\n    }\n    if (context.status) {\n      this.status = context.status;\n    }\n  }\n\n  /** JSDoc */\n  close(status?: Exclude<SessionStatus, SessionStatus.Ok>): void {\n    if (status) {\n      this.update({ status });\n    } else if (this.status === SessionStatus.Ok) {\n      this.update({ status: SessionStatus.Exited });\n    } else {\n      this.update();\n    }\n  }\n\n  /** JSDoc */\n  toJSON(): {\n    init: boolean;\n    sid: string;\n    did?: string;\n    timestamp: string;\n    started: string;\n    duration: number;\n    status: SessionStatus;\n    errors: number;\n    attrs?: {\n      release?: string;\n      environment?: string;\n      user_agent?: string;\n      ip_address?: string;\n    };\n  } {\n    return dropUndefinedKeys({\n      sid: `${this.sid}`,\n      init: true,\n      started: new Date(this.started).toISOString(),\n      timestamp: new Date(this.timestamp).toISOString(),\n      status: this.status,\n      errors: this.errors,\n      did: typeof this.did === 'number' || typeof this.did === 'string' ? `${this.did}` : undefined,\n      duration: this.duration,\n      attrs: dropUndefinedKeys({\n        release: this.release,\n        environment: this.environment,\n        ip_address: this.ipAddress,\n        user_agent: this.userAgent,\n      }),\n    });\n  }\n}\n"]}import { Breadcrumb, BreadcrumbHint, Client, CustomSamplingContext, Event, EventHint, Extra, Extras, Hub as HubInterface, Integration, IntegrationClass, Primitive, SessionContext, Severity, Span, SpanContext, Transaction, TransactionContext, User } from '@sentry/types';
import { Carrier, DomainAsCarrier, Layer } from './interfaces';
import { Scope } from './scope';
import { Session } from './session';
/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
export declare const API_VERSION = 3;
/**
 * @inheritDoc
 */
export declare class Hub implements HubInterface {
    private readonly _version;
    /** Is a {@link Layer}[] containing the client and scope */
    private readonly _stack;
    /** Contains the last event id of a captured event.  */
    private _lastEventId?;
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    constructor(client?: Client, scope?: Scope, _version?: number);
    /**
     * @inheritDoc
     */
    isOlderThan(version: number): boolean;
    /**
     * @inheritDoc
     */
    bindClient(client?: Client): void;
    /**
     * @inheritDoc
     */
    pushScope(): Scope;
    /**
     * @inheritDoc
     */
    popScope(): boolean;
    /**
     * @inheritDoc
     */
    withScope(callback: (scope: Scope) => void): void;
    /**
     * @inheritDoc
     */
    getClient<C extends Client>(): C | undefined;
    /** Returns the scope of the top stack. */
    getScope(): Scope | undefined;
    /** Returns the scope stack for domains or the process. */
    getStack(): Layer[];
    /** Returns the topmost scope layer in the order domain > local > process. */
    getStackTop(): Layer;
    /**
     * @inheritDoc
     */
    captureException(exception: any, hint?: EventHint): string;
    /**
     * @inheritDoc
     */
    captureMessage(message: string, level?: Severity, hint?: EventHint): string;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint): string;
    /**
     * @inheritDoc
     */
    lastEventId(): string | undefined;
    /**
     * @inheritDoc
     */
    addBreadcrumb(breadcrumb: Breadcrumb, hint?: BreadcrumbHint): void;
    /**
     * @inheritDoc
     */
    setUser(user: User | null): void;
    /**
     * @inheritDoc
     */
    setTags(tags: {
        [key: string]: Primitive;
    }): void;
    /**
     * @inheritDoc
     */
    setExtras(extras: Extras): void;
    /**
     * @inheritDoc
     */
    setTag(key: string, value: Primitive): void;
    /**
     * @inheritDoc
     */
    setExtra(key: string, extra: Extra): void;
    /**
     * @inheritDoc
     */
    setContext(name: string, context: {
        [key: string]: any;
    } | null): void;
    /**
     * @inheritDoc
     */
    configureScope(callback: (scope: Scope) => void): void;
    /**
     * @inheritDoc
     */
    run(callback: (hub: Hub) => void): void;
    /**
     * @inheritDoc
     */
    getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null;
    /**
     * @inheritDoc
     */
    startSpan(context: SpanContext): Span;
    /**
     * @inheritDoc
     */
    startTransaction(context: TransactionContext, customSamplingContext?: CustomSamplingContext): Transaction;
    /**
     * @inheritDoc
     */
    traceHeaders(): {
        [key: string]: string;
    };
    /**
     * @inheritDoc
     */
    startSession(context?: SessionContext): Session;
    /**
     * @inheritDoc
     */
    endSession(): void;
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client.
     * @param args Arguments to pass to the client function.
     */
    private _invokeClient;
    /**
     * Calls global extension method and binding current instance to the function call
     */
    private _callExtensionMethod;
}
/** Returns the global shim registry. */
export declare function getMainCarrier(): Carrier;
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
export declare function makeMain(hub: Hub): Hub;
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
export declare function getCurrentHub(): Hub;
/**
 * Returns the active domain, if one exists
 *
 * @returns The domain, or undefined if there is no active domain
 */
export declare function getActiveDomain(): DomainAsCarrier | undefined;
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
export declare function getHubFromCarrier(carrier: Carrier): Hub;
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 */
export declare function setHubOnCarrier(carrier: Carrier, hub: Hub): boolean;
//# sourceMappingURL=hub.d.ts.map{"version":3,"file":"hub.d.ts","sourceRoot":"","sources":["../src/hub.ts"],"names":[],"mappings":"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"}import { __assign, __read, __spread } from "tslib";
import { consoleSandbox, dateTimestampInSeconds, getGlobalObject, isNodeEnv, logger, uuid4 } from '@sentry/utils';
import { Scope } from './scope';
import { Session } from './session';
/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
export var API_VERSION = 3;
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
var DEFAULT_BREADCRUMBS = 100;
/**
 * Absolute maximum number of breadcrumbs added to an event. The
 * `maxBreadcrumbs` option cannot be higher than this value.
 */
var MAX_BREADCRUMBS = 100;
/**
 * @inheritDoc
 */
var Hub = /** @class */ (function () {
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    function Hub(client, scope, _version) {
        if (scope === void 0) { scope = new Scope(); }
        if (_version === void 0) { _version = API_VERSION; }
        this._version = _version;
        /** Is a {@link Layer}[] containing the client and scope */
        this._stack = [{}];
        this.getStackTop().scope = scope;
        this.bindClient(client);
    }
    /**
     * @inheritDoc
     */
    Hub.prototype.isOlderThan = function (version) {
        return this._version < version;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.bindClient = function (client) {
        var top = this.getStackTop();
        top.client = client;
        if (client && client.setupIntegrations) {
            client.setupIntegrations();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.pushScope = function () {
        // We want to clone the content of prev scope
        var scope = Scope.clone(this.getScope());
        this.getStack().push({
            client: this.getClient(),
            scope: scope,
        });
        return scope;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.popScope = function () {
        if (this.getStack().length <= 1)
            return false;
        return !!this.getStack().pop();
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.withScope = function (callback) {
        var scope = this.pushScope();
        try {
            callback(scope);
        }
        finally {
            this.popScope();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getClient = function () {
        return this.getStackTop().client;
    };
    /** Returns the scope of the top stack. */
    Hub.prototype.getScope = function () {
        return this.getStackTop().scope;
    };
    /** Returns the scope stack for domains or the process. */
    Hub.prototype.getStack = function () {
        return this._stack;
    };
    /** Returns the topmost scope layer in the order domain > local > process. */
    Hub.prototype.getStackTop = function () {
        return this._stack[this._stack.length - 1];
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Hub.prototype.captureException = function (exception, hint) {
        var eventId = (this._lastEventId = uuid4());
        var finalHint = hint;
        // If there's no explicit hint provided, mimick the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error('Sentry syntheticException');
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: exception,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureException', exception, __assign(__assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureMessage = function (message, level, hint) {
        var eventId = (this._lastEventId = uuid4());
        var finalHint = hint;
        // If there's no explicit hint provided, mimick the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error(message);
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: message,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureMessage', message, level, __assign(__assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureEvent = function (event, hint) {
        var eventId = (this._lastEventId = uuid4());
        this._invokeClient('captureEvent', event, __assign(__assign({}, hint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.lastEventId = function () {
        return this._lastEventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.addBreadcrumb = function (breadcrumb, hint) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope || !client)
            return;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _b = (client.getOptions && client.getOptions()) || {}, _c = _b.beforeBreadcrumb, beforeBreadcrumb = _c === void 0 ? null : _c, _d = _b.maxBreadcrumbs, maxBreadcrumbs = _d === void 0 ? DEFAULT_BREADCRUMBS : _d;
        if (maxBreadcrumbs <= 0)
            return;
        var timestamp = dateTimestampInSeconds();
        var mergedBreadcrumb = __assign({ timestamp: timestamp }, breadcrumb);
        var finalBreadcrumb = beforeBreadcrumb
            ? consoleSandbox(function () { return beforeBreadcrumb(mergedBreadcrumb, hint); })
            : mergedBreadcrumb;
        if (finalBreadcrumb === null)
            return;
        scope.addBreadcrumb(finalBreadcrumb, Math.min(maxBreadcrumbs, MAX_BREADCRUMBS));
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setUser = function (user) {
        var scope = this.getScope();
        if (scope)
            scope.setUser(user);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTags = function (tags) {
        var scope = this.getScope();
        if (scope)
            scope.setTags(tags);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtras = function (extras) {
        var scope = this.getScope();
        if (scope)
            scope.setExtras(extras);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTag = function (key, value) {
        var scope = this.getScope();
        if (scope)
            scope.setTag(key, value);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtra = function (key, extra) {
        var scope = this.getScope();
        if (scope)
            scope.setExtra(key, extra);
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype.setContext = function (name, context) {
        var scope = this.getScope();
        if (scope)
            scope.setContext(name, context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.configureScope = function (callback) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (scope && client) {
            callback(scope);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.run = function (callback) {
        var oldHub = makeMain(this);
        try {
            callback(this);
        }
        finally {
            makeMain(oldHub);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getIntegration = function (integration) {
        var client = this.getClient();
        if (!client)
            return null;
        try {
            return client.getIntegration(integration);
        }
        catch (_oO) {
            logger.warn("Cannot retrieve integration " + integration.id + " from the current Hub");
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSpan = function (context) {
        return this._callExtensionMethod('startSpan', context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startTransaction = function (context, customSamplingContext) {
        return this._callExtensionMethod('startTransaction', context, customSamplingContext);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.traceHeaders = function () {
        return this._callExtensionMethod('traceHeaders');
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSession = function (context) {
        // End existing session if there's one
        this.endSession();
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        var _b = (client && client.getOptions()) || {}, release = _b.release, environment = _b.environment;
        var session = new Session(__assign(__assign({ release: release,
            environment: environment }, (scope && { user: scope.getUser() })), context));
        if (scope) {
            scope.setSession(session);
        }
        return session;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.endSession = function () {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope)
            return;
        var session = scope.getSession && scope.getSession();
        if (session) {
            session.close();
            if (client && client.captureSession) {
                client.captureSession(session);
            }
            scope.setSession();
        }
    };
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client.
     * @param args Arguments to pass to the client function.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._invokeClient = function (method) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _b = this.getStackTop(), scope = _b.scope, client = _b.client;
        if (client && client[method]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (_a = client)[method].apply(_a, __spread(args, [scope]));
        }
    };
    /**
     * Calls global extension method and binding current instance to the function call
     */
    // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._callExtensionMethod = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var carrier = getMainCarrier();
        var sentry = carrier.__SENTRY__;
        if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
            return sentry.extensions[method].apply(this, args);
        }
        logger.warn("Extension method " + method + " couldn't be found, doing nothing.");
    };
    return Hub;
}());
export { Hub };
/** Returns the global shim registry. */
export function getMainCarrier() {
    var carrier = getGlobalObject();
    carrier.__SENTRY__ = carrier.__SENTRY__ || {
        extensions: {},
        hub: undefined,
    };
    return carrier;
}
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
export function makeMain(hub) {
    var registry = getMainCarrier();
    var oldHub = getHubFromCarrier(registry);
    setHubOnCarrier(registry, hub);
    return oldHub;
}
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
export function getCurrentHub() {
    // Get main carrier (global for every environment)
    var registry = getMainCarrier();
    // If there's no hub, or its an old API, assign a new one
    if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
        setHubOnCarrier(registry, new Hub());
    }
    // Prefer domains over global if they are there (applicable only to Node environment)
    if (isNodeEnv()) {
        return getHubFromActiveDomain(registry);
    }
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
}
/**
 * Returns the active domain, if one exists
 *
 * @returns The domain, or undefined if there is no active domain
 */
export function getActiveDomain() {
    var sentry = getMainCarrier().__SENTRY__;
    return sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;
}
/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
    try {
        var activeDomain = getActiveDomain();
        // If there's no active domain, just return global hub
        if (!activeDomain) {
            return getHubFromCarrier(registry);
        }
        // If there's no hub on current domain, or it's an old API, assign a new one
        if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
            var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
            setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, Scope.clone(registryHubTopStack.scope)));
        }
        // Return hub that lives on a domain
        return getHubFromCarrier(activeDomain);
    }
    catch (_Oo) {
        // Return hub that lives on a global object
        return getHubFromCarrier(registry);
    }
}
/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
function hasHubOnCarrier(carrier) {
    return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
export function getHubFromCarrier(carrier) {
    if (carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub)
        return carrier.__SENTRY__.hub;
    carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    carrier.__SENTRY__.hub = new Hub();
    return carrier.__SENTRY__.hub;
}
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 */
export function setHubOnCarrier(carrier, hub) {
    if (!carrier)
        return false;
    carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    carrier.__SENTRY__.hub = hub;
    return true;
}
//# sourceMappingURL=hub.js.map{"version":3,"file":"hub.js","sourceRoot":"","sources":["../src/hub.ts"],"names":[],"mappings":"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","sourcesContent":["/* eslint-disable max-lines */\nimport {\n  Breadcrumb,\n  BreadcrumbHint,\n  Client,\n  CustomSamplingContext,\n  Event,\n  EventHint,\n  Extra,\n  Extras,\n  Hub as HubInterface,\n  Integration,\n  IntegrationClass,\n  Primitive,\n  SessionContext,\n  Severity,\n  Span,\n  SpanContext,\n  Transaction,\n  TransactionContext,\n  User,\n} from '@sentry/types';\nimport { consoleSandbox, dateTimestampInSeconds, getGlobalObject, isNodeEnv, logger, uuid4 } from '@sentry/utils';\n\nimport { Carrier, DomainAsCarrier, Layer } from './interfaces';\nimport { Scope } from './scope';\nimport { Session } from './session';\n\n/**\n * API compatibility version of this hub.\n *\n * WARNING: This number should only be increased when the global interface\n * changes and new methods are introduced.\n *\n * @hidden\n */\nexport const API_VERSION = 3;\n\n/**\n * Default maximum number of breadcrumbs added to an event. Can be overwritten\n * with {@link Options.maxBreadcrumbs}.\n */\nconst DEFAULT_BREADCRUMBS = 100;\n\n/**\n * Absolute maximum number of breadcrumbs added to an event. The\n * `maxBreadcrumbs` option cannot be higher than this value.\n */\nconst MAX_BREADCRUMBS = 100;\n\n/**\n * @inheritDoc\n */\nexport class Hub implements HubInterface {\n  /** Is a {@link Layer}[] containing the client and scope */\n  private readonly _stack: Layer[] = [{}];\n\n  /** Contains the last event id of a captured event.  */\n  private _lastEventId?: string;\n\n  /**\n   * Creates a new instance of the hub, will push one {@link Layer} into the\n   * internal stack on creation.\n   *\n   * @param client bound to the hub.\n   * @param scope bound to the hub.\n   * @param version number, higher number means higher priority.\n   */\n  public constructor(client?: Client, scope: Scope = new Scope(), private readonly _version: number = API_VERSION) {\n    this.getStackTop().scope = scope;\n    this.bindClient(client);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public isOlderThan(version: number): boolean {\n    return this._version < version;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public bindClient(client?: Client): void {\n    const top = this.getStackTop();\n    top.client = client;\n    if (client && client.setupIntegrations) {\n      client.setupIntegrations();\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public pushScope(): Scope {\n    // We want to clone the content of prev scope\n    const scope = Scope.clone(this.getScope());\n    this.getStack().push({\n      client: this.getClient(),\n      scope,\n    });\n    return scope;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public popScope(): boolean {\n    if (this.getStack().length <= 1) return false;\n    return !!this.getStack().pop();\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public withScope(callback: (scope: Scope) => void): void {\n    const scope = this.pushScope();\n    try {\n      callback(scope);\n    } finally {\n      this.popScope();\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getClient<C extends Client>(): C | undefined {\n    return this.getStackTop().client as C;\n  }\n\n  /** Returns the scope of the top stack. */\n  public getScope(): Scope | undefined {\n    return this.getStackTop().scope;\n  }\n\n  /** Returns the scope stack for domains or the process. */\n  public getStack(): Layer[] {\n    return this._stack;\n  }\n\n  /** Returns the topmost scope layer in the order domain > local > process. */\n  public getStackTop(): Layer {\n    return this._stack[this._stack.length - 1];\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  public captureException(exception: any, hint?: EventHint): string {\n    const eventId = (this._lastEventId = uuid4());\n    let finalHint = hint;\n\n    // If there's no explicit hint provided, mimick the same thing that would happen\n    // in the minimal itself to create a consistent behavior.\n    // We don't do this in the client, as it's the lowest level API, and doing this,\n    // would prevent user from having full control over direct calls.\n    if (!hint) {\n      let syntheticException: Error;\n      try {\n        throw new Error('Sentry syntheticException');\n      } catch (exception) {\n        syntheticException = exception as Error;\n      }\n      finalHint = {\n        originalException: exception,\n        syntheticException,\n      };\n    }\n\n    this._invokeClient('captureException', exception, {\n      ...finalHint,\n      event_id: eventId,\n    });\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureMessage(message: string, level?: Severity, hint?: EventHint): string {\n    const eventId = (this._lastEventId = uuid4());\n    let finalHint = hint;\n\n    // If there's no explicit hint provided, mimick the same thing that would happen\n    // in the minimal itself to create a consistent behavior.\n    // We don't do this in the client, as it's the lowest level API, and doing this,\n    // would prevent user from having full control over direct calls.\n    if (!hint) {\n      let syntheticException: Error;\n      try {\n        throw new Error(message);\n      } catch (exception) {\n        syntheticException = exception as Error;\n      }\n      finalHint = {\n        originalException: message,\n        syntheticException,\n      };\n    }\n\n    this._invokeClient('captureMessage', message, level, {\n      ...finalHint,\n      event_id: eventId,\n    });\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public captureEvent(event: Event, hint?: EventHint): string {\n    const eventId = (this._lastEventId = uuid4());\n    this._invokeClient('captureEvent', event, {\n      ...hint,\n      event_id: eventId,\n    });\n    return eventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public lastEventId(): string | undefined {\n    return this._lastEventId;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public addBreadcrumb(breadcrumb: Breadcrumb, hint?: BreadcrumbHint): void {\n    const { scope, client } = this.getStackTop();\n\n    if (!scope || !client) return;\n\n    // eslint-disable-next-line @typescript-eslint/unbound-method\n    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } =\n      (client.getOptions && client.getOptions()) || {};\n\n    if (maxBreadcrumbs <= 0) return;\n\n    const timestamp = dateTimestampInSeconds();\n    const mergedBreadcrumb = { timestamp, ...breadcrumb };\n    const finalBreadcrumb = beforeBreadcrumb\n      ? (consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) as Breadcrumb | null)\n      : mergedBreadcrumb;\n\n    if (finalBreadcrumb === null) return;\n\n    scope.addBreadcrumb(finalBreadcrumb, Math.min(maxBreadcrumbs, MAX_BREADCRUMBS));\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setUser(user: User | null): void {\n    const scope = this.getScope();\n    if (scope) scope.setUser(user);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTags(tags: { [key: string]: Primitive }): void {\n    const scope = this.getScope();\n    if (scope) scope.setTags(tags);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtras(extras: Extras): void {\n    const scope = this.getScope();\n    if (scope) scope.setExtras(extras);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTag(key: string, value: Primitive): void {\n    const scope = this.getScope();\n    if (scope) scope.setTag(key, value);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtra(key: string, extra: Extra): void {\n    const scope = this.getScope();\n    if (scope) scope.setExtra(key, extra);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  public setContext(name: string, context: { [key: string]: any } | null): void {\n    const scope = this.getScope();\n    if (scope) scope.setContext(name, context);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public configureScope(callback: (scope: Scope) => void): void {\n    const { scope, client } = this.getStackTop();\n    if (scope && client) {\n      callback(scope);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public run(callback: (hub: Hub) => void): void {\n    const oldHub = makeMain(this);\n    try {\n      callback(this);\n    } finally {\n      makeMain(oldHub);\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null {\n    const client = this.getClient();\n    if (!client) return null;\n    try {\n      return client.getIntegration(integration);\n    } catch (_oO) {\n      logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);\n      return null;\n    }\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public startSpan(context: SpanContext): Span {\n    return this._callExtensionMethod('startSpan', context);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public startTransaction(context: TransactionContext, customSamplingContext?: CustomSamplingContext): Transaction {\n    return this._callExtensionMethod('startTransaction', context, customSamplingContext);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public traceHeaders(): { [key: string]: string } {\n    return this._callExtensionMethod<{ [key: string]: string }>('traceHeaders');\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public startSession(context?: SessionContext): Session {\n    // End existing session if there's one\n    this.endSession();\n\n    const { scope, client } = this.getStackTop();\n    const { release, environment } = (client && client.getOptions()) || {};\n    const session = new Session({\n      release,\n      environment,\n      ...(scope && { user: scope.getUser() }),\n      ...context,\n    });\n    if (scope) {\n      scope.setSession(session);\n    }\n    return session;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public endSession(): void {\n    const { scope, client } = this.getStackTop();\n    if (!scope) return;\n\n    const session = scope.getSession && scope.getSession();\n    if (session) {\n      session.close();\n      if (client && client.captureSession) {\n        client.captureSession(session);\n      }\n      scope.setSession();\n    }\n  }\n\n  /**\n   * Internal helper function to call a method on the top client if it exists.\n   *\n   * @param method The method to call on the client.\n   * @param args Arguments to pass to the client function.\n   */\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  private _invokeClient<M extends keyof Client>(method: M, ...args: any[]): void {\n    const { scope, client } = this.getStackTop();\n    if (client && client[method]) {\n      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any\n      (client as any)[method](...args, scope);\n    }\n  }\n\n  /**\n   * Calls global extension method and binding current instance to the function call\n   */\n  // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  private _callExtensionMethod<T>(method: string, ...args: any[]): T {\n    const carrier = getMainCarrier();\n    const sentry = carrier.__SENTRY__;\n    if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {\n      return sentry.extensions[method].apply(this, args);\n    }\n    logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);\n  }\n}\n\n/** Returns the global shim registry. */\nexport function getMainCarrier(): Carrier {\n  const carrier = getGlobalObject();\n  carrier.__SENTRY__ = carrier.__SENTRY__ || {\n    extensions: {},\n    hub: undefined,\n  };\n  return carrier;\n}\n\n/**\n * Replaces the current main hub with the passed one on the global object\n *\n * @returns The old replaced hub\n */\nexport function makeMain(hub: Hub): Hub {\n  const registry = getMainCarrier();\n  const oldHub = getHubFromCarrier(registry);\n  setHubOnCarrier(registry, hub);\n  return oldHub;\n}\n\n/**\n * Returns the default hub instance.\n *\n * If a hub is already registered in the global carrier but this module\n * contains a more recent version, it replaces the registered version.\n * Otherwise, the currently registered hub will be returned.\n */\nexport function getCurrentHub(): Hub {\n  // Get main carrier (global for every environment)\n  const registry = getMainCarrier();\n\n  // If there's no hub, or its an old API, assign a new one\n  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {\n    setHubOnCarrier(registry, new Hub());\n  }\n\n  // Prefer domains over global if they are there (applicable only to Node environment)\n  if (isNodeEnv()) {\n    return getHubFromActiveDomain(registry);\n  }\n  // Return hub that lives on a global object\n  return getHubFromCarrier(registry);\n}\n\n/**\n * Returns the active domain, if one exists\n *\n * @returns The domain, or undefined if there is no active domain\n */\nexport function getActiveDomain(): DomainAsCarrier | undefined {\n  const sentry = getMainCarrier().__SENTRY__;\n\n  return sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;\n}\n\n/**\n * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist\n * @returns discovered hub\n */\nfunction getHubFromActiveDomain(registry: Carrier): Hub {\n  try {\n    const activeDomain = getActiveDomain();\n\n    // If there's no active domain, just return global hub\n    if (!activeDomain) {\n      return getHubFromCarrier(registry);\n    }\n\n    // If there's no hub on current domain, or it's an old API, assign a new one\n    if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {\n      const registryHubTopStack = getHubFromCarrier(registry).getStackTop();\n      setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, Scope.clone(registryHubTopStack.scope)));\n    }\n\n    // Return hub that lives on a domain\n    return getHubFromCarrier(activeDomain);\n  } catch (_Oo) {\n    // Return hub that lives on a global object\n    return getHubFromCarrier(registry);\n  }\n}\n\n/**\n * This will tell whether a carrier has a hub on it or not\n * @param carrier object\n */\nfunction hasHubOnCarrier(carrier: Carrier): boolean {\n  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);\n}\n\n/**\n * This will create a new {@link Hub} and add to the passed object on\n * __SENTRY__.hub.\n * @param carrier object\n * @hidden\n */\nexport function getHubFromCarrier(carrier: Carrier): Hub {\n  if (carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub) return carrier.__SENTRY__.hub;\n  carrier.__SENTRY__ = carrier.__SENTRY__ || {};\n  carrier.__SENTRY__.hub = new Hub();\n  return carrier.__SENTRY__.hub;\n}\n\n/**\n * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute\n * @param carrier object\n * @param hub Hub\n */\nexport function setHubOnCarrier(carrier: Carrier, hub: Hub): boolean {\n  if (!carrier) return false;\n  carrier.__SENTRY__ = carrier.__SENTRY__ || {};\n  carrier.__SENTRY__.hub = hub;\n  return true;\n}\n"]}export { Carrier, DomainAsCarrier, Layer } from './interfaces';
export { addGlobalEventProcessor, Scope } from './scope';
export { Session } from './session';
export { getActiveDomain, getCurrentHub, getHubFromCarrier, getMainCarrier, Hub, makeMain, setHubOnCarrier, } from './hub';
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,OAAO,EAAE,eAAe,EAAE,KAAK,EAAE,MAAM,cAAc,CAAC;AAC/D,OAAO,EAAE,uBAAuB,EAAE,KAAK,EAAE,MAAM,SAAS,CAAC;AACzD,OAAO,EAAE,OAAO,EAAE,MAAM,WAAW,CAAC;AACpC,OAAO,EACL,eAAe,EACf,aAAa,EACb,iBAAiB,EACjB,cAAc,EACd,GAAG,EACH,QAAQ,EACR,eAAe,GAChB,MAAM,OAAO,CAAC"}export { addGlobalEventProcessor, Scope } from './scope';
export { Session } from './session';
export { getActiveDomain, getCurrentHub, getHubFromCarrier, getMainCarrier, Hub, makeMain, setHubOnCarrier, } from './hub';
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AACA,OAAO,EAAE,uBAAuB,EAAE,KAAK,EAAE,MAAM,SAAS,CAAC;AACzD,OAAO,EAAE,OAAO,EAAE,MAAM,WAAW,CAAC;AACpC,OAAO,EACL,eAAe,EACf,aAAa,EACb,iBAAiB,EACjB,cAAc,EACd,GAAG,EACH,QAAQ,EACR,eAAe,GAChB,MAAM,OAAO,CAAC","sourcesContent":["export { Carrier, DomainAsCarrier, Layer } from './interfaces';\nexport { addGlobalEventProcessor, Scope } from './scope';\nexport { Session } from './session';\nexport {\n  getActiveDomain,\n  getCurrentHub,\n  getHubFromCarrier,\n  getMainCarrier,\n  Hub,\n  makeMain,\n  setHubOnCarrier,\n} from './hub';\n"]}import { Client } from '@sentry/types';
import { Hub } from './hub';
import { Scope } from './scope';
/**
 * A layer in the process stack.
 * @hidden
 */
export interface Layer {
    client?: Client;
    scope?: Scope;
}
/**
 * An object that contains a hub and maintains a scope stack.
 * @hidden
 */
export interface Carrier {
    __SENTRY__?: {
        hub?: Hub;
        /**
         * Extra Hub properties injected by various SDKs
         */
        extensions?: {
            /** Hack to prevent bundlers from breaking our usage of the domain package in the cross-platform Hub package */
            domain?: {
                [key: string]: any;
            };
        } & {
            /** Extension methods for the hub, which are bound to the current Hub instance */
            [key: string]: Function;
        };
    };
}
export interface DomainAsCarrier extends Carrier {
    members: {
        [key: string]: any;
    }[];
}
//# sourceMappingURL=interfaces.d.ts.map{"version":3,"file":"interfaces.d.ts","sourceRoot":"","sources":["../src/interfaces.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,MAAM,EAAE,MAAM,eAAe,CAAC;AAEvC,OAAO,EAAE,GAAG,EAAE,MAAM,OAAO,CAAC;AAC5B,OAAO,EAAE,KAAK,EAAE,MAAM,SAAS,CAAC;AAEhC;;;GAGG;AACH,MAAM,WAAW,KAAK;IACpB,MAAM,CAAC,EAAE,MAAM,CAAC;IAChB,KAAK,CAAC,EAAE,KAAK,CAAC;CACf;AAED;;;GAGG;AACH,MAAM,WAAW,OAAO;IACtB,UAAU,CAAC,EAAE;QACX,GAAG,CAAC,EAAE,GAAG,CAAC;QACV;;WAEG;QACH,UAAU,CAAC,EAAE;YACX,+GAA+G;YAE/G,MAAM,CAAC,EAAE;gBAAE,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAA;aAAE,CAAC;SACjC,GAAG;YACF,iFAAiF;YAEjF,CAAC,GAAG,EAAE,MAAM,GAAG,QAAQ,CAAC;SACzB,CAAC;KACH,CAAC;CACH;AAED,MAAM,WAAW,eAAgB,SAAQ,OAAO;IAE9C,OAAO,EAAE;QAAE,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAA;KAAE,EAAE,CAAC;CACnC"}//# sourceMappingURL=interfaces.js.map{"version":3,"file":"interfaces.js","sourceRoot":"","sources":["../src/interfaces.ts"],"names":[],"mappings":"","sourcesContent":["import { Client } from '@sentry/types';\n\nimport { Hub } from './hub';\nimport { Scope } from './scope';\n\n/**\n * A layer in the process stack.\n * @hidden\n */\nexport interface Layer {\n  client?: Client;\n  scope?: Scope;\n}\n\n/**\n * An object that contains a hub and maintains a scope stack.\n * @hidden\n */\nexport interface Carrier {\n  __SENTRY__?: {\n    hub?: Hub;\n    /**\n     * Extra Hub properties injected by various SDKs\n     */\n    extensions?: {\n      /** Hack to prevent bundlers from breaking our usage of the domain package in the cross-platform Hub package */\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      domain?: { [key: string]: any };\n    } & {\n      /** Extension methods for the hub, which are bound to the current Hub instance */\n      // eslint-disable-next-line @typescript-eslint/ban-types\n      [key: string]: Function;\n    };\n  };\n}\n\nexport interface DomainAsCarrier extends Carrier {\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  members: { [key: string]: any }[];\n}\n"]}import { Breadcrumb, CaptureContext, Context, Contexts, Event, EventHint, EventProcessor, Extra, Extras, Primitive, Scope as ScopeInterface, Severity, Span, Transaction, User } from '@sentry/types';
import { Session } from './session';
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
export declare class Scope implements ScopeInterface {
    /** Flag if notifiying is happening. */
    protected _notifyingListeners: boolean;
    /** Callback for client to receive scope changes. */
    protected _scopeListeners: Array<(scope: Scope) => void>;
    /** Callback list that will be called after {@link applyToEvent}. */
    protected _eventProcessors: EventProcessor[];
    /** Array of breadcrumbs. */
    protected _breadcrumbs: Breadcrumb[];
    /** User */
    protected _user: User;
    /** Tags */
    protected _tags: {
        [key: string]: Primitive;
    };
    /** Extra */
    protected _extra: Extras;
    /** Contexts */
    protected _contexts: Contexts;
    /** Fingerprint */
    protected _fingerprint?: string[];
    /** Severity */
    protected _level?: Severity;
    /** Transaction Name */
    protected _transactionName?: string;
    /** Span */
    protected _span?: Span;
    /** Session */
    protected _session?: Session;
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    static clone(scope?: Scope): Scope;
    /**
     * Add internal on change listener. Used for sub SDKs that need to store the scope.
     * @hidden
     */
    addScopeListener(callback: (scope: Scope) => void): void;
    /**
     * @inheritDoc
     */
    addEventProcessor(callback: EventProcessor): this;
    /**
     * @inheritDoc
     */
    setUser(user: User | null): this;
    /**
     * @inheritDoc
     */
    getUser(): User | undefined;
    /**
     * @inheritDoc
     */
    setTags(tags: {
        [key: string]: Primitive;
    }): this;
    /**
     * @inheritDoc
     */
    setTag(key: string, value: Primitive): this;
    /**
     * @inheritDoc
     */
    setExtras(extras: Extras): this;
    /**
     * @inheritDoc
     */
    setExtra(key: string, extra: Extra): this;
    /**
     * @inheritDoc
     */
    setFingerprint(fingerprint: string[]): this;
    /**
     * @inheritDoc
     */
    setLevel(level: Severity): this;
    /**
     * @inheritDoc
     */
    setTransactionName(name?: string): this;
    /**
     * Can be removed in major version.
     * @deprecated in favor of {@link this.setTransactionName}
     */
    setTransaction(name?: string): this;
    /**
     * @inheritDoc
     */
    setContext(key: string, context: Context | null): this;
    /**
     * @inheritDoc
     */
    setSpan(span?: Span): this;
    /**
     * @inheritDoc
     */
    getSpan(): Span | undefined;
    /**
     * @inheritDoc
     */
    getTransaction(): Transaction | undefined;
    /**
     * @inheritDoc
     */
    setSession(session?: Session): this;
    /**
     * @inheritDoc
     */
    getSession(): Session | undefined;
    /**
     * @inheritDoc
     */
    update(captureContext?: CaptureContext): this;
    /**
     * @inheritDoc
     */
    clear(): this;
    /**
     * @inheritDoc
     */
    addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): this;
    /**
     * @inheritDoc
     */
    clearBreadcrumbs(): this;
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event Event
     * @param hint May contain additional informartion about the original exception.
     * @hidden
     */
    applyToEvent(event: Event, hint?: EventHint): PromiseLike<Event | null>;
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    protected _notifyEventProcessors(processors: EventProcessor[], event: Event | null, hint?: EventHint, index?: number): PromiseLike<Event | null>;
    /**
     * This will be called on every set call.
     */
    protected _notifyScopeListeners(): void;
    /**
     * Applies fingerprint from the scope to the event if there's one,
     * uses message if there's one instead or get rid of empty fingerprint
     */
    private _applyFingerprint;
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
export declare function addGlobalEventProcessor(callback: EventProcessor): void;
//# sourceMappingURL=scope.d.ts.map{"version":3,"file":"scope.d.ts","sourceRoot":"","sources":["../src/scope.ts"],"names":[],"mappings":"AACA,OAAO,EACL,UAAU,EACV,cAAc,EACd,OAAO,EACP,QAAQ,EACR,KAAK,EACL,SAAS,EACT,cAAc,EACd,KAAK,EACL,MAAM,EACN,SAAS,EACT,KAAK,IAAI,cAAc,EAEvB,QAAQ,EACR,IAAI,EACJ,WAAW,EACX,IAAI,EACL,MAAM,eAAe,CAAC;AAGvB,OAAO,EAAE,OAAO,EAAE,MAAM,WAAW,CAAC;AAEpC;;;GAGG;AACH,qBAAa,KAAM,YAAW,cAAc;IAC1C,uCAAuC;IACvC,SAAS,CAAC,mBAAmB,EAAE,OAAO,CAAS;IAE/C,oDAAoD;IACpD,SAAS,CAAC,eAAe,EAAE,KAAK,CAAC,CAAC,KAAK,EAAE,KAAK,KAAK,IAAI,CAAC,CAAM;IAE9D,oEAAoE;IACpE,SAAS,CAAC,gBAAgB,EAAE,cAAc,EAAE,CAAM;IAElD,4BAA4B;IAC5B,SAAS,CAAC,YAAY,EAAE,UAAU,EAAE,CAAM;IAE1C,WAAW;IACX,SAAS,CAAC,KAAK,EAAE,IAAI,CAAM;IAE3B,WAAW;IACX,SAAS,CAAC,KAAK,EAAE;QAAE,CAAC,GAAG,EAAE,MAAM,GAAG,SAAS,CAAA;KAAE,CAAM;IAEnD,YAAY;IACZ,SAAS,CAAC,MAAM,EAAE,MAAM,CAAM;IAE9B,eAAe;IACf,SAAS,CAAC,SAAS,EAAE,QAAQ,CAAM;IAEnC,kBAAkB;IAClB,SAAS,CAAC,YAAY,CAAC,EAAE,MAAM,EAAE,CAAC;IAElC,eAAe;IACf,SAAS,CAAC,MAAM,CAAC,EAAE,QAAQ,CAAC;IAE5B,uBAAuB;IACvB,SAAS,CAAC,gBAAgB,CAAC,EAAE,MAAM,CAAC;IAEpC,WAAW;IACX,SAAS,CAAC,KAAK,CAAC,EAAE,IAAI,CAAC;IAEvB,cAAc;IACd,SAAS,CAAC,QAAQ,CAAC,EAAE,OAAO,CAAC;IAE7B;;;OAGG;WACW,KAAK,CAAC,KAAK,CAAC,EAAE,KAAK,GAAG,KAAK;IAkBzC;;;OAGG;IACI,gBAAgB,CAAC,QAAQ,EAAE,CAAC,KAAK,EAAE,KAAK,KAAK,IAAI,GAAG,IAAI;IAI/D;;OAEG;IACI,iBAAiB,CAAC,QAAQ,EAAE,cAAc,GAAG,IAAI;IAKxD;;OAEG;IACI,OAAO,CAAC,IAAI,EAAE,IAAI,GAAG,IAAI,GAAG,IAAI;IASvC;;OAEG;IACI,OAAO,IAAI,IAAI,GAAG,SAAS;IAIlC;;OAEG;IACI,OAAO,CAAC,IAAI,EAAE;QAAE,CAAC,GAAG,EAAE,MAAM,GAAG,SAAS,CAAA;KAAE,GAAG,IAAI;IASxD;;OAEG;IACI,MAAM,CAAC,GAAG,EAAE,MAAM,EAAE,KAAK,EAAE,SAAS,GAAG,IAAI;IAMlD;;OAEG;IACI,SAAS,CAAC,MAAM,EAAE,MAAM,GAAG,IAAI;IAStC;;OAEG;IACI,QAAQ,CAAC,GAAG,EAAE,MAAM,EAAE,KAAK,EAAE,KAAK,GAAG,IAAI;IAMhD;;OAEG;IACI,cAAc,CAAC,WAAW,EAAE,MAAM,EAAE,GAAG,IAAI;IAMlD;;OAEG;IACI,QAAQ,CAAC,KAAK,EAAE,QAAQ,GAAG,IAAI;IAMtC;;OAEG;IACI,kBAAkB,CAAC,IAAI,CAAC,EAAE,MAAM,GAAG,IAAI;IAM9C;;;OAGG;IACI,cAAc,CAAC,IAAI,CAAC,EAAE,MAAM,GAAG,IAAI;IAI1C;;OAEG;IACI,UAAU,CAAC,GAAG,EAAE,MAAM,EAAE,OAAO,EAAE,OAAO,GAAG,IAAI,GAAG,IAAI;IAY7D;;OAEG;IACI,OAAO,CAAC,IAAI,CAAC,EAAE,IAAI,GAAG,IAAI;IAMjC;;OAEG;IACI,OAAO,IAAI,IAAI,GAAG,SAAS;IAIlC;;OAEG;IACI,cAAc,IAAI,WAAW,GAAG,SAAS;IAkBhD;;OAEG;IACI,UAAU,CAAC,OAAO,CAAC,EAAE,OAAO,GAAG,IAAI;IAU1C;;OAEG;IACI,UAAU,IAAI,OAAO,GAAG,SAAS;IAIxC;;OAEG;IACI,MAAM,CAAC,cAAc,CAAC,EAAE,cAAc,GAAG,IAAI;IA2CpD;;OAEG;IACI,KAAK,IAAI,IAAI;IAepB;;OAEG;IACI,aAAa,CAAC,UAAU,EAAE,UAAU,EAAE,cAAc,CAAC,EAAE,MAAM,GAAG,IAAI;IAc3E;;OAEG;IACI,gBAAgB,IAAI,IAAI;IAM/B;;;;;;;OAOG;IACI,YAAY,CAAC,KAAK,EAAE,KAAK,EAAE,IAAI,CAAC,EAAE,SAAS,GAAG,WAAW,CAAC,KAAK,GAAG,IAAI,CAAC;IAsC9E;;OAEG;IACH,SAAS,CAAC,sBAAsB,CAC9B,UAAU,EAAE,cAAc,EAAE,EAC5B,KAAK,EAAE,KAAK,GAAG,IAAI,EACnB,IAAI,CAAC,EAAE,SAAS,EAChB,KAAK,GAAE,MAAU,GAChB,WAAW,CAAC,KAAK,GAAG,IAAI,CAAC;IAoB5B;;OAEG;IACH,SAAS,CAAC,qBAAqB,IAAI,IAAI;IAavC;;;OAGG;IACH,OAAO,CAAC,iBAAiB;CAkB1B;AAcD;;;GAGG;AACH,wBAAgB,uBAAuB,CAAC,QAAQ,EAAE,cAAc,GAAG,IAAI,CAEtE"}import { __assign, __read, __spread } from "tslib";
import { dateTimestampInSeconds, getGlobalObject, isPlainObject, isThenable, SyncPromise } from '@sentry/utils';
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
var Scope = /** @class */ (function () {
    function Scope() {
        /** Flag if notifiying is happening. */
        this._notifyingListeners = false;
        /** Callback for client to receive scope changes. */
        this._scopeListeners = [];
        /** Callback list that will be called after {@link applyToEvent}. */
        this._eventProcessors = [];
        /** Array of breadcrumbs. */
        this._breadcrumbs = [];
        /** User */
        this._user = {};
        /** Tags */
        this._tags = {};
        /** Extra */
        this._extra = {};
        /** Contexts */
        this._contexts = {};
    }
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    Scope.clone = function (scope) {
        var newScope = new Scope();
        if (scope) {
            newScope._breadcrumbs = __spread(scope._breadcrumbs);
            newScope._tags = __assign({}, scope._tags);
            newScope._extra = __assign({}, scope._extra);
            newScope._contexts = __assign({}, scope._contexts);
            newScope._user = scope._user;
            newScope._level = scope._level;
            newScope._span = scope._span;
            newScope._session = scope._session;
            newScope._transactionName = scope._transactionName;
            newScope._fingerprint = scope._fingerprint;
            newScope._eventProcessors = __spread(scope._eventProcessors);
        }
        return newScope;
    };
    /**
     * Add internal on change listener. Used for sub SDKs that need to store the scope.
     * @hidden
     */
    Scope.prototype.addScopeListener = function (callback) {
        this._scopeListeners.push(callback);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addEventProcessor = function (callback) {
        this._eventProcessors.push(callback);
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setUser = function (user) {
        this._user = user || {};
        if (this._session) {
            this._session.update({ user: user });
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getUser = function () {
        return this._user;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTags = function (tags) {
        this._tags = __assign(__assign({}, this._tags), tags);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTag = function (key, value) {
        var _a;
        this._tags = __assign(__assign({}, this._tags), (_a = {}, _a[key] = value, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtras = function (extras) {
        this._extra = __assign(__assign({}, this._extra), extras);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtra = function (key, extra) {
        var _a;
        this._extra = __assign(__assign({}, this._extra), (_a = {}, _a[key] = extra, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setFingerprint = function (fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setLevel = function (level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTransactionName = function (name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Can be removed in major version.
     * @deprecated in favor of {@link this.setTransactionName}
     */
    Scope.prototype.setTransaction = function (name) {
        return this.setTransactionName(name);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setContext = function (key, context) {
        var _a;
        if (context === null) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._contexts[key];
        }
        else {
            this._contexts = __assign(__assign({}, this._contexts), (_a = {}, _a[key] = context, _a));
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSpan = function (span) {
        this._span = span;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSpan = function () {
        return this._span;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getTransaction = function () {
        var _a, _b, _c, _d;
        // often, this span will be a transaction, but it's not guaranteed to be
        var span = this.getSpan();
        // try it the new way first
        if ((_a = span) === null || _a === void 0 ? void 0 : _a.transaction) {
            return (_b = span) === null || _b === void 0 ? void 0 : _b.transaction;
        }
        // fallback to the old way (known bug: this only finds transactions with sampled = true)
        if ((_d = (_c = span) === null || _c === void 0 ? void 0 : _c.spanRecorder) === null || _d === void 0 ? void 0 : _d.spans[0]) {
            return span.spanRecorder.spans[0];
        }
        // neither way found a transaction
        return undefined;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSession = function (session) {
        if (!session) {
            delete this._session;
        }
        else {
            this._session = session;
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSession = function () {
        return this._session;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.update = function (captureContext) {
        if (!captureContext) {
            return this;
        }
        if (typeof captureContext === 'function') {
            var updatedScope = captureContext(this);
            return updatedScope instanceof Scope ? updatedScope : this;
        }
        if (captureContext instanceof Scope) {
            this._tags = __assign(__assign({}, this._tags), captureContext._tags);
            this._extra = __assign(__assign({}, this._extra), captureContext._extra);
            this._contexts = __assign(__assign({}, this._contexts), captureContext._contexts);
            if (captureContext._user && Object.keys(captureContext._user).length) {
                this._user = captureContext._user;
            }
            if (captureContext._level) {
                this._level = captureContext._level;
            }
            if (captureContext._fingerprint) {
                this._fingerprint = captureContext._fingerprint;
            }
        }
        else if (isPlainObject(captureContext)) {
            // eslint-disable-next-line no-param-reassign
            captureContext = captureContext;
            this._tags = __assign(__assign({}, this._tags), captureContext.tags);
            this._extra = __assign(__assign({}, this._extra), captureContext.extra);
            this._contexts = __assign(__assign({}, this._contexts), captureContext.contexts);
            if (captureContext.user) {
                this._user = captureContext.user;
            }
            if (captureContext.level) {
                this._level = captureContext.level;
            }
            if (captureContext.fingerprint) {
                this._fingerprint = captureContext.fingerprint;
            }
        }
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clear = function () {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = undefined;
        this._transactionName = undefined;
        this._fingerprint = undefined;
        this._span = undefined;
        this._session = undefined;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
        var mergedBreadcrumb = __assign({ timestamp: dateTimestampInSeconds() }, breadcrumb);
        this._breadcrumbs =
            maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0
                ? __spread(this._breadcrumbs, [mergedBreadcrumb]).slice(-maxBreadcrumbs)
                : __spread(this._breadcrumbs, [mergedBreadcrumb]);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clearBreadcrumbs = function () {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event Event
     * @param hint May contain additional informartion about the original exception.
     * @hidden
     */
    Scope.prototype.applyToEvent = function (event, hint) {
        var _a;
        if (this._extra && Object.keys(this._extra).length) {
            event.extra = __assign(__assign({}, this._extra), event.extra);
        }
        if (this._tags && Object.keys(this._tags).length) {
            event.tags = __assign(__assign({}, this._tags), event.tags);
        }
        if (this._user && Object.keys(this._user).length) {
            event.user = __assign(__assign({}, this._user), event.user);
        }
        if (this._contexts && Object.keys(this._contexts).length) {
            event.contexts = __assign(__assign({}, this._contexts), event.contexts);
        }
        if (this._level) {
            event.level = this._level;
        }
        if (this._transactionName) {
            event.transaction = this._transactionName;
        }
        // We want to set the trace context for normal events only if there isn't already
        // a trace context on the event. There is a product feature in place where we link
        // errors with transaction and it relys on that.
        if (this._span) {
            event.contexts = __assign({ trace: this._span.getTraceContext() }, event.contexts);
            var transactionName = (_a = this._span.transaction) === null || _a === void 0 ? void 0 : _a.name;
            if (transactionName) {
                event.tags = __assign({ transaction: transactionName }, event.tags);
            }
        }
        this._applyFingerprint(event);
        event.breadcrumbs = __spread((event.breadcrumbs || []), this._breadcrumbs);
        event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
        return this._notifyEventProcessors(__spread(getGlobalEventProcessors(), this._eventProcessors), event, hint);
    };
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    Scope.prototype._notifyEventProcessors = function (processors, event, hint, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        return new SyncPromise(function (resolve, reject) {
            var processor = processors[index];
            if (event === null || typeof processor !== 'function') {
                resolve(event);
            }
            else {
                var result = processor(__assign({}, event), hint);
                if (isThenable(result)) {
                    result
                        .then(function (final) { return _this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve); })
                        .then(null, reject);
                }
                else {
                    _this._notifyEventProcessors(processors, result, hint, index + 1)
                        .then(resolve)
                        .then(null, reject);
                }
            }
        });
    };
    /**
     * This will be called on every set call.
     */
    Scope.prototype._notifyScopeListeners = function () {
        var _this = this;
        // We need this check for this._notifyingListeners to be able to work on scope during updates
        // If this check is not here we'll produce endless recursion when something is done with the scope
        // during the callback.
        if (!this._notifyingListeners) {
            this._notifyingListeners = true;
            this._scopeListeners.forEach(function (callback) {
                callback(_this);
            });
            this._notifyingListeners = false;
        }
    };
    /**
     * Applies fingerprint from the scope to the event if there's one,
     * uses message if there's one instead or get rid of empty fingerprint
     */
    Scope.prototype._applyFingerprint = function (event) {
        // Make sure it's an array first and we actually have something in place
        event.fingerprint = event.fingerprint
            ? Array.isArray(event.fingerprint)
                ? event.fingerprint
                : [event.fingerprint]
            : [];
        // If we have something on the scope, then merge it with event
        if (this._fingerprint) {
            event.fingerprint = event.fingerprint.concat(this._fingerprint);
        }
        // If we have no data at all, remove empty array default
        if (event.fingerprint && !event.fingerprint.length) {
            delete event.fingerprint;
        }
    };
    return Scope;
}());
export { Scope };
/**
 * Retruns the global event processors.
 */
function getGlobalEventProcessors() {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access  */
    var global = getGlobalObject();
    global.__SENTRY__ = global.__SENTRY__ || {};
    global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];
    return global.__SENTRY__.globalEventProcessors;
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
export function addGlobalEventProcessor(callback) {
    getGlobalEventProcessors().push(callback);
}
//# sourceMappingURL=scope.js.map{"version":3,"file":"scope.js","sourceRoot":"","sources":["../src/scope.ts"],"names":[],"mappings":";AAmBA,OAAO,EAAE,sBAAsB,EAAE,eAAe,EAAE,aAAa,EAAE,UAAU,EAAE,WAAW,EAAE,MAAM,eAAe,CAAC;AAIhH;;;GAGG;AACH;IAAA;QACE,uCAAuC;QAC7B,wBAAmB,GAAY,KAAK,CAAC;QAE/C,oDAAoD;QAC1C,oBAAe,GAAkC,EAAE,CAAC;QAE9D,oEAAoE;QAC1D,qBAAgB,GAAqB,EAAE,CAAC;QAElD,4BAA4B;QAClB,iBAAY,GAAiB,EAAE,CAAC;QAE1C,WAAW;QACD,UAAK,GAAS,EAAE,CAAC;QAE3B,WAAW;QACD,UAAK,GAAiC,EAAE,CAAC;QAEnD,YAAY;QACF,WAAM,GAAW,EAAE,CAAC;QAE9B,eAAe;QACL,cAAS,GAAa,EAAE,CAAC;IAyarC,CAAC;IAxZC;;;OAGG;IACW,WAAK,GAAnB,UAAoB,KAAa;QAC/B,IAAM,QAAQ,GAAG,IAAI,KAAK,EAAE,CAAC;QAC7B,IAAI,KAAK,EAAE;YACT,QAAQ,CAAC,YAAY,YAAO,KAAK,CAAC,YAAY,CAAC,CAAC;YAChD,QAAQ,CAAC,KAAK,gBAAQ,KAAK,CAAC,KAAK,CAAE,CAAC;YACpC,QAAQ,CAAC,MAAM,gBAAQ,KAAK,CAAC,MAAM,CAAE,CAAC;YACtC,QAAQ,CAAC,SAAS,gBAAQ,KAAK,CAAC,SAAS,CAAE,CAAC;YAC5C,QAAQ,CAAC,KAAK,GAAG,KAAK,CAAC,KAAK,CAAC;YAC7B,QAAQ,CAAC,MAAM,GAAG,KAAK,CAAC,MAAM,CAAC;YAC/B,QAAQ,CAAC,KAAK,GAAG,KAAK,CAAC,KAAK,CAAC;YAC7B,QAAQ,CAAC,QAAQ,GAAG,KAAK,CAAC,QAAQ,CAAC;YACnC,QAAQ,CAAC,gBAAgB,GAAG,KAAK,CAAC,gBAAgB,CAAC;YACnD,QAAQ,CAAC,YAAY,GAAG,KAAK,CAAC,YAAY,CAAC;YAC3C,QAAQ,CAAC,gBAAgB,YAAO,KAAK,CAAC,gBAAgB,CAAC,CAAC;SACzD;QACD,OAAO,QAAQ,CAAC;IAClB,CAAC;IAED;;;OAGG;IACI,gCAAgB,GAAvB,UAAwB,QAAgC;QACtD,IAAI,CAAC,eAAe,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;IACtC,CAAC;IAED;;OAEG;IACI,iCAAiB,GAAxB,UAAyB,QAAwB;QAC/C,IAAI,CAAC,gBAAgB,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;QACrC,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,uBAAO,GAAd,UAAe,IAAiB;QAC9B,IAAI,CAAC,KAAK,GAAG,IAAI,IAAI,EAAE,CAAC;QACxB,IAAI,IAAI,CAAC,QAAQ,EAAE;YACjB,IAAI,CAAC,QAAQ,CAAC,MAAM,CAAC,EAAE,IAAI,MAAA,EAAE,CAAC,CAAC;SAChC;QACD,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,uBAAO,GAAd;QACE,OAAO,IAAI,CAAC,KAAK,CAAC;IACpB,CAAC;IAED;;OAEG;IACI,uBAAO,GAAd,UAAe,IAAkC;QAC/C,IAAI,CAAC,KAAK,yBACL,IAAI,CAAC,KAAK,GACV,IAAI,CACR,CAAC;QACF,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,sBAAM,GAAb,UAAc,GAAW,EAAE,KAAgB;;QACzC,IAAI,CAAC,KAAK,yBAAQ,IAAI,CAAC,KAAK,gBAAG,GAAG,IAAG,KAAK,MAAE,CAAC;QAC7C,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,yBAAS,GAAhB,UAAiB,MAAc;QAC7B,IAAI,CAAC,MAAM,yBACN,IAAI,CAAC,MAAM,GACX,MAAM,CACV,CAAC;QACF,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,wBAAQ,GAAf,UAAgB,GAAW,EAAE,KAAY;;QACvC,IAAI,CAAC,MAAM,yBAAQ,IAAI,CAAC,MAAM,gBAAG,GAAG,IAAG,KAAK,MAAE,CAAC;QAC/C,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,8BAAc,GAArB,UAAsB,WAAqB;QACzC,IAAI,CAAC,YAAY,GAAG,WAAW,CAAC;QAChC,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,wBAAQ,GAAf,UAAgB,KAAe;QAC7B,IAAI,CAAC,MAAM,GAAG,KAAK,CAAC;QACpB,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,kCAAkB,GAAzB,UAA0B,IAAa;QACrC,IAAI,CAAC,gBAAgB,GAAG,IAAI,CAAC;QAC7B,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;;OAGG;IACI,8BAAc,GAArB,UAAsB,IAAa;QACjC,OAAO,IAAI,CAAC,kBAAkB,CAAC,IAAI,CAAC,CAAC;IACvC,CAAC;IAED;;OAEG;IACI,0BAAU,GAAjB,UAAkB,GAAW,EAAE,OAAuB;;QACpD,IAAI,OAAO,KAAK,IAAI,EAAE;YACpB,gEAAgE;YAChE,OAAO,IAAI,CAAC,SAAS,CAAC,GAAG,CAAC,CAAC;SAC5B;aAAM;YACL,IAAI,CAAC,SAAS,yBAAQ,IAAI,CAAC,SAAS,gBAAG,GAAG,IAAG,OAAO,MAAE,CAAC;SACxD;QAED,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,uBAAO,GAAd,UAAe,IAAW;QACxB,IAAI,CAAC,KAAK,GAAG,IAAI,CAAC;QAClB,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,uBAAO,GAAd;QACE,OAAO,IAAI,CAAC,KAAK,CAAC;IACpB,CAAC;IAED;;OAEG;IACI,8BAAc,GAArB;;QACE,wEAAwE;QACxE,IAAM,IAAI,GAAG,IAAI,CAAC,OAAO,EAA8D,CAAC;QAExF,2BAA2B;QAC3B,UAAI,IAAI,0CAAE,WAAW,EAAE;YACrB,aAAO,IAAI,0CAAE,WAAW,CAAC;SAC1B;QAED,wFAAwF;QACxF,gBAAI,IAAI,0CAAE,YAAY,0CAAE,KAAK,CAAC,CAAC,GAAG;YAChC,OAAO,IAAI,CAAC,YAAY,CAAC,KAAK,CAAC,CAAC,CAAgB,CAAC;SAClD;QAED,kCAAkC;QAClC,OAAO,SAAS,CAAC;IACnB,CAAC;IAED;;OAEG;IACI,0BAAU,GAAjB,UAAkB,OAAiB;QACjC,IAAI,CAAC,OAAO,EAAE;YACZ,OAAO,IAAI,CAAC,QAAQ,CAAC;SACtB;aAAM;YACL,IAAI,CAAC,QAAQ,GAAG,OAAO,CAAC;SACzB;QACD,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,0BAAU,GAAjB;QACE,OAAO,IAAI,CAAC,QAAQ,CAAC;IACvB,CAAC;IAED;;OAEG;IACI,sBAAM,GAAb,UAAc,cAA+B;QAC3C,IAAI,CAAC,cAAc,EAAE;YACnB,OAAO,IAAI,CAAC;SACb;QAED,IAAI,OAAO,cAAc,KAAK,UAAU,EAAE;YACxC,IAAM,YAAY,GAAI,cAAqC,CAAC,IAAI,CAAC,CAAC;YAClE,OAAO,YAAY,YAAY,KAAK,CAAC,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,IAAI,CAAC;SAC5D;QAED,IAAI,cAAc,YAAY,KAAK,EAAE;YACnC,IAAI,CAAC,KAAK,yBAAQ,IAAI,CAAC,KAAK,GAAK,cAAc,CAAC,KAAK,CAAE,CAAC;YACxD,IAAI,CAAC,MAAM,yBAAQ,IAAI,CAAC,MAAM,GAAK,cAAc,CAAC,MAAM,CAAE,CAAC;YAC3D,IAAI,CAAC,SAAS,yBAAQ,IAAI,CAAC,SAAS,GAAK,cAAc,CAAC,SAAS,CAAE,CAAC;YACpE,IAAI,cAAc,CAAC,KAAK,IAAI,MAAM,CAAC,IAAI,CAAC,cAAc,CAAC,KAAK,CAAC,CAAC,MAAM,EAAE;gBACpE,IAAI,CAAC,KAAK,GAAG,cAAc,CAAC,KAAK,CAAC;aACnC;YACD,IAAI,cAAc,CAAC,MAAM,EAAE;gBACzB,IAAI,CAAC,MAAM,GAAG,cAAc,CAAC,MAAM,CAAC;aACrC;YACD,IAAI,cAAc,CAAC,YAAY,EAAE;gBAC/B,IAAI,CAAC,YAAY,GAAG,cAAc,CAAC,YAAY,CAAC;aACjD;SACF;aAAM,IAAI,aAAa,CAAC,cAAc,CAAC,EAAE;YACxC,6CAA6C;YAC7C,cAAc,GAAG,cAA8B,CAAC;YAChD,IAAI,CAAC,KAAK,yBAAQ,IAAI,CAAC,KAAK,GAAK,cAAc,CAAC,IAAI,CAAE,CAAC;YACvD,IAAI,CAAC,MAAM,yBAAQ,IAAI,CAAC,MAAM,GAAK,cAAc,CAAC,KAAK,CAAE,CAAC;YAC1D,IAAI,CAAC,SAAS,yBAAQ,IAAI,CAAC,SAAS,GAAK,cAAc,CAAC,QAAQ,CAAE,CAAC;YACnE,IAAI,cAAc,CAAC,IAAI,EAAE;gBACvB,IAAI,CAAC,KAAK,GAAG,cAAc,CAAC,IAAI,CAAC;aAClC;YACD,IAAI,cAAc,CAAC,KAAK,EAAE;gBACxB,IAAI,CAAC,MAAM,GAAG,cAAc,CAAC,KAAK,CAAC;aACpC;YACD,IAAI,cAAc,CAAC,WAAW,EAAE;gBAC9B,IAAI,CAAC,YAAY,GAAG,cAAc,CAAC,WAAW,CAAC;aAChD;SACF;QAED,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,qBAAK,GAAZ;QACE,IAAI,CAAC,YAAY,GAAG,EAAE,CAAC;QACvB,IAAI,CAAC,KAAK,GAAG,EAAE,CAAC;QAChB,IAAI,CAAC,MAAM,GAAG,EAAE,CAAC;QACjB,IAAI,CAAC,KAAK,GAAG,EAAE,CAAC;QAChB,IAAI,CAAC,SAAS,GAAG,EAAE,CAAC;QACpB,IAAI,CAAC,MAAM,GAAG,SAAS,CAAC;QACxB,IAAI,CAAC,gBAAgB,GAAG,SAAS,CAAC;QAClC,IAAI,CAAC,YAAY,GAAG,SAAS,CAAC;QAC9B,IAAI,CAAC,KAAK,GAAG,SAAS,CAAC;QACvB,IAAI,CAAC,QAAQ,GAAG,SAAS,CAAC;QAC1B,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,6BAAa,GAApB,UAAqB,UAAsB,EAAE,cAAuB;QAClE,IAAM,gBAAgB,cACpB,SAAS,EAAE,sBAAsB,EAAE,IAChC,UAAU,CACd,CAAC;QAEF,IAAI,CAAC,YAAY;YACf,cAAc,KAAK,SAAS,IAAI,cAAc,IAAI,CAAC;gBACjD,CAAC,CAAC,SAAI,IAAI,CAAC,YAAY,GAAE,gBAAgB,GAAE,KAAK,CAAC,CAAC,cAAc,CAAC;gBACjE,CAAC,UAAK,IAAI,CAAC,YAAY,GAAE,gBAAgB,EAAC,CAAC;QAC/C,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;OAEG;IACI,gCAAgB,GAAvB;QACE,IAAI,CAAC,YAAY,GAAG,EAAE,CAAC;QACvB,IAAI,CAAC,qBAAqB,EAAE,CAAC;QAC7B,OAAO,IAAI,CAAC;IACd,CAAC;IAED;;;;;;;OAOG;IACI,4BAAY,GAAnB,UAAoB,KAAY,EAAE,IAAgB;;QAChD,IAAI,IAAI,CAAC,MAAM,IAAI,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC,MAAM,EAAE;YAClD,KAAK,CAAC,KAAK,yBAAQ,IAAI,CAAC,MAAM,GAAK,KAAK,CAAC,KAAK,CAAE,CAAC;SAClD;QACD,IAAI,IAAI,CAAC,KAAK,IAAI,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,MAAM,EAAE;YAChD,KAAK,CAAC,IAAI,yBAAQ,IAAI,CAAC,KAAK,GAAK,KAAK,CAAC,IAAI,CAAE,CAAC;SAC/C;QACD,IAAI,IAAI,CAAC,KAAK,IAAI,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,MAAM,EAAE;YAChD,KAAK,CAAC,IAAI,yBAAQ,IAAI,CAAC,KAAK,GAAK,KAAK,CAAC,IAAI,CAAE,CAAC;SAC/C;QACD,IAAI,IAAI,CAAC,SAAS,IAAI,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,SAAS,CAAC,CAAC,MAAM,EAAE;YACxD,KAAK,CAAC,QAAQ,yBAAQ,IAAI,CAAC,SAAS,GAAK,KAAK,CAAC,QAAQ,CAAE,CAAC;SAC3D;QACD,IAAI,IAAI,CAAC,MAAM,EAAE;YACf,KAAK,CAAC,KAAK,GAAG,IAAI,CAAC,MAAM,CAAC;SAC3B;QACD,IAAI,IAAI,CAAC,gBAAgB,EAAE;YACzB,KAAK,CAAC,WAAW,GAAG,IAAI,CAAC,gBAAgB,CAAC;SAC3C;QACD,iFAAiF;QACjF,kFAAkF;QAClF,gDAAgD;QAChD,IAAI,IAAI,CAAC,KAAK,EAAE;YACd,KAAK,CAAC,QAAQ,cAAK,KAAK,EAAE,IAAI,CAAC,KAAK,CAAC,eAAe,EAAE,IAAK,KAAK,CAAC,QAAQ,CAAE,CAAC;YAC5E,IAAM,eAAe,SAAG,IAAI,CAAC,KAAK,CAAC,WAAW,0CAAE,IAAI,CAAC;YACrD,IAAI,eAAe,EAAE;gBACnB,KAAK,CAAC,IAAI,cAAK,WAAW,EAAE,eAAe,IAAK,KAAK,CAAC,IAAI,CAAE,CAAC;aAC9D;SACF;QAED,IAAI,CAAC,iBAAiB,CAAC,KAAK,CAAC,CAAC;QAE9B,KAAK,CAAC,WAAW,YAAO,CAAC,KAAK,CAAC,WAAW,IAAI,EAAE,CAAC,EAAK,IAAI,CAAC,YAAY,CAAC,CAAC;QACzE,KAAK,CAAC,WAAW,GAAG,KAAK,CAAC,WAAW,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,WAAW,CAAC,CAAC,CAAC,SAAS,CAAC;QAEjF,OAAO,IAAI,CAAC,sBAAsB,UAAK,wBAAwB,EAAE,EAAK,IAAI,CAAC,gBAAgB,GAAG,KAAK,EAAE,IAAI,CAAC,CAAC;IAC7G,CAAC;IAED;;OAEG;IACO,sCAAsB,GAAhC,UACE,UAA4B,EAC5B,KAAmB,EACnB,IAAgB,EAChB,KAAiB;QAJnB,iBAuBC;QAnBC,sBAAA,EAAA,SAAiB;QAEjB,OAAO,IAAI,WAAW,CAAe,UAAC,OAAO,EAAE,MAAM;YACnD,IAAM,SAAS,GAAG,UAAU,CAAC,KAAK,CAAC,CAAC;YACpC,IAAI,KAAK,KAAK,IAAI,IAAI,OAAO,SAAS,KAAK,UAAU,EAAE;gBACrD,OAAO,CAAC,KAAK,CAAC,CAAC;aAChB;iBAAM;gBACL,IAAM,MAAM,GAAG,SAAS,cAAM,KAAK,GAAI,IAAI,CAAiB,CAAC;gBAC7D,IAAI,UAAU,CAAC,MAAM,CAAC,EAAE;oBACrB,MAAoC;yBAClC,IAAI,CAAC,UAAA,KAAK,IAAI,OAAA,KAAI,CAAC,sBAAsB,CAAC,UAAU,EAAE,KAAK,EAAE,IAAI,EAAE,KAAK,GAAG,CAAC,CAAC,CAAC,IAAI,CAAC,OAAO,CAAC,EAA7E,CAA6E,CAAC;yBAC5F,IAAI,CAAC,IAAI,EAAE,MAAM,CAAC,CAAC;iBACvB;qBAAM;oBACL,KAAI,CAAC,sBAAsB,CAAC,UAAU,EAAE,MAAM,EAAE,IAAI,EAAE,KAAK,GAAG,CAAC,CAAC;yBAC7D,IAAI,CAAC,OAAO,CAAC;yBACb,IAAI,CAAC,IAAI,EAAE,MAAM,CAAC,CAAC;iBACvB;aACF;QACH,CAAC,CAAC,CAAC;IACL,CAAC;IAED;;OAEG;IACO,qCAAqB,GAA/B;QAAA,iBAWC;QAVC,6FAA6F;QAC7F,kGAAkG;QAClG,uBAAuB;QACvB,IAAI,CAAC,IAAI,CAAC,mBAAmB,EAAE;YAC7B,IAAI,CAAC,mBAAmB,GAAG,IAAI,CAAC;YAChC,IAAI,CAAC,eAAe,CAAC,OAAO,CAAC,UAAA,QAAQ;gBACnC,QAAQ,CAAC,KAAI,CAAC,CAAC;YACjB,CAAC,CAAC,CAAC;YACH,IAAI,CAAC,mBAAmB,GAAG,KAAK,CAAC;SAClC;IACH,CAAC;IAED;;;OAGG;IACK,iCAAiB,GAAzB,UAA0B,KAAY;QACpC,wEAAwE;QACxE,KAAK,CAAC,WAAW,GAAG,KAAK,CAAC,WAAW;YACnC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,KAAK,CAAC,WAAW,CAAC;gBAChC,CAAC,CAAC,KAAK,CAAC,WAAW;gBACnB,CAAC,CAAC,CAAC,KAAK,CAAC,WAAW,CAAC;YACvB,CAAC,CAAC,EAAE,CAAC;QAEP,8DAA8D;QAC9D,IAAI,IAAI,CAAC,YAAY,EAAE;YACrB,KAAK,CAAC,WAAW,GAAG,KAAK,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,YAAY,CAAC,CAAC;SACjE;QAED,wDAAwD;QACxD,IAAI,KAAK,CAAC,WAAW,IAAI,CAAC,KAAK,CAAC,WAAW,CAAC,MAAM,EAAE;YAClD,OAAO,KAAK,CAAC,WAAW,CAAC;SAC1B;IACH,CAAC;IACH,YAAC;AAAD,CAAC,AAhcD,IAgcC;;AAED;;GAEG;AACH,SAAS,wBAAwB;IAC/B,oGAAoG;IACpG,IAAM,MAAM,GAAG,eAAe,EAAO,CAAC;IACtC,MAAM,CAAC,UAAU,GAAG,MAAM,CAAC,UAAU,IAAI,EAAE,CAAC;IAC5C,MAAM,CAAC,UAAU,CAAC,qBAAqB,GAAG,MAAM,CAAC,UAAU,CAAC,qBAAqB,IAAI,EAAE,CAAC;IACxF,OAAO,MAAM,CAAC,UAAU,CAAC,qBAAqB,CAAC;IAC/C,kGAAkG;AACpG,CAAC;AAED;;;GAGG;AACH,MAAM,UAAU,uBAAuB,CAAC,QAAwB;IAC9D,wBAAwB,EAAE,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;AAC5C,CAAC","sourcesContent":["/* eslint-disable max-lines */\nimport {\n  Breadcrumb,\n  CaptureContext,\n  Context,\n  Contexts,\n  Event,\n  EventHint,\n  EventProcessor,\n  Extra,\n  Extras,\n  Primitive,\n  Scope as ScopeInterface,\n  ScopeContext,\n  Severity,\n  Span,\n  Transaction,\n  User,\n} from '@sentry/types';\nimport { dateTimestampInSeconds, getGlobalObject, isPlainObject, isThenable, SyncPromise } from '@sentry/utils';\n\nimport { Session } from './session';\n\n/**\n * Holds additional event information. {@link Scope.applyToEvent} will be\n * called by the client before an event will be sent.\n */\nexport class Scope implements ScopeInterface {\n  /** Flag if notifiying is happening. */\n  protected _notifyingListeners: boolean = false;\n\n  /** Callback for client to receive scope changes. */\n  protected _scopeListeners: Array<(scope: Scope) => void> = [];\n\n  /** Callback list that will be called after {@link applyToEvent}. */\n  protected _eventProcessors: EventProcessor[] = [];\n\n  /** Array of breadcrumbs. */\n  protected _breadcrumbs: Breadcrumb[] = [];\n\n  /** User */\n  protected _user: User = {};\n\n  /** Tags */\n  protected _tags: { [key: string]: Primitive } = {};\n\n  /** Extra */\n  protected _extra: Extras = {};\n\n  /** Contexts */\n  protected _contexts: Contexts = {};\n\n  /** Fingerprint */\n  protected _fingerprint?: string[];\n\n  /** Severity */\n  protected _level?: Severity;\n\n  /** Transaction Name */\n  protected _transactionName?: string;\n\n  /** Span */\n  protected _span?: Span;\n\n  /** Session */\n  protected _session?: Session;\n\n  /**\n   * Inherit values from the parent scope.\n   * @param scope to clone.\n   */\n  public static clone(scope?: Scope): Scope {\n    const newScope = new Scope();\n    if (scope) {\n      newScope._breadcrumbs = [...scope._breadcrumbs];\n      newScope._tags = { ...scope._tags };\n      newScope._extra = { ...scope._extra };\n      newScope._contexts = { ...scope._contexts };\n      newScope._user = scope._user;\n      newScope._level = scope._level;\n      newScope._span = scope._span;\n      newScope._session = scope._session;\n      newScope._transactionName = scope._transactionName;\n      newScope._fingerprint = scope._fingerprint;\n      newScope._eventProcessors = [...scope._eventProcessors];\n    }\n    return newScope;\n  }\n\n  /**\n   * Add internal on change listener. Used for sub SDKs that need to store the scope.\n   * @hidden\n   */\n  public addScopeListener(callback: (scope: Scope) => void): void {\n    this._scopeListeners.push(callback);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public addEventProcessor(callback: EventProcessor): this {\n    this._eventProcessors.push(callback);\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setUser(user: User | null): this {\n    this._user = user || {};\n    if (this._session) {\n      this._session.update({ user });\n    }\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getUser(): User | undefined {\n    return this._user;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTags(tags: { [key: string]: Primitive }): this {\n    this._tags = {\n      ...this._tags,\n      ...tags,\n    };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTag(key: string, value: Primitive): this {\n    this._tags = { ...this._tags, [key]: value };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtras(extras: Extras): this {\n    this._extra = {\n      ...this._extra,\n      ...extras,\n    };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setExtra(key: string, extra: Extra): this {\n    this._extra = { ...this._extra, [key]: extra };\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setFingerprint(fingerprint: string[]): this {\n    this._fingerprint = fingerprint;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setLevel(level: Severity): this {\n    this._level = level;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setTransactionName(name?: string): this {\n    this._transactionName = name;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * Can be removed in major version.\n   * @deprecated in favor of {@link this.setTransactionName}\n   */\n  public setTransaction(name?: string): this {\n    return this.setTransactionName(name);\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setContext(key: string, context: Context | null): this {\n    if (context === null) {\n      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete\n      delete this._contexts[key];\n    } else {\n      this._contexts = { ...this._contexts, [key]: context };\n    }\n\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setSpan(span?: Span): this {\n    this._span = span;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getSpan(): Span | undefined {\n    return this._span;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getTransaction(): Transaction | undefined {\n    // often, this span will be a transaction, but it's not guaranteed to be\n    const span = this.getSpan() as undefined | (Span & { spanRecorder: { spans: Span[] } });\n\n    // try it the new way first\n    if (span?.transaction) {\n      return span?.transaction;\n    }\n\n    // fallback to the old way (known bug: this only finds transactions with sampled = true)\n    if (span?.spanRecorder?.spans[0]) {\n      return span.spanRecorder.spans[0] as Transaction;\n    }\n\n    // neither way found a transaction\n    return undefined;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public setSession(session?: Session): this {\n    if (!session) {\n      delete this._session;\n    } else {\n      this._session = session;\n    }\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public getSession(): Session | undefined {\n    return this._session;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public update(captureContext?: CaptureContext): this {\n    if (!captureContext) {\n      return this;\n    }\n\n    if (typeof captureContext === 'function') {\n      const updatedScope = (captureContext as <T>(scope: T) => T)(this);\n      return updatedScope instanceof Scope ? updatedScope : this;\n    }\n\n    if (captureContext instanceof Scope) {\n      this._tags = { ...this._tags, ...captureContext._tags };\n      this._extra = { ...this._extra, ...captureContext._extra };\n      this._contexts = { ...this._contexts, ...captureContext._contexts };\n      if (captureContext._user && Object.keys(captureContext._user).length) {\n        this._user = captureContext._user;\n      }\n      if (captureContext._level) {\n        this._level = captureContext._level;\n      }\n      if (captureContext._fingerprint) {\n        this._fingerprint = captureContext._fingerprint;\n      }\n    } else if (isPlainObject(captureContext)) {\n      // eslint-disable-next-line no-param-reassign\n      captureContext = captureContext as ScopeContext;\n      this._tags = { ...this._tags, ...captureContext.tags };\n      this._extra = { ...this._extra, ...captureContext.extra };\n      this._contexts = { ...this._contexts, ...captureContext.contexts };\n      if (captureContext.user) {\n        this._user = captureContext.user;\n      }\n      if (captureContext.level) {\n        this._level = captureContext.level;\n      }\n      if (captureContext.fingerprint) {\n        this._fingerprint = captureContext.fingerprint;\n      }\n    }\n\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public clear(): this {\n    this._breadcrumbs = [];\n    this._tags = {};\n    this._extra = {};\n    this._user = {};\n    this._contexts = {};\n    this._level = undefined;\n    this._transactionName = undefined;\n    this._fingerprint = undefined;\n    this._span = undefined;\n    this._session = undefined;\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): this {\n    const mergedBreadcrumb = {\n      timestamp: dateTimestampInSeconds(),\n      ...breadcrumb,\n    };\n\n    this._breadcrumbs =\n      maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0\n        ? [...this._breadcrumbs, mergedBreadcrumb].slice(-maxBreadcrumbs)\n        : [...this._breadcrumbs, mergedBreadcrumb];\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  public clearBreadcrumbs(): this {\n    this._breadcrumbs = [];\n    this._notifyScopeListeners();\n    return this;\n  }\n\n  /**\n   * Applies the current context and fingerprint to the event.\n   * Note that breadcrumbs will be added by the client.\n   * Also if the event has already breadcrumbs on it, we do not merge them.\n   * @param event Event\n   * @param hint May contain additional informartion about the original exception.\n   * @hidden\n   */\n  public applyToEvent(event: Event, hint?: EventHint): PromiseLike<Event | null> {\n    if (this._extra && Object.keys(this._extra).length) {\n      event.extra = { ...this._extra, ...event.extra };\n    }\n    if (this._tags && Object.keys(this._tags).length) {\n      event.tags = { ...this._tags, ...event.tags };\n    }\n    if (this._user && Object.keys(this._user).length) {\n      event.user = { ...this._user, ...event.user };\n    }\n    if (this._contexts && Object.keys(this._contexts).length) {\n      event.contexts = { ...this._contexts, ...event.contexts };\n    }\n    if (this._level) {\n      event.level = this._level;\n    }\n    if (this._transactionName) {\n      event.transaction = this._transactionName;\n    }\n    // We want to set the trace context for normal events only if there isn't already\n    // a trace context on the event. There is a product feature in place where we link\n    // errors with transaction and it relys on that.\n    if (this._span) {\n      event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };\n      const transactionName = this._span.transaction?.name;\n      if (transactionName) {\n        event.tags = { transaction: transactionName, ...event.tags };\n      }\n    }\n\n    this._applyFingerprint(event);\n\n    event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs];\n    event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;\n\n    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);\n  }\n\n  /**\n   * This will be called after {@link applyToEvent} is finished.\n   */\n  protected _notifyEventProcessors(\n    processors: EventProcessor[],\n    event: Event | null,\n    hint?: EventHint,\n    index: number = 0,\n  ): PromiseLike<Event | null> {\n    return new SyncPromise<Event | null>((resolve, reject) => {\n      const processor = processors[index];\n      if (event === null || typeof processor !== 'function') {\n        resolve(event);\n      } else {\n        const result = processor({ ...event }, hint) as Event | null;\n        if (isThenable(result)) {\n          (result as PromiseLike<Event | null>)\n            .then(final => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve))\n            .then(null, reject);\n        } else {\n          this._notifyEventProcessors(processors, result, hint, index + 1)\n            .then(resolve)\n            .then(null, reject);\n        }\n      }\n    });\n  }\n\n  /**\n   * This will be called on every set call.\n   */\n  protected _notifyScopeListeners(): void {\n    // We need this check for this._notifyingListeners to be able to work on scope during updates\n    // If this check is not here we'll produce endless recursion when something is done with the scope\n    // during the callback.\n    if (!this._notifyingListeners) {\n      this._notifyingListeners = true;\n      this._scopeListeners.forEach(callback => {\n        callback(this);\n      });\n      this._notifyingListeners = false;\n    }\n  }\n\n  /**\n   * Applies fingerprint from the scope to the event if there's one,\n   * uses message if there's one instead or get rid of empty fingerprint\n   */\n  private _applyFingerprint(event: Event): void {\n    // Make sure it's an array first and we actually have something in place\n    event.fingerprint = event.fingerprint\n      ? Array.isArray(event.fingerprint)\n        ? event.fingerprint\n        : [event.fingerprint]\n      : [];\n\n    // If we have something on the scope, then merge it with event\n    if (this._fingerprint) {\n      event.fingerprint = event.fingerprint.concat(this._fingerprint);\n    }\n\n    // If we have no data at all, remove empty array default\n    if (event.fingerprint && !event.fingerprint.length) {\n      delete event.fingerprint;\n    }\n  }\n}\n\n/**\n * Retruns the global event processors.\n */\nfunction getGlobalEventProcessors(): EventProcessor[] {\n  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access  */\n  const global = getGlobalObject<any>();\n  global.__SENTRY__ = global.__SENTRY__ || {};\n  global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];\n  return global.__SENTRY__.globalEventProcessors;\n  /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */\n}\n\n/**\n * Add a EventProcessor to be kept globally.\n * @param callback EventProcessor to add\n */\nexport function addGlobalEventProcessor(callback: EventProcessor): void {\n  getGlobalEventProcessors().push(callback);\n}\n"]}import { Session as SessionInterface, SessionContext, SessionStatus } from '@sentry/types';
/**
 * @inheritdoc
 */
export declare class Session implements SessionInterface {
    userAgent?: string;
    errors: number;
    release?: string;
    sid: string;
    did?: string;
    timestamp: number;
    started: number;
    duration: number;
    status: SessionStatus;
    environment?: string;
    ipAddress?: string;
    constructor(context?: Omit<SessionContext, 'started' | 'status'>);
    /** JSDoc */
    update(context?: SessionContext): void;
    /** JSDoc */
    close(status?: Exclude<SessionStatus, SessionStatus.Ok>): void;
    /** JSDoc */
    toJSON(): {
        init: boolean;
        sid: string;
        did?: string;
        timestamp: string;
        started: string;
        duration: number;
        status: SessionStatus;
        errors: number;
        attrs?: {
            release?: string;
            environment?: string;
            user_agent?: string;
            ip_address?: string;
        };
    };
}
//# sourceMappingURL=session.d.ts.map{"version":3,"file":"session.d.ts","sourceRoot":"","sources":["../src/session.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,OAAO,IAAI,gBAAgB,EAAE,cAAc,EAAE,aAAa,EAAE,MAAM,eAAe,CAAC;AAG3F;;GAEG;AACH,qBAAa,OAAQ,YAAW,gBAAgB;IACvC,SAAS,CAAC,EAAE,MAAM,CAAC;IACnB,MAAM,EAAE,MAAM,CAAK;IACnB,OAAO,CAAC,EAAE,MAAM,CAAC;IACjB,GAAG,EAAE,MAAM,CAAW;IACtB,GAAG,CAAC,EAAE,MAAM,CAAC;IACb,SAAS,EAAE,MAAM,CAAc;IAC/B,OAAO,EAAE,MAAM,CAAc;IAC7B,QAAQ,EAAE,MAAM,CAAK;IACrB,MAAM,EAAE,aAAa,CAAoB;IACzC,WAAW,CAAC,EAAE,MAAM,CAAC;IACrB,SAAS,CAAC,EAAE,MAAM,CAAC;gBAEd,OAAO,CAAC,EAAE,IAAI,CAAC,cAAc,EAAE,SAAS,GAAG,QAAQ,CAAC;IAMhE,YAAY;IAEZ,MAAM,CAAC,OAAO,GAAE,cAAmB,GAAG,IAAI;IAgD1C,YAAY;IACZ,KAAK,CAAC,MAAM,CAAC,EAAE,OAAO,CAAC,aAAa,EAAE,aAAa,CAAC,EAAE,CAAC,GAAG,IAAI;IAU9D,YAAY;IACZ,MAAM,IAAI;QACR,IAAI,EAAE,OAAO,CAAC;QACd,GAAG,EAAE,MAAM,CAAC;QACZ,GAAG,CAAC,EAAE,MAAM,CAAC;QACb,SAAS,EAAE,MAAM,CAAC;QAClB,OAAO,EAAE,MAAM,CAAC;QAChB,QAAQ,EAAE,MAAM,CAAC;QACjB,MAAM,EAAE,aAAa,CAAC;QACtB,MAAM,EAAE,MAAM,CAAC;QACf,KAAK,CAAC,EAAE;YACN,OAAO,CAAC,EAAE,MAAM,CAAC;YACjB,WAAW,CAAC,EAAE,MAAM,CAAC;YACrB,UAAU,CAAC,EAAE,MAAM,CAAC;YACpB,UAAU,CAAC,EAAE,MAAM,CAAC;SACrB,CAAC;KACH;CAkBF"}import { SessionStatus } from '@sentry/types';
import { dropUndefinedKeys, uuid4 } from '@sentry/utils';
/**
 * @inheritdoc
 */
var Session = /** @class */ (function () {
    function Session(context) {
        this.errors = 0;
        this.sid = uuid4();
        this.timestamp = Date.now();
        this.started = Date.now();
        this.duration = 0;
        this.status = SessionStatus.Ok;
        if (context) {
            this.update(context);
        }
    }
    /** JSDoc */
    // eslint-disable-next-line complexity
    Session.prototype.update = function (context) {
        if (context === void 0) { context = {}; }
        if (context.user) {
            if (context.user.ip_address) {
                this.ipAddress = context.user.ip_address;
            }
            if (!context.did) {
                this.did = context.user.id || context.user.email || context.user.username;
            }
        }
        this.timestamp = context.timestamp || Date.now();
        if (context.sid) {
            // Good enough uuid validation. — Kamil
            this.sid = context.sid.length === 32 ? context.sid : uuid4();
        }
        if (context.did) {
            this.did = "" + context.did;
        }
        if (typeof context.started === 'number') {
            this.started = context.started;
        }
        if (typeof context.duration === 'number') {
            this.duration = context.duration;
        }
        else {
            this.duration = this.timestamp - this.started;
        }
        if (context.release) {
            this.release = context.release;
        }
        if (context.environment) {
            this.environment = context.environment;
        }
        if (context.ipAddress) {
            this.ipAddress = context.ipAddress;
        }
        if (context.userAgent) {
            this.userAgent = context.userAgent;
        }
        if (typeof context.errors === 'number') {
            this.errors = context.errors;
        }
        if (context.status) {
            this.status = context.status;
        }
    };
    /** JSDoc */
    Session.prototype.close = function (status) {
        if (status) {
            this.update({ status: status });
        }
        else if (this.status === SessionStatus.Ok) {
            this.update({ status: SessionStatus.Exited });
        }
        else {
            this.update();
        }
    };
    /** JSDoc */
    Session.prototype.toJSON = function () {
        return dropUndefinedKeys({
            sid: "" + this.sid,
            init: true,
            started: new Date(this.started).toISOString(),
            timestamp: new Date(this.timestamp).toISOString(),
            status: this.status,
            errors: this.errors,
            did: typeof this.did === 'number' || typeof this.did === 'string' ? "" + this.did : undefined,
            duration: this.duration,
            attrs: dropUndefinedKeys({
                release: this.release,
                environment: this.environment,
                ip_address: this.ipAddress,
                user_agent: this.userAgent,
            }),
        });
    };
    return Session;
}());
export { Session };
//# sourceMappingURL=session.js.map{"version":3,"file":"session.js","sourceRoot":"","sources":["../src/session.ts"],"names":[],"mappings":"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","sourcesContent":["import { Session as SessionInterface, SessionContext, SessionStatus } from '@sentry/types';\nimport { dropUndefinedKeys, uuid4 } from '@sentry/utils';\n\n/**\n * @inheritdoc\n */\nexport class Session implements SessionInterface {\n  public userAgent?: string;\n  public errors: number = 0;\n  public release?: string;\n  public sid: string = uuid4();\n  public did?: string;\n  public timestamp: number = Date.now();\n  public started: number = Date.now();\n  public duration: number = 0;\n  public status: SessionStatus = SessionStatus.Ok;\n  public environment?: string;\n  public ipAddress?: string;\n\n  constructor(context?: Omit<SessionContext, 'started' | 'status'>) {\n    if (context) {\n      this.update(context);\n    }\n  }\n\n  /** JSDoc */\n  // eslint-disable-next-line complexity\n  update(context: SessionContext = {}): void {\n    if (context.user) {\n      if (context.user.ip_address) {\n        this.ipAddress = context.user.ip_address;\n      }\n\n      if (!context.did) {\n        this.did = context.user.id || context.user.email || context.user.username;\n      }\n    }\n\n    this.timestamp = context.timestamp || Date.now();\n\n    if (context.sid) {\n      // Good enough uuid validation. — Kamil\n      this.sid = context.sid.length === 32 ? context.sid : uuid4();\n    }\n    if (context.did) {\n      this.did = `${context.did}`;\n    }\n    if (typeof context.started === 'number') {\n      this.started = context.started;\n    }\n    if (typeof context.duration === 'number') {\n      this.duration = context.duration;\n    } else {\n      this.duration = this.timestamp - this.started;\n    }\n    if (context.release) {\n      this.release = context.release;\n    }\n    if (context.environment) {\n      this.environment = context.environment;\n    }\n    if (context.ipAddress) {\n      this.ipAddress = context.ipAddress;\n    }\n    if (context.userAgent) {\n      this.userAgent = context.userAgent;\n    }\n    if (typeof context.errors === 'number') {\n      this.errors = context.errors;\n    }\n    if (context.status) {\n      this.status = context.status;\n    }\n  }\n\n  /** JSDoc */\n  close(status?: Exclude<SessionStatus, SessionStatus.Ok>): void {\n    if (status) {\n      this.update({ status });\n    } else if (this.status === SessionStatus.Ok) {\n      this.update({ status: SessionStatus.Exited });\n    } else {\n      this.update();\n    }\n  }\n\n  /** JSDoc */\n  toJSON(): {\n    init: boolean;\n    sid: string;\n    did?: string;\n    timestamp: string;\n    started: string;\n    duration: number;\n    status: SessionStatus;\n    errors: number;\n    attrs?: {\n      release?: string;\n      environment?: string;\n      user_agent?: string;\n      ip_address?: string;\n    };\n  } {\n    return dropUndefinedKeys({\n      sid: `${this.sid}`,\n      init: true,\n      started: new Date(this.started).toISOString(),\n      timestamp: new Date(this.timestamp).toISOString(),\n      status: this.status,\n      errors: this.errors,\n      did: typeof this.did === 'number' || typeof this.did === 'string' ? `${this.did}` : undefined,\n      duration: this.duration,\n      attrs: dropUndefinedKeys({\n        release: this.release,\n        environment: this.environment,\n        ip_address: this.ipAddress,\n        user_agent: this.userAgent,\n      }),\n    });\n  }\n}\n"]}BSD 3-Clause License

Copyright (c) 2019, Sentry
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
{
  "name": "@sentry/hub",
  "version": "6.0.0",
  "description": "Sentry hub which handles global state managment.",
  "repository": "git://github.com/getsentry/sentry-javascript.git",
  "homepage": "https://github.com/getsentry/sentry-javascript/tree/master/packages/hub",
  "author": "Sentry",
  "license": "BSD-3-Clause",
  "engines": {
    "node": ">=6"
  },
  "main": "dist/index.js",
  "module": "esm/index.js",
  "types": "dist/index.d.ts",
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "@sentry/types": "6.0.0",
    "@sentry/utils": "6.0.0",
    "tslib": "^1.9.3"
  },
  "devDependencies": {
    "@sentry-internal/eslint-config-sdk": "6.0.0",
    "eslint": "7.6.0",
    "jest": "^24.7.1",
    "npm-run-all": "^4.1.2",
    "prettier": "1.19.0",
    "rimraf": "^2.6.3",
    "typescript": "3.7.5"
  },
  "scripts": {
    "build": "run-p build:es5 build:esm",
    "build:es5": "tsc -p tsconfig.build.json",
    "build:esm": "tsc -p tsconfig.esm.json",
    "build:watch": "run-p build:watch:es5 build:watch:esm",
    "build:watch:es5": "tsc -p tsconfig.build.json -w --preserveWatchOutput",
    "build:watch:esm": "tsc -p tsconfig.esm.json -w --preserveWatchOutput",
    "clean": "rimraf dist coverage",
    "link:yarn": "yarn link",
    "lint": "run-s lint:prettier lint:eslint",
    "lint:prettier": "prettier --check \"{src,test}/**/*.ts\"",
    "lint:eslint": "eslint . --cache --cache-location '../../eslintcache/' --format stylish",
    "fix": "run-s fix:eslint fix:prettier",
    "fix:prettier": "prettier --write \"{src,test}/**/*.ts\"",
    "fix:eslint": "eslint . --format stylish --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "pack": "npm pack"
  },
  "volta": {
    "extends": "../../package.json"
  },
  "jest": {
    "collectCoverage": true,
    "transform": {
      "^.+\\.ts$": "ts-jest"
    },
    "moduleFileExtensions": [
      "js",
      "ts"
    ],
    "testEnvironment": "node",
    "testMatch": [
      "**/*.test.ts"
    ],
    "globals": {
      "ts-jest": {
        "tsConfig": "./tsconfig.json",
        "diagnostics": false
      }
    }
  },
  "sideEffects": false
}
<p align="center">
  <a href="https://sentry.io" target="_blank" align="center">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" width="280">
  </a>
  <br />
</p>

# Sentry JavaScript SDK Hub

[![npm version](https://img.shields.io/npm/v/@sentry/hub.svg)](https://www.npmjs.com/package/@sentry/hub)
[![npm dm](https://img.shields.io/npm/dm/@sentry/hub.svg)](https://www.npmjs.com/package/@sentry/hub)
[![npm dt](https://img.shields.io/npm/dt/@sentry/hub.svg)](https://www.npmjs.com/package/@sentry/hub)
[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getsentry.github.io/sentry-javascript/)

## Links

- [Official SDK Docs](https://docs.sentry.io/quickstart/)
- [TypeDoc](http://getsentry.github.io/sentry-javascript/)

## General

This package provides the `Hub` and `Scope` for all JavaScript related SDKs.
import { Scope } from '@sentry/hub';
import { Breadcrumb, CaptureContext, CustomSamplingContext, Event, Extra, Extras, Primitive, Severity, Transaction, TransactionContext, User } from '@sentry/types';
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @returns The generated eventId.
 */
export declare function captureException(exception: any, captureContext?: CaptureContext): string;
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param level Define the level of the message.
 * @returns The generated eventId.
 */
export declare function captureMessage(message: string, captureContext?: CaptureContext | Severity): string;
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */
export declare function captureEvent(event: Event): string;
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
export declare function configureScope(callback: (scope: Scope) => void): void;
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */
export declare function addBreadcrumb(breadcrumb: Breadcrumb): void;
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */
export declare function setContext(name: string, context: {
    [key: string]: any;
} | null): void;
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */
export declare function setExtras(extras: Extras): void;
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */
export declare function setTags(tags: {
    [key: string]: Primitive;
}): void;
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */
export declare function setExtra(key: string, extra: Extra): void;
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */
export declare function setTag(key: string, value: Primitive): void;
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */
export declare function setUser(user: User | null): void;
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
export declare function withScope(callback: (scope: Scope) => void): void;
/**
 * Calls a function on the latest client. Use this with caution, it's meant as
 * in "internal" helper so we don't need to expose every possible function in
 * the shim. It is not guaranteed that the client actually implements the
 * function.
 *
 * @param method The method to call on the client/client.
 * @param args Arguments to pass to the client/fontend.
 * @hidden
 */
export declare function _callOnClient(method: string, ...args: any[]): void;
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */
export declare function startTransaction(context: TransactionContext, customSamplingContext?: CustomSamplingContext): Transaction;
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AAAA,OAAO,EAAsB,KAAK,EAAE,MAAM,aAAa,CAAC;AACxD,OAAO,EACL,UAAU,EACV,cAAc,EACd,qBAAqB,EACrB,KAAK,EACL,KAAK,EACL,MAAM,EACN,SAAS,EACT,QAAQ,EACR,WAAW,EACX,kBAAkB,EAClB,IAAI,EACL,MAAM,eAAe,CAAC;AAiBvB;;;;;GAKG;AAEH,wBAAgB,gBAAgB,CAAC,SAAS,EAAE,GAAG,EAAE,cAAc,CAAC,EAAE,cAAc,GAAG,MAAM,CAYxF;AAED;;;;;;GAMG;AACH,wBAAgB,cAAc,CAAC,OAAO,EAAE,MAAM,EAAE,cAAc,CAAC,EAAE,cAAc,GAAG,QAAQ,GAAG,MAAM,CAkBlG;AAED;;;;;GAKG;AACH,wBAAgB,YAAY,CAAC,KAAK,EAAE,KAAK,GAAG,MAAM,CAEjD;AAED;;;GAGG;AACH,wBAAgB,cAAc,CAAC,QAAQ,EAAE,CAAC,KAAK,EAAE,KAAK,KAAK,IAAI,GAAG,IAAI,CAErE;AAED;;;;;;;GAOG;AACH,wBAAgB,aAAa,CAAC,UAAU,EAAE,UAAU,GAAG,IAAI,CAE1D;AAED;;;;GAIG;AAEH,wBAAgB,UAAU,CAAC,IAAI,EAAE,MAAM,EAAE,OAAO,EAAE;IAAE,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAA;CAAE,GAAG,IAAI,GAAG,IAAI,CAErF;AAED;;;GAGG;AACH,wBAAgB,SAAS,CAAC,MAAM,EAAE,MAAM,GAAG,IAAI,CAE9C;AAED;;;GAGG;AACH,wBAAgB,OAAO,CAAC,IAAI,EAAE;IAAE,CAAC,GAAG,EAAE,MAAM,GAAG,SAAS,CAAA;CAAE,GAAG,IAAI,CAEhE;AAED;;;;GAIG;AACH,wBAAgB,QAAQ,CAAC,GAAG,EAAE,MAAM,EAAE,KAAK,EAAE,KAAK,GAAG,IAAI,CAExD;AAED;;;;;;;GAOG;AACH,wBAAgB,MAAM,CAAC,GAAG,EAAE,MAAM,EAAE,KAAK,EAAE,SAAS,GAAG,IAAI,CAE1D;AAED;;;;GAIG;AACH,wBAAgB,OAAO,CAAC,IAAI,EAAE,IAAI,GAAG,IAAI,GAAG,IAAI,CAE/C;AAED;;;;;;;;;;;;GAYG;AACH,wBAAgB,SAAS,CAAC,QAAQ,EAAE,CAAC,KAAK,EAAE,KAAK,KAAK,IAAI,GAAG,IAAI,CAEhE;AAED;;;;;;;;;GASG;AAEH,wBAAgB,aAAa,CAAC,MAAM,EAAE,MAAM,EAAE,GAAG,IAAI,EAAE,GAAG,EAAE,GAAG,IAAI,CAElE;AAED;;;;;;;;;;;;;;;;GAgBG;AACH,wBAAgB,gBAAgB,CAC9B,OAAO,EAAE,kBAAkB,EAC3B,qBAAqB,CAAC,EAAE,qBAAqB,GAC5C,WAAW,CAEb"}Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
/**
 * This calls a function on the current hub.
 * @param method function to call on hub.
 * @param args to pass to function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callOnHub(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var hub = hub_1.getCurrentHub();
    if (hub && hub[method]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return hub[method].apply(hub, tslib_1.__spread(args));
    }
    throw new Error("No hub defined or " + method + " was not found on the hub, please open a bug report.");
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @returns The generated eventId.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function captureException(exception, captureContext) {
    var syntheticException;
    try {
        throw new Error('Sentry syntheticException');
    }
    catch (exception) {
        syntheticException = exception;
    }
    return callOnHub('captureException', exception, {
        captureContext: captureContext,
        originalException: exception,
        syntheticException: syntheticException,
    });
}
exports.captureException = captureException;
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param level Define the level of the message.
 * @returns The generated eventId.
 */
function captureMessage(message, captureContext) {
    var syntheticException;
    try {
        throw new Error(message);
    }
    catch (exception) {
        syntheticException = exception;
    }
    // This is necessary to provide explicit scopes upgrade, without changing the original
    // arity of the `captureMessage(message, level)` method.
    var level = typeof captureContext === 'string' ? captureContext : undefined;
    var context = typeof captureContext !== 'string' ? { captureContext: captureContext } : undefined;
    return callOnHub('captureMessage', message, level, tslib_1.__assign({ originalException: message, syntheticException: syntheticException }, context));
}
exports.captureMessage = captureMessage;
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */
function captureEvent(event) {
    return callOnHub('captureEvent', event);
}
exports.captureEvent = captureEvent;
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
function configureScope(callback) {
    callOnHub('configureScope', callback);
}
exports.configureScope = configureScope;
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */
function addBreadcrumb(breadcrumb) {
    callOnHub('addBreadcrumb', breadcrumb);
}
exports.addBreadcrumb = addBreadcrumb;
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setContext(name, context) {
    callOnHub('setContext', name, context);
}
exports.setContext = setContext;
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */
function setExtras(extras) {
    callOnHub('setExtras', extras);
}
exports.setExtras = setExtras;
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */
function setTags(tags) {
    callOnHub('setTags', tags);
}
exports.setTags = setTags;
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */
function setExtra(key, extra) {
    callOnHub('setExtra', key, extra);
}
exports.setExtra = setExtra;
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */
function setTag(key, value) {
    callOnHub('setTag', key, value);
}
exports.setTag = setTag;
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */
function setUser(user) {
    callOnHub('setUser', user);
}
exports.setUser = setUser;
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
function withScope(callback) {
    callOnHub('withScope', callback);
}
exports.withScope = withScope;
/**
 * Calls a function on the latest client. Use this with caution, it's meant as
 * in "internal" helper so we don't need to expose every possible function in
 * the shim. It is not guaranteed that the client actually implements the
 * function.
 *
 * @param method The method to call on the client/client.
 * @param args Arguments to pass to the client/fontend.
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _callOnClient(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    callOnHub.apply(void 0, tslib_1.__spread(['_invokeClient', method], args));
}
exports._callOnClient = _callOnClient;
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */
function startTransaction(context, customSamplingContext) {
    return callOnHub('startTransaction', tslib_1.__assign({}, context), customSamplingContext);
}
exports.startTransaction = startTransaction;
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":";;AAAA,mCAAwD;AAexD;;;;GAIG;AACH,8DAA8D;AAC9D,SAAS,SAAS,CAAI,MAAc;IAAE,cAAc;SAAd,UAAc,EAAd,qBAAc,EAAd,IAAc;QAAd,6BAAc;;IAClD,IAAM,GAAG,GAAG,mBAAa,EAAE,CAAC;IAC5B,IAAI,GAAG,IAAI,GAAG,CAAC,MAAmB,CAAC,EAAE;QACnC,8DAA8D;QAC9D,OAAQ,GAAG,CAAC,MAAmB,CAAC,OAAxB,GAAG,mBAAiC,IAAI,GAAE;KACnD;IACD,MAAM,IAAI,KAAK,CAAC,uBAAqB,MAAM,yDAAsD,CAAC,CAAC;AACrG,CAAC;AAED;;;;;GAKG;AACH,iHAAiH;AACjH,SAAgB,gBAAgB,CAAC,SAAc,EAAE,cAA+B;IAC9E,IAAI,kBAAyB,CAAC;IAC9B,IAAI;QACF,MAAM,IAAI,KAAK,CAAC,2BAA2B,CAAC,CAAC;KAC9C;IAAC,OAAO,SAAS,EAAE;QAClB,kBAAkB,GAAG,SAAkB,CAAC;KACzC;IACD,OAAO,SAAS,CAAC,kBAAkB,EAAE,SAAS,EAAE;QAC9C,cAAc,gBAAA;QACd,iBAAiB,EAAE,SAAS;QAC5B,kBAAkB,oBAAA;KACnB,CAAC,CAAC;AACL,CAAC;AAZD,4CAYC;AAED;;;;;;GAMG;AACH,SAAgB,cAAc,CAAC,OAAe,EAAE,cAA0C;IACxF,IAAI,kBAAyB,CAAC;IAC9B,IAAI;QACF,MAAM,IAAI,KAAK,CAAC,OAAO,CAAC,CAAC;KAC1B;IAAC,OAAO,SAAS,EAAE;QAClB,kBAAkB,GAAG,SAAkB,CAAC;KACzC;IAED,sFAAsF;IACtF,wDAAwD;IACxD,IAAM,KAAK,GAAG,OAAO,cAAc,KAAK,QAAQ,CAAC,CAAC,CAAC,cAAc,CAAC,CAAC,CAAC,SAAS,CAAC;IAC9E,IAAM,OAAO,GAAG,OAAO,cAAc,KAAK,QAAQ,CAAC,CAAC,CAAC,EAAE,cAAc,gBAAA,EAAE,CAAC,CAAC,CAAC,SAAS,CAAC;IAEpF,OAAO,SAAS,CAAC,gBAAgB,EAAE,OAAO,EAAE,KAAK,qBAC/C,iBAAiB,EAAE,OAAO,EAC1B,kBAAkB,oBAAA,IACf,OAAO,EACV,CAAC;AACL,CAAC;AAlBD,wCAkBC;AAED;;;;;GAKG;AACH,SAAgB,YAAY,CAAC,KAAY;IACvC,OAAO,SAAS,CAAC,cAAc,EAAE,KAAK,CAAC,CAAC;AAC1C,CAAC;AAFD,oCAEC;AAED;;;GAGG;AACH,SAAgB,cAAc,CAAC,QAAgC;IAC7D,SAAS,CAAO,gBAAgB,EAAE,QAAQ,CAAC,CAAC;AAC9C,CAAC;AAFD,wCAEC;AAED;;;;;;;GAOG;AACH,SAAgB,aAAa,CAAC,UAAsB;IAClD,SAAS,CAAO,eAAe,EAAE,UAAU,CAAC,CAAC;AAC/C,CAAC;AAFD,sCAEC;AAED;;;;GAIG;AACH,8DAA8D;AAC9D,SAAgB,UAAU,CAAC,IAAY,EAAE,OAAsC;IAC7E,SAAS,CAAO,YAAY,EAAE,IAAI,EAAE,OAAO,CAAC,CAAC;AAC/C,CAAC;AAFD,gCAEC;AAED;;;GAGG;AACH,SAAgB,SAAS,CAAC,MAAc;IACtC,SAAS,CAAO,WAAW,EAAE,MAAM,CAAC,CAAC;AACvC,CAAC;AAFD,8BAEC;AAED;;;GAGG;AACH,SAAgB,OAAO,CAAC,IAAkC;IACxD,SAAS,CAAO,SAAS,EAAE,IAAI,CAAC,CAAC;AACnC,CAAC;AAFD,0BAEC;AAED;;;;GAIG;AACH,SAAgB,QAAQ,CAAC,GAAW,EAAE,KAAY;IAChD,SAAS,CAAO,UAAU,EAAE,GAAG,EAAE,KAAK,CAAC,CAAC;AAC1C,CAAC;AAFD,4BAEC;AAED;;;;;;;GAOG;AACH,SAAgB,MAAM,CAAC,GAAW,EAAE,KAAgB;IAClD,SAAS,CAAO,QAAQ,EAAE,GAAG,EAAE,KAAK,CAAC,CAAC;AACxC,CAAC;AAFD,wBAEC;AAED;;;;GAIG;AACH,SAAgB,OAAO,CAAC,IAAiB;IACvC,SAAS,CAAO,SAAS,EAAE,IAAI,CAAC,CAAC;AACnC,CAAC;AAFD,0BAEC;AAED;;;;;;;;;;;;GAYG;AACH,SAAgB,SAAS,CAAC,QAAgC;IACxD,SAAS,CAAO,WAAW,EAAE,QAAQ,CAAC,CAAC;AACzC,CAAC;AAFD,8BAEC;AAED;;;;;;;;;GASG;AACH,8DAA8D;AAC9D,SAAgB,aAAa,CAAC,MAAc;IAAE,cAAc;SAAd,UAAc,EAAd,qBAAc,EAAd,IAAc;QAAd,6BAAc;;IAC1D,SAAS,iCAAO,eAAe,EAAE,MAAM,GAAK,IAAI,GAAE;AACpD,CAAC;AAFD,sCAEC;AAED;;;;;;;;;;;;;;;;GAgBG;AACH,SAAgB,gBAAgB,CAC9B,OAA2B,EAC3B,qBAA6C;IAE7C,OAAO,SAAS,CAAC,kBAAkB,uBAAO,OAAO,GAAI,qBAAqB,CAAC,CAAC;AAC9E,CAAC;AALD,4CAKC","sourcesContent":["import { getCurrentHub, Hub, Scope } from '@sentry/hub';\nimport {\n  Breadcrumb,\n  CaptureContext,\n  CustomSamplingContext,\n  Event,\n  Extra,\n  Extras,\n  Primitive,\n  Severity,\n  Transaction,\n  TransactionContext,\n  User,\n} from '@sentry/types';\n\n/**\n * This calls a function on the current hub.\n * @param method function to call on hub.\n * @param args to pass to function.\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction callOnHub<T>(method: string, ...args: any[]): T {\n  const hub = getCurrentHub();\n  if (hub && hub[method as keyof Hub]) {\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    return (hub[method as keyof Hub] as any)(...args);\n  }\n  throw new Error(`No hub defined or ${method} was not found on the hub, please open a bug report.`);\n}\n\n/**\n * Captures an exception event and sends it to Sentry.\n *\n * @param exception An exception-like object.\n * @returns The generated eventId.\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\nexport function captureException(exception: any, captureContext?: CaptureContext): string {\n  let syntheticException: Error;\n  try {\n    throw new Error('Sentry syntheticException');\n  } catch (exception) {\n    syntheticException = exception as Error;\n  }\n  return callOnHub('captureException', exception, {\n    captureContext,\n    originalException: exception,\n    syntheticException,\n  });\n}\n\n/**\n * Captures a message event and sends it to Sentry.\n *\n * @param message The message to send to Sentry.\n * @param level Define the level of the message.\n * @returns The generated eventId.\n */\nexport function captureMessage(message: string, captureContext?: CaptureContext | Severity): string {\n  let syntheticException: Error;\n  try {\n    throw new Error(message);\n  } catch (exception) {\n    syntheticException = exception as Error;\n  }\n\n  // This is necessary to provide explicit scopes upgrade, without changing the original\n  // arity of the `captureMessage(message, level)` method.\n  const level = typeof captureContext === 'string' ? captureContext : undefined;\n  const context = typeof captureContext !== 'string' ? { captureContext } : undefined;\n\n  return callOnHub('captureMessage', message, level, {\n    originalException: message,\n    syntheticException,\n    ...context,\n  });\n}\n\n/**\n * Captures a manually created event and sends it to Sentry.\n *\n * @param event The event to send to Sentry.\n * @returns The generated eventId.\n */\nexport function captureEvent(event: Event): string {\n  return callOnHub('captureEvent', event);\n}\n\n/**\n * Callback to set context information onto the scope.\n * @param callback Callback function that receives Scope.\n */\nexport function configureScope(callback: (scope: Scope) => void): void {\n  callOnHub<void>('configureScope', callback);\n}\n\n/**\n * Records a new breadcrumb which will be attached to future events.\n *\n * Breadcrumbs will be added to subsequent events to provide more context on\n * user's actions prior to an error or crash.\n *\n * @param breadcrumb The breadcrumb to record.\n */\nexport function addBreadcrumb(breadcrumb: Breadcrumb): void {\n  callOnHub<void>('addBreadcrumb', breadcrumb);\n}\n\n/**\n * Sets context data with the given name.\n * @param name of the context\n * @param context Any kind of data. This data will be normalized.\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport function setContext(name: string, context: { [key: string]: any } | null): void {\n  callOnHub<void>('setContext', name, context);\n}\n\n/**\n * Set an object that will be merged sent as extra data with the event.\n * @param extras Extras object to merge into current context.\n */\nexport function setExtras(extras: Extras): void {\n  callOnHub<void>('setExtras', extras);\n}\n\n/**\n * Set an object that will be merged sent as tags data with the event.\n * @param tags Tags context object to merge into current context.\n */\nexport function setTags(tags: { [key: string]: Primitive }): void {\n  callOnHub<void>('setTags', tags);\n}\n\n/**\n * Set key:value that will be sent as extra data with the event.\n * @param key String of extra\n * @param extra Any kind of data. This data will be normalized.\n */\nexport function setExtra(key: string, extra: Extra): void {\n  callOnHub<void>('setExtra', key, extra);\n}\n\n/**\n * Set key:value that will be sent as tags data with the event.\n *\n * Can also be used to unset a tag, by passing `undefined`.\n *\n * @param key String key of tag\n * @param value Value of tag\n */\nexport function setTag(key: string, value: Primitive): void {\n  callOnHub<void>('setTag', key, value);\n}\n\n/**\n * Updates user context information for future events.\n *\n * @param user User context object to be set in the current context. Pass `null` to unset the user.\n */\nexport function setUser(user: User | null): void {\n  callOnHub<void>('setUser', user);\n}\n\n/**\n * Creates a new scope with and executes the given operation within.\n * The scope is automatically removed once the operation\n * finishes or throws.\n *\n * This is essentially a convenience function for:\n *\n *     pushScope();\n *     callback();\n *     popScope();\n *\n * @param callback that will be enclosed into push/popScope.\n */\nexport function withScope(callback: (scope: Scope) => void): void {\n  callOnHub<void>('withScope', callback);\n}\n\n/**\n * Calls a function on the latest client. Use this with caution, it's meant as\n * in \"internal\" helper so we don't need to expose every possible function in\n * the shim. It is not guaranteed that the client actually implements the\n * function.\n *\n * @param method The method to call on the client/client.\n * @param args Arguments to pass to the client/fontend.\n * @hidden\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport function _callOnClient(method: string, ...args: any[]): void {\n  callOnHub<void>('_invokeClient', method, ...args);\n}\n\n/**\n * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.\n *\n * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a\n * new child span within the transaction or any span, call the respective `.startChild()` method.\n *\n * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.\n *\n * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its\n * finished child spans will be sent to Sentry.\n *\n * @param context Properties of the new `Transaction`.\n * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent\n * default values). See {@link Options.tracesSampler}.\n *\n * @returns The transaction which was just started\n */\nexport function startTransaction(\n  context: TransactionContext,\n  customSamplingContext?: CustomSamplingContext,\n): Transaction {\n  return callOnHub('startTransaction', { ...context }, customSamplingContext);\n}\n"]}import { Scope } from '@sentry/hub';
import { Breadcrumb, CaptureContext, CustomSamplingContext, Event, Extra, Extras, Primitive, Severity, Transaction, TransactionContext, User } from '@sentry/types';
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @returns The generated eventId.
 */
export declare function captureException(exception: any, captureContext?: CaptureContext): string;
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param level Define the level of the message.
 * @returns The generated eventId.
 */
export declare function captureMessage(message: string, captureContext?: CaptureContext | Severity): string;
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */
export declare function captureEvent(event: Event): string;
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
export declare function configureScope(callback: (scope: Scope) => void): void;
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */
export declare function addBreadcrumb(breadcrumb: Breadcrumb): void;
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */
export declare function setContext(name: string, context: {
    [key: string]: any;
} | null): void;
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */
export declare function setExtras(extras: Extras): void;
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */
export declare function setTags(tags: {
    [key: string]: Primitive;
}): void;
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */
export declare function setExtra(key: string, extra: Extra): void;
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */
export declare function setTag(key: string, value: Primitive): void;
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */
export declare function setUser(user: User | null): void;
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
export declare function withScope(callback: (scope: Scope) => void): void;
/**
 * Calls a function on the latest client. Use this with caution, it's meant as
 * in "internal" helper so we don't need to expose every possible function in
 * the shim. It is not guaranteed that the client actually implements the
 * function.
 *
 * @param method The method to call on the client/client.
 * @param args Arguments to pass to the client/fontend.
 * @hidden
 */
export declare function _callOnClient(method: string, ...args: any[]): void;
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */
export declare function startTransaction(context: TransactionContext, customSamplingContext?: CustomSamplingContext): Transaction;
//# sourceMappingURL=index.d.ts.map{"version":3,"file":"index.d.ts","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"AAAA,OAAO,EAAsB,KAAK,EAAE,MAAM,aAAa,CAAC;AACxD,OAAO,EACL,UAAU,EACV,cAAc,EACd,qBAAqB,EACrB,KAAK,EACL,KAAK,EACL,MAAM,EACN,SAAS,EACT,QAAQ,EACR,WAAW,EACX,kBAAkB,EAClB,IAAI,EACL,MAAM,eAAe,CAAC;AAiBvB;;;;;GAKG;AAEH,wBAAgB,gBAAgB,CAAC,SAAS,EAAE,GAAG,EAAE,cAAc,CAAC,EAAE,cAAc,GAAG,MAAM,CAYxF;AAED;;;;;;GAMG;AACH,wBAAgB,cAAc,CAAC,OAAO,EAAE,MAAM,EAAE,cAAc,CAAC,EAAE,cAAc,GAAG,QAAQ,GAAG,MAAM,CAkBlG;AAED;;;;;GAKG;AACH,wBAAgB,YAAY,CAAC,KAAK,EAAE,KAAK,GAAG,MAAM,CAEjD;AAED;;;GAGG;AACH,wBAAgB,cAAc,CAAC,QAAQ,EAAE,CAAC,KAAK,EAAE,KAAK,KAAK,IAAI,GAAG,IAAI,CAErE;AAED;;;;;;;GAOG;AACH,wBAAgB,aAAa,CAAC,UAAU,EAAE,UAAU,GAAG,IAAI,CAE1D;AAED;;;;GAIG;AAEH,wBAAgB,UAAU,CAAC,IAAI,EAAE,MAAM,EAAE,OAAO,EAAE;IAAE,CAAC,GAAG,EAAE,MAAM,GAAG,GAAG,CAAA;CAAE,GAAG,IAAI,GAAG,IAAI,CAErF;AAED;;;GAGG;AACH,wBAAgB,SAAS,CAAC,MAAM,EAAE,MAAM,GAAG,IAAI,CAE9C;AAED;;;GAGG;AACH,wBAAgB,OAAO,CAAC,IAAI,EAAE;IAAE,CAAC,GAAG,EAAE,MAAM,GAAG,SAAS,CAAA;CAAE,GAAG,IAAI,CAEhE;AAED;;;;GAIG;AACH,wBAAgB,QAAQ,CAAC,GAAG,EAAE,MAAM,EAAE,KAAK,EAAE,KAAK,GAAG,IAAI,CAExD;AAED;;;;;;;GAOG;AACH,wBAAgB,MAAM,CAAC,GAAG,EAAE,MAAM,EAAE,KAAK,EAAE,SAAS,GAAG,IAAI,CAE1D;AAED;;;;GAIG;AACH,wBAAgB,OAAO,CAAC,IAAI,EAAE,IAAI,GAAG,IAAI,GAAG,IAAI,CAE/C;AAED;;;;;;;;;;;;GAYG;AACH,wBAAgB,SAAS,CAAC,QAAQ,EAAE,CAAC,KAAK,EAAE,KAAK,KAAK,IAAI,GAAG,IAAI,CAEhE;AAED;;;;;;;;;GASG;AAEH,wBAAgB,aAAa,CAAC,MAAM,EAAE,MAAM,EAAE,GAAG,IAAI,EAAE,GAAG,EAAE,GAAG,IAAI,CAElE;AAED;;;;;;;;;;;;;;;;GAgBG;AACH,wBAAgB,gBAAgB,CAC9B,OAAO,EAAE,kBAAkB,EAC3B,qBAAqB,CAAC,EAAE,qBAAqB,GAC5C,WAAW,CAEb"}import { __assign, __read, __spread } from "tslib";
import { getCurrentHub } from '@sentry/hub';
/**
 * This calls a function on the current hub.
 * @param method function to call on hub.
 * @param args to pass to function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callOnHub(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var hub = getCurrentHub();
    if (hub && hub[method]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return hub[method].apply(hub, __spread(args));
    }
    throw new Error("No hub defined or " + method + " was not found on the hub, please open a bug report.");
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @returns The generated eventId.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function captureException(exception, captureContext) {
    var syntheticException;
    try {
        throw new Error('Sentry syntheticException');
    }
    catch (exception) {
        syntheticException = exception;
    }
    return callOnHub('captureException', exception, {
        captureContext: captureContext,
        originalException: exception,
        syntheticException: syntheticException,
    });
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param level Define the level of the message.
 * @returns The generated eventId.
 */
export function captureMessage(message, captureContext) {
    var syntheticException;
    try {
        throw new Error(message);
    }
    catch (exception) {
        syntheticException = exception;
    }
    // This is necessary to provide explicit scopes upgrade, without changing the original
    // arity of the `captureMessage(message, level)` method.
    var level = typeof captureContext === 'string' ? captureContext : undefined;
    var context = typeof captureContext !== 'string' ? { captureContext: captureContext } : undefined;
    return callOnHub('captureMessage', message, level, __assign({ originalException: message, syntheticException: syntheticException }, context));
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */
export function captureEvent(event) {
    return callOnHub('captureEvent', event);
}
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
export function configureScope(callback) {
    callOnHub('configureScope', callback);
}
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */
export function addBreadcrumb(breadcrumb) {
    callOnHub('addBreadcrumb', breadcrumb);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setContext(name, context) {
    callOnHub('setContext', name, context);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */
export function setExtras(extras) {
    callOnHub('setExtras', extras);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */
export function setTags(tags) {
    callOnHub('setTags', tags);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */
export function setExtra(key, extra) {
    callOnHub('setExtra', key, extra);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */
export function setTag(key, value) {
    callOnHub('setTag', key, value);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */
export function setUser(user) {
    callOnHub('setUser', user);
}
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
export function withScope(callback) {
    callOnHub('withScope', callback);
}
/**
 * Calls a function on the latest client. Use this with caution, it's meant as
 * in "internal" helper so we don't need to expose every possible function in
 * the shim. It is not guaranteed that the client actually implements the
 * function.
 *
 * @param method The method to call on the client/client.
 * @param args Arguments to pass to the client/fontend.
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _callOnClient(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    callOnHub.apply(void 0, __spread(['_invokeClient', method], args));
}
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */
export function startTransaction(context, customSamplingContext) {
    return callOnHub('startTransaction', __assign({}, context), customSamplingContext);
}
//# sourceMappingURL=index.js.map{"version":3,"file":"index.js","sourceRoot":"","sources":["../src/index.ts"],"names":[],"mappings":"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","sourcesContent":["import { getCurrentHub, Hub, Scope } from '@sentry/hub';\nimport {\n  Breadcrumb,\n  CaptureContext,\n  CustomSamplingContext,\n  Event,\n  Extra,\n  Extras,\n  Primitive,\n  Severity,\n  Transaction,\n  TransactionContext,\n  User,\n} from '@sentry/types';\n\n/**\n * This calls a function on the current hub.\n * @param method function to call on hub.\n * @param args to pass to function.\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction callOnHub<T>(method: string, ...args: any[]): T {\n  const hub = getCurrentHub();\n  if (hub && hub[method as keyof Hub]) {\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    return (hub[method as keyof Hub] as any)(...args);\n  }\n  throw new Error(`No hub defined or ${method} was not found on the hub, please open a bug report.`);\n}\n\n/**\n * Captures an exception event and sends it to Sentry.\n *\n * @param exception An exception-like object.\n * @returns The generated eventId.\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\nexport function captureException(exception: any, captureContext?: CaptureContext): string {\n  let syntheticException: Error;\n  try {\n    throw new Error('Sentry syntheticException');\n  } catch (exception) {\n    syntheticException = exception as Error;\n  }\n  return callOnHub('captureException', exception, {\n    captureContext,\n    originalException: exception,\n    syntheticException,\n  });\n}\n\n/**\n * Captures a message event and sends it to Sentry.\n *\n * @param message The message to send to Sentry.\n * @param level Define the level of the message.\n * @returns The generated eventId.\n */\nexport function captureMessage(message: string, captureContext?: CaptureContext | Severity): string {\n  let syntheticException: Error;\n  try {\n    throw new Error(message);\n  } catch (exception) {\n    syntheticException = exception as Error;\n  }\n\n  // This is necessary to provide explicit scopes upgrade, without changing the original\n  // arity of the `captureMessage(message, level)` method.\n  const level = typeof captureContext === 'string' ? captureContext : undefined;\n  const context = typeof captureContext !== 'string' ? { captureContext } : undefined;\n\n  return callOnHub('captureMessage', message, level, {\n    originalException: message,\n    syntheticException,\n    ...context,\n  });\n}\n\n/**\n * Captures a manually created event and sends it to Sentry.\n *\n * @param event The event to send to Sentry.\n * @returns The generated eventId.\n */\nexport function captureEvent(event: Event): string {\n  return callOnHub('captureEvent', event);\n}\n\n/**\n * Callback to set context information onto the scope.\n * @param callback Callback function that receives Scope.\n */\nexport function configureScope(callback: (scope: Scope) => void): void {\n  callOnHub<void>('configureScope', callback);\n}\n\n/**\n * Records a new breadcrumb which will be attached to future events.\n *\n * Breadcrumbs will be added to subsequent events to provide more context on\n * user's actions prior to an error or crash.\n *\n * @param breadcrumb The breadcrumb to record.\n */\nexport function addBreadcrumb(breadcrumb: Breadcrumb): void {\n  callOnHub<void>('addBreadcrumb', breadcrumb);\n}\n\n/**\n * Sets context data with the given name.\n * @param name of the context\n * @param context Any kind of data. This data will be normalized.\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport function setContext(name: string, context: { [key: string]: any } | null): void {\n  callOnHub<void>('setContext', name, context);\n}\n\n/**\n * Set an object that will be merged sent as extra data with the event.\n * @param extras Extras object to merge into current context.\n */\nexport function setExtras(extras: Extras): void {\n  callOnHub<void>('setExtras', extras);\n}\n\n/**\n * Set an object that will be merged sent as tags data with the event.\n * @param tags Tags context object to merge into current context.\n */\nexport function setTags(tags: { [key: string]: Primitive }): void {\n  callOnHub<void>('setTags', tags);\n}\n\n/**\n * Set key:value that will be sent as extra data with the event.\n * @param key String of extra\n * @param extra Any kind of data. This data will be normalized.\n */\nexport function setExtra(key: string, extra: Extra): void {\n  callOnHub<void>('setExtra', key, extra);\n}\n\n/**\n * Set key:value that will be sent as tags data with the event.\n *\n * Can also be used to unset a tag, by passing `undefined`.\n *\n * @param key String key of tag\n * @param value Value of tag\n */\nexport function setTag(key: string, value: Primitive): void {\n  callOnHub<void>('setTag', key, value);\n}\n\n/**\n * Updates user context information for future events.\n *\n * @param user User context object to be set in the current context. Pass `null` to unset the user.\n */\nexport function setUser(user: User | null): void {\n  callOnHub<void>('setUser', user);\n}\n\n/**\n * Creates a new scope with and executes the given operation within.\n * The scope is automatically removed once the operation\n * finishes or throws.\n *\n * This is essentially a convenience function for:\n *\n *     pushScope();\n *     callback();\n *     popScope();\n *\n * @param callback that will be enclosed into push/popScope.\n */\nexport function withScope(callback: (scope: Scope) => void): void {\n  callOnHub<void>('withScope', callback);\n}\n\n/**\n * Calls a function on the latest client. Use this with caution, it's meant as\n * in \"internal\" helper so we don't need to expose every possible function in\n * the shim. It is not guaranteed that the client actually implements the\n * function.\n *\n * @param method The method to call on the client/client.\n * @param args Arguments to pass to the client/fontend.\n * @hidden\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport function _callOnClient(method: string, ...args: any[]): void {\n  callOnHub<void>('_invokeClient', method, ...args);\n}\n\n/**\n * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.\n *\n * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a\n * new child span within the transaction or any span, call the respective `.startChild()` method.\n *\n * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.\n *\n * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its\n * finished child spans will be sent to Sentry.\n *\n * @param context Properties of the new `Transaction`.\n * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent\n * default values). See {@link Options.tracesSampler}.\n *\n * @returns The transaction which was just started\n */\nexport function startTransaction(\n  context: TransactionContext,\n  customSamplingContext?: CustomSamplingContext,\n): Transaction {\n  return callOnHub('startTransaction', { ...context }, customSamplingContext);\n}\n"]}BSD 3-Clause License
