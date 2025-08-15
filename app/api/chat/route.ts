import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, devices, storageBoxes } = await request.json();

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 }
      );
    }

    // Create context about devices and storage boxes for the AI
    const deviceContext = JSON.stringify(
      devices.map((d: any) => ({
        id: d.id,
        name: d.name,
        category: d.category,
        location: d.location,
        status: d.status,
        notes: d.notes,
        lastMaintenance: d.lastMaintenance,
        storageBox: d.storageBox,
        compartmentNumber: d.compartmentNumber,
      }))
    );

    const boxContext = JSON.stringify(
      storageBoxes.map((b: any) => ({
        id: b.id,
        name: b.name,
        location: b.location,
        compartments: b.compartments,
      }))
    );

    // Generate AI response
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are the AI assistant for Yetnew, a home device management system.
      You help users find information about their devices and tools.

      Here is the current database of devices: ${deviceContext}
      Here is the current database of storage boxes: ${boxContext}

      When answering questions:
      1. If asked about a specific device, check if it exists in the database and provide details.
      2. If asked about devices in a location, filter by that location.
      3. If asked about maintenance, check lastMaintenance dates.
      4. If asked about storage boxes, provide information about the boxes and what devices are stored in them.
      5. If asked about a specific compartment in a box, check which device is stored there.
      6. If asked to add a device, explain how they can use the Add Device button.
      7. If asked to add a storage box, explain how they can use the Storage Boxes button.
  8. Be helpful, concise, and friendly.
  9. Don't make up information about devices that aren't in the database; if information is missing, say so clearly.
  10. If asked about devices needing repair, check for status "needs-repair" or "broken".
  11. When mentioning the app name, always call it "Yetnew".
  12. Use emojis to make responses more engaging and easier to scan; keep them professional and relevant to the content.
  13. When asked to describe a device's function or a storage box's purpose, infer its role from available fields (for example: category, notes, location, status, compartments, lastMaintenance) and state the inferred function concisely plus any suggested actions (maintenance, storage, or next steps). If you aren't confident, say you are unsure rather than invent details.
  14. If the user mentions a unique device or box that is not present in the provided database, clearly state that it's missing and explain how they can add it (for example, by using the Add Device or Storage Boxes buttons). Optionally provide a minimal example payload they could use to add the item.`,
      prompt: message,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
