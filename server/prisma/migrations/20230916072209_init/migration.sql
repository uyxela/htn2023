-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordHash" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
