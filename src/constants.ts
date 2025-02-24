export const WIDTH_BREAKPOINT = 1024

export const MAX_EDITOR_CARD_TITLE_SYMBOLS = 60
export const MAX_EDITOR_CARD_SUBTITLE_SYMBOLS = 1000

export enum ROLES {
  ADMINS,
  MODERATORS,
  CUSTOMERS,
  EMPLOYEERS,
  GUESTS,
}

export const ROLES_NAMES = {
  [ROLES.ADMINS]: 'Администратор',
  [ROLES.MODERATORS]: 'Модератор',
  [ROLES.CUSTOMERS]: 'Заказчик',
  [ROLES.EMPLOYEERS]: 'Сотрудник',
  [ROLES.GUESTS]: 'Гость',
}

export const SELECT_ROLES = [
  { role: 1, name: 'Редактор' },
  { role: 2, name: 'Сотрудник' },
  { role: 3, name: 'Заказчик' },
]
