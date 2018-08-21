import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Result, Scry } from '../constants';
import { Match } from './match';

@Entity()
export class Game extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'boolean', nullable: true })
    first_turn?: boolean;

    @Column({ type: 'int', nullable: true })
    result?: Result;

    @Column({ type: 'int', nullable: true })
    final_turn?: number;

    @Column({ type: 'boolean', nullable: true })
    sideboarded?: boolean;

    @Column({ type: 'int', nullable: true })
    starting_hand?: number;

    @Column({ type: 'int', nullable: true })
    pre_game_scry?: Scry;

    @Column({ type: 'int', nullable: true })
    opponent_starting_hand?: number;

    @Column({ type: 'int', nullable: true })
    opponent_pre_game_scry?: Scry;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @ManyToOne(type => Match, match => match.games)
    match!: Promise<Match>;
}
