import Link from "next/link"
import Image from "next/image"
import { Heart, Eye, Star, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getImageUrl } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface BookCardProps {
  id: string
  title: string
  author: string
  cover: string
  likes: number
  reads: number
  comments?: number
  rating: number
  tags?: string[]
  orientation?: "vertical" | "horizontal"
}

export function BookCard({
  id,
  title,
  author,
  cover,
  likes = 0,
  reads = 0,
  comments = 0,
  rating = 0,
  tags = [],
  orientation = "vertical",
}: BookCardProps) {
  if (orientation === "horizontal") {
    return (
      <Link href={`/book/${id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex gap-3 sm:gap-4">
              <div className="relative h-28 w-20 sm:h-32 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image src={cover || "/placeholder.svg"} alt={title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-1">{title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">by {author}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{likes > 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{comments > 1000 ? `${(comments / 1000).toFixed(1)}k` : comments}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{reads > 1000 ? `${(reads / 1000).toFixed(1)}k` : reads}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/book/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={cover || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-2 sm:p-3">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1 leading-tight">{title}</h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2 truncate">by {author}</p>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{likes > 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{comments > 1000 ? `${(comments / 1000).toFixed(1)}k` : comments}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{reads > 1000 ? `${(reads / 1000).toFixed(1)}k` : reads}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
