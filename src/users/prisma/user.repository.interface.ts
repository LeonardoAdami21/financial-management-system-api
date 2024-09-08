import { Users } from "@prisma/client";

export interface UserRepositoryInterface {
  findAll(): Promise<Users[]>;
}