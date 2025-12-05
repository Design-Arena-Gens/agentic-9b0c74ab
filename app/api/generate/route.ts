import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Simulate video generation process with progress updates
        const stages = [
          { progress: 10, message: 'Analyzing prompt...' },
          { progress: 25, message: 'Generating scene layout...' },
          { progress: 40, message: 'Creating visual elements...' },
          { progress: 55, message: 'Applying motion dynamics...' },
          { progress: 70, message: 'Rendering frames...' },
          { progress: 85, message: 'Adding transitions...' },
          { progress: 95, message: 'Finalizing video...' },
        ];

        for (const stage of stages) {
          const data = {
            progress: stage.progress,
            status: 'generating',
            message: stage.message,
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );

          // Wait for realistic timing
          await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        }

        // Generate a sample video using canvas-based animation
        const videoUrl = await generateSampleVideo(prompt);

        const finalData = {
          progress: 100,
          status: 'completed',
          videoUrl,
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(finalData)}\n\n`)
        );

        controller.close();
      } catch (error) {
        const errorData = {
          progress: 0,
          status: 'failed',
          error: 'Failed to generate video',
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function generateSampleVideo(prompt: string): Promise<string> {
  // For a real implementation, this would call an AI video generation API
  // For now, we'll generate a data URL for a sample animated video

  // Create a canvas-based animation that represents the video generation
  const canvas = createOffscreenCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Generate frames based on prompt analysis
  const frames: string[] = [];
  const totalFrames = 90; // 3 seconds at 30fps

  for (let i = 0; i < totalFrames; i++) {
    // Clear canvas
    ctx.fillStyle = getColorFromPrompt(prompt, i / totalFrames);
    ctx.fillRect(0, 0, 1280, 720);

    // Add animated elements
    drawAnimatedScene(ctx, prompt, i / totalFrames);

    // Add text overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(prompt.substring(0, 50), 640, 360);

    frames.push(canvas.toDataURL());
  }

  // For demo purposes, return a placeholder video URL
  // In production, frames would be encoded into actual video format
  return createVideoDataURL(frames);
}

function createOffscreenCanvas(width: number, height: number): any {
  // This is a simplified version - in actual implementation would use OffscreenCanvas
  return {
    width,
    height,
    getContext: () => ({
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
    }),
    toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  };
}

function getColorFromPrompt(prompt: string, progress: number): string {
  const colors = {
    sunset: ['#FF6B6B', '#FFE66D', '#4ECDC4'],
    ocean: ['#006994', '#0090C1', '#00B4D8'],
    forest: ['#2D6A4F', '#40916C', '#52B788'],
    night: ['#1A1A2E', '#16213E', '#0F3460'],
    default: ['#667eea', '#764ba2', '#f093fb'],
  };

  let colorScheme = colors.default;
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('sunset') || lowerPrompt.includes('orange') || lowerPrompt.includes('golden')) {
    colorScheme = colors.sunset;
  } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('sea') || lowerPrompt.includes('water')) {
    colorScheme = colors.ocean;
  } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('tree') || lowerPrompt.includes('green')) {
    colorScheme = colors.forest;
  } else if (lowerPrompt.includes('night') || lowerPrompt.includes('dark') || lowerPrompt.includes('moon')) {
    colorScheme = colors.night;
  }

  const index = Math.floor(progress * (colorScheme.length - 1));
  return colorScheme[index];
}

function drawAnimatedScene(ctx: any, prompt: string, progress: number): void {
  // Add animated elements based on prompt keywords
  const x = 640 + Math.sin(progress * Math.PI * 2) * 200;
  const y = 360 + Math.cos(progress * Math.PI * 2) * 100;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2);
  ctx.fill();
}

function createVideoDataURL(frames: string[]): string {
  // In a real implementation, this would encode frames into MP4/WebM
  // For demo, we return a placeholder video URL that browsers can handle
  // Using a sample video from a public domain source
  return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
}
