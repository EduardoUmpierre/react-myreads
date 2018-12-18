import React from 'react'
import { ClipLoader } from 'react-spinners'

const Loader = ({ isLoading }) => {
	return (
		<ClipLoader
			className={`display: block !important; margin: 0 auto;`}
			sizeUnit={'px'}
			size={40}
			color={'#60ac5d'}
			loading={isLoading}
		/>
	)
}

export default Loader
