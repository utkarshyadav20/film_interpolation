"use client"
import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ImageUploader from "@/components/image-uploader"
import VideoPlayer from "@/components/video-player"

export default function Home() {
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [previewUrls, setPreviewUrls] = useState<{
    image1: string | null
    image2: string | null
  }>({
    image1: null,
    image2: null,
  })

  const handleImageUpload = (file: File, imageNumber: 1 | 2) => {
    if (imageNumber === 1) {
      setImage1(file)
      setPreviewUrls((prev) => ({
        ...prev,
        image1: URL.createObjectURL(file),
      }))
    } else {
      setImage2(file)
      setPreviewUrls((prev) => ({
        ...prev,
        image2: URL.createObjectURL(file),
      }))
    }
  }

  const handleGenerateVideo = async () => {
    if (!image1 || !image2) return

    setIsLoading(true)
    setVideoUrl(null)

    const formData = new FormData()
    formData.append("image1", image1)
    formData.append("image2", image2)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Invalid JSON returned from server:", e)
        alert("The server returned an invalid response.");
        setIsLoading(false)
        return;
      }
      if (response.ok) {
        setVideoUrl(data.videoUrl)
      } else {
        console.error("Error generating video:", data.error)
        alert(data.error || "Failed to generate video.")
      }
    } catch (error) {
      console.error("Request failed:", error)
      alert("An error occurred while generating the video.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Image Transition Video Generator</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ImageUploader
          onImageSelected={(file) => handleImageUpload(file, 1)}
          previewUrl={previewUrls.image1}
          label="Upload First Image"
          disabled={isLoading}
        />
        <ImageUploader
          onImageSelected={(file) => handleImageUpload(file, 2)}
          previewUrl={previewUrls.image2}
          label="Upload Second Image"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-center mb-10">
        <Button onClick={handleGenerateVideo} disabled={!image1 || !image2 || isLoading} className="px-6">
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              Generating Video...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Generate Transition Video
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-opacity-20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Creating Your Video</h2>
            <p className="text-muted-foreground text-center max-w-md">
              We're generating a smooth transition between your images. This may take a few moments...
            </p>
          </div>
        </Card>
      ) : videoUrl ? (
        <Card className="p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Generated Video</h2>
          <VideoPlayer videoUrl={videoUrl} />
        </Card>
      ) : null}
    </main>
  )
}

