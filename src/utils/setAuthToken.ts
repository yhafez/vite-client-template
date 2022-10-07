import axios from 'axios'

const setAuthToken = (token: string) => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token
		localStorage.setItem('token', JSON.stringify(token))
	} else {
		delete axios.defaults.headers.common['x-auth-token']
		localStorage.removeItem('token')
	}
}

export default setAuthToken
