import { Editor } from '@tiptap/core'
import type { Range } from '@tiptap/core'
import type { JwtPayload } from 'jwt-decode'
import type { ROLES } from '~/constants'

export interface ICards {
  id: number
  title: string
  link: string
  isLocked: boolean
  list: ICardLinks[]
}

export interface ICardLinks {
  id: number
  link: string
  name: string
  content: string
}

export type SuggestionItem = {
  name: string
  description: string
  icon: string
  command: (props: { editor: Editor; range: Range }) => void
}

export interface IDecodeUser extends JwtPayload {
  category: string
  email: string
  exp: number
  name: string
  role: ROLES
  uuid: string
}

export type typeOfTreeItem = 'group' | 'chapter' | 'seed' | 'sheet'

export interface IGroupItem {
  id: string
  name: string
  type: typeOfTreeItem
  chapters: IChapterItem[]
}
export interface IChapterItem {
  id: string
  name: string
  type: typeOfTreeItem
  seeds: ISeedItem[]
}

export interface ISeedItem {
  id: string
  name: string
  type: typeOfTreeItem
  sheets: ISheetItem[]
}

export interface ISheetItem {
  id: string
  type: typeOfTreeItem
  name: string
}

export interface IRightsDataGroups {
  group_id: string
  name: string
  users: IRightsDataUsers[]
}

export interface IRightsDataUsers {
  pass: boolean
  user_id: string
  user_name: string
}

export interface IRightsData {
  groups: IRightsDataGroups[]
  guest: boolean
}

export interface IRequest<T> {
  message: string,
  status: string,
  body: T
}
