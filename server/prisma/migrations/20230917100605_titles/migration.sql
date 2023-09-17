-- CreateTable
CREATE TABLE "titles" (
    "id" UUID NOT NULL,
    "title" STRING NOT NULL,
    "name" STRING NOT NULL,
    "brand" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "titles_title_key" ON "titles"("title");
