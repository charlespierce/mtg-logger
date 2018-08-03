import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Opponent extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', collation: 'NOCASE' })
    name!: string;

    static async findOrCreate(name: string) {
        let opponent = await Opponent.findOne(name);

        if (!opponent) {
            opponent = new Opponent();
            opponent.name = name;

            await opponent.save();
        }

        return opponent;
    }
}
