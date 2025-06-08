/*
  Warnings:

  - You are about to drop the column `author` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `authorAvatarURL` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "author",
DROP COLUMN "authorAvatarURL";
