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

    @Column({ type: 'datetime', nullable: true })
    session_date?: Date;

    @ManyToOne(type => Archetype)
    archetype!: Promise<Archetype>;

    @ManyToOne(type => Format)
    format!: Promise<Format>;

    @OneToMany(type => Match, match => match.session)
    matches!: Promise<Match[]>;
}
