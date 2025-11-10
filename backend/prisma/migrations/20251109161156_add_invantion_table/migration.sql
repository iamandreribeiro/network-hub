-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "idIntention" INTEGER NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_idIntention_key" ON "Invitation"("idIntention");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_idIntention_fkey" FOREIGN KEY ("idIntention") REFERENCES "Intention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
