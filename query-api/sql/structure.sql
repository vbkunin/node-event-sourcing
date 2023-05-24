-- Adminer 4.8.1 PostgreSQL 15.1 (Debian 15.1-1.pgdg110+1) dump

\connect "bwr";

CREATE TABLE "public"."debt"
(
    "id"          uuid    DEFAULT gen_random_uuid() NOT NULL,
    "purchase_id" uuid                              NOT NULL,
    "amount"      money                             NOT NULL,
    "remains"     money                             NOT NULL,
    "accepted"    boolean DEFAULT false             NOT NULL,
    "creditor_id" uuid                              NOT NULL,
    "debtor_id"   uuid                              NOT NULL,
    CONSTRAINT "debt_id" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "debt_creditor_id" ON "public"."debt" USING btree ("creditor_id");

CREATE INDEX "debt_debtor_id" ON "public"."debt" USING btree ("debtor_id");

CREATE INDEX "debt_purchase_id" ON "public"."debt" USING btree ("purchase_id");


CREATE TABLE "public"."purchase"
(
    "id"       uuid DEFAULT gen_random_uuid() NOT NULL,
    "title"    text                           NOT NULL,
    "date"     timestamp                      NOT NULL,
    "amount"   money                          NOT NULL,
    "payer_id" uuid                           NOT NULL,
    CONSTRAINT "purchase_id" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "purchase_payer_id" ON "public"."purchase" USING btree ("payer_id");


CREATE TABLE "public"."user"
(
    "id"       uuid DEFAULT gen_random_uuid() NOT NULL,
    "username" text                           NOT NULL,
    CONSTRAINT "user_id" PRIMARY KEY ("id"),
    CONSTRAINT "user_username" UNIQUE ("username")
) WITH (oids = false);


ALTER TABLE ONLY "public"."debt"
    ADD CONSTRAINT "debt_creditor_id_fkey" FOREIGN KEY (creditor_id) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."debt"
    ADD CONSTRAINT "debt_debtor_id_fkey" FOREIGN KEY (debtor_id) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."debt"
    ADD CONSTRAINT "debt_purchase_id_fkey" FOREIGN KEY (purchase_id) REFERENCES purchase (id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."purchase"
    ADD CONSTRAINT "purchase_payer_id_fkey" FOREIGN KEY (payer_id) REFERENCES "user" (id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

-- 2023-01-21 18:55:49.539835+00