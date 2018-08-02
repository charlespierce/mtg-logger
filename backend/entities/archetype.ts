import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Format } from './format';

@Entity()
@Unique(['format', 'name'])
export class Archetype extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', collation: 'NOCASE' })
    name!: string;

    @ManyToOne(type => Format)
    format!: Format;
}
