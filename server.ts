import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "Kios Sedekah & Rumah Tahfizh Al-Qur'an" });
});

// AI Assistant endpoint for Islamic guidance, Sembako packages, & Tahfizh information
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });
    }

    const ai = getAiClient();
    const systemInstruction = `Anda adalah "Ustadz Kios Sedekah", asisten kecerdasan buatan ramah, islami, dan edukatif untuk website gabungan Toko Sembako "Kios Sedekah" dan "Rumah Tahfizh Al-Qur'an".

Tugas Anda:
1. Memberikan jawaban yang santun, islami (dengan salam "Assalamu'alaikum", "Bismillah", dsb jika sesuai), serta memberikan saran seputar keberkahan sedekah sembako, zakat, infaq, dan keutamaan memelihara hafalan Al-Qur'an.
2. Membantu pengunjung memilih paket sembako sedekah yang paling cocok dengan anggaran mereka (misal: Paket Sembako Dhuafa, Paket Beras Santri Tahfizh 10kg, Paket Sembako Jumat Berkah).
3. Memberikan informasi seputar program pendaftaran santri baru di Rumah Tahfizh Al-Qur'an, kurikulum hafalan, jadwal harian, dan beasiswa santri yatim/dhuafa.
4. Menghitung estimasi rekomendasi zakat/infaq sembako jika ditanyakan.
5. Menjawab dengan bahasa Indonesia yang jelas, hangat, sejuk, dan terstruktur (menggunakan bullet points jika perlu).`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({
      error: error.message || "Gagal memproses konsultasi AI",
      fallback: "Mohon maaf, layanan konsultasi AI sedang tidak dapat dijangkau. Silakan coba kembali beberapa saat lagi atau hubungi pengurus Kios Sedekah via WhatsApp."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Kios Sedekah running on http://localhost:${PORT}`);
  });
}

startServer();
