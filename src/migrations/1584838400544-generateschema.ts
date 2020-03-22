import {MigrationInterface, QueryRunner} from "typeorm";

export class generateschema1584838400544 implements MigrationInterface {
    name = 'generateschema1584838400544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`, undefined);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "note" varchar NOT NULL, "userId" integer, "categoryId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "note" varchar NOT NULL, "userId" integer, "categoryId" integer, CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_fa0889ab27ba7dd8a59f9e7065c" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "note", "userId", "categoryId") SELECT "id", "note", "userId", "categoryId" FROM "note"`, undefined);
        await queryRunner.query(`DROP TABLE "note"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`, undefined);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "note" varchar NOT NULL, "userId" integer, "categoryId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "note"("id", "note", "userId", "categoryId") SELECT "id", "note", "userId", "categoryId" FROM "temporary_note"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_note"`, undefined);
        await queryRunner.query(`DROP TABLE "category"`, undefined);
        await queryRunner.query(`DROP TABLE "note"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
