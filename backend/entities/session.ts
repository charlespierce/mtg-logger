import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Archetype } from './archetype';
import { Format } from './format';
import { Match } from './match';

@Entity()
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    title!: string;

    @Column({ type: 'date', nullable: true })
    session_date?: Date;

    @ManyToOne(type => Archetype, { nullable: true })
    archetype?: Archetype;

    @ManyToOne(type => Format, { nullable: true })
    format?: Format;

    @OneToMany(type => Match, match => match.session)
    matches!: Match[];
}
