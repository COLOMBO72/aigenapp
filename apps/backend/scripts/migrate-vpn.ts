import Database from 'better-sqlite3';
import { prisma } from '../src/lib/prisma.js';
import dotenv from 'dotenv';

dotenv.config();

const SQLITE_PATH = '/opt/selfvpn/data/selfvpn.db';

async function migrate() {
  console.log('🚀 Начинаем миграцию данных из SQLite в PostgreSQL...');

  // Подключаемся к SQLite
  const sqlite = new Database(SQLITE_PATH);

  // ─── Мигрируем пользователей ──────────────────────────────────
  const users = sqlite.prepare('SELECT * FROM users').all() as any[];
  console.log(`👥 Найдено ${users.length} пользователей`);

  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          username: user.email.split('@')[0],
          passwordHash: user.passwordHash,
          plan: user.plan === 'premium' ? 'PREMIUM' : 'FREE',
          createdAt: new Date(user.createdAt),
        },
      });
      console.log(`✅ Пользователь: ${user.email}`);
    } catch (error) {
      console.log(`⚠️ Пропускаем ${user.email}:`, error);
    }
  }

  // ─── Мигрируем серверы ────────────────────────────────────────
  const servers = sqlite.prepare('SELECT * FROM servers').all() as any[];
  console.log(`🖥️ Найдено ${servers.length} серверов`);

  for (const server of servers) {
    try {
      await prisma.vpnServer.upsert({
        where: { id: server.id },
        update: {},
        create: {
          id: server.id,
          name: server.name,
          country: server.country,
          flag: server.flag,
          endpoint: server.endpoint,
          publicKey: server.publicKey,
          isPremium: server.isPremium === 1,
          isActive: server.isActive === 1,
          comingSoon: server.comingSoon === 1,
        },
      });
      console.log(`✅ Сервер: ${server.name}`);
    } catch (error) {
      console.log(`⚠️ Пропускаем сервер ${server.id}:`, error);
    }
  }

  // ─── Мигрируем ключи пользователей ───────────────────────────
  const keys = sqlite.prepare('SELECT * FROM user_keys').all() as any[];
  console.log(`🔑 Найдено ${keys.length} ключей`);

  for (const key of keys) {
    try {
      await prisma.vpnUserKey.upsert({
        where: { userId: key.userId },
        update: {},
        create: {
          userId: key.userId,
          privateKey: key.privateKey,
          publicKey: key.publicKey,
        },
      });
      console.log(`✅ Ключи для: ${key.userId}`);
    } catch (error) {
      console.log(`⚠️ Пропускаем ключи ${key.userId}:`, error);
    }
  }

  console.log('🎉 Миграция завершена!');
  await prisma.$disconnect();
  sqlite.close();
}

migrate().catch(console.error);
