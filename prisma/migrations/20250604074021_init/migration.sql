-- CreateTable
CREATE TABLE "NewPost" (
    "id" TEXT NOT NULL,
    "postTitle" TEXT NOT NULL DEFAULT '',
    "audience" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "readability" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "tags" TEXT[],
    "files" TEXT[],
    "author" TEXT NOT NULL,
    "authorAvatarURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewPost_id_key" ON "NewPost"("id");
