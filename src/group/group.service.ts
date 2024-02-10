import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from './group.entity'
import { IGroup } from "./group.interface";
import { Integrant } from "src/integrant/integrant.entity";
import { IntegrantService } from "src/integrant/integrant.service";
import { query } from "express";

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        private readonly integrantService: IntegrantService
    ) { }

    async createGroup(_group: IGroup): Promise<Group | undefined> {
        try {
            const group: Group = await this.groupRepository.create({
                id_group: _group.id_group,
                name: _group.name,
                image: _group.image,
                config: null // Revisar este
            });
            return await this.groupRepository.save(group)
            // return { success: true, message: 'Chat creado exitosamente' };
        } catch (error) {
            // return { success: false, message: 'Error interno al crear el chat' };
            console.log(error);
        }
    }

    async findOneGroup(group_id: number): Promise<Group | undefined> {
        try {
            const group: Group = await this.groupRepository.findOne({ where: { id: group_id } })
            if (!group) {
                throw new NotFoundException('Grupo no encontrado');
                return;
            }
            return group;
        } catch (error) {
            console.log("Error interno al buscar el chat");
        }

    }

    async createLoadGroup(_group: any): Promise<void> {
        const queryRunner = this.groupRepository.manager.connection.createQueryRunner();

        try {

            if (await this.existsGroup(_group.name)) {
                console.log("Ya existe el grupo")
                return;
            }

            const participants: string[] = _group.participants;
            const admins: string[] = _group.admins;

            const group: Group = await this.groupRepository.create({
                name: _group.name,
                // config: _group.config,
                image: _group.image,
                // integrants: integrants
            });
            const createdGroup: Group = await this.groupRepository.save(group);

            // await this.integrantService.createIntegrants(
            //     admins, participants, createdGroup.id
            // );

        } catch (error) {
            console.log(error)
        }
    }
    async saveIntegrantsInGroup(group: Group): Promise<void>{
        try {
            await this.groupRepository.save(group)
        } catch (error) {
            console.log(error);
        }

    }

    async existsGroup(groupName: string): Promise<boolean> {
        try {
            const group = await this.groupRepository.findOne({ where: { name: groupName } });
            console.log(group)
            return group ? true : false;
        } catch (error) {
            console.log("no existe el integrante")
        }
    }
}