import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { PythonShell } from 'python-shell'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file1 = formData.get('image1') as File
    const file2 = formData.get('image2') as File

    if (!file1 || !file2) {
      return NextResponse.json({ error: 'Both images are required' }, { status: 400 })
    }

    const timestamp = Date.now()
    const uploadDir = path.join(process.cwd(), 'uploads')
    const outputDir = path.join(process.cwd(), 'public')

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

    const filePath1 = path.join(uploadDir, `${timestamp}_1.png`)
    const filePath2 = path.join(uploadDir, `${timestamp}_2.png`)
    const outputPath = path.join(outputDir, `output_${timestamp}.mp4`)
    const publicVideoUrl = `/output_${timestamp}.mp4`

    await fs.promises.writeFile(filePath1, Buffer.from(await file1.arrayBuffer()))
    await fs.promises.writeFile(filePath2, Buffer.from(await file2.arrayBuffer()))

    const options = {
      mode: 'text' as const,
      pythonOptions: ['-u'],
      scriptPath: process.cwd(),
      args: ['-i1', filePath1, '-i2', filePath2, '-o', outputPath],
    }

    const result = await PythonShell.run('film_interpolate2.py', options)

    console.log('Python output:', result)

    if (!fs.existsSync(outputPath)) {
      return NextResponse.json({ error: 'No output file created by script' }, { status: 500 })
    }

    return NextResponse.json({ success: true, videoUrl: publicVideoUrl }, { status: 200 })
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
