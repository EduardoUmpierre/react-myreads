import React from 'react'
import './App.css'
import * as BooksAPI from './BooksAPI'
import { Route, Link } from 'react-router-dom'
import Bookshelf from './Bookshelf'
import Search from './Search'
import Alert from 'react-s-alert'

import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'

class BooksApp extends React.Component {
	state = {
		bookshelfs: [
			{ id: 'currentlyReading', title: 'Currently Reading', books: [] },
			{ id: 'wantToRead', title: 'Want to Read', books: [] },
			{ id: 'read', title: 'Read', books: [] }
		],
		search: {
			query: '',
			result: [],
			isLoading: false
		},
		isLoading: false
	}

	/**
	 * @description Run after component initialization at DOM
	 */
	async componentDidMount() {
		this.setState({ isLoading: true })

		const books = await BooksAPI.getAll()
		this.loadBooks(books)
	}

	/**
	 * @description Adds all the books to the respective bookshelfs
	 * @param  {} books
	 */
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

		this.setState({ isLoading: false })
	}

	/**
	 * @description Performs the search
	 * @param  {} event
	 */
	search = event => {
		const query = event.target.value
		this.clearSearch()

		if (query.length > 0) {
			// Updates the search isLoading state
			let search = Object.assign({}, this.state.search)
			search.isLoading = true

			this.setState({ search: search })

			BooksAPI.search(query).then(books => {
				// If it is not a empty query result
				if (!books.items) {
					books.map(book => {
						let shelf = this.state.bookshelfs.find(bookshelf =>
							bookshelf.books.find(b => b.id === book.id)
						)

						book.shelf = shelf ? shelf.id : 'none'

						return book
					})
				}

				search.result = books.items || books
				search.isLoading = false

				this.setState({ search: search })
			})
		}
	}

	/**
	 * @description Clear search data
	 */
	clearSearch = () => {
		this.setState({
			search: {
				query: '',
				result: [],
				isLoading: false
			}
		})
	}

	/**
	 * @description Bookshelf change handler
	 * @param  {} event
	 * @param  {} book
	 */
	bookshelfChange = (event, book) => {
		const newBookshelf = event.target.value

		this.addBook(book, newBookshelf)
	}

	/**
	 * @description Generates the alert message
	 * @param  {} book
	 * @param  {} newBookshelf
	 */
	getBookshelfChangeAlertMessage = (book, newBookshelf) => {
		const isNone = newBookshelf === 'none'

		const bookshelf =
			!isNone &&
			this.state.bookshelfs.find(
				bookshelf => bookshelf.id === newBookshelf
			).title

		const action = isNone ? 'removed' : `added to ${bookshelf}`

		return `"${book.title}" ${action}`
	}

	/**
	 * @description Adds a book to a shelf
	 * @param  {} book
	 * @param  {} newBookshelf
	 * @param  {} update=true
	 */
	addBook = (book, newBookshelf, update = true) => {
		let bookshelfs = this.state.bookshelfs

		bookshelfs.map(bookshelf => {
			bookshelf.books = bookshelf.books.filter(b => b.id !== book.id)

			if (bookshelf.id === newBookshelf) {
				bookshelf.books.push(book)
			}

			return bookshelf
		})

		this.updateSearchResultBookshelf(book, newBookshelf)

		// Only updates the API if it's necessary
		if (update) {
			BooksAPI.update(book, newBookshelf)

			Alert.info(
				this.getBookshelfChangeAlertMessage(book, newBookshelf),
				{
					position: 'top-right',
					effect: 'slide'
				}
			)
		}

		this.setState({ bookshelfs: bookshelfs })
	}

	/**
	 * @description Updates the shelf information of the search result's book
	 * @param  {} book
	 * @param  {} newBookshelf
	 */
	updateSearchResultBookshelf = (book, newBookshelf) => {
		let search = Object.assign({}, this.state.search)

		search.result.map(searchBook => {
			if (searchBook.id === book.id) {
				searchBook.shelf = newBookshelf
			}

			return searchBook
		})

		this.setState({
			search: search
		})
	}

	/**
	 * @description Renders the app
	 */
	render() {
		return (
			<div className="app">
				{/* Search component */}
				<Route
					exact
					path="/search"
					render={() => (
						<Search
							search={this.state.search}
							onSearch={this.search}
							onBookshelfChange={this.bookshelfChange}
							onClose={this.clearSearch}
							isLoading={this.state.search.isLoading}
						/>
					)}
				/>

				{/* Home component */}
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
											isLoading={this.state.isLoading}
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

				<Alert stack={{ limit: 3 }} timeout={2000} />
			</div>
		)
	}
}

export default BooksApp
