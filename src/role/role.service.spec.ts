import { Test } from "@nestjs/testing";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { Role } from "./entities/user.entity";

describe('roleService', async ()=>{

    let roleController: RoleController
    let roleService: RoleService
     

    beforeEach(async ()=> {
        const moduleRef = await Test.createTestingModule({
            controllers: [RoleController],
            providers: [RoleService]
        }).compile();

        roleService = moduleRef.get<RoleService>(RoleService);
        roleController = moduleRef.get<RoleController>(RoleController);
    })


    describe("pega todos as roles cadastradas", ()=>{
        it("findAll", async ()=>{
            const roles = await roleService.findAll();
            expect(roles).toBeDefined();
        })
    })



})