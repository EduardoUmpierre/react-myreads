import React from 'react'
import './App.css'
import * as BooksAPI from './BooksAPI'
import { Route, Link } from 'react-router-dom'
import Bookshelf from './Bookshelf'
import Search from './Search'

class BooksApp extends React.Component {
	state = {
		bookshelfs: [
			{ id: 'currentlyReading', title: 'Currently Reading', books: [] },
			{ id: 'wantToRead', title: 'Want to Read', books: [] },
			{ id: 'read', title: 'Read', books: [] }
		],
		search: {
			query: '',
			result: []
		}
	}

	componentDidMount() {
		BooksAPI.getAll().then(books => {
			this.loadBooks(books)
		})
	}

	loadBooks = books => {
		books.forEach(({ id, title, authors, imageLinks, shelf }) => {
			const newBook = {
				id,
				title,
				authors,
				image: imageLinks.thumbnail
			}

			this.addBook(newBook, shelf, false)
		})
	}

	search = event => {
		const query = event.target.value
		this.clearSearch()

		if (query.length > 0) {
			BooksAPI.search(query).then(books => {
				let search = Object.assign({}, this.state.search)
				search.result = books.items || books

				this.setState({ search: search })
			})
		}
	}

	clearSearch = () => {
		this.setState({
			search: {
				query: '',
				result: []
			}
		})
	}

	bookshelfChange = (event, book) => {
		const newBookshelf = event.target.value

		this.addBook(book, newBookshelf)
	}

	addBook = (book, newBookshelf, update = true) => {
		let bookshelfs = this.state.bookshelfs

		bookshelfs.map(bookshelf => {
			bookshelf.books = bookshelf.books.filter(b => b.id !== book.id)

			if (bookshelf.id === newBookshelf) {
				bookshelf.books.push(book)

				if (update) {
					BooksAPI.update(book, newBookshelf)
				}
			}

			return bookshelf
		})

		this.setState({ bookshelfs: bookshelfs })
	}

	render() {
		return (
			<div className="app">
				<Route
					exact
					path="/search"
					render={() => (
						<Search
							search={this.state.search}
							onSearch={this.search}
							onBookshelfChange={this.bookshelfChange}
							bookshelfs={this.state.bookshelfs}
							onClose={this.clearSearch}
						/>
					)}
				/>

				<Route
					exact
					path="/"
					render={() => (
						<div className="list-books">
							<div className="list-books-title">
								<h1>MyReads</h1>
							</div>
							<div className="list-books-content">
								<div>
									{this.state.bookshelfs.map(bookshelf => (
										<Bookshelf
											key={bookshelf.id}
											id={bookshelf.id}
											title={bookshelf.title}
											books={bookshelf.books}
											onBookshelfChange={
												this.bookshelfChange
											}
										/>
									))}
								</div>
							</div>
							<div className="open-search">
								<Link to="/search">Add a book</Link>
							</div>
						</div>
					)}
				/>
			</div>
		)
	}
}

export default BooksApp
