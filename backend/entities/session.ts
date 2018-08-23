import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from './match';

@Entity()
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: true })
    title?: string;

    @Column({ type: 'datetime', nullable: true })
    session_date?: Date;

    @Column({ type: 'text', nullable: true, collation: 'NOCASE' })
    archetype?: string;

    @Column({ type: 'text', nullable: true, collation: 'NOCASE' })
    format?: string;

    @OneToMany(type => Match, match => match.session)
    matches!: Promise<Match[]>;
}

export type SessionUpdateProperties = 'title' | 'session_date' | 'archetype' | 'format';
