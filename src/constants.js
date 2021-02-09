// this file is shared between electron and the react client
const IPC_CHANNELS = {
  OPEN_FOLDER_DIALOG: 'OPEN_FOLDER_DIALOG',
  GET_IMAGE_TAGS: 'GET_IMAGE_TAGS',
  CHECK_IMAGE_EXISTS: 'CHECK_IMAGE_EXISTS',
  ATTACH_SHELL: 'ATTACH_SHELL',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  CHECK_FOR_UPDATE: 'CHECK_FOR_UPDATE',
  INSTALL_UPDATE: 'INSTALL_UPDATE'
};

const ENVASE_NET = 'envase_net';
const ALL_SETTINGS = 'all-settings';
const WIN_DIMENSION = 'WIN_DIMENSION';
const GA_CATEGORIES = {
  APP_LIFE: 'Application Life',
  APP_OPS: 'Application Operations',
  APP_LIFECYCLE: 'Application Lifecycle',
  SHELL_OPS: 'Shell Operations'
};
const GA_ACTIONS = {
  CREATE_APP: 'Create Application',
  DELETE_APP: 'Delete Application',
  VIEW_APP_LOGS: 'View Application Logs',
  SHELL_INTO_APP: 'Shell into Application',
  EXEC_APP: 'Execute Command in Application',
  VIEW_APP_INFO: 'View Application Info',
  START_APP: 'Start Application',
  STOP_APP: 'Stop Application',
  NEW_SHELL_TAB: 'New Shell Tab',
  CUSTOM_ACTION: 'Custom Application Action'
};

module.exports = {
  IPC_CHANNELS,
  ALL_SETTINGS,
  WIN_DIMENSION,
  ENVASE_NET,
  GA_CATEGORIES,
  GA_ACTIONS
};
