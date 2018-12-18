import React from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

const Bookshelf = ({ id, title, books, onBookshelfChange }) => {
	return (
		<div className="bookshelf">
			<h2 className="bookshelf-title">{title}</h2>
			<div className="bookshelf-books">
				<ol className="books-grid">
					{books.map(book => (
						<li key={book.id}>
							<Book
								title={book.title}
								authors={book.authors}
								id={book.id}
								image={book.image}
								onBookshelfChange={onBookshelfChange}
								currentBookshelf={id}
							/>
						</li>
					))}
				</ol>
			</div>
		</div>
	)
}

Bookshelf.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	books: PropTypes.array.isRequired,
	onBookshelfChange: PropTypes.func.isRequired
}

export default Bookshelf
