import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1534829861313 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text, "session_date" datetime, "archetype" text COLLATE NOCASE, "format" text COLLATE NOCASE)`);
        await queryRunner.query(`CREATE TABLE "match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "notes" text, "match_date" date, "opponent" text COLLATE NOCASE, "opponent_archetype" text COLLATE NOCASE, "sessionId" integer)`);
        await queryRunner.query(`CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "first_turn" boolean, "result" integer, "final_turn" integer, "sideboarded" boolean, "starting_hand" integer, "pre_game_scry" integer, "opponent_starting_hand" integer, "opponent_pre_game_scry" integer, "notes" text, "matchId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "notes" text, "match_date" date, "opponent" text COLLATE NOCASE, "opponent_archetype" text COLLATE NOCASE, "sessionId" integer, CONSTRAINT "FK_3ea343f1fc35553e9c2c8770c04" FOREIGN KEY ("sessionId") REFERENCES "session" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_match"("id", "notes", "match_date", "opponent", "opponent_archetype", "sessionId") SELECT "id", "notes", "match_date", "opponent", "opponent_archetype", "sessionId" FROM "match"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`ALTER TABLE "temporary_match" RENAME TO "match"`);
        await queryRunner.query(`CREATE TABLE "temporary_game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "first_turn" boolean, "result" integer, "final_turn" integer, "sideboarded" boolean, "starting_hand" integer, "pre_game_scry" integer, "opponent_starting_hand" integer, "opponent_pre_game_scry" integer, "notes" text, "matchId" integer, CONSTRAINT "FK_c502e4de68e3dd7899d7cc071f8" FOREIGN KEY ("matchId") REFERENCES "match" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_game"("id", "first_turn", "result", "final_turn", "sideboarded", "starting_hand", "pre_game_scry", "opponent_starting_hand", "opponent_pre_game_scry", "notes", "matchId") SELECT "id", "first_turn", "result", "final_turn", "sideboarded", "starting_hand", "pre_game_scry", "opponent_starting_hand", "opponent_pre_game_scry", "notes", "matchId" FROM "game"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`ALTER TABLE "temporary_game" RENAME TO "game"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "game" RENAME TO "temporary_game"`);
        await queryRunner.query(`CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "first_turn" boolean, "result" integer, "final_turn" integer, "sideboarded" boolean, "starting_hand" integer, "pre_game_scry" integer, "opponent_starting_hand" integer, "opponent_pre_game_scry" integer, "notes" text, "matchId" integer)`);
        await queryRunner.query(`INSERT INTO "game"("id", "first_turn", "result", "final_turn", "sideboarded", "starting_hand", "pre_game_scry", "opponent_starting_hand", "opponent_pre_game_scry", "notes", "matchId") SELECT "id", "first_turn", "result", "final_turn", "sideboarded", "starting_hand", "pre_game_scry", "opponent_starting_hand", "opponent_pre_game_scry", "notes", "matchId" FROM "temporary_game"`);
        await queryRunner.query(`DROP TABLE "temporary_game"`);
        await queryRunner.query(`ALTER TABLE "match" RENAME TO "temporary_match"`);
        await queryRunner.query(`CREATE TABLE "match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "notes" text, "match_date" date, "opponent" text COLLATE NOCASE, "opponent_archetype" text COLLATE NOCASE, "sessionId" integer)`);
        await queryRunner.query(`INSERT INTO "match"("id", "notes", "match_date", "opponent", "opponent_archetype", "sessionId") SELECT "id", "notes", "match_date", "opponent", "opponent_archetype", "sessionId" FROM "temporary_match"`);
        await queryRunner.query(`DROP TABLE "temporary_match"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
