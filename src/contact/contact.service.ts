import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contact } from './contact.entity'
import { IContact } from "./contact.interface";
import { Group } from "src/group/group.entity";
import { GroupService } from "src/group/group.service";
import { Phone } from "src/phone/phone.entity";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
    ) { }

    async findAll(): Promise<Contact[]> {
        return await this.contactRepository.find();
    }

    async findOne(contact_id: string): Promise<Contact | undefined> {
        return await this.contactRepository.findOne({ where: { contact_id } })
    }

    async createContact(_contact: IContact): Promise<Contact | undefined> {
        try {
            const contact: IContact = {
                contact_id: _contact.contact_id,
                name: _contact.name,
                type: _contact.type,
                image: null,
                phone: _contact.phone
            }

            return await this.contactRepository.save(contact);
        } catch (error) {
            console.log(error)
        }
    }

    async createContacts(_contacts: IContact[]): Promise<void> {
        try {
            for (const contact of _contacts) {
                await this.createContact(contact)
            }
        } catch (error) {
            console.log("Erro al crear contacto")
        }
    }

    async isGroup?(contact_id: string): Promise<boolean> {
        const contact: Contact = await this.contactRepository.findOne({ where: { contact_id } })
        return contact.type === "group" ? true : false
    }

    async isChat?(contact_id: string): Promise<boolean> {
        const contact: Contact = await this.contactRepository.findOne({ where: { contact_id } })
        return contact.type === "chat" ? true : false
    }

    async getGroupsId(): Promise<string[]> {
        const groupsContact: Contact[] = await this.contactRepository.find({ where: { type: "group" } });
        const groupsName: string[] = groupsContact.map(contact => contact.contact_id);
        return groupsName;
    }

    async loadImage(contact_id: string, image: any[]): Promise<void> {
        try {
            const contact: Contact = await this.findOne(contact_id);
            contact.image['url'] = image;

            // await this.chatRepository.save(contact);
        } catch (error) {
            console.log(error);
        }
    }
}