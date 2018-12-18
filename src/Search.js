import React from 'react'
import { Link } from 'react-router-dom'
import Book from './Book'
import PropTypes from 'prop-types'
import { DebounceInput } from 'react-debounce-input'

const Search = ({ search, onSearch, onBookshelfChange, onClose }) => {
	return (
		<div className="search-books">
			<div className="search-books-bar">
				<Link className="close-search" to="/" onClick={() => onClose()}>
					Close
				</Link>
				<div className="search-books-input-wrapper">
					{/*
                    NOTES: The search from BooksAPI is limited to a particular set of search terms.
                    You can find these search terms here:
                    https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                    However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                    you don't find a specific author or title. Every search is limited by search terms.
                    */}
					<DebounceInput
						minLength={1}
						debounceTimeout={300}
						placeholder="Search by title or author"
						onChange={event => onSearch(event)}
					/>
				</div>
			</div>
			<div className="search-books-results">
				<ol className="books-grid">
					{search.result.map(book => (
						<li key={book.id}>
							<Book
								title={book.title}
								authors={book.authors}
								id={book.id}
								image={
									book.imageLinks && book.imageLinks.thumbnail
								}
								onBookshelfChange={onBookshelfChange}
							/>
						</li>
					))}
				</ol>
			</div>
		</div>
	)
}

Search.propTypes = {
	search: PropTypes.object.isRequired,
	onSearch: PropTypes.func.isRequired,
	onBookshelfChange: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired
}

export default Search
