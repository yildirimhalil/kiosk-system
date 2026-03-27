-- CreateTable
CREATE TABLE "BranchOrderCounter" (
    "branchId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BranchOrderCounter_pkey" PRIMARY KEY ("branchId","date")
);

-- AddForeignKey
ALTER TABLE "BranchOrderCounter" ADD CONSTRAINT "BranchOrderCounter_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
