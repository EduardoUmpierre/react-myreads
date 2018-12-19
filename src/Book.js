import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Book extends PureComponent {
	render() {
		const {
			id,
			title,
			authors,
			image,
			onBookshelfChange,
			currentBookshelf
		} = this.props

		return (
			<div className="book">
				<div className="book-top">
					<div
						className="book-cover"
						style={{
							width: 128,
							height: 193,
							backgroundImage: `url("${image}")`
						}}
					/>
					<div className="book-shelf-changer">
						<select
							onChange={event =>
								onBookshelfChange(event, {
									id,
									title,
									authors,
									image
								})
							}
							value={currentBookshelf ? currentBookshelf : 'none'}
						>
							<option value="move" disabled>
								Move to...
							</option>
							<option value="currentlyReading">
								Currently Reading
							</option>
							<option value="wantToRead">Want to Read</option>
							<option value="read">Read</option>
							<option value="none">None</option>
						</select>
					</div>
				</div>
				<div className="book-title">{title}</div>

				{authors && (
					<div className="book-authors">
						{authors.map((author, index) => (
							<div key={index}>
								{author}
								{index < authors.length - 1 && ', '}
							</div>
						))}
					</div>
				)}
			</div>
		)
	}
}

Book.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	authors: PropTypes.array,
	image: PropTypes.string,
	onBookshelfChange: PropTypes.func.isRequired,
	currentBookshelf: PropTypes.string
}

export default Book
