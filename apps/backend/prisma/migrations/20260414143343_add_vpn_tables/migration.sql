-- CreateTable
CREATE TABLE "vpn_servers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "comingSoon" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vpn_servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vpn_user_keys" (
    "userId" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "serverId" TEXT,

    CONSTRAINT "vpn_user_keys_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "vpn_user_keys" ADD CONSTRAINT "vpn_user_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vpn_user_keys" ADD CONSTRAINT "vpn_user_keys_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "vpn_servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
