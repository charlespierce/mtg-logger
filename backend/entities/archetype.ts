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
    format!: Promise<Format>;

    static async findOrCreate(format: Format, name: string) {
        let archetype = await Archetype.findOne({ where: { format, name }});

        if (!archetype) {
            archetype = new Archetype();
            archetype.name = name;
            archetype.format = Promise.resolve(format);

            await archetype.save();
        }

        return archetype;
    }
}
