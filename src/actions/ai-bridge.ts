"use server";

import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuration (Ensure these are in your .env.local)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5 Flash as 'Gemini 3 Flash' isn't standard yet, assuming 1.5 Flash is the target

export async function analyzeActivityPhoto(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        return { success: false, error: "No file provided" };
    }

    try {
        // 1. Convert File to Buffer for Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Upload to Cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "k-billing-activities" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const imageUrl = uploadResult.secure_url;

        // 3. Analyze with Gemini
        // We'll fetch the image bytes again or pass the URL if Gemini supports it directly via URI (usually requires Google Storage URI or base64)
        // For simplicity/robustness, we'll convert the buffer to base64 for Gemini payload.
        const base64Image = buffer.toString('base64');
        const mimeType = file.type;

        const prompt = "Analyze this image. Describe the activity shown, specifically looking for Kumon study activities. Identify if it shows a student studying math or english. Return a short JSON summary: { activity_type: string, mood: string, description: string }";

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: mimeType } }
        ]);

        const response = result.response;
        const text = response.text();

        return {
            success: true,
            imageUrl: imageUrl,
            analysis: text
        };

    } catch (error) {
        console.error("AI Bridge Error:", error);
        return { success: false, error: "AI Processing Failed" };
    }
}
