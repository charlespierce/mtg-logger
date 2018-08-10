import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Archetype } from './archetype';
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

    @ManyToOne(type => Opponent, { nullable: true })
    opponent!: Promise<Opponent>;

    @ManyToOne(type => Archetype, { nullable: true })
    opponent_archetype!: Promise<Archetype>;

    @ManyToOne(type => Session, session => session.matches)
    session!: Promise<Session>;

    @OneToMany(type => Game, game => game.match)
    games!: Promise<Game[]>;
}
