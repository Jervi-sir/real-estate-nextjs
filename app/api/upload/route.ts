import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // ignore if exists
    }

    const filepath = path.join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);
        const url = `/uploads/${filename}`;
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
