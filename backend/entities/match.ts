import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Archetype } from './archetype';
import { Format } from './format';
import { Game } from './game';
import { Opponent } from './opponent';
import { Session } from './session';

@Entity()
export class Match extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @Column({ type: 'date', nullable: true })
    match_date?: Date;

    @ManyToOne(type => Archetype)
    archetype!: Archetype;

    @ManyToOne(type => Archetype)
    opponent_archtype!: Archetype;

    @ManyToOne(type => Format)
    format!: Format;

    @ManyToOne(type => Opponent)
    opponent!: Opponent;

    @ManyToOne(type => Session, session => session.matches)
    session!: Session;

    @OneToMany(type => Game, game => game.match)
    games!: Game[];
}
