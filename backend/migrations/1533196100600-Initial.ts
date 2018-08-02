import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1533196100600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "format" ("name" text PRIMARY KEY COLLATE NOCASE NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "archetype" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text COLLATE NOCASE NOT NULL, "formatName" text COLLATE NOCASE, CONSTRAINT "UQ_6f1594e4e18508302573dbd4812" UNIQUE ("formatName", "name"))`);
        await queryRunner.query(`CREATE TABLE "opponent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text COLLATE NOCASE NOT NULL, CONSTRAINT "UQ_ac6aab8fbe046a72307b2941e60" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "session_date" date, "archetypeId" integer, "formatName" text COLLATE NOCASE)`);
        await queryRunner.query(`CREATE TABLE "match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "notes" text, "match_date" date, "archetypeId" integer, "opponentArchtypeId" integer, "formatName" text COLLATE NOCASE, "opponentId" integer, "sessionId" integer)`);
        await queryRunner.query(`CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "first_turn" boolean, "result" integer, "final_turn" integer, "sideboarded" boolean, "starting_hand" integer, "pre_game_scry" integer, "opponent_starting_hand" integer, "opponent_pre_game_scry" integer, "notes" text, "matchId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_archetype" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text COLLATE NOCASE NOT NULL, "formatName" text COLLATE NOCASE, CONSTRAINT "UQ_6f1594e4e18508302573dbd4812" UNIQUE ("formatName", "name"), CONSTRAINT "FK_ba7b24995b8c9f6b6b9fa924ffb" FOREIGN KEY ("formatName") REFERENCES "format" ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_archetype"("id", "name", "formatName") SELECT "id", "name", "formatName" FROM "archetype"`);
        await queryRunner.query(`DROP TABLE "archetype"`);
        await queryRunner.query(`ALTER TABLE "temporary_archetype" RENAME TO "archetype"`);
        await queryRunner.query(`CREATE TABLE "temporary_session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "session_date" date, "archetypeId" integer, "formatName" text COLLATE NOCASE, CONSTRAINT "FK_5bdc6a78c2a5a0cba646eee27ed" FOREIGN KEY ("archetypeId") REFERENCES "archetype" ("id"), CONSTRAINT "FK_68e8f3671ed51b4695507e536db" FOREIGN KEY ("formatName") REFERENCES "format" ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_session"("id", "title", "session_date", "archetypeId", "formatName") SELECT "id", "title", "session_date", "archetypeId", "formatName" FROM "session"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`ALTER TABLE "temporary_session" RENAME TO "session"`);
        await queryRunner.query(`CREATE TABLE "temporary_match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "notes" text, "match_date" date, "archetypeId" integer, "opponentArchtypeId" integer, "formatName" text COLLATE NOCASE, "opponentId" integer, "sessionId" integer, CONSTRAINT "FK_028e5098774bccbda8bbdf9c37d" FOREIGN KEY ("archetypeId") REFERENCES "archetype" ("id"), CONSTRAINT "FK_375cafc5262f60d838d0c57a4be" FOREIGN KEY ("opponentArchtypeId") REFERENCES "archetype" ("id"), CONSTRAINT "FK_510909a7398029ca9bf86388660" FOREIGN KEY ("formatName") REFERENCES "format" ("name"), CONSTRAINT "FK_7efcae0561c2d0bceb0b0eeff39" FOREIGN KEY ("opponentId") REFERENCES "opponent" ("id"), CONSTRAINT "FK_3ea343f1fc35553e9c2c8770c04" FOREIGN KEY ("sessionId") REFERENCES "session" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_match"("id", "notes", "match_date", "archetypeId", "opponentArchtypeId", "formatName", "opponentId", "sessionId") SELECT "id", "notes", "match_date", "archetypeId", "opponentArchtypeId", "formatName", "opponentId", "sessionId" FROM "match"`);
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
        await queryRunner.query(`CREATE TABLE "match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "notes" text, "match_date" date, "archetypeId" integer, "opponentArchtypeId" integer, "formatName" text COLLATE NOCASE, "opponentId" integer, "sessionId" integer)`);
        await queryRunner.query(`INSERT INTO "match"("id", "notes", "match_date", "archetypeId", "opponentArchtypeId", "formatName", "opponentId", "sessionId") SELECT "id", "notes", "match_date", "archetypeId", "opponentArchtypeId", "formatName", "opponentId", "sessionId" FROM "temporary_match"`);
        await queryRunner.query(`DROP TABLE "temporary_match"`);
        await queryRunner.query(`ALTER TABLE "session" RENAME TO "temporary_session"`);
        await queryRunner.query(`CREATE TABLE "session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "session_date" date, "archetypeId" integer, "formatName" text COLLATE NOCASE)`);
        await queryRunner.query(`INSERT INTO "session"("id", "title", "session_date", "archetypeId", "formatName") SELECT "id", "title", "session_date", "archetypeId", "formatName" FROM "temporary_session"`);
        await queryRunner.query(`DROP TABLE "temporary_session"`);
        await queryRunner.query(`ALTER TABLE "archetype" RENAME TO "temporary_archetype"`);
        await queryRunner.query(`CREATE TABLE "archetype" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text COLLATE NOCASE NOT NULL, "formatName" text COLLATE NOCASE, CONSTRAINT "UQ_6f1594e4e18508302573dbd4812" UNIQUE ("formatName", "name"))`);
        await queryRunner.query(`INSERT INTO "archetype"("id", "name", "formatName") SELECT "id", "name", "formatName" FROM "temporary_archetype"`);
        await queryRunner.query(`DROP TABLE "temporary_archetype"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "opponent"`);
        await queryRunner.query(`DROP TABLE "archetype"`);
        await queryRunner.query(`DROP TABLE "format"`);
    }

}
