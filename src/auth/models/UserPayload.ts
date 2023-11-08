export interface UserPayload {
    sub: number,
    email: string,
    name: string,
    roleNames?: string[],
    exp?: number

}