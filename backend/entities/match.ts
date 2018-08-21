import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Game } from './game';
import { Session } from './session';

@Entity()
export class Match extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @Column({ type: 'date', nullable: true })
    match_date?: Date;

    @Column({ type: 'text', nullable: true, collation: 'NOCASE' })
    opponent?: string;

    @Column({ type: 'text', nullable: true, collation: 'NOCASE' })
    opponent_archetype?: string;

    @ManyToOne(type => Session, session => session.matches)
    session!: Promise<Session>;

    @OneToMany(type => Game, game => game.match)
    games!: Promise<Game[]>;
}
