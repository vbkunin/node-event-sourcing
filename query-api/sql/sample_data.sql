-- Adminer 4.8.1 PostgreSQL 15.1 (Debian 15.1-1.pgdg110+1) dump

INSERT INTO "debt" ("id", "purchase_id", "amount", "remains", "accepted", "creditor_id", "debtor_id")
VALUES ('b42014c3-e103-4b15-8111-2375f6c322f5', '6cc60d28-c89e-42cb-b022-934d530a80b1', '$270.00', '$0.00', 't',
        '274d91c3-8e1b-4fd4-b73a-11c75231beea', '274d91c3-8e1b-4fd4-b73a-11c75231beea'),
       ('e6216d02-2084-4d8c-bf15-d5dc2e163ce9', '6cc60d28-c89e-42cb-b022-934d530a80b1', '$270.00', '$270.00', 'f',
        '274d91c3-8e1b-4fd4-b73a-11c75231beea', '9425c7c0-67fb-4082-b44e-0346b16bf0af'),
       ('a10d61a3-5dfb-4f68-832e-5d2cc53e72e8', '6cc60d28-c89e-42cb-b022-934d530a80b1', '$270.00', '$270.00', 'f',
        '274d91c3-8e1b-4fd4-b73a-11c75231beea', '3afcd653-13dd-49e9-a264-bf409d8a8b80'),
       ('43203caf-fa88-4bf0-8969-382eff46bd20', 'ca642362-6843-40f6-93ad-65f3d9e6b9b5', '$540.00', '$540.00', 'f',
        '9425c7c0-67fb-4082-b44e-0346b16bf0af', '274d91c3-8e1b-4fd4-b73a-11c75231beea'),
       ('16c99ab7-03a7-4de8-8780-f9bad1f3fb94', 'ca642362-6843-40f6-93ad-65f3d9e6b9b5', '$540.00', '$540.00', 'f',
        '9425c7c0-67fb-4082-b44e-0346b16bf0af', '3afcd653-13dd-49e9-a264-bf409d8a8b80');

INSERT INTO "purchase" ("id", "title", "date", "amount", "payer_id")
VALUES ('6cc60d28-c89e-42cb-b022-934d530a80b1', 'Buns with raisins', '2023-01-21 18:44:57.131373', '$890.00',
        '274d91c3-8e1b-4fd4-b73a-11c75231beea'),
       ('ca642362-6843-40f6-93ad-65f3d9e6b9b5', 'Cola and lays', '2023-01-21 18:45:28.338984', '$1,080.00',
        '9425c7c0-67fb-4082-b44e-0346b16bf0af');

INSERT INTO "user" ("id", "username")
VALUES ('274d91c3-8e1b-4fd4-b73a-11c75231beea', 'vladimir'),
       ('9425c7c0-67fb-4082-b44e-0346b16bf0af', 'vadim'),
       ('3afcd653-13dd-49e9-a264-bf409d8a8b80', 'ilya');

-- 2023-01-21 18:54:35.072318+00