"use client"

import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react"
import { ParagraphComment } from "@/components/paragraph-comment"
import { useCommentContext } from "@/components/comment-context"
import { Node } from "@tiptap/core"

// Custom extension to replace default Paragraph specific to Reader
import Paragraph from "@tiptap/extension-paragraph"

const ParagraphComponent = (props: any) => {
    const { comments, addComment } = useCommentContext()

    // Identify paragraph index. 
    // In a real app we'd use IDs. 
    // Here we try to get postion or rely on 'data-index' if we injected it.
    // Actually, 'getPos()' is a function available in props.node or props.getPos
    // But getPos return document position (integer).
    // We can treat (getPos) as ID for now, BUT it shifts if content above changes.
    // Read-only mode content doesn't change, so Position is STABLE.
    const pos = typeof props.getPos === 'function' ? props.getPos() : 0

    // Use 'pos' as the key for comments. 
    // Note: Mock data used 0, 1, 2 indices. 
    // Pos will be large numbers (e.g. 0, 50, 200).
    // We need to map simple indices or stick to pos.
    // For restoring the mock functionality which used '0', '1', '2':
    // We should ideally count paragraphs.

    // Better approach: Editor calculates stats.

    const paragraphComments = comments[pos] || []

    return (
        <NodeViewWrapper className="relative group p-1">
            <NodeViewContent as="p" />
            <div className="absolute top-0 right-0 h-full">
                <ParagraphComment
                    paragraphIndex={pos}
                    comments={paragraphComments}
                    onAddComment={addComment}
                />
            </div>
        </NodeViewWrapper>
    )
}

// Extension definition
export const CommentableParagraph = Paragraph.extend({
    addNodeView() {
        return ReactNodeViewRenderer(ParagraphComponent)
    },
})
