import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Format extends BaseEntity {
    @PrimaryColumn({ type: 'text', collation: 'NOCASE' })
    name!: string;
}
