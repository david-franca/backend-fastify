import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
    id: Generated<number>
    name: string
    email: string
    isActive: boolean
    role: 'admin' | 'user'
    password: string
    created_at: ColumnType<Date, string | undefined, never>
    updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type UserEntity = Selectable<UserTable>
export type UserReturn = Selectable<Omit<UserTable, 'password'>>
export type UserCreateInput = Insertable<UserTable>
export type UserUpdateInput = Updateable<UserTable>
