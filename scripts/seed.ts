
import { config } from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await db.insert(users).values({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        passwordPlaintext: "admin123",
        role: "ADMIN",
    }).onConflictDoUpdate({
        target: users.email,
        set: {
            password: hashedPassword,
            passwordPlaintext: "admin123",
            role: "ADMIN"
        }
    });

    console.log("Admin user created: admin@example.com / admin123");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
