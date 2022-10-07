import { render } from '@testing-library/react'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store'

describe('App', () => {
	it('should work as expected', () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<App />
				</MemoryRouter>
			</Provider>,
		)
	})
})
