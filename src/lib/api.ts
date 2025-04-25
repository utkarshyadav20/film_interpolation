// This is a mock API service that would normally communicate with a backend
// In a real implementation, this would send the images to a server running the Python script

import useSWR from "swr";

interface VideoResponse {
  url: string
  id: string
}

export async function generateTransitionVideo(image1: File, image2: File): Promise<VideoResponse> {
  // In a real implementation, we would:
  // 1. Create a FormData object and append the images
  // 2. Send a POST request to our backend API
  // 3. The backend would run the Python script with TensorFlow
  // 4. The backend would store the video in localStorage and return the URL
  const { data: videoUrl, mutate: vide1Mutate } = useSWR("/api/video");

  const formData = new FormData()
  formData.append("image1", image1)
  formData.append("image2", image2)

  try {
    const response = await fetch("/api/generateVideo", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Upload failed");
    }

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    
    vide1Mutate("/api/video");
    console.log(videoUrl);
  } catch (error) {
    console.error("Upload failed:", error);
  }

 

  return { url: videoUrl, id: "generated-video-" + Date.now() }
}

