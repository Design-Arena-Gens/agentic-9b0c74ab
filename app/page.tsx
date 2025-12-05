'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoGeneration {
  id: string;
  prompt: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  timestamp: number;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generations, setGenerations] = useState<VideoGeneration[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVideo = async () => {
    if (!prompt.trim() || isGenerating) return;

    const newGeneration: VideoGeneration = {
      id: Date.now().toString(),
      prompt: prompt,
      status: 'generating',
      progress: 0,
      timestamp: Date.now(),
    };

    setGenerations(prev => [newGeneration, ...prev]);
    setIsGenerating(true);
    setPrompt('');

    // Simulate video generation with progress updates
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newGeneration.prompt }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));

              setGenerations(prev =>
                prev.map(gen =>
                  gen.id === newGeneration.id
                    ? { ...gen, progress: data.progress, status: data.status, videoUrl: data.videoUrl }
                    : gen
                )
              );
            }
          }
        }
      }
    } catch (error) {
      setGenerations(prev =>
        prev.map(gen =>
          gen.id === newGeneration.id
            ? { ...gen, status: 'failed' }
            : gen
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateVideo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sora-2
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              AI Video Generation
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            Create Videos from Text
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Transform your ideas into stunning videos with advanced AI technology
          </motion.p>
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the video you want to create... (e.g., 'A serene sunset over a mountain lake with birds flying')"
                className="w-full px-6 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none backdrop-blur-sm"
                rows={4}
                disabled={isGenerating}
              />
              <button
                onClick={generateVideo}
                disabled={!prompt.trim() || isGenerating}
                className="absolute bottom-4 right-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 rounded-xl font-semibold transition-all disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span>Generate Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Examples */}
        {generations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-300">Try these examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                'A futuristic city with flying cars at night, neon lights reflecting on wet streets',
                'A majestic dragon soaring through clouds at sunset with golden light',
                'An underwater scene with colorful coral reefs and tropical fish swimming gracefully'
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="p-4 bg-gray-900/50 border border-gray-700 rounded-xl hover:border-purple-500 transition-all text-left text-sm text-gray-300 hover:text-white"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generations Grid */}
        <AnimatePresence>
          {generations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {generations.map((gen) => (
                <motion.div
                  key={gen.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm"
                >
                  <div className="aspect-video bg-gray-800 relative">
                    {gen.status === 'generating' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                          <div className="text-sm text-gray-400">Generating...</div>
                          <div className="text-2xl font-bold text-white mt-2">{gen.progress}%</div>
                        </div>
                      </div>
                    )}
                    {gen.status === 'completed' && gen.videoUrl && (
                      <video
                        src={gen.videoUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    )}
                    {gen.status === 'failed' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-red-400">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <div>Generation failed</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2">{gen.prompt}</p>
                    {gen.status === 'generating' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${gen.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Powered by advanced AI video generation technology</p>
        </div>
      </footer>
    </div>
  );
}
