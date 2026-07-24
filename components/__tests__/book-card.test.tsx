import React from 'react'
import { render, screen } from '@testing-library/react'
import { BookCard } from '../book-card'

jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    }
});

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />
    },
}))

describe('BookCard', () => {
    const defaultProps = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        cover: '/cover.jpg',
        likes: 10,
        reads: 100,
        rating: 4.5,
    }

    it('renders book title and author', () => {
        render(<BookCard {...defaultProps} />)

        expect(screen.getByText('Test Book')).toBeInTheDocument()
        expect(screen.getByText(/Test Author/i)).toBeInTheDocument()
    })

    it('renders stats correctly', () => {
        render(<BookCard {...defaultProps} />)

        expect(screen.getByText('10')).toBeInTheDocument() // Likes
        expect(screen.getByText('100')).toBeInTheDocument() // Reads
        expect(screen.getByText('4.5')).toBeInTheDocument() // Rating
    })
})
