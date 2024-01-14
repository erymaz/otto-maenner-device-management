import { ActionType, CellType, TableConfig } from '../../shared/models';

export const tableConfig: TableConfig = {
  actionItems: [
    {
      type: ActionType.DROPDOWN_CHECKABLE,
      classes: 'me-auto',
      dropdown: {
        label: 'ACTION_BUTTON.BULK_ACTION',
        toggle: 'ACTION_BUTTON.PLEASE_CHOOSE',
        disabled: true,
        actionItems: [
          {
            type: ActionType.SELECT,
            action: 'updateSelectedFirmware',
            value: 'ACTION_BUTTON.UPDATE_FIRMWARE'
          },
          {
            type: ActionType.SELECT,
            action: 'deleteSelected',
            value: 'ACTION_BUTTON.DELETE'
          }
        ]
      }
    },
    {
      type: ActionType.SEARCH,
      action: 'search',
      placeholder: 'ACTION_BUTTON.SEARCH'
    },
    {
      type: ActionType.DROPDOWN,
      dropdown: {
        label: 'ACTION_BUTTON.FILTER',
        toggle: 'ACTION_BUTTON.STATUS',
        filtered: true,
        actionItems: [
          {
            type: ActionType.SELECT,
            action: 'filterOnline',
            value: 'DEVICE.ONLINE'
          },
          {
            type: ActionType.SELECT,
            action: 'filterOffline',
            value: 'DEVICE.OFFLINE'
          }
        ]
      }
    },
    {
      type: ActionType.DROPDOWN,
      dropdown: {
        label: 'ACTION_BUTTON.FILTER',
        toggle: 'ACTION_BUTTON.FIRMWARE_VERSION',
        actionItems: [
          { type: ActionType.SEARCH, action: 'searchFirmware', placeholder: 'ACTION_BUTTON.TYPE_HERE' }
        ]
      }
    }
  ],
  checkable: true,
  cells: [
    {
      type: CellType.TEXT,
      property: 'name',
      title: 'TABLE.EDGE_DEVICE'
    },
    {
      type: CellType.STATUS,
      property: 'online',
      title: 'TABLE.DEVICE_STATUS'
    },
    {
      type: CellType.DATETIME,
      property: 'updatedAt',
      format: 'DD.MM.YYYY',
      title: 'TABLE.DATE_LAST_CHANGED'
    },
    {
      type: CellType.TEXT,
      property: 'firmwareVersion',
      title: 'TABLE.FIRMWARE_VERSION',
      classes: ['width-p-15']
    },
    {
      type: CellType.BUTTONS,
      title: 'TABLE.ACTIONS',
      buttons: [
        {
          action: 'updateFirmware',
          name: 'ACTION_BUTTON.UPDATE_FIRMWARE',
          classes: ['btn-primary', 'me-4']
        },
        {
          icon: 'trash',
          action: 'delete',
          classes: ['btn-outline-icon']
        },
        {
          icon: 'pencil',
          action: 'edit',
          classes: ['btn-outline-icon']
        },
        {
          icon: 'eye',
          action: 'details',
          classes: ['btn-outline-icon']
        }
      ]
    }
  ]
};