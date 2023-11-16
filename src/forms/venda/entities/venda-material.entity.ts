import { Material } from "src/material/entities/material.entity";

export class VendaMaterial {
    id:number;
    idVenda:number;
    idMaterial:number;
    quantidadeVendida:number;
    material?:Material;
}