import { Link, withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import './index.css'

const Navbar = props => {
    const {history} = props

    const onClickLogout = () => {
        localStorage.removeItem('jwt_token')
        history.replace('/login')
    }

    return (
        <nav className="nav-container">
            <Link to="/" className="logo-link-item"> <h1 className="app-name"> Transaction Management </h1> </Link>
            <button type="button" className="logout-btn" onClick={onClickLogout}> Logout </button>
        </nav>
    )
}

export default withRouter(Navbar)