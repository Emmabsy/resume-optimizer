import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.toLowerCase();
    let text = '';

    // Parse PDF
    if (filename.endsWith('.pdf')) {
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      text = data.text;
    }
    // Parse Word documents
    else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or Word document.' },
        { status: 400 }
      );
    }

    // Clean up the text
    text = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the file. Please try copy-pasting instead.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });

  } catch (error) {
    console.error('File parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse file. Please try copy-pasting your resume instead.' },
      { status: 500 }
    );
  }
}