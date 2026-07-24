
import { ReaderClient } from "@/components/reader-client"
import { notFound } from "next/navigation"

async function fetchBookAndChapter(bookId: string, chapterId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

    // Fetch Book (to get chapters list and title)
    const bookRes = await fetch(`${API_URL}/books/${bookId}`, { cache: 'no-store' })
    if (!bookRes.ok) return null
    const book = await bookRes.json()

    // Find current chapter
    const currentChapter = book.chapters.find((c: any) => c.id === chapterId)
    if (!currentChapter) return null

    // Sort chapters by order
    const sortedChapters = book.chapters.sort((a: any, b: any) => a.order - b.order)
    const currentIndex = sortedChapters.findIndex((c: any) => c.id === chapterId)

    const previousChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null
    const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null

    return {
      book,
      chapter: currentChapter,
      previousChapter,
      nextChapter,
      sortedChapters
    }
  } catch (error) {
    console.error("Error fetching book/chapter:", error)
    return null
  }
}

export default async function ReaderPage({
  params,
}: {
  params: { bookId: string; chapterId: string }
}) {
  const data = await fetchBookAndChapter(params.bookId, params.chapterId)

  if (!data) {
    notFound()
  }

  const { book, chapter, previousChapter, nextChapter, sortedChapters } = data

  return (
    <ReaderClient
      bookId={book.id}
      chapterId={chapter.id}
      bookTitle={book.title}
      chapterTitle={chapter.title}
      content={chapter.content}
      previousChapterId={previousChapter?.id}
      nextChapterId={nextChapter?.id}
      chapters={sortedChapters}
      bookAuthorId={book.authorId}
    />
  )
}
