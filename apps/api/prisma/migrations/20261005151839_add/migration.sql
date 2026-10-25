-- CreateTable
CREATE TABLE "design" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,
    "edges" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "design_userId_updatedAt_idx" ON "design"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "design" ADD CONSTRAINT "design_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
