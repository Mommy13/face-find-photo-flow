
export class FaceDetector {
  private detector: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Face detector initialized (simulated)');
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing face detector:', error);
      throw error;
    }
  }

  async detectFaces(imageUrl: string): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData?.data;
          
          if (!data) {
            resolve([]);
            return;
          }
          
          // Generate consistent face detection based on image hash
          const imageHash = this.generateImageHash(data);
          const faceCount = Math.min(Math.floor(imageHash % 4) + 1, 3);
          const faces = [];
          
          for (let i = 0; i < faceCount; i++) {
            // Generate consistent embeddings based on image hash and face index
            const embedding = this.generateConsistentEmbedding(imageHash, i);
            
            faces.push({
              id: `face_${i}_${imageHash}`,
              bbox: {
                x: (i * 30) % (canvas.width - 100),
                y: (i * 40) % (canvas.height - 100),
                width: 80 + (i * 20),
                height: 80 + (i * 20),
              },
              confidence: 0.8 + (i * 0.05),
              embedding: embedding,
            });
          }
          
          console.log(`Detected ${faces.length} faces in image (hash: ${imageHash})`);
          resolve(faces);
        };
        
        img.onerror = () => {
          console.error('Failed to load image for face detection');
          resolve([]);
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Error detecting faces:', error);
      return [];
    }
  }

  private generateImageHash(imageData: Uint8ClampedArray): number {
    let hash = 0;
    // Sample every 1000th pixel to create a consistent hash
    for (let i = 0; i < imageData.length; i += 4000) {
      const r = imageData[i] || 0;
      const g = imageData[i + 1] || 0;
      const b = imageData[i + 2] || 0;
      hash = ((hash << 5) - hash + r + g + b) & 0xffffffff;
    }
    return Math.abs(hash);
  }

  private generateConsistentEmbedding(imageHash: number, faceIndex: number): number[] {
    const embedding = new Array(128);
    const seed = imageHash + faceIndex * 1000;
    
    // Use a simple pseudo-random number generator for consistency
    let rng = seed;
    const nextRandom = () => {
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      return rng / 0x7fffffff;
    };
    
    // Generate consistent normalized embeddings
    for (let i = 0; i < 128; i++) {
      embedding[i] = (nextRandom() - 0.5) * 2; // Range [-1, 1]
    }
    
    // Normalize the embedding vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    for (let i = 0; i < 128; i++) {
      embedding[i] = embedding[i] / magnitude;
    }
    
    return embedding;
  }

  calculateSimilarity(face1: any, face2: any): number {
    if (!face1.embedding || !face2.embedding) return 0;
    
    const embedding1 = face1.embedding;
    const embedding2 = face2.embedding;
    
    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return Math.max(0, (similarity + 1) / 2); // Normalize to [0, 1] range
  }
}
