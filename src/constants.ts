export const WIDTH_BREAKPOINT = 1024

export const MAX_EDITOR_CARD_TITLE_SYMBOLS = 60
export const MAX_EDITOR_CARD_SUBTITLE_SYMBOLS = 1000

export enum ROLES {
  ADMINS,
  MODERATORS,
  EMPLOYEERS,
  CUSTOMERS,
  GUESTS,
}

export const ROLES_NAMES = {
  [ROLES.ADMINS]: 'Администратор',
  [ROLES.MODERATORS]: 'Редактор',
  [ROLES.EMPLOYEERS]: 'Сотрудник',
  [ROLES.CUSTOMERS]: 'Заказчик',
  [ROLES.GUESTS]: 'Гость',
}

export const SELECT_ROLES = [
  { role: 1, name: 'Редактор', maxRole: 1 },
  { role: 2, name: 'Сотрудник', maxRole: 2 },
  { role: 3, name: 'Заказчик', maxRole: 2 },
]
