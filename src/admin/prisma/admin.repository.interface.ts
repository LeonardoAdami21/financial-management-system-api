import { RegisterAdminDto } from "../dto/register-admin.dto";

export interface AdminRepositoryInterface {
  findAdminByEmail(email: string): Promise<any>;
  findAdminByDocument(document: string): Promise<any>;
  create(dto: RegisterAdminDto): Promise<any>;
  findAll(): Promise<any>;
  userHistory(userId: number, action: string);
  findAdminById(id: number): Promise<any>;
  update(id: number, password: string): Promise<any>;
  delete(id: number): Promise<any>;
}
