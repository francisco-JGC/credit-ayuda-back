export interface ICreateRole {
  name: string
  description: string
}

export interface IRoleResponse extends ICreateRole {
  id: number
}
